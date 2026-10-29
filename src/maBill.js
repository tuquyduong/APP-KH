// Mã nhận điểm / mã bill (hàm thuần, không đụng DOM — bài thử nạp thẳng). Hợp đồng: chỉ [A-Z0-9], tối đa 32.

const DANG_MA = /^[A-Z0-9]{1,32}$/;

/** Cắt khoảng trắng đầu / cuối, đổi CHỮ HOA; sai dạng → '' (bỏ qua). */
export function chuanHoaMa(chuoi) {
  const ma = String(chuoi ?? '').trim().toUpperCase();
  return DANG_MA.test(ma) ? ma : '';
}

/** Đọc mã từ phần `?…` của địa chỉ (vd "?ma=ab12cd&utm=x"). Không có / sai dạng → ''. */
export function docMaTuDiaChi(search) {
  return chuanHoaMa(new URLSearchParams(String(search || '')).get('ma'));
}

/** Phần `?…` sau khi bỏ tham số `ma` (giữ tham số khác) — để xoá mã khỏi thanh địa chỉ. */
export function boMaKhoiDiaChi(search) {
  const p = new URLSearchParams(String(search || ''));
  p.delete('ma');
  const s = p.toString();
  return s ? `?${s}` : '';
}
