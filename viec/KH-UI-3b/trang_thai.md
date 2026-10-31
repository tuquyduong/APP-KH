# Trạng thái KH-UI-3b

## Đối chiếu bản chụp (bước 1 của /lam-viec)
- Nhánh `viec/KH-UI-3b`; cây sạch (chỉ file chưa theo dõi); `git fetch origin viec/KH-UI-3b`: HEAD `9ee865b` = FETCH_HEAD `9ee865b` (không cần kéo).
- `git log --oneline -3` lúc mở:
  - `9ee865b PHIEU: KH-UI-3b`
  - `4a4f396 TIEN-DO: mo KH-UI-3b (v3 con lai); them KH-UI-3d; luu yeu cau POS 31.10 e (KH-QUAY-2) - so v16`
  - `b356bb3 TIEN-DO: KH-KHOP-1 xong (PR #10 3cf6288); luu tra loi POS 31.10 c + d, yeu cau c + d; so v15`

## Câu hỏi
1. **Bài thử cũ sửa** (cổng A11 có thể đòi mục `## Bài thử cũ sửa` trong phiếu — máy không sửa phiếu): sáu bài cũ trong Phạm vi đã sửa theo thay đổi CÓ CHỦ Ý của phiếu (hợp đồng v3). Cả sáu ĐỎ trên code gốc, XANH sau vá (log ở `bang_chung_do.txt`), nên không phải "sửa mà vẫn xanh trên gốc":
   `thu_KHKHOP1.js` (401 ở cửa `tuy_chon` không còn là "chờ KH-API-3"; việc POS KH-API-3 không còn trong danh sách chờ) · `thu_KHXEM1.js` (`chonMenu` hết `canDN`; có cửa gia hạn) ·
   `thu_KHLINK1.js` (Trang món hết thẻ mời) · `thu_KHUI2.js` (`loiChao` 3 tham số) · `thu_KHLUU1.js` (lời chào dùng tên ngắn: "Chào thử") · `thu_KHUI3a.js` (D4: bản menu công khai GIỮ `gia_hang`, theo E2).
2. **Tên rỗng mà có xưng hô** — phiếu C2 ghi "Chưa có tên → 'bạn'" nhưng nếu máy làm đúng chữ thì ra "Chị bạn" / "Bạn bạn". Tôi chọn: có xưng hô mà chưa có tên → chỉ xưng hô ("Chào buổi sáng, Chị"); không có cả hai → "bạn". Bài thử khoá cách này (`C2 chưa có tên`). Chủ quán muốn khác thì nói.

## Quyết định nhỏ (ghi để chủ quán đối chiếu)
- A2: ca "POS còn đòi đăng nhập ở /menu → ⏳ chờ KH-API-3" của `thu_KHKHOP1.js` (và nhánh `trangThaiMuc` tương ứng ở `src/kiemKhop/kiemKhop.js`) canh hành vi v2 → sửa: v3 trả 401 ở /menu chỉ khi gửi token sai → hiện ✗ như lỗi thật.
- A1: bản `thiet_ke/HOP_DONG_API_KH.md` mới = `hop_dong_v3.md` từng byte (`cmp`), nên MẤT ba dòng đầu "BẢN CHÉP NGUYÊN VĂN…" của bản cũ — đúng yêu cầu "không sửa chữ nào".
- E1: `/menu` mở bằng token sai → `api.js` xoá token và gọi hết phiên → `donPhien` đưa về Trang chủ (hành vi sẵn có cho mọi cửa 401). Khách thấy Trang chủ, bấm Menu là thấy menu (bài thử E3 khoá đúng luồng này). `dungMenu` bỏ qua lỗi 401 đó (không chớp chữ lỗi) và tự gọi lại không token.
- G2: đăng ký 3 bước KHÔNG lệch hợp đồng v3 (POS giả ca G1: khách mới, 3 lỗi bước 3 giữ chữ, khách cũ — đều xanh trên code gốc) → không đổi code đăng ký.
- Lưu ngày gia hạn: `kh_gia_han` nằm trong `KHOA_DU_LIEU` (xoá khi Đăng xuất / đổi khách) VÀ trong `KHOA_VANG_LAI` (không bị coi là "dữ liệu chưa biết của ai", để việc gia hạn trước khi biết khách không xoá nhầm dữ liệu).
- Công cụ chụp demo đặt ở `viec/KH-UI-3b/so_anh/chup_demo.js` (không phải nháp) vì người gác chỉ cho chạy script có trong lịch sử commit.
- Soát kế hoạch bằng agent phụ (bước 3) gộp vào `/ra-soat` ở bước 8.

## Phát hiện (ngoài phạm vi, không sửa)
- `thiet_ke/DOI_CHIEU_TINH_NANG.md` (ngoài Phạm vi) có thể còn ghi các dòng chờ KH-API-3 — chat App KH rà lại khi đóng việc.
- Màn Tài khoản chưa hiện "Chị <tên>" như `accName` của demo (phiếu chỉ đòi dòng phụ B6) — để việc sau nếu chủ quán muốn.
- Nút `hq-b` ("Lưu tên", "Lưu địa chỉ") hiện viền tối quanh nút trong ảnh `so_anh/ung-dung_thong-tin-ca-nhan_360.png` — kiểu nút có sẵn từ KH-XEM-1, chưa đối chiếu với demo (demo lưu khi rời ô, không có nút); chủ quán xem ảnh rồi quyết.

## Bảng chỗ vá → đột biến (`viec/KH-UI-3b/dot_bien.py`, chạy `python3 viec/KH-UI-3b/dot_bien.py`; 10/10 ĐỎ)
| Chỗ vá | Đột biến | Kết quả |
|---|---|---|
| D1 tối đa một lần mỗi ngày (`giaHan.js`) | VS-GIA-HAN-HAI-LAN-MOT-NGAY | ĐỎ (53·3) |
| D2 thất bại im lặng, không ghi ngày | VS-GIA-HAN-GHI-NGAY-KHI-LOI | ĐỎ (47·9) |
| D2 không làm sống lại phiên đã đăng xuất | VS-GIA-HAN-SONG-LAI-PHIEN | ĐỎ (55·1) |
| D3 khoá `kh_gia_han` theo luật xoá của `luuMay.js` | BV-KHOA-GIA-HAN-NGOAI-LUU-MAY | ĐỎ (54·2) |
| C2 lời chào lấy giờ POS, không đồng hồ máy (`TrangChu.jsx`) | VS-CHAO-DUNG-DONG-HO-MAY | ĐỎ (55·1) |
| C1 mốc giờ (`dinhDang.js`) | VS-CHAO-MOC-SANG-SAI | ĐỎ (55·1) |
| B2/B5 thân `PUT /toi` chỉ có khoá được sửa (`HoSo.jsx`) | VS-PUT-GUI-CA-KHOA-KHONG-DOI | ĐỎ (167·6, Chromium) |
| E1 `/menu` 401 không chớp chữ lỗi (`dungMenu.js`) | VS-MENU-401-HIEN-LOI | ĐỎ (55·1) |
| E2 bản menu công khai giữ `gia_hang` (`dungMenu.js`) | VS-MENU-LUU-BO-GIA-HANG | ĐỎ (55·1) |
| F1 /kiemkhop đọc lại đăng nhập mỗi lần kiểm | BV-KIEMKHOP-DOC-LAI-DANG-NHAP | ĐỎ (55·1) |

## Đếm từng mục nghiệm thu (bằng chứng: ca trong `cong_cu/thu_KHUI3b.js` — chạy đủ 173 đạt · 0 hỏng; KHONG_TRINH_DUYET=1: 56 đạt · 0 hỏng)
- A1 `A1 … từng byte` (cmp) · A2 4 ca `A2` + `thu_KHKHOP1.js` (84 đạt) · A3 K8 xanh trong `npm test`
- B1 ca `B1 [360/390/430 × 100%/130%]` + `hoso-loi-xung-ho` + `hoso-chua-xung-ho` · B2 ca `B2` · B3 ca `B3` (ô trống gửi "", DIA_CHI_QUA_DAI giữ chữ) · B4 4 ca `B4` · B5 5 ca `B5` · B6 ca `B6`
- C1–C3, C5 ca `C1`/`C2`/`C3` (hàm thuần, mốc giờ đủ biên) + `chao-360/390/430`, `chao-khach`, `chao-chua-bay-gio` · C4 ca `chao-doi-xung-ho`
- D1–D4 các ca `D1`/`D2`/`D3`/`D4` (Phần 1 fetch giả + ca `gia-han`, `gia-han-429`, `chao-khach` ở Chromium)
- E1 ca `E1` ×4 · E2 ca `E2` ×2 + `menu-mo-lai-tu-ban-luu` · E3 ca `menu-token-sai`, `menu-khach-bac-gia`, `menu-mo-lai-pos-hong`
- F1 ca `F1` ×3 (Chromium, chờ khoá 5 giây) · F2 6 ca `F2` (đo bằng `measureText`) + ca K9 "không đổi màu/phông/cỡ chữ"
- G1 ca `G1` ×7 (Chromium) · G2 không lệch → không đổi code
- H1 file `cong_cu/thu_KHUI3b.js` hai phần, `KHONG_TRINH_DUYET=1` → BỎ QUA phần 2 · H2 `doi_chieu_demo.md` + `so_anh/` · H3 10 đột biến (≥ 4 VS: 7 VS + 3 BV) · H4 xem "Thử tay" dưới.

## Báo cáo 7 mục
1. **VIỆC**: KH-UI-3b — phần v3 còn lại: hồ sơ xưng hô + địa chỉ, lời chào theo xưng hô, tự gia hạn đăng nhập, menu công khai, sửa nhỏ `/kiemkhop` và `.hb-k`.
2. **ĐÃ SỬA**: hợp đồng v3 chép byte-đúng; `canTuPos.js` + `kiemKhop.js` theo v3; `api.js` (`suaHoSo`, `giaHan`); `dinhDang.js` (lời chào + 4 mã lỗi); `bayGio.js` (`coBayGio`); `giaHan.js` mới; `luuMay.js`;
   `HoSo.jsx` (3 thẻ), `TaiKhoan.jsx`, `TrangChu.jsx`, `App.jsx` (gia hạn); gỡ canDN / thẻ mời ở `menuLuu.js`, `dungMenu.js`, `Menu.jsx`, `MonTheoDuong.jsx`, `dangNhap.js`; `KiemKhop.jsx`; CSS `pf-chips`/`pf-prev` (chép demo) + `.hb-k{line-height:1.7}`. Số dòng app: +203 / −75 (ngân sách ~220 — đạt); số dòng thử: +504 / −14 (ngân sách ~320 — VƯỢT: phiếu đòi Phần 2 phủ B·C4·D·E3·F1·G1 ở 3 cỡ màn × chữ 130%, dựng POS giả v3 và đo `.hb-k`).
3. **BÀI THỬ**: `thu_KHUI3b.js` 173 đạt · 0 hỏng (đủ Chromium), 56 (không trình duyệt); 6 bài cũ sửa theo v3; `npm test` 26 đạt; `--day-du` 28 đạt (vite build OK); 10 đột biến đều ĐỎ.
4. **ĐÃ RÀ K4**: mọi chỗ `canDN` / `THE_MOI_MENU` / `doiTen` / `boGiaHang` / `loiChao(` / `kh_menu` / gọi `/toi` được `grep` toàn `src/` và `cong_cu/` (bài E1 canh); mọi lời gọi mạng vẫn chỉ qua `api.js`.
5. **CHƯA KIỂM**: POS thật (chỉ POS giả theo hợp đồng v3 — `/kiemkhop` ngoài đời là phép kiểm thật); Safari / trình duyệt Zalo (chỉ Chromium); ảnh so sánh thiếu hình nền do POS giả trả 204 cho file tĩnh; cổng `node tu_chay/cong.js chay` (xem dòng cổng bên dưới).
6. **GIT**: nhánh `viec/KH-UI-3b`, đã push; không PR, không merge; commit theo từng nhóm A·F1 / B / C / D / E·F2 + bài thử.
7. **BÀI HỌC**: xem `## Bài học`.

## Thử tay cho chủ quán (H4 — 3 bước trên điện thoại)
1. Tài khoản → Thông tin cá nhân → chọn "Chị" → về Trang chủ: thấy "Chào buổi …, Chị <tên>".
2. Nhập địa chỉ → "Lưu địa chỉ" → tải lại trang: địa chỉ còn; POS (chi tiết khách) thấy cùng địa chỉ.
3. Đăng xuất → mở Menu: thấy menu và giá các hạng, không thẻ mời đăng nhập.

## Bài học
- **KHOÁ** — Phép đo `measureText` cho dấu tiếng Việt (F2): đã thành ca `F2` trong `thu_KHUI3b.js` (đỏ trước: −1.1 / −1.8px; xanh sau). Đề xuất (ngoài Phạm vi): gộp ca này thành bài chung cho mọi nhãn in hoa cỡ nhỏ khi có màn mới — thêm vào bộ K9 nếu chủ quán muốn.
- **NGUYÊN TẮC** — Lỗi có sẵn trong demo: demo cũng đo ra dòng 10.8px, nên "chép nguyên demo" không bảo đảm đúng. Ghi `## Đối chiếu` lỗi demo (lý do (f)) khi đo ra; đề xuất mở K4 trong `KHUON_LOI.md` ("chép demo vẫn phải đo bằng máy ở 360/130%") — ngoài Phạm vi, chờ chủ quán duyệt.
- **BỎ** — Người gác chặn lệnh dùng biến/`for`/`&&` sau lệnh chạy script (B-PHANTICH, B-DICHCHU, GIT-ADD -A, SED-I): đã tuân thủ (mỗi lệnh một dòng); chỉ xảy ra do cách viết lệnh, không có bài học mới.
- Dọn: không có lời dặn nào của `KHUON_LOI.md` / `CLAUDE.md` cần xoá ở việc này.
