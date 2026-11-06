# KH-BAO-1 — kế hoạch (việc thường, chạy thẳng)

Đã đọc: `dungDatDon.js`, `App.jsx`, `duLieuKhach.js` (kho `cuaDon`), `TheoDoiDon.jsx`, `ThanhToan.jsx`, `HoaDonKhach.jsx`, `hoaDon.js`, `luuMay.js`, `datDon.js`
(`docDon` L~75, `ghiGuiDo`, `guiDonAnToan`), `thu_KHMUA1b.js` (`dungMay` = POS giả + App esbuild), CSS demo (`.nt-state.on`, `.care-disclaimer`).

## Phát hiện khi đọc code (ảnh hưởng thiết kế)
- `datDon.docDon` KHÔNG chuyển `hoa_don` → `TheoDoiDon` không có tờ để vẽ. `datDon.js` ngoài Phạm vi → đọc `hoa_don` ở `dungDatDon.js` (trong Phạm vi): `dungTheoDoi`
  gọi `layChiTietDon` + `docDon` rồi gắn `hoa_don` thô (Don.jsx cũng đọc thô, `docHoaDon` làm sạch).
- C3: lỗi `CHUA_MO` ở gửi lại đi qua nhánh `ghiGuiDo(null)` (ThanhToan.jsx L123) → xoá bản ghi "chưa rõ". Sửa ở `ThanhToan.jsx` (trong Phạm vi), KHÔNG cần sửa `datDon.js`.
- Demo chỉ có âm thanh màn mở (`/am_thanh/man_dau.mp3`, nhạc dài, tự phát khi mở) — không phải tiếng báo ngắn → KHÔNG làm tiếng (phiếu: "nếu demo có sẵn dùng lại được").
  Chỉ rung `navigator.vibrate`.
- `App.jsx` đặt `document.title` mỗi lần đổi trang → ghi đè tiêu đề "(Xong)". Nâng trạng thái `tieuXong` lên App (1 state + thêm vào effect tiêu đề).

## Phương án
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| Hỏi `GET /don` | dùng LẠI kho `cuaDon` (`cuaDon.lay()` dùng chung lệnh đang chờ; Lịch sử đơn cũng được làm mới) — hook trong component, ~25 dòng | tự `fetch` + state riêng | A: không gọi trùng, không cửa mới; đọc `dungKho(cuaDon.kho)` |
| Phát hiện đơn xong | hàm thuần `baoDonXong.js` `xemDanhSach(ds, nho)` → `{nho, choBao[], dangChay}`; `nho = {thay[], bao[]}` ở `sessionStorage` (`kh_bao_don`, tiêm kho để thử) ~45 dòng | trạng thái trong component | A: bài thử nạp thẳng (A1) |
| Dải | component `BaoDonXong.jsx` (khuôn `.nt-state.on`, ✕ + "Xem đơn"), đặt `order:-1` trong `.phone` (flex cột) → nằm TRÊN cùng, không che thanh dưới, không cần sửa khung — ~40 dòng + CSS ~15 dòng | `position:absolute` đè đầu màn | A: không che nút "Quay lại" của màn |
| Tải lại sau khi trả | `daTra(ma)` ở App (TheoDoiDon gọi khi đơn rời `cho_tra`) thêm `lamMoi([cuaDon])` → đơn QR vừa trả sang `da_tra` thì dải bắt đầu hỏi (1 dòng) | coi `cho_tra` là đang chạy (hỏi mãi nếu QR bỏ dở) | A đúng A2 "mở Theo dõi đơn → hỏi lại một lần" |
| Tờ hoá đơn | `dungDatDon.js` đưa `hoa_don` vào `don`; `TheoDoiDon.jsx`: `docHoaDon(don).length ? <div.order-card><HoaDonKhach/></div> : như cũ` — ~6 dòng | sửa `datDon.docDon` (cấm) | A |
| Dòng `ghi_no` | lọc ở `HoaDonKhach.jsx` (`dong.filter(loai !== 'ghi_no')`) — 1 dòng; áp cả Chi tiết đơn (cùng §5) | sửa `hoaDon.js` (cấm) | A |
| Nhớ công tắc | `dungVi` khởi tạo từ `kh_dung_vi` (`docDungVi()`), `datDungVi` ghi (`ghiDungVi`); luật dẫn xuất `cachTra` có sẵn đã tự tắt khi `/toi` lỗi / đang tải / 0đ → C2 đúng mà không thêm nhánh. Hàm đọc / ghi + hằng `KHOA_DUNG_VI` ở `luuMay.js` (đã là nơi giữ danh sách khoá; tránh vòng import với ThanhToan) ~12 dòng | khoá ở file mới | A |
| C3 | `ThanhToan.jsx`: lỗi `CHUA_MO` khi gửi lại (`cu`) → GIỮ bản ghi (như nhánh QUA_NHIEU_LAN); nút gửi lại khoá + chữ `CHU_CHUA_MO` khi `!DAT_ONLINE` — ~4 dòng | sửa `datDon.js` | A |
Ước lượng app: ~185 dòng (baoDonXong 45, BaoDonXong 45, css 15, App 8, TheoDoiDon 8, dungDatDon 6, ThanhToan 8, luuMay 12, HoaDonKhach 1) — sát ngân sách ~180; thử ~350.

## Luật chi tiết
- Đơn "đang chạy" = `da_tra` / `dang_lam`; "đã thấy" = từng thấy đang chạy ở máy này (sessionStorage, tối đa 60 mã). Báo khi `xong` + đã thấy + chưa tắt. `da_huy`, `cho_tra`, `xong` từ trước → không báo.
- Hỏi 15 giây khi CÓ đơn chạy và tab hiện; tab ẩn → không hỏi; quay lại tab → hỏi ngay 1 lần; không đơn chạy → không hỏi lặp.
- ✕ / "Xem đơn" → ghi mã vào `bao[]` (bộ nhớ + sessionStorage), tiêu đề trả lại, không báo lại.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHBAO1.js`; Phần 1 chạy cả khi `KHONG_TRINH_DUYET=1`)
A1: chạy→xong báo · xong từ trước không báo · đã tắt không báo lại · `da_huy` không báo · `cho_tra` không báo · nhiều đơn: lần lượt · dữ liệu rác (null, thiếu ma) không vỡ ·
 `docNho/ghiNho` kho chặn không vỡ.
A2 (đọc nguồn): `<BaoDonXong` gắn đúng 1 lần ở App, chỉ khi `dangNhap`; chỉ gọi `cuaDon.lay`; không `layChiTietDon`; 15 000 ms; `vibrate`; không thư viện / âm thanh mới.
A2 (Chromium): đặt đơn ví → sang Menu → POS `xong` → dải trên Menu ≤ 15 s, title đổi · tab ẩn không hỏi, hiện lại hỏi ngay · không đơn chạy → không hỏi lặp ·
 ✕ → không hiện lại (kể cả tải lại) · "Xem đơn" → `/don/<ma>` · dải ở Trang chủ / Menu / Giỏ / Tài khoản, không vỡ 360 · đổi trang không ghi đè title.
A3: dòng "Giữ App mở…" khi `dang_lam`; "Đơn đã xong — mời bạn ra quầy" khi `xong`; số lần gọi `GET /don/:ma` không dày hơn (đếm trong cửa sổ 30 s ≤ như trước).
B1/B2: có `hoa_don` → vẽ tờ, hết danh sách `mon[]` + "Tổng cộng"; không dòng "nợ" / `ghi_no`; thứ tự các dòng khác giữ; rỗng → như cũ.
C1/C2: bật → `kh_dung_vi='1'`, tắt → `'0'`; mở lại bật SẴN khi ví đủ; `/toi` lỗi → tắt; ví 0đ → tắt; kho chặn không vỡ; thân `POST /don` đúng `cach_tra` (vi / vi_qr / qr), vẫn hỏi PIN (K5);
 đăng xuất / đổi khách → xoá; không nằm trong `KHOA_VANG_LAI`; không có PIN trong kho.
C3: `DAT_ONLINE` tắt + "Gửi lại đúng đơn này" → bản ghi còn, nút khoá + `CHU_CHUA_MO` (hàm đọc nguồn + ca nhánh lỗi); đường hợp lệ (DAT_ONLINE bật) gửi lại vẫn chạy (K5).
Đường song song: `dungLamMoiNgam` cũng gọi `cuaDon.lay()` khi quay lại tab → `lay()` dùng chung lệnh đang chờ nên không gọi đôi (ca đếm). `xongDatDon`, `daHuy` đã làm mới `cuaDon`.

## Bài cũ phải sửa (E2, máy grep)
`thu_KHHD1` (ghi_no không vẽ), `thu_KHLUU1` (danh sách khoá + `kh_dung_vi`), `thu_KHTT1` (công tắc mở = tắt), `thu_KHMUA1/1b/1c` + `thu_KHNHANH1` (Theo dõi đơn vẽ `mon[]`, khoá, gửi lại khi `CHUA_MO`) —
mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc ở Phần 1 (đọc nguồn / hàm thuần). Không nới phép kiểm tiền.

## Bổ sung sau soát kế hoạch (agent phụ, vòng 1)
- `kh_bao_don` (sessionStorage) XOÁ khi `BaoDonXong` tháo ra (đăng xuất / 401 / đổi khách đều làm `dangNhap` = false → tháo; tải lại trang KHÔNG chạy dọn nên mã vẫn nhớ qua tải lại). Ca thử: đăng xuất → khoá mất.
- Hai đơn xong cùng lúc: dải hiện đơn đầu của `choBao` (thứ tự POS trả, mới nhất trước); ✕ đơn đó → đơn kia hiện tiếp; tiêu đề theo đơn đang hiện. Ca thử hàm thuần + Chromium.
- `GET /don` chỉ trang 1 (20 đơn): đơn đang chạy bị đẩy khỏi trang 1 thì không báo — chấp nhận, ghi ở `doi_chieu_demo.md`.
- A3 thêm ca `cho_tra` và `da_huy` KHÔNG hiện dòng "Giữ App mở…".
- D: ca đọc nguồn (CSS import trong BaoDonXong, `main.jsx` / `giaoDien.css` / `demo*.css` không nhắc `bao_don`); ảnh D2 chụp ở bước 6.
- C2: ca "số dư giảm về 0 thì tắt, `kh_dung_vi` vẫn '1'" và "số dư lên đủ thì bật sẵn".
- `App.jsx` chỉ sửa: import, 1 state `tieuXong` + effect tiêu đề, `daTra` thêm `lamMoi([cuaDon])`, một dòng `<BaoDonXong>` cạnh `<Thongbao>`. KHÔNG đụng dòng `<UuDai>`.
- E3 (`dot_bien.py`) làm ở bước 6, ghi bảng ở `trang_thai.md`.
