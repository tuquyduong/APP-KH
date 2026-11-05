# KH-MUA-1c — Đặt đơn: theo hợp đồng v9 — kho bận / hết phiên = "chưa rõ" (gửi lại CÙNG khoá), Theo dõi đơn đọc ví đã giữ từ POS, bảng PIN có nút Xác nhận + Xoá lùi, bù bài thử soát cuối KH-MUA-1b

<!-- Chat App KH soạn 05.11.2026. Việc TIỀN [T], Opus. Làm NGAY sau KH-MUA-1b (đã gộp PR #14, e064914; sổ v24). Đặt đơn online ĐANG CHẠY THẬT.
     Lý do gấp: hợp đồng v9 (chép nguyên văn ở viec/KH-MUA-1c/hop_dong_v9.md, main POS 4003ea3) TỰ MÂU THUẪN:
       dòng 101 "Luật 4xx: MỌI trả lời 4xx của POST /don = chưa tạo đơn, chưa giữ / trừ ví"
       dòng 115–116 "kho bận → 409 KHO_BAN (gửi lại cùng khoá)".
     Chat đã đọc code POS (server/utils/donApp.js `datDon`, nhánh finally; server/routes/kh/index.js `router.post('/don')` → loiMayChu):
       lỗi "kho bận" ném SAU khi `chotPhien` đã trừ ví (vd lúc ghi `pos_don_app.xong`) → route trả 409 KHO_BAN, nhưng phiên đã `da_thu`, đơn đã có.
       Gửi lại CÙNG khoá → POS thấy dòng cũ + phiên da_thu → trả đúng đơn đó (`trung`). Khoá MỚI → đơn thứ hai, TRỪ VÍ LẦN HAI.
     App hiện (`src/datDon.js` loaiLoi) coi KHO_BAN là "chắc chưa tạo" → xoá bản ghi `kh_don_gui` → khách bấm lại khoá mới. PHẢI SỬA.
     Chat POS (bàn giao 04.11) xác nhận cùng ý và sẽ sửa câu chữ luật 4xx ở hợp đồng bản sau (ngoại lệ 401, KHO_BAN, KHOA_GUI_DA_DUNG). App làm theo
     dòng 116 + code POS ngay; hướng này luôn an toàn (gửi lại cùng khoá không bao giờ tạo đơn thứ hai).
     Quyết định áp dụng: thiet_ke/QUYET_DINH_APPKH.md (02.11 KH-MUA-1b; 03.11 vòng sửa 4). -->

**Chờ duyệt kế hoạch:** viết `viec/KH-MUA-1c/ke_hoach.md`, commit, push, rồi DỪNG ở bước 3 của `/lam-viec`.

## Mục tiêu
Không bao giờ có đơn thứ hai / trừ ví lần hai khi POS báo "kho bận" hay khách hết phiên giữa chừng. Kho App giữ đúng hợp đồng v9 (bản chép +
trang Kiểm khớp). Màn Theo dõi đơn hiện "Đã giữ … trong ví · quét QR …" cả khi tải lại / mở máy khác (POS v7 đã trả `cach_tra`, `giu_vi`, `con_lai`).
Bảng nhập PIN dễ bấm: bàn phím giữa khung, có nút Xoá lùi một số và nút Xác nhận (không tự gửi khi đủ 4 số). Bù đủ ca thử + đột biến mà lượt soát cuối KH-MUA-1b nêu.

## Nghiệm thu

### A. Hợp đồng v9 trong kho
- A1 Chép `viec/KH-MUA-1c/hop_dong_v9.md` sang `thiet_ke/HOP_DONG_API_KH.md`, ĐÚNG TỪNG BYTE (`cmp`).
- A2 `src/kiemKhop/canTuPos.js` theo v6–v9: v7 HD-KH-1 (`GET /don/:ma` `hoa_don[]`; `GET /don` + `GET /don/:ma` `cach_tra`, `giu_vi`, `con_lai`),
  v9 CT-1a (`GET /chuong-trinh` có cửa; `/toi.khach.ngay_sinh`). Trường App chưa dùng vẫn khai đúng `co` / `moi` để trang /kiemkhop báo thật.
  `thu_KHKHOP1.js` xanh. Không đổi gì về giao diện ngày sinh / chương trình / hoá đơn (việc KH-SINH-1, KH-CT-1, KH-HD-1).

### B. Luật lỗi `POST /don` — MỘT chỗ (`loaiLoi` ở `src/datDon.js`)
- B1 **"Chưa rõ" (đơn CÓ THỂ đã tạo) — giữ bản ghi `kh_don_gui`, không cho khoá mới:** mất mạng / hết giờ chờ, 5xx (gồm `DANG_XU_LY`, `PAYOS_LOI`,
  `LOI_MAY_CHU`), 4xx không `code`, 200 thiếu `ma_don`, **401** (vòng sửa 4 đã làm), **409 `KHO_BAN`** (MỚI).
  - `KHO_BAN`: tự gửi lại CÙNG khoá + CÙNG thân sau ~2 giây như `DANG_XU_LY` (tối đa theo hằng số có tên, vd ~30 lần ≈ 1 phút), rồi như mọi "chưa rõ".
  - 401: như vòng sửa 4 (dừng ngay, không tự gửi lại; đăng nhập lại → "Gửi lại đúng đơn này").
  - Gộp: một danh sách / một vị từ (vd `MA_CHUA_RO`) — không rải điều kiện ở `loaiLoi` + `guiDonAnToan` như hiện nay (soát vòng 4 gợi ý).
- B2 **409 `KHOA_GUI_DA_DUNG`:** KHÔNG coi là chưa tạo, KHÔNG xoá bản ghi bằng lời "Vui lòng đặt lại". Hiện "Đơn này có thể đã đặt trước đó —
  mời bạn xem Lịch sử đơn" + nút "Xem Lịch sử đơn" (như khối quá 24 giờ hiện có) + "Bỏ qua, đặt đơn mới" (khách tự bấm mới xoá bản ghi).
- B3 Mọi 4xx CÒN LẠI có `code` (PIN, giá đổi, hết hàng, ngoài giờ, 429…) giữ như hiện nay = chưa tạo (POS trả các mã này TRƯỚC khi tạo phiên — chat đã
  đọc `datDon` dòng tra khoá → lượt → thân → giờ → món → báo giá).
- B4 Lời cho khách khi `KHO_BAN` hết lượt tự gửi lại: dùng khối "Lần đặt trước chưa rõ kết quả" + "Gửi lại đúng đơn này" đang có — không thêm màn mới.

### C. Theo dõi đơn đọc ví đã giữ từ POS (v7)
- C1 `docDon` (`src/datDon.js`) đọc thêm `cach_tra`, `giu_vi`, `con_lai` (số hoặc `null`). Dòng "Đã giữ … trong ví · quét QR …" và số tiền cạnh QR
  lấy từ `GET /don/:ma` trước; không có thì mới dùng bản ghi trên máy (`kh_don_gui`). Tải lại / máy khác vẫn đúng.
- C2 Đơn quầy (`null`) → không hiện dòng ví. Không tự tính tiền.
- C3 Bỏ ghi chú "tạm, chờ POS v7" ở code / sổ quyết định trong phạm vi file của việc này (sổ do chủ quán ghi — chỉ ghi Phát hiện).

### D. Bù ca thử + đột biến (soát cuối KH-MUA-1b, `viec/KH-MUA-1b/trang_thai.md` mục "Soát độc lập vòng 4")
- D1 Chặn `!bg` ở điểm gửi (`ThanhToan.jsx` `guiDon`): ca ĐỎ riêng (bảng PIN mở sẵn, báo giá mất giữa chừng → nhập PIN không gửi) + đột biến
  `BV-DIEM-GUI-BAO-GIA` bỏ ĐÚNG vế `!bg` (một vế một đột biến).
- D2 Ca `PIN_DANG_KHOA` khi "Gửi lại đúng đơn này" (giữ bản ghi, như `PIN_SAI`).
- D3 Ca 401 → giữ bản ghi → khách KHÁC đăng nhập (kho thường) → bản ghi bị xoá (`luuMay.js` doiKhach).
- D4 `ghiHong` (kho đầy / chặn): soát nêu tab này bỏ qua kho tới lần ghi thành công → không thấy bản ghi của tab khác. Kế hoạch đề xuất cách gọn
  (vd khi ghi hỏng vẫn đọc kho trước, bộ nhớ trang sau; hoặc thử `removeItem` bản cũ) + ca đỏ. Không làm được gọn thì ghi Phát hiện, không mở rộng.
- D5 Ca K5 (không chặn oan): đơn QR, ví đủ, ví + QR hợp lệ vẫn đặt được một lần; `GIA_DA_DOI` vẫn cho bấm lại; 4xx thường vẫn xoá bản ghi.

### F. Bảng nhập PIN (chủ quán thử trên iPhone 05.11, ảnh chụp màn: số trên nút lệch TRÁI, không có nút xác nhận)
- F1 Mọi số trên bàn phím CĂN GIỮA trong nút (cả chiều ngang lẫn dọc); cả bàn phím nằm giữa khung (iPhone Safari, trình duyệt Zalo, 360 / 390 / 430).
  Tìm đúng nguyên nhân lệch (CSS chung của nút trong `src/giaoDien/`), sửa ở `src/giaoDien/` — không chép CSS mới ngoài khuôn demo `.pin-pad`.
- F2 Hàng cuối bàn phím: **"Xoá"** (lùi MỘT số — biểu tượng ⌫ hoặc chữ "Xoá", dùng biểu tượng có sẵn trong bộ demo nếu có) · **0** · **"Xác nhận"**.
  "Xác nhận" chỉ bật khi đủ 4 số; bấm mới gửi. KHÔNG tự gửi khi vừa đủ 4 số (thay hành vi KH-MUA-1 / KH-UI-3b — chủ quán chốt 05.11).
  Phím Enter trên bàn phím máy tính = "Xác nhận"; Backspace = "Xoá".
- F3 Áp cho cả hai chế độ của `PinSheet`: nhập PIN trả ví (một lần) và đặt / đổi PIN (nhập hai lần: mỗi lần bấm "Xác nhận").
- F4 Đang gửi: nút "Xác nhận" khoá + chữ "Đang gửi…"; POS báo sai PIN → hiện nguyên lời POS, xoá các số đã nhập, cho nhập lại. PIN vẫn KHÔNG lưu ở đâu.
- F5 Bài thử cũ đang khoá "đủ 4 số là tự gửi" (vd `thu_KHMUA1.js`, `thu_KHMUA1b.js`, `thu_KHUI3b.js`) → sửa theo hành vi mới (hành vi ĐÃ được chủ quán
  duyệt đổi → bài sửa thường, đỏ trên gốc / xanh trên mới, ghi `SỐ CA`; KHÔNG dùng `## Bài thử cũ sửa`). Thêm ca: chưa đủ 4 số bấm Xác nhận không gửi;
  Xoá lùi đúng một số; đủ 4 số mà không bấm thì không gửi. Đột biến `VS-PIN-TU-GUI` (đưa tự gửi trở lại), `VS-PIN-XOA-HET` (Xoá xoá hết thay vì một số).
- F6 Chụp ảnh 360 / 390 / 430 bảng PIN (trả ví + đặt PIN) vào `viec/KH-MUA-1c/so_anh/`; `doi_chieu_demo.md` ghi khác demo vì (chủ quán chốt 05.11).

### E. Kiểm
- E1 Bài mới `cong_cu/thu_KHMUA1c.js` (hàm thuần + màn với POS giả theo v9). `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- E2 Đột biến VS- + BV- cho mỗi chỗ vá (≥ 8, có đối chứng), tối thiểu: `VS-KHO-BAN-CHUA-TAO` (KHO_BAN lại thành chưa tạo), `VS-KHO-BAN-KHOA-MOI`
  (gửi lại khoá mới), `VS-KHO-BAN-THAN-KHAC`, `VS-KHOA-DA-DUNG-XOA` (KHOA_GUI_DA_DUNG xoá bản ghi), `VS-GIU-VI-TU-TINH` (tự tính giữ ví),
  `BV-DIEM-GUI-BAO-GIA`, `VS-401-CHUA-TAO` (giữ), `VS-PIN-DANG-KHOA-XOA`.
- E3 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT — ghi kết quả cổng + "HEAD ĐÃ KIỂM" VÀO `trang_thai.md` TRƯỚC khi gọi `/ra-soat`
  (bài học KH-MUA-1b: soát 4 lần bắt thiếu hồ sơ). `/security-review` nhánh.
- E4 Chủ quán thử tay (≤ 3 bước, POS thật): (1) đặt QR rẻ → tải lại màn Theo dõi đơn / mở trên máy khác vẫn thấy QR + số tiền; (2) đặt rồi Huỷ;
  (3) trả bằng ví: bảng PIN số nằm giữa nút, bấm sai thì "Xoá" lùi một số, đủ 4 số bấm "Xác nhận" mới trả.

## Phạm vi
- viec/KH-MUA-1c/**
- src/**
- thiet_ke/HOP_DONG_API_KH.md
- cong_cu/thu_KHMUA1c.js
- cong_cu/thu_KH*.js

## Ngân sách
~170 dòng app + ~420 dòng thử.
**Phương án đơn giản nhất đã xét:** một danh sách mã "chưa rõ" trong `loaiLoi`; `KHO_BAN` đi chung đường tự gửi lại của `DANG_XU_LY`; `KHOA_GUI_DA_DUNG`
dùng lại khối "quá 24 giờ" đang có; `docDon` đọc thêm 3 trường. Không màn mới, không thư viện.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- Trong `thiet_ke/` chỉ thay `HOP_DONG_API_KH.md` bằng đúng `viec/KH-MUA-1c/hop_dong_v9.md`.
- KHÔNG sửa giỏ hàng (nút xoá món), số đơn hiển thị (chờ POS trả số bill — việc sau), và KHÔNG làm giao diện ngày sinh, chương trình, hoá đơn, hạng, ghi chú nhanh, báo đơn xong mọi màn, hai dòng to Trừ ví / Quét QR, nhớ công tắc, lời chào
  (các việc KH-SINH-1, KH-CT-1, KH-HD-1, KH-HANG-2, KH-GHICHU-1, KH-BAO-1).
- KHÔNG tính tiền ở App. KHÔNG lưu PIN ở bất kỳ đâu.
- Chỉ push `git push -u origin viec/KH-MUA-1c`. Không đụng `main`, không merge, không tạo PR.
