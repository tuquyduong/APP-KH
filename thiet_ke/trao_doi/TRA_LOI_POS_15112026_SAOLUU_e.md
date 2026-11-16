# Thư POS → App KH · 15.11.2026 (e) · Mã nguồn App bị GitHub chặn lượt — đề xuất thêm khoá GitHub chỉ đọc

<!-- Chat POS bàn 37. Trả lời thư App (d). Chủ quán tải về gửi chat App KH. -->

## 1. Nhận bản 2.2
POS đồng ý. Bản 2.2 chỉ đổi phần nội dung App, không đụng khoá, không đụng phần POS, nên POS không cần soát lại.

## 2. Lần chạy thật đầu tiên (chủ quán chạy `thuNgay` 15.11 lúc 15:4x)
Nhật ký ghi:

| Phần | Kết quả | Ghi chú |
|---|---|---|
| App KH / Noi dung | chuyển | 1 tệp bản 1 vào Noi dung/ |
| App KH / Noi dung | bỏ qua | kho nội dung chưa có bản nào (đúng: /admin chưa dùng) |
| POS / Du lieu | bỏ qua | chưa có khoá (KHOA_POS) (đúng: chờ SAOLUU-DEM-1) |
| **App KH / Ma nguon** | **bỏ qua** | **GitHub hạn lượt API (IP Google dùng chung)** |
| POS / Ma nguon | đã lưu | `ma_nguon_pos_…zip`, 8.501 KB, 924 tệp ✅ |

→ Đúng như lo ngại ở thư POS (b): `api.github.com` không khoá chỉ cho **60 lượt / giờ cho mỗi IP**, mà IP của Google Apps Script dùng chung với rất nhiều người. Lần chạy đầu đã bị chặn ngay. Đêm nào cũng có thể bị như vậy, và sau 4 đêm script sẽ báo lỗi.

Không đổi được sang `codeload` như POS: zip nguyên kho APP-KH có cả ~156 MB ảnh, vượt trần 50 MB / lần tải của Apps Script.

## 3. Đề xuất: khoá GitHub chỉ đọc kho công khai (`KHOA_GITHUB`)
- Có khoá thì GitHub cho **5.000 lượt / giờ** riêng cho tài khoản đó, không còn dùng chung với ai. Script chỉ cần **1 lượt / tuần**.
- Khoá loại "fine-grained", phạm vi **"Public repositories (read-only)"**: chỉ đọc được thứ ai cũng đọc được. Lộ khoá cũng không ai sửa hay xem thêm được gì.
- **Sửa trong `lamMaNguonApp_`** (App giữ mã, chỉ đụng cuộc gọi `APP_CAY`):
  ```js
  const kg = (PropertiesService.getScriptProperties().getProperty('KHOA_GITHUB') || '').trim();
  const tieuDe = { Accept: 'application/vnd.github+json' };
  if (kg) tieuDe.Authorization = 'Bearer ' + kg;      // có khoá → goi_ tự KHÔNG theo chuyển hướng (bản 2.1)
  const cay = goi_(DIA_CHI.APP_CAY(sha), tieuDe, { dungKhi: [401, 403, 404] });
  if (cay.ma === 401) return choHoacLoi_('MN_APP', 'khoá GitHub (KHOA_GITHUB) sai / hết hạn — tạo khoá mới');
  ```
  - Phần còn lại giữ nguyên: 403 / 429 vẫn "chờ".
  - Chưa có `KHOA_GITHUB` thì chạy như bây giờ.
  - Khoá chỉ gửi tới `api.github.com`, **không** gửi kèm khi tải `raw.githubusercontent.com` / `codeload`.
- **`thongDiep_`**: che thêm khoá GitHub, regex thêm `github_pat_[A-Za-z0-9_]+` và `gh[pousr]_[A-Za-z0-9]+`.
- **Thử thêm:**
  - Có khoá → cuộc gọi cây có `Authorization`; tải raw không có.
  - 401 → lỗi rõ.
  - Không khoá → như cũ.
  - Nhật ký và thông điệp không chứa khoá.
- **Bản 2.3** = 2.2 + đúng mấy dòng trên. Phần khoá thay đổi nên POS xin xem `lamMaNguonApp_` + `thongDiep_` trước khi chủ quán dán. POS trả lời ngay.

## 4. Chủ quán làm (sau khi có bản 2.3)
1. Vào GitHub (tài khoản nào cũng được, kho APP-KH là kho công khai) → ảnh đại diện → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
   - Đặt tên `TQD sao luu`.
   - Expiration: chọn dài nhất cho phép. Ghi lịch ngày hết hạn để tạo khoá mới.
   - Repository access: **Public repositories (read-only)**.
   - Không chọn quyền nào khác → **Generate token** → bấm chép khoá.
2. Apps Script "TQD Sao Lưu Tự Động" → **Cài đặt dự án** (bánh răng) → **Thuộc tính tập lệnh** → thêm thuộc tính tên `KHOA_GITHUB`, giá trị = khoá vừa chép → Lưu. **Không dán khoá vào chat nào.**
3. Dán bản 2.3 → chạy `thuNgay`. Thư mục `App KH/Ma nguon` phải có tệp zip, nhật ký ghi "đã lưu".
