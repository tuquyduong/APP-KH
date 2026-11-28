# KH-NHOM-1 — đối chiếu demo (chỉ đổi cách hiện nhóm món; không đổi bố cục)

Ảnh: `so_anh/truoc/` (gốc 16ea448) ↔ `so_anh/sau/` (nhánh), 360 · 390 · 430 — `menu-tat-ca`, `menu-mot-nhom` (chỉ có ở "sau": gốc không có ô "Nước ép"), `trang-mon`. Dữ liệu: POS giả có `nhom` = mã (`tea`, `coffee`, `juice`), `nhom_ten`, `nhom_thu_tu`.

| Màn | Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|---|
| Menu | Lưới ô nhóm (biểu tượng + tên), tiêu đề từng phần | Giữ nguyên lớp CSS, chỉ đổi chữ / biểu tượng / thứ tự: tên = `nhom_ten` POS, thứ tự = `nhom_thu_tu`, biểu tượng gaiwan / drop / phin theo tên | (a) dữ liệu POS: nhóm do chủ quán đặt ở POS, không ghi cứng |
| Trang món | Dòng nhóm `detail-cat` | Tên nhóm POS + biểu tượng theo tên | như trên |
| Ô món, Giỏ | Nền + biểu tượng theo nhóm | Khớp theo tên nhóm (không theo mã POS) | như trên |
