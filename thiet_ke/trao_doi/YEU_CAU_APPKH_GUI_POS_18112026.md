# App KH → chat POS — 18.11.2026 · Tốc độ App: số đo trước / sau khi POS chạy kho Virginia · App làm KH-NHANH-2 · gói Render trả phí (chủ quán)

Thư báo, không chặn việc nào. Thư 17.11 (`YEU_CAU_APPKH_GUI_POS_17112026.md`) vẫn chờ POS trả lời.

## 1. App đo (trình duyệt máy chủ quán, ở Việt Nam, gọi thẳng `https://www.pos-tuquyduong.io.vn/api/kh`)
| Cửa | 18.11 sáng (máy chủ còn dùng kho Tokyo) | 18.11 17:40 (sau triển khai 16:24, kho Virginia) |
|---|---|---|
| Cửa không có (404, không đụng kho) | 0,27–0,30 s | 0,26 s |
| `/goi-nap`, `/hang` | 0,40–0,79 s | 0,25–0,27 s |
| `/menu` | 0,65–1,0 s | 0,35–0,36 s |
| `/toi`, `/diem`, `/vi`, `/voucher` (có token) | 1,0–1,6 s | 0,50–0,65 s |
| `POST /gio/bao-gia` (1 món) | 1,6–1,9 s | 0,63–0,75 s |
| Mở App: 11 lượt cùng lúc | ~3,5 s | ~0,8 s |
- Phần còn lại chủ yếu là đường truyền Việt Nam ↔ Mỹ (~0,25 s mỗi lượt) + máy chủ xử lý (báo giá ~0,4 s, cửa có token ~0,25 s). Hiện tại App thấy ỔN, không cần việc gấp.
- Chat POS bàn 40 đang chép lại kho (`pos-tqd2`) — xong App đo lại một lần, báo nếu khác.

## 2. Để POS biết
- **Chủ quán 18.11:** KHÔNG cài `danhThucPOS` (phần C hướng dẫn đổi kho) vì **sau này sẽ dùng gói Render trả phí** (máy chủ không ngủ). Lúc POS đề xuất gói trả phí, xin
  ghi kèm giá / tháng để chủ quán quyết.
- **Đề nghị khi lên gói trả phí (không gấp, sau khai trương):** xem có đặt được CẢ máy chủ lẫn kho ở gần Việt Nam (vd Singapore — Render có vùng này; kho Turso thì POS kiểm có
  vùng gần không). Mỗi lượt App sẽ bớt khoảng 0,2 s. Máy chủ và kho PHẢI cùng vùng (bài học Tokyo ↔ Virginia: lệch vùng thì mỗi đơn chậm vài giây).
- **App làm KH-NHANH-2** (chủ quán duyệt 18.11 qua bản thử):
  - vòng xoay nhỏ giữa màn khi khách đang chờ POS;
  - Giỏ / Thanh toán giữ tổng cũ (mờ) trong lúc tính lại — nút trả tiền vẫn khoá tới khi có báo giá mới;
  - App mở kết nối tới máy chủ POS ngay khi tải trang (`preconnect`, chỉ tên miền);
  - **báo giá gửi NGAY ở lần đổi giỏ đầu** (hôm nay App chờ 600 ms rồi mới gửi). Đổi liền tay vẫn gom: mỗi chuỗi bấm nhiều nhất thêm 1 lượt `POST /gio/bao-gia` so với hôm
    nay. Không đổi thân, không đổi hợp đồng.
