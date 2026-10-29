// Lọc / tìm món (hàm thuần, không đụng DOM).

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

/** Nhóm món theo `nhom` POS, giữ thứ tự xuất hiện; thiếu nhóm → "Khác". */
export function nhomTheoTen(ds) {
  const ban = new Map();
  for (const m of ds) {
    const ten = m.nhom || 'Khác';
    if (!ban.has(ten)) ban.set(ten, []);
    ban.get(ten).push(m);
  }
  return [...ban];
}
