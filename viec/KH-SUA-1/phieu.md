# KH-SUA-1 — Sửa gấp: thẻ mã QR ở Theo dõi đơn bị xếp ngang (trùng tên lớp CSS sau KH-THE-2)

<!-- Chat App KH soạn 15.11.2026. Việc THƯỜNG [Th], **Sonnet** — chạy thẳng tới hết, không chờ duyệt kế hoạch. Hạn 16.11. Mở trên main sau #38 KH-THE-2 (e6a01ce hoặc mới hơn).
     Chạy SONG SONG với KH-ADMIN-1 (Opus) và KH-THE-3 (Sonnet) → xem mục Cấm. Lỗi chủ quán chụp 15.11 (đơn APP0001) — xảy ra với MỌI đơn trả QR, không riêng đơn thẻ.
     Đọc CLAUDE.md §4, §5, §11. -->

## Mục tiêu
Thẻ mã QR ở Theo dõi đơn về đúng mẫu chủ quán duyệt 06.11 (tên quán ở trên; khung trắng có số tiền, mã QR lớn, dòng nội dung chuyển khoản ở dưới) cho MỌI đơn trả QR;
ô "Chuyển khoản QR" ở Thanh toán thẻ giữ đúng bản thiết kế 14.11; thêm bài canh để lỗi trùng tên lớp CSS không lọt lần nữa.

## Nguyên nhân (chat đã tìm và đã thử bản sửa trên bản sao)
KH-THE-2 thêm vào `src/giaoDien/thanh_toan.css` các luật `.the-qr{ display:flex … box-shadow:0 0 0 2px var(--pink-dark) }`, `.the-qr-ic`, `.the-qr > div`, `.the-qr b`,
`.the-qr small`, `.the-qr .the-qr-dau` cho ô cách trả của Thanh toán thẻ (`src/pages/ThanhToan.jsx` ~dòng 282–285: `the-qr`, `the-qr-ic`, `lop="the-qr-dau"`) — TRÙNG tên lớp
`the-qr` / `the-qr-dau` của `src/components/TheQR.jsx` + `src/giaoDien/the_qr.css`. CSS của App gộp MỘT gói (không tách theo trang) → thẻ QR ở Theo dõi đơn thành hàng ngang
(viền hồng, số tiền tràn khỏi khung, mã QR nhỏ khó quét); ngược lại `the_qr.css` cũng đè ô ở Thanh toán thẻ (viền vàng, nền kem).
Chat đã thử: đổi 3 tên lớp của ô Thanh toán thẻ thành `tt-qr`, `tt-qr-ic`, `tt-qr-v` (7 dòng, 2 tệp) → `thu_KHSOHD1` 103/0, `thu_KHTHE2` 154/0 (có Chromium), ảnh đúng mẫu.
Bài cũ không bắt được vì chỉ canh "thẻ không tràn khỏi màn", không canh bố cục BÊN TRONG thẻ.

## Nghiệm thu

### A. Sửa
- A1 `src/pages/ThanhToan.jsx` + `src/giaoDien/thanh_toan.css`: ô cách trả của Thanh toán thẻ dùng tên lớp riêng `tt-qr`, `tt-qr-ic`, `tt-qr-v` (thay `the-qr`, `the-qr-ic`,
  `the-qr-dau`); mọi luật cũ chuyển NGUYÊN sang tên mới (không đổi màu, cỡ, khoảng cách). KHÔNG sửa `TheQR.jsx`, `the_qr.css`, `qrThuongHieu.js`.
- A2 Sau sửa: tên lớp bắt đầu `the-qr` CHỈ còn ở `src/components/TheQR.jsx` và `src/giaoDien/the_qr.css`.

### B. Kiểm
- B1 Bài MỚI `cong_cu/thu_KHSUA1.js` (chạy cả `KHONG_TRINH_DUYET=1`; phần trình duyệt dùng lại khung POS giả có sẵn, vd `dungMay` của `thu_KHMUA1b.js` hoặc khung của `thu_KHSOHD1.js`):
  - Tĩnh — **bài canh chung trùng lớp gốc:** đọc mọi `src/**/*.css` KHÔNG tên `demo*.css`, bỏ chú thích; "lớp gốc" = bộ chọn CHỈ gồm một lớp (`.ten{`, kể cả khi đứng trong danh
    sách `a, .ten{`); một lớp gốc định nghĩa ở ≥ 2 tệp → đỏ, in tên lớp + tệp. (Chat đã thử thuật toán: main e6a01ce → đúng một chỗ `the-qr` [thanh_toan.css, the_qr.css];
    bản sửa và ea0281e → 0, không báo nhầm.) Bài này ĐỎ trên gốc.
  - Tĩnh: `ThanhToan.jsx` không còn lớp `the-qr*`.
  - Chromium 390 và 360, Theo dõi đơn chờ trả QR (POS giả): `.the-qr-dau` nằm TRÊN `.the-qr-o` (đáy phần đầu ≤ đỉnh khung trắng); `.the-qr-tien` nằm trọn trong `.the-qr-o`
    (cả trái lẫn phải); `svg` của mã rộng ≥ 200 px; `getComputedStyle(.the-qr).display` khác `flex`; `box-shadow` của `.the-qr` là `none`.
  - Chromium Thanh toán thẻ: `.tt-qr` `display:flex`, viền là `box-shadow` hồng như bản 14.11, KHÔNG có viền vàng `#B08028` / nền kem `#FBF3E6`.
  - Đỏ trên gốc (main e6a01ce) kể cả `KHONG_TRINH_DUYET=1` — ghi bằng chứng đỏ.
- B2 Bài CŨ dựa vào tên lớp cũ của ô Thanh toán thẻ (nếu có, vd `thu_KHTHE2.js`) → sửa đúng ca (đổi có chủ đích, đỏ trên gốc); KHÔNG dùng `## Bài thử cũ sửa`. Bài khác giữ xanh.
- B3 Đột biến tay (`viec/KH-SUA-1/dot_bien_tay.js`) ≥ 3, mỗi cái ĐỎ: trả lại tên `the-qr` cho ô Thanh toán thẻ · thêm `.the-qr{ display:flex }` vào một tệp css khác
  (không phải demo) · bỏ luật `.tt-qr{ display:flex … }`.
- B4 Ảnh 390 trước / sau: Theo dõi đơn chờ QR + Thanh toán thẻ → `viec/KH-SUA-1/so_anh/` (máy POS giả phải phục vụ tệp `public/` cho ảnh có logo).
- B5 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- B6 Chủ quán thử tay sau khi gộp: đặt một đơn đồ uống trả QR → Theo dõi đơn: thẻ QR đúng mẫu (tên quán trên, mã lớn, số tiền nằm trong khung trắng).

## Phạm vi
- viec/KH-SUA-1/**
- src/pages/ThanhToan.jsx
- src/giaoDien/thanh_toan.css
- cong_cu/thu_KHSUA1.js
- cong_cu/thu_*.js
- cong_cu/no_chu_cung.txt

## Ngân sách
~10 dòng app + ~150 dòng thử. **Phương án đơn giản nhất đã xét:** đổi tên 3 lớp của ô Thanh toán thẻ (không đụng `TheQR`). Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- `src/pages/ThanhToan.jsx` CHỈ sửa ô cách trả QR (~dòng 282–285) — phần thẻ tóm tắt (`.the-mini`) là của KH-THE-3 chạy song song; `thanh_toan.css` CHỈ các luật `the-qr*`.
- KHÔNG sửa `src/components/TheQR.jsx`, `src/giaoDien/the_qr.css`, `src/qrThuongHieu.js`, `src/pages/TheoDoiDon.jsx`, `src/App.jsx`, `src/api.js`, `src/noiDung/**`, `src/main.jsx`,
  `public/**`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG đổi màu / bố cục ô Thanh toán thẻ — chỉ đổi tên lớp.
- Chỉ push `git push -u origin viec/KH-SUA-1`. Không đụng `main`, không merge, không tạo PR.
