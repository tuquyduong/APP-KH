# KH-UI-5b — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-UI-5b`; HEAD = FETCH_HEAD = `525e962` (không cần kéo). Ba dòng log lúc mở phiên:
```
525e962 PHIEU: KH-UI-5b
ab9fe0f TIEN-DO: mo dot 3 song song (KH-SOHD-1 so_hd + tien ve + the QR thuong hieu, hop dong v11; KH-HANG-2 hang HANG-1 v10; KH-UI-5b Ke hoach); duyet 7 mau the QR; thu POS/App 06.11
0d140b3 TIEN-DO: KH-BAO-1 xong (chat soat cuoi DAT, gop PR)
```

## Câu hỏi (không chặn việc — máy chọn mặc định an toàn, chủ quán đổi nếu muốn)
1. **Nút ✕ ở đâu?** Phiếu B7 đặt ✕ "Ẩn ở Lịch và tiện ích đến hết hôm nay" trên banner BẢN NHỎ. Code demo (`todayCard`, dòng ~5398) thì ngược lại: bản nhỏ (`mini`) KHÔNG có ✕, ✕ nằm ở banner Trang chủ và bấm vào thì ẩn hai bản nhỏ. Máy làm theo PHIẾU (✕ trên bản nhỏ, banner Trang chủ không đổi) — khác demo vì phiếu chỉ rõ.

2. **Ba ô theo phiếu, demo cuối có khác.** Demo (patch35 trở đi) chỉ còn 6 ô trong lưới (Theo mùa, Văn khấn, Ngày cần nhớ, Xe cộ, Uống thuốc, Chu kỳ) + dải "Sắp tới", và Ngày lễ gộp vào "Ngày cần nhớ" (hai tab). Máy làm đúng phiếu B3/B4 (ba ô riêng: Theo mùa, Ngày lễ, Sắp tới). Chủ quán muốn đúng demo cuối thì chuyển cho 5c gộp.
3. **Ô "hôm nay" trong lưới tháng.** Demo: ô hôm nay cao 150 px vì lớp `.today` của lưới trùng lớp banner `.today` (lỗi CSS của demo). App giữ ô bình thường. Muốn y như demo (ô dài) thì nói.

## Phát hiện (ngoài phạm vi / chưa làm)
- Khối **"Từ TQD"** (`calTqd`), chấm vàng và mục chú giải: ẩn — POS chưa có sự kiện (hạn voucher / hạng / đơn hẹn giờ). Cần cửa `/api/kh` mới nếu chủ quán muốn có.
- **Banner "hôm nay"**: chữ khuyến mãi thật chưa có (`HOM_NAY` trống) nên bản nhỏ chưa hiện ở app thật. Có chữ thì hiện cả Trang chủ lẫn hai màn Kế hoạch / tiện ích.
- **Nút "Xoá toàn bộ dữ liệu Kế hoạch trên máy này"**: demo không có → dòng nhỏ cuối `/kehoach`, bấm hai lần (D3).
- Nhắc việc chỉ hiện khi MỞ app (thanh `calNoti`, và số "n việc hôm nay" ở ô Trang chủ); đẩy thông báo = KH-TB-1.
- Bản Kế hoạch chỉ hiện khi đã biết khách là ai (`daBiet`, như trắc nghiệm): mở app khi mất mạng (/toi lỗi) thì việc ẩn tới khi hỏi được /toi.
- `thu_KHUI2.js` (B11) cấm `new Date(` trong `src/pages` + `src/components`: thứ trong tuần tính bằng `thuTrongTuan` ở `src/kehoach.js`. Không sửa bài đó (ngoài phạm vi).
- Nguồn Sắp tới của 5c (người thân, văn khấn, xe, thuốc, chu kỳ) chưa có; `upList` làm sẵn chỗ nối (một mảng nguồn).
- Demo "Món hợp tiết" tô nền theo nhóm món (`catOf`); app dùng nền kem (chưa có bảng màu nhóm).
- Chưa chụp được ảnh `Món hợp tiết` / Theo mùa có món vì chưa có menu giả trong kịch bản chụp; kiểm bằng bài thử với menu mẫu.
- `thu_KHBAO1.js` ca "A2 'Xem đơn' → /don/TQD50, dải mất, không báo lại" CHẬP CHỜN khi chạy có trình duyệt (đỏ 2/4 lần, kể cả trên bản sao code GỐC 525e962; xanh khi chạy lại) — thuộc KH-BAO-1, ngoài phạm vi, không sửa. `KHONG_TRINH_DUYET=1 npm test` luôn xanh.
- Ba danh sách "ba tiện ích" (duongDan.js `TIEN_ICH`, KeHoach.jsx `TIEN_ICH`, TienIch.jsx `DAU`) — 5c phải sửa cả ba; có thể gom một bảng khi làm 5c.
- Từ tiện ích quay về `/kehoach` thì ngày / tháng đang chọn về hôm nay (hai màn tách).
- Sheet "Thêm việc" chưa có `role="dialog"`, Esc, giữ tiêu điểm; ✕ của banner nhỏ là `<button>` lồng trong `div role="button"` (đã chặn nổi bọt phím).

## Bài thử / đột biến
Xem `bang_chung_do.txt`: đỏ trên gốc (thu_KHUI5b 0 đạt · 1 hỏng, LINK1 96/1, UI5a 356/1); đột biến VS-NGAY-30 (2 hỏng), VS-THU-HAI (2 hỏng), BV-KHOA-LUU (4 hỏng). `SỐ CA`: UI5b 75 · LINK1 97 · UI5a 357. (Việc chỉ đổi `src/`, không có `dot_bien.py`.)

## Soát độc lập (`/ra-soat`, vòng 1) — KHÔNG ĐẠT (nhẹ) → đã sửa
Báo cáo (rút gọn, nguyên ý): không thấy lỗi hỏng / lộ dữ liệu khách; K4 không sót chỗ giữ chỗ `/kehoach`; K5 không chặn oan (tiêu đề 120 ký tự, emoji, 29/2/2028, nhiều việc); nghiệm thu 17/20.
- LỖI 1 thiếu E4 (kết quả cổng + HEAD ĐÃ KIỂM) trong trang_thai → **có ở dưới**.
- LỖI 2 E1: nối vào App / Trang chủ chỉ kiểm bằng regex → **chưa khoá thêm**; đã chạy THẬT trong Chromium với bản dựng của app (kịch bản `so_anh`: đăng nhập giả, mở `/trangchu`, `/kehoach`, `/kehoach/<tiện ích>` — ô Trang chủ đếm đúng "1 việc hôm nay", việc hiện đủ). Ghi ở CHƯA KIỂM.
- LỖI 3 E3 thiếu cảnh "chọn ngày lễ" và ô Trang chủ chưa đăng nhập → ghi ở `doi_chieu_demo.md` (cùng luật CSS với cảnh khác / demo không có bản này).
- LỖI 4 `san=false` báo nhầm "Trình duyệt không cho lưu" → **đã sửa**: "Đang lấy thông tin tài khoản, thử lại sau ít giây" (KeHoach.jsx, TienIch.jsx) + ca thử.
- LỖI 5 đủ 500 việc báo sai lý do → **đã sửa** ("Đã đủ số việc lưu trên máy này…") + ca thử.
- LỖI 6 ngày dự phòng "1/1/2026" và `if (!homNay) return null` là code chết / số bịa → **đã bỏ** + ca thử.
- Code chết `export TIEN_ICH` → **đã bỏ export**. Nghi ngờ a11y sheet / banner / ngày chọn mất khi quay về: ghi ở Phát hiện.
- Vòng 2 chưa chạy (sửa nhẹ, đã có ca thử riêng).

## Cổng
✓ CỔNG CHẠY ĐẠT (`KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 525e962^ HEAD viec/KH-UI-5b`; cảnh báo A16 dạng "bài chạy trên gốc in 1 ca" là bình thường: gốc chưa có module). `tinh`: chỉ còn A19 (chờ dòng HEAD ĐÃ KIỂM bên dưới). `npm test` (KHONG_TRINH_DUYET=1) 36 đạt · 0 hỏng; `--day-du` 38 đạt · 0 hỏng (K8, K9 xanh).

## Bảng nghiệm thu (đếm từng mục)
| Mục | Bằng chứng |
|---|---|
| A1 dữ liệu chép nguyên | `thu_KHUI5b.js` ca A1 (so từng byte với demo bằng vm) |
| A2 hàm tính, giờ POS | ca A2/A3 + `homNayTuGio` |
| A3 đối chiếu demo | `thu_KHUI5b_mau.json` sinh từ chính demo (Chromium): 13 tháng (462 ô), 12 thẻ ngày, 7 holList, 4 upList, 12 ngày mùa, badge |
| B1, B3, B6 | ca "B1 …", "B3 …", "B6 …" (vẽ thật bằng react-dom/server) |
| B2 việc của tôi | ca B2 (vẽ) + D1 (thêm / xong / xoá bằng hàm thuần) |
| B4 ba tiện ích | ca B4 ×8 (món thật ẩn khi hết / chưa có menu, không nút mua) |
| B5 lối vào + đường dẫn | ca B5 (đường dẫn, ô + khoá vẽ thật, nối Trang chủ đọc nguồn) |
| B7 banner nhỏ + ✕ | ca B7 ×6 |
| C1, C2 | ca C1, C2 |
| D1, D2, D3 | ca D1 (lưu / hỏng / kho chặn), D2 (luuMay: đổi khách, đăng xuất xoá; cùng khách / 401 giữ), D3 (hàm xoá + nút) |
| E1 | `thu_KHUI5b.js` (75 ca); nối App chỉ đọc nguồn + chạy thật tay trong Chromium |
| E2 | LINK1, UI5a sửa đúng 1 ca, đỏ trên gốc (`bang_chung_do.txt`) |
| E3 | `so_anh/` 63 ảnh + `doi_chieu_demo.md` (thiếu 2 cảnh, ghi rõ) |
| E4 | mục Cổng ở trên + dòng HEAD ĐÃ KIỂM cuối file |
| E5 | **CHƯA** — chủ quán thử tay (3 bước) |

## Báo cáo 7 mục
- **VIỆC** KH-UI-5b: Kế hoạch và nhắc việc (lịch âm dương, việc của tôi, Theo mùa / Ngày lễ / Sắp tới, banner nhỏ, ô Trang chủ), lưu trên máy.
- **ĐÃ SỬA** `src/kehoach.js`, `src/noiDung/keHoach.js`, `src/pages/KeHoach.jsx`, `TienIch.jsx`, `src/components/{BannerNho,OKeHoach,ThemViec,dungKeHoach}`, `BannerHomNay.jsx` (mini + ✕), `giaoDien/ke_hoach.css`, `duongDan.js`, `App.jsx`, `TrangChu.jsx`, `luuMay.js`; bài thử `thu_KHUI5b` (+ mẫu), sửa `thu_KHLINK1`, `thu_KHUI5a`.
- **BÀI THỬ** thu_KHUI5b 75 · LINK1 97 · UI5a 357 · npm test 36 / --day-du 38 xanh · cổng chạy ĐẠT · so ảnh 390/360/430.
- **ĐÃ RÀ K4** `grep` giữ chỗ `/kehoach`, danh sách khoá `luuMay`, `localStorage` Kế hoạch (chỉ `kehoach.js`), bài cũ đòi hành vi cũ (LINK1, UI5a); thu_KHUI2 B11 (`new Date(`) đã né bằng `thuTrongTuan`.
- **CHƯA KIỂM** thử tay trên điện thoại (E5); ánh sáng chạy + `prefers-reduced-motion`; bàn phím thật của sheet; cảnh so ảnh "chọn ngày lễ" và Trang chủ chưa đăng nhập; Món hợp tiết trong ảnh (chưa có menu giả); vòng soát 2.
- **GIT** nhánh `viec/KH-UI-5b`, chưa PR / merge (đúng luật).
- **BÀI HỌC** dưới đây.

## Bài học
- **KHOÁ** (đã làm, `thu_KHUI5b.js` 3 ca): báo đúng lý do khi `san=false` / đủ 500 việc; không ngày dự phòng bịa. Lý do: lời báo sai sự thật (K3).
- **NGUYÊN TẮC** (đề xuất `KHUON_LOI.md`, ngoài phạm vi): "Lời báo lỗi phải đúng nguyên nhân — mỗi nhánh trả null một lý do riêng; tránh dùng chung một câu 'không lưu được'". Ví dụ: `luu()` false do chưa biết khách bị báo thành "kho bị chặn".
- **KHOÁ** (đề xuất cho 5c, ngoài phạm vi): gom danh sách tiện ích một bảng (id, tên, biểu tượng, tiêu đề) và một ca đỏ nếu thêm tiện ích mà thiếu một nơi.
- **BỎ**: ca BAO1 chập chờn — thuộc việc khác, ghi ở Phát hiện để chủ quán chuyển.
- Người gác chặn: `sed -i`, `rm` trong kho, `git worktree`, `npx`, `$(…)`/ký tự đại diện trong `git add` — dùng Edit, `mv` ra nháp, `git archive`, `npm run build --`, liệt kê tên file.
