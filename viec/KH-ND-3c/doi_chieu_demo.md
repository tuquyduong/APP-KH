# KH-ND-3c — đối chiếu demo (patch39) ↔ App

Việc này KHÔNG đổi giao diện khách thấy, trừ màn **Mã thành viên** (mục B, POS QUET-1) và vệt sáng ở máy bật "giảm chuyển động" (mục C4). Phần A là chuyển chữ về danh mục → ảnh phải giống HỆT.
Lý do khác demo dùng nhãn của CLAUDE.md §5: (a) dữ liệu POS chưa có / việc sau · (b) chữ mẫu của demo không dùng · (c) chưa có giỏ / đặt đơn · (d) màn rộng.

## 1. Ảnh trước ↔ sau (A5, B4)
Công cụ nháp (Chromium + Playwright có sẵn, POS giả, giờ cố định, hoạt ảnh khoá): `so_anh/truoc/` = bản gốc `8c67ae6`, `so_anh/sau/` = bản sau việc, `so_anh/lech/` = ảnh tô chỗ lệch (chỉ có khi lệch). Kết quả: `so_anh/ket_qua.txt`.

| Màn | Ca chụp (mỗi ca ở 360 · 390 · 430) | Kết quả |
|---|---|---|
| Ưu đãi chưa đăng nhập (thẻ hạng, thẻ mời, banner Giờ vàng) | `uudai-khach__man` | giống hệt |
| Ưu đãi đã đăng nhập (voucher, chương trình, ví, lịch sử; có / không "Xem tất cả") | `uudai-dn__man`, `uudai-dn__tatca` | giống hệt |
| Nhập mã (báo lỗi) | `nhanma__loi` | giống hệt |
| Tài khoản (có mục Hỗ trợ — liên hệ giả) | `taikhoan__man` | giống hệt |
| Hồ sơ | `hoso__man` | giống hệt |
| Hỗ trợ (liên hệ giả) | `hotro__man` | giống hệt |
| Đăng nhập 3 bước | `dangnhap__b1`, `b2`, `b3` | giống hệt |
| Trắc nghiệm: giới thiệu · câu 1 · hai câu cuối · kết quả | `tracnghiem__gioithieu`, `cau1`, `cuoi`, `ketqua` | giống hệt |
| Không tìm thấy trang | `khongthay__man` | giống hệt |
| Trang chủ (khách) — banner nhớ chương trình không đổi chữ mặc định | `trangchu__khach` | giống hệt (lần chụp 360 của CẢ BẢN GỐC cũng lệch ~300 điểm giữa hai lần chụp: nhiễu vệt sáng — xem `ket_qua.txt`) |
| **Mã thành viên** | `qr__man` | KHÁC CÓ CHỦ ĐÍCH (mục 3) |

Hai lỗi lệch đã gặp và sửa trong lúc làm (ghi để người sau biết): (1) "Bước 1 **Bạn là**" ở Trắc nghiệm — chữ sau dùng thẻ `span` bị kiểu viên của `.pt-step-h span` → dùng `div` hiển thị inline; (2) tách một câu thành nhiều nút chữ làm đổi khử răng cưa vài chục điểm (Thẻ hết hạn, "Gửi lại mã sau N giây") → giữ đúng cách tách nút chữ của JSX cũ bằng `ndPhan`.

## 2. Bảng khoá demo (`data-cms`) ↔ khoá App

| Màn | Khoá demo | Khoá App | Ghi chú |
|---|---|---|---|
| Ưu đãi — banner | `t:rw.bk` "Ưu đãi tháng này" | `ud.gv.k` "Giờ vàng ·" (+ đồng hồ đếm ngược, khoá `ud.gv.so`) | khác chữ mẫu: App chỉ hiện khi POS có Giờ vàng, chữ lấy từ POS (b) |
| Ưu đãi — banner | `t:rw.bh` "Giờ vàng mỗi tối giảm đến 50%" | `ud.gv.khung` + `ud.gv.giam` (khung giờ, % từ POS) | (b) |
| Ưu đãi — banner | `b:rw.ban` | `ud.gv.nut` | cùng chữ "Xem món Giờ vàng →" |
| Ưu đãi — banner | `img:rw.ban` | chưa có khối | banner App không dùng ảnh nền riêng |
| Ưu đãi — Sưu tập Tứ Quý | `t:rw.tqt`, `t:rw.tqs` | chưa có khối | VIỆC SAU (a) (đã ghi ở UuDai.jsx) |
| Ưu đãi — hạng | `tier:*`, `t:tier.*` (trang quyền lợi hạng) | chưa có khối (App chỉ có thẻ hạng: `ud.hang.*`, khoá `ud.hang.pos`) | VIỆC SAU (a) |
| Ưu đãi — còn lại | (không có `data-cms`) | `ud.*`, `nm.*` (55 khoá) | khoá đặt theo màn |
| Tài khoản | (không có) | `tk.*` (21 khoá) | |
| Hồ sơ | (không có) | `hs.*` (31 khoá) | |
| Hỗ trợ | (không có) | `ht.*` (7 khoá; số điện thoại / Zalo / email trống = ẩn) | demo `support` dùng số mẫu 1900 xxxx → không dùng (b) |
| Đăng nhập | (demo chưa có màn này) | `dn.*` (26 khoá) | dựng bằng khối demo (pf-card, otp-in…) |
| Mã thành viên | (demo chưa có màn này) | `mqr.*` (6 khoá) | xem mục 3 |
| Trắc nghiệm — giới thiệu | `t:tc.h`, `t:tc.s` | `tn.dong1`, `tn.dong2` | |
| Trắc nghiệm — giới thiệu | `t:tc.p1`, `t:tc.by` | `tn.coSo1.a/b/c`, `tn.coSo2.a/b/c` | chữ in đậm tách riêng để sửa được |
| Trắc nghiệm — còn lại | (không có) | `tn.*`, `tnl.*`, `tnk.*` (99 khoá, 5 mục khoá chuyên môn) | nội dung chuyên môn KHOÁ (A2) |

Số khoá theo màn và theo loại: xem `trang_thai.md` mục D4.

## 3. Mã thành viên (mục B — khác demo có chủ đích)
Demo chưa có màn này; trước việc: thẻ `--tq-card`, rộng `min(100%, 18rem)`, viền trắng 2 ô. Sau việc (POS QUET-1: quầy quét bằng camera trước của máy tính bảng):
- mã rộng `min(78vw, 320px)` (≥ 70% bề ngang ở 390), thẻ **nền trắng `#fff`** kể cả giao diện tối, viền trắng 4 ô mã (chỉ màn này), nét đen đặc `crispEdges`;
- dòng nhắc "Tăng độ sáng màn hình để quầy quét nhanh" (mục `mqr.sang`); giữ "Đưa mã này cho nhân viên quầy" + SĐT che;
- giữ màn không tắt (Screen Wake Lock).
Lý do: yêu cầu POS QUET-1 (chủ quán 11.11) — lý do (a)/khác ghi ở phiếu mục B; màu `#fff` có trong demo (K9 xanh).

## 4. Vệt sáng luôn chạy (C4)
`giaoDien.css` ghi đè luật `prefers-reduced-motion` của `demo_2.css` (không sửa `demo_*.css`) cho `.fx-a` và `.fx-a::before`; khác demo vì chủ quán 12.11 ("máy tính chủ quán bật tắt hiệu ứng nên không thấy vệt sáng"). Hiệu ứng khác (màn mở, khung tải) vẫn theo cài đặt máy.
