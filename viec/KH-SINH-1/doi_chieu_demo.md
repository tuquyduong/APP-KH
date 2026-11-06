# KH-SINH-1 — đối chiếu demo (`thiet_ke/app_kh_demo.html` patch39)

Ảnh App ở `so_anh/` (360 / 390 / 430; POS giả theo hợp đồng v9; do `cong_cu/thu_KHSINH1.js` chụp khi đặt `LUU_ANH_DIR`).
Demo KHÔNG có: thẻ ngày sinh nhập một lần, nút xoá món, nút Hoàn tác (đều là yêu cầu mới của chủ quán 02–05.11) — các khối này dùng lại khuôn demo đã có (bảng dưới).
Chat App KH so ảnh lại lần cuối trước khi gộp.

## Thông tin cá nhân (profile) — `hoso_*`
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Thẻ `card pf-card` (tiêu đề `.tt`, nhãn `.pf-row label`, ô nhập, `small`, nút `.hq-b`) | Thẻ "Ngày sinh" dùng đúng các lớp đó, đặt sau thẻ Thông tin | Demo không có ngày sinh → khối MỚI theo QĐ 02.11; không CSS mới |
| Ô nhập `.pf-card input` | `<input type="date">` (kiểu của trình duyệt) | Bộ chọn ngày gốc của máy, iPhone / Zalo dùng được; chữ mẫu / giá trị do trình duyệt vẽ |
| `.pf-note` (chú thích nhỏ) | Dòng "Cần sửa? Mang căn cước…" ở chế độ xem | Chữ theo phiếu, không phải chữ mẫu demo (lý do b) |
| `.hq-b` + `.hq-b.ghost` (nút hai kiểu) | "Lưu" / "Sửa lại" ở bước hỏi lại | Chép nguyên lớp có sẵn |

## Trang chủ (home) — `trangchu_*`
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| `h1` lời chào | Giữ nguyên khối, chỉ đổi CHỮ: đủ tên như khách nhập ("anh LINH P!") | Dữ liệu (a)/(b); tên dài tự xuống dòng, không tràn ở 360 px (ảnh `trangchu_ten-dai_360`) |

## Giỏ hàng (cart) — `gio_*`
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| `.cart-item` (ảnh, tên, giá, `.qty-ctrl`) | Giữ nguyên; thêm nút xoá `×` (biểu tượng `close` của bộ demo) ở GÓC TRÊN PHẢI thẻ, `padding-right` thêm 34px | Demo không có nút xoá → khối MỚI theo QĐ 05.11; CSS ở `gio_xoa.css`, chỉ dùng biến màu demo (`--muted`, `--cream`); vùng chạm 28 px, xa cụm −/+ |
| `.toast` | Dùng lại lớp `.toast.show.wrap`; thêm `.co-nut` (cho bấm được) + nút "Hoàn tác" gạch chân trắng | Demo không có nút trong toast → mới theo QĐ 05.11; chữ "Đã xoá <tên món> · Hoàn tác" theo phiếu |
