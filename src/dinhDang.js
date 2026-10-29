// Hàm thuần của App KH (không đụng DOM / mạng) — bài thử cong_cu/thu_KHUNG.js nạp thẳng file này.

/** 25000 → "25.000đ". Không phải số → "" (không bịa số, CLAUDE.md §5.8). */
export function dinhDangGia(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '';
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
}

/** 1250 → "1.250" (điểm). Không phải số → "" (không bịa số). */
export function dinhDangSo(n) {
  return typeof n === 'number' && Number.isFinite(n) ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
}

/** Mô tả mức giảm của mã: percent → "giảm 10%", loại khác → "giảm 20.000đ". */
export function moTaGiam(loai, giaTri) {
  return loai === 'percent' ? `giảm ${giaTri}%` : `giảm ${dinhDangGia(Number(giaTri))}`;
}

/** "2026-10-22T14:05:00" (giờ VN từ máy chủ) → "14:05 22/10/2026". Không đọc được → "". */
export function dinhDangNgay(chuoi) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(String(chuoi || ''));
  if (!m) return '';
  const ngay = `${m[3]}/${m[2]}/${m[1]}`;
  return m[4] ? `${m[4]}:${m[5]} ${ngay}` : ngay;
}

// Lời dự phòng khi máy chủ không trả `code` (mất mạng, 5xx chỉ có { error }…).
const LOI_DU_PHONG = {
  MANG_LOI: 'Không kết nối được. Kiểm tra mạng rồi thử lại.',
  KH_CHUA_CAU_HINH: 'App khách chưa sẵn sàng. Vui lòng quay lại sau.',
  KH_TOKEN_SAI: 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.',
  LOI_MAY_CHU: 'Máy chủ đang bận. Thử lại sau ít phút.',
};
const LOI_CHUNG = 'Có lỗi xảy ra. Thử lại sau.';

/** Chọn lời hiện cho khách: có `code` + `error` của POS → nguyên `error`; KHÔNG có `code` (vd 500 chỉ { error }, lời máy) → lời chung LOI_MAY_CHU. */
export function loiTheoCode(code, error) {
  if (!code) return LOI_DU_PHONG.LOI_MAY_CHU;
  if (typeof error === 'string' && error.trim()) return error;
  return LOI_DU_PHONG[code] || LOI_CHUNG;
}

/** Ghép địa chỉ POS: bỏ `/` thừa cuối của gốc; gốc không đặt → '' (cùng gốc, dùng proxy dev). */
export function ghepDiaChi(goc, duong) {
  const g = typeof goc === 'string' ? goc.trim().replace(/\/+$/, '') : '';
  return `${g}/api/kh${duong}`;
}

/** "0901234567" → "090 xxx 4567" (che giữa). Không đủ 9 số → "" (không bịa). */
export function cheSdt(sdt) {
  const so = String(sdt || '').replace(/\D/g, '');
  if (so.length < 9) return '';
  return `${so.slice(0, 3)} xxx ${so.slice(-4)}`;
}

/** "Chào <tên>" — chưa có tên thì "Chào bạn". */
export const loiChao = (ten) => `Chào ${String(ten || '').trim() || 'bạn'}`;
