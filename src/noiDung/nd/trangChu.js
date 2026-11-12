// Danh mục nội dung — TRANG CHỦ (demo #home). Khoá theo demo data-cms khi demo có; ẩn / hiện khối theo demo SECS (tiền tố "hien.").
// Không import tệp nào nhập src/dinhDang.js (dinhDang → nd.js → danh mục): vòng nạp làm sập khi nạp danh mục trước (bài thử thu_KHND3a canh).
// Khối demo chưa có ở App (Video hướng dẫn home.guide, Mời bạn bè home.ref) KHÔNG khai — xem viec/KH-ND-3a/doi_chieu_demo.md.
import { NHU_CAU } from '../nhuCau.js';

const M = 'Trang chủ';
const chu = (khoa, ten, macDinh, them = {}) => ({ khoa, man: M, ten, loai: 'chu', macDinh, ...them });
const hien = (ma, ten) => ({ khoa: `hien.${ma}`, man: M, ten: `Hiện khối: ${ten}`, loai: 'battat', macDinh: true });
const khoa = (k, ten, khoaBoi, chiDuong) => ({ khoa: k, man: M, ten, khoaBoi, chiDuong });
const ANH_BANNER = '/anh/banner-trang-chu.webp';

export const TRANG_CHU = [
  // Đầu trang
  chu('home.sub', 'Dòng dưới lời chào', 'Tứ Quý Đường — {khauHieu}', { bien: ['khauHieu'] }),
  chu('home.mo', 'Dòng "quán đang mở"', 'Quán đang mở cửa'),
  khoa('home.quan', 'Thông báo quán đóng / mở lại', 'pos', 'POS › Cài đặt › Giờ hoạt động'),
  // Thẻ hội viên / thẻ mời
  { khoa: 'home.logo', man: M, ten: 'Logo nhỏ trên thẻ hội viên', loai: 'anh', macDinh: '/anh/logo-nho.webp', tiLe: '1:1' },
  chu('home.the.nhan', 'Thẻ hội viên: tên quán', 'TỨ QUÝ ĐƯỜNG'),
  chu('home.the.phu', 'Thẻ hội viên: dòng nhỏ', 'Thẻ hội viên'),
  chu('home.hang', 'Thẻ hội viên: dòng hạng', 'Hạng {hang}', { bien: ['hang'] }),
  khoa('home.hang.ten', 'Tên hạng của khách', 'pos', 'POS › Cài đặt › Hạng thành viên'),
  chu('home.diem', 'Thẻ hội viên: chữ sau số điểm', 'điểm'),
  khoa('home.diem.so', 'Số điểm của khách', 'pos', 'POS › Khách hàng'),
  chu('home.moi.t', 'Thẻ mời (chưa đăng nhập): tiêu đề', 'Thành viên Tứ Quý Đường'),
  chu('home.moi.p', 'Thẻ mời (chưa đăng nhập): dòng mời', 'Đăng nhập / Đăng ký để tích điểm, nhận ưu đãi'),
  chu('home.moi.nut', 'Thẻ mời (chưa đăng nhập): nút', 'Đăng nhập'),
  // Ô Kế hoạch và nhắc việc (demo utilCal)
  chu('home.cal.tag', 'Ô Kế hoạch: nhãn', 'KẾ HOẠCH VÀ NHẮC VIỆC'),
  chu('home.cala', 'Ô Kế hoạch: dòng đậm', 'Trợ lý của bạn'),
  chu('home.calb', 'Ô Kế hoạch: viên nhỏ', 'Miễn phí'),
  chu('home.cal.am', 'Ô Kế hoạch: ngày âm', 'Âm lịch {ngay}/{thang}{nhuan}', { bien: ['ngay', 'thang', 'nhuan'] }),
  chu('home.cal.nhuan', 'Ô Kế hoạch: chữ sau tháng nhuận', ' nhuận'),
  chu('home.cal.tiet', 'Ô Kế hoạch: tiết khí', 'Tiết {tiet}', { bien: ['tiet'] }),
  chu('home.cal.viec', 'Ô Kế hoạch: số việc hôm nay', '{so} việc hôm nay ›', { bien: ['so'] }),
  chu('home.cal.quaHan', 'Ô Kế hoạch: số việc quá hạn (máy đọc màn hình)', '{so} việc quá hạn', { bien: ['so'] }),
  khoa('home.lich', 'Ngày dương, thứ, ngày âm, tiết khí, số việc', 'tutinh', 'App tự tính theo giờ POS và việc khách tự ghi'),
  // Banner khuyến mãi "Hôm nay" (demo today) — LUÔN hiện; today.t / today.s / today.cta là chữ mặc định khi POS không có quảng cáo, Giờ vàng, chương trình
  { khoa: 'today.bg', man: M, ten: 'Banner Hôm nay: ảnh nền', loai: 'anh', macDinh: ANH_BANNER, tiLe: '2:1' },
  chu('today.k', 'Banner Hôm nay: nhãn', 'HÔM NAY'),
  chu('today.t', 'Banner Hôm nay: tiêu đề mặc định', 'Hôm nay bạn muốn uống gì?'),
  chu('today.s', 'Banner Hôm nay: dòng phụ mặc định', ''),
  { khoa: 'today.cta', man: M, ten: 'Banner Hôm nay: nút mặc định', loai: 'nut', macDinh: { chu: 'Xem Menu ›', dich: 'menu' } },
  // Ô Giờ vàng + ô Trắc nghiệm
  chu('home.gvk', 'Ô Giờ vàng: nhãn', 'Giờ vàng'),
  chu('home.gv.chua', 'Ô Giờ vàng: khi chưa có', 'Hiện chưa có'),
  chu('home.gv.dang', 'Ô Giờ vàng: đang chạy', '{so} món đang giảm', { bien: ['so'] }),
  chu('home.gv.cuoi', 'Ô Giờ vàng: sắp chạy', '{so} món cuối ngày', { bien: ['so'] }),
  khoa('home.gv.so', 'Phần trăm giảm, số món, giờ của Giờ vàng', 'pos', 'POS › Giờ vàng'),
  { khoa: 'home.q.anh', man: M, ten: 'Ô Trắc nghiệm: hình', loai: 'anh', macDinh: '/anh/the-chat-scale.svg', tiLe: '1:1' },
  chu('home.qk', 'Ô Trắc nghiệm: nhãn', 'Trắc nghiệm'),
  chu('home.qh', 'Ô Trắc nghiệm: câu hỏi', 'Bạn thuộc thể chất nào?'),
  chu('home.q.kq', 'Ô Trắc nghiệm: nhãn khi đã có kết quả', 'Thể trạng'),
  chu('home.q.xem', 'Ô Trắc nghiệm: dòng mở kết quả', 'Xem kết quả ›'),
  // Chăm sóc theo nhu cầu
  chu('home.needs', 'Tiêu đề mục Chăm sóc theo nhu cầu', 'Chăm sóc theo nhu cầu'),
  {
    khoa: 'home.need', man: M, ten: 'Các ô nhu cầu', loai: 'danhsach',
    truong: { ten: 'chu', nhan: 'chu', anh: 'anh', bieuTuong: 'chu' }, khoaCauTruc: ['ten', 'bieuTuong'],
    goiY: '"ten" là nhóm để lọc món (khớp nhu cầu của món) — không sửa; "nhan" là chữ hiện trên ô.',
    macDinh: NHU_CAU.map((n) => ({ ten: n.ten, nhan: n.ten, anh: n.anh, bieuTuong: n.bieuTuong })),
  },
  { khoa: 'home.disc', man: M, ten: 'Chú thích dưới mục nhu cầu', loai: 'doan',
    macDinh: 'Chỉ mang tính gợi ý theo dịp dùng — TQD kinh doanh thực phẩm thông thường, không phải thực phẩm bảo vệ sức khỏe.' },
  // Món nổi bật
  chu('home.feat', 'Tiêu đề mục Món nổi bật', 'Món nổi bật'),
  { khoa: 'home.feat.mon', man: M, ten: 'Món nổi bật (mã món POS; trống = ẩn mục)', loai: 'danhsach', truong: { ma: 'chu' }, macDinh: [],
    goiY: 'Mã món POS (unique_id, vd juice_1).' },
  { khoa: 'home.fmore', man: M, ten: 'Món nổi bật: nút xem tất cả', loai: 'nut', macDinh: { chu: 'Xem tất cả', dich: 'menu' } },
  khoa('home.mon', 'Tên, giá, ảnh món', 'pos', 'POS › Sản phẩm'),
  // Ẩn / hiện khối (demo SECS)
  hien('home.member', 'Thẻ hội viên'), hien('home.cal', 'Thẻ Kế hoạch và nhắc việc'), hien('home.hb', 'Banner + Giờ vàng + Trắc nghiệm'),
  hien('home.gv', 'Ô Giờ vàng'), hien('home.quiz', 'Ô Trắc nghiệm'), hien('home.needs', 'Chăm sóc theo nhu cầu'), hien('home.feat', 'Món nổi bật'),
];
