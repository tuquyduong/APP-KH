# KH-UI-5e — Tiện ích: lưới 6 ô + dải "Sắp tới", Ngày cần nhớ (Người thân + Ngày lễ), Văn khấn & lễ cúng

<!-- Chat App KH soạn 10.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 12.11. Mở SAU KHI KH-UI-5d đã gộp + ghi xong (main có dải quảng cáo, Kế hoạch không Hoàn tác).
     Chạy SONG SONG được với KH-PWA-2 (chỉ sửa public/sw.js + thu_KHPWA1.js).
     Chủ quán 06.11: "chỉ cần đủ 8 cái demo" → lưới cuối của demo là 6 ô (demo `TOOLS.splice` ở mục "2. tiện ích 6 ô"): Theo mùa · Văn khấn · Ngày cần nhớ (gộp Sinh nhật & giỗ +
     Ngày lễ, hai tab) · Xe cộ · Uống thuốc · Chu kỳ, dưới lưới là dải "Sắp tới" 3 dòng. Chat chia 2 việc nối nhau cho dễ soát: việc NÀY = lưới + Sắp tới + Ngày cần nhớ + Văn khấn;
     KH-UI-5f (sau) = Xe cộ + Uống thuốc + Chu kỳ. Theo mùa, Ngày lễ, Sắp tới ĐÃ CÓ từ KH-UI-5b — dùng lại.
     Nguồn: `thiet_ke/app_kh_demo.html` — VK / VK_OPEN… / vkNext / renderVkOne, pplNext / pplForm, holList, toolBadge, renderToolGrid (+ bản `_grid35`), upList (bản cuối).
     Đọc CLAUDE.md §5, §6 (giờ VN theo `bayGio()`), §8 (dữ liệu chỉ trên máy). -->

## Mục tiêu
Khách có đủ tiện ích "ngày cần nhớ" và "văn khấn" như demo: nhớ sinh nhật, ngày giỗ (âm hay dương), ngày lễ, ngày cúng — có bài khấn tự điền tên, lễ vật đánh dấu đã sắm.

## Nghiệm thu

### A. Lưới 6 ô + dải "Sắp tới" (màn Kế hoạch, mục "Tiện ích")
- A1 Lưới 2 cột × 3 hàng (lớp `.tl-g.six` của demo) đúng thứ tự: Theo mùa · Văn khấn · Ngày cần nhớ · Xe cộ · Uống thuốc · Chu kỳ; biểu tượng lấy từ bộ biểu tượng sẵn của demo
  (fan, book, gift, scooter, mortar, moon) — KHÔNG vẽ mới. Chữ nhỏ dưới tên theo `toolBadge` của demo: "Mùa Đông" · "Rằm · 5 ng" · "<tên gần nhất> · N ng" (người thân / lễ, gần nhất trước).
- A2 Ô Chu kỳ ẨN khi xưng hô của khách là anh / chú / bác / ông (đọc `xung_ho` sẵn có); lúc đó lưới 5 ô vẫn đều, không lỗ.
- A3 Ba ô Xe cộ, Uống thuốc, Chu kỳ CHƯA làm ở việc này: hiện bình thường, chữ nhỏ "Sắp có"; bấm → thông báo ngắn "Tiện ích này sắp có" (KH-UI-5f thay). Không đường dẫn mới cho 3 ô này.
- A4 Dưới lưới: dải "Sắp tới" (demo `up-strip`): 3 dòng gần nhất trong 30 ngày (việc của tôi, sinh nhật, giỗ, ngày cúng, ngày lễ) — mỗi dòng "dd/mm · tên · N ngày / Hôm nay", bấm → mở đúng
  chỗ; "Xem tất cả N ›" → màn Sắp tới đã có. Trống → "30 ngày tới chưa có việc gì". Ô "Sắp tới" cũ trong lưới bỏ (đã thành dải).

### B. Ngày cần nhớ (`/kehoach/ngaycannho`)
- B1 Hai tab: **Người thân** · **Ngày lễ**. Đường dẫn cũ `/kehoach/ngayle` (Ngày lễ của KH-UI-5b) vẫn mở được → vào Ngày cần nhớ, tab Ngày lễ.
- B2 Tab Người thân: danh sách sinh nhật + ngày giỗ, gần nhất trước — ô ngày "d/m" + "N ngày / Hôm nay", tên "Sinh nhật …" / "Giỗ …", dòng phụ "Âm lịch d/m · <thứ, ngày dương>"
  + "tròn N tuổi" (sinh nhật có năm sinh); nút nhắc (như Ngày lễ); "Văn khấn giỗ ›" (giỗ) → bài khấn giỗ điền sẵn tên; "Xoá" → hỏi lại một lần (như Kế hoạch KH-UI-5d).
  KHÔNG có "Tặng thẻ quà ›" (thẻ quà chưa có).
- B3 Nút "＋ Thêm" → bảng nổi: loại (Sinh nhật / Ngày giỗ), tên (≤ 40 ký tự), ngày + tháng (bánh xoay sẵn có), lịch Âm / Dương (giỗ mặc định Âm, sinh nhật mặc định Dương), năm sinh
  (tuỳ chọn, chỉ sinh nhật), nhắc (Không nhắc / Đúng ngày / 1 ngày trước / 3 ngày trước). Sửa được (bấm tên).
- B4 Tính ngày: dương lịch → lần tới của d/m (29/02 năm không nhuận → 28/02, cùng luật sinh nhật CT-1); âm lịch → lần tới của d/m âm (tháng nhuận: theo tháng thường; ngày 30 âm
  mà tháng đó thiếu → ngày 29). Nhắc hiện như việc của tôi (dải nhắc khi App đang mở + chuông trên ô lịch ngày đó); chữ "Nhắc khi bạn đang mở App".
- B5 Tab Ngày lễ: giữ nguyên màn Ngày lễ của KH-UI-5b (bật / tắt nhắc từng ngày).

### C. Văn khấn & lễ cúng (`/kehoach/vankhan`, `/kehoach/vankhan/<id>`)
- C1 Danh sách theo demo: thẻ lớn "Sắp tới" (dịp gần nhất: tên, thứ ngày, âm lịch d/m, còn N ngày, "Xem lễ vật & văn khấn ›") + các dịp còn lại sắp theo ngày; mỗi dịp có nút nhắc
  (trừ Cúng giỗ). Dữ liệu 11 dịp CHÉP NGUYÊN từ demo (`VK`: Mùng 1 & Rằm, Ông Công Ông Táo, Giao thừa, Mùng 1 Tết, Vía Thần Tài, Rằm tháng Giêng, Thanh minh, Đoan ngọ, Vu Lan,
  Trung thu, Cúng giỗ — lễ vật, cách sắp lễ, bài khấn) vào file nội dung MỚI `src/noiDung/vanKhan.js`; ngày tính theo `vkNext` (âm lịch, Thanh minh theo tiết khí, Giao thừa).
- C2 Màn một dịp (demo `renderVkOne`): ô "Tín chủ", "Họ gia tiên", "Địa chỉ" (+ "Người được giỗ" / "Hương linh" khi cần) — điền một lần, mọi bài dùng chung; lễ vật đánh dấu đã sắm
  ("3/6 đã sắm", lưu theo dịp + năm); cách sắp lễ; bài khấn với chỗ tự điền TÔ MÀU (tên, địa chỉ, họ, ngày âm "mùng 5", tháng "Giêng / Chạp", năm can chi, năm cũ / năm mới cho Giao thừa);
  nút A− / A+ cỡ chữ (14–26 px, nhớ trên máy). Mặc định "Tín chủ" = tên khách (đã đăng nhập), sửa được.
- C3 KHÔNG làm: "Đọc to", "Đặt hoa quả, trà dâng lễ" (chưa có nhóm món) — không hiện. Dòng lưu ý cuối như demo ("Bài khấn theo nếp cổ truyền phổ biến…").
- C4 Ngày cúng có nhắc → hiện ở Sắp tới, chuông trên lịch, dải nhắc khi App mở (như B4).

### D. Lưu trữ
- D1 Dữ liệu mới (người thân, thông tin văn khấn, lễ vật đã sắm, nhắc dịp cúng, cỡ chữ) trong kho `kh_kehoach` sẵn có (KHÔNG khoá mới); bản lưu cũ (5b/5c/5d) đọc được, thiếu trường →
  mặc định; bản hỏng → không vỡ App. Chỉ trên máy, xoá khi đăng xuất / đổi khách như Kế hoạch (luật `luuMay.js` hiện có).

### E. Kiểm
- E1 Bài MỚI `cong_cu/thu_KHUI5e.js`: hàm thuần — lần tới sinh nhật / giỗ (dương, âm, 29/02, tháng nhuận, 30 âm thiếu), "tròn N tuổi", `vkNext` 11 dịp quanh Tết (trước / sau Giao thừa),
  điền bài khấn (mùng / Giêng / Chạp / can chi / thiếu thông tin giữ chỗ trống), `toolBadge`, ẩn ô Chu kỳ theo xưng hô, Sắp tới gộp + sắp xếp, đọc bản lưu cũ / hỏng (chạy cả
  `KHONG_TRINH_DUYET=1`). Chromium: lưới 6 ô đúng thứ tự (xưng hô "anh" → 5 ô), bấm Xe cộ → "Tiện ích này sắp có", thêm giỗ âm lịch → có ở tab Người thân + Sắp tới + chuông trên lịch,
  "Văn khấn giỗ ›" điền tên, mở Rằm → điền tín chủ → bài khấn có tên tô màu, tick lễ vật → "1/6 đã sắm" còn sau khi tải lại, A+ đổi cỡ chữ, `/kehoach/ngayle` → tab Ngày lễ, xoá → hỏi lại.
- E2 Bài thử cũ đổi theo hành vi mới (`thu_KHUI5b.js`, `thu_KHUI5c.js`, `thu_KHUI5d.js` — lưới cũ, ô Sắp tới) → sửa đúng ca; mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc kể cả
  `KHONG_TRINH_DUYET=1`; KHÔNG dùng `## Bài thử cũ sửa`; không bớt ca khác.
- E3 Ảnh 360 / 390 / 430 → `viec/KH-UI-5e/so_anh/`: lưới 6 ô + Sắp tới, lưới 5 ô (anh), Ngày cần nhớ 2 tab, bảng thêm người thân, Văn khấn danh sách, một bài khấn đã điền.
  `doi_chieu_demo.md` (khác demo: 3 ô "Sắp có", không Đọc to / Đặt hoa quả / Tặng thẻ quà — quyết định chat 10.11).
- E4 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- E5 Chủ quán thử tay: (1) Kế hoạch → lưới 6 ô; (2) Ngày cần nhớ → ＋ Thêm giỗ "Ông nội" 10/3 âm lịch, nhắc 1 ngày trước → thấy ở Sắp tới; (3) Văn khấn → Rằm → điền tên → đọc bài.

## Phạm vi
- viec/KH-UI-5e/**
- src/pages/TienIch.jsx
- src/pages/KeHoach.jsx
- src/kehoach.js
- src/kehoachLap.js
- src/vanKhan.js
- src/noiDung/vanKhan.js
- src/noiDung/keHoach.js
- src/components/**
- src/duongDan.js
- src/giaoDien/ke_hoach.css
- src/giaoDien/tien_ich.css
- cong_cu/thu_KHUI5e.js
- cong_cu/thu_KHUI5d.js
- cong_cu/thu_KHUI5c.js
- cong_cu/thu_KHUI5b.js
- cong_cu/thu_KHUI5b_mau.json

## Ngân sách
~650 dòng app (trong đó ~200 dòng nội dung văn khấn chép từ demo) + ~400 dòng thử. **Phương án đơn giản nhất đã xét:** dùng lại khung màn tiện ích, bảng nổi, bánh xoay, nút nhắc,
hỏi xoá đã có từ 5b–5d; tính ngày âm bằng `src/lich.js` sẵn có; nội dung văn khấn là dữ liệu tĩnh. Vượt 1,5 lần thì giải thích; phải cắt thì cắt cỡ chữ A−/A+ trước → `## Phát hiện`.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- `src/duongDan.js` CHỈ để thêm tiện ích `ngaycannho`, `vankhan` (+ một dịp `/kehoach/vankhan/<id>`) vào danh sách / mẫu đường dẫn; `ngayle`, `saptoi`, `theomua` giữ; không sửa dòng khác.
- `src/components/**`: KHÔNG sửa `PinSheet.jsx`, `HoaDonKhach.jsx`, `TheQR.jsx`, `BaoDonXong.jsx`, `KhoaTienIch.jsx`, `Thongbao.jsx`, `DaiQuangCao.jsx`.
- KHÔNG sửa `src/App.jsx`, `src/api.js`, `src/luuMay.js`, `src/datDon.js`, `src/main.jsx`, `src/dangKySW.js`, `src/quangCao.js`, `public/**`, `index.html`, `src/giaoDien/giaoDien.css`,
  `src/giaoDien/demo*.css`, `thiet_ke/**`, các trang ngoài Phạm vi.
- KHÔNG sửa bài thử ngoài Phạm vi (KH-PWA-2 đang sửa `thu_KHPWA1.js`), `kiem_tra_truoc_khi_giao.js`, `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG làm Xe cộ, Uống thuốc, Chu kỳ (KH-UI-5f), thẻ quà, Đọc to, đặt hàng từ văn khấn. KHÔNG gửi dữ liệu người thân / văn khấn ra khỏi máy.
- Chỉ push `git push -u origin viec/KH-UI-5e`. Không đụng `main`, không merge, không tạo PR.
