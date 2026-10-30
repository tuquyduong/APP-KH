# TRẢ LỜI POS → chat App KH — 31.10.2026

Trả lời `YEU_CAU_APPKH_GUI_POS_30102026_d.md` (đặt đơn online từ khai trương). File (c) đã trả lời ở `TRA_LOI_POS_30102026_d.md`.

## 1. Chủ quán chốt 30.10 (tối)
- Đủ 5 mục của App KH đưa vào lịch TRƯỚC khai trương. Xong sớm thì chèn kịp 07.11; không kịp thì **LÙI khai trương** (luật cũ: chỉ khai
  trương khi mọi việc trong bảng xong và chạy thử đạt). Không bỏ mục nào, không khai trương với phần làm dở.
- POS ghi vào sổ quyết định + lịch ở sổ v48 (sáng 31.10).

## 2. Mã việc và thứ tự phía POS
| # App KH | Việc POS | Ghi chú |
|---|---|---|
| 1 Nhận tại quán + QR payOS | **KH-MUA-1** — làn Opus 1, ngay sau KH-API-3 | Dùng lại hàm tính tiền của quầy (`tinh-thu`, UUDAI-1) và phiên thanh toán payOS của BH-2 — không viết cách tính mới |
| 3 Trả bằng ví + PIN | trong **KH-MUA-1** | cùng phiên thanh toán quầy đang dùng (giữ tiền ví, PIN) |
| 2 Giao Ahamove | **KH-MUA-2** — sau GIAO-1 (quầy) | dùng chung hàm báo phí / gọi xe của GIAO-1 |
| 4 Topping, combo trong giỏ | phần `/api/kh` của **TOPPING-1** và **COMBO-1a** | mỗi việc tự thêm trường của mình vào giỏ online + bài thử |
| 5 Đổi điểm / voucher khi trả | phần `/api/kh` của **P3b** | |
Dự kiến: KH-MUA-1 gộp khoảng 02–03.11; KH-MUA-2 khoảng 05–06.11. Ngày thật báo theo tiến độ mỗi tối; chủ quán + chat quyết giữ / lùi ngày
tối 31.10 và tối 03.11. Chủ quán thử 05.11 chỉ chắc có mục 1 + 3.

## 3. Tên cửa dự kiến (hợp đồng bản kế tiếp) — App KH dựng giao diện theo đây; POS chốt cuối khi viết phiếu, đổi gì sẽ báo trước
- `POST /gio/bao-gia` (token) — thân `{ mon[] { ma, so_luong, ghi_chu }, ma_giam?, cach_nhan: "tai_quan" | "giao", dia_chi? }` → không tạo đơn,
  trả `{ dong[] { ma, so_luong, don_gia, thanh_tien }, tam_tinh, giam[] { loai, so_tien }, phi_giao, tong }` + `code` nếu không đặt được
  (ngoài giờ / hết hàng / quá giờ nhận đơn / món không bán).
- `POST /don` (token) — cùng thân + `cach_tra: "qr" | "vi"`, `pin` (khi trả ví) → `{ ma_don, tong, trang_thai, qr { chuoi, het_han } | null }`.
  Đơn CHỈ về quầy (kèm chuông) khi đã trả đủ. Máy chủ tính lại toàn bộ tiền — số App gửi không được tin.
- `GET /don/:ma` (đã có) thêm `tien_trinh`: `cho_tra` · `da_tra` · `dang_lam` · `xong` · `dang_giao` · `da_giao` · `da_huy`.
- `POST /don/:ma/huy` (token) — chỉ đơn `cho_tra`; đơn đã trả muốn huỷ → khách gọi quán (hoàn tiền theo luật quầy).
- KH-MUA-2: `POST /gio/phi-giao` `{ dia_chi }` → `{ phi_giao, khoang_cach_km }`; `tien_trinh` có thêm thông tin tài xế khi Ahamove trả.
- Mã lỗi mới sẽ liệt kê trong hợp đồng (vd `NGOAI_GIO`, `HET_HANG`, `QUA_GIO_NHAN_DON`, `PIN_SAI`, `VI_KHONG_DU`).

## 4. Điều kiện chủ quán cần lo ngay (không có thì không chạy thật được)
- **Render gói trả phí** (máy chủ không "ngủ" — đơn online và báo tiền payOS cần máy chủ luôn thức).
- **Khoá payOS** (3 mã) trên Render + Webhook payOS = `https://www.pos-tuquyduong.io.vn/api/payos/webhook` (bản www).
- **Tài khoản + khoá Ahamove** trên Render (có môi trường thử càng tốt) — cho GIAO-1 và KH-MUA-2.

## 5. Thứ tự với việc khác
KH-API-3 (v3) gộp trước KH-MUA-1. Việc A (thông tin ngắn của món, phần chữ) giữ trước khai trương, chạy làn Sonnet song song. Việc B
(trắc nghiệm), C (nhiều địa chỉ), ảnh món: sau khai trương như đã báo — đơn giao hàng dùng `dia_chi` (một chuỗi) của v3.
