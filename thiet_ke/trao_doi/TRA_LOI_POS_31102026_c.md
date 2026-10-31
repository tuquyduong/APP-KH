# TRẢ LỜI POS → chat App KH — 31.10.2026 (c) · chốt kế hoạch KH-MUA-1 phía POS

Gửi sau `TRA_LOI_POS_31102026_b.md`. Chủ quán duyệt kế hoạch KH-MUA-1 tối 31.10; máy POS đang làm. Tên dưới đây sẽ vào hợp đồng **v5**
(KH-SP-1 là v4). Đổi gì POS báo trước.

## 1. MỚI — `tong_da_xem` (bắt buộc) ở `POST /don`
- App gửi `tong_da_xem` = `tong` của lần `/gio/bao-gia` khách vừa xem (số nguyên ≥ 0). Máy chủ VẪN tự tính lại; số này chỉ để so.
- Khác số máy chủ tính (Giờ vàng vừa tắt, mã hết lượt, hạng hết hạn, giá đổi…) → **409 `GIA_DA_DOI`** kèm báo giá mới (cùng dạng
  `/gio/bao-gia`) — chưa tạo gì, chưa giữ ví. App hiện giá mới, khách bấm Đặt lại (khoá gửi MỚI, vì thân đã khác).
- Thiếu / sai dạng → 400 `YEU_CAU_KHONG_HOP_LE`.
- Lý do: khách trả ví không bao giờ bị trừ khác số đã thấy.

## 2. Chốt thêm về `khoa_gui` và gửi lại
- Gửi lại CÙNG khoá trong 24 giờ, cùng thân → 200 đơn cũ, `trung: true`. Sau 24 giờ khoá cũ → 409 `KHOA_GUI_DA_DUNG` (khoá dùng một lần mãi mãi;
  App sinh khoá mới mỗi lần bấm Đặt).
- Hai yêu cầu cùng khoá đến CÙNG LÚC → một cái thắng, cái kia **503 `DANG_XU_LY`** → App chờ ~2 giây gửi lại CÙNG khoá, cùng thân → nhận đơn cũ.
- Gửi lại cùng khoá KHÔNG bao giờ bị 429 (đếm lượt đứng sau bước tra khoá). Trần: 10 lần đặt / 10 phút / khách.

## 3. Mã lỗi `POST /don` (mọi 4xx = chưa tạo đơn, chưa giữ ví — như file b)
`CHUA_GIAO` · `NGOAI_GIO` · `QUA_GIO_NHAN_DON` · `HET_HANG` (+ `ma`) · `MON_KHONG_BAN` (+ `ma`) · `KHOA_GUI_SAI` · `KHOA_GUI_DA_DUNG` (409) ·
`GIA_DA_DOI` (409) · `KHO_BAN` (409, gửi lại sau ít giây) · `QUA_NHIEU_LAN` (429 + `thu_lai_sau_giay`) · `CACH_KHONG_KHOP` · `VI_KHONG_DU` ·
`CHUA_CO_PIN` · `PIN_SAI` · `PIN_DANG_KHOA` · `DON_KHONG_HOP_LE` (đơn sai mà máy chủ chưa có mã riêng — hiện nguyên câu `error`) ·
`YEU_CAU_KHONG_HOP_LE`. 5xx: `DANG_XU_LY` 503, `PAYOS_CHUA_CAU_HINH` 503, `PAYOS_LOI` 502 → App gửi lại cùng khoá.

## 4. Chốt nhỏ
- `vi_qr` khi ví = 0đ → đi như QR toàn bộ (`giu_vi: 0`), không báo lỗi.
- Mã hợp lệ nhưng máy chủ chọn giá hạng vì lợi hơn → không có dòng `ma_giam`; có `ma_giam_loi { code: "MA_KHONG_LOI_HON", error }` để App giải thích.
- Mã không áp được cho giỏ → báo giá tính KHÔNG mã + `ma_giam_loi`; đặt đơn theo đúng số đó (khớp `tong_da_xem`).
- Huỷ đơn đã huỷ → 200 `tien_trinh: "da_huy"` (không lỗi).
- Tiền QR về sau khi đơn đã huỷ / hết hạn → `GET /don/:ma` có `tien_trinh: "da_huy"` + `tien_ve_cho_doi_soat: true` → App báo
  "Quán đã nhận tiền, nhân viên sẽ liên hệ". Không hoàn tự động.
- Món chưa rõ tồn (mất kết nối SX) → vẫn đặt được, như quầy.
- Mã đơn App dạng `A` + 8 ký tự; sau khi trả, `GET /don/:ma` tìm được bằng mã App này.

## 5. Mã thông tin món (KH-SP-1, hợp đồng v4) — xin App xác nhận đúng mã
- `nhu_cau[]`: `ngu_ngon` · `dep_da` · `am_bung` · `tinh_tao` · `bo_khi` · `giai_nhiet`
- `the_chat[]`: `binh_hoa` · `khi_hu` · `duong_hu` · `am_hu` · `dam_thap` · `thap_nhiet` · `huyet_u` · `khi_uat` · `dac_bam`
Khác mã App đang dùng → báo POS ngay (máy POS sửa một chỗ).
