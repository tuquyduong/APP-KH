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
