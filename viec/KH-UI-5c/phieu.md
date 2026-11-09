# KH-UI-5c — Kế hoạch: bấm ngày → bảng việc của ngày, việc lặp lại, nhắc trước, cảnh báo quá hạn, hoàn tác, gõ nhanh có ngày, tìm việc

<!-- Chat App KH soạn 08.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 10.11. Mở SAU KHI KH-UI-5b đã gộp (main có src/kehoach.js, KeHoach.jsx, TienIch.jsx).
     Chủ quán 08.11: "Thêm việc nên là một pop-up khi bấm vào ngày nhất định; ngày có việc thì có thêm biểu tượng" — chủ quán đã xem bản xem trước (bảng nổi từ dưới lên, chuông
     nhỏ trên ô ngày) và "tham khảo phần lên lịch làm việc, các chức năng thêm việc, cảnh báo" ở app riêng của chủ quán (tab Việc). Chat đã đọc app đó và chép LUẬT vào phiếu
     (máy KHÔNG có code app đó — làm theo phiếu). Chỉ lấy phần hợp với khách quán (việc của một người, lưu trên máy); KHÔNG lấy: chia sẻ hai người, dự án / kế hoạch lớn,
     đơn đặt hàng, bấm giờ Daily, PIN riêng.
     Quyết định 07.11 (chat quyết 3 câu hỏi KH-UI-5b): nút ✕ ẩn banner đặt ĐÚNG như demo (`todayHide`); ô "hôm nay" của lịch giữ cỡ thường (demo lỗi CSS cao 150 px — không chép lỗi).
     Lưới 6 ô + 5 tiện ích còn lại (Văn khấn, Ngày cần nhớ, Xe cộ, Uống thuốc, Chu kỳ) = việc SAU KH-UI-5d (cùng file, làm lần lượt) — việc này KHÔNG làm.
     Đọc CLAUDE.md §5, §6 (giờ VN — "hôm nay" theo `bayGio()`), §8 (dữ liệu chỉ trên máy). -->

## Mục tiêu
Khách thêm và theo dõi việc ngay trên lịch: bấm một ngày là thấy và thêm việc của ngày đó; việc lặp tự hiện đúng ngày; quá hạn thì được nhắc rõ; lỡ tay thì hoàn tác được.

## Nghiệm thu

### A. Bấm ngày → bảng việc của ngày (theo bản xem trước chủ quán đã xem)
- A1 Chạm MỘT ngày trên lịch tháng → chọn ngày (như nay) VÀ mở **bảng nổi từ dưới lên**: thanh kéo; tiêu đề "Hôm nay" hoặc "Thứ …, dd/mm" + dòng âm lịch ("Rằm / Mùng N tháng M âm",
  "nhuận", "tháng thiếu"); nút ✕. Đóng bằng ✕, vuốt xuống, chạm nền mờ, phím Esc.
- A2 Mục **Trong ngày**: ngày lễ, tiết khí (dữ liệu sẵn của KH-UI-5b) — mỗi dòng một nhãn màu.
- A3 Mục **Việc của tôi · N việc**: mỗi việc một dòng — ô tròn tick xong, giờ (nếu có), tên, dấu ↻ nếu lặp, 🔔 nếu có nhắc; chạm tên → sửa (tên, giờ, lặp, nhắc trước) / xoá.
- A4 **Thêm ngay trong bảng — gọn, ít thao tác** (chủ quán 08.11: "gọn gàng, đơn giản, ít thao tác nhưng vẫn đầy đủ"; "có giờ sự kiện và hẹn giờ nhắc"):
  - Một ô "+ Thêm việc…  (vd: Mua quà 20/11)" + nút "Thêm" (Enter cũng thêm). Chỉ gõ tên rồi Thêm là xong (việc cả ngày, không nhắc, không lặp). KHÔNG còn dòng mẹo riêng — ví dụ nằm trong chữ mờ của ô.
  - Dưới ô là **3 nút một hàng**: "🕘 Giờ sự kiện" · "🔔 Hẹn giờ nhắc" · "↻ Lặp lại". Đã chọn thì nút đổi chữ thành giá trị ("🕘 14:30", "🔔 Trước 15 phút", "↻ Hằng tháng") và tô màu;
    chưa chọn thì chữ mờ. Chạm một nút → mở MỘT khung chọn ngay dưới (khung khác tự đóng); khung có nút "Xong". KHÔNG có tiêu đề "GIỜ (24 giờ)" / "Không đặt giờ".
  - **Giờ sự kiện**: bánh xoay 24 giờ (giờ 00–23 : phút 00–55 bước 5, vuốt; phím ↑↓ cũng đổi), nút "Cả ngày (không giờ)" để bỏ giờ. KHÔNG dùng ô giờ AM/PM của trình duyệt.
    Vừa đặt giờ sự kiện mà chưa đặt nhắc → nhắc tự đặt "Đúng giờ" (đổi / bỏ được).
  - **Lặp lại**: các nút C1 (chọn "Sau khi xong…" thì hiện thêm 7 · 30 · 60 · 90 ngày).
  - Thêm xong: ô trống lại, 3 nút về mặc định, việc hiện ngay trong danh sách, bảng giữ mở, báo "Đã thêm: …".
- A5 Ngày có việc của tôi (chưa xong) → **biểu tượng chuông nhỏ** trên ô lịch (biểu tượng sẵn trong bộ demo; KHÔNG vẽ mới), khác chấm ngày lễ; ngày có việc QUÁ HẠN → biểu tượng đổi màu
  cảnh báo; chú giải dưới lịch thêm "Việc của tôi". Ô không vỡ ở 360 px khi có cả chuông + chấm lễ + tên tiết khí.
- A6 Nút "+ Thêm việc" ở mục "Việc của tôi" dưới lịch mở CÙNG bảng cho ngày đang chọn.

### B. Gõ nhanh có ngày
- B1 Gõ tên có ngày ở cuối → tự hiểu ngày: "Mua quà 20/11", "Đóng tiền điện 5/12/2026", "Đi khám 3-5/12" (hạn = ngày cuối). Không ghi năm → lần gần nhất tính từ hôm nay; ngày đó
  đã qua quá 60 ngày → năm sau. Ngày sai lịch (31/2) → giữ nguyên chữ, không đặt ngày. Tên lưu KHÔNG kèm phần ngày. Ở bảng của một ngày mà gõ ngày khác → việc vào ngày đã gõ,
  báo "Đã thêm vào dd/mm".

### C. Lặp lại + nhắc trước
- C1 **Lặp lại:** Không lặp · Hằng ngày · Hằng tuần · Hằng tháng · Hằng năm · Mỗi N ngày / tuần / tháng · **Mùng 1 & Rằm (âm lịch)** · **Sau khi xong N ngày** (vd mua thuốc,
  thay lõi lọc: bấm xong → việc dời sang N ngày sau ngày bấm). Có "đến ngày" (tuỳ chọn). LUẬT TÍNH (chép từ app tham khảo): mọi lần lặp tính THẲNG từ ngày bắt đầu, không cộng dồn
  từ lần trước → không trôi ngày (31/1 hằng tháng → 28/2 (29/2 năm nhuận), 31/3, 30/4…). Tick một việc lặp CHỈ đánh dấu lần (ngày) đó, các lần khác giữ nguyên. Âm lịch dùng
  `LUNAR` / `src/lich.js` sẵn có. Mô tả ngắn cạnh việc: "Hằng tháng · từ 31/1/2026 · đến 31/12/2026".
- C2 **Hẹn giờ nhắc** (chủ quán 08.11: "theo phút hoặc theo cả ngày cả phút"; "hẹn giờ nhắc"):
  - Việc CÓ giờ sự kiện: nút nhanh Đúng giờ · Trước 15 phút · Trước 1 giờ · Trước 1 ngày.
  - Việc KHÔNG giờ (cả ngày): nút nhanh Sáng cùng ngày 08:00 · Tối hôm trước 20:00.
  - Cả hai đều có **"Chọn ngày giờ khác…"** → bánh xoay 3 cột: [0–30] ngày trước · lúc [giờ 00–23] : [phút 00–55 bước 5] (0 ngày = cùng ngày). Nút "Không nhắc" để bỏ.
  - Lưu `nhac` = số phút TÍNH TỪ 00:00 của ngày việc, âm = trước ngày đó (vd "hôm trước lúc 20:00" = −240; "trước 15 phút" của việc 09:00 = 525) → việc lặp nhắc đúng cho mọi lần.
    Đổi giờ sự kiện thì nhắc kiểu "Trước N phút" đi theo giờ mới (giữ dạng tương đối trong state `{kieu:'truoc', p}` / `{kieu:'luc', ngay, g}`, chỉ đổi ra phút khi lưu).
  - Chữ hiện: "🔔 Trước 15 phút" / "🔔 Hôm trước lúc 20:00" / "🔔 Trước 3 ngày lúc 08:00". Dưới khung: "🔔 Nhắc hiện khi bạn đang mở App."
  - Từ lúc tới mốc nhắc: việc hiện ở thanh nhắc đầu màn Kế hoạch ("🔔 Còn 2 ngày: Đóng tiền điện (10/11)", "🔔 15 phút nữa: Hẹn bác sĩ (09:00)") và trong "Sắp tới".
  - **App đang mở** (bất kỳ màn nào) mà tới đúng mốc nhắc → dải báo trên cùng màn + rung (khuôn dải `BaoDonXong` — dùng lại kiểu, KHÔNG sửa component đó; tạo component mới) +
    nút "Xem" (mở bảng ngày) / ✕; mỗi lần nhắc chỉ báo một lần. App đã TẮT thì chưa báo được (thông báo đẩy = KH-TB-1) — chữ cạnh phần nhắc ghi đúng: "Nhắc khi bạn đang mở App".
### D. Cảnh báo quá hạn
- D1 Việc chưa xong mà hạn đã qua (lần lặp bị lỡ cũng tính) → đầu màn Kế hoạch có dải **"⚠️ N việc quá hạn"**; ô "Kế hoạch và nhắc việc" ở Trang chủ hiện số đỏ nhỏ (khi đã đăng nhập).
- D2 Bấm dải → bảng **"Việc quá hạn chưa làm"**: mỗi việc ghi "Quá N ngày · dd/mm · giờ"; việc lặp lỡ nhiều lần ghi "Lỡ N lần · từ dd/mm đến dd/mm". Nút: "✓ Xong" (việc lặp: "✓ Đã làm" /
  "✓ Đánh dấu cả N lần" / "Bỏ qua lần này"), "→ Hôm nay", "→ Mai", "Xoá" (bấm hai lần: "Xoá thật?" — không hộp thoại trình duyệt). Có "Dời cả N việc sang hôm nay" khi ≥ 2 việc
  thường. Hết việc → "✓ Đã rà soát xong — không còn việc quá hạn".
- D3 Danh sách việc ghi hạn bằng chữ: "hạn hôm nay" · "quá hạn dd/mm" (màu cảnh báo) · "hạn dd/mm" · "chưa có hạn".

### E. Hoàn tác + tìm
- E1 Tick xong hoặc xoá một việc → thông báo "Đã xong … · Hoàn tác" / "Đã xoá … · Hoàn tác" 5 giây (khuôn thông báo có nút đã có ở Giỏ hàng — `ThongBaoXoa` / `.toast.co-nut`; dùng
  lại hoặc tách component chung, không chép); Hoàn tác trả đúng như trước (cả việc "sau khi xong N ngày" về đúng ngày hẹn cũ).
- E2 Ô **tìm việc** ở màn Kế hoạch (tìm theo tên, bỏ dấu tiếng Việt khi so) → danh sách kết quả, chạm → mở bảng của ngày đó.

### F. Banner + ô hôm nay (quyết định 07.11)
- F1 Nút ✕ ẩn banner nhỏ đặt đúng chỗ + đúng hành vi demo `todayHide` / `renderTodayAll`; ghi vào `doi_chieu_demo.md`.
- F2 Ô "hôm nay" giữ cỡ thường (không chép lỗi cao 150 px của demo) — ghi lý do ở `doi_chieu_demo.md`.

### G. Lưu trên máy
- G1 Mọi dữ liệu mới (lặp, nhắc trước, ngày đã xong của việc lặp) trong khoá `kh_kehoach` sẵn có; đọc được bản lưu cũ của KH-UI-5b (việc không có trường mới = không lặp, không nhắc trước);
  dữ liệu hỏng → bỏ phần hỏng, không vỡ màn; kho chặn → không báo "đã lưu". Giữ lịch sử ngày đã xong của việc lặp tối đa 24 lần gần nhất.

### H. Kiểm
- H1 Bài MỚI `cong_cu/thu_KHUI5c.js`: hàm thuần — lặp (31/1 hằng tháng qua tháng 2 thường / nhuận, mỗi 2 tuần, hằng năm 29/2, Mùng 1 & Rằm qua tháng nhuận âm, "đến ngày", "sau khi xong N
  ngày" + hoàn tác), tick một lần của việc lặp, quá hạn + lỡ N lần, hẹn giờ nhắc (nút nhanh có giờ / không giờ, "Chọn ngày giờ khác" ra đúng số phút kể cả âm, đổi giờ sự kiện thì nhắc tương đối đi theo), gõ nhanh có ngày (năm sau, 31/2, khoảng ngày), tìm bỏ dấu, đọc bản lưu cũ / hỏng (chạy cả khi
  `KHONG_TRINH_DUYET=1`); Chromium: bấm ngày → bảng đúng ngày, chỉ gõ tên + Thêm là xong; 3 nút Giờ sự kiện / Hẹn giờ nhắc / Lặp lại mở một khung một lúc và đổi chữ theo giá trị; bánh xoay giờ 24h (vuốt / phím), thêm → chuông trên ô, tới mốc nhắc khi App mở → dải báo (đồng hồ giả), gõ "Mua quà 20/11" ở bảng ngày 8 → vào 20/11, tick → Hoàn tác, quá hạn → dải + bảng rà soát
  (→ Hôm nay / Xoá thật?), vuốt / ✕ / Esc đóng, tìm việc. "Hôm nay" theo `bay_gio` POS giả. `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- H2 Bài thử cũ đổi theo hành vi mới (`thu_KHUI5b.js` — khung thêm việc cũ, chấm ngày có việc; máy grep thêm) → sửa đúng ca; mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`;
  KHÔNG dùng `## Bài thử cũ sửa`; không bớt ca khác.
- H3 Ảnh 360 / 390 / 430 → `viec/KH-UI-5c/so_anh/`: lịch có chuông + quá hạn, bảng ngày (trống / có việc / đang sửa), bảng quá hạn, thông báo Hoàn tác; `doi_chieu_demo.md` (bảng ngày, bảng quá
  hạn không có trong demo = quyết định chủ quán 08.11).
- H4 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.
- H5 Chủ quán thử tay: (1) bấm ngày 20 → thêm "Mua hoa", chạm Giờ sự kiện xoay 09:00, Hẹn giờ nhắc → Chọn ngày giờ khác → 2 ngày trước lúc 20:00 → ô 20 có chuông; thêm một việc hôm nay giờ sau 20 phút, Hẹn giờ nhắc "Trước 15 phút", để App mở → 5 phút sau có dải nhắc; (1b) chỉ gõ "Gọi điện" + Thêm → việc cả ngày vào ngay; (2) thêm "Uống thuốc bổ" lặp "Sau khi xong 30 ngày" → tick → thấy dời 30 ngày → Hoàn tác;
  (3) thêm một việc ngày hôm qua → dải "⚠️ 1 việc quá hạn" → bấm → "→ Hôm nay".

## Phạm vi
- viec/KH-UI-5c/**
- src/kehoach.js
- src/kehoachLap.js
- src/noiDung/**
- src/pages/KeHoach.jsx
- src/pages/TienIch.jsx
- src/pages/TrangChu.jsx
- src/components/**
- src/App.jsx
- src/giaoDien/ke_hoach.css
- src/giaoDien/bang_ngay.css
- cong_cu/thu_KHUI5c.js
- cong_cu/thu_KHUI5b.js
- cong_cu/thu_KHUI5b_mau.json

## Ngân sách
~700 dòng app + ~400 dòng thử. **Phương án đơn giản nhất đã xét:** luật lặp / quá hạn / gõ ngày là hàm thuần ở file mới `src/kehoachLap.js` (tách khỏi `kehoach.js` vốn đã lớn); bảng ngày + bảng quá hạn
dùng chung MỘT khuôn bảng nổi; dùng lại kho `kh_kehoach` và khuôn thông báo có nút của Giỏ hàng. Vượt 1,5 lần thì giải thích; phải cắt thì cắt E2 (tìm) trước → `## Phát hiện`.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- `src/components/**` chỉ để sửa `BannerHomNay.jsx`, các component Kế hoạch đã có, tách khuôn thông báo có nút dùng chung (nếu tách thì Giỏ hàng dùng lại — sửa `GioHang.jsx` tối thiểu là
  `## Câu hỏi` trước), và thêm component MỚI cho bảng nổi; KHÔNG sửa `PinSheet.jsx`, `HoaDonKhach.jsx`, `TheQR.jsx`, `BaoDonXong.jsx`, `KhoaTienIch.jsx`. `src/pages/TrangChu.jsx` CHỈ để
  thêm số đỏ quá hạn trên ô Kế hoạch (D1). Cần sửa ngoài Phạm vi → `## Câu hỏi`, dừng.
- `src/App.jsx` CHỈ để gắn MỘT component dải nhắc việc (cạnh `<BaoDonXong>`; không sửa dòng khác).
- KHÔNG sửa `src/luuMay.js`, `src/api.js`, `src/datDon.js`, `src/duongDan.js`, `src/main.jsx`, `src/giaoDien/giaoDien.css`, `src/giaoDien/demo*.css`, `thiet_ke/**`, bài thử ngoài Phạm vi.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- KHÔNG làm lưới 6 ô / 5 tiện ích (KH-UI-5d), thông báo đẩy khi App tắt / tóm tắt buổi sáng / tổng kết cuối ngày (KH-TB-1), ngày ăn chay, ngày cắt tóc, chia sẻ, dự án.
  KHÔNG gửi việc của khách ra khỏi máy.
- Chỉ push `git push -u origin viec/KH-UI-5c`. Không đụng `main`, không merge, không tạo PR.
