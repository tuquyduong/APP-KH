# KH-THE-2 — Thẻ hội viên theo thiết kế 14.11: so sánh nhanh lên đầu, "Mua ngay" thẳng Thanh toán (thẻ không vào giỏ, chỉ QR), màn "Chào mừng hội viên", thẻ ở Ưu đãi theo tình trạng

<!-- Chat App KH soạn 14.11.2026. Việc TIỀN [T] (đổi luồng mua thẻ / cách trả), **Opus** — CÓ "Chờ duyệt kế hoạch" (bước 3: ghi `ke_hoach.md`, push, DỪNG hỏi; chủ quán
     dán cho chat duyệt rồi gõ "duyệt" thì chạy thẳng tới hết). Hạn 18.11. Mở trên main SAU KHI KH-THE-1 đã gộp (PR #37). Không việc nào khác đang chạy; KH-QC-1 (dải quảng cáo)
     có thể mở trong lúc này → xem mục Cấm (không đụng phần quảng cáo của `src/App.jsx`).
     Nguồn: **bản thiết kế chủ quán duyệt 14.11** = `viec/KH-THE-2/ban_thiet_ke.html` (mở bằng Chromium — Màn 1 Ưu đãi, Màn 2 Hạng thành viên, Màn 3 Thanh toán thẻ, Màn 4 Đã lên hạng,
     "Thẻ ở Ưu đãi theo tình trạng", "7 bước → 3 bước"; cột "Hiện tại" là ảnh app thật, đã bỏ ảnh); QĐ 14.11 trong `thiet_ke/QUYET_DINH_APPKH.md` (thay QĐ 08.11 / 12.11 "thẻ chung giỏ,
     Trả thẻ trước"); thư `thiet_ke/trao_doi/YEU_CAU_APPKH_GUI_POS_14112026.md` (POS sẽ chặn trả thẻ bằng số dư). Hợp đồng `/api/kh` KHÔNG đổi (v13 đã có ở `thiet_ke/`).
     Đọc CLAUDE.md §4, §5, §6, §8, §11; `LUAT_XAY_APP.md` §5; phiếu + `trang_thai.md` của KH-THE-1. -->

**Kế hoạch ĐÃ DUYỆT** (chủ quán 14.11, chat soát `ke_hoach.md` 88d5262) kèm "Trả lời câu hỏi kế hoạch" ở cuối phiếu — làm thẳng tới hết, không dừng chờ duyệt nữa.

## Mục tiêu
Khách nhìn một bảng là thấy lên hạng được lợi gì so với giá thường, mua thẻ trong 3 bước (Hạng thành viên → Thanh toán → xong) mà không qua giỏ, trả bằng QR (thẻ KHÔNG trả bằng
số dư ví — tiền nạp có cộng thưởng), trả xong thấy màn chúc mừng và đặt đồ uống được giảm ngay. Thẻ ở Ưu đãi chỉ nói đúng tình trạng của khách với một nút.
App vẫn KHÔNG tự tính giá, KHÔNG tự cấp hạng, KHÔNG tự tính hạn mới.

## Nghiệm thu

### A. Thẻ không vào giỏ nữa
- A1 Giỏ (`src/gio.js`, khoá `kh_gio`) chỉ còn dòng đồ uống: bỏ thêm thẻ vào giỏ, bỏ "Trả thẻ trước" ở Giỏ (C3 của KH-THE-1) và đường `/thanhtoan?chi=the`. Bản lưu cũ còn dòng thẻ
  → đọc bỏ dòng đó (không báo, không lỗi). Code chỉ phục vụ "thẻ trong giỏ" (dòng thẻ ở `GioHang.jsx`, nhánh thẻ của `chenDong` / `demMon` / `themThe`, `phanGui`, `thamThanhToanLai` (thay bằng D1),
  khoá danh mục `gio.the.*` …) → XOÁ, không để code chết. Hàm còn dùng cho đơn thẻ (`laThe`, `trangThaiDong` nhánh thẻ, `laDonChiThe`, `hanMoiThe`, `hangCuaDon`, `MA_THE`) giữ.
- A2 Đơn đồ uống (Giỏ → Thanh toán) KHÔNG đổi hành vi: công tắc ví, PIN, nhận tại quầy, mã giảm, khoá gửi, "chưa rõ", huỷ đơn chờ trả như cũ. Menu nhóm "Thẻ thành viên" + thẻ thu nhỏ
  giữ (mở Hạng thành viên). "Đặt lại" vẫn bỏ dòng thẻ.

### B. Màn "Hạng thành viên" (Màn 2 của bản thiết kế)
- B1 Đầu màn CĂN TRÁI (`DauManCon … canTrai`, như Thanh toán). Dòng phụ = tình trạng của khách: chưa đăng nhập / chưa có hạng → "Bạn đang ở giá thường"; hạng bán → "Bạn đang ở
  <hạng> · hết hạn dd/mm/yyyy"; hạng chỉ cấp → "<hạng> · quán tặng" (+ " · không thời hạn" khi `het_han` null). BỎ thẻ xám "Hạng hiện tại", hàng tab hạng, dòng "Mua thẻ 1 tháng hoặc
  3 tháng", bảng "So sánh nhanh" cũ ở cuối màn.
- B2 **So sánh nhanh ở NGAY dưới đầu màn** (tiêu đề "So sánh nhanh" + chữ nhỏ bên phải "Chạm một cột để chọn"): cột "Thường" (dòng phụ "Không hạng") + mỗi hạng của `hangCoGiam`
  theo thứ tự POS trả (`thu_bac` tăng = thấp → cao; App không sắp lại). Hàng:
  1. "Giảm mọi đơn" — `phan_tram` ("3%"); Thường "—".
  2. "Món nhóm đặc biệt" — `phan_tram_nhom_dac_biet`; hạng 0 / thiếu "—"; không hạng nào > 0 → ẩn cả hàng.
  3. "Chi 1 triệu, tiết kiệm" — `1.000.000 × phan_tram / 100`, làm tròn xuống đồng (App tự tính — MỘT hàm thuần trong `src/giaHang.js`, số 1.000.000 là hằng có tên ở MỘT chỗ);
     Thường "0đ"; chữ xanh đậm như bản thiết kế.
  4. "Giá" — Thường "Miễn phí"; hạng bán: giá gói rẻ nhất + "/ tháng" (gói 1 tháng) hoặc "/ N tháng"; hạng chỉ cấp "Quán tặng"; hạng không có gói bán "Chưa mở bán".
  Mỗi cột hạng là MỘT nút chọn (`role="radio"`, `aria-checked`, ≥ 44 px): chạm → `?h=<id>` (`thay`, không thêm lịch sử — như tab cũ). Cột đang chọn: nền vàng + viền + nhãn
  "Đang chọn" nổi ở đầu cột; hạng chỉ cấp màu xanh (l2), hạng bán màu vàng (l1); có huy chương của demo (`m-medal-gold` hạng bán, `m-medal-plat` hạng chỉ cấp — chép NGUYÊN từ demo).
  Cột "Thường" không chọn được. Hạng chọn sẵn như hiện nay (`?h` → hạng của khách → hạng bán đầu tiên). ≤ 3 hạng vừa khít 360 px; nhiều hơn → bảng cuộn ngang trong khung riêng
  (trang không cuộn ngang).
- B3 Ngay dưới bảng: "Chọn gói <hạng>" + các nút gói (giữ `.ti-buy`, "Tiết kiệm X" như cũ, mặc định gói dài nhất) + nút chính: "Mua ngay · <hạng> N tháng" + giá gói ở bên phải
  (khách chưa có hạng này) · "Gia hạn · <hạng> N tháng" + giá (đang có đúng hạng) · nút MỜ + lý do như cũ (`nutMua`: chỉ cấp / hạng cao hơn / chưa mở bán). Dưới nút: "Trả bằng QR
  chuyển khoản · thẻ dùng được ngay". Ở 390 × 844 (2 hạng, 2 gói) nút mua thấy được KHÔNG phải cuộn.
- B4 Khối "<hạng> còn có": dòng cố định "Dùng ở quầy và trên App, cùng một số điện thoại" (mục danh mục) + các dòng `quyen_loi[]` của POS (mục khoá `pos`). Cuối màn: MỘT dòng ghi
  chú "Gia hạn trước hạn thì ngày còn lại được cộng dồn. Thẻ hết hạn tự về giá thường." — BỎ câu "Uống từ 2 ly/tuần là thẻ Vàng có lời" (sai: giảm 3% phải chi khoảng 3,3 triệu /
  tháng mới bù 100.000đ tiền thẻ).
- B5 Bấm Mua ngay / Gia hạn: chưa đăng nhập → đăng nhập rồi quay về đúng màn này (như cũ); đã đăng nhập → mở Thanh toán thẻ (C1) với đúng hạng + gói đang chọn. KHÔNG thêm gì vào giỏ,
  KHÔNG báo "Đã thêm …".

### C. Thanh toán thẻ (Màn 3)
- C1 Đường dẫn MỚI trong `src/duongDan.js`: `/uudai/hang/thanhtoan?h=<id>&thang=<n>` (tab Ưu đãi, cần đăng nhập, Back / mở thẳng về `/uudai/hang?h=<id>`; tải lại đúng). Tham số sai,
  hạng / gói không còn bán (`trangThaiDong` nhánh thẻ) → hiện lời "không còn bán" + nút về Hạng thành viên, KHÔNG gửi báo giá / đặt đơn.
- C2 Màn dùng lại `src/pages/ThanhToan.jsx` — CÙNG khoá gửi, `tong_da_xem`, bản ghi `kh_don_gui`, "chưa rõ" / gửi lại đúng đơn, đơn chờ trả, trần lượt, C7 dọn — KHÔNG viết đường đặt
  đơn thứ hai. "Giỏ" của màn = MỘT dòng thẻ dựng từ đường dẫn (không đọc / ghi `kh_gio`). Báo giá + đặt đơn gửi ĐÚNG `mon: [{ loai: "the", hang_id, so_thang }]`, KHÔNG `ma_giam`,
  `cach_tra: "qr"`.
- C3 **Thẻ không trả bằng số dư** (chủ quán 14.11 — tiền nạp có thưởng): đơn có dòng thẻ KHÔNG BAO GIỜ gửi `vi` / `vi_qr` (kể cả khi công tắc nhớ `kh_dung_vi` đang bật và số dư đủ),
  KHÔNG hiện công tắc "Trừ từ số dư ví", KHÔNG hỏi PIN, KHÔNG ghi đè `kh_dung_vi`. MỘT hàm thuần quyết định cách trả (đơn có thẻ → `qr`; đơn đồ uống → luật cũ) — bài thử nạp thẳng.
- C4 Bố cục theo bản thiết kế: KHÔNG có "Hình thức nhận hàng" / thẻ quầy; dòng phụ đầu màn "Thẻ hội viên"; thẻ tóm tắt (thẻ vàng thu nhỏ `.pc-mini` của demo + "Thẻ hội viên <hạng>"
  + "N tháng" + giá báo giá POS) — KHÔNG tự tính "hạn tới" (POS cộng nối khi gia hạn; hạn mới hiện ở Màn 4 từ hoá đơn POS); dòng xanh "Thẻ kích hoạt ngay khi tiền về, không cần ra
  quầy. Đơn đồ uống tiếp theo được giảm {phanTram}% luôn." (% của hạng từ `/hang`); "Cách trả tiền": MỘT lựa chọn "Chuyển khoản QR" + "Quét mã bằng app ngân hàng bất kỳ" (đã chọn,
  không đổi được) + dòng khoá "Thẻ hội viên không trả bằng số dư ví và không dùng mã giảm giá."; bảng tiền từ báo giá POS (`BangTien`); nút "Quét QR · <tổng>".
- C5 Lỗi POS: 4 mã thẻ của v13 (`MA_THE`) → hiện nguyên `error`, khoá nút, nút phụ "Về Hạng thành viên" (thay "Về giỏ"); mã lạ (vd mã POS sắp thêm cho "trả thẻ bằng số dư") → hiện
  nguyên `error` như mọi lỗi, không coi là "chưa rõ" khi là 4xx.

### D. "Chào mừng hội viên" (Màn 4)
- D1 Theo dõi đơn của đơn CHỈ thẻ: lúc chờ trả giữ khung QR như cũ; "Tạo mã mới" → về Thanh toán thẻ đúng hạng + gói của đơn đó (đọc từ bản ghi `kh_don_gui`). Đã trả (`xong`) → THAY
  khối "Đã lên hạng" cũ bằng màn chúc mừng theo bản thiết kế: huy chương của hạng (như B2), "Chào mừng hội viên <hạng>!", "Giảm {phanTram}% áp dụng ngay từ đơn tiếp theo, ở quầy và
  trên App.", thẻ vàng (logo + "TỨ QUÝ ĐƯỜNG · Thẻ hội viên", tên hạng, `ghi_chu` hạn mới của POS NGUYÊN VĂN, số đơn, tổng); nút chính "Đặt đồ uống ngay" → Menu; nút phụ
  "Về giỏ · N món" CHỈ khi giỏ còn đồ uống; dòng nhỏ dưới nút như bản thiết kế. KHÔNG hiện các bước pha chế / số đơn ra quầy / danh sách món (hoá đơn vẫn xem ở Lịch sử đơn).
  Hạng chỉ cấp không mua được nên không có ca này. Đơn thẻ + đồ uống cũ (tạo trước việc này): như đơn thường.
- D2 Hạng mới hiện ngay ở Ưu đãi / Trang chủ / Hạng thành viên / giá Menu (đã có: `lamMoi` `/toi` + menu sau khi trả) — có ca thử.

### E. Thẻ hội viên ở Ưu đãi theo tình trạng (Màn 1 + "Thẻ ở Ưu đãi theo tình trạng")
- E1 Thẻ lên ĐẦU tab Ưu đãi (trên Điểm / Ví và Chương trình đặc biệt; cả khi chưa đăng nhập). Các khối khác giữ nguyên thứ tự.
- E2 Bốn trạng thái, MỖI thẻ MỘT nút (thay danh sách mọi hạng + giá hiện nay):
  1. **Chưa có hạng** (chưa đăng nhập, chưa mua, hạng đã hết hạn): thẻ vàng dập (logo + "TỨ QUÝ ĐƯỜNG · Thẻ hội viên", nhãn "Chưa có thẻ"), "Trở thành hội viên", tên hạng bán ĐẦU TIÊN
     (thấp nhất), 1–2 chip ("Giảm X% mọi đơn"; "Món đặc biệt giảm Y%" khi > 0), "Từ <giá gói rẻ nhất> / tháng" (gói 1 tháng) hoặc "/ N tháng", nút "Xem & mua thẻ ›" → Hạng thành viên
     của hạng đó. Không hạng nào bán được → ẩn thẻ (như nay).
  2. **Có hạng bán, còn > 7 ngày**: "Hạng của bạn", tên hạng, "Giảm X% mọi đơn hàng", huy chương, "Hết hạn dd/mm/yyyy" + "còn N ngày", nút "Quyền lợi & gia hạn ›". KHÔNG có thanh tiến
     độ của bản thiết kế (POS chưa trả ngày bắt đầu gói — lý do (a), ghi `doi_chieu_demo.md`).
  3. **Còn 0–7 ngày**: như (2) + nhãn đỏ "Còn N ngày" / "Hết hạn hôm nay", câu "Gia hạn trước dd/mm để không mất ưu đãi. Ngày còn lại được cộng dồn.", nút đậm "Gia hạn ngay ›".
     Đếm ngày bằng CÙNG `soNgayCon` + `NGAY_NHAC_GIA_HAN` của Trang chủ (theo `bay_gio` POS).
  4. **Hạng chỉ cấp** (Kim Cương): thẻ xanh, "Hạng của bạn", tên, "Giảm X% mọi đơn hàng", huy chương bạch kim, "Dành tặng khách thân thiết · không thời hạn" (có `het_han` → "hết hạn
     dd/mm/yyyy"), nút "Quyền lợi ›".
  Tên hạng, %, giá, hạn từ POS (khoá `pos`); số ngày còn App tự tính (khoá `tutinh`). Hàm chọn trạng thái là hàm thuần (bài thử nạp thẳng).

### F. Nội dung sửa được + kiểm
- F1 **Sửa được ở /admin** (CLAUDE.md §11): mọi chữ / nút mới khai mục danh mục (`src/noiDung/nd/theHang.js` cho Hạng thành viên + Thanh toán thẻ + Chào mừng; `taiKhoan.js` cho thẻ
  Ưu đãi; `donHang.js` nếu thêm chữ Theo dõi đơn) với `data-nd`; khối mới có `hien.<khối>`; phần POS → mục khoá `pos`, tiết kiệm / số ngày → `tutinh`. Khoá KHÔNG còn dùng (tab, thẻ xám,
  "Cách có", `tier.buynote` cũ, `gio.the.*`, nút Trả thẻ trước, `tier.daThem` / `tier.daDoi`…) → XOÁ khỏi danh mục (chưa có /admin nên không mất bản sửa). `trang_thai.md` liệt kê khoá
  thêm / bỏ. `kiemDanhMuc` xanh.
- F2 Màu / phông / cỡ theo bản thiết kế nhưng CHỈ màu có trong demo (K9): thẻ vàng = đúng gradient thẻ vàng dập của demo (`#F8E9BD … #EDD596`) + hoa văn `/anh/the-vang-hoa-van.webp`;
  thẻ Kim Cương = `l2` của demo. Màu thiết kế KHÔNG có trong demo (nền cột Kim Cương xanh nhạt, dòng xanh lá "kích hoạt ngay", nhãn đỏ "Còn N ngày"…) → màu demo gần nhất cùng vai trò;
  ghi bảng "bản thiết kế ↔ app" trong `doi_chieu_demo.md`. Không vẽ biểu tượng mới (huy chương, QR, khoá: chép từ demo).
- F3 Bài MỚI `cong_cu/thu_KHTHE2.js` (chạy cả `KHONG_TRINH_DUYET=1`; POS giả dựng từ hợp đồng v13): tiết kiệm 1 triệu (0 / 3 / 10 / 0,1 / thiếu `phan_tram`); chữ cột Giá (1 tháng /
  N tháng / chỉ cấp / không gói); hàng "Món nhóm đặc biệt" ẩn khi không hạng nào > 0; trạng thái thẻ Ưu đãi (chưa hạng / 8 ngày / 7 / 0 / chỉ cấp có & không `het_han` / không hạng bán);
  đường dẫn Thanh toán thẻ (tham số sai, hạng / gói không bán → không gửi); thân báo giá + đặt đơn thẻ đúng 3 khoá, `cach_tra:"qr"`, không `ma_giam`; **không bao giờ `vi` / `vi_qr` cho
  đơn có thẻ** kể cả `kh_dung_vi` bật + số dư đủ (đối chứng: đơn đồ uống cùng điều kiện VẪN `vi`); bản lưu giỏ cũ có dòng thẻ → bỏ; "Tạo mã mới" đơn chỉ thẻ → đúng hạng + gói.
  Chromium (390): Hạng thành viên chưa đăng nhập / có hạng Vàng / đang xem Kim Cương (nút mua thấy không cuộn); Mua ngay → Thanh toán thẻ không có nhận hàng / công tắc ví; QR giả →
  trả → màn chúc mừng → "Đặt đồ uống ngay"; Ưu đãi 4 trạng thái.
- F4 Đột biến tay (`viec/KH-THE-2/dot_bien_tay.js`) ≥ 8, mỗi cái ĐỎ: gửi `vi` cho thẻ khi công tắc nhớ bật · hiện công tắc ví ở Thanh toán thẻ · gửi `ma_giam` với thẻ · Mua ngay thêm
  thẻ vào giỏ · gửi đơn khi hạng / gói không còn bán · tiết kiệm sai (×10 hoặc làm tròn lên) · "sắp hết hạn" ở 8 ngày · ghi đè `kh_dung_vi` khi mua thẻ.
- F5 Bài thử CŨ: phần "thẻ trong giỏ / trả thẻ trước" của `thu_KHTHE1.js` (và bài khác nếu có) — hành vi đổi có chủ đích → sửa / bỏ đúng ca đó, ≥ 1 ca sửa ĐỎ trên gốc kể cả
  `KHONG_TRINH_DUYET=1`; KHÔNG dùng `## Bài thử cũ sửa`. Bài thử luồng đơn đồ uống (MUA-1 / 1b / 1c, BAO-1, TT-1, SOHD-1, HD-1, NHANH-1…) GIỮ XANH không sửa ca.
- F6 Ảnh 360 / 390 / 430 bản thiết kế ↔ app: Màn 1–4 + bốn trạng thái thẻ Ưu đãi → `viec/KH-THE-2/so_anh/` + `doi_chieu_demo.md` (khác vì đâu, ghi rõ). Màn cũ không đổi: Giỏ và
  Thanh toán đơn đồ uống so trước / sau = 0 điểm khác (trừ đúng chỗ bỏ dòng thẻ / nút Trả thẻ trước).
- F7 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tệp nào tăng (tệp mới 0; tệp giảm thì `node cong_cu/ha_no_chu.js`); ghi `trang_thai.md` + dòng
  `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- F8 Chủ quán thử tay: (1) Ưu đãi — thẻ đúng tình trạng của mình, ở trên cùng; (2) Hạng thành viên — bảng so sánh ở đầu, chạm cột Kim Cương / Vàng đổi gói và nút; (3) Mua ngay →
  Thanh toán chỉ có QR → trả gói rẻ → màn chúc mừng → "Đặt đồ uống ngay" thấy giá đã giảm.

## Phạm vi
- viec/KH-THE-2/**
- src/dangKySW.js
- src/pages/HangThanhVien.jsx
- src/pages/ThanhToan.jsx
- src/pages/TheoDoiDon.jsx
- src/pages/UuDai.jsx
- src/pages/GioHang.jsx
- src/components/TheHoiVien.jsx
- src/components/TheHang*.jsx
- src/components/BieuTuong.jsx
- src/App.jsx
- src/duongDan.js
- src/gio.js
- src/datDon.js
- src/giaHang.js
- src/giaoDien/the_hang.css
- src/giaoDien/thanh_toan.css
- src/noiDung/nd/theHang.js
- src/noiDung/nd/taiKhoan.js
- src/noiDung/nd/donHang.js
- src/noiDung/nd/menu.js
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHTHE2.js
- cong_cu/thu_*.js

## Ngân sách
~450 dòng app (Hạng thành viên ~150, Thanh toán thẻ ~80, thẻ Ưu đãi 4 trạng thái ~90, Chào mừng ~50, đường dẫn / App ~30, danh mục ~60) − ~120 dòng bỏ (thẻ trong giỏ, trả thẻ trước,
thẻ xám, tab) + ~400 dòng thử. **Phương án đơn giản nhất đã xét:** Thanh toán thẻ = CHÍNH màn Thanh toán với "giỏ" một dòng thẻ dựng từ đường dẫn (không đường đặt đơn mới); cách trả
của đơn có thẻ = một hàm thuần trả `qr`; màn chúc mừng = trạng thái `xong` của Theo dõi đơn chỉ thẻ (không màn / đường dẫn mới); thẻ Ưu đãi = một hàm chọn trạng thái + một thành phần.
Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không (`kh_gio` thôi nhận dòng thẻ — bản cũ có dòng thẻ đọc bỏ dòng đó)

## Thư viện mới
không

## Cấm
- KHÔNG tự tính giá thẻ / tổng / hạn mới để gửi đi hay hiện như số POS; KHÔNG tự cấp hạng; KHÔNG gọi cửa ngoài hợp đồng v13; KHÔNG gửi `vi` / `vi_qr` / `ma_giam` cho đơn có thẻ.
- KHÔNG đổi hành vi đơn đồ uống (luật "chưa rõ", khoá gửi, PIN, gửi lại, huỷ, công tắc ví, mã giảm).
- `src/App.jsx` CHỈ: đường dẫn / màn Thanh toán thẻ, `muaThe`, bỏ `traTheTruoc`, truyền props mới. KHÔNG sửa phần quảng cáo (`chonQuangCao`, `moDichQuangCao`, dải / banner — KH-QC-1)
  và dòng `<TienIch …>`.
- `src/noiDung/nd/index.js` không sửa (không thêm tệp nhóm mới). Tệp nhóm khác CHỈ thêm / sửa / xoá mục của khối mình đụng.
- KHÔNG sửa `src/api.js`, `src/luuMay.js`, `src/main.jsx`, `src/quangCao.js`, `src/pages/TrangChu.jsx` (nhắc gia hạn giữ nguyên), `src/pages/Menu.jsx`, `public/**`, `index.html`,
  `thiet_ke/**`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- Màu / phông / bóng chỉ từ demo (K9); biểu tượng chép từ demo, không vẽ mới.
- Chỉ push `git push -u origin viec/KH-THE-2`. Không đụng `main`, không merge, không tạo PR.

## Trả lời câu hỏi kế hoạch (chủ quán duyệt 14.11 theo đề nghị của chat)
1. **Q1 `src/dangKySW.js`:** ĐỒNG Ý — đã thêm vào Phạm vi. CHỈ thêm `uudai\/hang\/thanhtoan` vào regex `KHONG_AN_TOAN` (không đổi gì khác trong tệp) + ca
   `coTheTaiLai('/uudai/hang/thanhtoan')` → false ở `thu_KHTHE2.js` (đỏ trên gốc); KHÔNG sửa `thu_KHPWA1.js`.
2. **Q2 đầu màn "Chào mừng hội viên":** GIỮ `DauManCon` (nút quay lại + số đơn) như mọi màn Theo dõi đơn.
3. Mục 7 "Sửa sau khi agent phụ soát" và mọi phần khác của `ke_hoach.md` (88d5262): DUYỆT nguyên.
4. **Việc chạy song song từ 14.11:** KH-ADMIN-1 (Opus — /admin, Chế độ sửa) và KH-QC-1 (Sonnet — dải quảng cáo đọc `/quang-cao`). Việc này KHÔNG sửa: dòng `/admin` trong
   `src/duongDan.js` / `src/App.jsx`, phần quảng cáo của `src/App.jsx`, `src/noiDung/nd.js`, `src/components/Chu.jsx`, `src/components/Man.jsx`, `src/quangCao.js`, `src/pages/TrangChu.jsx`.
   Thêm vào `src/duongDan.js` / `src/App.jsx` ở dòng RIÊNG của mình (dòng `BANG` mới, `muaThe`, màn Thanh toán thẻ, `veThanhToan`, `soMonGio`) để gộp không xung đột.
