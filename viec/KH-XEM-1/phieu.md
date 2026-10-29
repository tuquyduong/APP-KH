# KH-XEM-1 — Khách vào thẳng Trang chủ sau màn mở; đăng nhập / đăng ký chỉ khi cần

<!-- Chat App KH soạn 29.10.2026 theo yêu cầu chủ quán (thử trên app-kh.pages.dev: màn Đăng nhập hiện ngay sau màn mở — không muốn thế).
     Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 30.10. Đọc CLAUDE.md §5 (chuẩn theo demo, K9, tự so ảnh) trước khi làm.
     Hợp đồng /api/kh: thiet_ke/HOP_DONG_API_KH.md (bản chép v1). /menu hiện CẦN token — chat đã nhờ POS mở /menu cho khách chưa đăng nhập trong
     KH-API-2 (v2). App làm sao để: POS mở là chạy ngay, chưa mở thì vẫn đẹp, không lỗi. -->

## Mục tiêu
Khách quét QR, gõ tuquyduong.com, hay mở app từ màn hình chính: xem màn mở xong là vào **Trang chủ** ngay, LÚC NÀO cũng xem được Trang chủ,
Menu, giá, từng món. App chỉ mời đăng nhập / đăng ký khi khách cần thứ của riêng mình (Ưu đãi, Tài khoản, mã thành viên, nhận điểm) — đăng nhập
xong đưa khách về đúng chỗ đang định vào. Đăng nhập = nhận MÃ QUA ZALO (POS gửi); lần đầu = đăng ký luôn (SĐT + mã + tên). Đăng nhập một lần,
app nhớ 30 ngày (POS cấp phiên 30 ngày, app giữ trên máy) — trong 30 ngày không hỏi lại.

## Nghiệm thu

### A. Luồng
- A1 Sau màn mở → **Trang chủ** cho MỌI khách (bỏ việc chưa đăng nhập thì hiện màn Đăng nhập trước).
- A2 Chưa đăng nhập, Trang chủ: lời chào "Chào bạn" (dòng phụ như demo); chỗ thẻ hội viên là **thẻ mời** cùng dáng thẻ vàng của demo (`points-card`,
  logo, hoạ tiết): "Thành viên Tứ Quý Đường" + "Đăng nhập / Đăng ký để tích điểm, nhận ưu đãi" + nút "Đăng nhập". Chữ đặt ở `src/noiDung/`.
  Các khối còn lại như khi đã đăng nhập (khối nào cần dữ liệu riêng của khách thì ẩn).
- A3 Thanh tab đủ 4 mục. Chưa đăng nhập mà bấm **Ưu đãi**, **Tài khoản**, hoặc nút **mã thành viên (QR)** → mở màn Đăng nhập dạng màn con (có nút
  ✕ và nút Back của điện thoại để quay lại chỗ cũ). Đăng nhập xong → vào ĐÚNG chỗ đã bấm (Ưu đãi / Tài khoản / màn QR).
- A4 **Menu, Trang món — lúc nào cũng xem được**: chưa đăng nhập thì gọi `GET /menu` KHÔNG kèm token (POS bỏ yêu cầu đăng nhập cho cửa này trong
  KH-API-2, hợp đồng v2). Đã đăng nhập: gọi kèm token như cũ. Không có lời gọi nào ngoài hợp đồng (K8).
  - **Lưu bản menu gần nhất trên máy khách** (localStorage, chỉ dữ liệu menu công khai, khoá riêng `kh_menu`): mở app là hiện ngay bản đã lưu,
    rồi lấy bản mới thay vào; mạng chập chờn / POS chậm vẫn có menu để xem (dòng nhỏ "Giá cập nhật lúc <giờ>" khi đang dùng bản đã lưu).
  - CHỈ trong vài ngày trước khi POS xong KH-API-2: POS còn trả 401 cho lời gọi không token và máy chưa có bản lưu → hiện thẻ "Đăng nhập để xem menu
    và giá" (dáng thẻ demo) thay vì lỗi. POS xong là menu tự hiện, không sửa app.
- A5 Link QR hoá đơn `?ma=` khi chưa đăng nhập: mở màn Đăng nhập NGAY với dòng "Đăng nhập để nhận điểm cho hoá đơn này"; xong → Ưu đãi, mã điền
  sẵn (như cũ). Bấm ✕ → về Trang chủ; mã vẫn giữ trong bộ nhớ trang — lần đăng nhập sau trong phiên vẫn đưa vào Ưu đãi với mã đó.
- A6 **Đăng nhập / đăng ký — 3 bước, mỗi bước một việc** (chủ quán chốt 29.10):
  1. **Số điện thoại**: tiêu đề "Đăng nhập / Đăng ký", CHỈ một ô số điện thoại + nút "Tiếp tục"; một dòng nhỏ "Nhận mã đăng nhập qua Zalo".
     Không hỏi tên ở bước này.
  2. **Mã 6 số**: POS trả `lay_ma_tai_quay = false` → "Mã đã gửi qua Zalo tới số <SĐT che giữa>" + nút "Gửi lại mã" mở sau 60 giây;
     `lay_ma_tai_quay = true` (POS chưa bật Zalo) → "Hỏi nhân viên quầy để lấy mã đăng nhập". Khách CŨ nhập đúng mã → vào app luôn.
     Không ghi cứng "lấy mã ở quầy" ở đâu khác.
  3. **Thông tin của bạn** — CHỈ khách MỚI (POS trả `CAN_TEN`: mã đúng, số chưa có tài khoản; mã CHƯA bị dùng): màn riêng sau khi xác minh xong,
     gồm **Tên** (bắt buộc), **Cách xưng hô** (bắt buộc — chọn: Anh · Chị · Cô · Chú · Bác · Em · Bạn), **Địa chỉ nhận hàng** (KHÔNG bắt buộc,
     ghi chú nhỏ: "Dùng làm địa chỉ giao hàng mặc định khi bạn đặt online; sửa được trong Tài khoản"). Nút "Hoàn tất" → gửi lại `xac-minh` với cùng
     số + mã + tên → vào app. Mã sống 5 phút: hết hạn (`MA_HET_HAN`) thì GIỮ nguyên chữ đã nhập, hiện "Mã đã hết hạn" + nút "Gửi lại mã".
     **Xưng hô, Địa chỉ chỉ được GỬI khi `thiet_ke/HOP_DONG_API_KH.md` ghi cửa nhận các trường đó** (chat đã nhờ POS thêm ở KH-API-2, hợp đồng v2).
     Lúc làm việc này mà hợp đồng chưa có → màn chỉ hiện ô Tên (hai ô kia dựng sẵn, tắt bằng MỘT hằng số trong `src/noiDung/`), ghi `## Câu hỏi`;
     việc KH-UI-3 bật lên khi hợp đồng v2 có. KHÔNG gửi trường ngoài hợp đồng.
  - Chữ của 3 bước đặt ở `src/noiDung/`. Mở từ màn khác thì có nút ✕ (bước 3 không có ✕ — đã xác minh thì phải hoàn tất hoặc quay lại bước 1).
  - Đăng nhập xong app giữ phiên trên máy (như hiện nay) — 30 ngày không hỏi lại; hết hạn (POS trả 401) thì về chế độ khách như A8.
- A7 Đăng xuất → về Trang chủ ở chế độ khách (không bật màn Đăng nhập).
- A8 401 giữa phiên (đã đăng nhập): dọn phiên ở MỘT chỗ như hiện nay (`donPhien`) → chế độ khách; đang ở Ưu đãi / Tài khoản / màn con riêng thì về
  Trang chủ. Không bật màn Đăng nhập tự động.

### B. Kiểm
- B1 Bài thử `cong_cu/thu_KHXEM1.js` (dòng cuối "n đạt · m hỏng"): hàm thuần quyết định "bấm chỗ X khi chưa / đã đăng nhập → mở gì, đăng nhập xong
  về đâu" (4 tab + QR + `?ma=` + ✕), `/menu` không token (có dữ liệu / 401 khi chưa có bản lưu / có bản lưu), đọc–ghi bản menu lưu (hỏng / rỗng → bỏ qua),
  lời màn Đăng nhập cho cả hai trường hợp Zalo / quầy, chuyển bước 1→2→3 (khách cũ / khách mới / CAN_TEN / MA_HET_HAN giữ chữ),
  hằng số bật ô Xưng hô–Địa chỉ, 401 giữa phiên (→ chế độ khách).
- B2 Tự so ảnh (CLAUDE.md §5): Trang chủ chế độ khách, Menu khi `/menu` 401, 3 bước Đăng nhập / Đăng ký — 390 / 360 / 430; lưu `viec/KH-XEM-1/so_anh/`
  + `doi_chieu_demo.md`.
- B3 `npm test`, `--day-du` (K8, K9) xanh; `node tu_chay/cong.js chay` ĐẠT.
- B4 Chủ quán thử tay (≤ 3 thao tác, trên app-kh.pages.dev sau khi gộp — hoặc địa chỉ xem thử của nhánh): (1) mở app ở cửa sổ ẩn danh → màn mở → Trang
  chủ, không bị hỏi đăng nhập; (2) bấm Ưu đãi → hiện Đăng nhập → đăng nhập → vào thẳng Ưu đãi; (3) Tài khoản → Đăng xuất → về Trang chủ.

## Phạm vi
- viec/KH-XEM-1/**
- src/**
- cong_cu/thu_KHXEM1.js

## Bài thử đỏ
không — luồng giao diện, không tiền, không dữ liệu; hàm thuần có bài cong_cu/thu_KHXEM1.js chạy riêng

## Ngân sách
~380 dòng app + ~180 dòng thử. **Phương án đơn giản nhất đã xét:** giữ nguyên cách điều hướng hiện có (tab + ngăn xếp màn con), chỉ đổi điều kiện
"chưa đăng nhập": thay vì chặn cả app, màn Đăng nhập thành một màn con có đích quay về.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/`.
- Không gọi cửa nào ngoài hợp đồng; localStorage chỉ có: token, cờ màn mở, bản menu công khai (`kh_menu`) — không lưu gì của khách ngoài token.
- Không bí mật trong code / log. Chỉ push `git push -u origin viec/KH-XEM-1`. Không đụng `main`, không merge, không tạo PR.
