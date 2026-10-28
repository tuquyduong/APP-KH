# GỬI CHAT POS — Khớp hai chat 100% · Hợp đồng `/api/kh` v1 · Sổ quyết định chung · Đánh giá Google chuyển hẳn sang POS

<!-- Chat App KH soạn 28.10.2026, đọc code POS main b1f8299 (sổ v42; cổng /api/kh không đổi từ 40e07ce). Chủ quán đã đồng ý cả 3 điều 28.10:
     (a) đánh giá Google để hết ở POS, (b) cách khớp hai chat dưới đây, (c) mời mọi khách như nhau (bỏ điều kiện "khiếu nại").
     File này THAY file YEU_CAU_POS_BO_SUNG_DANH_GIA_28102026.md gửi trước — bỏ bản đó.
     Hai phụ lục A, B là NGUYÊN VĂN hai file chat POS đặt vào gốc kho POS (giữa hai dòng đánh dấu BẮT ĐẦU / HẾT). -->

## 0. Chat POS cần làm gì (tóm tắt)
1. Đặt 2 file vào gốc kho POS: `HOP_DONG_API_KH.md` (phụ lục A) và `QUYET_DINH_CHU_QUAN.md` (phụ lục B — bổ sung quyết định phía POS).
2. Thêm luật + bài thử để hợp đồng không bao giờ lệch code (mục 1).
   Sửa `LUAT_XAY_APP.md` bản POS cho khớp quyết định mới: §2 (đánh giá Google, trắc nghiệm ở POS; kho nhỏ App KH chỉ nội dung trang trí, phiên
   đăng nhập, thông báo, nhắc việc), §3 (App KH nay ở kho riêng `tuquyduong/APP-KH`, không còn `app_kh/` trong kho POS). Bản POS là bản gốc,
   kho App KH chép theo.
3. Nhận phần **đánh giá Google** vào sổ POS (mục 2) — làm sau khai trương.
4. Trả lời mục 3.

## 1. Cách khớp hai chat (chủ quán chốt 28.10)

**L1 — Một hợp đồng, một chỗ, có số.** `HOP_DONG_API_KH.md` ở kho POS là nguồn duy nhất về cổng `/api/kh`: cửa nào, gửi gì, trả trường gì,
mã lỗi nào. Có `PHIEN_BAN` (số nguyên). Kho App KH chỉ giữ BẢN CHÉP (ghi rõ chép từ phiên bản nào), không tự sửa.

**L2 — Đổi cổng là đổi hợp đồng, cùng một PR.** PR nào đổi cửa dưới `/api/kh` (`server/routes/kh/index.js`, `loi.js`), `server/middleware/khachAuth.js`
hoặc hàm tạo dữ liệu trả cho App KH → cùng PR phải sửa `HOP_DONG_API_KH.md` + tăng `PHIEN_BAN` + ghi dòng nhật ký cuối file. Không xoá / đổi tên trường đang dùng; buộc phải thì
giữ trường cũ song song ít nhất một đợt và báo App KH bằng file.

**L3 — Máy kiểm, không tin trí nhớ.**
- POS: bài thử `cong_cu/thu_HOPDONG_KH.js` đọc khối JSON trong hợp đồng (khối `HOP_DONG_MAY_DOC`), gọi từng cửa trên kho thử, kiểm: đủ cửa, đủ
  trường trong `tra`, mã lỗi trả về nằm trong `ma_loi`; và chiều ngược lại: route nào gắn dưới `/api/kh` mà hợp đồng không ghi → ĐỎ (không tính `routes/kh/quay.js` — cửa NHÂN VIÊN, gắn ở `/api/pos/kh`).
  Ghép vào `npm test` / `--day-du` theo cách POS đang làm.
- App KH: bộ kiểm đọc CÙNG khối JSON (bản chép): mọi đường `src/api.js` gọi phải có trong hợp đồng → không thì ĐỎ (chat App KH thêm phép kiểm
  này ở script kế tiếp của kho App KH).
- Trước khai trương chat App KH chạy thử app thật với POS thật (đăng nhập, menu, điểm, nhận điểm).

**L4 — Một sổ quyết định chung + một luật chung.** `LUAT_XAY_APP.md` bản gốc ở kho POS, kho App KH chép theo. `QUYET_DINH_CHU_QUAN.md` ở kho POS: mỗi dòng một quyết định của chủ quán, có ngày. Cả hai chat ĐỌC trước khi soạn
phiếu. Đổi quyết định → sửa đúng dòng đó, ghi "(đổi dd.mm, trước: …)" — không xoá lịch sử. Máy không sửa file này; chat soạn, chủ quán chạy.

**L5 — Trao đổi chỉ bằng file, qua chủ quán.** Chat App KH gửi `YEU_CAU_APPKH_*.md`; chat POS đáp `TRA_LOI_POS_*.md`, ghi rõ hợp đồng phiên bản
mấy. Không truyền miệng, không chép tay từng câu.

## 2. Đánh giá Google — TOÀN BỘ ở POS (thay mục chia việc của đặc tả gốc)

Đặc tả gốc của chủ quán: `thiet_ke/DANH_GIA_GOOGLE.md` + `thiet_ke/hinh_danh_gia_google.html` trong kho App KH (đọc được công khai trên GitHub
`tuquyduong/APP-KH`). Giữ nguyên nội dung đặc tả, CHỈ đổi chỗ làm và vài điểm sau:

| Phần | Bên làm |
|---|---|
| Lưu cài đặt, lời mời, đánh giá Google (bảng ở mục 3 đặc tả — đổi tên theo quy ước POS nếu muốn) | **POS** (có sao lưu của POS) |
| Lên lịch mời từ đơn hoàn thành của chính POS (không cần sự kiện gửi sang máy khác) | **POS** |
| Đọc / trả lời đánh giá qua Google Business Profile API, ghép khách, báo đánh giá ≤ N sao | **POS** (việc chạy nền trong máy chủ POS; khoá Google ở biến môi trường) |
| Màn quản lý: Đánh giá · Báo cáo · Cài đặt lời mời; dòng hồ sơ khách; ô Báo cáo chung; 3 quyền | **POS** (đúng mục 5 đặc tả) |
| Kiểu đơn bắt buộc ở quầy: Uống tại quán / Mang đi (đơn giao = **Ahamove**, đặc tả ghi GHN là nhầm) | **POS** |
| Đường chuyển hướng đếm lượt quét QR theo nguồn (`/r/qr_ban`, `qr_ly`, `qr_hd`) | **POS** (ghi lượt rồi chuyển sang link Google) |
| Thẻ mời ở Trang chủ, Lịch sử đơn, bảng gợi nhớ, Mở Google, hỏi lại khi quay về app | **App KH** (giao diện) |
| Gửi THÔNG BÁO lên điện thoại khách | **App KH** gửi khi POS nhờ (danh sách máy bật thông báo nằm ở App KH) — có sau KH-TB-1 |

Điểm sửa so với đặc tả gốc:
- **Bỏ** điều kiện "bỏ qua đơn đang khiếu nại" (POS không có trạng thái này; Google cấm mời chọn lọc). Đơn huỷ / hoàn tiền: không mời, huỷ lời mời đã lên lịch.
- Trang "theo dõi đơn" chỉ có từ KH-MUA-1 → trước đó lời mời hiện ở Trang chủ + Lịch sử đơn + thông báo.
- Phần này **không phụ thuộc máy App KH riêng** (trừ thông báo đẩy): thẻ trong app chạy qua `/api/kh` như hiện nay → làm được ngay sau khai trương.

Cổng cho App KH (chat POS chốt tên cuối cùng, ghi vào hợp đồng v2 — dưới đây là ĐỀ XUẤT theo quy ước `/api/kh`):
- `GET /api/kh/loi-moi-danh-gia` → `{ loi_moi: { ma, ma_don, mon: [tên món], link } | null }` — lời mời đã tới giờ, chưa trả lời.
- `POST /api/kh/loi-moi-danh-gia/:ma/su-kien` `{ loai: 'mo' | 'xong' | 'luc_khac' }` — khách bấm Mở Google / Đã đánh giá xong / Lúc khác.
- `GET /api/kh/don`: mỗi đơn thêm `co_the_danh_gia`, `da_danh_gia`; trả thêm `link_danh_gia` (cho nút ở Lịch sử đơn — không tính vào số lời mời).
- (Sau KH-TB-1) POS → máy App KH: `POST /internal/thong-bao { ma_khach, loai: 'dg', tieu_de, noi_dung, mo }` bằng khoá dịch vụ; App KH gửi nếu
  khách bật loại "Mời đánh giá"; khách tắt thì thẻ trong app vẫn hiện.

Chủ quán cần làm sớm (chat App KH đã nhắc): xin quyền Google Business Profile API (duyệt vài ngày – vài tuần); lấy link đánh giá để in QR từ khai trương.

## 3. Chat POS trả lời giúp (file TRA_LOI_POS_*.md)
1. Đã đặt 2 file chưa, `HOP_DONG_API_KH.md` đang phiên bản mấy, bài thử hợp đồng ghép vào việc nào.
2. KH-API-2 (hạng, số dư ví, giá từng hạng, Giờ vàng) và TOPPING-1 xong thì ghi vào hợp đồng (v2, v3…) — báo số phiên bản + ngày.
3. Phần đánh giá Google xếp vào sổ POS mã gì, sau khai trương lúc nào; tên cổng cuối cùng cho App KH.
4. Quyết định nào phía POS đã thêm vào `QUYET_DINH_CHU_QUAN.md`.
5. Mã `{ma}` trên QR hoá đơn (HD-1): có đúng chỉ gồm chữ không dấu + số, dài tối đa 32 ký tự không? (App KH đọc mã theo quy ước này.)
6. Hợp đồng, sổ quyết định, luật: chat App KH đọc thẳng từ kho POS trên GitHub (kho công khai) — file trả lời KHÔNG cần chép lại nội dung, chỉ cần ghi
   đã gộp vào main ở commit nào.

---

## PHỤ LỤC A — nguyên văn file `HOP_DONG_API_KH.md`

<!-- BẮT ĐẦU FILE: HOP_DONG_API_KH.md -->
# Hợp đồng cổng `/api/kh` — POS ↔ App KH

PHIEN_BAN: 1
NGAY: 2026-10-28
DOC_TU_CODE: POS main b1f8299 (server/routes/kh/index.js, loi.js, middleware/khachAuth.js, utils/pinKhach.js, utils/maKhach.js, routes/wallets.js loiGhi)

<!-- Nguồn DUY NHẤT về cổng /api/kh. Chủ: POS. Đổi cổng → đổi file này cùng PR, tăng PHIEN_BAN, ghi nhật ký (luật L2).
     Khối HOP_DONG_MAY_DOC là phần máy đọc: bài thử hợp đồng của POS và bộ kiểm của App KH cùng dựa vào nó. -->

## Chung
- Địa chỉ: `https://pos-tuquyduong.io.vn/api/kh`. Mọi câu trả lời thành công có `success: true`.
- Đăng nhập xong nhận `token`; các cửa "token: có" gửi `Authorization: Bearer <token>`. Thiếu / sai / hết hạn → 401 `KH_TOKEN_SAI`.
- Lỗi luôn `{ error: '<lời tiếng Việt>', code: 'MA_IN_HOA' }` — App hiện nguyên `error`.
- SĐT khách luôn lấy từ token, không bao giờ từ thân yêu cầu. Đơn / dữ liệu của khách khác → 404 như không có.

## Các cửa (phiên bản 1)
| Cửa | Token | Gửi | Trả (ngoài `success`) |
|---|---|---|---|
| `POST /dang-nhap/xin-ma` | không | `{ sdt }` | `lay_ma_tai_quay` (true = khách hỏi mã ở quầy) |
| `POST /dang-nhap/xac-minh` | không | `{ sdt, ma, ten? }` (mã 6 số; khách mới thiếu tên → `CAN_TEN`) | `token`, `khach { sdt, ten, ngay_tao }` |
| `GET /toi` | có | — | `khach { sdt, ten, ngay_tao, qr }` |
| `PUT /toi` | có | `{ ten }` | `khach { sdt, ten, ngay_tao }` |
| `GET /menu` | có | — | `data[] { ma, ten, nhom, gia, con_hang, ton_cu, ton_luc }` — `con_hang` có thể `null` |
| `GET /diem` | có | — | `points`, `history` |
| `GET /voucher` | có | `?all=1` lấy cả mã đã dùng / hết hạn | `data[]`, `ma_khach_moi` |
| `GET /don` | có | `?trang=N` (20 đơn / trang) | `trang`, `con_nua`, `data[] { ma, ngay, tong, da_tra, trang_thai, thanh_toan }` |
| `GET /don/:ma` | có | — | `don { ma, ngay, tong, da_tra, trang_thai, thanh_toan, mon[] { ten, so_luong, don_gia, thanh_tien, ghi_chu } }` |
| `POST /nhan-ma-bill` | có | `{ ma }` | kết quả nhận ưu đãi khách mới |
| `POST /nhan-diem` | có | `{ ma }` | kết quả nhân điểm theo mã trên bill |
| `PUT /pin` | có | `{ pin, pin_lai }` (4 số) | — |

## Mã lỗi
`KH_CHUA_CAU_HINH` 503 · `KH_TOKEN_SAI` 401 · `SDT_KHONG_HOP_LE` 400 · `QUA_NHIEU_LAN` 429 · `MA_SAI` 400 · `MA_HET_HAN` 400 · `CAN_TEN` 400 ·
`TEN_KHONG_HOP_LE` 400 · `KHONG_THAY_DON` 404 · `KHONG_TIM_THAY` 404 · `YEU_CAU_KHONG_HOP_LE` 400 · `LOI_MAY_CHU` 500 · `KHO_BAN` 409 ·
`PUT /pin`: `PIN_KHONG_HOP_LE` 400 · `PIN_KHONG_KHOP` 400 · `PIN_DA_CO` 409 · `KHACH_KHONG_TON_TAI` 404.
`nhan-ma-bill` / `nhan-diem` dùng mã lỗi của hàm quầy — App hiện nguyên `error`.

## Đã hẹn (chưa có — ghi vào khi xong, tăng PHIEN_BAN)
- KH-API-2: `/toi` thêm hạng + số dư ví; cửa danh sách hạng; cửa Giờ vàng hôm nay; `/menu` thêm giá từng hạng.
- TOPPING-1: `/menu` thêm topping theo món + giá.
- Đánh giá Google: `loi-moi-danh-gia`, `su-kien`, cờ trên `/don` (tên cuối do POS chốt).

## Phần máy đọc
<!-- HOP_DONG_MAY_DOC -->
```json
{
  "phien_ban": 1,
  "goc": "/api/kh",
  "cua": [
    { "pt": "POST", "duong": "/dang-nhap/xin-ma", "token": false, "tra": ["lay_ma_tai_quay"] },
    { "pt": "POST", "duong": "/dang-nhap/xac-minh", "token": false, "tra": ["token", "khach.sdt", "khach.ten", "khach.ngay_tao"] },
    { "pt": "GET", "duong": "/toi", "token": true, "tra": ["khach.sdt", "khach.ten", "khach.ngay_tao", "khach.qr"] },
    { "pt": "PUT", "duong": "/toi", "token": true, "tra": ["khach.sdt", "khach.ten", "khach.ngay_tao"] },
    { "pt": "GET", "duong": "/menu", "token": true, "tra": ["data[].ma", "data[].ten", "data[].nhom", "data[].gia", "data[].con_hang", "data[].ton_cu", "data[].ton_luc"] },
    { "pt": "GET", "duong": "/diem", "token": true, "tra": ["points", "history"] },
    { "pt": "GET", "duong": "/voucher", "token": true, "tra": ["data", "ma_khach_moi"] },
    { "pt": "GET", "duong": "/don", "token": true, "tra": ["trang", "con_nua", "data[].ma", "data[].ngay", "data[].tong", "data[].da_tra", "data[].trang_thai", "data[].thanh_toan"] },
    { "pt": "GET", "duong": "/don/:ma", "token": true, "tra": ["don.ma", "don.ngay", "don.tong", "don.da_tra", "don.trang_thai", "don.thanh_toan", "don.mon[].ten", "don.mon[].so_luong", "don.mon[].don_gia", "don.mon[].thanh_tien", "don.mon[].ghi_chu"] },
    { "pt": "POST", "duong": "/nhan-ma-bill", "token": true, "tra": [] },
    { "pt": "POST", "duong": "/nhan-diem", "token": true, "tra": [] },
    { "pt": "PUT", "duong": "/pin", "token": true, "tra": [] }
  ],
  "ma_loi": ["KH_CHUA_CAU_HINH", "KH_TOKEN_SAI", "SDT_KHONG_HOP_LE", "QUA_NHIEU_LAN", "MA_SAI", "MA_HET_HAN", "CAN_TEN", "TEN_KHONG_HOP_LE",
    "KHONG_THAY_DON", "KHONG_TIM_THAY", "YEU_CAU_KHONG_HOP_LE", "LOI_MAY_CHU", "KHO_BAN",
    "PIN_KHONG_HOP_LE", "PIN_KHONG_KHOP", "PIN_DA_CO", "KHACH_KHONG_TON_TAI"]
}
```
<!-- HET HOP_DONG_MAY_DOC -->

## Nhật ký
- v1 · 28.10.2026 · Bản đầu, ghi đúng code POS b1f8299 (chat App KH soạn, chat POS đặt vào kho).
<!-- HẾT FILE: HOP_DONG_API_KH.md -->

---

## PHỤ LỤC B — nguyên văn file `QUYET_DINH_CHU_QUAN.md` (bản đầu — chat POS THÊM các quyết định phía POS vào mục cuối)

<!-- BẮT ĐẦU FILE: QUYET_DINH_CHU_QUAN.md -->
# Sổ quyết định của chủ quán — POS · SX · App KH

<!-- Một dòng một quyết định, có ngày. Cả hai chat đọc TRƯỚC khi soạn phiếu. Đổi → sửa đúng dòng, ghi "(đổi dd.mm, trước: …)", không xoá.
     Máy không sửa; chat soạn, chủ quán chạy script. Khi lệch với file khác: file này thắng, rồi sửa file kia. -->

## Chung — dữ liệu và hệ thống
- 27.10 · POS là nơi DUY NHẤT giữ tiền, ví, điểm, hạng, voucher, giá, món, khách, đơn — và cả kết quả trắc nghiệm (27.10), ghi chép đánh giá Google (28.10).
- 27.10 · App KH tách kho GitHub riêng (`tuquyduong/APP-KH`); tách máy chủ App KH (Render) SAU khai trương (KH-TACH-1); trước đó trang tĩnh gọi thẳng POS.
- 27.10 · Kho dữ liệu nhỏ của App KH chỉ giữ: ảnh / chữ trang trí, phiên đăng nhập, đăng ký nhận thông báo, nhắc việc. Không tiền, không dữ liệu khách.
- 28.10 · Mọi thay đổi trong kho POS (kể cả cổng `/api/kh`) do chat POS làm; chat App KH chỉ sửa kho `APP-KH`, cần gì ở POS thì gửi file yêu cầu.
- 28.10 · Khớp hai chat: hợp đồng `/api/kh` một chỗ có số phiên bản; đổi cổng là đổi hợp đồng cùng PR; bài thử hợp đồng hai phía; sổ quyết định này;
  trao đổi bằng file qua chủ quán.

## Khai trương
- 27.10 · Khai trương T7 07.11.2026; chỉ khai trương khi mọi việc trong lịch đã xong, không dùng phương án dự phòng, trễ thì lùi ngày.
- 27–28.10 · QR hoá đơn dẫn tới App KH mới: `https://tuquyduong.com/?ma={ma}` (khách quen bỏ phần `?ma=`); địa chỉ đặt trong Cài đặt POS, dán ngày 06.11.

## App KH
- 27–28.10 · App KH là PWA ở `tuquyduong.com` (không tiền tố). Điện thoại trước; máy tính bảng, máy tính, trình duyệt Zalo không vỡ, không méo.
- 27.10 · Giao diện theo demo `app_kh_demo.html` (patch39); số liệu trong demo chỉ minh hoạ — số thật theo POS.
- 28.10 · Giao diện App KH đặt trên Cloudflare (miễn phí, không tính dung lượng); máy App KH sau khai trương đặt trên Render.
- 28.10 · App KH cũ trên Replit (`tuquyduong/TuQuyDuong`) bỏ, dựng mới hoàn toàn.

## Giao hàng
- 27.10 · Giao hàng dùng Ahamove (không GHN).

## Đánh giá Google
- 28.10 · Chỉ đánh giá trên Google Maps; không quà / voucher đổi đánh giá; không viết sẵn câu; mời mọi khách như nhau (KHÔNG có điều kiện
  "khiếu nại"); đơn huỷ / hoàn tiền không mời; không chỉ tiêu theo nhân viên.
- 28.10 · Toàn bộ dữ liệu, lịch mời, đọc / trả lời Google, màn quản lý ở POS; App KH chỉ làm giao diện khách + gửi thông báo khi POS nhờ.

## Trắc nghiệm thể trạng
- 27.10 · Lưu bản rút gọn (nhóm thể trạng, ngày) khi khách đồng ý; quán quản lý, theo dõi được (trong POS, theo quyền); khách xoá được.

## Tiền, điểm, quầy (chat POS bổ sung đủ từ CLAUDE.md / sổ POS)
- (đã chốt trước) Không công nợ. Mọi chuyển khoản qua QR payOS, máy chủ tự xác nhận.
- (đã chốt trước) Điểm chỉ tính trên tiền khách trả thật (DIEM-THAT-1). Giá hạng: giá gốc gạch ngang + giá hạng. Combo cố định.
<!-- HẾT FILE: QUYET_DINH_CHU_QUAN.md -->
