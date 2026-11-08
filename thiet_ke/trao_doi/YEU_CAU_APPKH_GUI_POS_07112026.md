# YÊU CẦU App KH → chat POS — 07.11.2026 · Bán thẻ hạng trên App (chung giỏ) · Thông báo lưu ở Cài đặt POS

## 0. Hiện trạng (chat App KH kiểm 07.11)
- Chủ quán đặt gói cho hạng Vàng (1 tháng 100.000đ, 3 tháng 289.000đ) ở Cài đặt → Hạng thành viên. Lần đầu bấm Lưu KHÔNG gõ PIN → `GET /api/kh/hang` vẫn
  `goi: []`; lần sau có PIN → App hiện đúng "1 tháng — 100.000đ · 3 tháng — 289.000đ", Kim Cương "Hạng dành tặng khách thân thiết" (App KH-HANG-2, đã gộp).
- App hiện CHỈ HIỂN THỊ gói (hợp đồng v10: "mua thẻ trên App chưa có — P3b sau khai trương"). Chủ quán 07.11: **thẻ phải là sản phẩm khách mua được trên App**.

## 1. Bán thẻ hạng trên App — chủ quán chốt 07.11
**Quyết định của chủ quán:**
- Thẻ hạng là một SẢN PHẨM: hiện ở **Menu (nhóm "Thẻ thành viên")**, ở **Ưu đãi (thẻ hạng có nút Mua)**, và **Trang chủ nhắc khi thẻ sắp hết hạn**.
- Khách được cho thẻ vào **CÙNG giỏ với đồ uống**, trả MỘT lần — nhưng **phải mua hạng trước rồi mới được giảm** (mục 2).
- Tích điểm / dùng mã giảm khi mua thẻ: **chủ quán sẽ chốt sau** — POS để cấu hình được hoặc theo đúng cách quầy đang bán thẻ, báo App.

**App sẽ làm (sau khi POS lên hợp đồng):** màn "Mua thẻ hội viên" theo demo (`buycard`: thẻ hạng hiện tại + hạn, tab từng hạng, quyền lợi, ô chọn gói "1 tháng / 3 tháng —
Tiết kiệm …", nút "Mua thẻ Vàng 3 tháng" / "Gia hạn", bảng so sánh) → nút "Thêm vào giỏ"; Menu có nhóm "Thẻ thành viên" (mỗi hạng bán được một thẻ "Thẻ Vàng — từ 100.000đ"),
Ưu đãi có nút Mua, Trang chủ nhắc "Hạng Vàng còn N ngày — Gia hạn". App KHÔNG tự tính giá, KHÔNG tự cấp hạng.

**Xin POS (tên trường / mã lỗi POS chốt, ghi vào "Đã hẹn" + báo App lịch):**
1. **Giỏ có dòng thẻ:** `POST /gio/bao-gia` và `POST /don` nhận thêm dòng thẻ trong `mon[]` (đề nghị `{ loai: 'the', hang_id, so_thang }`, `so_luong` = 1, tối đa 1 dòng thẻ / đơn)
   — CÙNG khoá gửi, `tong_da_xem`, cách trả `qr` / `vi` / `vi_qr`, luật 4xx / 5xx / chưa rõ như đơn hiện nay (không đường tiền mới).
2. **Thứ tự: MUA HẠNG TRƯỚC, giảm SAU** (chủ quán 08.11 — xin POS kiểm lại logic và trả lời cách làm): hạng chỉ có hiệu lực khi tiền mua thẻ ĐÃ VỀ. Đề nghị:
   - Đơn có cả thẻ + đồ uống: đồ uống tính theo hạng khách ĐANG CÓ lúc đặt (KHÔNG giảm theo hạng của thẻ đang mua); hạng mới áp từ đơn SAU.
   - Khách muốn được giảm ngay: App gợi ý "Mua thẻ trước để đơn này được giảm" → mua thẻ thành một lần trả riêng; trả xong `/toi.hang` đổi, báo giá đồ uống tính lại theo hạng mới.
   - Xin POS: xác nhận cách nào khớp với quầy (quầy bán thẻ + đồ uống cùng bill thì đồ uống có được giảm ngay không?), cách nào an toàn tiền nhất (hoàn / huỷ), rồi chốt — App làm theo.
3. **Cấp hạng khi đơn đã trả** bằng CÙNG hàm bán thẻ ở quầy (mua thêm cùng hạng → cộng nối hạn; đang có hạng cao hơn còn hạn → không bán hạng thấp hơn); `/toi.hang` đổi ngay.
   Đơn huỷ / hoàn → thu hồi đúng phần thẻ theo luật hoàn của quầy (P26c) — POS chốt và ghi vào hợp đồng.
4. **Mã lỗi** (đề nghị): `HANG_KHONG_BAN` (chỉ cấp / đã tắt), `GOI_KHONG_BAN` (gói tắt / chưa giá), `HANG_THAP_HON` (khách đang có hạng cao hơn), `GIA_DA_DOI` dùng lại.
5. **Hoá đơn + Lịch sử:** `hoa_don[]` có dòng thẻ (vd `loai: 'the'`, trai = "Thẻ Vàng 3 tháng", phai = giá, kèm hạn mới); Đơn App ở quầy hiện rõ "có thẻ" (quầy không pha gì
   cho dòng này); tem ly không in dòng thẻ.
6. **Quyền lợi hạng để App hiện:** `GET /hang` thêm chữ quyền lợi + cách có của từng hạng (vd `quyen_loi[]`, `cach_co_chu`) do chủ quán nhập ở Cài đặt → Hạng thành viên —
   không có thì App chỉ hiện "% giảm".
7. **Đối soát:** tiền thẻ bán qua App vào cùng nhóm "bán thẻ" như quầy (ngày / tuần / tháng).

## 2. Cài đặt POS — thông báo khi lưu phải RÕ (chủ quán 07.11)
Chủ quán: "bấm Lưu xong hệ thống có báo lưu thành công nhưng khó nhìn; nhập PIN xong Lưu thì chả hiện gì" → đã tưởng là lưu, thực ra máy chủ từ chối (App kiểm `/hang` vẫn `goi: []`).
**Đề nghị cho MỌI màn Cài đặt (một component chung, không làm riêng từng màn):**
1. **Một dải thông báo nổi cố định** (đầu màn hoặc góc dưới), chữ to, tự ẩn 4–5 giây, có nút ✕:
   - Thành công (xanh): nói rõ ĐÃ LƯU GÌ — vd "Đã lưu Hạng thành viên: 2 hạng · Vàng bán 2 gói (1 tháng 100.000đ, 3 tháng 289.000đ)".
   - Lỗi (đỏ, KHÔNG tự ẩn): đúng lý do + cách sửa — "Chưa nhập PIN chủ quán — gõ PIN vào ô cạnh nút Lưu", "Sai PIN — còn 4 lần", "Sai 5 lần — khoá 15 phút", "Gói 3 tháng
     chưa có giá"…; trỏ / viền đỏ đúng ô sai.
2. **Nút Lưu:** "Đang lưu…" khi chờ; màn có PIN thì **ô PIN bắt buộc** — chưa gõ PIN thì nút Lưu mờ kèm chữ "Nhập PIN chủ quán để lưu" (không cho bấm rồi im lặng).
3. **Có thay đổi chưa lưu:** hiện "● Có thay đổi chưa lưu" cạnh nút Lưu; rời màn khi chưa lưu → hỏi lại.
4. **Sau khi lưu:** tải lại dữ liệu từ máy chủ (số trên màn = số máy chủ giữ), xoá ô PIN, ghi "Đã lưu lúc 12:05".
5. (Gợi ý) Ở màn Hạng thành viên có dòng xem trước "Khách sẽ thấy trên App: Vàng — giảm 6% · 1 tháng 100.000đ · 3 tháng 289.000đ".
