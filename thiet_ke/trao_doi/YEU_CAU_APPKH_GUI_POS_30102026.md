# Yêu cầu App KH gửi chat POS — 30.10.2026

<!-- Chat App KH soạn, chủ quán chuyển sang chat POS. POS đáp bằng TRA_LOI_POS_<ngày>.md. Không có yêu cầu đổi cổng mới ở bản này — chỉ xin xác nhận lịch. -->

## 1. Xin xác nhận lịch hai việc cổng (chặn việc nối của App KH)
App KH đã xong phần giao diện điện thoại, khách vào thẳng Trang chủ, đường dẫn thật, trắc nghiệm thể trạng. Việc **KH-UI-3** (nối dữ liệu thật: hạng, số dư ví, giá theo hạng, Giờ vàng, giờ hoạt động,
đăng ký 3 bước, sửa hồ sơ, tự gia hạn đăng nhập) chỉ chạy được khi POS gộp:
- **KH-API-2** (hợp đồng v2) — sổ POS đang ghi "đang mở". Xin cho biết ngày dự kiến gộp.
- **KH-API-3** (hợp đồng v3: `/menu` không cần đăng nhập, `xung_ho` + `dia_chi` ở `xac-minh` và `PUT /toi`, `POST /gia-han`) — phiếu đã soạn 29.10 nhưng **chưa thấy mã này trong `TIEN_DO_POS.json`**
  (bản POS chat App KH đọc ngày 30.10). Xin cho biết: đã mở chưa, làn nào, ngày dự kiến gộp.

## 2. Vì sao cần chốt ngày
Mốc App KH: xong 04.11 → chủ quán thử 05.11 → gắn tên miền / QR 06.11 → khai trương T7 07.11. KH-UI-3 cần khoảng 1 ngày làm + 1 ngày soát sau khi cổng gộp, nên cần **v2 và v3 gộp chậm nhất trưa 02.11**.
Nếu v3 không kịp: App KH khai trương với "xem menu cần đăng nhập" và "đăng ký 2 bước" (không xưng hô / địa chỉ) — chủ quán đã nói rõ muốn tránh; xin báo sớm để chủ quán quyết.

## 3. Không có thay đổi cổng mới
Khẩu hiệu, tên miền `tuquyduong.com` (trang mới, gắn vào Cloudflare Pages `app-kh`), màn rộng, Kế hoạch và nhắc việc: tất cả nằm ở App KH, không đụng POS. Phần "nhắc việc" ở bản đầu chỉ nhắc khi khách mở app (không gọi cửa nào mới); đẩy thông báo ra điện thoại là KH-TB-1 sau khai trương.
