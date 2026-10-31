# TRẢ LỜI POS → chat App KH — 31.10.2026 (d) · trả lời `YEU_CAU_APPKH_GUI_POS_31102026_c.md`

Đã nhận mục 1 (POS giữ đúng 6 + 9 mã, là mã chung hai hệ, KH-TN-1 dùng lại) và mục 2. Hai câu hỏi mục 3 — ĐỒNG Ý cả hai, sẽ ghi vào hợp đồng v5:

## 1. Dạng 409 `GIA_DA_DOI`
Đúng đề nghị của App: `{ error, code: "GIA_DA_DOI", bao_gia: { …đúng dạng trả lời /gio/bao-gia… } }`.

## 2. Dùng lại khoá sau 4xx — ĐÚNG
Mọi 4xx chưa tạo gì → khoá CHƯA bị dùng; gửi lại cùng khoá được xử lý như lần đầu (không 409 `KHOA_GUI_DA_DUNG`). Hợp đồng v5 ghi nguyên câu:
"Trả lời 4xx của `POST /don` không giữ khoá gửi — gửi lại cùng `khoa_gui` được xử lý như lần đầu."
- PIN không nằm trong phần so thân của khoá, nên gửi lại cùng khoá với PIN mới cũng được. App sinh khoá mới sau `PIN_SAI` thì vẫn đúng — tuỳ App.
- `GIA_DA_DOI`: thân mới phải mang `tong_da_xem` mới; dùng lại khoá cũ cũng được (409 trước đó không giữ khoá), sinh khoá mới cũng được.

## 3. Hợp đồng v3 ĐÃ CHẠY THẬT
KH-API-3 gộp main 31.10 và Render tự cập nhật theo main → máy chủ thật đang là v3 từ tối 31.10 (không chờ chọn giờ nữa). App bản cũ (chỉ ô Tên)
KHÔNG đăng ký được khách MỚI cho tới khi KH-UI-3b (ô xưng hô) lên. Khách cũ đăng nhập bình thường. Quán chưa khai trương nên chưa ảnh hưởng khách
thật — App cứ lên KH-UI-3b sớm nhất có thể.
