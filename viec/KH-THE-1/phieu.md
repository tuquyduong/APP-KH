# KH-THE-1 — Bán thẻ hạng trên App: màn Hạng thành viên (theo demo `buycard`), nhóm "Thẻ thành viên" ở Menu, nút Mua ở Ưu đãi, Trang chủ nhắc gia hạn, thẻ chung giỏ + "trả thẻ trước"

<!-- Chat App KH soạn 12.11.2026. Việc TIỀN [T] (đụng luồng giỏ / đặt đơn), **Opus** — CÓ "Chờ duyệt kế hoạch" (bước 3: ghi `ke_hoach.md`, push, DỪNG hỏi; chủ quán
     dán cho chat duyệt rồi gõ "duyệt" thì chạy thẳng tới hết). Hạn 16.11. Mở trên main SAU KHI KH-ND-3c, KH-UI-5f đã gộp. Chạy SONG SONG với KH-ND-3d (Sonnet,
     Kế hoạch / tiện ích) — xem mục Cấm: KHÔNG đụng tệp / dòng của 3d.
     Nguồn: QĐ chủ quán 07–08.11 (`thiet_ke/QUYET_DINH_APPKH.md` mục 08.11 "Thẻ hạng bán trên App", 10.11 voucher), thư `thiet_ke/trao_doi/YEU_CAU_APPKH_GUI_POS_07112026.md`
     mục 1, hợp đồng POS **v13** "Ghi chú v13 — mua thẻ hạng trên App". Demo: màn `buycard` (`renderTier` bản cuối — phần "5. Hạng thành viên: sửa được"), thẻ hội viên thu nhỏ
     `.pc-mini`, lớp `.ti-*`. Đọc CLAUDE.md §4, §5, §8, §11; `LUAT_XAY_APP.md` §5. -->

**Chờ duyệt kế hoạch:** viết `viec/KH-THE-1/ke_hoach.md`, commit, push, rồi DỪNG ở bước 3 của `/lam-viec`.

## Mục tiêu
Khách mua thẻ hạng NGAY trên App như một sản phẩm: xem các hạng + quyền lợi + gói, bấm Mua → thẻ vào giỏ (chung với đồ uống), trả một lần bằng ví / QR như đơn thường;
trả xong POS tự lên hạng, App hiện hạng mới ngay. Muốn đơn đồ uống được giảm theo hạng mới thì App cho "trả thẻ trước" bằng một nút. App KHÔNG tự tính giá, KHÔNG tự cấp hạng.

## Nghiệm thu

### A. Hợp đồng v13 (POS đã gộp KH-THE-1)
- A1 `thiet_ke/HOP_DONG_API_KH.md` = NGUYÊN VĂN `HOP_DONG_API_KH.md` của kho POS (công khai: `https://github.com/pos-tuquyduong/pos-tuquyduong`) ở commit
  `162a9080b0a754f4433e544009ec0893dc358f5f` (PHIEN_BAN 13; sha256 bắt đầu `490976b0c438b8b4`) — tải về nháp, `cmp` từng byte. Không tải được → `## Câu hỏi`, dừng.
- A2 `src/kiemKhop/canTuPos.js`: thêm dòng `quyen_loi` của `GET /hang` + dòng thẻ của `POST /gio/bao-gia` / `POST /don` (`co: true`, `viec_pos: 'KH-THE-1'`) — `thu_KHKHOP1.js` xanh.

### B. Màn "Hạng thành viên" — `/uudai/hang` (theo demo `buycard`)
- B1 Đường dẫn mới trong `src/duongDan.js`: `/uudai/hang` (con của Ưu đãi, Back về Ưu đãi), hạng đang xem ở tham số `?h=<id>` (đổi tab = `thay`, không thêm lịch sử); mở thẳng /
  tải lại đúng. **Khách chưa đăng nhập vẫn xem được** (giá từng hạng mở cho khách vãng lai — CLAUDE.md §10); chỉ nút Mua cần đăng nhập (đăng nhập xong quay về đúng màn này).
- B2 Bố cục chép từ demo `renderTier` (lớp `.ti-card`, `.ti-tabs`, `.ti-how`, `.ti-ben`, `.ti-buy`, `.checkout-btn`, `.tl-note`, `.ti-cmp` — CSS chép nguyên từ demo vào tệp mới
  `src/giaoDien/the_hang.css`, K9):
  - Thẻ "Hạng hiện tại" (đã đăng nhập): tên hạng `/toi.hang` (null → "Thường" + "Mua thẻ <hạng bán đầu tiên> để nhận giá tốt"), dòng hạn: `het_han` → "Thẻ còn hạn tới dd/mm/yyyy",
    `null` → "Không thời hạn" (chữ có sẵn), hạng chỉ cấp → "Hạng dành tặng khách thân thiết". Chưa đăng nhập → không có thẻ này.
  - Tab các hạng: hạng có giảm của `/hang` (`hangCoGiam`, xếp `thu_bac`) — không có tab "Thường".
  - "Cách có": hạng `chi_cap` → "Hạng dành tặng khách thân thiết"; hạng bán → "Mua thẻ 1 tháng hoặc 3 tháng" ghép từ `goi[]` (mẫu chữ có `{goi}`).
  - Quyền lợi: `quyen_loi[]` của POS (mục khoá `pos`); rỗng → một dòng "Giảm {phanTram}% mọi đơn" (mẫu chữ, số từ POS; có `phan_tram_nhom_dac_biet` > 0 thì thêm dòng nhóm đặc biệt).
  - Gói (`.ti-buy`): mỗi `goi[]` một nút "N tháng / giá / Tiết kiệm X" (X = giá gói đầu / số tháng × N − giá gói, > 0 mới hiện — App tự tính, chỉ hiển thị); mặc định chọn gói dài nhất.
  - Nút chính: "Mua thẻ <hạng> N tháng" (khách chưa có hạng này) · "Gia hạn <hạng> N tháng" (đang có đúng hạng này — hạn cộng nối). Nút MỜ + lý do khi: hạng `chi_cap`; khách
    đang có hạng `thu_bac` CAO hơn còn hạn ("Bạn đang ở hạng <X> — đã có ưu đãi cao hơn"); hạng không có gói ("Chưa mở bán"). POS vẫn là người quyết (mã lỗi ở C5).
  - Dòng ghi chú dưới nút: chép demo `tier.buynote`.
  - "So sánh nhanh" (`.ti-cmp`): cột "Thường" + các hạng có giảm; hàng "Giá" (`phan_tram` POS: "Giá thường" / "−10%"), hàng "Cách có" ("Mặc định" / "Mua thẻ" / "Quán tặng").
    Hàng "Điểm ×…", "Giao nội thành" của demo, khối "Điều kiện lên Kim cương" và dải "Demo · xem như khách hạng": POS chưa có dữ liệu → KHÔNG làm (lý do (a), ghi `doi_chieu_demo.md`).
- B3 Bấm Mua / Gia hạn → thêm dòng thẻ vào giỏ (C1), ở lại màn, báo "Đã thêm Thẻ <hạng> N tháng vào giỏ" (giống thêm món — không nhảy sang giỏ, QĐ 31.10); viên số món ở tab Giỏ tăng.

### C. Thẻ chung giỏ, đặt đơn
- C1 Giỏ (`src/gio.js`, khoá `kh_gio`): thêm dạng dòng thẻ `{ loai: 'the', hang_id, so_thang }` (KHÔNG giá, không ghi chú; số lượng luôn 1). Tối đa MỘT dòng thẻ: thêm thẻ khác
  → THAY dòng cũ, báo "Đã đổi sang Thẻ …". Dòng món giữ nguyên 3 trường. Bản lưu cũ (chỉ dòng món) đọc như cũ; dòng thẻ hỏng → bỏ.
- C2 Màn Giỏ: dòng thẻ hiện "Thẻ hội viên <hạng> · N tháng" (biểu tượng thẻ của demo), giá hình dung = `goi[].gia` của `/hang`, nút xoá + Hoàn tác như món, KHÔNG có ô số lượng /
  ghi chú. Hạng / gói không còn bán (mất khỏi `/hang`, thành `chi_cap`, bỏ gói) → đánh dấu "không còn bán" như món và chặn Thanh toán (`duocThanhToan`).
- C3 **Trả thẻ trước** (QĐ 08.11 "muốn giảm ngay → App gợi ý mua thẻ trước, đơn riêng"): giỏ có CẢ thẻ và đồ uống → dưới giỏ hiện dòng "Đồ uống trong đơn này tính theo hạng
  hiện tại; hạng mới áp từ đơn sau." + nút "Trả thẻ trước để đơn này được giảm ›" → `/thanhtoan?chi=the`: Thanh toán CHỈ dòng thẻ (không gửi `ma_giam` — mã giảm không áp lên
  thẻ, giữ mã cho đơn đồ uống). Trả xong: bỏ đúng dòng thẻ khỏi giỏ, đồ uống còn nguyên, `lamMoi` `/toi` + menu → quay lại giỏ thấy giá theo hạng mới. Nút thường "Thanh toán"
  vẫn trả cả giỏ một lần (đồ uống theo hạng đang có — POS tính).
- C4 Thân báo giá / đặt đơn (`src/datDon.js` `thanBaoGia` / `thanDatDon`): dòng thẻ gửi ĐÚNG `{ loai: "the", hang_id, so_thang }` (không `ma` / `ghi_chu` / giá / `so_luong`);
  dòng món KHÔNG có khoá `loai`; giữ thứ tự giỏ. Mọi luật cũ GIỮ NGUYÊN: khoá gửi, `tong_da_xem`, cách trả `qr` / `vi` / `vi_qr`, PIN, "chưa rõ", gửi lại cùng khoá, KHO_BAN,
  huỷ đơn chưa trả. Dọn giỏ sau khi trả: bỏ ĐÚNG các dòng đã gửi trong đơn (theo bản ghi `kh_don_gui`), không xoá dòng khách thêm sau (với đơn cả giỏ kết quả như cũ: giỏ rỗng).
- C5 Giờ: giỏ CHỈ có thẻ (không đồ uống) đặt được MỌI giờ — `chanDat` / khoá "quán đóng" của App không chặn giỏ chỉ thẻ (POS cũng không chặn — v13 "Giờ"). Giỏ có đồ uống: như cũ.
  Lỗi POS mới (`NHIEU_THE`, `HANG_CHI_CAP`, `GOI_HANG_KHONG_BAN`, `DA_CO_HANG_CAO_HON`): hiện nguyên `error`, đánh dấu dòng thẻ trong giỏ (như món lỗi), không coi là "chưa rõ".
- C6 Hiện số: dòng thẻ / `giam[]` / `tong` lấy ĐÚNG báo giá của POS (mã giảm có áp lên thẻ hay không là việc POS — App không tự trừ).

### D. Sau khi trả, đơn, Lịch sử
- D1 Trả xong (ví ngay, QR khi tiền về) → `lamMoi` `/toi` (và `/hang` nếu cần) → thẻ Hạng ở Ưu đãi / Trang chủ / màn Hạng thành viên hiện hạng mới + hạn mới không cần tải lại.
- D2 Theo dõi đơn: đơn CHỈ thẻ (mọi dòng `mon[]` là `loai: "the"`) đã trả (`xong`) → thay các bước pha chế / "mời ra quầy" bằng "Đã lên hạng <hạng> · hạn mới …" (`hoa_don[]` dòng thẻ
  `ghi_chu`); KHÔNG báo "Đơn đã sẵn sàng — mời bạn ra quầy" cho đơn chỉ thẻ (kiểm `src/baoDonXong.js` — đơn nhảy `cho_tra → xong` không báo; có ca thử). Đơn thẻ + đồ uống: như đơn thường.
  Đơn "trả thẻ trước" xong → nút "Về giỏ đặt đồ uống ›".
- D3 Chi tiết đơn / Lịch sử: dòng thẻ vẽ từ `hoa_don[]` / `mon[]` như POS trả (`ten` POS có biểu tượng); "Đặt lại" BỎ QUA dòng thẻ (`ma` null) — không thêm thẻ vào giỏ.
- D4 Nhắc gia hạn ở Trang chủ: khách có hạng bán được (`chi_cap` false) mà `het_han` còn ≤ 7 ngày (đếm theo `bay_gio` POS — CLAUDE.md §6; số 7 là hằng có tên ở MỘT chỗ) →
  dòng nhắc "Thẻ <hạng> còn N ngày — Gia hạn ›" ngay dưới thẻ hạng (khuôn có sẵn của demo) → `/uudai/hang?h=<id>`; còn 0 ngày → "hết hạn hôm nay". Có mục `hien.nhacGiaHan` để ẩn ở /admin.

### E. Menu nhóm "Thẻ thành viên" + Ưu đãi nút Mua
- E1 Menu: ô nhóm "Thẻ thành viên" (như ô Giờ vàng — nhóm App tự ghép từ `/hang`, đường dẫn `/menu/the-thanh-vien`) khi có ≥ 1 hạng bán được; mỗi hạng bán được một thẻ
  "Thẻ <hạng> — từ <giá gói rẻ nhất>" dùng thiết kế thẻ hội viên thu nhỏ của demo (`.pc-mini`, vàng dập) → bấm mở `/uudai/hang?h=<id>`. Có trong "Tất cả" (phần cuối);
  tìm kiếm món KHÔNG ra thẻ. Không ảnh hưởng nhóm món của POS / Giờ vàng.
- E2 Ưu đãi (`TheHang`): thêm nút theo demo ("Quyền lợi & nâng hạng" khi đã có hạng · "Mua thẻ" khi chưa) → `/uudai/hang`; dòng gói "1 tháng — 100.000đ…" giữ.

### F. Nội dung sửa được + kiểm
- F1 **Sửa được ở /admin** (CLAUDE.md §11): mọi chữ / nút mới khai mục trong tệp nhóm MỚI `src/noiDung/nd/theHang.js` (thêm MỘT dòng vào `src/noiDung/nd/index.js`; khoá theo demo
  `tier.*` khi demo có); khối mới có `hien.<khối>`; phần POS (tên hạng, %, gói, giá, quyền lợi, hạn) → mục khoá `pos`; số tiết kiệm / số ngày còn → mục khoá `tutinh`. Thêm đích
  nút `['hang', 'Ưu đãi · Hạng thành viên']` vào `DICH` (banner / nút có thể trỏ tới màn mới; màn có nút phải mở được đích này). `trang_thai.md` liệt kê khoá đã thêm.
- F2 Bài MỚI `cong_cu/thu_KHTHE1.js` (chạy cả `KHONG_TRINH_DUYET=1`; POS giả dựng TỪ hợp đồng v13, mã lỗi đọc thẳng từ `thiet_ke/HOP_DONG_API_KH.md`): giỏ C1 (thêm / thay /
  bản cũ / dòng hỏng), C2 (không còn bán chặn), C3 (thân chỉ thẻ, không `ma_giam`; trả xong chỉ bỏ dòng thẻ), C4 (thân dòng thẻ đúng 3 khoá, dòng món không `loai`, thứ tự; dọn
  giỏ bỏ đúng dòng đã gửi), C5 (giỏ chỉ thẻ không bị chặn ngoài giờ; giỏ có đồ uống vẫn chặn; 4 mã lỗi mới đánh dấu dòng thẻ, không "chưa rõ"), D2 (đơn chỉ thẻ không báo "ra
  quầy"), D3 (đặt lại bỏ thẻ), D4 (7 / 8 ngày, 0 ngày, `het_han` null, `chi_cap`), B2 (nút mờ theo `thu_bac`, gia hạn cùng hạng, tiết kiệm), E1. Chromium (390): màn Hạng thành viên
  chưa / đã đăng nhập, Mua → giỏ có dòng thẻ, Thanh toán ví giả → Theo dõi đơn "Đã lên hạng", Trang chủ nhắc gia hạn, Menu nhóm thẻ.
- F3 Bài thử CŨ của luồng đơn (MUA-1 / 1b / 1c, BAO-1, TT-1, SOHD-1, HD-1, NHANH-1…) GIỮ XANH không sửa ca — đơn đồ uống không đổi hành vi. Bài cũ phải sửa vì hành vi đổi có chủ
  đích (dọn giỏ C4, chanDat C5) → sửa đúng ca, ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`; KHÔNG dùng `## Bài thử cũ sửa`.
- F4 Đột biến tay (`viec/KH-THE-1/dot_bien_tay.js`, như KH-UI-5f) ≥ 8 cái, mỗi cái ĐỎ: gửi thẻ kèm `ma`, gửi `ma_giam` khi trả thẻ trước, dọn cả giỏ khi trả thẻ trước, cho hai dòng
  thẻ, giỏ chỉ thẻ bị chặn ngoài giờ, mã lỗi thẻ thành "chưa rõ", báo "ra quầy" cho đơn chỉ thẻ, đặt lại thêm thẻ.
- F5 Ảnh 360 / 390 / 430 demo ↔ app: màn Hạng thành viên (chưa có hạng / có hạng Vàng / đang xem Kim cương chỉ cấp), giỏ có thẻ + đồ uống, Theo dõi đơn chỉ thẻ, Menu nhóm thẻ,
  Trang chủ nhắc gia hạn → `viec/KH-THE-1/so_anh/` + `doi_chieu_demo.md` (khác vì (a) ghi rõ). Màn cũ không đổi: so trước / sau Ưu đãi, Giỏ, Thanh toán (đơn đồ uống) = 0 điểm khác
  (trừ đúng chỗ thêm nút E2).
- F6 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tệp nào tăng (tệp mới 0); ghi `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng,
  không gạch đầu dòng) TRƯỚC `/ra-soat`.
- F7 Chủ quán thử tay (chủ quán có thể mua thử gói rẻ rồi huỷ / hoàn ở quầy): (1) Ưu đãi → Quyền lợi & nâng hạng → chọn gói → Mua → giỏ có thẻ; (2) trả bằng ví → Theo dõi đơn
  "Đã lên hạng", Trang chủ hiện hạng mới; (3) giỏ có thẻ + 1 ly → "Trả thẻ trước" → trả xong ly còn trong giỏ với giá hạng mới; (4) Menu → Thẻ thành viên.

## Phạm vi
- viec/KH-THE-1/**
- thiet_ke/HOP_DONG_API_KH.md
- src/kiemKhop/canTuPos.js
- src/noiDung/nd/theHang.js
- src/noiDung/nd/index.js
- src/noiDung/nd/taiKhoan.js
- src/noiDung/nd/menu.js
- src/noiDung/nd/donHang.js
- src/noiDung/nd/trangChu.js
- src/pages/HangThanhVien.jsx
- src/pages/UuDai.jsx
- src/pages/Menu.jsx
- src/pages/GioHang.jsx
- src/pages/ThanhToan.jsx
- src/pages/TheoDoiDon.jsx
- src/pages/Don.jsx
- src/pages/TrangChu.jsx
- src/components/TheHoiVien.jsx
- src/components/MonO.jsx
- src/components/HoaDonKhach.jsx
- src/App.jsx
- src/duongDan.js
- src/gio.js
- src/datDon.js
- src/giaHang.js
- src/menuLoc.js
- src/baoDonXong.js
- src/giaoDien/the_hang.css
- cong_cu/thu_KHTHE1.js
- cong_cu/thu_*.js

## Ngân sách
~700 dòng app (màn mới ~250, giỏ / đặt đơn ~150, Menu / Ưu đãi / Trang chủ / Theo dõi ~150, danh mục ~150) + ~550 dòng thử. **Phương án đơn giản nhất đã xét:** thẻ là MỘT dạng
dòng giỏ mới đi qua ĐÚNG luồng đặt đơn có sẵn (không đường tiền mới, không cửa mới); "trả thẻ trước" = Thanh toán với giỏ con chỉ dòng thẻ + dọn đúng dòng đã gửi; màn mới chép
demo, số liệu chỉ từ `/hang` + `/toi`. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không (dòng giỏ trên máy `kh_gio` thêm dạng dòng thẻ — bản cũ đọc được)

## Thư viện mới
không

## Cấm
- KHÔNG tự tính giá thẻ / tổng / giảm để gửi đi; KHÔNG tự cấp hạng; KHÔNG gọi cửa ngoài hợp đồng v13; KHÔNG đổi luật "chưa rõ" / khoá gửi / PIN / gửi lại / huỷ của đơn đồ uống.
- **Tránh tệp / dòng của KH-ND-3d (đang chạy song song):** KHÔNG sửa dòng render `<TienIch …>` trong `src/App.jsx` (thêm màn mới ở chỗ khác, cách xa dòng đó), dòng nút gọi `tel:`
  trong `src/pages/TheoDoiDon.jsx`, `src/dinhDang.js`, `src/components/GiaMon.jsx`, mọi tệp Kế hoạch / tiện ích / lịch / văn khấn, `src/noiDung/nd/keHoach.js`, `src/noiDung/nd/tienIch.js`,
  `cong_cu/no_chu_cung.txt` (việc này không làm tăng / giảm tệp nào có nợ — cần sửa thì ghi `## Câu hỏi`).
- `src/noiDung/nd/index.js` CHỈ thêm dòng nhóm `theHang.js` + đích `hang` trong `DICH`. Các tệp nhóm khác (`taiKhoan.js`, `menu.js`, `donHang.js`, `trangChu.js`) CHỈ thêm mục mới /
  sửa mục của khối mình đụng; không đổi khoá cũ.
- KHÔNG sửa `src/api.js` (thân yêu cầu dựng ở `datDon.js`), `src/luuMay.js` (không khoá mới), `src/main.jsx`, `public/**`, `index.html` (biểu tượng thiếu → dùng biểu tượng có sẵn,
  ghi `## Phát hiện`), `thiet_ke/**` ngoài `HOP_DONG_API_KH.md`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- Màu / phông / bóng chỉ lấy từ demo (K9); không vẽ biểu tượng mới.
- Chỉ push `git push -u origin viec/KH-THE-1`. Không đụng `main`, không merge, không tạo PR.
