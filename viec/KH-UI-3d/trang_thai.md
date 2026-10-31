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
- `npm test`: xanh (chạy lại sau sửa soát ở bước cổng). `--day-du`: 29 đạt · 0 hỏng (trước sửa soát).
- Chromium: `thu_KHUI3d.js` 170 đạt (trước thêm ca nguồn), `thu_KHUI3b.js` 173 đạt.
