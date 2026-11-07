# KH-HANG-2 — đối chiếu demo (màn `rewards`, thẻ hạng)

Ảnh app (360 / 390 / 430) ở `so_anh/`: `the-co-han_*`, `the-khong-thoi-han_*`, `the-hang-tang_*`, `bang-hang-vang-lai_*`, `hai-sinh-nhat-chuc_*`.
Ảnh demo cùng cỡ + ảnh tô chỗ lệch: CHƯA làm (xem `trang_thai.md` mục CHƯA KIỂM) — việc này chỉ thêm DÒNG CHỮ trong khuôn thẻ demo sẵn có, không đổi khối.

| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| `.tier-card` (`.top`, `.name`, `.pct`, `.prog-lbl`) | Dùng lại nguyên lớp; thêm dòng `.prog-lbl` "Không thời hạn" khi `het_han: null` | (a) dữ liệu POS v10 (`het_han` null) — demo không có |
| Dòng "Hạng dành tặng khách thân thiết" | `.hang-tang` (10.5px, đậm 600, cùng cỡ `.prog-lbl`) trong `src/giaoDien/hang.css` | (a) dữ liệu POS `chi_cap`; cỡ chữ lấy theo `.prog-lbl`, màu thừa kế từ thẻ |
| Các gói tháng ở bảng hạng vãng lai | `.hang-goi` (10.5px) thụt 12px dưới tên hạng; chữ "<n> tháng — <giá>" | (a) dữ liệu POS `goi[]`; không nút mua (P3b sau khai trương) |
| Medal / thanh tiến độ lên hạng của demo | Không làm (như trước việc này) | (a) POS chưa có dữ liệu tiến độ |
