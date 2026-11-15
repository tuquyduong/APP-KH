# KH-ADMIN-1 — kế hoạch (CHỜ CHỦ QUÁN DUYỆT)

Nguồn đã đọc (bước 2): `viec/KH-ADMIN-1/phieu.md`, `viec/KH-ADMIN-1/hop_dong_nd_v1.md` (sha256 `836eb6ba2554e82daa7ef8be42bfe68d12754ed45540ad35795fe800d503b197` — khớp đầu
`836eb6ba2554e82d` của phiếu A1), CLAUDE.md §4–§11, `thiet_ke/QUYET_DINH_APPKH.md` (dòng 10, 14, 23, 54, 133), ghi chú KH-ADMIN-1 trong `TIEN_DO_APPKH.json` (dòng 745 — tự soát 3b / 3c / 3d),
code: `src/noiDung/nd.js` (125 dòng), `src/api.js` (78), `src/App.jsx` (265), `src/main.jsx` (15), `src/duongDan.js` (124), `src/dangKySW.js` (59), `src/luuMay.js`, `src/kehoach.js:20-37,117-154`,
`src/noiDung/nd/keHoach.js:7,114-115`, `src/noiDung/nd/index.js`, `src/pages/KiemKhop.jsx`, `src/pages/TaiKhoan.jsx:64`, `src/dinhDang.js:42-45` (`ghepDiaChi` = gốc + `/api/kh`),
demo CSS `.cms-*` / `.cs-*` (`thiet_ke/app_kh_demo.html:1488-1600`) và JS `cmsGet … cmsReview` (4147-4300), bài thử đang canh vùng này: `cong_cu/thu_KHLINK1.js:64,84,123`,
`cong_cu/thu_KHKHOP1.js:100-113`, `cong_cu/thu_KHPWA1.js:83`, bộ kiểm K1 (`kiem_tra_truoc_khi_giao.js:36`).

## 0. Khung chung (ít dòng nhất mà đủ nghiệm thu)
```
main.jsx ── napBanMay() (đọc kh_nd_ban → datBanNoiDung) TRƯỚC render ── docDuongDan(location).quanTri ? <QuanTri/> : <App/>
App.jsx  ── +1 dòng: {coVeQuanTri() && <CheDoSua di={di} />}  (+ import)       — không đụng quảng cáo / muaThe / daTra / TienIch
khoNoiDung.js ── địa chỉ kho (1 biến) · vé sessionStorage · mọi hàm cửa /api/nd v1 · hỏi bản mới (mở App + quay lại ≥ PHUT_KIEM)
api.js   ── +goiKho(url, phuongThuc, than, ve) (fetch duy nhất vẫn ở đây) · chặn ghi trong goi() khi datCheDoSua(true)
nd.js    ── export hopLe · luật ảnh B3 · dòng trùng mọi danhsach (F2) · lớp nháp datLopNhap() (D4) · gốc ảnh kho datGocAnh()
CheDoSua*.jsx ── lớp phủ ✎/🔒 + thanh .cms-bar + bảng sửa tự sinh + Xem lại + Đi tới màn + Chữ của màn này
QuanTri*.jsx  ── đăng nhập quản trị · bảng quản trị · lịch sử / xuất / nhập · vỏ /admin/kiemkhop (dựng lại KiemKhop.jsx)
```
Khu `/admin*` dựng RIÊNG ở `main.jsx` (như `/kiemkhop` hôm nay): vỏ App khách không mount → không gọi `/hang`, `/menu`… và không thanh tab. "Bật Chế độ sửa" = `location.assign('/trangchu')`
(tải lại trang — vé + cờ sửa trong sessionStorage còn) → vỏ App khách chạy như khách, `CheDoSua` phủ lên.

## 1. Các phần — phương án A / B, chọn

### P1. Hợp đồng (A1, A2)
- **A (chọn):** `cp` nguyên tệp → `thiet_ke/HOP_DONG_API_ND.md`, `sha256sum` + `cmp` ghi vào `trang_thai.md`. Giới hạn App kiểm trước (khoá 80, ảnh 512000, ghi chú 500, bản 1 MB,
  nhập 50 MB) = hằng có tên ở MỘT chỗ `GIOI_HAN` trong `khoNoiDung.js`; bài thử đọc khối `HOP_DONG_ND_MAY_DOC` và so từng số, so mọi cửa `khoNoiDung.js` gọi (bài đọc nguồn
  các cặp `'PHUONG_THUC', '/duong'`) ⊂ `cua[]`, mọi `code` App xử lý riêng ⊂ `ma_loi`. 0 dòng app ngoài hằng.
- B: App đọc hợp đồng lúc chạy (nhập .md vào bản dựng). Bỏ: nặng bản dựng, hợp đồng là tài liệu.

### P2. Tệp kho `src/noiDung/khoNoiDung.js` + hàm gọi kho ở `src/api.js` (B1, B2, C2) — ~130 dòng
- **A (chọn):**
  - `DIA_CHI_KHO = VITE_ND_API || <VITE_POS_API bỏ "/" cuối> + '/api/nd'` (lưu ý: `VITE_POS_API` là GỐC máy — `ghepDiaChi` tự thêm `/api/kh`, `src/dinhDang.js:44` — nên "đổi `/api/kh`
    thành `/api/nd`" = ghép `/api/nd` vào cùng gốc; ghi rõ ở đầu tệp).
  - `api.js` thêm MỘT hàm `goiKho(duongDayDu, phuongThuc, than, ve)`: nhận `FormData` (ảnh) hoặc JSON; CHỈ gắn `Authorization: Bearer <ve>` do khoNoiDung đưa — KHÔNG đọc `docToken()`.
    `goi()` (của `/api/kh`) không bao giờ nhận vé: vé không có lối vào `goi`. Trả `{ status, code, error }` như `loiApi`. ~20 dòng.
  - Vé: `sessionStorage['nd_ve'] = { ve, het_han, quyen, nguoi }`, cờ sửa `sessionStorage['nd_sua']`. Bọc try/catch (kho chặn → chỉ bộ nhớ trang). Không localStorage, không mật khẩu.
    `het_han` so với giờ — KHÔNG `new Date(chuỗi)` (CLAUDE.md §6): để máy chủ quyết, 401 là thoát; App chỉ hiện `het_han` nguyên chuỗi.
  - 401 từ `/api/nd` khi có vé → xoá vé + cờ sửa + `datLopNhap(null)` → `location.assign('/admin?tiep=<chỗ đang đứng>')`. 403 `KHONG_DU_QUYEN` → ném, màn báo nguyên `error`, giữ vé.
  - Bản khách: `napBanMay()` (đọc `localStorage['kh_nd_ban']` → `datBanNoiDung`; hỏng → bỏ) gọi ĐỒNG BỘ ở `main.jsx` trước `render` → lần vẽ đầu đã đúng chữ. `hoiBanMoi()`:
    `GET /ban-dang-chay?co=<so_ban>`; `khong_doi` → thôi; khác → `datBanNoiDung` + ghi máy; lỗi → im. Gọi một lần lúc mở + `visibilitychange` dùng `denLucKiem` + `PHUT_KIEM` của
    `src/dangKySW.js` (chỉ `import`). Không `setInterval`.
  - Hàm cửa: `dangNhapQuanTri`, `layNhap`, `luuNhap`, `boNhap`, `capNhat`, `layPhienBan`, `layMotBan`, `quayLai`, `taiAnh`, `xuatToanBo`, `nhapToanBo` — mỗi hàm 1 dòng gọi `goiKho`.
- B: `khoNoiDung.js` tự `fetch`. Bỏ: phạm K1 (phiếu B1 cấm, bộ kiểm `kiem_tra_truoc_khi_giao.js:36` chặn).

### P3. `src/noiDung/nd.js` — B3, B4, D3 (một luật), D4, F2 — ~35 dòng thêm
- **A (chọn):**
  - `export { hopLe }` (bảng sửa dùng CHÍNH hàm này).
  - B3: `anhDung(s)` = `/^\/anh\/[\w./-]+$/` (không `..`) hoặc `/^\/api\/nd\/anh\/[0-9a-f]{64}$/` — dùng cho loại `anh` VÀ trường `'anh'` trong `danhsach`. `http…`, `//…`, `data:`,
    `javascript:` → sai → `macDinh`. Trước khi viết: `grep` mọi `macDinh` ảnh của danh mục để chắc chúng đều `/anh/…` (kiemDanhMuc sẽ báo nếu không).
  - Ghép gốc ảnh kho ở MỘT chỗ: `datGocAnh(goc)` (khoNoiDung gọi lúc nạp); `ndAnh()` và trường ảnh trong `ndDs()` đổi `/api/nd/anh/<hex>` → `<goc>/anh/<hex>`. `ndDs` nhớ kết quả theo
    (bản, khoá) để mảng giữ nguyên danh tính (kehoach.js `nhoLe` WeakMap dựa vào đó).
  - F2: `danhsach` không được có hai dòng giống hệt nhau (mọi trường) — áp MỌI danh sách (đã có luật riêng cho `khoaCauTruc`). `home.feat.mon` (một trường `ma`) → trùng mã bị chặn.
  - D4: `datLopNhap(obj | null)` + tăng `phien` → người nghe vẽ lại. `lay()`: lớp nháp (nếu có, `hopLe`) → bản đang chạy → `macDinh`. Lớp nháp CHỈ do `CheDoSua` đặt.
  - B4: không đổi code (React vẽ chữ) — chỉ thêm ca thử `<img onerror>`.
- B: lớp nháp ở tệp riêng bọc `nd()`. Bỏ: màn gọi thẳng `nd()` — bọc ngoài không chen được vào thứ tự lấy.

### P4. Chặn ghi khi sửa — `src/api.js` `goi()` (D7) — ~12 dòng
- **A (chọn):** `let dangSua = false; export const datCheDoSua = (b) => { dangSua = !!b; }`. Đầu `goi()`: `dangSua && phuongThuc !== 'GET' && !DUOC_GHI_KHI_SUA.includes(duong)` → ném
  `loiApi(0, 'CHE_DO_SUA', <chữ quanTri.js>)` KHÔNG gọi `fetch`. `DUOC_GHI_KHI_SUA = ['/gio/bao-gia', '/dang-nhap/xin-ma', '/dang-nhap/xac-minh', '/gia-han']`. Chữ báo lấy từ
  `src/noiDung/quanTri.js` (K10: `api.js` không tăng chữ cứng). `CUA_CONG_KHAI` và các hàm `lay*` KHÔNG đổi.
- "Đăng xuất" khách + nút xoá dữ liệu trên máy (không qua `goi`): `CheDoSua` gắn MỘT bộ nghe `click` pha bắt (capture) trên `.phone`: phần tử bấm nằm trong `[data-nd]` có khoá thuộc
  `NUT_KHOA_KHI_SUA` (hằng ở `quanTri.js`: `tk.dangXuat` + khoá nút xác nhận xoá của `HoiXoa` / trắc nghiệm / kế hoạch — `grep` đủ lúc làm, bài thử so danh sách với nguồn) →
  `preventDefault` + `stopPropagation` + báo. Không sửa màn khách (Cấm).
- B: sửa `dangXuat` trong `App.jsx` + từng nút xoá. Bỏ: phạm Cấm (màn khách, dòng cũ App.jsx).

### P5. Đường dẫn + điểm vào (C1) — `src/duongDan.js` ~8 dòng, `src/main.jsx` ~8 dòng
- **A (chọn):** `BANG` thêm 3 dòng `{ trang: 'quantri' | 'quantrilichsu' | 'quantrikiemkhop', mau: '/admin' | '/admin/lichsu' | '/admin/kiemkhop', tab: null, quanTri: true, tieuDe: … }`;
  BỎ dòng `kiemkhop` (giuCho) + nhánh `dau === 'admin' → Trang chủ`; `/admin/<lạ>` → `/admin`. `ra()` trả thêm `quanTri`. `tiepHopLe` (đăng nhập KHÁCH) từ chối `quanTri`. `/kiemkhop`
  → `khongthay`? Phiếu C1 ghi "→ về Trang chủ": thêm `kiemkhop` vào nhánh "đường cũ → Trang chủ" (một dòng), bài thử canh.
  Thêm MỘT dòng xuất `export const DS_MAN = BANG.filter((e) => !e.quanTri && !e.giuCho)` cho "Đi tới màn" (D6) — xem Câu hỏi Q1.
  `main.jsx`: `const r = docDuongDan(location.pathname + location.search)`; `r.quanTri ? <QuanTri trang={r.trang} tiep={…}/> : <App/>`; bỏ `laKiemKhop`; `napBanMay()` trước render.
  `meta robots noindex` + tiêu đề tab: đặt trong `QuanTri.jsx` (như `KiemKhop.jsx` đang làm) — khi Chế độ sửa trên màn khách KHÔNG noindex (đó là trang khách thật).
- B: `/admin*` là trang trong vỏ App. Bỏ: vỏ App tự gọi mọi cửa khách + thanh tab hiện ở /admin (trái C1 "không nằm trên thanh tab"), sửa nhiều dòng cũ App.jsx (Cấm).

### P6. Khu quản trị — `src/pages/QuanTri.jsx` (~110), `QuanTriLichSu.jsx` (~140), `src/pages/KiemKhop.jsx` (đổi ~6 dòng) (C2, C3, E1–E3)
- **A (chọn):** `QuanTri.jsx` = cửa vào `/admin*`: chưa có vé → form đăng nhập (`POST /dang-nhap`; lỗi hiện nguyên `error`; xong → `tiep` nếu thuộc `/admin*` hoặc `/admin`);
  có vé → theo `trang`: bảng quản trị (C3: `ten_hien`, bản đang chạy `GET /ban-dang-chay`, số nháp `GET /nhap`, 5 nút; "Xuất / Nhập" chỉ khi `quyen` có `nd_xuat_nhap`) · `QuanTriLichSu` ·
  `KiemKhop` (nguyên trang cũ, chỉ bỏ dòng tự đặt title/meta trùng và đổi chú thích đầu tệp — vẫn chỉ đọc, vẫn dùng token KHÁCH của máy nếu có, như hôm nay).
  `QuanTriLichSu`: danh sách (E1), bấm một bản → `GET /phien-ban/:so` → Xem / So với bản đang chạy (mục khác: tên từ danh mục, cũ ↔ mới) / Quay lại (hỏi lại 1 lần → `POST /quay-lai`;
  409 → tải lại, báo, KHÔNG gửi lại) / Tải về máy (Blob + `<a download>`). Xuất (`GET /xuat` → Blob), Nhập (chọn tệp, ≤ 50 MB kiểm trước, `JSON.parse`, `POST /nhap-toan-bo`; 409 hiện nguyên).
  Chữ của khu quản trị ở `src/noiDung/quanTri.js` (G1, hằng — không vào danh mục).
- B: mỗi màn quản trị một đường riêng trong vỏ App khách. Bỏ: như P5-B.

### P7. Chế độ sửa — `src/components/CheDoSua.jsx` (~200), `CheDoSuaBang.jsx` (~260), `src/giaoDien/che_do_sua.css` (~70, chép demo) (D1–D8)
- **A (chọn):**
  - `CheDoSua.jsx`: chỉ mount khi có vé (App.jsx 1 dòng). Đọc cờ `nd_sua`; bật → `datCheDoSua(true)`, lớp `cms-on` trên `.phone`, tải `GET /nhap` → `datLopNhap(nháp)`. Tắt / thoát →
    `datCheDoSua(false)`, `datLopNhap(null)`.
  - Lớp phủ (portal vào `.phone`, `pointer-events:none` trừ nút): quét `[data-nd]` trong `.screens` (+ `.sheet` đang mở) → vị trí `getBoundingClientRect`; mỗi phần tử sửa được một nút ✎
    `.cms-pen`, mục khoá một nút 🔒. Ẩn nút khi phần tử rỗng kích thước / `display:none` / bị che (`elementFromPoint` tại tâm không thuộc phần tử). Vẽ lại: `scroll` (pha bắt), `resize`,
    `MutationObserver` trên `.screens`, `ngheNoiDung` — gộp bằng `requestAnimationFrame`. KHÔNG chèn nút vào cây React của màn (tránh `removeChild`). Viền vàng / viền chấm = CSS
    `.cms-on [data-nd]` (chỉ CSS, không DOM).
  - Chạm ✎ → bảng sửa (D3). Chạm 🔒 → `Thongbao`-kiểu toast với lời theo `khoaBoi` + `chiDuong`. Chạm chỗ khác → App chạy như khách (không chặn sự kiện, trừ P4).
  - Thanh `.cms-bar` (D1): nhãn N nháp / "bản X đang chạy" · "Đi tới màn" (D6: `DS_MAN`, tên = `nd(tieuDe)`; `:slug` = món đầu của menu đang có (đọc kho menu sẵn có), `:tienich` / `:dip`
    = `cho[0]`, `:ma` đơn = đơn đầu của kho `/don` nếu có, không có thì ẩn dòng; `/menu/:nhom` bỏ (đã có `/menu`)) · "Chữ của màn này" (D5: tập `man` của `[data-nd]` đang hiện →
    mọi mục `DANH_MUC` có `man` thuộc tập, kể cả mục khoá → dòng 🔒) · "Xem lại" (D8) · "Cập nhật toàn bộ (N)" (mờ khi N = 0 hoặc thiếu `nd_cap_nhat`) · ✕.
  - Xem lại (D8): mỗi nháp — tên mục, cũ ↔ mới (`<del>` / `<ins>` chữ; ảnh thu nhỏ `.cs-mini`), `nguoi`, `luc` nguyên chuỗi; "Tới chỗ này" (phần tử còn trên màn → cuộn tới + nháy;
    không → báo tên màn `man`); "Bỏ" (`DELETE /nhap/:khoa`). Ghi chú ≤ 500. "Cập nhật toàn bộ (N) · bản X+1" → `POST /cap-nhat { ban_goc: so_ban đang thấy, ghi_chu }`; 409
    `CO_BAN_MOI_HON` → tải lại `GET /nhap` + `GET /ban-dang-chay`, báo, KHÔNG tự gửi lại. Xong → `hoiBanMoi()` (bản mới áp + lưu máy).
  - `CheDoSuaBang.jsx` (D3) — MỘT thành phần sinh theo `loai`: `chu` ô một dòng + đếm `toiDa`; `doan` ô nhiều dòng; `nut` chữ + `<select>` `DICH`; `anh` chọn tệp → canvas cắt
    đúng `tiLe` + nén WebP giảm dần chất lượng tới ≤ 500 KB (chép cách `cmsPic` demo; trình duyệt không xuất WebP → JPEG) → `POST /anh` (FormData trường `anh`) → `url`; `danhsach` mỗi
    dòng các ô theo `truong` (trường `khoaCauTruc` chỉ đọc; thêm / bớt / lên / xuống chỉ khi KHÔNG có `khoaCauTruc`); `battat` công tắc. Chỗ điền `{bien}` hiện chip (bấm chip chèn vào ô).
    Nút Lưu chỉ sáng khi `hopLe(m, giaTri)` (một luật — gồm thiếu / thừa chip, trùng dòng, ảnh lạ). KHÔNG `trim`. Gõ → `datLopNhap({...nháp, [khoa]: đang gõ})` (xem trước D4).
    Lưu = `PUT /nhap { khoa, gia_tri, ban_goc }` · Bỏ thay đổi = `DELETE /nhap/:khoa` (404 coi như đã bỏ) · Về mặc định = Lưu `macDinh` · Xong = đóng. Mở bảng → `GET /nhap` lại:
    nháp của khoá khác bản đang mở (`luc` khác lúc mở trước) → "Người khác vừa lưu chỗ này lúc …".
  - CSS: chép NGUYÊN các dòng `.cms-*` / `.cs-*` demo cần dùng (bỏ dòng video, YouTube, `.cs-todo` không dùng) vào `src/giaoDien/che_do_sua.css`, nạp trong `CheDoSua.jsx`
    (import CSS — không sửa main.jsx thêm) → K9. Lớp phủ nút ✎ dùng đúng `.cms-pen` demo.
- B: bảng sửa viết tay theo từng màn như demo `cmsOpen`. Bỏ: trái §11 "bảng TỰ SINH", nhiều dòng hơn.

### P8. Sửa còn nợ (F1, F2)
- **F1 A (chọn):** `src/kehoach.js:37` đổi regex TÊN thành tập NGÀY ÂM cố định `KHONG_VAO_SAP_TOI = new Set(['1/1', '2/1', '3/1', '5/5', '15/7', '15/8'])` (Tết, Đoan ngọ, Vu Lan,
  Trung thu — đúng 4 lễ regex cũ bắt theo bảng `kh.leAmLich` mặc định); `holList` gắn thêm `am: 'd/m'` cho lễ âm; dòng 154 lọc `!KHONG_VAO_SAP_TOI.has(h.am)`. Đổi tên ở /admin →
  vẫn lọc; ~4 dòng. `src/noiDung/nd/keHoach.js` không đổi.
  - B: thêm trường `sapToi` (cấu trúc) vào `kh.leAmLich` + `khoaCauTruc`. Bỏ: `khoaCauTruc` khoá cả bộ dòng (không thêm lễ mới được — `hopLe` đòi cấu trúc thuộc `macDinh`).
  - Lưu ý: `holList` gộp lễ âm theo TÊN (`thay[n]`, kehoach.js:121) — đổi tên MỘT trong ba ngày Tết thì Tết hiện hai lần trong "ngày lễ gần nhất". Ngoài F1 → ghi `## Phát hiện`, không sửa.
- **F2:** ở P3 (luật `hopLe`) + bảng sửa chặn (P7). Ca thử: bản có `home.feat.mon` trùng mã → `ndDs` trả `macDinh`.

### P9. Bài thử + đột biến (G3, G4) — `cong_cu/thu_KHADMIN1.js` (~550), `viec/KH-ADMIN-1/dot_bien_tay.js` (~60)
- Phần 1 (luôn chạy, cả `KHONG_TRINH_DUYET=1`): nạp thẳng `nd.js`, `duongDan.js`, `khoNoiDung.js` (giả `fetch`, `localStorage`, `sessionStorage`, `document` tối thiểu — như các bài
  thử cũ), đọc nguồn. Phần 2 (Chromium 390, kho giả dựng TỪ khối `HOP_DONG_ND_MAY_DOC` + POS `/api/kh` giả chép của `thu_KHMUA1b`): luồng G3 đầy đủ + ảnh G6.
- Bài cũ phải sửa (đỏ trên code đã vá nếu không sửa): `thu_KHLINK1.js:64,84,123` (`/admin` → Trang chủ), `thu_KHKHOP1.js:100-113` (`/kiemkhop` công khai, `main.jsx` chọn KiemKhop,
  "không file nào khác nhắc kiemkhop"), có thể `thu_KHPWA1.js:83`. Ca MỚI của chúng (vd "`/admin` là trang quản trị", "`/kiemkhop` → Trang chủ") ĐỎ trên gốc → không cần
  `## Bài thử cũ sửa` (A11). Nếu lúc làm có bài cũ đổi mà vẫn xanh trên gốc → dừng, gom MỘT câu hỏi (bước 4 skill).

## 2. Ca thử ↔ Nghiệm thu (1-1)
| Mục | Ca (thu_KHADMIN1.js trừ khi ghi khác) | Phần |
|---|---|---|
| A1 | sha256 tệp thiết kế = `836eb6ba…`, bằng từng byte bản trong `viec/` | 1 |
| A2 | mọi cặp cửa trong `khoNoiDung.js` ∈ `cua[]`; mọi `code` App so riêng ∈ `ma_loi`; `GIOI_HAN` = `gioi_han` từng số | 1 |
| B1 | `DIA_CHI_KHO` theo `VITE_ND_API` / suy từ `VITE_POS_API`; `fetch` chỉ ở `api.js` (K1); `goiKho` không gửi token khách (đặt `kh_token` → yêu cầu `/api/nd` không có nó); `goi` không gửi vé (đặt vé → yêu cầu `/api/kh` không có nó) | 1 |
| B2 | `napBanMay` đồng bộ: sau gọi `nd()` = chữ bản máy (trước render); `khong_doi` → không ghi máy; bản mới → `datBanNoiDung` + ghi `kh_nd_ban`; lỗi mạng → giữ bản cũ, không ném; quay lại < 30 phút không hỏi, ≥ 30 hỏi một lần; `luuMay.xoaTatCa` / `doiKhach` KHÔNG xoá `kh_nd_ban` | 1 |
| B3 | `http://…`, `//x`, `data:…`, `javascript:…`, `/anh/../x`, `/api/nd/anh/abc` (không đủ 64) → `macDinh`; `/anh/a.webp`, `/api/nd/anh/<64 hex>` nhận; ảnh kho ghép gốc ở `ndAnh` + trường ảnh `ndDs` | 1 |
| B4 | bản có chữ `<img src=x onerror=…>` → Chromium: hiện nguyên chữ, không có `<img>` mới, không chạy | 2 |
| C1 | `/admin`, `/admin/lichsu`, `/admin/kiemkhop` → `quanTri`; `/kiemkhop` → Trang chủ; `tiepHopLe('/admin')` = ''; không tệp màn khách nào nhắc `/admin` (đọc nguồn); Chromium: `meta robots noindex` ở `/admin*`; chưa vé vào `/admin/lichsu` → đăng nhập → về `/admin/lichsu` | 1+2 |
| C2 | vé chỉ `sessionStorage['nd_ve']`, `localStorage` không có vé / mật khẩu; `SAI_DANG_NHAP`, `QUA_NHIEU_LAN` hiện nguyên `error`; 401 giữa chừng → về đăng nhập quản trị, nháp ở kho còn; 403 → báo, vé còn | 1+2 |
| C3 | bảng quản trị hiện `ten_hien`, bản, số nháp; nút Xuất / Nhập ẩn khi thiếu `nd_xuat_nhap`; "Thoát quản trị" xoá vé + cờ sửa | 2 |
| D1 | thanh: nhãn N / bản X; "Cập nhật toàn bộ" mờ khi N = 0 và khi thiếu `nd_cap_nhat`; tải lại trang → còn Chế độ sửa | 2 |
| D2 | mỗi `[data-nd]` hiện có ĐÚNG một ✎ (khoá: 🔒); phần tử ẩn không có bút; chạm thẻ món → mở món (không mở bảng); chạm 🔒 giá → "🔒 Lấy từ POS — sửa ở …"; đổi màn / cuộn → bút đi theo; không lỗi `removeChild` trong console | 2 |
| D3 | sinh đủ 6 loại bảng (chu, doan, nut, anh, danhsach, battat); thiếu / thừa chip → Lưu mờ; dấu cách cuối được gửi nguyên trong `PUT /nhap`; danh sách trùng → Lưu mờ; trường `khoaCauTruc` chỉ đọc; "Người khác vừa lưu" khi nháp đổi; Về mặc định gửi `macDinh` | 1 (hopLe) + 2 |
| D4 | `datLopNhap` chỉ ảnh hưởng khi đặt; Chromium: gõ → chữ trên màn đổi ngay; ngữ cảnh khách mới (không vé) → không thấy nháp; tắt sửa → về bản đang chạy | 1+2 |
| D5 | "Chữ của màn này" ở Trang chủ chứa mọi mục `man` = Trang chủ (kể cả `battat` `hien.*`, chữ thông báo) — so với lọc `DANH_MUC` | 2 |
| D6 | "Đi tới màn" đủ mọi `DS_MAN` (trừ cần tham số không có); bấm "Món" → `/mon/<món đầu>` | 2 |
| D7 | khi sửa: `POST /don`, `/nhan-diem`, `PUT /pin`, `PUT /toi`, `POST /don/:ma/huy` KHÔNG tới `fetch` + báo; GET, `/gio/bao-gia`, `/dang-nhap/xin-ma`, `/dang-nhap/xac-minh`, `/gia-han` CÓ tới (K5); hết sửa → ghi chạy lại; Chromium: "Đăng xuất" bị khoá, nút đặt đơn báo khoá | 1+2 |
| D8 | Xem lại: đủ nháp, cũ ↔ mới; Cập nhật gửi `ban_goc` đúng; 409 → tải lại, báo, KHÔNG gửi `POST /cap-nhat` lần hai; ghi chú > 500 chặn; xong → `kh_nd_ban` = bản mới | 2 |
| E1 | danh sách bản: số, lúc, người, tóm tắt, ghi chú, "đang chạy", "từ bản X" | 2 |
| E2 | Xem / So (đúng mục khác) / Quay lại (hỏi 1 lần → `POST /quay-lai` đúng `so`, `ban_goc`; 409 không gửi lại) / Tải về (tệp JSON) | 2 |
| E3 | Xuất → tải tệp; Nhập kho trống → `POST /nhap-toan-bo`; 409 `KHO_DA_CO_DU_LIEU` hiện nguyên lời; tệp > 50 MB chặn trước; ẩn khi thiếu quyền | 2 |
| F1 | bản đổi tên "Tết Trung thu" → "Rằm tháng Tám" → `sapToi` vẫn không có lễ đó; đối chứng: lễ khác (Giỗ Tổ) vẫn vào | 1 |
| F2 | `home.feat.mon` bản có `[{ma:'A'},{ma:'A'}]` → `ndDs` = `macDinh`; `kiemDanhMuc(DANH_MUC)` vẫn rỗng | 1 |
| G1 | `quanTri.js` không vào `DANH_MUC`; K10 (`no_chu_cung.txt`): tệp mới 0, tệp cũ không tăng | 1 + `npm test` |
| G2 | K9 (màu / phông chỉ của demo), K6 (không thư viện mới) | `npm test` |
| G3 | toàn bộ bài này, cả `KHONG_TRINH_DUYET=1` (phần 2 in BỎ QUA); luồng Chromium chính G3 | 1+2 |
| G4 | `dot_bien_tay.js` ≥ 11 đột biến (danh sách §3) — mỗi cái làm bài ĐỎ | tay |
| G5 | `/ra-soat` mục bảo mật riêng (vé, trộn vé / token, XSS, chặn ghi, dữ liệu khách, quyền) + `## Phát hiện` CORS bản xem thử | `/ra-soat` |
| G6 | ảnh 390 các màn quản trị + Chế độ sửa → `so_anh/` + `doi_chieu_demo.md`; Trang chủ / Menu / Ưu đãi trước ↔ sau (không vé) = 0 điểm khác | công cụ so ảnh ở nháp |
| G7 | `npm test`, `--day-du`, `cong.js tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; dòng `HEAD ĐÃ KIỂM` | lệnh |
| G8 | 5 thao tác tay của chủ quán ghi trong báo cáo (sau gộp — CORS) | tay |

## 3. Đột biến tay (G4) — `viec/KH-ADMIN-1/dot_bien_tay.js`
`BV-GUI-TOKEN-KHACH-SANG-ND` · `VS-VE-VAO-LOCALSTORAGE` · `BV-KHACH-THAY-NHAP` (lớp nháp bật khi không vé) · `BV-BO-CHAN-GHI-KHI-SUA` · `VS-CHAN-CA-BAO-GIA` (K5: chặn cả `/gio/bao-gia`) ·
`VS-NHAN-ANH-HTTP` · `VS-CAT-KHOANG-TRANG` (`trim` khi Lưu) · `BV-BO-KIEM-CHIP` · `VS-409-TU-GUI-LAI` · `VS-XOA-KH_ND_BAN-KHI-DANG-XUAT` · `BV-KIEMKHOP-CONG-KHAI` ·
`BV-SAP-TOI-THEO-TEN` · `BV-BO-CHAN-TRUNG-DANH-SACH` · `VS-GUI-VE-SANG-API-KH`. Nhóm hàm thuần bắt được cả `KHONG_TRINH_DUYET=1`; nhóm cần Chromium chạy với `--trinh-duyet` (như KH-THE-1).

## 4. Đường song song phải canh
- Hai lối ghi bản khách: `hoiBanMoi` (mở / quay lại) và sau "Cập nhật toàn bộ" / "Quay lại" — cùng MỘT hàm `hoiBanMoi` → `datBanNoiDung` + ghi máy.
- Hai lối gọi mạng: `goi` (`/api/kh`, token khách) và `goiKho` (`/api/nd`, vé) — không hàm nào đọc thứ của bên kia (ca B1 hai chiều + 2 đột biến).
- Mọi lối GHI `/api/kh`: 15 hàm xuất ở `api.js` — chặn ở `goi` nên mọi hàm qua đó (ca D7 duyệt hết hàm không phải GET bằng cách gọi từng hàm xuất).
- Dọn quản trị: "Thoát quản trị", 401 `/api/nd`, ✕ tắt sửa — cả ba qua MỘT hàm `thoatSua(xoaVe)`.
- Ảnh: loại `anh` và trường `anh` trong `danhsach` — cùng `anhDung`.
- K5 (luồng hợp lệ KHÔNG bị chặn): khách thường (không vé) đặt đơn / nhận điểm / đăng xuất bình thường (ca đối chứng D7 khi `dangSua=false`, và Chromium ngữ cảnh khách); báo giá + đăng nhập
  khách khi sửa vẫn chạy; nút / thẻ / tab vẫn chuyển màn khi sửa; bản lưu máy hỏng không vỡ App.

## 5. Ước lượng
App ~1.050 dòng (khoNoiDung 130, api +32, nd +35, duongDan +8, main +8, App +2, kehoach +4, KiemKhop ±6, QuanTri 110, QuanTriLichSu 140, CheDoSua 200, CheDoSuaBang 260, css 70,
quanTri.js 60) — trong ngân sách ~1.100. Thử ~600 (+ sửa vài ca bài cũ).

## 5b. Sửa sau soát của agent phụ (đã đối chiếu code — THẮNG các dòng tương ứng ở §1–§4)
- **P4 chặn ghi — lỗi thật của bản đầu:** ném `loiApi(0, …)` làm `datDon.loaiLoi` (`src/datDon.js:112-115`) coi là `'khong_biet'` → `guiDonAnToan` tự gửi lại rồi kẹt bản ghi
  `kh_don_gui` "chưa rõ". Sửa: ném `loiApi(423, 'CHE_DO_SUA', …)` (4xx có `code`, không thuộc `LUOT_GUI_LAI`) → `'chua_tao'`, không ghi kẹt. Ca thử: `loaiLoi(lỗi chặn) === 'chua_tao'`;
  Chromium: bấm đặt đơn khi sửa → `kh_don_gui` không ở trạng thái chưa rõ, POS giả không nhận `POST /don`. Đột biến thêm `VS-CHAN-GHI-STATUS-0`.
- **Cờ chặn ghi bật ĐỒNG BỘ:** `khoNoiDung.napBanMay()` (gọi ở `main.jsx` trước render) đọc cờ `nd_sua` + vé từ sessionStorage và gọi `datCheDoSua(true)` + nạp lớp nháp rỗng trước
  lần vẽ đầu — effect của màn (vd Ưu đãi nhận mã `?ma=`) không kịp gửi trước cờ. `CheDoSua` chỉ tải nháp và vẽ lớp phủ.
- **401 khi đang sửa trên màn khách:** về `/admin?tiep=<đường đang đứng>`; `QuanTri` nhận `tiep` là `/admin*` HOẶC đường khách hợp lệ (`tiepHopLe`) — khách thì đăng nhập xong bật lại sửa
  và `location.assign(tiep)`; lạ / ra ngoài (`//x`, `http…`) → `/admin`. Ca thử cả hai + ca `tiep` ra ngoài.
- **Tiêu đề `/admin*`:** `khungChung.js` bị Cấm → dòng BANG `/admin*` KHÔNG có `tieuDe`; `QuanTri` tự đặt tiêu đề tab từ `quanTri.js`; nhánh `/admin/kiemkhop` dùng `nd('tieuDe.kiemkhop')`
  (khoá cũ vẫn có người dùng, không mồ côi). `tieuDeTrang` không bao giờ gọi với trang quản trị (vỏ App không mount ở `/admin*`) — ca thử canh.
- **Bảng sửa / Xem lại / Đi tới màn mang `role="dialog"`** → `dangKySW.coTheTaiLai` (`src/dangKySW.js:7`) không tự tải lại khi đang gõ. Ca thử Chromium: bảng mở → `[role=dialog]` có.
- **`hoiBanMoi` trong bài Chromium cũ:** nhiều bài tự dựng App (`thu_KHND3*` đặt `window.__datBan`, `thu_KHNHANH1.js:309,365` đếm yêu cầu). Mặc định bản dựng không có `VITE_ND_API`
  ⇒ gốc kho suy từ `VITE_POS_API` của bài → bài cũ đếm thêm `GET /api/nd/ban-dang-chay`. Xử lý: khi chạy lúc làm, bài nào lệch → sửa bài (Phạm vi có `cong_cu/thu_*.js`): bỏ qua đường
  `/api/nd/` khi đếm, POS giả trả `khong_doi`. Nếu bài sửa vẫn xanh trên gốc → gom MỘT câu hỏi `## Bài thử cũ sửa` (bước 4 skill).
- **Bài cũ sẽ đổi (bổ sung):** `thu_KHPWA1.js:252-253` (so nguyên văn dòng dựng `main.jsx` — dòng đó đổi), `thu_KHUI3b.js:431-434` (F1 mở `/kiemkhop` → đổi sang `/admin/kiemkhop`
  có vé giả). `thu_KHPWA1.js:83` là ca của `public/sw.js` — không đổi (public Cấm).
- **Ca thử thêm vào §2:** A2 quét cả chuỗi mẫu `` `/nhap/${…}` `` và `code` ở `CheDoSua*.jsx` / `QuanTri*.jsx`; B2 không `setInterval` / không hỏi lần hai khi chưa tới 30 phút, Chromium: chữ
  bản máy có ngay ở lần vẽ đầu (đọc DOM ngay sau `load`, chặn yêu cầu `/api/nd`); C2 sessionStorage không có mật khẩu; C3 nút "Bật Chế độ sửa" → `/trangchu` có `.cms-bar`, nút
  "Kiểm khớp POS" → `/admin/kiemkhop`; D1 ✕ tắt → không còn `.cms-bar`, lớp nháp bỏ; D3 ảnh (canvas ra đúng `tiLe`, ≤ 500 KB, FormData trường `anh`, `url` vào giá trị), "Bỏ thay đổi"
  gửi `DELETE /nhap/<khoá>`, `nut` chọn `DICH`; D5 thêm Kế hoạch / Giờ vàng: có khoá trả chuỗi `gv.ghi.*` / `thu.t2…`, chữ `Thongbao`; D6 bấm màn cần đăng nhập khách → `/dangnhap?tiep=`;
  D7 thêm `/nhan-ma-bill` và nút xác nhận xoá (`NUT_KHOA_KHI_SUA` so với nguồn); D8 "Tới chỗ này" cuộn tới phần tử, "Bỏ" gửi `DELETE`.
- **Rút gọn:** gộp `QuanTriLichSu` vào `QuanTri.jsx` nếu tệp ≤ ~300 dòng (còn quá thì tách theo việc); `KiemKhop.jsx` để nguyên (0 dòng) — `QuanTri` lo tiêu đề / meta ở nhánh này
  (trang cũ tự thêm meta noindex — trùng vô hại; đầu tệp đã ghi KH-ADMIN-1 — bài `thu_KHKHOP1.js:113` canh).
- **Phát hiện (ngoài phạm vi, ghi `trang_thai.md`):** `public/sw.js:17` còn nhắc `/kiemkhop`, không loại `/admin`; `kh.leQua` (`src/noiDung/nd/keHoach.js:116`) khớp lễ theo TÊN —
  đổi tên lễ ở /admin thì mất gợi ý quà.

## 6. Câu hỏi / điểm xin duyệt cùng kế hoạch
- Q1 `src/duongDan.js`: ngoài các dòng `/admin*` và bỏ `/kiemkhop`, cần MỘT dòng `export const DS_MAN = …` (danh sách màn cho "Đi tới màn", D6 ghi "danh sách màn từ bảng `src/duongDan.js`").
  Phiếu Cấm ghi "CHỈ thêm dòng `/admin*` + bỏ `/kiemkhop`" — xin cho thêm dòng xuất này (không đổi dòng cũ nào của bảng).
- Q2 `/kiemkhop` sau khi đóng: phiếu C1 ghi "→ về Trang chủ" — làm `thay` về `/trangchu` (không phải màn "Không tìm thấy"). Đúng ý?
- Q3 `/admin/kiemkhop` giữ nguyên cách hỏi POS bằng token KHÁCH đang có trên máy (như trang cũ) — không dùng vé quản trị (vé `/api/nd` không dùng được ở `/api/kh`). Đúng ý?
- Q4 Nút khoá khi sửa (D7 phần không qua mạng): chặn theo danh sách khoá `data-nd` (`NUT_KHOA_KHI_SUA` ở `quanTri.js`) bằng bộ nghe pha bắt — không sửa màn khách. Nút xoá nào chưa có
  `data-nd` thì không chặn được ở việc này → ghi `## Phát hiện` (việc sau gắn `data-nd`).
- Q5 `src/duongDan.js` — ngoài thêm dòng, phải đổi 3 chỗ cũ có liên quan /admin: nhánh `dau === 'admin' → Trang chủ` (dòng 83, bỏ), `ra()` (dòng 70, thêm cờ `quanTri`), `tiepHopLe`
  (dòng 55, từ chối trang quản trị cho đăng nhập KHÁCH). Xin cho đổi ba chỗ này (đều thuộc /admin).
- Q6 `src/dangKySW.js` — phiếu ghi "chỉ `import` hằng"; kế hoạch import thêm HÀM thuần `denLucKiem` (không sửa tệp) để dùng đúng một luật "quay lại ≥ 30 phút". Xin cho.
