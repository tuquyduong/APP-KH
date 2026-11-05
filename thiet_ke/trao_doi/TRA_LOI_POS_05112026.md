# TRẢ LỜI POS → App KH — 05.11.2026 · số đơn = số hoá đơn POS · tóm tắt đơn · câu luật 4xx

Đáp thư `YEU_CAU_APPKH_GUI_POS_05112026.md`. Đã chủ quán duyệt 05.11. POS mở việc bằng sổ v54 (main sau 4723a3b).

## 1. Số đơn khách đọc = số hoá đơn POS → việc CK-NOIDUNG-1 ([T] Opus, đang lập kế hoạch)
- Chủ quán chốt dạng số hoá đơn MỚI (không phải 3 số cuối của `ORD-…`): **`APP0016`** cho đơn App, **`HD0016`** cho đơn quầy — 4 số, quầy và App
  dùng CHUNG một dãy mỗi ngày (giờ VN), số không trùng giữa hai kênh. Cùng số đó nằm trong nội dung chuyển khoản (`TQDNOV05 APP0016`), in to trên
  bill / tem ly / phiếu pha chế, hiện to ở màn "Đơn App" của quầy.
- Trường mới: **`so_hd`** (chuỗi đúng như in, vd `"APP0016"`) ở `GET /don`, `GET /don/:ma`, `POST /don`; `null` khi đơn chưa được cấp số. Số được cấp
  ngay lúc tạo QR (đơn `cho_tra` đã có số); QR không thành công thì số đó huỷ (đơn `da_huy` vẫn có thể còn `so_hd` — App đừng in to số của đơn đã huỷ).
- `ma` / `ma_don` KHÔNG đổi — App tiếp tục dùng mã App cho đường dẫn và để gọi cửa.
- App chỉ hiện đúng chuỗi `so_hd` POS trả ("Số đơn của bạn — APP0016"); không cần `so_goi` riêng. Trước khi có trường này App giữ cách hiện tại.
- Nội dung chuyển khoản mới App không phải làm gì: QR / nội dung vẫn do POS trả trong `qr` như nay.

## 2. Tóm tắt đơn ở Lịch sử đơn → việc KH-TOMTAT-1 ([Th] Sonnet, làm SAU khi CK-NOIDUNG-1 gộp)
- POS nhận ĐÚNG tên App đề xuất: `kenh`, `cach_nhan`, `tra[] { cach, so_tien }`, `so_mon`, `mon_dau`, `giam` — ở `GET /don` (mỗi đơn) và `GET /don/:ma`.
  Giá trị `cach` sẽ chốt theo tên dùng trong hoá đơn / Đối soát của POS và ghi vào hợp đồng khi việc gộp. Đơn cũ thiếu dữ liệu → `null`.
- `hoa_don[]`: dựng bằng CHÍNH hàm tờ giao khách in ở quầy (HD-KH-1), nên có các dòng cách trả, giảm hạng / mã / điểm, cách nhận như tờ in (bỏ có chủ
  ý: QR, mã nhận điểm, dòng in lại, tờ lưu). KH-TOMTAT-1 có bài thử xác nhận; thiếu dòng nào thì POS bổ sung cho khớp tờ in.

## 3. Câu luật 4xx của hợp đồng
- Đúng như App đọc. Sửa ở lần đổi hợp đồng của CK-NOIDUNG-1: "mọi 4xx của `POST /don` = chưa tạo đơn" TRỪ 401, 409 `KHO_BAN` (chưa rõ → gửi lại CÙNG
  khoá) và 409 `KHOA_GUI_DA_DUNG` (mời xem Lịch sử đơn). Cách App làm ở KH-MUA-1c là đúng.

## 4. Báo trước (để App chuẩn bị)
- HUY-1 ([T] Opus, sau CK-NOIDUNG-1): quầy huỷ được đơn App từ lúc đơn về; đơn đã trả → hoàn TOÀN BỘ vào tài khoản khách. App sẽ thấy `da_huy` + số
  đã hoàn + lý do ngắn (tên trường POS báo khi duyệt kế hoạch).
- Số PHIEN_BAN hợp đồng: CT-1a = v9 (đã gộp); HANG-1 giữ v10; các việc trên lấy số tiếp theo theo thứ tự gộp — POS báo số thật khi gộp.
