# KH-XEM-1 — kế hoạch

## Phương án
- **A (chọn)**: giữ tab + ngăn xếp màn con. Màn Đăng nhập thành màn con `{k:'dangnhap', dich}`; thêm `thay()` vào `dieuHuong.js` (thay màn trên cùng,
  để đăng nhập xong mở QR mà không chạy đua với `history.back`). Hàm thuần mới ở `src/luongDangNhap.js` + `src/menuLuu.js`; menu tải MỘT chỗ (`src/dungMenu.js`,
  App giữ, đưa xuống Trang chủ / Menu). ~6 file mới/sửa lớn, ~380 dòng app.
- B: để mỗi trang tự dò đăng nhập và tự mở màn Đăng nhập — rải điều kiện ra 5 trang, hai lần tải menu như cũ. Nhiều dòng hơn, dễ lệch. Bỏ.

## Việc
1. `luongDangNhap.js` (thuần): `canDangNhap(dich, daDN)`, `dichSauDangNhap(dich, maCho)`, `buocSauXinMa`, `buocSauLoiXacMinh`, `truongThem`, `duDieuKienHoanTat`.
2. `menuLuu.js` (thuần, kho tiêm vào): đọc/ghi/xoá `kh_menu`, `gioVn`, `chonMenu(loi, banLuu)`.
3. `noiDung/dangNhap.js`: chữ 3 bước, thẻ mời, hằng số `BAT_XUNG_HO_DIA_CHI`, `GIAY_CHO_GUI_LAI`.
4. `dungMenu.js` hook; `Menu.jsx`/`TrangChu.jsx` nhận menu từ App; `components/TheMoi.jsx` (thẻ mời dáng `points-card`).
5. `DangNhap.jsx` 3 bước, ✕; `App.jsx` bỏ chặn, khách xem được; `dieuHuong.js` thêm `thay`.
6. Bài thử `cong_cu/thu_KHXEM1.js`; so ảnh Playwright → `so_anh/`, `doi_chieu_demo.md`.

## Ca thử ↔ nghiệm thu
A1/A2 (lời chào, thẻ mời: noiDung) · A3: `canDangNhap` 4 tab + QR, `dichSauDangNhap` · A4: `chonMenu` (có dữ liệu / 401 không bản lưu / có bản lưu), đọc–ghi `kh_menu` hỏng/rỗng ·
A5: `dichSauDangNhap` với maCho, ✕ giữ maCho · A6: lời bước 2 Zalo/quầy, `buocSauXinMa`, `buocSauLoiXacMinh` (CAN_TEN, MA_HET_HAN), hằng số, `truongThem` tắt/bật ·
A7/A8: 401 → chế độ khách (`chonMenu`/`canDangNhap` + kiểm nguồn App dùng `donPhien`) · K5 đường hợp lệ: đã đăng nhập bấm tab → không bị chặn.
Song song cần canh: `donPhien` (đăng xuất + 401) một chỗ; `?ma=` còn trong bộ nhớ trang.
