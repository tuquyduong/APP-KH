# KH-ND-3a — đối chiếu demo

## 1. Ảnh: khách thấy Y HỆT trước (D2)
Công cụ (ở nháp, không vào kho): Chromium + Playwright có sẵn, App thật dựng bằng esbuild từ `src/main.jsx`, POS giả (Giờ vàng đang chạy, quán mở, khách "chị Linh"
hạng Vàng 1.250 điểm, 1 món có nhu cầu), giờ máy đóng băng 30/10/2026 20:30, `reducedMotion: reduce`, chụp `animations: 'disabled'`.
Ba trạng thái × ba cỡ: `dn` (đã đăng nhập), `khach` (chưa đăng nhập), `mo` (màn mở) × 360 / 390 / 430 (cao 844).
Cây gốc = `git archive fd5d70e` (PHIEU). So từng điểm ảnh bằng canvas.

| Ảnh | Điểm ảnh khác (trước ↔ sau) | Ghi chú |
|---|---|---|
| dn_360 · dn_390 · dn_430 | 0 · 0 · 0 | dn_390: bỏ 47 điểm nhiễu = số giây đếm ngược Giờ vàng (1:29:59 ↔ 1:29:58) — hai lần chụp GỐC cũng lệch đúng chỗ đó |
| khach_360 · khach_390 · khach_430 | 0 · 0 · 0 | khach_390: bỏ 11 điểm nhiễu (đếm ngược) |
| mo_360 · mo_390 · mo_430 | 0 · 0 · 0 | bỏ 18 · 17 · 77 điểm nhiễu ở nét SVG mái đình (pathLength / dash) — gốc so gốc cũng lệch 5–65 điểm ở đúng các nét đó |

"Nhiễu" = điểm ảnh mà các lần chụp lặp lại (gốc lần 2, gốc lần 3, bản sau lần 2) đã khác lần chụp gốc 1 — không do code. Ngoài vùng nhiễu: **0 điểm khác** ở cả 9 ảnh.
Lần so đầu tiên bắt được 31 điểm lệch thật ở dòng "0 việc hôm nay ›" (gộp hai nút chữ thành một làm đổi khử răng cưa) → thêm `ndPhan()` giữ đúng cách tách nút chữ như JSX cũ → 0.
Ảnh: `so_anh/truoc/`, `so_anh/sau/`, `so_anh/lech/` (tô hồng chỗ lệch; còn lại mờ).

## 2. Khoá App ↔ khoá demo (`data-cms`) — màn đã chuyển
### Trang chủ (demo `#home`)
| Khối demo | Khoá demo | Khoá App | Ghi chú |
|---|---|---|---|
| Dòng dưới lời chào | `t:home.sub` | `home.sub` | demo "Tứ Quý Đường — Sức khỏe mỗi ngày" → App điền `{khauHieu}` từ `brand.slogan` (khẩu hiệu chủ quán chốt 30.10) |
| Video hướng dẫn | `t:guide.t`, `t:guide.s`, `v:guide.main`; SECS `home.guide` | — | chưa có khối (thẻ "Xem cách dùng app" chưa có video — việc sau) |
| Thẻ hội viên | SECS `home.member` | `hien.home.member`, `home.the.nhan`, `home.the.phu`, `home.logo`, `home.hang`, `home.diem`; 🔒 `home.hang.ten`, `home.diem.so` (POS) | demo không có data-cms cho chữ trên thẻ — App thêm khoá riêng |
| Thẻ mời (chưa đăng nhập) | — | `home.moi.t`, `home.moi.p`, `home.moi.nut` | demo không có (App có vì khách vãng lai — CLAUDE.md §5) |
| Ô Kế hoạch và nhắc việc | `t:home.cala`, `t:home.calb`; SECS `home.cal` | `home.cala`, `home.calb`, `hien.home.cal`, `home.cal.tag`, `home.cal.am`, `home.cal.nhuan`, `home.cal.tiet`, `home.cal.viec`, `home.cal.quaHan`; 🔒 `home.lich` (tự tính) | |
| Banner | `h.banner`, `t:home.bk`, `b:home.bb`; SECS `home.hb` | `home.banner` (ảnh), `home.bk`, `home.bb` (nút + đích), `home.bh` (dòng lớn), `hien.home.hb` | dòng lớn demo `#hbTitle` không có data-cms → App đặt `home.bh` |
| Banner Hôm nay | `img:today.bg`, `img:today.art`, `t:today.t`, `t:today.s`, `b:today.cta` | `today.bg`, `today.k`, `today.t`, `today.s`, `today.cta` | `img:today.art` (hình vẽ trên thẻ) chưa có khối — App dùng bản ảnh thật (KH-UI-5d) |
| Ô Giờ vàng | `t:home.gvk`; SECS `home.gv` | `home.gvk`, `home.gv.chua`, `home.gv.dang`, `home.gv.cuoi`, `hien.home.gv`; 🔒 `home.gv.so` (POS) | demo khoá `data-lock="gv"` → App mục khoá POS |
| Ô Trắc nghiệm | `t:home.qk`, `t:home.qh`; SECS `home.quiz` | `home.qk`, `home.qh`, `home.q.kq`, `home.q.xem`, `home.q.anh`, `hien.home.quiz` | |
| Chăm sóc theo nhu cầu | `t:home.needs`, `h.need:0…5`, `t:home.disc`; SECS `home.needs` | `home.needs`, `home.need` (danh sách: `ten` khoaCauTruc lọc món, `nhan` chữ hiện, `anh`), `home.disc`, `hien.home.needs` | demo 6 khoá `h.need:i` → App một danh sách |
| Bán chạy / Món nổi bật | `b:home.fmore`; SECS `home.feat` | `home.feat`, `home.feat.mon`, `home.fmore`, `hien.home.feat`; 🔒 `home.mon` (POS) | khối ẩn khi danh sách món trống (như trước) |
| Mời bạn bè | `t:home.refb`, `t:home.refs`; SECS `home.ref` | — | chưa có khối (Giới thiệu bạn bè sau khai trương — KH-GT-1) |
| Quán mở / đóng | — | `home.mo`; 🔒 `home.quan` (POS) | demo không có dòng này (KH-UI-3a) |

### Khung chung
| Khối demo | Khoá demo | Khoá App | Ghi chú |
|---|---|---|---|
| Màn mở: khẩu hiệu | `t:brand.slogan` | `brand.slogan` | macDinh = `KHAU_HIEU` (`noiDung/thuongHieu.js`) |
| Màn mở: Bỏ qua, âm thanh, logo | — | `splash.boQua`, `splash.am`, `splash.batAm`, `splash.logo`, `splash.chu`, `brand.ten` | demo không đặt khoá |
| Thanh tab | — | `tab.trangchu…taikhoan`, `tab.aria`, `tab.soMon` | demo xếp "chữ giao diện cố định"; chủ quán 10.11 "mở hết" → có khoá |
| Nút quay lại, nút QR | — | `khung.quayLai`, `khung.maQR` | |
| Tên tab trình duyệt | — | `tieuDe.mau` + `tieuDe.<trang>` (20 khoá) | |
| Câu báo lỗi chung | — | `loi.<code>` (8) + `loi.chung` | |
| Lời chào | — | `chao.dau`, `chao.sang/trua/chieu/toi`, `chao.ban` | buổi + xưng hô vẫn tự tính |
