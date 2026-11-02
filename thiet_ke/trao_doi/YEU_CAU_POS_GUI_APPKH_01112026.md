# POS → chat App KH — 01.11.2026 (bản 3, thay bản 1 và 2) · các việc POS đang thiết kế có dính App

Chủ quán chốt hôm nay. Phần lớn còn đang thiết kế, CHƯA chốt tên trường. Tên trường dưới đây chỉ là đề xuất; POS chốt trong
`HOP_DONG_API_KH.md` khi giao phiếu. Hợp đồng chỉ THÊM trường, không xoá trường đang dùng. App chưa phải làm gì cho tới khi hợp đồng lên bản mới.

## 1. Hạng thành viên — phiếu HANG-1 (Opus, làm TRƯỚC khai trương)
Trả lời yêu cầu (b) của App 01.11. Chủ quán chốt:
- Hạng nào bán, hạng nào chỉ cấp: chủ quán tự đặt từng hạng. Hôm nay: **Vàng bán**, **Kim Cương chỉ cấp** (chỉ chủ quán cấp).
- Hạng bán có **danh sách gói tuỳ ý** (số tháng + giá; hôm nay 1 và 3 tháng, sau có thể thêm 6 / 12). Giá chủ quán đặt sau.
- Mua thêm gói → hạn **cộng nối** vào hạn cũ.
- Hạng chỉ cấp: hạn cài được — có hạn (số tháng) hoặc **không thời hạn**.
- Khách đang có hạng cao hơn thì **không mua được** hạng thấp hơn.
- Kim Cương (có hạn) hết hạn mà Vàng khách đã mua còn hạn → khách **quay về Vàng** tới hết hạn Vàng. `GET /toi` luôn trả hạng ĐANG hiệu lực.
- Chưa bán thẻ nào trước đây; bắt đầu từ ngày khai trương.
- POS sẽ thêm nút "+ Thêm hạng" (hiện chỉ sửa được 2 hạng có sẵn).

Hợp đồng (đề xuất, theo ý App): `GET /hang` mỗi hạng thêm `chi_cap` (bool), `goi[] {so_thang, gia}` (rỗng khi chi_cap), `thu_bac` (số, để
App biết hạng nào cao hơn); giữ `gia_the` một đợt. `GET /toi` → `hang.het_han` có thể là `null` = không thời hạn (Kim Cương). **App cần
chịu được `het_han: null`.** Nút mua thẻ trên App: vẫn là việc sau khai trương (P3b) — App chỉ hiển thị.

## 2. Gói nạp tiền vào tài khoản — phiếu NAP-1 (đang thiết kế)
- Chủ quán cài trong Cài đặt sản phẩm: "nạp 100.000 nhận 105.000" (bao nhiêu gói tuỳ ý).
- Bán ở quầy: thanh toán xong là số dư tài khoản khách tăng NGAY, dùng trả đơn được luôn.
- Câu hỏi cho App (chưa cần trả lời ngay): sau khai trương có muốn khách tự nạp trên App bằng QR không? Nếu có, POS sẽ thêm
  `GET /goi-nap` + tạo phiên QR cho gói nạp theo đúng đường QR đơn App hiện nay.
- Lịch sử ví trong App: sẽ có dòng nạp kèm phần được tặng (vd "Nạp 100.000 · tặng 5.000"). Tên loại giao dịch POS báo khi chốt.

- Tích điểm: lúc NẠP không tích điểm; khi khách TIÊU tiền trong tài khoản thì CÓ tích điểm trên toàn bộ số tiền tiêu (cả phần tiền tặng).
  Đổi luật 24.10 ("không tính phần trừ tài khoản"). App hiện điểm như cũ, không phải tính gì.
- Ví có hai phần: tiền thật và tiền tặng. App có thể chỉ hiện tổng số dư như hiện nay; nếu muốn tách, POS sẽ thêm trường khi chốt.

## 2b. Mã mở tài khoản lần đầu — đổi thưởng
- Trước định: mã nhân đôi điểm. Nay chủ quán muốn: mã có thể **cộng tiền tặng vào tài khoản** (dùng 1 lần duy nhất, khuyến khích mở tài khoản).
  Loại thưởng chọn trong cài đặt mã. Tiền tặng này có điều kiện: chỉ dùng cho đơn từ X đồng và có HẠN DÙNG (X và số ngày quán cài).
- **App cần thêm giao diện:** chỗ hiện số dư hiện "Tiền tặng 20.000 — còn 5 ngày 3 giờ" (ĐẾM NGƯỢC tới lúc hết hạn) và điều kiện "dùng cho đơn
  từ X đồng"; hết hạn thì dòng đó biến mất (POS tự thu lại). Lịch sử ví có dòng "Tặng khi mở tài khoản" và "Hết hạn tiền tặng".
  POS sẽ trả `het_han` (giờ VN) + `don_toi_thieu` cho từng khoản tặng còn hạn — tên trường chốt khi giao phiếu.

## 3. Chương trình đặc biệt — phiếu CT-1 (đang thiết kế)
- Một thẻ Cài đặt riêng. Ví dụ chủ quán đưa: học sinh giỏi mang giấy khen được miễn 1 đồ uống, gia đình đi kèm giảm 50% (chỉ mua tại quán);
  **sinh nhật giảm 50% một đơn vào đúng ngày sinh nhật**.
- Gia đình đi kèm: không giới hạn số món, miễn là cùng một hoá đơn. Sinh nhật: CHỈ đúng ngày; quầy đối chiếu CĂN CƯỚC thật — ngày sinh và tên
  trên căn cước phải khớp tài khoản (POS không lưu số căn cước). Sinh nhật giảm 50% CẢ ĐƠN, không giới hạn số món, một đơn trong ngày.
- Dính App: **ngày sinh của khách.** Đề xuất: App cho khách nhập ngày sinh MỘT lần trong hồ sơ; nhập rồi khách không tự sửa được (chỉ quán sửa
  sau khi xem căn cước), để chống đổi ngày sinh lấy ưu đãi. Nên ghi rõ cạnh ô: "Nhập đúng như căn cước — quán đối chiếu khi áp ưu đãi sinh nhật". App có thể hiện "Ưu đãi sinh nhật" trong tháng / ngày sinh nhật. Xin App cho biết hồ sơ hiện có trường
  ngày sinh chưa.
- Các chương trình chỉ áp tại quán → App chỉ HIỂN THỊ danh sách (tên + mô tả ngắn), không áp được trên đơn App. Có cần cửa
  `GET /chuong-trinh` không — App trả lời khi rảnh.

## 3b. Tài khoản nhận tiền đổi theo hộ kinh doanh (sau khai trương, đang thiết kế)
- Sau này quầy có thể nhận tiền về tài khoản của hộ kinh doanh khác theo ca (nhiều hộ làm chung); hoá đơn đổi theo hộ đó. Mỗi "đơn vị bán"
  có tài khoản ngân hàng + cài đặt SePay riêng; đổi đơn vị phải nhập PIN.
- Dính App: QR đơn App do POS tạo nên App không phải đổi gì; nhưng **App đừng ghi cứng tên người nhận / số tài khoản** ở đâu — nếu cần hiện,
  lấy từ dữ liệu POS trả về. Xin App kiểm hiện có chỗ nào ghi cứng không.

## 4. Không dính App (để biết)
- Màn khách đợt 2 (MANKHACH-2): hoá đơn hiện trên màn khách mọi cách thanh toán, khách nhập PIN trên màn khách, tiền mặt làm tròn 1.000
  (phần lẻ từ 600 tròn lên, 500 trở xuống tròn xuống),
  video lưu trên máy màn khách.
- Bán trên nền tảng (Grab / Shopee / Be): bảng giá riêng, sửa được giá từng món lúc nhập đơn, số đơn theo mã nền tảng; làm trước khai trương.
  Đơn App KH vẫn theo giá quầy.
- SePay (SEPAY-1): hợp đồng App lên v6, chỉ đổi câu chữ, App không sửa gì.
- Tốc độ (yêu cầu 01.11 của App): `maxAge` CORS sẽ đưa vào một phiếu nhỏ; vùng Render / Turso chủ quán đang xem.
