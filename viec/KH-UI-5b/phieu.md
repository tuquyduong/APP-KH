# KH-UI-5b — Kế hoạch và nhắc việc: lịch âm dương, việc của tôi, Theo mùa / Ngày lễ / Sắp tới + banner "hôm nay" có ánh sáng ở màn Kế hoạch (theo demo, lưu trên máy)

<!-- Chat App KH soạn 06.11.2026 (chốt từ bản nháp 30.10). Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 08.11. Mở SAU KHI KH-BAO-1 đã gộp (cùng sửa src/luuMay.js).
     CHẠY SONG SONG với KH-SOHD-1 và KH-HANG-2 — xem "Cấm".
     Chủ quán 06.11: "app KH còn thiếu phần tiện ích lên kế hoạch, rồi chương trình có ánh sáng chạy qua (tab các thông tin khuyến mãi hiển thị ở các màn)"; chọn "chỉ cần đủ 8 tiện ích
     của demo" và dải khuyến mãi "như demo đã làm". Demo (patch36): banner "hôm nay" `.today.fx-a` (ánh sáng lướt chéo) ở Trang chủ (`todayHome`, App ĐÃ có —
     `src/components/BannerHomNay.jsx`) VÀ bản nhỏ `.today.fx-a.mini` ở đầu màn Lịch (`todayLich`) + màn tiện ích (`todayTool`), có nút ✕ "Ẩn ở Lịch và tiện ích đến hết hôm nay"
     (`todayHide`, `renderTodayAll`). Việc này làm bản nhỏ đó cùng hai màn.
     Nguồn chuẩn: thiet_ke/app_kh_demo.html — màn `lich` (lịch tháng, thẻ ngày `calHero`, lưới tiện ích `toolGrid`, tiết khí `calTip`, việc của tôi `calAgenda`, ngày lễ `calHols`),
     màn `tool` (các tiện ích `mua`, `hol`, `up`), ô Kế hoạch ở Trang chủ (`utilCal`, chữ "KẾ HOẠCH VÀ NHẮC VIỆC"); hàm `renderCal`, `calMove`, `calPick`, `calToday`, `calNotiBar`,
     `saveAdd` + `AGENDA` (việc của tôi), `holList`, `upList`, `renderToolGrid`, `renderTool` (nhánh 'mua' / 'hol' / 'up'), dữ liệu `SS`, `SS_F`, `SEASON`, `HOL*`, `TERM_TIPS`;
     `todayCard(mini)`, `todayHide`, `renderTodayAll`.
     Đặc tả: thiet_ke/DAC_TA_KY_THUAT_APP_KH.md §11.5 và §16. Đọc CLAUDE.md §5 (chuẩn theo demo, K9, tự so ảnh) và §6 (giờ VN).
     CHIA ĐỢT: demo có 8 tiện ích; việc này làm 3 (Theo mùa, Ngày lễ, Sắp tới) + lịch + việc của tôi + banner nhỏ. Năm tiện ích còn lại (Văn khấn, Sinh nhật & giỗ, Xe cộ,
     Uống thuốc, Chu kỳ) = KH-UI-5c, mở ngay sau khi việc này gộp: ô của chúng KHÔNG hiện trong lưới (không ô mờ, không "sắp có"). Làm khung để 5c chỉ cần thêm ô + màn. -->

## Mục tiêu
Khách ĐÃ ĐĂNG NHẬP mở "Kế hoạch và nhắc việc" từ Trang chủ: xem lịch tháng âm dương (can chi, 24 tiết khí, ngày lễ), thẻ ngày hôm nay với lời dưỡng sinh theo tiết khí,
thêm / đánh dấu xong / xoá việc của mình, xem dưỡng sinh theo bốn mùa (kèm món của quán), danh sách ngày lễ có bật nhắc, và danh sách "Sắp tới" 30 ngày; đầu màn có banner
chương trình hôm nay (bản nhỏ, ánh sáng lướt) như demo. Mọi dữ liệu của khách nằm trên điện thoại. Không có cửa máy chủ mới.

## Nghiệm thu

### A. Dữ liệu và cách tính — CHÉP NGUYÊN demo
- A1 Dữ liệu tĩnh của demo chép nguyên văn sang `src/noiDung/` (không sửa chữ / số): bốn mùa `SS` + `SS_F` + `SEASON`, danh sách ngày lễ dương + âm, chữ dưỡng sinh theo tiết
  (`TERM_TIPS` đã có ở `src/lich.js` từ 5a — dùng lại, không chép lại). Bài thử đọc dữ liệu từ demo (Chromium) và so từng byte sau khi chuẩn hoá — khác là đỏ.
- A2 Hàm tính chép nguyên logic demo thành hàm thuần (`src/kehoach.js`): lưới tháng (ô âm / dương, mùng 1, rằm, tiết khí trong tháng, ngày lễ), `holList`, tiết khí hôm nay,
  mùa hiện tại, `upList` (nguồn có ở việc này: việc của tôi + ngày lễ), nhắc trong ngày. Dùng lại `LUNAR` ở `src/lich.js`. "Hôm nay" theo giờ POS (`bayGio()` — CLAUDE.md §6,
  không `new Date(chuỗi POS)`).
- A3 **Bài thử đối chiếu với demo**: chạy chính hàm của demo trong Chromium (Playwright có sẵn, ở nháp) và lưu bảng kết quả vào `cong_cu/thu_KHUI5b_mau.json`;
  `cong_cu/thu_KHUI5b.js` so hàm của app với bảng đó: ≥ 12 tháng khác nhau (gồm tháng có nhuận, tháng giáp Tết, tháng đủ / thiếu 29 / 30 ngày), mỗi tháng toàn bộ ô
  (âm, dương, thứ, mùng 1 / rằm, tiết khí, lễ); `holList` ở ≥ 6 "ngày hôm nay" (đầu năm, trước Tết, sau Tết, Trung thu, 20.11, cuối năm); `upList` ở ≥ 4 ngày; mùa hiện tại
  ở 12 ngày (ranh bốn mùa). Lệch một ô là đỏ. Phần so bảng (hàm thuần + JSON) chạy cả khi `KHONG_TRINH_DUYET=1`.

### B. Màn hình — y demo
- B1 `/kehoach` (màn `lich`): thanh trên (nút quay lại, tên màn, nút "Hôm nay"), banner nhỏ (B7), thanh nhắc `calNoti`, thẻ ngày `calHero` (vòng biểu tượng tiết khí, ngày âm
  dương, can chi), lưới tiện ích `toolGrid` (B3), lịch tháng với ‹ › và chạm chọn ngày, chú giải ("Việc của tôi · Từ TQD · Ngày lễ · Tiết khí"), thẻ dưỡng sinh theo tiết `calTip`,
  danh sách việc trong ngày chọn, "Ngày lễ trong tháng", dòng miễn trừ cuối — y demo. Khối **"Từ TQD"** (`calTqd`) và chấm "Từ TQD" trong chú giải: ẨN (POS chưa có dữ liệu,
  lý do (a)); ghi `## Phát hiện`.
- B2 **Việc của tôi**: thêm (tiêu đề, giờ, bật / tắt "Nhắc") — đúng màn thêm của demo (`saveAdd`), đánh dấu xong, xoá; chấm trên lịch ở ngày có việc; sắp theo giờ.
- B3 Lưới tiện ích: CHỈ ba ô — Theo mùa, Ngày lễ, Sắp tới — kèm dòng nhỏ `toolBadge` như demo (vd "Mùa Thu", "20/11", "3 việc · 30 ngày"). Năm ô của 5c chưa hiện.
- B4 Màn tiện ích `/kehoach/theomua`, `/kehoach/ngayle`, `/kehoach/saptoi` (màn `tool`, có banner nhỏ B7): Theo mùa (bốn thẻ mùa, ăn / uống / sinh hoạt / tinh thần / hạn chế,
  "Món Tứ Quý Đường hợp mùa" — ghép tên món với menu POS như 5a, món không có / hết thì ẩn, KHÔNG giả lập món; liên kết "Dưỡng sinh theo tiết" về `/kehoach`), Ngày lễ (sắp
  theo ngày gần nhất, bật / tắt nhắc từng ngày, gợi ý quà 8/3, 20/10, 20/11, Tết, Trung thu — chỉ là chữ, không nút mua: chưa có thẻ quà, lý do (c)), Sắp tới (gộp 30 ngày).
  Nút quay lại ở `/kehoach/<tiện ích>` về `/kehoach`.
- B5 Lối vào: ô "KẾ HOẠCH VÀ NHẮC VIỆC" ở Trang chủ (khối `utilCal`: ngày dương lớn + thứ + ngày âm + "Trợ lý của bạn · Miễn phí", y demo, đúng vị trí demo) bọc bằng
  `KhoaTienIch`: chưa đăng nhập → ô MỜ + "Đăng nhập để mở khoá chức năng", chạm → đăng nhập → vào `/kehoach`. Khai báo `/kehoach` + ba đường tiện ích ở `src/duongDan.js`
  (bỏ `giuCho` của `/kehoach`), cần đăng nhập; mở thẳng `/kehoach/<lạ>` → `/kehoach`. Tab dưới giữ "Trang chủ" sáng như demo.
- B6 Thẻ video hướng dẫn: KHÔNG hiện khi chưa có video (lý do (a)). Giao diện theo demo, K9 xanh; biểu tượng tách tệp ở `public/anh/` (không base64 trong `src/`).
- B7 **Banner hôm nay bản nhỏ** (`.today.fx-a.mini` của demo, ánh sáng lướt chéo — CSS `fx-a` đã có ở `demo_1.css`): đầu `/kehoach` và đầu mọi màn tiện ích; cùng nội dung + đích
  bấm với banner Trang chủ (dùng lại `BannerHomNay.jsx`, thêm kiểu `mini` — KHÔNG chép component mới); nút ✕ "Ẩn ở Lịch và tiện ích đến hết hôm nay" như demo `todayHide`
  (ẩn bản nhỏ tới hết ngày theo giờ POS; banner Trang chủ không đổi); `prefers-reduced-motion` → không chạy ánh sáng (demo đã có).

### C. Nhắc việc — chỉ trong app (chưa đẩy ra điện thoại)
- C1 Bật "Nhắc" cho một việc / một ngày lễ chỉ GHI cờ trên máy. Khi khách MỞ app: thanh nhắc `calNoti` ở đầu `/kehoach` nêu việc hôm nay đã bật nhắc (giờ VN) — như demo.
  KHÔNG gọi cửa nào ngoài hợp đồng (đẩy thông báo là KH-TB-1, sau khai trương).
- C2 Chữ cạnh công tắc Nhắc phải ĐÚNG sự thật: nhắc hiện khi mở app, chưa tự báo khi đóng app — dùng **"Nhắc khi mở app"** (chủ quán duyệt 06.11); không hứa "sẽ báo về điện thoại".

### D. Lưu trên máy
- D1 Khoá `kh_kehoach` (localStorage), một bản: việc của tôi, cờ nhắc ngày lễ, ngày ẩn banner nhỏ. Không lưu gì lên máy chủ; không vào log. Dữ liệu hỏng / sai dạng → bỏ,
  không vỡ màn. Kho bị chặn: báo "Trình duyệt không cho lưu…" — KHÔNG báo "Đã lưu".
- D2 Thêm khoá `kh_kehoach` vào danh sách khoá dữ liệu khách ở `src/luuMay.js` (KHÔNG tự viết quy tắc xoá riêng). Hết phiên (401) không xoá; đăng xuất / đổi khách thì xoá.
- D3 Nút "Xoá toàn bộ dữ liệu Kế hoạch trên máy này" trong `/kehoach` (chỗ như demo; demo không có thì dòng nhỏ cuối màn, ghi `## Phát hiện`).

### E. Kiểm
- E1 `cong_cu/thu_KHUI5b.js` (A1, A3, lưu / xoá / hỏng / kho chặn, ghép tên món, đường dẫn, ẩn "Từ TQD", không có ô 5c, banner nhỏ + ✕ ẩn tới hết ngày): dòng cuối
  "n đạt · m hỏng". Logic nối vào App CHẠY THẬT trong bài thử (không chỉ đọc nguồn) — bài học 5a. `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- E2 Bài thử cũ đang đòi `/kehoach` "giữ chỗ" / ô Kế hoạch trống / danh sách khoá `luuMay` (máy grep lại, vd `thu_KHLINK1.js`, `thu_KHUI5a.js`, `thu_KHLUU1.js`) → sửa đúng ca đó
  theo hành vi mới; mỗi bài sửa có ít nhất một ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`; KHÔNG dùng `## Bài thử cũ sửa`; không bớt ca khác.
- E3 Tự so ảnh demo ↔ app (CLAUDE.md §5) cho `lich` (tháng thường, có việc, chọn ngày lễ), `tool` (Theo mùa, Ngày lễ, Sắp tới), banner nhỏ, ô Trang chủ (đăng nhập / chưa) —
  390 / 360 / 430. Lưu `viec/KH-UI-5b/so_anh/` + `doi_chieu_demo.md`.
- E4 `npm test`, `--day-du` (K8, K9), cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.
- E5 Chủ quán thử tay: (1) chưa đăng nhập Trang chủ thấy ô Kế hoạch mờ + khoá; đăng nhập → vào → thêm một việc bật nhắc → thấy ở lịch và "Sắp tới"; (2) Theo mùa → thấy món
  của quán; Ngày lễ → bật nhắc; banner nhỏ có ánh sáng, bấm ✕ → ẩn tới hết hôm nay; (3) thoát, vào lại → việc còn; "Xoá toàn bộ" → hết.

## Phạm vi
- viec/KH-UI-5b/**
- src/kehoach.js
- src/noiDung/**
- src/pages/KeHoach.jsx
- src/pages/TienIch.jsx
- src/components/**
- src/giaoDien/ke_hoach.css
- src/pages/TrangChu.jsx
- src/duongDan.js
- src/App.jsx
- src/luuMay.js
- src/lich.js
- public/anh/**
- cong_cu/thu_KHUI5b.js
- cong_cu/thu_KHUI5b_mau.json
- cong_cu/thu_KHLINK1.js
- cong_cu/thu_KHUI5a.js
- cong_cu/thu_KHLUU1.js

## Ngân sách
~1000 dòng app (màn, hàm tính, lưu) + dữ liệu chép nguyên + ~400 dòng thử. **Phương án đơn giản nhất đã xét:** chép nguyên hàm tính và dữ liệu của demo thành hàm thuần, màn dùng lại
thành phần sẵn có (`Man`, `KhoaTienIch`, `BannerHomNay`…), không thư viện lịch. Vượt 1,5 lần thì giải thích; phải cắt thì cắt theo thứ tự: B4 "Sắp tới" → ghi `## Phát hiện`,
KHÔNG tự bỏ mục khác.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- Chạy song song: KHÔNG sửa các file của KH-SOHD-1 (`thiet_ke/**`, `src/kiemKhop/**`, `src/datDon.js`, `src/qrThuongHieu.js`, `src/components/TheQR.jsx`, `src/giaoDien/the_qr.css`,
  `src/pages/TheoDoiDon.jsx`, `src/pages/Don.jsx`, `src/pages/ThanhToan.jsx`, `src/components/BaoDonXong.jsx`, `src/baoDonXong.js`, `src/components/HoaDonKhach.jsx`, `src/hoaDon.js`)
  và của KH-HANG-2 (`src/pages/UuDai.jsx`, `src/giaHang.js`, `src/giaoDien/hang.css`); KHÔNG sửa bài thử của hai việc đó (`thu_KHSOHD1`, `thu_KHHANG2`, `thu_KHMUA1*`, `thu_KHUI3b`,
  `thu_KHUI3d`, `thu_KHKHOP1`, `thu_KHHD1`, `thu_KHBAO1`, `thu_KHTT1`, `thu_KHCT1`). `src/components/**` trong Phạm vi chỉ để sửa `BannerHomNay.jsx` / `KhoaTienIch.jsx` và thêm
  component MỚI của màn Kế hoạch. Cần sửa ngoài Phạm vi → `## Câu hỏi`, dừng.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`, `src/main.jsx`,
  `src/giaoDien/giaoDien.css`, `src/giaoDien/demo*.css`, `src/api.js`.
- KHÔNG sửa dữ liệu, ngày, lời khuyên của demo; muốn đổi → `## Câu hỏi` cho chủ quán.
- KHÔNG làm Văn khấn, Sinh nhật & giỗ, Xe cộ, Uống thuốc, Chu kỳ (KH-UI-5c). KHÔNG làm đẩy thông báo (KH-TB-1). KHÔNG gọi cửa nào ngoài `/api/kh` đã có trong hợp đồng.
- Không gửi dữ liệu của khách ra khỏi máy; không bí mật trong code / log. Chỉ push `git push -u origin viec/KH-UI-5b`. Không đụng `main`, không merge, không tạo PR.
