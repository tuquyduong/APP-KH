# KH-UI-5e — đối chiếu demo (patch39)

Ảnh cặp **demo ↔ App thật** (Chromium, đồng hồ giả 10.11.2026 09:00 giờ VN cho cả hai, dữ liệu mẫu chép từ demo: `TL.ppl` — Mẹ 28/10, Ông nội giỗ 12/10 âm, Con trai 5/12, Minh Anh 20/9 âm — và `TL.vkInfo` — Nguyễn Thị Linh) ở
`so_anh/<360|390|430>_<màn>_{demo,app,lech}.png` (`lech` = ảnh tô đỏ điểm ảnh khác nhau); kịch bản chụp `chup_anh.js`.
Màn: `luoi6` (lưới 6 ô + dải Sắp tới) · `luoi5_anh` (xưng hô "anh") · `ngaycannho_nguoithan` · `ngaycannho_ngayle` · `bang_them` · `vankhan_ds` · `vankhan_bai` · `vankhan_bai_khan` (bài khấn đã điền).
Tỉ lệ điểm ảnh khác (390): lưới 5,2% · lưới 5 ô 5,1% · Người thân 25,8% · Ngày lễ 30,6% · bảng thêm 33,7% · danh sách văn khấn 42,2% · một dịp 27,5% · bài khấn đã điền 1,2% — phần lệch lớn là
khối **banner "Hôm nay" của demo** (đẩy nội dung xuống ~360 px; app đã bỏ banner nhỏ từ KH-UI-5d, quyết định chủ quán 09.11) và dữ liệu mẫu khác của demo (việc, xe, thuốc, chu kỳ).

Lý do khác demo theo CLAUDE.md §5: (a) dữ liệu POS chưa có / việc sau · (b) chữ mẫu không dùng · (c) chưa có giỏ / đặt đơn · (d) màn rộng · (e) token khẩu hiệu. Ngoài ra ghi rõ **"phiếu"** = yêu cầu của phiếu KH-UI-5e (chat App KH soạn 10.11, quyết định chủ quán 06.11 / 10.11).

## Lưới tiện ích + dải Sắp tới (màn Kế hoạch)
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Lưới | `.tl-g.six` 3 cột, 6 ô: Theo mùa · Văn khấn · Ngày cần nhớ · Xe cộ · Uống thuốc · Chu kỳ | y hệt (cùng lớp, cùng thứ tự, cùng biểu tượng fan / book / gift / scooter / mortar / moon, rộng 38 px) | giống. Phiếu A1 ghi "2 cột × 3 hàng" nhưng lớp `.tl-g.six` của demo là **3 cột × 2 hàng** → làm theo demo (ghi `## Phát hiện`). |
| Chữ nhỏ | `toolBadge`: "Mùa Đông" · "Rằm · N ng" · "<tên gần nhất> · N ng" | cùng công thức | giống |
| Xe cộ · Uống thuốc · Chu kỳ | "2 xe · 1 sắp tới hạn", "0/3 hôm nay", "Ngày 10" | "Sắp có"; bấm → "Tiện ích này sắp có" | (a) việc sau: KH-UI-5f (phiếu A3) |
| Ô Chu kỳ | ẩn khi `PROF.sex === 'nam'` | ẩn khi xưng hô anh / chú / bác / ông (`xung_ho` của POS) | (a) app không có giới tính; dùng xưng hô (phiếu A2) |
| Ô "Sắp tới" cũ | ô thứ 8 của lưới cũ | bỏ (đã thành dải) | giống bản patch35 |
| Dải Sắp tới `.up-strip` | 3 dòng gần nhất + "Xem tất cả N ›" | cùng khối, cùng lớp; "d/m · tên · N ngày / Hôm nay" | giống; nguồn = việc của tôi + sinh nhật + giỗ + ngày cúng + ngày lễ (không có Xe / Chu kỳ — việc sau) |

## Ngày cần nhớ
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Đầu màn + nút "＋ Thêm" | `tHead('Ngày cần nhớ', …)` + `#toolAdd` | cùng chữ, cùng nút `.today-btn` (chỉ ở tab Người thân) | giống |
| Hai tab | Người thân · Ngày lễ (`.ss-tabs`) | cùng; chữ canh giữa | thêm `text-align:center` cho nút tab — nút của trình duyệt trong app canh trái, demo canh giữa (sửa cho đúng ảnh demo; có lợi cả Theo mùa) |
| Banner "Hôm nay" trên tab | thẻ `.today.mini` | không có | quyết định chủ quán 09.11 (KH-UI-5d) |
| Dòng ghi chú trên danh sách | không có | "Nhắc khi bạn đang mở App. Chưa tự báo về điện thoại khi đóng App." | phiếu B4 (chữ nhắc theo quyết định 06.11 — cùng câu của tab Ngày lễ) |
| Hàng người thân | ô ngày `tl-date sn / gio`, tên, "Âm lịch d/m · T6, 20/11 · tròn N tuổi", "Văn khấn giỗ ›" / "Tặng thẻ quà ›", "Xoá", nút nhắc | y hệt trừ "Tặng thẻ quà ›" và chữ nút nhắc | (c) thẻ quà chưa có (phiếu B2); nút nhắc ghi "Nhắc khi mở app" (chữ chủ quán duyệt 06.11, như tab Ngày lễ) thay "Nhắc" |
| Xoá | xoá ngay | hỏi lại một lần trong dòng ("Xoá sinh nhật / ngày giỗ «…»?" Huỷ / Xoá) | phiếu B2 (cùng khuôn KH-UI-5d) |
| Sửa | không có | bấm tên → bảng sửa | phiếu B3 |
| Tab Ngày lễ | `holList` + gợi ý quà thẻ quà | giữ màn Ngày lễ của KH-UI-5b (gợi ý quà chỉ là chữ) | (c) phiếu B5 |

## Bảng thêm sinh nhật / giỗ
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Khung | `#sheetX` `.sheet` / `.panel` | `BangNoi` (cùng `.sheet`/`.panel`, thêm thanh kéo + ✕ + Esc của bảng việc KH-UI-5c) | thêm cách đóng; phiếu B3 "bảng nổi" |
| Loại · Tên · Dương/Âm | `.pf-chips.sm`, `.tl-lb`, `.tl-in` | cùng lớp | giống; giỗ mặc định Âm, sinh nhật mặc định Dương (phiếu B3) |
| Ngày · Tháng | hai ô số `1–31`, `1–12` | **bánh xoay** ngày + tháng (`.bx` sẵn có) | phiếu B3 ("bánh xoay sẵn có", chủ quán 08.11: không dùng ô nhập số của trình duyệt) |
| Năm sinh | luôn hiện | chỉ hiện khi chọn Sinh nhật | phiếu B3 |
| Nhắc trước | Trong ngày · 1 ngày · 3 ngày · Không | Không nhắc · Đúng ngày · 1 ngày trước · 3 ngày trước | phiếu B3 (chữ theo phiếu); "Đúng ngày" = 08:00, "1 ngày trước" = 20:00 hôm trước |
| Nút Lưu | `.checkout-btn` | cùng lớp (`.giua`) | giống |

## Văn khấn & lễ cúng
| Khối | Demo | Đã làm | Khác gì / lý do |
|---|---|---|---|
| Danh sách | thẻ `vk-hero` "Sắp tới" + hàng `tl-row` + nút nhắc (trừ Cúng giỗ) + ghi chú | y hệt; "Thêm ngày giỗ ở “Ngày cần nhớ”" thay "Sinh nhật & giỗ" | tên ô đã đổi (patch35) |
| 11 dịp | `VK` | chép nguyên sang `src/noiDung/vanKhan.js` (bài thử so từng chữ với demo) | giống; hàm tính ngày `next:` → `kieu` + `src/vanKhan.js` |
| Biểu tượng dịp | `EN(v.ic, 34)` | `TranhTienIch`: flame / house vẽ thẳng từ `<symbol>` của demo, lantern = `DenLong`, các tên còn lại = the-chat-*.svg / sprite | giống ảnh |
| Một dịp: Tín chủ · Họ · Địa chỉ · Hương linh / Người được giỗ | `.vk-info` | y hệt; Tín chủ mặc định = tên khách | phiếu C2 |
| Lễ vật đã sắm, Cách sắp lễ, Văn khấn tô màu, A− / A+ | `.vk-le`, `.vk-cach`, `.vk-txt mark`, `.vk-fs` | y hệt; tick lưu theo dịp + năm, cỡ chữ 14–26 nhớ trên máy | giống; lưu trong `kh_kehoach` (§8) |
| "Đặt hoa quả, trà dâng lễ" | `.vk-shop` | không hiện | (c) chưa có nhóm món (phiếu C3) |
| "Đọc to" | `vkSay()` | không hiện | phiếu C3 |
| Nút nhắc dịp | cạnh "Đọc to" (`.tl-rm.big`) | riêng một hàng (không có "Đọc to") | hệ quả của dòng trên |
| Banner "Hôm nay" | `.today.mini` | không có | quyết định chủ quán 09.11 |

## Chưa đối chiếu
- Màn rộng ≥ 1024 px: chưa có mẫu màn to chủ quán duyệt (`thiet_ke/mau_man_to/` chưa có ảnh các màn này).
- Chat App KH so ảnh lại lần cuối trước khi gộp (CLAUDE.md §5).
