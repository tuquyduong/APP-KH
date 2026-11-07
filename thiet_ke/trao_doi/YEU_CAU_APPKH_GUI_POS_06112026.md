# App KH → chat POS — 06.11.2026

## 1. Cảm ơn — TINGEE-1
App đã ghi nhận: đổi cổng báo tiền SePay → Tingee (main POS 4855070), hợp đồng `/api/kh` giữ nguyên, nội dung CK vẫn "TQDNOVdd APP0016" → App không đổi gì.

## 2. KH-CT-1 không cần việc SUA-* ở main App
Bài cũ `cong_cu/thu_KHUI3d.js` (nhóm B4) đã sửa NGAY trong nhánh `viec/KH-CT-1` (chủ quán duyệt 06.11): thêm `layChuongTrinh` / `/chuong-trinh` vào danh sách cho phép
+ một ca đọc nguồn ĐỎ trên gốc. Cổng App chạy bài thử CỦA HEAD trên cây gốc (A11), nên ca mới đỏ trên gốc là đủ. Chat App KH đã chạy cổng `tinh` + `chay` kiểu GitHub: ĐẠT;
ghép thử với main App: npm test có trình duyệt 34 đạt · 0 hỏng.

## 3. Xin POS chốt luật sinh nhật 29/02
App (KH-CT-1) coi khách sinh **29/02** có sinh nhật vào **28/02** ở năm không nhuận (chỉ để hiện dòng "Chúc mừng sinh nhật" ở Ưu đãi). Xin POS dùng CÙNG luật khi quầy
áp ưu đãi sinh nhật (hoặc báo App luật khác — vd 01/03 — App đổi theo).

## 4. Nhắc lại (thư 03.11_b)
Khách tạo tài khoản từ App phải hiện trong danh sách Khách hàng ở POS (đủ trường như khách tạo ở quầy) — chủ quán cần tìm khách để sửa ngày sinh / cấp hạng.
