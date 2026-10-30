# Sổ quyết định của chủ quán — phần App KH

<!-- Chat App KH ghi theo lời chủ quán. Nguồn sự thật cho mọi chat App KH và máy App KH: quyết định ở đây THẮNG ghi chú cũ trong phiếu / đặc tả.
     Quyết định chung với POS: QUYET_DINH_CHU_QUAN.md ở kho POS (chat POS ghi). Mới ở trên cùng. Muốn đổi → chủ quán nói, chat ghi dòng mới, không xoá dòng cũ (gạch "thay bằng …"). -->

## 30.10.2026
- **Chỉ 3 thứ cần đăng nhập:** tiện ích Kế hoạch, trắc nghiệm thể chất, tích điểm (điểm, voucher, nhận mã bill / nhận điểm). Mọi thứ khác mở cho khách vãng lai: toàn bộ menu, combo, ưu đãi, Giờ vàng, giá của từng hạng. (Thay phần "Ưu đãi cần đăng nhập" của KH-XEM-1.)
- **Đặt đơn online từ khai trương 07.11** (giỏ, đặt trong giờ, trả tiền, theo dõi đơn, giao hàng). Đã xin POS báo phần nào kịp (YEU_CAU_APPKH_GUI_POS_30102026_d.md). Thứ tự ưu tiên: nhận tại quán + trả trước payOS → giao Ahamove → ví + PIN → topping / combo → đổi điểm.
- App KH luôn đọc từ POS mọi thứ khách cần để đặt hàng trong giờ hoạt động (món, giá, giá hạng, tồn, Giờ vàng, giờ mở cửa). Ngoài giờ: xem được, không đặt được, có thông báo; POS chặn.
- **Chia cài đặt:** sai thì mất tiền → POS; chỉ là hiển thị → nội dung App KH (Chế độ sửa /admin, sau khai trương); mất cũng không sao → trên máy khách. Riêng **thông tin ngắn của món** (1 ảnh, nhóm nhu cầu, hợp thể chất, mô tả ngắn, công dụng, thành phần ngắn) để ở màn Sản phẩm POS cho nhân viên dùng, App KH đọc lại. App KH giữ phần giới thiệu chi tiết (mô tả dài, nhiều ảnh, video). Mọi tuỳ chỉnh / nội dung sửa trong cài đặt, không sửa code.
- `src/noiDung/mon.js` (nhu cầu 10 món, KH-ND-1) chỉ là bản TẠM — bỏ khi POS có ô thông tin ngắn (KH-ND-2). Mã món App dùng = `unique_id` POS (vd `juice_1`), không phải mã in (CT1).
- **"Bán chạy nhất"** = danh sách chủ quán tự chọn, tự đặt tên, ở nội dung App KH (không theo số ly, POS không đếm). **"Ưu đãi nhiều nhất"** xếp theo số tiền giảm thật POS gửi.
- **Nhiều địa chỉ / khách** (Nhà, Văn phòng…), một địa chỉ mặc định, lưu ở POS.
- **Trắc nghiệm:** làm xong bài, TRƯỚC khi hiện kết quả, hỏi "chia sẻ kết quả với Tứ Quý Đường để có trải nghiệm tốt nhất?". Đồng ý hay không đều hiện kết quả + món gợi ý như nhau. Đồng ý → gửi bản rút gọn (~150 byte) về POS, lưu trong hồ sơ khách, hiện ở chi tiết khách POS. Ô đồng ý KHÔNG tích sẵn (thông tin sức khoẻ); rút lại được trong Hồ sơ. Câu chữ cho người am hiểu luật xem trước khi chạy thật. (Thay một phần CLAUDE.md §8: kết quả không còn "chỉ trên máy" khi khách đồng ý.)
- Giờ vàng: POS cài món, giờ bắt đầu / kết thúc, giảm theo % hoặc giá còn lại; App chỉ hiển thị. Giá từng món: POS làm GIOVANG-1 (`gia_mon[]`) sau v3; trong lúc chờ App hiện nhãn "Giờ vàng −X%". Giờ `bat_dau` / `ket_thuc` luôn dạng đầy đủ `YYYY-MM-DDTHH:mm:ss` (POS xác nhận).
- Ô Trắc nghiệm khoá: giữ hình demo, dòng phụ thay bằng "🔒 Đăng nhập để mở khoá chức năng", không viên nhãn che chữ. Ô Giờ vàng luôn có mặt, mờ "Hiện chưa có" khi POS không có Giờ vàng (KH-UI-3c).
- Thẻ hạng Trang chủ giữ như demo ("Hạng X"); % giảm / hạn để sau khai trương. Dòng "Quán đang mở cửa" tạm giữ chỗ dưới khẩu hiệu.
- Bộ biểu tượng: lấy từ demo trong kho (`thiet_ke/app_kh_demo.html`, 167 symbol, khớp danh mục chat demo gửi 30.10); chép đủ vào `index.html` ở KH-UI-4.
- Địa chỉ POS cho App KH: `https://www.pos-tuquyduong.io.vn` (bản không www chuyển hướng → trình duyệt chặn). `KH_JWT_SECRET` đặt trên Render 30.10. Biến Cloudflare `VITE_POS_API` = địa chỉ có www.
- Claude xem POS thật bằng tài khoản Staff `claude-xem` (chỉ xem; không bán, không huỷ đơn).
- Bài thử cần trình duyệt thật: không có Playwright → BỎ QUA, không tính hỏng; `SỐ CA` ghi theo số GitHub đếm (CLAUDE.md §9).
- Đổi hết "Sức khỏe mỗi ngày" → "Đông Y Dưỡng Thể"; khẩu hiệu màn mở kiểu B2.3. tuquyduong.com triển khai mới, gắn vào Pages `app-kh` (06.11).
- Dữ liệu trên máy (kế hoạch, bản lưu trắc nghiệm): giữ khi hết phiên; xoá khi bấm Đăng xuất hoặc người đăng nhập sau là khách khác.

## 29.10.2026
- App KH chuẩn 100% theo demo (luật CLAUDE.md §5); màn rộng kiểu A (giống website thương hiệu).
- Đăng ký 3 bước: SĐT → mã Zalo → (khách mới) tên + xưng hô bắt buộc, địa chỉ tuỳ chọn; tự gia hạn đăng nhập mỗi lần mở app. Mã lấy ở quầy là tạm khi chưa có Zalo ZNS.
- Khu quản trị: link riêng `/admin`, đăng nhập tài khoản POS; không có mục sửa giao diện trong Tài khoản. Mỗi trang có đường dẫn riêng.

## 27–28.10.2026
- App KH kho riêng `tuquyduong/APP-KH`, PWA ở `tuquyduong.com`; máy chủ App KH riêng (Render) sau khai trương; kho dữ liệu nhỏ App KH chỉ giữ nội dung trang trí, thông báo, nhắc việc.
- Giờ Việt Nam thống nhất; giờ hoạt động App = giờ quán cài trong POS.
- Đánh giá Google: dữ liệu + màn quản lý ở POS; App KH chỉ giao diện khách.
- Khớp hai chat: hợp đồng `/api/kh` có số phiên bản ở kho POS, bài thử hợp đồng hai phía, sổ quyết định chung, trao đổi bằng file qua chủ quán.
