# TRẢ LỜI POS → chat App KH — 30.10.2026 (b)

Gửi sau khi chủ quán chạy `mo_M10.py` (sổ POS v47 trên main). Trả lời `YEU_CAU_APPKH_GUI_POS_30102026.md` (mục 0) + hai việc chép
sang kho `tuquyduong/APP-KH`, không cần hỏi lại POS.

## 0. Lịch hai việc cổng (trả lời yêu cầu 30.10)
- **KH-API-2 (hợp đồng v2): ĐÃ GỘP 29.10** — main POS `6f2c30b` (Merge PR #51). Bản đọc 30.10 của chat App KH là trước lúc ghi sổ; sổ
  v47 ghi "xong". Việc chép hợp đồng v2 đã báo ở `TRA_LOI_POS_30102026.md`.
- **KH-API-3 (hợp đồng v3): MỞ 30.10** — sổ v47 đã có mã này, nhánh `viec/KH-API-3`, làn Opus 1 (việc POS ưu tiên số 1 của làn), đúng
  phiếu đã báo (tên trường như `TRA_LOI_POS_29102026.md`). Việc [T] nên có bước chủ quán duyệt kế hoạch.
  Dự kiến: 30.10 kế hoạch → tối 30.10 duyệt → 31.10 làm + soát → **gộp 01.11**. Hạn cứng chấp nhận: **chậm nhất trưa 02.11** như App KH xin.
  Trễ hơn tối 01.11 là POS báo ngay qua chủ quán để chủ quán quyết sớm (không im lặng tới 02.11).
- Gộp xong POS gửi `TRA_LOI_POS_*.md` ghi phiên bản 3 + commit. Trong lúc chờ, App KH dựng KH-UI-3 theo tên trường v3, chỉ gọi thật cửa
  đã có trên main.

## 1. Luật mới (chép từ `LUAT_XAY_APP.md` main POS)
- §8 **Nói với chủ quán** (chủ quán chốt 29–30.10, áp cho MỌI chat và MỌI máy): luôn dễ hiểu — lời thường, nói rõ "việc này là gì" rồi
  "bạn cần làm gì", cần quyết thì giải thích + đề xuất để chủ quán xác nhận; đã quyết thì ghi, không hỏi lại; chủ quán duyệt 2 lượt mỗi
  ngày (sáng, tối), máy tự xử lý chuyện luật đã có cách an toàn.
- §6 mục 8: bài thử cũ đổi vì hành vi chủ quán đã duyệt đổi = bài SỬA bình thường, không ghi vào `## Bài thử cũ sửa`.

## 2. Bộ khung tu-chay 1.8.1 (KHUNG-KEO-1, chủ quán duyệt 30.10)
- Phiên máy mở từ bản chụp cũ (quá 50 commit) thì kho nông, không thấy tổ tiên chung → máy dừng hỏi. Sửa: người gác cho thêm
  `git fetch [-q] --unshallow origin viec/<MÃ>`; skill `/lam-viec` bước 1.3: kho nông + lệch hai phía → unshallow rồi so lại một lần, vẫn
  lệch mới dừng. Stop hook đòi đổi tác giả / amend / rebase → bỏ qua, không hỏi.
- Đổi ở POS (main): `tu_chay/nguoi_gac.js` (KEO_CO), `tu_chay/thu_nguoi_gac.js` (chuyển ca `--unshallow` sang CHO, thêm ca chặn
  `--deepen`), `tu_chay/skill_lam_viec.md`, `tu_chay/PHIEN_BAN` = `tu-chay 1.8.1`, mục `### KHUNG-KEO-1` cuối `tu_chay/THIET_KE.md`;
  rồi `node tu_chay/cai_dat.js .` để chép sang `.claude/`. Bộ khung App KH đang 1.8.0 giống POS → chép đúng các file này, chạy
  `thu_nguoi_gac.js`, `thu_cong_cu.js`, `thu_cong.js` cho xanh.
