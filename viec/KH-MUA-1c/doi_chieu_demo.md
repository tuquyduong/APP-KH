# KH-MUA-1c — đối chiếu demo (`thiet_ke/app_kh_demo.html`, patch39)

Ảnh ở `so_anh/`: `demo-pin-*` (demo, mở bằng `pinAsk('pay' | 'new')`), `pin-*` (app thật + POS giả, bài `thu_KHMUA1c.js` với `LUU_ANH_DIR`),
`cap-pin-*` (cặp demo | app cạnh nhau) — 360 / 390 / 430 × (trả ví, đặt PIN). Công cụ ghép + chụp demo để ở nháp (không vào kho).

## Bảng PIN (`PinSheet.jsx`, khuôn `.pin-sheet` / `.pin-pad` của demo dòng 1464, 4036–4050)
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| Tiêu đề "Nhập mã PIN" + dòng phụ | giữ | dòng phụ "Để trả bằng Ví nội bộ" (có từ KH-MUA-1) | (b) chữ mẫu |
| 4 chấm `.pin-dots` | giữ | — | — |
| Bàn phím 1–9, 0: số GIỮA nút (demo lệch ngang 0,01 px) | sửa: `.pin-pad button{ text-align:center }` (`giaoDien.css`) | app gốc lệch trái 46 / 51 / 58 px (360 / 390 / 430) do `:where(button){ text-align:inherit }`; nay ≤ 1 px (bài F1) | — (khớp demo) |
| Hàng cuối `Quên PIN · 0 · Xoá` | `Xoá · 0 · Xác nhận` | "Xoá" sang trái (lùi MỘT số), "Xác nhận" (khuôn `.lk`, chữ `--pink-dark` đậm) bật khi đủ 4 số; không tự gửi khi đủ 4 số | chủ quán chốt 05.11 (phiếu F2); "Quên PIN" demo: POS chưa có cửa quên PIN bằng OTP — (a), như KH-UI-3b |
| "PIN demo: 2580" | bỏ | — | (b) chữ mẫu demo |
| Đang gửi | nút "Xác nhận" thành "Đang gửi…", tắt | demo không có (demo không gọi máy chủ) | phiếu F4 |

## Thanh toán — khối "có thể đã đặt" (`thanhtoan-khoa-da-dung-390.png`)
| Khối trong demo | Đã làm | Khác gì | Lý do |
|---|---|---|---|
| (demo không có luồng khoá gửi) | dùng lại khuôn `.nt-state` + thẻ tóm tắt + `.ghost-btn` của khối "Lần đặt trước chưa rõ kết quả" (KH-MUA-1b) | câu "Đơn này có thể đã đặt trước đó — mời bạn xem Lịch sử đơn", hai nút "Xem Lịch sử đơn" / "Bỏ qua, đặt đơn mới" | phiếu B2 — không màn mới |

## Theo dõi đơn (`theodoi-v7-may-khac-390.png`)
Không đổi bố cục; dòng "Đã giữ … trong ví · quét QR …" và số cạnh QR nay lấy từ `GET /don/:ma` (v7) nên máy khác cũng hiện (phiếu C1).
