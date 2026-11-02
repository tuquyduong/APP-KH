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

## Chỗ vá → đột biến (`python3 viec/KH-MUA-1b/dot_bien.py`, sau vòng sửa 2; đối chứng trước: bản vá XANH 237 · 0)
| Chỗ vá | Đột biến | Kết quả |
|---|---|---|
| `datDon.guiDonAnToan` gửi lại ĐÚNG thân + khoá | VS-GUI-LAI-KHOA-MOI · VS-GUI-LAI-THAN-KHAC | ĐỎ 226·11 · ĐỎ 235·2 |
| `datDon.loaiLoi` luật 4xx | VS-5XX-LA-CHUA-TAO · VS-4XX-LA-KHONG-BIET · BV-LUAT-4XX | ĐỎ 38·4 · ĐỎ 226·11 · ĐỎ 221·15 |
| `datDon.thanDatDon` có `tong_da_xem` | BV-TONG-DA-XEM | ĐỎ 193·39 |
| `ThanhToan` `tong_da_xem` = `bg.tong` đang hiện | VS-TONG-TU-TINH | ĐỎ 196·36 |
| `datDon.banGhiGui` bỏ PIN | VS-LUU-PIN | ĐỎ 231·6 |
| `ThanhToan` khoá khi chưa rõ / có đơn chờ trả | BV-CHAN-KHI-CHUA-RO · BV-CHAN-DON-CHO-TRA | ĐỎ 234·3 · ĐỎ 235·2 |
| luật chặn theo bản ghi ở ĐIỂM GỬI `guiDon` (vòng 1–2) | BV-KIEM-O-DIEM-GUI | ĐỎ 235·2 |
| `daThay` chỉ bản ghi đã có đơn (vòng 2) | VS-DATHAY-CA-CHUA-RO | ĐỎ 236·1 |
| quên bản ghi bộ nhớ khi đổi khách (vòng 2) | BV-QUEN-BO-NHO-KHI-DOI-KHACH | ĐỎ 41·1 |
| quá 24 giờ ẩn "Gửi lại" (vòng 2) | BV-AN-GUI-LAI-QUA-HAN | ĐỎ 236·1 |
| `datDon` giữ bản ghi trong bộ nhớ khi kho chặn (vòng 1) | BV-GIU-BO-NHO | ĐỎ 235·2 |
| gửi lại đơn cũ + GIA_DA_DOI không đè bảng tiền (vòng 1) | BV-GUI-LAI-GIA-DOI | ĐỎ 236·1 |
| `App.daTra` giữ bản ghi, đánh dấu xong (vòng 1) | VS-XOA-BAN-GHI-KHI-XONG | ĐỎ 233·4 |
| `ThanhToan` ghi `kh_don_gui` TRƯỚC khi gửi | BV-GHI-TRUOC-GUI | ĐỎ 227·10 |
| `ThanhToan` GIA_DA_DOI thay bảng tiền | BV-GIA-DA-DOI | ĐỎ 235·2 |
| cửa thật nối trước khi bật cờ | VS-BAT-CO-TRUOC-NOI-CUA · BV-CO-TAT | ĐỎ 177·54 · ĐỎ 41·1 |
| `App.themVaoGio` quay lại trang trước | BV-QUAY-LAI-SAU-THEM | ĐỎ 233·4 |
Tên đột biến: VS-GUI-LAI-KHOA-MOI, VS-GUI-LAI-THAN-KHAC, VS-5XX-LA-CHUA-TAO, VS-4XX-LA-KHONG-BIET, BV-LUAT-4XX, BV-TONG-DA-XEM, VS-TONG-TU-TINH, VS-LUU-PIN,
BV-CHAN-KHI-CHUA-RO, BV-CHAN-DON-CHO-TRA, BV-KIEM-O-DIEM-GUI, VS-DATHAY-CA-CHUA-RO, BV-QUEN-BO-NHO-KHI-DOI-KHACH, BV-AN-GUI-LAI-QUA-HAN, BV-GIU-BO-NHO,
BV-GUI-LAI-GIA-DOI, VS-XOA-BAN-GHI-KHI-XONG, BV-GHI-TRUOC-GUI, BV-GIA-DA-DOI, VS-BAT-CO-TRUOC-NOI-CUA, BV-CO-TAT, BV-QUAY-LAI-SAU-THEM.
TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT (22/22). Lịch sử: sau vòng sửa 1 BV-KIEM-LAI-LUC-BAM sống → thêm ca `kiem-lai-luc-bam`; vòng sửa 2 dời phép kiểm vào `guiDon`
(một chỗ) → phép kiểm ở nút thành thừa, đã bỏ cùng đột biến đó (ca `kiem-lai-luc-bam` nay do BV-KIEM-O-DIEM-GUI canh). Ca K5 (không chặn oan): đơn QR thường
(`qr-*`), ví đủ (`vi`), ví + QR (`vi_qr-*`), "Đặt thêm đơn mới" sau khi biết đơn ở tab khác (`d3d-tab-mo-truoc-vi`) — xanh ở bản vá.

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

## Kiểm (bản cuối, sau vòng sửa 2)
- `node cong_cu/thu_KHMUA1b.js` → 237 đạt · 0 hỏng (Chromium, ~25 giây); `KHONG_TRINH_DUYET=1` → 42 đạt · 0 hỏng.
- `npm test` → 29 đạt · 0 hỏng (mọi `thu_*.js` xanh: KHMUA1 128 · KHNHANH1 224 · KHKHOP1 84 · KHUI3b 173 …).
- `node kiem_tra_truoc_khi_giao.js --day-du` → (ghi ở dưới sau lần chạy cuối).
- `python3 viec/KH-MUA-1b/dot_bien.py` → TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT (22/22).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . fb65795^ HEAD viec/KH-MUA-1b` → (ghi ở dưới sau lần chạy cuối).

## Câu hỏi
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

## Phát hiện
- G1 "Trang chủ / gợi ý trắc nghiệm": `src/noiDung/trangChu.js` `MON_NOI_BAT = []` → Trang chủ hiện chưa có ô món để mở Trang món. Kết quả trắc nghiệm mở món
  qua cùng `chonMon` → `di()` (đẩy lịch sử) như Menu, nên "quay lại trang trước" là cùng cơ chế `history.back()` đã thử ở ca `g1` (Menu nhóm Cà phê →
  món → về đúng /menu/ca-phe; mở thẳng link → /menu). Chưa có ca riêng cho trắc nghiệm (cần gieo kết quả trắc nghiệm).

## Chủ quán thử tay (POS thật, ≤ 3 bước — phiếu H4)
1. Đặt 1 món rẻ, để công tắc "Trừ từ số dư ví" TẮT, bấm "Xác nhận trả …" → quét QR bằng app ngân hàng → App hiện "Đã thanh toán" / số đơn, quầy nhận đơn.
2. Đặt 1 món, tới màn QR bấm "Huỷ đơn" → đơn hiện "Đã huỷ" (Lịch sử đơn cũng "Đã hủy").
3. Có số dư ví ≥ tổng: bật "Trừ từ số dư ví" ("… — đủ trả cả đơn") → nhập PIN → số dư bị trừ đúng tổng, đơn "Đã thanh toán".
