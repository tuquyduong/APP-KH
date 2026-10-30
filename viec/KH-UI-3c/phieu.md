# KH-UI-3c — Hai ô ở Trang chủ: ô Trắc nghiệm khoá không che chữ; ô Giờ vàng luôn có mặt, mờ khi chưa có

<!-- Chat App KH soạn 30.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 02.11. Làm SAU KH-UI-3a (đã gộp).
     Chủ quán xem bản xem thử KH-UI-3a trên điện thoại (30.10) và thấy: (1) ô Trắc nghiệm khoá bị viên nhãn "Đăng nhập để mở khoá chức năng" che nửa chữ — trông như vỡ;
     (2) khi POS không có Giờ vàng, ô Trắc nghiệm đứng một mình chiếm cả hàng, khác demo.
     Chủ quán chốt (30.10, "theo đề nghị"):
       a. Ô khoá GIỮ hình demo (biểu tượng cái cân, chữ "TRẮC NGHIỆM"); dòng phụ "Bạn thuộc thể chất nào?" được THAY bằng dòng khoá, không phủ viên nào lên chữ.
       b. Ô Giờ vàng luôn nằm cạnh ô Trắc nghiệm (hai ô một hàng như demo). Giờ vàng chưa có / tắt / chưa tải được → ô MỜ, không chạm được, chữ "Giờ vàng · Hiện chưa có".
          Khi có chương trình Giờ vàng thì ô như KH-UI-3a (không đổi).
     Không đổi hợp đồng, không gọi cửa mới. Không màu / phông mới (K9). -->

## Mục tiêu
Trang chủ luôn có hai ô một hàng (Giờ vàng · Trắc nghiệm) đúng khung demo; ô nào chưa dùng được thì MỜ nhưng chữ vẫn đọc được, không có chữ bị che.

## Nghiệm thu

### A. Ô Trắc nghiệm chưa đăng nhập
- A1 Giữ hình ô như demo `hbQuiz`: biểu tượng cái cân, nhãn "TRẮC NGHIỆM". Cả ô mờ nhẹ (`opacity` quanh .55; chọn giá trị để chữ nhãn vẫn đọc được ở cỡ chữ 100% và 130%).
- A2 Dòng phụ (`.hb-h`, chỗ "Bạn thuộc thể chất nào?") được THAY bằng dòng khoá: biểu tượng khoá + đúng chữ đã chốt 29.10 "Đăng nhập để mở khoá chức năng". Dòng này KHÔNG mờ (đọc rõ), được xuống dòng, ô không đổi chiều cao so với lúc đã đăng nhập.
- A3 KHÔNG còn viên nhãn nổi che lên chữ (`.khoa-nhan` phủ giữa ô) ở ô Trắc nghiệm. `KhoaTienIch` là khối dùng chung (việc sau còn dùng cho "Kế hoạch và nhắc việc"): sửa theo hướng "ô tự nhận dòng khoá làm dòng phụ" hoặc cho `KhoaTienIch` một chế độ thứ hai — chọn cách ít dòng nhất, KHÔNG làm vỡ chỗ khác đang dùng nó.
- A4 Chạm ô vẫn đi `/dangnhap?tiep=…` như hiện nay; đã đăng nhập thì ô hiện bình thường (không đổi).

### B. Ô Giờ vàng luôn có mặt
- B1 `OGioVang` không còn `return null` khi Giờ vàng tắt / không món / chưa tải được / lỗi: luôn vẽ ô `hb-tile hb-t-flash`. Có chương trình (`dang`, `truoc`, `cho`, `sau`) → như KH-UI-3a, không đổi chữ. Không có → ô MỜ cùng độ mờ với ô khoá, chữ nhãn "Giờ vàng", dòng phụ "Hiện chưa có", viên đỏ ghi "−%"; không `role="button"`, không bấm.
- B2 Giờ vàng chưa có / tắt thì KHÔNG có chữ nào về "suất", KHÔNG số % bịa, KHÔNG đếm ngược. Lỗi mạng của `/gio-vang` cũng ra ô mờ này (không báo lỗi to lên Trang chủ).
- B3 Trong lúc đang tải lần đầu: hiện ô mờ (không nháy "mất rồi hiện"). Khi dữ liệu về và có chương trình → ô sáng lên.
- B4 `.hb-tiles` luôn hai cột như demo. Luật CSS "giãn hết hàng khi chỉ có một ô" (do KH-UI-3a H1b thêm) cứ để — vô hại — hoặc bỏ, miễn bài thử khớp.

### C. Kiểm
- C1 `cong_cu/thu_KHUI3c.js`: phần 1 đọc nguồn / hàm thuần (chạy được không cần trình duyệt); phần 2 Chromium + POS giả: (a) chưa đăng nhập + Giờ vàng tắt → hai ô, ô Giờ vàng mờ, chữ "Hiện chưa có", ô Trắc nghiệm mờ với dòng khoá; kiểm bằng đo hình: **không phần tử nào phủ chồng lên chữ nhãn / dòng khoá của ô** (so hộp bao của chữ với hộp bao của mọi phần tử nổi), ở 360 / 390 / 430 và chữ 100% / 130%; (b) có Giờ vàng đang chạy → ô sáng, đếm ngược; (c) đã đăng nhập → ô Trắc nghiệm bình thường; (d) lỗi `/gio-vang` → ô mờ, không chữ lỗi; (e) chạm ô khoá → sang đăng nhập; chạm ô Giờ vàng mờ → không đi đâu.
- C2 **Số ca cho GitHub.** GitHub KHÔNG có trình duyệt nên phần 2 không chạy ở đó (đã làm cổng đỏ ở KH-LUU-1, KH-SLOGAN-1, KH-UI-3a). Bài `thu_KHUI3c.js` đọc biến `KHONG_TRINH_DUYET=1`: có biến → bỏ qua phần 2 (in "BỎ QUA", không tính hỏng). Không có Playwright → cũng BỎ QUA, KHÔNG tính hỏng. Dòng `SỐ CA cong_cu/thu_KHUI3c.js: N` trong `bang_chung_do.txt` ghi N khi chạy VỚI `KHONG_TRINH_DUYET=1` (số GitHub đếm). Với `thu_KHUI3a.js` đã có trong repo, nếu phiếu này buộc sửa nó và nó vẫn đang in số ca khác nhau giữa có/không trình duyệt thì ghi SỐ CA theo cách tương đương (chạy lại bài đó với Playwright bị ẩn: `NODE_OPTIONS` chặn `require('playwright')`, hoặc thêm cùng biến vào bài đó nếu nằm trong phạm vi).
- C3 Bài thử cũ phải sửa vì hành vi đổi có chủ ý (không ghi vào "Bài thử cũ sửa"): `thu_KHUI3a.js` ca E2 ("Giờ vàng tắt: ẩn ô…") và H1b (nếu bỏ luật CSS); `thu_KHUI5a.js` / `thu_KHLINK1.js` nếu có ca đòi `.khoa-nhan` phủ giữa ô hay `opacity .3`. Chỉ sửa đúng các ca đó, không bớt ca khác.
- C4 `npm test`, `--day-du` (K8, K9), `node tu_chay/cong.js chay` ĐẠT. Đột biến VS-: ít nhất 3 (vd. ô Giờ vàng quay lại `return null`; dòng khoá quay về viên nổi; ô mờ cho bấm được) — bài thử phải bắt.
- C5 So ảnh: Trang chủ chưa đăng nhập + Giờ vàng tắt ở 360 / 390 / 430 (chữ 100% và 130%) vào `viec/KH-UI-3c/so_anh/`; ô Trắc nghiệm so với ảnh demo `hbQuiz` (biểu tượng, nhãn, cỡ ô); bảng `doi_chieu_demo.md`: khác demo ở đúng hai chỗ (ô mờ, dòng khoá) và vì sao (quyết định chủ quán).
- C6 Chủ quán thử tay (≤ 2 bước): (1) mở bản xem thử, CHƯA đăng nhập → Trang chủ có hai ô một hàng, ô Giờ vàng mờ "Hiện chưa có", ô Trắc nghiệm mờ với dòng "🔒 Đăng nhập để mở khoá chức năng" đọc rõ; (2) chạm ô Trắc nghiệm → sang đăng nhập.

## Phạm vi
- viec/KH-UI-3c/**
- src/**
- cong_cu/thu_KHUI3c.js
- cong_cu/thu_KHUI3a.js
- cong_cu/thu_KHUI5a.js
- cong_cu/thu_KHLINK1.js

## Bài thử đỏ
Có — `cong_cu/thu_KHUI3c.js` ĐỎ trên code gốc (ô Giờ vàng còn `return null`, còn viên nổi `.khoa-nhan`).

## Ngân sách
~40 dòng app + ~150 dòng thử. **Phương án đơn giản nhất đã xét:** `OGioVang` luôn vẽ, thêm một lớp CSS "mờ"; ô khoá đổi dòng phụ thay vì phủ viên; không đụng hợp đồng, không thêm màu.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/`, `index.html`.
- KHÔNG thêm màu / phông ngoài demo (độ mờ dùng `opacity`). KHÔNG chữ về "suất". KHÔNG tự tính giá.
- Chỉ push `git push -u origin viec/KH-UI-3c`. Không đụng `main`, không merge, không tạo PR.
