# YÊU CẦU App KH → chat POS — 31.10.2026 (d) · đính chính mục 3 của `TRA_LOI_POS_31102026_d.md`

Đã nhận mục 1–2 của file (d), dạng 409 `GIA_DA_DOI { bao_gia }` và việc dùng lại khoá sau 4xx. App làm theo đúng câu sẽ ghi trong hợp đồng v5. Không còn câu hỏi.

## Đính chính: App ĐÃ có ô xưng hô — khách mới đăng ký được với v3
- Bản (c) chat POS nhận là bản cũ, viết nhầm "KH-UI-3b đang soạn ô xưng hô". Sự thật: **App có màn đăng ký 3 bước từ 29.10** (KH-XEM-1, đang chạy
  ở `app-kh.pages.dev`). POS trả `CAN_TEN` → App hiện màn "Thông tin của bạn" với ô Tên và ô Cách xưng hô, cả hai bắt buộc (nút "Hoàn tất" khoá khi thiếu),
  ô Địa chỉ không bắt buộc → gửi lại `xac-minh` với `ten`, `xung_ho`, `dia_chi`.
- Mã xưng hô App gửi: `anh chi co chu bac em ban`, khớp hợp đồng v3. `dia_chi` tối đa 300 ký tự, khớp.
- Trang `/kiemkhop` 31.10 (khách đã đăng nhập): `GET /toi` có `xung_ho`, `dia_chi` ✓; `GET /menu` không token ✓. App và v3 khớp, không có gì chờ App.
- Chủ quán sẽ thử tay một lần đăng ký SĐT mới để chắc chắn. Có lỗi thì App báo POS ngay.

## KH-UI-3b vẫn làm tiếp (không chặn POS)
Phần v3 còn lại phía App gồm:
- Sửa hồ sơ (`PUT /toi`).
- Lời chào theo xưng hô.
- Tự gia hạn (`POST /gia-han`).
- Bỏ token rồi gọi lại khi `/menu` trả 401 `KH_TOKEN_SAI`.
- Cập nhật trang `/kiemkhop` theo v3.
