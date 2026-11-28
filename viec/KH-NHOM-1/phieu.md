# KH-NHOM-1 — Menu: tên + thứ tự nhóm món lấy từ POS (hợp đồng v19 NHOM-MON-1) + chép hợp đồng v20

<!-- Chat App KH soạn 27.11.2026. **Sonnet**, KHÔNG chờ duyệt kế hoạch (việc nhỏ, chỉ đổi cách hiện nhóm — không đụng tiền). Hạn 29.11.
     Mở trên main 0063091 (+ commit sổ v69 của chat: chép `thiet_ke/HOP_DONG_API_KH.md` = POS v20, `viec/KH-NHOM-1/hop_dong_v20.md` cùng bản byte,
     thư `thiet_ke/trao_doi/TRA_LOI_POS_27112026.md`). Chạy SONG SONG với KH-DOI-1 (không đụng tệp chung — KHÔNG sửa `canTuPos.js`, `api.js`, `datDon.js`, `App.jsx`).
     KH-TOPPING-1 (topping + ghi chú nhanh, v20) mở SAU khi việc này và KH-DOI-1 gộp. Đọc CLAUDE.md §4, §5, §6, §8, §11; thư POS 27.11 Phần 1;
     hợp đồng v20 dòng `GET /menu` + nhật ký v19. -->

## Vì sao
POS v19 (27.11) đổi nghĩa trường `nhom` thành MÃ nhóm ổn định (`tea`, `juice`…) và thêm `nhom_ten` (tên hiển thị, chủ quán sửa ở POS › Quản lý › Giá bán & nhóm món)
+ `nhom_thu_tu` (nhỏ đứng trước; món chưa có nhóm = 9999). App hôm nay lấy `nhom` làm TÊN → POS thật (chat đo 27.11 19:20, `GET /api/kh/menu`) đang trả
`tea|Trà|2`, `juice|Nước ép|1` → App hiện ô nhóm **"tea" / "juice"**, biểu tượng mặc định (không khớp `NHOM_DEMO`), thứ tự Trà trước Nước ép (POS muốn Nước ép trước).

## Nghiệm thu

### A. Đọc nhóm (MỘT chỗ, `src/menuLoc.js`)
- A1 Hàm thuần dùng chung: `maNhom(m)` = `m.nhom` (chuỗi khác rỗng) hoặc `''`; `tenNhom(m)` = `m.nhom_ten` (chuỗi đã cắt, khác rỗng) → nếu không có thì `m.nhom` (POS cũ:
  `nhom` vẫn là tên) → nếu không có nữa thì `nd('menu.nhomKhac')`; `thuTuNhom(m)` = `m.nhom_thu_tu` (số hữu hạn) hoặc 9999.
- A2 `nhomTheoTen(ds)` → gom theo `maNhom` (món không mã gom chung một nhóm "Khác"), trả `[ten, mon[]]` như hôm nay (giữ chữ ký để chỗ gọi ít đổi — hoặc đổi tên hàm
  + mọi chỗ gọi, tuỳ máy, ghi lý do), xếp nhóm theo `thuTuNhom` TĂNG, bằng nhau thì giữ thứ tự xuất hiện; món trong nhóm giữ thứ tự POS. Hai nhóm khác mã trùng `nhom_ten`
  vẫn là HAI nhóm.
- A3 `bieuTuongNhom` khớp theo `tenNhom` ("Trà" → gaiwan, "Nước ép" → drop đã khớp sẵn `NHOM_DEMO`); KHÔNG thêm mã POS (`tea`, `juice`…) vào `NHOM_DEMO` — mã do POS đặt,
  nhóm mới có mã mới; nhóm lạ → mặc định như cũ.
- A4 App KHÔNG ghi cứng tên nhóm ("Nước ép", "Trà"…) ở bất cứ đâu ngoài `NHOM_DEMO` (chỉ để chọn biểu tượng). Không tự đặt thứ tự nhóm.

### B. Hiện
- B1 **Menu** (`Menu.jsx`): ô chọn nhóm + tiêu đề từng phần dùng `tenNhom`, xếp theo A2; lọc theo nhóm so `maNhom` (không so tên). Ô Giờ vàng / Thẻ hội viên / "Tất cả"
  giữ vị trí như hôm nay (sau các nhóm POS).
- B2 Đường dẫn `/menu/<nhom>` dùng `slug(maNhom)` (mã ổn định — chủ quán đổi tên nhóm ở POS thì link cũ vẫn đúng). Đường dẫn lạ / cũ (vd `/menu/tra` từ bản trước)
  → về "Tất cả" như hôm nay (không lỗi). Kiểm `duongDan.js` / `KhongTimThay` không cần đổi; nếu cần thì ghi Câu hỏi (ngoài Phạm vi).
  Mã nhóm POS có slug trùng ô riêng của App (`gio-vang`, `the-thanh-vien`) hoặc slug rỗng → ô riêng của App thắng, nhóm đó vẫn hiện ở "Tất cả" (ca thử).
- B3 **Trang món** (`TrangMon.jsx`): dòng nhóm `detail-cat` hiện `tenNhom` + biểu tượng theo A3. **Ô món** (`MonO.jsx`), **Giỏ** (`GioHang.jsx` ô ảnh): biểu tượng / màu nền theo A3.
- B4 Món `nhom: "topping"` (topping bán riêng — v20) hiện như một nhóm thường theo `nhom_ten` POS (KH-TOPPING-1 làm phần chọn topping trong trang món; ĐỪNG làm ở đây).
- B5 POS cũ (không có `nhom_ten` / `nhom_thu_tu`) → hiện **y như hôm nay** (tên = `nhom`, thứ tự xuất hiện).
- B6 `MON_KHONG_BAN` (món của nhóm vừa bị tắt "hiện trên App" còn trong giỏ cũ): App ĐÃ có nhãn (`tt.monKhongBan`, `gio.khongCon`) — chỉ thêm ca thử chứng minh giỏ có món
  không còn trên `/menu` hiện đúng câu và báo giá 400 `MON_KHONG_BAN` đánh dấu đúng dòng. Không đổi chữ nếu đã đúng.
- B7 Danh mục /admin (`src/noiDung/nd/menu.js`): mục `menu.nhom` đổi mô tả nguồn thành "POS › Quản lý › Giá bán & nhóm món" (tên + thứ tự). Không thêm chữ cứng.

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHNHOM1.js` (chạy cả `KHONG_TRINH_DUYET=1`; khuôn `thu_KHHUY1.js`, POS giả):
  - hàm thuần: `tenNhom` / `maNhom` / `thuTuNhom` với đủ (`juice`, "Nước ép", 1) · thiếu `nhom_ten` · `nhom_ten` "  " · `nhom_thu_tu` "1" (chuỗi) / null / NaN · thiếu `nhom`;
    `nhomTheoTen`: dữ liệu POS thật 27.11 (Trà 2 xuất hiện trước, Nước ép 1) → Nước ép trước; 9999 cuối; hai mã trùng tên → hai nhóm; POS cũ → như gốc;
  - Chromium 360 · 390 · 430: Menu thấy ô "Nước ép" rồi "Trà" (không thấy chữ `juice` / `tea` ở đâu trên màn), biểu tượng drop / gaiwan; bấm ô → URL `/menu/juice`, lọc đúng;
    mở `/menu/tra` → "Tất cả", không lỗi; POS giả có nhóm mã `gio-vang` → ô Giờ vàng vẫn đúng; đổi `nhom_ten` ở POS giả ("Nước ép tươi") → tải lại thấy tên mới, link `/menu/juice` vẫn đúng; Trang món + ô Giỏ hiện tên / biểu tượng
    đúng; giỏ có món không còn trên menu → câu "không còn bán" + báo giá `MON_KHONG_BAN` đánh dấu dòng. Đỏ trên gốc (ca thuần + ca màn).
- C2 Bài CŨ dựa vào `nhom` = tên (vd POS giả các bài `thu_KHND3*`, `thu_KHUI3*`, `thu_KHLINK1`…) → nếu đỏ thì sửa thẳng đúng ca (POS giả thêm `nhom_ten`, hoặc giữ ca
  "POS cũ"); ghi rõ trong `trang_thai.md` bài nào, vì sao. KHÔNG dùng `## Bài thử cũ sửa`.
- C3 Đột biến tay (`viec/KH-NHOM-1/dot_bien_tay.js`, khuôn KH-HUY-1) ≥ 5, mỗi cái ĐỎ: hiện `nhom` thay `nhom_ten` · bỏ xếp theo `nhom_thu_tu` · lọc theo tên thay mã ·
  slug theo tên · gộp hai mã trùng tên · POS cũ thiếu `nhom_ten` hiện "Khác" · biểu tượng khớp theo mã thay tên.
- C4 Ảnh 390 trước / sau → `viec/KH-NHOM-1/so_anh/` (Menu "Tất cả", Menu một nhóm, Trang món); soát cuối so ảnh `LUU_ANH_DIR` gốc ↔ nhánh: chỉ khác chữ / biểu tượng /
  thứ tự nhóm, màn khác KHÔNG đổi.
- C5 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K9 / K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- C6 Chủ quán thử tay sau gộp: mở App → Menu thấy "Nước ép", "Trà" đúng thứ tự POS; ở POS đổi tên một nhóm → mở lại App thấy tên mới.

## Phạm vi
- viec/KH-NHOM-1/**
- src/menuLoc.js
- src/pages/Menu.jsx
- src/pages/TrangMon.jsx
- src/pages/GioHang.jsx
- src/components/MonO.jsx
- src/noiDung/nd/menu.js
- cong_cu/thu_KHNHOM1.js
- cong_cu/thu_*.js
- cong_cu/no_chu_cung.txt

## Ngân sách
~40 dòng app (3 hàm + gom / xếp ~20, 5 chỗ gọi ~15, danh mục ~2) + ~220 dòng thử. **Phương án đơn giản nhất đã xét:** MỘT bộ hàm đọc nhóm ở `menuLoc.js`, mọi màn gọi nó;
không thêm trạng thái, không thêm lượt hỏi POS, không thêm CSS. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG làm topping / ghi chú nhanh (`topping[]`, `ghi_chu_nhanh[]`, `topping_toi_da_phan`) — việc KH-TOPPING-1. KHÔNG đổi luật tiền, báo giá, đặt đơn, giỏ (ngoài ô ảnh B3).
- KHÔNG sửa `src/api.js`, `src/datDon.js`, `src/App.jsx`, `src/duLieuKhach.js`, `src/kiemKhop/canTuPos.js` (KH-DOI-1 đang sửa), `src/giaoDien/**`, `src/components/TheQR.jsx`,
  `src/quangCao.js`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `cong_cu/ha_no_chu.js`, `kiem_tra_truoc_khi_giao.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`,
  `CLAUDE.md`, `public/sw.js`. Không thêm tệp .css, không thêm màu ngoài bảng demo (K9). Việc KH-SUA-2 KHÔNG làm ở đây.
- Chỉ push `git push -u origin viec/KH-NHOM-1`. Không đụng `main`, không merge, không tạo PR.
