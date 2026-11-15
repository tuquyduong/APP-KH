# KH-SUA-1 — trạng thái

## Bước 1 (đối chiếu bản chụp)
Nhánh `viec/KH-SUA-1`; HEAD = FETCH_HEAD = `85e151d`.
```
85e151d PHIEU: KH-SUA-1
6fa3f38 TIEN-DO: KH-THE-2 xong (PR #38); mo KH-SUA-1 …
8a0ee17 Merge pull request #39 from tuquyduong/viec/KH-QC-1
```

## Kiểm
- `npm test`: 54 đạt · 0 hỏng. `--day-du`: 56 đạt · 0 hỏng (vite build thành công).
- `thu_KHSUA1.js`: 7 đạt (KHONG_TRINH_DUYET=1) · 27 đạt có Chromium.
- Cổng `tinh`: chỉ thiếu dòng `HEAD ĐÃ KIỂM` (A19) lúc chưa ghi.

## Bảng chỗ vá → đột biến (`dot_bien_tay.js`, cả 3 bị bắt)
| Chỗ vá | Đột biến |
|---|---|
| `ThanhToan.jsx` dùng `tt-qr` | VS-TRA-LAI-TEN-THE-QR |
| không lớp gốc trùng giữa các tệp css | VS-THEM-THE-QR-FLEX-O-TEP-KHAC |
| luật `.tt-qr{ display:flex … }` | BV-BO-LUAT-TT-QR-FLEX |

## Nghiệm thu
- A1 đổi tên lớp: ca A2 `thu_KHSUA1` + diff `ThanhToan.jsx`, `thanh_toan.css`. A2 `the-qr*` chỉ còn ở `the_qr.css`: ca A2.
- B1 bài mới: `thu_KHSUA1.js` (A1 canh chung đỏ trên gốc; Chromium 390 / 360; Thanh toán thẻ). Đỏ trên gốc: `bang_chung_do.txt`.
- B2 bài cũ dùng tên lớp cũ của ô Thanh toán thẻ: không có (grep `the-qr` trong `cong_cu/` chỉ trỏ thẻ Theo dõi đơn); bài khác xanh trong `npm test`.
- B3 đột biến: 3/3 bắt. B4 ảnh: `so_anh/truoc`, `so_anh/sau` (390 + 360 Theo dõi đơn, Thanh toán thẻ 390; ảnh Thanh toán thẻ "trước" cho thấy ô chưa có `.tt-qr`).
- B5 `npm test`, `--day-du` xanh; K10 không tăng (không thêm chữ). B6: chủ quán thử tay.

## Báo cáo 7 mục
- VIỆC: KH-SUA-1 — thẻ mã QR Theo dõi đơn bị xếp ngang do trùng tên lớp CSS.
- ĐÃ SỬA: đổi 3 tên lớp ô "Chuyển khoản QR" ở Thanh toán thẻ → `tt-qr`, `tt-qr-ic`, `tt-qr-v` (2 tệp, 7 dòng).
- BÀI THỬ: `thu_KHSUA1.js` mới; đột biến tay 3/3.
- ĐÃ RÀ K4: `grep the-qr` ở `src/`: chỉ còn `TheQR.jsx`, `the_qr.css`; canh chung A1 bảo đảm không lớp gốc nào trùng giữa các tệp css.
- CHƯA KIỂM: thử tay trên điện thoại thật (B6); ảnh chỉ từ POS giả.
- GIT: nhánh `viec/KH-SUA-1`, không PR, không merge.
- BÀI HỌC: xem dưới.

## Bài học
- KHOÁ (đã làm): bài canh chung "một lớp gốc chỉ định nghĩa ở một tệp css" trong `thu_KHSUA1.js` — bắt trùng tên lớp do CSS gộp một gói.
- KHOÁ (đã làm): bài thử bố cục BÊN TRONG thẻ (bài cũ chỉ canh "không tràn khỏi màn").
- Bài thử máy giả dựng css rỗng → ca trình duyệt phải nạp css của màn/component import; đã xử lý trong bài.
- Người gác chặn `sed -i`, lệnh ghép và `until` (dùng Edit, lệnh đơn).

✓ CỔNG CHẠY ĐẠT (`KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 85e151d^ HEAD viec/KH-SUA-1`, HEAD d4ad6e1). Lần đầu đỏ A16 vì dòng `SỐ CA` thiếu đường dẫn đầy đủ `cong_cu/thu_KHSUA1.js` — đã sửa.

HEAD ĐÃ KIỂM: d4ad6e1
