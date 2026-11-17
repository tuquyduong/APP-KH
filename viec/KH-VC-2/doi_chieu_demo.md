# KH-VC-2 — đối chiếu bản thiết kế (Màn 6–7) ↔ App

Ảnh (390×844, Chromium có sẵn, dữ liệu mẫu như mẫu đề xuất): `so_anh/de_xuat-man6-uudai.png`, `so_anh/de_xuat-man7-gio.png` (chụp từ `ban_thiet_ke.html`);
App: `so_anh/sau/*.png` (sau) · `so_anh/truoc/*.png` (gốc b6f66e6 cùng bài thử). Ảnh "trước" của Giỏ / Giỏ chọn tay không có: trên gốc bài thử dừng ở ca đầu
(không có mục voucher để chờ) — Giỏ gốc = Giỏ không mục voucher (xem ảnh Giỏ của `thu_KHMUA1b` / `thu_KHND3b`).
Lý do khác: (a) dữ liệu POS chưa có / việc sau · (b) chữ / số mẫu · (c) chưa có giỏ / đặt đơn · (d) màn rộng · (e) khẩu hiệu — và (K9) màu mẫu không thuộc bảng demo.

## Màn 6 — Ưu đãi › Ví voucher (`so_anh/sau/uudai-vi-voucher-390*.png`, `uudai-xem-tat-ca-390*.png`, `uudai-nhan-khach-moi-390*.png`)
| Khối trong thiết kế | Đã làm | Khác gì · lý do |
|---|---|---|
| Thẻ: tên = câu POS (`mo_ta`) 2 dòng | `.voucher .t` = `mo_ta` nguyên văn | — |
| Chip nguồn (Khách mới / Đổi điểm / Giới thiệu bạn) | `.vc-chip`, chữ sửa được `ud.vc.nguon.*`; nguồn lạ → không chip | nền chip `var(--line)` thay `#FBE7EE` (K9) |
| Ô mã nét đứt | `.vc-ma` | viền `var(--muted)` thay `#D9C3CC` (K9) |
| Nút "Dùng ngay" | `button.use.vc-nut` → Giỏ hàng | — |
| Thẻ giảm phí giao mờ + "Dùng khi đặt giao hàng" | `.voucher.vc-ship` (opacity .62, dải `var(--muted)`), nhãn `.vc-sap` | nền nhãn `var(--cream)` thay `#F1ECEE` (K9) |
| Báo "Đã thêm vào ví voucher: …" | `nm.daThemVi` + `data.mo_ta` | — |
| Xem tất cả: nhãn trạng thái | "Đã dùng" / "Hết hạn" / "Chưa dùng được" (`ud.voucher.chuaDung` mới) | thiết kế không vẽ — theo phiếu B1 |
| Ô Số dư ví viền + "+ Nạp tiền" | không làm | việc KH-NAP-1 (a) |
| Số liệu (1.250 điểm, 180.600đ, HD8F2K…) | dữ liệu POS giả của bài thử | (b) |
| Voucher trước v15 (không `mo_ta`), `ma_khach_moi` | giữ cách cũ + thêm "Dùng ngay" | thiết kế không vẽ — theo phiếu B1 |

## Màn 7 — Giỏ hàng (`so_anh/sau/gio-voucher-390*.png`, `gio-voucher-chon-tay-390*.png`)
| Khối trong thiết kế | Đã làm | Khác gì · lý do |
|---|---|---|
| Tiêu đề "Voucher của bạn" (hoạ tiết `sec-head`) + phải "Tự chọn sẵn · chạm để bỏ" | `.sec-head h2` + `.vc-dau-phai` | — |
| Ô chạm: ô vuông tích + câu + mã | `button.vc-chon` (`aria-pressed`), `.vc-o`, `.vc-t`, `.vc-ma` | viền / nền ô chọn `var(--forest)` / `var(--cream)` thay `#B23D6B` / `#FFF9FB` (K9 — `#B23D6B` = `--forest`) |
| Ô POS không tính: không tích + câu đỏ | `.vc-loi` = `error` POS, màu `#C62828` (đỏ demo) | thiết kế `#B3261E` (K9); câu "Voucher VC9: …" trong mẫu là ví dụ — App hiện NGUYÊN câu POS |
| Ô ship mờ, ô tích nét đứt, "Dùng khi đặt giao hàng" | `.vc-chon.vc-tat`, `disabled` | — |
| "Mã khuyến mãi" + "1 mã / đơn", gợi ý "Nhập mã khuyến mãi (nếu có)" | `.sec-head.vc-dau-ma`, `gio.ma.goiYKm` | — |
| Bảng tiền "Voucher VC7 −20.000đ" từng dòng | `tenGiam(g)` → "Voucher {ma}" | — |
| "Ưu đãi hạng Hạng vàng" | có khi POS trả dòng hạng | (b) dữ liệu giả của bài không có hạng |
| Mẫu có 2 voucher dùng được | ảnh App có thêm VC5 (không hạn) | (b) dữ liệu bài thử thêm ca "không hạn" |

## Thanh toán đồ uống (`so_anh/sau/thanhtoan-voucher-390*.png`, trước: `so_anh/truoc/thanhtoan-voucher-390*.png`)
| Khối | Đã làm | Khác gì · lý do |
|---|---|---|
| Bảng tiền dùng chung Giỏ | "Voucher VC7" | — |
| Khối "Voucher chưa dùng được" (phiếu B5; thiết kế không vẽ) | `.vc-chua` dưới bảng tiền, mỗi dòng "{ma}: {lời POS}" | nền `var(--cream)` |
