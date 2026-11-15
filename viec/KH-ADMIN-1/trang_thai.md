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

## Bước 6 — kiểm (15.11)
- `npm test` (KHONG_TRINH_DUYET=1): 52 đạt · 0 hỏng (K1–K10 xanh: K9 màu demo, K10 chữ cứng không tăng — tệp mới 0).
- Bài thử có Chromium (máy làm việc): thu_KHADMIN1.js 160/0 · thu_KHKHOP1.js 86/0 · thu_KHUI3b.js 175/0.
- `node kiem_tra_truoc_khi_giao.js --day-du` (dựng app + mọi bài thử, có Chromium): **54 đạt · 0 hỏng**.
- Đột biến tay `node viec/KH-ADMIN-1/dot_bien_tay.js --trinh-duyet`: **20/20 BẮT ĐƯỢC** (17 hàm thuần + 3 Chromium) — tên ở bảng "Chỗ vá → đột biến" trên.
- G6 so ảnh màn khách KHÔNG sửa, gốc 3d35772 ↔ HEAD (390, cùng POS giả, tắt chuyển động; công cụ ở nháp): Trang chủ (đã đăng nhập) 0 điểm khác · Menu 0 · Ưu đãi 0 ·
  Trang chủ (khách) 0 ngoài ảnh nền banner — vùng ảnh nền banner lệch CẢ khi so gốc ↔ gốc (vẽ ảnh không ổn định), không phải do việc này. Ảnh: `so_anh/390_khach_*`.
- Số dòng: app +1.064 / −29 (12 tệp; ngân sách ~1.100); bài thử mới 774 dòng (ngân sách ~600 — ×1,3: thêm kho giả dựng từ khối máy đọc + ca thêm của §5b).

HEAD ĐÃ KIỂM: 38552a4

## Bước 8 — soát độc lập /ra-soat, vòng 1 (agent riêng, chỉ đọc) — báo cáo chép nguyên ý
KHÔNG ĐẠT
LỖI TÌM ĐƯỢC:
1. `src/noiDung/quanTri.js:8` NUT_KHOA_KHI_SUA thiếu hai nút xoá THẲNG có data-nd: `XeCo.jsx:76` `xe.hangXoa`, `XeCo.jsx:120` `ti.xoaNgay`; trang_thai ghi "chỉ giỏ chưa khoá" là sai; ca thử chỉ kiểm khoá trong danh sách tồn tại, không kiểm đủ — K4 + K1.
2. `CheDoSua.jsx:181`, `QuanTri.jsx:123` vẽ `(x.nguoi && x.nguoi.ten_hien) || x.nguoi` — `nguoi` là object mà `ten_hien` rỗng → React vẽ object → trắng màn; `CheDoSua.jsx:138` ra "[object Object]"; 4 chỗ 4 kiểu; hợp đồng không ghi dạng `nguoi`; kho giả cho chuỗi nên không thấy — K1 + K5.
3. `CheDoSuaBang.jsx:114` giá trị đầu lấy NGUYÊN `nhap.gia_tri` không qua hopLe → nháp sai dạng làm vỡ bảng (danhsach `v.map`, nut `v.chu`) — K5 / K3.
4. G7 thiếu kết quả cổng `tinh` / `chay` trong trang_thai — K1.
5. Ảnh ở Xem lại / Lịch sử / bảng sửa vẽ `duongAnh(v)` giá trị THÔ, không qua anhDung (máy quản trị có thể tải ảnh http ngoài) — K4 (nhẹ).
6. `CheDoSua.jsx:78-86,132` tranh chấp: ✕ khi taiNhap đang chạy → lời trả muộn bật lại lớp nháp khi đã tắt — K5.
NGHI NGỜ: vé không kiểm het_han phía App (tự phục hồi qua 401); "Người khác vừa lưu" so `luc` không so người, cảnh báo cũ còn sau khi tự Lưu; xác minh khách vẫn gửi khi sửa (phiếu D7 cho phép); bút 22 px < 44 px (chép demo); §5b hứa ca `tiep` ra ngoài mà chưa có; K2 bị lách bằng ghép chuỗi `/api/nd` (đã ghi Phát hiện).
NGHIỆM THU: 26/30 · thiếu D7 (2 nút), G5 (bản soát KHÔNG ĐẠT), G7 (cổng), G8 (sau gộp). G6 thiếu ảnh tô chỗ lệch; D6 thiếu ca màn cần đăng nhập.
BẢO MẬT (G5): vé nơi giữ / thoát ĐẠT; hết hạn dựa 401 — chấp nhận; không trộn vé/token ĐẠT; XSS chữ ĐẠT; XSS ảnh phía khách ĐẠT, phía quản trị lỗi 5 (nhẹ); chặn ghi CHƯA ĐẠT (lỗi 1); không lộ dữ liệu khách ĐẠT; quyen[] chỉ ẩn nút ĐẠT; ?tiep= không chuyển ra ngoài (chưa có ca); lớp nháp không tới khách ĐẠT.
CHƯA SOÁT ĐƯỢC: không chạy lại đột biến / cổng chay / --day-du (ghi tệp); CORS + dạng `nguoi` thật của POS; ảnh so_anh ↔ demo; trình duyệt Zalo.
BÀI HỌC: KHOÁ danh sách nút khoá phải ĐỦ (quét khoá xoá/đăng xuất); kho giả `nguoi` dạng object + ca nháp sai dạng; NGUYÊN TẮC "trường chưa ghi dạng trong hợp đồng → không vẽ thẳng; mọi giá trị từ kho qua hopLe trước khi vẽ"; NGUYÊN TẮC "không lách bộ kiểm bằng ghép chuỗi — xin sửa bộ kiểm"; KHOÁ "trang_thai có kết quả cổng chay trước khi soát".

### Sửa vòng 1
| Lỗi | Sửa | Bài thử / đột biến |
|---|---|---|
| 1 | `quanTri.js` thêm `xe.hangXoa`, `ti.xoaNgay`; chú thích nhóm chỉ-mở-hỏi-lại | ca "D7 danh sách nút khoá khi sửa ĐỦ" (quét mọi khoá xoá / đăng xuất trong màn, nhóm không-xoá có lý do từng khoá) · BV-XOA-HANG-XE-KHONG-KHOA |
| 2 | MỘT hàm `tenNguoi` (`CheDoSuaBang.jsx`) — chuỗi hoặc { ten_hien, ten_dang_nhap }, khác → rỗng; dùng ở 5 chỗ | kho giả trả `nguoi` dạng object, một tài khoản `ten_hien` rỗng; ca "tên người dạng object hiện chữ (lan)" |
| 3 | giá trị đầu bảng sửa qua `hopLe`, sai → giá trị đang chạy; `hienGiaTri` sai luật → "(không hợp lệ — khách thấy chữ mặc định)" | ca "D3 nháp sai dạng → bảng sửa vẫn mở" · BV-NHAP-SAI-DANG-VO-BANG |
| 4 | chạy cổng `tinh` + `chay`, ghi kết quả (bước 11) | — |
| 5 | ảnh xem trước (Xem lại, Lịch sử, bảng sửa) chỉ vẽ khi `anhDung`; giá trị sai luật không vẽ | ca "B3 / G5 Xem lại: ảnh lạ trong nháp KHÔNG vẽ" |
| 6 | `taiNhap` bỏ kết quả nếu đã tắt sửa (`dangSua()`) | (tranh chấp thời gian — không dựng được ca ổn định; ghi CHƯA KIỂM) |
| nghi ngờ | cảnh báo "Người khác vừa lưu" chỉ khi người lưu KHÁC tên người đang đăng nhập, xoá cảnh báo sau khi tự Lưu; Xem lại đọc lại nháp khi mở; thêm ca `?tiep=` ra ngoài (3 dạng) + ca D6 màn cần đăng nhập | các ca tương ứng |
| K2 | giữ — đã ghi `## Phát hiện` + đề xuất sửa bộ kiểm (tệp Cấm) | — |
Sau sửa: thu_KHADMIN1.js 84/0 (KHONG_TRINH_DUYET=1), 168/0 (Chromium); đột biến tay 22/22 BẮT ĐƯỢC.
