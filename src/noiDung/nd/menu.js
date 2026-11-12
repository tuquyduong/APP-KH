// Danh mục nội dung — MENU, TRANG MÓN, GIỎ HÀNG và phần dùng chung của ô món / giá / Giờ vàng (KH-ND-3b). Khuôn mục và luật: src/noiDung/nd.js (CLAUDE.md §11).
// macDinh = chữ đang chạy (chép nguyên). Demo (patch39) không có khoá data-cms cho Menu / Trang món / Giỏ hàng (chỉ có p.* theo món, ở noiDung/mon.js) → khoá đặt theo màn.
// Không import tệp nào nhập src/dinhDang.js (vòng nạp — bài thử thu_KHND3a canh).

const chuCua = (man) => (khoa, ten, macDinh, them = {}) => ({ khoa, man, ten, loai: 'chu', macDinh, ...them });
const khoaCua = (man) => (khoa, ten, khoaBoi, chiDuong) => ({ khoa, man, ten, khoaBoi, chiDuong });

const cM = chuCua('Menu'), kM = khoaCua('Menu');
const cT = chuCua('Trang món');
const cG = chuCua('Giỏ hàng'), kG = khoaCua('Giỏ hàng');
const cC = chuCua('Khung chung');

const GV = ['phanTram'];
const GIO = ['batDau', 'ketThuc', 'phanTram'];

export const MENU = [
  // ── Menu ──
  cM('menu.tieuDe', 'Menu: tên màn', 'Menu'),
  cM('menu.giaCu', 'Menu: dòng dưới tên khi giá là bản cũ', 'Giá cập nhật lúc {ngay}', { bien: ['ngay'] }),
  cM('menu.conMon', 'Menu: dòng dưới tên (số món đang có)', '{so} món đang có', { bien: ['so'] }),
  cM('menu.dangLoc', 'Menu: thanh đang lọc theo nhu cầu', 'Đang lọc theo: {nhuCau}', { bien: ['nhuCau'] }),
  cM('menu.xoaLoc', 'Menu: nút bỏ lọc', 'Xóa lọc'),
  cM('menu.timAria', 'Menu: ô tìm (máy đọc màn hình)', 'Tìm món'),
  cM('menu.timGoiY', 'Menu: gợi ý trong ô tìm', 'Tìm món, ví dụ: phổ nhĩ…'),
  cM('menu.tatCa', 'Menu: ô nhóm "tất cả"', 'Tất cả'),
  cM('menu.nhomKhac', 'Menu: tên nhóm cho món POS chưa xếp nhóm', 'Khác'),
  cM('menu.soMon', 'Menu: số món cạnh tên nhóm', '{so} món', { bien: ['so'] }),
  cM('menu.rong', 'Menu: chưa có món nào', 'Chưa có món nào.'),
  cM('menu.khongKhop', 'Menu: lọc / tìm không ra món', 'Chưa có món phù hợp. Thử bỏ bớt bộ lọc nhé.'),
  cM('menu.gv.ten', 'Menu: ô Giờ vàng (tên ô)', 'Giờ vàng'),
  cM('menu.gv.dau', 'Menu: đầu khối Giờ vàng, dòng đậm', 'Giờ vàng cuối ngày'),
  cM('menu.gv.khung', 'Menu: đầu khối Giờ vàng, khung giờ và % giảm', 'Hôm nay {batDau}–{ketThuc} · giảm {phanTram}%', { bien: GIO }),
  { khoa: 'menu.gv.luuY', man: 'Menu', ten: 'Menu: lưu ý cuối khối Giờ vàng', loai: 'doan', macDinh: 'Giá Giờ vàng là giá khuyến mãi cuối cùng: không cộng thêm giá hội viên hay voucher. Hết giờ, món trở về giá thường.' },
  kM('menu.mon', 'Tên món, giá, size, topping', 'pos', 'POS › Sản phẩm'),
  kM('menu.nhom', 'Tên nhóm món', 'pos', 'POS › Sản phẩm › Nhóm món'),
  kM('menu.gv.so', 'Giờ vàng: có chạy không, % giảm, khung giờ, món áp dụng', 'pos', 'POS › Giờ vàng'),
  kM('menu.gv.dem', 'Giờ vàng: đồng hồ đếm ngược', 'tutinh', 'App tự tính theo giờ POS'),

  // ── Trang món ──
  cT('mon.tieuDe', 'Trang món: tên màn khi đang tải', 'Món'),
  cT('mon.gvNhan', 'Trang món: nhãn góc ảnh khi đang Giờ vàng', '-{phanTram}% Giờ vàng', { bien: GV }),
  cT('mon.thanhPhan', 'Trang món: nhãn dòng Thành phần', 'Thành phần:'),
  cT('mon.congDung', 'Trang món: nhãn dòng Công dụng', 'Công dụng:'),
  cT('mon.ghiChu', 'Trang món: tiêu đề ô ghi chú cho quán (và tên đọc cho máy đọc màn hình)', 'Ghi chú cho quán'),
  cT('mon.ghiChuGoiY', 'Trang món: gợi ý trong ô ghi chú', 'VD: ít ngọt hơn…'),
  cT('mon.soLuong', 'Trang món: nhãn số lượng', 'Số lượng'),
  cT('mon.nutThem', 'Trang món: nút thêm vào giỏ', 'Thêm vào giỏ'),
  cT('mon.nutHet', 'Trang món: nút khi món hết hàng', 'Hết hàng'),
  cT('mon.khongThay.t', 'Món không còn: tên màn', 'Không tìm thấy món'),
  cT('mon.khongThay.nut', 'Món không còn: nút', 'Xem Menu'),
  cT('khongthay.t', 'Đường dẫn lạ: tên màn', 'Không tìm thấy trang'),
  cT('khongthay.nut', 'Đường dẫn lạ: nút', 'Về Trang chủ'),
  cT('khongthay.noi', 'Không tìm thấy (món và trang): câu báo', 'Liên kết này không còn hoặc bị gõ sai.'),

  // ── Giỏ hàng ──
  cG('gio.tieuDe', 'Giỏ hàng: tên màn', 'Giỏ hàng'),
  cG('gio.soMon', 'Giỏ hàng: số món dưới tên màn', '{so} món', { bien: ['so'] }),
  cG('gio.rong.t', 'Giỏ trống: dòng đậm', 'Giỏ hàng đang trống'),
  cG('gio.rong.s', 'Giỏ trống: dòng phụ', 'Chọn một món trà hợp tiết trời hôm nay nhé'),
  cG('gio.rong.nut', 'Giỏ trống: nút (mở Menu)', 'Xem Menu'),
  cG('gio.xoaAria', 'Giỏ hàng: nút xoá món (máy đọc màn hình)', 'Xoá món'),
  cG('gio.hetHang', 'Giỏ hàng: cảnh báo món hết hàng', 'Hết hàng'),
  cG('gio.khongCon', 'Giỏ hàng: cảnh báo món không còn trong menu', 'Không còn trong menu'),
  cG('gio.ngungBan', 'Giỏ hàng: tên món đã ngừng bán', 'Món đã ngừng bán'),
  cG('gio.monChung', 'Giỏ hàng: gọi món chưa rõ tên (thông báo xoá)', 'món'),
  cG('gio.daXoa', 'Giỏ hàng: thông báo vừa xoá món', 'Đã xoá {ten} · ', { bien: ['ten'] }),
  cG('gio.hoanTac', 'Giỏ hàng: nút Hoàn tác trong thông báo xoá', 'Hoàn tác'),
  cG('gio.ma.goiY', 'Giỏ hàng: gợi ý ô mã giảm giá', 'Nhập mã giảm giá'),
  cG('gio.ma.aria', 'Giỏ hàng: ô mã giảm giá (máy đọc màn hình)', 'Mã giảm giá'),
  cG('gio.ma.ap', 'Giỏ hàng: nút áp mã', 'Áp dụng'),
  cG('gio.ma.daAp', 'Giỏ hàng: nút khi mã đã áp', '✓ Đã áp dụng'),
  cG('gio.tienHang', 'Bảng tiền: dòng tiền hàng', 'Tiền hàng'),
  cG('gio.phiGiao', 'Bảng tiền: dòng phí giao', 'Phí giao'),
  cG('gio.tong', 'Bảng tiền: dòng tổng cộng', 'Tổng cộng'),
  cG('gio.chuaTong', 'Bảng tiền: khi chưa có báo giá', 'Tổng tiền sẽ hiện khi quán xác nhận'),
  cG('gio.tiepTuc', 'Giỏ hàng: nút sang thanh toán', 'Tiếp tục · chọn cách nhận hàng'),
  kG('gio.mon', 'Tên món, giá một ly, ghi chú trên dòng giỏ', 'pos', 'POS › Sản phẩm'),
  kG('gio.tien', 'Tiền hàng, giảm, phí giao, tổng cộng', 'pos', 'POS (App chỉ hiện báo giá của POS)'),
  kG('gio.maLoi', 'Lời báo khi mã giảm giá không dùng được', 'pos', 'POS › Mã giảm giá'),

  // ── Dùng chung: ô món, giá, Giờ vàng, thứ trong tuần ──
  cC('mon.hetHang', 'Nhãn "Hết hàng" trên ảnh món (Menu, Trang chủ, Trang món)', 'Hết hàng'),
  cC('mon.tonCu', 'Dòng dưới món khi tồn là số cũ', 'theo số lúc {ngay}', { bien: ['ngay'] }),
  cC('khung.bot', 'Nút bớt số lượng (máy đọc màn hình)', 'Bớt một'),
  cC('khung.them', 'Nút thêm số lượng (máy đọc màn hình)', 'Thêm một'),
  cC('gia.thuong', 'Bậc giá: cột giá thường', 'Thường'),
  cC('gia.cuaBan', 'Bậc giá: nhãn dưới giá của khách', 'Giá của bạn'),
  cC('gv.dem.con', 'Giờ vàng: đang giảm, còn bao lâu', 'Còn {gio}', { bien: ['gio'] }),
  cC('gv.dem.mo', 'Giờ vàng: chưa tới giờ, mở lúc', 'Mở lúc {batDau}', { bien: ['batDau'] }),
  cC('gv.dem.moSau', 'Giờ vàng: chưa tới giờ, mở lúc và còn bao lâu (đầu khối)', 'Mở lúc {batDau} · sau {gio}', { bien: ['batDau', 'gio'] }),
  cC('gv.dem.sap', 'Giờ vàng: tới giờ, chờ POS báo', 'Sắp bắt đầu'),
  cC('gv.dem.xong', 'Giờ vàng: đã hết khung giờ', 'Đã kết thúc'),
  cC('gv.nhan.dang', 'Nhãn món Giờ vàng: đang giảm', 'Giờ vàng −{phanTram}%', { bien: GV }),
  cC('gv.nhan.sau', 'Nhãn món Giờ vàng: đã kết thúc', 'Giờ vàng đã kết thúc'),
  cC('gv.nhan.cho', 'Nhãn món Giờ vàng: sắp bắt đầu', 'Giờ vàng −{phanTram}% sắp bắt đầu', { bien: GV }),
  cC('gv.nhan.truoc', 'Nhãn món Giờ vàng: chưa tới giờ', 'Giờ vàng −{phanTram}% từ {batDau}', { bien: ['phanTram', 'batDau'] }),
  cC('gv.ghi.dangB', 'Ghi chú Giờ vàng ở Trang món (đang giảm): phần đậm', 'Giờ vàng −{phanTram}%', { bien: GV }),
  cC('gv.ghi.dangDuoi', 'Ghi chú Giờ vàng ở Trang món (đang giảm): phần cuối', 'Giá Giờ vàng áp khi thanh toán, không cộng thêm ưu đãi khác.'),
  cC('gv.ghi.truocA', 'Ghi chú Giờ vàng ở Trang món (chưa tới giờ): mở đầu', 'Món có trong '),
  cC('gv.ghi.truocB', 'Ghi chú Giờ vàng ở Trang món (chưa tới giờ): phần đậm', 'Giờ vàng {batDau}–{ketThuc}', { bien: ['batDau', 'ketThuc'] }),
  cC('gv.ghi.truocC', 'Ghi chú Giờ vàng ở Trang món (chưa tới giờ): phần cuối', ': giảm {phanTram}%.', { bien: GV }),
  kM('gia.hang', 'Tên hạng và giá từng hạng trên món', 'pos', 'POS › Cài đặt › Hạng thành viên'),
  ...[['t2', 'Thứ Hai'], ['t3', 'Thứ Ba'], ['t4', 'Thứ Tư'], ['t5', 'Thứ Năm'], ['t6', 'Thứ Sáu'], ['t7', 'Thứ Bảy'], ['t8', 'Chủ nhật']]
    .map(([ma, ten]) => cC(`thu.${ma}`, `Tên thứ trong giờ hoạt động: ${ten}`, ten)),
];
