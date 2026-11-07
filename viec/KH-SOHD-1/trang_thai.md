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
- `POST /don` trả `so_hd` (v11): App chưa dùng (đơn mới đặt xong chuyển sang `/don/<ma>` rồi đọc `GET /don/:ma`), nên KHÔNG đọc ở `docDatDon` (tránh code chết).

## Nhận xét thực thi
- `kh_don_gui` KHÔNG thêm trường: cảnh báo "Bạn vừa đặt đơn … ở cửa sổ khác" tra `so_hd` trong danh sách `GET /don` đã tải ở Thanh toán, không thấy → `#mã`.
- Tiêu đề màn Theo dõi / Chi tiết đơn khi chưa tải xong: "Đơn hàng" (không để lộ mã App `A…`).

## Soát độc lập `/ra-soat` (vòng 1) — báo cáo tóm tắt
Kết luận người soát: ĐẠT CÓ ĐIỀU KIỆN; không lỗi tiền, không lộ dữ liệu, không vi phạm Cấm; nghiệm thu 17/19 có bằng chứng, thiếu E4 (hồ sơ) và E3 (cặp ảnh). Lỗi / nghi ngờ đã xử lý ở vòng 1:
- E4 thiếu hồ sơ → ghi bên dưới. E3 → `doi_chieu_demo.md` nay trỏ cặp ảnh mẫu ↔ app.
- Tên ca "≥ 300 chấm" sai → đổi thành "4 nhóm chấm màu". `hoaDon.js` chú thích "KHÔNG bỏ dòng" → sửa. `NHOM.tra` còn `ghi_no`: GIỮ (`thu_KHHD1` khoá).
- Nghi ngờ trang trắng khi chuỗi QR quá dài → `TheQR` bọc try/catch, bỏ mã vẫn hiện số tiền + dòng; thêm ca D3 (SỐ CA SOHD1 = 39). Chưa có đột biến riêng cho chỗ này (ghi nhận).
- Chưa xử lý (ghi nhận): đĩa logo có thể xoá mẫu căn chỉnh tâm (mức H chịu được, cần quét tay); `nhanDon` ở Thanh toán rơi về `#mã` khi đơn vừa đặt ở cửa sổ khác chưa nằm trong danh sách trang 1 (đúng phiếu: `so_hd` thiếu → giữ `ma`).
- Ca chập chờn `thu_KHBAO1` "Xem đơn": sửa bằng cách chờ cả ba điều kiện trong cùng `doi(...)`; npm test xanh nhiều lần.

## Kết quả kiểm (07.11.2026)
- `npm test`: 36 đạt · 0 hỏng (thu_KHSOHD1 102 đạt có Chromium; 39 ở KHONG_TRINH_DUYET=1).
- `node kiem_tra_truoc_khi_giao.js --day-du`: 38 đạt · 0 hỏng (có vite build).
- Cổng `tinh`: chỉ còn A19 (chờ dòng HEAD ĐÃ KIỂM, ghi ở cuối file). Cổng `chay` (KHONG_TRINH_DUYET=1): ✓ CỔNG CHẠY ĐẠT (hai CẢNH BÁO A16 do bài chạy trên gốc dừng sớm/ít ca — bình thường).

## Báo cáo 7 mục
1. VIỆC: KH-SOHD-1 — số đơn = `so_hd`, câu tiền về muộn, thẻ QR thương hiệu (hợp đồng v11).
2. ĐÃ SỬA: hợp đồng v11 + `canTuPos` (A1); `soDon` ở 5 chỗ hiện (B1, B2 giữ `ma`); `cauTienVe`, `docHoaDon` bỏ ghi_no, `ma_gd` nhóm tra (C1–C3); `qrThuongHieu.js` + `TheQR.jsx` + `the_qr.css` + logo, thay `VeQR` ở Theo dõi đơn (D1–D5).
3. BÀI THỬ: `thu_KHSOHD1.js` mới (39 ca không trình duyệt; 102 có Chromium); 5 bài cũ sửa, đều có ca đỏ trên gốc (`bang_chung_do.txt`); 23 đột biến bị bắt hết (`dot_bien.py`).
4. ĐÃ RÀ K4: grep `src/` không còn chỗ dán `#mã` ra màn ngoài `soDon`; mọi nơi vẽ tờ hoá đơn qua `docHoaDon`.
5. CHƯA KIỂM: D6 quét máy thật (không có bộ giải mã, `npm install` bị chặn) — chủ quán quét MB / Vietcombank / Techcombank / MoMo; Zalo WebView với `<image href>`; ảnh Thanh toán / dải báo (chỉ đổi chữ).
6. GIT: nhánh `viec/KH-SOHD-1`, đã push, không PR, không merge.
7. BÀI HỌC: xem dưới.

## Bài học
- KHOÁ (đã làm): ca D3 chuỗi QR quá dài + ca cấu trúc dựng lại lưới bit; ca BAO1 "Xem đơn" gộp điều kiện vào một `doi(...)`.
- NGUYÊN TẮC (đề xuất, ngoài Phạm vi): hàm vẽ dùng thư viện có thể ném lỗi ở màn tiền phải rơi về chữ thay vì trắng trang (gợi ý K10 trong KHUON_LOI.md); `VeQR` ở `ManQR.jsx` cũng chưa bọc (cấm sửa ở việc này).
- BỎ: người gác chặn lệnh gộp nhiều lệnh / `;` — chỉ lỗi thao tác một lần.
- Dọn: không có lời dặn nào đủ phép kiểm để xoá.

HEAD ĐÃ KIỂM: 096b696
