# KH-UI-5f — trạng thái

## Đối chiếu bản chụp (bước 1)
- Lượt 1 (11.11): nhánh `viec/KH-UI-5f`; HEAD = FETCH_HEAD = `64757e0`.
- Lượt 2 (12.11, làm tiếp sau phiếu sửa "BỎ khoá mã Chu kỳ"): nhánh `viec/KH-UI-5f`; cây sạch; `git fetch origin viec/KH-UI-5f`: HEAD = FETCH_HEAD = `4cd853d` (không kéo gì). `git log --oneline -3` lúc mở:
  - `4cd853d PHIEU: KH-UI-5f - chu quan 11.11 bo khoa ma Chu ky (tai khoan rieng cua khach): sua C3 C4 D1 F1 F3, may go phan khoa da lam`
  - `eb43c3c KH-UI-5f: bao cao soat vong 1, bao cao 7 muc, bai hoc, HEAD DA KIEM`
  - `4d458b9 KH-UI-5f: bam dai nhac / thanh nhac cua thuoc, xe, chu ky mo dung tien ich (soat vong 1); bo import thua`
- Giữa phiên không có thông báo đổi model. Stop hook chỉ nhắc commit + push (đã làm), không đòi `git config` / `--amend` / `rebase`.
- Người gác chặn: lệnh ghép "script + đường ống", `git rm` / `git restore` có glob hoặc thư mục → tách lệnh, liệt kê từng file (xem Bài học).

## Câu hỏi
(không có)

## Phát hiện (ngoài phạm vi / điều cần chủ quán biết, không tự sửa)
- **`src/kehoach.js` suýt vượt 500 dòng** (566 sau khi thêm Xe / Thuốc / Chu kỳ) mà Phạm vi không cho tạo tệp mới → chuyển phần "chữ trạng thái xe / thuốc" + "đổi trạng thái Chu kỳ" sang `kehoachLap.js` và `export … from` lại ở `kehoach.js` để mọi chỗ gọi cũ (`KH.batChuKy`…) không đổi. Sau khi bỏ khoá mã, `kehoachLap.js` còn ≈ 386 dòng, `kehoach.js` 490 dòng. Muốn tách sạch theo việc (`xeCo.js` / `chuKy.js`) cần phiếu cho phép tệp mới.
- **Biểu tượng `bell` / `heart`:** `index.html` (ngoài phạm vi) chưa có `<symbol>` `i-bell`, `i-heart` — nút "Nhắc khi mở app" đã dùng `bell` từ 5e (hiện trống nếu thiếu), ghi chú Uống thuốc của demo có trái tim → app KHÔNG vẽ (không vẽ mới). Xem `doi_chieu_demo.md`.
- **`vk.ho` / `vk.dc` đổi nghĩa:** `null` = chưa sửa (hiện mặc định theo tài khoản), `''` = khách chủ ý để trống (giống `vk.ten`, `vk.nm` của 5e). Bản lưu 5e đã ghi `ho: ''` / `dc: ''` cho người chưa sửa sẽ đọc là "chủ ý trống" (không điền sẵn). App chưa khai trương nên chưa có người dùng thật bị ảnh hưởng.
- Nhắc xe chỉ có cho hạng mục có hạn THEO THÁNG và giấy tờ có ngày (đặt mốc 8:00, trước 7 ngày); hạng mục chỉ theo km thì chỉ hiện "sắp tới hạn" khi khách mở app (không có ngày để hẹn). Chữ giải thích nhắc của demo ("… khi còn dưới 10% quãng đường (theo km)") giữ nguyên.
- Bản `kh_kehoach` đã lưu từ lượt 1 có `chuKy.khoa` / `chuKy.thu`: đọc thì BỎ QUA hai trường đó, ghi lại thì không còn (ca "C3 bản lưu cũ…"). Khách đã đặt mã ở bản thử thì từ nay mở Chu kỳ không hỏi mã.
- Ảnh `so_anh/`: `chup_anh.js` chụp lại cả 110 ảnh mỗi lần chạy, nhiều ảnh lệch byte chỉ vì ngày hôm nay đổi → chỉ commit ảnh Chu kỳ đã bật (`chuky_on`, `chuky_on_duoi`), các ảnh khác giữ bản cũ (nội dung không đổi).
- `dist/`, `.nhap_thu/` do bài thử dựng — không commit.
- Chưa có mẫu màn to (`thiet_ke/mau_man_to/`) → chưa đối chiếu ≥ 1024 px; ba màn mới dùng khung giữa như các màn con khác.

## Chỗ vá → bài thử → đột biến (việc chỉ đổi `src/`, không có `dot_bien.py` — cổng A17 / A18 chỉ áp cho `server/`, `client/src/`; đột biến chạy tay bằng `viec/KH-UI-5f/dot_bien_tay.js --trinh-duyet` trên bản sao ở nháp, mỗi cái ĐỎ)
| Chỗ vá | Bài thử (thu_KHUI5f) | Đột biến |
|---|---|---|
| `kehoachLap.trangThaiHang` ngưỡng max(150 km, 10 %) | A4 ngưỡng 10 % | VS-NGUONG-KM-SAP-BO-10-PHAN-TRAM |
| `trangThaiHang` quá hạn theo tháng | A4 "theo tháng: 70 ngày" | BV-HANG-QUA-THANG-KHONG-TINH |
| `trangThaiGiay` ≤ 30 ngày | A4 giấy tờ 30 ngày | VS-GIAY-30-NGAY-LOAI-TRU |
| `thuocConHan` hết đợt thôi nhắc | B1 / B2 hết đợt | BV-THUOC-HET-DOT-VAN-NHAC |
| `bayNgayThuoc` 7 ngày trước | B1 7 chấm | VS-THUOC-BAY-NGAY-LECH-MOT |
| `chuKyHomNay` giai đoạn Chậm kinh | C2 giai đoạn | VS-CHAM-KINH-KHONG-TOI |
| `bangCoNhac` nhắc thuốc không tên thuốc | B3 | VS-NHAC-THUOC-LO-TEN-THUOC |
| `bangCoNhac` nhắc kỳ: "Lời nhắc của bạn" | C4 | BV-NHAC-CHU-KY-LO-CHU-KINH |
| `danhDauNgay` bỏ việc riêng tư | B3 / C4 | BV-CHUONG-LICH-LO-VIEC-RIENG |
| `thongTinVk` Họ gia tiên = chữ đầu | E1 | VS-MAC-DINH-HO-GIA-TIEN-TRONG |
| `thongTinVk` Địa chỉ = dia_chi | E1 | VS-MAC-DINH-DIA-CHI-TRONG |
| `luuMay` xoá `kh_kehoach` khi đổi khách | D3 | BV-DOI-KHACH-KHONG-XOA-KE-HOACH |
| danh mục `xe.macdinh` giấy tờ ô tô | A2 | VS-LICH-OTO-THIEU-DANG-KIEM |
| `ghiLanSua` km trống = km xe | A3 "Vừa làm hôm nay" | VS-VUA-LAM-KHONG-LAY-KM-XE |
| `doiUong` bấm lại bỏ đánh dấu | B1 | VS-DOI-UONG-KHONG-BO-DANH-DAU |
| `upList` Chu kỳ theo xưng hô | C4 | BV-SAP-TOI-CHU-KY-CHO-ANH |
| `ghiKyMoi` chỉ ghi chu kỳ 10–120 ngày | C2 | VS-GHI-KY-MOI-GHI-CA-KY-NHAM |
| `chuKyDoc` bỏ qua `khoa` / `thu` của bản lưu cũ (gỡ khoá mã 12.11) | C3 "bản lưu cũ có khoa + thu…" | VS-DOC-BAN-CU-GIU-KHOA-THU |
| `XeCo` "Xoá xe" hỏi lại một lần | Chromium A2 | BV-HOI-XOA-XE-XOA-LUON |
Kết quả: **19 / 19 đột biến bị bắt** (18 bắt được cả khi `KHONG_TRINH_DUYET=1`, riêng BV-HOI-XOA-XE-XOA-LUON chỉ bắt được trong Chromium: 100 đạt · 1 hỏng). 6 đột biến về khoá mã (KHOA-LUU-MA-GOC, SAI-5-LAN, SAP-TOI-KHOA, NHAN-SAP-TOI-KHOA, BADGE-CHU-KY-KHOA, CHU-KY-KHOA-KHONG-HOI-MA) đã gỡ cùng tính năng.

## Khoá nội dung đã thêm (F4 — `src/noiDung/nd/tienIch.js`, 195 mục, `kiemDanhMuc` không lỗi; màn đọc qua `nd()` / `ndDs()` / `ndHien()` + `data-nd`)
- `ti.*` (7): luu, tagXe, tagThuoc, tagChuKy, chuaSan, xoaNgay, loiKho
- `hien.*` (5, ẩn / hiện khối): ocXe, ocThuoc, ocChuKy (ô ở lưới), vkKhung (khung thông tin gia đình), vkGoiYLe (dòng gợi ý dâng thêm)
- `xe.*` (88): tieuDe, phu, them, ghiChu, trong, on, giaySapHet, hangSap, conKm, conNgay, hoacNgay, toiHan, chuaGhi, lanCuoi, moiKm, moiThang, hoac, badgeCo, badgeSap, badgeOn, badgeTrong, kmNhan, kmPhu, km, daKm, lichTieu, themHang, chuaHang, vuaLam, daGhiHang, nhacTieu, nhacPhu, giayTieu, giayChua, giayNgayTieu, giayHet, giayCon, lsTieu, lsTrong, ghiSua, suaXe, xoaXe, loaiXoa, daXoa, formThem, formPhu, loai, ten, tenGoiY, bien, bienGoiY, kmLb, kmGoiY, mauNote, mauGiay, mauKhong, nutThem, nhapTen, daLuu, hangThem, hangSua, hangTen, hangTenGoiY, hangNhacLb, hangKm, hangThang, hangXoa, nhapHang, nhapKmThang, daLuuHang, daXoaHang, **hangGoiY** (danh sách), **viecKhac** (danh sách), logTieu, logNgay, logKm, logViec, logViecKhac, logThemNut, logPhi, logPhiGoiY, logNoi, logNoiGoiY, logNote, logChon, logDaLuu, logSapTheo, **macdinh** (danh sách: lịch bảo dưỡng + giấy tờ mặc định theo loại xe)
- `thuoc.*` (37): tieuDe, phu, them, tongNhan, bayNhan, den, xong, chua, da, xoa, loaiXoa, ghiChu, nhacTieu, trong, badge, badgeTrong, formTieu, formPhu, ten, tenGoiY, lieu, lieuGoiY, lieuMacDinh, gio, gioThem, gioBo, ghi, ghiGoiY, trongLb, **dot** (danh sách "Uống trong"), luu, ghiNho, nhapTen, nhapGio, daLuu, daBat, daTat
- `chuky.*` (39): tieuDe, phu, offTieu, offMo, bat, hoiNgay, hoiNut, ngayLoi, homNay, ngay, kyToi, conNgay, daToi, ph0…ph4, duongSinh, kyBatDau, daGhiKy, daiLb, hanhLb, soNgay, lsTieu, lsDong, lsTrong, nhacTieu, nhacPhu, loiNhac, ghiChu, tat, loaiXoa, tenXoa, daTat, sapToi, sapToiPhu, badgeNgay, badgeBat
- `cyc.0` … `cyc.4` (5, chữ dưỡng sinh theo giai đoạn — đúng tên khoá `data-cms="t:cyc.N"` của demo)
- `vk.*` (14): khungTieu, khungNote, tinChu, hoGia, diaChi, goiYTen, goiYHo, goiYDc, dongTin, sua, chamDien, nhacThieu, leVatGoiY, suaTieu
- Đã GỠ cùng khoá mã (12.11, 19 mục): `chuky.khoaTieu`, `khoaPhu`, `datMa`, `datMaPhu`, `nhapLai`, `khongKhop`, `daKhoa`, `daTatKhoa`, `moMa`, `maSai`, `cho`, `quen`, `xoaSo`, `xacNhan`, `khongKhoa`, `sapToiRieng`, `badgeKhoa`, `khongHoTro` và `ti.tagRieng` (grep `src/`: không còn nơi dùng).
- Phần lấy từ POS / App tự tính (khoá 🔒): không có mục mới — tên + địa chỉ tài khoản là dữ liệu POS dùng làm mặc định, ngày / lịch tự tính không hiện thành chữ riêng.
- K10: tệp mới (`XeCo.jsx`, `UongThuoc.jsx`, `ChuKy.jsx`) 0 chữ cứng; tệp sửa không tăng (kết quả `--day-du` sau gỡ khoá: xem mục Cổng).

## Bằng chứng nghiệm thu (mỗi mục một dòng — bài thử `cong_cu/thu_KHUI5f.js` trừ khi ghi khác)
- A1 danh sách xe + dòng trạng thái + "N xe · …" + lời mời khi chưa có xe: Chromium "A1 chưa có xe…", "A1 quay lại danh sách…", "D1 ô Xe cộ ở lưới"; hàm "D1 Xe cộ: N xe · M sắp tới hạn / ổn / Thêm xe".
- A2 thêm / sửa / xoá xe, lịch mặc định theo loại, danh sách mặc định sửa được: thuần "A2 Xe máy…", "A2 Ô tô…", "A2 Xe đạp điện…", "A2 thêm xe máy…", "A2 tên trống…", "A2 tối đa 20 xe", "F4 danh mục"; Chromium "A2 bảng Thêm xe…", "A2 chưa nhập tên…", "A2 lưu → kho…", "A2 Xoá xe → hỏi lại…", "A2 xác nhận Xoá…".
- A3 một xe (km, lịch xếp theo sắp tới hạn, Vừa làm hôm nay, hạng mục thêm / sửa / xoá, giấy tờ, lịch sử + tổng chi phí, ghi lần sửa, nhắc): thuần "A3 sapHang", "A3 Vừa làm hôm nay…", "A3 ghi lần sửa…", "A3 sửa nhanh số km…", "A3 hạng mục…", "A3 giấy tờ…", "A3 tổng chi phí"; Chromium "A3 một xe…", "A3 Vừa làm hôm nay…", "A3 sửa nhanh số km…", "A3 Ghi lần sửa…", "A3 giấy tờ…", "A3 thêm hạng mục / thiếu km lẫn tháng / lưu hạng mục mới".
- A4 itemState / docState / vehState: 15 ca thuần "A4 …" (km trước, tháng trước, chưa ghi, quá hạn, ngưỡng 150 km / 10 % / 7 ngày / 30 ngày, nhiều lần ghi, chỉ theo tháng).
- B1 danh sách thuốc, nút giờ, tổng, 7 chấm, xoá hỏi lại, nhắc bật / tắt: thuần "B1 hôm nay 0/2…", "B1 bấm một giờ…", "B1 7 chấm…", "B1 thuốc hết đợt vẫn được tính…", "B1 nhắc từng thuốc…"; Chromium "B1 chưa có thuốc…", "B1 ô tổng 0/2…", "B1 bấm giờ 07:30…", "B1 xoá thuốc → hỏi lại", "D3 tải lại: vẫn 1/2".
- B2 thêm thuốc (tên, liều, 1–3 giờ bánh xe, ghi chú, Uống trong), thiếu tên / giờ nhắc nhẹ, hết đợt: thuần "B2 thêm thuốc…", "B2 Dài ngày…", "B2 thiếu tên…", "B2 hết hạn uống…"; Chromium "B2 thiếu tên…", "B2 bảng thêm thuốc: 2 bánh xe giờ…", "B2 lưu → kho…", "B2 hết đợt uống: …ghi đã xong".
- B3 riêng tư (nhắc chỉ "Đến giờ uống thuốc", ghi chú cuối màn): thuần "B3 nhắc uống thuốc chỉ là…", "B3 thanh nhắc lúc 09:00…", "B3/C4 việc ảo riêng tư KHÔNG hiện chuông"; Chromium "B3 20:30 dải nhắc… KHÔNG tên thuốc", "D2/B3 Sắp tới…", "B1 chưa có thuốc… ghi chú riêng tư".
- C1 ô Chu kỳ ẩn với anh / chú / bác / ông; chưa bật → thẻ + Bắt đầu hỏi ngày: thuần "C1 ô Chu kỳ vẫn ẩn…", "C1 bật với ngày hợp lệ…"; Chromium "C1 chưa bật…", "C1 bấm Bắt đầu → hỏi ngày…" (xưng hô "anh" → 5 ô: thu_KHUI5e "A2 xưng hô anh" vẫn xanh).
- C2 hôm nay Ngày N + giai đoạn + kỳ tới + dải + dưỡng sinh cyc.N + ghi kỳ mới + ± + 6 kỳ gần nhất + nhắc + ghi chú + tắt & xoá: thuần "C2 chu kỳ 28 / hành kinh 5…", "C2 Ngày N…", "C2 dải ngày…", "C2 trung bình 6 chu kỳ…", "C2 Kỳ kinh bắt đầu hôm nay…", "C2 độ dài 21–40…", "C2 tắt & xoá"; Chromium "C2 đã bật…", "C2 dải 28 ô…", "C2 chỉnh + độ dài…", "C2 chu kỳ đã đủ 28 ngày… Chậm kinh", "C2 Kỳ kinh bắt đầu hôm nay → ghi 28", "C2 Tắt & xoá → hỏi lại / xoá thật".
- C3 KHÔNG khoá mã khi mở Chu kỳ (phiếu sửa 11.11): thuần "C3 chuKyTrong không còn trường khoa / thu; kho không xuất hàm khoá…", "C3 bản lưu cũ có khoa + thu: đọc không lỗi, BỎ QUA hai trường đó…", "C3 ghi lại thì kho không còn khoa / thu"; Chromium "C3 màn Chu kỳ đã bật KHÔNG có công tắc … bàn phím số / hỏi mã", "C3 mở lại Chu kỳ → vào thẳng, không hỏi mã; kho không có khoa / thu", ca mới `chukyKhoaCu` "C3 bản lưu cũ CÓ khoá + thử mã → mở thẳng Chu kỳ (Ngày 4), giữ đủ dữ liệu…" và "C3 ghi lại thì kho không còn khoa / thu".
- C4 dải nhắc "Lời nhắc của bạn"; Sắp tới luôn "Kỳ kinh dự kiến": thuần "C4 nhắc trước kỳ…", "C4 Sắp tới luôn…", "C4 xưng hô anh…"; Chromium "C4 Sắp tới luôn "Kỳ kinh dự kiến" (không còn "Lời nhắc riêng tư")".
- D1 lưới 6 ô mở đúng màn + chữ nhỏ: Chromium "D1 lưới 6 ô…", "D1 bấm ô Xe cộ…", "D1 Uống thuốc…, Chu kỳ…", "D1 Back…", "D1 ô lưới Chu kỳ luôn "Ngày N""; thuần "D1 Xe cộ / Uống thuốc / Chu kỳ" (Chu kỳ: chưa bật "Bật", đã bật "Ngày N"); đường dẫn "D đường dẫn: /kehoach/xeco · /uongthuoc · /chuky".
- D2 Sắp tới + dải nhắc + thanh nhắc có xe / thuốc / chu kỳ, bấm mở đúng tiện ích: thuần "D2 Sắp tới: …", "D2 nhắc xe…", "D2 việc ảo… → đúng tiện ích"; Chromium "D2 Sắp tới có hạng mục xe…", "D2 bấm dòng xe → /kehoach/xeco", "D2 bấm Xem ở dải nhắc thuốc → mở đúng Uống thuốc", "B3 20:30 dải nhắc…".
- D3 `kh_kehoach` thêm `xe` / `thuoc` / `thuocXong` / `chuKy`; bản cũ đọc đủ, hỏng → mặc định, xoá khi đổi khách / đăng xuất: thuần 8 ca "D3 …" (gồm "D3 đổi khách khác → xoá luôn xe / thuốc / chu kỳ", "không thêm khoá lưu mới"); `luuMay.js` KHÔNG sửa (đã áp cho khoá `kh_kehoach`).
- E1 khung "Thông tin gia đình khi khấn" điền sẵn từ tài khoản, sửa → lưu trên máy: thuần 4 ca "E1 …"; Chromium "E1 khung … điền sẵn từ tài khoản", "E1 khách sửa Họ gia tiên → lưu".
- E2 dòng gọn "Tín chủ: … · Địa chỉ: …  Sửa ›": Chromium "E2 đầu bài…", "E2 bấm Sửa ›"; thu_KHUI5e "C2 một dịp (E2…)".
- E3 chỗ trống "(chạm để điền …)", chạm chỗ tô màu → đúng ô, nhắc nhẹ khi thiếu: thuần "E3 dienBai…"; Chromium "E3 chạm chỗ tô màu Địa chỉ → mở đúng ô", "E3 sửa Địa chỉ trong bảng", "E3 tài khoản chưa có địa chỉ…", "E3 điền xong…".
- E4 dòng gợi ý dưới Lễ vật, không nút đặt hàng: Chromium "E4 dưới Lễ vật…".
- F1 bài mới `thu_KHUI5f.js`: **83 ca** (KHONG_TRINH_DUYET=1) / **174 ca** (có Chromium), 0 hỏng.
- F2 bài cũ sửa đúng ca, mỗi bài ≥ 1 ca ĐỎ trên gốc, không thêm `## Bài thử cũ sửa`, không bớt ca: thu_KHUI5e (6 ca sửa + 3 ca Chromium, 71 → 71 / 120 → 120), thu_KHUI5b (1 ca sửa, 75 → 75) — xem `bang_chung_do.txt`. Lượt 12.11 không đụng hai bài này.
- F3 ảnh 360 / 390 / 430 + `doi_chieu_demo.md`: `so_anh/` (12 màn × 3 cỡ × demo / app / lệch); ảnh `*_chuky_hoi_ma_app.png` đã xoá, `chuky_on` / `chuky_on_duoi` chụp lại sau khi bỏ hàng khoá; `doi_chieu_demo.md` ghi hàng khoá "bỏ hàng này" (chủ quán 11.11); `chup_anh.js` đã bỏ phần hỏi mã.
- F4 sửa được ở /admin: mục trên (195 khoá); `npm test` / `--day-du` / cổng: xem mục "Cổng".
- F5 trình duyệt Zalo (User-Agent có "Zalo"): Chromium "F5 trình duyệt Zalo: mở thẳng /kehoach/vankhan/r…", "F5 nút quay lại → /kehoach/vankhan" (giả lập UA; chưa thử trên Zalo thật — xem CHƯA KIỂM).
- F6 chủ quán thử tay: xem BÁO CÁO · CHƯA KIỂM.

## Cổng (lượt 12.11, sau gỡ khoá mã)
- `npm test` (có Chromium): 45 đạt · 0 hỏng (thu_KHUI5f 174, thu_KHUI5e 120).
- Đột biến `dot_bien_tay.js --trinh-duyet`: TẤT CẢ 19 BỊ BẮT.
- `--day-du`, cổng `tinh` + `chay`, `/ra-soat`: ghi ở các mục dưới.

## BÁO CÁO 7 MỤC (sau gỡ khoá mã Chu kỳ — 12.11)
1. **VIỆC** KH-UI-5f: Xe cộ · Uống thuốc · Chu kỳ (KHÔNG khoá mã — chủ quán 11.11) + Văn khấn điền sẵn Tín chủ / Họ / Địa chỉ; gắn vào lưới, Sắp tới, dải / thanh nhắc.
2. **ĐÃ SỬA** `kehoachLap.js` (hàm thuần xe / thuốc / chu kỳ, chữ trạng thái; bỏ `taoKhoa` / `kiemKhoa` / `thuMa` / `datKhoaChuKy` / `datThuChuKy` / băm SHA-256), `kehoach.js` (kho `xe` / `thuoc` / `thuocXong` / `chuKy`, `upList`, `bangCoNhac`, `chuThich`, `thongTinVk`; `chuKyDoc` bỏ qua `khoa` / `thu`), `XeCo.jsx` · `UongThuoc.jsx` · `ChuKy.jsx` (bỏ `BanPhim` / `DatMa` / `HoiMa` / công tắc khoá), `VanKhanMan.jsx`, `vanKhan.js`, `TienIch.jsx`, `KeHoach.jsx`, `DaiNhacViec.jsx`, `dungKeHoach.js`, `duongDan.js`, `giaoDien/tien_ich.css` (bỏ `.cyc-khoa`), `noiDung/nd/tienIch.js` (195 khoá). Lượt 12.11 chủ yếu XOÁ code (ChuKy.jsx −61 dòng…).
3. **BÀI THỬ** thu_KHUI5f 83 / 174 ca (+3 ca đỏ trên gốc, −ca khoá); 19 / 19 đột biến bị bắt; `npm test` 45 đạt · 0 hỏng (có Chromium).
4. **ĐÃ RÀ K4** grep `taoKhoa|kiemKhoa|thuMa|datKhoaChuKy|datThuChuKy|conChoGiay|SAI_TOI_DA|cyc-khoa|chuky.(khoa…)|tagRieng` trong `src/`: không còn; mọi nơi gọi `upList` / `bangCoNhac` / `chuThich` đã đồng bộ (không còn nhánh khoá).
5. **CHƯA KIỂM** thử tay trên điện thoại / Zalo thật (F5 chỉ giả lập User-Agent, F6); địa chỉ mặc định Văn khấn khi mở app ngoại tuyến (tóm tắt tài khoản không lưu `dia_chi` → để trống, không bịa); ≥ 1024 px (chưa có mẫu màn to); cổng `chay` chạy với `KHONG_TRINH_DUYET=1` (phần Chromium chạy ở máy làm việc, đã xanh).
6. **GIT** nhánh `viec/KH-UI-5f`; không merge, không PR.
7. **BÀI HỌC** xem mục dưới.

## Bài học
- KHOÁ (đã làm): ca "bản lưu cũ có `khoa` + `thu` vẫn mở thẳng và giữ đủ dữ liệu" + đột biến VS-DOC-BAN-CU-GIU-KHOA-THU — gỡ một tính năng có lưu dữ liệu thì phải có ca cho bản lưu CŨ.
- KHOÁ (đã làm): `dot_bien_tay.js` có chuỗi vá lệch với mã (BV-HOI-XOA-XE-XOA-LUON báo "không tìm thấy chỗ vá" mà trước đó không ai thấy vì chỉ chạy với `--trinh-duyet`) → đã sửa; chạy đủ `--trinh-duyet` sau MỖI lần sửa `src/`.
- NGUYÊN TẮC (đề xuất, ngoài Phạm vi `KHUON_LOI.md`): tính năng chủ quán có thể bỏ sau khi đọc phiếu (ở đây khoá mã Chu kỳ ≈ 300 dòng + 19 khoá chữ + 6 đột biến) — chọn phương án ít dòng nhất trước, đừng làm lớp bảo vệ riêng khi phiếu chỉ ghi "riêng tư".
- NGUYÊN TẮC (đề xuất): người gác chặn lệnh ghép "script + đường ống / &&", `git rm`/`git restore` có glob hoặc thư mục → tách lệnh, liệt kê từng file.
- BỎ: `chup_anh.js` đổi byte ảnh không đổi nội dung vì ngày hôm nay — chỉ cần commit ảnh thật sự đổi.
- Dọn `KHUON_LOI.md`: không đề xuất xoá mục nào.
