# KH-PWA-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-PWA-1`, cây sạch. HEAD `47fce03` · FETCH_HEAD `47fce03` (bằng nhau → không kéo).
```
47fce03 PHIEU: KH-PWA-1
2fe3e97 TIEN-DO: mo KH-THU-1 (rut thoi gian bai thu, bao qua gio) + KH-PWA-1 (mo nhanh, tu len ban moi lang le) chay song song KH-UI-5c
4abbd0a TIEN-DO: mo KH-UI-5c (bam ngay -> bang viec cua ngay, viec lap, nhac truoc, qua han, hoan tac); quyet dinh 08.11 (the hang chung gio, hang co truoc, tich diem theo mon); them KH-THE-1 cho POS; thu App 07.11 + POS 08.11
```
- Phiên làm tiếp 09.11 (sau Trả lời Câu hỏi 1): nhánh `viec/KH-PWA-1`, cây sạch. HEAD `0eeb22d` · FETCH_HEAD `0eeb22d` (bằng nhau → không kéo; hook mở phiên đã kéo 47fce03 → 0eeb22d).
```
0eeb22d PHIEU: KH-PWA-1 - tra loi Cau hoi 1 (chu quan duyet 08.11): them cong_cu/thu_KHUI2.js vao Pham vi (ca E2 -> SW chi dang ky qua dangKySW.js); /tracnghiem/lam khong an toan
1fef4cc KH-PWA-1: Cau hoi - bai cu thu_KHUI2 E2 cam service worker
3b727fb KH-PWA-1: bang chung do + trang thai
```

## Quyết định trong phạm vi phiếu
- **B2 hỏi index.html qua service worker**: bộ kiểm K1 (`kiem_tra_truoc_khi_giao.js:36-37`) cấm `fetch(` trong `src/` ngoài `src/api.js`, mà `api.js` CẤM sửa →
  `src/dangKySW.js` nhắn SW (`postMessage` + `MessageChannel`), SW hỏi `/` (`cache: 'no-store'`), lưu đè vỏ, trả tên `/assets/index-*.js`.
- **Luật A2 ở `public/sw.js`** (chỗ duy nhất dùng; `public/` chép nguyên, không `import` được `src/`). Bài thử nạp `sw.js` bằng `vm` → thử hàm thật, không chép luật hai chỗ.
- **Màn an toàn thêm `.sheet.show`**: bảng "Thêm việc" của Kế hoạch (`src/components/ThemViec.jsx:22`) là bảng nổi nhưng không có `role="dialog"` (file CẤM sửa) — phiếu
  B3 nói "bất kỳ bảng nổi / hộp thoại … gồm … bảng ngày của Kế hoạch", nên bộ chọn = `[role="dialog"],[aria-modal="true"],.sheet.show`.
- **Chờ màn an toàn**: thử lại mỗi 2 giây (bắt cả đổi trang lẫn đóng hộp thoại mà không sửa App.jsx — CẤM); chỉ tải lại khi trang đang hiện;
  nhớ tên bản đã tải lại (`sessionStorage` `kh_ban_da_tai_lai`) để không tải lại liên tục.
- **Lưu đúng loại**: vỏ chỉ lưu khi `text/html`; `/assets` KHÔNG lưu `text/html` (Cloudflare không có 404.html → trả index.html 200 cho tệp băm đã xoá).
  Phản hồi `redirected` không lưu. Lưu đè vỏ CÙNG bản không dọn assets (bài thử bắt: vỏ bị đè hai lần → mất bản trước).
- Lần đầu: install lưu sẵn vỏ + tệp vỏ trỏ tới (`cache: 'reload'`) để lần mở thứ hai không mạng vẫn có Trang chủ (C1).

## Bảng chỗ vá → đột biến (dot_bien.py — 21/21 bị bắt; lần chạy 20 đột biến đầu: TẤT CẢ ĐỎ, VS-DK-ENV-KHONG-HOI thêm vòng 2, bài thử bắt bằng ca "A1 không có import.meta.env")
| Chỗ vá | Đột biến |
|---|---|
| sw.js chienLuoc — không đụng /api, khác miền, không GET, /kiemkhop | VS-SW-LUU-API, VS-SW-KHAC-MIEN, VS-SW-POST, VS-SW-KIEMKHOP |
| sw.js chienLuoc — trang mạng trước | VS-SW-TRANG-LUU-TRUOC |
| sw.js trang — chờ 3 giây rồi vỏ lưu | VS-SW-KHONG-CHO-3-GIAY |
| sw.js luuVo — dọn assets giữ 2 bản | VS-SW-DON-KHI-LUU-DE-CUNG-BAN, BV-SW-BO-DON-ASSETS |
| sw.js luuTep — /assets không lưu HTML | VS-SW-ASSETS-LUU-HTML |
| sw.js tenBan — HTML hỏng → '' | VS-SW-TENBAN-HONG |
| sw.js install lưu sẵn vỏ / activate claim | BV-SW-BO-LUU-SAN, BV-SW-BO-CLAIM |
| dangKySW coTheTaiLai — hộp thoại, /thanhtoan | VS-DK-BO-HOP-THOAI, VS-DK-THANHTOAN-AN-TOAN |
| dangKySW coTheTaiLai — /tracnghiem/lam (vòng 3, chủ quán 08.11) | BV-DK-BO-TRACNGHIEM-LAM, VS-DK-TRACNGHIEM-CA-GOC |
| sw.js luuVo — đổi bản: tải đủ /assets TRƯỚC rồi mới lưu vỏ (vòng 4, /ra-soat 1) | BV-SW-VO-TRUOC-ASSETS, VS-SW-VO-TRUOC-KHI-TAI |
| sw.js trang — trả mạng ngay, lưu vỏ ở nền (vòng 4) | VS-SW-TRANG-CHO-LUU |
| sw.js luuVo — chỉ /assets thiếu mới chặn lưu vỏ; activate xoá kho cũ (vòng 5, /ra-soat 2) | VS-SW-NEM-KHI-PHONG-LOI, BV-SW-ACTIVATE-KHONG-XOA |
| dangKySW denLucKiem — 30 phút | VS-DK-KIEM-MOI-LAN-HIEN |
| dangKySW doiBan — tên rỗng không đổi | VS-DK-TEN-RONG-LA-DOI |
| dangKySW — chỉ PROD, không ném khi không có import.meta.env | VS-DK-DANG-KY-CA-DEV, VS-DK-ENV-KHONG-HOI |
| dangKySW — location.reload() | BV-DK-BO-TAI-LAI |
| main.jsx gọi dangKySW() | BV-MAIN-BO-DANG-KY |
| _headers /assets immutable | BV-HEADERS-BO-ASSETS |

## Kết quả kiểm (tới 3b727fb + vòng 2)
- `thu_KHPWA1.js`: KHONG_TRINH_DUYET=1 → 35 đạt · 0 hỏng; có Chromium → 53 đạt · 0 hỏng (26 giây — trong hạn 40 giây của phiếu).
- `node kiem_tra_truoc_khi_giao.js --day-du`: **40 đạt · 1 hỏng** — `✗ thu_KHUI2.js xanh (77 đạt · 1 hỏng)` — ca `✗ E2 không service worker` (xem Câu hỏi).
- `node tu_chay/cong.js tinh . 47fce03^ HEAD viec/KH-PWA-1`: `✗ [A17]` (tên đột biến — đã ghi bảng trên), `✗ [A19]` (chưa tới bước 11.4 — bình thường).

## Kết quả kiểm vòng 3 (09.11 — sau Trả lời Câu hỏi 1)
- `thu_KHPWA1.js`: ca mới "B3 KHÔNG an toàn: /tracnghiem/lam…" đỏ trên 75fb2f2 (35 đạt · 1 hỏng), xanh sau c32ee1c: KHONG_TRINH_DUYET=1 → 36 đạt · 0 hỏng;
  có Chromium → 54 đạt · 0 hỏng (28 giây).
- `thu_KHUI2.js`: ca E2 đổi → `E2 service worker chỉ đăng ký qua src/dangKySW.js` (đủ 4 điều của Trả lời Câu hỏi 1); trên gốc 47fce03 77 đạt · 1 hỏng (✗ E2), sau vá 78 đạt · 0 hỏng.
- `dot_bien.py`: 23/23 đột biến bị bắt ("TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT"). Lần chạy đầu vòng 3: VS-DK-DANG-KY-CA-DEV "KHÔNG ÁP ĐƯỢC" — nguồn thiếu dấu cách `||!(`;
  sửa khoảng trắng (cd99941) → áp được, ĐỎ.
- `npm test`: 39 đạt · 0 hỏng. `node kiem_tra_truoc_khi_giao.js --day-du`: 41 đạt · 0 hỏng.
- Ngân sách: app 161 dòng (sw.js 102 + dangKySW.js 59; phiếu ~150), thử 291 dòng (phiếu ~250) — dưới 1,5 lần.

## Câu hỏi
2. (KHÔNG chặn gộp — máy làm đúng phiếu, chờ chủ quán quyết sau khi thử tay iPhone) **Âm thanh màn mở trên iPhone.** Phiếu A2 xếp `/am_thanh/*` vào "trả bản lưu".
   Safari iOS phát media qua service worker cần phản hồi 206 (Range); `sw.js` trả 200 đầy đủ → có thể âm thanh màn mở (ManDau.jsx) câm trên iPhone. Chủ quán thử tay
   (bước 1 của `huong_dan_kiem_tay.md`, lần mở thứ hai, có tiếng không). Câm → đề xuất bỏ `am_thanh` khỏi luật `TINH` (`public/sw.js:8`, một chữ) — cần chủ quán duyệt vì đổi A2.

(Câu hỏi 1 — ĐÃ TRẢ LỜI ở phiếu 0eeb22d, đã làm vòng 3. Giữ lại để tra.)
1. **Bài cũ `cong_cu/thu_KHUI2.js:119` chặn đúng việc phiếu này giao.** Ca `k('E2 không service worker', !/serviceWorker/.test(main.jsx + App.jsx + index.html) && !fs.existsSync('public/sw.js'))`
   (luật của KH-UI-2 hồi trước) nay ĐỎ vì KH-PWA-1 A1 bắt buộc có `public/sw.js` và đăng ký service worker. File này ngoài `## Phạm vi`, và `## Cấm` không cho sửa
   bài thử khác → máy KHÔNG sửa. Xin chủ quán (chat soát) sửa phiếu:
   - thêm `cong_cu/thu_KHUI2.js` vào `## Phạm vi`;
   - thêm mục `## Bài thử cũ sửa`: "thu_KHUI2.js ca E2 — đổi thành: service worker CHỈ đăng ký qua `src/dangKySW.js` (main.jsx / App.jsx / index.html không gọi `serviceWorker` trực tiếp)".
     Ca sửa này XANH trên code gốc 47fce03 (gốc không có serviceWorker nào) → cần `## Bài thử cũ sửa` (A11); bài mới `thu_KHPWA1.js` đã đỏ trên gốc (2 đạt · 7 hỏng) nên
     A12 không cần thêm. Đề xuất nội dung ca mới (≈ 1 dòng): `!/serviceWorker/.test(main.jsx + App.jsx + index.html) && /navigator\.serviceWorker\.register\('\/sw\.js'/.test(src/dangKySW.js)`.
   Mọi thứ khác đã xong và xanh; sau khi phiếu được sửa, máy làm tiếp: sửa ca E2, `--day-du`, cổng `chay`, `/ra-soat`, báo cáo 7 mục.

## Phát hiện
- [ĐÃ LÀM vòng 3 theo Trả lời Câu hỏi 1 — `/tracnghiem/lam` và đường con nay KHÔNG an toàn] `/tracnghiem/lam` (đang làm trắc nghiệm): câu trả lời dở chỉ nằm trong state (`src/pages/TracNghiemLam.jsx` — "bài chưa làm xong không được lưu"). Phiếu B3 xếp màn này
  "an toàn" → khách bỏ App chạy nền ≥ 30 phút giữa bài, có bản mới, quay lại sẽ mất bài dở. Máy làm ĐÚNG phiếu; nếu chủ quán muốn giữ bài dở thì thêm `/tracnghiem/lam` vào danh sách
  không an toàn (một chữ trong `KHONG_AN_TOAN` của `src/dangKySW.js`).
- Agent soát kế hoạch (bước 3) nêu 7 điểm; đã làm: vỏ chỉ lưu text/html, /assets không lưu HTML, phản hồi chuyển hướng không lưu, mạng về muộn vẫn lưu đè vỏ (`waitUntil`),
  chống tải lại liên tục (sessionStorage), `.sheet.show`, chỉ tải lại khi trang hiện, install `cache: 'reload'`.

Ghi 08.11: dừng ở Câu hỏi 1 (bước 6 — `npm test` đỏ do bài cũ ngoài phạm vi).

- `public/sw.js:54-58` dọn kho chỉ giữ tệp mà `index.html` trỏ tới. Hôm nay dist chỉ 1 JS + 1 CSS (`grep -rn "lazy(\|import(" src/` không ra) nên ổn. Sau này dùng
  `React.lazy` / `import()` thì tệp tách bị dọn và không được tải trước → mất mạng mở màn đó vỡ. Việc đó phải sửa sw.js cùng lúc (người soát vòng 2 nêu).
- Mạng trả 5xx/404 (không ném) cho trang → khách nhận trang lỗi, không phải vỏ đã lưu (phiếu A2 chỉ nói "mạng lỗi / quá 3 giây"). Cloudflare Pages ít khi 5xx; để chủ quán quyết nếu cần.
- Vỏ lưu cả khi HTML 200 không có tệp App (`tenBan` rỗng) — trên HTTPS khó xảy ra; chặn gọn được bằng `tenBan(html) &&` nếu chủ quán muốn.

## Cổng (09.11, đứng ở ec00466, cây sạch)
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 47fce03^ HEAD viec/KH-PWA-1` → ✓ CỔNG CHẠY ĐẠT
  (lần đầu ✗ [A16] ×2: dòng `SỐ CA` thiếu `cong_cu/` ở đầu tên bài — sửa ec00466).
- `node tu_chay/cong.js tinh …` trước dòng HEAD ĐÃ KIỂM: chỉ còn ✗ [A19] (thiếu dòng này) — A17 đã ghi 2 tên đột biến mới.

HEAD ĐÃ KIỂM: ec00466

## /ra-soat vòng 1 (09.11, agent độc lập, soát 47fce03^..87d670e) — báo cáo chép nguyên
```
KHÔNG ĐẠT
LỖI TÌM ĐƯỢC:
- public/sw.js:38-51 (luuVo), gọi từ :76 (trang) và :101 (message kiemBan) — trắng màn khi mất mạng sau một lần cập nhật. luuVo lưu đè vỏ "/" của bản MỚI nhưng không tải các tệp /assets mà vỏ đó trỏ tới. Chỉ install (:67) tải sẵn tệp của vỏ. Hai đường gây lỗi:
  (a) Mạng chậm hơn 3 giây đúng lúc có bản mới: trang nhận vỏ cũ sau 3 giây, mạng về muộn thì vỏ mới bị lưu đè, assets mới không có trong kho.
  (b) kiemBan lưu vỏ mới khi khách đang ở màn không an toàn (/thanhtoan…), rồi khách đóng App hoặc mất mạng trước khi tải lại.
  Lần mở sau mà không có mạng: sw.js:82 trả vỏ mới, /assets/index-<mới>.js không có trong kho, luuTep :90 lỗi mạng, #root rỗng.
  Đã CHẠY THẬT (Chromium, nháp thu_trang_trang.js): "vỏ trong kho trỏ: /assets/index-EQZzL_H9-moi1.js · kho có: [index-CKEsnr98.css, index-EQZzL_H9.js, /]" · "mất mạng, mở lại → thấy Trang chủ: false · #root rỗng: true".
  Trái A2 và C3 bước 2. Bài thử không bắt vì ca tắt mạng (thu_KHPWA1.js:224-229) chạy TRƯỚC mọi lần đổi bản. Khuôn K5 + K3.
  Cách vá: trong luuVo, khi đổi bản thì tải đủ tepCuaBan(html) vào kho TRƯỚC rồi mới put vỏ (dùng lại luuTep như install); install khi đó chỉ cần layVo.
- public/sw.js:75-77 — trang chờ `await luuVo(...)` xong mới trả phản hồi: (1) phải tải hết thân HTML + làm xong kho rồi mới hiện; (2) luuVo lỗi (QuotaExceededError) → nhánh catch :82 trả vỏ CŨ thay phản hồi mạng mới. K5. Gọn hơn: e.waitUntil(luuVo(res.clone()).catch(()=>{})) rồi trả res ngay.
- cong_cu/thu_KHPWA1.js:78-79, :85-86, :90 — với KHONG_TRINH_DUYET=1 phần trang() / luuVo / install chỉ kiểm bằng marker (`/\b3000\b/`, đếm `laHtml(` ≥ 3, regex skipWaiting/claim/caches.delete). Hành vi thật chỉ bắt bằng Chromium ở máy. K3 (marker suông). Không chặn gộp.
- cong_cu/thu_KHPWA1.js:271-274 — ca "B3 ở /thanhtoan" chạy khi chưa đăng nhập nên App chuyển /dangnhap; /thanhtoan thật chưa thử trong trình duyệt (phần 1 :111 có thử hàm thuần). K3, nhẹ.
NGHI NGỜ:
- public/sw.js:8, :91-94 — /am_thanh/man_dau.mp3 (ManDau.jsx:100 preload="none") qua respondWith với 200 đầy đủ, mất header Range; Safari/iOS đòi 206 cho media từ service worker → có thể câm trên iPhone. Cần thử tay iPhone, hoặc bỏ /am_thanh khỏi luật (cần chủ quán duyệt vì A2 ghi /am_thanh).
- public/sw.js:82 — mạng trả 5xx/404 (không ném) → khách thấy trang lỗi, không phải vỏ đã lưu. Phiếu chỉ nói "mạng lỗi".
- src/dangKySW.js — setInterval 2 giây: tải lại có thể xảy ra 2 giây sau khi khách vừa sang màn an toàn và đang gõ (ô nhập mã /uudai, NhanMa.jsx:38) hoặc đưa QR ở /mathanhvien. Đúng chữ phiếu B2/B3, chủ quán nên biết.
- trang_thai.md dẫn kiem_tra_truoc_khi_giao.js:35-36; thực tế :36-37. "HEAD ĐÃ KIỂM: ec00466" khi HEAD 87d670e (chỉ đổi trang_thai.md) — chấp nhận được.
NGHIỆM THU: 12/12 mục có bằng chứng, nhưng A2 (và C3 bước 2) KHÔNG đúng trong ca "bản mới về khi mạng chậm / chờ màn an toàn rồi mất mạng" — đã chạy và thấy trắng màn. Vì vậy KHÔNG ĐẠT.
CHƯA SOÁT ĐƯỢC: Safari/iOS (Range cho mp3, PWA standalone chạy tiếp từ nền), trình duyệt Zalo, Cloudflare Pages thật (_headers, index.html 200 cho tệp băm đã xoá, /index.html → /), kho đầy / riêng tư trên máy thật. Chưa chạy lại cong.js chay.
BÀI HỌC: KHOÁ — "Service worker lưu vỏ HTML thì mọi tệp vỏ đó trỏ tới phải có trong kho TRƯỚC khi lưu vỏ"; ca Chromium đổi bản lúc mạng chậm / qua kiểm nền → mất mạng → mở lại vẫn thấy Trang chủ. NGUYÊN TẮC: ca chỉ khớp hằng số / đếm tên hàm (marker) không tính là bằng chứng hành vi; hành vi phải có ca chạy thật (vm với fetch/caches giả) để GitHub (không trình duyệt) cũng bắt.
```
(Chi tiết 8 mục K3/K4/K5/K1/tiền/P1/nghiệm thu/đơn giản: K4 — 3 chỗ respondWith đều sau `if (!luat) return`, 3 bảng nổi trong src/ đều `.sheet.show`; tiền / dữ liệu khách: SW không lưu token, /api, dữ liệu khách; P1: vite build chạy, dist/ không commit.)

## Vá vòng 1 (sau /ra-soat 1)
- `public/sw.js` luuVo: đổi bản → tải mọi tệp vỏ mới trỏ tới mà kho chưa có (`luuTep(p, 'reload')`); tệp `/assets` thiếu / sai loại → ném, vỏ cũ GIỮ NGUYÊN
  (kiemBan khi đó trả '' → không tải lại sang bản chưa đủ tệp). install còn `layVo('reload')` (luuVo tự tải tệp).
- `public/sw.js` trang: trả phản hồi mạng ngay; lưu vỏ trong `e.waitUntil(...)` (lưu lỗi bị nuốt, không đổi phản hồi).
- Bài thử: +5 ca hành vi trong vm (kho + mạng giả: không lưu đè vỏ khi thiếu /assets; tải đủ rồi mới lưu; kho đầy vẫn trả mạng; mạng treo → hẹn đúng 3000 ms rồi vỏ lưu;
  chỉ lưu đúng loại) + 1 ca Chromium (moi4 về ở nền khi ở /thanhtoan → mất mạng → mở lại vẫn có khung). Bỏ 2 ca marker (`3000`, đếm `laHtml(`) — ca hành vi thay.
  Đỏ trên sw.js chưa vá: 36 đạt · 3 hỏng (không trình duyệt), 55 · 4 (Chromium — tái hiện đúng trắng màn `#root 0`). Sau vá: 39 · 0 và 58 · 0 (28 giây).
- Đột biến: 26/26 bị bắt (thêm BV-SW-VO-TRUOC-ASSETS, VS-SW-VO-TRUOC-KHI-TAI, VS-SW-TRANG-CHO-LUU; VS-SW-ASSETS-LUU-HTML lần đầu SỐNG vì ca marker đếm `laHtml(` — nay ca hành vi bắt).
- `npm test` 39 · 0; `--day-du` 41 · 0. Ngân sách: app 168 dòng (sw 109 + dangKySW 59; ~150 → 1,12 lần); thử 359 dòng (~250 → 1,44 lần, dưới 1,5) — thêm do ca hành vi vm.
- KHÔNG làm (ghi lại cho chủ quán): NGHI NGỜ mp3 Range trên iOS (bỏ /am_thanh khỏi luật là đổi A2 → cần chủ quán); 5xx/404 không trả vỏ (phiếu chỉ nói "mạng lỗi");
  tải lại 2 giây sau khi sang màn an toàn (đúng B2/B3). Xem `## Câu hỏi` 2.
- Cổng (đứng ở 0ce15f4, cây sạch): `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 47fce03^ HEAD viec/KH-PWA-1` → ✓ CỔNG CHẠY ĐẠT; `tinh` chỉ ✗ [A19] (dòng dưới).

HEAD ĐÃ KIỂM: 0ce15f4

## /ra-soat vòng 2 (09.11, agent độc lập, soát 47fce03^..0ce15f4+) — báo cáo chép nguyên (rút phần "đã chạy" thành một dòng)
```
ĐẠT
LỖI TÌM ĐƯỢC:  không có lỗi nào làm sai nghiệm thu hay hỏng luồng thật (đã đọc code và chạy thật).
NGHI NGỜ:
- K3, ca marker vẫn làm bài xanh được (đột biến trên bản sao, có Chromium):
  (1) ACTIVATE-KHONG-XOA: `&& false` vào bộ lọc public/sw.js:80 → 58 · 0 (SỐNG); A3 "xoá kho cũ" chỉ canh bằng regex `caches\.delete\(` (thu_KHPWA1.js:91).
  (2) NEM-KHI-PHONG-LOI: ném khi BẤT KỲ tệp nào thiếu (public/sw.js:49) → 58 · 0 (SỐNG); chưa có ca "phông / ảnh 404 mà vỏ mới vẫn lưu".
  (3) A4 skipWaiting chỉ ca regex canh (:94); clients.claim có ca Chromium canh thật.
  Phiếu C1 không đòi riêng → không chặn gộp; mỗi chỗ thêm 1 ca vm là bắt được.
- public/sw.js:94-100: mạng trả 5xx/404 (không ném) → khách nhận trang lỗi, không vỏ đã lưu (vòng 1 đã nêu; phiếu chỉ nói "mạng lỗi").
- public/sw.js:8 (TINH, :103-106): Range cho /am_thanh/man_dau.mp3 nhận "200 82330" (bỏ Range); Chromium chịu được, Safari/iOS có thể câm. Đã ở Câu hỏi 2.
- public/sw.js:54-58: dọn kho chỉ giữ tệp index.html trỏ tới; hôm nay không có tệp tách (grep `lazy(|import(` rỗng). Sau này dùng React.lazy → vỡ khi mất mạng. Nên ghi Phát hiện.
- public/sw.js:44-52: vỏ lưu cả khi tenBan(html) rỗng (HTML 200 không phải App); trên HTTPS khó xảy ra. Chặn gọn: thêm `tenBan(html) &&`.
- K1: trang_thai.md dẫn kiem_tra_truoc_khi_giao.js:35-36, thực tế :36-37.
- cong_cu/thu_KHPWA1.js:296-299: ca "B3 ở /thanhtoan" thực chất đứng ở /dangnhap (cả hai không an toàn; hàm thuần :142 có thử /thanhtoan).
NGHIỆM THU:    12/12 mục có bằng chứng · mục thiếu: không
  (A1 main.jsx +2 dòng, dangKySW.js:28 · A2 chienLuoc sw.js:11-19, ca vm (a)–(e); kịch bản Chromium riêng S1 mạng chậm 6 giây đổi bản → mất mạng có khung; S2 phông 404 → vỏ mới vẫn lưu;
   S3 JS mới 404 → giữ vỏ cũ, mất mạng có khung — hai lỗi chặn vòng 1 đã hết · A3 'tqd-v1', 2 bản · A4 :75, :80 · A5 · B1–B4 Chromium 58 · 0 (29 giây) ·
   C1 39 · 0 / 58 · 0 · C2 npm test 39 · 0, cổng chay ĐẠT · C3 6 dòng · Câu hỏi 1: thu_KHUI2 chỉ đổi E2, đủ 4 điều.)
CHƯA SOÁT ĐƯỢC: Safari/iOS (Range mp3, PWA chạy nền), trình duyệt Zalo, Cloudflare Pages thật (_headers, /index.html → /), kho đầy trên máy thật, `--day-du` (không chạy lại), dot_bien.py (không chạy vì sửa tệp trong kho; tự chạy 5 đột biến trên bản sao: 3 bắt, 2 SỐNG như trên).
  Kiểm riêng: luuVo chỉ ném khi /assets thiếu (:49); Promise.all lỗi sớm để lại tệp mồ côi — vô hại, lần đổi bản sau dọn; cài lần đầu một /assets lỗi → không vỏ, lần mở sau lưu lại;
  res.clone() trong trang() chạy trước khi respondWith đọc thân; 4 chỗ waitUntil gọi đồng bộ; mọi đường lưu vỏ qua luuVo; không vòng lặp tải lại; Vite 7 đổi CHỈ CSS vẫn đổi tên JS → so tên JS đủ;
  SW không lưu /api, khác miền, token; vite build chạy; sw.js 109 + dangKySW.js 59 dòng, không phức tạp thừa.
BÀI HỌC: NGUYÊN TẮC — mỗi nhánh rẽ của bản vá phải có ca hành vi riêng cho TỪNG nhánh (một ca "mọi thứ hỏng" + một ca "mọi thứ được" không bắt đột biến gộp hai nhánh).
  KHOÁ (đề xuất) — mỗi luật ghi trong phiếu, chạy một đột biến "gỡ luật"; còn SỐNG mà chỉ có ca regex canh thì chưa tính là bằng chứng.
```

## Vá vòng 2 (sau /ra-soat 2 — làm 2 nghi ngờ rẻ, trong Phạm vi)
- +2 ca hành vi vm: "A2 đổi bản: phông / manifest lỗi nhưng đủ /assets → vẫn lưu vỏ mới", "A3 activate xoá kho cũ tqd-v0, giữ tqd-v1 và kho khác".
  Hai đột biến của người soát thêm vào dot_bien.py (VS-SW-NEM-KHI-PHONG-LOI, BV-SW-ACTIVATE-KHONG-XOA) — ĐỎ. Tổng 28/28 bị bắt.
- K1 sửa `:35-36` → `:36-37`. Ghi Phát hiện: tệp tách (React.lazy) sau này, 5xx/404, vỏ không có tệp App.
- Không làm: skipWaiting vẫn chỉ ca regex (bỏ skipWaiting thì SW mới chờ tab đóng — đột biến đã bị đúng ca đó bắt; ca hành vi cần hai bản SW trong Chromium, thêm ~5 giây, ngân sách thử đã 1,49 lần).
- Kiểm (đứng ở e459b18): thu_KHPWA1 41 · 0 (KHONG_TRINH_DUYET=1), 60 · 0 (Chromium, 29 giây); `npm test` 39 · 0; `--day-du` 41 · 0.

## Báo cáo 7 mục
- **VIỆC**: KH-PWA-1 — App mở gần như tức thì (service worker tự viết lưu sẵn vỏ, JS/CSS băm, phông, ảnh) và tự lên bản mới lặng lẽ ở màn an toàn.
- **ĐÃ SỬA**: `public/sw.js` (109 dòng, mới) — 3 luật + không đụng /api / khác miền / không GET / /kiemkhop / /sw.js; vỏ mới chỉ lưu khi đủ /assets; giữ 2 bản; kiemBan.
  `src/dangKySW.js` (59, mới) — đăng ký khi PROD, kiểm sau ≥ 30 phút ẩn, tải lại chỉ ở màn an toàn (thêm /tracnghiem/lam theo chủ quán 08.11).
  `src/main.jsx` +2 dòng. `public/_headers` 3 luật. `cong_cu/thu_KHPWA1.js` (373, mới). `cong_cu/thu_KHUI2.js` ca E2 (theo Trả lời Câu hỏi 1).
- **BÀI THỬ**: thu_KHPWA1 đỏ trên gốc (2 · 8), xanh 41 · 0 / 60 · 0 có Chromium; thu_KHUI2 đỏ trên gốc (77 · 1 ✗ E2), xanh 78 · 0; đột biến 28/28 bị bắt;
  `npm test` 39 · 0; `--day-du` 41 · 0; cổng `chay` + `tinh` (dòng dưới).
- **ĐÃ RÀ K4**: 3 chỗ respondWith trong sw.js đều sau `if (!luat) return`; mọi đường lưu vỏ (install, trang, kiemBan) qua luuVo; 3 bảng nổi trong src/ đều `.sheet.show` / role="dialog".
- **CHƯA KIỂM**: Safari / iPhone (âm thanh màn mở qua SW — Câu hỏi 2; PWA chạy nền quay lại), trình duyệt Zalo, Cloudflare Pages thật (đọc `_headers`, `/index.html` → `/`),
  kho đầy / riêng tư trên máy thật. Chủ quán thử tay theo `huong_dan_kiem_tay.md`.
- **GIT**: nhánh `viec/KH-PWA-1`, push `git push -u origin viec/KH-PWA-1`; không PR, không merge.
- **BÀI HỌC**: dưới.
- Nghiệm thu đếm: A1 (thu_KHPWA1 "A1 main.jsx…", "A1 chỉ đăng ký khi PROD…", "A1 không có import.meta.env…") · A2 (chienLuoc + sự kiện fetch + 6 ca vm (a)–(f) + Chromium mất mạng / mạng chậm / bản mới về nền) ·
  A3 (tqd-v1, activate (g), Chromium "2 bản gần nhất") · A4 (regex + Chromium có SW điều khiển) · A5 (_headers) · B1 (Chromium moi1) · B2 (denLucKiem, doiBan, Chromium ẩn 10 / 31 phút, mất mạng) ·
  B3 (coTheTaiLai + /tracnghiem/lam + hộp thoại + Chromium /thanhtoan) · B4 (Chromium vẫn /menu, không chữ) · C1 (bài này) · C2 (dòng dưới) · C3 (huong_dan_kiem_tay.md 6 dòng). 12/12.

## Bài học
1. **Lưu vỏ HTML trước khi có tệp nó trỏ tới → trắng màn khi mất mạng** (ra-soat 1 bắt). Ngăn **KHOÁ** — đã làm trong Phạm vi: ca vm (a)(b)(f) + ca Chromium "bản mới về nền → mất mạng".
   Đề xuất ngoài Phạm vi: mục KHUON_LOI.md mới "K? — Bộ nhớ đệm lưu vỏ trước phần thân: Đã gây KH-PWA-1 (vòng 1, trắng màn); Dấu hiệu: put('/') trước khi các tệp vỏ trỏ tới có trong kho; Chặn: thu_KHPWA1 ca (a)".
2. **Ca marker (khớp hằng số / đếm tên hàm) để đột biến sống** (VS-SW-ASSETS-LUU-HTML sống khi thêm một `laHtml(`; 2 đột biến của người soát vòng 2). **NGUYÊN TẮC** — đề xuất ngoài Phạm vi:
   KHUON_LOI.md "ca hành vi cho TỪNG nhánh rẽ; marker không tính là bằng chứng hành vi" (gộp vào K3 hiện có, không mở mục mới — giữ ≤ 120 dòng).
3. **Đột biến "KHÔNG ÁP ĐƯỢC" bị tính SỐNG** (VS-DK-DANG-KY-CA-DEV, do sửa khoảng trắng ở vòng 2): dot_bien.py đã báo đúng — **BỎ** (công cụ đã bắt, chỉ một lần).
4. **Chạy dot_bien.py song song với `npm test`** → npm test đỏ giả (dot_bien sửa tệp tạm thời). **BỎ** — một lần; nhớ: dot_bien sửa tệp trong kho, không chạy song song.
5. **Người gác chặn** (B-MANOI chạy bài chưa commit, SED-I, B-DICHCHU biến `$S`, B-PHANTICH `( … )` và lệnh script không đứng một mình): đều đúng luật đã ghi trong skill — **BỎ**.
6. **SỐ CA thiếu `cong_cu/`** (cổng A16 đỏ lần đầu): cổng đã bắt — **BỎ** (đề xuất nhỏ: skill bước 4 ghi rõ dạng `SỐ CA cong_cu/<bài>.js: N`).
