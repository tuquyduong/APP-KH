# Đối chiếu demo — KH-UI-3a (hạng, ví, giá theo hạng, Giờ vàng, giờ hoạt động, nhãn khoá)

Ảnh ở `so_anh/`: `<khối>_<cỡ>_app.jpg` (app, đủ 360 / 390 / 430), `<khối>_390_demo.jpg` (demo, chỉ cỡ chuẩn 390), `<khối>_390_lech.jpg` (đỏ = lệch > 28/255 mỗi kênh), `bao_cao.txt` (% điểm lệch). Chromium + Playwright có sẵn, POS giả đúng hình dạng hợp đồng v2, cùng dữ liệu mẫu như demo (Chị Linh, hạng Vàng 10 %, ví 85.000đ, 1.250 điểm, 2 voucher; Giờ vàng 20:00–22:00 lúc 20:30; giá hạng theo công thức demo, đóng vai POS). Công cụ so ảnh để ở nháp (không vào kho). Mọi phần tử đo bằng `getBoundingClientRect`: kích thước khớp demo (vd ô Trang chủ 78,39 px cả hai bên); lệch 1 px ở ảnh Trang chủ là vị trí nửa điểm ảnh khi chụp.

Lý do khác demo: (a) dữ liệu POS chưa có / việc sau · (b) chữ / số mẫu của demo không dùng · (c) chưa có giỏ hàng / đặt đơn · (d) màn rộng · (e) token khẩu hiệu.

## Trang chủ
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Ô Giờ vàng (`hb-t-flash`: −50 %, "N món đang giảm", "Còn h:mm:ss"), chia hàng với ô Trắc nghiệm | đủ; `trangchu_o_gio_vang_va_trac_nghiem` | lệch ảnh 15 % chỉ do vị trí nửa điểm ảnh (cao 78,39 = 78,39; chữ / màu / biểu tượng đúng demo); Giờ vàng tắt → ô Trắc nghiệm giãn hết hàng (quy tắc `sec-off` của demo) |
| Chưa tới giờ: "Mở lúc 20:00"; hết khung | "Mở lúc HH:mm" / "Đã kết thúc" | demo: "Mai 20:00"; POS chỉ trả khung HÔM NAY (hợp đồng) nên app không hứa ngày mai — lý do (a) |
| Thẻ hội viên, dòng `tier` "Hạng Vàng" + số điểm | đủ; `trangchu_the_hang` | hạng `null` → không hiện dòng hạng (không bịa "Thường 0 %"); thẻ rộng cả hàng vì ô "Kế hoạch và nhắc việc" thuộc KH-UI-5b — (a); lệch ảnh 20 % chỉ vì khác bề rộng |
| (không có) dòng quán mở / đóng | một dòng nhỏ kiểu `.sub` dưới lời chào: "Quán đang mở cửa" hoặc nguyên văn `thong_bao` | demo không có chỗ này; phiếu F1 cho thêm MỘT dòng và ghi `## Phát hiện` để chủ quán duyệt chỗ đặt |
| Ô Trắc nghiệm khi chưa đăng nhập | nhãn khoá mới (H1) | xem mục "Ô khoá" |

## Menu
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Ô nhóm "Giờ vàng" (đèn lồng, chữ, nhãn "Còn h:mm" đỏ khi live) | đủ; `menu_o_gio_vang` | **lệch 0,00 %** |
| Thanh mini cuộn: biểu tượng Giờ vàng `cm.live` | đủ | — |
| Ô món: giá 3 hạng (`lad`) | đủ; `menu_o_mon_gia_hang` | bậc thang khớp từng chữ (Thường / Vàng đậm / Kim cương); số cột theo số hạng POS trả (demo cố định 3); khác ảnh: nền / biểu tượng nhóm và nhãn nhu cầu theo nội dung đã có từ KH-UI-2 (không phải việc này), nút ▶ video — (a) |
| Ô món Giờ vàng: nhãn `-50%` trên ảnh, nhãn "Giờ vàng −50 %", giá giảm + giá gốc gạch | `-X %` + "Giờ vàng −X %" (đỏ khi đang giảm; "… từ 20:00" khi ngoài giờ); giá hiện = giá gốc POS, KHÔNG số giảm | (a) POS chưa gửi giá Giờ vàng từng món (`## Câu hỏi` 1); **bỏ "còn N suất"** — (a) POS không đếm suất; không giá hạng khi đang Giờ vàng (hợp đồng) |
| Đầu khối Giờ vàng (`gv-head`): đèn lồng, "Giờ vàng cuối ngày", khung giờ, viên đếm ngược | đủ; `menu_dau_khoi_gio_vang` | dòng phụ "Hôm nay 20:00–22:00 · giảm 50 %" thay "Mỗi ngày … giảm đến 50 % · số suất có hạn" — (a) không suất, POS trả một % và khung hôm nay (nên thấp hơn demo 15 px: demo xuống 2 dòng); câu ghi chú cuối bỏ "Hết suất hoặc" |
| Khối "Bản demo · xem thử" (`gv-demo`), chuông báo Giờ vàng | KHÔNG đưa vào | phiếu E3; thông báo thuộc việc sau |

## Trang món
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Bậc thang lớn `ladd` + "Giá của bạn" | đủ; `trang_mon_gia_hang` | **lệch 0,23 %**; dòng "−10 %" dưới hạng khác bỏ (chỉ ô của khách có chữ) vì % món nhóm đặc biệt khác % thường, App không tự suy |
| Ghi chú Giờ vàng `gv-note` | đủ; `trang_mon_ghi_chu_gio_vang` | bỏ "còn 14 suất"; câu cuối đổi "Giá Giờ vàng áp khi thanh toán, không cộng thêm ưu đãi khác" (chưa có giá giảm để nói "giá đã giảm") — (a); nhãn `-X % Giờ vàng` trên ảnh như demo |
| Chọn cỡ / topping / giỏ | không | (c) / TOPPING-1 |

## Tài khoản
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Thẻ đầu: tên, "090 xxx 4567 · Hạng Vàng", 3 ô nhanh **Ví · Điểm · Voucher** | đủ; `taikhoan_the_dau` | lệch 1,37 % (chữ SĐT che giữa khác "0909 xxx xxx" mẫu — (b)); Ví = 0 hiện "0đ"; hạng `null` → chỉ SĐT; chưa có số ví → ẩn ô; ô Ví chưa bấm được (màn Ví thuộc KH-MUA-1) — (c) |
| Dòng "Ví & Thẻ quà tặng", "Gia đình" | không | (a) việc sau |

## Ô khoá (Trắc nghiệm ở Trang chủ) — sửa lỗi nhìn thấy (H1, H2)
Ảnh `trangchu_o_trac_nghiem_khoa_{nua_hang|ca_hang}_chu{100|130}_{360|390|430}_app.jpg`. Demo không có ô khoá (chủ quán chốt 29.10) nên không có ảnh demo — khác demo vì lý do (a): nhãn là một viên nền đặc (trắng + viền `--tq-line` của demo) nằm giữa ô, rộng tối đa 90 % ô, xuống dòng được; phần ô phía sau mờ `.3` (demo `.btn-disabled` là `.45`) để chữ của ô không lộ chồng lên nhãn. Bài thử đo trong Chromium (36 ca: 3 cỡ × nửa / cả hàng × chữ 100 % / 130 %): nhãn trọn trong ô, ≤ 90 % bề rộng, nền không trong suốt, ô không đổi kích thước. "Chữ 130 %" mô phỏng bằng cách phóng MỌI chữ trong ô 1,3 lần (cỡ px của demo không theo cài đặt máy).
