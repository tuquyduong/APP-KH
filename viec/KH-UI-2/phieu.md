# KH-UI-2 — App KH theo demo: các màn xem được · PWA · link QR hoá đơn · điện thoại / máy tính bảng / máy tính không vỡ

<!-- Phiếu do chat App KH soạn 28.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết, không chờ duyệt kế hoạch. Hạn 04.11.2026
     (khai trương T7 07.11; 05.11 chủ quán thử, 06.11 chuyển QR hoá đơn sang app mới — không có phương án dự phòng).
     Nền: kho APP-KH vừa dựng (app_kh/ chép từ POS 40e07ce: 6 màn đơn giản, React 19 + Vite 7, KHÔNG router).
     Thiết kế: thiet_ke/app_kh_demo.html (patch39 — mở bằng trình duyệt để xem), thiet_ke/TRANG_THAI_DEMO.md (mô tả từng màn),
     thiet_ke/DAC_TA_KY_THUAT_APP_KH.md (đọc ghi chú đầu file: một số chỗ đã đổi). Dữ liệu POS: CHỈ thiet_ke/HOP_DONG_API_KH.md (hợp đồng v1, bản chép — mục "Các cửa"); quy ước giờ: CLAUDE.md §6.
     Hạng, giá từng hạng, số dư ví, Giờ vàng, topping: KH-UI-3 làm khi POS xong KH-API-2 / TOPPING-1 — việc này KHÔNG làm, KHÔNG giả lập. -->

## Mục tiêu
Khách quét QR trên hoá đơn hoặc gõ `tuquyduong.com` là vào được app đẹp theo demo của chủ quán: đăng nhập bằng SĐT + mã (lấy ở quầy),
xem menu và từng món, xem điểm / voucher, nhận điểm bằng mã trên hoá đơn, đưa QR thành viên cho quầy quét, xem lịch sử đơn, đặt PIN.
Thêm được ra màn hình chính điện thoại như một app. Dùng tốt trên điện thoại, máy tính bảng, máy tính và trong trình duyệt của Zalo.
Chưa có giỏ / đặt đơn / ví / hạng — những màn đó KHÔNG hiện, không có nút dẫn tới.

## Nghiệm thu

### A. Kết nối POS
- A1 `src/api.js` ghép địa chỉ POS từ `import.meta.env.VITE_POS_API` (vd `https://pos-tuquyduong.io.vn`, bỏ `/` thừa cuối); không đặt → `''`
  (cùng gốc, dùng proxy dev). Vẫn là CHỖ DUY NHẤT gọi mạng, chỉ `/api/kh/*`. Hàm ghép địa chỉ là hàm thuần, có bài thử.
- A2 Lỗi: có `code` → hiện nguyên `error` của POS; **không có `code` (kể cả 500 chỉ có `{ error }` — lỗi đã biết của POS) → lời chung
  `LOI_MAY_CHU`, KHÔNG hiện lời máy**; mất mạng → lời dự phòng; 401 → xoá token, về đăng nhập. Chọn lời là hàm thuần trong `dinhDang.js`, có bài thử.
- A4 Mọi lời gọi viết thẳng `goi('PT', '/đường')` (hoặc chuỗi `` `/đường/${...}` ``) và PHẢI có trong hợp đồng — bộ kiểm K8 đối chiếu; cửa mới dùng
  trong việc này (`PUT /pin`, `GET /voucher?all=1`) đều đã có trong hợp đồng.
- A3 Cách đặt cho Cloudflare ghi vào `viec/KH-UI-2/trang_thai.md` mục "Cấu hình Cloudflare": lệnh dựng `npm run build`, thư mục ra `dist`,
  biến `VITE_POS_API`, bản Node. (Không tạo `.env*` — file cấm.)

### B. Màn hình theo demo (đợt 1 — chỉ phần có dữ liệu thật)
Bám demo về bố cục, màu, chữ, biểu tượng, chuyển động. Màu / chữ / khoảng cách / cỡ màn chỉ đặt ở `src/giaoDien/`. Không router: giữ kiểu
trạng thái màn như hiện tại (thêm "màn con" như trang món, QR, chi tiết đơn bằng trạng thái + nút quay lại; nút Back của điện thoại quay lại
màn trước bằng `history.pushState` / `popstate` — tự viết gọn, không thư viện).
- B1 **Màn mở "Mái đình"** như demo, chỉ ở lần mở đầu mỗi phiên trình duyệt, chạm để bỏ qua; `prefers-reduced-motion` → bỏ chuyển động.
- B2 **Đăng nhập** (kiểu demo): SĐT → `POST /dang-nhap/xin-ma` → `lay_ma_tai_quay` true thì hiện "Hỏi nhân viên quầy để lấy mã đăng nhập" →
  nhập mã 6 số (+ tên khi `CAN_TEN`) → `POST /dang-nhap/xac-minh`. Mọi mã lỗi trong hợp đồng hiện đúng lời, không trắng màn.
- B3 **Thanh tab dưới** đúng demo nhưng CHỈ 4 mục: Trang chủ · Menu · Ưu đãi · Tài khoản (bỏ Giỏ hàng tới KH-MUA-1).
- B4 **Trang chủ** (demo `home`): lời chào theo `ten` (chưa có xưng hô: "Chào <tên>"); thẻ hội viên thu nhỏ hiện **điểm** (`/diem`), CHƯA hiện hạng;
  nút mở **QR thành viên**; banner + 6 ô "Chăm sóc theo nhu cầu" + "Món nổi bật" lấy từ file nội dung `src/noiDung/` (mục D) — khối nào chưa có
  nội dung thì ẨN cả khối. KHÔNG làm: ô Giờ vàng, trắc nghiệm, lịch, mời bạn, thông báo.
- B5 **QR thành viên** (demo `member`): vẽ QR từ `qr` của `GET /toi` bằng `qrcode-generator` (đã duyệt, bản 2.0.4 đúng chính xác), kèm SĐT
  che giữa (`090 xxx 4567`) và lời "Đưa mã này cho nhân viên quầy". Độ sáng màn không đổi được trên web → không làm.
- B6 **Menu** (demo `catalog`): nhóm theo `nhom` của POS, ô lọc nhóm + ô tìm theo tên (không dấu cũng tìm được); mỗi món: ảnh (nếu có nội dung),
  tên, giá (`dinhDangGia`), "Hết hàng" khi `con_hang === false`; `con_hang === null` → không hiện chữ gì; `ton_cu` → giữ dòng "theo số lúc …".
  Lưới món tự giãn: 2 cột điện thoại, 3–4 cột máy tính bảng / máy tính (`grid` + `minmax`), không cố định số px.
- B7 **Trang món** (demo `detail`): ảnh, tên, giá, nhóm, mô tả, thành phần, công dụng — từ `src/noiDung/` theo **mã món** (`ma`); món chưa có nội
  dung → tên + giá + nhóm, không bịa mô tả. KHÔNG có nút "thêm vào giỏ", không chọn topping / cỡ.
- B8 **Ưu đãi** (demo `rewards`): điểm + lịch sử điểm, voucher còn dùng (+ "xem tất cả" `?all=1`), mã khách mới; ô **nhập mã trên hoá đơn** dùng
  lại cách làm hiện có (`nhan-ma-bill` / `nhan-diem` theo loại mã như `NhanMa.jsx` đang làm). KHÔNG làm: Giờ vàng, hạng, đổi quà bằng điểm.
- B9 **Tài khoản** (demo `account`): tên + SĐT che giữa, sửa tên (`PUT /toi`), **đặt / đổi PIN 4 số** (`PUT /pin`, nhập hai lần), **lịch sử đơn**
  (demo `orderhistory`, phân trang `con_nua`) + chi tiết đơn, đăng xuất. Ví / điểm trên thẻ tài khoản: chỉ điểm. Mục **Hỗ trợ**: số / Zalo / email
  đặt ở `src/noiDung/lienHe.js`, để TRỐNG (chủ quán chưa gửi số thật) → mục Hỗ trợ ẩn; có giá trị thì hiện nút gọi `tel:` / mở Zalo.
- B10 Trạng thái chung: đang tải (khung xám nhẹ như demo), lỗi + nút "Thử lại", danh sách rỗng có lời nhẹ nhàng. Không màn nào trắng.
- B11 **Giờ:** mọi giờ POS (ngày đơn, lịch sử điểm, hạn voucher…) hiện bằng `dinhDangNgay` từ CHUỖI — KHÔNG `new Date(chuỗi giờ POS)`. Giờ cũ dạng có
  dấu cách: hiện như chuỗi, không cộng 7. Việc này KHÔNG cần "bây giờ" (đếm ngược Giờ vàng, quán mở / đóng: KH-UI-3, dùng `bay_gio` của POS).

### C. Link QR trên hoá đơn — `https://tuquyduong.com/?ma=<mã>`
- C1 Mở app có `?ma=`: đọc mã — cắt khoảng trắng, đổi CHỮ HOA, chỉ nhận `[A-Z0-9]`, dài 1–32 (hiện POS in 6 ký tự; sai dạng → bỏ qua) —
  **xoá khỏi thanh địa chỉ ngay**
  (`history.replaceState`), giữ trong bộ nhớ trang (không lưu localStorage).
- C2 Đã đăng nhập → mở thẳng màn nhận điểm, mã điền sẵn, khách bấm "Nhận" (KHÔNG tự gửi). Chưa đăng nhập → đăng nhập / đăng ký trước, xong tự
  mở màn nhận điểm với mã đó. Mã này là **mã nhận điểm** → `POST /nhan-diem`; lỗi hiện nguyên lời POS.
- C3 Không `?ma=` → app mở bình thường. Ô nhập mã tay (màn Ưu đãi) dùng CÙNG hàm chuẩn hoá trước khi gửi. Hàm đọc / chuẩn hoá mã là hàm thuần,
  có bài thử (mã đúng, chữ thường → hoa, có dấu cách, ký tự lạ / có dấu, rỗng, 33 ký tự, có tham số khác).

### D. Nội dung trang trí — `src/noiDung/`
- D1 Ảnh trong demo (logo, mái đình, banner, ảnh món…) tách thành FILE trong `public/anh/` (giữ định dạng gốc), KHÔNG để base64 trong `src/`.
  Tổng ảnh trong `public/anh/` ≤ 2 MB; ảnh > 300 KB thì ghi Phát hiện (chat nén sau), không tự thêm công cụ nén.
- D2 `src/noiDung/mon.js`: bảng theo **mã món POS** → `{ anh, moTa, thanhPhan, congDung, nhuCau: [...] }`. Máy KHÔNG biết mã món thật → để bảng
  RỖNG kèm 1 dòng ví dụ trong chú thích (chủ quán / chat điền sau bằng patch — không phải câu hỏi, không dừng việc). `nhuCau.js`: 6 nhóm như demo (tên + biểu tượng);
  ô nhu cầu bấm → menu lọc các món có `nhuCau` đó; nhóm không có món → ẩn ô. `trangChu.js`: banner (ảnh + lời) như demo, danh sách mã món nổi bật (rỗng).
- D3 Chữ mẫu trong demo (hotline 1900 xxxx, email support@…, số liệu điểm / ví / % hạng) KHÔNG đưa vào app.

### E. PWA
- E1 `public/manifest.webmanifest`: `name` "Tứ Quý Đường", `short_name` "Tứ Quý Đường", `lang` "vi", `start_url` "/", `display` "standalone",
  `theme_color` / `background_color` theo `src/giaoDien/`, biểu tượng 192 và 512 px (+ `purpose: maskable` nếu ảnh có lề an toàn) lấy từ logo demo.
  `index.html`: link manifest, `apple-touch-icon` 180 px, `theme-color`, `viewport` có `viewport-fit=cover`.
- E2 **KHÔNG service worker** đợt này (tránh khách kẹt bản cũ tuần khai trương) — ghi lý do trong ke_hoach.md.
- E3 Kích thước ảnh biểu tượng đúng như khai báo (bài thử đọc kích thước PNG từ phần đầu file).

### F. Mọi cỡ màn hình không vỡ
- F1 Điện thoại: khung chiếm hết chiều ngang. Từ 600 px trở lên: khung app ở GIỮA, rộng tối đa ~720 px, hai bên nền màu thương hiệu; thanh tab
  nằm trong khung. Không thanh cuộn ngang ở bề rộng 320 px.
- F2 Ảnh có `aspect-ratio` + `object-fit: cover`; không kéo méo. Chữ dùng `rem`; phóng chữ 200 % (cài đặt máy) không tràn khung, không che nút.
- F3 Nút chạm ≥ 44 px; thanh tab chừa `env(safe-area-inset-bottom)` (iPhone tai thỏ).
- F4 Trình duyệt Zalo / Facebook: không dùng tính năng cần quyền (clipboard, share) mà không có đường dự phòng; `100vh` thay bằng `100dvh` có dự phòng.
- F5 Ghi vào trang_thai.md danh sách bề rộng đã tự kiểm (bằng công cụ dev của trình duyệt nếu môi trường có, không có thì ghi "chưa chụp" —
  KHÔNG cài trình duyệt / thư viện chụp màn). Chat sẽ chụp đủ 6 cỡ khi soát.

### G. Kiểm
- G1 Bài thử `cong_cu/thu_KHUI2.js` (in "n đạt · m hỏng"): ghép địa chỉ POS (A1), chọn lời lỗi (A2: có code / 500 không code / mất mạng), đọc + chuẩn hoá mã (C3), che SĐT, tìm món không dấu, lọc theo
  nhu cầu với bảng nội dung rỗng / có món, kích thước biểu tượng (E3), `manifest.webmanifest` đọc được và đủ trường, `index.html` có link manifest.
  Hàm thuần đặt trong file `src/*.js` không đụng DOM để bài nạp thẳng (kiểu `dinhDang.js`).
- G2 `npm test` và `node kiem_tra_truoc_khi_giao.js --day-du` xanh; `node tu_chay/cong.js chay` ĐẠT (ghi vào trang_thai.md).
- G3 Chủ quán thử tay (ghi vào trang_thai.md, ≤ 3 thao tác, trên địa chỉ xem thử Cloudflare của nhánh): (1) đăng nhập bằng mã lấy ở quầy, xem
  Trang chủ → Menu → một món → Ưu đãi → QR; (2) mở `<địa chỉ xem thử>/?ma=<mã trên một hoá đơn thật>` → nhận điểm; (3) mở trên máy tính, kéo hẹp / rộng
  cửa sổ xem có vỡ không.

## Phạm vi
- viec/KH-UI-2/**
- src/**
- public/**
- index.html
- vite.config.mjs
- package.json
- package-lock.json
- cong_cu/thu_KHUI2.js

## Bài thử đỏ
không — giao diện mới, không tiền, không dữ liệu; hàm thuần có bài cong_cu/thu_KHUI2.js chạy riêng

## Ngân sách
~1.800 dòng app (màn + `giaoDien/` theo demo) + ~150 dòng `noiDung/` + ~200 dòng thử. Không tính ảnh tách ra file.
**Phương án đơn giản nhất đã xét:** giữ app nền (không router, không thư viện UI), chỉ thay giao diện theo demo + thêm màn con bằng trạng thái;
nội dung trang trí là file tĩnh trong app (chưa cần kho dữ liệu, chưa cần chế độ sửa); không service worker.

## Đổi cấu trúc DB
không

## Thư viện mới
chỉ `qrcode-generator` đúng bản `2.0.4` (dependencies, MIT, không phụ thuộc — đã có trong danh sách K6 của bộ kiểm). Không thêm gì khác.

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/`.
- KHÔNG gọi gì ngoài `/api/kh/*` qua `src/api.js`; không giả lập dữ liệu POS trong bản dựng thật; trường không có trong hợp đồng → ẩn.
- KHÔNG service worker, không router, không thư viện UI / CSS, phông chữ: được dùng ĐÚNG link Google Fonts Inter như demo (`display=swap`) kèm phông hệ thống dự phòng — không nguồn ngoài nào khác.
- Không bí mật trong code / log. Chỉ push `git push -u origin viec/KH-UI-2`. Không đụng `main`, không merge, không tạo PR.
