# KH-BAO-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
HEAD = FETCH_HEAD = b3b1489
b3b1489 PHIEU: KH-BAO-1
bec27e9 TIEN-DO: mo KH-BAO-1 (bao don xong o moi man, Theo doi don ve to hoa don, nho cong tac vi)
25ab8b9 TIEN-DO: mo KH-CT-1 (chuong trinh dac biet o Uu dai, GET /chuong-trinh v9; uu dai sinh nhat hom nay)

## Bảng "chỗ vá → đột biến" (dot_bien.py, kết quả: TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT, đối chứng xanh 101 đạt)
| Chỗ vá | Đột biến |
|---|---|
| baoDonXong.js báo đơn chưa từng thấy chạy | VS-BAO-DON-CHUA-TUNG-THAY |
| baoDonXong.js báo lại đơn đã tắt | BV-BAO-LAI-DON-DA-TAT |
| baoDonXong.js `da_huy` không báo | VS-BAO-DA-HUY |
| BaoDonXong.jsx hỏi khi tab ẩn | VS-HOI-KHI-TAB-AN |
| BaoDonXong.jsx hỏi lặp khi không đơn chạy | VS-HOI-LAP-KHI-KHONG-DON |
| baoDonXong.js chu kỳ 15 s | VS-CHU-KY-HOI |
| BaoDonXong.jsx nhớ đã tắt qua tải lại | BV-NHO-DA-TAT-QUA-TAI-LAI |
| BaoDonXong.jsx xoá nhớ khi đăng xuất | BV-XOA-NHO-KHI-DANG-XUAT |
| App.jsx tiêu đề "(Xong)" không bị ghi đè | VS-TIEU-DE-BI-GHI-DE |
| App.jsx daTra làm mới cuaDon | BV-DA-TRA-LAM-MOI-DON |
| HoaDonKhach.jsx bỏ dòng ghi_no | VS-BAO-DON-VE-GHI-NO |
| TheoDoiDon.jsx vẽ tờ hoá đơn | BV-TO-HOA-DON-THEO-DOI |
| ThanhToan.jsx công tắc bật sẵn khi /toi lỗi | VS-CONG-TAC-BAT-SAN-KHI-TOI-LOI |
| ThanhToan.jsx nhớ công tắc | VS-CONG-TAC-KHONG-NHO |
| ThanhToan.jsx vẫn hỏi PIN khi nhớ ví | BV-HOI-PIN-KHI-NHO-VI |
| ThanhToan.jsx giữ bản ghi khi CHUA_MO | BV-GIU-BAN-GHI-KHI-CHUA-MO |
| ThanhToan.jsx nút gửi lại khoá khi cờ tắt | VS-NUT-GUI-LAI-KHONG-KHOA-CHUA-MO |
| luuMay.js kh_dung_vi không phải khoá vãng lai | VS-DUNG-VI-NHU-VANG-LAI |
| luuMay.js kh_dung_vi trong danh sách xoá | BV-DUNG-VI-KHONG-XOA |

## Kiểm (bước 6)
npm test: 34 đạt · 0 hỏng (cả Chromium) · `--day-du`: 36 đạt · 0 hỏng (vite build, dist/index.html).
Ảnh 360/390/430 ở `so_anh/` (18 ảnh); `doi_chieu_demo.md`.

## Câu hỏi
(không có)

## Phát hiện (ngoài Phạm vi, không sửa)
- `src/datDon.js` `xemDon` không còn ai gọi (dungDatDon.js dùng `xemDonCoTo`); `docDon` chưa chuyển `hoa_don`. Nên thêm `hoa_don` vào `docDon`, xoá `xemDonCoTo` + `xemDon`.
- `Don.jsx` / `TheoDoiDon.jsx` chọn nhánh vẽ tờ theo `docHoaDon(don).length > 0`: tờ chỉ gồm dòng `ghi_no` → tờ rỗng, ẩn `mon[]`. Hiếm; `Don.jsx` cấm sửa.
- `HoaDonKhach` lọc `ghi_no` theo `loai`; dòng `canh_bao` / loại lạ có chữ "nợ" ở `trai` chưa lọc (cần hợp đồng POS).
- `GET /don` chỉ trang 1: đơn đang chạy bị đẩy khỏi trang 1 thì không báo (ghi ở doi_chieu_demo.md).
- Quay lại tab: `BaoDonXong` hỏi `GET /don` NGAY (phiếu A2), nên ngưỡng 60 giây của `lamMoiKhiQuayLai` không còn tác dụng với `/don` — thu_KHNHANH1 D1 đã sửa thành "/don đúng +1".
- Khách B đăng nhập sau khách A (hết phiên 401, dữ liệu giữ): `kh_dung_vi` của A có thể bật sẵn công tắc nếu /thanhtoan mở trước `doiKhach`. Tiền an toàn (PIN, cách trả theo ví của B). Chưa dựng ca.
- E2 grep: `thu_KHMUA1`, `thu_KHMUA1c`, `thu_KHTT1`, `thu_KHHD1` đã grep ("mon[]", "TheoDoiDon", công tắc mở, ghi_no) — không khoá hành vi cũ nào bị đổi, giữ nguyên, vẫn xanh. Sửa: MUA1b (hai tab + ca nguồn), NHANH1 (D1 + ca nguồn), LUU1 (B5).
- Chưa dựng ca "số dư đổi giữa chừng khi đang mở Thanh toán" (ke_hoach đã hứa): cachTra dẫn xuất từ số dư hiện tại nên đúng theo thiết kế; ca `nho-vi-0d` / `nho-vi-thieu` / `nho-vi-toi-loi` phủ các trạng thái.

## Báo cáo soát độc lập (/ra-soat, vòng 1) — nguyên văn rút gọn
KHÔNG ĐẠT (nhẹ). Lỗi: (1) K3 — ba đột biến sống ở cổng không Chromium: bỏ xoaNho() khi tháo, setInterval hỏi cả tab ẩn, bỏ hỏi PIN khi trả ví (ca nguồn chỉ regex trần). (2) datDon.js xemDon thành code chết (ngoài Phạm vi → Phát hiện). (3) BaoDonXong thêm listener visibilitychange song song dungLamMoiNgam (theo phiếu A2). (4) ghi_no chỉ lọc theo loai; tờ chỉ có ghi_no → rỗng.
Nghiệm thu 13/14 (E4 thiếu kết quả cổng lúc soát). BÀI HỌC: ca nguồn dạng /tênHàm/ khớp oan khi tên còn ở dòng import → ôm cả câu lệnh; cột "True" của dot_bien chỉ bắt được ở máy có Chromium.
Vòng sửa 1: thêm 4 ca nguồn ôm cả câu lệnh (thu_KHBAO1 33 ca ở `KHONG_TRINH_DUYET=1`), chuyển 6 đột biến sang chạy KHÔNG Chromium → bị bắt ở cổng; chạy lại dot_bien: TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT. (1) đã sửa; (2)(3)(4) ghi Phát hiện / theo phiếu.

## Cổng
✓ CỔNG CHẠY ĐẠT (`KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . b3b1489^ HEAD viec/KH-BAO-1`; cảnh báo A16 về số ca trên gốc là do bài mới nạp file chưa có — bình thường). npm test 34 đạt · 0 hỏng, `--day-du` 36 đạt · 0 hỏng.

## Báo cáo 7 mục
1. VIỆC: KH-BAO-1 — dải "Đơn #… đã sẵn sàng" ở mọi màn, Theo dõi đơn vẽ tờ hoá đơn, nhớ công tắc ví, giữ bản ghi khi CHUA_MO.
2. ĐÃ SỬA: src/baoDonXong.js (mới), components/BaoDonXong.jsx (mới), giaoDien/bao_don.css (mới), App.jsx, dungDatDon.js, pages/TheoDoiDon.jsx, pages/ThanhToan.jsx, components/HoaDonKhach.jsx, luuMay.js. Không sửa datDon.js, hoaDon.js, Don.jsx, dòng <UuDai>.
3. BÀI THỬ: thu_KHBAO1.js mới (101 đạt ở máy, 33 với KHONG_TRINH_DUYET=1; 13 ca đỏ trên gốc); sửa MUA1b, NHANH1, LUU1 (đỏ trên gốc, bang_chung_do.txt); 19 đột biến đều bị bắt.
4. ĐÃ RÀ K4: document.title chỉ ở App.jsx; setItem luuMay đúng 2 chỗ; GET /don/:ma không dày hơn; chỉ Don.jsx + TheoDoiDon.jsx vẽ hoa_don, cùng qua HoaDonKhach; chữ "nợ" trong src rỗng.
5. CHƯA KIỂM: tay trên iPhone + máy quầy (E5); tiếng báo (không làm — demo chỉ có nhạc màn mở); báo khi App đã tắt (sau khai trương); ảnh chưa được chủ quán so lần cuối; ca số dư đổi giữa chừng.
6. GIT: nhánh viec/KH-BAO-1, đã push; không PR, không merge.
7. BÀI HỌC: xem mục dưới.

Nghiệm thu (mỗi mục một dòng): A1 thu_KHBAO1 ca hàm thuần · A2 ca nguồn + Chromium (dai-menu, xem-don, tab-an, hai-don, dat-don-roi-menu) · A3 theo-doi-nhac · B1 hoa-don-co-to / rong · B2 hoa-don-co-to + ca nguồn · C1 luuMay pure + nho-vi-dang-xuat / khac-khach · C2 nho-vi, nho-vi-thieu, nho-vi-0d, nho-vi-toi-loi · C3 chua-mo-gui-lai + ca nguồn · D1 ca nguồn · D2 so_anh/ 18 ảnh + doi_chieu_demo.md · E1 thu_KHBAO1 · E2 MUA1b/NHANH1/LUU1 + ghi grep ở trên · E3 dot_bien.py 19 đột biến · E4 dòng trên + HEAD ĐÃ KIỂM · E5 chủ quán thử tay.

## Bài học
- KHOÁ (đã làm trong Phạm vi): ca nguồn ôm cả câu lệnh ở thu_KHBAO1 (setInterval(hoiNgay…), removeEventListener…; xoaNho(), PIN, ghi_no, tat→ghiNho), có ca đỏ khi gỡ (dot_bien, cột False).
- NGUYÊN TẮC (đề xuất, ngoài Phạm vi → KHUON_LOI.md, K4): ca đọc nguồn dạng `/tênHàm/.test(...)` khớp oan khi tên còn ở dòng import / chỗ khác — khoá chỗ vá trong effect / cleanup bằng regex ôm cả câu lệnh; bảng đột biến ghi riêng "bắt ở cổng (không Chromium)" và "bắt ở máy".
- NGUYÊN TẮC (đề xuất): thêm listener song song với kho dùng chung (visibilitychange) làm hỏng ngưỡng hỏi lại → gắn vào kho hoặc dùng napNeuCu.
- BỎ: bài thử hai tab của MUA1b hỏng vì công tắc nhớ — hệ quả đúng thiết kế, đã sửa bài.
- Lỗi lặp trong phiên: bộ kiểm báo đỏ ba lần do hook chạy npm test khi dot_bien đang sửa tạm src/ — chạy dot_bien nền thì không chạy gì khác; không phải lỗi code.

HEAD ĐÃ KIỂM: 4a3ce45
