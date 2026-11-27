# KH-HUY-1 — trạng thái

## Đồng bộ bản chụp (bước 1)
- Nhánh `viec/KH-HUY-1`; cây sạch; `git rev-parse --short HEAD FETCH_HEAD` = `53842bd` · `53842bd` (đã đủ commit của origin, không kéo).
- `git log --oneline -3`:
  - `53842bd PHIEU: KH-HUY-1`
  - `6111b5d TIEN-DO: mo KH-HUY-1 (don bi quan huy: ly do + da hoan vao vi, hop dong v14)`
  - `80efd3c TIEN-DO: KH-NHANH-2 xong (PR #45); KH-SUA-2 them (12)-(16); quyet dinh 19.11 + 26.11; thu App 19.11 + thu POS 19.11; ban giao`

## Câu hỏi
(không)

## Phát hiện
- Người gác chặn `sed -i`, `git worktree`, `Monitor`/`until`, và lệnh ghép `python … && node …` (mỗi lệnh chạy file script phải đứng một mình) — đã đổi cách làm (Edit/Write, `git archive` ra thư mục nháp, tách lệnh).
- `cong_cu/thu_KHMUA1b.js` KHÔNG sửa: hai trường v14 đi qua `v7` của đơn giả (thân trả lời trải nguyên) → không cần `## Bài thử cũ sửa`.

## Bảng "chỗ vá → đột biến" (`dot_bien_tay.js`, việc chỉ đổi `src/` nên không có `dot_bien.py` — như KH-NAP-1)
| Chỗ vá | Đột biến |
|---|---|
| `soHoan` chỉ nhận số nguyên ≥ 0 | VS-HOAN-NHAN-AM · VS-HOAN-NHAN-CHUOI |
| `DonHuy` chỉ hiện hộp hoàn khi > 0 | VS-HIEN-HOP-HOAN-KHI-0 |
| lý do = nhãn POS nguyên văn, hoàn = số POS | VS-APP-TU-GHEP-LY-DO · VS-APP-TU-TINH-HOAN |
| `docDon` chỉ đọc khi `da_huy` | BV-DOC-LY-DO-KHI-CHUA-HUY · BV-DOC-HOAN-KHI-CHUA-HUY |
| `moVi` truyền tới 2 màn | BV-CHI-TIET-BO-MOVI · BV-THEO-DOI-BO-MOVI · VS-DON-HUY-XEM-VI-KHONG-MO-VI |
| làm mới `cuaToi` | BV-KHONG-LAM-MOI-SO-DU-O-CHI-TIET · BV-KHONG-LAM-MOI-SO-DU-O-THEO-DOI |
| dòng "Đã hoàn" ở Lịch sử | VS-LICH-SU-HIEN-HOAN-0 · BV-LICH-SU-HIEN-DONG-HOAN-CHO-DON-CHUA-HUY · BV-LICH-SU-DONG-HOAN-CHUA-DANH-DAU-KHOA |
| Chi tiết chỉ dựng hộp khi `da_huy` | BV-CHI-TIET-HIEN-HOP-KHI-CHUA-HUY (bắt bởi ca (4b) thêm sau lần chạy đầu) |
Chạy: `node viec/KH-HUY-1/dot_bien_tay.js [--trinh-duyet]` — 12 đột biến nhóm hàm thuần đều bị bắt; 4 nhóm trình duyệt (lần chạy đầu sót 1 → thêm ca (4b), đã bắt).

## Kiểm (bước 6, 11.4)
- `npm test`: 66 đạt · 0 hỏng · `node kiem_tra_truoc_khi_giao.js --day-du`: 69 đạt · 0 hỏng · đột biến tay `--trinh-duyet`: TẤT CẢ BỊ BẮT (16/16).
- `node tu_chay/cong.js tinh . 53842bd^ HEAD viec/KH-HUY-1`: chỉ còn A19 (chờ dòng HEAD ĐÃ KIỂM, nay đã ghi).
- ✓ CỔNG CHẠY ĐẠT (`KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 53842bd^ HEAD viec/KH-HUY-1`); cảnh báo A16: trên gốc bài dừng sớm (20 ca) ≠ 29 ca — bình thường, vì thiếu hàm thì các ca sau không chạy.
- Bài thử cũ đổi: thu_KHMUA1b (SỐ CA 52), thu_KHND3e (SỐ CA 23) — chi tiết ở `bang_chung_do.txt`.

## Nghiệm thu (mỗi mục một dòng bằng chứng)
- A1 docDon + soHoan: bảng 35000/0/null/thiếu/"35000"/-5/1.5 ở `thu_KHHUY1.js` Phần 1. A2 chỉ đọc khi `da_huy`, hiện nguyên chữ POS, không tự tính (ca A2 + VS-APP-TU-*). A3 `canTuPos` don_huy_v14 / don_ds_huy_v14 (ca A3; MUA1b).
- B1 DonHuy: ca render tĩnh (2 hộp / chỉ lý do / chỉ hoàn / rỗng / không moVi). B2 Theo dõi: ca (1) 3 cỡ. B3 Chi tiết: ca (2) 3 cỡ. B4 Lịch sử: ca (6) 3 cỡ.
- B5 chữ/khoá: kiemDanhMuc sạch, đổi `td.huy.hoan` qua `datBanNoiDung`, công tắc `hien.don.huy`; khoá thêm: `td.huy.lyDo`, `td.huy.hoan`, `td.huy.xemVi`, `td.huy.nhan` (khoá pos), `hien.don.huy`, `dh.huy.hoan`.
- B6 làm mới số dư: ca (1) đúng 1 lượt GET /toi, ca (2) 1 lượt, ca (3) hoàn 0 không thêm lượt, ca số dư ví 45.000đ.
- C1 `thu_KHHUY1.js` (ca (1)–(6), (4b)); C2 bài cũ sửa đúng ca; C3 đột biến 16 (bảng trên); C4 ảnh `so_anh/truoc|sau` (360·390·430) — màn ngoài phạm vi không đổi (không sửa CSS / màn khác); C5 như mục Kiểm.
- C6 chủ quán thử tay sau khi gộp — CHƯA làm (cần POS bán hàng được).

## Báo cáo 7 mục
1. VIỆC: KH-HUY-1 — đơn quán huỷ hiện lý do + "Đã hoàn … vào ví của bạn" (hợp đồng v14).
2. ĐÃ SỬA: `hoaDon.js` (soHoan, lyDoHuy), `datDon.js` (docDon), `components/DonHuy.jsx` (mới), `pages/TheoDoiDon.jsx`, `pages/Don.jsx` (Chi tiết + Lịch sử + làm mới /toi), `App.jsx` (moVi), `noiDung/nd/donHang.js`, `kiemKhop/canTuPos.js`; ~70 dòng app.
3. BÀI THỬ: mới `thu_KHHUY1.js` (99 ca có Chromium, 29 ca không); sửa `thu_KHMUA1b.js`, `thu_KHND3e.js`; đột biến 16/16 bị bắt.
4. ĐÃ RÀ K4: `grep` các chỗ đọc `tien_trinh === 'da_huy'` / `ChiTietDon` / thẻ Lịch sử — cả 3 chỗ khách gặp đơn đã xử lý; không có chỗ thứ tư dùng `da_huy` để hiện chữ.
5. CHƯA KIỂM: POS thật (chưa thử với POS bán hàng); nhãn lý do ngoài 5 nhãn hợp đồng (hiện nguyên chữ); ảnh chưa so với Chat App KH.
6. GIT: nhánh `viec/KH-HUY-1`, chưa merge / PR.
7. BÀI HỌC: xem mục dưới.

## Bài học
- NGUYÊN TẮC (đề xuất, ngoài Phạm vi): thêm khoá danh mục / tệp nhóm A1 mới làm đỏ `thu_KHND3e` và `thu_KHMUA1b` (danh sách việc POS được `moi`) — nên cho hai bài đọc danh sách từ MỘT chỗ thay vì sửa tay mỗi việc. KHOÁ: phép kiểm "mọi tệp có `nd(` đều thuộc A1" thay danh sách tay.
- BỎ: người gác chặn `sed -i`, `git worktree`, lệnh ghép script — chỉ tốn lượt, đã có cách thay (Edit, `git archive`).
- BỎ: kho clone nông làm 2 ca B1 của ND3e đỏ giả — `git fetch --unshallow` rồi hết.
- KHOÁ (đã làm): ca (4b) thêm sau khi đột biến BV-CHI-TIET-HIEN-HOP-KHI-CHUA-HUY sót.

## Báo cáo /ra-soat (agent độc lập, vòng 1) — nguyên văn rút gọn
ĐẠT (có 3 nghi ngờ nhỏ, không chặn gộp). Chạy lại thu_KHHUY1.js: có Chromium 99 đạt · 0 hỏng; KHONG_TRINH_DUYET=1 29 đạt · 0 hỏng.
LỖI TÌM ĐƯỢC: không có lỗi chặn. Nit: `src/datDon.js:96` hai biểu thức ba ngôi cùng điều kiện `tien_trinh === 'da_huy'` (gọn hơn: tính một lần); `DonHuy.jsx:16` dùng `Ico check s={18}` còn `NhanMa.jsx:53` dùng s={16} cho cùng lớp `nt-state on`.
NGHI NGỜ: (1) `Don.jsx:31` `useEffect([hoan])` bỏ lượt làm mới `cuaToi` nếu ChiTietDon không unmount khi `ma` đổi mà hai đơn cùng số hoàn (hiếm; Back về danh sách làm unmount). (2) hoàn > 0 vẫn làm mới `cuaToi` khi `hien.don.huy` tắt — hợp lý, phiếu B6 không nói. (3) dòng HEAD ĐÃ KIỂM = 6033c15 trong khi HEAD sau đó chỉ đổi `trang_thai.md` (đã đối chiếu `git diff`, không ảnh hưởng A19).
NGHIỆM THU: 18/21 mục có bằng chứng code + bài thử; thiếu bằng chứng do người soát chưa chạy lại (không phải thiếu ở phía làm): C3 (đột biến, máy chính đã chạy 16/16), C4 (ảnh, người soát chưa xem), C5 (npm test / --day-du / cổng chay, máy chính đã chạy); C6 chưa làm đúng như phiếu (chờ POS bán hàng).
CHƯA SOÁT ĐƯỢC: chưa chạy lại npm test / --day-du / cổng chay / dot_bien_tay; chưa xem ảnh; chưa thử POS thật; chưa đọc hết thân thu_KHHUY1.js dòng 60–246.
BÀI HỌC: đồng ý đề xuất ND3e / MUA1b đọc danh sách A1 / việc POS `moi` từ một chỗ; thêm ca đổi `ma` cùng số hoàn nếu muốn chặt hơn.
Xử lý của máy chính: nit và nghi ngờ (1) KHÔNG sửa (ngoài nghiệm thu, tránh vòng sửa mới); ghi vào đây để chat soát cuối quyết.

HEAD ĐÃ KIỂM: 6033c15
