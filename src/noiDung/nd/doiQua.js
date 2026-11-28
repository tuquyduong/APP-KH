// Danh mục nội dung — ĐỔI ĐIỂM LẤY QUÀ (KH-DOI-1, thiết kế chủ quán duyệt 26.11): nút ở ô Điểm (Ưu đãi), Kho quà (/uudai/doi-qua), bảng PIN đổi quà,
// "Đã đổi quà!", Quà của tôi (/uudai/qua), Phiếu quà (/uudai/qua/<mã>). Khuôn mục và luật: src/noiDung/nd.js (CLAUDE.md §11).
// Tên quà, mô tả, ảnh, số điểm, hạn, mã phiếu, lời lỗi → mục KHOÁ `pos`. Không import tệp nào nhập src/dinhDang.js (vòng nạp — bài thử thu_KHND3a canh).

const U = 'Ưu đãi', K = 'Kho quà (Đổi quà bằng điểm)', X = 'Đã đổi quà', Q = 'Quà của tôi', P = 'Phiếu quà';
const chu = (khoa, ten, macDinh, them = {}, man = K) => ({ khoa, man, ten, loai: 'chu', macDinh, ...them });
const khoa = (k, ten, chiDuong, man = K) => ({ khoa: k, man, ten, khoaBoi: 'pos', chiDuong });
const POS_QUA = 'POS › Cài đặt › Kho quà';
const POS_DIEM = 'POS › Khách hàng › Điểm';

export const DOI_QUA = [
  { khoa: 'hien.dq', man: U, ten: 'Hiện khối: Đổi điểm lấy quà (nút ở ô Điểm + các màn Kho quà, Quà của tôi, Phiếu quà) — chỉ bật khi POS đã gộp DOI-DIEM-1', loai: 'battat', macDinh: false },
  chu('tieuDe.doiqua', 'Tên màn trên tab trình duyệt: Kho quà', 'Đổi quà bằng điểm'),
  chu('tieuDe.quatoi', 'Tên màn trên tab trình duyệt: Quà của tôi', 'Quà của tôi', {}, Q),
  chu('tieuDe.phieuqua', 'Tên màn trên tab trình duyệt: Phiếu quà', 'Phiếu quà', {}, P),
  // Lối vào ở Ưu đãi
  chu('dq.ud.nut', 'Ô Điểm: nút nhỏ mở Kho quà', 'Đổi quà ›', {}, U),
  // Kho quà
  chu('dq.tieuDe', 'Đầu màn: tiêu đề', 'Đổi quà bằng điểm'),
  chu('dq.hero.so', 'Khối điểm: số điểm', '{so} điểm', { bien: ['so'] }),
  chu('dq.hero.lbl', 'Khối điểm: dòng nhỏ', 'Điểm của bạn · đổi quà ngay trên App'),
  chu('dq.cua', 'Ô mở Quà của tôi', 'Quà của tôi'),
  chu('dq.cua.so', 'Ô Quà của tôi: số phiếu chờ nhận', '{so} chờ nhận', { bien: ['so'] }),
  chu('dq.nhac', 'Dải nhắc phiếu sắp hết hạn (POS báo)', 'Phiếu {ten} hết hạn {ngay} — nhớ ghé quầy nhận nhé.', { bien: ['ten', 'ngay'] }),
  chu('dq.kho', 'Tiêu đề danh sách quà', 'Kho quà'),
  chu('dq.kho.rong', 'Kho quà chưa có quà', 'Quán chưa có quà để đổi. Hẹn bạn lần sau nhé.'),
  chu('dq.chip', 'Chip ở quà hiện vật', 'Quà tại quầy'),
  chu('dq.diem', 'Thẻ quà: số điểm cần', '{so} điểm', { bien: ['so'] }),
  chu('dq.nut.doi', 'Thẻ quà: nút đổi', 'Đổi ngay'),
  chu('dq.nut.thieu', 'Thẻ quà: thiếu điểm (biết số còn thiếu)', 'Cần thêm {so} điểm', { bien: ['so'] }),
  chu('dq.nut.chuaDu', 'Thẻ quà: thiếu điểm (POS báo, không có số)', 'Chưa đủ điểm'),
  chu('dq.nut.het', 'Thẻ quà: quà hiện vật hết', 'Tạm hết'),
  chu('dq.nut.luot', 'Thẻ quà: hết lượt đổi tháng này', 'Hết lượt tháng này'),
  chu('dq.ghiChu', 'Ghi chú cuối Kho quà', 'Mô tả quà do quán soạn ở POS · đổi xong không trả lại điểm.'),
  khoa('dq.pos', 'Tên quà, mô tả, ảnh, số điểm cần, hạn và mã phiếu', POS_QUA),
  khoa('dq.diemPos', 'Số điểm của khách, điểm còn lại sau đổi', POS_DIEM),
  // Bảng PIN đổi quà + lỗi
  chu('dq.pin.t', 'Bảng PIN đổi quà: tiêu đề', 'Nhập PIN để đổi quà'),
  chu('dq.pin.tru', 'Bảng PIN đổi quà: số điểm trừ', 'Trừ {so}', { bien: ['so'] }),
  chu('dq.pin.con', 'Bảng PIN đổi quà: số điểm còn lại (ước tính để khách xem)', 'Còn lại {so}', { bien: ['so'] }),
  chu('dq.chuaRo', 'Báo lỗi: chưa rõ quán đã ghi nhận lần đổi chưa', 'Chưa rõ quán đã ghi nhận lần đổi này chưa. Nhập lại PIN rồi bấm Xác nhận để gửi lại đúng lần đổi này.'),
  chu('dq.dangGui', 'Báo lỗi: lần đổi trước còn đang gửi', 'Lần đổi quà trước còn đang gửi — chờ một chút rồi bấm Xác nhận lại.'),
  chu('dq.datPin', 'Nút đặt mã PIN (khi POS báo chưa có PIN)', 'Đặt mã PIN'),
  khoa('dq.loiPos', 'Lời POS khi đổi không được (thiếu điểm, hết quà, hết lượt, chưa có PIN…)', 'POS · lời POS trả nguyên văn'),
  // Đã đổi quà (voucher)
  chu('dq.xong.lbl', 'Khối điểm: nhãn', 'Điểm còn lại', {}, X),
  chu('dq.xong.t', 'Tiêu đề', 'Đã đổi quà!', {}, X),
  chu('dq.xong.p', 'Câu báo voucher đã vào ví', '{ten} đã vào Ví voucher của bạn — App tự chọn sẵn khi bạn đặt món.', { bien: ['ten'] }, X),
  chu('dq.xong.nut', 'Nút chính', 'Đặt món dùng ngay', {}, X),
  chu('dq.xong.ve', 'Nút phụ', 'Về kho quà', {}, X),
  // Quà của tôi
  chu('dq.qt.tieuDe', 'Đầu màn: tiêu đề', 'Quà của tôi', {}, Q),
  chu('dq.qt.nhac', 'Dải hướng dẫn đầu màn', 'Đưa mã QR của phiếu cho nhân viên ở quầy để nhận quà. Quá hạn chưa nhận, quán {hoan}.', { bien: ['hoan'] }, Q),
  chu('dq.qt.hoan', 'Dải hướng dẫn: chữ đậm', 'hoàn lại điểm', {}, Q),
  chu('dq.qt.cho', 'Tiêu đề nhóm phiếu chưa nhận', 'Chờ nhận', {}, Q),
  chu('dq.qt.xong', 'Tiêu đề nhóm phiếu đã nhận / hết hạn', 'Đã xong', {}, Q),
  chu('dq.qt.rong', 'Chưa có phiếu nào', 'Bạn chưa có phiếu quà nào.', {}, Q),
  chu('dq.qt.han', 'Phiếu chờ nhận: hạn', 'Hạn {ngay}', { bien: ['ngay'] }, Q),
  chu('dq.qt.sapHet', 'Phiếu chờ nhận sắp hết hạn (POS báo): dòng chữ hồng', 'Sắp hết hạn · hạn {ngay}', { bien: ['ngay'] }, Q),
  chu('dq.qt.xem', 'Phiếu chờ nhận: nhãn bấm xem mã', 'Xem mã ›', {}, Q),
  chu('dq.qt.daNhan', 'Phiếu đã nhận: ngày nhận', 'Đã nhận {ngay}', { bien: ['ngay'] }, Q),
  chu('dq.qt.ttDaNhan', 'Phiếu đã nhận: nhãn', 'Đã nhận', {}, Q),
  chu('dq.qt.hetHan', 'Phiếu hết hạn: ngày hết hạn', 'Hết hạn {ngay}', { bien: ['ngay'] }, Q),
  chu('dq.qt.hoanDiem', 'Phiếu hết hạn: số điểm đã hoàn (khi POS báo)', ' · đã hoàn {so} điểm', { bien: ['so'] }, Q),
  chu('dq.qt.ttHetHan', 'Phiếu hết hạn: nhãn', 'Hết hạn', {}, Q),
  // Phiếu quà
  chu('dq.ph.tieuDe', 'Đầu màn: tiêu đề', 'Phiếu quà', {}, P),
  chu('dq.ph.doi', 'Dòng dưới tên quà', 'Đổi {so} điểm · hạn nhận {ngay}', { bien: ['so', 'ngay'] }, P),
  chu('dq.ph.ma', 'Mã phiếu', 'Mã phiếu: {ma}', { bien: ['ma'] }, P),
  chu('dq.ph.dua', 'Câu hướng dẫn dưới mã', 'Đưa mã này cho nhân viên ở quầy để nhận quà. Quá hạn chưa nhận, quán hoàn lại điểm.', {}, P),
  chu('dq.ph.sang', 'Ghi chú màn sáng', 'Màn sáng tối đa khi mở mã — quét dễ hơn.', {}, P),
  chu('dq.ph.khong', 'Không thấy phiếu', 'Không thấy phiếu quà này.', {}, P),
  chu('dq.ph.daNhan', 'Phiếu đã nhận quà', 'Phiếu này đã nhận quà.', {}, P),
  chu('dq.ph.hetHan', 'Phiếu đã hết hạn', 'Phiếu này đã hết hạn.', {}, P),
];
