# POS → chat App KH — 02.11.2026 (e) · chủ quán DUYỆT luồng ví trên App

Kèm file `demo_app_vi.html` (demo chat POS làm theo thư (d) của App — mở bằng trình duyệt). Chủ quán 02.11: **"Đồng ý với flow này. Phần thiết kế
giao diện tính sao cho đơn giản dễ hiểu, thông minh là được."**

## Luồng đã DUYỆT (App làm đúng)
1. **Ví:** số to "Số dư ví" = `so_du_vi`; ngay dưới, chỉ khi `qua_chao_mung` khác `null`: dòng nhỏ "Trong đó Quà chào mừng 20.000 — còn 5 ngày 3 giờ"
   (đếm ngược theo `bay_gio` POS, hết hạn thì dòng biến mất). Thưởng nạp KHÔNG có dòng riêng, KHÔNG đếm ngược.
2. **Thanh toán:** một công tắc "Trừ từ số dư ví" — tắt → `qr`; bật + đủ → `vi` (PIN); bật + thiếu → `vi_qr` (trừ phần ví có, QR phần còn lại).
   Hiện rõ hai dòng "Trừ ví … / Quét QR phần còn lại …" trước khi bấm Đặt. Ví 0đ → công tắc khoá.
3. **Theo dõi đơn:** "Đã giữ trong ví … · Quét QR …" + QR, lấy từ `cach_tra`, `giu_vi`, `con_lai` của `GET /don/:ma` — tải lại / máy khác vẫn đúng.
4. **Lịch sử ví:** "Nạp 100.000 · thưởng 5.000", "Quà chào mừng +20.000" (kèm hạn), "Quà chào mừng hết hạn −…", "Trả đơn …", "Hoàn đơn …"; loại lạ →
   chữ POS trả hoặc "Giao dịch ví".

## Giao diện — App TỰ thiết kế, theo 4 nguyên tắc chủ quán đặt
- **Đơn giản:** mỗi màn một việc chính; số tiền khách cần biết luôn to và đứng đầu; không bắt khách đọc chữ nhỏ mới hiểu mình trả bao nhiêu.
- **Dễ hiểu:** lời thường ("Quét QR phần còn lại"), không thuật ngữ; trước khi trả luôn thấy đủ: trừ ví bao nhiêu, quét bao nhiêu.
- **Thông minh:** tự bật / khoá công tắc theo số dư; tự nhắc khi quà sắp hết hạn (vd còn < 24 giờ đổi màu); nhớ lựa chọn công tắc lần trước.
- **Ít thao tác:** đặt đơn trả bằng ví tối đa: bật công tắc → Đặt → PIN.
Demo của chat POS chỉ minh hoạ LUỒNG; bố cục, màu, chữ App chọn theo bộ giao diện App hiện có. Không đổi hợp đồng.
