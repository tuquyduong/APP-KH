# YÊU CẦU App KH → chat POS — 03.11.2026 (b) · Khách đăng ký trên App: (1) KHÔNG hiện ở màn Khách hàng POS, (2) phải đủ trường như khách tạo ở POS (chủ quán 03.11)

## Chủ quán thấy gì
Chủ quán tạo tài khoản MỚI trên App thật (`app-kh.pages.dev`, mã lấy ở quầy theo KH-QUAY-2), đăng nhập được, App chào đúng xưng hô.
Nhưng vào POS → màn Khách hàng thì **không thấy khách vừa tạo**.

## App đã đọc code POS (main 2c81b0f) — nguyên nhân có vẻ ở đây
- Khách mới từ App được ghi vào `pos_customers` (`server/utils/maKhach.js` dòng ~186, `created_by = 'app_kh'`, `sync_status = 'retail_only'`).
- Màn Khách hàng (`client/src/pages/Customers.jsx` → `customersV2Api.list()`) gọi `GET /api/pos/v2/customers` (`server/routes/customers-v2.js` dòng ~201).
  Danh sách này lấy từ **SX** (`fetchSXCustomers` → `/api/pos/customers/export`), cộng thêm đơn đăng ký `pos_registrations` đang chờ.
  Bảng `pos_customers` chỉ được dùng khi SX không trả lời (`getLocalCachedCustomers`).
- Vì vậy khách chỉ có ở `pos_customers` (khách App tạo) **không bao giờ hiện**, trừ khi SX đang lỗi.
- Theo `QUYET_DINH_CHU_QUAN.md` 26–27.10 ("Bỏ app SX: mọi thứ về POS") thì danh sách khách nên lấy từ POS.

## Xin POS
1. Xác nhận nguyên nhân trên.
2. Sửa để màn Khách hàng (và ô tìm khách ở màn Bán hàng, nếu dùng chung nguồn — App chưa đọc) hiện **mọi khách trong `pos_customers`**, kể cả khách App tạo,
   kèm điểm, ví, hạng như khách khác; tìm được theo SĐT và tên. Khách trùng SĐT giữa SX và POS chỉ hiện một dòng.
3. Có thể hiện nhãn nhỏ "Đăng ký qua App" cho khách `created_by = 'app_kh'` (tuỳ POS, không bắt buộc).
4. **Chủ quán chốt 03.11: khách mới tạo từ App phải ĐỦ trường thông tin y như khách tạo ở POS.** App đã so hai đường:
   - Quầy (`server/routes/customers.js` dòng ~363): `phone, name, notes, parent_phone, relationship, qr_code` (bằng `sinhQrKhongTrung`), `customer_type`,
     `requested_product, requested_cycles, sync_status, created_by, created_at`.
   - App (`server/utils/maKhach.js` dòng ~186): `phone, name, xung_ho, address, qr_code` (bằng `generateQRCode` — KHÔNG kiểm trùng như quầy; trùng thì
     `ON CONFLICT DO NOTHING` bỏ qua im lặng rồi báo "không tạo được khách"), `customer_type 'retail', sync_status 'retail_only', created_by 'app_kh', created_at`.
   Xin POS: hai đường dùng **MỘT hàm tạo khách chung** (luật "một quy tắc — một hàm"), cùng mặc định, cùng cách sinh QR (`sinhQrKhongTrung`), mọi bảng
   kèm theo (nếu quầy tạo thêm gì cho khách mới — ví, hạng, điểm… — App chưa thấy, POS kiểm) cũng tạo như nhau. Chỉ khác `created_by` (`app_kh`) để biết
   nguồn. Trường quầy chưa có mà App có (`xung_ho`, `address`) giữ nguyên. Sau này thêm trường (ngày sinh, email…) thì thêm ở hàm chung là đủ cả hai đường.
   Bài thử: tạo một khách qua quầy và một khách qua App → so từng cột (trừ `id`, `phone`, `qr_code`, giờ, `created_by`) phải giống nhau.
5. Báo App tên việc + khi nào xong. Việc này cần TRƯỚC khai trương (nhân viên phải thấy khách App để cộng điểm, cấp hạng, xem đơn App).
