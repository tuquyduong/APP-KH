# KH-CT-1 — Chương trình đặc biệt ở trang Ưu đãi (`GET /chuong-trinh`, hợp đồng v9 CT-1a) + "Ưu đãi sinh nhật hôm nay"

<!-- Chat App KH soạn 05.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 07.11. Mở SAU KHI KH-SINH-1 đã gộp (dùng `tachNgaySinh` / `hienNgaySinh`
     của `src/dinhDang.js` từ KH-SINH-1). CHẠY SONG SONG với KH-TT-1 (và KH-BAO-1 nếu đã mở) — xem "Cấm".
     Quyết định: 02.11 "chương trình đặc biệt trước khai trương, chỉ HIỂN THỊ — áp dụng tại quán"; 30.10 "Ưu đãi mở cho khách vãng lai"; 02.11 ngày sinh "quán đối
     chiếu căn cước khi áp ưu đãi sinh nhật".
     Hợp đồng v9 (đã có trong kho, `thiet_ke/HOP_DONG_API_KH.md` "Ghi chú v9"): `GET /chuong-trinh` (KHÔNG token; trần chung với `/menu` ≤ 300 lần / phút / IP, vượt → 429
     `QUA_NHIEU_LAN`) → `data[] { ma, ten, mo_ta, loai, dang_bat }` theo thứ tự tạo; `loai` ∈ `sinh_nhat` · `hoc_sinh_gioi` · `khac`; chỉ trả chương trình đang bật và trong
     thời gian chạy. "Chỉ HIỂN THỊ ('áp dụng tại quán'): mức ưu đãi và điều kiện KHÔNG trả ra; App KHÔNG áp chương trình lên đơn App."
     Code hiện có: `src/api.js` `layChuongTrinh` (KH-MUA-1c thêm, chưa màn nào dùng); `CUA_CONG_KHAI` chưa có '/chuong-trinh'; "bây giờ" của App = `src/bayGio.js`. -->

## Mục tiêu
Khách (kể cả chưa đăng nhập) mở Ưu đãi thấy các chương trình đặc biệt quán đang chạy; khách có ngày sinh hôm nay thấy rõ "Ưu đãi sinh nhật hôm nay" và biết mang căn cước đến quán.

## Nghiệm thu

### A. Đọc dữ liệu — hàm thuần, MỘT chỗ
- A1 File MỚI `src/chuongTrinh.js` (hàm thuần, bài thử nạp thẳng):
  - `docChuongTrinh(tl)` → mảng `{ ma, ten, moTa, loai }` theo đúng thứ tự POS; bỏ dòng không phải object / không có `ten`; `dang_bat === false` → bỏ; `loai` lạ → `khac`;
    `data` không phải mảng → `[]`. KHÔNG sắp lại.
  - `sinhNhatHomNay(ngaySinh, homNay)` → true khi ngày + tháng của `ngaySinh` (`YYYY-MM-DD`, đọc bằng `tachNgaySinh`) trùng `homNay` (`YYYY-MM-DD` từ `bayGio`); sinh 29/02
    mà năm nay không nhuận → coi 28/02 là sinh nhật (ghi `## Phát hiện` để chủ quán hỏi POS cùng luật). Thiếu / sai → false. KHÔNG `new Date(chuỗi)` (CLAUDE.md §6).
- A2 `src/api.js`: thêm `'/chuong-trinh'` vào `CUA_CONG_KHAI` (không gửi token — hợp đồng "không token"). Không đổi gì khác trong `api.js`.

### B. Trang Ưu đãi (`src/pages/UuDai.jsx`)
- B1 Khối MỚI "Chương trình đặc biệt" (tiêu đề `sec-head`), hiện cho CẢ khách chưa đăng nhập và đã đăng nhập, đặt ngay dưới banner Giờ vàng (trên thẻ hạng).
  Mỗi chương trình một thẻ theo khuôn thẻ có sẵn của demo (vd `.voucher` như `TheVoucher`, hoặc khuôn khác của demo — kế hoạch nêu): `ten` đậm, `mo_ta` (nếu có) dòng nhỏ,
  nhãn nhỏ **"Áp dụng tại quán"**. Không hiện mức giảm / điều kiện (POS không trả). Biểu tượng theo `loai` dùng bộ biểu tượng sẵn có (kế hoạch chọn, không vẽ mới).
- B2 Không có chương trình (`[]`) hoặc gọi lỗi → ẨN cả khối (không hiện tiêu đề trống, không báo lỗi to). 429 → ẩn như lỗi.
- B3 Đã đăng nhập + `khach.ngay_sinh` (từ `/toi`, kho `cuaToi` sẵn có) là hôm nay + có chương trình `loai: 'sinh_nhat'` → thẻ đó nổi bật (đầu khối) với dòng
  **"Chúc mừng sinh nhật! Mời bạn đến quán, đưa căn cước để nhận ưu đãi hôm nay."**
- B4 Đã đăng nhập + `ngay_sinh` là `null` + có chương trình `sinh_nhat` → dưới thẻ đó dòng nhỏ **"Nhập ngày sinh ở Thông tin cá nhân để nhận ưu đãi sinh nhật"**, bấm → mở
  màn Thông tin cá nhân (đường dẫn sẵn có trong `src/duongDan.js`; nếu phải đụng `App.jsx` để truyền hàm mở màn → ghi rõ trong kế hoạch, sửa tối thiểu).
- B5 Chưa đăng nhập → chỉ danh sách (không B3 / B4). Gọi `GET /chuong-trinh` MỘT lần mỗi lần mở màn (dùng `dungTai` sẵn có), không hỏi lặp.
- B6 Chữ dài không tràn ở 360 px; chữ to theo cài đặt máy không vỡ. CSS mới (nếu cần) ở file MỚI `src/giaoDien/chuong_trinh.css`, `import` trong `UuDai.jsx`
  (KHÔNG sửa `main.jsx`, `giaoDien.css`, `demo*.css`). K9 xanh. Khối mới không có trong demo = lý do (a) "dữ liệu POS mới" — ghi `doi_chieu_demo.md`.

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHCT1.js`: hàm thuần (`docChuongTrinh`: đủ 3 loai + loai lạ + thiếu tên + không phải mảng; `sinhNhatHomNay`: trùng / lệch ngày / 29-02 năm
  nhuận & không nhuận / chuỗi sai / null) + đọc nguồn (`CUA_CONG_KHAI` có '/chuong-trinh') chạy cả khi `KHONG_TRINH_DUYET=1`; phần Chromium (POS giả theo v9):
  chưa đăng nhập thấy khối + "Áp dụng tại quán" và `GET /chuong-trinh` KHÔNG có `Authorization`; `[]` → không có tiêu đề khối; lỗi 500 / 429 → ẩn, trang không lỗi JS;
  đăng nhập + sinh nhật hôm nay (theo `bay_gio` POS giả, KHÔNG theo đồng hồ máy) → dòng chúc mừng; `ngay_sinh: null` → dòng mời nhập, bấm mở Thông tin cá nhân.
  `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- C2 Ảnh 360 / 390 / 430 → `viec/KH-CT-1/so_anh/`: chưa đăng nhập (2 chương trình), sinh nhật hôm nay, chưa nhập ngày sinh; `doi_chieu_demo.md` (demo màn `rewards`).
- C3 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.
- C4 Chủ quán thử tay: (1) ở POS bật một chương trình (vd sinh nhật) → App mở Ưu đãi (chưa đăng nhập cũng được) thấy chương trình + "Áp dụng tại quán";
  (2) tài khoản có ngày sinh hôm nay (nhờ quán sửa ở POS để thử) → thấy dòng chúc mừng.

## Phạm vi
- viec/KH-CT-1/**
- src/chuongTrinh.js
- src/pages/UuDai.jsx
- src/giaoDien/chuong_trinh.css
- src/api.js
- src/App.jsx
- cong_cu/thu_KHCT1.js

## Ngân sách
~90 dòng app + ~220 dòng thử.
**Phương án đơn giản nhất đã xét:** một file hàm thuần + một khối trong `UuDai.jsx` dùng `dungTai(layChuongTrinh)` và kho `cuaToi` sẵn có; dùng lại khuôn thẻ demo; không lưu gì trên máy.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- Chạy song song: KHÔNG sửa `src/pages/ThanhToan.jsx`, `src/giaoDien/thanh_toan.css`, `cong_cu/thu_KHTT1.js`, `cong_cu/thu_KHMUA1*.js`, `cong_cu/thu_KHNHANH1.js` (KH-TT-1);
  `src/pages/TheoDoiDon.jsx`, `src/luuMay.js`, `src/components/PinSheet.jsx` (KH-BAO-1). Cần sửa ngoài Phạm vi → `## Câu hỏi`, dừng.
- KHÔNG sửa `src/dinhDang.js` (dùng `tachNgaySinh` sẵn có), `src/datDon.js`, `src/kiemKhop/**`, `src/main.jsx`, `src/giaoDien/giaoDien.css`, `src/giaoDien/demo*.css`, `thiet_ke/**`,
  bất kỳ bài thử cũ nào.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- KHÔNG áp chương trình lên giá / đơn App, KHÔNG tự đoán mức ưu đãi. KHÔNG làm hạng HANG-1 (KH-HANG-2, chờ POS lên hợp đồng).
- Chỉ push `git push -u origin viec/KH-CT-1`. Không đụng `main`, không merge, không tạo PR.
