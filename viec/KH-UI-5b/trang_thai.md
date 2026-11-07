# KH-UI-5b — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-UI-5b`; HEAD = FETCH_HEAD = `525e962` (không cần kéo). Ba dòng log lúc mở phiên:
```
525e962 PHIEU: KH-UI-5b
ab9fe0f TIEN-DO: mo dot 3 song song (KH-SOHD-1 so_hd + tien ve + the QR thuong hieu, hop dong v11; KH-HANG-2 hang HANG-1 v10; KH-UI-5b Ke hoach); duyet 7 mau the QR; thu POS/App 06.11
0d140b3 TIEN-DO: KH-BAO-1 xong (chat soat cuoi DAT, gop PR)
```

## Câu hỏi (không chặn việc — máy chọn mặc định an toàn, chủ quán đổi nếu muốn)
1. **Nút ✕ ở đâu?** Phiếu B7 đặt ✕ "Ẩn ở Lịch và tiện ích đến hết hôm nay" trên banner BẢN NHỎ. Code demo (`todayCard`, dòng ~5398) thì ngược lại: bản nhỏ (`mini`) KHÔNG có ✕, ✕ nằm ở banner Trang chủ và bấm vào thì ẩn hai bản nhỏ. Máy làm theo PHIẾU (✕ trên bản nhỏ, banner Trang chủ không đổi) — khác demo vì phiếu chỉ rõ.

2. **Ba ô theo phiếu, demo cuối có khác.** Demo (patch35 trở đi) chỉ còn 6 ô trong lưới (Theo mùa, Văn khấn, Ngày cần nhớ, Xe cộ, Uống thuốc, Chu kỳ) + dải "Sắp tới", và Ngày lễ gộp vào "Ngày cần nhớ" (hai tab). Máy làm đúng phiếu B3/B4 (ba ô riêng: Theo mùa, Ngày lễ, Sắp tới). Chủ quán muốn đúng demo cuối thì chuyển cho 5c gộp.
3. **Ô "hôm nay" trong lưới tháng.** Demo: ô hôm nay cao 150 px vì lớp `.today` của lưới trùng lớp banner `.today` (lỗi CSS của demo). App giữ ô bình thường. Muốn y như demo (ô dài) thì nói.

## Phát hiện (ngoài phạm vi / chưa làm)
- Khối **"Từ TQD"** (`calTqd`), chấm vàng và mục chú giải: ẩn — POS chưa có sự kiện (hạn voucher / hạng / đơn hẹn giờ). Cần cửa `/api/kh` mới nếu chủ quán muốn có.
- **Banner "hôm nay"**: chữ khuyến mãi thật chưa có (`HOM_NAY` trống) nên bản nhỏ chưa hiện ở app thật. Có chữ thì hiện cả Trang chủ lẫn hai màn Kế hoạch / tiện ích.
- **Nút "Xoá toàn bộ dữ liệu Kế hoạch trên máy này"**: demo không có → dòng nhỏ cuối `/kehoach`, bấm hai lần (D3).
- Nhắc việc chỉ hiện khi MỞ app (thanh `calNoti`, và số "n việc hôm nay" ở ô Trang chủ); đẩy thông báo = KH-TB-1.
- Bản Kế hoạch chỉ hiện khi đã biết khách là ai (`daBiet`, như trắc nghiệm): mở app khi mất mạng (/toi lỗi) thì việc ẩn tới khi hỏi được /toi.
- `thu_KHUI2.js` (B11) cấm `new Date(` trong `src/pages` + `src/components`: thứ trong tuần tính bằng `thuTrongTuan` ở `src/kehoach.js`. Không sửa bài đó (ngoài phạm vi).
- Nguồn Sắp tới của 5c (người thân, văn khấn, xe, thuốc, chu kỳ) chưa có; `upList` làm sẵn chỗ nối (một mảng nguồn).
- Demo "Món hợp tiết" tô nền theo nhóm món (`catOf`); app dùng nền kem (chưa có bảng màu nhóm).
- Chưa chụp được ảnh `Món hợp tiết` / Theo mùa có món vì chưa có menu giả trong kịch bản chụp; kiểm bằng bài thử với menu mẫu.
