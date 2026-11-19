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
Dòng cuối: `TẤT CẢ ĐỘT BIẾN BỊ BẮT` (11/11, `node viec/KH-NHANH-2/dot_bien_tay.js --trinh-duyet`).

## Phần trình duyệt (chạy thật ở máy — §9)
- `node cong_cu/thu_KHNHANH2.js` (Chromium 390, POS giả trễ): 62 đạt · 0 hỏng. `KHONG_TRINH_DUYET=1`: 37 đạt · 0 hỏng (= SỐ CA).
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
  `src/giaoDien/cho.css` (MỚI) · `src/pages/GioHang.jsx` (`BangTien` số cũ mờ / "Đang tính tiền…"; nút đi tiếp khoá khi tính lại; bỏ ref `bgCu` riêng) ·
  `src/pages/ThanhToan.jsx` (BangTien + vòng trắng trên nút Đặt đơn) · `src/components/PinSheet.jsx` (vòng trên nút Xác nhận) · `src/noiDung/nd/menu.js`
  (khoá mới `khung.dangCho`, `gio.dangTinh`) · `index.html` (script preconnect).
- **BÀI THỬ:** `cong_cu/thu_KHNHANH2.js` MỚI (đỏ gốc 16/35, xanh 62/0; SỐ CA 37) · `cong_cu/thu_KHMUA1.js` B5 đổi có chủ đích (đỏ gốc 2 ca, xanh 130/0; SỐ CA 57).
  Đột biến tay 11/11 BẮT ĐƯỢC.
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
| A1 đếm lượt chờ, ngầm không tính, MỘT chỗ, không đổi fetch | thu_KHNHANH2 khối A1 (9 ca Node) + 8 ca đọc nguồn chỗ ngầm + ca "goi bọc goiThat, 2 fetch(" + K1b; đột biến VS-DEM-CA-LUOT-NGAM, BV-KHO-DA-CO-VAN-DEM |
| A2 VongCho > 300 ms, giữa .phone, không nền / phủ, pointer-events none, 36 px, role, nhãn danh mục, reduced-motion | Chromium "mở App POS 1,5 s" (4 ca) + ca bấm được nút + ca ẩn khi xong + đọc nguồn reduced-motion; BV-BO-TRE-300, VS-VONG-CO-NEN, VS-LOP-PHU-CA-MAN |
| A3 cho.css tiền tố cho-, màu demo, khung-tai giữ | ca "mọi lớp cho-" + K9 (npm test); không sửa khung-tai (`git diff` không đụng) |
| B1 số cũ mờ / "Đang tính tiền…" / câu cũ khi không hỏi / lỗi như cũ | Chromium ca gio (3 ca B1) + gio-chua-dn + thanh-toan "Đang tính tiền…" |
| B2 nút khoá khi tính lại, không số cũ, một bản nhớ bgCu | Chromium B2 (Giỏ 2 ca, Thanh toán 1 ca) + đọc nguồn "Giỏ không còn ref"; VS-NUT-DI-TIEP-MO-KHI-TINH-LAI, VS-NUT-MANG-SO-CU |
| B3 vòng nhỏ trên nút Đặt đơn / PIN | Chromium "Đặt đơn đang gửi → vòng trắng", "lỗi → hết vòng" + đọc nguồn PIN |
| C1 preconnect gốc, không /api, biến trống không dòng | 4 ca (chạy script với document giả, 3 biến; vite build thật với VITE_POS_API); K2 / K2d xanh; VS-PRECONNECT-CO-API |
| C2 gom đầu + đuôi, lượt cũ không ghi đè | 4 ca Node taoGop + Chromium "gửi ngay < 300 ms" + "lượt cũ về muộn không ghi đè"; thu_KHMUA1 B5 ×2; VS-GOM-CHI-DUOI, BV-LUOT-CU-GHI-DE-GIO-MOI |
| C3 số lượt mở App không đổi | Chromium C3 (5 cửa mỗi cửa 1 lượt) + thu_KHNHANH1 230/0 |
| D1 bài mới, POS giả trễ, đỏ gốc | bang_chung_do.txt |
| D1 Theo dõi đơn 3 s / quay lại App 60 s không vòng | Chromium 2 ca; BV-THEO-DOI-DONG-HO-DEM |
| D2 bài cũ đổi có chủ đích, đỏ gốc cả KHONG_TRINH_DUYET | thu_KHMUA1 B5 (gốc KHONG_TRINH_DUYET=1: 56/1) |
| D3 ≥ 6 đột biến tay đỏ | 11/11 |
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

HEAD ĐÃ KIỂM: b02b85a
