# KH-UI-2 vòng 2 — đối chiếu demo (patch39) ↔ app

Cách làm: CSS của demo được CHÉP (lọc theo lớp app dùng, giữ thứ tự cascade) vào `src/giaoDien/demo_*.css`; biểu tượng SVG chép vào `index.html`; ảnh, âm thanh tách
ra `public/`. Mỗi màn dựng bằng đúng lớp / cấu trúc HTML của demo. Phần riêng của app (nút thật thay `<div onclick>`, khung, chỗ trống) ở `src/giaoDien/giaoDien.css`.
Ảnh so: `so_anh/<màn>_<cỡ>_{demo,app,lech}.png` (390×844, 360×780, 430×932; chụp cả chiều dài màn). Ảnh app dùng API giả có dữ liệu GIỐNG demo (tên Linh, 1.250 điểm, 15 món,
2 voucher, 4 đơn) và nội dung thử cho `mon.js` (nhu cầu từng món) + 4 món nổi bật — công cụ so ảnh ở nháp, không vào kho. `lech.png` tô đỏ chỗ khác; vì khối thuộc việc
sau bị ẩn nên phần dưới ảnh lệch hàng loạt — đọc theo bảng dưới, không theo % lệch.
Lý do khác demo: **(a)** dữ liệu POS chưa có / khối thuộc việc sau · **(b)** chữ / số mẫu không dùng · **(c)** chưa có giỏ / đặt đơn · **(d)** màn rộng.

## Màn mở (`man_dau_*`)
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Mái đình, cột, nét mái, ngọc, đĩa logo, chữ hiện từng chữ, đường kẻ, khẩu hiệu, thanh tiến trình, màn phủ | chép nguyên (cùng CSS, cùng thời gian) | ảnh chụp ở giây 3,2: lệch 0,0 % | — |
| Nút Bỏ qua | có | thêm: chạm bất kỳ chỗ nào cũng vào app | phiếu B1 |
| Nút âm thanh + nhạc ≈ 80 KB | có, file `public/am_thanh/man_dau.mp3` | mặc định TẮT (demo thử tự phát); nhớ lựa chọn trong phiên | phiếu V5 |
| Chạy 1 lần mỗi phiên, `prefers-reduced-motion` | có | demo không có "một lần mỗi phiên" | phiếu B1 |

## Trang chủ (`trang_chu_*`)
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Lời chào + dòng phụ | có (`topbar`) | "Chào Linh" thay "Chào buổi chiều, chị Linh" | (a) chưa có xưng hô / giờ POS |
| Nút chuông thông báo + chấm | — | ẩn | (a) thông báo → việc sau |
| Thẻ "Xem cách dùng app trong 60 giây" | — | để trống | (a) KH-UI-5 |
| Thẻ hội viên vàng (`points-card pc-mini`) | có, đủ viền vàng / họa tiết / logo | không dòng "Hạng Vàng"; thẻ chiếm cả hàng | (a) hạng → KH-UI-3 |
| Ô "Kế hoạch và nhắc việc" | — | để trống | (a) KH-UI-5 |
| Khối "Hôm nay" (`today`, ánh sáng lướt) | làm xong, hiện khi `noiDung/trangChu.js › HOM_NAY` có chữ | đang TRỐNG → hiện banner thường `hero-banner` (khối demo ẩn khi bật "Hôm nay") ; kiểm bằng ảnh nháp khi điền chữ thử | (b) chờ chữ khuyến mãi thật — xem `## Câu hỏi` |
| Hai ô Giờ vàng / Trắc nghiệm dưới banner | — | để trống | (a) KH-UI-3 / KH-UI-5 |
| Chăm sóc theo nhu cầu (6 ô ảnh tròn) + dòng gợi ý | có, ẩn ô / khối khi chưa món nào có nhu cầu | — | D2 |
| Bán chạy nhất \| Ưu đãi nhiều nhất (3 hạng giá, xếp hạng #) | — | thay bằng "Món nổi bật" (lưới 2 cột + Xem tất cả), ẨN khi danh sách trống | (a) POS chưa có số bán / giá hạng |
| Mời bạn bè | — | để trống | sau khai trương |

## Menu (`menu_*`)
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Tiêu đề + "N món đang có" + nút QR | có | N đếm món chưa báo hết | — |
| Thanh "Đang lọc theo" + Xóa lọc | có (khi bấm ô nhu cầu ở Trang chủ) | — | — |
| Ô tìm (không dấu cũng ra) | có | — | — |
| Lưới ô nhóm (`cat-tiles`) + thanh nhóm thu nhỏ khi cuộn (`cat-mini`) | có; ô theo nhóm của POS + "Tất cả"; biểu tượng men theo tên nhóm | không ô Giờ vàng, Combo, Topping | (a) KH-UI-3 / sau khai trương / TOPPING-1 |
| Tiêu đề nhóm (biểu tượng + tên + số món) + lưới 2 cột | có | — | — |
| Thẻ món: ảnh tròn viền vàng trên nền màu nhóm, tên, nhãn nhu cầu | có | tranh theo NHÓM (POS không có biểu tượng từng món); giá chỉ giá thường (không 3 hạng, không Giờ vàng, không nút ▶) ; "Hết hàng" thay "Hết hôm nay" | (a) |
| Chân trang "giá… đề xuất, chờ chủ quán duyệt" | — | bỏ | (b) |
| Giữ trạng thái khi vào món rồi quay lại (V6) | có: Menu ở lại trong cây, nhớ ô tìm / nhóm / vị trí cuộn | demo giữ vì mọi màn nằm sẵn trong trang | V6 (kiểm bằng kiểm khói: tìm "ca phe" → món → Back còn nguyên; cuộn 700 → món (về 0) → Back về 700) |

## Trang món (`trang_mon_*`)
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Nút lui + nút QR | có | — | — |
| Ảnh lớn + vòng vàng, nhóm, tên, giá, nhãn nhu cầu | có | giá một dòng (không 3 hạng); nhãn "hợp thể chất", Giờ vàng, video, nghe giới thiệu: không | (a) KH-UI-3 / KH-UI-5 |
| Mô tả / thành phần (+ công dụng) | có khi `mon.js` có; không có → không hiện | demo hiện "quán đang cập nhật" | (a) không bịa chữ |
| Cỡ, mức đường, nhiệt độ, topping, ghi chú, số lượng, Thêm vào giỏ | — | không | (c) KH-MUA-1 |

## Ưu đãi (`uu_dai_*`)
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Tiêu đề + QR | có | — | — |
| Banner Giờ vàng, thẻ hạng, Sưu tập Tứ Quý | — | không | (a) KH-UI-3 / chưa có dữ liệu POS |
| Ô điểm \| ô số dư ví (`wallet-row`) | ô điểm (rộng cả hàng) | không ô ví | (a) KH-UI-3 |
| Ví voucher (`voucher` có dải màu) | có; mã + mức giảm + hạn; "Xem tất cả" | không nút "Dùng ngay" | (c) |
| Kho quà đổi điểm | — | không | (a) |
| (app thêm) Nhập mã trên hoá đơn: `promo-box` + nút nhận khách mới | có, dùng khối nhập mã của demo (`promo-box`, `ghost-btn`, `nt-state`) | không có trong màn demo này | phiếu B8, C2 |
| (app thêm) Lịch sử điểm: `tx-item` của demo (Ví) | có | — | phiếu B8 |

## Tài khoản (`tai_khoan_*`)
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Thẻ tên (`acc-card`), 3 ô nhanh | có; ô Điểm, ô Voucher | không ô Ví, không "Hạng" cạnh số điện thoại; số điện thoại che giữa | (a) KH-UI-3 |
| Nhóm "Của tôi": Đơn hàng, Ví & Thẻ quà tặng, Gia đình | Đơn hàng | dòng phụ "Lịch sử các đơn đã mua" thay "1 đơn đang giao" | (a) |
| Nhóm "Sức khỏe": Thể trạng | — | không | (a) KH-UI-5 |
| Nhóm "Cài đặt": Thông tin cá nhân, Thông báo, Hỗ trợ | Thông tin cá nhân; Hỗ trợ khi `lienHe.js` có giá trị | không Thông báo | (a) / (b) số liên hệ thật chưa có |
| Nhóm "Quản trị" | — | không | không thuộc app khách |
| Đăng xuất | có | — | — |

## Lịch sử đơn (`lich_su_don_*`) và chi tiết đơn
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Thanh đầu (lui + tiêu đề + "N đơn") | có (giãn hai đầu y demo) | "N đơn" chỉ khi đã tải hết | (a) |
| Ô lọc Tất cả / Đang giao / Hoàn thành / Đã hủy | — | ẩn | (a) POS chưa ghi giá trị `trang_thai` |
| Thẻ đơn: mã, ngày, nhãn trạng thái, tổng | có | không dòng món (danh sách `/don` không có), không nút Đặt lại | (a) / (c) |
| **Không chữ "nợ" (V4)** | nhãn chỉ "Đã hủy" / "Đã thanh toán" theo trường POS; không tính nợ | bỏ "Còn nợ" | luật CLAUDE.md §5 |
| Chi tiết đơn | demo không có (chỉ theo dõi giao hàng) → dựng bằng `order-card` + `summary-row` của demo | — | — |

## Thông tin cá nhân (`thong_tin_ca_nhan_*`) + PIN
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Quán gọi bạn là, email, giới tính, ngày sinh, địa chỉ, hoá đơn, xoá dữ liệu | — | không | (a) POS chưa có cửa |
| Họ và tên, số điện thoại khoá (che giữa) | có; nút "Lưu tên" (demo tự lưu khi rời ô) | nút lưu | `PUT /toi` cần xác nhận lỗi rõ |
| Bảo mật: Mã PIN | `pf-link` + bảng PIN của demo (chấm tròn + bàn phím số, nhập hai lần) | không "Quên PIN / OTP", không thiết bị | (a) |

## Màn không có trong demo
- **Đăng nhập, Mã thành viên (QR):** dựng bằng khối của demo (`pf-card`, `otp-in`, `checkout-btn`, `nt-state`, thẻ ngà viền vàng). Lý do: demo chưa vẽ hai màn này (phiếu B2, B5).

## Màn rộng
Khung ở giữa tối đa 720 px, hai bên nền `--pink-deep` của demo. Mẫu màn to ≥ 1024 px chưa có → KH-UI-4 (d).
