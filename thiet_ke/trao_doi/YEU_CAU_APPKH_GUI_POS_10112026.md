# YÊU CẦU App KH → chat POS — 10.11.2026 · Giới thiệu bạn bè (chỉ qua App) + thưởng bằng VOUCHER cài trong Cài đặt Voucher

## 0. Chủ quán chốt 10.11
1. **Thưởng = voucher để mua hàng** (giảm số tiền HOẶC %, áp dụng cho món / nhóm nào) — cài trong **phần cài đặt Voucher sẵn có của POS** (dùng chung, không làm hệ voucher thứ hai).
2. **Mức thưởng + hạn sử dụng: đặt trong Cài đặt** (không cứng trong code).
3. **Chỉ qua App** (quầy không nhập người giới thiệu).
4. Yêu cầu chung: hệ thống **thông minh, code chuẩn, đơn giản**, không lằng nhằng — một luồng duy nhất, mọi chỗ dùng lại cái đã có (voucher, báo giá, đơn, đăng ký OTP).

## 1. Luồng (một quy tắc, ba bước)
1. **Mời**: khách A (đã đăng nhập) có MỘT mã mời cố định (vd `TQD-LINH88`, POS sinh, không trùng) + link `https://<tên miền App>/?ref=<mã>`.
2. **Bạn đăng ký**: khách B mở link → App giữ mã → B đăng ký bằng OTP như hiện nay; `POST /dang-nhap/xac-minh` gửi thêm `ma_moi`.
   POS ghi "B do A mời" CHỈ KHI B là **khách mới thật** (SĐT chưa từng có trong POS — kể cả khách quầy) và B ≠ A. Hợp lệ → **B nhận ngay voucher "Chào mừng bạn được mời"**.
   Mã sai / không hợp lệ → đăng ký vẫn thành công, chỉ không gắn người mời (không chặn đăng ký; trả lý do để App báo nhẹ).
3. **Bạn mua đơn đầu thành công**: đơn đầu tiên của B **đã thanh toán và hoàn tất** (không huỷ / hoàn) → **A nhận voucher "Thưởng người giới thiệu"**. Mỗi B chỉ sinh thưởng cho A MỘT lần.
   Đơn đầu bị huỷ / hoàn → chưa thưởng; đơn hợp lệ tiếp theo của B mới tính.

## 2. Cài đặt (POS — dùng component báo lưu chung CAIDAT-BAO-1, PIN chủ quán)
**A. Cài đặt Voucher → "Mẫu voucher"** (nếu POS đã có thì bổ sung đủ trường; nếu chưa có khái niệm "mẫu" thì thêm — mỗi lần phát sinh ra một mã từ mẫu):
- Tên hiển thị · Kiểu giảm: **số tiền** hoặc **%** (có **trần giảm** cho %) · **Đơn tối thiểu** · **Áp dụng**: tất cả / nhóm món / món chọn
- **Hạn dùng**: số ngày kể từ lúc phát · Dùng 1 lần · Không cộng dồn với mã khác (một đơn một mã như luật hiện nay)
- Xem trước câu khách thấy: "Giảm 20.000đ cho đơn từ 50.000đ · HSD 30 ngày".

**B. Cài đặt → "Giới thiệu bạn bè"**: Bật / Tắt · chọn mẫu voucher cho **người được mời** · chọn mẫu cho **người giới thiệu** · **Tối đa N lần thưởng / người / tháng** (mặc định 10).
Tắt chương trình → App ẩn hết phần mời; voucher đã phát vẫn dùng đến hạn.

**C. Màn khách (POS)**: dòng "Được mời bởi: <tên, SĐT che bớt>" + "Đã mời: N · đã thưởng: M"; báo cáo tháng: số lượt mời, đơn đầu, tiền voucher đã dùng (vào đối soát chung của voucher).

## 3. Chống gian lận (POS làm, khách không thấy phiền)
- Một SĐT chỉ là "khách mới" một lần; khách đã có trong POS (từng mua ở quầy) không tính. Không tự mời mình.
- Thưởng A chỉ sau khi đơn của B hoàn tất; đơn huỷ / hoàn không thưởng.
- Trần N lần / tháng / người giới thiệu; vượt trần → ghi nhận nhưng không phát voucher.
- Voucher thưởng gắn với tài khoản (không chuyển cho người khác).

## 4. Xin POS — hợp đồng `/api/kh` (tên trường POS chốt)
- `GET /gioi-thieu` (token) → `{ bat, ma_moi, link, nguoi_moi_duoc: { voucher_mo_ta }, nguoi_gioi_thieu: { voucher_mo_ta }, da_moi, da_mua_don_dau, da_thuong, tran_thang }`
  — `*_mo_ta` là câu POS dựng từ mẫu voucher (vd "Giảm 20.000đ cho đơn từ 50.000đ · HSD 30 ngày") để App hiện đúng như Cài đặt, App không tự tính.
- `GET /gioi-thieu/kiem?ma=` (không token) → `{ hop_le, ten_nguoi_moi (chỉ tên ngắn), voucher_mo_ta }` — để màn đăng ký hiện "Linh mời bạn — nhận …".
- `POST /dang-nhap/xac-minh` nhận thêm `ma_moi?`; trả thêm `moi: { gan: true|false, ly_do? }` (`MA_MOI_SAI`, `KHONG_PHAI_KHACH_MOI`, `TU_MOI`, `CHUONG_TRINH_TAT`).
- Voucher phát ra nằm trong `GET /voucher` sẵn có (thêm `nguon: 'gioi_thieu'` nếu tiện) — App hiện ở Ưu đãi, dùng ở báo giá như mọi mã.
- Báo thưởng: cờ / sự kiện để App báo "Bạn Lan vừa hoàn tất đơn đầu — bạn nhận voucher …" (POS chọn cách: trường trong `/gioi-thieu` hoặc dòng thông báo chung).

## 5. App sẽ làm (sau khi POS lên hợp đồng)
Màn "Mời bạn bè" (Tài khoản + thẻ nhỏ Trang chủ theo demo): mã, nút Chia sẻ (Zalo / chia sẻ của máy / Copy link), 3 số thống kê, câu thưởng lấy từ POS;
link `?ref=` giữ qua bước đăng ký; màn đăng ký hiện "<tên> mời bạn — <voucher>"; báo khi nhận thưởng. Chương trình tắt → ẩn hết.

## 6. Thời điểm
Sau khai trương, khi đặt đơn online đã ổn. Xin POS báo mã việc + lịch + phiên bản hợp đồng.
