import { useEffect, useState } from 'react';
import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { nd, ndDau, ndPhan } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import { bayGio } from '../bayGio.js';
import { banGhiCuaDon, buocTienTrinh, conLaiQR, huyDon, xongChua } from '../datDon.js';
import { dungTheoDoi } from '../dungDatDon.js';
import { docHoaDon, soDon } from '../hoaDon.js';
import { LIEN_HE } from '../noiDung/lienHe.js';
import Man, { DauManCon } from '../components/Man.jsx';
import { KhungLoi } from '../components/TrangTai.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import HoaDonKhach from '../components/HoaDonKhach.jsx';
import TheQR from '../components/TheQR.jsx';

// Theo dõi đơn theo demo (tracking), đường dẫn /don/<ma>. Đơn chờ trả: QR lấy từ GET /don/:ma (tải lại / máy khác vẫn thấy), đếm ngược tới het_han
// theo "bây giờ" của POS, hỏi trạng thái mỗi 3 giây; hết hạn → "Tạo mã mới" / "Huỷ đơn". Số giữ ví / QR còn lại: `cach_tra`, `giu_vi`, `con_lai` của
// GET /don/:ma (v7 — tải lại / máy khác vẫn đúng; đơn quầy null → không dòng ví); POS chưa trả các trường đó → bản ghi lần gửi trên máy này (kh_don_gui),
// không có thì ẩn dòng ví và số cạnh QR (không hiện tổng sai cho đơn ví + QR). App không tự tính số nào.
// Đã trả: số đơn to để đọc cho nhân viên + các bước tien_trinh, hỏi lại mỗi 10 giây tới khi xong. Bản đồ / tài xế: KH-MUA-2.
const dongHo = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function TraQR({ qr, soTra, soHd, taoMaMoi, dang }) {
  const [, ve] = useState(0);
  useEffect(() => { const id = setInterval(() => ve((x) => x + 1), 1000); return () => clearInterval(id); }, []);
  const con = conLaiQR(qr.hetHan, bayGio());
  if (con === 0) {
    return (
      <>
        <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><Chu k="td.qr.hetHan" as="div" /></div>
        <button type="button" className={`checkout-btn${dang ? ' btn-disabled' : ''}`} onClick={dang ? undefined : taoMaMoi}><Chu k="td.qr.taoMoi" /><span>→</span></button>
      </>
    );
  }
  return (
    <>
      <TheQR chuoi={qr.chuoi} soTien={soTra} soHd={soHd} />
      <div className="care-disclaimer qr-chu" {...ndDau('td.qr.quet')}>{nd('td.qr.quet')}{soTra !== null && <> <b {...ndDau('td.tien')}>{dinhDangGia(soTra)}</b></>}{con !== null && <><span {...ndDau('td.qr.con')}>{` · ${nd('td.qr.con')} `}</span><b {...ndDau('td.so')}>{dongHo(con)}</b></>}</div>
    </>
  );
}

function CacBuoc({ tt }) {
  const { ds, hien, xongBuocHien } = buocTienTrinh(tt);
  return ds.map((b, i) => {
    const xongBuoc = i < hien || (i === hien && xongBuocHien);
    const lop = xongBuoc ? 'done' : i === hien ? 'cur' : '';
    return (
      <div className={`tl-step ${lop}`} key={b.ma}>
        <div className="tl-cot"><div className="tl-dot"><Ico ten={xongBuoc ? 'check' : b.ic} s={12} /></div>{i < ds.length - 1 && <div className="tl-line" />}</div>
        <div className={`tl-chu${i < ds.length - 1 ? ' giua' : ''}`}><div className="t" {...ndDau(b.kt)}>{b.t}</div>{b.s && <div className="s" {...ndDau(b.ks)}>{b.s}</div>}</div>
      </div>
    );
  });
}

export default function TheoDoiDon({ ma, lui, daTra, daHuy, veThanhToan }) {
  const { don, loi, taiLai } = dungTheoDoi(ma);
  const [loiHuy, datLoiHuy] = useState('');
  const [dangHuy, datDangHuy] = useState(false);
  const tt = don ? don.tienTrinh : '';
  const choTra = tt === 'cho_tra';
  // Cách trả + số ví đã giữ: POS trước (v7), không có trường thì bản ghi trên máy; đơn quầy (cach_tra null) → null.
  const tra = don && don.cachTra !== undefined ? (don.cachTra && { cach_tra: don.cachTra, giu_vi: don.giuVi, con_lai: don.conLai }) : banGhiCuaDon(ma);
  const viQr = !!tra && tra.cach_tra === 'vi_qr' && tra.giu_vi > 0;
  // Số cạnh QR: QR cả đơn → tổng; ví + QR → phần còn lại POS trả; không biết → ẩn.
  const soTra = !tra ? null : tra.cach_tra === 'qr' ? (don && don.tong) : Number.isFinite(tra.con_lai) ? tra.con_lai : null;
  useEffect(() => {
    if (tt && tt !== 'cho_tra' && tt !== 'da_huy') daTra(ma);
    if (tt === 'da_huy') daHuy();
  }, [tt]);
  // "Tạo mã mới" = huỷ đơn chờ trả rồi về Thanh toán — CHỈ khi huỷ thành công (POS từ chối, vd đơn vừa được trả → hiện lời POS, hỏi lại trạng thái).
  const taoMoi = () => {
    datDangHuy(true); datLoiHuy('');
    huyDon(ma).then(() => { daHuy(); veThanhToan(); }, (e) => { datDangHuy(false); datLoiHuy(e.message); taiLai(); });
  };
  const huy = () => {
    datDangHuy(true); datLoiHuy('');
    huyDon(ma).then(() => { datDangHuy(false); taiLai(); }, (e) => { datDangHuy(false); datLoiHuy(e.message); taiLai(); });
  };
  return (
    <Man id="tracking">
      <DauManCon tieuDe={don ? nd('td.tieuDe', { so: soDon(don.soHd, don.ma) }) : nd('td.tieuDe.cho')} phu={don && dinhDangNgay(don.ngay) ? nd('td.phu', { ngay: dinhDangNgay(don.ngay) }) : ''} lui={lui} canTrai />
      {!don && (loi ? <KhungLoi loi={loi} thuLai={taiLai} /> : <div className="khung-tai" aria-busy="true" />)}
      {don && (
        <>
          {choTra && don.qr && <TraQR qr={don.qr} soTra={soTra} soHd={don.soHd} taoMaMoi={taoMoi} dang={dangHuy} />}
          {choTra && viQr && <div className="care-disclaimer qr-chu qr-vi" {...ndDau('td.vi.giu')}>{ndPhan('td.vi.giu', { giu: <b key="giu" {...ndDau('td.tien')}>{dinhDangGia(tra.giu_vi)}</b>, qr: <b key="qr" {...ndDau('td.tien')}>{dinhDangGia(tra.con_lai)}</b> })}</div>}
          {(don.cauTienVe || don.tienVeChoDoiSoat) && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau(don.cauTienVe ? 'td.cauTienVe' : 'td.tienVe')}>{don.cauTienVe || nd('td.tienVe')}</div></div>}
          {tt && !choTra && tt !== 'da_huy' && <div className="pick-num"><Chu k="td.soDon" as="div" className="pick-chu" /><div className="n" {...ndDau('td.so')}>{soDon(don.soHd, don.ma)}</div></div>}
          {tt === 'xong' && <div className="nt-state on" role="status"><Ico ten="check" s={18} /><Chu k="td.xong" as="div" /></div>}
          {(tt === 'da_tra' || tt === 'dang_lam') && <Chu k="td.giuApp" as="div" className="care-disclaimer qr-chu" />}
          <div className="card the-buoc"><CacBuoc tt={tt} /></div>
          {docHoaDon(don).length > 0 ? <div className="order-card"><HoaDonKhach don={don} /></div> : <>
            {don.mon.length > 0 && <div className="sec-head" style={{ marginTop: 0 }}><Chu k="td.chiTiet" as="h2" /></div>}
            {don.mon.map((m, i) => (
              <div className="cart-item" key={i}>
                <div className="cart-thumb"><Ico ten="package" s={28} /></div>
                <div className="cart-info" {...ndDau('td.tien')}><div className="cart-name">{m.ten} ×{m.so_luong}</div>{m.ghi_chu && <div className="cart-opt">“{m.ghi_chu}”</div>}<div className="cart-price">{dinhDangGia(m.thanh_tien)}</div></div>
              </div>
            ))}
            {don.tong !== null && <div className="card the-tong"><div className="summary-row total"><Chu k="td.tong" /><span {...ndDau('td.tien')}>{dinhDangGia(don.tong)}</span></div></div>}
          </>}
          {loiHuy && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau('td.loiPos')}>{loiHuy}</div></div>}
          {choTra && <button type="button" className={`ghost-btn nut-huy${dangHuy ? ' btn-disabled' : ''}`} onClick={dangHuy ? undefined : huy} {...ndDau('td.huy')}>{nd('td.huy')}</button>}
          {!choTra && !xongChua(tt) && LIEN_HE.dienThoai && <a className="ghost-btn nut-huy" href={`tel:${LIEN_HE.dienThoai}`} {...ndDau('td.goi')}>{nd('td.goi')}</a>}
        </>
      )}
    </Man>
  );
}
