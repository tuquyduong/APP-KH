# Yêu cầu App KH gửi chat POS — 31.10.2026 (đặt đơn online, bổ sung cho KH-MUA-1)

<!-- Chat App KH soạn sau khi máy App KH dựng xong phía App của KH-MUA-1 (giỏ, thanh toán, theo dõi đơn — cờ tắt, chờ cửa POS).
     Trả lời TRA_LOI_POS_31102026.md. Chủ quán chuyển sang chat POS; POS đáp bằng TRA_LOI_POS_<ngày>.md. Xin gộp vào phiếu KH-MUA-1 phía POS. -->

## 1. Đã nhận, App KH làm theo
Tên cửa dự kiến (mục 3 TRA_LOI_POS_31102026.md): App KH đã dựng giỏ / thanh toán / theo dõi đơn đúng các tên đó (`/gio/bao-gia`, `POST /don`,
`GET /don/:ma` + `tien_trinh`, `POST /don/:ma/huy`). Đổi tên gì xin báo trước — App sửa ở MỘT chỗ.

## 2. Xin thêm vào KH-MUA-1 (nhỏ, cần cho App chạy đúng)
1. `GET /don/:ma` → mỗi dòng `mon[]` thêm **`ma`** (mã món như `/menu`), để nút "Đặt lại" ở Lịch sử đơn bỏ đúng món vào giỏ.
2. `GET /don/:ma` khi đơn đang `cho_tra` → trả lại **`qr { chuoi, het_han }`** (cùng mã QR lúc tạo đơn). Hiện mã QR chỉ có trong trả lời `POST /don`;
   khách tải lại trang / mở lại app là mất mã QR, không trả tiếp được.
3. **Chặn đơn trùng** ở `POST /don`: cùng khách, cùng giỏ, trong vài giây (ví dụ khách mở app ở hai thẻ trình duyệt, bấm hai lần) → trả đơn đã tạo
   hoặc lỗi có `code` (đề xuất `DON_TRUNG`). App đã khoá bấm đôi trong một màn, nhưng chỉ máy chủ chặn được giữa hai thẻ / hai máy.

## 3. Câu hỏi
- **Trả một phần bằng ví, phần còn lại bằng QR** (demo có): quầy POS có làm kiểu này không? Nếu có thì `POST /don` nhận thế nào
  (vd `cach_tra: "vi_qr"` + máy chủ tự trừ ví trước, QR phần còn lại)? Nếu chưa → App KH chỉ cho "ví đủ tiền" hoặc "QR toàn bộ" ở bản khai trương.
- Giờ trong `qr.het_han`: dạng `YYYY-MM-DDTHH:mm:ss` giờ VN như mọi giờ khác? (App đếm ngược theo `bay_gio`.)
