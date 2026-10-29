# KH-XEM-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: `viec/KH-XEM-1`; `git status --short` sạch.
- SHA: HEAD `4b3dae2` · FETCH_HEAD `4b3dae2` (bằng nhau, không kéo).
- `git log --oneline -3`:
  - `4b3dae2 PHIEU: KH-XEM-1`
  - `0054808 TIEN-DO: KH-UI-2 xong (daefe2d); mau man to duyet; hop dong v1 chep nguyen van tu POS c23773a; khach vao thang Trang chu; mo KH-XEM-1 - so v3`
  - `daefe2d Merge pull request #1 from tuquyduong/viec/KH-UI-2`

## Câu hỏi
- (Đã giải quyết 29.10 theo dặn thêm của chủ quán, hợp đồng v3 POS chốt tên trường.) Bước 3 hiện đủ 3 ô, gửi `{ sdt, ma, ten, xung_ho, dia_chi? }`;
  `xung_ho` là mã không dấu. Hợp đồng chép trong `thiet_ke/` vẫn là v1 (cấm sửa ở phiếu này) — chủ quán / chat chép v3 vào khi POS gộp.
- Làm theo dặn: KHÔNG gọi PUT /toi (hồ sơ → KH-UI-3), KHÔNG làm POST /gia-han (→ KH-UI-3), /menu không gọi lại trong 5 phút (trừ làm mới chủ động).

## Phát hiện
- Khi hợp đồng v2/v3 cho `/menu` giá theo hạng: `dungMenu` hiện giữ `dl` cũ trong bộ nhớ khi đổi phiên (đăng xuất / 401) và dùng làm bản dự phòng nếu lấy hỏng — cần bỏ `dl` khi phiên đổi (KH-UI-3).
- Bài cũ `thu_KHUI2.js` khớp nguyên chữ `<Menu hien=…` trong App.jsx — dòng đó là một ràng buộc thứ tự thuộc tính; nên đổi bài đó sang kiểm khác khi có dịp.
