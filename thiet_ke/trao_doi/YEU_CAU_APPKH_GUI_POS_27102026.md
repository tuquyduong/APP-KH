# YÊU CẦU App KH gửi chat POS — bảng đối chiếu (27.10.2026)

<!-- Chat App KH soạn. Đã soát với code POS main 40e07ce (sổ v41). Chủ quán đã duyệt các quyết định ở mục 1.
     Chat POS: đọc hết, trả lời theo mục 8 (đồng ý / vướng / khi nào làm được). Không cần làm ngay mọi thứ —
     chỉ nhóm A là xin trước 03.11 nếu kịp. -->

## 1. Quyết định chủ quán đã chốt (27.10)

1. **Tách máy chủ.** App KH chạy trên một dịch vụ Render riêng (cùng tài khoản). Đơn tạo ở quầy vẫn đi thẳng vào POS, không qua App KH.
2. **Tách kho code.** App KH nằm trong kho GitHub riêng (`app-khach-hang`). Chat App KH chỉ sửa kho đó. Mọi thứ trong kho POS — kể cả `server/routes/kh/**` — do chat POS làm.
3. **POS vẫn là nơi duy nhất giữ tiền, điểm, ví, voucher, hạng, giá, món, khách, đơn.** Máy App KH không có chìa khoá vào dữ liệu POS; muốn gì phải hỏi POS.
4. **Kho nhỏ riêng của App KH** chỉ giữ: ảnh / mô tả / banner / video (nội dung trang trí), sổ phiên đăng nhập, đăng ký nhận thông báo, việc nhắc có giờ. Không giữ tiền, điểm, giá, khách, đơn.
5. **Giao hàng dùng Ahamove** (theo GIAO-1). Demo ghi GHN là nhầm.
6. **Mọi con số (giá, % hạng, giá thẻ, Giờ vàng) lấy từ POS.** Số trong demo chỉ là số minh hoạ.
7. **Kết quả trắc nghiệm thể trạng:** chủ quán muốn quản lý, theo dõi được → lưu bản rút gọn ở POS khi khách đồng ý (xem D4).
8. Thư mục `app_kh/` trong kho POS: **giữ chạy nguyên trạng cho khai trương 03.11, không sửa**. Gỡ sau khi App KH mới chạy ổn trên máy riêng.

## 2. Kết nối hai bên

```
Đợt 1 (đến 03.11):   Điện thoại khách ──► POS /api/kh  (như hiện nay, app mới đặt ở chỗ chứa trang tĩnh)
Từ đợt 2 (sau 03.11): Điện thoại khách ──► Máy App KH ──(khoá dịch vụ)──► POS /api/kh
Quầy (mọi lúc):       Nhân viên ──► POS
```

Từ đợt 2, trình duyệt khách **không gọi thẳng POS nữa**. POS chỉ nhận lời từ máy App KH có khoá dịch vụ.

## 3. Kết quả soát code POS (main 40e07ce) — những gì đã có / chưa có

| Mục | POS hiện có | Khớp demo? |
|---|---|---|
| Mã đăng nhập | 6 số, lưu dạng băm, giới hạn thử theo SĐT + IP | Khớp |
| PIN khách | 4 số, sai 5 lần khoá 15 phút (`pinKhach.js`) | Khớp |
| Hồ sơ khách (`pos_customers`) | Có: tên, SĐT, email, địa chỉ, PIN, QR, `parent_phone` | **Thiếu:** xưng hô, giới tính, ngày sinh, thông tin xuất hoá đơn |
| `/api/kh/toi` trả về | Chỉ SĐT, tên, ngày tạo, QR | Thiếu hạng, số dư ví, email, địa chỉ |
| `/api/kh/menu` trả về | Mã, tên, nhóm, giá, còn hàng | Thiếu giá theo hạng, topping |
| Hạng (`pos_membership_tiers`) | 2 hạng Vàng / Bạch Kim, có % và giá thẻ; lên hạng bằng mua thẻ | Khớp cách làm (số liệu theo POS) |
| Giờ vàng (`flashState.js`) | Bật/tắt, giờ bắt đầu–kết thúc, **một mức % chung**, danh sách món | **Thiếu:** % riêng từng món, số suất có hạn |
| Topping | Chưa có ở máy chủ (TOPPING-1 đang mở) | Chưa |
| Giá hạng hiển thị | UUDAI-1 đang mở | Chưa |
| Combo | COMBO-1a/1b đang mở | Chưa |
| Giao Ahamove | Chưa có code (GIAO-1 đang mở) | Chưa |
| payOS | Có (P3): phiên, chốt, huỷ, xác nhận tay | Có cho quầy; chưa có cửa cho app |
| Đổi điểm lấy quà | Có ở quầy (`loyalty/redeem`) | Chưa mở cho app |
| Ví | Có số dư + lịch sử (`wallets.js`) | Chưa mở cho app |
| Trạng thái đơn | Chỉ chờ / xong / huỷ | Thiếu các bước để khách theo dõi |
| Gia đình | Có `parent_phone` (một người mua cho nhiều người) | Thiếu PIN riêng người thân, hạn mức, duyệt |
| Cửa máy chủ cho trình duyệt (CORS) | `origin: '*'` — mọi trang web đều gọi được | **Nên thu hẹp** (A6) |

## 4. Bảng chức năng App KH (đối chiếu)

Ký hiệu: ✅ POS có, app hỏi được ngay · 🟡 POS có dữ liệu, chưa mở cửa cho app · ❌ POS chưa có · 📱 chạy trên điện thoại, không cần POS · 🗂 nội dung trang trí, lưu ở kho App KH. Cột "Yêu cầu" chỉ tới mục 5.

Đợt: **1** = trước 03.11 (KH-UI-2) · **2** = KH-TACH-1 (sau 03.11) · **3** = đặt đơn trên app (cùng KH-MUA-1) · **4** = làm dần.
Đợt 1: mục nào POS chưa kịp mở cửa thì app **ẩn mục đó**, không hiện số sai.

### 4.1 Mở app, đăng nhập
| Khách làm được gì | Tình trạng | Yêu cầu | Đợt |
|---|---|---|---|
| Màn mở "Mái đình" + âm thanh | 📱 | — | 1 |
| Đăng nhập SĐT + mã 6 số (tạm lấy mã ở quầy) | ✅ | — | 1 |
| Quét QR hoá đơn → đăng ký, mã điểm điền sẵn | ✅ | — | 1 |
| Nhớ đăng nhập 30 ngày, xem thiết bị, đăng xuất máy khác | Làm ở kho App KH | B1–B3 | 2 |
| Mã qua Zalo | ❌ | D8 | 4 |

### 4.2 Trang chủ
| Khách làm được gì | Tình trạng | Yêu cầu | Đợt |
|---|---|---|---|
| Lời chào theo xưng hô | ❌ chưa có ô xưng hô | B6 | 2 (đợt 1 chào bằng tên) |
| QR thành viên để quầy quét | ✅ | — | 1 |
| Thẻ hội viên thu nhỏ (hạng, điểm) | 🟡 điểm có, hạng chưa trả | A1 | 1 |
| Ô Giờ vàng đếm ngược | 🟡 | A3 | 1 |
| Banner, 6 ô "Chăm sóc theo nhu cầu", món nổi bật | 🗂 | — | 1 |
| Mời bạn bè có thưởng | ❌ | D5 | 4 |

### 4.3 Menu, trang món
| Khách làm được gì | Tình trạng | Yêu cầu | Đợt |
|---|---|---|---|
| 5 nhóm món, còn / hết hàng | ✅ | — | 1 |
| Giá thường gạch ngang + giá Vàng + giá Bạch Kim | 🟡 chờ UUDAI-1 | A5 | 1 nếu UUDAI-1 kịp |
| Giờ vàng: giá giảm, ngoài giờ báo giờ bắt đầu | 🟡 | A3 | 1 |
| Giờ vàng: % riêng từng món, "còn N suất" | ❌ | D2 | 4 |
| Topping theo từng món | ❌ chờ TOPPING-1 | C8 | 3 |
| Combo | ❌ chờ COMBO-1a/1b | C8 | 3 |
| Ảnh, mô tả, thành phần, video món | 🗂 | — | 1 |

Giá trên app chỉ để xem. **Giá thật do POS tính lúc đặt**, bằng đúng hàm quầy đang dùng.

### 4.4 Ưu đãi, hạng
| Khách làm được gì | Tình trạng | Yêu cầu | Đợt |
|---|---|---|---|
| Điểm + lịch sử điểm | ✅ | — | 1 |
| Voucher của tôi | ✅ | — | 1 |
| Nhập mã trên hoá đơn nhận điểm | ✅ | — | 1 |
| Màn Hạng thành viên: quyền lợi, giá thẻ | 🟡 | A2 | 1 |
| Đổi điểm lấy quà trên app (cần PIN) | 🟡 quầy có | C7 | 3 |
| Mua thẻ hạng trên app (trả payOS) | ❌ | C7 | 3 |
| Quà sinh nhật | ❌ | D3 | 4 |

### 4.5 Ví, PIN
| Khách làm được gì | Tình trạng | Yêu cầu | Đợt |
|---|---|---|---|
| Số dư + lịch sử ví của mình | 🟡 | A4 | 1 |
| Đặt / đổi PIN | ✅ | — | 1 |
| Quên PIN (xác minh lại bằng mã) | ❌ | B4 | 2 |
| Nạp ví bằng QR payOS | ❌ | C7 | 3 |
| Chuyển điểm sang ví | ❌ chưa chốt có làm không | D5 | 4 |
| Thẻ quà tặng điện tử | ❌ chưa chốt có làm không | D5 | 4 |

### 4.6 Giỏ, đặt đơn, giao hàng
| Khách làm được gì | Tình trạng | Yêu cầu | Đợt |
|---|---|---|---|
| Giỏ hàng | 📱 | — | 3 |
| Xem giá thật trước khi trả | ❌ | C1 | 3 |
| Trả QR payOS hoặc ví + PIN | ❌ | C2, C3 | 3 |
| Đơn chỉ về quầy khi đã trả, quầy kêu chuông | ❌ | C4 | 3 |
| Nhận tại quầy / giao Ahamove (thấy phí ship) | ❌ chờ GIAO-1 | C5 | 3 |
| Theo dõi đơn | ❌ thiếu trạng thái | C4, D7 | 3 |
| Huỷ đơn | ❌ chưa có luật | C6 | 3 |
| Sổ địa chỉ giao | ❌ (POS có 1 ô địa chỉ) | C9 | 3 |

### 4.7 Gia đình (đợt 4)
| Khách làm được gì | Tình trạng | Yêu cầu |
|---|---|---|
| Thêm người thân: tên + PIN riêng + hạn mức | ❌ | D1 |
| Duyệt khi vượt hạn mức, báo mỗi lần mua, xem ai tiêu bao nhiêu | ❌ | D1 |

### 4.8 Tài khoản
| Khách làm được gì | Tình trạng | Yêu cầu | Đợt |
|---|---|---|---|
| Sửa họ tên | ✅ | — | 1 |
| Email, địa chỉ | 🟡 POS có ô, chưa mở | A1 | 1 |
| Xưng hô, giới tính, ngày sinh, thông tin xuất hoá đơn | ❌ | B6 | 2 |
| Lịch sử đơn (quầy + app) | ✅ | — | 1 |
| Hỗ trợ: gọi, Zalo | 📱 | — | 1 |
| Xoá tài khoản (Nghị định 13) | ❌ | B5 | 2 |
| Đổi SĐT | ❌ | D6 | 4 |
| Thông báo & âm thanh | Kho App KH + D7 | D7 | 4 |

### 4.9 Sức khoẻ, tiện ích (📱, đợt 4)
Trắc nghiệm 60 câu, lịch âm, tiết khí, "Việc của tôi", 6 tiện ích — chạy trên điện thoại. Lưu kết quả trắc nghiệm để quán theo dõi: D4. Nhắc việc có giờ: kho App KH.

### 4.10 Chế độ sửa nội dung (đợt 4)
Chủ quán sửa chữ, ảnh, banner, ẩn/hiện mục ngay trên app; lưu ở kho App KH. Cần POS xác nhận "người này là chủ quán": D9.

## 5. Yêu cầu cụ thể cho chat POS

### Nhóm A — nhỏ, chỉ đọc, xin trước 03.11 nếu kịp (không kịp thì app ẩn mục)
- **A1. Hồ sơ đủ hơn.** `/api/kh/toi` trả thêm: hạng hiện tại (tên, % giảm, hạn thẻ nếu có), số dư ví, email, địa chỉ. Dùng lại `membershipStatus.js`, không viết cách tính mới.
- **A2. Danh sách hạng.** Cửa mới, ví dụ `GET /api/kh/hang`: tên, % giảm, giá thẻ, thứ tự, mô tả quyền lợi (nếu POS có). Chỉ hạng đang bật.
- **A3. Giờ vàng hôm nay.** Cửa mới, ví dụ `GET /api/kh/gio-vang`: đang bật, giờ bắt đầu, giờ kết thúc, %, danh sách mã món, đang trong giờ không, giờ máy chủ. Dùng lại `readFlashState`. Không cần đăng nhập cũng được (thông tin công khai).
- **A4. Ví của tôi.** Cửa mới, ví dụ `GET /api/kh/vi`: số dư + lịch sử giao dịch **chỉ của khách đang đăng nhập** (SĐT lấy từ token, không lấy từ yêu cầu). Không trả tên nhân viên, ghi chú nội bộ.
- **A5. Giá theo hạng trong menu.** Sau khi UUDAI-1 xong: menu trả thêm giá từng hạng, **tính bằng đúng hàm quầy** để làm tròn giống hệt hoá đơn.
- **A6. Thu hẹp CORS.** Đổi `origin: '*'` thành danh sách: địa chỉ POS + địa chỉ app mới (chủ quán báo khi có). Kiểm lại quầy vẫn chạy.
- **A7. Ranh giới.** Ghi vào luật / sổ: `app_kh/` trong kho POS đóng băng; App KH mới làm ở kho `app-khach-hang`.

### Nhóm B — cho KH-TACH-1 (sau 03.11)
- **B1. Khoá dịch vụ.** `/api/kh` nhận lời từ máy App KH bằng một khoá dịch vụ riêng (biến môi trường trên Render, không trong code), kèm mã khách. Khi App KH mới chạy ổn → tắt lối trình duyệt gọi thẳng.
- **B2. Xác minh mã đăng nhập vẫn ở POS.** POS kiểm mã, trả mã khách; máy App KH tự tạo phiên (sổ phiên ở kho App KH).
- **B3. Khoá tài khoản.** POS có trạng thái "khoá tài khoản app"; mọi lời hỏi về khách bị khoá → POS từ chối, máy App KH đăng xuất mọi thiết bị.
- **B4. Quên PIN.** Đặt lại PIN sau khi khách xác minh mã mới (dùng `pinKhach.js`), ghi nhật ký.
- **B5. Xoá tài khoản theo yêu cầu.** Xoá / ẩn thông tin cá nhân; đơn và sổ tiền giữ lại ở dạng ẩn danh (sổ tiền không được xoá). Số dư ví còn lại xử lý thế nào: chủ quán chốt.
- **B6. Thêm ô hồ sơ.** Xưng hô, giới tính, ngày sinh (khách tự sửa 1 lần / năm), thông tin xuất hoá đơn.

### Nhóm C — đặt đơn trên app (KH-MUA-1 phần POS, GIAO-1, và liên quan)
- **C1. Cửa tính giá cho app.** Nhận giỏ (mã món, số lượng nguyên, topping, combo, mã/quà) → trả từng dòng, các khoản giảm, tổng, điểm dự kiến. Dùng **đúng hàm quầy**; không tin giá app gửi.
- **C2. Cửa tạo đơn app.** Có mã chống trùng (bấm 2 lần không tạo 2 đơn); tính lại giá; giữ giá Giờ vàng trong thời gian chờ trả; tạo phiên payOS; quá hạn chưa trả thì tự huỷ. **Đơn chưa trả không về quầy.**
- **C3. Trả bằng ví + PIN.** Không cho số dư âm; theo luật ví gia đình khi có D1.
- **C4. Đơn về quầy + trạng thái.** Có chuông ở quầy. Thêm bước để khách theo dõi, đề xuất: chờ trả → đã trả, chờ pha → đang pha → xong, chờ lấy / đang giao → hoàn tất · huỷ.
- **C5. Giao Ahamove (GIAO-1).** App hỏi phí ship qua POS (khoá Ahamove chỉ ở máy chủ); khách trả đúng phí Ahamove báo; chuyển khoản trước, quầy xác nhận rồi mới gọi xe; không COD.
- **C6. Huỷ đơn app.** Chủ quán chốt: khách được huỷ đến bước nào; tiền hoàn về đâu (ví hay hoàn qua ngân hàng).
- **C7. Nạp ví, mua thẻ hạng, đổi điểm từ app.** Nạp ví và mua thẻ qua payOS; đổi điểm cần PIN. Mua thẻ tích điểm theo tiền thực trả (đã chốt 16.10).
- **C8. Topping, combo cho app.** Mở qua `/api/kh` sau TOPPING-1, COMBO-1a/1b.
- **C9. Sổ địa chỉ giao.** POS lưu nhiều địa chỉ cho một khách (thay cho một ô `address`).

### Nhóm D — làm dần
- **D1. Ví gia đình** (đã chốt giữ 27.10): người thân = tên + PIN riêng + hạn mức trên tài khoản chủ; ở quầy đọc SĐT chủ + PIN riêng; trừ ví chủ, điểm về chủ; vượt hạn mức → chủ duyệt trên app (tắt = chặn); báo mỗi lần mua; lịch sử ai tiêu bao nhiêu. Chưa chốt: người thân có được giá hạng của chủ không.
- **D2. Giờ vàng đầy đủ.** % riêng từng món, số suất mỗi ngày, đếm suất, hết suất về giá thường; giá Giờ vàng không cộng giảm hạng, không dùng voucher.
- **D3. Quà sinh nhật.** Danh sách sinh nhật tuần / tháng, luật tặng quà tự động, lịch sử.
- **D4. Kết quả trắc nghiệm.** Chỉ lưu khi khách bấm đồng ý: nhóm thể trạng chính / phụ, ngày làm, phiên bản bộ câu hỏi (không lưu 60 câu trả lời chi tiết). Xem trong POS theo quyền (mặc định chỉ chủ quán), có thống kê theo nhóm; khách xoá được bất cứ lúc nào. Dữ liệu sức khoẻ — cần luật sư rà trước khi chạy thật.
- **D5. Chủ quán chốt có làm không:** thẻ quà tặng điện tử, mời bạn bè có thưởng, chuyển điểm sang ví.
- **D6. Đổi SĐT** (xác minh mã ở cả số cũ lẫn số mới).
- **D7. Báo đổi trạng thái đơn.** POS báo cho máy App KH khi đơn đổi bước, để gửi thông báo cho khách.
- **D8. Mã đăng nhập qua Zalo** (KH-OTP-1).
- **D9. Quyền chủ quán cho chế độ sửa.** POS xác nhận tài khoản chủ quán (đăng nhập POS) để máy App KH mở chế độ sửa nội dung.

## 6. Phần quản lý trong POS cho App KH (chat POS xây dần)

| Mục | Làm gì | Đi cùng |
|---|---|---|
| Khách dùng app | Xem khách đã dùng app chưa; khoá / mở tài khoản app; đặt lại PIN khi khách đã xác minh | B3, B4 |
| Đơn app | Danh sách đơn app, chuông, chuyển bước, huỷ / hoàn theo luật | C2–C6 |
| Giờ vàng | Khung giờ, món, %, suất, đã bán | A3, D2 |
| Hạng | Tên, %, giá thẻ, quyền lợi | A2 |
| Sinh nhật & quà | Danh sách, luật tự động, phát tay | D3 |
| Trắc nghiệm | Kết quả từng khách (theo quyền), thống kê | D4 |

Không đặt trong POS: banner, ảnh, mô tả, video, thông báo khuyến mãi — chủ quán sửa trên app bằng chế độ sửa (kho App KH).

## 7. Quy tắc tiền / điểm App KH sẽ theo (chat POS xác nhận đúng)
1. Không công nợ. Mọi chuyển khoản qua QR payOS, máy chủ tự xác nhận.
2. Giá thật do POS tính; app chỉ hiển thị.
3. Điểm chỉ tính trên tiền khách trả thật (tiền mặt / chuyển khoản); không tính phần trừ ví và phí giao (DIEM-THAT-1).
4. Đơn Giờ vàng: không cộng giảm hạng, không voucher, 0 điểm (kể cả nhận điểm bằng mã bill — chốt 13.10, POS chưa làm phần mã bill).
5. Trừ ví và đổi điểm đều hỏi PIN của khách.
6. Không rút tiền trong ví ra tiền mặt.
7. Gói trả trước mua rồi không hoàn (ngoại lệ hoàn giá trị còn lại vào ví).
8. Số lượng món luôn là số nguyên.
9. Giao hàng: chuyển khoản trước, không COD, khách trả đúng phí Ahamove.

## 8. Chat POS trả lời giúp
1. Nhóm A: làm được trước 03.11 không? Mục nào không kịp?
2. Thứ tự gợi ý cho nhóm B, C (khớp với KH-MUA-1, GIAO-1, UUDAI-1, TOPPING-1, COMBO-1a/1b đang mở).
3. Bảng mục 3 có chỗ nào soát sai không?
4. Mục 7 có quy tắc nào khác với cách POS đang làm không?
5. Việc nào trong file này POS thấy nên làm khác (đơn giản hơn / an toàn hơn)?
