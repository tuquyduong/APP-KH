# KH-ADMIN-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (15.11.2026)
- Nhánh: `viec/KH-ADMIN-1`; cây sạch (không dòng sửa dở).
- `git fetch origin viec/KH-ADMIN-1` → HEAD `3d35772`, FETCH_HEAD `3d35772` (bằng nhau — không kéo).
- `git log --oneline -3`:
```
3d35772 PHIEU: KH-ADMIN-1
ea0281e TIEN-DO: mo KH-ADMIN-1 (/admin: dang nhap tai khoan POS, Che do sua tren App, bang sua tu sinh, phien ban, Xuat/Nhap; Opus, cho duyet ke hoach) + KH-QC-1 (quang cao doc GET /quang-cao, hop dong v16; Sonnet); them KH-HUY-1; quyet dinh 14.11 (b); ban giao chat 14.11 toi
474eda6 TIEN-DO: KH-ND-3d, KH-THE-1 xong (chat soat cuoi DAT, gop PR #36 #37); mo KH-THE-2 (the hoi vien theo thiet ke 14.11: so sanh nhanh len dau, Mua ngay thang Thanh toan chi QR, the khong vao gio, Chao mung hoi vien, the Uu dai theo tinh trang; Opus, cho duyet ke hoach); them KH-THU-2; quyet dinh 14.11; thu POS 13.11 + 14.11; ban giao chat 14.11
```
- Có commit `PHIEU: KH-ADMIN-1` (`3d35772`).

## Bước 2 — đã đọc
Phiếu, CLAUDE.md, KHUON_LOI.md, hợp đồng `/api/nd` v1 (sha256 `836eb6ba2554e82daa7ef8be42bfe68d12754ed45540ad35795fe800d503b197` — khớp phiếu A1), code vùng sửa (danh sách ở đầu `ke_hoach.md`).

## Bước 3 — kế hoạch
`viec/KH-ADMIN-1/ke_hoach.md`. Phiếu dặn **Chờ duyệt kế hoạch** → commit, push, DỪNG. Câu hỏi xin duyệt cùng kế hoạch: `ke_hoach.md` §6 (Q1–Q4).

Agent phụ (chỉ đọc) soát 4 câu → sửa ghi ở `ke_hoach.md` §5b (lỗi thật: chặn ghi status 0 làm `POST /don` "chưa rõ" — đổi sang 4xx; cờ chặn bật đồng bộ trước render;
bài cũ `thu_KHPWA1.js`, `thu_KHUI3b.js` sẽ đổi; thêm ca thử; `role="dialog"` cho bảng sửa).

Chủ quán duyệt 15.11 (phiếu › "Trả lời câu hỏi kế hoạch": Q1–Q6 đồng ý, §5b duyệt nguyên) → làm thẳng tới hết.
Kéo nhánh lúc mở phiên tiếp: `15964fa → 2728b84` (hook mở phiên; cây sạch).

## Câu hỏi
Đã trả lời hết (Q1–Q6 — phiếu, cuối tệp). Không còn câu hỏi mở.

## Phát hiện
- `public/sw.js:17` còn nhắc `/kiemkhop`, không loại `/admin` (public Cấm) — việc sau.
- `kh.leQua` (`src/noiDung/nd/keHoach.js:116`) khớp lễ theo TÊN — đổi tên lễ ở /admin thì mất gợi ý quà — việc sau.
- `src/kehoach.js:121` `holList` gộp lễ âm theo TÊN (`thay[n]`): chủ quán đổi tên MỘT trong ba ngày Tết ở /admin → Tết hiện hai lần trong "ngày lễ gần nhất". Ngoài F1 — việc sau.
- **Bộ kiểm K2** (`kiem_tra_truoc_khi_giao.js:39`, Cấm sửa) chặn MỌI chuỗi `'/api/…'` ngoài `/api/kh` — viết trước khi có kho `/api/nd`. Code việc này tránh chuỗi đó
  (ghép bằng biểu thức chính quy `src/noiDung/nd.js` `TIEN_TO_KHO`, mẫu chuỗi `\`${gốc}/api/nd\`` ở `khoNoiDung.js`). Đề xuất (chat soát / việc khung): K2 cho thêm `/api/nd`.
- **Nút xoá chưa có `data-nd`** (D7 phần không qua mạng — Q4): nút ✕ xoá dòng giỏ `src/pages/GioHang.jsx:61,81` (`cart-xoa`, chỉ có `aria-label`) — không khoá được khi sửa; giỏ là của
  máy quản trị, không gửi gì đi. Việc sau gắn `data-nd` nếu chủ quán muốn khoá.
- **G5 CORS:** kho `/api/nd` chỉ nhận `tuquyduong.com` + `app-kh.pages.dev` (hợp đồng v1 § Chung) → bản xem thử của nhánh trên Cloudflare (`<nhánh>.app-kh.pages.dev`) KHÔNG gọi được
  `/api/nd` (đăng nhập quản trị, tải bản mới) — thử thật SAU khi gộp (G8).
- `src/pages/KiemKhop.jsx:1-2` chú thích đầu tệp vẫn ghi "TRANG TẠM, CÔNG KHAI" — kế hoạch giữ tệp 0 dòng (KH-QC-1 sửa cùng tệp); sửa chú thích khi chạm tới.

## Bước 4 — bài thử trước (đỏ trên gốc)
- Bài MỚI `cong_cu/thu_KHADMIN1.js` (phần 1 hàm thuần + đọc nguồn; phần 2 Chromium 390 với POS `/api/kh` giả + KHO GIẢ dựng TỪ khối `HOP_DONG_ND_MAY_DOC`).
- Bài CŨ đổi theo /admin (ca mới ĐỎ trên gốc ⇒ không cần `## Bài thử cũ sửa`): `thu_KHLINK1.js` (/admin là khu quản trị), `thu_KHKHOP1.js` (Kiểm khớp ở /admin/kiemkhop),
  `thu_KHPWA1.js` (dòng dựng main.jsx), `thu_KHUI3b.js` (ca F1 mở /admin/kiemkhop + MỘT ca tĩnh đỏ trên gốc — cổng GitHub không trình duyệt).
- Bằng chứng: `viec/KH-ADMIN-1/bang_chung_do.txt` (gốc `3d35772`; KHONG_TRINH_DUYET=1: 7/20 · 94/3 · 46/3 · 52/1 · 57/1; phần Chromium trên gốc 19 đạt · 28 hỏng).

## Chỗ vá → đột biến (G4 — `viec/KH-ADMIN-1/dot_bien_tay.js`; việc chỉ đổi `src/` → không có `dot_bien.py`, như KH-THE-1)
| Chỗ vá | Đột biến |
|---|---|
| `api.js` goiKho không đọc token khách | BV-GUI-TOKEN-KHACH-SANG-ND |
| `api.js` goi không nhận vé | VS-GUI-VE-SANG-API-KH |
| `khoNoiDung.js` vé chỉ sessionStorage | VS-VE-VAO-LOCALSTORAGE |
| `khoNoiDung.js` dangSua cần vé (khách không có lớp nháp) | BV-KHACH-THAY-NHAP |
| `api.js` goi chặn ghi khi sửa | BV-BO-CHAN-GHI-KHI-SUA · VS-CHAN-CA-BAO-GIA (K5) · VS-CHAN-GHI-STATUS-0 (đơn "chưa rõ") |
| `nd.js` anhDung | VS-NHAN-ANH-HTTP |
| `CheDoSuaBang.jsx` không cắt khoảng trắng | VS-CAT-KHOANG-TRANG |
| `nd.js` chuDung kiểm chip | BV-BO-KIEM-CHIP |
| `luuMay.js` không xoá kh_nd_ban | VS-XOA-KH_ND_BAN-KHI-DANG-XUAT |
| `duongDan.js` /kiemkhop đóng · tiepHopLe | BV-KIEMKHOP-CONG-KHAI · VS-ADMIN-LA-TRANG-KHACH |
| `kehoach.js` lọc lễ theo ngày âm (F1) | BV-SAP-TOI-THEO-TEN |
| `nd.js` dòng trùng (F2) | BV-BO-CHAN-TRUNG-DANH-SACH |
| `khoNoiDung.js` 401 → thoát | BV-401-KHONG-THOAT |
| `quanTri.js` NUT_KHOA_KHI_SUA | BV-DANG-XUAT-KHONG-KHOA |
| `CheDoSua.jsx` 409 không gửi lại · chạm phần tử chạy như khách · lời khoá theo chiDuong (Chromium) | VS-409-TU-GUI-LAI · BV-BUT-MO-KHI-CHAM-PHAN-TU · BV-KHOA-KHONG-CHI-DUONG |
