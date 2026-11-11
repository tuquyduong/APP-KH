# KH-ND-3e — đối chiếu demo

## 1. Ảnh: khách thấy Y HỆT trước (A4)
Công cụ (ở nháp, không vào kho): Chromium + Playwright có sẵn; App thật dựng bằng esbuild từ `src/main.jsx` (như `thu_KHMUA1b`); POS giả của `thu_KHMUA1b.js` (khách "chị Linh", giỏ 2 món, báo giá 87.654đ, giảm hạng Vàng 11.346đ);
giờ máy đóng băng 30/10/2026 20:30; chèn `animation: none; transition: none` (nền hoạ tiết và đường kẻ có hoạt ảnh làm nhiễu); chụp 360 / 390 / 430 (cao 844).
Cây gốc = `git archive fe752c3` (PHIEU). So từng điểm ảnh bằng canvas của Chromium (công cụ nháp `soanh.js`).

| Màn | Ảnh (cỡ) | Điểm ảnh khác (trước ↔ sau) |
|---|---|---|
| Thanh toán — QR | `thanhtoan-qr` 360 · 390 · 430 | 0 · 0 · 0 |
| Thanh toán — ví đủ | `thanhtoan-vi-du` 390 | 0 |
| Thanh toán — ví + QR | `thanhtoan-vi-qr` 390 | 0 |
| Bảng PIN (nhập PIN trả ví; PIN sai hiện lời POS) | `pin-tra` · `pin-sai` 390 | 0 · 0 |
| Theo dõi đơn — chờ trả QR | `theodoi-cho-qr` 360 · 390 · 430 | 0 · 0 · 0 |
| Theo dõi đơn — đã trả | `theodoi-da-tra` 360 · 390 · 430 | 0 · 0 · 0 |
| Theo dõi đơn — xong | `theodoi-xong` 360 · 390 · 430 | 0 · 0 · 0 |
| Thông báo đơn xong (dải trên cùng) | `bao-don-xong` 360 · 390 · 430 | 0 · 0 · 0 |
| Đơn hàng — danh sách | `donhang-ds` 360 · 390 · 430 | 0 · 0 · 0 |
| Đơn hàng — chi tiết một đơn | `donhang-chitiet` 360 · 390 · 430 | 0 · 0 · 0 |

**25 cặp · 0 điểm ảnh khác** (không cần bỏ vùng nhiễu: mã QR đếm ngược cùng số giây ở hai lần chụp nhờ giờ đóng băng).
Lần so đầu tiên bắt được 99 điểm lệch ở 390 / 430, dòng "Quét mã bằng app ngân hàng để trả … · còn …": tách "còn" thành nút chữ riêng làm đổi khử răng cưa. Sửa: chữ đầu dòng là nút chữ trực tiếp,
" · còn " giữ MỘT nút chữ (bọc `<span data-nd>`) → 0.
Lần chụp đầu KHÔNG khoá hoạt ảnh lệch 2.000–30.000 điểm ở nền hoạ tiết (chụp "gốc" hai lần cũng lệch cỡ đó: 700–19.000) — là nhiễu của nền, không do code; vì vậy so lại có khoá hoạt ảnh.
Ảnh: `so_anh/truoc/`, `so_anh/sau/` (25 cặp). `so_anh/lech/` không có tệp vì không có điểm lệch.
Ba màn không có ảnh riêng: "Đơn hàng — hoá đơn có giảm" và "Tiền về muộn" của bài `thu_KHSOHD1` / `thu_KHBAO1` vẫn xanh ở Chromium (chữ y hệt, ca DOM) — chưa chụp cặp ảnh riêng.

## 2. Khoá App ↔ khoá demo (`data-cms`) — màn đã chuyển
Demo (`thiet_ke/app_kh_demo.html`) KHÔNG có `data-cms` ở các màn Thanh toán (`#checkout`), Theo dõi đơn (`#tracking`), Lịch sử đơn (`#orderhistory`) và bảng PIN (`#sheetPin`: tiêu đề + dòng nhỏ dựng bằng JS, dòng 4044)
— không có khoá demo để dùng lại. Mọi khoá của nhóm này là khoá riêng của App, đặt `<màn>.<tên>`:

| Màn demo | Khoá demo | Khoá App | Ghi chú |
|---|---|---|---|
| Thanh toán `#checkout` | (không có) | `tt.*` (62 mục), `loi.GIA_DA_DOI`, `loi.GIA_DA_DOI_CU`, `loi.CHUA_MO`, `loi.CHUA_RO`, `loi.NGOAI_GIO`, `giam.*`; 🔒 `tt.so`, `tt.thongBao` | các dòng demo "Giá vừa thay đổi…" không có — App thêm (hợp đồng v9) |
| Theo dõi đơn `#tracking` | (không có) | `td.*` (34 mục, gồm 8 bước `td.buoc.*`), thẻ QR `qr.*`; 🔒 `td.so`, `td.tien`, `td.cauTienVe`, `td.loiPos`, `qr.tien`, `qr.dong` | |
| Lịch sử đơn `#orderhistory` | (không có) | `dh.*`, hoá đơn `hd.soBill`; 🔒 `dh.so`, `dh.tien`, `dh.cauTienVe`, `hd.dong` | demo ô lọc (Đang giao / Hoàn thành / Đã hủy) chưa có khối — POS chưa ghi `trang_thai` |
| Bảng PIN `#sheetPin` | (không có) | `pin.*` (15 mục); 🔒 `pin.loiPos` | |
| Dải báo đơn xong / khung lỗi tải | (không có) | `bao.*`, `khung.thuLai`; 🔒 `khung.loi` | dải báo là của App (KH-BAO-1), demo chưa có |

Khoá demo có mà App chưa có khối ở nhóm màn này: (không có). Khoá demo khác (`rw.*` ưu đãi, `tier.*` hạng, `vk.*` văn khấn, `sp.*`, `tc.*`) thuộc việc KH-ND-3b / 3c.

### Mục khoá (🔒) — chỉ đường cho /admin
| Khoá | Chỉ nguồn | Hiện ở |
|---|---|---|
| `tt.so` | POS › Đơn hàng | số tiền, tên món của lần đặt chưa rõ |
| `tt.thongBao` | POS › Cài đặt › Giờ hoạt động | lời POS khi đặt đơn không được; câu chặn ngoài giờ |
| `td.so` / `td.tien` | POS › Đơn hàng | số đơn, giờ đếm ngược, tiền, món |
| `td.cauTienVe`, `dh.cauTienVe` | POS › Đơn hàng | câu POS báo tiền về |
| `td.loiPos`, `pin.loiPos`, `khung.loi` | POS (lời trả nguyên văn) | lời lỗi POS |
| `qr.tien`, `qr.dong` | POS › Đơn hàng / Thanh toán QR | số tiền, số đơn + nội dung chuyển khoản |
| `dh.so`, `dh.tien`, `hd.dong` | POS › Đơn hàng / Mẫu hoá đơn | số đơn, ngày, tiền, dòng hoá đơn |
