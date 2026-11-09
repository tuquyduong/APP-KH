# KH-UI-5d — đối chiếu demo (patch39)

Ảnh App thật (Chromium, đồng hồ giả 8.11.2026 09:00, POS giả) ở `so_anh/<360|390|430>_<màn>.png`; kịch bản chụp `chup_anh.js`.
**Dải quảng cáo KHÔNG có trong demo** — là quyết định chủ quán 09.11.2026 (xem phiếu), nên không có ảnh demo để ghép cặp; lý do khác demo thuộc nhóm "quyết định chủ quán" (gần (a): chữ lấy từ dữ liệu POS, không chữ mẫu). Màu / phông / bo góc chép từ demo (K9 xanh).

## Dải quảng cáo (Menu · Ưu đãi · Giỏ hàng · Kế hoạch + tiện ích · Tài khoản)
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Nền dải | `.today` nền `linear-gradient(125deg,#8E1B4C…#B2365F…)` | `linear-gradient(125deg,#8E1B4C 0%,#B2365F 100%)` | bỏ điểm dừng cam `#C8784A` cho mảnh gọn (màu có trong demo) |
| Bo góc, cao | banner lớn bo 20, mini bo 16 | bo 12 px, cao 38 px | quyết định chủ quán: "thu gọn, mảnh" |
| Nhãn "HÔM NAY" | `.t-k` 10.5px / 800 / giãn .14em / `#FDE69B` | 10px / 800 / giãn .1em / `#FDE69B` | nhỏ lại cho vừa 360 px |
| Câu quảng cáo | tiêu đề banner (`b`, 19px, nhiều dòng) | 12px / 700, MỘT dòng, cắt "…" | quyết định chủ quán; chữ lấy từ Giờ vàng / chương trình POS (không chữ mẫu) |
| "Xem ›" | `.t-cta` (nút nền vàng) | chữ vàng `#FDE69B` 12px / 800, không nền | quyết định chủ quán ("hiện nhẹ nhàng") |
| Vệt sáng | `.fx-a` (`sweepL`) | cùng lớp `.fx-a`, `--dur:3.5s` | chu kỳ ~3,5 giây theo phiếu; `prefers-reduced-motion` tắt (luật của demo) |
| Vị trí | — | đầu `.screens`, trong luồng, cuộn theo trang | không có ở demo |
| 360 px | — | chữ Giờ vàng dài bị cắt "…" (mất "10:00") | phiếu cho phép cắt; chưa thêm biến thể ngắn |

## Trang chủ
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Banner "Hôm nay" | thẻ `.today` kèm ✕ `t-x` (todayHide) | KHÔNG ✕ (không có chữ khuyến mãi nên hiện banner ảnh cũ) | quyết định chủ quán 09.11: bỏ hẳn ✕ |

## Kế hoạch
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Banner nhỏ `#todayLich` | thẻ `.today.mini` | thay bằng dải ở trên | quyết định chủ quán 09.11 |
| Bảng sửa việc — ô Ngày | không có | bánh xoay Ngày / Tháng / Năm (cùng khuôn `.bx` của giờ) | việc mới theo phiếu (E1) |
| Hỏi xoá | demo không có | khung trắng bo 14 trong bảng: "Xoá việc «…»?" + Huỷ / Xoá (nâu cảnh báo `#AB3F37` đã có) | việc mới theo phiếu (C1) |
| "📅 Sẽ xếp vào ngày …" | không có | dòng nhỏ 12px dưới ô tên | việc mới theo phiếu (D3) |
| Hoàn tác | `.toast.co-nut` ở Kế hoạch | gỡ khỏi Kế hoạch (Giỏ hàng giữ) | quyết định chủ quán 09.11 |

## Thanh toán / Theo dõi đơn / Đăng nhập
Không có dải (`360_thanhtoan_khong_dai.png`).
