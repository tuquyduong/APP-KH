// Kết quả trắc nghiệm lưu TRÊN MÁY khách (localStorage, khoá `kh_tracnghiem`) — không gửi đi đâu (chủ quán chốt 27.10).
// Chỉ lưu bản rút gọn: giới tính, ngày giờ VN, điểm 9 nhóm, nhóm chính / phụ, kèm câu trả lời "chịu lạnh / nóng" và tình trạng đặc biệt
// (cần để mở lại ĐÚNG kết quả: nhóm bị loại vì nóng / lạnh, gợi ý an toàn). KHÔNG lưu từng câu trả lời. Kho tiêm vào để thử (như menuLuu.js).
export const KHOA_TRAC_NGHIEM = 'kh_tracnghiem';
const KHOA = KHOA_TRAC_NGHIEM;
const kho = () => localStorage;

const GIOI_TINH = ['nam', 'nu'];
const KHI_HAU = ['lanh', 'nong', 'deu'];
const MAU_NGAY = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}$/;

/** Kết luận (tracNghiem.ketLuan) + giờ VN → bản lưu. */
export const rutGon = (kl, ngay) => ({
  gioiTinh: kl.gioiTinh, ngay, diem: kl.t, khiHau: kl.khiHau, anToan: kl.anToan.slice(), chinh: kl.picks[0], phu: kl.picks[1] || null,
});

/** Lưu; kho bị chặn (cửa sổ riêng tư…) thì trả false — kết quả vẫn xem được trong phiên. */
export function ghiKetQua(ban, k = kho) {
  try { (typeof k === 'function' ? k() : k).setItem(KHOA, JSON.stringify(ban)); return true; } catch { return false; }
}

/** Đọc bản đã lưu; không có / hỏng / sai dạng → null. Chỉ nhận đúng các trường trên, tình trạng đặc biệt chỉ nhận chữ có trong danh sách của giới đó. */
export function docKetQua(DL, k = kho) {
  try {
    const o = JSON.parse((typeof k === 'function' ? k() : k).getItem(KHOA));
    if (!o || !GIOI_TINH.includes(o.gioiTinh) || !KHI_HAU.includes(o.khiHau) || typeof o.ngay !== 'string' || !MAU_NGAY.test(o.ngay)) return null;
    if (!o.diem || !Object.keys(DL.groups).every((g) => Number.isFinite(o.diem[g]) && o.diem[g] >= 0 && o.diem[g] <= 100)) return null;
    const diem = {};
    Object.keys(DL.groups).forEach((g) => { diem[g] = o.diem[g]; });
    const anToan = (Array.isArray(o.anToan) ? o.anToan : []).filter((x) => DL.safetyChecklist[o.gioiTinh].includes(x));
    return { gioiTinh: o.gioiTinh, ngay: o.ngay, diem, khiHau: o.khiHau, anToan }; // nhóm chính / phụ tính lại từ điểm (một nguồn)
  } catch { return null; }
}

/** Xoá sạch khoá. */
export function xoaKetQua(k = kho) {
  try { (typeof k === 'function' ? k() : k).removeItem(KHOA); } catch { /* không có gì để xoá */ }
}
