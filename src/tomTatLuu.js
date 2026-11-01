// Bản TÓM TẮT của khách lưu trên máy (localStorage `kh_tom_tat`, chủ quán chốt 01.11) — CHỈ để hiện ngay khi mở app, không dùng để tính / chặn / cho trả tiền.
// Chỉ giữ: ten, xung_ho, hang (5 trường), so_du_vi (/toi), points (/diem) + `chu` (dấu vết SĐT của luuMay.js) + `luc`. KHÔNG sdt, qr, dia_chi, lịch sử, voucher, đơn.
// Quy tắc xoá ở luuMay.js (KHOA_DU_LIEU). Kho tiêm vào để thử (như menuLuu.js).
export const KHOA_TOM_TAT = 'kh_tom_tat';
const kho = () => localStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);
const so = (x) => typeof x === 'number' && Number.isFinite(x);
const chuoi = (x) => (typeof x === 'string' ? x : null);

const rutHang = (h) => (h && typeof h === 'object' ? { id: h.id, ten: chuoi(h.ten), phan_tram: h.phan_tram, phan_tram_nhom_dac_biet: h.phan_tram_nhom_dac_biet, het_han: chuoi(h.het_han) } : null);

/** Dựng bản lưu từ dữ liệu POS. Hồ sơ phải là bản thật (không phải bản gieo từ máy); /diem không có → bỏ `points`. */
function rut(o, chu, luc) {
  const ban = { chu, luc, ten: chuoi(o.ten), xung_ho: chuoi(o.xung_ho), hang: rutHang(o.hang), so_du_vi: so(o.so_du_vi) ? o.so_du_vi : null };
  if (so(o.points)) ban.points = o.points;
  return ban;
}
export function rutTomTat(toiDl, diemDl, chu, luc) {
  if (!toiDl || toiDl.tuMay || !toiDl.khach || !chu) return null;
  return rut({ ...toiDl.khach, points: diemDl && !diemDl.tuMay ? diemDl.points : undefined }, chu, luc);
}

/** Lưu; kho bị chặn → false (không báo "đã lưu"). */
export function ghiTomTat(ban, k = kho) {
  try { lay(k).setItem(KHOA_TOM_TAT, JSON.stringify(ban)); return true; } catch { return false; }
}

/** Đọc + lọc lại đúng các trường cho phép; không có / hỏng / kho chặn → null. */
export function docTomTat(k = kho) {
  try {
    const o = JSON.parse(lay(k).getItem(KHOA_TOM_TAT));
    return o && typeof o.chu === 'string' && o.chu ? rut(o, o.chu, so(o.luc) ? o.luc : 0) : null;
  } catch { return null; }
}

/** Bản lưu chỉ hiện khi thuộc đúng khách hiện tại (so `chu` với `kh_chu`). */
export const tomTatCuaKhach = (ban, chu) => (ban && chu && ban.chu === chu ? ban : null);
