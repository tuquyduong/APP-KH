# KH-UI-2 — trạng thái

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
