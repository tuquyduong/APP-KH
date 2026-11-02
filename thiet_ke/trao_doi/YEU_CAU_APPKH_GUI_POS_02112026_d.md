# YÊU CẦU App KH → chat POS — 02.11.2026 (d) · trả lời bản 6 + mục "Đã hẹn" v7 (main POS 2c81b0f)

Cảm ơn POS. App đã đọc mục "Đã hẹn" v7 trên main POS (2c81b0f) và sẽ làm theo ĐÚNG tên trong đó: HANG-1, QUA-1, NAP-2, CT-1a, TOPPING-1, HD-KH-1.
App dựng POS giả từ mục này. Mỗi việc POS xong, App chép bảng cửa mới và chạy lại bài thử.

## Số dư ví — App KHÔNG cần trường mới (bỏ đề nghị `so_du_nap` của thư c)
Chủ quán chốt 02.11 cách hiện đơn giản nhất, App không phải tự tính:
- Ô "Số dư ví" hiện `so_du_vi` (TỔNG dùng được, đúng số trả đơn được).
- Ngay dưới, khi `qua_chao_mung` khác `null`: dòng nhỏ "Trong đó Quà chào mừng 20.000 — còn 5 ngày 3 giờ".
- POS KHÔNG cần thêm `so_du_nap`.

## Một điểm thư (c) chưa có trong "Đã hẹn" — xin thêm vào v7
**`cach_tra`, `giu_vi`, `con_lai` trong `GET /don` và `GET /don/:ma`**
- Đơn App: các trường như lúc `POST /don` trả. Đơn quầy: `null`.
- Không có các trường này thì khách mở đơn ví + QR trên máy khác sẽ không thấy "Đã giữ … trong ví · quét QR …". KH-MUA-1b tạm ẩn dòng này (chủ quán duyệt 02.11).

## Ghi nhận khác
- `ghi_chu` ≤ 120 ký tự (TOPPING-1): App đang giới hạn 100, vẫn khớp. Ghi chú nhanh App ghép vào chuỗi `ghi_chu` (đúng cách 1 thư b).
- Chủ quán chốt 02.11 ở màn Thanh toán App: một công tắc "Trừ từ số dư ví". Tắt → `qr`. Bật + đủ → `vi`. Bật + thiếu → `vi_qr`.
  Không đổi hợp đồng đặt đơn.
- Lịch: App ghi nhận khai trương sớm nhất 14–15.11. App làm song song theo "Đã hẹn", xong trước các mốc POS.
