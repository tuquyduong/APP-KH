# KH-QC-1 — Dải quảng cáo + banner "Hôm nay" đọc chữ chủ quán đặt ở POS (`GET /quang-cao`, hợp đồng v16)

<!-- Chat App KH soạn 14.11.2026. Việc THƯỜNG [Th], **Sonnet** — chạy thẳng tới hết, không chờ duyệt kế hoạch. Hạn 17.11. Mở trên main SAU KHI POS gộp QC-APP-1 (POS main
     1a714246 có hợp đồng `/api/kh` **v16**). Chạy SONG SONG với KH-THE-2 (Opus — thẻ hội viên) và KH-ADMIN-1 (Opus — /admin) → xem mục Cấm.
     Nguồn: thư POS 13.11 `thiet_ke/trao_doi/TRA_LOI_POS_13112026_QC.md`, hợp đồng v16 "Ghi chú v16" (bản gốc POS đặt sẵn ở `viec/KH-QC-1/hop_dong_v16.md` — người gác chặn máy tải),
     QĐ 09.11 (dải kiểu A, chữ do chủ quán đặt trong Cài đặt POS) + 11.11 / 12.11 (KH-UI-5g: banner + dải cùng nguồn `chonQuangCao`). Phần HIỂN THỊ đã xong ở KH-UI-5d / 5g —
     việc này CHỈ thêm nguồn POS và sửa thứ tự. Đọc CLAUDE.md §4, §5, §6 (giờ VN theo `bayGio()`), §11. -->

## Mục tiêu
Chủ quán gõ chữ quảng cáo ở POS (Cài đặt → "Quảng cáo trên App", theo ngày / khung giờ / thứ tự) là App hiện đúng ở dải đầu các trang và banner "Hôm nay" ở Trang chủ;
không có thì App tự dùng nguồn cũ (Giờ vàng đang chạy → chương trình đặc biệt → chữ mặc định).

## Nghiệm thu

### A. Hợp đồng v16
- A1 `thiet_ke/HOP_DONG_API_KH.md` = NGUYÊN VĂN `viec/KH-QC-1/hop_dong_v16.md` (bản `HOP_DONG_API_KH.md` của POS main 1a714246, PHIEN_BAN 16; sha256 bắt đầu `9c72dbccce3ba175`)
  — kiểm sha256, chép sang, `cmp` từng byte. (v14 — HUY-1 `hoan_vao_tai_khoan`, `ly_do_huy` — đi kèm bản này nhưng App làm ở việc SAU KH-HUY-1; không làm ở đây.)
- A2 `src/kiemKhop/canTuPos.js`: thêm dòng `GET /quang-cao` (token false, đủ trường `bay_gio`, `data[].id … data[].uu_tien`, `co: true`, `viec_pos: 'QC-APP-1'`) — `thu_KHKHOP1.js` xanh.

### B. Đọc `GET /quang-cao`
- B1 `src/api.js`: `layQuangCao = () => goi('GET', '/quang-cao')` và thêm `'/quang-cao'` vào `CUA_CONG_KHAI` (không bao giờ gửi token khách).
- B2 Hỏi MỘT lần mỗi lần mở App (cùng chỗ / cùng nhịp với `/chuong-trinh` hiện nay — khi tới Trang chủ hoặc trang có dải đầu tiên) và hỏi lại khi App quay lại sau ≥ 30 phút
  (dùng lại hằng `PHUT_KIEM` của `src/dangKySW.js`, không viết số 30 lần hai). KHÔNG hỏi theo chu kỳ, KHÔNG lưu trên máy (chữ theo ngày — để cũ là sai). Lỗi / 429 / không mạng →
  im lặng, dùng nguồn cũ.
- B3 Khung giờ: dòng hợp giờ khi `bayGio()` (giờ POS — CLAUDE.md §6, KHÔNG đồng hồ điện thoại) nằm trong `[tu_gio, den_gio)` cùng ngày; `tu_gio` / `den_gio` `null` = không giới hạn
  phía đó; cả hai `null` = cả ngày. Qua mốc giờ thì dải / banner tự đổi ở lần vẽ kế tiếp (không cần hỏi lại POS) — dùng lại `hopGio` có sẵn.
- B4 Thứ tự: GIỮ thứ tự POS trả (`uu_tien` nhỏ trước — POS đã xếp; App KHÔNG sắp lại), dòng đầu tiên hợp giờ thắng. Dòng `id: "gio_vang"` là một dòng như mọi dòng (POS chỉ gửi khi
  Giờ vàng đang chạy và công tắc bật; `den_gio` = giờ kết thúc). SỬA lỗi hiện nay của `chonQuangCao` (xếp `uu_tien` LỚN trước, tách riêng dòng `gio_vang`) — sửa luôn ca thử cũ.

### C. Dải và banner
- C1 **Dải** (các trang có dải như nay): chữ = `chu_dai` của dòng POS đầu tiên hợp giờ (một dòng, dài thì "…" như nay; biểu tượng đầu câu tách như nay); không có dòng → nguồn cũ
  (Giờ vàng App tự dựng khi POS không gửi dòng `gio_vang` → chương trình đặc biệt → ẩn dải).
- C2 **Banner "Hôm nay"** (Trang chủ): dòng POS đầu tiên hợp giờ CÓ `tieu_de` (≠ "") → tiêu đề `tieu_de`, dòng phụ `phu` (rỗng → không dòng phụ), nút `chu_nut` (rỗng mà bấm được →
  chữ nút mặc định `qc.xem`); dòng `gio_vang` (không `tieu_de`) → banner Giờ vàng như hiện nay (`qc.gv.*`, % và giờ từ `/gio-vang`); không có → chương trình đặc biệt → chữ mặc định
  (`today.*`). Dải và banner có thể khác dòng (thư POS mục 3) — vẫn tính ở MỘT chỗ (`chonQuangCao` trả cả hai, gọi MỘT lần ở `App.jsx` như KH-UI-5g).
- C3 Bấm: `dich` ∈ `menu` · `mon` (+ `ma_mon` có trong menu; không có → Menu) · `uudai` · `tracnghiem`; `""` → không bấm được (không "Xem ›"). Dùng `moDichQuangCao` có sẵn.
- C4 Chữ POS hiện bằng CHỮ (React) — không HTML thô; có ca thử dòng chứa `<b>` / `<img onerror>` hiện nguyên như chữ. Chữ POS gắn `data-nd-khoa` (`qc.pos`); khung câu App
  (`qc.gv.*`, `qc.xem`, `today.*`) vẫn là mục sửa được. KHÔNG thêm chữ cứng (K10).

### D. Kiểm
- D1 Bài MỚI `cong_cu/thu_KHQC1.js` (chạy cả `KHONG_TRINH_DUYET=1`; POS giả dựng TỪ khối máy đọc của hợp đồng v16): thứ tự POS giữ nguyên (`uu_tien` 1 trước 5); dòng hợp / không hợp
  giờ (trước `tu_gio`, đúng `tu_gio`, đúng `den_gio` → không, chỉ `tu_gio`, chỉ `den_gio`, cả hai null); qua mốc giờ đổi dòng không hỏi lại; dải lấy dòng không `tieu_de` mà banner lấy
  dòng sau có `tieu_de`; `gio_vang` → banner Giờ vàng của App; `data: []` / lỗi / 429 → nguồn cũ; `dich` mỗi loại + `mon` thiếu `ma_mon`; chữ HTML hiện như chữ; không gửi token;
  hỏi một lần mỗi lần mở + lại sau ≥ 30 phút. Chromium (390): Trang chủ banner + Menu dải với POS giả 2 dòng (dòng 1 chỉ dải, dòng 2 có banner), đổi giờ giả qua mốc.
- D2 Bài thử CŨ có ca thứ tự `uu_tien` cũ (`thu_KHUI5d.js`, `thu_KHUI5g.js` nếu có) — hành vi đổi có chủ đích → sửa đúng ca (đỏ trên gốc kể cả `KHONG_TRINH_DUYET=1`); KHÔNG dùng
  `## Bài thử cũ sửa`. Bài khác giữ xanh không sửa.
- D3 Đột biến tay (`viec/KH-QC-1/dot_bien_tay.js`) ≥ 5, mỗi cái ĐỎ: sắp `uu_tien` lớn trước · dùng đồng hồ máy thay `bayGio()` · gửi token cho `/quang-cao` · banner lấy dòng không
  `tieu_de` · nhận `den_gio` (≤ thay vì <).
- D4 Ảnh 390 trước / sau: Trang chủ + Menu khi POS trống (= 0 điểm khác) và khi có dòng POS → `viec/KH-QC-1/so_anh/`.
- D5 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT; K10 không tăng; `trang_thai.md` + `HEAD ĐÃ KIỂM: <SHA>` (đầu dòng) TRƯỚC `/ra-soat`.
- D6 Chủ quán thử tay: POS → Cài đặt → "Quảng cáo trên App" thêm 2 dòng (một dòng chỉ chữ dải, một dòng có tiêu đề banner, khung giờ đang chạy) → mở App: dải các trang và banner Trang
  chủ đúng chữ; tắt dòng ở POS → đóng hẳn App mở lại → về chữ cũ.

## Phạm vi
- viec/KH-QC-1/**
- thiet_ke/HOP_DONG_API_KH.md
- src/kiemKhop/canTuPos.js
- src/api.js
- src/quangCao.js
- src/App.jsx
- src/noiDung/nd/khungChung.js
- cong_cu/no_chu_cung.txt
- cong_cu/thu_KHQC1.js
- cong_cu/thu_*.js

## Ngân sách
~60 dòng app (`api.js` 2, `quangCao.js` ~35, `App.jsx` ~15, `canTuPos.js` 1, danh mục nếu cần ~5) + ~250 dòng thử. **Phương án đơn giản nhất đã xét:** thêm MỘT nguồn vào `chonQuangCao`
(giữ thứ tự POS, lọc giờ bằng `hopGio` có sẵn), hỏi cùng chỗ với `/chuong-trinh`; không lưu trên máy, không bộ hẹn giờ. Vượt 1,5 lần thì giải thích.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- **Chạy song song với KH-THE-2 và KH-ADMIN-1:** `src/App.jsx` CHỈ sửa phần quảng cáo (biến / hiệu ứng hỏi `/quang-cao`, dòng `chonQuangCao`, truyền xuống dải / banner) — KHÔNG đụng
  `muaThe`, Thanh toán thẻ, `daTra`, `/admin`, dòng `<TienIch …>`. `src/api.js` CHỈ thêm `layQuangCao` + `'/quang-cao'` trong `CUA_CONG_KHAI` (KHÔNG sửa hàm `goi` — KH-ADMIN-1 sửa).
- KHÔNG sửa `src/pages/**`, `src/components/**` (dải / banner đã nhận `{ chu, tieuDe, phu, nut, khoa }` — cần đổi thì ghi `## Câu hỏi`), `src/dangKySW.js` (chỉ `import` hằng),
  `src/noiDung/nd.js`, `src/noiDung/nd/index.js`, tệp nhóm danh mục khác ngoài `khungChung.js`, `src/gioVang.js`, `src/chuongTrinh.js`, `src/main.jsx`, `public/**`, `index.html`,
  `thiet_ke/**` ngoài `HOP_DONG_API_KH.md`, `tu_chay/`, `.claude/`, `.github/`, `kiem_tra_truoc_khi_giao.js`, `cong_cu/ha_no_chu.js`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`.
- KHÔNG làm phần v14 (đơn bị quán huỷ) — việc KH-HUY-1. KHÔNG thêm nút tắt quảng cáo. KHÔNG lưu quảng cáo trên máy.
- Chỉ push `git push -u origin viec/KH-QC-1`. Không đụng `main`, không merge, không tạo PR.
