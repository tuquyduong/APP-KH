// Giờ hoạt động của quán (`/gio-hoat-dong`): một nơi chung để Trang chủ, chân trang màn rộng (KH-UI-4), Hỗ trợ và KH-MUA-1 cùng dùng.
// `nhan_don` (còn nhận đơn App) lưu sẵn cho KH-MUA-1 — việc này chưa có nút đặt đơn nên chưa dùng.
// `lich_tuan[]`: thu 2–7 = Thứ Hai–Thứ Bảy, 8 = Chủ nhật; mo / dong `null` = nghỉ / chưa cài.
import { taoKho } from './kho.js';
import { nd } from './noiDung/nd.js';

const kho = taoKho(null);
export const khoGioHoatDong = kho;
export const layGioHoatDong = kho.lay;
export const datGioHoatDong = kho.dat;

const THU_HOP_LE = [2, 3, 4, 5, 6, 7, 8];
export const tenThu = (thu) => (THU_HOP_LE.includes(Number(thu)) ? nd(`thu.t${Number(thu)}`) : '');

/** { dangMo, thongBao } để hiện trên Trang chủ; thiếu / hỏng → null (ẩn, không bịa). `thong_bao` hiện NGUYÊN VĂN (POS đã điền giờ mở lại). */
export function trangThaiQuan(gh) {
  if (!gh || typeof gh.dang_mo !== 'boolean') return null;
  return { dangMo: gh.dang_mo, thongBao: typeof gh.thong_bao === 'string' ? gh.thong_bao : '' };
}
