# KH-SUA-1 — kế hoạch

## Phương án
- **A (chọn):** đổi tên 3 lớp của ô "Chuyển khoản QR" ở Thanh toán thẻ (`the-qr`, `the-qr-ic`, `the-qr-dau` → `tt-qr`, `tt-qr-ic`, `tt-qr-v`). 2 tệp, ~7 dòng, rủi ro thấp (không đụng `TheQR`).
- **B:** sửa `the_qr.css` / `TheQR.jsx` cho chắc hơn (nhân đôi chỗ chọn). Nhiều dòng hơn, đụng tệp CẤM → bỏ.

## Ca thử ↔ nghiệm thu
- A1/A2 → `thu_KHSUA1.js` ca A2 (tĩnh: `ThanhToan.jsx`, `thanh_toan.css`, lớp `the-qr*` chỉ còn ở `the_qr.css`).
- B1 canh chung → ca A1 (+ đối chứng thuật toán không báo nhầm).
- B1 trình duyệt → Theo dõi đơn 390 / 360 (đầu thẻ trên khung trắng, số tiền trong khung, mã ≥ 200px, `.the-qr` không flex / không box-shadow); Thanh toán thẻ (`.tt-qr` flex, viền hồng, không vàng / kem).
- B3 → `dot_bien_tay.js` (3 đột biến).
- K5 (không chặn oan): bài cũ `thu_KHSOHD1`, `thu_KHTHE2` giữ xanh.
