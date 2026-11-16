import { dinhDangGia } from '../dinhDang.js';
import { giaRe } from '../giaHang.js';
import { nd, ndAnh, ndDau } from '../noiDung/nd.js';
import Chu from './Chu.jsx';
import { IcoVe } from './BieuTuong.jsx';
import { dungCua, cuaToi } from '../duLieuKhach.js';
import { mauThe, nguoiTrenThe, hanTrenThe } from '../theHoiVien.js';
import '../giaoDien/the_hoi_vien.css';

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

// Khối thẻ hội viên DÙNG CHUNG (KH-THE-3, bản thiết kế chủ quán duyệt 15.11): đúng tỉ lệ thẻ thật 85,6 × 54, ba cỡ.
//   co="lon"  — thẻ đủ chữ (Ưu đãi, Chào mừng); role="img" + aria-label đọc tên hạng, người, hạn.
//   co="vua"  — 64 px (Thanh toán thẻ)   ·   co="nho" — 56 px mặc định (So sánh nhanh 44 px, dòng thẻ ở Chi tiết đơn 72 px; chỉnh bằng css của nơi dùng): KHÔNG chữ, aria-hidden.
// hang = { ten, phan_tram? } (bản ghi /hang hoặc hạng của khách); khach = { xung_ho, ten, sdt }; het_han: chuỗi giờ POS | null (không thời hạn) | undefined (POS không gửi — bỏ dòng hạn);
// tang: hạng quán tặng; chieu: màn Chào mừng — ánh lướt chạy MỘT lần.
const KIM_CUONG = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 5h16l6 8-14 15L2 13z" /><path d="M2 13h28M12 5l-4 8 8 15 8-15-4-8M12 5l4 8 4-8" />
  </svg>
);
const so = (x) => typeof x === 'number' && Number.isFinite(x);

export function TheHoiVienChung({ hang, co = 'lon', khach, het_han, tang = false, chieu = false }) {
  const mau = mauThe(hang && hang.ten);
  if (co !== 'lon') return <span className={`thv mini ${mau}${co === 'vua' ? ' vua' : ''}`} aria-hidden="true"><i className="thv-van" /></span>;
  const khoaNhan = typeof het_han === 'string' ? 'the.thv.hetHan' : tang ? 'the.thv.tang' : 'the.thv.khongHan'; // khoá của chữ nhãn hạn (hanTrenThe)
  const ten = (hang && hang.ten) || '', nguoi = nguoiTrenThe(khach), han = hanTrenThe(het_han, tang);
  const nhan = [nd('the.thv.aria', { hang: ten }), nguoi, han && [han.nhan, han.gia_tri].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  return (
    <div className={`thv ${mau}${chieu ? ' chieu' : ''}`} role="img" aria-label={nhan}>
      <i className="thv-van" />
      {mau === 'kc' && <span className="thv-lap"><i /><i /><i /></span>}
      <i className="thv-sang" />
      <div className="thv-than">
        <div className="thv-dau">
          <div className="thv-hieu">
            <img src={ndAnh('home.logo')} alt="" {...ndDau('home.logo')} />
            <div><Chu k="home.the.nhan" as="b" /><Chu k="home.the.phu" as="small" /></div>
          </div>
          {so(hang && hang.phan_tram) && hang.phan_tram > 0 && <span className="thv-giam" {...ndDau('the.thv.giam')}>{nd('the.thv.giam', { phanTram: hang.phan_tram })}</span>}
        </div>
        <div className="thv-ten">{mau === 'kc' && KIM_CUONG}<span {...ndDau('the.thv.pos')}>{ten}</span></div>
        <div className="thv-chan">
          <div>{nguoi && <><Chu k="the.thv.hoiVien" as="small" /><b {...ndDau('the.thv.khach')}>{nguoi}</b></>}</div>
          {han && <div className="phai">{han.gia_tri ? <><small {...ndDau(khoaNhan)}>{han.nhan}</small><b {...ndDau('the.thv.pos')}>{han.gia_tri}</b></> : <b {...ndDau(khoaNhan)}>{han.nhan}</b>}</div>}
        </div>
      </div>
    </div>
  );
}

/** Thẻ lớn của khách đang đăng nhập (Chào mừng): tên + SĐT lấy từ /toi trong kho chung; không biết hạng đơn → hạng hiện tại của khách (/toi); không có cả hai → không vẽ thẻ, hiện `thay` (vd chữ hạn của POS). */
export function TheHoiVienToi({ hang, thay = null, ...con }) {
  const toi = dungCua(cuaToi), khach = toi.dl && toi.dl.khach, h = hang || (khach && khach.hang);
  return h ? <TheHoiVienChung hang={h} khach={khach} {...con} /> : thay;
}
