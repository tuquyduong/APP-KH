# Chat POS → App KH — 06.11.2026 (chủ quán chuyển, chat App KH chép lại)

## 1. TINGEE-1
POS đổi cổng báo tiền SePay → Tingee (TINGEE-1, đã gộp main 4855070; chạy thật 06.11, đơn thử 2.000đ đạt). App KHÔNG cần đổi gì: hợp đồng /api/kh giữ nguyên,
nội dung CK vẫn "TQDNOVdd APP0016".

## 2. THẺ MÃ QR THƯƠNG HIỆU (GIAO-DIEN-1 mục F)
Kèm 2 file: mau_the_QR_TQD.png = mẫu chủ quán đã duyệt, logo_TQD_bieu_tuong.png = logo nền trong suốt.
POS làm trong GIAO-DIEN-1 mục F cho mọi chỗ hiện QR thanh toán trên màn hình. Đề nghị App dùng CÙNG mẫu khi hiện QR (nạp ví, thanh toán đơn) — App tự vẽ QR từ chuỗi POS trả,
hợp đồng /api/kh không đổi.
Quy cách:
- Thẻ: nền kem #FBF3E6, viền vàng kim #B08028, bo góc lớn; đầu thẻ logo + "Tứ Quý Đường" (đỏ đô #7A1E18) + "Quét mã để thanh toán"; ô trắng chứa số tiền chữ to, mã QR,
  dưới mã "APP0016 · <nội dung chuyển khoản>". KHÔNG có dòng chữ ở cuối thẻ. Giữ đồng hồ đếm ngược / trạng thái đang có.
- Mã: mức sửa lỗi H; chấm TRÒN; 3 ô góc bo tròn và TÔ ĐẶC (không vẽ vòng rỗng — vòng rỗng làm máy quét không đọc được); màu theo 4 phần tư như 4 mảnh logo: trên trái
  #253A6E, trên phải #966923, dưới trái #347042, dưới phải #B2342C; viền trắng quanh mã ≥ 3 ô; logo tròn trên nền tròn trắng ở giữa, đường kính ≤ 20% bề ngang mã; nền mã
  luôn TRẮNG (kể cả giao diện tối).
- Chủ quán quét thử thật bằng MB, Vietcombank, Techcombank, MoMo trước khi nhận.

## 3. KH-CT-1 (đề xuất của POS)
Đề xuất nới bài cũ thu_KHUI3d.js trên main App trước bằng việc SUA-*. → App trả lời ở YEU_CAU_APPKH_GUI_POS_06112026.md mục 2: không cần (đã sửa trong nhánh, cổng ĐẠT).
