# KH-TT-1 — kế hoạch (việc thường, chạy thẳng)

## Phương án
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| Bấm cả dòng | `bam()` + `role=switch` + `aria-checked` lên `.notif-row.the-vi`; `.switch` thành hình (`aria-hidden`) — ~6 dòng | thêm onClick riêng cho từng con | A: một chỗ bấm, không bật hai lần (click ô nổi bọt lên dòng) |
| Số dư lỗi | nhánh `soDu === null && !dangTai` → dòng bấm gọi `toi.taiLai()`, chữ "Chưa đọc được số dư · Bấm để thử lại" — ~4 dòng | nút riêng | A: tái dùng cùng dòng |
| Bỏ QR | xoá khối JSX; tiêu đề "Cách trả tiền" chỉ hiện khi `soDu !== 0` — ~-6 dòng | giữ ẩn bằng CSS | A đơn giản |
| Chữ nút | `chuNut` theo `cachTra` (qr / vi / vi_qr) — ~3 dòng | hàm riêng | A |
| CSS | `thanh_toan.css` mới: vùng bấm ≥44px, nút xuống dòng — ~10 dòng | sửa demo_mua.css (cấm) | phiếu |
Ước lượng: app ~35 dòng, thử ~200 dòng. Không đổi datDon.js / thân gửi / PIN.

## Ca thử ↔ nghiệm thu (thu_KHTT1.js)
A1 bấm chữ → aria-checked đổi, nút đổi chữ; bấm `.switch` → đổi đúng 1 lần; Enter/Space; cao ≥44px · A2 báo giá chưa về → aria-disabled · A3 /toi lỗi → "Bấm để thử lại" → gọi lần 2 → số dư, bật được; không tự chọn cách trả · A4 ví 0đ ẩn dòng · B1 không còn "Chuyển khoản QR" · B2 ví 0đ không tiêu đề "Cách trả tiền" · B3 ba chữ nút + "Xác nhận" khi chưa báo giá · B4 câu "Dùng hết…" giữ · B5 không tràn ở 360 · đặt đơn ba cách vẫn đúng `cach_tra`, hỏi PIN (K5).
Bài cũ sửa chữ: thu_KHMUA1/1b/1c, thu_KHNHANH1 (chữ nút "Xác nhận trả", "Chuyển khoản QR"); không nới phép kiểm tiền.
Đường song song: gửi lại đơn (`guiLaiDungDon`) không đụng; `datDon.js` không đụng.
