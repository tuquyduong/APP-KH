# KH-XEM-1 — đối chiếu demo (patch39)

Ảnh app ở `so_anh/` (390 / 360 / 430). Demo KHÔNG có màn Đăng nhập, thẻ mời, menu-401 → các khối này dựng bằng khối demo (xem cột Khác).
Chưa có ảnh demo ghép cạnh: chat App KH so lại lần cuối trước khi gộp (xem `## Chưa kiểm` trong trang_thai.md).

## Trang chủ chế độ khách (`1_trang_chu_khach_*.png`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| topbar (lời chào + QR) | "Chào bạn" + dòng phụ + nút QR | chưa có tên → "Chào bạn" (A2) |
| `points-card` (thẻ vàng, logo, hoạ tiết) | `TheMoi`: cùng `points-card pc-mini`, logo, hoạ tiết | thay số điểm bằng chữ mời + nút "Đăng nhập" — (a) khách chưa có dữ liệu riêng |
| hero-banner / nhu cầu / món nổi bật | như khi đã đăng nhập | không đổi |

## Menu khi `/menu` 401, chưa có bản lưu (`2_menu_401_*.png`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| topbar, ô tìm | giữ | — |
| lưới nhóm + món | thay bằng thẻ mời "Đăng nhập để xem menu và giá" (dáng `points-card`) | (a) POS chưa mở /menu cho khách; tự hết khi POS xong |

## Đăng nhập / Đăng ký (`3_…buoc1`, `4_…buoc2`, `5_…buoc3`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| (demo chưa có màn riêng) `pf-card`, `otp-in`, `checkout-btn`, `nt-state`, `otp-re` | 3 bước theo phiếu A6 + hợp đồng v3; ✕ dùng `back-btn` | demo không có màn này — dựng bằng khối demo; chip xưng hô là lớp `.xh` mới ở `giaoDien.css` (chỉ dùng biến màu demo) |
