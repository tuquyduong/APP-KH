# KH-UI-3a — Nối hợp đồng v2: hạng, số dư ví, giá theo hạng, Giờ vàng, giờ hoạt động + "bây giờ" của POS

<!-- Chat App KH soạn 30.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết (chat soát kỹ phần GIÁ vì là tiền). Hạn 02.11.
     POS đã gộp KH-API-2 (main POS 6f2c30b, 29.10): hợp đồng PHIÊN BẢN 2 đã chép nguyên văn vào thiet_ke/HOP_DONG_API_KH.md (chat chép; máy KHÔNG sửa). Đọc kỹ các mục
     "Ghi chú các trường mới (v2)", "Giờ vàng", "Giờ hoạt động" trong file đó và thiet_ke/trao_doi/TRA_LOI_POS_30102026.md.
     KH-UI-3 cũ được TÁCH: 3a = phần v2 (việc này, làm được ngay); 3b = phần v3 (đăng ký 3 bước có xưng hô / địa chỉ, sửa hồ sơ, `/menu` không cần token, tự gia hạn, lời chào theo xưng hô) — CHỜ POS gộp KH-API-3. KHÔNG làm phần v3 ở đây.
     Nguồn chuẩn giao diện: thiet_ke/app_kh_demo.html — hạng trên thẻ (`points-card`, TIERS), giá hạng (`tierPrice`… tìm "Giá hội viên theo hạng", dòng ~3250), Giờ vàng (`GV`, `gvState`, `gvText`, `gvTick`, pill `gv`, `gv-note`, ô `hbFlash*` ở Trang chủ, ô "Giờ vàng" trong lưới nhóm Menu),
     Tài khoản (thẻ đầu + 3 ô nhanh Ví / Điểm / Voucher). Đọc CLAUDE.md §5 (chuẩn theo demo, K9, tự so ảnh), §6 (giờ VN), §8 (lưu trên máy). -->

## Mục tiêu
Khách thấy đúng hạng, số dư ví, GIÁ của mình theo hạng, Giờ vàng đang chạy và quán đang mở hay đóng — tất cả lấy từ POS, App không tự tính tiền. "Bây giờ" của App theo đồng hồ máy chủ POS, không theo đồng hồ điện thoại.

## Nghiệm thu

### A. Lớp gọi mạng (`src/api.js` — chỗ duy nhất gọi mạng)
- A1 Thêm đúng các lời gọi có trong hợp đồng v2: `GET /hang`, `GET /gio-vang`, `GET /gio-hoat-dong` (cả ba KHÔNG cần token — chưa đăng nhập vẫn gọi được), viết thẳng `goi('GET', '/…')` để K8 đối chiếu. `GET /toi` và `GET /menu` đã có: chỉ đọc thêm trường mới (`khach.hang`, `khach.so_du_vi`, `data[].gia_hang`).
- A2 Trường nào hợp đồng chưa ghi thì KHÔNG đoán; có thắc mắc → `## Câu hỏi`. Lỗi giữ cách cũ: hiện nguyên `error` của POS.
- A3 Cửa nào lỗi / chậm thì phần giao diện của cửa đó ẨN hoặc hiện bản đã có, KHÔNG làm cả app hỏng và KHÔNG hiện số bịa.

### B. "Bây giờ" theo POS (CLAUDE.md §6)
- B1 Mô-đun `src/bayGio.js`: lấy `bay_gio` của `/gio-hoat-dong` mỗi lần mở app và mỗi lần hỏi lại; giữa hai lần hỏi đếm giây bằng đồng hồ máy (độ lệch = `bay_gio` − đồng hồ máy lúc nhận). Chưa có / lỗi → rơi về `gioVn()` hiện có (đồng hồ máy + 7 giờ, không phụ thuộc múi giờ máy) và KHÔNG báo lỗi cho khách.
- B2 Chỗ đang dùng `gioVn()` làm "bây giờ" (đếm ngược, "hôm nay" của trắc nghiệm / lịch, ngày lưu kết quả) đổi sang hàm mới MỘT chỗ — không rải. `new Date(chuỗi giờ POS)` vẫn CẤM; giờ POS hiện đúng như chuỗi (`dinhDangNgay`).
- B3 Bài thử với `TZ=UTC` và `TZ=Asia/Ho_Chi_Minh` cho cùng kết quả; đồng hồ máy lệch cả giờ vẫn ra đúng giờ POS.

### C. Hạng và số dư ví
- C1 Thẻ hội viên ở Trang chủ (khi đã đăng nhập) hiện hạng như demo (tên hạng + % giảm; hạng `null` = chưa có hạng → như bản chưa có hạng của demo, không hiện "Thường 0%" bịa nếu demo không hiện). `het_han` hiện theo giờ VN, đúng chuỗi.
- C2 Tài khoản: thẻ đầu (tên + hạng), 3 ô nhanh **Ví** (`so_du_vi`, định dạng tiền như app), **Điểm**, **Voucher** — y demo. Ví = 0 hiện "0 đ" (số thật), không ẩn. Không bao giờ hiện chữ "nợ".
- C3 Ưu đãi: hạng của khách trên thẻ như demo. Màn "Hạng thành viên · mua gói thẻ" (mua / nâng hạng) là việc sau (KH-MUA-1) — không làm; chỗ đó để trống như hiện nay.
- C4 Số dư ví chỉ lấy từ `/toi` mỗi lần mở Trang chủ / Tài khoản (không lưu lâu trên máy). Hết phiên → không còn hiện.

### D. Giá theo hạng — App KHÔNG tự nhân %
- D1 Giá hiện cho khách đã đăng nhập = `gia_hang[]` của món, dòng có `hang_id` = `khach.hang.id`; không có dòng (khách không hạng, hoặc `gia_hang` rỗng, hoặc hạng 0 %) → giá gốc `gia`. TUYỆT ĐỐI không tự tính từ `phan_tram`.
- D2 Chỗ hiện (theo demo): ô món ở Menu và Trang chủ, Trang món (giá của khách + giá gốc gạch ngang khi khác; phần "giá các hạng" như demo — lấy từ `/hang` + `gia_hang`, hạng nào POS không trả thì không hiện).
- D3 Chưa đăng nhập: giá gốc, và dòng mời "Hội viên giảm đến X%" nếu demo có (X lấy từ `/hang` — số lớn nhất `phan_tram`), chữ theo demo. Không hiện giá hạng cụ thể của người lạ ngoài những gì demo hiện.
- D4 Bản menu lưu trên máy CHỈ là bản công khai (quy tắc hiện có): bản có `gia_hang` của khách KHÔNG ghi ra máy. Đổi khách / đăng xuất thì giá hạng của người trước biến mất (bài thử).
- D5 Món đang Giờ vàng: hiện giá Giờ vàng, KHÔNG cộng giá hạng (hợp đồng: "Đơn có món đang giờ vàng thì quầy KHÔNG giảm hạng cho cả đơn — App hiện giá giờ vàng").

### E. Giờ vàng
- E1 Chép giao diện demo: ô Giờ vàng ở Trang chủ (cạnh ô Trắc nghiệm — hai ô chia hàng như demo), ô "Giờ vàng" trong lưới nhóm Menu (có trạng thái live), pill `gv` ở ô món, ghi chú `gv-note` ở Trang món, đếm ngược.
- E2 Dữ liệu từ `/gio-vang`: `dang_chay` (đúng cờ này mới là "đang giảm"), khung `bat_dau`–`ket_thuc`, `phan_tram`, `mon[]` (mã món = `ma` của `/menu`). Ngoài khung: hiện khung giờ HÔM NAY ("từ HH:mm"); tắt / không món → ẨN mọi chỗ Giờ vàng. Đếm ngược theo `bayGio` (B1); hết khung → tự đổi trạng thái, không cần tải lại.
- E3 **POS không đếm suất**: bỏ MỌI chữ về suất của demo ("còn N suất", "hết suất", "mỗi ngày N suất") — lý do (a) dữ liệu POS không có; ghi vào `doi_chieu_demo.md`. Khối "Bản demo · xem thử" của demo (`gv-demo`) KHÔNG đưa vào app.
- E4 Món Giờ vàng ở `/menu` ghép theo `ma`; mã không có trong menu → bỏ qua, không lỗi.

### F. Giờ hoạt động
- F1 Từ `/gio-hoat-dong`: Trang chủ hiện trạng thái quán — đang mở (`dang_mo`) hay đóng; đóng thì hiện `thong_bao` NGUYÊN VĂN của POS (đã điền giờ mở lại); `mo_lai_luc`. Vị trí / kiểu theo demo nếu demo có dòng trạng thái mở cửa (tìm trong demo); nếu demo không có chỗ nào thì chỉ thêm MỘT dòng nhỏ dưới lời chào Trang chủ, và ghi `## Phát hiện` để chủ quán duyệt chỗ đặt.
- F2 `nhan_don` (còn nhận đơn App) lưu sẵn trong trạng thái chung cho KH-MUA-1; việc này CHƯA có nút đặt đơn nên chưa dùng — không dựng nút giả.
- F3 `lich_tuan[]`, `ngay_nghi[]` chép vào một nơi chung (`src/gioHoatDong.js`) để KH-UI-4 (chân trang màn rộng) và Hỗ trợ dùng; việc này chỉ hiện chúng ở màn Hỗ trợ nếu demo có chỗ giờ mở cửa — không thì chưa hiện. Quy ước: `thu` 2–7 = Thứ Hai–Thứ Bảy, 8 = Chủ nhật; `mo/dong` `null` = nghỉ / chưa cài.

### G. Kiểm
- G1 `cong_cu/thu_KHUI3a.js`: dựng dữ liệu mẫu ĐÚNG hình dạng hợp đồng v2 (đọc khối `HOP_DONG_MAY_DOC` để đối chiếu tên trường); chạy thật trong Chromium với lời gọi mạng giả (chặn `/api/kh/*`). Ca: hạng `null` / có hạng / hạng 0 %; `gia_hang` rỗng; giá giờ vàng thắng giá hạng; Giờ vàng chạy / chưa tới / hết khung / tắt; quán mở / đóng / nghỉ / chưa cài lịch; `bay_gio` lệch đồng hồ máy; `TZ=UTC`; cửa lỗi (từng cửa một) không làm hỏng app; đổi khách không lộ giá hạng cũ. Dòng cuối "n đạt · m hỏng".
- G2 Tự so ảnh demo ↔ app (CLAUDE.md §5) 390 / 360 / 430: Trang chủ (có / chưa hạng, Giờ vàng chạy / chưa), Menu (ô Giờ vàng live), ô món có giá hạng, Trang món (giá hạng + giá giờ vàng), Tài khoản. Cùng dữ liệu mẫu như demo ở chỗ có thể. Lưu `viec/KH-UI-3a/so_anh/` + `doi_chieu_demo.md` (có dòng lý do (a) cho "suất").
- G3 `npm test`, `--day-du` (K8 với hợp đồng v2, K9), `node tu_chay/cong.js chay` ĐẠT.
- G4 Chủ quán thử tay (≤ 3 thao tác, với tài khoản có hạng): (1) Trang chủ thấy hạng + Giờ vàng; (2) Menu: giá món thấp hơn giá gốc đúng như ở quầy; (3) Tài khoản: Ví đúng số quầy hiện.

### H. Lỗi nhìn thấy trên web thật (ảnh chủ quán gửi 30.10) — sửa luôn ở việc này
- H1 Ô bị khoá (`KhoaTienIch`, dùng cho ô Trắc nghiệm ở Trang chủ; 5b sẽ dùng cho ô Kế hoạch): dòng "🔒 Đăng nhập để mở khoá chức năng" đang ĐÈ LÊN chữ của ô ("Bạn thuộc thể chất nào?") nên cả hai đều khó đọc (thấy trong ảnh so của 5a `trangchu_o_trac_nghiem_khoa_390_app.png`).
  Sửa ở `src/components/KhoaTienIch.jsx` + CSS: nhãn thành MỘT viên nền đặc (màu lấy từ demo, K9 xanh), nằm giữa ô, rộng tối đa 90% bề rộng ô, được xuống dòng (ô nửa hàng chỉ ~170 px, nhãn dài); phần ô phía sau mờ hơn một chút để chữ của ô không lộ ra chồng lên nhãn. Ô vẫn chạm được, KHÔNG đổi kích thước ô.
- H2 Kiểm bằng ảnh ở cả ba cỡ 360 / 390 / 430, ô CẢ hàng (như hiện nay) và ô NỬA hàng cạnh ô Giờ vàng, thêm cỡ chữ hệ thống 130 %; bài thử đo trong Chromium: nhãn nằm trọn trong ô và có nền đặc (không còn thấy chữ của ô xuyên qua nhãn). Lưu ảnh vào `so_anh/` + dòng trong `doi_chieu_demo.md` (khác demo vì lý do: demo không có ô khoá — chủ quán chốt 29.10).

## Phạm vi
- viec/KH-UI-3a/**
- src/**
- public/**
- cong_cu/thu_KHUI3a.js
- cong_cu/thu_KHUI2.js
- cong_cu/thu_KHXEM1.js
- cong_cu/thu_KHLINK1.js
- cong_cu/thu_KHUI5a.js

## Bài thử đỏ
Có — `cong_cu/thu_KHUI3a.js` ĐỎ trên code gốc (chưa có `bayGio.js`, chưa đọc `gia_hang` / `hang` / `so_du_vi`, chưa có ô Giờ vàng). (Ca nào của bài thử cũ đang đòi "ô Giờ vàng / hạng còn để trống" thì sửa đúng ca đó — đổi có chủ ý, không bớt ca khác.)

## Ngân sách
~700 dòng app (3 lời gọi, `bayGio`, `gioHoatDong`, hạng / ví / giá, Giờ vàng) + ~350 dòng thử. **Phương án đơn giản nhất đã xét:** chép nguyên thành phần demo, chỉ đổi nguồn số liệu sang POS; tính giá bằng tra bảng `gia_hang` (không công thức); một trạng thái chung `bayGio` + `gioHoatDong` + `gioVang` nạp một lần ở App, các màn chỉ đọc. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/` (kể cả hợp đồng).
- KHÔNG tự tính giá / % giảm / giờ vàng; KHÔNG hiện "suất"; KHÔNG làm phần v3 (xưng hô, địa chỉ, `PUT /toi`, `/gia-han`, `/menu` không token) và topping (v4) — cửa chưa có trong hợp đồng ở main thì không gọi.
- KHÔNG dựng nút đặt đơn / thanh toán giả (KH-MUA-1). Không bí mật trong code / log. Chỉ push `git push -u origin viec/KH-UI-3a`. Không đụng `main`, không merge, không tạo PR.
