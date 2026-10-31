# KH-MUA-1 — đối chiếu demo (patch39) · Giỏ hàng, Thanh toán, Theo dõi đơn

Ảnh trong `so_anh/` (cùng cỡ 390×844, thêm 360 và 430): `demo_{cart,checkout,tracking}_{360,390,430}.png` (demo, đã bỏ màn mở; checkout chọn
"Lấy tại quầy"; tracking chế độ lấy tại quầy, bước 3) · `app_{giohang,thanhtoan,don}_{360,390,430}.png` (app: đã đăng nhập, POS giả, cờ DAT_ONLINE BẬT
trong gói của bài thử) · `lech_*` = ảnh tô đỏ chỗ khác điểm ảnh (chụp bằng công cụ nháp, Chromium có sẵn).
Dữ liệu mẫu KHÁC demo ở chủ ý: giỏ có một món hết hàng + ghi chú dài (ca thử tràn chữ), số tiền của POS giả — nên ảnh lệch phần lớn ở chữ / số.

CSS các màn: `src/giaoDien/demo_mua.css` chép NGUYÊN 60 luật từ demo (thứ tự cascade). Chỗ demo viết inline → `giaoDien.css` cùng số đo.
Biểu tượng demo chưa có trong `index.html` (nhA-kim, p-basket, m-store, m-scooter, i-store, i-bell, i-flag, i-cat-coffee + gradient e-kim, e-lav) →
chép nguyên vào `src/noiDung/bieuTuongMua.js`, vẽ một lần.

## Thanh tab
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| 5 tab: Trang chủ · Menu · Giỏ hàng (`nhA-kim`, `--c:#7C8696`) · Ưu đãi · Tài khoản | y demo | — |
| (demo không có số món trên tab) | viên số nhỏ `.tab-so` khi giỏ có hàng (biến màu demo `--coral`, `--white`) | **Khác demo** — phiếu A1 / E6.1 đòi; ghi `## Câu hỏi` Q1 |

## Trang món (detail) — phần thêm giỏ
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Kích cỡ / Mức đường / Nhiệt độ / Thêm topping | không làm | (a) POS chưa có cửa — TOPPING-1, COMBO-1a |
| "Ghi chú cho quán" + ô `note-in` | có, tối đa 100 ký tự | chữ mẫu "VD: ít ngọt hơn…" (bỏ "để riêng topping" — (a) chưa có topping) |
| `detail-qty-row` Số lượng − n + | y demo | — |
| `detail-addcart` "Thêm vào giỏ" + số tiền → (hết: "Hết hôm nay") | y demo; hết hàng → "Hết hàng" + mờ | số tiền = giá một ly × số lượng (chỉ hình dung, phiếu A5); chữ "Hết hàng" như ô món của app |
| bấm → thông báo "Đã thêm … vào giỏ" + sang Giỏ hàng | y demo | — |
| (ô món `prodCard` của demo KHÔNG có nút thêm giỏ) | không thêm nút trên ô món | đúng demo; phiếu A2 ghi "ô món theo demo" — `## Câu hỏi` Q2 |

## Giỏ hàng (cart)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| topbar "Giỏ hàng" + "n món" | y demo | — |
| `cart-item`: ảnh món, tên, dòng tuỳ chọn, giá hội viên + giá thường gạch, `qty-ctrl` | ảnh / tên / `qty-ctrl` y demo; dòng `cart-opt` chỉ có ghi chú (và "Hết hàng" / "Không còn trong menu") | (a) chưa có cỡ / đường / topping; giá: MỘT số = giá một ly theo hạng × số lượng (phiếu A5 — không tự tính giá giảm) |
| `gv-note warn` "Giờ vàng đã kết thúc…" | không làm | (a) giỏ không lưu giá nên không biết món từng ở Giờ vàng; POS báo giá thật |
| `promo-box` ô mã + "Áp dụng" (bấm → "✓ Đã áp dụng") | ô + nút như demo; mã gửi trong báo giá; nút LUÔN "Áp dụng" — kết quả là dòng "Giảm giá" trong bảng tiền POS | **Khác demo** (demo đổi chữ "✓ Đã áp dụng" ngay khi bấm): phiếu B4 kết quả lấy từ bao-gia, POS chưa nói `loai` nào là của mã — `## Câu hỏi` Q9; | (b) không chữ mã mẫu "TQD8ZU6L5" |
| `card` Tiền hàng / Ưu đãi hạng / Giảm voucher / Phí giao / Tạm tính | các dòng lấy NGUYÊN từ báo giá POS (Tiền hàng · Giảm giá · Phí giao khi > 0 · Tổng cộng); chưa có báo giá → "Tổng tiền sẽ hiện khi quán xác nhận" | phiếu A5 / E2 (App không tính tiền); cờ DAT_ONLINE tắt → luôn dòng chờ |
| `checkout-btn` "Tiếp tục · chọn cách nhận hàng" + số tiền → | y demo; số = tổng POS; giỏ có món hết → mờ, không bấm | — |
| `empty-cart` (p-basket, "Giỏ hàng đang trống", "Chọn một món trà hợp tiết trời hôm nay nhé", "Xem Menu") | y demo | — |

## Thanh toán (checkout)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| topbar ← "Thanh toán" / "Chọn cách nhận hàng & trả tiền" | y demo | — |
| `mode-row`: Giao tận nơi "Giao qua GHN" · Lấy tại quầy "Miễn phí giao · ~8 phút" | Giao tận nơi "Giao qua Ahamove · Sắp có" MỜ, không bấm; Lấy tại quầy mặc định "Miễn phí giao" | (b) Ahamove không GHN; (a) giao là KH-MUA-2; bỏ "~8 phút" (b số mẫu) |
| khối giao: địa chỉ, `ship-box` GHN, ghi chú tài xế, thời gian giao | không làm | (a) KH-MUA-2 / v3 địa chỉ — `## Câu hỏi` Q3 |
| khối tại quầy: "Quán Tứ Quý Đường", "Đơn sẽ sẵn sàng sau khoảng 8 phút. Khi tới quầy, bạn đọc số đơn…" | y demo, bỏ câu "8 phút" | (b) số mẫu |
| "Cách trả tiền": Ví nội bộ (ô tích) + phần còn lại chọn VNPay / MoMo / ZaloPay / Chuyển khoản / Trả tại quầy | hai hàng `opt-row` + `rdo`: "Chuyển khoản QR (payOS)" (mặc định) · "Ví nội bộ — Số dư …" (thiếu → mờ + "còn thiếu …") | phiếu B3: chỉ QR payOS + ví; trả một phần ví + QR chưa làm (`## Câu hỏi` Q4); không VNPay/MoMo/ZaloPay/tại quầy |
| `card` Tiền hàng / Giảm / Phí giao GHN / TQD hỗ trợ / Tổng / Trừ ví / Còn phải trả | Tiền hàng / Giảm giá / Phí giao (khi > 0) / Tổng cộng — NGUYÊN số POS | (a) POS chưa có "hỗ trợ phí", ví trả toàn phần nên không dòng "trừ ví / còn phải trả" |
| `checkout-btn` "Xác nhận trả …" → | y demo; ngoài giờ → mờ + câu `thong_bao`; cờ tắt → "Đặt online sắp mở — mời bạn đặt tại quầy" | phiếu B6, D2 |
| trả ví → bảng PIN (PATCH29) | `PinSheet` chế độ nhập một lần | — |
| `demo-aid` "giả lập GHN lỗi" | không làm | chỉ để xem demo |

## Theo dõi đơn (tracking)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| topbar ← "Đơn #…" / "Lấy tại quầy · đặt lúc …" | "Đơn #<ma>" / "Đặt lúc <giờ VN của POS>" | (a) `GET /don/:ma` chưa trả cách nhận |
| `eta-card` "Dự kiến sẵn sàng ~8 phút" | không làm | (a) POS không trả giờ dự kiến |
| `pick-num` "Số đơn của bạn — đọc cho nhân viên" + "#42" | y demo, số = mã đơn POS | — |
| (demo không có màn QR) | đơn chờ trả: mã QR `khung-qr` (VeQR của ManQR) + "còn m:ss", hết hạn → "Tạo mã mới" | phiếu B7 |
| `map-box`, `driverCard` | không làm | (a) KH-MUA-2 |
| `tl-step` các bước (Đã thanh toán · Đang pha chế · Sẵn sàng · Đã nhận) | `tl-step` theo `tien_trinh`: Chờ thanh toán · Đã thanh toán · Quán đang pha chế · Sẵn sàng — mời bạn ra quầy nhận (giao: Đang giao · Đã giao; huỷ: Đã huỷ) | phiếu C1 (bước của POS); không bước "Đã nhận hàng" (POS không có trạng thái này) |
| "Chi tiết đơn" `cart-item` + `card` tóm tắt tiền | `cart-item` từ `mon[]` + thẻ "Tổng cộng" (số POS) | (a) POS không trả từng dòng tiền của đơn |
| `rateCard` đánh giá sao | không làm | (a) việc đánh giá ở luồng khác (DANH_GIA_GOOGLE) |
| "Hủy đơn" (ghost, cam) | "Huỷ đơn" chỉ khi `cho_tra`; đã trả → "Gọi quán để huỷ" (ẩn khi chưa có số ở `lienHe.js`) | phiếu C2 |
| "▶ Chạy thử diễn biến đơn" | không làm | chỉ để xem demo |

## Lịch sử đơn (orderhistory)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| nút `reorder-btn` "Đặt lại" ở mỗi thẻ đơn | như demo nhưng CHỈ khi cờ DAT_ONLINE bật (soát vòng 1: hợp đồng v2 chưa có `mon[].ma`, bật sớm thì báo sai "không còn bán"); đọc chi tiết đơn, bỏ món theo `ma` vào giỏ, món không còn → thông báo "… không còn bán, đã bỏ qua" | `mon[].ma` chưa có trong hợp đồng v2 — `## Câu hỏi` Q5 |
