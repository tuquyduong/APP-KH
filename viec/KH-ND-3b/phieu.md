# KH-ND-3b — Gom nội dung về danh mục: Menu, Trang món, Giỏ hàng + vá bộ đếm K10 cho kín

<!-- Chat App KH soạn 11.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 14.11. Mở trên main SAU KHI KH-ND-3a đã gộp (nền nd() + K10, CLAUDE.md §11).
     Chạy SONG SONG với KH-UI-5g, KH-ND-3e, KH-UI-5f — mỗi việc một nhóm tệp riêng. Tệp nhóm `src/noiDung/nd/menu.js` (mảng `MENU`, đang rỗng) và dòng của nó trong
     `src/noiDung/nd/index.js` chat ĐÃ tạo sẵn trên main → việc này CHỈ điền `menu.js`, KHÔNG sửa `index.js`.
     Làm đúng khuôn KH-ND-3a (đọc `viec/KH-ND-3a/phieu.md` + `trang_thai.md` mục Phát hiện / Bài học, CLAUDE.md §11). Đọc CLAUDE.md §4, §5, §11. -->

## Mục tiêu
Mọi chữ / ảnh / nút khách thấy ở Menu, Trang món, Giỏ hàng có khoá trong danh mục và đọc qua `nd()` — để /admin sửa được. Khách KHÔNG thấy gì khác.
Bộ đếm K10 không còn lỗ hổng đã biết.

## Nghiệm thu

### A. Chuyển nội dung (không đổi gì khách thấy)
- A1 Chuyển HẾT chữ / ảnh / nút viết thẳng (đúng khuôn mục KH-ND-3a: `{ khoa, man, ten, loai, macDinh, … }`, `macDinh` = chữ đang chạy, chép nguyên) của:
  `src/pages/Menu.jsx`, `src/pages/TrangMon.jsx`, `src/pages/GioHang.jsx`, `src/pages/MonTheoDuong.jsx`, `src/pages/KhongTimThay.jsx`,
  `src/components/MonO.jsx` (cả "Hết hàng"), `src/components/GiaMon.jsx`, `src/components/GvDem.jsx`, `src/gioVang.js` (`chuGioVang` "Còn …"), `src/giaHang.js`,
  `src/menuLoc.js`, `src/gioHoatDong.js` (câu quán đóng / mở lại — phần POS gửi là mục khoá `pos`). Tất cả mục vào `src/noiDung/nd/menu.js` (`man`: "Menu" · "Trang món" ·
  "Giỏ hàng" · "Khung chung" tuỳ chỗ hiện). Khoá theo demo (`data-cms`) nếu demo có. Phần POS (tên món, giá, size, topping, nhóm, tồn, Giờ vàng %, giờ) → mục khoá `pos` + `data-nd-khoa`.
- A2 Nhãn nhu cầu MỘT nguồn: `MonO.jsx`, `TrangMon.jsx` (và mọi chỗ còn đọc `NHU_CAU` để HIỆN chữ) đọc `ndDs('home.need')` (`nhan` để hiện, `ten` để lọc) như Trang chủ — đổi nhãn ở /admin
  thì đổi mọi nơi.
- A3 Khách thấy Y HỆT: so ảnh Menu (nhóm đầu + một nhóm có Giờ vàng), Trang món (món có size / topping, món hết hàng), Giỏ hàng (có món / rỗng / quán đóng) ở 360 / 390 / 430
  trước và sau: 0 điểm ảnh khác ngoài vùng nhiễu đã biết (đếm ngược Giờ vàng) → `viec/KH-ND-3b/so_anh/`. Giữ cách tách nút chữ (`ndPhan`) — bài học KH-ND-3a ("0 việc hôm nay ›" lệch 31 điểm).

### B. Vá bộ đếm K10 (soát KH-ND-3a vòng 2)
- B1 `cong_cu/ha_no_chu.js` đếm cả: chữ JSX có URL (`<p>Xem https://… chữ</p>` — `//` trong chữ JSX KHÔNG phải chú thích), chữ JSX có `/` ngay sau `( = ? -`
  (`<p>(/ngày) chữ</p>`), chuỗi có dấu lồng trong `${…}` của mẫu chuỗi (mỗi chuỗi lồng có dấu = 1). Vá xong đếm lại → lập lại số nợ trong `cong_cu/no_chu_cung.txt` CHỈ cho tệp đổi
  số vì bộ đếm (dự kiến `src/kehoach.js` +2) — ghi rõ trong `trang_thai.md` (đây là lần duy nhất được NÂNG số nợ, có lý do, tách commit riêng).
- B2 Ca thử trong `cong_cu/thu_KHND3a.js`: 3 dạng B1 (mỗi dạng ĐỎ trên bộ đếm cũ) + phép đối chứng bằng cách đếm thứ hai độc lập quét MỌI tệp `src` (vd `@babel/parser` đã có trong
  `node_modules` qua vite — KHÔNG thêm vào `package.json`; không có thì phép đối chứng báo rõ, không im lặng xanh): tổng hai cách lệch 0.
- B3 5 bài cũ có ca "không có chữ nợ" rỗng vì `\b` không hiểu chữ có dấu — `thu_KHXEM1.js:88`, `thu_KHUI5e.js:186`, `thu_KHUI5c.js:128`, `thu_KHUI3a.js:240`, `thu_KHUI5b.js:250`:
  bỏ `\b`, mỗi ca kèm bản giả có chữ "nợ" chứng minh ca ĐỎ được (như `thu_KHND3a.js` vòng 2).

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHND3b.js` (chạy cả `KHONG_TRINH_DUYET=1`): `kiemDanhMuc` toàn bộ danh mục 0 lỗi; các tệp A1 đếm chữ cứng = 0 (trừ chữ máy cần không phải chữ hiện —
  liệt kê); mọi khoá dùng trong các tệp A1 có trong danh mục; MonO / TrangMon không còn đọc `NHU_CAU` để hiện chữ. Chromium: bản giả đổi 3 khoá (một chữ Menu, một nút Giỏ hàng,
  một nhãn nhu cầu) qua `datBanNoiDung` → Menu / Giỏ / Trang món đổi theo; bản rỗng → như cũ; có `data-nd` / `data-nd-khoa`.
- C2 Bài thử cũ đỏ vì chữ đã chuyển chỗ → sửa cho tìm đúng chỗ mới (không đổi điều canh, không bớt ca); mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`;
  KHÔNG dùng `## Bài thử cũ sửa`. B3 cũng theo luật này.
- C3 `doi_chieu_demo.md`: bảng khoá App ↔ khoá demo của 3 màn (khoá demo có mà App chưa có khối → "chưa có khối").
- C4 K10: các tệp A1 giảm → `node cong_cu/ha_no_chu.js`; không tệp nào tăng (trừ B1 đã ghi). `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi
  `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- C5 Báo cáo: số khoá thêm (theo loại), số nợ đầu / sau, tệp còn nợ.

## Phạm vi
- viec/KH-ND-3b/**
- src/noiDung/nd/menu.js
- src/pages/Menu.jsx
- src/pages/TrangMon.jsx
- src/pages/GioHang.jsx
- src/pages/MonTheoDuong.jsx
- src/pages/KhongTimThay.jsx
- src/components/MonO.jsx
- src/components/GiaMon.jsx
- src/components/GvDem.jsx
- src/gioVang.js
- src/giaHang.js
- src/menuLoc.js
- src/gioHoatDong.js
- cong_cu/ha_no_chu.js
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHND3b.js
- cong_cu/thu_*.js

## Ngân sách
~250 dòng danh mục + ~200 dòng đổi ở màn + ~60 dòng bộ đếm + ~250 dòng thử. **Phương án đơn giản nhất đã xét:** dùng nguyên khuôn KH-ND-3a (một tệp nhóm, `nd()` / `<Chu>` / `ndPhan`),
không đổi giao diện, không viết lại câu. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `src/noiDung/nd/index.js`, `src/noiDung/nd.js`, `src/noiDung/nd/khungChung.js`, `src/noiDung/nd/trangChu.js` (KH-UI-5g đang sửa), tệp nhóm của việc khác
  (`donHang.js`, `taiKhoan.js`, `keHoach.js`, `tienIch.js`). Không thêm mã vào `DICH` — cần đích mới thì ghi `## Câu hỏi`.
- KHÔNG sửa `src/App.jsx`, `src/pages/TrangChu.jsx`, `src/components/BannerHomNay.jsx`, `src/components/DaiQuangCao.jsx`, `src/quangCao.js`, `src/dinhDang.js` (KH-UI-5g),
  `src/pages/ThanhToan.jsx`, `src/pages/TheoDoiDon.jsx`, `src/datDon.js` (KH-ND-3e), trang / component Kế hoạch, tiện ích (KH-UI-5f, KH-ND-3d), `src/api.js`, `src/main.jsx`, `public/**`,
  `index.html`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- Tệp nhóm chỉ `import` dữ liệu không kéo theo `src/dinhDang.js` (vòng nạp — bài học KH-ND-3a).
- `cong_cu/no_chu_cung.txt`: chỉ hạ bằng `ha_no_chu.js`; nâng CHỈ theo B1 (commit riêng, ghi lý do).
- KHÔNG gọi mạng mới, KHÔNG đổi màu / phông / bố cục, KHÔNG viết lại câu chữ.
- Chỉ push `git push -u origin viec/KH-ND-3b`. Không đụng `main`, không merge, không tạo PR.
