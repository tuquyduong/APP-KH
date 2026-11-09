# KH-PWA-1 — kế hoạch

Đọc: `src/main.jsx` (12 dòng), `index.html` (một `<script type="module" src="/src/main.jsx">` → bản dựng `dist/index.html` trỏ đúng
`/assets/index-<băm>.js` + `/assets/index-<băm>.css`, không chunk lười — `grep "import(" src` rỗng, `npm run build` ra 2 file), `public/` (am_thanh, anh,
fonts, manifest; CHƯA có `_headers`, `_redirects`), `src/duongDan.js` (đường dẫn: /giohang, /thanhtoan, /don/:ma, /dangnhap, /taikhoan/thongtin),
hộp thoại `role="dialog" aria-modal="true"` ở `src/components/PinSheet.jsx:54`, `src/pages/TracNghiemLam.jsx:14`;
bộ kiểm `kiem_tra_truoc_khi_giao.js:35-36` (K1: trong `src/` chỉ `src/api.js` được có `fetch(`).

## Phần 1 — chỗ đặt luật (A2) và cách hỏi bản mới (B2)
- **A (chọn):** `chienLuoc(url, cach)` + `tenBan(html)` + `tepCuaBan(html)` viết TRONG `public/sw.js` (chỗ duy nhất dùng chúng; `public/` chép nguyên, không
  qua Vite nên sw.js không `import` được file của `src/`). Bài thử nạp `sw.js` bằng `vm` với `self` giả → thử thẳng hàm thật, không chép.
  `coTheTaiLai`, `denLucKiem`, `doiBan` (phía trang) ở `src/dangKySW.js`. Một luật — một chỗ.
- B: luật trong `src/swLuat.js` + chép sang sw.js lúc dựng → phải sửa `vite.config.mjs` (CẤM) hoặc chép tay hai chỗ (trái "một quy tắc một hàm"). Bỏ.
- **B2 hỏi `index.html`:** K1 cấm `fetch` trong `src/` ngoài `api.js`, `api.js` CẤM sửa → trang nhắn service worker (`postMessage` + `MessageChannel`), SW hỏi
  `/` (`cache: 'no-store'`), lưu đè vỏ, trả tên `/assets/index-*.js` mới; trang so với tên file của chính nó (`script[src*="/assets/index-"]`).
  Không có SW điều khiển (lần đầu, trình duyệt không hỗ trợ) → bỏ qua lặng lẽ (vừa mở = đã là bản mới nhờ B1).

## Phần 2 — sw.js (~110 dòng)
- install: `skipWaiting()`; lưu sẵn vỏ `/` + các tệp cùng miền mà vỏ trỏ tới (`/assets`, `/fonts`, `/anh`, `/am_thanh`, manifest) — để lần mở thứ hai
  không mạng vẫn có Trang chủ (lần đầu trang tải trước khi SW nhận việc). Lỗi lưu sẵn → vẫn cài (không làm hỏng App).
- activate: xoá kho `tqd-*` khác `tqd-v1`; `clients.claim()`.
- fetch: `chienLuoc` → `null` thì `return` (không `respondWith`) cho: không GET, khác miền, `/api…`, `/kiemkhop`, `/sw.js`, mọi đường khác chưa có luật.
  `trang`: mạng trước, chờ 3 giây; mạng 200 cùng miền → lưu đè vỏ (khóa `/`), dọn assets; lỗi / quá giờ → vỏ đã lưu (chưa có vỏ → chờ mạng như hôm nay).
  `luuTruoc` (/assets): có thì trả, chưa có → mạng rồi lưu. `luuRoiCapNhat`: trả bản lưu, lấy mới ở nền (`waitUntil`).
- A3 dọn: khi lưu đè vỏ, tệp `/assets/*` không nằm trong (vỏ cũ ∪ vỏ mới) bị xoá → giữ đúng 2 bản; không cần sổ riêng (đọc vỏ cũ trước khi đè).
- message `kiemBan`: hỏi `/` không đệm → lưu đè vỏ (cùng hàm) → trả `tenBan(html)` (HTML hỏng / không có script → `''`).

## Phần 3 — dangKySW.js (~45 dòng) + main.jsx (+2 dòng)
- `dangKySW()`: chỉ khi `import.meta.env.PROD` và `'serviceWorker' in navigator`; `register('/sw.js', { updateViaCache: 'none' }).catch(() => {})`.
- `visibilitychange`: ẩn → ghi `lucAn`; hiện → `denLucKiem(lucAn, lanKiem, bayGio)` (ẩn ≥ 30 phút VÀ lần kiểm trước ≥ 30 phút) → hỏi SW.
  `doiBan(tenMoi, tenDangChay)` (tên mới rỗng = coi như không đổi) → thử tải lại ngay; không an toàn → thử lại mỗi 2 giây (bắt cả đổi trang lẫn đóng hộp thoại,
  không cần sửa App.jsx — CẤM) cho tới màn an toàn → `location.reload()` (giữ nguyên đường dẫn, không chữ — B4).
- `coTheTaiLai(duongDan, dangMoHopThoai)`: hộp thoại mở → không; `/giohang`, `/thanhtoan`, `/don/…`, `/dangnhap…`, `/taikhoan/thongtin` (không phân biệt hoa thường,
  bỏ `/` cuối) → không; còn lại → có. Hộp thoại = `document.querySelector('[role="dialog"],[aria-modal="true"]')`.

## Phần 4 — _headers (4 khối, 3 luật): `/sw.js`, `/index.html`, `/` → `no-cache`; `/assets/*` → `public, max-age=31536000, immutable`.

## Ngân sách: app ~155 dòng (sw.js ~110 + dangKySW ~45) — trong ~150 ± ; thử ~260.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHPWA1.js`)
| Nghiệm thu | Ca |
|---|---|
| A1 | đọc nguồn: dangKySW chỉ đăng ký khi `import.meta.env.PROD` + `serviceWorker`, `.catch`; main.jsx đúng 2 dòng dangKySW, dòng render giữ nguyên |
| A2 | `chienLuoc`: trang (navigate) / assets / fonts / anh / am_thanh / manifest / api cùng miền / API hoa (`/API/kh`) / khác miền / POST / kiemkhop (+`/KiemKhop/`) / sw.js / đường lạ; nguồn: nhánh `null` trả trước `respondWith`; thời hạn 3000 ms |
| A3 | nguồn: `tqd-v1`, activate xoá kho khác; hàm `tepCuaBan` lấy đúng danh sách assets; Chromium: sau bản mới chỉ còn 2 bộ assets |
| A4 | nguồn: `skipWaiting()`, `clients.claim()` |
| A5 | `_headers` đúng 3 luật (đủ, không thừa) |
| B1 | Chromium: dựng "bản mới" (đổi tên băm) → mở lại → chạy bản mới |
| B2 | `denLucKiem` (29:59 không, 30:00 có, kiểm trước < 30 phút → không), `doiBan`, `tenBan` (đổi / không đổi / HTML hỏng → ''), Chromium: ẩn/hiện + đồng hồ +31 phút ở `/menu` → tự tải lại |
| B3 | `coTheTaiLai` từng đường dẫn + hộp thoại mở; Chromium `/thanhtoan` → KHÔNG tải lại, rồi về `/menu` → tải lại |
| B4 | Chromium: sau tải lại vẫn `/menu`; nguồn: không chữ (không `alert`/`confirm`, chỉ `location.reload()`) |
| C1 | bài này; Chromium: có SW; tắt mạng (+ máy chủ tắt thật) → tải lại vẫn thấy Trang chủ |
| C2 | npm test, --day-du, cổng — ghi trang_thai.md |
| C3 | huong_dan_kiem_tay.md |

Đường song song cần canh: `/api` đi thẳng (không respondWith) — ca nguồn + ca hàm; ảnh món POS (khác miền) — ca hàm; `/kiemkhop` — ca hàm.
Luồng hợp lệ KHÔNG bị chặn (K5): App vẫn chạy khi SW lỗi đăng ký (`.catch`), dev không đăng ký, lần đầu không có SW vẫn chạy.
