# KH-UI-5f — Tiện ích theo demo cuối: Xe cộ, Uống thuốc, Chu kỳ + Văn khấn điền sẵn Tín chủ / Địa chỉ

<!-- Chat App KH soạn 11.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 15.11. Mở trên main SAU KHI KH-ND-3a đã gộp (nền nd() + K10, CLAUDE.md §11).
     Chạy SONG SONG với KH-UI-5g, KH-ND-3b, KH-ND-3e (tệp riêng). Tệp nhóm `src/noiDung/nd/tienIch.js` (mảng `TIEN_ICH`, đang rỗng) + dòng của nó trong `src/noiDung/nd/index.js`
     chat ĐÃ tạo sẵn → MỌI chữ / ảnh / nút MỚI của việc này khai ở `tienIch.js` và đọc qua `nd()` / `<Chu>` ngay từ đầu (K10: tệp mới 0 chữ cứng, tệp sửa không tăng).
     Tách từ KH-UI-5e (10.11): lưới 6 ô đã có, 3 ô Xe cộ / Uống thuốc / Chu kỳ đang "Sắp có" (`BieuTuongTienIch.jsx`, `TienIch.jsx`) — việc này thay bằng tiện ích thật.
     Nguồn: `thiet_ke/app_kh_demo.html` — Xe cộ BẢN CUỐI (PATCH35 "xe cộ nhiều phương tiện"): CAR_T, itemState, docState, vehState, renderCar, carOne, carAddForm, carSchedForm,
     carLogForm, carDone; Uống thuốc: nhánh `id === 'med'` + medForm / medSave / medToday; Chu kỳ: nhánh `id === 'cyc'` + cycNow + CYC_PH (chữ dưỡng sinh `data-cms="t:cyc.N"`);
     upList (Sắp tới gộp xe / chu kỳ). Đọc CLAUDE.md §5, §6 (giờ VN theo `bayGio()`), §8 (dữ liệu chỉ trên máy), §11. -->

## Mục tiêu
Khách có đủ 6 tiện ích như demo: theo dõi bảo dưỡng và giấy tờ mọi xe trong nhà, nhắc giờ uống thuốc, theo dõi chu kỳ riêng tư. Văn khấn tự điền sẵn Tín chủ / Địa chỉ cho mọi bài.
Mọi dữ liệu chỉ nằm trên máy khách; tin nhắc không lộ nội dung riêng tư.

## Nghiệm thu

### A. Xe cộ (`/kehoach/xeco`, demo bản cuối)
- A1 Danh sách xe: mỗi xe (biểu tượng theo loại, tên, biển số hoặc loại, số km) + dòng trạng thái ("● <hạng mục> · còn N km / N ngày" khi sắp tới hạn, "✓ Mọi hạng mục còn hạn"); "＋ Thêm xe";
  ô lưới hiện "N xe · M sắp tới hạn" / "N xe · ổn" (toolBadge). Chưa có xe → lời mời thêm xe (không xe mẫu).
- A2 Thêm / sửa xe: tên, biển số (tuỳ chọn), loại (Xe máy · Ô tô · Xe đạp điện · Khác), số km → lịch bảo dưỡng + giấy tờ MẶC ĐỊNH theo loại như `CAR_T` (danh sách mặc định là
  mục danh mục `danhsach`, sửa được ở /admin); xoá xe hỏi lại một lần (như KH-UI-5d).
- A3 Một xe: ô số km (sửa nhanh); "Lịch bảo dưỡng" xếp hạng mục sắp tới hạn lên đầu, mỗi hạng mục: tên, "mỗi X km hoặc Y tháng", trạng thái, thanh tiến độ, "✓ Vừa làm hôm nay"
  (ghi một lần sửa với km hiện tại); "＋ Hạng mục" + sửa / xoá hạng mục; giấy tờ (Bảo hiểm, Đăng kiểm…) có ngày hết hạn ("còn N ngày", ≤ 30 ngày là sắp hết); "Lịch sử bảo dưỡng"
  (ngày, hạng mục, km, chi phí, nơi làm) + tổng chi phí; "＋ Ghi lần sửa" (ngày, km, các hạng mục, chi phí, nơi làm); nhắc bật / tắt mỗi xe.
- A4 Cách tính hạn y như `itemState` / `docState` / `vehState` của demo (hàm THUẦN, có thử): tới hạn theo km HOẶC tháng, cái nào đến trước; "sắp tới hạn" = còn ≤ max(150 km, 10 %)
  hoặc ≤ 7 ngày; giấy tờ ≤ 30 ngày.

### B. Uống thuốc (`/kehoach/uongthuoc`)
- B1 Danh sách thuốc: tên, liều, ghi chú, "đến <ngày>" nếu có hạn; mỗi giờ uống là một nút "HH:mm · Chưa uống / Đã uống" (bấm đánh dấu, bấm lại bỏ); ô tổng "đã / tổng lần uống hôm nay"
  + 7 chấm của 7 ngày trước (đủ / một phần / không) + hôm nay; xoá thuốc hỏi lại một lần; nhắc bật / tắt mỗi thuốc.
- B2 Thêm thuốc (demo medForm): tên, liều mỗi lần, 1–3 giờ uống (bánh xe giờ 24h đã có từ KH-UI-5c), ghi chú, "Uống trong" 7 / 14 / 30 ngày / Dài ngày; thiếu tên / thiếu giờ → nhắc nhẹ.
  Hết hạn uống thì thuốc tự thôi nhắc (vẫn còn trong danh sách, ghi "đã xong", xoá được).
- B3 Riêng tư: tên thuốc chỉ lưu trên máy; dải nhắc / mọi lời nhắc CHỈ hiện "Đến giờ uống thuốc" (KHÔNG tên thuốc); dòng ghi chú cuối màn như demo ("… App không thay đơn thuốc").

### C. Chu kỳ (`/kehoach/chuky`) — riêng tư
- C1 Ô Chu kỳ vẫn ẩn với xưng hô anh / chú / bác / ông (như KH-UI-5e). Chưa bật → thẻ giới thiệu + "Bắt đầu" (hỏi ngày bắt đầu kỳ gần nhất).
- C2 Đã bật: hôm nay "Ngày N" + giai đoạn (Hành kinh · Sau kỳ kinh · Giữa chu kỳ · Trước kỳ kinh · Chậm kinh — màu như `CYC_PH`), "Kỳ kinh tới (dự kiến)" + còn N ngày, dải ngày
  của chu kỳ tô màu theo giai đoạn (đánh dấu hôm nay), chú giải; "Dưỡng sinh lúc này" = chữ `CYC_PH` của giai đoạn (khoá `cyc.0`…`cyc.4` như demo — mục danh mục, sửa được ở /admin);
  "Kỳ kinh bắt đầu hôm nay" (ghi lịch sử); độ dài chu kỳ (21–40) và số ngày hành kinh (2–9) chỉnh − / +; "6 chu kỳ gần nhất · trung bình N ngày"; nhắc trước kỳ 2 ngày bật / tắt;
  ghi chú cuối như demo (tham khảo, không dùng để tránh thai, khi nào nên đi khám); "Tắt & xoá dữ liệu chu kỳ" (hỏi lại một lần, xoá thật trên máy).
- C3 KHÔNG có khoá mã khi mở Chu kỳ (chủ quán 11.11: "đây là tài khoản riêng của khách") — bỏ dòng "Khoá bằng mã PIN khi mở" của demo.
- C4 Dải nhắc trước kỳ (hiện trên mọi màn khi App mở) CHỈ ghi "Lời nhắc của bạn" (KHÔNG chữ "kinh" / "chu kỳ") như demo; mục trong "Sắp tới" là "Kỳ kinh dự kiến" như demo.

### D. Gắn vào Kế hoạch chung
- D1 Lưới 6 ô: 3 ô mới mở đúng màn; toolBadge như demo (Xe cộ "N xe · …"; Uống thuốc "đã / tổng hôm nay"; Chu kỳ "Ngày N").
- D2 "Sắp tới" (`upList`) + dải nhắc khi mở App (`bangCoNhac` / `DaiNhacViec`) + thanh nhắc đầu Kế hoạch: thêm hạn xe (hạng mục / giấy tờ trong 30 ngày), giờ uống thuốc (hôm nay),
  ngày dự kiến kỳ tới (theo C4) — bấm một dòng mở đúng tiện ích. Câu nhắc theo B3 / C4.
- D3 Dữ liệu trong kho `kh_kehoach` (thêm trường `xe`, `thuoc`, `chuKy` — bản cũ thiếu trường → mặc định, không mất dữ liệu cũ; đọc hỏng → mặc định, như luật `luuMay.js` / `docKeHoach`).
  Xoá dữ liệu khách khi đổi tài khoản / đăng xuất theo luật hiện có (KHOA_DU_LIEU) — kiểm lại có xoá cả chu kỳ.

### E. Văn khấn — điền sẵn Tín chủ / Địa chỉ (chủ quán 11.11, ảnh Văn khấn Ông Táo)
- E1 Đầu màn danh sách Văn khấn: khung **"Thông tin gia đình khi khấn"** — Tín chủ, Họ gia tiên, Địa chỉ (điền MỘT lần, mọi bài dùng chung). MẶC ĐỊNH (khi khách chưa tự sửa):
  Tín chủ = họ tên khách trong tài khoản (tên POS, KHÔNG kèm xưng hô); Địa chỉ = địa chỉ đã lưu trong tài khoản (`dia_chi` POS); Họ gia tiên = chữ ĐẦU của họ tên. Khách sửa → lưu trên máy,
  không gửi đi; ô trống thì gợi ý mờ.
- E2 Đầu mỗi bài: một dòng gọn "Tín chủ: … · Địa chỉ: …  Sửa ›" (bấm Sửa → mở khung E1 / ô nhập ngay trong bài); ô "Người được giỗ" / "Hương linh" vẫn theo từng bài như hiện nay.
- E3 Trong bài khấn: chỗ điền còn trống hiện chữ mờ "(chạm để điền <tên chỗ>)" thay vì để trắng; CHẠM vào bất kỳ chỗ tô màu nào → mở đúng ô nhập của chỗ đó. Thiếu Tín chủ / Địa chỉ
  → một dòng nhắc nhẹ trên bài.
- E4 Dưới "Lễ vật": MỘT dòng gợi ý chữ "Có thể dâng thêm hoa quả, trà tươi" (mục danh mục, sửa được) — KHÔNG nút đặt hàng.

### F. Kiểm
- F1 Bài MỚI `cong_cu/thu_KHUI5f.js` (chạy cả `KHONG_TRINH_DUYET=1`):
  - hàm thuần: itemState / docState / vehState (km trước, tháng trước, chưa ghi, quá hạn, sắp tới hạn ở ngưỡng), lịch mặc định theo loại xe, medToday + 7 ngày, thuốc hết hạn, cycNow mọi
    giai đoạn (cả chậm kinh), trung bình 6 kỳ, chữ nhắc riêng tư (B3, C4), mặc định Tín chủ / Họ gia tiên / Địa chỉ (E1), bản `kh_kehoach` cũ đọc vẫn đủ;
  - Chromium (390): thêm xe máy → lịch mặc định, "Vừa làm hôm nay" → trạng thái đổi; thêm thuốc 2 giờ → đánh dấu một lần → "1/2"; bật Chu kỳ → "Kỳ kinh bắt đầu hôm nay" → ngày / giai đoạn đúng, "Tắt & xoá" → hỏi lại → xoá thật; xưng hô "anh" → không có ô Chu kỳ; Văn khấn: khung E1 có mặc định từ tài khoản giả, chạm chỗ tô màu → đúng ô; Sắp tới có dòng xe / thuốc.
- F2 Bài thử cũ đỏ vì hành vi đổi có chủ đích (3 ô "Sắp có" thành thật, khung thông tin Văn khấn chuyển chỗ) → sửa đúng ca; mỗi bài sửa có ≥ 1 ca ĐỎ trên gốc kể cả `KHONG_TRINH_DUYET=1`;
  KHÔNG dùng `## Bài thử cũ sửa`.
- F3 Ảnh 360 / 390 / 430 → `viec/KH-UI-5f/so_anh/`: lưới 6 ô, Xe cộ (danh sách, một xe, thêm xe, ghi lần sửa), Uống thuốc (danh sách, thêm), Chu kỳ (chưa bật, đã bật),
  Văn khấn (khung E1, một bài có chỗ trống). `doi_chieu_demo.md`: khác demo (bỏ khoá khi mở C3, E1–E4 theo chủ quán).
- F4 **Sửa được ở /admin** (CLAUDE.md §11 "thêm gì cũng phải sửa được"): mọi chữ / ảnh / nút / danh sách mặc định mới có khoá trong `tienIch.js` + `data-nd`; khối mới có `hien.<khối>`;
  `trang_thai.md` liệt kê khoá đã thêm. K10: tệp mới 0 chữ cứng; tệp sửa không tăng (giảm thì `node cong_cu/ha_no_chu.js`). `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi `trang_thai.md`
  + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- F5 Thử mở một dịp văn khấn trong trình duyệt Zalo (đường dẫn trực tiếp `/kehoach/vankhan/<dịp>`): mở đúng, nút quay lại đúng — ghi kết quả (tồn từ KH-UI-5e).
- F6 Chủ quán thử tay: (1) Kế hoạch → Xe cộ → thêm xe máy, bấm "Vừa làm hôm nay" ở Thay dầu; (2) Uống thuốc → thêm thuốc 2 giờ, đánh dấu một lần; (3) Văn khấn → thấy tên + địa chỉ đã điền sẵn.

## Phạm vi
- viec/KH-UI-5f/**
- src/noiDung/nd/tienIch.js
- src/pages/TienIch.jsx
- src/pages/KeHoach.jsx
- src/kehoach.js
- src/kehoachLap.js
- src/vanKhan.js
- src/noiDung/keHoach.js
- src/noiDung/vanKhan.js
- src/components/BieuTuongTienIch.jsx
- src/components/VanKhanMan.jsx
- src/components/XeCo.jsx
- src/components/UongThuoc.jsx
- src/components/ChuKy.jsx
- src/components/dungKeHoach.js
- src/components/DaiNhacViec.jsx
- src/duongDan.js
- src/luuMay.js
- src/giaoDien/tien_ich.css
- src/giaoDien/ke_hoach.css
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHUI5f.js
- cong_cu/thu_*.js

## Ngân sách
~900 dòng app (Xe cộ ~350, Uống thuốc ~150, Chu kỳ ~250, Văn khấn ~80, gắn chung ~70) + ~500 dòng thử. **Phương án đơn giản nhất đã xét:** dùng lại khung tiện ích của KH-UI-5e
(màn `tool`, `tl-row`, bảng nổi, nút nhắc, bánh xe giờ, hỏi xoá một lần, kho `kh_kehoach`), hàm tính hạn chép logic demo thành hàm thuần. Không thông báo đẩy (KH-TB-1), không đồng bộ
máy chủ. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không (kho trên máy `kh_kehoach` thêm trường, đọc bản cũ được)

## Thư viện mới
không

## Cấm
- `src/duongDan.js` CHỈ thêm `xeco`, `uongthuoc`, `chuky` vào danh sách tiện ích. `src/luuMay.js` CHỈ nếu cần thêm khoá dữ liệu mới vào `KHOA_DU_LIEU`.
- KHÔNG sửa `src/noiDung/nd/index.js`, `src/noiDung/nd.js`, tệp nhóm của việc khác (`khungChung.js`, `trangChu.js`, `menu.js`, `donHang.js`, `taiKhoan.js`, `keHoach.js`).
- KHÔNG sửa `src/App.jsx`, `src/pages/TrangChu.jsx`, `src/dinhDang.js`, `src/quangCao.js` (KH-UI-5g), trang Menu / Giỏ / Thanh toán / Theo dõi đơn (KH-ND-3b, 3e), `src/api.js`,
  `src/main.jsx`, `public/**`, `index.html`, `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`,
  `LUAT_XAY_APP.md`, `CLAUDE.md`.
- Dữ liệu sức khoẻ (thuốc, chu kỳ) KHÔNG rời máy, KHÔNG ghi vào nhật ký / lỗi / bài thử chụp màn hình có dữ liệu thật; KHÔNG gửi lên POS.
- KHÔNG làm thông báo đẩy, KHÔNG thêm thư viện, KHÔNG đổi màu / phông ngoài lớp CSS demo đã có, KHÔNG "Đọc to", KHÔNG nút đặt hoa quả.
- Chỉ push `git push -u origin viec/KH-UI-5f`. Không đụng `main`, không merge, không tạo PR.

## Chủ quán đổi sau khi máy làm (11.11) — BỎ khoá mã Chu kỳ
Chủ quán 11.11 (sau khi đọc phiếu): "không cần phải khoá mã Chu kỳ vì đây là tài khoản riêng của khách". Các mục C3, C4, D1, F1, F3, Phạm vi, Cấm ở trên ĐÃ sửa theo
(commit PHIEU này). Phần khoá máy đã làm ở các commit trước phải GỠ HẾT, không để code chết:
1. `src/components/ChuKy.jsx`: bỏ công tắc "Khoá bằng mã khi mở", màn hỏi mã (`HoiMa`), đặt mã, bàn phím số (`BanPhim`), trạng thái `mo` / `khoaDong`; mở Chu kỳ là vào thẳng.
2. `src/kehoachLap.js` / `src/kehoach.js`: bỏ `taoKhoa`, `kiemKhoa`, `thuMa`, `datKhoaChuKy`, `datThuChuKy`, hàm băm SHA-256, trường `khoa` / `thu` trong `chuKyTrong()`;
   đọc bản `kh_kehoach` đã lưu có `khoa` / `thu` → BỎ QUA hai trường đó (không lỗi, không mất dữ liệu chu kỳ khác); ghi lại thì không còn hai trường.
3. "Sắp tới" luôn "Kỳ kinh dự kiến" (C4) — bỏ nhánh `chuky.sapToiRieng`; ô lưới luôn "Ngày N" (D1) — bỏ `chuky.badgeKhoa`. Dải nhắc vẫn CHỈ "Lời nhắc của bạn".
4. `src/noiDung/nd/tienIch.js`: bỏ mọi mục chỉ phần khoá dùng (`chuky.khoa*`, `chuky.ma*`, `chuky.quen`, `chuky.cho`, `chuky.khongKhop`, `chuky.daKhoa`, `chuky.daTatKhoa`,
   `chuky.xacNhan`, `chuky.xoaSo`, `chuky.khongHoTro`, `chuky.sapToiRieng`, `chuky.badgeKhoa`… — đối chiếu bằng tìm khoá trong `src/`, không khoá thừa); CSS chỉ khoá dùng (`.cyc-khoa`…).
5. Bài thử: bỏ ca khoá / băm / hỏi mã; THÊM ca: màn Chu kỳ đã bật không có công tắc / bàn phím khoá; bản `kh_kehoach` cũ CÓ `khoa` + `thu` vẫn mở thẳng Chu kỳ và giữ đủ dữ liệu
   (ca đỏ trên gốc của nhánh trước khi gỡ — theo luật E2). Đột biến: bỏ các VS- về khoá. Ảnh: bỏ `*_chuky_hoi_ma_*`, chụp lại Chu kỳ đã bật nếu đổi.
6. Chạy lại `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`), `/ra-soat`; ghi `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` mới (đầu dòng); push nhánh.
