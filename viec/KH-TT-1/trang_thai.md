# KH-TT-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- SHA: HEAD 102478a · FETCH_HEAD 102478a (bằng nhau, không kéo)
- 102478a PHIEU: KH-TT-1
- 4278cd7 TIEN-DO: mo KH-TT-1 (Thanh toan: bam ca dong vi, doc lai so du, bo dong QR, nut ghi dung cach tra)
- 5d88097 TIEN-DO: KH-HD-1 xong (chat soat cuoi DAT, gop PR)

## Câu hỏi
(chưa có)

## Phát hiện
- `.switch` trong `demo_mua.css:67` vẫn có `cursor:pointer` ngay cả khi dòng ví khoá (chỉ là con trỏ; ngoài Phạm vi `demo*.css`).
- Dòng ví có `aria-label` đè nội dung → trình đọc màn hình không đọc dòng phụ (số dư); có thể thêm `aria-describedby` — không bắt buộc theo phiếu.

## Soát độc lập (/ra-soat vòng 1) — báo cáo agent, chép nguyên ý
ĐẠT (3 điểm nhỏ, không lỗi chặn). Không lỗi hành vi / tiền; đường tiền không đổi so với 102478a (`thanDatDon`, `cachTra`, `guiDon`, PIN, `guiLaiDungDon`, `xacNhan` không có trong diff).
- LỖI nhỏ (K3): `thu_KHTT1.js:34` dấu kiểm `/toi\.taiLai\(\)/` khớp nhầm code cũ (`ThanhToan.jsx` CACH_KHONG_KHOP) → ĐÃ SỬA thành `/bam\(toi\.taiLai\)/` (commit 2b6d00d).
- NGHI NGỜ: `aria-label` đè dòng phụ; `.the-vi-khoa` mờ cả dòng khi chờ /toi (phiếu A2 nói "mờ"); `bam(toi.taiLai)` truyền event cho `taiLai` (vô hại, `dungTai.js` không dùng đối số); bài cũ vẫn bấm `.switch` (đúng nhờ nổi bọt, ca `o-switch` khoá bật đúng một lần).
- NGHIỆM THU: 14/16 có bằng chứng · thiếu: D3 (phiên chính — xem dưới), D4 (chủ quán thử tay iPhone).
- CHƯA SOÁT ĐƯỢC: người gác chặn nên agent không chạy lại bài; không mở ảnh; không thử tay iPhone.
- BÀI HỌC: dấu kiểm đọc nguồn `/hàm\(\)/` dễ khớp nhầm code cũ cùng tên; chuyển chỗ bấm lên dòng cha thì bài cũ vẫn xanh nhờ nổi bọt → cần ca riêng "bấm đúng một lần".

## Bảng nghiệm thu (mỗi mục một dòng)
- A1 `thu_KHTT1.js` ca chu-bam, o-switch (chữ, .s, .switch một lần, Enter, Space, ≥44px, role=switch)
- A2 ca bao-gia-cham (aria-disabled, bấm không bật, nút "Xác nhận")
- A3 ca toi-loi ("Bấm để thử lại", /toi gọi lần 2, không tự đặt cách trả, bật được)
- A4 ca vi-0d (ẩn dòng)
- B1 ca chu-bam + vi-0d + dấu kiểm nguồn · B2 ca vi-0d · B3 ca chu-bam, vi-thieu, vi-0d · B4 ca vi-thieu · B5 ca vi-thieu 360 + rong-* + rong-thieu/loi/0d ba cỡ · B6 `TheoDoiDon.jsx` không có trong diff
- C1 `thanh_toan.css` mới + import trong ThanhToan.jsx; `main.jsx`/`giaoDien.css`/`demo*.css` không đổi; `doi_chieu_demo.md` · C2 15 ảnh `so_anh/`
- D1 `thu_KHTT1.js` (SỐ CA 9) · D2 bốn bài cũ sửa chữ, đỏ trên gốc (xem `bang_chung_do.txt`), thân gửi / PIN / gửi lại không đụng
- D3 dưới đây · D4 CHỜ chủ quán thử tay

## Kiểm
- `npm test` xanh (32 đạt · 0 hỏng, có Chromium); `node kiem_tra_truoc_khi_giao.js --day-du` 34 đạt · 0 hỏng (dựng app + dist OK); `tu_chay/cong.js tinh` chỉ còn A19 (chờ dòng cuối).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 102478a^ HEAD viec/KH-TT-1` → ✓ CỔNG CHẠY ĐẠT (lần đầu đỏ A11 vì phần sửa chữ nằm trong Chromium → đã thêm một ca đọc nguồn "KH-TT-1" vào Phần 1 của mỗi bài cũ).
- Đột biến (dot_bien.py): KHÔNG làm — việc thường, không đổi tiền/bảo mật/thân gửi; cổng `tinh` không đòi (A17/A18 không báo).

## Báo cáo 7 mục
- VIỆC: KH-TT-1 — Thanh toán: bấm cả dòng ví, đọc lại số dư khi lỗi, bỏ dòng "Chuyển khoản QR", nút ghi đúng cách trả.
- ĐÃ SỬA: `src/pages/ThanhToan.jsx` (dòng ví role=switch cả dòng; nhánh `loiSoDu`; bỏ dòng QR; ẩn tiêu đề khi ví 0đ; chữ nút theo cachTra), `src/giaoDien/thanh_toan.css` (mới), `cong_cu/thu_KHTT1.js` (mới), chữ/ca trong thu_KHMUA1 / 1b / 1c / KHNHANH1, hồ sơ `viec/KH-TT-1/`.
- BÀI THỬ: mới 9 ca (không Chromium) / 89 (Chromium); đỏ trên gốc 2 đạt·7 hỏng / 33 đạt·29 hỏng; bốn bài cũ đỏ trên gốc (15/1/1/3 hỏng) rồi xanh; SỐ CA 9 / 56 / 48 / 27 / 81.
- ĐÃ RÀ K4: grep "Xác nhận trả", "Chuyển khoản QR", `.switch`, `btn-disabled` trong src/ + cong_cu/ — không còn chỗ dùng chữ cũ; `btn-disabled` còn ở các nút khác (không phải công tắc ví).
- CHƯA KIỂM: thử tay trên iPhone thật (D4); ảnh demo ↔ app so bằng mắt do chat App KH ở bước gộp; trình duyệt Zalo; cỡ chữ 200% chưa đo riêng màn này.
- GIT: nhánh `viec/KH-TT-1`, đã push; không PR, không merge.
- BÀI HỌC: xem dưới.

## Bài học
- KHOÁ (đã làm, trong Phạm vi): bài sửa chữ nằm trong Chromium thì cổng không có trình duyệt thấy "xanh trên gốc" (A11) → thêm ca đọc nguồn ở Phần 1 của mỗi bài cũ (đỏ trên gốc, có "KH-TT-1").
- KHOÁ (đã làm): dấu kiểm đọc nguồn khớp nhầm code cũ (K3) → đổi mẫu sang `bam\(toi\.taiLai\)`.
- NGUYÊN TẮC (đề xuất, ngoài Phạm vi → chat soát gom): khi chuyển chỗ bấm từ phần tử con lên cha, thêm ca "bấm đúng một lần" vì bài cũ vẫn xanh nhờ nổi bọt. Không đủ chung để mở K mới; BỎ nếu chat soát thấy một lần.
- GHI CHÚ chạy kiểm: `thu_KHNHANH1.js` (POS giả trễ 700 ms) hỏng 3 ca khi có HAI `npm test` chạy cùng lúc (hook Stop + lệnh nền của máy); chạy riêng 225 đạt · 0 hỏng, `npm test` một mình 32 đạt · 0 hỏng. Nghi do tải máy, chưa chứng minh; ghi phát hiện cho chat soát.
- CỔNG: `✓ CỔNG CHẠY ĐẠT` (`KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 102478a^ HEAD viec/KH-TT-1`, HEAD 7ab5506); `tinh` chỉ còn A19 chờ dòng cuối.
- BỎ: người gác chặn `mkdir`/`cp` thư mục/`sed -i`/lệnh ghép — chỉ là cách làm, dùng Edit và lệnh đơn.
HEAD ĐÃ KIỂM: efaba0b
