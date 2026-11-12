import { useEffect, useState } from 'react';
import { xinMa, xacMinh, luuToken } from '../api.js';
import { cheSdt } from '../dinhDang.js';
import { buocSauXinMa, buocSauLoiXacMinh, duDieuKienHoanTat, truongThem } from '../luongDangNhap.js';
import { XUNG_HO, DIA_CHI_TOI_DA, GIAY_CHO_GUI_LAI, loiMa } from '../noiDung/dangNhap.js';
import { nd, ndPhan, ndAnh, ndDau } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
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
      khiXong(r.khach); // hồ sơ POS trả (có sdt) → App biết khách là ai TRƯỚC khi bật phiên
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
        <div className="dn-hd"><button type="button" className="back-btn" aria-label={nd('dn.dong')} onClick={dong}><Ico ten="close" s={18} /></button></div>
      )}
      <div className="dn-dau">
        <img className="dn-logo" src={ndAnh('dn.logo')} alt={nd('brand.ten')} {...ndDau('dn.logo')} />
        <Chu k={buoc === 'sdt' ? 'dn.sdt.t' : buoc === 'ma' ? 'dn.ma.t' : 'dn.tt.t'} as="h1" />
      </div>
      {coMaHoaDon && buoc === 'sdt' && <Chu k="dn.maHoaDon" as="div" className="dn-ma-hoadon" />}
      <div className="card pf-card">
        {buoc === 'sdt' && (
          <>
            <div className="pf-row">
              <Chu k="dn.sdt.nhan" as="label" htmlFor="sdt" />
              <input id="sdt" type="tel" inputMode="tel" autoComplete="tel" value={sdt} onChange={(e) => datSdt(e.target.value)} />
            </div>
            <Chu k="dn.sdt.phu" as="div" className="dn-phu" />
            <button type="button" className="checkout-btn giua" disabled={dang || !sdt.trim()} onClick={xinMaMoi} {...ndDau('dn.sdt.nut')}>{nd('dn.sdt.nut')}</button>
          </>
        )}
        {buoc === 'ma' && (
          <>
            <div className="otp-s" {...ndDau(taiQuay ? 'dn.ma.quay' : cheSdt(sdt) ? 'dn.ma.zalo' : 'dn.ma.zaloChung')}>{loiMa(taiQuay, sdt)}</div>
            <input className="otp-in" id="ma" aria-label={nd('dn.ma.aria')} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={ma} onChange={(e) => datMa(e.target.value.replace(/\D/g, ''))} />
            {hetHan && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><Chu k="dn.ma.hetHan" as="div" /></div>}
            <button type="button" className="checkout-btn giua" disabled={dang || ma.trim().length < 6} onClick={xacNhan} {...ndDau('dn.ma.nut')}>{nd('dn.ma.nut')}</button>
            <div className="otp-re">
              {choGuiLai ? <b {...bam(xinMaMoi)} {...ndDau('dn.ma.guiLai')}>{nd('dn.ma.guiLai')}</b> : <span {...ndDau('dn.ma.guiLaiSau')}>{nd('dn.ma.guiLai')}{ndPhan('dn.ma.guiLaiSau', { giay: conLai })}</span>}
              {' · '}<b {...bam(veBuoc1)} {...ndDau('dn.ma.doiSo')}>{nd('dn.ma.doiSo')}</b>
            </div>
          </>
        )}
        {buoc === 'thongtin' && (
          <>
            <div className="pf-row">
              <Chu k="dn.tt.ten" as="label" htmlFor="ten" />
              <input id="ten" autoComplete="name" value={ten} onChange={(e) => datTen(e.target.value)} />
            </div>
            <div className="pf-row">
              <Chu k="dn.tt.xh" as="label" />
              <div className="xh-hang" {...ndDau('dn.xh.chu')}>
                {XUNG_HO.map((x) => <button key={x.ma} type="button" className={`xh${xungHo === x.ma ? ' on' : ''}`} aria-pressed={xungHo === x.ma} onClick={() => datXungHo(x.ma)}>{x.ten}</button>)}
              </div>
            </div>
            <div className="pf-row">
              <Chu k="dn.tt.dc" as="label" htmlFor="dia-chi" />
              <input id="dia-chi" autoComplete="street-address" maxLength={DIA_CHI_TOI_DA} value={diaChi} onChange={(e) => datDiaChi(e.target.value)} />
              <Chu k="dn.tt.dcGhiChu" as="small" />
            </div>
            {hetHan && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><Chu k="dn.ma.hetHan" as="div" /></div>}
            {hetHan
              ? <button type="button" className="checkout-btn giua" disabled={dang} onClick={xinMaMoi} {...ndDau('dn.ma.guiLai')}>{nd('dn.ma.guiLai')}</button>
              : <button type="button" className="checkout-btn giua" disabled={dang || !hoanTatDuoc} onClick={xacNhan} {...ndDau('dn.tt.nut')}>{nd('dn.tt.nut')}</button>}
            <div className="otp-re"><b {...bam(veBuoc1)} {...ndDau('dn.tt.quayLai')}>{nd('dn.tt.quayLai')}</b></div>
          </>
        )}
        {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau('dn.loi')}>{loi}</div></div>}
      </div>
    </Man>
  );
}
