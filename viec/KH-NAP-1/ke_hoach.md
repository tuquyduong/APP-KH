# KH-NAP-1 — kế hoạch (chờ chủ quán duyệt)

Đã đọc (16.11): phiếu, hợp đồng v17 (Ghi chú v17 + khối máy đọc dòng 370–371), `src/api.js`, `src/gio.js`, `src/datDon.js`, `src/dungDatDon.js`,
`src/pages/ThanhToan.jsx` (khuôn `KhoiThe`), `src/pages/TheoDoiDon.jsx` (`ChaoMung`, `CacBuoc`, `DongThe`), `src/pages/Don.jsx`, `src/pages/UuDai.jsx` (khối
`wallet-row` dòng 208–215), `src/pages/TaiKhoan.jsx` (`.acc-q` dòng 47–51), `src/duongDan.js`, `src/App.jsx`, `src/duLieuKhach.js`, `src/kiemKhop/canTuPos.js`,
`src/components/BangNoi.jsx`, `src/components/BieuTuong.jsx`, demo `.wallet-hero` / `.tx-item` (demo dòng 408–426), `mau_de_xuat.js`, bài `thu_KHTHE2.js`, `thu_KHMUA1b.js` (`dungMay`),
`thu_KHKHOP1.js`, bộ kiểm K8 / K9.

## Câu hỏi (cần chủ quán trả lời cùng lúc duyệt)
1. **Phạm vi thiếu `src/pages/KiemKhop.jsx`.** A1 bắt khai `/goi-nap`, `/vi` vào `canTuPos.js` (cửa đã có trong hợp đồng ⇒ phải `co: true`, vì
   `thu_KHKHOP1.js` dòng 48–49 đỏ nếu `co: false` mà cửa có trong hợp đồng). Nhưng `thu_KHKHOP1.js` dòng 55–58 đòi trang `/admin/kiemkhop`
   (`src/pages/KiemKhop.jsx` dòng 11, bảng `GOI`) có hàm gọi cho MỌI cửa GET `co: true` → thiếu hai dòng `'GET /goi-nap': layGoiNap, 'GET /vi': () => layVi(1)` là đỏ.
   Đề nghị: THÊM `src/pages/KiemKhop.jsx` vào `## Phạm vi` (chỉ thêm 2 khoá vào `GOI` + 1 import). Không cho → phương án B: không khai A1 ở `canTuPos.js`
   (trái nghiệm thu A1) — máy không tự chọn.
2. **"Đơn nạp không có Đặt lại" ở Lịch sử đơn.** `GET /don` (danh sách, hợp đồng dòng 42 / 372) KHÔNG có trường cho biết đơn là đơn nạp (`mon[].loai` chỉ có ở
   `GET /don/:ma`); đoán theo chữ `mon_dau` là bịa. Đề nghị: Chi tiết đơn vốn không có nút "Đặt lại" (đã đúng); ở danh sách giữ nút, bấm vào đơn chỉ nạp →
   `monDatLai` bỏ dòng nạp (không đếm "không còn bán") → App báo câu sẵn có `app.donRong` "Đơn này không có món để đặt lại". Muốn ẩn hẳn nút ở danh sách thì
   cần POS thêm trường (vd `data[].chi_nap`) — máy soạn `thiet_ke/trao_doi/YEU_CAU_APPKH_GUI_POS_16112026.md`? (thiet_ke/** đang ở mục Cấm — nên chỉ ghi Phát hiện).
3. **Ô `tuy` trong ThanhToan.jsx.** Dòng `const tuy = cheDoThe ? KHONG_MA : { maGiam };` phải đổi điều kiện thành `cheDoThe || cheDoNap` (giá trị của đơn đồ uống
   `{ maGiam }` GIỮ NGUYÊN). Phiếu cấm "đụng biến `tuy` của đơn đồ uống" — máy hiểu là không đổi giá trị / luật của đơn đồ uống; đổi điều kiện này là được? (Cách
   không chạm dòng đó: viết `const tuyNap = …` riêng rồi đổi CHỖ DÙNG `tuy` ở 3 nơi — nhiều dòng hơn, đụng nhiều hơn → không chọn.)

4. **Truyền lệnh "mở Ví" xuống màn (agent soát bắt).** Lối vào Ví ở `UuDaiToi` / `TaiKhoan` / nút "Xem ví" của Đã nạp cần prop từ App: phải thêm prop vào
   các dòng CŨ `<UuDai …>` (App.jsx:260), `<TaiKhoan …>` (262), `<TheoDoiDon …>` (255), và sửa chữ ký `UuDai` (UuDai.jsx:239, 247), `UuDaiToi` (201) + import
   (dòng 4) — ngoài khối `wallet-row` / ngoài "chỉ THÊM dòng". Không có cách khác: một `dungDuongDan()` thứ hai trong màn không báo được App (src/dieuHuong.js:22–26
   `pushState` không phát `popstate`). Máy hiểu "nút mở Ví" trong mục Cấm của App.jsx là cho phép đúng việc thêm prop này (không đổi prop cũ nào) — đúng không?

## Phương án theo phần (chọn = ★)

### P1. Cửa POS + kho gói nạp (A1)
- ★ A: `api.js` thêm `'/goi-nap'` vào `CUA_CONG_KHAI`, `layGoiNap`, `layVi` (3 dòng). `duLieuKhach.js` thêm `export const cuaGoiNap = taoCua(layGoiNap)` — KHÔNG vào
  `CUA_KHACH` (thông tin công khai, không xoá khi đăng xuất); Ưu đãi, Ví, Thanh toán nạp cùng đọc bằng `dungCua(cuaGoiNap)` (một lần gọi, làm mới sau 5 phút) (2 dòng).
  `canTuPos.js` THÊM 2 dòng `goi_nap`, `vi_v17` (`co: true`, `viec_pos: 'KH-NAP-1'`); dòng cũ `vi_lich_su` (P3b, "chưa chốt tên cửa") giữ nguyên.
  ~7 dòng · 3 tệp (+ KiemKhop.jsx 2 dòng nếu Câu hỏi 1 được duyệt). Rủi ro: thấp.
- B: mỗi màn tự `dungTai(layGoiNap)` → 3 lần gọi khi đi Ưu đãi → Ví → Thanh toán. Ngắn hơn 1 dòng nhưng gọi trùng, chip Ưu đãi / nút Ví nháy. Bỏ.

### P2. Hàm thuần nạp (A2, A3)
- ★ A: `gio.js` +`laNap`, `dongNapTuDuongDan({ goi })` (dùng lại `SO_NGUYEN`), `coDoUong` loại cả nạp, `trangThaiDong(dong, ds, dsHang, dsGoi)` nhánh nạp →
  `{ goi, conBan }`, `duocThanhToan(…, dsGoi)` truyền thêm (≈8 dòng). `datDon.js`: `dongGui` nhánh nạp `{ loai: 'nap', ma_goi }`; `dungViCho` loại cả nạp;
  `laDonChiNap`; `MA_NAP` + `laLoiNap` (3 mã v17, khuôn `MA_THE`); `BUOC.nap_vao_vi` + nhánh `chiNap` trong `buocTienTrinh` (khuôn `chiThe`); `thamTaoMaMoi` nhánh nạp
  → `{ trang: 'napvi', tham: { goi } }`; `monDatLai` bỏ dòng nạp (≈18 dòng). KHÔNG chạm `thanBaoGia`, `docBaoGia`, `tenGiam`.
  `src/viTien.js` mới: `thuongGoi`, `nhanLoaiVi`, `dongVi`, `khoaDongVi` (dòng lịch sử để bỏ trùng khi "Xem thêm") (≈25 dòng).
- B: đặt `thuongGoi` / `nhanLoaiVi` vào `gio.js` — trộn giỏ với ví, trái "mỗi phần một việc". Bỏ.

### P3. Lối vào (B1)
- ★ A: `UuDai.jsx` chỉ khối `wallet-row`: ô ví thành nút (`role="button"`, `tabIndex`, Enter qua `bam()` có sẵn) → `moVi`; chip `.vt-nap` "+ Nạp tiền" khi
  `cuaGoiNap` có ≥ 1 gói → `moNap` (mở Ví KÈM bảng gói: `/uudai/vi?nap=1`), `stopPropagation`. Cân chiều cao: `.wallet-row .wallet-box` giữ `flex:1`, thêm lớp
  `vt-o` (`display:flex; flex-direction:column; justify-content:center`) cho CẢ hai ô. `TaiKhoan.jsx`: ô Ví `{...bam(moVi)}` (1 dòng). `App.jsx` thêm prop
  `moVi` / `moNap` vào hai dòng `<UuDai>` / `<TaiKhoan>` (hai dòng này không thuộc danh sách cấm). ≈12 dòng.
- B: chip chỉ là hình trong nút (bấm = vào Ví) — ít hơn 2 dòng nhưng phiếu nói "nút nhỏ + Nạp tiền"; khách bấm "Nạp" mà không thấy bảng gói thì thêm 1 thao tác. Bỏ.

### P4. Màn Ví + bảng gói (B2, B3)
- ★ A: MỘT tệp `src/pages/ViTien.jsx` (~110 dòng) gồm màn Ví + `BangGoi` (dùng `BangNoi` có sẵn). Bảng gói mở/đóng theo đường dẫn: `/uudai/vi?nap=1`
  (`tv: { nap: ['1'] }`) — nút Back của điện thoại đóng bảng, tải lại vẫn mở, chip ở Ưu đãi đi thẳng tới. Đóng (✕ / vuốt / nền) → `thay('/uudai/vi')`.
  Lịch sử: trang 1 `GET /vi?trang=1` khi mở màn (`dungTai`), "Xem thêm" khuôn `LichSuDon` (Don.jsx): nối trang sau, bỏ dòng trùng bằng `khoaDongVi`
  (ngày + loại + số + mã đơn + ghi chú — `/vi` không có id), trang 1 đổi → bỏ các trang sau. Dòng `tx-item` của demo; biểu tượng ô: vào / ra / điều chỉnh;
  dòng có `ma_don` → `di('/taikhoan/donhang/<ma>')`. `src/giaoDien/vi_tien.css` (~45 dòng, mọi lớp `vt-`, CHỈ màu demo: ô số dư
  `linear-gradient(135deg,var(--pink-deep),var(--forest))` = #7A2647 → #B23D6B; "xanh" = `--mint-dark` #217A5C trên nền `--mint`; số "−" màu `--ink`).
  Biểu tượng ví: `BieuTuong.jsx` thêm `wallet` vào `ICO_NHUNG` (chép NGUYÊN `<symbol id="i-wallet">` của demo — index.html chưa có, ngoài Phạm vi).
- B: bảng gói là state trong màn (không đường dẫn) — ít hơn ~4 dòng, nhưng chip Ưu đãi phải truyền cờ qua App, Back thoát cả màn Ví khi bảng đang mở. Bỏ.

### P5. Thanh toán nạp (B4)
- ★ A: CHÍNH `ThanhToan.jsx` thêm prop `nap` (khuôn `the`): `cheDoNap = nap !== undefined`; `gio = cheDoThe ? … : cheDoNap ? (nap ? [nap] : []) : gioCa`;
  `tuy` (Câu hỏi 3); `coThe = duocThanhToan(gio, ds, dsHang, dsGoi)`; `khongBan` nạp = `!nap || (đã có /goi-nap && !coThe)` → không báo giá; lỗi `laLoiNap` →
  `datMonLoi(true)` + lời POS + nút "Về Ví"; nút đặt khoá `nap.tt.nut` "Quét QR · {tong}"; phần đầu `KhoiNap` (khuôn `KhoiThe`: `card the-tom` + ô `vt-nap-ic`,
  dòng xanh, `tt-qr` khoá, `the-khoa`) và `BangTienNap` (Tiền nạp / Tổng cộng / Vào ví sau khi trả) — KHÔNG dùng / sửa `BangTien` của GioHang.jsx.
  Mọi luật khoá gửi, `kh_don_gui`, chưa rõ, đơn chờ, trần lượt, C7: không đụng (đi chung). `App.jsx` THÊM một dòng `<ThanhToan nap={dongNapTuDuongDan(r.tham)} …>`
  cho trang `napvi`; `duongDan.js` THÊM 2 dòng BANG (`vi`, `napvi`). ≈45 dòng.
- B: màn Thanh toán nạp riêng → đường đặt đơn thứ hai (phiếu cấm). Bỏ.

### P6. Theo dõi đơn nạp + Đã nạp (B5)
- ★ A: `TheoDoiDon.jsx`: `chiNap = laDonChiNap(don)`; `CacBuoc` nhận `chiNap`; đơn chỉ nạp ẩn số đơn ra quầy / `td.xong` / `td.giuApp` / nút gọi quán;
  `tt === 'xong'` → `DaNap` (khuôn `ChaoMung`, ô `cm-dau` có sẵn): ô số dư mới (`dungCua(cuaToi)` — `daTra` đã `lamMoi([cuaToi])`), số nạp đọc `layVi(1)` dòng
  `ma_don === ma && loai === 'nap'` (không thấy → tiêu đề chung, không số), "Gồm {thuong} tiền thưởng…" bỏ vế khi 0; nút "Đặt đồ uống ngay" (`moMenu`) + "Xem ví"
  (`moVi` — THÊM prop ở dòng `<TheoDoiDon>` của App.jsx). Dòng nạp trong danh sách món: tên `tachBieuTuong(ten).chu`, ô `IcoVe wallet` thay ô hộp. Khối `hien.nap.dn`
  ẩn / hiện (khuôn `hien.the.cm`). `Don.jsx` (Chi tiết đơn, nhánh không hoá đơn): tên dòng nạp bỏ biểu tượng đầu, không "1 ×". ≈45 dòng.
  Tiền về muộn mà POS không tạo đơn: đơn không `xong` ⇒ không vào `DaNap`; câu `cauTienVe` đang có hiện như cũ (không sửa).
- B: màn "Đã nạp" riêng có đường dẫn — thêm trang, thêm điều hướng sau trả. Bỏ.

### P7. Danh mục nội dung (B6)
- ★ `src/noiDung/nd/viTien.js` mới (~60 mục: chữ `vt.*`, `nap.tt.*`, `nap.td.*`, `nap.dn.*`, `tieuDe.vi`, `tieuDe.napvi`, `hien.nap.dn`; mục khoá `pos` cho tên gói /
  `ghi_chu` / số tiền / số dư) + MỘT dòng ở `nd/index.js`. K10 tệp mới = 0.

**Tổng ước lượng:** app ≈ 300 dòng (ngân sách ~280; vượt chủ yếu do danh mục chữ ~60 mục ở tệp nd — không phải code luồng) + thử ≈ 420 dòng. Dưới 1,5 lần.

## Ca thử ↔ nghiệm thu (bài mới `cong_cu/thu_KHNAP1.js`; ĐỎ trên gốc vì các hàm / tệp / màn chưa có)
| Nghiệm thu | Ca |
|---|---|
| A1 | tĩnh: `'/goi-nap'` trong `CUA_CONG_KHAI`; `layGoiNap`/`layVi` đúng đường; `canTuPos` có 2 mục mới đúng trường v17; K8 (bộ kiểm) xanh. Chromium: `GET /goi-nap` KHÔNG có `Authorization` |
| A2 | thuần: `dongNapTuDuongDan` ('5' → dòng; '0', '-1', 'a', '', '1.5', thiếu → null); `dongGui` nạp = ĐÚNG `{loai,ma_goi}` (bằng JSON); `dungViCho([nap], true)` false, `([ly], true)` true; `coDoUong([nap])` false, `chanDatGio(đóng cửa,[nap])` ''; `trangThaiDong` nạp còn / mất gói; `laDonChiNap`; `buocTienTrinh('cho_tra',{chiNap})` 2 bước, hiện 0, không tích; `('xong',…)` tích bước 2; `thamTaoMaMoi` bản ghi chỉ nạp → `napvi?goi`; `monDatLai` có dòng nạp → boQua 0 |
| A3 | `thuongGoi` (100000/105000 → 5000; vao = tra → 0; vao < tra → 0; số thực / chuỗi / null → 0); `nhanLoaiVi` 4 loại → khoá, `qua_chao_mung` → null; `dongVi` số hỏng → null |
| B1 | Chromium 390: Ưu đãi bấm ô số dư → `/uudai/vi`; Enter trên ô → `/uudai/vi`; `/goi-nap` rỗng → không chip; có gói → chip → `/uudai/vi?nap=1` bảng mở; hai ô cao bằng nhau (±1px); Tài khoản ô Ví → `/uudai/vi` |
| B2 | màn Ví: số dư `/toi`; nút Nạp ẩn khi `/goi-nap` rỗng / lỗi; 4 loại + loại lạ (tên = `ghi_chu`); dòng 2 "HH:mm · dd/mm/yyyy" + `ghi_chu`; "gồm … tiền thưởng" chỉ khi thuong > 0; dấu + / −; "Xem thêm" nối trang 2 không trùng, `con_nua:false` → hết nút; dòng có `ma_don` → Chi tiết đơn; `/vi` rỗng → câu trống; `/vi` lỗi → câu lỗi + Thử lại; không có "Thẻ quà tặng" / "Chuyển đổi điểm" |
| B3 | thứ tự gói = POS; nhãn "+5.000đ" chỉ khi vao > tra; chưa chọn → nút `aria-disabled`; chọn → "Tiếp tục · trả …" → `/uudai/vi/nap?goi=<ma>`; không ô gõ số tiền; Back đóng bảng |
| B4 | thân `POST /gio/bao-gia` và `POST /don`: `mon` ĐÚNG `[{loai:'nap',ma_goi}]`, `cach_tra:'qr'`, KHÔNG `ma_giam`/`pin`/`vouchers`; giỏ đồ uống trong `kh_gio` không lẫn vào; mở lúc quán đóng vẫn đặt được; `?goi=99` → "không còn bán" + "Về Ví", 0 lần gọi bao-gia; MỖI mã `GOI_NAP_KHONG_CO` / `NAP_KHONG_GOP` / `NAP_CHI_TIEN_MAT_QR` (3 ca) → lời POS nguyên văn + "Về Ví", nút khoá; đơn nạp "chưa rõ" (POS giả treo `POST /don`) → khối chưa rõ hiện tên dòng nạp (tên gói POS), KHÔNG "undefined", và màn Thanh toán đồ uống mở cùng lúc cũng hiện đúng tên đó; bấm đúp "Quét QR" → đúng 1 `POST /don`; bảng tiền 3 dòng đúng số POS; nút "Quét QR · …"; không công tắc ví / mã giảm / nhận hàng |
| B5 | Theo dõi đơn nạp chờ trả: 2 bước, không chữ "pha chế" / "ra quầy", không số đơn to; `xong` → "Đã nạp 105.000đ vào ví!" (số từ `/vi`, KHÁC số `vao` của gói trong ca thử), số dư mới từ `/toi` lần đọc SAU trả, "Gồm 5.000đ…"; `/vi` không có dòng khớp → "Đã nạp tiền vào ví!" không số; "Xem ví" → `/uudai/vi`; "Tạo mã mới" đơn nạp hết hạn → `/uudai/vi/nap?goi=`; đối chứng: đơn đồ uống vẫn 4 bước + số đơn, đơn thẻ vẫn Chào mừng; Chi tiết đơn dòng nạp không biểu tượng đầu; tiền về muộn (đơn nạp `da_huy` + `thong_bao_tien_ve`) → câu POS nguyên văn, KHÔNG màn "Đã nạp" |
| B6 | `kiemDanhMuc` (bài chung) + ca: mọi `data-nd` mới trên 7 màn có trong danh mục; tệp `nd/viTien.js` đăng ký ở `index.js` |
| C1 | tĩnh: `vi_tien.css` 0 màu ngoài demo (hàm K9 chép nguyên như thu_KHTHE3), mọi lớp bắt đầu `vt-` |
| C2 | bài cũ đổi có chủ đích: dự kiến `thu_KHKHOP1.js` KHÔNG cần đổi (chỉ cần KiemKhop.jsx — Câu hỏi 1); `thu_KHND3c` đọc `.wallet-box .l` — chip dùng lớp `vt-nap` nên không đổi. Bài nào đổi thì có ca đỏ trên gốc + `SỐ CA` |
| C3 | `dot_bien_tay.js` ≥ 7 đột biến (dòng nạp kèm `so_luong` · `dungViCho` bỏ nạp · `coDoUong` tính nạp · `thuongGoi` `>=` · Đã nạp lấy `vao` của gói · nút Nạp hiện khi rỗng · bỏ `/goi-nap` khỏi `CUA_CONG_KHAI`) — mỗi cái làm `thu_KHNAP1` đỏ |
| C4–C5 | ảnh 390 trước / sau + ảnh đề xuất của `ban_thiet_ke.html`; chạy mọi `thu_*.js` với `LUU_ANH_DIR` trên gốc và nhánh, so ảnh màn ngoài phạm vi |
| C6 | `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`), K10 không tăng; kết quả + màu đã thay (B6) + `HEAD ĐÃ KIỂM` ghi `trang_thai.md` |
| C7 | chủ quán thử tay sau gộp (chuyển khoản thật) — máy không làm được; ghi 1–3 thao tác vào mục CHƯA KIỂM |

POS giả: khuôn `dungMay` (thu_KHMUA1b) mở rộng trong bài mới: `/goi-nap`, `/vi?trang=N`, `bao-gia` dòng nạp (`dong[]` có `loai:'nap'`), `POST /don` kiểm
`NAP_KHONG_GOP` / `NAP_CHI_TIEN_MAT_QR` / `GOI_NAP_KHONG_CO` như hợp đồng, `GET /don/:ma` dòng nạp `loai:'nap'`. Ca hai người cùng bấm: đi CHUNG `khoaGui` +
`kh_don_gui` (đã có bài KHMUA1b/c) — thêm một ca bấm đúp nút "Quét QR" → đúng 1 `POST /don`.

## Đường song song phải canh
- Đơn đồ uống / đơn thẻ: `dongGui`, `dungViCho`, `coDoUong`, `buocTienTrinh`, `thamTaoMaMoi`, `monDatLai` đều thêm NHÁNH, không đổi nhánh cũ — ca đối chứng ở B5 + bài cũ
  KHMUA1b/c, THE2, THE3 giữ xanh.
- `ThanhToan.tenGui` (dòng 170–171) ở khối "chưa rõ" (dòng 197): bản ghi `kh_don_gui` dùng chung mọi Thanh toán → thêm nhánh nạp (tên gói từ `/goi-nap`, không có
  → khoá chữ chung "Nạp tiền vào ví") + khoá `ndDau` đúng; có ca B4.
- `ThanhToan` các chỗ rẽ theo `cheDoThe`: dòng phụ đầu màn (190), `KhoiThe`/khối nhận + ví (209–236), `BangTien` (238), nút đặt (`kNut`, 182), nút phụ (243–244):
  mỗi chỗ thêm nhánh `cheDoNap` TRƯỚC, nhánh thẻ / đồ uống giữ nguyên.
- `trangThaiDong` / `duocThanhToan` thêm tham số thứ 4 `dsGoi` TUỲ CHỌN: GioHang.jsx (tệp cấm, dòng 56, 83, 86) gọi 3 tham số vẫn y như cũ (dòng món / thẻ không đọc `dsGoi`).
- `chanDatGio` (ThanhToan.jsx:103) đọc `coDoUong` → giỏ chỉ nạp mọi giờ; ca A2 + ca B4 "quán đóng vẫn đặt".
- `TheoDoiDon` phần thẻ (`hangCuaDon`, `theCuaBanGhi`, `theXong`, nút gọi quán dòng 122–152): đơn nạp không có dòng thẻ ⇒ `theXong` false; nhánh nạp đặt riêng, ca đối chứng đơn thẻ.
- `App.daTra` → `boDongDaGui(gio, mon)`: dòng nạp không có `ma` → không trừ giỏ đồ uống (ca B4: giỏ đồ uống còn nguyên sau khi trả đơn nạp).
- `maDonDaTra` / `BaoDonXong` / Lịch sử đơn: đơn nạp đi như đơn App khác (không đổi).
- Chế độ sửa (/admin): `POST /don` vẫn bị chặn ở `api.js` (không đổi); "Đi tới màn" tự có 2 trang mới qua `DS_MAN`.
- 401 giữa chừng ở Ví: `api.js` dọn phiên như mọi cửa token (không đổi).
- Khách chưa đăng nhập mở `/uudai/vi` → `/dangnhap?tiep=/uudai/vi` (canDN) rồi quay lại đúng màn.

## K5 — luồng hợp lệ KHÔNG bị chặn
Giỏ chỉ nạp ngoài giờ đặt được · gói còn bán → báo giá + đặt · khách có giỏ đồ uống vẫn nạp được (đơn nạp không lấy giỏ) · ô ví ở Ưu đãi vẫn hiện số khi `/goi-nap` lỗi.

## Không làm (ngoài phạm vi / phiếu cấm)
GioHang.jsx / BangTien, NhanMa, dungDatDon.js, nd/taiKhoan.js, nd/donHang.js, the_hang.css, index.html, thiet_ke/**. Màu ngoài demo. Tự tính tiền (trừ `vao − tra`).
