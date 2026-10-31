# KH-KHOP-1 — Trang "Kiểm khớp POS": App KH tự hỏi POS thật và báo cho chủ quán cái gì đã có, cái gì còn thiếu

<!-- Chat App KH soạn 31.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 03.11. Làm SAU KH-MUA-1 (cùng chạm src/App.jsx — chỉ một dòng đường dẫn).
     Chủ quán chốt 30.10: rất cần POS và App KH khớp nhau; muốn có cách cảnh báo chức năng App KH cần mà POS chưa có, không phải chuyển lời qua lại.
     POS đồng ý (TRA_LOI_POS_30102026_d.md mục 5): chỉ đọc; gọi MỖI cửa MỘT lần khi chủ quán mở trang, không gọi tự động theo giờ.
     Bài học 30.10: app trống trơn vì địa chỉ POS thiếu `www` (CORS) và POS thiếu KH_JWT_SECRET (KH_CHUA_CAU_HINH) — trang này phải chỉ ra đúng hai lỗi kiểu đó. -->

## Mục tiêu
Chủ quán mở `/kiemkhop` trên điện thoại là thấy một bảng ✓ / ✗ / ⏳: App KH cần gì từ POS, POS đang có gì thật, thiếu gì và việc POS nào lo phần đó.

## Nghiệm thu

### A. Danh sách "App KH cần gì từ POS" — MỘT chỗ, máy đọc được
- A1 `src/kiemKhop/canTuPos.js`: mảng mục `{ ma, ten (lời thường), cua ('GET /menu'…), token (true/false/'tuy_chon'), truong: ['data[].gia_hang[].gia', …], khi: 'truoc_kt' | 'sau_kt', viec_pos: 'KH-API-3' | 'GIOVANG-1' | 'KH-SP-1' | 'KH-MUA-1' | …, ghi_chu }`.
  Lấy từ `thiet_ke/DOI_CHIEU_TINH_NANG.md` (23 dòng) + tên cửa / trường đã chốt trong `thiet_ke/trao_doi/` (v3: TRA_LOI_POS_29102026.md; GIOVANG-1 `gia_mon[]`; KH-SP-1 `nhu_cau[]`, `the_chat[]`, `mo_ta`, `cong_dung`, `thanh_phan`, `anh`; KH-MUA-1 các cửa ở TRA_LOI_POS_31102026.md mục 3).
- A2 Bài thử đối chiếu: mọi cửa ở trạng thái "đã có" phải nằm trong khối `HOP_DONG_MAY_DOC` của hợp đồng trong kho (đọc như K8); cửa chưa có trong hợp đồng → bắt buộc ghi `viec_pos`.

### B. Trang `/kiemkhop`
- B1 Đường dẫn thật `/kiemkhop`, KHÔNG có lối vào từ thanh tab / menu nào, `<meta name="robots" content="noindex">` nếu có chỗ đặt sẵn (không sửa `index.html` — ngoài phạm vi: thì bỏ). Kiểu chữ / màu / thẻ của demo (dùng lại khối `order-card` hoặc thẻ của Tài khoản); không cần đăng nhập để mở.
- B2 Phần đầu "Kết nối": địa chỉ POS app đang dùng (`VITE_POS_API`, hiện đầy đủ); gọi `GET /gio-hoat-dong` một lần và nói RÕ bằng lời thường từng trường hợp: thông ✓ · không gọi được (mạng / chặn khác nguồn — gợi ý "kiểm địa chỉ có `www`") · POS trả `KH_CHUA_CAU_HINH` ("POS chưa bật App khách — thiếu khoá trên Render") · lỗi khác (hiện nguyên `error`). Kèm giờ POS (`bay_gio`) và độ lệch với đồng hồ máy (chỉ để xem).
- B3 Bảng mục (theo A1), nhóm "Trước khai trương" rồi "Sau khai trương":
  - Cửa ĐÃ có trong hợp đồng, không cần token (hoặc `tuy_chon`) → gọi thật MỘT lần qua `src/api.js` (hàm có sẵn), kiểm các `truong` có mặt → ✓ đủ / ✗ thiếu `<tên trường>`.
  - Cửa cần token: đã đăng nhập → gọi một lần như trên; chưa → "Đăng nhập để kiểm" (không bắt đăng nhập).
  - Cửa CHƯA có trong hợp đồng (vd đặt đơn) → KHÔNG gọi (K8) → ⏳ "POS đang làm: <viec_pos>".
  - Trường mới trên cửa đã có (vd `nhu_cau[]` ở `/menu`) → ✓ khi POS đã trả, ⏳ khi chưa — để chủ quán thấy POS gộp lúc nào mà không cần hỏi.
  - POST / PUT: không bao giờ gọi trên trang này (chỉ ghi "có trong hợp đồng" hay chưa).
- B4 Gọi mỗi cửa đúng MỘT lần mỗi lần mở trang; nút "Kiểm lại" (chống bấm dồn ≥ 5 giây); không gọi theo giờ, không gọi nền.
- B5 Không hiện dữ liệu khách (số điện thoại, ví, đơn) trên trang — chỉ ✓/✗ và tên trường. Không ghi gì vào bộ nhớ máy.
- B6 Trang TẠM công khai (chủ quán chốt 31.10 "theo đề nghị"): giữ `/kiemkhop` công khai tới khi có khu quản trị `/admin` (KH-ADMIN-1); việc đó chuyển trang vào `/admin` và XOÁ đường dẫn công khai. Ghi chú này vào đầu tệp trang để việc sau không quên.

### C. Kiểm
- C1 `cong_cu/thu_KHKHOP1.js`: phần 1 hàm thuần (đọc danh sách, so trường lồng nhau `data[].gia_hang[].gia`, xếp nhóm, đối chiếu hợp đồng — A2); phần 2 Chromium + POS giả: thông; CORS chặn; `KH_CHUA_CAU_HINH`; thiếu một trường; cửa token khi chưa / đã đăng nhập; không gọi cửa ngoài hợp đồng; mỗi cửa đúng một lần; "Kiểm lại" chống dồn; 360 / 390 / 430 + chữ 130%. `KHONG_TRINH_DUYET=1` / không Playwright → BỎ QUA phần 2, không tính hỏng; `SỐ CA` theo `KHONG_TRINH_DUYET=1` (CLAUDE.md §9).
- C2 `npm test`, `--day-du` (K8, K9), `node tu_chay/cong.js chay` ĐẠT. Đột biến VS-: ≥ 3 (gọi cửa ngoài hợp đồng; gọi hai lần; báo ✓ khi thiếu trường).
- C3 Chủ quán thử tay (2 bước): (1) mở `https://app-kh.pages.dev/kiemkhop` trên điện thoại → phần Kết nối ✓, bảng có ✓ / ⏳; (2) đăng nhập rồi mở lại → các mục cần đăng nhập đã kiểm.

## Phạm vi
- viec/KH-KHOP-1/**
- src/**
- cong_cu/thu_KHKHOP1.js
- cong_cu/thu_KHLINK1.js

## Bài thử đỏ
Có — `cong_cu/thu_KHKHOP1.js` ĐỎ trên code gốc (chưa có `src/kiemKhop/`, chưa có `/kiemkhop`).

## Ngân sách
~180 dòng app + ~200 dòng thử. **Phương án đơn giản nhất đã xét:** một danh sách tĩnh + một trang gọi các hàm `api.js` sẵn có một lần; không máy chủ, không lịch, không thư viện.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/`, `index.html`.
- KHÔNG gọi cửa ngoài hợp đồng; KHÔNG gọi POST / PUT; KHÔNG gọi tự động theo giờ; KHÔNG hiện dữ liệu khách.
- Chỉ push `git push -u origin viec/KH-KHOP-1`. Không đụng `main`, không merge, không tạo PR.
