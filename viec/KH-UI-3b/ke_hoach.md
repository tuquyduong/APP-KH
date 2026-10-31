# Kế hoạch KH-UI-3b

## Phương án (A = chọn)
| Phần | A (chọn) | B | Ghi chú |
|---|---|---|---|
| A hợp đồng | `cp` hop_dong_v3.md → thiet_ke/HOP_DONG_API_KH.md; sửa canTuPos.js (3 dòng) | — | ~3 dòng |
| B hồ sơ | HoSo.jsx: thẻ xưng hô + thẻ địa chỉ + tên qua một hook `dungLuuHoSo`; api.js `suaHoSo(truong)` thay `doiTen` | tách file con cho từng thẻ | A: 1 file, ~70 dòng |
| C lời chào | `loiChao(gio, xungHo, ten)` thuần trong dinhDang.js (+ `chiaLoiChao` cho dòng xem trước); `coBayGio()` trong bayGio.js; TrangChu đọc `bayGio()` | tính ở TrangChu | A: ~25 dòng |
| D gia hạn | `src/giaHan.js` (hàm `giaHanNeuCan` nhận phụ thuộc, bài thử nạp thẳng) + 1 useEffect trong App; khoá vào luuMay.js | viết thẳng trong App | A: ~35 dòng |
| E menu | gỡ canDN khỏi menuLuu/dungMenu/Menu/MonTheoDuong/dangNhap.js; 401 khi có token → thử lại không token (api.js đã xoá token); lưu bản công khai kèm gia_hang | — | giảm ~15 dòng |
| F1 | KiemKhop: đọc `docToken()` mỗi lần kiểm | — | 2 dòng |
| F2 | `.hb-k` thêm line-height/padding cho dấu (đo bằng Chromium) | — | 1 dòng CSS |
| G | chỉ kiểm bằng POS giả; sửa nếu lệch | — | |

## Ca thử ↔ nghiệm thu (cong_cu/thu_KHUI3b.js)
- Phần 1 (không trình duyệt): A1 cmp byte; A2 canTuPos; B4 mã lỗi; B5 thân PUT chỉ khoá truyền (api.js với fetch giả); C1–C3,C5 lời chào; D1–D4 gia hạn (một lần/ngày, 429/5xx/mạng không ghi ngày, 401 → hết phiên, khoá trong luuMay); E1 không còn canDN/THE_MOI_MENU; E2 bản lưu giữ gia_hang; F1 nguồn.
- Phần 2 (Chromium, POS giả v3; 360/390/430 + chữ 130%): B1–B3,B6, C4, D, E3 (token sai → 401 → menu không token), F1, F2 đo dấu .hb-k, G1.
- Luồng hợp lệ không bị chặn (K5): khách cũ có xưng hô; khách chưa có xưng hô (null); địa chỉ trống.
- Đường song song: mọi chỗ gọi `goi` đi qua api.js; menu logged-in vẫn gửi token; gia-han không gửi khi chưa token (D4).

## Soát kế hoạch
Chạy `/ra-soat` ở bước 8 (agent độc lập) thay cho soát riêng kế hoạch — ghi ở trang_thai.md.
