# KH-NHANH-2 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: `viec/KH-NHANH-2` · cây sạch · HEAD `2ba09a5` · FETCH_HEAD `2ba09a5` (bằng nhau — không kéo).
- `git log --oneline -3`:
  - `2ba09a5 PHIEU: KH-NHANH-2`
  - `88af1ef TIEN-DO: mo KH-NHANH-2 (vong xoay cho kieu B + tong cu mo + preconnect + bao gia gui ngay); quyet dinh 18.11; thu POS 18.11; ban giao`
  - `706ed73 TIEN-DO: KH-VC-2 xong (PR #43) + KH-NAP-1 xong (PR #44); KH-SUA-2 them (8)-(11); KH-DOI-1 theo hop dong POS da hen + PIN; KH-HUY-1 mo duoc; quyet dinh 17.11; thu POS 16.11 (doi diem) + thu App 17.11; ban giao`
- Kho mở ở dạng nông: `thu_KHND3e` (đọc lịch sử git tìm commit KH-ND-3e) đỏ 2 ca vì không thấy commit cũ → `git fetch -q --unshallow origin viec/KH-NHANH-2`
  (chỉ tải lịch sử, không đổi tệp) → xanh. Không liên quan code của việc.

## Tiến độ
- [x] 1 đối chiếu · [x] 2 đọc · [x] 3 kế hoạch (agent phụ soát → sửa, xem ke_hoach.md) · [x] 4 bài thử đỏ · [x] 5 sửa · [x] 6 kiểm · [ ] 8 soát · [x] 10 báo cáo

## Chỗ vá → đột biến (viec/KH-NHANH-2/dot_bien_tay.js — việc chỉ đổi src/ + index.html, không có server/ client/src/ → không dot_bien.py, như KH-VC-2)
| Chỗ vá | Đột biến | Kết quả |
|---|---|---|
| api.js `goi`: lượt ngầm không đếm | VS-DEM-CA-LUOT-NGAM | BẮT ĐƯỢC (33 đạt · 4 hỏng) |
| api.js trễ 300 ms | BV-BO-TRE-300 | BẮT ĐƯỢC |
| cho.css vòng không nền | VS-VONG-CO-NEN | BẮT ĐƯỢC |
| cho.css không lớp phủ | VS-LOP-PHU-CA-MAN | BẮT ĐƯỢC |
| datDon.js `taoGop` gom đầu | VS-GOM-CHI-DUOI | BẮT ĐƯỢC |
| index.html preconnect chỉ gốc | VS-PRECONNECT-CO-API | BẮT ĐƯỢC |
| duLieuKhach.js kho đã có dữ liệu → ngầm | BV-KHO-DA-CO-VAN-DEM | BẮT ĐƯỢC |
| GioHang nút khoá khi tính lại | VS-NUT-DI-TIEP-MO-KHI-TINH-LAI | BẮT ĐƯỢC (Chromium) |
| GioHang số trên nút chỉ báo giá mới | VS-NUT-MANG-SO-CU | BẮT ĐƯỢC (Chromium) |
| dungDatDon.js `huy` theo khoá (lượt cũ về muộn) | BV-LUOT-CU-GHI-DE-GIO-MOI | BẮT ĐƯỢC (Chromium) |
| dungDatDon.js lượt đồng hồ ngầm | BV-THEO-DOI-DONG-HO-DEM | BẮT ĐƯỢC (Chromium) |
| dungDatDon.js lỗi / CHUA_MO → xong (không kẹt đang tính) | VS-LOI-KET-DANG-TINH | BẮT ĐƯỢC (Chromium, vòng sửa 1) |
| Menu.jsx tab Menu khi đã có menu → ngầm | BV-TAB-MENU-DEM | BẮT ĐƯỢC (Chromium, vòng sửa 1) |
| main.jsx nạp cho.css | BV-BO-NAP-CHO-CSS | BẮT ĐƯỢC (Chromium, sau soát vòng 2) |
| VongCho.jsx ẩn khi màn mở đang hiện (chủ quán chọn b, 19.11) | VS-VONG-HIEN-TREN-MAN-DAU | BẮT ĐƯỢC (Chromium, 70 đạt · 2 hỏng) |
Dòng cuối: `TẤT CẢ ĐỘT BIẾN BỊ BẮT` (15/15 sau trả lời 19.11; `node viec/KH-NHANH-2/dot_bien_tay.js --trinh-duyet`).

## Phần trình duyệt (chạy thật ở máy — §9)
- `node cong_cu/thu_KHNHANH2.js` (Chromium 390, POS giả trễ): 72 đạt · 0 hỏng (sau trả lời 19.11: +2 ca màn mở — đang hiện + POS chậm 1,5 s → không vòng; "Bỏ qua" khi lượt còn chờ → vòng hiện). `KHONG_TRINH_DUYET=1`: 37 đạt · 0 hỏng (= SỐ CA).
- `node cong_cu/thu_KHMUA1.js` có Chromium: 130 đạt · 0 hỏng; `KHONG_TRINH_DUYET=1`: 57.
- Ảnh 390 (`so_anh/`): Trang chủ đang tải, Giỏ đang tính lại, Thanh toán đang gửi — nhánh + `_goc` (gốc cùng thời điểm: không vòng; Giỏ gốc trống tổng).

## Kiểm (bước 6)
- `npm test`: 65 đạt · 0 hỏng (K1b 2 lối fetch, K2, K9, K10 xanh — K10: 0 chữ cứng mới, các chữ mới ở `nd/menu.js`).
- `node kiem_tra_truoc_khi_giao.js --day-du`: 68 đạt · 0 hỏng (vite build, K2d chỉ /api/kh + /api/nd).
- `node tu_chay/cong.js tinh . 2ba09a5^ HEAD viec/KH-NHANH-2`: chỉ `✗ [A19]` (chưa có dòng HEAD ĐÃ KIỂM — bình thường ở bước đó).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 2ba09a5^ HEAD viec/KH-NHANH-2` tại b02b85a: ✓ CỔNG CHẠY ĐẠT
- Ngân sách: app 111 dòng thêm / 39 bỏ (13 tệp src + index.html) ≈ ngân sách ~120; thử: thu_KHNHANH2 ~300 dòng + thu_KHMUA1 B5.

## Báo cáo 7 mục
- **VIỆC:** KH-NHANH-2 — vòng xoay chờ POS kiểu B (chỉ lượt khách chờ, > 300 ms, giữa màn, không nền / phủ), tổng cũ mờ khi tính lại, vòng nhỏ trên nút gửi,
  preconnect tới gốc POS, báo giá gom đầu + đuôi.
- **ĐÃ SỬA:** `src/api.js` (bộ đếm MỘT chỗ: `goi` bọc `goiThat`, `ngam()`, `CUA_NGAM`, `theoDoiDangCho`, `MS_TRE_CHO`; `giaHan` ngầm) · `src/duLieuKhach.js` (kho đã
  có dữ liệu thật → ngầm) · `src/dungDatDon.js` (`bgCu`, `dangTinh`; Theo dõi đơn lượt đồng hồ ngầm) · `src/datDon.js` (`taoGop` đầu + đuôi) · `src/App.jsx` (gắn
  `<VongCho />`; quảng cáo quay lại App + menu sau đơn trả → ngầm) · `src/pages/Menu.jsx` (bấm tab khi đã có menu → ngầm) · `src/components/VongCho.jsx` (MỚI) ·
  `src/giaoDien/cho.css` (MỚI) · `src/components/ManDau.jsx` (chỉ báo hiện / tắt cho VongCho qua `baoManDau` — chủ quán chọn b, 19.11) · `src/pages/GioHang.jsx` (`BangTien` số cũ mờ / "Đang tính tiền…"; nút đi tiếp khoá khi tính lại; bỏ ref `bgCu` riêng) ·
  `src/pages/ThanhToan.jsx` (BangTien + vòng trắng trên nút Đặt đơn) · `src/components/PinSheet.jsx` (vòng trên nút Xác nhận) · `src/noiDung/nd/menu.js`
  (khoá mới `khung.dangCho`, `gio.dangTinh`) · `index.html` (script preconnect).
- **BÀI THỬ:** `cong_cu/thu_KHNHANH2.js` MỚI (đỏ gốc 16/35, xanh 72/0 có Chromium; SỐ CA 37) · `cong_cu/thu_KHMUA1.js` B5 đổi có chủ đích (đỏ gốc 2 ca, xanh 130/0; SỐ CA 57).
  Đột biến tay 15/15 BẮT ĐƯỢC (sau trả lời 19.11).
- **ĐÃ RÀ K4:** mọi chỗ gọi hàm api.js (grep, bảng chờ / ngầm trong ke_hoach.md); mọi `setInterval` / `visibilitychange` gây gọi mạng; mọi nút có chữ "Đang gửi…"
  (`tt.nut.dangGui`, `tt.nut.guiLai`, `pin.dangGui`); BangTien dùng ở Giỏ + Thanh toán đồ uống (Thanh toán nạp có bảng riêng — phiếu không đòi).
- **CHƯA KIỂM:** điện thoại thật 4G, trình duyệt Zalo (D6 — chủ quán thử tay: mở App → vòng giữa màn, không mờ; Giỏ bấm + liên tục → tổng cũ mờ + vòng nhỏ;
  Theo dõi đơn đứng yên 30 s → không vòng nhấp nháy) · preconnect trên Cloudflare thật (chỉ kiểm bằng `vite build` với biến giả) · 360 / 430 cho vòng xoay
  (chỉ đo 390; vòng là phần tử 36 px tâm khung — không phụ thuộc rộng) · so ảnh `LUU_ANH_DIR` gốc ↔ nhánh cho các màn NGOÀI phạm vi (D4 — để chat soát).
- **GIT:** nhánh `viec/KH-NHANH-2`, commit `b04f2df` … `b02b85a` (+ commit ghi trạng thái này), đã push. Không merge, không PR.
- **BÀI HỌC:** xem mục dưới.

## Nghiệm thu — từng mục
| Mục | Bằng chứng |
|---|---|
| A1 đếm lượt chờ, ngầm không tính, MỘT chỗ, không đổi fetch | thu_KHNHANH2 khối A1 (12 ca Node, dòng 61-131) + 7 ca đọc nguồn chỗ ngầm (mảng NGAM) + ca hành vi menu-ngam / theo-doi / quay lại App + ca "goi bọc goiThat, 2 fetch(" + K1b; đột biến VS-DEM-CA-LUOT-NGAM, BV-KHO-DA-CO-VAN-DEM |
| A2 VongCho > 300 ms, giữa .phone, không nền / phủ, pointer-events none, 36 px, role, nhãn danh mục, reduced-motion | Chromium "mở App POS 1,5 s" (4 ca) + ca bấm được nút + ca ẩn khi xong + đọc nguồn reduced-motion; BV-BO-TRE-300, VS-VONG-CO-NEN, VS-LOP-PHU-CA-MAN |
| A3 cho.css tiền tố cho-, màu demo, khung-tai giữ | ca "mọi lớp cho-" + K9 (npm test); không sửa khung-tai (`git diff` không đụng) |
| B1 số cũ mờ / "Đang tính tiền…" / câu cũ khi không hỏi / lỗi như cũ | Chromium ca gio (3 ca B1) + gio-chua-dn + thanh-toan "Đang tính tiền…" + (vòng sửa 1) gio-loi: lỗi → không số cũ, CHUA_MO → câu cũ, nút mở |
| B2 nút khoá khi tính lại, không số cũ, một bản nhớ bgCu | Chromium B2 (Giỏ 2 ca, Thanh toán 1 ca) + đọc nguồn "Giỏ không còn ref"; VS-NUT-DI-TIEP-MO-KHI-TINH-LAI, VS-NUT-MANG-SO-CU |
| B3 vòng nhỏ trên nút Đặt đơn / PIN | Chromium "Đặt đơn đang gửi → vòng trắng", "lỗi → hết vòng" + đọc nguồn PIN |
| C1 preconnect gốc, không /api, biến trống không dòng | 4 ca (chạy script với document giả, 3 biến; vite build thật với VITE_POS_API); K2 / K2d xanh; VS-PRECONNECT-CO-API |
| C2 gom đầu + đuôi, lượt cũ không ghi đè | 4 ca Node taoGop + Chromium "gửi ngay < 300 ms" + "lượt cũ về muộn không ghi đè"; thu_KHMUA1 B5 ×2; VS-GOM-CHI-DUOI, BV-LUOT-CU-GHI-DE-GIO-MOI |
| C3 số lượt mở App không đổi | Chromium C3 (5 cửa mỗi cửa 1 lượt) + thu_KHNHANH1 230/0 |
| D1 bài mới, POS giả trễ, đỏ gốc | bang_chung_do.txt |
| D1 Theo dõi đơn 3 s / quay lại App 60 s không vòng | Chromium 2 ca; BV-THEO-DOI-DONG-HO-DEM |
| D2 bài cũ đổi có chủ đích, đỏ gốc cả KHONG_TRINH_DUYET | thu_KHMUA1 B5 (gốc KHONG_TRINH_DUYET=1: 56/1) |
| D3 ≥ 6 đột biến tay đỏ | 15/15 (sau trả lời 19.11) |
| D4 ảnh 390 trước / sau | so_anh/ (3 cặp); màn ngoài phạm vi: CHƯA KIỂM (chat soát) |
| D5 npm test, --day-du, tinh + chay, K10 | mục Kiểm |
| D6 thử tay | CHƯA KIỂM (chủ quán) |
| "mọi thứ mới có khoá + data-nd, sửa được ở /admin" | khoá thêm: `khung.dangCho` (nhãn vòng, `data-nd`), `gio.dangTinh` (`<Chu>`); vòng xoay / màu là hình, không chữ; kiemDanhMuc trong thu_KHND3d/3e xanh |

## Bài học
- Người gác chặn (`.tu_chay_nhat_ky.jsonl`): B-BIMAT-FILE (`ls .env*`), SED-I, GIT-LENH (`stash`), B-DICHCHU (biến làm đích ghi), B-CHUONGTRINH (`until`, `for`),
  B-CD-VITRI, B-PHANTICH ×4 — trong đó 2 lần do chính mẫu grep `hỏng$"` (người gác đọc `$"` như chuỗi bash) và 1 lần do script python chưa commit có `${…}`.
  → **NGUYÊN TẮC** (không vào khuôn K1–K3 nào, mở K4 khi gom): "Lệnh lọc kết quả bài thử: dùng `grep \" hỏng\"` (không `$` cuối); sửa tệp có `${` bằng Edit, không
  python heredoc". Đề xuất ghi vào `KHUON_LOI.md` (ngoài Phạm vi — chat soát duyệt).
- Bài thử đỏ bất ngờ trên nhánh: đo cỡ vòng bằng `getBoundingClientRect` → 51 px khi chụp đúng lúc vòng xoay 45°. **KHOÁ** (đã làm trong Phạm vi): đo `offsetWidth`.
- Agent phụ soát kế hoạch bắt 3 lỗi thật (tệp ngoài Phạm vi, lượt trong effect sau lần vẽ — bọc ở setInterval vô tác dụng, `tuMay` làm Hồ sơ mất vòng).
  **NGUYÊN TẮC:** "đánh dấu theo phần đồng bộ của lời gọi chỉ đúng khi chỗ gọi gọi api NGAY" — đã ghi thành chú thích ở `api.js`, không cần mục mới.
- Kho nông làm thu_KHND3e đỏ (đọc lịch sử git). **BỎ** — môi trường; đã ghi ở mục đầu.

## Phát hiện
- Bài đọc nguồn cũ của BaoDonXong (thu_KHBAO1 A2, thu_KHNHANH1 KH-BAO-1 D1) khoá nguyên văn `const hoiNgay = …` → không bọc được `ngam` ở đó; luật kho
  (`taoCua`: đã có dữ liệu → ngầm) đã phủ trường hợp có đơn đang chạy. Còn sót: quay lại tab khi kho /don CHƯA có dữ liệu (vd lần đầu lỗi) → một lượt "chờ".
- `src/heThong.js` / `src/giaHan.js` ngoài Phạm vi → ba cửa nền đánh dấu theo đường ở api.js (`CUA_NGAM`). Mở thẳng `/uudai/hang` mà CHỈ /hang chậm → không vòng.
- Báo giá (`baoGiaGio`) không có giờ chờ tối đa (`choMs`): lượt treo trên 4G → nút "Tiếp tục" Giỏ khoá + vòng giữa màn tới khi trình duyệt bỏ lượt.
  Đổi giờ chờ báo giá là ngoài phiếu (hợp đồng gửi / gửi lại) — đề xuất việc sau.
- `CUA_NGAM` (api.js) là cách lách vì heThong.js ngoài Phạm vi — đề xuất việc sau chuyển `ngam(...)` về heThong.js (cùng GvDem, giaHan.js) và bỏ danh sách đường.
- Lúc bấm + ở Giỏ (báo giá > 300 ms) / Đặt đơn: CÙNG LÚC vòng giữa màn + vòng nhỏ ở bảng tiền / nút. Phiếu đòi cả hai; chủ quán xem ở D6 có muốn tắt vòng giữa
  màn khi đã có vòng tại chỗ không.
- §11 `hien.<khối>` cho vòng xoay: chuyển thành `## Câu hỏi` (soát vòng 2: lệch luật thì hỏi, không tự quyết "việc sau").

HEAD ĐÃ KIỂM: b02b85a

## Soát độc lập — vòng 1 (báo cáo nguyên văn của agent soát)
```
KHÔNG ĐẠT

Tóm tắt: code của việc làm đúng (đường tiền vẫn an toàn, bài thử chạy xanh, không có dist/). Hai lý do không đạt: mục nghiệm thu B1 có một phần không có bài thử nào kiểm, và trang_thai.md ghi đã kiểm phần đó. Các lối hợp lệ của K5 (CHUA_MO, lỗi báo giá) cũng chưa có ca thử.

Tôi đã tự chạy lại `KHONG_TRINH_DUYET=1 node cong_cu/thu_KHNHANH2.js` được 37 đạt · 0 hỏng, và bản có Chromium được 62 đạt · 0 hỏng, khớp với bang_chung_do.txt.

LỖI TÌM ĐƯỢC:
- viec/KH-NHANH-2/trang_thai.md:68 — Dòng B1 ghi "lỗi như cũ" đã có bằng chứng, nhưng không có ca nào kiểm. POS giả luôn trả báo giá thành công (cong_cu/thu_KHNHANH2.js:247), không có ca báo giá lỗi hay CHUA_MO. Vì vậy chưa kiểm được ba điều phiếu đòi ở B1: "Có lỗi báo giá → không hiện số cũ" (src/pages/GioHang.jsx:29 `cu = dangTinh && !bg && !loi ? bgCu : null`); "CHUA_MO → câu cũ"; nút Tiếp tục không bị khoá vĩnh viễn (src/dungDatDon.js:27 đặt `xong:true` cho mọi lỗi). Kế hoạch tự nêu chỗ này phải canh (viec/KH-NHANH-2/ke_hoach.md:78) nhưng không có ca thử. Thuộc K1 + K5 + K3.
- viec/KH-NHANH-2/ke_hoach.md:17,18,22 — Bảng "chờ / ngầm" sai so với code, và trang_thai.md:63 trỏ về bảng này.
  - Dòng 17 ghi heThong lúc mở App là "chờ". Thật ra src/api.js:47 (`CUA_NGAM`) và :61 luôn coi `/hang`, `/gio-vang`, `/gio-hoat-dong` là ngầm, kể cả lần đầu mở App.
  - Dòng 18 ghi `ngam(nap)`, nhưng src/heThong.js không đổi.
  - Dòng 22 ghi "`ngam` ở `hoiNgay`", nhưng src/components/BaoDonXong.jsx:12 không đổi.
  - Mục "Sửa kế hoạch" (dòng 32–38) có nói lại, nhưng bảng vẫn để như cũ.
  - Thuộc K1.
- viec/KH-NHANH-2/ke_hoach.md:63 — Bảng ca thử ghi "huỷ (choMs) → về 0" là ca Node. Khối A1 (cong_cu/thu_KHNHANH2.js:61-131) chỉ thử lỗi mạng và 401, không thử huỷ do quá giờ (AbortController). Thuộc K1 (nhẹ).
- viec/KH-NHANH-2/ke_hoach.md:12 — Ghi màu `rgba(255,255,255,.45)`, còn code dùng `.35` (src/giaoDien/cho.css:4). Thuộc K1 (nhẹ).

NGHI NGỜ:
- src/pages/GioHang.jsx:127 — Nút "Tiếp tục" của Giỏ nay khoá theo `dangTinh`. Trước đây nút này không phụ thuộc báo giá. `baoGiaGio` không có giờ chờ tối đa (src/api.js:142), nên nếu lượt báo giá treo thì nút khoá và vòng giữa màn hiện cho tới khi trình duyệt tự bỏ lượt. Phiếu B2 có đòi khoá, nhưng đây là đường mới có thể khoá oan khi mạng 4G treo.
- `CUA_NGAM` theo đường dẫn (src/api.js:47,61) là luật ẩn: sau này màn nào khách thật sự chờ `/hang` (vd mở thẳng /uudai/hang) cũng không có vòng. Đã ghi trong Phát hiện.
- Mỗi lần bấm + trong Giỏ (báo giá khoảng 0,7 s, quá 300 ms) và lúc Đặt đơn sẽ có HAI vòng cùng lúc: vòng giữa màn và vòng nhỏ ở bảng tiền / nút. Chưa rõ bản thử chủ quán chọn có như vậy không. Cần chủ quán xem ở D6.
- §11 CLAUDE.md: "khối mới có mục `hien.<khối>`". Vòng giữa màn và dòng "Đang tính tiền…" không có khoá `hien.*` để ẩn / hiện ở /admin. Chỉ có `khung.dangCho` và `gio.dangTinh` (src/noiDung/nd/menu.js:80,91). Có thể chấp nhận nếu coi vòng xoay là hình chỉ báo, không phải khối, nhưng chưa được nói rõ.
- src/dungDatDon.js:46-56 (ref `dongHo`): nếu khách bấm "Thử lại" trùng nhịp đồng hồ thì lượt đó thành ngầm. Lượt `/menu` tự gọi lại sau 401 (src/dungMenu.js:33) không còn ngầm. Ảnh hưởng nhỏ.
- Khi đơn QR vừa trả, `daTra` gọi `lamMoi([cuaDon, cuaVoucher])` (src/App.jsx:245). Nếu kho voucher chưa có dữ liệu thì lượt đó tính là chờ, vòng có thể loé lên lúc phát hiện đơn đã trả.

(Kết quả từng mục 1–8: K3 bài có giá trị, vài ca đọc nguồn là marker suông (Menu, daTra, PinSheet, "Giỏ không còn ref"); K4 mọi chỗ ngam gọi api đồng bộ, đủ;
 K5 luồng hợp lệ đúng theo code nhưng thiếu ca; đường tiền an toàn (khoa Thanh toán có !bg, số nút Giỏ chỉ bg, bgCu chỉ hiển thị + ô voucher); không dist/;
 Đơn giản: cho.css nạp ngầm qua VongCho → nên ở main.jsx; dấu cách thừa PinSheet:72; chú thích index.html có %VITE_POS_API%; CUA_NGAM gần trùng CUA_CONG_KHAI.)

NGHIỆM THU: 14/16 mục có bằng chứng · mục thiếu: B1 (phần "lỗi báo giá → không số cũ", "CHUA_MO → câu cũ" không có ca thử) · D4 (thiếu phần so ảnh màn ngoài phạm vi, trang_thai ghi "để chat soát").

CHƯA SOÁT ĐƯỢC: không tự chạy được dot_bien_tay.js; npm test / --day-du quá 500 s (đã dừng); chưa chạy cổng, thu_KHMUA1, thu_KHNHANH1; không điện thoại
thật / 4G / Zalo; chưa so ảnh LUU_ANH_DIR màn ngoài phạm vi; chưa xem Artifact bản thử.

BÀI HỌC:
- KHOÁ: mỗi phiếu đổi hiển thị tiền phải có ca POS giả trả lỗi báo giá và trả CHUA_MO, kiểm "không số cũ" và "nút không khoá vĩnh viễn".
- KHOÁ: bài đọc nguồn kiểu "có bọc ngam" nên có ca hành vi đi kèm (POS giả trễ, bấm tab Menu khi đã có menu → không vòng).
- NGUYÊN TẮC (KHUON_LOI.md): khi kế hoạch đổi hướng sau khi soát, sửa luôn bảng gốc, không chỉ thêm mục "Sửa kế hoạch" bên dưới.
- NGUYÊN TẮC: lượt POS khách đang chờ mà có thể treo (báo giá) nên có giờ chờ tối đa (choMs) — ngoài phiếu, ghi Phát hiện.
```

### Vòng sửa 1
- Ca mới (Chromium) `gio-loi`: báo giá lỗi → lời POS, KHÔNG số cũ, không mờ / vòng, nút đi tiếp MỞ; POS trả CHUA_MO → "Tổng tiền sẽ hiện…", nút MỞ.
- Ca mới `menu-ngam`: bấm tab Menu khi đã có menu (quá 5 phút) → /menu hỏi lại ngầm, không vòng (ca hành vi cho chỗ trước chỉ đọc nguồn).
- Đột biến thêm: VS-LOI-KET-DANG-TINH (lỗi giữ "đang tính" → nút kẹt), BV-TAB-MENU-DEM → 13/13 BẮT ĐƯỢC.
- `ke_hoach.md`: bảng chờ / ngầm sửa khớp code (heThong lần đầu = ngầm qua `CUA_NGAM`, BaoDonXong = luật taoCua, giaHan bọc trong api.js), bỏ "huỷ choMs"
  khỏi ca Node, màu .35.
- Gọn: `cho.css` nạp ở `main.jsx` (bỏ khỏi VongCho); bỏ dấu cách thừa PinSheet; chú thích index.html không còn `%VITE_POS_API%`.
- Nghi ngờ còn lại (không sửa, ghi Phát hiện): giờ chờ báo giá, CUA_NGAM, hai vòng cùng lúc, `hien.*`. "Thử lại" trùng nhịp đồng hồ / daTra voucher trống: nhỏ, bỏ.
- D4 phần so ảnh màn ngoài phạm vi: việc của chat soát cuối (phiếu D4 "soát cuối so ảnh") — vẫn ghi CHƯA KIỂM.
- thu_KHNHANH2 có Chromium 68 đạt · 0 hỏng; KHONG_TRINH_DUYET=1 37 (SỐ CA không đổi).

- Kiểm lại sau vòng sửa 1: npm test --day-du 68 đạt · 0 hỏng; KHONG_TRINH_DUYET=1 cổng chay: ✓ CỔNG CHẠY ĐẠT (CẢNH BÁO A16 26 ≠ 37 ca — bài dừng sớm trên gốc, xem bang_chung_do.txt).

HEAD ĐÃ KIỂM: b84bf8f

## Soát độc lập — vòng 2 (báo cáo của agent soát, chép gọn các dòng kết luận; nguyên văn mục LỖI / NGHI NGỜ / NGHIỆM THU / BÀI HỌC)
```
ĐẠT

Kết luận: các lỗi của vòng 1 đã được sửa thật, đường tiền vẫn an toàn và tôi chạy lại bài thử thấy xanh. Những gì còn lại là lỗi nhẹ ở hồ sơ và bài thử, cùng vài chỗ nên hỏi chủ quán; không có lỗi nào làm khách thấy sai hay trả sai tiền.
(Tự chạy: KHONG_TRINH_DUYET=1 thu_KHNHANH2 → 37 đạt · 0 hỏng; có Chromium → 68 đạt · 0 hỏng. Lỗi vòng 1: báo giá lỗi / CHUA_MO, bảng chờ/ngầm, choMs, màu .35, tab Menu → ĐÃ SỬA.)

LỖI TÌM ĐƯỢC:
- cong_cu/thu_KHNHANH2.js:199 — Ca Chromium tự nạp MỌI tệp src/giaoDien/*.css, kể cả tệp không ai import. Nếu sau này dòng import cho.css ở main.jsx bị bỏ, vòng xoay mất hết kiểu mà cả 68 ca vẫn xanh — K3 (bài thử xanh oan), nhẹ.
- viec/KH-NHANH-2/trang_thai.md — chỉ ghi thêm mục mới, không sửa chỗ gốc: dòng 29 và 53 "11/11", bảng đột biến thiếu 2 đột biến mới; dòng 32 và 52 "62 đạt" (nay 68); dòng 65 "9 ca Node + 8 ca đọc nguồn" (thật: 12 ca A1, mảng NGAM 7 mục) — K1 nhẹ.
- viec/KH-NHANH-2/ke_hoach.md — dòng 62 còn ghi đọc nguồn "heThong, GvDem, BaoDonXong"; dòng 70 ghi VITE_POS_API=https://pos.vi-du.test/ (bài dùng https://www.pos-vi-du.test) — K1 nhẹ.
- viec/KH-NHANH-2/so_anh/ — CLAUDE.md §5(2) đòi ảnh tô chỗ lệch và cỡ 360 / 430; chỉ có 3 cặp ảnh 390 — nhẹ.

NGHI NGỜ:
- Vòng xoay đè lên màn mở: z-index 9000 (cho.css:6) > .splash-screen 100 (demo_1.css:108), màn mở ~5,9 s mỗi ngày đầu (ManDau.jsx:12); lượt /menu, /toi… trên 4G > 300 ms → vòng hồng có thể hiện giữa màn mở, chồng chữ / khẩu hiệu B2.3. Bài thử né (đặt sẵn kh_ngay_man_dau). Nên đưa vào D6 hoặc ## Câu hỏi.
- §11 khối mới cần hien.<khối>: vòng và "Đang tính tiền…" không có hien.* — đã tự quyết "việc sau" trong khi §11 viết "không để việc sau"; nên ghi ## Câu hỏi.
- Ba chỗ ngầm chỉ có bài đọc nguồn: ngam(hoiQuangCao) (App.jsx:136), ngam(() => menu.taiLai(true)) (App.jsx:245), vòng nút PIN (thu_KHNHANH2.js:158).
- Báo giá treo làm kẹt Giỏ (không choMs, api.js:131; GioHang.jsx:127) — đã ghi Phát hiện; phiếu B2 đòi khoá.
- Vòng loé khi bat chuyển false trong 600 ms (hẹn giờ gom đuôi không huỷ; lượt cũ vẫn gửi như code gốc, chỉ vòng loé là mới) — dungDatDon.js:19-28.
- Kho chưa có dữ liệu → mỗi 5 phút lamMoi một lượt "chờ" (duLieuKhach.js:105) — đúng chữ phiếu nhưng có thể nhấp nháy.

NGHIỆM THU: 16/16 mục có bằng chứng · không mục nào thiếu hẳn (D4 phần so ảnh màn ngoài phạm vi và D6 đã ghi CHƯA KIỂM; D3, D5 chỉ có lời ghi, chưa chạy lại).

CHƯA SOÁT ĐƯỢC: không chạy được dot_bien_tay.js --trinh-duyet (bị chặn); không chạy npm test / --day-du / cổng; không điện thoại / 4G / Zalo; chưa thấy cảnh vòng chồng màn mở; chưa xem Artifact bản thử, chưa so ảnh màn ngoài phạm vi.

BÀI HỌC:
- KHOÁ: bài Chromium phải nạp CSS đúng như App nạp (theo import thật), không nạp cả thư mục.
- KHOÁ: phần tử nổi mới (z-index cao) phải có ca / ảnh ở màn mở, bảng trượt, PIN.
- NGUYÊN TẮC: sửa số và bảng ngay tại chỗ trong trang_thai.md, không chỉ ghi thêm mục "Vòng sửa".
- NGUYÊN TẮC: lệch luật CLAUDE.md (vd §11 hien.*) thì ghi ## Câu hỏi, không tự quyết "việc sau".
```

### Sửa sau soát vòng 2 (không bắt buộc — vòng 2 ĐẠT)
- KHOÁ làm luôn: `thu_KHNHANH2` nạp CSS theo dòng `import '…giaoDien/….css'` thật trong `src/` (không cả thư mục) + đột biến BV-BO-NAP-CHO-CSS (bỏ import ở main.jsx)
  → BẮT ĐƯỢC; tổng 14/14. Bài vẫn 68 / 0 có Chromium, 37 / 0 KHONG_TRINH_DUYET (SỐ CA không đổi — phần đổi chỉ chạy trong trình duyệt).
- Số liệu sửa TẠI CHỖ: bảng đột biến, 68 đạt, 12 ca A1 / 7 mục NGAM, D3 14/14; ke_hoach.md dòng 62 (mảng NGAM), 70 (địa chỉ thử).
- §11 `hien.*` và vòng chồng màn mở → `## Câu hỏi` (dưới). Ảnh 360 / 430 + ảnh tô chỗ lệch: CHƯA KIỂM (vòng là phần tử 36 px tâm khung, không đổi theo bề rộng).
- Không sửa (nhỏ, ghi nhận): vòng loé khi xoá món cuối trong 600 ms; kho lỗi lúc mở → lượt "chờ" mỗi 5 phút; ba chỗ ngầm chỉ đọc nguồn (App quảng cáo, daTra, PIN).

## Câu hỏi
1. **§11 `hien.<khối>`:** vòng xoay giữa màn và dòng "Đang tính tiền…" là hình chỉ báo trạng thái (không phải khối nội dung). Máy chỉ khai khoá chữ `khung.dangCho`
   (nhãn đọc màn hình) và `gio.dangTinh`, KHÔNG thêm `hien.vongCho`. Chủ quán có cần nút ẩn / hiện vòng xoay ở /admin không? Cần → thêm một mục `battat` (~3 dòng) ở
   việc sau / vòng sửa.
   → **Chủ quán 19.11: không cần.** (vòng chỉ là dấu hiệu chờ, không phải nội dung — không thêm gì.)
2. **Vòng xoay trên màn mở (splash):** vòng (z-index 9000, như bản thử) có thể hiện giữa màn mở chào ngày đầu (~6 s) khi mạng chậm, chồng lên chữ "Tứ Quý Đường" /
   khẩu hiệu. Chủ quán muốn: (a) giữ như vậy, hay (b) ẩn vòng trong lúc màn mở đang hiện? Xem khi thử tay D6.
   → **Chủ quán 19.11: chọn b — ĐÃ LÀM.** `VongCho.jsx` thêm `baoManDau(h)` (một biến + bộ nghe nhỏ); `ManDau.jsx` chỉ gọi `baoManDau(hien && !an)` (tắt ngay khi
   chạm / Bỏ qua / tự vào, không chờ 600 ms mờ dần; gỡ màn → false). Vòng hiện khi `có lượt chờ > 300 ms && !màn mở` — luật đếm ở api.js không đổi.
   Ca mới (Chromium 390): màn mở + POS chậm 1,5 s → không vòng; Bỏ qua khi lượt còn chờ (POS 3 s) → vòng hiện. Đột biến VS-VONG-HIEN-TREN-MAN-DAU → BẮT ĐƯỢC.

- Kiểm lần cuối sau soát vòng 2: xem dòng dưới.
- Sau soát vòng 2 (7dab641): thu_KHNHANH2 Chromium 68 đạt · 0 hỏng; đột biến 14/14; KHONG_TRINH_DUYET=1 cổng chay: ✓ CỔNG CHẠY ĐẠT (CẢNH BÁO A16 như trên). Từ b84bf8f chỉ đổi bài thử + hồ sơ, không đổi src/.

HEAD ĐÃ KIỂM: 7dab641
