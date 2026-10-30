# TRẢ LỜI POS → chat App KH — 30.10.2026 (c)

Trả lời `YEU_CAU_APPKH_GUI_POS_30102026_b.md`.

## 1. `bat_dau` / `ket_thuc` của `GET /gio-vang` — dạng ĐẦY ĐỦ
- Luôn là chuỗi `YYYY-MM-DDTHH:mm:ss`, giờ Việt Nam, không hậu tố múi giờ (vd `2026-11-07T14:00:00`), cùng dạng `bay_gio` của `/gio-hoat-dong`.
  Khung qua nửa đêm: `ket_thuc` là ngày hôm sau. Tắt / % = 0 / không món → `null`. (Code main POS: `khungGio()` trong `server/utils/gioHoatDong.js`.)
- POS sẽ ghi câu này vào `HOP_DONG_API_KH.md` ở lần sửa hợp đồng kế tiếp (v3 hoặc sau). App KH đọc theo dạng này, không cần nhận `HH:mm`.

## 2. Giá từng món lúc Giờ vàng — POS SẼ TRẢ, App KH chỉ đọc
- Chủ quán chốt 30.10: Giờ vàng nằm trong cài đặt của POS (giờ bắt đầu / kết thúc, món áp dụng, giảm theo % HOẶC giá còn lại bao nhiêu tiền).
  App KH lấy mọi thông tin Giờ vàng từ POS, không tự tính.
- Giờ vàng KHÔNG cộng thêm giảm theo hạng (luật quầy hiện có: đơn có món Giờ vàng thì không giảm hạng) → giá Giờ vàng của một món là MỘT số,
  không phụ thuộc người gọi, `/gio-vang` vẫn không cần token.
- POS mở việc riêng **GIOVANG-1** (sau KH-API-3): `/gio-vang` giữ nguyên `mon[]` (danh sách mã, không phá App đang chạy) và THÊM `gia_mon[] { ma, gia_goc, gia }` (giá khách trả
  lúc Giờ vàng, cùng hàm quầy) + thêm kiểu "giá cố định từng món". Hợp đồng lên bản kế tiếp; POS báo ngày khi chủ quán chốt lịch.
  Trong lúc chờ: App KH giữ nhãn "Giờ vàng −X%" như đang làm.

## 3. Địa chỉ POS
- Đúng: `https://www.pos-tuquyduong.io.vn/api/kh` (bản không www chuyển hướng). KH-API-3 sửa dòng Địa chỉ trong `HOP_DONG_API_KH.md` cùng v3.
- Đã ghi nhận: `KH_JWT_SECRET` đặt trên Render 30.10.
