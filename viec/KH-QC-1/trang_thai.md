# KH-QC-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-QC-1`; HEAD = FETCH_HEAD = `0a5f194`.
- `0a5f194 PHIEU: KH-QC-1`
- `ea0281e TIEN-DO: mo KH-ADMIN-1 …`
- `474eda6 TIEN-DO: KH-ND-3d, KH-THE-1 xong …`

## Câu hỏi

## Phát hiện

### Câu hỏi (ghi 15.11, sau `npm test` — 46 đạt · 6 hỏng; dừng chờ chủ quán)
1. `src/pages/KiemKhop.jsx:11` có bảng `GOI` ánh xạ `cua` → hàm gọi. Nghiệm thu A2 bắt thêm dòng `GET /quang-cao` vào `canTuPos.js`, nhưng `GOI['GET /quang-cao']` chưa có →
   `thu_KHUI3b.js` đỏ 2 ca ("GOI[cua] is not a function", trang /kiemkhop sập). Phiếu CẤM sửa `src/pages/**`. Cần: cho phép thêm `'GET /quang-cao': layQuangCao` vào `KiemKhop.jsx` (1 dòng + import),
   hay bỏ dòng A2 khỏi `canTuPos.js`?
2. `thu_KHUI3d.js:231` (ca B4, 6 lần ở 360/390/430 × 100/130%) có danh sách cửa được phép gọi; `/quang-cao` là cửa mới nên ca đỏ ("cửa lạ"). Bài này xanh trên gốc, phiếu D2 chỉ cho sửa ca `uu_tien` →
   cần chủ quán thêm mục `## Bài thử cũ sửa` (thêm `/quang-cao` vào danh sách) hoặc cho phép sửa.
Đã xong, chờ trả lời: A1 · B1–B4 · C1–C4 · D1 (thu_KHQC1 39 ca) · D2 · mã đột biến D3 viết sẵn (`dot_bien_tay.js`, chưa chạy) · còn D4, D5, D6, báo cáo.
