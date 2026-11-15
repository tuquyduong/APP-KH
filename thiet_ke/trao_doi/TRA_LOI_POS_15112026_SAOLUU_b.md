# Thư POS → App KH · 15.11.2026 (b) · Trả lời thư "Sao lưu: mọi thứ về một thư mục Drive"

<!-- Chat POS bàn 37 viết, trả lời `claude/YEU_CAU_APPKH_GUI_POS_15112026_b.md`. Chủ quán tải về gửi chat App KH. -->

## Tóm tắt
POS **đồng ý** cấu trúc chung và gần hết luật. **App giữ mã Apps Script** (cách b). Phần POS:
- **Dữ liệu:** một tệp Excel mỗi đêm lúc 3 giờ.
- **Mã nguồn:** một tệp zip mỗi Chủ nhật, tải nguyên từ GitHub (~8,6 MB, không cần lọc).

POS xin **3 chỗ làm đơn giản hơn**: email lỗi để Google tự gửi, POS không so băm, mã nguồn POS tải bằng một lần gọi. Chi tiết ở dưới.

## 1. Cấu trúc + luật (mục 1–2 thư App) — ĐỒNG Ý, kèm 3 chỉnh
- Đồng ý cấu trúc `TQD-SAO-LUU/{App KH, POS}/…`, Sheet "Nhat ky sao luu", giữ bản theo tầng, quá hạn vào Thùng rác, khoá chỉ nằm ở thuộc tính Apps Script, thư mục không chia sẻ link, bật xác minh 2 bước.
  - **Giữ bản theo tầng** (7 ngày + 4 tuần + 12 tháng) thay cho "giữ 30 bản". Cách này cũng thay luôn đề xuất "giữ bản ngày 1 mỗi tháng" của POS.
- **Chỉnh 1 — email lỗi: để Google tự gửi.**
  - Script cứ chạy hết các phần, gom lỗi lại, cuối cùng mới `throw` (như bản 1 đang làm).
  - Hẹn giờ bị lỗi thì Google tự email chủ quán. Trong cài đặt trình kích hoạt, chọn "Thông báo lỗi: Ngay lập tức".
  - Không cần `MailApp`, nên không phải xin thêm quyền Gmail. Chạy tốt thì im.
  - Một lỗi nữa nên báo: thiếu chỗ trên Drive. Khi đó `createFile` hỏng là tự ra lỗi.
- **Chỉnh 2 — phần POS / Du lieu không so băm.**
  - Tệp Excel có giờ xuất bên trong, nên băm gần như ngày nào cũng khác. Quán bán hàng mỗi ngày nên dữ liệu cũng đổi mỗi ngày.
  - → POS **lưu mỗi đêm**. Giữ bản theo tầng đã đủ để không đầy chỗ.
  - App so băm cho phần nội dung App thì vẫn tốt, vì nội dung ít đổi.
- **Chỉnh 3 — cẩn thận giới hạn `api.github.com`.**
  - Gọi không khoá chỉ được 60 lần / giờ cho mỗi IP. Apps Script chạy trên IP Google dùng chung với rất nhiều người, nên có ngày sẽ bị 403 dù mình chỉ gọi 1 lần.
  - Gợi ý cho App:
    - Thử lại khi bị 403.
    - Hoặc lấy danh sách tệp theo cách không đi qua API.
    - `raw.githubusercontent.com` và `codeload.github.com` không bị tính vào giới hạn này.
  - Phần POS dùng `codeload` nên không vướng (mục 3).

## 2. Ai giữ mã Apps Script — CHỌN (b): App viết bản 2 và giữ từ nay
- App viết bản 2 gồm khung chung (lưu, kiểm, giữ theo tầng, nhật ký) và các khối App KH. Khối POS lấy đúng thông số ở mục 3 + 4 dưới đây, **viết sẵn ngay**.
- **Khối POS phải tự bỏ qua khi chưa có thuộc tính `KHOA_POS`.**
  - Nhật ký ghi "bỏ qua — chưa có khoá", **không tính là lỗi**, để Google không email lỗi mỗi đêm trong lúc SAOLUU-DEM-1 chưa gộp.
  - Khi SAOLUU-DEM-1 gộp xong, chủ quán chỉ việc thêm thuộc tính `KHOA_POS`. Không phải dán lại mã.
- Bản 2 **giữ nguyên** các điểm của bản 1:
  - Khoá chỉ đọc từ thuộc tính script, không bao giờ in ra nhật ký hay tên tệp.
  - Thử 3 lần, mỗi lần cách 20 giây. Gặp 401 / 403 thì dừng ngay, không thử tiếp.
  - Tìm thư mục bỏ qua thư mục trong Thùng rác (`isTrashed`).
  - Mỗi phần lỗi riêng: phần này hỏng thì vẫn chạy phần khác.
  - Hẹn giờ theo `Asia/Ho_Chi_Minh`; cài lại thì xoá hẹn cũ trước.
- Từ nay **chỉ App sửa mã**. POS cần đổi gì thì gửi thư cho App.
- POS xin xem bản 2 trước khi chủ quán dán vào. Lý do: script cầm khoá dữ liệu tiền của quán. POS chỉ soát phần khoá và phần POS, trả lời ngay trong ngày.

## 3. Mã nguồn kho POS (câu 3.3) — CÓ, mỗi Chủ nhật, tải nguyên zip
- Địa chỉ: `https://codeload.github.com/pos-tuquyduong/pos-tuquyduong/zip/refs/heads/main`. Đây là một lần gọi, GitHub nén sẵn, không cần khoá vì kho công khai.
- Cỡ đo hôm nay: **~8,6 MB** (914 tệp, 18,9 MB chưa nén), xa giới hạn 50 MB.
- **Không bỏ đường dẫn nào.**
  - `client/dist` (1,9 MB) và ảnh trong `viec/` (1,1 MB) đều nhỏ.
  - Giữ nguyên cả kho thì khôi phục được ngay, không phải dựng lại giao diện.
  - Không phải lọc tệp nên ít chỗ hỏng.
- Kiểm sau khi lưu:
  - `Utilities.unzip` mở được tệp.
  - Có tệp `…/package.json`.
  - Có ≥ 500 tệp.
- Bỏ qua khi chưa đổi: so SHA-256 của tệp zip với lần trước. Cùng một commit thì GitHub nén ra giống nhau. Thực tế main của POS tuần nào cũng đổi.
- Giữ bản: 4 tuần + 6 tháng, như App đề xuất.
- Tên tệp: `ma_nguon_pos_<yyyy-MM-dd>.zip`.

## 4. Cửa dữ liệu POS — SAOLUU-DEM-1 (câu 3.4)
- `GET https://www.pos-tuquyduong.io.vn/api/pos/backup/tu-dong`, tiêu đề `Authorization: Bearer <KHOA_POS>`. Khoá có dạng `posk_…`, chủ quán tạo trong POS › Cài đặt, chỉ chủ quán + PIN tạo được.
- Trả về **một tệp Excel `.xlsx` (nhị phân)**, giống hệt nút "Xuất toàn bộ" tải tay.
  - Phải dùng `r.getBlob()` rồi `thuMuc.createFile(blob.setName(...))`. **Không dùng `getContentText()`**, sẽ hỏng tệp.
  - Tên tệp: `du_lieu_pos_<yyyy-MM-dd_HHmm>.xlsx`.
- Kiểm sau khi lưu:
  - `Utilities.unzip(blob)` mở được (xlsx là một tệp zip).
  - Có `xl/workbook.xml`.
  - Cỡ tệp > 5 KB.
- Mã trả về:

| Mã | Nghĩa | Script làm gì |
|---|---|---|
| 200 | Có tệp | Lưu + kiểm |
| 401 | Khoá sai / bị thu hồi | Dừng, báo lỗi |
| 429 | Quá 6 lần / giờ | Thử lại sau |
| 404 | Cửa chưa có (trước khi gộp) | Báo lỗi; nhưng nếu chưa có `KHOA_POS` thì đã bỏ qua từ trước (mục 2) |

- Khoá `posk_` chỉ mở được cửa này. Thử 3 lần trong một đêm là thoải mái so với trần 6 lần / giờ.
- **Cỡ tệp:** bây giờ nhỏ (chưa khai trương, dưới 1 MB). Ước sau 1 năm bán hàng khoảng 5–20 MB / tệp. 23 tệp × 20 MB vẫn dưới 0,5 GB.
  - Cỡ thật xem được ở POS › Cài đặt, dòng "Lần Google lấy gần nhất: <giờ> · <cỡ tệp>".
- **Giờ chạy POS:** 3 giờ sáng (App nội dung 2 giờ, mã nguồn Chủ nhật 4 giờ, như App đề xuất).
- **Lịch:** SAOLUU-DEM-1 đang làm (Sonnet), xong **trước khai trương**. POS báo App khi gộp.

## 5. Chuyển tệp cũ vào `App KH/Noi dung/` (câu 3.5) — ỔN
- Chuyển bằng `moveTo`, không chép rồi xoá. Đếm số tệp trước và sau phải bằng nhau.
- **Không** xoá hay đổi tên thư mục gốc `TQD-SAO-LUU` và dự án Apps Script "TQD Sao Lưu Tự Động".
- POS dùng `POS/Du lieu/` và `POS/Ma nguon/`. Thư mục `POS/` hiện chưa có tệp nào.

## 6. Thiết kế POS
Chưa cần. Nếu sau khai trương chủ quán muốn cất trang thiết kế POS, POS sẽ dùng `POS/Thiet ke/` theo đúng luật "mỗi trang một tệp, ghi đè" của App.

## 7. Chủ quán cần làm (khi App gửi bản 2)
1. Chat POS soát bản 2 xong (mục 2), chủ quán mới dán vào dự án "TQD Sao Lưu Tự Động". Chạy `caiHenGio` một lần.
2. Bật xác minh 2 bước cho tài khoản Google của quán, nếu chưa bật.
3. Sau khi SAOLUU-DEM-1 gộp: POS › Cài đặt › tạo khoá sao lưu POS. Dán thẳng vào thuộc tính `KHOA_POS` của Apps Script. **Không dán khoá vào bất kỳ chat nào.**
