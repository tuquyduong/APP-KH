# KH-MUA-1b — đối chiếu demo (patch39) · khối mới của Thanh toán, Theo dõi đơn, Lịch sử đơn, Giỏ

Ảnh trong `so_anh/` (cỡ 360 / 390 / 430 × 844, POS giả, đã đăng nhập; chụp bằng công cụ nháp + Chromium có sẵn, không thêm vào `package.json`):
- `app_<khối>_<cỡ>.png` — App. Khối: `thanhtoan-vi-tat`, `thanhtoan-vi-du`, `thanhtoan-vi-qr`, `pin`, `mang-cham`, `chua-ro`, `don-cho-tra`, `dang-kiem`,
  `gia-doi`, `dem-nguoc-429`, `theodoi-vi-qr`, `lichsu-nhan`.
- `demo_<màn>_<cỡ>.png` — demo cùng cỡ: `checkout`, `notif` (Cài đặt thông báo — khuôn `.switch`), `tracking`, `orderhistory`.
- `lech_<khối>_<cỡ>.png` — ảnh tô đỏ điểm ảnh khác giữa app và màn demo gần nhất (dữ liệu khác chủ ý: số tiền POS giả, đơn thật của khách).
Không thêm màu / phông / bóng mới: mọi lớp dùng đã có trong `src/giaoDien/` hoặc chép NGUYÊN từ demo (K9 của bộ kiểm canh màu, phông).

## Thanh toán (checkout)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| "Cách trả tiền" (ảnh `demo_checkout-tra_*`): `opt-row` ô tích "Ví nội bộ" (Số dư · dùng …), "Phần còn lại … — chọn 1 cách", `opt-row` + `rdo` VNPay / MoMo / ZaloPay / Chuyển khoản QR; bảng tiền có "Trừ Ví nội bộ / Còn phải trả" | MỘT công tắc **"Trừ từ số dư ví"**: khuôn `.notif-row` + `.switch` của demo (màn Cài đặt thông báo, dòng 326–333: hàng trắng bo 14px, bóng `rgba(26,54,93,.08)`, công tắc bật `--pink-dark`) — CSS chép nguyên vào `demo_mua.css`. Dòng phụ: "Số dư …", "Số dư … — đủ trả cả đơn", "Dùng hết … trong ví, còn thiếu … → quét QR". Ví 0đ → ẩn. Dưới là hàng "Chuyển khoản QR" cùng khuôn `.notif-row` + biểu tượng `i-qr` (`ico-mint`) — ẩn khi trả đủ bằng ví | **Khác demo** — chủ quán điểm 7 (02.11) thay ô tích + nhiều cổng bằng MỘT công tắc; VNPay / MoMo / ZaloPay không có (c)/(b): POS chỉ có QR ngân hàng. Không hiện "Trừ ví / Còn phải trả" trước khi đặt: số thật (`giu_vi`, `con_lai`) do POS trả sau khi đặt (phiếu E1 — App không tính tiền) |
| (demo không có) bảng PIN khi trả ví | `PinSheet` có sẵn (khuôn PATCH29 của demo: chấm tròn + bàn phím) | — |
| (demo không có) "Lần đặt trước chưa rõ kết quả" | khuôn mới theo **thẻ cảnh báo `.nt-state` của demo** (dòng 1454–1456: nền `#FFF1E8`, chữ đậm + dòng nhỏ `small`, biểu tượng `i-warning`) + **thẻ `.card.bang-tien`** (dòng món ×SL, "Tổng cộng") + nút chính `checkout-btn` "Gửi lại đúng đơn này →" + nút phụ `ghost-btn` "Xem Lịch sử đơn" (quá 24 giờ thêm "Bỏ qua, đặt đơn mới") | (c)/(d) phiếu D2–D3, chủ quán điểm 2 |
| (demo không có) "Bạn có đơn #… đang chờ trả" | `.nt-state` + `checkout-btn` "Tiếp tục trả đơn … →" + `ghost-btn` "Huỷ đơn đó" (đang huỷ → `btn-disabled`) | phiếu D3(b) |
| (demo không có) "Mạng chậm, đang gửi lại…" | chữ trên nút đặt (`checkout-btn btn-disabled`) + `.nt-state` "Mạng chậm, đang gửi lại… · Bạn chờ chút nhé, không cần bấm lại." | phiếu D2, chủ quán điểm 4 |
| (demo không có) "Đang kiểm tra đơn trước…" | chữ trên nút đặt (`btn-disabled`) — trang hiện ngay, không màn chờ | chủ quán điểm 3 |
| (demo không có) "Giá vừa thay đổi" | `.nt-state` "Giá vừa thay đổi, mời bạn xem lại"; bảng tiền thay bằng `bao_gia` POS trả | phiếu D1 `GIA_DA_DOI` |
| (demo không có) đếm ngược 429 | nút `btn-disabled` "Thử lại sau N giây" + `.nt-state` lời POS | phiếu D1 `QUA_NHIEU_LAN` |
| lỗi khác (hết hàng, ngoài giờ, PIN…) | `.nt-state` lời POS; hết hàng thêm `ghost-btn` "Về giỏ hàng"; chưa có PIN thêm `ghost-btn` "Đặt mã PIN" | phiếu D1 |
| nút "QR (payOS)" | chữ "Chuyển khoản QR" — không tên nhà cung cấp | phiếu E2 |

## Theo dõi đơn (tracking)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| (demo tracking không có QR trả tiền) | QR + chú thích `.care-disclaimer.qr-chu` (đã có từ KH-MUA-1) | QR đọc từ `GET /don/:ma` (F1) |
| (demo không có) "Đã giữ … trong ví · quét QR …" | khuôn mới theo **chú thích dưới QR** của app (`.care-disclaimer.qr-chu`, căn giữa, số đậm `b`), ngay dưới chú thích QR | phiếu F2; máy khác (không bản ghi) → ẩn (Q1 duyệt) |
| (demo không có) "Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn." | `.nt-state` | phiếu F3 |

## Lịch sử đơn (orderhistory)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| nhãn `order-status` `done` / `shipping` / `cancelled` (dòng 399–401) | "Chờ thanh toán" = `shipping` (CSS chép nguyên dòng 400 vào `demo_1.css`), "Đã thanh toán" = `done`, "Đã hủy" = `cancelled` | đơn App đọc `tien_trinh` (v5: `trang_thai` / `thanh_toan` = null) |

## Giỏ hàng (cart)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| nút mã "Áp dụng" → "✓ Đã áp dụng" (dòng 2020) | "✓ Đã áp dụng" khi báo giá POS có dòng `loai: ma_giam` cho đúng mã đang nhập | trước đây luôn "Áp dụng" (chưa biết `loai`) — v5 đã có |
| dòng giảm "Giảm giá (voucher)" (2085), "Ưu đãi hạng …" (3515), nhãn "Giờ vàng" (3507) | tên dòng theo `giam[].loai`; loại lạ → "Giảm giá" | phiếu C6 |
| (demo không có) lỗi mã | `.nt-state` với `ma_giam_loi.error` ngay dưới ô mã | phiếu C6 |
