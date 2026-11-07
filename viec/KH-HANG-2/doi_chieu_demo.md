# KH-HANG-2 — đối chiếu demo (màn `rewards`, thẻ hạng)

Ảnh ở `so_anh/` (360 / 390 / 430):
- Demo (`thiet_ke/app_kh_demo.html`, bấm "Bỏ qua" rồi `go('rewards')`): `demo_rewards_*.png` (cả màn), `demo_the-hang_*.png` (riêng thẻ hạng).
- App (POS giả v10): `the-co-han_*`, `the-khong-thoi-han_*`, `the-hang-tang_*`, `bang-hang-vang-lai_*`, `hai-sinh-nhat-chuc_*`.
- Ảnh tô chỗ lệch: `lech_the-co-han_*.png` (hồng = điểm lệch giữa cả màn app và demo). Cả màn lệch nhiều vì app có khối "Chương trình đặc biệt" ở trên (không có trong demo, lý do (a)) và thiếu banner / bộ sưu tập (VIỆC SAU) nên mọi khối dịch dọc; so riêng thẻ hạng bằng mắt: cùng nền vàng + hoạ tiết, cùng cỡ chữ `.name` 16 / `.pct` 11 / `.prog-lbl` 10.5, cùng bo góc, bóng.

| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| `.tier-card` (`.top`, `.name`, `.pct`, `.prog-lbl`) | Dùng lại nguyên lớp | — |
| "Giảm 10% mọi đơn hàng" | "Giảm {%} món thường · nhóm đặc biệt {%}" (như trước việc này) | (b) chữ mẫu demo không dùng; số lấy từ POS |
| "Thẻ hết hạn: 15/11/2026" | "Thẻ hết hạn: {giờ ngày POS}"; `het_han: null` → "Không thời hạn" | (a) dữ liệu POS v10 |
| Dòng "Hạng dành tặng khách thân thiết" | `.hang-tang` (10.5px, đậm 600) trong `hang.css` | (a) dữ liệu POS `chi_cap`; không có trong demo |
| Các gói tháng ở bảng hạng vãng lai | `.hang-goi` (10.5px) thụt 12px dưới tên hạng, "<n> tháng — <giá>"; không nút mua | (a) dữ liệu POS `goi[]`; mua thẻ là P3b sau khai trương |
| Huy hiệu `.medal` | Không làm | (a) POS chưa có dữ liệu |
| Nút "Quyền lợi & nâng hạng ›" | Không làm | (c) chưa có mua / nâng hạng (P3b) |
| Banner Giờ vàng, "Sưu tập Tứ Quý" | Banner làm từ trước; Sưu tập không làm | Sưu tập: VIỆC SAU trong sổ |
| Khối "Chương trình đặc biệt" (ngoài demo) | Làm ở KH-CT-1; việc này chỉ sửa 2 điều kiện (B1, B2), không đổi giao diện | (a) dữ liệu POS mới; ảnh `hai-sinh-nhat-chuc_*` |
