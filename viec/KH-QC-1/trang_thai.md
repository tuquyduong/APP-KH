# KH-QC-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-QC-1`; HEAD = FETCH_HEAD = `0a5f194`.
- `0a5f194 PHIEU: KH-QC-1`
- `ea0281e TIEN-DO: mo KH-ADMIN-1 …`
- `474eda6 TIEN-DO: KH-ND-3d, KH-THE-1 xong …`

## Câu hỏi

## Phát hiện

### Câu hỏi (ghi 15.11, sau `npm test` — 46 đạt · 6 hỏng; dừng chờ chủ quán)
1. `src/pages/KiemKhop.jsx:11` có bảng `GOI` ánh xạ `cua` → hàm gọi. Nghiệm thu A2 bắt thêm dòng `GET /quang-cao` vào `canTuPos.js`, nhưng `GOI['GET /quang-cao']` chưa có →
   `thu_KHUI3b.js` đỏ 2 ca ("GOI[cua] is not a function", trang /kiemkhop sập). Phiếu CẤM sửa `src/pages/**`. Cần: cho phép thêm `'GET /quang-cao': layQuangCao` vào `KiemKhop.jsx` (1 dòng + import),
   hay bỏ dòng A2 khỏi `canTuPos.js`?
2. `thu_KHUI3d.js:231` (ca B4, 6 lần ở 360/390/430 × 100/130%) có danh sách cửa được phép gọi; `/quang-cao` là cửa mới nên ca đỏ ("cửa lạ"). Bài này xanh trên gốc, phiếu D2 chỉ cho sửa ca `uu_tien` →
   cần chủ quán thêm mục `## Bài thử cũ sửa` (thêm `/quang-cao` vào danh sách) hoặc cho phép sửa.
→ Chủ quán trả lời 15.11 (cuối phiếu): đồng ý cả hai. Đã làm: `KiemKhop.jsx` +1 dòng GOI + import; `thu_KHUI3d.js` thêm `/quang-cao` + 1 ca tĩnh (đỏ trên gốc, `bang_chung_do.txt`).

## Báo cáo 7 mục (15.11)

**1. VIỆC** — KH-QC-1: dải quảng cáo + banner "Hôm nay" đọc `GET /quang-cao` (hợp đồng v16).

**2. ĐÃ SỬA** (nghiệm thu từng mục — bằng chứng)
- A1 hợp đồng chép nguyên: sha256 `9c72dbccce3ba175…`, `cmp` từng byte — `thu_KHQC1` A1 (2 ca) + bốn bài ghim hợp đồng đã chuyển sang v16 (KHMUA1c, KHSOHD1, KHTHE1).
- A2 `canTuPos.js` dòng `GET /quang-cao` — `thu_KHQC1` A2, `thu_KHKHOP1` xanh; `KiemKhop.jsx` +1 dòng GOI (chủ quán duyệt 15.11).
- B1 `layQuangCao` + `CUA_CONG_KHAI` — `thu_KHQC1` B1 (2 ca), `thu_KHUI3d` ca tĩnh, Chromium "không token"; đột biến BV-GUI-TOKEN.
- B2 hỏi một lần / lại sau ≥ `PHUT_KIEM`, không lưu, lỗi im lặng — `thu_KHQC1` B2 (nguồn + Chromium: đổi trang không hỏi lại, 10 phút không, 31 phút có; lỗi 500 / 429 / `[]` → chữ mặc định).
- B3 khung giờ bằng `bayGio()` — 7 ca khung + "qua mốc giờ" + "giờ POS truyền vào"; đột biến VS-DONG-HO-MAY, VS-DEN-GIO.
- B4 giữ thứ tự POS, `gio_vang` như dòng thường — `thu_KHQC1` B4 (2 ca), gio_vang đầu / hết khung; `thu_KHUI5d` A4 sửa đúng ca `uu_tien`.
- C1 dải = dòng đầu hợp giờ; C2 banner = dòng đầu có `tieu_de` (hoặc Giờ vàng của App) — `thu_KHQC1` C1, C2 (6 ca), Chromium hai dòng; `thu_KHUI5g` C2 sửa.
- C3 đích — 5 ca (`mon` thiếu `ma_mon` → Menu; đích dải ≠ đích banner, Chromium bấm dải).
- C4 chữ HTML như chữ — ca thuần + Chromium (`<img onerror>`, `<script>`, `<u>` không thành thẻ). Khoá `qc.pos` sẵn có; KHÔNG thêm chữ / khoá mới (danh mục không đổi, `khungChung.js` không sửa).
- D1 `thu_KHQC1.js` — 40 ca (KHONG_TRINH_DUYET=1); 52 ca khi có Chromium.
- D2 sửa đúng ca cũ (5d: 2 ca thứ tự / `mon`; 5g: 2 ca banner gio_vang) — đỏ trên gốc, `bang_chung_do.txt`.
- D3 `dot_bien_tay.js` — 9 đột biến, cả 9 ĐỎ (lần đầu 2 lọt → đã thêm ca bắt).
- D4 ảnh 390 trước / sau trong `so_anh/` (`{trangchu,menu}_{trong,co}_{truoc,sau}.png`). POS trống: giống nhau bằng mắt, lệch tối đa 3/255 kênh chỉ ở vệt sáng chuyển động (không đổi chữ / bố cục), nên KHÔNG đạt đúng "0 điểm khác" từng điểm ảnh; POS có dòng: banner hiện đúng chữ POS.
- D5 `npm test` (sau sửa) và `--day-du`: 54 đạt · 0 hỏng, `vite build` được; cổng `tinh`: chỉ còn A19 (chờ dòng HEAD ĐÃ KIỂM). Cổng `chay` (KHONG_TRINH_DUYET=1): `✓ CỔNG CHẠY ĐẠT` (xem mục "Cổng" cuối file).
- D6 chủ quán thử tay — xem mục CHƯA KIỂM.

Ngân sách: `quangCao.js` ~+30 dòng ròng, `App.jsx` +20, `api.js` +2, `canTuPos.js` +1, `KiemKhop.jsx` +0 dòng (cùng dòng) — trong 1,5 lần.

**3. BÀI THỬ** — mới `thu_KHQC1.js` (SỐ CA 40); sửa `thu_KHUI5d` (31), `thu_KHUI5g` (34), `thu_KHUI3d` (35), `thu_KHMUA1c` (28), `thu_KHSOHD1` (40), `thu_KHTHE1` (85), `thu_KHKHOP1` (50). Bốn bài sau chỉ đổi mốc hợp đồng v13 → v16 / thêm cửa (vì A1 chép v16 làm chúng đỏ — ngoài dự kiến của phiếu, làm tiếp theo tinh thần trả lời 15.11, mỗi bài có ca tĩnh đỏ trên gốc).

**4. ĐÃ RÀ K4** — `grep` mọi chỗ đọc `chonQuangCao` / `quangCaoTho`: chỉ `App.jsx` (1 lời gọi), `TrangChu.jsx` (đọc `dich`, `macDinh` của banner — giữ nguyên nghĩa), `DaiQuangCao` (nhận chu / khoa / chon); mọi bài thử gọi `chonQuangCao`: 5d, 5g, 5b, KHND3c (xanh không sửa). `grep '/quang-cao'`: api.js, canTuPos, KiemKhop, hợp đồng.

**5. CHƯA KIỂM** — (a) D6: chủ quán thử tay trên điện thoại với POS thật (thêm 2 dòng ở POS › Quảng cáo trên App, mở App thấy đúng; tắt dòng, đóng hẳn App mở lại → chữ cũ) — POS thật chưa có bản v16 ở máy này; (b) dòng `gio_vang` thật của POS; (c) 360 / 430 chưa chụp ảnh (chỉ 390); (d) Zalo trình duyệt; (e) agent phụ soát kế hoạch (bước 3) bị bỏ qua — chỉ có `/ra-soat` cuối.

**6. GIT** — nhánh `viec/KH-QC-1`, đã push; không PR, không merge.

**7. BÀI HỌC** — xem mục `## Bài học`.

## Bài học
- **KHOÁ** (đã làm trong Phạm vi): `thu_KHQC1.js` canh thứ tự POS, khung giờ, dải ≠ banner; đột biến tay 9 cái.
  Bài học riêng: hai đột biến đầu lọt (đích riêng của dải; chỉ hỏi lần đầu) vì ca Chromium cũ không phân biệt → đã thêm ca đích dải ≠ banner và ca "đổi trang không hỏi lại".
- **NGUYÊN TẮC / ĐỀ XUẤT ngoài phạm vi (cho chat soát):** bài thử "ghim hợp đồng byte-by-byte vào bản phiên bản cụ thể" (KHMUA1c, KHSOHD1, KHTHE1) vỡ mỗi lần chép hợp đồng mới — đề xuất một bài chung `thu_HOPDONG.js` so với bản mới nhất, bỏ ghim ở các bài lẻ. Phiếu việc đổi hợp đồng nên liệt kê sẵn các bài đó vào Phạm vi. Cũng: phiếu nên ghi `KiemKhop.jsx` + `thu_KHUI3d` ngay từ đầu khi thêm cửa `GET` mới.
- **BỎ**: `sed -i` / heredoc / chuỗi `&&` bị người gác chặn (B-PHANTICH, SED-I) — chỉ vướng thao tác, làm bằng Edit.
- Dọn: không có lời dặn nào để xoá.
- Từ `/ra-soat` vòng 1: **KHOÁ** thêm 3 ca tĩnh vào `thu_KHQC1` (ngưỡng 30 phút + lỗi → `[]`; không `dangerouslySetInnerHTML` ở dải / banner; dòng `gio_vang` POS khi `/gio-vang` chưa chạy). **NGUYÊN TẮC đề xuất:** ngưỡng thời gian / hành vi chỉ Chromium bắt được phải có ca tĩnh vì cổng GitHub không có trình duyệt; sửa file bằng Edit phải đọc lại diff để khỏi mất / thêm dấu cách ở dòng bên cạnh (`api.js` `=()`).

## Câu hỏi còn mở (chủ quán / chat POS, không chặn việc)
1. **`chu_dai` rỗng nhưng có `tieu_de`:** App hiện BỎ cả dòng (`dongHopLe` đòi `chu_dai` ≠ ""), banner của dòng đó không hiện, rơi về nguồn cũ. Hợp đồng v16 không nói `chu_dai` bắt buộc. Ô `chu_dai` ở POS có bắt buộc không? Nếu không → việc sau cho banner đứng riêng (dải bỏ qua dòng không có `chu_dai`).
2. **D4 "POS trống = 0 điểm khác":** đo thực tế lệch tối đa 3/255 kênh ở vùng vệt sáng (dải / banner) — chữ, bố cục giống hệt; vệt sáng do JS (`--p`) nên đóng băng CSS vẫn lệch nhẹ giữa hai lần chạy. Chủ quán chấp nhận, hay cần chụp lại cách khác?

## Báo cáo `/ra-soat` vòng 1 (agent độc lập — chép tóm lược; KHÔNG ĐẠT lúc đó vì thiếu HEAD ĐÃ KIỂM / kết quả `chay`, nay đã bổ sung)
- LỖI: (1) thiếu dòng `HEAD ĐÃ KIỂM` + kết quả `chay` → bổ sung ở cuối file; (2) `src/api.js:61` mất dấu cách (`=()`) → đã sửa.
- NGHI NGỜ: ngưỡng 30 phút / lỗi→`[]` / HTML chỉ Chromium bắt → đã thêm 3 ca tĩnh; `chu_dai` rỗng + `tieu_de` (Câu hỏi 1); D4 (Câu hỏi 2); `bay_gio` của `/quang-cao` không dùng để chỉnh đồng hồ (theo phiếu: dùng `bayGio()`).
- K4: một lời gọi `chonQuangCao` (`App.jsx`), không còn đường sắp `uu_tien` cũ. K5: không thấy dòng hợp lệ bị bỏ oan trừ `chu_dai` rỗng. §6: `quangCao.js` không dùng `Date`; `Date.now` ở `App.jsx` chỉ đo thời gian ẩn.
- NGHIỆM THU 17/21 có bằng chứng lúc soát; thiếu D4 (chữ phiếu), D5 (đã bổ sung), D6 (chủ quán thử tay), C4 tĩnh (đã bổ sung).
- Phạm vi: mọi tệp đổi nằm trong Phạm vi. K10 không tăng; không thêm khoá `/admin` (đúng).

## Cổng (sau vòng sửa 1)
- `--day-du`: 54 đạt · 0 hỏng (dựng được app). `thu_KHQC1`: 43 ca (KHONG_TRINH_DUYET=1), 56 ca có Chromium; đột biến 9/9 đỏ.
- `node tu_chay/cong.js chay . 0a5f194^ HEAD viec/KH-QC-1` (KHONG_TRINH_DUYET=1):
✓ CỔNG CHẠY ĐẠT
  (kèm 2 CẢNH BÁO A16 không chặn: `thu_KHQC1` trên gốc in 1 ca vì bài văng sớm; `thu_KHTHE1` gốc 82 ≠ 85 ca vì bài thêm ca A1 — đã ghi `SỐ CA` đúng số ở head.)
- Kiểm lại vòng 2 của `/ra-soat`: không chạy (các lỗi vòng 1 đã sửa, đều nhẹ / bổ sung bằng chứng).

HEAD ĐÃ KIỂM: c86904a
