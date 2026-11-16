# KH-VC-2 — kế hoạch (CHỜ DUYỆT)

Nguyên tắc chung: App KHÔNG tính giảm, KHÔNG đoán voucher nào áp được. App chỉ dựng MỘT mảng mã theo thứ tự (chọn tay → hạn sớm), POS xét và trả từng
dòng `giam[]` / từng `voucher_loi[]`. Trạng thái tích ở Giỏ SUY từ báo giá POS (không giữ cờ "đã tích" riêng) → "tự bỏ chọn" / "tự tích lại" là hệ quả, không phải code thêm.

## Code đã đọc (căn cứ)
- `src/datDon.js:18-23` `thanBaoGia(gio, { maGiam })` — thêm `vouchers` ở đây; `thanDatDon` (`:27-31`) đi qua `thanBaoGia` → đặt đơn tự mang đúng mảng.
- `src/datDon.js:41-51` `docBaoGia` — chưa đọc `voucher_loi`, bỏ `ma` của `giam[]`.
- `src/datDon.js:54-59` `tenGiam(loai, tenHang)` — gọi ở `GioHang.jsx:29` (`BangTien`, dùng chung cho Thanh toán `ThanhToan.jsx:247`).
- `src/dungDatDon.js:15-33` `dungBaoGia(gio, tuy, bat)` — khoá = `JSON.stringify([gio, tuy, bat])`, báo giá cũ bị bỏ khi `tuy` đổi → thêm `vouchers` vào `tuy` là đủ để
  giỏ đổi / chọn đổi thì hỏi lại POS và nút đặt chỉ mở khi báo giá của ĐÚNG mảng đang gửi đã về (đặt đơn gửi đúng mảng của báo giá đang hiện).
- `src/pages/ThanhToan.jsx:43,49` `KHONG_MA = { maGiam: '' }`, `tuy = cheDoThe ? KHONG_MA : { maGiam }`.
- `src/App.jsx:143,148,162,236,238` `maGiam`, `docLaiGio`, `donPhien`, `daTra`, `daHuy`; `:253-254,260` prop của GioHang / ThanhToan / UuDai. `taiTab = trang === t` (`:220`)
  → GioHang dựng mới mỗi lần vào (ô mã khởi tạo từ `maGiam` đúng sau "Dùng ngay" của `ma_khach_moi`).
- `src/duLieuKhach.js:47` `cuaVoucher` (kho chung, nạp sẵn khi có phiên).
- `src/pages/UuDai.jsx:33-68` `TheVoucher`, `DanhSachVoucher`, `VoucherConDung/TatCa`; `:202-243` `UuDaiToi` (khối `wallet-row` KHÔNG đụng).
- `src/components/NhanMa.jsx:45` câu nhận ưu đãi khách mới.

## Phần A — hàm thuần + thân báo giá

### A1 `src/voucherGio.js` (MỚI)
- A: một tệp hàm thuần: `laShip`, `dsGui`, `trangThaiVoucher`, `chamVoucher(chon, ma, dangTich)` (chuyển trạng thái chọn khi chạm — dùng cho Giỏ VÀ "Dùng ngay"),
  `CHON_RONG`. ~45 dòng. Rủi ro: thấp (bài thử nạp thẳng).
- B: đặt các hàm vào `datDon.js` — bị Cấm (chỉ 3 hàm) + đụng NAP-1. Loại.
- **Chọn A.** Chi tiết:
  - `laShip(v)`: `kieu` ∈ {`ship_tien`, `ship_phan_tram`} hoặc `Number(giam_ship)` khác 0.
  - `dsGui(vi, { boTay, chonTay })`: `vi` = mảng `data[]` (không phải mảng → `[]`). Lọc: có `code`, không ship, không trong `boTay` (so `toUpperCase`). Xếp: mã trong
    `chonTay` trước theo đúng thứ tự mảng `chonTay` (mới chạm đứng đầu — `chamVoucher` chèn vào đầu), rồi còn lại theo `expires_at` tăng dần — so CHUỖI giờ VN
    `YYYY-MM-DD…` (không `new Date`, CLAUDE.md §6); không hạn / sai dạng → cuối; bằng nhau → giữ thứ tự ví (sort ổn định). Bỏ trùng (hoa thường), cắt 10.
    Mã `chonTay` không còn trong ví (đã dùng / bị giữ) → không gửi.
  - `trangThaiVoucher(ma, bg)`: `bg` null → `'cho'`; có dòng `giam[]` `loai === 'voucher'` cùng `ma` (hoa thường) → `'dung'`; có trong `bg.voucherLoi` → `{ loi: error }`; còn lại `'cho'`.
  - `chamVoucher({ boTay, chonTay }, ma, dangTich)`: đang tích → `boTay + ma`, `chonTay − ma`; không tích → `chonTay = [ma, …chonTay − ma]`, `boTay − ma`.

### A2 `src/datDon.js` (CHỈ 3 hàm)
- `thanBaoGia(gio, { maGiam, vouchers })`: thêm `t.vouchers = vouchers` CHỈ khi `Array.isArray(vouchers) && vouchers.length` — đặt sau `ma_giam`, trước `cach_nhan`;
  thiếu → thân (và JSON để băm khoá gửi) y như cũ. ~1 dòng.
- `docBaoGia`: `giam[]` giữ `ma` khi có (`...(chu(g.ma) ? { ma } : {})` — dòng không mã giữ nguyên hình cũ); thêm `voucherLoi: [{ ma, code, error }]` (lọc dòng có `ma` + `error`). ~3 dòng.
- `tenGiam(g, tenHang)`: nhận dòng giảm (`{ loai, ma }`) — KHÔNG giữ dạng chuỗi cũ (chỗ gọi duy nhất `GioHang.jsx:29`; bài cũ phải sửa vì chữ đổi — C2). `voucher` → `nd('giam.voucherMa', { ma })`
  "Voucher {ma}"; `voucher_ship` → `nd('giam.ship')` "Giảm phí giao"; `ma_giam` → `nd('giam.voucher')` đổi `macDinh` thành **"Mã khuyến mãi"** (giữ khoá, không thêm khoá thừa). ~4 dòng.
- Đơn thẻ: `KHONG_MA` không có `vouchers` → không gửi (không đổi `ThanhToan.jsx:43`). Giỏ nạp (NAP-1) cũng đi `KHONG_MA` → không gửi.

## Phần B — ba chỗ

### Trạng thái chọn (B4) — A: ở App, B: ở từng màn
- A (**chọn**): `App.jsx` thêm MỘT state `chonVc` (`{ boTay: [], chonTay: [] }`) cạnh `maGiam`; `viVc = dungKho(cuaVoucher.kho)`; `vouchers = useMemo(dsGui(...))` TÍNH MỘT LẦN
  ở App rồi truyền CÙNG mảng cho `GioHang` và `ThanhToan` (đột biến "Thanh toán gửi mảng khác Giỏ" bị bắt bằng so thân `POST /don` với thân báo giá cuối của Giỏ).
  Xoá `chonVc` ở `docLaiGio` + `donPhien` (cùng chỗ `datMaGiam('')`). `daTra` / `daHuy` thêm `cuaVoucher` vào `lamMoi`. ~12 dòng.
  Thêm (xin duyệt — 1 chữ): `xongDatDon` cũng `lamMoi` `cuaVoucher` — đơn QR chờ trả GIỮ voucher (hợp đồng v15 "Giữ voucher khi chờ chuyển khoản"), ví phải bớt nó ngay,
  không đợi tiền về; không làm thì Giỏ vẫn hiện voucher đang bị giữ tới lần làm mới ngầm. Chỉ THÊM vào mảng `lamMoi`, không đổi luật đặt đơn.
- B: mỗi màn tự `dungCua(cuaVoucher)` + `dsGui` — hai chỗ tính, dễ lệch. Loại.
- "Dùng ngay" (`dungVoucher(v)` truyền xuống UuDai): voucher ví → `datChonVc(chamVoucher(chon, ma, false))` rồi `di('/giohang')`; `ma_khach_moi` → `datMaGiam(code)` rồi `di('/giohang')`.

### B1 Ví voucher — `UuDai.jsx` (CHỈ `TheVoucher`, `DanhSachVoucher`, chuyền prop `dungVoucher` qua `UuDai → UuDaiToi → VoucherConDung/TatCa`)
- `TheVoucher` thêm nhánh `moTa` (có `mo_ta` POS): tên = `mo_ta` nguyên văn (`data-nd="ud.khach"`… khoá `pos`), dòng `vc-dong` = chip nguồn (`ud.vc.nguon.<nguon>`; nguồn lạ → không
  chip) + `vc-ma` nét đứt; KHÔNG `moTaGiam`. Thiếu `mo_ta` → nhánh cũ nguyên. ~15 dòng.
- Nút: `available` (hoặc danh sách không `all`) không ship → `<button className="use">` "Dùng ngay" (`ud.vc.dungNgay`); ship → lớp `vc-ship` (mờ) + nhãn `vc-sap`
  "Dùng khi đặt giao hàng" (`ud.vc.ship`), không nút; `?all=1` `used`/`expired`/`disabled` → nhãn (thêm `ud.voucher.chuaDung` "Chưa dùng được"), không nút.
- `ma_khach_moi`: hiện như cũ + "Dùng ngay" (điền ô mã). ~25 dòng tổng B1.

### B2 `NhanMa.jsx`
- `r.data.mo_ta` có → `nd('nm.daThemVi', { moTa })` "Đã thêm vào ví voucher: {moTa}" (khoá mới; `nm.daNhanMoi` giữ cho POS cũ). Lỗi: đường `e.message` có sẵn — không đổi,
  chỉ thêm ca thử. `khiXong` đã `lamMoi(cuaVoucher)` (`UuDai.jsx:218`). ~2 dòng.

### B3 Giỏ hàng — `GioHang.jsx`
- A (**chọn**): hàm `VoucherGio({ vi, bg, chon, cham })` trong chính `GioHang.jsx` (~40 dòng) đặt giữa các món và ô mã; tiêu đề `vc-dau` "Voucher của bạn" + phải
  "Tự chọn sẵn · chạm để bỏ"; mỗi voucher một `<button className="vc-chon …">` (`aria-pressed`): tích CHỈ khi `trangThaiVoucher === 'dung'` (`'cho'` = không tích, không câu —
  mã bị cắt ở 10 / POS không báo thì không bao giờ hiện tích giả). Lúc báo giá mới đang về (`dungBaoGia` trả `bg` null mỗi lần giỏ / mảng đổi) Giỏ vẽ tích / lỗi theo
  báo giá CUỐI đã về (`useRef`, 2 dòng) để không nhấp nháy tích ↔ đỏ; số tiền vẫn chỉ từ báo giá mới (BangTien như cũ); `{ loi }` mà khách chưa bỏ → không tích + `vc-loi` = `error` POS; khách bỏ tay → không tích, không câu; ship → `vc-chon vc-tat`,
  `disabled`, "Dùng khi đặt giao hàng". Chạm → `cham(ma, dangTich)`. Ẩn khi chưa đăng nhập / ví đang tải / ví trống (chỉ đếm `data[]`).
  Trên ô mã: `vc-dau` "Mã khuyến mãi" + "1 mã / đơn"; gợi ý ô mã dùng khoá MỚI `gio.ma.goiYKm` "Nhập mã khuyến mãi (nếu có)" trong `donHang.js` (khoá cũ `gio.ma.goiY` ở `menu.js:72` — ngoài Phạm vi, không sửa; chỉ thôi dùng ở GioHang). `BangTien`: `tenGiam(g, …)` (truyền cả dòng).
  `dungBaoGia(gio, { maGiam, vouchers }, …)`.
- B: tệp component mới `src/components/VoucherGio.jsx` — ngoài Phạm vi. Loại.

### B5 Thanh toán đồ uống — `ThanhToan.jsx`
- `tuy = cheDoThe ? KHONG_MA : { maGiam, vouchers }` (prop mới `vouchers` từ App). Ngay dưới `BangTien`: `!cheDoThe && bg && bg.voucherLoi.length` → khối `vc-chua`
  "Voucher chưa dùng được" (`tt.vc.chua`) + từng dòng "{ma}: {error}" (không chạm). Lỗi đặt đơn `VOUCHER_DANG_GIU`… → `xuLyLoi` mặc định đã `datThongBao(e.message)` — không đổi. ~6 dòng.

### B6 Danh mục + CSS
- Khoá mới (dự kiến): `taiKhoan.js` — `ud.vc.dungNgay`, `ud.vc.ship`, `ud.vc.nguon.doi_diem`, `ud.vc.nguon.khach_moi`, `ud.vc.nguon.gioi_thieu`, `ud.voucher.chuaDung`, `nm.daThemVi`;
  `ud.vc.moTa` (khoá `pos`, "POS › Voucher"). `donHang.js` — `giam.voucherMa`, `giam.ship`, `gio.vc.tieuDe`, `gio.vc.phai`, `gio.vc.ship`, `gio.vc.loi` (khoá `pos`),
  `gio.ma.tieuDe`, `gio.ma.mot`, `gio.ma.goiYKm`, `tt.vc.chua`. Đổi `macDinh`: `giam.voucher`. Kiểm bằng `kiemDanhMuc` (bài chung) + C1.
- `src/giaoDien/voucher.css` (MỚI, ~35 dòng): lớp `vc-dong vc-chip vc-ma vc-ship vc-sap vc-dau vc-chon vc-o vc-loi vc-tat vc-chua`, theo CẤU TRÚC `mau_de_xuat.js`; màu thay bằng màu
  demo gần nhất (bảng demo có `#B23D6B #7A2647 #FFF0F4 #F7E7EC #C62828 #2F6B3A #F3EEE9 #FFFFFF`… — mỗi màu thay ghi `trang_thai.md`); K9 + C1 tĩnh chặn.
  Mẫu sửa `.voucher .body{gap}` / `.voucher .t` (lớp demo) → KHÔNG sửa lớp demo trong css mới; viết qua lớp con `vc-` (`.vc-than`) cho đúng luật "mọi lớp tiền tố `vc-`".
- `src/kiemKhop/canTuPos.js`: KHÔNG đổi (dòng `voucher` `:17` đã có cửa; bớt việc).
- `src/dinhDang.js`, `src/duLieuKhach.js`: dự kiến KHÔNG đổi.

## Ngân sách
App ~210 dòng (voucherGio 45 · datDon 8 · UuDai 25 · NhanMa 2 · GioHang 45 · ThanhToan 6 · App 14 · danh mục ~30 · css 35) — trong ngân sách 220. Thử ~400 dòng.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHVC2.js`, POS giả theo khuôn `dungMay` của `thu_KHMUA1b.js`; POS giả xét `vouchers` THEO THỨ TỰ: tối đa 3, một %, `min_order`, ship → `VOUCHER_SHIP_CAN_GIAO`)
| Nghiệm thu | Ca | Phần |
|---|---|---|
| A1 | `dsGui`: bỏ ship (kieu + giam_ship), bỏ `boTay` (khác hoa thường), `chonTay` đứng đầu đúng thứ tự, hạn sớm trước, không hạn / sai dạng cuối, cùng hạn giữ thứ tự, trùng hoa thường, cắt 10, `chonTay` không còn trong ví → không gửi, ví null → `[]` | thuần |
| A1 | `trangThaiVoucher`: dung / {loi} / cho (bg null, mã không có) ; `chamVoucher` hai chiều | thuần |
| A2 | `thanBaoGia` không voucher / `vouchers: []` → JSON y hệt bản gốc (chép nguyên hàm gốc vào bài để so); có voucher → `vouchers` đúng mảng; `thanDatDon` mang `vouchers`; `KHONG_MA` không có | thuần |
| A2 | `docBaoGia` giữ `ma`, `voucherLoi`; `tenGiam` voucher / voucher_ship / ma_giam / chuỗi cũ | thuần |
| B6 | `voucher.css` 0 màu ngoài demo; mọi lớp mới tiền tố `vc-`; khoá mới có trong danh mục | tĩnh |
| B1 | Ưu đãi 390: thẻ `mo_ta` + chip nguồn + mã; nguồn lạ không chip; ship mờ không nút; `?all=1` 3 nhãn; voucher không `mo_ta` → cách cũ | Chromium |
| B1/B4 | "Dùng ngay" → `/giohang`, voucher đó tích + đứng đầu `vouchers` gửi; `ma_khach_moi` "Dùng ngay" → ô mã có mã + `ma_giam` gửi | Chromium |
| B2 | Nhận ưu đãi khách mới → "Đã thêm vào ví voucher: {mo_ta}"; lỗi `CAN_TAO_TAI_KHOAN` → lời POS | Chromium |
| B3 | Giỏ: tự tích mọi voucher POS tính; voucher `min_order` cao → không tích + câu đỏ POS; thêm món đủ tiền → tự tích; bỏ tay → đổi giỏ không tích lại, không gửi; chọn tay cái thứ 4 → đứng đầu mảng gửi, POS báo `VUOT_SO_VOUCHER` cái cuối; ship mờ không chạm; bảng tiền "Voucher VC7"; chưa đăng nhập / ví trống → không mục voucher | Chromium |
| B5 | Thanh toán: thân `POST /don` có ĐÚNG `vouchers` của báo giá đang hiện (= báo giá cuối của Giỏ); khối "Voucher chưa dùng được"; lỗi `VOUCHER_DANG_GIU` → lời POS | Chromium |
| A2/K5 | Giỏ không voucher → thân báo giá + `POST /don` y như gốc (không `vouchers`); đơn thẻ không `vouchers` | Chromium |
| B4 | Đăng xuất / đổi khách → `chonVc` rỗng (voucher khách trước không còn trong mảng); đơn trả (`daTra`) / huỷ (`daHuy`) → POS giả đếm thêm một `GET /voucher` | Chromium |
| B1 | "Dùng ngay" khi giỏ trống → màn giỏ trống; thêm món → voucher đó tích, đứng đầu mảng; thẻ giữ lớp demo `.voucher .strip .body .t .use` | Chromium |
| B2 | lỗi `KHACH_DA_CO_TAI_KHOAN`, `UU_DAI_CHUA_CO_MAU` → lời POS nguyên văn | Chromium |
| B3 | tiêu đề "Mã khuyến mãi" + "1 mã / đơn", gợi ý "Nhập mã khuyến mãi (nếu có)"; ví đang tải (POS giả trễ `/voucher`) → không mục voucher; đang chờ báo giá mới → tích / lỗi giữ theo báo giá cuối | Chromium |
| C5 | POS giả mặc định của bài cũ KHÔNG thêm voucher (TaiKhoan.jsx `:30-32` đếm `cuaVoucher`) — chỉ `thu_KHVC2` có ví voucher | so ảnh |
| C2 | Sửa đúng ca bài cũ: `thu_KHMUA1b.js` C6 (`:87`, `:724` "Giảm giá (voucher)" → "Mã khuyến mãi", gọi `tenGiam({ loai })`), `thu_KHND3e.js:77` B1 (tenGiam), `thu_KHND3b.js:216` E1 (gợi ý ô mã "Nhập mã giảm giá" → "Nhập mã khuyến mãi (nếu có)"). Đỏ trên gốc kể cả `KHONG_TRINH_DUYET=1`. Bài khác dò bằng chạy `npm test` | thuần |
| C3 | `viec/KH-VC-2/dot_bien_tay.js` (khuôn KH-THE-3: chép src vào nháp, thay chuỗi, chạy thu_KHVC2): BV-GUI-VOUCHER-SHIP · BV-KHONG-BO-MA-BO-TAY · VS-HAN-MUON-TRUOC · VS-GUI-VOUCHERS-RONG · VS-APP-TU-GHEP-CAU (thay `mo_ta` bằng `moTaGiam`) · VS-THANH-TOAN-MANG-KHAC (ThanhToan tự `dsGui` không `chonTay`) · VS-TU-TICH-LAI-CAI-DA-BO (tích khi `dung` dù trong `boTay` — POS giả vẫn tính nếu App lỡ gửi) · VS-CHON-TAY-DUNG-CUOI · VS-CSS-MAU-NGOAI-DEMO | đột biến |
| C4/C5 | ảnh 390 trước/sau vào `so_anh/`; chạy mọi `thu_*.js` với `LUU_ANH_DIR` gốc vs nhánh, màn ngoài phạm vi không đổi | so ảnh |
| C6 | `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`), K10 không tăng | cổng |

## Đường song song phải canh
- Giỏ ↔ Thanh toán: cùng `vouchers` từ App (một `useMemo`), cùng `dungBaoGia` → khoá báo giá gồm `vouchers` → nút đặt chỉ mở khi báo giá của đúng mảng về.
- Ví voucher đổi (làm mới ngầm, nhận ưu đãi, đơn trả / huỷ / đặt) → `vouchers` đổi → Giỏ / Thanh toán hỏi lại POS (báo giá cũ bị bỏ — đúng luật `dungDatDon`).
- Gửi lại đơn chưa rõ: dùng `cu.than` đã ghi (đã chứa `vouchers`) — không dựng lại → không lệch.
- Đơn thẻ / nạp: `KHONG_MA` → không `vouchers`.
- Đổi khách / 401 / đăng xuất: `docLaiGio` / `donPhien` xoá `chonVc` cùng `maGiam`.
- KH-NAP-1 song song: không đụng tệp / hàm Cấm; `App.jsx`: thêm state + prop; sửa các dòng phiếu B4 bắt buộc (`docLaiGio :148`, `donPhien :162`, `daTra :236`, `daHuy :238`) — có thể đụng khi gộp, chat xử lý.
- Làm mới ngầm ví (`lamMoiKhiQuayLai`) khi đang ở Thanh toán: mảng đổi → báo giá cũ bị bỏ, nút đặt khoá tới khi báo giá mới về; bảng PIN đang mở mà bấm thì `guiDon` dừng êm (`ThanhToan.jsx:128`, luật có sẵn cho mọi lần đổi `tuy`) — chấp nhận, không thêm code.
- `NhanMa`: nhánh `mo_ta` đứng TRƯỚC nhánh `voucher_code` (`NhanMa.jsx:45`).

## Luồng hợp lệ KHÔNG bị chặn (K5)
- Giỏ không voucher, chưa đăng nhập, ví lỗi / đang tải → đặt đơn y như cũ (thân y hệt).
- Voucher POS báo lỗi không chặn đặt đơn (POS chỉ không tính) — nút đặt không khoá vì `voucherLoi`.
- Ô mã khuyến mãi chạy như cũ (cùng lúc với voucher).

## Soát kế hoạch (agent phụ chỉ đọc) — đã sửa theo
- `gio.ma.goiY` nằm ở `menu.js` (ngoài Phạm vi) → khoá mới; `thu_KHND3b.js:216` thêm vào C2; `'cho'` không tích (tránh tích giả) + giữ báo giá cuối khi chờ;
  bỏ dạng chuỗi của `tenGiam`; bỏ dòng `canTuPos`; thêm ca B1/B2/B3/B4 còn thiếu; ghi rõ thứ tự `chonTay`.

## Câu hỏi xin duyệt kèm kế hoạch
1. `xongDatDon` thêm `cuaVoucher` vào `lamMoi` (ngoài chữ phiếu B4 — lý do ở trên). Không duyệt → bỏ.
2. Đổi `macDinh` của khoá có sẵn `giam.voucher` → "Mã khuyến mãi" (cùng tệp `donHang.js`); gợi ý ô mã là khoá MỚI `gio.ma.goiYKm` vì khoá cũ ở `menu.js` ngoài Phạm vi.
3. `chonTay` = mới chạm đứng ĐẦU (đọc A1 "đúng thứ tự chạm" theo B3 "ô vừa chọn đứng ĐẦU mảng gửi").
