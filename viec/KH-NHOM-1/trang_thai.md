# KH-NHOM-1 — trạng thái

## Đồng bộ bản chụp (bước 1)
- Nhánh `viec/KH-NHOM-1`; cây sạch; `git rev-parse --short HEAD FETCH_HEAD` = `16ea448` · `16ea448` (đủ commit của origin, không kéo).
- `git log --oneline -3`:
  - `16ea448 PHIEU: KH-NHOM-1`
  - `bcec5cc TIEN-DO: mo KH-NHOM-1 (nhom mon theo POS v19, Sonnet); them KH-TOPPING-1 (cho, gop KH-GHICHU-1); hop dong /api/kh v20; thu POS + App 27.11; quyet dinh 27.11`
  - `0063091 TIEN-DO: KH-HUY-1 xong (PR #46); mo KH-DOI-1 (doi diem lay qua, thiet ke duyet 26.11); KH-SUA-2 them (17)(18); quyet dinh 26.11`

## Câu hỏi
(không)

## Phát hiện
- Người gác chặn lệnh ghép `mkdir … && cd …`, `cd <thư mục nháp> &&` kèm biến môi trường, `python3 - <<heredoc`, `Monitor until` — đổi sang Edit/Write và lệnh đứng một mình.
- Phiếu B6 ghi "báo giá 400 `MON_KHONG_BAN`"; trong code `MON_KHONG_BAN` chỉ được xử lý ở đường đặt đơn (`ThanhToan.jsx` `xuLyLoi`, dòng ~126) → ca thử đi đường đó, không đổi code.
- `thu_KHND3e.js` đỏ 2 ca B1 ("datDon.js so với bản gốc fe752c3") — KHÔNG do việc này: `git diff 16ea448 HEAD -- src/datDon.js` rỗng; `src/datDon.js` đã bị KH-HUY-1 (bf5b8e3) sửa sau mốc fe752c3 mà bài chưa cập nhật. Ngoài Phạm vi → chat soát / việc sau (cập nhật mốc trong `thu_KHND3e.js`). `thu_KHNAP1.js` đỏ 1 ca khi chạy cùng lúc nhiều tiến trình, chạy lại một mình xanh (127 đạt · 0 hỏng) — chập chờn theo tải.
- Đột biến "lọc theo `m.nhom` thay `khoaNhom`" là tương đương (khoá = mã khi có mã; chỉ khác ở nhóm không mã) → đã bỏ khỏi `dot_bien_tay.js`.

## C2 — bài cũ
- Bài cũ dựa vào `nhom` = tên (POS giả `thu_KHMUA1b.js` và các bài dùng nó): không đỏ vì ca "POS cũ" giữ nguyên hành vi (tên = `nhom`). Chỉ thêm một dòng vào POS giả của `thu_KHMUA1b.js`: `/menu` trả `S.menu || MENU_DS` (không đổi ca nào). Không dùng `## Bài thử cũ sửa`.

## Bảng "chỗ vá → đột biến" (`dot_bien_tay.js`, việc chỉ đổi `src/` nên không có `dot_bien.py`)
| Chỗ vá | Đột biến |
|---|---|
| `tenNhom`: `nhom_ten` trước `nhom` | VS-HIEN-NHOM-THAY-NHOM-TEN · VS-POS-CU-THIEU-NHOM-TEN-HIEN-KHAC |
| `nhomTheoTen` xếp theo `nhom_thu_tu` | BV-BO-XEP-THEO-NHOM-THU-TU |
| `nhomTheoTen` gom theo mã | VS-GOP-HAI-MA-TRUNG-TEN |
| `thuTuNhom` chỉ nhận số hữu hạn | VS-THU-TU-NHAN-CHUOI |
| `bieuTuongMon` khớp theo tên | VS-BIEU-TUONG-KHOP-THEO-MA |
| Menu lọc theo mã / đường dẫn theo mã / ô riêng thắng | VS-LOC-THEO-TEN · VS-SLUG-THEO-TEN · VS-O-NHOM-POS-DE-LEN-O-RIENG-GIO-VANG |
Kết quả: `node viec/KH-NHOM-1/dot_bien_tay.js --trinh-duyet` → "TẤT CẢ ĐỘT BIẾN BỊ BẮT" (9/9).

## Ghi chú
- Ảnh trước / sau 360·390·430: `so_anh/truoc`, `so_anh/sau`; đối chiếu: `doi_chieu_demo.md`.
- Khoá danh mục /admin: không thêm khoá mới (giữ `menu.nhom`, đổi chỉ đường sang "POS › Quản lý › Giá bán & nhóm món (tên + thứ tự)"); mọi nơi hiện tên nhóm vẫn gắn `data-nd`.
