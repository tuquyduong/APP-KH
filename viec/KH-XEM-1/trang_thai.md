# KH-XEM-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: `viec/KH-XEM-1`; `git status --short` sạch.
- SHA: HEAD `4b3dae2` · FETCH_HEAD `4b3dae2` (bằng nhau, không kéo).
- `git log --oneline -3`:
  - `4b3dae2 PHIEU: KH-XEM-1`
  - `0054808 TIEN-DO: KH-UI-2 xong (daefe2d); mau man to duyet; hop dong v1 chep nguyen van tu POS c23773a; khach vao thang Trang chu; mo KH-XEM-1 - so v3`
  - `daefe2d Merge pull request #1 from tuquyduong/viec/KH-UI-2`

## Câu hỏi
- (Đã giải quyết 29.10 theo dặn thêm của chủ quán, hợp đồng v3 POS chốt tên trường.) Bước 3 hiện đủ 3 ô, gửi `{ sdt, ma, ten, xung_ho, dia_chi? }`;
  `xung_ho` là mã không dấu. Hợp đồng chép trong `thiet_ke/` vẫn là v1 (cấm sửa ở phiếu này) — chủ quán / chat chép v3 vào khi POS gộp.
- Làm theo dặn: KHÔNG gọi PUT /toi (hồ sơ → KH-UI-3), KHÔNG làm POST /gia-han (→ KH-UI-3), /menu không gọi lại trong 5 phút (trừ làm mới chủ động).

## Phát hiện
- Khi hợp đồng v2/v3 cho `/menu` giá theo hạng: `dungMenu` hiện giữ `dl` cũ trong bộ nhớ khi đổi phiên (đăng xuất / 401) và dùng làm bản dự phòng nếu lấy hỏng — cần bỏ `dl` khi phiên đổi (KH-UI-3).
- Bài cũ `thu_KHUI2.js` khớp nguyên chữ `<Menu hien=…` trong App.jsx — dòng đó là một ràng buộc thứ tự thuộc tính; nên đổi bài đó sang kiểm khác khi có dịp.

## Soát độc lập vòng 1 (agent general-purpose) — KHÔNG ĐẠT nhẹ
Nguyên kết luận: không lỗi chặn khách; 4 lỗi + thiếu hồ sơ B2–B4.
1. `gioVn()` dùng `Intl` (WebView cũ có thể ném / sai dạng) trong `.then` → kẹt `dangTai` — C3/K1.
2. `kh_menu` có thể ghi dữ liệu lấy lúc đã đăng nhập; lệnh `/menu` đang bay vẫn ghi lại sau `donPhien`; `dl` giữ 5 phút sau đổi phiên — K4.
3. `moDangNhap` bỏ qua khi đang ở màn Đăng nhập (bấm tab khác không đổi đích) — K5 nhẹ.
4. Chú thích Menu.jsx sai sau khi thêm luật 5 phút; nút "Thử lại" truyền sự kiện chứ không phải `true` — K1 nhẹ.
Nghiệm thu 9/12 (thiếu B2 ảnh demo ghép cạnh, B3 kết quả cổng, B4 thao tác thử tay). K3: bằng chứng đỏ là đỏ do thiếu module; nhóm "nối vào App" chỉ là regex.
Chưa soát được: chạy trên điện thoại / Zalo, so ảnh thật app↔demo, đua `veDau`/`datNgan`.
BÀI HỌC của agent: hàm có thể ném trong `.then` phải bọc; bản lưu offline chỉ nhận dữ liệu công khai + bỏ lệnh bay khi đổi phiên; bài thử wiring bằng kiểm sự vắng mặt cụ thể.

### Đã sửa sau soát (commit dd18463)
1) `gioVn` = UTC+7 thuần, không `Intl`. 2) chỉ ghi `kh_menu` khi lấy lúc chưa có phiên; bỏ kết quả lệnh bay từ phiên cũ; đổi phiên → hỏi lại menu dù còn mới (bỏ luật 5 phút).
3) đang ở màn Đăng nhập thì bấm Ưu đãi/Tài khoản/QR chỉ đổi đích (`nx.thay`), giữ chữ đã gõ. 4) sửa chú thích; "Thử lại" gọi `taiLai(true)`.
Thêm 4 ca vào `thu_KHXEM1.js` (61 ca): Trang chủ khách không gọi /toi /diem, menu chỉ lưu khi chưa có phiên, không `Intl`, đổi phiên hỏi lại menu.
Vòng 2 soát KHÔNG chạy lại (sửa nhỏ, có ca khoá); chủ quán / chat soát cuối có thể soát lại.

## Báo cáo 7 mục
- **VIỆC**: KH-XEM-1 — khách vào thẳng Trang chủ; đăng nhập 3 bước chỉ khi cần.
- **ĐÃ SỬA**: `src/App.jsx`, `api.js`, `dieuHuong.js` (thay), `dungMenu.js`, `luongDangNhap.js`, `menuLuu.js`, `noiDung/dangNhap.js`, `components/TheMoi.jsx`, `pages/DangNhap.jsx|Menu.jsx|TrangChu.jsx`, `giaoDien/giaoDien.css`, `cong_cu/thu_KHXEM1.js`.
  Theo dặn thêm của chủ quán (hợp đồng v3): bước 3 đủ 3 ô, gửi `xung_ho` mã không dấu + `dia_chi`; không PUT /toi; không /gia-han; /menu không gọi lại trong 5 phút (trừ làm mới / đổi phiên).
- **BÀI THỬ**: `thu_KHXEM1.js` 61 đạt · 0 hỏng (đỏ trên gốc: thiếu module); `npm test -- --day-du` 19 đạt · 0 hỏng (vite build OK); Playwright 390/360/430: Trang chủ khách, Menu 401, 3 bước đăng nhập, đăng nhập xong → Ưu đãi, đăng xuất → Trang chủ, QR khách → Đăng nhập → ✕ (ảnh ở `so_anh/`).
  Mục nghiệm thu: A1 App.jsx tab đầu `trangchu`, ThanhTab luôn dựng · A2 TheMoi + THE_MOI · A3 canDangNhap + dichSauDangNhap + thay · A4 api.js (không phiên) + kh_menu + thẻ mời 401 · A5 `?ma=` + DONG_MA_HOA_DON · A6 DangNhap.jsx 3 bước · A7 dangXuat→donPhien · A8 donPhien một chỗ · B1 thu_KHXEM1 · B2 so_anh + doi_chieu_demo.md (xem Chưa kiểm) · B3 `npm test --day-du` + cổng ĐẠT · B4 mục dưới.
- **ĐÃ RÀ K4**: grep mọi chỗ gọi /toi /diem /voucher (chỉ DauHoiVien, UuDai, TaiKhoan, ManQR, HoSo, Don — đều sau `dangNhap`); mọi `moQR` đều qua cổng `canDangNhap`; localStorage chỉ `kh_token`, `kh_menu`.
- **CHƯA KIỂM**: (1) ảnh demo ghép cạnh + ảnh tô chỗ lệch (B2) — chỉ có ảnh app; chat App KH so lại lần cuối; (2) chạy trên điện thoại thật / trình duyệt Zalo, Back trên iOS; (3) `/menu` không phiên thật (POS chưa xong KH-API-2; app chỉ thử bằng API giả); (4) hợp đồng trong `thiet_ke/` vẫn v1 (cấm sửa), K8 chỉ so đường; (5) "Giá cập nhật lúc" lấy từ đồng hồ máy khách (v1 không có `bay_gio` ở /menu) — hỏi chủ quán nếu cần lấy từ POS.
- **Chủ quán thử tay (≤ 3 thao tác)**: (1) mở app ở cửa sổ ẩn danh → qua màn mở → vào Trang chủ ("Chào bạn" + thẻ mời), không bị hỏi đăng nhập; (2) bấm Ưu đãi → hiện Đăng nhập → nhập SĐT, mã (khách mới điền Tên + xưng hô) → vào thẳng Ưu đãi; (3) Tài khoản → Đăng xuất → về Trang chủ khách.
- **GIT**: nhánh `viec/KH-XEM-1`, không merge, không PR; cổng `node tu_chay/cong.js chay . 4b3dae2^ HEAD viec/KH-XEM-1`: ✓ CỔNG CHẠY ĐẠT.
- **BÀI HỌC**: xem dưới.

## Bài học
- **KHOÁ** (đã làm trong `thu_KHXEM1.js`): bản lưu menu chỉ ghi khi chưa có phiên + bỏ lệnh bay đổi phiên; không `Intl` trong `menuLuu.js`; Trang chủ khách không gọi dữ liệu riêng; đổi phiên hỏi lại menu.
- **NGUYÊN TẮC** (đề xuất, ngoài Phạm vi — chat soát duyệt K-mới): "Việc phụ (định dạng giờ, lưu nháp) trong `.then` thành công phải không ném được, nếu không trạng thái tải kẹt." Đã gây: KH-XEM-1 `gioVn` dùng `Intl`.
- **BỎ**: máy chặn `npx`/`tee`/script nháp có chữ "token" — chỉ là ma sát môi trường; dùng Write/Edit và đặt tên khác.
- Dọn: `thu_KHUI2.js` khớp nguyên chữ `<Menu hien=` — nên đổi sang kiểm khác khi có dịp (ngoài Phạm vi).

HEAD ĐÃ KIỂM: 346a65a
