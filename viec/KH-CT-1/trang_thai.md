# KH-CT-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (06.11)
- Lần 1 (05–06.11): HEAD = FETCH_HEAD = `c7553df`.
- Lần 2 (sau trả lời Câu hỏi 1): `git pull` do hook mở phiên kéo `f978c39 → f9f9187`; cây sạch.
- `git log --oneline -3` lúc mở lại: `f9f9187 PHIEU: KH-CT-1 - tra loi Cau hoi 1 …` · `f978c39 KH-CT-1: cau hoi - …` · `91c2c86 KH-CT-1: khoi Chuong trinh dac biet o Uu dai + sinh nhat hom nay`.
- Thấy commit `PHIEU: KH-CT-1` (`c7553df`, `f9f9187`). Mốc cổng: `c7553df^`.

## Câu hỏi
1. (ĐÃ TRẢ LỜI — chủ quán duyệt 06.11, ghi ở phiếu) `thu_KHUI3d.js` B4 đỏ vì `/chuong-trinh`; đã sửa đúng 2 chỗ + thêm ca đọc nguồn đỏ trên gốc.

## Phát hiện
- Sinh 29/02 mà năm nay không nhuận → App tính 28/02 (phiếu A1). Chat App KH hỏi POS cùng luật 28/02 (phiếu đã ghi nhận 06.11).

## Bảng chỗ vá → đột biến (`dot_bien.py`; chạy: "TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT")
| Chỗ vá | Đột biến |
|---|---|
| `docChuongTrinh` lọc `dang_bat === false` | VS-KHONG-LOC-DANG-BAT |
| `docChuongTrinh` loai lạ → `khac` | VS-LOAI-LA-GIU-NGUYEN |
| `docChuongTrinh` giữ thứ tự POS | VS-SAP-LAI-THU-TU |
| `sinhNhatHomNay` 29/02 năm không nhuận → 28/02 | VS-29-02-KHONG-NHUAN-BO-QUA |
| `sinhNhatHomNay` so cả tháng + ngày | VS-SINH-NHAT-CHI-SO-NGAY |
| `api.js` `/chuong-trinh` công khai (không token) | BV-KHONG-CONG-KHAI |
| "Hôm nay" theo `bayGio()` của POS | VS-HOM-NAY-THEO-DONG-HO-MAY |
| Rỗng / lỗi → ẩn cả khối | BV-AN-KHOI-KHI-RONG |
| Chỉ `ngay_sinh === null` mới mời nhập | VS-MOI-NHAP-KHI-CHUA-BIET |
| Sinh nhật hôm nay → thẻ sinh nhật lên đầu | BV-THE-SINH-NHAT-LEN-DAU |
| Dòng mời bấm được → mở Thông tin cá nhân | BV-BAM-MO-HO-SO |

## Nghiệm thu — mỗi mục một dòng bằng chứng
- A1 `docChuongTrinh` / `sinhNhatHomNay`: `thu_KHCT1.js` nhóm A1 + A1b (14 ca); đột biến 1–5.
- A2 `CUA_CONG_KHAI`: ca A2 (đọc nguồn) + ca Chromium "GET … KHÔNG có Authorization, đúng MỘT lần"; BV-KHONG-CONG-KHAI.
- B1 khối cho cả hai trạng thái, dưới Giờ vàng / trên thẻ hạng, nhãn "Áp dụng tại quán", không mức giảm: ca `chua-dn-*`, `dn-thuong`.
- B2 rỗng / 500 / 429 / dữ liệu hỏng → ẩn, không lỗi JS: ca `an-*` (4 × 2 trạng thái); BV-AN-KHOI-KHI-RONG.
- B3 chúc mừng (theo `bay_gio` POS, có đối chứng): ca `sinh-nhat-*`, `sinh-nhat-theo-pos`, `…-may-dung-pos-lech`, `…-khong-co-the`; VS-HOM-NAY…, BV-THE-SINH-NHAT-LEN-DAU.
- B4 dòng mời + bấm mở `/taikhoan/thongtin`: ca `chua-nhap-*`, `co-ngay-sinh-khong-moi`, `chua-nhap-khong-the`, `toi-loi`; VS-MOI-NHAP…, BV-BAM-MO-HO-SO.
- B5 chưa đăng nhập không B3 / B4, một lần GET: ca `chua-dn-*`.
- B6 không tràn ngang 360 / 390 / 430 + CSS ở file riêng, K9 xanh (`npm test`): ca B6 + `khongTran`.
- C1 `thu_KHCT1.js` (17 ca không trình duyệt, 86 có Chromium; `SỐ CA`: 17). C2 ảnh + `doi_chieu_demo.md`. C3 xem dưới. C4: bước thử tay chủ quán (dưới CHƯA KIỂM).

## Báo cáo 7 mục
1. **VIỆC**: KH-CT-1 — khối "Chương trình đặc biệt" ở Ưu đãi (`GET /chuong-trinh`) + ưu đãi sinh nhật hôm nay.
2. **ĐÃ SỬA**: `src/chuongTrinh.js` (mới), `src/pages/UuDai.jsx`, `src/giaoDien/chuong_trinh.css` (mới), `src/api.js` (1 từ khoá + chú thích), `src/App.jsx` (1 dòng `moHoSo`), `cong_cu/thu_KHUI3d.js` (2 danh sách cho phép + 1 ca, theo duyệt 06.11).
3. **BÀI THỬ**: `thu_KHCT1.js` đỏ trên gốc (1 đạt · 4 hỏng) → xanh (86 đạt có Chromium; 17 không); 11 đột biến đều bị bắt; `npm test` và `--day-du` xanh (36 đạt · 0 hỏng).
4. **ĐÃ RÀ K4**: `grep "layChuongTrinh"` → chỉ `api.js` + `UuDai.jsx`; không còn nơi nào khác gọi `/chuong-trinh`; mọi chỗ so ngày sinh dùng `tachNgaySinh`.
5. **CHƯA KIỂM**: POS thật (chỉ POS giả theo hợp đồng v9); trình duyệt Zalo; thử tay C4 (bật chương trình ở POS, tài khoản có ngày sinh hôm nay); POS có cùng luật 28/02 cho sinh 29/02 hay không.
6. **GIT**: nhánh `viec/KH-CT-1`, đẩy sau từng bước; không PR, không merge.
7. **BÀI HỌC**: xem `## Bài học`.

## Bài học
- BỎ — bài cũ `thu_KHUI3d.js` B4 cấm "cửa lạ" nên đỏ khi thêm cửa công khai hợp lệ: đã được xử lý bằng duyệt Phạm vi; chỉ xảy ra khi thêm cửa mới vào màn đã có khoá "không cửa lạ".
- BỎ — người gác chặn lệnh ghép (`;`, `&&` sau lệnh chạy script) và `git checkout <SHA> --`: đã hướng dẫn rõ trong lý do chặn; làm theo (chạy từng lệnh riêng, chứng minh đỏ trên gốc bằng `git show <SHA>:<file> | grep`).
- KHOÁ (đã làm, trong Phạm vi) — đột biến `VS-MOI-NHAP-KHI-CHUA-BIET` sống ở lần đầu vì bài chưa có ca "/toi lỗi → không mời nhập"; đã thêm ca `toi-loi` (đỏ với đột biến).

## Cổng
- `npm test` + `--day-du`: 36 đạt · 0 hỏng. `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . c7553df^ HEAD viec/KH-CT-1` → ✓ CỔNG CHẠY ĐẠT (cảnh báo A16 về thu_KHCT1.js: trên gốc bài dừng sớm ở 5 ca vì chưa có src/chuongTrinh.js — đúng dự kiến).

HEAD ĐÃ KIỂM: 32f8ccd
