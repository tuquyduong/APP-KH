# KH-DOI-1 — kế hoạch (máy, 27.11.2026)

Thiết kế đã duyệt (câu 1a 2a 3a 4a) — không chờ duyệt kế hoạch. Hợp đồng: `thiet_ke/trao_doi/TRA_LOI_POS_16112026_DOIDIEM.md` mục 1.

## Phần 1 — Gọi POS (`src/api.js`)
- A: `layKhoQua = () => goi('GET', '/kho-qua')` (token nếu có — KHÔNG vào `CUA_CONG_KHAI`) + danh sách nhỏ `CUA_401_GIU_PHIEN = ['/kho-qua']`: 401 ở cửa này KHÔNG xoá token,
  KHÔNG gọi `khiHetPhien` — lý do: cửa không bắt token (hợp đồng), màn Kho quà là `canDN` và cùng lúc đọc `/diem`: phiên hết thật thì `/diem` đẩy ra đăng nhập theo đường
  chung (một lối thoát phiên duy nhất); `/kho-qua` lỗi thì màn chỉ báo lỗi + Thử lại. `layQuaCuaToi = () => goi('GET', '/qua-cua-toi')`,
  `doiDiemApp = (than) => goi('POST', '/doi-diem', than, MS_CHO_DAT_DON)` (cùng giờ chờ như `/don` → hết giờ = "chưa rõ").
  ~6 dòng. B: thêm tham số `giuPhien` cho `goi` → đổi chữ ký hàm dùng ở ~30 chỗ: nhiều dòng hơn, bỏ.
- Gửi an toàn: DÙNG LẠI `guiDonAnToan` của `src/datDon.js`, thêm MỘT tuỳ chọn `doc` (mặc định `docDatDon`) — cùng vòng tự gửi lại CÙNG đối tượng thân
  (khoa_gui + pin trong bộ nhớ), cùng luật `loaiLoi`. ~2 dòng. B: viết vòng gửi lại riêng (~25 dòng, hai luật lỗi) — bỏ.
  Chặn bấm đúp: `khoaGui(f)` sẵn có của datDon + `dang` của PinSheet.

## Phần 2 — Đọc dữ liệu (`src/doiQua.js` mới, hàm thuần ~70 dòng)
- `docKhoQua(dl, diem)` → mảng quà ĐÚNG thứ tự POS (không sort): bỏ dòng hỏng (ma không nguyên, tên rỗng, loai lạ, diem_can không nguyên > 0);
  `anh` chỉ nhận `https://…` (khác → null → huy hiệu theo loai); `con !== true` → hết; `con_luot_thang === 0` → hết lượt; `du_diem` boolean thì theo POS,
  thiếu → so `diem_can` với điểm `/diem` (điểm chưa biết → chưa đủ); `nut` = het › luot › thieu › doi; `thieu` = diem_can − điểm (≥ 0; điểm chưa biết → null).
- `conLaiSauDoi(diem, diemCan)` → số chỉ HIỂN THỊ (null khi điểm chưa biết / thiếu — không âm).
- `docQuaCuaToi(dl)` → { cho, xong } giữ thứ tự POS; `nhac` chỉ khi `chua_dung` và `nhac === true` (App không so đồng hồ).
- `docKetQuaDoi(r)` → { loai, diemCon, voucherCode, phieu } hoặc null (thiếu `diem_con` nguyên / voucher thiếu mã / hiện vật thiếu phiếu đọc được
  → null → `guiDonAnToan` coi như "chưa rõ", tự gửi lại CÙNG khoá — POS trả đúng kết quả cũ, không trừ hai lần).

## Phần 3 — Kho dữ liệu khách (`src/duLieuKhach.js`)
- `cuaQuaToi = taoCua(layQuaCuaToi)` — KHÔNG vào `CUA_KHACH` (mảng đó làm mới ngầm mỗi 5 phút → sẽ gọi `/qua-cua-toi` khi công tắc tắt); `xoaKhoKhach` xoá cả nó.
  Chỉ màn Kho quà / Quà của tôi / Phiếu quà đọc (các màn này chỉ mở khi công tắc bật). Đổi xong: `lamMoi([cuaDiem, cuaVoucher, cuaQuaToi])`.

## Phần 4 — Màn (~230 dòng JSX + ~60 CSS + ~60 danh mục)
- Công tắc `hien.dq` (battat, macDinh false). App.jsx: công tắc tắt mà mở thẳng /uudai/doi-qua, /uudai/qua, /uudai/qua/<ma> → thay về /uudai (không vẽ màn → không gọi POS).
- `duongDan.js`: `doiqua` /uudai/doi-qua (cha /uudai) · `quatoi` /uudai/qua (cha /uudai/doi-qua) · `phieuqua` /uudai/qua/:ma (cha /uudai/qua) — canDN, tab uudai.
- UuDai.jsx (B1): công tắc bật → ô Điểm thêm lớp `dq-o` + bấm cả ô + nút nhỏ "Đổi quà ›" (khuôn `vt-vi-mo` / `vt-nap`: nút anh em, không lồng). Tắt → đúng markup cũ.
- DoiQua.jsx (B2–B4): hero điểm · ô Quà của tôi (số `chua_dung`) · dải nhắc (phiếu `nhac` đầu tiên: tên + hạn) · thẻ quà · ghi chú cuối ·
  PinSheet chế độ `gui` + khối tóm tắt (`tren`) · màn "Đã đổi quà!" (state trong màn, số `diem_con` POS) · hiện vật → `thay` sang Phiếu quà.
  Lỗi: PinSheet hiện NGUYÊN `error`; `CHUA_CO_PIN` → đóng bảng, hiện lời + nút "Đặt mã PIN" (khuôn Thanh toán); "chưa rõ" → lời riêng, giữ khoá cho lần Xác nhận sau.
- PinSheet.jsx: thêm 2 prop tuỳ chọn `khoaTieuDe` (khoá chữ tiêu đề) + `tren` (khối thay dòng nhỏ) — không đổi hành vi cũ.
- QuaCuaToi.jsx (B6), PhieuQua.jsx (B5 — dùng `VeQR` + giữ màn sáng: export `dungGiuManSang` của ManQR.jsx).
- index.html: chép NGUYÊN 3 `<symbol>` m-gift / m-coffee / m-bag (sym.txt).
- `src/giaoDien/doi_qua.css` (Ý + CSS của mau_de_xuat.js, lớp `dq-`, màu chỉ biến demo).
- `src/noiDung/nd/doiQua.js` + 1 dòng ở `nd/index.js`; chữ POS = mục khoá `pos` "POS › Cài đặt › Kho quà"; điểm / số = mục khoá `pos`.
- `src/kiemKhop/canTuPos.js`: dòng `doi_diem` (chưa chốt tên cửa, P3b) → 3 dòng `GET /kho-qua`, `POST /doi-diem`, `GET /qua-cua-toi` (co: false, viec_pos DOI-DIEM-1, sau_kt).

Ước lượng: app ~420 dòng (ngân sách 380; vượt < 1,5 lần), thử ~450.

## Ca thử ↔ Nghiệm thu (cong_cu/thu_KHDOI1.js)
| Mục | Ca |
|---|---|
| A1 | đọc nguồn api.js: 3 hàm, '/kho-qua' KHÔNG trong CUA_CONG_KHAI, có trong CUA_401_GIU_PHIEN; trình duyệt: /kho-qua có Authorization; /kho-qua 401 → vẫn ở màn, token còn |
| A1 khoá gửi | trình duyệt: MỘT POST /doi-diem có khoa_gui + pin; mạng hỏng lần 1 → lần 2 CÙNG khoa_gui + thân; bấm đúp → một POST; PIN không ở localStorage/sessionStorage |
| A2 | hàm thuần 3 hàm: đủ / thiếu / sai kiểu; nút 4 tình huống; du_diem thiếu → so điểm; thứ tự POS giữ; còn lại không âm |
| A3 | trình duyệt: đổi xong gọi lại /diem, /voucher, /qua-cua-toi; Ví voucher thấy voucher mới |
| A4 | canTuPos có 3 cửa co: false, viec_pos DOI-DIEM-1 |
| B1 | tắt: không nút, ô không bấm (không role/onclick), KHÔNG gọi /kho-qua /qua-cua-toi; bật: nút + bấm ô → /uudai/doi-qua |
| B2 | 5 kiểu thẻ (đổi / thiếu N / tạm hết mờ / hết lượt mờ / chip hiện vật), ảnh POS hoặc huy hiệu, mo_ta nguyên văn, số chờ nhận, dải nhắc, rỗng |
| B3 | PinSheet tiêu đề + tóm tắt (Trừ / Còn lại); PIN_SAI → lời POS, nhập lại; THIEU_DIEM → lời POS; CHUA_CO_PIN → nút đặt PIN |
| B4 | "Đã đổi quà!" diem_con POS (POS giả trả số KHÁC điểm − diem_can), mã voucher, 2 nút |
| B5 | hiện vật → /uudai/qua/<ma>, QR svg, mã phiếu, hạn |
| B6 | 3 trạng thái + nhắc chữ hồng + hoàn điểm; rỗng |
| B7 | đọc nguồn UuDai: lịch sử điểm vẫn hiện `h.reason` (khoá) |
| B8 | kiemDanhMuc; hien.dq battat false; mọi data-nd trên màn có trong danh mục; bản /admin đổi chữ → màn đổi |
| C1 | 360/390/430 không tràn ngang |
| C3 | dot_bien_tay.js ≥ 8 |

Đường song song cần canh: Ưu đãi khi tắt (markup không đổi — ảnh so gốc), Thanh toán dùng `guiDonAnToan` (mặc định `doc` không đổi — thu_KHMUA1b/c, KHNAP1 vẫn xanh),
PinSheet ở HoSo / Thanh toán (prop mới tuỳ chọn), đăng xuất xoá kho `cuaQuaToi`, Chế độ sửa chặn POST /doi-diem (đã có ở `goiThat`).
K5 — luồng hợp lệ không bị chặn: khách đủ điểm đổi được ngay; khách vãng lai vẫn xem Ưu đãi như cũ; 401 ở cửa khác vẫn đẩy ra đăng nhập.

## Sau soát kế hoạch (agent phụ, 27.11) — điều chỉnh
- 401 ở `/kho-qua`: màn Kho quà luôn gọi MỚI `/diem` khi mở (`cuaDiem.lay()` — cần điểm mới để tính "Còn lại" / "Cần thêm") → phiên hết thật thì `/diem` đẩy ra
  đăng nhập theo đường chung, kể cả khi kho `/diem` còn mới dưới 5 phút (agent chỉ ra lý do cũ hở chỗ này).
- `guiDonAnToan`: DoiQua truyền `gui: doiDiemApp` trần (KHÔNG qua `canMo` / `DAT_ONLINE` — công tắc đặt đơn không chặn oan đổi quà).
- "Chưa rõ" (`KHONG_BIET`): DoiQua hiện lời riêng `dq.chuaRo`; lần Xác nhận sau dùng LẠI `khoa_gui` + `ma_qua` cũ, chỉ PIN nhập lại (như Thanh toán gửi lại
  `{ ...cu.than, pin }`). 401 → api đã đẩy ra đăng nhập. PIN_SAI sau một lần chưa rõ → vẫn "chưa rõ" (luật chung của guiDonAnToan, chủ quán 05.11) — chấp nhận.
- Chế độ sửa (/admin): công tắc `hien.dq` đọc qua `ndHien` → lớp nháp bật được để xem / sửa các màn mới trước khi "Cập nhật toàn bộ".
- Ô Điểm: đúng khuôn ô ví (`div` bấm được + nút nhỏ anh em dùng `stopPropagation`), không lồng nút trong nút.
- PinSheet: chỉ thêm `khoaTieuDe` + `tren`, mặc định giữ nguyên — bài thử cũ HoSo / Thanh toán (thu_KHMUA1*, thu_KHNAP1) phải xanh.
- Ca thêm: vòng chờ khi gửi, QUA_HET, mục khoá `dq.pos`.
