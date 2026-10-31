# KH-UI-3d — kế hoạch

Đã đọc (31.10, HEAD 7e1be30): `src/duongDan.js`, `luongDangNhap.js`, `App.jsx`, `pages/UuDai.jsx`, `pages/HoSo.jsx`, `pages/TrangChu.jsx`, `dinhDang.js`,
`noiDung/dangNhap.js`, `heThong.js`, `gioVang.js`, `components/OGioVang.jsx`, `TheMoi.jsx`, `TrangTai.jsx`, `giaoDien/demo_1.css`; demo `rewards` (dòng 2165–2218) và CSS `tier-card` / `rw-*`.

## A. Lời chào + xưng hô
| | Phương án A (chọn) | Phương án B |
|---|---|---|
| Cách làm | Sửa `chiaLoiChao` / `loiChao` / `tenNgan` tại chỗ ở `dinhDang.js` (~6 dòng); `XUNG_HO` đổi `ten` sang chữ thường (1 dòng); `HoSo.jsx` thêm "!" và dùng chữ thường (2 dòng) | Thêm hàm mới `chao2` rồi bỏ hàm cũ |
| File / dòng | 3 file, ~10 dòng | 4 file, ~30 dòng |
| Rủi ro | 4 bài cũ có ca mong đợi cũ (KHUI3b, KHXEM1, KHUI2, KHLINK1) phải đổi — các ca đó ĐỎ trên gốc nên không dính A11 | ít hơn, nhưng để hàm chết |

Chốt A. `loiChao` = `${dau}${dau==='Chào'?' ':', '}${[xung, ten].join(' ')}!`; `xung` = chữ thường; `tenNgan` viết hoa chữ đầu (A2).
A5: rà bằng `grep` mọi chỗ có xưng hô / lời chào trong `src/` — kết quả ở `trang_thai.md`. Đã thấy: `TrangChu.jsx` (2 chỗ gọi `loiChao`), `HoSo.jsx` (xem trước + 7 nút), `DangNhap.jsx` (7 nút bước 3). Cả ba đọc `XUNG_HO` / `loiChao` nên đổi một chỗ là đủ. Không có nhãn "Anh Linh" nào khác trong `src/` (grep `Chào|Anh|Chị` chỉ ra các chỗ trên).

## B. Ưu đãi cho khách vãng lai
| | Phương án A (chọn) | Phương án B |
|---|---|---|
| Cách làm | `UuDai.jsx` nhận `dangNhap`; tách `UuDaiToi` (phần riêng: `/toi`, `/diem`, `NhanMa`, voucher, lịch sử — mã cũ, chỉ chuyển chỗ) và phần chung (banner Giờ vàng, thẻ hạng). Bỏ `canDN` của `uudai`. `luongDangNhap.canDangNhap` nhận thêm `maCho` để giữ B3 | Giữ `canDN`, làm trang riêng cho vãng lai |
| File / dòng | `duongDan.js` (1), `luongDangNhap.js` (2), `App.jsx` (~4), `UuDai.jsx` (~+60), `noiDung/dangNhap.js` (+1 hằng), `demo_1.css` / `demo_2.css` (chép CSS `tier-card`, `rw-*` của demo ~12 dòng) | thêm 1 trang, đường dẫn thứ hai — sai nguyên tắc "một đường dẫn một trang" |
| Rủi ro | B3: `?ma=` chuyển về `/uudai` rồi phải bị đẩy sang đăng nhập khi chưa đăng nhập → `canDangNhap('uudai', false, maCho)` = true khi `maCho` còn | |

Chi tiết quyết định:
- Banner Giờ vàng: điều kiện `tt && tt.pha !== 'sau' && !(coMenu && maGv.size === 0)` (cùng điều kiện với `OGioVang`). Chữ: nhãn `Giờ vàng` + `batDau – ketThuc` + `giảm {phanTram}%`; nút gọi `moGioVang` của App.
- Thẻ hạng: đã đăng nhập có `hang` → "Hạng <ten>", "Giảm <phan_tram>% món thường" (+ "<phan_tram_nhom_dac_biet>% nhóm đặc biệt" khi > 0), "Thẻ hết hạn: <dinhDangNgay(het_han)>". `hang: null` hoặc vãng lai → "Hạng thành viên" + từng hạng của `dsHang` (kho `heThong`). Chưa có `dsHang` → ẩn. Bỏ nút "Quyền lợi & nâng hạng" và huy hiệu (sprite `m-medal-*` chưa có trong `index.html`, ngoài phạm vi) — lý do (a).
- Khối khoá vãng lai: dùng `TheMoi` sẵn có với chữ mới `THE_MOI_UU_DAI` (nút "Đăng nhập" → `/dangnhap?tiep=/uudai`).
- Đã đăng nhập: thêm đọc `/toi` (cho `hang` + `so_du_vi`) — cần cho B2, không phải cửa mới.

## C. Ca thử ↔ nghiệm thu (`cong_cu/thu_KHUI3d.js`)
Phần 1 (không trình duyệt; số ca ghi theo `KHONG_TRINH_DUYET=1`): A1 (5 dạng + chưa-giờ + giờ T/dấu cách), A2, A3 (`XUNG_HO` chữ thường, mã giữ nguyên), A4 (nguồn `HoSo.jsx` dùng `chiaLoiChao` + dấu "!"), B1 (`/uudai` không `canDN`; `canDangNhap('uudai', false, '')` = false), B3 (`canDangNhap('uudai', false, 'AB12')` = true; `dichSauDangNhap` → `/uudai`), nguồn `UuDai.jsx` không còn "Ưu đãi của tôi" cứng cho mọi khách.
Phần 2 (Chromium + POS giả): B2 vãng lai (bảng hạng, banner khi có / ẩn khi không, khối khoá, KHÔNG điểm / voucher / ô nhập mã); B2 đã đăng nhập (thẻ hạng, điểm, ví, voucher); `hang: null`; B3 `?ma=X` → đăng nhập → `/uudai` với X điền sẵn; B5 đăng xuất rồi bấm tab Ưu đãi; A1/A3/A4 trên Trang chủ + Thông tin cá nhân; 360/390/430 × chữ 100% / 130%, không tràn ngang.
Luồng hợp lệ không bị chặn (K5): khách đã đăng nhập mở `/uudai` bình thường; khách vãng lai mở `/uudai` KHÔNG `?ma=` không bị đẩy sang đăng nhập; Trang chủ / Menu vẫn mở như cũ.
Đột biến (`dot_bien.py`): VS-HOA-GIUA (xưng hô viết hoa), VS-THIEU-CHAM-THAN (thiếu "!"), VS-VANGLAI-DIEM (vãng lai vẫn vẽ phần riêng), VS-GV-KHONG-CO (banner hiện khi không có Giờ vàng), VS-MA-MAT (bỏ `maCho` khỏi `canDangNhap`), BV-CANDN (trả lại `canDN` cho uudai).

## D. Đường song song cần canh
- `App.jsx` dòng 172 (`dangNhap && taiTab('uudai')`) → đổi; `moDangNhap` đã có sẵn.
- `donPhien` (đăng xuất / 401) giữ nguyên → B5 đúng (về Trang chủ).
- `HoSo.jsx` và `TrangChu.jsx` cùng gọi hàm lời chào → không có đường thứ ba.
- `thu_KHLINK1`, `thu_KHXEM1`, `thu_KHUI2`, `thu_KHUI3b`: ca cũ mong `uudai` cần đăng nhập / xưng hô viết hoa → sửa; cần `SỐ CA` mới (A16).
