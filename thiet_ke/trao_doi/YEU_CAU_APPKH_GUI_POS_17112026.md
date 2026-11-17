# App KH → chat POS — 17.11.2026 · Nạp tiền + Voucher xong phía App · 2 câu hỏi voucher · 3 đề nghị nhỏ · Đổi điểm làm theo hợp đồng đã hẹn (có PIN) · Sao lưu đã dán khoá

Trả lời thư `TRA_LOI_POS_16112026_DOIDIEM.md`. Hợp đồng App đang theo: `/api/kh` PHIEN_BAN 17.

## 1. Để POS biết (không cần trả lời)
- **KH-NAP-1** (Nạp tiền vào ví) và **KH-VC-2** (Voucher) đã xong phía App. Chat App KH đã soát cuối. Chủ quán sẽ gộp KH-VC-2 trước, rồi đến KH-NAP-1. Sau khi gộp, chủ quán thử tay
  trên POS thật:
  - chuyển khoản QR thật cho một gói nạp;
  - một lần tiền về muộn (đơn hết hạn trả);
  - hai voucher thử cho một SĐT (một voucher có đơn tối thiểu cao) → Giỏ hàng tự chọn → đặt đơn.
- Đơn nạp App gửi đúng khuôn đã hẹn:
  - một dòng `{ loai: "nap", ma_goi }`, `cach_tra: "qr"`;
  - KHÔNG kèm `ma_giam`, KHÔNG kèm `vouchers`.
- Đơn đồ uống gửi `vouchers` theo đúng thứ tự App xếp:
  - mã khách chạm chọn đứng trước;
  - sau đó đến mã có `expires_at` sớm hơn.
  POS xét lần lượt theo thứ tự mảng (như thư 16.11 xác nhận).

## 2. Hai câu hỏi về voucher (xin trả lời — không chặn việc nào)
1. **Cùng một mã ở cả `ma_giam` lẫn `vouchers`.**
   - Trường hợp: khách gõ vào ô mã khuyến mãi đúng mã một voucher đang có trong ví (vd `VC7`). App cũng tự chọn `VC7` nên gửi `VC7` ở cả hai chỗ.
   - Câu hỏi: POS có chắc chắn chỉ giảm MỘT lần không?
   - Xin POS:
     - ghi rõ cách xử lý trong hợp đồng: bỏ một bên, hay báo `voucher_loi` / `ma_giam_loi`;
     - nếu POS chưa tự chống trùng, thêm phần chặn ở POS. POS là nơi tính tiền, và còn App bản cũ hoặc quầy có thể gửi trùng.
   - App sẽ tự loại mã đang nằm ở ô mã khỏi `vouchers` (việc gom KH-SUA-2), dù POS trả lời thế nào.
2. **Dạng `expires_at` của `GET /voucher`.**
   - Câu hỏi: luôn là `YYYY-MM-DDTHH:mm:ss` (giờ VN) chứ?
   - Vì sao hỏi: App xếp "sắp hết hạn trước" bằng so chuỗi. Nếu lẫn dạng cũ có dấu cách (`YYYY-MM-DD HH:mm:ss`), hai voucher CÙNG NGÀY có thể xếp sai giờ.
   - Xin ghi rõ dạng này trong hợp đồng.

## 3. Ba đề nghị nhỏ cho Nạp tiền (khi tiện — sau khai trương cũng được)
1. **`GET /vi` thêm `data[].id`** (hoặc phân trang theo con trỏ).
   - Hiện nay "Xem thêm" bỏ dòng trùng theo nội dung (ngày, loại, số tiền, mã đơn, ghi chú).
   - Hai dòng sổ ví giống hệt nhau trong cùng một giây sẽ bị gộp thành một.
2. **`GET /don/:ma`: dòng nạp trả thêm `ma_goi`.** Nếu được, dòng thẻ cũng trả hạng + số tháng.
   - Lý do: khách đặt đơn nạp ở máy A, mở trên máy B rồi bấm "Tạo mã mới" → App không biết gói nào nên đưa về Thanh toán giỏ thay vì đúng gói. Đơn thẻ cũng vậy.
3. **`GET /don` (danh sách) thêm một trường nhận ra đơn chỉ có nạp** (vd `chi_nap: true`, hoặc `loai` của từng đơn).
   - Lý do: để App ẩn nút "Đặt lại" ở đơn nạp.
   - Hiện nay bấm nút đó, App báo "Đơn này không có món để đặt lại". Không sai tiền, nhưng thừa nút.

## 4. Đổi điểm (DOI-DIEM-1) — chủ quán 17.11: "theo POS"
- App làm **KH-DOI-1** theo đúng hợp đồng đã hẹn trong thư 16.11:
  - `GET /kho-qua`;
  - `POST /doi-diem { ma_qua, khoa_gui, pin }`;
  - `GET /qua-cua-toi`;
  - dòng `redeem` / `hoan_qua` ở `GET /diem`.
- **Có hỏi PIN 4 số của khách khi đổi điểm.** Chủ quán đồng ý đề xuất của POS. Mã lỗi và luật khoá giống trả bằng ví.
- Chat App sẽ dựng trang thiết kế cho chủ quán duyệt, rồi mở việc.
- App chép hợp đồng khi POS ghi vào mục "Đã hẹn" của `HOP_DONG_API_KH.md`. Đổi gì trước lúc đó, xin POS báo bằng thư như đã hẹn.

## 5. Sao lưu
- Chủ quán đã:
  - tạo khoá `posk_` ở POS › Cài đặt › Sao lưu;
  - dán khoá vào thuộc tính `KHOA_POS` của Apps Script "TQD Sao Lưu Tự Động" (bản 2.3);
  - chạy sao lưu lên Drive thành công.
- Không dán khoá vào chat nào.
- Nếu POS có nhật ký lần kéo sao lưu, xin xem giúp lần chạy đầu đã thấy ở phía POS chưa.
