# KH-LINK-1 — Đường dẫn thật cho từng trang (tuquyduong.com/trangchu, /menu…) · Trang chủ khách đầy đủ · khoá tiện ích khi chưa đăng nhập

<!-- Chat App KH soạn 29.10.2026 theo chủ quán (29.10). Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 30.10. Làm TRƯỚC KH-UI-5a / 5b / KH-UI-4
     để mọi màn sau dùng chung đường dẫn. Đọc CLAUDE.md §5 (chuẩn theo demo, K9, tự so ảnh; mục "Đường dẫn" và "Khoá tiện ích" mới thêm).
     Hiện app điều hướng bằng trạng thái `tab` + ngăn xếp màn con (`src/dieuHuong.js`), thanh địa chỉ luôn là "/". Việc này đổi sang đường dẫn thật,
     KHÔNG thư viện (tự viết bộ định tuyến gọn bằng History API), giữ nguyên mọi hành vi đã có (Menu giữ trạng thái, Back, đăng nhập quay về đúng chỗ…). -->

## Mục tiêu
Đường dẫn là theo TRANG, không theo thiết bị: điện thoại, máy tính bảng, máy tính dùng CHUNG một đường dẫn; giao diện tự đổi theo bề rộng màn hình
(< 1024 px kiểu điện thoại, ≥ 1024 px kiểu website — KH-UI-4), KHÔNG có đường dẫn riêng cho máy tính, không hỏi khách dùng máy gì.
Mỗi trang của app có địa chỉ riêng, dễ đọc, gửi cho người khác được, mở thẳng được, nút Back / Tiến của trình duyệt và điện thoại chạy đúng.
Trang chủ khi chưa đăng nhập hiện ĐẦY ĐỦ như đã đăng nhập (trừ phần riêng của khách); các tiện ích cần tài khoản hiện MỜ kèm "Đăng nhập để mở khoá".

## Nghiệm thu

### A. Bảng đường dẫn (chữ thường, không dấu, không gạch dưới)
| Đường dẫn | Trang | Cần đăng nhập |
|---|---|---|
| `/` | màn mở → thay bằng `/trangchu` (replace, không thêm lịch sử) | không |
| `/trangchu` | Trang chủ | không |
| `/menu` · `/menu/<nhom>` | Menu (`<nhom>` = tên nhóm POS bỏ dấu, nối bằng `-`, vd `/menu/tra-dong-y`) | không |
| `/mon/<ten-mon>` | Trang món (tên món bỏ dấu nối `-`; trùng tên thì thêm `-<mã>`) | không |
| `/uudai` | Ưu đãi | có |
| `/taikhoan` · `/taikhoan/thongtin` · `/taikhoan/donhang` · `/taikhoan/donhang/<ma>` · `/taikhoan/hotro` | Tài khoản và trang con | có (trừ `hotro`) |
| `/mathanhvien` | Mã thành viên (QR) | có |
| `/dangnhap` | Đăng nhập / Đăng ký (`?tiep=<đường dẫn>` = trang quay về sau khi xong) | không |
| `/tracnghiem…`, `/kehoach…` | để dành cho KH-UI-5a / 5b (việc này chỉ GIỮ CHỖ trong bảng, chưa làm màn) | — |
| `/admin` | để dành cho khu quản trị (sau khai trương) — việc này: chuyển về `/trangchu`, KHÔNG hiện gì về quản trị | — |
| đường dẫn lạ | trang "Không tìm thấy trang" dáng demo + nút "Về Trang chủ" | không |
- A1 Bộ định tuyến tự viết, một file `src/duongDan.js`: bảng trên (MỘT chỗ khai báo), hàm thuần `docDuongDan(path) → trang + tham số` và
  `taoDuongDan(trang, thamSo) → path`, hàm `bỏ dấu → slug` dùng chung (đ/Đ → d, bỏ mọi dấu, chữ thường, ký tự khác chữ / số → `-`, gộp `-` liền
  nhau, bỏ `-` hai đầu). Chấp nhận cả dấu `/` thừa ở cuối và chữ hoa khi đọc (`/Menu/` = `/menu`). Bài thử cho mọi dòng của bảng, chiều đi và về.
- A1b `/mon/<ten-mon>` tìm món theo slug trong menu POS (bản đang có / bản lưu trên máy); chưa có menu (khách chưa đăng nhập, POS chưa mở `/menu`) →
  thẻ "Đăng nhập để xem menu và giá" như Menu; có menu mà không có món đó (đã ngừng bán) → "Không tìm thấy món" + nút "Xem Menu".
- A1c Màn mở (Mái đình) vẫn hiện ở lần mở đầu mỗi phiên với MỌI đường dẫn (link chia sẻ vào thẳng một món cũng qua màn mở), xong vào ĐÚNG trang của
  link — không phải về Trang chủ.
- A2 Đổi tab / mở màn con / quay lại = đổi đường dẫn bằng `history.pushState` / `popstate`; tiêu đề tab trình duyệt theo trang
  (vd "Menu · Tứ Quý Đường", "<Tên món> · Tứ Quý Đường").
- A3 **Mở thẳng** mọi đường dẫn (gõ vào thanh địa chỉ, link chia sẻ, tải lại trang) ra đúng trang. Trang cần đăng nhập mà chưa đăng nhập → `/dangnhap?tiep=…`
  → xong quay về đúng trang đó. `?ma=` (link QR hoá đơn) chạy được trên MỌI đường dẫn như hiện nay.
- A4 Cloudflare Pages: mở thẳng `/menu`, `/mon/...` phải trả `index.html` — KHÔNG tạo `404.html` (Pages tự phục vụ kiểu ứng dụng một trang); ghi vào
  `trang_thai.md` cách chủ quán thử (mở thẳng tuquyduong.com/menu trên điện thoại). Đường dẫn ảnh, âm thanh, manifest dùng địa chỉ tuyệt đối từ gốc
  (`/anh/...`) để trang con không hỏng ảnh.
- A5 Giữ nguyên mọi hành vi đã có và bài thử cũ xanh: Menu giữ ô tìm / nhóm / vị trí cuộn khi quay lại; Back của điện thoại không thoát app giữa chừng;
  đăng nhập 3 bước; đăng xuất về `/trangchu`; 401 → chế độ khách (trang cần đăng nhập thì về `/trangchu`).

### B. Trang chủ khi chưa đăng nhập — ĐẦY ĐỦ
- B1 Hiện đủ các khối như khi đã đăng nhập, đúng thứ tự demo; chỉ khác: lời chào "Chào bạn", thẻ vàng mời đăng nhập thay thẻ điểm (đã có).
  Khối nào trống vì THIẾU NỘI DUNG / DỮ LIỆU (món nổi bật chưa điền, `/menu` chưa mở cho khách) thì xử lý như khi đã đăng nhập — không ẩn riêng
  vì là khách.
- B2 **Khoá tiện ích** (luật CLAUDE.md §5): thành phần dùng chung `src/components/KhoaTienIch.jsx` — bọc một ô tiện ích: chưa đăng nhập thì ô hiện
  MỜ (giữ nguyên hình, chữ, vị trí như demo), có biểu tượng khoá nhỏ và dòng "Đăng nhập để mở khoá chức năng"; chạm → `/dangnhap?tiep=<trang tiện ích>`.
  Đã đăng nhập: hiện bình thường. Việc này làm thành phần + bài thử; KH-UI-5a (Trắc nghiệm), KH-UI-5b (Kế hoạch và nhắc việc) dùng nó khi thêm ô.
  Màu / độ mờ lấy từ demo (K9) — demo có kiểu ô bị khoá thì chép, không có thì dùng `opacity` (không thêm màu mới).

### C. Kiểm
- C1 `cong_cu/thu_KHLINK1.js`: bảng đường dẫn hai chiều, slug (dấu, đ, khoảng trắng, ký tự lạ, trùng tên, chữ hoa, `/` thừa), `/mon/` (có / không có
  menu / món đã ngừng), trang cần đăng nhập → `/dangnhap?tiep=`,
  `tiep` chỉ nhận đường dẫn nội bộ (bắt đầu bằng `/`, không `//`, không `http`) — chống chuyển hướng ra trang lạ, đường dẫn lạ → không tìm thấy,
  `/admin` → `/trangchu`, `KhoaTienIch` (khách / đã đăng nhập).
- C2 Chạy thử bằng trình duyệt (Playwright ở nháp): mở thẳng từng đường dẫn, bấm tab, Back / Tiến, tải lại giữa chừng, đăng nhập từ trang cần đăng nhập
  — ở 390 / 360 / 430; ảnh vào `viec/KH-LINK-1/so_anh/` + `doi_chieu_demo.md` cho Trang chủ khách.
- C3 `npm test`, `--day-du` (K8, K9) xanh; `node tu_chay/cong.js chay` ĐẠT.
- C4 Chủ quán thử tay (≤ 3 thao tác, trên tuquyduong.com hoặc app-kh.pages.dev sau khi gộp): (1) mở thẳng `/menu` trên điện thoại; (2) bấm qua các tab
  xem thanh địa chỉ đổi theo, bấm Back; (3) ở cửa sổ ẩn danh mở `/uudai` → hiện đăng nhập → xong vào Ưu đãi.

## Phạm vi
- viec/KH-LINK-1/**
- src/**
- public/**
- index.html
- cong_cu/thu_KHLINK1.js
- cong_cu/thu_KHUI2.js
- cong_cu/thu_KHXEM1.js

## Bài thử đỏ
không — điều hướng giao diện, không tiền, không dữ liệu; hàm thuần có bài cong_cu/thu_KHLINK1.js (bài cũ chỉ sửa chỗ khớp chữ App.jsx nếu vỡ do đổi cấu trúc, không bớt ca)

## Ngân sách
~350 dòng app (bộ định tuyến + nối vào App + trang không tìm thấy + KhoaTienIch) + ~200 dòng thử. **Phương án đơn giản nhất đã xét:** thay "tab + ngăn xếp"
bằng một bảng đường dẫn và History API, giữ nguyên các màn; không thư viện định tuyến.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/`.
- Không làm khu quản trị, không hiện bất cứ gì về quản trị trong app khách. Không tạo `404.html`. Không thư viện định tuyến.
- Không cửa ngoài hợp đồng; không bí mật trong code / log. Chỉ push `git push -u origin viec/KH-LINK-1`. Không đụng `main`, không merge, không tạo PR.
