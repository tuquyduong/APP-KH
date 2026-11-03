import { useEffect, useState } from 'react';
import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { bayGio } from '../bayGio.js';
import { banGhiCuaDon, buocTienTrinh, conLaiQR, huyDon, xongChua } from '../datDon.js';
import { dungTheoDoi } from '../dungDatDon.js';
import { LIEN_HE } from '../noiDung/lienHe.js';
import Man, { DauManCon } from '../components/Man.jsx';
import { KhungLoi } from '../components/TrangTai.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { VeQR } from './ManQR.jsx';

// Theo dõi đơn theo demo (tracking), đường dẫn /don/<ma>. Đơn chờ trả: QR lấy từ GET /don/:ma (tải lại / máy khác vẫn thấy), đếm ngược tới het_han
// theo "bây giờ" của POS, hỏi trạng thái mỗi 3 giây; hết hạn → "Tạo mã mới" / "Huỷ đơn". Số giữ ví / QR còn lại chỉ có trong trả lời POST /don →
// đọc từ bản ghi lần gửi trên máy này (kh_don_gui); máy khác không có → ẩn dòng đó và số cạnh QR (không hiện tổng sai cho đơn ví + QR).
// Đã trả: số đơn to để đọc cho nhân viên + các bước tien_trinh, hỏi lại mỗi 10 giây tới khi xong. Bản đồ / tài xế: KH-MUA-2.
const dongHo = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function TraQR({ qr, soTra, taoMaMoi, dang }) {
  const [, ve] = useState(0);
  useEffect(() => { const id = setInterval(() => ve((x) => x + 1), 1000); return () => clearInterval(id); }, []);
  const con = conLaiQR(qr.hetHan, bayGio());
  if (con === 0) {
    return (
      <>
        <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>Mã QR đã hết hạn, đơn chưa được trả.</div></div>
        <button type="button" className={`checkout-btn${dang ? ' btn-disabled' : ''}`} onClick={dang ? undefined : taoMaMoi}><span>Tạo mã mới</span><span>→</span></button>
      </>
    );
  }
  return (
    <>
      <div className="khung-qr"><VeQR noiDung={qr.chuoi} nhan="Mã QR trả tiền" /></div>
      <div className="care-disclaimer qr-chu">Quét mã bằng app ngân hàng để trả{soTra !== null && <> <b>{dinhDangGia(soTra)}</b></>}{con !== null && <> · còn <b>{dongHo(con)}</b></>}</div>
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
        <div className={`tl-chu${i < ds.length - 1 ? ' giua' : ''}`}><div className="t">{b.t}</div>{b.s && <div className="s">{b.s}</div>}</div>
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
  const banGhi = banGhiCuaDon(ma);
  const viQr = !!banGhi && banGhi.cach_tra === 'vi_qr' && banGhi.giu_vi > 0;
  // Số cạnh QR: QR cả đơn → tổng; ví + QR → phần còn lại POS trả. Không có bản ghi (máy khác) → không biết → ẩn.
  const soTra = !banGhi ? null : banGhi.cach_tra === 'qr' ? (don && don.tong) : Number.isFinite(banGhi.con_lai) ? banGhi.con_lai : null;
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
      <DauManCon tieuDe={`Đơn #${ma}`} phu={don && dinhDangNgay(don.ngay) ? `Đặt lúc ${dinhDangNgay(don.ngay)}` : ''} lui={lui} canTrai />
      {!don && (loi ? <KhungLoi loi={loi} thuLai={taiLai} /> : <div className="khung-tai" aria-busy="true" />)}
      {don && (
        <>
          {choTra && don.qr && <TraQR qr={don.qr} soTra={soTra} taoMaMoi={taoMoi} dang={dangHuy} />}
          {choTra && viQr && <div className="care-disclaimer qr-chu qr-vi">Đã giữ <b>{dinhDangGia(banGhi.giu_vi)}</b> trong ví · quét QR <b>{dinhDangGia(banGhi.con_lai)}</b></div>}
          {don.tienVeChoDoiSoat && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn.</div></div>}
          {tt && !choTra && tt !== 'da_huy' && <div className="pick-num"><div className="pick-chu">Số đơn của bạn — đọc cho nhân viên</div><div className="n">#{don.ma}</div></div>}
          <div className="card the-buoc"><CacBuoc tt={tt} /></div>
          {don.mon.length > 0 && <div className="sec-head" style={{ marginTop: 0 }}><h2>Chi tiết đơn</h2></div>}
          {don.mon.map((m, i) => (
            <div className="cart-item" key={i}>
              <div className="cart-thumb"><Ico ten="package" s={28} /></div>
              <div className="cart-info"><div className="cart-name">{m.ten} ×{m.so_luong}</div>{m.ghi_chu && <div className="cart-opt">“{m.ghi_chu}”</div>}<div className="cart-price">{dinhDangGia(m.thanh_tien)}</div></div>
            </div>
          ))}
          {don.tong !== null && <div className="card the-tong"><div className="summary-row total"><span>Tổng cộng</span><span>{dinhDangGia(don.tong)}</span></div></div>}
          {loiHuy && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loiHuy}</div></div>}
          {choTra && <button type="button" className={`ghost-btn nut-huy${dangHuy ? ' btn-disabled' : ''}`} onClick={dangHuy ? undefined : huy}>Huỷ đơn</button>}
          {!choTra && !xongChua(tt) && LIEN_HE.dienThoai && <a className="ghost-btn nut-huy" href={`tel:${LIEN_HE.dienThoai}`}>Gọi quán để huỷ</a>}
        </>
      )}
    </Man>
  );
}
