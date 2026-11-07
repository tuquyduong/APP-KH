# KH-UI-5b — kế hoạch

Việc THƯỜNG (không "Chờ duyệt kế hoạch") → làm thẳng tới hết. Nguồn chuẩn: `thiet_ke/app_kh_demo.html` (patch39) — các hàm đã đọc: `dayInfo`, `renderCal`, `calMove/Pick/Today`, `saveAdd`, `agToggle/agDel`, `holList`, `upList` (bản cuối, dòng ~5262), `toolBadge` (bản patch35), `renderToolGrid` (+ patch35: `.six`, dải `up-strip`), `renderTool` nhánh `mua`/`hol`/`up`, `calNotiBar`, `todayCard/todayHide/renderTodayAll`, `renderToday` (ô `utilCal`).

## Phần 1 — Dữ liệu + hàm tính (A1–A3)
- **A:** `src/noiDung/keHoach.js` (dữ liệu chép nguyên: `SOLAR_HOL`, `LUNAR_HOL`, `SS`, `SS_F`, `SEASON`, `GIFT_HOL`, `WD`, chữ cố định) + `src/kehoach.js` (hàm thuần nhận `homNay = {d,m,y}`, ~190 dòng; lưu máy ~70 dòng). `TERM_TIPS`, `LUNAR` dùng lại từ `lich.js`.  ~330 dòng. Rủi ro thấp; bài thử đối chiếu bắt lệch.
- **B:** gộp luôn vào `lich.js`. Bỏ: `lich.js` đã là "chép nguyên 5a", trộn thêm làm bài 5a khó đọc.
- Chọn **A**. Hàm lệ thuộc `TODAY` của demo (`nextSolar`, `nextLunar`/`l2s`, `holList`, `upList`, mùa hiện tại) nhận `homNay` làm tham số — cùng công thức, không `new Date(chuỗi)`.
- Bài thử đối chiếu: kịch bản Playwright (ở nháp) đặt `TODAY` rồi gọi chính `renderCal` (đọc DOM), `holList`, `upList`, `SEASON(LUNAR.term(TJ()).idx)` của demo → `cong_cu/thu_KHUI5b_mau.json`.  `upList` của demo trộn nguồn của 5c (người thân, văn khấn, xe, thuốc, chu kỳ) → trong kịch bản đặt rỗng (`TL.ppl=[]`, `VK.length=0`, `TL.car=[]`, `TL.med=[]`, `TL.cyc.on=false`) để chỉ còn việc + lễ (đúng "nguồn có ở việc này").

## Phần 2 — Lưu trên máy (D1–D3)
- Khoá `kh_kehoach`, một bản `{ v:1, viec:[{id,ngay,gio,tieu,nhac,xong}], leNhac:{ [tên lễ]: true }, anBanner: 'YYYY-MM-DD' }`; đọc kiểm dạng từng phần (hỏng → bỏ phần đó); ghi trả `true/false` (kho chặn → màn báo "Trình duyệt không cho lưu…"). Khoá `KHOA_KE_HOACH` xuất từ `kehoach.js`, `luuMay.js` thêm vào `KHOA_DU_LIEU` (không viết quy tắc xoá riêng).
- Nút "Xoá toàn bộ dữ liệu Kế hoạch trên máy này": demo không có → dòng nhỏ cuối `/kehoach` (ghi Phát hiện).

## Phần 3 — Màn
- `src/pages/KeHoach.jsx` (màn `lich`) ~220 dòng; `src/pages/TienIch.jsx` (`tool`: mua/hol/up) ~140 dòng; `src/components/ThemViec.jsx` (sheet `sheetAdd`) ~60; `src/components/OKeHoach.jsx` (ô Trang chủ `utilCal`) ~30; `BannerHomNay.jsx` thêm `mini`/`khiAn` (~12 dòng đổi). Đường dẫn: `duongDan.js` bỏ `giuCho` của `/kehoach`, thêm `/kehoach/:tienich`; `App.jsx` dựng màn; `TrangChu.jsx` thêm ô vào `top-row` bọc `KhoaTienIch`.
- Hai cách làm CSS: (A) bộ trích tự động các luật của demo theo tên lớp → `ke_hoach.css` (chép nguyên, K9 xanh); (B) viết tay. **Chọn A** (nguyên văn demo, không ước lượng).
- Biểu tượng: tranh mùa dùng `public/anh/the-chat-{blossom,sun,fan,moon,sprig}.svg` đã có từ 5a (cùng `p-…` của demo); đèn lồng dùng `DenLong`; `i-bell`, `i-flag` có ở `SPRITE_MUA`; `i-clock` có ở `IcoVe`; `plus/check/close/back` có ở `index.html`. Thiếu thì chép nguyên `<symbol>` từ demo vào `public/anh/` (không base64 trong `src/`).
- Ghép món: `ghepMon(ds, [TU_KHOA_MON[id]], TU_KHOA_MON)` (như 5a); không có món → ẩn cả khối.

## Nhắc việc (C)
- `calNoti`: chỉ khi hôm nay có việc bật nhắc chưa xong → thanh `.nt-bar.on` nêu giờ + tiêu đề (giờ VN từ `bayGio()`); không có thì ẩn (demo luôn hiện nút Bật/Tắt đẩy thông báo — không có cửa → lý do (a)).
- Công tắc nhắc: chữ "Nhắc khi mở app" (C2). Không gọi cửa nào.

## Ca thử ↔ mục nghiệm thu (`cong_cu/thu_KHUI5b.js`)
A1 dữ liệu = demo byte-từng-byte (cần Chromium → có `KHONG_TRINH_DUYET`: bảng JSON đã lưu so thay) · A2/A3 lưới ≥12 tháng, `holList` ≥6 ngày, `upList` ≥4 ngày, mùa 12 ngày · B1–B7 dựng màn thật bằng esbuild + react-dom/server (khuôn 5a), có ca "ẩn Từ TQD", "chỉ 3 ô", "mini + ✕" · B5 `duongDan` · C1/C2 chữ + nhắc hôm nay · D1 lưu/hỏng/kho chặn · D2 `luuMay` (đăng xuất/đổi khách xoá, 401 giữ) · D3 nút xoá · E2 sửa `thu_KHLINK1`, `thu_KHUI5a`, `thu_KHLUU1` (ca "giữ chỗ", "ô Kế hoạch trống", danh sách khoá) — mỗi bài ≥1 ca đỏ trên gốc.
Luồng hợp lệ không được chặn (K5): thêm việc đúng định dạng, tiêu đề có dấu, giờ mặc định 08:00, ngày chọn ở tháng khác, đăng nhập lại cùng khách còn việc.

## Cắt nếu vượt ngân sách (phiếu): B4 "Sắp tới" → Phát hiện.

## Bổ sung sau soát kế hoạch (agent phụ)
- Thêm ca: B6 (không có thẻ video), Ngày lễ không có nút mua, E3 so ảnh 390/360/430 → `so_anh/` + `doi_chieu_demo.md`, E4 cổng + `HEAD ĐÃ KIỂM`.
- `KHOA_KE_HOACH` thêm CUỐI mảng `KHOA_DU_LIEU` (regex của `thu_KHBAO1.js:88` bắt `KHOA_DUNG_VI` trong mảng; không sửa bài đó).
- Công cụ trích CSS / sinh mẫu để ở nháp, không vào `cong_cu/`. Nút ✕: xem `## Câu hỏi` 1 của `trang_thai.md`.
