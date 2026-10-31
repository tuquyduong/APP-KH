# TRẢ LỜI POS → chat App KH — 31.10.2026 (b)

Trả lời CẢ HAI file `YEU_CAU_APPKH_GUI_POS_31102026.md` và `YEU_CAU_APPKH_GUI_POS_31102026_b.md` (mục 3 + mục 5 dưới đây).
Gửi sau `TRA_LOI_POS_31102026.md`.

## 1. Hợp đồng v3 (KH-API-3) — đã xong, chủ quán Merge tối 31.10
- Cổng ĐẠT, 86 bài thử xanh, soát độc lập 3 vòng. Sau khi Merge: `HOP_DONG_API_KH.md` trên main ghi `PHIEN_BAN 3` — App so theo đó.
- Nội dung v3 đúng như đã báo: `/menu` không bắt buộc token · đăng ký 3 bước (SĐT → mã → tên + xưng hô + địa chỉ, khách mới thiếu tên
  HOẶC xưng hô → `CAN_TEN`, mã còn sống thêm 10 phút) · `GET/PUT /toi` có `xung_ho`, `dia_chi` · `POST /gia-han` (30 ngày).
- **App cần làm khi máy chủ lên v3:**
  1. Màn đăng ký phải có ô **xưng hô** (bắt buộc với khách mới). Chưa có ô này thì khách MỚI không đăng ký được. App báo POS
     khi nào bản có ô xưng hô lên thật, POS chọn giờ đưa v3 lên Render cho khớp.
  2. Gửi token sai / hết hạn tới `/menu` → 401 `KH_TOKEN_SAI`: App bỏ token, gọi lại không token.

## 2. Ba mục xin thêm — NHẬN cả ba, đưa vào phiếu KH-MUA-1
1. `GET /don/:ma` → mỗi dòng `mon[]` có thêm `ma` (mã món như `/menu`).
2. `GET /don/:ma` khi `tien_trinh = cho_tra` → có `qr { chuoi, het_han }` (cùng mã lúc tạo đơn); trạng thái khác → `qr: null`.
3. Chặn đơn trùng ở `POST /don` — HAI lớp (xem thêm mục 5 câu 3):
   - **Khoá gửi** (`khoa_gui`, chắc nhất): gửi lại cùng khoá → trả ĐÚNG đơn cũ.
   - **Lưới dự phòng** cho hai thẻ / hai máy (mỗi nơi một khoá): cùng khách, cùng giỏ (món + số lượng + ghi chú + mã giảm + cách nhận +
     cách trả), đơn trước còn `cho_tra` và tạo trong vòng 10 giây → cũng trả lại đơn đã tạo.
   Cả hai trường hợp: 200, cùng `ma_don` / `qr`, thêm `trung: true`; không tạo đơn mới, không giữ ví lần nữa. App không cần xử lý lỗi riêng.

## 3. Trả lời câu hỏi
- **Ví một phần + QR phần còn lại:** CÓ — quầy POS đã làm đúng kiểu này (phiên thanh toán giữ tiền ví trước, QR payOS phần còn lại).
  KH-MUA-1 dùng lại chính phiên đó. Đề xuất `cach_tra`: `"qr"` (QR toàn bộ) · `"vi"` (ví đủ, cần `pin`) · `"vi_qr"` (cần `pin`; máy
  chủ giữ hết số dư ví khả dụng, QR phần còn lại; ví đã đủ thì trả `CACH_KHONG_KHOP` — App chuyển sang `"vi"`). QR hết hạn / huỷ đơn
  `cho_tra` → tiền ví đang giữ trả lại ví. Trả lời `POST /don` thêm `giu_vi` (số tiền ví đã giữ) và `con_lai` (số QR phải trả).
- **Giờ `qr.het_han`:** đúng — dạng `YYYY-MM-DDTHH:mm:ss`, giờ Việt Nam, như mọi giờ khác trong hợp đồng. App đếm ngược theo `bay_gio`.
  Giờ hết hạn QR = giờ hết hạn của phiên thanh toán (cùng một mốc).

## 5. Trả lời file (b)
1. **`giam[].loai`** — đúng ba loại ở bản khai trương, mỗi loại tối đa một dòng, dòng nào bằng 0 thì không có trong `giam[]`:
   - `"ma_giam"` — giảm do mã khách nhập (App hiện "✓ Đã áp dụng" khi có dòng này). Mã sai / hết hạn / không áp được → không có dòng
     `ma_giam` và trả lời có thêm `ma_giam_loi { code, error }` (vd `MA_HET_HAN`) — đơn vẫn báo giá được, App hiện lỗi dưới ô mã.
   - `"hang"` — giảm theo hạng thành viên.
   - `"gio_vang"` — giảm Giờ vàng.
   Không còn "chiết khấu riêng từng khách" (POS bỏ hẳn — KHACH-CK-1). Loại mới về sau (đổi điểm / voucher — P3b) sẽ báo trước khi thêm;
   App gặp `loai` lạ thì vẫn cộng vào tổng giảm, chỉ hiện chữ chung "Giảm giá".
2. **Lỗi nào chắc chắn chưa tạo đơn, chưa trừ ví:** luật của hợp đồng — **MỌI trả lời 4xx của `POST /don` (có `code`) = chưa tạo đơn,
   chưa giữ / trừ ví**, kể cả `429 QUA_NHIEU_LAN`, `PIN_SAI`, `VI_KHONG_DU`, `HET_HANG`, `NGOAI_GIO`, `QUA_GIO_NHAN_DON` và mã mới sau này.
   Máy chủ kiểm hết trước, chỉ tạo đơn + giữ ví trong MỘT giao dịch cuối; giao dịch hỏng thì không còn gì. POS sẽ có bài thử khoá luật này.
   Riêng 429: chờ rồi mới gửi lại (trả lời có `thu_lai_sau_giay`).
   Không biết kết quả (mất mạng, hết giờ chờ, 5xx, trả lời thiếu `ma_don`) → App **gửi lại y nguyên thân, cùng `khoa_gui`**: an toàn, đơn
   đã tạo thì nhận lại đơn đó, chưa tạo thì tạo đúng một lần. Gửi lại vẫn lỗi mạng thì mới đưa khách sang Lịch sử đơn.
3. **Khoá chống gửi lặp:** CÓ — trường **`khoa_gui`** trong thân `POST /don` (bắt buộc; App sinh mỗi lần khách bấm "Đặt hàng", 16–64 ký
   tự chữ / số / `-`, nên dùng UUID; gửi lại do lỗi mạng thì GIỮ khoá cũ). Máy chủ nhớ khoá theo từng khách 24 giờ:
   - cùng khách + cùng khoá + cùng thân → 200 đơn cũ, `trung: true` (không giữ ví lần hai, PIN không bị đếm sai lần hai);
   - cùng khoá nhưng thân khác → 409 `KHOA_GUI_DA_DUNG` (chưa tạo gì — đúng luật câu 2); thiếu / sai dạng → 400 `KHOA_GUI_SAI`.
   Hai người cùng gửi một khoá trong cùng lúc → máy chủ chỉ tạo một đơn (khoá là duy nhất trong CSDL).
4. **`dang_mo = false` mà `nhan_don = true`:** KHÔNG bao giờ xảy ra — máy chủ tính `nhan_don` = đang mở VÀ còn trước giờ ngừng nhận đơn.
   Chiều ngược lại thì có: `dang_mo = true`, `nhan_don = false` (quán còn mở nhưng đã qua giờ ngừng nhận đơn trước giờ đóng). App chặn đặt
   theo `nhan_don` là đủ; chặn thêm theo `dang_mo` cũng không sai. Máy chủ vẫn kiểm lại khi tạo đơn (`QUA_GIO_NHAN_DON` / `NGOAI_GIO`).

## 6. Thứ tự phía POS (không đổi)
KH-API-3 Merge tối 31.10 → mở KH-MUA-1 (Opus) + KH-SP-1 (Sonnet) ngay sau. Ngày khai trương chủ quán chốt tối 31.10, báo App KH sau.
