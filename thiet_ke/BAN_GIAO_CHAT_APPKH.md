# Bàn giao chat App KH (cập nhật 31.10.2026, tối)

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
- Đã gộp: KH-UI-2, KH-XEM-1, KH-LINK-1, KH-UI-5a, KH-SLOGAN-1, KH-LUU-1, KH-UI-3a, KH-UI-3c; KH-ND-1 (nhu cầu 10 món tạm trong `src/noiDung/mon.js`, theo `unique_id` POS). Bộ khung tự chạy 1.8.1. Sổ việc v14.
- **KH-MUA-1 (phía App)**: ĐÃ GỘP (PR #9, 7d11fce). Giỏ (tab 5), Thanh toán (tại quầy; giao "Sắp có"), QR payOS / ví + PIN, Theo dõi đơn `/don/<mã>`; cờ `DAT_ONLINE = false` (`src/noiDung/caiDat.js`), cổng `datCongDatDon` trong `src/datDon.js` (mọi tên trường POS ở đó). Không thêm cửa vào `api.js` (K8).
- **KH-KHOP-1**: đã mở (sổ v13, `mo_KHKHOP1.py` đã chạy); máy xong nhánh `viec/KH-KHOP-1` → chờ chat soát cuối. Trang `/kiemkhop` tạm công khai, sau chuyển vào `/admin`.
- App thật: đăng nhập được (mã lấy ở POS: Khách hàng → bấm khách → "🔑 Mã đăng nhập App"); hạng, điểm, giá VIP, giờ mở cửa hiện đúng. POS ở `https://www.pos-tuquyduong.io.vn` (`VITE_POS_API` trên Cloudflare); `KH_JWT_SECRET` đã đặt trên Render.

## POS (đọc thiet_ke/trao_doi/)
- v3 (KH-API-3) hẹn gộp 01.11, hạn cứng trưa 02.11: menu không token (có giá mọi hạng), đăng ký 3 bước, xưng hô + 1 địa chỉ, `PUT /toi`, `POST /gia-han`, địa chỉ www trong hợp đồng.
- Đặt đơn: chủ quán chốt đủ 5 mục TRƯỚC khai trương, không kịp thì LÙI khai trương. POS KH-MUA-1 (tại quán + QR payOS + ví/PIN) ~02–03.11; KH-MUA-2 (Ahamove) ~05–06.11; topping/combo/đổi điểm theo TOPPING-1, COMBO-1a, P3b. Tên cửa dự kiến: TRA_LOI_POS_31102026.md mục 3. Quyết giữ / lùi ngày: tối 31.10, tối 03.11.
- GIOVANG-1 (giá Giờ vàng từng món `gia_mon[]`) sau v3. KH-SP-1 (chữ thông tin ngắn món: `nhu_cau[]`, `the_chat[]`, `mo_ta`, `cong_dung`, `thanh_phan`) trước khai trương ~02–04.11; ảnh món, trắc nghiệm gửi POS, nhiều địa chỉ: SAU khai trương.
- **POS đã trả lời 31.10 (b)** — `thiet_ke/trao_doi/TRA_LOI_POS_31102026_b.md`: khoá chống gửi lặp `khoa_gui`; mọi 4xx của `POST /don` = chưa tạo đơn; `cach_tra` qr / vi / vi_qr; `mon[].ma` + `qr` trong `GET /don/:ma`; `giam[].loai`. Hợp đồng v3 POS Merge tối 31.10 — App phải có ô xưng hô (KH-UI-3b) rồi báo POS giờ đưa v3 lên Render.

## Đã chốt 31.10 (chủ quán "theo đề nghị", riêng câu 2 sửa) — chi tiết ở QUYET_DINH_APPKH.md
- Giữ viên số món ở tab Giỏ hàng · Thêm vào giỏ chỉ ở Trang món, thêm xong QUAY LẠI trang trước (không nhảy vào giỏ) · địa chỉ giao ở KH-MUA-2 · quán đóng thì khoá đặt · giỏ cũ giữ khi hết phiên, đổi khách thì xoá.

## Việc kế tiếp (theo thứ tự)
1. Soát cuối KH-KHOP-1 khi chủ quán gửi phần cuối phiên.
2. Khi POS gộp v3: phiếu **KH-UI-3b** (đăng ký 3 bước, menu + giá mọi hạng cho vãng lai, mở trang Ưu đãi cho vãng lai chỉ khoá điểm/voucher, lời chào theo xưng hô, tự gia hạn; sửa `.hb-k` mất dấu ở màn 360 — `overflow:hidden` + line-height 1.2 ở 9px, lỗi có sẵn từ demo).
3. Khi POS gộp KH-MUA-1 + hợp đồng có cửa đặt đơn: phiếu **KH-MUA-1b** (Opus): thêm cửa vào `api.js`, tiêm `goi` vào cổng, POS giả dựng từ hợp đồng, ca 401; TRƯỚC KHI BẬT CỜ sửa: Back từ màn QR tạo được đơn chờ trả thứ hai; khoá "đơn có thể đã tạo" mất khi lui màn / tải lại; thẻ Lịch sử đơn dẫn tới Theo dõi đơn; khoá chống gửi lặp `khoa_gui` (POS đã nhận); thêm món xong quay lại trang trước (chốt 31.10). Rồi bật `DAT_ONLINE`.
4. KH-MUA-2 (Ahamove: phí giao, ô địa chỉ, tài xế) khi POS báo tên cửa.
5. KH-ND-2 khi POS có KH-SP-1 (đọc từ `/menu`, bỏ `mon.js`; mục "Bán chạy" chủ quán tự chọn; "Ưu đãi nhiều nhất").
6. KH-UI-5b (Kế hoạch; phiếu nháp ở Project), KH-UI-4 (màn rộng + chép đủ 167 biểu tượng từ demo vào `index.html`), KH-CF-1 (gắn tuquyduong.com 06.11).
7. Sau khai trương: KH-TN-1 (trắc nghiệm: màn hỏi chia sẻ sau bài, gửi POS khi đồng ý), KH-ADMIN-1 (`/admin`, chuyển `/kiemkhop` vào), KH-HOSO-1, KH-TB-1…
- Mốc: App KH xong 04.11 → chủ quán thử 05.11 → tên miền / QR 06.11 → khai trương T7 07.11 (lùi nếu đặt đơn chưa xong).

## Chủ quán làm ngay
- KH-KHOP-1: máy đã xong (nhánh `viec/KH-KHOP-1`) → gửi chat soát cuối, ĐẠT thì mở PR + Merge.
- Merge KH-API-3 bên POS (tối 31.10).
- Đặt khoá payOS trên Render + webhook `https://www.pos-tuquyduong.io.vn/api/payos/webhook`; nâng Render gói trả phí (cùng lúc, chậm nhất 02.11); Ahamove: đang chờ Aha (cần khoá ~03.11).

## Chủ quán còn nợ
- Chữ banner "Hôm nay"; hotline / Zalo / email hỗ trợ; chọn nhà cung cấp Zalo ZNS; sửa tên trong POS (đang "Anh Linh"); khi POS có ô: nhu cầu + mô tả ngắn 10 món; danh sách "Bán chạy".
