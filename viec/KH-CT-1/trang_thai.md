# KH-CT-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (06.11)
- Nhánh `viec/KH-CT-1`; cây sạch; `git fetch origin viec/KH-CT-1` → HEAD = FETCH_HEAD = `c7553df` (không cần kéo).
- `git log --oneline -3`:
  - `c7553df PHIEU: KH-CT-1`
  - `25ab8b9 TIEN-DO: mo KH-CT-1 (chuong trinh dac biet o Uu dai, GET /chuong-trinh v9; uu dai sinh nhat hom nay)`
  - `e7c5da9 TIEN-DO: KH-SINH-1 xong (chat soat cuoi DAT, gop PR)`
- Thấy commit `PHIEU: KH-CT-1` (`c7553df`).

## Đã làm tới đâu (dừng ở `## Câu hỏi`)
- Kế hoạch `ke_hoach.md`; bài thử `cong_cu/thu_KHCT1.js` (đỏ trên gốc, xem `bang_chung_do.txt`); code: `src/chuongTrinh.js`, `src/giaoDien/chuong_trinh.css`, `src/pages/UuDai.jsx`, `src/App.jsx` (1 dòng `moHoSo`), `src/api.js` (`CUA_CONG_KHAI`).
- `thu_KHCT1.js` xanh: 85 đạt · 0 hỏng (có Chromium), 17 đạt · 0 hỏng (`KHONG_TRINH_DUYET=1`).
- CHƯA làm (chờ trả lời): `dot_bien.py`, ảnh `so_anh/`, `doi_chieu_demo.md`, `--day-du`, cổng `tinh` / `chay`, `/ra-soat`, báo cáo 7 mục.

## Câu hỏi
1. **Bài cũ `cong_cu/thu_KHUI3d.js` ĐỎ sau khi làm đúng nghiệm thu (B5: màn Ưu đãi gọi `GET /chuong-trinh`).** `npm test` → `33 đạt · 1 hỏng`; `node cong_cu/thu_KHUI3d.js` → 7 ca ✗, đều ở nhóm B4 "Ưu đãi không gọi cửa lạ":
   - dòng 90 (đọc nguồn `UuDai.jsx`): `✗ B4 không gọi thêm cửa mới: chỉ kho /toi, /diem, /voucher + layVoucher` — danh sách cho phép chỉ có `layVoucher`, `layTatCa`; nay có thêm `layChuongTrinh`;
   - dòng 225 (Chromium, ×6 = 360 / 390 / 430 × 100% / 130%): `✗ B4 [..] gọi /toi, /diem, /voucher (+ /don …) mỗi cửa một lần, không cửa nào lạ` — danh sách đường dẫn cho phép thiếu `'/chuong-trinh'` (thực tế gọi: `/toi,/diem,/voucher,/don,/chuong-trinh,/menu,/gio-hoat-dong,/hang,/gio-vang,/gia-han`).
   Phiếu CẤM sửa "bất kỳ bài thử cũ nào" và `thu_KHUI3d.js` không ở `## Phạm vi` → máy dừng, không tự sửa.
   **Đề nghị chủ quán:** thêm vào phiếu mục `## Bài thử cũ sửa` + `cong_cu/thu_KHUI3d.js` vào `## Phạm vi`, cho phép đúng hai sửa: (a) dòng 90 thêm `'layChuongTrinh'` vào danh sách tên `lay*` được phép; (b) dòng 225 thêm `'/chuong-trinh'` vào danh sách đường dẫn được phép. Bài này đỏ sau vá (không phải xanh trên gốc) nên không dính A11; sau khi sửa phải có dòng `SỐ CA thu_KHUI3d.js` mới trong `bang_chung_do.txt`.
   Khi chủ quán duyệt: máy làm tiếp từ `dot_bien.py` trở đi.

## Phát hiện
- Sinh 29/02 mà năm nay không nhuận → App tính 28/02 (theo phiếu A1). Chủ quán hỏi POS xem "quán đối chiếu căn cước" có cùng luật 28/02 không.
