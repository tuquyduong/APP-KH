# Thư POS → App KH · 15.11.2026 (chiều) · VOUCHER-2 sắp gộp — hợp đồng `/api/kh` có thêm phần v15

<!-- Chat POS bàn 37 viết. Chủ quán tải về, dán / gửi cho chat App KH. Chi tiết đầy đủ: `HOP_DONG_API_KH.md` trên POS main sau khi gộp (mục "Voucher", "Báo giá", "nhan-ma-bill", nhật ký v15). -->

## Tóm tắt (đọc 30 giây)
- POS đã làm xong **VOUCHER-2** (nhiều voucher trong một đơn). Chủ quán gộp hôm nay 15.11. Sau khi gộp, hợp đồng trên main **vẫn là PHIEN_BAN 16** — phần mới nằm ở dòng nhật ký **v15** (đứng trước v16 Quảng cáo).
- **App cũ không vỡ:** App đang gửi `ma_giam` (kể cả gõ mã voucher vào ô mã) vẫn chạy như trước. Giỏ không có `vouchers` thì khoá chống gửi trùng băm y như cũ.
- Việc App "nhiều voucher / đơn" (đang chờ POS) **mở được** sau khi chủ quán báo "XONG VOUCHER-2".

## App cần biết gì
1. **Hai kiểu voucher.** Voucher giảm **tiền món** (cả đơn, hoặc theo món / nhóm món) và voucher giảm **phí giao**. `GET /voucher` mỗi dòng có thêm `mo_ta` (câu hiện cho khách), `nguon`, `kieu`, và luật: `min_order`, `giam_ship`, `ap_dung`, `chinh_chu`.
2. **Một đơn dùng được nhiều voucher + một mã chung.** Gửi `vouchers: [mã, …]` trong `POST /gio/bao-gia` và `POST /don`. Số voucher tối đa mỗi đơn do quán đặt (quá → `VUOT_SO_VOUCHER`). **Tối đa MỘT voucher % mỗi đơn** (`VOUCHER_PHAN_TRAM_HAI`).
3. **Voucher hỏng không chặn báo giá.** Báo giá vẫn tính các voucher tốt, voucher hỏng nằm ở `voucher_loi[] { ma, code, error }` — App hiện `error` cạnh mã đó. Đặt đơn thì POS tạo đúng theo các voucher báo giá đã nhận.
4. **Dòng giảm trong báo giá / hoá đơn:** `giam[]` có thêm `loai: "voucher"` (giảm món) và `"voucher_ship"` (giảm phí giao), kèm `ma`. `hoa_don[]` có thêm dòng `voucher` và `giam_ship`.
5. **Không áp lên thẻ hạng / gói / nạp.** Giỏ chỉ có thẻ → mã / voucher không áp (`MA_KHONG_AP_MON_THUONG`).
6. **Hai voucher theo món trên cùng món (Q24, chủ quán 14.11):** voucher sau chỉ giảm phần **còn lại** của món đó. Món đã được giảm hết → `VOUCHER_HET_MON` ("Voucher <MÃ> không còn món để giảm").
7. **Đơn chờ chuyển khoản giữ voucher.** Trong lúc chờ tiền về, voucher bị giữ; đơn khác dùng → `VOUCHER_DANG_GIU`. Huỷ / hết hạn phiên → tự nhả. Voucher hết hạn trong lúc đang giữ vẫn dùng được khi tiền về.
8. **Mã in trên bill (`nhan-ma-bill`):** chỉ cho tài khoản tạo **sau** lúc in bill, hoặc tạo trong **30 phút trước** bill của chính SĐT đó và chưa có đơn nào trước (đơn đã huỷ không tính). Nhận mã thì POS phát **voucher MỚI** theo mẫu quán chọn: `data.voucher_code` là mã mới, thêm `data.mo_ta`, `data.kieu`, `data.ap_dung`; `data.scope` là `ship` · `item` · `order`. Lỗi mới: `CAN_TAO_TAI_KHOAN`, `KHACH_DA_CO_TAI_KHOAN`, `UU_DAI_CHUA_CO_MAU`. Voucher khách mới mà đơn có mã bill đã huỷ / hoàn → `MA_DON_GOC_KHONG_HOP_LE`.
9. **Mã lỗi** — tất cả đã nằm trong khối `ma_loi` máy đọc được của hợp đồng (bài `thu_HOPDONG_KH` canh): `VOUCHER_KHONG_TON_TAI` · `VOUCHER_CHINH_CHU` · `VOUCHER_DA_DUNG` · `VOUCHER_HET_HAN` · `VUOT_SO_VOUCHER` · `VOUCHER_SHIP_CAN_GIAO` · `MA_KHONG_AP_MON_THUONG` · `VOUCHER_CHUA_DU_DON` · `VOUCHER_PHAN_TRAM_FLASH` · `VOUCHER_PHAN_TRAM_HAI` · `VOUCHER_KHONG_CO_MON` · `VOUCHER_HET_MON` · `VOUCHER_DANG_GIU` · `MA_DON_GOC_KHONG_HOP_LE` · `CAN_TAO_TAI_KHOAN` · `KHACH_DA_CO_TAI_KHOAN` · `UU_DAI_CHUA_CO_MAU`. App chỉ cần hiện `error` (lời POS viết sẵn), không phải tự viết câu.

## Thứ tự hợp đồng sắp tới
v15 VOUCHER-2 (gộp hôm nay) · v16 Quảng cáo (đã có) · **v17 KH-NAP-1** (nạp trên App một dòng `{ loai: "nap", ma_goi }`, thẻ / nạp chỉ trả tiền thật, 4 điểm App xin ghi rõ — POS đã nhận) ~17–18.11.

## Lưu ý App
- Trong kho App chép hợp đồng thì chép bản **POS main sau khi gộp** (PHIEN_BAN 16 có cả v15).
- Không cần đổi gì ở `/admin` hay kho nội dung `/api/nd`.
