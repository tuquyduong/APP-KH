# KH-PWA-1 — App mở gần như tức thì (lưu sẵn khung app, phông, ảnh trên máy khách) và luôn tự lên bản mới nhất, không kẹt bản cũ

<!-- Chat App KH soạn 08.11.2026. Việc THƯỜNG [Th], Opus (cần cẩn thận: làm sai thì khách kẹt bản cũ). Hạn 10.11. Chạy SONG SONG với KH-UI-5c và KH-THU-1 (mỗi việc một phiên, một nhánh).
     Tách từ KH-NHANH-1 (01.11). Chủ quán 08.11 hỏi "tự cập nhật lặng lẽ sẽ xảy ra và lúc nào?" → chốt cách dưới (mục B): KHÔNG có nút "Cập nhật", KHÔNG hỏi khách;
     bản mới tự vào (1) mỗi lần mở App khi có mạng, (2) khi khách quay lại App để chạy nền lâu mà đang ở màn an toàn. KHÔNG BAO GIỜ tự tải lại giữa lúc đặt đơn / trả tiền / nhập PIN.
     App là trang tĩnh trên Cloudflare Pages (`npm run build` → dist/; file trong public/ chép nguyên; Cloudflare đọc `public/_headers`). Vite đặt tên file JS/CSS kèm mã băm
     (`/assets/index-<băm>.js`) → file đó KHÔNG BAO GIỜ đổi nội dung; chỉ `index.html` đổi theo bản. Đọc CLAUDE.md §5, §8. -->

## Mục tiêu
Khách mở App lần thứ hai trở đi thấy giao diện gần như ngay lập tức (kể cả mạng chậm), mà vẫn luôn chạy bản mới nhất chủ quán vừa đưa lên.

## Nghiệm thu

### A. Lưu sẵn trên máy khách (service worker tự viết, không thư viện)
- A1 File `public/sw.js` + đăng ký trong `src/dangKySW.js` (gọi từ `src/main.jsx`, MỘT dòng import + MỘT dòng gọi). Chỉ đăng ký khi `import.meta.env.PROD` và trình duyệt có `serviceWorker`;
  lỗi đăng ký → bỏ qua lặng lẽ (App chạy như hôm nay). Không đăng ký ở `npm run dev`.
- A2 Luật theo loại yêu cầu (hàm thuần `chienLuoc(url, cach)` trong `src/dangKySW.js` hoặc file chung để thử được; `sw.js` dùng cùng luật):
  - **Trang (điều hướng, `mode === 'navigate'`)**: MẠNG TRƯỚC, chờ tối đa 3 giây; mạng lỗi / quá 3 giây → trả `index.html` đã lưu (vỏ App) — App tự dựng đúng trang theo đường dẫn.
    Mạng về đúng thì lưu đè bản `index.html` mới.
  - **`/assets/*`** (JS / CSS có mã băm): LƯU TRƯỚC (có rồi thì không hỏi mạng); chưa có → lấy mạng rồi lưu.
  - **`/fonts/*`, `/anh/*`, `/am_thanh/*`, `/manifest.webmanifest`**: trả bản đã lưu ngay, đồng thời lấy bản mới ở nền để lần sau dùng.
  - **KHÔNG BAO GIỜ đụng**: mọi `/api/…`, mọi yêu cầu khác tên miền (máy chủ POS, ảnh món từ POS, Google…), mọi yêu cầu không phải GET, `/kiemkhop`, `/sw.js`.
    Các yêu cầu này đi thẳng mạng như hôm nay (không `respondWith`).
- A3 Kho lưu tên kèm số bản (`tqd-v1`); khi `sw.js` đổi số bản thì xoá kho cũ ở `activate`. File `/assets/*` không còn dùng (bản cũ) dọn bớt: giữ tối đa 2 bản gần nhất
  (theo danh sách file mà `index.html` mới trỏ tới + bản trước đó), để khách đang mở bản cũ không vỡ.
- A4 `sw.js` dùng `skipWaiting()` + `clients.claim()` (bản service worker mới nhận việc ngay — an toàn vì trang luôn lấy mạng trước và file băm không đổi nội dung).
- A5 `public/_headers` (Cloudflare): `/sw.js` và `/index.html`, `/` → `Cache-Control: no-cache`; `/assets/*` → `Cache-Control: public, max-age=31536000, immutable`.

### B. Tự lên bản mới — lặng lẽ, đúng lúc (chủ quán 08.11)
- B1 **Mỗi lần mở App có mạng** → nhận ngay bản mới nhất (nhờ A2 "trang: mạng trước"). Không hỏi, không nút.
- B2 **App để chạy nền rồi quay lại**: khi trang hiện lại (`visibilitychange` → `visible`) sau ≥ 30 phút ẩn → hỏi `index.html` (bỏ qua bộ nhớ đệm), so tên file `/assets/index-*.js`
  với bản đang chạy; KHÁC → tự tải lại trang NẾU đang ở màn an toàn (B3); không an toàn → chờ, kiểm lại mỗi lần đổi trang / hiện lại, tới màn an toàn mới tải lại.
  Không có mạng / lỗi → bỏ qua, lần sau kiểm lại. Tối đa một lần kiểm mỗi 30 phút.
- B3 **Màn an toàn** (hàm thuần `coTheTaiLai(duongDan, dangMoHopThoai)`): KHÔNG an toàn khi đường dẫn là `/giohang`, `/thanhtoan`, `/don/…`, `/dangnhap…`, `/taikhoan/thongtin`,
  hoặc đang mở bất kỳ bảng nổi / hộp thoại (`[role="dialog"]`, `[aria-modal="true"]` trong trang — gồm bảng PIN, bảng QR trả tiền, bảng ngày của Kế hoạch). Còn lại an toàn.
  Giỏ hàng, kết quả trắc nghiệm, việc kế hoạch đã nằm trong kho trên máy (`luuMay.js`) → tải lại không mất.
- B4 Tải lại xong khách ở NGUYÊN đường dẫn đang xem. Không hiện chữ gì (lặng lẽ).

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHPWA1.js`: hàm thuần — `chienLuoc` (trang / assets / fonts / anh / api cùng miền / khác miền / POST / kiemkhop / sw.js → đúng luật), `coTheTaiLai`
  (từng đường dẫn ở B3 + hộp thoại mở), so bản (`index.html` có / không đổi tên file băm, HTML hỏng → coi như không đổi), đếm 30 phút; đọc nguồn: `sw.js` không có `respondWith`
  cho nhánh "không đụng", `main.jsx` chỉ thêm 2 dòng; `_headers` đúng 3 luật (chạy cả khi `KHONG_TRINH_DUYET=1`).
  Chromium (nếu ≤ 40 giây): `vite build` + máy chủ tĩnh nhỏ trong bài → mở App → có service worker; tắt mạng (`context.setOffline(true)`) → tải lại vẫn thấy Trang chủ;
  bật mạng, dựng "bản mới" (đổi tên file băm giả) → mở lại trang → chạy bản mới; ẩn / hiện trang với đồng hồ giả ≥ 30 phút ở `/menu` → tự tải lại, ở `/thanhtoan` → không.
- C2 `npm test`, `--day-du` (có `vite build`), cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`. `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- C3 `viec/KH-PWA-1/huong_dan_kiem_tay.md` cho chủ quán (≤ 10 dòng): mở App trên điện thoại 2 lần → lần 2 nhanh; bật chế độ máy bay → mở App vẫn thấy khung (dữ liệu báo
  "chưa tải được"); chat đưa bản mới → đóng hẳn App, mở lại → thấy thay đổi.

## Phạm vi
- viec/KH-PWA-1/**
- public/sw.js
- public/_headers
- src/dangKySW.js
- src/main.jsx
- cong_cu/thu_KHPWA1.js
- cong_cu/thu_KHUI2.js

## Ngân sách
~150 dòng app (sw.js + dangKySW.js) + ~250 dòng thử. **Phương án đơn giản nhất đã xét:** thư viện vite-plugin-pwa / Workbox — KHÔNG chọn: thêm thư viện, luật cập nhật
khó kiểm, dễ kẹt bản cũ; service worker tự viết ~100 dòng với 3 luật là đủ. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- `src/main.jsx` CHỈ thêm 1 dòng import + 1 dòng gọi đăng ký; không sửa dòng khác.
- KHÔNG sửa `src/App.jsx` (KH-UI-5c đang sửa), `src/components/**`, `src/pages/**`, `src/kehoach*.js`, `src/api.js`, `src/luuMay.js`, `src/datDon.js`, `src/duongDan.js`,
  `src/giaoDien/**`, `index.html`, `vite.config.mjs`, `public/manifest.webmanifest`, `package.json`, `package-lock.json`.
- KHÔNG sửa bài thử khác (KH-THU-1 đang sửa các bài chạy lâu; KH-UI-5c sửa `thu_KHUI5b*`), `kiem_tra_truoc_khi_giao.js`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`,
  `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG lưu / chặn / sửa bất kỳ yêu cầu `/api/…` hay khác tên miền; KHÔNG lưu dữ liệu khách (đơn, điểm, ví, token) trong kho service worker.
- KHÔNG làm thông báo đẩy (KH-TB-1), nút "Cài App" / "Thêm vào màn hình chính", màn ngoại tuyến riêng, nút "Có bản mới".
- Chỉ push `git push -u origin viec/KH-PWA-1`. Không đụng `main`, không merge, không tạo PR.

## Trả lời Câu hỏi 1 (chủ quán duyệt 08.11, chat App KH soạn)
- ĐỒNG Ý thêm `cong_cu/thu_KHUI2.js` vào Phạm vi, CHỈ để đổi ca `E2 không service worker` (dòng ~119). KHÔNG đổi ca nào khác, không bớt ca.
- Ca E2 mới, cùng chỗ, đổi tên thành `E2 service worker chỉ đăng ký qua src/dangKySW.js`, đạt khi CẢ BỐN đúng:
  (1) có `public/sw.js`; (2) có `src/dangKySW.js` và trong đó có `serviceWorker.register(`; (3) `src/App.jsx` và `index.html` KHÔNG có chữ `serviceWorker`;
  (4) `src/main.jsx` KHÔNG có chữ `serviceWorker` (chỉ import + gọi hàm của `dangKySW.js`).
  → Ca này ĐỎ trên code gốc (gốc chưa có `src/dangKySW.js`), kể cả `KHONG_TRINH_DUYET=1` — đó là bài đỏ hợp lệ của file này cho A11.
- KHÔNG dùng `## Bài thử cũ sửa` cho `thu_KHUI2.js`: việc này CỐ Ý đổi điều bài cũ canh (bản gốc của file sẽ đỏ trên code mới — đúng như luật mẫu phiếu nói, không được miễn).
  Ghi `SỐ CA thu_KHUI2.js: <N>` (đếm với `KHONG_TRINH_DUYET=1`) vào `bang_chung_do.txt`.
- Phát hiện trắc nghiệm dở: ĐỒNG Ý xếp `/tracnghiem/lam` (và mọi đường dẫn con của nó) vào màn KHÔNG an toàn ở `src/dangKySW.js`, thêm ca thử trong `thu_KHPWA1.js`
  (đỏ trên code hiện tại của nhánh — tức là trước khi sửa dòng đó — là được; trên gốc bài vẫn đỏ vì chưa có file). Ghi vào báo cáo.
- 4 chỗ máy tự chọn (nhờ service worker hỏi `index.html` vì K1; `.sheet.show` tính là không an toàn; `import.meta.env?.PROD`; không dọn khi vỏ cùng bản lưu đè): chat ĐỒNG Ý cả bốn.
- Làm xong: chạy lại `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`), ghi "HEAD ĐÃ KIỂM", `/ra-soat`, báo cáo 7 mục. Chỉ push nhánh `viec/KH-PWA-1`.
