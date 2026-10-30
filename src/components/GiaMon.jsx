import { dinhDangGia } from '../dinhDang.js';
import { chuNhanMon } from '../gioVang.js';
import { IcoVe } from './BieuTuong.jsx';
import GvDem from './GvDem.jsx';

// Phần giá của demo: bậc thang giá các hạng (ladder / ladderD), nhãn Giờ vàng (gvTag), ghi chú ở Trang món (gvDetail).
// `bac` từ giaHang.bacThang: [{ ten, gia, laToi }] — số cột theo số hạng POS trả (demo cố định 3). Mọi con số là giá POS gửi, App không tính.
const lopMau = (i) => `l${Math.min(i, 2)}`;
const boDong = (gia) => dinhDangGia(gia).replace('đ', '');

export function BacGia({ bac }) {
  return (
    <div className="lad" style={{ gridTemplateColumns: `repeat(${bac.length},1fr)` }}>
      {bac.map((c, i) => <div key={i} className={c.laToi ? `me ${lopMau(i)}` : ''}><small>{c.ten}</small><b>{boDong(c.gia)}</b></div>)}
    </div>
  );
}

export function BacGiaChiTiet({ bac }) {
  return (
    <div className="ladd" style={{ gridTemplateColumns: bac.map((c) => (c.laToi ? '1.25fr' : '1fr')).join(' ') }}>
      {bac.map((c, i) => (
        <div key={i} className={c.laToi ? `me ${lopMau(i)}` : ''}>
          <small>{c.laToi && <span className="gem" />}{c.ten}</small><b>{dinhDangGia(c.gia)}</b><span className="tag">{c.laToi ? 'Giá của bạn' : ' '}</span>
        </div>
      ))}
    </div>
  );
}

/** Nhãn trên ô món Giờ vàng: đang giảm → "Giờ vàng −50%" (nền đỏ); ngoài giờ → "… từ 20:00". */
export function NhanGioVang({ tt }) {
  const dang = tt.pha === 'dang';
  return <span className={`pill gv${dang ? ' on' : ''}`}><IcoVe ten={dang ? 'bolt' : 'clock'} s={11} /> {chuNhanMon(tt)}</span>;
}

/** Ghi chú Giờ vàng ở Trang món. */
export function GhiChuGioVang({ tt }) {
  if (tt.pha === 'dang') {
    return (
      <div className="gv-note on"><IcoVe ten="bolt" s={14} /> <span><b>Giờ vàng −{tt.phanTram}%</b> · <GvDem kieu="short" />. Giá Giờ vàng áp khi thanh toán, không cộng thêm ưu đãi khác.</span></div>
    );
  }
  return <div className="gv-note"><IcoVe ten="clock" s={14} /> <span>Món có trong <b>Giờ vàng {tt.batDau}–{tt.ketThuc}</b>: giảm {tt.phanTram}%.</span></div>;
}
