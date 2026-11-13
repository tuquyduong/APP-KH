# KH-THE-1 — kế hoạch (chờ chủ quán duyệt)

Nguồn đã đọc: phiếu; CLAUDE.md §4–§11; `src/gio.js`, `src/datDon.js`, `src/dungDatDon.js`, `src/giaHang.js`, `src/menuLoc.js`, `src/baoDonXong.js`, `src/hoaDon.js`,
`src/duongDan.js`, `src/kiemKhop/canTuPos.js`, `src/App.jsx`, `src/pages/{GioHang,ThanhToan,TheoDoiDon,Don,UuDai,TrangChu,Menu}.jsx`, `src/components/HoaDonKhach.jsx`,
`src/noiDung/nd/index.js`, `src/noiDung/nd.js`, demo `renderTier` (dòng 5306–5330, 5541–5565) + CSS `.ti-*` (1751–1766), `.pc-mini` (958–962).
Hợp đồng v13: CHƯA có bản từng byte (xem `## Câu hỏi` 1 của `trang_thai.md`) — các điểm v13 dưới đây theo tóm ý của agent phụ đọc trang, đối chiếu lại nguyên văn trước khi viết code.

## 0. Điều v13 quyết định thiết kế (đối chiếu lại khi có bản chép)
- Dòng thẻ trong `mon[]` của `POST /gio/bao-gia` / `POST /don`: `{ loai: "the", hang_id, so_thang }` (`so_luong` tuỳ chọn — App KHÔNG gửi, phiếu C4); thừa khoá → 400 `YEU_CAU_KHONG_HOP_LE`;
  dòng món KHÔNG có `loai`. Tối đa một dòng thẻ (`NHIEU_THE`). Giỏ chỉ thẻ được.
- Chặn 400: `HANG_CHI_CAP`, `GOI_HANG_KHONG_BAN`, `DA_CO_HANG_CAO_HON` (cùng hạng được — hạn cộng nối). Hạng mất → `DON_KHONG_HOP_LE`.
- Giỏ không có đồ uống: đặt MỌI giờ, trả xong `tien_trinh` = `xong` NGAY (QR: `cho_tra → xong`, ví: `POST /don` trả `xong`). Có đồ uống: giờ như cũ.
- `GET /hang` thêm `quyen_loi[]` (≤ 10 dòng × 120 ký tự, hoặc []). `GET /don/:ma`: `mon[]` dòng thẻ `loai: "the"`, `ma` null, `ten` POS dựng sẵn ("🎫 Thẻ hội viên …");
  `hoa_don[]` dòng `loai: "the"`, `ghi_chu` "Hạn mới: dd/mm/yyyy" / "Hạn mới: không thời hạn". Báo giá `dong[]` dòng thẻ có `loai`, `hang_id`, `so_thang`, `ma` null.
- `/toi.hang` = hạng cao nhất còn hạn hoặc null; `het_han` null = không thời hạn.

## 1. Các phần — phương án A / B, chọn

### P1. Giỏ (`src/gio.js`) — C1, C2
- **A (chọn):** giữ MỘT mảng `kh_gio`, thêm dạng dòng thẻ. `sach()` nhận hai dạng (món: 3 trường như cũ; thẻ: đúng `{ loai:'the', hang_id, so_thang }`, `so_thang` nguyên > 0,
  `hang_id` đúng kiểu id của `/hang` theo v13); dòng thẻ thứ hai trở đi khi đọc → bỏ. Hàm mới: `laThe(d)`, `themThe(gio, hangId, soThang)` → `{ gio, doi }` (THAY dòng thẻ cũ
  tại chỗ, `doi` = đã có thẻ khác → câu "Đã đổi sang…"), `coDoUong(gio)`, `boDongDaGui(gio, monGui)` (C4: món — trừ đúng `so_luong` đã gửi khỏi dòng cùng `ma` + `ghi_chu`, ≤ 0 thì bỏ;
  thẻ — bỏ dòng cùng `hang_id` + `so_thang`; dòng khách thêm sau giữ). `trangThaiDong(dong, ds, dsHang)` và `duocThanhToan(gio, ds, dsHang)` thêm tham số thứ ba (dòng thẻ:
  `{ hang, goi, conBan }` — còn bán = hạng có trong `/hang`, `chi_cap` không true, gói `so_thang` còn trong `goi[]`); gọi cũ hai tham số với giỏ chỉ món chạy y như cũ.
  `themMon` / `doiSoLuong` / `chenDong` bỏ qua dòng thẻ (so khớp `ma` — thẻ không có `ma`); Hoàn tác xoá thẻ dùng `themThe`. `demMon`: dòng thẻ đếm 1.
  ~45 dòng.
- B: khoá riêng `kh_gio_the` cho thẻ. Bỏ: thêm khoá phải sửa `src/luuMay.js` (phiếu Cấm), hai nguồn giỏ.

### P2. Đặt đơn (`src/datDon.js`) — C3, C4, C5, D2, D3
- **A (chọn):** `thanBaoGia` map từng dòng: thẻ → `{ loai, hang_id, so_thang }`, món → như cũ (không `loai`); giữ thứ tự. Mọi thứ khác (`thanDatDon`, khoá gửi, `tong_da_xem`,
  `guiDonAnToan`, `loaiLoi`, KHO_BAN…) KHÔNG đổi — 4 mã thẻ là 400 có `code` → `loaiLoi` đã ra `chua_tao` (không "chưa rõ"), chỉ thêm ca thử khoá điều đó.
  Thêm: `MA_THE` (4 mã — một chỗ), `chanDatGio(gh, gio)` = `coDoUong(gio) ? chanDat(gh) : ''` (`chanDat` GIỮ nguyên → bài cũ KHMUA1 B6 / KHND3e B1 không sửa);
  `docDon` giữ thêm `loai` của `mon[]`; `laDonChiThe(don)` (mọi `mon[]` là `loai:'the'`, ≥ 1 dòng); `hanMoiThe(don)` (chuỗi `ghi_chu` dòng `hoa_don[]` `loai:'the'`, NGUYÊN chữ POS).
  `monDatLai` đã bỏ dòng `ma` null (đếm `boQua`) → không đổi, chỉ thêm ca thử D3. ~25 dòng.
- B: tách tệp `datThe.js`. Bỏ: thân đơn phải ở MỘT chỗ (`datDon.js` đầu tệp ghi luật đó).

### P3. Giá / hạng (`src/giaHang.js`) — B2, D4, E1
- **A (chọn):** hàm thuần, KHÔNG gửi đi đâu: `goiBan(h)` (gói hợp lệ, hạng chỉ cấp → []), `hangBanDuoc(ds)` (hạng có giảm, không chỉ cấp, có gói), `giaRe(h)`,
  `tietKiem(goi, g)` (= giá gói đầu / số tháng × N − giá gói; ≤ 0 → null — chỉ hiển thị), `nutMua(dsHang, hangToi, h, soNgayCon)` → `{ kieu: 'mua'|'giaHan'|'mo', lyDo }`
  (chỉ cấp → mờ "Hạng dành tặng…"; không gói → "Chưa mở bán"; khách có hạng `thu_bac` cao hơn còn hạn → "Bạn đang ở hạng X…"; cùng hạng → gia hạn), `soNgayCon(hetHan, bayGio)`
  (ngày lịch theo giờ VN, đọc qua `mocTuChuoi` của `bayGio.js` — không `new Date(chuỗi)`), `nhacGiaHan(dsHang, hangToi, bayGio)` với hằng `NGAY_NHAC_GIA_HAN = 7` (MỘT chỗ).
  `thu_bac` của hạng khách tra từ `/hang` theo `id` (`/toi.hang` có thể không có `thu_bac`). ~45 dòng.

### P4. Đường dẫn (`src/duongDan.js`) — B1, C3
- **A (chọn):** dòng BANG mới `{ trang:'hang', mau:'/uudai/hang', tab:'uudai', tieuDe:'tieuDe.hang', cha:'/uudai', tv:['h'] }`; dòng `thanhtoan` thêm `tv:['chi']` + giá trị hợp lệ
  `['the']`. `docDuongDan` / `taoDuongDan` đọc / ghép truy vấn khai trong `tv` (một đoạn chung, như `tiep` hiện có) → `chuan` giữ `?h=` / `?chi=the` nên đăng nhập xong (`tiepHopLe`)
  quay về đúng hạng / đúng "chỉ thẻ"; tham số lạ bỏ. `/menu/the-thanh-vien` đã khớp `/menu/:nhom` — không thêm dòng. ~15 dòng.
- B: trang riêng `/thanhtoan/the`. Bỏ: thêm một trang trùng màn Thanh toán; phiếu ghi đúng `?chi=the`.

### P5. Màn mới `src/pages/HangThanhVien.jsx` + `src/giaoDien/the_hang.css` — B1–B3
- **A (chọn):** chép `renderTier` bản cuối: `.ti-card` (đã đăng nhập; lớp màu `l0` = chưa hạng, `l1` hạng bán, `l2` hạng chỉ cấp — map theo đúng ba nền demo), `.ti-tabs`
  (hạng có giảm theo `thu_bac`), `.ti-how`, `.ti-ben` (`quyen_loi[]` POS; rỗng → mẫu "Giảm {phanTram}% mọi đơn" + dòng nhóm đặc biệt), `.ti-buy` (mặc định gói dài nhất),
  `.checkout-btn` (Mua / Gia hạn / mờ + lý do), `.tl-note` (`tier.buynote`), `.ti-cmp` (hàng Giá, Cách có). Không làm "Điểm ×", "Giao nội thành", "Điều kiện lên Kim cương",
  dải demo (lý do (a)). Tab = `thay` `?h=`. Mua khi chưa đăng nhập → `/dangnhap?tiep=/uudai/hang?h=…`. Bấm Mua → `themThe` → thông báo, ở lại màn. CSS chép NGUYÊN dòng demo
  (K9). ~170 dòng JSX + ~25 dòng CSS.
- B: dựng lại khối thẻ hạng của Ưu đãi. Bỏ: demo `buycard` khác bố cục.

### P6. Giỏ / Thanh toán / Theo dõi / Lịch sử — C2–C5, D1–D3
- `GioHang.jsx`: `DongThe` (biểu tượng thẻ có sẵn trong demo / `BieuTuong.jsx`, tên "Thẻ hội viên <hạng> · N tháng", giá = `goi[].gia` để hình dung, nút xoá + Hoàn tác, KHÔNG ô số lượng /
  ghi chú, "không còn bán" như món); `duocThanhToan(gio, ds, dsHang)`; giỏ có thẻ + đồ uống → dòng ghi chú + nút "Trả thẻ trước để đơn này được giảm ›" → `/thanhtoan?chi=the`.
  Giỏ chỉ thẻ không cần menu (`coThe` không chờ `ds`). ~35 dòng.
- `ThanhToan.jsx`: nhận `chiThe`; `gioGui = chiThe ? gio.filter(laThe) : gio`, `maGiam` = '' khi chỉ thẻ; `chanDatGio(gh, gioGui)`; lỗi `MA_NGOAI_GIO` của POS vẫn chặn như cũ;
  lỗi `MA_THE` → `danhDauMon({ the: true, chu })` + `monLoi` (đánh dấu dòng thẻ, nút "Về giỏ"); khối "chưa rõ" vẽ tên dòng thẻ (hiện đọc `tenMon(m.ma)` — dòng thẻ không có `ma`).
  ~15 dòng.
- `App.jsx` (KHÔNG chạm dòng `<TienIch …>`, thêm ở chỗ khác): vẽ `HangThanhVien`; `themTheVaoGio`; `hangToi` lấy theo kho `cuaToi` (để `lamMoi` `/toi` đổi giá ngay — hiện chỉ đặt
  một lần lúc có phiên); `daTra`: `doiGio(boDongDaGui(gio, g.than.mon))` thay `doiGio([])`, mã giảm chỉ xoá khi đơn có gửi `ma_giam`, `lamMoi([cuaToi])` + `menu.taiLai`;
  `ThanhToan chiThe={r.tham.chi === 'the'}`; `TheoDoiDon conDoUong={coDoUong(gio)} veGio`; đích `hang` cho Trang chủ. ~20 dòng.
- `TheoDoiDon.jsx` (KHÔNG chạm dòng nút `tel:`): đơn `laDonChiThe` + `xong` → thay khối số đơn / các bước / "mời ra quầy" bằng "Đã lên hạng <hạng> · <hanMoiThe>"; còn đồ uống
  trong giỏ → nút "Về giỏ đặt đồ uống ›". ~12 dòng.
- `Don.jsx`, `HoaDonKhach.jsx`: dòng thẻ POS trả `hoa_don[]` loại `the` → nhóm "lạ" của `hoaDon.js` đã vẽ thành dòng thường; `mon[].ten` POS → vẽ sẵn. Dự kiến KHÔNG sửa
  (chỉ thêm ca thử D3); sửa chỉ khi ảnh so cho thấy lệch.
- `baoDonXong.js`: đơn chỉ thẻ đi `cho_tra → xong` (không qua `da_tra` / `dang_lam`) nên `xemDanhSach` đã không báo. Dự kiến KHÔNG sửa — thêm ca thử khoá điều đó
  (D2) + đột biến "báo ra quầy cho đơn chỉ thẻ".

### P7. Trang chủ, Ưu đãi, Menu — D4, E1, E2
- `TrangChu.jsx`: dòng nhắc dưới thẻ hội viên (khuôn mục nhắc "Hạng … hết hạn" của demo — `ic:'crown'`, `go:'buycard'`; đọc lại đúng khuôn khi làm), `ndHien('hien.nhacGiaHan')`,
  bấm → `/uudai/hang?h=<id>`; thêm `hang` vào bảng `DICH` của màn. ~12 dòng.
- `UuDai.jsx` `TheHang`: nút demo (dòng 2181 — "Quyền lợi & nâng hạng ›" khi có hạng, "Mua thẻ" khi chưa) → `/uudai/hang`. ~6 dòng.
- `Menu.jsx` + `src/components/TheHoiVien.jsx` (thẻ `.pc-mini` thu nhỏ, vàng dập): ô nhóm "Thẻ thành viên" (như ô Giờ vàng, slug `the-thanh-vien`) khi `hangBanDuoc` ≥ 1;
  phần cuối "Tất cả" có các thẻ; ô tìm KHÔNG ra thẻ (thẻ không nằm trong `ds` món). `MonO.jsx`, `menuLoc.js`: dự kiến không sửa. ~45 dòng.

### P8. Nội dung sửa được — F1
- Tệp mới `src/noiDung/nd/theHang.js` (khoá `tier.*` theo demo khi có, còn lại `hang.*`): mọi chữ / nút màn mới + `tieuDe.hang`; `hien.tier.*` cho từng khối; mục khoá `pos`
  (tên hạng, %, gói, giá, quyền lợi, hạn, tên dòng thẻ đơn) và `tutinh` (tiết kiệm, số ngày còn). `index.js`: MỘT dòng nhóm + đích `['hang', 'Ưu đãi · Hạng thành viên']`.
  Chữ mới của Giỏ / Theo dõi → `donHang.js`; Menu → `menu.js`; Trang chủ (`hien.nhacGiaHan`, câu nhắc) → `trangChu.js`; Ưu đãi (nút) → `taiKhoan.js`. Không đổi khoá cũ. ~120 dòng.
- K10: tệp mới 0 chữ viết thẳng; tệp cũ không tăng (chữ mới chỉ qua `nd()`).

### P9. Hợp đồng — A1, A2
- A1: chép `viec/KH-THE-1/hop_dong_v13.md` (chủ quán đặt) → `thiet_ke/HOP_DONG_API_KH.md`, `cmp` + sha256. A2: `canTuPos.js` thêm `hang_v13` (`data[].quyen_loi`) +
  `the_gio` (`POST /gio/bao-gia` / `POST /don` dòng thẻ, `co: true`, `viec_pos: 'KH-THE-1'`); dòng `vi_lich_su` ("mua thẻ hạng") bỏ chữ "mua thẻ hạng" nếu bài KHKHOP1 đòi.

**Ước lượng:** app ~640 dòng (ngân sách ~700), thử ~600 dòng. Vượt 1,5 lần thì dừng giải thích.

## 2. Ca thử — ánh xạ 1-1 với `## Nghiệm thu`
Bài MỚI `cong_cu/thu_KHTHE1.js` (POS giả dựng từ hợp đồng v13; mã lỗi đọc thẳng từ `thiet_ke/HOP_DONG_API_KH.md`; phần Chromium in "BỎ QUA" khi không có Playwright / `KHONG_TRINH_DUYET=1`).

| Mục | Ca (tĩnh trừ khi ghi "CR" = Chromium 390) | Đỏ trên gốc? |
|---|---|---|
| A1 | `cmp` từng byte bản chép ↔ `viec/KH-THE-1/hop_dong_v13.md`; sha256 đầu `490976b0c438b8b4`; PHIEN_BAN 13 | đỏ (v11) |
| A2 | `canTuPos` có `quyen_loi` + dòng thẻ `co:true`, `viec_pos 'KH-THE-1'`; `thu_KHKHOP1.js` xanh | đỏ |
| B1 | `docDuongDan('/uudai/hang?h=2')` → trang `hang`, cha `/uudai`, `canDN` false, `chuan` giữ `?h=2`; `tiepHopLe` giữ truy vấn; tham số lạ bỏ; CR: mở thẳng / tải lại / đổi tab không thêm lịch sử / Back về Ưu đãi | đỏ |
| B2 | `nutMua`: chỉ cấp → mờ; không gói → "Chưa mở bán"; hạng khách `thu_bac` cao hơn còn hạn → mờ; cùng hạng → "Gia hạn"; `tietKiem` (1 tháng: không hiện; 3 tháng: đúng số; ≤ 0 → null); gói mặc định = dài nhất; quyền lợi rỗng → mẫu `{phanTram}`; CR: chưa / đã đăng nhập (thẻ "Hạng hiện tại" có / không), đang xem hạng chỉ cấp | đỏ |
| B3 | CR: bấm Mua → ở lại màn, thông báo "Đã thêm Thẻ …", viên số tab Giỏ +1; chưa đăng nhập → /dangnhap?tiep=… rồi quay lại đúng `?h=` | đỏ |
| C1 | `themThe` thêm / THAY (+ `doi`); đọc bản cũ chỉ món y như cũ; dòng thẻ hỏng (thiếu khoá, `so_thang` 0, thừa `ma`) → bỏ; hai dòng thẻ trong kho → giữ một; dòng món vẫn 3 trường | đỏ |
| C2 | `duocThanhToan` false khi hạng mất / thành chỉ cấp / bỏ gói; true khi còn bán; giỏ chỉ món gọi hai tham số như cũ; CR: dòng thẻ không ô số lượng / ghi chú, xoá + Hoàn tác | đỏ |
| C3 | thân "chỉ thẻ" chỉ có dòng thẻ, KHÔNG `ma_giam`; `boDongDaGui` sau đơn chỉ thẻ → đồ uống còn nguyên; CR: giỏ thẻ + ly → nút "Trả thẻ trước" → trả ví giả → quay lại giỏ còn ly, giá ly theo hạng mới (POS giả đổi `/toi.hang`) | đỏ |
| C4 | thân dòng thẻ đúng 3 khoá; dòng món không `loai`; thứ tự giỏ giữ; khoá gửi / `tong_da_xem` / `cach_tra` / `pin` như cũ (so thân với bản dựng từ code gốc cho giỏ chỉ món); `boDongDaGui` không xoá dòng khách thêm sau; đơn cả giỏ → giỏ rỗng | đỏ |
| C5 | `chanDatGio(ngoài giờ, giỏ chỉ thẻ)` = ''; `(ngoài giờ, thẻ + ly)` ≠ ''; `chanDat` cũ không đổi; 4 mã thẻ → `loaiLoi` = `chua_tao` (không "chưa rõ"); CR: lỗi POS mã thẻ → dòng thẻ đánh dấu, hiện nguyên `error` | đỏ (chanDatGio) |
| C6 | CR: POS giả trả `dong[]` / `giam[]` / `tong` có dòng thẻ → bảng tiền hiện đúng số POS (App không tự trừ) | xanh (chỉ canh) |
| D1 | CR: trả xong → thẻ hạng Ưu đãi / Trang chủ / màn Hạng hiện hạng mới không tải lại (POS giả đổi `/toi` sau khi trả) | đỏ |
| D2 | `laDonChiThe`, `hanMoiThe`; `xemDanhSach` đơn `cho_tra → xong` không vào `choBao`; CR: Theo dõi đơn chỉ thẻ `xong` → "Đã lên hạng …", không "mời ra quầy", có "Về giỏ đặt đồ uống ›" khi giỏ còn ly | đỏ (laDonChiThe) |
| D3 | `monDatLai` bỏ dòng thẻ (`ma` null → `boQua`); CR: Chi tiết đơn vẽ dòng thẻ POS | xanh (chỉ canh) |
| D4 | `nhacGiaHan`: còn 7 ngày → nhắc, 8 → không, 0 → "hết hạn hôm nay", `het_han` null → không, chỉ cấp → không; đếm theo `bay_gio` POS; CR: Trang chủ có dòng nhắc, bấm → `/uudai/hang?h=` | đỏ |
| E1 | `hangBanDuoc` (bỏ chỉ cấp / 0% / không gói); `timMon` không ra thẻ; CR: ô "Thẻ thành viên", `/menu/the-thanh-vien`, thẻ trong "Tất cả", bấm → màn Hạng | đỏ |
| E2 | CR: Ưu đãi có nút "Quyền lợi & nâng hạng" (có hạng) / "Mua thẻ" (chưa) → `/uudai/hang` | đỏ |
| F1 | `kiemDanhMuc(DANH_MUC)` rỗng lỗi; mọi khoá mới có trong danh mục (đọc mã nguồn `nd('…')` / `Chu k=` của tệp mới); `DICH` có `hang`; Trang chủ mở được đích `hang` | đỏ |
| F2 | chính bài này; chạy được với `KHONG_TRINH_DUYET=1` | — |
| F3 | `npm test` toàn bộ bài cũ (MUA-1/1b/1c, BAO-1, TT-1, SOHD-1, HD-1, NHANH-1…) XANH không sửa ca. Dự kiến KHÔNG sửa bài cũ: `chanDat` giữ, đơn cả giỏ vẫn dọn rỗng | — |
| F4 | `viec/KH-THE-1/dot_bien_tay.js` ≥ 8 đột biến (gửi thẻ kèm `ma`; gửi `ma_giam` khi trả thẻ trước; dọn cả giỏ khi trả thẻ trước; cho hai dòng thẻ; giỏ chỉ thẻ bị chặn ngoài giờ; mã thẻ thành "chưa rõ"; báo "ra quầy" cho đơn chỉ thẻ; đặt lại thêm thẻ) — mỗi cái làm `thu_KHTHE1` ĐỎ | — |
| F5 | ảnh 360/390/430 demo ↔ app các màn kể trong phiếu → `so_anh/` + `doi_chieu_demo.md`; Ưu đãi / Giỏ / Thanh toán cũ trước ↔ sau = 0 điểm khác (trừ nút E2) | — |
| F6 | `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) | — |
| F7 | ghi 4 thao tác thử tay vào `trang_thai.md` | — |

Đụng tiền — ca hai người / hai lần cùng bấm: "Trả thẻ trước" bấm hai lần liền → `khoaGui` chỉ một `POST /don` (CR); tab A trả thẻ trước, tab B đang Thanh toán cả giỏ → bản ghi `kh_don_gui`
chặn như cũ (`chanBoiBanGhi`, ca có sẵn của MUA-1c giữ xanh + một ca CR mới cho giỏ có thẻ).

## 3. Đường song song phải canh
- Mọi chỗ đọc dòng giỏ theo `ma`: `GioHang` (khoá React `${ma}|${ghi_chu}` → dòng thẻ dùng `the|hang_id|so_thang`), `ThanhToan` khối "chưa rõ" (`tenMon(m.ma)`), `xuLyLoi` `MA_MON`
  (`dl.ma`), `monLoi.ma` ở `GioHang`, `datLai` (`themMon`), `chenDong`.
- Mọi chỗ dọn giỏ: `daTra` (App), `dangXuat` (`datGio([])` — giữ: đăng xuất xoá hết), `docLaiGio`.
- `hangToi` đọc ở: `dungNguCanhGia`, `GioHang` (giá hình dung), `BangTien` (tên dòng giảm hạng), `bacThang` (Trang món) — đổi nguồn `hangToi` sang kho `cuaToi` phải giữ đúng
  `{ id, ten }` và vẫn ẩn khi chưa `daBiet`.
- `canDangNhap` + `tiepHopLe`: truy vấn mới phải đi qua `/dangnhap?tiep=` nguyên vẹn.
- `TrangChu` bảng `DICH` cục bộ (mọi mã của `DICH` danh mục) — thêm `hang`.

## 4. Luồng hợp lệ KHÔNG được chặn (K5)
- Giỏ chỉ món: thân, báo giá, đặt, dọn giỏ, chặn ngoài giờ — y như cũ (bài cũ xanh không sửa).
- Giỏ chỉ thẻ: đặt được khi quán đóng; khách vãng lai xem màn Hạng; gia hạn cùng hạng được; khách có hạng thấp hơn mua hạng cao được.
- Giỏ thẻ + ly: nút "Thanh toán" thường vẫn trả cả giỏ một lần (gửi `ma_giam` như cũ — xem Câu hỏi 2).
- Bản `kh_gio` cũ của khách (chỉ món) đọc ra đủ.

## 5. Ngoài phạm vi / không làm
- Không sửa `api.js`, `luuMay.js`, `dungDatDon.js`, `hoaDon.js`, `dinhDang.js`, `thiet_ke/**` (trừ hợp đồng), `no_chu_cung.txt`. Cần thì ghi `## Câu hỏi`.
- Báo giá lỗi mã thẻ (trước khi đặt): `dungBaoGia` chỉ trả câu lỗi (không `code`) → Giỏ hiện câu POS như hiện nay; đánh dấu dòng thẻ chỉ từ lỗi `POST /don` (như món lỗi).

## 6. Soát kế hoạch (agent phụ chỉ đọc, 13.11) — đã sửa kế hoạch theo
1. **Phạm vi:** không ra ngoài. Sửa: dòng vẽ `HangThanhVien` đặt SAU dòng `UuDai` (App.jsx ~225), không trong khối 219–223 cạnh dòng `<TienIch …>`. Lấy lại `/hang` sau khi trả
   (D1 "nếu cần"): hàm nạp `/hang` riêng trong `src/heThong.js` (ngoài Phạm vi) → KHÔNG cần: mua thẻ không đổi `/hang`, hạng mới đến từ `/toi` (`lamMoi([cuaToi])`).
   Biểu tượng thẻ: `i-card` / `i-ticket` đã có sẵn — không thêm.
2. **Ngắn hơn:** GIỮ cách `daTra` xoá mã giảm như cũ (bỏ ý "chỉ xoá khi có gửi `ma_giam`" — phiếu không đòi, đổi hành vi đơn đồ uống).
3. **Ca thử:** C6 sửa thành ĐỎ trên gốc (gốc không dựng được dòng thẻ). Để đột biến F4 ĐỎ cả khi `KHONG_TRINH_DUYET=1`, phần quyết định đưa vào hàm thuần thử tĩnh được, JSX chỉ gọi:
   `thanChiThe(gio)` (datDon.js — giỏ con chỉ thẻ, KHÔNG `ma_giam`), `boDongDaGui` (gio.js — `daTra` gọi), `laLoiThe(e)` (datDon.js — `MA_THE`, ThanhToan đánh dấu dòng thẻ);
   kèm ca tĩnh đọc mã nguồn `ThanhToan.jsx` / `App.jsx` có gọi đúng các hàm đó (như bài KHBAO1 A3). C3 / D1 / E2 phần dây nối vẫn có ca Chromium (chạy thật ở máy, ghi `trang_thai.md`).
4. **Đường song song bổ sung:** `ThanhToan.jsx` dòng `coThe = duocThanhToan(gio, ds)` + `dungBaoGia(gio, …)` → truyền `dsHang`, giỏ chỉ thẻ không chờ menu; nhánh `MA_MON` (`dl.ma`) giữ
   nguyên, lỗi thẻ đi nhánh `laLoiThe` riêng; khoá React dòng thẻ; `ra()` của `duongDan.js` phải giữ truy vấn `tv` trong `chuan` (đăng nhập quay về đúng). `BaoDonXong.jsx` không
   đổi (`DANG_CHAY` không gồm `cho_tra`). Có sẵn từ trước: `daTra` chỉ chạy khi màn Theo dõi đơn đang mở — ghi `## Phát hiện`, không sửa trong việc này.
