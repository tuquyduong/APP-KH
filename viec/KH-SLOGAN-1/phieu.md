# KH-SLOGAN-1 — Khẩu hiệu "Đông Y Dưỡng Thể" kiểu B2.3 ở màn mở; đổi chữ khẩu hiệu mọi chỗ

<!-- Chat App KH soạn 30.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 01.11. Làm SAU KH-UI-5a (đã gộp).
     Chủ quán chọn mẫu B2.3 ngày 30.10 từ TQD_khau_hieu_kieu_B2_1.html (lớp c3) và chốt: ĐỔI HẾT chỗ ghi "Sức khỏe mỗi ngày" sang "Đông Y Dưỡng Thể".
     Chat đã sửa bộ kiểm K9 (file luật) để cho phép đúng 3 thứ ngoài demo: màu #FBE3A2, màu rgba(60,10,5,.35), phông EB Garamond —
     CHỈ trong tệp src/giaoDien/khau_hieu.css. Máy KHÔNG sửa bộ kiểm.
     Tệp mẫu nằm sẵn ở viec/KH-SLOGAN-1/tai_nguyen/ (2 phông woff2, khau_hieu_B2_3.css, xem_truoc_B2_3.jpg, GHI_CHU.md). Phông EB Garamond giấy phép SIL OFL
     (dùng thương mại miễn phí). -->

## Mục tiêu
Màn mở (Mái đình) hiện dòng "ĐÔNG Y DƯỠNG THỂ" đúng kiểu B2.3 (chữ EB Garamond đậm vừa, vàng kem, giãn chữ rộng, bóng rất nhẹ) đặt dưới đường kẻ hạt thoi
như demo; mọi chỗ khác trong app từng ghi "Sức khỏe mỗi ngày" đổi thành "Đông Y Dưỡng Thể" (chữ thường, giữ kiểu chữ của chỗ đó).

## Nghiệm thu

### A. Tệp mẫu vào app — chép NGUYÊN, không sửa
- A1 Hai phông chép từ `viec/KH-SLOGAN-1/tai_nguyen/` sang `public/fonts/` đúng tên, từng byte. SHA-256:
  - `eb-garamond-600-latin.woff2` = `6a195b7e4f518d53813581f415d7956e02049dd2762b4b9a3af80d56b4257e28`
  - `eb-garamond-600-vietnamese.woff2` = `a15d558d418d7f9e31a8790b520ad326b8a7a8f3a6a321d94e3d63f6d6cc24c8`
- A2 `khau_hieu_B2_3.css` chép NGUYÊN sang `src/giaoDien/khau_hieu.css` (đúng đường dẫn này — bộ kiểm K9 chỉ cho 3 giá trị mới ở tệp này).
  SHA-256 = `085f6d0c095769e87bf7385fab8badaa1f5884f5dccd95e9b9331ff77f2505d3`.
- A3 Phông tự lưu trong app (`/fonts/…`). KHÔNG nạp phông từ Google hay trang ngoài. Thêm `<link rel="preload" as="font" type="font/woff2" crossorigin>`
  cho 2 phông trong `index.html` để chữ không nháy phông lạ khi hiện (chữ hiện lúc ~3,5 giây, `font-display: block` của tệp mẫu giữ nguyên).

### B. Màn mở
- B1 Phần tử khẩu hiệu ở `src/components/ManDau.jsx` (hiện `e3-tg`) có THÊM lớp `khau-hieu`: `className="e3-tg khau-hieu"`. Kiểu chữ B2.3 thắng kiểu demo
  (nạp `khau_hieu.css` SAU các tệp `demo*.css` trong `src/main.jsx`). GIỮ NGUYÊN của demo: vị trí dưới `.e3-dv`, chuyển động hiện lên (`e3Up`, độ trễ), chế độ giảm chuyển động.
- B1b Bài thử của việc trước canh đúng chỗ này: `cong_cu/thu_KHUI5a.js` ca S1 đang đòi `<div class="e3-tg">Đông Y Dưỡng Thể</div>` nên sẽ ĐỎ khi thêm lớp. Việc NÀY được sửa ca S1 đó
  thành `<div class="e3-tg khau-hieu">Đông Y Dưỡng Thể</div>` (chỉ sửa đúng ca đó, không bớt ca nào khác). Đây là đổi hành vi có chủ ý nên KHÔNG ghi vào mục "Bài thử cũ sửa".
- B2 Chữ lấy từ `KHAU_HIEU` ở `src/noiDung/thuongHieu.js` (đã có) — không viết cứng ở chỗ khác. Sửa dòng chú thích đầu tệp đó cho đúng (không còn "các chỗ khác giữ nguyên").
- B3 Dấu tiếng Việt đủ trên màn mở: "ĐÔNG Y DƯỠNG THỂ" vẽ bằng phông mới (không rơi về phông dự phòng) — bài thử đo bằng Chromium: `document.fonts.check("600 16px 'EB Garamond'", 'ĐÔNG Y DƯỠNG THỂ')` đúng, và 2 tệp phông tải được (200).
- B4 Điện thoại 360 / 390 / 430: dòng khẩu hiệu không tràn khung, không xuống hàng (`white-space: nowrap` của mẫu), vẫn nằm giữa. So ảnh: `viec/KH-SLOGAN-1/tai_nguyen/xem_truoc_B2_3.jpg` (390) là ảnh mẫu chủ quán duyệt —
  vùng khẩu hiệu app phải KHỚP ảnh này (cỡ, màu, giãn chữ, vị trí); phần còn lại của màn mở khớp demo như KH-UI-2.
- B5 Màn rộng (≥ 1024 px) KHÔNG làm ở việc này — màn mở màn rộng thuộc KH-UI-4, việc đó sẽ dùng chính lớp `khau-hieu` (đơn vị `cqw` tự co theo khung).

### C. Đổi chữ ở mọi chỗ
- C1 `grep -rnF "Sức khỏe mỗi ngày" src index.html public` không còn kết quả (ghi lệnh + kết quả vào `trang_thai.md`). Hiện biết chỗ: `src/pages/TrangChu.jsx` ("Tứ Quý Đường — Sức khỏe mỗi ngày" → "Tứ Quý Đường — " + `KHAU_HIEU`).
  Xem thêm màn đăng nhập (`DangNhap.jsx`) — chủ quán nhớ ở đó cũng có; nếu thật ra không có dòng nào thì ghi rõ "không có" vào `trang_thai.md`, KHÔNG tự thêm dòng mới.
- C2 Biến thể chính tả ("Sức khoẻ mỗi ngày", "Suc khoe moi ngay", "Trà thảo mộc · Sức khỏe mỗi ngày"): tìm bằng `grep -rniF` cả ba, đổi đủ.
- C3 Chỗ chân trang máy tính (mẫu màn to có "Trà thảo mộc · Sức khỏe mỗi ngày") thuộc KH-UI-4: ghi vào `## Phát hiện` để KH-UI-4 lấy `KHAU_HIEU`, không làm ở đây.
- C4 KHÔNG đổi `<title>`, `manifest.webmanifest`, tên app.

### D. Kiểm
- D1 `cong_cu/thu_KHSLOGAN1.js` (+ sửa ca S1 ở `thu_KHUI5a.js`, B1b): A1, A2 (SHA-256), A3 (không `fonts.googleapis`, có preload), B1 (lớp `khau-hieu` ở ManDau; thứ tự nạp CSS), B3 (Chromium), C1/C2 (không còn chuỗi cũ), K9 xanh và — thử ngược — chép `#FBE3A2` vào tệp khác trong `src/` thì K9 ĐỎ (làm trong thư mục tạm, không commit). Dòng cuối "n đạt · m hỏng".
- D2 Tự so ảnh màn mở ở 390 / 360 / 430 (CLAUDE.md §5): lưu `viec/KH-SLOGAN-1/so_anh/` + `doi_chieu_demo.md` (một bảng: khối / đã làm / khác gì — khẩu hiệu khác demo vì token chủ quán duyệt B2.3, lý do (e)).
- D3 `npm test`, `--day-du`, `node tu_chay/cong.js chay` ĐẠT.
- D4 Chủ quán thử tay (≤ 2 thao tác): (1) mở app bằng cửa sổ riêng tư (hoặc xoá dữ liệu trang) → màn mở hiện "ĐÔNG Y DƯỠNG THỂ" vàng kem, chữ Việt đủ dấu; (2) vào Trang chủ → dòng nhỏ dưới lời chào đọc "Tứ Quý Đường — Đông Y Dưỡng Thể".

## Phạm vi
- viec/KH-SLOGAN-1/**
- src/**
- public/fonts/**
- index.html
- cong_cu/thu_KHSLOGAN1.js
- cong_cu/thu_KHUI5a.js

## Bài thử đỏ
Có — `cong_cu/thu_KHSLOGAN1.js` (và ca S1 đã sửa trong `thu_KHUI5a.js`) ĐỎ trên code gốc (chưa có phông, chưa có `khau_hieu.css`, còn chuỗi "Sức khỏe mỗi ngày").

## Ngân sách
~25 dòng app (lớp + nhập CSS + preload + đổi chữ) + 2 tệp phông + 1 tệp CSS chép nguyên + ~120 dòng thử.
**Phương án đơn giản nhất đã xét:** chép nguyên 3 tệp mẫu, thêm MỘT lớp vào phần tử khẩu hiệu; không viết lại kiểu chữ.

## Đổi cấu trúc DB
không

## Thư viện mới
không (phông là tệp tĩnh, không phải gói npm)

## Cấm
- KHÔNG sửa `kiem_tra_truoc_khi_giao.js`, `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `src/package.json`, `thiet_ke/`.
- KHÔNG sửa nội dung `khau_hieu.css` và 2 tệp phông; muốn đổi cỡ / màu → `## Câu hỏi` cho chủ quán.
- KHÔNG dùng EB Garamond hay hai màu mới ở chỗ nào khác ngoài `khau_hieu.css` (K9 sẽ đỏ — đó là cố ý). KHÔNG thêm màu / phông khác ngoài demo.
- Không nạp phông / ảnh từ trang ngoài. Không bí mật trong code / log. Chỉ push `git push -u origin viec/KH-SLOGAN-1`. Không đụng `main`, không merge, không tạo PR.
