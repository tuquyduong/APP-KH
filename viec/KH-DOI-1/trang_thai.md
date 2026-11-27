# KH-DOI-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (27.11.2026)
- Nhánh: viec/KH-DOI-1 · cây sạch · HEAD beab831 = FETCH_HEAD beab831 (không kéo, đã bằng nhau)
- git log --oneline -3:
  - beab831 PHIEU: KH-DOI-1
  - 0063091 TIEN-DO: KH-HUY-1 xong (PR #46); mo KH-DOI-1 (doi diem lay qua, thiet ke duyet 26.11); KH-SUA-2 them (17)(18); quyet dinh 26.11
  - 9bc3c31 Merge pull request #46 from tuquyduong/viec/KH-HUY-1

## Bước 2–3 — đọc, kế hoạch
- Đọc: phiếu, thư POS 16.11 (hợp đồng đã hẹn), ban_thiet_ke.html + 9 ảnh, mau_de_xuat.js, src/api.js, duLieuKhach.js, datDon.js (guiDonAnToan, loaiLoi, khoaGui),
  PinSheet.jsx, UuDai.jsx, ViTien.jsx, ManQR.jsx, App.jsx, duongDan.js, kiemKhop/canTuPos.js, nd.js + nd/viTien.js, thu_KHNAP1.js (khuôn bài thử).
- `ke_hoach.md`; agent phụ (chỉ đọc) soát 4 câu → 7 điểm, đã sửa kế hoạch (mục "Sau soát kế hoạch"): 401 /kho-qua dựa vào lượt /diem MỚI khi mở màn;
  gửi `doiDiemApp` trần (không qua công tắc DAT_ONLINE); "chưa rõ" giữ khoá; Chế độ sửa bật công tắc ở lớp nháp; ô Điểm đúng khuôn ô ví.

## Bước 4 — bài thử đỏ trước
- `cong_cu/thu_KHDOI1.js` (mới) — chạy trên bản sao sạch (code gốc + bài thử) ở nháp: xem `bang_chung_do.txt`.

## Chỗ vá → đột biến (viec/KH-DOI-1/dot_bien_tay.js — việc chỉ đổi src/, không server/ client/src/ → không dot_bien.py, khuôn KH-VC-2 / KH-NAP-1)
| Chỗ vá | Đột biến |
|---|---|
| nd/doiQua.js `hien.dq` macDinh false | VS-CONG-TAC-MAC-DINH-BAT |
| doiQua.js giữ thứ tự POS | VS-APP-TU-XEP-LAI-QUA |
| doiQua.js nút thiếu điểm / hết hàng | VS-CHO-DOI-KHI-THIEU-DIEM, VS-CHO-DOI-KHI-HET-HANG |
| doiQua.js "Còn lại" không âm | VS-CON-LAI-AM |
| api.js 401 /kho-qua giữ phiên | BV-KHO-QUA-401-THOAT-PHIEN |
| api.js /kho-qua có gửi phiên khách | VS-KHO-QUA-CONG-KHAI |
| duLieuKhach.js xoaKhoKhach xoá cuaQuaToi | BV-DANG-XUAT-GIU-QUA-TOI |
| DoiQua.jsx không lưu PIN | VS-LUU-PIN |
| UuDai.jsx công tắc | VS-UU-DAI-BO-CONG-TAC |
| DoiQua.jsx làm mới kho dữ liệu | BV-KHONG-LAM-MOI-SAU-DOI |
| App.jsx tắt → không vẽ / về /uudai | VS-GOI-KHO-KHI-TAT (trình duyệt) |
| DoiQua.jsx gửi lại cùng khoá | VS-KHOA-GUI-MOI-KHI-GUI-LAI (trình duyệt) |
| DoiQua.jsx khoaGui + PinSheet `dang` | VS-GUI-HAI-LAN-BAM-DUP (trình duyệt) |
| DoiQua.jsx số POS diem_con | VS-TU-TINH-DIEM-CON (trình duyệt) |
| DoiQua.jsx `pin` trong thân | VS-BO-PIN-KHOI-THAN (trình duyệt) |
| DoiQua.jsx nút chỉ khi 'doi' | VS-CHO-DOI-KHI-THIEU-NUT (trình duyệt) |
| DoiQua.jsx dải nhắc theo `nhac` POS | VS-NHAC-KHONG-THEO-POS (trình duyệt) |
