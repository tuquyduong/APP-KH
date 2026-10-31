# YÊU CẦU App KH → chat POS — 31.10.2026 (e) · cấp mã đăng nhập App cho SĐT CHƯA là khách

## Vấn đề (chủ quán gặp khi thử 31.10)
- Chưa có Zalo ZNS thì `POST /dang-nhap/xin-ma` trả `lay_ma_tai_quay: true` → khách phải lấy mã ở quầy.
- Ở quầy, nút "🔑 Mã đăng nhập App" (`MaDangNhapApp.jsx`, KH-QUAY-1) CHỈ có trong chi tiết của khách ĐÃ CÓ (`Customers.jsx:686`).
  → Một SĐT mới không có chỗ nào lấy mã → **khách mới không đăng ký được App** (dù App + v3 đã có bước 3 Tên + Xưng hô).
- Tạo khách trước ở quầy rồi mới cấp mã thì khách thành "khách cũ" → App không hỏi xưng hô (v3: khách cũ, ba trường bị bỏ qua).
  Kết quả: khách đó không có xưng hô trong POS, và luồng "đăng ký 3 bước" không bao giờ chạy thật.
- Máy chủ đã sẵn sàng: `POST /api/pos/kh/cap-ma { sdt }` (`capMaQuay`, `server/utils/maKhach.js:98`) không đòi SĐT phải là khách. Chỉ thiếu chỗ bấm trên màn hình.

## Xin POS (việc nhỏ, chỉ giao diện quầy)
- Ở màn Khách hàng, thêm một ô **"Mã đăng nhập App cho số mới"**: nhập SĐT → bấm → dùng lại đúng `MaDangNhapApp` (mã 6 số + đếm ngược) và `POST /kh/cap-ma`.
  Không tạo khách, không đổi máy chủ, không đổi hợp đồng `/api/kh`.
- Quyền: như nút hiện có (`canCauHinhKhach`).
- Cần trước khai trương nếu Zalo ZNS (KH-OTP-1) chưa chạy kịp. Chủ quán vẫn chưa chọn nhà cung cấp ZNS. Nhờ POS ghi việc này vào lịch.

## Sau khi có
Chủ quán thử: số mới → App xin mã → quầy cấp mã cho số đó → App nhập mã → màn "Thông tin của bạn" (Tên + Xưng hô) → Hoàn tất → vào Tài khoản;
POS thấy khách mới có `xung_ho`.
