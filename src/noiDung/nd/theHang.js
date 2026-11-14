// Danh mục nội dung — HẠNG THÀNH VIÊN (/uudai/hang), THANH TOÁN THẺ (/uudai/hang/thanhtoan), CHÀO MỪNG HỘI VIÊN (Theo dõi đơn chỉ thẻ) — KH-THE-1, KH-THE-2
// (bản thiết kế chủ quán duyệt 14.11). Khuôn mục và luật: src/noiDung/nd.js (CLAUDE.md §11). Tên hạng, %, gói, giá, quyền lợi, hạn → mục KHOÁ `pos`;
// số tiết kiệm → `tutinh`. Không import tệp nào nhập src/dinhDang.js (vòng nạp — bài thử thu_KHND3a canh).

const M = 'Hạng thành viên', T = 'Thanh toán thẻ', C = 'Chào mừng hội viên';
const chu = (khoa, ten, macDinh, them = {}, man = M) => ({ khoa, man, ten, loai: 'chu', macDinh, ...them });
const hien = (khoa, ten, man = M) => ({ khoa, man, ten: `Hiện khối: ${ten}`, loai: 'battat', macDinh: true });
const khoa = (k, ten, khoaBoi, chiDuong, man = M) => ({ khoa: k, man, ten, khoaBoi, chiDuong });

export const THE_HANG = [
  chu('tieuDe.hang', 'Tên màn trên tab trình duyệt: Hạng thành viên', 'Hạng thành viên'),
  chu('tier.tieuDe', 'Đầu màn: tiêu đề', 'Hạng thành viên'),
  // Dòng phụ đầu màn = tình trạng của khách
  chu('tier.phu.thuong', 'Dòng phụ: chưa đăng nhập / chưa có hạng', 'Bạn đang ở giá thường'),
  chu('tier.phu.hang', 'Dòng phụ: khách có hạng bán', 'Bạn đang ở {hang} · hết hạn {ngay}', { bien: ['hang', 'ngay'] }),
  chu('tier.phu.hangKhongHan', 'Dòng phụ: khách có hạng bán không thời hạn', 'Bạn đang ở {hang}', { bien: ['hang'] }),
  chu('tier.phu.tang', 'Dòng phụ: hạng quán tặng', '{hang} · quán tặng', { bien: ['hang'] }),
  chu('tier.phu.tangKhongHan', 'Dòng phụ: hạng quán tặng không thời hạn', '{hang} · quán tặng · không thời hạn', { bien: ['hang'] }),
  // So sánh nhanh
  chu('tier.cmp', 'So sánh nhanh: tiêu đề', 'So sánh nhanh'),
  chu('tier.cmp.chon', 'So sánh nhanh: chữ nhỏ bên phải', 'Chạm một cột để chọn'),
  chu('tier.cmp.thuong', 'So sánh nhanh: tên cột không hạng', 'Thường'),
  chu('tier.cmp.khongHang', 'So sánh nhanh: dòng phụ cột không hạng', 'Không hạng'),
  chu('tier.cmp.dang', 'So sánh nhanh: nhãn cột đang chọn', 'Đang chọn'),
  chu('tier.cmp.giam', 'So sánh nhanh: hàng mức giảm', 'Giảm mọi đơn'),
  chu('tier.cmp.db', 'So sánh nhanh: hàng nhóm đặc biệt', 'Món nhóm đặc biệt'),
  chu('tier.cmp.loi', 'So sánh nhanh: hàng tiết kiệm', 'Chi 1 triệu, tiết kiệm'),
  chu('tier.cmp.gia', 'So sánh nhanh: hàng giá', 'Giá'),
  chu('tier.cmp.pt', 'So sánh nhanh: ô phần trăm', '{phanTram}%', { bien: ['phanTram'] }),
  chu('tier.cmp.trong', 'So sánh nhanh: ô không có', '—'),
  chu('tier.cmp.khong', 'So sánh nhanh: tiết kiệm của cột không hạng', '0đ'),
  chu('tier.cmp.mienPhi', 'So sánh nhanh: giá cột không hạng', 'Miễn phí'),
  chu('tier.cmp.moiThang', 'So sánh nhanh: đơn vị giá gói 1 tháng', '/ tháng'),
  chu('tier.cmp.moiNThang', 'So sánh nhanh: đơn vị giá gói nhiều tháng', '/ {so} tháng', { bien: ['so'] }),
  chu('tier.cmp.quanTang', 'So sánh nhanh: giá hạng chỉ cấp', 'Quán tặng'),
  chu('tier.cmp.chuaBan', 'So sánh nhanh: giá hạng chưa có gói bán', 'Chưa mở bán'),
  // Gói + nút mua
  chu('tier.goi', 'Tiêu đề chọn gói', 'Chọn gói {hang}', { bien: ['hang'] }),
  chu('tier.thang', 'Nút gói: số tháng', '{so} tháng', { bien: ['so'] }),
  chu('tier.tietKiem', 'Gói: số tiết kiệm so với mua lẻ', 'Tiết kiệm {gia}', { bien: ['gia'] }),
  chu('tier.nut.mua', 'Nút chính: mua thẻ', 'Mua ngay · {hang} {so} tháng', { bien: ['hang', 'so'] }),
  chu('tier.nut.giaHan', 'Nút chính: gia hạn đúng hạng đang có', 'Gia hạn · {hang} {so} tháng', { bien: ['hang', 'so'] }),
  chu('tier.nut.mo', 'Nút chính khi không mua được (mờ)', 'Mua thẻ {hang}', { bien: ['hang'] }),
  chu('tier.mo.tang', 'Lý do nút mờ: hạng chỉ quán tặng', 'Hạng dành tặng khách thân thiết'),
  chu('tier.mo.caoHon', 'Lý do nút mờ: khách đang ở hạng cao hơn', 'Bạn đang ở hạng {hang} — đã có ưu đãi cao hơn', { bien: ['hang'] }),
  chu('tier.mo.chuaBan', 'Lý do nút mờ: hạng chưa có gói bán', 'Chưa mở bán'),
  chu('tier.qr', 'Dòng dưới nút mua', 'Trả bằng QR chuyển khoản · thẻ dùng được ngay'),
  // Quyền lợi + ghi chú
  chu('tier.ben', 'Quyền lợi: tiêu đề', '{hang} còn có', { bien: ['hang'] }),
  chu('tier.ben.chung', 'Quyền lợi: dòng cố định', 'Dùng ở quầy và trên App, cùng một số điện thoại'),
  chu('tier.note', 'Ghi chú cuối màn', 'Gia hạn trước hạn thì ngày còn lại được cộng dồn. Thẻ hết hạn tự về giá thường.'),
  hien('hien.tier.cmp', 'so sánh nhanh'),
  hien('hien.tier.ben', 'quyền lợi'),
  hien('hien.tier.note', 'ghi chú cuối màn'),
  khoa('tier.pos', 'Tên hạng, % giảm, gói tháng, giá thẻ, quyền lợi, hạn thẻ của khách', 'pos', 'POS › Cài đặt › Hạng thành viên'),
  khoa('tier.tutinh', 'Số tiết kiệm khi chi 1 triệu (từ % của POS) và tiết kiệm của gói (so với mua gói ngắn nhất)', 'tutinh', 'App tự tính từ % và giá gói của POS'),

  // Thanh toán thẻ — chỉ QR (chủ quán 14.11)
  chu('the.tt.phu', 'Đầu màn: dòng phụ', 'Thẻ hội viên', {}, T),
  chu('the.tt.ten', 'Thẻ tóm tắt: tên', 'Thẻ hội viên {hang}', { bien: ['hang'] }, T),
  chu('the.tt.thang', 'Thẻ tóm tắt: số tháng', '{so} tháng', { bien: ['so'] }, T),
  chu('the.tt.dong', 'Đơn chưa rõ: tên dòng thẻ', 'Thẻ hội viên {hang} · {so} tháng', { bien: ['hang', 'so'] }, T),
  chu('the.tt.chung', 'Đơn chưa rõ: tên dòng thẻ khi hạng không còn', 'Thẻ hội viên', {}, T),
  chu('the.tt.kichHoat', 'Dòng xanh: kích hoạt ngay', 'Thẻ kích hoạt ngay khi tiền về, không cần ra quầy. Đơn đồ uống tiếp theo được giảm {phanTram}% luôn.', { bien: ['phanTram'] }, T),
  chu('the.tt.tra', 'Tiêu đề cách trả', 'Cách trả tiền', {}, T),
  chu('the.tt.qr', 'Lựa chọn trả: tên', 'Chuyển khoản QR', {}, T),
  chu('the.tt.qr.phu', 'Lựa chọn trả: dòng nhỏ', 'Quét mã bằng app ngân hàng bất kỳ', {}, T),
  chu('the.tt.khongVi', 'Dòng khoá dưới cách trả', 'Thẻ hội viên không trả bằng số dư ví và không dùng mã giảm giá.', {}, T),
  chu('the.tt.nut', 'Nút trả', 'Quét QR · {tong}', { bien: ['tong'] }, T),
  chu('the.tt.khongBan', 'Hạng / gói không còn bán: dòng đậm', 'Thẻ này không còn bán', {}, T),
  chu('the.tt.khongBan.p', 'Hạng / gói không còn bán: dòng nhỏ', 'Mời bạn chọn lại ở Hạng thành viên.', {}, T),
  chu('the.tt.veHang', 'Nút phụ: về Hạng thành viên', 'Về Hạng thành viên', {}, T),
  khoa('the.tt.pos', 'Tên hạng, số tháng, giá thẻ, % giảm', 'pos', 'POS › Cài đặt › Hạng thành viên', T),

  // Chào mừng hội viên — Theo dõi đơn chỉ thẻ đã trả
  chu('the.cm.t', 'Tiêu đề', 'Chào mừng hội viên {hang}!', { bien: ['hang'] }, C),
  chu('the.cm.chung', 'Tiêu đề khi chưa biết tên hạng', 'Chào mừng hội viên!', {}, C),
  chu('the.cm.p', 'Dòng dưới tiêu đề', 'Giảm {phanTram}% áp dụng ngay từ đơn tiếp theo, ở quầy và trên App.', { bien: ['phanTram'] }, C),
  chu('the.cm.don', 'Thẻ vàng: số đơn + tổng', 'Đơn {so} · {tong}', { bien: ['so', 'tong'] }, C),
  chu('the.cm.nut', 'Nút chính', 'Đặt đồ uống ngay', {}, C),
  chu('the.cm.veGio', 'Nút phụ (chỉ khi giỏ còn đồ uống)', 'Về giỏ · {so} món', { bien: ['so'] }, C),
  chu('the.cm.nho', 'Dòng nhỏ dưới nút (khi giỏ còn đồ uống)', 'Đồ uống bạn đã chọn vẫn còn trong giỏ', {}, C),
  hien('hien.the.cm', 'màn chúc mừng (tắt → hiện như đơn thường)', C),
  khoa('the.cm.pos', 'Tên hạng, %, hạn mới của thẻ, số đơn, tổng', 'pos', 'POS › Cài đặt › Hạng thành viên', C),
];
