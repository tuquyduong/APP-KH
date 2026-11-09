# KH-UI-5c — kế hoạch (viết lại sau khi đọc code; làm xong cùng lượt vì việc THƯỜNG, không chờ duyệt)

## Đã đọc (K1)
`src/kehoach.js` (225 dòng; kho `kh_kehoach`, `viecNgay`, `nhacHomNay`, `upList`), `src/pages/KeHoach.jsx` (163), `src/components/{ThemViec,OKeHoach,BannerNho,BannerHomNay,BaoDonXong,Thongbao,dungKeHoach}`,
`src/pages/GioHang.jsx:36-50` (`ThongBaoXoa`), `src/giaoDien/{ke_hoach,gio_xoa,bao_don}.css`, demo `.sheet/.panel/.toast/.nt-state`, demo `todayCard/todayHide` (dòng 5395-5425).

## Phương án (A = ngắn nhất, chọn; B = cân nhắc, bỏ)
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| Luật lặp / quá hạn / nhắc / gõ ngày / tìm | MỘT file hàm thuần mới `src/kehoachLap.js` (~210 dòng); `kehoach.js` chỉ giữ lưu + đọc | nhét vào `kehoach.js` (~430 dòng, gần ngưỡng 500) | phiếu dặn tách; bài thử nạp thẳng |
| Việc lặp | mỗi việc một bản ghi + `lap` + `lanXong` (≤24) + `moc` ("đã rà đến"); `viecNgay` sinh lần ảo | sinh sẵn từng lần vào kho | không phình kho; tính thẳng từ ngày bắt đầu → không trôi |
| Nhắc | `nhac` = phút từ 00:00 ngày việc (âm = trước); dạng tương đối chỉ ở state form | lưu cả dạng tương đối | đúng phiếu C2; việc lặp nhắc đúng mọi lần |
| Bảng nổi | `BangNoi.jsx` (khuôn chung) + `BangNgay.jsx` + `BangQuaHan.jsx` | hai bảng riêng | một khuôn: Esc / ✕ / nền / vuốt |
| Hoàn tác | `ThongBaoHoanTac.jsx` mới (khuôn `.toast.co-nut` có sẵn); Hoàn tác = ghi lại BẢN TRƯỚC | tính ngược từng thao tác | bản cũ giữ nguyên → "sau khi xong N ngày" về đúng ngày hẹn cũ |
| Dải nhắc khi App mở | `DaiNhacViec.jsx` (15 giây/lần so giờ POS `bayGio()`, mỗi mốc một lần, nhớ trong bộ nhớ trang) | `setTimeout` đúng mốc | đồng hồ máy lệch / ngủ máy → so lại định kỳ chắc hơn; không thêm khoá lưu (cấm sửa `luuMay.js`) |
| Bánh xoay | `BanhXoay.jsx` cột cuộn `scroll-snap` + phím ↑↓ | thư viện / `<input type=time>` | phiếu cấm ô giờ AM/PM; cấm thêm thư viện |

## Ca thử ↔ nghiệm thu
`cong_cu/thu_KHUI5c.js` (phần 1 hàm thuần chạy cả khi `KHONG_TRINH_DUYET=1`; phần 2 Chromium + đồng hồ giả 8.11.2026 09:00 VN): A1–A6, B1, C1, C2, D1–D3, E1, E2, F1, F2, G1.
`cong_cu/thu_KHUI5b.js` sửa đúng ca cũ (H2): A3 `upList` (nhắc theo phút), D1 giờ trống → cả ngày, thanh nhắc, chuông thay chấm, ✕ banner chuyển sang banner lớn.
Luồng hợp lệ không được chặn (K5): tên 120 ký tự, 29/2/2028, đủ 500 việc báo đúng lý do, việc cũ của 5b (nhac true/false, giờ bắt buộc) đọc được.

## Đường song song cần canh
`upList` (Sắp tới) và ô Trang chủ đếm việc đều đi qua `viecNgay` / `cacLan` (việc lặp hiện đúng); `TienIch.jsx` chỉ đọc `upList`, không đổi.
Dải nhắc ở `App.jsx` đọc cùng kho qua `dungKeHoach` (một bản trong bộ nhớ trang); `quenKeHoach()` khi đăng xuất vẫn xoá bản trong bộ nhớ.

## Ngân sách
App thật ≈ 800 dòng mới / sửa (file mới 640 gồm CSS 59; sửa thêm ~165) so với phiếu ~700 — dưới 1,5× (1050); bài thử ≈ 343 dòng (phiếu ~400). Cắt E2 (tìm) KHÔNG cần.
