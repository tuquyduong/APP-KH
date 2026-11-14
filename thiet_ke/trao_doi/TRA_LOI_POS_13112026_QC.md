# TRẢ LỜI POS → chat App KH — 13.11.2026 · Cửa dải quảng cáo + banner Trang chủ đã xong (QC-APP-1)

(Chủ quán dán vào chat App KH 14.11 — lưu nguyên để soạn phiếu KH-QC-1.)

Trả lời thư App 09.11 "Dải quảng cáo App". Việc QC-APP-1 đã xong và soát đạt; chủ quán gộp vào POS thật hôm nay. Chi tiết đầy đủ ở
`HOP_DONG_API_KH.md` → "Ghi chú v16" (v15 để dành cho VOUCHER-2, gộp sau — App thấy v16 trước v15 là bình thường).

## Cửa
`GET /api/kh/quang-cao` — không cần token → `{ success, bay_gio, data[] }`, `data[]` đã xếp theo `uu_tien` (nhỏ = trước), không có dòng → `[]`.
Mỗi dòng: `id` · `chu_dai` · `tieu_de` · `phu` · `chu_nut` · `dich` · `ma_mon` · `tu_gio` · `den_gio` · `uu_tien` — đúng tên đã chốt trong thư trả lời 09.11.

## Điểm App cần làm đúng
1. **Khung giờ App tự so:** máy chủ chỉ lọc theo NGÀY hôm nay. `tu_gio` / `den_gio` (`HH:mm`, giờ VN, không vắt qua nửa đêm; cả hai `null` = cả ngày) —
   App so với `bay_gio` của máy chủ, KHÔNG dùng đồng hồ điện thoại.
2. **Chữ là chữ thuần:** mọi trường chữ do chủ quán gõ — hiện bằng text, KHÔNG đưa vào HTML thô (innerHTML / dangerouslySetInnerHTML).
3. **Giới hạn chữ:** `chu_dai` ≤ 32 ký tự nhìn thấy (emoji = 1, App vẫn cắt "…" nếu cần) · `tieu_de` ≤ 40 · `phu` ≤ 80 · `chu_nut` ≤ 20 · tối đa 20 dòng.
   Banner Trang chủ chỉ hiện khi dòng có `tieu_de`.
4. **`dich`** ∈ `menu` · `mon` · `uudai` · `tracnghiem` · `""` (không mở gì). `ma_mon` chỉ có khi `dich = "mon"`; món đã tắt / bị xoá → máy chủ tự trả
   `dich: "menu"`, `ma_mon: null`.
5. **Giờ vàng tự động:** khi quán bật công tắc và Giờ vàng đang chạy, `data[0]` là dòng `id: "gio_vang"` (chữ máy chủ dựng, `den_gio` = giờ kết thúc,
   `dich: "menu"`). Công tắc mặc định TẮT.
6. **Trần lượt:** cửa dùng chung trần lượt / IP với `/menu` → quá trần trả 429 `QUA_NHIEU_LAN`. App nên đọc một lần khi mở Trang chủ (và khi quay lại
   sau lâu), không gọi liên tục.

## Chủ quán dùng thế nào
POS → Cài đặt → "📣 Quảng cáo trên App": gõ chữ dải / banner, chọn hằng ngày · các thứ · khoảng ngày, khung giờ, bấm vào mở đâu, thứ tự, bật / tắt;
Lưu hỏi PIN chủ quán. Có dòng xem trước dải và câu nhắc "Không ghi công dụng chữa bệnh".
