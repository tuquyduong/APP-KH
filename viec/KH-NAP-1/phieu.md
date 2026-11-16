# KH-NAP-1 — Khách tự nạp tiền vào ví trên App: màn Ví (số dư + lịch sử), bảng chọn gói, Thanh toán nạp chỉ QR, màn "Đã nạp"

<!-- Chat App KH soạn 16.11.2026. Việc TIỀN [T], **Opus** — CÓ "Chờ duyệt kế hoạch" (bước 3: ghi `ke_hoach.md`, push, DỪNG hỏi; chủ quán dán cho chat duyệt rồi gõ
     "duyệt" thì chạy thẳng tới hết). Hạn 21.11. Mở trên main sau #42 KH-THE-3 + commit sổ v63 của chat. **Chạy SONG SONG với KH-VC-2 (voucher, Opus)** — chủ quán chọn 16.11
     → xem mục Cấm: hai việc chia tệp / chia khối, chỗ chung chỉ THÊM.
     THIẾT KẾ CHỦ QUÁN DUYỆT 16.11: `viec/KH-NAP-1/ban_thiet_ke.html` (bản cho máy của Artifact "Nạp tiền & Voucher — hiện tại và đề xuất",
     https://claude.ai/artifact/Qy5PSiVPvSfCLaRn8viF7G — Màn 1–5 là việc này; Màn 6–7 là KH-VC-2). Mẫu đề xuất viết bằng ĐÚNG lớp CSS của App: `viec/KH-NAP-1/mau_de_xuat.js`
     (các hằng MAN_VI, SHEET_GOI, MAN_TT_NAP, MAN_DA_NAP, UU_DAI_VI + CSS mẫu) — chép CẤU TRÚC, nhưng màu phải là màu demo (K9, xem C1).
     Câu trả lời chủ quán: N1 a (lối vào Ví ở Ưu đãi + Tài khoản), N2 a (chọn gói = bảng trượt trên màn Ví), N3 a (hiện nhãn thưởng "+5.000đ"), N4 a (quán tắt hết gói → ẩn nút
     Nạp tiền, vẫn xem số dư + lịch sử). QĐ 16.11 trong thiet_ke/QUYET_DINH_APPKH.md.
     Hợp đồng: `thiet_ke/HOP_DONG_API_KH.md` = PHIEN_BAN 17 (chat chép 16.11 = viec/KH-NAP-1/hop_dong_v17.md) — đọc "Ghi chú v17" (dòng nạp, `GET /goi-nap`, `GET /vi`, 4 mã lỗi,
     tiền về muộn đủ quyền lợi); thư POS `thiet_ke/trao_doi/TRA_LOI_POS_16112026_V17.md`.
     Đọc CLAUDE.md §4, §5, §6, §8, §11; `LUAT_XAY_APP.md` §5; phiếu + `trang_thai.md` của KH-THE-2, KH-THE-3 (khuôn Thanh toán một dòng, Chào mừng). -->

## Mục tiêu
Khách tự nạp tiền vào ví ngay trên App: xem số dư + lịch sử tiền vào ra, chọn một gói nạp chủ quán đặt ở POS, trả bằng chuyển khoản QR, tiền vào ví ngay khi về —
dùng lại ĐÚNG đường Thanh toán / Theo dõi đơn đang có (khoá gửi, chưa rõ / gửi lại, đơn chờ trả, huỷ, Tạo mã mới), không đường đặt đơn thứ hai.

## Nghiệm thu

### A. Cửa POS + hàm thuần
- A1 `src/api.js`: `layGoiNap = () => goi('GET', '/goi-nap')` (THÊM `/goi-nap` vào `CUA_CONG_KHAI` — không token); `layVi = (trang) => goi('GET', `/vi?trang=${trang}`)`.
  Bộ kiểm cửa mạng K0–K2d + K8 phải xanh (cửa mới có trong khối máy đọc v17). `src/kiemKhop/canTuPos.js`: khai các trường v17 App đọc (`/goi-nap` data[].ma/ten/tra/vao; `/vi`
  trang, con_nua, data[].ngay/loai/so_tien/thuong/ma_don/ghi_chu) — THÊM dòng mới, không sửa dòng cũ.
- A2 Dòng nạp `{ loai: 'nap', ma_goi }`: `src/gio.js` `laNap(d)`; `dongNapTuDuongDan({ goi })` (chuỗi chỉ chữ số > 0, như `dongTheTuDuongDan`); `coDoUong` KHÔNG tính dòng nạp
  (giỏ chỉ nạp đặt MỌI giờ — v17); `trangThaiDong` cho dòng nạp đối chiếu danh sách `/goi-nap` → `{ goi, conBan }` (gói còn trong danh sách = còn bán).
  `src/datDon.js`: `dongGui` dòng nạp ĐÚNG `{ loai: 'nap', ma_goi }` (không so_luong / ghi chú / giá); `dungViCho` → false khi có dòng nạp (chỉ QR, `NAP_CHI_TIEN_MAT_QR`);
  `laDonChiNap(don)`; `buocTienTrinh(tt, { chiNap })` HAI bước "Chờ thanh toán" → "Đã vào ví" (dòng phụ "Ngay khi tiền về, không cần ra quầy."), tích bước 2 chỉ khi `xong`;
  `thamTaoMaMoi` đơn chỉ nạp → Thanh toán nạp đúng gói; `monDatLai` bỏ qua dòng nạp (không đếm "không còn bán"). KHÔNG sửa `thanBaoGia`, `docBaoGia`, `tenGiam` (KH-VC-2).
- A3 `src/viTien.js` (hàm thuần mới): `thuongGoi(g)` = `vao − tra` khi cả hai là số nguyên và `vao > tra`, còn lại 0 (N3 — nhãn "+5.000đ" là phép trừ hai số POS, KHÔNG tự tính
  gì khác); `nhanLoaiVi(loai)` → khoá chữ: `nap` "Nạp tiền", `tra_don` "Trả đơn", `hoan_don` "Hoàn tiền", `dieu_chinh` "Quán điều chỉnh"; loại lạ (vd `qua_chao_mung` QUA-1)
  → null (màn hiện nguyên `ghi_chu` POS làm tên dòng); `dongVi(d)` làm sạch một dòng `/vi` (số không hợp lệ → bỏ dòng, không vỡ màn).

### B. Năm chỗ (đối chiếu Màn 1–5 của bản thiết kế)
- B1 **Lối vào (Màn 1, N1 a):** Ưu đãi (`UuDai.jsx`, CHỈ khối `wallet-row` trong `UuDaiToi`) — ô "Số dư ví" bấm được (cả ô là nút, `role="button"`, bàn phím Enter) → màn Ví;
  dưới số tiền nút nhỏ "+ Nạp tiền" CHỈ khi `/goi-nap` có ≥ 1 gói (N4 a); ô Điểm giữ nguyên (cân chiều cao 2 ô). Tài khoản (`TaiKhoan.jsx`): ô "Ví" trong `.acc-q` bấm được → màn Ví.
- B2 **Màn Ví (Màn 2) — trang mới** `src/pages/ViTien.jsx` + `src/giaoDien/vi_tien.css` (mọi lớp tiền tố `vt-`), đường `/uudai/vi` (`duongDan.js`: trang `vi`, tab `uudai`, `canDN`,
  `cha: '/uudai'`, tiêu đề mới). Đầu màn có nút lùi + tiêu đề "Ví của tôi" + dòng phụ. Ô số dư lớn (số = `so_du_vi` của `/toi`, kho `cuaToi`) + nút "Nạp tiền" (ẩn khi `/goi-nap`
  đang tải / lỗi / rỗng — N4 a). Dòng nhắc luật (mục sửa được): "Số dư trả được đồ uống ở quầy và trên App. Thẻ hội viên chỉ trả bằng chuyển khoản hoặc tiền mặt."
  "Lịch sử ví" = `GET /vi` trang 1 khi mở màn; mỗi dòng: biểu tượng theo loại (vào / ra / điều chỉnh), tên `nhanLoaiVi` (hoặc `ghi_chu` khi loại lạ), dòng 2 = giờ VN "HH:mm ·
  dd/mm/yyyy" + `ghi_chu` POS NGUYÊN VĂN, dòng nạp có `thuong` > 0 thêm "gồm {thuong} tiền thưởng", số tiền có dấu (+ xanh / − chữ thường) đúng `so_tien`; dòng có `ma_don` bấm
  được → Chi tiết đơn (`/taikhoan/donhang/:ma`). `con_nua` → nút "Xem thêm" tải trang kế, nối vào cuối (không trùng dòng). Chưa có dòng → câu trống (mục sửa được). Lỗi mạng → câu lỗi
  + "Thử lại". KHÔNG đặt nút "Thẻ quà tặng" / "Chuyển đổi điểm" của demo cũ (POS chưa có).
- B3 **Bảng chọn gói (Màn 3, N2 a):** bấm "Nạp tiền" → `BangNoi` (khối bảng trượt có sẵn) "Chọn gói nạp" + dòng phụ "Tiền vào ví ngay khi quán nhận được chuyển khoản.";
  mỗi gói một ô chọn: `ten` POS nguyên văn, dòng "Trả {tra} → vào ví {vao}", nhãn xanh "+{thuongGoi}" khi > 0 (N3 a); đúng thứ tự `/goi-nap`. Chưa chọn → nút mờ; chọn →
  nút "Tiếp tục · trả {tra}" → Thanh toán nạp. Dòng nhỏ cuối bảng: "Chỉ trả bằng chuyển khoản QR. Tiền đã nạp không hoàn lại." KHÔNG ô tự gõ số tiền.
- B4 **Thanh toán nạp (Màn 4):** đường `/uudai/vi/nap?goi=<ma>` (trang mới, `canDN`, `cha: '/uudai/vi'`, `tv: { goi: null }`) → CHÍNH `ThanhToan.jsx` với prop `nap` (dòng từ đường
  dẫn), cùng khuôn "một dòng" của thẻ (KH-THE-2): không giỏ, không mã giảm, không nhận hàng / công tắc ví / PIN, cách trả LUÔN `qr`. Phần riêng `KhoiNap` (như `KhoiThe`): thẻ tóm
  tắt (`card the-tom` — ô biểu tượng ví thay tấm thẻ, tên gói POS, "Vào ví {vao}", giá = `tong` báo giá), dòng xanh "Tiền vào ví ngay khi quán nhận được chuyển khoản, không cần ra
  quầy.", ô "Chuyển khoản QR" khoá sẵn (`tt-qr` có sẵn), dòng khoá "Nạp tiền chỉ trả bằng chuyển khoản, không dùng số dư ví và không dùng mã giảm giá. Tiền đã nạp không hoàn lại."
  Bảng tiền RIÊNG của nạp trong `ThanhToan.jsx` (KHÔNG sửa `BangTien` của `GioHang.jsx`): "Tiền nạp" (`tam_tinh`), "Tổng cộng" (`tong`), dòng xanh "Vào ví sau khi trả {vao}".
  Gói không còn (`?goi=` sai / không có trong `/goi-nap`) → khối báo "Gói nạp này không còn bán" + nút "Về Ví", không báo giá. Lỗi POS `GOI_NAP_KHONG_CO` / `NAP_KHONG_GOP` /
  `NAP_CHI_TIEN_MAT_QR` → lời POS nguyên văn + nút "Về Ví". Khoá gửi, `tong_da_xem`, `kh_don_gui`, chưa rõ / gửi lại đúng đơn, đơn chờ trả (mời tiếp tục / huỷ), trần lượt, C7: dùng
  CHUNG như đơn đồ uống / thẻ. Nút đặt "Quét QR · {tong}".
- B5 **Đã nạp (Màn 5):** `TheoDoiDon.jsx` — đơn chỉ nạp (`laDonChiNap`) chờ trả / chưa xong: 2 bước của A2, không "pha chế" / "ra quầy" / số đơn ra quầy; `xong` → màn "Đã nạp"
  (khuôn `ChaoMung`): ô số dư MỚI (`so_du_vi` của `/toi` đọc lại sau khi trả — `daTra` đã gọi `lamMoi([cuaToi])`; chưa có → ẩn ô số, không đoán), nhãn "+{so_tien} vừa vào ví",
  tiêu đề "Đã nạp {so_tien} vào ví!", câu "Gồm {thuong} tiền thưởng. Dùng trả đồ uống ở quầy và trên App." (bỏ vế thưởng khi 0). **Số nạp lấy từ `GET /vi`**: dòng có `ma_don`
  = mã đơn này, `loai` = `nap` (đọc trang 1; không thấy → tiêu đề chung "Đã nạp tiền vào ví!", không số). Nhãn "Đơn {so} · {tong}" như Chào mừng; nút "Đặt đồ uống ngay"
  (`moMenu`) + nút viền "Xem ví". Tiền về muộn mà POS không tạo được đơn: giữ cách hiện `thong_bao_tien_ve` đang có (`cauTienVe`) — câu POS nguyên văn, KHÔNG màn "Đã nạp".
  Dòng nạp ở "Chi tiết đơn" / Lịch sử đơn: tên = `ten` POS bỏ biểu tượng đầu dòng (`tachBieuTuong` có sẵn), ô biểu tượng ví thay ô hộp; đơn nạp không có "Đặt lại".
- B6 Mọi chữ mới khai mục danh mục NGAY (CLAUDE.md §11) trong tệp MỚI `src/noiDung/nd/viTien.js` (+ MỘT dòng đăng ký ở `src/noiDung/nd/index.js`); tên gói, `ghi_chu`, số tiền =
  khoá `pos` / `khach` (không sửa được). Màu: CHỈ bảng màu demo (K9) — mẫu `mau_de_xuat.js` dùng vài màu gần đúng, máy thay bằng màu demo gần nhất (vd ô số dư = chuyển sắc
  `--pink-deep` → `--forest` như `.wallet-hero` của demo) và ghi lại trong `trang_thai.md`.

### C. Kiểm
- C1 Bài MỚI `cong_cu/thu_KHNAP1.js` (chạy cả `KHONG_TRINH_DUYET=1`; POS giả theo hợp đồng v17 — khuôn `dungMay` của `thu_KHMUA1b.js`, phục vụ tệp `public/`): hàm thuần
  (`dongNapTuDuongDan` sai dạng, `thuongGoi` vao = tra / vao > tra / số hỏng, `nhanLoaiVi` 4 loại + loại lạ, `dongGui` nạp đúng 2 khoá, `dungViCho` có nạp → false, `coDoUong`
  giỏ chỉ nạp → false, `buocTienTrinh` chiNap, `monDatLai` bỏ dòng nạp); tĩnh: `vi_tien.css` 0 màu ngoài demo (hàm đọc màu của K9), lớp mới đều `vt-`, `/goi-nap` trong
  `CUA_CONG_KHAI`; Chromium 390: Ưu đãi ô số dư → màn Ví; nút "+ Nạp tiền" ẩn khi `/goi-nap` rỗng (N4); Tài khoản ô Ví → màn Ví; lịch sử 4 loại + loại lạ + "Xem thêm" (trang 2
  nối đúng, `con_nua` false → hết nút) + dòng có `ma_don` mở Chi tiết đơn; bảng gói: thứ tự POS, nhãn thưởng chỉ khi vao > tra, chưa chọn → nút mờ; Thanh toán nạp: thân
  `POST /don` có ĐÚNG `mon: [{ loai: 'nap', ma_goi }]`, `cach_tra: 'qr'`, không `ma_giam` / `pin`; mở ngoài giờ vẫn đặt được; `?goi=` lạ → "không còn bán", không gọi bao-gia;
  lỗi `GOI_NAP_KHONG_CO` → lời POS + "Về Ví"; Theo dõi đơn nạp chờ trả → đúng 2 bước, không chữ "pha chế" / "ra quầy"; `xong` → "Đã nạp" đúng số `/vi` + số dư mới;
  không có dòng `/vi` khớp → câu chung không số; đơn đồ uống / đơn thẻ KHÔNG đổi (bước, Chào mừng). Đỏ trên gốc.
- C2 Bài CŨ đổi có chủ đích → sửa đúng ca (đỏ trên gốc, kể cả `KHONG_TRINH_DUYET=1`); KHÔNG dùng `## Bài thử cũ sửa`. Bài khác giữ xanh.
- C3 Đột biến tay (`viec/KH-NAP-1/dot_bien_tay.js`) ≥ 6, mỗi cái ĐỎ: dòng nạp gửi kèm `so_luong` · nạp cho trả ví · giỏ chỉ nạp bị chặn ngoài giờ · nhãn thưởng hiện khi vao = tra ·
  "Đã nạp" lấy số từ gói thay vì `/vi` · nút Nạp tiền vẫn hiện khi không có gói · `/goi-nap` gửi kèm token.
- C4 Ảnh 390 trước / sau → `viec/KH-NAP-1/so_anh/`: Ưu đãi, Tài khoản, Ví (có lịch sử), bảng gói, Thanh toán nạp, Theo dõi đơn nạp chờ trả, Đã nạp; đặt cạnh ảnh đề xuất của
  `ban_thiet_ke.html` (mở bằng Chromium) — khác chỗ nào ghi `trang_thai.md`.
- C5 Soát cuối: chạy mọi `cong_cu/thu_*.js` với `LUU_ANH_DIR` trên gốc và trên nhánh, so ảnh — màn NGOÀI phạm vi (Menu, Giỏ, Thanh toán đồ uống / thẻ, Theo dõi đơn đồ uống, Chào
  mừng, thẻ QR…) phải KHÔNG đổi.
- C6 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- C7 Chủ quán thử tay sau khi gộp: Ưu đãi → Số dư ví → Nạp tiền → chọn gói nhỏ nhất → Quét QR → chuyển khoản thật → "Đã nạp" + số dư mới + dòng mới trong Lịch sử ví; thử huỷ một đơn
  nạp chưa trả.

## Phạm vi
- viec/KH-NAP-1/**
- src/pages/ViTien.jsx
- src/giaoDien/vi_tien.css
- src/viTien.js
- src/noiDung/nd/viTien.js
- src/noiDung/nd/index.js
- src/api.js
- src/duongDan.js
- src/App.jsx
- src/pages/ThanhToan.jsx
- src/gio.js
- src/datDon.js
- src/pages/TheoDoiDon.jsx
- src/pages/Don.jsx
- src/pages/UuDai.jsx
- src/pages/TaiKhoan.jsx
- src/duLieuKhach.js
- src/kiemKhop/canTuPos.js
- src/components/BieuTuong.jsx
- cong_cu/thu_KHNAP1.js
- cong_cu/thu_*.js
- cong_cu/no_chu_cung.txt

## Ngân sách
~280 dòng app (màn Ví ~90, bảng gói ~35, KhoiNap + bảng tiền nạp ~45, Đã nạp ~40, hàm thuần ~40, lối vào + đường dẫn + api ~30) + ~380 dòng thử. **Phương án đơn giản nhất đã
xét:** dòng nạp đi ĐÚNG đường Thanh toán một dòng của thẻ (không cửa / luồng đặt đơn mới), màn Ví một trang, bảng gói dùng `BangNoi` có sẵn, số tiền đều từ POS. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- **Song song với KH-VC-2 (voucher):** KHÔNG sửa `src/pages/GioHang.jsx` (cả `BangTien`), `src/components/NhanMa.jsx`, `src/dungDatDon.js`, `src/noiDung/nd/taiKhoan.js`,
  `src/noiDung/nd/donHang.js`, tệp mới của VC-2 (`src/voucherGio.js`, `src/giaoDien/voucher.css`). Trong `UuDai.jsx` CHỈ khối `wallet-row`; trong `datDon.js` KHÔNG đụng
  `thanBaoGia` / `docBaoGia` / `tenGiam`; trong `ThanhToan.jsx` KHÔNG đụng biến `tuy` của đơn đồ uống và chỗ dưới `BangTien` của đơn đồ uống; trong `App.jsx` chỉ THÊM dòng (trang
  mới, nút mở Ví, `daTra`), không sửa dòng `GioHang` / `ThanhToan` đồ uống. `canTuPos.js`, `no_chu_cung.txt`: chỉ THÊM dòng của mình. Đụng nhau lúc gộp: chat xử lý.
- KHÔNG sửa `src/components/TheQR.jsx`, `src/giaoDien/the_qr.css`, `src/qrThuongHieu.js`, `src/quangCao.js`, `src/giaoDien/demo*.css`, `src/theHoiVien.js`, `src/components/TheHoiVien.jsx`,
  `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG tự tính tiền: giá, thưởng, số dư mới, số đã vào ví đều từ POS (`/goi-nap`, báo giá, `/toi`, `/vi`) — ngoại lệ duy nhất là nhãn thưởng `vao − tra` (N3). KHÔNG đổi luật đơn
  đồ uống / thẻ. KHÔNG thêm màu ngoài bảng demo (K9).
- Chỉ push `git push -u origin viec/KH-NAP-1`. Không đụng `main`, không merge, không tạo PR.
