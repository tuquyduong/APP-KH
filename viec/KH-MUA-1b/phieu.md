# KH-MUA-1b — Bật đặt đơn online theo hợp đồng v5: nối cửa thật, chống đặt trùng, gửi lại an toàn, ví + QR

<!-- Chat App KH soạn 02.11.2026. Việc TIỀN [T], Opus. Hạn 04.11. Làm SAU KH-NHANH-1 (đã gộp, PR #13 7e7f92a).
     POS đã gộp KH-MUA-1 (hợp đồng v5); máy chủ thật đang chạy v5. Chat chép NGUYÊN VĂN hợp đồng v5 (lần sửa cuối bbb0892, vẫn nguyên ở main POS d1b57b8) vào
     viec/KH-MUA-1b/hop_dong_v5.md (commit PHIEU chỉ được đụng viec/<MÃ>/).
     KH-MUA-1 (App, đã gộp) dựng sẵn giỏ / Thanh toán / Theo dõi đơn theo tên DỰ KIẾN, cờ `DAT_ONLINE = false`, cổng `datCongDatDon` (src/datDon.js).
     Lệch v5 phải sửa: không có `khoa_gui`, `tong_da_xem`, `vi_qr`; `chuaTaoDon` chỉ là danh sách vài mã (v5: MỌI 4xx = chưa tạo);
     đọc `trang_thai` thay `tien_trinh`; QR chỉ giữ trong bộ nhớ trang.
     Câu hỏi còn treo của KH-MUA-1 (viec/KH-MUA-1/trang_thai.md) nay POS đã trả lời trong v5:
       Q4 ví một phần → `vi_qr`; Q5 `mon[].ma` có; Q6 `qr` trong GET /don/:ma; Q9 `giam[].loai`; Q10 luật 4xx + `khoa_gui`.
     Trao đổi đã chốt: thiet_ke/trao_doi/TRA_LOI_POS_31102026_b.md, _c.md, _d.md.
     Quyết định áp dụng (thiet_ke/QUYET_DINH_APPKH.md): 31.10 thêm món xong QUAY LẠI trang trước (không nhảy vào giỏ), "Đặt lại" vẫn vào giỏ;
     30.10 / 31.10 đặt đơn online đủ trước khai trương; 01.11 Thanh toán luôn lấy số dư mới. -->

**Chờ duyệt kế hoạch:** viết `viec/KH-MUA-1b/ke_hoach.md`, commit, push, rồi DỪNG ở bước 3 của `/lam-viec`.

## Mục tiêu
Khách đặt đơn nhận tại quán trên App và trả bằng QR, ví hoặc ví + QR. Mọi số tiền lấy nguyên từ POS.
Không bao giờ tạo hai đơn cho một lần bấm. Không bao giờ để khách vô tình đặt lại khi đơn trước có thể đã tạo.
Sau việc này bật `DAT_ONLINE = true`.

## Nghiệm thu

### A. Hợp đồng v5 trong kho
- A1 Chép `viec/KH-MUA-1b/hop_dong_v5.md` sang `thiet_ke/HOP_DONG_API_KH.md`, ĐÚNG TỪNG BYTE (kiểm bằng `cmp`).
- A2 `src/kiemKhop/canTuPos.js` theo v5:
  - các cửa đặt đơn `co: true`;
  - trường mới của `/don`, `/don/:ma` không còn `moi`;
  - trường của KH-SP-1 (v4) ở `/menu` theo đúng hợp đồng.
  - Bài A2 của `thu_KHKHOP1.js` xanh.
- A3 K8 xanh: mọi cửa `api.js` gọi đều có trong v5.

### B. Nối cửa thật — `api.js` vẫn là chỗ DUY NHẤT gọi mạng
- B1 Thêm vào `api.js` (qua `goi`, có token, 401 → hết phiên như mọi cửa):
  - `POST /gio/bao-gia`;
  - `POST /don`;
  - `POST /don/:ma/huy`;
  - `GET /don/:ma` dùng lại `layChiTietDon` sẵn có.
- B2 `datDon.js` gọi thẳng các hàm này. Bỏ cổng tiêm `datCongDatDon` nếu không còn cần (không để code chết). Mọi tên trường đặt đơn vẫn ở MỘT chỗ `datDon.js`.
- B3 Bật `DAT_ONLINE = true` (`src/noiDung/caiDat.js`) — CHỈ sau khi C–G xanh.

### C. Thân yêu cầu và đọc trả lời theo v5
- C1 `POST /gio/bao-gia`: `{ mon[] { ma, so_luong, ghi_chu? }, ma_giam?, cach_nhan: "tai_quan" }`.
  - Giao tận nơi vẫn "Sắp có" (KH-MUA-2), App KHÔNG gửi `giao`.
- C2 `POST /don`: thân báo giá + `cach_tra` (`qr` | `vi` | `vi_qr`) + `pin` (chỉ khi `vi` / `vi_qr`) + `khoa_gui` + `tong_da_xem`.
  - `tong_da_xem` = `tong` của báo giá ĐANG hiện cho khách.
  - App không gửi số tiền nào khác.
- C3 `khoa_gui`: 16–64 ký tự `A-Z a-z 0-9 -`.
  - Ví dụ `crypto.randomUUID()`; máy không có thì sinh chuỗi ngẫu nhiên đủ dài từ `crypto.getRandomValues`.
  - Sinh MỚI mỗi lần khách bấm nút đặt. App TỰ gửi lại (D2) thì dùng ĐÚNG khoá cũ và ĐÚNG thân cũ.
- C4 Đọc `POST /don`: `ma_don`, `tong`, `giu_vi`, `con_lai`, `tien_trinh`, `qr { chuoi, het_han } | null`, `trung`. Thiếu `ma_don` → "không biết kết quả" (D2).
- C5 Đọc `GET /don/:ma`: thêm `qr`, `thanh_toan`, `tien_ve_cho_doi_soat`; dùng `tien_trinh`, không dùng `trang_thai` cho bước đơn.
- C6 Báo giá:
  - `giam[].loai` = `ma_giam` → dòng "✓ Đã áp dụng" như demo;
  - `hang`, `gio_vang` → tên dòng theo demo;
  - loại lạ → "Giảm giá", vẫn cộng vào hiển thị;
  - `ma_giam_loi { code, error }` → hiện `error` dưới ô mã.

### D. Lỗi và gửi lại — đúng "Luật 4xx" của v5
- D1 **Mọi trả lời 4xx có `code`** của `POST /don` = CHẮC CHẮN chưa tạo đơn, chưa giữ / trừ ví.
  - Hiện câu `error` của POS, cho khách sửa rồi bấm đặt lại (khoá MỚI).
  - Bỏ danh sách cứng `LOI_CHUA_TAO` (`datDon.js`), thay bằng luật "4xx có code".
  - Làm thêm cho các mã:
    - `GIA_DA_DOI` 409: thay bảng tiền bằng `bao_gia` POS trả, câu "Giá vừa thay đổi, mời bạn xem lại", không tự gửi.
    - `QUA_NHIEU_LAN` 429: khoá nút, đếm ngược `thu_lai_sau_giay`.
    - `HET_HANG` / `MON_KHONG_BAN`: đánh dấu món theo `ma` trong giỏ.
    - `PIN_SAI` / `PIN_DANG_KHOA` / `CHUA_CO_PIN`: xử lý ở bảng PIN.
    - `NGOAI_GIO` / `QUA_GIO_NHAN_DON`: khoá nút đặt.
    - `CACH_KHONG_KHOP`: chuyển sang `vi` nếu ví đủ.
    - `KHOA_GUI_DA_DUNG` 409: lỗi của App — "Vui lòng đặt lại", khoá mới ở lần bấm sau.
- D2 **Không biết kết quả:** mất mạng, hết giờ chờ, 5xx (gồm `DANG_XU_LY` 503, `PAYOS_CHUA_CAU_HINH` 503, `PAYOS_LOI` 502, `LOI_MAY_CHU` 500), trả lời thiếu `ma_don`.
  - App TỰ gửi lại CÙNG khoá + CÙNG thân sau ~2 giây, tối đa 3 lần (`DANG_XU_LY`: tới khoảng 1 phút như v5).
  - Nhận được đơn (kể cả `trung: true`) → coi như thành công.
  - Vẫn không biết → khoá đặt, đưa khách sang Lịch sử đơn (v5: `GET /don` có cả đơn App chưa trả).
- D3 **Không bao giờ có đơn thứ hai ngoài ý muốn.** Kế hoạch phải chỉ rõ cơ chế cho từng đường và có ca thử cho từng đường:
  - (a) bấm nhiều lần;
  - (b) Back từ màn QR rồi bấm đặt lại;
  - (c) lui màn / tải lại / mở lại app khi đơn trước đang ở trạng thái "không biết kết quả";
  - (d) hai tab.
  - Gợi ý, không bắt buộc:
    - Khách đã có đơn `cho_tra` (từ `GET /don`) thì Thanh toán mời "Tiếp tục trả đơn <mã>" hoặc "Huỷ đơn đó" trước khi cho đặt mới.
    - Đơn đang "không biết kết quả" thì nhớ khoá gửi (KHÔNG nhớ PIN) tới khi rõ.
- D4 **PIN không lưu ở đâu:** không localStorage, không sessionStorage, không kho chung, không log. Gửi xong là bỏ.
  - Tự gửi lại (D2) cần PIN thì giữ trong bộ nhớ của đúng lần gửi đó, rồi xoá.

### E. Cách trả
- E1 Ba lựa chọn, đúng dữ liệu v5:
  - **QR** (cả đơn);
  - **Ví**: khi số dư `/toi` mới (KH-NHANH-1 F1) ≥ tổng báo giá;
  - **Ví + QR**: khi 0 < số dư < tổng. App ghi "dùng hết số dư ví, quét QR phần còn lại".
  - Số thật lấy từ `giu_vi` / `con_lai` POS trả. Trước khi đặt, App chỉ hiện "còn thiếu …" như hiện nay.
- E2 Bỏ chữ "(payOS)" ở nút QR. Không ghi tên nhà cung cấp, số tài khoản hay tên người nhận ở đâu (POS đổi sang SePay; nhiều hộ kinh doanh sau này).

### F. Theo dõi đơn (`/don/<mã>`)
- F1 QR lấy từ `GET /don/:ma` khi `cho_tra`. Tải lại trang, mở máy khác vẫn thấy QR và đếm ngược theo `bay_gio` POS.
- F2 `vi_qr`: hiện "Đã giữ <giu_vi> trong ví · quét QR <con_lai>".
- F3 `tien_ve_cho_doi_soat: true` (đơn đã huỷ / hết hạn mà tiền về sau) → "Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn".
- F4 Huỷ đơn `cho_tra` → `POST /don/:ma/huy`. `DA_TRA_GOI_QUAN` → câu POS + số liên hệ quán (`noiDung/lienHe.js`, chỉ khi có).
- F5 Đặt xong → làm mới kho `/toi`, `/don`, `/diem` (KH-NHANH-1 D3, đã có ở `xongDatDon`).
- F6 Lịch sử đơn: thẻ đơn App đang `cho_tra` / `da_tra` / `dang_lam` mở Theo dõi đơn. Đơn `xong` / `da_huy` / bill quầy mở Chi tiết đơn như hiện nay.

### G. Quyết định 31.10 — thêm món quay lại trang trước
- G1 Trang món bấm "Thêm vào giỏ" → thông báo "Đã thêm <món> vào giỏ" và quay lại đúng trang khách đứng trước khi mở món (Menu, Trang chủ, gợi ý trắc nghiệm…).
  - Mở thẳng Trang món bằng link (không có trang trước trong App) → về Menu.
  - KHÔNG nhảy vào giỏ.
- G2 "Đặt lại" ở Lịch sử đơn vẫn vào giỏ như hiện nay.

### H. Kiểm
- H1 `cong_cu/thu_KHMUA1b.js`, POS giả dựng TỪ hợp đồng v5 (đủ cửa, đủ mã lỗi).
  - **Phần 1, hàm thuần:** thân yêu cầu; khoá gửi; luật 4xx / không biết; đọc trả lời; lựa chọn cách trả.
  - **Phần 2, Chromium:**
    - QR thành công;
    - ví + PIN;
    - `vi_qr`;
    - `trung: true` không sinh đơn thứ hai;
    - 5xx rồi thành công (đúng CÙNG khoá + CÙNG thân, POS giả kiểm);
    - `DANG_XU_LY`;
    - mất mạng;
    - mọi 4xx → không "nghi ngờ", cho đặt lại;
    - `GIA_DA_DOI` cập nhật tổng;
    - 429 đếm ngược;
    - D3 (a)–(d);
    - tải lại màn QR vẫn thấy QR;
    - huỷ đơn;
    - 401 giữa chừng;
    - không có PIN trong localStorage / sessionStorage sau mọi ca;
    - G1.
  - Chạy ở 360 / 390 / 430.
- H2 **`SỐ CA` theo `KHONG_TRINH_DUYET=1`.** Bài mới đọc biến này. Bài cũ phải đổi:
  - Có phần không trình duyệt đổi → bài sửa thường.
  - Chỉ đổi phần Chromium → THÊM ca hàm thuần / đọc nguồn đỏ trên gốc. KHÔNG xin `## Bài thử cũ sửa` cho bài mà bản gốc chạy trên code mới đỏ.
  - `thu_KHMUA1.js` đang ~116 giây có Chromium, sát trần 120 giây. Thêm ca vào bài MỚI, không thêm vào bài cũ. Được chia song song ba cỡ màn như `thu_KHNHANH1.js` nếu bài cũ phải sửa.
- H3 `npm test`, `--day-du`, `node tu_chay/cong.js chay` (khi máy rảnh, `KHONG_TRINH_DUYET=1`) phải ĐẠT.
  - Đột biến VS- + BV- cho mỗi chỗ vá, ≥ 8, có đối chứng:
    - tự gửi lại với khoá MỚI;
    - tự gửi lại với thân khác;
    - coi 5xx là chưa tạo;
    - coi 4xx là "có thể đã tạo";
    - bỏ `tong_da_xem`;
    - gửi `tong_da_xem` tự tính;
    - lưu PIN;
    - cho đặt mới khi đơn trước "không biết kết quả";
    - bỏ qua `GIA_DA_DOI`;
    - bật `DAT_ONLINE` trước khi nối cửa.
  - Ca K5: đường hợp lệ không bị chặn oan (đơn QR thường, ví đủ, ví + QR).
- H4 Chủ quán thử tay trên POS thật (≤ 3 bước, đơn nhỏ):
  1. Đặt 1 món rẻ, trả QR bằng app ngân hàng → App hiện "Đã thanh toán", quầy nhận đơn.
  2. Đặt rồi bấm "Huỷ đơn" khi đang chờ trả → đơn "Đã huỷ".
  3. Có số dư ví: đặt trả ví + PIN → trừ đúng tổng.

## Phạm vi
- viec/KH-MUA-1b/**
- src/**
- thiet_ke/HOP_DONG_API_KH.md
- cong_cu/thu_KHMUA1b.js
- cong_cu/thu_KH*.js

## Ngân sách
~300 dòng app + ~450 dòng thử.
**Phương án đơn giản nhất đã xét:**
- Sửa tại chỗ `datDon.js` / `dungDatDon.js` / `ThanhToan.jsx` / `TheoDoiDon.jsx` mà KH-MUA-1 đã dựng; thêm 3 hàm vào `api.js`.
- Luật lỗi là MỘT hàm ("4xx có code" → chưa tạo; còn lại → không biết).
- Gửi lại là MỘT vòng lặp có khoá cố định. Không thêm thư viện.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- Trong `thiet_ke/` chỉ được thay `HOP_DONG_API_KH.md` bằng đúng `viec/KH-MUA-1b/hop_dong_v5.md`.
- KHÔNG tính tiền ở App (tạm tính, giảm, tổng, ví giữ, QR còn lại đều lấy từ POS). KHÔNG làm giao tận nơi (KH-MUA-2), topping / combo, đổi điểm.
- KHÔNG lưu PIN ở bất kỳ đâu.
- Chỉ push `git push -u origin viec/KH-MUA-1b`. Không đụng `main`, không merge, không tạo PR.
