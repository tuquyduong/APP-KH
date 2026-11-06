# KH-CT-1 — kế hoạch

## Phương án
- **Hàm thuần** — A: một file `src/chuongTrinh.js` (~35 dòng: `docChuongTrinh`, `sinhNhatHomNay`) · B: nhét vào `dinhDang.js` (CẤM sửa). → **A**.
- **Gọi API** — A: `dungTai(layChuongTrinh)` ở `UuDai.jsx`, gọi mỗi lần mở màn (B5), không kho chung · B: thêm cửa vào `duLieuKhach.js` (không trong Phạm vi, thừa). → **A**. `api.js` chỉ thêm `'/chuong-trinh'` vào `CUA_CONG_KHAI` + sửa chú thích "chưa màn nào dùng".
- **Thẻ** — A: dùng lại `.voucher` của demo (`.t` tên, `.s` mô tả, `.use` nhãn "Áp dụng tại quán"), biểu tượng `Med` sẵn có (ticket) · B: tự dựng thẻ mới. → **A**; CSS mới chỉ ở `src/giaoDien/chuong_trinh.css` (xuống dòng chữ dài, thẻ sinh nhật nổi bật, dòng mời nhập) — dùng biến màu của demo, K9 xanh.
- **Ngày sinh** — kho `cuaToi` sẵn có (`khach.ngay_sinh`); `undefined` (chưa tải / bản lưu tạm) → không hiện gì; chỉ `null` mới hiện dòng mời nhập (B4).
- **Mở Thông tin cá nhân (B4)** — A: thêm prop `moHoSo` cho `UuDai`, App.jsx truyền `() => di(taoDuongDan('thongtin'))` (1 dòng, giống TaiKhoan) · B: `location` trực tiếp (phá Back). → **A**. Đụng `App.jsx` đúng 1 dòng.
- Khối đặt dưới `BannerGioVang`, trên thẻ hạng / `UuDaiToi`, cho cả hai trạng thái đăng nhập. Rỗng / lỗi / 429 → `null`.
- Sinh nhật hôm nay: `homNay = bayGio().slice(0,10)` (POS, không đồng hồ máy); thẻ `loai:'sinh_nhat'` đưa lên đầu + dòng chúc mừng.
- 29/02 năm không nhuận → 28/02 (ghi `## Phát hiện`).

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHCT1.js`)
- A1 `docChuongTrinh`: 3 loai, loai lạ→khac, thiếu ten, dòng không object, `dang_bat:false`, không phải mảng, giữ thứ tự, mo_ta thiếu.
- A1 `sinhNhatHomNay`: trùng, lệch ngày / tháng, 29-02 nhuận & không nhuận (28/02), chuỗi sai, null / undefined, homNay sai.
- A2 đọc nguồn: `CUA_CONG_KHAI` có `/chuong-trinh`; Chromium: GET không có `Authorization`.
- B1/B5 chưa đăng nhập: khối + "Áp dụng tại quán", đúng 1 lần GET, không B3/B4; thứ tự (dưới Giờ vàng, trên thẻ hạng).
- B2 `[]` / 500 / 429 → không tiêu đề, không lỗi JS.
- B3 sinh nhật hôm nay theo `bay_gio` POS (không đồng hồ máy) + đối chứng K5: sinh nhật KHÔNG phải hôm nay → không dòng chúc mừng.
- B4 `ngay_sinh:null` → dòng mời, bấm → `/taikhoan/thongtin`; có ngày sinh → không dòng mời.
- B6 360/390/430 không tràn ngang.
- Đường song song: tab Ưu đãi đã đăng nhập (`UuDaiToi`) vẫn nguyên — ca K5 (vẫn có "Nhập mã trên hoá đơn").

## Soát kế hoạch (tự soát 4 câu)
Ngoài phạm vi? không. Cách ngắn hơn? đã chọn ít dòng nhất. Ca nghiệm thu thiếu bài thử? không. Đường song song sót? `UuDaiToi` (ca K5).
