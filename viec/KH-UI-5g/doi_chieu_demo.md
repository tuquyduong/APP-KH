# KH-UI-5g — đối chiếu demo (patch39)

Ảnh trong `so_anh/` (Chromium, đồng hồ giả 11.11.2026 15:00 giờ VN, cỡ 360 / 390 / 430 × 844; kịch bản chụp `chup_anh.js`):
- `<rộng>_banner_{demo,app,lech}.png` — banner "Hôm nay" Trang chủ: DEMO (`todayCard`, `#todayHome`) ↔ APP (mặc định, chưa đăng nhập), cả hai tắt chuyển động để so tĩnh; `lech` = ảnh tô đỏ điểm ảnh khác.
- `<rộng>_trangchu_{chuongtrinh,giovang,macdinh}_chua.png`, `<rộng>_trangchu_macdinh_da.png` — Trang chủ ba trạng thái chữ (chưa đăng nhập) + đã đăng nhập ("Chào buổi chiều, anh Linh!").
- `<rộng>_menu_dai_t0.png` / `_t1.png` — dải ở Menu, hai khung hình cách ~0,7 s (vệt sáng đã đi qua chữ ở khung sau).

Lý do khác demo theo CLAUDE.md §5: (a) dữ liệu POS chưa có / việc sau · (b) chữ mẫu không dùng · (c) chưa có giỏ / đặt đơn · (d) màn rộng. **"phiếu"** = yêu cầu của phiếu KH-UI-5g.

## Banner "Hôm nay" Trang chủ ↔ demo `todayCard(false)`
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Khung `.today.fx-a` | `.today` 20px bo, nền gradient 125deg `#8E1B4C→#B2365F→#C8784A`, bóng, `min-height:150px` | cùng lớp CSS (`demo_1.css`), cộng `.photo` (`min-height:168px`, nền `#7A1E45`) | khác nhỏ có sẵn từ KH-UI-5c: bản App dùng ảnh nền thật (`.today.photo` của `demo_2.css`) thay hình minh hoạ `t-art` của demo — chủ quán chốt khi duyệt ảnh banner (phiếu) |
| Ảnh nền | `.t-art` (hình SVG nhỏ bên phải) | `.t-bg > img` phủ cả banner + `.t-shade` | như dòng trên |
| Nhãn `.t-k` | "HÔM NAY · THỨ N d/m", chấm vàng `.dot`, `gl gl-t` | "HÔM NAY" + chấm vàng, `gl gl-t` | (a) chưa có giờ POS để ghi ngày (đã ghi từ KH-UI-5c); nhãn là mục danh mục `today.k` |
| Tiêu đề `b` | `gl gl-t`, 19px, `--c:#F8EAF0 --hi:#FFE7A6` | cùng | giống. Chữ: Giờ vàng / chương trình / chữ POS / mặc định "Hôm nay bạn muốn uống gì?" — (b) chữ mẫu của demo không dùng |
| Dòng phụ `.t-s` | `gl gl-t`, 12.5px | cùng; chỉ hiện khi có chữ ("Đến 10:00 hôm nay" / mô tả chương trình) | giống; trống thì ẩn (không bịa) |
| Nút `.t-cta` | `gl gl-b`, nền `#FDE69B`, chữ `#7A2647`, 12.5px | cùng; ẩn khi POS không có đích | giống |
| Quầng `.gl-a` | `.today.photo .gl-a` phủ cả thẻ, `color-dodge` | cùng, phủ đúng cả thẻ (hook `dungAnhSangLuot` đặt left/top/width/height) | giống |
| Nút ✕ `.t-x` | có | không có | chủ quán 09.11 bỏ ✕ (đã ghi từ KH-UI-5d) |
| Bản `mini` ở Lịch / tiện ích | có | không có (thay bằng dải) | chủ quán 09.11 (KH-UI-5d) |
| Banner thường `.hero-banner` | ẩn khi `TDY.on` | **bỏ hẳn** khỏi Trang chủ | phiếu C1 — banner "Hôm nay" luôn hiện cho mọi khách, như `renderTodayAll` của demo |
| Ô Giờ vàng + Trắc nghiệm bên dưới | `.hb-tiles` | giữ nguyên | giống |

## Dải quảng cáo các trang (KHÔNG có trong demo — kiểu A chủ quán chọn 11.11)
Mọi giá trị lấy từ demo, giống bản chủ quán đã xem:
| Thành phần | Giá trị | Lấy từ demo |
|---|---|---|
| Khung | cao 40px, lề `12px 18px 0`, bo 12px, nền `linear-gradient(125deg,#8E1B4C 0%,#B2365F 55%,#C8784A 100%)`, bóng `0 4px 12px rgba(142,27,76,.22)` | `.today` (nền, bóng) |
| Nhịp | `--dur:2s` (bỏ 3.5s) | `.fx-a{--dur:2s}` |
| Nhãn "HÔM NAY" | chấm vàng `.dot` (`#FDE69B`) + chữ `gl gl-t`, 10px 800, `--c:#F6D57E --hi:#FFFFFF` | `.today .t-k`, `.fx-a .t-k.gl-t` |
| Biểu tượng đầu câu | emoji đứng riêng, KHÔNG nằm trong `gl-t` (tránh `background-clip:text` biến emoji thành khối màu) | — (yêu cầu phiếu B1) |
| Dòng chữ | `gl gl-t`, 12.5px 800, một dòng, dài thì "…", `--c:#F8EAF0 --hi:#FFE7A6` | `.fx-a b.gl-t` |
| Nút "Xem ›" | `gl gl-b`, nền `#FDE69B`, chữ `#7A2647`, 11.5px 800, đệm `5px 9px`, bo 9px, `z-index:2` | `.today .t-cta` |
| Quầng `.gl-a` | dải chéo `rgba(255,238,200,.55)` / `rgba(255,246,222,.7)`, `color-dodge`, không bo tròn | `.today.photo .gl-a` |
| Bộ đo | dùng chung hook với banner | `glMeasure` |
Khác demo vì: (a) dải không có trong demo (chủ quán thêm ở KH-UI-5d, 09.11) · giảm chuyển động: `prefers-reduced-motion` tắt vệt sáng (CSS của demo `demo_2.css`, không sửa).

## Lời chào
Demo (`thiet_ke/app_kh_demo.html` dòng 1891): mẫu "Chào buổi chiều, Linh" — gọi bằng TÊN riêng (chữ cuối), không kèm xưng hô. App (phiếu D1, chủ quán 11.11): có xưng hô → xưng hô + chữ cuối của tên ("Chào buổi chiều, anh Linh!"); không xưng hô → giữ tên đủ như cũ. Tên đầy đủ ở các chỗ khác (Hồ sơ, hoá đơn…) không đổi; bản xem trước lời chào ở Hồ sơ dùng cùng hàm `chiaLoiChao` nên cũng ra "anh Linh" (đúng ý, không sửa `HoSo.jsx`).
