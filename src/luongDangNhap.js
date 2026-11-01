// Luồng đăng nhập (hàm thuần, không đụng DOM / mạng — bài thử cong_cu/thu_KHXEM1.js nạp thẳng).

// Chỗ khách chưa đăng nhập bấm vào thì phải đăng nhập: Tài khoản (và trang con), mã thành viên (QR), trắc nghiệm, thanh toán — bảng ở duongDan.js.
// Trang chủ, Menu, Trang món, Ưu đãi: ai cũng xem. Riêng Ưu đãi khi còn mã hoá đơn (link QR) thì phải đăng nhập để nhận điểm, không để mất mã (KH-UI-3d B3).
import { tiepHopLe, trangCanDangNhap } from './duongDan.js';

/** Vào trang `trang` (mã trang trong bảng đường dẫn) có phải mở màn Đăng nhập trước không? Đã đăng nhập thì không bao giờ chặn. `maCho` = mã hoá đơn đang giữ. */
export const canDangNhap = (trang, daDangNhap, maCho = '') => !daDangNhap && (trangCanDangNhap(trang) || (trang === 'uudai' && !!maCho));

/** Đăng nhập xong đi đâu (đường dẫn): còn mã hoá đơn (link QR) → Ưu đãi để nhận; không thì trang `tiep` đã bấm; tiep lạ / thiếu → Trang chủ. */
export const dichSauDangNhap = (tiep, maCho) => (maCho ? '/uudai' : tiepHopLe(tiep) || '/trangchu');

/** Xin mã xong → sang bước "Mã"; nhớ POS bảo lấy mã ở quầy hay gửi Zalo. */
export const buocSauXinMa = (r) => ({ buoc: 'ma', taiQuay: !!(r && r.lay_ma_tai_quay) });

/** Xác minh báo lỗi: CAN_TEN (khách mới) → màn "Thông tin của bạn"; MA_HET_HAN → ở nguyên bước (giữ chữ đã nhập), bật cờ hết hạn; lỗi khác → ở nguyên. */
export function buocSauLoiXacMinh(loi, buocHienTai) {
  const code = loi && loi.code;
  if (code === 'CAN_TEN') return { buoc: 'thongtin', hetHan: false };
  return { buoc: buocHienTai, hetHan: code === 'MA_HET_HAN' };
}

/** Bước 3 đủ điều kiện "Hoàn tất": Tên và Cách xưng hô bắt buộc; Địa chỉ không. */
export const duDieuKienHoanTat = ({ ten, xungHo }) => !!String(ten || '').trim() && !!xungHo;

/** Trường gửi thêm ở xac-minh (hợp đồng v3): xung_ho = mã không dấu; dia_chi chỉ gửi khi có chữ. Trước v3 POS bỏ qua, không báo lỗi. */
export function truongThem(xungHo, diaChi) {
  const t = { xung_ho: xungHo };
  const dc = String(diaChi || '').trim();
  if (dc) t.dia_chi = dc;
  return t;
}
