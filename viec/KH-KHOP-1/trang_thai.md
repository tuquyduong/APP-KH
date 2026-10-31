# Trạng thái KH-KHOP-1

## Bước 1 — đối chiếu bản chụp (31.10.2026)
Nhánh `viec/KH-KHOP-1`; HEAD = FETCH_HEAD = `c2f1982` (đã đủ commit của origin, không kéo).
```
c2f1982 PHIEU: KH-KHOP-1
60bf700 TIEN-DO: KH-MUA-1 (phia App) xong; mo KH-KHOP-1 - so v13
71980a6 TIEN-DO: ban giao chat App KH moi (31.10); luu yeu cau gui POS 31.10 + b
```
Người gác chặn 5 lệnh trong phiên (lý do + cách xử): `B-BIMAT-FILE` (lệnh nhắc `.env*` → bỏ, dùng Grep) · `B-BIMAT-CHU` ×1 (bài thử có chữ "token" phải nằm trong lịch sử commit trước khi chạy → commit rồi chạy) · `B-PHANTICH` ×6 (ghép `tee` / `mkdir` / `ls` / `git status` / biến môi trường vào lệnh chạy script → tách lệnh) · `SED-I` (dùng Edit) · `B-CHUONGTRINH` (Monitor `until` → chờ thông báo nền).

## Bài thử
- `cong_cu/thu_KHKHOP1.js`: ĐỎ trên code gốc (2 đạt · 31 hỏng, `bang_chung_do.txt`), XANH sau làm: 84 đạt · 0 hỏng (có Chromium), 47 đạt · 0 hỏng (`KHONG_TRINH_DUYET=1`, = số GitHub đếm).
- `npm test` (HEAD `2119b29`): 25 đạt · 0 hỏng; `node kiem_tra_truoc_khi_giao.js --day-du`: 27 đạt · 0 hỏng (K6–K9 xanh, `vite build` được).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . c2f1982^ HEAD viec/KH-KHOP-1` → `✓ CỔNG CHẠY ĐẠT` (· CẢNH BÁO A16: trên gốc 18 ca ≠ 47 ở head — bài dừng sớm vì chưa có module, dự kiến). Chạy KHÔNG có biến đó ở máy này (có Playwright) thì A16 đỏ 47 ≠ 84 — đúng CLAUDE.md §9.

## Đột biến (`dot_bien.py`) — chỗ vá → đột biến; cả 10 ĐỎ
| Chỗ vá | Đột biến |
|---|---|
| không gọi cửa ngoài hợp đồng (`canTuPos.js` co:false) | `VS-GOI-CUA-NGOAI-HOP-DONG` (69 đạt · 9 hỏng) |
| mỗi cửa gọi đúng một lần (`KiemKhop.jsx`) | `VS-GOI-HAI-LAN-MOI-CUA` (78·6) |
| thiếu trường → ✗ / ⏳, không ✓ (`kiemTruong`) | `VS-BAO-CO-KHI-THIEU-TRUONG` (76·8) · `VS-MANG-RONG-BAO-CO` (82·2) |
| trường mới chưa có → ⏳ không ✗; 401 ở cửa tuy_chon → ⏳ | `VS-TRUONG-MOI-THIEU-BAO-LOI` (82·2) · `VS-401-CUA-TUY-CHON-BAO-LOI` (82·2) |
| không ghi bộ nhớ máy (B5) | `VS-GHI-BO-NHO-MAY` (82·2) |
| `/kiemkhop` dựng riêng, vỏ App không chạy (`main.jsx`) | `BV-BO-NHANH-KIEMKHOP-O-MAIN` (47·15) |
| khoá "Kiểm lại" lúc mở và 5 giây (B4) | `BV-BO-KHOA-KIEM-LAI-LUC-MO` (80·4) · `VS-CHONG-DON-HET-NGAY` (80·4) |

## Nghiệm thu — đếm từng mục
- A1 `src/kiemKhop/canTuPos.js` (31 mục) · bài thử "A1 …" (5 ca)
- A2 bài thử "A2 …" (đối chiếu hai chiều với HOP_DONG_MAY_DOC, trường mục cũ ⊂ `tra`)
- B1 ca "B1 …": đường dẫn `/kiemkhop` trong `duongDan.js` (tab null, không đăng nhập, giữ chỗ trong vỏ App), không file nào khác nhắc, `<meta robots noindex>` do trang tự đặt (không sửa `index.html`)
- B2 ca `thong-vang-lai` / `chan-khac-nguon` / `chua-cau-hinh` / `loi-khac` (địa chỉ POS đầy đủ, giờ POS, độ lệch)
- B3 ca `thong-vang-lai` / `dang-nhap` / `thieu-truong` / `khong-co-don` / `menu-con-doi-dn`
- B4 ca `kiem-lai` (khoá, bấm dồn, 130 giây không gọi nền, gọi lại đúng 1 lần mỗi cửa)
- B5 ca `dang-nhap` (không SĐT / tên / mã đơn / điểm trên trang; localStorage chỉ còn token đã gieo)
- B6 ca "B6 đầu tệp…" · C1 6 ca `man-360/390/430` × chữ 100% / 130% (CSS thật) · C2 mục này
- C3 chủ quán thử tay — chưa làm (xem dưới)

## Báo cáo soát độc lập (`/ra-soat`, vòng 1) — chép
KHÔNG ĐẠT (nhẹ): (1) `duongDan.js` BANG thêm `kiemkhop` mà `App.jsx` không vẽ → trắng màn với `?tiep=/kiemkhop` hoặc `//kiemkhop` — K5; (2) `App.jsx:47` chạy `docVaXoaMaTrenDiaChi` ở cấp module nên `/kiemkhop?ma=…` đổi thanh địa chỉ — K4; (3) thiếu `so_anh/`, `doi_chieu_demo.md`, ghi chép `trang_thai.md`/đột biến. NGHI NGỜ: noindex chưa đặt; `/don` lỗi vẫn báo "chưa có đơn"; 401 xoá token trên trang tạm. NGHIỆM THU 8/11 (thiếu B1 một phần, C2, C3). BÀI HỌC của agent: chọn "trang riêng ở main.jsx" thì phải rà đường còn tham chiếu trang đó trong App và hiệu ứng chạy lúc import.
Đã xử lý ở vòng 1: (1) `giuCho: true` + ca thử `giuCho`; (3) có đủ `so_anh/` (360/390/430), `doi_chieu_demo.md`, mục này; noindex đặt bằng JS + ca thử; `/don` lỗi → dòng chi tiết đơn hiện lỗi của `/don`, không còn "chưa có đơn". Ghi nhận không sửa: (2) `?ma=` ở `/kiemkhop` (QR hoá đơn không trỏ vào trang này; sửa bằng `import()` động đổi cách tải mọi khách — K5) và (4) 401 xoá token (hành vi chung của `api.js`, đã ghi ở `ke_hoach.md`). `ke_hoach.md` ước 235 dòng, thực tế ~185 dòng app (đúng ngân sách ~180).

## Câu hỏi
(không)

## Phát hiện (ngoài phạm vi, không sửa)
- `src/App.jsx:47` chạy ở cấp module ngay khi import → mọi trang dựng ngoài App (như `/kiemkhop`) vẫn bị `?ma=` đổi địa chỉ. Nên gom vào hàm gọi trong App khi cần.
- `src/api.js:49`: 401 trên MỌI cửa có gửi token xoá token — trang chủ quán mở bằng token cũ sẽ đăng xuất âm thầm (dữ liệu trên máy không mất, §8).
- Hợp đồng trong kho còn bản 2: khi POS gộp KH-API-3 / GIOVANG-1 / KH-SP-1 / KH-MUA-1 và chủ quán chép hợp đồng mới, bài thử A2 sẽ ĐỎ cho tới khi sửa `co` / `moi` trong `canTuPos.js` (cố ý — nhắc cập nhật bảng).

## Chủ quán thử tay (C3, 2 bước)
1. Mở `https://app-kh.pages.dev/kiemkhop` trên điện thoại → phần "Kết nối" hiện ✓ "Thông", bảng có ✓ và ⏳.
2. Đăng nhập app rồi mở lại `/kiemkhop` → các mục "Đăng nhập để kiểm" đã được kiểm (✓ / ✗ / ?).

## Báo cáo 7 mục
- VIỆC: KH-KHOP-1 — trang `/kiemkhop` kiểm khớp App KH ↔ POS.
- ĐÃ SỬA: mới `src/kiemKhop/canTuPos.js`, `src/kiemKhop/kiemKhop.js`, `src/pages/KiemKhop.jsx`; sửa `src/main.jsx` (rẽ nhánh `/kiemkhop`), `src/duongDan.js` (+1 dòng); bài thử `cong_cu/thu_KHKHOP1.js`. Không sửa `index.html`, `thiet_ke/`, `tu_chay/`, `api.js`.
- BÀI THỬ: như mục "Bài thử" và "Đột biến" ở trên (10/10 đột biến đỏ).
- ĐÃ RÀ K4: `grep` mọi chỗ tự gọi mạng: `heThong.js` (setInterval, visibilitychange), `dungMenu.js`, `App.jsx` (`layToi`) chỉ chạy khi App mount — `/kiemkhop` không mount App (ca `kiem-lai` đếm 130 giây không gọi lại); còn lại `App.jsx:47` ghi ở Phát hiện.
- CHƯA KIỂM: C3 (chủ quán thử trên điện thoại thật + POS thật: POS thật có thể trả trường khác bài thử giả); trình duyệt Zalo; GitHub Actions chưa chạy; ca `trường POS trả null` vẫn tính là có mặt (khoá có mặt = ✓).
- GIT: nhánh `viec/KH-KHOP-1`, đã push; không merge, không tạo PR.
- BÀI HỌC: xem dưới.

## Bài học
- KHOÁ (đã làm, trong phạm vi): ca `giuCho` cho `/kiemkhop` trong `thu_KHKHOP1.js` (B1) — chặn trang dựng ngoài App thành ngõ cụt trong App.
- NGUYÊN TẮC (đề xuất, ngoài phạm vi): mục K9 trong `KHUON_LOI.md` — "Trang dựng ngoài App (main.jsx rẽ nhánh) vẫn bị App import chạy hiệu ứng cấp module và vẫn nằm trong BANG đường dẫn". Đã gây: soát KH-KHOP-1 (`/kiemkhop?ma=`, `?tiep=/kiemkhop`). Dấu hiệu: thêm trang vào BANG nhưng App không vẽ. Chặn: `giuCho: true` + bài thử hồi quy; khi cần, đưa `docVaXoaMaTrenDiaChi` vào trong App.
- BỎ: bài thử có chữ "token" bị người gác chặn tới khi commit — chỉ gặp một lần, đã biết trong skill.

HEAD ĐÃ KIỂM: f068102
