# KH-UI-2 — kế hoạch

Phiếu việc thường: chạy thẳng, không chờ duyệt. Nền: app 6 màn, KHÔNG router, React 19 + Vite 7.

## Chọn phương án (A ngắn hơn, B nhiều dòng hơn — chọn A mọi phần)
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| Điều hướng màn con | `src/dieuHuong.js` ~30 dòng: ngăn xếp trong state + `history.pushState` / `popstate` | thêm thư viện router | phiếu cấm router; 1 file nhỏ |
| QR | `qrcode-generator` 2.0.4 (phiếu duyệt), vẽ `<path>` SVG tự dựng từ `isDark` | `createSvgTag` + `dangerouslySetInnerHTML` | không chèn HTML thô |
| Nội dung trang trí | `src/noiDung/*.js` là file JS thuần (bảng rỗng) | kho nhỏ + màn sửa | phiếu: chưa cần kho |
| Màn mở | 1 component + CSS lấy từ demo, bỏ âm thanh | chép nguyên demo (có mp3 ~80 KB base64) | phiếu không nhắc âm thanh; ít dòng |
| Hàm thuần | `dinhDang.js` (+ghép địa chỉ, che SĐT, lời chào, số), `maBill.js`, `menuLoc.js` | rải trong màn | bài thử nạp thẳng (G1) |
| Gộp màn | Điểm + Voucher + nhập mã → "Ưu đãi"; Tôi + Đơn → "Tài khoản" (+ màn con lịch sử đơn) | giữ 5 tab | phiếu B3: 4 tab |
| Tab / khung | khung `height:100dvh`, nội dung cuộn trong khung, tab nằm trong khung (không `position:fixed`) | fixed + max-width | khung giữa màn trên máy tính, không lệch |

Ước lượng: app ~1.000 dòng (jsx/js) + ~260 CSS; `noiDung/` ~35; bài thử ~150. Trong ngân sách.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHUI2.js`)
- A1 → khối "A1 ghép địa chỉ POS" (4 ca). A2 → "A2 chọn lời lỗi" (5 ca: có code, 500 không code, mất mạng…).
- C1/C3 → "C3 đọc / chuẩn hoá mã" (12 ca: đúng, chữ thường, dấu cách, ký tự lạ, rỗng, 32/33, tham số khác, bỏ `ma` khỏi địa chỉ) + ca đọc mã nguồn C1.
- B5 che SĐT; B4 lời chào; B6 tìm không dấu, nhóm; D2 lọc nhu cầu (bảng rỗng / có món); D1 ảnh ≤ 2 MB, không base64; D3 không chữ mẫu.
- E1/E3 manifest + kích thước PNG + index.html; E2 không service worker. F1–F4, B1, B3, B11 kiểm quy ước ở mã nguồn.
- Phần hiển thị (màn mở, lưới, QR, Back) chỉ kiểm được bằng mắt: chụp ở 4 bề rộng bằng Playwright có sẵn (API giả chỉ ở thư mục nháp, không vào kho).
- A4 do bộ kiểm K8 (`npm test`) đối chiếu hợp đồng — `PUT /pin`, `GET /voucher?all=1` đã có.

## Đường song song / luồng hợp lệ không bị chặn (K5)
- `?ma=` hợp lệ + đã đăng nhập → Ưu đãi, mã điền sẵn, KHÔNG tự gửi; chưa đăng nhập → đăng nhập xong mở Ưu đãi (`maCho` giữ trong state, không localStorage).
- Nhập tay mã chữ thường / có dấu cách hai đầu vẫn nhận (chuẩn hoá) — chặn chỉ khi sai dạng, báo lời rõ.
- Món `con_hang === null` hoặc có tồn → không hiện gì; món chưa có nội dung → vẫn có tên + giá + nhóm.

## E2 — vì sao không service worker
Tuần khai trương mà khách kẹt bản cũ (SW giữ cache) thì không có cách đẩy bản sửa tới điện thoại khách; app chỉ cần "thêm vào màn hình chính" nên manifest là đủ. Làm sau khai trương nếu cần chạy ngoại tuyến.

## Soát kế hoạch (4 câu, tự soát vì việc thường, không đụng tiền)
Ngoài phạm vi? Không: chỉ `src/`, `public/`, `index.html`, `package*.json`, bài thử, `viec/KH-UI-2/`. Cách ngắn hơn? Đã chọn A. Ca nghiệm thu thiếu bài thử? phần nhìn thấy → ghi chụp tay (F5/G3). Đường song song sót? `?ma=` + đăng xuất giữa chừng: `dangXuat` xoá `maCho`.
