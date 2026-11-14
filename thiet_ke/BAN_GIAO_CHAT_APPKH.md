# Bàn giao chat App KH (cập nhật 14.11.2026 tối)

<!-- Bản MỚI NHẤT nằm ở Project (claude/BAN_GIAO_CHAT_APPKH.md). Bản trong kho APP-KH (thiet_ke/BAN_GIAO_CHAT_APPKH.md) do script ghi-xong chép — có thể cũ hơn Project. -->

## Prompt chuyển chat (chủ quán dán nguyên văn vào chat mới, trong Project "APP KH - CLAUDE AUTONOMOUS")
> Đây là chat App KH mới, tiếp nối chat cũ. Đọc file Project `claude/BAN_GIAO_CHAT_APPKH.md` rồi làm đúng mục "Bắt đầu chat mới" trong đó. Luôn giải thích dễ hiểu câu hỏi của máy, đề xuất câu trả lời của bạn để tôi quyết định; trả lời từng bước cụ thể.

## Bắt đầu chat mới
1. Đọc hết file này. Rồi `git clone https://github.com/tuquyduong/APP-KH` (đọc được, KHÔNG có quyền GitHub API — `gh` báo 403; chỉ dùng `git fetch`). Đọc: `CLAUDE.md` (nhất là §5, §8–§11),
   `thiet_ke/QUYET_DINH_APPKH.md` (mục 12.11 → 14.11), `TIEN_DO_APPKH.json` (sổ việc), `thiet_ke/trao_doi/` (thư mới nhất).
2. `git clone --depth 50 https://github.com/pos-tuquyduong/pos-tuquyduong` (công khai, chỉ đọc): `LICH_KHAI_TRUONG.md`, `TIEN_DO_POS.json`, `HOP_DONG_API_KH.md`
   (POS main 1a714246 = **v16** — v15 để dành VOUCHER-2; bản chép trong kho App = **v13**, KH-QC-1 chép v16) và `HOP_DONG_API_ND.md` (**v1**, hợp đồng RIÊNG của kho nội dung `/api/nd`).
   Kho POS nhiều nhánh — chỉ đọc main.
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
- **Khuôn script ở Project** (copy rồi sửa, đừng viết lại): `claude/xong_DOT7_mo_KHTHE2.py` (MỚI NHẤT: ghi việc xong — commit gộp có `^2` = đầu nhánh đã soát, hoặc đầu nhánh sau script gộp
  kiểm theo CÂY — + mở việc mới + chép thư vào `thiet_ke/trao_doi/` + chép bàn giao; tệp nhúng nén zlib + base64 + vân tay sha256), `claude/mo_KHTHE1.py` (chỉ mở việc),
  `claude/gop_KHUI5f.py` (gộp main vào nhánh khi xung đột: ghi bản giải đã tính sẵn, KIỂM CÂY GỘP, commit "GOP-<MÃ> gop main …" + commit "HEAD ĐÃ KIỂM: <commit gộp>" — **kèm sửa
  `SỐ CA` trong `bang_chung_do.txt` khi main thêm ca vào bài cũ mà nhánh có sửa**), `claude/sua_KHUI5f_bokhoa.py` (chủ quán đổi ý sau khi máy làm), `claude/khung_duyet_the.py` (duyệt
  kế hoạch: commit "PHIEU" kèm tệp nhúng + phiếu đã duyệt).
- **Soát cuối** (trước khi bảo chủ quán Merge): thư mục có `goc/` (main = base PR, `npm ci` một lần) + `pr/` (nhánh, chép `node_modules`) →
  `node goc/tu_chay/cong.js tinh pr <BASE> <HEAD> viec/<MÃ>` và `KHONG_TRINH_DUYET=1 node goc/tu_chay/cong.js chay …` (chạy nền `nohup bash -c "…" &`, ~5 phút / nhánh); gộp thử
  MỌI nhánh đang mở theo thứ tự định gộp; `node kiem_tra_truoc_khi_giao.js --day-du` CÓ Chromium trên cây gộp (~15 phút, chạy nền); **chạy lại cổng `chay` trên nhánh SAU script gộp**
  (base = main mới); đọc diff (màn tiền: chỉ đổi chữ, không đổi logic); xem ảnh `viec/<MÃ>/so_anh/`. Máy KHÔNG được `git merge`.
- Luật cổng hay vấp: A7 (phiếu chỉ đổi ở commit "PHIEU: <MÃ>"), A11 (bài sửa phải đỏ trên gốc), A16 (SỐ CA theo `KHONG_TRINH_DUYET=1`, ở head), **A19** (`HEAD ĐÃ KIỂM: <SHA>` ĐẦU DÒNG,
  là dòng cuối có dạng đó; commit gộp main sau lần kiểm cũng tính là đổi code; commit chỉ đổi `viec/<MÃ>/` sau đó thì được). **"## Bài thử cũ sửa"**: cổng chạy BẢN GỐC bài cũ trên code PR
  và đòi XANH — bài cũ đỏ trên PR thì KHÔNG dùng mục này (sẽ đỏ A11), sửa thẳng bài cũ.
- **K10 "chữ cứng chỉ được giảm"** (`cong_cu/no_chu_cung.txt`, `cong_cu/ha_no_chu.js`): tệp hết chữ GIỮ dòng số 0. Giải xung đột: số nợ = số đếm thật bằng bộ đếm của main.
- **Luật "Thêm gì cũng phải sửa được ở /admin"** (CLAUDE.md §11): mọi chữ / ảnh / nút / danh sách / khối mới khai mục danh mục `src/noiDung/nd/<nhóm>.js` NGAY; soát cuối thiếu là KHÔNG ĐẠT.
- KHÔNG sửa kho POS. Cần POS → `YEU_CAU_APPKH_GUI_POS_<ngày>.md` (lưu Project + tệp tải về cho chủ quán gửi); POS trả `TRA_LOI_POS_<ngày>.md` → lưu Project + chép vào
  `thiet_ke/trao_doi/` ở script kế tiếp.
- Câu hỏi của máy → kể lại bằng lời thường + đề xuất của chat → chị quyết; đã quyết thì ghi sổ, không hỏi lại. Chị muốn: "hệ thống thông minh, code chuẩn, đơn giản, không lằng nhằng".
  Muốn xem giao diện trước khi làm → dựng trang HTML so sánh (Artifact) "Hiện tại | Đề xuất" từng màn, lật qua lại trên điện thoại. Project gần đầy — chỉ lưu script / phiếu cần thiết.

## Tình trạng 14.11.2026 tối (main 474eda6 = sổ v59 sau `xong_DOT7_mo_KHTHE2.py`; script `mo_KHADMIN1_KHQC1.py` đưa lên v60)
- **Ba việc chạy song song:** KH-THE-2 (Opus — kế hoạch 88d5262 chat duyệt 14.11, script `claude/duyet_KHTHE2.py`: Q1 thêm `src/dangKySW.js`, Q2 giữ `DauManCon`) ·
  **KH-ADMIN-1** (Opus, CÓ chờ duyệt kế hoạch; hạn 20.11; phiếu `claude/phieu_KH-ADMIN-1.md`, hợp đồng nd v1 nhúng) · **KH-QC-1** (Sonnet, chạy thẳng; hạn 17.11; hợp đồng v16 nhúng).
  Chia tệp: THE-2 sửa màn thẻ / Thanh toán / Ưu đãi; ADMIN-1 KHÔNG sửa màn khách (chữ thiếu `data-nd` → "Chữ của màn này"), chỉ dòng `/admin` ở App.jsx / duongDan.js, hàm `goi` ở api.js;
  QC-1 chỉ phần quảng cáo ở App.jsx, `layQuangCao` + `CUA_CONG_KHAI` ở api.js, `quangCao.js`. Xung đột còn lại khi gộp: `cong_cu/no_chu_cung.txt`, có thể `App.jsx` — dùng khuôn gộp.
- **Thêm việc KH-HUY-1** (Sonnet, chờ THE-2 + QC-1): App chưa hiện đơn bị quán huỷ theo hợp đồng v14 (`hoan_vao_tai_khoan`, `ly_do_huy` — "Đã hoàn <số> vào tài khoản").
- **POS 14.11:** ND-API-1 gộp (#93, kho nội dung `/api/nd` v1, quyền nd_xem / nd_sua / nd_cap_nhat / nd_xuat_nhap, khoá sao lưu `ndk_…` chỉ `GET /xuat` → KH-SL-1 mở được khi cần);
  QC-APP-1 gộp (hợp đồng `/api/kh` v16). CORS `/api/nd` chỉ tuquyduong.com + app-kh.pages.dev → /admin chỉ thử thật được sau khi gộp main.
- **Trước đó (sáng 14.11):**
  - Đã gộp #36 KH-ND-3d (đầu 3380dc7), #37 KH-THE-1 (đầu a9d98b7 sau `gop_KHTHE1.py`, cây gộp c54750c2). Script DOT7 ghi hai việc xong + mở **KH-THE-2** + QĐ 14.11 + thêm việc
  KH-THU-2 (bài thử không phụ thuộc lịch sử git — từ Câu hỏi 4 của THE-1) + chép thư 13.11 / 14.11 vào `thiet_ke/trao_doi/` + chép bàn giao này.
- **KH-THE-2** (Opus, việc TIỀN — CÓ chờ duyệt kế hoạch; hạn 18.11): làm theo trang so sánh chủ quán duyệt 14.11 (Artifact "So sánh thẻ hội viên"
  https://claude.ai/artifact/Ddrw9SiX95XhW3KJWXfRWR; bản chép cho máy: `viec/KH-THE-2/ban_thiet_ke.html`). So sánh nhanh lên đầu màn Hạng thành viên (Thường / các hạng: giảm mọi đơn,
  món nhóm đặc biệt, "Chi 1 triệu, tiết kiệm", giá; chạm cột chọn hạng); Mua ngay → Thanh toán thẻ `/uudai/hang/thanhtoan?h=&thang=` (thẻ KHÔNG vào giỏ, bỏ "Trả thẻ trước"; chỉ QR,
  không ví / PIN / mã giảm, không phần nhận hàng); trả xong → màn "Chào mừng hội viên" (trạng thái xong của Theo dõi đơn chỉ thẻ); thẻ Ưu đãi lên đầu, 4 trạng thái, một nút.
  Máy dừng ở kế hoạch → chủ quán dán → chat duyệt (khuôn `claude/khung_duyet_the.py` nếu cần nhúng tệp).
- **Kiểm POS thật 14.11 (trình duyệt):** `/hang`: Kim Cương id 3 (`thu_bac` 2, chỉ cấp, 10%), Hạng vàng id 6 (`thu_bac` 3; gói 1 tháng 100.000 / 3 tháng 295.000; 3% + nhóm đặc biệt 4%),
  Hạng Ruồi id 7 (`thu_bac` 4; 2.000đ) → **thứ bậc ngược** (khách Kim Cương mua Vàng sẽ tụt hạng) — chủ quán sửa ▲▼ ở POS, tắt Hạng Ruồi, nhập quyền lợi; % và giá là số thử.
- **Thẻ trả bằng số dư:** POS main VẪN cho (App: v13 `cach_tra` vi / vi_qr; quầy: `orders.js` `membership_buy` không chặn balance) → thư `claude/YEU_CAU_APPKH_GUI_POS_14112026.md`
  (chủ quán đã tải về gửi chat POS 14.11; mục 3 thư = trả lời thư QC 13.11). App ẩn ví cho thẻ trong KH-THE-2; mã lỗi mới của POS → App chỉ hiện lời.
- **Chờ POS** (lịch POS): VOUCHER-2 (v15) → App nhiều voucher / đơn · COMBO-1a → App combo · TOPPING-1 → KH-GHICHU-1 + topping · KH-NAP-1 + QUA-1 → KH-NAP-1 + KH-VI-2 ·
  GIOVANG-1 `gia_mon[]` → giá Giờ vàng từng món · KH-MUA-2 · MATKHAU-1 (~20–21.11) → KH-MK-1 · chặn trả thẻ bằng số dư (thư 14.11) → App chỉ hiện lời. Sau khai trương: DOI-DIEM-1,
  QUET-2, GIOI-THIEU-1, QUA-TANG-1, CHU-KHACH-1.
- **Khai trương:** thực tế khoảng T5 03.12 (POS 11.11). Đánh giá chi tiết: `claude/DANH_GIA_TIEN_DO_11112026.md`.

## Quyết định 10–14.11 (đủ ở `thiet_ke/QUYET_DINH_APPKH.md`)
- **14.11:** thẻ hội viên theo trang so sánh đã duyệt (KH-THE-2) — thay QĐ 08.11 / 12.11 "thẻ chung giỏ, Trả thẻ trước"; **thẻ KHÔNG trả bằng số dư** (tiền nạp có thưởng) — QR trên App,
  tiền mặt / chuyển khoản ở quầy; thẻ không dùng mã giảm trên App.
- Nội dung sửa trực tiếp ở App (/admin), KHÔNG đụng phần POS; mở hết chữ; Lưu nháp → "Cập nhật toàn bộ" → giữ mọi phiên bản; quyền sửa trong Phân quyền POS; kho nội dung "ở nhờ POS nhưng
  xây như nhà riêng"; sao lưu mỗi đêm (KH-SL-1); /admin TRƯỚC khai trương. Thêm gì cũng phải sửa được ở /admin (CLAUDE.md §11).
- Banner luôn ánh sáng; dải kiểu A; vệt sáng luôn chạy. Chu kỳ KHÔNG khoá mã; ô tiện ích ẩn thì link cũng không mở. Văn khấn: Tín chủ = họ tên tài khoản, Địa chỉ = địa chỉ tài khoản.
- Mật khẩu đăng nhập + giữ đăng nhập 90 ngày (POS MATKHAU-1); đổi điểm: voucher ở App / quầy, quà hiện vật đổi ở quầy; QUET-2 làm theo lịch POS.
- Google: hồ sơ CHƯA xác minh → xác minh bằng video trước khai trương (`claude/HUONG_DAN_XAC_MINH_GOOGLE.md`); API chỉ xin được khi hồ sơ đã xác minh ≥ 60 ngày.

## Chủ quán đang nợ / cần làm
- POS › Cài đặt › Hạng thành viên: ▲▼ Kim Cương lên trên cùng (rồi Hạng vàng, Hạng Ruồi), thử xong tắt Hạng Ruồi, nhập Quyền lợi từng hạng, đặt % và giá gói thật.
- Gắn tên miền **tuquyduong.com** vào Cloudflare Pages (KH-CF-1) — dán địa chỉ vào Cài đặt hoá đơn POS khi xong.
- Xác minh hồ sơ Google khi biển hiệu lắp xong → gửi link nhận đánh giá. Số điện thoại / Zalo / email hỗ trợ (mục Hỗ trợ đang ẩn vì trống).
- Thử tay: Mã thành viên quét ở quầy; Xe cộ / Uống thuốc / Chu kỳ / Văn khấn; Thanh toán đơn thẻ trên điện thoại (14.11 thấy "Tổng tiền sẽ hiện khi quán xác nhận" — có thể chụp trước khi báo
  giá về; còn kẹt thì báo chat).

## Ghi chú kỹ thuật cho việc sau
- KH-ND-3c: `kh_chuong_trinh` (thông tin công khai) ngoài `luuMay.js`, không hạn dùng — chấp nhận.
- KH-ND-3e: chưa chắc dải "Đơn đã sẵn sàng" có bị thanh tab che trên máy thật → thử tay.
- Đề xuất bộ kiểm K11 (đường dẫn ảnh `/anh/…` viết thẳng ngoài `src/noiDung` "chỉ được giảm") + cổng so `no_chu_cung.txt` với gốc nhánh (chặn nâng tay) — gom một việc sau.
- Sandbox của chat: thư mục nháp mất khi phiên kết thúc — mọi script / phiếu đã lưu ở Project `claude/`.
