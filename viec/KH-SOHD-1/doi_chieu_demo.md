# Đối chiếu demo — KH-SOHD-1

Chuẩn giao diện: `thiet_ke/app_kh_demo.html` (patch39). Demo CHƯA có màn thẻ QR trả tiền / số đơn `APP…` — thẻ QR theo MẪU chủ quán duyệt 06.11 (`mau_the_QR_TQD.png`, thư POS GIAO-DIEN-1 F), phần còn lại dùng nguyên khuôn demo sẵn có (`.order-card`, `.pick-num`, `.nt-state`, `.summary-row`).
Ảnh chụp 360 / 390 / 430 ở `so_anh/` (chạy `LUU_ANH_DIR=… node cong_cu/thu_KHSOHD1.js`, POS giả v11, cùng dữ liệu mẫu).

## Màn Theo dõi đơn — thẻ mã QR (`the-qr_<rộng>.png`, `the-qr-vi_<rộng>.png`)
| Khối | Mẫu đã duyệt | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Khung thẻ | nền kem #FBF3E6, viền vàng kim #B08028, bo lớn | `.the-qr` đúng màu, viền 2px, bo 22px | (e) màu ngoại lệ chủ quán duyệt 06.11 (K9 DUYET_NGOAI_DEMO) |
| Đầu thẻ | logo + "Tứ Quý Đường" đỏ đô #7A1E18 + "Quét mã để thanh toán" | `.the-qr-dau`, logo `public/anh/logo_tqd_192.png` | giống mẫu |
| Ô trắng | số tiền chữ to, mã QR, dòng "<số đơn> · <nội dung CK>" | `.the-qr-o`: `soTra` (QR cả đơn = tổng, ví + QR = còn lại; không biết → ẩn), mã, dòng | mẫu ghi `HD0016`, app ghi `APP0016` = `so_hd` thật của POS (b) |
| Mã QR | mức H, chấm tròn, 3 ô góc bo tròn tô đặc, 4 màu phần tư, đĩa logo tròn trắng ≤ 20%, viền trắng ≥ 3 ô | `qrThuongHieu.js` + `TheQR.jsx` đúng quy cách | đĩa logo 20% bề ngang (mẫu to hơn chút: tôi giữ đúng trần 20% của phiếu) |
| Chữ cuối thẻ | không có | không có (bài thử D3 kiểm phần tử cuối là ô trắng) | giống mẫu |
| Đồng hồ / hết hạn / dòng ví đã giữ | giữ nguyên | giữ nguyên (`.qr-chu`, "Tạo mã mới", "Đã giữ … trong ví") | giống app trước |

Chưa kiểm quét máy (D6): máy làm việc không có `zbarimg` / `jsQR`, người gác chặn `npm install` → bài thử kiểm CẤU TRÚC (lưới bit dựng lại từ hình vẽ khớp ma trận mức H, đĩa logo ≤ 20% bề ngang, mất < 10% ô). Chủ quán quét thử MB / Vietcombank / Techcombank / MoMo (E4).

## Màn Theo dõi đơn — số đơn, tiền về muộn (`theodoi-da-tra_<rộng>.png`, `tien-ve-muon_<rộng>.png`)
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Tiêu đề / ô "Số đơn của bạn" | `#<mã>` | `APP0016` (`so_hd`); `so_hd` null → `#<mã>` | (b) dữ liệu theo POS v11 |
| Câu tiền về muộn | khuôn `.nt-state` | nguyên câu `thong_bao_tien_ve` của POS, cùng khuôn | (a) câu do POS gửi; không có → giữ câu cũ khi `tien_ve_cho_doi_soat` |

## Màn Lịch sử đơn (`lich-su_<rộng>.png`) và Chi tiết đơn
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Thẻ đơn | `.order-card` + `.code` | `.code` = `so_hd` (APP0016, 012…), `#<mã>` khi chưa có | (b) |
| Chi tiết đơn | tiêu đề + mã | tiêu đề "Đơn 012"; câu tiền về muộn trên tờ | (b), (a) |
| Tóm tắt (`kenh`, `cach_nhan`, `tra[]`) | — | KHÔNG làm | chờ POS KH-TOMTAT-1 (phiếu cấm) |

## Dải báo đơn xong, Thanh toán
Chữ đổi theo `so_hd` ("Đơn APP0016 đã sẵn sàng…", "Bạn có đơn APP0016 đang chờ trả", "Tiếp tục trả đơn APP0016"); khuôn / màu / vị trí giữ nguyên demo. Kiểm bằng bài thử (Chromium, 360 / 390 / 430 cho thẻ QR); chưa có ảnh riêng vì chỉ đổi chữ.
