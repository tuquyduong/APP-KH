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

## Cập nhật theo chỉ đạo chủ quán (28.11)
- Kho đã `git fetch --unshallow` (kho nông là nguyên nhân `thu_KHND3e.js` đỏ khi so với mốc `fe752c3`): chạy lại → `42 đạt · 0 hỏng` (xanh). Sửa mục Phát hiện cũ: KHÔNG còn bài đỏ ngoài phạm vi.
- B6 `MON_KHONG_BAN`: chủ quán xác nhận Giỏ đã đánh dấu dòng qua `monLoi` — không cần sửa code; ca thử `mon-khong-ban` chứng minh.

## Soát độc lập `/ra-soat` — vòng 1 (báo cáo nguyên văn rút gọn)
KHÔNG ĐẠT (do chưa ghi C5/`HEAD ĐÃ KIỂM`, vài lỗi nhỏ). LỖI: (1) trang_thai thiếu `HEAD ĐÃ KIỂM` + kết quả cổng — K1; (2) `Menu.jsx` hai mã cùng slug cho hai ô cùng đường dẫn — K5; (3) `nhomTheoTen` lấy thứ tự theo món đầu (món đầu thiếu số → 9999) — K5; (4) `maNhom` không cắt khoảng trắng — K5; (5) món không mã mà `nhom_ten` khác nhau gộp một nhóm — K5 rất hiếm (POS thật mã rỗng đi với tên rỗng) — để nguyên, ghi nhận; (6) so TÊN với 'gio-vang' ở tiêu đề — nit, không thực tế.
NGHIỆM THU: 14/17 có bằng chứng; thiếu C4 (ghi so ảnh), C5, C6 (chủ quán thử tay).
Đã xử lý vòng 1: (2) bỏ ô trùng slug (`Menu.jsx` filter `findIndex`), (3) `Math.min` thứ tự, (4) `trim`, thêm ca thử (SỐ CA 15→16), cập nhật đột biến; (1) ghi ở dưới.
BÀI HỌC (từ người soát): ghi `HEAD ĐÃ KIỂM` + kết quả cổng TRƯỚC `/ra-soat`; chuẩn hoá khoá nhóm ở một chỗ.
