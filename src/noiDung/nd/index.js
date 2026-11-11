// Danh mục nội dung App KH — gộp mọi nhóm màn (mỗi nhóm MỘT tệp trong thư mục này). /admin (KH-ADMIN-1) tự sinh bảng sửa từ danh mục này.
// Nhóm màn mới: thêm tệp `<nhom>.js` xuất mảng mục rồi thêm vào DANH_MUC. Khuôn mục: src/noiDung/nd.js.
import { KHUNG_CHUNG } from './khungChung.js';
import { TRANG_CHU } from './trangChu.js';

export const DANH_MUC = [...KHUNG_CHUNG, ...TRANG_CHU];

/** Trang đích chung của nút (`loai: 'nut'`, như DESTS demo): [mã, tên cho chủ quán]. Màn có nút phải mở được mọi đích trong bảng này. */
export const DICH = [
  ['menu', 'Menu'], ['giovang', 'Menu · Giờ vàng'], ['tracnghiem', 'Trắc nghiệm thể trạng'], ['kehoach', 'Kế hoạch và nhắc việc'], ['uudai', 'Ưu đãi'],
];
