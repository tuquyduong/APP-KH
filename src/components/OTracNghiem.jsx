import { THE_CHAT } from '../noiDung/theChat.js';
import { ndAnh, ndDau } from '../noiDung/nd.js';
import Chu from './Chu.jsx';
import { taoDuongDan } from '../duongDan.js';
import AnhTheChat from './AnhTheChat.jsx';
import { DongKhoa } from './KhoaTienIch.jsx';
import { bam } from './bam.js';

/**
 * Ô "Trắc nghiệm · Bạn thuộc thể chất nào?" trong khối Hôm nay ở Trang chủ (demo hbQuiz). Chưa đăng nhập → ô MỜ, dòng phụ được THAY bằng dòng khoá
 * (không mờ, không viên nổi); chạm → đăng nhập rồi vào trắc nghiệm.
 * Đã có kết quả lưu (`klLuu`) thì ô đổi thành "Thể trạng · <tên> · Xem kết quả ›" và mở thẳng kết quả.
 */
export default function OTracNghiem({ dangNhap, klLuu, mo, moDangNhap }) {
  const the = dangNhap && klLuu ? THE_CHAT[klLuu.picks[0]] : null;
  return (
    <div className={`hb-tile hb-t-quiz${dangNhap ? '' : ' hb-mo'}`} {...bam(dangNhap ? mo : () => moDangNhap(taoDuongDan('tracnghiem')))}>
      <div className="hb-ic">{the ? <AnhTheChat khoa={klLuu.picks[0]} s={36} /> : <img className="en" src={ndAnh('home.q.anh')} width="36" height="36" alt="" {...ndDau('home.q.anh')} />}</div>
      <div className="hb-tx">
        {the
          ? <><Chu k="home.q.kq" as="div" className="hb-k" /><div className="hb-h">{the.ten}</div><Chu k="home.q.xem" as="div" className="hb-s" /></>
          : <><Chu k="home.qk" as="div" className="hb-k" />{dangNhap ? <Chu k="home.qh" as="div" className="hb-h two" /> : <div className="hb-h hb-khoa"><DongKhoa /></div>}</>}
      </div>
    </div>
  );
}
