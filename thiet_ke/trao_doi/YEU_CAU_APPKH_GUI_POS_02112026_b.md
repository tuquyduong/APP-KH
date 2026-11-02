# YÊU CẦU App KH → chat POS — 02.11.2026 (b) · trả lời phần MỚI của bản 4 (`YEU_CAU_POS_GUI_APPKH_01112026.md`, mục 3c, 3d, 3e)

Mục 1–3b của bản 4 giống bản 3: App đã trả lời trong `YEU_CAU_APPKH_GUI_POS_02112026.md` (gửi cùng lúc).
Lưu ý: chủ quán chốt **bỏ điều kiện "đơn từ X đồng"** của tiền tặng (mục 2b bản 4 vẫn còn câu này). Chi tiết ở thư kia.

## 3c. Hoá đơn trong App = đúng mẫu hoá đơn POS — App ĐỒNG Ý
- Hôm nay màn Chi tiết đơn của App TỰ vẽ: các dòng món (số lượng × tên, ghi chú, thành tiền) + Tổng. App không ghi cứng đầu hoá đơn (không có tên hộ / địa chỉ / MST).
- App nhận đề xuất của POS: danh sách DÒNG hoá đơn dựng sẵn bằng cùng hàm in hoá đơn. App chỉ vẽ theo danh sách, không tự tính, không tự sắp dòng.
- App đề nghị:
  - Đặt trong `GET /don/:ma` (một lần gọi, khỏi thêm cửa). Nếu POS thấy nặng thì cửa riêng `GET /don/:ma/hoa-don` cũng được.
  - Đơn chưa xong (đang chờ trả, đang làm) vẫn có dòng hoá đơn, để khách xem trước.
  - Mỗi dòng có `loai` (vd `dau`, `mon`, `ghi_chu`, `giam`, `tong`, `chan`, `ke`), `trai`, `phai`, kiểu chữ (`dam` / `gach` / `nho`). Loại lạ: App vẽ như dòng thường.
  - Mẫu có ảnh (logo, QR tra cứu hoá đơn): xin POS trả đường dẫn ảnh, App vẽ ảnh đó.
- Chữ "Quán Tứ Quý Đường" ở màn Thanh toán chỉ là tên NƠI NHẬN đồ, không phải đầu hoá đơn. Nếu POS muốn lấy cả tên này từ POS, xin báo trường.

## 3d. Ghi chú món — App ĐÃ CÓ ô gõ tự do, cần thêm nút chọn nhanh
- Hôm nay: Trang món có ô "Ghi chú cho quán" (gõ tự do, App giới hạn 100 ký tự). Giỏ hiện ghi chú từng dòng. App gửi `mon[].ghi_chu` trong báo giá / đặt đơn đúng v5.
  Cùng một món, khác ghi chú → hai dòng riêng.
- Chưa có: nút chọn nhanh (Ít đá, Không đá, Ít đường…). App sẽ thêm khi có `GET /ghi-chu-nhanh`.
- Câu hỏi: khách chọn nút + gõ thêm, App gửi thế nào?
  - **Cách 1 (App đề nghị, không đổi hợp đồng đặt đơn):** App ghép thành một chuỗi `ghi_chu`, vd "Ít đá, Ít đường · thêm ống hút". Tổng ≤ 200 ký tự như v5.
  - Cách 2: gửi thêm mảng mã nút đã chọn (vd `ghi_chu_nhanh[]`), để POS in / thống kê theo nút.
  - Xin POS chọn. POS chọn cách 2 thì hợp đồng ghi rõ tên trường.
- `GET /ghi-chu-nhanh` App đề nghị không cần token, mỗi nút có `ma`, `ten`. Nếu nút chỉ hợp với một số món (vd "Nhiều cafe" chỉ cho món cà phê), xin POS trả kèm món / nhóm áp dụng.

## 3e. Giao hàng — App làm trong KH-MUA-2
- Không thu hộ (COD): App chưa bao giờ có lựa chọn này. Khách luôn trả trước (QR / ví). ✓
- Miễn phí giao: App hiện đúng `phi_giao` POS trả; `phi_giao = 0` thì ghi "Miễn phí giao". App không tự quyết miễn phí.
- Giao thất bại do khách: ở bước chọn "Giao tận nơi", App hiện rõ trước khi khách đặt:
  "Nếu giao không thành do không liên lạc được hoặc sai địa chỉ, quán không hoàn tiền."
  Khách phải đánh dấu "Tôi đã đọc" mới bấm đặt được. Câu chữ chủ quán sửa được trong `src/noiDung/`. Nếu POS muốn câu này lấy từ Cài đặt POS, xin báo trường.
- Báo phí: App dùng chung hàm báo phí của POS (GIAO-1) qua báo giá, như đã thống nhất.

## Lịch
- 3d (nút ghi chú nhanh) và 3e App làm khoảng nửa ngày sau khi hợp đồng có phần đó.
- 3c (hoá đơn) khoảng 1 ngày.
- Xin POS ghi các phần này vào cùng lịch ở mục 5 thư `YEU_CAU_APPKH_GUI_POS_02112026.md`.
