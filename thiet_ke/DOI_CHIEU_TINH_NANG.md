# Đối chiếu tính năng App KH ↔ POS (30.10.2026)

<!-- Chat App KH rà 25 màn của demo với code App KH, hợp đồng /api/kh v2, sổ POS v47, POS thật (claude-xem). Bản đầy đủ có bình luận:
     https://claude.ai/artifact/KV7rGx8sxzJX9GMfhAG6D4 . Cập nhật bảng này mỗi khi POS / App KH gộp việc liên quan. Quyết định: thiet_ke/QUYET_DINH_APPKH.md -->

"POS đã có" = App KH gọi được qua `/api/kh`. Đăng nhập chỉ cần cho: Kế hoạch, trắc nghiệm, tích điểm.

| # | Tính năng (màn demo) | App KH | POS đã có | POS còn thiếu | Khi nào |
|---|---|---|---|---|---|
| 1 | Màn mở, khẩu hiệu | Xong | — | — | Xong |
| 2 | Đăng nhập / đăng ký | Xong (2 bước, mã ở quầy) | xin-ma, xac-minh, mã tại quầy | xưng hô + địa chỉ, tự gia hạn (v3); Zalo ZNS (KH-OTP-1) | v3 01.11 · ZNS khi chọn nhà cung cấp |
| 3 | Trang chủ: lời chào, hạng, điểm, giờ mở cửa | Xong | /toi, /diem, /gio-hoat-dong | chào theo xưng hô (v3) | 01.11 |
| 4 | Giờ vàng | Xong (3c sửa ô mờ) | khung giờ, món, % | giá từng món (GIOVANG-1) | sau v3 |
| 5 | Chăm sóc theo nhu cầu | Tạm `mon.js` | — | nhóm nhu cầu trong Sản phẩm | xin, trước KT |
| 6 | Menu, giá hạng, hết hàng | Xong; còn: vãng lai xem giá mọi hạng, Bán chạy (App tự chọn), Ưu đãi nhiều nhất | menu + gia_hang + con_hang | menu không đăng nhập (v3, kèm giá mọi hạng) | 01.11 |
| 7 | Trang món: ảnh, mô tả, công dụng, thành phần, hợp thể chất | Khung có | tên, nhóm, giá | 1 ảnh, mô tả ngắn, công dụng, thành phần, thể chất | xin, trước KT |
| 8 | Banner Hôm nay | Khung có | không cần | — | chủ quán gửi chữ |
| 9 | Trắc nghiệm | Xong trên máy; còn màn hỏi chia sẻ + gửi POS | — | lưu kết quả rút gọn + hiện ở chi tiết khách | xin, ngay sau v3 |
| 10 | Ưu đãi: điểm, voucher, QR, nhận mã | Xong; sửa: mở trang cho vãng lai, chỉ khoá điểm/voucher | đủ | — | — |
| 11 | Lịch sử đơn | Xong | /don, /don/:ma | "Đặt lại" cần đặt đơn | cùng đặt đơn |
| 12 | Tài khoản, hồ sơ, địa chỉ | Tên, PIN xong | sửa tên, PIN | xưng hô + 1 địa chỉ (v3); nhiều địa chỉ; email, giới tính, ngày sinh, hoá đơn (KH-HOSO-1); thiết bị đăng nhập | v3 · còn lại xin |
| 13 | Kiểm khớp POS | Chưa (KH-KHOP-1) | không cần | — | trước KT |
| 14 | Kế hoạch, nhắc việc, 8 tiện ích, video "Xem cách dùng app" | Phiếu KH-UI-5b sẵn | không cần | — | trước KT |
| 15 | Hỗ trợ | Khung có | không cần | — | chủ quán gửi số |
| 16 | Màn rộng máy tính | Phiếu KH-UI-4 sẵn | không cần | — | trước KT |
| 17 | Topping, size, ghi chú đá/đường | Chưa | — | TOPPING-1 (quầy); cửa App (v4) | theo POS |
| 18 | Combo | Chưa | — | COMBO-1a (quầy); cửa App | theo POS |
| 19 | Giỏ, thanh toán payOS, theo dõi đơn, giao Ahamove | Chưa (KH-MUA-1) | — | KH-MUA-1, GIAO-1; payOS cần H1 | **trước KT (chốt 30.10)**, chờ POS báo |
| 20 | Ví (sổ ví, nạp), mua thẻ hạng, đổi quà | Chỉ số dư | số dư, danh sách hạng | lịch sử ví, nạp online, mua thẻ, đổi quà (P3b) | sau KT |
| 21 | Thông báo đẩy | Chưa (cần máy App KH) | — | nhờ App KH gửi tin | sau KT |
| 22 | Gia đình, thẻ quà, mời bạn, quà sinh nhật | Chưa | — | chưa có gì | sau KT |
| 23 | Đánh giá Google; Chế độ sửa /admin | Chưa | — | DG-GOOGLE-1; xác nhận tài khoản nhân viên | sau KT |
