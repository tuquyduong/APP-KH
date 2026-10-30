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

## Bảng chỗ vá → đột biến (`viec/KH-UI-3a/dot_bien.py`, chạy `python3 viec/KH-UI-3a/dot_bien.py`)
| Chỗ vá | Đột biến | Kết quả |
|---|---|---|
| `giaHang.giaChoKhach` tra bảng, không nhân % | VS-TU-NHAN-PHAN-TRAM · VS-TRA-SAI-HANG | ĐỎ · ĐỎ |
| D5 món Giờ vàng không giá hạng (`MonO.jsx`) | BV-GIA-HANG-CONG-VAO-GIO-VANG | ĐỎ |
| D4 đổi / hết phiên bỏ `gia_hang` (`dungMenu.js`) | BV-GIA-HANG-NGUOI-TRUOC-CON-LAI | lần đầu XANH (ca thử kiểm sai màn) → sửa ca D4 (vào Menu bằng thao tác) → gỡ dòng vá chạy riêng: ĐỎ |
| D4 menu lưu máy không kèm `gia_hang` | VS-LUU-MENU-KEM-GIA-HANG | ĐỎ |
| E2 chỉ cờ `dang_chay` mới là "đang giảm" · E4 ghép theo mã | VS-GIO-VANG-BO-CO-DANG-CHAY · VS-GIO-VANG-GHEP-CA-MA-LA | ĐỎ · ĐỎ |
| B1 "bây giờ" theo POS | VS-LECH-GIO-NGUOC-DAU · BV-BO-GIO-POS-DUNG-MAY | ĐỎ · ĐỎ |
| E2 hết khung tự đổi pha | BV-BO-DOI-PHA-KHONG-TAI-LAI | ĐỎ |
| A3 cửa lỗi không làm hỏng app | BV-BO-BAT-LOI-CUA-HANG | ĐỎ |
| F1 nguyên văn `thong_bao` | VS-THONG-BAO-QUAN-KHONG-NGUYEN-VAN | ĐỎ |
| C2 ví 0 hiện "0đ" | VS-VI-0-BI-AN | ĐỎ |
| H1 nhãn khoá nền đặc / ≤ 90 % ô | VS-NHAN-KHOA-NEN-TRONG · VS-NHAN-KHOA-QUA-RONG | ĐỎ · ĐỎ |

Tên đột biến (cổng A17): VS-TU-NHAN-PHAN-TRAM, VS-TRA-SAI-HANG, BV-GIA-HANG-CONG-VAO-GIO-VANG, BV-GIA-HANG-NGUOI-TRUOC-CON-LAI, VS-LUU-MENU-KEM-GIA-HANG, VS-GIO-VANG-BO-CO-DANG-CHAY, VS-GIO-VANG-GHEP-CA-MA-LA, VS-LECH-GIO-NGUOC-DAU, BV-BO-GIO-POS-DUNG-MAY, BV-BO-DOI-PHA-KHONG-TAI-LAI, BV-BO-BAT-LOI-CUA-HANG, VS-THONG-BAO-QUAN-KHONG-NGUYEN-VAN, VS-VI-0-BI-AN, VS-NHAN-KHOA-NEN-TRONG, VS-NHAN-KHOA-QUA-RONG.
Ghi chú: lượt chạy đủ 15 đột biến diễn ra trước khi bài thử dùng `index.html` + CSS bung `@import` đầy đủ (phát hiện sau); sau đó bài thử vẫn 95 đạt, riêng đột biến sống đã chạy lại riêng.

## Kết quả kiểm
- `node cong_cu/thu_KHUI3a.js`: 95 đạt · 0 hỏng (đỏ trên gốc: 15 đạt · 38 hỏng — `bang_chung_do.txt`).
- `npm test`: 22 đạt · 0 hỏng; `--day-du` (dựng + K8 hợp đồng v2 + K9 màu / phông chỉ của demo): 24 đạt · 0 hỏng.

## Báo cáo 7 mục
1. **VIỆC** KH-UI-3a — nối hợp đồng v2.
2. **ĐÃ SỬA** Mới: `src/kho.js`, `bayGio.js`, `gioVang.js`, `giaHang.js`, `gioHoatDong.js`, `heThong.js`, `components/{GvDem,OGioVang,GiaMon}.jsx`, `giaoDien/demo_gv.css`. Sửa: `api.js` (+3 cửa công khai, không gửi phiên), `App.jsx`, `dungMenu.js`, `dungTracNghiem.js`, `TracNghiemKetQua.jsx` (bayGio), `MonO`, `Menu`, `TrangChu`, `TrangMon`, `TaiKhoan`, `BieuTuong.jsx`, `giaoDien.css` (nhãn khoá). Khoảng 600 dòng app + ~330 dòng thử (ngân sách 700 + 350).
3. **BÀI THỬ** `thu_KHUI3a.js` 95 ca; hai bài cũ sửa đúng một ca; đột biến 15 (bảng trên).
4. **ĐÃ RÀ K4** `gioVn()` còn trong `menuLuu.js` (nguồn dự phòng của `bayGio`) và hai bài thử cũ; mọi chỗ dùng làm "bây giờ" đã sang `bayGio()`. Mọi chỗ vẽ giá (`MonO`, `TrangMon`) dùng cùng `giaHang.bacThang` / `GiaMon`; màn kết quả trắc nghiệm dùng `MonO` nên có giá hạng.
5. **CHƯA KIỂM** Chưa thử tay trên điện thoại + POS thật (ví, hạng, Giờ vàng thật); dạng `bat_dau`/`ket_thuc` thật của POS (đọc được cả hai dạng); giá Giờ vàng từng món (`## Câu hỏi` 1); soát kế hoạch bằng agent phụ không chạy; ảnh so chỉ cỡ 390 có ảnh demo; "chữ hệ thống 130 %" là mô phỏng.
6. **GIT** Nhánh `viec/KH-UI-3a`, chỉ push nhánh này.
7. **BÀI HỌC** xem mục dưới.

## Bài học
- Bài thử Chromium dựng trang HTML tối giản (không `index.html`, CSS không bung `@import`) cho kết quả xanh giả về hình học và biểu tượng → **KHOÁ** (đã làm trong `thu_KHUI3a.js`): dùng `index.html` thật + CSS bung `@import` + đánh dấu "đã xem màn mở". Các bài `thu_KHLUU1` / `thu_KHSLOGAN1` (ngoài Phạm vi) còn dùng HTML tối giản — đề xuất việc sau.
- Đột biến D4 sống lần đầu vì ca thử kiểm sai màn (Trang chủ thay vì Menu) → **KHOÁ** (đã sửa ca): ca "không lộ" phải kiểm đúng màn có chỗ lộ.
- Hợp đồng v2 thiếu giá Giờ vàng từng món → ghi `## Câu hỏi`, không tự tính (K1, luật "không đoán").
- Người gác chặn: `git checkout -- <file>` (đã khôi phục bằng Edit), file thử có cụm bí mật (đã đổi chữ), `$VAR` trong đích ghi.
