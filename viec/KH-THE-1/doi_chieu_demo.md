# KH-THE-1 — đối chiếu demo ↔ app

Ảnh: `viec/KH-THE-1/so_anh/<rộng>_<màn>_{demo,app,lech}.png` (360 / 390 / 430 × 844; 390 chụp ×2). Công cụ: `viec/KH-THE-1/chup_anh.js` (Chromium + Playwright có sẵn,
POS giả với dữ liệu mẫu của demo: Vàng 10 % gói 79.000 / 199.000, Kim cương 15 % chỉ cấp, quyền lợi chép `TIER_INFO`). Lý do khác: (a) dữ liệu POS chưa có / khối việc sau ·
(b) chữ / số mẫu của demo · (c) chưa có giỏ / đặt đơn · (d) màn rộng · (e) khẩu hiệu.

## Màn Hạng thành viên `/uudai/hang` (demo `#buycard`, `renderTier` bản "5. Hạng thành viên: sửa được")
Khác ~4 % điểm ảnh (`*_hang_chuahang_lech.png`, `*_hang_vang_lech.png`).

| Khối demo | App | Khác gì · lý do |
|---|---|---|
| Đầu màn: nút lùi, "Hạng thành viên", "Hạng càng cao, giá càng tốt" | như demo (`tier.tieuDe`, `tier.sub`) | — |
| `.ti-card` Hạng hiện tại (l0 / l1 / l2) | như demo; chỉ khi đã đăng nhập; dòng phụ: chưa hạng "Mua thẻ <hạng bán đầu> để nhận giá tốt ngay hôm nay", có hạn "Thẻ còn hạn tới dd/mm/yyyy", không hạn "Không thời hạn", chỉ cấp "Hạng dành tặng khách thân thiết" | Demo "Giữ hạng tới … · xét lại mỗi 6 tháng" (hạng Kim cương xét tiêu chí) — POS chưa có xét hạng (a) |
| `.ti-tabs` Thường · Vàng · Kim cương | chỉ các hạng có giảm của `/hang` (Vàng · Kim cương) | KHÔNG tab "Thường" — phiếu B2 chốt (hạng Thường không có gì để xem / mua; cột Thường vẫn có ở So sánh nhanh) |
| `.ti-how` | "Mua thẻ 1 tháng hoặc 3 tháng" ghép từ `goi[]`; chỉ cấp "Hạng dành tặng khách thân thiết" | Demo Kim cương "Không bán · đạt tiêu chí thì app tự nâng hạng" — POS chưa có tiêu chí (a) |
| `.ti-ben` quyền lợi, mỗi dòng một biểu tượng riêng (award, star, gift…) | `quyen_loi[]` của POS (v13), mỗi dòng biểu tượng ✓ (cách demo vẽ khi thiếu biểu tượng: `(IC[i] \|\| ['check'])`) | POS chỉ gửi chữ, không biểu tượng từng dòng (a). POS chưa nhập → "Giảm {%}% mọi đơn" (+ nhóm đặc biệt) |
| `.ti-buy` gói 1 / 3 tháng, Tiết kiệm | như demo (mặc định gói dài nhất; tiết kiệm App tự tính — khoá `tier.tutinh`) | — |
| `.checkout-btn` "Mua thẻ Vàng 3 tháng" / "Gia hạn …" | như demo; bấm → dòng thẻ vào giỏ (demo: toast "Thanh toán … (demo)") | Hạng chỉ cấp / hạng thấp hơn hạng đang có / chưa gói: nút MỜ + lý do dưới nút (phiếu B2) — demo ẩn gói + một dòng `tl-note` |
| `.tl-note` `tier.buynote` | như demo | — |
| Khối "Điều kiện lên Kim cương" (`.ti-crit`) | KHÔNG làm | POS chưa có dữ liệu tiêu chí (a) — phiếu B2 |
| `.ti-cmp` So sánh nhanh: Giá · Điểm · Giao nội thành · Cách có | Giá · Cách có ("Mặc định" / "Mua thẻ" / "Quán tặng") | Hàng "Điểm ×…", "Giao nội thành" — POS chưa có (a) (`*_hang_chuahang_duoi_lech.png` ~31 % vì bảng ngắn hơn hai hàng + không khối tiêu chí phía trên ở tab Kim cương) |
| `.ti-demo` "Demo · xem như khách hạng" | KHÔNG làm | dải của demo, không phải giao diện khách (a) |
| Nền `aurora-bg` của `#buycard` | nền chung `.screen` của app | như các màn con khác của app |

## Ưu đãi (demo `#rewards` thẻ hạng) — nút E2
`*_uudai_nut_*`: nút "Quyền lợi & nâng hạng ›" (có hạng) / "Mua thẻ ›" (chưa) — kiểu bản vá thẻ vàng dập của demo (`.tier-card button{ background:rgba(255,255,255,.55); color:#4A2410 }`).
Các khối khác của demo rewards (banner "Ưu đãi tháng này", Sưu tập Tứ Quý…) vẫn như KH-HANG-2 / KH-ND-3c (không đổi ở việc này).
Trước ↔ sau (`*_cu_uudai_{truoc,sau,lech}.png`): ~12,5 % — CHỈ do nút mới (cao ~40 px) đẩy các khối dưới xuống; phần trên nút trùng khít.

## Giỏ hàng (demo `#cart`) — dòng thẻ + "Trả thẻ trước"
| Khối | App | Khác gì · lý do |
|---|---|---|
| Dòng món `.cart-item` | dòng thẻ dùng cùng khuôn: biểu tượng thẻ có sẵn (`m-card`), "Thẻ hội viên Vàng · 3 tháng", giá gói; KHÔNG ô số lượng | Demo không có thẻ trong giỏ (c: bán thẻ là việc mới) — khuôn dòng giỏ của demo |
| Dưới các dòng | "Đồ uống trong đơn này tính theo hạng hiện tại; hạng mới áp từ đơn sau." (`.care-disclaimer`) + nút `.ghost-btn` "Trả thẻ trước để đơn này được giảm ›" | Khối mới theo QĐ 08.11 (không có trong demo) — khuôn chữ phụ / nút viền của demo |
Trước ↔ sau với giỏ chỉ đồ uống (`*_cu_gio_*`): **0 % điểm khác**.

## Thanh toán (đơn đồ uống) — không đổi
`*_cu_thanhtoan_*`: **0 % điểm khác** trước ↔ sau. Thanh toán "chỉ thẻ" (`/thanhtoan?chi=the`) dùng đúng màn này, chỉ đổi phần giỏ gửi.

## Theo dõi đơn — đơn chỉ thẻ (demo `#tracking`)
`*_theodoi_chithe_*`: khối `.nt-state on` "Đã lên hạng Vàng · Hạn mới: 13/02/2027" thay số đơn to + các bước pha chế + "mời bạn ra quầy" (đơn không pha — v13); tờ hoá đơn POS
vẽ như cũ. Demo chỉ có theo dõi đơn đồ uống (c).

## Menu — nhóm "Thẻ thành viên" (demo `#catalog`)
`*_menu_the_*`: ô nhóm như ô nhóm món (biểu tượng `p-member` có sẵn), thẻ hội viên thu nhỏ `.points-card.pc-mini` (vàng dập, khuôn thẻ Trang chủ) "Thẻ Vàng — từ 79.000đ".
Demo không có nhóm thẻ ở Menu (QĐ 08.11: thẻ là sản phẩm) — chỉ dùng khuôn sẵn có.

## Trang chủ — nhắc gia hạn (demo `#home`)
`*_trangchu_nhac_*`: dòng `.nt-state` (biểu tượng cảnh báo) "Thẻ Vàng còn 2 ngày — Gia hạn ›" ngay dưới hàng thẻ hội viên + Kế hoạch. Demo đặt lời nhắc "Hạng Vàng hết hạn ·
Gia hạn để giữ ưu đãi" trong danh sách nhắc (offs, `ic:'crown'`) — app chưa có danh sách nhắc đó ở Trang chủ (a: thuộc KH-TB-1) nên dùng khuôn dòng báo `.nt-state` của demo.
Phần khác của ảnh (lời chào, banner…) là dữ liệu mẫu khác demo (b), không đổi ở việc này.

## Mọi thứ mới có khoá + `data-nd`, sửa được ở /admin (CLAUDE.md §11)
Khoá mới — `src/noiDung/nd/theHang.js`: `tieuDe.hang`, `tier.tieuDe`, `tier.sub`, `tier.hienTai`, `tier.thuong`, `tier.moiMua`, `tier.conHan`, `tier.how`, `tier.thang`, `tier.hoac`,
`tier.ben.giam`, `tier.ben.db`, `tier.tietKiem`, `tier.nut.mua`, `tier.nut.giaHan`, `tier.nut.mo`, `tier.mo.caoHon`, `tier.mo.chuaBan`, `tier.buynote`, `tier.daThem`, `tier.daDoi`,
`tier.cmp`, `tier.cmp.gia`, `tier.cmp.giaThuong`, `tier.cmp.giam`, `tier.cmp.cach`, `tier.cmp.macDinh`, `tier.cmp.muaThe`, `tier.cmp.quanTang`, `hien.tier.card`, `hien.tier.ben`,
`hien.tier.note`, `hien.tier.cmp`, 🔒 `tier.pos`, 🔒 `tier.tutinh` · `menu.js`: `gio.the.ten`, `gio.the.chung`, `gio.the.khongBan`, `gio.the.xoaAria`, `gio.truocThe.chu`,
`gio.truocThe.nut`, `hien.gio.truocThe`, 🔒 `gio.the`, `menu.the.ten`, `menu.the.tu`, `hien.menu.the`, 🔒 `menu.the.pos` · `donHang.js`: `td.the.xong`, `td.the.veGio`, 🔒 `td.the.han`,
🔒 `tt.the` · `trangChu.js`: `home.nhac.giaHan`, `home.nhac.homNay`, 🔒 `home.nhac.so`, `hien.nhacGiaHan` · `taiKhoan.js`: `ud.hang.nutCo`, `ud.hang.nutMua` · đích nút `hang`
("Ưu đãi · Hạng thành viên") trong `DICH`. Dùng lại khoá cũ: `ud.hang.tang`, `ud.hang.khongHan`, `home.logo`, `home.the.nhan`, `home.the.phu`.
Kiểm: `kiemDanhMuc` toàn danh mục + ca F1 của `thu_KHTHE1.js` (mọi khoá các màn đụng tới có trong danh mục).
