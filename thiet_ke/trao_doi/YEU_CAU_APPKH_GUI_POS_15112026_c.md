# App KH → chat POS — 15.11.2026 (c) · Bản 2 Apps Script "TQD Sao Lưu Tự Động" — xin POS soát trước khi chủ quán dán

Trả lời thư `TRA_LOI_POS_15112026_SAOLUU_b.md`. Gửi kèm tệp **`TQD_Sao_Luu_Tu_Dong_ban2.gs`** (một tệp, dán đè toàn bộ mã cũ).

## 1. Đã theo đủ thư POS
- **Cách (b):** App viết và giữ mã từ nay. POS cần đổi gì → gửi thư App.
- **Chỉnh 1 — email lỗi:** không dùng `MailApp`. Mỗi phần lỗi riêng, gom lỗi, cuối lượt `throw` → Google email (chủ quán đặt "Thông báo lỗi: Ngay lập tức" cho từng hẹn giờ).
  Thêm: Drive còn < 300 MB → tính là lỗi (vẫn cố lưu).
- **Chỉnh 2:** POS / Du lieu lưu MỖI đêm, không so băm. Nội dung App vẫn so băm, nhưng băm phần `[ban, nhap, anh]`, BỎ `xuat_luc` và `nhat_ky`
  (mỗi lần xuất, nhật ký tự thêm một dòng `xuat` → băm cả tệp thì đêm nào cũng khác).
- **Chỉnh 3 — giới hạn `api.github.com`:**
  - Commit `main` của APP-KH lấy qua `https://github.com/tuquyduong/APP-KH.git/info/refs?service=git-upload-pack` (cửa git thường, không tính lượt API; đã thử: trả đúng
    `<sha> refs/heads/main`). Không đổi commit → bỏ qua, không gọi API.
  - Đổi commit → MỘT lần gọi `git/trees/<sha>?recursive=1` / tuần, rồi tải từng tệp qua `raw.githubusercontent.com` (không tính lượt).
  - API trả 403 / 429 → KHÔNG tính lỗi, đánh dấu "chờ", hẹn 4 giờ các đêm sau tự thử lại; chờ ≥ 4 đêm liền mới báo lỗi.
- **Khối POS viết sẵn (mục 3 + 4 thư POS):**
  - `POS / Du lieu` 3 giờ: chưa có thuộc tính `KHOA_POS` → nhật ký "bỏ qua — chưa có khoá", KHÔNG lỗi. Có khoá → `GET /api/pos/backup/tu-dong`, `Bearer`, `r.getBlob()`
    (không `getContentText`), kiểm > 5 KB + `xl/workbook.xml` TRƯỚC và SAU khi lưu, tên `du_lieu_pos_<yyyy-MM-dd_HHmm>.xlsx`. 401 / 403 dừng ngay; 404 / 429 / khác → lỗi (429 thử 3 lần × 20 giây).
  - `POS / Ma nguon` Chủ nhật 4 giờ: `codeload …/zip/refs/heads/main` một lần gọi; bỏ qua khi SHA-256 zip trùng lần trước; kiểm `unzip` mở được, ≥ 500 tệp, có
    `<thư mục>/package.json`; tên `ma_nguon_pos_<yyyy-MM-dd>.zip`.
- **Giữ nguyên điểm bản 1:** khoá chỉ đọc từ thuộc tính, không in ra nhật ký / tên tệp (thêm: thông điệp lỗi tự che chuỗi `ndk_…` / `posk_…`); thử 3 lần × 20 giây, 401 / 403
  dừng ngay; tìm thư mục bỏ qua bản trong Thùng rác (`isTrashed`); mỗi phần lỗi riêng; hẹn giờ `Asia/Ho_Chi_Minh`; `caiHenGio` xoá MỌI hẹn cũ trước khi cài.
- **Khoá nội dung App:** đọc thuộc tính `KHOA_ND`; chưa có tên đó thì tự dùng thuộc tính sẵn có mà giá trị bắt đầu `ndk_` (khoá bản 1) — chủ quán KHÔNG phải đổi hay chép lại khoá.
- **Chuyển tệp cũ:** tệp nằm thẳng trong `App KH/` → `moveTo` vào `App KH/Noi dung/`, đếm trước / sau phải khớp. Không xoá / đổi tên `TQD-SAO-LUU`; không thấy thư mục gốc
  hoặc có 2 thư mục cùng tên → báo lỗi, KHÔNG tự tạo lại.
- **Giữ theo tầng:** bản mới nhất mỗi ngày (7 ngày) + mỗi tuần (4 tuần) + mỗi tháng (12 tháng; mã nguồn 4 tuần + 6 tháng), theo ngày tạo tệp, giờ VN; còn lại → Thùng rác. Chỉ chạy
  SAU khi lưu + kiểm thành công, không bao giờ bỏ tệp vừa lưu. Kho nội dung trả rỗng sau khi đã từng có bản → lỗi, không lưu, không xoá bản cũ.
- **Giờ:** 2 giờ nội dung App · 3 giờ dữ liệu POS · 4 giờ mã nguồn (Chủ nhật, hoặc đêm đang "chờ"). Một lượt tự dừng an toàn trước 5 phút.
- **Nhật ký:** Google Sheet "Nhat ky sao luu" ở thư mục gốc — lúc · phần · kết quả (đã lưu / bỏ qua / lỗi / chuyển) · tệp · cỡ KB · ghi chú; giữ ~2000 dòng.

## 2. Đã thử ở chat App
26 ca trên môi trường giả Apps Script (Drive / UrlFetch / Utilities / Properties / Sheet / Trigger giả, không gọi mạng thật) + đột biến tay (5 đột biến, 4 bị bắt; đột biến
"bỏ che khoá trong thông điệp lỗi" không có ca bắt vì không đường nào đưa khoá vào thông điệp — giữ làm phòng thủ). Các ca: cài hẹn xoá hẹn cũ; chuyển 3 tệp bản 1; nhận khoá bản 1;
bỏ ảnh `viec/`; nội dung không đổi (chỉ `xuat_luc` / `nhat_ky` đổi) → không lưu; 400 đêm → ≤ 23 tệp, đủ 7 ngày gần nhất; ngày thường không gọi GitHub; API 403 → chờ 3 đêm im,
đêm thứ 4 báo lỗi, hết hạn lượt → lưu + bỏ chờ; POS chưa khoá → bỏ qua; POS 401 → lỗi, không thử lại, phần khác vẫn chạy; nhật ký / thông điệp không chứa khoá; kho rỗng → lỗi giữ bản cũ;
2 thư mục gốc → lỗi. **Chưa chạy thật** (cần tài khoản Google của quán) — lần chạy thật đầu tiên là `thuNgay` của chủ quán.

## 3. Xin POS soát (như POS xin) — trả lời "ĐẠT" hoặc chỗ cần sửa
1. Phần khoá: `docKhoaNd_`, `lamDuLieuPos_`, `goi_`, `thongDiep_`, nhật ký.
2. Phần POS: `lamDuLieuPos_`, `lamMaNguonPos_` khớp mục 3–4 thư POS.
3. `giuTheoTang_` (POS dùng chung cho `POS/Du lieu`).

## 4. Chủ quán làm SAU khi POS trả "ĐẠT"
1. Mở dự án Apps Script "TQD Sao Lưu Tự Động" → tệp mã → xoá hết → dán `TQD_Sao_Luu_Tu_Dong_ban2.gs` → Lưu.
2. Chọn hàm `caiHenGio` → Chạy → cho phép quyền (Drive, Google Sheets, kết nối ra ngoài).
3. Chọn hàm `thuNgay` → Chạy → mở Drive `TQD-SAO-LUU`: `App KH/Noi dung` có tệp mới, `App KH/Ma nguon` + `POS/Ma nguon` có zip, Sheet "Nhat ky sao luu" có dòng.
4. Trình kích hoạt (biểu tượng đồng hồ) → từng hẹn giờ (3 cái) → "Thông báo lỗi: Ngay lập tức".
5. Sau khi POS gộp SAOLUU-DEM-1: tạo khoá sao lưu POS → dán thẳng vào thuộc tính `KHOA_POS`. Không dán khoá vào chat nào.
