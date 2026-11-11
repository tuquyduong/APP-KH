# KH-ND-3e — trạng thái

## Đồng bộ bản chụp (skill bước 1)
- Nhánh `viec/KH-ND-3e`; cây sạch; `git fetch origin viec/KH-ND-3e` → HEAD `fe752c3` = FETCH_HEAD `fe752c3` (không cần kéo).
- `git log --oneline -3` lúc mở:
  - `fe752c3 PHIEU: KH-ND-3e`
  - `010534d TIEN-DO: mo KH-ND-3b, KH-ND-3e, KH-UI-5f (chay song song voi KH-UI-5g); tao san tep nhom danh muc; luat: them gi cung sua duoc o /admin; thu POS 11.11 b (MATKHAU-1, DOI-DIEM-1, QUET-1/2, khai truong ~28.11)`
  - `042e8af TIEN-DO: KH-ND-3a xong (chat soat cuoi DAT, gop PR); mo KH-UI-5g (anh sang luot nhu demo, banner Hom nay luon chay, loi chao goi ten); quyet dinh 11.11 c; Google API can ho so xac minh 60 ngay`
- Phiên chạy ở máy mây Sonnet; không có thông báo đổi model giữa phiên.

## Tiến độ
- [x] Kế hoạch `ke_hoach.md` (không chờ duyệt — việc THƯỜNG).
- [x] Danh mục `src/noiDung/nd/donHang.js`: 133 mục (118 chữ · 1 ảnh · 14 mục khoá `pos`).
- [x] Chuyển 10 tệp A1 (0 chữ cứng); `ha_no_chu.js` hạ nợ 766 → 645.
- [x] Bài mới `thu_KHND3e.js` (21 ca · 40 ca có Chromium); 7 bài cũ sửa đọc chữ ở danh mục (mỗi bài ≥ 1 ca ĐỎ trên gốc) — `bang_chung_do.txt`.
- [x] So ảnh 25 cặp · 0 điểm lệch — `so_anh/`, `doi_chieu_demo.md`.
- [x] `npm test` (KHONG_TRINH_DUYET=1) 45 đạt · 0 hỏng; `--day-du` 47 đạt · 0 hỏng (dựng vite + Chromium).

## Bảng "chỗ chuyển → khoá" (tóm tắt)
| Tệp | Chữ cứng trước → sau | Khoá |
|---|---|---|
| `src/pages/ThanhToan.jsx` | 54 → 0 | `tt.*`, `loi.GIA_DA_DOI`, `loi.GIA_DA_DOI_CU`, `loi.CHUA_MO`; 🔒 `tt.so`, `tt.thongBao` |
| `src/pages/TheoDoiDon.jsx` | 17 → 0 | `td.*`; 🔒 `td.so`, `td.tien`, `td.cauTienVe`, `td.loiPos` |
| `src/pages/Don.jsx` | 11 → 0 | `dh.*`; 🔒 `dh.so`, `dh.tien`, `dh.cauTienVe` |
| `src/components/PinSheet.jsx` | 13 → 0 | `pin.*`; 🔒 `pin.loiPos` |
| `src/components/TheQR.jsx` | 3 → 0 | `qr.*` (chữ, ảnh logo, 🔒 tiền / dòng CK) |
| `src/components/BaoDonXong.jsx` · `src/baoDonXong.js` | 4 + 1 → 0 | `bao.*` |
| `src/components/HoaDonKhach.jsx` | 1 → 0 | `hd.soBill`; 🔒 `hd.dong` |
| `src/components/TrangTai.jsx` | 1 → 0 | `khung.thuLai`; 🔒 `khung.loi` |
| `src/datDon.js` | 16 → 0 | `giam.*`, `td.buoc.*`, `loi.CHUA_MO`, `loi.CHUA_RO`, `loi.NGOAI_GIO` |

## Câu hỏi
(không có)

## Phát hiện
- `src/components/Man.jsx` (`DauManCon`, ngoài phạm vi) nhận chữ tên màn / dòng phụ dạng chuỗi, không gắn `data-nd` → /admin (KH-ADMIN-1) không viền vàng được "Thanh toán", "Chọn cách nhận hàng & trả tiền", "Đơn …", "Lịch sử đơn hàng"
  dù khoá `tt.tieuDe`, `tt.phu`, `td.tieuDe`, `td.phu`, `dh.tieuDe`, `dh.ct.tieuDe` đã có. Đề xuất: `DauManCon` nhận thêm `khoaTieuDe` / `khoaPhu` rồi gắn `ndDau()` (một chỗ, một việc nhỏ cho KH-ND-3b / 3c hoặc KH-ADMIN-1).
- `src/pages/GioHang.jsx` (`BangTien`, KH-ND-3b) vẫn hiện ở màn Thanh toán: dòng "Tiền hàng", "Tổng cộng", "Giảm…" chưa có khoá ở nhóm này — nằm ở việc KH-ND-3b.
- Nhãn món hết hàng (`tt.monHetHang` / `tt.monKhongBan`) do ThanhToan truyền cho `danhDauMon`, nhưng chip hiện ở Giỏ hàng (`GioHang.jsx`, ngoài phạm vi) — chip chưa có `data-nd`. Đề xuất KH-ND-3b gắn `ndDau()` bằng khoá của nhóm này.
- `src/App.jsx` truyền `tieuDeXong` vào `datTieuDe` → tên tab trình duyệt khi đơn xong lấy từ `bao.tieuDe` (mục sửa được); `tieuDe.*` của khung chung chỉ phủ tên tab thường — hai chỗ cùng làm một việc (K4), nhưng khác tình huống nên giữ.
- `qr.ten` ("Tứ Quý Đường" trên thẻ QR) trùng chữ với `brand.ten` (khung chung) — hai mục sửa riêng; nếu chủ quán muốn đổi tên quán một chỗ phải đổi cả hai. Đề xuất: sau KH-ADMIN-1, gộp bằng cách cho `qr.ten` đọc `brand.ten` (khung chung — không sửa ở việc này).
- Hai cách viết "Đã hủy" (`dh.nhan.huy`, dấu `ủ`) và "Đã huỷ" (`td.buoc.da_huy`, dấu `uỷ`) viết khác nhau trong App từ trước — giữ nguyên (chép nguyên), chủ quán thống nhất khi sửa ở /admin.
- Bài cũ vẫn tìm chữ bằng cách đọc nguồn (BAO1, MUA1, MUA1b, MUA1c, NHANH1, SOHD1, TT1) — mỗi lần chữ chuyển chỗ lại phải sửa tay. Đề xuất bài thử chung `cong_cu/doc_nguon.js` trả "nguồn màn + chữ ở danh mục" để các bài đọc một chỗ (ngoài phạm vi).

## Soát: bằng chứng theo nghiệm thu (đếm từng mục)
| Mục | Bằng chứng |
|---|---|
| A1 | `thu_KHND3e` A1 (danh mục ≥ 100 mục, `kiemDanhMuc` = 0 lỗi, tệp A1 đếm chữ cứng = 0 — không ngoại lệ, mọi khoá dùng có trong danh mục, không khoá thừa); `node cong_cu/ha_no_chu.js` 766 → 645 |
| A2 | `thu_KHND3e` A2 (14 mục khoá `pos` có `chiDuong`, mỗi mục được gắn `ndDau()`); Chromium: `[data-nd-khoa]` ở số đơn, tiền, `.pin-msg` |
| A3 | `thu_KHND3e` A3 (`loi.*` là mục chữ; `datThongBao(e.message)` / `datChanPos(e.message)` còn); ThanhToan.jsx không đổi nhánh `PIN_SAI`, `CACH_KHONG_KHOP` |
| A4 | `thu_KHND3e` A4 (28 câu mẫu = chữ gốc) + B1 (`tenGiam`, `buocTienTrinh`, `chanDat`, `guiDonAnToan`, `tieuDeXong`); so ảnh 25 cặp · 0 điểm lệch (`so_anh/`, `doi_chieu_demo.md` §1) — ba cỡ 360 / 390 / 430 |
| B1 | `thu_KHND3e` B1 (hết chữ cứng, khoá ⇄ danh mục, `git diff` gốc → `datDon.js` chỉ đổi dòng có chữ, tên hàm xuất + lời gọi `api.js` y như gốc) + 19 ca Chromium (bản giả đổi 2–4 khoá → màn đổi; bản rỗng → như cũ; có `data-nd` / `data-nd-khoa`; đặt đơn QR và đơn ví + PIN qua POS giả của `thu_KHMUA1b` đủ bước, PIN sai hiện lời POS, nhập lại được) |
| B2 | 7 bài cũ sửa, `bang_chung_do.txt` §2: mỗi bài ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`; không dùng `## Bài thử cũ sửa` |
| B3 | `doi_chieu_demo.md` §2 (demo không có `data-cms` ở `#checkout` / `#tracking` / `#orderhistory` / `#sheetPin` → mọi khoá là khoá riêng; "chưa có khối": không) |
| B4 | K10 xanh (số nợ 766 → 645, không tệp nào tăng); `npm test` 45 · 0; `--day-du` 47 · 0; cổng `tinh` chỉ còn `[A19]` trước dòng HEAD ĐÃ KIỂM; cổng `chay` — xem dưới |
| B5 | Báo cáo 7 mục + số khoá + nợ ở cuối file |

## Cổng
- `node tu_chay/cong.js tinh . fe752c3^ HEAD viec/KH-ND-3e` (HEAD 851fd32): chỉ `✗ [A19]` (chưa có dòng HEAD ĐÃ KIỂM — bình thường trước bước này).
