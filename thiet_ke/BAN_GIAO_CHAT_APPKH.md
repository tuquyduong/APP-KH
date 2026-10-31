# Bàn giao chat App KH (cập nhật 31.10.2026, khuya)

<!-- File này nằm trong kho APP-KH (thiet_ke/) và trong Project. Chat App KH mới: ĐỌC FILE NÀY TRƯỚC, rồi làm đúng mục "Bắt đầu chat mới". -->

## Prompt chuyển chat (chủ quán dán nguyên văn; chat nào được hỏi "chuyển chat" thì cập nhật file này trước rồi đưa lại câu này)
> Đây là chat App KH mới, tiếp nối chat cũ. Clone github.com/tuquyduong/APP-KH, đọc thiet_ke/BAN_GIAO_CHAT_APPKH.md rồi làm đúng mục "Bắt đầu chat mới" trong đó. Luôn trả lời tôi dễ hiểu, từng bước cụ thể.

## Bắt đầu chat mới
1. Clone `github.com/tuquyduong/APP-KH` → đọc theo thứ tự: file này, `thiet_ke/QUYET_DINH_APPKH.md`, `CLAUDE.md` (§8–§10), `TIEN_DO_APPKH.json`, `thiet_ke/DOI_CHIEU_TINH_NANG.md`, `thiet_ke/trao_doi/` (file mới nhất).
2. Clone `github.com/pos-tuquyduong/pos-tuquyduong` (chỉ đọc): `HOP_DONG_API_KH.md`, `QUYET_DINH_CHU_QUAN.md`, `TIEN_DO_POS.json`.
3. Xem POS thật: trình duyệt của Claude (chủ quán bấm Ctrl+Shift+B trong app Claude máy tính), đã đăng nhập tài khoản `claude-xem` (Staff, CHỈ XEM — không bán, không huỷ đơn). App thật: `https://app-kh.pages.dev` (đã cho phép trong trình duyệt Claude). Tài liệu đối chiếu đầy đủ: https://claude.ai/artifact/KV7rGx8sxzJX9GMfhAG6D4
4. Tóm tắt cho chủ quán vài dòng: hiểu tình trạng thế nào, việc chị cần làm tiếp (mục "Chủ quán làm ngay" bên dưới).

## Vai trò chat App KH
- Chỉ xây App KH: soạn phiếu `viec/<MÃ>/phieu.md`, soạn script Python (THỬ trên bản sao kho trước khi gửi — bare repo + clone, node_modules là thư mục THẬT, không symlink: bài thử bộ khung dọn node_modules; chủ quán chạy ở Shell Replit POS `~/workspace`; Replit CHỈ có kho POS → script tự dùng / tự tải kho APP-KH về `~/APP-KH` (khuôn: `claude/ghi_QD_31102026.py` ở Project), không ghi gì vào kho POS), soát cuối việc máy Claude Code làm (nhánh `viec/<MÃ>`, `/lam-viec <MÃ>`).
- Soát cuối = chạy lại `node tu_chay/cong.js tinh` và `chay` với `main` mới nhất, KIỂU GITHUB (ẩn Playwright: `NODE_OPTIONS=-r <tệp chặn require('playwright')>`), thử ghép vào main, đọc code đường tiền / dữ liệu, chụp ảnh khi cần.
- KHÔNG sửa kho POS. Cần gì ở POS → `YEU_CAU_APPKH_GUI_POS_<ngày>.md` cho chủ quán chuyển; POS trả `TRA_LOI_POS_<ngày>.md`. Chép cả hai vào `thiet_ke/trao_doi/` ở script kế tiếp.
- Nói với chủ quán: lời thường, ít thuật ngữ, nói rõ việc là gì và chị cần làm gì, từng bước. Cần quyết → giải thích + đề xuất ("theo đề nghị"). Đã quyết → ghi `thiet_ke/QUYET_DINH_APPKH.md` + sổ / CLAUDE.md, không hỏi lại.
- Bài học: cổng GitHub không có trình duyệt (CLAUDE.md §9, `SỐ CA` theo `KHONG_TRINH_DUYET=1`); script tự xoá sau khi chạy — giữ bản gốc ở chỗ khác khi thử; chủ quán không sửa tay SỐ CA sau khi script đã ghi; 3 bài thử bộ khung (`thu_nguoi_gac`, `thu_cong_cu`, `thu_cong`) có 6 ca đỏ SẴN vì cấu hình riêng của POS — so "không đỏ thêm" chứ không đòi xanh hết.

## Tình trạng 31.10
- Đã gộp: KH-UI-2, KH-XEM-1, KH-LINK-1, KH-UI-5a, KH-SLOGAN-1, KH-LUU-1, KH-UI-3a, KH-UI-3c, KH-MUA-1, KH-KHOP-1, KH-UI-3b; KH-ND-1 (nhu cầu 10 món tạm trong `src/noiDung/mon.js`, theo `unique_id` POS). Bộ khung tự chạy 1.8.1. Sổ việc v17.
- **KH-MUA-1 (phía App)**: ĐÃ GỘP (PR #9, 7d11fce). Giỏ (tab 5), Thanh toán (tại quầy; giao "Sắp có"), QR payOS / ví + PIN, Theo dõi đơn `/don/<mã>`; cờ `DAT_ONLINE = false` (`src/noiDung/caiDat.js`), cổng `datCongDatDon` trong `src/datDon.js` (mọi tên trường POS ở đó). Không thêm cửa vào `api.js` (K8).
- **KH-KHOP-1**: ĐÃ GỘP (PR #10, 3cf6288); chủ quán thử tay đạt 31.10 (đăng nhập: mọi mục POS đã có đều ✓). Lỗi nhỏ: "Kiểm lại" không đọc lại đăng nhập → KH-UI-3b. Trang `/kiemkhop` tạm công khai, sau chuyển vào `/admin`.
- App thật: đăng nhập được (mã lấy ở POS: Khách hàng → bấm khách → "🔑 Mã đăng nhập App"); hạng, điểm, giá VIP, giờ mở cửa hiện đúng. POS ở `https://www.pos-tuquyduong.io.vn` (`VITE_POS_API` trên Cloudflare); `KH_JWT_SECRET` đã đặt trên Render.

## POS (đọc thiet_ke/trao_doi/)
- **v3 (KH-API-3) ĐÃ CHẠY THẬT trên Render từ 31.10** (gộp main POS, Render tự cập nhật): menu không token (giá mọi hạng), đăng ký 3 bước, xưng hô + 1 địa chỉ, `PUT /toi`, `POST /gia-han`. App đã có ô xưng hô từ KH-XEM-1 (mã khớp) → khách mới đăng ký được. Bản chép hợp đồng trong `thiet_ke/` còn v2 → chép v3 trong KH-UI-3b. Hợp đồng v4 = KH-SP-1, v5 = KH-MUA-1.
- Đặt đơn: chủ quán chốt đủ 5 mục TRƯỚC khai trương, không kịp thì LÙI khai trương. POS KH-MUA-1 (tại quán + QR payOS + ví/PIN) ~02–03.11; KH-MUA-2 (Ahamove) ~05–06.11; topping/combo/đổi điểm theo TOPPING-1, COMBO-1a, P3b. Tên cửa dự kiến: TRA_LOI_POS_31102026.md mục 3. Quyết giữ / lùi ngày: tối 31.10, tối 03.11.
- GIOVANG-1 (giá Giờ vàng từng món `gia_mon[]`) sau v3. KH-SP-1 (chữ thông tin ngắn món: `nhu_cau[]`, `the_chat[]`, `mo_ta`, `cong_dung`, `thanh_phan`) trước khai trương ~02–04.11; ảnh món, trắc nghiệm gửi POS, nhiều địa chỉ: SAU khai trương.
- **POS đã trả lời 31.10 (b)** — `thiet_ke/trao_doi/TRA_LOI_POS_31102026_b.md`: khoá chống gửi lặp `khoa_gui`; mọi 4xx của `POST /don` = chưa tạo đơn; `cach_tra` qr / vi / vi_qr; `mon[].ma` + `qr` trong `GET /don/:ma`; `giam[].loai`.
- **POS trả lời (c) + (d)** (App hỏi lại ở `YEU_CAU_…_c`, đính chính ở `_d`): `tong_da_xem` + 409 `GIA_DA_DOI { bao_gia }`; 4xx không giữ `khoa_gui`; 503 / payOS lỗi → gửi lại CÙNG khoá; mã chung `nhu_cau[]` (6) / `the_chat[]` (9) POS giữ — App đổi qua khoá `bh…db` ở một chỗ.

## Đã chốt 31.10 (chủ quán "theo đề nghị", riêng câu 2 sửa) — chi tiết ở QUYET_DINH_APPKH.md
- Giữ viên số món ở tab Giỏ hàng · Thêm vào giỏ chỉ ở Trang món, thêm xong QUAY LẠI trang trước (không nhảy vào giỏ) · địa chỉ giao ở KH-MUA-2 · quán đóng thì khoá đặt · giỏ cũ giữ khi hết phiên, đổi khách thì xoá.
- Văn phong lời chào (31.10 tối): "Chào buổi chiều, anh Linh!" — xưng hô giữa câu chữ thường, luôn có "!", nút xưng hô chữ thường như demo.

## Việc kế tiếp (theo thứ tự)
1. (xong 31.10) Soát cuối KH-KHOP-1.
2. KH-UI-3b ĐÃ GỘP (PR #11, f5c13fb; chủ quán thử tay đạt): hồ sơ xưng hô + 1 địa chỉ, lời chào theo giờ POS, tự gia hạn, menu công khai, hợp đồng v3 trong `thiet_ke/`. **KH-UI-3d ĐANG MỞ** (31.10, nhánh `viec/KH-UI-3d`): Ưu đãi cho khách vãng lai + văn phong lời chào (xưng hô chữ thường, "!"). Bài học soát 3b: phiếu phải liệt kê ĐỦ bài thử cũ sẽ sửa (cổng A6); bài cũ chỉ đổi phần Chromium → mục `## Bài thử cũ sửa` (A11); `SỐ CA` theo KHONG_TRINH_DUYET=1 (A16). Sau đó KH-THU-1 (rút `thu_KHMUA1.js` dưới trần 120 giây).
3. Khi POS gộp KH-MUA-1 + hợp đồng có cửa đặt đơn: phiếu **KH-MUA-1b** (Opus): thêm cửa vào `api.js`, tiêm `goi` vào cổng, POS giả dựng từ hợp đồng, ca 401; TRƯỚC KHI BẬT CỜ sửa: Back từ màn QR tạo được đơn chờ trả thứ hai; khoá "đơn có thể đã tạo" mất khi lui màn / tải lại; thẻ Lịch sử đơn dẫn tới Theo dõi đơn; khoá chống gửi lặp `khoa_gui` (POS đã nhận); thêm món xong quay lại trang trước (chốt 31.10). Rồi bật `DAT_ONLINE`.
4. KH-MUA-2 (Ahamove: phí giao, ô địa chỉ, tài xế) khi POS báo tên cửa.
5. KH-ND-2 khi POS có KH-SP-1 (đọc từ `/menu`, bỏ `mon.js`; mục "Bán chạy" chủ quán tự chọn; "Ưu đãi nhiều nhất").
6. KH-UI-5b (Kế hoạch; phiếu nháp ở Project), KH-UI-4 (màn rộng + chép đủ 167 biểu tượng từ demo vào `index.html`), KH-CF-1 (gắn tuquyduong.com 06.11).
7. Sau khai trương: KH-TN-1 (trắc nghiệm: màn hỏi chia sẻ sau bài, gửi POS khi đồng ý), KH-ADMIN-1 (`/admin`, chuyển `/kiemkhop` vào), KH-HOSO-1, KH-TB-1…
- Mốc: App KH xong 04.11 → chủ quán thử 05.11 → tên miền / QR 06.11 → khai trương T7 07.11 (lùi nếu đặt đơn chưa xong).

## Chủ quán làm ngay
- Mở Claude Code: `/lam-viec KH-UI-3d` (Sonnet). Xong gửi chat soát cuối.
- Thử đăng ký SĐT MỚI khi POS xong **KH-QUAY-2** (ô "Mã đăng nhập App cho số mới" ở màn Khách hàng — hiện quầy CHỈ cấp mã cho khách đã có, POS nhận 31.10, làm sau BH-CKTAY-1, trước khai trương; `YEU_CAU_APPKH_GUI_POS_31102026_e.md`).
- Đặt khoá payOS trên Render + webhook `https://www.pos-tuquyduong.io.vn/api/payos/webhook`; nâng Render gói trả phí (cùng lúc, chậm nhất 02.11); Ahamove: đang chờ Aha (cần khoá ~03.11).

## Chủ quán còn nợ
- Chữ banner "Hôm nay"; hotline / Zalo / email hỗ trợ; chọn nhà cung cấp Zalo ZNS; sửa tên trong POS (đang "Anh Linh"); khi POS có ô: nhu cầu + mô tả ngắn 10 món; danh sách "Bán chạy".
