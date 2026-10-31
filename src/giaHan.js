// Tự gia hạn đăng nhập (hợp đồng v3 "Tự gia hạn"): mở app khi đã đăng nhập → POST /gia-han, tối đa MỘT lần mỗi ngày VN.
// Ngày đã gia hạn lưu ở máy (khoá `kh_gia_han`, luật xoá ở luuMay.js). Thất bại (429, mạng, 5xx) thì im lặng, không ghi ngày → lần mở sau thử lại.
// 401 do api.js lo (hết phiên như mọi cửa khác).
import { docToken, luuToken, giaHan } from './api.js';

export const KHOA_GIA_HAN = 'kh_gia_han';
const kho = () => localStorage;
let ngayTrongTrang = ''; // kho bị chặn vẫn không gọi lại trong lần mở này
let dangGoi = null;

/** "2026-10-30 08:00:00" hoặc "…T…" (giờ VN của POS) → "2026-10-30"; không đọc được → "". */
export const ngayVn = (gio) => (/^(\d{4}-\d{2}-\d{2})[T ]\d{2}:\d{2}/.exec(String(gio || '')) || [])[1] || '';

/** Gọi MỖI LẦN app có phiên và đã biết giờ POS (`gio`). Không bao giờ ném lỗi, không chặn màn nào. */
export function giaHanNeuCan(gio) {
  const ngay = ngayVn(gio), token = docToken();
  if (!token || !ngay || dangGoi) return dangGoi || Promise.resolve();
  let daLam = ngayTrongTrang;
  try { daLam = kho().getItem(KHOA_GIA_HAN) || daLam; } catch { /* kho chặn */ }
  if (daLam === ngay) return Promise.resolve();
  dangGoi = giaHan().then((r) => {
    if (!r || typeof r.token !== 'string' || !r.token || docToken() !== token) return; // khách đã đăng xuất / đổi phiên trong lúc chờ: không làm sống lại phiên
    luuToken(r.token);
    ngayTrongTrang = ngay;
    try { kho().setItem(KHOA_GIA_HAN, ngay); } catch { /* kho chặn: lần mở sau gọi lại */ }
  }, () => { /* im lặng */ }).finally(() => { dangGoi = null; });
  return dangGoi;
}
