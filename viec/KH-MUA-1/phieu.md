# KH-MUA-1 — Đặt đơn online phía App KH: Giỏ hàng, Thanh toán, Theo dõi đơn (dựng sẵn theo tên cửa POS, CHƯA gọi thật)

<!-- Chat App KH soạn 31.10.2026. Việc thường [Th], **Opus** (đường tiền: giá, giỏ, thanh toán) — chạy thẳng tới hết. Hạn 03.11.
     Chủ quán chốt 30.10: khách ĐẶT ĐƠN ONLINE ngay từ khai trương; đủ 5 mục; không kịp thì lùi khai trương, không mở với phần làm dở (thiet_ke/QUYET_DINH_APPKH.md).
     POS trả lời 31.10 (thiet_ke/trao_doi/TRA_LOI_POS_31102026.md): KH-MUA-1 phía POS (nhận tại quán + QR payOS + ví/PIN) gộp ~02–03.11; KH-MUA-2 (Ahamove) ~05–06.11;
     tên cửa DỰ KIẾN ở mục 3 của file đó. Hợp đồng /api/kh CHƯA có các cửa này → bộ kiểm K8 cấm thêm lời gọi vào src/api.js. Việc này dựng TOÀN BỘ giao diện + logic
     với một "cổng đặt đơn" tiêm vào (thử bằng POS giả đúng tên trường dự kiến); nối thật là KH-MUA-1b ngay khi POS gộp hợp đồng mới (chỉ thêm vài dòng api.js + bật cờ). -->

## Mục tiêu
Khi POS gộp cửa đặt đơn, App KH chỉ cần nối dây là khách đặt được: giỏ hàng → chọn cách nhận → trả QR payOS hoặc ví + PIN → theo dõi đơn, đúng demo (màn `cart`, `checkout`, `tracking`, nút "Đặt lại" ở Lịch sử đơn).

## Nghiệm thu

### A. Giỏ hàng (màn demo `cart`, tab thứ 5 "Giỏ hàng" như demo)
- A1 Thanh tab đủ 5 mục như demo (Trang chủ · Menu · Giỏ hàng · Ưu đãi · Tài khoản), huy hiệu ngũ hành `nhA-kim` cho Giỏ hàng (đã có trong demo); số món trên tab khi giỏ có hàng (như demo). Đường dẫn `/giohang`.
- A2 Nút thêm vào giỏ ở Trang món và ô món theo demo; chọn số lượng, ghi chú ngắn cho món (≤ 100 ký tự). Topping / size / combo CHƯA làm (đến khi POS có cửa — TOPPING-1, COMBO-1a), không bịa ô.
- A3 `src/gio.js` (hàm thuần, kho tiêm vào như `tracNghiemLuu.js`): thêm / bớt / đổi số lượng / xoá / dọn; giỏ lưu trên máy khoá `kh_gio` (chỉ `ma`, `so_luong`, `ghi_chu`, không giá); khai báo `kh_gio` vào danh sách khoá dữ liệu khách ở `src/luuMay.js` (xoá khi đăng xuất / đổi khách). Món không còn trong menu / hết hàng (`con_hang === false`) → đánh dấu trong giỏ, không cho thanh toán món đó.
- A4 Khách CHƯA đăng nhập vẫn thêm được vào giỏ và xem giỏ; bấm "Tiếp tục" → đăng nhập rồi quay về đúng màn thanh toán (`/dangnhap?tiep=…`, như KH-LINK-1).
- A5 **App không tự tính tiền.** Trong giỏ: mỗi dòng hiện giá một ly tra bảng `gia_hang` (như Menu) × số lượng chỉ để khách hình dung; dòng "Tạm tính", giảm giá, phí giao, tổng CHỈ lấy từ trả lời `bao-gia` của POS. Chưa có báo giá (cổng chưa mở / lỗi) → không hiện tổng, hiện "Tổng tiền sẽ hiện khi quán xác nhận".

### B. Thanh toán (màn demo `checkout`)
- B1 Cách nhận: **Lấy tại quầy** (mặc định) · **Giao tận nơi** (chữ "Giao qua Ahamove", KHÔNG ghi GHN — demo ghi nhầm). Giao tận nơi hiện nhưng TẮT với dòng "Sắp có" cho tới KH-MUA-2. Lấy tại quầy: dòng "Khi tới quầy, bạn đọc số đơn hiện trong app cho nhân viên" như demo.
- B2 Địa chỉ (khi giao): một địa chỉ `dia_chi` của hồ sơ (v3); chưa có → ô nhập, lưu bằng `PUT /toi` khi v3 có (đúng quyết định 29.10). Nhiều địa chỉ: sau khai trương (KH-HOSO-1) — không làm ở đây.
- B3 Cách trả: **QR payOS** · **Ví nội bộ** (hiện số dư `so_du_vi` từ `/toi`; ví không đủ → không chọn được, nói rõ còn thiếu bao nhiêu theo số POS trả). Trả ví → bảng PIN có sẵn (`PinSheet.jsx`), gửi `pin` trong thân; PIN không lưu ở đâu cả, không vào log. Trả một phần ví + phần còn lại QR: CHƯA làm (POS chưa nói hỗ trợ) — ghi `## Câu hỏi`.
- B4 Mã giảm giá: ô nhập mã (`ma_giam`), kết quả lấy từ `bao-gia`.
- B5 Bảng tiền theo demo (Tiền hàng · Giảm · Phí giao · Tổng) — mọi số từ `bao-gia` (`tam_tinh`, `giam[]`, `phi_giao`, `tong`). Đổi giỏ / cách nhận / mã → hỏi báo giá lại (gộp, không gọi dồn dập: ≤ 1 lần / 600 ms).
- B6 Không đặt được: POS trả `code` (`NGOAI_GIO`, `HET_HANG`, `QUA_GIO_NHAN_DON`, `PIN_SAI`, `VI_KHONG_DU`, …) → hiện nguyên câu `error` POS gửi (CLAUDE.md, hợp đồng). Ngoài giờ biết trước từ `/gio-hoat-dong` (`nhan_don === false` / `dang_mo === false`) → nút Xác nhận khoá sẵn + câu `thong_bao`; POS vẫn là bên chặn.
- B7 Xác nhận → tạo đơn. QR: màn hiện mã QR từ `qr.chuoi` (vẽ bằng `qrcode-generator` đã có, dùng lại cách vẽ của `src/pages/ManQR.jsx`), đếm ngược tới `qr.het_han` (giờ VN, theo `bay_gio` — CLAUDE.md §6), hỏi trạng thái đơn mỗi 3 giây khi màn đang mở, `da_tra` → sang Theo dõi đơn. Hết hạn QR chưa trả → nút "Tạo mã mới" (đặt lại) hoặc "Huỷ đơn".
- B8 Một lần bấm = một đơn: chặn bấm hai lần (khoá nút khi đang gửi); mất mạng giữa chừng → không tự gửi lại `POST /don`; xem lại trạng thái bằng mã đơn đã nhận.

### C. Theo dõi đơn (màn demo `tracking`)
- C1 `/don/<ma>` (đường dẫn thật): số đơn to (đọc cho nhân viên), giờ đặt, các bước `tien_trinh` (`cho_tra` · `da_tra` · `dang_lam` · `xong` · `dang_giao` · `da_giao` · `da_huy`) theo dạng demo; hỏi lại mỗi 10 giây khi màn đang mở và đơn chưa xong; bản đồ / tài xế: chưa làm (KH-MUA-2).
- C2 Huỷ: chỉ đơn `cho_tra` (`POST /don/:ma/huy`); đơn đã trả → "Gọi quán để huỷ" (số hỗ trợ ở `src/noiDung/lienHe.js`; chưa có số → ẩn nút gọi).
- C3 Lịch sử đơn: nút "Đặt lại" bỏ các món của đơn cũ vào giỏ (theo `ma`; món không còn → báo, bỏ qua).

### D. Cổng đặt đơn (vì hợp đồng chưa có cửa)
- D1 `src/datDon.js`: hàm thuần dựng thân yêu cầu / đọc trả lời đúng tên trường dự kiến (mục 3 TRA_LOI_POS_31102026.md) + MỘT chỗ gọi mạng được tiêm vào (`datCongDatDon(fn)`). KHÔNG thêm lời gọi mạng ngoài `src/api.js`; KHÔNG thêm cửa vào `src/api.js` ở việc này (K8 sẽ đỏ — đúng ý).
- D2 Cờ `DAT_ONLINE` ở MỘT chỗ (`src/noiDung/caiDat.js`, mặc định `false`): tắt → giỏ, xem giá vẫn dùng được; nút "Tiếp tục / Xác nhận" hiện "Đặt online sắp mở — mời bạn đặt tại quầy" và không gọi gì. KH-MUA-1b chỉ: thêm 5 hàm vào `api.js` theo hợp đồng mới, tiêm vào cổng, bật cờ.
- D3 Mọi tên trường đọc ở MỘT chỗ (`datDon.js`) để POS đổi tên thì sửa một nơi.

### E. Kiểm
- E1 `cong_cu/thu_KHMUA1.js`: phần 1 hàm thuần (`gio.js`, `datDon.js`: thêm/bớt, lưu/đọc, khoá xoá khi đăng xuất, dựng thân, đọc trả lời, map lỗi, chặn bấm đôi); phần 2 Chromium + POS giả (`page.route`) đúng tên trường dự kiến: thêm món → giỏ → đăng nhập → thanh toán tại quầy QR → `da_tra` → theo dõi; trả ví + PIN sai / đúng; ví không đủ; ngoài giờ; hết hàng; QR hết hạn; huỷ đơn chờ trả; đặt lại; cờ tắt → không gọi mạng; 360 / 390 / 430 + chữ 130% không tràn. Không có Playwright hoặc `KHONG_TRINH_DUYET=1` → BỎ QUA phần 2, không tính hỏng; `SỐ CA` ghi theo `KHONG_TRINH_DUYET=1` (CLAUDE.md §9).
- E2 Kiểm "không tự tính tiền": bài thử chứng minh tổng / giảm / phí hiện trên màn đúng bằng số POS giả trả (đổi số POS giả → màn đổi theo), kể cả khi số POS khác phép nhân giá × số lượng.
- E3 Bài cũ phải sửa vì đổi có chủ ý (thanh tab 5 mục, nút thêm giỏ ở Trang món / ô món): chỉ sửa đúng ca đó, không bớt ca khác.
- E4 `npm test`, `--day-du` (K8 không đổi vì không thêm cửa, K9), `node tu_chay/cong.js chay` ĐẠT. Đột biến VS-: ≥ 5 (tự cộng tổng; bỏ khoá bấm đôi; lưu giá vào giỏ; gọi mạng khi cờ tắt; cho trả ví khi thiếu tiền).
- E5 So ảnh với demo `cart`, `checkout`, `tracking` ở 390 (+ ảnh app 360 / 430) → `viec/KH-MUA-1/so_anh/` + `doi_chieu_demo.md` (khác demo vì: Ahamove thay GHN, giao "Sắp có", chưa topping, chưa bản đồ).
- E6 Chủ quán thử tay (≤ 3 bước, cờ tắt): (1) thêm 2 món vào giỏ khi chưa đăng nhập, tab Giỏ hàng hiện số 2; (2) bấm Tiếp tục → đăng nhập → về đúng màn Thanh toán; (3) thấy "Đặt online sắp mở", không có tổng tiền bịa.

## Phạm vi
- viec/KH-MUA-1/**
- src/**
- cong_cu/thu_KHMUA1.js
- cong_cu/thu_KHUI2.js
- cong_cu/thu_KHLINK1.js
- cong_cu/thu_KHXEM1.js
- cong_cu/thu_KHUI3a.js
- cong_cu/thu_KHLUU1.js

## Bài thử đỏ
Có — `cong_cu/thu_KHMUA1.js` ĐỎ trên code gốc (chưa có `gio.js`, `datDon.js`, tab Giỏ hàng, màn thanh toán / theo dõi).

## Ngân sách
~500 dòng app + ~450 dòng thử. **Phương án đơn giản nhất đã xét:** một mô-đun giỏ + một mô-đun đặt đơn với cổng tiêm vào và một cờ; dùng lại `PinSheet`, `KhoaTienIch` đường dẫn tiep, thành phần demo sẵn có; không thư viện mới.

## Đổi cấu trúc DB
không

## Thư viện mới
không (QR dùng `qrcode-generator` đã có)

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/`, `index.html`.
- KHÔNG tự tính tổng / giảm / phí; KHÔNG lưu giá vào giỏ; KHÔNG lưu PIN; KHÔNG gọi cửa ngoài hợp đồng (không thêm vào `api.js`); KHÔNG chữ "GHN"; KHÔNG chữ về "suất".
- KHÔNG thêm màu / phông ngoài demo. Chỉ push `git push -u origin viec/KH-MUA-1`. Không đụng `main`, không merge, không tạo PR.
