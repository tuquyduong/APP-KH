# KH-THE-3 — Thẻ hội viên Vàng & Kim Cương: một khối thẻ dùng chung ở Ưu đãi, đơn thẻ, Chào mừng, Thanh toán thẻ, So sánh nhanh

<!-- Chat App KH soạn 15.11.2026. Việc THƯỜNG [Th] (giao diện, KHÔNG đổi tiền / báo giá / đặt đơn), **Sonnet** — chạy thẳng tới hết, không chờ duyệt kế hoạch. Hạn 19.11.
     Mở trên main sau #38 KH-THE-2 (e6a01ce hoặc mới hơn). Chạy SONG SONG với KH-SUA-1 (Sonnet — ô cách trả QR ở Thanh toán thẻ) và KH-ADMIN-1 (Opus — /admin) → xem mục Cấm.
     THIẾT KẾ CHỦ QUÁN DUYỆT 15.11: `viec/KH-THE-3/ban_thiet_ke.html` (bản cho máy — mở bằng trình duyệt từ thư mục kho để thấy ảnh) = Artifact "Thẻ Vàng & Kim Cương" bản 2
     (https://claude.ai/artifact/AcJNE4yBCgPzoCoTzMoq7x). Hai tệp hoạ tiết `viec/KH-THE-3/the-vang-van.svg`, `the-kc-mat.svg`. QĐ 15.11 trong thiet_ke/QUYET_DINH_APPKH.md.
     Đọc CLAUDE.md §4, §5, §6, §11. -->

## Mục tiêu
Mỗi hạng một tấm thẻ đúng tỉ lệ thẻ thật (85,6 × 54), dùng CHUNG một khối ở mọi chỗ trong App, ba cỡ (lớn / vừa / nhỏ): Vàng = lá vàng + vân khắc chìm + biểu tượng bốn mùa ẩn;
Kim Cương = xanh đêm + mặt cắt kim cương + chữ bạc + đốm lấp lánh; hạng khác (vd hạng thử) = thẻ hồng của quán. Đơn chỉ có thẻ thôi hiện các bước pha chế / ra quầy.

## Nghiệm thu

### A. Khối thẻ dùng chung
- A1 CSS mới `src/giaoDien/the_hoi_vien.css` = CHÉP NGUYÊN khối `/* ===== THẺ HỘI VIÊN … */` của `ban_thiet_ke.html` (mọi lớp bắt đầu `thv`; tên lớp này chưa có ở đâu trong
  `src/` — giữ tiền tố, KHÔNG đặt tên lớp trùng tệp css khác). Chỉ đổi đường dẫn ảnh: biểu tượng bốn mùa `/anh/the-vang-hoa-van.webp` (có sẵn); hoạ tiết `/anh/the-vang-van.svg`,
  `/anh/the-kc-mat.svg` (chép NGUYÊN hai tệp svg của viec/KH-THE-3 vào `public/anh/`); lớp nhiễu = đúng chuỗi `data:image/svg+xml` của demo (đã có ở `demo_1.css`). **Màu: chat đã
  kiểm khối này bằng đúng thuật toán K9 — 0 màu ngoài demo**; KHÔNG thêm màu khác. Giữ cỡ chữ px dự phòng đứng trước `cqw` (máy iOS 15 không hiểu `cqw`).
- A2 `src/theHoiVien.js` (hàm thuần): `mauThe(tenHang)` → bỏ dấu + chữ thường; có "kim cuong" → `'kc'`; có "vang" → `'vang'`; còn lại / rỗng → `'hong'` (POS thật: "Hạng vàng",
  "Kim Cương"; "Hạng Ruồi" là hạng thử). `nguoiTrenThe({ xung_ho, ten, sdt })` → "<Xưng hô> <Tên> · •••• <4 số cuối SĐT>" (xưng hô viết hoa chữ đầu theo `tenXungHo` có sẵn; thiếu tên →
  chỉ "•••• 1234"; thiếu SĐT → chỉ tên; thiếu cả hai → ''). `hanTrenThe(het_han, tang)` → `{ nhan, gia_tri }`: có hạn → "Hết hạn" + dd/mm/yyyy; `null` + quán tặng → "Quán tặng" +
  "Không thời hạn"; `null` → "Không thời hạn".
- A3 `src/components/TheHoiVien.jsx`: `{ hang, co = 'lon' | 'vua' | 'nho', khach?, het_han?, tang?, chieu? }` → markup như bản thiết kế (`.thv.<mẫu>` + `.thv-van`, `.thv-sang`,
  `.thv-than` …; Kim Cương thêm viên kim cương trước tên + `.thv-lap`). Logo = `ndAnh('home.logo')`; "TỨ QUÝ ĐƯỜNG" / "Thẻ hội viên" = mục `home.the.nhan` / `home.the.phu` có sẵn;
  mức giảm góc phải = "−{phanTram}%" (mục MỚI); nhãn "Hội viên" + `nhan` hạn = mục MỚI ở `src/noiDung/nd/theHang.js`; tên hạng, %, hạn = khoá `pos` (như `tier.pos`); tên + SĐT khách
  hiện như dữ liệu khách (không phải mục sửa). Cỡ `lon`: `role="img"` + `aria-label` (tên hạng, hạn), `tabIndex` không cần. Cỡ `vua` (64 px) / `nho` (56 px; 44 px ở So sánh nhanh): KHÔNG chữ,
  `aria-hidden`.
- A4 Ánh lướt `.thv-sang` CHỈ khi `chieu` (màn Chào mừng), chạy MỘT lần khi thẻ hiện; `prefers-reduced-motion: reduce` → không ánh lướt, không lấp lánh (CSS bản thiết kế đã có).
- A5 Mục danh mục mới khai NGAY trong `theHang.js` (luật CLAUDE.md §11), kể cả chữ bước "Thẻ kích hoạt" (B2) — nhóm màn có sẵn hoặc "Thẻ hội viên".

### B. Bốn chỗ (đối chiếu ảnh của bản thiết kế)
- B1 **Ưu đãi** (`src/pages/UuDai.jsx`, `TheHang`): trạng thái CÓ hạng (`co`, `sap` gồm hôm nay, `tang`): khối `.tier-card.the-ud` (và `l2`) thay bằng thẻ LỚN; NGAY dưới thẻ: chip mức
  giảm (giảm mọi đơn %, món đặc biệt % nếu có), bên phải "còn N ngày" (bán) / "Dành tặng khách thân thiết …" (tặng, giữ `DongTang`), dải đỏ "còn N ngày / hôm nay" + câu nhắc khi `sap`,
  rồi nút cũ (`ud.the.nutCo` / `nutGiaHan` / `nutTang`) dạng nút viền như bản thiết kế. Giữ ĐỦ chữ / mục / nút của từng trạng thái THE-2 — chỉ đổi khối nền thành thẻ và xếp lại.
  Trạng thái `chua` (chưa có hạng — thẻ mời mua) GIỮ NGUYÊN. Thẻ có tên + 4 số cuối SĐT của khách (`/toi`).
- B2 **Theo dõi đơn chỉ thẻ** (`src/pages/TheoDoiDon.jsx`, `laDonChiThe`): khi chờ trả / chưa xong, các bước = HAI bước: "Chờ thanh toán" → "Thẻ kích hoạt" (dòng phụ "Ngay khi
  tiền về, không cần ra quầy. Đơn đồ uống tiếp theo được giảm {phanTram}%." — không biết % thì bỏ câu sau); KHÔNG "Quán đang pha chế", KHÔNG "Sẵn sàng — mời bạn ra quầy nhận"
  (thêm nhánh cho đơn chỉ thẻ trong `buocTienTrinh` của `src/datDon.js` hoặc tham số — đơn đồ uống KHÔNG đổi). Dòng thẻ ở "Chi tiết đơn": thẻ NHỎ đúng mẫu (72 px) thay ô hộp xanh;
  tên = chữ App "Thẻ hội viên {hang}" + dòng phụ "{so} tháng" khi biết hạng (`hangCuaDon` / bản ghi gửi); không biết → `ten` POS bỏ biểu tượng đầu dòng (`tachBieuTuong` có sẵn),
  mẫu thẻ theo tên trong chuỗi. KHÔNG còn 🎟️. Đơn đồ uống: dòng món giữ nguyên.
- B3 **Chào mừng hội viên** (`ChaoMung` trong `TheoDoiDon.jsx`): thẻ LỚN (`chieu`, nghiêng −2,2°, tối đa 340 px) thay `MedHang` + `.points-card.cm-the`; hạn trên thẻ = ngày đọc từ
  `hanMoiThe(don)` ("Hạn mới: dd/mm/yyyy"; "không thời hạn" → Không thời hạn); đọc không được → thẻ bỏ dòng hạn và hiện nguyên chữ POS ngay dưới thẻ. Dưới tiêu đề + đoạn: nhãn nhỏ
  "Đơn {so} · {tong}" (mục `the.cm.don` / `the.cm.donSo` có sẵn). Nút "Đặt đồ uống ngay", "Về giỏ" giữ nguyên.
- B4 **Thẻ nhỏ:** Thanh toán thẻ — thẻ tóm tắt `.points-card.pc-mini.the-mini` → thẻ VỪA đúng mẫu của hạng đang mua (`ThanhToan.jsx` phần thẻ tóm tắt ~dòng 273 + luật `.the-mini` ở
  `thanh_toan.css`); So sánh nhanh (`HangThanhVien.jsx` đầu cột) — `MedHang` → thẻ NHỎ 44 px; cột "Thường" ô nét đứt như bản thiết kế. Trang chủ (thẻ điểm) GIỮ NGUYÊN.

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHTHE3.js` (chạy cả `KHONG_TRINH_DUYET=1`): `mauThe` ("Vàng", "Hạng vàng", "HẠNG VÀNG", "Kim Cương", "kim cuong", "Hạng Ruồi", "", null); `nguoiTrenThe`
  (đủ / thiếu tên / thiếu SĐT / thiếu cả hai; SĐT 10 số → 4 số cuối); `hanTrenThe` (có hạn, null + tặng, null); tĩnh: `the_hoi_vien.css` 0 màu ngoài demo (dùng hàm đọc màu của K9),
  có px trước `cqw`; Chromium 390: Ưu đãi Vàng / Kim Cương / quán tặng / sắp hết hạn → thẻ lớn đúng mẫu + chip + nút; `chua` không đổi; Theo dõi đơn thẻ chờ trả → đúng 2 bước, không chữ
  "pha chế" / "ra quầy", dòng thẻ có `.thv.mini`, không "🎟️"; đơn đồ uống vẫn 4 bước; Chào mừng → thẻ lớn có lớp chạy ánh lướt, `reducedMotion: 'reduce'` → `animation-name` none;
  Thanh toán thẻ → `.thv` cỡ vừa đúng mẫu hạng; So sánh nhanh → thẻ nhỏ đầu mỗi cột hạng. Đỏ trên gốc.
- C2 Bài CŨ đổi có chủ đích (`thu_KHTHE2.js` — `MedHang`, `.the-mini`, `.the-ud`, `.cm-the`, các bước; `thu_KHTHE1.js` nếu có) → sửa đúng ca (đỏ trên gốc, kể cả
  `KHONG_TRINH_DUYET=1`); KHÔNG dùng `## Bài thử cũ sửa`. Bài khác giữ xanh.
- C3 Đột biến tay (`viec/KH-THE-3/dot_bien_tay.js`) ≥ 5, mỗi cái ĐỎ: `mauThe` phân biệt hoa thường · Kim Cương dùng mẫu vàng · còn 🎟️ ở dòng thẻ · đơn chỉ thẻ còn bước pha chế ·
  ánh lướt vẫn chạy khi giảm chuyển động.
- C4 Ảnh 390 trước / sau → `viec/KH-THE-3/so_anh/`: Ưu đãi (Vàng, Kim Cương), Theo dõi đơn thẻ chờ trả, Chào mừng, Thanh toán thẻ, So sánh nhanh; đặt cạnh ảnh của
  `ban_thiet_ke.html` (mở bằng Chromium) — khác bản thiết kế chỗ nào thì ghi `trang_thai.md`. Máy POS giả phải phục vụ tệp `public/` (ảnh có logo, hoạ tiết).
- C5 Soát cuối: chạy mọi `cong_cu/thu_*.js` với `LUU_ANH_DIR` trên gốc và trên nhánh, so ảnh — màn NGOÀI phạm vi (Menu, Giỏ, Theo dõi đơn đồ uống, thẻ QR…) phải KHÔNG đổi.
- C6 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- C7 Chủ quán thử tay sau khi gộp: Ưu đãi (thẻ của mình), Hạng thành viên → Mua ngay → Thanh toán (thẻ vừa) → trả thử → Chào mừng (thẻ lớn, ánh lướt).

## Phạm vi
- viec/KH-THE-3/**
- src/components/TheHoiVien.jsx
- src/theHoiVien.js
- src/giaoDien/the_hoi_vien.css
- src/giaoDien/the_hang.css
- src/giaoDien/thanh_toan.css
- src/pages/UuDai.jsx
- src/pages/TheoDoiDon.jsx
- src/pages/HangThanhVien.jsx
- src/pages/ThanhToan.jsx
- src/datDon.js
- src/noiDung/nd/theHang.js
- src/noiDung/nd/donHang.js
- src/components/BieuTuong.jsx
- public/anh/the-vang-van.svg
- public/anh/the-kc-mat.svg
- cong_cu/thu_KHTHE3.js
- cong_cu/thu_*.js
- cong_cu/no_chu_cung.txt

## Ngân sách
~180 dòng app (css thẻ ~70 chép nguyên, component ~45, hàm thuần ~30, 4 chỗ ~35) + ~300 dòng thử. **Phương án đơn giản nhất đã xét:** MỘT component + MỘT tệp css chép từ bản
thiết kế, gắn vào 4 chỗ có sẵn; không đổi dữ liệu, không gọi cửa mới. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- **Song song với KH-SUA-1:** trong `ThanhToan.jsx` CHỈ sửa thẻ tóm tắt (`.the-mini`, ~dòng 273) — KHÔNG đụng ô cách trả QR (`the-qr` / `tt-qr`, ~dòng 282–285) và các luật
  `the-qr*` / `tt-qr*` của `thanh_toan.css`. **Song song với KH-ADMIN-1:** KHÔNG sửa `src/App.jsx`, `src/api.js`, `src/noiDung/nd.js`, `src/noiDung/nd/index.js`, `src/components/Chu.jsx`,
  `src/components/Man.jsx`, `src/main.jsx`.
- KHÔNG sửa `src/components/TheQR.jsx`, `src/giaoDien/the_qr.css`, `src/qrThuongHieu.js`, `src/quangCao.js`, `src/giaoDien/demo*.css`, Trang chủ, `thiet_ke/**`, `tu_chay/`, `.claude/`,
  `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG đổi logic tiền: giá, báo giá, đặt đơn, cách trả, ví, mã giảm. KHÔNG thêm màu ngoài khối CSS bản thiết kế (K9). KHÔNG xoá `MedHang` nếu còn chỗ khác dùng.
- Chỉ push `git push -u origin viec/KH-THE-3`. Không đụng `main`, không merge, không tạo PR.
