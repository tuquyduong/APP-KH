import { useEffect, useState } from 'react';
import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { bayGio } from '../bayGio.js';
import { buocTienTrinh, conLaiQR, huyDon, xongChua } from '../datDon.js';
import { dungTheoDoi } from '../dungDatDon.js';
import { LIEN_HE } from '../noiDung/lienHe.js';
import Man, { DauManCon } from '../components/Man.jsx';
import { KhungLoi } from '../components/TrangTai.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { VeQR } from './ManQR.jsx';

// Theo dõi đơn theo demo (tracking), đường dẫn /don/<ma>. Đơn chờ trả QR (mã QR chỉ có trong trả lời POST /don, App giữ trong bộ nhớ):
// vẽ QR + đếm ngược tới het_han theo "bây giờ" của POS, hỏi trạng thái mỗi 3 giây; hết hạn → "Tạo mã mới" / "Huỷ đơn".
// Đã trả: số đơn to để đọc cho nhân viên + các bước tien_trinh, hỏi lại mỗi 10 giây tới khi xong. Bản đồ / tài xế: KH-MUA-2.
const dongHo = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function TraQR({ qr, tong, taoMaMoi, dang }) {
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
      <div className="care-disclaimer qr-chu">Quét mã bằng app ngân hàng để trả {tong !== null && <b>{dinhDangGia(tong)}</b>}{con !== null && <> · còn <b>{dongHo(con)}</b></>}</div>
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

export default function TheoDoiDon({ ma, qr, lui, daTra, veThanhToan }) {
  const { don, loi, taiLai } = dungTheoDoi(ma, !!qr);
  const [loiHuy, datLoiHuy] = useState('');
  const [dangHuy, datDangHuy] = useState(false);
  const tt = don ? don.tienTrinh : '';
  const choTra = tt === 'cho_tra';
  useEffect(() => { if (tt && tt !== 'cho_tra' && tt !== 'da_huy') daTra(ma); }, [tt]);
  // "Tạo mã mới" = huỷ đơn chờ trả rồi về Thanh toán — CHỈ khi huỷ thành công (POS từ chối, vd đơn vừa được trả → hiện lời POS, hỏi lại trạng thái).
  const taoMoi = () => {
    datDangHuy(true); datLoiHuy('');
    huyDon(ma).then(veThanhToan, (e) => { datDangHuy(false); datLoiHuy(e.message); taiLai(); });
  };
  const huy = () => {
    datDangHuy(true); datLoiHuy('');
    huyDon(ma).then(() => { datDangHuy(false); taiLai(); }, (e) => { datDangHuy(false); datLoiHuy(e.message); });
  };
  return (
    <Man id="tracking">
      <DauManCon tieuDe={`Đơn #${ma}`} phu={don && dinhDangNgay(don.ngay) ? `Đặt lúc ${dinhDangNgay(don.ngay)}` : ''} lui={lui} canTrai />
      {!don && (loi ? <KhungLoi loi={loi} thuLai={taiLai} /> : <div className="khung-tai" aria-busy="true" />)}
      {don && (
        <>
          {choTra && qr && <TraQR qr={qr} tong={don.tong} taoMaMoi={taoMoi} dang={dangHuy} />}
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
