# KH-UI-5f — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-UI-5f`; cây sạch; `git fetch origin viec/KH-UI-5f`: HEAD = FETCH_HEAD = `64757e0` (không kéo gì — hook mở phiên đã báo "đã có đủ commit của origin").
- `git log --oneline -3` lúc mở:
  - `64757e0 PHIEU: KH-UI-5f`
  - `010534d TIEN-DO: mo KH-ND-3b, KH-ND-3e, KH-UI-5f (chay song song voi KH-UI-5g); tao san tep nhom danh muc; luat: them gi cung sua duoc o /admin; thu POS 11.11 b (MATKHAU-1, DOI-DIEM-1, QUET-1/2, khai truong ~28.11)`
  - `042e8af TIEN-DO: KH-ND-3a xong (chat soat cuoi DAT, gop PR); mo KH-UI-5g (anh sang luot nhu demo, banner Hom nay luon chay, loi chao goi ten); quyet dinh 11.11 c; Google API can ho so xac minh 60 ngay`
- Giữa phiên không có thông báo đổi model. Hook mở phiên: "cai_thu_vien: npm ci xong".
- Stop hook / người gác: không có yêu cầu `git config` / `--amend` / `rebase`. Người gác chặn vài lệnh dạng "heredoc + chạy script trong một lệnh", "sed -i", biến trong đường dẫn đích, chữ `process.env` trong script nháp → đã tách lệnh / dùng Edit (xem Bài học).

## Câu hỏi
(không có — mọi chỗ phiếu chưa chốt đã chọn mặc định đơn giản và ghi ở Phát hiện)

## Phát hiện (ngoài phạm vi / điều cần chủ quán biết, không tự sửa)
- **`src/kehoach.js` suýt vượt 500 dòng** (566 sau khi thêm Xe / Thuốc / Chu kỳ) mà Phạm vi không cho tạo tệp mới → chuyển phần "chữ trạng thái xe / thuốc" + "đổi trạng thái Chu kỳ + khoá mã" sang `kehoachLap.js` (nay 413 dòng) và `export … from` lại ở `kehoach.js` (nay 492 dòng) để mọi chỗ gọi cũ (`KH.batChuKy`…) không đổi. Nếu muốn tách sạch theo việc (`xeCo.js` / `chuKy.js`) cần phiếu cho phép tệp mới.
- **PinSheet.jsx không đụng:** bảng PIN ví là JSX liền khối (gọi mạng trong `xacNhan`), không tách bàn phím được mà không sửa dòng có chữ → bàn phím số 4 chữ số của Chu kỳ viết nhỏ trong `ChuKy.jsx` bằng lớp CSS có sẵn `.pin-pad` / `.pin-dots` (không gọi mạng). Khi KH-ND-3e xong PinSheet có thể tách bàn phím dùng chung.
- **`crypto.subtle` chỉ có ở ngữ cảnh an toàn** (https / localhost). `tuquyduong.com` chạy https nên đủ; máy / trình duyệt không có → `taoKhoa` trả null, màn báo "Máy này chưa hỗ trợ khoá bằng mã, nên chưa bật được" (khoá `chuky.khongHoTro`), KHÔNG lưu mã yếu. (Bài thử Chromium dùng `http://localhost:4599` vì lý do này.)
- **Biểu tượng `bell` / `heart`:** `index.html` (ngoài phạm vi) chưa có `<symbol>` `i-bell`, `i-heart` — nút "Nhắc khi mở app" đã dùng `bell` từ 5e (hiện trống nếu thiếu), ghi chú Uống thuốc của demo có trái tim → app KHÔNG vẽ (không vẽ mới). Xem `doi_chieu_demo.md`.
- **Đếm lần sai mã** lưu trong chính `kh_kehoach` (`chuKy.thu`) để tải lại trang không xoá được lượt sai; dùng `Date.now()` của máy (CLAUDE.md §6 cho phép đồng hồ máy để đếm giây). Đổi giờ máy lùi lại thì chờ lâu hơn 60 giây — không nguy hiểm.
- **`vk.ho` / `vk.dc` đổi nghĩa:** `null` = chưa sửa (hiện mặc định theo tài khoản), `''` = khách chủ ý để trống (giống `vk.ten`, `vk.nm` của 5e). Bản lưu 5e đã ghi `ho: ''` / `dc: ''` cho người chưa sửa sẽ đọc là "chủ ý trống" (không điền sẵn). App chưa khai trương nên chưa có người dùng thật bị ảnh hưởng.
- Nhắc xe chỉ có cho hạng mục có hạn THEO THÁNG và giấy tờ có ngày (đặt mốc 8:00, trước 7 ngày); hạng mục chỉ theo km thì chỉ hiện "sắp tới hạn" khi khách mở app (không có ngày để hẹn). Chữ giải thích nhắc của demo ("… khi còn dưới 10% quãng đường (theo km)") giữ nguyên.
- `dist/`, `.nhap_thu/` do bài thử dựng — không commit.
- Chưa có mẫu màn to (`thiet_ke/mau_man_to/`) → chưa đối chiếu ≥ 1024 px; ba màn mới dùng khung giữa như các màn con khác.

## Chỗ vá → bài thử → đột biến (việc chỉ đổi `src/`, không có `dot_bien.py` — cổng A17 / A18 chỉ áp cho `server/`, `client/src/`; đột biến chạy tay bằng `viec/KH-UI-5f/dot_bien_tay.js` trên bản sao ở nháp, mỗi cái ĐỎ)
| Chỗ vá | Bài thử (thu_KHUI5f) | Đột biến |
|---|---|---|
| `kehoachLap.trangThaiHang` ngưỡng max(150 km, 10 %) | A4 ngưỡng 10 % | VS-NGUONG-KM-SAP-BO-10-PHAN-TRAM |
| `trangThaiHang` quá hạn theo tháng | A4 "theo tháng: 70 ngày" | BV-HANG-QUA-THANG-KHONG-TINH |
| `trangThaiGiay` ≤ 30 ngày | A4 giấy tờ 30 ngày | VS-GIAY-30-NGAY-LOAI-TRU |
| `thuocConHan` hết đợt thôi nhắc | B1 / B2 hết đợt | BV-THUOC-HET-DOT-VAN-NHAC |
| `bayNgayThuoc` 7 ngày trước | B1 7 chấm | VS-THUOC-BAY-NGAY-LECH-MOT |
| `chuKyHomNay` giai đoạn Chậm kinh | C2 giai đoạn | VS-CHAM-KINH-KHONG-TOI |
| `taoKhoa` không lưu mã gốc | C3 taoKhoa / kho không chứa mã gốc | VS-KHOA-LUU-MA-GOC |
| `thuMa` sai 5 lần chờ 60 giây | C3 sai 5 lần | BV-SAI-5-LAN-KHONG-CHO |
| `bangCoNhac` nhắc thuốc không tên thuốc | B3 | VS-NHAC-THUOC-LO-TEN-THUOC |
| `bangCoNhac` nhắc kỳ: "Lời nhắc của bạn" | C4 | BV-NHAC-CHU-KY-LO-CHU-KINH |
| `upList` Chu kỳ khoá → "Lời nhắc riêng tư" | C4 | VS-SAP-TOI-KHOA-VAN-LO-KINH |
| `upList` nhãn "Riêng tư" khi khoá | C4 | VS-NHAN-SAP-TOI-KHOA-LO-CHU-KY |
| `chuThich('chuky')` khoá không hiện số | D1 | BV-BADGE-CHU-KY-KHOA-LO-SO |
| `danhDauNgay` bỏ việc riêng tư | B3 / C4 | BV-CHUONG-LICH-LO-VIEC-RIENG |
| `thongTinVk` Họ gia tiên = chữ đầu | E1 | VS-MAC-DINH-HO-GIA-TIEN-TRONG |
| `thongTinVk` Địa chỉ = dia_chi | E1 | VS-MAC-DINH-DIA-CHI-TRONG |
| `luuMay` xoá `kh_kehoach` khi đổi khách | D3 | BV-DOI-KHACH-KHONG-XOA-KE-HOACH |
| danh mục `xe.macdinh` giấy tờ ô tô | A2 | VS-LICH-OTO-THIEU-DANG-KIEM |
| `ghiLanSua` km trống = km xe | A3 "Vừa làm hôm nay" | VS-VUA-LAM-KHONG-LAY-KM-XE |
| `doiUong` bấm lại bỏ đánh dấu | B1 | VS-DOI-UONG-KHONG-BO-DANH-DAU |
| `upList` Chu kỳ theo xưng hô | C4 | BV-SAP-TOI-CHU-KY-CHO-ANH |
| `ghiKyMoi` chỉ ghi chu kỳ 10–120 ngày | C2 | VS-GHI-KY-MOI-GHI-CA-KY-NHAM |
| `XeCo` "Xoá xe" hỏi lại một lần | Chromium A2 | BV-HOI-XOA-XE-XOA-LUON |
| `ChuKy` mở lại hỏi mã | Chromium C3 | BV-CHU-KY-KHOA-KHONG-HOI-MA |
Kết quả: **24 / 24 đột biến bị bắt** (22 bắt được cả khi `KHONG_TRINH_DUYET=1`, 2 cái cuối chỉ bắt được trong Chromium: 102 đạt · 1 hỏng và 136 đạt · 1 hỏng).

## Khoá nội dung đã thêm (F4 — `src/noiDung/nd/tienIch.js`, 214 mục, `kiemDanhMuc` không lỗi; màn đọc qua `nd()` / `ndDs()` / `ndHien()` + `data-nd`)
- `ti.*` (8): luu, tagXe, tagThuoc, tagChuKy, tagRieng, chuaSan, xoaNgay, loiKho
- `hien.*` (5, ẩn / hiện khối): ocXe, ocThuoc, ocChuKy (ô ở lưới), vkKhung (khung thông tin gia đình), vkGoiYLe (dòng gợi ý dâng thêm)
- `xe.*` (88): tieuDe, phu, them, ghiChu, trong, on, giaySapHet, hangSap, conKm, conNgay, hoacNgay, toiHan, chuaGhi, lanCuoi, moiKm, moiThang, hoac, badgeCo, badgeSap, badgeOn, badgeTrong, kmNhan, kmPhu, km, daKm, lichTieu, themHang, chuaHang, vuaLam, daGhiHang, nhacTieu, nhacPhu, giayTieu, giayChua, giayNgayTieu, giayHet, giayCon, lsTieu, lsTrong, ghiSua, suaXe, xoaXe, loaiXoa, daXoa, formThem, formPhu, loai, ten, tenGoiY, bien, bienGoiY, kmLb, kmGoiY, mauNote, mauGiay, mauKhong, nutThem, nhapTen, daLuu, hangThem, hangSua, hangTen, hangTenGoiY, hangNhacLb, hangKm, hangThang, hangXoa, nhapHang, nhapKmThang, daLuuHang, daXoaHang, **hangGoiY** (danh sách), **viecKhac** (danh sách), logTieu, logNgay, logKm, logViec, logViecKhac, logThemNut, logPhi, logPhiGoiY, logNoi, logNoiGoiY, logNote, logChon, logDaLuu, logSapTheo, **macdinh** (danh sách: lịch bảo dưỡng + giấy tờ mặc định theo loại xe)
- `thuoc.*` (37): tieuDe, phu, them, tongNhan, bayNhan, den, xong, chua, da, xoa, loaiXoa, ghiChu, nhacTieu, trong, badge, badgeTrong, formTieu, formPhu, ten, tenGoiY, lieu, lieuGoiY, lieuMacDinh, gio, gioThem, gioBo, ghi, ghiGoiY, trongLb, **dot** (danh sách "Uống trong"), luu, ghiNho, nhapTen, nhapGio, daLuu, daBat, daTat
- `chuky.*` (57): tieuDe, phu, offTieu, offMo, bat, hoiNgay, hoiNut, ngayLoi, homNay, ngay, kyToi, conNgay, daToi, ph0…ph4, duongSinh, kyBatDau, daGhiKy, daiLb, hanhLb, soNgay, lsTieu, lsDong, lsTrong, nhacTieu, nhacPhu, loiNhac, khoaTieu, khoaPhu, ghiChu, tat, loaiXoa, tenXoa, daTat, datMa, datMaPhu, nhapLai, khongKhop, daKhoa, daTatKhoa, moMa, maSai, cho, quen, xoaSo, xacNhan, khongKhoa, sapToi, sapToiPhu, sapToiRieng, badgeNgay, badgeBat, badgeKhoa, khongHoTro
- `cyc.0` … `cyc.4` (5, chữ dưỡng sinh theo giai đoạn — đúng tên khoá `data-cms="t:cyc.N"` của demo)
- `vk.*` (14): khungTieu, khungNote, tinChu, hoGia, diaChi, goiYTen, goiYHo, goiYDc, dongTin, sua, chamDien, nhacThieu, leVatGoiY, suaTieu
- Phần lấy từ POS / App tự tính (khoá 🔒): không có mục mới — tên + địa chỉ tài khoản là dữ liệu POS dùng làm mặc định, ngày / lịch tự tính không hiện thành chữ riêng.
- K10: tệp mới (`XeCo.jsx`, `UongThuoc.jsx`, `ChuKy.jsx`) 0 chữ cứng; tệp sửa không tăng — số nợ chung giảm 766 → 762 (`ha_no_chu.js` đã chạy).

## Bằng chứng nghiệm thu (mỗi mục một dòng — bài thử `cong_cu/thu_KHUI5f.js` trừ khi ghi khác)
- A1 danh sách xe + dòng trạng thái + "N xe · …" + lời mời khi chưa có xe: Chromium "A1 chưa có xe…", "A1 quay lại danh sách…", "D1 ô Xe cộ ở lưới"; hàm "D1 Xe cộ: N xe · M sắp tới hạn / ổn / Thêm xe".
- A2 thêm / sửa / xoá xe, lịch mặc định theo loại, danh sách mặc định sửa được: thuần "A2 Xe máy…", "A2 Ô tô…", "A2 Xe đạp điện…", "A2 thêm xe máy…", "A2 tên trống…", "A2 tối đa 20 xe", "F4 danh mục"; Chromium "A2 bảng Thêm xe…", "A2 chưa nhập tên…", "A2 lưu → kho…", "A2 Xoá xe → hỏi lại…", "A2 xác nhận Xoá…".
- A3 một xe (km, lịch xếp theo sắp tới hạn, Vừa làm hôm nay, hạng mục thêm / sửa / xoá, giấy tờ, lịch sử + tổng chi phí, ghi lần sửa, nhắc): thuần "A3 sapHang", "A3 Vừa làm hôm nay…", "A3 ghi lần sửa…", "A3 sửa nhanh số km…", "A3 hạng mục…", "A3 giấy tờ…", "A3 tổng chi phí"; Chromium "A3 một xe…", "A3 Vừa làm hôm nay…", "A3 sửa nhanh số km…", "A3 Ghi lần sửa…", "A3 giấy tờ…", "A3 thêm hạng mục / thiếu km lẫn tháng / lưu hạng mục mới".
- A4 itemState / docState / vehState: 15 ca thuần "A4 …" (km trước, tháng trước, chưa ghi, quá hạn, ngưỡng 150 km / 10 % / 7 ngày / 30 ngày, nhiều lần ghi, chỉ theo tháng).
- B1 danh sách thuốc, nút giờ, tổng, 7 chấm, xoá hỏi lại, nhắc bật / tắt: thuần "B1 hôm nay 0/2…", "B1 bấm một giờ…", "B1 7 chấm…", "B1 thuốc hết đợt vẫn được tính…", "B1 nhắc từng thuốc…"; Chromium "B1 chưa có thuốc…", "B1 ô tổng 0/2…", "B1 bấm giờ 07:30…", "B1 xoá thuốc → hỏi lại", "D3 tải lại: vẫn 1/2".
- B2 thêm thuốc (tên, liều, 1–3 giờ bánh xe, ghi chú, Uống trong), thiếu tên / giờ nhắc nhẹ, hết đợt: thuần "B2 thêm thuốc…", "B2 Dài ngày…", "B2 thiếu tên…", "B2 hết hạn uống…"; Chromium "B2 thiếu tên…", "B2 bảng thêm thuốc: 2 bánh xe giờ…", "B2 lưu → kho…", "B2 hết đợt uống: …ghi đã xong".
- B3 riêng tư (nhắc chỉ "Đến giờ uống thuốc", ghi chú cuối): thuần "B3 nhắc uống thuốc chỉ là…", "B3 thanh nhắc lúc 09:00…", "B3/C4 việc ảo riêng tư KHÔNG hiện chuông"; Chromium "B3 20:30 dải nhắc… KHÔNG tên thuốc", "D2/B3 Sắp tới…", "B1 chưa có thuốc… ghi chú riêng tư".
- C1 ô Chu kỳ ẩn với anh / chú / bác / ông; chưa bật → thẻ + Bắt đầu hỏi ngày: thuần "C1 ô Chu kỳ vẫn ẩn…", "C1 bật với ngày hợp lệ…"; Chromium "C1 chưa bật…", "C1 bấm Bắt đầu → hỏi ngày…" (xưng hô "anh" → 5 ô: thu_KHUI5e "A2 xưng hô anh" vẫn xanh).
- C2 hôm nay Ngày N + giai đoạn + kỳ tới + dải + dưỡng sinh cyc.N + ghi kỳ mới + ± + 6 kỳ gần nhất + nhắc + ghi chú + tắt & xoá: thuần "C2 chu kỳ 28 / hành kinh 5…", "C2 Ngày N…", "C2 dải ngày…", "C2 trung bình 6 chu kỳ…", "C2 Kỳ kinh bắt đầu hôm nay…", "C2 độ dài 21–40…", "C2 tắt & xoá"; Chromium "C2 đã bật…", "C2 dải 28 ô…", "C2 chỉnh + độ dài…", "C2 chu kỳ đã đủ 28 ngày… Chậm kinh", "C2 Kỳ kinh bắt đầu hôm nay → ghi 28", "C2 Tắt & xoá → hỏi lại / xoá thật".
- C3 khoá mã riêng (băm SHA-256 + muối, không lưu mã gốc, bàn phím số, quên mã, sai 5 lần chờ 1 phút): thuần 6 ca "C3 …"; Chromium "C3 bật khoá…", "C3 nhập lại sai…", "C3 đặt xong…", "C3 mở lại → hỏi mã", "C3 mã sai…", "C3 mã đúng…", "C3 sai 5 lần…", "C3 tải lại trang vẫn đang chờ", "C3 Quên mã? → hỏi lại / xoá".
- C4 lời nhắc "Lời nhắc của bạn"; Sắp tới "Kỳ kinh dự kiến" chỉ khi KHÔNG khoá (khoá → "Lời nhắc riêng tư", nhãn "Riêng tư"): thuần "C4 nhắc trước kỳ…", "C4 Sắp tới: KHÔNG khoá…", "C4 xưng hô anh…"; Chromium "C4 khoá thì Sắp tới hiện 'Lời nhắc riêng tư'…", "D1/C4 ô lưới Chu kỳ khi khoá: Riêng tư".
- D1 lưới 6 ô mở đúng màn + chữ nhỏ: Chromium "D1 lưới 6 ô…", "D1 bấm ô Xe cộ…", "D1 Uống thuốc…, Chu kỳ…", "D1 Back…"; thuần "D1 Xe cộ / Uống thuốc / Chu kỳ"; đường dẫn "D đường dẫn: /kehoach/xeco · /uongthuoc · /chuky".
- D2 Sắp tới + dải nhắc + thanh nhắc có xe / thuốc / chu kỳ, bấm mở đúng tiện ích: thuần "D2 Sắp tới: …", "D2 nhắc xe…"; Chromium "D2 Sắp tới có hạng mục xe…", "D2 bấm dòng xe → /kehoach/xeco", "B3 20:30 dải nhắc…".
- D3 `kh_kehoach` thêm `xe` / `thuoc` / `thuocXong` / `chuKy`; bản cũ đọc đủ, hỏng → mặc định, xoá khi đổi khách / đăng xuất: thuần 8 ca "D3 …" (gồm "D3 đổi khách khác → xoá luôn xe / thuốc / chu kỳ", "không thêm khoá lưu mới"); `luuMay.js` KHÔNG sửa (đã áp cho khoá `kh_kehoach`).
- E1 khung "Thông tin gia đình khi khấn" điền sẵn từ tài khoản, sửa → lưu trên máy: thuần 4 ca "E1 …"; Chromium "E1 khung … điền sẵn từ tài khoản", "E1 khách sửa Họ gia tiên → lưu".
- E2 dòng gọn "Tín chủ: … · Địa chỉ: …  Sửa ›": Chromium "E2 đầu bài…", "E2 bấm Sửa ›"; thu_KHUI5e "C2 một dịp (E2…)".
- E3 chỗ trống "(chạm để điền …)", chạm chỗ tô màu → đúng ô, nhắc nhẹ khi thiếu: thuần "E3 dienBai…"; Chromium "E3 chạm chỗ tô màu Địa chỉ → mở đúng ô", "E3 sửa Địa chỉ trong bảng", "E3 tài khoản chưa có địa chỉ…", "E3 điền xong…".
- E4 dòng gợi ý dưới Lễ vật, không nút đặt hàng: Chromium "E4 dưới Lễ vật…".
- F1 bài mới `thu_KHUI5f.js`: 85 ca (KHONG_TRINH_DUYET=1) / 177 ca (có Chromium).
- F2 bài cũ sửa đúng ca, mỗi bài ≥ 1 ca ĐỎ trên gốc, không thêm `## Bài thử cũ sửa`, không bớt ca: thu_KHUI5e (6 ca sửa + 3 ca Chromium, 71 → 71 / 120 → 120), thu_KHUI5b (1 ca sửa, 75 → 75) — xem `bang_chung_do.txt`.
- F3 ảnh 360 / 390 / 430 + `doi_chieu_demo.md`: `so_anh/` (13 màn × 3 cỡ × demo / app / lệch; màn riêng app: chuky_hoi_ma), `chup_anh.js`.
- F4 sửa được ở /admin: mục trên; `npm test` / `--day-du` / cổng: xem mục "Cổng" dưới.
- F5 trình duyệt Zalo (User-Agent có "Zalo"): Chromium "F5 trình duyệt Zalo: mở thẳng /kehoach/vankhan/r…", "F5 nút quay lại → /kehoach/vankhan" (giả lập UA; chưa thử trên Zalo thật — xem CHƯA KIỂM).
- F6 chủ quán thử tay: xem BÁO CÁO · CHƯA KIỂM.
