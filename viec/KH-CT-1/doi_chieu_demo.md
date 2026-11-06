# KH-CT-1 — đối chiếu demo (`thiet_ke/app_kh_demo.html` patch39, màn `rewards`)

Ảnh App ở `so_anh/` (360 / 390 / 430; POS giả theo hợp đồng v9; do `cong_cu/thu_KHCT1.js` chụp khi đặt `LUU_ANH_DIR`):
`chua-dn_*` (chưa đăng nhập, 2 chương trình, có mô tả không dấu cách), `sinh-nhat_*` (sinh nhật hôm nay), `chua-nhap-ngay-sinh_*` (ngày sinh chưa nhập).
Demo không có ảnh chụp riêng cho khối này vì demo KHÔNG có khối "Chương trình đặc biệt". Chat App KH so ảnh lại lần cuối trước khi gộp.

## Ưu đãi (`rewards`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Banner Giờ vàng `.rw-ban` | giữ nguyên, khối mới nằm ngay dưới | không đổi |
| Thẻ voucher `.voucher` (`.strip`, `.body`, `.t`, `.s`, `.use`) | Mỗi chương trình một thẻ `.voucher`: `.t` tên, `.s` mô tả, `.use` "Áp dụng tại quán" | Khối mới = lý do (a) dữ liệu POS mới (v9 CT-1a); dùng lại đúng lớp của demo |
| Tiêu đề khối `.sec-head` | "Chương trình đặc biệt" | chữ theo phiếu (a) |
| Biểu tượng huy hiệu `Med` | `ticket` (sinh nhật), `card` (học sinh giỏi), `package` (khác), cỡ 36 | bộ biểu tượng sẵn có, không vẽ mới |
| — (demo không có) | Thẻ sinh nhật hôm nay: viền `--coral` + dòng chúc mừng `--forest` | (a); màu là biến của demo, K9 xanh |
| — (demo không có) | Dòng nhỏ gạch chân "Nhập ngày sinh ở Thông tin cá nhân…" | (a); bấm mở `/taikhoan/thongtin` |
| Thẻ hạng, điểm + ví, voucher, lịch sử điểm | không đổi | — |

CSS mới chỉ ở `src/giaoDien/chuong_trinh.css` (xuống dòng chữ dài `overflow-wrap:anywhere`, nhãn không co, khung thẻ sinh nhật).
