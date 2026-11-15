# Bàn giao chat App KH (cập nhật 15.11.2026 tối)

<!-- Bản MỚI NHẤT nằm ở Project (claude/BAN_GIAO_CHAT_APPKH.md). Bản trong kho APP-KH (thiet_ke/BAN_GIAO_CHAT_APPKH.md) do script ghi-xong chép — có thể cũ hơn Project. -->

## Prompt chuyển chat (chủ quán dán nguyên văn vào chat mới, trong Project "APP KH - CLAUDE AUTONOMOUS")
> Đây là chat App KH mới, tiếp nối chat cũ. Đọc file Project `claude/BAN_GIAO_CHAT_APPKH.md` rồi làm đúng mục "Bắt đầu chat mới" trong đó. Luôn giải thích dễ hiểu câu hỏi của máy, đề xuất câu trả lời của bạn để tôi quyết định; trả lời từng bước cụ thể.

## Bắt đầu chat mới
1. Đọc hết file này. Rồi `git clone https://github.com/tuquyduong/APP-KH` (đọc được, KHÔNG có quyền GitHub API — `gh` báo 403; chỉ dùng `git fetch`). Đọc: `CLAUDE.md` (nhất là §5, §8–§11),
   `thiet_ke/QUYET_DINH_APPKH.md` (mục 12.11 → 15.11), `TIEN_DO_APPKH.json` (sổ việc), `thiet_ke/trao_doi/` (thư mới nhất).
2. `git clone --depth 50 https://github.com/pos-tuquyduong/pos-tuquyduong` (công khai, chỉ đọc): `LICH_KHAI_TRUONG.md`, `TIEN_DO_POS.json`, `HOP_DONG_API_KH.md`
   (POS main = PHIEN_BAN **16**; VOUCHER-2 gộp sẽ thêm nhật ký **v15** mà vẫn PHIEN_BAN 16; v17 = KH-NAP-1 ~17–18.11. Bản chép trong kho App = **v13**, KH-QC-1 chép v16 TRƯỚC VOUCHER-2)
   và `HOP_DONG_API_ND.md` (**v1**, hợp đồng RIÊNG của kho nội dung `/api/nd`). Kho POS nhiều nhánh — chỉ đọc main (nhánh `viec/VOUCHER-2` đọc được trước khi gộp).
3. Xem App thật: sandbox KHÔNG vào được app-kh.pages.dev / POS (proxy 403) → dùng **trình duyệt trong app Claude trên máy chủ quán** (`Claude_Browser__*`: `preview_start`
   rồi `javascript_tool` để đo / bấm). POS thật: `https://www.pos-tuquyduong.io.vn` (cửa `/api/kh/hang` không cần token).
4. Fetch nhánh đang chạy (mục Tình trạng) → xem máy làm tới đâu → báo chủ quán vài dòng: đang ở đâu, chị cần làm gì tiếp.

## Vai trò chat App KH (giữ nguyên cách làm)
- **Luôn trả lời chủ quán bằng TIẾNG VIỆT** (chủ quán dặn 14.11) — dễ hiểu, ít thuật ngữ, từng bước đánh số.
- Soạn phiếu `viec/<MÃ>/phieu.md` + script Python chủ quán chạy ở **Shell Replit POS** (`~/workspace`). Script tự dùng / tự tải kho về `~/APP-KH`, không ghi gì kho POS, kiểm từng bước,
  lệch thì DỪNG + trả về như cũ, **chạy lại an toàn**, **tự xoá** sau khi xong. Máy Claude Code làm việc theo phiếu (`/lam-viec <MÃ>` trên đúng nhánh `viec/<MÃ>`), chạy thẳng tới hết.
- Máy hay DỪNG GIỮA CHỪNG mà không hỏi gì → chủ quán dán log; chat đưa câu nhắn "Làm tiếp … tới hết bước N, không dừng" để chủ quán gõ vào máy.
- **Thử MỌI script trên GitHub giả trước khi gửi:** `git init --bare <tmp>/gh/tuquyduong/APP-KH.git` (đường dẫn phải chứa `tuquyduong/APP-KH`), `git push` các ref THẬT vào đó,
  `symbolic-ref HEAD refs/heads/main`, clone vào `<tmp>/home/APP-KH` (đặt `user.email` / `user.name`), chạy `HOME=<tmp>/home python3 <bản chép>.py` (chép script ra file khác — script tự xoá).
  Giả lập GitHub gộp PR bằng `merge --no-ff -m "Merge pull request #N from tuquyduong/viec/<MÃ>"`. Chạy lại lần 2 phải ra "XONG TỪ TRƯỚC". Sau đó chạy cổng `tinh` + `chay` trên nhánh kết quả.
- **Khuôn script ở Project** (copy rồi sửa, đừng viết lại): `claude/xong_DOT7_mo_KHTHE2.py` (ghi việc xong — commit gộp có `^2` = đầu nhánh đã soát, hoặc đầu nhánh sau script gộp
  kiểm theo CÂY — + mở việc + chép thư vào `thiet_ke/trao_doi/` + chép bàn giao; tệp nhúng nén zlib + base64 + vân tay sha256), `claude/mo_KHADMIN1_KHQC1.py` (mở NHIỀU việc một lần,
  nhúng hợp đồng POS kèm kiểm sha256), `claude/duyet_KHTHE2.py` / `claude/duyet_KHADMIN1_KHQC1.py` (duyệt kế hoạch / trả lời câu hỏi: commit "PHIEU: <MÃ> - …" chỉ đổi phiếu, kiểm phiếu
  cũ theo vân tay), `claude/khung_duyet_the.py` (duyệt kèm tệp nhúng), `khung_gop_v2.py` (gộp main vào nhánh khi xung đột: ghi bản giải đã tính sẵn, KIỂM CÂY GỘP, commit
  "GOP-<MÃ> gop main …" + "HEAD ĐÃ KIỂM: <commit gộp>" — **kèm sửa `SỐ CA` trong `bang_chung_do.txt` khi main thêm ca vào bài cũ mà nhánh có sửa**).
- **Soát cuối** (trước khi bảo chủ quán Merge): thư mục có `goc/` (main = base PR, `npm ci` một lần) + `pr/` (nhánh, chép `node_modules`) →
  `node goc/tu_chay/cong.js tinh pr <BASE> <HEAD> viec/<MÃ>` và `KHONG_TRINH_DUYET=1 node goc/tu_chay/cong.js chay …` (chạy nền `nohup bash -c "…" &`, ~5 phút / nhánh); gộp thử
  MỌI nhánh đang mở theo thứ tự định gộp; `node kiem_tra_truoc_khi_giao.js --day-du` CÓ Chromium trên cây gộp (~15 phút, chạy nền); **chạy lại cổng `chay` trên nhánh SAU script gộp**
  (base = main mới); đọc diff (màn tiền: chỉ đổi chữ, không đổi logic); xem ảnh `viec/<MÃ>/so_anh/`. Máy KHÔNG được `git merge`.
  **Thêm từ 15.11 (bài học lỗi thẻ QR sau #38):** chạy MỌI `cong_cu/thu_*.js` với `LUU_ANH_DIR=<thư mục>` trên gốc VÀ trên PR, so từng ảnh — ảnh đổi ở màn NGOÀI phạm vi việc → KHÔNG ĐẠT.
  Máy giả POS trong bài thử trả 204 cho tệp tĩnh → ảnh thiếu logo; muốn ảnh đẹp thì tạm sửa bản chép bài thử cho phục vụ `public/` (KHÔNG commit).
- Luật cổng hay vấp: A7 (phiếu chỉ đổi ở commit "PHIEU: <MÃ>"), A11 (bài sửa phải đỏ trên gốc), A16 (SỐ CA theo `KHONG_TRINH_DUYET=1`, ở head), **A19** (`HEAD ĐÃ KIỂM: <SHA>` ĐẦU DÒNG,
  là dòng cuối có dạng đó; commit gộp main sau lần kiểm cũng tính là đổi code; commit chỉ đổi `viec/<MÃ>/` sau đó thì được). **"## Bài thử cũ sửa"**: cổng chạy BẢN GỐC bài cũ trên code PR
  và đòi XANH — bài cũ đỏ trên PR thì KHÔNG dùng mục này (sẽ đỏ A11), sửa thẳng bài cũ.
- **K9 "màu chỉ từ demo"** (`kiem_tra_truoc_khi_giao.js`): so theo GIÁ TRỊ kể cả độ trong (rgba(255,255,255,.45) ≠ .5) với `thiet_ke/app_kh_demo.html`; ngoại lệ chỉ qua danh sách
  `DUYET_NGOAI_DEMO` (chat sửa bằng script, chủ quán duyệt). Thiết kế mới: chat kiểm màu bằng đúng thuật toán đó TRƯỚC khi đưa máy (bộ kiểm Python ở máy chat: `the3/k9.py` — viết lại được
  từ hàm `docMau`). `transparent` và thuộc tính `opacity` không bị K9 đếm.
- **K10 "chữ cứng chỉ được giảm"** (`cong_cu/no_chu_cung.txt`, `cong_cu/ha_no_chu.js`): tệp hết chữ GIỮ dòng số 0. Giải xung đột: số nợ = số đếm thật bằng bộ đếm của main.
- **CSS là toàn cục** (không lazy, một gói): tên lớp mới phải có tiền tố riêng của màn / khối; KH-SUA-1 thêm bài canh "lớp gốc `.X{` không định nghĩa ở ≥ 2 tệp .css không phải `demo*`".
- **Luật "Thêm gì cũng phải sửa được ở /admin"** (CLAUDE.md §11): mọi chữ / ảnh / nút / danh sách / khối mới khai mục danh mục `src/noiDung/nd/<nhóm>.js` NGAY; soát cuối thiếu là KHÔNG ĐẠT.
- **Câu ưu đãi lấy từ POS** (chủ quán 15.11): App KHÔNG tự ghép câu "giảm gì / ưu đãi gì" — hiện nguyên `mo_ta` POS dựng từ cài đặt / mẫu voucher của POS; App chỉ giữ khung chữ
  (vd "Đã nhận ưu đãi khách mới:") sửa được ở /admin.
- KHÔNG sửa kho POS. Cần POS → `YEU_CAU_APPKH_GUI_POS_<ngày>.md` (lưu Project + tệp tải về cho chủ quán gửi); POS trả `TRA_LOI_POS_<ngày>.md` → lưu Project + chép vào
  `thiet_ke/trao_doi/` ở script kế tiếp.
- Câu hỏi của máy → kể lại bằng lời thường + đề xuất của chat → chị quyết; đã quyết thì ghi sổ, không hỏi lại. Chị muốn: "hệ thống thông minh, code chuẩn, đơn giản, không lằng nhằng".
  Muốn xem giao diện trước khi làm → dựng trang HTML so sánh (Artifact) "Hiện tại | Đề xuất" từng màn, lật qua lại trên điện thoại; trang đã duyệt → bản gọn vào `viec/<MÃ>/ban_thiet_ke.html`.
  Project gần đầy — chỉ lưu bàn giao, phiếu / script đang dùng, thư.

## Tình trạng 15.11.2026 khuya (APP-KH main e6a01ce = gộp #38 KH-THE-2; sổ v60 — script `claude/xong_THE2_mo_SUA1_THE3.py` đưa lên v61)

### Đang chạy
- **KH-QC-1 — MÁY XONG 15.11** (đầu b0205a3; phiếu `claude/phieu_KH-QC-1.md`): chat soát cuối 15.11 — cổng `tinh` + `chay` kiểu GitHub ĐẠT (base e6a01ce, 1 cảnh báo A16
  thu_KHTHE1 82≠85 không chặn), gộp thử main e6a01ce SẠCH (tự gộp App.jsx, thu_KHTHE1, thu_KHUI3d), `--day-du` Chromium trên cây gộp 55/0 (gốc 54/0); so 177 ảnh mọi bài thử gốc ↔ gộp: chỉ khác vệt sáng / nút gạt đang chạy hiệu ứng, chữ + bố cục
  y hệt → **SOÁT CUỐI ĐẠT 15.11** → chủ quán tạo PR + Merge (trước khi chạy script mở SUA-1 / THE-3 càng tốt). Máy hỏi `chu_dai` rỗng →
  KHÔNG cần hỏi POS: POS bắt buộc `chu_dai` (routes/quang-cao.js batBuoc). D4 lệch ≤ 3/255 chỉ ở vệt sáng chạy = chấp nhận. Máy bỏ bước 3 (agent soát kế hoạch) — ghi nhận.
  Còn: `src/quangCao.js` `tachBieuTuong` ghi U+FE0F / U+200D dạng ký tự thật thay `\uFE0F` / `\u200D` (chạy y hệt) → dọn ở việc sau. Máy đổi 4 bài cũ ghim v13 sang v16 (thu_KHMUA1c,
  thu_KHSOHD1, thu_KHTHE1, thu_KHKHOP1) + ca tĩnh đỏ trên gốc — đúng luật.
- **KH-ADMIN-1** (Opus; hạn 20.11; phiếu `claude/phieu_KH-ADMIN-1.md`, hợp đồng nd v1 nhúng): kế hoạch 15964fa chủ quán duyệt 15.11 (commit 2728b84: Q1–Q6 đồng ý; DS_MAN; ba chỗ /admin cũ;
  `dangKySW` được import `denLucKiem`). ADMIN-1 KHÔNG sửa màn khách; chỉ dòng `/admin` ở App.jsx / duongDan.js, hàm `goi` ở api.js.
- **KH-ADMIN-1 gần xong (15.11 khuya, đầu 99992f8):** soát độc lập vòng 1 KHÔNG ĐẠT 6 lỗi → sửa; vòng 2 ĐẠT + 4 lỗi nhẹ đã sửa; `--day-du` 54/0, thu_KHADMIN1 172/0
  (Chromium), đột biến 25/25; cổng `chay` đang chạy. Điểm cần xem lúc soát cuối: K2 chặn chuỗi '/api/…' ngoài /api/kh (viết trước khi có /api/nd) — máy ghép đường kho bằng
  `${VITE_POS_API}/api/nd` (K2 không bắt), đề xuất nới K2 cho /api/nd (tệp cấm máy → chat sửa bằng script). Chờ báo cáo 7 mục rồi chat soát cuối.
- Chủ quán đã chạy `claude/duyet_KHADMIN1_KHQC1.py`; cần dán tin nhắn script in ra vào đúng phiên (ADMIN-1 Opus, QC-1 Sonnet). Máy dừng / hỏi → chủ quán gửi log → chat soát.
- Chia tệp khi gộp: QC-1 chỉ phần quảng cáo ở App.jsx, `layQuangCao` + `CUA_CONG_KHAI` ở api.js, `quangCao.js`, 1 dòng `KiemKhop.jsx`. Xung đột dự kiến với main sau #38: `cong_cu/no_chu_cung.txt`,
  có thể `App.jsx` → khuôn gộp `khung_gop_v2.py`.

### Sắp mở (script `claude/xong_THE2_mo_SUA1_THE3.py` — đã thử GitHub giả)
- **KH-SUA-1 — sửa gấp thẻ mã QR** (Sonnet, chạy thẳng, ~1 giờ). Lỗi sau #38 (chủ quán chụp đơn APP0001 15.11): thẻ QR ở Theo dõi đơn xếp ngang cho MỌI đơn QR, vì THE-2 thêm
  `.the-qr`, `.the-qr-ic`, `.the-qr > div`, `.the-qr .the-qr-dau` ở `src/giaoDien/thanh_toan.css` (ô "Chuyển khoản QR" của `ThanhToan.jsx` ~dòng 282–285) trùng lớp của `TheQR.jsx` /
  `the_qr.css`. Sửa (đã thử trên bản sao): đổi thành `tt-qr`, `tt-qr-ic`, `tt-qr-v` (7 dòng, 2 tệp) → thu_KHSOHD1 103/0, thu_KHTHE2 154/0, ảnh đúng mẫu 06.11. Thêm: ca Chromium canh BÊN
  TRONG thẻ QR (`.the-qr-dau` nằm TRÊN `.the-qr-o`, `.the-qr-tien` trọn trong `.the-qr-o`, svg ≥ 200px) + bài canh tĩnh trùng lớp gốc (đã thử: main e6a01ce → bắt đúng `the-qr`;
  bản sửa và ea0281e → 0, không báo nhầm).
- **KH-THE-3 — thẻ Vàng & Kim Cương** (Sonnet, chạy thẳng; CHỦ QUÁN ĐÃ DUYỆT 15.11). Artifact "Thẻ Vàng & Kim Cương" https://claude.ai/artifact/AcJNE4yBCgPzoCoTzMoq7x (bản 2;
  nguồn dựng `the3/mau_the3.html` + `the3/gen.py` + `van_vang.svg` / `mat_kc.svg` ở máy chat — mất khi phiên đóng; Artifact đã chứa ĐỦ CSS + ảnh, đọc lại bằng Artifact `read` để làm bản gọn
  `viec/KH-THE-3/ban_thiet_ke.html` cho máy). Nội dung: một khối thẻ tỉ lệ 85,6×54, 3 cỡ (lớn / vừa / nhỏ); Vàng = lá vàng demo + vân khắc + biểu tượng bốn mùa ẩn; Kim Cương = xanh đêm
  (#1F2E52 / #22324F / #2C3E5E / #5B7FB8) + mặt cắt kim cương + chữ bạc (#FFFFFF → #E2EEFF → #9FB4CC) + đốm lấp lánh (tắt khi giảm chuyển động); hạng khác (vd "Hạng Ruồi" thử) = thẻ hồng
  demo. **CSS thẻ CHỈ màu demo** (kiểm K9: 0 màu lạ) → KHÔNG cần ngoại lệ K9; cỡ chữ `cqw` có px dự phòng (iOS 15). Chọn mẫu theo TÊN hạng, không phân biệt hoa thường (POS thật:
  "Hạng vàng", "Kim Cương"). Thẻ ghi "<Xưng hô> <Tên> · •••• <4 số cuối SĐT>" từ `/toi`, mức giảm, hạn / "Quán tặng · Không thời hạn". 4 chỗ: Ưu đãi (thẻ lên đầu, % / ngày còn lại / nút
  Quyền lợi xuống dưới thẻ); Theo dõi đơn chỉ thẻ (bỏ bước pha chế / ra quầy → bước 2 "Thẻ kích hoạt"; dòng thẻ = thẻ nhỏ + chữ App, bỏ 🎟️ POS gửi); Chào mừng (thẻ lên đầu thay huy
  chương, nghiêng nhẹ, ánh lướt MỘT lần); thẻ nhỏ (Thanh toán thẻ, đầu cột So sánh nhanh, chi tiết đơn / lịch sử). POS không phải làm gì. Máy CHÉP NGUYÊN CSS từ bản thiết kế.
  Bản gọn trong kho: che mã QR thật trong ảnh chủ quán chụp (kho công khai).
- **KH-VC-2 — voucher theo hợp đồng v15** (việc TIỀN — Opus, chờ duyệt kế hoạch; TRƯỚC khai trương). Mở khi chủ quán báo "XONG VOUCHER-2" + đã có trang thiết kế duyệt. Thư POS
  `claude/TRA_LOI_POS_15112026_VOUCHER2.md` (POS main lúc 15.11 tối vẫn d0bcb6ec — CHƯA gộp; nhánh `viec/VOUCHER-2` 67fc3f94). App cũ KHÔNG vỡ (`ma_giam` vẫn chạy; giỏ chỉ thẻ →
  `MA_KHONG_AP_MON_THUONG`). Mới: `vouchers: [mã…]` ở bao-gia / don (tối đa do quán đặt, MỘT voucher %), `voucher_loi[] { ma, code, error }`, `giam[]` loai `voucher` / `voucher_ship` (+ `ma`),
  `hoa_don[]` dòng `voucher` / `giam_ship`; `/voucher` thêm `mo_ta, nguon, kieu, min_order, giam_ship, ap_dung, chinh_chu`; nhan-ma-bill phát voucher MỚI theo mẫu (`data.voucher_code` = mã mới,
  `mo_ta, kieu, ap_dung, scope` ship|item|order) + lỗi `CAN_TAO_TAI_KHOAN`, `KHACH_DA_CO_TAI_KHOAN`, `UU_DAI_CHUA_CO_MAU`; voucher bị giữ khi đơn chờ QR (`VOUCHER_DANG_GIU`); 17 mã lỗi trong
  `ma_loi`. **3 chỗ App hiện chưa đúng nghĩa:** `NhanMa.jsx` ghép câu từ `discount_type/value` (mục `nm.daNhanMoi` `{giam}`) → dùng `data.mo_ta`; Ví voucher (`UuDai.jsx` `TheVoucher`) chưa
  hiện `mo_ta`, voucher giảm phí giao hiện như thường (App chỉ `tai_quan` → `VOUCHER_SHIP_CAN_GIAO`); `tenGiam` (`datDon.js`) loai `voucher`/`voucher_ship` → "Giảm giá" chung.
  Thiết kế cần chủ quán chọn: chọn nhiều voucher ở Thanh toán (tích từ ví + ô mã), voucher ship ẩn hay ghi "dùng khi giao hàng, đặt ở quầy". Chép hợp đồng POS main SAU khi gộp.
  Trước khi nhận, App chỉ có chữ chung "Nhận ưu đãi khách mới" (không số tiền); muốn hiện ưu đãi cụ thể TRƯỚC khi nhận thì phải xin POS mở câu `mo_ta` của mẫu khách mới (cửa công khai) —
  định hỏi ở thư POS kế tiếp.
- **KH-NAP-1** (khi POS main có hợp đồng v17 ~17–18.11): nạp = MỘT dòng `{ loai: "nap", ma_goi }` trong `/gio/bao-gia` + `/don`, dùng lại khuôn Thanh toán một dòng của THE-2; `GET /goi-nap`
  `{ ma, ten, tra, vao }`; mã `NAP_KHONG_GOP`, `NAP_CHI_TIEN_MAT_QR`, `GOI_NAP_KHONG_CO`, `THE_KHONG_TRA_VI` (POS nhận 4 điểm App xin, thư 15.11 SAOLUU mục 2).
- **KH-HUY-1** (Sonnet): App chưa hiện đơn bị quán huỷ theo v14 (`hoan_vao_tai_khoan`, `ly_do_huy` — "Đã hoàn <số> vào tài khoản"); làm SAU THE-3 (cùng `TheoDoiDon.jsx`).
- **Thứ tự gộp:** SUA-1 → QC-1 → THE-3 → VC-2 → NAP-1; ADMIN-1 hạn 20.11 (gộp khi xong, giải xung đột bằng khuôn gộp); HUY-1 sau THE-3.
- **Script kế tiếp phải ghi sổ:** KH-THE-2 xong (PR #38, đầu 6b2a02d, gộp e6a01ce, soát cuối ĐẠT); KH-SL-1 → bỏ (thay bằng Apps Script); KH-NAP-1 đổi mô tả (một dòng, phụ thuộc v17);
  thêm KH-SUA-1, KH-THE-3 (mở), KH-VC-2 (chờ POS VOUCHER-2 + thiết kế); QĐ 15.11 (mục Quyết định); chép vào `thiet_ke/trao_doi/`: `TRA_LOI_POS_14112026_THE_NAP`, `YEU_CAU_APPKH_GUI_POS_14112026_b`,
  `YEU_CAU_APPKH_GUI_POS_15112026`, `TRA_LOI_POS_15112026_SAOLUU`, `YEU_CAU_APPKH_GUI_POS_15112026_b`, `TRA_LOI_POS_15112026_VOUCHER2`; chép bàn giao này.

### Sao lưu
- **Đang chạy từ 15.11 12:27:** Apps Script "TQD Sao Lưu Tự Động" (tài khoản Google của quán) mỗi đêm ~2–3 giờ gọi `GET /api/nd/xuat` bằng khoá `ndk_…` MỚI (chỉ trong thuộc tính script)
  → Drive `TQD-SAO-LUU/App KH/`, giữ 30 bản. Khoá cũ ở GitHub đã thu hồi (Secret cũ xoá cho gọn — không bắt buộc). KH-SL-1 BỎ. Bỏ SX.
- **Chủ quán quyết 15.11:** "lưu HẾT về Drive, GitHub vẫn chạy bình thường (chủ động mã nguồn, thiết kế), nhẹ, ít phiên bản". Đề xuất App (thư `claude/YEU_CAU_APPKH_GUI_POS_15112026_b.md`,
  CHỜ POS trả lời): `TQD-SAO-LUU/{App KH: Noi dung, Ma nguon, Thiet ke}{POS: Du lieu, Ma nguon, Thiet ke}` + Sheet "Nhat ky sao luu"; chỉ lưu khi đổi (SHA-256 / mã commit); giữ theo
  tầng (dữ liệu 7 ngày + 4 tuần + 12 tháng ≈ 23 tệp; mã nguồn 4 tuần + 6 tháng; thiết kế 1 tệp / trang, ghi đè, bản bị thay vào `Thiet ke/Cu/`); zip; quá hạn → Thùng rác; kiểm sau lưu;
  email CHỈ khi lỗi; khoá chỉ ở thuộc tính Apps Script; tài khoản Google bật xác minh 2 bước. Mã nguồn APP-KH = cây `main` bỏ `viec/**/*.png|jpg|webp` → 573 tệp, 10,6 MB, zip ~5 MB
  (Apps Script: API `git/trees` + raw, không khoá; giới hạn 50 MB / lần tải, 6 phút / lần, 90 phút / ngày). Kho POS 914 tệp / 18 MB. Hỏi POS: ai giữ mã Apps Script — App nghiêng App viết
  bản 2 (khung chung + khối App KH), POS thêm khối "POS / Du lieu" khi SAOLUU-DEM-1 xong.
- **Bản 2 Apps Script (15.11 khuya):** POS chọn (b) — App giữ mã từ nay (thư `claude/TRA_LOI_POS_15112026_SAOLUU_b.md`); `claude/TQD_Sao_Luu_Tu_Dong_ban2.gs` + thư xin POS soát
  `claude/YEU_CAU_APPKH_GUI_POS_15112026_c.md`; chờ POS "ĐẠT" rồi chủ quán dán, chạy `caiHenGio` + `thuNgay`, đặt "Thông báo lỗi: Ngay lập tức". Điểm chính: khoá ND đọc `KHOA_ND`,
  không có thì tự dùng thuộc tính bản 1 có giá trị `ndk_`; POS/Du lieu bỏ qua khi chưa có `KHOA_POS`; commit main APP-KH lấy qua `info/refs` (không tính lượt API), danh sách tệp
  `git/trees` 1 lần / tuần, tải tệp qua raw; API 403 → chờ, ≥ 4 đêm mới lỗi. Thử 26 ca trên Apps Script giả (`saoluu/thu_mock.js` ở máy chat). Mã cũng vào kho `thiet_ke/sao_luu/`.
- **Thiết kế lên Drive:** chat tải qua kết nối Google Drive — lần đầu ~10 trang App KH chỉ có trên claude.ai (Demo App KH ví (d), Thẻ hội viên đề xuất, Đối chiếu tính năng, Đặc tả kỹ thuật,
  Cẩm nang 9 thể trạng, Trắc nghiệm 60 câu, Menu trà theo thể, Bản đồ ghép trà, So sánh thẻ hội viên, Thẻ Vàng & Kim Cương). 15.11 tối chủ quán báo đã kết nối Drive, NHƯNG phiên chat này
  vẫn thấy Google Drive "chưa kết nối" (ListConnectors) → kiểm lại; kết nối mới có thể chỉ hiện ở chat mới. Trang thiết kế POS / SX là việc chat POS.
- Sau khi có Drive: Project chỉ giữ bàn giao + phiếu / script đang dùng + thư mới (cũ đã ở kho + Drive).

### POS
- **Hợp đồng `/api/kh`:** PHIEN_BAN 16 (QC-APP-1 v16, HUY-1 v14); VOUCHER-2 (v15) chủ quán gộp 15.11 (chưa thấy trên main lúc 15.11 tối); v17 KH-NAP-1 ~17–18.11. POS báo khi gộp.
- **DANG-NHAP-2** gộp (POS main cc04f14, sổ v66→v67): IP thật sau Cloudflare — trần lượt `/api/kh` tính theo IP thật từng khách → App không phải làm gì (429 như cũ).
- **ND-API-1** (#93): kho nội dung `/api/nd` v1 (quyền nd_xem / nd_sua / nd_cap_nhat / nd_xuat_nhap, khoá `ndk_…` chỉ `GET /xuat`); CORS `/api/nd` chỉ tuquyduong.com + app-kh.pages.dev →
  /admin chỉ thử thật được sau khi gộp main.
- **Thư chờ POS trả lời:** `claude/YEU_CAU_APPKH_GUI_POS_15112026_b.md` (sao lưu chung về Drive).
- **Chờ POS** (lịch POS): COMBO-1a → App combo · TOPPING-1 → KH-GHICHU-1 + topping · KH-NAP-1 + QUA-1 → KH-NAP-1 + KH-VI-2 · GIOVANG-1 `gia_mon[]` → giá Giờ vàng từng món · KH-MUA-2 ·
  MATKHAU-1 (~20–21.11) → KH-MK-1 · SAOLUU-DEM-1 (Sonnet, trước khai trương). Sau khai trương: DOI-DIEM-1, QUET-2, GIOI-THIEU-1, QUA-TANG-1, CHU-KHACH-1, VOUCHER-3.
- **Kiểm POS thật 14.11:** `/hang`: Kim Cương id 3 (`thu_bac` 2, chỉ cấp, 10%), Hạng vàng id 6 (`thu_bac` 3; gói 1 tháng 100.000 / 3 tháng 295.000; 3% + nhóm đặc biệt 4%), Hạng Ruồi id 7
  (`thu_bac` 4; thử, không có thật) → **thứ bậc ngược** — chủ quán sửa ▲▼ ở POS.

### Ý tưởng chờ quyết: giao diện theo dịp lễ (chủ quán hỏi 15.11)
- Chat đề xuất: KHÔNG đổi biểu tượng App trên màn hình điện thoại (iPhone không cập nhật biểu tượng PWA đã cài; Android cập nhật chậm và hỏi người dùng) — đổi BÊN TRONG App.
  "Lịch dịp" một danh sách (dịp, ngày dương hoặc âm — App đã có lịch âm `src/lich.js` `LUNAR`, ưu tiên), mỗi dịp một "bộ trang trí" nhỏ: hoạ tiết góc đầu trang / banner, điểm xuyết
  logo, màn mở, lời chúc, hiệu ứng nhẹ (cánh mai / đèn lồng, tắt khi giảm chuyển động); màu chỉ trong bảng demo hoặc bộ ngoại lệ duyệt MỘT lần. Lưu ở kho nội dung (/admin — sửa
  được, Drive tự sao lưu), ảnh WebP nhỏ; App tự chọn dịp theo giờ POS; /admin có "Xem thử dịp". Thiết kế một lần, ngày âm tự tính nên dùng lại hằng năm. Làm SAU ADMIN-1;
  dịp gần: Noel 25.12, Tết dương 1.1, Tết Nguyên Đán 2027 (≈ 06.02.2027); khai trương 04.12 dùng dải / banner quảng cáo POS (QC-1) có sẵn, không cần code.

### Đã xong gần đây
- **#38 KH-THE-2** (15.11; đầu 6b2a02d, gộp e6a01ce): thẻ hội viên theo trang "So sánh thẻ hội viên" (https://claude.ai/artifact/Ddrw9SiX95XhW3KJWXfRWR) — So sánh nhanh đầu màn Hạng
  thành viên; Thanh toán thẻ `/uudai/hang/thanhtoan?h=&thang=` (thẻ không vào giỏ; chỉ QR, không ví / PIN / mã giảm); Chào mừng hội viên = trạng thái xong của Theo dõi đơn chỉ thẻ; thẻ Ưu đãi
  4 trạng thái. Soát cuối ĐẠT (cổng `tinh` + `chay` kiểu GitHub, `--day-du` Chromium 54/0) — nhưng SÓT lỗi thẻ QR (→ KH-SUA-1, bài học ở mục Soát cuối).
- **#37 KH-THE-1** (đầu a9d98b7 sau `gop_KHTHE1.py`), **#36 KH-ND-3d** (đầu 3380dc7) — 14.11, script DOT7 đã ghi sổ.

### Khai trương
- Thực tế khoảng **T6 04.12** (lịch POS 14.11; trước đó T5 03.12). Đánh giá chi tiết (cũ): `claude/DANH_GIA_TIEN_DO_11112026.md`.

## Quyết định 10–15.11 (đủ ở `thiet_ke/QUYET_DINH_APPKH.md` — mục 15.11 CHƯA ghi, chờ script kế tiếp)
- **15.11:** thiết kế thẻ Vàng & Kim Cương duyệt (KH-THE-3); câu "giảm gì / ưu đãi gì" luôn lấy từ cài đặt POS (`mo_ta`), App không tự ghép; sao lưu: lưu HẾT về Drive, GitHub vẫn chạy,
  nhẹ, ít phiên bản (chờ POS thống nhất cách); KH-SL-1 bỏ, bỏ SX; khai trương ~04.12.
- **14.11:** thẻ hội viên theo trang so sánh đã duyệt (KH-THE-2) — thay QĐ 08.11 / 12.11 "thẻ chung giỏ, Trả thẻ trước"; **thẻ KHÔNG trả bằng số dư** (tiền nạp có thưởng) — QR trên App,
  tiền mặt / chuyển khoản ở quầy; thẻ không dùng mã giảm trên App.
- Nội dung sửa trực tiếp ở App (/admin), KHÔNG đụng phần POS; mở hết chữ; Lưu nháp → "Cập nhật toàn bộ" → giữ mọi phiên bản; quyền sửa trong Phân quyền POS; kho nội dung "ở nhờ POS nhưng
  xây như nhà riêng"; sao lưu mỗi đêm bằng Apps Script (KH-SL-1 đã bỏ); /admin TRƯỚC khai trương. Thêm gì cũng phải sửa được ở /admin (CLAUDE.md §11).
- Banner luôn ánh sáng; dải kiểu A; vệt sáng luôn chạy. Chu kỳ KHÔNG khoá mã; ô tiện ích ẩn thì link cũng không mở. Văn khấn: Tín chủ = họ tên tài khoản, Địa chỉ = địa chỉ tài khoản.
- Mật khẩu đăng nhập + giữ đăng nhập 90 ngày (POS MATKHAU-1); đổi điểm: voucher ở App / quầy, quà hiện vật đổi ở quầy; QUET-2 làm theo lịch POS.
- Google: hồ sơ CHƯA xác minh → xác minh bằng video trước khai trương (`claude/HUONG_DAN_XAC_MINH_GOOGLE.md`); API chỉ xin được khi hồ sơ đã xác minh ≥ 60 ngày.

## Chủ quán đang nợ / cần làm
- Gửi chat POS thư `YEU_CAU_APPKH_GUI_POS_15112026_b.md` (sao lưu chung về Drive); gộp VOUCHER-2 rồi báo chat "XONG VOUCHER-2".
- Sau VOUCHER-2: chọn **mẫu voucher khách mới** trong Cài đặt POS (chưa chọn → khách nhận mã bị `UU_DAI_CHUA_CO_MAU`) — câu ưu đãi App hiện lấy từ mẫu này.
- Kết nối Google Drive cho chat (tài khoản Google của quán) — phiên 15.11 chưa thấy; bật **xác minh 2 bước** cho tài khoản Google của quán.
- Gật "viết script" mở KH-SUA-1 + KH-THE-3; dán tin nhắn duyệt vào phiên ADMIN-1 / QC-1 nếu chưa.
- Thử tay THE-2 trên điện thoại: Ưu đãi → Hạng thành viên → Mua ngay → Thanh toán chỉ QR → (trả thử) Chào mừng hội viên.
- POS › Cài đặt › Hạng thành viên: ▲▼ Kim Cương lên trên cùng (rồi Hạng vàng), tắt Hạng Ruồi (thử) trước khai trương, nhập Quyền lợi từng hạng, đặt % và giá gói thật.
- Gắn tên miền **tuquyduong.com** vào Cloudflare Pages (KH-CF-1) — dán địa chỉ vào Cài đặt hoá đơn POS khi xong.
- Xác minh hồ sơ Google khi biển hiệu lắp xong → gửi link nhận đánh giá. Số điện thoại / Zalo / email hỗ trợ (mục Hỗ trợ đang ẩn vì trống).
- Thử tay: Mã thành viên quét ở quầy; Xe cộ / Uống thuốc / Chu kỳ / Văn khấn.

## Ghi chú kỹ thuật cho việc sau
- KH-ND-3c: `kh_chuong_trinh` (thông tin công khai) ngoài `luuMay.js`, không hạn dùng — chấp nhận.
- KH-ND-3e: chưa chắc dải "Đơn đã sẵn sàng" có bị thanh tab che trên máy thật → thử tay.
- Đề xuất bộ kiểm K11 (đường dẫn ảnh `/anh/…` viết thẳng ngoài `src/noiDung` "chỉ được giảm") + cổng so `no_chu_cung.txt` với gốc nhánh (chặn nâng tay) — gom một việc sau.
- KH-THU-2: bài thử không phụ thuộc lịch sử git (từ Câu hỏi 4 của THE-1).
- Sandbox của chat: thư mục nháp mất khi phiên kết thúc — script / phiếu / thư lưu ở Project `claude/`; trang thiết kế là Artifact (đọc lại bằng Artifact `read`).
