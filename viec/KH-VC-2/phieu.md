# KH-VC-2 — Voucher theo hợp đồng v15: Ví voucher hiện câu POS + nguồn + "Dùng ngay", Giỏ hàng tự chọn sẵn nhiều voucher, ô mã chỉ cho một mã chung, bảng tiền "Voucher <MÃ>"

<!-- Chat App KH soạn 16.11.2026. Việc TIỀN [T], **Opus** — CÓ "Chờ duyệt kế hoạch" (bước 3: ghi `ke_hoach.md`, push, DỪNG hỏi; chủ quán dán cho chat duyệt rồi gõ
     "duyệt" thì chạy thẳng tới hết). Hạn 21.11. Mở trên main sau #42 KH-THE-3 + commit sổ v63 của chat. **Chạy SONG SONG với KH-NAP-1 (nạp tiền, Opus)** — chủ quán chọn 16.11
     → xem mục Cấm: hai việc chia tệp / chia khối, chỗ chung chỉ THÊM.
     THIẾT KẾ CHỦ QUÁN DUYỆT 16.11: `viec/KH-VC-2/ban_thiet_ke.html` (bản cho máy của Artifact "Nạp tiền & Voucher — hiện tại và đề xuất",
     https://claude.ai/artifact/Qy5PSiVPvSfCLaRn8viF7G — Màn 6–7 là việc này; Màn 1–5 là KH-NAP-1). Mẫu đề xuất viết bằng ĐÚNG lớp CSS của App: `viec/KH-VC-2/mau_de_xuat.js`
     (UU_DAI_VC + VC_DATA, GIO_VC + GIO_DATA + CSS mẫu) — chép CẤU TRÚC, màu phải là màu demo (K9, xem B6).
     Câu trả lời chủ quán: V1 a (chọn voucher ở Giỏ hàng), V2 a (voucher giảm phí giao hiện mờ "Dùng khi đặt giao hàng", không chọn được), **V3 b** (voucher chưa đủ điều kiện →
     App TỰ BỎ CHỌN + hiện câu POS màu đỏ), **V4 b** (App TỰ CHỌN SẴN mọi voucher đang dùng được), **V5 a** (nhiều hơn số được dùng → ưu tiên cái SẮP HẾT HẠN trước).
     QĐ 15.11 + 16.11 trong thiet_ke/QUYET_DINH_APPKH.md (câu "giảm gì" LUÔN là `mo_ta` POS). Hợp đồng `thiet_ke/HOP_DONG_API_KH.md` PHIEN_BAN 17 — đọc "Ghi chú v15" (voucher)
     + dòng `POST /gio/bao-gia`; thư POS `thiet_ke/trao_doi/TRA_LOI_POS_15112026_VOUCHER2.md`. POS xét voucher THEO THỨ TỰ mảng `vouchers` App gửi (tối đa N theo Cài đặt — App
     KHÔNG biết N; một voucher %; voucher tiền trước, % sau) — thứ tự gửi chính là luật V5.
     Đọc CLAUDE.md §4, §5, §6, §8, §11; `LUAT_XAY_APP.md` §5; phiếu + `trang_thai.md` của KH-MUA-1b / KH-MUA-1c (đặt đơn, khoá gửi). -->

## Mục tiêu
Khách thấy voucher đúng câu chủ quán đặt ở POS, chạm "Dùng ngay" là sang giỏ; ở Giỏ hàng App tự chọn sẵn mọi voucher dùng được (khách chạm để bỏ cái muốn để dành), POS
tính giảm, App hiện từng dòng "Voucher <MÃ>" và lý do POS cho cái chưa dùng được. Ô mã chỉ còn cho MỘT mã khuyến mãi chung.

## Nghiệm thu

### A. Hàm thuần + thân báo giá
- A1 `src/voucherGio.js` (MỚI, hàm thuần): `laShip(v)` (`kieu` `ship_tien` / `ship_phan_tram` hoặc `giam_ship` khác 0); `dsGui(vi, { boTay, chonTay })` → mảng mã gửi POS:
  từ `data[]` của `GET /voucher` (không `all`), bỏ voucher ship (V2 — đơn App hôm nay nhận tại quán), bỏ mã khách đã bỏ tay (`boTay`), xếp: mã khách chọn tay (`chonTay`, đúng thứ
  tự chạm) trước, rồi các mã còn lại theo hạn `expires_at` sớm trước (không hạn / hỏng → cuối; cùng hạn → giữ thứ tự ví) (V5 a), cắt ở 10 mã (giới hạn hợp đồng), không trùng mã
  (so không phân biệt hoa thường). `trangThaiVoucher(ma, bg)` → `'dung'` (có dòng `giam[]` `loai: 'voucher'` cùng `ma`) / `{ loi }` (có trong `voucher_loi[]`) / `'cho'`.
- A2 `src/datDon.js` (CHỈ 3 hàm): `thanBaoGia(gio, { maGiam, vouchers })` thêm `vouchers` CHỈ khi mảng không rỗng (thiếu → thân + khoá gửi y như cũ — v15); `docBaoGia` đọc thêm
  `voucherLoi[] { ma, code, error }` và giữ `ma` của từng dòng `giam[]`; `tenGiam(g, tenHang)` — `voucher` → "Voucher {ma}", `voucher_ship` → "Giảm phí giao", `ma_giam` → "Mã
  khuyến mãi" (thôi chữ "Giảm giá (voucher)"), các loại cũ giữ. `thanDatDon` tự mang `vouchers` (đi qua `thanBaoGia`) — đặt đơn gửi ĐÚNG mảng của báo giá đang hiện (POS tạo đơn
  theo đúng các voucher báo giá đã nhận). Đơn thẻ / đơn nạp (`KHONG_MA`) KHÔNG gửi `vouchers`.

### B. Ba chỗ (đối chiếu Màn 6–7 của bản thiết kế)
- B1 **Ví voucher (Màn 6)** — `UuDai.jsx` CHỈ `TheVoucher` + `DanhSachVoucher` (+ nút "Dùng ngay"): tên thẻ = `mo_ta` POS NGUYÊN VĂN (thiếu `mo_ta` → cách cũ: `reward_name` /
  câu chung); dưới tên: chip nguồn (`doi_diem` "Đổi điểm", `khach_moi` "Khách mới", `gioi_thieu` "Giới thiệu bạn" — mục sửa được; nguồn lạ → không chip) + ô mã (nét đứt).
  Voucher dùng được → nút "Dùng ngay": thêm mã vào `chonTay` (bỏ khỏi `boTay` nếu có) rồi mở Giỏ hàng (giỏ trống → màn giỏ trống có sẵn, voucher vẫn được nhớ). Voucher ship →
  thẻ mờ + nhãn "Dùng khi đặt giao hàng", KHÔNG nút (V2 a). "Xem tất cả" (`?all=1`): nhãn trạng thái `used` "Đã dùng", `expired` "Hết hạn", `disabled` "Chưa dùng được" (mục mới),
  không nút. `ma_khach_moi` (voucher khách mới nhận TRƯỚC v15, mã = mã bill) giữ hiện như cũ; "Dùng ngay" của chúng = điền mã vào ô mã khuyến mãi (`datMaGiam`) rồi mở Giỏ hàng.
  KHÔNG dùng `moTaGiam` cho voucher có `mo_ta`.
- B2 **Nhận ưu đãi khách mới** (`NhanMa.jsx`): nhận xong hiện "Đã thêm vào ví voucher: {mo_ta}" (`data.mo_ta` POS; thiếu → câu cũ); lỗi `CAN_TAO_TAI_KHOAN`,
  `KHACH_DA_CO_TAI_KHOAN`, `UU_DAI_CHUA_CO_MAU`… → lời POS nguyên văn (đường lỗi có sẵn); nhận xong làm mới `cuaVoucher` (đã có).
- B3 **Giỏ hàng (Màn 7)** — `GioHang.jsx`: khách đã đăng nhập + ví có voucher → mục "Voucher của bạn" (bên phải "Tự chọn sẵn · chạm để bỏ") ngay dưới các món, TRÊN ô mã; mỗi
  voucher một ô chạm (ô vuông tích + `mo_ta` + mã): đang được POS tính (`dung`) → tích; khách chưa bỏ mà POS không tính → KHÔNG tích + câu `error` POS màu đỏ ngay dưới (V3 b —
  App tự bỏ chọn; giỏ đổi thì App gửi lại và xét lại, đủ điều kiện là tự tích lại); ô khách đã bỏ tay → không tích, không câu; voucher ship → mờ, "Dùng khi đặt giao hàng", không chạm
  được. Chạm ô đang tích → bỏ (vào `boTay`); chạm ô không tích → chọn (vào `chonTay`, ra khỏi `boTay`) — ô vừa chọn đứng ĐẦU mảng gửi nên POS ưu tiên nó. Tiêu đề nhỏ "Mã khuyến mãi"
  + "1 mã / đơn" trên ô mã; ô mã giữ nguyên hành vi (`datMaGiam`, `ma_giam_loi`), chữ gợi ý "Nhập mã khuyến mãi (nếu có)". `BangTien`: dòng giảm dùng `tenGiam(g, …)` mới ("Voucher
  VC7 −20.000đ" từng dòng, giống hoá đơn POS). Chưa đăng nhập / ví trống / ví đang tải → không có mục voucher (giỏ như cũ).
- B4 **Trạng thái chọn** (`App.jsx`, cạnh `maGiam`): `boTay`, `chonTay` (mảng mã) giữ trong bộ nhớ trang; xoá cùng lúc với `maGiam` khi đổi khách / đăng xuất (`docLaiGio`,
  `donPhien`). Giỏ hàng VÀ Thanh toán đồ uống tính `vouchers = dsGui(viVoucher, { boTay, chonTay })` từ CÙNG kho `cuaVoucher` → hai màn gửi đúng một mảng. Đơn vừa trả (`daTra`) /
  huỷ (`daHuy`) → `lamMoi` thêm `cuaVoucher` (voucher đã dùng biến mất; voucher được nhả khi huỷ hiện lại).
- B5 **Thanh toán đồ uống** (`ThanhToan.jsx`, CHỈ biến `tuy` của đơn đồ uống + chỗ ngay dưới `BangTien` đồ uống): `tuy = { maGiam, vouchers }`; voucher POS không tính → khối
  nhỏ "Voucher chưa dùng được" liệt kê `error` POS (không chạm). Lỗi đặt đơn `VOUCHER_DANG_GIU` / mã voucher khác → lời POS nguyên văn (đường lỗi có sẵn).
- B6 Mọi chữ mới khai mục danh mục NGAY (CLAUDE.md §11) trong `src/noiDung/nd/taiKhoan.js` (Ưu đãi / ví voucher) và `src/noiDung/nd/donHang.js` (giỏ / bảng tiền); `mo_ta`,
  `error`, mã = khoá `pos` / `khach`. CSS mới trong `src/giaoDien/voucher.css` (MỚI; mọi lớp tiền tố `vc-`; giữ `.voucher .strip .body .t .s .use` của demo). Màu: CHỈ bảng màu
  demo (K9) — mẫu dùng vài màu gần đúng, máy thay bằng màu demo gần nhất, ghi `trang_thai.md`.

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHVC2.js` (chạy cả `KHONG_TRINH_DUYET=1`; POS giả theo v15/v17 — khuôn `dungMay` của `thu_KHMUA1b.js`; POS giả xét voucher THEO THỨ TỰ mảng như POS thật:
  tối đa 3, một %, `min_order`, ship → `VOUCHER_SHIP_CAN_GIAO`): hàm thuần `dsGui` (bỏ ship, bỏ tay, chọn tay đứng đầu theo thứ tự chạm, hạn sớm trước, không hạn cuối, trùng hoa
  thường, cắt 10), `trangThaiVoucher`, `thanBaoGia` không voucher → thân y như cũ (so chuỗi JSON với gốc), `tenGiam` 3 loại mới; tĩnh: `voucher.css` 0 màu ngoài demo, lớp mới đều
  `vc-`; Chromium 390: Ưu đãi thẻ voucher hiện `mo_ta` + chip nguồn + mã, ship mờ không nút, `?all=1` nhãn 3 trạng thái; "Dùng ngay" → Giỏ có voucher đó tích; Giỏ: tự tích mọi voucher
  POS tính, cái chưa đủ đơn → không tích + câu đỏ POS, thêm món đủ tiền → tự tích; bỏ tay → không tích lại sau khi đổi giỏ; chọn tay cái thứ 4 → nó vào ĐẦU mảng gửi, POS bỏ cái
  cuối; bảng tiền "Voucher VC7"; Thanh toán: thân `POST /don` có ĐÚNG mảng `vouchers` của báo giá đang hiện; giỏ không voucher → thân + khoá y như gốc; đơn thẻ không có `vouchers`;
  Nhận ưu đãi khách mới → câu có `mo_ta`. Đỏ trên gốc.
- C2 Bài CŨ đổi có chủ đích (vd chữ "Giảm giá (voucher)", `TheVoucher`) → sửa đúng ca (đỏ trên gốc, kể cả `KHONG_TRINH_DUYET=1`); KHÔNG dùng `## Bài thử cũ sửa`. Bài khác xanh.
- C3 Đột biến tay (`viec/KH-VC-2/dot_bien_tay.js`) ≥ 6, mỗi cái ĐỎ: gửi voucher ship · không bỏ mã bỏ tay · xếp hạn muộn trước · gửi `vouchers: []` khi không có voucher ·
  App tự ghép câu thay `mo_ta` · Thanh toán gửi mảng khác Giỏ · tự tích lại cái khách đã bỏ.
- C4 Ảnh 390 trước / sau → `viec/KH-VC-2/so_anh/`: Ưu đãi (ví voucher, nhận ưu đãi khách mới), Giỏ hàng (có voucher tích / lỗi / ship), Thanh toán đồ uống có voucher; đặt cạnh
  ảnh đề xuất của `ban_thiet_ke.html` — khác chỗ nào ghi `trang_thai.md`.
- C5 Soát cuối: chạy mọi `cong_cu/thu_*.js` với `LUU_ANH_DIR` trên gốc và trên nhánh, so ảnh — màn NGOÀI phạm vi (Menu, Thanh toán thẻ, Theo dõi đơn, Chào mừng, thẻ QR, Tài
  khoản…) phải KHÔNG đổi.
- C6 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- C7 Chủ quán thử tay sau khi gộp: tạo 2 voucher cho SĐT thử ở POS (một có đơn tối thiểu cao) → Ưu đãi thấy câu POS → Dùng ngay → Giỏ: một cái tích, một cái báo đỏ → thêm món →
  tự tích → đặt đơn QR → hoá đơn có "Voucher <MÃ>".

## Phạm vi
- viec/KH-VC-2/**
- src/voucherGio.js
- src/giaoDien/voucher.css
- src/pages/GioHang.jsx
- src/pages/ThanhToan.jsx
- src/pages/UuDai.jsx
- src/components/NhanMa.jsx
- src/App.jsx
- src/datDon.js
- src/duLieuKhach.js
- src/dinhDang.js
- src/noiDung/nd/taiKhoan.js
- src/noiDung/nd/donHang.js
- src/kiemKhop/canTuPos.js
- cong_cu/thu_KHVC2.js
- cong_cu/thu_*.js
- cong_cu/no_chu_cung.txt

## Ngân sách
~220 dòng app (hàm thuần ~45, Ví voucher ~40, Giỏ mục voucher ~60, App + Thanh toán ~25, NhanMa / tenGiam ~15, css ~35) + ~380 dòng thử. **Phương án đơn giản nhất đã xét:**
App không tính tiền, không đoán luật voucher — gửi MỘT mảng mã theo thứ tự (chọn tay → hạn sớm), POS xét và trả từng dòng / từng lỗi; Giỏ và Thanh toán dùng chung một hàm. Vượt
1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- **Song song với KH-NAP-1 (nạp tiền):** KHÔNG sửa `src/api.js`, `src/duongDan.js`, `src/gio.js`, `src/pages/TheoDoiDon.jsx`, `src/pages/TaiKhoan.jsx`, `src/noiDung/nd/index.js`,
  tệp mới của NAP-1 (`src/pages/ViTien.jsx`, `src/viTien.js`, `src/giaoDien/vi_tien.css`, `src/noiDung/nd/viTien.js`). Trong `UuDai.jsx` KHÔNG đụng khối `wallet-row`; trong
  `datDon.js` CHỈ `thanBaoGia` / `docBaoGia` / `tenGiam` (KHÔNG `dongGui`, `dungViCho`, `buocTienTrinh`, `thamTaoMaMoi`, `monDatLai`); trong `ThanhToan.jsx` CHỈ biến `tuy` của đơn
  đồ uống + chỗ dưới `BangTien` đồ uống (KHÔNG `KhoiThe`, chế độ một dòng); trong `App.jsx` chỉ THÊM trạng thái + prop, không sửa dòng trang mới của NAP-1. `canTuPos.js`,
  `no_chu_cung.txt`: chỉ THÊM dòng của mình. Đụng nhau lúc gộp: chat xử lý.
- KHÔNG sửa `src/components/TheQR.jsx`, `src/giaoDien/the_qr.css`, `src/qrThuongHieu.js`, `src/quangCao.js`, `src/giaoDien/demo*.css`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`,
  `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG tự tính số giảm / tự đoán voucher nào áp được (App chỉ xếp thứ tự gửi); KHÔNG tự ghép câu "giảm gì" khi POS có `mo_ta`; KHÔNG đổi luật đặt đơn (khoá gửi, gửi lại, PIN, ví).
  KHÔNG thêm màu ngoài bảng demo (K9).
- Chỉ push `git push -u origin viec/KH-VC-2`. Không đụng `main`, không merge, không tạo PR.
