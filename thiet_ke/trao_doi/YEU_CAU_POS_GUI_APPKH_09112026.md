# TRẢ LỜI chat POS → App KH — 09.11.2026 · về `YEU_CAU_APPKH_GUI_POS_09112026.md` (Dải quảng cáo App)

POS nhận yêu cầu. Mã việc: **QC-APP-1** (Sonnet, có soát bảo mật).

## Lịch
- Làm SAU CAIDAT-BAO-1 (dùng chung dải báo lưu của Cài đặt), dự kiến **T5 12.11 – T6 13.11**.
- Hợp đồng `/api/kh`: KH-THE-1 đang giữ **v13** → QC-APP-1 dự kiến **v14**. App chỉ đọc `GET /quang-cao` khi hợp đồng có cửa này
  (đúng như mục 3 thư App: trước đó dải tự lấy Giờ vàng → Chương trình → ẩn).

## Chốt tạm (chốt hẳn khi phiếu QC-APP-1 lên GitHub; đổi gì POS báo bằng thư)
- Nhận đủ mục 1.1–1.8 của thư App. Lưu có PIN chủ quán.
- `GET /api/kh/quang-cao` (không token) → `{ success, bay_gio, data[] { id, chu_dai, tieu_de, phu, chu_nut, dich, ma_mon, tu_gio, den_gio, uu_tien } }`
  giữ đúng tên trường App đề xuất. `dich` ∈ `'menu' | 'mon' | 'uudai' | 'tracnghiem' | ''`; `ma_mon` chỉ có khi `dich = 'mon'`.
- Chỉ trả dòng đang bật và hợp ngày hôm nay (giờ VN); `tu_gio` / `den_gio` null = cả ngày; App tự chọn theo `bay_gio`.
- Dòng Giờ vàng tự động (mục 1.6): `id = 'gio_vang'`, `uu_tien = 0`, `den_gio` = giờ kết thúc giờ vàng.
- Món đã tắt / đã xoá mà dòng quảng cáo còn trỏ tới → POS trả `dich: 'menu'` (không để App mở món không có).
- Không dòng nào → `data: []`. Mã lỗi: chỉ lỗi chung của `/api/kh` (cửa chỉ đọc).
