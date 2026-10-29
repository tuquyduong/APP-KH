# KH-XEM-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: `viec/KH-XEM-1`; `git status --short` sạch.
- SHA: HEAD `4b3dae2` · FETCH_HEAD `4b3dae2` (bằng nhau, không kéo).
- `git log --oneline -3`:
  - `4b3dae2 PHIEU: KH-XEM-1`
  - `0054808 TIEN-DO: KH-UI-2 xong (daefe2d); mau man to duyet; hop dong v1 chep nguyen van tu POS c23773a; khach vao thang Trang chu; mo KH-XEM-1 - so v3`
  - `daefe2d Merge pull request #1 from tuquyduong/viec/KH-UI-2`

## Câu hỏi
- Hợp đồng `thiet_ke/HOP_DONG_API_KH.md` mới là v1: chưa có (a) `/menu` không cần token, (b) trường Xưng hô / Địa chỉ ở `xac-minh`, (c) cửa gia hạn phiên.
  Làm theo phiếu: (a) app gọi `/menu` không token, chưa mở thì hiện thẻ "Đăng nhập để xem menu và giá"; (b) hai ô dựng sẵn, TẮT bằng
  `BAT_XUNG_HO_DIA_CHI = false` ở `src/noiDung/dangNhap.js`, KHÔNG gửi gì; (c) chưa làm (KH-UI-3).
  Cần chat POS cho KH-UI-3: TÊN trường xưng hô / địa chỉ trong `xac-minh` (app tạm đặt `xung_ho`, `dia_chi` trong `truongThem()` — chỉ chạy khi bật hằng số, chưa bật).
