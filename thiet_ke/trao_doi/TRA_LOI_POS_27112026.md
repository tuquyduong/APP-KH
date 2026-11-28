# POS → App KH · 27.11.2026 — hợp đồng /api/kh lên v20 (nhóm món v19 + topping v20)

Hai việc POS đã gộp vào bản chính ngày 27.11 (PR #107 NHOM-MON-1, PR #108 TOPPING-1). Chi tiết kỹ thuật: `HOP_DONG_API_KH.md` trong kho POS
(`PHIEN_BAN: 20`, nhật ký cuối file, mục "Ghi chú v20"). App bản cũ vẫn chạy — không trường nào bị xoá hay đổi tên.

---

## Phần 1 — Nhóm món (v19, NHOM-MON-1)

**Chuyện gì:** chủ quán giờ cài nhóm món ở POS (đổi tên, xếp thứ tự, bật / tắt "hiện trên App"). App không tự đặt tên nhóm nữa.

**App cần làm (chỉ đọc, không gọi gì mới):** `GET /api/kh/menu` mỗi món có thêm hai trường:
- `nhom_ten` — tên nhóm để hiển thị (vd "Nước ép", "Trà" — chủ quán đổi được, App cứ hiện đúng chữ này).
- `nhom_thu_tu` — số thứ tự nhóm, nhỏ đứng trước. Món chưa thuộc nhóm nào có số 9999 (xếp cuối).

**Cách vẽ:** gom món theo `nhom` (mã, không đổi), đặt tên tab bằng `nhom_ten`, xếp các tab theo `nhom_thu_tu` tăng dần.
Đừng tự ghi tên "Nước ép" / "Trà" cứng trong App.

**Nhóm bị tắt "hiện trên App":** món của nhóm đó không còn trong `/menu`. Nếu khách còn giỏ cũ có món đó, báo giá / đặt đơn trả `400 MON_KHONG_BAN`
(kèm `ma` món) — mã lỗi App đã có, hiện "món không bán" như thường.

**App cũ chưa sửa vẫn chạy:** trường `nhom` vẫn là mã như trước. Chỉ khác là món nhóm tắt sẽ biến mất khỏi menu.

---

## Phần 2 — Topping + ghi chú nhanh theo từng món (v20, TOPPING-1)

### Việc này là gì
Quán bán topping (nếp cẩm, thạch…) kèm theo ly. Mỗi món có danh sách topping RIÊNG và các nút ghi chú nhanh RIÊNG ("Ít đá", "Ít ngọt"…), do chủ
quán cài ở POS. App cần cho khách chọn đúng như ở quầy. Mọi giá do POS tính; App chỉ hiển thị.

### App cần làm
1. **Menu** (`GET /menu`): mỗi món giờ có thêm hai thứ.
   - `ghi_chu_nhanh`: danh sách nút ghi chú của món đó. Khách chạm nút nào thì ghép chữ nút vào ô `ghi_chu` như ghi chú tự gõ.
   - `topping`: các topping được thêm vào món, mỗi cái có tên, giá một phần (`gia`), giá theo hạng (`gia_hang`), còn hàng (`con_hang`).
     `con_hang: false` thì hiện mờ, không cho chọn.
   - Ở ngoài danh sách món có `topping_toi_da_phan` (hôm nay là 3): mỗi topping khách chọn tối đa bấy nhiêu phần một ly.
   - Topping nào quán cho bán riêng thì hiện thêm như một món nhóm `"topping"`, giá là giá bán riêng, đặt như món thường.
   - Món không có topping và không có nút ghi chú: chạm là vào giỏ, không cần mở khung.
2. **Giỏ / báo giá / đặt đơn** (`POST /gio/bao-gia`, `POST /don`): dòng món gửi thêm `topping: [{ ma, so_phan }]`. Không gửi giá. Báo giá trả lại
   từng topping (tên, số phần, đơn giá, thành tiền). Tổng tạm tính đã gồm topping.
3. **Hai ly cùng món nhưng khác topping** (hoặc khác ghi chú) là HAI dòng giỏ. Cùng món + cùng topping + cùng ghi chú thì gộp số ly.
4. **Lỗi mới:**
   - `TOPPING_KHONG_CHO_MON`: topping không thuộc món đó.
   - `TOPPING_SO_PHAN`: số phần sai (ngoài 1…3, hoặc một topping gửi hai lần).
   - `TOPPING_KHONG_BAN_RIENG`: đặt riêng một topping không bán riêng.

   Topping hết cho cả giỏ thì báo `HET_HANG` kèm `ma` của topping. Cùng topping ở nhiều ly được cộng lại. App hiện nguyên câu `error`.
5. **Xem đơn** (`GET /don/:ma`): dòng món có topping thêm `topping[]`. `so_mon` chỉ đếm số ly.

### Giảm giá áp lên topping thế nào (POS tự tính)
- Giảm theo hạng áp cả topping.
- Mã giảm và voucher (tiền và %) áp cả topping. Voucher theo nhóm giảm cả topping của ly thuộc nhóm đó. Mã "giảm 1 món" chỉ giảm ly.
- Giờ vàng chỉ giảm topping khi chính topping nằm trong danh sách Giờ vàng.

### Không vỡ bản cũ
App chưa gửi `topping` vẫn đặt được như trước. Không trường cũ nào bị xoá hay đổi tên. Cửa `GET /ghi-chu-nhanh` ở mục "Đã hẹn" bỏ, vì đã nằm trong `/menu`.

---

**Sắp tới (để App chuẩn bị):** việc ANH-MON-1 sẽ cho trường `anh` của món trả đường dẫn ảnh thật (hiện luôn `null`) — POS gửi thư riêng khi xong.
