// Giá theo hạng — App KHÔNG tự tính: chỉ TRA bảng `gia_hang[]` POS gửi kèm từng món (máy chủ tính cùng hàm với quầy).
// Hạng khách (`hangToi`) = { id, ten } lấy từ /toi; `dsHang` = /hang (đã xếp theo thu_tu).

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
