# KH-NAP-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (16.11.2026)
- Nhánh: viec/KH-NAP-1 · cây sạch · HEAD d6f0f88 = FETCH_HEAD d6f0f88 (không kéo, đã bằng nhau)
- git log --oneline -3:
  - d6f0f88 PHIEU: KH-NAP-1
  - e7c4f0e TIEN-DO: KH-THE-3 xong (PR #42); mo KH-NAP-1 + KH-VC-2 song song (Opus, thiet ke chu quan duyet 16.11); KH-DOI-1 cho hop dong POS viet truoc; hop dong /api/kh v17 + 4 bai thu thoi ghim v16; quyet dinh 16.11 (b); thu POS 16.11; ban giao
  - c8146cd Merge pull request #42 from tuquyduong/viec/KH-THE-3

## Tiến độ
- Bước 3: kế hoạch ở `ke_hoach.md` — phiếu dặn "Chờ duyệt kế hoạch" → DỪNG chờ chủ quán gõ "duyệt".
- Agent soát kế hoạch (chỉ đọc, 16.11): CẦN SỬA 3 ý — (1) truyền prop mở Ví phải sửa dòng cũ App.jsx + chữ ký UuDai/UuDaiToi → thành Câu hỏi 4;
  (2) `tenGui` ở khối "chưa rõ" của ThanhToan sẽ hiện "undefined" cho dòng nạp → thêm vào Đường song song + ca B4; (3) thiếu ca NAP_KHONG_GOP,
  NAP_CHI_TIEN_MAT_QR, tiền về muộn (B5), dòng C7 → đã thêm. Kế hoạch đã sửa theo cả 3.

## Câu hỏi
Bốn câu ở đầu `ke_hoach.md` (mục "Câu hỏi"): (1) thêm `src/pages/KiemKhop.jsx` vào Phạm vi (thu_KHKHOP1.js dòng 55–58 đòi trang kiểm khớp gọi mọi cửa GET
`co: true`); (2) nút "Đặt lại" ở Lịch sử đơn với đơn nạp — `GET /don` không có trường nhận biết đơn nạp; (3) đổi điều kiện dòng `tuy` của ThanhToan.jsx
(giá trị đồ uống giữ nguyên); (4) thêm prop mở Ví vào các dòng cũ của App.jsx + chữ ký UuDai/UuDaiToi.
→ ĐÃ TRẢ LỜI: chủ quán duyệt cả 4 (phiếu, mục "Chủ quán duyệt kế hoạch", commit b62c23d). Không còn câu hỏi mở.

## Chủ quán duyệt kế hoạch (16.11 tối) — b62c23d
Kéo về đủ (hook mở phiên: 4b417b8 → b62c23d). Đồng ý cả 4 câu → chạy thẳng từ bước 4 (17.11).

## Phát hiện
- (Câu 2, chủ quán 16.11) `GET /don` (danh sách) không có trường nhận biết đơn nạp → nút "Đặt lại" vẫn hiện ở đơn nạp trong Lịch sử đơn; bấm → câu sẵn có
  `app.donRong` "Đơn này không có món để đặt lại" (ca thử ở thu_KHNAP1). Muốn ẩn hẳn nút cần POS thêm trường (vd `data[].chi_nap`) — chat gom sau.
- Màu (B6): mẫu `mau_de_xuat.js` dùng màu ngoài demo (`#D0688F`, `#2F6B3A`, `#E4F2E6`, `#FBE7EE`, `#D9C3CC`, `#F0C9D7`, `rgba(178,61,107,.16)`…) → máy thay bằng
  biến demo (`--pink-deep`, `--forest`, `--pink-dark`, `--mint`, `--mint-dark`, `--line`, `--cream`, `--ink`); ô số dư = chuyển sắc `--pink-deep → --forest`.
  Chi tiết từng khối ở `doi_chieu_demo.md`. Nền ô biểu tượng / nhãn thưởng dùng `color-mix(--mint, --white)` (máy cũ → `--cream` / `--mint`).
- `index.html` chưa có `<symbol id="i-wallet">` / `m-wallet` của demo (ngoài phạm vi) → biểu tượng ví vẽ thẳng qua `IcoVe` (chép nguyên symbol demo vào `BieuTuong.jsx`).

## Chỗ vá → đột biến (`viec/KH-NAP-1/dot_bien_tay.js` — việc chỉ đổi src/, không server/ client/src/ → không dot_bien.py, như KH-THE-1/2)
| Chỗ vá | Đột biến |
|---|---|
| datDon `dongGui` nhánh nạp | VS-DONG-NAP-GUI-KEM-SO-LUONG |
| datDon `dungViCho` loại nạp | BV-NAP-CHO-TRA-VI |
| gio `coDoUong` loại nạp (đặt mọi giờ) | BV-GIO-CHI-NAP-BI-CHAN-NGOAI-GIO |
| api `CUA_CONG_KHAI` thêm `/goi-nap` | BV-GOI-NAP-GUI-KEM-TOKEN |
| viTien `thuongGoi` / nhãn thưởng | VS-THUONG-GOI-TU-TINH-KHAC · VS-NHAN-THUONG-KHI-VAO-BANG-TRA |
| datDon `thamTaoMaMoi` nhánh nạp | BV-TAO-MA-MOI-NAP-VE-GIO |
| datDon `monDatLai` bỏ dòng nạp | BV-DAT-LAI-DEM-DONG-NAP |
| datDon `buocTienTrinh` chiNap | BV-DON-NAP-4-BUOC |
| TheoDoiDon `DaNap` số từ /vi | VS-DA-NAP-LAY-SO-TU-GOI |
| ViTien / UuDai nút Nạp chỉ khi có gói | BV-NUT-NAP-HIEN-KHI-KHONG-GOI |
| ThanhToan `tuy` = KHONG_MA cho nạp | BV-THANH-TOAN-NAP-GUI-MA-GIAM |
| ThanhToan `coThe` đối chiếu /goi-nap | BV-GOI-KHONG-CON-VAN-BAO-GIA |

`node viec/KH-NAP-1/dot_bien_tay.js --trinh-duyet` → 13/13 "✓ BẮT ĐƯỢC" · "TẤT CẢ ĐỘT BIẾN BỊ BẮT".

## Phần trình duyệt (Chromium thật ở máy làm việc — GitHub không có, CLAUDE.md §9)
`node cong_cu/thu_KHNAP1.js` → 125 đạt · 0 hỏng (sau rà soát vòng 1, thêm ca "/goi-nap lỗi"). `KHONG_TRINH_DUYET=1` → 41 đạt · 0 hỏng
(= `SỐ CA cong_cu/thu_KHNAP1.js: 41`). Bài cũ đổi có chủ đích (C2): thu_KHUI3d 176 · 0, thu_KHKHOP1 87 · 0, thu_KHTHE2 155 · 0 (có Chromium); đỏ trên gốc — bang_chung_do.txt.
Bài cũ đỏ vì code nhánh vi phạm luật cũ (không đổi bài, sửa CODE): thu_KHBAO1 A3 + thu_KHNHANH1 E4/F1/F2 "Thanh toán / Theo dõi đơn không đọc kho chung"
→ Thanh toán gọi GET /goi-nap mới, "Đã nạp" gọi GET /toi mới (fe99d07, 90f4ec6). K2b (bộ kiểm): tên biến `goiKho` trùng tên hàm kho nội dung → đổi `khoGoi`.

## Ngân sách
Phiếu ~280 dòng app + ~380 thử. Thực tế (git diff d6f0f88^ HEAD): src/ ngoài nội dung + css +361 −59 (16 tệp); danh mục chữ + css +128 (3 tệp); thử +480 (4 tệp).
Vượt ~1,3 lần ở phần code (dưới 1,5): khối "chưa rõ" của Thanh toán phải biết tên dòng nạp (agent soát kế hoạch bắt), Thanh toán / "Đã nạp" tự gọi
/goi-nap, /toi (luật cũ không đọc kho chung), mục `data-nd` cho mọi chữ mới (§11). Phần thử lớn hơn vì POS giả v17 tự dựng (gói, sổ ví, dòng nạp, 3 mã lỗi).

## C4 — ảnh 390 (viec/KH-NAP-1/so_anh/)
`sau/` 7 màn (uu_dai, tai_khoan, vi, bang_goi, thanh_toan_nap, theo_doi_nap, da_nap) · `de_xuat_man1..5_1.webp` (ảnh đề xuất tách từ ban_thiet_ke.html) ·
`truoc_uudai_vang.png` / `sau_uudai_vang_khong_goi.png` (Ưu đãi trước / sau, khách có hạng, quán không bật gói nạp). Màn Ví, bảng gói, Thanh toán nạp, Đã nạp
KHÔNG có ảnh "trước" (màn mới). [Vòng 2 sửa: câu cũ bỏ sót hai màn CŨ bị đổi — Tài khoản, Theo dõi đơn nạp — nay có ở `so_anh/cap/`.] So với đề xuất: bố cục, chữ, thứ tự khối khớp; khác ở màu (thay màu ngoài demo bằng biến demo) và biểu tượng (Ico plus / minus /
ví của demo thay ô chữ "+ − ±") — chi tiết từng khối: `doi_chieu_demo.md`.

## C5 — so ảnh mọi bài thử có LUU_ANH_DIR, gốc (b62c23d, bản sao trong nháp) ↔ nhánh (công cụ nháp so điểm ảnh bằng Chromium)
- Lần 1 gốc ↔ nhánh: 45 ảnh lệch / ~300 cặp. Lần 2 đo NHIỄU gốc ↔ gốc trên 11 bài có ảnh lệch: 33 ảnh lệch cùng loại (KHHD1 tờ hoá đơn, KHMUA1b QR,
  KHSINH1 / KHUI3b / KHUI3c / KHUI3d Trang chủ, KHTHE1) → nhiễu sẵn có (hoạt ảnh, thời điểm chụp), không do việc này.
- Còn lại chỉ ở nhánh: KHTHE2/KHTHE3 `uudai_*` (Ưu đãi — trong phạm vi: ô Số dư ví có viền bấm được) và hình logo / hoa văn thẻ (bản sao gốc trong nháp
  thiếu `public/` nên ảnh không tải — lỗi của công cụ so, không phải của app; đã xem tận mắt `chao_mung.png`: bố cục, chữ y hệt); KHNHANH1
  `thanhtoan-dang-cap-nhat_390` (xem tận mắt: cùng bố cục, chỉ khác lúc chụp "Đang cập nhật số dư…" / số dư đã về).
- Kết luận: màn NGOÀI phạm vi (Menu, Giỏ, Thanh toán đồ uống / thẻ, Theo dõi đơn đồ uống, Chào mừng, thẻ QR…) không đổi bố cục / chữ.
- thu_KHSOHD1 lần đo nhiễu "0 đạt · 1 hỏng" ở CẢ gốc lẫn gốc (lỗi dựng trong bản sao nháp — thiếu tệp ngoài src/), lần 1 nhánh chạy được → không so được bài này.

## Rà soát vòng 1 (agent độc lập, 17.11) — KHÔNG ĐẠT → đã sửa
LỖI: (1) dòng `SỐ CA` sai dạng (cổng đòi `SỐ CA cong_cu/<bài>.js: N`) → sửa (cổng `chay` A16 đỏ 4 lý do); (2) trang_thai thiếu kết quả test / cổng / HEAD ĐÃ KIỂM,
C5 chưa ghi, C4 thiếu ảnh "trước" → ghi ở trên + ảnh Ưu đãi trước/sau; (3) chú thích `laDonChiThe` treo sai chỗ (datDon.js) → chuyển `laDonChiNap` xuống dưới.
NGHI NGỜ đã xử lý: Thanh toán nạp khi /goi-nap lỗi không có lối ra → thêm "Về Ví" (+ ca thử, đỏ trên gốc). Nghi ngờ GIỮ (ghi Phát hiện): bỏ trùng /vi theo nội dung;
`hien.nap.dn` tắt thì không câu "đã xong" (giống `hien.the.cm` của thẻ); nút "+ Nạp tiền" nằm trong ô `role="button"` (chặn nổi bọt, chạy đúng; theo thiết kế N1/N4);
UuDai.jsx thêm import + dòng `coNap` trong thân `UuDaiToi` (cần để chạy — chủ quán cho phép chữ ký + import ở câu 4).
NGHIỆM THU người soát đếm: 12/16 có bằng chứng; thiếu C4, C5, C6, C7 → C5, C6, C7 đủ; C4 vòng 1 mới đủ MỘT PHẦN (người soát vòng 2 bắt — xem mục vòng 2).

## Phát hiện (thêm)
- `GET /vi` không có mã dòng → "Xem thêm" bỏ trùng theo nội dung [ngày, loại, số, mã đơn, ghi chú]; hai dòng sổ ví giống hệt nhau cùng giây sẽ thành một.
  Đề xuất chat chuyển POS: thêm `data[].id` cho /vi (hoặc phân trang theo con trỏ).
- Màn Thanh toán nạp: "Vào ví sau khi trả" lấy `vao` của /goi-nap, "Tổng cộng" lấy báo giá — quán đổi gói giữa hai lần gọi thì lệch một lúc (POS vẫn chặn khi đặt).

## Thử tay cho chủ quán (C7, sau khi gộp, trên điện thoại)
1. Ưu đãi → bấm ô "Số dư ví" → màn Ví: số dư + Lịch sử ví đúng. Bấm "Nạp tiền" → chọn gói nhỏ nhất → "Tiếp tục" → "Quét QR".
2. Chuyển khoản thật → màn tự sang "Đã nạp …": số dư mới, số vừa vào; về Ví thấy dòng "Nạp tiền" mới đứng đầu.
3. Nạp thêm một lần, ở màn QR bấm "Huỷ đơn" → đơn huỷ, số dư không đổi.

## Kiểm cuối (C6, 17.11) — ở HEAD 4020ef4, cây sạch
- `npm test -- --day-du` (bộ kiểm tĩnh + dựng app + mọi cong_cu/thu_*.js, CÓ Chromium): 66 đạt · 0 hỏng (thu_KHNAP1 125 · 0; K10 không tăng — tệp mới 0 chữ cứng).
- `node tu_chay/cong.js tinh . d6f0f88^ HEAD viec/KH-NAP-1`: chỉ ✗ [A19] (chưa có dòng HEAD ĐÃ KIỂM lúc chạy — bình thường).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . d6f0f88^ HEAD viec/KH-NAP-1`: ✓ CỔNG CHẠY ĐẠT
  (cảnh báo A16: thu_KHNAP1 trên gốc in 37 ca ≠ 41 — bài DỪNG SỚM trên gốc ở ca A3 vì src/viTien.js chưa có; cổng ghi "bỏ qua").
- Đột biến tay: 13/13 bắt được (`node viec/KH-NAP-1/dot_bien_tay.js --trinh-duyet`).
HEAD ĐÃ KIỂM: 4020ef4

## Rà soát vòng 2 (agent độc lập mới, 17.11) — KHÔNG ĐẠT (code không lỗi chặn gộp; lỗi giấy tờ C4) → đã sửa
Người soát tự chạy (không Chromium): thu_KHNAP1 41 · 0, thu_KHUI3d 36 · 0, thu_KHKHOP1 51 · 0, thu_KHTHE2 46 · 0, kiem_tra 63 · 0, cổng tĩnh ĐẠT, build OK.
NGHIỆM THU người soát đếm: 15/16 — thiếu C4.
LỖI và cách sửa:
1. C4 / CLAUDE.md §5: thiếu ảnh trước của Tài khoản và Theo dõi đơn nạp chờ trả (màn CŨ), thiếu 360/430, thiếu ảnh tô chỗ lệch; trang_thai ghi "nay đủ" sai →
   công cụ nháp chụp cùng POS giả, cùng đồng hồ, cây gốc (bản sao b62c23d + public/) ↔ nhánh: `so_anh/cap/<màn>_<rộng>_{truoc,sau,lech}.png`
   cho uu_dai, tai_khoan, theo_doi_nap_cho_tra × 360/390/430 (27 ảnh). Điểm ảnh lệch: Ưu đãi ~23k (ô ví viền + nút "+ Nạp tiền" đẩy khối dưới xuống);
   Tài khoản 0 (chỉ thêm khả năng bấm ô Ví); Theo dõi đơn nạp ~10k (4 bước pha chế → 2 bước, dòng chi tiết bỏ "💳 … ×1"). Đã xem tận mắt ảnh lệch 390.
   Sửa câu "nay đủ" ở mục vòng 1 và mục C4.
2. App.jsx: SỬA dòng import cũ (`dongNapTuDuongDan` vào import gio.js) — ngoài chữ "chỉ THÊM dòng" của mục Cấm; cần để chạy, ghi lại cho chat lúc gộp.
3. UuDai.jsx: import + dòng `coNap` ngoài khối wallet-row — đã ghi ở vòng 1; ghi lại cho chat lúc gộp với KH-VC-2.
NGHI NGỜ đã xử lý (có ca thử, đỏ trước vá — bang_chung_do.txt):
- Nút lồng trong `role="button"` (trợ năng) → ô ví thành 2 nút anh em: `.vt-vi-nut` (số dư + nhãn → Ví) và `.vt-nap`; khung ô vẫn bấm bằng chuột.
- "Về Ví" thêm trang → Back quay lại Thanh toán nạp lỗi → nay THAY trang (`thay`).
NGHI NGỜ giữ (Phát hiện): `hien.nap.dn` tắt thì không câu "đã xong" (cùng khuôn `hien.the.cm`); bỏ trùng /vi theo nội dung (cần `data[].id`);
mở THẲNG địa chỉ theo dõi của đơn nạp đã xong từ lâu → ô "Số dư mới" hiện số dư hiện tại (Lịch sử đơn / Ví đưa đơn xong sang Chi tiết đơn nên chỉ khi tự gõ địa chỉ);
"Tạo mã mới" của đơn nạp đặt từ MÁY KHÁC (không có `kh_don_gui`) → về Thanh toán giỏ, vì `GET /don/:ma` không trả `ma_goi` (thẻ cùng giới hạn) — đề xuất POS
trả `ma_goi` ở dòng nạp của `GET /don/:ma`.

## Kiểm lại sau vòng 2 (17.11) — ở HEAD 66a0710
- `npm test -- --day-du`: 66 đạt · 0 hỏng (thu_KHNAP1 127 · 0).
- `node viec/KH-NAP-1/dot_bien_tay.js --trinh-duyet`: 13/13 BẮT ĐƯỢC · "TẤT CẢ ĐỘT BIẾN BỊ BẮT".
- Cổng `chay`: kết quả ghi ở cuối file (chạy sau commit này, cây sạch).

## Bài học
Sự cố của việc: người gác chặn 23 lần (B-PHANTICH 5 · B-CHUONGTRINH 5 · chặn cụm bí mật 5 · B-CD-VITRI 4 · GIT-LENH 2 · SED-I 1 · GIT-ADD 1 —
`.tu_chay_nhat_ky.jsonl`); 5 bài cũ đỏ bất ngờ ở `npm test` lần 1 (KHBAO1, KHNHANH1, KHUI3d, KHKHOP1, KHTHE2) + K2b; rà soát 2 vòng KHÔNG ĐẠT
(vòng 1: SỐ CA sai dạng + giấy tờ C4–C6; vòng 2: ảnh C4 màn CŨ); vượt ngân sách ~1,3 lần (giải thích ở mục Ngân sách).
1. **NGUYÊN TẮC** (đề xuất `KHUON_LOI.md`, ngoài Phạm vi — máy không sửa): "Màn CŨ bị đổi phải có cặp ảnh trước/sau + ảnh lệch ở 360/390/430".
   Đã gây: KH-NAP-1 vòng 2 — Tài khoản, Theo dõi đơn nạp chỉ có ảnh "sau". Dấu hiệu: `so_anh/` chỉ có ảnh màn mới. Chặn: lập danh sách "màn cũ bị đổi" từ
   `git diff --name-only -- src/pages` ngay ở kế hoạch, chụp bằng MỘT công cụ cùng POS giả cho cả hai cây (cây gốc kèm `public/`).
   Lý do chưa KHOÁ: phép kiểm cần biết "màn nào cũ" — đề xuất KHOÁ sau ở cổng: việc đổi `src/pages/<X>.jsx` có sẵn trước mốc ⇒ `viec/<MÃ>/so_anh/`
   phải có tệp mang tên màn kèm `truoc` và `lech`.
2. **KHOÁ** (đề xuất, ngoài Phạm vi: `tu_chay/cong.js` đóng băng / `kiem_tra_truoc_khi_giao.js` thuộc Cấm): cổng `tinh` (không chỉ `chay`) bắt dòng
   `SỐ CA <x>: N` mà `<x>` không phải `cong_cu/thu_*.js` có thật. Ca đỏ: bang_chung_do.txt có "SỐ CA thu_KHNAP1: 41" → ✗. Đã gây: vòng 1 việc này (A16 đỏ 4 lý do).
3. **KHOÁ** (đề xuất, `kiem_tra_truoc_khi_giao.js` — Cấm): phép kiểm tĩnh "không `<button` bên trong phần tử dùng `bam(`" (lồng nút sai trợ năng).
   Ca đỏ: UuDai.jsx bản trước vòng 2. Trong Phạm vi đã KHOÁ bằng ca trình duyệt thu_KHNAP1 "B1 không nút lồng trong phần tử bấm được".
4. **NGUYÊN TẮC** (đề xuất `KHUON_LOI.md`): "Thanh toán / Theo dõi đơn KHÔNG đọc kho chung (duLieuKhach.js) — luôn gọi mới". Đã gây: KH-NAP-1 dùng
   `cuaGoiNap` / `cuaToi` ở hai màn đó, thu_KHBAO1 A3 + thu_KHNHANH1 E4/F1/F2 đỏ. Đã có bài thử khoá; bài học là ĐỌC ràng buộc cũ lúc lập kế hoạch —
   đề xuất thêm vào bước 3 của skill: "grep cong_cu/thu_*.js tìm bài nhắc tới tệp sắp sửa".
5. **BỎ** — K2b trùng tên `goiKho` (một lần, bộ kiểm đã bắt). Người gác chặn cụm bí mật / `process.env` trong tệp chưa commit (luật đã ghi trong skill; làm
   đúng: commit trước, hoặc đổi cách — `LUU_ANH_DIR=.` + thư mục làm việc riêng). Bản sao gốc thiếu `public/` (công cụ nháp, đã sửa).
6. Dọn: việc này không tạo phép kiểm nào thay được lời dặn đang có trong KHUON_LOI.md / CLAUDE.md.

## Báo cáo 7 mục
- **VIỆC:** KH-NAP-1 — khách tự nạp tiền vào ví trên App (v17): màn Ví (số dư + lịch sử), bảng chọn gói, Thanh toán nạp chỉ QR, màn "Đã nạp".
- **ĐÃ SỬA:** api.js (layGoiNap công khai, layVi) · duLieuKhach.js (cuaGoiNap) · canTuPos.js + KiemKhop.jsx (/goi-nap, /vi) · gio.js (laNap,
  dongNapTuDuongDan, coDoUong, trangThaiDong/duocThanhToan + dsGoi) · datDon.js (dongGui, dungViCho, MA_NAP/laLoiNap, laDonChiNap, buocTienTrinh chiNap,
  thamTaoMaMoi, monDatLai) · viTien.js (mới) · nd/viTien.js (mới) + nd/index.js · duongDan.js (/uudai/vi, /uudai/vi/nap) · BieuTuong.jsx (ví) ·
  vi_tien.css (mới) · ViTien.jsx (mới) · UuDai.jsx · TaiKhoan.jsx · ThanhToan.jsx (KhoiNap) · TheoDoiDon.jsx (2 bước + DaNap) · Don.jsx · App.jsx.
- **BÀI THỬ:** thu_KHNAP1 mới — 127 ca có Chromium / 41 ca KHONG_TRINH_DUYET=1, đỏ trên gốc (6·31 / 26·65). Bài cũ đổi có chủ đích: thu_KHUI3d, thu_KHKHOP1,
  thu_KHTHE2 (đỏ trên gốc, SỐ CA trong bang_chung_do.txt). 13 đột biến tay đều bắt. `npm test -- --day-du` 66 · 0.
- **ĐÃ RÀ K4:** mọi chỗ cùng khuôn dòng thẻ (laThe / cheDoThe / trangThaiDong / buocTienTrinh / thamTaoMaMoi / monDatLai / boDongDaGui / tenGui khối "chưa rõ")
  đã có nhánh nạp; BaoDonXong, HoaDonKhach, maDonDaTra không cần nhánh riêng (2 người soát xác nhận).
- **CHƯA KIỂM:** chuyển khoản QR thật và tiền về muộn trên POS thật (C7 — chủ quán thử tay, 3 thao tác ở trên); trình duyệt Zalo, chữ phóng to máy thật
  ở màn Ví / bảng gói; `ma_don` mã bill quầy mở được bằng GET /don/:ma (chỉ đọc hợp đồng); ảnh màn MỚI ở 360/430 (chỉ có 390; màn cũ đủ 3 cỡ); ẩn nút
  "Đặt lại" ở danh sách đơn nạp (cần POS thêm trường — Câu 2). Rà soát vòng 3 KHÔNG chạy (vòng 2: code không lỗi chặn gộp; lỗi giấy tờ đã sửa) — chat soát cuối.
- **GIT:** nhánh viec/KH-NAP-1, mốc d6f0f88^, mỗi tệp một commit có mã việc, đã push. Không merge, không PR.
- **BÀI HỌC:** mục "Bài học" ở trên — 2 NGUYÊN TẮC, 2 KHOÁ đề xuất (ngoài Phạm vi), 1 KHOÁ đã làm (ca trình duyệt nút lồng).

## Cổng cuối (17.11, cây sạch ở 91003d2)
`KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . d6f0f88^ HEAD viec/KH-NAP-1` → ✓ CỔNG CHẠY ĐẠT (cảnh báo A16: thu_KHNAP1 dừng sớm trên gốc ở ca A3 — cổng ghi "bỏ qua").
HEAD ĐÃ KIỂM: 91003d2
