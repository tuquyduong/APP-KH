// Hàm thuần của App KH (không đụng DOM / mạng) — bài thử cong_cu/thu_KHUNG.js nạp thẳng file này.
import { nd } from './noiDung/nd.js';

/** 25000 → "25.000đ". Không phải số → "" (không bịa số, CLAUDE.md §5.8). Đơn vị tiền: danh mục `gia.donVi`. */
export function dinhDangGia(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '';
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + nd('gia.donVi');
}

/** 1250 → "1.250" (điểm). Không phải số → "" (không bịa số). */
export function dinhDangSo(n) {
  return typeof n === 'number' && Number.isFinite(n) ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
}

/** Mô tả mức giảm của mã: percent → "giảm 10%", loại khác → "giảm 20.000đ". */
export function moTaGiam(loai, giaTri) {
  return nd('gia.giam', { giaTri: loai === 'percent' ? `${giaTri}%` : dinhDangGia(Number(giaTri)) });
}

/** "2026-10-22T14:05:00" (giờ VN từ máy chủ) → "14:05 22/10/2026". Không đọc được → "". */
export function dinhDangNgay(chuoi) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(String(chuoi || ''));
  if (!m) return '';
  const ngay = `${m[3]}/${m[2]}/${m[1]}`;
  return m[4] ? `${m[4]}:${m[5]} ${ngay}` : ngay;
}

// Lời dự phòng khi máy chủ không trả `code` (mất mạng, 5xx chỉ có { error }…): chữ ở danh mục nội dung `loi.<code>` (src/noiDung/nd/khungChung.js).
const LOI_DU_PHONG = ['MANG_LOI', 'KH_CHUA_CAU_HINH', 'KH_TOKEN_SAI', 'LOI_MAY_CHU', 'XUNG_HO_SAI', 'DIA_CHI_QUA_DAI', 'TEN_KHONG_HOP_LE', 'YEU_CAU_KHONG_HOP_LE'];

/** Chọn lời hiện cho khách: có `code` + `error` của POS → nguyên `error`; KHÔNG có `code` (vd 500 chỉ { error }, lời máy) → lời chung LOI_MAY_CHU. */
export function loiTheoCode(code, error) {
  if (!code) return nd('loi.LOI_MAY_CHU');
  if (typeof error === 'string' && error.trim()) return error;
  return nd(LOI_DU_PHONG.includes(code) ? `loi.${code}` : 'loi.chung');
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

/**
 * Ngày lịch `YYYY-MM-DD` (ngày sinh của POS, không giờ / múi giờ) → { nam, thang, ngay } (số); sai dạng hoặc sai lịch (30/02…) → null.
 * Tách chuỗi, không đọc bằng đối tượng Date (CLAUDE.md §6).
 */
export function tachNgaySinh(chuoi) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(chuoi || ''));
  if (!m) return null;
  const nam = +m[1], thang = +m[2], ngay = +m[3];
  const nhuan = (nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0;
  const toiDa = thang === 2 ? (nhuan ? 29 : 28) : [4, 6, 9, 11].includes(thang) ? 30 : 31;
  return thang >= 1 && thang <= 12 && ngay >= 1 && ngay <= toiDa ? { nam, thang, ngay } : null;
}

/** "1990-03-12" → "12/03/1990"; không đọc được → "". */
export function hienNgaySinh(chuoi) {
  const t = tachNgaySinh(chuoi);
  return t ? `${chuoi.slice(8, 10)}/${chuoi.slice(5, 7)}/${t.nam}` : '';
}

/**
 * Lời chào chia phần: { dau: "Chào buổi sáng" | "Chào", xung: "chị" | "" (chữ thường, đứng giữa câu), ten: "Linh P" | "bạn" | "" }.
 * Có xưng hô → gọi xưng hô + CHỮ CUỐI của tên ("anh" + "Anh Linh" → "anh Linh"; chủ quán 11.11); không xưng hô → tên ĐỦ (cắt hai đầu, gộp khoảng trắng thừa, giữ hoa / thường — chốt 03.11).
 * `gio` = giờ VN của POS ("YYYY-MM-DD HH:mm:ss" hoặc "…THH:mm:ss"); không đọc được → không có buổi. Mốc: 5–11 sáng · 11–13 trưa · 13–18 chiều · còn lại tối.
 */
export function chiaLoiChao(gio, xungHo, ten) {
  const m = /[T ](\d{2}):\d{2}/.exec(String(gio || ''));
  const h = m ? +m[1] : -1;
  const buoi = h < 0 ? '' : h >= 5 && h < 11 ? 'sang' : h >= 11 && h < 13 ? 'trua' : h >= 13 && h < 18 ? 'chieu' : 'toi';
  const xung = String(xungHo || '').trim().toLowerCase();
  const dau = buoi ? `${nd('chao.dau')} ${nd('chao.' + buoi)}` : nd('chao.dau');
  const day = String(ten || '').trim().replace(/\s+/g, ' ');
  return { dau, coBuoi: !!buoi, xung, ten: xung ? day.split(' ').pop() : day || nd('chao.ban') };
}

/** "Chào buổi sáng, chị Linh!" — thiếu phần nào bỏ phần đó (chưa có giờ: "Chào chị Linh!"; chưa có gì: "Chào bạn!"). */
export function loiChao(gio, xungHo, ten) {
  const { dau, coBuoi, xung, ten: t } = chiaLoiChao(gio, xungHo, ten);
  return `${dau}${coBuoi ? ', ' : ' '}${[xung, t].filter(Boolean).join(' ')}!`;
}
