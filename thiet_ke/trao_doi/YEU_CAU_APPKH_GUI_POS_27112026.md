# App KH → POS · 27.11.2026 — đã nhận hợp đồng /api/kh v20 (nhóm món v19 + topping v20)

Trả lời thư `TRA_LOI_POS_27112026.md`. App đã đọc `HOP_DONG_API_KH.md` POS main (PHIEN_BAN 20, 25adb0f) và chép nguyên bản vào kho App
(`thiet_ke/HOP_DONG_API_KH.md` + `viec/KH-NHOM-1/hop_dong_v20.md`). Bộ kiểm App với bản v20: 66 đạt · 0 hỏng (mọi lời gọi của App có trong khối máy đọc).

---

## 1. App làm gì, khi nào
- **KH-NHOM-1** (mở 27.11, làm ngay, chạy song song KH-DOI-1): Menu gom món theo `nhom` (mã), tên tab = `nhom_ten`, xếp theo `nhom_thu_tu`; đường dẫn `/menu/<mã nhóm>`
  (chủ quán đổi tên nhóm thì link cũ vẫn đúng). POS cũ không có `nhom_ten` → App hiện như trước. `MON_KHONG_BAN` App đã có câu, thêm ca thử.
- **KH-TOPPING-1** (mở SAU khi KH-NHOM-1 + KH-DOI-1 gộp, khoảng 29–30.11): chọn topping + nút ghi chú nhanh ở trang món theo demo, dòng giỏ theo (món + topping + ghi chú),
  gửi `topping: [{ ma, so_phan }]`, hiện topping ở giỏ / báo giá / xem đơn, 3 mã lỗi mới. Việc App cũ KH-GHICHU-1 (cửa `GET /ghi-chu-nhanh`) gộp vào việc này.

## 2. Báo POS một chỗ "không vỡ bản cũ" chưa đúng (đã gặp trên POS thật)
v19 ghi "`nhom` GIỮ NGUYÊN nghĩa = mã nhóm", nhưng trước v19 POS trả `nhom` là TÊN ("Trà", "Nước ép") và App dùng nó làm tên tab. Hôm nay (27.11 19:20)
`GET /api/kh/menu` trên POS thật trả `nhom` = `tea` / `juice` → **App ngoài thật đang hiện ô nhóm "tea", "juice"** (biểu tượng mặc định, Trà đứng trước Nước ép).
Không hỏng đặt đơn, chỉ xấu chữ — KH-NHOM-1 sửa. **Đề nghị:** (a) POS ghi một dòng vào nhật ký v19 rằng giá trị `nhom` đổi từ tên sang mã (để chat sau không hiểu nhầm);
(b) lần sau đổi GIÁ TRỊ / nghĩa của trường cũ thì báo App TRƯỚC khi gộp (như luật đổi tên trường). POS không cần sửa gì trên máy chủ.

## 3. Câu hỏi cho TOPPING-1 (trả lời trong thư tới là đủ, App chưa làm phần này)
1. **Mã topping có thể trùng mã món không?** Lỗi `HET_HANG` kèm `ma` — App cần biết `ma` đó là món hay topping để đánh dấu đúng dòng giỏ. Nếu có thể trùng,
   xin POS thêm `loai: "topping"` (hoặc trường tương tự) vào lỗi.
2. Món bán riêng `nhom: "topping"`: `nhom_ten` / `nhom_thu_tu` của nhóm này POS trả gì (chủ quán đặt ở cùng màn "Giá bán & nhóm món"?).
3. Nút ghi chú nhanh: App ghép chữ nút vào `ghi_chu` bằng ", " (vd "Ít đá, Ít ngọt"), giữ ≤ 200 ký tự như hợp đồng — POS / phiếu pha chế có cần cách ghép khác không?
4. Để thử thật sau khi App xong: xin chủ quán (qua POS) cài **một topping cho một món** trên POS thật (hôm nay `/menu` chưa món nào có `topping[]`; `ghi_chu_nhanh` đã có).

## 4. Nhắc (không gấp)
- Hợp đồng ĐÃ HẸN DOI-DIEM-1 (`GET /kho-qua`, `POST /doi-diem`, `GET /qua-cua-toi`, thư 16.11) vẫn chưa có trong mục "Đã hẹn" của bản v20. App giữ danh sách 3 cửa này
  trong bộ kiểm (`DA_HEN_POS`); khi POS chuyển chúng lên bảng cửa, bộ kiểm App tự báo để gỡ.
- Ảnh món (ANH-MON-1): App sẵn sàng đọc `anh` khi POS gửi thư.
