# KH-UI-3c — đối chiếu demo (patch39) · Trang chủ, khối Hôm nay, hai ô

Ảnh trong `so_anh/`: `demo_hb_tiles_{360,390,430}.png` (demo, bỏ màn mở) · `app_chua_dn_{360,390,430}_chu{100,130}.png` (app: chưa đăng nhập, Giờ vàng tắt).
Ghi chú ảnh: bài thử dựng trang với POS giả, không phục vụ thư mục `/anh/` nên biểu tượng cái cân hiện khung ảnh vỡ trong ảnh app — khi chạy thật là `/anh/the-chat-scale.svg` (bài thử A1 kiểm đúng đường dẫn).
Cỡ ô: demo `hbQuiz` cao 57,8 / 58,4 / 58,4 px (360/390/430); ô khoá của app cao bằng ô lúc đã đăng nhập ở cả 6 cỡ (ca "A2 … ô khoá cao bằng ô lúc đã đăng nhập").

| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| `.hb-tiles` hai cột (Giờ vàng · Trắc nghiệm) | luôn hai cột, bỏ luật giãn hết hàng | giống demo (lý do chủ quán 30.10: b) |
| Ô `hb-t-flash`: viên đỏ `−X%`, "GIỜ VÀNG", dòng phụ, đếm ngược | có chương trình: như KH-UI-3a, không đổi | — |
| Ô `hb-t-flash` khi chưa có Giờ vàng | ô MỜ (`opacity` .55 trên hình + nhãn), viên "−%", "GIỜ VÀNG", "Hiện chưa có", không bấm, không đếm ngược | **Khác demo** (demo chưa có trạng thái này): quyết định chủ quán 30.10 b; lý do (a) dữ liệu POS chưa có |
| Ô `hbQuiz`: biểu tượng cái cân, "TRẮC NGHIỆM", "Bạn thuộc thể chất nào?" | đã đăng nhập: y hệt demo | — |
| Ô `hbQuiz` khi chưa đăng nhập | cùng khung / biểu tượng / nhãn; ô mờ nhẹ (.55 trên hình + nhãn); dòng phụ THAY bằng "🔒 Đăng nhập để mở khoá chức năng" (không mờ, tối đa 2 dòng, chữ 9–10,5px) | **Khác demo** (demo không khoá): quyết định chủ quán 29.10 + 30.10 a; lý do (a) cần tài khoản |

Chỉ khác demo đúng hai chỗ: ô mờ và dòng khoá. Không màu / phông mới (dùng `--ink`, `opacity`).
