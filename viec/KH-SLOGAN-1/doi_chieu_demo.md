# Đối chiếu demo — KH-SLOGAN-1 (khẩu hiệu ở màn mở + Trang chủ)

Ảnh ở `so_anh/` (số liệu ở `so_anh/bao_cao.txt`): `man_mo_<cỡ>_app.png` (360 / 390 / 430), `man_mo_390_demo.png`, `man_mo_390_mau_B2_3.jpg` (ảnh mẫu chủ quán duyệt),
`man_mo_390_lech.png` (app ↔ mẫu), `man_mo_390_lech_demo.png` (app ↔ demo). Chromium + Playwright có sẵn, API giả ở nháp, chụp sau khi hiệu ứng xong.

## Màn mở (Mái đình)
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Nút âm thanh, Bỏ qua, mái đình, cột, logo, "TỨ QUÝ ĐƯỜNG" ánh kim, đường kẻ hạt thoi, thanh tiến trình, viền | giữ nguyên như KH-UI-2 | không đổi; số lệch 3,2 % so demo là do ánh kim đang chuyển động (hai ảnh khác pha) |
| Dòng khẩu hiệu dưới đường kẻ (vị trí, hiện lên `e3Up` + độ trễ, giảm chuyển động) | giữ vị trí, chuyển động, chế độ giảm chuyển động của demo | — |
| Kiểu chữ khẩu hiệu (demo: Inter 600, 3,2 cqw, #FDE69B, giãn .32em) | EB Garamond 600, 4,15 cqw, #FBE3A2, giãn .22em, bóng rgba(60,10,5,.35), in hoa — chép nguyên `khau_hieu_B2_3.css` | (e) token khẩu hiệu B2.3 chủ quán duyệt 30.10, có trong `DUYET_NGOAI_DEMO`; so ảnh mẫu 390: lệch 5,9 % chỉ ở viền chữ (JPEG) |
| Chữ "Sức khỏe mỗi ngày" (demo) | "Đông Y Dưỡng Thể" từ `KHAU_HIEU` | (b) chủ quán đổi chữ 29–30.10 |
| 360 / 430 | khẩu hiệu một dòng, không tràn, nằm giữa (đo: scrollWidth = clientWidth) | — |

## Trang chủ
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Dòng nhỏ dưới lời chào "Tứ Quý Đường — Sức khỏe mỗi ngày" | "Tứ Quý Đường — Đông Y Dưỡng Thể" (kiểu chữ `.sub` của demo, giữ nguyên) | (b) chủ quán chốt 30.10: đổi hết mọi chỗ |

## Ghi chú
- Ảnh mẫu B2.3 hiện biểu tượng loa "bật" còn app hiện loa gạch chéo ở nút âm thanh: nút này là của demo / KH-UI-2 (trạng thái tắt tiếng lúc chụp), không thuộc việc này.
