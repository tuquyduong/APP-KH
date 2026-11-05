# KH-TT-1 — Thanh toán: bấm cả dòng "Trừ từ số dư ví", đọc lại số dư khi lỗi, bỏ dòng "Chuyển khoản QR", nút ghi đúng cách trả

<!-- Chat App KH soạn 05.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 06.11. CHẠY SONG SONG với KH-SINH-1 (và KH-HD-1 nếu chưa gộp) — xem "Cấm".
     Chủ quán 05.11 (ảnh iPhone màn Thanh toán, đơn 2.700đ, ví 47.300đ): "Bấm trừ từ số dư không được (bấm vào không thấy phản hồi gì). Có tab xác nhận trả và ở trên
     nói là chuyển khoản QR là bị thừa thông tin. Thay vì xác nhận trả thì thay bằng 'thanh toán qua QR', bỏ thanh ck qr đi."
     Chat đã đọc code main dc3f41e + chạy thử Chromium:
       - `src/pages/ThanhToan.jsx` ~dòng 198–201: chỉ ô công tắc `.switch` 42×24 px nhận bấm (`bam(...)` gắn trên `.switch`); bấm chữ "Trừ từ số dư ví" / dòng số dư
         → không gì xảy ra (đã thử: bấm `.the-vi .t` → aria-checked vẫn false). Trên iPhone ngón tay dễ trúng chữ, không trúng ô 42×24.
       - Ảnh 2 của chủ quán: "Chưa đọc được số dư" = `GET /toi` lỗi lúc mở màn (`dungTai(layToi)`, `soDu === null`) → công tắc khoá, KHÔNG có cách thử lại, không nói gì.
       - Dòng "Chuyển khoản QR" (~dòng 203–208) chỉ là chữ, không bấm được — trùng ý với nút dưới.
     Luật cách trả GIỮ NGUYÊN (KH-MUA-1b/1c, QUYET_DINH 03.11): tắt → `qr`; bật + số dư ≥ tổng → `vi`; bật + 0 < số dư < tổng → `vi_qr`; dùng ví thì hỏi PIN.
     Việc này CHỈ đổi cách bấm + chữ; không đổi `cachTra`, thân `POST /don`, luật gửi lại. -->

## Mục tiêu
Khách trên iPhone bấm vào bất cứ chỗ nào của dòng "Trừ từ số dư ví" là bật / tắt được; số dư đọc lỗi thì bấm để đọc lại; màn chỉ còn MỘT chỗ nói cách trả — chính nút đặt.

## Nghiệm thu

### A. Dòng "Trừ từ số dư ví" (`src/pages/ThanhToan.jsx`)
- A1 CẢ dòng `.notif-row.the-vi` là chỗ bấm (một phần tử `role="switch"`, `aria-checked`, `aria-label="Trừ từ số dư ví"`, bấm / Enter / Space — dùng `bam` sẵn có);
  ô `.switch` chỉ còn là hình (không gắn bấm riêng → không bật hai lần). Vùng bấm cao ≥ 44 px. Không đổi màu / kiểu demo.
- A2 Khi bật được (`duoc.vi || duoc.viQr`) → bấm đổi bật / tắt như nay. Khi không bật được vì báo giá chưa về → dòng khoá như nay (mờ, `aria-disabled`).
- A3 `GET /toi` lỗi (`soDu === null`, không đang tải) → dòng nhỏ **"Chưa đọc được số dư · Bấm để thử lại"**; bấm dòng → `toi.taiLai()` (hiện "Đang cập nhật số dư…").
  Đọc lại được → dòng hiện số dư, bật được như thường. KHÔNG tự đặt cách trả khi chưa có số dư.
- A4 Ví 0đ → ẩn dòng ví như nay (`soDu !== 0`).

### B. Bỏ dòng "Chuyển khoản QR" — nút đặt nói cách trả
- B1 Xoá khối `.notif-row` "Chuyển khoản QR" (cả hai câu "Quét mã bằng app ngân hàng…").
- B2 Ví 0đ (không có dòng ví) → ẩn luôn tiêu đề "Cách trả tiền" (không để tiêu đề trống).
- B3 Chữ nút đặt ở trạng thái sẵn sàng (thay `Xác nhận trả <tổng>`; mọi chữ trạng thái khác — "Đang gửi…", "Mạng chậm…", "Xử lý đơn trước…", "Thử lại sau N giây",
  `CHU_CHUA_MO` — GIỮ NGUYÊN):
  - `qr` → **"Thanh toán qua QR <tổng>"** (vd "Thanh toán qua QR 2.700đ");
  - `vi` → **"Trừ ví <tổng>"**;
  - `vi_qr` → **"Trừ ví <số dư> + QR <còn thiếu>"** (số dư = `soDu`, còn thiếu = `viThieu` sẵn có — chỉ để hiện, tiền thật do POS trả khi đặt).
  - báo giá chưa về → "Xác nhận" như nay.
- B4 Dòng nhỏ dưới "Trừ từ số dư ví" khi bật + `vi_qr` giữ câu hiện có ("Dùng hết … còn thiếu … → quét QR").
- B5 Nút không tràn / không vỡ ở 360 px với chữ dài nhất (`vi_qr`, số 6 chữ số) — xuống dòng trong nút được, không cắt số.
- B6 Màn sau khi đặt (Theo dõi đơn, mã QR) KHÔNG đổi ở việc này.

### C. Giao diện
- C1 CSS mới (nếu cần, vd vùng bấm 44 px, nút xuống dòng) ở file MỚI `src/giaoDien/thanh_toan.css`, `import` trong `ThanhToan.jsx` (KHÔNG sửa `main.jsx`, `giaoDien.css`,
  `demo*.css`). K9 xanh. Khác demo (bỏ dòng QR, chữ nút) = quyết định chủ quán 05.11 (`QUYET_DINH_APPKH.md`) — ghi vào `doi_chieu_demo.md`.
- C2 Ảnh 360 / 390 / 430 → `viec/KH-TT-1/so_anh/`: ví tắt (nút "Thanh toán qua QR …"), ví bật đủ ("Trừ ví …"), ví bật thiếu ("Trừ ví … + QR …"),
  số dư lỗi ("Bấm để thử lại"), ví 0đ (không tiêu đề "Cách trả tiền").

### D. Kiểm
- D1 Bài MỚI `cong_cu/thu_KHTT1.js` (POS giả dùng lại `dungMay` của `thu_KHMUA1b.js` như các bài trước; bài tự chèn `src/giaoDien/thanh_toan.css` vào trang nếu cần đo kích thước —
  khuôn của `dungMay` chỉ nạp CSS từ `main.jsx`):
  - bấm CHỮ "Trừ từ số dư ví" → `aria-checked` đổi, nút đổi chữ (đỏ trên gốc);
  - bấm một lần trúng ô `.switch` → đổi đúng MỘT lần (không bật rồi tắt);
  - `/toi` lỗi lần đầu → "Bấm để thử lại" → bấm → `/toi` gọi lần 2 → hiện số dư, bật được;
  - không còn chữ "Chuyển khoản QR"; ba chữ nút đúng ba cách trả; ví 0đ không có tiêu đề "Cách trả tiền";
  - đặt đơn ba cách vẫn gửi đúng `cach_tra` (`qr` / `vi` / `vi_qr`) và hỏi PIN như cũ;
  - vùng bấm dòng ví cao ≥ 44 px; nút không tràn ngang ở 360 px.
  `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- D2 Bài thử cũ đang khoá chữ cũ ("Xác nhận trả", "Chuyển khoản QR", bấm `.switch`) — máy grep lại, ít nhất `thu_KHMUA1.js`, `thu_KHMUA1b.js`, `thu_KHMUA1c.js`,
  `thu_KHNHANH1.js` → sửa theo chữ mới (chủ quán đã duyệt đổi 05.11 → bài sửa thường: đỏ trên gốc / xanh trên mới, ghi `SỐ CA`; KHÔNG dùng `## Bài thử cũ sửa`).
  Không nới phép kiểm tiền nào (thân gửi, PIN, gửi lại) khi sửa.
- D3 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.
- D4 Chủ quán thử tay trên iPhone: (1) giỏ có món → Thanh toán → bấm vào CHỮ "Trừ từ số dư ví" → công tắc bật, nút thành "Trừ ví …"; (2) bấm lại → tắt, nút
  "Thanh toán qua QR …"; (3) đặt một đơn trừ ví → hỏi PIN → đặt được như trước.

## Phạm vi
- viec/KH-TT-1/**
- src/pages/ThanhToan.jsx
- src/giaoDien/thanh_toan.css
- cong_cu/thu_KHTT1.js
- cong_cu/thu_KHMUA1.js
- cong_cu/thu_KHMUA1b.js
- cong_cu/thu_KHMUA1c.js
- cong_cu/thu_KHNHANH1.js

## Ngân sách
~40 dòng app + ~200 dòng thử.
**Phương án đơn giản nhất đã xét:** chuyển `bam(...)` từ `.switch` lên cả dòng; thêm nhánh `soDu === null` gọi `toi.taiLai`; xoá một khối JSX; đổi một chuỗi chữ nút theo `cachTra`
sẵn có. Không đổi `datDon.js`, không đổi thân gửi.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- Chạy song song: KHÔNG sửa `src/pages/HoSo.jsx`, `src/dinhDang.js`, `src/pages/TrangChu.jsx`, `src/pages/GioHang.jsx`, `src/gio.js`, `src/App.jsx`, `src/giaoDien/gio_xoa.css`,
  `cong_cu/thu_KHSINH1.js`, `cong_cu/thu_KHUI2.js`, `cong_cu/thu_KHUI3b.js`, `cong_cu/thu_KHUI3d.js`, `cong_cu/thu_KHLUU1.js` (KH-SINH-1); `src/pages/Don.jsx`, `src/hoaDon.js`,
  `src/components/HoaDonKhach.jsx`, `src/giaoDien/hoa_don.css`, `cong_cu/thu_KHHD1.js` (KH-HD-1). Cần sửa ngoài Phạm vi → `## Câu hỏi`, dừng.
- KHÔNG sửa `src/datDon.js`, `src/api.js`, `src/dungTai.js`, `src/components/PinSheet.jsx`, `src/pages/TheoDoiDon.jsx`, `src/luuMay.js`, `src/main.jsx`, `src/giaoDien/giaoDien.css`,
  `src/giaoDien/demo*.css`, `src/kiemKhop/**`, `thiet_ke/**`.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- KHÔNG đổi luật chọn cách trả, thân `POST /don`, luật gửi lại / chưa rõ, PIN. KHÔNG làm "nhớ công tắc", báo đơn xong, Theo dõi đơn (KH-BAO-1).
- Chỉ push `git push -u origin viec/KH-TT-1`. Không đụng `main`, không merge, không tạo PR.
