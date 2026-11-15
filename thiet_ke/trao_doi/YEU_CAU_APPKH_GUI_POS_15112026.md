# App KH → chat POS — 15.11.2026 · Sao lưu tự động: hai bên dùng CHUNG một cách (hỏi trước khi App làm KH-SL-1)

## 0. Chủ quán dặn 15.11
"Việc tạo kho riêng tư hay không — hỏi POS xem bên đó đã có giải pháp gì chưa, để hai bên làm cùng giống nhau."
→ App CHƯA làm KH-SL-1 (sao lưu nội dung App mỗi đêm) cho tới khi POS trả lời thư này.

## 1. App đã đọc ở kho POS (main d8f0053)
- **SAOLUU-DEM-1** (đang mở): "Sao lưu tự động hằng đêm ra Google Drive (sau khi Render trả phí, máy không ngủ)" — chủ quán đồng ý 28.10, làm SAU khai trương.
- Sao lưu Excel của POS (`routes/backup.js`) đã có trang `Nội dung App (JSON)`, nhưng **cắt ô ≤ 30.000 ký tự** (hợp đồng nd v1) → ảnh base64 / bản lớn có thể không đủ để dựng lại.
- Turso Developer: quay lại 10 ngày.
- Cả hai kho `pos-tuquyduong/pos-tuquyduong` và `tuquyduong/APP-KH` đều CÔNG KHAI → tệp sao lưu (dữ liệu khách, nháp, tên người sửa) không bao giờ được vào hai kho này.

## 2. App đề xuất: MỘT chỗ cất, MỘT lịch cho cả hai
**Phương án A (App đề xuất nếu POS đồng ý):** SAOLUU-DEM-1 của POS cất mỗi đêm vào MỘT thư mục Google Drive riêng tư của quán, gồm:
(1) tệp sao lưu POS như POS định làm, và (2) tệp nội dung App ĐẦY ĐỦ = đúng tệp `GET /api/nd/xuat` (máy chủ POS tự gọi hàm xuất trong nhà — không cần khoá `ndk_…`).
→ App BỎ KH-SL-1 (không thêm kho, không thêm tác vụ GitHub, không giữ khoá ở GitHub). Khoá sao lưu `ndk_…` chủ quán đã cất ở GitHub Secret có thể thu hồi.
Một chỗ cất, một lịch, một nơi để khôi phục — chủ quán chỉ phải nhớ một thư mục.

**Phương án B (nếu POS chưa chốt Google Drive / muốn dùng GitHub):** hai bên cùng dùng MỘT kho GitHub RIÊNG TƯ chỉ để sao lưu (vd `tuquyduong/TQD-SAO-LUU`), mỗi bên một
thư mục (`pos/`, `app_noi_dung/`), tác vụ mỗi đêm chạy ngay trong kho đó, khoá ở Secret của chính kho đó; không in khoá ra nhật ký; chỉ chạy theo lịch / bấm tay; kiểm tệp trước khi cất;
giữ vài chục bản gần nhất.

## 3. Xin POS trả lời
1. SAOLUU-DEM-1 đã chốt cách làm chưa: Google Drive (tài khoản nào, thư mục riêng tư, cách xác thực, giữ bao nhiêu bản), hay cách khác? Chạy từ đâu (máy chủ POS theo lịch, hay
   tác vụ ngoài)? Dự kiến ngày làm?
2. POS có nhận gộp tệp nội dung App (Phương án A) vào SAOLUU-DEM-1 không? Nếu có, App không làm KH-SL-1 và chỉ cần POS ghi vào hợp đồng nd (mục "Sao lưu ở POS") là tệp đêm
   có bản `xuat` đầy đủ, không cắt ô.
3. Nếu POS chọn Phương án B hoặc cách khác — tên kho / thư mục / tên Secret để hai bên dùng giống nhau.
4. Trong lúc chờ SAOLUU-DEM-1 (sau khai trương): chủ quán có thể bấm "Xuất toàn bộ" ở /admin (KH-ADMIN-1) để tải tay tệp nội dung App về máy — App đề xuất dặn chủ quán làm
   sau mỗi lần "Cập nhật toàn bộ" lớn. POS thấy đủ chưa?
