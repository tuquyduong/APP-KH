# KH-ND-3e — Gom nội dung về danh mục: Thanh toán, Theo dõi đơn, Đơn hàng, PIN, thẻ QR trả tiền, báo đơn xong

<!-- Chat App KH soạn 11.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 14.11. Mở trên main SAU KHI KH-ND-3a đã gộp (nền nd() + K10, CLAUDE.md §11).
     Chạy SONG SONG với KH-UI-5g, KH-ND-3b, KH-UI-5f — mỗi việc một nhóm tệp riêng. Tệp nhóm `src/noiDung/nd/donHang.js` (mảng `DON_HANG`, đang rỗng) và dòng của nó trong
     `src/noiDung/nd/index.js` chat ĐÃ tạo sẵn trên main → việc này CHỈ điền `donHang.js`, KHÔNG sửa `index.js`.
     Làm đúng khuôn KH-ND-3a (đọc `viec/KH-ND-3a/phieu.md` + `trang_thai.md` mục Phát hiện / Bài học, CLAUDE.md §11). Đây là màn TIỀN: chuyển chữ, KHÔNG đổi một dòng logic
     tính / gửi đơn / trả tiền. Đọc CLAUDE.md §4, §5, §11. -->

## Mục tiêu
Mọi chữ / ảnh / nút khách thấy ở Thanh toán, Theo dõi đơn, Đơn hàng, bảng PIN, thẻ QR trả tiền, thông báo đơn xong có khoá trong danh mục và đọc qua `nd()` — để /admin sửa được.
Khách KHÔNG thấy gì khác; cách đặt đơn và trả tiền không đổi.

## Nghiệm thu

### A. Chuyển nội dung (không đổi gì khách thấy)
- A1 Chuyển HẾT chữ / ảnh / nút viết thẳng (đúng khuôn mục KH-ND-3a, `macDinh` = chữ đang chạy, chép nguyên; câu có số dùng `{bien}`) của:
  `src/pages/ThanhToan.jsx`, `src/pages/TheoDoiDon.jsx`, `src/pages/Don.jsx`, `src/components/PinSheet.jsx`, `src/components/TheQR.jsx`, `src/components/BaoDonXong.jsx`,
  `src/components/HoaDonKhach.jsx`, `src/components/TrangTai.jsx`, `src/baoDonXong.js`, `src/datDon.js` (CHỈ chữ khách đọc — tên trạng thái, câu báo; không đụng logic).
  Tất cả mục vào `src/noiDung/nd/donHang.js` (`man`: "Thanh toán" · "Theo dõi đơn" · "Đơn hàng" · "Bảng PIN" · "Khung chung" tuỳ chỗ hiện).
- A2 Ranh giới (CLAUDE.md §11): số tiền, giá, giảm, điểm, mã đơn, số hoá đơn, giờ, `thong_bao_tien_ve`, `ly_do` và mọi câu POS trả cho khách đọc nguyên văn → mục khoá `pos`
  + `data-nd-khoa`; tổng tiền App tự cộng hiển thị → mục khoá `tutinh`. Chữ khung quanh chúng ("Tổng cộng", "Trả bằng ví", "Đơn của bạn đang…") → mục sửa được.
- A3 Câu báo lỗi theo mã (`PIN_SAI`, `VI_KHONG_DU`, `CACH_KHONG_KHOP`, `KHOA_GUI_SAI`…) mà App tự viết → mục `loi.<MÃ>` (dùng chung kiểu `loi.*` của khung chung); lời POS gửi kèm
  `code` vẫn hiện nguyên (như `loiTheoCode`).
- A4 Khách thấy Y HỆT: so ảnh Thanh toán (ví đủ / ví + QR / QR), bảng PIN, Theo dõi đơn (chờ trả QR / đang làm / xong), Đơn hàng (danh sách + chi tiết một đơn có giảm), thông báo
  đơn xong ở 360 / 390 / 430 trước và sau: 0 điểm ảnh khác ngoài vùng nhiễu (đếm ngược QR) → `viec/KH-ND-3e/so_anh/`. Giữ cách tách nút chữ (`ndPhan`).

### B. Kiểm
- B1 Bài MỚI `cong_cu/thu_KHND3e.js` (chạy cả `KHONG_TRINH_DUYET=1`): `kiemDanhMuc` toàn bộ danh mục 0 lỗi; các tệp A1 đếm chữ cứng = 0 (liệt kê ngoại lệ nếu có — chữ máy cần);
  mọi khoá dùng có trong danh mục; `git diff` gốc → nhánh ở `src/datDon.js` chỉ đổi dòng có chữ (đọc nguồn: không đổi tên hàm / phép tính / lời gọi `api.js`).
  Chromium: bản giả đổi 3 khoá (chữ nút đặt đơn, một câu Theo dõi đơn, một câu bảng PIN) qua `datBanNoiDung` → màn đổi theo; bản rỗng → như cũ; có `data-nd` / `data-nd-khoa`;
  đặt một đơn giả (máy POS giả của bài thử cũ) vẫn qua đủ các bước như trước.
- B2 Bài thử cũ đỏ vì chữ đã chuyển chỗ → sửa cho tìm đúng chỗ mới (không đổi điều canh, không bớt ca); mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`;
  KHÔNG dùng `## Bài thử cũ sửa`.
- B3 `doi_chieu_demo.md`: bảng khoá App ↔ khoá demo của các màn (khoá demo có mà App chưa có khối → "chưa có khối").
- B4 K10: tệp A1 giảm → `node cong_cu/ha_no_chu.js`; không tệp nào tăng. `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi `trang_thai.md` + dòng
  `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- B5 Báo cáo: số khoá thêm (theo loại), số nợ đầu / sau, tệp còn nợ.

## Phạm vi
- viec/KH-ND-3e/**
- src/noiDung/nd/donHang.js
- src/pages/ThanhToan.jsx
- src/pages/TheoDoiDon.jsx
- src/pages/Don.jsx
- src/components/PinSheet.jsx
- src/components/TheQR.jsx
- src/components/BaoDonXong.jsx
- src/components/HoaDonKhach.jsx
- src/components/TrangTai.jsx
- src/baoDonXong.js
- src/datDon.js
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHND3e.js
- cong_cu/thu_*.js

## Ngân sách
~300 dòng danh mục + ~250 dòng đổi ở màn + ~250 dòng thử. **Phương án đơn giản nhất đã xét:** dùng nguyên khuôn KH-ND-3a, chỉ thay chữ, không chạm logic tiền. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG đổi logic tính tiền, gửi đơn, khoá gửi, PIN, QR, thăm dò trạng thái — chỉ thay chữ viết thẳng bằng `nd()`. Không đổi thứ tự / điều kiện hiện của bất kỳ khối nào.
- KHÔNG sửa `src/noiDung/nd/index.js`, `src/noiDung/nd.js`, `src/noiDung/nd/khungChung.js`, `src/noiDung/nd/trangChu.js`, tệp nhóm của việc khác (`menu.js`, `taiKhoan.js`,
  `keHoach.js`, `tienIch.js`). Không thêm mã vào `DICH` — cần thì ghi `## Câu hỏi`.
- KHÔNG sửa `src/api.js`, `src/App.jsx`, `src/dinhDang.js`, `src/pages/GioHang.jsx`, `src/pages/Menu.jsx`, `src/pages/TrangMon.jsx` (KH-ND-3b), `src/pages/ManQR.jsx` (KH-ND-3c),
  trang / component Kế hoạch, tiện ích, `src/main.jsx`, `public/**`, `index.html`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`
  (KH-ND-3b đang vá), `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- Tệp nhóm chỉ `import` dữ liệu không kéo theo `src/dinhDang.js` (vòng nạp — bài học KH-ND-3a).
- KHÔNG gọi mạng mới, KHÔNG đổi màu / phông / bố cục, KHÔNG viết lại câu chữ.
- Chỉ push `git push -u origin viec/KH-ND-3e`. Không đụng `main`, không merge, không tạo PR.
