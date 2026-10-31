// Bản menu gần nhất lưu trên máy khách (localStorage, khoá riêng `kh_menu`, chỉ dữ liệu menu công khai). Hàm thuần: kho tiêm vào để thử.
const KHOA_MENU = 'kh_menu';
const kho = () => localStorage;

export const PHUT_MENU_CON_MOI = 5; // trong ngần này phút kể từ lần lấy gần nhất thì không gọi lại /menu

/** Bản lấy lúc `at` (ms) còn mới so với `bay` (ms)? */
export const menuConMoi = (at, bay) => typeof at === 'number' && bay >= at && bay - at < PHUT_MENU_CON_MOI * 60000;

/** Đọc bản đã lưu → { dl: { data }, luc, at } hoặc null (không có / hỏng / sai dạng / rỗng / kho bị chặn). */
export function docMenuLuu(k = kho) {
  try {
    const o = JSON.parse((typeof k === 'function' ? k() : k).getItem(KHOA_MENU));
    if (!o || typeof o.luc !== 'string' || !Array.isArray(o.data) || o.data.length === 0) return null;
    return { dl: { data: o.data }, luc: o.luc, at: typeof o.at === 'number' ? o.at : 0 };
  } catch { return null; }
}

/** Lưu bản menu; kho bị chặn thì thôi (menu vẫn hiện từ bộ nhớ trang). */
export function ghiMenuLuu(dl, luc, at, k = kho) {
  try { (typeof k === 'function' ? k() : k).setItem(KHOA_MENU, JSON.stringify({ luc, at, data: dl.data })); } catch { /* không lưu được */ }
}

export function xoaMenuLuu(k = kho) {
  try { (typeof k === 'function' ? k() : k).removeItem(KHOA_MENU); } catch { /* không có gì để xoá */ }
}

/** Giờ VN "YYYY-MM-DD HH:mm:ss" từ đồng hồ máy (dinhDangNgay đọc được), không phụ thuộc múi giờ của máy: UTC + 7 giờ (VN không đổi giờ mùa hè). */
export function gioVn(bay = new Date()) {
  return new Date(bay.getTime() + 7 * 3600000).toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Kết quả lấy menu → trạng thái hiện. `loi` null = lấy được `dl`.
 * Lấy hỏng mà có bản lưu → hiện bản lưu (cu = true, kèm giờ). (v3: /menu mở cho khách vãng lai; 401 chỉ khi gửi token sai — dungMenu.js xử lý riêng.)
 */
export function chonMenu(loi, dl, banLuu, luc = '') {
  if (!loi) return { dl, luc, cu: false, loi: '' };
  if (banLuu) return { dl: banLuu.dl, luc: banLuu.luc, cu: true, loi: '' };
  return { dl: null, luc: '', cu: false, loi: loi.message };
}
