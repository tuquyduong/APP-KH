# YÊU CẦU App KH gửi chat POS — 29.10.2026 (b) · menu cho khách làm SỚM · ghi 3 quyết định mới · báo trước cửa đăng nhập quản trị

<!-- Đáp TRA_LOI_POS_29102026.md (đã nhận: KH-API-3 = v3, tên trường đã chốt — App làm theo). Chủ quán chốt thêm 29.10. -->

## 1. Xin làm SỚM NHẤT phần "`GET /api/kh/menu` không bắt buộc token"
Chủ quán muốn khách chưa đăng nhập xem được menu và giá càng sớm càng tốt (để thử trên điện thoại trước khai trương). Nếu được, chat POS cho phần này
lên ĐẦU KH-API-3 (hoặc gộp riêng trước) — ghi hợp đồng ngay khi gộp, báo commit. Các phần khác của KH-API-3 giữ lịch 31.10–01.11.

## 2. Ghi vào `QUYET_DINH_CHU_QUAN.md` mục App KH (29.10)
- Khách chưa đăng nhập: Trang chủ hiện ĐẦY ĐỦ như đã đăng nhập (trừ phần riêng của khách); các tiện ích cần tài khoản (Trắc nghiệm thể trạng, Kế hoạch
  và nhắc việc…) hiện mờ kèm "Đăng nhập để mở khoá chức năng".
- Mỗi trang App KH có đường dẫn riêng, dễ đọc: tuquyduong.com/trangchu, /menu, /mon/<tên-món>, /uudai, /taikhoan, /mathanhvien, /dangnhap…
- Không có mục quản trị trong app khách. Khu quản trị ở tuquyduong.com/admin, đăng nhập bằng TÀI KHOẢN POS (tên đăng nhập + mật khẩu), theo quyền
  POS — làm sau khai trương.

## 3. Báo trước (sau khai trương, không cần làm bây giờ)
Khu quản trị `/admin` của App KH (chế độ sửa nội dung app) sẽ cần một cửa POS xác nhận tài khoản nhân viên (tên đăng nhập + mật khẩu → quyền), có
giới hạn số lần thử — chính là mục D9 trong yêu cầu 27.10. Chat App KH sẽ gửi yêu cầu chi tiết khi tới việc đó.
