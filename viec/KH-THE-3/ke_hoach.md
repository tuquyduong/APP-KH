# KH-THE-3 — Kế hoạch

Việc THƯỜNG (giao diện), Sonnet — chạy thẳng, không chờ duyệt. Chỉ ghi phương án và ca thử; nghiệm thu theo `phieu.md`.

## Phương án

| Phần | A (chọn) | B | Số file / dòng | Rủi ro |
|---|---|---|---|---|
| Khối thẻ | MỘT component `TheHoiVien.jsx` + MỘT css chép nguyên từ bản thiết kế + hàm thuần `theHoiVien.js` | Mỗi màn tự vẽ thẻ | 3 file mới ≈ 70 css + 45 + 30 | B trùng lặp 4 lần, lệch mẫu |
| Ưu đãi | Thay khối `.tier-card.the-ud` (trạng thái co/sap/tang) bằng `<TheHoiVien co="lon">` + dải dưới thẻ; `chua` giữ nguyên | Sửa css `.tier-card` thành tỉ lệ thẻ | `UuDai.jsx` ≈ 25 dòng | Bài cũ đang bám `.the-ud` / `.ud-*` → sửa đúng ca (C2) |
| Đơn chỉ thẻ | Nhánh `laDonChiThe` trong `buocTienTrinh(tt, chiThe)`: danh sách bước `cho_tra → the_kich_hoat`; đơn đồ uống không đổi | Thêm màn riêng | `datDon.js` ≈ 8, `TheoDoiDon.jsx` ≈ 10 | Bước 2 cần % → truyền `phanTram` |
| Chào mừng | `<TheHoiVien chieu>` thay `MedHang` + `.points-card.cm-the` | — | `TheoDoiDon.jsx` ≈ 10 | hạn đọc từ `hanMoiThe` |
| Thẻ nhỏ | `co="vua"` (Thanh toán thẻ), `co="nho"` (So sánh nhanh, dòng thẻ chi tiết đơn 72 px) | — | 3 file ≈ 6 dòng | Không đụng `the-qr` (KH-SUA-1) |

Tổng ≈ 180 dòng app + ≈ 300 dòng thử — trong ngân sách.

## Khoá nội dung mới (theHang.js, §11)
`the.thv.hoiVien` (nhãn "Hội viên"), `the.thv.giam` ("−{phanTram}%"), `the.thv.han` ("Hết hạn"), `the.thv.tang` ("Quán tặng"), `the.thv.khongHan` ("Không thời hạn"),
`the.thv.hanMoi` ("Hạn mới"), `the.thv.aria`, `the.ud.*` (chip, còn N ngày giữ khoá cũ), `the.td.kichHoat` / `.kichHoat.s` ("Thẻ kích hoạt" + dòng phụ), `the.td.dong` ("Thẻ hội viên {hang}"). Mục khoá `pos` / `tutinh` có sẵn.

## Ca thử ↔ nghiệm thu (thu_KHTHE3.js)
- A1 css: 0 màu ngoài demo (hàm đọc màu K9), px trước `cqw`, mọi lớp `thv`. · A2: `mauThe`, `nguoiTrenThe`, `hanTrenThe`. · A3/A4: Chromium + nguồn (aria-label, `chieu`, reduced-motion).
- B1 Ưu đãi Vàng / Kim Cương / tặng / sắp hết hạn; `chua` giữ. · B2 đơn thẻ chờ trả 2 bước, dòng thẻ `.thv.mini`, không 🎟️; đơn đồ uống 4 bước. · B3 Chào mừng. · B4 Thanh toán thẻ + So sánh nhanh.
- C2 bài cũ sửa đúng ca: `thu_KHTHE2.js`, `thu_KHTHE1.js`, và bài khác bám `.tier-card` ở trạng thái có hạng.
- C3 đột biến tay ≥ 5 (`dot_bien_tay.js`).

## Soát kế hoạch (4 câu, tự soát)
Ngoài phạm vi? Không (mọi file có trong `## Phạm vi`; không đụng `App.jsx`, `the-qr`). Cách ngắn hơn? Đã là một component + một css. Ca nào chưa có bài? Bảng trên phủ A1–B4. Đường song song? Thanh toán thẻ chỉ sửa thẻ tóm tắt; `chua` ở Ưu đãi giữ; các màn khác không đổi (C5).
