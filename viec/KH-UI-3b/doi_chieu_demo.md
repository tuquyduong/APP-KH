# Đối chiếu demo (patch39) ↔ app — KH-UI-3b

Cách so: Chromium + Playwright có sẵn, cùng cỡ 360×844 (bài thử còn đo ở 390 và 430, chữ 100% / 130%), POS giả theo hợp đồng v3 (`cong_cu/thu_KHUI3b.js`).
Ảnh ở `so_anh/`: `demo_*.png` chụp bằng `so_anh/chup_demo.js` (mở thẳng `thiet_ke/app_kh_demo.html`); `ung-dung_*.png` do chính bài thử chụp (`LUU_ANH_DIR`).
Ảnh app KHÔNG có hình nền / logo / ảnh món vì POS giả của bài thử trả 204 cho file tĩnh — khác này do công cụ chụp, không phải do app.
Lý do khác demo: (a) POS chưa có cửa / việc sau · (b) chữ số mẫu của demo không dùng · (c) chưa có giỏ/đặt đơn · (d) màn rộng · (e) khẩu hiệu B2.3 · (f) lỗi có sẵn trong demo (phiếu F2 cho phép khác).

## Màn Thông tin cá nhân (`renderProfile`) — `so_anh/demo_thong-tin-ca-nhan_360.png` ↔ `so_anh/ung-dung_thong-tin-ca-nhan_360.png`
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Thẻ "Quán gọi bạn là": hàng nút + dòng xem trước “Chào buổi …, **chị** Linh” | Có, đầu màn: 7 nút lấy từ `XUNG_HO`, xem trước cùng khung `pf-prev` + biểu tượng chat; chạm → `PUT /toi { xung_ho }` | (a) Demo 6 nút, app 7 (thêm "Bác" theo hợp đồng v3). Chữ nút viết hoa chữ đầu (Anh, Chị…) theo `XUNG_HO` của phiếu B1; demo viết thường. Giờ của dòng xem trước là `bay_gio` POS (demo: đồng hồ máy) theo CLAUDE.md §6. Thêm dòng "Đã lưu cách xưng hô" (phiếu: hiện "Đã lưu" như thẻ tên) |
| Thẻ "Thông tin": Họ và tên (lưu khi rời ô), Số điện thoại + "Đổi số", Email, Giới tính | Họ và tên + nút "Lưu tên"; Số điện thoại che giữa, chú thích "Dùng để đăng nhập" | (a) Email, Giới tính, "Đổi số" (OTP): POS chưa có cửa. Nút "Lưu tên" là hành vi đã có từ trước (KH-XEM-1), phiếu B2 giữ |
| Thẻ "Bảo mật" (Mã PIN, Quên PIN, Thiết bị) | Giữ như trước: chỉ dòng Mã PIN | (a) Quên PIN / Thiết bị: POS chưa có cửa (không đổi ở việc này) |
| Thẻ "Giao hàng & hoá đơn": Địa chỉ đã lưu (nhiều), Thông tin xuất hoá đơn | Thẻ "Giao hàng": MỘT ô "Địa chỉ nhận hàng" (≤ 300 ký tự) + nút "Lưu địa chỉ" + dòng "dùng chung với quầy, in trên hoá đơn" | (a) Nhiều địa chỉ, xuất hoá đơn công ty → KH-HOSO-1. Demo không có ô nhập địa chỉ đơn; ô này theo hợp đồng v3 ("dia_chi" một địa chỉ), dùng lại khối `pf-row` + `hq-b` |
| Quà sinh nhật, Dữ liệu của tôi | Không làm | (a) POS chưa có cửa (ngày sinh, xoá tài khoản) |

## Đầu Trang chủ (`setGreeting`) — `so_anh/demo_trang-chu-dau_360.png` ↔ `so_anh/ung-dung_trang-chu-dau_360.png`
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Lời chào “Chào buổi sáng, chị Linh” | “Chào buổi tối, Chị Linh” (ảnh chụp lúc giờ POS giả 20:30): mốc 5–11 sáng / 11–13 trưa / 13–18 chiều / còn lại tối đúng demo; tên ngắn = từ cuối họ tên (`shortName`) | Xưng hô viết hoa chữ đầu (phiếu C1; demo viết thường trong lời chào). Giờ theo `bay_gio` POS, không theo máy (§6). Thiếu xưng hô / tên / giờ → bỏ phần thiếu (không bịa) |
| Dòng phụ, chuông thông báo, thẻ "Xem cách dùng app", ô Kế hoạch, banner Combo, Chăm sóc theo nhu cầu | Không đổi ở việc này | (a)/(e) như các việc trước (KH-UI-3a/3c, KH-UI-5b); khẩu hiệu "Đông Y Dưỡng Thể" thay "Sức khỏe mỗi ngày" (e) |

## Ô `.hb-k` (nhãn nhỏ in hoa ở ô Giờ vàng / Trắc nghiệm) — `so_anh/ung-dung_hb-k_360.png`
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| `.hb-k`: cỡ `clamp(8.5px,2.5vw,9.5px)`, đậm 800, in hoa, `overflow:hidden`, dòng kế thừa `1.2` từ `.hb-tx` | Giữ nguyên màu / phông / cỡ chữ; thêm `.hb-k{ line-height:1.7 }` ở `giaoDien.css` | (f) Lỗi CÓ SẴN trong demo: demo đo ra dòng 10.8px ở cỡ 9px (`chup_demo.js` in `lh:"10.8px"`) → `overflow:hidden` cắt đỉnh dấu của Ắ Ệ Ờ. Bài thử đo bằng `measureText` (khoảng trống trên/dưới nhãn ≥ 0) ở 360/390/430 × chữ 100%/130%: trước −1.1 / −1.8px, sau ≥ 0. Nhãn cao thêm ~4px; bài KH-UI-3c (chữ trong ô không tràn / không bị đè, ở 360–430 × 100%/130%) vẫn xanh |
