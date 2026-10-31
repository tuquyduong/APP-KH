import { KHOA_TRAC_NGHIEM } from './tracNghiemLuu.js';
import { KHOA_GIO } from './gio.js';

// Dữ liệu của khách lưu TRÊN MÁY (localStorage) — quy tắc giữ / xoá ở MỘT chỗ (KH-LUU-1, chủ quán chốt 30.10):
//   hết phiên (401) → GIỮ; bấm "Đăng xuất" → XOÁ hết; người đăng nhập sau KHÁC người trước → XOÁ.
// "Cùng khách hay khác khách" so bằng dấu vết của số điện thoại ở khoá `kh_chu` (số thô không lưu). Dấu vết không phải bí mật:
// số điện thoại có ít số nên đoán ngược được — chỉ dùng để so, không dùng để chứng thực. Kho tiêm vào để thử (như tracNghiemLuu.js).
const KHOA_CHU = 'kh_chu';
/** Mọi khoá dữ liệu khách. Tính năng mới lưu trên máy (kế hoạch và nhắc việc `kh_kehoach`…) thêm khoá của mình vào đây. */
const KHOA_DU_LIEU = [KHOA_TRAC_NGHIEM, KHOA_GIO];
/** Khoá không tính là "dữ liệu chưa biết của ai": giỏ của khách vãng lai phải còn khi khách đăng nhập lần đầu (KH-MUA-1 A4). */
const KHOA_VANG_LAI = [KHOA_GIO];
const kho = () => localStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);

/** Số điện thoại → dấu vết ngắn (cyrb53, 14 chữ số hex) để so sánh; "090…", "+8490…", "090 123 4567" cho cùng kết quả. Không có số → "". */
export function dauVet(sdt) {
  let so = String(sdt == null ? '' : sdt).replace(/\D/g, '');
  if (so.startsWith('84')) so = '0' + so.slice(2);
  if (!so) return '';
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < so.length; i++) {
    const c = so.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0');
}

function docChu(k) {
  try { return lay(k).getItem(KHOA_CHU) || null; } catch { return null; }
}
function xoaDuLieu(k) {
  KHOA_DU_LIEU.forEach((x) => { try { lay(k).removeItem(x); } catch { /* kho chặn: không có gì để xoá */ } });
}
function coDuLieu(k) {
  try { return KHOA_DU_LIEU.some((x) => !KHOA_VANG_LAI.includes(x) && lay(k).getItem(x) !== null); } catch { return false; }
}

/** Ghi chủ sở hữu; kho bị chặn → false. */
export function ghiChu(sdt, k = kho) {
  try { lay(k).setItem(KHOA_CHU, dauVet(sdt)); return true; } catch { return false; }
}

/** true = cùng khách, false = khác khách, 'chuaBiet' = chưa có `kh_chu`. */
export function cungKhach(sdt, k = kho) {
  const chu = docChu(k);
  return chu === null ? 'chuaBiet' : chu === dauVet(sdt);
}

/**
 * Gọi MỖI LẦN app biết số điện thoại của khách đang đăng nhập (GET /toi). Khác chủ cũ, hoặc có dữ liệu mà chưa biết của ai
 * (bản lưu từ trước việc này) → xoá dữ liệu cũ. Rồi ghi chủ mới. Trả true nếu đã xoá.
 */
export function doiKhach(sdt, k = kho) {
  if (!dauVet(sdt)) return false;
  const cung = cungKhach(sdt, k);
  const xoa = cung === false || (cung === 'chuaBiet' && coDuLieu(k));
  if (xoa) xoaDuLieu(k);
  if (cung !== true) ghiChu(sdt, k);
  return xoa;
}

/** Chỉ khi khách BẤM "Đăng xuất": xoá dữ liệu khách và cả `kh_chu`. */
export function xoaTatCa(k = kho) {
  xoaDuLieu(k);
  try { lay(k).removeItem(KHOA_CHU); } catch { /* kho chặn */ }
}
