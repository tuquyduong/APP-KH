# KH-DOI-1 — Đổi điểm lấy quà trên App (kho quà, đổi có PIN, phiếu quà QR, Quà của tôi) — theo hợp đồng POS ĐÃ HẸN DOI-DIEM-1

<!-- Chat App KH soạn 26.11.2026. **Opus**, KHÔNG chờ duyệt kế hoạch (thiết kế chủ quán đã duyệt). Mở SAU khi KH-HUY-1 gộp.
     THIẾT KẾ ĐÃ DUYỆT (chủ quán 26.11 "đồng ý với các đề xuất": câu 1a 2a 3a 4a): Artifact https://claude.ai/artifact/6Wpx3HESda2GE9uHEm43wf — bản gọn ở
     `viec/KH-DOI-1/ban_thiet_ke.html` (+ `anh/`). Mẫu đề xuất (lớp `dq-`, CSS, HTML từng màn) `viec/KH-DOI-1/mau_de_xuat.js` — chép Ý + CSS, KHÔNG chép nguyên (mẫu là HTML tĩnh).
     HỢP ĐỒNG: `thiet_ke/trao_doi/TRA_LOI_POS_16112026_DOIDIEM.md` mục 1 (3 cửa đã hẹn, CÓ `pin` — chủ quán chốt 17.11; POS ghi vào "Đã hẹn" ở việc KH-API-4, v18 khi
     DOI-DIEM-1 gộp — sau khai trương). Cửa CHƯA chạy trên POS thật → App làm theo hợp đồng + POS giả, để TẮT mặc định (câu 1a).
     Đọc CLAUDE.md §4, §5, §6, §8, §11; phiếu + `trang_thai.md` KH-NAP-1 (Ví, PinSheet `gui`, khoá gửi), KH-VC-2 (Ví voucher, `nguon: doi_diem`), KH-NHANH-1 (kho dữ liệu khách). -->

## Mục tiêu
Khách đổi điểm lấy quà ngay trên App: bấm "Đổi quà" ở ô Điểm (Ưu đãi) → Kho quà → chọn quà → nhập PIN 4 số → voucher vào Ví voucher, hoặc quà hiện vật thành phiếu
có mã QR để nhận ở quầy. "Quà của tôi" giữ các phiếu (chờ nhận / đã nhận / hết hạn + đã hoàn điểm). Tất cả TẮT mặc định cho tới khi POS gộp DOI-DIEM-1; chủ quán bật ở /admin.

## Quyết định chủ quán (26.11, trên trang thiết kế)
- Câu 1 **a**: làm ngay, để tắt (công tắc /admin `hien.dq`, mặc định TẮT). Tắt → App KHÔNG gọi `/kho-qua`, `/qua-cua-toi`; ô Điểm như hôm nay.
- Câu 2 **a**: quà HIỆN VẬT cũng đổi trên App (có PIN) → phiếu QR, đưa mã ở quầy nhận. (Thay quyết định 11.11 "Đổi tại quầy".)
- Câu 3 **a**: thứ tự quà = thứ tự POS trả (`thu_tu`), App KHÔNG xếp lại.
- Câu 4 **a**: nhắc phiếu sắp hết hạn = dải nhắc đầu Kho quà + chữ hồng trong "Quà của tôi". KHÔNG chấm đỏ tab, KHÔNG dải Trang chủ.

## Nghiệm thu

### A. Gọi POS (`src/api.js` — qua `goi`, KHÔNG thêm lối fetch; K1 / K1b / K2 xanh, không nới bộ kiểm)
- A1 `layKhoQua()` `GET /kho-qua` — gửi token nếu có (hợp đồng: không bắt token; có token thì thêm `con_luot_thang`, `du_diem`) → KHÔNG cho vào `CUA_CONG_KHAI` (cửa đó bỏ
  token); lỗi 401 ở cửa này không được đẩy khách ra màn đăng nhập (máy chọn cách, ghi lý do). `layQuaCuaToi()` `GET /qua-cua-toi` (token). `doiDiem(than)` `POST /doi-diem`
  `{ ma_qua, khoa_gui, pin }` — `khoa_gui` = `taoKhoaGui()` MỘT lần mỗi lần bấm đổi, gửi lại (mạng chập) dùng ĐÚNG thân cũ (khuôn `guiDonAnToan`); PIN chỉ trong bộ nhớ lần gọi.
- A2 Đọc dữ liệu: hàm thuần `docKhoQua`, `docQuaCuaToi`, `docKetQuaDoi` (tệp mới `src/doiQua.js`) — kiểu sai / thiếu trường → bỏ dòng hoặc giá trị an toàn (vd `con` không phải
  `true` → coi như hết; `du_diem` thiếu → so `diem_can` với điểm của `GET /diem`; `con_luot_thang` 0 → hết lượt). App KHÔNG tự tính hạn / nhắc: `nhac` POS trả.
- A3 Kho dữ liệu khách (`duLieuKhach.js`): thêm `cuaQuaToi` (chỉ khi công tắc bật). Đổi xong → `lamMoi([cuaDiem, cuaVoucher, cuaQuaToi])`.
- A4 `src/kiemKhop/canTuPos.js`: 3 mục cần POS (`viec_pos: 'DOI-DIEM-1'`, cờ "đã hẹn" như các mục chưa chạy) — trang /kiemkhop báo đúng "POS chưa có" hôm nay.

### B. Màn (theo ảnh đã duyệt; lớp CSS mới tiền tố `dq-`, tệp `src/giaoDien/doi_qua.css`, màu CHỈ biến bảng demo — K9)
- B1 Ưu đãi: ô Điểm thêm nút nhỏ "Đổi quà ›" (khuôn `vt-nap`), bấm cả ô cũng mở Kho quà. Công tắc tắt → không có nút, ô không bấm được.
- B2 Màn **Kho quà** `/uudai/doi-qua` (duongDan, `canDN`): khối điểm (`dq-hero`), ô "Quà của tôi" + số phiếu `chua_dung`, dải nhắc khi có phiếu `nhac` (tên quà + hạn — chữ
  danh mục), danh sách thẻ quà đúng thứ tự POS: ảnh `anh` POS (không có → huy hiệu theo `loai`: voucher `m-ticket`, hiện vật `m-gift`), tên, `mo_ta` NGUYÊN chữ POS,
  số điểm, chip "Quà tại quầy" cho `hien_vat`; nút: "Đổi ngay" · "Cần thêm N điểm" (N = `diem_can` − điểm hiện có) · "Tạm hết" (`con` false, thẻ mờ) · "Hết lượt tháng này"
  (thẻ mờ). Ký hiệu `m-gift` / `m-coffee` / `m-bag` chép NGUYÊN `<symbol>` của demo vào index.html (như KH-NAP-1 làm với `wallet`). Kho rỗng → câu danh mục.
- B3 Bấm "Đổi ngay" → `PinSheet` chế độ `gui` + khối tóm tắt trên bàn phím (tên quà, "Trừ N điểm", "Còn lại M điểm" — M = điểm hiện có − `diem_can`, chỉ HIỂN THỊ; số
  thật lấy `diem_con` POS trả). Lỗi POS (`THIEU_DIEM`, `QUA_HET`, `QUA_HET_LUOT_THANG`, `PIN_SAI`, `PIN_DANG_KHOA`, `CHUA_CO_PIN`, `QUA_KHONG_CO` …) → hiện NGUYÊN `error`;
  `CHUA_CO_PIN` → mời đặt PIN (khuôn trả bằng ví). Đang gửi → nút có vòng (khuôn KH-NHANH-2), không bấm được lần hai.
- B4 Đổi **voucher** xong → màn "Đã đổi quà!" (khuôn "Đã nạp": số điểm còn lại = `diem_con`, huy hiệu, câu "đã vào Ví voucher", mã `voucher_code`); nút "Đặt món dùng ngay"
  (mở Menu — voucher tự chọn sẵn ở Giỏ nhờ KH-VC-2) + "Về kho quà".
- B5 Đổi **hiện vật** xong → mở thẳng **Phiếu quà** `/uudai/qua/<ma>`: khuôn màn "Mã thành viên" (`ManQR`: `VeQR` + viền quét + sáng màn), tên quà, "Đổi N điểm · hạn nhận
  <ngày>", "Mã phiếu: <ma>", câu "Đưa mã này cho nhân viên ở quầy…". Mã `qr` POS trả — App chỉ vẽ.
- B6 Màn **Quà của tôi** `/uudai/qua`: nhóm "Chờ nhận" (`chua_dung`; `nhac` → dòng hạn chữ hồng; bấm → Phiếu quà) và "Đã xong" (`da_dung` "Đã nhận <ngày>"; `het_han` "Hết hạn
  · đã hoàn N điểm" khi có `hoan_diem`), thẻ mờ. Rỗng → câu danh mục.
- B7 Lịch sử điểm: KHÔNG đổi (dòng `redeem` / `hoan_qua` đã hiện `reason` POS) — thêm ca thử khoá.
- B8 Mọi chữ mới vào danh mục `src/noiDung/nd/doiQua.js` (sửa được ở /admin, CLAUDE.md §11) + công tắc `hien.dq` (loại `battat`, `macDinh: false`). Chữ POS (tên, mo_ta,
  lỗi) = mục `khoa` "POS › Cài đặt › Kho quà".

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHDOI1.js` (chạy cả `KHONG_TRINH_DUYET=1`; POS giả đúng hợp đồng đã hẹn — khuôn `thu_KHNAP1.js`):
  - hàm thuần: 3 hàm đọc với dữ liệu đủ / thiếu / sai kiểu; nút theo từng tình huống; "Còn lại" không âm khi thiếu điểm (không cho đổi).
  - Chromium 360 · 390 · 430: công tắc TẮT (mặc định) → không có nút Đổi quà, POS giả KHÔNG nhận `/kho-qua` / `/qua-cua-toi`; BẬT → Kho quà đủ 5 kiểu thẻ (ảnh đã duyệt);
    đổi voucher: PIN → đúng MỘT `POST /doi-diem` có `khoa_gui`, `pin`; mạng lỗi lần đầu rồi gửi lại → CÙNG `khoa_gui` + thân; màn "Đã đổi quà!" đúng `diem_con`; Ví voucher
    thấy voucher mới; đổi hiện vật → Phiếu quà có QR; Quà của tôi đúng 3 trạng thái + nhắc; PIN sai → lời POS, nhập lại; `THIEU_DIEM` → lời POS; không tràn ngang; chữ sửa ở
    /admin hiện đúng. Đỏ trên gốc.
- C2 Bài CŨ đổi có chủ đích → sửa đúng ca; KHÔNG dùng `## Bài thử cũ sửa`.
- C3 Đột biến tay (`viec/KH-DOI-1/dot_bien_tay.js`) ≥ 8, mỗi cái ĐỎ: công tắc mặc định bật · gọi `/kho-qua` khi tắt · `khoa_gui` mới khi gửi lại · gửi 2 lần khi bấm đúp ·
  App tự xếp lại quà · tự tính `diem_con` thay số POS · lưu PIN · cho đổi khi thiếu điểm / hết hàng · bỏ `pin` khỏi thân.
- C4 Ảnh 390 (đủ các màn ảnh đã duyệt) → `viec/KH-DOI-1/so_anh/` cạnh ảnh thiết kế; soát cuối so ảnh `LUU_ANH_DIR` gốc ↔ nhánh: công tắc tắt → màn ngoài phạm vi
  KHÔNG đổi (kể cả Ưu đãi).
- C5 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K9 / K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- C6 Chủ quán thử tay SAU khi POS gộp DOI-DIEM-1 (sau khai trương): bật `hien.dq` ở /admin → đổi 1 voucher + 1 quà hiện vật bằng SĐT thử → quầy quét phiếu "Đã trao".

## Phạm vi
- viec/KH-DOI-1/**
- index.html
- src/api.js
- src/doiQua.js
- src/datDon.js
- src/duLieuKhach.js
- src/duongDan.js
- src/App.jsx
- src/pages/UuDai.jsx
- src/pages/DoiQua.jsx
- src/pages/QuaCuaToi.jsx
- src/pages/PhieuQua.jsx
- src/pages/ManQR.jsx
- src/components/*.jsx
- src/giaoDien/doi_qua.css
- src/noiDung/nd/doiQua.js
- src/noiDung/nd/*.js
- src/noiDung/nd.js
- src/kiemKhop/canTuPos.js
- cong_cu/thu_KHDOI1.js
- cong_cu/thu_*.js
- cong_cu/no_chu_cung.txt

## Ngân sách
~380 dòng app (api + đọc ~60, 3 màn ~200, Ưu đãi ~15, css ~60, danh mục ~45) + ~450 dòng thử. **Phương án đơn giản nhất đã xét:** dùng lại PinSheet, khoá gửi, khuôn
"Đã nạp", khuôn Mã thành viên; App chỉ hiện chữ / số POS; một công tắc tắt toàn bộ. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG tự tính điểm còn lại / hạn / nhắc làm số thật; KHÔNG lưu PIN; KHÔNG đổi luồng trả tiền, PIN đơn hàng, Ví, voucher Giỏ (KH-VC-2) ngoài việc làm mới kho dữ liệu.
- KHÔNG thêm lối mạng, không đổi `CHO_API` / `SO_LOI_MANG_API` / `CHO_GIAU`, không sửa `kiem_tra_truoc_khi_giao.js`. Không thêm màu ngoài bảng demo (K9).
- KHÔNG sửa `src/components/TheQR.jsx`, `src/giaoDien/the_qr.css`, `src/qrThuongHieu.js`, `src/quangCao.js`, `src/giaoDien/demo*.css`, `thiet_ke/**`, `tu_chay/`, `.claude/`,
  `.github/`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `public/sw.js`. KH-SUA-2 KHÔNG làm ở đây.
- Chỉ push `git push -u origin viec/KH-DOI-1`. Không đụng `main`, không merge, không tạo PR.
