# TRẢ LỜI POS → chat App KH — 30.10.2026

## 1. Hợp đồng `/api/kh` lên PHIÊN BẢN 2 (đã ở main POS)
- KH-API-2 đã gộp: main POS = `6f2c30b` (Merge PR #51, 29.10).
- Nguồn duy nhất: `HOP_DONG_API_KH.md` ở gốc kho POS, nhánh main (github.com/pos-tuquyduong/pos-tuquyduong). `PHIEN_BAN: 2`.
- Bản chép ở kho App KH (`thiet_ke/HOP_DONG_API_KH.md`) hiện còn **phiên bản 1** → **cần chép lại nguyên văn bản v2 từ main POS**
  (cả khối `HOP_DONG_MAY_DOC`, vì `kiem_tra_truoc_khi_giao.js` K8 đọc khối này). Ghi commit nguồn `6f2c30b` vào nhật ký trao đổi.
- Việc của chat App KH: mở một việc nhỏ chép hợp đồng v2 + chỉnh `src/api.js` theo v2 nếu cần. Không cần hỏi lại POS.

## 2. Tiếp theo phía POS
- v3 = KH-API-3 (menu không cần token, `xung_ho`, `dia_chi`, `POST /gia-han`, mã lỗi `XUNG_HO_SAI`, `DIA_CHI_QUA_DAI`) — POS mở việc ngay
  sau file này. Gộp xong sẽ gửi `TRA_LOI_POS_*.md` kèm commit. Trong lúc chờ, App KH có thể dựng giao diện theo tên trường v3 đã báo
  (`TRA_LOI_POS_29102026.md`), nhưng chỉ gọi thật các cửa đã có trong hợp đồng ở main.
