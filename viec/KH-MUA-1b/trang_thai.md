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

## Chỗ vá → đột biến (`python3 viec/KH-MUA-1b/dot_bien.py`, đối chứng trước: bản vá XANH 212 · 0)
| Chỗ vá | Đột biến | Kết quả |
|---|---|---|
| `datDon.guiDonAnToan` gửi lại ĐÚNG thân + khoá | VS-GUI-LAI-KHOA-MOI · VS-GUI-LAI-THAN-KHAC | ĐỎ 201·11 · ĐỎ 210·2 |
| `datDon.loaiLoi` luật 4xx | VS-5XX-LA-CHUA-TAO · VS-4XX-LA-KHONG-BIET · BV-LUAT-4XX | ĐỎ 36·4 · ĐỎ 202·10 · ĐỎ 197·14 |
| `datDon.thanDatDon` có `tong_da_xem` | BV-TONG-DA-XEM | ĐỎ 171·36 |
| `ThanhToan` `tong_da_xem` = `bg.tong` đang hiện | VS-TONG-TU-TINH | ĐỎ 174·33 |
| `datDon.banGhiGui` bỏ PIN | VS-LUU-PIN | ĐỎ 209·3 |
| `ThanhToan` khoá khi chưa rõ / có đơn chờ trả | BV-CHAN-KHI-CHUA-RO · BV-CHAN-DON-CHO-TRA | ĐỎ 208·4 · ĐỎ 210·2 |
| `ThanhToan` ghi `kh_don_gui` TRƯỚC khi gửi | BV-GHI-TRUOC-GUI | ĐỎ 204·8 |
| `ThanhToan` GIA_DA_DOI thay bảng tiền | BV-GIA-DA-DOI | ĐỎ 210·2 |
| cửa thật nối trước khi bật cờ | VS-BAT-CO-TRUOC-NOI-CUA · BV-CO-TAT | ĐỎ 159·47 · ĐỎ 39·1 |
| `App.themVaoGio` quay lại trang trước | BV-QUAY-LAI-SAU-THEM | ĐỎ 208·4 |
Tên đột biến: VS-GUI-LAI-KHOA-MOI, VS-GUI-LAI-THAN-KHAC, VS-5XX-LA-CHUA-TAO, VS-4XX-LA-KHONG-BIET, BV-LUAT-4XX, BV-TONG-DA-XEM, VS-TONG-TU-TINH, VS-LUU-PIN,
BV-CHAN-KHI-CHUA-RO, BV-CHAN-DON-CHO-TRA, BV-GHI-TRUOC-GUI, BV-GIA-DA-DOI, VS-BAT-CO-TRUOC-NOI-CUA, BV-CO-TAT, BV-QUAY-LAI-SAU-THEM.
TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT (15/15). Ca K5 (không chặn oan): đơn QR thường (`qr-360/390/430`), ví đủ (`vi`), ví + QR (`vi_qr-*`) — xanh ở bản vá.
