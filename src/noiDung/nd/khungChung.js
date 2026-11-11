// Danh mục nội dung — KHUNG CHUNG: thanh tab, màn mở, nút chung của khung màn, tên màn trên tab trình duyệt, câu báo lỗi chung, khung lời chào.
// Khuôn mục và luật: src/noiDung/nd.js (CLAUDE.md §11). macDinh = chữ đang chạy (chép nguyên).
import { KHAU_HIEU } from '../thuongHieu.js';

const M = 'Khung chung';
const chu = (khoa, ten, macDinh, them = {}) => ({ khoa, man: M, ten, loai: 'chu', macDinh, ...them });
const tieuDe = (trang, ten) => chu(`tieuDe.${trang}`, `Tên màn trên tab trình duyệt: ${ten}`, ten);

export const KHUNG_CHUNG = [
  // Thanh tab
  chu('tab.trangchu', 'Thanh tab: Trang chủ', 'Trang chủ'),
  chu('tab.menu', 'Thanh tab: Menu', 'Menu'),
  chu('tab.giohang', 'Thanh tab: Giỏ hàng', 'Giỏ hàng'),
  chu('tab.uudai', 'Thanh tab: Ưu đãi', 'Ưu đãi'),
  chu('tab.taikhoan', 'Thanh tab: Tài khoản', 'Tài khoản'),
  chu('tab.aria', 'Thanh tab: tên đọc cho máy đọc màn hình', 'Điều hướng chính'),
  chu('tab.soMon', 'Thanh tab: số món trên tab Giỏ hàng (máy đọc màn hình)', '{so} món trong giỏ', { bien: ['so'] }),
  // Khung màn
  chu('khung.quayLai', 'Nút quay lại đầu màn con (máy đọc màn hình)', 'Quay lại'),
  chu('khung.maQR', 'Nút mã QR góc phải (máy đọc màn hình)', 'Mã QR thành viên'),
  // Màn mở + thương hiệu
  chu('brand.ten', 'Tên quán (máy đọc màn hình, màn mở)', 'Tứ Quý Đường'),
  chu('brand.slogan', 'Khẩu hiệu thương hiệu (màn mở, dưới lời chào Trang chủ)', KHAU_HIEU, { toiDa: 40 }),
  chu('splash.boQua', 'Màn mở: nút Bỏ qua', 'Bỏ qua ›'),
  chu('splash.am', 'Màn mở: nút âm thanh (máy đọc màn hình)', 'Âm thanh'),
  chu('splash.batAm', 'Màn mở: chữ nút âm thanh', 'Bật âm thanh'),
  { khoa: 'splash.logo', man: M, ten: 'Màn mở: biểu tượng', loai: 'anh', macDinh: '/anh/logo-bieu-tuong.webp', tiLe: '1:1' },
  { khoa: 'splash.chu', man: M, ten: 'Màn mở: chữ Tứ Quý Đường (ảnh)', loai: 'anh', macDinh: '/anh/logo-chu.webp', tiLe: 'tự do' },
  // Tên màn trên tab trình duyệt: "<tên màn> · Tứ Quý Đường"
  chu('tieuDe.mau', 'Tên tab trình duyệt (khung)', '{man} · Tứ Quý Đường', { bien: ['man'] }),
  tieuDe('trangchu', 'Trang chủ'), tieuDe('menu', 'Menu'), tieuDe('mon', 'Món'), tieuDe('giohang', 'Giỏ hàng'), tieuDe('thanhtoan', 'Thanh toán'),
  tieuDe('theodoi', 'Theo dõi đơn'), tieuDe('uudai', 'Ưu đãi'), tieuDe('taikhoan', 'Tài khoản'), tieuDe('thongtin', 'Thông tin cá nhân'), tieuDe('donhang', 'Đơn hàng'),
  tieuDe('don', 'Chi tiết đơn'), tieuDe('hotro', 'Hỗ trợ'), tieuDe('qr', 'Mã thành viên'), tieuDe('dangnhap', 'Đăng nhập'), tieuDe('tracnghiem', 'Trắc nghiệm'),
  tieuDe('tracnghiemketqua', 'Kết quả thể trạng'), tieuDe('kiemkhop', 'Kiểm khớp POS'), tieuDe('kehoach', 'Kế hoạch và nhắc việc'),
  tieuDe('vankhan', 'Văn khấn và lễ cúng'), tieuDe('khongthay', 'Không tìm thấy trang'),
  // Câu báo lỗi chung khi POS không trả lời của mình (dinhDang.loiTheoCode)
  chu('loi.MANG_LOI', 'Báo lỗi: mất mạng', 'Không kết nối được. Kiểm tra mạng rồi thử lại.'),
  chu('loi.KH_CHUA_CAU_HINH', 'Báo lỗi: app chưa sẵn sàng', 'App khách chưa sẵn sàng. Vui lòng quay lại sau.'),
  chu('loi.KH_TOKEN_SAI', 'Báo lỗi: hết phiên đăng nhập', 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.'),
  chu('loi.LOI_MAY_CHU', 'Báo lỗi: máy chủ bận', 'Máy chủ đang bận. Thử lại sau ít phút.'),
  chu('loi.XUNG_HO_SAI', 'Báo lỗi: cách xưng hô sai', 'Cách xưng hô chưa hợp lệ. Hãy chọn lại.'),
  chu('loi.DIA_CHI_QUA_DAI', 'Báo lỗi: địa chỉ quá dài', 'Địa chỉ quá dài (tối đa 300 ký tự).'),
  chu('loi.TEN_KHONG_HOP_LE', 'Báo lỗi: tên sai', 'Tên chưa hợp lệ. Hãy nhập lại.'),
  chu('loi.YEU_CAU_KHONG_HOP_LE', 'Báo lỗi: thông tin gửi sai', 'Thông tin gửi đi chưa hợp lệ. Thử lại.'),
  chu('loi.chung', 'Báo lỗi: lỗi khác', 'Có lỗi xảy ra. Thử lại sau.'),
  // Lời chào (Trang chủ, Hồ sơ): buổi + xưng hô do app tự chọn theo giờ POS; chữ từng phần sửa được.
  chu('chao.dau', 'Lời chào: chữ mở đầu', 'Chào'),
  chu('chao.sang', 'Lời chào: buổi sáng (5–11 giờ)', 'buổi sáng'),
  chu('chao.trua', 'Lời chào: buổi trưa (11–13 giờ)', 'buổi trưa'),
  chu('chao.chieu', 'Lời chào: buổi chiều (13–18 giờ)', 'buổi chiều'),
  chu('chao.toi', 'Lời chào: buổi tối', 'buổi tối'),
  chu('chao.ban', 'Lời chào: gọi khách chưa có tên', 'bạn'),
];
