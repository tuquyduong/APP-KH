> **Ghi chú chat App KH 28.10.2026 — đặc tả gốc 25.10, một số chỗ đã được chủ quán thay:** App KH có kho GitHub riêng; đợt 1 (tới khai trương
> 07.11) trang tĩnh trên Cloudflare gọi thẳng `/api/kh` của POS; máy App KH riêng + kho dữ liệu nhỏ (chỉ nội dung, phiên, thông báo, nhắc việc)
> từ KH-TACH-1 sau khai trương; giao hàng Ahamove (không GHN); số liệu trong demo chỉ minh hoạ. Khi lệch: `QUYET_DINH_CHU_QUAN.md` (kho POS) và `HOP_DONG_API_KH.md` thắng.

# Đặc tả kỹ thuật App KH Tứ Quý Đường · kết nối POS

Oct 25, 2026 · @linh

App KH là một PWA đặt trên CDN, chỉ gọi một API riêng (API App KH) chạy
cạnh POS; POS giữ mọi giá trị tiền. Mỗi khách tốn khoảng 10–60 KB/năm
trên máy chủ và 2–5 MB trên máy của khách. Tài liệu này là đặc tả để
viết code; giao diện lấy theo app_kh_demo.html (bản đã vá đến patch39,
25 màn hình + màn tiện ích; kèm demo POS quản lý khách hàng
pos_khach_hang_demo.html).

## 1. Tổng quan và nguyên tắc

**Phạm vi:** ứng dụng khách hàng (App KH) dạng PWA, trang Quản lý nội
dung (CMS), API App KH, và phần POS cần bổ sung để phục vụ app. SX không
đổi, chỉ được POS gọi như hiện nay.

**Tám nguyên tắc (mọi quyết định code phải theo):**

1.  **POS là nguồn sự thật cho tiền.** Giá, giá hội viên, Giờ vàng,
    voucher, ví, điểm, PIN chỉ được tính và lưu ở POS. App hiển thị giá
    tạm tính; POS tính lại lần cuối khi đặt hàng và trả về con số chính
    thức.

2.  **App-first.** App là kênh chính; quầy POS là kênh phụ. Chức năng
    mới thiết kế cho app trước, quầy dùng lại cùng API.

3.  **Suy giảm không lan ngược.** SX hỏng → POS vẫn bán. POS chậm/hỏng →
    app vẫn mở, xem menu, lịch, trắc nghiệm từ bộ nhớ đệm; chỉ đặt hàng,
    ví, điểm tạm khoá kèm thông báo rõ ràng.

4.  **Máy khách giữ phần nặng, máy chủ giữ phần có giá trị.** Giao diện,
    ảnh, âm thanh, lịch âm, câu hỏi trắc nghiệm, câu trả lời chi tiết ở
    máy khách; tài khoản, tiền, đơn hàng ở máy chủ.

5.  **Một cửa vào.** App chỉ gọi API App KH. Không bao giờ gọi thẳng
    POS, SX hay Turso từ trình duyệt.

6.  **Mọi thao tác tiền có khoá chống trùng (idempotency key) và nhật
    ký.** Bấm hai lần, mạng chập chờn hay gửi lại đều không trừ tiền hai
    lần.

7.  **Quyền tối thiểu.** Token của khách chỉ đọc/ghi dữ liệu của chính
    khách đó; token nhân viên tách riêng; CMS có quyền riêng, không chạm
    được giá.

8.  **Dữ liệu sức khoẻ tối thiểu.** Chỉ lưu kết quả trắc nghiệm rút gọn
    khi khách đồng ý; khách xoá được bất cứ lúc nào.

## 2. Kiến trúc và luồng dữ liệu

PWA lấy giao diện, ảnh và nội dung từ CDN, còn dữ liệu cá nhân và tiền
chỉ qua API App KH; API App KH là bên duy nhất gọi POS.

<img src="media/image1.png" style="width:6in;height:4.48214in"
alt="kiến trúc App KH · 4 tầng, 1 cửa vào" />

kiến trúc App KH · 4 tầng, 1 cửa vào

Luồng chính: (1) mở app → khung app từ cache, gọi /v1/bootstrap; (2) xem
menu → menu/core từ POS qua API, ảnh và mô tả từ R2; (3) đặt hàng → API
chuyển sang POS, POS tính giá, trừ ví, gọi PayOS/GHN; (4) POS bắn sự
kiện về API → API gửi thông báo đẩy; (5) CMS xuất bản → API ghi tệp
content.\<v\>.json lên R2 và tăng số phiên bản trong bootstrap. SX chỉ
nối với POS như hiện nay; SX hỏng không ảnh hưởng app.

## 3. Hosting

Mọi thứ tĩnh (giao diện, ảnh, nội dung) nằm trên CDN miễn phí; chỉ API
App KH và POS chạy trên Render. Chi phí cố định dự kiến 7–13 USD/tháng,
không phụ thuộc số khách đến khoảng 20.000 khách.

| Thành phần                                                         | Đặt ở đâu                                                                | Gói / chi phí                            | Ghi chú                                                                                       |
|--------------------------------------------------------------------|--------------------------------------------------------------------------|------------------------------------------|-----------------------------------------------------------------------------------------------|
| PWA (HTML, JS, CSS, icon, âm thanh)                                | Cloudflare Pages · app.\<tên miền\>                                      | Miễn phí                                 | Build tĩnh, mỗi bản có mã phiên bản; không tốn băng thông Render                              |
| Ảnh món, topping, banner                                           | Cloudflare R2 · img.\<tên miền\>                                         | Miễn phí 10 GB, không tính phí tải xuống | Mỗi ảnh 3 cỡ WebP; tên tệp chứa mã băm nội dung nên cache được vĩnh viễn                      |
| Tệp nội dung content.\<phiên bản\>.json                            | Cloudflare R2                                                            | Miễn phí                                 | Do CMS xuất bản; app tải 1 lần mỗi phiên bản                                                  |
| API App KH (BFF)                                                   | Render, dịch vụ riêng tqd-app-api, vùng Singapore                        | 7 USD/tháng (512 MB RAM)                 | Node + Express như POS. Không dùng gói Free cho bản thật vì gói này ngủ khi không có truy cập |
| POS (đang chạy)                                                    | Render, như hiện nay                                                     | Không đổi                                | Thêm nhóm API nội bộ /internal/app/\* chỉ API App KH gọi được                                 |
| CSDL tiền (khách, ví, điểm, đơn, voucher)                          | Turso, database POS hiện có                                              | Đang dùng                                | POS vẫn là nơi ghi duy nhất                                                                   |
| CSDL riêng của app (đăng ký push, nhắc việc, phiên đăng nhập, CMS) | Turso, database thứ hai tqd-app cùng tài khoản                           | Miễn phí → 5,99 USD/tháng khi cần        | Tách để lưu lượng app không làm chậm POS                                                      |
| Trang Quản lý nội dung (CMS)                                       | Cloudflare Pages · admin.\<tên miền\>                                    | Miễn phí                                 | Gọi API App KH nhóm /admin/\*                                                                 |
| Thông báo đẩy                                                      | Web Push (VAPID), gửi từ API App KH                                      | Miễn phí                                 | Cách làm giống SX đang chạy                                                                   |
| OTP đăng nhập                                                      | Zalo ZNS trước, SMS thương hiệu dự phòng (qua eSMS hoặc tương đương)     | Tính theo tin                            | Khoản duy nhất tăng theo số khách                                                             |
| Thanh toán                                                         | PayOS (QR động)                                                          | Phí giao dịch                            | Webhook về POS, không về app                                                                  |
| Giao hàng                                                          | GHN API, gọi từ POS                                                      | Theo đơn                                 | App chỉ xin báo giá qua API App KH                                                            |
| Giám sát                                                           | Nhật ký Render + dịch vụ báo lỗi gói miễn phí + kiểm tra sống 5 phút/lần | Miễn phí                                 | Báo về Zalo/email chủ quán khi API chết                                                       |

**Vì sao API App KH tách khỏi POS:** POS đang chạy thật và còn 4 đường
tài chính chưa khoá quyền. Một lớp riêng đứng trước giúp: lượng truy cập
của khách không làm chậm quầy; token khách không bao giờ chạm API nhân
viên của POS; dữ liệu trả về app được cắt gọn đúng màn hình cần.

**Môi trường:**

| Môi trường    | PWA                    | API             | CSDL                                  | Mục đích                                        |
|---------------|------------------------|-----------------|---------------------------------------|-------------------------------------------------|
| Dev           | Máy lập trình / Replit | Chạy tại chỗ    | Turso nhánh dev                       | Viết code, dữ liệu giả                          |
| Thử (staging) | Pages bản xem trước    | Render gói Free | Bản sao CSDL đã xoá thông tin cá nhân | Chủ quán thử trên điện thoại trước khi lên thật |
| Thật (prod)   | app.                   | api.            | Turso prod                            | Khách dùng                                      |

Tên miền: dùng chung tên miền POS hiện tại (pos-tuquyduong.io.vn) hay
một tên miền thương hiệu mới là việc chủ quán chốt; PWA, ảnh và API phải
cùng một tên miền gốc để cookie đăng nhập hoạt động an toàn.

## 4. Phân chia dữ liệu: POS, Nội dung, máy khách

Quy tắc chọn chỗ lưu: **sai thì mất tiền → POS; sai thì chỉ xấu → Nội
dung (CMS); mất cũng không sao → máy khách; cần máy chủ hành động khi
app đóng → CSDL riêng của app.** Hai bên nối nhau bằng mã món POS
(product_id) và mã khách POS (customer_id).

| Dữ liệu                                                                                                                                  | Lưu ở                 | Ai ghi                        | Ghi chú                                                                          |
|------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-------------------------------|----------------------------------------------------------------------------------|
| Mã món, tên chính thức, danh mục, size, topping                                                                                          | POS                   | Nhân viên POS                 | App đọc qua /menu/core, cache 5 phút                                             |
| Giá thường, giá topping, % hội viên theo hạng                                                                                            | POS                   | Chủ quán                      | Chỉ POS tính tổng chính thức                                                     |
| Còn hàng / hết hôm nay                                                                                                                   | POS                   | Nhân viên                     | Thay đổi trong ngày, đọc riêng /menu/stock (rất nhỏ)                             |
| Giờ vàng: khung giờ, món, %, số suất, đã bán                                                                                             | POS                   | Chủ quán                      | POS giữ suất khi đặt, trả lại khi huỷ                                            |
| Khách: SĐT, họ tên, xưng hô, giới tính, ngày sinh, email, hóa đơn                                                                        | POS                   | Khách (qua app) / nhân viên   | Ngày sinh sửa 1 lần/năm                                                          |
| PIN chủ tài khoản, PIN người thân                                                                                                        | POS (chỉ băm)         | Khách                         | Không bao giờ trả về app hay hiển thị cho nhân viên                              |
| Hạng, điểm, ví, voucher, thẻ quà                                                                                                         | POS (sổ cái)          | Chỉ POS                       | Mỗi thay đổi là một dòng sổ; số dư = tổng sổ                                     |
| Gia đình: người thân, hạn mức, yêu cầu duyệt                                                                                             | POS                   | Chủ tài khoản                 | Kiểm hạn mức khi trừ ví                                                          |
| Đơn hàng, trạng thái, giao hàng                                                                                                          | POS                   | POS, GHN, PayOS               | Chi tiết giữ 24 tháng rồi gộp (mục 5)                                            |
| Kết quả trắc nghiệm rút gọn (mã thể chất + 9 điểm + ngày)                                                                                | POS                   | Khách, khi bấm "Đồng ý lưu"   | Xoá được; dùng gợi ý món ở quầy                                                  |
| Ảnh, mô tả, thành phần, nhóm nhu cầu, nhãn thể chất, thứ tự, món nổi bật, video giới thiệu (mã YouTube)                                  | Nội dung (CMS)        | Chủ quán / nhân viên nội dung | Gắn theo product_id; món chưa có ảnh → hiện biểu tượng men mặc định              |
| Banner, trang giới thiệu, chính sách, câu hỏi thường gặp, dưỡng sinh theo tiết khí, câu chữ + nút của từng trang, banner Ưu đãi, ảnh quà | Nội dung (CMS)        | Chủ quán                      | Xuất bản thành content.\<v\>.json                                                |
| Dữ liệu trắc nghiệm (62 câu, đáp án A–D, nhóm, gợi ý) + bảng ghép món                                                                    | Nội dung (CMS)        | Chủ quán                      | Tệp riêng quiz.\<v\>.json (~45 KB) vì ít đổi                                     |
| Đăng ký thông báo đẩy theo máy + loại tin đã bật                                                                                         | CSDL app              | Khách                         | Mỗi máy 1 dòng, xoá khi trình duyệt báo hết hạn                                  |
| Việc có nhắc (giờ + tiêu đề)                                                                                                             | CSDL app              | Khách                         | Bắt buộc trên máy chủ vì PWA không tự hẹn giờ khi đóng; xoá 30 ngày sau khi nhắc |
| Phiên đăng nhập, mã OTP đang chờ                                                                                                         | CSDL app              | API                           | OTP sống 5 phút; phiên sống 30 ngày, tự gia hạn khi dùng                         |
| Giao diện, icon, âm thanh, lịch âm, 24 tiết khí, cách chấm điểm trắc nghiệm                                                              | Máy khách (tệp tĩnh)  | —                             | Tính ngay trên máy, không gọi máy chủ                                            |
| 60 câu trả lời chi tiết, việc không nhắc, bộ lọc đang chọn, giỏ hàng nháp                                                                | Máy khách (IndexedDB) | Khách                         | Mất khi đổi máy, chấp nhận được                                                  |
| Tiện ích: sinh nhật & giỗ, xe cộ, thuốc, chu kỳ, lễ vật đã sắm, thông tin tín chủ                                                        | Máy khách (IndexedDB) | Khách                         | Chỉ mục bật nhắc gửi lên máy chủ dạng {giờ, tiêu đề chung} (mục 16)              |

## 5. Mô hình dữ liệu

POS thêm 7 bảng và vài cột; CSDL app có 6 bảng. Tiền và điểm lưu dạng
**sổ cái** (mỗi thay đổi 1 dòng, không sửa số dư trực tiếp); số dư hiện
tại được giữ sẵn trong cột balance và cập nhật cùng giao dịch để đọc
nhanh. Mọi truy vấn từ app phải đi qua chỉ mục; câu nào đọc cả bảng là
lỗi.

**POS (database hiện có) · bảng và cột thêm:**

-- cột thêm vào bảng khách hiện có  
ALTER TABLE customers ADD COLUMN title TEXT; --
anh\|chị\|cô\|chú\|bạn\|em  
ALTER TABLE customers ADD COLUMN gender TEXT; -- nu\|nam  
ALTER TABLE customers ADD COLUMN dob TEXT; -- YYYY-MM-DD  
ALTER TABLE customers ADD COLUMN dob_changed_at TEXT; -- sửa 1 lần/năm  
ALTER TABLE customers ADD COLUMN email TEXT;  
ALTER TABLE customers ADD COLUMN invoice_json TEXT; -- {company, tax_id,
email}  
ALTER TABLE customers ADD COLUMN pin_hash TEXT; -- argon2id/bcrypt,
KHÔNG bao giờ trả ra  
ALTER TABLE customers ADD COLUMN pin_fail INTEGER DEFAULT 0;  
ALTER TABLE customers ADD COLUMN pin_locked_until TEXT;  
ALTER TABLE customers ADD COLUMN wallet_balance INTEGER DEFAULT 0; --
đồng, số nguyên  
ALTER TABLE customers ADD COLUMN points_balance INTEGER DEFAULT 0;  
CREATE UNIQUE INDEX IF NOT EXISTS ux_customers_phone ON
customers(phone);  
  
CREATE TABLE wallet_ledger (  
id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, delta INTEGER NOT
NULL,  
reason TEXT NOT NULL, -- topup\|order\|refund\|gift\|adjust  
order_id INTEGER, member_id INTEGER, actor TEXT NOT NULL, --
app:\<id\>\|staff:\<id\>\|system  
idem_key TEXT UNIQUE, created_at TEXT NOT NULL);  
CREATE INDEX ix_wallet_cust ON wallet_ledger(customer_id, created_at);  
  
CREATE TABLE points_ledger ( -- cùng cấu trúc với wallet_ledger  
id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, delta INTEGER NOT
NULL,  
reason TEXT NOT NULL, order_id INTEGER, idem_key TEXT UNIQUE, created_at
TEXT NOT NULL);  
CREATE INDEX ix_points_cust ON points_ledger(customer_id, created_at);  
  
CREATE TABLE family_members (  
id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL, name TEXT NOT NULL,
relation TEXT,  
pin_hash TEXT NOT NULL, pin_fail INTEGER DEFAULT 0, pin_locked_until
TEXT,  
limit_vnd INTEGER DEFAULT 0, -- 0 = không giới hạn  
limit_period TEXT DEFAULT 'day', over_limit TEXT DEFAULT 'ask', --
ask\|block  
notify INTEGER DEFAULT 1, active INTEGER DEFAULT 1, created_at TEXT NOT
NULL);  
CREATE INDEX ix_family_owner ON family_members(owner_id);  
  
CREATE TABLE family_requests ( -- vượt hạn mức, chờ chủ duyệt  
id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL, member_id INTEGER NOT
NULL,  
amount INTEGER NOT NULL, summary TEXT NOT NULL, status TEXT DEFAULT
'pending', -- pending\|approved\|rejected\|expired  
created_at TEXT NOT NULL, decided_at TEXT, expires_at TEXT NOT NULL); --
hết hạn sau 10 phút  
CREATE INDEX ix_famreq_owner ON family_requests(owner_id, status);  
  
CREATE TABLE golden_hour ( -- cài đặt chung  
id INTEGER PRIMARY KEY CHECK (id = 1), start_hm TEXT NOT NULL, end_hm
TEXT NOT NULL, active INTEGER DEFAULT 1);  
CREATE TABLE golden_hour_items ( -- mỗi ngày một bộ, POS tạo từ mẫu  
day TEXT NOT NULL, product_id INTEGER NOT NULL, pct INTEGER NOT NULL, --
30 = giảm 30%  
qty INTEGER NOT NULL, sold INTEGER DEFAULT 0, PRIMARY KEY (day,
product_id));  
  
CREATE TABLE quiz_results (  
customer_id INTEGER PRIMARY KEY, main_type TEXT NOT NULL, second_type
TEXT,  
scores TEXT NOT NULL, -- 'bh:81,kh:13,dh:100,...' (~60 byte)  
climate TEXT, data_version TEXT NOT NULL, created_at TEXT NOT NULL);  
  
-- cột thêm vào bảng đơn hàng hiện có  
ALTER TABLE orders ADD COLUMN channel TEXT DEFAULT 'counter'; --
counter\|app  
ALTER TABLE orders ADD COLUMN member_id INTEGER; -- người thân mua  
ALTER TABLE orders ADD COLUMN idem_key TEXT;  
CREATE UNIQUE INDEX IF NOT EXISTS ux_orders_idem ON orders(idem_key);  
CREATE INDEX IF NOT EXISTS ix_orders_cust ON orders(customer_id,
created_at);

**CSDL app (tqd-app):**

CREATE TABLE otp (phone TEXT PRIMARY KEY, code_hash TEXT NOT NULL,
expires_at TEXT NOT NULL,  
tries INTEGER DEFAULT 0, sent_count_today INTEGER DEFAULT 0, day
TEXT);  
CREATE TABLE sessions (id TEXT PRIMARY KEY, -- ngẫu nhiên 32 byte, chỉ
lưu băm  
customer_id INTEGER NOT NULL, device TEXT, created_at TEXT, last_seen
TEXT, expires_at TEXT NOT NULL);  
CREATE INDEX ix_sessions_cust ON sessions(customer_id);  
CREATE TABLE push_subs (id INTEGER PRIMARY KEY, customer_id INTEGER NOT
NULL, endpoint TEXT UNIQUE NOT NULL,  
p256dh TEXT NOT NULL, auth TEXT NOT NULL, types TEXT NOT NULL, --
'nhac,don,gv,qua,fam'  
created_at TEXT, last_ok TEXT);  
CREATE INDEX ix_push_cust ON push_subs(customer_id);  
CREATE TABLE reminders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT
NULL, fire_at TEXT NOT NULL,  
title TEXT NOT NULL, sent INTEGER DEFAULT 0);  
CREATE INDEX ix_rem_fire ON reminders(sent, fire_at);  
CREATE TABLE cms_versions (v INTEGER PRIMARY KEY, kind TEXT NOT NULL, --
content\|quiz  
json TEXT NOT NULL, published_by TEXT, published_at TEXT NOT NULL);  
CREATE TABLE audit_log (id INTEGER PRIMARY KEY, actor TEXT, action TEXT,
target TEXT, detail TEXT, at TEXT);

**Dung lượng ước tính mỗi khách** (đã gồm chỉ mục, hệ số ~1,7):

| Bảng                          | Cỡ 1 dòng   | Dòng mỗi khách   | Khách thường xuyên (4 đơn/tháng)       | Khách thỉnh thoảng (1 đơn/tháng)       |
|-------------------------------|-------------|------------------|----------------------------------------|----------------------------------------|
| customers (cột thêm)          | ~0,4 KB     | 1                | 0,7 KB                                 | 0,7 KB                                 |
| family_members                | ~0,2 KB     | 0–3              | 0,5 KB                                 | 0,2 KB                                 |
| orders + order_items          | ~0,6 KB/đơn | 48 / 12 mỗi năm  | 49 KB/năm                              | 12 KB/năm                              |
| wallet_ledger + points_ledger | ~0,12 KB    | ~70 / 18 mỗi năm | 14 KB/năm                              | 3,7 KB/năm                             |
| quiz_results                  | ~0,15 KB    | 0–1              | 0,3 KB                                 | 0,3 KB                                 |
| sessions + push_subs          | ~0,6 KB     | 1–2 máy          | 1,5 KB                                 | 1 KB                                   |
| reminders (xoá sau 30 ngày)   | ~0,1 KB     | ~10 đang giữ     | 1,7 KB                                 | 0,5 KB                                 |
| **Cộng**                      |             |                  | **~68 KB/năm đầu, ~64 KB mỗi năm sau** | **~18 KB/năm đầu, ~16 KB mỗi năm sau** |

Chính sách giữ dữ liệu: đơn và dòng sổ chi tiết giữ 24 tháng (đủ cho đối
soát, kế toán có thể yêu cầu dài hơn), sau đó gộp thành dòng tổng theo
tháng và chuyển bản chi tiết ra tệp lưu trữ trên R2 (nén, gần như không
tốn tiền). Thời hạn lưu chứng từ kế toán cần hỏi kế toán trước khi xoá
bất cứ gì.

## 6. API App KH ↔ POS

App gọi khoảng 30 đường /v1/\* của API App KH; API App KH gọi POS qua
nhóm nội bộ /internal/app/\* bằng khoá dịch vụ (không bao giờ chuyển
token của khách sang POS). Mỗi lần mở app chỉ cần **1 lượt gọi**
/v1/bootstrap (~3–6 KB nén).

**Quy ước chung:**

- JSON, UTF-8, nén gzip/brotli. Tiền là số nguyên đơn vị đồng; thời gian
  ISO 8601 có múi giờ +07:00.

- Xác thực: cookie tqd_s (HttpOnly, Secure, SameSite=Lax) chứa mã phiên;
  không dùng token trong localStorage.

- Mọi lệnh ghi liên quan đến tiền mang tiêu đề Idempotency-Key: \<uuid
  do app tạo\>; gửi lại cùng khoá trả về đúng kết quả cũ.

- Đọc dữ liệu ít đổi dùng ETag / If-None-Match → trả 304 không tốn băng
  thông.

- Lỗi: { "error": { "code": "PIN_WRONG", "message": "Sai mã PIN",
  "retry_after": 0, "left": 4 } }. Mã lỗi cố định, câu chữ tiếng Việt để
  app hiển thị thẳng.

- Danh sách dài phân trang bằng cursor, mặc định 20 dòng.

- API App KH gọi POS với hạn chờ 4 giây; quá hạn → trả 503
  POS_UNAVAILABLE cho lệnh ghi, trả bản đệm gần nhất (kèm stale: true)
  cho lệnh đọc.

- Phiên bản: /v1. Thay đổi phá vỡ → /v2, giữ /v1 ít nhất 60 ngày vì PWA
  cũ còn trong máy khách.

**Danh sách đường (app → API App KH):**

| Nhóm        | Đường                         | Quyền                                      | Gọi POS                     | Cache         | Trả về / làm gì                                                                                                        |
|-------------|-------------------------------|--------------------------------------------|-----------------------------|---------------|------------------------------------------------------------------------------------------------------------------------|
| Đăng nhập   | POST /v1/auth/otp             | Khách vãng lai                             | Không                       | —             | Gửi OTP (Zalo trước, SMS sau 30 giây nếu chưa nhận)                                                                    |
|             | POST /v1/auth/verify          | Vãng lai                                   | Có (tìm/tạo khách theo SĐT) | —             | Đặt cookie phiên 90 ngày                                                                                               |
|             | POST /v1/auth/zalo            | Vãng lai                                   | Có                          | —             | Điền sẵn tên; vẫn cần OTP lần đầu trên máy mới                                                                         |
|             | POST /v1/auth/logout          | Khách                                      | Không                       | —             | Xoá phiên máy này                                                                                                      |
| Khởi động   | GET /v1/bootstrap             | Khách/vãng lai                             | Có                          | 30 giây       | Hồ sơ rút gọn, hạng, số dư ví, điểm, số voucher, đơn đang chạy, Giờ vàng hôm nay, phiên bản content/quiz/menu mới nhất |
| Menu        | GET /v1/menu/core             | Công khai                                  | Có                          | 5 phút + ETag | Món, size, topping, giá, % hội viên (~8 KB)                                                                            |
|             | GET /v1/menu/stock            | Công khai                                  | Có                          | 30 giây       | Danh sách mã món hết hôm nay + suất Giờ vàng còn lại (\<1 KB)                                                          |
| Giỏ/Đơn     | POST /v1/quote                | Khách/vãng lai                             | Có                          | —             | POS tính giá chính thức cho giỏ: từng dòng, giá hội viên, Giờ vàng, voucher, phí ship GHN                              |
|             | POST /v1/orders               | Khách + Idempotency-Key (+ PIN nếu trả ví) | Có                          | —             | Tạo đơn; trả mã đơn, tổng chính thức, link QR PayOS nếu cần                                                            |
|             | GET /v1/orders?cursor=        | Khách                                      | Có                          | —             | Lịch sử, 20 đơn/lần                                                                                                    |
|             | GET /v1/orders/:id            | Khách (chủ đơn)                            | Có                          | —             | Trạng thái + hành trình giao                                                                                           |
|             | POST /v1/orders/:id/cancel    | Khách                                      | Có                          | —             | Chỉ khi quán chưa nhận pha                                                                                             |
| Ví/Điểm     | GET /v1/wallet?cursor=        | Khách                                      | Có                          | —             | Số dư + dòng sổ                                                                                                        |
|             | POST /v1/wallet/topup         | Khách + Idempotency-Key                    | Có                          | —             | Tạo QR nạp qua PayOS; số dư chỉ tăng khi webhook PayOS về POS                                                          |
|             | GET /v1/rewards               | Khách                                      | Có                          | 60 giây       | Điểm, hạng, voucher, thẻ quà                                                                                           |
| Hồ sơ       | GET/PATCH /v1/me              | Khách                                      | Có                          | —             | Xưng hô, tên, email, giới tính, ngày sinh, địa chỉ, hóa đơn                                                            |
|             | POST /v1/me/pin               | Khách + PIN cũ hoặc OTP                    | Có                          | —             | Đặt/đổi PIN                                                                                                            |
|             | DELETE /v1/me                 | Khách + OTP                                | Có                          | —             | Yêu cầu xoá tài khoản (xử lý ví/điểm còn lại trước)                                                                    |
| Gia đình    | GET/POST /v1/family           | Chủ tài khoản                              | Có                          | —             | Danh sách, thêm người thân (kèm PIN riêng)                                                                             |
|             | PATCH/DELETE /v1/family/:id   | Chủ + PIN chủ                              | Có                          | —             | Sửa hạn mức, đổi PIN người thân, khoá, xoá                                                                             |
|             | POST /v1/family/requests/:id  | Chủ                                        | Có                          | —             | Duyệt / từ chối yêu cầu vượt hạn mức                                                                                   |
| Trắc nghiệm | PUT /v1/quiz-result           | Khách (đã bấm Đồng ý)                      | Có                          | —             | Chỉ gửi kết quả rút gọn, không gửi 60 câu trả lời                                                                      |
|             | DELETE /v1/quiz-result        | Khách                                      | Có                          | —             | Xoá kết quả                                                                                                            |
| Thông báo   | PUT /v1/push                  | Khách                                      | Không                       | —             | Lưu đăng ký máy + loại tin bật                                                                                         |
|             | GET/POST/DELETE /v1/reminders | Khách                                      | Không                       | —             | Chỉ việc có nhắc (giờ + tiêu đề)                                                                                       |
| Góp ý       | POST /v1/feedback             | Khách                                      | Không                       | —             | Góp ý kết quả trắc nghiệm, đơn hàng                                                                                    |
| CMS         | /v1/admin/\*                  | Tài khoản quản trị + vai trò               | Chỉ đọc danh sách món       | —             | Xem mục 11                                                                                                             |

**Đường POS cần thêm (/internal/app/\*, chỉ nhận khoá dịch vụ của API
App KH, giới hạn theo IP Render):** customers/by-phone,
customers/:id/summary, menu, stock, quote, orders (tạo/đọc/huỷ),
wallet/:id, pin/verify, pin/set, family/\*, quiz-result,
golden-hour/today. Mỗi đường nhận customer_id do API App KH xác thực —
POS vẫn kiểm đơn thuộc đúng khách đó.

**Chiều ngược (POS → API App KH):** POS gọi POST /hooks/pos/event khi
đơn đổi trạng thái, ví thay đổi, người thân mua, có yêu cầu duyệt → API
App KH gửi thông báo đẩy. Sự kiện ký bằng HMAC, có mã sự kiện để không
gửi trùng. API App KH hỏng thì POS ghi sự kiện vào hàng chờ và gửi lại
sau — không bao giờ làm đơn ở quầy thất bại.

## 7. PWA phía máy khách

Lần cài đầu tải khoảng 1–1,5 MB; đủ ảnh và nội dung cỡ 3–5 MB nằm trên
máy. Từ lần thứ hai, mở app chỉ tốn 1 lượt /v1/bootstrap (3–6 KB) và
chạy được cả khi mất mạng ở phần xem.

**Công nghệ:** React + Vite (cùng bộ với POS để dùng chung kỹ năng và
thành phần), Workbox cho service worker, IndexedDB qua thư viện nhỏ
(idb). Mỗi nhóm màn hình tách gói riêng (Trang chủ + Menu tải trước;
Trắc nghiệm, Lịch, Tài khoản tải khi mở). Phông chữ tự lưu trên CDN, cắt
riêng bộ chữ tiếng Việt, không gọi Google Fonts.

**Ngân sách dung lượng (bản nén, đo bằng kiểm tra tự động khi build):**

| Phần                                                         | Giới hạn                 | Tải khi nào                    | Cache                              |
|--------------------------------------------------------------|--------------------------|--------------------------------|------------------------------------|
| JS khung app (Trang chủ, Menu, Giỏ)                          | ≤ 180 KB                 | Lần đầu                        | Theo phiên bản app                 |
| JS các màn còn lại                                           | ≤ 150 KB tổng            | Khi mở màn                     | Theo phiên bản app                 |
| CSS                                                          | ≤ 30 KB                  | Lần đầu                        | Theo phiên bản app                 |
| Phông chữ (2 độ đậm, bộ chữ Việt)                            | ≤ 70 KB                  | Lần đầu                        | Vĩnh viễn                          |
| Bộ icon men + icon giao diện (1 tệp SVG gộp)                 | ≤ 60 KB                  | Lần đầu                        | Vĩnh viễn theo băm                 |
| Logo + màn mở (ảnh WebP)                                     | ≤ 150 KB                 | Lần đầu                        | Vĩnh viễn theo băm                 |
| Âm thanh màn mở (mp3 5,8 giây) + tiếng chuông ngắn           | ≤ 110 KB                 | Sau khi app đã hiện            | Vĩnh viễn theo băm                 |
| menu/core                                                    | ~8 KB                    | Mỗi lần mở (304 nếu không đổi) | 5 phút                             |
| content.\<v\>.json (mô tả, banner, trang nội dung, tiết khí) | ~20–40 KB                | Khi phiên bản đổi              | Vĩnh viễn theo phiên bản           |
| quiz.\<v\>.json                                              | ~45 KB                   | Khi mở Trắc nghiệm             | Vĩnh viễn theo phiên bản           |
| Ảnh món cỡ nhỏ 256 px (15 món + 9 topping + 6 ô nhu cầu)     | ~15 KB/ảnh, ~450 KB tổng | Khi cuộn tới                   | Vĩnh viễn theo băm, tối đa 150 ảnh |
| Ảnh món cỡ vừa 640 px, banner 1080 px                        | ~50–120 KB/ảnh           | Khi mở trang món / Trang chủ   | Vĩnh viễn theo băm, tối đa 40 MB   |

**Chiến lược cache của service worker:**

1.  Khung app, phông, icon, âm thanh: nạp sẵn theo phiên bản, dùng cache
    trước.

2.  Ảnh trên img.: cache trước, tên tệp chứa mã băm nên không bao giờ
    cần hỏi lại; quá giới hạn thì xoá ảnh lâu không xem nhất.

3.  content, quiz: đường dẫn có số phiên bản; bootstrap báo phiên bản
    mới thì mới tải.

4.  menu/core: dùng bản đang có ngay, đồng thời hỏi bản mới chạy ngầm.

5.  Dữ liệu cá nhân (ví, điểm, đơn): hỏi mạng trước; mất mạng thì hiện
    bản cuối kèm dòng "Cập nhật lúc 19:32".

6.  Không bao giờ cache: POST, /auth/\*, /orders (tạo), /me/pin.

**Lưu trên máy (IndexedDB):** câu trả lời trắc nghiệm, việc không nhắc,
giỏ hàng nháp, bản đệm dữ liệu cá nhân gần nhất. localStorage chỉ cho
vài lựa chọn nhỏ (âm thanh màn mở, bộ lọc menu). Gọi
navigator.storage.persist() sau khi khách đăng nhập để trình duyệt không
tự dọn. Đăng xuất thì xoá bản đệm cá nhân, giữ câu trả lời trắc nghiệm
nếu khách chọn giữ.

**Cập nhật phiên bản:** service worker mới cài ngầm, app hiện dòng nhỏ
"Có bản mới · Cập nhật" (không tự tải lại khi khách đang đặt hàng). API
trả 426 APP_TOO_OLD khi app dưới phiên bản tối thiểu → app bắt buộc cập
nhật.

**Khi mất mạng hoặc POS hỏng:**

| Màn                           | Không mạng                 | POS hỏng, API còn                                  |
|-------------------------------|----------------------------|----------------------------------------------------|
| Trang chủ, Menu, trang món    | Xem được từ cache          | Xem được; giá ghi "tạm tính"                       |
| Giỏ, đặt hàng                 | Giữ giỏ nháp, nút đặt khoá | Nút đặt khoá: "Quán đang bận, thử lại sau ít phút" |
| Ví, điểm, đơn                 | Bản cuối + giờ cập nhật    | Bản cuối + giờ cập nhật                            |
| Trắc nghiệm, Lịch, Dưỡng sinh | Chạy đầy đủ                | Chạy đầy đủ; lưu kết quả vào hàng chờ, gửi sau     |

**Cài ra màn hình chính:** Android dùng lời mời cài của trình duyệt,
hiện sau đơn đầu tiên. iPhone hiện hướng dẫn 2 bước (Chia sẻ → Thêm vào
Màn hình chính) khi khách bật thông báo, vì iPhone chỉ nhận thông báo
khi app đã cài.

**Mục tiêu tốc độ:** lần đầu trên 4G hiện Trang chủ dưới 3 giây (màn mở
chạy song song); các lần sau dưới 1 giây. Tôn trọng cài đặt "giảm chuyển
động" của máy; không dùng hiệu ứng chớp, nhoè trên iPhone.

## 8. Bảo mật

Ba lớp bảo vệ tiền: đăng nhập bằng OTP xác minh **ai**, mã PIN xác minh
**được tiêu tiền**, và POS tự tính lại **bao nhiêu**. Trước khi mở app
cho khách phải vá 4 đường tài chính của POS đang "mặc định ai có token
là nhân viên" (POST /orders, POST /packages/buy, PUT
/customer-packages/:id/deliver, PUT /customers/:id/discount).

**8.1 Đăng nhập và phiên**

- OTP 6 số, sống 5 phút, sai 5 lần thì huỷ; lưu dạng băm.

- Chống đốt tiền OTP: tối đa 5 OTP/số/ngày, 20 OTP/IP/giờ, kiểm tra
  chống máy tự động (Cloudflare Turnstile, miễn phí) trước khi gửi.

- Phiên: mã ngẫu nhiên 32 byte trong cookie HttpOnly; Secure;
  SameSite=Lax, chỉ lưu băm trên máy chủ; sống 30 ngày kể từ lần dùng
  cuối, tự gia hạn mỗi lần mở app (chủ quán chốt 26/10). Thông tin cá
  nhân › Bảo mật có danh sách thiết bị, đăng xuất từng máy hoặc mọi máy
  khác; đổi SĐT hoặc đặt lại PIN thì đăng xuất mọi máy khác. Tài khoản
  có nút "Đăng xuất mọi máy".

- Đổi số điện thoại: OTP về số cũ và số mới; ví khoá 24 giờ sau khi đổi
  và báo về số cũ.

- Tài khoản bị khoá hoặc xoá → mọi phiên bị thu hồi ngay, kể cả phiên
  còn hạn (giống chính sách SX).

**8.2 Mã PIN (chủ tài khoản và người thân)**

- Độ dài theo POS hiện tại (demo dùng 4 số, **chờ xác nhận**). Lưu băm
  chậm (argon2id hoặc bcrypt) kèm một khoá bí mật chung nằm trong biến
  môi trường POS; chỉ POS kiểm tra PIN.

- Sai 5 lần → khoá 15 phút + báo về máy chủ tài khoản. **Giới hạn gộp
  theo tài khoản:** tổng 10 lần sai (PIN chủ + mọi PIN người thân) trong
  1 giờ → khoá trừ ví 1 giờ. Lý do: PIN 4 số và nhiều người thân sẽ làm
  tăng cơ hội đoán trúng.

- Cấm PIN dễ đoán: 4 số giống nhau, dãy liên tiếp, ngày sinh (ddmm,
  mmdd, năm), 4 số cuối SĐT, trùng PIN chủ (với người thân).

- Đặt lại PIN qua OTP → báo về máy; trong 1 giờ đầu chỉ cho trừ ví tối
  đa 200.000đ.

- Ở quầy: khách tự nhập PIN trên bàn phím quay về phía khách (hoặc trên
  máy của khách bằng mã QR), không đọc to; màn hình nhân viên chỉ thấy
  dấu chấm.

- PIN không bao giờ ghi vào nhật ký, không trả về app, không hiện cho
  nhân viên; nhân viên chỉ có nút "gửi khách OTP để đặt lại".

**Cấp lại PIN khi khách quên (chốt 26/10).** Nhân viên không bao giờ
thấy, hỏi hay nhập hộ PIN. Khách có 3 cách:

1.  Trên app: Quên PIN → nhập OTP 6 số gửi về SĐT (sai 5 lần khoá 15
    phút) → tự đặt PIN mới hai lần.

2.  Tại quầy: nhân viên bấm "Đặt lại PIN" → hệ thống gửi OTP tới SĐT
    khách → khách đọc mã → màn hình quay về phía khách, khách tự nhập
    PIN mới hai lần.

3.  Nhân viên bấm "Gửi link đặt lại PIN" → SMS/Zalo tới SĐT khách, link
    dùng 1 lần, hiệu lực 15 phút.

PIN bị khoá do sai 5 lần: nhân viên mở khoá sau khi khách đọc đúng OTP.
Khách mất SĐT: kiểm giấy tờ, chủ quán đổi số (quyền riêng), rồi gửi link
tới số mới. Mọi thao tác ghi nhật ký (mục 15.4).

**8.3 Phân quyền**

| Vai trò                  | Được làm                                                   | Không được làm                                                          |
|--------------------------|------------------------------------------------------------|-------------------------------------------------------------------------|
| Khách vãng lai           | Xem menu, nội dung, làm trắc nghiệm (kết quả chỉ trên máy) | Đặt hàng trả ví, xem giá hội viên riêng                                 |
| Khách                    | Mọi dữ liệu của chính mình                                 | Đọc đơn, ví, hồ sơ của khách khác (API kiểm chủ sở hữu ở **mọi** đường) |
| Người thân               | Không đăng nhập app; chỉ dùng PIN riêng ở quầy             | Xem số dư, đổi hạn mức                                                  |
| Nhân viên quầy           | Bán, tra khách theo SĐT, trừ ví khi có PIN                 | Hoàn ví, sửa giá, xem PIN (nạp ví: chờ chủ quán chốt, mục 15.3)         |
| Quản lý ca               | Thêm: hoàn tiền, Giờ vàng trong ngày                       | Sửa giá gốc                                                             |
| Chủ quán                 | Toàn quyền                                                 | —                                                                       |
| Nhân viên nội dung (CMS) | Ảnh, chữ, banner, xuất bản                                 | Giá, khách, ví                                                          |

Bảng trên là vai trò mặc định. Quyền chi tiết trong POS gồm 16 quyền
nguyên tử, mỗi quyền chỉ cho đúng việc đó, chủ quán bật/tắt cho từng vai
trò (mục 15.3).

**8.4 Giao tiếp giữa các máy**

- Chỉ HTTPS, bật HSTS. CORS chỉ cho app. và admin.. Chống giả mạo yêu
  cầu: cookie SameSite + bắt buộc tiêu đề riêng X-TQD-App: 1 ở mọi lệnh
  ghi.

- Chính sách nội dung (CSP) chặt: chỉ chạy script của chính app, ảnh từ
  img., không script nội tuyến; khung nhúng (frame-src) chỉ cho
  www.youtube-nocookie.com, ảnh bìa video chỉ từ i.ytimg.com.

- API App KH → POS: khoá dịch vụ trong tiêu đề + POS chỉ nhận từ IP ra
  của Render; đổi khoá 6 tháng/lần. POS → API App KH và PayOS → POS: ký
  HMAC, kiểm chữ ký, thời gian (lệch tối đa 5 phút) và mã sự kiện chống
  phát lại.

- Khóa bí mật chỉ nằm trong biến môi trường Render, không bao giờ trong
  mã hay thư mục build (POS đang commit client/dist/: kiểm tra không có
  khoá nào lọt vào đó).

**8.5 Chống gian lận tiền**

- Không tin số tiền từ app: POS tính lại từ mã món, size, topping, số
  lượng; lệch với bản tạm tính thì trả giá mới cho khách xác nhận.

- Webhook PayOS: kiểm chữ ký, số tiền khớp đơn, xử lý đúng 1 lần.

- Giờ vàng: giữ suất bằng một câu lệnh nguyên tử UPDATE
  golden_hour_items SET sold = sold + :n WHERE day=? AND product_id=?
  AND sold + :n \<= qty — không đọc rồi ghi (tránh lỗi tranh chấp như
  used_count hiện nay). Cài đặt tuỳ chọn: tối đa N suất/khách/món.

- Ví, điểm, voucher: mọi trừ/cộng trong cùng một giao dịch CSDL với đơn;
  số dư không bao giờ âm (ràng buộc trong câu lệnh); voucher dùng một
  lần khoá bằng chỉ mục duy nhất. Nạp ví tại quầy trên 2.000.000đ và
  cộng/trừ điểm trên 1.000 điểm cần chủ quán duyệt; mọi nạp, hoàn, điều
  chỉnh bắt buộc ghi lý do và là một dòng sổ mới.

- Quà sinh nhật: 1 lần/năm/SĐT, chỉ khách đã có ít nhất 1 đơn; ngày sinh
  sửa 1 lần/năm.

**8.6 Giới hạn tần suất (theo tài khoản, dự phòng theo IP)**

| Đường                  | Giới hạn                                  |
|------------------------|-------------------------------------------|
| /auth/otp              | 5/số/ngày, 20/IP/giờ                      |
| /auth/verify           | 5 lần/OTP                                 |
| PIN (mọi nơi)          | 5 sai/15 phút/người, 10 sai/giờ/tài khoản |
| /orders, /wallet/topup | 10/phút                                   |
| Đọc khác               | 120/phút                                  |

**8.7 Dữ liệu cá nhân và sức khoẻ**

- Thông tin sức khoẻ (kết quả trắc nghiệm) là dữ liệu cá nhân nhạy cảm
  theo Nghị định 13/2023: có màn đồng ý riêng nêu rõ mục đích (gợi ý
  thức uống), lưu tối thiểu, xoá được trong app; 60 câu trả lời không
  rời khỏi máy.

- Xoá tài khoản: xoá/ẩn danh hồ sơ, kết quả trắc nghiệm, đăng ký push,
  nhắc việc; giữ đơn và sổ tiền ở dạng ẩn danh theo yêu cầu kế toán.

- Nhật ký không chứa PIN, OTP, token; SĐT che ‘090\*\*\*\*123’. Nhật ký
  thao tác tiền và CMS giữ 24 tháng. Dữ liệu tiện ích uống thuốc và chu
  kỳ kinh chỉ nằm trên máy khách (IndexedDB), không đồng bộ, không sao
  lưu lên máy chủ; tin nhắc gửi từ máy chủ chỉ mang tiêu đề chung ("Đến
  giờ uống thuốc", "Lời nhắc của bạn"); mục Chu kỳ có tuỳ chọn khoá bằng
  PIN và nút xoá sạch.

- Các điểm trên cần luật sư rà cùng danh sách đã ghi trong trạng thái dự
  án (tên nhóm nhu cầu, khẩu hiệu, trắc nghiệm).

**8.8 Sao lưu:** bật sao lưu của Turso cho cả hai database; thêm bản
xuất hằng đêm (mã hoá) ra R2, giữ 30 ngày; thử khôi phục mỗi quý một
lần.

**8.9 Rà soát bảo mật trước khi chạy thật** (theo OWASP ASVS mức 1; mỗi
mục cần một bài kiểm tra tự động hoặc ghi nhận đã thử tay):

- [ ] Kiểm chủ sở hữu ở mọi đường /v1 có :id (thử đọc đơn, ví, gia đình
  của khách khác → phải 404).

- [ ] Giới hạn tần suất: OTP, PIN, đăng nhập CMS/POS, tìm khách theo SĐT
  ở POS (chống dò danh sách khách).

- [ ] Token chỉ trong cookie HttpOnly; IndexedDB và localStorage không
  chứa token, số dư hay PIN.

- [ ] Mọi chữ do CMS và khách nhập đều escape khi hiển thị (đã làm trong
  demo: escT, escH); CSP không có unsafe-inline cho script.

- [ ] frame-ancestors 'none' chống nhúng app vào trang giả; chỉ nhúng ra
  ngoài youtube-nocookie.

- [ ] Khoá bí mật chỉ trong biến môi trường; quét repo và client/dist/
  không lộ khoá.

- [ ] npm audit không còn lỗi mức cao; khoá phiên bản thư viện.

- [ ] Thử khôi phục từ bản sao lưu Turso ít nhất 1 lần trước khi mở cho
  khách.

- [ ] Cảnh báo về chủ quán khi: nhiều lần sai PIN trên nhiều khách, nạp
  ví bất thường, xuất danh sách khách, đăng nhập POS từ máy lạ.

## 9. Quy tắc nghiệp vụ phía máy chủ

Một hàm tính giá duy nhất trong POS (priceCart) dùng chung cho quầy,
/quote và /orders; app chỉ sao chép công thức để hiện tạm tính. Các quy
tắc dưới đây đã được chủ quán chốt trong các buổi 23–25/10, trừ dòng ghi
"chờ chốt".

**9.1 Tính giá một dòng hàng** (theo thứ tự):

unit = giá_size + tổng giá topping (mỗi loại được nhiều phần, không giới
hạn)  
NẾU dòng là COMBO:  
unit = giá_combo (+ phụ thu size/topping từng món nếu khách đổi)  
line = round_100(unit × (1 − pct_hạng)) -- có giảm theo hạng; KHÔNG Giờ
vàng; KHÔNG vào cơ sở voucher  
NGƯỢC LẠI NẾU món có Giờ vàng hôm nay VÀ đang trong khung giờ VÀ còn
suất:  
line = round_100(giá_size × (1 − pct)) + topping -- KHÔNG cộng giá hạng,
KHÔNG vào cơ sở voucher  
giữ suất (câu lệnh nguyên tử, mục 8.5)  
NGƯỢC LẠI:  
line = round_100(unit × (1 − pct_hạng)) -- Thường 0%, Vàng 10%, Kim
cương 15% (số tạm, đặt trong POS)  
line_total = line × số lượng

Chờ chốt: Giờ vàng giảm trên giá món hay cả topping (demo đang giảm giá
món); người thân có hưởng giá hội viên của chủ không.

**9.1a Hiển thị giá 3 hạng (chốt 26/10).** Mọi thẻ món, combo và trang
món luôn hiện đủ Thường · Vàng · Kim cương dạng thang giá mảnh (3 cột,
đường chỉ vàng, tên hạng in hoa nhỏ). Giá của khách to, đậm, màu hạng
(hồng sẫm / vàng đồng / xanh lam), gạch chân mảnh; trang món thêm ◆ và
chữ "Giá của bạn". Món đang Giờ vàng hiện giá Giờ vàng thay thang giá.
App chỉ hiển thị; POS trả tiers (tên, %) trong bootstrap và tính tiền
thật.

**9.9 Hạng thành viên (chốt 26/10, số liệu tạm).** "Bạch Kim" đổi tên
thành "Kim cương".

**9.9a Sửa thông tin hạng ngay trên app (patch38, 26/10).** Màn Hạng
thành viên không còn khoá: trong chế độ sửa, cách có hạng
(t:tier.\<0\|1\|2\>.how), quyền lợi từng hạng (t:tier.\<k\>.ben, mỗi
dòng một quyền lợi, thêm/bớt dòng tự do; icon theo thứ tự, dòng mới dùng
dấu ✓), ghi chú thẻ Vàng (t:tier.buynote), "Không bán, chỉ xét"
(t:tier.dia.k), các câu xét Kim cương (t:tier.dianote, t:tier.dianote2,
t:tier.goldkc) là chữ nội dung (content.texts). Số liệu dùng để tính
tiền sửa bằng bảng riêng: tier:pct (tên hạng + % giảm), tier:plans (các
gói thẻ Vàng: số tháng + giá, thêm/bỏ gói; gói dài tự hiện "Tiết kiệm"
so với gói đầu), tier:crit (tiêu chí Kim cương: tên, ngưỡng, đơn vị
đồng/đơn/tháng/lần), tier:cmp (bảng so sánh; hàng "Giá" tự lấy theo %).
Bản thật: tier:\* KHÔNG nằm trong content mà gọi PUT /admin/tiers,
/admin/gold-plans, /admin/diamond-rules, /admin/tier-compare của POS
(quyền chủ quán, ghi audit_log), vì POS tính tiền; sửa ở app hay trong
POS là cùng một chỗ. Đổi % thì nhớ sửa câu quyền lợi "Giảm …%" cho khớp
(bảng sửa có nhắc). Thẻ "Hạng hiện tại" của khách vẫn khoá (POS xét).
Sửa lỗi demo: nút Mua/Gia hạn hiện đúng số tiền gói đang chọn.

| Hạng      | Cách có                                                                                                                              | Giảm | Điểm | Quyền lợi khác                                                                                                |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------|------|------|---------------------------------------------------------------------------------------------------------------|
| Thường    | Mặc định                                                                                                                             | 0%   | ×1   | Voucher sinh nhật 20%, Giờ vàng, trắc nghiệm                                                                  |
| Vàng      | Mua thẻ 1 tháng (79.000đ) hoặc 3 tháng (199.000đ); gia hạn trước hạn thì cộng dồn                                                    | 10%  | ×1,2 | Sinh nhật tặng 1 ly, báo Giờ vàng sớm 15 phút, ưu đãi riêng hằng tháng                                        |
| Kim cương | Không bán. Đạt đủ: chi 3.000.000đ và 20 đơn trong 6 tháng gần nhất, giữ Vàng 3 tháng liên tục → POS tự nâng, giữ 6 tháng rồi xét lại | 15%  | ×1,5 | Miễn phí giao nội thành, hộp quà + 1 ly mỗi ngày tuần sinh nhật, tư vấn dưỡng sinh 1-1 mỗi quý, sự kiện riêng |

POS lưu: tiers (mã, tên, pct, điểm ×, quyền lợi JSON), gold_plans (số
tháng, giá), diamond_rules (chỉ tiêu, ngưỡng, số tháng),
customer_tier_history (khách, hạng, từ, đến, lý do: mua/xét/hết hạn).
Việc chạy đêm xét Kim cương, hết hạn Vàng; báo khách qua push. App hiện
tiến độ từng tiêu chí (GET /v1/me/tier). Chủ quán chốt: % giảm, giá thẻ,
tiêu chí, quyền lợi.

**9.10 Combo (chốt 26/10).** Combo = 2 món trở lên mua cùng giá tốt hơn,
là một nhóm trong Menu (ô "Combo" ngay sau Giờ vàng). POS tạo: combos
(mã, tên, giá, nhãn, hiệu lực, đang bán) + combo_items (combo,
product_id, size mặc định, số lượng); kiểm giá combo \< tổng giá lẻ. App
hiện ảnh ghép các món (hoặc ảnh riêng p.img:\<combo_id\>), giá lẻ gạch
ngang, thang 3 giá, dưới mỗi giá ghi số tiền tiết kiệm so với mua lẻ của
đúng hạng đó (patch38, chủ quán chốt 26/10: khách thấy tiết kiệm tăng
dần Thường → Vàng → Kim cương; bỏ dòng "tiết kiệm" chung cạnh giá lẻ;
trang chi tiết combo cũng ghi tiết kiệm dưới từng hạng); trang chi tiết
combo liệt kê món, số lượng, nút thêm giỏ. Tạm chốt (chờ chủ quán xác
nhận): giá combo vẫn giảm theo hạng; không dùng kèm voucher; không áp
Giờ vàng. Một món trong combo hết hàng → cả combo hiện "Hết hôm nay".

**9.2 Tổng đơn:** tổng dòng → trừ voucher (chỉ tính trên dòng **không**
phải Giờ vàng, không vượt giá trị các dòng đó) → cộng phí giao GHN (trừ
phần quán hỗ trợ) → trừ ví (nếu chọn, có PIN) → phần còn lại trả QR
PayOS hoặc tiền mặt khi nhận.

**9.3 Luồng tạo đơn trên app:**

1.  App gửi giỏ + Idempotency-Key (+ PIN nếu dùng ví).

2.  POS kiểm món còn bán, tính lại bằng priceCart, giữ suất Giờ vàng.

3.  Nếu tổng khác bản app đã hiện → trả 409 PRICE_CHANGED kèm giá mới,
    nhả suất; app cho khách xem và xác nhận lại.

4.  Kiểm PIN → trong **một giao dịch**: ghi đơn, trừ ví (dòng sổ), đánh
    dấu voucher đã dùng.

5.  Còn phần phải trả → tạo QR PayOS, đơn ở trạng thái "chờ thanh toán"
    15 phút; hết hạn thì huỷ, hoàn ví, nhả suất và voucher.

6.  Đủ tiền → in tem + hóa đơn (lỗi máy in không huỷ đơn), gọi GHN nếu
    giao, bắn sự kiện để gửi thông báo.

7.  Điểm cộng khi đơn hoàn thành (không phải khi tạo), vào tài khoản
    chủ.

**9.4 Giờ vàng:** khung giờ cố định mỗi ngày; danh sách món, % và số
suất nằm trong cài đặt; POS tạo bộ golden_hour_items cho ngày mới lúc
00:05 từ mẫu. Hết suất → món về giá thường (có giá hội viên). Giỏ có món
Giờ vàng mà hết giờ/hết suất trước khi đặt → 409 PRICE_CHANGED. Đơn Giờ
vàng bị huỷ → trả suất.

**9.5 Ví:** nạp qua PayOS (số dư tăng khi webhook hợp lệ); trừ khi có
PIN; hoàn khi đơn huỷ. Không rút ra tiền mặt (chờ kế toán xác nhận nghĩa
vụ với tiền nạp trước).

**9.6 Gia đình (PIN riêng cho người thân):**

1.  Quầy nhập SĐT chủ → khách nhập PIN. POS thử PIN chủ trước, rồi PIN
    từng người thân đang hoạt động; khớp ai → ghi member_id. Khi đặt PIN
    mới, POS thử nó với mọi PIN đang có của tài khoản để không ai trùng
    PIN.

2.  Người thân: kiểm hạn mức ngày/tháng (tổng wallet_ledger của
    member_id trong kỳ + đơn này).

3.  Vượt hạn mức: over_limit = block → từ chối; ask → tạo
    family_requests (sống 10 phút), đẩy thông báo cho chủ; chủ duyệt
    trên app → quầy thấy "Đã duyệt" và thanh toán tiếp.

4.  Tiền trừ ví chủ, điểm tích về chủ, báo về chủ nếu notify = 1.

5.  Không giới hạn số người thân; không có trắc nghiệm cho trẻ em; không
    chặn món.

**9.7 Trắc nghiệm:** chấm điểm hoàn toàn trên máy (công thức và ngưỡng
30/40/60 nằm trong quiz.\<v\>.json). Khi khách bấm "Đồng ý lưu", app gửi
main_type, second_type, 9 điểm, climate, data_version. Máy chủ không
chấm lại. Nhân viên quầy thấy thể chất chính để gợi ý món, không thấy
điểm chi tiết.

**9.8 Quà sinh nhật:** việc chạy hằng ngày trong POS lúc 07:00 chọn
khách có sinh nhật trong 7 ngày tới, đã có ít nhất 1 đơn, chưa nhận quà
năm nay → tạo voucher theo luật trong cài đặt (giá trị, hạn 14 ngày) →
gửi thông báo loại qua.

## 10. Thông báo đẩy và nhắc việc

Dùng Web Push chuẩn (VAPID) như SX đang chạy, không tốn phí gửi; API App
KH là nơi duy nhất gửi tin. Xin phép **đúng lúc** (khách vừa lưu việc có
nhắc, hoặc bật "Báo Giờ vàng"), không bao giờ xin ngay khi mở app.

| Loại (types)                         | Nguồn sự kiện                               | Mặc định khi bật quyền | Giới hạn                            |
|--------------------------------------|---------------------------------------------|------------------------|-------------------------------------|
| nhac Nhắc việc                       | Bảng reminders, quét mỗi phút               | Bật                    | Đúng số việc khách hẹn              |
| don Đơn hàng                         | Sự kiện POS                                 | Bật                    | Theo trạng thái đơn                 |
| gv Giờ vàng bắt đầu                  | Lịch cố định lúc mở bán                     | Tắt (khách tự bật)     | 1 tin/ngày                          |
| qua Quà sinh nhật, hạn voucher, điểm | Việc hằng ngày của POS                      | Bật                    | 1 tin/mỗi sự kiện                   |
| fam Gia đình                         | Sự kiện POS (người thân mua, yêu cầu duyệt) | Bật                    | Theo sự kiện                        |
| km Khuyến mãi, món mới               | CMS gửi tay                                 | Tắt                    | Tối đa 1 tin/tuần, hệ thống tự chặn |

**Cách gửi:**

1.  App đăng ký push trong chính cú bấm "Bật" (yêu cầu của trình duyệt),
    gửi endpoint, khoá và danh sách loại tin lên PUT /v1/push.

2.  Một tiến trình trong API App KH chạy mỗi phút: lấy reminders đến hạn
    (dùng chỉ mục sent, fire_at), gửi, đánh dấu đã gửi.

3.  Trình duyệt trả 404/410 → xoá đăng ký đó ngay (giữ bảng gọn).

4.  Nội dung tin ngắn, không chứa thông tin nhạy cảm (không ghi thể
    chất, không ghi số dư); bấm vào mở đúng màn.

5.  Giờ yên lặng 22:00–07:00 cho km và qua (nhắc việc vẫn gửi đúng giờ
    khách hẹn).

**Giới hạn của PWA cần biết:** iPhone chỉ nhận thông báo khi app đã thêm
ra màn hình chính; thông báo không phải báo thức (không kêu khi máy ở
chế độ im lặng, không lặp lại). Mỗi việc có nhắc tốn ~0,1 KB trên máy
chủ và bị xoá 30 ngày sau khi gửi.

## 11. Trang Quản lý nội dung (CMS)

**Quyết định 25/10 · sửa ngay trên app:** không làm giao diện quản trị
riêng. Tài khoản quản trị có công tắc "Sửa nội dung app" trong Tài
khoản; bật lên, mọi chỗ sửa được hiện viền chấm vàng + bút; chạm → bảng
nhỏ chỉ có đúng ô đó, trang đổi ngay khi sửa; thanh dưới có Việc cần làm
· Xem lại · Xuất bản. Mỗi chỗ sửa được gắn data-cms="\<khoá\>" trùng
khoá trong content.\<v\>.json (ví dụ p.desc:\<product_id\>, h.banner,
h.need:0); tên, giá, size gắn data-lock và chỉ báo "sửa trong POS".
Demo: app_kh_demo.html sau patch32 (patch31–32 rà soát phủ toàn bộ chỗ
sửa, xem 11.1; video món, xem 11.2). Phần dưới đây là nội dung quản lý,
xử lý ảnh và xuất bản — vẫn giữ nguyên, chỉ đổi chỗ thao tác.

**11.1 Danh mục chỗ sửa (rà soát 25/10, patch31–32).** Mọi chữ, ảnh và
nút do quán tự quyết đều có bút sửa; mọi thứ thuộc về tiền, luật hoặc dữ
liệu từng khách đều khoá và có câu giải thích riêng.

| Trang                                                                                               | Sửa được (khoá trong content)                                                                                                                                                                                                                                                                                                        | Khoá (nguồn)                                                                                                 |
|-----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| Trang chủ                                                                                           | Banner: ảnh + tiêu đề h.banner, dòng nhỏ t:home.bk, nút b:home.bb; dòng dưới lời chào t:home.sub; chữ ô Giờ vàng t:home.gvk; ô Trắc nghiệm t:home.qk, t:home.qh; tiêu đề + lưu ý nhu cầu t:home.needs, t:home.disc; 6 ô nhu cầu h.need:\<i\>; món nổi bật h.featured; "Xem tất cả" b:home.fmore; Mời bạn bè t:home.refb, t:home.refs | Lời chào (tự đổi theo giờ + xưng hô); thẻ hội viên (POS); thẻ lịch (tự tính); giờ, %, món Giờ vàng (POS)     |
| Menu                                                                                                | Khối Giờ vàng: tiêu đề t:gv.title, lưu ý t:gv.note; hướng dẫn Topping t:top.note; ảnh topping tp.img:\<topping_id\>                                                                                                                                                                                                                  | Tên danh mục, giá topping, còn hàng (POS)                                                                    |
| Thẻ món, trang món                                                                                  | Ảnh p.img, mô tả p.desc, thành phần p.ingr, nhãn p.tags, video p.video (theo product_id)                                                                                                                                                                                                                                             | Tên, giá, size, topping (POS)                                                                                |
| Ưu đãi                                                                                              | Banner img:rw.ban + t:rw.bk, t:rw.bh + nút b:rw.ban; tiêu đề mục t:rw.h0, t:rw.h1; Sưu tập Tứ Quý t:rw.tqt, t:rw.tqs, tên con dấu t:rw.s\<0..3\> (+ dòng nhỏ t:rw.s\<i\>s); ảnh quà img:rw.g\<i\>                                                                                                                                    | Hạng, điểm, ví (POS); voucher (POS phát cho từng khách); tên + điểm quà (POS); số con dấu của khách (tự đếm) |
| Mua thẻ, Đổi quà, Thẻ quà, Giới thiệu bạn bè                                                        | t:bc.note; ảnh quà img:rd.g\<i\>; t:gc.t, t:gc.s; t:rf.h, t:rf.s                                                                                                                                                                                                                                                                     | Hạng, giá, quyền lợi; tên + điểm quà; mệnh giá; mã mời + số liệu (POS)                                       |
| Lịch, Trắc nghiệm, Hỗ trợ, Màn mở                                                                   | Lời khuyên tiết khí t:term.\<0..23\>; t:tc.h, t:tc.s, t:tc.p1, t:tc.by; t:sp.1t … t:sp.4s; khẩu hiệu t:brand.slogan                                                                                                                                                                                                                  | Ngày, âm lịch (tự tính); câu hỏi + chấm điểm (tệp quiz)                                                      |
| Giỏ hàng, thanh toán, theo dõi đơn, lịch sử đơn, ví, địa chỉ, tài khoản, hồ sơ, gia đình, thông báo | —                                                                                                                                                                                                                                                                                                                                    | Toàn bộ là dữ liệu giao dịch / cá nhân; thanh sửa báo "Trang này không có chữ/ảnh để sửa"                    |

**Kiểu khoá:** t:\<khoá\> = chữ thuần (Enter = xuống dòng; app escape
HTML khi hiển thị) · b:\<khoá\> = nút {label, dest}, dest là cat:\<danh
mục\>, p:\<product_id\> hoặc mã màn · img:\<khoá\> = ảnh nội dung (cắt +
nén trên máy như ảnh món) · p.\* theo product_id, tp.img theo
topping_id, h.\* trang chủ. Chỗ khoá gắn data-lock="\<lý do\>" (pos, gv,
cat, auto, greet, voucher, gift, tier, tq, gc), mỗi lý do một câu giải
thích. Khoá không có trong content → app dùng chữ/ảnh mặc định trong mã.

**Thanh "Đang sửa":** nổi trên thanh tab; khi bật, mỗi trang thêm đệm
cuối 170 px để cuộn qua phần bị che; nút ▾ thu thành nút tròn ✎ có số
thay đổi. Nút video luôn là nút riêng, không nằm trong vùng ảnh (trước
patch32 bấm ▶ trên thẻ món mở nhầm chụp ảnh).

**Quy tắc bắt buộc (chủ quán dặn 26/10):** chế độ sửa luôn cập nhật cùng
thiết kế. Mọi chữ, ảnh mới hiện cho khách phải có data-cms (sửa được)
hoặc data-lock (khoá, kèm lý do: pos, gv, cat, tier, combo, auto, user,
ui…). Kiểm tra tự động: hàm cmsAudit(màn) liệt kê chữ/ảnh đang hiện mà
chưa thuộc chỗ nào; bài test chạy qua mọi màn, danh sách phải rỗng thì
mới nhận bản vá (demo patch37: Trang chủ, Menu, Combo, Hạng, Ưu đãi,
Lịch đều rỗng). Chữ giao diện cố định dùng khoá ui (không viền trong chế
độ sửa).

**Nhãn món (nhu cầu, thể chất):** là nội dung của quán, sửa bằng chế độ
sửa (p.tags:\<product_id\> → content.products.\<id\>.needs và .types):
chạm hàng nhãn trên thẻ món hoặc trang món → bật/tắt 6 nhóm nhu cầu và 9
thể chất. Danh sách 6 nhu cầu và 9 thể chất cố định theo dữ liệu trắc
nghiệm; POS không giữ nhãn (chỉ đọc khi gợi ý món ở quầy).

**Ẩn / hiện mục (patch38, chủ quán yêu cầu 26/10).** Trong chế độ sửa
mỗi mục có thanh nhỏ "Tên mục · Ẩn mục này" ngay phía trên (ô nhỏ trong
lưới: nút "Ẩn" ở góc dưới phải). Mục ẩn: khách không thấy (display:none
sau khi xuất bản), người sửa vẫn thấy mờ, viền chấm xám + "Đang ẩn ·
Hiện lại". Ẩn một ô ở hàng 2 ô thì ô còn lại tự giãn hết hàng. Danh mục
bị ẩn ở Menu thì cả nhóm món đó cũng ẩn trong "Tất cả". Khoá sec:\<mục\>
lưu trong content.hidden = \["home.ref", …\], có trong Xem lại / Xuất
bản / Bỏ như mọi thay đổi; Việc cần làm liệt kê mục đang ẩn để hiện lại.
Danh mục mục: Trang chủ (home.guide, home.member, home.cal, home.hb,
home.gv, home.quiz, home.needs, home.feat, home.ref) · Ưu đãi (rw.ban,
rw.tier, rw.tq, rw.wal, rw.vou, rw.gift) · ô Menu (cat.\<mã danh mục\>,
gồm gv, combo, top, all) · ô Tiện ích (tool.\<mã\>) + dải Sắp tới
(lich.up) · dòng Tài khoản (acc.\<màn đích\>) · bảng so sánh hạng
(tier.cmp). Thiết kế mới có khối lớn phải thêm vào danh sách SECS.

**Phủ kín chế độ sửa (patch38).** cmsAudit(màn) = \[\] trên MỌI màn
(Trang chủ, Menu, trang món, Combo, Giỏ, Thanh toán, Theo dõi đơn, Ưu
đãi, Tài khoản, Hồ sơ, Gia đình, Lịch sử đơn, Ví, Hạng, Đổi quà, Địa
chỉ, Thẻ quà, Thông báo, Hỗ trợ, Lịch, 6 tiện ích, Trắc nghiệm 3 màn,
Giới thiệu bạn bè). Thêm chỗ sửa: dưỡng sinh 4 giai đoạn chu kỳ
t:cyc.\<0..3\>, lưu ý văn khấn t:vk.note1/note2, lưu ý trắc nghiệm
t:tc.disc, thẻ Kế hoạch t:home.cala/calb. Màn dữ liệu giao dịch/cá nhân
khoá theo màn (SCREEN_LOCK: order, user, ui); trang món khoá danh mục
(cat), size/giá/tên topping (1 = POS), nhãn chọn (ui); 9 thể chất ở trắc
nghiệm khoá quiz (lấy từ tệp quiz). Khoá loại ui, user, order, nav KHÔNG
chặn bấm khi đang sửa (LOCK_PASS) để người sửa vẫn đi lại trong app bình
thường; khoá pos, gv, cat, tier, combo, quiz, auto vẫn báo lý do khi
chạm. patch39: nút / liên kết nằm bên trong vùng khoá (ví dụ "Quyền lợi
& nâng hạng" trong thẻ hạng ở Ưu đãi) vẫn bấm được khi đang sửa; khoá
chỉ chặn chạm vào chính vùng đó. Bài test chế độ sửa phải đi bằng thao
tác bấm thật từ Tài khoản › Sửa nội dung app.

**11.2 Video giới thiệu món (YouTube, chủ quán chốt 25/10).** Video nằm
trên YouTube; app chỉ lưu mã video 11 ký tự trong
content.products.\<id\>.video, nên không tốn dung lượng R2 hay băng
thông.

- **Nhập:** dán link (youtube.com/shorts/, youtu.be/, watch?v=, embed/,
  live/) → tách mã bằng regex, mã hợp lệ khớp ^\[\w-\]{11}\$. Khi xuất
  bản, API App KH kiểm qua oEmbed
  https://www.youtube.com/oembed?url=\<link\>&format=json: 200 = nhúng
  được; 401/404 = riêng tư, đã xoá hoặc tắt nhúng → chặn mục đó, báo chủ
  quán.

- **Lưu:** "video": {"yt": "\<mã 11 ký tự\>"} (dạng đối tượng để sau này
  thêm {"r2": …} mà không đổi app).

- **Xem:** thẻ món có nút ▶ riêng; trang món có "▶ Xem giới thiệu" trên
  ảnh. Trình xem toàn màn hình dùng iframe
  https://www.youtube-nocookie.com/embed/\<id\>?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=\<id\>,
  chỉ tạo khi bấm và gỡ khi đóng; thanh "Đặt món này" nằm dưới video,
  không đè.

- **Ảnh bìa** (chế độ sửa, Xem lại):
  https://i.ytimg.com/vi/\<id\>/hqdefault.jpg.

- **PWA:** không cache video trong service worker; mất mạng → bấm ▶ báo
  "Cần mạng để xem video". CSP mở frame-src cho youtube-nocookie (mục
  8.4).

- **Nghe giới thiệu** (món chưa có video hoặc khách thích nghe):
  speechSynthesis giọng vi-VN đọc tên + mô tả + thành phần; máy không có
  giọng tiếng Việt → giọng mặc định + báo. Không tốn dung lượng.

- **Hướng dẫn trong màn sửa:** quay dọc 15–45 giây (nguyên liệu → pha
  chế → ly thành phẩm, có chữ trên hình), đăng kênh quán ở chế độ Không
  công khai, dán link. Việc cần làm có chuỗi "Gắn video cho N món".

- **Rủi ro:** YouTube có thể chèn quảng cáo; rel=0 chỉ giới hạn gợi ý
  cuối video về kênh quán. Nếu cần video không quảng cáo → chuyển từng
  món sang R2 (MP4 nén 3–5 MB + ảnh bìa) qua khoá r2.

**Video hướng dẫn dùng app (patch33).** Một video chính 45–60 giây hiện
thành thẻ "Xem cách dùng app trong 60 giây" ngay dưới lời chào ở Trang
chủ, chỉ với khách chưa xem; bấm ✕ hoặc xem xong thì ẩn (ghi cờ trên
máy). Không tự bật video khi mở app. Luôn có ở Tài khoản › Hỗ trợ ›
Video hướng dẫn: 5 video ngắn (đặt món, trả bằng ví + PIN, Giờ vàng,
trắc nghiệm, lịch & tiện ích). Khoá nội dung v:guide.main, v:gd.order,
v:gd.wallet, v:gd.gv, v:gd.tc, v:gd.lich → content.videos (mã YouTube);
tiêu đề t:guide.t, t:guide.s, t:gdt.\<khoá\>.

**11.3 Banner chương trình hôm nay (patch36, chốt 26/10).** Mỗi ngày tối
đa 1 chương trình, chủ quán đặt lịch trước trong content.promos =
\[{from, to, title, sub, cta:{label, dest}, img}\]; app chọn mục có hôm
nay nằm trong \[from, to\]. Không có → Trang chủ hiện banner thường.

- **Chỗ hiện:** thay banner lớn Trang chủ (dòng nhỏ tự ghi "HÔM NAY ·
  THỨ … dd/mm"); dạng 1 dòng đầu trang Lịch và mọi màn tiện ích. Nút ✕ ở
  Trang chủ ẩn bản 1 dòng đến hết ngày (cờ trên máy).

- **Hiệu ứng (đã duyệt):** ánh sáng lướt chéo từ góc dưới trái lên góc
  trên phải, 2 giây/lượt, chạy liên tục; ánh sáng đi tới đâu thì chữ,
  nút, hoạ tiết ở đó sáng lên, nền chỉ một dải sáng rất nhẹ. Cách làm:
  biến CSS --p (0→1, khai báo @property) chạy trên banner; mỗi chi tiết
  .gl tính vị trí vệt sáng từ --p và toạ độ của nó (--ox, --oy, --W,
  --H, đo bằng JS khi hiển thị và khi đổi kích thước); chữ dùng
  background-clip:text, nút dùng gradient nền, ảnh dùng lớp
  mix-blend-mode:color-dodge phủ cả khung ảnh. Đổi chữ, đổi ảnh vẫn
  khớp. Tắt khi máy bật giảm chuyển động; tắt trong chế độ sửa để dễ
  đọc.

- **Chế độ sửa:** t:today.t, t:today.s, b:today.cta (chữ + trang đích),
  img:today.bg (ảnh nền ngang 2:1, chủ thể bên phải; để trống = dùng ảnh
  banner Trang chủ; patch37: ánh sáng làm ảnh ánh lên khắp khung, lớp
  phủ màu mận bên trái giữ chữ dễ đọc); Việc cần làm có nút bật/tắt
  banner.

**11.4 Trang chủ: Bán chạy nhất \| Ưu đãi nhiều nhất.** Thay khối "Món
nổi bật" (khoá h.featured bỏ). Hai lựa chọn đứng cạnh nhau, app nhớ lựa
chọn của khách. Bán chạy: 4 món nhiều ly nhất 7 ngày (POS tính trong
daily_stats, trả trong bootstrap.best), chỉ hiện thứ hạng \#1–#4, không
hiện số ly đã bán (chủ quán chốt 26/10, patch38). Ưu đãi: combo + món
Giờ vàng còn suất, xếp theo số tiền khách tiết kiệm ở đúng hạng của
khách (tính trên máy).

**11.5 Thẻ Kế hoạch và nhắc việc trên Trang chủ (patch38).** Cạnh ô ngày
thêm dòng "Trợ lý của bạn" và nhãn xanh "Miễn phí" để khách hiểu đây là
công cụ miễn phí (chủ quán chốt 26/10, đổi sau nếu cần). Sửa được:
t:home.cala, t:home.calb; ẩn cả thẻ bằng home.cal.

CMS tự làm, tiếng Việt, dùng tốt trên điện thoại; sửa xong bấm **Xuất
bản** → sinh một tệp content.\<v\>.json mới trên R2, khách thấy ở lần mở
app kế tiếp. Không dùng Strapi/Directus vì phải thuê thêm máy chủ và cơ
sở dữ liệu.

| Mục                      | Nội dung quản lý                                                                                                                                                             | Gắn với                                                                        |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| Món & topping            | Ảnh (nhiều ảnh/món), mô tả, thành phần, nhóm nhu cầu, nhãn hợp thể chất, thứ tự, món nổi bật, video giới thiệu (link YouTube)                                                | product_id, topping_id của POS (danh sách đọc từ POS, không tạo món mới ở CMS) |
| Trang chủ                | Banner (có lịch theo mùa/tiết khí), món nổi bật, ảnh ô Giờ vàng, 6 ô nhu cầu, mọi câu chữ và nút (chữ + trang đích)                                                          | —                                                                              |
| Trang nội dung           | Giới thiệu quán, chính sách giao hàng/đổi trả, câu hỏi thường gặp, câu miễn trừ                                                                                              | —                                                                              |
| Dưỡng sinh theo tiết khí | Lời khuyên + món gợi ý cho 24 tiết                                                                                                                                           | product_id                                                                     |
| Trắc nghiệm              | Tải lên bản dữ liệu JSON mới (kiểm cấu trúc trước khi nhận), bảng ghép món theo thể chất, xem góp ý, thống kê thể chất ẩn danh                                               | quiz.\<v\>.json, product_id                                                    |
| Mẫu thông báo            | Câu chữ cho Giờ vàng, sinh nhật, đơn hàng; gửi tin khuyến mãi (tối đa 1/tuần)                                                                                                | Loại tin mục 10                                                                |
| Thương hiệu              | Logo, âm thanh màn mở, câu chữ chung (khẩu hiệu, lời chào)                                                                                                                   | —                                                                              |
| Ưu đãi & trang phụ       | Banner Ưu đãi (ảnh, chữ, nút + trang đích), tiêu đề mục, Sưu tập Tứ Quý (tên, câu, tên con dấu), ảnh quà đổi điểm; câu chữ Mua thẻ hội viên, Thẻ quà tặng, Giới thiệu bạn bè | Mã quà (gift_id) của POS cho ảnh quà                                           |

**Xử lý ảnh khi tải lên:** nhận JPG/PNG/WebP/HEIC ≤ 10 MB → xoay đúng
chiều, xoá thông tin EXIF (vị trí GPS) → cắt và xuất 3 cỡ WebP (256,
640, 1080 px, chất lượng ~80) → đặt tên theo mã băm nội dung → lưu R2.
Ảnh gốc giữ riêng ở thư mục không công khai để làm lại khi cần. Cùng quy
trình với process_assets.py đã có.

**Xuất bản và quay lại:** mỗi lần xuất bản lưu nguyên bản vào
cms_versions; nút "Quay lại bản trước" chỉ là xuất bản lại phiên bản cũ
với số mới. Trước khi xuất bản: kiểm mọi product_id còn tồn tại ở POS,
mọi ảnh đã lên R2, tệp ≤ 80 KB. Khung xem trước hiện đúng thẻ món /
trang món như trên app.

**Đăng nhập CMS:** email + OTP qua email hoặc Zalo, phiên 12 giờ; vai
trò "chủ quán" và "nhân viên nội dung"; mọi thay đổi ghi audit_log. CMS
chỉ đọc danh sách món và giá từ POS để hiển thị, không có quyền ghi giá.

**Cấu trúc content.\<v\>.json (rút gọn):**

{  
"v": 42, "published_at": "2026-10-25T09:00:00+07:00",  
"products": { "\<product_id\>": { "img": "img/9f3a…", "desc": "…",
"ingredients": "…",  
"needs": \["Ngủ ngon"\], "types": \["duong","dam"\], "order": 3,  
"video": { "yt": "\<mã 11 ký tự\>" } } },  
"toppings": { "\<topping_id\>": { "img": "img/…", "group": "Hoa & quả" }
},  
"gifts": { "\<gift_id\>": { "img": "img/…" } },  
"home": { "banners": \[{ "img": "img/…", "title": "Hôm nay bạn muốn uống
gì?", "from": "2026-10-23", "to": "2026-11-06" }\],  
"featured": \["\<product_id\>"\], "needs": \[{ "label": "Ngủ ngon",
"img": "img/…" }\] },  
"texts": { "home.bk": "Tứ Quý Đường", "home.gvk": "Giờ vàng", "rw.bh":
"Giờ vàng mỗi tối\ngiảm đến 50%", "term.17": "…" },  
"links": { "home.bb": { "label": "Xem Menu →", "dest": "cat:all" },
"rw.ban": { "label": "Xem món Giờ vàng →", "dest": "cat:gv" } },  
"images": { "rw.ban": "img/…" },  
"pages": { "about": "…", "shipping": "…", "faq": \[{ "q": "…", "a": "…"
}\] },  
"terms": { "\<0..23\>": { "tip": "…", "products": \["\<product_id\>"\] }
},  
"brand": { "slogan": "Sức khỏe mỗi ngày", "splash_audio": "aud/…" }  
}

texts, links, images chỉ chứa khoá đã sửa (khoá thiếu = chữ/ảnh mặc định
trong app), nên tệp vẫn ~10–30 KB nén. API kiểm khi xuất bản: khoá thuộc
danh mục 11.1, chữ ≤ 300 ký tự, dest tồn tại, mã YouTube qua oEmbed.

## 12. Dung lượng và chi phí theo quy mô

Mỗi khách tốn khoảng **1.700–3.700đ/năm**, trong đó hơn một nửa là tiền
OTP; máy chủ gần như cố định đến 10.000 khách. Giả định: 30% khách
thường xuyên (4 đơn/tháng), 70% thỉnh thoảng (1 đơn/tháng) → trung bình
~33 KB/khách/năm; 8 lần mở app/khách/tháng, ~80 dòng đọc và ~35 KB dữ
liệu API mỗi lần; 3 tin OTP/khách/năm với **giá giả định 500đ/tin (cần
báo giá thật)**; tỷ giá ~26.000đ/USD.

| Quy mô       | CSDL tăng mỗi năm | Dòng đọc / tháng | Băng thông API / tháng | Render                            | Turso    | OTP / tháng  | Tổng / tháng | Mỗi khách / năm |
|--------------|-------------------|------------------|------------------------|-----------------------------------|----------|--------------|--------------|-----------------|
| 1.000 khách  | ~33 MB            | ~0,7 triệu       | ~0,3 GB                | 7 USD                             | Miễn phí | ~125.000đ    | ~305.000đ    | ~3.700đ         |
| 10.000 khách | ~330 MB           | ~7 triệu         | ~3 GB                  | 7 USD                             | Miễn phí | ~1,25 triệuđ | ~1,43 triệuđ | ~1.700đ         |
| 50.000 khách | ~1,65 GB          | ~35 triệu        | ~14 GB                 | 25 USD + ~1,5 USD băng thông vượt | 5,99 USD | ~6,25 triệuđ | ~7,1 triệuđ  | ~1.700đ         |

So với giới hạn gói: Turso miễn phí cho 5 GB và 500 triệu dòng
đọc/tháng, gói 5,99 USD cho 9 GB; R2 miễn phí 10 GB (ảnh của quán dưới
200 MB, kể cả ảnh gốc) và không tính phí tải; Render gói Hobby kèm 5 GB
băng thông/tháng, vượt thì 0,15 USD/GB. Chưa tính: phí giao dịch PayOS,
phí GHN, tên miền.

**Ba điều giữ chi phí thấp khi lớn lên:** ảnh và giao diện luôn đi qua
CDN (nếu đi qua Render, 50.000 khách sẽ tốn hàng trăm GB băng
thông/tháng); mọi truy vấn có chỉ mục; giữ phiên đăng nhập 90 ngày và ưu
tiên Zalo Login để ít OTP. Xem lại bảng này sau 1–2 tháng chạy thật bằng
số liệu Turso và Render.

Nguồn giá: [Turso](https://turso.tech/pricing.md) · [Cloudflare
R2](https://filebase.com/blog/cloudflare-r2-pricing-costs-savings-and-alternatives-in-2026/)
· [Render](https://render.com/pricing).

## 13. Ánh xạ màn hình demo → dữ liệu và API

Mỗi màn trong app_kh_demo.html (mã màn = id của .screen) lấy dữ liệu từ
đúng một trong ba nguồn; các hằng số trong demo (PRODUCTS, GV, FAM, PIN,
NOTI, TQDQ, TQD_MENU…) là hình mẫu của dữ liệu thật.

| Màn (id)         | Dữ liệu                                                                                      | Nguồn                               | API / tệp                                                | Hằng số demo tương ứng           |
|------------------|----------------------------------------------------------------------------------------------|-------------------------------------|----------------------------------------------------------|----------------------------------|
| Màn mở           | Logo, chữ, âm thanh, khẩu hiệu                                                               | Máy khách + CMS                     | khung app, content.brand                                 | LOGO\_\*, splashAudio            |
| home             | Lời chào, hạng, điểm, ô Giờ vàng, banner, nhu cầu, món nổi bật, thể chất                     | POS + CMS                           | bootstrap, content.home                                  | CUSTOMER_TITLE, GV, TC           |
| catalog          | Món, giá, ảnh, hết hàng, Giờ vàng, topping                                                   | POS + CMS                           | menu/core, menu/stock, content.products                  | PRODUCTS, TOPPINGS, CATS, GV     |
| detail           | Giá theo size, topping, nhu cầu, hợp thể chất, video giới thiệu (YouTube), nghe giới thiệu   | POS + CMS                           | như trên                                                 | DT                               |
| cart             | Giỏ nháp, tạm tính, voucher                                                                  | Máy khách → POS                     | IndexedDB, quote                                         | CART, VOUCHER                    |
| checkout         | Cách nhận, phí GHN, ví, PIN                                                                  | POS                                 | quote, orders                                            | co, orderTotals(), PIN           |
| tracking         | Trạng thái đơn, hành trình giao                                                              | POS (+ push don)                    | orders/:id                                               | TRK                              |
| orderhistory     | Lịch sử đơn, đặt lại                                                                         | POS                                 | orders?cursor=                                           | HTML tĩnh                        |
| rewards          | Điểm, hạng, voucher, mã QR thành viên; banner Ưu đãi, câu chữ, ảnh quà (CMS)                 | POS + CMS                           | rewards                                                  | HTML tĩnh                        |
| wallet, giftcard | Số dư, sổ ví, nạp, thẻ quà                                                                   | POS                                 | wallet, wallet/topup                                     | HTML tĩnh                        |
| buycard          | Hạng thành viên: quyền lợi 3 hạng, mua thẻ Vàng 1/3 tháng, tiêu chí Kim cương                | POS                                 | orders (loại gói)                                        | HTML tĩnh                        |
| account          | Tên theo xưng hô, hạng, 3 ô nhanh, tóm tắt các mục                                           | POS + app                           | bootstrap                                                | renderAccount()                  |
| profile          | Xưng hô, tên, SĐT, email, giới tính, ngày sinh, PIN, địa chỉ, hóa đơn, xoá dữ liệu           | POS                                 | me, me/pin, quiz-result                                  | PROF, PIN                        |
| addresses        | Địa chỉ đã lưu                                                                               | POS                                 | me (trường addresses)                                    | HTML tĩnh                        |
| family           | Người thân, PIN riêng, hạn mức, yêu cầu duyệt                                                | POS                                 | family/\*                                                | FAM, FAM_REQ                     |
| notifications    | Quyền thông báo, 6 loại tin, âm thanh                                                        | App + máy khách                     | push                                                     | NOTI, NOTI_TX                    |
| lich             | Âm dương lịch, tiết khí, việc của tôi, sự kiện TQD                                           | Máy khách + app + CMS               | reminders, content.terms                                 | LUNAR, AGENDA, TQD_EV, TERM_TIPS |
| tc, tcq, tcr     | Câu hỏi, chấm điểm, kết quả, món gợi ý                                                       | CMS + máy khách (+ POS khi lưu)     | quiz.\<v\>.json, quiz-result                             | TQDQ, TQD_MENU, TC               |
| referral         | Mã giới thiệu, thưởng                                                                        | POS                                 | me (mã mời), deep link ?ref=                             | HTML tĩnh                        |
| support          | Liên hệ, Zalo OA, 5 video hướng dẫn                                                          | CMS                                 | content.pages                                            | HTML tĩnh                        |
| tool             | 8 tiện ích: theo mùa, văn khấn, sinh nhật & giỗ, ngày lễ, xe cộ, uống thuốc, chu kỳ, sắp tới | Máy khách + CMS (+ app khi có nhắc) | IndexedDB, reminders, content.texts (văn khấn, theo mùa) | TL, VK, SS, TOOLS                |
| combo            | Món trong combo, giá lẻ, giá 3 hạng, số lượng                                                | POS + CMS                           | menu/core (combos), content.products                     | COMBOS, CB, renderCombo          |

## 14. Lộ trình triển khai và checklist trước khi mở cho khách

Làm theo 5 đợt, mỗi đợt chạy được độc lập; đợt 0 là điều kiện bắt buộc
vì liên quan đến tiền đang chạy thật ở quầy.

1.  **Đợt 0 · Làm chắc POS:** vá 4 đường tài chính; tách quyền token
    khách/nhân viên; sửa lỗi tranh chấp used_count; thêm sổ ví/sổ điểm;
    thêm priceCart dùng chung; PIN băm chậm + khoá sai.

2.  **Đợt 1 · Xem và đăng nhập:** API App KH (bootstrap, menu/\*,
    auth/\*), PWA khung + Trang chủ + Menu + trang món, CDN ảnh, CMS mục
    Món & Trang chủ. Khách xem được, chưa đặt.

3.  **Đợt 2 · Đặt hàng:** giỏ, quote, orders, PayOS, GHN, theo dõi đơn,
    Giờ vàng, thông báo loại don.

4.  **Đợt 3 · Tài khoản và tiền:** hồ sơ, xưng hô, PIN, ví, nạp, điểm,
    voucher, gia đình, quà sinh nhật.

5.  **Đợt 4 · Tiện ích:** trắc nghiệm (lưu có đồng ý), Kế hoạch và Nhắc
    việc + push nhac, dưỡng sinh theo tiết khí, giới thiệu bạn bè.

**Checklist trước khi mở cho khách:**

- [ ] 4 đường tài chính POS đã khoá quyền; token khách gọi thử API nhân
  viên bị từ chối

- [ ] Thử trừ ví gửi 2 lần cùng Idempotency-Key → chỉ trừ 1 lần

- [ ] Thử 50 khách cùng giành 20 suất Giờ vàng → bán đúng 20

- [ ] Thử sai PIN 5 lần và 10 lần gộp theo tài khoản → khoá đúng, có báo

- [ ] Thử đọc đơn/ví của khách khác bằng cách đổi mã trên đường dẫn → bị
  từ chối

- [ ] Tắt POS khi app đang mở → app vẫn xem menu, nút đặt khoá có thông
  báo; quầy không bị ảnh hưởng khi API App KH hỏng

- [ ] Webhook PayOS giả mạo chữ ký → bị từ chối

- [ ] Ngân sách dung lượng mục 7 đạt (kiểm tự động khi build); mở app
  lần 2 trên 4G dưới 1 giây

- [ ] Thử trên iPhone (Safari + đã cài ra màn hình chính) và Android: âm
  thanh, thông báo, chữ màn mở rõ nét

- [ ] Sao lưu bật và đã thử khôi phục một lần

- [ ] Khoá bí mật không có trong mã và thư mục build

- [ ] Luật sư đã rà: màn đồng ý trắc nghiệm, chính sách quyền riêng tư,
  tên nhóm nhu cầu, khẩu hiệu; kế toán đã xác nhận nghĩa vụ ví nạp trước
  và hóa đơn điện tử

**Còn chờ chủ quán chốt:**

- [ ] PIN POS hiện dùng 4 hay 6 số

- [ ] Người thân có hưởng giá hội viên của chủ không

- [ ] Giờ vàng giảm trên giá món hay cả topping; có giới hạn suất/khách
  không; khung giờ thật

- [ ] Tên miền cho app (dùng chung tên miền POS hay tên miền thương hiệu
  mới)

- [ ] Nhà cung cấp OTP và giá mỗi tin

- [ ] Các đề xuất bảo mật có ảnh hưởng trải nghiệm: khoá ví 24 giờ sau
  đổi SĐT, giới hạn 200.000đ trong giờ đầu sau đặt lại PIN, giữ dữ liệu
  đơn 24 tháng

## 15. Quản lý khách hàng trong POS

Mục "Khách hàng" là chức năng con trong nhóm menu "App khách hàng" của
POS (cùng Nội dung app, Giờ vàng; dùng chung đăng nhập nhân viên). Bản
gọn 26/10: không có trang Tổng quan riêng (4 số chính nằm đầu trang
Khách hàng, việc cần xử lý là nút lọc có số đếm); bảng sắp xếp theo cột;
hồ sơ 4 thẻ (Tổng quan kèm gia đình · Ví & điểm · Đơn & voucher · Bảo
mật); mục và nút không có quyền thì ẩn hẳn (nhân viên chỉ thấy Khách
hàng; quản lý ca thêm Báo cáo, Nhật ký; chỉ chủ quán thấy Phân quyền),
làm việc chính trên máy tính, xem nhanh được trên điện thoại và máy tính
bảng. Demo: pos_khach_hang_demo.html (5 trang, đổi vai trò ở góc trên để
xem quyền).

**15.1 Các trang**

| Trang               | Nội dung                                                                                                                                                                                                                                                 | Nguồn dữ liệu                                                                           |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Tổng quan           | Tổng khách, hội viên còn hạn theo hạng, tỷ lệ quay lại 30 ngày, tổng số dư ví (nợ phải trả); biểu đồ khách mới / quay lại 12 tháng; việc cần xử lý (PIN bị khoá, thẻ sắp hết hạn, nạp ví chờ duyệt, sinh nhật tuần này); khách chi cao lâu chưa quay lại | Bảng tổng hợp ngày                                                                      |
| Khách hàng          | Tìm theo tên / SĐT / mã; lọc hạng, có ví, dùng app, sinh nhật tuần này, thẻ sắp hết hạn, lâu chưa quay lại, PIN khoá; phân trang 50 dòng; xuất CSV                                                                                                       | customers + cột tính sẵn                                                                |
| Hồ sơ khách (7 thẻ) | Thông tin + ghi chú nội bộ · Ví & điểm (sổ ví, sổ điểm, nạp/hoàn/điều chỉnh) · Đơn hàng · Voucher (phát tay) · Gia đình · Bảo mật (PIN, thiết bị, khoá tài khoản) · Nhật ký                                                                              | wallet_ledger, points_ledger, orders, vouchers, family_members, app_sessions, audit_log |
| Báo cáo             | Doanh thu hội viên, thẻ bán / gia hạn, ví nạp / tiêu / tồn, điểm phát / đổi / tồn, giữ chân theo tháng đầu mua, thể chất ẩn danh, top khách; chọn 7 ngày / 30 ngày / quý / 12 tháng; xuất Excel                                                          | Bảng tổng hợp ngày                                                                      |
| Nhật ký thao tác    | Mọi thao tác của nhân viên trên khách, lọc theo người / khách / việc                                                                                                                                                                                     | audit_log (chỉ thêm)                                                                    |
| Phân quyền          | Ma trận 16 quyền × vai trò, chỉ chủ quán sửa                                                                                                                                                                                                             | role_permissions                                                                        |

**15.2 Số liệu báo cáo:** không tính trực tiếp trên bảng đơn mỗi lần mở.
Một việc chạy lúc 02:00 ghi daily_stats (ngày, khách mới, khách quay
lại, doanh thu theo hạng/kênh, ví nạp/tiêu/tồn, điểm phát/đổi/tồn) và
cohort_month; trang Tổng quan, Báo cáo đọc từ đó (nhanh, rẻ). "Khách
quay lại" = có từ 2 đơn trong kỳ. Tổng số dư ví đối chiếu hằng ngày:
tổng sổ ví = tổng customers.wallet_balance, lệch thì báo chủ quán.

**15.3 Quyền nguyên tử (mặc định)**

| Quyền                                      | Chủ quán | Quản lý ca  | Nhân viên quầy    |
|--------------------------------------------|----------|-------------|-------------------|
| Xem danh sách khách                        | ✓        | ✓           | ✓                 |
| Xem SĐT đầy đủ (mặc định che 0931 xxx 429) | ✓        | ✓           |                   |
| Sửa thông tin khách                        | ✓        | ✓           |                   |
| Nạp ví (tiền thật đã nhận)                 | ✓        | ✓           | chờ chủ quán chốt |
| Hoàn tiền vào ví                           | ✓        | ✓           |                   |
| Điều chỉnh số dư ví                        | ✓        |             |                   |
| Cộng / trừ điểm tay                        | ✓        | ✓ (≤ 1.000) |                   |
| Phát voucher tay                           | ✓        | ✓           |                   |
| Mở khoá PIN (sau OTP khách)                | ✓        | ✓           | ✓                 |
| Đặt lại PIN tại quầy / gửi link            | ✓        | ✓           | ✓                 |
| Đăng xuất thiết bị của khách               | ✓        | ✓           |                   |
| Khoá tài khoản, đổi SĐT khi khách mất số   | ✓        |             |                   |
| Xuất danh sách / báo cáo                   | ✓        |             |                   |
| Xem báo cáo doanh thu                      | ✓        | ✓           |                   |
| Xem nhật ký thao tác                       | ✓        | ✓           |                   |
| Sửa phân quyền                             | ✓        |             |                   |

Mỗi quyền chỉ cho đúng việc đó; API kiểm quyền ở từng đường, không dựa
vào việc ẩn nút. Mỗi nhân viên một tài khoản riêng; chủ quán đăng nhập
thêm OTP; phiên nhân viên hết hạn sau 12 giờ hoặc khi đóng ca.

**15.4 Quy tắc thao tác**

- Sổ ví, sổ điểm, nhật ký: chỉ thêm dòng, không sửa, không xoá (kể cả
  chủ quán). Ghi sai → thêm dòng điều chỉnh ngược có lý do.

- Mọi nạp, hoàn, điều chỉnh, cộng/trừ điểm, phát voucher, khoá tài
  khoản: bắt buộc lý do; ghi audit_log (ai, lúc nào, khách nào,
  trước/sau, lý do); khách nhận thông báo trên app.

- Nạp trên 2.000.000đ (người khác chủ quán làm) → vào hàng chờ duyệt, ví
  chưa cộng.

- Ghi nhật ký cả việc đọc: mở hồ sơ khách, xem SĐT đầy đủ, xuất danh
  sách.

- Ngày sinh hiện ngày/tháng, ẩn năm. Thể chất chỉ hiện khi khách đã đồng
  ý lưu; báo cáo thể chất chỉ có số tổng.

- PIN: xem mục 8.2 (nhân viên không bao giờ thấy PIN).

**15.5 API POS mới** (chỉ nhân viên, token nhân viên tách hẳn token
khách): GET /admin/customers?q=&tier=&flag=&cursor= · GET
/admin/customers/:id · GET
/admin/customers/:id/{wallet,points,orders,vouchers,family,sessions,audit}
· POST /admin/customers/:id/wallet (top\|refund\|adjust, reason,
Idempotency-Key) · POST /admin/customers/:id/points · POST
/admin/customers/:id/vouchers · POST
/admin/customers/:id/pin/{otp,unlock,reset-session,reset-link} · DELETE
/admin/customers/:id/sessions · POST /admin/customers/:id/lock · GET
/admin/reports/\* · GET /admin/audit · PUT /admin/roles/:role · POST
/admin/topups/:id/approve.

**Chờ chủ quán chốt:** nhân viên quầy có được nạp ví không (demo: có,
giới hạn 2.000.000đ/lần); ngưỡng duyệt nạp ví và điều chỉnh điểm.

## 16. Tiện ích trong Kế Hoạch và Nhắc Việc

Trang Lịch có lưới 6 ô (3×2) ngay dưới thẻ ngày, tiếp theo là dải "Sắp
tới" 3 việc gần nhất (patch35; "Sinh nhật & giỗ" và "Ngày lễ" gộp thành
ô "Ngày cần nhớ" có 2 thẻ), mỗi ô mở một màn riêng (mã màn tool); cách
dùng giống nhau: xem → bấm "＋" để thêm → bật "Nhắc". Mọi phép tính ngày
(âm → dương, tiết khí, giao thừa, Thanh minh) chạy trên máy khách.

| Ô               | Làm được gì                                                                                                                                                                                                                                                                                                                                                                                                 | Lưu ở                |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| Theo mùa        | 4 mùa theo tạng (Can, Tâm, Phế, Thận): ăn, uống, sinh hoạt, tinh thần, nên hạn chế, món TQD hợp mùa; chủ quán sửa chữ (t:ss.\<mùa\>.\<mục\>)                                                                                                                                                                                                                                                                | content.texts        |
| Văn khấn        | 11 dịp: Mùng 1 & Rằm, Ông Công Ông Táo, Giao thừa, Mùng 1 Tết, Vía Thần Tài, Rằm tháng Giêng, Thanh minh, Đoan ngọ, Rằm tháng Bảy, Trung thu, Cúng giỗ. Mỗi dịp: ngày âm + dương kế tiếp, lễ vật (tích đã sắm), cách sắp, bài khấn tự điền tín chủ / địa chỉ / họ / ngày âm / năm can chi, chữ to nhỏ, đọc to, nhắc trước 1 ngày, nút đặt hoa quả dâng lễ. Chủ quán sửa mọi câu (\`t:vk.\<dịp\>.le          | cach                 |
| Sinh nhật & giỗ | Âm hoặc dương lịch, tuổi, nhắc trong ngày / 1 / 3 ngày trước; giỗ mở thẳng văn khấn giỗ đã điền tên; sinh nhật gợi ý thẻ quà                                                                                                                                                                                                                                                                                | Máy khách            |
| Ngày lễ         | Ngày lễ dương + âm sắp theo ngày gần nhất, bật nhắc từng ngày, gợi ý quà cho 8/3, 20/10, 20/11, Tết, Trung thu                                                                                                                                                                                                                                                                                              | Máy khách            |
| Xe cộ           | Nhiều phương tiện (xe máy, ô tô, xe đạp điện, khác). Mỗi xe: lịch bảo dưỡng gồm các hạng mục {tên, mỗi X km, mỗi Y tháng} (mẫu theo loại xe, thêm/sửa/xoá được; hạn = cái nào tới trước), nút "Vừa làm hôm nay", giấy tờ có hạn (bảo hiểm, đăng kiểm), nhắc khi còn 7 ngày hoặc dưới 10% quãng đường, lịch sử (ngày, km, việc, chi phí, nơi làm); ghi lần sửa có việc chọn sẵn + ô tự điền; cập nhật km tay | Máy khách            |
| Uống thuốc      | Tên, liều, 1–3 giờ uống/ngày, ghi chú, số ngày; đánh dấu đã uống, 7 ngày gần nhất                                                                                                                                                                                                                                                                                                                           | Máy khách (riêng tư) |
| Chu kỳ (nữ)     | Dự đoán kỳ tới, 4 giai đoạn + dưỡng sinh từng giai đoạn, 6 chu kỳ gần nhất, nhắc trước 2 ngày, khoá PIN, xoá sạch; ô ẩn với khách nam                                                                                                                                                                                                                                                                       | Máy khách (riêng tư) |
| Sắp tới         | Gộp 30 ngày tới từ việc của tôi, sinh nhật & giỗ, cúng, lễ, xe, chu kỳ                                                                                                                                                                                                                                                                                                                                      | Tính trên máy        |

**Nhắc việc:** PWA không tự hẹn giờ khi đóng, nên mục bật nhắc gửi lên
POST /v1/reminders dạng {id, at, title} với tiêu đề chung theo loại
("Sinh nhật của Mẹ" được, nhưng thuốc và chu kỳ chỉ gửi "Đến giờ uống
thuốc" / "Lời nhắc của bạn"). Việc lặp lại (thuốc hằng ngày, Mùng 1 &
Rằm) gửi lịch dạng rrule ngắn, máy chủ tự sinh lần kế; ngày âm lịch được
đổi sang ngày dương trên máy khách rồi gửi 12 lần kế tiếp. Mỗi khách tối
đa 200 nhắc đang chờ. Dung lượng thêm trên máy chủ ~60 byte/nhắc.

**Nội dung cần chủ quán duyệt:** văn khấn và lễ vật 11 dịp (bản demo
theo nếp cổ truyền phổ biến), dưỡng sinh theo mùa, dưỡng sinh theo giai
đoạn chu kỳ.
