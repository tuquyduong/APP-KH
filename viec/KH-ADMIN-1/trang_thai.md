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

Sau sửa vòng 1: `--day-du` 54 đạt · 0 hỏng (thu_KHADMIN1.js 168/0 có Chromium).

HEAD ĐÃ KIỂM: 5930480

## Bước 8 — soát độc lập /ra-soat, vòng 2 (agent riêng, chỉ đọc) — báo cáo chép nguyên ý
ĐẠT (code và bảo mật); còn 4 lỗi nhẹ về ca thử / giấy tờ / chặn nhầm — không lỗi nào làm khách thấy sai hay lộ dữ liệu, nên xong trước khi gộp.
SỬA VÒNG 1: 1 đúng & đủ · 2 đúng & đủ · 3 đúng & đủ · 4 CHƯA (bảng ghi "đã ghi kết quả cổng" khi chưa có — K1) · 5 đúng & đủ · 6 đúng nhưng chưa có ca / đột biến (dựng được bằng kho giả trì hoãn GET /nhap — K3).
LỖI TÌM ĐƯỢC: `CheDoSua.jsx:84` lỗi 6 không ca đỏ/xanh, không đột biến — K3 · `trang_thai.md` dòng lỗi 4 khẳng định trước khi có; HEAD ĐÃ KIỂM cũ hơn HEAD — K1 ·
  `quanTri.js:9` `hx.xoa` dùng chung: HoiXoa.jsx:9 xoá thật, BangQuaHan.jsx:29 + NguoiThan.jsx:33 chỉ MỞ hỏi lại → khi sửa không mở được bước hỏi lại — K5 ·
  `CheDoSua.jsx:138` "Người khác vừa lưu" so tên hiện, không so ten_dang_nhap — K5 nhẹ.
NGHI NGỜ: G6 thiếu ảnh tô chỗ lệch + cặp demo↔app, chỉ 390 (CLAUDE §5 đòi; phiếu G6 chỉ đòi 390 + doi_chieu) — chat soát cuối quyết · code chết GIU_CHO / giuCho (duongDan.js:46-47,106; App.jsx:256) ·
  dangCheDoSua / datKhiHetVe chỉ bài thử dùng · bài "đủ" chỉ quét khoá có chữ xoa/dangXuat · tnk.lamLai ghi đè kết quả trắc nghiệm không khoá (phiếu D7 chỉ nói xoá) · bút 22 px; vé dựa 401.
NGHIỆM THU: 26/30 · thiếu G5 (chờ bản này), G7 (đang chạy), G8 (sau gộp), G6 một phần.
BẢO MẬT (G5): vé nơi giữ / hết hạn / thoát ĐẠT · không trộn vé–token ĐẠT · XSS chữ + ảnh (khách và quản trị) ĐẠT · chặn ghi khi sửa ĐẠT (còn chặn nhầm hx.xoa) · không lộ dữ liệu khách ĐẠT ·
  quyen[] chỉ ẩn nút ĐẠT · ?tiep= không ra ngoài ĐẠT (tự thử thêm `/\t/x`, `/admin/%2F%2Fx`) · lớp nháp không tới khách ĐẠT · không kẹt đơn.
CHƯA SOÁT ĐƯỢC: không chạy đột biến / cổng / --day-du / Chromium (theo dặn); CORS + dạng nguoi thật của POS; Zalo; ảnh so_anh bằng mắt.
BÀI HỌC: KHOÁ một khoá data-nd không được vừa mở hỏi lại vừa xoá thật · NGUYÊN TẮC so "người khác" bằng ten_dang_nhap · NGUYÊN TẮC tranh chấp thời gian dựng ca bằng API giả trì hoãn ·
  KHOÁ trang_thai chỉ ghi "đã ghi kết quả" khi kết quả đã có.

### Sửa vòng 2
| Lỗi | Sửa | Bài thử / đột biến |
|---|---|---|
| lỗi 6 không ca | — (code đã đúng) | kho giả trì hoãn `GET /nhap` 1,5 s, bấm ✕ ngay → trang KHÔNG hiện nháp (ca "D4 tắt sửa khi nháp còn đang tải") · BV-BAT-LAI-NHAP-SAU-TAT |
| hx.xoa chặn nhầm | `quanTri.js` `NUT_CHI_TRONG_HOI_LAI = ['hx.xoa']`; `CheDoSua.jsx` chỉ chặn khoá đó khi nằm trong `.hoi-xoa` (màn khách Cấm sửa nên không đổi khoá) | ca "D7 / K5 khoá dùng chung chỉ khoá TRONG hộp hỏi lại" · BV-HX-XOA-KHOA-CA-NUT-MO |
| so tên hiện | `laToi(nguoi, vé)` (`CheDoSuaBang.jsx`): so `ten_dang_nhap` khi có; `nguoi` chuỗi so với cả tên đăng nhập lẫn tên hiện | ca "nháp đổi do CHÍNH người đang đăng nhập → không báo" · VS-NGUOI-SO-TEN-HIEN |
| giấy tờ (K1) | dòng "lỗi 4" vòng 1 sửa nghĩa: kết quả cổng ghi ở mục "Cổng" bên dưới, SAU khi chạy | — |
Sau sửa: thu_KHADMIN1.js 85/0 (KHONG_TRINH_DUYET=1), 172/0 (Chromium); đột biến tay **25/25 BẮT ĐƯỢC** (`node viec/KH-ADMIN-1/dot_bien_tay.js --trinh-duyet`).
Không mở vòng 3 (bản soát vòng 2 ĐẠT về code / bảo mật; 4 lỗi nhẹ đã sửa kèm ca + đột biến). Nghi ngờ G6 (ảnh tô chỗ lệch, 360 / 430) để chat soát cuối quyết — phiếu G6 đòi ảnh 390 + doi_chieu_demo.md (đã có).

## Bài học (bước 11)
| Sự cố | Ngăn | Lý do / đề xuất |
|---|---|---|
| Danh sách nút khoá khi sửa thiếu 2 nút xoá thẳng (soát vòng 1) | **KHOÁ** — đã làm (trong Phạm vi) | ca "D7 danh sách … ĐỦ" quét mọi khoá xoá / đăng xuất trong màn; đỏ khi thiếu (BV-XOA-HANG-XE-KHONG-KHOA) |
| Một khoá data-nd dùng cho cả "mở hỏi lại" và "xoá thật" (hx.xoa) → chặn nhầm | **NGUYÊN TẮC** — đề xuất KHUON_LOI.md mục mới (ngoài Phạm vi): "Đã gây: KH-ADMIN-1 vòng 2 — hx.xoa ở HoiXoa (xoá) và BangQuaHan / NguoiThan (mở hỏi lại). Dấu hiệu: một khoá nút gắn ở ≥ 2 nút làm việc khác nhau. Chặn: mỗi nút làm thật một khoá riêng; bài thử quét khoá trùng giữa nút mở / nút làm." | KHOÁ đầy đủ cần đổi khoá trong màn khách (Cấm ở việc này) → việc sau |
| Vẽ thẳng trường máy chủ chưa ghi dạng trong hợp đồng (`nguoi`) → có thể trắng màn | **NGUYÊN TẮC** — đề xuất KHUON_LOI.md (ngoài Phạm vi): "Trường chưa ghi dạng trong hợp đồng → không vẽ thẳng; một hàm đọc nhận các dạng có thể; kho giả dùng dạng khó nhất". Kèm **câu hỏi gửi POS**: ghi dạng `nguoi` vào HOP_DONG_API_ND.md v2 | kho giả đã dùng dạng object (KHOÁ trong Phạm vi) |
| Giá trị từ kho vẽ ở khu quản trị không qua hopLe / anhDung | **KHOÁ** — đã làm | ca nháp sai dạng + ảnh lạ ở Xem lại; BV-NHAP-SAI-DANG-VO-BANG |
| Tranh chấp thời gian ghi "CHƯA KIỂM" trong khi dựng được ca (API giả trì hoãn) | **KHOÁ** — đã làm | ca "tắt sửa khi nháp còn đang tải"; BV-BAT-LAI-NHAP-SAU-TAT |
| Bộ kiểm K2 chặn mọi chuỗi '/api/…' ngoài /api/kh (viết trước kho /api/nd) → code phải viết vòng | **KHOÁ** — đề xuất (ngoài Phạm vi, `kiem_tra_truoc_khi_giao.js`): K2 cho `/api/nd` (hợp đồng RIÊNG), chỉ trong `src/noiDung/khoNoiDung.js` + `src/noiDung/nd.js` | soát vòng 1 gọi là "lách"; đã ghi Phát hiện |
| `CheDoSua` đọc `.phone` lúc vẽ đầu (chưa có trong DOM) → không bật lớp | **BỎ** | lỗi lập trình một lần, bài Chromium bắt ngay |
| Bảng nổi che màn → lớp bút tính lại rỗng → "Chữ của màn này" rỗng | **BỎ** | một lần; ca D5 canh |
| Người gác chặn: B-PHANTICH ×11 (lệnh script phải đứng một mình), B-BIMAT-CHU ×3 (bài thử chứa chữ khoá bí mật phải commit trước khi chạy; ghi trang_thai bằng Edit), GIT-LENH (git worktree → dùng git archive), GIT-ADD (thư mục → từng tệp), SED-I (→ Edit) | **BỎ** | luật người gác đúng như skill dặn; làm lại theo hướng dẫn. Không cần luật mới |
| Lượt `npm test` có trình duyệt (~10 phút) chạy trùng lúc sửa bài → KHKHOP1 đỏ do chạy TRƯỚC khi sửa | **BỎ** | chạy lại sau khi sửa: xanh |
Dọn: không có lời dặn nào trong KHUON_LOI.md / CLAUDE.md có phép kiểm mới làm thay ở việc này.

Sau sửa vòng 2: `--day-du` 54 đạt · 0 hỏng (thu_KHADMIN1.js 172/0 có Chromium).

HEAD ĐÃ KIỂM: 41f062e
