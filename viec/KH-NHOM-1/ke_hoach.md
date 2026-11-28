# KH-NHOM-1 — kế hoạch (phiếu không chờ duyệt)

## Phương án
- **A (chọn):** một bộ hàm đọc nhóm ở `src/menuLoc.js` (`maNhom`, `tenNhom`, `thuTuNhom`, `khoaNhom`, `bieuTuongMon`); `nhomTheoTen` giữ tên + chữ ký (trả thêm phần tử thứ 3 = khoá, chỗ gọi cũ `[ten, mon]` vẫn chạy). Sửa 5 chỗ gọi (Menu, TrangMon, GioHang, MonO ×2) + 1 dòng danh mục. ~35 dòng app. Rủi ro thấp.
- **B:** đổi tên hàm + chữ ký thành đối tượng `{ ma, ten, thuTu, mon }` → sửa mọi chỗ gọi, nhiều dòng hơn, không thêm gì cho nghiệm thu. Bỏ.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHNHOM1.js`, 15 ca ở `KHONG_TRINH_DUYET=1`, 75 có Chromium)
| Nghiệm thu | Ca |
|---|---|
| A1 | `tenNhom` / `maNhom` / `thuTuNhom` — bảng đủ ca phiếu nêu |
| A2 | `nhomTheoTen`: POS thật 27.11, bằng thứ tự, 9999 cuối, hai mã trùng tên, POS cũ |
| A3, A4 | `bieuTuongNhom` theo tên (mã `juice`/`tea` → mặc định), `bieuTuongMon`, đọc nguồn không ghi cứng tên nhóm |
| B1, B2 | Chromium 360·390·430: ô + tiêu đề, URL `/menu/juice`, `/menu/tra` → Tất cả, đổi `nhom_ten` → tải lại; mã `gio-vang` |
| B3 | Trang món (`.detail-cat`), ô giỏ (nền theo nhóm), ô nhóm có biểu tượng |
| B5 | POS cũ → `/menu/ca-phe`, tên = `nhom` |
| B6 | giỏ có món không còn trên menu; POS báo `MON_KHONG_BAN` khi đặt đơn → dòng giỏ đúng món |
| B7 | danh mục `menu.nhom` chỉ đường POS + `kiemDanhMuc` sạch |
| Đường song song / K5 | món không nhóm → "Khác"; POS cũ y như gốc (không chặn oan); nhóm trùng slug ô riêng vẫn hiện ở Tất cả |

Lưu ý B6: phiếu ghi "báo giá 400 `MON_KHONG_BAN`" — trong code `MON_KHONG_BAN` chỉ xử lý ở đường đặt đơn (`ThanhToan.jsx` `xuLyLoi`), nên ca thử đi đúng đường đó (như `thu_KHMUA1b.js` đã có).
