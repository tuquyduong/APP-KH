# KH-ND-3b — trạng thái

## Bước 1.3–1.4 (đối chiếu bản chụp)
- Nhánh `viec/KH-ND-3b`; HEAD = FETCH_HEAD = `21d5df0` (hai SHA bằng nhau, không kéo).
- `git log --oneline -3` lúc mở:
  - `21d5df0 PHIEU: KH-ND-3b`
  - `010534d TIEN-DO: mo KH-ND-3b, KH-ND-3e, KH-UI-5f (chay song song voi KH-UI-5g); tao san tep nhom danh muc; luat: them gi cung sua duoc o /admin; thu POS 11.11 b (MATKHAU-1, DOI-DIEM-1, QUET-1/2, khai truong ~28.11)`
  - `042e8af TIEN-DO: KH-ND-3a xong (chat soat cuoi DAT, gop PR); mo KH-UI-5g (anh sang luot nhu demo, banner Hom nay luon chay, loi chao goi ten); quyet dinh 11.11 c; Google API can ho so xac minh 60 ngay`

## Số nợ chữ cứng (K10)
- Đầu: 766. Bộ đếm mới (B1) đếm thêm đúng `src/kehoach.js` 41 → 43 (+2, hai chuỗi lồng trong `${…}`; không thêm chữ mới) → commit riêng `3f5c8c4` — lần DUY NHẤT nâng số nợ, đúng dự kiến của phiếu. Cộng: 768.
- Sau: **684** (`node cong_cu/ha_no_chu.js`: 768 → 684, hạ 84). Giảm so với đầu: 766 → 684 = −82 (đã trừ +2).
- Tệp A1 còn nợ: `src/components/GiaMon.jsx` 1 (`.replace('đ', '')` — ký hiệu tiền, chữ máy) · `src/giaHang.js` 3 (`CHU_HANG_TANG`, `CHU_KHONG_THOI_HAN`, `dongGoi` "N tháng — giá": chỉ `src/pages/UuDai.jsx` đọc, tệp đó ngoài Phạm vi). 10 tệp A1 khác về 0 (Menu 18, TrangMon 14, GioHang 22, MonTheoDuong 3, KhongTimThay 1, MonO 2, gioVang 9, menuLoc 1, gioHoatDong 7, GiaMon −6).

## Số khoá thêm (C5) — `src/noiDung/nd/menu.js`: 86 mục
chữ 77 · đoạn 1 · khoá pos 7 · khoá tutinh 1 · (nút / ảnh / danh sách / bật tắt: 0 — màn không có; nhu cầu dùng lại `home.need` của KH-ND-3a). Theo màn: Menu 21 · Trang món 14 · Giỏ hàng 24 · Khung chung 27.

## Ảnh trước / sau (A3) — `so_anh/`
Công cụ nháp (Chromium + Playwright có sẵn; đồng hồ máy đóng băng, tắt animation, cùng dữ liệu giả, cùng `public/`): 6 màn × 360 / 390 / 430 = 18 cặp, bản GỐC `21d5df0` ↔ bản mới.
Màn: Menu (nhóm đầu) · Menu Giờ vàng (`/menu/gio-vang`) · Trang món đang Giờ vàng · Trang món hết hàng · Giỏ có món (còn hàng / hết hàng / ngừng bán) · Giỏ trống.
Kết quả (`so_anh/ket_qua.txt`): **16 / 18 cặp giống hệt 0 điểm ảnh; 2 cặp (menu_dau_430, gio_co_mon_430) mỗi cặp 11 điểm ở dải đáy màn y 840–843, lệch ≤ 6 mức màu** — nhiễu dựng nền mờ sát mép viewport, không phải chữ/bố cục (cặp khác cùng cỡ ở lần chụp trước rơi vào chỗ khác nhau: ngẫu nhiên). Ảnh tô chỗ lệch: `so_anh/lech/*_lech.png` (chỉ hai ảnh trên có chấm đỏ).
Chưa so: quán đóng ở Giỏ (App không có khối này), món có size / topping (POS chưa có cửa).

## Kiểm
- `KHONG_TRINH_DUYET=1 npm test`: **45 đạt · 0 hỏng** (như GitHub).
- Chromium thật: `thu_KHND3b.js` 38 đạt · 0 hỏng (20 ca không trình duyệt + 18 ca Chromium); `thu_KHND3a.js` 79 đạt · 0 hỏng.
- Bằng chứng ĐỎ trên gốc, `SỐ CA`: `bang_chung_do.txt`.

## Ghi chú giờ làm
Không có thông báo đổi model giữa phiên.

## Phát hiện (ngoài Phạm vi — không sửa)
1. `src/App.jsx:222` truyền `tieuDe="Không tìm thấy trang" nut="Về Trang chủ"` cho `KhongTimThay`; màn nay đọc chữ từ danh mục (`khongthay.t/nut`) và BỎ QUA hai prop. Việc có sửa App.jsx nên bỏ hai prop (đang là 2 chuỗi nợ K10 của App.jsx), để sửa chữ ở /admin đỡ gây hiểu nhầm.
2. `src/giaHang.js` còn `CHU_HANG_TANG`, `CHU_KHONG_THOI_HAN`, `dongGoi` (xuất giá trị cố định, `UuDai.jsx` import): việc chuyển màn Ưu đãi cần đổi `UuDai.jsx` sang `nd()` rồi xoá ba thứ này (nợ giaHang.js còn 3 là của việc đó).
3. `menu.nhomKhac` ("Khác") vừa hiện vừa là khoá nhóm trong đường dẫn `/menu/<nhóm>`: đổi chữ ở /admin thì đường dẫn nhóm "Khác" đổi theo (đã nhất quán trong màn; chỉ link đã lưu cũ của nhóm này hỏng). Cân nhắc khi làm KH-ADMIN-1.
4. Bộ đếm K10 vẫn là bộ đếm kiểu heuristic: chữ JSX có `/` sau `( = ? -` mà SAU ĐÓ trong cùng dòng còn một `/` đứng giữa khoảng trắng (vd `(/ngày) chữ / khác`) vẫn bị coi là regex. Phép đối chứng `@babel/parser` trong `thu_KHND3a` bắt sai lệch khi xuất hiện trong `src/`.
5. Bài `thu_KHXEM1.js` chứa cụm TOKEN nên người gác chặn chạy bản sửa chưa commit — chỉ chứng minh ĐỎ bằng 4 bài còn lại (xem `bang_chung_do.txt`).
6. Bài học môi trường: ký tự `' '` trong `GiaMon.jsx` là dấu cách không ngắt (U+00A0) — mẫu thay bằng chuỗi gõ tay không khớp; dùng regex bắt ký tự đó khi sửa.

## Câu hỏi
(không có)

## Cổng
- `node tu_chay/cong.js tinh . 21d5df0^ HEAD viec/KH-ND-3b`: chỉ còn `✗ [A19]` (thiếu dòng HEAD ĐÃ KIỂM — ghi ở cuối file này).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 21d5df0^ HEAD viec/KH-ND-3b` (cây sạch, HEAD `93cbd28`): `✓ CỔNG CHẠY ĐẠT`. Lần chạy đầu đỏ 5 × A11 (5 bài B3 xanh trên gốc) → đã thêm 1 ca đỏ-trên-gốc mỗi bài và chép lại SỐ CA (A16).
- `KHONG_TRINH_DUYET=1 node kiem_tra_truoc_khi_giao.js --day-du`: 47 đạt · 0 hỏng (có `vite build`).
- Bản đầy đủ có Chromium (`npm test` / `--day-du` không đặt biến) chạy quá 10 phút ở máy này, đã dừng; chạy riêng `thu_KHND3a.js` (79 đạt) và `thu_KHND3b.js` (38 đạt) với Chromium: xanh. Các bài cũ có phần Chromium khác chưa chạy lại ở máy này (xem CHƯA KIỂM).

## Bảng chỗ vá → đột biến
Việc không đụng tiền / bảo mật, không có `dot_bien.py` (chỉ chuyển chữ). Phép kiểm "chỉ được giảm" của K10 có bài thử đỏ-xanh ở `thu_KHND3a`.

## Nghiệm thu từng mục (bằng chứng)
- A1 `thu_KHND3b` Phần 1 A (danh mục hợp lệ, `macDinh` 26 khoá khớp chữ cũ) + B (12 tệp A1 hết chữ cứng, 81 khoá dùng đều có) + Chromium (Menu / Trang món / Giỏ / Không tìm thấy đổi theo bản giả, có `data-nd` / `data-nd-khoa`).
- A2 `thu_KHND3b` "A2 …" (hai ca) + Chromium nhãn "Da đẹp" ở Menu và Trang món.
- A3 `so_anh/ket_qua.txt`: 18 cặp, 16 giống hệt, 2 cặp 11 điểm nhiễu mép đáy ≤ 6 mức màu.
- B1 `thu_KHND3a` 3 ca "B1 …" (đỏ trên bộ đếm cũ) + commit riêng `3f5c8c4` (kehoach.js 41 → 43).
- B2 `thu_KHND3a` "B2 đối chứng" (94 tệp, lệch 0) + "B2 đối chứng đỏ được".
- B3 5 bài, mỗi bài bản giả "Công nợ" + ca đỏ-trên-gốc (xem `bang_chung_do.txt` mục 3).
- C1 `thu_KHND3b` (20 ca không trình duyệt, 38 ca khi có Chromium). C2 không bài cũ nào đỏ vì chữ chuyển chỗ (`npm test` xanh). C3 `doi_chieu_demo.md`. C4 nợ 766 → 684, `npm test` / `--day-du` / cổng `tinh` + `chay` xong. C5 ở mục "Số khoá thêm" và "Số nợ".

## Báo cáo 7 mục
1. VIỆC: KH-ND-3b — Menu, Trang món, Giỏ hàng (+ ô món, giá, Giờ vàng, thứ trong tuần) đọc chữ qua danh mục; vá bộ đếm K10; B3 năm bài cũ.
2. ĐÃ SỬA: `src/noiDung/nd/menu.js` (86 mục); `Menu/TrangMon/GioHang/MonTheoDuong/KhongTimThay.jsx`, `MonO/GiaMon.jsx`, `gioVang/giaHang/menuLoc/gioHoatDong.js` đọc `nd()`; `cong_cu/ha_no_chu.js` (3 dạng + đệ quy `${}`); `no_chu_cung.txt` (766 → 684); 5 bài cũ + `thu_KHND3a.js` + `thu_KHND3b.js`.
3. BÀI THỬ: xem mục Cổng ở trên.
4. ĐÃ RÀ K4: `grep NHU_CAU` — chỉ còn `noiDung/nhuCau.js` và `nd/trangChu.js` (nguồn); `tenThu`/`bacThang`/`chuGioVang` có chỗ gọi ngoài phạm vi (UuDai, ThanhToan, OGioVang) — giữ chữ ký, chữ mặc định y nguyên.
5. CHƯA KIỂM: phần Chromium của các bài cũ khác trên máy này (quá lâu); trên điện thoại thật / trình duyệt Zalo; quán đóng ở Giỏ (không có khối); Trang món có size / topping (POS chưa có cửa); /admin thật (KH-ADMIN-1) — mới thử bằng `datBanNoiDung`.
6. GIT: nhánh `viec/KH-ND-3b`, commit theo bước (xem `git log`); push `origin viec/KH-ND-3b`; không PR, không merge.
7. BÀI HỌC: mục dưới.

## Bài học
- **KHOÁ (đã làm):** cổng A11 bắt bài sửa "bỏ `\b`" xanh trên gốc → mỗi bài cũ sửa vì luật chung phải kèm một ca gắn với đúng thứ việc này thêm (ở đây: danh mục `menu.js` có chữ để kiểm) thì mới đỏ-trên-gốc thật. Đã thêm ở 5 bài.
- **KHOÁ (đã làm):** đối chứng bộ đếm bằng `@babel/parser` quét MỌI tệp `src` (`thu_KHND3a` B2) — bộ đếm heuristic không còn lệch âm thầm.
- **NGUYÊN TẮC (đề xuất, ngoài Phạm vi `KHUON_LOI.md`):** K4 "mẫu sửa hàng loạt bằng chuỗi gõ tay không khớp dấu cách không ngắt U+00A0 (GiaMon.jsx) — dùng regex hoặc kiểm số lần thay". Đã gây: 1 lần trong việc này (script thay dừng giữa chừng). Dấu hiệu: `KHONG THAY` khi thay một chuỗi nhìn giống hệt. Chặn: kiểm số lần khớp trước khi ghi.
- **BỎ:** lệnh bị người gác chặn (`rm` trong kho, `ps`, `cp && node`, vòng `for`, chạy bài có cụm TOKEN chưa commit): chỉ tốn thao tác, đã làm lại theo hướng dẫn.
- Dọn: không có lời dặn nào trong `KHUON_LOI.md` / `CLAUDE.md` mới có phép kiểm làm thay.

HEAD ĐÃ KIỂM: 93cbd28
