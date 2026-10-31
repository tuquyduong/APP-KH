// Giỏ hàng (hàm thuần, không đụng DOM / mạng — bài thử cong_cu/thu_KHMUA1.js nạp thẳng). Kho tiêm vào để thử (như tracNghiemLuu.js).
// Giỏ lưu TRÊN MÁY khoá `kh_gio`, mỗi dòng CHỈ { ma, so_luong, ghi_chu } — KHÔNG lưu giá (giá thật do POS báo lúc đặt). Xoá theo luật luuMay.js.
import { giaChoKhach } from './giaHang.js';

export const KHOA_GIO = 'kh_gio';
export const GHI_CHU_TOI_DA = 100;
const SO_LUONG_TOI_DA = 99;
const kho = () => localStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);
const kep = (n) => Math.min(SO_LUONG_TOI_DA, n);

/** Một dòng hợp lệ → bản sạch (chỉ ba trường); sai dạng → null. */
function sach(d) {
  if (!d || typeof d.ma !== 'string' || !d.ma || !Number.isInteger(d.so_luong) || d.so_luong < 1) return null;
  return { ma: d.ma, so_luong: kep(d.so_luong), ghi_chu: typeof d.ghi_chu === 'string' ? d.ghi_chu.slice(0, GHI_CHU_TOI_DA) : '' };
}

/** Đọc giỏ đã lưu; không có / hỏng / kho chặn → []. */
export function docGio(k = kho) {
  try {
    const o = JSON.parse(lay(k).getItem(KHOA_GIO));
    return Array.isArray(o) ? o.map(sach).filter(Boolean) : [];
  } catch { return []; }
}

/** Lưu giỏ (chỉ ba trường); kho bị chặn → false. */
export function ghiGio(gio, k = kho) {
  try { lay(k).setItem(KHOA_GIO, JSON.stringify(gio.map(sach).filter(Boolean))); return true; } catch { return false; }
}

/** Thêm món: cùng mã + cùng ghi chú thì cộng số lượng, khác thì thành dòng mới. */
export function themMon(gio, ma, soLuong = 1, ghiChu = '') {
  const gc = String(ghiChu || '').trim().slice(0, GHI_CHU_TOI_DA);
  const i = gio.findIndex((d) => d.ma === ma && d.ghi_chu === gc);
  if (i < 0) return [...gio, { ma, so_luong: kep(soLuong), ghi_chu: gc }];
  return gio.map((d, j) => (j === i ? { ...d, so_luong: kep(d.so_luong + soLuong) } : d));
}

/** Đổi số lượng dòng i; ≤ 0 → bỏ dòng. */
export const doiSoLuong = (gio, i, soLuong) => (soLuong <= 0 ? xoaDong(gio, i) : gio.map((d, j) => (j === i ? { ...d, so_luong: kep(soLuong) } : d)));
export const xoaDong = (gio, i) => gio.filter((_, j) => j !== i);
export const demMon = (gio) => gio.reduce((s, d) => s + d.so_luong, 0);

/** Dòng giỏ đối chiếu menu: { mon (null = không còn trong menu), conBan }. `con_hang` null (chưa biết) vẫn bán. */
export function trangThaiDong(dong, ds) {
  const mon = (ds || []).find((m) => m.ma === dong.ma) || null;
  return { mon, conBan: !!mon && mon.con_hang !== false };
}

export const duocThanhToan = (gio, ds) => gio.length > 0 && gio.every((d) => trangThaiDong(d, ds).conBan);

/** Giá CHỈ để khách hình dung: giá một ly tra bảng gia_hang (như Menu) × số lượng. Không phải số → null (ẩn). Tổng thật do POS báo. */
export function giaHinhDung(mon, hangToi, soLuong) {
  const g = giaChoKhach(mon, hangToi);
  return typeof g === 'number' && Number.isFinite(g) ? g * soLuong : null;
}
