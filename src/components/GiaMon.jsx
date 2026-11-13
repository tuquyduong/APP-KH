import { dinhDangGia, dinhDangSoTien } from '../dinhDang.js';
import { chuNhanMon } from '../gioVang.js';
import { nd, ndPhan, ndDau } from '../noiDung/nd.js';
import { IcoVe } from './BieuTuong.jsx';
import GvDem from './GvDem.jsx';

// Phần giá của demo: bậc thang giá các hạng (ladder / ladderD), nhãn Giờ vàng (gvTag), ghi chú ở Trang món (gvDetail).
// `bac` từ giaHang.bacThang: [{ ten, gia, laToi }] — số cột theo số hạng POS trả (demo cố định 3). Mọi con số là giá POS gửi, App không tính.
const lopMau = (i) => `l${Math.min(i, 2)}`;

export function BacGia({ bac }) {
  return (
    <div className="lad" style={{ gridTemplateColumns: `repeat(${bac.length},1fr)` }}>
      {bac.map((c, i) => <div key={i} className={c.laToi ? `me ${lopMau(i)}` : ''}><small>{c.ten}</small><b>{dinhDangSoTien(c.gia)}</b></div>)}
    </div>
  );
}

export function BacGiaChiTiet({ bac }) {
  return (
    <div className="ladd" style={{ gridTemplateColumns: bac.map((c) => (c.laToi ? '1.25fr' : '1fr')).join(' ') }}>
      {bac.map((c, i) => (
        <div key={i} className={c.laToi ? `me ${lopMau(i)}` : ''}>
          <small>{c.laToi && <span className="gem" />}{c.ten}</small><b>{dinhDangGia(c.gia)}</b><span className="tag" {...(c.laToi ? ndDau('gia.cuaBan') : {})}>{c.laToi ? nd('gia.cuaBan') : ' '}</span>
        </div>
      ))}
    </div>
  );
}

/** Nhãn trên ô món Giờ vàng: đang giảm → "Giờ vàng −50%" (nền đỏ); ngoài giờ → "… từ 20:00". */
export function NhanGioVang({ tt }) {
  const dang = tt.pha === 'dang';
  const khoa = `gv.nhan.${['dang', 'sau', 'cho'].includes(tt.pha) ? tt.pha : 'truoc'}`; // khớp chuNhanMon (gioVang.js)
  return <span className={`pill gv${dang ? ' on' : ''}`} {...ndDau(khoa)}><IcoVe ten={dang ? 'bolt' : 'clock'} s={11} /> {chuNhanMon(tt)}</span>;
}

/** Ghi chú Giờ vàng ở Trang món. */
export function GhiChuGioVang({ tt }) {
  if (tt.pha === 'dang') {
    return (
      <div className="gv-note on"><IcoVe ten="bolt" s={14} /> <span><b {...ndDau('gv.ghi.dangB')}>{ndPhan('gv.ghi.dangB', { phanTram: tt.phanTram })}</b> · <GvDem kieu="short" />{`. ${nd('gv.ghi.dangDuoi')}`}</span></div>
    );
  }
  return (
    <div className="gv-note"><IcoVe ten="clock" s={14} /> <span>{ndPhan('gv.ghi.truocA')}<b {...ndDau('gv.ghi.truocB')}>{ndPhan('gv.ghi.truocB', { batDau: tt.batDau, ketThuc: tt.ketThuc })}</b>{ndPhan('gv.ghi.truocC', { phanTram: tt.phanTram })}</span></div>
  );
}
