import { dinhDangGia } from '../dinhDang.js';
import { giaRe } from '../giaHang.js';
import { nd, ndAnh, ndDau } from '../noiDung/nd.js';
import Chu from './Chu.jsx';
import { IcoVe } from './BieuTuong.jsx';

// Thẻ hội viên thu nhỏ (demo `.points-card.pc-mini`, vàng dập — cùng khuôn thẻ ở Trang chủ) cho một hạng bán được: "Thẻ <hạng> — từ <giá gói rẻ nhất>".
// Bấm → màn Hạng thành viên của hạng đó (KH-THE-1 E1). Tên hạng, giá gói lấy từ /hang của POS.
export default function TheHoiVien({ hang, mo }) {
  return (
    <div className="points-card pc-mini" role="button" tabIndex={0} onClick={mo} onKeyDown={(e) => { if (e.key === 'Enter') mo(); }}>
      <div className="card-top">
        <div className="hang-logo"><img className="tqd-logo tqd-mini" src={ndAnh('home.logo')} alt="" {...ndDau('home.logo')} /><div className="brand"><Chu k="home.the.nhan" /><Chu k="home.the.phu" as="small" /></div></div>
      </div>
      <div className="card-bottom">
        <div className="tier" {...ndDau('menu.the.pos')}><IcoVe ten="crown" s={12} /> {nd('menu.the.tu', { hang: hang.ten, gia: dinhDangGia(giaRe(hang)) })}</div>
      </div>
    </div>
  );
}
