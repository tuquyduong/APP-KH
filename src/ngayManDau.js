// Màn mở đầu ĐẦY ĐỦ chỉ ở lần mở đầu tiên của ngày (chủ quán chốt 01.11): nhớ NGÀY đã xem ở localStorage. Kho tiêm vào để thử.
import { gioVn } from './menuLuu.js';

const KHOA_NGAY_MAN_DAU = 'kh_ngay_man_dau';
const kho = () => localStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);

// NGOẠI LỆ có chủ đích với CLAUDE.md §6: ngày theo ĐỒNG HỒ MÁY (giờ VN) — chỉ quyết hiện / không hiện hiệu ứng màn mở, KHÔNG dùng cho tiền, giờ mở cửa hay số liệu.
export const homNayMay = (bay = new Date()) => gioVn(bay).slice(0, 10);
export const canHienManDau = (ngayDaXem, homNay) => ngayDaXem !== homNay;

/** Ngày đã xem gần nhất; chưa có / kho chặn → null (→ hiện màn mở). */
export function docNgayDaXem(k = kho) {
  try { return lay(k).getItem(KHOA_NGAY_MAN_DAU); } catch { return null; }
}
export function ghiNgayDaXem(ngay, k = kho) {
  try { lay(k).setItem(KHOA_NGAY_MAN_DAU, ngay); return true; } catch { return false; }
}
