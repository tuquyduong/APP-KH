# Yêu cầu App KH gửi chat POS — 30.10.2026 (d) · ĐẶT ĐƠN ONLINE TỪ KHAI TRƯƠNG

<!-- Chat App KH soạn. Chủ quán chuyển sang chat POS cùng file (c). POS đáp bằng TRA_LOI_POS_<ngày>.md — xin trả lời SỚM (trong 31.10). -->

## 1. Chủ quán chốt 30.10
Khách **đặt đơn online trên App KH ngay từ khai trương 07.11** — đủ như demo: giỏ hàng, đặt trong giờ hoạt động, trả tiền, theo dõi đơn, giao hàng.
Trước đây sổ hai bên xếp KH-MUA-1 sau khai trương; quyết định này đưa lên trước.

## 2. App KH cần POS làm (theo thứ tự ưu tiên, để nếu không kịp hết thì vẫn có bản dùng được 07.11)
1. **Đặt đơn nhận tại quán, trả trước QR payOS** (lõi của KH-MUA-1): App gửi giỏ (mã món `ma`, số lượng, ghi chú) → máy chủ tính tiền CÙNG hàm quầy (giá hạng, Giờ vàng, voucher) → trả mã đơn + QR payOS → đơn chỉ về quầy (kèm chuông) khi đã trả. Ngoài giờ / hết hàng / quá giờ nhận đơn → từ chối có `code`.
   Cần cửa: báo giá giỏ (không tạo đơn), tạo đơn + QR, xem trạng thái đơn (để App hiện "đã trả / đang làm / xong / đã giao"), huỷ đơn chưa trả.
2. **Giao hàng Ahamove** (GIAO-1): báo phí ship theo địa chỉ, khách trả đúng phí Ahamove, trạng thái giao.
3. **Trả bằng ví + PIN** (số dư ví đã có; PIN đã có `PUT /pin`).
4. Topping / ghi chú đá–đường (TOPPING-1), combo (COMBO-1a) trong giỏ.
5. Đổi điểm / voucher khi thanh toán (P3b).

## 3. Câu hỏi cần POS trả lời trong 31.10
- Mục nào ở trên POS làm kịp **trước 05.11** (để App KH nối + chủ quán thử 05.11), mục nào sau. Điều kiện còn thiếu (vd Render gói trả phí H1, khoá payOS, tài khoản Ahamove) — nói rõ để chủ quán lo ngay.
- Tên cửa + trường (hợp đồng bản kế tiếp). App KH dựng giao diện theo tên POS chốt, chỉ gọi thật khi POS gộp.
- Thứ tự với các việc đang mở (KH-API-3 v3, việc A thông tin ngắn của món, việc B trắc nghiệm trong file c): POS sắp xếp, báo chủ quán nếu phải bỏ bớt cái gì cho kịp 07.11.

## 4. Phía App KH
App KH làm sẵn màn giỏ hàng, thanh toán, theo dõi đơn theo demo (KH-MUA-1 phía App) song song, dùng dữ liệu mẫu đúng tên trường POS chốt; nối thật ngay khi POS gộp.
