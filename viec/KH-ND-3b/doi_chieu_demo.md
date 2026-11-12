# KH-ND-3b — đối chiếu khoá App ↔ khoá demo (patch39)

Việc này KHÔNG đổi giao diện (không đổi màu, phông, bố cục, câu chữ). Bảng dưới chỉ nối khoá danh mục App với khoá `data-cms` của demo.
Trong demo, Menu / Trang món / Giỏ hàng **không có khoá `data-cms` của chữ cố định**: chỉ có khoá theo từng món (`p.desc:<id>`, `p.ingr:<id>`, `p.tags:<id>`, `p.img:<id>`, `p.video:<id>`) — nội dung ấy ở `src/noiDung/mon.js` (thông tin ngắn của món, nhóm A "KH-ND-2", không thuộc việc này).
Vì vậy khoá App đặt theo màn (`menu.*`, `mon.*`, `gio.*`…). Khoá demo có mà App chưa có khối → "chưa có khối".

## Menu (demo `catalog`)
| Khối trong demo | Khoá demo | Khoá App | Ghi chú |
|---|---|---|---|
| Tên màn "Menu" | — | `menu.tieuDe` | |
| Dòng dưới tên (số món / giá cũ) | — | `menu.conMon`, `menu.giaCu` | số do App đếm |
| Thanh đang lọc nhu cầu | — | `menu.dangLoc`, `menu.xoaLoc` | nhãn nhu cầu = `home.need[].nhan` |
| Ô tìm | — | `menu.timGoiY`, `menu.timAria` | |
| Ô nhóm "Tất cả", nhóm "Khác" | — | `menu.tatCa`, `menu.nhomKhac` | tên nhóm khác do POS (`menu.nhom` 🔒) |
| Ô Giờ vàng + khối Giờ vàng | `home.gvk` (chỉ Trang chủ) | `menu.gv.ten`, `menu.gv.dau`, `menu.gv.khung`, `menu.gv.luuY`, `gv.dem.*` | % giảm / khung giờ (`menu.gv.so` 🔒 POS), đồng hồ (`menu.gv.dem` 🔒 tự tính) |
| Số món cạnh tên nhóm | — | `menu.soMon` | |
| Chưa có món / không khớp | — | `menu.rong`, `menu.khongKhop` | |
| Thẻ món: tên, giá, bậc giá hạng | — | `menu.mon` 🔒, `gia.thuong`, `gia.hang` 🔒 | |
| Thẻ món: "Hết hàng", "theo số lúc …" | — | `mon.hetHang`, `mon.tonCu` | |
| Thẻ món: nhãn nhu cầu / Giờ vàng | `p.tags:<id>` | `home.need[].nhan` (một nguồn), `gv.nhan.*` | gắn nhu cầu cho món ở `noiDung/mon.js` |
| Video món (`p.video`), ảnh món (`p.img`) | `p.video:<id>`, `p.img:<id>` | — | chưa có khối (video); ảnh do `mon.js` |

## Trang món (demo `detail`)
| Khối trong demo | Khoá demo | Khoá App | Ghi chú |
|---|---|---|---|
| Nhãn "-N% Giờ vàng" | — | `mon.gvNhan` | |
| Nhóm, tên, giá, bậc giá | — | `menu.nhom` 🔒, `menu.mon` 🔒, `gia.thuong`, `gia.cuaBan` | |
| Ghi chú Giờ vàng | — | `gv.ghi.dangB/dangDuoi`, `gv.ghi.truocA/B/C` | |
| Chip nhu cầu | `p.tags:<id>` | `home.need[].nhan` | |
| Mô tả | `p.desc:<id>` | — (ở `mon.js`) | nhóm A — KH-ND-2 |
| Thành phần / Công dụng | `p.ingr:<id>` | `mon.thanhPhan`, `mon.congDung` (nhãn) | nội dung ở `mon.js` |
| Chọn size / topping / đường | — | chưa có khối | POS chưa có cửa (TOPPING-1) |
| Ghi chú cho quán, số lượng, nút thêm | — | `mon.ghiChu`, `mon.ghiChuGoiY`, `mon.soLuong`, `mon.nutThem`, `mon.nutHet`, `khung.bot`, `khung.them` | |
| Món không còn / đường dẫn lạ | — | `mon.khongThay.*`, `khongthay.*` | |

## Giỏ hàng (demo `cart`)
| Khối trong demo | Khoá demo | Khoá App | Ghi chú |
|---|---|---|---|
| Tên màn, số món | — | `gio.tieuDe`, `gio.soMon` | |
| Dòng món (tên, giá, ghi chú) | — | `gio.mon` 🔒, `gio.hetHang`, `gio.khongCon`, `gio.ngungBan`, `gio.xoaAria` | |
| Thông báo xoá + Hoàn tác | — | `gio.daXoa`, `gio.hoanTac`, `gio.monChung` | |
| Ô mã giảm giá | — | `gio.ma.goiY/aria/ap/daAp`, `gio.maLoi` 🔒 | lời lỗi do POS |
| Bảng tiền | — | `gio.tienHang`, `gio.phiGiao`, `gio.tong`, `gio.chuaTong`, `gio.tien` 🔒 | số tiền chỉ từ báo giá POS |
| Nút "Tiếp tục" | — | `gio.tiepTuc` | |
| Giỏ trống | — | `gio.rong.t/s/nut` | |
| Quán đóng | — | chưa có khối | giỏ chưa hiện trạng thái quán; thông báo quán ở Trang chủ (`home.quan` 🔒) |

## Dùng chung
`thu.t2…t8` (tên thứ trong giờ hoạt động — `gioHoatDong.js`, chân trang / Hỗ trợ), `gv.dem.*`, `gv.nhan.*` (chữ đếm ngược / nhãn Giờ vàng).

## Giao diện
Không đổi: so ảnh trước/sau 6 màn × 360 / 390 / 430 ở `so_anh/` (xem `trang_thai.md`).
