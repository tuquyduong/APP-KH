# POS → chat App KH — 11.11.2026 (a) · Trả lời: kho nội dung App cho /admin + quyền + rà chữ gửi khách

Sổ POS v62 (chủ quán chốt 11.11).

## 1. Kho nội dung App — POS NHẬN · mã việc **ND-API-1** · Opus · **TRƯỚC khai trương**
- **Lịch:** Opus làn 2, ngay sau HUY-1 → dự kiến bắt đầu **~T6 13.11**, gộp **~CN 15.11** (việc Opus thực tế ~1,5 ngày, có soát bảo mật).
- **Hợp đồng RIÊNG** `HOP_DONG_API_ND.md` **v1** — không chung số phiên bản với `/api/kh`. **App bắt đầu KH-ADMIN-1 được ngay theo tên cửa / bảng trong thư
  App 11.11 (a)**: POS nhận nguyên tên cửa, tên bảng, mã lỗi `CO_BAN_MOI_HON`, giới hạn (khoá `[a-zA-Z0-9._-]` ≤ 80, một bản ≤ 1 MB, ảnh ≤ 500 KB
  webp / jpeg / png kiểm byte đầu tệp). Chỗ nào POS phải đổi khi làm, thư hợp đồng lúc gộp ghi rõ.
- **POS chốt thêm:**
  1. **Nhà riêng thật:** mã nằm gọn trong một thư mục máy chủ riêng; bảng `nd_*` không khoá ngoại sang bảng POS, không đọc / ghi tiền, khách, đơn.
  2. **Ảnh lưu ngay trong bảng `nd_anh`** (không dựa vào chỗ lưu file chung của POS) → Xuất / Nhập toàn bộ mang theo cả ảnh, tách máy chủ không sót.
     Nếu kho dữ liệu thật giới hạn kích thước một dòng, kế hoạch sẽ chỉnh và báo App.
  3. **Vé `/api/nd` riêng** (không dùng chung vé đăng nhập POS), hạn ~12 giờ, giới hạn số lần sai như đăng nhập POS; **kiểm quyền mỗi lần ghi**.
  4. **CORS** chỉ `tuquyduong.com` + `app-kh.pages.dev`.
  5. **Khoá sao lưu chỉ đọc** (mục 5 thư App): chỉ gọi được `GET /api/nd/xuat`; chủ quán tạo / thu hồi trong Cài đặt; khoá chỉ hiện MỘT lần lúc tạo.
  6. Bảng `nd_*` nằm trong lịch sao lưu thường của POS.

## 2. Quyền — trong ND-API-1
Nhóm **"App khách hàng — nội dung"** trên màn Phân quyền: Xem Chế độ sửa App · Sửa nội dung App (Lưu nháp) · Cập nhật toàn bộ + quay lại phiên bản ·
Xuất / nhập toàn bộ. Mặc định: chỉ chủ quán có đủ.

## 3. Tư vấn mục 3 — POS đồng ý, xếp CUỐI danh sách (làm nối tiếp, không chờ)
- **Không mở sửa chữ màn nhân viên POS.**
- **CHU-KHACH-1 (Sonnet):** rà mọi chữ POS gửi tới khách (hoá đơn, tem ly, tin Zalo, nội dung chuyển khoản, lời mời đánh giá Google, câu mô tả voucher /
  chương trình) → đưa vào Cài đặt POS có xem trước. **Câu POS trả cho App mà khách đọc nguyên văn** (`thong_bao_tien_ve`, `ly_do`…): **POS trả MÃ**, App
  lấy chữ từ danh mục nội dung App (POS giữ trường câu cũ một thời gian để App cũ không hỏng). Danh sách mã sẽ gửi kèm khi làm.
- **NHATKY-CAIDAT-1 (Opus):** nhật ký thay đổi mọi màn Cài đặt (ai · lúc · cũ → mới) + "khôi phục giá trị cũ" cho màn tiền quan trọng.
- Báo lưu rõ ở mọi màn Cài đặt: BAO-1b đã làm xong, đang soát vòng cuối.

## 4. Lịch POS hiện tại (11.11)
Khai trương sớm nhất T7 28.11 nếu mọi việc trơn tru, **thực tế khoảng T5 03.12**. ND-API-1 gộp ~15.11 để App kịp làm `/admin` trước khai trương.
