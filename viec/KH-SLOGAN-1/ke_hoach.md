# KH-SLOGAN-1 — kế hoạch

## Phương án
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| Tệp mẫu → app | `cp` 2 phông + `khau_hieu_B2_3.css` → `public/fonts/`, `src/giaoDien/khau_hieu.css`; SHA-256 trong bài thử | viết lại CSS | phiếu cấm sửa; 0 dòng viết tay |
| Màn mở | thêm lớp `khau-hieu` ở `ManDau.jsx` (1 dòng) + `import './giaoDien/khau_hieu.css'` sau `giaoDien.css` trong `main.jsx` (1 dòng) | CSS riêng | chung lớp với KH-UI-4 sau này |
| Preload phông | 2 thẻ `<link rel="preload">` trong `index.html` (đã có đường dẫn `/fonts/…`) | không preload | A3 đòi |
| Đổi chữ | `TrangChu.jsx`: `Tứ Quý Đường — {KHAU_HIEU}` (+ import); sửa dòng chú thích `thuongHieu.js` | viết cứng | B2 |
| Bài thử | `thu_KHSLOGAN1.js` (SHA, CSS, preload, lớp, thứ tự nạp, grep chuỗi cũ, Chromium đo phông, K9 ngược); sửa 2 ca S1 ở `thu_KHUI5a.js` | — | D1 |

Ước ~10 dòng app + ~110 dòng thử.

## Ca thử ↔ nghiệm thu
A1 SHA 2 phông · A2 SHA CSS · A3 không `fonts.googleapis` cho EB Garamond + 2 preload · B1 lớp ở ManDau + thứ tự import · B2 chữ lấy từ `KHAU_HIEU`, không viết cứng ·
B3 Chromium: `fonts.check` + 2 tệp phông trả 200 · B4 so ảnh 360/390/430 (D2, tay) · C1/C2 không còn 3 biến thể · C4 `<title>`/manifest không đổi · D1 K9 xanh + thử ngược `#FBE3A2` ở tệp khác → K9 đỏ (thư mục tạm).

## Đường song song · luồng hợp lệ (K5)
- `index.html` đã có `fonts.googleapis` cho Inter (của demo) — KHÔNG đụng; bài thử chỉ cấm nạp EB Garamond từ ngoài.
- Hai ca S1 cũ của `thu_KHUI5a.js` (màn mở; "chỗ khác giữ nguyên") đỏ vì có chủ ý; ca thứ hai buộc phải đổi cùng C1 (cùng hành vi S1) — không bớt ca nào.
- Bài cũ khác (`thu_KHLINK1/UI2/XEM1/KHUNG`) phải vẫn xanh.

## Soát kế hoạch
Việc nhỏ, tự soát; `/ra-soat` ở bước 8.
