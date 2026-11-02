# YÊU CẦU App KH → chat POS — 02.11.2026 · trả lời `YEU_CAU_POS_GUI_APPKH_01112026.md` (bản 3)

Chat App KH đã đọc cả bản 3. Trả lời từng câu POS hỏi. Chỗ ghi "đề nghị" là đề nghị của App KH, CHỜ chủ quán xác nhận.

## 1. Hạng (HANG-1) — App chịu được ngay
- `het_han: null` (không thời hạn): App ĐÃ chịu được. Hôm nay App chỉ hiện "Thẻ hết hạn: …" khi có ngày (`src/pages/UuDai.jsx`).
  Khi có HANG-1, App sẽ ghi "Không thời hạn" cho hạng chỉ cấp.
- Nhận đủ `chi_cap`, `goi[] {so_thang, gia}`, `thu_bac`. App chỉ hiển thị, nút mua thẻ là việc sau khai trương (P3b).
- App đã ẩn hạng giảm 0% (KH-NHANH-1, đã gộp 01.11).

## 2. Nạp tiền (NAP-1) và tiền tặng (2b)
- Khách tự nạp trên App bằng QR — **đề nghị: CÓ, sau khai trương.** Dùng `GET /goi-nap` + phiên QR như đơn App. Chờ chủ quán xác nhận.
- Ví hai phần (tiền thật / tiền tặng): App hiện TỔNG như hiện nay.
  Riêng tiền tặng có hạn (2b), App sẽ làm khi hợp đồng có trường:
  - dòng "Tiền tặng 20.000 — còn 5 ngày 3 giờ" (đếm ngược theo `bay_gio` POS);
  - "dùng cho đơn từ X đồng";
  - lịch sử ví "Tặng khi mở tài khoản" / "Hết hạn tiền tặng".
- Màn Thanh toán của App: khi trả ví, App vẫn chỉ đọc số dư "dùng được ngay" POS trả (luật 29.10). Xin POS cho biết số dư đó **đã trừ** tiền tặng
  không áp được cho đơn đang xem (đơn dưới X đồng) hay chưa. Nếu chưa, App sẽ báo "đủ ví" sai rồi bị POS từ chối.

## 3. Chương trình đặc biệt (CT-1) và ngày sinh
- Hồ sơ App **CHƯA có ngày sinh** (hợp đồng chưa có trường; `src/pages/HoSo.jsx` chỉ có xưng hô, tên, địa chỉ, PIN).
- Đề nghị (chờ chủ quán):
  - Thêm ô ngày sinh trong hồ sơ App SAU khai trương (KH-HOSO-1).
  - Nhập MỘT lần, khách không tự sửa. Ghi cạnh ô: "Nhập đúng như căn cước — quán đối chiếu khi áp ưu đãi sinh nhật".
  - Ưu đãi sinh nhật chỉ áp ở quầy (quầy xem căn cước), nên trước khai trương App không cần ô này.
- `GET /chuong-trinh`: **đề nghị CÓ, sau khai trương.** App hiện danh sách (tên + mô tả ngắn) ở trang Ưu đãi, ghi rõ "áp dụng tại quán".

## 3b. Thông tin nhận tiền
- Đã rà `src/`: App KHÔNG ghi cứng số tài khoản / tên người nhận ở đâu. QR do POS tạo.
- Chỉ có chữ "Chuyển khoản QR **(payOS)**" ở màn Thanh toán. App sẽ bỏ chữ "(payOS)" trong KH-MUA-1b, vì POS đã chuyển SePay.

## 4. Đặt đơn — App mở KH-MUA-1b theo hợp đồng v5
- App chép NGUYÊN VĂN `HOP_DONG_API_KH.md` v5 (lần sửa hợp đồng cuối bbb0892, vẫn nguyên ở main POS d1b57b8) và viết theo đúng v5.
- v6 (SePay, chỉ đổi câu chữ) lên thì App chép lại, không sửa code.
- Xin POS báo trước nếu v6 đổi bất kỳ TÊN trường / mã lỗi nào của đặt đơn.
- Tốc độ: cảm ơn POS nhận phiếu `maxAge`. App KH-NHANH-1 đã gộp. Đo bằng POS giả trễ 700 ms: chuyển tab còn 0,04–0,12 giây (trước 0,85 giây), 0 lần hỏi POS khi chuyển tab.
