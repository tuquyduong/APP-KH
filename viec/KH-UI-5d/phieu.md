# KH-UI-5d — Dải quảng cáo mảnh ở đầu các trang + sửa sau KH-UI-5c (bỏ ✕ banner, xoá hỏi lại một lần, bỏ Hoàn tác, 4 lỗi nhỏ, đổi ngày khi sửa việc)

<!-- Chat App KH soạn 09.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 11.11. Mở SAU KHI KH-UI-5c đã gộp + ghi xong. Chạy song song được với KH-PWA-1
     (PWA chỉ sửa public/sw.js, public/_headers, src/dangKySW.js, src/main.jsx — việc này KHÔNG đụng các file đó).
     Chủ quán 09.11 (đã xem ảnh chụp App thật + demo 2 kiểu dải):
     - Trang chủ GIỮ NGUYÊN banner lớn "Hôm nay". BỎ HẲN nút ✕ (quá nhỏ, khách không thấy) — không còn ẩn banner ở đâu cả.
     - Các trang khác: "thu gọn lại phía trên, không cần to, không cần nút tắt; chạy banner để quảng cáo cho khách, hiện nhẹ nhàng, chạy trên đầu trang để không ảnh hưởng
       thao tác" → chọn **kiểu A — dải mảnh có ánh sáng lướt**. "Từ ngữ hiển thị phải thật chọn lọc để hấp dẫn."
     - Trang CÓ dải: Menu, Ưu đãi, Giỏ hàng, Kế hoạch và các tiện ích, Tài khoản. KHÔNG có: Thanh toán, Theo dõi đơn, Đăng nhập, bảng PIN (và mọi màn còn lại).
     - Chữ dải: chủ quán sẽ đặt trong Cài đặt POS (theo ngày / khung giờ) — POS QC-APP-1, hợp đồng v14, dự kiến 12–13.11 → việc SAU (KH-QC-1). Việc này làm dải
       với nguồn tạm: Giờ vàng đang chạy → chương trình đặc biệt → không có thì ẨN.
     - Xoá việc (Kế hoạch): KHÔNG Hoàn tác nữa — "xoá rồi thì xoá luôn, chỉ cần hỏi lại 1 lần khi xoá". Giỏ hàng GIỮ NGUYÊN (vẫn Hoàn tác như cũ).
     - Đồng ý 4 sửa nhỏ chat tìm thấy khi soát KH-UI-5c + sửa việc đổi được ngày.
     Lưới 6 ô + 5 tiện ích còn lại = KH-UI-5e (SAU việc này, cùng file). Đọc CLAUDE.md §5, §6 (giờ VN theo `bayGio()`), §8. -->

## Mục tiêu
Khách thấy quảng cáo của quán nhẹ nhàng ở đầu các trang mà không vướng thao tác; Kế hoạch đơn giản hơn: xoá thì hỏi lại một lần rồi xoá, không còn Hoàn tác, không còn nút ✕ khó thấy.

## Nghiệm thu

### A. Dải quảng cáo (kiểu A — theo bản xem trước chủ quán chọn)
- A1 Component MỚI `src/components/DaiQuangCao.jsx` + CSS MỚI `src/giaoDien/dai_quang_cao.css` (import trong component): dải bo góc 12 px, cao 38 px (± 2), nền gradient đỏ đô → hồng
  của demo (CHỈ màu có trong demo — K9), trái nhãn nhỏ "HÔM NAY", giữa câu quảng cáo MỘT dòng (dài thì cắt "…"), phải "Xem ›" màu vàng nhạt của demo; vệt ánh sáng lướt chéo
  lặp mỗi ~3,5 giây (cùng kiểu `fx-a` banner Trang chủ). `prefers-reduced-motion` → không lướt.
- A2 Gắn MỘT chỗ ở vỏ App (`src/App.jsx`, ngay trên nội dung trang, dưới thanh trên nếu có), chỉ hiện khi trang hiện tại thuộc danh sách: `menu` (cả `/menu/:nhom`), `uudai`, `giohang`,
  `kehoach` và các trang tiện ích, `taikhoan` (chỉ trang Tài khoản chính). Các trang khác KHÔNG có (đặc biệt `thanhtoan`, `theodoi`, `dangnhap`, và khi bảng PIN / QR đang mở thì dải
  không được nổi lên trên). Dải nằm trong luồng trang (cuộn theo trang, KHÔNG dính / KHÔNG đè), không đẩy lệch các nút đã có.
- A3 Nguồn chữ — hàm thuần MỚI `src/quangCao.js` `chonQuangCao({ gioVang, chuongTrinh, bayGio })` → `{ chu, dich } | null`, thứ tự:
  1) Giờ vàng ĐANG chạy (dùng `trangThaiGioVang` sẵn có): "⏰ Giờ vàng: giảm {phan_tram}% đến {HH:mm}" → bấm mở Menu;
  2) chương trình đặc biệt đang áp dụng hôm nay (`/chuong-trinh`, dùng `docChuongTrinh` sẵn có): "🎁 " + tên chương trình (cắt cho vừa) → bấm mở Ưu đãi;
  3) không có gì → `null` → KHÔNG hiện dải (không để trống, không hiện chữ mẫu).
  Hết Giờ vàng giữa chừng → dải đổi / ẩn đúng lúc (theo đồng hồ `bayGio`, không cần tải lại). Dùng lại dữ liệu Giờ vàng vỏ App đang có; `/chuong-trinh` gọi qua hàm sẵn có trong
  `src/api.js` (KHÔNG thêm cửa mới, KHÔNG sửa api.js), tối đa một lần mỗi lần mở App + khi vào Ưu đãi như nay; lỗi mạng → bỏ nguồn đó, không báo lỗi.
- A4 Chuẩn bị cho KH-QC-1: `chonQuangCao` nhận thêm tham số `quangCao` (mảng dòng kiểu `{ chu_dai, dich, ma_mon, tu_gio, den_gio, uu_tien }`, mặc định `[]`) và nếu có dòng hợp giờ
  thì dùng TRƯỚC Giờ vàng / chương trình (dòng `id = 'gio_vang'` của POS coi như Giờ vàng). Việc này KHÔNG gọi cửa `/quang-cao` (chưa có trong hợp đồng) — chỉ hàm thuần + bài thử.
- A5 Bấm dải → mở đích (`menu` / `mon` + `ma_mon` / `uudai` / `tracnghiem`); `''` → không làm gì (không có "Xem ›").

### B. Bỏ ✕ banner
- B1 Banner lớn Trang chủ về như TRƯỚC KH-UI-5c (không ✕, không thông báo "Ẩn ở Lịch và tiện ích…"); gỡ `khiAn` khỏi `BannerHomNay.jsx`, gỡ `anBannerHomNay` + dữ liệu ẩn banner
  trong kho (đọc bản lưu cũ có trường đó vẫn không lỗi).
- B2 Banner nhỏ "Hôm nay" (`BannerNho`) ở Kế hoạch / tiện ích THAY bằng dải A (không còn hai thứ chồng nhau). Xoá `BannerNho.jsx` nếu không còn dùng.

### C. Xoá hỏi lại một lần, bỏ Hoàn tác (chỉ Kế hoạch)
- C1 Bấm xoá một việc (bảng ngày, bảng sửa, bảng quá hạn) → hỏi NGAY trong bảng (KHÔNG dùng `window.confirm`): "Xoá việc «tên»?" + nút **Xoá** (màu cảnh báo) / **Huỷ**.
  Việc lặp: "Xoá việc lặp «tên»? Mọi lần lặp sẽ mất." Bấm Xoá → xoá luôn + báo ngắn "Đã xoá «tên»" (không nút).
- C2 Gỡ HẾT Hoàn tác ở Kế hoạch: xoá, tick xong, dời ngày, "Dời cả N việc", "Đánh dấu cả N lần". Tick nhầm → bấm lại ô tròn để bỏ tick (như nay). Gỡ `ThongBaoHoanTac.jsx` nếu không còn dùng.
- C3 KHÔNG đụng Giỏ hàng (`GioHang.jsx` giữ "Đã xoá … · Hoàn tác").

### D. 4 sửa nhỏ (chat soát KH-UI-5c)
- D1 Dải nhắc đầu màn Kế hoạch chỉ MỘT biểu tượng chuông (đang "🔔 🔔 Hôm nay: …").
- D2 Chữ đếm ("10 phút nữa", "Còn 2 giờ") tự cập nhật mỗi phút khi đang mở màn (theo `bayGio`), hết giờ thì đổi / ẩn đúng lúc.
- D3 Gõ nhanh có ngày: dưới ô tên, khi App hiểu được ngày thì hiện dòng nhỏ "📅 Sẽ xếp vào ngày 1/2 · Không phải ngày" TRƯỚC khi bấm Thêm; bấm "Không phải ngày" → giữ nguyên chữ
  ("Uống 1/2" thành việc "Uống 1/2" ở ngày đang chọn). Không hiểu được ngày → không hiện dòng này.
- D4 Bấm "Xem" ở dải báo nhắc (component nhắc khi App đang mở) → mở màn Kế hoạch VÀ mở đúng bảng ngày của việc đó.

### E. Sửa việc đổi được ngày
- E1 Bảng sửa việc có ô **Ngày** (chọn ngày bằng lịch nhỏ / bánh xoay ngày-tháng-năm, KHÔNG ô `type=date` của trình duyệt). Việc thường → đổi ngày. Việc lặp → đổi ngày bắt đầu, hiện chữ
  "Chuỗi lặp sẽ tính lại từ ngày mới" trước khi Lưu; các lần đã tick trước ngày mới giữ nguyên.

### F. Kiểm
- F1 Bài MỚI `cong_cu/thu_KHUI5d.js`: hàm thuần `chonQuangCao` (Giờ vàng đang chạy / sắp / đã hết; chương trình; không có gì → null; `quangCao` có dòng hợp giờ / ngoài giờ / ưu tiên;
  `id='gio_vang'`), D3 hàm nhận ngày + bỏ ngày, E1 đổi ngày việc lặp (chạy cả khi `KHONG_TRINH_DUYET=1`); đọc nguồn: `BannerHomNay` không còn `khiAn`, Kế hoạch không còn
  `ThongBaoHoanTac`/hoàn tác, `GioHang.jsx` không đổi. Chromium: dải có ở Menu / Ưu đãi / Giỏ hàng / Kế hoạch / Tài khoản khi Giờ vàng chạy, KHÔNG có ở Thanh toán / Theo dõi đơn /
  Đăng nhập; không có Giờ vàng + không chương trình → không dải; đồng hồ giả qua giờ kết thúc → dải ẩn; bấm dải → đúng đích; xoá → hỏi → Huỷ giữ / Xoá mất; không còn "Hoàn tác" ở
  Kế hoạch; "Uống 1/2" → "Không phải ngày" → việc ở ngày đang chọn; D1, D2 (đồng hồ giả 1 phút), D4; dải không che nút nào ở 360 px.
- F2 Bài thử cũ đổi theo hành vi mới (`thu_KHUI5c.js`, `thu_KHUI5b.js` — ✕, Hoàn tác, banner nhỏ) → sửa đúng ca; mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`;
  KHÔNG dùng `## Bài thử cũ sửa`; không bớt ca khác.
- F3 Ảnh 360 / 390 / 430 → `viec/KH-UI-5d/so_anh/`: Menu, Ưu đãi, Giỏ hàng, Kế hoạch, Tài khoản có dải; Thanh toán không dải; Trang chủ banner không ✕; hỏi xoá; dòng "Sẽ xếp vào ngày";
  bảng sửa có ô Ngày. `doi_chieu_demo.md` (dải = quyết định chủ quán 09.11, không có trong demo).
- F4 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- F5 Chủ quán thử tay: (1) lúc Giờ vàng chạy: Menu / Giỏ hàng có dải đỏ "Giờ vàng…", bấm → Menu; Thanh toán không có; (2) Kế hoạch → xoá một việc → hỏi lại → Xoá → mất, không còn
  Hoàn tác; (3) gõ "Uống 1/2" → thấy "Sẽ xếp vào ngày 1/2" → bấm "Không phải ngày" → Thêm.

## Phạm vi
- viec/KH-UI-5d/**
- src/App.jsx
- src/quangCao.js
- src/components/**
- src/pages/KeHoach.jsx
- src/pages/TienIch.jsx
- src/pages/TrangChu.jsx
- src/kehoach.js
- src/kehoachLap.js
- src/giaoDien/dai_quang_cao.css
- src/giaoDien/bang_ngay.css
- src/giaoDien/ke_hoach.css
- cong_cu/thu_KHUI5d.js
- cong_cu/thu_KHUI5c.js
- cong_cu/thu_KHUI5b.js
- cong_cu/thu_KHUI5b_mau.json

## Ngân sách
~350 dòng app + ~300 dòng thử. **Phương án đơn giản nhất đã xét:** gắn dải MỘT chỗ ở vỏ App theo danh sách trang (không sửa từng trang); nguồn chữ là một hàm thuần dùng dữ liệu sẵn có;
hỏi xoá ngay trong bảng nổi đang mở (không thêm hộp thoại mới). Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- `src/App.jsx` CHỈ để gắn dải A (và gỡ / sửa đúng dòng dải nhắc của KH-UI-5c nếu D4 cần); không sửa dòng khác.
- `src/pages/TrangChu.jsx` CHỈ để gỡ ✕ / thông báo ẩn banner (B1); không sửa khác.
- `src/components/**`: KHÔNG sửa `PinSheet.jsx`, `HoaDonKhach.jsx`, `TheQR.jsx`, `BaoDonXong.jsx`, `KhoaTienIch.jsx`, `Thongbao.jsx`.
- KHÔNG sửa `src/pages/GioHang.jsx`, `ThanhToan.jsx`, `TheoDoiDon.jsx`, `DangNhap.jsx`, `Menu.jsx`, `UuDai.jsx`, `TaiKhoan.jsx` (dải gắn ở vỏ App, không ở từng trang), `src/api.js`,
  `src/luuMay.js`, `src/datDon.js`, `src/duongDan.js`, `src/main.jsx`, `src/dangKySW.js`, `public/**`, `index.html`, `src/giaoDien/giaoDien.css`, `src/giaoDien/demo*.css`, `thiet_ke/**`.
- KHÔNG sửa bài thử ngoài Phạm vi (KH-PWA-1 đang sửa `thu_KHPWA1.js`, `thu_KHUI2.js`), `kiem_tra_truoc_khi_giao.js`, `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`,
  `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG gọi cửa `/quang-cao` (chưa có trong hợp đồng — KH-QC-1). KHÔNG làm lưới 6 ô / 5 tiện ích (KH-UI-5e). KHÔNG viết sẵn câu quảng cáo mẫu vào App.
- Chỉ push `git push -u origin viec/KH-UI-5d`. Không đụng `main`, không merge, không tạo PR.
