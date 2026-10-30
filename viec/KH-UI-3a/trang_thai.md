# Trạng thái KH-UI-3a

## Đối chiếu bản chụp (bước 1 của /lam-viec)
- Nhánh `viec/KH-UI-3a`; cây sạch; `git fetch origin viec/KH-UI-3a`: HEAD `5699386` = FETCH_HEAD `5699386` (không cần kéo).
- `git log --oneline -3` lúc mở:
  - `5699386 PHIEU: KH-UI-3a`
  - `08ac7f9 TIEN-DO: mo KH-UI-3a - so v8`
  - `948f2c5 Merge pull request #6 from tuquyduong/viec/KH-SLOGAN-1`

## Câu hỏi
1. **Giá Giờ vàng từng món** — hợp đồng v2 (`thiet_ke/HOP_DONG_API_KH.md`) chỉ có `phan_tram` chung + `mon[]` (mã món), KHÔNG có giá Giờ vàng đã tính cho từng món; phiếu D5 muốn "hiện giá Giờ vàng" nhưng mục Cấm cấm App tự tính giá / % giảm. Đã làm: món đang Giờ vàng hiện nhãn "Giờ vàng −X%" (X = số của POS), ô món có nhãn `-X%`, ghi chú "Giá Giờ vàng áp khi thanh toán, không cộng thêm ưu đãi khác", giá hiện là GIÁ GỐC `gia` và KHÔNG hiện giá hạng. **Đề xuất gửi chat POS** (qua `YEU_CAU_APPKH_GUI_POS_<ngày>.md`, chủ quán chuyển): `/gio-vang` thêm `mon[] { ma, gia }` (giá một ly đang áp, POS tính cùng hàm với quầy). Khi có, App thay giá gốc bằng `gia` đó (đổi 1 chỗ: `MonO.jsx` / `TrangMon.jsx`) — không cần tính gì.
2. **Dạng `bat_dau` / `ket_thuc` của `/gio-vang`** — hợp đồng không ghi (chuỗi `YYYY-MM-DDTHH:mm:ss` hay `HH:mm`); câu "bat_dau là hôm qua" gợi ý chuỗi có ngày. `src/gioVang.js` đọc được cả hai (bài thử có ca cho từng dạng). Nhờ POS ghi rõ dạng vào hợp đồng.
3. **Ba bài thử cũ phải sửa theo thay đổi có chủ ý của phiếu** (cổng A11 có thể đòi mục `## Bài thử cũ sửa` trong phiếu — máy không sửa phiếu): `cong_cu/thu_KHLINK1.js` (độ mờ ô khoá `.45` → `.3`, H1 "mờ hơn một chút"; ca ĐỎ trên code gốc), `cong_cu/thu_KHUI5a.js` (Trang chủ: `<div className="hb-tiles"><OGioVang … /><OTracNghiem`; ca đỏ trên code gốc). Bài `cong_cu/thu_KHLUU1.js` (B3 canh dòng `doiKhach(...); tnGoc.nap(); datDaBiet(true)`) NGOÀI Phạm vi nên không sửa: đã đặt dòng `datHangToi(...)` TRƯỚC `doiKhach(...)` để bài đó vẫn xanh (31 đạt · 0 hỏng).

## Phát hiện (ngoài phạm vi, không sửa)
- `index.html` (ngoài Phạm vi) giữ bộ `<symbol>` biểu tượng; demo có `i-bolt`, `i-clock`, `i-crown`, `p-lantern` mà `index.html` chưa có. Việc này vẽ thẳng bốn biểu tượng trong `src/components/BieuTuong.jsx` (nguyên path của demo; đèn lồng dùng gradient `e-*` đã có sẵn trong `index.html`). Khi có dịp nên chuyển vào bộ `<symbol>` cho gọn.
- Demo KHÔNG có dòng "quán đang mở / đóng" (F1): đã thêm MỘT dòng nhỏ kiểu `.sub` dưới lời chào Trang chủ ("Quán đang mở cửa" hoặc nguyên văn `thong_bao` của POS). **Chủ quán duyệt chỗ đặt này.**
- Demo ô nhóm Menu có sẵn ô "Topping" (TOPPING-1) — chưa làm, đúng phiếu.
- `.hb-tiles` ở demo luôn 2 cột; app giữ 1 cột khi Giờ vàng tắt (`:has(> .hb-tile:only-child)`), đúng quy tắc demo `.sec-off`.
- Màn Hỗ trợ (F3) chưa hiện lịch tuần vì `HoTro.jsx` không có chỗ "giờ mở cửa" của demo; `lich_tuan`/`ngay_nghi`/`nhan_don` đã lưu chung ở `src/gioHoatDong.js` cho KH-UI-4 / KH-MUA-1.
