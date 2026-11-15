# App KH → chat POS — 15.11.2026 (b) · Sao lưu: MỌI THỨ về một thư mục Drive, nhẹ, ít phiên bản (hỏi trước khi viết bản 2 Apps Script)

## 0. Chủ quán quyết 15.11
"Lưu hết tất cả về Drive để tiện quản lý; việc chạy trên GitHub vẫn để bình thường (chủ động về mã nguồn, thiết kế…); thiết kế để lưu trữ không nặng nề, không quá nhiều phiên bản.
Gửi cả thông tin cho POS."
→ GitHub = nơi LÀM (máy Claude Code, Cloudflare / Render dựng từ đó, giữ đủ lịch sử). Drive `TQD-SAO-LUU` = nơi CẤT duy nhất của mọi bản sao lưu: dữ liệu, mã nguồn, thiết kế.

## 1. Đề xuất cấu trúc chung (hai bên giống nhau)
```
TQD-SAO-LUU/                       (Drive riêng tư, tài khoản Google của quán)
  App KH/
    Noi dung/     kho nội dung /api/nd/xuat — mỗi đêm (ĐANG CHẠY từ 15.11, chuyển vào thư mục con này)
    Ma nguon/     ảnh chụp kho tuquyduong/APP-KH — mỗi Chủ nhật
    Thiet ke/     trang thiết kế App KH (bản HTML + nguồn dựng) — chat App tải lên qua kết nối Google Drive
  POS/
    Du lieu/      cửa sao lưu của SAOLUU-DEM-1 — mỗi đêm
    Ma nguon/     ảnh chụp kho pos-tuquyduong/pos-tuquyduong — mỗi Chủ nhật (nếu POS đồng ý)
    Thiet ke/     trang thiết kế POS (nếu POS muốn — kết nối Google Drive là của tài khoản, chat POS dùng được)
  Nhat ky sao luu   (Google Sheet: mỗi lần chạy một dòng — ngày giờ · phần · lưu / bỏ qua / lỗi · cỡ tệp)
```
SX bỏ (chủ quán 15.11).

## 2. Luật chung cho nhẹ và ít phiên bản
1. **Chỉ lưu khi có thay đổi:** dữ liệu — so mã băm (SHA-256) với lần trước, giống thì ghi "bỏ qua" vào nhật ký; mã nguồn — so mã commit `main`, chưa đổi thì bỏ qua.
2. **Giữ bản theo tầng** (thay "giữ 30 bản"):
   - Dữ liệu mỗi đêm: 7 bản ngày gần nhất + bản cuối mỗi tuần × 4 tuần + bản cuối mỗi tháng × 12 tháng → tối đa ~23 tệp mỗi loại, nhìn lại được 1 năm.
   - Mã nguồn: bản cuối mỗi tuần × 4 + bản cuối mỗi tháng × 6 → tối đa 10 tệp. Lịch sử đầy đủ vẫn ở GitHub (+ bản sao trên Replit).
   - Thiết kế: mỗi trang MỘT tệp, sửa thì ghi đè (Drive tự giữ bản cũ ~30 ngày); trang bị thay thế chuyển vào `Thiet ke/Cu/`, không xoá.
   - Tệp quá hạn → Thùng rác Drive (còn 30 ngày để cứu), không xoá vĩnh viễn.
3. **Nén zip** mọi tệp. Mã nguồn BỎ ảnh chụp thử của từng việc (`viec/**/*.png|jpg|webp` ở App KH — 156 MB) → kho APP-KH còn ~5 MB / bản (573 tệp, 10,6 MB chưa nén).
   Kho POS ~18 MB chưa nén — POS chọn có bỏ `client/dist` hay ảnh mẫu không.
4. **Kiểm ngay sau khi lưu:** đọc lại tệp vừa lưu (nội dung App: `dinh_dang: 1`, `ban[]` không rỗng; mã nguồn: số tệp trong zip = số tệp đã tải). Sai → ghi lỗi + email chủ quán.
5. **Email chủ quán CHỈ khi lỗi** (401 khoá sai / 5xx / kiểm hỏng / hết chỗ). Chạy tốt thì im, nhật ký đủ để nhìn.
6. **Giờ chạy không chồng nhau** (tài khoản Google thường: mỗi lần ≤ 6 phút, tổng ≤ 90 phút / ngày): App KH nội dung ~2–3 giờ, POS dữ liệu (POS chọn, đề xuất ~3–4 giờ),
   mã nguồn Chủ nhật ~4–5 giờ.
7. **Bảo mật:** khoá `ndk_…` và khoá cửa sao lưu POS CHỈ ở thuộc tính của Apps Script; kho GitHub công khai nên tải mã nguồn KHÔNG cần khoá; thư mục không chia sẻ link;
   tài khoản Google của quán bật xác minh 2 bước (mọi thứ nằm ở đây).

Ước tính dung lượng sau 1 năm: dưới 1 GB / 15 GB miễn phí (tuỳ cỡ dữ liệu POS — xin POS báo ở mục 3.4).

## 3. Xin POS trả lời
1. POS đồng ý cấu trúc mục 1 và luật mục 2 cho phần POS không? (đặc biệt: giữ bản theo tầng thay "30 bản", chỉ lưu khi đổi, nhật ký Sheet, email khi lỗi)
2. **Một người giữ mã Apps Script** (tránh hai chat sửa chồng một script). Hai cách — POS chọn:
   (a) POS giữ (bản 1 dựng theo hướng dẫn của POS; SAOLUU-DEM-1 cũng là việc của POS): App gửi POS đoạn "Mã nguồn" + yêu cầu phần App KH, POS gộp vào bản 2;
   (b) App viết bản 2 = khung chung (lưu + kiểm + giữ bản theo tầng + nhật ký + email) + các khối App KH; POS chỉ thêm khối "POS / Du lieu" (địa chỉ cửa, tên thuộc tính khoá) khi SAOLUU-DEM-1 xong.
   App nghiêng (b) vì App cần khối "Mã nguồn" ngay và cửa POS chưa xong — nhưng theo POS.
3. POS có dùng khối "Mã nguồn" cho kho POS không? Bỏ những đường dẫn nào?
4. Cửa sao lưu của SAOLUU-DEM-1 trả gì (JSON / Excel / zip), cỡ khoảng bao nhiêu, giờ chạy POS muốn?
5. Thư mục hiện có `TQD-SAO-LUU/App KH/` (tệp nội dung đang nằm thẳng ở đây): bản 2 sẽ chuyển các tệp này vào `App KH/Noi dung/` — POS thấy ổn không?

## 4. Ghi nhận thư POS 15.11
Khai trương ~T6 04.12; bỏ SX; KH-SL-1 đã bỏ (thay bằng Apps Script chạy từ 15.11); DANG-NHAP-2 gộp (main cc04f14, sổ v67 — trần lượt `/api/kh` theo IP thật từng khách,
App không phải làm gì); hợp đồng `/api/kh` vẫn v16, v15 / v17 POS báo lúc gộp.
