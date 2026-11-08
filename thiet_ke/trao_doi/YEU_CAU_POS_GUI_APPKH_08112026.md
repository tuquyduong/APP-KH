# Chat POS → App KH — 08.11.2026 (chủ quán chuyển, chat App KH chép lại) — trả lời thư 07.11

Chủ quán chốt 08.11:
1. Thẻ hạng = sản phẩm, chung giỏ với đồ uống, trả một lần. Hạng phải CÓ TRƯỚC thì món mới được giá hạng: đơn có thẻ + đồ uống → đồ uống tính theo hạng khách ĐANG CÓ; hạng mới áp
   từ đơn sau. Khách muốn được giảm ngay → App gợi ý mua thẻ trước (đơn riêng), trả xong /toi.hang đổi ngay. Quầy hiện cũng làm đúng như vậy.
2. Cấp hạng TỰ ĐỘNG, NGAY khi đơn có thẻ được ghi "đã thu" — mọi cách trả (tiền mặt, CK, ví, QR, ở quầy hay App) — trong CÙNG giao dịch ghi đã thu, cùng hàm bán thẻ ở quầy (cùng
   hạng → cộng nối hạn; đang có hạng cao hơn còn hạn → không bán hạng thấp hơn). Huỷ / hoàn → thu hồi thẻ như luật hoàn ở quầy.
3. Hạng "chỉ chủ quán cấp" (Kim Cương): App VẪN HIỆN, nút Mua mờ + chữ "Hạng dành tặng khách thân thiết" — theo trường có sẵn ở /hang (chi_cap); sau này chủ quán đổi sang bán thì
   App tự hiện nút, không sửa App.
4. Tích điểm: POS sẽ có công tắc "Tích điểm" theo TỪNG MÓN (gồm thẻ hạng, gói); máy chủ chỉ cộng điểm phần tiền của món đang bật. App không tính điểm — chỉ hiện số máy chủ trả.
5. POS mở việc KH-THE-1 (sau DIEM-MON-1): hợp đồng /api/kh thêm dòng thẻ trong mon[] cho /gio/bao-gia và /don, mã lỗi, hoa_don[] dòng thẻ, quyền lợi hạng ở /hang. Tên trường /
   mã lỗi POS chốt trong hợp đồng — App chờ bản hợp đồng rồi mới làm màn Mua thẻ.
6. Cài đặt báo lưu rõ: POS mở việc CAIDAT-BAO-1 (một dải thông báo chung cho mọi màn Cài đặt, nút Lưu mờ khi thiếu PIN, báo đúng lý do lỗi).
7. Thông tin thêm (NAP-1 sắp gộp): đơn trả bằng ví nay CÓ điểm như tiền mặt; đơn nạp tiền ở quầy hiện trong lịch sử đơn của khách như đơn quầy (0 điểm, không mã nhận điểm).
   Không đổi trường nào của /api/kh.
