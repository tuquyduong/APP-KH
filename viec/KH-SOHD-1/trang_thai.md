# Trạng thái KH-SOHD-1

## Bước 1 — đối chiếu bản chụp (06.11 → 07.11.2026)
Nhánh `viec/KH-SOHD-1`; HEAD `00256b9` = FETCH_HEAD `00256b9` (đã đủ commit của origin, không kéo).
```
00256b9 PHIEU: KH-SOHD-1
ab9fe0f TIEN-DO: mo dot 3 song song (KH-SOHD-1 so_hd + tien ve + the QR thuong hieu, hop dong v11; KH-HANG-2 hang HANG-1 v10; KH-UI-5b Ke hoach); duyet 7 mau the QR; thu POS/App 06.11
0d140b3 TIEN-DO: KH-BAO-1 xong (chat soat cuoi DAT, gop PR)
```
Baseline trước khi sửa: `npm test` có `thu_KHBAO1` đỏ 1 ca ("A2 'Xem đơn' → /don/TQD50 …") ở lần chạy đầu, xanh ở các lần sau — ca chập chờn có sẵn, không do việc này (ghi ở Phát hiện).

## Bảng chỗ vá → đột biến (`dot_bien.py`, 23 đột biến, TẤT CẢ bị bài thử `thu_KHSOHD1.js` bắt, đối chứng xanh 101 đạt)
| Chỗ vá | Đột biến |
|---|---|
| `soDon` (hoaDon.js): so_hd → hiện; null → `#mã` | VS-SODON-THIEU-DAU-THANG · BV-SODON-KHONG-DUNG-SOHD |
| `cauTienVe` (hoaDon.js): > 0 và số thật | VS-TIENVE-NHAN-CHUOI-SO |
| `docHoaDon` bỏ `ghi_no` (C3) | VS-GHINO-LOC-NGUOC · BV-GHINO-KHONG-LOC |
| `NHOM.tra` có `ma_gd` (C2) | BV-MAGD-NHOM-TRA |
| `docDon` đọc `soHd` + `cauTienVe` | BV-DOCDON-SOHD |
| `dungTheQR`: mức H, finder đặc, đĩa ≤ 20%, viền 3, 4 màu | VS-QR-MUC-M · BV-QR-FINDER-CHAM-ROI · VS-QR-LOGO-QUA-TO · VS-QR-VIEN-HEP · VS-QR-MAU-PHAN-TU |
| `noiDungCK`: trường 62 → 08 | VS-QR-DOC-CK-TRUONG-SAI |
| `TheQR.jsx`: finder tô đặc, không chữ cuối thẻ | VS-THEQR-VONG-RONG · VS-THEQR-CHU-CUOI-THE |
| `TheoDoiDon.jsx`: số đơn, câu tiền về, số tiền trên thẻ | VS-THEODOI-HIEN-MA-APP · VS-THEODOI-CAU-CU-LUON · VS-THEQR-SO-TIEN-VI-QR |
| `Don.jsx`: Chi tiết (câu tiền về), Lịch sử (số đơn) | BV-CHITIET-TIEN-VE · VS-LICHSU-HIEN-MA-APP |
| `ThanhToan.jsx`: cảnh báo đơn chờ trả, mở đơn bằng mã App | VS-THANHTOAN-CHO-TRA-MA-APP · VS-THANHTOAN-MO-DON-BANG-SO-HD |
| `BaoDonXong.jsx`: tiêu đề tab theo số đơn | BV-BAO-DON-TIEU-DE |

## Câu hỏi
(không có)

## Phát hiện
- `thu_KHBAO1.js` ca "A2 \"Xem đơn\" → /don/TQD50, dải mất, không báo lại" chập chờn (đỏ 1 lần ở gốc, xanh các lần sau) — ca Chromium phụ thuộc đồng hồ giả; việc khác (KH-BAO-1) xem lại nếu còn thấy.
- D6: máy làm việc KHÔNG có bộ giải mã QR (không `zbarimg`, `jsQR`, `cv2`) và người gác chặn `npm install` → CHƯA kiểm quét máy; thay bằng bài thử cấu trúc. Nếu cần kiểm quét máy sau này: đặt `jsQR` ở nháp ngoài `package.json`.
- Phí 3 trường hợp `POST /don` có `so_hd` (v11): App chưa dùng (đơn mới đặt xong chuyển sang `/don/<ma>` rồi đọc `GET /don/:ma`), nên KHÔNG đọc ở `docDatDon` (tránh code chết).

## Nhận xét thực thi
- `kh_don_gui` KHÔNG thêm trường: cảnh báo "Bạn vừa đặt đơn … ở cửa sổ khác" tra `so_hd` trong danh sách `GET /don` đã tải ở Thanh toán, không thấy → `#mã`.
- Tiêu đề màn Theo dõi / Chi tiết đơn khi chưa tải xong: "Đơn hàng" (không để lộ mã App `A…`).
