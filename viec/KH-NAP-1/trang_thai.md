# KH-NAP-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (16.11.2026)
- Nhánh: viec/KH-NAP-1 · cây sạch · HEAD d6f0f88 = FETCH_HEAD d6f0f88 (không kéo, đã bằng nhau)
- git log --oneline -3:
  - d6f0f88 PHIEU: KH-NAP-1
  - e7c4f0e TIEN-DO: KH-THE-3 xong (PR #42); mo KH-NAP-1 + KH-VC-2 song song (Opus, thiet ke chu quan duyet 16.11); KH-DOI-1 cho hop dong POS viet truoc; hop dong /api/kh v17 + 4 bai thu thoi ghim v16; quyet dinh 16.11 (b); thu POS 16.11; ban giao
  - c8146cd Merge pull request #42 from tuquyduong/viec/KH-THE-3

## Tiến độ
- Bước 3: kế hoạch ở `ke_hoach.md` — phiếu dặn "Chờ duyệt kế hoạch" → DỪNG chờ chủ quán gõ "duyệt".
- Agent soát kế hoạch (chỉ đọc, 16.11): CẦN SỬA 3 ý — (1) truyền prop mở Ví phải sửa dòng cũ App.jsx + chữ ký UuDai/UuDaiToi → thành Câu hỏi 4;
  (2) `tenGui` ở khối "chưa rõ" của ThanhToan sẽ hiện "undefined" cho dòng nạp → thêm vào Đường song song + ca B4; (3) thiếu ca NAP_KHONG_GOP,
  NAP_CHI_TIEN_MAT_QR, tiền về muộn (B5), dòng C7 → đã thêm. Kế hoạch đã sửa theo cả 3.

## Câu hỏi
Bốn câu ở đầu `ke_hoach.md` (mục "Câu hỏi"): (1) thêm `src/pages/KiemKhop.jsx` vào Phạm vi (thu_KHKHOP1.js dòng 55–58 đòi trang kiểm khớp gọi mọi cửa GET
`co: true`); (2) nút "Đặt lại" ở Lịch sử đơn với đơn nạp — `GET /don` không có trường nhận biết đơn nạp; (3) đổi điều kiện dòng `tuy` của ThanhToan.jsx
(giá trị đồ uống giữ nguyên); (4) thêm prop mở Ví vào các dòng cũ của App.jsx + chữ ký UuDai/UuDaiToi.
