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

## Soát độc lập vòng 1 (/ra-soat, agent general-purpose, 05.11) — báo cáo
KHÔNG ĐẠT
LỖI TÌM ĐƯỢC:
- src/components/PinSheet.jsx:25-33, 35-48, 55-60 — đặt / đổi PIN: Enter ở màn "Đã lưu mã PIN" gọi xacNhan() → so === dau → datPin chạy lại (PUT /pin lần hai); lỗi mới do F2 (bản cũ useEffect([so]) không gửi lại); không ca nào bắt — K5/K4 (đường song song của Enter).
- viec/KH-MUA-1c/dot_bien.py:24 — VS-GIU-VI-TU-TINH khác kế hoạch (Math.min(so_du_vi, tong)); bản làm `d.tong - d.con_lai` chỉ đỏ ở ca P có tong lệch; ca màn C1 81000 − 51000 = 30000 tự khớp; thiếu ca màn "/toi.so_du_vi khác giu_vi" — K3.
NGHI NGỜ:
- src/pages/ThanhToan.jsx:120 + src/datDon.js:125 — "Gửi lại đúng đơn này" là chuỗi MỚI; 429 QUA_NHIEU_LAN ngay lần đầu → lan === 0 → chưa tạo → ghiGuiDo(null) → hết đếm ngược đặt khoá mới. An toàn chỉ khi POS tra khoá TRƯỚC đếm lượt (hợp đồng v9 dòng 99-100 chỉ ngầm ý) — K1. Không ca thử.
- src/datDon.js:180-183 — ghiGuiDo(null) hỏng mà getItem đọc được → đọc lại bản cũ (chặn oan, hiếm, không gây khoá mới).
- bang_chung_do.txt: số "49 · 44", "46/51/58 px", "demo 0,01 px", "TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT" không có tệp kèm, chưa kiểm lại.
- trang_thai.md: A1 làm trước khi duyệt kế hoạch (có ghi lý do) — lệch quy trình.
NGHIỆM THU: 21/24 · thiếu: E3 (/security-review chưa chạy), E4 (chủ quán thử tay), F3 (hở Enter sau "Đã lưu").
CHƯA SOÁT ĐƯỢC: code POS (thứ tự tra khoá / lượt / KHO_BAN sau chotPhien); không chạy lại dot_bien.py, npm test, --day-du, cổng; WebKit / iPhone / Zalo.
BÀI HỌC: NGUYÊN TẮC — bộ nghe phím toàn cửa sổ của bảng nhiều bước phải tự chặn ở mọi bước kết thúc; KHOÁ — luật "chưa rõ → giữ bản ghi" áp cả chuỗi gửi lại do khách bấm (cu), hoặc POS ghi "tra khoá trước đếm lượt" vào hợp đồng, kèm ca "Gửi lại → 429"; NGUYÊN TẮC — đột biến đúng kế hoạch, ca bắt phải có dữ liệu tự khớp.
(Mục 1–8 chi tiết của người soát: K3 bài có giá trị, chạy lại khớp SỐ CA; K4 POST /don 1 đường, loaiLoi 1 chỗ, ghiGuiDo(null) 4 chỗ, đọc kh_don_gui đủ, PinSheet 3 chỗ; K5 không chặn oan; đường tiền App không tự tính; không dist/, không file ngoài Phạm vi, cmp v9 khớp; đơn giản: dem[nhom] một dòng hơi khó đọc, TheoDoiDon:60 ba nhánh một dòng.)

## Vòng sửa 1
- Lỗi Enter: `PinSheet.jsx` `xacNhan` thêm `xong ||` (màn "Đã lưu" không gửi lại). Ca F3 mới + đột biến VS-PIN-ENTER-SAU-XONG (ĐỎ).
- Nghi ngờ 429 khi "Gửi lại" (đụng tiền — chọn hướng AN TOÀN, cùng tinh thần quyết định Q1 05.11): `ThanhToan.jsx` — đường `cu` nhận `QUA_NHIEU_LAN` → GIỮ bản ghi,
  đếm ngược, rồi "Gửi lại đúng đơn này" đúng khoá. Ca B1 mới `gui-lai-429` + đột biến VS-GUI-LAI-429-XOA (ĐỎ). Hướng này không bao giờ tạo đơn thứ hai;
  giá: khách chờ hết đếm ngược. Xin POS xác nhận thứ tự "tra khoá trước đếm lượt" — xem Câu hỏi Q2 (không chặn việc).
- VS-GIU-VI-TU-TINH: kế hoạch "Math.min(so_du_vi, tong)" KHÔNG đặt được ở Theo dõi đơn (màn này không đọc /toi); đột biến `tong − con_lai` với số POS thật
  luôn bằng `giu_vi` (đột biến tương đương ở dữ liệu thật) → ca P dùng số lệch có chủ ý (ghi chú ở bài) để khoá "đọc NGUYÊN giu_vi". Giữ, ghi rõ ở đây.
- `ghiGuiDo(null)` hỏng → chặn oan (hiếm, hướng an toàn): không sửa, ghi Phát hiện.
- `/security-review`: skill lỗi trong môi trường (không có `origin/HEAD`). Tự rà diff `src/` theo mục bảo mật CLAUDE.md §7: không lưu PIN (grep
  localStorage/sessionStorage/console trên dòng thêm: 0), không fetch ngoài api.js, không innerHTML / eval, cửa mới `GET /chuong-trinh` công khai qua `goi`,
  không bí mật. Không thấy vấn đề. Ghi CHƯA KIỂM: chưa có lượt /security-review chuẩn.
- Đột biến chạy lại: ĐỐI CHỨNG XANH 108 · 0; 17/17 ĐỎ ("TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT"). `--day-du` 32 đạt · 0 hỏng.

## Câu hỏi (thêm — không chặn việc)
- Q2 (cho chat POS): POS `datDon` có tra `khoa_gui` TRƯỚC bước đếm lượt 10 / 10 phút không (khoá đã có đơn → 200 `trung` chứ không 429)? Hợp đồng v9 dòng 99–100
  chỉ ngầm ý. App hiện chọn an toàn: "Gửi lại đúng đơn này" nhận 429 thì giữ bản ghi. Nếu POS xác nhận, đề nghị ghi câu đó vào hợp đồng bản sau.

## Soát độc lập vòng 2 — báo cáo (tóm đủ ý, nguyên kết luận)
KHÔNG ĐẠT — "Phần tiền đúng."
LỖI TÌM ĐƯỢC:
- trang_thai.md — "HEAD ĐÃ KIỂM: 7da938f" cũ (sau đó 678c3c2, bdb864b đổi code); vòng sửa 1 không chạy lại cổng — K1.
- src/pages/ThanhToan.jsx:120 + :166 + :148-149 — "Gửi lại" nhận 429: nút "Gửi lại đúng đơn này" không xét conGiay → bấm được trong lúc đếm ngược (thêm POST, có thể kéo dài chặn);
  không hiện "Thử lại sau N giây"; câu "đếm ngược rồi gửi lại" trong vòng sửa 1 không đúng code — K1, K5 nhẹ. Không sinh đơn thứ hai (cùng khoá).
- cong_cu/thu_KHMUA1c.js:180-192 — ca gui-lai-429 chỉ bấm sau fastForward(31000), xanh cả khi không có đếm ngược — K3.
NGHI NGỜ: đường cu + PIN (ví) + 429 không có ca riêng (đọc code thấy đúng); hai lần Xác nhận liền trước khi vẽ lại có thể đóng bảng PIN sớm, mất lời PIN_SAI
(không đơn thứ hai); Enter ở màn "Đã lưu" bị nuốt (Space vẫn được); 503 PAYOS_CHUA_CAU_HINH = chưa rõ, khách kẹt tới 24 giờ (luật có từ 1b).
Kiểm vòng 1: (a) đúng; (b) đúng về tiền, đếm ngược lỗi như trên; (c) chấp nhận lý do; (d) vẫn chưa có /security-review chuẩn.
K4: datDonApp chỉ api.js:77 qua guiDonAnToan; ghiGuiDo(null) 4 chỗ, không chỗ nào xoá khi KHO_BAN / KHOA_GUI_DA_DUNG / 401; PinSheet 3 chỗ.
Đường tiền: không đường nào gửi khoá MỚI khi đơn có thể đã tạo. Không dist/, không file ngoài Phạm vi, cmp v9 khớp. thu_KHMUA1c 108 · 0 khớp.
NGHIỆM THU: 22/24 · thiếu: E3 (HEAD ĐÃ KIỂM cũ, chưa /security-review chuẩn); E4 chờ chủ quán.
BÀI HỌC: KHOÁ — nút nào gửi lại POST /don sau 429 phải xét cùng điều kiện đếm ngược; ca phải bấm TRONG lúc đếm ngược. NGUYÊN TẮC — mỗi vòng sửa đổi code phải chạy lại cổng
và ghi lại HEAD ĐÃ KIỂM trước khi gọi soát.

## Vòng sửa 2
- `ThanhToan.jsx`: nút "Gửi lại" khoá khi `conGiay > 0` (chữ "Gửi lại sau N giây", `btn-disabled` + `aria-disabled`, hàm `guiLaiDungDon` chặn cả kích bàn phím).
  Ca mới: nút khoá + chữ đếm ngược; bấm (chuột force + `click()` kiểu bàn phím) TRONG lúc đếm ngược → 0 POST thêm; hết đếm ngược gửi lại đúng khoá.
  Đột biến BV-GUI-LAI-CHO-DEM-NGUOC: lần đầu SỐNG (ca chỉ bấm chuột — `.btn-disabled{pointer-events:none}` chặn chuột, không chặn bàn phím) → sửa ca
  thêm `click()` kiểu bàn phím → ĐỎ.
- `PinSheet.jsx`: Enter ở màn "Đã lưu" = "Xong" (đóng bảng); ca F3 kiểm thêm bảng đóng.
- Đột biến: ĐỐI CHỨNG XANH 110 · 0; 18/18 ĐỎ ("TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT"). `--day-du` 32 đạt · 0 hỏng (thu_KHMUA1c 110 · 0).
- Không sửa (ghi lại): hai lần Xác nhận liền (không đơn thứ hai, khoaGui chặn); 503 PAYOS_CHUA_CAU_HINH = chưa rõ (luật 1b, hợp đồng: 5xx chưa rõ) → Phát hiện cho chủ quán.

## Cổng sau vòng sửa 2
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 12fe94d^ HEAD viec/KH-MUA-1c` ở 3800669 → `✓ CỔNG CHẠY ĐẠT` (cảnh báo A16 như trước: mốc chưa có hop_dong_v9.md).
HEAD ĐÃ KIỂM: 3800669
