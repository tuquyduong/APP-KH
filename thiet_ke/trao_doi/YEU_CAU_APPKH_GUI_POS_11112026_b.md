# YÊU CẦU App KH → chat POS — 11.11.2026 (b) · Đăng nhập bằng MẬT KHẨU + duy trì đăng nhập · ĐỔI ĐIỂM lấy quà / voucher

## 1. Đăng nhập bằng mật khẩu (chủ quán 11.11)
**Chủ quán:** "sau khi đăng ký tài khoản thành công thì khách nên tạo mật khẩu để đăng nhập, và duy trì đăng nhập cho khách — bây giờ mỗi lần cần thử là phải lấy mã từ POS".

**Luồng App sẽ làm (một quy tắc, đơn giản):**
- **Đăng ký** như hiện nay (SĐT → mã → thông tin) + **bước cuối "Tạo mật khẩu"** (≥ 6 ký tự, gõ 2 lần; có "Để sau"). Hồ sơ › Bảo mật có "Mật khẩu đăng nhập" (tạo / đổi).
- **Đăng nhập:** ô SĐT → "Tiếp tục" → khách có mật khẩu: ô mật khẩu (+ "Quên mật khẩu? Đăng nhập bằng mã"); chưa có mật khẩu / khách mới: luồng mã như hiện nay.
- **Quên mật khẩu:** đăng nhập bằng mã (Zalo / quầy) → App mời đặt mật khẩu mới.
- **Mã PIN 4 số GIỮ NGUYÊN vai trò xác nhận trả bằng ví** — KHÁC mật khẩu (mật khẩu = vào tài khoản; PIN = xác nhận tiền).

**Xin POS (tên trường POS chốt):**
- `POST /dang-nhap/xin-ma` (đã có) trả thêm `co_mat_khau: true|false` — hoặc cửa mới `POST /dang-nhap/cach { sdt }` → `{ cach: 'mat_khau' | 'ma' }` (POS chọn cách ít lộ thông tin nhất).
- `POST /dang-nhap/mat-khau { sdt, mat_khau }` → `token`, `khach` (y như `xac-minh`). Sai → `MAT_KHAU_SAI` 400 (không nói SĐT có tồn tại hay không); sai 5 lần → khoá 15 phút `QUA_NHIEU_LAN` 429.
- `PUT /toi/mat-khau { mat_khau_moi, mat_khau_cu? }` (token): lần đầu không cần `mat_khau_cu`; đổi thì cần (hoặc vừa đăng nhập bằng mã trong 10 phút — để "quên mật khẩu").
  Đổi mật khẩu → mọi phiên CŨ của khách trên máy khác hết hạn. `MAT_KHAU_YEU` 400 (< 6 ký tự / toàn số giống nhau / trùng SĐT).
- Lưu mật khẩu dạng BĂM (bcrypt / argon2), không bao giờ trả ra, nhân viên không xem được. Ở POS, màn khách có nút "Xoá mật khẩu App" (khách nhờ quầy) — không có "xem mật khẩu".

**Duy trì đăng nhập:** hiện token 30 ngày + App tự gia hạn mỗi ngày mở App → dùng thường xuyên là không phải đăng nhập lại. Đề nghị POS nâng **token 90 ngày** (gia hạn vẫn
mỗi ngày). Lưu ý cho chủ quán: trên iPhone, **Safari, App trên màn hình chính và trình duyệt Zalo là 3 chỗ lưu riêng** — mỗi chỗ đăng nhập một lần; có mật khẩu thì không cần lấy mã ở quầy.

## 2. Đổi điểm — KHO QUÀ Ở POS, hai hệ thống thông nhau (chủ quán 11.11)
**Chủ quán:** "đổi điểm cần có kho quà để đổi, kho quà lấy từ POS; khi đổi quà thì 2 hệ thống phải thông nhau để nhận ra quà và sử dụng".

**Nguyên tắc: MỘT kho quà, MỘT bản ghi quà đã đổi — đều ở POS.** App chỉ hiển thị và gửi yêu cầu; quầy và App cùng đọc / ghi đúng bản ghi đó, nên đổi ở đâu cũng
dùng được ở đâu, trạng thái luôn khớp.

**A. Kho quà (POS › Cài đặt › Kho quà đổi điểm)** — chủ quán cài, App đọc:
- Mỗi quà: tên · ảnh · **số điểm cần** · **loại**: (1) **Voucher** — chọn từ Mẫu voucher (VOUCHER-2: giảm tiền / %, món áp dụng, đơn tối thiểu, hạn dùng) hoặc
  (2) **Quà hiện vật nhận tại quầy** (bình, túi, ly…) — có **số lượng tồn** (nếu POS có kho KHO-1 thì nối mã hàng kho để tự trừ tồn khi trao) · hạn nhận (số ngày từ lúc đổi) ·
  giới hạn mỗi khách / tháng (tuỳ chọn) · thời gian bật · bật / tắt · thứ tự. Xem trước câu khách thấy; lưu báo rõ (CAIDAT-BAO-1).
- `GET /kho-qua` (không token — khách chưa đăng nhập cũng xem được để có động lực đăng ký) → `data[] { ma, ten, anh, diem, loai, mo_ta, con, gioi_han }` (`mo_ta` POS dựng sẵn, App hiện nguyên câu;
  `con` = còn quà hay hết).

**B. Đổi quà — sinh MỘT "phiếu quà" ở POS:**
- `POST /doi-diem { ma_qua, khoa_gui }` (token) → trừ điểm + tạo **phiếu quà** `{ ma_phieu, ma_qua, ten, loai, trang_thai: 'chua_dung', het_han, qr }` → trả phiếu + `diem_con`.
  Khoá gửi + luật 4xx / 5xx như `POST /don` (gửi lại không trừ điểm hai lần). Lỗi: `KHONG_DU_DIEM` · `HET_QUA` · `VUOT_GIOI_HAN` · `QUA_DANG_TAT`.
- `GET /qua-cua-toi` (token) → các phiếu quà của khách + trạng thái (`chua_dung` · `da_dung` · `het_han`) — App hiện ở Ưu đãi › "Quà của tôi" (voucher-quà cũng hiện trong Ví voucher).
- Lịch sử điểm (`GET /diem.history`) có dòng "Đổi <tên quà> · −300".

**C. Dùng quà — hai hệ thống nhận ra cùng một phiếu:**
- **Phiếu quà / mã voucher chỉ lưu MỘT nơi: trong tài khoản khách ở POS.** App KHÔNG giữ bản riêng — App đọc từ POS (`GET /voucher`, `GET /qua-cua-toi`) mỗi lần mở Ưu đãi / Thanh toán, nên quầy và App luôn thấy cùng một danh sách, cùng trạng thái. Phiếu quà **gắn với tài khoản** người đổi: chỉ dùng cho đơn của chính khách đó (App: đơn đăng nhập tài khoản đó; quầy: tra đúng SĐT / quét QR của khách) — đọc mã cho người khác cũng không dùng được.
- **Quà voucher:** phiếu quà CHÍNH LÀ một voucher trong hệ voucher POS → dùng được **khi đặt trên App** (ô mã giảm / chọn từ Ví voucher → báo giá POS tính) **và ở quầy**
  (nhân viên quét QR / tra SĐT → chọn voucher). Dùng ở đâu thì POS đánh `da_dung` → chỗ kia thấy ngay.
- **Quà hiện vật:** App hiện **mã QR của phiếu quà** + "Đưa mã này cho nhân viên"; quầy **quét QR** (hoặc tra SĐT → danh sách quà đang có) → bấm **"Đã trao"** → POS đánh `da_dung`
  (+ trừ tồn kho quà) → App đổi thành "Đã nhận" ở lần tải tới.
- Quầy cũng **đổi điểm cho khách bằng CÙNG hàm** `doi-diem` (khách đổi tại quầy thì phiếu quà cũng hiện trong App).
- **Hết hạn chưa dùng:** chủ quán chọn trong Cài đặt — "hoàn điểm" hoặc "không hoàn" (đề nghị mặc định: **hoàn điểm**, App nhắc trước 3 ngày).
- Xin POS cho biết **quầy hiện đổi điểm thế nào** (nếu đang có cách khác — vd trừ điểm thẳng vào hoá đơn) để gộp về MỘT cách này, không đẻ hai luật.

**App sẽ làm:** Ưu đãi › ô "Điểm" → màn "Đổi quà bằng điểm" (theo demo): điểm hiện có, kho quà từ POS (đủ điểm thì "Đổi", thiếu thì mờ "Cần thêm N điểm", hết quà thì "Đã hết");
hỏi lại một lần "Dùng 300 điểm đổi …?"; đổi xong → "Quà của tôi" (quà hiện vật có QR để đưa nhân viên; voucher dùng ngay khi đặt món); chưa đăng nhập → xem được kho quà, bấm Đổi thì mời đăng nhập.

## 3. Lịch
Mật khẩu: xin làm TRƯỚC khai trương (chủ quán đang thử App hằng ngày). Đổi điểm: POS báo — đề nghị cùng đợt VOUCHER-2 (dùng mẫu voucher). Xin mã việc + phiên bản hợp đồng.
