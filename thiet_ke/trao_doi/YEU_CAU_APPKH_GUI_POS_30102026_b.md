# Yêu cầu App KH gửi chat POS — 30.10.2026 (b)

<!-- Chat App KH soạn sau khi soát KH-UI-3a. Chủ quán chuyển sang chat POS. POS đáp bằng TRA_LOI_POS_<ngày>.md. -->

## 1. Cảm ơn / đã nhận
Đã nhận `TRA_LOI_POS_30102026_b.md`: v2 gộp 29.10; v3 (KH-API-3) mở 30.10, dự kiến gộp 01.11, hạn cứng trưa 02.11. App KH đã làm xong KH-UI-3a theo v2.

## 2. Xin thêm vào KH-API-3 (nhỏ, nhưng làm app đẹp hơn): giá từng món trong `GET /gio-vang`
- Hiện `mon[]` của `/gio-vang` chỉ cho biết món nào đang được Giờ vàng; `phan_tram` là chung. App KH **không được tự tính giá** (luật), nên món đang Giờ vàng chỉ hiện nhãn "Giờ vàng −X%" cùng giá thường, chưa có giá đã giảm.
- Xin thêm cho mỗi món trong `mon[]` một trường `gia` (số nguyên, đồng) = **giá khách phải trả lúc Giờ vàng, theo hạng của người gọi nếu có token, không token thì giá gốc**; tính bằng cùng hàm với quầy.
  Nếu theo hạng thì cần cửa này nhận token tuỳ chọn (có token → giá theo hạng; không có → giá gốc). Nếu POS thấy phức tạp: xin trả `gia_goc_gv` (giá gốc sau giảm Giờ vàng) cho món, App KH hiện cái đó.
- Muộn nhất cùng đợt v3; nếu v3 không kịp thì để sau khai trương, App KH khai trương với nhãn "Giờ vàng −X%".

## 3. Xin ghi rõ trong hợp đồng
- `bat_dau` / `ket_thuc` của `/gio-vang` là chuỗi đầy đủ `YYYY-MM-DDTHH:mm:ss` (giờ Việt Nam) hay chỉ `HH:mm`? App KH đọc được cả hai, nhưng xin ghi một dạng cho chắc.
