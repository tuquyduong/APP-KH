# Hợp đồng cổng `/api/kh` — POS ↔ App KH

> **BẢN CHÉP Ở KHO APP KH.** Bản gốc: `HOP_DONG_API_KH.md` ở gốc kho POS (`pos-tuquyduong/pos-tuquyduong`, main). Bản này chép theo
> `thiet_ke/trao_doi/TRA_LOI_POS_28102026.md` (POS báo đã đặt v1 kèm 2 chỗ sửa) khi bản gốc chưa lên main; chat App KH thay bằng NGUYÊN VĂN
> bản gốc ở script kế tiếp. Máy KHÔNG sửa file này; lệch với bản gốc → bản gốc thắng.

PHIEN_BAN: 1
NGAY: 2026-10-28
DOC_TU_CODE: POS main b1f8299 (server/routes/kh/index.js, loi.js, middleware/khachAuth.js, utils/pinKhach.js, utils/maKhach.js, routes/wallets.js loiGhi)

<!-- Nguồn DUY NHẤT về cổng /api/kh. Chủ: POS. Đổi cổng → đổi file này cùng PR, tăng PHIEN_BAN, ghi nhật ký (luật L2).
     Khối HOP_DONG_MAY_DOC là phần máy đọc: bài thử hợp đồng của POS và bộ kiểm của App KH cùng dựa vào nó. -->

## Chung
- Địa chỉ: `https://pos-tuquyduong.io.vn/api/kh`. Mọi câu trả lời thành công có `success: true`.
- Đăng nhập xong nhận `token`; các cửa "token: có" gửi `Authorization: Bearer <token>`. Thiếu / sai / hết hạn → 401 `KH_TOKEN_SAI`.
- Lỗi luôn `{ error: '<lời tiếng Việt>', code: 'MA_IN_HOA' }` — App hiện nguyên `error`.
- SĐT khách luôn lấy từ token, không bao giờ từ thân yêu cầu. Đơn / dữ liệu của khách khác → 404 như không có.
- **Giờ:** mọi giờ POS trả là giờ Việt Nam (UTC+7), dạng `YYYY-MM-DDTHH:mm:ss`, KHÔNG hậu tố múi giờ. App KHÔNG đưa thẳng vào `new Date()`;
  hiện đúng như chuỗi. Vài giờ cũ còn dạng có dấu cách (POS sửa trong GIO-VN-1) — cứ hiện, không tự cộng 7 giờ. "Bây giờ" lấy `bay_gio` của POS.
- **Mã nhận điểm / mã bill:** chỉ `[A-Z0-9]`, hiện 6 ký tự, tối đa 32. App cắt khoảng trắng + đổi chữ hoa trước khi gửi (POS cũng làm).

## Các cửa (phiên bản 1)
| Cửa | Token | Gửi | Trả (ngoài `success`) |
|---|---|---|---|
| `POST /dang-nhap/xin-ma` | không | `{ sdt }` | `lay_ma_tai_quay` (true = khách hỏi mã ở quầy) |
| `POST /dang-nhap/xac-minh` | không | `{ sdt, ma, ten? }` (mã 6 số; khách mới thiếu tên → `CAN_TEN`) | `token`, `khach { sdt, ten, ngay_tao }` |
| `GET /toi` | có | — | `khach { sdt, ten, ngay_tao, qr }` |
| `PUT /toi` | có | `{ ten }` | `khach { sdt, ten, ngay_tao }` |
| `GET /menu` | có | — | `data[] { ma, ten, nhom, gia, con_hang, ton_cu, ton_luc }` — `con_hang` có thể `null` |
| `GET /diem` | có | — | `points`, `history` |
| `GET /voucher` | có | `?all=1` lấy cả mã đã dùng / hết hạn | `data[]`, `ma_khach_moi` |
| `GET /don` | có | `?trang=N` (20 đơn / trang) | `trang`, `con_nua`, `data[] { ma, ngay, tong, da_tra, trang_thai, thanh_toan }` |
| `GET /don/:ma` | có | — | `don { ma, ngay, tong, da_tra, trang_thai, thanh_toan, mon[] { ten, so_luong, don_gia, thanh_tien, ghi_chu } }` |
| `POST /nhan-ma-bill` | có | `{ ma }` | kết quả nhận ưu đãi khách mới |
| `POST /nhan-diem` | có | `{ ma }` | kết quả nhân điểm theo mã trên bill |
| `PUT /pin` | có | `{ pin, pin_lai }` (4 số) | — |

## Mã lỗi
`KH_CHUA_CAU_HINH` 503 · `KH_TOKEN_SAI` 401 · `SDT_KHONG_HOP_LE` 400 · `QUA_NHIEU_LAN` 429 · `MA_SAI` 400 · `MA_HET_HAN` 400 · `CAN_TEN` 400 ·
`TEN_KHONG_HOP_LE` 400 · `KHONG_THAY_DON` 404 · `KHONG_TIM_THAY` 404 · `YEU_CAU_KHONG_HOP_LE` 400 · `LOI_MAY_CHU` 500 · `KHO_BAN` 409 ·
`PUT /pin`: `PIN_KHONG_HOP_LE` 400 · `PIN_KHONG_KHOP` 400 · `PIN_DA_CO` 409 · `KHACH_KHONG_TON_TAI` 404.
`nhan-ma-bill` / `nhan-diem`: `THIEU_MA` · `MA_KHONG_TON_TAI` · `MA_DA_DUNG` · `UU_DAI_DANG_TAT` · `SDT_DA_NHAN` · `DON_FLASH_KHONG_DIEM` ·
`CAU_HINH_DIEM_SAI` · `CHUA_CAU_HINH_NHOM` — App hiện nguyên `error`.

**Lỗi đã biết (POS sửa trong KH-API-2):** hai cửa nhận mã khi lỗi máy bất ngờ trả 500 chỉ có `{ error }` (lời máy, không `code`) → App coi 500
không `code` như `LOI_MAY_CHU`, hiện lời chung, KHÔNG hiện lời máy.

## Đã hẹn (chưa có — ghi vào khi xong, tăng PHIEN_BAN)
- KH-API-2: `/toi` thêm hạng + số dư ví; cửa danh sách hạng; cửa Giờ vàng hôm nay; `/menu` thêm giá từng hạng.
- TOPPING-1: `/menu` thêm topping theo món + giá.
- KH-API-2 (v2): `GET /gio-hoat-dong` KHÔNG cần token → `bay_gio, dang_mo, hom_nay, mo_lai_luc, thong_bao, lich_tuan, ngay_nghi`.
- DG-GOOGLE-1 (sau khai trương — POS đã chốt tên): `GET /loi-moi-danh-gia`, `POST /loi-moi-danh-gia/:ma/su-kien { loai: mo | xong | luc_khac }`,
  `/don` thêm `co_the_danh_gia`, `da_danh_gia`, `link_danh_gia`.

## Phần máy đọc
<!-- HOP_DONG_MAY_DOC -->
```json
{
  "phien_ban": 1,
  "goc": "/api/kh",
  "cua": [
    { "pt": "POST", "duong": "/dang-nhap/xin-ma", "token": false, "tra": ["lay_ma_tai_quay"] },
    { "pt": "POST", "duong": "/dang-nhap/xac-minh", "token": false, "tra": ["token", "khach.sdt", "khach.ten", "khach.ngay_tao"] },
    { "pt": "GET", "duong": "/toi", "token": true, "tra": ["khach.sdt", "khach.ten", "khach.ngay_tao", "khach.qr"] },
    { "pt": "PUT", "duong": "/toi", "token": true, "tra": ["khach.sdt", "khach.ten", "khach.ngay_tao"] },
    { "pt": "GET", "duong": "/menu", "token": true, "tra": ["data[].ma", "data[].ten", "data[].nhom", "data[].gia", "data[].con_hang", "data[].ton_cu", "data[].ton_luc"] },
    { "pt": "GET", "duong": "/diem", "token": true, "tra": ["points", "history"] },
    { "pt": "GET", "duong": "/voucher", "token": true, "tra": ["data", "ma_khach_moi"] },
    { "pt": "GET", "duong": "/don", "token": true, "tra": ["trang", "con_nua", "data[].ma", "data[].ngay", "data[].tong", "data[].da_tra", "data[].trang_thai", "data[].thanh_toan"] },
    { "pt": "GET", "duong": "/don/:ma", "token": true, "tra": ["don.ma", "don.ngay", "don.tong", "don.da_tra", "don.trang_thai", "don.thanh_toan", "don.mon[].ten", "don.mon[].so_luong", "don.mon[].don_gia", "don.mon[].thanh_tien", "don.mon[].ghi_chu"] },
    { "pt": "POST", "duong": "/nhan-ma-bill", "token": true, "tra": [] },
    { "pt": "POST", "duong": "/nhan-diem", "token": true, "tra": [] },
    { "pt": "PUT", "duong": "/pin", "token": true, "tra": [] }
  ],
  "ma_loi": ["KH_CHUA_CAU_HINH", "KH_TOKEN_SAI", "SDT_KHONG_HOP_LE", "QUA_NHIEU_LAN", "MA_SAI", "MA_HET_HAN", "CAN_TEN", "TEN_KHONG_HOP_LE",
    "KHONG_THAY_DON", "KHONG_TIM_THAY", "YEU_CAU_KHONG_HOP_LE", "LOI_MAY_CHU", "KHO_BAN",
    "PIN_KHONG_HOP_LE", "PIN_KHONG_KHOP", "PIN_DA_CO", "KHACH_KHONG_TON_TAI",
    "THIEU_MA", "MA_KHONG_TON_TAI", "MA_DA_DUNG", "UU_DAI_DANG_TAT", "SDT_DA_NHAN", "DON_FLASH_KHONG_DIEM", "CAU_HINH_DIEM_SAI", "CHUA_CAU_HINH_NHOM"]
}
```
<!-- HET HOP_DONG_MAY_DOC -->

## Nhật ký
- v1 · 28.10.2026 · Bản đầu, ghi đúng code POS b1f8299 (chat App KH soạn, chat POS đặt vào kho). POS thêm 8 mã lỗi nhận mã, dòng "Lỗi đã biết", quy ước giờ VN.
