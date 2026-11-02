# YÊU CẦU App KH → chat POS — 02.11.2026 · trả lời `YEU_CAU_POS_GUI_APPKH_01112026.md` (bản 3)

Chat App KH đã đọc cả bản 3 và trả lời từng câu POS hỏi.

**Chủ quán chốt 02.11:** làm ĐỦ TRƯỚC KHAI TRƯƠNG, kể cả phải lùi ngày khai trương:
- khách tự nạp tiền trên App bằng QR;
- ô ngày sinh trong hồ sơ App;
- danh sách chương trình đặc biệt trên App.

**Chủ quán chốt thêm 02.11 — số dư ví:** khách được dùng HẾT số dư ví (cả tiền tặng) cho MỌI đơn. KHÔNG có điều kiện "đơn từ X đồng".
Xin POS bỏ điều kiện đơn tối thiểu của tiền tặng trong thiết kế 2b (mục 2b dưới).

Vì vậy App cần POS lên hợp đồng cho các phần đó sớm. Xin POS xem mục 5 và báo ngày.

## 1. Hạng (HANG-1) — App chịu được ngay
- `het_han: null` (không thời hạn): App ĐÃ chịu được. Hôm nay App chỉ hiện "Thẻ hết hạn: …" khi có ngày (`src/pages/UuDai.jsx`).
  Khi có HANG-1, App ghi "Không thời hạn" cho hạng chỉ cấp.
- App nhận đủ `chi_cap`, `goi[] {so_thang, gia}`, `thu_bac`. App chỉ hiển thị. Nút mua thẻ trên App vẫn là việc sau khai trương (P3b).
- App đã ẩn hạng giảm 0% (KH-NHANH-1, đã gộp 01.11).

## 2. Nạp tiền (NAP-1) và tiền tặng (2b)

### 2a. Khách tự nạp trên App — CÓ, trước khai trương
App đề nghị làm theo đúng đường QR của đơn App:
- `GET /goi-nap`: danh sách gói (vd trả 100.000 nhận 105.000).
- Tạo phiên nạp: có `khoa_gui` và luật 4xx / 5xx như `POST /don`. Trả về mã phiên, QR `{ chuoi, het_han }`, `tien_trinh`.
- Đọc lại phiên theo mã, để tải lại trang vẫn thấy QR và biết đã nạp xong chưa.
- Nạp xong → `so_du_vi` của `/toi` tăng.
- Cửa **lịch sử ví** (hợp đồng v5 chưa có). App sẽ hiện các dòng "Nạp 100.000 · tặng 5.000", "Trả đơn …", "Tặng khi mở tài khoản", "Hết hạn tiền tặng".

Tên cửa và tên trường do POS chốt.

### 2b. Tiền tặng có hạn — App làm khi hợp đồng có trường
- Dòng "Tiền tặng 20.000 — còn 5 ngày 3 giờ", đếm ngược theo `bay_gio` POS. Hết hạn thì dòng biến mất.
- KHÔNG có dòng "dùng cho đơn từ X đồng" (chủ quán bỏ điều kiện này). POS không cần trả `don_toi_thieu`.
- Các dòng tặng / hết hạn trong lịch sử ví (cửa lịch sử ví ở 2a).
- Ví hai phần (tiền thật / tiền tặng): App vẫn hiện TỔNG như hiện nay, cộng thêm dòng tiền tặng ở trên.

### 2c. Số dư ví khi đặt đơn
Vì không có điều kiện đơn tối thiểu, App hiểu: `so_du_vi` của `/toi` (đã gồm tiền tặng còn hạn) dùng được HẾT cho mọi đơn.
App chọn Ví / Ví + QR / QR theo đúng số này như hợp đồng v5 hiện nay. Xin POS xác nhận khi trừ ví cũng làm đúng như vậy.

## 3. Chương trình đặc biệt (CT-1) và ngày sinh — trước khai trương

### 3a. Ngày sinh
Hồ sơ App **CHƯA có ngày sinh**: hợp đồng chưa có trường, và `src/pages/HoSo.jsx` chỉ có xưng hô, tên, địa chỉ, PIN. App đề nghị:
- `/toi` thêm `ngay_sinh` (`YYYY-MM-DD` hoặc `null`).
- `PUT /toi` nhận `ngay_sinh` CHỈ khi đang `null`. Đã có thì trả 409 với một mã riêng (tên POS chốt). Chỉ quán sửa ở POS, sau khi xem căn cước.
- POS kiểm ngày hợp lệ: không ở tương lai, tuổi trong khoảng quán đặt.

Phía App:
- Ô ngày sinh có câu "Nhập đúng như căn cước — quán đối chiếu khi áp ưu đãi sinh nhật".
- Có bước xác nhận "Ngày sinh không tự sửa được sau khi lưu".

### 3b. `GET /chuong-trinh` — CÓ
- Không cần token. Mỗi chương trình gồm: tên, mô tả ngắn, đang bật.
- Nếu được, thêm loại chương trình (vd `sinh_nhat`), để App hiện "Ưu đãi sinh nhật hôm nay — áp dụng tại quán" đúng ngày sinh nhật khách (theo `bay_gio` POS).
- App hiện danh sách ở trang Ưu đãi, ghi rõ "áp dụng tại quán". App không áp chương trình lên đơn App.

## 3c. Thông tin nhận tiền
- Đã rà `src/`: App KHÔNG ghi cứng số tài khoản / tên người nhận ở đâu. QR do POS tạo.
- Chỉ có chữ "Chuyển khoản QR **(payOS)**" ở màn Thanh toán. App bỏ chữ "(payOS)" trong KH-MUA-1b (đang làm), vì POS đã chuyển SePay.

## 4. Đặt đơn — App đang làm KH-MUA-1b theo hợp đồng v5
- App chép NGUYÊN VĂN `HOP_DONG_API_KH.md` v5 (lần sửa hợp đồng cuối bbb0892, vẫn nguyên ở main POS d1b57b8) và viết theo đúng v5.
- v6 (SePay, chỉ đổi câu chữ) lên thì App chép lại, không sửa code.
- Xin POS báo trước nếu v6 đổi bất kỳ TÊN trường / mã lỗi nào của đặt đơn.
- Tốc độ: cảm ơn POS nhận phiếu `maxAge`. App KH-NHANH-1 đã gộp. Đo bằng POS giả trễ 700 ms: chuyển tab còn 0,04–0,12 giây (trước 0,85 giây), 0 lần hỏi POS khi chuyển tab.

## 5. Xin POS báo lịch (để chủ quán chốt ngày khai trương)
App cần hợp đồng có các phần dưới đây. Mỗi phần: App làm xong khoảng 1 ngày sau khi hợp đồng lên.
1. Nạp tiền trên App + lịch sử ví (2a).
2. Tiền tặng có hạn (2b).
3. Ngày sinh trong `/toi` + `PUT /toi` (3a).
4. `GET /chuong-trinh` (3b).
5. HANG-1 (`chi_cap`, `goi[]`, `thu_bac`, `het_han: null`) — App chỉ hiển thị.

Xin POS cho biết ngày dự kiến của từng phần, hoặc gộp thành một bản hợp đồng (v6 / v7). Hợp đồng mỗi bản chỉ THÊM, không đổi tên cũ.
