# YÊU CẦU App KH → chat POS — 14.11.2026 · Thẻ hạng KHÔNG trả bằng số dư tài khoản + nhận thư QC-APP-1

## 0. Bối cảnh
- Chủ quán 14.11: **"Hạng thành viên không được trừ bằng số dư, tránh gian lận vì nạp tiền được cộng tiền thưởng."**
- App đã đọc POS `main` 4434ad59 (hợp đồng v14). Hiện thẻ hạng **vẫn trả được bằng số dư** ở cả hai nơi:
  - **App:** "Ghi chú v13": đơn có dòng thẻ nhận `cach_tra` `qr` · `vi` · `vi_qr` như đơn đồ uống (`utils/donApp.js` `CACH_TRA`).
  - **Quầy:** `routes/orders.js` bán thẻ (`membership_buy`, TIER-1c / HANG-1) không chặn `payment_method: "balance"`, `balance_amount`, `parent_balance_amount`.
  - Số dư có ngăn thưởng nạp (NAP-1, `utils/viKhach`) → khách nạp gói có thưởng rồi dùng tiền thưởng mua thẻ.

## 1. Xin POS (chủ quán chốt 14.11)
1. **Tiền thẻ hạng không trả bằng số dư tài khoản**: cả ngăn nạp lẫn ngăn thưởng, cả ví mẹ; ở quầy và trên App. Thẻ chỉ trả bằng tiền mặt (quầy) hoặc chuyển khoản / QR.
2. **App** (`POST /don`): giỏ có dòng thẻ mà `cach_tra` là `vi` hoặc `vi_qr` → 400 với mã lỗi mới. POS đặt tên mã; App đề xuất `THE_KHONG_TRA_VI`, lời "Thẻ hội viên chỉ trả bằng chuyển khoản QR."
   Chặn cả khi đơn có thêm đồ uống: đơn có thẻ thì cả đơn không dùng số dư. Đây là cách đơn giản nhất, không phải chia tiền.
3. **Quầy:** đơn có dòng thẻ thì không trả bằng số dư (cả đơn). Màn bán hàng tắt / ẩn lựa chọn số dư và hiện câu nhắc ngắn. Muốn trả đồ uống bằng số dư thì nhân viên tách thành đơn riêng.
4. Đơn thẻ đã trả bằng số dư TRƯỚC khi chặn: giữ nguyên, không thu hồi.
5. Ghi hợp đồng phiên bản mới (mã lỗi mới + câu "dòng thẻ chỉ `cach_tra: "qr"`" trong "Ghi chú v13"), báo App số phiên bản.

## 2. App làm gì
- Việc **KH-THE-2** (chủ quán duyệt bản thiết kế 14.11):
  - Thẻ mua riêng bằng nút "Mua ngay", không bỏ vào giỏ nữa → đơn App có thẻ luôn là đơn chỉ có thẻ.
  - Màn Thanh toán thẻ chỉ có QR; không có công tắc số dư, không gửi mã giảm (như KH-THE-1).
- App vẫn hiện đúng lời `error` POS trả nếu gặp mã mới (máy cũ còn bản App trước).
- Việc App không phải chờ POS: App ẩn số dư cho thẻ ngay trong KH-THE-2. POS chặn ở máy chủ là lớp bảo vệ chính.

## 3. Nhận thư QC-APP-1 (13.11)
- App nhận đủ 6 điểm. Việc App: **KH-QC-1** (Sonnet). Dải quảng cáo + banner Trang chủ đọc `GET /api/kh/quang-cao`.
  App mở việc khi `main` POS có hợp đồng v16 (phiếu nhúng bản hợp đồng đó).
- App đọc một lần khi mở Trang chủ và khi quay lại sau lâu. Khung giờ so với `bay_gio`. Chữ hiện bằng text. Cắt "…" theo giới hạn. `dich` / `ma_mon` theo đúng mục 4.
- Dòng `id: "gio_vang"` thay cho nguồn Giờ vàng App đang tự dựng (KH-UI-5g). Thứ tự còn lại giữ như KH-UI-5g: quảng cáo POS → Giờ vàng → chương trình đặc biệt → chữ mặc định.
