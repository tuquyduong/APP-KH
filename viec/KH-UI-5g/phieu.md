# KH-UI-5g — Ánh sáng lướt như demo: dải quảng cáo các trang + banner "Hôm nay" Trang chủ luôn chạy; lời chào gọi theo tên

<!-- Chat App KH soạn 11.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 13.11. Mở trên main SAU KHI KH-ND-3a đã gộp (có danh mục nội dung + K10).
     Chủ quán 11.11 (ảnh app-kh.pages.dev): "Trang chủ chưa thấy dải sáng chạy. Dải sáng ở các trang tiếp theo hơi mờ gần như không thấy gì. Hãy làm giống như demo để gây được
     sự chú ý." Chủ quán xem bản so sánh chat dựng bằng CSS thật của App rồi chọn: dải các trang = KIỂU A (dải mảnh, chữ loé sáng như demo); Trang chủ = banner "Hôm nay"
     LUÔN có ánh sáng ("vì lúc nào cũng có chương trình"). Ảnh cùng ngày: lời chào "Chào buổi chiều, anh Anh Linh!" (tên tài khoản "Anh Linh") → gọi "anh Linh".
     Gốc lỗi (chat đọc code main sau KH-ND-3a):
       · `DaiQuangCao.jsx` chỉ có lớp `.fx-a::before` (vệt overlay trắng .16–.32 — trên nền tối gần như không thấy); THIẾU phần làm demo bắt mắt: chữ loé sáng `.gl-t`,
         quầng `.gl-a`, nút `.gl-b` + đo toạ độ (demo `glMeasure`). Chỉ `BannerHomNay.jsx` có đo.
       · Trang chủ chỉ vẽ `BannerHomNay` khi `today.t` có chữ (mặc định rỗng) → luôn rơi về `hero-banner` (không hiệu ứng). Demo: `TDY.on = true` → banner "Hôm nay" luôn hiện,
         `hero-banner` ẩn (`renderTodayAll`).
     Nguồn: `thiet_ke/app_kh_demo.html` — todayCard / renderTodayAll / glMeasure, CSS `.today`, `.fx-a`, `.gl*`, `.today.photo .gl-a`. Đọc CLAUDE.md §5, §11 (nội dung qua nd(), K10). -->

## Mục tiêu
Quảng cáo trong App bắt mắt y như demo: vệt sáng chạy chéo làm chữ và nút loé sáng — ở Trang chủ (banner "Hôm nay", luôn có) và ở dải mảnh đầu các trang khác (không che thao tác).
Hai chỗ dùng CHUNG một nguồn chữ, một bộ đo ánh sáng. Lời chào gọi khách như người Việt gọi nhau.

## Nghiệm thu

### A. Một bộ đo ánh sáng dùng chung
- A1 Tách phần đo trong `BannerHomNay.jsx` thành MỘT hook mới `src/components/anhSangLuot.js` — `dungAnhSangLuot(ref, phuThuoc)`: đặt `--W`, `--H` trên thẻ `.fx-a`; `.gl-a` phủ đúng cả thẻ;
  mỗi `.gl` có `--ox`, `--oy`, `--w`, `--h`; đo lại khi đổi cỡ (ResizeObserver, không có thì `resize`) và khi chữ đổi (`phuThuoc`). `BannerHomNay` và `DaiQuangCao` cùng dùng — KHÔNG còn
  đoạn đo thứ hai ở đâu.
- A2 Giữ nguyên: `prefers-reduced-motion: reduce` tắt hiệu ứng (demo_2.css đã có); CSS chép từ demo (`demo_1.css`, `demo_2.css`) KHÔNG sửa tay.

### B. Dải quảng cáo các trang — kiểu A (chủ quán chọn 11.11)
- B1 Cấu trúc `DaiQuangCao`: `.dai-qc.fx-a` chứa `<i class="gl gl-a">` + nhãn (chấm vàng `.dot` + chữ "HÔM NAY", lớp `gl gl-t`) + biểu tượng đầu câu (vd ⏰ 🎁) ĐỨNG RIÊNG,
  KHÔNG nằm trong lớp chữ loé (`background-clip:text` biến emoji thành khối màu) + dòng chữ (`gl gl-t`, một dòng, dài thì cắt "…") + nút "Xem ›" (`gl gl-b`) khi bấm được.
  Tách biểu tượng bằng MỘT hàm thuần (vd `tachBieuTuong(chu)` → `{ bieuTuong, chu }`, nhận emoji ở đầu chuỗi kể cả chuỗi POS gửi) — banner Trang chủ dùng lại.
- B2 Giao diện (`src/giaoDien/dai_quang_cao.css`) — giá trị lấy đúng từ demo `.today` / `.today.photo .gl-a` / `.t-k` / `.t-cta`, giống bản chủ quán đã xem:
  - cao 40px, lề giữ như hiện nay (12px 18px 0), bo 12px; nền `linear-gradient(125deg,#8E1B4C 0%,#B2365F 55%,#C8784A 100%)`; bóng `0 4px 12px rgba(142,27,76,.22)`;
  - nhịp `--dur: 2s` như demo (bỏ 3.5s); nhãn `--c:#F6D57E; --hi:#FFFFFF`; dòng chữ `--c:#F8EAF0; --hi:#FFE7A6`, cỡ 12.5px đậm;
  - quầng `.gl-a`: dải chéo như `.today.photo .gl-a` (rgba(255,238,200,.55) / rgba(255,246,222,.7), `mix-blend-mode: color-dodge`, không bo tròn);
  - nút "Xem ›": nền `#FDE69B`, chữ `#7A2647`, 11.5px đậm, đệm 5px 9px, bo 9px, nổi trên quầng (z-index).
  K9 (màu chỉ lấy từ demo) phải xanh.
- B3 Dải vẫn chỉ hiện ở các trang như hiện nay (`coDai`), vẫn ẩn khi dẫn tới chính trang đang đứng; bấm vẫn đi đúng đích (`moDichQuangCao`).

### C. Banner "Hôm nay" Trang chủ — LUÔN có ánh sáng
- C1 Trang chủ LUÔN vẽ `BannerHomNay` (ảnh nền `today.bg`, vệt sáng, chữ loé, nút vàng) cho mọi khách (đã / chưa đăng nhập). BỎ khối `hero-banner` và các khoá chỉ nó dùng
  (`home.banner`, `home.bk`, `home.bh`, `home.bb`) khỏi màn và danh mục — như demo (`TDY.on` → `hero-banner` ẩn). Ô Giờ vàng + ô Trắc nghiệm bên dưới giữ nguyên.
- C2 Chữ banner lấy CÙNG nguồn với dải, CÙNG thứ tự (`chonQuangCao`, tính MỘT lần ở `App.jsx`, đưa xuống cả dải và Trang chủ):
  1. dòng quảng cáo POS hợp giờ (KH-QC-1, cửa chưa có — mặc định rỗng) → tiêu đề = chữ POS;
  2. Giờ vàng ĐANG chạy → tiêu đề "Giờ vàng: giảm {phanTram}%", dòng phụ "Đến {ketThuc} hôm nay", nút "Xem Menu ›" → Menu;
  3. chương trình đặc biệt (POS `/chuong-trinh`, cái đầu) → tiêu đề = `ten`, dòng phụ = `mo_ta` (có thì hiện), nút "Xem ưu đãi ›" → Ưu đãi;
  4. không có gì → chữ mặc định trong danh mục (`today.t` = "Hôm nay bạn muốn uống gì?", `today.cta` = "Xem Menu ›" → menu; sửa được ở /admin sau này).
  Phần chữ của POS (tên / mô tả chương trình, chữ quảng cáo, % và giờ Giờ vàng) gắn `data-nd-khoa="pos"` (mục khoá có `chiDuong`); khung câu ("Giờ vàng: giảm …", "Đến … hôm nay",
  chữ nút, nhãn "HÔM NAY") là mục danh mục, MỘT khoá cho cùng một chữ ở dải và banner (vd nhãn dùng chung `today.k`). Chữ dải hiện nay (⏰ Giờ vàng: giảm …% đến …, 🎁 <tên>) giữ
  nguyên câu, chuyển vào danh mục (khoá nhóm dải đặt trong `src/noiDung/nd/khungChung.js` — KHÔNG thêm tệp nhóm mới, KHÔNG sửa `src/noiDung/nd/index.js`).
- C3 Đổi theo giờ như dải hiện nay (Giờ vàng hết → banner tự sang chương trình / mặc định ở lần vẽ kế).

### D. Lời chào gọi theo tên
- D1 `chiaLoiChao` / `loiChao` (`src/dinhDang.js`): CÓ xưng hô → gọi xưng hô + CHỮ CUỐI của tên ("anh" + "Anh Linh" → "Chào buổi chiều, anh Linh!"; "chị" + "Nguyễn Thị Linh" →
  "chị Linh"); KHÔNG có xưng hô → giữ tên như hiện nay ("Chào Nguyễn Linh!"); không có gì → "Chào bạn!". Tên đầy đủ ở các chỗ khác (Hồ sơ, hoá đơn…) KHÔNG đổi.

### E. Kiểm
- E1 Bài MỚI `cong_cu/thu_KHUI5g.js` (chạy cả `KHONG_TRINH_DUYET=1`):
  - hàm thuần: `tachBieuTuong` (có / không emoji, emoji ghép, chuỗi rỗng); `chonQuangCao` → đủ tiêu đề / phụ / nút cho 4 trường hợp C2 (giữ thứ tự cũ); `loiChao` các ca D1;
  - đọc nguồn: chỉ MỘT chỗ đặt `--ox` (hook A1); `DaiQuangCao` có `gl-t` + `gl-a` + `gl-b`; `hero-banner` không còn trong `src/pages/TrangChu.jsx`.
  - Chromium (390): Trang chủ có `.today.fx-a` với Giờ vàng giả / chương trình giả / không có gì (đúng chữ, đúng đích khi bấm), KHÔNG có `.hero-banner`; trang Menu có dải: mỗi `.gl` có
    `--ox` khác rỗng, `.gl-a` rộng bằng dải, biểu tượng nằm NGOÀI `.gl-t`; `--p` của `.fx-a` đổi giữa hai lần đọc cách 500 ms; giả lập `prefers-reduced-motion: reduce` → `animation-name` none.
- E2 Bài thử cũ đỏ vì hành vi đổi có chủ đích (banner luôn hiện / bỏ `hero-banner` / bỏ khoá `home.b*` / cấu trúc dải / lời chào gọi tên) → sửa đúng ca theo hành vi mới; mỗi bài sửa có
  ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`; KHÔNG dùng `## Bài thử cũ sửa`; không bớt điều canh khác.
- E3 Ảnh 360 / 390 / 430 → `viec/KH-UI-5g/so_anh/`: Trang chủ (chương trình / Giờ vàng / không có gì; chưa và đã đăng nhập), Menu có dải (2 khung hình cách nhau ~0,7 s cho thấy vệt
  sáng đi qua chữ). `doi_chieu_demo.md`: banner ↔ demo todayCard; dải (không có trong demo — ghi giá trị lấy từ demo nào).
- E4 K10: tệp mới 0 chữ cứng; tệp đã sửa không tăng; tệp giảm thì `node cong_cu/ha_no_chu.js` hạ số nợ. `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT,
  ghi `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- E5 Chủ quán thử tay: (1) Trang chủ thấy vệt sáng chạy qua banner, chữ và nút loé sáng; (2) Menu / Ưu đãi / Giỏ hàng: dải mảnh thấy rõ vệt sáng; (3) lời chào "anh Linh".

## Phạm vi
- viec/KH-UI-5g/**
- src/components/anhSangLuot.js
- src/components/BannerHomNay.jsx
- src/components/DaiQuangCao.jsx
- src/giaoDien/dai_quang_cao.css
- src/quangCao.js
- src/App.jsx
- src/pages/TrangChu.jsx
- src/dinhDang.js
- src/noiDung/nd/trangChu.js
- src/noiDung/nd/khungChung.js
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHUI5g.js
- cong_cu/thu_*.js

## Ngân sách
~180 dòng app (hook ~30, dải ~25 + CSS ~20, banner / Trang chủ ~40, chonQuangCao + tachBieuTuong ~40, lời chào ~5, danh mục ~20) + ~250 dòng thử. **Phương án đơn giản nhất đã xét:**
dùng lại đúng CSS ánh sáng của demo đã có trong App, chỉ thêm phần tử `.gl*` + MỘT hook đo; banner và dải đọc MỘT kết quả `chonQuangCao`. KHÔNG thêm thư viện hoạt hình, KHÔNG
vòng quay nhiều quảng cáo. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- `src/App.jsx` CHỈ: tính `chonQuangCao` một lần cho cả dải và Trang chủ + truyền xuống. `src/dinhDang.js` CHỈ D1. `src/noiDung/nd/*.js` CHỈ khoá của việc này (không đổi khoá khác).
- KHÔNG sửa `src/pages/HoSo.jsx` (KH-ND-3c làm), `src/noiDung/nd/index.js`, `src/noiDung/nd.js`, `src/components/Chu.jsx`, `src/giaoDien/demo_*.css`, `src/giaoDien/giaoDien.css`,
  `src/api.js`, `src/gioVang.js`, `src/chuongTrinh.js`, `src/main.jsx`, `src/dangKySW.js`, `public/**`, `index.html`, `thiet_ke/**`, các trang / component ngoài Phạm vi, `tu_chay/`, `.claude/`,
  `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- Bài thử cũ (`cong_cu/thu_*.js`) CHỈ sửa theo E2.
- KHÔNG gọi mạng mới (đọc `/quang-cao` là KH-QC-1), KHÔNG đổi màu / phông / bố cục ngoài B2–C1, KHÔNG thêm nút tắt quảng cáo (chủ quán 09.11 bỏ ✕).
- Chỉ push `git push -u origin viec/KH-UI-5g`. Không đụng `main`, không merge, không tạo PR.
