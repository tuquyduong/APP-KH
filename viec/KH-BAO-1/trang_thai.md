# KH-BAO-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
HEAD = FETCH_HEAD = b3b1489
b3b1489 PHIEU: KH-BAO-1
bec27e9 TIEN-DO: mo KH-BAO-1 (bao don xong o moi man, Theo doi don ve to hoa don, nho cong tac vi)
25ab8b9 TIEN-DO: mo KH-CT-1 (chuong trinh dac biet o Uu dai, GET /chuong-trinh v9; uu dai sinh nhat hom nay)

## Bảng "chỗ vá → đột biến" (dot_bien.py, kết quả: TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT, đối chứng xanh 101 đạt)
| Chỗ vá | Đột biến |
|---|---|
| baoDonXong.js báo đơn chưa từng thấy chạy | VS-BAO-DON-CHUA-TUNG-THAY |
| baoDonXong.js báo lại đơn đã tắt | BV-BAO-LAI-DON-DA-TAT |
| baoDonXong.js `da_huy` không báo | VS-BAO-DA-HUY |
| BaoDonXong.jsx hỏi khi tab ẩn | VS-HOI-KHI-TAB-AN |
| BaoDonXong.jsx hỏi lặp khi không đơn chạy | VS-HOI-LAP-KHI-KHONG-DON |
| baoDonXong.js chu kỳ 15 s | VS-CHU-KY-HOI |
| BaoDonXong.jsx nhớ đã tắt qua tải lại | BV-NHO-DA-TAT-QUA-TAI-LAI |
| BaoDonXong.jsx xoá nhớ khi đăng xuất | BV-XOA-NHO-KHI-DANG-XUAT |
| App.jsx tiêu đề "(Xong)" không bị ghi đè | VS-TIEU-DE-BI-GHI-DE |
| App.jsx daTra làm mới cuaDon | BV-DA-TRA-LAM-MOI-DON |
| HoaDonKhach.jsx bỏ dòng ghi_no | VS-BAO-DON-VE-GHI-NO |
| TheoDoiDon.jsx vẽ tờ hoá đơn | BV-TO-HOA-DON-THEO-DOI |
| ThanhToan.jsx công tắc bật sẵn khi /toi lỗi | VS-CONG-TAC-BAT-SAN-KHI-TOI-LOI |
| ThanhToan.jsx nhớ công tắc | VS-CONG-TAC-KHONG-NHO |
| ThanhToan.jsx vẫn hỏi PIN khi nhớ ví | BV-HOI-PIN-KHI-NHO-VI |
| ThanhToan.jsx giữ bản ghi khi CHUA_MO | BV-GIU-BAN-GHI-KHI-CHUA-MO |
| ThanhToan.jsx nút gửi lại khoá khi cờ tắt | VS-NUT-GUI-LAI-KHONG-KHOA-CHUA-MO |
| luuMay.js kh_dung_vi không phải khoá vãng lai | VS-DUNG-VI-NHU-VANG-LAI |
| luuMay.js kh_dung_vi trong danh sách xoá | BV-DUNG-VI-KHONG-XOA |

## Kiểm (bước 6)
npm test: 34 đạt · 0 hỏng (cả Chromium) · `--day-du`: 36 đạt · 0 hỏng (vite build, dist/index.html).
Ảnh 360/390/430 ở `so_anh/` (18 ảnh); `doi_chieu_demo.md`.
