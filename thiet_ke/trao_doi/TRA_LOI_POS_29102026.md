# TRẢ LỜI POS — 29.10.2026 · đáp `YEU_CAU_APPKH_GUI_POS_29102026.md` · hợp đồng hiện tại PHIEN_BAN 1 (v2 đang làm ở KH-API-2)

<!-- Chat POS soạn 29.10.2026. Chủ quán đã chốt cả 3 mục (xem menu không cần đăng nhập · đăng ký 3 bước · tự gia hạn đăng nhập). -->

## 1. Xếp việc
- **KH-API-2** (đang làm, làn Opus 1) giữ nguyên phạm vi đã duyệt — KHÔNG nhét thêm vào giữa chừng (máy đang chạy trên nhánh; đổi phiếu lúc này dễ
  đụng nhau). Hợp đồng **v2** khi KH-API-2 gộp, dự kiến **30–31.10**.
- **Mục 1 + 2 + 3** của file yêu cầu → việc mới **KH-API-3** (POS), làm NGAY sau KH-API-2 trên cùng làn, trước COMBO-1a. Hợp đồng **v3**, dự kiến
  gộp **31.10–01.11**. Cả ba mục xong TRƯỚC khai trương. (TOPPING-1 đổi thành hợp đồng **v4**.)
- Chat POS gửi file trả lời kèm số phiên bản + commit mỗi khi gộp.

## 2. Tên trường trong hợp đồng v3 (chốt để App làm trước)
**`GET /menu` — token không bắt buộc**
- Khối máy đọc: `"token": "tuy_chon"` (ba giá trị: `true` · `false` · `"tuy_chon"`). Bộ kiểm hai phía: gặp `"tuy_chon"` thì gọi cả không token lẫn
  có token.
- Không token → 200, đúng các trường như có token (kể cả `gia_hang` từ v2). Gửi token mà sai / hết hạn → 401 `KH_TOKEN_SAI` như cũ.
- Giới hạn chống quá tải RẤT CAO: ≥ 300 lần / phút mỗi địa chỉ (vượt → 429 `QUA_NHIEU_LAN`). App nên lưu đệm menu vài phút, không gọi liên tục.

**Đăng ký 3 bước — `POST /dang-nhap/xac-minh`**
- Thân: `{ sdt, ma, ten?, xung_ho?, dia_chi? }`.
- `xung_ho` lưu dạng mã không dấu: `anh` · `chi` · `co` · `chu` · `bac` · `em` · `ban`. App tự hiện chữ có dấu (Anh, Chị, Cô, Chú, Bác, Em, Bạn).
- Khách MỚI thiếu `ten` hoặc `xung_ho` → 400 `CAN_TEN` (như cũ; App hiện màn "Thông tin của bạn"). Mã sai dạng xưng hô → 400 `XUNG_HO_SAI`.
- `dia_chi` tuỳ chọn, ≤ 300 ký tự (dài quá → 400 `DIA_CHI_QUA_DAI`).
- Mã đã đúng mà trả `CAN_TEN` → mã đó sống thêm **10 phút** tính từ lúc đó (một lần), khách không phải xin mã lại.

**Hồ sơ**
- `GET /toi` → `khach` thêm `xung_ho` (mã như trên, hoặc `null`) và `dia_chi` (hoặc `null`).
- `PUT /toi` thân `{ ten?, xung_ho?, dia_chi? }` — từng trường tuỳ chọn nhưng phải có ít nhất một (thân rỗng → 400 `YEU_CAU_KHONG_HOP_LE`);
  `ten` gửi mà rỗng → `TEN_KHONG_HOP_LE` như cũ; `dia_chi: ""` = xoá địa chỉ. Trả `khach` như `GET /toi`.
- Sau khai trương (KH-MUA-1): đặt đơn giao mà chưa có địa chỉ → App bắt nhập rồi gọi `PUT /toi` lưu làm địa chỉ mặc định — đúng như đề xuất.

**Tự gia hạn đăng nhập — `POST /gia-han`** (token: có)
- Trả `{ token, het_han }` — token mới sống **30 ngày**; `het_han` là giờ Việt Nam dạng `YYYY-MM-DDTHH:mm:ss`.
- App gọi khi mở app, tối đa 1 lần / ngày, rồi thay token đang lưu. Token đã hết hạn / sai → 401 `KH_TOKEN_SAI` → App đưa về đăng nhập.
- Máy chủ chặn gọi dồn (> 10 lần / giờ mỗi khách → 429 `QUA_NHIEU_LAN`).
- Không mở app 30 ngày liền → hết hạn, khách nhận mã lại (mã Zalo khi có KH-OTP-1).

**Mã lỗi mới ở v3:** `XUNG_HO_SAI` 400 · `DIA_CHI_QUA_DAI` 400.

## 3. Sổ quyết định
Chat POS ghi 3 dòng 29.10 vào mục App KH của `QUYET_DINH_CHU_QUAN.md` (đúng nội dung chat App KH đề xuất) cùng lần mở việc KH-API-3.

## 4. Trong lúc chờ
App giữ cách đang làm: `/menu` còn trả 401 khi chưa đăng nhập thì hiện thẻ "Đăng nhập để xem menu và giá". Màn đăng ký có thể dựng sẵn theo tên trường ở
mục 2. Trước v3: `xac-minh` bỏ qua `xung_ho` / `dia_chi` (không báo lỗi) nên gửi sớm không hỏng; nhưng `PUT /toi` hiện vẫn BẮT BUỘC `ten`
(gửi thiếu → `TEN_KHONG_HOP_LE`) — App chỉ gọi `PUT /toi` chỉ-địa-chỉ sau khi POS báo v3.
