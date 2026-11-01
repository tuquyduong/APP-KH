# KH-NHANH-1 — trạng thái

## Bước 1 — đối chiếu bản chụp
- HEAD = 7d07931 · FETCH_HEAD = 7d07931 (bằng nhau, không kéo)
```
7d07931 PHIEU: KH-NHANH-1
37024c6 TIEN-DO: KH-UI-3d xong (PR #12 5ed0c1e); mo KH-NHANH-1; quyet dinh 01.11 (toc do, luu tom tat, hang); them KH-PWA-1 - so v18
5ed0c1e Merge pull request #12 from tuquyduong/viec/KH-UI-3d
```

## Chỗ vá → đột biến (dot_bien.py)
| Chỗ vá | Đột biến |
|---|---|
| ThanhToan.jsx: số dư ví chỉ từ `dungTai(layToi)` gọi sau khi mở màn (F1) | VS-TT-DUNG-SO-DU-KHO |
| ThanhToan.jsx: "Đang cập nhật số dư…" trong lúc chờ (F1) | BV-SO-DU-DANG-CAP-NHAT |
| duLieuKhach.napTomTat: chỉ bản của đúng chủ `kh_chu` (E3) | VS-TOMTAT-KHACH-KHAC |
| duLieuKhach.dungCua: mở màn chỉ lấy khi quá 5 phút (A3) | VS-TAB-GOI-LAI |
| duLieuKhach.taoCua: dùng chung lệnh đang chờ (A2) | VS-KHONG-DUNG-CHUNG-LENH |
| duLieuKhach.taoCua: bỏ kết quả phiên cũ (D4) | VS-KET-QUA-PHIEN-CU |
| duLieuKhach.taoCua: lỗi giữ bản cũ (A3) | VS-LOI-XOA-BAN-CU |
| duLieuKhach.lamMoiKhiQuayLai: quy tắc 60 giây (D1) | VS-QUAY-LAI-KHONG-SO-GIO |
| luuMay.js: `kh_tom_tat` trong danh sách xoá (E2) | VS-DANGXUAT-GIU-TOMTAT |
| tomTatLuu.rut: không giữ qr (E1) | VS-TOMTAT-CO-QR |
| ManDau.jsx: quy tắc ngày (C1) | VS-MANDAU-LAN-HAI |
| giaHang.hangCoGiam: bỏ hạng 0% (G1) | VS-HANG-0-CON-HIEN |
| UuDai.jsx TheHang lọc hạng (G1) | BV-HANG-0 |
| App.jsx tải trước bốn cửa (B1) | BV-TAI-TRUOC |
| App.jsx donPhien xoaKhoKhach (D4) | BV-XOA-KHO-KHI-DOI-PHIEN |
| App.jsx đăng nhập → doiKhach trước khi bật phiên (B2, E2) | BV-DOIKHACH-KHI-DANG-NHAP |
| App.jsx dungLamMoiNgam (D1, D2) | BV-LAM-MOI-NGAM |
| UuDai.jsx nhận mã → lamMoi diem, voucher, toi (D3) | BV-NHAN-MA-LAM-MOI |
| duLieuKhach.gopToi: bỏ hồ sơ của phiên trước (sdt khác) (D4, vòng sửa 1) | VS-GOP-HO-SO-PHIEN-CU |
| duLieuKhach.luuTomTat: giữ điểm cũ khi /diem chưa về (E3, vòng sửa 1) | VS-TOMTAT-MAT-DIEM |
| Don.jsx: trang 1 làm mới → bỏ trang sau (A4, vòng sửa 2) | VS-DON-GIU-TRANG-SAU |
| Don.jsx: so danh sách mã, không so đối tượng (A4, vòng sửa 3) | VS-DON-SO-THAM-CHIEU |

Tên đột biến: VS-TT-DUNG-SO-DU-KHO, VS-TOMTAT-KHACH-KHAC, VS-GOP-HO-SO-PHIEN-CU, VS-TOMTAT-MAT-DIEM, VS-DON-GIU-TRANG-SAU, VS-DON-SO-THAM-CHIEU, VS-TAB-GOI-LAI, VS-DANGXUAT-GIU-TOMTAT, VS-MANDAU-LAN-HAI, VS-TOMTAT-CO-QR,
VS-KHONG-DUNG-CHUNG-LENH, VS-KET-QUA-PHIEN-CU, VS-LOI-XOA-BAN-CU, VS-QUAY-LAI-KHONG-SO-GIO, VS-HANG-0-CON-HIEN, BV-TAI-TRUOC,
BV-XOA-KHO-KHI-DOI-PHIEN, BV-DOIKHACH-KHI-DANG-NHAP, BV-LAM-MOI-NGAM, BV-NHAN-MA-LAM-MOI, BV-SO-DU-DANG-CAP-NHAT, BV-HANG-0

## Soát độc lập /ra-soat — vòng 1 (agent general-purpose, chỉ đọc) — nguyên báo cáo
KHÔNG ĐẠT

Lý do chính: hai mục nghiệm thu chưa có bằng chứng ghi trong kho (H3, và một phần H1). Ngoài ra lớp chặn "khách B thấy bản tóm tắt của khách A" chỉ được bảo vệ bằng một mẫu đọc nguồn. Code chạy đúng ở mọi ca tôi chạy được: `KHONG_TRINH_DUYET=1 node cong_cu/thu_KHNHANH1.js` cho 69 đạt · 0 hỏng; chạy có Chromium cho 126 đạt · 0 hỏng (tôi tự chạy lại cả hai).

LỖI TÌM ĐƯỢC:
- viec/KH-NHANH-1/trang_thai.md (cả file, 35 dòng) — chỉ có "Bước 1" và bảng tên đột biến. KHÔNG ghi kết quả `npm test`, `--day-du`, `node tu_chay/cong.js chay`; không ghi kết quả chạy dot_bien.py (chỉ có tên, không có dòng ĐỎ/XANH, nên con số 18/18 không thấy trong kho); không ghi kết quả phần Chromium (CLAUDE.md §9 bắt ghi vào trang_thai.md). Câu "126 đạt, 18/18 bị bắt, npm test xanh" của máy chính vì vậy chưa có căn cứ trong kho. Thuộc khuôn K1, và trái LUAT §6.3.
- cong_cu/thu_KHNHANH1.js:157 + dot_bien.py (dòng VS-TOMTAT-KHACH-KHAC, cột False) — lớp chặn E3 (duLieuKhach.js `napTomTat`: `tomTatCuaKhach(docTomTat(), docChu())`) chỉ được kiểm bằng regex đọc nguồn. Không ca Chromium nào có tình huống "kh_tom_tat thuộc khách khác với kh_chu", vì DangNhap→doiKhach (App.jsx:183) đã xoá trước. Gỡ lớp chặn mà để lại đúng chuỗi đó trong chú thích thì bài vẫn xanh. `napTomTat` đọc thẳng localStorage nên không tiêm kho để thử hàm thuần được. Thuộc khuôn K3 (bài chỉ kiểm marker).
- Tương tự, các ca phần 1 ở thu_KHNHANH1.js:94, 106, 108, 109, 159, 179, 185 chỉ là regex trên nguồn; regex cũng khớp khi chuỗi nằm trong chú thích. Trên GitHub (không có trình duyệt) đây là lớp kiểm duy nhất cho B1/B2/D3 đặt đơn/D4/F1. Riêng D3 "đặt đơn → /toi, /don, /diem" (App.jsx `xongDatDon`) không có ca hành vi nào, kể cả trong Chromium. Thuộc khuôn K3.
- viec/KH-NHANH-1/doi_chieu_demo.md:3 — ghi "Không chụp so ảnh mới" dù có 3 chỗ hiện khác trên màn. CLAUDE.md §5 yêu cầu so ảnh và lưu `viec/<MÃ>/so_anh/`. Dòng "Màn mở" ở cột lý do không có mã (a)–(e); dòng G1 ghi (b) nhưng lý do thật là quyết định 01.11.

NGHI NGỜ:
- src/duLieuKhach.js `gopToi` — không có chốt `phien` như `lay()`: PUT /toi của phiên cũ về sau khi đổi phiên có thể gộp hồ sơ cũ vào kho khách mới; kho rỗng thì gọi `cua.lay()` (GET /toi không token).
- `luuTomTat` + `rutTomTat` — /toi thật về TRƯỚC /diem thì bản lưu bị ghi đè không có `points`.
- src/App.jsx `hangToi` — bản thứ hai của `/toi.hang`, chỉ đặt một lần mỗi phiên; giá theo hạng ở Menu/Giỏ không theo kho mới (có từ trước, K4).
- Mở app với token đã hết hạn: `napTomTat` hiện bản lưu (đúng chủ) ~0,4–1,4 giây trước khi 401 về.
- B1 gửi 4 cửa có token cùng lúc; token hết hạn → `donPhien` chạy 4 lần (vô hại, chưa có bài thử).
- Kho không có trường `dangTai`; suy ra trong `hienCua` — tương đương A1.

NGHIỆM THU: 25/28 mục có bằng chứng · mục thiếu: H1 (chỉ ca chuyển tab chạy 3 cỡ), H3 (không ghi kết quả npm test / --day-du / cong.js / đột biến), H4 (thử tay chủ quán).
CHƯA SOÁT ĐƯỢC: không chạy npm test, --day-du, cong.js, dot_bien.py; ba bài cũ chỉ đọc diff; không thử điện thoại thật / Zalo.
BÀI HỌC: (1) KHOÁ: napTomTat nhận kho tiêm + ca hàm thuần "chu-A vs kh_chu chu-B → kho rỗng". (2) KHOÁ: ca đọc nguồn bỏ chú thích trước khi khớp. (3) NGUYÊN TẮC: mọi chỗ ghi kho chung từ kết quả bất đồng bộ phải qua chốt phiên. (4) NGUYÊN TẮC / bộ kiểm: trang_thai.md phải có dòng kết quả thật trước khi gọi /ra-soat.

### Vòng sửa 1 (commit a90e859, 5198770)
- gopToi: kho trống → không ghi / không gọi; `sdt` POS trả khác `sdt` trong kho → bỏ (ca D4 hàm thuần mới + VS-GOP-HO-SO-PHIEN-CU).
- luuTomTat: /diem chưa thật → giữ `points` của bản lưu cũ cùng khách (ca E3 mới + VS-TOMTAT-MAT-DIEM).
- napTomTat / luuTomTat nhận kho tiêm → ca hàm thuần E3 "bản của A, máy giữ B → không gieo"; "chưa biết chủ → không gieo"; "hồ sơ không thuộc chủ → không ghi".
- Bài thử: ca đọc nguồn khớp trên src ĐÃ BỎ chú thích (`boChuThich`); ca ghi chú §6 đọc bản thô có ràng buộc ngay trên dòng `homNayMay`.
- H1: vãng lai (G1, B3), lần hai / đổi ngày (C1, E3), Thanh toán (F1) chạy 360/390/430; chụp ảnh `so_anh/` + ảnh demo; doi_chieu_demo.md ghi lý do theo sổ quyết định.
- Không nhận: `hangToi` (có từ trước, ngoài mục tiêu — ghi `## Phát hiện`); khoá phiên ManDau (giữ, lý do ở ke_hoach.md); `donPhien` 4 lần (vô hại); token hết hạn hiện bản lưu đúng chủ < 1,5 giây (ghi `## Phát hiện`).
- D3 "đặt đơn": giữ ca đọc nguồn (đã bỏ chú thích) — luồng đặt đơn thật nằm sau cờ DAT_ONLINE / cổng KH-MUA-1b, chưa dựng ca Chromium (ghi CHƯA KIỂM).

## Kết quả chạy đột biến (python3 viec/KH-NHANH-1/dot_bien.py, sau vòng sửa 1, HEAD 5198770)
```
VS-TT-DUNG-SO-DU-KHO: ĐỎ — 159 đạt · 7 hỏng
VS-TOMTAT-KHACH-KHAC: ĐỎ — 74 đạt · 2 hỏng
VS-GOP-HO-SO-PHIEN-CU: ĐỎ — 75 đạt · 1 hỏng
VS-TOMTAT-MAT-DIEM: ĐỎ — 75 đạt · 1 hỏng
VS-TAB-GOI-LAI: ĐỎ — 163 đạt · 3 hỏng
VS-DANGXUAT-GIU-TOMTAT: ĐỎ — 163 đạt · 3 hỏng
VS-MANDAU-LAN-HAI: ĐỎ — 151 đạt · 11 hỏng
VS-TOMTAT-CO-QR: ĐỎ — 160 đạt · 6 hỏng
VS-KHONG-DUNG-CHUNG-LENH: ĐỎ — 74 đạt · 2 hỏng
VS-KET-QUA-PHIEN-CU: ĐỎ — 75 đạt · 1 hỏng
VS-LOI-XOA-BAN-CU: ĐỎ — 75 đạt · 1 hỏng
VS-QUAY-LAI-KHONG-SO-GIO: ĐỎ — 75 đạt · 1 hỏng
VS-HANG-0-CON-HIEN: ĐỎ — 161 đạt · 5 hỏng
BV-TAI-TRUOC: ĐỎ — 151 đạt · 15 hỏng
BV-XOA-KHO-KHI-DOI-PHIEN: ĐỎ — 75 đạt · 1 hỏng
BV-DOIKHACH-KHI-DANG-NHAP: ĐỎ — 164 đạt · 2 hỏng
BV-LAM-MOI-NGAM: ĐỎ — 163 đạt · 3 hỏng
BV-NHAN-MA-LAM-MOI: ĐỎ — 164 đạt · 2 hỏng
BV-SO-DU-DANG-CAP-NHAT: ĐỎ — 162 đạt · 4 hỏng
BV-HANG-0: ĐỎ — 162 đạt · 4 hỏng
TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT
```

## Soát độc lập /ra-soat — vòng 2 (agent general-purpose, chỉ đọc) — báo cáo (giữ nguyên ý, gọn dòng)
KHÔNG ĐẠT — "không thấy lỗi hành vi nào trong code; trượt vì hai lỗi giấy tờ".
LỖI TÌM ĐƯỢC:
- trang_thai.md (mục Vòng sửa 1) ghi đã "ghi `## Phát hiện`" và "ghi CHƯA KIỂM" nhưng kho không có hai mục đó — K1.
- so_anh/ thiếu "ảnh tô chỗ lệch" (CLAUDE.md §5 mục 2).
NGHI NGỜ:
- Don.jsx:46–50 — trang 1 làm mới ngầm, trang sau giữ trong state → đơn rơi khỏi trang 1 (OFFSET) bị hụt một dòng tới khi mở lại.
- UuDai.jsx:37–38, :118 — nhận mã xong, danh sách "Xem tất cả" không lấy lại (gốc cũng không) — K4.
- VS-TAB-GOI-LAI chỉ bị bắt ở phần Chromium (GitHub không bắt).
- `boChuThich` bỏ chú thích nhưng marker trong CHUỖI vẫn làm xanh ca đọc nguồn B1, B2, D3 đặt đơn.
- duLieuKhach.js:61 `gopToi` so `sdt` chuỗi thô — khác định dạng thì chặn oan.
NGHIỆM THU: 24/28 · thiếu / một phần: D3 (đặt đơn chỉ đọc nguồn), H1 (vài ca chỉ 390), H3 (chờ phiên chính), H4 (thử tay chủ quán).
CHƯA SOÁT ĐƯỢC: không chạy npm test / --day-du / cong.js / dot_bien.py / Chromium; không chạy KHLUU1, KHXEM1, KHUI3d; không xem ảnh; không thử điện thoại / Zalo.
BÀI HỌC: (1) NGUYÊN TẮC — báo "đã ghi X" phải trỏ được tới X trong kho (bộ kiểm có thể grep tiêu đề). (2) KHOÁ — đột biến bắt buộc ở H3 phải bị bắt bằng phần chạy được trên GitHub. (3) NGUYÊN TẮC — kho phân trang: trang 1 làm mới thì bỏ các trang sau.

### Vòng sửa 2 (commit be270bc, 0816d7e)
- Thêm `## Phát hiện` và mục CHƯA KIỂM thật (dưới đây).
- so_anh/: `lech_thanhtoan_390.png`, `lech_uudai_390.png` + giải thích ở doi_chieu_demo.md.
- Don.jsx: trang 1 làm mới (`dau.dl` đổi) → bỏ các trang sau đã xem (`TRANG_SAU_RONG`); ca đọc nguồn + VS-DON-GIU-TRANG-SAU.
- gopToi so sdt qua `dauVet` (chuẩn hoá +84 / 0 / khoảng trắng); ca K5 "cùng số khác định dạng vẫn gộp".
- Ca đọc nguồn khoá `dungCua` → `napNeuCu` (VS-TAB-GOI-LAI giờ bắt được khi KHONG_TRINH_DUYET=1, cột False).
- Mọi ca Chromium (đăng xuất, hết phiên → B, nhận mã / ẩn hiện, hồ sơ) chạy 360/390/430 (H1).
- Không nhận: "Xem tất cả" voucher làm mới sau nhận mã (có từ trước, ngoài mục tiêu → Phát hiện); marker trong chuỗi (ca Chromium bù ở máy; D3 đặt đơn → CHƯA KIỂM).

## Phát hiện
- `src/App.jsx` `hangToi` (giá theo hạng ở Menu / Giỏ) là bản thứ hai của `/toi.hang`, chỉ đặt một lần mỗi phiên; kho `cuaToi` nay làm mới ngầm (5 phút, nhận mã, quay lại app) → hạng ở Ưu đãi / Tài khoản đổi ngay, giá theo hạng ở Menu chỉ đổi khi mở lại app. Có từ trước việc này. Đề xuất việc sau: lấy `hangToi` từ bản thật của `cuaToi` (một nguồn).
- Mở app với token đã hết hạn: bản tóm tắt (đúng chủ máy) hiện ~0,4–1,4 giây tới khi 401 về rồi ẩn. App chưa thể biết token hết hạn trước khi hỏi POS; cùng khách, cùng máy. Chủ quán biết để quyết có cần POS cửa kiểm token nhanh hơn không.
- Ưu đãi "Xem tất cả" (`?all=1`): nhận mã xong danh sách này không tự lấy lại (bản gốc cũng không); khách bấm "Chỉ xem mã còn dùng" là thấy mã mới (kho chung đã lấy lại).
- `thu_KHLUU1.js` trước việc này không đọc `KHONG_TRINH_DUYET` (CLAUDE.md §9) — đã thêm trong Phạm vi `cong_cu/thu_KH*.js`.

## Kết quả chạy đột biến sau vòng sửa 2 (HEAD 4591cc8) — 21/21 bị bắt
```
VS-TT-DUNG-SO-DU-KHO: ĐỎ — 204 đạt · 7 hỏng
VS-TOMTAT-KHACH-KHAC: ĐỎ — 77 đạt · 2 hỏng
VS-GOP-HO-SO-PHIEN-CU: ĐỎ — 78 đạt · 1 hỏng
VS-TOMTAT-MAT-DIEM: ĐỎ — 78 đạt · 1 hỏng
VS-TAB-GOI-LAI: ĐỎ — 78 đạt · 1 hỏng
VS-DON-GIU-TRANG-SAU: ĐỎ — 78 đạt · 1 hỏng
VS-DANGXUAT-GIU-TOMTAT: ĐỎ — 206 đạt · 5 hỏng
VS-MANDAU-LAN-HAI: ĐỎ — 198 đạt · 10 hỏng
VS-TOMTAT-CO-QR: ĐỎ — 205 đạt · 6 hỏng
VS-KHONG-DUNG-CHUNG-LENH: ĐỎ — 77 đạt · 2 hỏng
VS-KET-QUA-PHIEN-CU: ĐỎ — 78 đạt · 1 hỏng
VS-LOI-XOA-BAN-CU: ĐỎ — 78 đạt · 1 hỏng
VS-QUAY-LAI-KHONG-SO-GIO: ĐỎ — 78 đạt · 1 hỏng
VS-HANG-0-CON-HIEN: ĐỎ — 206 đạt · 5 hỏng
BV-TAI-TRUOC: ĐỎ — 192 đạt · 19 hỏng
BV-XOA-KHO-KHI-DOI-PHIEN: ĐỎ — 78 đạt · 1 hỏng
BV-DOIKHACH-KHI-DANG-NHAP: ĐỎ — 207 đạt · 4 hỏng
BV-LAM-MOI-NGAM: ĐỎ — 204 đạt · 7 hỏng
BV-NHAN-MA-LAM-MOI: ĐỎ — 207 đạt · 4 hỏng
BV-SO-DU-DANG-CAP-NHAT: ĐỎ — 207 đạt · 4 hỏng
BV-HANG-0: ĐỎ — 207 đạt · 4 hỏng
TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT
```

## Soát độc lập /ra-soat — vòng 3 (agent general-purpose, chỉ đọc) — báo cáo (giữ nguyên ý, gọn dòng)
KHÔNG ĐẠT — "lỗi nhẹ: một chỗ Lịch sử đơn khách nhìn thấy được, và giấy tờ ghi một mục không có thật. Đường tiền và bảo mật không thấy lỗi."
LỖI TÌM ĐƯỢC:
- src/pages/Don.jsx:50 `useEffect(…, [dau.dl])` — mỗi lần làm mới ngầm `dl` là đối tượng mới dù nội dung y cũ → xoá các trang khách đã bấm "Xem thêm" (5 phút, quay lại app, mở màn khi bản cũ) — K5.
- trang_thai.md:113 ghi "Thêm `## Phát hiện` và mục CHƯA KIỂM thật (dưới đây)" nhưng không có mục CHƯA KIỂM — K1.
- thu_KHNHANH1.js:112, :128 — Don.jsx viết lại chỉ có ca đọc nguồn, không ca Chromium "Xem thêm" — K3.
NGHI NGỜ: kết quả Chromium sau vòng sửa 2 chưa ghi; Don.jsx đang chờ trang 2 mà trang 1 làm mới → có thể gọi trùng trang 2 (lọc trùng `ma` che được); TaiKhoan.jsx:40 hiện " · Hạng Vàng" có dấu phân cách đứng đầu khi đang hiện bản lưu (~1 giây); tên ca Chromium lan-hai… không ghi [rong].
NGHIỆM THU: 25/28 · thiếu: A4 (Lịch sử đơn mất trang khi làm mới ngầm), H3 (chờ phiên chính), H4 (thử tay chủ quán). D3 "đặt đơn" chỉ đọc nguồn vì DAT_ONLINE còn tắt — đạt kèm ghi chú, phải ghi CHƯA KIỂM thật.
CHƯA SOÁT ĐƯỢC: không chạy npm test, --day-du, cong.js, dot_bien.py, Chromium; không xem ảnh; không thử điện thoại / Zalo.
BÀI HỌC: NGUYÊN TẮC — đặt lại state theo dữ liệu làm mới ngầm phải so NỘI DUNG, không so tham chiếu. KHOÁ — màn đổi mô hình state phải có ít nhất một ca hành vi. KHOÁ (bộ kiểm) — mỗi "ghi X / (dưới đây)" phải grep ra tiêu đề X (lặp ba vòng).

### Vòng sửa 3 (commit 1b4414a) — vòng sửa CUỐI (so_vong_sua_toi_da = 3)
- Don.jsx: chỉ bỏ trang sau khi DANH SÁCH MÃ trang 1 đổi (`khoaTrang1` + `useRef`); lần nạp đầu không bỏ. Ca Chromium mới `lich-su-don-{360,390,430}`:
  "Xem thêm" → trang 2; làm mới ngầm không có đơn mới → trang 2 còn; có đơn mới → hiện đơn mới, bỏ trang sau, còn "Xem thêm". Đột biến VS-DON-GIU-TRANG-SAU, VS-DON-SO-THAM-CHIEU (bản lỗi vòng 2).
- TaiKhoan.jsx: dòng phụ ghép bằng `filter(Boolean).join(' · ')` — không còn dấu phân cách thừa khi đang hiện bản lưu (chưa có sdt).
- Mục `## Chưa kiểm` dưới đây (thật). Kết quả Chromium ghi ở mục "Kết quả kiểm".

## Chưa kiểm
- D3 "đặt đơn → /toi, /don, /diem" (`App.jsx` `xongDatDon` gọi `lamMoi([cuaToi, cuaDon, cuaDiem])`): chỉ có ca đọc nguồn (đã bỏ chú thích) + đột biến không có. Luồng đặt đơn thật còn tắt (cờ DAT_ONLINE, cổng KH-MUA-1b) nên chưa dựng ca Chromium đặt đơn → kiểm khi KH-MUA-1b bật cờ.
- Marker trong CHUỖI vẫn làm xanh ca đọc nguồn B1 / B2 / D3 trên GitHub (không trình duyệt); ở máy các ca Chromium B1 / B2 bù lại.
- Điện thoại thật, trình duyệt Zalo, mạng chậm thật (POS thật ~400 ms / vòng) — chủ quán thử tay (H4).
- ManDau hiện theo đồng hồ máy: máy khách sai giờ thì màn mở có thể hiện / không hiện lệch ngày (ngoại lệ §6 có chủ đích, chỉ hiệu ứng).

## Kết quả chạy đột biến sau vòng sửa 3 (HEAD 4f7f668) — 22/22 bị bắt
```
VS-TT-DUNG-SO-DU-KHO: ĐỎ — 216 đạt · 7 hỏng
VS-TOMTAT-KHACH-KHAC: ĐỎ — 77 đạt · 2 hỏng
VS-GOP-HO-SO-PHIEN-CU: ĐỎ — 78 đạt · 1 hỏng
VS-TOMTAT-MAT-DIEM: ĐỎ — 78 đạt · 1 hỏng
VS-TAB-GOI-LAI: ĐỎ — 78 đạt · 1 hỏng
VS-DON-GIU-TRANG-SAU: ĐỎ — 219 đạt · 4 hỏng
VS-DON-SO-THAM-CHIEU: ĐỎ — 219 đạt · 4 hỏng
VS-DANGXUAT-GIU-TOMTAT: ĐỎ — 218 đạt · 5 hỏng
VS-MANDAU-LAN-HAI: ĐỎ — 201 đạt · 13 hỏng
VS-TOMTAT-CO-QR: ĐỎ — 217 đạt · 6 hỏng
VS-KHONG-DUNG-CHUNG-LENH: ĐỎ — 77 đạt · 2 hỏng
VS-KET-QUA-PHIEN-CU: ĐỎ — 78 đạt · 1 hỏng
VS-LOI-XOA-BAN-CU: ĐỎ — 78 đạt · 1 hỏng
VS-QUAY-LAI-KHONG-SO-GIO: ĐỎ — 78 đạt · 1 hỏng
VS-HANG-0-CON-HIEN: ĐỎ — 218 đạt · 5 hỏng
BV-TAI-TRUOC: ĐỎ — 204 đạt · 19 hỏng
BV-XOA-KHO-KHI-DOI-PHIEN: ĐỎ — 78 đạt · 1 hỏng
BV-DOIKHACH-KHI-DANG-NHAP: ĐỎ — 219 đạt · 4 hỏng
BV-LAM-MOI-NGAM: ĐỎ — 210 đạt · 13 hỏng
BV-NHAN-MA-LAM-MOI: ĐỎ — 219 đạt · 4 hỏng
BV-SO-DU-DANG-CAP-NHAT: ĐỎ — 219 đạt · 4 hỏng
BV-HANG-0: ĐỎ — 219 đạt · 4 hỏng
TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT
```

## Soát độc lập /ra-soat — sau vòng sửa 3 (lần soát cuối) — báo cáo (giữ nguyên ý, gọn dòng)
ĐẠT (có điều kiện) — "Code không còn lỗi hành vi… lỗi giấy tờ tự đóng khi phiên chính ghi kết quả vào trang_thai.md đúng tên mục đã hứa, kèm số Chromium. Không cần thêm vòng sửa code."
LỖI TÌM ĐƯỢC: trang_thai.md hứa mục "Kết quả kiểm" (Chromium sau vòng sửa 3 = 223 đạt) nhưng chưa có — K1 (đóng bằng mục `## Kết quả kiểm` dưới đây).
NGHI NGỜ (không làm trượt): Don.jsx `xemThem` đang chờ trang 2 mà trang 1 đổi mã → trang 2 cũ vẫn nối vào (hiếm, chỉ hiển thị); TaiKhoan.jsx:40 bản lưu có hạng mà `ten` lạ → "Hạng null" (gốc cũng vậy); VS-DON-* ghi cột True dù ca đọc nguồn có thể đã bắt; D3 đặt đơn chỉ đọc nguồn (đã ghi `## Chưa kiểm`). Đã soát `khoaTrang1` + `useRef` theo 5 tình huống: đúng.
NGHIỆM THU: 26/28 · thiếu: H3 (chờ phiên chính — xem `## Kết quả kiểm`), H4 (thử tay chủ quán).
CHƯA SOÁT ĐƯỢC: không chạy Chromium / dot_bien / npm test / --day-du / cong.js; không xem ảnh; không thử điện thoại / Zalo.
BÀI HỌC: KHOÁ (bộ kiểm) — "ghi ở mục X" phải grep ra tiêu đề X (lặp bốn vòng). NGUYÊN TẮC — lệnh bất đồng bộ do màn tự gửi phải bị bỏ khi trạng thái nền đổi (chốt `phien`).

Sau lần soát này (không đổi src): bộ kiểm cắt mỗi bài ở 120 giây (`kiem_tra_truoc_khi_giao.js:136`) — bài mới sau vòng sửa 3 chạy quá giờ nên bị cắt.
Sửa ở bài thử (7e830f3): các ca không đo thời gian chặt chạy ba cỡ màn song song; ca chuyển tab (< 300 ms) vẫn lần lượt → 51 giây, 223 đạt · 0 hỏng.
Đột biến chạy lại trên bản bài này: 22/22 ĐỎ ("TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT").

## Kết quả kiểm (HEAD cc0a2f2, cây sạch)
- `node kiem_tra_truoc_khi_giao.js --day-du` (gồm npm test + vite build): **30 đạt · 0 hỏng** — thu_KHNHANH1 223 đạt · 0 hỏng, thu_KHLUU1 33, thu_KHUI3d 172, thu_KHXEM1 61, mọi bài khác xanh; "vite build thành công", "dist/index.html trỏ tới file có thật".
- Phần Chromium của bài mới (CLAUDE.md §9, chạy thật ở máy): `node cong_cu/thu_KHNHANH1.js` → 223 đạt · 0 hỏng, 51 giây; với KHONG_TRINH_DUYET=1 → 79 đạt · 0 hỏng (= SỐ CA).
- Đột biến: 22/22 ĐỎ (bảng ở mục "Kết quả chạy đột biến sau vòng sửa 3"; chạy lại sau 7e830f3 cũng 22/22).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 7d07931^ HEAD viec/KH-NHANH-1`:
  · CẢNH BÁO A16: `cong_cu/thu_KHNHANH1.js` chạy trên gốc in 11 ca ≠ 79 ca ở head — bài dừng sớm trên gốc (thiếu mô-đun duLieuKhach / tomTatLuu / ngayManDau) — đúng bằng chứng đỏ.
  ✓ CỔNG CHẠY ĐẠT
  (lần chạy trước đó ✗ [A16] ×4: dòng SỐ CA thiếu đường dẫn `cong_cu/…js` — đã sửa ở cc0a2f2.)

## Bài học (bước 11)
| Sự cố | Ngăn | Lý do / đề xuất |
|---|---|---|
| Giấy tờ hứa "đã ghi X" mà không có X — lặp 4 vòng soát (Phát hiện, CHƯA KIỂM, Kết quả kiểm) | KHOÁ (ngoài Phạm vi) | Đề xuất `kiem_tra_truoc_khi_giao.js` hoặc cổng: trong `viec/<MÃ>/trang_thai.md`, mỗi cụm "ghi `## X`" / "ở mục \"X\"" phải có tiêu đề `## X`; ca đỏ: trang_thai.md của vòng soát 2 bản 1fa233d~1 (hứa CHƯA KIỂM, không có). |
| Bài thử vượt 120 giây bị bộ kiểm cắt, báo đỏ khó hiểu ("xanh (✓ ca …)") | KHOÁ (ngoài Phạm vi) + NGUYÊN TẮC | Đề xuất bộ kiểm in "QUÁ 120 GIÂY" khi `r.signal`/`r.error` là ETIMEDOUT; khuôn mới K4 "Bài thử Chromium dài": mỗi bài < 120 giây, cỡ màn chạy song song ở ca không đo giờ. |
| Đặt lại state theo tham chiếu dữ liệu làm mới ngầm (Don.jsx vòng 2) xoá trang khách đang xem | NGUYÊN TẮC | Khuôn mới K5 (đề xuất cho KHUON_LOI.md): "Làm mới ngầm luôn tạo đối tượng mới — so NỘI DUNG (danh sách mã), không so tham chiếu"; ví dụ thật: VS-DON-SO-THAM-CHIEU. |
| Ghi vào kho chung sau `await` không qua chốt phiên (gopToi vòng 1) | NGUYÊN TẮC | Đề xuất K6: "mọi `kho.dat` sau lệnh bất đồng bộ phải qua chốt phiên / so chủ (sdt qua dauVet)"; ví dụ: VS-GOP-HO-SO-PHIEN-CU. |
| Ca đọc nguồn khớp marker trong chú thích | KHOÁ (đã làm trong Phạm vi) | `boChuThich` ở thu_KHNHANH1.js; đề xuất dời hàm này vào một chỗ dùng chung cho mọi `thu_*.js` (việc sau). |
| Stop hook chạy bộ kiểm đúng lúc dot_bien.py đang sửa src → báo đỏ giả (3 lần) | BỎ? → KHOÁ (ngoài Phạm vi) | Đề xuất dot_bien.py chạy trên bản chép ở nháp thay vì sửa tại chỗ (khung tu_chay, sau khai trương). |
| Người gác chặn: B-PHANTICH ×4 (lệnh chạy script ghép `&&`, `$'…'`), B-CHUONGTRINH ×4 (`until`, `while`, `for`, `pgrep`, `time`), B-DICHCHU, SED-I, GIT-LENH (`worktree`) | BỎ | Luật đã rõ; làm lại theo hướng dẫn, không lách. |
| Ca E3 "hiện ngay" chập chờn khi hai Chromium chạy cùng lúc | BỎ | Đã nới khoảng đo (POS giả 1500 ms ở lần mở thứ hai). |
Vượt ngân sách: app ~280 dòng thêm (ngân sách ~250), thử ~520 dòng (ngân sách ~350) — do ba vòng sửa sau soát (ca hàm thuần E3 / gopToi, ca Lịch sử đơn, 3 cỡ màn cho mọi ca).

## Báo cáo 7 mục
1. **VIỆC** — KH-NHANH-1: kho dữ liệu khách dùng chung, tải trước khi mở app, cập nhật ngầm, bản tóm tắt trên máy, màn mở một lần mỗi ngày, Thanh toán luôn lấy số dư mới, ẩn hạng 0%.
2. **ĐÃ SỬA** — mới: `src/duLieuKhach.js` (taoCua / dungCua / lamMoi / xoaKhoKhach / gopToi / napTomTat / luuTomTat / dungLamMoiNgam), `src/tomTatLuu.js`, `src/ngayManDau.js`;
   đổi: App.jsx (tải trước, xoá kho khi đổi phiên, doiKhach lúc đăng nhập, làm mới sau đặt đơn), TaiKhoan / TrangChu / UuDai / HoSo / ManQR / Don (đọc kho), ThanhToan ("Đang cập nhật số dư…"),
   DangNhap (trả hồ sơ), ManDau (quy tắc ngày), luuMay (`kh_tom_tat` + `docChu`), giaHang (`hangCoGiam`).
3. **BÀI THỬ** — thu_KHNHANH1.js mới (đỏ trên gốc 4 đạt · 7 hỏng; xanh 79 / 223); sửa thu_KHLUU1 (+ đọc KHONG_TRINH_DUYET), thu_KHXEM1, thu_KHUI3d (đỏ trên gốc, bang_chung_do.txt). Đột biến 22/22.
   Nghiệm thu từng mục (thu_KHNHANH1.js):
   - A1 kho chung 4 cửa, màn đọc kho — ca "A1 bốn kho chung…", "A1 các màn đọc kho…", "A1 kho mới…"
   - A2 không gọi trùng — "A2 hai lệnh khi cửa đang chờ…" + Chromium "B1 … mỗi cửa đúng MỘT lần"
   - A3 hiện ngay, cập nhật sau, lỗi giữ bản cũ — "A3 có dl mà đang lấy ngầm…", "A3 lỗi khi đã có dữ liệu…", "A3 chưa từng có…", "A3 napNeuCu…", Chromium "A3 [rong] … 3 vòng → KHÔNG gọi thêm", "< 300 ms"
   - A4 voucher ?all, /don trang ≥ 2 gọi khi bấm — "A4 …layVoucher(true)", Chromium "A4 [rong] Xem thêm…" ×3 ca
   - A5 không đổi cửa / thư viện, api.js duy nhất — "A5 api.js vẫn là chỗ DUY NHẤT gọi mạng", bộ kiểm K1/K6
   - B1 tải trước 4 cửa + công khai — Chromium "B1 [rong] … mỗi cửa đúng MỘT lần", "B1 /don tải trước là trang 1"
   - B2 vừa đăng nhập → tải trước — Chromium "B2 vừa đăng nhập → tải trước…" ×3
   - B3 vãng lai không gọi cửa token — Chromium "B3 [rong] chưa đăng nhập…"
   - C1 màn mở lần đầu mỗi ngày — "C1 chưa xem → hiện…", Chromium "C1 lần mở đầu tiên…", "C1 mở lần 2 cùng ngày → KHÔNG…", "C1 đổi ngày → có màn mở"
   - C2 ngày giờ VN theo máy + ghi chú ngoại lệ — "C2 ngày theo giờ VN…", "C2 ghi chú ngoại lệ §6…"
   - C3 kho chặn → hiện — "C3 kho bị chặn → không vỡ…"
   - D1 quay lại sau 60 giây — "D1 quay lại sau 10 / 61 giây", Chromium "D1 ẩn 10 / 61 giây"
   - D2 mỗi 5 phút — Chromium "D2 app đang hiện → làm mới… mỗi 5 phút"
   - D3 sau thao tác — nhận mã: Chromium "D3 nhận mã hoá đơn → /diem, /voucher, /toi"; hồ sơ: "D3 lưu hồ sơ…", Chromium "D3 lưu xưng hô → PUT, không GET lại"; đặt đơn: chỉ đọc nguồn (`## Chưa kiểm`)
   - D4 đổi phiên xoá kho — "D4 xoá…", "D4 kết quả của phiên cũ về muộn → bị bỏ", "D4 … gopToi", Chromium "D4 đăng nhập khách B … không lúc nào thấy số của A"
   - E1 chỉ lưu đủ trường — "E1 chỉ giữ…", "E1 KHÔNG có sdt / qr…", Chromium "E1 có bản tóm tắt…"
   - E2 xoá khi đăng xuất / khác khách, giữ khi 401 — "E2 bấm Đăng xuất…", "E2 người đăng nhập sau là khách khác…", Chromium "E2 đăng xuất → không còn kh_tom_tat", "E2 hết phiên (401) → GIỮ…"
   - E3 chỉ hiện bản của đúng khách — "E3 bản lưu của khách A, máy đang giữ khách B → KHÔNG gieo", "E3 đúng chủ → gieo…", Chromium "E3 điểm + tên hiện NGAY…", "E3/D4 sau 401, khách B…"
   - E4 chỉ hiển thị — "E4/F1 Thanh toán không đọc kho / bản lưu", "E4 bản lưu chỉ đọc ở duLieuKhach"
   - E5 kho chặn — "E5 kho bị chặn → không vỡ, ghi trả false…"
   - F1 Thanh toán lấy /toi mới, ví khoá khi chờ — "F1 trong lúc chờ…", Chromium "F1 [rong] …" ×3 ca × 3 cỡ
   - F2 Theo dõi / Chi tiết đơn không đọc kho — "F2 Theo dõi đơn, Chi tiết đơn không đọc kho"
   - G1 ẩn hạng 0% — "G1 bỏ hạng phan_tram = 0…", Chromium "G1 [rong] bảng hạng vãng lai không hiện hạng 0%"
   - G2 không còn hạng → ẩn thẻ — "G2 không còn hạng nào → []"
   - H1 bài hai phần, 360/390/430 — thu_KHNHANH1.js (mọi ca Chromium chạy 3 cỡ)
   - H2 SỐ CA theo KHONG_TRINH_DUYET — "H2 bài đọc KHONG_TRINH_DUYET", bang_chung_do.txt (79 / 21 / 61 / 32)
   - H3 npm test, --day-du, cổng; đột biến VS- ≥ 5 (đủ 6 loại phiếu đòi) — mục "Kết quả kiểm", 22/22
   - H4 chủ quán thử tay — chưa làm (xem dưới)
4. **ĐÃ RÀ K4** — grep `layToi|layDiem|layVoucher|layDon|dungTai(` ngoài api.js: còn ThanhToan.jsx (F1 cố ý), Don.jsx trang ≥ 2 + Chi tiết đơn (A4, F2), UuDai.jsx `?all` (A4), KiemKhop.jsx (trang kiểm cửa, KH-KHOP-1). `hangToi` (App.jsx) ghi `## Phát hiện`.
5. **CHƯA KIỂM** — xem `## Chưa kiểm`: D3 đặt đơn (cờ DAT_ONLINE tắt), marker trong chuỗi trên GitHub, điện thoại / Zalo / mạng thật, đồng hồ máy sai giờ.
   **Chủ quán thử tay (H4):** (1) mở app lần đầu trong ngày → có màn mở → bấm qua lại Trang chủ / Ưu đãi / Tài khoản: không còn khung xám; (2) đóng hẳn app, mở lại → vào thẳng, tên + điểm + ví hiện ngay; (3) ra quầy nhận điểm, mở lại app → trong ~1–2 giây số điểm tự đổi.
6. **GIT** — nhánh viec/KH-NHANH-1, từ 7d07931 (PHIEU) tới HEAD dưới đây; đã push `git push -u origin viec/KH-NHANH-1`. Không merge, không PR.
7. **BÀI HỌC** — xem `## Bài học`: 2 đề xuất KHOÁ ngoài Phạm vi (bộ kiểm: "ghi mục X" phải có X; báo rõ khi bài quá 120 giây), 2 đề xuất NGUYÊN TẮC cho KHUON_LOI.md (so nội dung không so tham chiếu; chốt phiên khi ghi kho sau await). Máy không tự sửa file ngoài Phạm vi.
