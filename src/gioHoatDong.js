// Giờ hoạt động của quán (`/gio-hoat-dong`): một nơi chung để Trang chủ, chân trang màn rộng (KH-UI-4), Hỗ trợ và KH-MUA-1 cùng dùng.
// `nhan_don` (còn nhận đơn App) lưu sẵn cho KH-MUA-1 — việc này chưa có nút đặt đơn nên chưa dùng.
// `lich_tuan[]`: thu 2–7 = Thứ Hai–Thứ Bảy, 8 = Chủ nhật; mo / dong `null` = nghỉ / chưa cài.
import { taoKho } from './kho.js';

const kho = taoKho(null);
export const khoGioHoatDong = kho;
export const layGioHoatDong = kho.lay;
export const datGioHoatDong = kho.dat;

const TEN_THU = { 2: 'Thứ Hai', 3: 'Thứ Ba', 4: 'Thứ Tư', 5: 'Thứ Năm', 6: 'Thứ Sáu', 7: 'Thứ Bảy', 8: 'Chủ nhật' };
export const tenThu = (thu) => TEN_THU[thu] || '';

/** { dangMo, thongBao } để hiện trên Trang chủ; thiếu / hỏng → null (ẩn, không bịa). `thong_bao` hiện NGUYÊN VĂN (POS đã điền giờ mở lại). */
export function trangThaiQuan(gh) {
  if (!gh || typeof gh.dang_mo !== 'boolean') return null;
  return { dangMo: gh.dang_mo, thongBao: typeof gh.thong_bao === 'string' ? gh.thong_bao : '' };
}
