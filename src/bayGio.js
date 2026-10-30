// "Bây giờ" của App = đồng hồ máy chủ POS (hợp đồng /api/kh: `bay_gio` của /gio-hoat-dong), KHÔNG phải đồng hồ điện thoại.
// Giữa hai lần hỏi đếm giây bằng đồng hồ máy: độ lệch = bay_gio của POS − đồng hồ máy lúc nhận. Chưa có / lỗi → gioVn() (đồng hồ máy + 7 giờ).
// Không `new Date(chuỗi giờ POS)` (trình duyệt sẽ hiểu là giờ máy): đọc bằng Date.UTC → không phụ thuộc múi giờ máy.
import { gioVn } from './menuLuu.js';

const GIO_VN_LECH = 7 * 3600000;
let lech = 0; // ms

/** "2026-10-30T20:30:00" hoặc "2026-10-30 20:30:00" (giờ VN) → ms của giờ đó đọc như UTC; không đọc được → NaN. */
export function mocTuChuoi(chuoi) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(String(chuoi || ''));
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)) : NaN;
}

/** Nhận `bay_gio` của POS. Hỏng → giữ nguyên độ lệch cũ, trả false. */
export function datBayGio(chuoi, mayMs = Date.now()) {
  const moc = mocTuChuoi(chuoi);
  if (!Number.isFinite(moc)) return false;
  lech = moc - GIO_VN_LECH - mayMs;
  return true;
}

export const xoaLech = () => { lech = 0; };

/** Giờ VN hiện tại theo POS, dạng "YYYY-MM-DD HH:mm:ss". */
export const bayGio = (mayMs = Date.now()) => gioVn(new Date(mayMs + lech));
