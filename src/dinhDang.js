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
  XUNG_HO_SAI: 'Cách xưng hô chưa hợp lệ. Hãy chọn lại.',
  DIA_CHI_QUA_DAI: 'Địa chỉ quá dài (tối đa 300 ký tự).',
  TEN_KHONG_HOP_LE: 'Tên chưa hợp lệ. Hãy nhập lại.',
  YEU_CAU_KHONG_HOP_LE: 'Thông tin gửi đi chưa hợp lệ. Thử lại.',
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

/** Từ cuối của họ tên, viết hoa chữ đầu ("nguyễn thị linh" → "Linh"); không có tên → "". */
export const tenNgan = (ten) => { const t = String(ten || '').trim().split(/\s+/).pop() || ''; return t.charAt(0).toUpperCase() + t.slice(1); };

/**
 * Lời chào chia phần: { dau: "Chào buổi sáng" | "Chào", xung: "chị" | "" (chữ thường, đứng giữa câu), ten: "Linh" | "bạn" | "" }.
 * `gio` = giờ VN của POS ("YYYY-MM-DD HH:mm:ss" hoặc "…THH:mm:ss"); không đọc được → không có buổi. Mốc: 5–11 sáng · 11–13 trưa · 13–18 chiều · còn lại tối.
 */
export function chiaLoiChao(gio, xungHo, ten) {
  const m = /[T ](\d{2}):\d{2}/.exec(String(gio || ''));
  const h = m ? +m[1] : -1;
  const buoi = h < 0 ? '' : h >= 5 && h < 11 ? ' buổi sáng' : h >= 11 && h < 13 ? ' buổi trưa' : h >= 13 && h < 18 ? ' buổi chiều' : ' buổi tối';
  const xung = String(xungHo || '').trim().toLowerCase();
  return { dau: `Chào${buoi}`, xung, ten: tenNgan(ten) || (xung ? '' : 'bạn') };
}

/** "Chào buổi sáng, chị Linh!" — thiếu phần nào bỏ phần đó (chưa có giờ: "Chào chị Linh!"; chưa có gì: "Chào bạn!"). */
export function loiChao(gio, xungHo, ten) {
  const { dau, xung, ten: t } = chiaLoiChao(gio, xungHo, ten);
  return `${dau}${dau === 'Chào' ? ' ' : ', '}${[xung, t].filter(Boolean).join(' ')}!`;
}
