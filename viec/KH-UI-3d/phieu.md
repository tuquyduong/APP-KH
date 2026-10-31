# KH-UI-3d — Trang Ưu đãi mở cho khách vãng lai + văn phong lời chào (xưng hô chữ thường, có "!")

<!-- Chat App KH soạn 31.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 03.11. Làm SAU KH-UI-3b (đã gộp, PR #11 f5c13fb).
     Quyết định áp dụng (thiet_ke/QUYET_DINH_APPKH.md):
       - 30.10: chỉ 3 thứ cần đăng nhập (Kế hoạch, trắc nghiệm, tích điểm). Ưu đãi, Giờ vàng, giá từng hạng mở cho khách vãng lai.
       - 31.10 tối, chủ quán xem app thật thấy "Chào buổi chiều, Anh Linh" và chốt:
         xưng hô giữa câu viết CHỮ THƯỜNG, lời chào có "!" cuối câu, văn phong chuẩn. Quyết định này THAY mục C1 của phiếu KH-UI-3b ("viết hoa chữ đầu").
     Không đổi hợp đồng, không gọi cửa mới: /hang, /gio-vang (kho heThong đã nạp một lần), /toi, /diem, /voucher đã có. Không màu / phông mới (K9). -->

## Mục tiêu
Khách chưa đăng nhập bấm tab Ưu đãi là thấy ưu đãi của quán: Giờ vàng, các hạng thành viên và mức giảm. Chỉ phần riêng của khách (điểm, ví, voucher, nhận mã) mới cần đăng nhập.
Lời chào và chữ xưng hô đúng văn phong tiếng Việt.

## Nghiệm thu

### A. Văn phong lời chào và xưng hô (chủ quán chốt 31.10)
- A1 Xưng hô đứng GIỮA câu viết chữ thường. Lời chào LUÔN có "!" cuối câu. Đủ 5 dạng (một hàm thuần `loiChao` / `chiaLoiChao` ở `dinhDang.js`):

  | Trường hợp | Lời chào |
  |---|---|
  | Đủ giờ POS + xưng hô + tên | `Chào buổi chiều, anh Linh!` |
  | Chưa có `bay_gio` | `Chào anh Linh!` |
  | Khách chưa có xưng hô (khách cũ, `null`) | `Chào buổi chiều, Linh!` |
  | Có xưng hô, chưa có tên | `Chào buổi chiều, anh!` |
  | Chưa đăng nhập | `Chào bạn!` |

- A2 Tên ngắn (từ cuối của `ten`) luôn viết hoa chữ cái đầu, phần còn lại giữ nguyên. Ví dụ "nguyễn linh" → "Linh"; "Anh Linh" → "Linh".
- A3 Nút chọn xưng hô viết chữ thường như demo (`TITLES` của `renderProfile`): `anh · chị · cô · chú · bác · em · bạn`.
  - Áp dụng ở cả hai chỗ: màn Thông tin cá nhân và bước 3 "Thông tin của bạn" khi đăng ký.
  - Đổi ở MỘT chỗ: `XUNG_HO` trong `src/noiDung/dangNhap.js`.
- A4 Dòng xem trước ở Thông tin cá nhân theo demo, xưng hô in đậm: “Chào buổi tối, **anh** Linh!”. Dùng cùng hàm với Trang chủ.
- A5 Rà mọi chữ trên màn có xưng hô hoặc lời chào (`grep` trong `src/`). Liệt kê từng chỗ trong `trang_thai.md`.
  - Chữ xưng hô đứng ĐẦU dòng, ví dụ nhãn "Anh Linh", thì viết hoa chữ đầu theo chính tả.
  - Các chỗ khác viết thường như A1.

### B. Trang Ưu đãi (`/uudai`) cho khách vãng lai — theo demo `rewards` (patch39)
- B1 `/uudai` KHÔNG cần đăng nhập: `canDN` bỏ ở `src/duongDan.js`, tab Ưu đãi mở thẳng. App vẽ `UuDai` cho cả khách vãng lai.
- B2 Các khối theo thứ tự demo:
  - **Đầu trang:**
    - Đã đăng nhập: "Ưu đãi của tôi" như demo.
    - Vãng lai: "Ưu đãi". Khác demo lý do (a): chưa phải "của tôi".
  - **Banner Giờ vàng** (khối `rw-*` của demo):
    - Chỉ hiện khi POS có Giờ vàng (`dang`, `truoc` hoặc `cho` theo `trangThaiGioVang`). Chữ theo dữ liệu POS: khung giờ + `phan_tram`.
    - KHÔNG chữ / số mẫu của demo ("tháng này", "đến 50%").
    - Nút "Xem món Giờ vàng →" mở Menu nhóm Giờ vàng như ô Giờ vàng ở Trang chủ.
    - Không có Giờ vàng thì ẩn cả khối.
  - **Thẻ hạng** (`tier-card`):
    - Đã đăng nhập, `/toi` có `hang`: "Hạng <ten>" · "Giảm <phan_tram>% …" · "Thẻ hết hạn: <het_han>" (giờ theo `dinhDangNgay`).
    - Đã đăng nhập, `hang: null`: không có thẻ của khách, hiện bảng hạng như khách vãng lai.
    - Vãng lai: một thẻ "Hạng thành viên" liệt kê các hạng của `/hang` (tên + % giảm). POS không trả thì ẩn, không bịa.
    - Bỏ "Quyền lợi & nâng hạng ›": chưa có màn (lý do (a)).
  - **Điểm + Số dư ví** (`wallet-row`):
    - Đã đăng nhập: `points` (`/diem`) và `so_du_vi` (`/toi`), dạng số như Trang chủ.
    - Vãng lai: thay bằng MỘT khối khoá (`KhoaTienIch` hoặc `TheMoi` sẵn có): "Đăng nhập để xem điểm, ví và voucher". Bấm vào → `/dangnhap?tiep=/uudai`.
  - **Nhập mã trên hoá đơn, Ví voucher, Lịch sử điểm:** CHỈ khi đã đăng nhập, như hiện nay. Vãng lai không hiện, khối khoá ở trên là đủ.
  - **Sưu tập Tứ Quý, Kho quà đổi điểm:** không làm, chưa có dữ liệu POS (P3b).
- B3 Link QR hoá đơn `?ma=` GIỮ đúng hành vi hiện nay, kể cả khi `/uudai` đã công khai:
  - Khách chưa đăng nhập mở link → vào thẳng màn đăng nhập (có dòng mã hoá đơn) → xong về `/uudai` với mã điền sẵn.
  - Không được để khách vãng lai đứng ở `/uudai` mà mã bị mất.
- B4 Đã đăng nhập: các khối và cách tải như hiện nay. Không gọi thêm cửa: `/toi`, `/diem`, `/voucher` như cũ; `/hang`, `/gio-vang` đọc từ kho `heThong.js` đã nạp.
- B5 Đăng xuất hoặc hết phiên khi đang ở `/uudai` → như hành vi chung hiện nay (về Trang chủ, chế độ khách). Bấm tab Ưu đãi lần nữa là thấy bản vãng lai.

### C. Kiểm
- C1 `cong_cu/thu_KHUI3d.js` có hai phần:
  - Phần 1, hàm thuần và đọc nguồn: đủ 5 dạng lời chào A1; tên ngắn viết hoa A2; `XUNG_HO` chữ thường; `/uudai` không `canDN`.
  - Phần 2, Chromium + POS giả theo hợp đồng v3:
    - Vãng lai mở `/uudai`: thấy bảng hạng, banner Giờ vàng khi có và ẩn khi không, khối khoá; KHÔNG thấy điểm, voucher, ô nhập mã.
    - Đã đăng nhập: thẻ hạng của khách, điểm + ví, voucher.
    - Vãng lai mở link `?ma=X` → màn đăng nhập → xong về `/uudai`, mã X điền sẵn.
    - Trang chủ + Thông tin cá nhân: lời chào đúng A1, nút xưng hô chữ thường.
    - Chạy ở 360 / 390 / 430, chữ 100% và 130%.
- C2 **`SỐ CA` ghi theo `KHONG_TRINH_DUYET=1`** (CLAUDE.md §9). GitHub không có Playwright; KH-UI-3b đã đỏ cổng A16 vì ghi số có trình duyệt.
  - Bài cũ nào chỉ đổi ở phần chạy trong trình duyệt (ví dụ một ca Chromium đổi lời chào mong đợi) thì cổng A11 sẽ thấy bài đó "xanh trên gốc".
  - Gặp trường hợp này: ghi tên file vào `## Câu hỏi` để chat thêm mục `## Bài thử cũ sửa` vào phiếu. KHÔNG tự sửa phiếu.
- C3 So ảnh demo ↔ app ở `rewards` (đã đăng nhập + vãng lai), Thông tin cá nhân và đầu Trang chủ, theo CLAUDE.md §5.
  - Lưu ảnh vào `viec/KH-UI-3d/so_anh/`.
  - Lập `viec/KH-UI-3d/doi_chieu_demo.md`.
- C4 `npm test`, `--day-du`, `node tu_chay/cong.js chay` phải ĐẠT. Chạy cổng KHI MÁY RẢNH (không chạy song song `npm test`): `thu_KHMUA1.js` có Chromium tốn ~116 giây, sát trần 120 giây.
  - Đột biến VS- ≥ 4: xưng hô viết hoa giữa câu; thiếu "!"; vãng lai thấy điểm / voucher; banner Giờ vàng hiện khi POS không có Giờ vàng; vãng lai mở `?ma=` không về đăng nhập.
- C5 Chủ quán thử tay, 3 bước trên điện thoại:
  1. Đăng xuất → bấm tab Ưu đãi → thấy các hạng và mức giảm, có khối "Đăng nhập để xem điểm, ví và voucher".
  2. Đăng nhập → Trang chủ: "Chào buổi …, chị Linh!" (sau khi chọn "chị" ở Thông tin cá nhân).
  3. Tab Ưu đãi khi đã đăng nhập → thấy hạng của mình, điểm, số dư ví, voucher.

## Phạm vi
- viec/KH-UI-3d/**
- src/**
- cong_cu/thu_KHUI3d.js
- cong_cu/thu_KH*.js

## Ngân sách
~160 dòng app + ~300 dòng thử.
**Phương án đơn giản nhất đã xét:** dùng lại `UuDai.jsx`, khối khoá `KhoaTienIch` / `TheMoi`, kho `/hang`, `/gio-vang` trong `heThong.js`, hàm lời chào sẵn có ở `dinhDang.js`.
Chỉ đổi điều kiện hiện khối. Không thêm cửa, không thêm thư viện.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`, `thiet_ke/`.
- KHÔNG làm Sưu tập Tứ Quý, Kho quà đổi điểm, "Quyền lợi & nâng hạng", mua thẻ hạng, nạp ví (P3b, sau khai trương).
- KHÔNG đổi hành vi QR hoá đơn `?ma=` ngoài điều B3 yêu cầu.
- Chỉ push `git push -u origin viec/KH-UI-3d`. Không đụng `main`, không merge, không tạo PR.
