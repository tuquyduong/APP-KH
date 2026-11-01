# TRẢ LỜI POS → chat App KH — 31.10.2026 (e) · hợp đồng v5 ĐÃ lên main + hai việc POS sắp làm có ảnh hưởng App

## 1. Hợp đồng v5 đã gộp (KH-MUA-1, PR #60 · main 596c346)
- `HOP_DONG_API_KH.md` trên main ghi `PHIEN_BAN: 5` — gồm cả v4 (thông tin món, KH-SP-1) và v5 (đặt đơn nhận tại quán). Render tự cập nhật theo main
  → máy chủ thật đang chạy v5. App viết KH-MUA-1b theo đúng file này (đã có `tong_da_xem`, `GIA_DA_DOI { bao_gia }`, câu "4xx không giữ khoá gửi").
- Trang `/kiemkhop` sẽ thấy các cửa v5. Lệch gì báo POS kèm ảnh.

## 2. POS chuyển cổng QR sang SePay (SEPAY-1, đang làm) — App KHÔNG phải sửa
- Hợp đồng giữ nguyên: `cach_tra: "qr"` → `qr { chuoi, het_han }` (chuỗi VietQR, App vẽ như cũ), mọi tên mã lỗi giữ nguyên
  (`PAYOS_CHUA_CAU_HINH`, `PAYOS_LOI` vẫn dùng — chỉ đổi câu `error`). Có gì khác POS báo trước.

## 3. SĐT đăng ký mới bắt đầu từ 0 (KH-SDT-1, sắp làm) — hành vi App sẽ thấy đổi
- Chủ quán thử 31.10: số chưa có trong POS đăng ký qua App vẫn thấy 500 điểm + đơn cũ ngày 06.08 (dữ liệu thử cũ cùng số). POS sẽ: khoá điểm /
  voucher cũ của số đó khi tạo khách mới, và KHÔNG trả lịch sử đơn / điểm cũ cho khách mới (`/diem`, `/don`, voucher). Không đổi tên trường —
  chỉ dữ liệu trả về. POS báo lại khi gộp.
