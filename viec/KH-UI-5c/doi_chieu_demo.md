# Đối chiếu demo — KH-UI-5c (bấm ngày → bảng việc, lặp, nhắc, quá hạn, Hoàn tác)

Ảnh ở `so_anh/`: `<cỡ>_<cảnh>.png`, cỡ 360 / 390 / 430, cùng ngày 8.11.2026 (Chủ nhật, 09:00 giờ VN — đồng hồ giả), dữ liệu mẫu 7 việc (nộp hồ sơ quá hạn, trả sách quá hạn,
tập thể dục hằng tuần lỡ 2 lần, mua hoa 20/11 có nhắc, gọi điện đã xong, hẹn bác sĩ hằng tháng, uống thuốc bổ "sau khi xong 30 ngày"). Kịch bản chụp ở nháp (không vào kho).
**Demo (patch39) KHÔNG có** bảng việc của ngày, bảng việc quá hạn, bánh xoay, hàng ba nút, Hoàn tác, ô tìm, dải nhắc việc, hay việc lặp: các khối này là **quyết định chủ quán 08.11**
("thêm việc là pop-up khi bấm vào ngày; ngày có việc có biểu tượng"; tham khảo tab Việc ở app riêng của chủ quán — phiếu `phieu.md`) nên không có ảnh demo để chồng lên.
Phần chung với demo (thẻ ngày, lưới tiện ích, lịch tháng, ghi chú, dưỡng sinh, ngày lễ) KHÔNG đổi so với KH-UI-5b (đã so ảnh ở `viec/KH-UI-5b/so_anh/`); ở đây chỉ so lại chỗ KH-UI-5c chạm vào.

## Màn `lich` — `/kehoach`
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Ô lịch: chấm hồng "Việc của tôi" (`.dm`) | **chuông nhỏ** (`Ico bell`, biểu tượng SẴN trong bộ demo, không vẽ mới) góc phải ô; ngày có việc QUÁ HẠN chuông đổi sang đỏ `#AB3F37` (màu sẵn của demo cho "Chủ nhật / ngày lễ"); chấm đỏ ngày lễ `.dh` giữ nguyên | quyết định chủ quán 08.11 ("ngày có việc thì có thêm biểu tượng"); chú giải đổi chấm hồng thành chuông |
| Bấm một ô → chỉ chọn ngày | chọn ngày + mở **bảng nổi từ dưới lên** (`BangNoi`, dựng trên `.sheet`/`.panel` của demo: nền mờ, góc trên bo 22, bóng, cuộn `max-height:88%`) | (d) quyết định 08.11; thêm thanh kéo, ✕, Esc, chạm nền, vuốt xuống |
| Bảng "Thêm việc vào lịch" (`#sheetAdd`: tên · ngày · giờ `time` · 4 chip nhắc) | bỏ; việc thêm ngay trong bảng ngày: ô tên + "Thêm", hàng 3 nút (Giờ sự kiện · Hẹn giờ nhắc · Lặp lại), khung chọn mở một khung một lúc; dùng `.filter-pill` (hồng khi đang mở / viền hồng khi đã chọn / chữ mờ khi chưa) | quyết định 08.11 ("gọn, ít thao tác nhưng đầy đủ"); KHÔNG dùng `<input type=time>` AM/PM (phiếu A4) nên có bánh xoay riêng |
| Danh sách việc `.ag` (tick · giờ · tên · "🔔 …" · ✕ xoá) | giữ `.ag`; thêm dấu ↻ cạnh tên, dòng nhỏ **hạn bằng chữ** ("hạn hôm nay" / "quá hạn dd/mm" đỏ / "hạn dd/mm"), mô tả lặp; **bỏ ✕ xoá** (xoá nằm trong form sửa: chạm tên → "Xoá việc" → Hoàn tác) | D3 + A3; ít nút trên mỗi dòng |
| `calNoti` (Bật / Tắt nhắc) | thanh xanh `nt-bar on` nêu các việc ĐANG trong thời gian nhắc ("Còn 2 ngày: Đóng tiền điện (10/11)", "10 phút nữa: Hẹn bác sĩ (09:00)"); chạm → mở bảng ngày | (a) chưa có thông báo đẩy (KH-TB-1); chữ theo phiếu C2 |
| (không có) | dải `nt-state` **"⚠️ N việc quá hạn ›"** đầu màn; ô tìm việc `.tim-viec` (ô nhập theo kiểu ô của `.sheet`) + danh sách kết quả `.tl-row` | D1, E2 (quyết định 08.11) |
| Banner "hôm nay" nhỏ (`todayLich`), ✕ ở banner LỚN Trang chủ (`todayHide`) | ✕ chuyển sang banner LỚN Trang chủ (chỉ hiện khi đã đăng nhập + có chữ khuyến mãi), bản nhỏ không còn ✕; bấm ✕ báo "Ẩn ở Lịch và tiện ích đến hết hôm nay" và ẩn bản nhỏ đến hết ngày | F1 — đúng `todayCard`: `mini ? '' : t-x` + `todayHide()`; sửa chỗ KH-UI-5b làm ngược phiếu cũ |
| Ô "hôm nay" trong lưới tháng cao 150 px | ô cỡ thường (50 px) | F2 — **lỗi của demo** (ô mang lớp `.today` trùng lớp banner `.today`); app nạp `ke_hoach.css` sau nên không dính; bài thử khoá không có `height:150px` |

## Màn `home` — ô "Kế hoạch và nhắc việc"
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| `utilCal`: ngày lớn, thứ, âm lịch, tiết khí, "N việc hôm nay ›" | giữ; thêm **số đỏ nhỏ** (`.u-qh`, nền `#AB3F37`, chữ trắng) cạnh "N việc hôm nay" khi có việc quá hạn và đã đăng nhập | D1 (quyết định 08.11); chưa đăng nhập: không có số (ô bị mờ/khoá) |

## Các cảnh mới (không có trong demo → không có cặp ảnh)
| Cảnh (file `<cỡ>_…png`) | Nội dung |
|---|---|
| `lich_chuong_qua_han` | lưới tháng 11: chuông hồng ở 8, 12…, chuông đỏ ở 3, 7 (quá hạn), chấm đỏ ngày lễ 20; chú giải thêm "Việc của tôi" |
| `man_ke_hoach_dau` | dải ⚠️ quá hạn, ô tìm, thẻ ngày |
| `bang_ngay_trong` / `bang_ngay_co_viec` | ngày 20/11: "Thứ Sáu, 20/11", dòng âm lịch, "Trong ngày: Nhà giáo Việt Nam", "Việc của tôi · N việc", ô + Thêm, ba nút |
| `bang_ngay_gio_banh_xoay` / `bang_ngay_hen_gio_nhac` / `bang_ngay_lap_lai` | khung giờ (bánh xoay 24h), hẹn giờ nhắc ("Chọn ngày giờ khác…" 3 cột), lặp lại (chip + "Đến ngày") |
| `bang_ngay_dang_sua` | form sửa việc lặp "Hẹn bác sĩ": tên, giờ, nhắc, lặp, Huỷ / Xoá việc |
| `bang_qua_han` | "Việc quá hạn chưa làm": thẻ từng việc, "Quá N ngày · dd/mm · giờ", "Lỡ N lần · từ … đến …", nút ✓ Xong / ✓ Đánh dấu cả N lần / Bỏ qua lần này / → Hôm nay / → Mai / Xoá, "Dời cả N việc sang hôm nay" |
| `thong_bao_hoan_tac` | "Đã xoá Trả sách thư viện · Hoàn tác" (khuôn `.toast.co-nut`) |

Màu / bo góc / bóng / chữ của mọi khối mới chỉ dùng biến và giá trị đã có trong demo (K9 xanh); không thêm phông.
