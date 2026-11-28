// Lọc / tìm món (hàm thuần, không đụng DOM).
import { nd } from './noiDung/nd.js';

/** Bỏ dấu, chữ thường: "Trà Đông Y" → "tra dong y". */
export function boDau(chuoi) {
  return String(chuoi || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/** Tìm theo tên, không dấu cũng ra; ô trống → giữ nguyên. */
export function timMon(ds, tuKhoa) {
  const k = boDau(tuKhoa).trim();
  return k ? ds.filter((m) => boDau(m.ten).includes(k)) : ds;
}

/** Nội dung trang trí của món theo MÃ món POS (bảng `noiDung/mon.js`); không có → null. */
export function noiDungMon(bang, ma) {
  return Object.prototype.hasOwnProperty.call(bang, ma) ? bang[ma] : null;
}

/** Món có nhu cầu này trong bảng nội dung. Bảng rỗng → []. */
export function locTheoNhuCau(ds, bang, nhuCau) {
  return ds.filter((m) => (noiDungMon(bang, m.ma)?.nhuCau || []).includes(nhuCau));
}

/** Chỉ giữ nhu cầu có ít nhất một món (nhóm không có món → ẩn ô). */
export function nhuCauCoMon(dsNhuCau, ds, bang) {
  return dsNhuCau.filter((n) => locTheoNhuCau(ds, bang, n.ten).length > 0);
}

// Biểu tượng + màu nền ô món theo nhóm (demo CATS: gaiwan / drop / phin / jar / fruit). Khớp theo TÊN nhóm POS; nhóm lạ → mặc định (không bịa).
const NHOM_DEMO = [
  { khop: /\btra\b/, ic: 'gaiwan', bg: '#FCD7E5' },
  { khop: /\bep\b|rau cu qua/, ic: 'drop', bg: '#CDEFE0' },
  { khop: /ca phe|\bcf\b/, ic: 'phin', bg: '#FCE0C8' },
  { khop: /duong sinh|duong the/, ic: 'jar', bg: '#E5D9FA' },
  { khop: /hoa qua|trai cay/, ic: 'fruit', bg: '#FFE3C4' },
];
export const NHOM_MAC_DINH = { ic: 'cabinet', bg: '#FBE7EC' };

/** { ic, bg } của một nhóm món POS; thiếu / lạ → NHOM_MAC_DINH. */
export function bieuTuongNhom(nhom) {
  const ten = boDau(nhom);
  return NHOM_DEMO.find((n) => n.khop.test(ten)) || NHOM_MAC_DINH;
}

/** MÃ nhóm POS (v19: `nhom` = mã ổn định; POS cũ: `nhom` là tên). Thiếu → "". */
export const maNhom = (m) => (m && typeof m.nhom === 'string' ? m.nhom.trim() : '');

/** Tên hiển thị của nhóm: `nhom_ten` (đã cắt) → `nhom` (POS cũ) → chữ "Khác" của danh mục. */
export function tenNhom(m) {
  const ten = m && typeof m.nhom_ten === 'string' ? m.nhom_ten.trim() : '';
  return ten || maNhom(m) || nd('menu.nhomKhac');
}

/** Thứ tự nhóm POS (nhỏ đứng trước); không phải số hữu hạn → 9999 (cuối). */
export const thuTuNhom = (m) => (m && Number.isFinite(m.nhom_thu_tu) ? m.nhom_thu_tu : 9999);

/** Khoá ổn định của nhóm (mã; món không mã → tên "Khác") — dùng cho ô chọn, đường dẫn, lọc. */
export const khoaNhom = (m) => maNhom(m) || tenNhom(m);

/** { ic, bg } của một món theo tên nhóm POS của nó. */
export const bieuTuongMon = (m) => bieuTuongNhom(tenNhom(m));

/** Nhóm món theo MÃ POS → [tên, món[], khoá]; xếp theo thứ tự nhóm POS (bằng nhau giữ thứ tự xuất hiện); món trong nhóm giữ thứ tự POS. */
export function nhomTheoTen(ds) {
  const ban = new Map();
  for (const m of ds) {
    const ma = maNhom(m);
    if (!ban.has(ma)) ban.set(ma, { ten: tenNhom(m), thuTu: thuTuNhom(m), khoa: khoaNhom(m), mon: [] });
    const g = ban.get(ma);
    g.thuTu = Math.min(g.thuTu, thuTuNhom(m)); // món đầu thiếu số mà món sau có → nhóm vẫn theo số của POS
    g.mon.push(m);
  }
  return [...ban.values()].sort((a, b) => a.thuTu - b.thuTu).map((g) => [g.ten, g.mon, g.khoa]);
}
