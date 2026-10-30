# Kế hoạch KH-UI-3a

## Phương án
| Phần | A (chọn) | B | Lý do chọn A |
|---|---|---|---|
| Trạng thái chung | `src/kho.js` (kho nhỏ + `useSyncExternalStore`) giữ `hang`, `gioVang`, `gioHoatDong`; `src/heThong.js` nạp 3 cửa một lần + hỏi lại mỗi 60 s | React Context ở App | A ~40 dòng, màn nào cũng đọc được, đếm giây không làm cả App vẽ lại; B phải truyền prop / vẽ lại cả cây mỗi giây |
| "Bây giờ" | `src/bayGio.js` (độ lệch POS − máy; rơi về `gioVn()`) | sửa `gioVn` tại chỗ | A giữ `gioVn` cho bài thử cũ; 3 chỗ gọi đổi sang `bayGio()` |
| Giá theo hạng | `src/giaHang.js` TRA BẢNG `gia_hang` (không công thức) | tự nhân `phan_tram` | B bị cấm (D1) |
| Giờ vàng | `src/gioVang.js` hàm thuần (pha: dang / truoc / sau / ẩn) + `OGioVang.jsx` | tính trong từng màn | A một chỗ, bài thử nạp thẳng |
| CSS | chép nguyên khối demo (PATCH27 Giờ vàng, `.lad/.ladd`, `.hb-t-flash`, `flashGlow`) vào `demo_gv.css` | viết lại | K9 + CLAUDE.md §5 |

Ước lượng: ~600 dòng app, ~350 dòng thử, 4 file thử cũ chỉnh nhẹ (nếu có ca đòi "ô còn trống").

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHUI3a.js`)
- A1/A3: `src/api.js` có đúng 3 lời gọi mới (K8) · từng cửa lỗi (hang / gio-vang / gio-hoat-dong) app không vỡ, phần của cửa đó ẩn.
- B1–B3: `bayGio` lệch đồng hồ máy, rơi về `gioVn`, `TZ=UTC` ≡ `TZ=Asia/Ho_Chi_Minh` (hai tiến trình con) · trong trình duyệt đồng hồ máy lệch vẫn ra giờ POS.
- C1–C4: hạng `null` / có hạng; Tài khoản Ví / Điểm / Voucher, ví 0 → "0đ"; không chữ "nợ".
- D1–D5: `gia_hang` rỗng, hạng 0 %, hạng thường; Giờ vàng thắng giá hạng; chưa đăng nhập không có bậc giá; đăng xuất + khách khác không lộ `gia_hang` (localStorage + màn).
- E1–E4: Giờ vàng chạy / chưa tới / hết khung (đổi trạng thái không tải lại) / tắt; không chữ "suất"; mã lạ bị bỏ qua.
- F1–F3: quán mở / đóng (nguyên văn `thong_bao`) / chưa cài lịch.
- H1–H2: nhãn khoá trọn trong ô, nền đặc, ở 360 / 390 / 430, ô cả hàng + nửa hàng, chữ hệ thống 130 %.

## Đường song song / luồng hợp lệ không được chặn
Đăng nhập + đăng xuất + `donPhien` (401) · menu lưu trên máy chỉ bản công khai · trắc nghiệm / lịch dùng "hôm nay" (đổi sang `bayGio`) · chưa đăng nhập vẫn xem Trang chủ / Menu / Trang món.

## Điểm phiếu chưa chốt (ghi `## Câu hỏi`, làm phần còn lại)
- Giá Giờ vàng: hợp đồng v2 KHÔNG có giá Giờ vàng từng món, chỉ `phan_tram`; phiếu cấm tự tính. → App hiện nhãn "Giờ vàng −X%" (X = số của POS) + giá gốc, KHÔNG hiện số tiền đã giảm.
- Dạng `bat_dau` / `ket_thuc` của `/gio-vang` hợp đồng chưa ghi (chuỗi giờ đầy đủ hay `HH:mm`) → bộ đọc nhận cả hai.

(Soát kế hoạch bằng agent phụ: không chạy ở phiên này — ghi ở CHƯA KIỂM.)
