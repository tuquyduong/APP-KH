# KH-ND-3d — kế hoạch

## Phương án
| Phần | A (chọn) | B | Lý do |
|---|---|---|---|
| Danh mục | `KE_HOACH` (màn Kế hoạch, bảng ngày, Ngày cần nhớ, Sắp tới, ngày lễ) và `TIEN_ICH` (Theo mùa, tiết khí, Văn khấn) điền vào hai tệp nhóm đã có; khoá `kh.*`, `bn.*`, `ngt.*`, `qh.*`, `mua.*`, `tk.*`, `vkd.*` | thêm tệp nhóm | phiếu cấm sửa `index.js` → A |
| Lịch cố định | `src/noiDung/coDinh/lich.js` (WD, Can, Chi, 24 tiết khí, tên tháng âm, 4 mùa) | để trong `lich.js` | phiếu A3 → A; chỗ hiện gắn mục khoá `kh.lich` (`tutinh`) |
| `TERM_TIPS` | giữ tên xuất, mảng 24 phần tử đọc SỐNG từ danh mục (`tracNghiem.js` ngoài Phạm vi vẫn gọi `TERM_TIPS[i][1]`) | đổi `tracNghiem.js` | cấm sửa tracNghiem → A |
| Ngày lễ | hai mục `danhsach` `{ngay,ten}`; hàm `leDuong()/leAm()` dựng bảng tra, bỏ dòng sai dạng | giữ hằng | phiếu A2 |
| Văn khấn | mỗi dịp 5 mục (`vk.<id>.ten/le/cach/khan` + tên ngắn); phần máy (id, kieu, lunar, gio, newYear, needNm, ic) ở `src/noiDung/vanKhan.js` | một danh sách lớn | chủ quán sửa từng bài độc lập |
| B1 | một hàm `ocHien(id, xung)` ở `dungKeHoach.js`, `KeHoach.jsx` + `TienIch.jsx` dùng chung; `App.jsx` truyền `thayVeLich` | — | một nơi quyết định |
| B2/B3 | `dinhDangSoTien` ở `dinhDang.js`; `tel:` bỏ ký tự lạ | — | phiếu |
| `kehoach.js` > 450 dòng | tách phần xe / thuốc / chu kỳ sang `kehoachXe.js` nếu còn > 450 | — | A4 |

## Ca thử (ánh xạ nghiệm thu) — `cong_cu/thu_KHND3d.js`
A1 chữ cứng = 0 ở 16 tệp (đếm bằng `demChuCung`) + mọi chuỗi có dấu của bản gốc (`chu_goc.json`) còn trong danh mục · A2 `macDinh` ngày lễ / theo mùa / tiết khí / văn khấn khớp từng byte với demo; `dienBai` đủ chỗ điền; ngày lễ sai dạng bị bỏ qua · A3 lịch cố định ở `coDinh`, mục khoá `tutinh` · A4 tên xuất còn nguyên, `kehoach.js` ≤ 450 dòng · A5 so ảnh (Chromium) · B1 (xưng hô anh → `/kehoach`, chị → Chu kỳ, `hien.ocXe` tắt) · B2 (`gia.donVi` = " VNĐ") · B3 (`tel:`) · C1 `kiemDanhMuc` 0 lỗi, mỗi khoá có `data-nd` / `<Chu>` hoặc cờ; bản giả đổi 4 khoá (Chromium). Luồng hợp lệ không bị chặn (K5): bản lưu cũ `kh_kehoach` mở như cũ; ngày lễ mặc định vẫn đủ.

## Đường song song cần canh
Mọi nơi đọc `SOLAR_HOL/LUNAR_HOL/WD/SEASON/VK/LNUM/GHI_CHU_*` (`grep` đã rà): `kehoach.js`, `vanKhan.js`, `BangNgay.jsx`, `OKeHoach.jsx`, `VanKhanMan.jsx`, `TienIch.jsx`, `duongDan.js` (đọc `MA_DIP`, giữ ở `noiDung/vanKhan.js`), `tracNghiem.js` (đọc `TERM_TIPS`).

Soát kế hoạch bằng agent phụ: bỏ qua (việc thường, kế hoạch bám khuôn 3a/3c; chat soát cuối kiểm).
