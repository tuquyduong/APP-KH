# KH-HUY-1 — Đơn bị quán huỷ: App hiện lý do + "Đã hoàn … vào ví" (hợp đồng v14 HUY-1)

<!-- Chat App KH soạn 26.11.2026. **Sonnet**, KHÔNG chờ duyệt kế hoạch (việc nhỏ, chỉ hiện chữ — không đổi luật tiền). Hạn 28.11. Mở trên main 80efd3c (+ commit sổ v67 của chat).
     Chủ quán 26.11 chọn làm song song: máy làm KH-HUY-1; chat dựng trang thiết kế KH-DOI-1; KH-SUA-2 mở SAU khi KH-HUY-1 gộp (cùng đụng Don.jsx / TheoDoiDon.jsx).
     Hợp đồng: `viec/KH-NAP-1/hop_dong_v17.md` "Ghi chú v14 — đơn bị quán huỷ" (POS HUY-1 gộp 05.11, đã chạy trên POS thật). Đọc CLAUDE.md §4, §5, §6, §8, §11;
     phiếu + `trang_thai.md` KH-SOHD-1 (`cauTienVe`, `soDon`), KH-NAP-1 (`docDon`, màn "Đã nạp", `moVi`). -->

## Mục tiêu
Khi QUÁN huỷ một đơn khách đã trả, App cho khách biết **vì sao** và **tiền đã về đâu**: một dòng lý do (nhãn POS gửi) và một dòng "Đã hoàn 35.000đ vào ví của bạn"
+ nút "Xem ví". Hiện ở 3 chỗ khách gặp đơn: Theo dõi đơn (đang mở lúc quán huỷ), Chi tiết đơn (mở từ Lịch sử), thẻ đơn trong Lịch sử đơn (một dòng ngắn).
Đơn khách tự huỷ / QR hết hạn (POS: `ly_do_huy` null, `hoan_vao_tai_khoan` 0) và POS cũ (không có hai trường) → hiện **y như hôm nay**.

## Nghiệm thu

### A. Đọc dữ liệu
- A1 `docDon` (`src/datDon.js`) thêm `hoanVaoTaiKhoan` (số nguyên ≥ 0 → giữ; thiếu / null / sai kiểu / âm → `null`) và `lyDoHuy` (chuỗi đã cắt khoảng trắng, rỗng → `null`).
  Danh sách `GET /don` (Lịch sử) đọc thẳng `d.hoan_vao_tai_khoan` qua MỘT hàm thuần dùng chung (vd `soHoan(d)` trong `hoaDon.js` cạnh `cauTienVe`) — cùng luật kiểu.
- A2 App KHÔNG tự tính số hoàn, KHÔNG suy ra lý do. Nhãn lý do hiện NGUYÊN chữ POS (như câu ưu đãi — quyết định 15.11). Chỉ đọc hai trường khi `tien_trinh` = `da_huy`.
- A3 `src/kiemKhop/canTuPos.js`: thêm mục cần POS cho hai trường (cả `GET /don/:ma` và `GET /don`, `viec_pos: 'HUY-1'`, khuôn dòng `don_v11` / `don_ds_v11`).

### B. Hiện
- B1 Thành phần MỚI `src/components/DonHuy.jsx` (MỘT chỗ dựng, dùng ở Theo dõi đơn + Chi tiết đơn), CHỈ dùng lớp CSS đã có (`nt-state`, `nt-state on`, `ghost-btn` …) —
  KHÔNG thêm tệp .css, không thêm màu:
  - có `lyDoHuy` → hộp `nt-state` (biểu tượng `close` hoặc `warning`): "Quán đã huỷ đơn · {lyDo}";
  - `hoanVaoTaiKhoan` > 0 → hộp `nt-state on` (biểu tượng `wallet` / `check`): "Đã hoàn {so} vào ví của bạn" (`dinhDangGia`) + nút phụ "Xem ví" khi có `moVi`;
  - hai trường cùng vắng / 0 → không dựng gì (trả `null`).
- B2 **Theo dõi đơn** (`TheoDoiDon.jsx`): khi `tt === 'da_huy'` hiện `DonHuy` ngay dưới đầu màn (trên khối các bước). Không đổi phần khác của màn (QR, các bước, hoá đơn).
- B3 **Chi tiết đơn** (`ChiTietDon` trong `Don.jsx`): đơn `da_huy` hiện `DonHuy` dưới dòng mã đơn / nhãn "Đã hủy". `App.jsx` truyền `moVi` cho `ChiTietDon` (đã có hàm `moVi`).
- B4 **Lịch sử đơn** (thẻ đơn trong danh sách): đơn `da_huy` có `hoan_vao_tai_khoan` > 0 → một dòng nhỏ dưới tổng tiền "Đã hoàn {so}" (lớp có sẵn kiểu `date`). Không nút.
- B5 Chữ mới vào danh mục (`src/noiDung/nd/donHang.js`, sửa được ở /admin — CLAUDE.md §11): `td.huy.lyDo` "Quán đã huỷ đơn · {lyDo}", `td.huy.hoan`
  "Đã hoàn {so} vào ví của bạn", `td.huy.xemVi` "Xem ví", `dh.huy.hoan` "Đã hoàn {so}" (+ `bien(...)`); nhãn lý do = mục `khoa` "POS › Đơn hàng · lý do huỷ (nhãn POS)".
  Gắn `ndDau` đủ để /admin chỉ đúng chỗ.
- B6 Số dư sau khi hoàn: `daHuy` (App.jsx) đã làm mới `cuaToi` khi Theo dõi đơn thấy `da_huy` — GIỮ, thêm ca thử. Mở Chi tiết đơn huỷ có hoàn → làm mới `cuaToi` một lần
  (ngầm, `lamMoi`) để ô Số dư ở Ưu đãi / Tài khoản đúng. Không thêm lượt hỏi POS nào khác.

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHHUY1.js` (chạy cả `KHONG_TRINH_DUYET=1`; khuôn `thu_KHNAP1.js` / `thu_KHSOHD1.js`, POS giả):
  - hàm thuần: `docDon` với hoàn 35000 / 0 / null / thiếu / "35000" (chuỗi) / -5 / 1.5; lý do "Hết nguyên liệu" / "  " / null / thiếu; `soHoan` cùng bảng;
  - Chromium 360 · 390 · 430: (1) Theo dõi đơn chuyển `cho_tra` → `da_huy` (lý do "Hết nguyên liệu", hoàn 35000) → thấy 2 hộp đúng chữ, nút "Xem ví" mở `/uudai/vi`, POS giả
    nhận thêm đúng một lượt `GET /toi`; (2) Chi tiết đơn huỷ có hoàn + lý do; (3) huỷ có lý do, hoàn 0 → chỉ hộp lý do; (4) khách tự huỷ (null / 0) → KHÔNG có hộp mới
    (so DOM với gốc); (5) POS cũ không có hai trường → như (4); (6) Lịch sử đơn: thẻ huỷ có hoàn có dòng "Đã hoàn 35.000đ", thẻ khác không; không tràn ngang; chữ sửa ở /admin
    (đổi `td.huy.hoan`) → màn hiện chữ mới. Đỏ trên gốc.
- C2 Bài CŨ đổi có chủ đích → sửa đúng ca (đỏ trên gốc, kể cả `KHONG_TRINH_DUYET=1`); KHÔNG dùng `## Bài thử cũ sửa`.
- C3 Đột biến tay (`viec/KH-HUY-1/dot_bien_tay.js`) ≥ 5, mỗi cái ĐỎ: nhận hoàn âm / chuỗi · hiện hộp khi null/0 · App tự ghép lý do · bỏ `moVi` (nút không mở ví) ·
  hiện dòng hoàn ở thẻ đơn chưa huỷ · không làm mới `cuaToi`.
- C4 Ảnh 390 trước / sau → `viec/KH-HUY-1/so_anh/` (Theo dõi đơn huỷ, Chi tiết đơn huỷ, Lịch sử có thẻ huỷ); soát cuối so ảnh `LUU_ANH_DIR` gốc ↔ nhánh: màn ngoài phạm vi
  KHÔNG đổi.
- C5 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K9 / K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- C6 Chủ quán thử tay sau khi gộp — KHI POS bán hàng được (cùng đợt thử KH-NHANH-2): đặt một đơn nhỏ trên App, trả bằng ví → ở POS huỷ đơn đó, chọn lý do → App Theo dõi đơn
  hiện lý do + "Đã hoàn … vào ví của bạn", bấm "Xem ví" thấy số dư cộng lại; Lịch sử đơn có dòng "Đã hoàn …".

## Phạm vi
- viec/KH-HUY-1/**
- src/datDon.js
- src/hoaDon.js
- src/App.jsx
- src/pages/TheoDoiDon.jsx
- src/pages/Don.jsx
- src/components/DonHuy.jsx
- src/noiDung/nd/donHang.js
- src/kiemKhop/canTuPos.js
- cong_cu/thu_KHHUY1.js
- cong_cu/thu_*.js
- cong_cu/no_chu_cung.txt

## Ngân sách
~60 dòng app (docDon + soHoan ~10, DonHuy ~25, 3 chỗ gắn ~10, danh mục ~8, canTuPos ~4) + ~250 dòng thử. **Phương án đơn giản nhất đã xét:** MỘT thành phần dùng ở 2 màn,
lớp CSS có sẵn, chữ POS hiện nguyên, không thêm lượt hỏi POS (trừ một lần làm mới số dư ngầm). Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG đổi luật tiền, KHÔNG tự tính số hoàn, KHÔNG đổi luồng huỷ của khách (`huyDon`, "Tạo mã mới"), không đổi hợp đồng `/api/kh`, không thêm lối mạng.
- KHÔNG thêm tệp .css, không thêm màu ngoài bảng demo (K9). KHÔNG sửa bộ kiểm (`kiem_tra_truoc_khi_giao.js`).
- KHÔNG sửa `src/components/TheQR.jsx`, `src/giaoDien/**`, `src/quangCao.js`, `src/api.js`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `cong_cu/ha_no_chu.js`,
  `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `public/sw.js`. Việc KH-SUA-2 (16 mục) KHÔNG làm ở đây.
- Chỉ push `git push -u origin viec/KH-HUY-1`. Không đụng `main`, không merge, không tạo PR.
