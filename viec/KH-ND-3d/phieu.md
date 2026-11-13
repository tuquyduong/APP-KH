# KH-ND-3d — Gom nội dung về danh mục: Kế hoạch + mọi tiện ích (lịch, Ngày cần nhớ, Theo mùa, Văn khấn, Xe cộ, Uống thuốc, Chu kỳ) + vài sửa nhỏ

<!-- Chat App KH soạn 12.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 15.11. Mở trên main SAU KHI KH-ND-3c và KH-UI-5f đã gộp.
     Tệp nhóm `src/noiDung/nd/keHoach.js` (mảng `KE_HOACH`, đang rỗng) và `src/noiDung/nd/tienIch.js` (`TIEN_ICH`, đã có mục của KH-UI-5e / 5f) đã nằm trong
     `src/noiDung/nd/index.js` → việc này CHỈ điền hai tệp đó, KHÔNG sửa `index.js`.
     Làm đúng khuôn KH-ND-3a / 3b / 3c / 3e (đọc `viec/KH-ND-3a/phieu.md`, `viec/KH-ND-3c/phieu.md` + `viec/KH-ND-3c/trang_thai.md` mục Phát hiện / Bài học,
     CLAUDE.md §11 — luật "Thêm gì cũng phải sửa được ở /admin"). Sau việc này, chữ cứng trong `src/` chỉ còn `src/tracNghiem.js` (chuyên môn, KHOÁ).
     Thêm ở việc này: chat soát cuối KH-UI-5f (link Chu kỳ với xưng hô nam), KH-ND-3c (GiaMon cắt chữ "đ", nút gọi ở Theo dõi đơn), kehoach.js gần 500 dòng.
     Đọc CLAUDE.md §4, §5, §8, §11. -->

## Mục tiêu
Mọi chữ / ảnh / nút / danh sách khách thấy ở Kế hoạch và mọi tiện ích có khoá trong danh mục và đọc qua `nd()` — để /admin sửa được (kể cả ngày lễ, lời khuyên theo mùa /
tiết khí, lễ vật, bài khấn); khách thấy Y HỆT. Phần lịch App tự tính (thứ, can chi, tiết khí, tên tháng âm) là dữ liệu cố định, khoá.

## Nghiệm thu

### A. Chuyển nội dung (không đổi gì khách thấy)
- A1 Chuyển HẾT chữ / ảnh / nút viết thẳng (khuôn KH-ND-3a: `macDinh` = chữ đang chạy, chép nguyên; câu có số dùng `{bien}`; giữ cách tách nút chữ `ndPhan`) của:
  `src/pages/KeHoach.jsx`, `src/pages/TienIch.jsx`, `src/components/BangNgay.jsx`, `src/components/BangQuaHan.jsx`, `src/components/BanhXoay.jsx`, `src/components/NguoiThan.jsx`,
  `src/components/VanKhanMan.jsx`, `src/components/DaiNhacViec.jsx`, `src/components/HoiXoa.jsx`, `src/components/BangNoi.jsx`, `src/components/KhoaTienIch.jsx`,
  `src/kehoach.js`, `src/kehoachLap.js`, `src/lich.js`, `src/vanKhan.js`. Mục màn Kế hoạch / lịch / Ngày cần nhớ / Sắp tới vào `src/noiDung/nd/keHoach.js`; mục tiện ích
  (Theo mùa, Văn khấn, Xe cộ, Uống thuốc, Chu kỳ) vào `src/noiDung/nd/tienIch.js` (giữ nguyên khoá đã có của 5e / 5f). Phần dữ liệu khách (việc, người thân, xe, thuốc, chu kỳ, tín chủ)
  là nhóm C — KHÔNG vào danh mục; phần POS → mục khoá `pos`.
- A2 **Dữ liệu chép từ demo thành mục sửa được** (bỏ `src/noiDung/keHoach.js` / `src/noiDung/vanKhan.js` dạng hằng số; `macDinh` giữ từng byte như demo — bài thử so demo đọc từ danh mục):
  - Ngày lễ dương / âm (`SOLAR_HOL`, `LUNAR_HOL`): mỗi loại MỘT mục `danhsach` `{ ngay: 'd/m', ten }` KHÔNG `khoaCauTruc` (chủ quán thêm / bớt được ngày lễ); dòng `ngay` sai dạng →
    bỏ qua khi hiện (không vỡ màn). Ngày lễ gợi ý quà (`GIFT_HOL`): mục `danhsach` `{ ten }`.
  - Theo mùa (`SS`, `SS_F`): một mục `danhsach` 4 mùa, `khoaCauTruc: ['mua']` (mùa cố định, không thêm mùa) + các trường lời khuyên; nhãn trường (`SS_F`) là mục `chu`.
  - Lời khuyên 24 tiết khí (`TERM_TIPS` ở `src/lich.js`): một mục `danhsach` `khoaCauTruc: ['tiet']`, trường `loi` (lời khuyên) + `mon` (mã món POS gợi ý, cách nhau dấu phẩy —
    mã không có trong menu thì bỏ qua như hiện nay).
  - Văn khấn 11 dịp (`VK`): mỗi dịp các mục `chu` / `doan` riêng: tên dịp, lễ vật, cách sắp lễ, **bài khấn đầy đủ** (một `doan`, các đoạn chung `VK_OPEN` / `VK_THAN` / `VK_GT` /
    `VK_TC` / `VK_END` chép vào từng bài để chủ quán sửa từng bài độc lập), `bien` = đúng các chỗ tự điền có trong bài (`{ten} {dc} {ho} {ld} {lm} {ny} {nyc} {nm}`). Phần máy cần
    (`id`, biểu tượng, cách tính ngày `kieu` / `lunar` / `gio`, `newYear`) ở lại trong code (`src/vanKhan.js`). Chạm chỗ tô màu → mở đúng ô, nhắc thiếu thông tin: giữ nguyên (ca thử 5f xanh).
    Hai dòng ghi chú (`GHI_CHU_DANH_SACH`, `GHI_CHU_BAI`) + dòng gợi ý "hoa quả, trà dâng lễ": mục `doan` / `chu`.
- A3 **Lịch cố định — KHOÁ** (nhóm B "App tự tính", CLAUDE.md §11): tên thứ (`WD`), Can, Chi, tên 24 tiết khí, tên tháng âm (`LNUM`) chuyển sang `src/noiDung/coDinh/lich.js`
  (KHÔNG thuộc danh mục, không sửa ở /admin); chỗ hiện gắn mục khoá `khoaBoi: 'tutinh'`, `chiDuong`: "Lịch âm — App tự tính".
- A4 Giữ nguyên TÊN XUẤT của `src/lich.js`, `src/kehoach.js`, `src/vanKhan.js` (nơi gọi ngoài Phạm vi như `TrangChu.jsx`, `App.jsx`, `quangCao.js` không phải sửa).
  `src/kehoach.js` (490 dòng): nếu sau khi chuyển chữ vẫn > 450 dòng → tách THEO VIỆC sang tệp mới `src/kehoach<Việc>.js` (vd phần xe / thuốc / chu kỳ), `kehoach.js` `export … from`
  lại để chỗ gọi cũ không đổi; ghi lý do trong `trang_thai.md`.
- A5 Khách thấy Y HỆT: so ảnh trước / sau ở 360 / 390 / 430: Kế hoạch (lịch tháng, bảng ngày có việc, thanh nhắc, Sắp tới), Ngày cần nhớ (danh sách, thêm người thân), Theo mùa,
  một tiết khí, Văn khấn (danh sách + một bài đã điền + một bài thiếu thông tin), Xe cộ, Uống thuốc, Chu kỳ (tắt / bật), bảng quá hạn, bánh xoay giờ: 0 điểm ảnh khác (khoá hoạt ảnh
  như KH-ND-3c; ngày cố định) → `viec/KH-ND-3d/so_anh/`.

### B. Sửa nhỏ (chat soát cuối KH-UI-5f / KH-ND-3c, 12.11)
- B1 Ô tiện ích bị ẩn thì đường dẫn của nó cũng không mở: Chu kỳ với xưng hô anh / chú / bác / ông, hoặc ô bị tắt ở /admin (`hien.ocXe`, `hien.ocThuoc`, `hien.ocChuKy`) → mở
  thẳng `/kehoach/<ô>` thì THAY bằng `/kehoach` (`thay` của `dieuHuong.js` — không thêm lịch sử, Back không kẹt). MỘT hàm quyết định "ô có hiện không" dùng chung cho lưới
  (`KeHoach.jsx`) và chỗ mở màn (`TienIch.jsx`); `App.jsx` chỉ truyền thêm cho `<TienIch>` một prop thay về `/kehoach`.
  Ca thử: xưng hô "anh" mở `/kehoach/chuky` → về `/kehoach`; "chị" → mở Chu kỳ.
- B2 `src/components/GiaMon.jsx`: bỏ `dinhDangGia(gia).replace('đ', '')` — thêm `dinhDangSoTien(n)` ở `src/dinhDang.js` (chỉ số có dấu chấm, không đơn vị) và dùng nó; đổi đơn vị
  tiền `gia.donVi` ở /admin không làm cột giá theo hạng thừa chữ. Ca thử: bản nội dung giả `gia.donVi` = " VNĐ" → cột giá hạng vẫn chỉ có số.
- B3 `src/pages/TheoDoiDon.jsx`: nút gọi quán dùng `tel:` chỉ còn số và dấu `+` (như `HoTro.jsx`) — CHỈ dòng đó.

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHND3d.js` (chạy cả `KHONG_TRINH_DUYET=1`): `kiemDanhMuc` toàn bộ danh mục 0 lỗi; mọi tệp A1 đếm chữ cứng = 0; mọi khoá dùng có trong danh mục và
  **mỗi khoá mới có chỗ `data-nd` / `<Chu>` trong mã** (khoá cố ý không gắn thì khai cờ + lý do); `macDinh` ngày lễ / theo mùa / tiết khí / văn khấn khớp từng byte với demo; bài khấn
  điền đủ chỗ (so với `dienBai` trước việc); ngày lễ sai dạng bị bỏ qua; B1, B2, B3. Chromium: bản giả đổi 4 khoá (một chữ Kế hoạch, một ngày lễ, một câu bài khấn, một nhãn Xe cộ)
  qua `datBanNoiDung` → màn đổi; bản rỗng → như cũ.
- C2 Bài thử cũ đỏ vì chữ chuyển chỗ (thu_KHUI5b so demo, thu_KHUI5c / 5d / 5e / 5f…) → sửa đúng ca (đọc từ danh mục thay cho hằng số), không bớt điều canh; mỗi bài sửa có ≥ 1 ca ĐỎ
  trên gốc kể cả `KHONG_TRINH_DUYET=1`; KHÔNG dùng `## Bài thử cũ sửa`.
- C3 `doi_chieu_demo.md`: bảng khoá App ↔ khoá demo (`data-cms`) các màn Kế hoạch / tiện ích.
- C4 **Sửa được ở /admin** (CLAUDE.md §11): `trang_thai.md` liệt kê khoá đã thêm theo màn + số khoá theo loại. K10: tệp A1 giảm → `node cong_cu/ha_no_chu.js` (giữ dòng số 0);
  không tệp nào tăng. `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng)
  TRƯỚC `/ra-soat`.
- C5 Chủ quán thử tay: (1) Kế hoạch, Ngày cần nhớ, Văn khấn, Xe cộ, Uống thuốc, Chu kỳ trông như cũ; (2) tài khoản xưng "anh" gõ `tuquyduong.com/kehoach/chuky` → về Kế hoạch.

## Phạm vi
- viec/KH-ND-3d/**
- src/noiDung/nd/keHoach.js
- src/noiDung/nd/tienIch.js
- src/noiDung/keHoach.js
- src/noiDung/vanKhan.js
- src/noiDung/coDinh/**
- src/pages/KeHoach.jsx
- src/pages/TienIch.jsx
- src/pages/TheoDoiDon.jsx
- src/App.jsx
- src/components/BangNgay.jsx
- src/components/BangQuaHan.jsx
- src/components/BanhXoay.jsx
- src/components/NguoiThan.jsx
- src/components/VanKhanMan.jsx
- src/components/DaiNhacViec.jsx
- src/components/HoiXoa.jsx
- src/components/BangNoi.jsx
- src/components/KhoaTienIch.jsx
- src/components/XeCo.jsx
- src/components/UongThuoc.jsx
- src/components/ChuKy.jsx
- src/components/OKeHoach.jsx
- src/components/dungKeHoach.js
- src/components/GiaMon.jsx
- src/kehoach*.js
- src/lich.js
- src/vanKhan.js
- src/dinhDang.js
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHND3d.js
- cong_cu/thu_*.js

## Ngân sách
~450 dòng danh mục (phần lớn là chữ demo chép sang) + ~300 dòng đổi ở màn / hàm + ~40 dòng mục B + ~350 dòng thử. **Phương án đơn giản nhất đã xét:** nguyên khuôn KH-ND-3a / 3c;
bài khấn mỗi dịp một `doan` (không ghép mảnh) để chủ quán sửa từng bài; phần máy cần của văn khấn và lịch ở lại code; một hàm "ô có hiện không". Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không (kho trên máy `kh_kehoach` giữ nguyên dạng)

## Thư viện mới
không

## Cấm
- KHÔNG sửa `src/tracNghiem.js` và nội dung trắc nghiệm (chuyên môn); KHÔNG đổi dạng dữ liệu khách trên máy (`kh_kehoach`) — bản lưu cũ phải mở như cũ.
- `src/pages/TheoDoiDon.jsx` CHỈ dòng `tel:` (B3). `src/components/GiaMon.jsx` CHỈ hàm bỏ đơn vị (B2). `src/dinhDang.js` CHỈ thêm `dinhDangSoTien`.
- KHÔNG sửa `src/noiDung/nd/index.js`, `src/noiDung/nd.js`, tệp nhóm của việc khác (`khungChung.js`, `trangChu.js`, `menu.js`, `donHang.js`, `taiKhoan.js`). Không thêm mã vào `DICH`.
- `src/App.jsx` CHỈ dòng render `<TienIch …>` (thêm prop thay về `/kehoach` — B1).
- KHÔNG sửa `src/pages/TrangChu.jsx`, `src/quangCao.js`, `src/duongDan.js`, `src/dieuHuong.js`, Menu / Giỏ / Thanh toán /
  Ưu đãi / Tài khoản, `src/api.js`, `src/luuMay.js`, `src/main.jsx`, `public/**`, `index.html`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`,
  `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- Tệp nhóm / `coDinh` chỉ `import` dữ liệu không kéo theo `src/dinhDang.js` (vòng nạp — bài học KH-ND-3a).
- KHÔNG gọi mạng mới, KHÔNG đổi màu / phông / bố cục, KHÔNG viết lại câu chữ (chép nguyên từng byte).
- Chỉ push `git push -u origin viec/KH-ND-3d`. Không đụng `main`, không merge, không tạo PR.
