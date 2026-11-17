// Danh mục nội dung — VÍ CỦA TÔI (/uudai/vi), BẢNG CHỌN GÓI, THANH TOÁN NẠP (/uudai/vi/nap), ĐÃ NẠP (Theo dõi đơn chỉ nạp) — KH-NAP-1 (bản thiết kế
// chủ quán duyệt 16.11). Khuôn mục và luật: src/noiDung/nd.js (CLAUDE.md §11). Tên gói, số tiền, số dư, ghi chú dòng ví → mục KHOÁ `pos`.
// Không import tệp nào nhập src/dinhDang.js (vòng nạp — bài thử thu_KHND3a canh).

const V = 'Ví của tôi', G = 'Bảng chọn gói nạp', T = 'Thanh toán nạp', D = 'Đã nạp (Theo dõi đơn chỉ nạp)', U = 'Ưu đãi';
const chu = (khoa, ten, macDinh, them = {}, man = V) => ({ khoa, man, ten, loai: 'chu', macDinh, ...them });
const hien = (khoa, ten, man = V) => ({ khoa, man, ten: `Hiện khối: ${ten}`, loai: 'battat', macDinh: true });
const khoa = (k, ten, khoaBoi, chiDuong, man = V) => ({ khoa: k, man, ten, khoaBoi, chiDuong });
const POS_VI = 'POS › Khách hàng › Ví (số dư, sổ ví)';
const POS_GOI = 'POS › Cài đặt › Gói nạp';

export const VI_TIEN = [
  chu('tieuDe.vi', 'Tên màn trên tab trình duyệt: Ví', 'Ví của tôi'),
  chu('tieuDe.napvi', 'Tên màn trên tab trình duyệt: Thanh toán nạp', 'Nạp tiền vào ví', {}, T),
  // Lối vào ở Ưu đãi
  chu('vt.ud.nap', 'Ô Số dư ví: nút nhỏ mở bảng chọn gói', '+ Nạp tiền', {}, U),
  // Màn Ví
  chu('vt.tieuDe', 'Đầu màn: tiêu đề', 'Ví của tôi'),
  chu('vt.phu', 'Đầu màn: dòng phụ', 'Số dư · nạp tiền · lịch sử'),
  chu('vt.soDu', 'Ô số dư: nhãn', 'Số dư'),
  chu('vt.chuaSo', 'Ô số dư: khi chưa đọc được số dư', '—'),
  chu('vt.nap', 'Ô số dư: nút Nạp tiền', 'Nạp tiền'),
  hien('hien.vt.nap', 'nút Nạp tiền (ô số dư ở Ví + nút nhỏ ở Ưu đãi)'),
  chu('vt.luat', 'Dòng nhắc luật dưới ô số dư', 'Số dư trả được đồ uống ở quầy và trên App. Thẻ hội viên chỉ trả bằng chuyển khoản hoặc tiền mặt.'),
  hien('hien.vt.luat', 'dòng nhắc luật dưới ô số dư'),
  chu('vt.lichSu', 'Tiêu đề lịch sử', 'Lịch sử ví'),
  chu('vt.rong', 'Lịch sử: chưa có dòng nào', 'Chưa có giao dịch nào'),
  chu('vt.xemThem', 'Lịch sử: nút tải thêm', 'Xem thêm'),
  chu('vt.loai.nap', 'Tên dòng: nạp tiền', 'Nạp tiền'),
  chu('vt.loai.tra_don', 'Tên dòng: trả đơn', 'Trả đơn'),
  chu('vt.loai.hoan_don', 'Tên dòng: hoàn tiền', 'Hoàn tiền'),
  chu('vt.loai.dieu_chinh', 'Tên dòng: quán điều chỉnh', 'Quán điều chỉnh'),
  chu('vt.dong.thuong', 'Dòng nạp có thưởng: dòng nhỏ', 'gồm {thuong} tiền thưởng', { bien: ['thuong'] }),
  khoa('vt.pos', 'Số dư, giờ, ghi chú, số tiền từng dòng ví; tên dòng loại mới (vd quà chào mừng)', 'pos', POS_VI),
  // Bảng chọn gói
  chu('vt.goi.tieuDe', 'Tiêu đề bảng', 'Chọn gói nạp', {}, G),
  chu('vt.goi.phu', 'Dòng phụ dưới tiêu đề', 'Tiền vào ví ngay khi quán nhận được chuyển khoản.', {}, G),
  chu('vt.goi.so', 'Mỗi gói: dòng số tiền', 'Trả {tra} → vào ví {vao}', { bien: ['tra', 'vao'] }, G),
  chu('vt.goi.thuong', 'Mỗi gói: nhãn thưởng (vào ví − trả, chỉ khi có)', '+{thuong}', { bien: ['thuong'] }, G),
  chu('vt.goi.chon', 'Nút khi chưa chọn gói', 'Chọn một gói để tiếp tục', {}, G),
  chu('vt.goi.tiep', 'Nút khi đã chọn gói', 'Tiếp tục · trả {tra}', { bien: ['tra'] }, G),
  chu('vt.goi.nho', 'Dòng nhỏ cuối bảng', 'Chỉ trả bằng chuyển khoản QR. Tiền đã nạp không hoàn lại.', {}, G),
  khoa('vt.goi.pos', 'Tên gói, số tiền trả, số vào ví, thứ tự gói', 'pos', POS_GOI, G),
  // Thanh toán nạp
  chu('nap.tt.phu', 'Đầu màn: dòng phụ', 'Nạp tiền vào ví', {}, T),
  chu('nap.tt.vao', 'Thẻ tóm tắt: số vào ví', 'Vào ví {vao}', { bien: ['vao'] }, T),
  chu('nap.tt.ngay', 'Dòng xanh dưới thẻ tóm tắt', 'Tiền vào ví ngay khi quán nhận được chuyển khoản, không cần ra quầy.', {}, T),
  chu('nap.tt.tra', 'Tiêu đề cách trả', 'Cách trả tiền', {}, T),
  chu('nap.tt.qr', 'Lựa chọn trả: tên', 'Chuyển khoản QR', {}, T),
  chu('nap.tt.qr.phu', 'Lựa chọn trả: dòng nhỏ', 'Quét mã bằng app ngân hàng bất kỳ', {}, T),
  chu('nap.tt.khoa', 'Dòng khoá dưới cách trả', 'Nạp tiền chỉ trả bằng chuyển khoản, không dùng số dư ví và không dùng mã giảm giá. Tiền đã nạp không hoàn lại.', {}, T),
  chu('nap.tt.tienNap', 'Bảng tiền: dòng tiền nạp', 'Tiền nạp', {}, T),
  chu('nap.tt.tong', 'Bảng tiền: tổng', 'Tổng cộng', {}, T),
  chu('nap.tt.vaoSau', 'Bảng tiền: dòng xanh số vào ví', 'Vào ví sau khi trả', {}, T),
  chu('nap.tt.chuaTong', 'Bảng tiền: khi chưa có báo giá', 'Tổng tiền sẽ hiện khi quán xác nhận', {}, T),
  chu('nap.tt.nut', 'Nút trả', 'Quét QR · {tong}', { bien: ['tong'] }, T),
  chu('nap.tt.khongBan', 'Gói không còn bán: dòng đậm', 'Gói nạp này không còn bán', {}, T),
  chu('nap.tt.khongBan.p', 'Gói không còn bán: dòng nhỏ', 'Mời bạn chọn lại gói ở Ví.', {}, T),
  chu('nap.tt.veVi', 'Nút phụ: về Ví', 'Về Ví', {}, T),
  chu('nap.tt.dong', 'Đơn chưa rõ: tên dòng nạp khi không còn thấy gói', 'Nạp tiền vào ví', {}, T),
  khoa('nap.tt.pos', 'Tên gói, số vào ví, giá, tổng (báo giá POS)', 'pos', POS_GOI, T),
  // Theo dõi đơn chỉ nạp + Đã nạp
  chu('nap.td.vaoVi', 'Các bước đơn nạp: bước 2', 'Đã vào ví', {}, D),
  chu('nap.td.vaoVi.s', 'Các bước đơn nạp: bước 2, dòng nhỏ', 'Ngay khi tiền về, không cần ra quầy.', {}, D),
  chu('nap.dn.soDu', 'Ô số dư mới: nhãn', 'Số dư mới', {}, D),
  chu('nap.dn.vua', 'Ô số dư mới: nhãn số vừa vào', '+{so} vừa vào ví', { bien: ['so'] }, D),
  chu('nap.dn.t', 'Tiêu đề (biết số đã nạp)', 'Đã nạp {so} vào ví!', { bien: ['so'] }, D),
  chu('nap.dn.chung', 'Tiêu đề (chưa đọc được số đã nạp)', 'Đã nạp tiền vào ví!', {}, D),
  chu('nap.dn.p', 'Dòng dưới tiêu đề (có thưởng)', 'Gồm {thuong} tiền thưởng. Dùng trả đồ uống ở quầy và trên App.', { bien: ['thuong'] }, D),
  chu('nap.dn.pKhong', 'Dòng dưới tiêu đề (không thưởng)', 'Dùng trả đồ uống ở quầy và trên App.', {}, D),
  chu('nap.dn.don', 'Nhãn số đơn + tổng', 'Đơn {so} · {tong}', { bien: ['so', 'tong'] }, D),
  chu('nap.dn.donSo', 'Nhãn số đơn (POS chưa trả tổng)', 'Đơn {so}', { bien: ['so'] }, D),
  chu('nap.dn.nut', 'Nút chính', 'Đặt đồ uống ngay', {}, D),
  chu('nap.dn.xemVi', 'Nút viền', 'Xem ví', {}, D),
  hien('hien.nap.dn', 'màn "Đã nạp" (tắt → chỉ còn hoá đơn POS)', D),
  khoa('nap.dn.pos', 'Số dư mới, số đã nạp, tiền thưởng, số đơn, tổng; tên dòng nạp ở Chi tiết đơn', 'pos', POS_VI, D),
];
