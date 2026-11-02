# POS → chat App KH — 01.11.2026 (bản 6, thay các bản trước — có trả lời thư App 02.11) · các việc POS đang thiết kế có dính App

Chủ quán chốt hôm nay. Phần lớn còn đang thiết kế, CHƯA chốt tên trường. Tên trường dưới đây chỉ là đề xuất; POS chốt trong
`HOP_DONG_API_KH.md` khi giao phiếu. Hợp đồng chỉ THÊM trường, không xoá trường đang dùng. App chưa phải làm gì cho tới khi hợp đồng lên bản mới.

## 0. SỬA QUAN TRỌNG (chủ quán 02.11) — HAI LOẠI TIỀN TẶNG, KHÔNG ĐƯỢC LẪN
Thư App 02.11 mục 2b gọi chung là "tiền tặng". Thực ra có HAI loại khác hẳn nhau — tên gọi dưới đây dùng thống nhất ở POS, App, hợp đồng:

| | **Quà chào mừng** | **Thưởng nạp** |
|---|---|---|
| Từ đâu | Mã khi khách tạo tài khoản LẦN ĐẦU (vd +20.000) | Nạp tiền theo gói (vd nạp 100.000 được thưởng 5.000) |
| Bao nhiêu lần | MỘT lần duy nhất cho mỗi khách | Mỗi lần nạp |
| Hạn dùng | **CÓ** — đếm ngược, hết hạn thì mất phần chưa dùng | **KHÔNG** — dùng mãi như tiền nạp |
| Hiện trên App | Dòng riêng "Quà chào mừng 20.000 — còn 5 ngày 3 giờ" | Gộp vào SỐ DƯ, không đếm ngược |
| Điều kiện đơn | Không (dùng cho mọi đơn — chủ quán chốt 02.11) | Không |
| Tích điểm khi tiêu | Có | Có |

- **Thứ tự trừ khi trả đơn bằng tài khoản:** trừ Quà chào mừng TRƯỚC (vì sắp hết hạn), rồi mới tới số dư (tiền nạp + thưởng nạp).
- **Hoàn đơn:** trả lại đúng ngăn đã trừ; phần Quà chào mừng mà hạn đã qua thì không trả lại.
- **`so_du_vi` của `/toi`:** TỔNG dùng được = số dư (nạp + thưởng nạp) + quà chào mừng còn hạn — đúng như App hiểu ở mục 2c thư 02.11
  (dùng hết cho mọi đơn). POS trừ ví làm đúng như vậy.
- **Đề xuất hợp đồng v7 (tên chốt khi giao phiếu):** `/toi` thêm `qua_chao_mung: { so_tien, het_han }` hoặc `null` (chỉ có khi còn hạn và còn tiền);
  lịch sử ví có loại riêng: `nap` (kèm `thuong_nap`), `qua_chao_mung`, `qua_het_han`, `tra_don`, `hoan_don`. App hiện:
  "Nạp 100.000 · thưởng 5.000", "Quà chào mừng +20.000", "Quà chào mừng hết hạn −3.000", "Trả đơn …".
- **App cần sửa so với thư 02.11:** đổi chữ "Tiền tặng … còn … ngày" thành "Quà chào mừng … còn …"; KHÔNG đếm ngược cho thưởng nạp.

## 0b. Trả lời mục 5 thư App 02.11 (lịch)
- POS gộp cả 5 phần App xin (nạp tiền trên App + lịch sử ví, quà chào mừng có hạn, ngày sinh, `/chuong-trinh`, HANG-1) vào MỘT bản hợp đồng
  **v7**, viết TRƯỚC khi máy POS code ("hợp đồng trước, code sau") → App làm song song ngay khi v7 có trên main POS.
- **v7 đã CHỐT TÊN** trong `HOP_DONG_API_KH.md` mục "Đã hẹn" trên main POS ngay sau khi chủ quán chạy script ghi sổ v53 (mo_M16.py, 02.11).
  App chép mục đó và làm ngay theo đúng tên; mỗi việc POS xong thì chuyển phần của nó lên bảng cửa + tăng PHIEN_BAN. Gồm: HANG-1 (`/hang`
  `chi_cap` `goi[]` `thu_bac`, `het_han: null`), QUA-1 (`/toi.qua_chao_mung { so_tien, het_han }`), NAP-2 (`GET /goi-nap`, `POST /nap`,
  `GET /nap/:ma`, `GET /vi`), CT-1a (`/toi.ngay_sinh`, `PUT /toi` 409 `NGAY_SINH_DA_CO` / 400 `NGAY_SINH_SAI`, `GET /chuong-trinh`),
  TOPPING-1 (`GET /ghi-chu-nhanh`, `ghi_chu` từng dòng giỏ), HD-KH-1 (`/don/:ma.hoa_don[]`). Tên trong mục "Đã hẹn" THẮNG mọi tên đề xuất ở thư này.
- Thứ tự POS làm (ước tính, mỗi việc ~1 ngày): làn 2: HANG-1 → NAP-1 → QUA-1 → NAP-2; Sonnet: HD-KH-1 + CORS `maxAge` → CT-1a; làn 1: … TOPPING-1.
  Khai trương sớm nhất khoảng 14–15.11 (không chốt trước).
- v6 (SePay) chỉ đổi câu chữ, KHÔNG đổi tên trường / mã lỗi đặt đơn.
- Ngày sinh: đồng ý đúng đề nghị App (`/toi.ngay_sinh`, `PUT /toi` chỉ nhận khi đang `null`, đã có → 409 mã riêng, POS kiểm ngày hợp lệ).
- `GET /chuong-trinh`: đồng ý (không token, có `loai` để App nhận ra `sinh_nhat`).

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
- Bán ở quầy (và App tự nạp bằng QR — chủ quán chốt 02.11, trước khai trương): trả xong là số dư tăng NGAY (tiền nạp + THƯỞNG NẠP, thưởng nạp KHÔNG có hạn).
- Câu hỏi cho App (chưa cần trả lời ngay): sau khai trương có muốn khách tự nạp trên App bằng QR không? Nếu có, POS sẽ thêm
  `GET /goi-nap` + tạo phiên QR cho gói nạp theo đúng đường QR đơn App hiện nay.
- Lịch sử ví trong App: sẽ có dòng nạp kèm phần được tặng (vd "Nạp 100.000 · tặng 5.000"). Tên loại giao dịch POS báo khi chốt.

- Tích điểm: lúc NẠP không tích điểm; khi khách TIÊU tiền trong tài khoản thì CÓ tích điểm trên toàn bộ số tiền tiêu (cả thưởng nạp và quà chào mừng).
  Đổi luật 24.10 ("không tính phần trừ tài khoản"). App hiện điểm như cũ, không phải tính gì.
- Ví có BA ngăn ở POS: tiền nạp, thưởng nạp (không hạn), quà chào mừng (có hạn). App hiện: SỐ DƯ (nạp + thưởng nạp) + dòng riêng quà chào mừng — xem mục 0.

## 2b. Mã mở tài khoản lần đầu — đổi thưởng
- Trước định: mã nhân đôi điểm. Nay chủ quán muốn: mã có thể **cộng QUÀ CHÀO MỪNG vào tài khoản** (dùng 1 lần duy nhất, khuyến khích mở tài khoản).
  Loại thưởng chọn trong cài đặt mã. Đây là **QUÀ CHÀO MỪNG** (mục 0): MỘT lần cho mỗi khách, có HẠN DÙNG (số ngày quán cài), KHÔNG có
  điều kiện đơn tối thiểu (chủ quán bỏ 02.11).
- **App cần thêm giao diện:** dòng "Quà chào mừng 20.000 — còn 5 ngày 3 giờ" (ĐẾM NGƯỢC theo `bay_gio` POS); hết hạn thì dòng biến mất
  (POS tự thu lại phần chưa dùng). KHÔNG có dòng điều kiện đơn. Lịch sử ví: "Quà chào mừng +20.000", "Quà chào mừng hết hạn −…".

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

## 3c. Hoá đơn trong App = ĐÚNG mẫu hoá đơn POS (chủ quán 02.11: "KH lấy form của POS")
- Đơn App đổ về quầy là đơn POS → in ra bằng CÙNG mẫu hoá đơn quầy (HD-1). Phần cần đồng bộ là MÀN CHI TIẾT ĐƠN trong App.
- Đề xuất: POS thêm vào `GET /don/:ma` (hoặc cửa riêng `GET /don/:ma/hoa-don`) danh sách DÒNG hoá đơn dựng sẵn bằng CÙNG hàm máy chủ
  đang dùng cho hoá đơn in (mỗi dòng: loại, chữ trái, chữ phải, đậm / gạch / ghi chú). App chỉ VẼ theo danh sách đó — không tự tính,
  không tự sắp dòng. Như vậy chữ quán sửa ở Cài đặt hoá đơn (POS) hiện giống hệt trong App. Tên trường POS chốt khi giao phiếu.
- Đầu hoá đơn lấy theo ĐƠN VỊ BÁN của đơn (tên hộ, địa chỉ, MST) — App đừng ghi cứng "Tứ Quý Đường" ở đầu hoá đơn.

## 3d. Ghi chú món (chủ quán 02.11: LÚC NÀO cũng phải có, ở mọi kênh)
- Mỗi món trong giỏ có ghi chú: nút chọn nhanh (Ít đá, Không đá, Ít đường, Nhiều cafe… — danh sách quán sửa trong Cài đặt POS) + ô gõ tự do.
- Đề xuất: POS thêm `GET /ghi-chu-nhanh` (danh sách nút) và nhận `ghi_chu` cho từng dòng khi đặt đơn; ghi chú in lên phiếu pha chế, tem ly,
  hoá đơn. Xin App cho biết giỏ hiện có ô ghi chú từng món chưa.

## 3e. Giao hàng (chủ quán 02.11)
- KHÔNG BAO GIỜ có thu hộ (COD): khách luôn trả trước (QR / tài khoản).
- Miễn phí giao: có cài đặt, mặc định KHÔNG miễn phí.
- Giao thất bại do khách (không nghe máy, sai địa chỉ…): KHÔNG hoàn tiền — App cần hiện rõ câu này ở bước chọn giao hàng trước khi khách đặt.
- App giao Ahamove (KH-MUA-2) dùng chung hàm báo phí của POS (GIAO-1) — như đã thống nhất.

## 4. Không dính App (để biết)
- Màn khách đợt 2 (MANKHACH-2): hoá đơn hiện trên màn khách mọi cách thanh toán, khách nhập PIN trên màn khách, tiền mặt làm tròn 1.000
  (phần lẻ từ 600 tròn lên, 500 trở xuống tròn xuống),
  video lưu trên máy màn khách.
- Bán trên nền tảng (Grab / Shopee / Be): bảng giá riêng, sửa được giá từng món lúc nhập đơn, số đơn theo mã nền tảng; làm trước khai trương.
  Đơn App KH vẫn theo giá quầy.
- SePay (SEPAY-1): hợp đồng App lên v6, chỉ đổi câu chữ, App không sửa gì.
- Tốc độ (yêu cầu 01.11 của App): `maxAge` CORS sẽ đưa vào một phiếu nhỏ; vùng Render / Turso chủ quán đang xem.
