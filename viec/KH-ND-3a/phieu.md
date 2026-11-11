# KH-ND-3a — Nền "Nội dung sửa được": sổ khoá + danh mục + hàm `nd()` + bộ kiểm chữ cứng "chỉ được giảm" + chuyển mẫu Trang chủ / thanh tab / màn mở

<!-- Chat App KH soạn 10.11.2026. Việc THƯỜNG [Th], **Opus** (việc nền, mọi việc sau dựa vào) — chạy thẳng tới hết. Hạn 12.11. Mở trên main sau KH-UI-5e + KH-PWA-2.
     Chủ quán 10.11: "nội dung là sửa trực tiếp từ App KH, không đụng phần lấy từ POS (giá, gói…)"; "cái gì đã là code cứng thì phải chuyển đổi để sau này edit được";
     "phương án thông minh, đơn giản mà toàn diện — việc này rất quan trọng"; MỞ HẾT chữ cho chủ quán sửa (kể cả chữ nút, câu báo lỗi); /admin làm TRƯỚC khai trương;
     sửa có lưu phiên bản (quay lại được), mỗi phần có nút "Lưu", rồi "Cập nhật toàn bộ" mới đổi giao diện khách.
     Phương án đầy đủ: `thiet_ke/PHUONG_AN_NOI_DUNG_SUA_DUOC.md` (chat lưu cùng script mở việc). Luật mới: CLAUDE.md §11 (chat thêm cùng lúc).
     Rà soát 10.11 (main 443c28e): ~1.050 chuỗi tiếng Việt ở 68 tệp; `src/noiDung/` có ~14 tệp nhưng chưa có khoá; chưa có Chế độ sửa.
     Việc NÀY làm NỀN + chuyển MẪU một nhóm màn. Các nhóm màn còn lại: KH-ND-3b…3e (song song sau việc này). Chế độ sửa /admin: KH-ADMIN-1.
     Đọc CLAUDE.md §4, §5, §11. -->

## Mục tiêu
Mọi chữ / ảnh / nút trình bày cho khách có MỘT khoá, MỘT chỗ khai báo, đọc qua MỘT hàm — để /admin sau này tự sinh bảng sửa cho mọi màn mà không làm tay từng màn;
chữ cứng mới không thể lọt vào code nữa. Khách KHÔNG thấy gì khác.

## Nghiệm thu

### A. Danh mục nội dung — một khuôn cho mọi thứ
- A1 Thư mục MỚI `src/noiDung/nd/`: mỗi NHÓM MÀN một tệp (việc này: `khungChung.js` — thanh tab, màn mở, tên màn trên tab trình duyệt, câu báo lỗi chung; `trangChu.js`),
  `index.js` gộp tất cả. Mỗi tệp xuất MẢNG mục, mỗi mục:
  `{ khoa, man, ten, loai, macDinh, toiDa?, bien?, goiY?, truong?, khoaCauTruc? }`
  - `khoa`: chuỗi `<nhóm>.<tên>` duy nhất toàn App; nơi demo đã có khoá (`data-cms="t:home.needs"`, `b:home.bb`, `img:…`) thì DÙNG LẠI phần sau dấu `:` (`home.needs`).
  - `man`: tên màn tiếng Việt (để /admin nhóm theo màn); `ten`: chủ quán đọc hiểu ("Tiêu đề mục Chăm sóc theo nhu cầu").
  - `loai` ∈ `chu` (một dòng) · `doan` (nhiều dòng) · `anh` (đường dẫn + tỉ lệ `tiLe`) · `nut` ({ chu, dich } — `dich` thuộc danh sách trang đích chung, như `DESTS` demo)
    · `danhsach` (mảng mục, `truong` mô tả từng trường; `khoaCauTruc` = trường KHÔNG cho sửa vì máy cần, vd mã lọc, ngày âm) · `battat` (ẩn / hiện một khối).
  - `bien`: tên chỗ điền trong chữ (`'Gửi lại sau {giay} giây'` → `bien: ['giay']`) — /admin sau này bắt buộc giữ đủ chỗ điền.
  - `macDinh`: CHÍNH chữ / ảnh đang chạy hôm nay (chép nguyên — không viết lại câu).
- A2 Mục khoá (không cho sửa ở App) khai rõ để /admin hiện 🔒 có chỉ đường, không phải đoán: `{ khoa, man, ten, khoaBoi: 'pos' | 'tutinh' | 'khach', chiDuong }`
  (vd `{ khoa: 'home.diem', khoaBoi: 'pos', chiDuong: 'POS › Khách hàng' }`). Nhóm A (POS), B (app tự tính), C (dữ liệu khách) theo bảng ranh giới ở CLAUDE.md §11.
- A3 Hàm thuần kiểm danh mục (`kiemDanhMuc`): khoá trùng, thiếu `ten` / `loai` / `macDinh`, `bien` khai mà `macDinh` không có `{…}` (và ngược lại), `toiDa` < độ dài mặc định,
  `nut.dich` lạ, `danhsach` có trường không khai → báo lỗi rõ. Bài thử chạy hàm này trên TOÀN BỘ danh mục.

### B. Đọc nội dung — một hàm, đổi nguồn ở một chỗ
- B1 `src/noiDung/nd.js`: `nd(khoa, bien?)` → chữ (điền `{bien}`); `ndNut(khoa)` → { chu, dich }; `ndAnh(khoa)`; `ndDs(khoa)`; `ndHien(khoa)` (bật / tắt).
  Thứ tự lấy: **bản đã cập nhật** (nguồn, mặc định rỗng) → `macDinh`. Khoá không có trong danh mục → báo lỗi khi chạy thử / dev, khi chạy thật trả chuỗi rỗng (không vỡ màn).
- B2 Nguồn: `datBanNoiDung(ban)` (bản đầy đủ `{ so_ban, gia_tri: { khoa: giá trị } }`) + đăng ký nghe thay đổi; vỏ App (`src/App.jsx`, MỘT chỗ) nghe để vẽ lại khi bản mới tới.
  Giá trị sai loại / thiếu chỗ điền bắt buộc / quá `toiDa` → bỏ giá trị đó, dùng `macDinh` (một chữ hỏng không làm hỏng màn). Việc này CHƯA tải bản từ mạng (KH-ADMIN-1);
  chỉ có hàm + bài thử với bản giả.
- B3 Đánh dấu chỗ sửa: component `<Chu k="…" as="h2" />` vẽ chữ kèm `data-nd="<khoá>"`; ảnh / nút / khối dùng `{...ndDau('<khoá>')}` → `data-nd`. Mục khoá (A2) gắn `data-nd-khoa="pos|tutinh|khach"`
  trên phần tử hiển thị dữ liệu POS / tự tính ở các màn đã chuyển → Chế độ sửa sau này tự biết chỗ viền vàng / chỗ 🔒.

### C. Bộ kiểm chữ cứng "chỉ được giảm" (K10, trong `kiem_tra_truoc_khi_giao.js`)
- C1 Đếm chuỗi có chữ tiếng Việt có dấu (chuỗi trong nháy và chữ giữa thẻ JSX, BỎ chú thích) trong `src/**/*.{js,jsx}`, TRỪ `src/noiDung/**`, `src/kiemKhop/**`,
  `src/pages/KiemKhop.jsx`. Số nợ ghi ở `cong_cu/no_chu_cung.txt` — mỗi tệp nguồn MỘT dòng `<đường dẫn> <số>`, sắp theo đường dẫn, giữa hai dòng có MỘT dòng trống
  (để các việc song song sửa tệp khác nhau không đụng dòng kề nhau khi gộp).
- C2 Luật: số đếm của MỖI tệp phải BẰNG số nợ. Tăng (hoặc tệp mới có chữ cứng) → ĐỎ "chữ cứng mới ở <tệp>: dùng nd() — CLAUDE.md §11". Giảm mà chưa hạ số nợ → ĐỎ
  "đã giảm X — chạy `node cong_cu/ha_no_chu.js` để hạ số nợ". `cong_cu/ha_no_chu.js` CHỈ hạ (không bao giờ nâng; tệp đã hết chữ thì xoá dòng).
- C3 Tệp dữ liệu sự thật không phải nội dung (tên can chi, tên 24 tiết khí, tên tháng âm) được chuyển vào `src/noiDung/coDinh/` (ngoài danh mục, KHÔNG có ô sửa) — việc này
  chỉ ghi luật; việc chuyển làm ở KH-ND-3d.

### D. Chuyển mẫu (không đổi gì khách thấy)
- D1 Chuyển HẾT chữ / ảnh / nút của: `src/pages/TrangChu.jsx` (và các component chỉ Trang chủ dùng: `OKeHoach.jsx`, `OGioVang.jsx`, `BannerHomNay.jsx`, ô thẻ hội viên…),
  `src/components/ThanhTab.jsx`, `src/components/ManDau.jsx`, `src/components/Man.jsx`, tên màn trong `src/duongDan.js`, câu báo lỗi chung trong `src/dinhDang.js` (`loiTheoCode`…),
  `src/noiDung/trangChu.js`, `src/noiDung/nhuCau.js` (tên ô sửa được; tên dùng để LỌC món là `khoaCauTruc`, không đổi), `src/noiDung/thuongHieu.js`.
  Ẩn / hiện các khối Trang chủ theo demo `SECS` (`home.guide`, `home.member`, `home.cal`, `home.hb`, `home.gv`, `home.quiz`, `home.needs`, `home.feat`, `home.ref`…) — khối nào App có.
  Phần Trang chủ lấy từ POS (điểm, hạng, Giờ vàng, banner theo giờ khi có QC-APP-1, quán mở cửa) và phần tự tính (lời chào theo giờ, lịch) → mục khoá A2.
- D2 Khách thấy Y HỆT trước: ảnh Trang chủ (đã đăng nhập / chưa), thanh tab, màn mở ở 360 / 390 / 430 trước và sau khác 0 điểm ảnh (so ảnh tự động, ghi `viec/KH-ND-3a/so_anh/`).

### E. Kiểm
- E1 Bài MỚI `cong_cu/thu_KHND3a.js` (chạy cả `KHONG_TRINH_DUYET=1`): `kiemDanhMuc` trên toàn bộ danh mục (0 lỗi) + các ca lỗi giả (trùng khoá, thiếu chỗ điền, quá dài, đích lạ…);
  `nd` điền biến / thiếu biến / khoá lạ; nguồn: bản hợp lệ thay chữ, giá trị sai loại / quá dài / mất chỗ điền → về `macDinh`, bản rỗng → mặc định; đếm chữ cứng (ca giả: chữ trong
  chú thích không tính, JSX có tính, tệp noiDung không tính); `ha_no_chu.js` không bao giờ nâng; đọc nguồn: các tệp D1 không còn chữ tiếng Việt viết thẳng.
  Chromium: Trang chủ vẽ đúng với bản giả đổi 3 khoá (chữ, nút, ẩn một khối) qua `datBanNoiDung` → màn đổi theo; trả bản rỗng → về như cũ; phần tử có `data-nd`.
- E2 Bài thử cũ đổi theo nếu cần (đọc nguồn chữ cứng ở Trang chủ…) → sửa đúng ca; mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`; KHÔNG dùng `## Bài thử cũ sửa`.
- E3 `doi_chieu_demo.md`: bảng khoá App ↔ khoá demo (`data-cms`) của các màn đã chuyển — khoá nào demo có mà App chưa có khối (ghi "chưa có khối"), không bịa khối.
- E4 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- E5 Báo cáo cuối có: số khoá đã khai (theo loại), số nợ chữ cứng đầu / sau việc, danh sách tệp còn nợ nhiều nhất (để chat chia KH-ND-3b…3e).

## Phạm vi
- viec/KH-ND-3a/**
- src/noiDung/**
- src/App.jsx
- src/pages/TrangChu.jsx
- src/components/**
- src/duongDan.js
- src/dinhDang.js
- kiem_tra_truoc_khi_giao.js
- cong_cu/no_chu_cung.txt
- cong_cu/ha_no_chu.js
- cong_cu/thu_KHND3a.js
- cong_cu/thu_*.js

## Ngân sách
~350 dòng nền (danh mục + nd + kiểm + bộ đếm) + ~250 dòng chuyển mẫu + ~350 dòng thử. **Phương án đơn giản nhất đã xét:** MỘT cấu trúc mục (khoá + loại + mặc định) cho mọi loại nội dung,
mặc định chính là chữ đang chạy; bộ kiểm "chỉ được giảm" thay vì rà tay. KHÔNG làm thư viện dịch / i18n, KHÔNG đổi giao diện. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- `src/components/**` CHỈ các component Trang chủ / khung chung kể ở D1 và component MỚI `Chu.jsx`; KHÔNG sửa component của Kế hoạch / tiện ích (KH-UI-5f sắp làm), Giỏ, Thanh toán, PIN,
  Hoá đơn, Thẻ QR (KH-ND-3b…3e làm).
- `src/App.jsx` CHỈ để nghe nguồn nội dung (vẽ lại khi có bản mới); `src/duongDan.js` CHỈ thay chuỗi tên màn bằng `nd()`; `src/dinhDang.js` CHỈ chuyển chữ báo lỗi / lời chào ra danh mục
  (khung câu chào sửa được, phần buổi + xưng hô vẫn tự tính).
- Bài thử cũ (`cong_cu/thu_*.js`) CHỈ sửa khi đỏ vì nội dung đã chuyển chỗ (đọc nguồn tìm chữ cứng, đường dẫn tệp) — sửa cho tìm đúng chỗ mới, không đổi điều canh, không bớt ca.
- `kiem_tra_truoc_khi_giao.js` CHỈ thêm K10 (C1–C2); không đụng K1–K9, `DUYET_NGOAI_DEMO`, trần giờ.
- KHÔNG sửa `src/api.js`, `src/luuMay.js`, `src/datDon.js`, `src/main.jsx`, `src/dangKySW.js`, `public/**`, `index.html`, `thiet_ke/**`, các trang ngoài Phạm vi, `tu_chay/`, `.claude/`,
  `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG gọi mạng mới, KHÔNG làm Chế độ sửa / /admin (KH-ADMIN-1), KHÔNG viết lại câu chữ (chép nguyên), KHÔNG đổi màu / phông / bố cục.
- Chỉ push `git push -u origin viec/KH-ND-3a`. Không đụng `main`, không merge, không tạo PR.
