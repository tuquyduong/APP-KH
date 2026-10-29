# Đối chiếu demo — KH-UI-5a (Trắc nghiệm thể trạng)

Ảnh ở `so_anh/`: `<màn>_<cỡ>_app.jpg` (app), `<màn>_390_demo.jpg` (demo, chỉ cỡ 390), `<màn>_<cỡ>_lech.jpg` (đỏ = lệch > 28/255 mỗi kênh), `bao_cao.txt` (% điểm ảnh lệch). Chromium + Playwright có sẵn, API giả, cùng bộ trả lời lấy từ `cong_cu/thu_KHUI5a_mau.json`, cỡ 390 / 360 / 430. Công cụ so ảnh để ở nháp.
Để so phần còn lại, ở màn kết quả ẨN ở cả hai bên: thẻ món + tiêu đề "Thức uống gợi ý tại quán" + khối Topping (khác vì (a) — xem bảng) và dòng "Trao đổi với quán ›" (chưa có số liên hệ thật — `LIEN_HE` trống).

## Giới thiệu `tc`
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| Thanh đầu, huy hiệu cân, "Phiếu trắc nghiệm thể trạng", 60 câu · 7–8 phút, Cơ sở lý luận, Bước 1 Nam / Nữ, nút Bắt đầu, dòng cam kết, thẻ "Kết quả đã lưu", lưới 9 thể chất | đủ, y demo | **lệch 0,00 %** ở 360 / 390 / 430. Chữ nút Nam / Nữ cần `font-size:13.3333px` (nút trần của demo) — ghi ở `giaoDien.css` |
| Giới tính điền sẵn từ Thông tin cá nhân (demo) | điền sẵn từ kết quả đã lưu | (a) app chưa có giới tính trong hồ sơ |

## Câu hỏi `tcq`
| Khối | Đã làm | Khác gì |
|---|---|---|
| Thanh tiến độ, "Câu n/60", thẻ câu hỏi, 4 mức A–D, nhãn Dành cho nữ / nam, "còn khoảng N phút" | y demo | lệch 0,01 % (câu đầu), 0,3 % (câu giữa, ô đã chọn). Ở 360 / 430 ca "câu giữa" báo 8–9 % chỉ vì kịch bản thử: app đã tự sang câu sau (170 ms như demo) trước lúc chụp |
| Hai câu cuối: kiểm tra chéo nóng / lạnh + checklist theo giới + nút Xem kết quả | y demo | lệch 0,25–0,5 % (viền ô đã chọn) |
| Quay lại câu trước | y demo | **thêm**: ở câu đầu mà đã trả lời → hỏi "Thoát bài trắc nghiệm?" (phiếu B2 yêu cầu; demo không có) — dùng khung `.sheet` của demo |

## Kết quả `tcr` (có / Bình hòa / an toàn)
| Khối | Đã làm | Khác gì, lý do |
|---|---|---|
| Huy hiệu + tên thể trạng + chữ Hán + mức + mô tả, ghi chú xung đột / ≥ 3 thể / an toàn / đã để riêng, Kết luận tổng thể, khối chính / phụ, Điểm từng nhóm, Làm lại, nguồn | đủ, chữ khớp demo 39/39 ca (bài thử) | lệch 0,44 % (có) · 0,70 % (Bình hòa) · 0,58 % (an toàn) — phần lệch là hộp lưu (bên dưới) |
| Thẻ món (giá thường / vàng / kim cương), tiêu đề "Thức uống gợi ý tại quán · n món" | `MonO` của app, giá POS; ẩn cả khối khi chưa có menu | (a) giá 3 hạng thuộc KH-UI-3; (b) không giả lập món (B4) |
| "Topping gợi ý" (thẻ topping có giá) | **ẩn** | (a) `/menu` chưa có topping (TOPPING-1); topping vẫn nằm trong chữ "Nên chọn" |
| "Trao đổi với quán ›" | ẩn khi chưa có số liên hệ | (b) chưa có số thật (`LIEN_HE` trống) |
| "Lưu kết quả để nhận gợi ý mỗi ngày … Đã lưu vào tài khoản · gợi ý món sẽ hiện ở Trang chủ" | "Lưu kết quả để xem lại sau … Đã lưu trên máy này · bạn xem lại được ở Tài khoản → Thể trạng của tôi" + nút **Xoá kết quả** | kết quả lưu TRÊN MÁY (chủ quán chốt 27.10), không lên tài khoản; gợi ý mỗi ngày ở Trang chủ chưa làm (không có trong phiếu) |
| "Xem lại từng câu trả lời", ô góp ý + sao chép | có khi vừa làm xong; mở lại bản đã lưu thì không có (C1: không lưu câu trả lời) | — |
| "Dựa trên lựa chọn của bạn: …" | như trên: chỉ khi còn câu trả lời | C1 |

## Ô Trắc nghiệm ở Trang chủ, Tài khoản
| Khối | Đã làm | Khác gì |
|---|---|---|
| Ô "Trắc nghiệm · Bạn thuộc thể chất nào?" trong `.hb-tiles` dưới banner; sau khi lưu: "Thể trạng · <tên> · Xem kết quả ›" | y demo (`hb-tile hb-t-quiz`) | ô rộng hết hàng vì ô Giờ vàng chưa có (a, KH-UI-3). Cả trang chủ lệch 55 % vì các khối Hạng, Giờ vàng, Kế hoạch… (a) — không thuộc việc này |
| Chưa đăng nhập | ô MỜ + 🔒 + "Đăng nhập để mở khoá chức năng" (`KhoaTienIch`, ảnh `trangchu_o_trac_nghiem_khoa_*_app.png`) | demo không có (luật chủ quán 29.10) |
| Tài khoản: nhóm "Sức khỏe" → "Thể trạng của tôi" + "<Thể trạng> · <ngày>" / "Làm trắc nghiệm 7–8 phút" | y demo | màn Tài khoản lệch ~5 % do Ví, Gia đình, Thông báo… (a) không thuộc việc này |

## Màn mở (S1)
Khẩu hiệu "Đông Y Dưỡng Thể" thay "Sức khỏe mỗi ngày" ở `e3-tg` — giữ nguyên kiểu chữ, cỡ, màu, chuyển động (chỉ đổi chữ ở `noiDung/thuongHieu.js`). Màn mở bị bỏ qua khi chụp (cờ đã xem) nên phần hiển thị chưa so ảnh — xem mục CHƯA KIỂM.
