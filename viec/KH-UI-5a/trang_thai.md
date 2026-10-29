# KH-UI-5a — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-UI-5a`; HEAD = FETCH_HEAD = `6b4b6b0` (không cần kéo). Ba dòng log lúc mở phiên:
```
6b4b6b0 PHIEU: KH-UI-5a
5496465 TIEN-DO: KH-LINK-1 xong (c2a728f); khau hieu Dong Y Duong The (luat); mo KH-UI-5a - so v5
f336e26 Merge pull request #3 from tuquyduong/viec/KH-LINK-1
```

## Câu hỏi (cho chủ quán — không chặn việc, máy đã chọn mặc định an toàn)
1. **Lưu thêm hai trường ngoài danh sách C1.** Bản lưu `kh_tracnghiem` ngoài "nhóm chính / phụ, điểm 9 nhóm, giới tính, ngày giờ VN" còn có `khiHau` (chịu nóng / lạnh) và `anToan` (tình trạng đặc biệt, vd "Đang mang thai") — thiếu hai thứ này thì mở lại kết quả cũ sẽ mất ghi chú "đã để riêng" và gợi ý AN TOÀN (khách mang thai mở lại sẽ thấy món thường). Chỉ nằm trên máy, xoá khi đăng xuất / 401 / "Xoá kết quả". Duyệt giữ, hay bỏ (khi đó mở lại bản lưu không còn gợi ý an toàn)?
2. **Khoá `kh_tracnghiem` không gắn tài khoản.** Máy tự xoá khoá khi đăng xuất / hết phiên (`donSach`) để người dùng sau không thấy kết quả người trước; hệ quả: hết phiên 401 thì khách mất kết quả đã lưu, phải làm lại. Muốn giữ qua hết phiên thì phải gắn theo khách (cần mã khách ổn định từ POS).
3. **"Sao chép kết quả và góp ý"** (chép nguyên demo) đưa cả 60 câu trả lời + tình trạng đặc biệt vào clipboard để khách tự dán Zalo. App không tự gửi gì. Giữ hay bỏ nút này?
4. Lời nút lưu / dòng đã lưu đổi so demo ("Đã lưu trên máy này" thay "vào tài khoản"; không còn "gợi ý mỗi ngày ở Trang chủ") vì kết quả chỉ lưu trên máy.

## Phát hiện (ngoài phạm vi / chưa làm)
- `/menu` chưa có topping (TOPPING-1) → bỏ khối "Topping gợi ý"; topping vẫn có trong chữ "Nên chọn".
- Chưa có `bay_gio` của POS (CLAUDE.md §6): "hôm nay" cho Bình hòa và `ngay` lưu dùng `gioVn()` (đồng hồ máy + 7 giờ, không phụ thuộc múi giờ máy). Có `bay_gio` thì đổi một chỗ.
- Nút "Bắt đầu làm bài" khi chưa chọn giới tính: như demo, nút mờ và không bấm được (demo chỉ hiện toast ở đường "Làm lại" mà app luôn đã có giới tính) — không thêm toast.
- Đang làm dở rồi vào lại `/tracnghiem` thì bắt đầu bài mới (không có "tiếp tục bài dở"); phiếu không đòi.
- Bài thử "nối vào App" đọc nguồn bằng regex, hook `dungTracNghiem` chưa chạy thật trong bài thử (không có DOM / thư viện thử hook); đã chạy tay trong Chromium (xem dưới).
- `tracNghiemMenu.json` giữ `tranh` (chép nguyên, bài thử so từng byte) dù app chỉ dùng `nen`.
- ca "câu giữa" lệch 8–9 % ở 360 / 430 trong `so_anh/bao_cao.txt` là do kịch bản thử (app tự sang câu sau 170 ms); ở 390 là 0,3 %.

## Bài thử / đột biến
Chạy tay (không có dot_bien.py: phiếu miễn bài đỏ, việc không đổi `server/` hay `client/src/`): VS-NGUONG-CO (40→42) 3 hỏng · VS-NGUONG-THIEN-HUONG (30→32) 9 hỏng · VS-NGUONG-BINH-HOA (60→64) 11 hỏng; đã khôi phục. Chi tiết `bang_chung_do.txt`.

## Soát độc lập (`/ra-soat`, vòng 1) — KHÔNG ĐẠT → đã sửa → vòng 2 chưa chạy
Báo cáo vòng 1 (rút gọn, nguyên ý):
- LỖI 1 `dungTracNghiem.js` luuLai bỏ qua kết quả `ghiKetQua` → báo "Đã lưu" khi kho bị chặn (K3). **Đã sửa** (`c7dbffd`): trả false, màn kết quả báo "Trình duyệt không cho lưu…".
- LỖI 2 kết quả làm lại chưa lưu (`moi`) làm thẻ / ô / dòng "đã lưu" mở sai bản (K5). **Đã sửa**: `xemBanLuu()` gọi ở thẻ intro, ô Trang chủ, dòng Tài khoản.
- LỖI 3 chưa chọn giới tính bấm Bắt đầu không phản hồi. **Không sửa**: như demo (nút mờ, không bấm được); đã bỏ chuỗi thừa `thieuGioiTinh`; ghi ở Phát hiện.
- LỖI 4 thiếu hồ sơ cổng / thử tay → có ở dưới.
- Mã thừa `THE_CHAT.{khoa,chamSoc,tra,menu}`: **đã bỏ**. Còn: `rutGon` ghi `chinh`/`phu` (phiếu C1 yêu cầu lưu), `xoa()` giờ cũng xoá giới tính điền sẵn.
- Nghi ngờ khiHau / anToan, khoá không gắn tài khoản, clipboard: đưa vào `## Câu hỏi`.
- NGHIỆM THU 14/17 lúc soát (thiếu D3, D4, D2 một phần) → nay có D3 (cổng bên dưới), D4 (bên dưới); D2 một phần: màn mở S1 và ca 360 / 430 "câu giữa" chưa chụp lại.

## Bảng nghiệm thu (đếm từng mục)
| Mục | Bằng chứng |
|---|---|
| A1 dữ liệu chép nguyên | `thu_KHUI5a.js` mục A1: `tracNghiem.json` = `TQDQ` từng byte; menu, TRAITS, PROD_KEY, 11 SVG |
| A2 cách tính | `src/tracNghiem.js`; đối chiếu 39 ca |
| A3 đối chiếu hàm demo ≥ 12 bộ | `thu_KHUI5a_mau.json` 39 bộ do demo chạy trong Chromium; 4 điểm / ca (điểm, kết luận, gợi ý, dấu hiệu) |
| A4 lịch âm / tiết khí | `src/lich.js`; 23 ngày (Tết, nhuận, ranh tiết khí) + 24 `TERM_TIPS`; "hôm nay" theo `gioVn` |
| B1 giới thiệu | dựng thật trong bài thử (6 ca) + ảnh `tc_gioi_thieu_*` lệch 0,00 % |
| B2 câu hỏi | bài thử (8 ca) + ảnh `tcq_*` lệch ≤ 0,5 % (390) |
| B3 kết quả | chữ khớp demo 39 / 39 ca; ảnh `tcr_*` lệch ≤ 0,7 % |
| B4 ghép món | 7 ca `ghepMon`; không menu → ẩn khối; hết hàng, combo |
| B5 lối vào, đường dẫn | `OTracNghiem` + `KhoaTienIch`, dòng Tài khoản, `duongDan.js` 3 đường (bài thử + `thu_KHLINK1`) |
| B6 giao diện, SVG | K9 xanh (`--day-du`); 11 SVG `public/anh/the-chat-*.svg` |
| S1 khẩu hiệu | `thuongHieu.js` + `ManDau.jsx`; bài thử dựng ManDau |
| C1 lưu trên máy | `tracNghiemLuu.js`; bài thử lưu / đọc / xoá / hỏng / kho chặn, không lưu từng câu |
| C2 không gửi | bài thử: không fetch / api / console trong mã mới; `api.js` không có cửa mới |
| D1 `thu_KHUI5a.js` | 357 đạt · 0 hỏng |
| D2 so ảnh | `so_anh/` + `doi_chieu_demo.md` (390 / 360 / 430) |
| D3 `npm test`, `--day-du`, cổng | `npm test` 19 đạt · 0 hỏng; `--day-du` 21 đạt · 0 hỏng; cổng: dòng dưới |
| D4 thử tay | bên dưới |

## Chủ quán thử tay (sau khi gộp, trên điện thoại)
1. Chưa đăng nhập: Trang chủ → ô "Trắc nghiệm · Bạn thuộc thể chất nào?" mờ + 🔒; chạm → đăng nhập → vào trắc nghiệm → chọn Nam / Nữ → làm hết 60 câu + hai câu cuối → xem kết quả → "Đồng ý lưu".
2. Thoát ra Trang chủ: ô đổi thành "Thể trạng · <tên> · Xem kết quả ›"; vào lại → "Kết quả đã lưu · <ngày>".
3. Tài khoản → Sức khỏe → Thể trạng của tôi → "Xoá kết quả" → quay về màn giới thiệu, thẻ đã lưu biến mất. Mở app lại ở màn mở: dòng dưới "TỨ QUÝ ĐƯỜNG" là "Đông Y Dưỡng Thể".

## CHƯA KIỂM
- Màn mở S1 chưa so ảnh (cờ đã xem bỏ qua màn mở khi chụp) — kiểm bằng mắt bước 3 trên.
- Chưa thử trên trình duyệt Zalo / thiết bị thật, chế độ riêng tư (kho chặn chỉ kiểm bằng bài thử + đọc code).
- Soát độc lập vòng 2 chưa chạy sau khi sửa.

## Báo cáo 7 mục
- VIỆC: KH-UI-5a — Trắc nghiệm thể trạng theo demo, lưu trên máy; khẩu hiệu màn mở.
- ĐÃ SỬA: `src/tracNghiem.js`, `tracNghiemLuu.js`, `lich.js`, `dungTracNghiem.js`, 3 trang `pages/TracNghiem*.jsx`, `KhoiTheChat`, `OTracNghiem`, `Thongbao`, `AnhTheChat`, `noiDung/{theChat,tracNghiemChu,thuongHieu}.js` + 2 JSON, CSS `demo_tracnghiem.css`, 11 SVG; nối `App`, `duongDan`, `TrangChu`, `TaiKhoan`, `ManDau`.
- BÀI THỬ: `thu_KHUI5a.js` 357 đạt (đỏ trên gốc: không tải được module); `thu_KHLINK1.js` 97 đạt; `npm test` 19; `--day-du` 21.
- ĐÃ RÀ K4: grep chuỗi "Sức khỏe mỗi ngày" (chỉ màn mở đổi, Trang chủ giữ); mọi chỗ gọi `giuCho` /tracnghiem; mọi `Ico` mới dùng `IcoVe` (bài `thu_KHUI2` quét sprite).
- CHƯA KIỂM: xem mục trên.
- GIT: nhánh `viec/KH-UI-5a`, không merge, không PR.
- BÀI HỌC: xem dưới.

## Bài học
- KHOÁ (đề xuất, ngoài Phạm vi — chat soát duyệt): hàm trả cờ thành công (`ghiKetQua`) mà nơi gọi bỏ qua → bài thử chạy hook thật; cần chỗ chạy hook (DOM giả) trong `cong_cu/` — chưa có thư viện, ghi để phiếu sau.
- NGUYÊN TẮC (đề xuất `KHUON_LOI.md` K4/K5): thêm trường vào dữ liệu ghi ra máy phải ghi `## Câu hỏi` ngay; lời UI "Đã lưu" phải theo giá trị thật.
- BỎ: đoạn lệch ở 360 / 430 do kịch bản thử (chỉ một lần).

CỔNG: ✓ CỔNG CHẠY ĐẠT (`node tu_chay/cong.js chay . 6b4b6b0^ HEAD viec/KH-UI-5a`, HEAD c7dbffd)

HEAD ĐÃ KIỂM: c7dbffd
