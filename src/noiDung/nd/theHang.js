// Danh mục nội dung — HẠNG THÀNH VIÊN (/uudai/hang, demo #buycard `renderTier` bản cuối; KH-THE-1). Khuôn mục và luật: src/noiDung/nd.js (CLAUDE.md §11).
// Khoá theo demo (`tier.*` — data-cms của demo) khi demo có; chữ demo chép nguyên. Tên hạng, %, gói, giá, quyền lợi, hạn → mục KHOÁ `pos`; số tiết kiệm → `tutinh`.
// Không import tệp nào nhập src/dinhDang.js (vòng nạp — bài thử thu_KHND3a canh).

const M = 'Hạng thành viên';
const chu = (khoa, ten, macDinh, them = {}) => ({ khoa, man: M, ten, loai: 'chu', macDinh, ...them });
const hien = (ma, ten) => ({ khoa: `hien.tier.${ma}`, man: M, ten: `Hiện khối: ${ten}`, loai: 'battat', macDinh: true });
const khoa = (k, ten, khoaBoi, chiDuong) => ({ khoa: k, man: M, ten, khoaBoi, chiDuong });

export const THE_HANG = [
  chu('tieuDe.hang', 'Tên màn trên tab trình duyệt: Hạng thành viên', 'Hạng thành viên'),
  chu('tier.tieuDe', 'Đầu màn: tiêu đề', 'Hạng thành viên'),
  chu('tier.sub', 'Đầu màn: dòng phụ', 'Hạng càng cao, giá càng tốt'),
  // Thẻ "Hạng hiện tại" (chỉ khi đã đăng nhập)
  chu('tier.hienTai', 'Thẻ hạng hiện tại: nhãn', 'Hạng hiện tại'),
  chu('tier.thuong', 'Thẻ hạng hiện tại: tên khi chưa có hạng', 'Thường'),
  chu('tier.moiMua', 'Thẻ hạng hiện tại: lời mời khi chưa có hạng', 'Mua thẻ {hang} để nhận giá tốt ngay hôm nay', { bien: ['hang'] }),
  chu('tier.conHan', 'Thẻ hạng hiện tại: hạn thẻ', 'Thẻ còn hạn tới {ngay}', { bien: ['ngay'] }),
  // Cách có + quyền lợi
  chu('tier.how', 'Cách có của hạng bán', 'Mua thẻ {goi}', { bien: ['goi'] }),
  chu('tier.thang', 'Một gói tháng (ghép trong "Cách có" và nút gói)', '{so} tháng', { bien: ['so'] }),
  chu('tier.hoac', 'Chữ nối các gói trong "Cách có"', ' hoặc '),
  chu('tier.ben.giam', 'Quyền lợi khi POS chưa nhập: mức giảm', 'Giảm {phanTram}% mọi đơn', { bien: ['phanTram'] }),
  chu('tier.ben.db', 'Quyền lợi khi POS chưa nhập: nhóm đặc biệt', 'Món nhóm đặc biệt giảm {phanTram}%', { bien: ['phanTram'] }),
  // Gói + nút mua
  chu('tier.tietKiem', 'Gói: số tiết kiệm so với mua lẻ', 'Tiết kiệm {gia}', { bien: ['gia'] }),
  chu('tier.nut.mua', 'Nút chính: mua thẻ', 'Mua thẻ {hang} {so} tháng', { bien: ['hang', 'so'] }),
  chu('tier.nut.giaHan', 'Nút chính: gia hạn đúng hạng đang có', 'Gia hạn {hang} {so} tháng', { bien: ['hang', 'so'] }),
  chu('tier.nut.mo', 'Nút chính khi không mua được (mờ)', 'Mua thẻ {hang}', { bien: ['hang'] }),
  chu('tier.mo.caoHon', 'Lý do nút mờ: khách đang ở hạng cao hơn', 'Bạn đang ở hạng {hang} — đã có ưu đãi cao hơn', { bien: ['hang'] }),
  chu('tier.mo.chuaBan', 'Lý do nút mờ: hạng chưa có gói bán', 'Chưa mở bán'),
  chu('tier.buynote', 'Ghi chú dưới nút mua', 'Uống từ 2 ly/tuần là thẻ Vàng có lời. Gia hạn trước hạn thì cộng dồn ngày. Thẻ hết hạn tự về giá thường.'),
  chu('tier.daThem', 'Thông báo: đã thêm thẻ vào giỏ', 'Đã thêm Thẻ {hang} {so} tháng vào giỏ', { bien: ['hang', 'so'] }),
  chu('tier.daDoi', 'Thông báo: giỏ đã có thẻ khác, đổi sang thẻ mới', 'Đã đổi sang Thẻ {hang} {so} tháng', { bien: ['hang', 'so'] }),
  // So sánh nhanh
  chu('tier.cmp', 'So sánh nhanh: tiêu đề', 'So sánh nhanh'),
  chu('tier.cmp.gia', 'So sánh nhanh: hàng giá', 'Giá'),
  chu('tier.cmp.giaThuong', 'So sánh nhanh: giá hạng Thường', 'Giá thường'),
  chu('tier.cmp.giam', 'So sánh nhanh: mức giảm của hạng', '−{phanTram}%', { bien: ['phanTram'] }),
  chu('tier.cmp.cach', 'So sánh nhanh: hàng cách có', 'Cách có'),
  chu('tier.cmp.macDinh', 'So sánh nhanh: cách có hạng Thường', 'Mặc định'),
  chu('tier.cmp.muaThe', 'So sánh nhanh: cách có hạng bán', 'Mua thẻ'),
  chu('tier.cmp.quanTang', 'So sánh nhanh: cách có hạng chỉ cấp', 'Quán tặng'),
  // Ẩn / hiện khối
  hien('card', 'thẻ hạng hiện tại'),
  hien('ben', 'quyền lợi'),
  hien('note', 'ghi chú dưới nút mua'),
  hien('cmp', 'so sánh nhanh'),
  // Phần POS / App tự tính
  khoa('tier.pos', 'Tên hạng, % giảm, gói tháng, giá thẻ, quyền lợi, hạn thẻ của khách', 'pos', 'POS › Cài đặt › Hạng thành viên'),
  khoa('tier.tutinh', 'Số tiền tiết kiệm của gói (so với mua gói ngắn nhất cho đủ số tháng)', 'tutinh', 'App tự tính từ giá gói của POS'),
];
