# Thư POS → App KH · 16.11.2026 (chiều) · Trả lời thư 16.11 — hợp đồng ĐÃ HẸN cho Đổi điểm (DOI-DIEM-1) · thứ tự voucher · "bộ voucher có lợi nhất"

<!-- Chat POS bàn 38 viết. Chủ quán gửi cho chat App KH. Phần hợp đồng dưới đây POS sẽ chép vào mục "Đã hẹn" của HOP_DONG_API_KH.md ở lần ghi sổ tới
     (PHIEN_BAN giữ 17 — "Đã hẹn" chưa phải cửa đang chạy), và thành v18 khi DOI-DIEM-1 gộp. Đổi gì trước lúc đó POS báo bằng thư. -->

## Tóm tắt (đọc 30 giây)
- **Thứ tự voucher:** POS GIỮ cách xét hiện nay — lần lượt theo thứ tự mảng `vouchers`, tối đa `voucher_toi_da`, một voucher %. Không có kế hoạch đổi; đổi thì báo
  trước bằng thư.
- **Đổi điểm:** dưới đây là hợp đồng đã hẹn (3 cửa) để App dựng thiết kế + làm KH-DOI-1 song song. POS làm DOI-DIEM-1 theo lịch (sau khai trương).
- **"Chọn bộ voucher có lợi nhất":** POS nhận đề nghị, xếp vào VOUCHER-3 (sau khai trương). Tên trường dưới mục 3 là tạm.

## 1. Hợp đồng đã hẹn — Đổi điểm (DOI-DIEM-1)
Nguyên tắc: NÂNG CẤP cái đang có (kho quà `pos_reward_catalog` + đổi ở quầy `/loyalty/redeem`), một hàm đổi dùng chung App + quầy. Quà có 2 loại:
**`voucher`** (đổi xong → voucher vào ví, như hôm nay quầy đổi giúp) và **`hien_vat`** (đổi xong → phiếu quà có QR, nhận tại quầy).

### `GET /kho-qua` — không bắt token (chung trần lượt / IP với `/menu`); CÓ token thì thêm phần riêng của khách
`data[] { ma, ten, loai, diem_can, anh, mo_ta, han_ngay, con, gioi_han_thang, thu_tu }` — chỉ quà đang bật, xếp theo `thu_tu`.
- `ma` số nguyên; `loai` = `voucher` | `hien_vat`; `diem_can` số nguyên > 0; `anh` URL ảnh | `null`; `mo_ta` câu khách thấy — App hiện nguyên.
- `han_ngay`: số ngày phiếu / voucher còn hạn kể từ lúc đổi.
- `con`: `true` | `false` (quà hiện vật hết tồn → `false`; voucher luôn `true`). Hết thì vẫn hiện, App làm mờ.
- `gioi_han_thang`: số lần tối đa mỗi khách / tháng | `null` (không giới hạn).
- Có token hợp lệ (như `/menu`): mỗi dòng thêm `con_luot_thang` (số lần khách còn đổi được tháng này | `null`) và `du_diem` (`true` | `false`). Không token → không có
  hai trường này.

### `POST /doi-diem` — có token
Thân `{ ma_qua, khoa_gui, pin }`.
- `khoa_gui`: như `POST /don` (chuỗi App tự sinh mỗi lần bấm). Cùng `khoa_gui` + cùng `ma_qua` trong 24 giờ → trả ĐÚNG kết quả lần đầu, không trừ điểm lần hai.
  Cùng khoá mà khác quà → 400 `KHOA_GUI_SAI`.
- `pin`: PIN 4 số của chính khách (đề xuất POS — theo luật 22.10 "đổi điểm hỏi PIN khách"; chủ quán xác nhận lúc duyệt DOI-DIEM-1). Sai / khoá → cùng mã và luật
  của trả bằng ví: `PIN_SAI` 400, `PIN_DANG_KHOA` 423, `CHUA_CO_PIN` 400.
- Trả 200: `{ loai, diem_con, voucher_code | null, phieu | null }` — quà `voucher` → `voucher_code` (voucher đã vào `GET /voucher` với `nguon: "doi_diem"`), `phieu` null;
  quà `hien_vat` → `phieu` (dạng như một dòng `GET /qua-cua-toi`), `voucher_code` null.
- Lỗi (đều chưa trừ gì): `QUA_KHONG_CO` 404 (không có / đang tắt) · `QUA_HET` 409 (hết tồn) · `THIEU_DIEM` 409 · `QUA_HET_LUOT_THANG` 409 · `KHOA_GUI_SAI` 400 ·
  `QUA_NHIEU_LAN` 429 · mã PIN như trên. App hiện nguyên `error`.

### `GET /qua-cua-toi` — có token
`data[] { ma, ten, anh, qr, trang_thai, het_han, nhac, doi_luc, dung_luc, diem, hoan_diem }` — CHỈ phiếu quà hiện vật, mới trước. (Voucher đổi điểm nằm ở
`GET /voucher`, `nguon: "doi_diem"` — không lặp ở đây.)
- `ma`: mã phiếu (chữ in hoa + số); `qr`: chuỗi để App vẽ (như `/toi.khach.qr`) — quầy quét (QUET-1) hoặc tra SĐT để trao.
- `trang_thai`: `chua_dung` · `da_dung` (quầy đã trao) · `het_han` (quá hạn chưa nhận).
- `nhac`: `true` khi `chua_dung` và còn ≤ 3 ngày tới `het_han` (App hiện nhắc; POS tính theo giờ VN, App không tự so đồng hồ máy).
- `diem`: số điểm đã đổi; `hoan_diem`: số điểm đã hoàn khi hết hạn chưa nhận | `null` (mặc định hoàn — Cài đặt quán đổi được).

### `GET /diem` (đã có) — dòng mới
- Đổi quà: `type: "redeem"`, `points` âm, `reason: "Đổi quà: <tên quà>"` (đúng dòng quầy đang ghi hôm nay).
- Hoàn điểm phiếu hết hạn: `type: "hoan_qua"`, `points` dương, `reason: "Hoàn điểm: <tên quà> hết hạn chưa nhận"`.
- Trường của `history[]` không đổi.

## 2. Ghi nhận việc App
- KH-NAP-1 (App), KH-VC-2: POS đã đọc, không cần thêm gì. "Tự chọn sẵn mọi voucher" + thứ tự gửi: POS xét đúng thứ tự mảng như App đọc.
- KH-DOI-1 mở được khi chủ quán gửi thư này; hợp đồng chính thức (v18) chốt lúc DOI-DIEM-1 gộp.

## 3. Đề nghị "bộ voucher có lợi nhất" — VOUCHER-3, sau khai trương (tên tạm)
`POST /gio/bao-gia` nhận `tu_chon_voucher: true` + `bo_voucher: [mã]` → POS thử tổ hợp voucher trong ví (đúng luật: tối đa N, một %, tiền trước % sau, nhóm / món,
tối thiểu) → trả thêm `vouchers_da_chon: [mã]`; App gửi lại đúng mảng đó ở `POST /don`. Có thư khi làm.
