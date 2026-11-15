# KH-THE-2 — trạng thái

## Bước 1 — đối chiếu bản chụp (14.11.2026)
- Nhánh: `viec/KH-THE-2`; cây sạch; `git fetch origin viec/KH-THE-2` xong.
- HEAD = `d90937f` · FETCH_HEAD = `d90937f` (bằng nhau — không kéo).
- `git log --oneline -3`:
  ```
  d90937f PHIEU: KH-THE-2
  474eda6 TIEN-DO: KH-ND-3d, KH-THE-1 xong (chat soat cuoi DAT, gop PR #36 #37); mo KH-THE-2 (the hoi vien theo thiet ke 14.11: so sanh nhanh len dau, Mua ngay thang Thanh toan chi QR, the khong vao gio, Chao mung hoi vien, the Uu dai theo tinh trang; Opus, cho duyet ke hoach); them KH-THU-2; quyet dinh 14.11; thu POS 13.11 + 14.11; ban giao chat 14.11
  6f9ffac Merge pull request #37 from tuquyduong/viec/KH-THE-1
  ```

## Bước 2–3
- Đã đọc phiếu, CLAUDE.md, KHUON_LOI.md, bản thiết kế (chụp Chromium), code: `gio.js`, `giaHang.js`, `datDon.js`, `dungDatDon.js`, `duongDan.js`, `App.jsx`,
  `HangThanhVien.jsx`, `ThanhToan.jsx`, `TheoDoiDon.jsx`, `UuDai.jsx`, `GioHang.jsx`, `TheHoiVien.jsx`, `BieuTuong.jsx`, `the_hang.css`, `thanh_toan.css`, danh mục `theHang.js` /
  `taiKhoan.js` / `donHang.js` / `menu.js`; bài thử `thu_KHTHE1.js`, `thu_KHHANG2.js`, `thu_KHND3c.js` (chỗ dính thẻ trong giỏ / dongGoi).
- Kế hoạch: `ke_hoach.md`. Phiếu dặn **Chờ duyệt kế hoạch** → commit, push, DỪNG.

## Bước 1 (lần làm tiếp sau duyệt, 14.11.2026)
- Nhánh `viec/KH-THE-2`; cây sạch; `git fetch origin viec/KH-THE-2` → HEAD = `e7bc071` · FETCH_HEAD = `e7bc071` (bằng nhau — không kéo).
- `git log --oneline -3`:
  ```
  e7bc071 PHIEU: KH-THE-2 - chu quan duyet ke hoach 14.11: Q1 them src/dangKySW.js, Q2 giu DauManCon, chay song song KH-ADMIN-1 / KH-QC-1
  88d5262 KH-THE-2: ke hoach (cho duyet) + trang thai buoc 1
  d90937f PHIEU: KH-THE-2
  ```

## Bước 4–5 — bài thử đỏ trước, rồi sửa
- Bài MỚI `cong_cu/thu_KHTHE2.js`: trên gốc 6 đạt · 18 hỏng (KHONG_TRINH_DUYET=1; có trình duyệt 23 đạt · 64 hỏng). Sau vá (bản cuối): 45 / 45 (không trình duyệt), 154 / 154 (Chromium) — lần đầu 44 / 133, thêm ca ở soát vòng 1–2.
- Bằng chứng: `bang_chung_do.txt` (7 bài, mỗi bài đỏ trên gốc + dòng `SỐ CA`).

## Khác kế hoạch (ghi rõ)
1. **Luật "thẻ không trả bằng số dư" = hàm `dungViCho(gio, congTac)` ở `datDon.js`** (thay `cachTraDon` của kế hoạch P2). Lý do: BAO-1 / TT-1 (phiếu F5: "GIỮ XANH
   không sửa ca") đọc NGUYÊN dòng `const cachTra = !dungVi ? 'qr' : duoc.vi ? …` của `ThanhToan.jsx`. Nay dòng đó giữ nguyên; `dungVi = dungViCho(gio, congTac)` — đơn có
   thẻ → false → QR. Vẫn MỘT luật, hàm thuần, bài thử nạp thẳng (C3) + đối chứng đơn đồ uống; đột biến VS-VI-CHO-THE-KHI-CONG-TAC-BAT bị bắt.
2. Bài thử cũ ngoài danh sách kế hoạch phải sửa ca (hành vi đổi có chủ đích — thẻ Ưu đãi theo tình trạng / giá tiết kiệm), mỗi bài có ≥ 1 ca sửa ĐỎ trên gốc kể cả
   KHONG_TRINH_DUYET=1:
   - `thu_KHUI3a.js` D1 "giaHang.js không nhân phần trăm" → chừa đúng dòng `tietKiemMotTrieu` (số tiết kiệm để hiện, phiếu B2 bắt buộc ở giaHang.js).
   - `thu_KHUI3d.js` B2 (nguồn + 3 ca Chromium thẻ hạng Ưu đãi) → khoá `ud.the.*`, thẻ "Chưa có thẻ" / "Hạng của bạn".
   - `thu_KHNHANH1.js` G1 (2 ca Chromium thẻ hạng Ưu đãi) → thẻ mới; thêm 1 ca nguồn G1 (trangThaiTheUuDai qua hangCoGiam) để bài đỏ trên gốc cả khi không trình duyệt.
     Ca luồng đơn đồ uống của NHANH-1 KHÔNG đổi.
   - `thu_KHHANG2.js`, `thu_KHND3c.js`, `thu_KHTHE1.js`: như kế hoạch §7 (THE1 bỏ các ca Chromium thẻ-trong-giỏ / trả thẻ trước — luồng mới ở THE2; C7 giữ với giỏ chỉ đồ uống).
   - `thu_KHND3b.js:27` chỉ là chú thích — KHÔNG sửa (sửa sẽ thành "bài cũ sửa" xanh trên gốc).
3. Thẻ Ưu đãi viết NGAY trong `UuDai.jsx` (kế hoạch §7) — không tệp `TheHangUuDai.jsx`.
4. `MedVe` / `MedHang` ở `BieuTuong.jsx`: chép nguyên `<symbol>` m-medal-gold / m-medal-plat của demo, nhúng gradient `gSv` (id `gSvVe`) vì index.html chưa có.
5. Hạng bán mà `/toi` thiếu hẳn `het_han` (không phải null): thẻ không hiện "Không thời hạn" (giữ luật KH-HANG-2 — không bịa).
6. Chào mừng: dòng nhỏ dưới nút = "Đồ uống bạn đã chọn vẫn còn trong giỏ" (chỉ khi có nút Về giỏ) — dòng của bản thiết kế là ghi chú cho chủ quán (doi_chieu_demo.md).
7. Ca Chromium THE2 gieo `kh_chu` (máy đã của đúng khách) — không có thì luuMay.doiKhach xoá giỏ / công tắc ví như khách lạ (đúng luật §8).

## Khoá danh mục (F1)
- THÊM `theHang.js`: tier.phu.thuong|hang|hangKhongHan|tang|tangKhongHan · tier.cmp.chon|thuong|khongHang|dang|giam|db|loi|gia|pt|trong|khong|mienPhi|moiThang|moiNThang ·
  tier.goi · tier.mo.tang · tier.qr · tier.ben · tier.ben.chung · tier.note · the.tt.phu|ten|thang|dong|chung|kichHoat|tra|qr|qr.phu|khongVi|nut|khongBan|khongBan.p|veHang ·
  khoá the.tt.pos · the.cm.t|chung|p|don|nut|veGio|nho · hien.the.cm · khoá the.cm.pos. (`tier.cmp`, `tier.cmp.gia`, `tier.cmp.giam`, `tier.cmp.quanTang`, `tier.cmp.chuaBan`,
  `tier.nut.*`, `tier.thang`, `tier.tietKiem`, `tier.mo.*`, `hien.tier.cmp|ben|note`, `tier.pos`, `tier.tutinh` giữ, đổi chữ / tên theo màn mới.)
- THÊM `taiKhoan.js`: ud.the.chuaCo|moi|chipGiam|chipDb|tu|moiThang|moiNThang|nutMua|cua|giam|hetHan|con|khongHan|nutCo|nhan|homNay|nhac|nutGiaHan|tang|tangHan|nutTang ·
  hien.ud.the · khoá ud.the.pos (pos) · ud.the.tutinh (tutinh).
- BỎ: tier.sub, tier.hienTai, tier.thuong, tier.moiMua, tier.conHan, tier.how, tier.hoac, tier.ben.giam, tier.ben.db, tier.buynote, tier.daThem, tier.daDoi, tier.cmp.giaThuong,
  tier.cmp.cach, tier.cmp.macDinh, tier.cmp.muaThe, hien.tier.card · ud.hang.bang|ten|pct|db|hetHan|khongHan|tang|dong|goi|nutCo|nutMua|pos · td.the.xong|xongChung|veGio, td.the.han ·
  gio.the.ten|chung|khongBan|xoaAria, gio.truocThe.chu|nut, hien.gio.truocThe, gio.the (khoá).
- `kiemDanhMuc` xanh (thu_KHTHE2 F1, thu_KHND3*).

## Đột biến tay — `node viec/KH-THE-2/dot_bien_tay.js --trinh-duyet` → TẤT CẢ ĐỘT BIẾN BỊ BẮT (18 / 18)
| Chỗ vá | Đột biến |
|---|---|
| dungViCho (thẻ không dùng ví) | VS-VI-CHO-THE-KHI-CONG-TAC-BAT, BV-THE-THEM-DONG-CACH-TRA-RIENG |
| tietKiemMotTrieu | VS-TIET-KIEM-NHAN-10, VS-TIET-KIEM-LAM-TRON-LEN |
| trangThaiTheUuDai | VS-SAP-HET-HAN-O-8-NGAY, BV-HET-HAN-VAN-LA-HANG |
| giỏ không giữ thẻ / dongTheTuDuongDan | BV-DOC-GIO-GIU-DONG-THE, VS-THAM-SO-SAI-VAN-NHAN |
| thamTaoMaMoi / dangKySW / duongDan chaTv | BV-TAO-MA-MOI-VE-GIO, BV-TU-TAI-LAI-O-THANH-TOAN-THE, VS-BACK-MAT-HANG |
| Thanh toán thẻ (Chromium) | VS-HIEN-CONG-TAC-VI-O-THANH-TOAN-THE, VS-GUI-MA-GIAM-VOI-THE, BV-GUI-DON-KHI-KHONG-CON-BAN, VS-GHI-DE-CONG-TAC-VI-KHI-MUA-THE |
| Mua ngay / Ưu đãi / Chào mừng (Chromium) | BV-MUA-NGAY-THEM-VAO-GIO, BV-THE-UU-DAI-XUONG-CUOI, BV-CHAO-MUNG-THANH-DON-THUONG |
Việc chỉ đổi `src/` (không `server/` / `client/src/`) → không `dot_bien.py` (như KH-THE-1); cổng A18 không áp.

## Ngân sách
`git diff --stat e7bc071 -- src`: +538 / −322 (18 tệp) — trong ngân sách phiếu (~450 thêm, trần 1,5 lần = 675).

## Phát hiện (ngoài Phạm vi — không sửa)
- `src/giaoDien/hang.css` (KH-HANG-2: `.hang-tang`, `.hang-goi`) không còn phần tử nào dùng sau khi bỏ thẻ cũ; `UuDai.jsx` vẫn import (bài `thu_KHHANG2` C1 đòi import). Tệp CSS
  ngoài Phạm vi → đề xuất việc dọn: xoá tệp + bỏ import + sửa ca C1.
- `src/noiDung/bieuTuongMua.js` / `index.html` chưa có `<symbol>` m-medal-gold / m-medal-plat / i-lock của demo (demo cũng không có i-lock) — nay vẽ thẳng ở BieuTuong.jsx.
- Bài `thu_KHND3b.js:27` chú thích còn nhắc `dongGoi` (đã bỏ) — chỉ chữ chú thích.

## Soát độc lập — vòng 1 (agent phụ, chỉ đọc) — báo cáo chép nguyên phần kết luận
```
KHÔNG ĐẠT
LỖI TÌM ĐƯỢC:
- viec/KH-THE-2/doi_chieu_demo.md:69-71 — mục "## Số đo" TRỐNG; F6 "0 điểm khác" không có số — K1.
- viec/KH-THE-2/trang_thai.md — không ghi kết quả npm test, --day-du, cổng tinh, K10, thao tác thử tay (F7, F8) — K1.
- src/pages/UuDai.jsx:178, src/pages/HangThanhVien.jsx:24 — hạng chỉ cấp THIẾU hẳn het_han vẫn hiện "không thời hạn" — K3.
- src/pages/ThanhToan.jsx:275 — không biết hạng: chữ the.tt.chung mà data-nd the.tt.ten; :196 dòng thẻ đơn chưa rõ gắn khoá pos tt.the trong khi chữ là the.tt.dong/chung — §11 / F1.
- cong_cu/thu_KHTHE1.js — bỏ ca Chromium "mã thẻ ở POST /don → xoá kh_don_gui" và "giỏ chỉ thẻ đặt được khi quán đóng", THE2 không có ca thay cùng nhánh — K3.
- cong_cu/thu_KHNHANH1.js:369 — ca G1 vãng lai bị nới (thẻ ẩn nên "không Test0d" luôn đúng) — K3.
NGHI NGỜ: gửi lại đơn chưa rõ thời KH-THE-1 (thẻ + ly trả ví) gửi vi + PIN; chưa ca 3 hạng ở 360 / > 3 hạng; thiếu ca C2 gửi lại cùng khoá, C5 mã lạ [C], D1 câu chung, D2 Trang chủ,
B1 Kim Cương không thời hạn; duongDan.js ra() là hàm chung (dễ xung đột KH-ADMIN-1); td.the.han xoá mà không ghi "Khác kế hoạch".
NGHIỆM THU: 21/24 · thiếu F6, F7, F8.
BÀI HỌC: KHOÁ ndDau(k) phải đi cùng nd(k); KHOÁ ca "không thời hạn" thử cả het_han thiếu; KHOÁ doi_chieu "Số đo" không trống; NGUYÊN TẮC bỏ ca cũ phải chỉ ca mới cùng nhánh.
```
### Sửa sau vòng 1
- Số đo: đã ghi bảng đầy đủ ở `doi_chieu_demo.md` (lần trước lệnh ghi bị người gác chặn — git add thư mục — nên phần ghi không chạy).
- Hạng tặng thiếu `het_han`: `UuDai.jsx` hàm `DongTang` (có hạn → "· hết hạn …", null → "· không thời hạn", thiếu → mục mới `ud.the.tangChung` "Dành tặng khách thân thiết");
  `HangThanhVien.jsx` dòng phụ chỉ "· không thời hạn" khi `het_han === null`. Ca Chromium mới E2 [tangThieu].
- data-nd: Thanh toán thẻ gắn `the.tt.ten` / `the.tt.chung` đúng chữ; đơn chưa rõ gắn `khoaDongThe()` (giaHang.js, cùng luật tenDongThe); bỏ khoá `tt.the` (không còn dùng).
- Ca thay cùng nhánh (thu_KHTHE2 Chromium): "C5 POS chặn ở POST /don (mã thẻ)" — xoá bản ghi gửi, không chưa rõ, nút khoá, Về Hạng thành viên; "C5 mã lạ ở POST /don" (THE_KHONG_TRA_VI);
  "K5 mua thẻ khi quán đóng" (POS giả chặn đơn CÓ đồ uống ngoài giờ như v13); "C2 chưa rõ → gửi lại đúng đơn thẻ" (4 lần 500 → chưa rõ → bấm gửi lại: mọi lần CÙNG khoá, thân thẻ, qr,
  không pin / ma_giam); "B2 3 hạng ở 360" (không cuộn) + "B2 5 hạng ở 360" (cuộn trong khung, trang không cuộn); D1 không bản ghi → "Chào mừng hội viên!" không %, giỏ rỗng không nút Về giỏ;
  D2 Trang chủ hiện Vàng; B1 "Kim Cương · quán tặng · không thời hạn".
- NHANH1 G1 vãng lai: POS giả cho Vàng một gói → thẻ "chưa có thẻ" hiện, kiểm Vàng 10% và KHÔNG Test0d (đối chứng thật).
- Không sửa (ghi lý do): (1) "Gửi lại đúng đơn này" của bản ghi CŨ (thời KH-THE-1, thẻ + ly, trả ví) gửi NGUYÊN thân cũ — đây là luật chống đơn đôi (cùng khoá + cùng thân, POS có thể
  đã tạo đơn đó); đổi thân thì POS coi là đơn khác. Bản ghi chỉ sống 24 giờ; POS sẽ chặn trả thẻ bằng số dư (thư 14.11) → khách thấy lời POS. (2) `duongDan.js` `ra()` thêm một dòng
  đọc `chaTv` (cần cho Back của Thanh toán thẻ — C1); dòng /admin không đụng; ghi để chat gộp với KH-ADMIN-1 để ý. (3) `td.the.han` (kế hoạch ghi "giữ") đã bỏ vì màn chúc mừng dùng
  khoá `the.cm.pos` cho hạn mới — bổ sung vào "Khác kế hoạch".

## Thao tác chủ quán thử tay (F8) — điện thoại
1. Mở tab **Ưu đãi**: thẻ hội viên ở TRÊN CÙNG, đúng tình trạng của chị (chưa thẻ / còn hạn / sắp hết hạn / quán tặng), MỘT nút.
2. Bấm nút thẻ → **Hạng thành viên**: bảng "So sánh nhanh" ở đầu; chạm cột Kim Cương (nút mờ "Hạng dành tặng…") rồi cột Hạng vàng (gói + nút "Mua ngay · …" đổi theo).
3. Bấm **Mua ngay** với gói rẻ → Thanh toán chỉ có "Chuyển khoản QR" (không công tắc ví, không nhận hàng) → quét QR trả → màn **Chào mừng hội viên** → "Đặt đồ uống ngay" → giá Menu đã giảm.

## Soát độc lập — vòng 2 (agent phụ mới, chỉ đọc) — kết luận chép nguyên
```
KHÔNG ĐẠT — 6 lỗi vòng 1 đã sửa đúng; đường tiền đúng; tệp cấm không đổi; K9 đúng.
LỖI TÌM ĐƯỢC:
- trang_thai.md chưa ghi kết quả npm test / --day-du / cổng tinh / K10; dòng 29 còn số cũ 133/133 — K1 / F7.
- UuDai.jsx:180 "còn N ngày" (nd ud.the.con) gắn data-nd ud.the.tutinh; HangThanhVien.jsx:34–35 tier.cmp.pt / moiThang / moiNThang / trong nằm trong ô chỉ gắn tier.pos / tier.tutinh — §11 / F1.
- TheoDoiDon.jsx:107 — tắt hien.the.cm làm đơn chỉ thẻ hiện như đơn đồ uống (số đơn, các bước, "mời ra quầy") — K5 / D1.
NGHI NGỜ: không còn ca khoá "đơn chỉ thẻ không có dải báo đơn"; /hang chưa về / lỗi → khách Kim Cương bị xếp "co" (thẻ vàng); tong null → "Đơn APP0042 · " cụt; giaCot tự tìm gói rẻ nhất
thay vì dùng giaRe; ra() của duongDan là hàm chung.
NGHIỆM THU: 22/24 · thiếu F7 (kết quả kiểm chưa ghi), F1 (data-nd hai tệp).
BÀI HỌC: KHOÁ mọi nd(k) hiện cho khách nằm trong phần tử ndDau(k) của chính khoá đó · NGUYÊN TẮC tắt khối hien.* chỉ ẩn khối đó · KHOÁ lỗi vòng trước phải có dòng "đã sửa".
```
### Sửa sau vòng 2
- F7: mục "Kết quả kiểm" bên dưới (số mới). Dòng số ca THE2 đã sửa.
- data-nd: `UuDai.jsx` "còn N ngày" gắn `ud.the.con`; `HangThanhVien.jsx` ô số: phần tử ngoài giữ khoá `tier.pos` / `tier.tutinh`, chữ định dạng bên trong gắn `tier.cmp.pt`,
  `tier.cmp.moiThang|moiNThang`, `tier.cmp.trong` của chính nó.
- `TheoDoiDon.jsx`: `theXong` (đơn chỉ thẻ đã trả) KHÔNG phụ thuộc `hien.the.cm`; `chaoMung = theXong && ndHien(...)` chỉ ẩn màn chúc mừng (còn hoá đơn POS). Ca [T] mới D1 ở thu_KHTHE2;
  đột biến BV-CHAO-MUNG-THANH-DON-THUONG đổi theo dòng mới.
- Nghi ngờ đã xử lý: ca Chromium "không dải .bao-don cho đơn chỉ thẻ" (THE2 B5); thẻ Ưu đãi chờ `/hang` (mảng) mới vẽ — `/hang` lỗi → không vẽ (không sai thẻ); `tong` null → mục mới
  `the.cm.donSo` "Đơn {so}"; `giaCot` dùng `giaRe`. `ra()` của duongDan: giữ, đã ghi ở "Sửa sau vòng 1".

## Kết quả kiểm (bản cuối, 14.11.2026)
- `node kiem_tra_truoc_khi_giao.js --day-du` (có Playwright + dựng app): **54 đạt · 0 hỏng** — gồm K9 (màu chỉ từ demo), K10 (chữ cứng chỉ được giảm — không tệp nào tăng / giảm),
  dựng app + kiểm dist/, mọi `cong_cu/thu_*.js` xanh (thu_KHTHE2 154/154, THE1 91, HANG2 67, ND3c 79, NHANH1 229, UI3a 87, UI3d 174 có trình duyệt).
- `npm test` = cùng bộ không `--day-du` — xanh (các lần chạy trong việc).
- Đột biến tay: nhóm không trình duyệt 11/11 bắt (chạy lại sau vòng 2); nhóm trình duyệt — ghi ở dưới.
- Cổng `node tu_chay/cong.js tinh . d90937f^ HEAD viec/KH-THE-2`: chỉ `✗ [A19]` (thiếu dòng HEAD ĐÃ KIỂM — ghi cuối cùng).
- Cổng `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . d90937f^ HEAD viec/KH-THE-2` (lần trước vòng 2): `✓ CỔNG CHẠY ĐẠT` (2 cảnh báo A16: THE2 / HANG2 dừng sớm trên gốc — "bỏ qua").
  Chạy lại ở HEAD cuối — ghi ở dưới.

## Soát độc lập — vòng 3 (agent phụ mới, chỉ đọc) — kết luận chép nguyên
```
KHÔNG ĐẠT — 4 lỗi vòng 2 đã sửa đúng; SỐ CA khớp; K9 đúng; tệp cấm không đổi.
LỖI TÌM ĐƯỢC: src/pages/ThanhToan.jsx:189 — phu={nd('the.tt.phu')} truyền chuỗi trần vào DauManCon (Man.jsx:18 không gắn data-nd) → chữ mới "Thẻ hội viên"
  không có ✎ ở Chế độ sửa — §11 / F1 / K4.
NGHI NGỜ: UuDai.jsx TU_TINH thành biến chết (số ngày mất ổ khoá "App tự tính"); hai chú thích dồn một dòng; PhuToi khi /hang chưa về → Kim Cương thấy
  "Bạn đang ở Kim Cương"; Thanh toán thẻ khi /hang lỗi hẳn không có nút Về Hạng thành viên (còn Back); gửi lại đơn chưa rõ cũ — chấp nhận; ca D1 [T] là regex nguồn.
NGHIỆM THU: 22/24 · thiếu F1 (the.tt.phu), F7 (chờ cổng chay + HEAD ĐÃ KIỂM).
BÀI HỌC: KHOÁ chữ truyền qua prop của khung chung (DauManCon tieuDe / phu) cũng phải bọc ndDau — bài F1 nên kiểm DOM [data-nd="<khoá mới>"] · NGUYÊN TẮC đổi khoá data-nd của ô
  thì kiểm khoá pos / tutinh còn được gắn ở đâu.
```
### Sửa sau vòng 3 (vòng sửa thứ 3 — trần `so_vong_sua_toi_da`)
- `ThanhToan.jsx` dòng phụ Thanh toán thẻ: `<span {...ndDau('the.tt.phu')}>` (như HangThanhVien).
- `UuDai.jsx`: số ngày ("còn N ngày", "Còn N ngày" / "Hết hạn hôm nay") bọc phần tử khoá `ud.the.tutinh` (🔒 App tự tính) ngoài, chữ gắn khoá của chính nó bên trong; tách lại chú thích.
- `HangThanhVien.jsx` PhuToi: `/hang` chưa về → chưa vẽ dòng phụ (như thẻ Ưu đãi).
- Không sửa: Thanh toán thẻ khi `/hang` lỗi hẳn chỉ còn nút Back (không nút "Về Hạng thành viên") — khách vẫn quay lại được; ghi để chat soát cuối xem.

## Câu hỏi
- Đã dùng đủ 3 vòng sửa theo soát độc lập (vòng 3 còn 1 lỗi một dòng — đã sửa, bài thử / `--day-du` / cổng chạy lại xanh ở HEAD cuối, xem dưới) — KHÔNG mở vòng soát thứ 4 theo luật
  `so_vong_sua_toi_da`. Nhờ chat soát cuối xác nhận phần "Sửa sau vòng 3" khi so ảnh lần cuối.

## Báo cáo 7 mục
- **VIỆC:** KH-THE-2 — thẻ hội viên theo thiết kế 14.11: thẻ không vào giỏ; "Mua ngay" thẳng Thanh toán thẻ (chỉ QR, không ví, không mã giảm); So sánh nhanh ở đầu màn Hạng thành viên;
  màn "Chào mừng hội viên"; thẻ ở Ưu đãi theo 4 tình trạng.
- **ĐÃ SỬA:** `src/gio.js` (bỏ dòng thẻ, `dongTheTuDuongDan`), `src/datDon.js` (`dungViCho`, `thamTaoMaMoi`, `hangCuaDon` trả bản ghi; bỏ `phanGui`, `thamThanhToanLai`),
  `src/giaHang.js` (`MOC_TIET_KIEM`, `tietKiemMotTrieu`, `giaCot`, `coDacBiet`, `trangThaiTheUuDai`, `khoaDongThe`; bỏ `lopHang`, `dongGoi`), `src/duongDan.js` (đường
  `/uudai/hang/thanhtoan`, `chaTv`), `src/dangKySW.js` (không tự tải lại ở Thanh toán thẻ — Q1), `src/App.jsx` (`muaThe`, `veThanhToan`, màn Thanh toán thẻ; bỏ `traTheTruoc`),
  `src/pages/ThanhToan.jsx` (chế độ thẻ — `KhoiThe`), `TheoDoiDon.jsx` (`ChaoMung`), `HangThanhVien.jsx` (viết lại — `SoSanh`, `PhuToi`), `UuDai.jsx` (thẻ 4 trạng thái đầu màn),
  `GioHang.jsx` (bỏ dòng thẻ / Trả thẻ trước), `components/BieuTuong.jsx` (`MedVe`, `MedHang`), CSS `the_hang.css` / `thanh_toan.css`, danh mục `theHang.js` / `taiKhoan.js` /
  `donHang.js` / `menu.js`. +~560 / −330 dòng app — trong ngân sách.
- **BÀI THỬ:** mới `cong_cu/thu_KHTHE2.js` (45 không trình duyệt / 154 Chromium; đỏ trên gốc 6 · 18); sửa ca thẻ của THE1, HANG2, ND3c, UI3a, UI3d, NHANH1 (mỗi bài đỏ trên gốc —
  `bang_chung_do.txt`); đột biến tay 18 / 18 bắt (`dot_bien_tay.js --trinh-duyet`); `--day-du` 54 / 54; cổng `chay` — dưới.
- **ĐÃ RÀ K4:** grep `src/` không còn `themThe|phanGui|thamThanhToanLai|lopHang|dongGoi|chiThe|traTheTruoc|gio.the|ud.hang.|td.the.|tt.the`; chỉ một chỗ dựng dòng thẻ (App → `dongTheTuDuongDan`),
  một luật cách trả (`dungViCho` + dòng `cachTra` cũ), `ma_giam` chặn bằng `KHONG_MA`; mọi chỗ "không thời hạn" phân biệt null / thiếu; data-nd từng chữ mới đúng khoá (3 vòng soát).
- **CHƯA KIỂM:** điện thoại thật / trình duyệt Zalo / chữ to theo cài đặt máy (chỉ Chromium 360 / 390 / 430); POS thật (chỉ POS giả theo hợp đồng v13 — chưa có mã lỗi "trả thẻ bằng số dư"
  của thư 14.11, app hiện nguyên lời mọi mã 4xx lạ); ảnh thiết kế chỉ khung 390; Chế độ sửa /admin chưa có (KH-ADMIN-1) nên ✎ chưa thử thật — chỉ kiểm data-nd.
- **GIT:** nhánh `viec/KH-THE-2`, commit từng bước có mã việc, đã push; không merge, không PR.
- **BÀI HỌC:** dưới.

## Bài học
1. **KHOÁ** (ngoài Phạm vi — đề xuất, không tự làm): bài thử chung kiểm DOM — mọi phần tử hiện chữ `nd(k)` phải mang `data-nd="k"` (kể cả `tieuDe` / `phu` của DauManCon); lỗi lặp 3 vòng soát
   (ThanhToan the.tt.ten / the.tt.phu, UuDai ud.the.con, HangThanhVien tier.cmp.*). Tệp: `cong_cu/thu_KHND3a.js` hoặc bài chung mới; ca đỏ: phần tử `.sub` của #checkout chế độ thẻ.
2. **KHOÁ** (đã làm trong Phạm vi): ca "không thời hạn" thử cả `het_han` thiếu hẳn (E2 [tangThieu], HANG2 A3) · tắt `hien.the.cm` không đổi luồng (ca D1 [T]) · dải báo đơn không báo đơn
   chỉ thẻ (ca .bao-don).
3. **NGUYÊN TẮC** (đề xuất KHUON_LOI.md, ngoài Phạm vi): "Sửa / bỏ ca của bài cũ → chỉ ra ca mới thử CÙNG nhánh code; ca 'không có X' phải có đối chứng làm X hiện ra" (vòng 1: ca POST /don
   lỗi thẻ, ca G1 NHANH1 luôn xanh).
4. **NGUYÊN TẮC**: phiếu dặn "không sửa ca" bài cũ đọc NGUYÊN dòng mã (BAO-1 / TT-1) → thiết kế quanh dòng đó (giữ dòng, đưa luật vào hàm thuần đứng trước) thay vì sửa bài.
5. **BỎ**: người gác chặn `git add <thư mục>` làm phần `cat >>` trước đó trong cùng lệnh không chạy → mục "Số đo" trống (vòng 1). Một lần; bài học: lệnh ghi tệp tách khỏi lệnh git.
6. **BỎ**: `chu()` trả chữ in hoa theo CSS (`text-transform`) → regex phân biệt hoa thường hỏng (ca D2 Menu). Một lần.

## Kiểm cuối ở HEAD e3f4b9b (sau sửa vòng 3, cây sạch)
- `node kiem_tra_truoc_khi_giao.js --day-du`: 54 đạt · 0 hỏng (thu_KHTHE2 154 / 154 có trình duyệt).
- `node viec/KH-THE-2/dot_bien_tay.js --trinh-duyet` (sau vòng 2): TẤT CẢ ĐỘT BIẾN BỊ BẮT — 18 / 18; nhóm không trình duyệt chạy lại sau vòng 3 đổi code chỉ giao diện chữ — không đổi chỗ đột biến.
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . d90937f^ HEAD viec/KH-THE-2`: ✓ CỔNG CHẠY ĐẠT (cảnh báo A16: thu_KHHANG2 10 ≠ 16, thu_KHTHE2 24 ≠ 45 ca — hai bài dừng sớm trên gốc vì hàm mới chưa có; bỏ qua theo cổng).
- `node tu_chay/cong.js tinh …`: chỉ ✗ [A19] trước dòng dưới.

HEAD ĐÃ KIỂM: e3f4b9b
