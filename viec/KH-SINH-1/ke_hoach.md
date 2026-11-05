# KH-SINH-1 — kế hoạch

Đã đọc (05.11, HEAD 5f7dd67): `src/pages/HoSo.jsx`, `src/dinhDang.js`, `src/pages/TrangChu.jsx` (2 chỗ gọi `loiChao`), `src/pages/GioHang.jsx`, `src/gio.js`,
`src/App.jsx` (`Thongbao`, `themVaoGio`), `src/components/Thongbao.jsx`, `src/api.js` (`suaHoSo`, `e.code`), `src/duLieuKhach.js` (`gopToi`, `lamMoi`), `src/tomTatLuu.js`
(danh sách trắng: ten, xung_ho, hang, so_du_vi, points — KHÔNG có ngày sinh → A7 sẵn đạt, chỉ cần khoá bằng bài thử), bài thử cũ KHUI2/3b/3d/KHLUU1.

## A. Ngày sinh (HoSo.jsx)
| | Phương án A (chọn) | Phương án B |
|---|---|---|
| Ô nhập | một `<input type="date" max=hôm nay>` — giá trị đã là `YYYY-MM-DD` (không `new Date`), iPhone / Zalo hiện bộ chọn ngày gốc | 3 ô `<select>` ngày / tháng / năm (~+25 dòng, danh sách năm) |
| Dòng | ~35 dòng thẻ + 2 hàm thuần ở `dinhDang.js` (`tachNgaySinh`, `hienNgaySinh`) | ~60 dòng |
Chốt A. Hỏi lại: trạng thái `xacNhan` ngay trong thẻ (hai nút "Lưu" / "Sửa lại"), không thêm sheet. Gửi `suaHoSo({ ngay_sinh })` riêng. `dungLuu` giữ thêm `ma` (= `e.code`)
để phân biệt `NGAY_SINH_DA_CO` → `lamMoi([cuaToi])` đọc lại `/toi`, thẻ chuyển sang chế độ xem. `NGAY_SINH_SAI` → hiện nguyên lời POS, giữ ô.
"Hôm nay" cho `max`: 10 ký tự đầu `bayGio()` nếu có, không thì ngày máy (chỉ để chặn tương lai; tuổi do POS chặn).

## B. Lời chào đủ tên (dinhDang.js)
`chiaLoiChao`: `ten = String(ten||'').trim().replace(/\s+/g,' ')`; xoá `tenNgan` (grep: chỉ `chiaLoiChao` dùng; bài thử KHUI3d A2 sửa). 1 file, −2 / +1 dòng.
B2: khối chào `h1` đã có CSS sẵn; kiểm 360 px không tràn ngang bằng ca Chromium (tên 60 ký tự).
Bài cũ sửa theo hành vi mới: KHUI2 (1 ca), KHUI3b (C1/C2 hàm thuần + Chromium B1/C1/C4/…), KHUI3d (A1/A2 + Chromium), KHLUU1 (C1(f)). Chủ quán đã duyệt đổi 03.11.

## C. Nút xoá món (GioHang.jsx + gio_xoa.css)
| | Phương án A (chọn) | Phương án B |
|---|---|---|
| Hoàn tác | `GioHang` giữ state `daXoa = { dong, vitri }` + `<Thongbao>`-kiểu riêng trong chính màn giỏ (cùng lớp CSS `.toast`, portal vào `.phone`), 5 giây; không đụng App.jsx | đưa `datThongBao` kiểu nút vào App (sửa `Thongbao`, App.jsx, nhiều màn) |
| Dòng | ~25 dòng + hàm thuần `chenDong` ở `gio.js` (3 dòng) + CSS ~8 dòng | ~40 dòng, đụng nhiều màn |
Chốt A (App.jsx không sửa). Nút xoá: hình tròn nhỏ biểu tượng `close` ở GÓC TRÊN PHẢI của thẻ dòng (tuyệt đối), tách xa cụm −/+ ở phải-giữa; vùng chạm ≥ 28 px; thẻ có thêm `padding-right` để chữ không đè.
Hoàn tác chèn lại `{ma, so_luong, ghi_chu}` đúng vị trí cũ (`chenDong(gio, dong, vitri)`; nếu đã có dòng cùng mã+ghi chú thì cộng số lượng, như `themMon`). Xoá liên tiếp: thông báo mới thay thông báo cũ (hoàn tác món cuối).

## D. Ca thử ↔ nghiệm thu (`cong_cu/thu_KHSINH1.js`)
Phần 1 (hàm thuần + đọc nguồn): B1 (đủ tên, hoa/thường, gộp khoảng trắng, các luật 31.10), B3 (`tenNgan` đã xoá), A6 (`tachNgaySinh` / `hienNgaySinh`: hợp lệ, 30/02, rỗng, null, sai dạng),
A7 (`tomTatLuu` không có `ngay_sinh`), A3 (`HoSo.jsx` không gộp khoá), A8 (chú thích đầu), `chenDong`.
Phần 2 (Chromium + POS giả v9): A1/A2 (thẻ, dòng nhỏ, hộp hỏi lại, "Sửa sau"), A3 (thân PUT chỉ `{ngay_sinh}`), A4 (`NGAY_SINH_SAI`, `NGAY_SINH_DA_CO`), A5 (đã có → không ô sửa), B2 (360 px tên dài không tràn),
C1–C3 (nút xoá, Hoàn tác trả đúng vị trí / số lượng / ghi chú, "−" khi còn 1, giỏ trống).
Luồng hợp lệ không bị chặn (K5): khách đã có ngày sinh không bị hiện ô; khách chưa có vẫn đổi tên / xưng hô / địa chỉ bình thường; "−"/"+" giữ nguyên.
Đường song song cần canh: `dungLuu` dùng chung ba thẻ cũ (thêm `ma` không đổi hành vi); `gopToi` không ghi ngày sinh vào `kh_tom_tat`.
Ngoài phạm vi: không đụng.
