# KH-ND-3a — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: viec/KH-ND-3a · cây sạch · HEAD fd5d70e = FETCH_HEAD fd5d70e (bằng nhau, không kéo)
- git log --oneline -3:
  - fd5d70e PHIEU: KH-ND-3a
  - eb495b8 TIEN-DO: noi dung sua duoc (CLAUDE.md muc 11, phuong an, kho noi dung o nho POS, quyen trong Phan quyen POS; thu POS 11.11); mo KH-ND-3a (nen danh muc + nd() + K10 + mau Trang chu); them KH-ND-3b..3e; KH-ADMIN-1 truoc khai truong
  - 443c28e TIEN-DO: KH-UI-5e xong (chat soat cuoi DAT, gop PR)

## Ghi chú quá trình
- Commit đầu `af2ffe6` (kế hoạch) lỡ mang theo việc xoá `src/noiDung/trangChu.js` (đã `git rm` sẵn trong chỉ mục). Nội dung đúng như dự định; không viết lại lịch sử.
- Người gác chặn vài lệnh (đều làm lại theo hướng dẫn): `for`/`time` (B-CHUONGTRINH), lệnh chạy script ghép `&&` / `;` (B-PHANTICH), `sed -i` (SED-I), `git -C` (GIT-TUYCHON),
  chuỗi `KH_TOKEN_SAI` / `process.env` trong lệnh hay script nháp (B-BIMAT-CHU → sửa bằng Edit; chạy bài KHKHOP1 sau khi commit), `git add <thư mục>` (GIT-ADD), đích `cp` có `*` (B-DICHCHU).

## Nghiệm thu — từng mục, kèm bằng chứng
| Mục | Kết quả | Bằng chứng |
|---|---|---|
| A1 thư mục `src/noiDung/nd/` (khungChung, trangChu, index), khuôn mục, khoá demo dùng lại | ĐẠT | thu_KHND3a A1 (9 ca: tệp, ≥ 80 mục, mảng, 18 khoá demo, 6 loại, nút, battat SECS, danhsach nhu cầu, macDinh = chữ đang chạy, bien) |
| A2 mục khoá pos / tutinh có chiDuong | ĐẠT | thu_KHND3a A2 (2 ca) — 5 mục pos + 1 tutinh |
| A3 `kiemDanhMuc` trên toàn bộ danh mục + ca lỗi giả | ĐẠT | thu_KHND3a A3 (9 ca: 0 lỗi; trùng, thiếu ten/loai/macDinh, bien hai chiều, toiDa, dich lạ, trường lạ, tiLe, chiDuong; mục hợp lệ không bị chặn) |
| B1 `nd / ndNut / ndAnh / ndDs / ndHien`, khoá lạ: dev ném lỗi, bản thật '' | ĐẠT | thu_KHND3a B1 (5 ca, có ca dựng esbuild `import.meta.env.DEV=false`) + ca không vòng nạp |
| B2 `datBanNoiDung`, nghe, vỏ App một chỗ, giá trị hỏng → macDinh | ĐẠT | thu_KHND3a B2 (7 ca) + Chromium E1 |
| B3 `<Chu>`, `ndDau` → data-nd / data-nd-khoa | ĐẠT | thu_KHND3a B3 (2 ca) + D1 data-nd-khoa + Chromium (≥ 15 data-nd, có data-nd-khoa) |
| C1 bộ đếm (chú thích không tính, JSX tính, regex, trừ noiDung / kiemKhop), định dạng no_chu_cung.txt | ĐẠT | thu_KHND3a C1 (7 ca) |
| C2 K10 bằng số nợ; tăng / tệp mới → ĐỎ; giảm chưa hạ → ĐỎ; ha_no_chu chỉ hạ | ĐẠT | thu_KHND3a C2 (8 ca trên bản chép bộ kiểm) |
| C3 tệp dữ liệu sự thật → `src/noiDung/coDinh/` (chỉ ghi luật) | GHI LUẬT | phiếu C3 ghi luật, việc chuyển ở KH-ND-3d; bộ đếm đã trừ cả `src/noiDung/**` nên `coDinh/` không tính nợ |
| D1 chuyển hết chữ / ảnh / nút các tệp D1, ẩn / hiện khối SECS, mục khoá | ĐẠT | thu_KHND3a D1 (6 ca): 10 tệp đếm = 0; dinhDang.js chỉ còn "đ" và "giảm …" (phiếu: chỉ chuyển lời báo lỗi / lời chào) |
| D2 khách thấy Y HỆT (360 / 390 / 430; đã / chưa đăng nhập; thanh tab; màn mở) | ĐẠT | doi_chieu_demo.md §1: 0 điểm ảnh khác ngoài vùng nhiễu ở 9/9 ảnh; `so_anh/` |
| E1 bài mới, cả KHONG_TRINH_DUYET=1; Chromium đổi 3 khoá / bản rỗng / data-nd | ĐẠT | thu_KHND3a: 61 · 0 (không trình duyệt), 67 · 0 (Chromium) |
| E2 bài cũ sửa, mỗi bài ≥ 1 ca ĐỎ trên gốc | ĐẠT | bang_chung_do.txt §2 — 9 bài (KHKHOP1, KHUI2, KHMUA1, KHUI3c, KHUI5a, KHUI5b, KHUI5d, KHSLOGAN1, KHXEM1) |
| E3 doi_chieu_demo.md khoá App ↔ demo | ĐẠT | doi_chieu_demo.md §2 (ghi "chưa có khối": home.guide, home.ref, img:today.art) |
| E4 npm test, --day-du, cổng tinh + chay, HEAD ĐÃ KIỂM | ĐẠT | mục "Kiểm" bên dưới |
| E5 số khoá, số nợ đầu / sau, tệp nợ nhiều nhất | ĐẠT | mục "Số liệu" bên dưới |

## Số liệu (E5)
- Khoá đã khai: **107** — chu 81 · doan 2 · anh 6 · nut 3 · danhsach 2 · battat 7 · mục khoá 6 (pos 5, tutinh 1).
- Số nợ chữ cứng (bộ đếm K10): **đầu 792 chuỗi / 57 tệp → sau 720 / 49 tệp** (−72: TrangChu 9, duongDan 23, dinhDang 16, OKeHoach 6, ThanhTab 6, OGioVang 5, ManDau 4, Man 2, BannerHomNay 1).
- Tệp còn nợ nhiều nhất (để chia KH-ND-3b…3e): lich.js 68 · tracNghiem.js 62 · BangNgay.jsx 54 · ThanhToan.jsx 54 · kehoach.js 41 · UuDai.jsx 34 · NguoiThan.jsx 32 · kehoachLap.js 32 ·
  HoSo.jsx 28 · TienIch.jsx 26 · BangQuaHan.jsx 23 · GioHang.jsx 22 · VanKhanMan.jsx 20 · datDon.js 16 · Menu.jsx 16 · KeHoach.jsx 15.
- Ngân sách: nền ~389 dòng (danh mục 143, nd.js 129, Chu 6, ha_no_chu 96, K10 15) · chuyển mẫu ~270 dòng đổi · thử 260 dòng mới + 34 dòng sửa → ~950, trong ngân sách ~950.

## Phần trình duyệt (chạy thật ở máy)
- thu_KHND3a phần 2 (Chromium): 6/6 ĐẠT — bản giả đổi `home.bk`, `home.bb` (chữ + đích uudai), `hien.home.needs`, `tieuDe.trangchu` → màn đổi, tên tab đổi, bấm nút sang /uudai; bản rỗng → như cũ; không lỗi trang.
- So ảnh D2: công cụ ở nháp; kết quả doi_chieu_demo.md §1.

## Phát hiện
- `src/pages/HoSo.jsx:42` (ngoài phạm vi) còn so `dau === 'Chào'` để đặt dấu phẩy. Nay `chiaLoiChao` trả thêm `coBuoi`; nếu chủ quán đổi chữ `chao.dau` ở /admin thì Hồ sơ đặt sai dấu phẩy.
  Đề xuất KH-ND-3c dùng `coBuoi` (một dòng).
- `src/gioVang.js` (`chuGioVang`: "Còn …") và `src/components/GvDem.jsx` vẽ chữ đếm ngược trong ô Giờ vàng Trang chủ — ngoài D1, chưa chuyển; `MonO.jsx` ("Hết hàng") dùng chung Menu — để KH-ND-3b.
- `thu_KHSLOGAN1.js` không đọc `KHONG_TRINH_DUYET` (máy có Chromium vẫn chạy 4 ca phông) → `SỐ CA` ghi 16 (số GitHub đếm, không Playwright), máy đếm 20.
- `src/noiDung/tracNghiemChu.js` `O_TRAC_NGHIEM` nay chỉ làm macDinh cho danh mục (`home.qk/qh/q.kq/q.xem`) — KH-ND-3c có thể chuyển hẳn vào danh mục như đã làm với thẻ mời.

## Câu hỏi
(không có)
