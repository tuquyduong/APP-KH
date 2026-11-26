# KH-HUY-1 — đối chiếu demo (CLAUDE.md §5)

Demo (`thiet_ke/app_kh_demo.html`) KHÔNG có màn / khối "đơn bị quán huỷ" — đây là khối thuộc hợp đồng POS v14, nên dùng lại đúng lớp CSS đã chép từ demo
(`nt-state`, `nt-state on`, `ghost-btn`, `date`), không thêm tệp .css, không thêm màu (K9). Ảnh: `so_anh/truoc/` (gốc) ↔ `so_anh/sau/` (nhánh), cỡ 360 · 390 · 430.

| Màn | Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|---|
| Theo dõi đơn (đơn huỷ) | hộp báo `nt-state` (cùng khuôn câu "tiền về muộn") | `DonHuy`: hộp lý do (`nt-state`, biểu tượng cảnh báo) + hộp "Đã hoàn … vào ví của bạn" (`nt-state on`, dấu ✓) + nút viền "Xem ví" (`ghost-btn`) ngay dưới đầu màn, trên khối các bước | (a) khối mới thuộc POS v14, demo chưa có — chỉ dùng lớp có sẵn |
| Chi tiết đơn (từ Lịch sử) | `order-card` + `nt-state` (câu tiền về muộn) | cùng `DonHuy` dưới dòng mã đơn / nhãn "Đã hủy" | như trên |
| Lịch sử đơn | thẻ `order-card` (`.top`, `.bottom`) | thẻ đơn huỷ có hoàn thêm một dòng nhỏ `.date` "Đã hoàn 35.000đ" dưới tổng tiền; thẻ khác y như cũ | như trên; không nút |

Trạng thái khác (khách tự huỷ / QR hết hạn / POS cũ / đơn chưa huỷ): DOM y như hôm nay (bài thử ca (4)(4b)(5)).
