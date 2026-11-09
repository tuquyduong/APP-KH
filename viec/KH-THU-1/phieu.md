# KH-THU-1 — Rút thời gian các bài thử chạy lâu (không đổi ca nào) + báo "quá giờ" rõ ràng

<!-- Chat App KH soạn 08.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 09.11. Chạy SONG SONG với KH-UI-5c và KH-PWA-1 (mỗi việc một phiên, một nhánh).
     Lý do: chủ quán chạy nhiều phiên cùng lúc trên Replit → máy chậm đi 2–3 lần → bài thử chạy lâu vượt trần 120 giây của kiem_tra_truoc_khi_giao.js → báo ĐỎ OAN
     (31.10 chat soát KH-UI-3b gặp; GitHub không bị vì không chạy Chromium).
     Chat đo 08.11 trên main (máy rảnh, chạy lần lượt từng bài): thu_KHUI3b 74 s · thu_KHUI3d 55 s · thu_KHNHANH1 53 s · thu_KHMUA1b 40 s · thu_KHMUA1 39 s · thu_KHUI3a 38 s ·
     thu_KHHANG2 33 s · thu_KHCT1 33 s; còn lại < 30 s. Máy ĐO LẠI trước khi sửa và ghi bảng vào trang_thai.md. -->

## Mục tiêu
Không bài thử nào chạy quá 40 giây khi máy rảnh (còn dư 3 lần so với trần 120 giây khi máy bận); khi một bài thật sự quá giờ thì báo đúng là "quá giờ", không lẫn với "đỏ".

## Nghiệm thu
- A1 Mỗi bài `cong_cu/thu_*.js` chạy một mình trên máy rảnh ≤ 40 giây (đo 2 lần, lấy lần chậm hơn). Bảng TRƯỚC / SAU từng bài (giây) ghi vào `viec/KH-THU-1/trang_thai.md`.
- A2 KHÔNG đổi hành vi bất kỳ ca nào: cùng tên ca, cùng số ca (`SỐ CA` mỗi bài trước = sau, đếm cả khi `KHONG_TRINH_DUYET=1` và khi có Chromium), cùng điều kiện đạt.
  KHÔNG bỏ ca, KHÔNG nới điều kiện, KHÔNG tăng trần 120 giây. Chỉ được: dùng chung MỘT trình duyệt / MỘT trang / MỘT máy chủ giả cho cả bài thay vì mở lại từng ca;
  thay chờ cố định (`waitForTimeout`, `setTimeout` chờ) bằng chờ đúng điều kiện (`waitForSelector`, `waitForFunction`, chờ yêu cầu mạng); dựng app MỘT lần; đồng hồ giả thay chờ thật.
  KHÔNG tách file (file mới không được miễn A11). Làm hết cách mà một bài vẫn > 40 giây → ghi số đo + lý do vào `## Phát hiện`, KHÔNG dừng việc (miễn là ≤ 60 giây).
- A3 Chạy 3 bài lâu nhất CÙNG LÚC (giả máy bận) → mỗi bài vẫn ≤ 80 giây và XANH. Ghi số đo vào trang_thai.md.
- A4 `kiem_tra_truoc_khi_giao.js`, CHỈ vòng chạy bài thử: bài bị cắt vì quá giờ (`r.error.code === 'ETIMEDOUT'` hoặc `r.signal`) → dòng báo
  "✗ <file> QUÁ GIỜ 120 giây (máy bận? chạy riêng: node cong_cu/<file>)" thay cho dòng đỏ chung; mỗi bài in thêm số giây chạy "(… · 12 s)". Trần 120 giây giữ nguyên.
- A5 Không bài thử nào chạy chậm đi; cả bộ `npm test` nhanh hơn trước (ghi tổng trước / sau). `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT,
  ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.

## Phạm vi
- viec/KH-THU-1/**
- cong_cu/thu_KHUI3b.js
- cong_cu/thu_KHUI3d.js
- cong_cu/thu_KHNHANH1.js
- cong_cu/thu_KHMUA1b.js
- cong_cu/thu_KHMUA1.js
- cong_cu/thu_KHUI3a.js
- cong_cu/thu_KHHANG2.js
- cong_cu/thu_KHCT1.js
- kiem_tra_truoc_khi_giao.js

## Bài thử đỏ
không — việc chỉ rút thời gian bài thử đã có, không đổi code app (src/) và không đổi hành vi ca nào; chỗ đổi ở kiem_tra_truoc_khi_giao.js chỉ là chữ báo quá giờ + số giây

## Bài thử cũ sửa
- cong_cu/thu_KHUI3b.js — chỉ rút thời gian (dùng chung trình duyệt, chờ theo điều kiện), giữ nguyên mọi ca
- cong_cu/thu_KHUI3d.js — chỉ rút thời gian, giữ nguyên mọi ca
- cong_cu/thu_KHNHANH1.js — chỉ rút thời gian, giữ nguyên mọi ca
- cong_cu/thu_KHMUA1b.js — chỉ rút thời gian, giữ nguyên mọi ca
- cong_cu/thu_KHMUA1.js — chỉ rút thời gian, giữ nguyên mọi ca
- cong_cu/thu_KHUI3a.js — chỉ rút thời gian, giữ nguyên mọi ca
- cong_cu/thu_KHHANG2.js — chỉ rút thời gian, giữ nguyên mọi ca
- cong_cu/thu_KHCT1.js — chỉ rút thời gian, giữ nguyên mọi ca

<!-- Dòng của file không sửa thì cổng bỏ qua (không hại). -->

## Ngân sách
Chủ yếu sửa trong bài thử (± ~300 dòng), `kiem_tra_truoc_khi_giao.js` ≤ 15 dòng. **Phương án đơn giản nhất đã xét:** tăng trần 120 → 300 giây — KHÔNG chọn vì chỉ giấu chậm,
cổng GitHub và chủ quán vẫn chờ lâu; dùng chung trình duyệt + chờ theo điều kiện là đủ cho phần lớn. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `src/**`, `public/**`, `index.html`, `vite.config.mjs`, `package.json`, `package-lock.json`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`,
  `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG sửa bài thử của việc đang chạy song song: `cong_cu/thu_KHUI5b.js`, `cong_cu/thu_KHUI5b_mau.json`, `cong_cu/thu_KHUI5c.js` (KH-UI-5c), `cong_cu/thu_KHPWA1.js` (KH-PWA-1).
- `kiem_tra_truoc_khi_giao.js`: CHỈ vòng "Bài thử cong_cu/thu_*.js" (A4); không đụng K1–K9, `DUYET_NGOAI_DEMO`, trần 120 000.
- Không bỏ ca, không nới điều kiện, không thêm `## Bài thử cũ sửa` cho file không sửa.
- Chỉ push `git push -u origin viec/KH-THU-1`. Không đụng `main`, không merge, không tạo PR.
