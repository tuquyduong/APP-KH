// Danh mục nội dung App KH — gộp mọi nhóm màn (mỗi nhóm MỘT tệp trong thư mục này). /admin (KH-ADMIN-1) tự sinh bảng sửa từ danh mục này.
// Nhóm màn mới: thêm tệp `<nhom>.js` xuất mảng mục rồi thêm vào DANH_MUC. Khuôn mục: src/noiDung/nd.js.
import { KHUNG_CHUNG } from './khungChung.js';
import { TRANG_CHU } from './trangChu.js';
import { MENU } from './menu.js';
import { DON_HANG } from './donHang.js';
import { TAI_KHOAN } from './taiKhoan.js';
import { KE_HOACH } from './keHoach.js';
import { TIEN_ICH } from './tienIch.js';

// Mỗi nhóm một tệp, mỗi việc chỉ điền tệp của mình (chat tạo sẵn 11.11.2026 — các việc chạy song song không sửa chung tệp này).
export const DANH_MUC = [...KHUNG_CHUNG, ...TRANG_CHU, ...MENU, ...DON_HANG, ...TAI_KHOAN, ...KE_HOACH, ...TIEN_ICH];

/** Trang đích chung của nút (`loai: 'nut'`, như DESTS demo): [mã, tên cho chủ quán]. Màn có nút phải mở được mọi đích trong bảng này. */
export const DICH = [
  ['menu', 'Menu'], ['giovang', 'Menu · Giờ vàng'], ['tracnghiem', 'Trắc nghiệm thể trạng'], ['kehoach', 'Kế hoạch và nhắc việc'], ['uudai', 'Ưu đãi'],
];
