# KH-UI-5g — kế hoạch

Việc THƯỜNG (giao diện) — chạy thẳng, không chờ duyệt kế hoạch. Phương án chọn = ít dòng nhất vẫn đạt mọi mục nghiệm thu.

## Phương án (A = chọn, B = bỏ)
| Phần | A (chọn) | B (bỏ) |
|---|---|---|
| A1 bộ đo | tách đoạn đo của `BannerHomNay` thành hook `anhSangLuot.js` (~28 dòng); banner + dải gọi hook; xoá đoạn đo cũ | để hai bản đo: trùng, K4 |
| B dải | thêm `<i.gl-a>`, nhãn / chữ `gl-t`, nút `gl-b`, biểu tượng tách bằng `tachBieuTuong`; CSS chép giá trị từ demo `.today` | dùng lớp `.today` cho dải: kéo theo `max-width:68%`, `min-height`… phải ghi đè → nhiều dòng hơn |
| C1 banner luôn hiện | `TrangChu` bỏ nhánh `hero-banner` + 4 khoá `home.b*`; `today.t/cta` có chữ mặc định | giữ `hero-banner` nhưng thêm ánh sáng: hai khối làm cùng một việc |
| C2 chữ chung | `chonQuangCao` luôn trả `{ chu, tieuDe, phu, nut, dich, maMon, macDinh? }`; App tính một lần → dải (ẩn khi `macDinh`) + Trang chủ | hai hàm chọn chữ (dải / banner) → lệch thứ tự |
| D1 lời chào | `chiaLoiChao`: có xưng hô → `split(' ').pop()` (1 dòng) | tách riêng hàm `tenGoi` (thêm tệp) |

## Ước lượng dòng (app / thử)
hook ~28 · BannerHomNay −10 (bỏ đo) · DaiQuangCao ~14 · CSS dải ~14 · quangCao.js +25 · TrangChu −14 · App +4 · dinhDang +2 · danh mục +10 −8 → ~100 dòng app thuần (dưới ngân sách 180). Thử: `thu_KHUI5g.js` ~190 dòng + sửa 7 bài cũ.

## Ca thử ↔ nghiệm thu (xem `thu_KHUI5g.js`)
- A1: "hook … đặt --W --H --ox…", "chỉ MỘT chỗ đặt --ox", "banner + dải cùng dùng hook" · Chromium: mỗi `.gl` có `--ox/--oy/--w/--h`, `.gl-a` rộng bằng dải.
- A2: CSS demo còn nguyên; Chromium `prefers-reduced-motion: reduce` → `animation-name: none` (dải + banner).
- B1: tachBieuTuong (5 ca) + cấu trúc `DaiQuangCao` + Chromium biểu tượng NGOÀI `.gl-t`. B2: hai ca đọc CSS (giá trị demo) + K9. B3: `thu_KHUI5d.js` (coDai, ẩn khi dẫn tới chính trang) + "bấm dải → đúng Menu".
- C1: không còn `hero-banner`, 4 khoá bỏ, Chromium 3 trạng thái × (chưa / đã đăng nhập) không có `.hero-banner`. C2: 4 trường hợp + dòng POS + `gio_vang` + thứ tự; App tính một lần; khoá nhóm dải ở `khungChung.js`; bấm banner đúng đích. C3: dùng chung hàm chọn (tính lại mỗi lần vẽ App như dải).
- D1: 4 ca hàm thuần + Chromium "anh Linh".
- E2: 7 bài cũ sửa, mỗi bài ≥ 1 ca đỏ trên gốc (xem `bang_chung_do.txt`). E4: K10 `ha_no_chu.js` 766 → 764; `kiemDanhMuc` xanh.

## Đường song song / luồng hợp lệ (K5)
- `/chuong-trinh` trước chỉ hỏi ở trang có dải → Trang chủ cũng cần: mở rộng điều kiện hỏi MỘT lần (không cửa mới, không gọi thêm).
- Khách chưa đăng nhập vẫn thấy banner + dải (không khoá); dòng POS không `dich` → không nút, không bấm được (không chặn oan: có `dich` thì bấm bình thường).
- Dải vẫn ẩn ở Trang chủ (`coDai`), ẩn khi `macDinh` (không bịa quảng cáo).
- Chữ POS (tên chương trình, chữ quảng cáo, % / giờ Giờ vàng) gắn `data-nd-khoa="pos"` qua mục khoá `qc.pos`.

## Soát kế hoạch
Chưa nhờ agent phụ đọc soát riêng (đã có `/ra-soat` bản code ở bước 8) — ghi ở CHƯA KIỂM.
