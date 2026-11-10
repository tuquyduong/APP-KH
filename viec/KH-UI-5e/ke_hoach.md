# KH-UI-5e — kế hoạch

## Phương án
- **Nội dung văn khấn**: A) file dữ liệu tĩnh `src/noiDung/vanKhan.js` chép nguyên VK của demo (~110 dòng); B) nhúng vào `vanKhan.js` — chọn A (phiếu yêu cầu).
- **Hàm thuần**: A) `src/vanKhan.js` (vkNext 11 dịp, điền bài khấn thành đoạn {t, mark}, sắp dịp) + `kehoach.js` thêm ngày kế tiếp (dương/âm), người thân (đọc/ghi/thêm/sửa/xoá), `upList` gộp 5 nguồn, `chuThich` (toolBadge). B) viết riêng 1 file lịch người thân — chọn A (dùng lại `amSangDuong`/`tiepAm` có sẵn, ít dòng hơn).
- **Màn**: `TienIch.jsx` thêm 3 phần (NgayCanNho, VanKhan, VanKhanMot) — tách `components/NguoiThan.jsx` (bảng nổi thêm/sửa) và `components/VanKhanMot.jsx` để TienIch.jsx không vượt ~500 dòng. `KeHoach.jsx` đổi lưới 6 ô + dải Sắp tới.
- **Đường dẫn**: `duongDan.js` thêm `ngaycannho`, `vankhan` vào danh sách + mẫu `/kehoach/vankhan/:dip`; `/kehoach/ngayle` vẫn mở được (App render TienIch id=ngayle → hiển thị Ngày cần nhớ tab Lễ). App.jsx KHÔNG sửa: TienIch nhận `id` = ngayle thì tự chọn tab Ngày lễ.
- **Tên khách / xưng hô**: `dungCua(cuaToi)` (duLieuKhach.js, có sẵn) trong KeHoach/TienIch — không sửa App.

## Ca thử ↔ nghiệm thu (thu_KHUI5e.js)
A1 thứ tự + chữ nhỏ · A2 ẩn Chu kỳ theo xưng hô · A3 "Sắp có" + thông báo · A4 dải Sắp tới 3 dòng / trống / Xem tất cả · B1 hai tab + /kehoach/ngayle → tab lễ · B2 danh sách người thân, văn khấn giỗ, xoá hỏi lại · B3 thêm / sửa · B4 lần tới dương/âm/29-02/nhuận/30 thiếu, tròn N tuổi, nhắc → Sắp tới + chuông · B5 tab Ngày lễ · C1 11 dịp + vkNext quanh Tết · C2 điền bài khấn, lễ vật tick còn sau tải lại, A+/A− · C3 không Đọc to / Đặt hoa quả · D1 đọc bản cũ / hỏng · E1…E4.

## Đường song song cần canh
- Bản lưu 5b/5c/5d (không có `nguoi`, `vk`) phải đọc được; `ghiKeHoach` ghi thêm 2 trường mới, bản 5d vẫn đọc ngược được.
- Luồng hợp lệ không bị chặn: giỗ ngày 30 âm ở tháng thiếu; sinh nhật 29/02; tên 40 ký tự; không nhập năm sinh.
