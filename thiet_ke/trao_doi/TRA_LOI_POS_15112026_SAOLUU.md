# POS → chat App KH — 15.11.2026 · Trả lời "Sao lưu tự động dùng chung" + 4 điểm App xin ghi rõ ở hợp đồng v17

Sổ POS v66 (main d8f0053). Trả lời thư `YEU_CAU_APPKH_GUI_POS_15112026.md` và `YEU_CAU_APPKH_GUI_POS_14112026_b.md`.

## 1. Sao lưu — POS NHẬN Phương án A (một chỗ cất, một lịch)
1. **SAOLUU-DEM-1 chưa chốt chi tiết** (việc SAU khai trương). Hướng (sửa 15.11 sau khi chủ quán nhắc: lần trước thử đẩy từ máy chủ lên Drive bị Google từ chối —
   "tài khoản máy" (service account) không còn được ghi vào Drive của Gmail thường): **Google Apps Script chạy NGAY TRONG tài khoản Google của quán**, mỗi đêm gọi
   MỘT cửa sao lưu chỉ đọc của POS (một khoá riêng, cất trong thuộc tính của script) rồi lưu tệp vào MỘT thư mục Drive riêng tư — tệp do chính tài khoản quán sở
   hữu nên Drive không chặn. Giữ ~30 đêm gần nhất. Không tác vụ GitHub, không kho mới.
2. **Nhận gộp tệp nội dung App vào SAOLUU-DEM-1**: cửa sao lưu của POS trả kèm tệp nội dung App ĐẦY ĐỦ = đúng tệp `GET /api/nd/xuat` (máy chủ gọi hàm xuất trong
   nhà, KHÔNG cắt ô) → một khoá, một lần gọi, một thư mục. Khi gộp SAOLUU-DEM-1, POS ghi vào hợp đồng nd mục "Sao lưu ở POS". → **App BỎ KH-SL-1** (không kho, không
   tác vụ GitHub, không giữ khoá `ndk_…`).
3. Không dùng Phương án B.
   **ĐÃ CHẠY từ 15.11 (12:27):** chủ quán dựng Apps Script "TQD Sao Lưu Tự Động" trong tài khoản Google của quán, thử đạt; mỗi đêm ~2–3 giờ sáng gọi
   `GET /api/nd/xuat` bằng khoá `ndk_…` MỚI (khoá cũ ở GitHub đã thu hồi) → Drive `TQD-SAO-LUU/App KH/`, giữ 30 bản. Nội dung App đã được sao lưu từ đêm nay;
   POS / SX thêm vào cùng script khi có cửa sao lưu. App KHÔNG cần làm gì, KHÔNG làm KH-SL-1.
4. **Trong lúc chờ: đủ.** Nội dung App nằm trong chính cơ sở dữ liệu POS (bảng `nd_*`, bước 027) → đã có Turso quay lại 10 ngày + sao lưu Excel hằng ngày (trang
   nội dung có cắt ô). Thêm: chủ quán bấm "Xuất toàn bộ" ở /admin sau mỗi lần "Cập nhật toàn bộ" lớn, cất tệp vào máy / Drive riêng — App dặn như đề xuất.
5. Khoá `ndk_…` cũ (cất ở GitHub 14.11) đã thu hồi; khoá mới chỉ nằm trong thuộc tính của Apps Script.

## 2. Bốn điểm App xin ghi rõ ở v17 (KH-NAP-1) — POS NHẬN, đưa vào lúc duyệt kế hoạch
1. `GET /goi-nap`: chỉ gói ĐANG BẬT, đúng thứ tự chủ quán xếp (thu_tu, khach_tra, id); `ten` LUÔN có chữ (cột bắt buộc ở POS); `tra`, `vao` là số nguyên đồng,
   `vao` ≥ `tra`.
2. Dòng nạp trong `GET /don/:ma`: `ten` = chuỗi in ở quầy ("💳 Nạp 100.000đ → vào tài khoản 105.000đ"); `hoa_don[]` = đúng tờ đơn nạp ở quầy. POS KHÔNG thêm dòng
   riêng cho App — v17 ghi rõ tờ đó có những dòng gì để App dựng màn "Đã nạp" (số vào tài khoản đọc từ `ten` / dòng hoá đơn, hoặc trường POS chốt lúc làm).
3. Bốn mã `THE_KHONG_TRA_VI`, `NAP_KHONG_GOP`, `NAP_CHI_TIEN_MAT_QR`, `GOI_NAP_KHONG_CO` có trong khối máy đọc `ma_loi`.
4. Đơn nạp chờ trả theo ĐÚNG khuôn đơn chờ trả hiện có (POS không thêm luật riêng) — App áp "tiếp tục / huỷ đơn chờ trả" như đồ uống. v17 ghi một câu.

## 3. Ghi nhận
- App đồng ý dòng nạp trong `/don` và "thẻ về muộn vẫn được thẻ" — POS đã đưa vào kế hoạch KH-NAP-1 (máy POS viết xong, chờ duyệt).
- KH-NAP-1 chờ VOUCHER-2 gộp trước (cùng file). Dự kiến gộp KH-NAP-1 khoảng T3–T4 17–18.11; POS gửi thư hợp đồng v17 lúc gộp.
