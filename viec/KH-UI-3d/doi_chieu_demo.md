# KH-UI-3d — đối chiếu demo (patch39) ↔ app

Ảnh ở `so_anh/`: `demo_*_390.png` (demo, 390×844) và `ung-dung_*.png` (app, POS giả, Chromium). Cùng dữ liệu mẫu (hạng Vàng 10%, hết hạn 15/11/2026, 1.250 điểm, ví 85.000đ).
Ảnh app chạy với POS giả nên ảnh tĩnh (logo, hoạ tiết thẻ vàng `/anh/*.webp`) KHÔNG tải — ô logo vỡ trong ảnh là do bài thử, bản thật có ảnh.
Còn thiếu: ảnh 430 và ảnh tô chỗ lệch — chưa làm (ghi ở CHƯA KIỂM của `trang_thai.md`); chat App KH so lại lần cuối.

## Ưu đãi (`#rewards`, demo `rewards`)
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Tiêu đề "Ưu đãi của tôi" + nút QR | Đã đăng nhập: giống demo | Vãng lai: "Ưu đãi" — (a) chưa phải "của tôi" |
| Banner `rw-ban` (Giờ vàng) | Có, CSS chép nguyên (`rw-*`) | (b) bỏ chữ mẫu "Ưu đãi tháng này / Giờ vàng mỗi tối giảm đến 50%": chữ = "Giờ vàng · Còn …" + khung giờ + `giảm {phan_tram}%` của POS. Ẩn khi POS không có Giờ vàng hoặc đã hết khung. Không ảnh nền (demo chỉ có khe CMS) |
| Thẻ hạng `tier-card` | Có, nền vàng dập như `points-card` (cùng luật gộp của demo) | (a) bỏ huy hiệu hạng (sprite `m-medal-*` chưa có trong `index.html`, POS không trả loại huy hiệu) và nút "Quyền lợi & nâng hạng ›" (chưa có màn). "Giảm 10% mọi đơn hàng" → "Giảm 10% món thường · nhóm đặc biệt 5%" vì POS có hai mức. Vãng lai / `hang: null`: thẻ "Hạng thành viên" liệt kê các hạng của `/hang` |
| Sưu tập Tứ Quý | — | (a) VIỆC SAU (P3b), chưa có dữ liệu POS |
| `wallet-row` Điểm + Số dư ví | Có, giống demo | Vãng lai: thay bằng thẻ khoá `TheMoi` "Đăng nhập để xem điểm, ví và voucher" (phiếu B2). POS không trả `so_du_vi` → ẩn ô ví |
| Ví voucher | Có (đã có từ trước), chỉ khi đăng nhập | — |
| Kho quà đổi điểm | — | (a) P3b |
| Nhập mã trên hoá đơn, Lịch sử điểm | Có (đã có từ trước), chỉ khi đăng nhập | Demo không có — thêm ở KH-XEM-1, giữ nguyên |

## Thông tin cá nhân (`profile`)
| Khối | Đã làm | Khác gì |
|---|---|---|
| Nút xưng hô `TITLES` | `anh · chị · cô · chú · bác · em · bạn` chữ thường | Demo có 6 nút (thiếu "bác"): app giữ 7 theo hợp đồng v3 |
| Xem trước | “Chào buổi tối, **anh** Linh!” | Bọc trong một `<span>` để "!" không bị tách bởi `gap` của flex |

## Đầu Trang chủ (`home`)
| Khối | Đã làm | Khác gì |
|---|---|---|
| Lời chào `h1` | "Chào buổi tối, chị Linh!" / "Chào bạn!" | (b) chữ lấy từ POS (giờ, xưng hô, tên) — văn phong chủ quán chốt 31.10 |
