# Đối chiếu demo — KH-KHOP-1 (trang /kiemkhop)

Trang này KHÔNG có màn tương ứng trong `thiet_ke/app_kh_demo.html` (trang tạm của chủ quán, không dành cho khách). Phiếu B1 dặn dùng lại khối
`order-card` của demo; không tạo màu / phông / bo góc / bóng mới (bộ kiểm K9 xanh). Ảnh app ở 360 / 390 / 430 (bài thử lưu bằng
`node cong_cu/thu_KHKHOP1.js --anh viec/KH-KHOP-1/so_anh`): `so_anh/kiemkhop_360.png`, `kiemkhop_390.png`, `kiemkhop_430.png`. Không có ảnh demo để ghép cặp.

| Khối trên trang | Khối demo dùng lại (CSS) | Khác demo | Lý do |
|---|---|---|---|
| Nền, khung điện thoại | `.phone` `.screens` `.screen` `.aurora-bg` (qua `Man.jsx`) | không | — |
| Tiêu đề "Kiểm khớp POS" + dòng phụ | `.topbar h1` `.sub` | không có nút quay lại | không có lối vào từ app, mở thẳng bằng đường dẫn (B1) |
| Thẻ "Kết nối" và từng mục | `.order-card` `.top` `.code` `.date` `.items` | không | B1 |
| Dấu ✓ / ✗ | `.order-status.done` / `.cancelled` | chữ ✓ ✗ thay chữ trạng thái | ⏳ ? • – … không có lớp màu riêng: chip trơn, không thêm màu |
| Tên nhóm "Trước / Sau khai trương" | `.sec-head h2` | không | — |
| Nút "Kiểm lại" | `.checkout-btn.giua` + `.btn-disabled` | không | khoá 5 giây chống bấm dồn (B4) |

Khác demo vì lý do (a)–(e) của CLAUDE.md §5: không có (chỉ dùng khối sẵn). Chữ trên trang là chữ kỹ thuật cho chủ quán, không phải chữ mẫu của demo.
