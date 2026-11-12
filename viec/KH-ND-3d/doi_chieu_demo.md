# KH-ND-3d — đối chiếu demo (patch39) ↔ App

Việc này KHÔNG đổi giao diện (chuyển chữ về danh mục). Bằng chứng: `so_anh/ket_qua.txt` (54 cặp, 53 giống hệt, 1 nhiễu góc bo — không phải khác biệt).

## Khoá demo (`data-cms`) ↔ khoá App
| Demo `data-cms` | Khoá App | Ghi chú |
|---|---|---|
| `t:home.cala`, `t:home.calb` | `home.cala`, `home.calb` (đã có từ KH-ND-3a) | ô Kế hoạch Trang chủ |
| `t:ss.<mùa>.<trường>` | `mua.noiDung` (danh sách 4 mùa, khoá cấu trúc `mua`) + nhãn `mua.nhan.<trường>` | khác: demo mỗi (mùa, trường) một khoá; App gom một danh sách, bảng sửa tự sinh |
| `t:vk.<dịp>.cach` | `vkd.<dịp>.cach` | 11 dịp |
| `t:vk.<dịp>.le` | `vkd.<dịp>.le` | |
| `t:vk.<dịp>.vk` | `vkd.<dịp>.khan` | App: MỘT đoạn đầy đủ mỗi bài (các đoạn chung VK_OPEN… chép vào từng bài) |
| `t:vk.note1`, `t:vk.note2` | `vk.ghiChuDs`, `vk.ghiChuBai` | |
| (demo chưa có khoá) | `kh.*`, `lap.*`, `bn.*`, `qh.*`, `hx.*`, `bx.*`, `dnv.*`, `ngc.*`, `ngt.*`, `sap.*`, `kh.leDuong`, `kh.leAmLich`, `kh.leQua`, `kh.tiet`, `vk.*`, `mua.*` | demo chưa có khoá — chữ chép nguyên, khoá đặt theo màn |
| lịch (thứ, Can, Chi, 24 tiết khí, tháng âm) | `kh.lich` (mục khoá `tutinh`) | App tự tính — `src/noiDung/coDinh/lich.js` |

## Khác demo
Không khác gì về giao diện. Phần máy (id dịp, biểu tượng, cách tính ngày) ở lại `src/noiDung/vanKhan.js`.
