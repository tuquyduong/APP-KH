# KH-NHANH-2 — Vòng xoay chờ POS (kiểu B chủ quán chọn) + Giỏ / Thanh toán giữ số cũ mờ lúc tính lại + App bớt chờ (chào POS sớm, báo giá gửi ngay lần đổi đầu)

<!-- Chat App KH soạn 18.11.2026. **Opus**, KHÔNG chờ duyệt kế hoạch (giao diện chủ quán đã chọn trên bản thử). Hạn 20.11. Mở trên main 706ed73 (+ commit sổ v65 của chat).
     BẢN THỬ chủ quán đã xem và chọn: Artifact "Bản thử biểu tượng chờ · App Tứ Quý Đường" https://claude.ai/artifact/X1BRV2xZDDWDEcnWe4fLnk — App thật + POS giả có độ trễ đo
     thật. Chủ quán 18.11: "kiểu B nhưng không cần làm cả màn hình mờ đi mà chỉ cần hình xoay" → rồi "chỉ có hình tròn xoay mà không có nền trắng" (nền trắng không ăn nhập).
     Mẫu của bản thử (chép Ý, không chép nguyên — mẫu đếm MỌI lượt, kể cả lượt ngầm): `viec/KH-NHANH-2/mau_ChoDemo.jsx`, `viec/KH-NHANH-2/mau_cho.css`,
     `viec/KH-NHANH-2/mau_doi_khac.diff` (api.js đếm lượt, BangTien số cũ mờ, nút Đặt đơn có vòng nhỏ).
     Đo thật (chat, trình duyệt máy chủ quán, VN): đường VN ↔ POS (Mỹ) ~0,25 s / lượt; 18.11 sáng (POS còn dùng kho Tokyo) báo giá 1,6–1,9 s, /toi /diem /vi /voucher 1–1,5 s;
     18.11 17:40 (kho Virginia): báo giá 0,63–0,75 s, cửa có token ~0,5 s, cửa công khai ~0,25–0,36 s, mở App 11 lượt song song ~0,8 s. App gom báo giá 600 ms (gom ĐUÔI: lần đổi
     đầu cũng chờ đủ 600 ms rồi mới hỏi) → hôm nay gần nửa thời gian chờ tổng tiền là App tự chờ.
     Đọc CLAUDE.md §4, §5, §6, §8, §11; `LUAT_XAY_APP.md` §5; phiếu + `trang_thai.md` KH-NHANH-1 (kho dữ liệu khách, cập nhật ngầm), KH-MUA-1b (báo giá, khoá gửi). -->

## Mục tiêu
Khi App đang chờ quán (POS) mà khách đang đợi kết quả, khách thấy một vòng tròn xoay nhỏ giữa màn — không làm mờ, không chặn bấm, không có nền. Giỏ hàng / Thanh toán
không "trống" tổng tiền khi đang tính lại mà giữ số cũ (mờ) cho tới khi có số mới; nút trả tiền vẫn khoá như hôm nay. App bớt tự chờ: chào máy chủ POS ngay lúc mở, báo giá gửi
NGAY ở lần đổi đầu.

## Nghiệm thu

### A. Vòng xoay chờ (kiểu B sửa — chủ quán chọn 18.11)
- A1 `src/api.js`: đếm số lượt hỏi POS **khách đang chờ** đang chạy; hàm `theoDoiDangCho(f)` (đăng ký / huỷ) cho giao diện. Lượt **ngầm KHÔNG tính** (khách không đợi nó):
  - hỏi lại định kỳ (Theo dõi đơn 3 s / 10 s, chờ QR, `dungTheoDoi`), cập nhật ngầm của kho dữ liệu khách KHI màn đã có dữ liệu (quay lại App > 60 s, mỗi 5 phút, sau thao tác —
    KH-NHANH-1), gia hạn đăng nhập (`/gia-han`), kho nội dung (`goiKho`, `/api/nd`), mọi lượt chạy nền khác (kế hoạch liệt kê từng chỗ gọi, mỗi chỗ ghi "chờ" hay "ngầm").
  - Cách đánh dấu do máy chọn (vd tuỳ chọn `{ ngam: true }` ở chỗ gọi), MỘT chỗ đếm, không sửa đường `fetch` (K1 / K1b giữ nguyên số lối).
- A2 `src/components/VongCho.jsx` (MỚI) gắn MỘT lần ở khung App: có lượt "chờ" chạy quá **300 ms** → hiện vòng tròn xoay giữa màn (vị trí cố định, giữa khung `.phone`),
  hết lượt → ẩn ngay. KHÔNG nền, KHÔNG phủ mờ, `pointer-events: none` (khách vẫn cuộn, bấm). Cỡ ~36 px, viền 4 px: vòng nhạt `--pink`, cung đậm `--pink-dark` (đúng bản thử).
  `role="progressbar"`, nhãn đọc màn hình = mục danh mục mới (sửa được ở /admin). `prefers-reduced-motion` → quay chậm lại (không tắt hẳn).
- A3 CSS `src/giaoDien/cho.css` (MỚI, mọi lớp tiền tố `cho-`), màu CHỈ bảng demo (K9). Không thêm vòng xoay nào khác cạnh `khung-tai` (màn lần đầu chưa có dữ liệu vẫn hiện
  khung xám như hôm nay; vòng xoay hiện thêm ở giữa).

### B. Tổng tiền không "trống" khi tính lại
- B1 `BangTien` (Giỏ hàng + Thanh toán đồ uống): đang chờ báo giá MỚI mà đã có báo giá CŨ (cùng phiên màn) → hiện các dòng của báo giá cũ **mờ** + vòng xoay nhỏ (~14 px) trước
  số Tổng cộng; chưa từng có báo giá → một dòng "Đang tính tiền…" + vòng nhỏ (mục danh mục mới) thay câu "Tổng tiền sẽ hiện khi quán xác nhận" — câu đó GIỮ cho lúc không hỏi được
  (chưa đăng nhập, quán đóng…). Có lỗi báo giá → như hôm nay (không hiện số cũ).
- B2 **Luật tiền giữ nguyên:** nút đi tiếp / Đặt đơn / số tiền trên nút CHỈ theo báo giá MỚI (đúng giỏ + mã + voucher hiện tại) — đang tính lại thì nút KHOÁ như hôm nay, không
  bao giờ cho trả theo số cũ. Giỏ đã có `bgCu` (KH-VC-2, cho ô voucher) — dùng chung, không thêm một bản nhớ thứ hai; Thanh toán làm tương tự (`dungBaoGia` trả thêm báo giá cũ
  là một cách).
- B3 Nút **Đặt đơn** (Thanh toán) và các nút gửi đã có chữ "Đang gửi…" (Nạp, Nhận mã, Lưu hồ sơ… — kế hoạch liệt kê): thêm vòng nhỏ màu trắng trước chữ khi đang gửi.

### C. Bớt chờ
- C1 `index.html`: `<link rel="preconnect" href="…" crossorigin>` tới GỐC địa chỉ POS (chỉ `https://tên-miền`, KHÔNG có `/api`) — lấy từ `VITE_POS_API` lúc dựng (Vite 7 thay
  `%VITE_POS_API%` trong index.html, hoặc cách máy chọn); biến trống / dựng thử → không có dòng. K2 / K2d (chữ "api" chỉ ở chỗ đã khai) phải XANH, không nới bộ kiểm.
- C2 `taoGop` (datDon.js) → gom **ĐẦU + ĐUÔI**: lần đổi đầu sau ≥ 600 ms yên → gửi NGAY; đổi liền tay trong 600 ms → chỉ lần cuối được gửi sau khi yên 600 ms (tối đa 1 lượt
  thêm mỗi chuỗi bấm). Kết quả về muộn của lượt cũ KHÔNG được ghi đè báo giá của giỏ mới (đã có `huy` theo khoá — giữ, thêm ca thử).
- C3 Không đổi số lượt App hỏi POS lúc mở (KH-NHANH-1), không đổi hợp đồng `/api/kh`.

### D. Kiểm
- D1 Bài MỚI `cong_cu/thu_KHNHANH2.js` (chạy cả `KHONG_TRINH_DUYET=1`; POS giả có độ trễ chỉnh được — khuôn `thu_KHNHANH1.js` / `thu_KHVC2.js`):
  - hàm thuần: `taoGop` mới — 1 lần đổi → gửi ngay (0 ms); 5 lần trong 600 ms → đúng 2 lượt (đầu + cuối), lượt cuối mang giỏ cuối; yên > 600 ms rồi đổi → gửi ngay;
  - bộ đếm: lượt "chờ" > 300 ms → báo "có"; lượt < 300 ms → không bao giờ báo; lượt ngầm (`ngam`) → không tính; lỗi / huỷ lượt → đếm về 0;
  - Chromium 390: mở App với POS chậm 1,5 s → có vòng `cho-` giữa màn, không có lớp phủ / nền (kiểm style tính: nền trong suốt, `pointer-events: none`); bấm được nút trong
    lúc vòng hiện; Giỏ bấm + → tổng cũ còn, mờ, có vòng nhỏ, nút đi tiếp KHOÁ; báo giá về → số mới, hết mờ, nút mở; Thanh toán đặt đơn (POS giả trả lỗi) → nút có vòng trắng;
    Theo dõi đơn đang hỏi lại mỗi 3 s → KHÔNG có vòng giữa màn; quay lại App sau 60 s (cập nhật ngầm, màn đã có dữ liệu) → KHÔNG có vòng; `index.html` dựng với `VITE_POS_API`
    có dòng preconnect đúng gốc, không có `/api`. Đỏ trên gốc.
- D2 Bài CŨ đổi có chủ đích (vd câu "Tổng tiền sẽ hiện…", `taoGop` gom đuôi) → sửa đúng ca (đỏ trên gốc, kể cả `KHONG_TRINH_DUYET=1`); KHÔNG dùng `## Bài thử cũ sửa`.
- D3 Đột biến tay (`viec/KH-NHANH-2/dot_bien_tay.js`) ≥ 6, mỗi cái ĐỎ: đếm cả lượt ngầm · bỏ trễ 300 ms · có nền / lớp phủ · nút đi tiếp mở khi đang tính lại (trả theo số cũ) ·
  gom chỉ đuôi (lần đầu chờ 600 ms) · lượt cũ về muộn ghi đè giỏ mới · preconnect có `/api`.
- D4 Ảnh 390 trước / sau → `viec/KH-NHANH-2/so_anh/`: Trang chủ đang tải, Giỏ đang tính lại, Thanh toán đang gửi; soát cuối so ảnh `LUU_ANH_DIR` gốc ↔ nhánh: màn NGOÀI phạm vi
  không đổi (vòng chỉ hiện lúc chờ — ảnh chụp khi đã tải xong phải giống hệt gốc).
- D5 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- D6 Chủ quán thử tay sau khi gộp (điện thoại, 4G): mở App → vòng xoay giữa màn, không mờ; Giỏ bấm + liên tục → tổng cũ mờ + vòng nhỏ, có số mới nhanh hơn trước; Theo dõi
  đơn đứng yên 30 giây → không thấy vòng nhấp nháy.

## Phạm vi
- viec/KH-NHANH-2/**
- index.html
- src/api.js
- src/datDon.js
- src/dungDatDon.js
- src/duLieuKhach.js
- src/main.jsx
- src/App.jsx
- src/components/VongCho.jsx
- src/giaoDien/cho.css
- src/pages/GioHang.jsx
- src/pages/ThanhToan.jsx
- src/pages/*.jsx
- src/components/*.jsx
- src/noiDung/nd/*.js
- src/kiemKhop/canTuPos.js
- cong_cu/thu_KHNHANH2.js
- cong_cu/thu_*.js
- cong_cu/no_chu_cung.txt

## Ngân sách
~120 dòng app (đếm lượt + đánh dấu ngầm ~35, VongCho + css ~35, BangTien số cũ mờ ~20, nút vòng nhỏ ~10, taoGop ~10, preconnect ~5) + ~300 dòng thử. **Phương án đơn giản nhất
đã xét:** MỘT bộ đếm trong `api.js`, MỘT vòng xoay ở khung App, chỗ gọi ngầm tự đánh dấu; tổng tiền dùng lại báo giá cũ đã nhớ; không đổi luật tiền, không đổi hợp đồng. Vượt 1,5
lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG đổi luật tiền: không cho đi tiếp / đặt đơn / trả theo báo giá cũ; App không tự tính tiền; không đổi thân `POST /gio/bao-gia` / `POST /don`, khoá gửi, gửi lại, PIN.
- KHÔNG thêm lớp phủ mờ, nền trắng, hộp thoại chờ, chặn bấm (chủ quán đã bỏ ở bản thử). KHÔNG thêm màu ngoài bảng demo (K9).
- KHÔNG thêm lối mạng mới, không đổi `CHO_API` / `SO_LOI_MANG_API` / `CHO_GIAU`, không nới bộ kiểm (`kiem_tra_truoc_khi_giao.js` — KHÔNG sửa).
- KHÔNG sửa `src/components/TheQR.jsx`, `src/giaoDien/the_qr.css`, `src/qrThuongHieu.js`, `src/quangCao.js`, `src/giaoDien/demo*.css`, `thiet_ke/**`, `tu_chay/`, `.claude/`,
  `.github/`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `public/sw.js`.
- Chỉ push `git push -u origin viec/KH-NHANH-2`. Không đụng `main`, không merge, không tạo PR.
