# KH-ND-3c — trạng thái

## Bản chụp (bước 1 của /lam-viec, 12.11.2026)
- Nhánh `viec/KH-ND-3c`, HEAD `8c67ae6`, FETCH_HEAD `8c67ae6` (bằng nhau, không cần kéo). Cây sạch lúc mở.
- `git log --oneline -3`:
  - `8c67ae6 PHIEU: KH-ND-3c`
  - `e107f85 TIEN-DO: KH-UI-5g, KH-ND-3e, KH-ND-3b xong (chat soat cuoi DAT, gop PR); mo KH-ND-3c (...)`
  - `342b3ea Merge pull request #33 from tuquyduong/viec/KH-ND-3b`
- Ghi chú môi trường: hai commit đầu (`b60ffa3`, `bb20201`) làm trước khi thấy nhắc thêm dòng `Co-Authored-By` nên thiếu dòng đó; các commit sau đã có (không `--amend` theo luật).

## Câu hỏi
(không có)

## Phát hiện (ngoài Phạm vi — không sửa)
1. `src/components/Man.jsx` — `DauManCon` nhận tên màn / dòng phụ là CHUỖI, không gắn `data-nd`: tên màn Hồ sơ, Hỗ trợ, Mã thành viên, Trắc nghiệm (giới thiệu, kết quả) và dòng phụ của chúng (8 khoá: `hs.tieuDe`, `hs.phu`, `ht.tieuDe`, `mqr.tieuDe`, `tn.tieuDe`, `tn.phu`, `tnk.tieuDe`, `tnk.phu`) sửa được ở danh mục nhưng Chế độ sửa không vẽ được viền vàng. KH-ADMIN-1 / việc sau nên cho `DauManCon` nhận khoá (`khoaTieuDe`, `khoaPhu`). (Cùng tình trạng đã có ở `Don.jsx`, `ThanhToan.jsx`.)
2. `src/components/Thongbao.jsx` — thông báo nổi nhận chuỗi, không gắn `data-nd`: 9 khoá (`app.daThem`, `app.daThemNhieu`, `app.boQua`, `app.menuChua`, `app.donRong`, `tnk.daLuuToast`, `tnk.khongLuuDuoc`, `tnk.daSaoChep`, `tnk.chuanBiGopY`) chỉ sửa được qua "Danh sách chữ của màn này".
3. `src/components/KhoiTheChat.jsx` — vẫn đọc `KET_QUA` của `tracNghiemChu.js`; việc này đổi tệp đó thành cầu đọc (getter → `nd('tnk.*')`) nên 6 chữ (`tnk.duaTren`, `khongNoiBat`, `dacDiem`, `chamSoc`, `thucUong`, `mucNhe`) ĐÃ sửa được ở danh mục, nhưng thành phần chưa gắn `data-nd` (ngoài Phạm vi). Khi sửa `KhoiTheChat` nên dùng `<Chu k="tnk.…">` và xoá cầu đọc.
4. `src/components/GiaMon.jsx` dòng `dinhDangGia(gia).replace('đ', '')` — bỏ đơn vị bằng chữ cứng `'đ'`. Khoá `gia.donVi` (chữ gắn sau số, tối đa 3 ký tự) nay sửa được: đổi thì cột bậc giá còn thừa đơn vị. Nên đổi thành `.replace(nd('gia.donVi'), '')` (hoặc khoá `gia.donVi` thành mục khoá).
5. Ba khoá có dấu cách ở đầu / cuối để giữ ĐÚNG cách tách nút chữ của JSX cũ (0 điểm ảnh lệch): `ud.hang.db` (đầu), `dn.ma.guiLaiSau` (đầu), `tnk.mucNhe` (cuối). Bảng sửa của /admin (KH-ADMIN-1) KHÔNG được cắt khoảng trắng hai đầu chữ ở các khoá này, hoặc đưa dấu cách ra khỏi khoá.
6. `cong_cu/ha_no_chu.js` (C3): giữ dòng 0 cả cho tệp ĐÃ XOÁ / đổi tên → dòng 0 cũ nằm mãi trong `no_chu_cung.txt`. Vô hại (K10 so `dem[f] || 0`); dọn tay khi cần.
7. `src/components/TheoDoiDon.jsx` đọc `LIEN_HE.dienThoai` (nay là getter đọc `ht.dienThoai`): chủ quán điền số ở /admin thì nút "Gọi quán" ở Theo dõi đơn cũng hiện — cùng một số, đúng ý định "liên hệ một chỗ"; ghi để chủ quán biết.
8. `VeQR` (ManQR.jsx) chỉ màn Mã thành viên dùng (comment cũ nói "dùng lại cho QR trả tiền ở Theo dõi đơn" sai) — đã sửa comment; thẻ QR trả tiền ở Theo dõi đơn dựng riêng.
9. Chạy đầy đủ có Chromium (`node kiem_tra_truoc_khi_giao.js --day-du` không đặt biến) mất ~25 phút ở máy này (3b ghi >10 phút phải dừng) — lần này chạy hết: xanh.

## Nghiệm thu từng mục (bằng chứng)
| Mục | Bằng chứng |
|---|---|
| A1 chuyển hết chữ / ảnh / nút | `thu_KHND3c` Phần 1: 252 mục (213 chữ · 15 đoạn · 5 ảnh · 1 danh sách · 10 khoá pos · 8 khoá tutinh), `kiemDanhMuc` 0 lỗi; **243 chuỗi có dấu của 17 tệp A1 ở bản gốc còn trong danh mục** (`chu_goc.json` trích bằng @babel/parser); 14 tệp A1 số chữ cứng = 0 (K10 `no_chu_cung.txt`: App.jsx 7→0, UuDai 34→0, HoSo 31→0, TaiKhoan 14→0, NhanMa 9→0, TracNghiemKetQua 6→0, DangNhap 5→0, TracNghiemLam 4→0, ManQR 4→0, HoTro 3→0, dinhDang 3→0, giaHang 3→0; nợ chung 561→438); `dangNhap.js` còn 5 chữ xưng hô (mã gửi POS, khoá `tutinh`), `lienHe.js` / `tracNghiemChu.js` 0; 53 khoá macDinh kiểm tay với chữ cũ (gồm 4 khoá `O_TRAC_NGHIEM` của Trang chủ); Chromium: bản giả đổi 5–8 khoá mỗi màn (Ưu đãi khách / hội viên, Tài khoản, Hỗ trợ, Hồ sơ, Đăng nhập 3 bước, Trắc nghiệm giới thiệu + làm bài), bản rỗng → như cũ, có `data-nd` / `data-nd-khoa` |
| A2 trắc nghiệm chuyên môn KHOÁ | `thu_KHND3c` A2: 5 mục khoá `tutinh` (`tn.the`, `tnl.cauHoi`, `tnk.the`, `tnk.diem`, `tnk.mon`) + chỉ đường "Nội dung chuyên môn — thay bằng bản trắc nghiệm mới"; `src/tracNghiem.js` còn 62 chữ cứng, `tracNghiem.json` 62 câu, `tracNghiemMenu.json` không đổi (git diff rỗng) |
| A3 TheMoi | `thu_KHND3c` A3 (TheMoi hết `logo-nho`; Ưu đãi truyền `ud.moi.anh`) + Chromium (ảnh thẻ mời đổi theo `ud.moi.anh`) |
| A4 lời chào Hồ sơ | `thu_KHND3c` A4: HoSo hết `=== 'Chào'`, dùng `coBuoi`; Chromium: có giờ POS → "Xin chào buổi sáng, chị Linh!", KHÔNG có giờ → "Xin chào chị Linh!" (không phẩy thừa) |
| A5 ảnh y hệt | `so_anh/ket_qua.txt`: 51 cặp (17 ca × 360/390/430), 48 giống hệt, 3 lệch = Mã thành viên (mục B) |
| B1 mã to, nền trắng, viền 4 ô | `thu_KHND3c` B1 tĩnh (CSS `.khung-qr` min(78vw, 320px), `#fff`; `VeQR` tham số `vien`, `VIEN_QUET = 4`) + Chromium: mã rộng ≥ 70% ở 390 (số 374/390 ghi lúc đầu là SAI — lần đo đó chưa nạp CSS; với CSS thật: thẻ 304px, svg ≈ 288px ≈ 74%, đã sửa theo báo cáo soát), nền `rgb(255, 255, 255)` kể cả `prefers-color-scheme: dark`, viewBox −4 |
| B2 giữ màn sáng | `thu_KHND3c` B2 (tĩnh) + Chromium: `navigator.wakeLock` giả — xin 1 lần `'screen'`, rời màn → `release` 1 lần; không có / từ chối → không lỗi trang |
| B3 dòng nhắc | `thu_KHND3c` B3 + Chromium (đọc "Đưa mã này cho nhân viên quầy" + "Tăng độ sáng màn hình để quầy quét nhanh", SĐT "090 xxx 4567") |
| B4 ảnh + đối chiếu | `so_anh/{truoc,sau,lech}/qr__man__*`, `doi_chieu_demo.md` §3 |
| C1 nhớ chương trình | `thu_KHND3c` C1 (chạy ĐÚNG hai hàm `docCtMay` / `ghiCtMay` trích từ App.jsx với kho giả: hợp lệ, hỏng → rỗng, kho chặn, ghi 4 trường, hết → xoá) + Chromium (3 ca: banner "Quà sinh nhật" ngay khi `/chuong-trinh` chậm 2,5 giây; hết chương trình → bỏ; bản nhớ hỏng → mặc định; đăng xuất không xoá) |
| C2 khoá dải quảng cáo | `thu_KHND3c` C2 (chonQuangCao trả `khoaDai`: POS → `qc.pos`, Giờ vàng → `qc.dai.gv`, chương trình → `qc.dai.ct`) + Chromium (`.dai-qc-chu` có `data-nd="qc.dai.gv"` / `"qc.dai.ct"`) |
| C3 K10 giữ dòng 0 | `thu_KHND3c` C3 (haNo, no_chu_cung.txt 12 dòng "… 0") + `thu_KHND3a` C2 "giữ dòng 0, K10 xanh" (đỏ trên gốc) |
| C4 vệt sáng luôn chạy | `thu_KHUI5g` A2 (C4): luật `@media` ở cuối `giaoDien.css` + chú thích `dai_quang_cao.css` (tĩnh, đỏ trên gốc) + Chromium `reducedMotion: 'reduce'` → `sweepP` / `sweepL`, `--p` đổi giữa hai lần đọc (xanh, 57 đạt) |
| D1 bài mới | `thu_KHND3c.js`: 42 ca (KHONG_TRINH_DUYET=1) / 79 ca (Chromium); mọi khoá dùng có trong danh mục (266), mỗi khoá có chỗ dùng + chỗ gắn hoặc cờ `KHONG_GAN` + lý do (D1) |
| D2 bài cũ sửa | 9 bài (HANG2, MUA1b, SINH1, UI3d, UI5a, UI5g, XEM1, ND3a, ND3b): `bang_chung_do.txt` mục 2 — mỗi bài ≥ 1 ca đỏ trên gốc kể cả `KHONG_TRINH_DUYET=1`; không dùng `## Bài thử cũ sửa` |
| D3 `doi_chieu_demo.md` | có (bảng ảnh + bảng khoá demo ↔ App + mục Mã thành viên + C4) |
| D4 sửa được ở /admin | mục "Khoá đã thêm" dưới đây; K10 hạ bằng `node cong_cu/ha_no_chu.js` (561 → 438); `npm test` / `--day-du` xanh; cổng `tinh` + `chay` ĐẠT (mục Cổng) |
| D5 chủ quán thử tay | mục "Thử tay" dưới đây |

## Khoá đã thêm — `src/noiDung/nd/taiKhoan.js` (CLAUDE.md §11: mọi thứ mới khách thấy có khoá + `data-nd`, sửa được ở /admin)
Tổng **252 mục**: 213 chữ · 15 đoạn · 5 ảnh · 1 danh sách · 10 khoá `pos` · 8 khoá `tutinh`. Không khối mới (không có khoá `hien.*`: việc này không thêm khối, chỉ chuyển nội dung sẵn có).

| Màn (`man`) | Tiền tố khoá | Số mục | Theo loại |
|---|---|---|---|
| Tài khoản | `tk.*` | 21 | 18 chữ · 1 ảnh (`tk.tracNghiem.anh`) · 1 khoá pos (`tk.khach`) · 1 khoá tutinh (`tk.tracNghiem.kq`) |
| Ưu đãi (gồm nhập mã) | `ud.*`, `nm.*` | 55 | 48 chữ · 1 đoạn · 1 ảnh (`ud.moi.anh`) · 5 khoá pos (`ud.gv.so`, `ud.ct.pos`, `ud.hang.pos`, `ud.khach`, `nm.loi`) |
| Hồ sơ | `hs.*` | 31 | 26 chữ · 2 đoạn · 2 khoá pos (`hs.khach`, `hs.loi`) · 1 khoá tutinh (`hs.xh.chu`) |
| Hỗ trợ | `ht.*` | 7 | 7 chữ (`ht.dienThoai`, `ht.zalo`, `ht.email` macDinh RỖNG — trống thì ẩn) |
| Đăng nhập | `dn.*` | 26 | 22 chữ · 1 đoạn · 1 ảnh (`dn.logo`) · 1 khoá pos (`dn.loi`) · 1 khoá tutinh (`dn.xh.chu`) |
| Mã thành viên | `mqr.*` | 6 | 5 chữ (`mqr.sang` là dòng nhắc mới) · 1 khoá pos (`mqr.ma`) — tiền tố `mqr.` vì `qr.*` đã dùng cho thẻ QR trả tiền (3e) |
| Trắc nghiệm | `tn.*`, `tnl.*`, `tnk.*` | 99 | 80 chữ · 11 đoạn · 2 ảnh (`tn.anh`, `tn.seal`) · 1 danh sách (`tnl.khiHau`, giữ mã máy `lanh/nong/deu`) · 5 khoá tutinh |
| Khung chung | `app.*`, `gia.*` | 7 | 7 chữ (thông báo nổi của App; đơn vị tiền và "giảm …") |

`data-nd` / `data-nd-khoa` gắn ở từng màn (đếm trong Chromium, bản mặc định): Ưu đãi khách ≥ 6 · hội viên ≥ 12 + khoá ≥ 5 · Tài khoản ≥ 10 + khoá ≥ 2 · Hỗ trợ ≥ 2 · Hồ sơ ≥ 20 + khoá ≥ 4 · Đăng nhập ≥ 4 · Mã thành viên ≥ 3 + khoá ≥ 2 · Trắc nghiệm giới thiệu ≥ 15 + khoá ≥ 1 · làm bài ≥ 5 + khoá ≥ 1.
Khoá cố ý không gắn `data-nd` (chữ đi vào chỗ không có phần tử riêng — thông báo nổi, aria / placeholder, tên màn do `DauManCon`, hàm thuần `dinhDangGia` / `moTaGiam`): khai cờ + lý do trong `KHONG_GAN` của `thu_KHND3c.js` (xem Phát hiện 1–3).

## Bảng chỗ vá → đột biến
Việc không đụng tiền / bảo mật (chuyển chữ, giao diện một màn, một khoá lưu công khai trên máy), không có `dot_bien.py`. Phép kiểm "chỉ được giảm" của K10 có bài đỏ-xanh ở `thu_KHND3a` (C2).

## Bài thử
- Mới: `cong_cu/thu_KHND3c.js` — 42 ca (KHONG_TRINH_DUYET=1) / 79 ca (Chromium). Trên gốc: 7 đạt · 35 hỏng.
- Sửa 9 bài cũ (chữ chuyển chỗ / hành vi đổi có chủ đích): HANG2 · MUA1b · SINH1 · UI3d · UI5a · UI5g · XEM1 · ND3a · ND3b. `bang_chung_do.txt` ghi đỏ gốc → xanh sau và `SỐ CA` mỗi bài.
- Cả bộ: `KHONG_TRINH_DUYET=1 node kiem_tra_truoc_khi_giao.js --day-du` → 50 đạt · 0 hỏng (có `vite build`); KHÔNG đặt biến (có Chromium) → 50 đạt · 0 hỏng (~25 phút).

## Thử tay (D5 — chủ quán trên điện thoại)
1. Tài khoản → Mã thành viên: mã to gần hết bề ngang, thẻ nền trắng, có dòng "Tăng độ sáng màn hình…"; để yên vài chục giây — màn KHÔNG tự tắt. Đưa cho quầy quét thử.
2. Đóng hẳn App rồi mở lại: banner Trang chủ hiện NGAY tên chương trình (nếu quán đang có chương trình), không nháy câu "Hôm nay bạn muốn uống gì?".
3. Ưu đãi, Hồ sơ, Đăng nhập trông như cũ. (4) Máy tính đang tắt hiệu ứng Windows vẫn thấy vệt sáng chạy ở Trang chủ và dải Menu.

## Cổng
- `node tu_chay/cong.js tinh . 8c67ae6^ HEAD viec/KH-ND-3c` (trước khi ghi dòng HEAD ĐÃ KIỂM): chỉ còn `✗ [A19]` (thiếu dòng HEAD ĐÃ KIỂM).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 8c67ae6^ HEAD viec/KH-ND-3c` (HEAD `9ce1f75`, cây sạch): `✓ CỔNG CHẠY ĐẠT` (có cảnh báo A16 không chặn: `thu_KHXEM1.js` chạy trên gốc in 1 ca vì bài dừng sớm — đúng; bằng chứng ở `bang_chung_do.txt`).

## Báo cáo 7 mục
1. **VIỆC**: KH-ND-3c — gom nội dung Ưu đãi, Tài khoản, Hồ sơ, Hỗ trợ, Đăng nhập, Mã thành viên, Trắc nghiệm về danh mục; Mã thành viên dễ quét ở quầy (POS QUET-1); nhớ chương trình trên máy (banner Trang chủ không nháy); khoá dải quảng cáo; K10 giữ dòng 0; vệt sáng luôn chạy.
2. **ĐÃ SỬA**: `src/noiDung/nd/taiKhoan.js` (252 mục) · `src/pages/{UuDai,TaiKhoan,HoSo,HoTro,DangNhap,ManQR,TracNghiem,TracNghiemLam,TracNghiemKetQua}.jsx` · `src/components/{NhanMa,TheMoi,DaiQuangCao}.jsx` · `src/{App.jsx,giaHang.js,dinhDang.js,quangCao.js}` · `src/noiDung/{dangNhap,lienHe,tracNghiemChu}.js`, `nd/trangChu.js` (chỉ 4 dòng `O_TRAC_NGHIEM`) · `src/giaoDien/{giaoDien,dai_quang_cao}.css` · `cong_cu/ha_no_chu.js`, `no_chu_cung.txt`. Nợ chữ cứng 561 → 438 (−123). 9 bài cũ sửa + 1 bài mới.
3. **BÀI THỬ**: xem mục Bài thử; so ảnh 51 cặp (48 giống hệt, 3 lệch có chủ đích = Mã thành viên).
4. **ĐÃ RÀ K4**: grep `tracNghiemChu` / `GIOI_THIEU` / `CAU_HOI` / `KET_QUA` / `DONG_TAI_KHOAN` / `O_TRAC_NGHIEM` / `THE_MOI_UU_DAI` / `LIEN_HE` / `coLienHe` / `CHU_HANG_TANG` / `CHU_KHONG_THOI_HAN` / `BUOC_*` / `dongGoi` / `VeQR` trong `src/` và `cong_cu/` — mọi nơi dùng đã chuyển hoặc có cầu đọc (`KhoiTheChat.jsx`, `TheoDoiDon.jsx`, `TrangChu.jsx` không phải sửa); mọi khoá `qr.*` của 3e không bị đụng (đổi sang `mqr.*` sau khi `kiemDanhMuc` báo trùng).
5. **CHƯA KIỂM**: quét QR thật ở quầy bằng máy tính bảng; Screen Wake Lock trên máy khách thật (iOS Safari / Android Chrome / trình duyệt Zalo — chỉ thử bằng `navigator.wakeLock` giả); vệt sáng ở Windows tắt hiệu ứng (thử bằng `reducedMotion: 'reduce'` của Chromium); trình duyệt Zalo; chữ to theo cài đặt máy; /admin chưa có nên chưa thấy viền vàng / 🔒 thật; ảnh chưa chụp: Hồ sơ đã có ngày sinh, Đăng nhập khi mã hết hạn, Trắc nghiệm kết quả có tình trạng đặc biệt, Hỗ trợ khi nhiều liên hệ khác nhau.
6. **GIT**: nhánh `viec/KH-ND-3c` đã push; không PR, không merge.
7. **BÀI HỌC**: xem mục Bài học.

## Bài học
- KHOÁ (đã làm, trong Phạm vi): `thu_KHND3c` kiểm MỌI chữ có dấu của các tệp A1 ở bản gốc còn trong danh mục (`chu_goc.json`, 243 chuỗi trích bằng @babel/parser) thay vì 28 câu mẫu — đáp lại đề xuất ở Bài học 3e ("đối chiếu macDinh MỌI khoá với bản gốc"); và mỗi khoá có chỗ gắn thật (dòng chứa khoá phải kèm `ndDau` / `<Chu>` / khoá qua prop) hoặc khai cờ + lý do. Đề xuất ngoài Phạm vi: gom hai phép này thành bài chung cho các việc ND sau (KH-ND-3d…) thay vì mỗi việc một bản.
- NGUYÊN TẮC (đề xuất K11, `KHUON_LOI.md` ngoài Phạm vi): đổi chữ viết thẳng thành `<Chu>` (thẻ `span`) có thể dính luật CSS "con cháu" của cha (`.pt-step-h span{…}` biến "Bạn là" thành viên màu) — gặp ở Trắc nghiệm, phát hiện nhờ so ảnh. Trước khi chuyển: `grep` CSS tìm `cha span` / `cha > *`; nếu có thì dùng `as="div"` + `style={{ display: 'inline' }}` hoặc `<small>` đúng thẻ cũ. Đã gặp lần trước: tách một câu thành nhiều nút chữ đổi khử răng cưa (3e) — lần này gặp lại ở "Thẻ hết hạn: …" và "Gửi lại mã sau N giây" → giữ đúng cách tách nút chữ của JSX cũ bằng `ndPhan`.
- NGUYÊN TẮC (đề xuất): bài thử không nên đọc nguồn bằng regex CHỮ trong JSX (`<div className="tt">Ngày sinh</div>`, `CHU.daLuuToast`) — vỡ mỗi lần chuyển chữ (9 bài phải sửa lần này); kiểm theo KHOÁ (`<Chu k="hs.ns.t" …>`) và để bài danh mục kiểm chữ.
- BỎ: lệnh bị người gác chặn (`sed -i`, vòng `for`, ghép `python3 … && node`, `cp -r` / `git add` thư mục, `pgrep`, `Monitor until`) — chỉ làm lại lệnh, không phải lỗi mã; bài thử có cụm TOKEN phải commit trước khi chạy (đã có trong skill). Bài thử Chromium ban đầu đỏ vì không nạp CSS (`loader '.css': 'empty'`) → ca đo kích thước dùng bó CSS như `thu_KHUI5g` (một lần, đã ghi trong bài). `kiemDanhMuc` bắt khoá `qr.aria` trùng với khoá của 3e — phép kiểm có sẵn làm đúng việc.
- Dọn `KHUON_LOI.md` / `CLAUDE.md`: không đề xuất xoá (chưa có phép kiểm thay).

## Soát độc lập (/ra-soat, vòng 1) — báo cáo của agent soát
Kết luận: **ĐẠT** (không lỗi chặn). Nghiệm thu 22/22 mục có bằng chứng, không mục thiếu. Chạy lại `thu_KHND3c` KHONG_TRINH_DUYET=1: 42 đạt (khớp). Phạm vi: 35 tệp src/cong_cu đổi đều nằm trong Phạm vi; không đụng tệp cấm.
LỖI TÌM ĐƯỢC: dòng B1 của bảng nghiệm thu ghi sai "374/390" (K1) — ĐÃ SỬA ở trên.
NGHI NGỜ (không sửa ở việc này, ghi để chat soát / việc sau quyết):
1. Bài đo "mã rộng" tính cả viền trắng 4 ô; phần ô đen thật chỉ ~58–60% bề ngang. Nếu quầy vẫn quét chậm thì tăng `78vw` (cần thử tay ở quầy).
2. `ManQR.jsx` Wake Lock: nếu `visibilitychange` bắn lại khi lời gọi `request` đầu chưa xong thì xin lần hai, lần một mất tham chiếu nên không được thả — hiếm, hậu quả màn sáng lâu hơn một chút sau khi rời màn; có thể chặn bằng cờ "đang xin".
3. `App.jsx` C1: bản nhớ chương trình không có hạn dùng — offline / `/chuong-trinh` lỗi thì banner vẫn hiện chương trình cũ (đúng phiếu). `LOAI_CT` lặp `LOAI` của `src/chuongTrinh.js` (một quy tắc một chỗ; `chuongTrinh.js` ngoài Phạm vi).
4. `gia.donVi` sửa được nhưng `GiaMon.jsx` còn `.replace('đ','')` (Phát hiện 4).
5. `TheoDoiDon.jsx:106` href `tel:${LIEN_HE.dienThoai}` không bỏ dấu cách như `HoTro.jsx` — số điền "0901 234 567" có thể gọi không được ở một số máy; nên làm sạch (Phát hiện 7, ngoài Phạm vi).
6. Ảnh: ca chưa chụp đã khai ở CHƯA KIỂM; Trang chủ 360 từng nhiễu giữa hai lần chụp (ghi ở `so_anh/ket_qua.txt`).
CHƯA SOÁT ĐƯỢC: không chạy lại phần Chromium, `--day-du`, cổng `chay`; không xem ảnh so_anh; không đọc từng dòng 252 mục; máy thật (quét QR, Wake Lock, Zalo, /admin).
BÀI HỌC của soát: số đo giao diện phải lấy từ kết quả chạy in ra, không viết tay; đo độ to mã QR nên tách ô đen khỏi viền trắng; khi mở khoá một chữ máy thành sửa được phải rà mọi `replace` bằng chữ cứng đó (kể cả tệp ngoài Phạm vi) và giao người nhận việc; giữ `chu_goc.json` làm khuôn cho các việc ND sau.

HEAD ĐÃ KIỂM: 9ce1f75
