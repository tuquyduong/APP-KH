# KH-HD-1 — Chi tiết đơn = đúng tờ hoá đơn giao khách của POS (`hoa_don[]`, hợp đồng v7 HD-KH-1)

<!-- Chat App KH soạn 05.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết (không chờ duyệt kế hoạch). Hạn 07.11.
     CHẠY SONG SONG với KH-MUA-1c (đang làm, nhánh viec/KH-MUA-1c) và KH-SINH-1 (nhánh viec/KH-SINH-1) — xem mục "Chạy song song" ở cuối.
     Chủ quán 05.11 (ảnh màn Chi tiết đơn #A47Z8N9CF): "3 × TEST 1000 — 3.000đ · Tổng 2.700đ" — thiếu dòng giảm hạng Kim Cương, không biết trả bằng gì,
     nhận ở đâu. "Lịch sử đơn nên có thông tin cụ thể chi tiết hơn … giống như tóm tắt đơn của họ thật."
     POS đã có (hợp đồng v7, main POS; chép nguyên văn đoạn dưới — bản hợp đồng trong kho App còn v5 tới khi KH-MUA-1c gộp, KHÔNG chép file hợp đồng):

     `GET /don/:ma` → `don { …, hoa_don[] { loai, trai, phai, dam, gach, ghi_chu } }`.
     "- `hoa_don[]` (chỉ ở `GET /don/:ma`): các dòng của tờ GIAO KHÁCH, dựng sẵn bằng CÙNG hàm của hoá đơn in ở quầy (`client/src/utils/hoaDon.js`) trên
       cùng dữ liệu + cùng chữ ở Cài đặt hoá đơn; App chỉ vẽ theo thứ tự, không tự tính / xếp. Mỗi dòng đủ 6 trường: `loai` (xem dưới), `trai`, `phai`
       (chữ, có thể rỗng), `dam` (true = in đậm cả dòng), `gach` (chữ gạch ngang — giá gốc của món có giá hạng, còn lại rỗng), `ghi_chu` (ghi chú của món).
       `loai`: `canh_bao` (đơn huỷ / hoàn) · `ten_quan` · `dia_chi` · `so_bill` (trai = chữ "SỐ BILL", phai = số bill) · `nhan` · `gio` (trai = giờ, phai =
       nhân viên — RỖNG với đơn App, chủ quán 03.11) · `khach` (trai = nhãn, phai = tên) · `mon` (trai = "SL x tên", phai = thành tiền) · dòng tiền `gia_goc`
       `giam_hang` `giam_flash` `giam_ma` `phi_giao` `tong` · `tieu_de` (đầu mục THANH TOÁN / ĐIỂM THƯỞNG) · dòng trả `tu_tk` `tu_tk_me` `ck` `tm` `ghi_no`
       `dua_tra` · dòng điểm `diem_truoc` `diem_doi` `diem_cong` `diem_co` · `chan` (lời cảm ơn, chính sách, ghi chú). App bỏ qua `loai` lạ nhưng vẫn vẽ
       `trai` / `phai`. KHÔNG có QR, mã nhận điểm, SĐT. Đơn App chưa có đơn thật (đang chờ trả, hoặc huỷ TRƯỚC khi trả) hoặc máy chủ không dựng được tờ →
       `[]` (App tự vẽ từ `mon[]`)."
     POS (TRA_LOI_POS_05112026 mục 2): `hoa_don[]` có đủ dòng cách trả, giảm hạng / mã / điểm, cách nhận như tờ in (bỏ có chủ ý: QR, mã nhận điểm, dòng in lại,
     tờ lưu). Danh sách tóm tắt ở Lịch sử đơn (`kenh`, `cach_nhan`, `tra[]`…) và số hoá đơn `so_hd` ("APP0016") là việc POS sau (KH-TOMTAT-1, CK-NOIDUNG-1)
     → KHÔNG làm ở đây. -->

## Mục tiêu
Khách mở một đơn (Lịch sử đơn → bấm đơn) thấy ĐÚNG tờ hoá đơn quán đưa: món + ghi chú, giá gốc gạch khi có giá hạng, giảm hạng / Giờ vàng / mã, tổng,
trả bằng gì (ví, chuyển khoản, tiền mặt…), điểm, lời cảm ơn — giống tờ giấy ở quầy, theo phong cách App.

## Nghiệm thu

### A. Đọc tờ hoá đơn — hàm thuần, MỘT chỗ
- A1 File MỚI `src/hoaDon.js` (hàm thuần, bài thử nạp thẳng): `docHoaDon(don)` → mảng dòng `{ loai, trai, phai, dam, gach, ghiChu }`; trường thiếu → chuỗi
  rỗng / `false`; `hoa_don` không phải mảng / rỗng → `[]`. KHÔNG tính tiền, KHÔNG sắp lại thứ tự, KHÔNG bỏ dòng (trừ dòng không phải object).
- A2 Nhóm hiển thị (chỉ để chọn kiểu vẽ, không đổi thứ tự): `dau` (`ten_quan`, `dia_chi`, `so_bill`, `nhan`, `gio`, `khach`), `canh_bao`, `mon`,
  `tien` (`gia_goc` `giam_hang` `giam_flash` `giam_ma` `phi_giao` `tong`), `tieu_de`, `tra` (`tu_tk` `tu_tk_me` `ck` `tm` `ghi_no` `dua_tra`), `diem`
  (`diem_truoc` `diem_doi` `diem_cong` `diem_co`), `chan`, `la` (loai lạ → vẽ `trai` / `phai` thường).
- A3 Dòng `gio` có `phai` rỗng → chỉ vẽ `trai` (không vẽ "undefined", không dấu ·).

### B. Màn Chi tiết đơn (`src/pages/Don.jsx` `ChiTietDon`)
- B1 Có `hoa_don` → vẽ theo thứ tự POS trong component MỚI `src/components/HoaDonKhach.jsx` (sẽ dùng lại ở màn Theo dõi đơn — việc sau, KHÔNG đụng
  `TheoDoiDon.jsx` ở đây):
  - `canh_bao` ở trên cùng, khuôn cảnh báo sẵn có (`.nt-state` / biểu tượng `warning`).
  - Khối đầu (`dau`) gọn: chữ nhỏ màu phụ; `so_bill` hiện như "Số bill: …".
  - `mon`: `trai` trái, `phai` phải; `gach` hiện giá gạch ngang cạnh `phai`; `ghi_chu` dòng nhỏ dưới tên món.
  - `tien`: như `summary-row` của giỏ; `giam_*` màu dòng giảm như giỏ (`.summary-row.discount`); `tong` / `dam` → đậm như `summary-row total`.
  - `tieu_de` → tiêu đề mục nhỏ (vd "THANH TOÁN", "ĐIỂM THƯỞNG"); `tra` / `diem` như dòng tiền thường.
  - `chan` → chữ nhỏ căn giữa cuối thẻ.
- B2 Không có `hoa_don` (rỗng) → giữ cách vẽ hiện nay (`mon[]` + Tổng) — đơn chờ trả / huỷ trước khi trả.
- B3 Nhãn trạng thái (Đã thanh toán / Chờ thanh toán / Đã hủy) giữ như nay. Mã trên tiêu đề giữ như nay (đổi sang `so_hd` là việc sau).
- B4 Giao diện theo tinh thần demo (CLAUDE.md §5): dùng lại lớp có sẵn (`order-card`, `summary-row`, `.discount`, `.total`, `sec-head`, `nt-state`); CSS mới
  (nếu cần) đặt ở file MỚI `src/giaoDien/hoa_don.css`, `import` TRONG `HoaDonKhach.jsx` (KHÔNG sửa `main.jsx`, `giaoDien.css`, `demo*.css`). K9 xanh.
- B5 Chữ dài (tên món, địa chỉ quán) xuống dòng, không tràn ở 360 px; chữ to theo cài đặt máy không vỡ.

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHHD1.js`: phần hàm thuần (`docHoaDon` với tờ mẫu đủ mọi `loai` + loai lạ + thiếu trường + `[]`) chạy cả khi
  `KHONG_TRINH_DUYET=1`; phần Chromium (POS giả trả `GET /don/:ma` có `hoa_don[]` theo mẫu trên): thấy dòng giảm hạng, dòng trả ví, giá gạch, ghi chú món,
  đơn huỷ có cảnh báo trên cùng, `hoa_don: []` → vẽ `mon[]`. `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- C2 Ảnh 360 / 390 / 430 (đơn trả ví có giảm hạng; đơn huỷ; đơn chờ trả không có tờ) → `viec/KH-HD-1/so_anh/`; `doi_chieu_demo.md` (demo màn `orderdetail`).
- C3 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.
- C4 Chủ quán thử tay: mở đơn #A47Z8N9CF (đơn ví hôm 05.11) → thấy "Ưu đãi hạng Kim Cương −300đ" và dòng trả bằng ví / tài khoản như tờ in.

## Phạm vi
- viec/KH-HD-1/**
- src/hoaDon.js
- src/components/HoaDonKhach.jsx
- src/giaoDien/hoa_don.css
- src/pages/Don.jsx
- cong_cu/thu_KHHD1.js

## Ngân sách
~120 dòng app + ~250 dòng thử.
**Phương án đơn giản nhất đã xét:** một hàm đọc + một component vẽ theo `loai`, dùng lại lớp CSS sẵn có; không tự tính tiền. Không đổi cửa / hợp đồng.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- Chạy song song: KHÔNG sửa `src/api.js`, `src/datDon.js`, `src/pages/ThanhToan.jsx`, `src/pages/TheoDoiDon.jsx`, `src/components/PinSheet.jsx`,
  `src/giaoDien/giaoDien.css`, `src/kiemKhop/**`, `thiet_ke/**` (KH-MUA-1c), `src/pages/HoSo.jsx`, `src/pages/TrangChu.jsx`, `src/pages/GioHang.jsx`,
  `src/dinhDang.js` (KH-SINH-1), `src/main.jsx`, bất kỳ bài thử cũ nào. Cần sửa ngoài Phạm vi → `## Câu hỏi`, dừng.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- KHÔNG tính tiền ở App. KHÔNG làm tóm tắt ở danh sách Lịch sử đơn, số hoá đơn `so_hd` (việc sau, chờ POS).
- Chỉ push `git push -u origin viec/KH-HD-1`. Không đụng `main`, không merge, không tạo PR.
