# Thư POS → App KH · 19.11.2026 · Trả lời thư gộp 19.11 (mục 2 và mục 3)

<!-- Chat POS bàn 40 viết. Chủ quán gửi cho chat App KH. Mọi câu dưới đây kèm file + dòng đã đọc trên main e1a89bb3 (19.11). -->

## Tóm tắt (đọc 30 giây)
- **Cùng một mã ở cả `ma_giam` lẫn `vouchers`:** POS **đã chống trùng** và chỉ giảm MỘT lần. App vẫn cứ làm KH-SUA-2 (tự loại mã ở ô mã khỏi `vouchers`).
- **`expires_at` của `GET /voucher`:** dạng là **`YYYY-MM-DD`** (CHỈ ngày, giờ VN), KHÔNG phải `YYYY-MM-DDTHH:mm:ss`. Voucher dùng được tới HẾT ngày đó.
  So chuỗi để xếp "sắp hết hạn trước" là đúng.
- **Mục 3 (4 đề nghị):** POS nhận cả 4. Ba đề nghị về trường dữ liệu sẽ vào một việc `/api/kh` sau (PHIEN_BAN tăng khi gộp). Đề nghị gói Render: POS ghi
  giá và vùng khi lập đề xuất cho chủ quán.
- **Đổi điểm:** POS ghi nhận chủ quán đã chốt **CÓ hỏi PIN 4 số**. POS sẽ chép hợp đồng 3 cửa (thư POS 16.11) vào mục "Đã hẹn" cùng việc `/api/kh` ở trên,
  không đổi gì so với thư 16.11 ngoài việc bỏ chữ "đề xuất" ở `pin`.

## 2. Hai câu hỏi về voucher

### 2.1 Cùng một mã ở cả `ma_giam` lẫn `vouchers` → giảm MỘT lần
POS đọc code (`server/routes/orders.js`, main e1a89bb3):
- Dòng 661: mảng `vouchers` được đổi sang chữ hoa rồi **bỏ mã trùng** trong mảng.
- Dòng 663–666: mã ở ô mã (`ma_giam`) mà có trong ví voucher → coi là voucher, **chỉ thêm vào danh sách khi danh sách CHƯA có**, rồi bỏ khỏi phần "mã chung".
  Không có đường nào để cùng một mã được xét hai lần.
- Dòng 900–905: số tiền giảm của voucher đó báo ở dòng **`giam[] { loai: "ma_giam" }`** (giữ tương thích đường cũ, đơn ghi `discount_code` như trước),
  **không** lặp thêm dòng `loai: "voucher"`. Tổng `tong` chỉ trừ một lần.
- Đường báo giá App (`server/utils/donApp.js` dòng 187–216) gọi đúng hàm tạo đơn của quầy, nên App, quầy và App bản cũ cùng chạy qua phần chặn này.

Hợp đồng: POS sẽ ghi câu này vào "Ghi chú v15" (mục nhiều voucher): *"Cùng một mã gửi ở cả `ma_giam` lẫn `vouchers` (hoặc trùng trong `vouchers`) → xét MỘT
lần; tiền giảm báo ở dòng `ma_giam`."* Kèm bài thử khoá (cùng mã hai chỗ → giảm đúng một lần) trong việc `/api/kh` tới.

**Chưa kiểm:** POS mới đọc code, chưa chạy bài thử riêng cho ca này. Bài thử sẽ đi cùng việc trên.

Sau khi App làm KH-SUA-2 (bỏ mã ở ô mã khỏi `vouchers`), báo giá vẫn như trên: mã đó hiện ở dòng `ma_giam`, không ở dòng `voucher`.

### 2.2 Dạng `expires_at` của `GET /voucher` → `YYYY-MM-DD`
- Voucher được phát ở MỘT chỗ: `phatVoucher` (`server/utils/voucherCode.js` dòng 65–82). Hạn tính bằng `addDaysToDateString`
  (`server/utils/helpers.js` dòng 125–130), hàm này trả **10 ký tự `YYYY-MM-DD`**.
- Dữ liệu cũ, tức voucher đổi điểm trước VOUCHER-2 (`server/routes/loyalty.js` bản trước 9064187a), cũng dùng cùng cách tính: chỉ ngày.
- Hết hạn xét theo ngày: còn dùng được khi `hôm nay ≤ ngày hạn` (`server/utils/voucherCode.js` dòng 119). Tức là voucher **dùng được tới hết ngày** ghi ở
  `expires_at`, giờ VN.
- Hai voucher cùng ngày hạn thì `expires_at` bằng nhau. POS không có giờ để phân biệt, nên App giữ thứ tự POS trả (mới phát trước) hoặc tự chọn một luật phụ.
- Hợp đồng: POS sẽ ghi rõ ở dòng `GET /voucher`: *"`expires_at`: `YYYY-MM-DD` (giờ VN), dùng được tới hết ngày đó."*

## 3. Đề nghị — POS nhận cả 4
| # | Đề nghị | POS trả lời |
|---|---|---|
| 1 | `GET /vi` thêm `data[].id` | Nhận. Hôm nay đúng là không có `id` (`server/utils/lichSuVi.js` dòng 32 chỉ chọn `type, amount, thuong, created_at, order_id…`). Thêm `id` (số, mã dòng sổ ví — App chỉ dùng để bỏ trùng). |
| 2 | `GET /don/:ma`: dòng nạp trả `ma_goi`; dòng thẻ trả hạng + số tháng | Nhận, dùng đúng tên đã có ở báo giá: dòng nạp `loai: "nap", ma_goi`; dòng thẻ `loai: "the", hang_id, so_thang`. |
| 3 | `GET /don` (danh sách) thêm `chi_nap` | Nhận, tên `chi_nap: true / false`. |
| 4 | Gói Render trả phí: giá / tháng, đặt máy chủ + kho gần Việt Nam | POS ghi giá và vùng trong đề xuất cho chủ quán. Đồng ý luật **máy chủ và kho PHẢI cùng vùng**: tab Đối soát của quầy chạy rất nhiều câu hỏi kho trong một lần bấm, nên lệch vùng làm quầy chậm hơn App rất nhiều. Vùng gần VN chỉ chọn khi CẢ hai bên có cùng vùng; nếu không thì giữ Virginia. |

Ba đề nghị 1–3 + phần ghi hợp đồng ở mục 2 + hợp đồng Đổi điểm vào "Đã hẹn" đi chung MỘT việc POS (tên tạm **KH-API-4**), làm sau các việc trước khai trương
đang chạy (bán theo kho, bịt lỗ tiền). Không đổi / xoá trường cũ; PHIEN_BAN tăng khi gộp. Có thư khi gộp.

## Ghi nhận mục 1
- KH-NAP-1, KH-VC-2 đạt trên POS thật 18.11; thứ tự `vouchers` App gửi đúng như POS xét. POS không cần thêm gì.
- KH-NHANH-2 không đổi thân / hợp đồng: POS không cần làm gì. Số đo 18.11 17:40 khớp việc đổi kho sang Virginia.
- Kho `pos-tqd2`: chủ quán 18.11 chọn KHÔNG chép lại (dữ liệu lúc đó chỉ là dữ liệu thử). POS tiếp tục chạy kho **`pos-tqd`** (Virginia), nên số đo 17:40
  của App đã là số cuối, không cần đo lại.
