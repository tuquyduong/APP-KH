# Kế hoạch KH-HUY-1 (phiếu không chờ duyệt kế hoạch)

## Phương án
- **A (chọn)**: `soHoan` + `lyDoHuy` (hàm thuần, `hoaDon.js`, ~8 dòng) → `docDon` đọc khi `da_huy` (~3 dòng) · MỘT thành phần `DonHuy.jsx` (~25 dòng) dùng ở Theo dõi đơn + Chi tiết đơn ·
  Lịch sử: 1 dòng ở thẻ đơn · danh mục `donHang.js` (6 mục) · `canTuPos.js` (2 dòng) · `App.jsx` truyền `moVi` (1 dòng).
  Ước ~60 dòng app, 4 file code + danh mục. Rủi ro thấp: lớp CSS có sẵn, không thêm lượt hỏi POS.
- **B (bỏ)**: hai thành phần riêng cho hai màn + hook đọc riêng. ~+40 dòng, trùng lặp, không cần.
- B6 Chi tiết đơn làm mới `cuaToi` một lần: `useEffect` trong `ChiTietDon` gọi `lamMoi([cuaToi])` (kho có sẵn ở `duLieuKhach.js`), chỉ khi đơn `da_huy` có hoàn > 0. Theo dõi đơn giữ `daHuy` có sẵn.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHHUY1.js`)
| Mục | Ca |
|---|---|
| A1 | `docDon` / `soHoan` / `lyDoHuy` bảng: 35000 · 0 · null · thiếu · "35000" · -5 · 1.5; lý do "Hết nguyên liệu" · "  " · null · thiếu; đơn chưa huỷ → null |
| A2 | nhãn hiện nguyên chữ POS; không có ca tự ghép (nguồn không có số học trên `tong`/`da_tra` để suy hoàn) |
| A3 | `CAN_TU_POS` có `don_huy_v14` + `don_ds_huy_v14` (viec_pos HUY-1) |
| B1 | render `DonHuy` (react-dom/server): 2 hộp / chỉ lý do / chỉ hoàn / không gì → rỗng; "Xem ví" chỉ khi có `moVi` |
| B2–B4, B6 | Chromium 360·390·430: (1) Theo dõi cho_tra→da_huy, 2 hộp, "Xem ví" → `/uudai/vi`, đúng 1 `GET /toi` thêm; (2) Chi tiết huỷ có hoàn + lý do, 1 lượt `/toi`; (3) hoàn 0 → chỉ lý do; (4) khách tự huỷ → DOM như gốc; (5) POS cũ → như (4); (6) Lịch sử: dòng "Đã hoàn 35.000đ" chỉ ở thẻ huỷ có hoàn, không tràn ngang |
| B5 | danh mục có đủ khoá, `kiemDanhMuc` sạch; đổi `td.huy.hoan` qua `datBanNoiDung` → render chữ mới |
| K10/K9 | không thêm .css, không thêm màu; `no_chu_cung.txt` không tăng |
- Đường song song: `huyDon` của khách / "Tạo mã mới" giữ nguyên (ca 4); POS cũ không hai trường (ca 5). Luồng hợp lệ không bị chặn: đơn không huỷ không đổi DOM.
- Đột biến tay `dot_bien_tay.js` ≥ 5 (C3).
