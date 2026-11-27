# KH-DOI-1 — đối chiếu ảnh thiết kế đã duyệt ↔ App

Chuẩn của việc này là bản thiết kế chủ quán duyệt 26.11 (`viec/KH-DOI-1/anh/d1…d6.webp`, CSS + HTML ở `mau_de_xuat.js`) — demo patch39 không có các màn đổi quà.
Ảnh App: `viec/KH-DOI-1/so_anh/nhanh/*.png` (390×844, Chromium + POS giả dựng từ hợp đồng đã hẹn, `LUU_ANH_DIR` của `cong_cu/thu_KHDOI1.js`; Kho quà chụp cao 1259 như ảnh thiết kế).
Cỡ 360 / 430: bài thử kiểm không tràn ngang (Kho quà, Phiếu quà, Quà của tôi).
Ảnh tô chỗ lệch (đỏ = điểm ảnh lệch > 40): `so_anh/lech/*.png` — tỉ lệ lệch: d1 25,2 % (thẻ hội viên không có vì POS giả trả `/hang` rỗng — dữ liệu thử),
d2 0,6 %, d3 0,4 %, d4 0,3 %, d5 10,0 % (nội dung mã QR mẫu khác), d6 1,0 %.
Lý do được khác: (a) dữ liệu POS chưa có / App không tự tính · (b) chữ / số mẫu · (c) chưa có giỏ / đặt đơn · (d) màn rộng · (e) khẩu hiệu.

## d1 — Ưu đãi (ô Điểm)
| Khối thiết kế | App | Khác gì, lý do |
|---|---|---|
| Thẻ hội viên | không có trong ảnh App | POS giả trả `/hang` rỗng — dữ liệu thử (b); màn ngoài phạm vi, không đổi |
| Ô Điểm + nút "Đổi quà ›" | có, đúng màu / cỡ (khuôn `vt-nap`) | — |
| Ô Số dư ví, Nhập mã, Ví voucher, Lịch sử điểm | như cũ | — |
| Công tắc TẮT | ô Điểm y như trước việc này (không nút, không bấm) | bài thử B1 |

## d2 — Kho quà
| Khối thiết kế | App | Khác gì, lý do |
|---|---|---|
| Đầu màn "Đổi quà bằng điểm" + nút lùi | có | — |
| Khối điểm cam (`dq-hero`) | có, số `/diem` | — |
| Ô "Quà của tôi" + "2 chờ nhận" | có | — |
| Dải nhắc "Phiếu … còn 2 ngày — nhớ ghé quầy" | "Phiếu … hết hạn 28/11/2026 — nhớ ghé quầy nhận nhé." | (a) hợp đồng chỉ có `nhac` (bool) + `het_han`; phiếu dặn "App KHÔNG tự tính hạn" → hiện ngày hạn thay số ngày còn |
| 6 thẻ quà, nút, chip, thẻ mờ | đủ 5 kiểu, đúng thứ tự POS | — |
| Huy hiệu ly cà phê / túi / hộp trà theo từng quà | hiện vật → `m-gift`, voucher → `m-ticket`; có `anh` POS → ảnh POS | (a) POS chỉ trả `anh` (URL) + `loai`; phiếu B2 chốt huy hiệu theo `loai`. 3 symbol coffee / bag / gift đã chép vào index.html |
| Thẻ 2 (ảnh vỡ trong ảnh App) | ảnh POS giả `https://anh.tuquyduong.test/…` không tải được | (b) dữ liệu thử — ca thử chứng minh App dùng ảnh POS khi có |
| Ghi chú cuối màn | có | — |

## d3 — Bảng PIN đổi quà
| Khối | App | Khác gì |
|---|---|---|
| Tiêu đề, tên quà, "Trừ 500 điểm · Còn lại 750 điểm", chấm, bàn phím | có (PinSheet chung, prop `khoaTieuDe` + `tren`) | — |

## d4 — Đã đổi quà! (voucher)
| Khối | App | Khác gì |
|---|---|---|
| Khối "Điểm còn lại" | có — số `diem_con` POS (ảnh App 760 vì POS giả CỐ Ý trả khác 750) | (b) |
| Huy hiệu vé, tiêu đề, câu, mã nét đứt, 2 nút | có | — |

## d5 — Phiếu quà
| Khối | App | Khác gì |
|---|---|---|
| Tên, "Đổi … điểm · hạn nhận …", khung QR, "Mã phiếu: …", 2 câu dưới | có (VeQR + viền quét + giữ màn sáng của Mã thành viên) | mã / ngày mẫu khác (b) |
| Tab sáng "Trang chủ" trong ảnh thiết kế | tab "Ưu đãi" sáng | thiết kế chụp tạm; đường dẫn /uudai/qua/<mã> thuộc tab Ưu đãi |

## d6 — Quà của tôi
| Khối | App | Khác gì |
|---|---|---|
| Dải hướng dẫn + "hoàn lại điểm" đậm | có | — |
| Chờ nhận: "Còn 2 ngày · hạn 28/11/2026" (hồng) | "Sắp hết hạn · hạn 28/11/2026" (hồng) | (a) không tự tính số ngày (như d2) |
| "Hết hạn 10/11 · đã hoàn 1.200 điểm" | "Hết hạn 10/11/2026 · đã hoàn 1.200 điểm" | ngày đủ năm cho cùng một kiểu ngày ở cả màn (b — chữ sửa được ở /admin) |
| Huy hiệu theo từng quà | `anh` POS hoặc `m-gift` | (a) như d2 |

## Mọi thứ mới có khoá + data-nd (CLAUDE.md §11)
Danh mục `src/noiDung/nd/doiQua.js` (56 mục, công tắc `hien.dq` battat mặc định tắt; chữ POS = mục khoá `dq.pos`, `dq.diemPos`, `dq.loiPos`). Bài thử B8: mọi `data-nd`
trên 4 màn có trong danh mục; bản /admin sửa `dq.ud.nut`, `dq.kho.rong` → màn đổi đúng.
