# KH-ADMIN-1 — Khu quản trị `/admin`: đăng nhập tài khoản POS, Chế độ sửa nội dung ngay trên App (✎ / 🔒, bảng sửa tự sinh, Lưu → Cập nhật toàn bộ), phiên bản, Xuất / Nhập; khách nhận bản mới

<!-- Chat App KH soạn 14.11.2026. Việc TIỀN / BẢO MẬT [T] (đăng nhập nhân viên, vé, quyền, chặn ghi), **Opus** — CÓ "Chờ duyệt kế hoạch" (bước 3: ghi `ke_hoach.md`, push, DỪNG hỏi;
     chủ quán dán cho chat duyệt rồi gõ "duyệt" thì chạy thẳng tới hết). Hạn 20.11 (TRƯỚC khai trương ~03.12). Mở trên main SAU KHI POS gộp ND-API-1 (POS main 1a714246, PR #93).
     Chạy SONG SONG với KH-THE-2 (Opus — thẻ hội viên, sửa nhiều màn) và KH-QC-1 (Sonnet — quảng cáo) → xem mục Cấm: việc này KHÔNG sửa màn khách.
     Nguồn: CLAUDE.md §11 (luật nội dung sửa được, QĐ 10–11.11 — đọc KỸ), `thiet_ke/QUYET_DINH_APPKH.md` (10.11 → 14.11), thư App 11.11 (a) `thiet_ke/trao_doi/YEU_CAU_APPKH_GUI_POS_11112026.md`,
     thư POS 11.11 (a) `thiet_ke/trao_doi/TRA_LOI_POS_11112026_a.md`, hợp đồng RIÊNG `/api/nd` **v1** (bản gốc POS đặt sẵn ở `viec/KH-ADMIN-1/hop_dong_nd_v1.md` — người gác chặn máy tải),
     ghi chú KH-ADMIN-1 trong `TIEN_DO_APPKH.json` (các điểm tự soát 3b / 3c / 3d để lại). Demo: Chế độ sửa PATCH30–39 của `thiet_ke/app_kh_demo.html` (CSS `.cms-*`, `.cs-*`, `[data-sec]`;
     JS `cmsToggle`, `cmsDecorate`, `cmsBar`, `cmsOpen`, `cmsPic`, `cmsReview`, `cmsPublish`, `LOCK_MSG`). -->

**Chờ duyệt kế hoạch:** viết `viec/KH-ADMIN-1/ke_hoach.md`, commit, push, rồi DỪNG ở bước 3 của `/lam-viec`.

## Mục tiêu
Chủ quán (và người được cấp quyền trong Phân quyền POS) mở `tuquyduong.com/admin`, đăng nhập bằng tài khoản POS, bật Chế độ sửa rồi đi trên CHÍNH App như khách: chỗ sửa được có viền
vàng + bút ✎, chỗ của POS / App tự tính có 🔒 chỉ đường. Bấm ✎ → bảng sửa tự sinh từ danh mục → "Lưu" (nháp) → "Cập nhật toàn bộ" thành một phiên bản mới → khách thấy ở lần mở
App tới. Mọi phiên bản được giữ, xem / so / quay lại / tải về được; Xuất / Nhập toàn bộ để sao lưu và chuyển máy chủ.

## Nghiệm thu

### A. Hợp đồng `/api/nd` v1
- A1 `thiet_ke/HOP_DONG_API_ND.md` = NGUYÊN VĂN `viec/KH-ADMIN-1/hop_dong_nd_v1.md` (POS main 1a714246, PHIEN_BAN 1; sha256 bắt đầu `836eb6ba2554e82d`) — kiểm sha256, chép, `cmp` từng byte.
- A2 Bài thử đọc khối `HOP_DONG_ND_MAY_DOC`: MỌI cửa App gọi (phương thức + đường) có trong khối; mọi mã lỗi App xử lý riêng có trong `ma_loi`; giới hạn App kiểm trước (khoá, ảnh,
  ghi chú, 1 MB) lấy đúng số trong `gioi_han` (đọc từ hợp đồng hoặc hằng có tên ở MỘT chỗ có ca so với hợp đồng).

### B. Khách nhận bản nội dung mới
- B1 **MỘT tệp nói chuyện với kho:** `src/noiDung/khoNoiDung.js` — địa chỉ kho là MỘT biến (`VITE_ND_API`; thiếu → suy từ `VITE_POS_API` đổi `/api/kh` thành `/api/nd`). Lệnh `fetch`
  thật vẫn CHỈ ở `src/api.js` (K1): thêm MỘT hàm gọi kho (địa chỉ gốc riêng, vé quản trị riêng). Token khách KHÔNG BAO GIỜ gửi sang `/api/nd`, vé quản trị KHÔNG BAO GIỜ gửi sang `/api/kh`.
- B2 Mở App: đọc NGAY bản lưu trên máy (khoá `kh_nd_ban`, nội dung CÔNG KHAI — không nằm trong danh sách xoá của `luuMay.js`, giữ khi đăng xuất / đổi khách) → `datBanNoiDung` TRƯỚC lần
  vẽ đầu (không chớp chữ mặc định); rồi `GET /ban-dang-chay?co=<so_ban>` MỘT lần: `khong_doi` → thôi; bản khác → `datBanNoiDung` + lưu máy. Lỗi / không mạng → giữ bản đang có, không báo.
  Hỏi lại khi App quay lại sau ≥ 30 phút (dùng lại `PHUT_KIEM` của `src/dangKySW.js`). Không hỏi theo chu kỳ.
- B3 **Ảnh:** giá trị loại `anh` CHỈ nhận đường dẫn ảnh có sẵn của App (`/anh/…`) hoặc ảnh kho `/api/nd/anh/<64 hex>` (ghép địa chỉ kho ở MỘT chỗ khi vẽ). Giá trị khác (`http…`, `//…`,
  `data:`, `javascript:` …) → `macDinh`. Luật đặt trong `hopLe` của `nd.js` (một luật cho khách, bảng sửa, bài thử).
- B4 Chữ luôn hiện bằng CHỮ (React) — không HTML thô (đã đúng; thêm ca thử giá trị chứa `<img onerror>`).

### C. `/admin` — đăng nhập và bảng quản trị
- C1 Đường dẫn (khai ở `src/duongDan.js`): `/admin` (đăng nhập → bảng quản trị), `/admin/lichsu` (phiên bản, Xuất / Nhập), `/admin/kiemkhop` (trang Kiểm khớp POS chuyển vào đây — QĐ 31.10:
  **XOÁ đường công khai `/kiemkhop`** → về Trang chủ; `src/main.jsx` thôi dựng riêng theo pathname). Không nằm trên thanh tab, không link nào từ App khách tới; thẻ `meta robots noindex`
  khi đang ở `/admin*`. Chưa đăng nhập quản trị mà vào `/admin/*` → màn đăng nhập quản trị, xong quay về đúng chỗ.
- C2 Đăng nhập: tên đăng nhập + mật khẩu POS → `POST /dang-nhap`. Vé giữ trong **sessionStorage** (khoá riêng; đóng tab là thoát; KHÔNG localStorage, KHÔNG lưu mật khẩu). Lỗi: hiện
  NGUYÊN `error` (`SAI_DANG_NHAP`, `QUA_NHIEU_LAN` …). Vé hết hạn / 401 khi đang dùng → về màn đăng nhập quản trị (nháp nằm ở máy chủ — không mất), 403 `KHONG_DU_QUYEN` → báo, không
  thoát. `quyen[]` chỉ để ẩn / hiện nút — máy chủ quyết.
- C3 Bảng quản trị: tên người (`ten_hien`), bản đang chạy, số nháp, nút: "Bật Chế độ sửa" (→ Trang chủ, Chế độ sửa bật) · "Lịch sử phiên bản" · "Xuất / Nhập toàn bộ" (chỉ `nd_xuat_nhap`) ·
  "Kiểm khớp POS" · "Thoát quản trị" (xoá vé, tắt Chế độ sửa).

### D. Chế độ sửa (theo demo PATCH30–39; CSS chép nguyên vào tệp MỚI `src/giaoDien/che_do_sua.css`; khác demo ghi `doi_chieu_demo.md`)
- D1 Thanh `.cms-bar` nổi phía dưới (trên thanh tab): "✎ Đang sửa" + "N thay đổi chưa cập nhật" / "bản X đang chạy" · "Đi tới màn" · "Chữ của màn này" · "Xem lại" · "Cập nhật toàn bộ (N)"
  (mờ khi N = 0 hoặc không có `nd_cap_nhat`) · ✕ tắt. Chế độ sửa giữ khi tải lại trang (còn vé).
- D2 Mỗi phần tử `[data-nd]` sửa được: viền vàng + MỘT nút bút ✎ riêng; mục khoá (`[data-nd-khoa]`): viền chấm + 🔒. **Chạm ✎ mới mở bảng sửa; chạm chỗ khác App chạy như khách**
  (chuyển màn, mở món, mở tab — QĐ 11.11; KHÁC demo là demo chặn cả phần tử). Chạm 🔒 → lời khoá theo `khoaBoi` + `chiDuong` của danh mục (pos: "🔒 Lấy từ POS — sửa ở <chiDuong>",
  tutinh: "🔒 App tự tính", khach: "🔒 Dữ liệu riêng của khách"). Bút ✎ / 🔒 vẽ ở MỘT lớp phủ riêng (portal) theo vị trí phần tử — KHÔNG chèn phần tử vào nút do React quản lý
  (dễ lỗi `removeChild`); cập nhật khi cuộn / đổi màn / đổi cỡ / bản nội dung đổi. Phần tử bị che / ẩn không có bút.
- D3 **Bảng sửa TỰ SINH từ mục danh mục** (`ten`, `loai`, `toiDa`, `bien`, `goiY`, `truong`, `khoaCauTruc`, `tiLe`) — không làm tay từng màn:
  chu (ô một dòng, đếm ký tự / `toiDa`) · doan (ô nhiều dòng) · nut (chữ + chọn đích trong `DICH`) · anh (chụp / chọn → cắt đúng `tiLe`, nén WebP ≤ 500 KB bằng canvas như `cmsPic`
  của demo → `POST /anh` → `url`) · danhsach (từng dòng theo `truong`; trường trong `khoaCauTruc` chỉ đọc; thêm / bớt / đổi thứ tự khi luật cho; CHẶN dòng trùng ở MỌI danh sách) ·
  battat (công tắc). Chỗ điền `{bien}` hiện thành chip — thiếu / thừa chip thì không cho Lưu. **KHÔNG cắt khoảng trắng đầu / cuối** (vài chữ cố ý có dấu cách — tự soát 3b).
  Kiểm bằng CHÍNH `hopLe` của `src/noiDung/nd.js` (xuất ra dùng chung — một luật). Nút: "Lưu" (`PUT /nhap` — nháp, khách chưa thấy) · "Bỏ thay đổi" (`DELETE /nhap/:khoa`) ·
  "Về mặc định" (Lưu nháp = `macDinh`) · "Xong". Mở bảng → đọc lại nháp từ máy chủ: nháp khác bản đang mở (người khác vừa lưu) → báo "Người khác vừa lưu chỗ này lúc …".
- D4 **Xem trước:** trong Chế độ sửa `nd()` lấy theo thứ tự nháp → bản đang chạy → `macDinh` (gõ tới đâu trang phía sau đổi tới đó, như demo). Khách KHÔNG BAO GIỜ thấy nháp (lớp
  nháp chỉ bật khi có vé quản trị VÀ đang bật Chế độ sửa; tắt / thoát → bỏ lớp nháp).
- D5 **"Chữ của màn này":** liệt kê MỌI mục danh mục có `man` trùng với `man` của các phần tử `[data-nd]` đang hiện trên màn (tự suy từ danh mục, không bảng tay) — kể cả chữ chỉ thỉnh thoảng
  mới hiện (thông báo, lỗi), chữ ở `DauManCon` / `Thongbao`, khoá đi qua hàm trả chuỗi (`gv.ghi.*`, `thu.t2…t8` …), và công tắc ẩn / hiện khối (`battat`). Chạm một dòng → bảng sửa D3.
  (Cách này thay việc gắn `data-nd` vào `DauManCon` / `Thongbao` — không sửa màn khách, xem Cấm.)
- D6 **"Đi tới màn":** danh sách màn từ bảng `src/duongDan.js` (tên = `tieuDe`; màn cần tham số lấy giá trị có thật đầu tiên, vd món đầu tiên của menu); màn cần đăng nhập khách → đi qua
  đăng nhập khách như thường. **Trạng thái hiếm** (giỏ trống, lỗi mạng, đơn chờ trả …) KHÔNG dựng dữ liệu mẫu ở việc này — chữ của chúng sửa qua "Chữ của màn này" (đề xuất của chat 14.11
  cho gọn; dựng màn mẫu → việc sau nếu chủ quán cần).
- D7 **Nút làm thật bị khoá** khi đang sửa — MỘT chỗ chặn ở hàm `goi` của `src/api.js`: mọi yêu cầu GHI tới `/api/kh` (POST / PUT / DELETE: đặt đơn, trả, huỷ đơn, nhận mã, nhận điểm,
  PIN, sửa hồ sơ) KHÔNG gửi, báo "Đang ở Chế độ sửa — nút này chỉ để xem". ĐƯỢC gửi: mọi GET, `POST /gio/bao-gia` (chỉ báo giá, để xem màn Thanh toán đủ số),
  đăng nhập khách (`/dang-nhap/xin-ma`, `/dang-nhap/xac-minh`, `/gia-han`) để xem các màn cần đăng nhập. "Đăng xuất" khách và các nút xoá dữ liệu trên máy cũng khoá khi đang sửa.
- D8 **"Xem lại"** (như `cmsReview` demo): mỗi nháp một dòng — tên mục, cũ ↔ mới, người, lúc — + "Tới chỗ này" + "Bỏ"; ô ghi chú (≤ 500 ký tự) + nút "Cập nhật toàn bộ (N) · bản X+1" →
  `POST /cap-nhat { ban_goc, ghi_chu }`. 409 `CO_BAN_MOI_HON` → tải lại nháp + bản đang chạy, báo "Có bản mới hơn — xem lại rồi cập nhật", KHÔNG gửi lại tự động. Xong → bản mới áp ngay
  cho trình duyệt đang sửa (và lưu máy); khách thấy ở lần mở App tới.

### E. Lịch sử phiên bản + Xuất / Nhập (`/admin/lichsu`)
- E1 Danh sách (`GET /phien-ban`): số bản, lúc, người, tóm tắt, ghi chú, "đang chạy", "từ bản X".
- E2 Một bản (`GET /phien-ban/:so`): "Xem" (các mục đã sửa: tên tiếng Việt + giá trị), "So với bản đang chạy" (mục khác: cũ ↔ mới), "Quay lại bản này" (hỏi lại một lần → `POST /quay-lai`;
  409 như D8), "Tải về máy" (tệp JSON của bản đó).
- E3 "Xuất toàn bộ" (`GET /xuat` → tải tệp) · "Nhập toàn bộ" (chọn tệp → `POST /nhap-toan-bo`; chỉ khi kho trống — 409 `KHO_DA_CO_DU_LIEU` hiện nguyên lời POS). Chỉ quyền `nd_xuat_nhap`.

### F. Sửa còn nợ (sổ việc ghi trước)
- F1 `src/kehoach.js:37` `KHONG_VAO_SAP_TOI` lọc lễ theo TÊN → chủ quán đổi tên lễ ở /admin là lễ đó lọt vào "Sắp tới". Đổi sang dấu hiệu KHÔNG đổi khi sửa chữ (ngày / trường
  cấu trúc của mục danh mục ngày lễ); ca thử: đổi tên "Trung thu" trong bản nội dung → vẫn không vào "Sắp tới".
- F2 Danh sách nhập trùng (vd `home.feat.mon` trùng mã → trùng khoá React): bảng sửa chặn (D3); bản cập nhật có dòng trùng → khách dùng `macDinh` của mục đó (`hopLe`), có ca thử.

### G. Nội dung, bảo mật, kiểm
- G1 Chữ của khu quản trị (cho nhân viên, không phải khách) đặt ở `src/noiDung/quanTri.js` (hằng; KHÔNG vào danh mục, KHÔNG sửa ở /admin) → K10 không tăng (tệp mới 0).
- G2 Màu / phông / khuôn chép từ Chế độ sửa của demo (K9); không thư viện mới (cắt / nén ảnh bằng canvas).
- G3 Bài MỚI `cong_cu/thu_KHADMIN1.js` (chạy cả `KHONG_TRINH_DUYET=1`; kho giả dựng TỪ `HOP_DONG_ND_MAY_DOC`, đủ mã lỗi): B (bản máy đọc trước lần vẽ đầu; `khong_doi`; bản mới lưu máy;
  lỗi mạng giữ bản cũ; ảnh lạ → `macDinh`; chữ HTML hiện như chữ; đăng xuất / đổi khách KHÔNG xoá `kh_nd_ban`) · C (vé chỉ sessionStorage; 401 → đăng nhập lại, nháp còn; 403 không thoát;
  token khách không sang `/api/nd`, vé không sang `/api/kh`; `/kiemkhop` công khai đã đóng) · D (sinh đủ 6 loại bảng sửa; thiếu chip không Lưu; không cắt khoảng trắng; trùng danh sách
  chặn; lớp nháp chỉ khi quản trị + sửa; chặn ghi `/api/kh` khi sửa còn GET + báo giá + đăng nhập khách chạy; 409 không ghi đè; "Chữ của màn này" đủ mục theo `man`) · E (so bản, quay
  lại, nhập kho trống / 409) · F1, F2. Chromium (390): đăng nhập quản trị → bật sửa → chạm ✎ tiêu đề banner Trang chủ → gõ → trang đổi → Lưu → Xem lại → Cập nhật → mở App ở ngữ cảnh
  khách mới thấy chữ mới; khi đang sửa chạm thẻ món vẫn mở món, nút đặt đơn bị khoá; chạm 🔒 giá món → lời chỉ đường POS.
- G4 Đột biến tay (`viec/KH-ADMIN-1/dot_bien_tay.js`) ≥ 10, mỗi cái ĐỎ: gửi token khách sang `/api/nd` · lưu vé vào localStorage · khách thấy nháp · bỏ chặn ghi khi sửa · nhận ảnh `http…` ·
  cắt khoảng trắng khi Lưu · bỏ kiểm chip `{bien}` · 409 tự gửi lại / ghi đè · xoá `kh_nd_ban` khi đăng xuất · `/kiemkhop` công khai còn mở · `KHONG_VAO_SAP_TOI` theo tên.
- G5 Soát bảo mật (`/ra-soat`, mục riêng): vé (nơi giữ, hết hạn, thoát), không trộn vé / token, XSS (chữ + ảnh), chặn ghi khi sửa, không lộ dữ liệu khách, quyền chỉ để ẩn nút.
  CORS của POS chỉ nhận `tuquyduong.com` + `app-kh.pages.dev` → bản xem thử của Cloudflare (nhánh) KHÔNG gọi được `/api/nd`; thử thật sau khi gộp — ghi `## Phát hiện`.
- G6 Ảnh 390: màn đăng nhập quản trị, bảng quản trị, Trang chủ khi đang sửa (viền + ✎ + 🔒 + thanh), bảng sửa 6 loại, Xem lại, Lịch sử → `viec/KH-ADMIN-1/so_anh/` + `doi_chieu_demo.md`.
  Màn khách KHÔNG đổi khi không sửa: so trước / sau Trang chủ, Menu, Ưu đãi = 0 điểm khác.
- G7 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tăng; `trang_thai.md` + dòng `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng, không gạch đầu dòng) TRƯỚC `/ra-soat`.
- G8 Chủ quán thử tay (SAU khi gộp, trên app-kh.pages.dev/admin — CORS): (1) đăng nhập tài khoản POS; (2) bật sửa, sửa câu banner Trang chủ → Lưu → Cập nhật toàn bộ; (3) điện thoại khác
  đóng hẳn App mở lại thấy câu mới; (4) Lịch sử → quay lại bản trước; (5) POS › Phân quyền bỏ quyền "Sửa nội dung App" của một tài khoản → tài khoản đó Lưu bị từ chối ngay.

## Phạm vi
- viec/KH-ADMIN-1/**
- thiet_ke/HOP_DONG_API_ND.md
- src/noiDung/khoNoiDung.js
- src/noiDung/quanTri.js
- src/noiDung/nd.js
- src/api.js
- src/App.jsx
- src/main.jsx
- src/duongDan.js
- src/pages/QuanTri*.jsx
- src/pages/KiemKhop.jsx
- src/components/CheDoSua*.jsx
- src/giaoDien/che_do_sua.css
- src/kehoach.js
- src/noiDung/nd/keHoach.js
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHADMIN1.js
- cong_cu/thu_*.js

## Ngân sách
~1.100 dòng app (kho + nạp bản ~120, đăng nhập / bảng quản trị ~150, lớp phủ ✎ / 🔒 + thanh ~200, bảng sửa 6 loại + ảnh ~300, Xem lại / cập nhật ~120, Lịch sử / Xuất / Nhập ~150,
chặn ghi + đường dẫn + F ~60) + ~600 dòng thử. **Phương án đơn giản nhất đã xét:** bảng sửa TỰ SINH từ danh mục có sẵn + MỘT lớp nháp trong `nd.js` + MỘT tệp kho + MỘT chỗ chặn ghi ở
`api.js` + "Chữ của màn này" suy từ danh mục (không gắn thêm `data-nd` vào màn, không dựng màn mẫu). Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không (App không có DB; kho nội dung là của POS ND-API-1). Trên máy khách thêm `kh_nd_ban` (công khai); trên máy quản trị thêm vé trong sessionStorage.

## Thư viện mới
không

## Cấm
- **Chạy song song với KH-THE-2 và KH-QC-1:** KHÔNG sửa màn / thành phần khách (`src/pages/**` trừ `QuanTri*.jsx` mới + `KiemKhop.jsx`; `src/components/**` trừ `CheDoSua*.jsx` mới) —
  KHÔNG gắn thêm `data-nd` vào màn (dùng D5). `src/App.jsx` CHỈ thêm dòng riêng (đường dẫn / màn `/admin*`, gắn lớp Chế độ sửa, nạp bản nội dung lúc mở) — KHÔNG đụng phần quảng cáo,
  `muaThe`, Thanh toán thẻ, `daTra`, dòng `<TienIch …>`. `src/duongDan.js` CHỈ thêm dòng `/admin*` + bỏ `/kiemkhop` công khai. `src/api.js`: thêm hàm gọi kho + chặn ghi trong `goi`
  — KHÔNG đổi các hàm `lay*` / `CUA_CONG_KHAI` (KH-QC-1 thêm `/quang-cao`).
- KHÔNG sửa `src/quangCao.js`, `src/gio.js`, `src/datDon.js`, `src/giaHang.js`, `src/dangKySW.js` (chỉ `import` hằng), `src/luuMay.js` (`kh_nd_ban` KHÔNG vào danh sách xoá),
  `src/noiDung/nd/index.js`, tệp nhóm danh mục khác ngoài `keHoach.js` (F1), `src/tracNghiem.js`, `src/lich.js`, `public/**`, `index.html`, `thiet_ke/**` ngoài `HOP_DONG_API_ND.md`,
  `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG gọi cửa ngoài hợp đồng `/api/nd` v1; KHÔNG để App tự quyết quyền (máy chủ quyết); KHÔNG lưu mật khẩu; KHÔNG `dangerouslySetInnerHTML` / `innerHTML` với nội dung.
- KHÔNG sửa danh mục / chữ của màn khách để "cho đẹp" — việc này chỉ làm khu sửa; chữ thiếu khoá phát hiện được → ghi `## Phát hiện` (việc sau).
- Chỉ push `git push -u origin viec/KH-ADMIN-1`. Không đụng `main`, không merge, không tạo PR.
