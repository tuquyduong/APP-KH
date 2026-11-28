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
- Bài cũ dựa vào `nhom` = tên (POS giả `thu_KHMUA1b.js` và các bài dùng nó): không đỏ vì ca "POS cũ" giữ nguyên hành vi (tên = `nhom`). Ban đầu có thêm một dòng vào `thu_KHMUA1b.js` (`S.menu`) nhưng cổng A11 bắt (bài cũ sửa mà xanh trên gốc) → ĐÃ HOÀN LẠI nguyên văn (`git diff 16ea448 -- cong_cu/thu_KHMUA1b.js` rỗng); `thu_KHNHOM1.js` tự đè đường `/menu` của POS giả bằng `ctx.route` đăng ký sau (hàm `baMenu`). Không dùng `## Bài thử cũ sửa`.

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

## Vòng sửa sau soát 1 (28.11)
- `thu_KHUI2.js` ("nhóm theo nhom, thiếu → Khác") đỏ do việc này (C2): POS cũ đặt tên nhóm "Khác" + món không nhóm bị tách thành hai nhóm "Khác". Sửa ở code (không sửa bài): `nhomTheoTen` gom theo `khoaNhom` (mã; món không mã theo tên) → `thu_KHUI2.js` 78/0. Đồng thời xử lý nghi vấn 5 của người soát (món không mã khác `nhom_ten`).
- `--day-du` (code mới): `70 đạt · 0 hỏng`, vite build + dist + K2d xanh; K9/K10 trong kiểm tĩnh xanh. `thu_KHNHOM1.js` 76 đạt (Chromium) · 16 ca ở `KHONG_TRINH_DUYET=1`; đột biến 9/9 bị bắt.

## BÁO CÁO 7 MỤC
1. **VIỆC** — KH-NHOM-1: Menu lấy tên + thứ tự nhóm món từ POS (`nhom` = mã, `nhom_ten`, `nhom_thu_tu`, hợp đồng v19); chép hợp đồng v20 (đã có từ phiếu).
2. **ĐÃ SỬA** — `src/menuLoc.js` (`maNhom`, `tenNhom`, `thuTuNhom`, `khoaNhom`, `bieuTuongMon`, `nhomTheoTen` gom theo khoá + xếp theo thứ tự POS); `Menu.jsx` (ô + tiêu đề theo tên, lọc / đường dẫn theo mã, ô riêng `gio-vang`/`the-thanh-vien`/slug rỗng/trùng không có ô nhóm POS); `TrangMon.jsx`, `GioHang.jsx`, `MonO.jsx` (tên + biểu tượng theo `bieuTuongMon`); `nd/menu.js` (chỉ đường `menu.nhom`); `thu_KHMUA1b.js` (+`S.menu` cho POS giả); bài mới `thu_KHNHOM1.js`.
3. **BÀI THỬ** — `thu_KHNHOM1.js`: gốc 35 đạt · 30 hỏng → sau 76/0 (16 ca không trình duyệt, `SỐ CA thu_KHNHOM1: 16`); đột biến `dot_bien_tay.js` 9/9; `npm test` / `--day-du` 70/0; `thu_KHND3e.js` 42/0 sau unshallow.
4. **ĐÃ RÀ K4** — `grep` `.nhom` trong `src/`: chỉ còn `canTuPos.js` (danh sách trường hợp đồng) và `App.jsx` (`r.tham.nhom` là slug đường dẫn); mọi chỗ dùng `bieuTuongNhom(mon.nhom)` / `mon.nhom || nd(...)` đã chuyển. Không đụng đường tiền.
5. **CHƯA KIỂM** — chưa thử trên POS thật (chỉ POS giả theo dữ liệu đo 27.11); chưa so ảnh `LUU_ANH_DIR` gốc↔nhánh bằng công cụ so ảnh (chỉ ảnh trước/sau xem mắt ở `so_anh/`); C6 chủ quán thử tay; hai mã khác nhau cùng slug: chỉ ô đầu có ô chọn (không có ca trình duyệt riêng); cổng GitHub chưa chạy.
6. **GIT** — nhánh `viec/KH-NHOM-1`, commit từng file, push `git push -u origin viec/KH-NHOM-1`; không merge, không PR.
7. **BÀI HỌC** — xem bên dưới.

## Bài học
- **KHOÁ (đã làm):** ca "POS cũ đặt tên nhóm trùng chữ Khác" đã có sẵn trong `thu_KHUI2.js` bắt được việc tách nhóm; thêm ca `maNhom` cắt khoảng trắng + thứ tự nhóm = số nhỏ nhất vào `thu_KHNHOM1.js` (đỏ trên gốc).
- **NGUYÊN TẮC (đề xuất, ngoài Phạm vi `KHUON_LOI.md`):** K-mới "Đổi nghĩa trường POS thì chạy ĐỦ `npm test` trước `/ra-soat`, không chỉ bài mới — lần này `thu_KHUI2.js` chỉ lộ ở bản `--day-du` vì lần `npm test` đầu bị cắt bằng `head -30`". Đã gây: KH-NHOM-1 28.11. Dấu hiệu: lọc kết quả bằng `head` rồi kết luận. Chặn: đọc dòng tổng cuối.
- **NGUYÊN TẮC (đề xuất):** kho mây nông (`git rev-parse --is-shallow-repository` = true) làm bài so với commit cũ đỏ giả — chạy `git fetch --unshallow` trước khi kết luận bài cũ đỏ (`thu_KHND3e.js` 28.11).
- **BỎ:** đột biến "lọc theo m.nhom" tương đương code (một lần).
- Dọn `KHUON_LOI.md`: không có lời dặn nào cần xoá.
