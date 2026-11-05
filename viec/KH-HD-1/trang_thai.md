# KH-HD-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-HD-1`; `git status --short` sạch.
- SHA: HEAD `6bafbae` · FETCH_HEAD `6bafbae` (bằng nhau, không kéo).
- `git log --oneline -3`:
  - `6bafbae PHIEU: KH-HD-1`
  - `f20f0d7 TIEN-DO: mo dot 1 song song (KH-HD-1 chi tiet don theo hoa_don POS; KH-SINH-1 ngay sinh + loi chao du ten + xoa mon); thu App/POS 05.11 - so v26`
  - `a0b68d0 TIEN-DO: mo KH-MUA-1c (KHO_BAN = chua ro, gui lai cung khoa; hop dong v9; Theo doi don doc giu vi tu POS) - so v25`

## Câu hỏi
- Không có.

## Phát hiện
- Người gác chặn `git stash` và `git -C` → bằng chứng đỏ lấy bằng `git archive HEAD` ra thư mục nháp rồi chạy bài thử ở đó.
- Dòng `SỐ CA` của cổng A16 cần dạng `SỐ CA cong_cu/<bài>.js: N` (đường dẫn đầy đủ), khác ví dụ cũ `SỐ CA thu_KHXEM1: 61` — cổng chấp nhận bản có đường dẫn.

## Bảng chứng nghiệm thu
| Mục | Bằng chứng |
|---|---|
| A1 | `thu_KHHD1` ca "A1 …" (đủ dòng/thứ tự, trường thiếu, dòng không-object, `[]`/null/không phải mảng; không Number/parse) |
| A2 | 8 ca "A2 nhóm …" + ca loai lạ → `la` |
| A3 | ca "A3 [360/390/430] dòng giờ phai rỗng" (Chromium) |
| B1 | ca "B1 [360/390/430] …": giảm hạng, trả ví, giá gạch, ghi chú, số bill, thứ tự, một dòng tổng, `.discount`, điểm/chân/loai lạ; đơn huỷ cảnh báo trên cùng |
| B2 | ca "B2 [..] hoa_don: [] → vẽ mon[] + Tổng" |
| B3 | ca "B3 …" nhãn trạng thái + tiêu đề `Đơn #…` |
| B4 | ca "B4 …" CSS chỉ biến demo, import trong component, không sửa `main.jsx`; K9 xanh trong `npm test` |
| B5 | ca "B5 …" không tràn ngang ở 360/390/430 và khi chữ 200% |
| C1 | `cong_cu/thu_KHHD1.js`: 77 đạt · 0 hỏng (Chromium); 25 đạt · 0 hỏng (`KHONG_TRINH_DUYET=1`) |
| C2 | `so_anh/1_don_vi_*`, `2_don_huy_360`, `3_don_cho_*`; `doi_chieu_demo.md` |
| C3 | `npm test` 30 đạt · 0 hỏng; `--day-du` 32 đạt · 0 hỏng (vite build xong); cổng `chay` (KHONG_TRINH_DUYET=1): ✓ CỔNG CHẠY ĐẠT (kèm CẢNH BÁO A16 vô hại: gốc dừng sớm vì thiếu module) |
| C4 | chủ quán thử tay (xem GIT/CHƯA KIỂM) |

## Báo cáo 7 mục
1. **VIỆC** — KH-HD-1: Chi tiết đơn vẽ đúng tờ hoá đơn POS `hoa_don[]`.
2. **ĐÃ SỬA** — mới `src/hoaDon.js`, `src/components/HoaDonKhach.jsx`, `src/giaoDien/hoa_don.css`; sửa `src/pages/Don.jsx` (có tờ → `HoaDonKhach`, rỗng → cách cũ); bài thử `cong_cu/thu_KHHD1.js`. Không tính tiền ở App.
3. **BÀI THỬ** — đỏ trên gốc (`bang_chung_do.txt`), xanh sau sửa; số liệu ở bảng trên.
4. **ĐÃ RÀ K4** — `grep` chỗ vẽ `mon[]` của đơn: 2 nơi. `Don.jsx` (đã nối tờ POS, nhánh dự phòng khi `hoa_don` rỗng) và `TheoDoiDon.jsx:86-90` (cố ý không đụng — phiếu cấm, việc sau, vẫn thiếu dòng giảm hạng / cách trả). Thêm: `src/kiemKhop/canTuPos.js:18` khai trường `GET /don/:ma` chưa có `hoa_don[]` (phiếu cấm sửa `kiemKhop/**`) — chủ quán chuyển KH-MUA-1c.
5. **CHƯA KIỂM** — chưa thử với POS thật (tờ thật của `#A47Z8N9CF`); chưa so ảnh ghép cạnh demo (demo không có màn chi tiết đơn); ca Chromium chạy ở máy làm việc, GitHub chạy không trình duyệt. **C4 chủ quán thử tay (2 thao tác):** (1) Tài khoản → Đơn hàng → bấm đơn #A47Z8N9CF; (2) thấy "Ưu đãi hạng Kim Cương −300đ", dòng trả bằng tài khoản / ví, điểm, lời cảm ơn như tờ in; mở một đơn đang chờ thanh toán → vẫn thấy món + Tổng như cũ.
6. **GIT** — nhánh `viec/KH-HD-1`, commit `cc1cd4f`, `d2647a5`, `35d5c17`, sửa vòng 1 `d8bf021` và trước đó; chưa merge, chưa tạo PR.

## Soát độc lập vòng 1 (agent general-purpose) — KHÔNG ĐẠT nhẹ
Nguyên kết luận: không lỗi tiền / bảo mật; 3 lỗi nhỏ + lỗ hổng bằng chứng. Đã xử lý:
1. `so_bill` phai rỗng vẽ "Số bill: " trống; dòng POS trống / `tieu_de`, `chan` rỗng vẽ khối thừa → `HoaDonKhach.jsx` bỏ dòng trống (không bỏ khỏi `docHoaDon`); ca K5 "dữ liệu xấu" (đơn XAU0001).
2. Cột phải `flex-shrink:0` có thể tràn khi chữ dài → `max-width:60%`, bỏ flex-shrink:0; ca B5 chữ rất dài ở 360/390/430 (đo `scrollWidth`).
3. Bằng chứng đỏ chỉ "thiếu module" → thêm bằng chứng Chromium đỏ trên Don.jsx cũ: 54 đạt · 32 hỏng (`bang_chung_do.txt`).
4. Ảnh đơn huỷ thiếu 390/430 → đã chụp; thêm ảnh `4_don_xau_*`.
5. Câu K4 "Don.jsx là nơi duy nhất" sai → sửa ở mục 4; ghi cách thử C4 ở mục 5.
Chưa xử lý (ghi nhận): `docHoaDon` gọi 2 lần (rẻ, vô hại); `key={i}` (danh sách tĩnh); cỡ chữ px cứng theo `.date` / `summary-row` của demo nên chữ to theo cài đặt không đổi cỡ (B5 đo ở khung 200% chỉ chứng minh không tràn). Kết quả sau sửa: `thu_KHHD1` 86 đạt · 0 hỏng (Chromium), 25 (KHONG_TRINH_DUYET=1); `--day-du` 32 đạt · 0 hỏng; cổng `chay` ĐẠT.
7. **BÀI HỌC** — xem dưới.

## Bài học
- KHOÁ: không có điều mới cần khoá (ngoài Phạm vi nếu có thì ghi đề xuất ở sau). 
- BỎ: người gác chặn `git stash`/`git -C`/`cd` kèm lệnh khác — chỉ xảy ra khi lập bằng chứng đỏ, đã có cách thay (`git archive`). Dòng `SỐ CA` phải kèm đường dẫn đầy đủ — gặp một lần, đã sửa; đề xuất (ngoài Phạm vi): ghi rõ dạng này trong skill `/lam-viec` bước 4 (chủ quán quyết).

HEAD ĐÃ KIỂM: 35d5c17
HEAD ĐÃ KIỂM: d8bf021
