# Bàn giao chat App KH (cập nhật 02.11.2026, tối)

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

## Tình trạng 02.11
- Đã gộp: KH-UI-2, KH-XEM-1, KH-LINK-1, KH-UI-5a, KH-SLOGAN-1, KH-LUU-1, KH-UI-3a, KH-UI-3c, KH-MUA-1, KH-KHOP-1, KH-UI-3b, KH-UI-3d, KH-NHANH-1; KH-ND-1 (nhu cầu 10 món tạm trong `src/noiDung/mon.js`, theo `unique_id` POS). Bộ khung tự chạy 1.8.1. Sổ việc v22.
- **KH-MUA-1b ĐANG LÀM** (máy Claude Code, Opus, nhánh `viec/KH-MUA-1b`, hạn 04.11). Kế hoạch dc07781 chat soát ĐẠT, chủ quán duyệt 02.11 kèm 8 điểm dặn (xem "Việc kế tiếp" 1). Chưa có commit code khi chuyển chat.
- KH-MUA-1 (App, PR #9 7d11fce): giỏ, Thanh toán, Theo dõi đơn dựng sẵn, cờ `DAT_ONLINE = false`, cổng tiêm `datCongDatDon` — KH-MUA-1b bỏ cổng, nối cửa thật v5, bật cờ.
- App thật: `https://app-kh.pages.dev`, đăng nhập được (mã lấy ở POS: Khách hàng → bấm khách → "🔑 Mã đăng nhập App"). POS ở `https://www.pos-tuquyduong.io.vn` (`VITE_POS_API` trên Cloudflare). Trình duyệt của Claude đã đăng nhập App KH (chủ quán, 01.11).
- Lịch: POS báo khai trương **sớm nhất 14–15.11** (chưa chốt) — vì chủ quán chốt 02.11 làm đủ nạp tiền / quà chào mừng / ngày sinh / chương trình / hạng / ghi chú nhanh / hoá đơn TRƯỚC khai trương.

## POS (đọc thiet_ke/trao_doi/, file mới nhất trước)
- Hợp đồng đang chạy thật: **v5** (KH-MUA-1 đặt đơn; sửa cuối bbb0892). v6 (SePay) chỉ đổi câu chữ.
- **v7 ĐÃ HẸN, tên CHỐT** — mục "Đã hẹn" của `HOP_DONG_API_KH.md` trên main POS (2c81b0f, sổ POS v53): HANG-1 (`/hang` `chi_cap` `goi[]` `thu_bac`, `het_han: null`), QUA-1 (`/toi.khach.qua_chao_mung { so_tien, het_han }`), NAP-2 (`GET /goi-nap`, `POST /nap`, `GET /nap/:ma`, `GET /vi`), CT-1a (`/toi.khach.ngay_sinh`, `PUT /toi` 409 `NGAY_SINH_DA_CO` / 400 `NGAY_SINH_SAI`, `GET /chuong-trinh`), TOPPING-1 (`GET /ghi-chu-nhanh`, `ghi_chu` ≤ 120), HD-KH-1 (`/don/:ma.hoa_don[]`). App làm TRƯỚC theo tên này với POS giả; POS xong việc nào thì chuyển lên bảng cửa + tăng PHIEN_BAN.
- Thứ tự POS (ước tính, ~1 ngày / việc): HANG-1 → NAP-1 → QUA-1 → NAP-2; HD-KH-1 + CORS `maxAge` → CT-1a; … TOPPING-1.
- Thư App đã gửi 02.11: `YEU_CAU_APPKH_GUI_POS_02112026.md`, `_b`, `_c`, `_d`. Còn chờ POS: thêm `cach_tra`, `giu_vi`, `con_lai` vào `GET /don` + `GET /don/:ma` (thư d). Bỏ đề nghị `so_du_nap` (thư d).
- POS bản 6 (`YEU_CAU_POS_GUI_APPKH_01112026_ban6.md`): HAI loại tiền — **Quà chào mừng** (mã tạo tài khoản, MỘT lần, CÓ hạn, đếm ngược) và **Thưởng nạp** (mỗi lần nạp, KHÔNG hạn, gộp số dư); `so_du_vi` = tổng dùng được hết cho mọi đơn; POS trừ quà trước. Hoá đơn App = mẫu POS; ghi chú món luôn có; giao hàng: không COD, không hoàn tiền khi giao thất bại do khách.

## Đã chốt 31.10 (chủ quán "theo đề nghị", riêng câu 2 sửa) — chi tiết ở QUYET_DINH_APPKH.md
- 02.11: làm đủ trước khai trương (lùi nếu cần): nạp ví QR + lịch sử ví, quà chào mừng, ngày sinh (nhập một lần), chương trình đặc biệt, hạng HANG-1, ghi chú nhanh, hoá đơn theo mẫu POS · số dư ví dùng HẾT cho mọi đơn · ô "Số dư ví" hiện TỔNG `so_du_vi`, dưới là dòng nhỏ "Trong đó Quà chào mừng … — còn …" (không tự trừ) · Thanh toán: một công tắc "Trừ từ số dư ví", vẫn hỏi PIN khi trừ ví · giao diện mọi màn mới phải đúng tinh thần thiết kế app (demo).
- Giữ viên số món ở tab Giỏ hàng · Thêm vào giỏ chỉ ở Trang món, thêm xong QUAY LẠI trang trước (không nhảy vào giỏ) · địa chỉ giao ở KH-MUA-2 · quán đóng thì khoá đặt · giỏ cũ giữ khi hết phiên, đổi khách thì xoá.
- Văn phong lời chào (31.10 tối): "Chào buổi chiều, anh Linh!" — xưng hô giữa câu chữ thường, luôn có "!", nút xưng hô chữ thường như demo.

## Việc kế tiếp (theo thứ tự)
1. **Soát cuối KH-MUA-1b** khi chủ quán gửi nhật ký máy. Đối chiếu đủ phiếu + 8 điểm chủ quán duyệt 02.11 (ghi trong `TIEN_DO_APPKH.json` KH-MUA-1b `ghi_chu`):
   1) bản ghi `kh_don_gui` có `ma_don, cach_tra, giu_vi, con_lai` (số POS trả) → tải lại CÙNG máy vẫn hiện "Đã giữ … · quét QR …", máy khác thì ẩn số; 2) nút "Gửi lại đúng đơn này" + câu "Nếu quán đã nhận đơn, sẽ không tạo đơn thứ hai" + tóm tắt món / tổng, không nút bỏ qua (trừ > 24 giờ); 3) mở Thanh toán không chờ, nút Đặt khoá "Đang kiểm tra đơn trước…", `GET /don` lỗi thì mở nút; 4) "Mạng chậm, đang gửi lại…"; 5) nút Đặt chỉ bật khi báo giá đang hiện khớp giỏ + mã giảm (`tong_da_xem` đúng); 6) bài cũ `thu_KHMUA1.js` liệt kê ca sửa + lý do, giữ ca G2; 7) **công tắc "Trừ từ số dư ví"** kiểu `.switch` demo (thay 3 nút): tắt → `qr`, bật + đủ → `vi`, bật + thiếu → `vi_qr`, ví 0đ ẩn, bật thì PIN, QR cả đơn không PIN; 8) **giao diện đúng tinh thần thiết kế app** — dùng lại lớp / biến màu của `src/giaoDien/` + demo, `so_anh` 360/390/430 cho mọi khối mới, `doi_chieu_demo.md`. Chat XEM ẢNH trước khi gộp.
   Kèm: cổng `tinh` + `chay` kiểu GitHub, thử ghép main, đọc kỹ đường tiền (khoá gửi, luật 4xx, PIN không lưu), /security-review nhánh. Chủ quán thử tay trên POS thật 3 bước (đơn QR rẻ, huỷ, ví + PIN). Script soát cuối: lưu `trao_doi/` mới chưa lưu (nếu có), ghi sổ.
2. Sau KH-MUA-1b gộp: mở lần lượt theo v7 "Đã hẹn" (App làm trước với POS giả, KHÔNG chạy song song hai máy trên cùng màn): KH-HANG-2 → KH-SINH-1 + KH-CT-1 → KH-VI-2 (Quà chào mừng) + KH-NAP-1 (nạp QR + lịch sử ví `GET /vi`) → KH-GHICHU-1 → KH-HD-1. Mỗi phiếu chép mục "Đã hẹn" nguyên văn vào `viec/<MÃ>/` như KH-MUA-1b chép v5.
3. KH-MUA-2 (Ahamove: phí giao, địa chỉ, tài xế; câu "giao không thành do khách thì không hoàn tiền" + ô "Tôi đã đọc"; không COD) khi POS báo tên cửa.
4. KH-PWA-1 (service worker), KH-THU-1 (rút `thu_KHMUA1.js` dưới 60 giây), KH-ND-2 (đọc nội dung món từ `/menu`, bỏ `mon.js`).
5. KH-UI-5b (Kế hoạch), KH-UI-4 (màn rộng), KH-CF-1 (gắn tuquyduong.com trước khai trương).
6. Sau khai trương: KH-TN-1, KH-ADMIN-1, KH-HOSO-1 (phần còn lại), KH-TB-1, nút mua thẻ hạng (P3b)…
- Bài học soát: bài cũ chỉ đổi phần Chromium → THÊM ca hàm thuần đỏ trên gốc, KHÔNG dùng `## Bài thử cũ sửa` (luật 6.9 POS); `SỐ CA` theo KHONG_TRINH_DUYET=1; phiếu liệt kê đủ bài cũ (glob `cong_cu/thu_KH*.js`); máy phải mở Claude Code ĐÚNG nhánh `viec/<MÃ>`.
- Công cụ: /security-review cho POS (toàn bộ, ngay), App, nhánh tiền trước khi gộp, và lượt cuối trước khai trương.

## Chủ quán làm ngay
- Chờ máy xong KH-MUA-1b → gửi nhật ký cho chat soát cuối.
- Gửi chat POS thư `YEU_CAU_APPKH_GUI_POS_02112026_d.md` (nếu chưa gửi).
- Thử đăng ký SĐT MỚI khi POS xong **KH-QUAY-2**.
- Cổng nhận tiền QR (SePay) + webhook trên POS theo hướng dẫn chat POS; Ahamove: chờ Aha.

## Chủ quán còn nợ
- Chữ banner "Hôm nay"; hotline / Zalo / email hỗ trợ; chọn nhà cung cấp Zalo ZNS; sửa tên trong POS (đang "Anh Linh"); khi POS có ô: nhu cầu + mô tả ngắn 10 món; danh sách "Bán chạy".
