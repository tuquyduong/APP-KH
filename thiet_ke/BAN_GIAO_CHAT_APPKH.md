# Bàn giao chat App KH (cập nhật 12.11.2026 chiều)

<!-- Bản MỚI NHẤT nằm ở Project (claude/BAN_GIAO_CHAT_APPKH.md). Bản trong kho APP-KH (thiet_ke/BAN_GIAO_CHAT_APPKH.md) do script xong_DOT6_mo_KHND3d.py chép (12.11) —
     script kế tiếp chép bản Project mới hơn (nếu có) vào thiet_ke/ cho khớp. -->

## Prompt chuyển chat (chủ quán dán nguyên văn vào chat mới, trong Project "APP KH - CLAUDE AUTONOMOUS")
> Đây là chat App KH mới, tiếp nối chat cũ. Đọc file Project `claude/BAN_GIAO_CHAT_APPKH.md` rồi làm đúng mục "Bắt đầu chat mới" trong đó. Luôn giải thích dễ hiểu câu hỏi của máy, đề xuất câu trả lời của bạn để tôi quyết định; trả lời từng bước cụ thể.

## Bắt đầu chat mới
1. Đọc hết file này. Rồi `git clone https://github.com/tuquyduong/APP-KH` (đọc được, KHÔNG có quyền GitHub API — `gh` báo 403; chỉ dùng `git fetch`). Đọc: `CLAUDE.md` (nhất là §5, §8–§11),
   `thiet_ke/QUYET_DINH_APPKH.md` (mục 10.11 → 12.11), `TIEN_DO_APPKH.json` (sổ việc), `thiet_ke/trao_doi/` (thư mới nhất).
2. `git clone --depth 50 https://github.com/pos-tuquyduong/pos-tuquyduong` (công khai, chỉ đọc): `LICH_KHAI_TRUONG.md` (lịch POS theo ngày), `TIEN_DO_POS.json`, `HOP_DONG_API_KH.md`
   (POS đang **v13**; bản chép trong kho App còn **v11**!). Kho POS có 87 nhánh — đừng fetch từng nhánh (quá 2 phút); đọc `TIEN_DO_POS.json` trên main là đủ.
3. Xem App thật: sandbox KHÔNG vào được app-kh.pages.dev (proxy 403) → dùng **trình duyệt trong app Claude trên máy chủ quán** (công cụ `Claude_Browser__*`: `preview_start`
   rồi `javascript_tool` để đo). POS thật: `https://www.pos-tuquyduong.io.vn`.
4. Fetch nhánh đang chạy (mục Tình trạng) → xem máy làm tới đâu → báo chủ quán vài dòng: đang ở đâu, chị cần làm gì tiếp.

## Vai trò chat App KH (giữ nguyên cách làm)
- Soạn phiếu `viec/<MÃ>/phieu.md` + script Python chủ quán chạy ở **Shell Replit POS** (`~/workspace`). Script tự dùng / tự tải kho về `~/APP-KH`, không ghi gì kho POS, kiểm từng bước,
  lệch thì DỪNG + trả về như cũ, **chạy lại an toàn**, **tự xoá** sau khi xong. Máy Claude Code làm việc theo phiếu (`/lam-viec <MÃ>` trên đúng nhánh `viec/<MÃ>`), chạy thẳng tới hết.
- Máy hay DỪNG GIỮA CHỪNG mà không hỏi gì (vd đang chờ bài thử chạy nền) → chủ quán dán log; chat đưa câu nhắn "Làm tiếp … tới hết bước N, không dừng" để chủ quán gõ vào máy.
- **Thử MỌI script trên GitHub giả trước khi gửi:** `git init --bare <tmp>/gh/tuquyduong/APP-KH.git` (đường dẫn phải chứa `tuquyduong/APP-KH`), `git push` các ref THẬT vào đó,
  `symbolic-ref HEAD refs/heads/main`, clone vào `<tmp>/home/APP-KH` (đặt `user.email` / `user.name`), chạy `HOME=<tmp>/home python3 <bản chép>.py` (chép script ra file khác — script tự xoá).
  Giả lập GitHub gộp PR bằng `merge --no-ff -m "Merge pull request #N from tuquyduong/viec/<MÃ>"`. Chạy lại lần 2 phải ra "XONG TỪ TRƯỚC". Sau đó chạy cổng `tinh` + `chay` trên nhánh kết quả.
- **Khuôn script ở Project** (copy rồi sửa, đừng viết lại): `claude/mo_DOT5.py` (mở nhiều việc), `claude/xong_DOT6_mo_KHND3d.py` (ghi việc xong — tìm commit gộp có `^2` = đầu nhánh
  đã soát, hoặc nhận đầu nhánh sau script gộp theo CÂY — + mở việc mới + chép bàn giao; sinh bằng `tao_xong.py` nhúng phiếu base64), `claude/gop_KHUI5f.py` (gộp main vào nhánh khi
  xung đột: ghi bản giải đã tính sẵn, KIỂM CÂY GỘP = cây chat đã chạy đủ bài thử, commit "GOP-<MÃ> gop main …" + commit "HEAD ĐÃ KIỂM: <commit gộp>" — **kèm sửa `SỐ CA` trong
  `bang_chung_do.txt` khi main thêm ca vào bài cũ mà nhánh có sửa**: cổng A16 đếm số ca ở head SAU gộp), `claude/sua_KHUI5f_bokhoa.py` (chủ quán đổi ý sau khi máy làm).
- **Soát cuối** (trước khi bảo chủ quán Merge): thư mục có `goc/` (main = base PR, `npm ci` một lần) + `pr/` (nhánh, chép `node_modules`) →
  `node goc/tu_chay/cong.js tinh pr <BASE> <HEAD> viec/<MÃ>` và `KHONG_TRINH_DUYET=1 node goc/tu_chay/cong.js chay …` (chạy nền bằng `nohup bash -c "…" &`, ~5 phút / nhánh); gộp thử
  MỌI nhánh đang mở theo thứ tự định gộp; `node kiem_tra_truoc_khi_giao.js --day-du` CÓ Chromium trên cây gộp (~15 phút, chạy nền); **chạy lại cổng `chay` trên nhánh SAU script gộp**
  (base = main mới) — lần 12.11 nhờ bước này mới thấy A16 đỏ; đọc diff (màn tiền: chỉ đổi chữ, không đổi logic); xem ảnh `viec/<MÃ>/so_anh/`. Máy KHÔNG được `git merge`.
- Luật cổng hay vấp: A7 (phiếu chỉ đổi ở commit "PHIEU: <MÃ>"), A11 (bài sửa phải đỏ trên gốc), A16 (SỐ CA theo `KHONG_TRINH_DUYET=1`, ở head), **A19** (`HEAD ĐÃ KIỂM: <SHA>` ĐẦU DÒNG,
  không gạch đầu dòng, là dòng cuối có dạng đó; commit gộp main sau lần kiểm cũng tính là đổi code; commit chỉ đổi `viec/<MÃ>/` sau đó thì được), "Bài thử cũ sửa" chỉ khi bài cũ vẫn xanh.
- **K10 "chữ cứng chỉ được giảm"** (`cong_cu/no_chu_cung.txt`, `cong_cu/ha_no_chu.js`): từ KH-ND-3c tệp hết chữ GIỮ dòng số 0 (bớt xung đột). Giải xung đột: số nợ mỗi tệp = số đếm thật
  bằng bộ đếm của main (`demTatCa` vs `docNo` lệch 0, `vietNo(docNo)` = tệp). Bộ đếm main (sau KH-ND-3b) đếm nhiều hơn bộ đếm cũ trên nhánh cũ → đừng lấy số của nhánh.
- **Luật "Thêm gì cũng phải sửa được ở /admin"** (CLAUDE.md §11): mọi chữ / ảnh / nút / danh sách / khối mới khai mục danh mục `src/noiDung/nd/<nhóm>.js` NGAY; soát cuối thiếu là KHÔNG ĐẠT.
- KHÔNG sửa kho POS. Cần POS → `YEU_CAU_APPKH_GUI_POS_<ngày>.md` (chủ quán chuyển); POS trả `TRA_LOI_POS_<ngày>.md` → lưu Project + chép vào `thiet_ke/trao_doi/` ở script kế tiếp.
- Nói với chủ quán: tiếng Việt dễ hiểu, ít thuật ngữ, từng bước đánh số; câu hỏi của máy → kể lại bằng lời thường + đề xuất của chat → chị quyết; đã quyết thì ghi sổ, không hỏi lại.
  Chị muốn: "hệ thống thông minh, code chuẩn, đơn giản, không lằng nhằng". Project gần đầy (~1,7 / 2 MB) — chỉ lưu script / phiếu cần thiết.

## Tình trạng 12.11.2026 chiều
- **Đợt 6:** KH-ND-3c (chữ Ưu đãi / Tài khoản / Hồ sơ / Hỗ trợ / Đăng nhập / Mã thành viên / Trắc nghiệm; QR dễ quét; vệt sáng luôn chạy) + KH-UI-5f (Xe cộ, Uống thuốc, Chu kỳ
  không khoá, Văn khấn điền sẵn) — chat soát ĐẠT 12.11; thứ tự gộp: PR 3c → `gop_KHUI5f.py` → PR 5f → `xong_DOT6_mo_KHND3d.py` (ghi xong + mở KH-ND-3d, sổ v57).
- **KH-ND-3d** (Sonnet, hạn 15.11): Kế hoạch + mọi tiện ích vào danh mục (ngày lễ, theo mùa, tiết khí, văn khấn thành mục sửa được; lịch cố định sang `src/noiDung/coDinh/lich.js`),
  ô ẩn thì link cũng không mở, GiaMon bỏ cắt chữ "đ", `tel:` Theo dõi đơn. Sau 3d chữ cứng chỉ còn `src/tracNghiem.js` (chuyên môn, khoá).
- **Việc chat làm tiếp:** soạn phiếu **KH-ADMIN-1** (Opus — /admin Chế độ sửa; POS ND-API-1 gộp ~15.11, tên cửa / bảng / mã lỗi theo thư `YEU_CAU_APPKH_GUI_POS_11112026.md`;
  hợp đồng RIÊNG `HOP_DONG_API_ND.md` v1 khi POS gộp; gắn `data-nd` cho DauManCon / Thongbao; bảng sửa không cắt khoảng trắng) và **KH-THE-1** (Opus — bán thẻ hạng trên App,
  hợp đồng v13 chép nguyên văn sang `thiet_ke/HOP_DONG_API_KH.md`). Hai việc cùng đụng `App.jsx` / `duongDan.js` → chia rõ dòng / tệp của nhau hoặc chạy nối nhau.
- **Chờ POS** (lịch POS 09.11 + 11.11; App ~1 ngày sau mỗi hợp đồng): QC-APP-1 v14 → KH-QC-1 · VOUCHER-2 → App nhiều voucher / đơn (**thêm việc**) · COMBO-1a → App combo (**thêm việc**) ·
  TOPPING-1 → KH-GHICHU-1 + topping · KH-NAP-1 + QUA-1 → KH-NAP-1 + KH-VI-2 · GIOVANG-1 `gia_mon[]` → giá Giờ vàng từng món (**thêm việc**) · KH-MUA-2 · MATKHAU-1 (~20–21.11) → KH-MK-1 ·
  ND-API-1 (~15.11) → KH-ADMIN-1 + KH-SL-1. Sau khai trương: DOI-DIEM-1 → KH-DOI-1 · QUET-2 → KH-QUET-2 · GIOI-THIEU-1 → KH-GT-1 · QUA-TANG-1 → KH-QUA-1 · CHU-KHACH-1 → KH-CHU-MA-1.
- **Khai trương:** POS 11.11 — sớm nhất T7 28.11, **thực tế khoảng T5 03.12**. Đánh giá chi tiết: `claude/DANH_GIA_TIEN_DO_11112026.md`.

## Quyết định 10–12.11 (đủ ở `thiet_ke/QUYET_DINH_APPKH.md`)
- Nội dung sửa trực tiếp ở App (/admin), KHÔNG đụng phần POS; mở hết chữ; Lưu nháp → "Cập nhật toàn bộ" → giữ mọi phiên bản, quay lại được; quyền sửa trong Phân quyền POS; kho nội dung
  "ở nhờ POS nhưng xây như nhà riêng"; sao lưu mỗi đêm bằng khoá chỉ đọc (KH-SL-1); /admin TRƯỚC khai trương.
- Thêm gì cũng phải sửa được ở /admin (CLAUDE.md §11). Banner luôn ánh sáng; dải kiểu A; vệt sáng luôn chạy. Chu kỳ KHÔNG khoá mã; ô tiện ích ẩn thì link cũng không mở.
  Văn khấn: Tín chủ = họ tên tài khoản (không xưng hô), Địa chỉ = địa chỉ tài khoản, Họ gia tiên = chữ đầu họ tên, sửa được, chỉ trên máy.
- Mật khẩu đăng nhập + giữ đăng nhập 90 ngày (POS MATKHAU-1); đổi điểm: voucher ở App / quầy, quà hiện vật đổi ở quầy (App hiện nút "Đổi tại quầy"); QUET-2 làm theo lịch POS.
- Google: hồ sơ CHƯA xác minh → xác minh bằng video trước khai trương (hướng dẫn: `claude/HUONG_DAN_XAC_MINH_GOOGLE.md`); API chỉ xin được khi hồ sơ đã xác minh ≥ 60 ngày.

## Chủ quán đang nợ / cần làm
- Gắn tên miền **tuquyduong.com** vào Cloudflare Pages (KH-CF-1, chờ từ 06.11) — dán địa chỉ vào Cài đặt hoá đơn POS khi xong.
- Xác minh hồ sơ Google khi biển hiệu lắp xong → gửi link nhận đánh giá.
- Số điện thoại / Zalo / email hỗ trợ (mục Hỗ trợ đang ẩn vì trống).
- Thử tay: Mã thành viên quét ở quầy (chậm → phóng to `.khung-qr`), màn không tự tắt; đóng hẳn App mở lại — banner hiện ngay tên chương trình; máy tính tắt hiệu ứng vẫn thấy vệt sáng;
  Xe cộ / Uống thuốc / Chu kỳ / Văn khấn (5f).

## Ghi chú kỹ thuật cho việc sau
- KH-ND-3c: `kh_chuong_trinh` (thông tin công khai) ngoài `luuMay.js`, không hạn dùng — chấp nhận; DauManCon / Thongbao chưa `data-nd` → KH-ADMIN-1.
- KH-ND-3e: chưa chắc dải "Đơn đã sẵn sàng" có bị thanh tab che trên máy thật → thử tay.
- Đề xuất bộ kiểm K11 (đường dẫn ảnh `/anh/…` viết thẳng ngoài `src/noiDung` "chỉ được giảm") + cổng so `no_chu_cung.txt` với gốc nhánh (chặn nâng tay) — gom một việc sau.
- Sandbox của chat: thư mục nháp mất khi phiên kết thúc — mọi script / phiếu đã lưu ở Project `claude/`.
