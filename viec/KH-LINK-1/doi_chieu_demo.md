# Đối chiếu demo — KH-LINK-1

Việc này KHÔNG đổi dáng màn nào có trong demo; chỉ thêm 2 màn nhỏ chưa có trong demo và 1 thành phần khoá. Ảnh app ở `so_anh/` (390 px; 360 / 430 chạy cùng kịch bản, kết quả ở `trang_thai.md`). Ảnh demo ↔ app của Trang chủ khách đã so ở KH-XEM-1 và không đổi file giao diện nào của Trang chủ.

## Trang chủ khách (B1)
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Lời chào + QR | "Chào bạn" + nút QR | không đổi so với KH-XEM-1 |
| Thẻ điểm | Thẻ vàng mời đăng nhập (`TheMoi`) | (a) khách chưa có điểm |
| Banner / Nhu cầu / Món nổi bật | hiện như khi đã đăng nhập, khối trống vì thiếu nội dung / dữ liệu thì ẩn như hội viên | không khác |
| Ô Trắc nghiệm, Kế hoạch và nhắc việc | chưa có (VIỆC SAU KH-UI-5a / 5b) | (a) — khi thêm sẽ bọc `KhoaTienIch` |

## KhoaTienIch (B2) — ô khoá
| Khối | Đã làm | Khác gì, lý do |
|---|---|---|
| Ô bị khoá | giữ nguyên ô, `opacity:.45` (chép `.btn-disabled` của demo), không thêm màu | — |
| Biểu tượng khoá | ký tự 🔒 (demo dùng 🔒 ở nhiều chỗ) | không vẽ SVG mới |
| Dòng "Đăng nhập để mở khoá chức năng" | chữ 11.5 px / 600, `var(--ink)` | chữ do phiếu quy định; kiểu chữ theo nhãn nhỏ của demo |

## Không tìm thấy trang / món
| Khối | Đã làm | Khác gì, lý do |
|---|---|---|
| (demo không có màn này) | topbar `h1` + khối `nt-state` (biểu tượng cảnh báo) + nút `checkout-btn` | dựng bằng khối có sẵn của demo; màn này phiếu bắt buộc, demo chưa có |

## Màn Món / Đăng nhập khi mở bằng đường dẫn
Dùng nguyên `TrangMon`, `TheMoi`, `DangNhap` đã có; không đổi dáng.
