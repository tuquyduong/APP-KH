# KH-THE-2 — đối chiếu bản thiết kế 14.11 ↔ app

Nguồn chuẩn của việc này: **bản thiết kế chủ quán duyệt 14.11** (`viec/KH-THE-2/ban_thiet_ke.html`, các màn mẫu `.mh` 390 px) — phiếu chốt; màu / phông / bóng vẫn chỉ
lấy từ demo `thiet_ke/app_kh_demo.html` (K9). Ảnh: `viec/KH-THE-2/so_anh/<rộng>_<màn>_{thietke,app,lech}.png`; app chụp 360 / 390 / 430 × 844 (390 ×2), bản thiết kế
chỉ có khung 390 nên ảnh lệch chỉ ở 390. Công cụ: `viec/KH-THE-2/chup_anh.js` (Chromium + Playwright có sẵn, POS giả với đúng số của bản thiết kế: Hạng vàng 3 % / đặc biệt
4 %, gói 1 tháng 100.000 · 3 tháng 295.000; Kim Cương 10 % / 10 % chỉ cấp; 519 điểm, ví 180.600đ, chương trình "Học sinh giỏi"; đồng hồ 14.11.2026 20:30).
Lý do khác: (a) dữ liệu POS chưa có / khối việc sau · (b) chữ / số mẫu · (c) chưa có giỏ / đặt đơn · (d) màn rộng · (e) khẩu hiệu — và **(K9)** màu thiết kế không có
trong demo → màu demo gần nhất cùng vai trò (phiếu F2).

Số % điểm ảnh khác (390): xem mục "Số đo" cuối tệp. Bản thiết kế là mẫu HTML tự vẽ (phông Inter, khung `.mh` riêng), app vẽ bằng khung demo (thanh tab, phông / cỡ của demo)
nên khác điểm ảnh là chuyện bình thường; bảng dưới liệt kê khác về khối / chữ / màu.

## Màn 1 — Ưu đãi (chưa có thẻ)
| Khối bản thiết kế | App | Khác gì · lý do |
|---|---|---|
| Đầu "Ưu đãi của tôi" + nút QR | đầu màn của demo (`topbar`, NutQR) | — |
| Thẻ vàng dập ĐẦU trang: logo + "TỨ QUÝ ĐƯỜNG · Thẻ hội viên", nhãn "Chưa có thẻ", "Trở thành hội viên", tên hạng to, 2 chip, "Từ 100.000đ / tháng", nút "Xem & mua thẻ ›" | như thiết kế; nền = thẻ vàng dập của demo (`.tier-card` patch: `#F8E9BD … #EDD596` + hoa văn `/anh/the-vang-hoa-van.webp`) | Nút: thiết kế `#7A2647` (có trong demo) — giữ |
| Điểm / Số dư ví | như cũ (KH-HANG-2) — chỉ khi đã đăng nhập | Ảnh mẫu là khách chưa thẻ nhưng đã đăng nhập |
| Chương trình đặc biệt, Nhập mã | như cũ | Thiết kế đặt Chương trình trước Nhập mã — app giữ thứ tự cũ: Giờ vàng · Chương trình · điểm/ví · nhập mã… (phiếu E1: "các khối khác giữ nguyên thứ tự") |

## Thẻ ở Ưu đãi theo tình trạng (E2) — `*_the_{chua,co,sap,tang}_*`
| Trạng thái | App | Khác gì · lý do |
|---|---|---|
| Chưa có thẻ | như Màn 1 | Thiết kế bản thu nhỏ ghép "Giảm 3% · từ 100.000đ" một dòng; app dùng bản đầy đủ của Màn 1 (chip + giá) cho mọi chỗ — một khuôn |
| Đang có thẻ (> 7 ngày) | "Hạng của bạn", tên, "Giảm X% mọi đơn hàng", huy chương `m-medal-gold` của demo, "Hết hạn dd/mm/yyyy · còn N ngày", nút "Quyền lợi & gia hạn ›" (nền trắng mờ — bản vá nút thẻ vàng của demo) | **KHÔNG thanh tiến độ** — POS chưa trả ngày bắt đầu gói nên không biết "đã dùng bao nhiêu phần" (a); thẻ không làm mờ hoa văn riêng (`.mo-nhat` của thiết kế) — dùng nguyên thẻ vàng demo |
| Sắp hết hạn (0–7 ngày) | nhãn "Còn N ngày" / "Hết hạn hôm nay", câu "Gia hạn trước dd/mm…", nút đậm "Gia hạn ngay ›" | Nhãn đỏ: thiết kế `#A3381B` không có trong demo → `#AB3F37` (`--tq-red` của demo) (K9). Bóng nút `rgba(122,38,71,.3)` → `.25` (demo) (K9) |
| Hạng quán tặng | thẻ xanh = `l2` của demo (`#2C3E5E → #5B7FB8`), huy chương `m-medal-plat`, "Dành tặng khách thân thiết · không thời hạn", nút "Quyền lợi ›" | Bóng thẻ `rgba(44,62,94,.35)` → `.28` (demo) (K9). Hoa văn trên thẻ xanh: thiết kế có (mờ .18) — app tắt lớp nhiễu của thẻ vàng, giữ hoa văn `::after` của demo |

## Màn 2 — Hạng thành viên `/uudai/hang`
| Khối bản thiết kế | App | Khác gì · lý do |
|---|---|---|
| Đầu màn căn trái + dòng phụ tình trạng | `DauManCon … canTrai`; "Bạn đang ở giá thường" / "Bạn đang ở <hạng> · hết hạn dd/mm/yyyy" / "<hạng> · quán tặng[ · không thời hạn]" | — |
| "So sánh nhanh" + "Chạm một cột để chọn" | như thiết kế, NGAY dưới đầu màn | — |
| Bảng: cột nhãn 78 px · Thường · mỗi hạng; 4 hàng | như thiết kế (lưới CSS); hàng "Món nhóm đặc biệt" ẩn khi không hạng nào > 0; > 3 hạng → khung riêng cuộn ngang | Nền cột chọn: thiết kế `#FFF6E2 → #F7E3B6`; `#F7E3B6` không có trong demo → `#FFF1DC` (nền gói chọn `.ti-buy button.on` của demo) (K9). Cột không chọn: thiết kế Kim Cương `#F1F4FA` + viền `#D5DEEE`, Thường viền `#EFE3E7` → nền trắng + viền `rgba(215,185,129,.45)` (viền `.ti-ben` của demo) (K9). Chữ nhãn `#7C5F6B`, `#8E6F7B`, `#6E5260`, `#B5A3AB` → `var(--muted)` (K9); vạch `#EBDDE2` → `#F4E6EA` (K9) |
| Huy chương cột hạng | `m-medal-gold` (hạng bán) / `m-medal-plat` (chỉ cấp) chép NGUYÊN `<symbol>` của demo (`MedVe`, BieuTuong.jsx; gradient `gSv` của demo nhúng vì index.html chưa có) | — |
| Nhãn "Đang chọn" nổi đầu cột | như thiết kế (`#C38C40`, chữ trắng) | — |
| "Chọn gói <hạng>" + 2 nút gói, "Tiết kiệm 5.000đ" | như thiết kế (khuôn `.ti-buy` của demo) | — |
| Nút "Mua ngay · <hạng> 3 tháng" + giá bên phải | `.checkout-btn` của demo, chữ trái / giá phải | Thiết kế cao 56 px, bóng hồng — giữ cỡ nút của demo |
| "Trả bằng QR chuyển khoản · thẻ dùng được ngay" + biểu tượng QR | như thiết kế, biểu tượng `i-qr` của demo | — |
| Khối "<hạng> còn có": dòng cố định + quyền lợi POS | như thiết kế (khuôn `.ti-ben` của demo) | Dòng mẫu "Dòng quyền lợi chị nhập ở POS hiện ở đây" là chữ mẫu (b) — app hiện `quyen_loi[]` thật |
| Ghi chú cuối (cộng dồn / về giá thường) | như thiết kế | BỎ câu "Uống từ 2 ly/tuần…" (phiếu B4) |
| (không có) | — | Bỏ thẻ xám "Hạng hiện tại", hàng tab hạng, "Mua thẻ 1 tháng hoặc 3 tháng", bảng so sánh cũ cuối màn (phiếu B1) |

## Màn 3 — Thanh toán thẻ `/uudai/hang/thanhtoan?h=&thang=`
| Khối bản thiết kế | App | Khác gì · lý do |
|---|---|---|
| Đầu "Thanh toán" · "Thẻ hội viên" | như thiết kế | — |
| Thẻ tóm tắt: thẻ vàng mini, "Thẻ hội viên <hạng>", "3 tháng · hạn tới 14/02/2027", giá | thẻ vàng mini = `.points-card.pc-mini` của demo; "3 tháng"; giá = tổng báo giá POS | **KHÔNG "hạn tới"**: POS cộng nối khi gia hạn — App không tự tính hạn (phiếu C4); hạn mới hiện ở Màn 4 từ hoá đơn POS |
| Dòng xanh "Thẻ kích hoạt ngay…" + biểu tượng tia sét | khuôn `.nt-state.on` của demo + `IcoVe bolt` (demo `i-bolt`) | Nền / chữ xanh thiết kế `#EEF6EF` / `#2F5A36` không có trong demo → `#E9F6EE` / `#2E7A50` (`.nt-state.on` của demo) (K9) |
| "Cách trả tiền": MỘT lựa chọn "Chuyển khoản QR" (đã chọn) | thẻ trắng viền `--pink-dark` (như `.mode-opt.active` của demo), biểu tượng `i-qr`, dấu ✓ `i-check` | Nền ô biểu tượng `#FDEBF1` không có trong demo → `var(--line)` (K9) |
| Dòng khoá "Thẻ hội viên không trả bằng số dư ví…" + ổ khoá | chữ như thiết kế; biểu tượng `i-card` | Demo KHÔNG có biểu tượng ổ khoá — không vẽ mới (phiếu F2) → dùng `i-card` của demo |
| Bảng tiền "Tiền thẻ / Cần trả" | `BangTien` (báo giá POS): "Tiền hàng / Tổng cộng" | Chữ dòng tiền dùng chung với Thanh toán đồ uống (một khuôn) |
| Nút "Quét QR · 295.000đ" | như thiết kế | — |
| (thiết kế bỏ) "Hình thức nhận hàng", thẻ quầy, công tắc ví | không có | phiếu C3 / C4 |

## Màn 4 — Chào mừng hội viên (Theo dõi đơn chỉ thẻ, đã trả)
| Khối bản thiết kế | App | Khác gì · lý do |
|---|---|---|
| (không có đầu màn) | GIỮ `DauManCon` (nút quay lại + số đơn) | Chủ quán trả lời Q2 (14.11): giữ |
| Huy chương 96 px | `MedVe medal-gold` 96 px | Thiết kế có bóng `drop-shadow(0 6px 12px rgba(60,35,10,.3))` — màu không có trong demo, bỏ (K9) |
| "Chào mừng hội viên <hạng>!" + "Giảm 3% áp dụng ngay…" | như thiết kế | — |
| Thẻ vàng: logo, tên hạng, "Hạn tới 14/02/2027", "Đơn APP0042 · 295.000đ" | thẻ vàng dập của demo; hạn = `ghi_chu` POS NGUYÊN VĂN (vd "Hạn tới 14/02/2027" / "Hạn mới: …") | — |
| Nút "Đặt đồ uống ngay · đã giảm 3%" | "Đặt đồ uống ngay" → Menu | Phiếu D1 chốt chữ "Đặt đồ uống ngay" |
| Nút "Về giỏ · 2 món đang chờ" | "Về giỏ · N món" (chỉ khi giỏ còn đồ uống) | Phiếu D1 chốt chữ |
| Dòng nhỏ "Nút “Về giỏ” chỉ hiện khi giỏ còn đồ uống" | "Đồ uống bạn đã chọn vẫn còn trong giỏ" (chỉ khi có nút Về giỏ) | Dòng của thiết kế là ghi chú cho chủ quán, không phải chữ cho khách (b) — app ghi đúng ý cho khách; sửa được ở /admin (`the.cm.nho`) |
| Nền radial vàng nhạt `#FCEFD2` | nền chung `.screen` của app | màu không có trong demo (K9) |

## Màn cũ không đổi
- Giỏ hàng (chỉ đồ uống) và Thanh toán đơn đồ uống: trước (cây gốc `e7bc071`) ↔ sau — `*_cu_gio_*`, `*_cu_thanhtoan_*`. Số đo ở dưới.

## Số đo (điểm ảnh khác)
