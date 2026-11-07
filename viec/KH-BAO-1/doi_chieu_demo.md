# KH-BAO-1 — đối chiếu demo

Demo `thiet_ke/app_kh_demo.html` (patch39) không có dải "Đơn đã sẵn sàng" ở mọi màn — đây là quyết định 03.11 (QUYET_DINH_APPKH.md) → lý do (a)/(chủ quán chốt), không phải màn mới.
Ảnh 360 / 390 / 430 ở `so_anh/` (chụp bằng Chromium + POS giả của `thu_KHMUA1b.js`, cùng dữ liệu mẫu).

## Dải báo đơn xong (mọi màn)
| Khối | Demo | Đã làm | Khác gì, lý do |
|---|---|---|---|
| Khung dải | `.nt-state.on` (nền #E9F6EE, chữ #2E7A50, viền rgba(46,122,80,.25)) | dùng lại nguyên lớp `nt-state on`, thêm `.bao-don` chỉ cho bố cục (`order:-1` trong `.phone`, lề 8/12 px) | không màu / phông mới — K9 xanh |
| Biểu tượng | `Ico check` | `Ico check` 18 px | giống |
| Chữ | — | "Đơn #<mã> đã sẵn sàng — mời bạn ra quầy" | quyết định 03.11 (khối không có trong demo) |
| Nút | — | "Xem đơn" (chữ gạch chân, ≥ 36 px) + ✕ (`Ico close`, 36×36) | quyết định 03.11 |
| Tiếng | demo chỉ có nhạc màn mở (`man_dau.mp3`, dài) | KHÔNG phát tiếng; chỉ rung `navigator.vibrate` | phiếu: "nếu demo có sẵn âm thanh dùng lại được" — không có tiếng ngắn |
| Giới hạn | — | `GET /don` chỉ trang 1 (20 đơn): đơn đang chạy bị đẩy khỏi trang 1 thì không được báo | chấp nhận (hiếm); báo khi App đã tắt: sau khai trương (KH-TB-1) |

## Theo dõi đơn
| Khối | Demo | Đã làm | Khác gì |
|---|---|---|---|
| Số đơn to + các bước | tracking | giữ nguyên | — |
| Dòng nhắc | — | `.care-disclaimer.qr-chu` "Giữ App mở để được báo khi đồ uống xong" (chỉ `da_tra` / `dang_lam`) | quyết định 03.11 |
| Đơn xong | — | `.nt-state.on` "Đơn đã xong — mời bạn ra quầy" | quyết định 03.11 |
| Chi tiết đơn | danh sách món + tổng | tờ hoá đơn POS (`.order-card` + `HoaDonKhach`) khi POS trả `hoa_don[]`; rỗng → như cũ; dòng `ghi_no` không vẽ | (a) dữ liệu POS; CLAUDE.md §5 |

## Thanh toán
Công tắc "Trừ từ số dư ví" giữ nguyên hình; chỉ đổi trạng thái ban đầu (bật sẵn khi máy nhớ '1' VÀ ví bật được). Nút gửi lại khi `DAT_ONLINE` tắt hiện "Đặt online sắp mở — mời bạn đặt tại quầy" (khoá).
