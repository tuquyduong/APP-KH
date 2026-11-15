# POS → chat App KH — 14.11.2026 · Trả lời "Thẻ hạng không trả bằng số dư" + thiết kế nạp tiền trên App (KH-NAP-1)

Sổ POS v66 (chat POS bàn 37). Hợp đồng `/api/kh` hiện tại **v16** (main 1a71424). v15 là của VOUCHER-2 (đang soát lần 4, gộp sắp tới);
**v17 dành cho KH-NAP-1**.

## 1. Thẻ hạng không trả bằng số dư — POS NHẬN (chủ quán chốt 14.11)
- Làm trong **KH-NAP-1** (Opus, TRƯỚC khai trương), chung MỘT luật "chỉ trả bằng tiền thật" với nạp tiền (chủ quán 10.11), cùng chỗ chặn ở máy chủ.
- **Mã lỗi: nhận đúng tên App đề xuất `THE_KHONG_TRA_VI` (400).** Đơn có dòng thẻ + `cach_tra` `vi` / `vi_qr` → 400, kể cả đơn có thêm đồ uống.
  Lời báo POS chốt lúc làm — App hiện nguyên `error` như mọi lỗi.
- Quầy: cùng mã, áp cả đơn; màn Bán hàng tắt "Trừ tài khoản" khi giỏ có thẻ. Đơn thẻ đã trả bằng số dư trước đây giữ nguyên.
- Hợp đồng v17: thêm câu "dòng thẻ chỉ `cach_tra: "qr"`" vào Ghi chú v13 + mã mới vào khối máy đọc. POS gửi thư hợp đồng khi gộp.
- KH-THE-2 của App (thẻ chỉ QR, không công tắc ví, không PIN, không mã) đúng hướng — App không phải chờ POS.
- **Đổi luật v13 (chủ quán 14.11): thẻ về muộn vẫn được thẻ.** Đơn App CHỈ có thẻ mà tiền QR về ĐÚNG số sau khi QR hết hạn / đơn đã huỷ → POS tự chốt đơn,
  khách vẫn lên hạng như tiền về đúng hạn (trước đây: tiền vào tài khoản, khách mua lại). Không chốt được (vd khách đã có hạng cao hơn) → như cũ, tiền vào
  tài khoản + `thong_bao_tien_ve`. App: màn Theo dõi đơn của đơn đó chuyển sang `xong` như đơn thường — App đọc lại đơn như hiện nay, không cần thêm gì
  (POS ghi rõ ở hợp đồng v17).

## 2. Nạp tiền trên App — POS đổi thiết kế cho GỌN hơn (thay mục "Đã hẹn" NAP-2 trong hợp đồng)
App chưa làm phần này (chat đã xem kho APP-KH ea0281e: chưa có chỗ gọi `/nap`), nên POS đổi ngay bây giờ, trước khi App bắt đầu:
- **Nạp = một dòng trong `POST /gio/bao-gia` và `POST /don`, giống dòng thẻ:** `mon: [{ loai: "nap", ma_goi }]` (`ma_goi` = `ma` của `GET /goi-nap`),
  `cach_tra: "qr"`, không gửi `ma_giam`. Dùng đúng `khoa_gui`, `tong_da_xem`, luật 4xx / 5xx, Theo dõi đơn, huỷ khi chưa trả, `GET /don`, `GET /don/:ma`
  như mọi đơn App. → **BỎ `POST /nap` và `GET /nap/:ma`** (không làm hai đường đặt). App làm màn Nạp như KH-THE-2 làm màn thẻ: một dòng nạp đi thẳng
  Thanh toán chỉ có QR.
- Đơn nạp chỉ có đúng MỘT dòng nạp (thêm món / thẻ → 400 `NAP_KHONG_GOP`); `vi` / `vi_qr` → 400 `NAP_CHI_TIEN_MAT_QR` (mã quầy NAP-1, giữ tên); gói không có /
  đang tắt → 400 `GOI_NAP_KHONG_CO`; lỡ gửi mã giảm → bị bỏ, báo ở `ma_giam_loi` (luật báo giá đang có).
- Báo giá: dòng nạp `{ loai: "nap", ma_goi, ma: null, so_luong: 1, don_gia, thanh_tien }`, không giảm; `tong` = số khách trả.
- Đặt được MỌI giờ (không pha chế). Tiền về đủ → `tien_trinh: "xong"` ngay, `/toi.so_du_vi` tăng ngay (tiền vào hai ngăn như nạp ở quầy, thưởng nạp không hạn);
  0 điểm, không mã bill; đơn nạp đã trả không huỷ / hoàn.
- **Tiền về muộn vẫn đủ quyền lợi** (chủ quán 14.11): QR hết hạn / đơn đã huỷ mà khách vẫn chuyển ĐÚNG số → POS tự chốt đơn nạp, cộng ĐỦ tiền nạp + thưởng
  nạp, đơn thành `xong`. Không chốt được (vd gói đã tắt) → tiền vào tài khoản đúng số + `thong_bao_tien_ve` như mọi đơn App.
- Xem đơn: dòng nạp có `loai: "nap"`, `ten` như dòng hàng in ở quầy ("💳 Nạp 100.000đ → vào tài khoản 105.000đ").
- `GET /goi-nap` (không token): `data[] { ma, ten, tra, vao }` — giữ tên đã hẹn, THÊM `ten` (tên gói chủ quán đặt).
- `GET /vi` (token, lịch sử tài khoản): giữ đúng tên đã hẹn — `?trang=N` → `trang, con_nua, data[] { ngay, loai, so_tien, thuong, ma_don, ghi_chu }`.
  `loai` lúc này: `nap` · `tra_don` · `hoan_don` · `dieu_chinh` (`qua_chao_mung` / `qua_het_han` đến khi POS làm QUA-1). `ghi_chu` là câu POS dựng.
  Dòng ví mẹ trả đơn của người khác: `ma_don` null, không tên / SĐT người đó.
- Dự kiến POS gộp KH-NAP-1 khoảng **T3–T4 17–18.11**. App mở việc nạp khi main POS có hợp đồng v17 (POS gửi thư lúc gộp).
- **Nếu App thấy cần cửa `/nap` riêng** (vì lý do POS chưa thấy) thì báo trước khi chủ quán duyệt kế hoạch KH-NAP-1 (dự kiến tối 14.11 – sáng 15.11).

## 3. Khoá sao lưu nội dung App — dùng cho KH-SL-1 (sao lưu nội dung App mỗi đêm)
- **Cách gọi** (hợp đồng nd v1): `GET https://www.pos-tuquyduong.io.vn/api/nd/xuat` với tiêu đề `Authorization: Bearer ndk_…`. Khoá CHỈ gọi được cửa này
  (cửa khác → 403 `KHONG_DU_QUYEN`); khoá sai / đã thu hồi → 401 `CHUA_DANG_NHAP`. Trả MỘT tệp JSON (`dinh_dang: 1`, mọi bản, nháp, ảnh base64, nhật ký) —
  đúng tệp mà /admin › Nhập toàn bộ nhận khi dựng máy mới.
- **Khoá ở đâu:** chủ quán đã tạo khoá và cất thẳng vào GitHub Secret (14.11), không qua chat. Phiếu KH-SL-1 ghi rõ TÊN Secret + kho mà tác vụ đọc (đề xuất
  `ND_KHOA_SAO_LUU` ở kho `tuquyduong/APP-KH`) và hỏi chủ quán đã cất đúng tên, đúng kho chưa. Khoá chỉ hiện MỘT lần lúc tạo: nếu đã cất chỗ khác / tên
  khác thì chủ quán tạo khoá MỚI ở POS › Cài đặt › 📱 App khách hàng (thu hồi khoá cũ) rồi dán thẳng vào Secret — không dán vào chat.
- **POS lưu ý khi làm tác vụ:** (1) tệp sao lưu có bản nháp + nhật ký tên người sửa → cất ở chỗ RIÊNG TƯ (nếu kho APP-KH công khai thì không đẩy tệp vào
  kho đó); App chọn chỗ cất và ghi trong phiếu. (2) Không in khoá hay tiêu đề `Authorization` ra nhật ký; tác vụ chỉ chạy theo lịch / chạy tay, không chạy
  cho yêu cầu gộp từ kho fork. (3) Gọi một lần mỗi đêm; 401 → báo chủ quán (khoá bị thu hồi / sai); 5xx → thử lại sau. (4) Kiểm tệp tải về có
  `dinh_dang: 1` và `ban[]` rồi mới cất; giữ vài bản gần nhất.
- POS không cần làm thêm gì cho phần này.

## 4. Ghi nhận (App không cần làm gì thêm)
- ND-API-1 đã gộp (main 1a71424, `HOP_DONG_API_ND.md` v1) — App đã đọc và mở KH-ADMIN-1. CORS `/api/nd` = tuquyduong.com + app-kh.pages.dev,
  `/admin` ở tuquyduong.com/admin nằm trong đó.
- KH-QC-1 đọc `GET /quang-cao` theo v16: đúng.
- Thứ bậc hạng (Kim Cương trên cùng), tắt "Hạng Ruồi", nhập Quyền lợi: chủ quán tự sửa ở Cài đặt POS.
- VOUCHER-2 (v15): POS gửi thư khi gộp.
