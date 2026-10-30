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

## Soát độc lập vòng 1 (`/ra-soat`, agent general-purpose) — báo cáo chép nguyên
```
KHÔNG ĐẠT

Đã tự chạy: KHONG_TRINH_DUYET=1 node cong_cu/thu_KHMUA1.js → 54 đạt · 0 hỏng; npm test → 24 đạt · 0 hỏng (thu_KHMUA1 có trình duyệt 115 · 0);
git ls-files dist = 0; KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 58277e2^ HEAD viec/KH-MUA-1 → ĐẠT (chạy không biến đó, máy có Playwright → ĐỎ A16 54≠115,
đúng như CLAUDE.md §9 dự báo, không tính là lỗi).

LỖI TÌM ĐƯỢC:
1. src/App.jsx:169 + src/pages/Don.jsx:64,76 + src/datDon.js:171-179 — Nút "Đặt lại" ở Lịch sử đơn chạy THẬT (không qua cờ DAT_ONLINE), gọi layChiTietDon có thật, nhưng
   hợp đồng v2 (HOP_DONG_API_KH.md:38) mon[] { ten, so_luong, don_gia, thanh_tien, ghi_chu } KHÔNG có `ma` → với POS thật hôm nay monDatLai bỏ qua mọi món: khách bấm
   "Đặt lại" nhận thông báo sai "N món không còn bán, đã bỏ qua" và bị đưa tới giỏ trống (đơn có mon rỗng: vaoGio('') đưa tới giỏ không lời). Bài thử không bắt vì POS giả
   có `ma` trong mon[] (thu_KHMUA1.js:227). Q5 có ghi nhưng nút vẫn sống — K3 / K1. Sửa: chỉ hiện nút khi DAT_ONLINE (hoặc khi mon[] có ma).
2. src/pages/GioHang.jsx:59,75 — "✓ Đã áp dụng" chỉ so mã đã nhập với chữ trong ô, không lấy từ bao-gia. Cờ tắt: khách gõ mã bất kỳ cũng thấy "✓ Đã áp dụng". Cờ bật mà
   POS từ chối mã vẫn hiện "Đã áp dụng". Trái B4 — K3; doi_chieu_demo.md ghi "y demo; mã gửi trong báo giá" — K1.
3. src/pages/ThanhToan.jsx:49 + src/components/PinSheet.jsx:37 — Trả ví mà mất mạng (MANG_LOI) lúc POST /don: câu NHAC_MAT_MANG bị `cachTra !== 'vi'` bỏ đi; PinSheet xoá
   chấm, hiện lỗi, mời nhập PIN lại → POST /don lần hai, có thể TRỪ VÍ HAI LẦN. Đường tiền, trái B8. Bài thử không có ca mất mạng (cổng tiêm fetch thẳng, không bao giờ
   MANG_LOI) — K4 / K5.
4. src/pages/GioHang.jsx:42,57 + src/App.jsx:67 — Hợp đồng v2 `/menu` cần token (HOP_DONG:34). Khách chưa đăng nhập → ds = [] → mọi dòng giỏ "Món đã ngừng bán", không giá;
   duocThanhToan false → "Tiếp tục" khoá: khách không sang đăng nhập được từ giỏ (A4 chặn oan) — xảy ra thật với giỏ còn lại sau 401. Menu đang tải / lỗi mạng cũng hiện
   "Món đã ngừng bán". Bài thử không bắt vì POS giả trả /menu không cần token (thu_KHMUA1.js:209) — K5 + K3.
5. src/App.jsx:90 (donPhien 401) và :97 (doiKhach đã xoá) — không dọn maGiam và donMoi.current (chỉ dangXuat :126 dọn). Khách B đăng nhập sau 401 của A trên cùng máy thừa
   hưởng mã giảm A đã gõ; donMoi còn QR của đơn A — K4.
6. src/pages/Don.jsx:64,80 — lỗi "Đặt lại" đổ vào datLoi của danh sách: khung lỗi che danh sách, "Thử lại" gọi tai(trang + 1) (tải trang kế, không đặt lại) — nhỏ.
7. viec/KH-MUA-1/trang_thai.md — chưa ghi kết quả `node tu_chay/cong.js chay` (LUAT §6.3, phiếu E4); không có mục chủ quán thử tay 1–3 bước (LUAT §6.4, E6).
   ke_hoach.md:38,45 nói `bangTien(baoGia)`, `loiDatDon` — không có trong src/. E1 đòi phần 1 thử "map lỗi" — không ca nào — K1.

NGHI NGỜ:
- src/datDon.js:137-139 chặn cả khi dang_mo === false (theo phiếu B6) nhưng hợp đồng :54 "KH-MUA-1 chặn theo nhan_don"; có thể nhan_don true mà dang_mo false → chặn oan.
- src/dungDatDon.js: khi `bat` chuyển false, hẹn giờ gộp đã đặt không huỷ → vẫn gọi bao-gia một lần (kết quả bỏ). Hại ít.
- Ca marker suông ở phần 1 (tính vào SỐ CA GitHub): /tab-so/ (:41), /VeQR/, /LIEN_HE/ (:178-179), regex PIN không lưu một dòng (:177). Phần 2 bù, GitHub không chạy.
- dot_bien.py chỉ đụng hàm thuần, không đụng điều kiện ở màn (viDuoc, khoa, cachTra !== 'vi').
- §8 "401: giữ dữ liệu nhưng không hiện khi chưa đăng nhập" lệch A4: giỏ của A (kể cả ghi chú) hiện cho người vãng lai sau 401 — phiếu chọn có chủ ý, chủ quán nên xác nhận.
- "Tạo mã mới" chỉ thử chữ có hiện; "Gọi quán để huỷ" chỉ thử ẩn. Với GET /don/:ma v2 (chưa tien_trinh, tt = '') màn hiện "Chờ thanh toán" + nút gọi, hỏi lại mãi 10 giây (khi cờ bật).

NGHIỆM THU: 19/25 có bằng chứng đủ · thiếu / chưa đủ: B2 (lùi, Q3), B4 (lỗi 2), B8 (lỗi 3), C3 (lỗi 1), E4 (chưa ghi cổng), E6 (thiếu thử tay).
CHƯA SOÁT ĐƯỢC: không xem ảnh so demo, không chạy --day-du, không chạy dot_bien.py, không biết POS thật có mở /menu cho khách chưa đăng nhập, chưa thử trình duyệt Zalo thật.
BÀI HỌC:
- KHOÁ: POS giả của bài thử dựng từ khối HOP_DONG_MAY_DOC (đúng auth, đúng trường từng cửa; cửa "dự kiến" đánh dấu riêng) → lỗi 1, 4 đã bị bắt.
- KHOÁ: nút gọi cửa / đọc trường "dự kiến" phải sau cờ DAT_ONLINE; ca "cờ tắt → không có nút Đặt lại".
- KHOÁ: cổng tiêm của bài thử dùng `goi` thật của api.js để thử MANG_LOI / 401; ca "ví + mất mạng → không mời nhập PIN lại".
- NGUYÊN TẮC: chữ báo trạng thái ("Đã áp dụng", "không còn bán") chỉ dựa trên câu trả lời của POS, không dựa trên việc khách đã bấm.
- NGUYÊN TẮC: mọi đường dọn phiên (đăng xuất / 401 / đổi khách) dọn cùng một bộ trạng thái — gom một hàm.
```

## Sửa vòng 1 (commit 7b793af, 537d3e0)
| Lỗi | Sửa | Bài thử (thu_KHMUA1.js, phần 2) |
|---|---|---|
| 1 Đặt lại với hợp đồng v2 | App truyền `datLai` cho Lịch sử đơn CHỈ khi `DAT_ONLINE`; đơn không có món đặt lại được → thông báo, không sang giỏ trống | ca `co-tat-dat-lai` (cờ tắt → 0 nút) |
| 2 "Đã áp dụng" | chỉ khi `bg.giam` có dòng | ca `ma-khong-giam` + ca `bam-doi-gop` (có dòng → "Đã áp dụng") |
| 3 ví + mất mạng | MANG_LOI khi trả ví → đóng bảng PIN, hiện lời + "xem Lịch sử đơn", không gửi lại | ca `vi-mat-mang` (cổng của bài thử đổi lỗi fetch → MANG_LOI như api.js) |
| 4 giỏ khi chưa có menu | chưa có menu: không cảnh báo "ngừng bán", tên = mã, "Tiếp tục" vẫn bấm (Thanh toán kiểm lại khi có menu); không hỏi báo giá khi chưa có menu | ca `khach-menu-can-dn` (POS giả đòi token cho /menu) |
| 5 dọn phiên | `donPhien` (401 + đăng xuất) dọn `maGiam`, `donMoi`; `doiKhach` xoá → dọn `maGiam`. Giỏ vẫn GIỮ khi 401 (§8) | (đọc code App.jsx `donPhien`) |
| 6 lỗi Đặt lại | lỗi hiện bằng thông báo nổi (App `datThongBao`), không đè danh sách | — |
| 7 giấy tờ | ke_hoach.md sửa tên hàm; doi_chieu_demo.md sửa dòng mã giảm + Đặt lại; cổng + thử tay ghi dưới | — |
- Nghi ngờ `dang_mo`: GIỮ theo phiếu B6 ("nhan_don === false / dang_mo === false") — ghi Q7.
- Đột biến ở màn: thêm `DOT_BIEN_MAN` (chạy `python3 viec/KH-MUA-1/dot_bien.py man`, cần Chromium): VS-VI-MAT-MANG-MOI-NHAP-PIN, BV-DAT-LAI-KHONG-QUA-CO,
  VS-DA-AP-DUNG-THEO-O-NHAP, BV-KHOA-GIO-KHI-CHUA-CO-MENU.

## Câu hỏi (thêm sau soát)
- Q7 (B6): phiếu chặn cả `dang_mo === false`, hợp đồng v2 nói KH-MUA-1 chặn theo `nhan_don` (ca nối chuỗi: có thể `nhan_don` true mà `dang_mo` false). Giữ theo phiếu;
  chủ quán / POS xác nhận có trường hợp đó không — nếu có thì bỏ điều kiện `dang_mo`.
- Q8 (§8 ↔ A4): sau 401 giỏ (kể cả ghi chú) vẫn hiện khi chưa đăng nhập — vì khách vãng lai cũng có giỏ. Chủ quán xác nhận.

## Chủ quán thử tay (cờ tắt, ≤ 3 bước — phiếu E6)
1. Chưa đăng nhập: mở một món ở Menu → bấm "+" cho số lượng 2 → "Thêm vào giỏ" → tab Giỏ hàng hiện số 2.
2. Ở Giỏ hàng bấm "Tiếp tục · chọn cách nhận hàng" → màn Đăng nhập → đăng nhập xong về đúng màn Thanh toán.
3. Ở Thanh toán: nút cuối là "Đặt online sắp mở — mời bạn đặt tại quầy", không có số "Tổng cộng" (chỉ "Tổng tiền sẽ hiện khi quán xác nhận").

## Đột biến ở màn (vòng 1) — `python3 viec/KH-MUA-1/dot_bien.py man` (có Chromium)
```
VS-VI-MAT-MANG-MOI-NHAP-PIN: ĐỎ — 119 đạt · 1 hỏng
BV-DAT-LAI-KHONG-QUA-CO: ĐỎ — 119 đạt · 1 hỏng
VS-DA-AP-DUNG-THEO-O-NHAP: ĐỎ — 119 đạt · 1 hỏng
BV-KHOA-GIO-KHI-CHUA-CO-MENU: ĐỎ — 118 đạt · 2 hỏng
TẤT CẢ ĐỘT BIẾN ĐỀU BỊ BẮT
```
- Sự cố: hook dừng phiên chạy `npm test` ĐÚNG lúc script đột biến đang sửa tạm `src/` → đỏ giả (thu_KHMUA1 119·1). Chạy lại trên cây sạch: thật sự đỏ chỉ
  `thu_KHLUU1.js` B3 (regex `doiKhach\([^;]*; tnGoc\.nap\(\)` — bản sửa vòng 1 chèn khối `{ …; … }`). Sửa App cho đúng dạng cũ (`docLaiGio()`, commit 5f2d6a1),
  không đụng bài cũ. `--day-du` lại: 26 đạt · 0 hỏng; thu_KHMUA1.js có Chromium 120 đạt · 0 hỏng.
