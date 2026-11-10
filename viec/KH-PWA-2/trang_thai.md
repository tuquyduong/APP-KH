# KH-PWA-2 — trạng thái

## Đồng bộ (bước 1)
- Nhánh `viec/KH-PWA-2`; HEAD = FETCH_HEAD = `c7e0116`.
- Log: `c7e0116 PHIEU: KH-PWA-2` · `a63c067 TIEN-DO: mo KH-PWA-2 (sw: bo luu nhac iPhone, may chu loi -> vo da luu, chi luu dung trang App)` · `af7f1cb Merge pull request #27 from tuquyduong/viec/KH-UI-5d`
- Bước 4 / hook môi trường không đòi đổi tác giả, amend hay rebase.

## Bảng chỗ vá → đột biến (dot_bien.py, 12/12 bị bài thử bắt)
| Chỗ vá (public/sw.js) | Đột biến |
|---|---|
| A1 `TINH` bỏ `am_thanh` | BV-SW-AMTHANH-QUA-SW · VS-SW-AMTHANH-LUU-TRUOC |
| A4 `KHO = 'tqd-v2'` | BV-SW-KHO-V1 |
| A2 `trangHong` 5xx | BV-SW-TRANG-5XX · VS-SW-TRANG-CHI-503 |
| A2 `trangHong` 404 | BV-SW-TRANG-404 |
| A2 `trangHong` không phải HTML | BV-SW-TRANG-KHONG-PHAI-HTML |
| A2 chuyển hướng không bị thay bằng vỏ | VS-SW-TRANG-CHUYEN-HUONG |
| A2 `chon` dùng vỏ lưu | BV-SW-TRANG-KHONG-CHON · VS-SW-TRANG-HONG-CHI-DUNG-VO-KHI-MAT-MANG |
| A3 `luuVo` bỏ trang lạ | BV-SW-TRANG-LA-VAN-LUU · VS-SW-TRANG-LA-CHI-KIEM-RONG |

## Nghiệm thu (mỗi mục một dòng bằng chứng)
- A1: ca "KH-PWA-2 A1 /am_thanh/* → null" + sự kiện fetch /am_thanh không respondWith; activate xoá `tqd-v1` (kèm nhạc đã lưu) — ca "A3 activate xoá … tqd-v1". Đỏ trên gốc, xanh sau vá.
- A2: 5 ca (503, 500, 599, 404, không-HTML) → vỏ lưu; ca 5xx chưa có vỏ → nguyên phản hồi mạng; đối chứng 200 HTML và opaqueredirect không bị chặn oan.
- A3: ca HTML không có `/assets/index-*.js` giữ vỏ cũ; ca chưa có vỏ không lưu; đối chứng HTML đúng vẫn lưu.
- A4: ca "kho tqd-v2"; `install` vẫn gọi `layVo('reload')` (không đổi).
- A5: chú thích 2 dòng đầu `sw.js` ("SAU NÀY: … React.lazy / import động").
- A6: `thu_KHPWA1.js` 53 ca; gốc 41 đạt · 12 hỏng (kể cả KHONG_TRINH_DUYET=1); không bớt ca nào.
- A7: `npm test` 41 đạt · 0 hỏng; `--day-du` 43 đạt · 0 hỏng; cổng — xem cuối file.

## Báo cáo 7 mục
1. VIỆC: KH-PWA-2 — service worker bỏ lưu nhạc, 5xx/404 mở vỏ đã lưu, chỉ lưu đúng trang App.
2. ĐÃ SỬA: `public/sw.js` (+11/−4 dòng, trong ngân sách ~25), `cong_cu/thu_KHPWA1.js` (+~70 dòng), `viec/KH-PWA-2/*`.
3. BÀI THỬ: như trên; đột biến 12/12 bị bắt.
4. ĐÃ RÀ K4: `grep am_thanh` ở `src/` không đổi (không sửa `src/`); `tqd-v1` còn sót trong `thu_KHPWA1.js` đã đổi hết.
5. CHƯA KIỂM: phần Chromium của `thu_KHPWA1.js` (máy này chưa chạy riêng) và nhạc trên iPhone thật; kho `tqd-v1` cũ bị xoá khi `activate` bản mới (khách phải mở app một lần có mạng).
6. GIT: nhánh `viec/KH-PWA-2`, đã push; không merge, không PR.
7. BÀI HỌC: xem dưới.

## Bài học
- BỎ: người gác chặn chạy bài thử đang sửa tới khi commit (B-MANOI) và chặn `$BIẾN` / `&&` nối sau lệnh node (B-DICHCHU, B-PHANTICH) — chỉ một lần, đã có trong skill.
- BỎ: ca đối chứng A3 đầu tiên đỏ do sai bài thử (fetch giả trả HTML cho cả /assets), sửa ở `626b41b`.

## Cổng (KHONG_TRINH_DUYET=1)
- `npm test` 41 đạt · 0 hỏng; `--day-du` 43 đạt · 0 hỏng.
- `cong.js tinh`: chỉ còn A17/A19 trước khi ghi file này; sau đó xem dòng dưới.
- ✓ CỔNG CHẠY ĐẠT (lần đầu đỏ A16 vì chạy KHÔNG đặt KHONG_TRINH_DUYET=1 → đếm 72 ca; chạy lại đúng → đạt).

HEAD ĐÃ KIỂM: c6808ce
