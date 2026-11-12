# KH-ND-3d — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-ND-3d`; HEAD `eaa9a34`, FETCH_HEAD `eaa9a34` (bằng nhau; kho nông — không cần kéo).
- `git log --oneline -3`:
  - `eaa9a34 PHIEU: KH-ND-3d`
  - `b7df000 TIEN-DO: KH-ND-3c, KH-UI-5f xong (chat soat cuoi DAT, gop PR); mo KH-ND-3d (...)`
  - `84b8699 Merge pull request #35 from tuquyduong/viec/KH-UI-5f`

## Nhật ký
- 12.11 mở việc, đọc phiếu + mã vùng Kế hoạch / tiện ích. Nợ chữ cứng các tệp A1 lúc mở: KeHoach 43 · TienIch 27 · BangNgay 54 · BangQuaHan 23 · BanhXoay 11 · NguoiThan 33 · VanKhanMan 20 · DaiNhacViec 3 · HoiXoa 6 · BangNoi 1 · KhoaTienIch 1 · kehoach.js 42 · kehoachLap.js 32 · lich.js 68 · vanKhan.js 7 · GiaMon 1 (tổng 372).

## Phát hiện (ngoài Phạm vi — không sửa)
1. Ví dụ ở phiếu B2 (`gia.donVi` = " VNĐ", 4 ký tự) vượt `toiDa: 3` của mục `gia.donVi` nên `nd()` bỏ giá trị và về "đ"; bài thử dùng "VNĐ" (3 ký tự) và có ca kiểm " VNĐ" bị bỏ. Nếu chủ quán muốn đơn vị dài hơn thì nới `toiDa` ở `taiKhoan.js` (ngoài Phạm vi).
2. `src/kehoach.js` còn regex `KHONG_VAO_SAP_TOI = /Tết Nguyên đán|Trung thu|Đoan ngọ|Vu Lan/` khớp theo TÊN ngày lễ: đổi tên ngày lễ ở /admin thì lễ đó sẽ lọt vào "Sắp tới" (đang bị loại vì đã có ở Văn khấn). Nên đổi sang loại theo mã / cờ khi làm KH-ADMIN-1.
3. `leNhac` (bật nhắc từng ngày lễ) lưu theo TÊN lễ: đổi tên lễ ở /admin → mất dấu nhắc đã bật của khách (không lỗi). `docKeHoach` lọc khoá theo danh sách tên hiện hành (đọc lúc mở app, có thể trước khi bản nội dung mới tải về).
4. `ndDau` của `DauMan` (đầu màn con): việc này thêm `khoaTieuDe` / `khoaPhu` cho `DauMan` ở KeHoach.jsx (Kế hoạch, Ngày cần nhớ, Theo mùa, Văn khấn, Sắp tới); `Xe cộ` / `Uống thuốc` / `Chu kỳ` (5f) vẫn truyền chuỗi, chưa gắn.
5. Ca đo nhiễu so ảnh: góc bo thẻ Kế hoạch (trống) đổi 40–46 điểm giữa các lần chụp, vị trí đổi — nhiễu khử răng cưa, không phải khác biệt.
6. Chỉ cặp ảnh cỡ 390 của mỗi ca được commit (hook chỉ cho `git add` từng tên tệp); bộ đủ 54 cặp chạy lại bằng công cụ ở nháp.

## Khoá đã thêm (CLAUDE.md §11 — mọi thứ mới khách thấy có khoá, sửa được ở /admin)
Tổng 316 mục (273 + mục khoá): 271 chữ · 39 đoạn · 5 danh sách · 1 khoá `tutinh` (`kh.lich`). Không khối mới (không thêm `hien.*`).
| Màn / nhóm | Khoá | Số mục |
|---|---|---|
| Kế hoạch (màn, thẻ ngày, lưới, lịch tháng, Sắp tới, ghi chú) | `kh.*` | 90 (gồm `kh.leDuong`, `kh.leAmLich`, `kh.leQua`, `kh.tiet` = 4 danh sách; `kh.lich` = khoá) |
| Lặp lại · nhắc · hạn · đếm ngược | `lap.*` | 33 |
| Bảng việc của ngày (+ hỏi xoá `hx.*`, bánh xoay `bx.*`) | `bn.*`, `hx.*`, `bx.*` | 43 + 6 + 9 |
| Việc quá hạn | `qh.*` | 18 |
| Dải nhắc việc | `dnv.*` | 4 |
| Ngày cần nhớ (+ người thân) | `ngc.*`, `ngt.*` | 8 + 24 |
| Sắp tới | `sap.*` | 3 |
| Theo mùa | `mua.*` (`mua.noiDung` danh sách 4 mùa, 6 nhãn) | 14 |
| Văn khấn (khung + 11 dịp × 4) | `vk.*` (mới 21) · `vkd.<dịp>.ten/le/cach/khan` | 21 + 44 |
Tên mùa / thứ / Can / Chi / 24 tiết khí / tháng âm: KHÔNG vào danh mục — `src/noiDung/coDinh/lich.js` (mục khoá `kh.lich`: "Lịch âm — App tự tính").
Khoá cố ý không gắn `data-nd`: khai trong `KHONG_GAN` của `thu_KHND3d.js` kèm lý do (thông báo nổi, aria / placeholder, hàm thuần trả chuỗi, gắn qua biến, chip nội bộ, danh sách dùng nhiều nơi).

## Bảng chỗ vá → đột biến
Việc không đụng tiền / bảo mật (chuyển chữ, hai sửa nhỏ giao diện), không có `dot_bien.py`.

## Nghiệm thu từng mục
| Mục | Bằng chứng |
|---|---|
| A1 chuyển hết chữ | `thu_KHND3d` Phần 1: 16 tệp A1 `demChuCung` = 0; 499 chuỗi có dấu của bản gốc (`chu_goc.json`) còn trong danh mục / coDinh; mọi khoá dùng có trong danh mục; mỗi khoá có chỗ gắn hoặc cờ; K10 (`no_chu_cung.txt` 434 → 62, chỉ còn `src/tracNghiem.js`) |
| A2 dữ liệu demo | `thu_KHND3d` A2 + `thu_KHUI5b` + `thu_KHUI5e`: ngày lễ, theo mùa, 24 tiết khí, 11 dịp khớp byte với demo; `dienBai` y hệt thuật toán cũ (11 dịp × 3 ngày × 2 bộ thông tin); ngày lễ sai dạng bị bỏ qua; bản lưu cũ mở như cũ |
| A3 lịch cố định | `thu_KHND3d` A3 (`coDinh/lich.js`, mục khoá `kh.lich`, không vào danh mục) |
| A4 tên xuất, kehoach.js | `thu_KHND3d` A4: ~70 tên xuất còn nguyên; `kehoach.js` 409 dòng (từ 490) — tách `kehoachXe.js` (xe / thuốc / chu kỳ) theo việc, `export … from` lại; `TERM_TIPS` giữ dạng mảng (Proxy) cho `tracNghiem.js` |
| A5 ảnh y hệt | `so_anh/ket_qua.txt`: 54 cặp, 53 giống hệt, 1 nhiễu góc bo (chạy lại thì chuyển cỡ) |
| B1 ô ẩn thì link không mở | `thu_KHND3d` B1: `ocHien` một hàm; `TienIch` anh → rỗng + `thayVeLich`; chị → Chu kỳ; `hien.ocXe` tắt → ẩn; Chromium: "anh" mở `/kehoach/chuky` → `/kehoach`, mở thẳng cũng vậy; "chị" → Chu kỳ; tắt `hien.ocChuKy` đang mở → về `/kehoach` |
| B2 GiaMon | `dinhDangSoTien`; `thu_KHND3d` B2 (gia.donVi "VNĐ" → cột giá hạng vẫn chỉ số; " VNĐ" 4 ký tự bị bỏ — Phát hiện 1) |
| B3 tel | `thu_KHND3d` B3 (`.replace(/[^\d+]/g, '')`, "0901 234 567" → "0901234567") |
| C1 bài mới | `thu_KHND3d.js`: 32 ca (KHONG_TRINH_DUYET=1) / 45 ca (Chromium) |
| C2 bài cũ sửa | UI5b, UI5e, UI5f, ND3b — `bang_chung_do.txt`: mỗi bài ≥ 1 ca đỏ trên gốc; không dùng `## Bài thử cũ sửa` |
| C3 đối chiếu | `doi_chieu_demo.md` |
| C4 /admin, kiểm | mục "Khoá đã thêm"; `npm test` 49 đạt (KHONG_TRINH_DUYET=1) |
| C5 thử tay | mục dưới |

## Thử tay (C5)
1. Kế hoạch, Ngày cần nhớ, Văn khấn, Xe cộ, Uống thuốc, Chu kỳ trông như cũ.
2. Tài khoản xưng "anh" gõ `tuquyduong.com/kehoach/chuky` → về Kế hoạch (không kẹt nút Back).

## Cổng (C4)
- `KHONG_TRINH_DUYET=1 node kiem_tra_truoc_khi_giao.js --day-du` (có `vite build`) tại `197f142`: 52 đạt · 0 hỏng. Lần chạy đủ CÓ Chromium (trước sửa Proxy, `1a83947`): 52 đạt · 0 hỏng (~25 phút).
- `node tu_chay/cong.js tinh . eaa9a34^ HEAD viec/KH-ND-3d`: chỉ còn `✗ [A19]` (thiếu dòng HEAD ĐÃ KIỂM) trước khi ghi dòng đó.
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . eaa9a34^ HEAD viec/KH-ND-3d` (HEAD `197f142`, cây sạch): `✓ CỔNG CHẠY ĐẠT` (cảnh báo A16 không chặn: `thu_KHUI5b.js` / `thu_KHUI5e.js` dừng sớm trên gốc nên in 1 / 17 ca — đúng, bằng chứng ở `bang_chung_do.txt`).

## Soát độc lập (/ra-soat, vòng 1) — báo cáo của agent soát (tóm, nguyên ý)
KHÔNG ĐẠT (nhẹ). NGHIỆM THU 26/28 lúc soát; mục thiếu: C4 (dòng HEAD ĐÃ KIỂM + kết quả cổng chưa ghi — nay đã ghi mục "Cổng" trên), A5 (chưa chụp thanh nhắc việc đang chạy và tiết khí khác Lập đông — đã khai ở `ket_qua.txt`, giữ ở CHƯA KIỂM).
LỖI: (1) `src/lich.js` Proxy `TERM_TIPS` ném lỗi với khoá Symbol (`[...TERM_TIPS]`) — ĐÃ SỬA (`typeof k === 'string'`) + ca thử mới (đỏ trước vá, xanh sau). (4) regex `KHONG_VAO_SAP_TOI` theo tên lễ — đã ở Phát hiện 2. (5) tên xuất `CO_NHAC` / `KHONG_NHAC` / `NHAC_NGUOI` bị bỏ (thành `nd('kh.coNhac')`, `nd('kh.khongNhac')`, `nhacNguoi()`): grep không còn nơi gọi, bài thử cũ đã sửa — chỗ lệch chữ phiếu A4, ghi nhận. (6) `<em>Aa</em>` mẫu chữ chú thích (demo cũng có) và mọi chữ ASCII hiển thị: `demChuCung` chỉ đếm chuỗi có dấu — ghi ở Bài học.
NGHI NGỜ: xưng hô chưa biết thì Chu kỳ thoáng hiện rồi mới về /kehoach (chấp nhận, không kẹt Back); `leNhac` theo tên lễ (Phát hiện 3); ca "mục thừa" của thu_KHUI5f nới cho `vkd.*` / `mua.nhan.*` (có ca F4 mới bù).
K3: 4 bài cũ sửa đều ≥ 1 ca đỏ trên gốc; ca đỏ phần lớn kiểm sự có mặt của khoá / hàm, hành vi được giữ bởi ca so demo và so `dienBai` cũ.
CHƯA SOÁT ĐƯỢC (theo agent): ca Chromium, chạy cổng, so ảnh pixel.

## Báo cáo 7 mục
1. **VIỆC**: KH-ND-3d — gom chữ Kế hoạch + mọi tiện ích về danh mục; lịch cố định ở `coDinh/lich.js`; B1 ô ẩn thì đường dẫn không mở; B2 `dinhDangSoTien`; B3 `tel:`.
2. **ĐÃ SỬA**: `src/noiDung/nd/{keHoach,tienIch}.js` (316 khoá mới) · `src/noiDung/{coDinh/lich.js (mới),vanKhan.js}` (xoá `noiDung/keHoach.js`) · `src/{kehoach,kehoachLap,kehoachXe (mới),lich,vanKhan,dinhDang}.js` · `src/pages/{KeHoach,TienIch,TheoDoiDon}.jsx` · `src/components/{BangNgay,BangNoi,BangQuaHan,BanhXoay,DaiNhacViec,GiaMon,HoiXoa,KhoaTienIch,NguoiThan,OKeHoach,VanKhanMan,dungKeHoach}` · `src/App.jsx` (1 dòng) · `cong_cu/{thu_KHND3d (mới),thu_KHUI5b,5e,5f,thu_KHND3b,no_chu_cung.txt}`. Nợ chữ cứng 434 → 62 (chỉ còn `tracNghiem.js`).
3. **BÀI THỬ**: `thu_KHND3d` 33 ca / 46 ca có Chromium; 4 bài cũ sửa; `--day-du` 52 đạt · 0 hỏng; so ảnh 54 cặp, 53 giống hệt + 1 nhiễu.
4. **ĐÃ RÀ K4**: grep `SOLAR_HOL|LUNAR_HOL|GIFT_HOL|SS_F|CO_NHAC|NHAC_NGUOI|KHONG_NHAC|VK.n/.le/.vk|noiDung/keHoach|noiDung/vanKhan` trong `src/` và `cong_cu/` — mọi nơi dùng đã chuyển (`duongDan.js` vẫn đọc `MA_DIP`, giữ ở `noiDung/vanKhan.js`; `tracNghiem.js` đọc `TERM_TIPS` qua Proxy).
5. **CHƯA KIỂM**: trình duyệt Zalo; chữ to theo cài đặt máy; /admin chưa có nên chưa thấy viền vàng / 🔒; ảnh chưa chụp: thanh nhắc việc đang chạy, tiết khí khác Lập đông; ảnh commit chỉ mẫu 390 (bộ đủ 54 cặp chạy lại bằng công cụ ở nháp); thử tay C5 trên điện thoại chưa ai làm.
6. **GIT**: nhánh `viec/KH-ND-3d` đã push; không PR, không merge.
7. **BÀI HỌC**: xem mục Bài học.

## Bài học
- KHOÁ (đề xuất, ngoài Phạm vi — `kiem_tra_truoc_khi_giao.js` / `ha_no_chu.js`): `demChuCung` mù với chữ ASCII hiển thị (`Aa`, `Xong`) và chữ trong regex khớp theo tên nội dung (`KHONG_VAO_SAP_TOI`) — thêm phép kiểm riêng; ca đỏ: bản giả JSX `<b>Xong</b>` / regex chứa tên lễ.
- KHOÁ (đã làm): `chu_goc.json` + ca "mọi chuỗi gốc còn trong danh mục" cho `thu_KHND3d` (tiếp lời đề xuất của 3c: gom thành bài chung cho các việc ND — chưa làm); ca TERM_TIPS dùng như mảng thật.
- NGUYÊN TẮC (đề xuất K11): đối tượng giả mảng (Proxy) phải xử lý khoá Symbol; gói bài thử dựng riêng (esbuild) có BẢN `nd.js` riêng — đổi nội dung ở module ESM ngoài không ảnh hưởng gói: phải đổi bằng `datBanNoiDung` XUẤT TỪ CHÍNH gói đó (suýt có bài xanh giả ở B2).
- NGUYÊN TẮC (đề xuất): `bien` của mục chữ bắt buộc khớp đúng chỗ `{…}`: bản giả thiếu chỗ điền bị bỏ nên bài thử đổi bài khấn phải giữ đủ 6 chỗ; ví dụ phiếu " VNĐ" vượt `toiDa` 3 — kiểm ví dụ của phiếu với `toiDa` trước khi viết ca.
- BỎ: lệnh bị người gác chặn (`sed -i`, ghép `python3 … && node`, `for`, `git add` thư mục, `$VAR` làm đích ghi) — chỉ làm lại; sai chỗ gắn `data-nd` thành `<span>` lồng làm vỡ bài thử cũ → chuyển `data-nd` lên phần tử cha.
- Dọn: không đề xuất xoá lời dặn nào.

HEAD ĐÃ KIỂM: 197f142
