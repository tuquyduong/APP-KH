# KH-ND-3c — Gom nội dung về danh mục: Ưu đãi, Tài khoản, Hồ sơ, Hỗ trợ, Đăng nhập, Mã thành viên, Trắc nghiệm + mã QR dễ quét ở quầy + vệt sáng luôn chạy + vài sửa nhỏ sau KH-UI-5g

<!-- Chat App KH soạn 12.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 14.11. Mở trên main SAU KHI KH-UI-5g, KH-ND-3e, KH-ND-3b đã gộp (main 342b3ea).
     Chạy SONG SONG được với KH-UI-5f (đang gỡ khoá Chu kỳ — tệp riêng). Tệp nhóm `src/noiDung/nd/taiKhoan.js` (mảng `TAI_KHOAN`, đang rỗng) đã có sẵn trong
     `src/noiDung/nd/index.js` → việc này CHỈ điền `taiKhoan.js`, KHÔNG sửa `index.js`.
     Làm đúng khuôn KH-ND-3a / 3b / 3e (đọc `viec/KH-ND-3a/phieu.md`, `viec/KH-ND-3b/trang_thai.md` + `viec/KH-ND-3e/trang_thai.md` mục Phát hiện / Bài học, CLAUDE.md §11 — có luật
     "Thêm gì cũng phải sửa được ở /admin").
     Thêm ở việc này (chủ quán / POS 11.11):
       · POS QUET-1 (trước khai trương): quầy quét mã QR trên điện thoại khách bằng camera trước của màn khách (máy tính bảng) → màn Mã thành viên phải dễ quét. Trình duyệt KHÔNG cho
         trang web tự tăng độ sáng — App làm mã to, nền trắng, viền trắng đủ rộng, giữ màn không tắt, nhắc khách tăng độ sáng.
       · Chat soát cuối KH-UI-5g: banner Trang chủ có thể nháy chữ mặc định ~nửa giây trước khi /chuong-trinh về; dải quảng cáo gắn `data-nd="qc.pos"` cả cho câu App tự viết.
       · Phát hiện KH-ND-3a: HoSo.jsx còn so `dau === 'Chào'` (phải dùng `coBuoi` — PHẢI xong trước KH-ADMIN-1); TheMoi ở Ưu đãi còn ảnh mặc định riêng; `O_TRAC_NGHIEM`.
       · Chat soát cuối KH-ND-3b: KhongTimThay nhận 2 chữ viết thẳng từ App.jsx; xung đột `cong_cu/no_chu_cung.txt` khi hai việc cùng xoá dòng kề nhau.
     Đọc CLAUDE.md §4, §5, §8, §11. -->

## Mục tiêu
Mọi chữ / ảnh / nút khách thấy ở Ưu đãi, Tài khoản, Hồ sơ, Hỗ trợ, Đăng nhập, Mã thành viên, Trắc nghiệm có khoá trong danh mục và đọc qua `nd()` — để /admin sửa được; khách thấy
y hệt (trừ màn Mã thành viên theo mục B). Quầy quét mã thành viên trên điện thoại khách nhanh, không phải thử nhiều lần.

## Nghiệm thu

### A. Chuyển nội dung (không đổi gì khách thấy)
- A1 Chuyển HẾT chữ / ảnh / nút viết thẳng (khuôn mục KH-ND-3a, `macDinh` = chữ đang chạy, chép nguyên, câu có số dùng `{bien}`, giữ cách tách nút chữ `ndPhan`) của:
  `src/pages/UuDai.jsx`, `src/pages/TaiKhoan.jsx`, `src/pages/HoSo.jsx`, `src/pages/HoTro.jsx`, `src/pages/DangNhap.jsx`, `src/pages/ManQR.jsx`, `src/pages/TracNghiem.jsx`,
  `src/pages/TracNghiemLam.jsx`, `src/pages/TracNghiemKetQua.jsx`, `src/components/NhanMa.jsx`, `src/components/TheMoi.jsx`, `src/giaHang.js` (3 chuỗi của Ưu đãi),
  `src/dinhDang.js` (phần còn lại: "đ", "giảm …"), `src/App.jsx` (chữ còn lại + 2 chữ truyền cho `KhongTimThay` — để `KhongTimThay` tự đọc khoá của nó),
  `src/noiDung/dangNhap.js` (chữ màn Đăng nhập / Đăng ký / thẻ mời Ưu đãi — KHÔNG đổi mã xưng hô `XUNG_HO`, phần xưng hô là mục khoá `tutinh`),
  `src/noiDung/lienHe.js` (điện thoại / Zalo / email Hỗ trợ: mục sửa được, macDinh rỗng như hiện nay — trống thì mục Hỗ trợ vẫn ẩn), `src/noiDung/tracNghiemChu.js`
  (`O_TRAC_NGHIEM` chuyển HẲN vào danh mục; `src/noiDung/nd/trangChu.js` chỉ đổi dòng import / macDinh tương ứng, không đổi khoá).
  Mục vào `src/noiDung/nd/taiKhoan.js` (`man`: "Ưu đãi" · "Tài khoản" · "Hồ sơ" · "Hỗ trợ" · "Đăng nhập" · "Mã thành viên" · "Trắc nghiệm"). Phần POS (điểm, hạng, ví, voucher, mã,
  lịch sử, SĐT, tên khách) → mục khoá `pos` + `data-nd-khoa`.
- A2 **Trắc nghiệm — nội dung chuyên môn KHOÁ** (CLAUDE.md §11): câu hỏi, cách chấm, 9 thể, lời khuyên do `src/tracNghiem.js` / `tracNghiem.json` / `tracNghiemMenu.json` sinh ra
  KHÔNG chuyển, KHÔNG sửa (giữ số nợ của `src/tracNghiem.js`); chỗ hiện các chữ đó gắn mục khoá (`khoaBoi: 'tutinh'`, `chiDuong`: "Nội dung chuyên môn — thay bằng bản trắc
  nghiệm mới"). Chữ khung màn (tiêu đề, nút, tiến trình, lời mời chia sẻ…) → mục sửa được.
- A3 `TheMoi` (thẻ mời đăng nhập dùng chung Trang chủ + Ưu đãi): Ưu đãi truyền ảnh + khoá của nó (không còn ảnh mặc định riêng trong component).
- A4 Lời chào ở Hồ sơ dùng `coBuoi` của `chiaLoiChao` (bỏ so `dau === 'Chào'`) — đổi chữ `chao.dau` ở /admin vẫn đặt đúng dấu phẩy (ca thử).
- A5 Khách thấy Y HỆT: so ảnh Ưu đãi (chưa / đã đăng nhập, có voucher), Tài khoản, Hồ sơ, Hỗ trợ (có liên hệ giả), Đăng nhập 3 bước, Trắc nghiệm (giới thiệu, một câu, kết quả)
  ở 360 / 390 / 430 trước và sau: 0 điểm ảnh khác (khoá hoạt ảnh như KH-ND-3e) → `viec/KH-ND-3c/so_anh/`. Màn Mã thành viên so theo mục B.

### B. Mã thành viên dễ quét ở quầy (POS QUET-1)
- B1 `src/pages/ManQR.jsx`: mã QR to gần hết bề ngang (vd `min(78vw, 320px)`), nằm trên thẻ NỀN TRẮNG (kể cả giao diện tối), viền trắng quanh mã ≥ 4 ô mã (hiện 2 — CHỈ màn này;
  `VeQR` nhận độ rộng viền qua tham số, nơi khác dùng giữ nguyên), nét đen đặc `crispEdges`.
- B2 Giữ màn không tắt khi đang mở Mã thành viên: Screen Wake Lock (`navigator.wakeLock.request('screen')`) nếu trình duyệt có; xin lại khi quay lại tab; thả khi rời màn. Không có
  thì thôi (không báo lỗi).
- B3 Dòng nhắc dưới mã: "Tăng độ sáng màn hình để quầy quét nhanh" (mục danh mục); giữ dòng "Đưa mã này cho nhân viên quầy" + SĐT che.
- B4 Ảnh 360 / 390 / 430 màn Mã thành viên trước / sau; `doi_chieu_demo.md` ghi khác (demo chưa có màn này).

### C. Sửa nhỏ sau KH-UI-5g / 3b (chat soát cuối 12.11)
- C1 Banner Trang chủ không nháy chữ mặc định: App nhớ danh sách chương trình lần gần nhất trên máy (khoá `kh_chuong_trinh`, chỉ `{ ma, ten, moTa, loai }` — thông tin công khai,
  không phải dữ liệu riêng của khách; đọc hỏng → rỗng) → lần mở sau `chonQuangCao` có ngay chương trình; `/chuong-trinh` về thì thay bằng bản mới (hết chương trình → bỏ).
- C2 Dải quảng cáo gắn `data-nd` ĐÚNG khoá của dòng đang hiện: câu App tự viết (Giờ vàng, chương trình) → `qc.dai.gv` / `qc.dai.ct`; chữ POS → `qc.pos` (mục khoá). Lấy khoá
  từ kết quả `chonQuangCao` (một nguồn, như banner).
- C3 `cong_cu/ha_no_chu.js`: tệp đã hết chữ cứng thì GIỮ dòng với số 0 (không xoá dòng) — để hai việc song song cùng hạ tệp kề nhau không xung đột khi gộp (bài học gộp KH-ND-3b);
  K10 nhận dòng số 0. Ca thử: hạ về 0 giữ dòng; K10 xanh với dòng 0.
- C4 **Vệt sáng LUÔN chạy** (chủ quán 12.11, kể cả máy khách bật "giảm chuyển động" — máy tính chủ quán đang bật nên không thấy vệt sáng): trong `src/giaoDien/giaoDien.css`
  (KHÔNG sửa `demo_*.css`) thêm luật ghi đè `@media (prefers-reduced-motion: reduce)` cho `.fx-a` (`sweepP`) và `.fx-a::before` (`sweepL`), `!important`, cùng nhịp `var(--dur)` —
  banner Trang chủ + dải các trang chạy như máy thường. Hiệu ứng khác (màn mở, khung tải…) vẫn theo cài đặt máy. Sửa ca A2 "reduce → animation-name none" của
  `cong_cu/thu_KHUI5g.js` theo hành vi mới (reduce → vẫn `sweepP`, `--p` đổi giữa hai lần đọc) — ca đỏ trên gốc; sửa chú thích đầu `src/giaoDien/dai_quang_cao.css`.

### D. Kiểm
- D1 Bài MỚI `cong_cu/thu_KHND3c.js` (chạy cả `KHONG_TRINH_DUYET=1`): `kiemDanhMuc` toàn bộ danh mục 0 lỗi; tệp A1 đếm chữ cứng = 0 (trừ `src/tracNghiem.js` giữ nguyên — A2);
  mọi khoá dùng có trong danh mục và **mỗi khoá mới có chỗ `data-nd` / `<Chu>` trong mã** (khoá cố ý không gắn thì khai cờ + lý do — bài học KH-ND-3b); HoSo không còn `=== 'Chào'`;
  C1 (đọc / ghi / hỏng → rỗng), C2 (khoá theo loại dòng), C3. Chromium: bản giả đổi 3 khoá (một chữ Ưu đãi, một nút Đăng nhập, một chữ Hồ sơ) qua `datBanNoiDung` → màn đổi; bản rỗng
  → như cũ; Mã thành viên: mã rộng ≥ 70% bề ngang ở 390, nền thẻ trắng, viền ≥ 4 ô; có `data-nd` / `data-nd-khoa`.
- D2 Bài thử cũ đỏ vì chữ chuyển chỗ / hành vi đổi có chủ đích (B, C) → sửa đúng ca, không bớt điều canh; mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`;
  KHÔNG dùng `## Bài thử cũ sửa`.
- D3 `doi_chieu_demo.md`: bảng khoá App ↔ khoá demo các màn (khoá demo có mà App chưa có khối → "chưa có khối").
- D4 **Sửa được ở /admin** (CLAUDE.md §11): `trang_thai.md` liệt kê khoá đã thêm theo màn + số khoá theo loại. K10: tệp A1 giảm → `node cong_cu/ha_no_chu.js`; không tệp nào tăng.
  `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- D5 Chủ quán thử tay: (1) Tài khoản → Mã thành viên: mã to, nền trắng, màn không tự tắt khi để yên; (2) đóng hẳn App rồi mở lại: banner Trang chủ hiện ngay tên chương trình (không
  nháy câu mặc định); (3) Ưu đãi, Hồ sơ, Đăng nhập trông như cũ; (4) máy tính đang tắt hiệu ứng Windows vẫn thấy vệt sáng chạy ở Trang chủ và dải Menu.

## Phạm vi
- viec/KH-ND-3c/**
- src/noiDung/nd/taiKhoan.js
- src/noiDung/nd/trangChu.js
- src/noiDung/dangNhap.js
- src/noiDung/lienHe.js
- src/noiDung/tracNghiemChu.js
- src/pages/UuDai.jsx
- src/pages/TaiKhoan.jsx
- src/pages/HoSo.jsx
- src/pages/HoTro.jsx
- src/pages/DangNhap.jsx
- src/pages/ManQR.jsx
- src/pages/TracNghiem.jsx
- src/pages/TracNghiemLam.jsx
- src/pages/TracNghiemKetQua.jsx
- src/pages/KhongTimThay.jsx
- src/components/NhanMa.jsx
- src/components/TheMoi.jsx
- src/components/DaiQuangCao.jsx
- src/quangCao.js
- src/giaHang.js
- src/dinhDang.js
- src/App.jsx
- src/giaoDien/giaoDien.css
- src/giaoDien/dai_quang_cao.css
- cong_cu/ha_no_chu.js
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHND3c.js
- cong_cu/thu_*.js

## Ngân sách
~350 dòng danh mục + ~300 dòng đổi ở màn + ~60 dòng mục B + ~40 dòng mục C + ~300 dòng thử. **Phương án đơn giản nhất đã xét:** nguyên khuôn KH-ND-3a / 3b / 3e; mã QR chỉ
đổi kích thước / viền / nền ở MỘT màn + Wake Lock có sẵn của trình duyệt (không thư viện); nhớ chương trình bằng một khoá máy. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không (kho trên máy thêm khoá `kh_chuong_trinh`)

## Thư viện mới
không

## Cấm
- KHÔNG sửa `src/tracNghiem.js`, `src/noiDung/tracNghiem.json`, `src/noiDung/tracNghiemMenu.json` (chuyên môn — A2); KHÔNG đổi mã `XUNG_HO`.
- `src/App.jsx` CHỈ: chữ còn lại → `nd()`, bỏ 2 prop chữ của `KhongTimThay`, nhớ chương trình (C1). `src/quangCao.js` CHỈ trả thêm khoá dải (C2). `src/dinhDang.js` CHỈ chữ còn lại.
  `src/noiDung/nd/trangChu.js` CHỈ dòng `O_TRAC_NGHIEM`. `src/giaoDien/giaoDien.css` CHỈ lớp của màn Mã thành viên (mục B) + luật C4 — màu lấy từ demo (K9); `dai_quang_cao.css` CHỈ chú thích.
- KHÔNG sửa `src/noiDung/nd/index.js`, `src/noiDung/nd.js`, tệp nhóm của việc khác (`khungChung.js`, `menu.js`, `donHang.js`, `keHoach.js`, `tienIch.js`). Không thêm mã vào `DICH`.
- KHÔNG sửa trang / component Kế hoạch, tiện ích (KH-UI-5f, KH-ND-3d), Menu / Giỏ / Thanh toán / Theo dõi đơn, `src/api.js`, `src/luuMay.js` (trừ khi bắt buộc thêm khoá vào danh sách
  xoá — ghi `## Phát hiện`), `src/main.jsx`, `public/**`, `index.html`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js` (trừ đúng chỗ K10 nhận dòng
  số 0 nếu cần — C3), `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- Tệp nhóm chỉ `import` dữ liệu không kéo theo `src/dinhDang.js` (vòng nạp — bài học KH-ND-3a).
- KHÔNG gọi mạng mới, KHÔNG đổi màu / phông / bố cục ngoài mục B, KHÔNG viết lại câu chữ.
- Chỉ push `git push -u origin viec/KH-ND-3c`. Không đụng `main`, không merge, không tạo PR.
