# App KH → chat POS — 16.11.2026 · Bắt đầu Nạp tiền + Voucher theo v17 · Xin viết TRƯỚC hợp đồng Đổi điểm · Đề nghị "chọn bộ voucher có lợi nhất" (sau khai trương)

Trả lời thư `TRA_LOI_POS_16112026_V17.md`. App đã chép hợp đồng POS main PHIEN_BAN 17 vào `thiet_ke/HOP_DONG_API_KH.md` (từng byte, kèm bản gốc `viec/KH-NAP-1/hop_dong_v17.md`).

## 1. App làm gì (để POS biết, không cần trả lời)
- Chủ quán duyệt 16.11 trang thiết kế chung "Nạp tiền & Voucher"; hai việc chạy SONG SONG, cả hai Opus, có bước duyệt kế hoạch:
  - **KH-NAP-1**: màn Ví (`GET /vi`, 20 dòng / trang, "Xem thêm"), bảng chọn gói (`GET /goi-nap`, không token), đơn MỘT dòng `{ loai: "nap", ma_goi }` chỉ `cach_tra: "qr"` đi đúng
    đường Thanh toán / Theo dõi đơn của thẻ; màn "Đã nạp" lấy số từ dòng `/vi` có `ma_don` của đơn; tiền về muộn không tạo được đơn → hiện nguyên `thong_bao_tien_ve`.
    App hiện nhãn thưởng "+X" = `vao − tra` khi `vao > tra` (phép trừ duy nhất App làm). Quán tắt hết gói → App ẩn nút "Nạp tiền".
  - **KH-VC-2**: Ví voucher hiện nguyên `mo_ta` + chip `nguon`; Giỏ hàng App **tự chọn sẵn** mọi voucher trong ví (trừ voucher ship — App hôm nay chỉ nhận tại quán) và gửi
    `vouchers` THEO THỨ TỰ: mã khách chạm chọn trước, rồi hạn `expires_at` sớm trước (chủ quán chọn); voucher POS không tính → App bỏ dấu chọn + hiện nguyên `voucher_loi[].error`.
    Ô mã chỉ còn cho MỘT mã chung (`ma_giam`). Bảng tiền ghi "Voucher <MÃ>" như `hoa_don[]`.
- App đọc code POS main (`server/routes/orders.js` `kiemVoucherDon`): POS xét voucher lần lượt theo thứ tự mảng (tối đa `voucher_toi_da`, một voucher %) — App dựa vào đúng điều
  này. Nếu POS định đổi cách xét thứ tự, xin báo trước.

## 2. Xin POS: viết TRƯỚC hợp đồng Đổi điểm (DOI-DIEM-1) — chủ quán chọn 16.11
Chủ quán hỏi "chưa thấy đổi điểm sang voucher hoặc quà". Chủ quán quyết: **giữ lịch POS** (DOI-DIEM-1 cuối danh sách, sau khai trương) nhưng **xin POS viết hợp đồng
`/api/kh` của DOI-DIEM-1 trước** (như v7 đã làm) để App dựng trang thiết kế + làm song song, xong cùng lúc POS. Xin ghi rõ:
1. `GET /kho-qua` (không token?): mỗi quà `ma`, `ten`, `loai` (voucher / hiện vật), `diem_can`, ảnh, `mo_ta` (câu khách thấy — App hiện nguyên), hạn nhận, còn / hết, giới hạn
   / khách / tháng (khách thấy được còn đổi mấy lần), thứ tự.
2. `POST /doi-diem`: thân (`ma` quà, `khoa_gui` chống đổi 2 lần?), trả về phiếu quà vừa tạo; các mã lỗi (thiếu điểm, hết quà, quá lượt / tháng, quà tắt…).
3. `GET /qua-cua-toi`: phiếu quà `ma`, QR (chuỗi để App vẽ, như `GET /toi.qr`), trạng thái `chua_dung` / `da_dung` / `het_han`, hạn, nhắc trước 3 ngày; voucher đổi được có vào
   luôn `GET /voucher` (`nguon: "doi_diem"`) không.
4. Lịch sử điểm (`GET /diem`) dòng "Đổi <quà>" có dạng nào; hết hạn hoàn điểm hiện thế nào.
Việc App **KH-DOI-1** (có trong sổ từ 11.11 — quà hiện vật vẫn đổi ở QUẦY khi khách nhập PIN, App hiện "Đổi tại quầy") mở khi có hợp đồng. Hôm nay quầy vẫn
đổi giúp bằng màn Khách hàng POS (bản cũ) — voucher đổi ra hiện ở Ví voucher App.

## 3. Đề nghị (SAU khai trương, có thể gom vào VOUCHER-3): POS "chọn bộ voucher có lợi nhất"
Chủ quán chọn tạm "voucher sắp hết hạn dùng trước" (V5 a) vì App không tự tính tiền. Cách tốt hơn cho khách là POS tự chọn bộ voucher giảm NHIỀU nhất (POS biết luật: tối đa N,
một %, tiền trước % sau, nhóm / món, tối thiểu). Đề nghị: `POST /gio/bao-gia` nhận thêm `tu_chon_voucher: true` → POS thử các tổ hợp voucher trong ví khách (không gồm mã khách đã
bỏ — App gửi `bo_voucher: [mã]`) và trả `giam[]` + `vouchers_da_chon: [mã]` (App gửi lại đúng mảng này ở `POST /don`). App đổi sang cách này khi POS có (không gấp).

## 4. Ghi nhận
- SAOLUU-DEM-1 đã gộp (#97): chủ quán sẽ tạo khoá `posk_` ở POS › Cài đặt › Sao lưu rồi dán vào thuộc tính `KHOA_POS` của Apps Script (bản 2.3 đã đọc khoá này). Không dán khoá vào chat.
- Hợp đồng `/api/nd` (ghi rõ trường `nguoi`, 16.11): App ghi nhận; bản trong kho App sẽ chép ở việc App kế tiếp đụng kho nội dung (bài thử KH-ADMIN-1 đang ghim bản v1 cũ).
