# KH-SOHD-1 — Số đơn = số hoá đơn POS (`so_hd`), thông báo tiền về muộn, THẺ MÃ QR thương hiệu (hợp đồng v11)

<!-- Chat App KH soạn 06.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 07.11 (khai trương). Mở SAU KHI KH-BAO-1 + KH-CT-1 đã gộp.
     CHẠY SONG SONG với KH-HANG-2 — xem "Cấm".
     Quyết định: 05.11 chủ quán "số đơn hiện nay quá phức tạp — lấy số hoá đơn theo format POS, App không tự tạo"; 06.11 chủ quán duyệt mẫu thẻ QR thương hiệu (POS
     GIAO-DIEN-1 mục F) và đề nghị App dùng CÙNG mẫu (thư chat POS 06.11, chép dưới).
     Hợp đồng: POS main lên v11 (HANG-1 = v10, CK-NOIDUNG-1 = v11). Bản chép từng byte đã nằm trong commit phiếu: `viec/KH-SOHD-1/hop_dong_v11.md`. Việc này chép nó
     vào `thiet_ke/HOP_DONG_API_KH.md` (bài thử A1 của `thu_KHMUA1b.js` / `thu_KHUI3b.js` đòi bản trong kho = bản `hop_dong_v<N>.md` mới nhất, từng byte).
     Trích "Ghi chú v11" (đọc đủ ở file hợp đồng):
       - `so_hd` (`GET /don`, `GET /don/:ma`, `POST /don`): số hoá đơn POS — `APP0016` (đơn App), `HD0016` (đơn quầy), đơn cũ `012`; `null` khi đơn App chưa có số.
         "App hiện `so_hd` cho khách thay mã App. `ma` / `ma_don` (mã App `A…`) GIỮ NGUYÊN — vẫn là mã để gọi `GET /don/:ma`, `POST /don/:ma/huy`."
       - Nội dung chuyển khoản nằm trong `qr.chuoi`: `TQD<THÁNG 3 chữ tiếng Anh><NGÀY 2 số> APP<4 số>`.
       - `tien_ve_da_cong_vi` (số đồng, 0 khi không có) + `thong_bao_tien_ve` (chuỗi | null): "câu App HIỆN NGUYÊN cho khách khi `tien_ve_da_cong_vi` > 0 … App không tự ghép câu".
       - `hoa_don[]` thêm `loai: 'ma_gd'` (trai = "Mã GD", phai = mã giao dịch ngân hàng).
     Thư chat POS 06.11 — THẺ MÃ QR THƯƠNG HIỆU (mẫu đã duyệt: `viec/KH-SOHD-1/mau_the_QR_TQD.png`; logo nền trong suốt 192 px: `viec/KH-SOHD-1/logo_tqd_192.png`):
       "Thẻ: nền kem #FBF3E6, viền vàng kim #B08028, bo góc lớn; đầu thẻ logo + 'Tứ Quý Đường' (đỏ đô #7A1E18) + 'Quét mã để thanh toán'; ô trắng chứa số tiền chữ to,
        mã QR, dưới mã 'APP0016 · <nội dung chuyển khoản>'. KHÔNG có dòng chữ ở cuối thẻ. Giữ đồng hồ đếm ngược / trạng thái đang có.
        Mã: mức sửa lỗi H; chấm TRÒN; 3 ô góc bo tròn và TÔ ĐẶC (không vẽ vòng rỗng — vòng rỗng làm máy quét không đọc được); màu theo 4 phần tư như 4 mảnh logo:
        trên trái #253A6E, trên phải #966923, dưới trái #347042, dưới phải #B2342C; viền trắng quanh mã ≥ 3 ô; logo tròn trên nền tròn trắng ở giữa, đường kính
        ≤ 20% bề ngang mã; nền mã luôn TRẮNG (kể cả giao diện tối). Chủ quán quét thử thật bằng MB, Vietcombank, Techcombank, MoMo trước khi nhận."
     Màu thẻ QR = ngoại lệ ngoài demo do chủ quán duyệt 06.11 (K9) — xem B5. -->

## Mục tiêu
Khách thấy và đọc cho nhân viên ĐÚNG số hoá đơn in trên bill (`APP0016`); mã QR trả tiền là thẻ thương hiệu Tứ Quý Đường mà mọi app ngân hàng quét được; tiền về muộn được
App báo đúng câu POS gửi.

## Nghiệm thu

### A. Hợp đồng v11
- A1 Chép `viec/KH-SOHD-1/hop_dong_v11.md` → `thiet_ke/HOP_DONG_API_KH.md` (từng byte). `src/kiemKhop/canTuPos.js` khai các trường mới v10 / v11 (`so_hd`, `tien_ve_da_cong_vi`,
  `thong_bao_tien_ve`, `/hang` `chi_cap` `goi[]` `thu_bac`) đúng như bài thử / màn `/kiemkhop` đang đòi (máy grep lại luật của `thu_KHMUA1b.js` A2, `thu_KHKHOP1.js`).

### B. Số đơn = `so_hd`
- B1 Mọi chỗ HIỆN số đơn cho khách dùng `so_hd`; `so_hd` null → giữ `ma` như nay. Ít nhất: Theo dõi đơn (tiêu đề + ô "Số đơn của bạn — đọc cho nhân viên"), Chi tiết đơn
  (`Don.jsx` tiêu đề + mã), Lịch sử đơn (mỗi thẻ), dải báo đơn xong (`BaoDonXong.jsx`, `tieuDeXong`), các câu cảnh báo ở Thanh toán ("Bạn có đơn #… đang chờ trả",
  "Bạn vừa đặt đơn #…", "Tiếp tục trả đơn …"). Đọc trường ở MỘT chỗ (hàm đọc đơn sẵn có ở `datDon.js` / chỗ máy chọn — kế hoạch nêu).
- B2 Đường dẫn `/don/<mã>`, `GET /don/:ma`, `POST /don/:ma/huy`, khoá so sánh, bản ghi `kh_don_gui` VẪN dùng `ma` (mã App) — không đổi.

### C. Tiền về muộn (v11)
- C1 Đơn có `tien_ve_da_cong_vi` > 0 và `thong_bao_tien_ve` là chuỗi → Theo dõi đơn + Chi tiết đơn hiện NGUYÊN câu đó (khuôn `.nt-state` sẵn có), thay câu cũ "Quán đã nhận tiền,
  nhân viên sẽ liên hệ với bạn." Không có → giữ câu cũ khi `tien_ve_cho_doi_soat: true`. App không tự ghép câu, không tự tính.
- C3 (từ soát KH-BAO-1) Tờ hoá đơn mà sau khi bỏ dòng `ghi_no` không còn dòng nào → coi như không có tờ (vẽ `mon[]` + Tổng như đơn chưa có tờ), không vẽ thẻ rỗng.
- C2 `hoa_don` dòng `ma_gd` vẽ như dòng trả thường (đã là `loai` lạ → vẽ `trai` / `phai`; kiểm lại `HoaDonKhach` / `nhomHoaDon`, xếp vào nhóm `tra` nếu cần).

### D. Thẻ mã QR thương hiệu
- D1 Hàm thuần MỚI (vd `src/qrThuongHieu.js`, bài thử nạp thẳng): từ chuỗi → ma trận `qrcode-generator` (thư viện SẴN CÓ, mức **H**) → danh sách hình SVG: chấm tròn cho ô
  thường; 3 ô góc (finder 7×7) vẽ khối bo tròn TÔ ĐẶC đúng cấu trúc finder (khối ngoài + khe trắng + lõi — giống mẫu, máy quét đọc được), KHÔNG chấm tròn rời ở vùng finder;
  màu theo 4 phần tư (tâm = giữa ma trận); chừa ô trống tròn ở giữa cho logo (đường kính ≤ 20% bề ngang mã, không xoá quá phần mức H chịu được); viền trắng ≥ 3 ô; nền trắng.
- D2 Hàm thuần đọc nội dung chuyển khoản từ `qr.chuoi` (VietQR / EMV: trường `62` → trường con `08`); đọc không được → chỉ hiện `so_hd`.
- D3 Component MỚI (vd `src/components/TheQR.jsx`): thẻ đúng quy cách thư POS (logo + "Tứ Quý Đường" + "Quét mã để thanh toán"; ô trắng: số tiền to, mã, dòng
  "`<so_hd>` · `<nội dung CK>`"); không dòng chữ cuối thẻ. Dùng ở Theo dõi đơn chỗ QR trả tiền hiện nay (`TraQR`): số tiền = số đang hiện cạnh QR (`soTra` — QR cả đơn = tổng,
  ví + QR = `con_lai`; không biết → ẩn số); đếm ngược, "Mã QR đã hết hạn / Tạo mã mới", dòng ví đã giữ: GIỮ NGUYÊN. Logo: `public/anh/logo_tqd_192.png` (chép từ
  `viec/KH-SOHD-1/logo_tqd_192.png`).
- D4 Mã thành viên (`ManQR.jsx`) KHÔNG đổi (đó là mã quầy quét, không phải QR trả tiền).
- D5 Màu / viền / chữ của thẻ (#FBF3E6, #B08028, #7A1E18, 4 màu phần tư) là ngoại lệ ngoài demo chủ quán duyệt 06.11. Script mở việc ĐÃ thêm 7 màu này vào
  `DUYET_NGOAI_DEMO` (`kiem_tra_truoc_khi_giao.js`, trên main) — CHỈ cho hai tệp `src/giaoDien/the_qr.css` và `src/qrThuongHieu.js`: màu thẻ đặt trong CSS đó, màu 4 phần tư đặt
  ở hằng số MỘT chỗ trong `src/qrThuongHieu.js`. Đặt màu ở tệp khác → K9 đỏ (đúng luật). CSS `import` trong component (KHÔNG sửa `main.jsx`, `giaoDien.css`, `demo*.css`).
- D6 Kiểm quét thật: bài thử giải mã ảnh SVG / PNG của thẻ bằng công cụ có sẵn trong môi trường (vd `zbarimg`, `jsQR` có sẵn ở nháp — KHÔNG thêm vào `package.json`) cho ít nhất
  3 chuỗi VietQR mẫu dài khác nhau → đọc ra đúng chuỗi. Không có công cụ giải mã → ghi rõ "chưa kiểm quét máy", chủ quán quét tay (E4).

### E. Kiểm
- E1 Bài MỚI `cong_cu/thu_KHSOHD1.js`: hàm thuần (đọc `so_hd` / null; đọc nội dung CK từ EMV, chuỗi hỏng; ma trận QR mức H, finder đặc, 4 màu phần tư, ô logo ≤ 20%, viền ≥ 3)
  + đọc nguồn (chạy cả khi `KHONG_TRINH_DUYET=1`); Chromium với POS giả v11: Theo dõi đơn / Chi tiết / Lịch sử / Thanh toán hiện `APP0016`, `so_hd: null` hiện mã cũ, đường dẫn
  vẫn `/don/<ma>`; thẻ QR có số tiền + "APP0016 · TQDNOV06 APP0016"; tiền về muộn hiện nguyên câu POS. `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- E2 Bài thử cũ khoá chữ "#<ma>", câu "Quán đã nhận tiền…", hợp đồng v9 (A1), danh sách trường `canTuPos` — máy grep lại → sửa theo hành vi mới; mỗi bài sửa có ít nhất một ca
  ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1` (ca hàm thuần / đọc nguồn Phần 1, như KH-TT-1); KHÔNG dùng `## Bài thử cũ sửa`. Không nới phép kiểm tiền nào.
- E3 Ảnh 360 / 390 / 430 → `viec/KH-SOHD-1/so_anh/`: thẻ QR (QR cả đơn, ví + QR), Theo dõi đơn đã trả (số `APP0016`), Lịch sử đơn, câu tiền về muộn; ảnh thẻ cạnh `mau_the_QR_TQD.png`
  trong `doi_chieu_demo.md`.
- E4 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`. Chủ quán thử tay: (1) đặt đơn QR → thẻ
  QR thương hiệu, quét bằng MB / Vietcombank / Techcombank / MoMo — đọc đúng số tiền + nội dung; (2) trả xong → "Số đơn của bạn" = `APP…` trùng số trên bill.

## Phạm vi
- viec/KH-SOHD-1/**
- thiet_ke/HOP_DONG_API_KH.md
- src/kiemKhop/canTuPos.js
- src/datDon.js
- src/qrThuongHieu.js
- src/components/TheQR.jsx
- src/giaoDien/the_qr.css
- public/anh/logo_tqd_192.png
- src/pages/TheoDoiDon.jsx
- src/pages/Don.jsx
- src/pages/ThanhToan.jsx
- src/components/BaoDonXong.jsx
- src/baoDonXong.js
- src/components/HoaDonKhach.jsx
- src/hoaDon.js
- cong_cu/thu_KHSOHD1.js
- cong_cu/thu_KHMUA1.js
- cong_cu/thu_KHMUA1b.js
- cong_cu/thu_KHMUA1c.js
- cong_cu/thu_KHUI3b.js
- cong_cu/thu_KHKHOP1.js
- cong_cu/thu_KHHD1.js
- cong_cu/thu_KHBAO1.js
- cong_cu/thu_KHTT1.js

## Ngân sách
~200 dòng app + ~350 dòng thử.
**Phương án đơn giản nhất đã xét:** một hàm đọc `so_hd` dùng ở mọi chỗ hiện số; một hàm thuần dựng SVG từ `qrcode-generator` sẵn có (không thư viện QR mới); một component thẻ thay
`VeQR` ở chỗ QR trả tiền. Tiền về muộn: hiện nguyên câu POS.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- Chạy song song: KHÔNG sửa `src/pages/UuDai.jsx`, `src/giaHang.js`, `src/heThong.js`, `src/chuongTrinh.js`, `src/giaoDien/chuong_trinh.css`, `src/pages/TrangMon.jsx`,
  `src/pages/Menu.jsx`, `cong_cu/thu_KHHANG2.js`, `cong_cu/thu_KHCT1.js`, `cong_cu/thu_KHUI3d.js` (KH-HANG-2). Cần sửa ngoài Phạm vi → `## Câu hỏi`, dừng.
- KHÔNG sửa `src/api.js`, `src/pages/ManQR.jsx`, `src/components/PinSheet.jsx`, `src/luuMay.js`, `src/main.jsx`, `src/giaoDien/giaoDien.css`, `src/giaoDien/demo*.css`,
  `thiet_ke/**` ngoài file hợp đồng, `kiem_tra_truoc_khi_giao.js`.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `src/package.json`, `index.html`.
- KHÔNG đổi `ma` / đường dẫn / khoá gửi; KHÔNG tự tính tiền; KHÔNG tự ghép câu tiền về. KHÔNG làm tóm tắt ở Lịch sử đơn (`kenh`, `cach_nhan`, `tra[]` — chờ POS KH-TOMTAT-1).
- Chỉ push `git push -u origin viec/KH-SOHD-1`. Không đụng `main`, không merge, không tạo PR.
