# KH-TT-1 — đối chiếu demo (màn Thanh toán)

Ảnh app ở `so_anh/` (360 / 390 / 430; ví tắt, ví đủ, ví thiếu, số dư lỗi, ví 0đ). Ảnh demo ↔ app so lại bằng tay do chat App KH ở bước gộp; việc này chỉ đổi cách bấm + chữ, không đổi màu / phông / bo góc (dùng lại `.notif-row`, `.switch`, `.checkout-btn` của demo).

| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Dòng "Trừ từ số dư ví" (`.notif-row` + `.switch`) | Giữ nguyên kiểu; CẢ dòng là chỗ bấm (`role=switch`), `.switch` chỉ là hình; cao ≥ 44px | Vùng bấm rộng hơn ô công tắc; số dư lỗi hiện "Chưa đọc được số dư · Bấm để thử lại" | quyết định chủ quán 05.11 (ảnh iPhone) |
| Dòng "Chuyển khoản QR" | BỎ | Khác demo | quyết định chủ quán 05.11: "bỏ thanh ck qr" |
| Tiêu đề "Cách trả tiền" | Giữ; ví 0đ → ẩn luôn (không để tiêu đề trống) | — | (a) dữ liệu POS: không có ví thì không còn lựa chọn |
| Nút đặt `.checkout-btn` | Kiểu giữ nguyên; chữ "Thanh toán qua QR <tổng>" / "Trừ ví <tổng>" / "Trừ ví <số dư> + QR <thiếu>"; xuống dòng được (`thanh_toan.css`) | Thay "Xác nhận trả <tổng>" | quyết định chủ quán 05.11 |
