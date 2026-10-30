# KH-UI-3c — kế hoạch (đã làm xong; ghi lại để đối chiếu)

## Phương án
- **Ô Giờ vàng** — A: `OGioVang` luôn vẽ, nhánh "chưa có" là một khối JSX nhỏ + lớp `.hb-mo` (~14 dòng). B: thêm tham số `mo` cho một ô dùng chung — thêm khái niệm, không ngắn hơn. **Chọn A.**
- **Ô Trắc nghiệm khoá** — A: `OTracNghiem` tự vẽ ô, chưa đăng nhập thì gắn `.hb-mo` + dòng `DongKhoa` thay dòng phụ; `KhoaTienIch` giữ nguyên viên nhãn cho việc sau (Kế hoạch và nhắc việc), chỉ tách `DongKhoa` ra dùng chung (~10 dòng). B: cho `KhoaTienIch` chế độ thứ hai (prop) — thêm nhánh, vẫn bọc `inert` + lớp phủ. **Chọn A.**
- **CSS** — `.hb-mo` làm mờ hình + nhãn bằng `opacity` (.55), KHÔNG mờ `.hb-khoa`; bỏ luật `:has(:only-child)` (không còn dùng). Không màu / phông mới.

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHUI3c.js`)
| Nghiệm thu | Ca |
|---|---|
| A1 | hình ô demo + `.hb-mo`; độ mờ trong .4–.7 (CSS và đo thật ở 360/390/430 × 100/130%) |
| A2 | dòng khoá thay dòng phụ, không mờ (=1), ô cao bằng ô thường; máy còn kết quả cũ vẫn ô khoá |
| A3 | không `.khoa-nhan`/`inert`/bọc; không phần tử nào phủ chữ (elementFromPoint); `KhoaTienIch` còn nguyên |
| A4 | bấm được; chạm → `/dangnhap?tiep=%2Ftracnghiem`; đã đăng nhập ô thường |
| B1 | không `return null`; ô mờ "Giờ vàng / Hiện chưa có / −%"; không bấm; có chương trình vẫn sáng |
| B2 | không "suất", không số, không đếm ngược; lỗi `/gio-vang` → ô mờ, không chữ lỗi |
| B3 | `/gio-vang` trả chậm 2,5 s: đã có ô mờ lúc chờ, về xong thì sáng |
| B4 | không còn luật giãn hết hàng; `.hb-tiles` hai cột |
| C1 | (a)–(e) như bảng trên |
| C3 | sửa đúng ca cũ ở `thu_KHUI3a.js`, `thu_KHUI5a.js` |

Luồng hợp lệ không bị chặn (K5): đã đăng nhập ô Trắc nghiệm bình thường + mở kết quả đã lưu; Giờ vàng đang chạy / cuối ngày ô sáng bấm được.
Đường song song: Menu (`.ct.gv`) và Trang món không đổi — `thu_KHUI3a.js` vẫn kiểm.
