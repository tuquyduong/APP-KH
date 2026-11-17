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
