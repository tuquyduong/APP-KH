# KH-UI-2 — trạng thái

## VÒNG SỬA 2 (khớp demo 100 %, chủ quán duyệt 29.10) — đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-UI-2`; hook mở phiên kéo `29b830c → 056286f`; HEAD = FETCH_HEAD = `056286f`.
```
056286f PHIEU: KH-UI-2 vong sua 2 - khop demo 100% (chu quan duyet 29.10)
bac62c1 TU-CHAY: gop main vao viec/KH-UI-2 (luat chuan theo demo, K9)
43dabd4 TU-CHAY: chuan theo demo - K9 mau va phong chi tu demo, luat CLAUDE.md 5; so v2
```
(Các mục "Nghiệm thu" / "Báo cáo" cũ ở dưới là của vòng 1; vòng 2 ghi đè ở mục "Nghiệm thu vòng 2" và "Báo cáo vòng 2" ngay dưới đây.)

### Nghiệm thu vòng 2 — từng mục một dòng bằng chứng
- V1 K9 xanh: `npm test` → "K9 màu chỉ lấy từ demo", "K9b phông" ✓. Cách làm: CSS chép từ demo (`src/giaoDien/demo_1.css`, `demo_2.css`, sinh từ demo, giữ thứ tự cascade) → mọi màu là màu của demo; 7 màu cũ (`#8f6f7c`…) không còn; `grep -rn "8f6f7c\|b3261e\|e6f6ef" src` rỗng.
- V2 so ảnh: `so_anh/` — 8 màn (màn mở, Trang chủ, Menu, Trang món, Ưu đãi, Tài khoản, Lịch sử đơn, Thông tin cá nhân) × 3 cỡ × {demo, app, lech}.png = 72 ảnh, 3,2 MB (≤ 6). Hai màn không có trong demo (Đăng nhập, QR) không có cặp. `so_anh/bao_cao.txt` = số lệch từng ảnh.
- V3 `doi_chieu_demo.md` — mỗi màn một bảng, lý do (a)–(d).
- V4 không chữ "nợ": `thu_KHUI2` ca "không chữ nợ" (đỏ trên gốc, xanh nay); kiểm khói: chi tiết đơn không có "nợ"; `src/pages/Don.jsx` chỉ nhãn "Đã hủy" / "Đã thanh toán".
- V5 âm thanh: `public/am_thanh/man_dau.mp3` 80 KB (≤ 150) tách từ demo; `src/components/ManDau.jsx` nút "Bật âm thanh" mặc định TẮT, nhớ trong phiên (sessionStorage); kiểm khói: nút mặc định `muted`; ca thu_KHUI2 "âm thanh mặc định TẮT".
- V6 Menu giữ trạng thái: `src/App.jsx` giữ `Menu` trong cây (chỉ ẩn), `viTriCuonKhiDoiMan` (`src/dieuHuong.js`) có 2 ca thử; kiểm khói bằng Chromium: tìm "ca phe" → vào món → Back còn nguyên ô tìm; cuộn 700 → món (về 0) → Back về 700.
- V7 Trang chủ đúng thứ tự: lời chào → [thẻ xem cách dùng: trống, KH-UI-5] → hàng [thẻ hội viên vàng | ô kế hoạch: trống, KH-UI-5] → khối "Hôm nay" (banner thường / `BannerHomNay` khi có chữ; ô Giờ vàng + Trắc nghiệm: trống, KH-UI-3 / KH-UI-5) → Chăm sóc theo nhu cầu → Món nổi bật (thay Bán chạy / Ưu đãi: chưa có dữ liệu POS) → [Mời bạn bè: trống, sau khai trương]. Xem `doi_chieu_demo.md`.
- V9 biểu tượng, họa tiết: sprite SVG của demo trong `index.html` (44 biểu tượng, 49 KB), thanh tab nền lụa + huy hiệu ngũ hành, ô nhóm món `cat-tiles`, tranh tròn theo nhóm trên nền màu nhóm, nền aurora, viền / họa tiết vàng thẻ hội viên (`public/anh/the-vang-hoa-van.webp` tách từ CSS demo); ca thu_KHUI2 "sprite đủ biểu tượng app dùng" (không biểu tượng nào thiếu).
- V8 `npm test` 16 đạt · 0 hỏng; `--day-du` 18 đạt · 0 hỏng; `thu_KHUI2.js` 74 đạt · 0 hỏng (có K9, ca "không nợ", "âm thanh", "Menu giữ trạng thái"); cổng `chay`: xem cuối file.

### Cấu hình Cloudflare (A3) — không đổi: `npm run build`, thư mục `dist`, biến `VITE_POS_API`, Node ≥ 20. Âm thanh / ảnh mới nằm ở `public/` nên tự lên theo bản dựng.

### Câu hỏi (không chặn việc)
- Chữ khuyến mãi thật cho khối "Hôm nay" (banner lớn đầu Trang chủ): tiêu đề, dòng phụ, nút (ví dụ demo "Ra mắt Combo mua kèm" là chữ mẫu, không dùng). Điền vào `src/noiDung/trangChu.js › HOM_NAY`; để trống thì hiện banner thường "Hôm nay bạn muốn uống gì?".
- Mã POS của các món "nổi bật" (`MON_NOI_BAT`) và nội dung từng món (`mon.js`: ảnh, mô tả, thành phần, công dụng, nhu cầu) — chủ quán / chat điền sau bằng patch.
- Số gọi / Zalo / email hỗ trợ (`lienHe.js`) — trống thì mục Hỗ trợ ẩn.

### Phát hiện (ngoài phạm vi — không sửa)
- Tên nhóm món của POS chưa biết: biểu tượng nhóm khớp theo TÊN (Trà / Ép / Cà phê / Dưỡng sinh / Hoa quả như demo); tên khác → biểu tượng mặc định (tủ). Nhờ chủ quán xác nhận tên nhóm thật.
- `PUT /pin` đã có PIN → `PIN_DA_CO` 409: bảng PIN chỉ hiện lời POS; cách ĐỔI PIN (cần PIN cũ?) hợp đồng chưa ghi (như vòng 1).
- Danh sách `/don` chưa có tên món; giá trị `trang_thai` chưa ghi → app ẩn ô lọc và chỉ hiện "Đã hủy" / "Đã thanh toán" khi POS trả `cancelled` / `paid`.
- Nút QR ở màn "Ưu đãi" trong demo chỉ `return false`; app dùng nút QR mở màn mã thành viên ở mọi màn.

### Báo cáo 7 mục — vòng 2
- **VIỆC**: KH-UI-2 vòng 2 — app khớp demo patch39 trên điện thoại.
- **ĐÃ SỬA**: `src/giaoDien/` (demo_1/2.css chép từ demo + giaoDien.css phần riêng), `index.html` (sprite SVG), `public/` (âm thanh, họa tiết thẻ vàng, manifest đổi màu theo demo), `src/App.jsx`, `components/` (Man, ManDau có âm thanh, ThanhTab nền lụa, BieuTuong men, MonO, NhanMa, PinSheet, BannerHomNay, TrangTai), `pages/` (TrangChu, Menu, TrangMon, UuDai, TaiKhoan, HoSo, HoTro, Don, ManQR, DangNhap), `menuLoc.js`, `dieuHuong.js`, `noiDung/`, `cong_cu/thu_KHUI2.js`, `viec/KH-UI-2/so_anh/`, `doi_chieu_demo.md`.
- **BÀI THỬ**: `thu_KHUI2.js` 74 đạt (đỏ trên gốc 056286f, xem `bang_chung_do.txt`); `thu_KHUNG.js` 9 đạt; `npm test` 16 đạt; `--day-du` 18 đạt; kiểm khói Chromium 15/15 (màn mở + nút âm thanh, `?ma=` xoá khỏi địa chỉ + mã điền sẵn không tự gửi, Menu giữ ô tìm + cuộn, chi tiết đơn không "nợ", PIN gửi `{pin, pin_lai}` và báo lệch không gửi, QR vẽ, đăng xuất, không lỗi console); bề rộng đã chụp 360, 390, 430 (và 320 / 768 / 1280 ở vòng 1).
- **ĐÃ RÀ K4**: `grep -rn "new Date(" src` rỗng; `fetch(` chỉ `src/api.js`; mọi `<use href="#…">` có trong sprite (ca thử); không còn chữ "nợ".
- **CHƯA KIỂM**: điện thoại / Zalo thật; âm thanh thật trên điện thoại (trình duyệt chặn tự phát — chỉ phát khi chạm nút); khối "Hôm nay" mới kiểm bằng chữ thử ở nháp (đã khớp ảnh demo), chưa có chữ thật; chữ phóng 200 %; ảnh so là bản có nội dung thử cho `mon.js` (bản thật đang rỗng nên ô nhu cầu / nhãn món chưa hiện); chưa gọi POS thật (API giả), CORS giữa hai tên miền.
- **GIT**: nhánh `viec/KH-UI-2`, không merge, không PR.
- **BÀI HỌC**: dưới.

### Bài học (vòng 2)
- KHOÁ (đã làm, trong Phạm vi): ca thu_KHUI2 kiểm mọi biểu tượng app dùng có trong sprite `index.html` (sprite cắt từ demo, thiếu một biểu tượng = ô trống im lặng); ca "không chữ nợ"; ca "âm thanh mặc định TẮT".
- NGUYÊN TẮC (đề xuất, K10): "Chuẩn theo demo" làm bằng CHÉP máy móc (CSS lọc theo lớp dùng + sprite cắt) rẻ hơn và khớp hơn viết lại bằng mắt — khuôn mới cho việc giao diện sau: ghi công cụ trích ở phiếu để chat khác dùng lại.
- Sự cố: người gác chặn vòng `for`, `sed -i`, lệnh `node` nối `&&` / `;` → tách lệnh, dùng Edit; chỉ một lần mỗi loại.
- Dọn: không lời dặn nào trong KHUON_LOI.md / CLAUDE.md có phép kiểm làm thay mà chưa xoá — K9 mới có từ 29.10.

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-UI-2`. Hook mở phiên kéo `29b830c → f5b09f1`. HEAD = FETCH_HEAD = `f5b09f1`.
```
f5b09f1 TU-CHAY: gop main vao viec/KH-UI-2 (sua cau_hinh nguoi gac)
f32c76b TU-CHAY: sua cau_hinh App KH - tep_bash_them rong (nguoi gac chan moi lenh NG-CAUHINH)
29b830c PHIEU: KH-UI-2
```

## Cấu hình Cloudflare (A3)
- Lệnh dựng: `npm run build` (vite build) — thư mục ra: `dist` — Node ≥ 20 (`engines` trong package.json; dùng 20 hoặc 22).
- Biến môi trường: `VITE_POS_API` = `https://pos-tuquyduong.io.vn` (có `/` cuối cũng được — app bỏ). Đặt ở Cloudflare (Settings → Variables, loại **Build** vì Vite nhúng lúc dựng). Không đặt = cùng gốc (chỉ dùng cho proxy dev).
- Không tạo `.env*`. Không commit `dist/`.
- Lưu ý cho chủ quán: POS phải cho phép CORS từ `tuquyduong.com` và địa chỉ xem thử `*.pages.dev` — nếu trình duyệt báo lỗi CORS, đó là việc phía POS (xem Phát hiện).

## Nghiệm thu — từng mục, một dòng bằng chứng
- A1 `ghepDiaChi` `src/dinhDang.js` + dùng ở `src/api.js:34`; thu_KHUI2 khối "A1" (4 ca).
- A2 `loiTheoCode` `src/dinhDang.js` (không `code` → LOI_MAY_CHU); `src/api.js:41` truyền `dl.code` thô; thu_KHUI2 khối "A2" (5 ca, có ca 500 chỉ `{error}`).
- A3 mục "Cấu hình Cloudflare" ở trên.
- A4 `npm test` K8 đạt (`PUT /pin`, `GET /voucher?all=1` trong hợp đồng).
- B1 `src/components/ManDau.jsx` (sessionStorage, chạm bỏ qua, reduced-motion) + CSS; chụp `man_dau.png` (nháp) thấy đúng.
- B2 `src/pages/DangNhap.jsx` (giữ luồng cũ: `lay_ma_tai_quay`, `CAN_TEN`, hiện nguyên `error`).
- B3 `src/components/ThanhTab.jsx` 4 mục; thu_KHUI2 ca B3.
- B4 `src/pages/TrangChu.jsx` (chào, điểm, QR, banner; nhu cầu + nổi bật ẩn khi nội dung rỗng).
- B5 `src/pages/ManQR.jsx` (qrcode-generator 2.0.4, SĐT che, lời "Đưa mã này cho nhân viên quầy"); chụp `390_qr.png` thấy QR.
- B6 `src/pages/Menu.jsx` + `src/menuLoc.js` (nhóm, chip, tìm không dấu); `src/components/MonO.jsx` (Hết hàng / ton_cu); lưới `minmax(8.5rem,1fr)` → 2 cột ở 320px.
- B7 `src/pages/TrangMon.jsx` (không nút giỏ).
- B8 `src/pages/UuDai.jsx` + `src/components/NhanMa.jsx` (điểm, lịch sử, voucher, `?all=1`, mã khách mới, nhập mã).
- B9 `src/pages/TaiKhoan.jsx` (sửa tên, PIN `PUT /pin` nhập hai lần, hỗ trợ ẩn khi `lienHe.js` trống, đăng xuất) + `src/pages/Don.jsx` (lịch sử `con_nua`, chi tiết).
- B10 `src/components/TrangTai.jsx` (khung xám, lỗi + Thử lại), danh sách rỗng có lời.
- B11 thu_KHUI2 ca "không new Date(" + dùng `dinhDangNgay` khắp nơi.
- C1 `src/App.jsx` đầu file (`docVaXoaMaTrenDiaChi` → `replaceState`, giữ trong state); chụp: URL `?ma=ab12cd&utm=1` → `?utm=1`.
- C2 `src/App.jsx` (tab khởi đầu `uudai`, `khiDangNhapXong`), `NhanMa` có `maSan`, KHÔNG tự gửi.
- C3 `src/maBill.js`; thu_KHUI2 khối C3 (12 ca); ô nhập tay dùng `chuanHoaMa` (`NhanMa.jsx`).
- D1 `public/anh/` ~480 KB, ảnh lớn nhất 110 KB (<300 KB nên không có Phát hiện nén); thu_KHUI2 ca ≤2 MB + không base64.
- D2 `src/noiDung/{mon,nhuCau,trangChu}.js`; thu_KHUI2 khối D2.
- D3 thu_KHUI2 ca "không chữ mẫu".
- E1 `public/manifest.webmanifest` + `index.html`; thu_KHUI2 khối E. Biểu tượng `purpose: any maskable` (emblem chiếm 66% giữa, đã xem ảnh 512).
- E2 `ke_hoach.md` mục "E2"; thu_KHUI2 ca "không service worker".
- E3 thu_KHUI2 đọc kích thước PNG (180/192/512).
- F1 khung `max-width:720px` giữa màn, nền thương hiệu từ 600px; chụp 768 / 1280 đúng.
- F2 ảnh `aspect-ratio` + `object-fit: cover`; chữ `rem`; banner dùng `min-height` (sửa sau soát).
- F3 `--cham: 44px`, `env(safe-area-inset-bottom)` ở thanh tab.
- F4 không dùng clipboard / share; `100vh` rồi `100dvh`.
- F5 bề rộng đã tự kiểm bằng Chromium + Playwright có sẵn trong môi trường (API giả chỉ ở nháp, không vào kho): **320, 390, 768, 1280 px** × 4 tab (+QR ở 390, Back từ QR về Trang chủ): không cuộn ngang. **Chưa chụp**: 375, 1024; chữ phóng 200%; trình duyệt Zalo thật (chat sẽ chụp đủ 6 cỡ).
- G1 `cong_cu/thu_KHUI2.js` — 63 đạt · 0 hỏng.
- G2 `npm test` 13 đạt · 0 hỏng; `--day-du` 15 đạt · 0 hỏng; cổng: xem cuối file.
- G3 xem "Chủ quán thử tay".

## Chủ quán thử tay (G3, ≤ 3 thao tác, trên địa chỉ xem thử Cloudflare của nhánh)
1. Đăng nhập bằng mã lấy ở quầy → xem Trang chủ → Menu → chạm một món → Ưu đãi → nút QR ở Trang chủ.
2. Mở `<địa chỉ xem thử>/?ma=<mã trên một hoá đơn thật>` → màn Ưu đãi, mã đã điền, bấm "Nhận điểm" (thanh địa chỉ không còn `?ma=`).
3. Mở trên máy tính, kéo hẹp / rộng cửa sổ; trên điện thoại thử nút Back sau khi mở một món.

## Câu hỏi
(không có câu hỏi chặn việc)

## Phát hiện (ngoài phạm vi — không sửa)
- Hợp đồng `/api/kh` không ghi tên trường của `/voucher` (`status`, `reward_name`, `discount_type`, `expires_at`, `valid_to`, `min_order`), `/diem` (`history[].reason/type/points/created_at`), kết quả `nhan-diem` (`message`, `diem_cong`) và `nhan-ma-bill` (`data.voucher_code`…): app dùng đúng như app nền (f5b09f1) và đã phòng thiếu trường (không hiện "undefined"); nhờ chat POS ghi các trường này vào hợp đồng.
- Giá trị `trang_thai` / `thanh_toan` của `/don` (`cancelled`, `paid`) cũng chưa ghi trong hợp đồng; nhãn "Còn nợ" chỉ hiện khi `tong > da_tra`. Nên chủ quán xác nhận có muốn khách thấy "Còn nợ" không (quyết định tiền).
- `PUT /pin`: hợp đồng không có trường PIN cũ, `PIN_DA_CO` 409 → khách đã có PIN sẽ nhận lời của POS khi bấm "đổi"; cần POS nói rõ cách đổi PIN.
- CORS: app gọi POS khác tên miền (`tuquyduong.com` → `pos-tuquyduong.io.vn`) — POS phải cho phép nguồn này (nếu chưa).
- Màn mở dùng đơn vị `cqw/cqh` (cần Chrome ≥ 105 / Safari ≥ 16); WebView Zalo quá cũ có thể méo màn mở (vẫn chạm bỏ qua được). Nghi ngờ, chưa kiểm thật.
- Thẻ hội viên: chữ trắng trên đầu gradient hồng nhạt hơi mờ — chủ quán xem có cần đậm hơn.
- Menu mất ô tìm / nhóm đã chọn khi vào một món rồi Back (màn Menu dựng lại) — chấp nhận ở đợt này.
- `dungTai` không huỷ kết quả cũ khi đổi tham số nhanh (nhẹ).

## Soát độc lập (/ra-soat, vòng 1) — KHÔNG ĐẠT → đã sửa ở `c9d9278`
Tóm tắt báo cáo agent soát (đã đọc đủ) và xử lý:
1. Banner `aspect-ratio` cắt nút ở 320px / chữ 200% → ĐÃ SỬA `min-height` (chụp lại 320: thấy đủ nút) + ca thử mới.
2. Trường POS ngoài hợp đồng / `undefined` hiện ra → ĐÃ phòng (NhanMa, TaiKhoan, Don); ghi Phát hiện.
3. 401 giữa phiên không dọn màn con → ĐÃ SỬA (`nx.veDau()` trong `datKhiHetPhien`, `src/App.jsx`).
4. `?ma=` bị lỗi thì `maCho` kẹt, mất nút ưu đãi khách mới → ĐÃ SỬA (`khiThu` xoá `maCho` ngay khi thử).
5. Cuộn giữ vị trí cũ khi mở màn con → ĐÃ SỬA (`scrollTop = 0` khi đổi tab / màn con). Menu dựng lại khi Back: ghi Phát hiện.
6. Chạm đúp đẩy hai mục lịch sử → ĐÃ SỬA (`sau` là `useRef`, `src/dieuHuong.js`).
7. Nhãn đơn "Còn nợ" sai khi thiếu số → ĐÃ SỬA (`src/pages/Don.jsx`).
8. Ô nhập mã nằm trong `TrangTai` của `/diem` → ĐÃ SỬA (tách ra ngoài, `src/pages/UuDai.jsx`).
9. `cqw` không dự phòng → ghi Phát hiện (chưa kiểm thật). 10. Lưới 2 cột ở 320px → ĐÃ SỬA (`8.5rem`). 11. `fill="#000"` của QR giữ (QR cần đen), `theme-color` index.html trùng manifest. 12. Code chết (`dienThoai`, `export CAC_TAB`) → ĐÃ gỡ.
Bằng chứng đỏ: người soát nói "đỏ do thiếu module chưa phải đỏ đúng nghĩa" — ghi nhận; ca A2 đỏ trên gốc được lập luận bằng dòng code cũ (viec/KH-UI-2/bang_chung_do.txt). Việc không chạm tiền, phiếu miễn bài thử đỏ (cổng: miễn).
Chưa soát lại vòng 2 (còn 2 vòng, không dùng vì các sửa là cục bộ và đã dựng + chụp lại).

## BÁO CÁO 7 MỤC
- **VIỆC**: KH-UI-2 — App KH theo demo patch39: 4 tab, Trang chủ, Menu, Trang món, Ưu đãi, Tài khoản (PIN, lịch sử đơn), QR thành viên, màn mở Mái đình, link QR hoá đơn `?ma=`, PWA (manifest, không service worker), khung mọi cỡ màn.
- **ĐÃ SỬA**: `src/` (App, api, dinhDang, maBill, menuLoc, dieuHuong, noiDung/*, components/*, pages/*, giaoDien/giaoDien.css), `public/` (ảnh tách từ demo ~480 KB, manifest, biểu tượng 180/192/512), `index.html`, `package.json` + lockfile (`qrcode-generator` 2.0.4, hash do `npm ci` kiểm), `cong_cu/thu_KHUI2.js`.
- **BÀI THỬ**: `thu_KHUI2.js` 63 đạt · 0 hỏng; `thu_KHUNG.js` 9 đạt; `npm test` 13 đạt; `--day-du` 15 đạt (dựng được). Chụp tay bằng Playwright ở 320/390/768/1280.
- **ĐÃ RÀ K4**: grep `new Date(` (không), `fetch(` (chỉ api.js), `1900`/`support@` (không), `innerHTML` (không), lời máy `e.message` (chỉ lỗi từ api.js, đã phòng TypeError), nhãn tiền từ trường POS.
- **CHƯA KIỂM**: Zalo / điện thoại thật, Back trên điện thoại thật, chữ 200%, bề rộng 375/1024, nút quét QR bằng quầy, gọi POS thật (dùng API giả), CORS giữa hai tên miền, màn mở trên WebView cũ; âm thanh màn mở của demo KHÔNG đưa vào (phiếu không nêu).
- **GIT**: nhánh `viec/KH-UI-2`, commit `0408cc8 702b626 8a44288 bf4834e 8d0a519 c9d9278` (+ commit trang_thai). Không merge, không PR.
- **BÀI HỌC**: xem dưới.

## Bài học
- KHOÁ (đã làm, trong Phạm vi): thu_KHUI2 ca "khung có chữ + nút không khoá `aspect-ratio` khi `overflow:hidden`" (đỏ trước khi sửa banner).
- KHOÁ (đề xuất ngoài Phạm vi): bộ kiểm K8 mở rộng — đối chiếu tên trường đọc ở `.jsx` với `tra` trong hợp đồng; trường lạ phải có dòng Phát hiện. Ca đỏ: đọc `v.status` khi hợp đồng không ghi.
- NGUYÊN TẮC (đề xuất K9): trạng thái cấp App gắn với phiên (`maCho`, ngăn xếp màn con) phải dọn ở MỘT chỗ cho cả đăng xuất lẫn 401 — hai đường từng khác nhau (soát bắt). Dấu hiệu: hai hàm cùng "kết thúc phiên" dọn khác nhau.
- NGUYÊN TẮC (đề xuất): khung có chữ + nút không dùng tỉ lệ cố định (aspect-ratio) — chỉ ảnh mới dùng.
- BỎ: `npm install` bị người gác chặn (NPM-LENH) — đã hỏi chủ quán, sửa tay lockfile + `npm ci`; chỉ một lần (phiếu sau nên ghi cách thêm thư viện).
- Dọn: không có lời dặn nào trong KHUON_LOI.md / CLAUDE.md cần xoá.

✓ CỔNG CHẠY ĐẠT (`node tu_chay/cong.js chay . 29b830c^ HEAD viec/KH-UI-2` tại `c9d9278`, cây sạch)
HEAD ĐÃ KIỂM: c9d9278

## Soát độc lập vòng vá 2 (/ra-soat) — KHÔNG ĐẠT → đã sửa ở `09a5739`
Báo cáo agent soát (nguyên ý, đã đọc đủ): KHÔNG ĐẠT; không lỗi chặn nhưng 3 lỗi thật + nghi ngờ nhẹ; nghiệm thu 8/9 có bằng chứng (V8 thiếu kết quả cổng vòng 2).
Xử lý từng mục:
1. Menu giữ trong cây → số "Hết hàng" / tồn cũ: ĐÃ SỬA — `Menu.jsx` làm mới khi khách BẤM tab Menu (`lanVao` từ `App.jsx`), quay lại từ màn con thì giữ nguyên.
2. Số Voucher dựa trường ngoài hợp đồng: ĐÃ SỬA — `TaiKhoan.jsx` / `UuDai.jsx` đếm thẳng `/voucher` (không `?all` chỉ trả mã còn dùng).
3. Enter nổi bọt ở thẻ Tài khoản: ĐÃ SỬA — `src/components/bam.js` (Enter + Space, chặn nổi bọt), ca thu_KHUI2.
4. "Đổi số điện thoại" thiếu phím: ĐÃ SỬA (dùng `bam`). Các chỗ khác còn Enter-only (Menu, MonO, TrangChu…): GHI NHẬN, chưa chuyển hết sang `bam` (đề xuất việc nhỏ sau).
5. `veDau` gọi lặp: ĐÃ SỬA — đặt độ sâu về 0 ngay (`dieuHuong.js`).
6. Giá trị `cancelled` / `paid` đoán: giữ, đã ở Phát hiện (chờ hợp đồng).
7. Âm thanh: ĐÃ SỬA `preload="none"`, vùng bấm nút màn mở ≥ 44 px (CSS). Nút hiện "Bật âm thanh" khi 'on' đã lưu mà bị chặn tự phát: để nguyên (đúng demo, chạm là phát).
8. PinSheet: ĐÃ SỬA bỏ qua phím có Ctrl/Meta/Alt, không đóng khi đang gửi. Focus trap: chưa làm (ghi nhận).
9. BannerHomNay chưa chạy trong bản thật (chữ trống): đã kiểm bằng chữ thử ở nháp; `document.fonts.ready`: chưa làm (ghi nhận).
10. Dọn phiên hai đường: ĐÃ SỬA — `donPhien()` dùng chung cho đăng xuất và 401 (`App.jsx`).
Nghi ngờ bài thử V5/V6 chỉ là regex: đã thêm ca HÀNH VI (`bam`) và kiểm khói Chromium 15/15 (cuộn giữ vị trí, ô tìm giữ) ở nháp; ghi nhận: bằng chứng đỏ riêng cho V6/V9 chưa có (bài đỏ chung vì thiếu module trên gốc).
Lệch ảnh %: doi_chieu_demo.md nói đọc theo bảng khối, không theo %; chưa có ảnh lệch từng khối — ghi nhận.
Kết quả sau sửa: `thu_KHUI2.js` 78 đạt · 0 hỏng; `npm test` xanh; `--day-du` 18 đạt · 0 hỏng.

SỐ CA thu_KHUI2.js đã ghi ở bang_chung_do.txt là 74 (trước vòng vá); sau vá 78 — bài đỏ trên gốc vẫn đỏ (các ca mới `bam.js` chưa có trên gốc).

✓ CỔNG CHẠY ĐẠT (`node tu_chay/cong.js chay . 29b830c^ HEAD viec/KH-UI-2` tại `09a5739`, cây sạch)
HEAD ĐÃ KIỂM: 09a5739
