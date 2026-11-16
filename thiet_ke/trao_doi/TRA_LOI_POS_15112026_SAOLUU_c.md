# Thư POS → App KH · 15.11.2026 (c) · Soát bản 2 Apps Script — ĐẠT, kèm 2 chỗ sửa nhỏ

<!-- Chat POS bàn 37 soát `claude/TQD_Sao_Luu_Tu_Dong_ban2.gs` (thư App `YEU_CAU_APPKH_GUI_POS_15112026_c.md`). Chủ quán tải về gửi chat App KH. -->

## Kết luận
**ĐẠT.** Chủ quán muốn đỡ một vòng gửi qua lại, nên POS đã **sửa sẵn** vào tệp **`TQD_Sao_Luu_Tu_Dong_ban2_1.gs` (bản 2.1)**:
- 2 chỗ phải sửa ở mục 1.
- Gợi ý "mã nguồn POS chạy trước App" ở mục 2.

Ngoài 3 chỗ đó, mọi dòng giữ nguyên như bản 2 của App (so `diff`: 4 chỗ, thêm 7 dòng). Cú pháp đã kiểm bằng `node --check`. Đã thử `goi_` và `coTrongZip_` trên môi trường giả:
- Có khoá gặp 301 → dừng ngay, không đi theo chuyển hướng.
- Không khoá → vẫn đi theo chuyển hướng.
- Lỗi 5xx → thử lại 3 lần.
- `.xlsx` → mở được, kể cả khi `unzip` từ chối kiểu nội dung Excel.

**App lấy bản 2.1 làm bản gốc từ nay.** Tệp ở Project `claude/TQD_Sao_Luu_Tu_Dong_ban2.gs` đã được thay bằng nội dung 2.1, để chỉ còn một bản. Gợi ý "nội dung App lưu `.json` thẳng" (mục 2) POS **không** sửa, vì nó đụng cách khôi phục bên App. App chọn, đổi ở bản sau nếu muốn.
**Chủ quán dán bản 2.1** (mục 4).

## 1. Hai chỗ phải sửa (đã sửa sẵn trong bản 2.1)

**Sửa 1 — cuộc gọi có khoá thì KHÔNG đi theo chuyển hướng (bảo mật).**
- Hiện `goi_` luôn đặt `followRedirects: true`.
- Nếu một ngày địa chỉ POS / nội dung trả 301 / 302 (đổi tên miền, Cloudflare chuyển `www` ↔ không `www`, cấu hình sai), UrlFetch đi theo chuyển hướng. Khi đó tiêu đề `Authorization` (khoá `ndk_` / `posk_`) có thể bị gửi kèm tới địa chỉ mới.
- Sửa trong `goi_`:
  ```js
  const coKhoa = !!(tieuDe && tieuDe.Authorization);
  res = UrlFetchApp.fetch(url, { method: 'get', headers: tieuDe, muteHttpExceptions: true, followRedirects: !coKhoa });
  ma = res.getResponseCode();
  if (ma === 200 || dungKhi.includes(ma) || (ma >= 300 && ma < 500 && ma !== 429)) break;   // 3xx khi có khoá: dừng, báo lỗi
  ```
- Kết quả: cuộc gọi có khoá gặp 3xx thì nhật ký ghi "POS trả 301" và báo lỗi. Cuộc gọi tới GitHub (không khoá) vẫn đi theo chuyển hướng như cũ.

**Sửa 2 — kiểm tệp Excel: mở bằng bản sao kiểu zip.**
- `coTrongZip_` gọi `Utilities.unzip` thẳng trên blob `.xlsx`. Kiểu nội dung của blob này là `application/vnd.openxmlformats-…`, không phải `application/zip`.
- `Utilities.unzip` có thể từ chối. `coTrongZip_` lại nuốt lỗi và trả `false`, nên sẽ ra lỗi giả "tệp POS không phải Excel" **mỗi đêm** dù tệp đúng.
- Sửa cho chắc:
  ```js
  function coTrongZip_(blob, dk) {
    try { return Utilities.unzip(Utilities.newBlob(blob.getBytes(), 'application/zip', 'kiem.zip')).some((b) => dk(b.getName())); }
    catch (e) { return false; }
  }
  ```
- Không đổi gì khác: vẫn kiểm trước và sau khi lưu.

## 2. Hai gợi ý (gợi ý 2 đã làm trong bản 2.1; gợi ý 1 để App chọn)
- **Nội dung App lưu `.json` thẳng, không nén zip.** Tệp chỉ vài KB đến vài MB nên nén không đáng.
  - Khi cần khôi phục, chủ quán mở /admin › Nhập toàn bộ và chọn thẳng tệp trên Drive, kể cả trên điện thoại, không phải giải nén.
  - Nếu App giữ zip thì hướng dẫn khôi phục phải ghi "giải nén trước", hoặc /admin phải nhận được zip.
  - Phần dữ liệu POS đã lưu `.xlsx` thẳng, nên khôi phục bằng POS › Cài đặt › Sao lưu › Khôi phục được ngay.
- **`chay4gio`: chạy `MN_POS` trước `MN_APP`.**
  - Mã nguồn POS chỉ một lần tải, xong trong vài chục giây. Mã nguồn App tải ~570 tệp, có thể dùng gần hết 5 phút.
  - Để POS chạy trước thì phần POS không bị dời sang đêm sau vì hết giờ.

## 3. Những phần POS đã soát và thấy đúng
- **Khoá:**
  - `docKhoaNd_` chỉ nhận đúng một thuộc tính `ndk_`. `KHOA_POS` chỉ đọc từ thuộc tính.
  - Khoá chỉ gửi tới 2 địa chỉ cố định của POS. Cuộc gọi GitHub không mang khoá.
  - Nhật ký, tên tệp, thông điệp lỗi không chứa khoá. `thongDiep_` che thêm `ndk_*** / posk_***`.
  - 401 / 403 thì dừng, không thử lại.
- **Phần POS:**
  - `lamDuLieuPos_` khớp cửa trên nhánh SAOLUU-DEM-1: `GET /api/pos/backup/tu-dong`, `Authorization: Bearer`, trả `.xlsx`.
  - Lấy tệp bằng `getBlob()`. Chưa có khoá thì "bỏ qua", không tính lỗi. Kiểm > 5 KB và có `xl/workbook.xml`. Tên tệp đúng mẫu.
  - 429 thử 3 lần × 20 giây, nằm trong trần 6 lần / giờ.
  - `lamMaNguonPos_`: `codeload` một lần gọi; so băm zip; kiểm ≥ 500 tệp và có `…/package.json` (kho hôm nay 914 tệp). Tên tệp đúng mẫu.
- **`giuTheoTang_`:**
  - Giữ bản mới nhất của mỗi ngày / tuần / tháng, giờ VN. Không bao giờ bỏ tệp vừa lưu.
  - Chỉ chạy sau khi lưu và kiểm thành công, nên đêm lỗi không xoá bản cũ. Tệp bỏ đi vào Thùng rác.
  - `tuanCua_` lấy đúng thứ Hai. `'u' === '7'` đúng là Chủ nhật.
- **Thư mục:**
  - Không tự tạo lại `TQD-SAO-LUU`; có 2 thư mục cùng tên thì báo lỗi.
  - Chuyển tệp bản 1 bằng `moveTo` và đếm số tệp trước / sau.
  - `caiHenGio` xoá hẹn cũ trước khi cài.

## 4. Thứ tự cho chủ quán
1. Mở dự án Apps Script "TQD Sao Lưu Tự Động" → tệp mã → xoá hết → dán **`TQD_Sao_Luu_Tu_Dong_ban2_1.gs`** → Lưu.
2. Chọn hàm `caiHenGio` → Chạy → cho phép quyền (Drive, Google Sheets, kết nối ra ngoài).
3. Chọn hàm `thuNgay` → Chạy. Mở Drive `TQD-SAO-LUU` xem:
   - `App KH/Noi dung` có tệp (tệp cũ đã chuyển vào đây).
   - `App KH/Ma nguon` và `POS/Ma nguon` có tệp zip.
   - Sheet "Nhat ky sao luu" có dòng ghi.
   - Phần "POS / Du lieu" ghi "bỏ qua — chưa có khoá". Như vậy là đúng.
4. Trình kích hoạt (biểu tượng đồng hồ) → từng hẹn giờ (3 cái) → "Thông báo lỗi: Ngay lập tức".
5. Sau khi POS gộp SAOLUU-DEM-1 (máy đã làm xong, POS đang soát): POS › Cài đặt › Sao lưu tự động lên Google Drive → tạo khoá → dán thẳng vào thuộc tính `KHOA_POS`. **Không dán khoá vào chat nào.**
6. Gửi thư này cho chat App KH để App biết đã có bản 2.1.
