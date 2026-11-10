# KH-UI-5e — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-UI-5e`; cây sạch; `git fetch origin viec/KH-UI-5e`: HEAD = FETCH_HEAD = `390c2e0` (không kéo gì).
- `git log --oneline -3` lúc mở:
  - `390c2e0 PHIEU: KH-UI-5e`
  - `deabea2 TIEN-DO: mo KH-UI-5e (luoi 6 o + Sap toi, Ngay can nho, Van khan); them KH-UI-5f (Xe co, Uong thuoc, Chu ky); quyet dinh 10.11`
  - `c9c32a4 TIEN-DO: KH-UI-5d xong (chat soat cuoi DAT, gop PR)`
- Giữa phiên không có thông báo đổi model.
- Hook mở phiên báo "kéo nhánh: đã có đủ commit của origin — không kéo" và "cai_thu_vien: npm ci xong".

## Câu hỏi
(không có)

## Phát hiện (ngoài phạm vi, không sửa)
- Phiếu A1 viết "lưới 2 cột × 3 hàng" nhưng lớp `.tl-g.six` của demo là `repeat(3,1fr)` = **3 cột × 2 hàng** (`ke_hoach.css`, `.tl-g.six`; demo dòng 1684). Đã làm theo demo (3 × 2); xưng hô "anh" → 5 ô (3 + 2) vẫn đều.
- `src/App.jsx` (cấm sửa) chỉ truyền `id` cho `TienIch` và `moTienIch(id)` chỉ nhận một mã → mở một dịp cúng `/kehoach/vankhan/<dịp>` phải tự đẩy lịch sử + phát `popstate` (`diDen` / `luiDen` trong `components/dungKeHoach.js`; `dieuHuong.js` nghe `popstate`) và `TienIch` đọc `<dịp>` từ địa chỉ trình duyệt. Chạy đúng (bài thử Chromium: mở, Back, Tiến, mở thẳng, quay lại). Nên để App truyền `r.tham.dip` ở lần sửa App sau.
- `dist/` / `.nhap_thu/` do bài thử dựng — không commit (đã không có trong `git status` sau commit).
- Chu kỳ / Xe cộ / Uống thuốc: ô chỉ báo "Tiện ích này sắp có" — KH-UI-5f thay; chưa có đường dẫn riêng (đúng phiếu A3).
- Màn rộng ≥ 1024 px: chưa có mẫu màn to cho các màn này (`thiet_ke/mau_man_to/`), chưa đối chiếu.
- Plan chưa nhờ agent phụ soát (bước 3): ghi ở CHƯA KIỂM.

## Chỗ vá → bài thử → đột biến (việc chỉ đổi `src/`, không có `dot_bien.py` — cổng A17/A18 chỉ áp cho `server/`, `client/src/`; đột biến chạy tay trên bản sao ở nháp, mỗi cái ĐỎ)
| Chỗ vá | Bài thử | Đột biến |
|---|---|---|
| `kehoachLap.ngayKeTiep` 29/02 → 28/02 | thu_KHUI5e B4 "dương 29/02" | VS-NGAY-29-02-KHONG-KEP |
| `kehoachLap.amNgay` 30 âm thiếu → 29 | thu_KHUI5e B4 "30 âm thiếu" | BV-NGAY-30-AM-THIEU |
| `vanKhan.vkNext` Giao thừa = mùng 1 Tết − 1 | thu_KHUI5e C1 "Giao thừa 2027" | VS-GIAO-THUA-KHONG-TRU-MOT |
| `kehoach.coChuKy` ẩn theo xưng hô | thu_KHUI5e A2 | BV-CHU-KY-LUON-HIEN |
| `kehoach.upList` gộp người thân | thu_KHUI5e A4 | BV-SAP-TOI-BO-NGUOI |
| `kehoach.bangCoNhac` việc ảo nhắc / chuông | thu_KHUI5e B4 (3 ca) | BV-NHAC-NGUOI-KHONG-VAO-LICH |
| `kehoach.vkDoc` lọc tick theo dịp thật | thu_KHUI5e D1 "bản hỏng" | VS-DOC-TICK-KHONG-LOC-DIP-LA |
| `duongDan.js` mẫu `/kehoach/:tienich/:dip` | thu_KHUI5e C1 đường dẫn + thu_KHUI5b B5 | BV-DUONG-DAN-DIP |
| `kehoach.tronTuoi` | thu_KHUI5e B4 "tròn N tuổi" | VS-TRON-TUOI-LECH-MOT |
| `kehoach.tickLeVat` khoá dịp + năm | thu_KHUI5e D1 + C2 | VS-TICK-KHONG-THEO-NAM |
| `vanKhan.dienBai` năm mới của Giao thừa | thu_KHUI5e C2 "Giao thừa" | VS-DIEN-BAI-NAM-MOI-SAI |
| `NguoiThan.jsx` hỏi xoá một lần | thu_KHUI5e (Chromium) "Xoá → hỏi lại" | BV-HOI-XOA-NGUOI-XOA-LUON |
Kết quả chạy: 11 đột biến bắt được bằng chạy KHONG_TRINH_DUYET=1 (68 đạt · 1 hỏng … tuỳ cái), `BV-HOI-XOA-NGUOI-XOA-LUON` bắt được trong Chromium (91 đạt · 1 hỏng).

## Bằng chứng nghiệm thu (mỗi mục một dòng)
- A1 lưới 6 ô đúng thứ tự + biểu tượng + chữ nhỏ: thu_KHUI5e "A1 lưới có đúng 6 ô…", "A1 biểu tượng lấy từ bộ của demo", "A1 dòng nhỏ", "A1 hôm nay đúng ngày → nay", Chromium "A1 lưới 6 ô đúng thứ tự trên máy thật", "A1 lưới 3 cột × 2 hàng", "A1 chữ nhỏ dưới ô"; thu_KHUI5b B3 (6 ô).
- A2 ô Chu kỳ ẩn: thu_KHUI5e "A2 ô Chu kỳ ẩn…" (hàm), "A2 xưng hô anh → lưới 5 ô" (dựng), Chromium "A2 xưng hô anh → lưới 5 ô… 3 + 2".
- A3 "Sắp có" + thông báo, không đường dẫn riêng: thu_KHUI5e "A3 ba ô chưa làm → Sắp có", "A3 ba tiện ích chưa làm KHÔNG có đường dẫn riêng", Chromium "A3 bấm Xe cộ → Tiện ích này sắp có", "A3 Uống thuốc, Chu kỳ…".
- A4 dải Sắp tới 3 dòng / trống / Xem tất cả / mở đúng chỗ: thu_KHUI5e "A4 Sắp tới gộp…", "A4 mỗi dòng có chỗ mở", "A4 Sắp tới KHÔNG có Tết…", "A4 dải Sắp tới dưới lưới", "A4 trống → 30 ngày tới chưa có việc gì" (đọc nguồn: upList không bao giờ rỗng vì Mùng 1 / Rằm luôn nằm trong 30 ngày — nhánh trống chỉ là dự phòng, như demo), Chromium "A4 dải Sắp tới có tối đa 3 dòng", "A4 Xem tất cả → màn Sắp tới", "B4 bấm dòng Giỗ Ông nội → mở Ngày cần nhớ".
- B1 hai tab + /kehoach/ngayle → tab Ngày lễ + Back / Tiến: thu_KHUI5e "B1 Ngày cần nhớ…", "B1 mở bằng /kehoach/ngayle…", Chromium "B1 /kehoach/ngayle (mở thẳng)…", "B1 Back từ bài khấn", "B1 Tiến".
- B2 danh sách người thân, văn khấn giỗ, xoá hỏi lại: thu_KHUI5e "B2 danh sách sắp theo lần tới", "B1/B2 Ngày cần nhớ: 2 tab…" (KHÔNG Tặng thẻ quà), Chromium "B2 tab Người thân…", "B2 Văn khấn giỗ ›", "B2 bấm Xoá → hỏi lại", "Huỷ → còn nguyên", "xác nhận Xoá".
- B3 thêm / sửa, bảng nổi: thu_KHUI5e "B3 thêm giỗ âm lịch", "tên rỗng", "tên quá 40", "ngày sai", "năm sinh", "sửa", Chromium "B3 bảng nổi Thêm…", "chọn Ngày giỗ → Âm", "chưa nhập tên", "B3/D1 lưu giỗ âm lịch", "B3 bấm tên → bảng SỬA", "sửa xong lưu cùng id".
- B4 tính ngày + nhắc + chuông: thu_KHUI5e 6 ca "B4 …" (29/02, âm, nhuận, 30 thiếu, tròn tuổi) + "B4 sinh nhật / giỗ thành việc ảo", "B4 chuông trên lịch", "B4 nhắc 1 ngày trước = 20:00", Chromium "B4 giỗ vừa thêm hiện ở dải Sắp tới", "B4 chuông trên ô lịch ngày 25/11".
- B5 tab Ngày lễ giữ nguyên màn 5b: thu_KHUI5e "B5 tab Ngày lễ…" + thu_KHUI5b "B4 Ngày lễ…" (giữ, xanh).
- C1 11 dịp, vkNext quanh Tết, danh sách + thẻ lớn: thu_KHUI5e "C1 đúng 11 dịp", "C1 nội dung CHÉP NGUYÊN từ demo (so từng dòng)", "C1 Giao thừa 2027…", "C1 Mùng 1 Tết", "C1 Mùng 1 & Rằm", "C1 Thanh minh…", "C1 Cúng giỗ lấy giỗ gần nhất", "C1 dipSapXep", "C1 Văn khấn danh sách…", Chromium "C1 danh sách: thẻ lớn Sắp tới = Mùng 1 & Rằm".
- C2 thông tin Tín chủ, lễ vật, bài khấn tô màu, A−/A+: thu_KHUI5e "C2 điền bài khấn…", "ngày > 10 / Giêng / Chạp", "Giao thừa năm cũ / mới", "thiếu thông tin → trống", "tên có ký tự lạ", "C2 một dịp…", "C2 đọc lại: 1/6 đã sắm…", "C2 tick lần hai…", Chromium "C2 bấm thẻ lớn… Tín chủ mặc định = tên khách", "điền Tín chủ + Địa chỉ", "tô màu #FBE7B8", "tick lễ vật đầu → 1/6", "A+ → 19px", "TẢI LẠI trang: vẫn 1/6, 19px, Tín chủ, địa chỉ".
- C3 không Đọc to / Đặt hoa quả; có dòng lưu ý cuối: thu_KHUI5e "C3 không Đọc to…" (nguồn, bỏ chú thích), "C2 một dịp… KHÔNG Đọc to", Chromium "C3 không có Đọc to, Đặt hoa quả; có dòng lưu ý cuối".
- C4 nhắc dịp cúng → Sắp tới, chuông, dải nhắc: thu_KHUI5e "C4 dịp cúng bật nhắc → mốc nhắc tối hôm trước", "C4 việc ảo chỉ từ hôm nay → không quá hạn", "A4 mỗi dòng… Cúng"; Chromium "C4 bật nhắc dịp Mùng 1 & Rằm → kho ghi vk.nhac.r".
- D1 lưu: thu_KHUI5e "D1 bản của 5d đọc được", "D1 bản hỏng từng phần", "D1 bản lưu không phải JSON…", "D1 ghi → đọc lại đủ", "D1 ghi vào kho bị chặn → false", "D1 đủ 100 người", "D1 không thêm khoá lưu mới"; xoá khi đăng xuất / đổi khách: luật `luuMay.js` hiện có áp cho khoá `kh_kehoach` (thu_KHLUU1 xanh; không đổi `luuMay.js`).
- E1 bài mới thu_KHUI5e: 69 ca thuần + dựng (KHONG_TRINH_DUYET=1) / 118 ca có Chromium. E2: thu_KHUI5b sửa 6 chỗ (đỏ trên gốc), thu_KHUI5c / 5d không phải sửa (vẫn xanh trong Chromium), không `## Bài thử cũ sửa`, không bớt ca (75 → 75).
- E3 ảnh 360 / 390 / 430: `so_anh/` (8 màn × 3 cỡ × demo / app / lệch) + `doi_chieu_demo.md`.
- E4 `npm test`, `--day-du`, cổng `tinh` + `chay`: xem mục "Cổng" bên dưới.
- E5 chủ quán thử tay: xem BÁO CÁO · mục CHƯA KIỂM.

## Cổng
(điền sau khi chạy)
