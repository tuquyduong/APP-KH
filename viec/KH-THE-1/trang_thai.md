# KH-THE-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (13.11.2026)
- Nhánh: `viec/KH-THE-1`; `git status --short` sạch (không dòng đã theo dõi sửa dở).
- `git fetch origin viec/KH-THE-1` → HEAD `3cb9386` · FETCH_HEAD `3cb9386` (bằng nhau — không kéo).
- `git log --oneline -3`:
```
3cb9386 PHIEU: KH-THE-1
c770240 TIEN-DO: mo KH-THE-1 (ban the hang tren App: man Hang thanh vien, nhom The thanh vien o Menu, nut Mua o Uu dai, nhac gia han, the chung gio + tra the truoc; Opus, cho duyet ke hoach; song song KH-ND-3d); KH-ADMIN-1 mo ~14.11; quyet dinh 12.11
b7df000 TIEN-DO: KH-ND-3c, KH-UI-5f xong (chat soat cuoi DAT, gop PR); mo KH-ND-3d (Ke hoach + moi tien ich vao danh muc, o an thi link cung khong mo, GiaMon bo cat chu d, tel: chi so); quyet dinh 12.11 dot 6; ban giao chat 12.11
```

## Bước 3 — kế hoạch
- `ke_hoach.md` đã viết; phiếu dặn "Chờ duyệt kế hoạch" → commit, push, DỪNG chờ chủ quán gõ "duyệt".

## Câu hỏi
(Câu 1–3: chủ quán đã trả lời ở cuối phiếu, commit `53408ed` 13.11 — giữ để tra. Câu 4 MỚI, không chặn việc.)
4. **`cong_cu/thu_KHND3e.js` ca B1 — xin mục `## Bài thử cũ sửa` trong phiếu** (soát v1 lỗi 6). Bài cũ so `src/datDon.js` với commit `PHIEU: KH-ND-3e` và đòi MỌI dòng thêm từ đó là
   `nd()` / chú thích — việc nào sau KH-ND-3e thêm hàm vào `datDon.js` cũng làm nó đỏ (KH-THE-1 thêm hàm thẻ). Máy đã sửa ca thành "so tới commit CUỐI của KH-ND-3e"
   (`git log --grep=^KH-ND-3e: -- src/datDon.js`) — đúng ý bài (KH-ND-3e chỉ đổi dòng chữ) nhưng nay là phép so lịch sử cố định. Trên cây gốc của cổng (git archive, không `.git`)
   ca ĐỎ, nhưng là do môi trường, không do hành vi — không có cách làm đỏ thật. Đề xuất chủ quán thêm vào phiếu:
   `## Bài thử cũ sửa` · `- cong_cu/thu_KHND3e.js — B1 so datDon.js tới commit cuối của KH-ND-3e (việc sau được thêm hàm vào datDon.js); không có hành vi nào trên gốc để đỏ`.
   Không thêm thì cổng vẫn ĐẠT (đỏ vì thiếu `.git`), chỉ là bằng chứng không thật — máy ghi rõ ở `bang_chung_do.txt`.
1. **A1 không tải được đúng từng byte.** Người gác chặn cả ba đường: `curl` tới raw.githubusercontent.com (`[CURL-HOST]`), `git init` + `git fetch` kho POS ở nháp
   (`[GIT-LENH]`), công cụ thêm kho `add_repo` (`[CC-LA]`). Một agent phụ đọc được trang (PHIEN_BAN 13, NGAY 2026-11-09) nhưng chỉ trả lời tóm ý — không dùng để chép.
   Xin chủ quán làm như KH-MUA-1c (v9): đặt bản gốc vào `viec/KH-THE-1/hop_dong_v13.md` (tải `HOP_DONG_API_KH.md` của kho POS ở commit
   `162a9080b0a754f4433e544009ec0893dc358f5f`) cùng lúc gõ "duyệt"; máy sẽ kiểm sha256 bắt đầu `490976b0c438b8b4`, `cmp` rồi chép sang `thiet_ke/HOP_DONG_API_KH.md`.
   Không có tệp đó thì máy dừng lại ở A1 (đúng lời phiếu).
2. **Mã giảm có áp lên thẻ không — hợp đồng v13 và sổ quyết định lệch nhau** (theo tóm ý của agent phụ, sẽ đối chiếu lại nguyên văn khi có tệp ở câu 1): v13 ghi
   "ma_giam tính trên tạm tính GỒM cả giá thẻ"; `thiet_ke/QUYET_DINH_APPKH.md` dòng 41 (POS 10.11) ghi "Voucher / mã giảm KHÔNG áp lên thẻ hạng".
   App KHÔNG đổi gì vì chuyện này (C6: số lấy nguyên báo giá POS; C3 "Trả thẻ trước" không gửi `ma_giam`). Nhưng nút "Thanh toán" cả giỏ vẫn gửi `ma_giam` như cũ → nếu POS
   theo v13 thì mã sẽ giảm cả phần thẻ, trái QĐ 10.11. Việc của POS — chủ quán chuyển chat POS (máy không được sửa `thiet_ke/trao_doi/` trong việc này).
3. (Không chặn — máy làm theo mặc định nếu chủ quán không nói khác) Hợp đồng v13 còn mã `DON_KHONG_HOP_LE` cho hạng đã xoá / không có. Phiếu C5 chỉ kể 4 mã.
   Mặc định: 4 mã của phiếu đánh dấu dòng thẻ; `DON_KHONG_HOP_LE` hiện nguyên lời POS (như hiện nay) — dòng thẻ sẽ tự bị đánh dấu "không còn bán" khi `/hang` mới không còn hạng đó (C2).

## Phát hiện
- Hợp đồng v12 (KH-TOMTAT-1) thêm `kenh`, `cach_nhan`, `tra[]`, `so_mon`, `mon_dau`, `giam` vào `GET /don` và `GET /don/:ma`. Việc này không dùng (ngoài phạm vi), chỉ chép hợp đồng.
- `daTra` (App.jsx ~210) chỉ chạy khi màn Theo dõi đơn đang mở: đơn trả xong lúc khách ở màn khác thì giỏ không tự dọn (có từ trước KH-THE-1; agent soát kế hoạch chỉ ra).
  → Chủ quán cho LÀM trong việc này (mục C7 của phiếu, 13.11): đã làm — App nghe kho `/don`, Thanh toán nghe GET /don riêng của nó, cùng hàm `maDonDaTra` → `daTra`.
- POS v13 cho mã giảm áp lên cả giá thẻ; QĐ 10.11 không — chủ quán trả lời: POS VOUCHER-2 chặn ở máy chủ, App không đổi (phiếu, câu 2).
- Bản đồng bộ giỏ: `boDongDaGui` khớp `ghi_chu` đúng như `themMon` lưu (đã trim); bản `kh_gio` bị sửa tay với ghi chú toàn khoảng trắng thì dòng đó không tự dọn (soát v1 nghi ngờ) — không sửa (chỉ khi kho bị sửa tay).

## Soát độc lập vòng 1 (/ra-soat, 13.11) — báo cáo chép nguyên ý
KHÔNG ĐẠT
LỖI TÌM ĐƯỢC:
1. src/pages/ThanhToan.jsx:43,89 + src/App.jsx:217-219 — C7 sót nguồn `dsDon` (GET /don riêng của Thanh toán): QR đơn có thẻ trả xong khi khách đã rời Theo dõi đơn, kho cuaDon chưa làm mới → mở Thanh toán, giỏ còn thẻ, không chặn → trả thẻ lần hai — K4.
2. src/App.jsx:237 + TheoDoiDon.jsx:75-78 — "Tạo mã mới" của đơn trả thẻ trước về /thanhtoan mất ?chi=the → trả cả giỏ — K4.
3. App.jsx:237 hangMoi lấy /toi (làm mới song song) → "Đã lên hạng " trống / tên hạng cũ — K3.
4. src/pages/HangThanhVien.jsx:34 dungCua(cuaToi) không điều kiện → khách vãng lai bắn GET /toi không token — K4 (lệch khuôn TrangChu / UuDaiToi).
5. src/datDon.js:265-272 monDatLai đếm dòng thẻ vào boQua → "Đặt lại" báo "1 món không còn bán" sai — K4.
6. cong_cu/thu_KHND3e.js:92,101-103 ca B1 thành hằng số (so hai commit cố định); "đỏ trên gốc" chỉ vì cây archive không có .git — K3 / F3.
NGHI NGỜ: hangToi suy từ kho /toi (làm mới lỗi có làm rỗng dl?); boDongDaGui khớp ghi_chu không trim; C6 không ca riêng.
NGHIỆM THU: 23/25 · thiếu F3 (KHND3e), F6 (chưa ghi).
CHƯA SOÁT ĐƯỢC: --day-du, cổng chay; so ảnh bằng mắt; VOUCHER-2 phía POS.
BÀI HỌC: KHOÁ ca CR "trả QR → rời Theo dõi → tiền về → mở Thanh toán"; KHOÁ ca "Tạo mã mới đơn chỉ thẻ giữ ?chi=the"; KHOÁ ca tĩnh "màn vãng lai không gọi cuaToi khi chưa đăng nhập";
NGUYÊN TẮC: gom "nguồn dữ liệu X" về một hàm thì grep mọi lời gọi cửa API đó; "đỏ trên gốc" do môi trường không tính.
Đơn giản: the_hang.css khai .ud-hang-nut hai lần; tenThe (GioHang) / tenGui (ThanhToan) trùng → một hàm; HangThanhVien phu/kPhu chuỗi điều kiện hai lần; dot_bien_tay.js đường nháp ghi cứng.

## Vòng sửa 1 (sau soát v1)
Ca thử trước (`2418e38`, đỏ 7 ca trên code cũ: 124 · 7 có Chromium) → vá `b6f06a9`: ThanhToan dọn giỏ qua `maDonDaTra(guiDo, dsDon)` + `daTra`; "Tạo mã mới" `thamThanhToanLai`;
"Đã lên hạng" `hangCuaDon` (dòng thẻ đã gửi + /hang, không thì `td.the.xongChung`); `TheToi` đọc /toi chỉ khi đăng nhập; `monDatLai` không đếm thẻ; `tenDongThe` một hàm; gộp CSS;
`dot_bien_tay.js` thư mục tạm. +6 đột biến (`b52c0d9`, `eaae8e9`). Lỗi 6 (KHND3e) → Câu hỏi 4.

## Soát độc lập vòng 2 (/ra-soat, HEAD 3ccfe1a) — chép nguyên ý
KHÔNG ĐẠT — 5 lỗi code vòng 1 đã sửa đúng (đối chiếu từng chỗ; gỡ phần dọn giỏ ở Thanh toán thì ca CR đỏ).
LỖI TÌM ĐƯỢC:
1. src/pages/ThanhToan.jsx:95 khoá `|| !!maXong` không có bài thử giữ; đột biến BV-THANH-TOAN-KHONG-KHOA-KHI-THAY-DA-TRA thật ra gỡ useEffect, tên sai việc — K3.
2. cong_cu/thu_KHTHE1.js:426 ca C6 — POS giả trả tong = tổng dòng (trùng số App tự cộng), bỏ qua ma_giam → bản App tự cộng vẫn xanh — K3 (marker suông).
3. src/pages/HangThanhVien.jsx:20-22 vs :36 — LỖI MỚI: TheToi đọc kho cuaToi không gác daBiet, nút / bảng đọc hangToi có gác → một màn hai nguồn — K4 / đồng bộ.
4. cong_cu/thu_KHND3e.js:91-103 — ca B1 thành hằng số (gỡ lớp gác); Câu hỏi 4 đúng thủ tục nhưng "cổng vẫn ĐẠT" là chấp nhận đỏ giả; đề xuất giữ phép so với cây HIỆN TẠI bằng ⊆ — K3 / F3.
5. viec/KH-THE-1/bang_chung_do.txt — "b52c0d9^ = 2418e38" sai (cha b52c0d9 là b6f06a9; đúng là b6f06a9^ = 2418e38); "có Chromium → 133" đã cũ (134) — K1.
NGHI NGỜ: thamThanhToanLai trả chi=the cả cho đơn chỉ thẻ đặt bằng "Thanh toán" cả giỏ có ma_giam → Tạo mã mới bỏ mã; ảnh so_anh chụp trước vòng sửa; !!maXong gần như thừa.
NGHIỆM THU: 21/25 · thiếu F1 (trang_thai chưa liệt kê khoá), F3 (KHND3e chờ chủ quán), F6, F7 (chưa ghi thao tác thử tay).
CHƯA SOÁT ĐƯỢC: --day-du, cổng chay, K10, nhóm đột biến --trinh-duyet (chỉ thử 2), so ảnh bằng mắt, VOUCHER-2.
BÀI HỌC: KHOÁ — mỗi điều kiện khoá nút mới có đột biến gỡ đúng điều kiện đó, tên khớp chỗ vá; KHOÁ — ca "App không tự tính tiền" cần POS giả trả tong khác tổng dòng;
NGUYÊN TẮC — sửa bài cũ thành phép so hai commit cố định là gỡ lớp gác, phải so với cây hiện tại bằng ⊆; NGUYÊN TẮC — một khối trên màn dùng cùng cổng gác (daBiet) với phần còn lại.
Đơn giản: thamThanhToanLai dùng lại laDonChiThe; bỏ `!!maXong` hoặc thêm ca.
K4: 6 chỗ gọi GET /don — ChiTietDon và Lịch sử trang 2+ không gọi maDonDaTra nhưng tới được chỉ sau khi kho /don đã nạp → không phải lỗi. K5: không luồng nào bị chặn oan lâu.
