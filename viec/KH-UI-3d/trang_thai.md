# KH-UI-3d — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-UI-3d`; HEAD = FETCH_HEAD = `7e1be30` lúc bắt đầu (không kéo, đã đồng bộ).
```
7e1be30 PHIEU: KH-UI-3d
cacf0f9 TIEN-DO: KH-UI-3b xong (PR #11 f5c13fb); mo KH-UI-3d; quyet dinh van phong loi chao 31.10; them KH-THU-1 - so v17
f5c13fb Merge pull request #11 from tuquyduong/viec/KH-UI-3b
```
Người gác chặn `xargs`, `sed -i`, tạo file ngoài Phạm vi (`cong_cu/_sua.py`), `git worktree`, và chạy bài thử có chữ TOKEN khi file chưa commit (đã commit rồi chạy) — làm theo hướng dẫn, không lách.

## Câu hỏi
1. **C2 — bài cũ sửa chỉ ở phần trình duyệt.** `cong_cu/thu_KHLUU1.js` (ca C1(f), dòng 187: mong đợi "Chào Thử!") chạy trong Chromium và file KHÔNG đọc `KHONG_TRINH_DUYET`; trên GitHub (không Playwright) ca này bị bỏ qua nên bài có thể "xanh trên gốc" → cổng A11. Xin chat thêm mục `## Bài thử cũ sửa` (tên file: `cong_cu/thu_KHLUU1.js`) vào phiếu. Số ca đã ghi 31 (cùng số KH-UI-3b); chưa xác nhận được số ca khi không có Playwright (máy có Playwright). Các bài cũ khác (`thu_KHUI3b.js`, `thu_KHXEM1.js`, `thu_KHLINK1.js`, `thu_KHUI2.js`) có ca phần 1 đổi nên ĐỎ trên gốc dù ẩn trình duyệt (bang_chung_do.txt).
2. Ảnh so 430 và ảnh tô chỗ lệch (C3) chưa làm; chỉ có 360/390 — xin chat App KH quyết có cần bổ sung.

## Phát hiện
- Hạng 0% sẽ hiện "giảm 0%" ở bảng hạng (UuDai.jsx `TheHang`); chưa có quyết định hiển thị.
- Banner Giờ vàng là `div role=button` có nút bên trong: cần người thử trên điện thoại về trợ năng.
- `/hang` tạm trả hạng đã sắp xếp theo POS; app không sắp lại.

## A5 — rà chữ có xưng hô / lời chào (`grep` trong `src/`)
| Chỗ | Cách xử lý |
|---|---|
| `src/dinhDang.js` `tenNgan`, `chiaLoiChao`, `loiChao` | sửa: xưng hô chữ thường, tên viết hoa chữ đầu, "!" cuối |
| `src/noiDung/dangNhap.js` `XUNG_HO` (7 nút), `tenXungHo` | chữ thường ("chị") — MỘT chỗ cho cả hai màn |
| `src/pages/DangNhap.jsx:101` (bước 3, nút `.xh`) | đọc `XUNG_HO`, không sửa riêng |
| `src/pages/HoSo.jsx` (7 nút + xem trước) | đọc `XUNG_HO`; xem trước dùng `chiaLoiChao`, thêm "!", xưng hô in đậm |
| `src/pages/TrangChu.jsx:50,80` | gọi `loiChao`: "Chào buổi tối, chị Linh!" / "Chào bạn!" (sửa chú thích 69) |
| `src/noiDung/tracNghiemChu.js`, `noiDung/dangNhap.js` chữ "bạn" khác | câu văn thường, không phải xưng hô gán theo khách — giữ |
Không còn nhãn "Anh Linh" nào đứng đầu dòng trong `src/` (grep `Chào|Anh|Chị|Chú|Bác`).

## Bảng chỗ vá → đột biến (dot_bien.py, 9 đột biến, đều ĐỎ)
| Chỗ vá | Đột biến |
|---|---|
| xưng hô chữ thường (dinhDang.js) | VS-XUNG-HO-VIET-HOA-GIUA-CAU |
| "!" cuối câu | VS-THIEU-CHAM-THAN |
| tên ngắn viết hoa | VS-TEN-NGAN-KHONG-VIET-HOA |
| nút xưng hô chữ thường | VS-NUT-XUNG-HO-VIET-HOA |
| vãng lai không thấy điểm / voucher | VS-VANGLAI-THAY-DIEM-VOUCHER |
| banner Giờ vàng ẩn khi POS không có | VS-BANNER-GIO-VANG-KHI-POS-KHONG-CO |
| `?ma=` vẫn về đăng nhập | VS-MA-HOA-DON-MAT-KHI-VANG-LAI · VS-APP-KHONG-TRUYEN-MA-CHO |
| bỏ `canDN` của /uudai | BV-CANDN-UU-DAI |

## Soát độc lập (`/ra-soat`) — báo cáo chép nguyên ý
KHÔNG ĐẠT (lỗi nhẹ; không có lỗi code chặn nghiệm thu; thiếu giấy tờ). Lỗi tìm được và xử lý:
1. Thiếu `trang_thai.md` / A5 → đã tạo file này, có bảng A5.
2. C2 chưa ghi `## Câu hỏi` → đã ghi (mục Câu hỏi 1).
3. `thu_KHLUU1.js` không đọc `KHONG_TRINH_DUYET`, bằng chứng đỏ lấy từ phần trình duyệt → ghi cùng Câu hỏi 1.
4. Ca "B2 không ngoài nhánh đăng nhập" là marker suông → đã thay bằng ca kiểm vị trí `UuDaiToi` trong nhánh `dangNhap ?` (SỐ CA 30 → 31); đột biến VS-VANGLAI-THAY-DIEM-VOUCHER vẫn ĐỎ (120·9).
5. `UuDaiToi` vẽ thẻ hạng khi `/toi` chưa về (chớp bảng hạng) → sửa: chỉ vẽ khi `/toi` đã về.
6. Chú thích TrangChu.jsx:69 "Chào bạn" → đã đồng bộ "!".
Nghi ngờ còn lại: hạng 0%, trợ năng banner (mục Phát hiện). Không soát được: chạy lại Chromium, so ảnh từng khối.
Nghiệm thu soát đếm: 11/15 đủ bằng chứng lúc soát; A5 + C2 đã bổ sung ở đây; C3 một phần (thiếu 430 + ảnh tô lệch); C4 cổng chờ chạy; C5 chủ quán.

## Kết quả kiểm
- `node kiem_tra_truoc_khi_giao.js --day-du`: 29 đạt · 0 hỏng (sau sửa soát; có Chromium: `thu_KHUI3d.js` 171, `thu_KHUI3b.js` 173).
- Cổng `node tu_chay/cong.js chay . 7e1be30^ HEAD viec/KH-UI-3d`:
  - chạy ở máy có Playwright (không ẩn trình duyệt): ✗ [A16] ×2 vì máy đếm 173 / 171 ca ≠ `SỐ CA` 56 / 31 — đúng như CLAUDE.md §9 (SỐ CA ghi theo `KHONG_TRINH_DUYET=1`, số GitHub đếm), không phải lỗi bài thử;
  - chạy `KHONG_TRINH_DUYET=1` (như GitHub): `✓ CỔNG CHẠY ĐẠT`.
- Bước 11: không đổi file ngoài `viec/KH-UI-3d/` sau lần kiểm cuối → không KHOÁ / NGUYÊN TẮC mới ngoài Phạm vi. Bài học ghi dưới.

## Bài học
- KHOÁ (đã làm, trong Phạm vi): ca nguồn kiểm VỊ TRÍ `UuDaiToi` trong nhánh `dangNhap ?` — ca "đếm số lần xuất hiện" không bảo vệ nhánh, mà cổng GitHub không có trình duyệt.
- NGUYÊN TẮC (đề xuất, ngoài Phạm vi): việc đổi bài cũ chỉ ở phần trình duyệt phải ghi `## Câu hỏi` (C2) ngay lúc sửa; tạo `trang_thai.md` từ đầu việc. Chỉ xảy ra khi phiếu bắt ghi vào file đó → không mở K mới, ghi lại để chat soát cân nhắc.
- BỎ: người gác chặn nhiều lệnh (xargs, sed -i, chạy bài thử có TOKEN chưa commit) — mỗi lần một lần, làm theo hướng dẫn.

## Báo cáo 7 mục
- VIỆC: KH-UI-3d — Ưu đãi mở cho khách vãng lai + văn phong lời chào.
- ĐÃ SỬA: `dinhDang.js` (lời chào, tên ngắn), `noiDung/dangNhap.js` (XUNG_HO thường + `THE_MOI_UU_DAI`), `HoSo.jsx`, `duongDan.js` (bỏ canDN uudai), `luongDangNhap.js` (maCho), `App.jsx`, `UuDai.jsx` (banner Giờ vàng, thẻ hạng, điểm + ví, khối khoá), `demo_1.css` / `demo_2.css` (CSS chép của demo), 5 bài cũ.
- BÀI THỬ: `thu_KHUI3d.js` mới (31 ca ẩn trình duyệt / 171 đủ), 9 đột biến đều ĐỎ, 5 bài cũ sửa đỏ trên gốc.
- ĐÃ RÀ K4: mọi chỗ xưng hô / lời chào (bảng A5), `canDangNhap` một đường.
- CHƯA KIỂM: thử tay trên điện thoại (C5); ảnh 430 + ảnh tô chỗ lệch (C3); trợ năng banner; `thu_KHLUU1` (C2, xem Câu hỏi); ảnh tĩnh trong ảnh so là POS giả nên logo không hiện.
- GIT: nhánh `viec/KH-UI-3d`, push từng bước; không PR, không merge.
- BÀI HỌC: như trên.

## Mục nghiệm thu — bằng chứng
A1–A4: `thu_KHUI3d.js` phần 1 + ca Chromium · A5: bảng trên · B1–B5: `thu_KHUI3d.js` (nguồn + Chromium: vanglai-*, dangnhap-*, qr-ma, qr-ma-dong-dn, het-phien) · C1: `thu_KHUI3d.js` ba cỡ × 100/130% · C2: Câu hỏi 1 · C3: `so_anh/` + `doi_chieu_demo.md` (thiếu 430 + ảnh tô lệch) · C4: `--day-du` + cổng ĐẠT + 9 đột biến · C5: chủ quán.

HEAD ĐÃ KIỂM: dfc6939
