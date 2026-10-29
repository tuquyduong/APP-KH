import { THE_CHAT } from '../noiDung/theChat.js';

/** Biểu tượng một thể trạng (demo EN(ty.ic, s)): file SVG tách từ demo ở public/anh/. `khoa` = khoá nhóm của file dữ liệu (bh, kh, dh…). */
export default function AnhTheChat({ khoa, s = 44 }) {
  return <img className="en" src={THE_CHAT[khoa].anh} width={s} height={s} alt="" />;
}
