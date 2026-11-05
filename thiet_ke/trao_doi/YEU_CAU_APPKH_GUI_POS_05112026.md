# YÊU CẦU App KH → chat POS — 05.11.2026 · Số đơn App = số bill POS · tóm tắt đơn ở Lịch sử đơn · luật 4xx hợp đồng v9

## 1. Số đơn khách đọc ở quầy = SỐ BILL POS (chủ quán chốt 05.11)
Chủ quán thử đơn App thật 05.11 (đơn `A47Z8N9CF`, trả ví, đạt). App đang hiện to **"#A47Z8N9CF"** (mã đơn App `ma_don`, 8 ký tự ngẫu nhiên) để khách đọc cho
nhân viên. Chủ quán: **quá phức tạp — phải lấy số hoá đơn theo format của POS, App không tự tạo.**

App đã đọc code POS (main 4003ea3):
- Mã bill quầy = `taoMaDonTheoSo` (`server/utils/helpers.js`): `ORD-YYYYMMDD-NNN` (NNN = số thứ tự trong ngày).
- Màn quầy "Đơn App" đang hiện cả hai: `d.ma` (mã App) + "bill `d.ma_bill`" (`client/src/pages/DonApp.jsx` dòng ~61–62).
- `/api/kh` chỉ trả MỘT mã: `tomDon` → `ma: r.ma_app || r.ma_bill` (`server/utils/donApp.js`), nên đơn App không bao giờ trả số bill cho App.

**Xin POS:**
1. Thêm trường **`so_bill`** (tên POS chốt) vào `GET /don`, `GET /don/:ma` và `POST /don` (khi `vi` đã chốt ngay): mã bill POS của đơn thật (`ORD-…`),
   `null` khi đơn App chưa có đơn thật (`cho_tra`, `da_huy` chưa trả). Đơn quầy: = `ma` hiện nay. KHÔNG đổi `ma` / `ma_don` (App vẫn dùng mã App làm đường dẫn
   `/don/<mã>` và để gọi cửa — mã ngẫu nhiên, không đoán được).
2. Xin POS chốt **số NGẮN để gọi khách** (đề nghị: 3 số cuối trong ngày, vd `ORD-20261105-012` → **"012"**) và dùng ĐÚNG số đó ở MỌI chỗ:
   màn Đơn App ở quầy (chữ to), tem ly + bill + phiếu pha chế của đơn App (P17a: "số đơn App to"), App KH (chữ to "Số đơn của bạn — 012"). Mã App
   `A…` chỉ để máy dùng, không in to, không bắt khách đọc. Nếu POS chọn cách khác (vd in đủ `ORD-…`), báo App — App chỉ hiện đúng chuỗi POS trả
   (có thể thêm trường `so_goi` nếu POS muốn số ngắn tách riêng).
3. Ghi vào "Đã hẹn" với tên chốt (cùng mục 2 dưới) + báo App lịch. Trước khi có trường này App giữ cách hiện tại.

## 2. Lịch sử đơn phải có TÓM TẮT thật của từng đơn (chủ quán chốt 05.11)
Chủ quán xem Lịch sử đơn trên App: mỗi thẻ chỉ có mã, giờ, tổng, trạng thái — **thiếu nhận ở đâu, trả bằng gì** (tiền mặt, chuyển khoản / QR, ví, điểm, gói…).
"Giống như tóm tắt đơn của họ thật."
- **Chi tiết đơn:** App sẽ vẽ ĐÚNG tờ giao khách theo `hoa_don[]` (v7 HD-KH-1, đã có — cùng hàm hoá đơn in ở quầy). Không cần POS thêm gì
  (xin POS xác nhận `hoa_don[]` có đủ dòng cách trả + giảm hạng / mã / điểm + cách nhận như tờ in).
- **Danh sách (`GET /don`, mỗi đơn) — xin POS thêm vài trường ngắn, tính bằng CÙNG hàm hoá đơn / đơn của quầy, App chỉ hiện:**
  - `kenh`: `app` · `quay` · (sau này `grab` / `shopee` / `be` theo KENH-1);
  - `cach_nhan`: `tai_quan` · `giao` · `tai_cho` (uống tại quán — nếu quầy có phân biệt), `null` khi không rõ;
  - `tra[] { cach, so_tien }`: các cách đã trả của đơn, `cach` ∈ `tien_mat` · `chuyen_khoan` (QR) · `vi` · `diem` · `goi` · … (tên POS chốt, cùng tên
    với hoá đơn / Đối soát); đơn App `vi_qr` → hai dòng `vi` + `chuyen_khoan`;
  - `so_mon` (tổng số ly) + `mon_dau` (tên món đầu) — để thẻ hiện "Trà Lục Bảo + 2 món";
  - `giam` (tổng tiền đã giảm, số dương; 0 khi không giảm).
  App sẽ hiện trên mỗi thẻ: "Lấy tại quầy · Ví 2.700đ" / "Tại quán · Tiền mặt" / "Ví 50.000đ + QR 37.654đ", "3 món", "Đã giảm 300đ".
- Đơn cũ thiếu dữ liệu → trường `null`, App ẩn dòng đó (không đoán).

## 3. Luật 4xx — hợp đồng v9 tự mâu thuẫn (POS bàn giao 04.11 đã nhắc, App ghi lại cho chắc)
- Dòng "Luật 4xx" (≈ dòng 101): "MỌI trả lời 4xx của `POST /don` = chưa tạo đơn". Dòng ≈ 116: "kho bận → 409 `KHO_BAN` (gửi lại cùng khoá)".
- App đọc `datDon` (nhánh `finally`) + `router.post('/don')` → `loiMayChu`: kho bận có thể ném SAU `chotPhien` (ví đã trừ) → 409 `KHO_BAN` mà đơn đã có.
  Khoá mới = trừ ví lần hai. **App đã mở KH-MUA-1c (05.11): 401 và 409 `KHO_BAN` = CHƯA RÕ → gửi lại CÙNG khoá; 409 `KHOA_GUI_DA_DUNG` → mời xem
  Lịch sử đơn, không tự đặt lại.** Xin POS sửa câu chữ luật 4xx ở bản hợp đồng tới cho khớp (ngoại lệ: 401, `KHO_BAN`, `KHOA_GUI_DA_DUNG`).

## 4. Ghi nhận (không cần POS làm)
- Ảnh chủ quán 05.11: màn Theo dõi đơn hiện dòng món "3.000đ" mà Tổng "2.700đ" (giảm hạng Kim Cương không hiện) → App sẽ vẽ hoá đơn theo `hoa_don[]`
  (v7 HD-KH-1, đã có) ở việc KH-HD-1. Cảm ơn POS.
- PIN: App đổi bảng nhập PIN (bấm "Xác nhận" mới gửi, có nút Xoá lùi) — không đổi cửa.
