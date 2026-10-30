# KH-LUU-1 — Dữ liệu lưu trên máy khách: quy tắc chung (giữ khi hết phiên, xoá khi đăng xuất hoặc đổi khách)

<!-- Chat App KH soạn 30.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 01.11. Làm SAU KH-UI-5a (đã gộp); làm lần lượt sau KH-SLOGAN-1 (hai việc sửa ngày khác dòng, nhưng cùng chạm bài thử `thu_KHUI5a.js`).
     Chủ quán chốt 30.10 ("theo đề nghị") ba câu mà máy hỏi ở KH-UI-5a:
       1. Bản lưu trắc nghiệm GIỮ thêm `khiHau` và `anToan` (để mở lại kết quả cũ vẫn thấy lời nhắc an toàn, ví dụ đang mang thai). Chỉ nằm trên máy.
       2. Hết phiên đăng nhập (401) thì KHÔNG mất kết quả đã lưu. Chỉ xoá khi khách BẤM đăng xuất, hoặc khi người đăng nhập sau là KHÁC khách (thiết bị dùng chung).
       3. GIỮ nút "Sao chép kết quả và góp ý" như demo (khách tự chọn dán đi đâu; app không tự gửi).
     Quy tắc này dùng chung cho mọi dữ liệu lưu trên máy: `kh_tracnghiem` (5a) và `kh_kehoach` (KH-UI-5b, 5c) — nên làm thành MỘT chỗ dùng chung `src/luuMay.js`. -->

## Mục tiêu
Khách dùng thường xuyên (nhớ đăng nhập 30 ngày, tự gia hạn) không bị mất kết quả trắc nghiệm chỉ vì hết phiên; nhưng điện thoại dùng chung thì người sau không thấy dữ liệu sức khoẻ của người trước.

## Nghiệm thu

### A. Mô-đun chung `src/luuMay.js` (hàm thuần + kho tiêm vào để thử, như `tracNghiemLuu.js`)
- A1 `dauVet(sdt)` → chuỗi băm ngắn, CHỈ để so "cùng khách hay khác khách" (không lưu số điện thoại thô trên máy; không dùng làm bí mật). `ghiChu(sdt)` ghi khoá `kh_chu` = dấu vết. `cungKhach(sdt)` → đúng / sai / `chuaBiet` (chưa có `kh_chu`).
- A2 `doiKhach(sdt)`: gọi MỖI LẦN app biết số điện thoại của khách vừa đăng nhập (lấy từ `GET /toi` → `khach.sdt`, đã có trong hợp đồng v1). Nếu `kh_chu` có và KHÁC dấu vết của `sdt` → xoá sạch các khoá dữ liệu khách (danh sách khoá khai báo ở MỘT chỗ trong `luuMay.js`: hiện `kh_tracnghiem`; việc sau thêm `kh_kehoach`) rồi ghi `kh_chu` mới. Nếu `kh_chu` chưa có mà đã có dữ liệu cũ (bản lưu từ trước việc này) → xoá dữ liệu cũ cho an toàn rồi ghi `kh_chu`.
- A3 `xoaTatCa()`: xoá mọi khoá dữ liệu khách VÀ `kh_chu` — chỉ gọi khi khách BẤM "Đăng xuất".
- A4 Kho bị chặn (cửa sổ riêng tư…) → không vỡ, trả sai / bỏ qua; không báo "đã lưu" khi chưa lưu (bài học 5a).

### B. Nối vào App
- B1 Đăng xuất bấm tay (`dangXuat` trong `App.jsx`) → `xoaTatCa()` + dọn bộ nhớ trang như hiện nay.
- B2 Hết phiên / 401 (`donPhien` do `api.js` gọi): dọn trạng thái trong bộ nhớ trang (về chế độ khách, về Trang chủ) NHƯNG KHÔNG xoá bản lưu trên máy. Kết quả trắc nghiệm đã lưu không được hiện ra khi chưa đăng nhập (ô Trắc nghiệm mờ + khoá như 5a).
- B3 Đăng nhập xong và có `khach.sdt` → `doiKhach(sdt)`; sau đó nạp lại bản lưu vào hook `dungTracNghiem` nếu cùng khách (ô "Thể trạng · … · Xem kết quả ›" và thẻ "Kết quả đã lưu" hiện lại). Khác khách → bản lưu đã xoá, hook về trạng thái trống.
- B4 `dungTracNghiem.js`: tách `donSach` (xoá cả khoá — dùng cho đăng xuất) khỏi dọn trong bộ nhớ trang (hết phiên); nút "Xoá kết quả" giữ như 5a. Giữ `khiHau` và `anToan` trong bản lưu (câu 1). Nút "Sao chép kết quả và góp ý" giữ nguyên (câu 3).
- B5 Chỉ mã trong `src/**` + bài thử; KHÔNG thêm cửa mới, không gửi gì ra khỏi máy; số điện thoại thô không vào bộ nhớ lưu lâu dài, không vào log.

### C. Kiểm
- C1 `cong_cu/thu_KHLUU1.js` (CHẠY THẬT hook và App trong bài thử — không chỉ đọc nguồn bằng regex; nếu chưa có công cụ dựng DOM thì dựng bằng Chromium/Playwright có sẵn): các ca —
  (a) cùng khách, hết phiên 401 rồi đăng nhập lại → kết quả còn; (b) khách khác đăng nhập sau khi hết phiên → kết quả cũ mất, không hiện; (c) bấm Đăng xuất → mất, kể cả `kh_chu`; (d) bản lưu cũ chưa có `kh_chu` → xoá khi đăng nhập; (e) chưa đăng nhập, ô Trắc nghiệm mờ + khoá và không lộ kết quả; (f) kho bị chặn không vỡ; (g) `khiHau` / `anToan` còn sau khi mở lại, gợi ý an toàn vẫn hiện.
- C2 Sửa các ca của `cong_cu/thu_KHUI5a.js` đang đòi "`donSach` cũng xoá khoá khi hết phiên" cho khớp quy tắc mới (đổi hành vi có chủ ý; không bớt ca khác).
- C3 `npm test`, `--day-du` (K8, K9), `node tu_chay/cong.js chay` ĐẠT.
- C4 Chủ quán thử tay (≤ 3 thao tác): (1) làm trắc nghiệm → lưu → đóng app; (2) đăng xuất rồi đăng nhập lại cùng số → kết quả MẤT (vì đăng xuất bấm tay); (3) làm lại và lưu → đóng hẳn trình duyệt, mở lại sau khi phiên còn hạn → kết quả CÒN. (Ca hết phiên và đổi khách đã có bài thử.)

## Phạm vi
- viec/KH-LUU-1/**
- src/**
- cong_cu/thu_KHLUU1.js
- cong_cu/thu_KHUI5a.js

## Bài thử đỏ
Có — `cong_cu/thu_KHLUU1.js` ĐỎ trên code gốc (chưa có `luuMay.js`; hết phiên đang xoá bản lưu).

## Ngân sách
~120 dòng app + ~200 dòng thử. **Phương án đơn giản nhất đã xét:** một mô-đun nhỏ với một khoá "chủ sở hữu" và một danh sách khoá; không mã hoá, không gắn tài khoản ở máy chủ (App không có cửa cho việc đó).

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/`.
- KHÔNG gửi dữ liệu sức khoẻ ra khỏi máy; không lưu số điện thoại thô lâu dài; không cửa ngoài hợp đồng. Không bí mật trong code / log.
- Chỉ push `git push -u origin viec/KH-LUU-1`. Không đụng `main`, không merge, không tạo PR.
