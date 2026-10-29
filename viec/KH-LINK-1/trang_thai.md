# KH-LINK-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-LINK-1`; HEAD = FETCH_HEAD = `600bb32` (không cần kéo). Ba dòng log lúc mở phiên:
```
600bb32 PHIEU: KH-LINK-1
8587b7d TIEN-DO: KH-XEM-1 xong (1c47df4); duong dan that, khoa tien ich, /admin (luat); luu tra loi POS 29.10; mo KH-LINK-1 - so v4
1c47df4 Merge pull request #2 from tuquyduong/viec/KH-XEM-1
```
Ghi chú phiên: máy mây khởi động lại giữa chừng (một lần) — bước đang làm lúc đó: viết bài thử `thu_KHLINK1.js`; việc làm lại từ đó, không đổi kết quả.

## Câu hỏi
(không)

## Phát hiện (ngoài phạm vi / chưa làm)
- Lịch sử sau đăng xuất: Back về `/taikhoan` thì bị chuyển `/dangnhap?tiep=/taikhoan` — đúng luật khoá, chỉ ghi nhận.
- `viTriCuonKhiDoiMan` còn tham số `coManCon` luôn `false` (bài cũ thu_KHUI2 khoá chữ ký hàm) — dọn khi có phiếu sửa bài cũ.
- `?ma=` có mặt (kể cả mã hỏng) → luôn đi Ưu đãi (cũ: chỉ xoá khỏi thanh địa chỉ). Phiếu A3 nói "chạy trên MỌI đường dẫn" nên giữ; nếu chủ quán muốn mã hỏng thì ở nguyên trang → báo.
- Hai nhóm menu trùng slug (vd "Trà"/"Tra") sẽ chọn nhầm — POS hiện không có; slug món đổi khi thêm món trùng tên sau này (link đã chia sẻ có thể đổi) — đúng như phiếu "trùng tên thì thêm -<mã>".
- Chưa có ô Trắc nghiệm / Kế hoạch để bọc `KhoaTienIch` (KH-UI-5a / 5b dùng); thành phần đã có + bài thử.

## Bảng nghiệm thu (đếm từng mục)
| Mục | Bằng chứng |
|---|---|
| A1 bộ định tuyến, bảng hai chiều, slug, hoa / `/` thừa | `src/duongDan.js`; `thu_KHLINK1.js` mục A1 (slug 3 ca, 15 dòng đi, 15 dòng về, quay vòng, hoa, `/` thừa, `#`/`?`) |
| A1b `/mon/<ten-mon>` có / không menu / ngừng bán | `thu_KHLINK1.js` mục A1b (8 ca) + `src/pages/MonTheoDuong.jsx`; trình duyệt: mở thẳng ra đúng món, món lạ → "Không tìm thấy món" + "Xem Menu", khách chưa có menu → "Đăng nhập để xem menu và giá" |
| A1c màn mở với mọi đường dẫn | `ManDau.jsx` không đọc địa chỉ (grep `location\|history` rỗng) → hiện ở lần mở đầu mỗi phiên rồi vào đúng trang của link; trình duyệt chạy với cờ đã xem (bỏ qua màn mở) nên phần hiển thị màn mở CHƯA thử tay |
| A2 pushState / popstate, tiêu đề tab | `src/dieuHuong.js`; `thu_KHLINK1.js` (A2 tiêu đề, nối vào App); trình duyệt: tiêu đề "Trang chủ / Menu / <Tên món> · Tứ Quý Đường" |
| A3 mở thẳng, `?tiep=`, tiep nội bộ, `?ma=` | `thu_KHLINK1.js` mục A3 (13 ca tiep lạ, K5 hội viên không bị chặn); trình duyệt: khách `/uudai` → `/dangnhap?tiep=%2Fuudai`; hội viên `/dangnhap?tiep=%2Fuudai` → `/uudai`; `/admin` → `/trangchu` |
| A4 không 404.html; ảnh / âm thanh / manifest tuyệt đối | `thu_KHLINK1.js` 2 ca cuối; `vite preview` trả `index.html` cho `/menu`, `/mon/...` (trình duyệt mở thẳng đúng) |
| A5 hành vi cũ | `thu_KHUI2.js` 78 · `thu_KHXEM1.js` 61 xanh; trình duyệt: Back / Tiến, tải lại giữa chừng, mở thẳng rồi Quay lại → trang cha (không thoát app), bấm tab Menu ở `/menu/<nhom>` giữ nhóm |
| B1 Trang chủ khách đầy đủ | không đổi `TrangChu.jsx` (đã đủ từ KH-XEM-1); ảnh `so_anh/trangchu_khach_{360,390,430}.png` |
| B2 KhoaTienIch | `src/components/KhoaTienIch.jsx`; `thu_KHLINK1.js` mục B2 (7 ca, render thật esbuild + react-dom/server: đã đăng nhập = đúng ô; khách = mờ, `inert=""`, 🔒, dòng "Đăng nhập để mở khoá chức năng", role=button) |
| C1 `thu_KHLINK1.js` | 97 ca xanh |
| C2 chạy trình duyệt 390 / 360 / 430 | Playwright (nháp, API giả): 60 đạt · 0 hỏng (20 ca × 3 cỡ); ảnh trong `so_anh/` + `doi_chieu_demo.md` |
| C3 `npm test`, `--day-du`, cổng `chay` | `npm test` 18 đạt; `--day-du` 20 đạt · 0 hỏng (K8, K9); cổng chạy: xem dòng cuối |
| C4 chủ quán thử tay | xem dưới |

## Chủ quán thử tay (sau khi gộp, trên tuquyduong.com hoặc app-kh.pages.dev)
1. Điện thoại: mở thẳng `tuquyduong.com/menu` (gõ vào thanh địa chỉ) → ra Menu, không lỗi trang trắng (A4 — Cloudflare Pages tự trả `index.html`).
2. Bấm lần lượt Trang chủ → Menu → chọn một món → thanh địa chỉ đổi `/trangchu` → `/menu` → `/mon/<tên-món>`; bấm Back → về `/menu` đúng vị trí cuộn.
3. Cửa sổ ẩn danh mở `tuquyduong.com/uudai` → hiện Đăng nhập (địa chỉ `/dangnhap?tiep=%2Fuudai`) → đăng nhập xong vào Ưu đãi.

## Báo cáo soát độc lập (agent) — chép nguyên
KHÔNG ĐẠT (vòng 1). Lỗi: (1) `KhoaTienIch.jsx:10` `inert=""` không có tác dụng ở React 19 → ĐÃ SỬA `inert={true}` (commit "sửa inert"); (2) `thu_KHLINK1.js` ca khoá dùng "inert hoặc aria-hidden" → ĐÃ SỬA kiểm riêng `inert=""` trên HTML render; (3) thiếu `trang_thai.md` → file này; (4) thiếu ảnh 360 / 430 → ĐÃ CHỤP; (5) bấm tab Menu ở `/menu/<nhom>` mất nhóm + đẩy lịch sử → ĐÃ SỬA (`vaoTab` không đổi địa chỉ khi đã ở Menu) + 1 ca thử. NGHI NGỜ đã xử lý: ghi ở mục Phát hiện. Không phát hiện: vòng lặp chuyển hướng, open redirect, lộ dữ liệu khách khác. CHƯA SOÁT: hành vi trình duyệt (phiên chính đã chạy Playwright, kết quả ở bảng trên), `cong.js` (đã chạy: ĐẠT).
BÀI HỌC (của agent): bài thử "đọc nguồn" bằng regex dễ xanh giả — tránh "A hoặc B"; thuộc tính boolean DOM ở React 19 viết `inert={true}`; bằng chứng đỏ kiểu "module không tồn tại" chỉ là đỏ tầm thường.

Vòng sửa: 1/3. Đột biến `dot_bien.py`: việc này đổi `src/` (giao diện, không tiền) — cổng `chay` (A17/A18) đã ĐẠT, không đòi thêm.

## Báo cáo 7 mục
- **VIỆC**: KH-LINK-1 — đường dẫn thật cho từng trang, Trang chủ khách đầy đủ (đã có), khoá tiện ích.
- **ĐÃ SỬA**: mới `src/duongDan.js` (bảng + slug + tiếp), `components/KhoaTienIch.jsx`, `pages/KhongTimThay.jsx`, `pages/MonTheoDuong.jsx`, `cong_cu/thu_KHLINK1.js`; sửa `src/dieuHuong.js` (thay ngăn xếp bằng `dungDuongDan`), `src/App.jsx`, `src/luongDangNhap.js` (đọc bảng), `src/pages/Menu.jsx` (nhóm theo đường dẫn), `src/giaoDien/giaoDien.css`, `cong_cu/thu_KHXEM1.js` (chỉ chỗ khớp chữ).
- **BÀI THỬ**: `thu_KHLINK1.js` 97 · `thu_KHXEM1.js` 61 · `thu_KHUI2.js` 78 · `thu_KHUNG.js` 9 — xanh; Playwright 60/60 ở 390/360/430. Đỏ trên gốc: module `duongDan.js` chưa có (`bang_chung_do.txt`).
- **ĐÃ RÀ K4**: `grep` `dungNganXep|datTab|nx\.|moManCon|veDau` trong `src/` và `cong_cu/` — không còn; mọi đường dẫn ảnh / âm thanh đã tuyệt đối (bài thử A4).
- **CHƯA KIỂM**: màn mở "Mái đình" với link chia sẻ trên máy thật (trình duyệt thử bỏ qua màn mở); trình duyệt Zalo; Cloudflare Pages thật (chỉ thử bằng `vite preview`); ảnh so với demo chỉ cho khối mới (khối cũ không đổi).
- **GIT**: nhánh `viec/KH-LINK-1`, commit từng file, đã push; không PR, không merge.
- **BÀI HỌC**: (1) KHOÁ — bài "đọc nguồn" phải kiểm chuỗi chỉ có ở code mới, không dùng "A hoặc B"; đã làm cho ca `inert`. (2) NGUYÊN TẮC (đề xuất cho `KHUON_LOI.md`, ngoài Phạm vi): thuộc tính boolean của DOM ở React 19 (`inert`) phải là `{true}`; chuỗi rỗng bị coi là `false` — bài thử render thật (esbuild + react-dom/server) bắt được loại này, nên ưu tiên hơn regex. (3) BỎ — máy mây khởi động lại / người gác chặn lệnh ghép: chỉ một lần.

## Bài học
KHOÁ: ca `inert=""` trên HTML render (đã làm trong `thu_KHLINK1.js`). NGUYÊN TẮC: đề xuất mục K10 "thuộc tính boolean React 19" — chờ chat soát duyệt. BỎ: sự cố môi trường một lần.

Cổng `node tu_chay/cong.js chay . 600bb32^ HEAD viec/KH-LINK-1` (chạy ở HEAD 8358367, cây sạch):
✓ CỔNG CHẠY ĐẠT

HEAD ĐÃ KIỂM: 8358367
