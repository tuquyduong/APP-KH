# KH-THE-3 — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-THE-3`; `git rev-parse --short HEAD FETCH_HEAD` = `158773d` / `158773d` (bằng nhau, không kéo).
```
158773d PHIEU: KH-THE-3
6fa3f38 TIEN-DO: KH-THE-2 xong (PR #38); mo KH-SUA-1 …
8a0ee17 Merge pull request #39 from tuquyduong/viec/KH-QC-1
```

## Bảng "chỗ vá → đột biến" (tay, `dot_bien_tay.js`; 11/11 bị bắt)
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

## Quyết định / lệch phiếu (chủ quán xem)
1. `src/components/TheHoiVien.jsx` ĐÃ CÓ (thẻ nhỏ ở Menu, `Menu.jsx` dùng, ngoài Phạm vi) → giữ nguyên `export default`; khối mới là export có tên `TheHoiVienChung` + `TheHoiVienToi` trong cùng tệp. Phiếu viết như thể tệp chưa có.
2. Xoá `MedHang` / `MedVe` ở `BieuTuong.jsx` (hết chỗ dùng sau khi thay ở 3 màn).
3. Ưu đãi giữ dòng nhỏ "Hạng của bạn" phía trên thẻ (phiếu: giữ đủ chữ THE-2; bản thiết kế không có). Dưới thẻ dùng lại `ud.the.giam` ("mọi đơn hàng"), `ud.the.hetHan` + `ud.the.con`, `ud.the.khongHan` để các khoá cũ ở `taiKhoan.js` (ngoài Phạm vi) không thành khoá mồ côi (thu_KHND3c D1).
4. Bài cũ sửa bộ chọn / ca cho khối mới (không dùng `## Bài thử cũ sửa`): thu_KHTHE2 (huy chương, `.pc-mini`, `.the-ud`, hạn "13/02/2027"), thu_KHHANG2, thu_KHNHANH1, thu_KHUI3d, thu_KHND3c — chỉ phần trình duyệt, nên với `KHONG_TRINH_DUYET=1` vẫn xanh trên gốc.
5. Dải đỏ "Còn N ngày" khi sắp hết hạn nằm dưới thẻ (theo phiếu B1), không còn ở góc thẻ.

## Khác bản thiết kế (ảnh `so_anh/sau/*` ↔ `so_anh/thiet_ke/*`, 390 px)
- Dòng "Hạng của bạn" phía trên thẻ (mục 3). · Chip "Giảm 3% mọi đơn hàng" / "Món đặc biệt giảm 4%" (chữ THE-2). · "Hết hạn 26/11/2026 · còn 12 ngày" xuống dòng riêng (chữ dài hơn mẫu).
- Tên hạng POS giả "Hạng vàng" / khách "Linh" (mẫu: "Vàng" / "Hoa"); thẻ "Nhận ưu đãi khách mới" của App có mà mẫu không vẽ (lý do a/b).
- Ảnh "trước" (`so_anh/truoc`) chỉ có 2 màn (So sánh nhanh, Thanh toán thẻ): các màn khác trên gốc không có thẻ nên ca chụp dừng trước khi chụp.

## Phát hiện (ngoài Phạm vi, không sửa)
- Hai khoá `ud.the.cua` … vẫn dùng; nếu sau này bỏ dòng "Hạng của bạn" thì dọn khoá ở `taiKhoan.js`.
- `ud.the.tutinh` vẫn gắn ở "còn N ngày".

## Bài học
(điền sau `/ra-soat`)
