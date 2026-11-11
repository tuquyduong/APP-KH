# KH-ND-3a — kế hoạch

## Phần 1 — Danh mục (A1–A3)
- **A (chọn):** `src/noiDung/nd/khungChung.js`, `src/noiDung/nd/trangChu.js`, `src/noiDung/nd/index.js` (gộp + `DICH` trang đích), hàm `kiemDanhMuc` đặt trong `src/noiDung/nd.js`
  (cùng chỗ với luật loại giá trị — một luật một chỗ). ~200 dòng danh mục (phần lớn là dữ liệu) + ~45 dòng kiểm.
- B: mỗi tệp nội dung cũ (`trangChu.js`, `nhuCau.js`…) tự thêm `khoa` vào đối tượng sẵn có → không có khuôn chung, /admin phải hiểu từng tệp. Loại.
- `macDinh` lấy THẲNG từ hằng sẵn có khi hằng đó còn dùng ở màn khác (`KHAU_HIEU`, `NHU_CAU`, `THE_MOI`, `O_TRAC_NGHIEM`) — không chép chữ hai nơi.
  `noiDung/trangChu.js` (chỉ Trang chủ dùng) bỏ, chữ chuyển hẳn vào danh mục.
- Khoá: theo demo `data-cms` khi có (`home.needs`, `home.disc`, `home.bb`, `home.bk`, `home.gvk`, `home.qk`, `home.qh`, `home.cala`, `home.calb`, `home.sub`,
  `home.fmore`, `brand.slogan`, `today.t/s/cta/bg`, `home.banner`, `home.need`). Ẩn / hiện khối: `hien.<mã SECS>` (demo dùng chung tên `home.needs` cho chữ và khối → thêm tiền tố `hien.` để khoá duy nhất).
- Nút: `macDinh: { chu, dich }`, `DICH` = các trang Trang chủ mở được bằng hàm sẵn có (menu, giovang, tracnghiem, kehoach, uudai) — Trang chủ ánh xạ `dich` → hàm `mo…` đã có (không sửa App.jsx).
- `danhsach` nhu cầu: mỗi ô `{ ten (khoaCauTruc — lọc món), nhan (chữ hiện, sửa được), anh, bieuTuong (khoaCauTruc) }`.

## Phần 2 — nd() + nguồn (B1–B3)
- **A (chọn):** `src/noiDung/nd.js` ~90 dòng: `nd / ndNut / ndAnh / ndDs / ndHien / ndDau`, `datBanNoiDung`, `ngheNoiDung`, `phienNoiDung`, `kiemDanhMuc`, `hopLe(muc, gt)`.
  Vỏ App: `useSyncExternalStore(ngheNoiDung, phienNoiDung)` (1 dòng) + đưa vào phụ thuộc của effect tiêu đề tab. `src/components/Chu.jsx` ~6 dòng.
- B: React Context cho nội dung → phải bọc cây + mọi hàm thuần (`dinhDang`, `duongDan`) không đọc được context. Loại.
- Khoá lạ: `import.meta.env.DEV === false` (bản dựng thật) → ''; còn lại (dev, bài thử node / esbuild) → ném lỗi.

## Phần 3 — K10 (C1–C2)
- **A (chọn):** bộ đếm trong `cong_cu/ha_no_chu.js` (xuất `demChuCung`, `demTatCa`, `docNo`, `ghiNo`; chạy thẳng = hạ số nợ). `kiem_tra_truoc_khi_giao.js` thêm ~15 dòng K10 `require` tệp đó
  (bọc try: bản chép tạm của bộ kiểm trong bài SLOGAN1 không có `cong_cu/` → K10 ✗ riêng, K9 vẫn chạy). ~70 dòng.
- B: đếm bằng regex thô → đếm nhầm chữ trong chú thích / regex. Loại. Bộ đếm: tách chú thích, chuỗi ('" và `…` kể cả `${}`), regex literal; chuỗi có dấu = 1; phần code còn lại
  cắt theo `< > { }`, đoạn có chữ có dấu = 1 (chữ JSX). Nhận "có dấu" bằng NFD (dấu kết hợp) hoặc đ/Đ.
- Số nợ đầu ghi bằng script nháp (một lần — `ha_no_chu.js` chỉ hạ, không có cờ nâng).

## Phần 4 — Chuyển mẫu (D1–D2)
Tệp: TrangChu.jsx, OKeHoach, OGioVang, BannerHomNay, TheMoi, OTracNghiem, KhoaTienIch (DongKhoa), ThanhTab, ManDau, Man, duongDan (tiêu đề), dinhDang (lỗi + lời chào).
Không đổi thẻ / lớp / thứ tự → ảnh trước = sau. Phần POS / tự tính gắn `data-nd-khoa` qua mục khoá: `home.chao` (tutinh), `home.quan` (pos — giờ hoạt động), `home.hang`, `home.diem`
(pos — khách hàng), `home.gv.so` (pos — Giờ vàng), `home.lich` (tutinh), `home.mon` (pos — sản phẩm).
GvDem / gioVang.js (chữ đếm ngược) và MonO (dùng cả ở Menu) KHÔNG đụng — ngoài D1 / để KH-ND-3b.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHND3a.js`)
| Nghiệm thu | Ca |
|---|---|
| A1 | tệp `nd/khungChung.js`, `nd/trangChu.js`, `nd/index.js` có, mỗi mục đủ trường; khoá demo dùng lại (danh sách khoá demo có trong danh mục) |
| A2 | có mục khoá `pos` / `tutinh` kèm `chiDuong`; `home.diem` khoaBoi pos |
| A3 | `kiemDanhMuc(DANH_MUC)` = []; ca lỗi giả: trùng khoá, thiếu ten/loai/macDinh, bien thừa / thiếu, toiDa nhỏ, dich lạ, danhsach trường lạ, anh thiếu tiLe, khoá thiếu chiDuong |
| B1 | nd điền biến, thiếu biến giữ `{x}`, khoá lạ ném lỗi (node), ndNut/ndAnh/ndDs/ndHien trả mặc định |
| B2 | bản hợp lệ thay chữ + báo người nghe; sai loại / quá dài / mất chỗ điền / dich lạ / danhsach đổi khoaCauTruc → macDinh; bản rỗng → mặc định; phienNoiDung tăng |
| B3 | Chu dựng `<h2 data-nd>`; ndDau mục khoá → `data-nd-khoa` |
| C1–C2 | đếm: chú thích không tính, JSX tính, chuỗi `…${}` tính 1, regex có nháy không vỡ; K10 trên bản chép: bằng → ✓, thêm chữ → ✗ "chữ cứng mới", bớt → ✗ "đã giảm"; tệp noiDung không tính; định dạng no_chu_cung.txt (sắp xếp, dòng trống) |
| C2 | `ha_no_chu.js` trên bản chép: hạ đúng, tệp tăng thì KHÔNG nâng, tệp hết chữ thì xoá dòng |
| D1 | các tệp D1 đếm = 0; không còn `noiDung/trangChu.js` |
| D2 / E1 Chromium | so ảnh trước/sau 360/390/430 (công cụ nháp, ghi `so_anh/`); trong bài: bản giả đổi `home.needs` (chữ), `home.bb` (nút), `hien.home.needs` (ẩn) → màn đổi; bản rỗng → như cũ; có `[data-nd]`, `[data-nd-khoa]` |
| E2 | bài cũ đỏ vì chữ chuyển chỗ → sửa cho tìm đúng chỗ mới (ca mới đọc danh mục → đỏ trên gốc) |

Đường song song cần canh: `HoSo` dùng `chiaLoiChao` (giữ nguyên dạng trả); `MonO` / `TrangMon` dùng `NHU_CAU.ten` (giữ); `UuDai` dùng `TheMoi` (thêm thuộc tính tuỳ chọn, mặc định như cũ);
`api.js` dùng `loiTheoCode` (cùng chữ); bản chép bộ kiểm trong `thu_KHSLOGAN1` (K10 không làm sập).
K5 — luồng hợp lệ không bị chặn: bản rỗng / không có bản → mọi màn y như cũ; khoá đúng không bao giờ ném lỗi.
