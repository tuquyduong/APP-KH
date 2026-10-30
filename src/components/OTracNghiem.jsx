import { THE_CHAT } from '../noiDung/theChat.js';
import { O_TRAC_NGHIEM as CHU } from '../noiDung/tracNghiemChu.js';
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
      <div className="hb-ic">{the ? <AnhTheChat khoa={klLuu.picks[0]} s={36} /> : <img className="en" src="/anh/the-chat-scale.svg" width="36" height="36" alt="" />}</div>
      <div className="hb-tx">
        {the
          ? <><div className="hb-k">{CHU.ketQua}</div><div className="hb-h">{the.ten}</div><div className="hb-s">{CHU.xemKetQua}</div></>
          : <><div className="hb-k">{CHU.nhan}</div>{dangNhap ? <div className="hb-h two">{CHU.hoi}</div> : <div className="hb-h hb-khoa"><DongKhoa /></div>}</>}
      </div>
    </div>
  );
}
