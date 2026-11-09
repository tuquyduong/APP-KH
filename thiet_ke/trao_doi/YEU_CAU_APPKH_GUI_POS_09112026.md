# YÊU CẦU App KH → chat POS — 09.11.2026 · Cài đặt "Dải quảng cáo App" (chủ quán chọn hôm nay / khung giờ nào hiện chữ gì)

## 0. Bối cảnh
- App KH (KH-UI-5d) làm **dải quảng cáo mảnh có ánh sáng lướt** ở đầu các trang: Menu, Ưu đãi, Giỏ hàng, Kế hoạch và tiện ích, Tài khoản.
  KHÔNG hiện ở Thanh toán, Theo dõi đơn, Đăng nhập, bảng PIN. Banner lớn "Hôm nay" ở Trang chủ giữ nguyên.
- Chủ quán 09.11: chữ trên dải **phải chọn lọc, hấp dẫn**, và **đặt ở phần Cài đặt** — chọn hôm nay hiện gì, hoặc từ mấy giờ đến mấy giờ hiện gì.
- Hiện chữ banner nằm cứng trong code App (rỗng) → chủ quán không tự đổi được. Xin POS làm chỗ nhập + cửa đọc.

## 1. Xin POS — màn Cài đặt → "Quảng cáo trên App" (dùng component báo lưu chung CAIDAT-BAO-1, có PIN chủ quán)
Danh sách dòng quảng cáo, mỗi dòng:
1. **Chữ dải** (bắt buộc, ≤ 32 ký tự — đếm ngược khi gõ; quá thì không cho lưu). Ví dụ: "🍵 Lập đông ấm bụng — Phổ Nhĩ -10%".
2. **Tiêu đề + dòng phụ + chữ nút** cho banner lớn Trang chủ (tuỳ chọn; trống thì Trang chủ dùng Chữ dải làm tiêu đề).
3. **Bấm vào thì mở:** Menu · một món (chọn món) · Ưu đãi · Trắc nghiệm thể trạng · không mở gì.
4. **Khi nào hiện:** ngày (hằng ngày / các thứ trong tuần / từ ngày – đến ngày) + **khung giờ** từ HH:mm đến HH:mm (trống = cả ngày).
5. **Thứ tự ưu tiên** (kéo lên / xuống) + công tắc **Bật / Tắt**.
6. Tuỳ chọn tự động: công tắc "Khi Giờ vàng đang chạy thì dải hiện Giờ vàng" (chữ do POS tạo từ /gio-vang, vd "⏰ Giờ vàng: giảm 20% đến 16:00").
7. Dòng **xem trước** ngay trên màn: dải mảnh như trên App, chữ quá dài thấy bị cắt "…".
8. Nhắc nhẹ dưới ô chữ: "Không ghi công dụng chữa bệnh (quy định quảng cáo thực phẩm)."

## 2. Xin POS — cửa đọc cho App (không token)
`GET /api/kh/quang-cao` → `{ success, bay_gio, data[] { id, chu_dai, tieu_de, phu, chu_nut, dich: 'menu'|'mon'|'uudai'|'tracnghiem'|'', ma_mon, tu_gio, den_gio, uu_tien } }`
- POS chỉ trả các dòng **đang bật và hợp NGÀY HÔM NAY** (theo giờ VN), kèm khung giờ; App tự chọn dòng đúng giờ hiện tại theo `bay_gio` (đổi đúng lúc qua khung giờ, không cần hỏi lại POS mỗi phút).
- Nhiều dòng cùng lúc → `uu_tien` nhỏ nhất. Không có dòng nào → `data: []` → App ẩn dải (Trang chủ: banner như hiện nay).
- Giờ vàng tự động (mục 1.6) bật và đang chạy → POS trả thêm một dòng ưu tiên cao nhất.
- Tên trường / mã lỗi POS chốt, ghi vào hợp đồng (phiên bản mới) + báo App lịch.

## 3. App làm trong lúc chờ
KH-UI-5d làm dải + banner đọc `GET /quang-cao` KHI hợp đồng có cửa này; trước đó dải tự lấy: Giờ vàng đang chạy (`/gio-vang`) → chương trình đặc biệt (`/chuong-trinh`) → không có thì ẩn.
