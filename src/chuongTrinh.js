// Chương trình đặc biệt của quán (GET /chuong-trinh, hợp đồng v9 CT-1a) — hàm thuần. App chỉ HIỂN THỊ ("áp dụng tại quán"), không áp lên đơn.
import { tachNgaySinh } from './dinhDang.js';

const LOAI = ['sinh_nhat', 'hoc_sinh_gioi', 'khac'];
const nhuan = (nam) => (nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0;

/** Trả lời của POS → [{ ma, ten, moTa, loai }] theo đúng thứ tự POS. Bỏ dòng hỏng / không tên / `dang_bat === false`; loai lạ → 'khac'. */
export function docChuongTrinh(tl) {
  const ds = tl && Array.isArray(tl.data) ? tl.data : [];
  return ds
    .filter((c) => c && typeof c === 'object' && typeof c.ten === 'string' && c.ten.trim() && c.dang_bat !== false)
    .map((c) => ({ ma: c.ma, ten: c.ten.trim(), moTa: typeof c.mo_ta === 'string' ? c.mo_ta.trim() : '', loai: LOAI.includes(c.loai) ? c.loai : 'khac' }));
}

/** Hôm nay (`YYYY-MM-DD` theo giờ POS) có đúng ngày + tháng sinh không. Sinh 29/02 mà năm nay không nhuận → tính 28/02. Thiếu / sai → false. */
export function sinhNhatHomNay(ngaySinh, homNay) {
  const s = tachNgaySinh(ngaySinh), h = tachNgaySinh(homNay);
  if (!s || !h) return false;
  const ngay = s.thang === 2 && s.ngay === 29 && !nhuan(h.nam) ? 28 : s.ngay;
  return s.thang === h.thang && ngay === h.ngay;
}
