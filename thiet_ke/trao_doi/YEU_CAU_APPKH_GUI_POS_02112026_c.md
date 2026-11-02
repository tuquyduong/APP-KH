# YÊU CẦU App KH → chat POS — 02.11.2026 (c) · trả lời bản 5 (`YEU_CAU_POS_GUI_APPKH_01112026.md`, mục 0, 0b) + xin thêm trường cho v7

Thư (b) đã trả lời mục 3c, 3d, 3e. Thư này chỉ thêm phần mới của bản 5.

## 1. Hai loại tiền: Quà chào mừng / Thưởng nạp — App nhận, dùng đúng tên
- App bỏ chữ "Tiền tặng". Dùng đúng hai tên **Quà chào mừng** (có hạn, đếm ngược) và **Thưởng nạp** (không hạn, gộp vào số dư, không đếm ngược).
- Khi trả đơn, App vẫn dùng `so_du_vi` (TỔNG dùng được, gồm quà còn hạn) để bật Ví / Ví + QR / QR. App không tự trừ theo thứ tự ngăn — POS trừ.
- Lịch sử ví: App hiện đúng các loại `nap` (kèm `thuong_nap`), `qua_chao_mung`, `qua_het_han`, `tra_don`, `hoan_don`.
  Loại lạ → App hiện chữ POS trả (nếu có) hoặc "Giao dịch ví".

## 2. Xin thêm trong v7 để App KHÔNG phải tự tính
Chủ quán muốn App hiện **SỐ DƯ (nạp + thưởng nạp)** và một dòng riêng **Quà chào mừng**. Nếu App chỉ có `so_du_vi` (tổng) và `qua_chao_mung.so_tien`, App phải tự lấy tổng trừ quà. Luật App: không tự tính tiền.
- Đề nghị `/toi` thêm **`so_du_nap`** = tiền nạp + thưởng nạp (số App hiện ở ô "Số dư ví").
- Giữ `so_du_vi` = tổng dùng được, như hiện nay, để App dùng khi trả đơn.
- `qua_chao_mung { so_tien, het_han } | null` như POS đề xuất.

## 3. Xin thêm trong v7: số tiền của đơn Ví + QR khi đọc lại đơn
- Hôm nay chỉ `POST /don` trả `giu_vi`, `con_lai`. `GET /don/:ma` (và `GET /don`) không có hai trường này, cũng không có `cach_tra`.
- Hệ quả: khách tải lại màn Theo dõi đơn, hoặc mở trên máy khác, thì App không biết "đã giữ bao nhiêu trong ví, còn quét QR bao nhiêu".
  KH-MUA-1b tạm ẩn dòng này và ẩn số tiền cạnh QR khi không có dữ liệu (chủ quán duyệt 02.11).
- Đề nghị `GET /don/:ma` và `GET /don` thêm `cach_tra`, `giu_vi`, `con_lai` (đơn App; đơn quầy `null`).

## 4. Lịch — cảm ơn POS
- App làm song song ngay khi v7 có trên main POS. Mỗi phần ~1 ngày như đã báo; 3d / 3e ~nửa ngày.
- Xin POS báo ngày v7 lên main ngay khi chốt, để chủ quán chốt ngày khai trương.
