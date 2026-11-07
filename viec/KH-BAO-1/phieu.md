# KH-BAO-1 — Báo "Đơn đã xong — mời bạn ra quầy" ở MỌI màn + Theo dõi đơn vẽ tờ hoá đơn POS + nhớ công tắc "Trừ từ số dư ví"

<!-- Chat App KH soạn 06.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 07.11 (khai trương). CHẠY SONG SONG với KH-CT-1 — xem "Cấm".
     Quyết định (thiet_ke/QUYET_DINH_APPKH.md): 03.11 "Báo đơn xong: nhân viên chỉ chạm MỘT nút (POS); App báo ở MỌI màn: dải 'Đơn #… đã sẵn sàng — mời bạn ra
     quầy', đổi tên tab, tiếng (Android rung); dòng nhắc 'Giữ App mở để được báo khi đồ uống xong'. Báo khi App đã tắt: sau khai trương"; 03.11 "App nhớ lựa
     chọn công tắc 'Trừ từ số dư ví' lần trước (chỉ trên máy, xoá khi đăng xuất / đổi khách), vẫn hỏi PIN"; 05.11 (KH-TT-1) "nút đặt nói cách trả" — THAY ý
     "hai dòng to Trừ ví / Quét QR" của 03.11 (KHÔNG làm hai dòng đó nữa).
     POS ĐÃ CÓ (hợp đồng trong kho, đọc `thiet_ke/HOP_DONG_API_KH.md`): `tien_trinh` `cho_tra` · `da_tra` · `dang_lam` · `xong` · `da_huy`; màn "Đơn App" ở quầy
     có nút "Đang làm" → "Xong" (POS `client/src/pages/DonApp.jsx`). `GET /don` (20 đơn / trang, có `tien_trinh`); `GET /don/:ma` có `hoa_don[]` (v7).
     `da_lay` ("Khách đã lấy") CHƯA có trong hợp đồng → KHÔNG làm ở việc này.
     Code hiện có: `src/dungDatDon.js` `dungTheoDoi` (hỏi GET /don/:ma 3 s khi chờ trả / 10 s tới khi xong; DỪNG khi `document.hidden`);
     `src/components/Thongbao.jsx` (khuôn `.toast`, gắn ở `src/App.jsx`); `src/components/HoaDonKhach.jsx` + `src/hoaDon.js` (KH-HD-1);
     `src/luuMay.js` (danh sách khoá dữ liệu khách — khoá mới phải thêm vào đây); kho `cuaDon` ở `src/duLieuKhach.js`. -->

## Mục tiêu
Khách đặt đơn xong có thể đi xem màn khác của App; khi quầy bấm "Xong", App báo rõ ở bất kỳ màn nào đang mở để khách ra quầy lấy. Màn Theo dõi đơn hiện đúng tờ hoá đơn.
Lần đặt sau công tắc ví giữ như lần trước.

## Nghiệm thu

### A. Báo đơn xong ở mọi màn
- A1 Hàm thuần MỚI `src/baoDonXong.js` (bài thử nạp thẳng): từ danh sách `GET /don` (`data[]`) → đơn App ĐANG CHẠY (`da_tra`, `dang_lam`) và đơn VỪA XONG (`xong`) mà
  máy này đã thấy đang chạy trước đó (chỉ báo đơn chuyển sang `xong` khi App đang mở — không báo đơn xong từ hôm trước). Đơn đã báo / khách đã tắt báo → không báo lại.
  Đọc giờ / ngày bằng chuỗi (CLAUDE.md §6), không tự tính tiền.
- A2 Component MỚI `src/components/BaoDonXong.jsx`, gắn MỘT lần ở `src/App.jsx` (cạnh `<Thongbao>`; chỉ khi đã đăng nhập):
  - Có đơn đang chạy → hỏi `GET /don` (trang 1) mỗi **15 giây** khi tab hiện; tab ẩn thì không hỏi, quay lại tab (`visibilitychange`) → hỏi NGAY một lần.
    Không có đơn đang chạy → không hỏi lặp (chỉ hỏi lại khi khách vừa đặt đơn / mở Theo dõi đơn / quay lại tab). Không gọi cửa nào ngoài `GET /don`.
  - Đơn chuyển `xong` → **dải trên cùng màn** (khuôn cảnh báo / banner sẵn có của demo, màu demo) **"Đơn #<mã> đã sẵn sàng — mời bạn ra quầy"** + nút "Xem đơn"
    (mở `/don/<mã>` Theo dõi đơn) + nút tắt ✕. Dải nằm trên MỌI màn (Trang chủ, Menu, Giỏ, Ưu đãi, Tài khoản, Theo dõi đơn…), không che thanh dưới, không vỡ 360 px.
  - Cùng lúc: đổi `document.title` thành "(Xong) Đơn #<mã> — Tứ Quý Đường" tới khi khách tắt / xem đơn; rung `navigator.vibrate` (có thì dùng — Android); tiếng ngắn
    nếu demo có sẵn âm thanh dùng lại được (không thêm file âm thanh mới, không thư viện; iPhone chặn tiếng tự phát thì thôi — không báo lỗi).
  - Tắt ✕ hoặc bấm "Xem đơn" → không báo lại đơn đó (nhớ mã đã báo trong bộ nhớ trang + `sessionStorage`; KHÔNG cần khoá localStorage mới).
  - Số đơn hiện = `ma` POS trả (đổi sang số hoá đơn `so_hd` là việc sau, chờ POS CK-NOIDUNG-1).
- A3 Màn Theo dõi đơn: khi đơn `da_tra` / `dang_lam` hiện dòng nhỏ **"Giữ App mở để được báo khi đồ uống xong"**; khi `xong` hiện rõ "Đơn đã xong — mời bạn ra quầy"
  (khuôn sẵn có). `dungTheoDoi` vẫn hỏi như cũ; KHÔNG để hai nơi cùng hỏi `GET /don/:ma` dày hơn hiện nay (dải báo dùng `GET /don`, không gọi `/don/:ma`).

### B. Theo dõi đơn vẽ tờ hoá đơn POS
- B1 `src/pages/TheoDoiDon.jsx`: có `hoa_don[]` (đọc bằng `docHoaDon`) → vẽ `HoaDonKhach` thay cho danh sách `mon[]` + Tổng; rỗng → giữ như nay. Số đơn to, các bước,
  QR / ví / huỷ GIỮ NGUYÊN. (Màn Chi tiết đơn `Don.jsx` đã dùng `HoaDonKhach` từ KH-HD-1 — không sửa `Don.jsx`.)
- B2 Dòng `loai: 'ghi_no'` (đơn cũ ở quầy có ghi nợ) → `HoaDonKhach` KHÔNG vẽ dòng đó (CLAUDE.md §5: App không bao giờ hiện chữ "nợ"); các dòng khác giữ đúng thứ tự.

### C. Nhớ công tắc "Trừ từ số dư ví" (`src/pages/ThanhToan.jsx`)
- C1 Khách bật / tắt công tắc → nhớ trên máy, khoá MỚI `kh_dung_vi` (`'1'` / `'0'`), thêm vào danh sách khoá dữ liệu khách ở `src/luuMay.js` (xoá khi đăng xuất / khác khách,
  KHÔNG nằm trong danh sách khách vãng lai). Kho bị chặn → không vỡ, chỉ không nhớ.
- C2 Mở Thanh toán: đã nhớ `'1'` → công tắc bật SẴN nhưng CHỈ khi `/toi` đã về và ví bật được (`duoc.vi || duoc.viQr`); số dư lỗi / đang tải / 0đ → tắt như nay. Cách trả
  vẫn theo luật cũ (`vi` / `vi_qr` / `qr`), dùng ví VẪN hỏi PIN. Không nhớ PIN, không nhớ số tiền.
- C3 (từ soát cuối KH-MUA-1c) `DAT_ONLINE` tắt (`CHU_CHUA_MO`) mà khách bấm "Gửi lại đúng đơn này" → GIỮ bản ghi `kh_don_gui` (không coi là "chưa tạo"), nút gửi lại khoá
  kèm chữ `CHU_CHUA_MO`; ca đỏ trên gốc + đột biến.

### D. Giao diện
- D1 CSS mới ở file MỚI `src/giaoDien/bao_don.css`, `import` trong `BaoDonXong.jsx` (KHÔNG sửa `main.jsx`, `giaoDien.css`, `demo*.css`). K9 xanh.
- D2 Ảnh 360 / 390 / 430 → `viec/KH-BAO-1/so_anh/`: dải báo trên Trang chủ và trên Menu; Theo dõi đơn `dang_lam` (dòng nhắc) và `xong`; Theo dõi đơn có tờ hoá đơn; Thanh toán
  mở lại với công tắc đã nhớ. `doi_chieu_demo.md` (dải báo không có trong demo = quyết định 03.11).

### E. Kiểm
- E1 Bài MỚI `cong_cu/thu_KHBAO1.js`: hàm thuần `baoDonXong.js` (đang chạy → xong thì báo; xong từ trước không báo; đã tắt không báo lại; `da_huy` không báo) + đọc nguồn
  (chạy cả khi `KHONG_TRINH_DUYET=1`); Chromium với POS giả (đồng hồ giả): đặt đơn → sang Menu → POS chuyển `xong` → dải hiện trên Menu trong ≤ 15 s, `document.title` đổi;
  tab ẩn không hỏi, hiện lại hỏi ngay; không đơn chạy → không hỏi lặp; ✕ → không hiện lại; Theo dõi đơn có `hoa_don` → vẽ tờ, không có dòng "nợ"; Thanh toán nhớ công tắc
  (bật sẵn khi ví đủ, tắt khi `/toi` lỗi), vẫn hỏi PIN, thân `POST /don` đúng `cach_tra`; đăng xuất → `kh_dung_vi` bị xoá. `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- E2 Bài thử cũ khoá hành vi cũ (Theo dõi đơn vẽ `mon[]`, công tắc luôn tắt khi mở, danh sách khoá `luuMay`) — máy grep lại (ít nhất `thu_KHMUA1.js`, `thu_KHMUA1b.js`,
  `thu_KHMUA1c.js`, `thu_KHTT1.js`, `thu_KHHD1.js`, `thu_KHLUU1.js`, `thu_KHNHANH1.js`) → sửa theo hành vi mới (chủ quán đã duyệt 03.11 / 06.11 → bài sửa thường: mỗi bài
  sửa phải có ít nhất một ca ĐỎ trên gốc kể cả khi `KHONG_TRINH_DUYET=1` — ca hàm thuần / đọc nguồn ở Phần 1, như KH-TT-1 / KH-SINH-1 đã làm; KHÔNG dùng `## Bài thử cũ sửa`).
  Không nới phép kiểm tiền nào (thân gửi, PIN, gửi lại, chưa rõ).
- E3 `dot_bien.py` VS- / BV- cho: báo đơn chưa từng thấy chạy, báo lại đơn đã tắt, hỏi khi tab ẩn, công tắc bật sẵn khi `/toi` lỗi, bỏ hỏi PIN khi nhớ ví, xoá bản ghi khi CHUA_MO.
- E4 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.
- E5 Chủ quán thử tay (iPhone + máy quầy): (1) đặt một đơn trả ví → về Trang chủ, để App mở; (2) ở POS màn "Đơn App" bấm "Đang làm" rồi "Xong" → trong ~15 giây App hiện
  dải "Đơn #… đã sẵn sàng — mời bạn ra quầy"; (3) bấm "Xem đơn" → thấy tờ hoá đơn; (4) đặt đơn tiếp → công tắc ví đã bật sẵn.

## Phạm vi
- viec/KH-BAO-1/**
- src/baoDonXong.js
- src/components/BaoDonXong.jsx
- src/giaoDien/bao_don.css
- src/App.jsx
- src/pages/TheoDoiDon.jsx
- src/pages/ThanhToan.jsx
- src/components/HoaDonKhach.jsx
- src/luuMay.js
- src/dungDatDon.js
- cong_cu/thu_KHBAO1.js
- cong_cu/thu_KHMUA1.js
- cong_cu/thu_KHMUA1b.js
- cong_cu/thu_KHMUA1c.js
- cong_cu/thu_KHTT1.js
- cong_cu/thu_KHHD1.js
- cong_cu/thu_KHLUU1.js
- cong_cu/thu_KHNHANH1.js

## Ngân sách
~180 dòng app + ~350 dòng thử.
**Phương án đơn giản nhất đã xét:** một hook hỏi `GET /don` (đã có cửa, đã có kho `cuaDon`) chỉ khi có đơn đang chạy + một dải báo gắn một chỗ ở `App.jsx`; Theo dõi đơn dùng lại
`HoaDonKhach`; nhớ công tắc bằng MỘT khoá trong danh sách `luuMay.js`. Không cần thông báo đẩy (Web Push) — làm sau khai trương (KH-TB-1).

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- Chạy song song: KHÔNG sửa `src/pages/UuDai.jsx`, `src/chuongTrinh.js`, `src/giaoDien/chuong_trinh.css`, `src/api.js`, `cong_cu/thu_KHCT1.js` (KH-CT-1). `src/App.jsx`:
  KH-CT-1 có thể sửa MỘT dòng `<UuDai …>` — việc này CHỈ thêm import + một dòng `<BaoDonXong …/>` cạnh `<Thongbao>` (không sửa dòng `<UuDai …>`). Cần sửa ngoài Phạm vi →
  `## Câu hỏi`, dừng.
- KHÔNG sửa `src/datDon.js` trừ khi C3 bắt buộc (khi đó ghi rõ trong kế hoạch: CHỈ nhánh xử lý `CHUA_MO` khi gửi lại); KHÔNG sửa `src/components/PinSheet.jsx`, `src/pages/Don.jsx`,
  `src/hoaDon.js`, `src/kiemKhop/**`, `src/main.jsx`, `src/giaoDien/giaoDien.css`, `src/giaoDien/demo*.css`, `thiet_ke/**`.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- KHÔNG làm `da_lay` (chờ POS lên hợp đồng), số hoá đơn `so_hd`, tóm tắt ở Lịch sử đơn, thông báo khi App đã tắt (Web Push / Zalo), hai dòng to "Trừ ví / Quét QR".
- Chỉ push `git push -u origin viec/KH-BAO-1`. Không đụng `main`, không merge, không tạo PR.
