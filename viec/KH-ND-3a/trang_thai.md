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
| C1 bộ đếm (chú thích không tính, JSX tính, regex, trừ noiDung / kiemKhop), định dạng no_chu_cung.txt | ĐẠT | thu_KHND3a C1 (11 ca: thêm thẻ tự đóng {…}, phép chia JSX, đối chứng đếm thứ hai trên src — vòng soát 1) |
| C2 K10 bằng số nợ; tăng / tệp mới → ĐỎ; giảm chưa hạ → ĐỎ; ha_no_chu chỉ hạ | ĐẠT | thu_KHND3a C2 (8 ca trên bản chép bộ kiểm) |
| C3 tệp dữ liệu sự thật → `src/noiDung/coDinh/` (chỉ ghi luật) | GHI LUẬT | phiếu C3 ghi luật, việc chuyển ở KH-ND-3d; bộ đếm đã trừ cả `src/noiDung/**` nên `coDinh/` không tính nợ |
| D1 chuyển hết chữ / ảnh / nút các tệp D1, ẩn / hiện khối SECS, mục khoá | ĐẠT | thu_KHND3a D1 (6 ca): 10 tệp đếm = 0; dinhDang.js chỉ còn "đ" và "giảm …" (phiếu: chỉ chuyển lời báo lỗi / lời chào) |
| D2 khách thấy Y HỆT (360 / 390 / 430; đã / chưa đăng nhập; thanh tab; màn mở) | ĐẠT | doi_chieu_demo.md §1: 0 điểm ảnh khác ngoài vùng nhiễu ở 9/9 ảnh; `so_anh/` |
| E1 bài mới, cả KHONG_TRINH_DUYET=1; Chromium đổi 3 khoá / bản rỗng / data-nd | ĐẠT | thu_KHND3a: 68 · 0 (không trình duyệt), 74 · 0 (Chromium) |
| E2 bài cũ sửa, mỗi bài ≥ 1 ca ĐỎ trên gốc | ĐẠT | bang_chung_do.txt §2 — 9 bài (KHKHOP1, KHUI2, KHMUA1, KHUI3c, KHUI5a, KHUI5b, KHUI5d, KHSLOGAN1, KHXEM1) |
| E3 doi_chieu_demo.md khoá App ↔ demo | ĐẠT | doi_chieu_demo.md §2 (ghi "chưa có khối": home.guide, home.ref, img:today.art) |
| E4 npm test, --day-du, cổng tinh + chay, HEAD ĐÃ KIỂM | ĐẠT | mục "Kiểm" bên dưới |
| E5 số khoá, số nợ đầu / sau, tệp nợ nhiều nhất | ĐẠT | mục "Số liệu" bên dưới |

## Số liệu (E5)
- Khoá đã khai: **107** — chu 81 · doan 2 · anh 6 · nut 3 · danhsach 2 · battat 7 · mục khoá 6 (pos 5, tutinh 1).
- Số nợ chữ cứng (bộ đếm K10 đã vá ở vòng soát 1): **đầu 841 chuỗi / 58 tệp → sau 766 / 50 tệp** (−75 ở các tệp D1). (Số cũ 792 → 720 đo bằng bộ đếm còn lỗi — bỏ.)
- Tệp còn nợ nhiều nhất (để chia KH-ND-3b…3e): lich.js 68 · tracNghiem.js 62 · BangNgay.jsx 54 · ThanhToan.jsx 54 · KeHoach.jsx 44 · kehoach.js 41 · UuDai.jsx 34 · NguoiThan.jsx 33 ·
  kehoachLap.js 32 · HoSo.jsx 31 · TienIch.jsx 27 · BangQuaHan.jsx 23 · VanKhanMan.jsx 22 · GioHang.jsx 22 · Menu.jsx 18 · TheoDoiDon.jsx 17 · datDon.js 16.
- Ngân sách: nền ~389 dòng (danh mục 143, nd.js 129, Chu 6, ha_no_chu 96, K10 15) · chuyển mẫu ~270 dòng đổi · thử ~290 dòng mới + 34 dòng sửa → ~980, trong ngân sách ~950.

## Phần trình duyệt (chạy thật ở máy)
- thu_KHND3a phần 2 (Chromium): 6/6 ĐẠT — bản giả đổi `home.bk`, `home.bb` (chữ + đích uudai), `hien.home.needs`, `tieuDe.trangchu` → màn đổi, tên tab đổi, bấm nút sang /uudai; bản rỗng → như cũ; không lỗi trang.
- So ảnh D2: công cụ ở nháp; kết quả doi_chieu_demo.md §1.

## Phát hiện
- `src/pages/HoSo.jsx:42` (ngoài phạm vi) còn so `dau === 'Chào'` để đặt dấu phẩy. Nay `chiaLoiChao` trả thêm `coBuoi`; nếu chủ quán đổi chữ `chao.dau` ở /admin thì Hồ sơ đặt sai dấu phẩy.
  Đề xuất KH-ND-3c dùng `coBuoi` (một dòng).
- `src/gioVang.js` (`chuGioVang`: "Còn …") và `src/components/GvDem.jsx` vẽ chữ đếm ngược trong ô Giờ vàng Trang chủ — ngoài D1, chưa chuyển; `MonO.jsx` ("Hết hàng") dùng chung Menu — để KH-ND-3b.
- `src/components/TheMoi.jsx` giữ ảnh mặc định `/anh/logo-nho.webp` cho Ưu đãi (`UuDai.jsx:215` không truyền `anh`) — đổi `home.logo` ở /admin thì thẻ mời Ưu đãi vẫn logo cũ; KH-ND-3c chuyển Ưu đãi sang danh mục thì truyền `anh`.
- `src/noiDung/tracNghiemChu.js` `O_TRAC_NGHIEM` nay chỉ làm macDinh cho danh mục (`home.qk/qh/q.kq/q.xem`) — KH-ND-3c có thể chuyển hẳn vào danh mục như đã làm với thẻ mời.

## Câu hỏi
(không có)

## Soát độc lập — vòng 1 (báo cáo chép nguyên)
```
KHÔNG ĐẠT

Lý do chính: bộ đếm K10 bỏ sót chữ cứng trong một dạng JSX rất hay gặp. Mục tiêu của phiếu là "chữ cứng mới không thể lọt vào code", nên hiện chưa đạt.

LỖI TÌM ĐƯỢC:
- cong_cu/ha_no_chu.js:15 và :34 (`truocLaRegex` + nhánh regex) — bộ đếm hiểu dấu `/` đứng sau `}` là mở đầu một regex. Gặp thẻ tự đóng có thuộc tính `{…}` (`<Ico s={11} />`) hoặc phép `{a}/{b}` trong JSX, nó bỏ qua phần còn lại của dòng tới dấu `/` kế tiếp, kể cả chữ JSX và chuỗi trong nháy. Đã chạy thử bằng script nháp:
  - `demChuCung('<p><Ico s={1} /> Chữ cứng mới lọt qua K10</p>')` = 0
  - `demChuCung('<p>{a} / {b} Chữ cứng mới</p>')` = 0
  - Đếm thiếu ngay trong src thật: src/pages/KeHoach.jsx:157 ("Thêm việc", đếm 1, đúng ra 2), src/pages/TrangMon.jsx:41 ('Khác', đếm 0), src/components/VanKhanMan.jsx:19, src/components/NguoiThan.jsx:37, src/pages/TienIch.jsx:63 ('Đang nhắc', đếm 0).
  - Hệ quả: ai thêm `<Ico … /> Chữ mới` thì K10 vẫn xanh. Số nợ "đầu 792 / sau 720" đo bằng bộ đếm sai nên thấp hơn thật. Khi vá bộ đếm, số đếm sẽ TĂNG ở nhiều tệp mà `ha_no_chu.js` lại chỉ hạ được, nên phải sửa tay `no_chu_cung.txt`. Thuộc khuôn K5 (bộ kiểm lệch) và K3 (bài thử C1 không có ca này; ca "regex có dấu nháy" ở thu_KHND3a.js chỉ thử dấu `/` sau dấu `=`).
- src/pages/HoSo.jsx:42 — vẫn so `dau === 'Chào'` (K4, đường song song). `chiaLoiChao` (src/dinhDang.js:78) nay lấy `dau` từ `nd('chao.dau')` và trả thêm `coBuoi`. Nếu chủ quán sửa `chao.dau` thì Hồ sơ đặt sai dấu phẩy. Tệp này ngoài phạm vi phiếu, trang_thai.md đã ghi ở mục Phát hiện. Hôm nay khách chưa thấy lỗi, nhưng để ý: KH-ADMIN-1 phải xử lý trước khi mở sửa `chao.dau`.
- src/pages/TrangChu.jsx:97-98 — bảng `DICH` ở màn chép tay danh sách mã của src/noiDung/nd/index.js:8 (K4). Đích mới thêm vào index.js thì `hopLe` vẫn nhận, nhưng ở Trang chủ `DICH[dich]` thành undefined, bấm nút là lỗi `is not a function`. Không có bài thử canh hai danh sách này khớp nhau.
- src/components/TheMoi.jsx:5 — `anh = '/anh/logo-nho.webp'` là nguồn thứ hai của `home.logo`. Ưu đãi (src/pages/UuDai.jsx:215) không truyền `anh`, nên đổi logo ở /admin thì Ưu đãi vẫn logo cũ. Ảnh logo trong thẻ mời ở Trang chủ cũng không có `data-nd`, Chế độ sửa sẽ không tìm thấy chỗ sửa (K4, phụ).
- cong_cu/thu_KHXEM1.js:88 — ca "không có chữ nợ" chạy `JSON.stringify(nd)` trên dangNhap.js. Chữ thẻ mời đã rời tệp đó nên ca này không còn canh chữ thẻ mời, và không ca nào thay vào (điều canh bị hẹp lại — K3, E2).

NGHI NGỜ:
- bang_chung_do.txt §2 ghi thu_KHSLOGAN1 trên gốc là "17 đạt · 3 hỏng" (20 ca); bản bài hiện tại trên gốc với KHONG_TRINH_DUYET=1 ra 13 đạt · 3 hỏng (16 ca) (K1).
- Demo đặt `data-cms="h.banner"` (không có ":"), App dùng `home.banner`; doi_chieu_demo.md §2 không nói lý do.
- `hopLe` (src/noiDung/nd.js:25,30) nhận đường dẫn ảnh rỗng trong `danhsach` và danh sách có mục trùng `ten` (trùng `key` React ở TrangChu.jsx:131).
- Các ca D1 "ẩn / hiện qua ndHien" và "data-nd-khoa" chỉ tìm chuỗi trong nguồn: viết vào chú thích cũng xanh. Chromium chỉ thử một khối `hien.home.needs`.
- Ở Trang chủ còn chữ khách thấy mà không sửa được: DongKhoa trong KhoaTienIch, GvDem "Còn …" (đã ghi Phát hiện; tệp dùng chung nên chấp nhận được).

Đã kiểm không thấy lỗi: không gọi mạng mới, api.js không đổi · không dist/ · tệp D1 quét thô sạch (trừ 'đ', `giảm …`) · mọi khoá trong code có trong danh mục, không khoá thừa · npm test (KHONG_TRINH_DUYET=1) 44 · 0, thu_KHND3a 61 · 0 · HEAD ĐÃ KIỂM vẫn đúng.

NGHIỆM THU: 16/16 mục có bằng chứng · không mục nào thiếu, nhưng C1 và C2 có bằng chứng mà sai thật (lỗi bộ đếm).

CHƯA SOÁT ĐƯỢC: chưa tự so ảnh D2, chưa chạy phần Chromium, --day-du, cổng chay; chưa thử vite bản dựng thật thay import.meta.env.DEV; chưa xem trình duyệt Zalo / chữ to.

Đơn giản: dùng <Chu> thay `<span {...ndDau(k)}>{nd(k)}</span>` (TrangChu.jsx:75, OKeHoach.jsx:14, BannerHomNay.jsx:37, ThanhTab.jsx:31, ManDau.jsx:99); TheMoi nhận `chu` + `khoa` song song; thu_KHSLOGAN1 sửa đọc KHONG_TRINH_DUYET là ngoài điều Cấm cho phép dù hợp §9.

BÀI HỌC:
- KHOÁ: ca C1 `<X a={b} /> Chữ`, `{a}/{b} chữ`, `{a} / {b} chữ`; ca so bộ đếm với cách quét thứ hai trên toàn src.
- KHOÁ: mọi mã trong DICH phải có hàm mở ở mọi màn có nút.
- NGUYÊN TẮC: bộ kiểm quét chữ tự viết phải có ca trên mẫu thật lấy từ src; trước khi chốt số nợ "chỉ được giảm" phải đối chứng bằng cách đếm thứ hai.
```

### Xử lý vòng 1
| Điểm soát | Xử lý | Bằng chứng |
|---|---|---|
| Bộ đếm: `/` sau `}` hiểu là regex | VÁ `cong_cu/ha_no_chu.js` (bỏ `}` khỏi tập ký tự đứng trước regex) + 3 ca mẫu thật + ca đối chứng đếm thứ hai trên src; lập lại số nợ 766 | bang_chung_do.txt §5 (5 ca đỏ trước vá) |
| HoSo.jsx:42 `dau === 'Chào'` | ngoài phạm vi → giữ ở Phát hiện (KH-ND-3c / trước KH-ADMIN-1) | — |
| Bảng DICH chép tay ở Trang chủ | thêm ca "mọi mã DICH có hàm mở ở Trang chủ" (đọc bảng của màn, so từng mã) | thu_KHND3a A1 |
| TheMoi logo: nguồn thứ hai, thiếu data-nd | Trang chủ truyền `anh` + khoá `home.logo` (có data-nd); mặc định cho Ưu đãi giữ → Phát hiện | thu_KHND3a E1 (data-nd) |
| KHXEM1 ca "nợ" hẹp lại | thêm ca "danh mục không có chữ nợ" ở thu_KHND3a | thu_KHND3a A1 |
| Số SLOGAN1 trên gốc | sửa 13 · 3 | bang_chung_do.txt §2 |
| h.banner ↔ home.banner | ghi lý do (h. là tiền tố loại khối) | doi_chieu_demo.md §2 |
| hopLe nhận ảnh rỗng / trùng tên lọc | VÁ nd.js: ảnh trong danhsach không rỗng, khoá cấu trúc không trùng → macDinh | thu_KHND3a B2 |
| Ca D1 tìm chuỗi trong chú thích | bỏ chú thích trước khi tìm | thu_KHND3a D1 |
| Một kiểu <Chu> | đổi 5 chỗ sang `<Chu>` (cùng DOM; so ảnh lại 0 lệch ngoài nhiễu) | doi_chieu_demo.md §1 |
| TheMoi chu + khoa song song | giữ: TheMoi dùng chung với Ưu đãi (chữ của Ưu đãi chưa vào danh mục — KH-ND-3c); đổi giao diện TheMoi để sau | — |
| SLOGAN1 đọc KHONG_TRINH_DUYET | giữ: cổng A16 đòi số máy = số GitHub (CLAUDE.md §9); ghi rõ ở đây | — |

## Kiểm (E4)
- `npm test` / `node kiem_tra_truoc_khi_giao.js --day-du` (máy có Chromium, HEAD f100ec3+): 46 đạt · 0 hỏng (có K10 và vite build). Sau đó chỉ đổi thu_KHSLOGAN1 (đọc KHONG_TRINH_DUYET) — chạy riêng 16 · 0 (không trình duyệt), 20 · 0 (Chromium).
- `node tu_chay/cong.js tinh . fd5d70e^ HEAD viec/KH-ND-3a`: chỉ ✗ [A19] (chưa có dòng HEAD ĐÃ KIỂM — bình thường trước bước này).
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . fd5d70e^ HEAD viec/KH-ND-3a` (HEAD 41aa09a): ✓ CỔNG CHẠY ĐẠT
  (· CẢNH BÁO A16: thu_KHND3a trên gốc in 26 ca ≠ 61 — trên gốc thiếu cong_cu/ha_no_chu.js nên khối C dừng sớm, đúng dạng "bài dừng sớm trên gốc").
  Lần chạy trước (HEAD 0f…/trước 41aa09a) bắt ✗ [A16] SỐ CA thu_KHSLOGAN1 16 ≠ 20 → đã vá bài cho đọc KHONG_TRINH_DUYET (§9).

HEAD ĐÃ KIỂM: 41aa09a

## Kiểm sau vòng soát 1
- `node kiem_tra_truoc_khi_giao.js --day-du` (máy có Chromium, HEAD 1c4f423 trừ trang_thai): 46 đạt · 0 hỏng.
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . fd5d70e^ HEAD viec/KH-ND-3a` (HEAD 1c4f423): ✓ CỔNG CHẠY ĐẠT
  (· CẢNH BÁO A16: thu_KHND3a trên gốc in 28 ca ≠ 68 — gốc thiếu cong_cu/ha_no_chu.js nên khối C dừng sớm).

HEAD ĐÃ KIỂM: 1c4f423

## Soát độc lập — vòng 2 (báo cáo chép nguyên)
```
ĐẠT

Kết luận: vòng 2 không còn lỗi chặn. Bộ đếm K10 đã vá đúng, và tôi đã đối chiếu nó bằng một cách đếm thứ hai độc lập. Còn một ca thử rỗng: đó là ca mới viết để xử lý một điểm của vòng 1, nên điểm đó thực ra chưa được xử lý. Nên sửa trước khi gộp (một dòng), nhưng không chặn.

LỖI TÌM ĐƯỢC:  (không có lỗi chặn — lỗi nhỏ ghi ở NGHI NGỜ theo dặn)

NGHI NGỜ:
- Ca thử rỗng — đã chạy lệnh xác nhận. cong_cu/thu_KHND3a.js:70 có ca "A1 danh mục không có chữ nợ" dùng `/\bnợ\b/i`. Trong JS, `\b` chỉ hiểu chữ ASCII, nên chữ "ợ" không tạo ranh giới từ. `/\bnợ\b/i.test('công nợ')`, `'nợ cũ'` và `JSON.stringify(['nợ'])` đều là false. Vậy ca này không bao giờ đỏ (K3).
  - Đây chính là cách xử lý điểm vòng 1 "KHXEM1 ca nợ hẹp lại", nên điểm đó thực tế CHƯA được xử lý; câu "Xử lý vòng 1 … thu_KHND3a A1" trong trang_thai.md là khẳng định không có căn cứ (K1).
  - Sửa: bỏ `\b`, viết `/nợ/i`.
  - Các bài cũ cũng mắc cùng lỗi (có từ trước, ngoài phiếu): thu_KHXEM1.js:88, thu_KHUI5e.js:186, thu_KHUI5c.js:128, thu_KHUI3a.js:240, thu_KHUI5b.js:250.
- Bộ đếm K10 còn bỏ sót vài dạng: chữ JSX có URL (`<p>Xem https://x.com chữ mới</p>` → 0, `//` hiểu là chú thích); chữ JSX có `/` sau `(`, `=`, `?`, `-` (`<p>(/ngày) mới</p>`… → 0); chuỗi lồng trong `${…}` của template đã có dấu không được tính thêm (src/kehoach.js:44, :350 — babel 43, K10 41). Ca đối chứng (thu_KHND3a.js:185-194) chỉ quét tệp ĐANG có trong số nợ, từng dòng riêng → tệp mới chỉ có chữ dạng trên sẽ lọt. src thật hiện chưa bị ảnh hưởng: đếm bằng @babel/parser tổng 768, K10 766, số nợ 766; chỉ lệch kehoach.js (+2).
- Hạ số nợ bằng tay: không gì chặn sửa tay cong_cu/no_chu_cung.txt để NÂNG số; "chỉ được giảm" chỉ có ở ha_no_chu.js; cổng không so tệp này với gốc.
- HoSo vẫn so chữ "Chào" (src/pages/HoSo.jsx:42) — đã ghi Phát hiện; xử lý trước khi KH-ADMIN-1 mở sửa chao.dau.
- Nhãn nhu cầu hai nguồn (K4 phụ): home.need.nhan chỉ đổi Trang chủ; MonO.jsx:19, TrangMon.jsx:28 vẫn lấy NHU_CAU.
- home.feat.mon không chặn mã trùng (không khoaCauTruc) → trùng key={m.ma} ở TrangChu.jsx.
- doi_chieu_demo.md §2: `h.banner` của demo gồm cả {title, img} (app_kh_demo.html:4151) nên home.bh ứng với phần title của h.banner; kiểu h.featured (dòng 4288) chưa có trong bảng.
- ManDau.jsx:95 và :106 vẫn viết `{...ndDau(k)}>{nd(k)}`, có thể dùng <Chu>.

Đã kiểm, không thấy lỗi: bộ đếm sau vá đúng (ha_no_chu.js:18); ca mới vòng 1 ĐỎ trên 41aa09a (63 · 5); bài cũ trên gốc khớp bang_chung_do (KHUI5a 354 · 3, KHSLOGAN1 13 · 3, KHXEM1 60 · 1); hopLe chặn ảnh rỗng / mã trùng khi có khoaCauTruc; ca DICH canh thật; vite bản dựng thật có DEV:!1 → khoá lạ trả ""; không gọi mạng mới, không dist/, mọi tệp trong Phạm vi; mọi khoá dùng có trong danh mục, không khoá thừa.

NGHIỆM THU: 16/16 mục có bằng chứng · mục thiếu: không (C3 chỉ ghi luật, đúng phiếu). Tự chạy: thu_KHND3a 68 · 0 / 74 · 0 Chromium; K10 xanh; KHONG_TRINH_DUYET=1 npm test 44 · 0; cổng tinh + chay ĐẠT; E5 khớp (107 khoá; 841/58 → 766/50).

CHƯA SOÁT ĐƯỢC: chưa so lại ảnh D2; chưa chạy --day-du (người gác chặn npx vite build); chưa xem trình duyệt Zalo / chữ to; chưa thử đích tracnghiem / kehoach / giovang của nút banner khi khách chưa đăng nhập.

BÀI HỌC:
- KHOÁ: cấm \b cạnh chữ có dấu trong regex của bài thử (quét cong_cu/thu_*.js) — đã có 6 ca "không chữ nợ" rỗng.
- KHOÁ: ca thử bộ đếm K10 cho URL trong JSX, `/` sau `( = ? -`, chuỗi lồng trong ${…}; ca đối chứng quét MỌI tệp src bằng @babel/parser.
- NGUYÊN TẮC: ca thử viết để xử lý một điểm soát phải tự chứng minh ĐỎ được bằng bản giả cố ý vi phạm.
- NGUYÊN TẮC: "chỉ được giảm" phải do cổng giữ (so no_chu_cung.txt với gốc nhánh), không dựa lời dặn.
```

### Xử lý vòng 2
- Ca "không chữ nợ" rỗng → VÁ (commit 1ba19e8): bỏ `\b`, thêm bản giả "Công nợ" chứng minh phép kiểm đỏ được. Bài cũ cùng lỗi (ngoài phạm vi) → Phát hiện.
- Bộ đếm còn sót dạng hiếm, số nợ sửa tay được, nhãn nhu cầu hai nguồn, home.feat.mon mã trùng, h.featured, ManDau → Phát hiện / đề xuất (không lỗi khách thấy hôm nay; src thật đếm khớp babel trừ +2 ở kehoach.js).

## Phát hiện (thêm sau soát vòng 2)
- 5 bài cũ có ca "không chữ nợ" rỗng vì `\b` không hiểu chữ có dấu: thu_KHXEM1.js:88, thu_KHUI5e.js:186, thu_KHUI5c.js:128, thu_KHUI3a.js:240, thu_KHUI5b.js:250 (sửa: `/nợ/i`).
- Bộ đếm K10 chưa tính: chữ JSX chứa `//` (URL), chữ JSX có `/` ngay sau `( = ? -`, chuỗi có dấu lồng trong `${…}` của template có dấu (src/kehoach.js:44, :350 — thiếu 2).
- `cong_cu/no_chu_cung.txt` sửa tay để NÂNG số nợ thì K10 vẫn xanh — chưa có phép so với gốc nhánh.
- Nhãn nhu cầu: `home.need.nhan` chỉ dùng ở Trang chủ; `MonO.jsx:19`, `TrangMon.jsx:28` còn đọc `NHU_CAU` (KH-ND-3b nên đọc `ndDs('home.need')`).
- `home.feat.mon` nhận mã món trùng → trùng `key` React ở Trang chủ khi chủ quán nhập trùng (nên chặn trùng chung cho mọi danhsach khi làm KH-ADMIN-1).
- `ManDau.jsx` còn 2 chỗ `{...ndDau(k)}>{nd(k)}` (nút Bỏ qua, khẩu hiệu có lớp riêng) — gọn được bằng `<Chu>`, không đổi gì khách thấy.

## Báo cáo 7 mục
1. **VIỆC:** KH-ND-3a — nền "Nội dung sửa được": danh mục khoá + `nd()` + nguồn bản cập nhật + `<Chu>` + K10 "chữ cứng chỉ được giảm" + chuyển mẫu Trang chủ / thanh tab / màn mở / tên màn / câu báo lỗi chung.
2. **ĐÃ SỬA:** mới `src/noiDung/nd.js`, `src/noiDung/nd/{index,khungChung,trangChu}.js`, `src/components/Chu.jsx`, `cong_cu/ha_no_chu.js`, `cong_cu/no_chu_cung.txt`, `cong_cu/thu_KHND3a.js`;
   sửa `src/App.jsx` (nghe nguồn, 1 chỗ), `src/pages/TrangChu.jsx`, `src/components/{OKeHoach,OGioVang,BannerHomNay,TheMoi,OTracNghiem,ThanhTab,ManDau,Man}.jsx`, `src/duongDan.js` (tên màn), `src/dinhDang.js` (lỗi + lời chào),
   `src/noiDung/dangNhap.js` (bỏ THE_MOI — cắt vòng nạp), `kiem_tra_truoc_khi_giao.js` (thêm K10); xoá `src/noiDung/trangChu.js`; 9 bài cũ sửa cho đọc chỗ mới.
3. **BÀI THỬ:** thu_KHND3a 68 · 0 (không trình duyệt) / 74 · 0 (Chromium) — đỏ trên gốc 0 · 28; 9 bài cũ sửa đều có ca đỏ trên gốc (bang_chung_do.txt); `--day-du` 46 · 0; cổng `chay` ĐẠT; so ảnh D2 0 lệch ngoài nhiễu.
4. **ĐÃ RÀ K4:** mọi chỗ dùng NHU_CAU / KHAU_HIEU / O_TRAC_NGHIEM / THE_MOI / chiaLoiChao / tieuDeTrang / loiTheoCode / TheMoi / DICH; vòng nạp mô-đun (bắt và vá); HoSo `dau === 'Chào'`, MonO/TrangMon NHU_CAU → Phát hiện.
5. **CHƯA KIỂM:** trình duyệt Zalo và chữ to theo cài đặt máy (DOM không đổi nên không dự kiến khác); Chế độ sửa thật chưa có (KH-ADMIN-1); nút banner đổi đích sang tracnghiem / kehoach / giovang khi khách chưa đăng nhập — Chromium chỉ thử đích uudai.
6. **GIT:** nhánh viec/KH-ND-3a, các commit `KH-ND-3a: …` từ af2ffe6 tới HEAD; đã push. Không merge, không PR.
7. **BÀI HỌC:** xem mục Bài học.

Thử tay trên điện thoại (chủ quán): (1) mở tuquyduong.com khi chưa đăng nhập — Trang chủ, thanh tab, màn mở y như cũ; (2) đăng nhập — thẻ hội viên, ô Kế hoạch, ô Giờ vàng y như cũ; (3) bấm "Xem Menu →" và "Xem tất cả" → vào Menu như cũ.

## Bài học
| Sự cố | Ngăn | Lý do / đề xuất |
|---|---|---|
| Bộ đếm K10 hiểu `/` sau `}` là regex → nuốt chữ sau thẻ tự đóng `{…}` (soát vòng 1) | **KHOÁ** (đã làm, trong phạm vi) | 3 ca mẫu thật + ca đối chứng đếm thứ hai trong thu_KHND3a; đỏ trên bản trước vá (bang_chung_do §5) |
| Bộ đếm còn sót URL / `/` sau `( = ? -` / chuỗi lồng `${}` (soát vòng 2) | **KHOÁ** (đề xuất) | thu_KHND3a: thêm 3 ca đó + đối chứng bằng `@babel/parser` quét MỌI tệp src (vá bộ đếm thì số kehoach.js tăng 2 → lập lại số nợ trong cùng việc) — gom vào KH-ND-3b hoặc phiếu HOC |
| Vòng nạp dinhDang ↔ nd ↔ danh mục ↔ dangNhap (tự bắt) | **KHOÁ** (đã làm) | ca "B1 không vòng nạp" nạp mỗi mô-đun làm đầu vào riêng — đỏ trên 452e629 |
| Gộp hai nút chữ thành một → lệch 31 điểm ảnh (so ảnh bắt) | **NGUYÊN TẮC** (đề xuất, KHUON_LOI.md ngoài phạm vi) | "K10 — Chuyển chữ JSX sang hàm phải giữ cách tách nút chữ (`ndPhan`) · Đã gây: KH-ND-3a '0 việc hôm nay ›' lệch 31 điểm · Dấu hiệu: `{so} chữ` thành một chuỗi · Chặn: so ảnh trước / sau" |
| `\b` cạnh chữ có dấu → ca thử rỗng (soát vòng 2; 6 ca trong kho) | **KHOÁ** (đề xuất, ngoài phép của phiếu) | bộ kiểm quét `cong_cu/thu_*.js`: regex có `\b` sát chữ có dấu → đỏ; ca đỏ: tệp giả chứa `/\bnợ\b/` |
| Ca thử viết để xử lý điểm soát mà không đỏ được | **NGUYÊN TẮC** (đề xuất) | mọi ca "không có X" kèm bản giả chứa X phải bắt được (đã làm ở ca "nợ") |
| Số nợ sửa tay nâng được | **KHOÁ** (đề xuất, tu_chay/ ngoài phạm vi) | cổng so `cong_cu/no_chu_cung.txt` với gốc nhánh: dòng tăng / thêm → ✗ (trừ việc lập số nợ đầu) |
| thu_KHSLOGAN1 không đọc KHONG_TRINH_DUYET → cổng A16 đỏ | **KHOÁ** (đề xuất) | bộ kiểm: mọi `cong_cu/thu_*.js` có `require('playwright')` phải đọc `KHONG_TRINH_DUYET` |
| Commit đầu lẫn tệp đã `git rm` sẵn | **BỎ** | một lần; từ đó xem `git status` trước mỗi commit |
| Người gác chặn lệnh (for, `&&` sau script, sed -i, git -C, chuỗi mã lỗi phiên / process.env, git add thư mục, cp *) | **BỎ** | luật đã rõ trong skill; làm lại theo hướng dẫn ngay |

## Kiểm cuối
- `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . fd5d70e^ HEAD viec/KH-ND-3a` (HEAD 1ba19e8): ✓ CỔNG CHẠY ĐẠT (· CẢNH BÁO A16: thu_KHND3a trên gốc 28 ca ≠ 68 — gốc thiếu ha_no_chu.js, khối C dừng sớm).
- `--day-du` 46 · 0 ở 1c4f423; sau đó chỉ đổi một ca của thu_KHND3a (68 · 0, nằm trong lần chạy cổng trên).

HEAD ĐÃ KIỂM: 1ba19e8
