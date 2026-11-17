# KH-VC-2 — trạng thái

## Bước 1 — đối chiếu bản chụp (16.11.2026)
- Nhánh: `viec/KH-VC-2`; cây sạch; `git fetch origin viec/KH-VC-2` xong.
- HEAD `b6f66e6` · FETCH_HEAD `b6f66e6` — bằng nhau, không kéo.
- `git log --oneline -3`:
  ```
  b6f66e6 PHIEU: KH-VC-2
  e7c4f0e TIEN-DO: KH-THE-3 xong (PR #42); mo KH-NAP-1 + KH-VC-2 song song (Opus, thiet ke chu quan duyet 16.11); KH-DOI-1 cho hop dong POS viet truoc; hop dong /api/kh v17 + 4 bai thu thoi ghim v16; quyet dinh 16.11 (b); thu POS 16.11; ban giao
  c8146cd Merge pull request #42 from tuquyduong/viec/KH-THE-3
  ```
- Có commit `PHIEU: KH-VC-2`.

## Bước 2–3 — đọc + kế hoạch
- Đã đọc: phiếu, CLAUDE.md, KHUON_LOI.md, hợp đồng v17 "Ghi chú v15", `src/datDon.js`, `src/dungDatDon.js`, `src/pages/GioHang.jsx`, `src/pages/ThanhToan.jsx` (dòng 40–140, 240–291),
  `src/pages/UuDai.jsx`, `src/components/NhanMa.jsx`, `src/App.jsx` (dòng 135–260), `src/duLieuKhach.js`, `src/kiemKhop/canTuPos.js`, `viec/KH-VC-2/mau_de_xuat.js`.
- Kế hoạch: `ke_hoach.md` (ad816cd). Chủ quán duyệt 16.11 tối (commit 91eed40): đồng ý cả 3 điểm. Phiên tiếp 17.11 kéo về 91eed40, chạy thẳng từ bước 4.

## Bước 4–7 — bài thử, code, kiểm
- Bài thử mới `cong_cu/thu_KHVC2.js` (POS giả xét `vouchers` THEO THỨ TỰ: tối đa 3, một %, `min_order`, ship → `VOUCHER_SHIP_CAN_GIAO`): đỏ trên gốc 23 đạt · 37 hỏng,
  xanh trên nhánh 93 đạt · 0 hỏng (có Chromium) / 28 · 0 (`KHONG_TRINH_DUYET=1`). Bằng chứng + `SỐ CA`: `bang_chung_do.txt`.
- Bài cũ đổi có chủ đích (C2 — mỗi bài đỏ trên gốc kể cả `KHONG_TRINH_DUYET=1`, xanh trên nhánh; KHÔNG dùng `## Bài thử cũ sửa`):
  - `thu_KHMUA1b.js` C6 (2 ca) + `thu_KHND3e.js` B1: "Giảm giá (voucher)" → "Mã khuyến mãi"; `tenGiam` nhận dòng giảm `{ loai, ma }`.
  - `thu_KHND3b.js`: gợi ý ô mã khoá mới `gio.ma.goiYKm` (thêm ca tĩnh A1 để đỏ cả khi không trình duyệt; ca trình duyệt E1 đổi chữ + khoá bản giả).
  - `thu_KHND3e.js` A1: nhận nhóm `gio.vc.*` / `gio.ma.*` (man "Giỏ hàng") ở `donHang.js` — phiếu B6 đặt chữ Giỏ ở tệp này; ca chỉ nới đúng nhóm đó.
  - `thu_KHBAO1.js` A3 (`daTra` + `cuaVoucher`), `thu_KHNHANH1.js` D3 (`xongDatDon` + `cuaVoucher`, chủ quán duyệt điểm 1), `thu_KHUI3d.js` B2 (danh sách voucher nhận `dungVoucher`):
    bài kiểm bằng regex đúng dòng mã việc này cố ý đổi — regex mới đòi dạng MỚI (đỏ trên gốc).
  - Không phải đổi bài: `thu_KHMUA1.js` (dòng giảm `loai: 'voucher'` không `ma` → App hiện "Giảm giá" — sửa ở `tenGiam`, đúng hơn là hiện "Voucher " trống),
    `thu_KHND3c.js` D1 (đổi tên bảng nguồn thành `khoaNguonVoucher` để bài nhận ra chỗ gắn khoá).
- Code: `src/voucherGio.js` (MỚI), `src/datDon.js` (CHỈ `thanBaoGia` / `docBaoGia` / `tenGiam`), `src/giaoDien/voucher.css` (MỚI), `src/pages/GioHang.jsx`, `src/pages/UuDai.jsx`
  (CHỈ `TheVoucher`, `DanhSachVoucher`, chuyền prop `dungVoucher`; khối `wallet-row` không đụng), `src/components/NhanMa.jsx`, `src/pages/ThanhToan.jsx` (CHỈ `tuy` đồ uống + khối dưới
  `BangTien`, + 1 dòng import css), `src/App.jsx` (state `chonVc` + `vouchers` + prop; `docLaiGio` / `donPhien` / `daTra` / `daHuy` / `xongDatDon` theo B4 + điểm 1), danh mục
  `src/noiDung/nd/donHang.js`, `src/noiDung/nd/taiKhoan.js`. KHÔNG đổi: `src/dinhDang.js`, `src/duLieuKhach.js`, `src/kiemKhop/canTuPos.js`, `cong_cu/no_chu_cung.txt` (K10 không tăng, tệp mới 0).
- Khoá danh mục đã thêm (CLAUDE.md §11 — mọi thứ mới có khoá + `data-nd`, sửa được ở /admin; `kiemDanhMuc` 0 lỗi — thu_KHND3b/3d/3e A1):
  - `taiKhoan.js`: `ud.voucher.chuaDung`, `ud.vc.dungNgay`, `ud.vc.ship`, `ud.vc.nguon.doi_diem`, `ud.vc.nguon.khach_moi`, `ud.vc.nguon.gioi_thieu`, `ud.vc.moTa` (🔒 pos), `nm.daThemVi`.
  - `donHang.js`: `giam.voucherMa`, `giam.ship`, `tt.vc.chua`, `tt.vc.dong`, `gio.vc.tieuDe`, `gio.vc.phai`, `gio.vc.ship`, `gio.ma.tieuDe`, `gio.ma.mot`, `gio.ma.goiYKm`,
    `gio.vc.moTa` (🔒 pos), `gio.vc.loi` (🔒 pos); đổi `macDinh` `giam.voucher` → "Mã khuyến mãi" (chủ quán duyệt điểm 2). Khoá cũ `gio.ma.goiY` (menu.js) để nguyên, Giỏ thôi dùng.
- Màu thay (K9 — mẫu đề xuất dùng màu ngoài bảng demo; thay bằng màu demo gần nhất): chip `#FBE7EE` → `var(--line)` · chữ chip `#B23D6B` = `var(--forest)` · mã `#8B6877` / viền
  `#D9C3CC` → `var(--muted)` · dải ship `#C9BDC3` → `var(--muted)` · nhãn ship `#F1ECEE` → `var(--cream)` · ô chọn viền `#B23D6B` → `var(--forest)`, nền `#FFF9FB` → `var(--cream)` ·
  câu lỗi `#B3261E` → `#C62828` (đỏ demo) · ô tích viền `#D9C3CC` → `var(--line)`.
- Đột biến tay `viec/KH-VC-2/dot_bien_tay.js` (việc chỉ đổi `src/` → không `dot_bien.py`, như KH-THE-1/2/3): 15 / 15 BỊ BẮT
  (`node viec/KH-VC-2/dot_bien_tay.js --trinh-duyet` → "TẤT CẢ ĐỘT BIẾN BỊ BẮT").

  | Chỗ vá | Đột biến |
  |---|---|
  | `dsGui` bỏ ship | BV-GUI-VOUCHER-SHIP |
  | `dsGui` bỏ mã bỏ tay | BV-KHONG-BO-MA-BO-TAY |
  | `dsGui` hạn sớm trước | VS-HAN-MUON-TRUOC |
  | `chamVoucher` mới chạm đứng đầu | VS-CHON-TAY-DUNG-CUOI |
  | `thanBaoGia` chỉ gửi khi mảng không rỗng | VS-GUI-VOUCHERS-RONG |
  | App một mảng cho Giỏ + Thanh toán | VS-THANH-TOAN-MANG-KHAC |
  | `xongDatDon` làm mới ví | BV-DAT-XONG-KHONG-LAM-MOI-VI |
  | `voucher.css` màu demo | VS-CSS-MAU-NGOAI-DEMO |
  | Thẻ ví: tên = `mo_ta` | VS-APP-TU-GHEP-CAU |
  | Bỏ tay giữ khi giỏ đổi | VS-TU-TICH-LAI-CAI-DA-BO |
  | Giỏ hiện câu POS | BV-GIO-KHONG-HIEN-CAU-POS |
  | Voucher ship không chạm được | VS-SHIP-CHAM-DUOC |
  | Thanh toán khối "Voucher chưa dùng được" | BV-THANH-TOAN-KHONG-KHOI-LOI |
  | Nhận ưu đãi khách mới hiện `mo_ta` | VS-NHAN-MA-CAU-CU |
  | Chờ báo giá giữ tích / lỗi của báo giá cuối | BV-CHO-BAO-GIA-NHAP-NHAY |

- `npm test -- --day-du` (HEAD c31d418 + 102c9f8): **66 đạt · 0 hỏng** — K9 màu demo ✓, K10 chữ cứng ✓, mọi `thu_*.js` xanh (thu_KHVC2 93 · 0), vite build ✓.
- Ảnh (C4): `so_anh/sau/` (390 + 360 + 430), `so_anh/truoc/` (gốc), `so_anh/de_xuat-man6-uudai.png`, `so_anh/de_xuat-man7-gio.png`; đối chiếu: `doi_chieu_demo.md`.
- C5 (`viec/KH-VC-2/chup_tat_ca.js` chạy MỌI `thu_*.js` với `LUU_ANH_DIR` trên gốc b6f66e6 và trên nhánh; `viec/KH-VC-2/so_anh_c5.js` so điểm ảnh): 140 ảnh giống hệt.
  Khác ĐÚNG phạm vi: Giỏ hàng (`thu_KHMUA1` app_giohang, `thu_KHMUA1b` giohang-giam, `thu_KHSINH1` gio_*: tiêu đề "Mã khuyến mãi" + gợi ý mới, dòng "Mã khuyến mãi"), Ưu đãi
  (`thu_KHUI3d` uudai-dangnhap), ảnh `thu_KHVC2`. Khác KHÔNG do việc này (đã mở từng cặp ảnh, nội dung y hệt): Trang chủ (`thu_KHBAO1` bao-trangchu, `thu_KHSINH1` trangchu_*,
  `thu_KHUI3b` trang-chu-dau / menu-khach 12 điểm, `thu_KHUI3c` app_chua_dn_*, `thu_KHTHE1` trangchu_nhac, `thu_KHUI3d` trang-chu-dau) — ánh lướt chuyển động của banner "Hôm nay" chụp ở
  vị trí khác; Thanh toán ví (`thu_KHBAO1`, `thu_KHMUA1b`, `thu_KHMUA1c` pin-tra-vi, `thu_KHTT1`: 85–783 điểm) — công tắc ví đang chạy hiệu ứng bật lúc chụp. `thu_KHSOHD1` chỉ có ảnh
  ở nhánh: bản gốc trong nháp không có `.git` nên bài dừng trước khi chụp (không phải khác màn). Menu, Thanh toán thẻ, Theo dõi đơn, Chào mừng, thẻ QR, Tài khoản: không đổi.

## Cổng
- `node tu_chay/cong.js tinh . b6f66e6^ HEAD viec/KH-VC-2`: chỉ `✗ [A19]` (chưa ghi HEAD ĐÃ KIỂM — bình thường lúc đó).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . b6f66e6^ HEAD viec/KH-VC-2` ở 61da624, cây sạch: `✓ CỔNG CHẠY ĐẠT`
  (kèm `· CẢNH BÁO A16: cong_cu/thu_KHVC2.js chạy trên gốc in 19 ca ≠ 28 ca ở head` — bài dừng sớm trên gốc, đã ghi trong bang_chung_do.txt).
HEAD ĐÃ KIỂM: 61da624

## Soát độc lập — vòng 1 (agent riêng, `/ra-soat`, 17.11) — chép nguyên
```
KHÔNG ĐẠT
LỖI TÌM ĐƯỢC:
  src/pages/ThanhToan.jsx:250 — Mỗi dòng của khối "Voucher chưa dùng được" lấy chữ từ mục SỬA ĐƯỢC `tt.vc.dong` ("{ma}: {loi}"), nhưng thẻ lại gắn `ndDau('gio.vc.loi')`. `gio.vc.loi` là mục khoá `pos` (donHang.js), nên ndDau (src/noiDung/nd.js:131-134) gắn data-nd="gio.vc.loi" + data-nd-khoa="pos". Kết quả: ở Chế độ sửa dòng này hiện 🔒, `tt.vc.dong` không có data-nd ở đâu cả (grep: chỉ dòng 250 dùng nó), không bấm ✎ được. Sửa: thẻ ngoài `ndDau('tt.vc.dong')`, câu POS bọc span riêng `ndDau('gio.vc.loi')`. — CLAUDE.md §11 (mọi thứ mới có khoá + data-nd đúng). Bài thử không bắt: KHND3e chỉ đếm khoá có được dùng, không soát data-nd.
  src/pages/GioHang.jsx:99 — Khi thiếu `mo_ta` và `reward_name`, ô hiện chữ sửa được `nd('ud.voucher.tenChung')` nhưng vẫn gắn khoá pos `gio.vc.moTa` (phải là 🔒 "câu POS"). UuDai.jsx:47 làm đúng: chọn khoá theo nguồn chữ. — §11, nhẹ.
  viec/KH-VC-2/bang_chung_do.txt:26 — Ghi "Đã vá, có Chromium: 87 đạt · 0 hỏng", trong khi trang_thai.md:16 và lần tôi chạy lại đều 93 · 0 (102c9f8 thêm 6 ca 360/430, bang_chung_do không sửa theo). — K1 (hai sổ lệch nhau).
  cong_cu/thu_KHVC2.js:118-125 — Nhiều ý chỉ có ca đọc nguồn bằng regex "có chữ cuaVoucher / datChonVc(CHON_RONG) trên dòng": daHuy, daTra làm mới ví; docLaiGio, donPhien xoá lựa chọn; tuy của đơn thẻ. Không ca trình duyệt nào chạy huỷ đơn, trả đơn, đổi khách, đăng xuất, cũng không mở /thanhtoanthe để soi thân gửi. Marker suông vẫn xanh được: một phép gán thừa `cuaVoucher` trên cùng dòng daHuy mà không truyền vào lamMoi vẫn qua. dot_bien_tay.js không có đột biến cho daHuy, daTra, docLaiGio, donPhien. — K3 (một phần chỉ kiểm sự có mặt của mẫu).
  src/pages/GioHang.jsx:95 — `key={v.code}` trong khi UuDai dùng `v.id`; chính dsGui đã phòng trường hợp ví có mã trùng (hoa/thường), nên nếu ví thật trùng mã thì React báo trùng key và ô vẽ sai. — lỗi React, nhẹ.
NGHI NGỜ:
  - Khách gõ đúng mã voucher trong ví vào ô mã chung: mã đi CẢ ở `ma_giam` lẫn `vouchers` (dsGui không loại maGiam, voucherGio.js:20-26). Hợp đồng v15 có luật "tương thích ma_giam" nhưng không nói gửi trùng hai chỗ thì POS xử lý sao (có trừ hai lần không) → nên ghi ## Câu hỏi gửi POS.
  - Giỏ không hỏi báo giá (`bat` false: món hết, chưa có menu): mục voucher vẫn hiện theo bgCu cũ, hoặc không ô nào tích mà vẫn ghi "Tự chọn sẵn". Chưa thử.
  - `bgCu.current = bg` gán ref ngay trong lúc vẽ (GioHang.jsx:120): chạy được, nhưng không đúng nếp React.
  - trang_thai.md C5 ("140 ảnh giống hệt"; Trang chủ / Thanh toán ví lệch "do hiệu ứng") không lưu kết quả chạy so_anh_c5.js. Kho chỉ có 3 cặp ảnh ở so_anh/c5/, nên tôi không kiểm lại được con số 140 và lời giải thích → K1, chưa đủ căn cứ.
  - Ngoài khung Cấm: UuDai.jsx:26-34 (import, bảng TRANG_THAI_VOUCHER, khoaNguonVoucher ngoài TheVoucher / DanhSachVoucher) và ThanhToan.jsx:26 (dòng import css) — cần thiết, nhỏ, nhưng nằm ngoài "CHỈ tuy + chỗ dưới BangTien". canTuPos.js chưa thêm trường v15 (mo_ta, nguon, kieu, voucher_loi), không bắt buộc.
NGHIỆM THU:    13/15 mục có bằng chứng · mục thiếu: C3 chưa chạy lại được (lệnh bị chặn quyền) · C7 không kiểm được từ đây
  (bảng chi tiết A1…C7 của người soát: A1 ✓ · A2 ✓ · B1 ✓ · B2 ✓ · B3 ✓ · B4 ~ (daTra, daHuy, docLaiGio, donPhien chỉ regex) · B5 ✓ · B6 ✓ (trừ data-nd ThanhToan.jsx:250) ·
   C1 ✓ (nhánh 93·0 / 28·0, gốc 23·37) · C2 ✓ · C3 ? · C4 ✓ · C5 ~ (kết quả không lưu) · C6 ✓ (KHONG_TRINH_DUYET=1 npm test 63·0) · C7 —)
CHƯA SOÁT ĐƯỢC:
  - Không chạy lại dot_bien_tay.js (bị chặn quyền), `--day-du` và tu_chay/cong.js.
  - Không chạy lại so ảnh C5.
  - Không xem bằng mắt ảnh trong so_anh/.
  - POS thật xử lý mã trùng ma_giam + vouchers ra sao.
  - Lúc gộp, KH-NAP-1 cũng sửa dòng `tuy` (cheDoNap): phải bảo đảm đơn nạp dùng KHONG_MA — lúc này chưa kiểm được.
BÀI HỌC:
  - KHOÁ (bài thử chung): trong Chế độ sửa, mỗi mục danh mục loại chu/nut đang hiện trên màn phải có ít nhất một phần tử data-nd đúng khoá. Và thẻ mang data-nd-khoa="pos" không được chứa chữ lấy từ mục sửa được. Đây chính là chỗ lỗi ThanhToan.jsx:250 lọt qua kiemDanhMuc / KHND3e.
  - KHOÁ: ca "làm mới kho khi huỷ / trả / đổi khách / đăng xuất" phải là ca trình duyệt đếm lời gọi GET (như ca xongDatDon đã làm), không chỉ regex dòng mã. Kèm đột biến BV- cho mỗi chỗ.
  - NGUYÊN TẮC (KHUON_LOI.md): số ca trong bang_chung_do.txt phải ghi lại sau mỗi commit đổi bài thử (hoặc script tự ghi). Kết quả so ảnh C5 phải lưu kết quả chạy vào viec/<MÃ>/ thì mới được trích con số trong trang_thai.
```

### Sửa vòng 1 (commit a8f4ad6 code, c24c9fe bài thử + đột biến)
- ThanhToan.jsx: dòng "{ma}: {loi}" gắn `ndDau('tt.vc.dong')` (sửa được), câu POS bọc `<span {...ndDau('gio.vc.loi')}>` (🔒) qua `ndPhan`. Ca mới thu_KHVC2 "B6/§11 dòng … gắn khoá SỬA ĐƯỢC" + đột biến VS-THANH-TOAN-DONG-GAN-KHOA-POS.
- GioHang.jsx: tên ô khi thiếu `mo_ta` + `reward_name` gắn `ud.voucher.tenChung` (sửa được); `key={v.id ?? v.code}`.
- bang_chung_do.txt: số ca Chromium cập nhật (93 → 96 sau vòng 1), ghi rõ lịch sử số.
- K3: regex B4 đòi `cuaVoucher` NẰM TRONG mảng `lamMoi([...])` (marker suông "void cuaVoucher" giờ đỏ — đột biến BV-HUY-KHONG-LAM-MOI-VI); ca trình duyệt MỚI "huỷ đơn chờ trả → GET /voucher thêm một lần";
  đột biến mới BV-TRA-KHONG-LAM-MOI-VI, BV-DOI-KHACH-GIU-LUA-CHON, BV-DANG-XUAT-GIU-LUA-CHON. `dot_bien_tay.js --trinh-duyet`: **20 / 20 BỊ BẮT**.
  Đổi khách / đăng xuất / trả đơn vẫn kiểm bằng nguồn + đột biến (không ca trình duyệt: cần đăng nhập lại qua mã Zalo / tiền về QR — POS giả chưa có) → ghi ở CHƯA KIỂM.
- C5: kết quả so ảnh lưu `viec/KH-VC-2/c5_ket_qua.txt` (từng dòng KHÁC + lý do, 27 CHỈ MỘT BÊN, GIỐNG 140). Ảnh C5 chụp ở 441d677 (trước vòng 1); vòng 1 chỉ đổi markup dòng lỗi ở Thanh toán
  voucher + data-nd / key ở Giỏ (không đổi điểm ảnh ngoài màn của bài thu_KHVC2).
- Không đổi (lý do): mã gõ ở ô mã trùng voucher trong ví → hỏi POS (## Câu hỏi bên dưới), App không đoán luật. Giỏ khi không hỏi báo giá (`bat` false — món hết / chưa menu): mục voucher
  vẫn hiện các ô (không tích, theo báo giá cuối nếu có) — nút Tiếp tục đã khoá theo luật cũ; chấp nhận. `bgCu.current = bg` trong lúc vẽ: chỉ nhớ giá trị đã vẽ, không gây vẽ lại — giữ cho gọn.
  import / hằng ở đầu UuDai.jsx / ThanhToan.jsx: cần cho các khối được phép sửa (không đụng dòng của KH-NAP-1). `canTuPos.js` không thêm (không bắt buộc, kế hoạch đã bỏ).

## Câu hỏi (gửi POS — KHÔNG chặn việc này)
- Khách gõ vào ô mã khuyến mãi đúng mã một voucher đang có trong ví (vd VC7) trong khi App cũng gửi VC7 trong `vouchers`: POS xử lý thế nào — bỏ một bên, báo `voucher_loi` / `ma_giam_loi`, hay
  có thể trừ hai lần? Hợp đồng v15 chỉ ghi "App cũ gửi mã voucher ở `ma_giam` vẫn chạy như trước". Nếu POS không tự chống trùng, App sẽ loại mã đang ở ô mã khỏi `vouchers` (1 dòng ở App.jsx).

## Kiểm sau vòng sửa 1
- `npm test -- --day-du` ở c24c9fe: **66 đạt · 0 hỏng** (thu_KHVC2 96 · 0; K9, K10, vite build ✓).
- `node viec/KH-VC-2/dot_bien_tay.js --trinh-duyet`: 20 / 20 BỊ BẮT.
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . b6f66e6^ HEAD viec/KH-VC-2` ở 4a50bc2, cây sạch: `✓ CỔNG CHẠY ĐẠT` (+ cảnh báo A16 như trên — bài dừng sớm trên gốc).

## Bài học
| Sự cố | Ngăn | Lý do / đề xuất |
|---|---|---|
| 6 bài cũ đỏ sau khi code đúng (KHBAO1, KHMUA1, KHND3c, KHND3e, KHNHANH1, KHUI3d) — kế hoạch + agent soát kế hoạch chỉ thấy 3 | NGUYÊN TẮC | Bài cũ kiểm bằng regex ĐÚNG dòng mã (`lamMoi([cuaDon])`, `<VoucherTatCa />`, tiền tố khoá của donHang.js). Đề xuất `KHUON_LOI.md` (ngoài Phạm vi — chat soát gom): mục mới "Bài cũ ghim dòng mã — Đã gây: KH-VC-2 6 bài đỏ ngoài kế hoạch · Dấu hiệu: sửa một dòng có tên hàm / prop / khoá mà bài thử regex trên dòng đó · Chặn: lúc lập kế hoạch `grep -n` trong `cong_cu/thu_*.js` mọi tên hàm, biến, prop, tiền tố khoá sắp đổi; ghi danh sách bài cũ phải sửa vào ke_hoach.md". |
| `/ra-soat` bắt data-nd sai (ThanhToan: chữ sửa được gắn khoá 🔒 pos) — bài chung chỉ đếm khoá được dùng | KHOÁ | Đề xuất bài chung (ngoài Phạm vi — `cong_cu/thu_KHND3*.js` hoặc bài mới): trong App thật, mỗi phần tử `[data-nd-khoa]` không được chứa chữ của mục sửa được; mỗi khoá chu/nut đang hiện có ≥ 1 `[data-nd=<khoá>]`. Ca đỏ: bản gốc của a8f4ad6 (ThanhToan.jsx dòng "Voucher chưa dùng được"). Ca riêng của việc này đã có trong thu_KHVC2 (B6/§11). |
| `/ra-soat`: ý làm mới ví / xoá lựa chọn chỉ có regex "có chữ trên dòng" (marker suông qua được) | KHOÁ (đã làm, trong Phạm vi) | Regex đòi `cuaVoucher` trong mảng `lamMoi`, ca trình duyệt huỷ đơn, 4 đột biến BV- mới (đều đỏ). |
| `bang_chung_do.txt` ghi số ca cũ sau khi thêm ca 360 / 430 | NGUYÊN TẮC | Gộp vào K1 của `KHUON_LOI.md` (ngoài Phạm vi — đề xuất): "đổi bài thử → chạy lại và ghi lại số ở bang_chung_do.txt + trang_thai.md trong CÙNG commit". |
| Kết quả so ảnh C5 chỉ ghi tóm tắt, không lưu dòng in | BỎ | Đã lưu `c5_ket_qua.txt`; một lần. |
| Người gác chặn 15 lệnh (B-PHANTICH 5: heredoc + chạy script chung một lệnh, `$(( ))`; B-BIMAT-CHU 3: tệp có `KH_TOKEN_SAI` / `process.env` chưa commit; B-CHUONGTRINH 3: `until` / `while` / `pgrep`; MKDIR-DICH 1: gõ sai tên thư mục nháp; GIT-LENH 1: `worktree`; GIT-ADD 1: thêm cả thư mục; SED-I 1) | BỎ | Luật đã ghi trong skill; làm theo hướng dẫn (commit trước khi chạy, tách lệnh, `tail --pid` để chờ, `git archive | tar` thay worktree). |
| 2 ca tự sai trong bài mới (bắt `.js` trong chú thích CSS; câu mẫu có sẵn "đơn từ") | BỎ | Sửa ngay; một lần. |
| Dòng giảm `loai: 'voucher'` thiếu `ma` (POS giả cũ) hiện "Voucher " trống — bắt nhờ thu_KHMUA1 | BỎ | Sửa ở `tenGiam` (thiếu mã → "Giảm giá") + ca thử; một lần. |

## Báo cáo 7 mục
- **VIỆC:** KH-VC-2 — voucher theo hợp đồng v15: Ví voucher hiện câu POS + nguồn + "Dùng ngay"; Giỏ tự chọn sẵn mọi voucher, chạm để bỏ / chọn (mới chạm đứng đầu), câu POS đỏ cho
  cái chưa dùng được; ô mã chỉ cho một mã chung; bảng tiền "Voucher <MÃ>"; Thanh toán gửi đúng mảng của Giỏ.
- **ĐÃ SỬA:** `src/voucherGio.js` (mới), `src/datDon.js` (3 hàm), `src/giaoDien/voucher.css` (mới), `src/pages/GioHang.jsx`, `src/pages/UuDai.jsx`, `src/components/NhanMa.jsx`,
  `src/pages/ThanhToan.jsx`, `src/App.jsx`, `src/noiDung/nd/donHang.js`, `src/noiDung/nd/taiKhoan.js`; ~230 dòng app (ngân sách 220, trong 1,5 lần). Bài: `cong_cu/thu_KHVC2.js` (mới, ~470 dòng) + 6 bài cũ sửa đúng ca.
- **BÀI THỬ:** thu_KHVC2 đỏ trên gốc (23 · 37), xanh nhánh 96 · 0 / 28 · 0 (`KHONG_TRINH_DUYET=1`); 6 bài cũ đỏ trên gốc một ca, xanh nhánh; 20 / 20 đột biến bị bắt; `npm test -- --day-du` 66 · 0;
  cổng `chay` ĐẠT. Nghiệm thu từng mục:
  - A1 — thu_KHVC2 Phần 1 "A1 …" (laShip, dsGui 9 ca, trangThaiVoucher, chamVoucher) + đột biến BV-GUI-VOUCHER-SHIP, BV-KHONG-BO-MA-BO-TAY, VS-HAN-MUON-TRUOC, VS-CHON-TAY-DUNG-CUOI.
  - A2 — "A2 thanBaoGia … y hệt bản gốc", thanDatDon, KHONG_MA, docBaoGia, tenGiam; ca trình duyệt 'khong-voucher' (thân báo giá + POST /don không `vouchers`); VS-GUI-VOUCHERS-RONG.
  - B1 — ca 'uudai', 'dung-ngay', 'dung-ngay-ma-chung', 'dung-ngay-gio-trong', 'co-360/430'; VS-APP-TU-GHEP-CAU.
  - B2 — ca 'nhan-ma' (mo_ta, 3 mã lỗi, làm mới ví); VS-NHAN-MA-CAU-CU.
  - B3 — ca 'gio' (tự tích, câu đỏ, ship, tiêu đề, chờ báo giá, tự tích lại, chọn tay thứ 4, bỏ tay), 'vi-dang-tai', 'chua-dang-nhap'; BV-GIO-KHONG-HIEN-CAU-POS, VS-SHIP-CHAM-DUOC, BV-CHO-BAO-GIA-NHAP-NHAY, VS-TU-TICH-LAI-CAI-DA-BO.
  - B4 — "B4 App tính MỘT mảng …", regex `lamMoi([…cuaVoucher…])`, `datChonVc(CHON_RONG)`; ca 'gio' (Thanh toán = mảng Giỏ, đặt xong làm mới ví), 'huy-don'; VS-THANH-TOAN-MANG-KHAC + 5 đột biến BV- làm mới / xoá lựa chọn.
  - B5 — ca 'thanh-toan-loi' (khối "Voucher chưa dùng được", VOUCHER_DANG_GIU lời POS, nút không khoá), 'gio' (thân POST /don); BV-THANH-TOAN-KHONG-KHOI-LOI.
  - B6 — Phần 1 "B6 …" (css màu demo, lớp vc-, nạp css, khoá danh mục, macDinh, khoá pos), ca "B6/§11 dòng … gắn khoá"; K9 / K10 / kiemDanhMuc xanh; VS-CSS-MAU-NGOAI-DEMO, VS-THANH-TOAN-DONG-GAN-KHOA-POS.
  - C1 — bang_chung_do.txt (đỏ gốc / xanh nhánh, `SỐ CA cong_cu/thu_KHVC2.js: 28`).
  - C2 — bang_chung_do.txt: 6 bài cũ, mỗi bài một dòng ✗ trên gốc + `SỐ CA`.
  - C3 — dot_bien_tay.js 20 / 20 (đủ 7 loại phiếu đòi).
  - C4 — so_anh/{truoc,sau,lech}, de_xuat-man6/7, doi_chieu_demo.md.
  - C5 — c5_ket_qua.txt + so_anh/c5/.
  - C6 — npm test / --day-du 66 · 0, cổng tinh + chay ĐẠT, K10 không tăng, HEAD ĐÃ KIỂM bên dưới.
  - C7 — thử tay của chủ quán sau gộp (chưa làm được ở đây).
- **ĐÃ RÀ K4:** mọi chỗ gọi `tenGiam` (chỉ BangTien — dùng chung Giỏ + Thanh toán), `thanBaoGia` / `dungBaoGia` (Giỏ, Thanh toán đồ uống, Thanh toán thẻ qua `KHONG_MA`), `docBaoGia`
  (dungDatDon + GIA_DA_DOI ở Thanh toán — cũng có voucherLoi), `cuaVoucher` (UuDai, TaiKhoan đếm số voucher — không đổi, App), `TheVoucher` (chỉ UuDai); gửi lại đơn chưa rõ dùng `cu.than` đã ghi
  (đã chứa `vouchers`); đổi khách / đăng xuất qua `docLaiGio` / `donPhien`.
- **CHƯA KIỂM:** POS thật (cổng `/api/kh` v15) — chỉ POS giả theo hợp đồng; POS xử lý mã trùng ở `ma_giam` + `vouchers` (## Câu hỏi); đổi khách / đăng xuất / tiền QR về chỉ kiểm bằng nguồn + đột biến
  (không ca trình duyệt); máy thật điện thoại / trình duyệt Zalo / chữ to; Chế độ sửa /admin với khoá mới (chỉ kiểm data-nd + danh mục); gộp với KH-NAP-1 (dòng `tuy` — đơn nạp phải đi
  `KHONG_MA`, không `vouchers`); thử tay C7: (1) tạo 2 voucher cho SĐT thử ở POS (một có đơn tối thiểu cao) → Ưu đãi thấy câu POS → "Dùng ngay"; (2) Giỏ: một ô tích, một ô câu đỏ → thêm món → tự tích;
  (3) đặt đơn QR → hoá đơn có "Voucher <MÃ>".
- **GIT:** nhánh `viec/KH-VC-2`, đã push; không merge, không PR.
- **BÀI HỌC:** xem mục Bài học ở trên (2 đề xuất ngoài Phạm vi: KHUON_LOI "Bài cũ ghim dòng mã" + K1 số ca; 1 KHOÁ đề xuất: bài chung soát data-nd / data-nd-khoa trong App thật).
HEAD ĐÃ KIỂM: 4a50bc2

## Soát độc lập — vòng 2 (agent mới, `/ra-soat`, 17.11) — chép nguyên
```
KHÔNG ĐẠT (một lỗi nhẹ ở hành vi Giỏ hàng. Các sửa của vòng 1 đều đúng, phần còn lại đạt.)

LỖI TÌM ĐƯỢC:
  src/pages/GioHang.jsx:94 cùng :119–123. Giỏ có thể hiện ô voucher đã tích mà POS chưa hề tính. Ô tích khi `tt === 'dung' || (!bg && vuaChon === v.code)`, còn `vuaChon` chỉ được xoá khi có báo giá về (`useEffect(() => { if (bg) datVuaChon(''); }, [bg])`). Khi Giỏ không hỏi báo giá (`bat = dangNhap && coMenu && coThe` là false: menu chưa tải hoặc lỗi, hay giỏ có món hết), `bg` luôn null. Khách chạm một ô chưa tích thì ô đó tích và giữ nguyên, không có POS nào xác nhận. Điều này trái B3 ("ô tích CHỈ khi POS tính") và cũng là khuôn K3 (hiện trạng thái không có từ POS). Trường hợp menu chưa tải còn để nút "Tiếp tục" bật (dòng 117: `coThe = gio.length > 0`). Vì vậy lý do chấp nhận ghi trong trang_thai.md ("nút Tiếp tục đã khoá theo luật cũ") chỉ đúng với trường hợp món hết, sai với trường hợp chưa có menu (thuộc K1). Cách sửa 1 dòng: chỉ tích lạc quan khi đang thật sự chờ báo giá, ví dụ truyền `bat` vào và đổi thành `(!bg && bat && vuaChon === v.code)`, hoặc xoá `vuaChon` khi `!bat`.
  viec/KH-VC-2/bang_chung_do.txt:6. Dòng "Gốc, có Chromium: 23 đạt · 37 hỏng" đã cũ. Tôi chạy bài hiện tại trên bản gốc ở nháp (`node cong_cu/thu_KHVC2.js`) được 28 đạt · 41 hỏng. Lý do: vòng 1 thêm ca nhưng không ghi lại số trên gốc (khuôn K1, nhẹ). Bài vẫn đỏ trên gốc, kết luận không đổi.

NGHI NGỜ:
  - GioHang.jsx:94/121. Khách chạm một ô đang đỏ, mà ô đó đã đứng đầu `chonTay`. `chamVoucher` trả mảng giống hệt nên khoá báo giá không đổi, `bg` giữ nguyên, và `vuaChon` treo lại. Lần đổi giỏ sau, lúc đang chờ báo giá, ô này hiện tích rồi mới chuyển đỏ, tức có nhấp nháy. Gộp chung cách sửa với lỗi trên.
  - Có thể đặt đơn mà không gửi voucher: ví (`cuaVoucher`) đang tải hoặc lỗi thì `viVc` null, `vouchers` là [] (App.jsx:147–149). Thanh toán có báo giá không voucher và đặt được đơn, voucher của khách bị bỏ qua mà không báo. Đúng tinh thần K5 (ví lỗi thì không chặn), và App tải trước ví ngay khi có phiên (KH-NHANH-1) nên khó xảy ra. Nên ghi vào CHƯA KIỂM.
  - Đổi khách, đăng xuất, đơn đã trả: vẫn chỉ kiểm bằng regex trên dòng mã cộng đột biến (thu_KHVC2.js:153–158), không có ca trình duyệt. Một marker suông kiểu `void (() => datChonVc(CHON_RONG))` trong `docLaiGio` vẫn qua regex. Lý do "POS giả chưa có đăng nhập lại" còn yếu, vì đăng nhập giả được bằng chặn đường mạng như các bài khác.
  - ThanhToan.jsx:250. `x.ma` (dữ liệu POS) nằm trong phần tử sửa được `tt.vc.dong` mà không có thẻ 🔒 riêng. Đây là nếp `{bien}` có sẵn trong app (như `nm.daNhanMoi`), nên tôi không xếp vào lỗi.
  - Ngoài khung Cấm nhưng tối thiểu: chữ ký `ThanhToan(...)` thêm `vouchers` và dòng import css (ThanhToan.jsx:26, 46); dòng import `cuaVoucher` ở App.jsx:4 là sửa dòng cũ chứ không phải thêm dòng mới. Lúc gộp với KH-NAP-1 sẽ đụng chữ ký `ThanhToan` và dòng `tuy`; đơn nạp phải đi `KHONG_MA`.
  - C5: ảnh chụp ở 441d677, trước vòng 1. Các ảnh Thanh toán ví lệch 85–783 điểm, được giải thích là "hiệu ứng công tắc" — hợp lý nhưng tôi không mở từng cặp ảnh.

NGHIỆM THU:    14/15 mục có bằng chứng · mục thiếu: C7 (chủ quán thử tay sau gộp — đúng như dự kiến)
  A1 ✓ · A2 ✓ · B1 ✓ · B2 ✓ · B3 ✓ trừ lỗi `vuaChon` khi không hỏi báo giá · B4 ~ (huỷ đơn, đặt xong: trình duyệt; trả đơn, đổi khách, đăng xuất: regex + đột biến) · B5 ✓ · B6 ✓ · C1 ✓ · C2 ✓ · C3 ✓ (20/20, chạy lại) · C4 ✓ · C5 ✓ · C6 ✓ · C7 —

CHƯA SOÁT ĐƯỢC: chưa chạy `--day-du` và cổng `chay`; chưa chạy lại so ảnh C5; chưa thử với POS thật (cách POS xử lý mã trùng giữa `ma_giam` và `vouchers` — đã ghi ở mục Câu hỏi); chưa thử điện thoại thật / trình duyệt Zalo / Chế độ sửa /admin với các khoá mới; chưa kiểm lúc gộp với KH-NAP-1.

BÀI HỌC:
  - NGUYÊN TẮC: trạng thái "lạc quan" trên màn (tích trước khi POS trả lời) phải gắn với điều kiện "đang thật sự chờ một yêu cầu" (`bat`), không chỉ "chưa có kết quả". Ca thử: giỏ có `bat` false (chưa có menu) mà chạm voucher thì phải không tích.
  - NGUYÊN TẮC (K1): sau khi sửa bài thử, ghi lại số trên CẢ gốc lẫn nhánh trong bang_chung_do.txt. Lý do "chấp nhận" trong trang_thai phải kiểm cho từng nhánh điều kiện (ở đây `coMenu` và `coThe` khác nhau).
  - KHOÁ (đề xuất lại từ vòng 1): ca trình duyệt cho đăng xuất / đổi khách, đếm `vouchers` trong lần báo giá đầu sau khi đăng nhập lại, thay cho regex trên dòng mã.
```

### Sửa vòng 2 (commit 1d2525f code, 51999d7 bài thử + đột biến)
- GioHang.jsx: ô vừa chạm chỉ tích tạm khi `hoi` (đang hỏi POS) && chưa có báo giá && giỏ CHƯA đổi kể từ lúc chạm (`vuaChon = { ma, khoaGio }`) — sửa cả lỗi lẫn nghi ngờ nhấp nháy;
  bỏ `useEffect` xoá `vuaChon`. Ca mới "chưa có menu → chạm voucher KHÔNG tích" (0 báo giá gửi); đột biến VS-TICH-TAM-KHI-KHONG-HOI-POS. `dot_bien_tay.js --trinh-duyet`: 21 / 21 BỊ BẮT.
- Sửa lý do chấp nhận ở vòng 1 (K1): "Giỏ khi không hỏi báo giá … nút Tiếp tục đã khoá" chỉ đúng khi có món hết; khi chưa có menu nút vẫn bật như luật cũ (Thanh toán kiểm lại) — nay mục voucher
  ở trường hợp đó KHÔNG còn tích tạm, không ô nào tích.
- bang_chung_do.txt: số gốc / nhánh của bài HIỆN TẠI ghi lại (gốc 29 · 42, nhánh 98 · 0, `KHONG_TRINH_DUYET=1` 2 · 17 / 28 · 0).
- Không đổi: ví đang tải / lỗi → đặt đơn không voucher, không báo (đúng K5 — ví lỗi không chặn đặt; ghi CHƯA KIỂM). Đổi khách / đăng xuất / trả đơn vẫn nguồn + đột biến — ca trình duyệt
  đăng nhập lại là đề xuất KHOÁ (Bài học), chưa làm trong việc này. `x.ma` trong dòng sửa được `tt.vc.dong`: nếp `{bien}` có sẵn (người soát cũng không xếp lỗi).

## Kiểm sau vòng sửa 2
- `npm test -- --day-du` ở c351108: **66 đạt · 0 hỏng** (thu_KHVC2 98 · 0; K9, K10, vite build ✓).
- `node viec/KH-VC-2/dot_bien_tay.js --trinh-duyet`: 21 / 21 BỊ BẮT.
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . b6f66e6^ HEAD viec/KH-VC-2` ở c351108, cây sạch: `✓ CỔNG CHẠY ĐẠT` (+ cảnh báo A16 — bài dừng sớm trên gốc).

## Bài học — bổ sung sau vòng 2
| Sự cố | Ngăn | Lý do / đề xuất |
|---|---|---|
| Ô "tích tạm" treo khi Giỏ không hỏi báo giá (chưa có menu) | KHOÁ (đã làm) + NGUYÊN TẮC | Ca "chua-co-menu" + VS-TICH-TAM-KHI-KHONG-HOI-POS. Đề xuất `KHUON_LOI.md` K3 (ngoài Phạm vi): "trạng thái tạm trên màn (tích trước khi POS trả lời) chỉ khi ĐANG có yêu cầu cho đúng dữ liệu lúc chạm". |
| Lý do "chấp nhận" chỉ đúng một nhánh điều kiện (`coMenu` vs `coThe`) | NGUYÊN TẮC | Gộp vào K1 đề xuất ở trên: lý do chấp nhận phải kiểm từng nhánh điều kiện. |
| Ca trình duyệt đăng xuất / đổi khách (người soát hai vòng cùng đề xuất) | KHOÁ (đề xuất) | Bài thu_KHVC2 thêm ca: chọn bỏ tay → 401 / đăng xuất → đăng nhập lại (chặn đường `/dang-nhap/*` như thu_KHUI3d) → lần báo giá đầu gửi lại đủ mảng. Chưa làm — đưa vào việc sau. |
HEAD ĐÃ KIỂM: c351108

## Soát độc lập — vòng 3 (agent mới, `/ra-soat`, 17.11) — chép nguyên
```
KHÔNG ĐẠT (vòng 3). Sửa của vòng 2 mới chặn được một trường hợp. Ô "tích tạm" vẫn hiện tích khi POS không xác nhận, và tôi đã thấy tận mắt trong Chromium. Các phần khác đều đạt.

LỖI TÌM ĐƯỢC:
  src/pages/GioHang.jsx:127 (cùng :93) — Ô "tích tạm" vẫn tích mãi khi báo giá lỗi. Điều kiện hiện tại là `choChon = hoi && !bg && vuaChon && vuaChon.khoaGio === khoaGio`. Khi `POST /gio/bao-gia` lỗi, src/dungDatDon.js:25 đặt `{ bg: null, loi }`, nên `!bg` vẫn đúng và ô vừa chạm cứ tích. Mã `CHUA_MO` cũng vậy (`loi` rỗng, `bg` null). Thử bằng bản chép thu_KHVC2 trong nháp (POS giả trả 500 sau lần báo giá đầu). Chạm VC9: VC9 đòi đơn từ 150.000đ, giỏ chưa đủ, đang hiện câu đỏ. Kết quả: VC9 `aria-pressed=true` còn nguyên sau 2,5 giây, trong khi màn đang hiện "Máy chủ lỗi". Như vậy ô tích mà POS chưa hề tính, trái B3 ("tích CHỈ khi POS tính") và trái chính chú thích ở dòng 123–124 ("báo giá đã về → theo POS"). — K3, cùng loại với lỗi vòng 2. Thêm K1: trang_thai ghi vòng 2 "sửa cả lỗi lẫn nghi ngờ nhấp nháy", điều này chưa đúng.
  src/pages/GioHang.jsx:125–127 — `vuaChon` không được xoá khi báo giá về, mà chỉ so `khoaGio`. Vì vậy mỗi lần báo giá phải hỏi lại mà giỏ không đổi (khách áp mã khuyến mãi), ô đã chạm trước đó lại tích tạm. Đã thử: chạm VC9 → báo giá về, VC9 đỏ (`tich=false`) → áp mã XYZ, báo giá chậm 2,5 giây → trong lúc chờ VC9 `tich=true` → báo giá về thì `false`. Ô nhảy đỏ → tích → đỏ dù khách không chạm lại. — K3 (nhẹ).
  Cách sửa gợi ý cho cả hai: chỉ tích tạm khi `!loi` và khi khoá lúc chạm trùng khoá báo giá đang chờ (giỏ + `maGiam`), hoặc xoá `vuaChon` ngay khi `bg` hay `loi` về. Kèm một ca "báo giá lỗi sau khi chạm → không tích" và một đột biến cho phần `khoaGio` / `loi` (đột biến VS-TICH-TAM-KHI-KHONG-HOI-POS hiện chỉ gỡ `hoi`).

NGHI NGỜ:
  - src/voucherGio.js:16: `han()` so chuỗi. Nếu POS trả lẫn dạng có dấu cách (`YYYY-MM-DD HH:mm:ss`, dạng giờ cũ §6) với dạng `T`, hai voucher cùng ngày có thể xếp sai thứ tự hạn. Hợp đồng v15 không nói dạng của `expires_at`.
  - Ví đang tải hoặc lỗi thì `vouchers = []`, đơn đặt đi không có voucher và không báo gì (App.jsx:148–149). trang_thai đã ghi là chấp nhận theo K5; lý do hợp lý, giữ ở CHƯA KIỂM.
  - Đổi khách, đăng xuất, đơn đã trả: vẫn chỉ kiểm bằng regex trên dòng mã cộng đột biến, chưa có ca trình duyệt. trang_thai đã ghi là việc sau; lý do chấp nhận được.

NGHIỆM THU:    14/15 mục có bằng chứng · mục thiếu: C7 (chủ quán thử tay sau khi gộp, đúng như phiếu).
  A1 ✓ · A2 ✓ · B1 ✓ · B2 ✓ · B3 ✗ (hai lỗi tích tạm ở trên; phần còn lại đúng) · B4 ✓ · B5 ✓ · B6 ✓ · C1 ✓ (nhánh 98·0, KHONG_TRINH_DUYET=1 28·0, gốc 29·42) · C2 ✓ · C3 ✓ (theo trang_thai 21/21) · C4 ✓ · C5 ✓ · C6 ✓ (npm test 63·0) · C7 —
  (Soát thêm đều đạt: K4, K5, không dist/, không tệp Cấm, no_chu_cung không đổi, K9, §11 data-nd, §6, React key / sort.)

CHƯA SOÁT ĐƯỢC: chưa chạy `--day-du`, cổng `tu_chay/cong.js chay`, `dot_bien_tay.js` và so ảnh C5. Chưa thử với POS thật (mã trùng giữa `ma_giam` và `vouchers` đã ghi ## Câu hỏi). Chưa thử điện thoại thật, trình duyệt Zalo, /admin. Chưa kiểm lúc gộp với KH-NAP-1 (dòng `tuy`: đơn nạp phải đi `KHONG_MA`).

BÀI HỌC:
  - NGUYÊN TẮC (đề xuất đưa vào KHUON_LOI K3): trạng thái lạc quan trên màn phải gắn với MỘT yêu cầu cụ thể đang bay. Yêu cầu đó kết thúc (có kết quả, lỗi, hay bị thay bằng yêu cầu khác) thì xoá trạng thái tạm. Không suy từ "chưa có kết quả" (`!bg`), vì lỗi cũng là "chưa có kết quả". Vòng 2 vá theo nhánh `hoi` nên sót nhánh `loi` và nhánh đổi `maGiam`.
  - KHOÁ: bài thử có trạng thái tạm phải có đủ ba ca: không hỏi, hỏi lỗi, hỏi lại vì lý do khác. Mỗi điều kiện con của biểu thức phải có một đột biến riêng.
  - Bản chép bài thử để dò lỗi nằm ở nháp (thu_soat3.js, hai ca SOAT3-bao-gia-loi và SOAT3-ma-giam-nhap-nhay). Có thể chép hai ca này vào thu_KHVC2 làm ca đỏ.
  - Đây là vòng 3, vòng cuối theo LUAT_XAY_APP §6.5: nếu cần sửa nữa thì dừng và hỏi chủ quán.
```

### Sửa vòng 3 — vòng sửa CUỐI (`so_vong_sua_toi_da` = 3) (commit 77a773b code, e714b19 bài thử + đột biến)
- Bỏ HẲN "tích tạm" (đúng kế hoạch đã duyệt: "ô tích CHỈ khi `trangThaiVoucher === 'dung'`"; tích tạm là phần tôi tự thêm ở bước 5 và là gốc của lỗi vòng 2 + 3). `GioHang.jsx`: ô tích
  CHỈ theo báo giá POS; ĐANG chờ báo giá mới (`hoi && !loi`, `bg` null) → giữ báo giá cuối để không nhấp nháy; báo giá lỗi / không hỏi → không ô nào tích. Bỏ `vuaChon` / `khoaGio`.
  Đánh đổi: khách chạm một ô chưa tích → ô tích sau khi POS trả lời (~0,6–1 giây, gộp báo giá 600 ms) thay vì tích ngay.
- Ca mới (chép ý từ hai ca dò lỗi của người soát): "báo giá lỗi sau khi chạm → KHÔNG ô nào tích", "hỏi lại báo giá vì áp mã (giỏ không đổi) → ô POS chưa tính không tích tạm, giữ câu đỏ".
  Cả hai ĐỎ trên code vòng 2 (1d2525f: 100 · 2), xanh sau sửa (102 · 0) — bang_chung_do.txt.
- Đột biến: BV-CHO-BAO-GIA-NHAP-NHAY (viết lại theo dòng mới), VS-GIU-BAO-GIA-CU-KHI-LOI, VS-TICH-TRUOC-KHI-POS-TRA-LOI (thay VS-TICH-TAM-KHI-KHONG-HOI-POS — dòng đó đã bỏ).
  `dot_bien_tay.js --trinh-duyet`: 22 / 22 BỊ BẮT.
- Không đổi: `han()` so chuỗi — hợp đồng v15 không nói dạng `expires_at`; CLAUDE.md §6 nói giờ POS là `YYYY-MM-DDTHH:mm:ss` (dạng dấu cách là giờ CŨ) → ghi ## Câu hỏi gửi POS bên dưới.
  Ví lỗi / đổi khách / đăng xuất: như vòng 2 (người soát vòng 3 chấp nhận lý do).

## Câu hỏi (gửi POS — bổ sung sau vòng 3, KHÔNG chặn việc này)
- `GET /voucher` `data[].expires_at` luôn dạng `YYYY-MM-DDTHH:mm:ss` (giờ VN) chứ? App xếp "sắp hết hạn trước" bằng so chuỗi; nếu có voucher cũ dạng `YYYY-MM-DD HH:mm:ss` (dấu cách) lẫn vào,
  hai voucher CÙNG NGÀY có thể xếp sai giờ (khác ngày vẫn đúng). Xin POS ghi rõ dạng trong hợp đồng.

## Kiểm sau vòng sửa 3
- `npm test -- --day-du` ở e714b19 (code 77a773b): **66 đạt · 0 hỏng** (thu_KHVC2 102 · 0; K9, K10, vite build ✓).
- `node viec/KH-VC-2/dot_bien_tay.js --trinh-duyet`: 22 / 22 BỊ BẮT.
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . b6f66e6^ HEAD viec/KH-VC-2` ở 4a43f51, cây sạch: `✓ CỔNG CHẠY ĐẠT` (+ cảnh báo A16 — bài dừng sớm trên gốc).
- Bài học thêm (vòng 3): NGUYÊN TẮC — trạng thái tạm trên màn gắn với MỘT yêu cầu đang bay, kết thúc (kết quả / lỗi / bị thay) thì bỏ; cách chắc nhất là KHÔNG có trạng thái tạm
  khi kế hoạch không đòi (việc này: tôi tự thêm "tích tạm" ngoài kế hoạch → hai vòng lỗi). Đề xuất `KHUON_LOI.md` K3 (ngoài Phạm vi). KHOÁ đã làm: ca không hỏi / hỏi lỗi / hỏi lại vì lý do khác
  + đột biến (dòng này đã sửa sau soát xác nhận — xem dưới: KHÔNG phải mọi điều kiện con đều có đột biến).
HEAD ĐÃ KIỂM: 4a43f51

## Soát độc lập — xác nhận sau vòng sửa cuối (agent mới, `/ra-soat`, 17.11) — chép nguyên
```
ĐẠT. Hành vi App đúng phiếu. Còn một lỗi nhẹ, chỉ ở bài thử và một câu trong trang_thai, code src/ không sai. Vá lỗi này không cần vòng sửa code thứ 4: chỉ thêm một ca thử và sửa một câu trong trang_thai. Nếu muốn giữ đúng chữ K1 / C3 thì vá trước khi gộp.

LỖI TÌM ĐƯỢC:
  viec/KH-VC-2/trang_thai.md:269–271 (cùng src/pages/GioHang.jsx:123, viec/KH-VC-2/dot_bien_tay.js:37–40) — Câu "KHOÁ đã làm: … một đột biến cho mỗi điều kiện con" không đúng. Điều kiện con `hoi` trong `bgVc = bg || (hoi && !loi ? bgCu.current : null)` không có đột biến riêng, và không ca nào bắt được nó.
  - Đã thử ở bản chép nháp scratchpad/m1: đổi thành `bg || (!loi ? bgCu.current : null)` thì `node cong_cu/thu_KHVC2.js` vẫn 102 đạt · 0 hỏng (đột biến này sống).
  - Lý do: ca "chua-co-menu" (thu_KHVC2.js:415) không hỏi báo giá ngay từ đầu, nên `bgCu` chưa bao giờ có giá trị.
  - Ca còn thiếu: đã có báo giá (VC7 tích), sau đó `hoi` thành false (món hết làm `coThe` false, hoặc menu lỗi). Khi đó đột biến giữ tích VC7 mãi mà POS không xác nhận. Đây đúng là loại lỗi của vòng 2.
  - Khuôn: K1 (khẳng định không căn cứ) và K3 (bài thử chưa khoá một nhánh của đường hiển thị). Cách vá: thêm ca "đã báo giá → hết hỏi → không ô nào tích" và đột biến `VS-GIU-BAO-GIA-CU-KHI-KHONG-HOI` (gỡ `hoi &&`).

NGHI NGỜ:
  - GioHang.jsx:121–123: `bgCu` không bị xoá khi báo giá lỗi. Ví dụ: báo giá lỗi (không ô nào tích), rồi khách đổi giỏ. Trong lúc chờ báo giá mới, ô lại hiện tích / câu đỏ của báo giá TRƯỚC lần lỗi. Sau đó báo giá mới về và màn đúng lại. Đây là nhấp nháy ngắn, không đụng tiền: BangTien vẫn hiện "chờ", nút đặt ở Thanh toán theo `bg` riêng. Khớp chữ "giữ báo giá cuối" nhưng không khớp ý "lỗi → không tích". Có thể xoá `bgCu.current` khi có `loi`. Chưa thử trong Chromium.
  - Đánh đổi của vòng 3: chạm một ô chưa tích thì khoảng 0,6–1 giây không có phản hồi gì. Nếu POS vẫn từ chối thì không có gì đổi. trang_thai:255 đã ghi rõ. Lý do hợp lý, đúng kế hoạch đã duyệt ("tích CHỈ khi dung").
  - Đã đọc và thấy KHÔNG phải lỗi: `bgCu` không mang sang khách khác (taiTab chỉ gắn khi trang === t, App.jsx:227; donPhien về /trangchu nên GioHang tháo ra); `CHUA_MO` chỉ do cờ DAT_ONLINE (datDon.js:11; caiDat.js:4 = true); chạm hai lần lúc đang chờ không đảo trạng thái.
  - Ví đang tải hoặc lỗi thì `vouchers` = [] và đơn đi không có voucher (App.jsx:148–149). Không sai tiền (`tong_da_xem` = báo giá đang hiện). Đã chấp nhận ở vòng trước, lý do hợp lý.

NGHIỆM THU:    14/15 mục có bằng chứng · mục thiếu: C7 (chủ quán thử tay sau gộp, đúng như phiếu).
  A1 ✓ · A2 ✓ · B1 ✓ · B2 ✓ · B3 ✓ (hai ca vòng 3 đỏ trên code vòng 2: 100 · 2) · B4 ✓ · B5 ✓ · B6 ✓ · C1 ✓ (102 · 0; KHONG_TRINH_DUYET=1 28 · 0 = SỐ CA) · C2 ✓ · C3 ~ (22 đột biến đủ 7 loại phiếu đòi, thiếu đột biến cho `hoi`) · C4 ✓ · C5 ✓ · C6 ✓ (npm test 63 · 0) · C7 —
  Soát thêm đều đạt: K4, K5, không dist/, đủ trong Phạm vi, không đụng tệp Cấm, §6, §11, React.

CHƯA SOÁT ĐƯỢC: không chạy --day-du, cổng chay, dot_bien_tay.js --trinh-duyet toàn bộ (chỉ thử một đột biến tự viết); không thử POS thật (mã trùng ma_giam / vouchers, dạng expires_at — đã ghi ## Câu hỏi); không thử điện thoại thật, Zalo, /admin; chưa kiểm lúc gộp với KH-NAP-1 (đơn nạp phải đi KHONG_MA); ca "báo giá lỗi rồi đổi giỏ" chưa dựng trong Chromium.

BÀI HỌC:
  - KHOÁ: biểu thức hiển thị có nhiều điều kiện con thì mỗi điều kiện con cần một đột biến được kiểm là BỊ BẮT. Ca "không hỏi" phải dựng từ trạng thái ĐÃ có kết quả trước (ở đây `bgCu` có giá trị), nếu không nhánh đó trống rỗng.
  - NGUYÊN TẮC (K1): trước khi viết "mỗi điều kiện con đều có đột biến" vào trang_thai, liệt kê từng điều kiện con kèm tên đột biến bắt nó.
```

### Sau soát xác nhận — không sửa code (đã hết 3 vòng sửa)
- Sửa câu K1 ở trên. Bảng điều kiện con của `bgVc = bg || (hoi && !loi ? bgCu.current : null)` (GioHang.jsx) và `tich = !ship && !bo && tt === 'dung'`:
  | Điều kiện con | Đột biến / ca bắt |
  |---|---|
  | `bg ||` (giữ báo giá cuối lúc chờ) | BV-CHO-BAO-GIA-NHAP-NHAY — ca 'gio' "đang chờ báo giá mới" |
  | `!loi` | VS-GIU-BAO-GIA-CU-KHI-LOI — ca 'bao-gia-loi' |
  | `hoi` | **CHƯA CÓ** — đột biến gỡ `hoi &&` SỐNG (người soát thử: 102 · 0). Cần ca "đã báo giá → hết hỏi (món hết / menu lỗi) → không ô nào tích" |
  | `tt === 'dung'` (không tích khi 'cho') | VS-TICH-TRUOC-KHI-POS-TRA-LOI — ca 'chua-co-menu' |
  | `!bo` | VS-TU-TICH-LAI-CAI-DA-BO / BV-KHONG-BO-MA-BO-TAY — ca 'gio' bỏ tay |
  | `!ship` | VS-SHIP-CHAM-DUOC / BV-GUI-VOUCHER-SHIP — ca 'gio' ship |
- Không làm thêm trong việc này (đã hết vòng sửa; người soát kết luận ĐẠT, code src/ không sai): ca + đột biến cho `hoi`, và nghi ngờ "báo giá lỗi rồi đổi giỏ → lúc chờ hiện lại báo giá trước lần lỗi"
  (sửa 1 dòng: xoá `bgCu.current` khi có `loi`). → Đề xuất việc sau (chat soát gom), ghi ## Câu hỏi bên dưới.

## Câu hỏi (cho chủ quán / chat soát — KHÔNG chặn gộp)
- Đã hết 3 vòng sửa. Còn hai điểm nhỏ (không đụng tiền, POS vẫn quyết): (1) thêm ca thử + đột biến cho nhánh `hoi` của `bgVc` (chỉ bài thử); (2) xoá báo giá cũ khi báo giá lỗi để
  lúc chờ báo giá kế tiếp không hiện lại tích của báo giá trước lần lỗi (1 dòng ở GioHang.jsx). Chủ quán cho làm tiếp trong việc này, hay gom vào việc sau?

Kết luận: soát xác nhận ĐẠT; mọi commit đổi src/ / cong_cu/ (cuối: e714b19) nằm trước SHA dưới đây; sau đó chỉ đổi viec/KH-VC-2/trang_thai.md. Cổng chay ĐẠT ở 4a43f51.
HEAD ĐÃ KIỂM: b43e0ca
