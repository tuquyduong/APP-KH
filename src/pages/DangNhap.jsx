import { useEffect, useState } from 'react';
import { xinMa, xacMinh, luuToken } from '../api.js';
import { buocSauXinMa, buocSauLoiXacMinh, duDieuKienHoanTat, truongThem } from '../luongDangNhap.js';
import { XUNG_HO, DIA_CHI_TOI_DA, GIAY_CHO_GUI_LAI, BUOC_SDT, BUOC_MA, BUOC_THONG_TIN, DONG_MA_HOA_DON, loiMa } from '../noiDung/dangNhap.js';
import Man from '../components/Man.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';

// Đăng nhập / đăng ký, mỗi bước một việc: (1) SĐT → (2) mã 6 số → (3) "Thông tin của bạn" chỉ khi khách MỚI (POS trả CAN_TEN).
// Luôn là màn con: ✕ / nút Back quay về chỗ cũ (bước 3 không có ✕ — đã xác minh thì hoàn tất hoặc quay lại bước 1). Demo chưa có màn này:
// dựng bằng khối của demo (pf-card, otp-in, checkout-btn, nt-state).
export default function DangNhap({ khiXong, dong, coMaHoaDon }) {
  const [sdt, datSdt] = useState('');
  const [ma, datMa] = useState('');
  const [ten, datTen] = useState('');
  const [xungHo, datXungHo] = useState('');
  const [diaChi, datDiaChi] = useState('');
  const [buoc, datBuoc] = useState('sdt');
  const [taiQuay, datTaiQuay] = useState(false);
  const [hetHan, datHetHan] = useState(false);
  const [conLai, datConLai] = useState(0); // giây còn lại tới khi "Gửi lại mã" mở
  const [dang, datDang] = useState(false);
  const [loi, datLoi] = useState('');

  useEffect(() => {
    if (conLai <= 0) return undefined;
    const h = setTimeout(() => datConLai((c) => c - 1), 1000);
    return () => clearTimeout(h);
  }, [conLai]);

  async function lam(viec) {
    datDang(true); datLoi('');
    try { await viec(); } catch (e) { datLoi(e.message); } finally { datDang(false); }
  }

  const xinMaMoi = () => lam(async () => {
    const r = buocSauXinMa(await xinMa(sdt.trim()));
    datTaiQuay(r.taiQuay); datBuoc(r.buoc); datMa(''); datHetHan(false); datConLai(GIAY_CHO_GUI_LAI);
  });

  // Gửi mã (bước 2) hoặc gửi kèm tên (bước 3): cùng cửa xac-minh.
  const xacNhan = () => lam(async () => {
    try {
      const r = await xacMinh(sdt.trim(), ma.trim(), buoc === 'thongtin' ? ten.trim() : undefined, buoc === 'thongtin' ? truongThem(xungHo, diaChi) : undefined);
      luuToken(r.token);
      khiXong();
    } catch (e) {
      const kq = buocSauLoiXacMinh(e, buoc);
      datBuoc(kq.buoc); datHetHan(kq.hetHan);
      if (kq.buoc !== buoc || kq.hetHan) { datLoi(''); return; } // CAN_TEN / hết hạn: đã có chỗ báo riêng, KHÔNG xoá chữ khách đã nhập
      throw e;
    }
  });

  const veBuoc1 = () => { datBuoc('sdt'); datMa(''); datLoi(''); datHetHan(false); datConLai(0); };
  const choGuiLai = hetHan || conLai <= 0;
  const hoanTatDuoc = duDieuKienHoanTat({ ten, xungHo });

  return (
    <Man id="login">
      {buoc !== 'thongtin' && (
        <div className="dn-hd"><button type="button" className="back-btn" aria-label="Đóng" onClick={dong}><Ico ten="close" s={18} /></button></div>
      )}
      <div className="dn-dau">
        <img className="dn-logo" src="/anh/logo.webp" alt="Tứ Quý Đường" />
        <h1>{buoc === 'sdt' ? BUOC_SDT.tieuDe : buoc === 'ma' ? BUOC_MA.tieuDe : BUOC_THONG_TIN.tieuDe}</h1>
      </div>
      {coMaHoaDon && buoc === 'sdt' && <div className="dn-ma-hoadon">{DONG_MA_HOA_DON}</div>}
      <div className="card pf-card">
        {buoc === 'sdt' && (
          <>
            <div className="pf-row">
              <label htmlFor="sdt">Số điện thoại</label>
              <input id="sdt" type="tel" inputMode="tel" autoComplete="tel" value={sdt} onChange={(e) => datSdt(e.target.value)} />
            </div>
            <div className="dn-phu">{BUOC_SDT.phu}</div>
            <button type="button" className="checkout-btn giua" disabled={dang || !sdt.trim()} onClick={xinMaMoi}>{BUOC_SDT.nut}</button>
          </>
        )}
        {buoc === 'ma' && (
          <>
            <div className="otp-s">{loiMa(taiQuay, sdt)}</div>
            <input className="otp-in" id="ma" aria-label="Mã đăng nhập" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={ma} onChange={(e) => datMa(e.target.value.replace(/\D/g, ''))} />
            {hetHan && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{BUOC_MA.hetHan}</div></div>}
            <button type="button" className="checkout-btn giua" disabled={dang || ma.trim().length < 6} onClick={xacNhan}>{BUOC_MA.nut}</button>
            <div className="otp-re">
              {choGuiLai ? <b {...bam(xinMaMoi)}>{BUOC_MA.guiLai}</b> : <span>{BUOC_MA.guiLai} sau {conLai} giây</span>}
              {' · '}<b {...bam(veBuoc1)}>{BUOC_MA.doiSo}</b>
            </div>
          </>
        )}
        {buoc === 'thongtin' && (
          <>
            <div className="pf-row">
              <label htmlFor="ten">{BUOC_THONG_TIN.ten}</label>
              <input id="ten" autoComplete="name" value={ten} onChange={(e) => datTen(e.target.value)} />
            </div>
            <div className="pf-row">
              <label>{BUOC_THONG_TIN.xungHo}</label>
              <div className="xh-hang">
                {XUNG_HO.map((x) => <button key={x.ma} type="button" className={`xh${xungHo === x.ma ? ' on' : ''}`} aria-pressed={xungHo === x.ma} onClick={() => datXungHo(x.ma)}>{x.ten}</button>)}
              </div>
            </div>
            <div className="pf-row">
              <label htmlFor="dia-chi">{BUOC_THONG_TIN.diaChi}</label>
              <input id="dia-chi" autoComplete="street-address" maxLength={DIA_CHI_TOI_DA} value={diaChi} onChange={(e) => datDiaChi(e.target.value)} />
              <small>{BUOC_THONG_TIN.ghiChuDiaChi}</small>
            </div>
            {hetHan && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{BUOC_MA.hetHan}</div></div>}
            {hetHan
              ? <button type="button" className="checkout-btn giua" disabled={dang} onClick={xinMaMoi}>{BUOC_MA.guiLai}</button>
              : <button type="button" className="checkout-btn giua" disabled={dang || !hoanTatDuoc} onClick={xacNhan}>{BUOC_THONG_TIN.nut}</button>}
            <div className="otp-re"><b {...bam(veBuoc1)}>{BUOC_THONG_TIN.quayLai}</b></div>
          </>
        )}
        {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loi}</div></div>}
      </div>
    </Man>
  );
}
