# KH-PWA-2 — Service worker: bỏ lưu nhạc (iPhone), máy chủ lỗi thì mở khung đã lưu, chỉ lưu đúng trang của App

<!-- Chat App KH soạn 09.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 10.11. Mở SAU KHI KH-PWA-1 đã gộp + ghi xong. Chạy SONG SONG được với KH-UI-5d / KH-UI-5e
     (việc này CHỈ sửa public/sw.js + bài thử của nó).
     Chủ quán 09.11 "đồng ý cả" 3 đề xuất chat sau soát cuối KH-PWA-1 (Câu hỏi 2 + mục Phát hiện của máy). -->

## Mục tiêu
Khung App mở được cả khi máy chủ báo lỗi, không bao giờ lưu nhầm trang lạ làm khung App, và nhạc màn mở trên iPhone không bị câm vì service worker.

## Nghiệm thu
- A1 **Nhạc**: `/am_thanh/*` KHÔNG còn qua service worker (đi thẳng mạng như trước KH-PWA-1 — `chienLuoc` trả `null`); xoá các tệp `/am_thanh/*` đã lưu trong kho ở `activate`.
  Lý do: Safari iPhone phát nhạc bằng yêu cầu "Range" (từng đoạn) — trả bản lưu nguyên tệp có thể làm nhạc câm. `/fonts`, `/anh`, `/manifest.webmanifest` giữ luật cũ.
- A2 **Máy chủ lỗi**: trang (điều hướng) mà mạng trả 5xx (500–599) hoặc trả không phải HTML → dùng vỏ đã lưu (như khi mất mạng); chưa có vỏ lưu → trả nguyên phản hồi mạng.
  404 của một đường dẫn trang cũng dùng vỏ đã lưu (App tự hiện "Không tìm thấy" bằng `KhongTimThay`). Phản hồi lỗi KHÔNG bao giờ được lưu.
- A3 **Chỉ lưu đúng trang của App**: chỉ lưu vỏ khi HTML có tệp JS chính của App (`tenBan(html)` khác rỗng); trang lạ (trang đăng nhập wifi, trang lỗi của nhà mạng…) → không lưu,
  giữ vỏ cũ.
- A4 Đổi số kho `tqd-v1` → `tqd-v2` (để `activate` dọn kho cũ có nhạc đã lưu), không làm mất vỏ: `install` vẫn lưu vỏ mới như KH-PWA-1.
- A5 Ghi chú cho sau này (không làm): nếu App chia code nhiều tệp tải dần (React.lazy / import động) thì `tepCuaBan` phải biết các tệp đó — ghi 1 dòng chú thích đầu `sw.js`.
- A6 Bài thử: sửa `cong_cu/thu_KHPWA1.js` — ca A2 cũ (`/am_thanh` → `luuRoiCapNhat`) đổi thành `/am_thanh` → `null`; thêm ca: 5xx / 404 trang → vỏ lưu; 5xx khi chưa có vỏ → phản hồi mạng;
  HTML không có `/assets/index-*.js` → không lưu, vỏ cũ giữ nguyên; kho `tqd-v1` có `/am_thanh/*` → sau `activate` không còn (chạy cả `KHONG_TRINH_DUYET=1`, bằng `self` giả sẵn có).
  Bản sửa phải có ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`; KHÔNG dùng `## Bài thử cũ sửa`; không bớt ca khác. Đột biến (`dot_bien.py`) cho A1, A2, A3.
- A7 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.

## Phạm vi
- viec/KH-PWA-2/**
- public/sw.js
- cong_cu/thu_KHPWA1.js

## Ngân sách
~25 dòng `sw.js` + ~80 dòng thử. **Phương án đơn giản nhất đã xét:** bỏ `/am_thanh` khỏi luật thay vì tự xử lý yêu cầu Range (phức tạp, dễ lỗi trên Safari). Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `src/**` (KH-UI-5d / 5e đang sửa), `public/_headers`, `public/manifest.webmanifest`, `index.html`, `vite.config.mjs`, `package*.json`, bài thử khác, `kiem_tra_truoc_khi_giao.js`,
  `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG đụng `/api`, khác miền, không lưu dữ liệu khách — như KH-PWA-1.
- Chỉ push `git push -u origin viec/KH-PWA-2`. Không đụng `main`, không merge, không tạo PR.
