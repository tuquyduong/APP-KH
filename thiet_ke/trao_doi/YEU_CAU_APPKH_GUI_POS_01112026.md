# YÊU CẦU App KH → chat POS — 01.11.2026 · tốc độ cổng /api/kh (đo thật)

Chủ quán thấy App KH chuyển tab chờ gần 1 giây. Chat App KH đo trực tiếp trong trình duyệt của chủ quán (app-kh.pages.dev, khách đã đăng nhập).
Chỉ gọi các cửa GET, không đổi dữ liệu. Phía App sẽ làm KH-NHANH-1 (giữ dữ liệu đã xem, tải trước, gọi song song).
Ba điểm dưới đây chỉ POS sửa được, và tốn ít công.

## Số đo (ms, mỗi dòng một lần gọi, từ Việt Nam)
| Cửa | Thời gian |
|---|---|
| `GET /gio-hoat-dong` (không token) | 723 · 404 · 422 |
| `GET /hang` (không token) | 671 · 397 · 401 |
| `GET /toi` (token) | 1452 |
| `GET /diem` (token) | 1438 |
| `GET /voucher` (token) | 959 |
| `GET /menu` (token) | 1238 |
| `/toi` + `/diem` + `/voucher` gọi CÙNG LÚC | 1425 |
| `GET /hang` có token: sau 6 giây nghỉ / gọi liền sau | 656 / 400 · 399 |

## 1. CORS thiếu `maxAge` — mỗi yêu cầu có token mất thêm một vòng (~250 ms)
- `server/index.js` dòng 59–63: `cors({ origin: '*', methods: [...], allowedHeaders: ['Content-Type', 'Authorization'] })`, không có `maxAge`.
- Có tiêu đề `Authorization` thì trình duyệt hỏi trước bằng `OPTIONS` (preflight). Không có `Access-Control-Max-Age` thì Chrome chỉ nhớ 5 giây.
  Đo được: 656 ms khi phải hỏi lại, 400 ms khi còn nhớ.
- Đề nghị: thêm `maxAge: 7200`. Chrome tối đa 2 giờ, Safari / Firefox nhận tới 24 giờ.
  Một dòng, không đổi hợp đồng, không đổi bảo mật: `origin` và `allowedHeaders` giữ nguyên.

## 2. Một vòng tới máy chủ đã ~400 ms — máy chủ đặt xa Việt Nam
- Cửa rẻ nhất (`/hang`, `/gio-hoat-dong`, máy chủ gần như không làm gì) vẫn 400 ms. Đây là thời gian đi đường.
- Đề nghị cho việc nâng Render gói trả phí (H1, chủ quán làm ≤ 02.11): chọn vùng **Singapore** nếu Render cho đổi.
  Kèm Turso cùng vùng hoặc gần nhất. Máy chủ ở Singapore mà kho dữ liệu ở xa thì mỗi truy vấn lại thêm một vòng.
- Xin POS cho biết vùng hiện tại của Render và Turso. Đổi vùng có cần dựng lại dịch vụ không, có mất dữ liệu không, cần chủ quán làm gì?

## 3. `/toi`, `/diem` chậm hơn cửa rẻ ~1 giây — thời gian xử lý trong máy chủ
- `/toi` 1452 ms, `/diem` 1438 ms, so với 400 ms của cửa rẻ, nên xử lý mất ~1 giây.
  Có thể do nhiều truy vấn Turso NỐI TIẾP (mỗi truy vấn một vòng mạng tới Turso), hoặc máy Free yếu.
- Đề nghị:
  - (a) Ghi thời gian xử lý từng route `/api/kh` vào log, hoặc tiêu đề `Server-Timing`, để biết chậm ở đâu.
  - (b) Truy vấn độc lập trong cùng route thì chạy song song (`Promise.all`) hoặc gộp.
  - (c) Không đổi tên trường hay dữ liệu trả về.
- Không gấp bằng mục 1–2. Làm sau khai trương cũng được, nếu chủ quán đồng ý.

## Phía App (KH-NHANH-1, sau KH-UI-3d)
- Tab đã xem mở lại hiện ngay dữ liệu lần trước, rồi lặng lẽ hỏi bản mới.
- Đã đăng nhập thì tải trước `/toi`, `/diem`, `/voucher` song song ngay khi mở app.
- Màn Thanh toán, Chi tiết đơn luôn chờ số mới nhất.
- Không đổi hợp đồng, không thêm cửa.
