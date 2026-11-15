# KH-QC-1 — kế hoạch

## Phương án
- **Chọn (A):** `chonQuangCao` lọc dòng POS hợp giờ bằng `hopGio` có sẵn, GIỮ thứ tự POS; trả một đối tượng = các trường banner (tieuDe, phu, nut, dich, maMon, khoa, macDinh — như cũ, TrangChu/BannerHomNay không đổi)
  + trường dải (`chu`, `khoaDai`) + `dai: { dich, maMon }` (đích riêng của dải, vì dải và banner có thể khác dòng). ~35 dòng đổi ở `quangCao.js`.
- B (tách hai hàm `chonDai` / `chonBanner`, App gọi hai lần): nhiều dòng hơn, phá ca C2 của 5g ("gọi MỘT lần"). Bỏ.
- App.jsx (~15 dòng): trạng thái `quangCaoPos`, hỏi `/quang-cao` một lần khi tới Trang chủ / trang có dải đầu tiên + khi quay lại sau ≥ `PHUT_KIEM`; truyền `quangCao: quangCaoPos` vào `chonQuangCao`;
  dải hiện khi `chu` ≠ "" (không còn dựa vào `macDinh` — dải và banner có thể khác nguồn), đích dải = `dai`.
- api.js: `layQuangCao` + `'/quang-cao'` trong `CUA_CONG_KHAI`. canTuPos.js: 1 dòng. HOP_DONG_API_KH.md: chép nguyên.

## Quy tắc chọn
- Dải: dòng POS hợp giờ ĐẦU TIÊN (kể cả `gio_vang`) → chữ `chu_dai`; không có → Giờ vàng App dựng → chương trình → ẩn.
- Banner: duyệt dòng hợp giờ theo thứ tự POS; dòng `gio_vang` (khi `/gio-vang` báo đang chạy) → banner Giờ vàng của App; dòng có `tieu_de` ≠ "" → banner POS; không có → Giờ vàng App dựng → chương trình → chữ mặc định.
- Đích: `menu · mon · uudai · tracnghiem`; `mon` thiếu `ma_mon` → `menu`; khác / "" → không bấm.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHQC1.js`)
A1 (cmp + sha trong lệnh, ca đọc nguồn) · A2 (thu_KHKHOP1) · B1 (api.js: layQuangCao, công khai, không token) · B2 (hỏi 1 lần + sau ≥ 30 phút, Chromium + đọc nguồn) ·
B3 (7 ca khung giờ) · B4 (thứ tự `uu_tien` 1 trước 5; `gio_vang` như dòng thường; qua mốc giờ đổi dòng không hỏi lại) · C1 · C2 (dải ≠ banner) · C3 (đích mỗi loại + `mon` thiếu) ·
C4 (chữ HTML hiện như chữ; `data-nd-khoa`) · D1–D3 · D4 ảnh.
K5 (không chặn oan): `data: []` / lỗi / 429 → nguồn cũ; dòng hỏng bị bỏ; không POS vẫn như hôm nay.

## Đường song song cần canh
`thu_KHUI5d/5g/KHND3c/5b` đọc `chonQuangCao` (D2: sửa đúng ca thứ tự `uu_tien` + ca dòng chỉ `chu_dai` làm banner); `App.jsx` chia với KH-THE-2 / KH-ADMIN-1 — chỉ sửa khối quảng cáo.
