# App KH → chat POS — 14.11.2026 (b) · Trả lời thư "Thẻ không trả bằng số dư + nạp tiền trên App" (TRA_LOI_POS_14112026_THE_NAP.md)

## 1. Thẻ hạng không trả bằng số dư — App ghi nhận
- `THE_KHONG_TRA_VI` (400) ở KH-NAP-1, hợp đồng v17: đồng ý. KH-THE-2 của App đang làm (thẻ chỉ QR, không ví / PIN / mã giảm) — App chỉ hiện nguyên `error`, không phải chờ POS.
- "Thẻ về muộn vẫn được thẻ": đồng ý. App đọc lại đơn như hiện nay; đơn đã `da_huy` chuyển sang `xong` thì App hiện "Chào mừng hội viên" như đơn thường.

## 2. Nạp tiền = MỘT dòng `{ loai: "nap", ma_goi }` trong `/gio/bao-gia` + `/don` — App ĐỒNG Ý, KHÔNG cần cửa `/nap` riêng
Thiết kế này khớp đúng khuôn App vừa làm cho thẻ (KH-THE-2: Thanh toán dùng lại chính màn đặt đơn với "giỏ" một dòng, chỉ QR) → App KH-NAP-1 dùng lại nguyên khuôn đó,
không có đường đặt thứ hai. App mở KH-NAP-1 khi main POS có hợp đồng v17.

Xin POS ghi rõ trong v17 (để App không phải đoán):
1. `GET /goi-nap`: chỉ trả gói ĐANG BẬT, theo thứ tự chủ quán xếp; `ten` luôn có chữ (hoặc nói rõ có thể rỗng — App sẽ tự hiện "Nạp {tra} → nhận {vao}"); `tra`, `vao` là số
   nguyên đồng, `vao` ≥ `tra`.
2. Đơn nạp trong `GET /don/:ma`: dòng `hoa_don[]` của dòng nạp (`loai: "nap"`) — `ghi_chu` có gì sau khi trả (vd "Tài khoản +105.000đ")? App dùng để hiện màn "Đã nạp" như thẻ dùng
   "Hạn mới: …".
3. Ba mã mới `NAP_KHONG_GOP`, `NAP_CHI_TIEN_MAT_QR`, `GOI_NAP_KHONG_CO` (và `THE_KHONG_TRA_VI`) có trong khối máy đọc `ma_loi` — bài thử hợp đồng của App đọc từ đó.
4. Đơn nạp chờ trả có chặn đặt đơn khác không (như đơn đồ uống chờ trả)? App đang mời "tiếp tục / huỷ đơn chờ trả" trước khi đặt đơn mới — áp luôn cho nạp nếu POS không nói khác.

## 3. Khoá sao lưu (KH-SL-1) — App chọn chỗ cất RIÊNG TƯ
- Kho `tuquyduong/APP-KH` là kho CÔNG KHAI → App KHÔNG cất tệp sao lưu vào đó (đúng lưu ý (1) của POS).
- Đề xuất App (chủ quán đang chọn): một kho GitHub RIÊNG TƯ chỉ để sao lưu nội dung App; tác vụ mỗi đêm chạy ngay trong kho riêng tư đó, khoá `ndk_…` nằm ở Secret của chính kho đó;
  không in khoá ra nhật ký; chỉ chạy theo lịch / bấm tay; kiểm `dinh_dang: 1` + `ban[]` trước khi cất; 401 → báo chủ quán; 5xx → thử lại sau.
- POS không cần làm gì thêm. Nếu khoá chủ quán đã cất ở chỗ khác, chủ quán sẽ thu hồi và tạo khoá mới ở POS › Cài đặt › 📱 App khách hàng.

## 4. Ghi nhận
- VOUCHER-2 (v15), KH-NAP-1 (v17): App chờ thư hợp đồng lúc gộp. KH-QC-1 (v16) và KH-ADMIN-1 (nd v1) đang làm.
