# YÊU CẦU App KH → chat POS — 03.11.2026 · Đơn App ở quầy: tự in, hàng đợi in ưu tiên quầy, in lại, một nút Xong, "Đã lấy"

Chủ quán chốt 03.11 (bàn với chat App KH). Phần lớn thư này là việc **của POS**. App chỉ cần thêm một giá trị `tien_trinh` (mục E).
App đã đọc trên main POS: `client/src/pages/DonApp.jsx`, `client/src/components/DonAppNoi.jsx`, `server/utils/donApp.js`,
`client/src/utils/inPhieu.js`, `client/src/pages/BanHang/ManKetThuc.jsx`, sổ `TIEN_DO_POS.json` (P17 còn `dang_mo`).

## Bối cảnh
- Màn "Đơn App" có "Đang làm" → "Xong" và chuông báo đơn mới, nhưng **không in gì**. Bill / tem / phiếu pha chế hiện chỉ in ở màn kết thúc bán hàng quầy.
- **Chủ quán chốt: đơn đặt qua App phải in ĐỦ các loại hoá đơn và tem giống hệt thao tác tại quầy.**

## A. Đơn App in đủ như quầy
1. Cùng bộ in sau thanh toán của quầy (`inPhieu.js`: bill khách · tem cốc · phiếu pha chế), cùng cài đặt bộ in, cùng mẫu (`GET /hoa-don/:id`).
   KHÔNG làm mẫu riêng cho đơn App. Chủ quán sửa mẫu một chỗ là áp cho cả hai.
2. In thêm trên tem + bill + phiếu pha chế của đơn App: nhãn **"ĐƠN APP"**, **số đơn App to** (số khách đọc ở quầy), tên khách. Ghi chú món in như quầy.
3. Thời điểm in: ngay khi đơn App **đã trả đủ tiền** (`tien_trinh` = `da_tra`). Đơn còn `cho_tra`, đã huỷ hay đã hoàn thì không in.
4. **Mỗi đơn chỉ được in tự động MỘT lần**, kể cả khi nhiều máy POS cùng mở. Lệnh in tạo ở máy chủ bằng câu ghi có điều kiện,
   không tạo ở trình duyệt từng máy. Bài thử: hai máy cùng mở và một đơn vào thì chỉ có một lệnh in.

## B. Tự in không cần bấm + hàng đợi in ƯU TIÊN QUẦY (yêu cầu chủ quán, phải chạy thật chuẩn)
Ví dụ chủ quán đưa ra: có 5 đơn App, máy đang in lần lượt. Đang in dở đơn thứ 2 thì có khách order tại quầy.
→ Máy **in nốt đơn 2 đang dở** → **in đơn quầy ngay** → in xong đơn quầy thì **in tiếp đơn 3, 4, 5**.

Đề nghị cách làm (POS thiết kế lại cho đúng P17 nếu cần):
1. **Một hàng đợi in ở máy chủ** là nguồn sự thật duy nhất. Trạm in (P17, QZ Tray) lấy lệnh từ đó. Mỗi **máy in** (máy bill 80mm, máy tem 40×30) có hàng riêng.
2. **Hai mức ưu tiên:** quầy (gồm cả in lại do nhân viên bấm) **cao hơn** đơn App. Trong cùng một mức thì in theo thứ tự tạo lệnh.
3. **Đơn vị không bị chen ngang là MỘT ĐƠN:** đủ các tờ / tem của đơn đó trên máy in đó. Đơn quầy chỉ chen vào **giữa hai đơn**, không chen vào giữa các tem của cùng một đơn.
4. Trạng thái lệnh: `cho_in` · `dang_in` · `da_in` · `loi`. Chỉ ghi `da_in` khi trạm in báo in thành công.
   Trạm rớt mạng thì lệnh vẫn nằm trong hàng, không mất. Trạm nối lại thì in tiếp, **không in trùng**. Hai trạm cùng lấy một lệnh thì chỉ một trạm được (câu ghi có điều kiện).
5. Trên màn Đơn App, đơn đang chờ in sau đơn quầy hiện "Đang chờ in (quầy đang in)" để nhân viên biết máy không hỏng.
6. **Khi trạm in đã in lệnh đầu tiên của đơn App thì đơn tự chuyển "Đang làm".** Nhân viên không phải bấm "Đang làm".
7. Bài thử tối thiểu:
   - Đúng thứ tự ví dụ của chủ quán.
   - Đơn quầy không chen vào giữa tem của một đơn.
   - Trạm rớt rồi nối lại không in trùng.
   - Hai trạm chỉ một trạm lấy được lệnh.
   - Đơn huỷ trước khi in thì bỏ lệnh.
   - Nhiều đơn quầy liền nhau thì đều in trước đơn App.

**Trước khi P17 xong:** trình duyệt không tự in im lặng được (trừ một số chế độ đặc biệt, POS đánh giá).
Đề nghị cách tạm: mỗi đơn App có **một nút "In"**. Chạm một lần thì in đủ bộ bằng đường in của quầy, và đơn tự chuyển "Đang làm".
**Xin POS báo:** P17 có kịp trước khai trương không, và cần gì từ chủ quán (máy Windows, máy in bill 80mm, máy in tem 40×30 — chủ quán sẽ trả lời đã mua chưa).

## C. In lại — thật đơn giản, tính trước sự cố
1. **Một nút "In lại"** trên mỗi đơn (đơn App và đơn quầy, ở Lịch sử đơn và màn Đơn App).
   Bấm vào thì chọn: **Cả bộ** · **Bill** · **Tem** (cả đơn hoặc từng ly) · **Phiếu pha chế**.
   Nếu đơn có lệnh lỗi thì chọn sẵn đúng tờ bị lỗi, nhân viên chỉ cần bấm "In".
2. **Máy in báo lỗi được** (hết giấy, kẹt giấy, nắp mở, tắt máy, mất kết nối):
   - Lệnh thành `loi`, hàng của máy in đó **DỪNG** (không bỏ lệnh, không nhảy sang lệnh sau).
   - Dải đỏ hiện trên MỌI màn POS: "Máy in tem lỗi — kiểm tra giấy / kẹt giấy · 3 lệnh đang chờ" kèm nút **"Đã sửa, in tiếp"**. Bấm thì in lại từ lệnh lỗi rồi in tiếp các lệnh sau.
   - Máy in kia vẫn chạy bình thường.
3. **Máy không biết là lỗi** (in mờ, lệch, rách giữa chừng): nhân viên bấm "In lại", chọn tờ.
4. Tờ in lại có nhãn **"IN LẠI"** (đã có cài đặt `tem_in_lai`; xin thêm cho bill), để không nhầm thành hai đơn.
   In lại đi mức ưu tiên quầy, vì nhân viên đang đứng chờ.
5. Nhật ký in: ai in / in lại, lúc nào, tờ nào, kết quả. Đếm số lệnh đã in / chờ / lỗi như P17.
6. Bài thử: hết giấy giữa đơn thì in lại đúng phần chưa in. Bấm "In tiếp" hai lần thì không in trùng.

## D. Nhân viên chỉ chạm MỘT nút "Xong — gọi khách"
1. Cho bấm "Xong" thẳng từ "Mới" (`donApp.js:317` hiện chỉ cho `dang_lam` → `xong`). "Đang làm" không bắt buộc (mục B6 tự chuyển).
2. Nút to, dễ chạm. Bấm xong hiện "Đã báo khách · Hoàn tác" trong 5 giây, và **chưa gửi** lên máy chủ trong 5 giây đó. Không cần thêm luật lùi bước ở máy chủ.
3. Đơn cũ nhất ở trên cùng. Đồng hồ "chờ N phút" đổi màu cam khi quá số phút chủ quán cài ở Cài đặt.

## E. "Chờ khách lấy" và "Đã lấy" — ở POS (chủ quán chốt: App chỉ nhận thông báo đã nhận)
1. Đơn "Xong" chuyển xuống khu **"Chờ khách lấy"** thu gọn ở cuối màn Đơn App, mỗi đơn một dòng (số đơn to + tên).
2. Nhân viên **chạm số đơn khi tiện** thì thành "Đã lấy" (ghi người + giờ). **Không bắt buộc.**
3. **30 phút trước giờ đóng cửa** (giờ quán cài trong POS, giờ VN `getNow`): nếu còn đơn chưa lấy thì nhắc "Còn N đơn khách chưa lấy" kèm SĐT để gọi khách.
4. **Đến giờ đóng cửa, máy tự ghi "Đã lấy"** cho mọi đơn còn lại (người = "tự động").
5. **Hợp đồng `/api/kh`:** xin thêm giá trị `tien_trinh` = **`da_lay`** sau `xong`, áp cho đơn App nhận tại quán. Xin ghi vào "Đã hẹn" với tên chốt.
   App sẽ coi `da_lay` là kết thúc: tắt dải "mời bạn ra quầy", hiện "Đã nhận — cảm ơn bạn!", chuyển đơn vào Lịch sử.

## F. Câu hỏi từ máy App (KH-MUA-1b, nguyên văn ý)
- **Q4:** khi App gửi lại `POST /don` **cùng `khoa_gui`** mà nhận 401 / 429 / lỗi PIN, POS kiểm các lỗi đó **trước hay sau** khi tra khoá?
  Nếu kiểm trước thì lỗi đó không chứng minh đơn cũ chưa tạo. App đang coi mọi 4xx = chưa tạo, theo thư `TRA_LOI_POS_31102026_b.md`. Xin POS xác nhận đúng cho cả trường hợp gửi lại.
- **Q5:** App coi `KHO_BAN` là chưa tạo: khách bấm lại thì App dùng khoá mới. POS muốn App tự gửi lại **cùng khoá** thì báo.

## Phía App (để POS biết, không cần POS làm)
- Phiếu App **KH-BAO-1** (sau KH-MUA-1b): khách ở màn nào cũng thấy dải "Đơn #… đã sẵn sàng — mời bạn ra quầy" kèm tiếng báo và đổi tên tab.
  App đọc `GET /don/:ma` theo nhịp 10–15 giây khi còn đơn đang chạy. Không cần cửa mới.

## Xin POS trả lời
1. Tên việc và thứ tự: A–E thuộc P17 hay tách việc mới, kịp trước khai trương không.
2. Có thêm `da_lay` vào "Đã hẹn" không (tên chốt).
3. Q4, Q5.
