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
- [x] Bài mới `thu_KHND3e.js` (22 ca · 41 ca có Chromium); 7 bài cũ sửa đọc chữ ở danh mục (mỗi bài ≥ 1 ca ĐỎ trên gốc) — `bang_chung_do.txt`.
- [x] So ảnh 33 cặp · 0 điểm lệch — `so_anh/`, `doi_chieu_demo.md`.
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
| A4 | `thu_KHND3e` A4 (28 câu mẫu = chữ gốc) + B1 (`tenGiam`, `buocTienTrinh`, `chanDat`, `guiDonAnToan`, `tieuDeXong`); so ảnh 33 cặp · 0 điểm lệch (`so_anh/`, `doi_chieu_demo.md` §1) — 360 / 390 / 430 cho mọi màn trừ chi tiết đơn có giảm (chưa chụp) và dải báo (ảnh chưa thấy dải — xem §1) |
| B1 | `thu_KHND3e` B1 (hết chữ cứng, khoá ⇄ danh mục, `git diff` gốc → `datDon.js` chỉ đổi dòng có chữ, tên hàm xuất + lời gọi `api.js` y như gốc) + 19 ca Chromium (bản giả đổi 2–4 khoá → màn đổi; bản rỗng → như cũ; có `data-nd` / `data-nd-khoa`; đặt đơn QR và đơn ví + PIN qua POS giả của `thu_KHMUA1b` đủ bước, PIN sai hiện lời POS, nhập lại được) |
| B2 | 7 bài cũ sửa, `bang_chung_do.txt` §2: mỗi bài ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`; không dùng `## Bài thử cũ sửa` |
| B3 | `doi_chieu_demo.md` §2 (demo không có `data-cms` ở `#checkout` / `#tracking` / `#orderhistory` / `#sheetPin` → mọi khoá là khoá riêng; "chưa có khối": không) |
| B4 | K10 xanh (số nợ 766 → 645, không tệp nào tăng); `npm test` 45 · 0; `--day-du` 47 · 0; cổng `tinh` chỉ còn `[A19]` trước dòng HEAD ĐÃ KIỂM; cổng `chay` — xem dưới |
| B5 | Mục "Báo cáo 7 mục" ở cuối file: số khoá theo loại, nợ đầu / sau, tệp còn nợ |

## Cổng
- `node tu_chay/cong.js tinh . fe752c3^ HEAD viec/KH-ND-3e` (HEAD 851fd32): chỉ `✗ [A19]` (chưa có dòng HEAD ĐÃ KIỂM — bình thường trước bước này).
- (vòng 0, trước soát) `chay` ở HEAD 1d0118a: ✓ CỔNG CHẠY ĐẠT. Sau soát vòng 1 đã đổi code → kiểm lại ở mục "Kiểm sau vòng soát 1" bên dưới.

## Soát độc lập — vòng 1 (báo cáo chép lại, rút gọn phần mô tả lặp)
```
KHÔNG ĐẠT (nhẹ). Không thấy chỗ nào đổi logic tiền / gửi đơn / PIN / QR / thăm dò.
LỖI:
1. ThanhToan.jsx:224,226 canhBao(chan|thongBao,'', 'tt.thongBao') gắn data-nd-khoa pos cho MỌI câu báo, kể cả câu App tự viết (loi.GIA_DA_DOI, GIA_DA_DOI_CU, CHUA_MO, CHUA_RO, NGOAI_GIO) → /admin hiện 🔒 thay vì bút.
2. PinSheet.jsx:44,67 pin.khongKhop (App tự viết) hiện trong .pin-msg đang gắn data-nd-khoa của pin.loiPos.
3. Khoá không có data-nd ở chỗ hiện: giam.* (GioHang.jsx, ngoài phạm vi), tt.monHetHang / tt.monKhongBan (chip ở GioHang), bao.tieuDe (tên tab, App.jsx).
4. TheoDoiDon.jsx:38 DOM khác gốc: " · còn " bọc span data-nd (chữ y hệt, ảnh 0 điểm).
5. A4 thiếu ảnh: ví đủ / ví + QR / PIN chỉ có 390; chi tiết đơn "có giảm" không có ảnh; ảnh bao-don-xong trùng byte theodoi-xong (dải chỉ hiện sát đáy, bị thanh tab che); "ba cỡ" nói quá.
6. trang_thai.md B5 ghi "Báo cáo 7 mục ở cuối file" nhưng chưa có.
7. doi_chieu_demo.md đếm tt.* 62 / td.* 34 lẫn nhóm khác; ke_hoach.md "8 bài cũ" liệt kê 7.
Bài mới: GOC_CHU chỉ 28/133 mục; gan() không bắt lỗi 1–2; kiểm datDon "thêm có nd(" cho qua dòng lẫn logic (đọc tay diff: không đổi logic); không ca bản rỗng ở KHONG_TRINH_DUYET; không ca Chromium cho bao.*.
NGHIỆM THU: 6/9 (thiếu A3, A4, B5). Tự khai: không chạy lại cổng chay / --day-du / cây gốc.
BÀI HỌC: bài đếm khoá thừa nên kiểm data-nd ở chỗ hiện; chỗ hiện lẫn chữ App + lời POS cần gắn khoá từ nơi chọn; đối chiếu macDinh toàn bộ bằng git show gốc; ghi (màn × cỡ) rồi đếm tệp.
```

### Xử lý vòng 1
| Điểm soát | Xử lý | Bằng chứng |
|---|---|---|
| 1, 2 | VÁ: `khoaLoi(s)` chọn khoá theo chữ App (`nd(k) === s`) hoặc `tt.thongBao` (lời POS); PinSheet chọn `pin.khongKhop` / `pin.loiPos` | `thu_KHND3e` ca "A3 câu báo App tự viết gắn data-nd của CHÍNH khoá đó" (đọc nguồn) |
| 3 | `giam.*`, chip `tt.monHet*` hiện ở `GioHang.jsx` (ngoài phạm vi) → Phát hiện (bổ sung bên dưới); `bao.tieuDe` là tên tab, không có phần tử để gắn | — |
| 4 | Giữ: chữ y hệt, 0 điểm ảnh (§1 `doi_chieu_demo.md`) | so ảnh |
| 5 | Thêm 8 cặp 360 / 430 (ví đủ, ví + QR, PIN) → 33 cặp · 0; ghi thẳng: ảnh dải báo không chứa dải, chi tiết đơn có giảm chưa chụp; sửa chữ "ba cỡ" | `doi_chieu_demo.md` §1 |
| 6, 7 | Viết mục Báo cáo 7 mục; sửa số đếm | file này, `doi_chieu_demo.md` §2, `ke_hoach.md` |
| GOC_CHU 28/133 | Giữ (soát tay 105 mục còn lại khớp theo báo cáo vòng 1); đề xuất khoá ở Bài học | — |

## Phát hiện (thêm sau soát vòng 1)
- `giam.*` (tên dòng giảm) hiện ở `BangTien` của `GioHang.jsx` và chưa có `data-nd` — ngoài phạm vi; KH-ND-3b gắn `ndDau()` (khoá `giam.*` đã có).
- Dải báo đơn xong (`BaoDonXong`) hiện sát đáy sau thanh tab ở ảnh chụp: chưa rõ có bị thanh tab che thật trên máy khách — chủ quán thử tay (CHƯA KIỂM).

## Báo cáo 7 mục
1. **VIỆC**: KH-ND-3e — chuyển chữ Thanh toán, Theo dõi đơn, Đơn hàng, PIN, thẻ QR, báo đơn xong vào danh mục.
2. **ĐÃ SỬA**: `src/noiDung/nd/donHang.js` (133 mục: 118 chữ · 1 ảnh · 14 mục khoá `pos`; theo màn: Thanh toán 62, Theo dõi đơn 34, Đơn hàng 16, Bảng PIN 15, Khung chung 6); 10 tệp A1 hết chữ cứng; `datDon.js` bỏ `CHU_CHUA_MO` / `CHU_CHUA_RO`;
   nợ chữ cứng 766 → 645 (−121). Tệp còn nợ nhiều nhất: `src/lich.js` 68, `src/tracNghiem.js` 62, `src/components/BangNgay.jsx` 54, `src/pages/KeHoach.jsx` 44, `src/kehoach.js` 41, `src/pages/UuDai.jsx` 34.
3. **BÀI THỬ**: mới `thu_KHND3e.js` 22 đạt (KHONG_TRINH_DUYET=1) / 41 (Chromium); 7 bài cũ sửa (BAO1 34, MUA1 57, MUA1b 51, MUA1c 28, NHANH1 84, SOHD1 40, TT1 9) — đỏ trên gốc, xanh sau (`bang_chung_do.txt`); so ảnh 33 cặp · 0 điểm lệch.
4. **ĐÃ RÀ K4**: grep chữ có dấu 10 tệp A1 = 0; mọi nơi dùng `CHU_CHUA_MO` / `CHU_CHUA_RO` / `tenGiam` / `buocTienTrinh` / `tieuDeXong` đã đối chiếu (GioHang, App, bài cũ); câu App tự viết hiện qua state (`thongBao`, `.pin-msg`) đã gắn đúng khoá.
5. **CHƯA KIỂM**: ảnh chi tiết đơn có giảm; dải báo đơn xong trên máy thật (ảnh chụp không thấy dải); trình duyệt Zalo, chữ to theo cài đặt máy; /admin chưa có nên chưa thấy viền vàng / 🔒 thật; ảnh chỉ so ở hoạt ảnh đã khoá.
6. **GIT**: nhánh `viec/KH-ND-3e` đã push; không PR, không merge.
7. **BÀI HỌC**: xem mục Bài học.

## Bài học
- KHOÁ (đề xuất, ngoài phạm vi): bài chung kiểm mỗi khoá khai trong danh mục có chỗ gắn `data-nd` thật ở màn (hoặc lý do), không chỉ có tên khoá trong mã; và đối chiếu `macDinh` MỌI khoá với bản `git show <gốc>` thay vì 28 câu mẫu.
- NGUYÊN TẮC (đề xuất K11): chỗ hiện lẫn chữ App và lời POS (thongBao, pin-msg, khung lỗi) phải chọn khoá `data-nd` từ chữ / nơi chọn, không gán một mục khoá `pos` cho cả chỗ.
- NGUYÊN TẮC (đề xuất): so ảnh phải khoá hoạt ảnh (nền hoạ tiết lệch 700–19.000 điểm giữa hai lần chụp cùng mã); tách một câu thành nhiều nút chữ cạnh phần tử inline làm đổi khử răng cưa (99 điểm) — giữ MỘT nút chữ.
- BỎ: lệnh bị người gác chặn (cd giữa lệnh, vòng for, sed -i, git worktree, glob git add, here-doc cộng chạy file) — chỉ gây làm lại lệnh, không phải lỗi mã.

## Kiểm sau vòng soát 1
- `node kiem_tra_truoc_khi_giao.js --day-du` (HEAD c2d1e1d trở đi, chỉ đổi trang_thai sau đó): không ✗ (vite build + Chromium qua).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . fe752c3^ HEAD viec/KH-ND-3e` (HEAD 51c071c): ✓ CỔNG CHẠY ĐẠT.
- Soát vòng 2: chưa chạy (tối đa 3 vòng; các lỗi vòng 1 đã vá hoặc ghi Phát hiện / CHƯA KIỂM) — chat soát cuối quyết định.

HEAD ĐÃ KIỂM: 51c071c
