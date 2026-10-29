# YÊU CẦU App KH gửi chat POS — 29.10.2026 · menu xem không cần đăng nhập · đăng ký 3 bước (xưng hô, địa chỉ) · tự gia hạn đăng nhập

<!-- Chủ quán chốt 29.10 (thử app-kh.pages.dev): khách vào thẳng Trang chủ sau màn mở, xem được Trang chủ, Menu, từng món mà KHÔNG phải đăng nhập;
     chỉ đăng nhập khi cần Ưu đãi, Tài khoản, mã thành viên, nhận điểm. App làm ở việc KH-XEM-1 (đang mở). -->

## Xin POS (nên gộp vào KH-API-2 đang làm, cùng lúc nâng hợp đồng lên v2)
1. `GET /api/kh/menu` **không bắt buộc token** — chủ quán muốn trang khách LÚC NÀO cũng xem được menu và giá:
   - Không token: trả danh sách món như hiện nay + giá từng hạng (như bảng giá treo ở quán), cùng danh sách trường đang trả cho khách.
   - Có token hợp lệ: như trên. Token sai / hết hạn: 401 `KH_TOKEN_SAI` như cũ (app biết phiên hết hạn).
   - Chống quá tải máy chủ (máy POS đang phục vụ cả quầy): nếu đặt giới hạn thì đặt RẤT CAO (vd vài trăm lần / phút mỗi địa chỉ) — khách thật
     không bao giờ chạm tới; chủ quán dặn không được làm khách bị chặn khi xem menu.
2. **Đăng ký 3 bước** (chủ quán chốt 29.10: SĐT → mã Zalo → màn "Thông tin của bạn": Tên + Cách xưng hô BẮT BUỘC, Địa chỉ nhận hàng KHÔNG bắt
   buộc). Xin POS (gộp KH-API-2, hoặc tách KH-HOSO-1a làm trước khai trương):
   - `POST /dang-nhap/xac-minh` nhận thêm `xung_ho` (một trong: anh, chi, co, chu, bac, em, ban — POS chốt cách lưu) và `dia_chi` (tuỳ chọn) khi tạo
     khách mới; lưu cùng lúc với tên.
   - `GET /toi` trả thêm `xung_ho`, `dia_chi` (POS đã có cột `address`); `PUT /toi` sửa được `ten`, `xung_ho`, `dia_chi`.
   - Mã đăng nhập sống 5 phút: khi đã xác minh đúng mà trả `CAN_TEN`, xin cho mã đó thêm ~10 phút để khách điền thông tin (không thì khách điền chậm
     là phải xin mã lại).
   - Sau khai trương (KH-MUA-1): đặt đơn giao mà khách chưa có địa chỉ → app bắt nhập, lưu làm địa chỉ MẶC ĐỊNH (`PUT /toi`), có ghi chú cho khách.
3. **Tự gia hạn đăng nhập** (chủ quán chốt 29.10 — đưa vào kế hoạch): khách dùng thường xuyên thì KHÔNG bao giờ phải đăng nhập lại. Đề xuất
   `POST /api/kh/gia-han` (cần token còn hạn) → token mới 30 ngày; app gọi khi mở app, tối đa 1 lần / ngày. Không dùng 30 ngày liền → hết hạn, nhận
   mã Zalo lại. POS chọn tên cửa + cách làm an toàn, ghi hợp đồng.
4. Ghi vào hợp đồng v2: `/menu` token "không bắt buộc"; khối máy đọc — POS chọn cách ghi, báo tên trường (bộ kiểm hai phía đọc chung).
5. Ghi vào `QUYET_DINH_CHU_QUAN.md` mục App KH (29.10):
   - Khách chưa đăng nhập vào thẳng Trang chủ, LÚC NÀO cũng xem được Trang chủ, Menu, giá, Trang món; đăng nhập / đăng ký chỉ khi cần Ưu đãi,
     Tài khoản, mã thành viên, nhận điểm.
   - Đăng nhập bằng mã gửi qua Zalo (KH-OTP-1); lần đầu là đăng ký 3 bước: SĐT → mã → Tên + Cách xưng hô (bắt buộc), Địa chỉ nhận hàng
     (không bắt buộc; đặt online lần đầu thì bắt nhập và lưu làm địa chỉ mặc định).
   - App nhớ đăng nhập 30 ngày và TỰ GIA HẠN mỗi lần khách mở app — dùng thường xuyên thì không bao giờ phải đăng nhập lại.

## App KH đã chuẩn bị
App gọi `/menu` không token khi khách chưa đăng nhập; POS còn trả 401 thì app hiện thẻ "Đăng nhập để xem menu và giá" (không lỗi). POS mở cửa là app tự
hiện menu, không phải sửa app.

## Chat POS trả lời giúp
Mục 1–3 xếp vào việc nào, ngày nào (mục 1 và 2 cần trước khai trương); hợp đồng v2 ghi tên trường ra sao.
