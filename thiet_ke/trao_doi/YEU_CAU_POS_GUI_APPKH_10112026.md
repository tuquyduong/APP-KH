# POS → chat App KH — 10.11.2026 · Trả lời "Giới thiệu bạn bè" + 2 luật mới + báo trước "Thẻ quà tặng"

Sổ POS v60 (chủ quán chốt 10.11). Hợp đồng `/api/kh` hiện tại v13 (KH-THE-1); v14 dành cho QC-APP-1.

## 1. Giới thiệu bạn bè — POS NHẬN
- Mã việc **GIOI-THIEU-1** · Opus · **sau khai trương, sau VOUCHER-2**. Số phiên bản hợp đồng chốt lúc mở việc (sau v14); POS gửi thư hợp đồng khi gộp.
- POS nhận nguyên luồng ở thư App 10.11 (mời → đăng ký khách mới thật → đơn đầu hoàn tất) và **nhận tên trường App đề xuất**: `GET /gioi-thieu`,
  `GET /gioi-thieu/kiem?ma=`, `POST /dang-nhap/xac-minh` nhận `ma_moi?` trả `moi: { gan, ly_do? }` với 4 mã lý do App nêu, voucher nằm trong
  `GET /voucher` có `nguon: 'gioi_thieu'`.
- POS làm rõ thêm:
  1. **Mẫu voucher** (tên, giảm tiền hoặc % có trần, đơn tối thiểu, áp dụng tất cả / nhóm / món, hạn = số ngày từ lúc phát, dùng 1 lần) làm sẵn
     trong **VOUCHER-2 (trước khai trương)**. GIOI-THIEU-1 chỉ chọn mẫu. `*_mo_ta` do POS dựng từ mẫu — App hiện nguyên câu, không tự tính.
  2. "Khách mới thật" = SĐT **chưa từng có** trong POS (kể cả khách quầy). Không tự mời mình.
  3. `ma_moi` không phân biệt hoa thường, bỏ khoảng trắng hai đầu.
  4. Báo thưởng: POS chốt lúc làm phiếu — dự kiến một trường trong `GET /gioi-thieu` (danh sách thưởng mới chưa xem), App đọc khi mở App / màn Mời.
  5. Chương trình tắt → `GET /gioi-thieu` trả `bat: false`, App ẩn hết; voucher đã phát vẫn dùng đến hạn.

## 2. Hai luật mới App cần biết NGAY (chủ quán chốt 10.11)
1. **Mã giảm / voucher KHÔNG áp lên thẻ hạng, nạp tiền, gói trả trước, thẻ quà.** Giỏ có thêm món thường thì mã chỉ tính trên món thường.
   App lấy số giảm từ báo giá POS như hiện nay (không tự tính); khi POS gộp VOUCHER-2, báo giá sẽ trả đúng theo luật này.
2. **Nạp tiền (và thẻ quà sau này) chỉ trả bằng tiền thật (QR chuyển khoản)** — không trừ tiền tài khoản, không mã giảm. Lý do: chặn vòng lặp
   "trả 95k nhận 100k rồi lấy tiền tài khoản mua tiếp". Máy chủ POS chặn (KH-NAP-1); App ẩn "Trừ tài khoản" và ô mã khi giỏ có nạp / thẻ quà.
   Tiền đã vào tài khoản thì khách mua gì cũng được như cũ.

## 3. Báo trước — Thẻ quà tặng (QUA-TANG-1, làm SAU CÙNG — App chưa cần làm gì)
- Khách mua thẻ quà mệnh giá cài sẵn (có thể khuyến mãi, vd trả 95.000đ nhận 100.000đ). Mỗi thẻ sinh **một mã quà** + link, thuộc người mua tới
  khi có người nhập.
- Mua trên App → mã nằm trong mục **"Quà đã mua"** + nút **Chia sẻ** (Zalo / copy link) kèm lời chúc. Mua ở quầy, khách có tài khoản → mã cũng
  hiện trong "Quà đã mua" của khách.
- Người nhận **nhập mã / bấm link** trong App (đăng ký OTP nếu chưa có) → tiền vào tài khoản. Mã dùng một lần, có hạn nhận.
- App sau này cần: mua thẻ quà, mục "Quà đã mua" + Chia sẻ, màn nhận quà (nhập mã / link). POS gửi hợp đồng khi mở việc.
