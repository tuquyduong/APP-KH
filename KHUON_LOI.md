# Khuôn lỗi App KH — bài học đã trả giá (giữ ≤ 120 dòng; có phép kiểm làm thay thì xoá lời dặn)

<!-- Khuôn mỗi mục: Đã gây / Dấu hiệu / Chặn. Mục chép từ POS / SX khi áp được cho App KH. -->

## K1 — Code là sự thật, hồ sơ có thể cũ
- Đã gây: POS 23.08.2026 — 6/8 mục hồ sơ lệch code.
- Dấu hiệu: khẳng định hành vi mà không kèm file + dòng.
- Chặn: đọc code / chạy lệnh trước khi nói; trường `/api/kh` chỉ lấy từ `thiet_ke/HOP_DONG_API_KH.md`.

## K2 — Lockfile chứa địa chỉ nội bộ Replit
- Đã gây: SX 2026 — Railway dựng hỏng; App KH 28.10 — lockfile chép từ POS có `package-firewall.replit.internal`.
- Dấu hiệu: `npm ci` ngoài Replit báo lỗi tải gói.
- Chặn: bộ kiểm K5.

## K3 — Hiện số bịa khi dữ liệu thiếu
- Đã gây: (POS CLAUDE.md §5.8) hiện tồn / giá khi máy chủ không trả.
- Dấu hiệu: giá trị mặc định 0 hoặc số mẫu trong demo xuất hiện trên bản thật.
- Chặn: không có dữ liệu → ẩn mục / hiện "—"; `dinhDangGia` trả rỗng cho thứ không phải số (bài thu_KHUNG).
