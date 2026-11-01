# KH-NHANH-1 — App không bắt khách chờ: tải hết khi mở app, giữ dữ liệu đã có, cập nhật ngầm; màn mở đầu đầy đủ chỉ lần đầu mỗi ngày

<!-- Chat App KH soạn 01.11.2026. Việc thường [Th], Opus (chạm nhiều màn + dữ liệu khách lưu trên máy) — chạy thẳng tới hết. Hạn 03.11. Làm SAU KH-UI-3d (đã gộp, PR #12 5ed0c1e).
     Chủ quán thấy chuyển tab chờ gần 1 giây. Chat đo thật 01.11 trên app-kh.pages.dev (khách đã đăng nhập):
       mỗi vòng tới POS ~400 ms; /toi 1452 ms, /diem 1438 ms, /voucher 959 ms, /menu 1238 ms; gọi /toi + /diem + /voucher CÙNG LÚC 1425 ms.
     Đo bằng POS giả trong máy: App tự chuyển tab chỉ 60–150 ms khi POS trả ngay; POS trễ 700 ms → mở tab Tài khoản 0,9–1,9 giây.
     Nguyên nhân: mỗi lần mở một tab, các màn (TrangChu, TaiKhoan, UuDai, HoSo, ManQR) gọi `dungTai(layToi|layDiem|layVoucher)` LẠI TỪ ĐẦU,
     hiện khung xám tới khi POS trả (src/dungTai.js; TaiKhoan.jsx:27–29; TrangChu.jsx:43–44; UuDai.jsx; HoSo.jsx; ManQR.jsx).
     Phần POS (CORS maxAge, vùng máy chủ, xử lý /toi chậm) đã gửi POS ở YEU_CAU_APPKH_GUI_POS_01112026.md — KHÔNG làm ở đây.
     Quyết định áp dụng (thiet_ke/QUYET_DINH_APPKH.md, 01.11): xem mục "01.11.2026" của sổ — màn mở, cập nhật ngầm, lưu tóm tắt trên máy, ẩn hạng 0%. -->

## Mục tiêu
Mở app xong là mọi tab có sẵn dữ liệu. Chuyển tab, quay lại tab đã xem: hiện NGAY (dưới ~150 ms), không có khung chờ.
Số liệu vẫn đúng nhờ cập nhật ngầm (khách không nhìn thấy). Riêng lúc trả tiền thì luôn lấy số mới.

## Nghiệm thu

### A. Một chỗ giữ dữ liệu của khách (mở rộng khuôn `kho.js` / `heThong.js` đang dùng cho hạng, Giờ vàng, giờ hoạt động)
- A1 Các cửa GET dữ liệu khách: `/toi`, `/diem`, `/voucher` (trang không `?all`), `/don` (trang 1).
  - Mỗi cửa có MỘT kho chung cho cả app (ví dụ `src/duLieuKhach.js`). Các màn ĐỌC kho đó, không tự gọi `api.js` nữa.
  - Dùng lại `taoKho` / `dungKho`. Mỗi kho có: `dl`, thời điểm lấy, `dangTai` (chỉ khi CHƯA có dữ liệu), `loi`.
- A2 **Không gọi trùng:** một cửa đang chờ POS thì lệnh thứ hai dùng chung lệnh đang chờ, không gửi lần hai.
- A3 **Có dữ liệu thì hiện ngay, cập nhật sau:**
  - Màn mở ra mà kho đã có `dl` → vẽ ngay. Lấy mới chỉ khi lần lấy cuối đã quá 5 phút, và lấy ngầm (không khung xám).
  - Dữ liệu mới về → thay vào. Lỗi khi đã có dữ liệu → giữ bản cũ, không báo lỗi to.
  - Chưa từng có dữ liệu mà lỗi → như hiện nay (khung lỗi + Thử lại).
- A4 **Gọi trên cửa trang sau:** `/voucher?all=1` ("Xem tất cả") và trang 2 trở đi của `/don` vẫn gọi khi khách bấm, không cần giữ.
- A5 Không đổi cửa, không đổi hợp đồng, không thêm thư viện. `api.js` vẫn là chỗ DUY NHẤT gọi mạng.

### B. Tải trước ngay khi mở app
- B1 App mở với khách đã đăng nhập → gọi CÙNG LÚC `/toi`, `/diem`, `/voucher`, `/don` (trang 1). Kèm các cửa công khai và `/menu` như hiện nay.
  - Không chờ khách bấm tab. Thời gian gọi nằm dưới màn mở đầu (C1).
- B2 Khách vừa đăng nhập xong → tải trước như B1.
- B3 Chưa đăng nhập → chỉ tải các cửa công khai như hiện nay. Không gọi cửa cần token.

### C. Màn mở đầu đầy đủ CHỈ lần đầu mỗi ngày
- C1 `ManDau` hiện đầy đủ ở lần mở đầu tiên của ngày, như hiện nay (bỏ qua được). Các lần mở sau cùng ngày: KHÔNG hiện, vào thẳng trang.
  - Hiện quy tắc là "mỗi phiên trình duyệt" (`sessionStorage`, `ManDau.jsx:4–9`). Đổi sang nhớ ngày đã xem ở `localStorage`.
- C2 "Ngày" dùng ngày theo đồng hồ máy (giờ VN).
  - Đây là ngoại lệ có chủ đích với CLAUDE.md §6: chỉ quyết định hiện / không hiện hiệu ứng, KHÔNG dùng cho tiền, giờ mở cửa hay số liệu.
  - Ghi chú ngoại lệ này ngay tại dòng code.
- C3 Kho bị chặn (cửa sổ riêng tư) → hiện màn mở như hiện nay, không vỡ.

### D. Làm mới ngầm để số liệu luôn đúng (khách không nhìn thấy)
- D1 **Khách quay lại app** (`visibilitychange` → hiện) → lấy lại các kho đã có, nếu lần lấy cuối quá 60 giây.
- D2 **Đều đặn:** app đang hiện → làm mới các kho khách mỗi 5 phút.
- D3 **Sau mỗi thao tác đổi dữ liệu** → lấy lại đúng kho bị ảnh hưởng:
  - nhận mã hoá đơn → `/diem`, `/voucher`, `/toi`;
  - lưu xưng hô / tên / địa chỉ → `/toi` (đã có hồ sơ POS trả về thì dùng luôn, không gọi lại);
  - đặt đơn → `/toi`, `/don`, `/diem`.
- D4 Đổi phiên (đăng xuất, 401, đăng nhập người khác) → xoá sạch mọi kho dữ liệu khách trong bộ nhớ NGAY. Không màn nào được hiện số của người trước.

### E. Lưu bản tóm tắt của khách trên máy (chủ quán chốt 01.11) — để mở app lần sau thấy ngay
- E1 Chỉ lưu: `ten`, `xung_ho`, `hang` (id, ten, phan_tram, phan_tram_nhom_dac_biet, het_han), `so_du_vi` (từ `/toi`) và `points` (từ `/diem`). Kèm thời điểm lấy.
  - KHÔNG lưu `sdt`, `qr` (mã thành viên), `dia_chi`, lịch sử điểm, voucher, đơn.
- E2 Một khoá (ví dụ `kh_tom_tat`), thêm vào danh sách xoá của `src/luuMay.js`: xoá khi bấm Đăng xuất, xoá khi người đăng nhập sau là khách khác.
  - Hết phiên (401): GIỮ nhưng KHÔNG hiện, như quy tắc §8.
- E3 Chỉ hiện bản lưu khi đang đăng nhập VÀ bản lưu thuộc đúng khách hiện tại (so dấu vết `kh_chu`, như kết quả trắc nghiệm).
  - Hiện bản lưu xong vẫn lấy `/toi`, `/diem` mới ngay (B1) và thay vào.
- E4 Bản lưu CHỈ để hiển thị. Không chỗ nào dùng nó để tính, chặn hay cho phép trả tiền (F1).
- E5 Kho bị chặn → không lưu, không vỡ, không báo "đã lưu".

### F. Tiền: Thanh toán và đơn luôn lấy số mới
- F1 Màn Thanh toán: số dư ví dùng để quyết định "ví đủ / thiếu" và cho bấm trả bằng ví PHẢI là `/toi` lấy SAU khi mở màn.
  - Trong lúc chờ: nút trả bằng ví khoá, hiện "Đang cập nhật số dư…". KHÔNG dùng bản trong kho / bản lưu cho quyết định này.
- F2 Theo dõi đơn, Chi tiết đơn: giữ cách hiện nay (gọi khi mở màn, gọi lại theo nhịp hiện có). Không giữ trong kho.

### G. Ẩn hạng 0% (chủ quán chốt 01.11)
- G1 Bảng hạng ở Ưu đãi (khách vãng lai / chưa có hạng) không hiện hạng có `phan_tram` = 0 (hoặc không phải số > 0).
- G2 Còn lại không hạng nào → ẩn cả thẻ bảng hạng, không bịa.

### H. Kiểm
- H1 `cong_cu/thu_KHNHANH1.js` có hai phần:
  - **Phần 1, hàm thuần:**
    - kho không gọi trùng (A2);
    - quy tắc 5 phút / 60 giây (A3, D1);
    - xoá kho khi đổi phiên (D4);
    - lọc trường bản lưu: không có `sdt` / `qr` / `dia_chi` (E1);
    - quy tắc ngày của màn mở (C1);
    - lọc hạng 0% (G).
  - **Phần 2, Chromium + POS giả trễ 700 ms mỗi cửa, có ĐẾM số lần gọi từng cửa:**
    - đã đăng nhập mở app → mỗi cửa của B1 được gọi đúng MỘT lần;
    - bấm qua lại Trang chủ ↔ Tài khoản ↔ Ưu đãi 3 vòng trong 5 phút → KHÔNG gọi thêm cửa nào, mỗi lần chuyển tab nội dung có trong < 300 ms;
    - mở app lần 2 cùng ngày → không có màn mở; điểm, số dư hiện ngay từ bản lưu, rồi đổi sang số POS mới;
    - đổi ngày → có màn mở;
    - đăng xuất → không còn `kh_tom_tat`; đăng nhập khách B trên cùng máy → không lúc nào thấy số của khách A;
    - mở Thanh toán → `/toi` được gọi; nút ví khoá tới khi `/toi` về, kể cả khi bản lưu có số dư đủ;
    - nhận mã hoá đơn → `/diem` được gọi lại;
    - ẩn app 61 giây rồi hiện lại → các kho được lấy lại.
  - Chạy ở 360 / 390 / 430.
- H2 **`SỐ CA` ghi theo `KHONG_TRINH_DUYET=1`** (CLAUDE.md §9). Bài mới phải đọc biến này. Bài thử cũ nào phải đổi:
  - Có ca đổi ở phần không cần trình duyệt → bài sửa bình thường (đỏ trên gốc).
  - Chỉ đổi ở phần Chromium → THÊM một ca hàm thuần hoặc đọc nguồn đỏ trên gốc trong chính bài đó (bài học KH-UI-3d).
    KHÔNG xin mục `## Bài thử cũ sửa` cho bài mà bản gốc chạy trên code mới sẽ đỏ.
- H3 `npm test`, `--day-du`, `node tu_chay/cong.js chay` (KHI MÁY RẢNH, `KHONG_TRINH_DUYET=1`) phải ĐẠT.
  - Đột biến VS- ≥ 5:
    - Thanh toán dùng số dư trong kho / bản lưu;
    - hiện bản lưu của khách khác;
    - chuyển tab gọi lại cửa;
    - không xoá `kh_tom_tat` khi đăng xuất;
    - màn mở chạy lần 2 trong ngày;
    - bản lưu chứa `qr`.
- H4 Chủ quán thử tay trên điện thoại, 3 bước:
  1. Mở app lần đầu trong ngày → màn mở → bấm qua lại các tab: không còn khung chờ.
  2. Đóng app, mở lại → vào thẳng, điểm và số dư hiện ngay.
  3. Ra quầy nhận điểm, mở lại app → trong ~1–2 giây số điểm tự đổi.

## Phạm vi
- viec/KH-NHANH-1/**
- src/**
- cong_cu/thu_KHNHANH1.js
- cong_cu/thu_KH*.js

## Ngân sách
~250 dòng app + ~350 dòng thử.
**Phương án đơn giản nhất đã xét:** dùng lại `taoKho` / `dungKho` (đã chạy cho hạng, Giờ vàng, giờ hoạt động), `luuMay.js` (quy tắc xoá), `TrangTai` (khung chờ khi chưa có gì).
Một mô-đun kho khách + đổi các màn đọc kho. Service worker (khung app nằm sẵn trên máy) là việc RIÊNG KH-PWA-1, không làm ở đây.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`, `thiet_ke/`.
- KHÔNG thêm service worker. KHÔNG đổi luồng đặt đơn / khoá gửi / PIN (KH-MUA-1b). Chỉ đổi cách màn Thanh toán lấy số dư (F1).
- KHÔNG lưu trên máy gì ngoài E1.
- Chỉ push `git push -u origin viec/KH-NHANH-1`. Không đụng `main`, không merge, không tạo PR.
