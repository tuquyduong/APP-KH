# KH-UI-5d — kế hoạch (việc thường: chạy thẳng)

Hồ sơ đã đối chiếu code thật: `src/App.jsx` (vỏ, `.screens` là khung cuộn, mỗi màn là `.screen`), `src/pages/KeHoach.jsx`, `TienIch.jsx`, `TrangChu.jsx:99-111`,
`src/components/{BannerHomNay,BannerNho,ThongBaoHoanTac,BangNgay,BangQuaHan,DaiNhacViec,dungKeHoach}`, `src/kehoach.js:151-233`, `src/kehoachLap.js`.

## Phương án từng phần
| Phần | A (chọn nếu ngắn hơn) | B | Chọn |
|---|---|---|---|
| A. Dải | Một component `DaiQuangCao.jsx` + hàm thuần `quangCao.js`, gắn MỘT chỗ ở `App.jsx` đầu `.screens` (~45 dòng app + 35 css) | Sửa từng trang (bị CẤM) | A |
| Chạy ánh sáng | Dùng lại lớp `fx-a` của demo (`--dur:3.5s`), không viết keyframes mới; `prefers-reduced-motion` đã có ở `demo_2.css` | keyframes riêng | A |
| Nguồn chữ | Giờ vàng từ `NguCanhGia.tt` (đã có, tự đổi pha); `/chuong-trinh` gọi `layChuongTrinh` 1 lần ở App | thêm cửa mới (CẤM) | A |
| B. Bỏ ✕ | Gỡ `khiAn`/`mini` ở `BannerHomNay`, gỡ `anBannerHomNay`/`bannerDangAn`/`anBanner` ở `kehoach.js`, xoá `BannerNho.jsx` (~−45 dòng) | giữ ẩn | A |
| C. Xoá | Component `HoiXoa.jsx` (~14 dòng) dùng ở bảng ngày (sửa việc) + bảng quá hạn; bỏ tham số `hoanTac` của `lam`, xoá `ThongBaoHoanTac.jsx` (GioHang dùng CSS `gio_xoa.css` riêng, không đụng) | `window.confirm` (cấm) | A |
| D1 | bỏ chữ 🔔 thừa trong `.nt-bar` | | |
| D2 | `dungPhut()` (~8 dòng, `dungKeHoach.js`): vẽ lại khi phút theo `bayGio` đổi | setInterval 60 s trơn (lệch phút) | A |
| D3 | `BieuMau` dùng lại `tachNgayCuoi` để hiện dòng xem trước + nút bỏ ngày (~10 dòng) | | |
| D4 | thêm ca thử (nhắc ngày khác / đang ở /kehoach); sửa code nếu ca đỏ | | |
| E1 | ô Ngày dùng `BanhXoay` kiểu mới `BanhNgay` (3 cột ngày/tháng/năm, tái dùng `BanhCot`) + `suaViec` nhận `ngay` + việc lặp: đổi ngày bắt đầu, giữ lần đã tick (~35 dòng) | `<input type=date>` (CẤM) | A |

Tổng ước: ~330 dòng app (vừa ngân sách), ~300 dòng thử.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHUI5d.js`)
- A1–A3, A4, A5: hàm thuần `chonQuangCao` (Giờ vàng đang/sắp/hết, chương trình, null, quangCao hợp/ngoài giờ/ưu tiên, `id='gio_vang'`); Chromium: dải ở Menu/Ưu đãi/Giỏ/Kế hoạch/Tài khoản, KHÔNG ở Thanh toán/Theo dõi/Đăng nhập, không có nguồn → không dải, đồng hồ giả qua giờ kết thúc → ẩn, bấm → đúng đích, 360 px không che nút.
- B1–B2: nguồn `BannerHomNay` không còn `khiAn`/`t-x`; kho không còn `anBannerHomNay`; bản lưu cũ có `anBanner` đọc không lỗi; `BannerNho.jsx` không còn.
- C1–C3: Chromium xoá → hỏi → Huỷ giữ / Xoá mất (việc thường + việc lặp), không `window.confirm`; không còn "Hoàn tác" ở Kế hoạch; `GioHang.jsx` không đổi.
- D1 (1 chuông), D2 (đồng hồ giả +1 phút đổi chữ đếm), D3 (hàm + Chromium "Uống 1/2"), D4.
- E1: hàm thuần `suaViec` đổi ngày việc lặp + Chromium ô Ngày, chữ "Chuỗi lặp sẽ tính lại từ ngày mới".
- F2: `thu_KHUI5c.js`, `thu_KHUI5b.js` đổi ca ✕ / Hoàn tác / banner nhỏ; mỗi bài ≥ 1 ca đỏ trên gốc kể cả `KHONG_TRINH_DUYET=1`.

## K5 — luồng hợp lệ không được chặn
Tick/dời/xoá vẫn lưu và báo; bản lưu cũ có `anBanner` vẫn đọc; Giỏ hàng vẫn Hoàn tác; dải không chặn bấm nút nào (nằm trong luồng, không dính).

## Đường song song
`DaiNhacViec` (dải báo nhắc) nằm ở vỏ App, cùng hàng với dải mới nhưng là lớp nổi — dải mới không có z-index. Bảng PIN / QR / BangNoi nổi lên trên.
