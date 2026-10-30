# KH-SLOGAN-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
SHA: HEAD `d01f6cd` · FETCH_HEAD `d01f6cd` (bằng nhau, không kéo).
```
d01f6cd PHIEU: KH-SLOGAN-1
7af1053 TIEN-DO: KH-UI-5a xong; K9 cho phep khau hieu B2.3 (luat); quy tac luu tren may (luat); mo KH-SLOGAN-1, KH-LUU-1 - so v6
a37d271 Merge pull request #4 from tuquyduong/viec/KH-UI-5a
```

## C1 — lệnh + kết quả
- `grep -rniF "Sức khỏe mỗi ngày" src index.html public` (và `-F` "Sức khoẻ mỗi ngày", "Suc khoe moi ngay") → không còn kết quả (bài thử `thu_KHSLOGAN1.js` ca C1/C2 xanh). Trước khi sửa: `src/pages/TrangChu.jsx:24` và chú thích `src/noiDung/thuongHieu.js:1`.
- Màn đăng nhập (`src/pages/DangNhap.jsx`): KHÔNG có dòng nào ghi khẩu hiệu cũ — không có, không thêm.

## Lệnh người gác chặn (để rút kinh nghiệm)
`for` (B-CHUONGTRINH), `npx` (B-CHUONGTRINH), lệnh gộp `python3 … && node …` (B-PHANTICH), `git worktree` (GIT-LENH), `git add <thư mục>` (GIT-ADD) — đều làm lại theo lệnh đơn giản / Edit / `git archive`.

## Soát độc lập `/ra-soat` — vòng 1 (nguyên báo cáo, rút gọn dòng trống)
ĐẠT. LỖI TÌM ĐƯỢC: không có lỗi chặn.
NGHI NGỜ: (1) ca B3 đo phông trên trang giả dựng từ `khau_hieu.css`, không đo màn mở thật — việc app thật vẽ EB Garamond dựa vào `so_anh/bao_cao.txt` (đo bằng tay, `fonts.check:true`); mức nhẹ. (2) 360 / 430 chỉ có ảnh app (phiếu B4 chỉ đòi khớp ảnh mẫu 390).
NGHIỆM THU: 15/17 · thiếu C3 và D4 (C1 chỉ đủ nửa) — các mục này là việc của `trang_thai.md` (ghi ở dưới).
CHƯA SOÁT ĐƯỢC: `--day-du`, cổng `tu_chay` (phiên chính chạy bên dưới).
BÀI HỌC: bài đo phông nên nạp màn mở thật; khi luật K9 có sẵn thì tách ca đỏ thật khỏi ca giữ (đã làm ở `bang_chung_do.txt`).

## Đếm nghiệm thu (từng mục)
- A1 `thu_KHSLOGAN1.js` ca SHA 2 phông · A2 ca SHA `khau_hieu.css` · A3 ca preload + không nạp EB Garamond ngoài (`index.html:10–11`)
- B1 `ManDau.jsx:103` + `main.jsx:5` (ca B1) · B1b `thu_KHUI5a.js:197` · B2 ca B2 + `thuongHieu.js:1` · B3 ca Chromium (check, loaded=2, 200, in hoa)
- B4 `so_anh/bao_cao.txt` (360/390/430 không tràn, một dòng; ảnh mẫu 390 lệch 0,58 % toàn màn) · B5 không làm (đúng phiếu)
- C1 phần trên · C2 ca C1/C2 · C3 `## Phát hiện` dưới · C4 ca C4
- D1 `thu_KHSLOGAN1.js` 21 ca, gồm K9 xanh + hai ca thử ngược (đỏ) · D2 `so_anh/` + `doi_chieu_demo.md` · D3 `npm test` 20 đạt · 0 hỏng; `--day-du` 22 đạt · 0 hỏng; cổng: xem cuối · D4 `## Chủ quán thử tay` dưới

## Chủ quán thử tay (D4, ≤ 2 thao tác)
1. Mở app bằng cửa sổ riêng tư (hoặc xoá dữ liệu trang) → màn mở hiện "ĐÔNG Y DƯỠNG THỂ" vàng kem, chữ Việt đủ dấu, một dòng, nằm giữa dưới đường kẻ hạt thoi.
2. Vào Trang chủ → dòng nhỏ dưới lời chào đọc "Tứ Quý Đường — Đông Y Dưỡng Thể".

## Phát hiện
- C3: chân trang máy tính của mẫu màn to ("Trà thảo mộc · Sức khỏe mỗi ngày") thuộc KH-UI-4 — việc đó lấy `KHAU_HIEU` (và lớp `khau-hieu`, đơn vị `cqw`).
- Ảnh mẫu B2.3 hiện loa "bật" ở nút âm thanh, app hiện loa gạch chéo (trạng thái tắt tiếng lúc chụp, của demo / KH-UI-2) — không phải lỗi của việc này.
- Ca S1 thứ hai của `thu_KHUI5a.js` (đòi Trang chủ GIỮ "Sức khỏe mỗi ngày") phải đổi cùng C1; đã đổi, đỏ trên gốc, không bớt ca nào.

## Báo cáo 7 mục
- VIỆC: KH-SLOGAN-1 — khẩu hiệu "Đông Y Dưỡng Thể" kiểu B2.3 ở màn mở; đổi chữ ở Trang chủ.
- ĐÃ SỬA: `public/fonts/` (2 phông, chép nguyên), `src/giaoDien/khau_hieu.css` (chép nguyên), `src/main.jsx` (+1 import), `src/components/ManDau.jsx` (+lớp), `src/pages/TrangChu.jsx` (KHAU_HIEU), `src/noiDung/thuongHieu.js` (chú thích), `index.html` (2 preload); bài thử `cong_cu/thu_KHSLOGAN1.js` (mới) + 2 ca S1 ở `thu_KHUI5a.js`.
- BÀI THỬ: `thu_KHSLOGAN1.js` 21 đạt (đỏ trên gốc 12/21); `thu_KHUI5a.js` 357 đạt (2 ca S1 đỏ trên gốc); `npm test` 20 đạt; `--day-du` 22 đạt.
- ĐÃ RÀ K4: grep 3 biến thể cũ ở `src`, `public`, `index.html` — sạch; `e3-tg` chỉ ở `ManDau.jsx` + `demo_1.css`; `KHAU_HIEU` dùng ở ManDau + TrangChu; màn đăng nhập không có.
- CHƯA KIỂM: điện thoại / Zalo thật; chữ to 200 %; phông tải qua mạng thật trên Cloudflare (chỉ thử ở máy); màn rộng (KH-UI-4); ca Chromium B3 đo trang dựng từ `khau_hieu.css`, phần app thật đo tay bằng `npm run dev`.
- GIT: nhánh `viec/KH-SLOGAN-1`, commit `e85c60a` (app), `5e10dd9` (bài thử + hồ sơ); không PR, không merge.
- BÀI HỌC: xem dưới.

## Bài học
- KHOÁ (đã làm, trong Phạm vi): `thu_KHSLOGAN1.js` giữ SHA tệp mẫu, preload, lớp, thứ tự nạp CSS, chuỗi cũ, và K9 thử ngược (màu / phông duyệt không rò sang tệp khác).
- NGUYÊN TẮC: không có mục mới — K1 (đọc code thật) đã đủ: phiếu nói "mỗi chỗ có thể ở DangNhap" nhưng grep cho thấy không có.
- BỎ: bài thử chạy bộ kiểm trong thư mục tạm vì chạy ở cây thật sẽ đệ quy (một lần, đã chú thích trong bài thử); người gác chặn `for`/`npx`/gộp lệnh — chỉ cản trở, không lỗi.
- Đề xuất ngoài Phạm vi: bài đo phông nên nạp màn mở thật (nâng cấp sau nếu muốn).
