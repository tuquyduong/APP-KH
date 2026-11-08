# KH-UI-5c — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-UI-5c`; HEAD = FETCH_HEAD = `765b141` (không cần kéo; hook mở phiên báo "đã có đủ commit của origin"). Ba dòng log lúc mở phiên:
```
765b141 PHIEU: KH-UI-5c
4abbd0a TIEN-DO: mo KH-UI-5c (bam ngay -> bang viec cua ngay, viec lap, nhac truoc, qua han, hoan tac); quyet dinh 08.11 (the hang chung gio, hang co truoc, tich diem theo mon); them KH-THE-1 cho POS; thu App 07.11 + POS 08.11
0208717 TIEN-DO: KH-UI-5b xong (chat soat cuoi DAT, gop PR)
```
Model: phiên chạy một model suốt (không có thông báo đổi model giữa phiên).

## Câu hỏi (không chặn việc — máy chọn mặc định an toàn, chủ quán / chat soát đổi nếu muốn)
1. **F1 chạm `TrangChu.jsx` ngoài chữ "CHỈ số đỏ quá hạn".** Phiếu F1 đòi ✕ "Ẩn ở Lịch và tiện ích đến hết hôm nay" đặt ĐÚNG chỗ demo (`todayCard`: `mini ? '' : t-x`, ✕ ở banner LỚN Trang chủ, bấm thì `todayHide` ẩn bản nhỏ) — mà ✕ phải sống ở banner Trang chủ, tức `TrangChu.jsx`; mục Cấm lại viết "`TrangChu.jsx` CHỈ để thêm số đỏ quá hạn". Hai câu trái nhau → máy làm F1 tối thiểu (6 dòng: `khiAn={anBanner}` + một `Thongbao`, chỉ khi đã đăng nhập + biết khách) vì F1 là mục nghiệm thu rõ; chưa đăng nhập thì không có ✕ (không có nơi lưu cờ). Chữ khuyến mãi `HOM_NAY` hiện trống nên ✕ chưa hiện ở app thật. Chủ quán không đồng ý thì gỡ `khiAn` ở `TrangChu.jsx` (bài thử `F1` sẽ đỏ đúng chỗ).
2. **Khuôn Hoàn tác.** Phiếu dặn dùng lại `ThongBaoXoa` (`GioHang.jsx`, hàm cục bộ chưa export) hoặc tách chung — sửa `GioHang.jsx` thì phải `## Câu hỏi` trước. Máy KHÔNG sửa `GioHang.jsx`: tạo `ThongBaoHoanTac.jsx` mới, cùng lớp CSS `.toast.co-nut` (đã có ở `gio_xoa.css`), 16 dòng. Còn lại hai bản cùng khuôn (một ở giỏ hàng, một ở Kế hoạch) → việc sau cho `GioHang.jsx` dùng lại `ThongBaoHoanTac`.
3. **Việc lặp: bỏ "→ Hôm nay / → Mai"** ở bảng quá hạn (chỉ giữ cho việc thường và "sau khi xong N ngày"): dời ngày bắt đầu của việc lặp làm lệch cả chuỗi. Việc lặp có "✓ Đã làm", "✓ Đánh dấu cả N lần", "Bỏ qua lần này", "Xoá". Phiếu D2 liệt kê nút chung — nếu muốn dời cả chuỗi lặp thì nói.
4. **Sửa việc không đổi được ngày bắt đầu** (chỉ tên · giờ · lặp · nhắc, đúng A3). Muốn dời ngày: xoá + thêm, hoặc (việc quá hạn) "→ Hôm nay / → Mai".

## Phát hiện (ngoài phạm vi / chưa làm)
- **KH-UI-5b báo sai về ô "hôm nay"**: `doi_chieu_demo.md` của 5b ghi "ô bình thường (50 px) vì app nạp `ke_hoach.css` sau" — thực tế luật banner `.today` (nền gradient, đệm 16, bo 20, bóng) vẫn lọt vào ô `.cd.today` (thấy khi chụp ảnh KH-UI-5c: ô cao hơn, nền hồng). Đã sửa ở `ke_hoach.css` (F2) + bài thử đo chiều cao ô trong Chromium. Bài học: "đã gỡ lỗi demo" phải đo bằng trình duyệt, không đoán từ thứ tự CSS.
- Nhắc việc chỉ khi App đang mở (thanh nhắc + dải báo + rung); App tắt = KH-TB-1 (thông báo đẩy), chưa làm. Chữ trên màn ghi đúng "Nhắc hiện khi bạn đang mở App."
- Mốc đã báo của dải nhắc nhớ trong BỘ NHỚ trang (không thêm khoá `localStorage` vì cấm sửa `luuMay.js`): mở lại App sau mốc thì dải KHÔNG báo lại (đúng ý — mốc lúc App tắt không báo), thanh nhắc ở màn Kế hoạch lo phần đó.
- Việc lặp lỡ: đếm lùi tối đa 400 ngày; lần xong giữ 24 lần gần nhất, lần cũ hơn coi như đã rà (mốc `moc`).
- `TienIch.jsx` không phải sửa: "Sắp tới" gọi `upList` (đã dùng `cacLan`, việc lặp hiện đúng) và ô Trang chủ dùng `viecNgay` (lần ảo của việc lặp).
- Ba danh sách tiện ích (`duongDan.js` / `KeHoach.jsx` / `TienIch.jsx`) vẫn tách — thuộc KH-UI-5d.
- Cờ Playwright: bài thử Chromium dùng `page.clock` (đồng hồ giả) nên bánh xoay (chờ 90 ms sau khi ngừng cuộn) phải `clock.runFor` — ghi trong bài thử.
- Hợp lệ không chặn (K5): đọc được bản lưu 5b (nhac true/false, giờ bắt buộc); tên 120 ký tự; 29/2/2028; 500 việc báo đúng lý do.

## Bài thử / đột biến
Xem `bang_chung_do.txt`. `SỐ CA`: thu_KHUI5c 50 · thu_KHUI5b 75 (khi `KHONG_TRINH_DUYET=1`; có Chromium: thu_KHUI5c 102). Đỏ trên gốc: thu_KHUI5c (không nạp được), thu_KHUI5b 59 đạt · 9 hỏng.
Bảng "chỗ vá → đột biến" (việc chỉ đổi `src/`, không có `dot_bien.py`; chạy tay trên bản sao ở nháp):
| Chỗ vá | Đột biến (tên) | Kết quả |
|---|---|---|
| lặp tháng kẹp ngày cuối tháng | `VS-LAP-KHONG-KEP-NGAY-CUOI-THANG` | 47 đạt · 3 hỏng |
| nhắc "ngày trước" ra số âm | `VS-NHAC-NGAY-TRUOC-CONG-THAY-TRU` | 48 đạt · 2 hỏng |
| quá hạn chỉ trước hôm nay | `VS-QUA-HAN-TINH-CA-HOM-NAY` | 45 đạt · 5 hỏng |
| mốc đã rà nhích khi cắt 24 lần | `BV-MOC-KHONG-NHICH-KHI-CAT-24` | 49 đạt · 1 hỏng |
| "sau khi xong N ngày" tính từ ngày bấm | `VS-SAU-KHI-XONG-TINH-TU-NGAY-HEN` | 49 đạt · 1 hỏng |
| gõ ngày: qua 60 ngày → năm sau | `BV-GO-NGAY-KHONG-QUA-NAM-SAU` | 49 đạt · 1 hỏng |

## Cổng
`node tu_chay/cong.js tinh . 765b141^ HEAD viec/KH-UI-5c`: chỉ còn `✗ [A19]` (chờ dòng HEAD ĐÃ KIỂM — ghi ở cuối file này sau lần chạy `chay`).
`npm test` (kiem_tra_truoc_khi_giao.js) + `--day-du`: 41 đạt · 0 hỏng (bản chạy giữa việc); chạy lại lần cuối ở HEAD sau soát.
