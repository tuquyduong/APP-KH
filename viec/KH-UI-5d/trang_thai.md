# KH-UI-5d — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-UI-5d`; cây sạch; `git fetch origin viec/KH-UI-5d`: HEAD = FETCH_HEAD = `25aff61` (không kéo gì).
- `git log --oneline -3` lúc mở:
  - `25aff61 PHIEU: KH-UI-5d`
  - `4e1366d TIEN-DO: mo KH-UI-5d (dai quang cao manh dau trang + bo X banner, xoa hoi lai, bo Hoan tac, 4 sua nho, doi ngay); them KH-UI-5e, KH-QC-1; quyet dinh 09.11; thu App/POS 09.11`
  - `e966aa8 TIEN-DO: KH-THU-1 xong (chat soat cuoi DAT, gop PR)`
- Giữa phiên không có thông báo đổi model.

## Câu hỏi
(không có)

## Phát hiện (ngoài phạm vi, không sửa)
- `HOM_NAY` ở `src/noiDung/trangChu.js` đang rỗng nên Trang chủ dùng `hero-banner` ảnh, không phải thẻ `.today`: nút ✕ chưa từng hiện trên bản thật; việc bỏ ✕ vẫn làm theo phiếu (gỡ code + dữ liệu).
- `.today.mini`, `.today .t-x` (nếu còn) trong `demo_1.css` / `demo_2.css`: luật CSS của demo giờ không còn phần tử dùng — để nguyên (cấm sửa `demo*.css`).
- Màn rộng ≥ 1024 px (mẫu màn to chủ quán đã duyệt) chưa có ảnh trong `thiet_ke/mau_man_to/`: dải chưa đối chiếu ở màn to.

## Chỗ vá → bài thử → đột biến (việc chỉ đổi `src/`, không có `dot_bien.py`; chạy tay trên bản sao ở nháp, xem `bang_chung_do.txt`)
| Chỗ vá | Bài thử | Đột biến |
|---|---|---|
| `quangCao.js` chỉ Giờ vàng ĐANG chạy | thu_KHUI5d A3 | VS-QC-GIO-VANG-CHUA-TOI-VAN-HIEN |
| `quangCao.js` danh sách trang có dải | thu_KHUI5d A2 | BV-DAI-TRANG-THANH-TOAN |
| `kehoach.js suaViec` nhận ngày mới | thu_KHUI5d E1 | BV-SUA-VIEC-DOI-NGAY |
| `kehoachLap.js tachNhanh` bỏ ngày | thu_KHUI5d D3 | VS-GO-NHANH-BO-QUA-KHONG-PHAI-NGAY |
| `BangNgay.jsx` hỏi xoá | thu_KHUI5d C1 (Chromium) | BV-HOI-XOA-XOA-LUON |

## Bằng chứng nghiệm thu (mỗi mục một dòng)
- A1 dải: DaiQuangCao.jsx + dai_quang_cao.css; thu_KHUI5d ca "A1 dải Menu: cao 38 ± 2, bo 12px, gradient, nhãn, Xem ›" + "vệt sáng fx-a" (Chromium), ca nguồn A1.
- A2 gắn một chỗ / đúng trang: thu_KHUI5d "A2 danh sách trang" (thuần), nguồn "dải gắn MỘT chỗ", Chromium "A2 /menu … /taikhoan có đúng 1 dải", "A2 /trangchu /thanhtoan /don/ABC12 /mathanhvien /taikhoan/thongtin KHÔNG có dải", "A2 màn Đăng nhập KHÔNG có dải", cuộn theo trang (không dính), 360 px không đè nút Quay lại / không cuộn ngang. Bảng PIN / QR nổi trên dải: dải KHÔNG z-index, `.sheet` z-index 90 (đọc `demo_1.css:190`) — chưa có ca Chromium mở PinSheet (xem CHƯA KIỂM).
- A3 nguồn chữ: thu_KHUI5d 6 ca thuần (đang / sắp / hết / chương trình / null / thứ tự) + Chromium "chương trình → 🎁", "không nguồn → không dải", "qua 09:30 dải tự ẩn". `/chuong-trinh` hỏi ≤ 1 lần mỗi lần mở App (App hỏi khi tới trang có dải đầu tiên khác Ưu đãi; `thu_KHCT1` "đúng MỘT lần" ở Ưu đãi vẫn xanh).
- A4 `quangCao` mặc định `[]`, dòng hợp giờ dùng trước, ưu tiên, `id='gio_vang'`, khung qua nửa đêm, dòng hỏng: 5 ca thuần; không gọi cửa `/quang-cao` (ca nguồn A3).
- A5 bấm dải → đích: Chromium "bấm dải Giờ vàng → /menu", "bấm dải chương trình → /uudai"; hàm thuần ca A5 (`mon`+ma_mon, `''`); đích `tracnghiem`/`mon` làm ở `moDichQuangCao` (App.jsx) — chưa có ca Chromium cho hai đích này (CHƯA KIỂM).
- B1 / B2: thu_KHUI5d 5 ca (kho không anBannerHomNay / bannerDangAn, đọc bản lưu cũ có anBanner, BannerHomNay không khiAn / t-x, BannerNho.jsx xoá, ke_hoach.css không .t-x) + Chromium "banner không ✕", "Kế hoạch không banner nhỏ"; thu_KHUI5b 9 ca đổi.
- C1: Chromium 6 ca (hỏi trong bảng, Huỷ giữ, Xoá mất, việc lặp, bảng quá hạn hỏi + xoá), nguồn "không confirm / không Xoá thật?".
- C2: Chromium "tick xong không Hoàn tác", "dời ở bảng quá hạn không Hoàn tác", nguồn "không còn Hoàn tác / ThongBaoHoanTac"; thu_KHUI5c đổi 4 ca Hoàn tác cũ.
- C3: nguồn "Giỏ hàng GIỮ Hoàn tác" + `git diff` không đổi `GioHang.jsx` (không có trong danh sách file đổi).
- D1 một chuông (Chromium + nguồn); D2 chữ đếm đổi sau 1 phút và ẩn sau 60 phút (Chromium, đồng hồ giả); D3 hàm `tachNhanh` + Chromium "Uống 1/2" 4 ca; D4 Chromium 2 ca (xanh cả trên gốc theo đọc code — ca khoá).
- E1: hàm thuần `suaViec` 3 ca + Chromium 4 ca (ô Ngày bánh xoay, không type=date, đổi việc thường, chữ "Chuỗi lặp sẽ tính lại từ ngày mới", việc lặp giữ lần đã tick).
- F1 bài mới thu_KHUI5d: 84 ca có Chromium (31 ca thuần khi KHONG_TRINH_DUYET=1). F2: thu_KHUI5b 9 ca đỏ trên gốc, thu_KHUI5c 1 ca đỏ trên gốc (+ ca trình duyệt đổi), không bớt ca (75 → 75, 52 → 52), không `## Bài thử cũ sửa`.
- F3 ảnh: `so_anh/` 30 ảnh (3 cỡ × 10 màn); `doi_chieu_demo.md`.
- F4: `npm test` / `--day-du` xanh (42 đạt · 0 hỏng, vite build ok); cổng ở cuối file.
- F5 thử tay: xem BÁO CÁO mục "GIT"/hướng dẫn dưới.

## Ghi chú vận hành
- Lệnh chạy bài thử bị người gác từ chối một lần vì ghép `;`/`&&` với lệnh khác (B-PHANTICH) → chạy lại đứng một mình, không ảnh hưởng kết quả.
- `rm -rf` trong nháp bị chặn → dùng thư mục mới thay vì xoá.
- Hai commit sớm (`sửa bài thử cũ 5b/5c`) mang theo bản xoá `BannerNho.jsx` / `ThongBaoHoanTac.jsx` đã `git rm` từ trước (đã staged) — nội dung đúng, chỉ là gộp commit.

## Bài học
- KHOÁ: bài thử "nguồn" của KH-UI-2 (`B11 không new Date(` trong `src/components/*.jsx`) bắt được hàm lịch tôi định viết ở file jsx → đưa `soNgayThang` về `kehoachLap.js`; không cần thêm phép kiểm.
- KHOÁ: `thu_KHCT1` đếm đúng MỘT lần `/chuong-trinh` ở Ưu đãi → dải hỏi lười (không hỏi trùng ở Ưu đãi). Không cần phép kiểm mới.
- NGUYÊN TẮC (đề xuất, ngoài phạm vi): khi thêm một nguồn dữ liệu dùng chung ở vỏ App, tra các bài `thu_KH*` đếm số lần gọi cửa đó trước khi viết (K-mới: "đếm lần gọi cửa"). Chat soát quyết định có mở K9 hay không.
- BỎ: mock `bay_gio` hằng số trong bài thử chặn đồng hồ giả (một lần, đã sửa bằng bỏ mock).

## Cổng (tại HEAD d8bae8a, cây sạch)
- `node tu_chay/cong.js tinh . 25aff61^ HEAD viec/KH-UI-5d` → chỉ `✗ [A19]` (thiếu dòng HEAD ĐÃ KIỂM — ghi ngay bên dưới, bình thường ở bước này).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . 25aff61^ HEAD viec/KH-UI-5d` → `✓ CỔNG CHẠY ĐẠT`.
- `node kiem_tra_truoc_khi_giao.js --day-du` → 42 đạt · 0 hỏng (vite build ok).

## BÁO CÁO 7 MỤC
1. VIỆC: KH-UI-5d — dải quảng cáo mảnh ở đầu các trang, bỏ ✕ banner, xoá hỏi lại một lần (không Hoàn tác ở Kế hoạch), 4 sửa nhỏ, sửa việc đổi được ngày.
2. ĐÃ SỬA: mới `src/quangCao.js`, `components/DaiQuangCao.jsx`, `components/HoiXoa.jsx`, `giaoDien/dai_quang_cao.css`; sửa `App.jsx` (gắn dải một chỗ + hỏi /chuong-trinh lười), `BannerHomNay.jsx`, `TrangChu.jsx`, `TienIch.jsx`, `KeHoach.jsx`, `BangNgay.jsx`, `BangQuaHan.jsx`, `BanhXoay.jsx` (BanhNgay), `dungKeHoach.js` (dungPhut), `kehoach.js`, `kehoachLap.js`, CSS; xoá `BannerNho.jsx`, `ThongBaoHoanTac.jsx`. ~330 dòng app (vừa ngân sách).
3. BÀI THỬ: thu_KHUI5d mới (31 ca thuần / 84 ca có Chromium), sửa thu_KHUI5b (75) / thu_KHUI5c (52). Đỏ trên gốc: 28/31, 9, 1. Đột biến 5 cái đều bắt được. `npm test` + `--day-du` 42 đạt · 0 hỏng; cổng `chay` ĐẠT.
4. ĐÃ RÀ K4: grep `Hoàn tác` / `anBanner` / `bannerDangAn` / `BannerNho` / `ThongBaoHoanTac` / `new Date(` trong `src/`, `cong_cu/` — chỉ còn Giỏ hàng (giữ Hoàn tác theo phiếu), chú thích đổi, và bài thử nói về việc đã bỏ. Mọi nơi gọi `lam(…, true)` / `suaViec` / `BieuMau` đã chuyển theo.
5. CHƯA KIỂM: (a) máy thật / điện thoại, trình duyệt Zalo; (b) bảng PIN / QR nổi trên dải — chỉ đọc CSS (dải không z-index, `.sheet` z-index 90), chưa mở PinSheet bằng Chromium; (c) đích `mon` / `tracnghiem` của dải (có hàm thuần, chưa có ca bấm trong Chromium); (d) ảnh màn rộng ≥ 1024 px; (e) D4 không đỏ trên gốc — ca khoá; (f) dải ở 360 px cắt "…" chữ Giờ vàng dài (phiếu cho phép).
6. GIT: nhánh `viec/KH-UI-5d` đã push; không PR, không merge, không đụng `main`, không sửa `TIEN_DO_APPKH.json`.
7. BÀI HỌC: xem mục `## Bài học` ở trên.

F5 chủ quán thử tay trên điện thoại (1–3 thao tác mỗi mục): (1) lúc Giờ vàng chạy mở Menu / Giỏ hàng → thấy dải đỏ "Giờ vàng…", bấm → vào Menu; mở Thanh toán → không có dải. (2) Kế hoạch → bấm một việc → "Xoá việc" → hỏi lại → Xoá → mất, báo "Đã xoá «…»", không còn Hoàn tác. (3) bảng ngày gõ "Uống 1/2" → thấy "📅 Sẽ xếp vào ngày 1/2" → "Không phải ngày" → Thêm.

HEAD ĐÃ KIỂM: d8bae8a
