# KH-ND-3c — kế hoạch

Phiếu: việc THƯỜNG (không tiền / bảo mật) → chạy thẳng, không chờ duyệt.

## Phần A — chuyển nội dung về `src/noiDung/nd/taiKhoan.js`
- **A (chọn)**: một tệp danh mục (~300–350 mục, các hàm trợ giúp `chu/nut/khoa` như `menu.js`), mỗi màn đọc qua `nd()/ndPhan()/<Chu>`/`ndDau()`. Hàm thuần (`giaHang.js`, `dinhDang.js`, `dangNhap.js`) gọi `nd()` như KH-ND-3b.
- B: tách thành nhiều tệp nhóm — bị cấm (`index.js` không được sửa), nên bỏ.
- Quy ước: `tk.*` (Tài khoản), `ud.*` (Ưu đãi), `hs.*` (Hồ sơ), `ht.*` (Hỗ trợ), `dn.*` (Đăng nhập), `qr.*` (Mã thành viên), `tn.*` (Trắc nghiệm: giới thiệu), `tnl.*` (làm bài), `tnk.*` (kết quả), `nm.*` (nhập mã), `hang.*`, `moi.*`.
- Nội dung chuyên môn (`src/tracNghiem.js`, `theChat.js`, JSON) KHÔNG đụng: chỗ hiện chúng gắn mục khoá `tutinh`.
- `O_TRAC_NGHIEM` chuyển vào danh mục; `trangChu.js` đổi `O_TRAC_NGHIEM.xxx` → chuỗi (không đổi khoá).
- `TheMoi`: Ưu đãi truyền `anh` + `khoa` riêng (A3).
- `HoSo`: dùng `coBuoi` (A4).
- Điều kiện giữ nguyên điểm ảnh: câu có số dùng `ndPhan` khi JSX cũ tách nút chữ.

## Phần B — Mã thành viên
- `VeQR` nhận tham số `bien` (mặc định 2, ManQR truyền 4); `ManQR` bọc thẻ nền trắng, mã `min(78vw,320px)`; Wake Lock trong `useEffect` (ManQR); dòng nhắc là mục danh mục.
- CSS chỉ lớp màn Mã thành viên trong `giaoDien.css`.

## Phần C
- C1 `kh_chuong_trinh` trong App.jsx (đọc khi khởi tạo state, ghi khi `/chuong-trinh` về); `luuMay.js` KHÔNG sửa (dữ liệu công khai, không xoá khi đăng xuất — đúng yêu cầu "lần mở sau có ngay").
- C2 `chonQuangCao` trả thêm `khoaDai`; `DaiQuangCao` nhận `khoa`.
- C3 `ha_no_chu.js`: `haNo` giữ dòng 0; `demTatCa` vẫn chỉ liệt kê >0 nên K10 so `dem[f]||0` với `soNo[f]` — dòng 0 khớp 0 → xanh (kiểm tra sau khi làm).
- C4 hai luật `!important` trong `giaoDien.css`; sửa ca A2 của `thu_KHUI5g.js`.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHND3c.js`)
A1 danh mục hợp lệ + macDinh = chữ cũ; tệp A1 hết chữ cứng; mọi khoá dùng có trong danh mục; mỗi khoá mới có chỗ gắn (hoặc cờ lý do) — A2 trắc nghiệm có mục khoá — A3 TheMoi — A4 HoSo hết `=== 'Chào'` + ca hàm `chiaLoiChao` — A5 so ảnh trước/sau — B1–B4 Chromium + tĩnh — C1 đọc/ghi/hỏng — C2 khoá theo loại dòng — C3 hạ về 0 giữ dòng, K10 nhận — C4 `reduce` vẫn `sweepP` (sửa `thu_KHUI5g`).
Luồng hợp lệ không được chặn (K5): đăng nhập 3 bước, nhập mã, nhận ưu đãi, hồ sơ lưu — kiểm bằng ảnh trước/sau và Chromium.

## Rủi ro
- 350 mục = nhiều chỗ chép chữ: `GOC_CHU` đối chiếu bản `git show 8c67ae6:<tệp>`.
- Vòng nạp: `taiKhoan.js` không import `dinhDang.js`.
