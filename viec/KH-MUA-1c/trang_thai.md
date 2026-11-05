# KH-MUA-1c — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: `viec/KH-MUA-1c`; cây sạch (`git status --short` rỗng).
- `git fetch origin viec/KH-MUA-1c` → HEAD `12fe94d` · FETCH_HEAD `12fe94d` (bằng nhau, không kéo).
- `git log --oneline -3`:
```
12fe94d PHIEU: KH-MUA-1c
a0b68d0 TIEN-DO: mo KH-MUA-1c (KHO_BAN = chua ro, gui lai cung khoa; hop dong v9; Theo doi don doc giu vi tu POS) - so v25
8497ce3 TIEN-DO: KH-MUA-1b xong (chat soat cuoi DAT, gop PR); quyet dinh 03.11 (loi chao du ten, khach App du truong nhu POS); thu App 03.11 b - so v24
```

## Đối chiếu bản chụp — phiên làm tiếp (05.11, sau duyệt kế hoạch 036e2cf)
- Nhánh `viec/KH-MUA-1c`; cây sạch. `git fetch` → HEAD `0f158cc` · FETCH_HEAD `0f158cc` (bằng nhau, không kéo).
```
0f158cc KH-MUA-1c: bang chung do A1 + trang thai (npm test 29 dat)
7dc7b0f KH-MUA-1c: thu_KHMUA1b A1 so hop dong voi ban moi nhat trong viec/ (nhu thu_KHUI3b)
dd2fdf6 KH-MUA-1c: A1 chep hop dong v9 vao thiet_ke (npm test do tu commit phieu)
```
- Chủ quán duyệt kế hoạch (05.11): Q1 đồng ý cả hai — (1) 4xx đến SAU một lần "chưa rõ" trong cùng chuỗi tự gửi lại = chưa rõ, giữ bản ghi;
  (2) KHO_BAN tự gửi lại tối đa 8 lần (~16 giây), hằng số có tên. Phương án A còn lại theo kế hoạch.

## Bước đang ở (phiên trước)
- Bước 3 xong: `ke_hoach.md` đã viết, agent phụ soát kế hoạch (kết quả ở cuối `ke_hoach.md`).
- Phiếu dặn **"Chờ duyệt kế hoạch"** → commit, push, DỪNG. Chưa viết bài thử, chưa sửa `src/`.
- Ngoại lệ đã làm: nghiệm thu **A1** (chép `viec/KH-MUA-1c/hop_dong_v9.md` → `thiet_ke/HOP_DONG_API_KH.md`, `cmp` khớp). Lý do: Stop hook báo `npm test` ĐỎ
  ngay trên commit phiếu `12fe94d` — `thu_KHUI3b.js` ca A1 "HOP_DONG_API_KH.md = bản hop_dong_v<N>.md mới nhất trong viec/" (173 · 1), vì phiếu thêm v9 vào `viec/`
  mà `thiet_ke/` còn v5. Chép nguyên byte, không quyết định gì; sau chép `thu_KHUI3b.js` 174 · 0, `thu_KHKHOP1.js` 84 · 0.
- Chép v9 làm `thu_KHMUA1b.js` ca A1 đỏ (bài ghim cứng `viec/KH-MUA-1b/hop_dong_v5.md`, 252 · 1) — hai bài cũ đòi hai bản khác nhau. Sửa ca A1 của
  `thu_KHMUA1b.js` theo cùng luật `thu_KHUI3b.js` A1 (bản mới nhất trong `viec/`, v5 trở lên). Đỏ trên v5 (45 · 1), xanh trên v9 (46 · 0) — `bang_chung_do.txt`.
  `npm test` → **29 đạt · 0 hỏng**. (Người gác chặn `git worktree`; kiểm đỏ bằng cách tạm chép bản v5 của `12fe94d` vào `thiet_ke/` rồi chép v9 lại, `cmp` khớp.)

## Câu hỏi
- (Q1 đã trả lời 05.11: đồng ý cả hai — đã làm.)
- Q1 cũ (đụng tiền, xin duyệt cùng kế hoạch): `ke_hoach.md` mục 6 chỉnh 1 — trong một chuỗi tự gửi lại, 4xx có code đến SAU một lần "chưa rõ" (vd 429 sau KHO_BAN)
  thì GIỮ bản ghi = "chưa rõ", không coi là chưa tạo; KHO_BAN tự gửi lại 8 lượt (dưới trần 10 lần / 10 phút của POS) thay ~30 như phiếu gợi ý. Đồng ý thì làm theo.

## Phát hiện
- `src/giaoDien/giaoDien.css:13` `:where(button){ … text-align:inherit }` làm MỌI `<button>` mà demo để mặc định (chữ giữa) bị căn theo khối cha (trái).
  Ngoài `.pin-pad` (sửa trong việc này), còn ít nhất `.qty-ctrl button` (giỏ hàng, `demo_mua.css:11` — phiếu CẤM sửa giỏ) và `.promo-box button`
  (`demo_1.css:58`, có padding nên chưa thấy lệch). Sẽ đo bằng Chromium lúc làm và ghi danh sách đủ ở đây; không sửa ngoài `.pin-pad`.

## Bước 4–7 (phiên 05.11 sau duyệt)
- Bài thử trước: `cong_cu/thu_KHMUA1c.js` (MỚI, 26 ca không trình duyệt / 103 ca có Chromium). Sửa bài cũ theo hành vi chủ quán đã duyệt đổi (phiếu F5):
  `thu_KHMUA1b.js` (tách máy giả thành `dungMay` dùng lại ở 1c; nhập PIN bấm "Xác nhận"; KHOA_GUI_DA_DUNG giữ bản ghi; POS giả thêm v7, `tao+khoban`,
  `PUT /pin`, `sdt` đổi được; ca D1 v9; 401 = `dung`), `thu_KHMUA1.js` (KHO_BAN chưa rõ; gõ PIN rồi Enter), `thu_KHKHOP1.js` (/kiemkhop gọi
  `GET /chuong-trinh`). Đỏ trên gốc / xanh sau vá: `bang_chung_do.txt`.
- Sửa `src/`: `datDon.js` (luật lỗi MỘT chỗ: `LUOT_GUI_LAI = { DANG_XU_LY: 30, KHO_BAN: 8 }`, `MA_DUNG`, 4xx sau một lần chưa rõ = chưa rõ; `docDon` đọc v7;
  `docGuiDo` đọc kho trước, `ghiGuiDo` hỏng thì xoá bản cũ), `ThanhToan.jsx` (KHOA_GUI_DA_DUNG → `da_dung`, khối "có thể đã đặt"), `TheoDoiDon.jsx`
  (ví đã giữ từ POS trước, bản ghi sau), `PinSheet.jsx` + `giaoDien.css` (số giữa nút, `Xoá · 0 · Xác nhận`, Enter / Backspace, "Đang gửi…"),
  `canTuPos.js` (+4 mục v7 / v9), `api.js` (+`layChuongTrinh`, chú thích v9), `KiemKhop.jsx` (gọi `/chuong-trinh`).
- Ngân sách: app `git diff --stat 0f158cc HEAD -- src` ≈ +95 / −50 (≤ 170); thử ≈ +300 1c + ~45 bài cũ (≤ 420).
- `npm test` 30 đạt · 0 hỏng; `node kiem_tra_truoc_khi_giao.js --day-du` 32 đạt · 0 hỏng.

## Chỗ vá → đột biến (`viec/KH-MUA-1c/dot_bien.py`, chạy `python3 viec/KH-MUA-1c/dot_bien.py`: ĐỐI CHỨNG XANH 103 · 0; TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT)
| Chỗ vá | Đột biến | Ca bắt |
|---|---|---|
| `datDon.js` `LUOT_GUI_LAI.KHO_BAN` (KHO_BAN = chưa rõ) | VS-KHO-BAN-CHUA-TAO | B1 (13 ca đỏ) |
| `guiDonAnToan` gửi lại đúng đối tượng `than` | VS-KHO-BAN-KHOA-MOI, VS-KHO-BAN-THAN-KHAC | B1 KHO_BAN ×5, 9 lần y hệt |
| `guiDonAnToan` `lan === 0` (4xx sau chưa rõ) | VS-KHO-BAN-429-CHUA-TAO | B1 Q1 KHO_BAN×3→429, 5xx→PIN_SAI |
| `ThanhToan` KHOA_GUI_DA_DUNG giữ `da_dung` | VS-KHOA-DA-DUNG-XOA | B2 màn |
| `docDon` đọc nguyên `giu_vi` | VS-GIU-VI-TU-TINH | C1 P |
| `TheoDoiDon` POS trước bản ghi | VS-GIU-VI-BAN-GHI-TRUOC | C1 bản ghi khác số, C2 |
| `TheoDoiDon` đơn quầy null → không dòng ví | VS-DON-QUAY-DONG-VI | C2 |
| `ThanhToan` điểm gửi `!bg` | BV-DIEM-GUI-BAO-GIA | D1 |
| `loaiLoi` 401 = dung | VS-401-CHUA-TAO | B1 401 |
| `ThanhToan` MA_PIN giữ bản ghi khi gửi lại | VS-PIN-DANG-KHOA-XOA | D2 |
| `docGuiDo` đọc kho trước | BV-GHI-HONG-DOC-KHO | D4 |
| `PinSheet` không tự gửi | VS-PIN-TU-GUI | F2, F3 |
| `PinSheet` Xoá lùi một số | VS-PIN-XOA-HET | F2 |
| `giaoDien.css` `.pin-pad button{ text-align:center }` | BV-PIN-GIUA | F1 (6 ca) |
Tên đột biến: VS-KHO-BAN-CHUA-TAO, VS-KHO-BAN-KHOA-MOI, VS-KHO-BAN-THAN-KHAC, VS-KHO-BAN-429-CHUA-TAO, VS-KHOA-DA-DUNG-XOA, VS-GIU-VI-TU-TINH,
VS-GIU-VI-BAN-GHI-TRUOC, VS-DON-QUAY-DONG-VI, BV-DIEM-GUI-BAO-GIA, VS-401-CHUA-TAO, VS-PIN-DANG-KHOA-XOA, BV-GHI-HONG-DOC-KHO, VS-PIN-TU-GUI,
VS-PIN-XOA-HET, BV-PIN-GIUA.

## Phần trình duyệt (máy làm việc, Chromium) — kết quả thật
- thu_KHMUA1c 103 đạt · 0 hỏng · thu_KHMUA1b 254 · 0 · thu_KHMUA1 128 · 0 · thu_KHKHOP1 85 · 0.
- Ảnh 360 / 390 / 430 (trả ví + đặt PIN) demo ↔ app: `so_anh/cap-pin-*.png`; `doi_chieu_demo.md`. Demo đo số lệch ngang 0,01 px; app gốc 46 / 51 / 58 px; app vá ≤ 1 px.

## Phát hiện (thêm)
- Cùng gốc `:where(button){ text-align:inherit }`: `.ghost-btn` (nút "Xem Lịch sử đơn", "Bỏ qua, đặt đơn mới" — ảnh `so_anh/thanhtoan-khoa-da-dung-390.png`,
  demo `.ghost-btn` là `<button>` chữ giữa) đang chữ TRÁI ở mọi màn có nút này; `.qty-ctrl button` (giỏ — phiếu cấm). Không sửa ở việc này; đề xuất một việc
  giao diện riêng: rà mọi `<button>` của demo mặc định chữ giữa (bỏ `text-align:inherit` hoặc thêm luật cho từng khuôn) + so ảnh.
- C3: `thiet_ke/QUYET_DINH_APPKH.md` — chủ quán / chat tự rà ghi chú "tạm, chờ POS v7" nếu có (máy không sửa sổ).

## Cổng (trước /ra-soat — phiếu E3)
- `node tu_chay/cong.js tinh . 12fe94d^ HEAD viec/KH-MUA-1c` → chỉ `✗ [A19]` (thiếu dòng HEAD ĐÃ KIỂM — ghi dưới).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 12fe94d^ HEAD viec/KH-MUA-1c` → `✓ CỔNG CHẠY ĐẠT` (cảnh báo A16: thu_KHMUA1c trên mốc in 23 ca ≠ 26 — mốc chưa có hop_dong_v9.md, nhóm A dừng sớm).
  Lần chạy đầu đỏ A16 vì dòng `SỐ CA` thiếu tiền tố `cong_cu/` — đã sửa (7da938f).
HEAD ĐÃ KIỂM: 7da938f
