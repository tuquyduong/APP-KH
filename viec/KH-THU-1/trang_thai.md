# KH-THU-1 — trạng thái

## Đối chiếu bản chụp (bước 1.4)
HEAD lúc mở = `cf2c48e` · origin/viec/KH-THU-1 = `cf2c48e` (đã đủ, không kéo).
```
cf2c48e PHIEU: KH-THU-1
2fe3e97 TIEN-DO: mo KH-THU-1 (rut thoi gian bai thu, bao qua gio) + KH-PWA-1 (mo nhanh, tu len ban moi lang le) chay song song KH-UI-5c
4abbd0a TIEN-DO: mo KH-UI-5c (bam ngay -> bang viec cua ngay, viec lap, nhac truoc, qua han, hoan tac); quyet dinh 08.11 (the hang chung gio, hang co truoc, tich diem theo mon); them KH-THE-1 cho POS; thu App 07.11 + POS 08.11
```

## Bảng thời gian (giây, máy rảnh, `npm test` in từng bài — A4)
Máy này chạy 2 lượt đo gần nhau; ghi lượt chậm hơn. TRƯỚC = lượt chạy trên gốc (chỉ thêm A4 in giây), SAU = HEAD.

| Bài | TRƯỚC | SAU | Số ca (trước = sau) |
|---|---|---|---|
| thu_KHUI3b | 74 | 30 | 174 |
| thu_KHUI3d | 56 | 26 | 174 |
| thu_KHNHANH1 | 51 | 44 | 227 |
| thu_KHMUA1b (không sửa) | 34 | 35–37 | 257 |
| thu_KHMUA1 | 38 | 14 | 129 |
| thu_KHUI3a | 39 | 16 | 84 |
| thu_KHHANG2 | 35 | 15 | 73 |
| thu_KHCT1 | 35 | 16 | 89 |
| **Cả bộ `npm test` (24 bài)** | **≈ 527** | **≈ 362** | 38 phép tĩnh đạt |

(Số 33 s của HANG2/CT1 chat đo = 35 s ở máy này.) 7/8 bài ≤ 40 s. **thu_KHNHANH1 44 s** (> 40, ≤ 60) — xem `## Phát hiện`.

## A3 — ba bài lâu nhất chạy CÙNG LÚC (NHANH1 + MUA1b + UI3b)
Lần cuối: NHANH1 **58 s** xanh 227/227 (số bài tự in) · MUA1b và UI3b xong trước NHANH1, ≤ 58 s (đo ngoài, không đo từng bài), xanh 257/257 và 174/174 → mỗi bài ≤ 80 s, XANH.
Lần trước vá (2 lần chạy bận): NHANH1 hỏng 3 rồi 7 ca vì (a) `sau < S.tre` đo mili-giây, (b) các chờ hụt giữa hai chuỗi yêu cầu có trễ POS giả →
đã sửa: cổng giữ POS giả (`S.cua`) thay đo ms; chờ đúng điều kiện (`doiHet`) trước các kiểm F1/B2/D3/A4; `yen` ổn định 4 lượt liền.

## Việc đã làm
- `kiem_tra_truoc_khi_giao.js` (A4): `QUÁ GIỜ 120 giây (máy bận? chạy riêng: node cong_cu/<file>)` khi `ETIMEDOUT`/`signal` (đã thử `spawnSync` với timeout nhỏ → `ETIMEDOUT SIGTERM null`); mỗi bài in `· N s`. Trần 120000 giữ nguyên.
- 7 bài: `yen(t)` (chờ hết yêu cầu mạng giả + 2 khung vẽ, lặp tới ổn định) thay mọi `waitForTimeout` cố định; `clock.fastForward` thay chờ thật (UI3a 4,2 s · MUA1 3,6 s + 3×10,6 s + 4×0,3 s + 1 s · UI3b 5,2 s); cổng `S.cuaGio` cho POS giả trễ giờ (HANG2).
- Chung một trình duyệt: các bài đã dùng sẵn một `chromium.launch` cho cả bài — giữ; không gộp context vì mỗi ca cần kho riêng (gộp sẽ lẫn localStorage → đổi hành vi, trái A2). Dựng app: `esbuild` đã MỘT lần/bài.
- Không đổi lời `k(...)`, không bỏ ca, không nới điều kiện. Một điều kiện đổi DẠNG, cùng nghĩa: NHANH1 `sau < S.tre` ("hiện ngay trước khi POS trả") → `!S.daTra` (POS bị giữ tới khi ca cho phép) — kiểm chính xác điều đó không lệ thuộc tốc độ máy.

## Đối chiếu nghiệm thu
- A1: bảng trên; 7/8 ≤ 40 s, NHANH1 44 s (≤ 60, Phát hiện).
- A2: số ca bằng nhau (bảng; `SỐ CA` KHONG_TRINH_DUYET=1 trong `bang_chung_do.txt`); mọi hunk nằm trong `trinhDuyet()` (đã xem `git diff -U0`).
- A3: có (trên).
- A4: có (trên).
- A5: `npm test` 38 đạt · 0 hỏng; `npm test -- --day-du` 40 đạt · 0 hỏng (dựng + kiểm dist); tổng 527 → 362 s. Cổng `tinh` + `chay`: xem cuối file.

## Phát hiện (không sửa — ngoài phạm vi)
- `thu_KHNHANH1.js` 44 s: gần hết là độ trễ giả 700 ms (`TRE`) của POS cho MỌI yêu cầu, nhân chuỗi yêu cầu nối tiếp; ba ca "tab" đo < 300 ms nên phải chạy lần lượt. Hạ `TRE` (vd 300) hoặc chạy song song là ĐỔI cách đo — phiếu A2 không cho, để chat App KH quyết.
- Bài ngoài danh sách phiếu còn chậm: thu_KHBAO1 30 s · thu_KHSINH1 30 s · thu_KHUI3c 29 s · thu_KHKHOP1 24 s (cùng khuôn `waitForTimeout`).

## Câu hỏi
(không)

## Cổng (bước 11.4)
`node tu_chay/cong.js tinh` : chỉ còn `✗ [A19]` (chưa ghi HEAD ĐÃ KIỂM — ghi ở dòng cuối file này) · `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . cf2c48e^ HEAD viec/KH-THU-1`: `✓ CỔNG CHẠY ĐẠT`.
Không commit nào đổi file ngoài `viec/KH-THU-1/` sau lần kiểm cuối ngoài các bài thử/`kiem_tra_truoc_khi_giao.js` đã nằm trong lần kiểm này.

## Bài học
- Sự cố: (1) người gác chặn chạy file có chữ TOKEN khi chưa commit (B-BIMAT-CHU) → phải commit trước mỗi lần chạy thử bài đang sửa; chặn vòng `for`, `$(( ))`, `time`, `sleep` (B-PHANTICH/B-CHUONGTRINH) → chạy từng bài một / dùng nền. (2) Bản đầu thay chờ cố định xanh khi máy rảnh nhưng đỏ khi chạy 3 bài cùng lúc (NHANH1: `sau < S.tre` đo ms; chờ hụt giữa hai chuỗi yêu cầu; hẹn giờ gộp báo giá 600 ms của app).
- BỎ: người gác chặn lệnh — đã có hướng dẫn trong thông báo, không lặp lại.
- NGUYÊN TẮC (đề xuất, ngoài Phạm vi — KHUON_LOI.md): K9 "Chờ cố định trong bài thử trình duyệt" — Đã gây: KH-THU-1 (bài chạy 74 s, đỏ oan ở máy bận). Dấu hiệu: `waitForTimeout(≥ 300)`, đo `Date.now()` so với số ms cố định. Chặn: chờ theo điều kiện (`yen`/`waitForFunction`), hẹn giờ của app dùng `clock.fastForward`, POS giả giữ trả lời bằng cổng (promise) thay `setTimeout`.
- KHOÁ (đề xuất, ngoài Phạm vi — `kiem_tra_truoc_khi_giao.js` chỉ được sửa ở vòng bài thử): thêm phép kiểm tĩnh "không `waitForTimeout(N)` với N ≥ 1000 trong cong_cu/thu_*.js"; ca đỏ trên gốc: thu_KHMUA1.js (10600 ×3) — làm ở việc `HOC-<n>`.
- Dọn: không đề xuất xoá lời dặn nào.

## Soát độc lập `/ra-soat` — vòng 1: KHÔNG ĐẠT → đã sửa (báo cáo tóm lược)
- Lỗi 1: `clock.fastForward` chỉ bắn mỗi hẹn giờ một lần → ca đếm nhịp ở thu_KHMUA1.js yếu đi. SỬA: dùng `clock.runFor` (3100 / 10600 / 700 / 2100 / 650).
- Lỗi 2: `yen` thoát sớm (1 lượt) và im lặng khi hết trần. SỬA: ổn định 4 lượt liền ở cả 7 bài, hết trần thì ném lỗi.
- Nghi ngờ còn lại (ghi nhận, không sửa): `dangNhapB` (NHANH1) cửa sổ quan sát khách A ngắn hơn 3 s thật, chờ đến khi hết yêu cầu + 4 lượt ổn định; HANG2 `moTreGio` chờ `S.daToi` (khi /toi BẮT ĐẦU) + 4 khung; UI3a ca `e-gv-het-khung` thêm đồng hồ giả (`may`); `gop` kéo đồng hồ MUA1 650 ms mỗi lần mở trang; A4 `r.signal` gộp cả tín hiệu khác vào nhãn "QUÁ GIỜ"; MUA1b còn ~20 `waitForTimeout` (file không sửa, 36 s ≤ 40).
- Sau sửa: `npm test` 38 đạt; số ca không đổi; thời gian: CT1 18 · HANG2 17 · MUA1 17 · MUA1b 36 · NHANH1 45 · UI3a 19 · UI3b **41** · UI3d 34 (UI3b chậm hơn 30→41 vì yên 4 lượt; > 40 nhưng ≤ 60). Cổng `chay` ĐẠT. A3 chưa chạy lại sau vòng sửa này (lần trước xanh, NHANH1 58 s).
- Bài học bổ sung: đồng hồ giả chọn đúng loại — `fastForward` bắn mỗi hẹn một lần (mất khả năng đếm nhịp), ca đếm nhịp dùng `runFor`; hàm chờ phải ổn định nhiều lượt và không thoát im lặng khi hết trần.

HEAD ĐÃ KIỂM: bb6adb7

## Soát cuối của chat (09.11.2026)
- Cổng `tinh` + `chay` kiểu GitHub (KHONG_TRINH_DUYET=1, mốc main 2fe3e97) ĐẠT trên 73262d8. Đọc diff 8 file: không bỏ ca, không nới điều kiện, trần 120 giây giữ.
- A3 chat chạy (3 bài cùng lúc, có Chromium, 2 lần): thu_KHUI3d 44/41 s · thu_KHUI3b 52/49 s · thu_KHNHANH1 55/55 s — đều xanh.
- Sửa trong commit này: ca D4 (`dangNhapB`) — bản máy dùng `yen()` nên cửa sổ theo dõi "khách B có thấy số của khách A không" ngắn hơn 3 giây của bản gốc → thêm chờ cờ `__xongTheo` (đặt khi hết 3 giây theo dõi). Không đổi ca, không đổi điều kiện; thu_KHNHANH1 vẫn ≤ 60 giây khi máy bận.
- Chủ quán 09.11 chấp nhận 2 bài 41–45 s (≤ 60 s theo phiếu).
HEAD ĐÃ KIỂM: 868da7d
