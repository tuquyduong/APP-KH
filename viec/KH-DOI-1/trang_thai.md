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
- Hỏi POS (gửi kèm khi DOI-DIEM-1): thứ tự kiểm của `POST /doi-diem` — tra `khoa_gui` TRƯỚC khi kiểm PIN / điểm / tồn (như `POST /don`)? Khoá có gắn theo khách không?
  (Câu cũ "App đã giữ khoá qua 4xx nên an toàn cả hai cách" SAI ở vòng 1 — soát vòng 2; sau vòng sửa 2 xem mục dưới.)
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
| Lỗi soát vòng 2 | Sửa | Ca thử / đột biến |
|---|---|---|
| Đang gửi mà rời màn → vào lại bấm cùng quà → POST song song khoá mới | khoá chặn gửi song song ở CẤP MÔ-ĐUN (`guiDoi` trong DoiQua.jsx — không còn useRef); bấm khi đang gửi → lời `dq.dangGui`, không POST | ca "A1 rời màn KHI ĐANG GỬI rồi bấm lại: không gửi song song, không khoá mới"; BV-KHONG-CHAN-SONG-SONG |
| Một ô "chưa rõ" — quà B đè quà A | `src/doiQua.js` bảng `ma_qua → khoa_gui` (`khoaChoRo` / `ghiChoRo` / `xoaChoRo`) | hàm thuần "quà B không đè khoá quà A"; ca "chưa rõ quà A rồi đổi quà B → bấm lại A vẫn khoá cũ"; VS-CHUA-RO-MOT-O |
| Luật xoá ngược kh_don_gui (401 xoá; khác khách không xoá) | bỏ khỏi `xoaKhoKhach` (donPhien / 401 → GIỮ); `xoaChoRo()` ở `dangXuat` và `docLaiGio` (chỉ gọi khi `luuMay.doiKhach` báo khác khách) | hàm thuần "401 GIỮ", dò nguồn App (dangXuat, docLaiGio, không donPhien, 2 chỗ doiKhach); VS-401-XOA-CHUA-RO, BV-DANG-XUAT-GIU-CHUA-RO, BV-KHAC-KHACH-GIU-CHUA-RO |
| Kết quả về sau khi rời màn kéo khách sang Phiếu quà | `conMo` (ref đặt lại mỗi lần gắn màn) — không đổi màn khi màn đã gỡ | ca "lần gửi cũ xong SAU khi đã rời màn → không kéo khách sang Phiếu quà"; BV-KEO-SANG-PHIEU-SAU-KHI-ROI |
| gopPhieu sửa kho từ màn, không cắt khoảng trắng | `gopPhieuQua` dời về `duLieuKhach.js` cạnh `cuaQuaToi`, so mã đã `trim` | BV-KHONG-GOP-PHIEU |
Ghi khoá trước khi gửi (đề xuất của soát vòng 2): đã làm rồi BỎ — đột biến BV-GHI-KHOA-SAU-KHI-GUI SÓT vì khoá song song cấp mô-đun đã chặn mọi lần bấm lại lúc đang gửi
→ dòng đó thừa; khoá chỉ ghi khi "chưa rõ" (BV-CHUA-RO-KHONG-GHI-KHOA canh).
Nghi ngờ vòng 2 không sửa (ghi nhận): A "chưa rõ" mà POS đã trừ, khách bấm lại A → POS trả kết quả CŨ, App hiện "Đã đổi quà!" mã cũ — đúng nghĩa (lần đổi đó đã xảy ra),
lần bấm tiếp là đổi mới; phiếu POS hỏng (docKetQuaDoi null mãi) → quà kẹt "chưa rõ" tới đăng xuất / tải lại — POS trả đúng hợp đồng thì không xảy ra.

Sau sửa:
- `thu_KHDOI1.js` 62 đạt · 0 hỏng (KHONG_TRINH_DUYET=1) · 159 đạt · 0 hỏng (Chromium); gốc 5 · 45 / 22 · 62; `SỐ CA cong_cu/thu_KHDOI1.js: 62`.
- Đột biến `--trinh-duyet`: đối chứng XANH (159/0), **32/32 BẮT ĐƯỢC** — TẤT CẢ ĐỘT BIẾN BỊ BẮT.
- `--day-du` **71 đạt · 0 hỏng**. Cổng (HEAD 6f85ce8, KHONG_TRINH_DUYET=1): `· CẢNH BÁO A16 … 50 ca ≠ 62 ca … bài dừng sớm trên gốc thì bỏ qua` · **✓ CỔNG CHẠY ĐẠT**.
HEAD ĐÃ KIỂM: 6f85ce8

## /ra-soat vòng 3 (agent độc lập, 28.11) — báo cáo chép nguyên (rút dòng)
```
KHÔNG ĐẠT
Chạy lại ở HEAD 19c1a9d: KHONG_TRINH_DUYET=1 thu_KHDOI1 62/0 · Chromium 159/0 · npm test 68/0; dist/ không commit; kiem_tra chỉ khối K8 (+8 −1).
Lỗi vòng 2 đã sửa đúng: chặn song song cấp mô-đun (DoiQua.jsx:25, :93-94), "chưa rõ" theo từng quà (doiQua.js:63-67), 401 giữ khoá (duLieuKhach.js:58),
  đăng xuất xoá (App.jsx:220), không kéo sang Phiếu quà khi rời màn (DoiQua.jsx:82-83, :99), gopPhieuQua ở duLieuKhach.js:60-66 có trim. "Khách khác" chỉ sửa một phần.
LỖI TÌM ĐƯỢC:
1. App.jsx:161 + :185 / :297, luuMay.js:63-69 (K4): xoaChoRo chỉ khi doiKhach trả true (xoa); kho máy bị chặn → 'chuaBiet' + không dữ liệu → xoa false → choRo sống.
   A quà 1 "chưa rõ", A hết phiên (giữ khoá — đúng), B đăng nhập cùng tab, đổi quà 1 → gửi khoa_gui của A bằng token B; POS so khoá chung → B thấy kết quả / phiếu của A.
   doiQua.js:61 "xoá khi khách KHÁC đăng nhập" không đúng ca này. Sửa: gắn mỗi dòng choRo với dấu vết SĐT, khoaChoRo chỉ trả khoá khi đúng khách.
2. DoiQua.jsx:95-98, :104-106, duLieuKhach.js:60-66 (K4, vòng qua chốt `phien` của taoCua): kết quả về sau khi phiên đổi vẫn ghi vào trạng thái phiên mới.
   A đổi hiện vật → Back → Đăng xuất → xong: gopPhieuQua(phiếu A) ghi vào kho vừa xoá → B đăng nhập thấy phiếu + QR của A. Ra KHONG_BIET: ghiChoRo khoá A SAU dangXuat.
   Tự gửi lại đọc token mới mỗi lần (api.js:72) → B đăng nhập giữa chừng thì thân A (PIN A) đi bằng token B. Sửa: chụp phiên / khách lúc bấm, khác thì bỏ.
3. thu_KHDOI1.js:141-152, dot_bien_tay.js:32-34 (K3): ca "401 GIỮ" gọi thẳng xoaKhoKhach; đăng xuất / khác khách chỉ dò chữ nguồn App — không ca đi qua đường thật.
4. trang_thai.md "Vòng sửa 2" / Phát hiện, doiQua.js:61 (K1): "docLaiGio chỉ gọi khi doiKhach báo khác khách" sai (báo theo xoa); ca hàm thuần "401 GIỮ" không qua donPhien;
   "xem mục dưới" không có mục; chú thích thu_KHDOI1.js:548 "khoá ghi TRƯỚC khi gửi" đã bỏ.
NGHI NGỜ: tự gửi lại đọc token mới (chung POST /don, có từ trước); khoá song song cấp mô-đun không gỡ theo phiên (B bị dq.dangGui tới hết vòng gửi lại — có trần, không kẹt
  mãi); đổi voucher xong sau khi rời màn không báo "Đã đổi quà!", danh sách kho của lần mở mới không tải lại (POS vẫn chặn đúng); máy mới chưa có kh_nd_ban (đã ở Phát hiện).
Đường điểm: không còn cách đổi hai lần trong cùng phiên trang; tải lại trang mất khoá (đã ở Phát hiện); PIN không lưu; App không tự tính số thật.
NGHIỆM THU: 17/18 (C6 ghi nhận); B3 chưa ca riêng QUA_HET_LUOT_THANG, PIN_DANG_KHOA (lối hiện nguyên lời POS đã phủ).
CHƯA SOÁT ĐƯỢC: --day-du, cổng chay, đột biến (không chạy lại); lỗi 1, 2 suy từ code; POS thật; Zalo, chữ phóng to, tỉ lệ lệch ảnh.
BÀI HỌC: KHOÁ — bản ghi "chưa rõ" / đang gửi của lệnh trừ điểm gắn với khách (dấu vết SĐT) lúc gửi; kết quả về khi phiên đã đổi không ghi vào kho / bản ghi / màn của phiên
  mới; ca "đăng xuất lúc đang gửi → B đăng nhập → không thấy phiếu, không dùng khoá A". NGUYÊN TẮC — bản ghi chỉ trong bộ nhớ trang chép luật quên của quenBoNho
  (cung !== true), không chép luật xoá kho máy (xoa); ca thử luật sống / xoá đi qua nút và cửa thật, dò chữ nguồn không tính là bằng chứng.
```

## Vòng sửa 3 (28.11 — vòng cuối được phép, so_vong_sua_toi_da = 3)
| Lỗi soát vòng 3 | Sửa | Ca thử (đường thật) / đột biến |
|---|---|---|
| 1. Khoá "chưa rõ" không gắn khách — kho máy chặn → `doiKhach` không báo → B dùng khoá A | `doiQua.js` mỗi dòng `{ khoa, chu }` (chu = `luuMay.dauVet` SĐT từ /toi THẬT — `duLieuKhach.khachDangGiu`); `khoaChoRo(ma, chu)` chỉ trả khoá khi đúng khách; chưa biết khách → không gửi (`dq.choKhach`), không ghi | ca "kho máy chặn ghi chủ máy + hết phiên + khách B đăng nhập → không dùng khoá A" (kh_chu bị chặn ghi thật bằng Storage.setItem); hàm thuần "khoá GẮN khách"; VS-KHOA-KHONG-GAN-KHACH |
| 2. Kết quả về khi phiên đã sang người khác vẫn ghi vào kho / bản ghi / màn phiên mới; tự gửi lại bằng phiên mới | `cungKhach()` chụp lúc bấm: kết quả về mà khách khác → bỏ hết (không gộp phiếu, không xoá / ghi khoá, không đổi màn); `guiDoi` truyền `cung` vào `gui` — khác khách thì KHÔNG gửi (lỗi `DOI_KHACH`) | ca "Đăng xuất KHI ĐANG GỬI → khách B không thấy phiếu / QR của A" (GET /qua-cua-toi của B hỏng để phiếu gộp nhầm lộ ra); ca "đổi phiên giữa các lần tự gửi lại → không gửi thân của A bằng phiên B"; BV-KET-QUA-KHAC-KHACH, BV-GUI-LAI-BANG-PHIEN-KHAC |
| 3. Ca luật sống / xoá chỉ gọi thẳng hàm / dò chữ nguồn | bỏ ca dò chữ App; ca đi qua ĐƯỜNG THẬT trong trình duyệt: /diem trả 401 thật → `donPhien`; đăng nhập lại bằng màn Đăng nhập (`#sdt`, `#ma`); nút "Đăng xuất" ở Tài khoản; điều hướng trong App (pushState + popstate, không tải lại trang) | ca "401 → đăng nhập lại CÙNG khách giữ khoá; bấm Đăng xuất → xoá khoá"; VS-401-XOA-CHUA-RO, BV-DANG-XUAT-GIU-CHUA-RO chuyển sang nhóm trình duyệt (bắt bằng hành vi) |
| 4. K1 trong trang_thai / chú thích | `docLaiGio` không còn xoá khoá (khoá gắn khách thay cho luật "khác khách"); bỏ câu "docLaiGio chỉ gọi khi doiKhach báo khác khách"; sửa chú thích doiQua.js, thu_KHDOI1.js ("khoá ghi TRƯỚC khi gửi" đã bỏ) | — |
Nghi ngờ vòng 3 không sửa (ghi nhận): khoá song song cấp mô-đun không gỡ theo phiên — A đăng xuất lúc đang gửi thì B thấy `dq.dangGui` tới hết vòng gửi lại (có trần: 20 giây / lần,
≤ 4 lần; DANG_XU_LY tới ~1 phút — không kẹt mãi); đổi voucher xong sau khi rời màn không có màn "Đã đổi quà!" (voucher vẫn vào Ví, điểm làm mới).

Sau sửa (máy khởi động lại giữa chừng — `--day-du` chạy lại):
- `thu_KHDOI1.js` 62 đạt · 0 hỏng (KHONG_TRINH_DUYET=1) · 171 đạt · 0 hỏng (Chromium); gốc 5 · 45 / 26 · 66; `SỐ CA cong_cu/thu_KHDOI1.js: 62`.
- Đột biến `--trinh-duyet`: đối chứng XANH (171/0), **34/34 BẮT ĐƯỢC** (lượt đầu sau sửa: 3 chuỗi vá cũ không còn → cập nhật; VS-401-XOA-CHUA-RO,
  BV-DANG-XUAT-GIU-CHUA-RO SÓT ở nhóm dò nguồn vì đã bỏ ca dò chữ → chuyển nhóm trình duyệt + ca "Đăng xuất rồi đăng nhập lại → khoá mới").
- `--day-du` **71 đạt · 0 hỏng** (thu_KHDOI1 có Chromium 92 giây — gần mức 120 giây/bài của bộ kiểm, xem Phát hiện).
- Cổng (HEAD d3e4b80, KHONG_TRINH_DUYET=1): `· CẢNH BÁO A16 … 50 ca ≠ 62 ca … bài dừng sớm trên gốc thì bỏ qua` · **✓ CỔNG CHẠY ĐẠT**.

## Phát hiện (thêm sau vòng sửa 3)
- `thu_KHDOI1.js` phần Chromium chạy ~92 giây trong `npm test` (mức 120 giây/bài): máy bận có thể QUÁ GIỜ. GitHub chạy KHONG_TRINH_DUYET=1 (vài giây) nên không ảnh hưởng cổng.
  Việc sau có thể tách các ca "đường thật" sang bài riêng.
- Tự gửi lại đọc phiên mới mỗi lần (`guiDonAnToan` / `goi`) — đổi quà đã chặn bằng `cung()`; `POST /don` (Thanh toán) có cùng khuôn, chưa chặn — ngoài Phạm vi (soát vòng 3).
HEAD ĐÃ KIỂM: d3e4b80

## /ra-soat vòng 4 (agent độc lập, 28.11) — báo cáo chép nguyên (rút dòng)
```
KHÔNG ĐẠT
Chạy lại: KHONG_TRINH_DUYET=1 thu_KHDOI1 62/0 · Chromium 171/0. Bốn lỗi vòng 3 đã sửa đúng (doiQua.js:63-67 gắn khách; DoiQua.jsx:94-96, :102 chụp khách, :27-28 không
gửi lại bằng phiên khác; App.jsx:220 Đăng xuất xoá, :161 docLaiGio không xoá; ca đường thật thu_KHDOI1.js:604-663 qua 401 thật / màn Đăng nhập / nút Đăng xuất).
LỖI TÌM ĐƯỢC:
1. src/pages/DoiQua.jsx:111 (+ api.js:87, App.jsx:175, duLieuKhach.js:58, :60) — 401 GIỮA chuỗi tự gửi lại: lần 1 hết giờ (POS có thể đã trừ), lần gửi lại (hoặc một GET
   cùng lúc) nhận 401 → donPhien → xoaKhoKhach xoá cuaToi → khachDangGiu() '' → `if (!cungKhach()) throw` chạy TRƯỚC nhánh KHONG_BIET → không ghiChoRo. A đăng nhập lại
   (cùng tab), bấm lại cùng quà → khoá mới → có thể trừ hai lần. POST /don không mắc vì ghi kh_don_gui TRƯỚC lần gửi đầu. Ca 401 hiện có đặt 401 SAU khi chuỗi gửi xong.
   Sửa: nhánh KHONG_BIET luôn ghiChoRo(q.ma, than.khoa_gui, chu) kể cả phiên đã đổi (khoá gắn chu A — khách khác không đọc; Đăng xuất xoá hết). Ca "lần 1 hết giờ → lần 2
   401 → A đăng nhập lại → cùng khoá". Mức nặng: xác suất thấp nhưng là đường điểm, đúng ngoại lệ luật §8 / vòng sửa 2 hứa giữ. (K4 / K3)
2. src/duLieuKhach.js:28 (`if (cho) return cho;`) + DoiQua.jsx:80, :104-105 — "lấy mới sau đổi" dùng lại GET /qua-cua-toi ĐANG BAY từ lúc mở màn → bản cũ (chưa có
   phiếu mới) về SAU khi gộp → đè → Phiếu quà "Không thấy phiếu quà này", không lấy lại tới 5 phút / mở lại màn (đúng cái B5 hứa). /diem tương tự (Ưu đãi hiện số trước
   khi đổi — chỉ hiển thị). Ca B5 "chậm 5 giây" chỉ làm chậm GET gửi SAU khi đổi (thu_KHDOI1.js:306). Sửa: sau lệnh ghi bỏ lệnh đang bay rồi lấy mới (vd taoCua có
   layMoi() tăng `phien` không xoá kho), hoặc gopPhieuQua gộp lại khi bản về thiếu phiếu. (K4 / K3)
3. src/pages/DoiQua.jsx:95 — /toi lỗi mạng → dq.choKhach "chờ rồi bấm lại" nhưng không ai gọi lại cuaToi.lay() → kẹt tới 5 phút / quay lại app / rời màn, mỗi lần nhập lại
   PIN. Sửa: chưa biết khách thì gọi cuaToi.lay(). (K5, nhẹ)
4. src/doiQua.js:61-62, App.jsx:220 (chú thích "401 thì GIỮ"), trang_thai.md vòng sửa 2 / 3 — "401 → GIỮ khoá" không đúng trọn vẹn vì lỗi 1. (K1)
NGHI NGỜ: choRo đánh theo mã quà — B (cùng tab, A hết phiên) đổi cùng quà xong / 4xx khoá mới → xoá dòng A; B "chưa rõ" → đè dòng A (DoiQua.jsx:103, :113, :117) — khớp
  luật §8 "khác khách → xoá", không tính lỗi, nên ghi rõ ở chú thích doiQua.js:61. Các mục Phát hiện cũ không nặng hơn.
K5 khác: SĐT không đổi được (HoSo.jsx:65); gia hạn token không xoá cuaToi; Chế độ sửa chặn ghi bằng 423 CHE_DO_SUA → "chưa tạo", không kẹt.
Đường điểm: còn lỗi 1; PIN không lưu; App không tự tính số thật; khách B không thấy dữ liệu A (DoiQua.jsx:102, :111; ca thu_KHDOI1.js:650-663). dist/ không commit.
NGHIỆM THU: 18/18 có bằng chứng (C6 ghi nhận); B5 có lỗi 2; C3 / C5 dựa trang_thai.
CHƯA SOÁT ĐƯỢC: npm test, --day-du, cổng chay, đột biến (không chạy lại); lỗi 1–3 suy từ code; POS thật; Zalo, chữ phóng to, tỉ lệ lệch ảnh.
BÀI HỌC: KHOÁ — lệnh trừ điểm / tiền: bản ghi "chưa rõ" ghi KHÔNG điều kiện phiên (đã gắn chủ thì an toàn); ca "401 GIỮA chuỗi tự gửi lại → đăng nhập lại cùng khách →
  cùng khoá". NGUYÊN TẮC — "lấy mới sau lệnh ghi" phải bỏ lệnh GET đang bay từ trước lệnh ghi (không dùng lại `cho`); ca thử làm chậm cả GET gửi TRƯỚC lệnh ghi.
```

## Câu hỏi
**Q3 — hết 3 vòng sửa (`so_vong_sua_toi_da` = 3), soát vòng 4 còn KHÔNG ĐẠT.** Theo skill (bước 8) máy dừng, không tự mở vòng sửa 4. Ba lỗi còn lại (mục trên), máy đề xuất
sửa đúng như người soát gợi ý — nhỏ, đều trong Phạm vi, không đổi hợp đồng:
- Lỗi 1 (đường điểm): `DoiQua.jsx` nhánh `KHONG_BIET` ghi khoá TRƯỚC phép thử `cungKhach()` (khoá đã gắn SĐT A — khách khác không đọc được, Đăng xuất vẫn xoá hết) — ~2 dòng;
  ca "lần 1 hết giờ → lần 2 trả 401 → A đăng nhập lại → cùng khoá" + đột biến.
- Lỗi 2 (B5): `duLieuKhach.js` `taoCua` thêm `layMoi()` (bỏ lệnh GET đang bay, lấy mới, không xoá kho); DoiQua dùng nó sau đổi cho `/qua-cua-toi`, `/diem`, `/voucher` — ~6 dòng;
  ca "GET /qua-cua-toi lúc MỞ màn chậm, đổi hiện vật xong trước → Phiếu quà vẫn còn" + đột biến.
- Lỗi 3 (K5 nhẹ): chưa biết khách thì gọi `cuaToi.lay()` — 1 dòng; ca "/toi lỗi lần đầu → bấm lại đổi được".
- Lỗi 4 (K1): sửa chú thích + trang_thai theo lỗi 1.
Chủ quán chọn: (a) cho máy làm **vòng sửa 4** đúng 4 việc trên rồi soát lại; hoặc (b) gộp như hiện tại (công tắc `hien.dq` TẮT mặc định — khách chưa gặp lỗi nào cho tới khi
chủ quán bật sau khi POS gộp DOI-DIEM-1), ghi 3 lỗi thành việc sau (vd KH-DOI-2) làm TRƯỚC khi bật `hien.dq`.
Máy dừng ở đây (chưa làm bước 11 / báo cáo 7 mục — làm sau khi soát ĐẠT hoặc chủ quán chọn b).

**Trả lời Q3 (chủ quán 28.11):** chọn (a) — cho MỘT vòng sửa 4 (vòng cuối): sửa đúng 3 lỗi Q3 + 2 câu chú thích "401 thì giữ khoá", kèm ca thử + đột biến từng lỗi;
soát vòng 5 chỉ còn lỗi mức thấp thì KHÔNG sửa nữa → mục "Chuyển KH-DOI-2", bước 11, báo cáo 7 mục, dừng.

## Vòng sửa 4 (28.11 — vòng cuối, chủ quán cho phép)
| Lỗi soát vòng 4 | Sửa | Ca thử / đột biến |
|---|---|---|
| 1. 401 giữa chuỗi tự gửi lại → mất khoá "chưa rõ" | DoiQua.jsx: `KHONG_BIET` → `ghiChoRo(…, chu)` TRƯỚC phép thử `cungKhach()` (khoá gắn chu A — khách khác không đọc; Đăng xuất xoá) | ca "A1 401 GIỮA chuỗi tự gửi lại → A đăng nhập lại → CÙNG khoá" (503 → 401 thật ở POST /doi-diem → donPhien → màn Đăng nhập → 3 POST cùng khoá); BV-401-GIUA-CHUOI-MAT-KHOA, BV-CHUA-RO-KHONG-GHI-KHOA |
| 2. GET đang bay từ lúc mở màn về muộn đè phiếu vừa đổi | duLieuKhach.js `taoCua` thêm `layMoi()` (tăng `phien`, bỏ lệnh đang bay, lấy mới, không xoá kho); DoiQua `layMoiSauDoi` cho /diem, /voucher, /qua-cua-toi (đổi xong + chưa rõ) | hàm thuần "taoCua.layMoi: lệnh GET cũ về SAU không đè bản mới"; ca "B5 GET /qua-cua-toi lúc MỞ màn về SAU khi đổi xong → không đè" (POS giả chụp dữ liệu lúc NHẬN yêu cầu, trả sau 4 giây); BV-DUNG-LAI-GET-DANG-BAY, BV-KHONG-LAM-MOI-SAU-DOI |
| 3. /toi lỗi → kẹt "chờ rồi bấm lại" | chưa biết khách → `cuaToi.lay()` rồi báo `dq.choKhach` | ca "B3 hồ sơ (/toi) lỗi → bấm Xác nhận tự tải lại → bấm lại đổi được"; BV-HO-SO-LOI-KHONG-TAI-LAI |
| 4. Chú thích "401 thì giữ" chưa trọn | `doiQua.js` (ghi khi chưa rõ kể cả 401 giữa chuỗi; khoá theo mã quà — khách khác cùng tab xoá / đè dòng của khách trước, đúng §8); `App.jsx` dangXuat ("CHỈ bấm Đăng xuất mới xoá; 401 — kể cả giữa chuỗi tự gửi lại — giữ") | — |
Sửa K1 trang_thai: các câu "401 → GIỮ khoá" ở "Vòng sửa 2" / "Vòng sửa 3" chỉ đúng trọn từ vòng sửa 4 (trước đó 401 GIỮA chuỗi tự gửi lại làm mất khoá — soát vòng 4).

Sau sửa:
- `thu_KHDOI1.js` 63 đạt · 0 hỏng (KHONG_TRINH_DUYET=1) · 181 đạt · 0 hỏng (Chromium); gốc 5 · 46 / 29 · 70; `SỐ CA cong_cu/thu_KHDOI1.js: 63`.
- Đột biến `--trinh-duyet`: đối chứng XANH (181/0), **37/37 BẮT ĐƯỢC** — TẤT CẢ ĐỘT BIẾN BỊ BẮT.
- `--day-du` **71 đạt · 0 hỏng** (thu_KHDOI1 Chromium 103 giây — Phát hiện mức 120 giây).
- Cổng (HEAD dc2c741, KHONG_TRINH_DUYET=1): `· CẢNH BÁO A16 … 51 ca ≠ 63 ca … bài dừng sớm trên gốc thì bỏ qua` · **✓ CỔNG CHẠY ĐẠT**.
HEAD ĐÃ KIỂM: dc2c741
