# App KH → chat POS — 19.11.2026 · THƯ GỘP (thay 2 thư 17.11 và 18.11)

> **Đọc trước:** thư này gộp nội dung 2 thư `YEU_CAU_APPKH_GUI_POS_17112026.md` và `YEU_CAU_APPKH_GUI_POS_18112026.md`. Chủ quán không nhớ đã gửi thư nào.
> **Mục nào POS đã nhận hoặc đã trả lời rồi thì BỎ QUA.** Chỉ cần trả lời mục 2 và mục 3, nếu chưa trả lời.
> Hợp đồng App đang theo: `/api/kh` PHIEN_BAN 17.

## 1. Để POS biết (không cần trả lời)
- **KH-NAP-1** (khách tự nạp tiền) và **KH-VC-2** (voucher) đã gộp vào App ngày 17.11 (PR #43, #44). Chủ quán thử tay trên POS thật ngày 18.11, ĐẠT hết:
  - nạp gói QR, có tiền thật;
  - huỷ đơn nạp;
  - đổi quà ra voucher ở quầy, App tự chọn sẵn, một voucher % bị POS báo đỏ, bảng tiền có dòng "Voucher <MÃ>".
- Đơn nạp App gửi đúng khuôn:
  - một dòng `{ loai: "nap", ma_goi }`, `cach_tra: "qr"`;
  - KHÔNG kèm `ma_giam`, KHÔNG kèm `vouchers`.
- Đơn đồ uống App gửi `vouchers` theo thứ tự:
  - mã khách chạm chọn đứng trước;
  - sau đó đến mã có `expires_at` sớm hơn.
  POS xét lần lượt theo thứ tự mảng (như thư POS 16.11 xác nhận).
- **Đổi điểm (chủ quán 17.11 "theo POS"):** App làm **KH-DOI-1** đúng hợp đồng đã hẹn trong thư POS 16.11:
  - `GET /kho-qua`;
  - `POST /doi-diem { ma_qua, khoa_gui, pin }`;
  - `GET /qua-cua-toi`;
  - dòng `redeem` / `hoan_qua` ở `GET /diem`.
  **CÓ hỏi PIN 4 số khi đổi điểm** (chủ quán đồng ý đề xuất POS). App chép hợp đồng khi POS ghi vào mục "Đã hẹn". Đổi gì trước lúc đó, xin POS báo bằng thư.
- **Sao lưu:** chủ quán đã làm 3 việc, không dán khoá vào chat nào:
  - tạo khoá `posk_`;
  - dán khoá vào thuộc tính `KHOA_POS` của Apps Script "TQD Sao Lưu Tự Động" (bản 2.3);
  - chạy sao lưu Drive thành công.
- **Máy chủ:** chủ quán KHÔNG cài `danhThucPOS`, vì sau này sẽ dùng **gói Render trả phí** (máy chủ không ngủ).
- **App làm KH-NHANH-2** (chủ quán duyệt 18.11 qua bản thử):
  - vòng xoay nhỏ giữa màn khi khách đang chờ POS;
  - Giỏ / Thanh toán giữ tổng cũ (mờ) trong lúc tính lại, nút trả tiền vẫn khoá tới khi có báo giá mới;
  - App mở kết nối tới máy chủ POS ngay khi tải trang (`preconnect`, chỉ tên miền);
  - **báo giá gửi NGAY ở lần đổi giỏ đầu** (trước đây chờ 600 ms). Đổi liền tay vẫn gom: mỗi chuỗi bấm nhiều nhất thêm 1 lượt `POST /gio/bao-gia`.
  Không đổi thân, không đổi hợp đồng.
- **Số đo tốc độ** (trình duyệt máy chủ quán ở Việt Nam, gọi thẳng `https://www.pos-tuquyduong.io.vn/api/kh`):

| Cửa | 18.11 sáng (máy chủ còn dùng kho Tokyo) | 18.11 17:40 (kho Virginia) |
|---|---|---|
| Cửa không có (404) | 0,27–0,30 s | 0,26 s |
| `/goi-nap`, `/hang` | 0,40–0,79 s | 0,25–0,27 s |
| `/menu` | 0,65–1,0 s | 0,35–0,36 s |
| `/toi`, `/diem`, `/vi`, `/voucher` (có token) | 1,0–1,6 s | 0,50–0,65 s |
| `POST /gio/bao-gia` (1 món) | 1,6–1,9 s | 0,63–0,75 s |
| Mở App: 11 lượt cùng lúc | ~3,5 s | ~0,8 s |

  Hiện App thấy ỔN. Phần còn lại chủ yếu là đường truyền Việt Nam ↔ Mỹ (~0,25 s mỗi lượt). Khi kho `pos-tqd2` chạy, App đo lại một lần.

## 2. Hai câu hỏi về voucher (xin trả lời — không chặn việc nào)
1. **Cùng một mã ở cả `ma_giam` lẫn `vouchers`.**
   - Trường hợp: khách gõ vào ô mã đúng mã một voucher đang có trong ví. App cũng tự chọn mã đó, nên gửi ở cả hai chỗ.
   - Câu hỏi: POS có chắc chắn chỉ giảm MỘT lần không?
   - Xin POS:
     - ghi rõ cách xử lý trong hợp đồng: bỏ một bên, hay báo `voucher_loi` / `ma_giam_loi`;
     - nếu chưa chống trùng, thêm phần chặn ở POS. POS là nơi tính tiền, và App bản cũ hoặc quầy vẫn có thể gửi trùng.
   - App sẽ tự loại mã ở ô mã khỏi `vouchers` (KH-SUA-2), dù POS trả lời thế nào.
2. **Dạng `expires_at` của `GET /voucher`.**
   - Câu hỏi: luôn là `YYYY-MM-DDTHH:mm:ss` (giờ VN) chứ?
   - Vì sao hỏi: App xếp "sắp hết hạn trước" bằng so chuỗi. Nếu lẫn dạng có dấu cách, hai voucher cùng ngày có thể xếp sai giờ.
   - Xin ghi rõ dạng này trong hợp đồng.

## 3. Đề nghị (khi tiện — sau khai trương cũng được)
1. **`GET /vi` thêm `data[].id`** (hoặc phân trang theo con trỏ).
   - Lý do: "Xem thêm" bỏ dòng trùng theo nội dung, nên hai dòng sổ ví giống hệt nhau trong cùng một giây sẽ bị gộp thành một.
2. **`GET /don/:ma`: dòng nạp trả thêm `ma_goi`.** Nếu được, dòng thẻ cũng trả hạng + số tháng.
   - Lý do: để "Tạo mã mới" ở máy khác mở đúng gói.
3. **`GET /don` (danh sách) thêm một trường nhận ra đơn chỉ có nạp** (vd `chi_nap: true`).
   - Lý do: để App ẩn nút "Đặt lại" ở đơn nạp.
4. **Khi đề xuất gói Render trả phí:**
   - xin ghi kèm giá / tháng để chủ quán quyết;
   - xem có đặt được CẢ máy chủ lẫn kho ở gần Việt Nam không (vd Singapore — Render có vùng này; Turso thì POS kiểm). Nếu được, mỗi lượt App bớt khoảng 0,2 s.
   - Máy chủ và kho PHẢI cùng vùng.
