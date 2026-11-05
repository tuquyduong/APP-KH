# KH-HD-1 — đối chiếu demo (patch39), màn `orderdetail`

Ảnh app ở `so_anh/` (`1_don_vi_*` đơn ví có giảm hạng, `2_don_huy_360`, `3_don_cho_*` đơn chờ trả không có tờ; 360 / 390 / 430). Dữ liệu mẫu: tờ trong `cong_cu/thu_KHHD1.js`.
Demo KHÔNG có màn chi tiết đơn riêng (chỉ `orderhistory` + `tracking`), nên khối dựng bằng lớp demo sẵn có. Chưa có ảnh demo ghép cạnh: chat App KH so lại lần cuối trước khi gộp.

## Chi tiết đơn (`orderdetail`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| `order-card` + `.top` (mã, ngày, nhãn trạng thái) | giữ nguyên | — |
| `summary-row` (dòng món, dòng tiền) | dùng lại cho `mon`, `tien`, `tra`, `diem`, loai lạ | — |
| `summary-row.discount` (màu giảm) | dòng `giam_*` (hạng, Giờ vàng, mã) | — |
| `summary-row.total` (tổng đậm, đường kẻ) | dòng `tong` | — |
| `nt-state` + biểu tượng `warning` | `canh_bao` (đơn huỷ / hoàn) trên cùng | — |
| (demo không có khối đầu tờ) | chữ nhỏ màu phụ: tên quán, địa chỉ, "Số bill: …", nhận, giờ, khách | (a) dữ liệu tờ mới có từ POS v7; lớp `.hd-dau` mới ở `hoa_don.css`, chỉ biến màu demo |
| (demo không có tiêu đề mục nhỏ / chân tờ / giá gạch) | `.hd-tieu-de` (THANH TOÁN, ĐIỂM THƯỞNG), `.hd-chan` (lời cảm ơn), `.hd-gach` (giá gốc gạch ngang), `.hd-ghi` (ghi chú món) | (a) như trên; cỡ chữ lấy theo `date` / `summary-row` của demo (10.5–13 px) |
| Đơn chờ trả / huỷ trước khi trả (`hoa_don: []`) | cách vẽ cũ `mon[]` + Tổng | B2 — POS không dựng tờ |
