# KH-PWA-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-PWA-1`, cây sạch. HEAD `47fce03` · FETCH_HEAD `47fce03` (bằng nhau → không kéo).
```
47fce03 PHIEU: KH-PWA-1
2fe3e97 TIEN-DO: mo KH-THU-1 (rut thoi gian bai thu, bao qua gio) + KH-PWA-1 (mo nhanh, tu len ban moi lang le) chay song song KH-UI-5c
4abbd0a TIEN-DO: mo KH-UI-5c (bam ngay -> bang viec cua ngay, viec lap, nhac truoc, qua han, hoan tac); quyet dinh 08.11 (the hang chung gio, hang co truoc, tich diem theo mon); them KH-THE-1 cho POS; thu App 07.11 + POS 08.11
```

## Quyết định trong phạm vi phiếu
- **B2 hỏi index.html qua service worker**: bộ kiểm K1 (`kiem_tra_truoc_khi_giao.js:35-36`) cấm `fetch(` trong `src/` ngoài `src/api.js`, mà `api.js` CẤM sửa →
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

## Câu hỏi
1. **Bài cũ `cong_cu/thu_KHUI2.js:119` chặn đúng việc phiếu này giao.** Ca `k('E2 không service worker', !/serviceWorker/.test(main.jsx + App.jsx + index.html) && !fs.existsSync('public/sw.js'))`
   (luật của KH-UI-2 hồi trước) nay ĐỎ vì KH-PWA-1 A1 bắt buộc có `public/sw.js` và đăng ký service worker. File này ngoài `## Phạm vi`, và `## Cấm` không cho sửa
   bài thử khác → máy KHÔNG sửa. Xin chủ quán (chat soát) sửa phiếu:
   - thêm `cong_cu/thu_KHUI2.js` vào `## Phạm vi`;
   - thêm mục `## Bài thử cũ sửa`: "thu_KHUI2.js ca E2 — đổi thành: service worker CHỈ đăng ký qua `src/dangKySW.js` (main.jsx / App.jsx / index.html không gọi `serviceWorker` trực tiếp)".
     Ca sửa này XANH trên code gốc 47fce03 (gốc không có serviceWorker nào) → cần `## Bài thử cũ sửa` (A11); bài mới `thu_KHPWA1.js` đã đỏ trên gốc (2 đạt · 7 hỏng) nên
     A12 không cần thêm. Đề xuất nội dung ca mới (≈ 1 dòng): `!/serviceWorker/.test(main.jsx + App.jsx + index.html) && /navigator\.serviceWorker\.register\('\/sw\.js'/.test(src/dangKySW.js)`.
   Mọi thứ khác đã xong và xanh; sau khi phiếu được sửa, máy làm tiếp: sửa ca E2, `--day-du`, cổng `chay`, `/ra-soat`, báo cáo 7 mục.

## Phát hiện
- `/tracnghiem/lam` (đang làm trắc nghiệm): câu trả lời dở chỉ nằm trong state (`src/pages/TracNghiemLam.jsx` — "bài chưa làm xong không được lưu"). Phiếu B3 xếp màn này
  "an toàn" → khách bỏ App chạy nền ≥ 30 phút giữa bài, có bản mới, quay lại sẽ mất bài dở. Máy làm ĐÚNG phiếu; nếu chủ quán muốn giữ bài dở thì thêm `/tracnghiem/lam` vào danh sách
  không an toàn (một chữ trong `KHONG_AN_TOAN` của `src/dangKySW.js`).
- Agent soát kế hoạch (bước 3) nêu 7 điểm; đã làm: vỏ chỉ lưu text/html, /assets không lưu HTML, phản hồi chuyển hướng không lưu, mạng về muộn vẫn lưu đè vỏ (`waitUntil`),
  chống tải lại liên tục (sessionStorage), `.sheet.show`, chỉ tải lại khi trang hiện, install `cache: 'reload'`.

Ghi 08.11: dừng ở Câu hỏi 1 (bước 6 — `npm test` đỏ do bài cũ ngoài phạm vi).
