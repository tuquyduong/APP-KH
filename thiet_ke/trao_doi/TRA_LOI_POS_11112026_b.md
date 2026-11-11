# POS → chat App KH — 11.11.2026 (b) · Trả lời: mật khẩu + giữ đăng nhập · đổi điểm lấy quà · báo thêm quét QR

Sổ POS v61 (chủ quán chốt 11.11). Hợp đồng `/api/kh` hiện tại v13; số phiên bản mới chốt lúc gộp từng việc, POS gửi thư hợp đồng khi gộp.

## 1. Mật khẩu + giữ đăng nhập — POS NHẬN · mã việc **MATKHAU-1** · Opus · **TRƯỚC khai trương**
POS nhận luồng App đề xuất, chốt thêm mấy điểm (tên trường dự kiến, chốt khi gộp):
1. **Không có cửa hỏi "SĐT này đăng nhập cách nào"** (không `co_mat_khau`, không `/dang-nhap/cach`) để không ai dò được SĐT nào có tài khoản.
   App hiện **một màn như nhau cho mọi SĐT**: SĐT + ô mật khẩu + nút "Đăng nhập bằng mã" (xin mã như hiện nay).
2. `POST /dang-nhap/mat-khau { sdt, mat_khau }` → `token`, `khach` (như `xac-minh`). Sai, hoặc SĐT không có / chưa đặt mật khẩu → cùng một lỗi
   `MAT_KHAU_SAI` 400. Sai 5 lần → khoá 15 phút `QUA_NHIEU_LAN` 429.
3. `PUT /toi/mat-khau { mat_khau_moi, mat_khau_cu? }` (token) đúng như App đề xuất: lần đầu không cần mật khẩu cũ; đổi thì cần mật khẩu cũ hoặc
   vừa đăng nhập bằng mã trong 10 phút. Đổi → mọi phiên cũ hết hạn. `MAT_KHAU_YEU` 400.
4. Mật khẩu lưu dạng băm, không trả ra; **chủ quán / nhân viên không xem được**. Quầy có nút **"Xoá mật khẩu App"** (chỉ chủ quán / quản lý, có nhật ký).
5. **Token App 90 ngày**, vẫn tự gia hạn mỗi ngày mở App.
6. **PIN 4 số giữ riêng** (xác nhận tiền). **Quên PIN → đặt lại bằng mã OTP**: `PUT /pin` sẽ cần `pin_cu` HOẶC vừa xác minh mã trong 10 phút
   (đặt PIN lần đầu giữ như cũ). App thêm "Quên PIN? Nhận mã". Mã lỗi mới chốt lúc gộp.
7. **Chủ quán dặn:** màn đăng ký và màn "Đăng nhập bằng mã" ghi rõ **"Nhập số điện thoại có dùng Zalo — mã xác nhận gửi qua Zalo"**.

## 2. Đổi điểm lấy quà — POS NHẬN · mã việc **DOI-DIEM-1** · Opus · cuối danh sách (làm nối tiếp, không chờ), sau VOUCHER-2
- **Quầy hiện đổi điểm thế nào:** POS đã có danh mục quà (Cài đặt) + nút đổi điểm lấy voucher ở màn Khách hàng (`/loyalty/redeem`, trừ điểm
  nguyên tử). DOI-DIEM-1 **nâng cấp cái đã có thành MỘT cách đổi dùng chung App + quầy** — không đẻ luật thứ hai.
- **Chủ quán chốt 11.11:** quà **hiện vật** đổi / nhận ở quầy (quầy đổi hộ khi **khách nhập PIN**); voucher đổi ở App hoặc quầy. Câu cũ
  "điểm chỉ đổi voucher, khách tự đổi trong App" thay bằng câu này. Quà hết hạn chưa dùng → **hoàn điểm** (mặc định, Cài đặt đổi được).
- POS nhận tên cửa App đề xuất: `GET /kho-qua` (không token), `POST /doi-diem { ma_qua, khoa_gui }`, `GET /qua-cua-toi`; phiếu quà gắn tài khoản,
  voucher-quà nằm trong `GET /voucher`; quầy trao quà hiện vật bằng **quét QR phiếu quà** (màn khách quét — mục 3) hoặc tra SĐT → "Đã trao".

## 3. Báo thêm — quét QR ở quầy
- **QUET-1 (trước khai trương, POS tự làm):** quầy quét QR trên điện thoại khách bằng **camera trước của màn khách**. Đề nghị App: màn QR
  thành viên / phiếu quà hiện mã **to, nền trắng, tự tăng độ sáng** nếu trình duyệt cho phép — để camera máy tính bảng đọc nhanh.
- **QUET-2 (cuối danh sách, cần App làm cùng):** màn khách hiện QR của đơn đang thu → khách quét bằng camera điện thoại → App (đã đăng nhập)
  hỏi "Gắn vào đơn này?" → chọn voucher / phiếu quà áp vào đơn. POS gửi hợp đồng khi mở việc.

## 4. Lịch
Trước khai trương: MATKHAU-1 (+ BO-MAN-CU-1, QUET-1 phía POS) — khai trương sớm nhất khoảng T7 28.11.
Cuối danh sách, làm nối tiếp không chờ: DOI-DIEM-1 → QUET-2 → GIOI-THIEU-1 → QUA-TANG-1 (sau cùng).
