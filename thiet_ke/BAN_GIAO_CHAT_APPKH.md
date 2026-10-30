# Bàn giao chat App KH (cập nhật 30.10.2026 tối)

<!-- File này nằm trong kho APP-KH (thiet_ke/) và trong Project. Chat App KH mới: ĐỌC FILE NÀY TRƯỚC, rồi làm đúng mục "Bắt đầu chat mới". -->

## Bắt đầu chat mới
1. Clone `github.com/tuquyduong/APP-KH` → đọc theo thứ tự: `thiet_ke/BAN_GIAO_CHAT_APPKH.md` (file này), `thiet_ke/QUYET_DINH_APPKH.md`, `CLAUDE.md`, `TIEN_DO_APPKH.json`, `thiet_ke/DOI_CHIEU_TINH_NANG.md`, `thiet_ke/trao_doi/` (file mới nhất).
2. Clone `github.com/pos-tuquyduong/pos-tuquyduong` (chỉ đọc): `HOP_DONG_API_KH.md`, `QUYET_DINH_CHU_QUAN.md`, `TIEN_DO_POS.json`.
3. Xem POS thật: trình duyệt của Claude (Ctrl+Shift+B trong app Claude máy tính), tài khoản `claude-xem` (Staff, chỉ xem). App thật: `https://app-kh.pages.dev`.
4. Tóm tắt cho chủ quán vài dòng: hiểu tình trạng thế nào, việc chị cần làm tiếp.

## Vai trò chat App KH
- Chỉ xây App KH: soạn phiếu `viec/<MÃ>/phieu.md`, soạn script Python (thử trên bản sao kho trước khi gửi; chủ quán chạy ở Replit `~/workspace`), soát cuối việc máy Claude Code làm (nhánh `viec/<MÃ>`, `/lam-viec <MÃ>`, Sonnet).
- KHÔNG sửa kho POS. Cần gì ở POS → file `YEU_CAU_APPKH_GUI_POS_<ngày>.md` cho chủ quán chuyển; POS trả `TRA_LOI_POS_<ngày>.md`. Chép cả hai vào `thiet_ke/trao_doi/`.
- Nói với chủ quán: lời thường, ít thuật ngữ, nói rõ việc là gì và chị cần làm gì, từng bước cụ thể. Cần quyết → giải thích + đề xuất để chị xác nhận ("theo đề nghị"). Đã quyết → ghi vào `thiet_ke/QUYET_DINH_APPKH.md` + CLAUDE.md / sổ, không hỏi lại.
- Bài học: cổng GitHub không có trình duyệt (CLAUDE.md §9); script tự xoá sau khi chạy — giữ bản gốc ở chỗ khác khi thử; chủ quán đừng sửa tay số SỐ CA sau khi script đã ghi.

## Tình trạng 30.10 tối
- Đã gộp: KH-UI-2, KH-XEM-1, KH-LINK-1, KH-UI-5a, KH-SLOGAN-1, KH-LUU-1, KH-UI-3a; KH-ND-1 (nội dung tạm `mon.js`, đẩy thẳng main). Sổ v10 → v11 sau script `ghi_QD_30102026.py`.
- App thật chạy: đăng nhập được (mã lấy ở POS: Khách hàng → bấm khách → "🔑 Mã đăng nhập App"), Hạng, điểm, giá VIP, giờ mở cửa hiện đúng.
- Đang chạy: **KH-UI-3c** (ô khoá không che chữ, ô Giờ vàng mờ) — soát cuối khi chủ quán gửi phần cuối phiên. Cổng GitHub: xem dòng SỐ CA theo `KHONG_TRINH_DUYET=1`.
- POS: v3 (KH-API-3) hẹn gộp 01.11 (hạn cứng trưa 02.11); GIOVANG-1 sau v3; đã nhận địa chỉ www.
- Đã gửi POS (chờ trả lời): `YEU_CAU_APPKH_GUI_POS_30102026_c.md` (thông tin ngắn món, trắc nghiệm, nhiều địa chỉ, xác nhận menu công khai có giá mọi hạng), `_d.md` (**đặt đơn online từ khai trương**).

## Việc kế tiếp (theo thứ tự)
1. Soát KH-UI-3c → chủ quán gộp.
2. Script cập nhật bộ khung tự chạy 1.8.1 (POS KHUNG-KEO-1: 5 tệp `tu_chay/`, rồi `bash tu_chay/cai_dat.sh`) — sau khi 3c gộp.
3. Phiếu **KH-KHOP-1**: trang Kiểm khớp POS (ẩn, chỉ chủ quán biết link) + `thiet_ke/CAN_TU_POS.json` (App KH cần gì từ POS; trang gọi thử từng cửa, báo ✓/✗).
4. Khi POS trả lời file d: phiếu **KH-MUA-1** phía App (giỏ, thanh toán, theo dõi đơn theo demo) — làm song song bằng dữ liệu mẫu đúng tên trường POS chốt. Việc lớn nhất trước 07.11.
5. Khi POS gộp v3: phiếu **KH-UI-3b** (đăng ký 3 bước, menu không đăng nhập, giá mọi hạng cho vãng lai, mở trang Ưu đãi cho vãng lai chỉ khoá điểm/voucher, lời chào theo xưng hô, tự gia hạn).
6. **KH-TN-1** (khi POS có cửa trắc nghiệm): màn hỏi chia sẻ sau bài, gửi POS khi đồng ý; ô rút lại trong Hồ sơ.
7. **KH-ND-2** (khi POS có ô thông tin ngắn): đọc từ `/menu`, bỏ `mon.js`.
8. KH-UI-5b (Kế hoạch), KH-UI-4 (màn rộng + chép đủ biểu tượng), KH-CF-1 (tên miền 06.11).
- Mốc: App KH xong 04.11 → chủ quán thử 05.11 → tên miền / QR 06.11 → khai trương T7 07.11.

## Chủ quán còn nợ
- Chữ banner "Hôm nay"; hotline / Zalo / email hỗ trợ; chọn nhà cung cấp Zalo ZNS; sửa tên trong POS (đang "Anh Linh"); khi POS có ô: ảnh + nhu cầu + mô tả ngắn 10 món; danh sách "Bán chạy".
