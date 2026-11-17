# KH-NAP-1 — đối chiếu demo / bản thiết kế 16.11 (Màn 1–5)

Chuẩn: `thiet_ke/app_kh_demo.html` (màu, phông, khối `.wallet-hero`, `.tx-item`, `.wallet-box`, `.sheet/.panel`) + cấu trúc trong `viec/KH-NAP-1/mau_de_xuat.js`
(bản thiết kế chủ quán duyệt 16.11). Ảnh 390 px: `viec/KH-NAP-1/so_anh/` (`sau/*.png` = App sau khi làm, chụp bởi `thu_KHNAP1.js` với `LUU_ANH_DIR`; `de_xuat_man<N>_1.webp` = ảnh đề xuất Màn N tách từ `ban_thiet_ke.html`).
Lý do khác: (a) dữ liệu POS chưa có / việc sau · (b) chữ / số mẫu của demo không dùng · (c) chưa có giỏ / đặt đơn · (d) màn rộng · **(TK)** theo bản thiết kế chủ quán duyệt 16.11.

## Màn 1 — Lối vào (Ưu đãi, Tài khoản)
| Khối demo / thiết kế | Đã làm | Khác gì · lý do |
|---|---|---|
| `.wallet-row` 2 ô Điểm / Số dư ví | giữ nguyên lớp demo + `vt-o` (căn giữa nội dung, hai ô cao bằng nhau) | — |
| Ô Số dư ví bấm được (TK) | cả ô là nút (`bam()`: role button, Tab, Enter) → `/uudai/vi`; viền `--line` mỏng để thấy bấm được | mẫu đề xuất dùng `#F0C9D7` (ngoài demo, K9) → `var(--line)` |
| Nút nhỏ "+ Nạp tiền" (TK, N4 a) | `.vt-nap` nền `--pink-dark` (mẫu `#B23D6B` = `--pink-dark`), chỉ khi `/goi-nap` có ≥ 1 gói | — |
| Tài khoản `.acc-q` ô Ví | ô Ví bấm được → `/uudai/vi` | — |

## Màn 2 — Ví của tôi (`/uudai/vi`)
| Khối | Đã làm | Khác gì · lý do |
|---|---|---|
| Đầu màn "Ví & Thẻ quà tặng" (demo) | "Ví của tôi" + dòng phụ (TK) | (TK); "Thẻ quà tặng", "Chuyển đổi điểm" của demo bỏ — (a) POS chưa có |
| `.wallet-hero` (demo: lavender → pink-dark) | `.vt-hero` chép nguyên khối `.wallet-hero` (bo 18, pad 20, vòng sáng `::before`, `.lbl` 11.5, `.amt` 30/700) | chuyển sắc `--pink-deep → --forest` (#7A2647 → #B23D6B) theo phiếu B6 thay cho mẫu `#7A2647/#B23D6B/#D0688F` (D0688F ngoài demo) |
| Nút trong ô (demo `.wallet-actions button`) | MỘT nút trắng "Nạp tiền" (TK) — màu chữ `--pink-deep` (mẫu `#7A2647` = `--pink-deep`) | (TK) |
| Dòng nhắc luật | `.vt-luat` 12px `--muted` | — |
| "Lịch sử giao dịch" `.tx-item` (demo) | "Lịch sử ví" (TK), dòng `.tx-item` của demo trong `card` | biểu tượng: demo `Med` (basket / gift / card) → `Ico` plus / minus / ví (index.html chưa có `m-wallet`, ngoài phạm vi); màu: vào `--mint-dark` (mẫu `#2F6B3A` ngoài demo), ra `--ink` (phiếu "− chữ thường"; demo `.amt.minus` coral) |
| Dòng nhỏ thưởng (TK) | `.vt-thuong` `--mint-dark` | mẫu `#2F6B3A` ngoài demo |
| "Xem thêm" (TK) | `ghost-btn` | — |

## Màn 3 — Bảng chọn gói
| Khối | Đã làm | Khác gì · lý do |
|---|---|---|
| `.sheet .panel` (demo) | `BangNoi` có sẵn (khuôn `.sheet/.panel` + thanh kéo + nút ✕) | thêm nút ✕ / vuốt của khuôn chung (KH-UI-5c) |
| Ô gói `.goi` (TK) | `.vt-goi`; chọn = viền `--pink-dark` | mẫu `#B23D6B` = `--pink-dark`; viền ô chưa chọn `#D9C3CC` (ngoài demo) → `--line`; bóng chọn `rgba(178,61,107,.16)` (ngoài demo) bỏ |
| Nhãn thưởng `+5.000đ` (N3 a) | `.vt-goi-thuong` chữ `--mint-dark` nền `--mint` pha trắng (`color-mix`, máy cũ: `--mint`) | mẫu `#2F6B3A/#E4F2E6` ngoài demo |
| Nút "Tiếp tục · trả …" | `checkout-btn`; chưa chọn → `btn-disabled` + "Chọn một gói để tiếp tục" | mẫu không vẽ trạng thái chưa chọn — chữ thêm (mục sửa được) |

## Màn 4 — Thanh toán nạp (`/uudai/vi/nap?goi=`)
| Khối | Đã làm | Khác gì · lý do |
|---|---|---|
| `card the-tom` (khuôn thẻ KH-THE-2) | ô `.vt-nap-ic` (chuyển sắc `--pink-deep → --forest`, biểu tượng ví của demo) thay tấm thẻ | mẫu "+" chữ → biểu tượng ví `i-wallet` của demo |
| Dòng xanh `nt-state on the-kich`, `tt-qr`, `the-khoa` | dùng lại nguyên lớp của Thanh toán thẻ | — |
| Bảng tiền (TK) | Tiền nạp / Tổng cộng / Vào ví sau khi trả (`vt-vao-vi` `--mint-dark`) | mẫu `#2F6B3A` ngoài demo |
| Không nhận hàng / công tắc ví / mã giảm | đúng | (c) |

## Màn 5 — Theo dõi đơn nạp + Đã nạp
| Khối | Đã làm | Khác gì · lý do |
|---|---|---|
| Các bước (`.tl-step` demo tracking) | 2 bước "Chờ thanh toán" → "Đã vào ví" | (TK) |
| `cm-dau` (khuôn Chào mừng) | ô số dư mới `.vt-hero.vt-moi` + nhãn `rgba(255,255,255,.2)` (có trong demo `.wallet-actions`) | mẫu `rgba(255,255,255,.22)` → `.2` (demo) |
| Tiêu đề / câu / nhãn đơn / 2 nút | đúng chữ thiết kế; số từ `/vi` + `/toi` | không có dòng `/vi` → tiêu đề chung (TK B5) |
