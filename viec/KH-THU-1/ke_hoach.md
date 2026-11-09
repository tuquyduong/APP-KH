# Kế hoạch KH-THU-1 — rút thời gian bài thử, báo "quá giờ"

## Phương án
| Phần | A (chọn) | B | Lý do chọn |
|---|---|---|---|
| Chờ cố định `waitForTimeout(N)` | Hàm `yen(t)` trong từng bài: đếm yêu cầu mạng giả đang bay (bọc `route`), chờ tới khi hết yêu cầu + 2 khung vẽ, lặp tới khi ổn định | Giảm số ms | A đúng theo điều kiện, không dựa số may rủi. ~+8 dòng/bài, −vài chục lần chờ |
| Chờ bằng giờ thật của app (3 s, 10 s, 600 ms gộp, 5 s chống dồn, 4,2 s) | `t.clock.fastForward(...)` (đồng hồ giả đã cài sẵn ở mọi ca) | Chờ thật | A: phiếu cho phép "đồng hồ giả thay chờ thật" |
| POS giả "trễ" bằng `setTimeout` thật (KHHANG2) | Cổng `S.cuaGio` — giữ /gio-hoat-dong tới khi ca gọi `S.moGio()` | Giảm số ms trễ | A xác định, không đua giờ |
| Dùng chung trình duyệt | Đã có sẵn ở mọi bài (một `chromium.launch`, mỗi ca một context) — giữ nguyên, không gộp context vì ca cần kho riêng | Gộp một trang | B làm lẫn localStorage giữa ca → đổi hành vi |
| `kiem_tra_truoc_khi_giao.js` (A4) | `Date.now()` quanh `spawnSync`, `ETIMEDOUT`/`signal` → dòng "QUÁ GIỜ 120 giây (máy bận? chạy riêng: …)" + in "· N s" | — | ≤ 15 dòng; trần 120 000 giữ nguyên |

## Ca thử ↔ nghiệm thu
- A1: bảng TRƯỚC/SAU mỗi bài (`npm test` in số giây từng bài sau A4) → `trang_thai.md`.
- A2: `SỐ CA` trước = sau cho 8 bài (đếm có và không có Chromium); không đổi lời `k(...)`.
- A3: chạy cùng lúc 3 bài lâu nhất, mỗi bài xanh ≤ 80 s.
- A4: tự thử bằng ca hỏng giả: bài ngủ > trần (không thêm file — đo bằng đọc mã + chạy thử thủ công ở nháp, ghi vào `trang_thai.md`).
- A5: `npm test` tổng trước/sau, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`).

## Canh đường song song / không chặn oan
- Chờ yêu cầu bay: yêu cầu bị `abort`/treo (`return undefined`) vẫn giảm bộ đếm khi hàm xử lý trả về → không kẹt.
- Báo giá gộp 600 ms (`MS_GOP`) là hẹn giờ trong app: ca nào cần kết quả báo giá thì `fastForward(650)` rồi `yen`.
- Bài không sửa: KHMUA1b (37 s ≤ 40 trên máy rảnh) — để nguyên.
