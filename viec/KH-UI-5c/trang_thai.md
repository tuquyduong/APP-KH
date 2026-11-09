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
- `TienIch.jsx`: "Sắp tới" gọi `upList` (đã dùng `cacLan`, việc lặp hiện đúng); chỉ phải gỡ prop `khiAn` chết truyền cho `BannerNho` (soát vòng 1 bắt) — đã gỡ.
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

## Soát độc lập (`/ra-soat`, vòng 1) — KHÔNG ĐẠT → đã sửa (báo cáo rút gọn, nguyên ý)
Lỗi tìm được và cách xử lý (commit `fd5635d`):
1. `BangNgay.jsx` `them`/`luuSua` luôn trả '' dù `lam()` báo hỏng → mất chữ khách gõ khi kho chặn (K5; vế "giữ chữ" của ca D2 5b bị bỏ khi sửa H2). **Sửa**: trả lỗi khi `lam()` false, form giữ nguyên.
2. `tickLan` không đảo được lần dưới mốc `moc` nhưng UI báo "Đã bỏ đánh dấu". **Sửa**: lần dưới mốc không đổi (ca mới trong `thu_KHUI5c`).
3. `quaHan` lùi 400 ngày cho cả việc thường → việc thường quá hạn > 400 ngày biến mất, lệch chuông lịch. **Sửa**: chỉ việc lặp bị giới hạn (ca mới).
4. `DaiNhacViec` báo mốc cũ sau khi máy ngủ / tab ẩn. **Sửa**: khoảng > 3 phút giữa hai lần hỏi thì bỏ qua mốc.
5. Gỡ prop `khiAn` chết ở `TienIch.jsx`; bỏ nút "Bỏ qua lần này" trùng "Đã làm" khi chỉ lỡ 1 lần; bỏ hai biểu thức vô nghĩa trong bài thử.
6. (Chromium, tự bắt khi sửa) bánh xoay lệch 1 dòng do thiếu `scroll-padding` → phút mở ra 05 thay vì 00, và hẹn giờ cuộn dùng giá trị cũ; sửa ở `BanhXoay.jsx` + `bang_ngay.css`, ca "vuốt tới 14 → 14:00" khoá.
Nghi ngờ nhận, chưa làm (ghi để chủ quán biết): thanh nhắc "10 phút nữa" không tự đếm khi đứng yên ở màn (chỉ tính lại khi vẽ lại); "Uống 1/2" thành việc "Uống" 1/2; đổi việc đã xong sang có lặp thì hiện quá hạn.
Nghiệm thu: 20/22 → H4 (dòng HEAD ĐÃ KIỂM) và H5 (thử tay) đã bổ sung ở dưới. Còn lại có bằng chứng ở `thu_KHUI5c.js` / `thu_KHUI5b.js` (xem bảng ca ↔ A1…G1 trong `ke_hoach.md`).

## Chủ quán thử tay trên điện thoại (H5)
1. Mở /kehoach, chạm ô ngày 20: bảng nổi lên → gõ "Mua hoa", chạm "🕘 Giờ sự kiện" xoay 09:00, "🔔 Hẹn giờ nhắc" → "Chọn ngày giờ khác…" → 2 ngày trước lúc 20:00 → Thêm → ô 20 có chuông. Gõ "Gọi điện" + Thêm → vào ngay (cả ngày). Vuốt thanh đầu bảng xuống để đóng.
2. Thêm "Uống thuốc bổ" → "↻ Lặp lại" → "Sau khi xong…" 30 ngày → Thêm; tick → việc dời 30 ngày → bấm "Hoàn tác" (trong 5 giây) → về lại hôm nay.
3. Thêm một việc ngày hôm qua → đầu màn hiện "⚠️ 1 việc quá hạn" → bấm → "→ Hôm nay". (Nhắc 15 phút trước: thêm việc 20 phút nữa, nhắc "Trước 15 phút", để App mở → sau 5 phút có dải nhắc.)

## Cổng
`node tu_chay/cong.js tinh . 765b141^ HEAD viec/KH-UI-5c`: chỉ còn `✗ [A19]` (chờ dòng HEAD ĐÃ KIỂM — ghi ở cuối file này sau lần chạy `chay`).
`npm test` (kiem_tra_truoc_khi_giao.js) + `--day-du`: 41 đạt · 0 hỏng (bản chạy giữa việc); chạy lại lần cuối ở HEAD sau soát.

## Bài học
- **KHOÁ (đã làm)**: ca Chromium "vuốt bánh xoay tới 14 → 14:00" (bắt lỗi `scroll-snap` lệch dòng); ca "tick dưới mốc đã rà không đảo", "việc thường quá hạn > 400 ngày vẫn tính" trong `thu_KHUI5c.js`; ca đo chiều cao ô hôm nay trong trình duyệt (F2).
- **NGUYÊN TẮC (đề xuất, ngoài Phạm vi — `KHUON_LOI.md`)**: K9/K10 "Hai nơi tính song song phải cùng giới hạn" (`quaHan` vs `danhDauNgay`) và "hàm lưu trả false thì chỗ gọi phải giữ chữ khách" (`lam()`); đã gây: soát vòng 1 KH-UI-5c; dấu hiệu: `return ''` sau lệnh lưu không đọc kết quả; chặn: ca K5 kho chặn giữ chữ.
- **BỎ**: đồng hồ giả làm bánh xoay phải `runFor` (chỉ ở bài thử); `git worktree` / `sed -i` / `npx` bị người gác chặn → dùng Edit, `git show`, python.
- Dọn: chưa có lời dặn nào để đề xuất xoá.

## Báo cáo 7 mục
- **VIỆC**: KH-UI-5c — bấm ngày → bảng việc, lặp, nhắc, quá hạn, Hoàn tác, gõ nhanh có ngày, tìm.
- **ĐÃ SỬA**: `kehoachLap.js` (mới), `kehoach.js`, `KeHoach.jsx`, `TrangChu.jsx` (số đỏ + ✕ banner), `App.jsx` (+1 dải), 6 component mới, `bang_ngay.css`, `ke_hoach.css` (F2), gỡ `ThemViec.jsx`.
- **BÀI THỬ**: `thu_KHUI5c.js` 52 ca (104 có Chromium), `thu_KHUI5b.js` 75; đỏ trên gốc, 6 đột biến bắt được; `npm test --day-du` 41 đạt · 0 hỏng.
- **ĐÃ RÀ K4**: `viecNgay/upList/nhac/gio/doiXong/khiAn` grep toàn `src/` (soát độc lập vòng 1).
- **CHƯA KIỂM**: máy thật (điện thoại, trình duyệt Zalo), rung, nhắc khi App tắt (KH-TB-1); thanh nhắc không tự đếm lại khi đứng yên.
- **GIT**: nhánh `viec/KH-UI-5c`, chưa PR.
- **BÀI HỌC**: xem trên.

✓ CỔNG CHẠY ĐẠT (`node tu_chay/cong.js chay . 765b141^ HEAD viec/KH-UI-5c`, `KHONG_TRINH_DUYET=1`; chỉ có cảnh báo A16 vì bài đổi chết ở dòng nạp trên gốc).
HEAD ĐÃ KIỂM: 2fdc785
