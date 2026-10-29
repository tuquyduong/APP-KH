# KH-LINK-1 — kế hoạch (ghi sau khi đọc code thật: App.jsx, dieuHuong.js, luongDangNhap.js, Menu.jsx, TrangMon.jsx, TrangChu.jsx)

Phiếu không đòi "chờ duyệt kế hoạch" (việc thường) → chạy thẳng.

## Phương án
| Phần | A — bảng đường dẫn + History API, giữ màn cũ | B — giữ `tab` + ngăn xếp, chỉ phản chiếu ra thanh địa chỉ |
|---|---|---|
| Số file | `duongDan.js` mới; sửa `dieuHuong.js`, `App.jsx`, `luongDangNhap.js`, `Menu.jsx`; 3 file nhỏ mới | `duongDan.js` mới; sửa `App.jsx`, `dieuHuong.js` |
| Dòng | ~330 app | ~300 app, nhưng hai nguồn sự thật (state và URL) → lệch khi Back / tải lại |
| Rủi ro | đổi cấu trúc App (bài thử cũ khớp chữ phải chỉnh) | mở thẳng `/mon/..` và Back vẫn sai (state không dựng lại được từ URL) |

**Chọn A**: thanh địa chỉ là nguồn duy nhất; mở thẳng / tải lại / Back / Tiến đúng tự nhiên; không còn `dungNganXep`.

## Thiết kế
- `src/duongDan.js` (hàm thuần): bảng `BANG` một chỗ; `slug` (dùng lại `boDau` của menuLoc.js), `docDuongDan`, `taoDuongDan`, `tiepHopLe`, `slugMon`, `timMonTheoSlug`, `tieuDeTrang`, `trangCanDangNhap`.
- `dieuHuong.js`: `dungDuongDan()` = state theo địa chỉ + `di` (push) / `thay` (replace) / `lui` (Back nếu app đã đẩy bước, không thì về trang cha — mở thẳng không thoát app) + chuẩn hoá địa chỉ (`/` → `/trangchu`, `/admin` → `/trangchu`).
- `luongDangNhap.js`: `canDangNhap` đọc bảng (không còn danh sách thứ hai); `dichSauDangNhap(tiep, maCho)` nhận đường dẫn.
- `App.jsx`: render theo `trang`; trang cần đăng nhập → `thay('/dangnhap?tiep=…')`; đã đăng nhập mà đang ở `/dangnhap` → `thay(tiep)`; `?ma=` → `/uudai` trên mọi đường dẫn.
- `Menu.jsx`: nhóm đang chọn lấy từ `/menu/<nhom>` (đổi nhóm = `thay`, không thêm lịch sử).
- `KhoaTienIch.jsx`, `KhongTimThay.jsx`, `MonTheoDuong.jsx` mới. Không `404.html` (Pages tự phục vụ kiểu trang đơn); ảnh / âm thanh đã dùng `/anh/…` tuyệt đối.

## Ca thử ↔ Nghiệm thu
| Nghiệm thu | Bài thử |
|---|---|
| A1 bảng hai chiều, slug, hoa / `/` thừa | `thu_KHLINK1.js` mục "A1 …" (slug, 15 dòng đi, 15 dòng về, quay vòng, hoa, `/` thừa, `#`/`?` lạ) |
| A1b `/mon/` có / không menu / ngừng bán | mục "A1b" + đọc nguồn `MonTheoDuong.jsx`; trình duyệt (C2) |
| A1c màn mở với mọi đường dẫn | `ManDau` không đổi (overlay độc lập địa chỉ); trình duyệt: `kh_da_xem…` xoá thì hiện |
| A2 tiêu đề tab, push / popstate | mục "A2 tiêu đề" + "nối vào App" |
| A3 mở thẳng, đăng nhập → `?tiep=`, `tiep` nội bộ, `?ma=` | mục "A3" (13 ca `tiep` lạ, K5 đã đăng nhập không bị chặn oan) + "nối vào App" + trình duyệt |
| A4 không 404.html, đường dẫn tuyệt đối | mục "nối vào App" (2 ca) |
| A5 hành vi cũ (Menu giữ trạng thái, Back, đăng xuất, 401) | `thu_KHUI2.js`, `thu_KHXEM1.js` xanh (chỉ chỉnh chỗ khớp chữ) + trình duyệt |
| B1 Trang chủ khách đầy đủ | đã có từ KH-XEM-1 (không đổi); so ảnh C2 |
| B2 KhoaTienIch | mục "B2" — render thật bằng esbuild + react-dom/server (khách / đã đăng nhập) |
| C3 | `npm test`, `--day-du`, `cong.js chay` |

Đường song song canh: 401 giữa phiên (`donPhien` → `/trangchu`); đăng xuất; `?ma=` khách / hội viên; Menu bị ẩn khi xem món (nhóm giữ qua `nhomCuoi`). Luồng hợp lệ không bị chặn (K5): hội viên vào mọi trang; `/taikhoan/hotro` không cần đăng nhập.

## Soát kế hoạch
Làm tự soát theo 4 câu (không mở agent phụ — kế hoạch ngắn, bài thử + trình duyệt kiểm trực tiếp): ngoài phạm vi? không (chỉ `src/`, `cong_cu/thu_KHLINK1|KHXEM1.js`, `viec/`). Cách ngắn hơn? B ngắn hơn ~30 dòng nhưng sai khi mở thẳng. Ca nào thiếu? đủ bảng trên. Đường song song? đã liệt kê.
