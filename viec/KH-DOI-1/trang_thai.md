# KH-DOI-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (27.11.2026)
- Nhánh: viec/KH-DOI-1 · cây sạch · HEAD beab831 = FETCH_HEAD beab831 (không kéo, đã bằng nhau)
- git log --oneline -3:
  - beab831 PHIEU: KH-DOI-1
  - 0063091 TIEN-DO: KH-HUY-1 xong (PR #46); mo KH-DOI-1 (doi diem lay qua, thiet ke duyet 26.11); KH-SUA-2 them (17)(18); quyet dinh 26.11
  - 9bc3c31 Merge pull request #46 from tuquyduong/viec/KH-HUY-1

## Bước 2–3 — đọc, kế hoạch
- Đọc: phiếu, thư POS 16.11 (hợp đồng đã hẹn), ban_thiet_ke.html + 9 ảnh, mau_de_xuat.js, src/api.js, duLieuKhach.js, datDon.js (guiDonAnToan, loaiLoi, khoaGui),
  PinSheet.jsx, UuDai.jsx, ViTien.jsx, ManQR.jsx, App.jsx, duongDan.js, kiemKhop/canTuPos.js, nd.js + nd/viTien.js, thu_KHNAP1.js (khuôn bài thử).
- `ke_hoach.md`; agent phụ (chỉ đọc) soát 4 câu → 7 điểm, đã sửa kế hoạch (mục "Sau soát kế hoạch"): 401 /kho-qua dựa vào lượt /diem MỚI khi mở màn;
  gửi `doiDiemApp` trần (không qua công tắc DAT_ONLINE); "chưa rõ" giữ khoá; Chế độ sửa bật công tắc ở lớp nháp; ô Điểm đúng khuôn ô ví.

## Bước 4 — bài thử đỏ trước
- `cong_cu/thu_KHDOI1.js` (mới) — chạy trên bản sao sạch (code gốc + bài thử) ở nháp: xem `bang_chung_do.txt`.

## Bước 5–6 — sửa, kiểm (27.11)
- `thu_KHDOI1.js`: 51 đạt · 0 hỏng (KHONG_TRINH_DUYET=1) · 133 đạt · 0 hỏng (Chromium 360 / 390 / 430). Đỏ trên gốc: `bang_chung_do.txt` (4·35 / 18·49).
- Đột biến tay `node viec/KH-DOI-1/dot_bien_tay.js --trinh-duyet`: đối chứng XANH (133/0), 18/18 BẮT ĐƯỢC — `TẤT CẢ ĐỘT BIẾN BỊ BẮT`.
  (Lượt đầu SÓT VS-NHAC-KHONG-THEO-POS: phiếu `nhac` đứng đầu dữ liệu thử → thêm ca phiếu không nhắc đứng trước; lượt đầu nữa bản sao hỏng sẵn 1 ca → thêm lượt đối chứng.)
- `npm test`: còn ĐỎ đúng MỘT phép — `✗ K8 mọi lời gọi src/api.js có trong hợp đồng — GET /kho-qua, GET /qua-cua-toi, POST /doi-diem` → xem `## Câu hỏi`.
  (Lượt đó còn hai chỗ đỏ khác đã xử lý: `thu_KHDOI1` ca "lớp mới dq-" — sửa ca thử; `thu_KHND3e` 2 ca — kho NÔNG (phiên mở từ bản chụp) không tìm được commit
  KH-ND-3e → `git fetch --unshallow`, chạy lại 42 đạt · 0 hỏng; không do việc này.)
- Cổng `tinh` (beab831^ → HEAD): chỉ `✗ [A19]` (chưa tới bước 11.4).

## Câu hỏi
**Q1 — K8 đỏ: 3 cửa ĐÃ HẸN chưa có trong khối máy đọc của hợp đồng.** Phiếu bắt App gọi `GET /kho-qua`, `POST /doi-diem`, `GET /qua-cua-toi` qua `goi` trong
`src/api.js` (mục A1). Bộ kiểm K8 (`kiem_tra_truoc_khi_giao.js:92–109`) đòi MỌI lời gọi `goi('PT', '/đường')` trong api.js có trong khối `HOP_DONG_MAY_DOC` của
`thiet_ke/HOP_DONG_API_KH.md`. Ba cửa này mới là hợp đồng ĐÃ HẸN (thư POS 16.11 — POS chép vào "Đã hẹn" ở lần ghi sổ tới, lên bảng cửa ở v18 khi DOI-DIEM-1 gộp),
nên K8 đỏ: `✗ K8 mọi lời gọi src/api.js có trong hợp đồng — GET /kho-qua, GET /qua-cua-toi, POST /doi-diem`.
Máy KHÔNG tự gỡ được: phiếu cấm sửa `thiet_ke/**` và `kiem_tra_truoc_khi_giao.js`; viết lời gọi "không thẳng" để K8 không thấy là lách bộ kiểm.
Ba cách (máy đề xuất **C**):
- **A.** Chủ quán nhờ chat POS chép 3 cửa vào khối máy đọc ngay bây giờ (kèm cờ "đã hẹn") rồi chép bản hợp đồng sang `thiet_ke/` — sớm hơn lịch POS, trộn cửa chưa chạy với cửa đang chạy.
- **B.** Thêm `thiet_ke/HOP_DONG_API_KH.md` vào Phạm vi để máy thêm 3 dòng — App tự sửa bản chép hợp đồng của POS (trái luật "hợp đồng do POS giữ").
- **C.** Thêm `kiem_tra_truoc_khi_giao.js` vào Phạm vi: K8 nhận thêm cửa có trong `src/kiemKhop/canTuPos.js` với `co: false` + `viec_pos` (sổ "App cần gì từ POS" — đã ghi
  3 cửa DOI-DIEM-1), in rõ "đã hẹn: …" thay vì ✗; ca đỏ trước: K8 trên cây hiện tại đỏ, sau sửa xanh; cửa lạ không có ở cả hai nơi vẫn ✗. ~6 dòng. Khi POS gộp DOI-DIEM-1,
  đổi `co: true` thì K8 đòi hợp đồng như mọi cửa khác (thu_KHKHOP1 đã canh hai chiều).
Mọi phần khác của phiếu đã làm xong và xanh; máy dừng ở đây chờ chủ quán chọn.

**Trả lời Q1 (chủ quán 27.11):** chọn C có sửa — KHÔNG đọc canTuPos.js; hằng `DA_HEN_POS` viết thẳng trong `kiem_tra_truoc_khi_giao.js` đúng 3 cửa (nguồn thư POS 16.11);
K8 nhận cửa trong `DA_HEN_POS`; thêm K8d (cửa đã hẹn đã có trong hợp đồng → đỏ, nhắc gỡ); thêm đột biến "cửa lạ trong api.js vẫn đỏ K8"; được thêm
`kiem_tra_truoc_khi_giao.js` vào Phạm vi chỉ cho việc này; làm tiếp tới hết.
- Đã làm: ca thử khối "K8 đã hẹn" trong `cong_cu/thu_KHDOI1.js` (5 ca, chạy BỘ KIỂM THẬT trên bản sao tạm không có `thu_*.js`) — ĐỎ trên bộ kiểm hiện tại
  (`51 đạt · 5 hỏng`, KHONG_TRINH_DUYET=1); bản vá soạn sẵn ở `viec/KH-DOI-1/va_K8.txt`.
- **Q2 — người gác chặn sửa bộ kiểm.** `Edit kiem_tra_truoc_khi_giao.js` → `[G-LUAT] file luật chỉ sửa được khi mục Phạm vi ghi ĐÚNG TÊN file (glob chung không tính)`;
  thêm dòng đó vào phiếu thì `[G1-PHIEU] phiếu và biên bản soát không được sửa`. Máy không lách. Cần chủ quán (hoặc chat soát) thêm vào mục `## Phạm vi` của
  `viec/KH-DOI-1/phieu.md` đúng dòng:
  `- kiem_tra_truoc_khi_giao.js`
  (và nếu muốn, sửa dòng Cấm "không sửa `kiem_tra_truoc_khi_giao.js`" thành "trừ DA_HEN_POS + K8 + K8d — chủ quán 27.11"). Có dòng đó → máy áp `va_K8.txt`, thêm 2 đột biến
  (VS-K8-NHAN-MOI-CUA, BV-K8D-KHONG-NHAC-GO), chạy `npm test`, `--day-du`, cổng `chay`, `/ra-soat`, báo cáo 7 mục — không còn việc chờ quyết định nào khác.
- `node kiem_tra_truoc_khi_giao.js --day-du` (27.11, HEAD 25a5fc9…+ khối K8): `68 đạt · 2 hỏng` — đúng 2 chỗ chờ Q2: `✗ K8 … GET /kho-qua, GET /qua-cua-toi, POST /doi-diem`
  và `✗ thu_KHDOI1.js (133 đạt · 5 hỏng)` (5 ca khối K8). Mọi bài thử khác xanh; `✓ vite build thành công`, `✓ dist/index.html trỏ tới file có thật`,
  `✓ K2d bản dựng chỉ gọi /api/kh và /api/nd`.

## Chỗ vá → đột biến (viec/KH-DOI-1/dot_bien_tay.js — việc chỉ đổi src/, không server/ client/src/ → không dot_bien.py, khuôn KH-VC-2 / KH-NAP-1)
| Chỗ vá | Đột biến |
|---|---|
| nd/doiQua.js `hien.dq` macDinh false | VS-CONG-TAC-MAC-DINH-BAT |
| doiQua.js giữ thứ tự POS | VS-APP-TU-XEP-LAI-QUA |
| doiQua.js nút thiếu điểm / hết hàng | VS-CHO-DOI-KHI-THIEU-DIEM, VS-CHO-DOI-KHI-HET-HANG |
| doiQua.js "Còn lại" không âm | VS-CON-LAI-AM |
| api.js 401 /kho-qua giữ phiên | BV-KHO-QUA-401-THOAT-PHIEN |
| api.js /kho-qua có gửi phiên khách | VS-KHO-QUA-CONG-KHAI |
| duLieuKhach.js xoaKhoKhach xoá cuaQuaToi | BV-DANG-XUAT-GIU-QUA-TOI |
| DoiQua.jsx không lưu PIN | VS-LUU-PIN |
| UuDai.jsx công tắc | VS-UU-DAI-BO-CONG-TAC |
| DoiQua.jsx làm mới kho dữ liệu | BV-KHONG-LAM-MOI-SAU-DOI |
| App.jsx tắt → không vẽ / về /uudai | VS-GOI-KHO-KHI-TAT (trình duyệt) |
| DoiQua.jsx gửi lại cùng khoá | VS-KHOA-GUI-MOI-KHI-GUI-LAI (trình duyệt) |
| DoiQua.jsx khoaGui + PinSheet `dang` | VS-GUI-HAI-LAN-BAM-DUP (trình duyệt) |
| DoiQua.jsx số POS diem_con | VS-TU-TINH-DIEM-CON (trình duyệt) |
| DoiQua.jsx `pin` trong thân | VS-BO-PIN-KHOI-THAN (trình duyệt) |
| DoiQua.jsx nút chỉ khi 'doi' | VS-CHO-DOI-KHI-THIEU-NUT (trình duyệt) |
| DoiQua.jsx dải nhắc theo `nhac` POS | VS-NHAC-KHONG-THEO-POS (trình duyệt) |
| kiem_tra_truoc_khi_giao.js K8 chỉ nhận cửa DA_HEN_POS | VS-K8-NHAN-MOI-CUA |
| kiem_tra_truoc_khi_giao.js K8d | BV-K8D-KHONG-NHAC-GO |

## Sau trả lời Q2 (chủ quán 27.11 — commit PHIEU 12599c2 thêm kiem_tra_truoc_khi_giao.js vào Phạm vi)
- `git pull --no-rebase --ff-only origin viec/KH-DOI-1`: đã ở 12599c2 (hook mở phiên đã kéo).
- Áp `va_K8.txt` vào `kiem_tra_truoc_khi_giao.js` (chỉ khối K8: hằng `DA_HEN_POS` 3 cửa, K8 nhận cửa đã hẹn, K8d) — commit 4dca29d.
- `thu_KHDOI1.js`: 56 đạt · 0 hỏng (KHONG_TRINH_DUYET=1) · 138 đạt · 0 hỏng (Chromium). Gốc: 5 · 39 / 19 · 53. `SỐ CA cong_cu/thu_KHDOI1.js: 56`.
- Đột biến `node viec/KH-DOI-1/dot_bien_tay.js --trinh-duyet`: đối chứng XANH (138/0), **20/20 BẮT ĐƯỢC** — TẤT CẢ ĐỘT BIẾN BỊ BẮT.
- `node kiem_tra_truoc_khi_giao.js --day-du`: **71 đạt · 0 hỏng** (✓ K8 … (hoặc DA_HEN_POS) · ✓ K8d · ✓ vite build · ✓ dist/index.html · ✓ K2d; mọi thu_*.js xanh).
- Cổng (cây sạch, HEAD 9ce2ccd): `node tu_chay/cong.js chay . beab831^ HEAD viec/KH-DOI-1` chạy ở máy có Chromium → `✗ [A16] … SỐ CA` (máy đếm 138 ca, §9);
  chạy như GitHub `KHONG_TRINH_DUYET=1 node tu_chay/cong.js chay . beab831^ HEAD viec/KH-DOI-1` →
  `· CẢNH BÁO A16: cong_cu/thu_KHDOI1.js chạy trên gốc in 44 ca ≠ 56 ca ở head — bài dừng sớm trên gốc thì bỏ qua` (đúng: khối hàm thuần ném lỗi vì thiếu src/doiQua.js)
  · **✓ CỔNG CHẠY ĐẠT**.
HEAD ĐÃ KIỂM: 9ce2ccd

## /ra-soat vòng 1 (agent độc lập, 28.11) — báo cáo chép nguyên
```
KHÔNG ĐẠT
Chạy lại: KHONG_TRINH_DUYET=1 thu_KHDOI1 56/0 · Chromium 138/0 · kiem_tra (tĩnh) 68/0. Lý do KHÔNG ĐẠT: đường đổi điểm còn một lỗ có thể trừ điểm hai lần, không bài thử nào phủ.
LỖI TÌM ĐƯỢC:
- src/pages/DoiQua.jsx:104 (khi `cu` khác null ở :92) — có thể trừ điểm hai lần (đường tiền/điểm, K4): lần trước "chưa rõ", bấm lại CÙNG khoá, POS trả 4xx có mã
  (PIN_SAI / THIEU_DIEM vì lần đầu đã trừ / QUA_HET) → dòng 104 xoá choRo → lần sau KHOÁ MỚI. Trái luật guiDonAnToan (datDon.js:133-135) "4xx sau chưa rõ không chứng minh
  chưa tạo" — luật chỉ giữ trong một lần gọi. Nếu POS kiểm PIN / điểm trước khoá gửi → đổi hai lần. Sửa: `cu` khác null thì không xoá choRo vì 4xx.
- src/pages/DoiQua.jsx:82 — "chưa rõ" chỉ trong useRef của màn: rời Kho quà rồi vào lại → khoá mất. POST /don ghi kh_don_gui (datDon.js:166-170); đổi quà không.
  dq.chuaRo (nd/doiQua.js:41) hứa "không bị trừ điểm hai lần" — chỉ đúng khi ở yên trên màn. Sau "chưa rõ" không làm mới /diem, /kho-qua, /qua-cua-toi (DoiQua.jsx:103).
- cong_cu/thu_KHDOI1.js, dot_bien_tay.js — không ca nào cho "chưa rõ → bấm lại dùng lại khoá + mã quà" (K3); đột biến `khoa_gui: taoKhoaGui()` sẽ sống.
- src/pages/PhieuQua.jsx:22-25 + DoiQua.jsx:101 — đổi hiện vật xong có thể thấy "Không thấy phiếu quà này": App bỏ kq.phieu, đọc kho cuaQuaToi bản cũ; lamMoi ngầm;
  lỗi mạng thì kẹt, không nút Thử lại. Sửa: gộp kq.phieu vào đầu kho cuaQuaToi trước moPhieu.
- src/components/CheDoSua.jsx:44 — "Đi tới màn" điền :ma bằng mã ĐƠN cho mọi đường có :ma → /uudai/qua/:ma mở bằng mã đơn → "Không thấy phiếu".
- src/noiDung/nd/doiQua.js:41 ↔ PinSheet.jsx:41 — chữ "Bấm Xác nhận để gửi lại" nhưng PinSheet đã xoá số PIN; phải nhập lại PIN.
NGHI NGỜ: thứ tự POS kiểm (khoá trước hay PIN / điểm trước) chưa ghi trong thư 16.11 → nên hỏi POS. Máy mới chưa có kh_nd_ban: lần vẽ đầu hien.dq = false →
  link mở thẳng bị đẩy về /uudai trước khi bản nội dung về (chưa thử). Không trình duyệt: B1 / A3 / B7 / "A1 DoiQua" chỉ dò chuỗi nguồn. dq.qt.nhac / dq.ph.dua
  "quán hoàn lại điểm" (hợp đồng: chỉ mặc định) ↔ dq.ghiChu "đổi xong không trả lại điểm" — sửa được ở /admin.
Đơn giản: AnhQua export từ pages/DoiQua.jsx:23, dungGiuManSang từ pages/ManQR.jsx:13 → nên ở components/; DoiQua.jsx:28 ba ngôi 4 tầng → bảng.
K4: guiDonAnToan 2 chỗ; PinSheet 5 chỗ (prop tuỳ chọn); xoaKhoKhach đúng; 401 chỉ /kho-qua giữ phiên; đường dẫn mới 3 (CheDoSua chưa xử lý); hien.dq 2 chỗ.
K5: không thấy luồng hợp lệ bị chặn oan. Ảnh gốc beab831^ ↔ nhánh (thu_KHNAP1, 7 màn, công tắc tắt): không điểm ảnh lệch > 40. dist/ không commit.
NGHIỆM THU: 18/18 mục có bằng chứng (C6 chủ quán thử tay sau khi POS gộp — ghi nhận). B3 chưa thử riêng QUA_HET_LUOT_THANG, PIN_DANG_KHOA, QUA_KHONG_CO.
CHƯA SOÁT ĐƯỢC: cổng chay, --day-du, đột biến tay (dựa trang_thai.md); POS thật; trình duyệt Zalo, chữ phóng to; tỉ lệ lệch ảnh d1–d6.
BÀI HỌC: KHOÁ — mọi đường gửi có khoa_gui phải có ca "chưa rõ → bấm lại → cùng khoá + mã", ca "4xx sau chưa rõ vẫn giữ khoá", đột biến "khoá mới lần bấm sau".
  NGUYÊN TẮC — "chưa rõ" của lệnh trừ tiền / điểm phải sống lâu hơn màn hình (không lưu PIN); luật "4xx sau chưa rõ" giữ qua cả lần bấm sau.
  NGUYÊN TẮC — lệnh ghi đã trả bản ghi mới thì hiện ngay (gộp vào kho). KHOÁ — "Đi tới màn" lấy mẫu tham số theo từng màn.
```

## Vòng sửa 1 (28.11)
| Lỗi soát | Sửa | Ca thử / đột biến |
|---|---|---|
| DoiQua 4xx sau "chưa rõ" xoá khoá; "chưa rõ" chỉ trong useRef | `src/doiQua.js` `docChoRo` / `ghiChoRo` (cấp mô-đun, `{ ma_qua, khoa_gui }` — không PIN); chỉ xoá khi đổi xong ĐÚNG quà đó hoặc đăng xuất (`xoaKhoKhach`) | ca "A1 chưa rõ → rời màn → bấm lại: CÙNG khoá tới khi xong" (4 × 503 → PIN_SAI → xong; 6 POST cùng khoá; lần sau khoá mới); VS-KHOA-MOI-SAU-CHUA-RO, BV-4XX-SAU-CHUA-RO-XOA-KHOA, BV-CHUA-RO-CHI-TRONG-MAN, VS-CHUA-RO-GIU-PIN, BV-DANG-XUAT-GIU-CHUA-RO |
| Sau "chưa rõ" không làm mới | `lamMoi([cuaDiem, cuaVoucher, cuaQuaToi])` + `kho.taiLai()` | "chưa rõ → lấy lại /diem và /qua-cua-toi" |
| Phiếu quà "Không thấy phiếu" khi /qua-cua-toi chậm / lỗi | `docKetQuaDoi` trả thêm `phieuTho`; DoiQua gộp vào đầu kho `cuaQuaToi` trước khi mở Phiếu quà | B5 "hiện NGAY … (GET /qua-cua-toi chậm 5 giây)"; BV-KHONG-GOP-PHIEU |
| CheDoSua "Đi tới màn" điền mã ĐƠN cho /uudai/qua/:ma | bỏ Phiếu quà khỏi danh sách (không có mã mẫu) | ca dò nguồn; BV-CHE-DO-SUA-MA-DON-CHO-PHIEU |
| Chữ `dq.chuaRo` "Bấm Xác nhận…" lệch hành vi + hứa "không trừ hai lần" | "Nhập lại PIN rồi bấm Xác nhận để gửi lại đúng lần đổi này." | ca "Chưa rõ … Nhập lại PIN" |
| Đơn giản: AnhQua ở pages; ba ngôi 4 tầng | `src/components/AnhQua.jsx`; bảng `NUT` | — |
Không sửa (ghi nhận): `dungGiuManSang` vẫn export từ pages/ManQR.jsx (dời sang components = đụng ManQR thêm, không đổi hành vi); chữ "quán hoàn lại điểm" ↔ "đổi xong
không trả lại điểm" — chữ thiết kế đã duyệt, sửa được ở /admin → `## Phát hiện`.

Sau sửa:
- `thu_KHDOI1.js` 59 đạt · 0 hỏng (KHONG_TRINH_DUYET=1) · 149 đạt · 0 hỏng (Chromium); gốc 5 · 42 / 20 · 57; `SỐ CA cong_cu/thu_KHDOI1.js: 59`.
- Đột biến `--trinh-duyet`: đối chứng XANH (149/0), **27/27 BẮT ĐƯỢC** (lượt đầu sau sửa: BV-KHONG-LAM-MOI-SAU-DOI sót ở nhóm dò nguồn vì DoiQua có hai `lamMoi` →
  chuyển sang nhóm trình duyệt; VS-BO-PIN-KHOI-THAN đổi chuỗi theo code mới).
- `--day-du` **71 đạt · 0 hỏng**. Cổng (HEAD 74424d1, KHONG_TRINH_DUYET=1): `· CẢNH BÁO A16 … 47 ca ≠ 59 ca … bài dừng sớm trên gốc thì bỏ qua` · **✓ CỔNG CHẠY ĐẠT**.

## Phát hiện
- Chữ mặc định `dq.qt.nhac` / `dq.ph.dua` nói "quán hoàn lại điểm" khi phiếu quá hạn; hợp đồng: hoàn là MẶC ĐỊNH, Cài đặt quán đổi được. `dq.ghiChu` "đổi xong không trả lại
  điểm" (ý: đổi xong không đổi ngược). Chủ quán xem lại chữ ở /admin khi bật `hien.dq` (soát vòng 1).
- "Chưa rõ" của đổi quà sống qua chuyển màn nhưng MẤT khi tải lại trang (không lưu máy: khoá mới trên máy phải thêm vào danh sách `src/luuMay.js` — ngoài Phạm vi).
  Muốn bền như `kh_don_gui` của POST /don → việc sau (luuMay.js + khoá `kh_doi_gui`, không PIN).
- Máy mới chưa có bản nội dung (`kh_nd_ban`): lần vẽ đầu `hien.dq` = mặc định tắt → link mở thẳng /uudai/doi-qua bị đưa về /uudai trước khi bản nội dung về (soát vòng 1, chưa thử).
- Hỏi POS (gửi kèm khi DOI-DIEM-1): thứ tự kiểm của `POST /doi-diem` — tra `khoa_gui` TRƯỚC khi kiểm PIN / điểm / tồn (như `POST /don`)? App đã giữ khoá qua 4xx nên an toàn cả hai cách.
HEAD ĐÃ KIỂM: 74424d1

## /ra-soat vòng 2 (agent độc lập, 28.11) — báo cáo chép nguyên
```
KHÔNG ĐẠT
Chạy lại ở HEAD 7a84512: KHONG_TRINH_DUYET=1 thu_KHDOI1 59/0 · Chromium 149/0 · KHONG_TRINH_DUYET=1 npm test 68/0. Lỗi vòng 1 đã sửa đúng (DoiQua.jsx:114,
doiQua.js:62-64, gopPhieu DoiQua.jsx:26-30 + :104, CheDoSua.jsx:44, dq.chuaRo, AnhQua). Lý do KHÔNG ĐẠT: đường điểm vẫn còn cách đổi hai lần, bài thử / đột biến không phủ.
LỖI TÌM ĐƯỢC:
- src/pages/DoiQua.jsx:87-88, :96-110 — khoá "đang gửi" và "chưa rõ" chỉ có hiệu lực SAU khi lần gửi kết thúc (K4): khoaGui trong useRef; ghiChoRo chỉ sau KHONG_BIET
  (1 + 3 lần gửi, mỗi lần tới 20 giây). Đang gửi mà khách bấm Back (PinSheet chỉ chặn nút đóng của nó, PinSheet.jsx:25) → DoiQua gỡ, vào lại: khoaGui mới, docChoRo() null →
  bấm lại cùng quà → taoKhoaGui() mới, POST /doi-diem thứ hai song song khoá khác → POS trừ hai lần. POST /don ghi kh_don_gui TRƯỚC lần gửi đầu. Không ca "rời màn khi đang gửi".
  Sửa: ghiChoRo trước gui; xoá khi lần đầu 4xx chắc chắn (khoá mới) hoặc đổi xong; khoá gửi ở cấp mô-đun.
- src/doiQua.js:62-64 — MỘT ô "chưa rõ": A chưa rõ rồi B chưa rõ → ghi đè khoá A → lần bấm A sau khoá mới → có thể trừ A lần nữa (K4). Không ca / đột biến.
- src/duLieuKhach.js:59, App.jsx:174, luuMay.js:68 — luật xoá đảo ngược so với kh_don_gui (K4/K5): xoaKhoKhach chạy ở donPhien = MỌI 401 → mất khoá; kh_don_gui chỉ
  dangXuat mới xoá (App.jsx:219, CLAUDE.md §8). 401 ngay trong POST /doi-diem: donPhien xoá rồi DoiQua.jsx:110 ghi lại. Khách KHÁC đăng nhập cùng máy: luuMay.doiKhach không
  xoá choRo → khách sau kế thừa khoa_gui. Ca thu_KHDOI1.js:142 gọi thẳng xoaKhoKhach — không phủ đường thật.
- trang_thai.md "Vòng sửa 1" / "Phát hiện" (K1): "App đã giữ khoá qua 4xx nên an toàn cả hai cách", "chỉ xoá khi đổi xong ĐÚNG quà đó hoặc đăng xuất" không đúng code.
NGHI NGỜ: (K5) A chưa rõ mà POS đã trừ, khách muốn đổi A thêm → lần bấm dùng khoá cũ → POS trả kết quả CŨ, App "Đã đổi quà!" mã cũ; phải bấm thêm lần nữa mới đổi thật.
  DoiQua.jsx:107 đổi hiện vật xong SAU khi rời màn vẫn moPhieu → kéo khách sang Phiếu quà từ màn khác. docKetQuaDoi luôn null (phiếu hỏng) → kẹt "chưa rõ" tới đăng xuất /
  tải lại. Máy mới chưa có kh_nd_ban (đã ở Phát hiện). gopPhieu sửa kho từ màn, lọc bằng tho.ma chưa cắt khoảng trắng.
NGHIỆM THU: 18/18 (C6 ghi nhận). Thiếu một phần: B3 chưa ca riêng QUA_HET_LUOT_THANG, PIN_DANG_KHOA, QUA_KHONG_CO; C1 / C3 thiếu ca + đột biến cho 3 lỗi trên.
CHƯA SOÁT ĐƯỢC: --day-du, cổng chay, đột biến (không chạy lại); "rời màn khi đang gửi" suy từ code; POS thật (khoá gắn theo khách?); Zalo, chữ phóng to, ảnh d1–d6.
BÀI HỌC: KHOÁ — lệnh trừ điểm / tiền có khoa_gui ghi "đang gửi / chưa rõ" TRƯỚC lần gửi đầu, ở chỗ sống lâu hơn màn; ca "rời màn khi đang gửi rồi bấm lại → không POST
  khoá mới". NGUYÊN TẮC — bản ghi "chưa rõ" mới chép ĐÚNG luật sống / xoá của kh_don_gui (giữ khi 401, xoá khi đăng xuất hoặc doiKhach báo khác khách, mỗi lệnh một bản
  ghi hoặc chặn lệnh mới); ca thử đi qua đường thật (donPhien, doiKhach), không gọi thẳng hàm xoá.
```
Ghi chú: câu "App đã giữ khoá qua 4xx nên an toàn cả hai cách" ở mục Phát hiện là SAI theo vòng 2 (giữ dưới đây, sửa ở vòng sửa 2).

## Vòng sửa 2 (28.11)
