# KH-THE-3 — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-THE-3`; `git rev-parse --short HEAD FETCH_HEAD` = `158773d` / `158773d` (bằng nhau, không kéo).
```
158773d PHIEU: KH-THE-3
6fa3f38 TIEN-DO: KH-THE-2 xong (PR #38); mo KH-SUA-1 …
8a0ee17 Merge pull request #39 from tuquyduong/viec/KH-QC-1
```

## Bảng "chỗ vá → đột biến" (tay, `dot_bien_tay.js`; 14/14 bị bắt)
| Chỗ | Đột biến |
|---|---|
| `mauThe` bỏ dấu + chữ thường | VS-MAUTHE-PHAN-BIET-HOA-THUONG |
| `mauThe` Kim Cương → mẫu kc | VS-KIM-CUONG-DUNG-MAU-VANG |
| `hanTrenThe` quán tặng | VS-HAN-QUAN-TANG-GHI-HET-HAN |
| `buocTienTrinh` nhánh đơn chỉ thẻ | BV-DON-CHI-THE-CON-BUOC-PHA-CHE |
| css giảm chuyển động tắt ánh lướt | VS-ANH-LUOT-VAN-CHAY-KHI-GIAM-CHUYEN-DONG |
| css chỉ màu của demo | VS-CSS-MAU-NGOAI-DEMO |
| dòng thẻ bỏ biểu tượng 🎟️ | BV-CON-EMOJI-VE-O-DONG-THE |
| Ưu đãi không chạy ánh lướt | VS-UU-DAI-THE-CHAY-ANH-LUOT |
| Chào mừng có ánh lướt | BV-CHAO-MUNG-THE-KHONG-CHIEU |
| Thanh toán thẻ cỡ vừa | VS-THE-VUA-O-THANH-TOAN-DUNG-CO-NHO |
| thẻ nhỏ aria-hidden | VS-THE-NHO-KHONG-AN-KHOI-TRINH-DOC |
| css Kim Cương giảm chuyển động (soát v1) | VS-KIM-CUONG-VAN-CHAY-ANH-LUOT-KHI-GIAM-CHUYEN-DONG |
| css tên dài không đẩy hạn (soát v1) | VS-TEN-DAI-DAY-HAN-RA-NGOAI-THE |
| Chào mừng hiện chữ hạn POS khi thẻ không vẽ được (soát v1) | BV-CHAO-MUNG-MAT-HAN-KHI-KHONG-VE-DUOC-THE |

## Quyết định / lệch phiếu (chủ quán xem)
1. `src/components/TheHoiVien.jsx` ĐÃ CÓ (thẻ nhỏ ở Menu, `Menu.jsx` dùng, ngoài Phạm vi) → giữ nguyên `export default`; khối mới là export có tên `TheHoiVienChung` + `TheHoiVienToi` trong cùng tệp. Phiếu viết như thể tệp chưa có.
2. Xoá `MedHang` / `MedVe` ở `BieuTuong.jsx` (hết chỗ dùng sau khi thay ở 3 màn).
3. Ưu đãi giữ dòng nhỏ "Hạng của bạn" phía trên thẻ (phiếu: giữ đủ chữ THE-2; bản thiết kế không có). Dưới thẻ dùng lại `ud.the.giam` ("mọi đơn hàng"), `ud.the.hetHan` + `ud.the.con`, `ud.the.khongHan` để các khoá cũ ở `taiKhoan.js` (ngoài Phạm vi) không thành khoá mồ côi (thu_KHND3c D1).
4. Bài cũ sửa bộ chọn / ca cho khối mới (không dùng `## Bài thử cũ sửa`): thu_KHTHE2 (huy chương, `.pc-mini`, `.the-ud`, hạn "13/02/2027"), thu_KHHANG2, thu_KHNHANH1, thu_KHUI3d, thu_KHND3c — mỗi bài thêm 1 ca nguồn "TheHoiVienChung" (đỏ trên gốc kể cả không trình duyệt) + sửa bộ chọn ca trình duyệt.
5. Dải đỏ "Còn N ngày" khi sắp hết hạn nằm dưới thẻ (theo phiếu B1), không còn ở góc thẻ.

## Khác bản thiết kế (ảnh `so_anh/sau/*` ↔ `so_anh/thiet_ke/*`, 390 px)
- Dòng "Hạng của bạn" phía trên thẻ (mục 3). · Chip "Giảm 3% mọi đơn hàng" / "Món đặc biệt giảm 4%" (chữ THE-2). · "Hết hạn 26/11/2026 · còn 12 ngày" xuống dòng riêng (chữ dài hơn mẫu).
- Tên hạng POS giả "Hạng vàng" / khách "Linh" (mẫu: "Vàng" / "Hoa"); thẻ "Nhận ưu đãi khách mới" của App có mà mẫu không vẽ (lý do a/b).
- Ảnh "trước" (`so_anh/truoc`) chỉ có 2 màn (So sánh nhanh, Thanh toán thẻ): các màn khác trên gốc không có thẻ nên ca chụp dừng trước khi chụp.

## Phát hiện (ngoài Phạm vi, không sửa)
- Hai khoá `ud.the.cua` … vẫn dùng; nếu sau này bỏ dòng "Hạng của bạn" thì dọn khoá ở `taiKhoan.js`.
- `ud.the.tutinh` vẫn gắn ở "còn N ngày".

## Soát độc lập — vòng 1 (nguyên báo cáo rút gọn; agent độc lập)
KHÔNG ĐẠT, 3 lỗi: (1) `the_hoi_vien.css` tên khách dài đẩy hạn ra ngoài thẻ, bị cắt (K5) → sửa: phần bổ sung cuối `the_hoi_vien.css` (min-width:0 + ellipsis, `.phai{flex:none}`), ca `B1 tên dài 360`.
(2) `TheoDoiDon.jsx` Chào mừng: thẻ không vẽ được (không biết hạng) thì mất hạn POS (K5) → sửa: `TheHoiVienToi` nhận `thay`, ca `B3 không vẽ được thẻ`.
(3) Kim Cương giảm chuyển động vẫn có `animation-name:sang-kc` (A4) → sửa luật media riêng cho `.thv.kc.chieu`, ca `B3 Kim Cương giảm chuyển động` + ca nguồn.
Nghi ngờ đã xử: "Thẻ kích hoạt" chỉ tích khi `xong` (datDon.js); `.thv.mini{display:block}`; `.thv.chieu{cursor:default}`; `soThang > 0`; mục 4 trên cập nhật.
Nghi ngờ để lại: thẻ vừa ở Thanh toán thẻ rơi về thẻ hồng nếu không tìm được hạng (chỉ khi gói không còn bán — lúc đó không vẽ thẻ); `hetHanTuChu` lấy ngày đầu trong `ghi_chu` (hợp đồng chỉ ghi một ngày); `TheHoiVienToi` dùng hạng /toi khi đơn không có hạng (có thể cũ ngay sau khi trả — chấp nhận, thẻ đúng sau lần làm mới).
Nghiệm thu: 17/19 lúc soát; C4 (ảnh "trước" chỉ 2/6 màn — gốc không có thẻ nên ca chụp dừng) và C5 (so ảnh màn ngoài phạm vi gốc ↔ nhánh) CHƯA làm; C6 ghi bên dưới; C7 chủ quán thử tay.

## Phát hiện (thêm, ngoài Phạm vi)
- `ud.the.chipDb` (taiKhoan.js) nhãn admin ghi "(chưa có hạng)" nhưng nay dùng cả khi có hạng — sửa nhãn ở việc sau.
- Một số quy tắc css chết trong khối chép nguyên (`.thv.mini .mini-ten`, `.thv.mini .thv-than…{display:none}`) — chấp nhận vì chép nguyên từ bản thiết kế.

## CHƯA KIỂM
C5 (so ảnh toàn bộ màn ngoài phạm vi), ảnh "trước" đủ 6 màn, thử tay trên điện thoại thật / trình duyệt Zalo, phông Inter thật khi đo tràn tên.

## Bài học
- KHOÁ (đã làm): ca "tên dài nhất ở 360 px, hạn vẫn đọc đủ"; ca `reducedMotion` đo `animation-name` cho CẢ Vàng và Kim Cương; ca "thẻ không vẽ được vẫn hiện thông tin ở chỗ khác".
- NGUYÊN TẮC (đề xuất K11, ngoài Phạm vi): chép nguyên CSS từ bản thiết kế vẫn phải thử với dữ liệu dài hơn mẫu; đo hiệu ứng bằng computed style, không chỉ khớp regex CSS. Đã gây: KH-THE-3 soát v1.
- NGUYÊN TẮC (đề xuất): trước khi tạo tệp theo phiếu, `ls` xem tệp đã có chưa (TheHoiVien.jsx có sẵn bị ghi đè nhầm, khôi phục kịp).
- BỎ: cổng GitHub chạy `--trinh-duyet` khác máy — chỉ một lần, đã có ghi chú ở CLAUDE.md §9.

## Báo cáo 7 mục
VIỆC: KH-THE-3 thẻ hội viên Vàng & Kim Cương dùng chung. ĐÃ SỬA: danh sách các tệp ở `git diff 158773d^ HEAD`. BÀI THỬ: thu_KHTHE3 (23 ca không trình duyệt / 105 có Chromium) + 5 bài cũ sửa ca; 14 đột biến bị bắt. ĐÃ RÀ K4: grep MedHang / the-mini / cm-the / 🎟️ — sạch. CHƯA KIỂM: xem trên. GIT: nhánh viec/KH-THE-3, không merge, không PR. BÀI HỌC: trên.
