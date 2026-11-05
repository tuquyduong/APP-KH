# KH-SINH-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (05.11)
- Nhánh: `viec/KH-SINH-1`; cây sạch (không file theo dõi đang sửa); `git fetch origin viec/KH-SINH-1` → HEAD = FETCH_HEAD = `5f7dd67` (không cần kéo).
- `git log --oneline -3`:
  - `5f7dd67 PHIEU: KH-SINH-1`
  - `f20f0d7 TIEN-DO: mo dot 1 song song (KH-HD-1 chi tiet don theo hoa_don POS; KH-SINH-1 ngay sinh + loi chao du ten + xoa mon); thu App/POS 05.11 - so v26`
  - `a0b68d0 TIEN-DO: mo KH-MUA-1c (KHO_BAN = chua ro, gui lai cung khoa; hop dong v9; Theo doi don doc giu vi tu POS) - so v25`
- Thấy commit `PHIEU: KH-SINH-1` (`5f7dd67`).

## Câu hỏi
1. **Bài `cong_cu/thu_KHNHANH1.js` ngoài Phạm vi nhưng đỏ vì lời chào đủ tên (phiếu B4 chỉ kể 4 bài; còn sót bài thứ 5).**
   Dòng 492: `k('D3 Trang chủ chào theo xưng hô vừa lưu', /cô Linh/.test(await chu(t, '#home h1')), …)` — POS giả có tên "Nguyễn Linh", lời chào mới là "Chào buổi tối, cô Nguyễn Linh!"
   → `npm test` hiện `✗ thu_KHNHANH1.js (221 đạt · 3 hỏng)`, 3 hỏng = cùng ca D3 ở 3 cỡ màn. Đề nghị: thêm `cong_cu/thu_KHNHANH1.js` vào Phạm vi và đổi regex thành `/cô Nguyễn Linh/` (1 dòng; sửa bài thường như B4 — đỏ trên gốc? KHÔNG: ca này
   XANH trên code gốc, đỏ sau vá, nên đây là bài sửa theo hành vi mới chứ không thêm ca hồi quy; vẫn cần chủ quán duyệt vì bài ngoài Phạm vi). Máy KHÔNG tự sửa. Chưa sửa thì `npm test` đỏ đúng 1 bài này, các bài khác xanh.
   Hệ quả: chưa chạy được bước 6 trọn vẹn (`npm test` xanh), cổng `chay`, `/ra-soat` — dừng chờ chủ quán.

## Bảng "chỗ vá → đột biến" (`dot_bien.py`; kết quả: TẤT CẢ BỊ BẮT — số ở `bang_chung_do.txt`)
| Chỗ vá | Đột biến |
|---|---|
| `dinhDang.js` `chiaLoiChao` tên đủ | VS-TEN-CHI-TU-CUOI · VS-TEN-KHONG-GOP-KHOANG-TRANG |
| `dinhDang.js` `tachNgaySinh` | VS-NGAY-30-02-HOP-LE · VS-NAM-NHUAN-SAI |
| `HoSo.jsx` `NgaySinh` | VS-NGAY-SINH-GOP-KHOA-KHAC · BV-HOI-LAI-TRUOC-KHI-LUU · BV-CHAN-NGAY-TUONG-LAI · VS-DA-CO-HIEN-LOI-THAY-VI-DOC-LAI · BV-CHE-O-SUA-KHI-DA-CO |
| `gio.js` `chenDong` | VS-CHEN-LAI-SAI-CHO · VS-CHEN-LAI-NHAN-DOI-DONG |
| `GioHang.jsx` nút xoá + Hoàn tác | BV-NUT-XOA-MON · VS-HOAN-TAC-KHONG-TRA-DONG · VS-THONG-BAO-KHONG-TU-TAT |

## Kiểm (bước 6, 05.11)
- `npm test`: 28 đạt · 2 hỏng khi chạy lần đầu — `thu_KHUI3b.js` (ca B1 "xem trước dùng tên mới", trong Phạm vi → đã sửa, nay 174 đạt · 0 hỏng) và `thu_KHNHANH1.js` (NGOÀI Phạm vi → `## Câu hỏi` 1).
- `node kiem_tra_truoc_khi_giao.js --day-du`: 31 đạt · 1 hỏng (chỉ `thu_KHNHANH1.js`, Câu hỏi 1); `vite build` thành công, `dist/index.html` đúng.
- Cổng `node tu_chay/cong.js tinh . 5f7dd67^ HEAD viec/KH-SINH-1`: chỉ còn `✗ [A19]` (dòng "HEAD ĐÃ KIỂM" ghi sau lần kiểm cuối) — Phạm vi, A7, A17 đạt.
- CHƯA làm (chờ trả lời Câu hỏi 1): cổng `chay` (`KHONG_TRINH_DUYET=1`), dòng `HEAD ĐÃ KIỂM`, `/ra-soat`, bước 10–11 (báo cáo 7 mục, Bài học).
- Chromium thật: `thu_KHSINH1.js` 92 đạt · 0 hỏng; ảnh 360 / 390 / 430 ở `so_anh/`, `doi_chieu_demo.md`.

## Phát hiện
- Người gác chặn `sed -i`, `for` / `;` / `&&` ghép lệnh chạy script, `git -C`, `sleep` — đã đổi sang Edit và lệnh đơn (không phải lỗi, chỉ ghi nhận).
- `npm test` chạy hơn 10 phút trên máy này (nhiều bài Chromium cũ chạy tuần tự) — vượt mốc 120 s của công cụ, phải chạy nền.
