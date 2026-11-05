# KH-HD-1 — kế hoạch (việc thường, chạy thẳng — phiếu không chờ duyệt)

## Phương án
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| Đọc tờ | `src/hoaDon.js`: `docHoaDon` + `nhomHoaDon`, ~25 dòng | đọc thẳng trong component | A: bài thử nạp thẳng hàm thuần (A1–A3), một chỗ |
| Vẽ | `HoaDonKhach.jsx` ~35 dòng, dùng lại `summary-row` / `.discount` / `.total` / `nt-state` | tạo lớp mới cho mọi dòng | A ít CSS, đúng B4 |
| CSS | `hoa_don.css` ~10 dòng, chỉ `var()` của demo | sửa `giaoDien.css` | phiếu cấm sửa `giaoDien.css` |
| Màn | `Don.jsx`: có `hoa_don` → `HoaDonKhach`, rỗng → cách cũ | bỏ hẳn cách cũ | B2 đòi giữ cách cũ |

Ước lượng: app ~75 dòng (dưới ngân sách 120), thử ~190 dòng.

## Ca thử ↔ nghiệm thu
- A1 → đủ dòng/thứ tự, trường thiếu, dòng không-object, `[]`/null/không phải mảng · A2 → mọi `loai` đúng nhóm, loai lạ → `la` · A3 → ca `gio` phai rỗng (Chromium).
- B1 → giảm hạng, trả ví, giá gạch, ghi chú món, số bill, thứ tự POS, một dòng tổng, `.discount`, điểm + chân + loai lạ, đơn huỷ có cảnh báo trên cùng.
- B2 → `hoa_don: []` vẽ `mon[]` + Tổng · B3 → nhãn trạng thái + tiêu đề · B4 → CSS chỉ biến demo, không đụng `main.jsx` · B5 → không tràn ngang 360/390/430 và khi chữ 200%.
- K5 (luồng hợp lệ không bị chặn): đơn chờ trả (tờ rỗng) vẫn xem được; loai lạ vẫn vẽ.
- Đường song song: `TheoDoiDon.jsx` KHÔNG đụng (việc sau); danh sách Lịch sử đơn không đụng.
