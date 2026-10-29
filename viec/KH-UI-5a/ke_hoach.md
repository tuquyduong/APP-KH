# KH-UI-5a — kế hoạch

## Phương án (chọn ít dòng nhất mà vẫn đạt nghiệm thu)
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| Dữ liệu 60 câu + nhóm | cắt NGUYÊN `TQDQ` / `TQD_MENU` / `TQD_SAFE_MENU` / `TRAITS` / `VIS` / `PROD_KEY` bằng script (nháp) → `src/noiDung/*.json` + `theChat.js`; ~0 dòng viết tay | gõ lại | A không thể gõ sai; bài thử so từng byte với demo |
| Cách tính | hàm thuần `src/tracNghiem.js` (~150 dòng), dữ liệu truyền qua tham số `DL` để bài thử nạp thẳng | gộp vào component | A: một nguồn, thử được không cần trình duyệt |
| Lịch âm | chép nguyên `LUNAR` + `TERM_TIPS` → `src/lich.js` (script, ~120 dòng) | viết lại | demo đã duyệt; KH-UI-5b dùng lại |
| Ghép món | từ khoá `PROD_KEY` của demo + tên món POS bỏ dấu (B4) | ghép theo mã demo | POS không có mã demo; từ khoá là chính cách demo ghép |
| Màn hình | 3 trang (`pages/TracNghiem*.jsx`) + `KhoiTheChat`, `OTracNghiem`, `Thongbao`, `AnhTheChat`; hook `dungTracNghiem` giữ ở App | trạng thái cục bộ từng trang | A: Back / đổi tab không mất bài đang làm |
| CSS | script (nháp) trích các luật của demo chưa có trong `demo_*.css` → `demo_tracnghiem.css` (127 luật, đúng thứ tự demo) | viết tay | K9 + "chép nguyên" |
| Biểu tượng | 11 file SVG tách từ `<symbol>` của demo (kèm gradient cần dùng) ở `public/anh/` | base64 | B6 |

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHUI5a.js`)
A1 dữ liệu = demo · A2/A3 điểm, kết luận, gợi ý, dấu hiệu — 39 bộ trả lời lấy từ CHÍNH hàm demo (có ca ngưỡng, Bình hòa, thiên hướng, chưa rõ, xung đột, ≥ 3 thể, loại nhóm theo nóng / lạnh, an toàn) · A4 23 ngày lịch âm + 24 tiết · B1/B2 dựng thật giới thiệu + câu hỏi · B3 kết quả — chữ khớp demo cả 39 ca · B4 ghép món (không dấu, hết hàng, combo, không menu) · B5 đường dẫn, ô khoá, Tài khoản · S1 màn mở · C1/C2 lưu / xoá / không câu trả lời / không mạng · nối vào App.

## Đường song song cần canh · luồng hợp lệ không bị chặn (K5)
- Mở thẳng `/tracnghiem/lam` / `/ketqua` khi chưa có bài → về `/tracnghiem` (không trắng màn). Khách chưa đăng nhập vào các đường này → `/dangnhap?tiep=…`.
- Hội viên đã đăng nhập vào Trang chủ, Ưu đãi, Menu… không bị đổi (bài cũ `thu_KHLINK1` / `thu_KHUI2` / `thu_KHXEM1` vẫn xanh).
- Đăng xuất / hết phiên dọn kết quả trong bộ nhớ và trên máy.

## Soát kế hoạch
Chưa nhờ agent phụ đọc kế hoạch riêng; soát độc lập thực hiện bằng `/ra-soat` ở bước 8.
