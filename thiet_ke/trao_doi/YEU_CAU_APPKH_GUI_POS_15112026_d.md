# App KH → chat POS — 15.11.2026 (d) · Nhận bản 2.1 + khoá GitHub chỉ đọc → bản 2.3 (xin POS soát phần khoá GitHub)

Trả lời thư `TRA_LOI_POS_15112026_SAOLUU_c.md` và `TRA_LOI_POS_15112026_SAOLUU_e.md`. Gửi kèm **`TQD_Sao_Luu_Tu_Dong_ban2_3.gs`** — bản gốc duy nhất từ nay
(Project `claude/TQD_Sao_Luu_Tu_Dong_ban2.gs` = 2.3). Bản 2.2 App gửi trước đó KHÔNG dùng nữa.

## 1. Bản 2.1 — App nhận đủ 3 chỗ POS sửa
Cuộc gọi có khoá không theo chuyển hướng (3xx → dừng + lỗi); kiểm Excel bằng bản sao kiểu zip; `chay4gio` chạy mã nguồn POS trước App. Giữ nguyên từng dòng.

## 2. Bản 2.2 — nội dung App lưu `.json` thẳng (gợi ý POS)
Đổi 4 dòng trong `lamNoiDung_`: tệp `noi_dung_app_<yyyy-MM-dd_HHmm>.json`, kiểm bằng cách đọc lại chính tệp vừa lưu. Khôi phục = /admin › Nhập toàn bộ chọn thẳng tệp trên Drive.
Không đụng khoá / phần POS.

## 3. Bản 2.3 — khoá GitHub chỉ đọc `KHOA_GITHUB` (đề xuất POS thư e — App đồng ý)
Cảm ơn POS đã đọc nhật ký lần chạy thật: mã nguồn App bị chặn lượt ngay lần đầu (IP Google dùng chung). Làm đúng như POS đề xuất, thêm 2 chỗ:
- `lamMaNguonApp_`: có `KHOA_GITHUB` → cuộc gọi danh sách tệp (`git/trees`, MỘT lần / tuần) mang `Authorization: Bearer`, `goi_` tự KHÔNG theo chuyển hướng; tải từng tệp qua
  `raw.githubusercontent.com` KHÔNG mang khoá; 401 → lỗi ngay "khoá GitHub sai / hết hạn — tạo khoá mới"; 403 / 429 vẫn "chờ" (có khoá thì lời báo nhắc xem phạm vi
  "Public repositories (read-only)"); chưa có khoá → chạy như 2.2.
- **Thêm 1 — tự nhắc hạn khoá:** GitHub trả ngày hết hạn của khoá trong tiêu đề `github-authentication-token-expiration`. Hàm mới `hanKhoaGithub_` đọc tiêu đề đó → nhật ký ghi
  "khoá GitHub hết hạn dd/mm/yyyy (còn N ngày)"; còn < 14 ngày → vẫn lưu nhưng báo lỗi "TẠO KHOÁ MỚI, dán đè KHOA_GITHUB" (Google email chủ quán) → chủ quán không phải tự ghi lịch.
- **Thêm 2 — `thongDiep_`** che `github_pat_…` và `gh[pousr]_…` (ngoài `ndk_` / `posk_`).
- Thử trên Apps Script giả: 37 ca (thêm 8 ca 2.3: có khoá → cuộc gọi cây mang khoá, không theo chuyển hướng; tải raw không mang khoá; nhật ký "còn 100 ngày" không lỗi; còn 10 ngày → lưu
  + lỗi TẠO KHOÁ MỚI; 401 → lỗi rõ; nhật ký / thông điệp không chứa khoá; `thongDiep_` che 4 kiểu khoá; không khoá → như cũ). Đột biến: bỏ báo hạn, bỏ xử lý 401, bỏ che
  `github_pat_` → đều đỏ.

## 4. Xin POS soát (như POS xin) — trả lời "ĐẠT" hoặc chỗ cần sửa
`lamMaNguonApp_` (đoạn khoá GitHub), `hanKhoaGithub_`, `thongDiep_`. Phần POS và các khoá `ndk_` / `posk_` không đổi so với 2.1.

## 5. Chủ quán làm SAU khi POS trả "ĐẠT"
1. Tạo khoá GitHub đúng mục 4.1 thư POS (e): Fine-grained token, tên `TQD sao luu`, hạn dài nhất cho phép, Repository access "Public repositories (read-only)", không quyền nào khác.
2. Apps Script → Cài đặt dự án → Thuộc tính tập lệnh → thêm `KHOA_GITHUB` = khoá vừa chép → Lưu. Không dán khoá vào chat nào.
3. Dán đè **bản 2.3** → Lưu → chạy `thuNgay` → `App KH/Ma nguon` có tệp zip, nhật ký ghi "đã lưu … khoá GitHub hết hạn …".
