# KH-MUA-1b — Kế hoạch (CHỜ DUYỆT)

Đã đọc (bước 2): `phieu.md`, `hop_dong_v5.md` (đủ 205 dòng), `src/datDon.js`, `src/dungDatDon.js`, `src/api.js`, `src/noiDung/caiDat.js`,
`src/pages/ThanhToan.jsx`, `TheoDoiDon.jsx`, `ManQR.jsx`, `GioHang.jsx` (BangTien), `Don.jsx`, `TrangMon.jsx`, `src/components/PinSheet.jsx`,
`src/App.jsx` 100–200, `src/dieuHuong.js`, `src/duongDan.js`, `src/kiemKhop/canTuPos.js`, `kiem_tra_truoc_khi_giao.js` K8,
`cong_cu/thu_KHMUA1.js`, `thu_KHKHOP1.js` A2, `thu_KHNHANH1.js` 240–250, `viec/KH-MUA-1/trang_thai.md` (Q1–Q8, Phát hiện).

Hiện trạng chính (code thật):
- `datDon.js:18-26` cổng tiêm `datCongDatDon` + `goiCong`; `datDon.js:84-85` `LOI_CHUA_TAO` danh sách cứng; `thanDatDon` (`:39-43`) chỉ `qr|vi`, không
  `khoa_gui`, `tong_da_xem`; `docDatDon` (`:57-61`) đọc `trang_thai` (v5: `tien_trinh`); `thanBaoGia` (`:31-37`) còn gửi `giao` + `dia_chi`.
- `api.js:38-55` `goi`: lỗi mạng → `status 0, code MANG_LOI`; `!res.ok || !dl` → lỗi có `status` (200 mà không JSON cũng ném — "không biết"). Không có hết giờ chờ.
- `ThanhToan.jsx:37-55` `guiDon`: lỗi không thuộc `chuaTaoDon` → `nghiNgo` (khoá, xem Lịch sử) nhưng CHỈ trong bộ nhớ màn — tải lại là mất (D3 c hở).
- `App.jsx:162` `themVaoGio` → `vaoGio` → `/giohang` (trái QĐ 31.10). `App.jsx:175` QR lấy từ `donMoi.current` (bộ nhớ) — tải lại mất QR.
- Bài cũ phụ thuộc cổng tiêm: `thu_KHMUA1.js:172-178` và `thu_KHNHANH1.js:242-250` (import `datCongDatDon`, plugin ép `DAT_ONLINE = true`) → bỏ cổng
  thì hai bài này hỏng dựng gói → PHẢI sửa (Phạm vi cho `cong_cu/thu_KH*.js`).

---

## Phần A — hợp đồng + canTuPos
- A1: `cp viec/KH-MUA-1b/hop_dong_v5.md thiet_ke/HOP_DONG_API_KH.md` rồi `cmp` (ra rỗng). 0 dòng tay.
- A2 `canTuPos.js` (~6 dòng đổi): `bao_gia`, `dat_don`, `huy_don` → `co: true`; `don_tien_trinh` bỏ `moi`, `truong` thêm `don.qr`, `don.tien_ve_cho_doi_soat`;
  `menu_sp` bỏ `moi`, sửa tên trường `data[].nhu_cau[]` → `data[].nhu_cau`, `data[].the_chat[]` → `data[].the_chat` (đúng khối máy đọc v5 — không sửa thì
  phép `sai4` của A2 đỏ). `gio_vang_gia` giữ `moi` (GIOVANG-1, v5 chưa có `gia_mon`).
- A3 K8: hàm mới trong `api.js` viết thẳng `goi('POST', '/gio/bao-gia', …)`, `goi('POST', '/don', …)`, ``goi('POST', `/don/${…}/huy`)`` — K8 tự đối chiếu.
- Phương án B (bỏ hẳn các dòng `co:false` đã có) bị loại: trang `/kiemkhop` còn dùng.

## Phần B — nối cửa thật
- **A (chọn):** `api.js` +3 hàm (`baoGiaGio`, `datDonApp`, `huyDonApp`) + tham số tuỳ chọn `choMs` của `goi` (AbortController; hết giờ → cùng lỗi
  `status 0` như mất mạng = "không biết"), chỉ `datDonApp` dùng (20 giây). `datDon.js` import thẳng; XOÁ `DUONG_DAT_DON`, `cong`, `datCongDatDon`, `goiCong`.
  Giữ kiểm `DAT_ONLINE` trong `datDon.js` (một dòng, làm công tắc tắt khẩn): cờ tắt → không gọi cửa nào như hiện nay. `xemDon` dùng `layChiTietDon`. ~+8 / −15.
- B (loại): giữ cổng tiêm và tiêm `goi` từ `main.jsx` — thêm một chỗ nối, giữ code chỉ để bài thử dùng (phiếu B2: không để code chết).
- B3: `DAT_ONLINE = true` là commit RIÊNG, SAU khi bài C–G xanh (đột biến `VS-BAT-CO-TRUOC-NOI-CUA` canh thứ tự: bật cờ mà cửa chưa nối → bài đỏ).

## Phần C — thân / đọc (hàm thuần trong `datDon.js`, ~+45 / −20)
- `thanBaoGia(gio, { maGiam })`: `{ mon[] { ma, so_luong, ghi_chu? }, ma_giam?, cach_nhan: 'tai_quan' }` — `ghi_chu` rỗng thì bỏ khoá; BỎ nhánh `giao`/`dia_chi` (C1).
- `thanDatDon(gio, tuy, { cachTra, pin, khoaGui, tongDaXem })`: + `cach_tra` ∈ `qr|vi|vi_qr`, `pin` CHỈ khi `vi`/`vi_qr`, `khoa_gui`, `tong_da_xem`.
  `tongDaXem` = `bg.tong` của báo giá đang hiện (ThanhToan truyền đúng `bg.tong`, không tính).
- `taoKhoaGui()`: `crypto.randomUUID()` → không có thì 32 ký tự hex từ `crypto.getRandomValues`. Kiểm dạng `^[A-Za-z0-9-]{16,64}$`.
- `docBaoGia`: thêm `giam[].loai` giữ nguyên, `maGiamLoi { code, error } | null`. `tenGiam(loai, tenHang)`: `ma_giam` → "Giảm giá (voucher)"
  (demo dòng 2085), `hang` → "Ưu đãi hạng <tên hạng /toi>" (demo 3515, không ghi % — số từ POS), `gio_vang` → "Giờ vàng" (demo 3507), lạ → "Giảm giá".
  Có dòng `ma_giam` → nút mã ở Giỏ hiện "✓ Đã áp dụng" (demo 2020); `ma_giam_loi` → `error` dưới ô mã (C6).
- `docDatDon`: `{ ma, tong, giuVi, conLai, tienTrinh, qr { chuoi, hetHan } | null, trung }`; thiếu `ma_don` → `null` (= "không biết", D2).
- `docDon`: thêm `qr`, `thanhToan`, `tienVeChoDoiSoat`; bước đơn chỉ đọc `tien_trinh` (C5).

## Phần D — lỗi, gửi lại, chống đơn thứ hai
**Một hàm luật** `loaiLoi(e)` → `'chua_tao'` khi `400 ≤ status < 500` VÀ có `code`; còn lại (status 0 mất mạng / hết giờ, 5xx, 2xx thiếu `ma_don`,
4xx không `code`) → `'khong_biet'`. Thay `LOI_CHUA_TAO` / `chuaTaoDon` (D1). 401 có `code` → chưa tạo (api.js tự dọn phiên như mọi cửa).

**Một vòng gửi** `guiDonAnToan(than, { gui, cho })` (thuần, `gui` = `datDonApp`, `cho(ms)` tiêm được để bài thử chạy nhanh): `than` đóng băng một lần
(`Object.freeze` bản sao) — MỌI lần gửi dùng ĐÚNG đối tượng đó (cùng khoá, cùng thân, cùng PIN trong bộ nhớ của lần gọi này).
- nhận đơn (kể cả `trung: true`) → trả đơn;
- `chua_tao` → ném lỗi đó (không gửi lại);
- `khong_biet`: `DANG_XU_LY` → chờ 2 giây, gửi lại tới khi tổng ~60 giây; khác → chờ 2 giây, tối đa 3 lần gửi lại; hết lượt → ném lỗi `KHONG_BIET`.
- Khi hàm trả / ném, `than` (có PIN) ra khỏi phạm vi — không gán vào state / ref / kho (D4).

**Ghi nhớ "chưa rõ"** (D3 c, d): khoá localStorage `kh_don_gui` = `{ khoa_gui, than KHÔNG pin, luc }`; ghi NGAY TRƯỚC lần gửi đầu, xoá khi nhận đơn
hoặc `chua_tao`; giữ khi `KHONG_BIET`. Đọc / ghi bọc try/catch (kho bị chặn: chỉ còn chặn trong bộ nhớ, không vỡ). Khai trong `luuMay.js` (đăng xuất / đổi
khách xoá). Bản ghi quá 24 giờ (hết hạn nhớ khoá của POS) → bỏ, Thanh toán mời xem Lịch sử đơn. → `src/donGui.js`? KHÔNG — đặt trong `datDon.js`
(3 hàm nhỏ docGuiDo / ghiGuiDo / xoaGuiDo) để luật đặt đơn ở một chỗ.

**ThanhToan.jsx** (~+60 / −20):
- Khi mở màn: đọc `kh_don_gui` + gọi MỚI `GET /don` trang 1 (`layDon(1)`, không dùng kho chung — như số dư F1 của KH-NHANH-1).
  - Có `kh_don_gui` → khoá nút Đặt; khối "Lần đặt trước chưa rõ kết quả" + nút **"Kiểm tra lại"** (gửi lại `khoa_gui` + thân đã nhớ; `vi`/`vi_qr` mở bảng
    PIN — PIN không nhớ) + "Xem Lịch sử đơn". POS trả đơn → sang Theo dõi; trả 4xx → chắc chưa tạo, xoá bản nhớ, mở lại nút.
  - Có đơn App `tien_trinh === 'cho_tra'` → khoá Đặt; khối "Bạn có đơn #<mã> đang chờ trả" + **"Tiếp tục trả đơn <mã>"** (→ `/don/<mã>`) + **"Huỷ đơn đó"**
    (`POST /don/:ma/huy`, xong thì tải lại `GET /don`, mở nút). Đúng gợi ý D3 của phiếu.
- Bấm Đặt: `khoaGui` (đang gửi → bỏ lần bấm), sinh khoá MỚI cho mỗi lần bấm (C3), gọi `guiDonAnToan`.
- Lỗi `chua_tao`: hiện `error` POS, nút mở lại; riêng:
  - `GIA_DA_DOI` → thay bảng tiền bằng `bao_gia` POS (state `bgMoi` đè `bg` tới khi giỏ đổi), câu "Giá vừa thay đổi, mời bạn xem lại", KHÔNG tự gửi;
    lần bấm sau `tong_da_xem` = tổng mới.
  - `QUA_NHIEU_LAN` → khoá nút, đếm ngược `thu_lai_sau_giay` (đồng hồ máy chỉ đếm giây, §6).
  - `HET_HANG` / `MON_KHONG_BAN` (kèm `ma`) → đánh dấu dòng món theo `ma` (danh sách `maLoi` truyền vào khối món), chặn đặt tới khi giỏ đổi.
  - `PIN_SAI` / `PIN_DANG_KHOA` / `CHUA_CO_PIN` → ném lại cho `PinSheet` hiện nguyên lời (đã có đường này ở `PinSheet.jsx:39`); `CHUA_CO_PIN` kèm nút
    "Đặt mã PIN" mở `PinSheet` chế độ đặt (có sẵn).
  - `NGOAI_GIO` / `QUA_GIO_NHAN_DON` → khoá nút (thêm vào `chan`).
  - `CACH_KHONG_KHOP` → tải lại `/toi`; ví đủ thì chọn `vi` + câu POS.
  - `KHOA_GUI_DA_DUNG` → "Vui lòng đặt lại"; khoá mới tự có ở lần bấm sau.
- `KHONG_BIET` → giữ `kh_don_gui`, khoá nút, khối "chưa rõ" như trên + "Xem Lịch sử đơn" (D2; v5: `GET /don` có cả đơn App chưa trả).

**Cơ chế từng đường D3** (mỗi đường một ca Chromium):
| Đường | Cơ chế | Ca |
|---|---|---|
| (a) bấm nhiều lần | `khoaGui` trong tab + nút `btn-disabled` khi `dang`; nếu lọt, cùng khoá → POS `trung` | bấm 3 lần nhanh → POS giả nhận 1 lần `POST /don` |
| (b) Back từ QR rồi đặt lại | Thanh toán mở → `GET /don` mới thấy `cho_tra` → khoá, mời Tiếp tục / Huỷ | đặt QR → Back → nút Đặt khoá, có "Tiếp tục trả đơn TQD42"; POS giả 1 đơn |
| (c) lui / tải lại / mở lại khi "chưa rõ" | `kh_don_gui` trên máy → khoá + "Kiểm tra lại" cùng khoá | 5xx ×4 → tải lại → nút khoá; "Kiểm tra lại" gửi CÙNG `khoa_gui` + thân; POS giả 1 đơn |
| (d) hai tab | `kh_don_gui` chung localStorage + `GET /don` lúc mở + POS cùng khoá / lưới 10 giây | tab 1 treo `DANG_XU_LY`; tab 2 mở Thanh toán → khoá |

## Phần E — cách trả (ThanhToan, trong ~60 dòng trên)
- Hàm thuần `cachTraDuoc(tong, soDu)` → `{ vi: soDu ≥ tong, viQr: 0 < soDu < tong }` (chỉ so để BẬT lựa chọn; số thật `giu_vi` / `con_lai` từ POS sau khi đặt).
- Ba dòng `opt-row`: "Chuyển khoản QR" (BỎ "(payOS)" — E2), "Ví nội bộ" (khi đủ), "Ví + QR" (khi 0 < dư < tổng; dòng phụ "Dùng hết số dư ví, quét QR
  phần còn lại" + "còn thiếu …" như hiện nay). Không tên nhà cung cấp / số tài khoản ở đâu (`grep -ri "payos" src/` chỉ còn tên mã lỗi trong chú thích hoặc không có).

## Phần F — Theo dõi đơn (`TheoDoiDon.jsx` ~+25 / −10, `App.jsx` ~4, `Don.jsx` ~8)
- F1 `qr` lấy từ `docDon` (`GET /don/:ma`); bỏ prop `qr` từ `donMoi`. Có `qr` khi `cho_tra` → vẽ + đếm ngược theo `bayGio()` (đã có).
- F2 `vi_qr`: còn trả lời `POST /don` trong bộ nhớ (`donMoi`) và `giuVi > 0` → "Đã giữ <giu_vi> trong ví · quét QR <con_lai>"; không có (tải lại) → ẩn,
  không hiện số cạnh QR (Câu hỏi Q1).
- F3 `tienVeChoDoiSoat` → khối "Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn".
- F4 Huỷ → `huyDonApp`; lỗi `DA_TRA_GOI_QUAN` → câu POS + `tel:` khi `LIEN_HE.dienThoai` có (đã có khuôn ở `TheoDoiDon.jsx:86`).
- F5 giữ `xongDatDon` (`lamMoi([cuaToi, cuaDon, cuaDiem])`).
- F6 `LichSuDon`: thẻ có `tien_trinh` ∈ `cho_tra|da_tra|dang_lam` → `/don/<mã>` (Theo dõi); còn lại → `/taikhoan/donhang/<mã>` như cũ. Nhãn `cho_tra` "Chờ thanh toán".
  `App.jsx:185` bỏ điều kiện `DAT_ONLINE ? datLai : null` không cần đổi (cờ bật).

## Phần G — thêm món quay lại (`App.jsx` 1 dòng)
- `themVaoGio`: `doiGio(...)`; `datThongBao('Đã thêm <món> vào giỏ')`; `luiVe()` — `lui(r.cha)` của `dieuHuong.js:31` đã đúng luật: có lịch sử trong App →
  `history.back()` về đúng trang trước; mở thẳng link (`kh = 0`) → `thay('/menu')` (`cha` của `/mon/:slug` = `/menu`, `duongDan.js:14`). Không nhảy giỏ.
- G2 `datLai` vẫn `vaoGio` (không đổi).
- Phương án B (nhớ "trang trước" bằng ref riêng) bị loại: `lui` đã có, 0 dòng mới.

---

## Ngân sách
| Phần | File | Ước lượng |
|---|---|---|
| A | `thiet_ke/HOP_DONG_API_KH.md` (cp), `src/kiemKhop/canTuPos.js` | ~6 |
| B | `src/api.js`, `src/datDon.js`, `src/noiDung/caiDat.js` | ~25 |
| C–D–E | `src/datDon.js`, `src/pages/ThanhToan.jsx`, `src/pages/GioHang.jsx` (BangTien + nút mã), `src/luuMay.js` | ~190 |
| F–G | `src/pages/TheoDoiDon.jsx`, `src/pages/Don.jsx`, `src/App.jsx`, `src/dungDatDon.js` | ~45 |
| **App** | | **~265 / ngân sách 300** |
| Thử | `cong_cu/thu_KHMUA1b.js` mới | ~420 |
| Thử cũ | `thu_KHMUA1.js` (bỏ cổng tiêm, ca cũ trái v5), `thu_KHNHANH1.js` (bỏ cổng tiêm + 1 ca đọc nguồn) | ~50 |

`datDon.js` sau việc ~190 dòng, `ThanhToan.jsx` ~150 — dưới 500, không tách. Nếu `ThanhToan.jsx` vượt ~180 thì tách khối "đơn trước chưa xong" ra
`src/components/DonTruoc.jsx` (tách theo việc).

## Bài thử — `cong_cu/thu_KHMUA1b.js` (POS giả dựng TỪ khối máy đọc v5: đủ 19 cửa, mỗi mã lỗi đặt đơn)
Phần 1 hàm thuần (chạy cả khi `KHONG_TRINH_DUYET=1`, mỗi dòng = một ca, đỏ trên gốc vì hàm chưa có / sai v5):
| Nghiệm thu | Ca |
|---|---|
| A1 | `cmp` hai file hợp đồng (đọc byte, so `Buffer.equals`) |
| A2 | `canTuPos`: ba cửa đặt đơn `co:true`; không mục nào của `/don`, `/don/:ma`, `/menu` còn `moi` |
| A3 | K8 dùng lại: chạy phép K8 trên `api.js` (hàm chung đọc khối máy đọc) → 0 lệch, có đủ 3 cửa mới |
| B1/B2 | `api.js` có `goi('POST', '/gio/bao-gia'`, `'/don'`, `` `/don/${…}/huy` ``; `datDon.js` không còn `datCongDatDon`, không `fetch` |
| B3 | `DAT_ONLINE === true` |
| C1 | thân báo giá đúng khoá, `cach_nhan` luôn `tai_quan`, không `giao`/`dia_chi`, không giá |
| C2 | thân đặt: `cach_tra` 3 giá trị, `pin` chỉ `vi`/`vi_qr`, `khoa_gui`, `tong_da_xem` = số truyền vào, không trường tiền khác |
| C3 | `taoKhoaGui`: đúng dạng 16–64; 100 lần không trùng; nhánh `getRandomValues` (giả không có `randomUUID`) |
| C4 | `docDatDon` đủ 8 trường; thiếu `ma_don` → null |
| C5 | `docDon` có `qr`, `thanhToan`, `tienVeChoDoiSoat`, `tienTrinh` |
| C6 | `tenGiam` 3 loại + loại lạ; `maGiamLoi` đọc được |
| D1 | `loaiLoi`: mọi 4xx có code của v5 (bảng mã lỗi đặt đơn) → `chua_tao`; 4xx không code → `khong_biet` |
| D2 | `loaiLoi`: status 0, 500/502/503, `DANG_XU_LY` → `khong_biet`; `guiDonAnToan` với `gui` giả: 5xx×2 rồi đơn → 3 lần gửi, CÙNG một đối tượng thân (===) và cùng khoá; 5xx×4 → `KHONG_BIET` sau 4 lần; `DANG_XU_LY` gửi tới ~60 giây (đồng hồ giả); 4xx → 1 lần, ném |
| D3 | ghi / đọc / xoá `kh_don_gui` (kho giả); kho bị chặn không ném; bản ghi > 24 giờ bỏ; khoá có trong danh sách `luuMay.js` |
| D4 | bản `kh_don_gui` không có `pin`; nguồn `src/` không ghi `pin` vào `localStorage`/`sessionStorage`/`console` |
| E1 | `cachTraDuoc`: đủ / 0 < dư < tổng / 0 / thiếu số |
| E2 | `src/` không còn "payOS" trong chữ hiện ra (JSX) |
| G1 | đọc nguồn: `themVaoGio` không gọi `vaoGio` / `giohang`, gọi `luiVe` |

Phần 2 Chromium (BỎ QUA khi không Playwright / `KHONG_TRINH_DUYET=1`; ba cỡ 360 / 390 / 430 chạy SONG SONG như `thu_KHNHANH1.js`, mỗi cỡ một ngữ cảnh,
dùng `clock.runFor` để bỏ qua các lần chờ 2 giây — giữ dưới trần 120 giây):
QR thành công · ví + PIN (PIN sai rồi đúng) · `vi_qr` (dòng "Đã giữ … · quét QR …") · `trung: true` (1 đơn) · 5xx×2 rồi thành công (POS giả kiểm cùng
`khoa_gui` + cùng thân từng byte) · `DANG_XU_LY` rồi thành công · mất mạng ×4 → khoá + Lịch sử đơn · mỗi 4xx có code (vòng qua bảng mã) → không "chưa rõ",
nút mở lại, lần bấm sau khoá MỚI · `GIA_DA_DOI` → tổng mới, không tự gửi, lần sau `tong_da_xem` mới · 429 đếm ngược · `HET_HANG` đánh dấu dòng ·
`CACH_KHONG_KHOP` · D3 (a)(b)(c)(d) như bảng trên · tải lại `/don/TQD42` vẫn thấy QR + đếm ngược · huỷ đơn + `DA_TRA_GOI_QUAN` · `tien_ve_cho_doi_soat` ·
Lịch sử: thẻ `cho_tra` mở Theo dõi, thẻ `xong` mở Chi tiết · 401 giữa chừng (`POST /don` trả 401 → về Trang chủ, không "chưa rõ") · sau MỌI ca: không chuỗi
PIN `1357` trong `localStorage` / `sessionStorage` · G1 (Menu → món → Thêm → về Menu; mở thẳng `/mon/…` → Thêm → `/menu`).
Đo ở 390; 360 / 430 chạy bộ ngắn (QR thành công, ví + QR, G1) + không tràn ngang.

`SỐ CA` ghi theo `KHONG_TRINH_DUYET=1` (CLAUDE.md §9). Bài cũ:
- `thu_KHMUA1.js`: phần không trình duyệt đổi (ca D1 `giao`, D2 cờ false, B8 `chuaTaoDon`, "api.js không có cửa đặt đơn", D1 `trang_thai`) → sửa theo v5
  = bài sửa thường, đỏ trên gốc. Phần Chromium: bỏ gói tiêm, POS giả trả dạng v5, E6.1 / E6.3 đổi theo G1 / cờ bật. KHÔNG thêm ca mới (trần 120 giây).
- `thu_KHNHANH1.js`: chỉ đổi phần Chromium (bỏ gói tiêm) → THÊM 1 ca đọc nguồn đỏ trên gốc ("gói thử không tiêm cổng — `datDon.js` không còn
  `datCongDatDon`"), theo H2.
- `thu_KHKHOP1.js`: không sửa (A2 xanh nhờ `canTuPos` đúng v5) — chạy lại để chắc.

## Đột biến (`viec/KH-MUA-1b/dot_bien.py`, có đối chứng: bản gốc xanh trước khi đột biến) — 12 cái
| Chỗ vá | Đột biến |
|---|---|
| vòng gửi lại | `VS-GUI-LAI-KHOA-MOI` (mỗi lần gửi lại sinh khoá mới) · `VS-GUI-LAI-THAN-KHAC` (gửi lại dựng thân mới từ giỏ hiện tại) |
| luật lỗi | `VS-5XX-LA-CHUA-TAO` · `VS-4XX-LA-KHONG-BIET` · `BV-LUAT-4XX` (trả về danh sách cứng cũ) |
| tong_da_xem | `BV-TONG-DA-XEM` (bỏ khoá) · `VS-TONG-TU-TINH` (gửi Σ dòng giỏ thay `bg.tong`) |
| PIN | `VS-LUU-PIN` (ghi thân có PIN vào `kh_don_gui`) |
| chưa rõ | `BV-CHAN-KHI-CHUA-RO` (bỏ khoá nút khi có `kh_don_gui`) · `BV-CHAN-DON-CHO-TRA` (bỏ kiểm `cho_tra` khi mở Thanh toán) |
| GIA_DA_DOI | `BV-GIA-DA-DOI` (bỏ thay bảng tiền) |
| cờ | `VS-BAT-CO-TRUOC-NOI-CUA` (cờ true, `datDon` gọi lại hàm giả "chưa nối") |
Ca K5 (đường hợp lệ không chặn oan): đơn QR thường, ví đủ, ví + QR — đều có ở Phần 2 và đều phải XANH ở bản vá.

## Đường song song cần canh
- Báo giá ở Giỏ (`GioHang.jsx` dùng `dungBaoGia`) — đổi `docBaoGia` / `BangTien` thì Giỏ cũng đổi theo (ca: Giỏ hiện "✓ Đã áp dụng").
- "Đặt lại" (`App.jsx datLai`, G2) vẫn vào giỏ.
- `donPhien` (401 / đăng xuất) dọn `donMoi`; `kh_don_gui` dọn qua `luuMay.js` (đăng xuất, đổi khách); 401 thì GIỮ (§8) nhưng màn Thanh toán chỉ hiện khi đăng nhập.
- `PinSheet` chế độ đặt PIN (Hồ sơ) không đổi.
- `/kiemkhop` đọc `canTuPos` — ba cửa đặt đơn chuyển sang "đã có", trang không gọi POST (cuaCanGoi chỉ GET).
- `KhoaTienIch`, Menu, Trang chủ không đụng.

## Kế hoạch commit
1 hợp đồng (cp) · 2 bài thử mới + bài cũ sửa (đỏ, `bang_chung_do.txt`) · 3 api/datDon · 4 ThanhToan/GioHang · 5 TheoDoiDon/Don/App · 6 bật cờ ·
7 dot_bien.py · 8 so ảnh `viec/KH-MUA-1b/so_anh/` + `doi_chieu_demo.md` (Thanh toán 3 cách trả, khối đơn trước, Theo dõi `vi_qr`) · 9 trang_thai.

---

## Soát kế hoạch (agent phụ chỉ đọc, 4 câu) — đã nhận và sửa kế hoạch như sau
1. **Ngoài Phạm vi:** không.
2. **Ngắn hơn — nhận cả ba:**
   - (a) A3 không chép lại K8 vào bài mới: K8 đã chạy trong `npm test`. Bài mới chỉ kiểm `api.js` có đủ 3 cửa.
   - (b) Mỗi mã 4xx của D1 thử bằng hàm thuần `loaiLoi`. Chromium chỉ giữ ca đại diện có hành vi riêng (danh sách ở mục 3) — nhẹ trần 120 giây.
   - (c) `kh_don_gui` chỉ còn `docGuiDo()` / `ghiGuiDo(banGhi | null)`. Ghi `null` là xoá.
3. **Ca còn thiếu — thêm vào Phần 2 (Chromium, ở 390):**
   - D1:
     - `MON_KHONG_BAN` đánh dấu dòng.
     - `PIN_DANG_KHOA` hiện lời POS trong bảng PIN.
     - `CHUA_CO_PIN` có nút "Đặt mã PIN".
     - `NGOAI_GIO` / `QUA_GIO_NHAN_DON` → nút KHOÁ. Ca vòng chung chỉ áp cho mã "sửa rồi bấm lại".
     - `KHOA_GUI_DA_DUNG` → "Vui lòng đặt lại", lần sau khoá mới.
   - D2:
     - Hết giờ chờ: POS giả không trả lời quá `choMs`, bài thử dùng `choMs` nhỏ qua đồng hồ giả → gửi lại cùng khoá.
     - 200 thiếu `ma_don` qua `guiDonAnToan` (hàm thuần) và trên màn.
   - D3(d): POS giả đếm `POST /don` — cả hai tab cộng lại chỉ 1 đơn.
   - C6, trên màn Giỏ:
     - `ma_giam_loi` → `error` dưới ô mã;
     - có dòng `ma_giam` → nút "✓ Đã áp dụng";
     - dòng `hang` / `gio_vang` / loại lạ đúng tên.
   - F4: `DA_TRA_GOI_QUAN` có `tel:` khi `LIEN_HE.dienThoai` có (gói thử đè `lienHe.js`), không có thì không hiện.
   - F5: sau khi đặt, POS giả thấy gọi lại `/toi`, `/don`, `/diem`.
   - F6: thẻ `cho_tra` / `da_tra` / `dang_lam` → `/don/<mã>`; `xong` / `da_huy` / bill quầy (`tien_trinh` null) → `/taikhoan/donhang/<mã>`.
   - G1: thêm món từ Trang chủ (gợi ý món) → về `/trangchu`; từ kết quả trắc nghiệm → về `/tracnghiem/ketqua`.
   - G2: giữ ca "Đặt lại" ở `thu_KHMUA1.js`, ghi rõ không xoá.
   - H4: là thử tay của chủ quán. Ghi 3 bước vào `trang_thai.md` mục "Chủ quán thử tay"; máy không kiểm được (ghi ở CHƯA KIỂM).
4. **Đường song song bị sót — thêm vào phần sửa:**
   - **Giỏ không được dọn.** `App.jsx:166` `daTra` chỉ dọn giỏ khi `donMoi.current` còn, nên tải lại thì giỏ không dọn.
     - Sửa: nhớ mã đơn vừa đặt trong `kh_don_gui` (bản ghi đổi thành `{ khoa_gui, than, luc, ma_don? }` sau khi có đơn).
     - `daTra` so với bản ghi này; khớp thì dọn giỏ, mã giảm và bản ghi.
     - Vẫn không PIN. Ca: đặt QR → tải lại `/don/TQD42` → POS giả chuyển `da_tra` → giỏ rỗng.
   - **Hỏi nhanh 3 giây.** `TheoDoiDon.jsx:52` lấy cờ hỏi nhanh từ `!!qr`. Đổi sang lấy theo `don.tienTrinh === 'cho_tra'`.
   - **Lịch sử đơn không làm mới.** Huỷ ở Theo dõi đơn và nút "Huỷ đơn đó" ở Thanh toán → `lamMoi([cuaDon, cuaToi])`, vì ví được nhả.
     Ca: huỷ xong mở Lịch sử, thẻ hiện "Đã huỷ".
   - **Nhãn thẻ đơn App.** `Don.jsx:13-14` `NhanDon` cũng đọc `tien_trinh`. Đơn App có `trang_thai` / `thanh_toan` = `null`.
     - `cho_tra` → "Chờ thanh toán", `da_huy` → "Đã hủy", `da_tra` / `dang_lam` / `xong` → "Đã thanh toán".
     - Lớp CSS có sẵn của demo (`order-status`).
   - **Thanh toán không vẽ dòng món.** `HET_HANG` / `MON_KHONG_BAN` → Thanh toán hiện câu POS + tên món (tra `ma` trong menu) và nút "Về giỏ hàng".
     Giỏ đánh dấu dòng theo `ma` qua prop `maLoi` (App giữ state; dọn khi giỏ đổi). `GioHang.jsx` đã có chỗ `canhBao` trên dòng.
   - **`CHUA_MO`.** Giữ (cờ còn là công tắc); `dungDatDon.js:21` không đổi.
   - **Chú thích cũ.** Sửa chú thích nhắc cổng tiêm ở `caiDat.js:2-3`, `datDon.js:1-4`, `ThanhToan.jsx:17-20`.

Ngân sách sau soát: app ~295 / 300 (thêm ~30 cho 4 đường song song); thử ~460 / 450 (Chromium bớt nhờ 2b, thêm ca mục 3). Vượt thì báo trong trạng thái.

## Vòng sửa 4 (phiếu, chat soát cuối 03.11 — chỉ S1, S2, S3)
- **S1 — 401 khi đặt đơn = chưa rõ.**
  - A (chọn, 2 dòng app): `datDon.loaiLoi` thêm `e.status !== 401` (401 không còn "chắc chưa tạo"); `guiDonAnToan` gặp 401 → ném `KHONG_BIET` NGAY
    (không tự gửi lại — token đã xoá, gửi lại vô ích). `ThanhToan` nhánh `KHONG_BIET` sẵn có đã GIỮ bản ghi → không phải sửa màn.
    Đăng nhập lại cùng khách → màn hiện "Lần đặt trước chưa rõ" (luật chặn sẵn có). Đổi khách / đăng xuất vẫn xoá (`luuMay`, `App.dangXuat`).
  - B: loại lỗi mới `'het_phien'` + nhánh riêng ở `ThanhToan` — nhiều dòng hơn, cùng kết quả. Bỏ.
  - Ca: hàm thuần `loaiLoi(401)`, `guiDonAnToan` [mất mạng, 401] → 2 lần gửi + KHONG_BIET, [401] → 1 lần + KHONG_BIET; Chromium `401` (gửi đầu 401 →
    bản ghi giữ, đăng nhập lại thấy "chưa rõ"), `401-gui-lai` (lần 1 tạo rồi 502, lần 2 401 → giữ; đăng nhập lại "Gửi lại" → trung, MỘT đơn).
  - Đột biến: VS-401-CHUA-TAO, VS-401-TU-GUI-LAI, BV-401-XOA-BAN-GHI.
- **S2 — gửi lại + sai PIN.** A (chọn, 1 dòng): nhánh `MA_PIN` của `ThanhToan.guiDon` xoá bản ghi CHỈ khi đơn mới (`!cu`); gửi lại giữ bản ghi → nhập lại
  PIN qua `conChuaRo` gửi ĐÚNG khoá + thân cũ. B: đọc lại bản ghi trong PinSheet — ngoài chỗ, bỏ.
  Ca Chromium `gui-lai-pin-sai`. Đột biến VS-PIN-GUI-LAI-XOA.
- **S3 — gỡ A11 `thu_KHUI3b.js`.** Thêm ca A1 đọc nguồn: ba cửa đặt đơn `api.js` gọi (`POST /gio/bao-gia`, `POST /don`, `POST /don/:ma/huy`) có dòng
  `| … | có |` trong `thiet_ke/HOP_DONG_API_KH.md`. Gốc cổng `fb65795^` (v3, api.js chưa gọi) → đỏ.
- K5 (không chặn oan): mọi ca cũ giữ xanh (đơn QR / ví / ví + QR / "Gửi lại" thành công); sai PIN ở ĐƠN MỚI vẫn xoá bản ghi như cũ (ca `pin_dang_khoa`).
- Đường song song đã canh: 401 ở lần đầu / lần tự gửi lại / nút "Gửi lại đúng đơn này" (cùng `guiDonAnToan`); sai PIN ở đơn mới / gửi lại.
