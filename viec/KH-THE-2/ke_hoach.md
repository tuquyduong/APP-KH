# KH-THE-2 — Kế hoạch (CHỜ DUYỆT)

Nguồn: phiếu, bản thiết kế 14.11 (`ban_thiet_ke.html`, đã chụp Chromium), QĐ 14.11, code đã đọc (dẫn dòng ở dưới). Hợp đồng `/api/kh` v13 không đổi.

## 0. Hai việc cần chủ quán / chat trả lời khi duyệt

**Q1 — `src/dangKySW.js` ngoài Phạm vi (1 dòng).** Màn Thanh toán thẻ ở đường dẫn phiếu chốt `/uudai/hang/thanhtoan`, nhưng danh sách "màn KHÔNG tự tải lại" là
regex theo đường dẫn ở `src/dangKySW.js:8` (`KHONG_AN_TOAN = /^\/(giohang|thanhtoan|don\/.+|…)$/`) — không khớp đường mới → App có thể tự lên bản mới khi khách đang ở
Thanh toán thẻ (QĐ 08.11: "KHÔNG BAO GIỜ tự tải lại ở … Thanh toán"). Đề nghị: thêm `src/dangKySW.js` vào Phạm vi để thêm `uudai\/hang\/thanhtoan` vào regex (+ 1 ca ở
`thu_KHTHE2.js` gọi `coTheTaiLai('/uudai/hang/thanhtoan')` → false, đỏ trên gốc). Không cho thì: khi bị tải lại, màn dựng lại đúng từ đường dẫn + `kh_don_gui` (không mất
đơn, không gửi hai lần) — chỉ là khách thấy màn chớp; ghi `## Phát hiện`.

**Q2 — Đầu màn "Chào mừng hội viên".** Bản thiết kế Màn 4 KHÔNG có thanh đầu (nút ‹ + "Đơn …"). Đề nghị: GIỮ `DauManCon` như mọi màn Theo dõi đơn (nút quay lại, số đơn đã
có trên thẻ vàng nên đầu màn chỉ để điều hướng) — hay bỏ cho giống bản thiết kế? Máy làm theo đề nghị (giữ) nếu không có trả lời khác.

## 1. Các phần — phương án A / B, chọn

### P1. Thẻ ra khỏi giỏ (A1, A2)
- **A (chọn)**: `gio.js` — `sach()` trả null cho dòng `loai:'the'` (bản lưu cũ có thẻ → bỏ dòng, không báo); xoá `themThe`, nhánh thẻ của `sachGio` / `chenDong` / `demMon` /
  `boDongDaGui` (bỏ `if (laThe(m)) …` — dòng thẻ không còn trong giỏ, vòng `findIndex(d.ma === m.ma)` tự bỏ qua dòng thẻ không có `ma`). GIỮ `laThe`, `trangThaiDong` nhánh thẻ,
  `coDoUong` (dùng cho `chanDatGio` của đơn thẻ — `datDon.js:235`). `GioHang.jsx`: xoá `DongThe`, khối "Trả thẻ trước", prop `traTheTruoc`, `tenDongThe` / `coMenu` nhánh thẻ.
  `datDon.js`: xoá `phanGui`, `thamThanhToanLai` (thay bằng P4). `duongDan.js`: bỏ `tv: { chi: ['the'] }` của `/thanhtoan`. Danh mục `menu.js`: xoá `gio.the.*`,
  `gio.truocThe.*`, `hien.gio.truocThe`. Ước ~ −70 dòng, +3.
- B: giữ dòng thẻ trong `sach` nhưng lọc ở `docGio` — thêm một bước, code thẻ cũ thành chết → loại.
- Rủi ro: đơn đồ uống đổi hành vi. Canh: MUA-1 / 1b / 1c, BAO-1, TT-1, SOHD-1, HD-1, NHANH-1 chạy KHÔNG sửa ca (F5).

### P2. Hàm thuần mới (`src/giaHang.js`, `src/datDon.js`, `src/gio.js`)
- `giaHang.js` (~35 dòng):
  - `MOC_TIET_KIEM = 1000000` (hằng có tên, MỘT chỗ) · `tietKiemMotTrieu(h)` = `Math.floor(MOC_TIET_KIEM * phan_tram / 100)`; thiếu / sai `phan_tram` → null (ẩn ô, không "0đ" bịa);
    cột Thường hiện chữ danh mục "0đ".
  - `giaCot(h)` → `{ k, bien }`: chỉ cấp → `tier.cmp.quanTang`; không gói → `tier.cmp.chuaBan`; gói rẻ nhất 1 tháng → `tier.cmp.giaThang {gia}`; N tháng → `tier.cmp.giaNThang {gia, so}`.
  - `coDacBiet(ds)` — có hạng nào `phan_tram_nhom_dac_biet > 0`.
  - `tinhTrangHang(hangKhach, ds)` → khoá + biến cho dòng phụ B1 (giá thường / hạng bán + hết hạn / quán tặng [+ không thời hạn]).
  - `trangThaiTheUuDai(ds, hangKhach, bayGio)` → `{ kieu: 'chua'|'co'|'sap'|'tang', hang, soNgay }` (E2); `null` khi `chua` mà không hạng nào bán được. Đếm ngày dùng
    CHÍNH `soNgayCon` + `NGAY_NHAC_GIA_HAN` (`giaHang.js:72,99`). `hangKhach` = `/toi.khach.hang` (có `het_han`, `phan_tram`); null = chưa có / hết hạn (POS chỉ trả hạng còn hạn).
  - Xoá: `lopHang` (thẻ xám bỏ), `dongGoi` (Ưu đãi không còn liệt kê gói — chỉ còn bài thử dùng), `tenDongThe` GIỮ (đơn chưa rõ ở Thanh toán vẫn hiện tên dòng thẻ) nhưng
    đổi khoá sang `the.tt.ten` / `the.tt.chung` ở `theHang.js` (bỏ `gio.the.*`).
- `gio.js` (~6 dòng): `dongTheTuDuongDan({ h, thang })` → `{ loai:'the', hang_id, so_thang }` khi cả hai là số nguyên dương (chuỗi chỉ chữ số), sai → null. Còn bán hay không:
  `trangThaiDong(dong, null, dsHang).conBan` (đã có).
- `datDon.js` (~8 dòng): `cachTraDon(gio, dungVi, duoc)` — giỏ có dòng thẻ → `'qr'`; đơn đồ uống → luật cũ (`ThanhToan.jsx:89` chuyển vào đây NGUYÊN văn). Phòng thủ ở
  CHỖ dựng thân (một chỗ cho mọi đường): `thanBaoGia` KHÔNG gắn `ma_giam` khi giỏ có thẻ; `thanDatDon` ép `cach_tra:'qr'` + không `pin` khi giỏ có thẻ. `thamTaoMaMoi(g)` →
  `{ trang:'thanhtoanthe', tham:{ h, thang } }` cho bản ghi đơn CHỈ thẻ, `{ trang:'thanhtoan', tham:{} }` cho đơn khác (thay `thamThanhToanLai`).
- B: để luật cách trả trong màn (như nay) — bài thử không nạp thẳng được, F4 "gửi `vi` cho thẻ" chỉ bắt được qua Chromium → loại.

### P3. Thanh toán thẻ (C1–C5) — `duongDan.js`, `App.jsx`, `ThanhToan.jsx`, `thanh_toan.css`
- **A (chọn — đúng "phương án đơn giản nhất" của phiếu)**: dòng mới trong `BANG`:
  `{ trang:'thanhtoanthe', mau:'/uudai/hang/thanhtoan', tab:'uudai', canDN:true, tieuDe:'tieuDe.thanhtoan', cha:'/uudai/hang', tv:{ h:null, thang:null }, chaTv:['h'] }`;
  `ra()` thêm 1 dòng: `chaTv` → cha giữ `?h=` (Back / mở thẳng về `/uudai/hang?h=<id>`). Dùng lại khoá `tieuDe.thanhtoan` (khoá tên tab ở `khungChung.js` — ngoài Phạm vi,
  không thêm khoá mới).
- `App.jsx`: `muaThe(h, g)` = chưa đăng nhập → `moDangNhap(r.chuan)` (như cũ); đã đăng nhập → `di(taoDuongDan('thanhtoanthe', { h: h.id, thang: g.so_thang }))`. Vẽ
  `<ThanhToan the={dongTheTuDuongDan(r.tham)} …>` khi `trang === 'thanhtoanthe'` (key theo `h|thang`); bỏ `traTheTruoc`, `chiThe`, `themThe`; `veThanhToan` của Theo dõi đơn =
  `thamTaoMaMoi(banGhiCuaDon(ma))`; prop `soMonGio = demMon(gio)` cho D1. Không đụng phần quảng cáo / `<TienIch>`.
- `ThanhToan.jsx` (+~45 / −15): prop `the` (dòng thẻ | null | undefined). `the !== undefined` = chế độ thẻ:
  - giỏ của màn = `the ? [the] : []`, `tuy = { maGiam: '' }`; KHÔNG đọc / ghi `kh_gio` (prop `gio` không dùng); tham số sai (`the === null`) hoặc `dsHang` đã có mà
    `!trangThaiDong(...).conBan` → khối "không còn bán" + nút "Về Hạng thành viên"; `coThe` false nên `dungBaoGia(…, false)` không hỏi, nút đặt khoá — không báo giá, không đặt.
  - `cachTra = cachTraDon(gio, dungVi, duoc)` → luôn `'qr'`; công tắc ví KHÔNG vẽ (điều kiện `!cheDoThe && soDu !== 0`), không `datDungVi` → `kh_dung_vi` không bị ghi; PIN không mở
    (`xacNhan` đi nhánh qr).
  - Bố cục C4: bỏ "Hình thức nhận hàng" + thẻ quầy; dòng phụ đầu màn `the.tt.phu` ("Thẻ hội viên"); thẻ tóm tắt (`.pc-mini` của demo dùng lại khuôn `TheHoiVien` thu nhỏ — chỉ
    phần hình thẻ) + "Thẻ hội viên <hạng>" + "N tháng" + `bg.tong` của POS (chưa có báo giá → không số); dòng `the.tt.kichHoat` với `{phanTram}` của `/hang`; "Cách trả tiền"
    một lựa chọn QR (khuôn `.mode-opt.active` của demo, không bấm được) + dòng khoá `the.tt.khongVi` (Ico `lock` của demo); `BangTien`; nút `the.tt.nut` "Quét QR · {tong}".
  - Mọi phần chung GIỮ NGUYÊN và dùng chung: khoá gửi, `tong_da_xem`, `kh_don_gui`, chưa rõ / gửi lại đúng đơn, đơn khác vừa đặt, đơn chờ trả, trần lượt, C7 `maXong`.
  - C5: `laLoiThe(e)` → `datMonLoi(true)` + `thongBao` nguyên văn (bỏ `danhDauMon({ the })` — không còn dòng thẻ trong giỏ); nút phụ `the.tt.veHang` thay `tt.veGio`. Mã lạ 4xx →
    `xuLyLoi` mặc định hiện `e.message` (đã có — `loaiLoi` 4xx có code = `chua_tao`, `datDon.js:191`).
- B: màn `ThanhToanThe.jsx` riêng gọi chung hàm `datDon.js` → trùng ~120 dòng điều phối khoá gửi / chưa rõ / đơn chờ (phiếu cấm "đường đặt đơn thứ hai") → loại.
- Rủi ro: nhánh `cheDoThe` rò sang đơn đồ uống. Canh: bài cũ Thanh toán xanh không sửa ca + đối chứng F3 (đơn đồ uống cùng `kh_dung_vi` bật, số dư đủ → VẪN `vi`).

### P4. "Chào mừng hội viên" (D1, D2) — `TheoDoiDon.jsx`, `BieuTuong.jsx`, `the_hang.css`
- **A (chọn)**: `theXong` (đã có, `TheoDoiDon.jsx:96`) → thay khối "Đã lên hạng" bằng `ChaoMung` (~30 dòng trong cùng tệp): huy chương (`MedVe` mới ở `BieuTuong.jsx` — chép
  NGUYÊN `<symbol id="m-medal-gold">` / `m-medal-plat` của demo dòng 1859; gradient `gSv` không có trong `index.html` → nhúng `<defs>` chép từ demo, id riêng), "Chào mừng hội
  viên {hang}!", "Giảm {phanTram}% …", thẻ vàng dập (`.points-card` của demo: logo + nhãn, tên hạng, `hanMoiThe(don)` nguyên văn, `soDon` + `don.tong`), nút chính "Đặt đồ uống
  ngay" → Menu, nút phụ "Về giỏ · {so} món" chỉ khi `soMonGio > 0`, dòng nhỏ dưới nút. `theXong` ẩn: số đơn ra quầy, `CacBuoc`, hoá đơn / danh sách món, `td.giuApp`.
  Đang chờ trả: giữ khung QR; "Tạo mã mới" → `thamTaoMaMoi` (P2). Hạng / % lấy từ dòng thẻ của bản ghi `kh_don_gui` tra `/hang` (`hangCuaDon` đổi trả cả bản ghi hạng, không chỉ
  tên — 1 dòng); không biết hạng → câu chung `the.cm.chung`, ẩn %.
- D2 đã có: `daTra` → `lamMoi([cuaToi])` + `menu.taiLai(true)` (`App.jsx:215`) — chỉ thêm ca thử.
- B: đường dẫn / màn mới `/uudai/hang/xong` — thêm một nơi dựng lại trạng thái đơn → loại (phiếu: "không màn / đường dẫn mới").

### P5. Hạng thành viên (B1–B5) — `HangThanhVien.jsx` (viết lại), `the_hang.css`
- **A (chọn)**: một tệp ~110 dòng (nay 104): `DauManCon … canTrai` + dòng phụ `tinhTrangHang` (đọc `/toi` qua `dungCua(cuaToi)` chỉ khi `daBiet`, như `TheToi` hiện nay);
  bảng So sánh nhanh = lưới CSS (cột nhãn + cột Thường + mỗi hạng một `<button role="radio" aria-checked>` ≥ 44 px chứa 4 ô); > 3 hạng → khung riêng `overflow-x:auto`;
  "Đang chọn" nhãn nổi; huy chương `MedVe`; gói + nút chính + dòng QR; khối "<hạng> còn có"; ghi chú cuối. XOÁ `TheToi`, tab, `ti-how`, bảng `ti-cmp` cũ và CSS của chúng.
  Chọn hạng chạm cột → `doiHang` (`thay`, đã có).
- B: tách `TheHangSoSanh.jsx` (bảng) — 2 tệp, thêm import / props, không ngắn hơn → để khi tệp > ~150 dòng.
- Màu (K9): bản thiết kế dùng vài màu ngoài demo (nền cột Kim Cương xanh nhạt, viền vàng cột chọn, xanh lá "kích hoạt ngay", nhãn đỏ "Còn N ngày") → màu demo gần nhất cùng vai trò
  (vd `#FFF1DC` / `#C38C40` của `.ti-buy button.on`; `l2` `#2C3E5E → #5B7FB8`; xanh `#2F6B3A` của `.ti-buy em`; đỏ cảnh báo của `.nt-state`). Bảng đối chiếu ở `doi_chieu_demo.md`.

### P6. Thẻ hội viên ở Ưu đãi (E1, E2) — `src/components/TheHangUuDai.jsx` (mới, khớp `TheHang*.jsx`), `UuDai.jsx`
- **A (chọn)**: thành phần ~70 dòng vẽ 4 kiểu theo `trangThaiTheUuDai`; `UuDai.jsx` bỏ `TheHang` cũ (~40 dòng) và đặt thẻ MỘT chỗ đầu màn (sau `topbar`), cả khi chưa đăng nhập.
  Thứ tự sau đó giữ: Giờ vàng · Chương trình đặc biệt · (đăng nhập) điểm/ví · nhập mã · voucher · lịch sử / (chưa) lời mời. Bản thiết kế không vẽ banner Giờ vàng; đặt thẻ TRÊN
  banner (phiếu: "lên ĐẦU tab"). Đăng nhập mà `/toi` chưa về → chưa vẽ thẻ (như nay, tránh chớp "Chưa có thẻ").
  KHÔNG thanh tiến độ (lý do (a) — POS chưa trả ngày bắt đầu gói).
- B: giữ trong `UuDai.jsx` — tệp 223 dòng sẽ lên ~260, khó canh nguồn → loại.

### P7. Danh mục (F1)
- `theHang.js`: thêm khoá Hạng thành viên (dòng phụ 3 kiểu, so sánh 4 hàng + chữ ô, "Chọn gói", nút Mua ngay / Gia hạn, dòng QR, "còn có", dòng cố định, ghi chú cuối),
  Thanh toán thẻ (`the.tt.*`), Chào mừng (`the.cm.*`), `hien.tier.cmp|goi|ben|note`, `hien.the.cm`; khoá `tier.tutinh` đổi lời (tiết kiệm 1 triệu + gói). Xoá: `tier.hienTai`,
  `tier.thuong`, `tier.moiMua`, `tier.conHan`, `tier.how`, `tier.hoac`, `tier.ben.*`, `tier.buynote`, `tier.daThem`, `tier.daDoi`, `tier.cmp.gia|giaThuong|giam|cach|macDinh|muaThe`,
  `hien.tier.card`.
- `taiKhoan.js`: thêm `ud.the.*` (4 trạng thái, chip, nút) + `hien.ud.the`; khoá `ud.the.pos` / `ud.the.tutinh`; xoá `ud.hang.bang|dong|goi|nutCo|nutMua|pct|db|ten|hetHan`
  (giữ `ud.hang.tang` / `khongHan` nếu còn dùng ở Hạng thành viên — quyết khi viết, danh sách chính xác ghi `trang_thai.md`).
- `donHang.js`: xoá `td.the.xong|xongChung|veGio`; `td.the.han` giữ (hạn mới trên thẻ chúc mừng); `tt.the` giữ.
- `menu.js`: xoá `gio.the.*`, `gio.truocThe.*`, `hien.gio.truocThe`. Không sửa `nd/index.js`.

## 2. Ngân sách
| Phần | + | − |
|---|---|---|
| P1 giỏ | 3 | 70 |
| P2 hàm thuần | 50 | 20 |
| P3 Thanh toán thẻ + đường dẫn + App | 70 | 20 |
| P4 Chào mừng + MedVe | 50 | 10 |
| P5 Hạng thành viên + CSS | 130 | 110 |
| P6 thẻ Ưu đãi | 75 | 40 |
| P7 danh mục | 70 | 35 |
| **App** | **~450** | **~305** |
| Bài thử (`thu_KHTHE2.js` mới + sửa `thu_KHTHE1/KHHANG2/KHND3c`) | ~420 | ~60 |
Trong ngân sách phiếu (~450 thêm). K10: tệp mới 0 chữ cứng; tệp cũ chỉ giảm (`ha_no_chu.js`).

## 3. Ca thử ↔ nghiệm thu (`cong_cu/thu_KHTHE2.js`; [T] = phần nạp thẳng, chạy cả `KHONG_TRINH_DUYET=1`; [C] = Chromium 390, POS giả dựng từ hợp đồng v13)
| Mục | Ca |
|---|---|
| A1 | [T] `docGio` bản cũ `[ly, thẻ]` → `[ly]`; `ghiGio([ly, thẻ])` không lưu thẻ; `gio.js` không còn `themThe`; `datDon.js` không còn `phanGui` / `thamThanhToanLai`; `docDuongDan('/thanhtoan?chi=the').tham` không có `chi`; nguồn `GioHang.jsx` không còn `DongThe` / `traTheTruoc` · [C] giỏ lưu cũ có thẻ → Giỏ chỉ hiện ly, không nút "Trả thẻ trước" |
| A2 | bài cũ đơn đồ uống xanh không sửa ca (MUA-1/1b/1c, BAO-1, TT-1, SOHD-1, HD-1, NHANH-1, PWA-1) · [T] `cachTraDon([ly], true, {vi:true})` = `vi` (đối chứng) · `monDatLai` vẫn bỏ dòng thẻ |
| B1 | [T] `tinhTrangHang`: null / hạng bán + hạn / chỉ cấp + `het_han` null / chỉ cấp có hạn · [C] đầu màn căn trái, không `.ti-card` / `.ti-tabs` / `.ti-how` / `.ti-cmp` |
| B2 | [T] `tietKiemMotTrieu` 0 / 3 / 10 / 0,1 / thiếu → null; làm tròn xuống; `giaCot` 1 tháng / N tháng / chỉ cấp / không gói; `coDacBiet` false → ẩn hàng · [C] cột theo thứ tự POS, `role=radio`, chạm → `?h=` (thay, `history.length` không tăng), cột chọn có nhãn "Đang chọn", Thường không bấm được, 360 px 3 hạng không cuộn ngang trang, 5 hạng → khung cuộn riêng |
| B3 | [C] nút "Mua ngay · Vàng 3 tháng" + giá; khách Vàng → "Gia hạn"; Kim Cương → nút mờ + lý do; 390×844 nút nằm trong khung nhìn (`boundingBox().y + h ≤ 844`) không cuộn |
| B4 | [C] khối "còn có" có dòng cố định + `quyen_loi[]`; ghi chú cuối đúng câu mới; không còn chữ "2 ly/tuần" |
| B5 | [C] chưa đăng nhập → `/dangnhap?tiep=…/uudai/hang…`; đã đăng nhập → `/uudai/hang/thanhtoan?h=2&thang=3`; `kh_gio` không đổi, không thông báo "Đã thêm" |
| C1 | [T] `docDuongDan('/uudai/hang/thanhtoan?h=2&thang=3')` → trang, canDN, tab `uudai`, cha `/uudai/hang?h=2`; `h=abc` / thiếu `thang` / `thang=0` → `dongTheTuDuongDan` null · [C] gói không còn bán → lời "không còn bán" + nút về, POS giả KHÔNG nhận `/gio/bao-gia` / `/don` |
| C2 | [T] `thanDatDon([thẻ], {maGiam:'X'}, {cachTra:'vi', pin:'1234'})` → `mon` đúng 3 khoá, không `ma_giam`, `cach_tra:'qr'`, không `pin`; `thanBaoGia` không `ma_giam` · [C] thân POS giả nhận đúng như vậy, `kh_don_gui` ghi; chưa rõ → "Gửi lại đúng đơn này" gửi CÙNG khoá |
| C3 | [T] `cachTraDon([thẻ], true, {vi:true,viQr:false})` = `qr`; đối chứng đồ uống = `vi` · [C] `kh_dung_vi='1'` + số dư đủ: không `.the-vi`, thân `cach_tra:'qr'`, không bảng PIN, `kh_dung_vi` vẫn `'1'` sau khi trả |
| C4 | [C] không `.mode-row` / `.the-quay`; có thẻ tóm tắt, dòng kích hoạt có `%`, lựa chọn QR, dòng khoá, `BangTien`, nút "Quét QR · 295.000đ" |
| C5 | [C] POS giả trả `GOI_HANG_KHONG_BAN` → hiện nguyên `error`, nút khoá, nút "Về Hạng thành viên"; mã lạ 400 `THE_KHONG_TRA_VI` → hiện nguyên lời, không vào "chưa rõ" |
| D1 | [T] `thamTaoMaMoi` bản ghi chỉ thẻ → `thanhtoanthe {h, thang}`; bản ghi đồ uống → `thanhtoan {}` · [C] chờ trả có QR; POS giả chuyển `xong` → "Chào mừng hội viên Vàng!", hạn POS nguyên văn, số đơn, tổng; không `.the-buoc` / `.pick-num`; "Đặt đồ uống ngay" → `/menu`; "Về giỏ · 2 món" chỉ khi giỏ còn ly |
| D2 | [C] sau xong, POS giả `/toi` trả hạng Vàng → Ưu đãi hiện "Hạng của bạn · Vàng"; Menu giá hạng (giá trong `gia_hang`) |
| E1 | [C] thẻ là khối đầu của `#rewards` (trước `.rw-ban`, `.ct-khoi`, `.wallet-row`) — cả chưa đăng nhập |
| E2 | [T] `trangThaiTheUuDai`: chưa hạng → chua (hạng bán đầu tiên); không hạng bán → null; 8 ngày → co; 7 → sap; 0 → sap; chỉ cấp `het_han` null / có → tang · [C] 4 trạng thái, mỗi thẻ đúng 1 nút, đúng đích |
| F1 | `kiemDanhMuc` (bài chung) xanh; [T] mọi khoá mới có trong danh mục, khoá đã xoá không còn trong danh mục và `src/` |
| F2 | K9 (bộ kiểm tĩnh) xanh; `doi_chieu_demo.md` có bảng màu |
| F3 | toàn bộ trên |
| F4 | `dot_bien_tay.js` ≥ 8: VS-vi-the (gửi vi khi công tắc nhớ bật) · VS-cong-tac (hiện công tắc ví ở chế độ thẻ) · VS-ma-giam (gửi ma_giam với thẻ) · BV-gio (Mua ngay → themMon/gio có thẻ) · BV-con-ban (bỏ kiểm còn bán) · VS-tiet-kiem (×10 / ceil) · VS-sap-8 (`<=` → `<= 8`) · VS-ghi-dung-vi (ghi đè `kh_dung_vi`) — mỗi cái đỏ |
| F5 | `thu_KHTHE1.js`: ca themThe / chenDong thẻ / phanGui / thamThanhToanLai / lopHang / Giỏ thẻ / "Trả thẻ trước" / `tenDongThe` khoá cũ → sửa sang hành vi mới (đỏ trên gốc); `thu_KHHANG2.js` A1/A2 dongGoi + nguồn `TheHang` → sửa theo `TheHangUuDai`; `thu_KHND3c.js` B1 dongGoi → bỏ dongGoi khỏi ca |
| F6 | ảnh 360/390/430 → `so_anh/`; Giỏ / Thanh toán đồ uống trước ↔ sau |
| F7 | `npm test`, `--day-du`, cổng `tinh` + `chay` |

## 4. Đường song song phải canh
- `ThanhToan.jsx` chung hai chế độ: `kh_don_gui` (chưa rõ của đơn đồ uống chặn mua thẻ và ngược lại — MỘT luật, đúng ý "không hai đơn"), `kh_dung_vi` (chế độ thẻ không đọc
  để quyết, không ghi), đơn chờ trả (đồ uống chờ trả → mời tiếp tục / huỷ trước khi mua thẻ, như nay).
- `daTra` / C7 (`App.jsx:215–219`): đơn thẻ trả xong → `boDongDaGui(gio, [thẻ])` không động giỏ, không bỏ mã giảm đang gõ (bản ghi thẻ không có `ma_giam`); làm mới `/toi` + menu.
- Theo dõi đơn mở từ Lịch sử đơn / dải báo đơn xong cho đơn thẻ: `theXong` dựa `laDonChiThe(don)` của POS (không cần bản ghi); hạng tra từ bản ghi, máy khác → câu chung.
- Trang chủ nhắc gia hạn, Menu thẻ thu nhỏ → `moHang` (không đổi).
- `/dangnhap?tiep=/uudai/hang/thanhtoan?h=..&thang=..` → `tiepHopLe` giữ tham số (ca C1).
- Tự lên bản mới (`dangKySW.js`) — Q1.
- Hạng của khách không còn trong `/hang` (đã tắt mà còn hạn): Ưu đãi vẫn "Hạng của bạn" từ `/toi`; Hạng thành viên chọn hạng bán đầu tiên.

## 5. K5 — luồng hợp lệ không bị chặn
Đơn đồ uống trả ví / ví+QR / QR như cũ (đối chứng); mua thẻ ngoài giờ mở cửa vẫn được (`chanDatGio` giỏ chỉ thẻ); khách Vàng gia hạn Vàng được; khách chưa hạng mua hạng cao
nhất bán được; khách vãng lai xem Hạng thành viên + bảng + giá không cần đăng nhập.

## 6. Đột biến (`dot_bien.py` VS-/BV- cho cổng A17/A18 + `dot_bien_tay.js` cho F4) — bảng "chỗ vá → đột biến" ghi `trang_thai.md` khi làm.

## 7. Sửa sau khi agent phụ soát (chỉ đọc, 14.11) — các mục này THẮNG chỗ khác ở trên
- **Bỏ chặn kép ở `thanBaoGia` / `thanDatDon`** (P2): luật cách trả chỉ ở MỘT hàm `cachTraDon`; `ma_giam` không gửi vì chế độ thẻ dùng `tuy = { maGiam: '' }`. Hàm dựng thân giữ nguyên
  (đơn đồ uống không đổi). F4 VS-vi-the / VS-ma-giam vẫn bắt qua ca [T] `cachTraDon` + ca [C] thân POS giả nhận.
- **Gộp `tinhTrangHang` vào `trangThaiTheUuDai`** (P2): MỘT hàm phân loại tình trạng khách; dòng phụ B1 đọc `kieu` của nó (chua → "giá thường", co / sap → "<hạng> · hết hạn …",
  tang → "<hạng> · quán tặng [· không thời hạn]").
- **Thẻ Ưu đãi viết lại NGAY TRONG `UuDai.jsx`** (P6 — bỏ `TheHangUuDai.jsx`): thay `TheHang` cũ (`UuDai.jsx:142-179`), vẫn gọi `trangThaiTheUuDai(hangCoGiam(dsHang), …)` —
  giữ ca nguồn NHANH-1 G1 (`thu_KHNHANH1.js:222` tìm `hangCoGiam(dsHang)` trong `UuDai.jsx`) xanh, không sửa ca.
- **`monLoi.the`** (`GioHang.jsx:125`, `App.jsx:125` chú thích) → xoá phần thẻ cùng `DongThe`.
- **Bài cũ dính khoá / hàm bị xoá** (F5) — sửa đúng ca, liệt kê ở `trang_thai.md`: `thu_KHTHE1.js` (themThe, chenDong thẻ, phanGui, thamThanhToanLai, lopHang, tenDongThe,
  Chromium Giỏ thẻ / Trả thẻ trước); `thu_KHHANG2.js` A1 (nguồn TheHang: `ud.hang.nutCo|nutMua|khongHan|tang`, dongGoi) + A2 (dongGoi); `thu_KHND3c.js` dòng 50–51, 82
  (bảng khoá `ud.hang.goi|db|dong`), 179–185 (dongGoi), 362 (Chromium đặt `ud.hang.ten|hetHan`) → chuyển sang khoá `ud.the.*`; `thu_KHND3b.js:27` chỉ chú thích (sửa chữ,
  không đổi số). Ca sửa ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`: thu_KHTHE1 "docGio bỏ dòng thẻ" (gốc giữ thẻ → đỏ) + "không còn themThe/phanGui" (gốc còn → đỏ).
  Q1 được duyệt → thêm ca vào `thu_KHTHE2.js` (không sửa `thu_KHPWA1.js`).
- **Ca bổ sung** (thiếu ở bảng §3):
  - A2: [C] Menu nhóm "Thẻ thành viên" + thẻ thu nhỏ → `/uudai/hang?h=`.
  - B1: [C] đúng ba chữ dòng phụ (vãng lai / Vàng có hạn / Kim Cương quán tặng không thời hạn).
  - B2: [C] cột hạng bán có lớp l1 + `m-medal-gold`, chỉ cấp l2 + `m-medal-plat`.
  - C1: [T] `tiepHopLe('/uudai/hang/thanhtoan?h=2&thang=3')` giữ cả hai tham số; [C] tải lại đúng màn; Back khi mở thẳng → `/uudai/hang?h=2`.
  - C4: [C] màn không có chữ "hạn tới" / ngày tính ra (chỉ số tháng + giá POS).
  - D1: [C] đơn cũ thẻ + đồ uống `xong` → các bước + số đơn như đơn thường; không biết hạng (không bản ghi) → câu chung, không %.
  - D2: [C] sau trả: Trang chủ thẻ hạng + dòng phụ Hạng thành viên đổi sang Vàng (ngoài Ưu đãi, Menu).
  - E2: [T] hạng hết hạn (`/toi.hang` null) → chua; 0 ngày → chữ "Hết hạn hôm nay"; 1–7 → "Còn N ngày".
  - F7: dòng `HEAD ĐÃ KIỂM: <SHA>` ở cuối `trang_thai.md` sau lần kiểm cuối.
