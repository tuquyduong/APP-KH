# KH-MUA-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: viec/KH-MUA-1; cây sạch.
- HEAD 58277e2 · FETCH_HEAD 58277e2 (bằng nhau, không kéo).
```
58277e2 PHIEU: KH-MUA-1
8f34c24 TIEN-DO: bo khung tu-chay 1.8.1 (KHUNG-KEO-1 tu POS); trao doi POS 30.10d + 31.10; ban giao; KH-UI-3c xong; mo KH-MUA-1 - so v12
13b33fc Merge pull request #8 from tuquyduong/viec/KH-UI-3c
```

## Tiến độ
- Bước 2–3: đọc phiếu, CLAUDE.md, KHUON_LOI.md, CHECKLIST_CODE.md, code vùng sửa; `ke_hoach.md`; agent phụ soát kế hoạch (4 câu) — tiếp thu: đặt tên trang
  `theodoi` (không trùng `don`), đăng xuất dọn giỏ trong bộ nhớ, giỏ khách vãng lai không bị xoá khi đăng nhập lần đầu, thêm ca B1 / B4 / C1 10 giây / C2.
- Bước 4: `cong_cu/thu_KHMUA1.js` đỏ trên gốc (3 đạt · 16 hỏng) — `bang_chung_do.txt`.
- Bước 5–6: code xong; `npm test` + `--day-du` 26 đạt · 0 hỏng; thu_KHMUA1.js có Chromium 115 đạt · 0 hỏng (61 ca trình duyệt chạy thật ở máy).

## Phần trình duyệt (chạy thật ở máy, CLAUDE.md §9)
`node cong_cu/thu_KHMUA1.js` → 115 đạt · 0 hỏng: luồng QR (khách thêm 2 món → tab "2" → Tiếp tục → /dangnhap?tiep=%2Fthanhtoan → đăng nhập → /thanhtoan → bảng
tiền đúng số POS giả → 1 POST /don → QR + đếm ngược → da_tra → hết QR, số đơn, giỏ dọn); ví + PIN sai/đúng; ví thiếu; ngoài giờ; HET_HANG; QR hết hạn + huỷ;
hỏi lại 10 giây và dừng khi xong; Đặt lại; bấm đôi; gộp báo giá; cờ tắt 0 lời gọi; 360/390/430 × chữ 100/130% không tràn, Lỗi JS = 0.

## Chỗ vá → đột biến (`dot_bien.py`, chạy `KHONG_TRINH_DUYET=1 python3 viec/KH-MUA-1/dot_bien.py` → TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT)
| Chỗ vá | Đột biến | Kết quả |
|---|---|---|
| `datDon.docBaoGia` lấy nguyên `tong` POS | VS-TU-CONG-TONG (tự tính tạm tính − giảm + phí) | ĐỎ 52·2 |
| `datDon.khoaGui` chặn bấm đôi | VS-BO-KHOA-BAM-DOI | ĐỎ 52·2 |
| `gio.sach` chỉ giữ ma / so_luong / ghi_chu | VS-LUU-GIA-VAO-GIO | ĐỎ 52·2 |
| `datDon.goiCong` xét cờ DAT_ONLINE | VS-GOI-MANG-KHI-CO-TAT | ĐỎ 53·1 |
| `datDon.viThieu` | VS-TRA-VI-KHI-THIEU | ĐỎ 53·1 |
| `datDon.thanDatDon` pin chỉ khi ví | VS-PIN-KHI-TRA-QR | ĐỎ 53·1 |
| `datDon.taoGop` | VS-GOP-KHONG-GOP | ĐỎ 53·1 |
| `luuMay` khoá `kh_gio` | BV-BO-KH-GIO-KHOI-LUU-MAY | ĐỎ 52·2 |
| `luuMay` giữ giỏ khách vãng lai | BV-BO-GIU-GIO-VANG-LAI | ĐỎ 53·1 |

## Câu hỏi
- Q1 (A1, khác demo): demo KHÔNG vẽ số món trên tab Giỏ hàng (chỉ có `.badge-dot` ở chuông). Phiếu A1 / E6.1 đòi số → đã làm viên số `.tab-so` bằng biến màu
  demo. Chủ quán xác nhận giữ, hoặc đổi thành chấm `.badge-dot` của demo.
- Q2 (A2): ô món `prodCard` của demo KHÔNG có nút thêm giỏ; phiếu ghi "ô món theo demo" → KHÔNG thêm nút trên ô món (chỉ Trang món). Cần nút trên ô món thì
  chủ quán duyệt mẫu (khác demo).
- Q3 (B2): hợp đồng v2 chưa có `dia_chi` ở `/toi` và `PUT /toi { dia_chi }`; giao tận nơi TẮT tới KH-MUA-2 → việc này KHÔNG có ô địa chỉ (datDon.thanBaoGia
  đã gửi `dia_chi` khi `cach_nhan: "giao"`). Làm ô địa chỉ ở KH-MUA-2 khi v3 có — cần ghi vào phiếu KH-MUA-2.
- Q4 (B3): trả một phần ví + phần còn lại QR — POS chưa nói hỗ trợ; app chỉ cho trả ví khi đủ toàn bộ. Hỏi chat POS.
- Q5 (C3, gửi POS): `GET /don/:ma` `mon[]` chưa có `ma` (hợp đồng v2 dòng 38) → "Đặt lại" đọc `mon[].ma` (tên dự kiến, ở `datDon.monDatLai`); thiếu `ma` thì
  báo "không còn bán". Xin POS thêm `ma` vào `mon[]` ở hợp đồng bản kế tiếp. Cùng lúc: `GET /don/:ma` có `cach_nhan` (để màn theo dõi ghi "Lấy tại quầy").
- Q6 (B7): mã QR chỉ có trong trả lời `POST /don` → App giữ trong bộ nhớ trang; tải lại / mở máy khác khi đơn đang chờ trả thì không thấy QR (chỉ còn
  "Huỷ đơn"). Xin POS: `GET /don/:ma` trả lại `qr { chuoi, het_han }` khi `cho_tra`.

## Phát hiện
- `thiet_ke/app_kh_demo.html` checkout ghi "Giao qua GHN" / "Phí giao GHN" (phiếu đã nói demo ghi nhầm) — app dùng Ahamove.
- Hai tab trình duyệt cùng mở: khoá bấm đôi chỉ trong một tab; POS cần chặn đơn trùng (cùng khách, cùng giỏ, vài giây) ở `POST /don` — ghi cho chat POS.
- Cổng tiêm trong bài thử gọi `fetch` thẳng (không qua `goi` của api.js) nên đường 401 của cửa đặt đơn chưa thử — KH-MUA-1b tiêm `goi` thì thêm ca 401.
