# KH-UI-3c — trạng thái

## Đối chiếu bản chụp (bước 1)
Nhánh `viec/KH-UI-3c`; HEAD = FETCH_HEAD = `82b9772` lúc mở phiên (đã đủ commit của origin).
```
82b9772 PHIEU: KH-UI-3c
855a1e7 TIEN-DO: mo KH-UI-3c; 3a, SLOGAN-1, LUU-1 xong; luat bai thu can trinh duyet - so v9
921813f Merge pull request #7 from tuquyduong/viec/KH-UI-3a
```

## Đột biến (cổng A17/A18) — `viec/KH-UI-3c/dot_bien.py`, 10 đột biến, tất cả ĐỎ
| Chỗ vá | Đột biến |
|---|---|
| OGioVang luôn vẽ ô | BV-GIO-VANG-QUAY-LAI-RETURN-NULL |
| ô mờ không bấm được | VS-O-MO-CHO-BAM-DUOC |
| ô mờ không đếm ngược | VS-O-MO-CO-DEM-NGUOC |
| dòng khoá thay dòng phụ | VS-DONG-KHOA-QUAY-VE-DONG-PHU-CU |
| dòng khoá không mờ | VS-DONG-KHOA-BI-MO |
| ô khoá mờ nhẹ | VS-O-KHOA-MAT-DO-MO |
| ô khoá cao bằng ô thường | VS-DONG-KHOA-CAO-HON-O-THUONG |
| khách không lộ thể trạng đã lưu | VS-KHACH-LO-THE-TRANG-DA-LUU |
| chạm ô khoá → /dangnhap?tiep=/tracnghiem | VS-CHAM-O-KHOA-SAI-TRANG-TIEP |
| bỏ luật giãn hết hàng | BV-LUAT-GIAN-HET-HANG-QUAY-LAI |
(Lần đầu `VS-CHAM-O-KHOA-KHONG-DEN-DANG-NHAP` sống vì tương đương hành vi — App đã tự chuyển về đăng nhập; thay bằng ca sai trang `tiep`.)

## Nghiệm thu — mỗi mục một dòng
- A1 hình ô demo + mờ .55: `thu_KHUI3c.js` ca A1 (phần 1), "độ mờ ô", C1a đo 6 cỡ.
- A2 dòng khoá thay dòng phụ, không mờ, cao bằng ô thường: ca A2 (phần 1) + "A2 … ô khoá cao bằng ô lúc đã đăng nhập" × 6.
- A3 không viên nổi, KhoaTienIch giữ nguyên: ca A3 ×2 + C1a "không phần tử nào phủ chồng" × 6.
- A4 chạm → /dangnhap?tiep; đã đăng nhập thường: ca A4 ×2, C1c, C1e.
- B1 luôn vẽ ô: ca B1 ×4 (phần 1), C1b ×3. B2 không suất/%/đếm ngược/lỗi to: ca B2, C1a, C1d.
- B3 đang tải → ô mờ rồi sáng: ca B3 ×2. B4 hai cột: ca B4.
- C1 (a)–(e): C1a×(6×5), C1b, C1c, C1d, C1e. C2 SỐ CA: `bang_chung_do.txt` (16 / 42 / 357).
- C3 bài cũ sửa: thu_KHUI3a (E2, H1b, A3 cửa lỗi; bỏ 12 ca H2 viên nổi), thu_KHUI5a (ca ô khoá). C5 `so_anh/` + `doi_chieu_demo.md`.
- C4 `npm test` 23 đạt · 0 hỏng; `--day-du` 25 đạt · 0 hỏng (K8, K9 xanh); đột biến 10/10 đỏ; cổng — xem mục Cổng.
- C6 chủ quán thử tay — xem dưới.

## Thao tác chủ quán thử tay (≤ 2 bước)
1. Mở bản xem thử, CHƯA đăng nhập → Trang chủ: hai ô một hàng; ô Giờ vàng mờ "Hiện chưa có"; ô Trắc nghiệm mờ nhẹ với dòng "🔒 Đăng nhập để mở khoá chức năng" đọc rõ, không bị che.
2. Chạm ô Trắc nghiệm → sang đăng nhập. (Chạm ô Giờ vàng mờ → không đi đâu.)

## Soát độc lập (/ra-soat) — vòng 1: ĐẠT (có nghi ngờ nhỏ)
Tóm tắt báo cáo của agent soát: không có lỗi hành vi; chạy lại thu_KHUI3c 16 (không trình duyệt) / 68 (có), `npm test` 23 đạt; số ca khớp `bang_chung_do.txt`; phạm vi sạch, không màu/phông mới.
Nghi ngờ: (1) chưa đo tương phản chữ nhãn ở độ mờ .55 (chỉ kiểm khoảng .4–.7); (2) dòng khoá 9–10,5px khá nhỏ ở 360px — nhờ chủ quán xem tay; (3) chưa có ca bàn phím riêng cho ô khoá (chỉ kiểm role=button/`bam`); (4) `KhoaTienIch` + CSS `.khoa-*` hiện chưa ai render (giữ cho "Kế hoạch và nhắc việc" theo phiếu A3). Mục chưa soát được ở đó (đột biến, --day-du, cổng) máy chính đã chạy ở trên.

## Báo cáo 7 mục
1. **VIỆC** KH-UI-3c — ô Giờ vàng luôn có mặt (mờ khi chưa có); ô Trắc nghiệm khoá dùng dòng khoá thay dòng phụ.
2. **ĐÃ SỬA** `OGioVang.jsx` (nhánh ô mờ), `OTracNghiem.jsx` (tự vẽ ô, `.hb-mo` + `DongKhoa`), `KhoaTienIch.jsx` (tách `DongKhoa`, viên nhãn giữ), `giaoDien.css` (`.hb-mo`, `.hb-khoa`, bỏ luật only-child); bài cũ thu_KHUI3a / thu_KHUI5a theo C3.
3. **BÀI THỬ** `thu_KHUI3c.js` mới (68 đạt có Chromium; SỐ CA 16); đỏ trên gốc (5/11 và 9/46); đột biến 10/10 đỏ; `npm test` 23, `--day-du` 25.
4. **ĐÃ RÀ K4** `dungGia` còn dùng ở Menu / MonO / TrangMon — không đổi, thu_KHUI3a xanh; `OGioVang` chỉ ở TrangChu; luật only-child đã bỏ; `.khoa-*` còn cho KhoaTienIch.
5. **CHƯA KIỂM** thử tay trên điện thoại thật + Zalo; tương phản chữ nhãn mờ ở chữ hệ thống 130% thật (bài thử mô phỏng bằng `html{font-size:130%}`, chữ px của demo không đổi); ca bàn phím ô khoá; ảnh app trong `so_anh/` không có biểu tượng cái cân (POS giả không phục vụ `/anh/`).
6. **GIT** nhánh `viec/KH-UI-3c`, chỉ push nhánh này; không merge, không PR.
7. **BÀI HỌC** xem mục dưới.

## Bài học
- Đột biến "ô khoá không tự đi đăng nhập" sống vì App đã tự chuyển trang cần đăng nhập → ca tương đương hành vi; đổi sang đột biến sai trang `tiep`. **BỎ** (chỉ một lần, đã sửa ca).
- Ô mờ bằng `opacity` cha không cho con sáng lại → mờ từng phần con, chừa dòng khoá. **BỎ** (một lần, đã có ca đo `opacity` hiệu dụng).
- Đề xuất ngoài Phạm vi: thêm đo tương phản chữ mờ + ca bàn phím cho ô khoá ở việc giao diện sau (**KHOÁ** — `thu_KHUI3c.js`, ca đỏ khi dòng khoá mất `role=button`/Enter).
- Máy không có `git worktree`, `sed -i`, `npm root` (người gác chặn) → dùng Edit/Write và thư mục nháp.
