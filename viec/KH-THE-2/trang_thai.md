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
- Bài MỚI `cong_cu/thu_KHTHE2.js`: trên gốc 6 đạt · 18 hỏng (KHONG_TRINH_DUYET=1; có trình duyệt 23 đạt · 64 hỏng). Sau vá: 44 / 44 (không trình duyệt), 133 / 133 (Chromium).
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
