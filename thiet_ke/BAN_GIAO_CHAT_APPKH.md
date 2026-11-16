# Bàn giao chat App KH (cập nhật 16.11.2026 chiều — sau khi duyệt Nạp tiền & Voucher)

<!-- Bản MỚI NHẤT nằm ở Project (claude/BAN_GIAO_CHAT_APPKH.md). Bản trong kho APP-KH (thiet_ke/BAN_GIAO_CHAT_APPKH.md) do script ghi-xong chép — có thể cũ hơn Project. -->

## Prompt chuyển chat (chủ quán dán nguyên văn vào chat mới, trong Project "APP KH - CLAUDE AUTONOMOUS")
> Đây là chat App KH mới, tiếp nối chat cũ. Đọc file Project `claude/BAN_GIAO_CHAT_APPKH.md` rồi làm đúng mục "Bắt đầu chat mới" trong đó. Luôn giải thích dễ hiểu câu hỏi của máy, đề xuất câu trả lời của bạn để tôi quyết định; trả lời từng bước cụ thể.

## Bắt đầu chat mới
1. Đọc hết file này. Rồi `git clone https://github.com/tuquyduong/APP-KH` (đọc được, KHÔNG có quyền GitHub API — `gh` báo 403; chỉ dùng `git fetch`). Đọc: `CLAUDE.md` (nhất là §5, §8–§11),
   `thiet_ke/QUYET_DINH_APPKH.md` (mục 12.11 → 16.11), `TIEN_DO_APPKH.json` (sổ việc), `thiet_ke/trao_doi/` (thư mới nhất), `CHECKLIST_CODE.md` mục A.
2. `git clone --depth 50 https://github.com/pos-tuquyduong/pos-tuquyduong` (công khai, chỉ đọc): `LICH_KHAI_TRUONG.md`, `TIEN_DO_POS.json`, `HOP_DONG_API_KH.md`
   (POS main = PHIEN_BAN **16** + nhật ký v15 VOUCHER-2 — gộp 15.11 PR #95; v17 = KH-NAP-1 ~17–18.11. Bản chép trong kho App = v16 TRƯỚC VOUCHER-2 (KH-QC-1 chép))
   và `HOP_DONG_API_ND.md` (**v1**, hợp đồng RIÊNG của kho nội dung `/api/nd`). Kho POS nhiều nhánh — chỉ đọc main.
3. Xem App thật: sandbox KHÔNG vào được app-kh.pages.dev / POS (proxy 403) → dùng **trình duyệt trong app Claude trên máy chủ quán** (`Claude_Browser__*`: `preview_start`
   rồi `javascript_tool` để đo / bấm). POS thật: `https://www.pos-tuquyduong.io.vn` (cửa `/api/kh/hang` không cần token).
4. Fetch nhánh đang chạy (mục Tình trạng) → xem máy làm tới đâu → báo chủ quán vài dòng: đang ở đâu, chị cần làm gì tiếp.

## Vai trò chat App KH (giữ nguyên cách làm)
- **Luôn trả lời chủ quán bằng TIẾNG VIỆT** (chủ quán dặn 14.11) — dễ hiểu, ít thuật ngữ, từng bước đánh số. Câu hỏi của máy: kể lại bằng lời thường (ví dụ đời thường),
  đề xuất của chat + lý do → chị quyết; đã quyết thì ghi sổ, không hỏi lại. 16.11 chị hỏi lại "giải thích dễ hiểu hơn" → viết ngắn, chia "Chuyện là / Em đề xuất".
- Soạn phiếu `viec/<MÃ>/phieu.md` + script Python chủ quán chạy ở **Shell Replit POS** (`~/workspace`). Script tự dùng / tự tải kho về `~/APP-KH`, không ghi gì kho POS, kiểm từng bước,
  lệch thì DỪNG + trả về như cũ, **chạy lại an toàn**, **tự xoá** sau khi xong. Máy Claude Code làm việc theo phiếu (`/lam-viec <MÃ>` trên đúng nhánh `viec/<MÃ>`), chạy thẳng tới hết.
- Máy hay DỪNG GIỮA CHỪNG mà không hỏi gì → chủ quán dán log; chat đưa câu nhắn "Làm tiếp … tới hết bước N, không dừng" để chủ quán gõ vào máy.
- **Thử MỌI script trên GitHub giả trước khi gửi:** `git init --bare <tmp>/gh/tuquyduong/APP-KH.git` (đường dẫn phải chứa `tuquyduong/APP-KH`), `git push` các ref THẬT vào đó,
  `symbolic-ref HEAD refs/heads/main`, clone vào `<tmp>/home/APP-KH` (đặt `user.email` / `user.name`), chạy `HOME=<tmp>/home python3 <bản chép>.py` (chép script ra file khác — script tự xoá).
  Giả lập GitHub gộp PR bằng `merge --no-ff -m "Merge pull request #N from tuquyduong/viec/<MÃ>"`. Chạy lại lần 2 phải ra "XONG TỪ TRƯỚC". Sau đó chạy cổng `tinh` + `chay` trên nhánh kết quả.
- **Khuôn script ở Project** (copy rồi sửa, đừng viết lại): `claude/xong_THE3_mo_NAP1_VC2.py` (MỚI NHẤT 16.11 chiều: ghi xong + thay tệp có vân tay + mở NHIỀU việc,
  nhúng phiếu + bản thiết kế dùng chung một bản byte), `claude/xong_QC1_SUA1_ADMIN1_gop_THE3.py` (MỚI NHẤT 16.11: ghi nhiều việc xong — tìm commit gộp có `^2` = đầu nhánh đã soát;
  thay tệp luật kiểm vân tay bản cũ; chép thư; RỒI gộp main mới vào một nhánh việc + sửa bài thử, **kiểm theo CÂY** (`git write-tree` = cây chat tính sẵn) + dòng "HEAD ĐÃ KIỂM"),
  `claude/xong_THE2_mo_SUA1_THE3.py` (ghi xong + mở việc + nhúng phiếu), `claude/mo_KHADMIN1_KHQC1.py` (mở NHIỀU việc, nhúng hợp đồng POS kèm sha256),
  `claude/duyet_KHTHE2.py` / `claude/duyet_KHADMIN1_KHQC1.py` (duyệt kế hoạch / trả lời câu hỏi: commit "PHIEU: <MÃ> - …" chỉ đổi phiếu), `claude/khung_duyet_the.py`,
  `khung_gop_v2.py` (khuôn POS — gộp có xung đột). Tệp nhúng: zlib + base64 + vân tay sha256[:12].
- **Soát cuối** (trước khi bảo chủ quán Merge): thư mục có `goc/` (main = base PR, `npm ci` một lần) + `pr/` (nhánh, chép `node_modules`) →
  `node goc/tu_chay/cong.js tinh pr <BASE> <HEAD> viec/<MÃ>` và `KHONG_TRINH_DUYET=1 node goc/tu_chay/cong.js chay …` (chạy nền, ~5 phút / nhánh); gộp thử
  MỌI nhánh đang mở theo thứ tự định gộp; `NODE_PATH=$(npm root -g) LUU_ANH_DIR=<thư mục> node kiem_tra_truoc_khi_giao.js --day-du` CÓ Chromium **trên CÂY GỘP** (~20 phút, chạy nền);
  chạy MỌI `cong_cu/thu_*.js` có `LUU_ANH_DIR` trên gốc → so từng ảnh gốc ↔ gộp (màn NGOÀI phạm vi đổi → KHÔNG ĐẠT; vệt sáng / nút gạt / đồng hồ đếm ngược đang chạy = chấp nhận);
  đọc diff (màn tiền: chỉ đổi chữ, không đổi logic); xem ảnh `viec/<MÃ>/so_anh/`. Máy KHÔNG được `git merge`. Playwright toàn cục: `NODE_PATH=$(npm root -g)`, trình duyệt ở `/opt/pw-browsers`.
  **Bài học 16.11 (b):** chép hợp đồng mới làm đỏ các bài thử GHIM bản cũ — đã đổi 4 bài sang "bản chép mới nhất `viec/*/hop_dong_v<N>.md`"; bài `thu_KHADMIN1` A1 vẫn ghim
  `HOP_DONG_API_ND.md` v1 (sha 836eb6ba…) — lần chép hợp đồng ND kế tiếp phải sửa bài đó cùng lúc. Trước khi gửi script đổi tệp chung: chạy `KHONG_TRINH_DUYET=1 node kiem_tra_truoc_khi_giao.js` trên cây kết quả.
  **Bài học 16.11:** `git merge-tree` sạch ≠ bài thử xanh — THE-3 gộp "sạch" với main nhưng ca B4 thu_KHTHE3 đỏ vì SUA-1 đổi tên lớp `the-qr` → `tt-qr`. Luôn chạy `--day-du` trên cây gộp.
- Luật cổng hay vấp: A7 (phiếu chỉ đổi ở commit "PHIEU: <MÃ>"), A11 (bài sửa phải đỏ trên gốc), A16 (SỐ CA theo `KHONG_TRINH_DUYET=1`, ở head), **A19** (`HEAD ĐÃ KIỂM: <SHA>` ĐẦU DÒNG,
  là dòng cuối có dạng đó; commit gộp main sau lần kiểm cũ cũng tính là đổi code; commit chỉ đổi `viec/<MÃ>/` sau đó thì được). **"## Bài thử cũ sửa"**: cổng chạy BẢN GỐC bài cũ trên code PR
  và đòi XANH — bài cũ đỏ trên PR thì KHÔNG dùng mục này (sẽ đỏ A11), sửa thẳng bài cũ.
- **Bộ kiểm cửa mạng (16.11, chủ quán duyệt "chuẩn, tối ưu, kỹ hơn")** trong `kiem_tra_truoc_khi_giao.js` — đọc mã NHƯ LÚC CHẠY (esbuild đi kèm vite: bỏ chú thích, ghép sẵn chữ hằng,
  chuẩn hoá `window['fe'+'tch']` → `window.fetch`): K0 đọc được; K1 mạng (fetch / XHR / sendBeacon / WebSocket / EventSource / import()) chỉ ở `src/api.js`; K1b api.js đúng 2 lối fetch
  (`goi` → /api/kh, `goiKho` → /api/nd); K2 chữ "api" đứng riêng chỉ trong `/api/kh` ở `dinhDang.js` và `/api/nd` ở `noiDung/khoNoiDung.js` + `noiDung/nd.js` (`CHO_API`);
  K2b `goiKho` chỉ kho nội dung dùng, luôn `goiKho(DIA_CHI_KHO+duong,`; K2c không dựng chữ kiểu giấu (fromCharCode, atob, eval, Function… — ngoại lệ `CHO_GIAU`: decodeURIComponent ở
  duongDan.js); K8b lời gọi kho viết thẳng + có trong khối `HOP_DONG_ND_MAY_DOC`; K2d (`--day-du`) bản dựng `dist/` chỉ chứa /api/kh + /api/nd. Thử 17 kiểu lách (ghép mảnh, `${}`,
  join, /api/kh ngoài chỗ, goiKho từ tệp khác, địa chỉ tự do, đường kho lạ / không viết thẳng, fromCharCode hằng + mảng, atob, new Function, window['fe'+'tch'], import() từ xa, fetch thứ 3,
  chú thích không báo nhầm, sw.js cài /api/pos) → bắt đủ. Thêm cửa / lối / dời tệp = chat sửa `CHO_API` / `SO_LOI_MANG_API` / `CHO_GIAU`.
- **K9 "màu chỉ từ demo"**: so theo GIÁ TRỊ kể cả độ trong với `thiet_ke/app_kh_demo.html`; ngoại lệ chỉ qua `DUYET_NGOAI_DEMO`. Thiết kế mới: chat kiểm màu bằng đúng thuật toán đó
  TRƯỚC khi đưa máy (viết lại được từ hàm `docMau`). `transparent` và `opacity` không bị K9 đếm.
- **K10 "chữ cứng chỉ được giảm"** (`cong_cu/no_chu_cung.txt`, `cong_cu/ha_no_chu.js`): tệp hết chữ GIỮ dòng số 0. Giải xung đột: số nợ = số đếm thật bằng bộ đếm của main.
- **CSS là toàn cục** (không lazy, một gói): tên lớp mới phải có tiền tố riêng của màn / khối; bài canh A1 (KH-SUA-1) "lớp gốc `.X{` không định nghĩa ở ≥ 2 tệp .css không phải `demo*`".
- **Luật "Thêm gì cũng phải sửa được ở /admin"** (CLAUDE.md §11): mọi chữ / ảnh / nút / danh sách / khối mới khai mục danh mục `src/noiDung/nd/<nhóm>.js` NGAY; soát cuối thiếu là KHÔNG ĐẠT.
- **Câu ưu đãi lấy từ POS** (chủ quán 15.11): App KHÔNG tự ghép câu "giảm gì / ưu đãi gì" — hiện nguyên `mo_ta` POS; App chỉ giữ khung chữ sửa được ở /admin.
- KHÔNG sửa kho POS. Cần POS → `YEU_CAU_APPKH_GUI_POS_<ngày>.md` (lưu Project + tệp tải về cho chủ quán gửi); POS trả `TRA_LOI_POS_<ngày>.md` → lưu Project + chép vào
  `thiet_ke/trao_doi/` ở script kế tiếp.
- Muốn xem giao diện trước khi làm → dựng trang HTML so sánh (Artifact) "Hiện tại | Đề xuất" từng màn, lật qua lại trên điện thoại; trang đã duyệt → bản gọn vào `viec/<MÃ>/ban_thiet_ke.html`.
  Project gần đầy — chỉ lưu bàn giao, phiếu / script đang dùng, thư. Chị muốn: "hệ thống thông minh, code chuẩn, đơn giản, không lằng nhằng".

## Chủ quán đang ở đâu (16.11 chiều)
1. Chạy `claude/xong_THE3_mo_NAP1_VC2.py` ở Shell Replit (chat gửi 16.11 ~14:30): sổ v62 → v63 (THE-3 xong #42; mở KH-NAP-1 + KH-VC-2; ghi chú KH-DOI-1), chép hợp đồng
   POS v17 (`thiet_ke/HOP_DONG_API_KH.md` + bản gốc `viec/KH-NAP-1/hop_dong_v17.md`), sửa 4 bài thử ghim bản v16 (thu_KHMUA1c / KHQC1 / KHSOHD1 / KHTHE1 → "bản chép mới nhất
   `viec/*/hop_dong_v<N>.md`, N ≥ 16"), thư POS 16.11 (V17 + YEU_CAU 16.11), QĐ 16.11 (b), bàn giao → push main; rồi 2 nhánh `viec/KH-NAP-1`, `viec/KH-VC-2` (commit "PHIEU: <MÃ>":
   phiếu + `ban_thiet_ke.html` bản cho máy + `mau_de_xuat.js`). Kiểm: `git fetch` thấy main commit "TIEN-DO: KH-THE-3 xong (PR #42); mo KH-NAP-1 + KH-VC-2 …" và 2 nhánh.
2. Mở HAI phiên Claude Code mới, cả hai **Opus**: nhánh `viec/KH-NAP-1` gõ `/lam-viec KH-NAP-1`; nhánh `viec/KH-VC-2` gõ `/lam-viec KH-VC-2`. Cả hai DỪNG ở bước 3 "Chờ duyệt
   kế hoạch" → chủ quán dán `ke_hoach.md` (hoặc log) cho chat duyệt → gõ "duyệt" → máy chạy tới hết.
3. Gửi chat POS thư `claude/YEU_CAU_APPKH_GUI_POS_16112026.md` (xin viết TRƯỚC hợp đồng DOI-DIEM-1; đề nghị "chọn bộ voucher có lợi nhất" sau khai trương; ghi nhận v17, SAOLUU-DEM-1).
4. Thử tay sau gộp: SUA-1 (Theo dõi đơn thẻ QR đứng dọc); ADMIN-1 (`app-kh.pages.dev/admin` → Chế độ sửa → ✎ → Lưu → Cập nhật toàn bộ → máy khác thấy chữ mới → Lịch sử phiên bản);
   THE-3 (Ưu đãi thẻ Vàng / Kim Cương; mua thẻ → Chào mừng).
5. Sao lưu Drive: chưa trả lời (`KHOA_GITHUB`, dán 2.3, `thuNgay`); POS đã gộp SAOLUU-DEM-1 → thêm `KHOA_POS` (mục Sao lưu). Có thì xin mấy dòng cuối Sheet "Nhat ky sao luu".

### Thiết kế Nạp tiền & Voucher (chủ quán duyệt 16.11 — Artifact https://claude.ai/artifact/Qy5PSiVPvSfCLaRn8viF7G, bản 3 "Đã duyệt")
- 7 màn: 1 Lối vào Ví · 2 Màn Ví · 3 Chọn gói (bảng trượt) · 4 Thanh toán nạp (khuôn THE-3) · 5 Đã nạp · 6 Ví voucher · 7 Giỏ hàng chọn voucher. Cả hai cột chụp từ App THẬT
  (cây main + THE-3) với POS giả; cột đề xuất = mẫu viết bằng lớp CSS của App bơm vào App đang chạy — công cụ Project `claude/cong_cu_chat_chup_app.js` + mẫu
  `claude/mau_thiet_ke_NAP1_VC2.js` (chép vào `viec/<MÃ>/mau_de_xuat.js`).
- Trả lời: N1 a (Ví từ ô Số dư Ưu đãi + ô Ví Tài khoản) · N2 a (bảng trượt) · N3 a (nhãn thưởng "+X" = vao − tra) · N4 a (hết gói → ẩn nút Nạp) · V1 a (chọn ở Giỏ hàng) ·
  V2 a (voucher ship mờ "Dùng khi đặt giao hàng") · **V3 b** (chưa đủ điều kiện → App TỰ BỎ chọn + câu đỏ POS) · **V4 b** (App TỰ CHỌN SẴN mọi voucher dùng được; khách chạm để bỏ,
  App nhớ) · V5 a (nhiều hơn số được dùng → sắp hết hạn trước; POS xét THEO THỨ TỰ mảng — `orders.js kiemVoucherDon`) · Đ1 a (đổi điểm: giữ lịch POS DOI-DIEM-1 sau khai trương, xin
  POS viết hợp đồng trước → KH-DOI-1).

## Tình trạng 16.11.2026 chiều (APP-KH main c8146cd = gộp #42 KH-THE-3; sổ v62 — script `xong_THE3_mo_NAP1_VC2.py` đưa lên v63)

### Đã xong gần đây
- **#41 KH-ADMIN-1** (16.11 gộp; đầu c9f400b): khu /admin đăng nhập tài khoản POS, Chế độ sửa (✎ / 🔒), bảng sửa tự sinh từ danh mục, Lưu nháp → Cập nhật toàn bộ, lịch sử phiên bản,
  Xuất / Nhập toàn bộ; khách nhận bản nội dung mới lần mở App tới. Soát cuối ĐẠT 15.11 (cổng tinh + chay cả base e6a01ce lẫn base sau SUA-1; màn khách không đổi — so ảnh).
  Chủ quán 16.11: ảnh /admin KHÔNG cần đủ 3 cỡ (chị sửa chủ yếu trên máy tính); K2 sửa theo đề xuất chat (bộ kiểm cửa mạng ở trên). Phát hiện → KH-SUA-2.
- **#40 KH-SUA-1** (16.11 gộp; đầu 43d1686): ô "Chuyển khoản QR" Thanh toán thẻ đổi lớp `tt-qr` / `tt-qr-ic` / `tt-qr-v`; thẻ QR Theo dõi đơn đứng dọc lại. Soát cuối ĐẠT.
- **#39 KH-QC-1** (15.11 gộp; đầu b0205a3): dải + banner quảng cáo đọc `GET /quang-cao`. Còn: `src/quangCao.js` `tachBieuTuong` ghi U+FE0F / U+200D ký tự thật → KH-SUA-2.
- **#38 KH-THE-2**, **#37 KH-THE-1**, **#36 KH-ND-3d** — đã ghi sổ.
- Cây gộp main + SUA-1 + ADMIN-1 (15.11): `--day-du` Chromium 57/0; so 180 ảnh gốc ↔ gộp: chỉ thẻ QR (đúng ý) + hiệu ứng đang chạy.

### Đang chạy (sau script 16.11)
- **KH-NAP-1 — khách tự nạp tiền** (Opus, [T], có duyệt kế hoạch; hạn 21.11; phiếu Project `claude/phieu_KH-NAP-1.md`): màn Ví mới `/uudai/vi` (`ViTien.jsx`, `vi_tien.css` tiền tố
  `vt-`, `viTien.js`, danh mục `nd/viTien.js`), bảng gói `BangNoi`, Thanh toán nạp `/uudai/vi/nap?goi=` = `ThanhToan.jsx` prop `nap` (khuôn một dòng của thẻ, bảng tiền RIÊNG — không đụng
  `BangTien`), "Đã nạp" ở `TheoDoiDon.jsx` (số từ `GET /vi` dòng có `ma_don`), lối vào ô Số dư Ưu đãi (CHỈ `wallet-row`) + ô Ví Tài khoản.
- **KH-VC-2 — voucher v15** (Opus, [T], có duyệt kế hoạch; hạn 21.11; phiếu Project `claude/phieu_KH-VC-2.md`): `voucherGio.js` (`dsGui` — bỏ ship, bỏ tay, chọn tay trước, hạn
  sớm trước, cắt 10), `voucher.css` tiền tố `vc-`, Ví voucher (`TheVoucher` = `mo_ta` + chip nguồn + "Dùng ngay"), `NhanMa.jsx` (`data.mo_ta`), Giỏ (mục "Voucher của bạn", ô mã
  chung, `tenGiam` "Voucher <MÃ>"), `App.jsx` trạng thái `boTay` / `chonTay` cạnh `maGiam`, Thanh toán đồ uống `tuy = { maGiam, vouchers }` + khối lỗi voucher.
- **Chỗ chung hai máy** (phiếu ghi rõ khối của ai): `App.jsx`, `ThanhToan.jsx`, `datDon.js` (NAP: `dongGui`, `dungViCho`, `buocTienTrinh`, `laDonChiNap`, `thamTaoMaMoi`, `monDatLai`;
  VC: `thanBaoGia`, `docBaoGia`, `tenGiam`), `UuDai.jsx` (NAP: `wallet-row`; VC: voucher), `duLieuKhach.js`, `canTuPos.js`, `no_chu_cung.txt`. Việc xong trước gộp trước; việc sau:
  chat gộp main mới vào nhánh bằng script (kiểm theo CÂY, sửa đụng nhau) + `--day-du` trên cây gộp, như THE-3 16.11.

### Sắp mở
- (cũ, MỞ 16.11 — xem Đang chạy) **KH-VC-2 — voucher theo hợp đồng v15** (việc TIỀN — Opus, TRƯỚC khai trương). POS đã gộp VOUCHER-2 (#95, POS main ba0d2c1; sổ POS v68 a7a09bc). Cần: (1) chat dựng trang thiết kế
  → chủ quán duyệt: chọn nhiều voucher ở Thanh toán (tích từ ví + ô mã), voucher ship ẩn hay ghi "dùng khi giao hàng, đặt ở quầy"; (2) script mở việc chép hợp đồng POS main
  (PHIEN_BAN 16 + nhật ký v15) vào `thiet_ke/HOP_DONG_API_KH.md` (bài thử ghim phiên bản cũ có thể phải sửa). Thư POS `claude/TRA_LOI_POS_15112026_VOUCHER2.md`.
  App cũ KHÔNG vỡ (`ma_giam` vẫn chạy). Mới: `vouchers: [mã…]` ở bao-gia / don (tối đa do quán đặt, MỘT voucher %), `voucher_loi[] { ma, code, error }`, `giam[]` loai `voucher` /
  `voucher_ship` (+ `ma`), `hoa_don[]` dòng `voucher` / `giam_ship`; `/voucher` thêm `mo_ta, nguon, kieu, min_order, giam_ship, ap_dung, chinh_chu`; nhan-ma-bill phát voucher MỚI
  (`data.voucher_code`, `mo_ta, kieu, ap_dung, scope` ship|item|order) + lỗi `CAN_TAO_TAI_KHOAN`, `KHACH_DA_CO_TAI_KHOAN`, `UU_DAI_CHUA_CO_MAU`; `VOUCHER_DANG_GIU` khi đơn chờ QR; 17 mã
  lỗi trong `ma_loi`. **3 chỗ App chưa đúng nghĩa:** `NhanMa.jsx` ghép câu từ `discount_type/value` (`nm.daNhanMoi` `{giam}`) → dùng `data.mo_ta`; Ví voucher (`UuDai.jsx` `TheVoucher`)
  chưa hiện `mo_ta`, voucher ship hiện như thường; `tenGiam` (`datDon.js`) loai `voucher`/`voucher_ship` → "Giảm giá" chung. Muốn hiện ưu đãi khách mới TRƯỚC khi nhận → xin POS mở
  `mo_ta` của mẫu khách mới (cửa công khai) ở thư POS kế tiếp.
- (cũ) **KH-NAP-1** (POS main ĐÃ có hợp đồng v17 — 7cf48ee, thư `claude/TRA_LOI_POS_16112026_V17.md`; MỞ 16.11 — xem Đang chạy): nạp = MỘT dòng `{ loai: "nap", ma_goi }` trong `/gio/bao-gia` + `/don`, khuôn Thanh toán một dòng
  của THE-2; `GET /goi-nap` `{ ma, ten, tra, vao }`; mã `NAP_KHONG_GOP`, `NAP_CHI_TIEN_MAT_QR`, `GOI_NAP_KHONG_CO`, `THE_KHONG_TRA_VI`.
- **KH-DOI-1 — đổi điểm lấy voucher / quà trên App** (chờ; có trong sổ từ 11.11 — quà hiện vật đổi ở QUẦY, App hiện "Đổi tại quầy"): chờ POS viết hợp đồng DOI-DIEM-1 (`GET /kho-qua`, `POST /doi-diem`, `GET /qua-cua-toi`) — thư
  `claude/YEU_CAU_APPKH_GUI_POS_16112026.md` mục 2; có hợp đồng → chat dựng trang thiết kế → duyệt → mở.
- **KH-HUY-1** (Sonnet): đơn bị quán huỷ theo v14 (`hoan_vao_tai_khoan`, `ly_do_huy`); mở SAU KH-NAP-1 (cùng `TheoDoiDon.jsx`).
- **KH-SUA-2 — gom lỗi nhỏ** (Sonnet, chờ; ghi sổ 16.11): (1) đổi tên lễ ở /admin mất gợi ý quà (`kh.leQua` khớp TÊN) + đổi tên 1 trong 3 ngày Tết → Tết hiện 2 lần (`holList` gộp
  TÊN) → khớp theo mã; (2) nút ✕ xoá dòng giỏ (`GioHang.jsx`) gắn `data-nd`; (3) `public/sw.js` bỏ `/kiemkhop`; (4) `quangCao.js` viết `️` / `‍`; (5) Chào mừng hạn POS
  hiện 2 lần (ở trên); (6) nhãn admin `ud.the.chipDb` "(chưa có hạng)" sai nghĩa; (7) chú thích đầu `KiemKhop.jsx`. Chủ quán: tạm ĐỪNG đổi tên ngày lễ / Tết ở /admin.
- **Thứ tự gộp:** THE-3 (xong) → NAP-1 / VC-2 song song, cái nào xong trước gộp trước; HUY-1 sau (đụng `TheoDoiDon.jsx` như NAP-1 — mở sau NAP-1); SUA-2 khi rảnh.

### Sao lưu (tình trạng 16.11)
- **Cách làm (chủ quán + POS chốt 15.11):** lưu HẾT về Drive `TQD-SAO-LUU` (riêng tư, tài khoản Google của quán); GitHub vẫn là nơi làm việc; bỏ SX; KH-SL-1 bỏ. Apps Script
  "TQD Sao Lưu Tự Động" — **App giữ mã**, POS soát phần khoá + phần POS. Cấu trúc: `App KH/{Noi dung, Ma nguon, Thiet ke}`, `POS/{Du lieu, Ma nguon, Thiet ke}`, Sheet "Nhat ky sao luu".
  Nội dung App 2 giờ (chỉ lưu khi đổi, `.json` thẳng), dữ liệu POS 3 giờ (`.xlsx`), mã nguồn Chủ nhật 4 giờ (POS trước). Giữ theo tầng: dữ liệu 7 ngày + 4 tuần + 12 tháng, mã nguồn
  4 tuần + 6 tháng. Lỗi → `throw` → Google email. Khoá CHỈ ở Thuộc tính tập lệnh: `KHOA_ND`, `KHOA_POS` (sau SAOLUU-DEM-1), `KHOA_GITHUB`. Khôi phục nội dung App = /admin › Nhập toàn bộ.
- **Bản hiện hành: 2.3** = Project `claude/TQD_Sao_Luu_Tu_Dong_ban2.gs` (bản gốc DUY NHẤT) = kho `thiet_ke/sao_luu/TQD_Sao_Luu_Tu_Dong.gs` (script 16.11 chép). POS soát 2.3 → ĐẠT
  (thư f). Theo dõi: nhật ký "chỉ tải được x/570 tệp" / "tải chưa xong trong giờ" mấy tuần liền → gắn `KHOA_GITHUB` cho lượt tải raw (giữ `followRedirects: false`) → POS soát lại.
- **Chủ quán làm (mục 5 thư d):** tạo khoá GitHub (Fine-grained, tên `TQD sao luu`, hạn dài nhất, "Public repositories (read-only)") → thuộc tính `KHOA_GITHUB` → dán 2.3 → `thuNgay`.
  CHƯA báo đã làm (chat hỏi 15.11 + 16.11).
- **POS gộp SAOLUU-DEM-1 (#97, POS main 1d66c61, 16.11)**: cửa `GET /api/pos/backup/tu-dong` + khoá `posk_…` (POS › Cài đặt › Sao lưu › "Tạo khoá mới", PIN chủ quán,
  khoá hiện MỘT lần) → chủ quán dán vào thuộc tính `KHOA_POS` của Apps Script → phần POS/Du lieu chạy 3 giờ một lần. Cần POS đã triển khai bản #97.
- **Công cụ thử của chat:** Project `claude/cong_cu_chat_thu_saoluu.js` + bản .gs cùng thư mục tên `TQD_Sao_Luu_Tu_Dong_ban2.gs` → `node cong_cu_chat_thu_saoluu.js` → "37 đạt · 0 hỏng".
- **Thiết kế lên Drive:** ~10 trang App KH chỉ có trên claude.ai (Demo App KH ví (d), Thẻ hội viên đề xuất, Đối chiếu tính năng, Đặc tả kỹ thuật, Cẩm nang 9 thể trạng, Trắc nghiệm 60 câu,
  Menu trà theo thể, Bản đồ ghép trà, So sánh thẻ hội viên, Thẻ Vàng & Kim Cương). Chat chưa có kết nối Google Drive (15.11 chủ quán báo đã kết nối nhưng phiên không thấy) →
  kiểm lại (ToolSearch "google drive"); có công cụ thì tải lên `TQD-SAO-LUU/App KH/Thiet ke/`.

### POS
- **Hợp đồng `/api/kh`:** POS main PHIEN_BAN **17** (7cf48ee, 16.11: KH-NAP-1 — `GET /goi-nap`, `GET /vi`, dòng nạp, thẻ chỉ tiền thật `THE_KHONG_TRA_VI`, tiền về muộn đúng số tự chốt đủ quyền lợi); v15 VOUCHER-2, v16 QC-APP-1, v14 HUY-1. Bản trong kho App = v16 trước VOUCHER-2 → script mở việc chép v17.
- **ND-API-1** (#93): kho nội dung `/api/nd` v1 (quyền nd_xem / nd_sua / nd_cap_nhat / nd_xuat_nhap — bước 027 gieo cho chủ quán; khoá `ndk_…` chỉ `GET /xuat`); CORS chỉ
  tuquyduong.com + app-kh.pages.dev → bản xem thử nhánh không gọi được kho. Máy ADMIN-1 đề xuất nhờ POS ghi rõ dạng trường `nguoi` ở `/nhap` vào hợp đồng (gom thư POS kế tiếp).
- **Chờ POS** (lịch POS): COMBO-1a → App combo · TOPPING-1 → KH-GHICHU-1 + topping · KH-NAP-1 + QUA-1 → KH-NAP-1 + KH-VI-2 · GIOVANG-1 `gia_mon[]` · KH-MUA-2 · MATKHAU-1
  (~20–21.11) → KH-MK-1 · SAOLUU-DEM-1 (trước khai trương). Sau khai trương: DOI-DIEM-1, QUET-2, GIOI-THIEU-1, QUA-TANG-1, CHU-KHACH-1, VOUCHER-3.
- **Kiểm POS thật 14.11:** `/hang`: Kim Cương id 3 (`thu_bac` 2, chỉ cấp, 10%), Hạng vàng id 6 (`thu_bac` 3; 1 tháng 100.000 / 3 tháng 295.000; 3% + nhóm đặc biệt 4%), Hạng Ruồi id 7
  (thử) → **thứ bậc ngược** — chủ quán sửa ▲▼ ở POS.

### Ý tưởng chờ quyết: giao diện theo dịp lễ (chủ quán hỏi 15.11)
- Chat đề xuất: KHÔNG đổi biểu tượng App trên màn hình điện thoại (iPhone không cập nhật biểu tượng PWA đã cài) — đổi BÊN TRONG App. "Lịch dịp" (ngày dương hoặc âm — `src/lich.js`),
  mỗi dịp một "bộ trang trí" nhỏ (hoạ tiết góc, điểm xuyết logo, màn mở, lời chúc, hiệu ứng nhẹ tắt khi giảm chuyển động); màu trong bảng demo hoặc bộ ngoại lệ duyệt MỘT lần; lưu ở
  kho nội dung (/admin sửa được, Drive sao lưu); /admin có "Xem thử dịp". Làm SAU ADMIN-1 (đã gộp); dịp gần: Noel 25.12, Tết dương 1.1, Tết Nguyên Đán 2027 (≈ 06.02.2027).

### Khai trương
- Thực tế khoảng **T6 04.12** (lịch POS 14.11).

## Quyết định 10–16.11 (đủ ở `thiet_ke/QUYET_DINH_APPKH.md` — mục 16.11 do `xong_QC1_SUA1_ADMIN1_gop_THE3.py` ghi)
- **16.11:** bộ kiểm cửa mạng 4 lớp (K2 cũ chỉ soi một kiểu viết nên `${gốc}/api/nd` lọt — máy tự báo); ảnh /admin không cần 3 cỡ; tạm không đổi tên ngày lễ / Tết ở /admin;
  soát cuối chạy bài thử trên cây GỘP.
- **15.11:** thẻ Vàng & Kim Cương duyệt (KH-THE-3); câu "giảm gì / ưu đãi gì" luôn lấy từ POS (`mo_ta`); sao lưu lưu HẾT về Drive; KH-SL-1 bỏ; khai trương ~04.12.
- **14.11:** thẻ hội viên theo trang so sánh (KH-THE-2); thẻ KHÔNG trả bằng số dư — QR trên App, tiền mặt / chuyển khoản ở quầy; thẻ không dùng mã giảm trên App.
- Nội dung sửa trực tiếp ở App (/admin), KHÔNG đụng phần POS; Lưu nháp → "Cập nhật toàn bộ" → giữ mọi phiên bản; quyền sửa trong Phân quyền POS. Thêm gì cũng phải sửa được ở /admin.
- Banner luôn ánh sáng; dải kiểu A; vệt sáng luôn chạy. Văn khấn: Tín chủ = họ tên tài khoản, Địa chỉ = địa chỉ tài khoản. Mật khẩu đăng nhập + giữ đăng nhập 90 ngày (MATKHAU-1).
- Google: hồ sơ CHƯA xác minh → xác minh bằng video trước khai trương (`claude/HUONG_DAN_XAC_MINH_GOOGLE.md`).

## Chủ quán đang nợ / cần làm
- Trả lời 8 câu trang Nạp tiền & Voucher → chạy script mở việc → thử tay SUA-1 / ADMIN-1 / THE-3 (mục "Chủ quán đang ở đâu").
- Sao lưu: tạo `KHOA_GITHUB`, dán 2.3, `thuNgay`, báo chat nhật ký.
- Sau VOUCHER-2: chọn **mẫu voucher khách mới** trong Cài đặt POS (chưa chọn → `UU_DAI_CHUA_CO_MAU`); duyệt trang Nạp tiền & Voucher (đã gửi 16.11).
- Kết nối Google Drive cho chat (tài khoản Google của quán); bật **xác minh 2 bước** cho tài khoản Google của quán.
- POS › Cài đặt › Hạng thành viên: ▲▼ Kim Cương lên trên cùng (rồi Hạng vàng), tắt Hạng Ruồi (thử), nhập Quyền lợi từng hạng, đặt % và giá gói thật.
- Gắn tên miền **tuquyduong.com** vào Cloudflare Pages (KH-CF-1) — dán địa chỉ vào Cài đặt hoá đơn POS khi xong (CORS kho nội dung đã nhận tuquyduong.com).
- Xác minh hồ sơ Google khi biển hiệu lắp xong. Số điện thoại / Zalo / email hỗ trợ (mục Hỗ trợ đang ẩn vì trống).
- Thử tay: Mã thành viên quét ở quầy; Xe cộ / Uống thuốc / Chu kỳ / Văn khấn.

## Ghi chú kỹ thuật cho việc sau
- KH-ND-3c: `kh_chuong_trinh` ngoài `luuMay.js`, không hạn dùng — chấp nhận. KH-ND-3e: dải "Đơn đã sẵn sàng" có bị thanh tab che trên máy thật? → thử tay.
- Đề xuất bộ kiểm K11 (đường dẫn ảnh `/anh/…` viết thẳng ngoài `src/noiDung` "chỉ được giảm") + cổng so `no_chu_cung.txt` với gốc nhánh (chặn nâng tay); khuôn lỗi "một khoá nút
  chỉ dùng cho một việc" (ADMIN-1); mở rộng bài canh trùng lớp sang bộ chọn có đuôi `.x:hover` + đối chiếu `demo*.css` (SUA-1); THE-3: thử CSS chép nguyên với dữ liệu dài hơn mẫu,
  đo hiệu ứng bằng computed style — gom một việc khung sau.
- KH-THU-2: bài thử không phụ thuộc lịch sử git.
- Sandbox của chat: thư mục nháp mất khi phiên kết thúc — script / phiếu / thư lưu ở Project `claude/`; trang thiết kế là Artifact (đọc lại bằng Artifact `read`).
