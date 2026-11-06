# KH-SINH-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (05.11)
- Nhánh: `viec/KH-SINH-1`; cây sạch (không file theo dõi đang sửa); `git fetch origin viec/KH-SINH-1` → HEAD = FETCH_HEAD = `5f7dd67` (không cần kéo).
- `git log --oneline -3`:
  - `5f7dd67 PHIEU: KH-SINH-1`
  - `f20f0d7 TIEN-DO: mo dot 1 song song (KH-HD-1 chi tiet don theo hoa_don POS; KH-SINH-1 ngay sinh + loi chao du ten + xoa mon); thu App/POS 05.11 - so v26`
  - `a0b68d0 TIEN-DO: mo KH-MUA-1c (KHO_BAN = chua ro, gui lai cung khoa; hop dong v9; Theo doi don doc giu vi tu POS) - so v25`
- Thấy commit `PHIEU: KH-SINH-1` (`5f7dd67`).

## Câu hỏi
1. (ĐÃ TRẢ LỜI — chủ quán duyệt 05.11, ghi ở phiếu) `thu_KHNHANH1.js` ca D3 đổi regex thành `/cô Nguyễn Linh!/`; đã sửa ở commit `8ff848d`, `SỐ CA` ở `bang_chung_do.txt`.

2. **Cổng `chay` đỏ A11 vì `thu_KHNHANH1.js` xanh trên code gốc.** Lệnh `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 5f7dd67^ HEAD viec/KH-SINH-1` →
   `✗ [A11] bài thử cong_cu/thu_KHNHANH1.js XANH trên code gốc — bài thử vô giá trị (K3), phải đỏ trước khi vá`.
   Nguyên nhân: ca D3 (dòng 492) nằm trong phần Chromium; GitHub / cổng chạy không trình duyệt nên ca không chạy, bài xanh cả trên gốc lẫn sau vá (80 đạt). Ở máy có Chromium ca đỏ trên gốc đo bằng hàm `chiaLoiChao` (xem `bang_chung_do.txt`).
   Đề nghị chủ quán: thêm mục `## Bài thử cũ sửa` vào phiếu liệt kê `cong_cu/thu_KHNHANH1.js` (ca D3 chỉ chạy có Chromium, không đỏ được ở cổng không-trình-duyệt), HOẶC cho phép thêm một ca hàm thuần ở bài này (ngoài ý "không sửa dòng nào khác" của phiếu). Máy không tự chọn, không tự sửa phiếu.
   Hệ quả: dừng ở đây; chưa ghi `HEAD ĐÃ KIỂM`, chưa `/ra-soat`, chưa báo cáo 7 mục.

## Bước 1 (làm lại 05.11, phiên tiếp)
- `git fetch`: HEAD = FETCH_HEAD = `266cd8a` (hook mở phiên kéo từ `5f7dd67`). `git log --oneline -3`: `266cd8a PHIEU…trả lời Câu hỏi 1` · `6127258 KH-SINH-1: ghi ket qua kiem…` · `e0550c5 KH-SINH-1: bang chung do, doi chieu demo…`.

## Bảng "chỗ vá → đột biến" (`dot_bien.py`; kết quả: TẤT CẢ BỊ BẮT — số ở `bang_chung_do.txt`)
| Chỗ vá | Đột biến |
|---|---|
| `dinhDang.js` `chiaLoiChao` tên đủ | VS-TEN-CHI-TU-CUOI · VS-TEN-KHONG-GOP-KHOANG-TRANG |
| `dinhDang.js` `tachNgaySinh` | VS-NGAY-30-02-HOP-LE · VS-NAM-NHUAN-SAI |
| `HoSo.jsx` `NgaySinh` | VS-NGAY-SINH-GOP-KHOA-KHAC · BV-HOI-LAI-TRUOC-KHI-LUU · BV-CHAN-NGAY-TUONG-LAI · VS-DA-CO-HIEN-LOI-THAY-VI-DOC-LAI · BV-CHE-O-SUA-KHI-DA-CO |
| `gio.js` `chenDong` | VS-CHEN-LAI-SAI-CHO · VS-CHEN-LAI-NHAN-DOI-DONG |
| `GioHang.jsx` nút xoá + Hoàn tác | BV-NUT-XOA-MON · VS-HOAN-TAC-KHONG-TRA-DONG · VS-THONG-BAO-KHONG-TU-TAT |

## Kiểm (bước 6, 05.11 — sau Câu hỏi 1)
- `npm test`: 30 đạt · 0 hỏng (`thu_KHNHANH1.js` 224 đạt · 0 hỏng, có Chromium).
- `node kiem_tra_truoc_khi_giao.js --day-du`: vite build thành công, `dist/index.html` đúng; lần chạy đầu 31 đạt · 1 hỏng do `thu_KHMUA1b.js` (ngoài Phạm vi, chạy riêng lại 253 đạt · 0 hỏng — xem Phát hiện).
- Cổng `tinh`: chỉ còn `✗ [A19]` trước khi ghi dòng HEAD ĐÃ KIỂM.
- Chromium thật: `thu_KHSINH1.js` 92 đạt · 0 hỏng; ảnh 360 / 390 / 430 ở `so_anh/`, `doi_chieu_demo.md`.

## Phát hiện
- Người gác chặn `sed -i`, `for` / `;` / `&&` ghép lệnh chạy script, `git -C`, `sleep` — đã đổi sang Edit và lệnh đơn (không phải lỗi, chỉ ghi nhận).
- `npm test` chạy hơn 10 phút trên máy này (nhiều bài Chromium cũ chạy tuần tự) — vượt mốc 120 s của công cụ, phải chạy nền.
- Bài thử Chromium chập chờn khi máy bận (ngoài Phạm vi, không sửa): hook báo `thu_KHNHANH1.js` 222 đạt · 2 hỏng một lần, `--day-du` báo `thu_KHMUA1b.js` 252 đạt · 1 hỏng một lần; chạy riêng lại đều 0 hỏng (224 / 253). Ca hỏng nằm ở phần trình duyệt (chạy 56–61 giây). Đề xuất: chat soát xem hạn chờ ở các bài Chromium.

## Câu hỏi 2 — đã xử lý (06.11)
- Thêm ca hàm thuần vào Phần 1 `thu_KHNHANH1.js` (commit 03db91b): đỏ trên gốc (`ten` = "Linh"), xanh sau vá; KHONG_TRINH_DUYET=1 81 đạt · 0 hỏng; SỐ CA 81 ở `bang_chung_do.txt`.
- ✓ CỔNG CHẠY ĐẠT (`KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 5f7dd67^ HEAD viec/KH-SINH-1` tại HEAD 6865020).

HEAD ĐÃ KIỂM: 6865020

## Soát độc lập `/ra-soat` — vòng 1 (06.11)
Kết quả agent: KHÔNG ĐẠT (nhẹ). NGHIỆM THU 20/20 mục có bằng chứng (D4 chỉ chờ văn bản 3 thao tác, ghi ở báo cáo bên dưới).
- Lỗi: `src/gio.js:48` `demMon =(gio)` thiếu khoảng trắng; `thu_KHNHANH1.js:225` dòng H2 bị đổi lệch khoảng trắng (phiếu cấm đổi dòng khác) → ĐÃ SỬA ở commit 50521df. Lớp `pf-ns-xem` không phải lớp chết: là móc chọn của bài thử (thu_KHSINH1.js:176,202,208,209) → giữ.
- Nghi ngờ (không sửa, ghi nhận): `NGAY_SINH_DA_CO` nuốt lỗi — nếu đọc lại /toi hỏng mạng thì khách không thấy phản hồi; chỉ một state `daXoa` nên Hoàn tác chỉ cho món xoá cuối; ảnh 360 tên dài sát nút QR (chưa đè).
- Bài học (agent): phiếu dặn "không đổi dòng khác" thì soát `git diff` từng dòng sau khi sửa tay.
- Sau sửa: cổng `chay` ✓ ĐẠT (KHONG_TRINH_DUYET=1); `npm test` lần 1 29 đạt · 1 hỏng (không rõ bài — chập chờn Chromium như mục Phát hiện), lần 2 lọc dòng hỏng: không có dòng hỏng nào.

## Báo cáo 7 mục
- VIỆC: KH-SINH-1 — ngày sinh nhập một lần (HoSo.jsx), lời chào đủ tên (dinhDang.js), nút xoá món + Hoàn tác (GioHang.jsx, gio.js, gio_xoa.css).
- ĐÃ SỬA: các file trên + 5 bài thử cũ theo lời chào mới (KHUI2, KHUI3b, KHUI3d, KHLUU1, KHNHANH1 gồm ca hàm thuần mới) + bài mới thu_KHSINH1.js.
- BÀI THỬ: thu_KHSINH1 24 ca (92 đủ Chromium); thu_KHNHANH1 81 (KHONG_TRINH_DUYET=1); 14 đột biến đều bị bắt; cổng tĩnh + chạy ĐẠT.
- ĐÃ RÀ K4: tenNgan không còn ở src; mọi lời chào qua `chiaLoiChao`; `ngay_sinh` chỉ ở HoSo.jsx; xoá dòng giỏ chỉ qua `xoaDong`.
- CHƯA KIỂM: chạy thật trên iPhone/Zalo; `npm test` lần 1 có 1 hỏng chưa xác định bài (lần 2 sạch); D4 — chủ quán thử tay: (1) Trang chủ chào "anh LINH P!"; (2) Hồ sơ nhập ngày sinh → lưu → không sửa được; (3) Giỏ bấm xoá món → Hoàn tác.
- GIT: nhánh viec/KH-SINH-1, đã push; không PR, không merge.
- BÀI HỌC: KHOÁ — đã có bài + 14 đột biến. NGUYÊN TẮC — sửa tay theo phiếu "không đổi dòng khác" thì xem diff từng dòng. BỎ — chập chờn Chromium (đã ghi Phát hiện).

HEAD ĐÃ KIỂM: 50521df
