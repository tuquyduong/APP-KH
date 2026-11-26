# Bàn giao chat App KH (cập nhật 26.11.2026 — KH-NHANH-2 đã gộp #45, sổ v66, thư POS 19.11 đã chép vào kho)

<!-- Bản MỚI NHẤT nằm ở Project (claude/BAN_GIAO_CHAT_APPKH.md). Bản trong kho APP-KH (thiet_ke/BAN_GIAO_CHAT_APPKH.md) do script ghi-xong chép — có thể cũ hơn Project. -->

## Prompt chuyển chat (chủ quán dán nguyên văn vào chat mới, trong Project "APP KH - CLAUDE AUTONOMOUS")
> Đây là chat App KH mới, tiếp nối chat cũ. Đọc file Project `claude/BAN_GIAO_CHAT_APPKH.md` rồi làm đúng mục "Bắt đầu chat mới" trong đó. Luôn giải thích dễ hiểu câu hỏi của máy, đề xuất câu trả lời của bạn để tôi quyết định; trả lời từng bước cụ thể.

## Bắt đầu chat mới
1. Đọc hết file này. Rồi `git clone https://github.com/tuquyduong/APP-KH` (đọc được, KHÔNG có quyền GitHub API — `gh` báo 403; chỉ dùng `git fetch`). Đọc: `CLAUDE.md` (nhất là §5, §8–§11),
   `thiet_ke/QUYET_DINH_APPKH.md` (mục 12.11 → 26.11), `TIEN_DO_APPKH.json` (sổ việc), `thiet_ke/trao_doi/` (thư mới nhất), `CHECKLIST_CODE.md` mục A.
2. `git clone --depth 50 https://github.com/pos-tuquyduong/pos-tuquyduong` (công khai, chỉ đọc): `LICH_KHAI_TRUONG.md`, `TIEN_DO_POS.json`, `HOP_DONG_API_KH.md`
   (POS main = PHIEN_BAN **17** (KH-NAP-1, 16.11) + mục "Đã hẹn" DOI-DIEM-1 khi POS ghi sổ. Bản chép trong kho App = v17 (script 16.11 chép, kèm `viec/KH-NAP-1/hop_dong_v17.md`))
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
- **Khuôn script ở Project** (copy rồi sửa, đừng viết lại): `claude/gop_VC2_vao_NAP1.py` (MỚI NHẤT 17.11: gộp main vào nhánh việc CÓ đụng nhau — danh sách tệp đụng nhau
  phải đúng, vân tay tệp sẽ thay phải đúng, nhúng bản đã giải, kiểm theo CÂY, HEAD ĐÃ KIỂM; chấp nhận main gộp kiểu merge / squash qua so cây; GitHub giả: thêm hook
  `pre-receive` `exit 1` để thử push hỏng), `claude/xong_THE3_mo_NAP1_VC2.py` (MỚI NHẤT 16.11 chiều: ghi xong + thay tệp có vân tay + mở NHIỀU việc,
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
  và đòi XANH — bài cũ đỏ trên PR thì KHÔNG dùng mục này (sẽ đỏ A11), sửa thẳng bài cũ. **Bài học 17.11:** commit gộp sửa bài thử của việc KHÁC (vd thu_KHVC2 trong nhánh NAP-1)
  → bài đó thành "bài đổi" của PR này → A16 đòi dòng `SỐ CA <bài>: <N>` trong `viec/<MÃ>/bang_chung_do.txt` của NHÁNH ĐANG PR. Luôn chạy cổng `chay` trên GitHub giả SAU script gộp.
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

## Chủ quán đang ở đâu (26.11)
0. **KH-NHANH-2 ĐÃ GỘP** (PR **#45**, main **e96671b**, 26.11 sáng; đầu nhánh 66999ee, HEAD ĐÃ KIỂM 1853593). Vòng sửa cuối theo 2 câu chủ quán 19.11: không có nút tắt vòng xoay
   ở /admin; vòng giữa màn ẨN khi màn mở (ManDau) đang hiện (`baoManDau` trong api.js, VongCho nghe). Chat soát cuối 25.11 ĐẠT: cổng tinh + chay (base 88af1ef) ĐẠT
   (A16 chỉ cảnh báo 26 ≠ 37 ca — bài mới dừng sớm trên gốc), `--day-du` Chromium nhánh **68 · 0** / gốc 67 · 0, so 214 ảnh: khác chỉ ở chỗ chờ (vòng xoay, "Đang tính tiền…",
   tổng cũ mờ, "Đang gửi…"), Giỏ sau khi xoá giữ câu lỗi cũ thay vì nháy (POS giả trả lỗi — đúng ý "không nháy"), còn lại vệt sáng.
   Script `claude/xong_KHNHANH2.py` (26.11): sổ v65 → **v66** (KH-NHANH-2 xong; KH-SUA-2 thêm (12)–(16)), quyết định 19.11 + 26.11, chép thư App 19.11 + thư POS 19.11 vào
   `thiet_ke/trao_doi/`, bàn giao này.
1. **Thử tay D6 — HOÃN** (chủ quán 26.11: POS đang xây, chưa nhập / chọn hàng được). Chat NHẮC lại khi POS bán hàng được (sau việc bán theo kho của POS): mở App trên 4G →
   vòng xoay nhỏ không nền; Giỏ bấm +/− → tổng cũ mờ + vòng nhỏ, nút Tiếp tục khoá tới khi tính xong; Theo dõi đơn không nháy; lần đầu mở App không thấy vòng chồng lên màn chào.
2. **Việc kế tiếp (chủ quán chọn):** (a) dựng trang thiết kế **KH-DOI-1** Đổi điểm (chat đề xuất — hợp đồng POS đã hẹn, CÓ PIN; POS ghi vào "Đã hẹn" ở KH-API-4);
   (b) phiếu **KH-HUY-1** (đơn bị quán huỷ, mở được); (c) phiếu **KH-SUA-2** (16 việc nhỏ — gom xong).
3. Gói Render / Turso trả phí: chủ quán tự bấm khi sẵn sàng (POS đề xuất Render Starter + Turso Developer, giữ Virginia — Turso không có Singapore).

## Chủ quán đang ở đâu (lịch sử 17–19.11)
0. **ĐÃ GỘP 17.11 chiều:** PR **#43 KH-VC-2** (142797e) → script `gop_VC2_vao_NAP1.py` (gộp dd0e830, HEAD ĐÃ KIỂM 6e9c405) → PR **#44 KH-NAP-1** (main **26cb821**,
   cây 524d4cb). Script `claude/xong_VC2_NAP1.py` (17.11 tối): sổ v63 → **v64** (VC-2 + NAP-1 xong, KH-SUA-2 thêm (8)–(11), KH-DOI-1 theo POS + PIN, KH-HUY-1 mở được),
   quyết định 17.11, chép thư DOIDIEM 16.11 + thư App 17.11 vào `thiet_ke/trao_doi/`, bàn giao. Chủ quán chưa trả lời "gom / làm ngay" 2 việc nhỏ VC-2 → chat ghi vào KH-SUA-2
   (VC-2 đã gộp nên đằng nào cũng là việc mới). Còn: thử tay C7 (dưới), gửi thư POS 17.11, rồi chat dựng trang thiết kế KH-DOI-1.
1. **Hai máy XONG** (17.11): KH-NAP-1 đầu **950cc50** (HEAD ĐÃ KIỂM 91003d2), KH-VC-2 đầu **2f9ea0d** (HEAD ĐÃ KIỂM 4a50bc2; 3 vòng sửa — vòng cuối bỏ hẳn "tích tạm").
   **Chat soát cuối 17.11 ĐẠT:** cổng tinh + chay (base e7c4f0e) ĐẠT cả hai; gộp thử NAP-1 + VC-2: đụng nhau ĐÚNG 3 tệp dự kiến (App.jsx 3 khối, ThanhToan.jsx 3, UuDai.jsx 4) — giải
   GIỮ CẢ HAI phía (`tuy = cheDoThe || cheDoNap ? KHONG_MA : { maGiam, vouchers }`: đơn nạp không mã, không voucher; khối "Voucher chưa dùng được" ẩn ở thẻ + nạp); 2 bài thử chỉnh theo cây
   gộp (thu_KHNAP1 A2 thôi ghim nguyên văn 3 hàm VC-2 sửa; thu_KHVC2 B5 đòi nạp đi KHONG_MA) + dòng `SỐ CA cong_cu/thu_KHVC2.js: 28` ở `viec/KH-NAP-1/bang_chung_do.txt` (cổng A16 đòi —
   lần đầu chạy cổng chay trên GitHub giả mới lộ). Cây gộp `--day-du` Chromium **67 · 0** (gốc e7c4f0e cũng xanh); so 187 ảnh gốc ↔ gộp: ngoài phạm vi chỉ vệt sáng
   + nút gạt đang chuyển; trong phạm vi đúng thiết kế (Giỏ "Mã khuyến mãi · 1 mã / đơn" + voucher, Ưu đãi "Dùng ngay" + ô Số dư bấm được; Thanh toán nạp KHÔNG có khối voucher).
   Cổng tinh + chay trên GitHub giả (main = e7c4f0e + Merge VC-2) ĐẠT. Cây gộp **26c3c7c**; script Project `claude/gop_VC2_vao_NAP1.py` (sha256 5e0de3ad4898).
   **Thứ tự chủ quán:** (a) PR + Merge **viec/KH-VC-2** → (b) chạy `claude/gop_VC2_vao_NAP1.py` (gộp main vào viec/KH-NAP-1, kiểm theo cây, HEAD ĐÃ KIỂM, push; thử đủ 7 ca trên
   GitHub giả: thường / chạy lại / chưa Merge VC-2 / squash / push hỏng rồi chạy lại / main đi tiếp / máy đẩy thêm / cây lệch → trả về như cũ) → (c) PR + Merge **viec/KH-NAP-1**
   → (d) báo chat "đã gộp NAP-1" → chat viết script ghi sổ (VC-2 + NAP-1 xong, KH-SUA-2 thêm mục, quyết định 17.11, thư 17.11, bàn giao) → (e) thử tay C7.
   **Thử tay C7** (điện thoại, sau khi Cloudflare dựng main): NAP — Ưu đãi › ô Số dư → Ví → Nạp tiền → gói nhỏ nhất → QR → chuyển khoản thật → "Đã nạp" + dòng mới đầu Lịch sử ví;
   nạp lần 2 bấm "Huỷ đơn" → số dư không đổi. VC (sửa 18.11 — Kho quà POS KHÔNG có "đơn tối thiểu": `mauTuQua` đặt don_toi_thieu 0; voucher vào ví CHỈ qua Đổi quà ở quầy hoặc ưu đãi khách mới) —
   Quản lý › Cài đặt › nhóm Khách hàng › 🎫 Kho quà: 3 quà thử 1 điểm, hạn 1 ngày (giảm 5.000đ · giảm 10% trần 10.000đ · giảm 5%) → Quản lý › Khách hàng và số dư ›
   SĐT thử (cần ≥ 3 điểm) › 🎫 Đổi quà › Đổi cả 3 → App Ưu đãi thấy câu POS + "Dùng ngay" → Giỏ: tự tích 5.000đ + một voucher %, voucher % thứ hai câu đỏ
   "Mỗi đơn chỉ dùng một voucher giảm %" (VOUCHER_PHAN_TRAM_HAI) → đặt đơn (trả bằng số dư vừa nạp) → hoá đơn "Voucher <MÃ>" → xong thì TẮT 3 quà thử ở Kho quà.
   Chủ quán 18.11: đã chạy `xong_VC2_NAP1.py`; thử Nạp tiền OK; thử Voucher OK hết.
0b. **App hơi lag (18.11) — chat đo trên trình duyệt chủ quán:** đường VN ↔ POS (Mỹ) ~0,3 s/lượt; POS xử lý: /goi-nap 0,1 s, /toi /diem /vi /voucher 0,7–1,2 s,
   **báo giá 1,3–1,6 s** (bấm +/− chờ 1,6–1,9 s + 0,6 s App gom); mở App 12 lượt song song xong ~3,5 s. App: chưa `preconnect` tới POS; `MS_GOP` 600 (gom đuôi).
   **Chủ quán chọn kiểu chờ B SỬA (18.11):** CHỈ vòng xoay giữa màn, KHÔNG nền trắng (chủ quán: nền trắng không ăn nhập), KHÔNG làm mờ màn, KHÔNG chặn bấm; hiện khi chờ POS > 0,3 s. Bản thử Artifact
   https://claude.ai/artifact/X1BRV2xZDDWDEcnWe4fLnk (App thật main 706ed73 + POS giả có độ trễ đo thật, bộ định tuyến trong bộ nhớ vì khung kín; chọn kiểu ở #b-cham…).
   **18.11 17:36 chủ quán: "đồng ý" → script `claude/mo_KHNHANH2.py`** (sổ v64 → v65, mở **KH-NHANH-2** Opus không chờ duyệt kế hoạch, hạn 20.11; nhánh có phiếu +
   mẫu bản thử; quyết định 18.11; thư POS `claude/YEU_CAU_APPKH_GUI_POS_18112026.md`; bàn giao). Chủ quán KHÔNG cài `danhThucPOS` — sau này lên gói Render TRẢ PHÍ.
   **Đo lại 18.11 17:40** (POS đã chạy kho Virginia từ 16:24 — sáng nay máy chủ VẪN dùng kho Tokyo, chat POS bàn 40 phát hiện): báo giá 0,63–0,75 s, cửa có token ~0,5 s,
   công khai 0,25–0,36 s, mở App 11 lượt ~0,8 s → phần lớn "lag" sáng nay là do kho Tokyo. Còn ~0,25 s / lượt đường VN ↔ Mỹ; Singapore khi lên gói trả phí (thư 18.11).
   Sau khi máy làm xong: chat soát cuối (khuôn ở trên) → chủ quán Merge → script ghi sổ.
   **19.11:** máy XONG (HEAD ĐÃ KIỂM 7dab641, soát độc lập vòng 2 ĐẠT, thu_KHNHANH2 68/0, đột biến 14/14). Chủ quán trả lời 2 câu: (1) KHÔNG cần `hien.*` / nút tắt vòng
   xoay ở /admin (chỉ báo trạng thái, không phải nội dung); (2) **b — ẨN vòng giữa màn khi màn mở (ManDau) đang hiện** → chat đưa câu cho máy làm vòng sửa nhỏ, rồi soát cuối.
   Gom KH-SUA-2: báo giá không có `choMs` (4G treo → Giỏ khoá + vòng mãi); vòng loé khi xoá món cuối trong 600 ms; `CUA_NGAM` (api.js) → chuyển `ngam()` về heThong.js / giaHan.js.
   **Câu hỏi máy VC-2 (chủ quán chưa trả lời — chat đề xuất gom KH-SUA-2):** (1) thiếu ca thử "đã báo giá → thôi hỏi POS → không ô nào tích" + đột biến cho điều kiện `hoi`
   (code ĐÚNG, chỉ thiếu ca); (2) `GioHang.jsx` `bgCu` không xoá khi báo giá lỗi → lúc chờ báo giá mới thoáng hiện tích / câu đỏ cũ (không đụng tiền). Máy đã hết 3 vòng sửa.
2. Sao lưu Drive: **ĐÃ XONG** — 16.11 tối `thuNgay` thành công; 17.11 chủ quán báo "Đã làm" `KHOA_POS` (khoá `posk_` dán vào Apps Script). Còn `KHOA_GITHUB` (hỏi khi tiện).
3. **Đổi điểm: chủ quán 17.11 "theo POS"** — KH-DOI-1 làm theo hợp đồng ĐÃ HẸN, CÓ hỏi PIN 4 số khi đổi. Chat dựng trang thiết kế KH-DOI-1 → chủ quán duyệt → mở việc
   (sau khi NAP-1 / VC-2 gộp). Thư POS 17.11 `claude/YEU_CAU_APPKH_GUI_POS_17112026.md` (chưa gửi khi viết dòng này): 2 câu voucher (mã trùng `ma_giam` + `vouchers` có giảm 2 lần?
   dạng `expires_at`), 3 đề nghị nạp (`GET /vi` `data[].id`; `GET /don/:ma` dòng nạp `ma_goi`; `GET /don` trường đơn chỉ nạp → ẩn "Đặt lại"), Đổi điểm có PIN, KHOA_POS đã dán.
4. POS trả lời thư 16.11 (`claude/TRA_LOI_POS_16112026_DOIDIEM.md`): hợp đồng ĐÃ HẸN DOI-DIEM-1 (`GET /kho-qua` không token + phần riêng khi có token `con_luot_thang`,
   `du_diem`; `POST /doi-diem` `{ ma_qua, khoa_gui, pin }` — POS đề xuất hỏi PIN khách, chủ quán xác nhận lúc duyệt DOI-DIEM-1; `GET /qua-cua-toi` chỉ phiếu quà hiện vật;
   `/diem` dòng `redeem` / `hoan_qua`); POS GIỮ xét voucher theo thứ tự mảng; "bộ voucher có lợi nhất" → VOUCHER-3 (`tu_chon_voucher`, `bo_voucher`, `vouchers_da_chon`).
   → KH-DOI-1 dựng trang thiết kế được (sau NAP-1 / VC-2, hoặc khi chủ quán muốn). Kế hoạch tuần POS `claude/KE_HOACH_1_TUAN_16112026.md`: đề xuất BỎ QUA-1 (quà khách mới = voucher)
   — chờ chủ quán chốt; nếu bỏ thì việc App KH-VI-2 / phần `qua_chao_mung` cũng bỏ.
5. Thử tay sau gộp: SUA-1, ADMIN-1, THE-3 (như cũ).

### Thiết kế Nạp tiền & Voucher (chủ quán duyệt 16.11 — Artifact https://claude.ai/artifact/Qy5PSiVPvSfCLaRn8viF7G, bản 3 "Đã duyệt")
- 7 màn: 1 Lối vào Ví · 2 Màn Ví · 3 Chọn gói (bảng trượt) · 4 Thanh toán nạp (khuôn THE-3) · 5 Đã nạp · 6 Ví voucher · 7 Giỏ hàng chọn voucher. Cả hai cột chụp từ App THẬT
  (cây main + THE-3) với POS giả; cột đề xuất = mẫu viết bằng lớp CSS của App bơm vào App đang chạy — công cụ Project `claude/cong_cu_chat_chup_app.js` + mẫu
  `claude/mau_thiet_ke_NAP1_VC2.js` (chép vào `viec/<MÃ>/mau_de_xuat.js`).
- Trả lời: N1 a (Ví từ ô Số dư Ưu đãi + ô Ví Tài khoản) · N2 a (bảng trượt) · N3 a (nhãn thưởng "+X" = vao − tra) · N4 a (hết gói → ẩn nút Nạp) · V1 a (chọn ở Giỏ hàng) ·
  V2 a (voucher ship mờ "Dùng khi đặt giao hàng") · **V3 b** (chưa đủ điều kiện → App TỰ BỎ chọn + câu đỏ POS) · **V4 b** (App TỰ CHỌN SẴN mọi voucher dùng được; khách chạm để bỏ,
  App nhớ) · V5 a (nhiều hơn số được dùng → sắp hết hạn trước; POS xét THEO THỨ TỰ mảng — `orders.js kiemVoucherDon`) · Đ1 a (đổi điểm: giữ lịch POS DOI-DIEM-1 sau khai trương, xin
  POS viết hợp đồng trước → KH-DOI-1).

## Tình trạng 17.11.2026 tối (APP-KH main 26cb821 = gộp #44 KH-NAP-1 sau #43 KH-VC-2; sổ v63 — script `xong_VC2_NAP1.py` đưa lên v64)

### Đã xong gần đây
- **#41 KH-ADMIN-1** (16.11 gộp; đầu c9f400b): khu /admin đăng nhập tài khoản POS, Chế độ sửa (✎ / 🔒), bảng sửa tự sinh từ danh mục, Lưu nháp → Cập nhật toàn bộ, lịch sử phiên bản,
  Xuất / Nhập toàn bộ; khách nhận bản nội dung mới lần mở App tới. Soát cuối ĐẠT 15.11 (cổng tinh + chay cả base e6a01ce lẫn base sau SUA-1; màn khách không đổi — so ảnh).
  Chủ quán 16.11: ảnh /admin KHÔNG cần đủ 3 cỡ (chị sửa chủ yếu trên máy tính); K2 sửa theo đề xuất chat (bộ kiểm cửa mạng ở trên). Phát hiện → KH-SUA-2.
- **#40 KH-SUA-1** (16.11 gộp; đầu 43d1686): ô "Chuyển khoản QR" Thanh toán thẻ đổi lớp `tt-qr` / `tt-qr-ic` / `tt-qr-v`; thẻ QR Theo dõi đơn đứng dọc lại. Soát cuối ĐẠT.
- **#39 KH-QC-1** (15.11 gộp; đầu b0205a3): dải + banner quảng cáo đọc `GET /quang-cao`. Còn: `src/quangCao.js` `tachBieuTuong` ghi U+FE0F / U+200D ký tự thật → KH-SUA-2.
- **#38 KH-THE-2**, **#37 KH-THE-1**, **#36 KH-ND-3d** — đã ghi sổ.
- Cây gộp main + SUA-1 + ADMIN-1 (15.11): `--day-du` Chromium 57/0; so 180 ảnh gốc ↔ gộp: chỉ thẻ QR (đúng ý) + hiệu ứng đang chạy.

### Đã gộp 17.11 (#43 VC-2, #44 NAP-1 — xem "Chủ quán đang ở đâu" mục 0–1)
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
- (Ý còn treo từ VC-2) Muốn hiện ưu đãi khách mới TRƯỚC khi nhận → xin POS mở `mo_ta` của mẫu khách mới (cửa công khai) — chưa đưa vào thư nào.
- **KH-DOI-1 — đổi điểm lấy voucher / quà trên App** (chờ; có trong sổ từ 11.11 — quà hiện vật đổi ở QUẦY, App hiện "Đổi tại quầy"): POS ĐÃ viết hợp đồng đã hẹn DOI-DIEM-1 (`claude/TRA_LOI_POS_16112026_DOIDIEM.md`); chủ quán 17.11 "theo POS" + CÓ PIN →
  việc kế tiếp của chat: dựng trang thiết kế (kho quà, đổi có PIN, phiếu quà QR, nhắc hạn) → duyệt → mở (Opus, [T] — đụng điểm). Quầy vẫn đổi giúp tới khi POS gộp DOI-DIEM-1.
- **KH-HUY-1** (Sonnet): đơn bị quán huỷ theo v14 (`hoan_vao_tai_khoan`, `ly_do_huy`); NAP-1 đã gộp 17.11 → MỞ ĐƯỢC (cùng `TheoDoiDon.jsx`; soạn phiếu khi chủ quán muốn).
- **KH-SUA-2 — gom lỗi nhỏ** (Sonnet, chờ; ghi sổ 16.11): (1) đổi tên lễ ở /admin mất gợi ý quà (`kh.leQua` khớp TÊN) + đổi tên 1 trong 3 ngày Tết → Tết hiện 2 lần (`holList` gộp
  TÊN) → khớp theo mã; (2) nút ✕ xoá dòng giỏ (`GioHang.jsx`) gắn `data-nd`; (3) `public/sw.js` bỏ `/kiemkhop`; (4) `quangCao.js` viết `️` / `‍`; (5) Chào mừng hạn POS
  hiện 2 lần (ở trên); (6) nhãn admin `ud.the.chipDb` "(chưa có hạng)" sai nghĩa; (7) chú thích đầu `KiemKhop.jsx`. Chủ quán: tạm ĐỪNG đổi tên ngày lễ / Tết ở /admin.
  **POS trả lời 19.11 (`thiet_ke/trao_doi/TRA_LOI_POS_19112026.md`, script 26.11 chép):** mã trùng `ma_giam` + `vouchers` → POS ĐÃ chống trùng, giảm MỘT lần,
  báo ở dòng `giam[] loai "ma_giam"` (KHÔNG có dòng `voucher`) → khi soạn phiếu KH-SUA-2 mục (10): ngoài bỏ mã ô mã khỏi `vouchers`, ô voucher trùng mã ô mã phải hiện
  "đang dùng" (hôm nay `trangThaiVoucher` → 'cho' vì không có dòng `voucher`) + ca thử. `expires_at` = `YYYY-MM-DD` (chỉ ngày, dùng tới hết ngày) — App xếp / hiện ĐÚNG
  (`dinhDangNgay` nhận chỉ ngày); bài thử VC-2 dùng dạng có giờ → KH-SUA-2 thêm ca dạng chỉ ngày. 3 đề nghị (`/vi` `id`, `/don/:ma` `ma_goi` / `hang_id` + `so_thang`,
  `/don` `chi_nap`) + hợp đồng Đổi điểm (PIN chốt) → việc POS **KH-API-4** sau bán theo kho / bịt lỗ tiền; có thư khi gộp. Gói Render: POS ghi giá + vùng (cùng vùng
  máy chủ + kho, không có cả hai thì giữ Virginia). Kho POS ở lại `pos-tqd` (không chép `pos-tqd2`) → số đo 18.11 17:40 là số cuối.
  **Thêm (chat đề xuất 17.11, script `xong_VC2_NAP1.py` ghi sổ):** (8) VC-2: ca "đã báo giá → thôi hỏi → không ô nào tích" + đột biến `hoi`; (9) VC-2: `GioHang.jsx` xoá `bgCu` khi báo giá
  lỗi; (10) App loại mã đang ở ô mã khỏi `vouchers` (dù POS trả lời thế nào); (11) NAP-1: `hien.nap.dn` tắt thì không câu "đã xong" (như `hien.the.cm`) — xem lại cùng thẻ.
- **Thứ tự gộp:** THE-3 (xong) → **VC-2 → script gộp main vào NAP-1 → NAP-1** (17.11); HUY-1 sau (đụng `TheoDoiDon.jsx` như NAP-1 — mở sau NAP-1); SUA-2 khi rảnh.

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
- **Hợp đồng `/api/kh`:** POS main PHIEN_BAN **17** (7cf48ee, 16.11: KH-NAP-1 — `GET /goi-nap`, `GET /vi`, dòng nạp, thẻ chỉ tiền thật `THE_KHONG_TRA_VI`, tiền về muộn đúng số tự chốt đủ quyền lợi); v15 VOUCHER-2, v16 QC-APP-1, v14 HUY-1. Bản trong kho App = v17 (script 16.11 chép).
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

## Quyết định 10–26.11 (đủ ở `thiet_ke/QUYET_DINH_APPKH.md` — mục 19.11 + 26.11 do `xong_KHNHANH2.py` ghi)
- **26.11:** thử tay D6 hoãn tới khi POS bán hàng được.
- **19.11:** vòng xoay không có nút tắt ở /admin; ẩn vòng khi màn mở đang hiện; không cài `danhThucPOS` (lên gói trả phí); KH-API-4 của POS gom 3 đề nghị + hợp đồng Đổi điểm (PIN).
- **18.11:** chờ POS kiểu B — chỉ vòng xoay, không nền, không mờ (KH-NHANH-2).
- **17.11 (script `xong_VC2_NAP1.py` ghi):** Sao lưu = đã dán `KHOA_POS`; Đổi điểm = theo hợp đồng POS đã hẹn, CÓ hỏi PIN khách; thứ tự gộp VC-2 → NAP-1 (chat gộp main vào NAP-1).
- **16.11:** bộ kiểm cửa mạng 4 lớp (K2 cũ chỉ soi một kiểu viết nên `${gốc}/api/nd` lọt — máy tự báo); ảnh /admin không cần 3 cỡ; tạm không đổi tên ngày lễ / Tết ở /admin;
  soát cuối chạy bài thử trên cây GỘP.
- **15.11:** thẻ Vàng & Kim Cương duyệt (KH-THE-3); câu "giảm gì / ưu đãi gì" luôn lấy từ POS (`mo_ta`); sao lưu lưu HẾT về Drive; KH-SL-1 bỏ; khai trương ~04.12.
- **14.11:** thẻ hội viên theo trang so sánh (KH-THE-2); thẻ KHÔNG trả bằng số dư — QR trên App, tiền mặt / chuyển khoản ở quầy; thẻ không dùng mã giảm trên App.
- Nội dung sửa trực tiếp ở App (/admin), KHÔNG đụng phần POS; Lưu nháp → "Cập nhật toàn bộ" → giữ mọi phiên bản; quyền sửa trong Phân quyền POS. Thêm gì cũng phải sửa được ở /admin.
- Banner luôn ánh sáng; dải kiểu A; vệt sáng luôn chạy. Văn khấn: Tín chủ = họ tên tài khoản, Địa chỉ = địa chỉ tài khoản. Mật khẩu đăng nhập + giữ đăng nhập 90 ngày (MATKHAU-1).
- Google: hồ sơ CHƯA xác minh → xác minh bằng video trước khai trương (`claude/HUONG_DAN_XAC_MINH_GOOGLE.md`).

## Chủ quán đang nợ / cần làm
- (26.11) Chạy `xong_KHNHANH2.py` (sổ v66). Thử tay D6 KHI POS bán hàng được (chat nhắc). Chọn việc kế: a KH-DOI-1 / b KH-HUY-1 / c KH-SUA-2.
- (đã làm 26.11) Merge PR #45 KH-NHANH-2.
- (đã làm 18–19.11) Chạy `mo_KHNHANH2.py` → mở phiên Claude Code OPUS nhánh `viec/KH-NHANH-2`, gõ `/lam-viec KH-NHANH-2` → gửi thư POS 18.11 (và 17.11 nếu chưa gửi).
- (đã làm 18.11) `xong_VC2_NAP1.py` (sổ v64); thử tay Nạp tiền + Voucher OK.
- (đã làm 17.11) Merge VC-2 → `gop_VC2_vao_NAP1.py` → Merge NAP-1.
- (cũ, đã làm) Trả lời 8 câu trang Nạp tiền & Voucher → chạy script mở việc → thử tay SUA-1 / ADMIN-1 / THE-3 (mục "Chủ quán đang ở đâu").
- Sao lưu: `KHOA_POS` ĐÃ dán (17.11); còn tạo `KHOA_GITHUB` (khi nhật ký báo tải mã nguồn thiếu).
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
