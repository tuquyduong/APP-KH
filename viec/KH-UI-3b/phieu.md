# KH-UI-3b — Phần v3 còn lại: hồ sơ xưng hô + địa chỉ, lời chào theo xưng hô, tự gia hạn đăng nhập, menu công khai, sửa nhỏ /kiemkhop và .hb-k

<!-- Chat App KH soạn 31.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 02.11.
     POS gộp KH-API-3 (hợp đồng v3) 31.10 và Render tự cập nhật → máy chủ thật ĐANG là v3. Đăng ký 3 bước (Tên + Xưng hô) App đã có từ KH-XEM-1,
     /kiemkhop 31.10 xác nhận /toi có xung_ho, dia_chi và /menu không token trả đủ.
     Bản hợp đồng v3 chat chép NGUYÊN VĂN từ kho POS (main 97d1de2) vào viec/KH-UI-3b/hop_dong_v3.md (commit PHIEU chỉ được đụng viec/<MÃ>/).
     Quyết định áp dụng (thiet_ke/QUYET_DINH_APPKH.md): 29.10 đăng ký 3 bước + tự gia hạn mỗi lần mở app; 30.10 chỉ 3 thứ cần đăng nhập.
     Trang Ưu đãi cho khách vãng lai (banner Giờ vàng, thẻ hạng, chỉ khoá điểm / voucher) TÁCH sang KH-UI-3d — KHÔNG làm ở đây. -->

## Mục tiêu
App dùng đủ phần v3 POS đã chạy: khách sửa được cách xưng hô và địa chỉ, Trang chủ chào đúng xưng hô theo giờ Việt Nam, dùng thường xuyên thì không phải đăng nhập lại.
Đồng thời dọn phần chỉ dành cho v2 (thẻ mời đăng nhập ở Menu) và sửa hai lỗi nhỏ đã biết.

## Nghiệm thu

### A. Hợp đồng v3 trong kho
- A1 Chép `viec/KH-UI-3b/hop_dong_v3.md` sang `thiet_ke/HOP_DONG_API_KH.md`, ĐÚNG TỪNG BYTE (kiểm bằng `cmp`). Không sửa chữ nào của hợp đồng.
- A2 `src/kiemKhop/canTuPos.js` theo v3: `POST /gia-han` thành `co: true`; mục `toi_v3` (xưng hô, địa chỉ) bỏ `moi` (đã là trường của hợp đồng);
  mục `menu` bỏ `viec_pos` "KH-API-3" và ghi chú "từ v3". Bài thử A2 của `thu_KHKHOP1.js` phải xanh với hợp đồng mới. Ca nào trong bài đó canh
  hành vi v2 (vd "/menu còn đòi đăng nhập → ⏳ chờ KH-API-3") thì sửa theo v3, ghi lý do trong `trang_thai.md`.
- A3 K8 vẫn xanh: mọi cửa `api.js` gọi đều có trong hợp đồng v3.

### B. Thông tin cá nhân (`/taikhoan/thongtin`) — theo demo `renderProfile` (patch39)
- B1 Thẻ "Quán gọi bạn là" của demo, đặt ĐẦU màn:
  - Hàng nút chọn lấy đúng danh sách `XUNG_HO` của `src/noiDung/dangNhap.js`. Danh sách này có 7 mã theo hợp đồng v3; demo chỉ có 6 vì thiếu "Bác", đây là khác demo lý do (a).
  - Dòng xem trước kiểu demo: “Chào buổi …, <Xưng hô> <tên ngắn>”.
  - Chạm một nút → `PUT /toi { xung_ho }`, chỉ gửi đúng khoá này. Lưu xong hiện "Đã lưu" như thẻ tên.
  - Lỗi → hiện câu lời thường, nút giữ lựa chọn cũ.
- B2 Thẻ "Thông tin": giữ ô "Họ và tên" như hiện tại. Nút lưu tên đổi sang `PUT /toi { ten }` qua hàm chung, không gửi khoá khác.
- B3 Thẻ "Giao hàng" (demo "Giao hàng & hoá đơn"):
  - MỘT ô "Địa chỉ nhận hàng" (tối đa 300 ký tự), có nút "Lưu địa chỉ" → `PUT /toi { dia_chi }`.
  - Ô trống mà lưu → gửi `""`, POS hiểu là xoá địa chỉ. Có dòng nhỏ báo: địa chỉ này dùng chung với quầy, in trên hoá đơn.
  - Demo có "Địa chỉ đã lưu" (nhiều địa chỉ), Email, Giới tính, Ngày sinh, Thông tin xuất hoá đơn: KHÔNG làm, vì POS chưa có cửa (lý do (a), KH-HOSO-1).
- B4 Mã lỗi v3 có lời tiếng Việt trong `dinhDang.js` (`loiTheoCode`): `XUNG_HO_SAI`, `DIA_CHI_QUA_DAI`, `TEN_KHONG_HOP_LE`, `YEU_CAU_KHONG_HOP_LE`.
- B5 `api.js`: thay `doiTen` bằng MỘT hàm `suaHoSo(truong)` → `PUT /toi`, thân chỉ chứa các khoá được truyền. Không thêm cửa nào khác.
- B6 Dòng phụ "Thông tin cá nhân" ở màn Tài khoản theo demo, chỉ nêu phần đã có: xưng hô, mã PIN, địa chỉ.

### C. Lời chào Trang chủ — theo demo `setGreeting`
- C1 Đã đăng nhập: "<Chào buổi sáng | trưa | chiều | tối>, <Xưng hô viết hoa chữ đầu> <tên ngắn>".
  - Tên ngắn là từ cuối của `ten`, theo `shortName` của demo.
  - Mốc giờ theo demo: 5–11 giờ sáng, 11–13 giờ trưa, 13–18 giờ chiều, còn lại là tối.
- C2 Giờ lấy theo `bay_gio` của POS (`bayGio()` trong `src/bayGio.js`). KHÔNG dùng đồng hồ máy (CLAUDE.md §6).
  - Chưa có `bay_gio` → "Chào <Xưng hô> <tên ngắn>", không có buổi.
  - Khách chưa có xưng hô (`null`, khách cũ) → bỏ phần xưng hô.
  - Chưa có tên → "bạn".
- C3 Chưa đăng nhập: giữ như hiện nay ("Chào bạn").
- C4 Đổi xưng hô hoặc tên ở Thông tin cá nhân rồi quay về Trang chủ → lời chào mới hiện ngay, không cần tải lại trang.
- C5 Hàm tạo lời chào là hàm thuần trong `dinhDang.js`, nhận vào (giờ, xưng hô, tên). Bài thử nạp thẳng hàm này.

### D. Tự gia hạn đăng nhập — hợp đồng v3 "Tự gia hạn"
- D1 Mở app khi đã đăng nhập → `POST /gia-han`, tối đa MỘT lần mỗi ngày.
  - "Ngày" tính theo ngày Việt Nam của `bay_gio` POS; chưa có `bay_gio` thì chờ có.
  - Ngày đã gia hạn lưu ở máy, khoá `kh_gia_han`. Kho bị chặn thì gọi lại ở lần mở sau, không báo lỗi.
- D2 Thành công → `luuToken(token mới)`.
  - 401 → hết phiên như các cửa khác. Đây là hành vi sẵn có của `api.js`, không viết đường riêng.
  - 429, lỗi mạng hay 5xx → im lặng, không ghi ngày, để lần mở sau thử lại.
  - Không làm chậm hay chặn màn nào.
- D3 Khoá `kh_gia_han` đi theo quy tắc xoá của `src/luuMay.js` (xoá khi Đăng xuất hoặc đổi khách): thêm khoá vào danh sách ở đó.
- D4 Chỉ gọi khi có token. Khách vãng lai không gọi.

### E. Menu công khai (v3)
- E1 Bỏ thẻ mời "Đăng nhập để xem menu và giá" ở Menu và Trang món: các nhánh `canDN` trong `Menu.jsx`, `MonTheoDuong.jsx`, `menuLuu.js`, `dungMenu.js`, hằng `THE_MOI_MENU`.
  - Trong v3, 401 ở `/menu` chỉ xảy ra khi gửi token sai. Khi đó `api.js` xoá token → hết phiên → menu gọi lại KHÔNG token và hiện bình thường.
  - Bài thử chứng minh luồng này (E3). Không để lại code chết.
- E2 Bản menu công khai lưu trên máy (khi chưa đăng nhập) giữ cả `gia_hang`, vì v3 trả giá mọi hạng cho khách vãng lai.
  - Đổi phiên vẫn bỏ `gia_hang` như hiện nay, để không hiện giá theo hạng của khách trước.
- E3 POS giả, hai ca:
  - `/menu` với token sai → 401 `KH_TOKEN_SAI`, không token → 200: khách thấy menu, không thấy chữ lỗi, đã ở trạng thái chưa đăng nhập.
  - Khách vãng lai thấy bậc giá các hạng ở Trang món như demo, kể cả khi mở lại app từ bản lưu.

### F. Sửa nhỏ
- F1 `/kiemkhop`: nút "Kiểm lại" đọc lại đăng nhập (`docToken()`) mỗi lần kiểm.
  - Lỗi hiện tại: chủ quán đăng nhập ở tab khác thì bấm "Kiểm lại" vẫn báo "Đăng nhập để kiểm".
  - Vẫn "mỗi cửa một lần mỗi lần kiểm", khoá 5 giây.
- F2 `.hb-k` (nhãn nhỏ in hoa ở ô Giờ vàng / Trắc nghiệm) mất dấu tiếng Việt ở màn 360. Nguyên nhân: `overflow:hidden` + chiều cao dòng quá thấp ở cỡ ~9px.
  - Sửa cho dấu hiện đủ ở 360 / 390 / 430, chữ 100% và 130%, KHÔNG đổi màu / phông / cỡ chữ (K9).
  - Đây là lỗi có sẵn trong demo, nên được khác demo. Ghi trong `doi_chieu_demo.md`.

### G. Đăng ký 3 bước — chỉ KIỂM với hợp đồng v3, chỉ sửa nếu lệch
- G1 POS giả dựng theo v3, các ca:
  - Khách mới → `CAN_TEN` → màn "Thông tin của bạn" → gửi `ten`, `xung_ho`, `dia_chi` (địa chỉ trống thì không gửi) → vào app.
  - `XUNG_HO_SAI`, `DIA_CHI_QUA_DAI`, `TEN_KHONG_HOP_LE` ở bước 3 → hiện lời đúng, GIỮ chữ khách đã nhập.
  - Khách cũ → vào thẳng.
- G2 Lệch hợp đồng v3 ở đâu thì sửa ở đó và ghi vào `trang_thai.md`. Không lệch thì không đổi code đăng ký.

### H. Kiểm
- H1 `cong_cu/thu_KHUI3b.js` có hai phần:
  - Phần 1, hàm thuần và đọc nguồn: lời chào (mốc giờ, thiếu xưng hô, thiếu tên, thiếu `bay_gio`); một lần gia hạn mỗi ngày; thân `PUT /toi` chỉ có khoá được truyền; byte hợp đồng = byte `hop_dong_v3.md`.
  - Phần 2, Chromium + POS giả theo v3, chạy B, C4, D, E3, F1, G1 ở 360 / 390 / 430 và chữ 130%.
  - `KHONG_TRINH_DUYET=1` hoặc không có Playwright → BỎ QUA phần 2, không tính hỏng. `SỐ CA` ghi theo `KHONG_TRINH_DUYET=1` (CLAUDE.md §9).
- H2 Giao diện: so ảnh demo ↔ app (Thông tin cá nhân, đầu Trang chủ, ô `.hb-k` ở 360) theo CLAUDE.md §5.
  - Lưu ảnh vào `viec/KH-UI-3b/so_anh/`.
  - Lập `viec/KH-UI-3b/doi_chieu_demo.md`.
- H3 `npm test`, `--day-du` (K8, K9), `node tu_chay/cong.js chay` phải ĐẠT.
  - Đột biến VS- ≥ 4: gia hạn hai lần trong một ngày; `PUT /toi` gửi cả khoá không đổi; lời chào dùng đồng hồ máy; menu 401 hiện thẻ mời / chữ lỗi.
- H4 Chủ quán thử tay, 3 bước trên điện thoại:
  1. Tài khoản → Thông tin cá nhân → chọn "Chị" → về Trang chủ thấy "Chào buổi …, Chị <tên>".
  2. Nhập địa chỉ, lưu, tải lại trang → địa chỉ vẫn còn. POS (chi tiết khách) thấy cùng địa chỉ.
  3. Đăng xuất → mở Menu → thấy menu và giá các hạng, không có thẻ mời đăng nhập.

## Phạm vi
- viec/KH-UI-3b/**
- src/**
- thiet_ke/HOP_DONG_API_KH.md
- cong_cu/thu_KHUI3b.js
- cong_cu/thu_KHKHOP1.js
- cong_cu/thu_KHXEM1.js
- cong_cu/thu_KHUI2.js
- cong_cu/thu_KHLINK1.js
- cong_cu/thu_KHLUU1.js
- cong_cu/thu_KHMUA1.js
- cong_cu/thu_KHUI5a.js

## Ngân sách
~220 dòng app + ~320 dòng thử.
**Phương án đơn giản nhất đã xét:** dùng lại `api.js` (một hàm `PUT /toi`), `bayGio()`, `luuMay.js`, thẻ `pf-card` / `pf-chips` / `pf-prev` của demo.
Gia hạn là một hàm gọi một lần trong vỏ App. Không thêm máy chủ, không thêm thư viện, không thêm cửa ngoài hợp đồng v3.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- Trong `thiet_ke/` chỉ được thay `HOP_DONG_API_KH.md` bằng đúng bản `viec/KH-UI-3b/hop_dong_v3.md`.
- KHÔNG làm trang Ưu đãi cho khách vãng lai (KH-UI-3d). KHÔNG làm nhiều địa chỉ / email / ngày sinh (KH-HOSO-1).
- KHÔNG làm "Thêm vào giỏ quay lại trang trước" (KH-MUA-1b).
- Chỉ push `git push -u origin viec/KH-UI-3b`. Không đụng `main`, không merge, không tạo PR.
