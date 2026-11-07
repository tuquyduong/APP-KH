# KH-HANG-2 — kế hoạch

Việc THƯỜNG, phiếu không dặn "chờ duyệt kế hoạch" → chạy thẳng.

## Phương án
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| A. Thẻ hạng | `giaHang.js` thêm 2 hàm thuần (`laHangChiCap`, `dongGoi`) + 2 hằng chữ; `TheHang` đọc `het_han: null`, `chi_cap`, `goi[]`. ~25 dòng, 2 file + `hang.css` 3 dòng | viết hết trong `UuDai.jsx` (không hàm thuần) | A: hàm thuần nạp thẳng vào bài thử (ca sai kiểu / thiếu trường chạy cả khi `KHONG_TRINH_DUYET=1`). B ngắn hơn ~8 dòng nhưng chỉ thử được bằng trình duyệt |
| B1. Giờ POS về sau | `ChuongTrinhToi` gọi `dungKho(khoGioHoatDong)` (kho sẵn có, `heThong.js` đã `datGioHoatDong` ngay sau `datBayGio`) — 1 dòng | sửa `heThong.js` phát tín hiệu riêng | Cấm sửa `heThong.js`; A không cần |
| B2. Hai thẻ sinh nhật | `findIndex` thẻ sinh nhật đầu + điều kiện `i === dauTien` — 2 dòng. Thẻ sinh nhật còn lại VẪN `noiBat` như nhau (khi hôm nay sinh nhật) | chỉ thẻ đầu nổi bật | A: ít thay đổi, "nổi bật như nhau" phiếu cho phép |

Bậc thang giá hạng (`bacThang`, A4) không đổi; chỉ sửa chú thích.

## Ca thử ↔ nghiệm thu
- A1: `thu_KHHANG2` Phần 1 (`laHangChiCap`), Phần 2 `khach-co-han / khong-han / hang-tang` ×3 cỡ.
- A2: `dongGoi` (hai gói, rỗng, `chi_cap`, sai kiểu, không đọc `gia_the`, nguồn); Phần 2 `vang-lai` ×3 + `vang-lai-khong-goi`; không nút mua.
- A3: `hangCoGiam` giữ luật; `vang-lai-du-lieu-hong`, `khach-thieu-het-han` (thiếu ≠ null).
- A4: đọc nguồn chú thích `thu_bac`.
- B1: ca `b1-hien` / `b1-an` (`/gio-hoat-dong` chậm 1,8 s, đồng hồ máy lệch ngày) + đọc nguồn `dungKho(khoGioHoatDong)`.
- B2: `b2-chuc` ×3, `b2-moi`; đối chứng K5 `b2-mot-the` (một thẻ vẫn có dòng chúc mừng).
- C1: đọc nguồn import `hang.css`, không màu cứng; không tràn ngang ở 360/390/430.
- D2: `thu_KHUI3d` (fixture v10 + đọc nguồn không còn `gia_the`), `thu_KHCT1` (đọc nguồn B1/B2 + ca hai thẻ sinh nhật).

## Đường song song / K5
- Thẻ hạng khách (`UuDai`) là nơi duy nhất đọc `het_han` / `/hang` cho thẻ; `bacThang` (Menu / TrangMon) không đụng.
- K5: `het_han` có → vẫn "Thẻ hết hạn: …"; khách không hạng, `goi` rỗng → không dòng giá; một thẻ sinh nhật → vẫn chúc mừng.

Soát kế hoạch bằng agent phụ: chưa chạy (kế hoạch nhỏ, tự đối chiếu phạm vi: chỉ 7 file trong Phạm vi).
