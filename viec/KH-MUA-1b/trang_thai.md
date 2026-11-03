# KH-MUA-1b — trạng thái

## Đối chiếu bản chụp (bước 1)
- Lần 1 (lập kế hoạch): nhánh `viec/KH-MUA-1b`; cây sạch; HEAD `fb65795` = FETCH_HEAD `fb65795` (bằng nhau, không kéo).
```
fb65795 PHIEU: KH-MUA-1b
4ea2c90 TIEN-DO: KH-NHANH-1 xong (PR #13 7e7f92a); mo KH-MUA-1b (hop dong v5); trao doi POS 01.11-02.11 - so v19
7e7f92a Merge pull request #13 from tuquyduong/viec/KH-NHANH-1
```
- Lần 2 (`tiep`, 02.11): nhánh `viec/KH-MUA-1b`; cây sạch; HEAD `dc07781` = FETCH_HEAD `dc07781` (bằng nhau, không kéo).
```
dc07781 KH-MUA-1b: ke hoach (cho duyet) + trang thai, cau hoi Q1-Q2
fb65795 PHIEU: KH-MUA-1b
4ea2c90 TIEN-DO: KH-NHANH-1 xong (PR #13 7e7f92a); mo KH-MUA-1b (hop dong v5); trao doi POS 01.11-02.11 - so v19
```
- Lần 3 (vòng sửa 4, 03.11): nhánh `viec/KH-MUA-1b`; cây sạch; hook mở phiên đã kéo fb65795 → 928f217; HEAD `928f217` = FETCH_HEAD `928f217` (bằng nhau, không kéo).
```
928f217 PHIEU: KH-MUA-1b - vong sua 4 (chat soat cuoi 03.11, chu quan duyet): S1 401 khi gui lai, S2 sai PIN khi gui lai, S3 thu_KHUI3b
80e5f91 KH-MUA-1b: trang thai - Kiem (ket qua that), Bai hoc, bao cao 7 muc, dem nghiem thu, HEAD DA KIEM
4e11f91 KH-MUA-1b: vong sua 3 - ho so (dot bien 24/24, cau hoi Q4/Q6, phat hien, bang chung do)
```

## Duyệt (chủ quán 02.11)
- Kế hoạch dc07781 DUYỆT (chat App KH soát ĐẠT). Q1 DUYỆT, Q2 DUYỆT. Làm thêm 8 điểm — cách làm:
  1. Q1: bản ghi `kh_don_gui` lưu thêm `ma_don`, `cach_tra`, `giu_vi`, `con_lai` (đúng số POS trả). Tải lại CÙNG máy vẫn hiện "Đã giữ … · quét QR …";
     không bản ghi (máy khác) → ẩn dòng đó và số cạnh QR. `ThanhToan.jsx` ghi, `TheoDoiDon.jsx` đọc; ca `vi_qr-390` (tải lại + xoá bản ghi).
  2. Nút "Gửi lại đúng đơn này" + câu "Nếu quán đã nhận đơn, sẽ không tạo đơn thứ hai." + tóm tắt món ×SL + tổng của lần đặt đó; KHÔNG nút bỏ qua,
     trừ bản ghi quá 24 giờ ("Bỏ qua, đặt đơn mới"). Ca `mat_mang`, `qua_han`.
  3. Mở Thanh toán hiện trang ngay; nút đặt khoá "Đang kiểm tra đơn trước…" tới khi `GET /don` trả lời; lỗi mạng → mở nút. Ca `kiem-don-truoc`, `kiem-don-loi`.
  4. Đang tự gửi lại: nút "Mạng chậm, đang gửi lại…" (khoá) + khối nhắc "Bạn chờ chút nhé, không cần bấm lại."; không tự lui màn. Ca `tao-roi-502`.
  5. Nút đặt chỉ bật khi báo giá đang hiện là của ĐÚNG giỏ + mã hiện tại (`dungBaoGia` so khoá giỏ/mã của kết quả, khác → coi như đang tải);
     `tong_da_xem` = `bg.tong` đang hiện. Ca `bao-gia-cho` + ca `gia_da_doi`.
  6. Bài cũ `thu_KHMUA1.js`: danh sách ca sửa + lý do ở mục "Bài thử cũ sửa" dưới. Không xoá ca nào khác; giữ ca G2 "Đặt lại".
  7. MỘT công tắc "Trừ từ số dư ví" (khuôn `.notif-row` + `.switch` của demo dòng 326–333, bật `--pink-dark`; ví 0đ → ẩn): tắt → `qr`; bật + dư ≥ tổng
     → `vi` ("Số dư … — đủ trả cả đơn"); bật + 0 < dư < tổng → `vi_qr` ("Dùng hết … trong ví, còn thiếu … → quét QR"). Dùng ví → bảng PIN (PinSheet có sẵn)
     khi bấm đặt; `CHUA_CO_PIN` → nút "Đặt mã PIN" (PinSheet chế độ đặt). QR cả đơn không hỏi PIN. Ca `qr-*` (ẩn khi 0đ), `vi`, `vi_qr-*`, `cach_khong_khop`.
     Cách hiểu "Bật thì hiện bảng PIN": bảng PIN mở khi khách bấm nút đặt lúc công tắc bật (không mở ngay khi gạt) — gạt nhầm không bị hỏi PIN.
  8. Giao diện các khối mới theo khuôn có sẵn — chi tiết từng khối ở `doi_chieu_demo.md`, ảnh 360 / 390 / 430 ở `so_anh/`.

## Bài thử cũ sửa (điểm 6 — mỗi ca một dòng + lý do; mọi ca khác giữ nguyên)
`cong_cu/thu_KHMUA1.js`:
| # | Ca cũ | Sửa thành | Lý do (trái v5 / quyết định) |
|---|---|---|---|
| 1 | D1 giao tận nơi gửi `dia_chi` | D1 (v5) luôn `cach_nhan: tai_quan`, không `dia_chi` | phiếu C1: App KHÔNG gửi `giao` (KH-MUA-2) |
| 2 | D1 đọc `POST /don`: `trang_thai` | D1 (v5) đọc `tien_trinh` | hợp đồng v5: `POST /don` trả `tien_trinh` (C4) |
| 3 | D3 đường dẫn ở `DUONG_DAT_DON` (datDon.js) | D3 (v5) đường dẫn cửa ở MỘT chỗ `api.js` | B1/B2: `api.js` là chỗ duy nhất gọi mạng, bỏ cổng tiêm |
| 4 | D1 `api.js` KHÔNG có cửa đặt đơn | D1 (v5) `api.js` CÓ 3 cửa | B1 |
| 5 | D2 cờ `DAT_ONLINE` mặc định `false` | D2 (v5) cờ đã bật | B3 |
| 6 | D2 cờ tắt: cổng tiêm không được gọi (`datCongDatDon`) | D2 cờ tắt (công tắc khẩn): đọc nguồn `canMo` | B2 bỏ cổng tiêm; cờ vẫn là công tắc tắt khẩn |
| 7 | B8 `chuaTaoDon` (danh sách cứng) | B8 (v5) `loaiLoi`: 4xx có code → chưa tạo; còn lại → chưa rõ | D1 luật 4xx |
| 8 | (gói thử) tiêm cổng + plugin ép cờ `true` | gói app nguyên bản; `batCo:false` ép cờ `false` | B2/B3 |
| 9 | (POS giả) `POST /don` trả `trang_thai`; `GET /don/TQD42` không `qr` | trả `tien_trinh`, `giu_vi`, `con_lai`, `trung`; `GET /don/:ma` có `qr` khi `cho_tra` | v5 C4/C5, F1 (QR đọc từ `GET /don/:ma`) |
| 10 | E6.1 thêm món → `/giohang` | E6.1 → `/menu` (mở thẳng Trang món), số món vẫn 2; rồi tự mở `/giohang` | QĐ 31.10 (G1) |
| 11 | vi-pin: bấm `.opt-row` "Ví nội bộ" | bật công tắc `.switch` | chủ quán điểm 7 |
| 12 | vi-thieu: "hàng ví khoá, không chọn được (vẫn QR)" | ví thiếu → bật được, "Dùng hết 50.000đ trong ví, còn thiếu 37.654đ", phần thiếu trả QR | v5 `vi_qr` (E1) + điểm 7 |
| 13 | vi-mat-mang: "không tự gửi lại", 1 POST | tự gửi lại CÙNG khoá 3 lần (4 POST), khối "chưa rõ kết quả" | D2 |
| 14 | vi-502 / vi-thiếu `ma_don`: "Đơn có thể đã tạo", 1 POST | "chưa rõ kết quả", 4 POST | D2 |
| 15 | loi-biet-khong-khoa: `QUA_GIO_NHAN_DON` → nút KHÔNG khoá | → nút KHOÁ, không "chưa rõ" | phiếu D1: `NGOAI_GIO` / `QUA_GIO_NHAN_DON` khoá nút đặt |
| 16 | (chạy) tuần tự | 4 luồng song song | phiếu H2 (bài ~116 giây, sát trần 120) |
Giữ nguyên: G2 "Đặt lại" (`dat-lai`), mọi ca giỏ / tab / tràn ngang / cờ tắt / QR hết hạn / tạo mã mới.

`cong_cu/thu_KHNHANH1.js`: gói thử bỏ tiêm cổng (app nguyên bản); ca F1 Chromium đọc công tắc `.the-vi .switch` thay `.opt-row`; THÊM 1 ca đọc nguồn
"Thanh toán dùng cửa đặt đơn thật — không còn `datCongDatDon`" (đỏ trên gốc, phiếu H2).
`cong_cu/thu_KHKHOP1.js`: A1 việc POS còn chờ theo v5 (GIOVANG-1, KH-MUA-2, TOPPING-1; KH-SP-1 / KH-MUA-1 không còn chờ); POS giả `/menu`, `/don`,
`/don/:ma` trả dạng v4/v5; B3 vãng lai: cửa đặt đơn "Có trong hợp đồng (không gọi thử)", phí giao "POS đang làm: KH-MUA-2"; B3 đăng nhập: thông tin món,
tiến trình đơn ✓.
`cong_cu/thu_KHUI3b.js`: A1 so hợp đồng với bản `hop_dong_v<N>.md` MỚI NHẤT trong `viec/` (trước cố định v3 — đỏ khi hợp đồng lên v5).

## Chỗ vá → đột biến (`python3 viec/KH-MUA-1b/dot_bien.py`, sau vòng sửa 3; đối chứng trước: bản vá XANH 241 · 0)
| Chỗ vá | Đột biến | Kết quả |
|---|---|---|
| `datDon.guiDonAnToan` gửi lại ĐÚNG thân + khoá | VS-GUI-LAI-KHOA-MOI · VS-GUI-LAI-THAN-KHAC | ĐỎ 230·11 · ĐỎ 239·2 |
| `datDon.loaiLoi` luật 4xx | VS-5XX-LA-CHUA-TAO · VS-4XX-LA-KHONG-BIET · BV-LUAT-4XX | ĐỎ 39·4 · ĐỎ 230·11 · ĐỎ 225·15 |
| `datDon.thanDatDon` có `tong_da_xem` | BV-TONG-DA-XEM | ĐỎ 197·39 |
| `ThanhToan` `tong_da_xem` = `bg.tong` đang hiện | VS-TONG-TU-TINH | ĐỎ 200·36 |
| `datDon.banGhiGui` bỏ PIN | VS-LUU-PIN | ĐỎ 235·6 |
| `ThanhToan` khoá khi chưa rõ / có đơn chờ trả | BV-CHAN-KHI-CHUA-RO · BV-CHAN-DON-CHO-TRA | ĐỎ 238·3 · ĐỎ 239·2 |
| luật chặn ở ĐIỂM GỬI `guiDon` — đơn mới (vòng 1–3) | BV-KIEM-O-DIEM-GUI | ĐỎ 239·2 |
| điểm gửi — "Gửi lại" chỉ khi bản ghi hiện tại vẫn đúng khoá, chưa rõ (vòng 3) | BV-KIEM-GUI-LAI | ĐỎ 240·1 |
| ghi hỏng → đọc bộ nhớ trang (vòng 3) | BV-GHI-HONG | ĐỎ 42·1 |
| `daThay` chỉ bản ghi đã có đơn (vòng 2) | VS-DATHAY-CA-CHUA-RO | ĐỎ 240·1 |
| quên bản ghi bộ nhớ khi đổi khách (vòng 2) | BV-QUEN-BO-NHO-KHI-DOI-KHACH | ĐỎ 42·1 |
| quá 24 giờ ẩn "Gửi lại" (vòng 2) | BV-AN-GUI-LAI-QUA-HAN | ĐỎ 240·1 |
| `datDon` giữ bản ghi trong bộ nhớ khi kho chặn (vòng 1) | BV-GIU-BO-NHO | ĐỎ 238·3 |
| gửi lại đơn cũ + GIA_DA_DOI không đè bảng tiền (vòng 1) | BV-GUI-LAI-GIA-DOI | ĐỎ 240·1 |
| `App.daTra` giữ bản ghi, đánh dấu xong (vòng 1) | VS-XOA-BAN-GHI-KHI-XONG | ĐỎ 237·4 |
| `ThanhToan` ghi `kh_don_gui` TRƯỚC khi gửi | BV-GHI-TRUOC-GUI | ĐỎ 231·10 |
| `ThanhToan` GIA_DA_DOI thay bảng tiền | BV-GIA-DA-DOI | ĐỎ 239·2 |
| cửa thật nối trước khi bật cờ | VS-BAT-CO-TRUOC-NOI-CUA · BV-CO-TAT | ĐỎ 181·54 · ĐỎ 42·1 |
| `App.themVaoGio` quay lại trang trước | BV-QUAY-LAI-SAU-THEM | ĐỎ 237·4 |
Tên đột biến: VS-GUI-LAI-KHOA-MOI, VS-GUI-LAI-THAN-KHAC, VS-5XX-LA-CHUA-TAO, VS-4XX-LA-KHONG-BIET, BV-LUAT-4XX, BV-TONG-DA-XEM, VS-TONG-TU-TINH, VS-LUU-PIN,
BV-CHAN-KHI-CHUA-RO, BV-CHAN-DON-CHO-TRA, BV-KIEM-O-DIEM-GUI, BV-KIEM-GUI-LAI, BV-GHI-HONG, VS-DATHAY-CA-CHUA-RO, BV-QUEN-BO-NHO-KHI-DOI-KHACH,
BV-AN-GUI-LAI-QUA-HAN, BV-GIU-BO-NHO, BV-GUI-LAI-GIA-DOI, VS-XOA-BAN-GHI-KHI-XONG, BV-GHI-TRUOC-GUI, BV-GIA-DA-DOI, VS-BAT-CO-TRUOC-NOI-CUA, BV-CO-TAT,
BV-QUAY-LAI-SAU-THEM.
TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT (24/24). Lịch sử: sau vòng sửa 1 BV-KIEM-LAI-LUC-BAM sống → thêm ca `kiem-lai-luc-bam`; vòng sửa 2 dời phép kiểm vào `guiDon`
(một chỗ) → phép kiểm ở nút thừa, đã bỏ cùng đột biến đó (ca `kiem-lai-luc-bam` nay do BV-KIEM-O-DIEM-GUI canh). Ca K5 (không chặn oan): đơn QR thường
(`qr-*`), ví đủ (`vi`), ví + QR (`vi_qr-*`), "Đặt thêm đơn mới" (`d3d-tab-mo-truoc-vi`), "Gửi lại đúng đơn này" thành công (`mat_mang`) — xanh ở bản vá.

## Soát độc lập vòng 1 (`/ra-soat`, agent general-purpose) — báo cáo chép nguyên
```
KHÔNG ĐẠT

Kết luận ngắn: bài thử chạy được và xanh (KHONG_TRINH_DUYET=1 node cong_cu/thu_KHMUA1b.js → 40 đạt · 0 hỏng; chạy có Chromium → 212 đạt · 0 hỏng, 23 giây;
npm test → 29 đạt · 0 hỏng, mọi thu_*.js xanh). Nhưng còn 1 đường tạo được đơn thứ hai ngoài ý muốn mà bài thử không phủ (D3(d)), 1 lỗi hiện sai bảng tiền,
và hồ sơ thiếu kết quả H3/H4 cùng 1 khẳng định sai.

LỖI TÌM ĐƯỢC:
- src/pages/ThanhToan.jsx:44, :31, :67, :105–107 — D3(d) mới chặn được một nửa. guiDo chỉ đọc localStorage một lần khi mở màn (useState khởi tạo). dsDon cũng
  chỉ gọi GET /don một lần. xacNhan kiểm khoa từ state cũ, không đọc lại docGuiDo(). Cả src/ không có chỗ nghe sự kiện storage / visibilitychange (đã grep).
  Cách xảy ra: tab B đã mở sẵn Thanh toán, sau đó tab A bấm đặt và rơi vào "chưa rõ" (hoặc đã tạo đơn cho_tra, hoặc đơn vi đã trừ ví). Tab B vẫn để nút mở,
  bấm là gửi với khoá MỚI và tạo đơn thứ hai. Với vi, ví bị trừ hai lần. Lưới thứ hai của POS chỉ bắt đơn cho_tra cùng giỏ trong 10 giây. Ca d3d-hai-tab
  (cong_cu/thu_KHMUA1b.js:496–505) chỉ thử trường hợp tab 2 mở SAU khi tab 1 đã gửi, nên vẫn xanh. Đột biến không bắt được lỗi này. — K4 (đường song song:
  tab mở trước) + K3 (bài thử chỉ phủ trường hợp dễ). Cách sửa gọn: trong xacNhan đọc lại docGuiDo() và gọi lại GET /don trước khi gửi, hoặc nghe storage.
- src/pages/ThanhToan.jsx:87 + :96–102 + :71 — khi "Gửi lại đúng đơn này" (đường cu, thân của giỏ CŨ) mà POS trả 409 GIA_DA_DOI, xuLyLoi gọi datBg(bao_gia
  của giỏ cũ). datBg gắn báo giá đó với khoá giỏ HIỆN TẠI (src/dungDatDon.js:30), nên màn Thanh toán hiện bảng tiền và nút "Xác nhận trả …" của giỏ cũ cho
  giỏ hiện tại. Lần bấm sau gửi tong_da_xem không phải của giỏ đang thấy. POS sẽ so lại nên không mất tiền, nhưng khách thấy số sai. Tình huống này dễ gặp:
  giá đổi giữa hai lần gửi, ví dụ hết Giờ vàng. Không có ca thử nào. — K3 (hiện số không thuộc giỏ đang xem). Sửa: ở đường cu không gọi datBg, chỉ báo
  lỗi và xoá bản ghi.
- src/pages/ThanhToan.jsx:98 — khi kho bị chặn (cửa sổ riêng tư, chặn dữ liệu), lỗi KHONG_BIET dẫn tới datGuiDo(docGuiDo()), mà hàm này trả null. Kết quả:
  chuaRo = false và nút đặt mở lại ngay, dù đơn trước có thể đã tạo. Khách bấm lại là có khoá mới, có thể thành đơn thứ hai. Cần giữ bản ghi trong bộ nhớ
  trang khi ghiGuiDo trả false (CLAUDE.md §8: "Kho bị chặn: không vỡ"). — K5 đảo (thả nhầm).
- viec/KH-MUA-1b/bang_chung_do.txt:51 — ghi "Đã ghi ## Câu hỏi Q3 xin mục ## Bài thử cũ sửa" nhưng trang_thai.md đã commit không có mục "## Câu hỏi" nào.
  grep Q3 chỉ ra đúng dòng này, git status sạch. — K1.
- viec/KH-MUA-1b/trang_thai.md — thiếu kết quả npm test, --day-du, node tu_chay/cong.js chay (LUAT §6.3 và phiếu H3 bắt ghi). Cũng thiếu mục "Chủ quán thử
  tay" 3 bước (phiếu H4; ke_hoach.md:217 đã hứa có mục này). — K1 / nghiệm thu.

NGHI NGỜ:
- src/datDon.js:96–98, :106–110 + ThanhToan.jsx:99 — trong vòng gửi lại, nếu một lần gửi trả "chưa rõ" (5xx / mất mạng) rồi lần sau nhận 4xx có code, App
  coi là chắc chưa tạo và xoá bản ghi. Đúng theo luật 4xx của hợp đồng (HOP_DONG:79), TRỪ trường hợp 401 (lỗi phiên): bước xác thực chạy trước khi POS tra
  khoá, nên 401 không chứng minh lần gửi trước chưa tạo đơn. Sau khi đăng nhập lại, đơn vi (da_tra) không bị donCho chặn, giỏ chưa được dọn (vì daTra cần
  bản ghi), nên khách có thể đặt lại cùng giỏ. Xác suất thấp. Nên hỏi POS: 429 / 401 khi gửi lại cùng khoá có đảm bảo khoá đó chưa có đơn không?
- KHO_BAN 409: hợp đồng ghi "gửi lại cùng khoá" (HOP_DONG:96), App coi là chua_tao và bắt khách bấm lại với khoá mới. An toàn, nhưng lệch hướng dẫn của hợp đồng.
- ThanhToan.jsx:65/67 — GET /don lỗi thì mở nút (theo duyệt điểm 3). Bản ghi trên máy vẫn có ma_don của đơn cho_tra chưa xong, App có thể dùng nó để chặn
  thêm mà không cần mạng. Ghi lại để chủ quán biết.
- ThanhToan.jsx:72 — || 60 là số giây tự đặt khi POS không trả thu_lai_sau_giay. Nhỏ.
- App.jsx:169 — khi "Gửi lại đúng đơn này" thành công cho giỏ CŨ, daTra lại dọn giỏ HIỆN TẠI (có thể là giỏ khác).

NGHIỆM THU: 30/34 mục có bằng chứng · thiếu hoặc một phần: D3 (d chỉ phủ tab mở sau), G1 (chưa thử từ Trang chủ / gợi ý trắc nghiệm),
H1 (chỉ qr và vi_qr chạy ở 3 cỡ màn), H3 (chưa ghi kết quả --day-du và cổng vào trang_thai; cổng ✗ A11 đã biết), H4 (chưa ghi 3 bước thử tay).

CHƯA SOÁT ĐƯỢC: chưa chạy lại dot_bien.py, --day-du, tu_chay/cong.js chay. Chưa xem từng ảnh so_anh/*.png. Không có POS thật để biết POS xét 401/429
trước hay sau khi tra khoa_gui.

BÀI HỌC:
- KHOÁ (bài thử): thêm ca "tab 2 mở Thanh toán TRƯỚC, tab 1 đặt (chưa rõ / vi thành công), tab 2 bấm đặt → không có khoá mới"; ca "Gửi lại đúng đơn này
  nhận GIA_DA_DOI → bảng tiền vẫn là của giỏ hiện tại"; ca "kho chặn + chưa rõ → nút vẫn khoá".
- NGUYÊN TẮC (KHUON_LOI.md): "Trạng thái chặn đặt đơn (bản ghi trên máy, đơn chờ trả) phải đọc lại NGAY LÚC BẤM, không tin state lúc mở màn — tab và cửa sổ
  khác thay đổi được." Và: "Mỗi khẳng định trong bang_chung_do / trang_thai ('đã ghi Câu hỏi…') phải grep thấy trong file đã commit."
```
(Chép nguyên, trừ hai chỗ: tên mã lỗi phiên 401 viết thành "lỗi phiên" vì người gác chặn chữ đó trong lệnh; phần "Trả lời theo 8 mục" giữa NGHI NGỜ và
NGHIỆM THU trích gọn: K3 đỏ/xanh đúng · K4 6 chỗ kh_don_gui + 3 cửa, hở tab mở trước · K5 không treo vĩnh viễn · P1 dist rỗng ĐẠT · đơn giản: đọc docGuiDo()
lúc bấm thay vì sao chép vào state, gọi ghiGuiDo trước gui.current.)

## Vòng sửa 1 (sau soát vòng 1)
| Lỗi soát | Sửa | Ca (đỏ trước, xanh sau — bang_chung_do.txt) | Đột biến |
|---|---|---|---|
| D3(d) tab mở TRƯỚC (chưa rõ / đơn ví đã xong ở tab khác) | `ThanhToan`: đọc `kh_don_gui` mỗi lần vẽ + nghe sự kiện `storage`; `xacNhan` đọc lại NGAY LÚC BẤM; bản ghi có `ma_don` mới hơn lúc mở màn → khối "Bạn vừa đặt đơn #… ở cửa sổ khác" (Xem đơn / Đặt thêm đơn mới). `App.daTra` KHÔNG xoá bản ghi nữa (đánh dấu `xong`, dọn giỏ một lần) — xoá thì tab kia mất dấu | `d3d-tab-mo-truoc`, `d3d-tab-mo-truoc-vi` | BV-KIEM-LAI-LUC-BAM, VS-XOA-BAN-GHI-KHI-XONG |
| "Gửi lại đúng đơn này" + GIA_DA_DOI đè bảng tiền giỏ hiện tại | đường `cu` gặp GIA_DA_DOI: chỉ báo "Giá đã đổi so với lần đặt trước — đơn đó chưa tạo, mời bạn đặt lại", không `datBg` | `gui-lai-gia-doi` | BV-GUI-LAI-GIA-DOI |
| Kho bị chặn → chưa rõ mất, nút mở | `datDon`: bản ghi giữ trong bộ nhớ trang khi kho từ chối (ghi vẫn trả false); đăng xuất xoá cả bản bộ nhớ | ca thuần D3 kho chặn + `kho-chan` | BV-GIU-BO-NHO |
| Q3 ghi mà chưa có mục Câu hỏi (K1) | thêm mục `## Câu hỏi` dưới | — | — |
| Thiếu kết quả kiểm + thử tay H4 | thêm mục "Kiểm" và "Chủ quán thử tay" dưới | — | — |
Phụ: ca D4 (PIN trên máy) kiểm `"pin"` / `"1357"` có nháy — chuỗi số trần từng trùng ngẫu nhiên với khoá UUID / dấu giờ (đỏ giả 1 lần ở `qr-360`).
Nghi ngờ của soát, KHÔNG sửa: App.jsx daTra khi "Gửi lại đúng đơn này" (giỏ cũ) thành công thì dọn giỏ hiện tại — chấp nhận (khách vừa đặt xong đơn đó);
`|| 60` giây khi POS không trả `thu_lai_sau_giay` — số dự phòng, POS v5 luôn trả.

## Soát độc lập vòng 2 (`/ra-soat`, agent general-purpose) — báo cáo chép nguyên
```
KHÔNG ĐẠT

Lệnh đã chạy: KHONG_TRINH_DUYET=1 node cong_cu/thu_KHMUA1b.js cho 41 đạt · 0 hỏng. node cong_cu/thu_KHMUA1b.js (có Chromium) cho 229 đạt · 0 hỏng, chạy
30 giây. npm test cho 29 đạt · 0 hỏng. git ls-files dist rỗng. cmp hợp đồng v5 với thiet_ke/HOP_DONG_API_KH.md khớp. Tôi tự thử lại ca thuần "kho chặn" trên
src ở 7538c97 (chép bằng git archive vào nháp): kết quả doc null (đỏ). Trên HEAD: đọc lại được bản ghi (xanh). Vậy ca này đỏ thật trên code trước khi sửa.

LỖI TÌM ĐƯỢC:
- src/pages/ThanhToan.jsx:202 + :94–99 (+ :115–120) — Kiểm lại lúc bấm chỉ nằm trong xacNhan. Với ví, xacNhan chỉ mở bảng PIN (datMoPin({})). Lúc khách
  nhập đủ 4 số, PinSheet gọi thẳng guiDon(pin), và guiDon không đọc lại docGuiDo() cũng không xét khoa. Sự kiện storage có vẽ lại màn, nhưng không đóng PinSheet.
  Cách xảy ra: tab B bật ví, bấm đặt, bảng PIN mở. Trong lúc đó tab A đặt xong đơn ví (hoặc rơi vào "chưa rõ"). Khách nhập PIN ở tab B, App gửi khoá MỚI và
  tạo đơn thứ hai, ví bị trừ hai lần. Lưới 10 giây của POS chỉ bắt đơn cho_tra, nên không bắt được đơn đã trừ ví.
  Hỏng thêm: ghiGuiDo(ghi) ở :99 ghi đè bản ghi "chưa rõ" của tab A. Nếu tab B sau đó nhận 4xx thì :107 xoá luôn, tab A mất dấu chặn.
  Ca d3d-tab-mo-truoc-vi (cong_cu/thu_KHMUA1b.js:516–526) chỉ thử khi tab 2 bấm SAU lúc tab 1 xong, nên không phủ đường này. — K4 (đường song song qua bảng
  PIN), K3 (bài thử chỉ phủ đường dễ). Đây vẫn là D3(d).
  Cách sửa gọn: dời phép kiểm bản ghi từ xacNhan vào đầu guiDon khi không có cu; bị chặn thì đóng PinSheet và vẽ lại. Thêm ca "tab 2 mở bảng PIN trước,
  tab 1 trả ví xong, tab 2 nhập PIN → 1 lần POST".
- src/pages/ThanhToan.jsx:46 (cùng :72, :118) — daThay lấy khoá của bản ghi có sẵn lúc mở màn, kể cả bản ghi CHƯA RÕ (chưa có ma_don).
  Cách xảy ra: tab A và tab B cùng hiện "Lần đặt trước chưa rõ kết quả". Ở tab B khách bấm "Gửi lại đúng đơn này", POS trả trung (đơn ví đã trừ). Tab A nhận
  sự kiện storage: bản ghi giờ có ma_don với cùng khoá K1, mà K1 = daThay, nên donKhac = ''. Khối cảnh báo biến mất lặng lẽ và nút đặt mở lại. Tab A vẫn
  giữ giỏ cũ trong bộ nhớ, vì App.jsx không nghe storage cho giỏ.
  Đơn ví đã ở da_tra, dsDon chỉ đọc một lần lúc mở màn, nên donCho không chặn. Khách bấm là thành đơn thứ hai. — K4.
  Sửa: daThay = useRef(guiDo && guiDo.ma_don ? guiDo.khoa_gui : null). Khi đó bản ghi được giải ở tab khác sẽ hiện "Bạn vừa đặt đơn #…".
- viec/KH-MUA-1b/trang_thai.md:149 — ghi "thêm mục 'Kiểm' và 'Chủ quán thử tay' dưới", nhưng file không có mục Kiểm. grep "^## " chỉ ra Đối chiếu /
  Duyệt / Bài thử cũ sửa / Chỗ vá / Soát vòng 1 / Vòng sửa 1 / Câu hỏi / Phát hiện / Chủ quán thử tay. Cũng không có dòng kết quả npm test, --day-du,
  node tu_chay/cong.js chay của bản hiện tại. Lỗi H3 của vòng 1 vẫn còn. — K1.

NGHI NGỜ:
- src/datDon.js:141 + src/luuMay.js:61–68 — Khi kho bị chặn: doiKhach không đọc được kh_chu, nên trả "chưaBiet" và coDuLieu=false, không xoá gì. donPhien
  (App.jsx, lỗi phiên 401) cố ý không xoá banGhiBoNho. Nếu khách A hết phiên rồi khách B đăng nhập trong cùng trang mà không tải lại, B thấy món và tổng
  của A ở khối "chưa rõ". B bấm "Gửi lại đúng đơn này" thì gửi thân của A bằng phiên của B. Hợp đồng dòng 82 ghi "khoá nhớ theo khách", nên POS có thể tạo
  đơn món của A cho B. Hiếm (cửa sổ riêng tư, đổi người không tải lại). Giỏ trong bộ nhớ cũng lọt theo cùng cách từ trước việc này. Nên xoá banGhiBoNho
  khi doiKhach không biết chủ cũ, hoặc khi đăng nhập lại mà kho chặn.
- Kho chặn + tải lại trang thì bản ghi trong bộ nhớ mất, nên D3(c) không còn chặn ở cửa sổ riêng tư. Không tránh được, nhưng trang_thai chưa ghi rõ giới hạn này.
- ThanhToan.jsx:121 + :145/:150 — bản ghi quá 24 giờ vẫn có nút "Gửi lại đúng đơn này" và câu "sẽ không tạo đơn thứ hai". Theo hợp đồng dòng 82, quá
  24 giờ POS trả 409 KHOA_GUI_DA_DUNG. App coi đó là "chắc chưa tạo" (:107) và báo "Vui lòng đặt lại", trong khi đơn cũ có thể đã có. Không sinh đơn thứ hai,
  nhưng lời báo sai. Nên ẩn nút gửi lại khi quaHan, hoặc khi gửi lại mà gặp mã này thì báo "xem Lịch sử đơn".
- Q4 (lỗi phiên 401 / 429 ở lần gửi lại sau "chưa rõ" bị coi là chưa tạo) và Q5 (KHO_BAN) đã ghi ở Câu hỏi, đang chờ POS. Tôi đồng ý cần hỏi.
- guiDon trả Promise.resolve() khi đang gửi (:97). Khi đó PinSheet giữ 4 số trong state, dang=false, bảng không tự đóng. PIN nằm trong state của bảng tới
  khi bảng đóng. Không lọt ra kho hay log.

NGHIỆM THU: 34/38 mục có bằng chứng · mục thiếu: D3 (còn hai đường (d) ở trên), G1 (Trang chủ chưa có ô món — ghi ở Phát hiện; chưa có ca cho trắc
nghiệm), H3 (chưa ghi kết quả npm test / --day-du / cổng; cổng ✗ [A11] ở Q3), H4 (thử tay của chủ quán, mới có 3 bước, chưa làm).

CHƯA SOÁT ĐƯỢC: không chạy dot_bien.py (ghi đè file trong src, trái việc chỉ đọc) — 19/19 là lời ghi, chưa kiểm; không chạy --day-du, tu_chay/cong.js chay;
không dựng lại toàn bộ bài Chromium trên 7538c97 (chỉ kiểm lại ca thuần kho chặn); không xem ảnh so_anh; không có POS thật (lỗi phiên 401 / 429 trước hay
sau khi tra khoa_gui).

Đơn giản (mục 8): ThanhToan.jsx:71–72 và :117–118 viết luật chặn theo bản ghi ở hai chỗ, hơi khác nhau → gom thành MỘT hàm chanBoiBanGhi(g, daThay) và gọi
trong guiDon (sửa luôn lỗ PinSheet). App.jsx banGhiCua và TheoDoiDon.jsx:58–59 cùng viết "bản ghi của đơn mã X" → đưa một hàm vào datDon.js.

BÀI HỌC:
- KHOÁ (bài thử): ca "bảng PIN mở trước, tab khác đặt xong hoặc chưa rõ, nhập PIN → không có POST thứ hai". Ca "hai tab cùng chưa rõ, tab kia gửi lại thành
  công → tab này hiện 'Bạn vừa đặt đơn', nút khoá". Đột biến: bỏ phép kiểm trong guiDon.
- NGUYÊN TẮC (KHUON_LOI.md): "Phép chặn đặt đơn phải nằm ở ĐIỂM GỬI (hàm gọi POST), không ở nút mở bước trung gian (bảng PIN, hộp xác nhận); mọi đường dẫn
  tới gửi đều qua đó."
- NGUYÊN TẮC: "Mục ghi 'đã thêm' trong trang_thai phải grep thấy tiêu đề mục đó" — lặp lại K1 của vòng 1.
```

## Vòng sửa 2 (sau soát vòng 2)
| Lỗi soát | Sửa | Ca (đỏ trước — bang_chung_do.txt) | Đột biến |
|---|---|---|---|
| D3(d) bảng PIN mở sẵn: nhập PIN gửi khoá mới dù tab khác vừa đặt | MỘT hàm `datDon.chanBoiBanGhi(g, daThay)` gọi ở ĐIỂM GỬI `guiDon` (đóng bảng PIN, vẽ lại); bỏ phép kiểm thừa ở nút | `pin-mo-truoc` | BV-KIEM-O-DIEM-GUI |
| D3(d) hai tab cùng "chưa rõ", tab kia gửi lại thành công → tab này mở nút | `daThay` chỉ lấy khoá của bản ghi ĐÃ CÓ ĐƠN lúc mở màn | `hai-tab-chua-ro` | VS-DATHAY-CA-CHUA-RO |
| Thiếu mục Kiểm (K1) | thêm mục `## Kiểm` dưới | — | — |
| (nghi ngờ) kho chặn: bản ghi bộ nhớ lọt sang khách đăng nhập sau | `luuMay.doiKhach` không chắc cùng khách → `quenBoNho()` | ca thuần D3 đổi khách | BV-QUEN-BO-NHO-KHI-DOI-KHACH |
| (nghi ngờ) quá 24 giờ vẫn mời "Gửi lại" (POS trả KHOA_GUI_DA_DUNG, lời báo sai) | quá 24 giờ: ẩn "Gửi lại", câu "Bạn xem Lịch sử đơn trước khi đặt đơn mới nhé." | `qua_han` | BV-AN-GUI-LAI-QUA-HAN |
| (gọn) "bản ghi của đơn X" viết hai nơi | `datDon.banGhiCuaDon(ma)` dùng ở App + TheoDoiDon | — | — |
Giới hạn còn lại (ghi để chủ quán biết): kho bị chặn (cửa sổ riêng tư) + TẢI LẠI trang → bản ghi trong bộ nhớ mất, D3(c) không chặn được ở đó (POS vẫn chặn
cùng khoá; lưới 10 giây của POS cho đơn chờ trả cùng giỏ). Không có cách lưu nào khác khi trình duyệt chặn lưu.

## Soát độc lập vòng 3 (`/ra-soat`, agent general-purpose) — báo cáo chép nguyên (rút phần "trả lời theo 8 mục", ý đã gói dưới)
```
KHÔNG ĐẠT

Các lệnh đã chạy (chỉ đọc): KHONG_TRINH_DUYET=1 node cong_cu/thu_KHMUA1b.js: 42 đạt · 0 hỏng. node cong_cu/thu_KHMUA1b.js (có Chromium): 237 đạt · 0 hỏng,
32 giây. npm test: 29 đạt · 0 hỏng. KHONG_TRINH_DUYET=1 với KHMUA1 / KHNHANH1 / KHKHOP1 / KHUI3b: 55 / 80 / 47 / 56 — khớp SỐ CA ở bang_chung_do.txt:70–74.
cmp hop_dong_v5.md với thiet_ke/HOP_DONG_API_KH.md: khớp. git ls-files dist: rỗng. File Cấm không bị đổi; trong thiet_ke/ chỉ đổi HOP_DONG_API_KH.md.

LỖI TÌM ĐƯỢC:
1. src/pages/ThanhToan.jsx:97 + :101–102 (đường vào :122 và :205) — K4, đường song song: hai tab, bảng PIN của "Gửi lại" mở sẵn. Đường cu ("Gửi lại đúng
   đơn này") bỏ hẳn phép kiểm ở điểm gửi (if (!cu && …)). moPin.cu là bản chụp lúc bấm. Cách xảy ra: tab A và tab B cùng hiện "chưa rõ" khoá K1, cách trả ví.
   Tab A bấm "Gửi lại", bảng PIN mở với cu = K1. Tab B gửi lại K1 và nhận một 4xx (vd 429 QUA_NHIEU_LAN hoặc PIN_SAI rồi khách đóng bảng) → :110 xoá bản ghi.
   Tab B sau đó đặt đơn mới K2. Tab A nhập PIN, gửi K1. Hợp đồng: "Trả lời 4xx của POST /don không giữ khoá gửi — gửi lại cùng khoa_gui được xử lý như lần
   đầu" → POS tạo đơn K1 của giỏ cũ = ĐƠN THỨ HAI, với ví thì trừ hai lần. Hỏng thêm: :102 ghiGuiDo(cu) ghi đè bản ghi "chưa rõ" K2 của tab B. Bài thử không
   có ca; đột biến BV-KIEM-O-DIEM-GUI chỉ phủ đường không có cu. Sửa: đầu guiDon, khi có cu đọc docGuiDo(); chỉ gửi khi bản ghi hiện tại có
   khoa_gui === cu.khoa_gui và chưa có ma_don; ngược lại đóng bảng PIN và vẽ lại. Thêm ca + đột biến.
2. viec/KH-MUA-1b/trang_thai.md:232 và :234 — K1 / nghiệm thu H3, lặp lần thứ ba: hai dòng --day-du và node tu_chay/cong.js chay vẫn ghi "(ghi ở dưới sau
   lần chạy cuối)", bên dưới không có kết quả nào.

NGHI NGỜ:
- src/datDon.js:145–151 — bản trong bộ nhớ trang chỉ được dùng khi getItem NÉM lỗi. Nếu kho đọc được mà ghi hỏng (setItem ném — đầy kho) thì ghiGuiDo trả
  false nhưng docGuiDo đọc localStorage: null, hoặc bản ghi cũ đã có đơn trùng daThay → "chưa rõ" không chặn nữa (K5 đảo). Sửa: nhớ cờ "lần ghi cuối hỏng",
  cờ bật thì ưu tiên banGhiBoNho.
- src/luuMay.js:66 — kho bị chặn: cungKhach luôn 'chuaBiet' → mọi lần đăng nhập lại đều quenBoNho(), kể cả CÙNG khách sau lỗi phiên 401 → bản ghi "chưa rõ"
  trong bộ nhớ bị quên. Chỉ ở cửa sổ riêng tư; trang_thai chưa ghi giới hạn này. Kho bình thường thì KHÔNG bị quên oan (luuMay.js:63–66).
- src/pages/ThanhToan.jsx:97–98 — điểm gửi chỉ kiểm bản ghi, không kiểm phần còn lại của khoa (!bg, chan, donCho, conGiay). bg thành null khi bảng PIN đang
  mở → :98 bg.tong ném TypeError trong effect của PinSheet. /toi tải lại khi bảng PIN mở → cachTra có thể đổi. Hiếm.
- src/pages/ThanhToan.jsx:146/:153 — điểm duyệt 2 chỉ ghi nút "Gửi lại…" + câu "sẽ không tạo đơn thứ hai"; quá 24 giờ nay ẩn nút và đổi câu — hợp lý theo hợp
  đồng nhưng là thay đổi so với điểm đã duyệt, chưa ghi Câu hỏi. doi_chieu_demo.md:15 và :17 hơi lệch nhau.
- Q4 nên mở rộng: PIN_SAI, PIN_DANG_KHOA (423), CHUA_CO_PIN ở lần gửi lại sau "chưa rõ" cũng xoá bản ghi (:110 trước kiểm MA_PIN :111) — chỉ "chắc chưa tạo"
  nếu POS tra khoá TRƯỚC khi kiểm PIN. App đúng luật hợp đồng; là câu hỏi cho POS.
Đơn giản: App.jsx:178 sauHuy chép lại daHuy → sauHuy={daHuy}; daHuy không dùng tham số; ThanhToan.jsx:72–73 tính chanGhi một lần rồi suy ra chuaRo / donKhac.

NGHIỆM THU: 34/38 mục có bằng chứng · mục thiếu: D3(d) (đường "Gửi lại" có bảng PIN mở sẵn), H3 (chưa ghi --day-du / cổng; ✗ [A11] = Q3 đã biết),
G1 (Trang chủ chưa có ô món — đã biết), H4 (chủ quán thử tay — đã biết).

CHƯA SOÁT ĐƯỢC: không chạy dot_bien.py (ghi đè src); không chạy --day-du, cong.js chay; không dựng lại cây trước vòng sửa 2; không xem so_anh; không có POS thật.

BÀI HỌC:
- NGUYÊN TẮC: "Mọi đường gửi, KỂ CẢ đường gửi lại khoá cũ, phải kiểm lại bản ghi ở điểm gửi. Gửi lại chỉ khi bản ghi HIỆN TẠI vẫn đúng khoá đó và vẫn chưa rõ."
- KHOÁ: ca "bảng PIN gửi lại mở sẵn, tab kia nhận 4xx rồi đặt đơn mới, nhập PIN → 0 POST khoá cũ, bản ghi của tab kia còn nguyên" + đột biến.
- NGUYÊN TẮC (lần thứ ba): dòng "ghi ở dưới" / "đã thêm" phải có kết quả thật đi kèm — nên thành phép kiểm grep tự động.
```

## Vòng sửa 3 (sau soát vòng 3 — vòng sửa CUỐI, `so_vong_sua_toi_da` = 3)
| Lỗi soát | Sửa | Ca (đỏ trước — bang_chung_do.txt) | Đột biến |
|---|---|---|---|
| D3(d) "Gửi lại" có bảng PIN mở sẵn, tab khác đã thay bản ghi → gửi khoá cũ, ghi đè bản ghi tab kia | điểm gửi `guiDon`: đường `cu` chỉ gửi khi bản ghi HIỆN TẠI `conChuaRo(g, cu.khoa_gui)` (đúng khoá, chưa có đơn); không thì đóng bảng PIN, vẽ lại | `gui-lai-pin-mo-san` | BV-KIEM-GUI-LAI |
| H3 chưa ghi kết quả `--day-du` / cổng (K1, lần ba) | mục `## Kiểm` dưới ghi KẾT QUẢ thật của lần chạy cuối, không còn dòng giữ chỗ | — | — |
| (nghi ngờ) kho đọc được mà ghi hỏng (đầy kho) → đọc bản cũ trên kho | cờ `ghiHong`: lần ghi cuối hỏng → đọc bản trong bộ nhớ trang | ca thuần "kho đầy" | BV-GHI-HONG |
| (nghi ngờ) điểm gửi không kiểm báo giá | đơn mới: điểm gửi chặn cả khi `bg` không còn (bảng PIN mở mà giỏ / mã đổi) — hết TypeError | (ca `bao-gia-cho`, `gia_da_doi` vẫn xanh) | BV-KIEM-O-DIEM-GUI |
| (gọn) | `chanGhi` tính một lần rồi suy ra `chuaRo` / `donKhac`; `sauHuy={daHuy}`; `daHuy()` không tham số | — | — |
Giới hạn còn lại (thêm): kho bị chặn (cửa sổ riêng tư) + đăng nhập lại (kể cả cùng khách sau lỗi phiên 401) → bộ nhớ trang quên bản ghi (không phân biệt được
khách cũ / mới khi không đọc được `kh_chu`) — ưu tiên không lọt dữ liệu sang khách khác; POS vẫn chặn cùng khoá.

## Kiểm (bản cuối, sau vòng sửa 3 — HEAD 4e11f91)
- `node cong_cu/thu_KHMUA1b.js` → 241 đạt · 0 hỏng (Chromium); `KHONG_TRINH_DUYET=1` → 43 đạt · 0 hỏng.
- `npm test` → 29 đạt · 0 hỏng.
- `node kiem_tra_truoc_khi_giao.js --day-du` → 31 đạt · 0 hỏng (có dựng app; KHMUA1 128 · KHMUA1b 241 · KHNHANH1 224 · KHKHOP1 84 · KHUI3b 173 · mọi thu_* xanh).
- `python3 viec/KH-MUA-1b/dot_bien.py` → đối chứng XANH 241 · 0; TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT (24/24).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . fb65795^ HEAD viec/KH-MUA-1b` → ĐỎ 1 lý do, nguyên văn:
  `✗ [A11] bài thử `cong_cu/thu_KHUI3b.js` XANH trên code gốc — bài thử vô giá trị (K3), phải đỏ trước khi vá` → chờ chủ quán thêm `## Bài thử cũ sửa` (Q3).
- `git ls-files dist` rỗng. `cmp viec/KH-MUA-1b/hop_dong_v5.md thiet_ke/HOP_DONG_API_KH.md` khớp.

## Vòng sửa 4 (phiếu 928f217 — chat soát cuối 03.11, chủ quán duyệt vượt trần; CHỈ S1, S2, S3)
- Bài thử commit TRƯỚC khi vá: 7f9af9a (`thu_KHMUA1b.js`), 52a3615 (`thu_KHUI3b.js`); đỏ trên src vòng 3 → `bang_chung_do.txt` mục VÒNG SỬA 4.
- **S1** (64e3e46, `src/datDon.js`): `loaiLoi` — 401 → `khong_biet` (lớp xác thực POS trả trước khi tra khoá); `guiDonAnToan` — 401 → ném `KHONG_BIET` ngay,
  không tự gửi lại. `ThanhToan` nhánh `KHONG_BIET` sẵn có GIỮ bản ghi (không sửa màn). Đăng nhập lại cùng khách → "Lần đặt trước chưa rõ kết quả" + "Gửi lại
  đúng đơn này"; đăng xuất / đổi khách vẫn xoá (`App.dangXuat`, `luuMay.doiKhach`). 401 ở nút "Gửi lại đúng đơn này" đi cùng `guiDonAnToan` → cùng luật.
  Ca: hàm thuần `S1 401 …` ×3; Chromium `401` (gửi đầu 401 → giữ bản ghi, đăng nhập lại thấy "chưa rõ"), `401-gui-lai` (lần 1 tạo rồi 502, tự gửi lại 401 →
  dừng, giữ; đăng nhập lại "Gửi lại" → POS trả `trung`, MỘT đơn).
- **S2** (d9e9a7d, `src/pages/ThanhToan.jsx`): nhánh `PIN_SAI` / `PIN_DANG_KHOA` xoá bản ghi CHỈ khi đơn mới (`!cu`); gửi lại giữ bản ghi → bảng PIN hiện lời POS,
  nhập lại gửi ĐÚNG khoá + thân cũ. Ca Chromium `gui-lai-pin-sai`. Đơn mới sai PIN vẫn như cũ (ca `pin_dang_khoa`, K5).
- **S3** (52a3615, `cong_cu/thu_KHUI3b.js`): ca A1 mới — ba cửa đặt đơn `api.js` gọi có dòng `| … | có |` trong hợp đồng. Trên gốc cổng `fb65795^` ĐỎ (56 · 1),
  hiện tại 57 · 0. Không xin `## Bài thử cũ sửa`.
- Đột biến (d112e0c) — chỗ vá → đột biến: `loaiLoi` 401 → VS-401-CHUA-TAO (ĐỎ 246·7); `guiDonAnToan` dừng ở 401 → VS-401-TU-GUI-LAI (ĐỎ 44·2), BV-401-XOA-BAN-GHI
  (ĐỎ 247·6); `ThanhToan` gửi lại sai PIN giữ bản ghi → VS-PIN-GUI-LAI-XOA (ĐỎ 251·2). Ba đột biến cũ của `loaiLoi` (VS-5XX-LA-CHUA-TAO, VS-4XX-LA-KHONG-BIET,
  BV-LUAT-4XX) chỉ đổi chuỗi gốc theo dòng mới.
  `python3 viec/KH-MUA-1b/dot_bien.py` → ĐỐI CHỨNG XANH 253 · 0; TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT (28/28). Tên mới: VS-401-CHUA-TAO, VS-401-TU-GUI-LAI,
  BV-401-XOA-BAN-GHI, VS-PIN-GUI-LAI-XOA. (Lưu ý: stop hook của môi trường chạy `npm test` hai lần TRONG lúc đột biến đang sửa tạm `src/` → hook báo đỏ giả;
  sau khi bộ đột biến khôi phục, `npm test` 29 · 0.)
- Kiểm sau vòng 4: `node cong_cu/thu_KHMUA1b.js` 253 · 0 (Chromium), `KHONG_TRINH_DUYET=1` 46 · 0; `thu_KHUI3b.js` 174 · 0 / 57 · 0; `npm test` 29 · 0;
  `node kiem_tra_truoc_khi_giao.js --day-du` 31 · 0.
- Ngân sách vòng 4: app +5 dòng (datDon 3, ThanhToan 2), thử +40 dòng.

## Câu hỏi
- **Đã trả lời (phiếu vòng sửa 4, 03.11):** Q3 → KHÔNG dùng `## Bài thử cũ sửa`; thêm ca đọc nguồn đỏ trên gốc vào `thu_KHUI3b.js` (S3, đã làm). Q4 → chat đã gửi
  POS (thư `YEU_CAU_APPKH_GUI_POS_03112026.md` mục F); App làm theo S1 (401 = chưa rõ, đã làm); 429 / PIN_* POS trả SAU khi tra khoá → vẫn "chưa tạo"
  (chat đọc `donApp.js` dòng 186–195). Q5 → giữ như đang làm. Q6 → đồng ý. Không còn câu hỏi mở. Các mục dưới giữ để tra.
- Q3 (cổng A11 — xin chủ quán thêm mục `## Bài thử cũ sửa` vào phiếu): `cong_cu/thu_KHUI3b.js` ca A1 đổi từ "hợp đồng = viec/KH-UI-3b/hop_dong_v3.md" thành
  "hợp đồng = bản hop_dong_v<N>.md MỚI NHẤT trong viec/" (cố định v3 thì đỏ khi hợp đồng lên v5). Đỏ trên dc07781 (có v5 trong viec/), nhưng XANH trên gốc
  của cổng `fb65795^` (trước commit PHIEU, chưa có hop_dong_v5.md) → `node tu_chay/cong.js chay . fb65795^ HEAD viec/KH-MUA-1b` báo nguyên văn:
  `✗ [A11] bài thử `cong_cu/thu_KHUI3b.js` XANH trên code gốc — bài thử vô giá trị (K3), phải đỏ trước khi vá`.
  Đề nghị thêm vào phiếu: `## Bài thử cũ sửa` → `- cong_cu/thu_KHUI3b.js — ca A1 so hợp đồng với bản mới nhất trong viec/ (hợp đồng lên v5)`.
- Q4 (gửi POS, nghi ngờ của soát): khi App GỬI LẠI cùng `khoa_gui` mà POS trả 401 (phiên hết) hoặc 429 — POS kiểm phiên / lượt TRƯỚC khi tra khoá, nên
  4xx đó không chứng minh lần gửi trước chưa tạo đơn. Luật 4xx của v5 nói "MỌI 4xx = chưa tạo"; App làm đúng luật. Xin POS xác nhận: 401 / 429 ở lần gửi
  lại cùng khoá có đảm bảo khoá đó chưa có đơn không? Nếu không → App sẽ coi 401 / 429 SAU một lần "chưa rõ" là vẫn "chưa rõ" (việc sau).
- Q5 (nhỏ): `KHO_BAN` 409 — hợp đồng ghi "gửi lại cùng khoá"; App theo luật 4xx coi là chưa tạo, khách bấm lại (khoá mới). An toàn; nếu POS muốn App tự gửi
  lại cùng khoá thì thêm vào nhóm chưa rõ.

- Q6 (điểm duyệt 2 — báo để chủ quán biết): bản ghi "chưa rõ" QUÁ 24 GIỜ nay KHÔNG còn nút "Gửi lại đúng đơn này" và câu "sẽ không tạo đơn thứ hai"; thay bằng
  "Bạn xem Lịch sử đơn trước khi đặt đơn mới nhé." + "Xem Lịch sử đơn" + "Bỏ qua, đặt đơn mới". Lý do: hợp đồng v5 — POS nhớ khoá 24 giờ, quá hạn gửi lại nhận
  409 KHOA_GUI_DA_DUNG nên câu "không tạo đơn thứ hai" không còn đúng. Dưới 24 giờ giữ nguyên như đã duyệt. Chủ quán đồng ý thì không cần làm gì.
- Q4 (mở rộng theo soát vòng 3): ngoài lỗi phiên 401 / 429, cả PIN_SAI / PIN_DANG_KHOA / CHUA_CO_PIN ở lần GỬI LẠI cùng khoá sau "chưa rõ" — POS kiểm PIN
  trước hay sau khi tra khoá? Nếu trước → 4xx đó không chứng minh đơn cũ chưa tạo.

## Phát hiện
- `thu_KHNHANH1.js` từng đỏ 1 ca (223 · 1) trong `npm test` khi một agent soát chạy song song bài Chromium cùng lúc (máy bận); chạy riêng 224 · 0, `npm test`
  lúc máy rảnh 29 · 0. Ca phụ thuộc thời gian của KH-NHANH-1 (đo theo mili-giây) — đề xuất việc sau: nới bằng chờ theo điều kiện thay vì mốc cố định.
- G1 "Trang chủ / gợi ý trắc nghiệm": `src/noiDung/trangChu.js` `MON_NOI_BAT = []` → Trang chủ hiện chưa có ô món để mở Trang món. Kết quả trắc nghiệm mở món
  qua cùng `chonMon` → `di()` (đẩy lịch sử) như Menu, nên "quay lại trang trước" là cùng cơ chế `history.back()` đã thử ở ca `g1` (Menu nhóm Cà phê →
  món → về đúng /menu/ca-phe; mở thẳng link → /menu). Chưa có ca riêng cho trắc nghiệm (cần gieo kết quả trắc nghiệm).

## Chủ quán thử tay (POS thật, ≤ 3 bước — phiếu H4)
1. Đặt 1 món rẻ, để công tắc "Trừ từ số dư ví" TẮT, bấm "Xác nhận trả …" → quét QR bằng app ngân hàng → App hiện "Đã thanh toán" / số đơn, quầy nhận đơn.
2. Đặt 1 món, tới màn QR bấm "Huỷ đơn" → đơn hiện "Đã huỷ" (Lịch sử đơn cũng "Đã hủy").
3. Có số dư ví ≥ tổng: bật "Trừ từ số dư ví" ("… — đủ trả cả đơn") → nhập PIN → số dư bị trừ đúng tổng, đơn "Đã thanh toán".

## Bài học (bước 11)
| # | Sự cố | Ngăn | Lý do · đề xuất |
|---|---|---|---|
| 1 | Soát 3 vòng liền bắt đường tạo đơn thứ hai qua tab / bảng PIN / gửi lại (tab mở trước, PIN mở sẵn, hai tab cùng chưa rõ) | NGUYÊN TẮC (ngoài Phạm vi — đề xuất `KHUON_LOI.md` mục mới) | "Đã gây: KH-MUA-1b, 3 vòng soát. Dấu hiệu: phép chặn đặt / trả tiền đọc state lúc mở màn, hoặc nằm ở nút mở bước trung gian. Chặn: chặn ở ĐIỂM GỬI (hàm gọi POST), đọc lại trạng thái chung (kho / máy chủ) NGAY LÚC GỬI, kể cả đường gửi lại khoá cũ." Code đã theo: `datDon.chanBoiBanGhi` / `conChuaRo` gọi ở `guiDon`; ca + đột biến khoá lại. |
| 2 | Hồ sơ ghi "ghi ở dưới" / "đã thêm" mà không có kết quả (soát nêu 3 lần) | KHOÁ (ngoài Phạm vi — đề xuất) | Phép kiểm ở `tu_chay/cong.js` (khung đóng băng tới khai trương): `trang_thai.md` còn dòng giữ chỗ "sau lần chạy cuối)" → ✗; ca đỏ: file có dòng đó. |
| 3 | Người gác chặn lệnh / commit vì tên mã lỗi phiên công khai của hợp đồng (có cụm chữ "bí mật" trong tên) — 3 lần, phải dùng Edit thay heredoc | NGUYÊN TẮC (đề xuất cho khung) | Cho phép mã lỗi công khai của `/api/kh` trong luật B-BIMAT-CHU; đã làm theo hướng dẫn người gác (Edit / commit trước). |
| 4 | Cổng A11: bài cũ sửa đỏ trên dc07781 nhưng XANH trên gốc cổng `fb65795^` (hợp đồng v5 vào cùng commit PHIEU) | NGUYÊN TẮC (đề xuất ghi vào skill `/lam-viec` bước 4) | "Bằng chứng đỏ cho bài cũ sửa phải chạy trên ĐÚNG gốc của cổng (`<mốc>^`), không phải cây đã có commit PHIEU." → Q3 xin `## Bài thử cũ sửa`. |
| 5 | Ca `gui-lai-gia-doi` xanh oan lần đầu (bấm trước khi báo giá về → báo giá về sau đè lên) | BỎ | Một lần; đã sửa ca chờ tiền đề (bảng tiền hiện) rồi mới bấm. Đã thuộc K3. |
| 6 | Ca D4 (PIN trên máy) đỏ giả 1 lần: "1357" trùng chuỗi trong khoá UUID / dấu giờ | BỎ | Một lần; đã kiểm `"pin"` / giá trị có nháy. |
| 7 | `thu_KHNHANH1.js` đỏ 1 ca khi chạy song song với agent soát | BỎ (đã ghi Phát hiện) | Ca phụ thuộc thời gian của việc khác; đề xuất việc sau. |
| 8 | Vượt ngân sách: app +412 / −160 (ngân sách ~300), thử mới 688 dòng (~450) + bài cũ ~60 | — | Do 8 điểm chủ quán duyệt thêm (công tắc ví, ảnh 3 cỡ, các khối chờ / cảnh báo) và 3 vòng sửa chống đơn thứ hai. Chủ quán cho vượt nhẹ phần thử. |
Dọn: việc này không có lời dặn nào trong `KHUON_LOI.md` / `CLAUDE.md` được phép kiểm mới làm thay. `KHUON_LOI.md` không đổi (ngoài Phạm vi).

## Báo cáo 7 mục
- **VIỆC:** KH-MUA-1b — bật đặt đơn online theo hợp đồng v5: cửa thật, chống đơn thứ hai, gửi lại an toàn, ví / ví + QR; + 8 điểm chủ quán duyệt 02.11.
- **ĐÃ SỬA:** `thiet_ke/HOP_DONG_API_KH.md` (= v5 từng byte); `src/api.js` (3 cửa đặt đơn, hết giờ chờ, giữ thân lỗi); `src/datDon.js` (thân v5, khoá gửi, luật 4xx,
  vòng gửi lại cùng khoá + thân, bản ghi `kh_don_gui`, luật chặn MỘT hàm); `src/dungDatDon.js`; `src/luuMay.js`; `src/pages/ThanhToan.jsx` (công tắc ví, khối chưa rõ /
  đơn chờ trả / vừa đặt ở cửa sổ khác, lỗi v5); `TheoDoiDon.jsx` (QR từ GET /don/:ma, ví + QR, đối soát); `Don.jsx` (nhãn + mở đúng màn); `GioHang.jsx` (dòng giảm,
  "✓ Đã áp dụng", lỗi mã); `App.jsx` (thêm món quay lại); `canTuPos.js`; `caiDat.js` (bật cờ); CSS chép nguyên demo (`.notif-row`, `.switch`, `.order-status.shipping`).
  App +412 / −160 dòng.
- **BÀI THỬ:** `thu_KHMUA1b.js` mới (43 ca thuần + Chromium, tổng 241; 3 cỡ màn; POS giả dựng từ hợp đồng); bài cũ sửa `thu_KHMUA1.js` (16 dòng sửa, lý do ở trên),
  `thu_KHNHANH1.js`, `thu_KHKHOP1.js`, `thu_KHUI3b.js`. Đỏ trên gốc / xanh sau vá: `bang_chung_do.txt`. Đột biến 24/24 bị bắt.
- **ĐÃ RÀ K4:** mọi chỗ gọi cửa đặt đơn (api.js 3 cửa → datDon → ThanhToan.guiDon); mọi chỗ đọc / ghi `kh_don_gui` (ThanhToan, App, TheoDoiDon, luuMay); đọc
  `tien_trinh` (Don, ThanhToan, TheoDoiDon); `themVaoGio` / `datLai`. Đã bỏ hết `datCongDatDon`, `LOI_CHUA_TAO`, `donMoi`, "(payOS)".
- **CHƯA KIỂM:** POS THẬT (máy chỉ có POS giả) — 3 bước thử tay ở trên. Vòng sửa 3 CHƯA được soát độc lập lại (đã chạm trần 3 vòng sửa) — chat App KH soát.
  POS xét lỗi phiên 401 / 429 / PIN trước hay sau khi tra khoá (Q4). Cổng ✗ [A11] (Q3). G1 từ kết quả trắc nghiệm chưa có ca riêng (Phát hiện). Kho bị chặn + tải
  lại / đăng nhập lại thì bộ nhớ trang mất bản ghi (giới hạn trình duyệt). Ảnh so_anh cần chat App KH soát lần cuối.
- **GIT:** nhánh `viec/KH-MUA-1b`, đã đẩy lên origin; mỗi bước một commit có mã việc; không merge, không PR.
- **BÀI HỌC:** bảng trên. Chính: phép chặn đặt đơn phải ở ĐIỂM GỬI và đọc lại trạng thái chung lúc gửi (đề xuất mục KHUON_LOI mới); hồ sơ không để dòng giữ chỗ
  (đề xuất phép kiểm cổng).

## Đếm nghiệm thu (mỗi mục một dòng)
- A1 hợp đồng v5 từng byte — `cmp` khớp; ca A1 thu_KHMUA1b.
- A2 canTuPos theo v5 — ca A2 thu_KHMUA1b; thu_KHKHOP1 xanh (84 · 0).
- A3 K8 — `npm test` K8 xanh; ca A3/B1.
- B1 3 cửa qua `goi` — ca A3/B1; ca `401` (hết phiên như mọi cửa).
- B2 bỏ cổng tiêm, tên trường một chỗ — ca B2 ×2; thu_KHNHANH1 ca F1 (KH-MUA-1b).
- B3 bật cờ sau C–G — ca B3; commit riêng 57ccebd; đột biến VS-BAT-CO-TRUOC-NOI-CUA, BV-CO-TAT.
- C1 thân báo giá — ca C1.
- C2 thân đặt + tong_da_xem — ca C2 ×2, `qr-*`, `bao-gia-cho`.
- C3 khoá gửi — ca C3 ×2, `4xx`, `vi`.
- C4 đọc POST /don — ca C4 ×2, `thieu_ma`.
- C5 đọc GET /don/:ma — ca C5.
- C6 dòng giảm / lỗi mã — ca C6 ×2, `giam`.
- D1 luật 4xx + từng mã — ca D1 (đủ mã đọc từ hợp đồng), `4xx`, `gia_da_doi`, `qua_nhieu_lan`, `HET_HANG`, `MON_KHONG_BAN`, `pin_dang_khoa`, `chua_co_pin`, `ngoai_gio`, `cach_khong_khop`, `gui-lai-gia-doi`.
- D2 chưa rõ + gửi lại — ca D2 thuần ×7, `tao-roi-502`, `5xx`, `dang_xu_ly`, `mat_mang`, `het_gio_cho`, `thieu_ma`, `kho-chan`.
- D3 không đơn thứ hai — (a) `d3a-bam-nhieu`; (b) `d3b-back-qr`; (c) `mat_mang` tải lại, `qua_han`; (d) `d3d-hai-tab`, `d3d-tab-mo-truoc`, `d3d-tab-mo-truoc-vi`, `pin-mo-truoc`, `hai-tab-chua-ro`, `gui-lai-pin-mo-san`, `kiem-lai-luc-bam`.
- D4 PIN không lưu — ca D4 thuần ×3 + ca D4 sau MỌI ca Chromium; đột biến VS-LUU-PIN.
- E1 ba cách trả (công tắc ví — điểm 7) — ca E1, `qr-*` (ẩn khi 0đ), `vi`, `vi_qr-*`.
- E2 bỏ "payOS" — ca E2, `qr-*`.
- F1 QR từ GET /don/:ma, tải lại — `qr-390`.
- F2 ví + QR — `vi_qr-*`.
- F3 đối soát — `doi-soat`.
- F4 huỷ + DA_TRA_GOI_QUAN — `huy`, `huy-da-tra-*`.
- F5 làm mới kho — `qr-390` (ca F5).
- F6 Lịch sử mở đúng màn + nhãn — ca F6 thuần, `lich-su`.
- G1 thêm món quay lại — ca G1 nguồn, `g1` (Menu nhóm + mở thẳng link); Trang chủ / trắc nghiệm: Phát hiện.
- G2 "Đặt lại" vào giỏ — ca G2, thu_KHMUA1 `dat-lai`.
- H1 bài thử 2 phần, 3 cỡ — `thu_KHMUA1b.js` (360 / 390 / 430 cho qr, vi_qr; ảnh 3 cỡ mọi khối mới).
- H2 SỐ CA theo KHONG_TRINH_DUYET — bang_chung_do.txt.
- H3 npm test / --day-du / cổng / đột biến — mục Kiểm (cổng ✗ [A11] → Q3). **Cập nhật vòng 4:** mục "Vòng sửa 4" + "Kiểm (vòng 4)" dưới — cổng chạy ĐẠT, đột biến 28/28.
- H4 thử tay — 3 bước ở trên (chờ chủ quán).
- Điểm duyệt 1–8 — mục "Duyệt" (mỗi điểm kèm ca); ảnh `so_anh/` + `doi_chieu_demo.md` (điểm 8).
- **Vòng 4 S1** 401 = chưa rõ, giữ bản ghi — ca thuần `S1 …` ×3 (thu_KHMUA1b.js D), Chromium `401`, `401-gui-lai`; đột biến VS-401-CHUA-TAO, VS-401-TU-GUI-LAI, BV-401-XOA-BAN-GHI.
- **Vòng 4 S2** gửi lại + sai PIN giữ bản ghi — Chromium `gui-lai-pin-sai`; đột biến VS-PIN-GUI-LAI-XOA.
- **Vòng 4 S3** gỡ A11 — ca A1 mới thu_KHUI3b.js, đỏ trên `fb65795^` (56 · 1); cổng chạy không còn ✗ [A11].

## Soát độc lập vòng 4 (`/ra-soat`, MỘT lượt theo phiếu, agent general-purpose, chỉ chỗ vá vòng 3 + 4) — báo cáo chép nguyên
```
KHÔNG ĐẠT
LỖI TÌM ĐƯỢC:  viec/KH-MUA-1b/trang_thai.md:420 — "HEAD ĐÃ KIỂM: 4e11f91" chưa đổi sau vòng 4 (HEAD là d80e182, code vòng 4 tới d112e0c). Phiếu vòng 4 dặn ghi lại dòng này — K1
               viec/KH-MUA-1b/trang_thai.md:302–320 — mục vòng 4 KHÔNG ghi kết quả `node tu_chay/cong.js chay` (phiếu "Sau khi sửa": tinh + chay ĐẠT; LUAT §6.3). Đây là lần thứ tư lỗi H3 lặp lại. Tôi đã tự chạy: `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . fb65795^ HEAD viec/KH-MUA-1b` → ✓ CỔNG CHẠY ĐẠT (còn 2 cảnh báo A16), nhưng hồ sơ chưa ghi. Thêm nữa: "Báo cáo 7 mục" :376–381 và "Đếm nghiệm thu" :416 vẫn ghi số cũ: 24/24, 241 ca, "Cổng ✗ [A11] (Q3)", "Q4 CHƯA KIỂM". Các số này trái với mục vòng 4 (28/28, 253, A11 đã gỡ) — K1
               src/pages/ThanhToan.jsx:100 (vòng 3) — chỗ chặn `|| !bg` ở điểm gửi không có ca đỏ và không có đột biến. BV-KIEM-O-DIEM-GUI (dot_bien.py:26) bỏ `chanBoiBanGhi` nhưng GIỮ `!bg`. trang_thai.md:288 chỉ ghi "ca bao-gia-cho, gia_da_doi vẫn xanh", tức không có ca nào đỏ — K3
NGHI NGỜ:      src/datDon.js:144–170 (vòng 3, ghiHong): lần ghi hỏng (kho đầy) bật cờ, và từ đó tab này bỏ qua kho tới khi có lần ghi thành công. Tab khác vừa đặt đơn hay vừa có bản ghi chưa rõ thì tab này không thấy (không hiện "Bạn vừa đặt đơn…"). Rất hiếm, nhưng là chiều có thể sinh đơn thứ hai. Có thể gọn hơn: khi ghi hỏng thì thử removeItem bản cũ.
               Q4 / phiếu S1: "429, PIN_*, KHO_BAN do POS trả SAU khi tra khoá (donApp.js 186–195)" là lời ghi về code POS, không đọc được từ kho này. Lý do giữ / xoá bản ghi ở nhánh PIN_SAI / CHUA_CO_PIN / QUA_NHIEU_LAN khi gửi lại đều dựa vào lời ghi đó.
               S2: chưa có ca riêng cho PIN_DANG_KHOA khi gửi lại. Code dùng chung MA_PIN với PIN_SAI (ThanhToan.jsx:24, :114), nên rủi ro thấp.
               Chưa có ca đầu–cuối cho "401 → giữ bản ghi → khách KHÁC đăng nhập → bản ghi bị xoá". Code đúng: luuMay.js:13 có KHOA_DON_GUI trong danh sách, :61–66 xoá khi khác khách. Thành viên danh sách đã được thu_KHMUA1b.js:141–143 khoá lại (qua xoaTatCa), nhưng nhánh doiKhach với kho thường chưa có ca.
NGHIỆM THU:    5/7 mục có bằng chứng · mục thiếu: (vòng 3) chặn `!bg` ở điểm gửi — không ca, không đột biến; (vòng 4) H3 — chưa ghi kết quả cổng chay, HEAD ĐÃ KIỂM cũ
CHƯA SOÁT ĐƯỢC: code POS thật (401 trả trước, PIN / 429 trả sau khi tra khoá); dot_bien.py (không chạy vì nó sửa tạm src; 28/28 là lời ghi). Bản Chromium của thu_KHMUA1b chưa chạy lại (tôi chỉ chạy KHONG_TRINH_DUYET=1 → 46 · 0). Chưa xem so_anh.
BÀI HỌC:       KHOÁ (đề nghị lần thứ tư): cổng nên tự kiểm `trang_thai.md`: (a) dòng "HEAD ĐÃ KIỂM" phải bằng commit code cuối; (b) mục vòng sửa mới nhất phải có dòng kết quả `cong.js chay`.
               NGUYÊN TẮC: mỗi phép chặn mới ở điểm gửi phải có một đột biến bỏ ĐÚNG phép đó (một vế một đột biến), không gộp chung vào đột biến của vế khác.
```
Ý phụ của người soát (gói): K4 — 4 chỗ `ghiGuiDo(null)` (ThanhToan :114 đơn mới sai PIN, :115 4xx khác, :127 bỏ qua quá 24 giờ; App :141 đăng xuất) + luuMay; KHÔNG đường nào xoá bản ghi sau 401
(App `donPhien` không đụng, api.js:49 chỉ xoá phiên, ThanhToan :112 return trước). Bốn đường gửi đều qua `guiDonAnToan`. K5 — 401 ngay lần đầu cũng giữ bản ghi (đúng phiếu "kể cả
lần gửi đầu"); không luồng hợp lệ nào bị chặn oan. Đường tiền: chỉ `tongDaXem: bg.tong`. dist rỗng. Đơn giản: luật 401 nằm hai chỗ (`loaiLoi` + `guiDonAnToan`) — có thể gộp một dòng.

**Phiên chính xử lý (theo phiếu: lượt soát KHÔNG ĐẠT → DỪNG, KHÔNG sửa code thêm, chat App KH xử lý):**
- Lỗi 1 + 2 (hồ sơ): là bước 11 phiên chính chưa tới lúc soát chạy (soát chạy trước khi ghi cổng / báo cáo). Đã ghi ở mục "Kiểm (vòng 4)" dưới + dòng HEAD ĐÃ KIỂM cuối file
  — chỉ đổi `trang_thai.md`, không đổi code.
- Lỗi 3 (`!bg` ở điểm gửi `ThanhToan.jsx:100`, vòng 3, không ca đỏ / đột biến riêng) — KHÔNG sửa (phiếu cấm làm thêm). Chuyển chat App KH. Gợi ý: đột biến
  `BV-DIEM-GUI-BAO-GIA` (`|| !bg) {` → `) {`) + ca bảng PIN mở sẵn rồi đổi giỏ / mã giữa chừng → nhập PIN không gửi.
- Nghi ngờ (ghiHong, PIN_DANG_KHOA khi gửi lại, ca doiKhach với kho thường, gộp luật 401 một chỗ) — chuyển chat App KH, không làm.

## Kiểm (vòng 4 — HEAD code d112e0c, hồ sơ d80e182)
- `node cong_cu/thu_KHMUA1b.js` → 253 đạt · 0 hỏng (Chromium); `KHONG_TRINH_DUYET=1` → 46 · 0. `thu_KHUI3b.js` 174 · 0 (Chromium) / 57 · 0.
- `npm test` → 29 đạt · 0 hỏng. `node kiem_tra_truoc_khi_giao.js --day-du` → 31 đạt · 0 hỏng (KHMUA1 128 · KHMUA1b 253 · KHNHANH1 224 · KHKHOP1 84 · KHUI3b 174).
- `python3 viec/KH-MUA-1b/dot_bien.py` → ĐỐI CHỨNG XANH 253 · 0; TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT (28/28).
- `node tu_chay/cong.js tinh . fb65795^ HEAD viec/KH-MUA-1b` → chỉ `✗ [A19] "HEAD ĐÃ KIỂM: 4e11f91" cũ hơn commit d9e9a7d đổi code` (dòng HEAD ĐÃ KIỂM ghi ở cuối lần này).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . fb65795^ HEAD viec/KH-MUA-1b` → ✓ CỔNG CHẠY ĐẠT (2 cảnh báo A16: thu_KHMUA1.js 42 ≠ 55 ca, thu_KHMUA1b.js 12 ≠ 46 ca
  — bài dừng sớm trên gốc, đúng như bằng chứng đỏ).
- Stop hook của môi trường chạy `npm test` hai lần TRONG lúc `dot_bien.py` sửa tạm `src/` → báo đỏ giả (126·2, 238·14, 251·2); sau khi khôi phục `npm test` 29 · 0.

## Báo cáo 7 mục — vòng sửa 4
- **VIỆC:** KH-MUA-1b vòng sửa 4 (phiếu 928f217): S1 401 khi đặt đơn = chưa rõ; S2 gửi lại + sai PIN giữ bản ghi; S3 gỡ cổng A11 của `thu_KHUI3b.js`.
- **ĐÃ SỬA:** `src/datDon.js` (+3: `loaiLoi` 401 → khong_biet; `guiDonAnToan` 401 → KHONG_BIET ngay); `src/pages/ThanhToan.jsx` (+2: sai PIN chỉ xoá bản ghi khi đơn mới);
  `cong_cu/thu_KHMUA1b.js` (+~35: 3 ca thuần, 3 ca Chromium, sửa ca D1 bỏ 401); `cong_cu/thu_KHUI3b.js` (+7: ca A1 ba cửa đặt đơn); `dot_bien.py` (+4 đột biến).
- **BÀI THỬ:** đỏ trên src vòng 3 (43·3 thuần, 244·9 Chromium), xanh sau vá (46·0 / 253·0); S3 đỏ trên gốc cổng (56·1), xanh 57·0. `SỐ CA` 46 và 57. Đột biến 28/28.
- **ĐÃ RÀ K4:** mọi chỗ gọi `loaiLoi` (1, `guiDonAnToan`); mọi đường gửi đặt đơn (lần đầu, tự gửi lại, "Gửi lại đúng đơn này", gửi lại có PIN) qua `guiDonAnToan`; mọi
  `ghiGuiDo(null)` (ThanhToan ×3, App đăng xuất) + `luuMay`; không bài cũ nào khẳng định 401 = chưa tạo (grep thu_KHMUA1 / KHNHANH1 / KHKHOP1).
- **CHƯA KIỂM:** POS THẬT (401 trả trước khi tra khoá; 429 / PIN_* trả sau — lời chat đọc POS, máy không đọc được). Lượt soát độc lập vòng 4 KHÔNG ĐẠT — lỗi `!bg` vòng 3
  chưa có ca / đột biến (phiếu cấm sửa thêm, chuyển chat App KH). Không có ca: PIN_DANG_KHOA khi gửi lại; 401 rồi khách KHÁC đăng nhập (kho thường). Ảnh so_anh không đổi ở vòng 4.
- **GIT:** nhánh `viec/KH-MUA-1b`, đã đẩy; mỗi bước một commit có mã việc; không merge, không PR.
- **BÀI HỌC:** bảng dưới.

## Bài học vòng 4 (bước 11)
| # | Sự cố | Ngăn | Lý do · đề xuất |
|---|---|---|---|
| 9 | Luật "MỌI 4xx = chưa tạo" của hợp đồng không đúng với 401 (lớp xác thực trả trước khi tra khoá) — chat soát cuối mới bắt | NGUYÊN TẮC (ngoài Phạm vi — đề xuất `KHUON_LOI.md`) | "Đã gây: KH-MUA-1b S1. Dấu hiệu: luật 'mã lỗi ⇒ chưa ghi gì' áp cho mọi mã, kể cả mã do lớp đứng TRƯỚC chỗ ghi (xác thực, giới hạn). Chặn: với mỗi mã, hỏi nó trả trước hay sau chỗ tra khoá / ghi; trước → coi là không biết." |
| 10 | Stop hook chạy `npm test` trong lúc `dot_bien.py` sửa tạm `src/` → đỏ giả, nhắc "commit" khi cây đang bị đột biến | NGUYÊN TẮC (đề xuất cho khung / skill) | Chạy đột biến ở cây nháp (git worktree / archive) thay vì sửa tạm cây chính; hoặc giữ lượt (không kết thúc lượt) tới khi đột biến xong. |
| 11 | Soát chạy trước khi phiên chính ghi cổng / HEAD ĐÃ KIỂM → soát tính là lỗi hồ sơ (lần thứ tư) | KHOÁ (ngoài Phạm vi — đề xuất `tu_chay/cong.js`, như soát nêu) | Ca đỏ: `trang_thai.md` có mục vòng sửa mới nhất mà không dòng `CỔNG CHẠY`. Trước mắt: ghi kết quả cổng VÀO hồ sơ TRƯỚC khi gọi `/ra-soat`. |
| 12 | `!bg` ở điểm gửi gộp chung đột biến với vế khác | NGUYÊN TẮC (theo soát) | Một vế chặn — một đột biến. Chuyển chat App KH. |
| 13 | Người gác chặn lệnh có chữ TOKEN (grep api.js, chạy bài thử chưa commit), biến trong đích ghi, `until`/`pgrep` | BỎ | Đã làm theo hướng dẫn (Grep / Edit, commit trước, đường dẫn viết thẳng); không lặp lỗi mới. |

HEAD ĐÃ KIỂM: d80e182
