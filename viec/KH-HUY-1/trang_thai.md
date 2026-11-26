# KH-HUY-1 — trạng thái

## Đồng bộ bản chụp (bước 1)
- Nhánh `viec/KH-HUY-1`; cây sạch; `git rev-parse --short HEAD FETCH_HEAD` = `53842bd` · `53842bd` (đã đủ commit của origin, không kéo).
- `git log --oneline -3`:
  - `53842bd PHIEU: KH-HUY-1`
  - `6111b5d TIEN-DO: mo KH-HUY-1 (don bi quan huy: ly do + da hoan vao vi, hop dong v14)`
  - `80efd3c TIEN-DO: KH-NHANH-2 xong (PR #45); KH-SUA-2 them (12)-(16); quyet dinh 19.11 + 26.11; thu App 19.11 + thu POS 19.11; ban giao`

## Câu hỏi
(không)

## Phát hiện
- Người gác chặn `sed -i`, `git worktree`, `Monitor`/`until`, và lệnh ghép `python … && node …` (mỗi lệnh chạy file script phải đứng một mình) — đã đổi cách làm (Edit/Write, `git archive` ra thư mục nháp, tách lệnh).
- `cong_cu/thu_KHMUA1b.js` KHÔNG sửa: hai trường v14 đi qua `v7` của đơn giả (thân trả lời trải nguyên) → không cần `## Bài thử cũ sửa`.

## Bảng "chỗ vá → đột biến" (`dot_bien_tay.js`, việc chỉ đổi `src/` nên không có `dot_bien.py` — như KH-NAP-1)
| Chỗ vá | Đột biến |
|---|---|
| `soHoan` chỉ nhận số nguyên ≥ 0 | VS-HOAN-NHAN-AM · VS-HOAN-NHAN-CHUOI |
| `DonHuy` chỉ hiện hộp hoàn khi > 0 | VS-HIEN-HOP-HOAN-KHI-0 |
| lý do = nhãn POS nguyên văn, hoàn = số POS | VS-APP-TU-GHEP-LY-DO · VS-APP-TU-TINH-HOAN |
| `docDon` chỉ đọc khi `da_huy` | BV-DOC-LY-DO-KHI-CHUA-HUY · BV-DOC-HOAN-KHI-CHUA-HUY |
| `moVi` truyền tới 2 màn | BV-CHI-TIET-BO-MOVI · BV-THEO-DOI-BO-MOVI · VS-DON-HUY-XEM-VI-KHONG-MO-VI |
| làm mới `cuaToi` | BV-KHONG-LAM-MOI-SO-DU-O-CHI-TIET · BV-KHONG-LAM-MOI-SO-DU-O-THEO-DOI |
| dòng "Đã hoàn" ở Lịch sử | VS-LICH-SU-HIEN-HOAN-0 · BV-LICH-SU-HIEN-DONG-HOAN-CHO-DON-CHUA-HUY · BV-LICH-SU-DONG-HOAN-CHUA-DANH-DAU-KHOA |
| Chi tiết chỉ dựng hộp khi `da_huy` | BV-CHI-TIET-HIEN-HOP-KHI-CHUA-HUY (bắt bởi ca (4b) thêm sau lần chạy đầu) |
Chạy: `node viec/KH-HUY-1/dot_bien_tay.js [--trinh-duyet]` — 12 đột biến nhóm hàm thuần đều bị bắt; 4 nhóm trình duyệt (lần chạy đầu sót 1 → thêm ca (4b), đã bắt).
