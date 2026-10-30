# Trạng thái KH-LUU-1

## Mốc đối chiếu bản chụp
Nhánh `viec/KH-LUU-1`; HEAD = FETCH_HEAD = `fe13962`.
```
fe13962 PHIEU: KH-LUU-1
7af1053 TIEN-DO: KH-UI-5a xong; K9 cho phep khau hieu B2.3 (luat); quy tac luu tren may (luat); mo KH-SLOGAN-1, KH-LUU-1 - so v6
a37d271 Merge pull request #4 from tuquyduong/viec/KH-UI-5a
```

## Câu hỏi
(không)

## Phát hiện
- Trang chủ còn chữ "Sức khỏe mỗi ngày" (thấy khi chạy App thật) — thuộc KH-SLOGAN-1, không sửa ở đây.
- CI GitHub không có Playwright → phần 2 của `thu_KHLUU1.js` (Chromium thật) in "BỎ QUA" ở đó; chỉ phần 1 + đọc nguồn chạy. Muốn ca trình duyệt chạy cả ở cổng GitHub, chủ quán cần cho cài Playwright vào CI (ngoài phạm vi).
- Hai cửa sổ hẹp còn lại (soát L2/L3), KHÔNG chặn nghiệm thu, nêu để chủ quán biết: (1) khách đăng nhập LẦN ĐẦU sau bản này (chưa có `kh_chu`) mà làm xong và bấm Lưu trắc nghiệm TRƯỚC khi `GET /toi` về thì `doiKhach` coi là "bản cũ" và xoá — chỉ một lần, mất vài giây sau đăng nhập; (2) `GET /toi` lỗi mạng → `kh_chu` không ghi trong phiên đó, bản lưu mới sẽ bị xoá ở lần mở sau (an toàn: ẩn chứ không hiện nhầm). Cách chặn nếu muốn: khoá màn trắc nghiệm tới khi `daBiet`; chưa làm vì phiếu không đòi và làm tăng độ phức tạp.
- Khách đang dùng bản 5a (có kết quả, chưa có `kh_chu`) sẽ mất kết quả MỘT lần khi đăng nhập sau bản này — đúng phiếu A2 (xoá bản cũ cho an toàn).

## Bảng chỗ vá → đột biến (dot_bien.py, mỗi lần bài thử ĐỎ)
| Chỗ vá | Đột biến |
|---|---|
| `cungKhach` so chủ | VS-SO-CHU-NGUOC |
| `dauVet` chuẩn hoá +84 | VS-DAU-VET-KHONG-CHUAN-HOA |
| `doiKhach` xoá khi khác khách | VS-KHONG-XOA-KHI-KHAC |
| `doiKhach` xoá bản lưu cũ chưa có chủ | BV-BO-CA-BAN-CU |
| `xoaTatCa` xoá `kh_chu` | VS-XOA-TAT-CA-GIU-CHU |
| App gọi `doiKhach` khi có phiên | BV-BO-DOI-KHACH |
| App gọi `tnGoc.nap()` | BV-BO-NAP |
| ẩn bản lưu tới khi biết khách (`daBiet`) | VS-HIEN-KHI-CHUA-BIET-KHACH |
| `dangXuat` gọi `xoaTatCa()` | BV-BO-XOA-DANG-XUAT |
| hết phiên không xoá khoá (`donBoNho`) | VS-HET-PHIEN-XOA-KHOA |
| Trang chủ không lộ bản lưu khi chưa đăng nhập | VS-LO-KET-QUA-KHI-CHUA-DANG-NHAP |

## Kiểm
- `node cong_cu/thu_KHLUU1.js`: 31 đạt · 0 hỏng (phần 1 + đọc nguồn 19 ca; phần 2 Chromium thật 12 ca, gồm ca giữ `/toi` treo).
- `node cong_cu/thu_KHUI5a.js`: 357 đạt · 0 hỏng (trên gốc với bài mới: 355 đạt · 2 hỏng — xem bang_chung_do.txt).
- `npm test`: 20 đạt · 0 hỏng. `node kiem_tra_truoc_khi_giao.js --day-du`: 22 đạt · 0 hỏng (vite build xong).

## Soát độc lập (/ra-soat, vòng 1) — KHÔNG ĐẠT → đã sửa
Báo cáo tóm tắt: L1 lộ bản lưu của khách trước trong lúc chờ `/toi` (App.jsx:45–77); L2 race lưu trước `/toi` (luuMay.js:56–59); L3 `/toi` lỗi mạng thì không ghi chủ; L4 bang_chung_do.txt khẳng định "357 trước và sau / đỏ trên gốc" không có log; L5 thiếu kết quả `cong.js chay` và 3 thao tác thử tay (C4). Nghi ngờ: ca (g) `k(…, true)` vô điều kiện (dựa `waitFor` ném lỗi), ca (f) gần như xanh giả, B1–B5 là regex.
Xử lý vòng 1:
- L1 SỬA (commit dfa6ff4): `daBiet` — bản lưu chỉ hiện khi đã đăng nhập VÀ `doiKhach` xong; ca C1(h) giữ `/toi` treo 1,5 s; đột biến VS-HIEN-KHI-CHUA-BIET-KHACH đỏ.
- L2, L3: ghi vào Phát hiện (trên), không sửa.
- L4 SỬA: đã chạy bài mới trên src gốc (git archive vào nháp) và dán log thật vào bang_chung_do.txt.
- L5: C4 ghi dưới đây; cổng `chay` ghi ở cuối file.
- Ca (f) đổi: gieo bản lưu KHÔNG có `kh_chu` để `doiKhach` thực sự đi vào nhánh `ghiChu` khi kho chặn. Ca (g) giữ: `waitFor('Bạn đã chọn:')` quá hạn là lỗi → bài thử đỏ (chạy là đỏ, không xanh giả).

## C4 — chủ quán thử tay (≤ 3 thao tác, điện thoại)
1. Đăng nhập, làm trắc nghiệm, bấm Lưu, đóng app.
2. Vào Tài khoản → Đăng xuất → đăng nhập lại cùng số → ô Trắc nghiệm trở lại "chưa làm" (kết quả MẤT vì đăng xuất bấm tay).
3. Làm lại và lưu → đóng hẳn trình duyệt, mở lại khi phiên còn hạn → ô "Thể trạng · … · Xem kết quả ›" CÒN.

## Nghiệm thu — đếm từng mục
A1 `thu_KHLUU1.js` 4 ca đầu · A2 5 ca · A3 1 ca · A4 2 ca · B1 ca đọc nguồn + C1(c) · B2 ca đọc nguồn + C1(a) · B3 ca đọc nguồn + C1(a)(b)(d)(h) · B4 2 ca đọc nguồn · B5 2 ca + C1(e)(h) · C1(a)–(g) đủ trong phần 2 (+ (h)) · C2 `thu_KHUI5a.js` dòng 269, 273 · C3 `npm test`, `--day-du` ở trên, cổng ở cuối · C4 ở trên.

## BÁO CÁO 7 MỤC
1. VIỆC: KH-LUU-1 — giữ dữ liệu trên máy khi hết phiên; xoá khi Đăng xuất hoặc đổi khách.
2. ĐÃ SỬA: `src/luuMay.js` (mới), `src/App.jsx`, `src/dungTracNghiem.js` (`donSach`→`donBoNho` + `nap`), `src/tracNghiemLuu.js` (export tên khoá), `cong_cu/thu_KHLUU1.js` (mới), `cong_cu/thu_KHUI5a.js` (2 ca).
3. BÀI THỬ: thu_KHLUU1 31 đạt; thu_KHUI5a 357 đạt; `npm test` 20; `--day-du` 22; 11 đột biến đều đỏ.
4. ĐÃ RÀ K4: grep `kh_tracnghiem|docKetQua|ghiKetQua|xoaKetQua|donPhien|dangXuat|klLuu|tn.luu` — chỉ App.jsx và dungTracNghiem.js; mọi chỗ hiện bản lưu đi qua `tn`/`klLuu` đã che.
5. CHƯA KIỂM: thử tay trên điện thoại thật (C4); CI GitHub không chạy ca Chromium; L2/L3 (hai cửa sổ hẹp ở Phát hiện); nhiều tab cùng lúc; `dauVet` 53 bit dò ngược được (phiếu cho phép).
6. GIT: nhánh `viec/KH-LUU-1`, push từng bước, không PR/merge.
7. BÀI HỌC: xem mục `## Bài học`.

## Bài học
- NGUYÊN TẮC (đề xuất K10, ngoài Phạm vi): "Chủ dữ liệu cá nhân xác định bất đồng bộ → mọi chỗ hiện dữ liệu cá nhân phải chờ tới khi biết chủ" (đã gây: L1 — lộ bản lưu khách trước trong lúc chờ `/toi`). Dấu hiệu: ca thử chờ cố định rồi mới kiểm. Chặn: ca giữ yêu cầu treo (C1(h)).
- KHOÁ (đã làm): ca C1(h) + đột biến VS-HIEN-KHI-CHUA-BIET-KHACH.
- BỎ: người gác chặn `sed -i`, `worktree`, biến trong đích ghi (lỗi dùng lệnh, chỉ một lần).
