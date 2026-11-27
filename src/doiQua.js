// Đổi điểm lấy quà (KH-DOI-1 — hợp đồng POS ĐÃ HẸN DOI-DIEM-1, thư POS 16.11 mục 1): hàm thuần đọc GET /kho-qua, GET /qua-cua-toi, trả lời POST /doi-diem.
// Không đụng DOM / mạng (bài thử cong_cu/thu_KHDOI1.js nạp thẳng). App KHÔNG tính điểm thật, hạn, nhắc: số điểm còn lại sau đổi = `diem_con` POS; nhắc = `nhac` POS.
// Thứ tự quà = thứ tự POS trả (chủ quán câu 3a) — không xếp lại.

const soNguyen = (n) => Number.isInteger(n);
const chuoi = (s) => (typeof s === 'string' ? s.trim() : '');
const LOAI = ['voucher', 'hien_vat'];
const TRANG_THAI = ['chua_dung', 'da_dung', 'het_han'];
const anhPos = (a) => (typeof a === 'string' && /^https:\/\/[^\s"'<>]+$/.test(a) ? a : null); // chỉ ảnh https của POS; khác → huy hiệu theo loại

/**
 * Kho quà → mảng { ma, ten, loai, diemCan, anh, moTa, nut, thieu }. `diem` = điểm hiện có (GET /diem) — chỉ dùng khi POS không gửi `du_diem`.
 * nut: 'het' (con không phải true) › 'luot' (con_luot_thang = 0) › 'thieu' (không đủ điểm) › 'doi'. thieu = số điểm còn thiếu (> 0) | null (không biết / POS nói chưa đủ).
 */
export function docKhoQua(dl, diem) {
  const ds = dl && Array.isArray(dl.data) ? dl.data : [];
  return ds.filter((q) => q && soNguyen(q.ma) && chuoi(q.ten) && LOAI.includes(q.loai) && soNguyen(q.diem_can) && q.diem_can > 0).map((q) => {
    const biet = soNguyen(diem);
    const du = typeof q.du_diem === 'boolean' ? q.du_diem : biet && diem >= q.diem_can;
    const thieu = !du && biet && q.diem_can > diem ? q.diem_can - diem : null;
    const nut = q.con !== true ? 'het' : q.con_luot_thang === 0 ? 'luot' : !du ? 'thieu' : 'doi';
    return { ma: q.ma, ten: chuoi(q.ten), loai: q.loai, diemCan: q.diem_can, anh: anhPos(q.anh), moTa: typeof q.mo_ta === 'string' ? q.mo_ta : '', nut, thieu };
  });
}

/** "Còn lại" trên bảng PIN — CHỈ hiển thị (số thật là `diem_con` POS trả). Thiếu điểm / điểm chưa biết → null (không bao giờ âm). */
export const conLaiSauDoi = (diem, diemCan) => (soNguyen(diem) && soNguyen(diemCan) && diem >= diemCan ? diem - diemCan : null);

/** Một phiếu quà (dòng GET /qua-cua-toi hoặc `phieu` của POST /doi-diem) → bản sạch; hỏng → null. */
export function docPhieu(p) {
  if (!p || typeof p !== 'object' || !chuoi(p.ma) || !chuoi(p.ten) || !TRANG_THAI.includes(p.trang_thai)) return null;
  return {
    ma: chuoi(p.ma), ten: chuoi(p.ten), anh: anhPos(p.anh), qr: chuoi(p.qr), trangThai: p.trang_thai, hetHan: chuoi(p.het_han),
    nhac: p.trang_thai === 'chua_dung' && p.nhac === true, doiLuc: chuoi(p.doi_luc), dungLuc: chuoi(p.dung_luc),
    diem: soNguyen(p.diem) ? p.diem : null, hoanDiem: soNguyen(p.hoan_diem) ? p.hoan_diem : null,
  };
}

/** Quà của tôi → { cho (chua_dung), xong (da_dung, het_han) }, giữ thứ tự POS (mới trước). */
export function docQuaCuaToi(dl) {
  const ds = (dl && Array.isArray(dl.data) ? dl.data : []).map(docPhieu).filter(Boolean);
  return { cho: ds.filter((p) => p.trangThai === 'chua_dung'), xong: ds.filter((p) => p.trangThai !== 'chua_dung') };
}

/** Trả lời POST /doi-diem → { loai, diemCon, voucherCode, phieu }; thiếu / sai → null (guiDonAnToan coi là "chưa rõ" → gửi lại CÙNG khoá, POS trả lại đúng kết quả cũ). */
export function docKetQuaDoi(r) {
  if (!r || typeof r !== 'object' || !LOAI.includes(r.loai) || !soNguyen(r.diem_con)) return null;
  const voucherCode = chuoi(r.voucher_code) || null, phieu = docPhieu(r.phieu);
  if (r.loai === 'voucher' ? !voucherCode : !phieu) return null;
  return { loai: r.loai, diemCon: r.diem_con, voucherCode: r.loai === 'voucher' ? voucherCode : null, phieu: r.loai === 'hien_vat' ? phieu : null };
}

/** Ngày của chuỗi giờ VN POS ("2026-11-28T23:59:59" / "2026-11-28") → "28/11/2026" (đọc chuỗi, không new Date). Không đọc được → "". */
export function ngayPos(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(chuoi(s));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}
