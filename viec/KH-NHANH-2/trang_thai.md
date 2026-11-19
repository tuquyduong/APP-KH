# KH-NHANH-2 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: `viec/KH-NHANH-2` · cây sạch · HEAD `2ba09a5` · FETCH_HEAD `2ba09a5` (bằng nhau — không kéo).
- `git log --oneline -3`:
  - `2ba09a5 PHIEU: KH-NHANH-2`
  - `88af1ef TIEN-DO: mo KH-NHANH-2 (vong xoay cho kieu B + tong cu mo + preconnect + bao gia gui ngay); quyet dinh 18.11; thu POS 18.11; ban giao`
  - `706ed73 TIEN-DO: KH-VC-2 xong (PR #43) + KH-NAP-1 xong (PR #44); KH-SUA-2 them (8)-(11); KH-DOI-1 theo hop dong POS da hen + PIN; KH-HUY-1 mo duoc; quyet dinh 17.11; thu POS 16.11 (doi diem) + thu App 17.11; ban giao`
- Kho mở ở dạng nông: `thu_KHND3e` (đọc lịch sử git tìm commit KH-ND-3e) đỏ 2 ca vì không thấy commit cũ → `git fetch -q --unshallow origin viec/KH-NHANH-2`
  (chỉ tải lịch sử, không đổi tệp) → xanh. Không liên quan code của việc.

## Tiến độ
- [x] 1 đối chiếu · [x] 2 đọc · [x] 3 kế hoạch (agent phụ soát → sửa, xem ke_hoach.md) · [x] 4 bài thử đỏ · [x] 5 sửa · [x] 6 kiểm · [ ] 8 soát · [x] 10 báo cáo

## Chỗ vá → đột biến (viec/KH-NHANH-2/dot_bien_tay.js — việc chỉ đổi src/ + index.html, không có server/ client/src/ → không dot_bien.py, như KH-VC-2)
| Chỗ vá | Đột biến | Kết quả |
|---|---|---|
| api.js `goi`: lượt ngầm không đếm | VS-DEM-CA-LUOT-NGAM | BẮT ĐƯỢC (33 đạt · 4 hỏng) |
| api.js trễ 300 ms | BV-BO-TRE-300 | BẮT ĐƯỢC |
| cho.css vòng không nền | VS-VONG-CO-NEN | BẮT ĐƯỢC |
| cho.css không lớp phủ | VS-LOP-PHU-CA-MAN | BẮT ĐƯỢC |
| datDon.js `taoGop` gom đầu | VS-GOM-CHI-DUOI | BẮT ĐƯỢC |
| index.html preconnect chỉ gốc | VS-PRECONNECT-CO-API | BẮT ĐƯỢC |
| duLieuKhach.js kho đã có dữ liệu → ngầm | BV-KHO-DA-CO-VAN-DEM | BẮT ĐƯỢC |
| GioHang nút khoá khi tính lại | VS-NUT-DI-TIEP-MO-KHI-TINH-LAI | BẮT ĐƯỢC (Chromium) |
| GioHang số trên nút chỉ báo giá mới | VS-NUT-MANG-SO-CU | BẮT ĐƯỢC (Chromium) |
| dungDatDon.js `huy` theo khoá (lượt cũ về muộn) | BV-LUOT-CU-GHI-DE-GIO-MOI | BẮT ĐƯỢC (Chromium) |
| dungDatDon.js lượt đồng hồ ngầm | BV-THEO-DOI-DONG-HO-DEM | BẮT ĐƯỢC (Chromium) |
Dòng cuối: `TẤT CẢ ĐỘT BIẾN BỊ BẮT` (11/11, `node viec/KH-NHANH-2/dot_bien_tay.js --trinh-duyet`).

## Phần trình duyệt (chạy thật ở máy — §9)
- `node cong_cu/thu_KHNHANH2.js` (Chromium 390, POS giả trễ): 62 đạt · 0 hỏng. `KHONG_TRINH_DUYET=1`: 37 đạt · 0 hỏng (= SỐ CA).
- `node cong_cu/thu_KHMUA1.js` có Chromium: 130 đạt · 0 hỏng; `KHONG_TRINH_DUYET=1`: 57.
- Ảnh 390 (`so_anh/`): Trang chủ đang tải, Giỏ đang tính lại, Thanh toán đang gửi — nhánh + `_goc` (gốc cùng thời điểm: không vòng; Giỏ gốc trống tổng).

## Phát hiện
- Bài đọc nguồn cũ của BaoDonXong (thu_KHBAO1 A2, thu_KHNHANH1 KH-BAO-1 D1) khoá nguyên văn `const hoiNgay = …` → không bọc được `ngam` ở đó; luật kho
  (`taoCua`: đã có dữ liệu → ngầm) đã phủ trường hợp có đơn đang chạy. Còn sót: quay lại tab khi kho /don CHƯA có dữ liệu (vd lần đầu lỗi) → một lượt "chờ".
- `src/heThong.js` / `src/giaHan.js` ngoài Phạm vi → ba cửa nền đánh dấu theo đường ở api.js (`CUA_NGAM`). Mở thẳng `/uudai/hang` mà CHỈ /hang chậm → không vòng.
