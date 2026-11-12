# KH-ND-3b — kế hoạch

Việc THƯỜNG (giao diện / dọn): chạy thẳng tới hết, không chờ duyệt kế hoạch. Nền và khuôn lấy nguyên của KH-ND-3a (`nd()`, `ndPhan`, `<Chu>`, `ndDau`, `kiemDanhMuc`).

## Phần 1 — Danh mục `src/noiDung/nd/menu.js` (A1, A2)
- **A (chọn):** MỘT tệp nhóm, ~100 dòng, 86 mục (chữ 77 · đoạn 1 · khoá pos 7 · khoá tutinh 1). Điền mảng `MENU` đã có sẵn; KHÔNG sửa `index.js`, không mã mới trong `DICH`.
  `man`: Menu · Trang món · Giỏ hàng · Khung chung (ô món, giá, Giờ vàng, thứ trong tuần — hiện ở nhiều màn).
- B: chia ba tệp (menu.js / mon.js / gio.js) → phải sửa `index.js` (cấm). Loại.
- Khoá: demo (patch39) KHÔNG có `data-cms` cho Menu / Trang món / Giỏ hàng (chỉ có `p.*` theo món ở `noiDung/mon.js`) → đặt theo màn: `menu.*`, `mon.*`, `gio.*`, `khongthay.*`, `gv.*`, `gia.*`, `thu.*`, `khung.bot/them`.
- Nút: "Xem Menu" ở giỏ trống và màn "không tìm thấy" luôn mở Menu (đích cố định trong mã) → khai `chu`, KHÔNG khai `nut` (khai `nut` là hứa đổi được đích mà màn không làm).
- Phần POS / tự tính: mục khoá `menu.mon`, `menu.nhom`, `menu.gv.so`, `gio.mon`, `gio.tien`, `gio.maLoi`, `gia.hang` (pos), `menu.gv.dem` (tutinh) + `data-nd-khoa`.
- Không có khối MỚI → không thêm mục `hien.*`.

## Phần 2 — Đổi màn (A1, A2, A3) — không đổi thẻ / lớp / thứ tự
- Chữ thuần → `<Chu k=… as=… className=…>` (cùng thẻ và lớp). Chữ có chỗ điền mà JSX cũ tách nhiều nút chữ (`Đã xoá {ten} · `, `{so} món`, `Hôm nay {a}–{b} …`) → `ndPhan` (bài học KH-ND-3a: giữ cách tách nút chữ, nếu không lệch điểm ảnh). Chuỗi mẫu cũ (`Giá cập nhật lúc ${…}`) → `nd()` một chuỗi.
- Hàm thuần (`gioVang.js`, `giaHang.js`, `menuLoc.js`, `gioHoatDong.js`) gọi `nd()` ngay trong hàm — `nd.js` không kéo `dinhDang.js` nên không vòng nạp.
- A2: `MonO`, `TrangMon`, `Menu` đọc `ndDs('home.need')` — `ten` khớp món, `nhan` hiện; hết `NHU_CAU` trong mọi tệp ngoài `noiDung/`.
- `KhongTimThay`: bỏ prop chữ (`tieuDe`, `nut`), thay bằng `loai` ('trang' | 'mon') — App.jsx (ngoài Phạm vi) còn truyền chữ cũ, bị bỏ qua (xem Phát hiện).
- Còn lại (chữ máy): `GiaMon.jsx` `'đ'` (ký hiệu tiền); `giaHang.js` ba chuỗi chỉ màn Ưu đãi đọc (`UuDai.jsx` ngoài Phạm vi) → liệt kê trong bài thử.

## Phần 3 — Bộ đếm K10 (B1–B3)
- **A (chọn):** sửa `demChuCung` trong `ha_no_chu.js` (~+35 dòng): `://` không phải chú thích; `/` chỉ là regex khi có `/` đóng và sau nó (kèm cờ) không phải chữ / `<` / `>`; mẫu chuỗi đếm đệ quy từng `${…}` (`hetChuoi`/`hetNgoac`).
- B: dựng bộ đếm thật bằng `@babel/parser` → thêm phụ thuộc cho cổng GitHub, và phiếu cấm thêm. Loại; `@babel/parser` chỉ làm phép ĐỐI CHỨNG trong bài thử.
- Số nợ: chạy bộ đếm mới → duy nhất `src/kehoach.js` 41 → 43 (đúng dự kiến). Nâng ở commit riêng.
- B3: bỏ `\b` ở 5 ca; mỗi ca kèm bản giả "Công nợ"; UI3a thêm ca ngoài phần trình duyệt (để `KHONG_TRINH_DUYET=1` cũng đỏ được).

## Ca thử ↔ nghiệm thu
| Nghiệm thu | Ca |
|---|---|
| A1 | `thu_KHND3b` A: `kiemDanhMuc(toàn bộ)` = 0 lỗi; `macDinh` 26 khoá khớp chữ cũ; khoá pos + chỉ đường; B: 12 tệp A1 đếm chữ cứng = phép (0, trừ 2 ngoại lệ có lý do); mọi khoá dùng có trong danh mục (81); C: hàm thuần đúng chữ cũ, bản giả đổi chữ → đổi, bản hỏng → mặc định |
| A2 | MonO / TrangMon / Menu không còn `NHU_CAU`, đọc `ndDs('home.need')`; Chromium: bản giả nhãn "Da đẹp" → Menu + Trang món đổi |
| A3 | công cụ nháp so ảnh trước/sau 6 màn × 360/390/430 → `so_anh/` (đếm điểm ảnh khác) |
| B1 | `thu_KHND3a` 3 ca (mỗi dạng ĐỎ trên bộ đếm cũ) + nợ `kehoach.js` 43 |
| B2 | `thu_KHND3a`: đối chứng `@babel/parser` trên 94 tệp, lệch 0; ca "đỏ được" |
| B3 | 5 bài cũ + bản giả "Công nợ" |
| C1 | `thu_KHND3b` (20 ca ở `KHONG_TRINH_DUYET=1`, +18 ca Chromium: Menu / Trang món / Trang món hết hàng / Giỏ / Giỏ rỗng / Thông báo xoá / Không tìm thấy) |
| C2 | bài cũ đỏ vì chữ chuyển chỗ: không có (chạy `npm test` xanh sau khi đổi màn) |
| C3 | `doi_chieu_demo.md` |
| C4 | `ha_no_chu.js` hạ nợ; `npm test`, `--day-du`, cổng `tinh` + `chay` |

Đường song song cần canh: `UuDai.jsx` đọc `CHU_HANG_TANG`/`CHU_KHONG_THOI_HAN`/`dongGoi` của `giaHang.js` (giữ nguyên xuất); `ThanhToan.jsx` đọc `BangTien` của `GioHang.jsx` (giữ xuất, nay đọc `gio.*`); `OGioVang`/Trang chủ đọc `GvDem`/`chuGioVang` (cùng chữ); `App.jsx` truyền `tieuDe`/`nut` cho `KhongTimThay` (bị bỏ qua, màn vẫn đúng chữ mặc định).
K5 — luồng hợp lệ không bị chặn: không có bản / bản rỗng → mọi màn y như cũ; khoá đúng không ném lỗi; bản hỏng một khoá → chỉ khoá đó về mặc định.
