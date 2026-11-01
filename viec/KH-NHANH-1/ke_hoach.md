# KH-NHANH-1 — kế hoạch

## Hiện trạng (đọc code 01.11)
- `src/dungTai.js`: mỗi màn tự gọi khi mở → khung xám. Dùng ở TaiKhoan.jsx:27–29 (toi, diem, voucher), TrangChu.jsx DauHoiVien (toi, diem),
  UuDai.jsx UuDaiToi (diem, toi) + DanhSachVoucher (voucher), HoSo.jsx (toi), ManQR.jsx (toi), ThanhToan.jsx (toi), Don.jsx (chi tiết + /don tự gọi).
- App.jsx: effect `[dangNhap]` gọi `layToi()` riêng để `doiKhach` → mở Tài khoản là /toi lần 2.
- ManDau.jsx:4–9 nhớ "đã xem" ở sessionStorage.
- UuDai TheHang: liệt kê mọi hạng của `/hang`, kể cả 0%.

## Phương án

### Phần A+D — kho dữ liệu khách
- **A (chọn)**: một file `src/duLieuKhach.js` (~90 dòng): `taoCua(ham)` dựng trên `taoKho`; mỗi cửa giữ `{ dl, luc, loi }`, một lệnh đang chờ (`cho`)
  dùng chung (A2), số phiên `phien` để bỏ kết quả của phiên cũ (D4). Bốn cửa: `cuaToi`, `cuaDiem`, `cuaVoucher` (không `?all`), `cuaDon` (trang 1).
  Hook `dungCua(cua, { that })`: mở màn → `napNeuCu` (quá 5 phút mới lấy, ngầm); `dangTai` chỉ khi chưa có dl; có dl thì giấu lỗi (A3).
  `dungLamMoiNgam(dangNhap)` ở App: hiện lại app quá 60 giây → lấy lại các kho đã có (D1); mỗi 5 phút (D2). `lamMoi([...])` cho D3; `xoaKhoKhach()` cho D4.
  Các màn đổi `dungTai(layX)` → `dungCua(cuaX)`. ~15 dòng đổi ở màn.
- **B**: sửa `dungTai` thành có bộ nhớ đệm theo hàm (Map<ham, kho>). Ít file hơn nhưng `dungTai` còn dùng cho chi tiết đơn, Thanh toán
  (F1, F2 phải lấy mới) → phải thêm cờ "không đệm" ở mọi chỗ, xoá theo phiên khó thấy. Loại.

### Phần E — bản tóm tắt trên máy
- **A (chọn)**: `src/tomTatLuu.js` (~35 dòng, hàm thuần, kho tiêm như `menuLuu.js`): `rutTomTat` chỉ giữ ten, xung_ho, hang (5 trường), so_du_vi, points + `chu`
  (dấu vết SĐT) + `luc`; `docTomTat` lọc lại khi đọc. `luuMay.js` thêm `KHOA_TOM_TAT` vào danh sách xoá + export `docChu`.
  Hiện: `duLieuKhach.napTomTat()` gieo vào kho toi / diem với cờ `tuMay` (luc = 0 → lấy mới ngay). HoSo / ManQR dùng `{ that: true }` (bỏ qua bản
  `tuMay` — cần sdt / qr / địa chỉ thật). Lịch sử điểm ẩn khi `tuMay`.
  Đăng nhập xong: DangNhap trả `khach` (có sdt) → App gọi `doiKhach(sdt)` TRƯỚC khi bật phiên → bản của khách trước bị xoá trước khi gieo.
- **B**: kho tóm tắt riêng, các màn ghép `toi.dl || tomTat`. Đổi nhiều chỗ vẽ hơn. Loại.

### Phần B — tải trước: effect `[dangNhap]` của App: `napTomTat()` + `lamMoi(tat ca)`; `doiKhach` đọc kết quả của `cuaToi.lay()` (cùng lệnh, không gọi trùng).

### Phần C — `src/ngayManDau.js` (~15 dòng): `homNayMay()` (dùng `gioVn` của menuLuu.js), `canHienManDau(daXem, homNay)`, đọc / ghi `kh_ngay_man_dau`.
ManDau: hiện khi chưa xem trong phiên (giữ khoá sessionStorage cũ) VÀ ngày đã xem ≠ hôm nay. Ghi cả hai khi vào app.
(Giữ khoá phiên: trong cùng phiên không hiện lại; các bài thử cũ đang gieo khoá phiên vẫn đúng.)

### Phần F — ThanhToan giữ `dungTai(layToi)` (gọi SAU khi mở màn, không qua kho); chờ → "Đang cập nhật số dư…", nút ví khoá (`viThieu(…, null)` ≠ 0).
### Phần G — `giaHang.hangCoGiam(ds)`: chỉ hạng `phan_tram` là số > 0; rỗng → ẩn thẻ.

## Ca thử ↔ nghiệm thu (cong_cu/thu_KHNHANH1.js)
Phần 1 (hàm thuần / đọc nguồn): A1 bốn cửa + màn không gọi api.js trực tiếp · A2 hai lệnh = một lần gọi · A3 có dl → không dangTai, lỗi giữ bản cũ, chưa có → loi ·
A3/D1 `conMoi` 5 phút / 60 giây · A4 voucher ?all và /don trang ≥ 2 vẫn gọi api · A5 không fetch ngoài api.js · D4 xoá kho + bỏ kết quả phiên cũ ·
E1 rutTomTat không sdt/qr/dia_chi · E2 KHOA_TOM_TAT trong luuMay, xoaTatCa / doiKhach khác khách xoá · E5 kho chặn không vỡ ·
C1/C2 canHienManDau + homNayMay giờ VN, ghi chú ngoại lệ · C3 kho chặn → hiện · F1 ThanhToan không đọc cuaToi / tóm tắt, chữ "Đang cập nhật số dư…" · G1/G2 hangCoGiam.
Phần 2 (Chromium, POS giả trễ 700 ms, đếm cửa; 360/390/430): như H1.
K5: vãng lai không gọi cửa token (B3); khách cũ cùng máy vẫn thấy bản lưu; giỏ vãng lai còn khi đăng nhập (bài KHMUA1 cũ).
Đường song song: 401 giữa lệnh đang chờ; đăng xuất khi lệnh đang chờ; PUT /toi trả khach → gộp vào kho (không gọi lại).

## Bài thử cũ phải đổi (đọc nguồn): thu_KHXEM1 (Trang chủ dungTai(layToi)), thu_KHUI3d B4 (UuDai cửa gọi), thu_KHLUU1 B3 (App layToi), có thể thêm — đổi ca đọc nguồn → đỏ trên gốc.

## Soát kế hoạch (agent phụ chỉ đọc, 01.11) — đã nhận
- Phạm vi: không ra ngoài. 
- Sót đã thêm vào việc: UuDai `NhanMa khiXong` → `lamMoi([diem, voucher, toi])`; App `xongDatDon` → `lamMoi([toi, don, diem])`; `LichSuDon` (Don.jsx) trang 1 đọc
  `cuaDon`, "Xem thêm" ghép trang ≥ 2 gọi thẳng `layDon`; HoSo `doi(khach)` gộp vào `cuaToi` (bỏ state `moi`); DangNhap `khiXong(r.khach)`;
  ca A1 loại trừ `KiemKhop.jsx` (trang kiểm cửa, cố ý gọi thẳng — KH-KHOP-1).
- Ca thêm: D2 (tua 5 phút), D3 đủ ba nhánh (nhận mã: /diem /voucher /toi; lưu hồ sơ: không gọi lại /toi khi POS trả khach; đặt đơn: đọc nguồn
  `xongDatDon`), B2 (đăng nhập khách B → bốn cửa được gọi), E2 401 giữ `kh_tom_tat` nhưng không hiện, E3 so `chu`, F2 đọc nguồn (TheoDoiDon/ChiTietDon không đọc kho).
- Không nhận: bỏ khoá phiên của ManDau — giữ để các bài cũ (gieo `kh_da_xem_man_dau` ở sessionStorage) không phải sửa phần trình duyệt; ca "đổi ngày"
  chạy ở trang MỚI (phiên mới) nên vẫn bắt. Gộp tomTatLuu vào luuMay — luuMay là "quy tắc xoá", tách để giữ một việc / file (như tracNghiemLuu.js).
- Đột biến VS- (H3): VS-TT-KHO (Thanh toán đọc cuaToi), VS-TOMTAT-CHU (bỏ so chu), VS-TAB-GOI (dungCua luôn lay), VS-DANGXUAT-GIU (bỏ KHOA_TOM_TAT khỏi
  danh sách xoá), VS-MANDAU-NGAY (bỏ so ngày), VS-TOMTAT-QR (rutTomTat giữ qr) + BV- tương ứng.
