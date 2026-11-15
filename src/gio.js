// Giỏ hàng (hàm thuần, không đụng DOM / mạng — bài thử cong_cu/thu_KHMUA1.js nạp thẳng). Kho tiêm vào để thử (như tracNghiemLuu.js).
// Giỏ lưu TRÊN MÁY khoá `kh_gio`, mỗi dòng CHỈ { ma, so_luong, ghi_chu } — KHÔNG lưu giá (giá thật do POS báo lúc đặt). Xoá theo luật luuMay.js.
// Thẻ hạng KHÔNG vào giỏ (KH-THE-2, chủ quán 14.11): mua thẳng ở Thanh toán thẻ — dòng { loai: 'the', hang_id, so_thang } dựng từ đường dẫn (dongTheTuDuongDan).
// Bản lưu cũ còn dòng thẻ → đọc bỏ dòng đó.
import { giaChoKhach, goiBan } from './giaHang.js';

export const KHOA_GIO = 'kh_gio';
export const GHI_CHU_TOI_DA = 100;
const SO_LUONG_TOI_DA = 99;
const kho = () => localStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);
const kep = (n) => Math.min(SO_LUONG_TOI_DA, n);

export const laThe = (d) => !!d && d.loai === 'the';

/** Một dòng món hợp lệ → bản sạch (ba trường); dòng thẻ / sai dạng → null. */
function sach(d) {
  if (!d || d.loai !== undefined || typeof d.ma !== 'string' || !d.ma || !Number.isInteger(d.so_luong) || d.so_luong < 1) return null;
  return { ma: d.ma, so_luong: kep(d.so_luong), ghi_chu: typeof d.ghi_chu === 'string' ? d.ghi_chu.slice(0, GHI_CHU_TOI_DA) : '' };
}

const sachGio = (ds) => ds.map(sach).filter(Boolean);

/** Đọc giỏ đã lưu; không có / hỏng / kho chặn → []. */
export function docGio(k = kho) {
  try {
    const o = JSON.parse(lay(k).getItem(KHOA_GIO));
    return Array.isArray(o) ? sachGio(o) : [];
  } catch { return []; }
}

/** Lưu giỏ (chỉ các trường của dòng); kho bị chặn → false. */
export function ghiGio(gio, k = kho) {
  try { lay(k).setItem(KHOA_GIO, JSON.stringify(sachGio(gio))); return true; } catch { return false; }
}

const SO_NGUYEN = /^[1-9]\d{0,5}$/;
/** Dòng thẻ của Thanh toán thẻ từ tham số đường dẫn `?h=&thang=` (chuỗi chỉ chữ số, > 0); sai → null. Còn bán hay không: trangThaiDong. */
export const dongTheTuDuongDan = ({ h, thang } = {}) => (SO_NGUYEN.test(String(h ?? '')) && SO_NGUYEN.test(String(thang ?? '')) ? { loai: 'the', hang_id: Number(h), so_thang: Number(thang) } : null);
export const coDoUong = (gio) => gio.some((d) => !laThe(d));

/** Dọn giỏ sau khi đơn đã trả: bỏ ĐÚNG các dòng đã gửi (`monGui` = mon[] của thân đơn) — món trừ đúng số đã gửi (dòng thẻ không có trong giỏ); dòng thêm sau giữ. */
export function boDongDaGui(gio, monGui) {
  let con = gio;
  for (const m of monGui || []) {
    const i = con.findIndex((d) => d.ma === m.ma && d.ghi_chu === (m.ghi_chu || ''));
    if (i >= 0) con = doiSoLuong(con, i, con[i].so_luong - m.so_luong);
  }
  return con;
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
/** Hoàn tác xoá: trả `dong` về vị trí cũ; đã có dòng cùng mã + ghi chú (khách vừa thêm lại) thì cộng số lượng như `themMon`. */
export function chenDong(gio, dong, vitri) {
  if (gio.some((d) => d.ma === dong.ma && d.ghi_chu === dong.ghi_chu)) return themMon(gio, dong.ma, dong.so_luong, dong.ghi_chu);
  const i = Math.min(Math.max(vitri, 0), gio.length);
  return [...gio.slice(0, i), dong, ...gio.slice(i)];
}
export const demMon = (gio) => gio.reduce((s, d) => s + d.so_luong, 0);

/**
 * Dòng giỏ đối chiếu menu: { mon (null = không còn trong menu), conBan }. `con_hang` null (chưa biết) vẫn bán.
 * Dòng thẻ đối chiếu /hang (`dsHang`): { hang, goi, conBan } — còn bán = hạng còn trong /hang, không chỉ cấp, gói `so_thang` còn bán.
 */
export function trangThaiDong(dong, ds, dsHang) {
  if (laThe(dong)) {
    const hang = (Array.isArray(dsHang) ? dsHang : []).find((h) => h && h.id === dong.hang_id) || null;
    const goi = goiBan(hang).find((g) => g.so_thang === dong.so_thang) || null;
    return { hang, goi, conBan: !!goi };
  }
  const mon = (ds || []).find((m) => m.ma === dong.ma) || null;
  return { mon, conBan: !!mon && mon.con_hang !== false };
}

export const duocThanhToan = (gio, ds, dsHang) => gio.length > 0 && gio.every((d) => trangThaiDong(d, ds, dsHang).conBan);

/** Giá CHỈ để khách hình dung: giá một ly tra bảng gia_hang (như Menu) × số lượng. Không phải số → null (ẩn). Tổng thật do POS báo. */
export function giaHinhDung(mon, hangToi, soLuong) {
  const g = giaChoKhach(mon, hangToi);
  return typeof g === 'number' && Number.isFinite(g) ? g * soLuong : null;
}
