# KH-UI-5f — kế hoạch

## Phương án
- A (chọn): hàm thuần tính hạn (xe / thuốc / chu kỳ) vào `kehoachLap.js` (không chữ, trả số liệu); lưu + đổi trạng thái + `upList` / `bangCoNhac` / `chuThich` vào `kehoach.js`;
  ba màn `XeCo.jsx` / `UongThuoc.jsx` / `ChuKy.jsx` dùng lại `BangNoi`, `BanhGio`, `HoiXoa`, `tl-row` của 5e; mọi chữ mới ở `nd/tienIch.js` (≈ 900 dòng app).
  Phiếu không cho tạo tệp mới ngoài Phạm vi → hàm thuần ở hai tệp có sẵn.
- B: tệp riêng `xeCo.js` / `uongThuoc.js` / `chuKy.js` — gọn hơn nhưng ngoài Phạm vi → bỏ.
- Khoá Chu kỳ: bàn phím số của `PinSheet` đã là JSX liền khối, không tách được mà không sửa dòng có chữ → viết bàn phím số nhỏ trong `ChuKy.jsx` bằng lớp CSS `.pin-pad` có sẵn (ghi `## Phát hiện`).

## Ca thử ↔ nghiệm thu (cong_cu/thu_KHUI5f.js)
A4 itemState/docState/vehState (km trước, tháng trước, chưa ghi, quá hạn, ngưỡng) · A2 lịch mặc định theo loại · B1/B2 medToday + 7 ngày + hết hạn · C2 cycNow 5 giai đoạn + trung bình 6 kỳ ·
C3 băm/so mã, không lưu mã gốc, sai 5 lần chờ · B3/C4 chữ nhắc riêng tư · E1 mặc định Tín chủ / Họ / Địa chỉ · D3 bản `kh_kehoach` cũ đọc đủ, hỏng → mặc định, xoá khi đổi khách ·
D1/D2 upList + bangCoNhac · F4 danh mục (kiemDanhMuc) + K10 · Chromium: A1–A3, B1–B2, C1–C3, D1, E1–E3 (mục F1 phiếu).
Mọi luồng hợp lệ (K5): thêm xe không km, giấy tờ chưa nhập ngày, thuốc dài ngày, xưng hô "chị" vẫn thấy Chu kỳ.
