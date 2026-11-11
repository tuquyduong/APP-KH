# KH-UI-5g — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-UI-5g`; cây sạch; `git fetch origin viec/KH-UI-5g`: HEAD = FETCH_HEAD = `306dff3` (không kéo gì). Hook mở phiên: "đã có đủ commit của origin", "cai_thu_vien: npm ci xong".
- `git log --oneline -3` lúc mở:
  - `306dff3 PHIEU: KH-UI-5g`
  - `042e8af TIEN-DO: KH-ND-3a xong (chat soat cuoi DAT, gop PR); mo KH-UI-5g …`
  - `cc84fff Merge pull request #30 from tuquyduong/viec/KH-ND-3a`
- Giữa phiên không có thông báo đổi model.
- Stop hook đòi commit + push file chưa theo dõi: đã commit từng file và push nhánh việc (không `--amend`, không `rebase`, không `git config`).

## Câu hỏi
(không có)

## Phát hiện (ngoài phạm vi, không sửa)
- `src/App.jsx`: phiếu chỉ cho "tính `chonQuangCao` một lần + truyền xuống", nhưng banner Trang chủ cần dữ liệu `/chuong-trinh` mà trước đây App chỉ hỏi ở trang có dải. Đã mở rộng đúng MỘT điều kiện của effect hỏi sẵn có (`coDai(trang) || trang === 'trangchu'`) — vẫn một lần mỗi lần mở App, cùng cửa `layChuongTrinh`, không cửa mới. Nếu chủ quán muốn khác, báo.
- `src/giaoDien/giaoDien.css` còn luật `.hb-one .hero-banner{ min-height:10.5rem }` (cấm sửa; `thu_KHUI2.js` F2 còn kiểm luật này) — nay không còn phần tử `.hero-banner` ở Trang chủ → luật thừa vô hại; dọn ở việc sau cùng bài F2.
- `public/anh/banner-trang-chu.webp` vẫn dùng làm ảnh nền `today.bg`; khoá ảnh `home.banner` đã bỏ nên /admin sau này chỉ sửa ảnh ở `today.bg`.
- Lời chào gọi chữ cuối cũng áp ở bản xem trước lời chào trong Hồ sơ (`HoSo.jsx` dùng `chiaLoiChao`; không sửa file, đúng ý D1).
- Dải ở 390 px cắt chữ Giờ vàng thành "đến …" (đúng phiếu B1: dài thì cắt "…").
- Kế hoạch (bước 3) chưa nhờ agent phụ soát riêng (đã có `/ra-soat` bản code): ghi ở CHƯA KIỂM.
- `dist/`, `.nhap_thu/` do bài thử dựng — không commit.

## Chỗ vá → bài thử → đột biến
Việc chỉ đổi `src/` (không `server/`, `client/src/`) → không có `dot_bien.py` (cổng A17/A18 không áp). Đột biến DỰ KIẾN (chưa chạy từng cái; ca bắt được là ca của `thu_KHUI5g.js` nêu ở cột giữa, đã thấy đỏ trên bản gốc ở `bang_chung_do.txt`):
| Chỗ vá | Bài thử | Đột biến (tay) |
|---|---|---|
| `loiChao` chữ cuối | D1 (4 ca) + 4 bài cũ sửa | xung → `day` đủ tên: ca "anh Linh" đỏ (thấy ở bản gốc) |
| `chonQuangCao` trả `macDinh` | C2.4, E1 "không có gì" | trả null như gốc: C2.4 đỏ |
| `tachBieuTuong` | B1 (5 ca) + Chromium "biểu tượng NGOÀI gl-t" | bỏ tách: chữ dải còn emoji → ca đỏ |
| hook đo một chỗ | A1 "chỉ MỘT chỗ đặt --ox" | chép lại đoạn đo vào `BannerHomNay`: ca đếm `'--ox'` = 2 đỏ |
| Trang chủ luôn banner | C1 + Chromium 3 trạng thái | khôi phục `hero-banner`: ca đỏ |
Ghi chú: bảng này là mô tả; đột biến chưa chạy từng cái bằng script riêng (CHƯA KIỂM bên dưới).

## Kết quả kiểm
- `thu_KHUI5g.js` có trình duyệt: 53 đạt · 0 hỏng; `KHONG_TRINH_DUYET=1`: 30 đạt (đúng `SỐ CA`).
- 7 bài cũ sửa (E2): xanh cả bản có trình duyệt (KHSINH1 92 · KHUI3b 174 · KHUI3d 174 · KHNHANH1 227 · KHUI5d 84; KHND3a, KHUI5b khi chạy `npm test` đầy đủ).
- `KHONG_TRINH_DUYET=1 node kiem_tra_truoc_khi_giao.js --day-du`: 47 đạt · 0 hỏng (kèm dựng app). Bản `--day-du` CÓ trình duyệt quá hạn 10 phút của máy nên không chạy trọn một lần — từng bài trình duyệt đã chạy riêng.
- K10: nợ chữ cứng 766 → 764 (`ha_no_chu.js`).
- Cổng `tinh`: chỉ còn A19 (chờ dòng HEAD ĐÃ KIỂM).
- Ảnh E3: `so_anh/` (27 ảnh); khác demo (banner, tắt chuyển động): 360 px 27,2% · 390 px 24,2% · 430 px 9,6% — phần lệch là ảnh nền thật `.today.photo` + chữ khác (xem `doi_chieu_demo.md`).

## Đếm nghiệm thu
- A1 hook chung, một chỗ `--ox`: `thu_KHUI5g` "A1 …" (3 ca) + Chromium `--ox` mọi `.gl`, `.gl-a` rộng bằng dải.
- A2 giữ reduced-motion + CSS demo không sửa: ca "A2 …" (đọc nguồn) + Chromium `animation-name none`.
- B1 cấu trúc dải + `tachBieuTuong`: B1 (5 ca hàm thuần, 1 ca nguồn, 3 ca Chromium).
- B2 giao diện dải: 2 ca đọc CSS + K9 (`npm test` K9 xanh) + ca Chromium cao 40.
- B3 dải chỉ ở trang cũ, ẩn khi dẫn chính trang, bấm đúng đích: `thu_KHUI5d` A2/A5 + "bấm dải → Menu".
- C1 banner luôn có, bỏ hero-banner + 4 khoá: ca nguồn C1 ×2 + Chromium 6 ca (3 trạng thái × chưa/đã đăng nhập).
- C2 chữ chung, một lần ở App, khoá `qc.*`, `qc.pos` khoá POS: 8 ca C2.* + ca nguồn App/khungChung + bấm banner đúng đích.
- C3 đổi theo giờ: dùng chung `chonQuangCao` tính lại mỗi lần vẽ (ca thứ tự "Giờ vàng đã hết khung → chương trình").
- D1 lời chào: 4 ca hàm thuần + Chromium "anh Linh".
- E1 bài mới: có, 30 ca không trình duyệt / 53 đủ. E2 bài cũ sửa: 7 bài, mỗi bài ≥ 1 ca đỏ trên gốc (`bang_chung_do.txt`). E3 ảnh + `doi_chieu_demo.md`: có. E4 K10 + `npm test` + `--day-du` + cổng: xem trên. E5 thử tay: xem CHƯA KIỂM.

## Báo cáo 7 mục
1. VIỆC: KH-UI-5g — ánh sáng lướt như demo: dải quảng cáo các trang (kiểu A) + banner "Hôm nay" Trang chủ luôn chạy; lời chào gọi theo tên.
2. ĐÃ SỬA: hook `anhSangLuot.js` (một bộ đo); `DaiQuangCao` (gl-a / gl-t / gl-b, biểu tượng riêng) + `dai_quang_cao.css` (giá trị demo); `BannerHomNay` nhận `qc`; `quangCao.js` (`tachBieuTuong`, `chonQuangCao` trả tiêu đề / phụ / nút / `macDinh`); `App.jsx` tính một lần + hỏi `/chuong-trinh` cả ở Trang chủ; `TrangChu.jsx` bỏ `hero-banner`; `dinhDang.js` chữ cuối; danh mục `khungChung.js` (+8 khoá `qc.*`), `trangChu.js` (bỏ `home.banner/bk/bh/bb`, `today.t/cta` có chữ mặc định); K10 766 → 764.
3. BÀI THỬ: `thu_KHUI5g.js` (mới) + sửa 7 bài cũ; số liệu ở "Kết quả kiểm".
4. ĐÃ RÀ K4: `grep` mọi nơi đo `--ox` (còn 1), `home.b*`, `hero-banner`, `chonQuangCao(` (1 lời gọi), mọi chỗ có chữ lời chào "Nguyễn Linh" trong bài thử (đã sửa hết các bài có trình duyệt).
5. CHƯA KIỂM: E5 thử tay trên điện thoại thật; trình duyệt Zalo; đột biến từng cái chạy tay bằng script; kế hoạch chưa nhờ agent phụ soát riêng; `--day-du` có trình duyệt trọn một lần (quá 10 phút).
6. GIT: nhánh `viec/KH-UI-5g`, các commit `KH-UI-5g: …` (từng file `git add`), đã push; không PR, không merge.
7. BÀI HỌC: xem `## Bài học`.

## Bài học
- NGUYÊN TẮC / KHOÁ (đề xuất, ngoài Phạm vi): khi đổi hành vi dùng chung (vd lời chào), `grep` mọi bài thử có phần Chromium trước khi báo xong — chạy `KHONG_TRINH_DUYET=1` che mất ~40 ca đỏ trong 5 bài cũ (phát hiện nhờ `npm test` đầy đủ). Ghi vào K-mới nếu tái diễn.
- BỎ: người gác chặn `sed -i`, `npx`, lệnh ghép `python3 <<EOF` + `node` — một lần, làm lại bằng Edit / lệnh đứng một mình.
- BỎ: `--day-du` có trình duyệt vượt 10 phút của máy — tách từng bài.

✓ CỔNG CHẠY ĐẠT (KHONG_TRINH_DUYET=1, node tu_chay/cong.js chay . 306dff3^ HEAD viec/KH-UI-5g)
HEAD ĐÃ KIỂM: 2baacba
