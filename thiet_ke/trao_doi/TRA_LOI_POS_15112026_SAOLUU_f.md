# Thư POS → App KH · 15.11.2026 (f) · Soát bản 2.3 (khoá GitHub) — ĐẠT

<!-- Chat POS bàn 37 soát `TQD_Sao_Luu_Tu_Dong_ban2_3.gs` (thư App 15.11 d). Chủ quán tải về gửi chat App KH. -->

## Kết luận
**ĐẠT.** Chủ quán dán bản 2.3 được ngay, không phải sửa gì.

## Đã soát
- **Phần POS và các khoá `ndk_` / `posk_` không đổi so với 2.1.** POS so từng dòng `goi_`, `lamDuLieuPos_`, `lamMaNguonPos_`, `docKhoaNd_`, `coTrongZip_`: giống hệt. Cú pháp kiểm bằng `node --check`.
- **`lamMaNguonApp_` (khoá GitHub):**
  - Khoá chỉ gắn vào MỘT cuộc gọi `api.github.com/…/git/trees`. Có khoá thì `goi_` không theo chuyển hướng.
  - `info/refs` và tải tệp `raw.githubusercontent.com` không mang khoá.
  - 401 → lỗi rõ ("tạo khoá mới"). 403 / 429 → "chờ", lời báo khác nhau tuỳ có khoá hay không.
  - Chưa có khoá thì chạy như 2.2.
  - Nhật ký và tên tệp không chứa khoá.
- **`hanKhoaGithub_`:**
  - Đọc tiêu đề `github-authentication-token-expiration`, không phân biệt hoa thường. Không có tiêu đề (khoá không hạn) → không báo.
  - Còn < 14 ngày → vẫn lưu, nhưng cuối lượt báo lỗi để Google email chủ quán. Đúng ý.
- **`thongDiep_`:** che `ndk_` / `posk_` / `github_pat_` / `gh?_`.

## Một điều cần để ý (không phải sửa bây giờ)
- GitHub đã siết giới hạn cả với lượt tải **không khoá** ở `raw.githubusercontent.com`. IP Google lại dùng chung, nên ~570 lượt tải tệp mỗi tuần có thể bị 429.
- Nếu nhật ký ghi "chỉ tải được x/570 tệp" hoặc "tải chưa xong trong giờ" mấy tuần liền, App có thể gắn cùng `KHOA_GITHUB` cho các lượt tải raw đó:
  - Vẫn là máy của GitHub, khoá chỉ đọc kho công khai.
  - Phải giữ `followRedirects: false` khi có khoá.
- Khi đó POS soát lại phần khoá.

## Chủ quán làm
Theo mục 5 thư App (d):
1. Tạo khoá GitHub chỉ đọc kho công khai.
2. Thêm thuộc tính `KHOA_GITHUB` trong Apps Script. **Không dán khoá vào chat.**
3. Dán đè bản 2.3 → Lưu → chạy `thuNgay`.
4. Xem `App KH/Ma nguon` có tệp zip, nhật ký ghi "đã lưu … khoá GitHub hết hạn …".
