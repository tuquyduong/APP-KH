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

## Bước 5–6 — sửa, kiểm (27.11)
- `thu_KHDOI1.js`: 51 đạt · 0 hỏng (KHONG_TRINH_DUYET=1) · 133 đạt · 0 hỏng (Chromium 360 / 390 / 430). Đỏ trên gốc: `bang_chung_do.txt` (4·35 / 18·49).
- Đột biến tay `node viec/KH-DOI-1/dot_bien_tay.js --trinh-duyet`: đối chứng XANH (133/0), 18/18 BẮT ĐƯỢC — `TẤT CẢ ĐỘT BIẾN BỊ BẮT`.
  (Lượt đầu SÓT VS-NHAC-KHONG-THEO-POS: phiếu `nhac` đứng đầu dữ liệu thử → thêm ca phiếu không nhắc đứng trước; lượt đầu nữa bản sao hỏng sẵn 1 ca → thêm lượt đối chứng.)
- `npm test`: còn ĐỎ đúng MỘT phép — `✗ K8 mọi lời gọi src/api.js có trong hợp đồng — GET /kho-qua, GET /qua-cua-toi, POST /doi-diem` → xem `## Câu hỏi`.
  (Lượt đó còn hai chỗ đỏ khác đã xử lý: `thu_KHDOI1` ca "lớp mới dq-" — sửa ca thử; `thu_KHND3e` 2 ca — kho NÔNG (phiên mở từ bản chụp) không tìm được commit
  KH-ND-3e → `git fetch --unshallow`, chạy lại 42 đạt · 0 hỏng; không do việc này.)
- Cổng `tinh` (beab831^ → HEAD): chỉ `✗ [A19]` (chưa tới bước 11.4).

## Câu hỏi
**Q1 — K8 đỏ: 3 cửa ĐÃ HẸN chưa có trong khối máy đọc của hợp đồng.** Phiếu bắt App gọi `GET /kho-qua`, `POST /doi-diem`, `GET /qua-cua-toi` qua `goi` trong
`src/api.js` (mục A1). Bộ kiểm K8 (`kiem_tra_truoc_khi_giao.js:92–109`) đòi MỌI lời gọi `goi('PT', '/đường')` trong api.js có trong khối `HOP_DONG_MAY_DOC` của
`thiet_ke/HOP_DONG_API_KH.md`. Ba cửa này mới là hợp đồng ĐÃ HẸN (thư POS 16.11 — POS chép vào "Đã hẹn" ở lần ghi sổ tới, lên bảng cửa ở v18 khi DOI-DIEM-1 gộp),
nên K8 đỏ: `✗ K8 mọi lời gọi src/api.js có trong hợp đồng — GET /kho-qua, GET /qua-cua-toi, POST /doi-diem`.
Máy KHÔNG tự gỡ được: phiếu cấm sửa `thiet_ke/**` và `kiem_tra_truoc_khi_giao.js`; viết lời gọi "không thẳng" để K8 không thấy là lách bộ kiểm.
Ba cách (máy đề xuất **C**):
- **A.** Chủ quán nhờ chat POS chép 3 cửa vào khối máy đọc ngay bây giờ (kèm cờ "đã hẹn") rồi chép bản hợp đồng sang `thiet_ke/` — sớm hơn lịch POS, trộn cửa chưa chạy với cửa đang chạy.
- **B.** Thêm `thiet_ke/HOP_DONG_API_KH.md` vào Phạm vi để máy thêm 3 dòng — App tự sửa bản chép hợp đồng của POS (trái luật "hợp đồng do POS giữ").
- **C.** Thêm `kiem_tra_truoc_khi_giao.js` vào Phạm vi: K8 nhận thêm cửa có trong `src/kiemKhop/canTuPos.js` với `co: false` + `viec_pos` (sổ "App cần gì từ POS" — đã ghi
  3 cửa DOI-DIEM-1), in rõ "đã hẹn: …" thay vì ✗; ca đỏ trước: K8 trên cây hiện tại đỏ, sau sửa xanh; cửa lạ không có ở cả hai nơi vẫn ✗. ~6 dòng. Khi POS gộp DOI-DIEM-1,
  đổi `co: true` thì K8 đòi hợp đồng như mọi cửa khác (thu_KHKHOP1 đã canh hai chiều).
Mọi phần khác của phiếu đã làm xong và xanh; máy dừng ở đây chờ chủ quán chọn.

**Trả lời Q1 (chủ quán 27.11):** chọn C có sửa — KHÔNG đọc canTuPos.js; hằng `DA_HEN_POS` viết thẳng trong `kiem_tra_truoc_khi_giao.js` đúng 3 cửa (nguồn thư POS 16.11);
K8 nhận cửa trong `DA_HEN_POS`; thêm K8d (cửa đã hẹn đã có trong hợp đồng → đỏ, nhắc gỡ); thêm đột biến "cửa lạ trong api.js vẫn đỏ K8"; được thêm
`kiem_tra_truoc_khi_giao.js` vào Phạm vi chỉ cho việc này; làm tiếp tới hết.
- Đã làm: ca thử khối "K8 đã hẹn" trong `cong_cu/thu_KHDOI1.js` (5 ca, chạy BỘ KIỂM THẬT trên bản sao tạm không có `thu_*.js`) — ĐỎ trên bộ kiểm hiện tại
  (`51 đạt · 5 hỏng`, KHONG_TRINH_DUYET=1); bản vá soạn sẵn ở `viec/KH-DOI-1/va_K8.txt`.
- **Q2 — người gác chặn sửa bộ kiểm.** `Edit kiem_tra_truoc_khi_giao.js` → `[G-LUAT] file luật chỉ sửa được khi mục Phạm vi ghi ĐÚNG TÊN file (glob chung không tính)`;
  thêm dòng đó vào phiếu thì `[G1-PHIEU] phiếu và biên bản soát không được sửa`. Máy không lách. Cần chủ quán (hoặc chat soát) thêm vào mục `## Phạm vi` của
  `viec/KH-DOI-1/phieu.md` đúng dòng:
  `- kiem_tra_truoc_khi_giao.js`
  (và nếu muốn, sửa dòng Cấm "không sửa `kiem_tra_truoc_khi_giao.js`" thành "trừ DA_HEN_POS + K8 + K8d — chủ quán 27.11"). Có dòng đó → máy áp `va_K8.txt`, thêm 2 đột biến
  (VS-K8-NHAN-MOI-CUA, BV-K8D-KHONG-NHAC-GO), chạy `npm test`, `--day-du`, cổng `chay`, `/ra-soat`, báo cáo 7 mục — không còn việc chờ quyết định nào khác.

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
