# Đối chiếu demo — KH-UI-5b (Kế hoạch và nhắc việc)

Ảnh ở `so_anh/`: `<cảnh>_<cỡ>_app.jpg`, `<cảnh>_<cỡ>_demo.jpg`, `<cảnh>_<cỡ>_lech.jpg` (đỏ = lệch > 48/765 tổng ba kênh), `bao_cao.txt` (% điểm ảnh lệch). Cỡ 390 / 360 / 430. Cùng ngày 7.11.2026 (Thứ Bảy, Lập đông), cùng dữ liệu mẫu.
Kịch bản chụp ở nháp (không vào kho). Hai bên được dọn cho CÙNG phạm vi: demo bỏ "Từ TQD", chấm "Từ TQD", năm tiện ích 5c, dải `up-strip`, nguồn của 5c, thanh bật thông báo đẩy, món POS, banner nhỏ (trừ cảnh banner).
Dữ liệu mẫu việc = bốn việc của demo (`AGENDA`); chữ "15 phút trước…" của demo thay bằng chữ của app để so cùng chữ.
(Trong thư mục còn vài file `.png` của lần chụp đầu — KHÔNG commit, bản chính thức là `.jpg`.)

## Màn `lich` — `/kehoach` (lich_*, lich_viec_*)
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Thanh trên (‹, tên, "Hôm nay"), thẻ ngày `calHero`, lưới tiện ích, lịch tháng ‹ ›, chú giải, thẻ dưỡng sinh theo tiết, "Việc của tôi · d/m" + Thêm việc, danh sách việc, "Ngày lễ trong tháng", dòng miễn trừ | y demo (CSS chép nguyên `ke_hoach.css`; lệch 3,1–3,6 % khi chưa có việc) | — |
| `calNoti` luôn hiện "Bật / Tắt nhắc việc" | chỉ hiện thanh xanh "Hôm nay nhắc: 17:30 …" khi có việc bật nhắc chưa xong; không có thì ẩn | (a) chưa có thông báo đẩy (KH-TB-1) nên không có công tắc bật / tắt đẩy. Thanh này làm lệch xuống 8–9 % ở `lich_viec` (đẩy cả trang xuống ~40 px) |
| Lưới tiện ích 8 ô (patch36), demo cuối patch35 còn 6 ô + dải "Sắp tới" | đúng ba ô theo phiếu B3: Theo mùa, Ngày lễ, Sắp tới (3 cột `.six`), dòng nhỏ `toolBadge`; không dải `up-strip` | phiếu B3 chốt ba ô; năm ô còn lại = KH-UI-5c (lý do (a)) |
| Chú giải "Việc của tôi · Từ TQD · Ngày lễ · Tiết khí"; khối `calTqd` "Từ Tứ Quý Đường"; chấm vàng ở ô | **ẩn** chấm + khối + mục chú giải "Từ TQD" | (a) POS chưa có dữ liệu sự kiện |
| "Món hợp tiết này" (2 món) | ghép tên với menu POS; món không có / hết → ẩn cả khối; nền ô món `var(--cream)` thay màu theo nhóm | (a) menu chưa tải ở ảnh so; màu theo nhóm của demo (`catOf`) không có ở app — dùng màu kem của demo |
| Dòng "Làm khảo sát thể chất…" / khi đã làm: "Với thể chất X: <thói quen>" | có CTA khi chưa có kết quả; khi đã có kết quả thì ẩn dòng | (a) chữ `habit` của demo chưa có trong dữ liệu 5a — không bịa |
| Việc: nhắc trước 15 phút / 1 giờ / 1 ngày | hai mức "Không nhắc" / **"Nhắc khi mở app"** | (a)+C2: chưa đẩy ra điện thoại; chủ quán duyệt chữ 06.11 |
| (không có) | thêm 2 dòng nhỏ cuối: "Việc và nhắc … chỉ lưu trên máy này … Nhắc hiện khi bạn mở app" và dòng "Xoá toàn bộ dữ liệu Kế hoạch trên máy này" (bấm hai lần) | D3: demo không có nút xoá → dòng nhỏ cuối màn (xem Phát hiện) |
| Ô "hôm nay" trong lưới tháng cao 150 px (demo) | ô bình thường (50 px) | **lỗi của demo**: ô mang lớp `.today` trùng lớp banner `.today` (padding 16, overflow…). App nạp `ke_hoach.css` sau nên không dính. Ảnh so đã vá phía demo để chỉ so phần còn lại. Xem Phát hiện |

## Màn `tool` — Theo mùa / Ngày lễ / Sắp tới (tool_mua_*, tool_ngayle_*, tool_saptoi_*)
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Theo mùa: bốn thẻ mùa, 6 mục, "Món Tứ Quý Đường hợp mùa", liên kết "Dưỡng sinh theo tiết", dòng Tỳ vượng | y demo (lệch 0,1–0,2 %) | món POS ẩn khi không có menu — (a) |
| Sắp tới: ngày + việc + nhãn Việc / Lễ, "n ngày" | y demo (**0,0 %**) | nguồn chỉ việc + lễ (nguồn 5c chưa có) |
| Ngày lễ: tl-date, tên, "Dương lịch 20/11 · T6, 20/11", nút Nhắc | cùng khối; nút "Nhắc khi mở app" / "Đang nhắc" (demo "Nhắc" / "Đang nhắc"); dòng ghi chú đầu danh sách "Nhắc hiện khi bạn mở app. Chưa tự báo về điện thoại khi đóng app."; gợi ý quà là CHỮ "Gợi ý quà tặng cho dịp này" không nhấn được | C2 (chữ đúng sự thật); (c) chưa có thẻ quà nên không có "thẻ quà tặng ›". Lệch 11–13 % do ghi chú đầu + nút dài hơn làm tràn dòng / lệch hàng |
| Màn Ngày lễ trong demo cuối (patch35) gộp vào "Ngày cần nhớ" có hai tab | màn riêng `/kehoach/ngayle` | phiếu B4 |

## Banner nhỏ (banner_nho_*)
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| `.today.fx-a.mini`: nhãn "HÔM NAY" (không ngày), tiêu đề, dòng phụ, nút "Xem ›", ánh sáng lướt chéo | dùng lại `BannerHomNay` thêm `mini` (ảnh nền của app, không vẽ `t-art`) | lệch ~38–42 %: vị trí vệt sáng (hoạt hình) mỗi lần chụp mỗi khác; ảnh nền / chữ khớp. Chữ mẫu "Ra mắt Combo mua kèm…" chỉ dùng khi chụp (bản dựng tạm, đã hoàn nguyên); `HOM_NAY` thật vẫn TRỐNG nên banner nhỏ chưa hiện ở bản thật |
| ✕ chỉ ở banner Trang chủ (`mini` KHÔNG có ✕); bấm ✕ ẩn hai bản nhỏ | ✕ ở bản nhỏ, ẩn bản nhỏ tới hết ngày POS; banner Trang chủ không đổi | **theo phiếu B7**, khác code demo — xem `## Câu hỏi` 1 của `trang_thai.md` |

## Ô Kế hoạch ở Trang chủ (trangchu_o_*)
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| `utilCal`: "KẾ HOẠCH VÀ NHẮC VIỆC", ngày dương + thứ, "Trợ lý của bạn · Miễn phí", Âm lịch, Tiết, "n việc hôm nay ›" | y demo, nằm cạnh thẻ hội viên trong `.top-row` | lệch 2,6–2,9 % do khối bên trái (hạng thẻ, ảnh app khác demo — ngoài việc này) |
| Chưa đăng nhập | ô mờ + "Đăng nhập để mở khoá chức năng" (`KhoaTienIch`), KHÔNG đếm việc | demo không có bản chưa đăng nhập; theo CLAUDE.md §5 (29.10) |
| Thẻ "Xem cách dùng app" | không hiện | (a) chưa có video (B6) |
