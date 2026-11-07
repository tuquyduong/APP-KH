# KH-HANG-2 — Hạng thẻ theo HANG-1 (hợp đồng v10): hạng chủ quán tặng, "Không thời hạn", gói tháng, xếp theo thứ bậc + 2 sửa nhỏ khối chương trình (soát KH-CT-1)

<!-- Chat App KH soạn 06.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 07.11. Mở SAU KHI KH-CT-1 đã gộp. CHẠY SONG SONG với KH-SOHD-1 — xem "Cấm".
     POS main đã có HANG-1 (hợp đồng v10; KH-SOHD-1 chép bản hợp đồng v11 vào `thiet_ke/` — việc NÀY KHÔNG chép hợp đồng, KHÔNG sửa `src/kiemKhop/**`).
     Trích nguyên văn "Ghi chú v10 (HANG-1 — hạng thẻ có thứ bậc, gói, hạng chỉ cấp)" của hợp đồng POS v11:
       "- `thu_bac`: số nguyên, lớn = cao. `/hang` xếp `thu_bac` tăng dần. `thu_tu` = `thu_bac` (giữ cho App cũ).
        - `chi_cap`: `true` = hạng chỉ chủ quán cấp (không bán) — `goi` luôn `[]`, `gia_the` `null`.
        - `goi[] { so_thang, gia }`: gói ĐANG BÁN ở quầy (bật + đã đặt giá; giá số đồng nguyên > 0), xếp theo `so_thang`. Gói chưa đặt giá / đang tắt không hiện.
          App KH chỉ hiển thị — mua thẻ trên App chưa có (P3b sau khai trương).
        - `gia_the` (giữ MỘT đợt cho App cũ): giá gói ngắn nhất; `null` khi `chi_cap` hoặc chưa gói nào đang bán. App mới đọc `goi`.
        - `/toi.khach.hang`: hạng có `thu_bac` CAO NHẤT còn hạn (hạng trên hết hạn mà hạng dưới còn → hạng dưới). `het_han` = `null` khi không thời hạn.
          `/menu` `gia_hang` theo cùng luật."
     Bảng cửa v10: `GET /hang` → `data[] { id, ten, phan_tram, phan_tram_nhom_dac_biet, chi_cap, goi[] { so_thang, gia }, thu_bac, gia_the, thu_tu }`.
     Sổ việc KH-HANG-2 (02.11): "chi_cap → 'Hạng dành tặng khách thân thiết', không hiện giá; het_han null → 'Không thời hạn'; xếp hạng theo thu_bac; goi[] chỉ hiện
     (nút mua thẻ vẫn là P3b sau khai trương)".
     Soát cuối KH-CT-1 (06.11, chủ quán giao chat quyết): (1) `ChuongTrinhToi` (UuDai.jsx) đọc "hôm nay" lúc vẽ, không vẽ lại khi `bay_gio` POS về sau; (2) hai chương trình
     `sinh_nhat` cùng lúc → dòng chúc mừng lặp trên cả hai thẻ. -->

## Mục tiêu
Trang Ưu đãi hiện hạng thẻ đúng như POS mới: hạng chủ quán tặng không có giá, thẻ không thời hạn ghi rõ, các gói tháng đang bán; khối chương trình đặc biệt luôn tính "hôm nay"
theo giờ POS.

## Nghiệm thu

### A. Thẻ hạng (`src/pages/UuDai.jsx` `TheHang`, `src/giaHang.js`)
- A1 Khách có hạng (`/toi.khach.hang`): `het_han` có → "Thẻ hết hạn: …" như nay; `het_han: null` → **"Không thời hạn"**. Hạng đó là `chi_cap` (tra `id` trong `/hang`) → thêm dòng
  nhỏ **"Hạng dành tặng khách thân thiết"**.
- A2 Bảng các hạng (khách chưa có hạng / vãng lai): xếp theo `thu_bac` tăng dần (POS đã xếp — App KHÔNG sắp lại, chỉ không đảo); mỗi hạng: tên + % giảm như nay;
  `chi_cap` → "Hạng dành tặng khách thân thiết", KHÔNG hiện giá; có `goi[]` → hiện các gói "<so_thang> tháng — <gia>" (`dinhDangGia`), không nút mua; `goi` rỗng và không
  `chi_cap` → không dòng giá. KHÔNG đọc `gia_the` nữa (App mới đọc `goi`).
- A3 Giữ luật cũ: hạng 0% không có trong bảng (`hangCoGiam`); dữ liệu thiếu / sai kiểu → ẩn phần đó, không bịa số.
- A4 Bậc thang giá hạng ở Menu / Trang món (`bacThang`) KHÔNG đổi ở việc này (POS `/menu` `gia_hang` đã theo luật mới). Chỉ sửa chú thích `giaHang.js` "xếp theo thu_tu" → `thu_bac`.

### B. Khối "Chương trình đặc biệt" (soát KH-CT-1)
- B1 `ChuongTrinhToi` vẽ lại khi "bây giờ" của POS về (dùng nguồn giờ sẵn có — `dungGia()` / `coBayGio` / `bayGio` như màn khác đang làm; kế hoạch nêu cách). Ca: `/toi` về TRƯỚC
  `/gio-hoat-dong`, đồng hồ máy lệch ngày → khi giờ POS về, dòng chúc mừng hiện / ẩn đúng theo ngày POS.
- B2 Có từ 2 chương trình `sinh_nhat`: dòng chúc mừng / dòng mời nhập ngày sinh CHỈ ở thẻ sinh nhật ĐẦU TIÊN (các thẻ khác vẫn hiện, nổi bật như nhau hoặc thường — kế hoạch chọn).

### C. Giao diện
- C1 Dùng lại khuôn `tier-card` / `prog-lbl` / `pct` sẵn có; CSS mới (nếu cần) ở file MỚI `src/giaoDien/hang.css`, `import` trong `UuDai.jsx` (KHÔNG sửa `main.jsx`, `giaoDien.css`,
  `demo*.css`). K9 xanh. Chữ dài không tràn ở 360 px.
- C2 Ảnh 360 / 390 / 430 → `viec/KH-HANG-2/so_anh/`: thẻ hạng có hạn / không thời hạn / hạng tặng; bảng hạng vãng lai có gói tháng; `doi_chieu_demo.md` (demo `rewards`).

### D. Kiểm
- D1 Bài MỚI `cong_cu/thu_KHHANG2.js`: hàm thuần (đọc hạng: `chi_cap`, `goi`, `het_han: null`, thiếu trường, sai kiểu) + đọc nguồn (không còn đọc `gia_the`) chạy cả khi
  `KHONG_TRINH_DUYET=1`; Chromium với POS giả theo v10: ba kiểu thẻ khách, bảng vãng lai có / không gói, hạng tặng không giá; B1 (giờ POS về sau `/toi`), B2 (hai chương trình sinh nhật).
  `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- D2 Bài thử cũ khoá hành vi cũ ("Thẻ hết hạn" bắt buộc, `gia_the`, B2 KH-CT-1…) — máy grep lại (ít nhất `thu_KHUI3d.js`, `thu_KHCT1.js`) → sửa theo hành vi mới; mỗi bài sửa có ít nhất
  một ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1` (ca hàm thuần / đọc nguồn Phần 1); KHÔNG dùng `## Bài thử cũ sửa`.
- D3 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.
- D4 Chủ quán thử tay: (1) ở POS cấp cho một khách một hạng "chỉ cấp" không thời hạn → App Ưu đãi của khách đó thấy "Không thời hạn" + "Hạng dành tặng khách thân thiết";
  (2) chưa đăng nhập mở Ưu đãi → thấy các hạng kèm gói tháng đang bán ở quầy.

## Phạm vi
- viec/KH-HANG-2/**
- src/pages/UuDai.jsx
- src/giaHang.js
- src/giaoDien/hang.css
- cong_cu/thu_KHHANG2.js
- cong_cu/thu_KHUI3d.js
- cong_cu/thu_KHCT1.js

## Ngân sách
~70 dòng app + ~220 dòng thử.
**Phương án đơn giản nhất đã xét:** sửa `TheHang` đọc thêm `chi_cap` / `goi` / `het_han: null` (dữ liệu `/hang` đã có ở kho `khoHang`); B1 dùng nguồn giờ POS sẵn có; B2 một điều kiện.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- Chạy song song: KHÔNG sửa `thiet_ke/**`, `src/kiemKhop/**`, `src/datDon.js`, `src/pages/TheoDoiDon.jsx`, `src/pages/Don.jsx`, `src/pages/ThanhToan.jsx`, `src/components/BaoDonXong.jsx`,
  `src/baoDonXong.js`, `src/components/HoaDonKhach.jsx`, `src/hoaDon.js`, `src/qrThuongHieu.js`, `src/components/TheQR.jsx`, mọi `cong_cu/thu_*.js` trong Phạm vi KH-SOHD-1
  (`thu_KHSOHD1`, `thu_KHMUA1*`, `thu_KHUI3b`, `thu_KHKHOP1`, `thu_KHHD1`, `thu_KHBAO1`, `thu_KHTT1`). Cần sửa ngoài Phạm vi → `## Câu hỏi`, dừng.
- KHÔNG sửa `src/api.js`, `src/heThong.js` (nếu B1 bắt buộc sửa `heThong.js` → `## Câu hỏi`), `src/main.jsx`, `src/giaoDien/giaoDien.css`, `src/giaoDien/demo*.css`,
  `src/pages/TrangMon.jsx`, `src/components/MonO.jsx`.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- KHÔNG làm nút mua / gia hạn thẻ trên App (P3b sau khai trương), KHÔNG tự tính giá hạng.
- Chỉ push `git push -u origin viec/KH-HANG-2`. Không đụng `main`, không merge, không tạo PR.
