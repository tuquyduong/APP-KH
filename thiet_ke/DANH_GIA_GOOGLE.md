> **Ghi chú chat App KH 28.10.2026 — đọc trước khi làm (đặc tả gốc của chủ quán, giữ nguyên bên dưới):**
> 1. Mọi chỗ ghi **GHN** → **Ahamove** (quán dùng Ahamove).
> 2. **Chủ quán chốt 28.10 — TOÀN BỘ phần đánh giá ở POS** (việc POS DG-GOOGLE-1, sau khai trương): dữ liệu, lịch mời, đọc / trả lời Google,
>    ghép khách, báo đánh giá thấp, màn quản lý, kiểu đơn, đường `/r/<nguồn>`. App KH CHỈ làm giao diện khách (KH-GOOGLE-1) qua các cửa `/api/kh`
>    POS đã chốt tên (xem `HOP_DONG_API_KH.md` mục "Đã hẹn") + gửi thông báo khi POS nhờ (KH-TB-1). Mục 1, 3, 4, 5 dưới đây đọc với nghĩa đó:
>    chỗ nào ghi "API App KH", `tqd-app`, `/v1/*`, `/internal/*` (trừ `/internal/thong-bao`) → là POS.
> 3. Trang đơn (theo dõi đơn, mục 2 #2) chỉ có từ KH-MUA-1. Trước đó, đơn ở quầy: thẻ mời ở Trang chủ (#3) + Lịch sử đơn (#7) + thông báo (#1).
> 4. iPhone chỉ nhận thông báo đẩy khi khách đã "Thêm vào màn hình chính" (iOS 16.4+) — thẻ trong app và Lịch sử đơn là kênh chính, không phải phụ.
> 5. Khoá chữ chế độ sửa (`t:rv.*`, `cmsAudit`) làm khi có chế độ sửa (KH-SAU-1); trước đó chữ cố định trong code, đặt một chỗ.
> 6. "Chạm để sao chép tên món": trình duyệt Zalo có thể chặn sao chép → luôn có đường dự phòng (chọn chữ bằng tay).
> 7. **Chủ quán chốt 28.10:** mời mọi khách như nhau — BỎ điều kiện "đang khiếu nại" (POS không có trạng thái này; Google cấm mời chọn lọc);
>    đơn huỷ / hoàn tiền không mời.
> 8. Cần xin quyền Google Business Profile API sớm (duyệt vài ngày – vài tuần); review link dùng in QR tại quán được ngay từ khai trương, không cần code.

# Bàn giao: Mời khách đánh giá trên Google (28/10/2026)

Tài liệu này chỉ nói về phần MỚI: mời khách đánh giá trên Google. Mọi phần khác giữ như đã bàn giao trước. App KH và POS là hai mã nguồn riêng, nên phần việc được tách theo từng bên. Hình mẫu từng trang xem trong `TQD_hinh_danh_gia_google.html`.

## 0. Nguyên tắc (bắt buộc, theo luật Google)

- Chỉ có một kiểu đánh giá là trên Google Maps. Không có đánh giá trong app.
- Không tặng quà hay voucher để đổi lấy đánh giá.
- Không viết sẵn câu đánh giá cho khách.
- Mời mọi khách như nhau. Không lọc khách hài lòng trước khi mời.
- Không báo cáo hay đặt chỉ tiêu đánh giá theo tên nhân viên.
- Dữ liệu ghép khách (biết khách nào đã đánh giá) chỉ dùng để ngừng mời và để trả lời đánh giá. Không dùng để phát quà.

## 1. Chia việc giữa hai bên

| Phần | Bên làm | Ghi chú |
| --- | --- | --- |
| Lưu cài đặt, lịch mời, gửi lời mời, nhận sự kiện từ app | API App KH (CSDL `tqd-app`) | App biết khách đã bấm Mở Google hay chưa |
| Lấy đánh giá từ Google, ghép khách, gửi câu trả lời lên Google | API App KH | Dùng Google Business Profile API (mục 4) |
| Giao diện khách | PWA App KH | Mục 2 |
| Báo sự kiện "đơn hoàn thành" kèm kiểu đơn | POS | POS gọi `POST /hooks/pos/event` sang API App KH (đường này đã có) |
| Giao diện quản lý (Đánh giá, Báo cáo, Cài đặt lời mời, dòng trong hồ sơ khách) | POS | POS gọi API App KH bằng khoá dịch vụ (mục 5) |

## 2. App KH: vị trí và màn hình

| # | Vị trí | Nội dung | Điều kiện hiện |
| --- | --- | --- | --- |
| 1 | Thông báo đẩy, loại mới `dg` | "{Tên món đầu tiên} hôm nay thế nào ạ? Chạm để đánh giá quán trên Google 🌸". Chạm vào mở trang đơn ở trạng thái đang có thẻ mời | Đúng giờ `send_at`; khách bật thông báo và bật loại `dg` |
| 2 | Trang đơn (tracking), đầu trang, khi đơn đã giao / hoàn thành | Thẻ mời: dòng nhỏ "Trải nghiệm của chị"; tiêu đề "Chị thấy Tứ Quý Đường hôm nay thế nào?"; dòng phụ; nút **Đánh giá trên Google**; nút chữ **Để sau** | Chỉ sau `send_at`. Không hiện lúc vừa nhận hàng |
| 3 | Trang chủ, ngay dưới lời chào (cùng chỗ thẻ video hướng dẫn, nếu cả hai cùng có thì thẻ mời đứng trên) | Thẻ gọn 1 dòng: "Đơn {buổi} nay thế nào ạ? · Đánh giá ›". Chạm vào mở như #2 | Có lời mời đang chờ (đã tới `send_at`, chưa trả lời) |
| 4 | Bảng trượt khi bấm "Đánh giá trên Google" | Tên các món trong đơn (chạm để sao chép tên); 3 câu hỏi gợi ý để khách tự viết; dòng "Chỉ cần chọn sao cũng được"; lưu ý cần đăng nhập Gmail; nút **Mở Google** | — |
| 5 | Mở Google | Mở `review_link` (ưu tiên app Google Maps). App gửi sự kiện `opened` | — |
| 6 | Khi khách quay lại app (sự kiện `visibilitychange` sau khi đã `opened`) | Thẻ hỏi "Chị đã đánh giá xong chưa ạ?", hai nút: **Đã đánh giá xong** → màn cảm ơn, ẩn thẻ, gửi `done`; **Đánh giá lúc khác** → ẩn thẻ, gửi `later` | — |
| 7 | Tài khoản › Lịch sử đơn, mỗi đơn đã hoàn thành | Nút "★ Đánh giá trên Google". Đã đánh giá (`reviewed = true`) thì hiện "✓ Đã đánh giá Google". Đơn huỷ thì không có nút | Kênh bật `hist`. Không tính vào số lời mời |
| 8 | Tài khoản › Thông báo & âm thanh | Thêm loại tin thứ 7: "Mời đánh giá · Sau khi nhận món, tối đa {year} lần/năm", có công tắc | — |
| 9 | Chế độ sửa | Khoá chữ: `t:rv.k`, `t:rv.h`, `t:rv.s`, `t:rv.go`, `t:rv.later`, `t:rv.q1`, `t:rv.q2`, `t:rv.q3`, `t:rv.tip`, `t:rv.ask`, `t:rv.done`, `t:rv.lat`, `t:rv.thx`, `t:rv.push`, `t:rv.mini`. Ẩn/hiện khối: `sec:home.review`. Tên món và giờ là `data-lock` (pos / auto). Chạy `cmsAudit` cho các màn đã đổi phải ra `[]` | — |

Lưu ý cho app:
- Câu khách trả lời ở #6 chỉ quyết định ẩn hay hiện thẻ. Việc khách đã đánh giá thật hay chưa do máy chủ xác nhận (mục 4).
- Không cho chọn sao trong app. Khách chỉ chọn sao trên Google.

## 3. API App KH: dữ liệu và đường gọi

**Bảng mới trong CSDL `tqd-app`:**

```sql
CREATE TABLE review_settings (id INTEGER PRIMARY KEY CHECK (id = 1), json TEXT NOT NULL, updated_by TEXT, updated_at TEXT);
CREATE TABLE review_invites (
  id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, order_id INTEGER NOT NULL UNIQUE,
  kind TEXT NOT NULL,                 -- giao | mang | ngoi
  received_at TEXT NOT NULL, send_at TEXT NOT NULL, sent_at TEXT,
  channel TEXT,                       -- push | card | hist | qr
  opened_at TEXT, answer TEXT,        -- done | later | NULL
  round INTEGER DEFAULT 0,            -- 0 = lần đầu, 1.. = nhắc lại
  status TEXT DEFAULT 'scheduled');   -- scheduled | sent | answered | skipped | expired
CREATE INDEX ix_rinv_send ON review_invites(status, send_at);
CREATE INDEX ix_rinv_cust ON review_invites(customer_id, sent_at);
CREATE TABLE google_reviews (
  review_id TEXT PRIMARY KEY, display_name TEXT, stars INTEGER, comment TEXT, create_time TEXT,
  reply TEXT, reply_time TEXT, customer_id INTEGER, match TEXT,   -- hi | md | no | manual
  alerted INTEGER DEFAULT 0, source TEXT);                          -- app | qr_ban | qr_ly | qr_hd | unknown
CREATE INDEX ix_grev_cust ON google_reviews(customer_id);
```

**Nội dung `review_settings.json` (giá trị mặc định; POS sửa được, mỗi mục là số tự do, giao diện chỉ gợi ý mức):**

```json
{ "on": true, "delay_min": { "giao": 60, "mang": 60, "ngoi": 45 },
  "quiet": { "from": "21:00", "to": "09:00", "move_to": "10:00" },
  "start_from_order": 1, "max_per_day": 1, "remind_times": 1, "rest_days": 60, "max_per_year": 3,
  "alert_max_stars": 3, "channels": { "push": true, "card": true, "hist": true },
  "review_link": "https://g.page/r/<mã>/review" }
```

**Cách lên lịch lời mời** (khi nhận sự kiện POS `order.completed`):

1. Bỏ qua nếu thuộc một trong các trường hợp sau: `on = false`; đơn huỷ, hoàn tiền hoặc đang khiếu nại; khách đã có đánh giá ghép được (`match` là hi hoặc manual); khách đã hết số lời mời trong năm; khách đang trong thời gian nghỉ mời; số thứ tự đơn của khách nhỏ hơn `start_from_order`.
2. `send_at = received_at + delay_min[kind]`. Nếu giờ đó rơi vào khung `quiet` thì dời sang `move_to` gần nhất (hôm sau nếu đã qua nửa đêm khung).
3. Mỗi khách mỗi ngày tối đa `max_per_day` lời mời. Khách còn đơn khác chưa hoàn thành thì lùi tới khi đơn đó xong.
4. Tiến trình chạy mỗi phút (chung với nhắc việc): gửi push nếu kênh bật, đặt `sent_at`.
5. Khi app gửi `later`, nếu `round < remind_times` thì tạo lời mời mới ở đơn hoàn thành tiếp theo với `round + 1`. Hết số lần nhắc thì nghỉ mời `rest_days` ngày.

**Đường gọi cho app:**
- `GET /v1/bootstrap`: thêm trường `review_invite`: `{ id, order_id, items:[tên món], review_link } | null`.
- `POST /v1/review-invites/:id/event` với body `{ "type": "opened" | "done" | "later" }`.
- `GET /v1/orders`: mỗi đơn thêm cờ `reviewable` và `reviewed`.
- `PUT /v1/push`: danh sách loại tin thêm `dg`.

## 4. Lấy đánh giá từ Google và ghép khách

- Dùng Google Business Profile API: `accounts.locations.reviews.list` để đọc, `accounts.locations.reviews.updateReply` để trả lời. Cần xin quyền dùng API với Google trước (miễn phí, chờ duyệt từ vài ngày đến vài tuần). Đăng nhập bằng OAuth tài khoản chủ quán, lưu refresh token trong biến môi trường.
- Lấy đánh giá mới 5–10 phút một lần, lưu vào `google_reviews`.
- Ghép khách: Google không trả số điện thoại hay email, nên chỉ ghép gần đúng:
  - `hi` (khớp cao): tên gần giống tên khách và đánh giá xuất hiện trong 0–24 giờ sau `opened_at` của khách đó.
  - `md` (có thể): chỉ khớp một trong hai điều kiện.
  - `no` (không rõ): không khớp điều kiện nào.
  - `manual`: POS ghép tay.
- Ghép được khách thì ngừng mời khách đó. Sau 24 giờ không ghép được thì coi như khách chưa đánh giá, kể cả khi khách đã bấm "Đã đánh giá xong".
- Đánh giá có số sao ≤ `alert_max_stars` thì báo chủ quán (push về máy chủ quán), rồi đặt `alerted = 1`.
- Mã QR tại quán dùng `review_link` gắn tham số nguồn qua link chuyển hướng của app, ví dụ `/r/qr_ban`. Link này ghi một lượt quét rồi chuyển sang Google, để báo cáo theo kênh.

## 5. POS: vị trí và màn hình

Trong nhóm menu **App khách hàng** (cùng Khách hàng, Báo cáo, Nhật ký, Phân quyền, Nội dung app, Giờ vàng), thêm mục **Đánh giá Google** gồm 3 thẻ:

| Thẻ | Nội dung | Quyền |
| --- | --- | --- |
| Đánh giá | Danh sách mới nhất: tên Google, sao, nội dung, giờ. Lọc: Tất cả · Chưa trả lời · ≤ N sao · Chưa ghép khách · 7/30 ngày. Cột ghép khách (Khớp cao / Có thể / Không rõ, kèm tên, SĐT che, đơn liên quan), nút Sửa ghép / Ghép tay. Ô trả lời gửi lên Google. Đánh giá thấp có nhãn đỏ "Đã báo chủ quán" | Xem: quản lý ca, chủ quán · Trả lời: chủ quán (bật được cho quản lý ca) |
| Báo cáo | 4 số chính: đánh giá mới, sao trung bình, tỷ lệ đã trả lời + thời gian trả lời trung bình, số đánh giá 1–3 sao. Phễu: đã mời → bấm Mở Google → đánh giá thật → chọn "Lúc khác". Biểu đồ số đánh giá theo tháng. Bảng theo kênh (push, thẻ trong app, Lịch sử đơn, QR) và theo kiểu đơn (giao, mang đi, tại quán). Khoảng thời gian 7/30/90 ngày | Quản lý ca, chủ quán |
| Cài đặt lời mời | Mỗi mục trong `review_settings`: các nút mức gợi ý (chạm chọn) + ô **Tùy chỉnh** nhập số khác. Công tắc tạm dừng; ô link đánh giá có nút Thử; nút Lưu; ghi nhật ký người sửa | Chủ quán |

Mức gợi ý cho trang Cài đặt lời mời:

| Mục | Gợi ý |
| --- | --- |
| Chờ sau giao | 30, 45, 60, 90, 120 phút |
| Chờ sau mang đi | 30, 45, 60, 90 phút |
| Chờ sau uống tại quán | 30, 45, 60, 90 phút |
| Khung không gửi | 21:00–09:00, 22:00–08:00, hoặc tự đặt giờ từ / đến |
| Dời sang | 09:00, 10:00, hoặc tự đặt |
| Mời từ đơn thứ | 1, 2, 3 |
| Tối đa mỗi ngày | 1, 2 |
| Nhắc lại | 0, 1, 2 lần |
| Nghỉ mời | 30, 60, 90, 180 ngày |
| Tối đa mỗi năm | 2, 3, 4, 6 |
| Báo chủ quán khi | ≤ 1, 2, 3 sao |
| Kênh | push, thẻ trong app, Lịch sử đơn (bật/tắt từng kênh) |

Thêm vào chỗ đã có trong POS:
- **Hồ sơ khách › Tổng quan:** thêm dòng "Đánh giá Google: ★n ngày dd/mm · mức ghép · xem", hoặc "Chưa đánh giá · đã mời n lần".
- **Trang Báo cáo chung:** thêm 1 ô tóm tắt (số đánh giá tháng, sao trung bình).
- **Phân quyền:** thêm 3 quyền: xem đánh giá, trả lời đánh giá, sửa cài đặt lời mời.
- **Tạo đơn ở quầy:** bắt buộc chọn kiểu đơn **Uống tại quán / Mang đi**. Đơn giao lấy từ GHN. Sự kiện `order.completed` gửi sang API App KH thêm `kind` và `received_at`: giờ GHN báo giao xong với đơn giao, giờ thanh toán với đơn tại quầy.

**Đường POS gọi sang API App KH** (khoá dịch vụ, chỉ nhận từ IP của POS):

```
GET   /internal/reviews?filter=&range=&cursor=
POST  /internal/reviews/:review_id/reply        { text }
PATCH /internal/reviews/:review_id/match        { customer_id | null }
GET   /internal/reviews/report?range=7|30|90
GET   /internal/review-settings
PUT   /internal/review-settings                 { ...json, actor }
GET   /internal/customers/:id/review-summary
```

## 6. Kiểm tra trước khi giao

- Đơn giao nhận lúc 20:40, chờ 60 phút → lời mời đến lúc 10:00 sáng hôm sau.
- Khách uống tại quán, tùy chỉnh 75 phút → lời mời đến đúng 75 phút sau giờ thanh toán.
- Bấm "Lúc khác": thẻ ẩn; đơn sau nhắc lại đúng một lần; sau đó nghỉ 60 ngày.
- Bấm "Đã đánh giá xong" mà sau 24 giờ không có đánh giá ghép được → không bị đánh dấu đã đánh giá.
- Khách đã ghép `hi` → không nhận lời mời nào nữa. Nút ở Lịch sử đơn đổi thành "Đã đánh giá".
- Đánh giá 2 sao → chủ quán nhận báo trong vòng 10 phút.
- Trả lời trong POS → câu trả lời hiện trên Google Maps.
- Tắt loại tin `dg` → không có push, thẻ trong app vẫn hiện.
- App KH: `cmsAudit` ra `[]` cho trang đơn, Trang chủ, Lịch sử đơn, Thông báo.
