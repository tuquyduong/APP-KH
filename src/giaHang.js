import { dinhDangGia } from './dinhDang.js';
// Giá theo hạng — App KHÔNG tự tính: chỉ TRA bảng `gia_hang[]` POS gửi kèm từng món (máy chủ tính cùng hàm với quầy).
// Hạng khách (`hangToi`) = { id, ten } lấy từ /toi; `dsHang` = /hang (POS đã xếp theo thu_bac tăng dần — App không sắp lại).

/** Giá khách phải trả theo hạng: dòng `hang_id` = hạng khách; không có dòng (không hạng / bảng rỗng) → giá gốc. */
export function giaChoKhach(mon, hangToi) {
  const dong = hangToi && Array.isArray(mon.gia_hang) ? mon.gia_hang.find((d) => d.hang_id === hangToi.id) : null;
  return dong && typeof dong.gia === 'number' && Number.isFinite(dong.gia) ? dong.gia : mon.gia;
}

/**
 * Bậc thang "giá các hạng" của demo: [{ ten, gia, laToi }] — Thường (giá gốc) rồi từng hạng POS có giá cho món này.
 * Hạng POS không trả giá thì không hiện; không còn hạng nào ngoài Thường (chưa đăng nhập / bảng rỗng) → null (ẩn).
 */
export function bacThang(dsHang, mon, hangToi) {
  const bang = Array.isArray(mon.gia_hang) ? mon.gia_hang : [];
  const co = (id) => bang.find((d) => d.hang_id === id && typeof d.gia === 'number' && Number.isFinite(d.gia));
  const cot = (Array.isArray(dsHang) ? dsHang : []).filter((h) => co(h.id)).map((h) => ({ id: h.id, ten: h.ten, gia: co(h.id).gia }));
  if (hangToi && co(hangToi.id) && !cot.some((c) => c.id === hangToi.id)) cot.push({ id: hangToi.id, ten: hangToi.ten, gia: co(hangToi.id).gia }); // hạng đã tắt mà thẻ còn hạn
  if (cot.length === 0) return null;
  const toi = hangToi ? hangToi.id : null;
  return [{ ten: 'Thường', gia: mon.gia, laToi: !cot.some((c) => c.id === toi) }, ...cot.map((c) => ({ ten: c.ten, gia: c.gia, laToi: c.id === toi }))];
}

/** Menu không còn giá hạng của khách (bản công khai): bỏ `gia_hang` khỏi mọi món, không sửa bản gốc. */
export const boGiaHang = (dl) => (dl && Array.isArray(dl.data) ? { ...dl, data: dl.data.map(({ gia_hang: _bo, ...mon }) => mon) } : dl);

/** Bảng hạng cho khách xem: chỉ hạng giảm thật (`phan_tram` là số > 0) — chủ quán chốt 01.11 ẩn hạng 0%. Không phải mảng → []. */
export const hangCoGiam = (ds) => (Array.isArray(ds) ? ds.filter((h) => typeof h.phan_tram === 'number' && h.phan_tram > 0) : []);

export const CHU_HANG_TANG = 'Hạng dành tặng khách thân thiết';
export const CHU_KHONG_THOI_HAN = 'Không thời hạn';

/** Hạng `id` trong /hang có phải hạng chỉ chủ quán cấp (`chi_cap === true`)? Thiếu / sai kiểu → false. */
export const laHangChiCap = (ds, id) => Array.isArray(ds) && ds.some((h) => h && h.id === id && h.chi_cap === true);

/** Dòng chữ các gói tháng ĐANG BÁN của một hạng ("3 tháng — 300.000đ"): chỉ `goi[]` (không đọc gia_the); hạng chỉ cấp, thiếu / sai kiểu → []. */
export function dongGoi(h) {
  if (!h || h.chi_cap === true || !Array.isArray(h.goi)) return [];
  return h.goi.filter((g) => g && Number.isInteger(g.so_thang) && g.so_thang > 0 && typeof g.gia === 'number' && g.gia > 0 && dinhDangGia(g.gia)).map((g) => `${g.so_thang} tháng — ${dinhDangGia(g.gia)}`);
}
