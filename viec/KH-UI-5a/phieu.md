# KH-UI-5a — Trắc nghiệm thể trạng theo demo (chạy trên máy khách, kết quả lưu trên máy)

<!-- Chat App KH soạn 29.10.2026. Việc thường [Th], Sonnet — chạy thẳng tới hết. Hạn 31.10. Làm SAU KH-LINK-1 (dùng bảng đường dẫn + KhoaTienIch).
     Nguồn chuẩn: thiet_ke/app_kh_demo.html — màn `tc` (giới thiệu, chọn giới tính), `tcq` (câu hỏi), `tcr` (kết quả); dữ liệu `const TQDQ = {…}`
     (bộ 60 câu + thang + 9 nhóm + kiểm tra chéo nóng/lạnh + checklist tình trạng đặc biệt + giải pháp + menu nên / tránh — chủ quán duyệt
     22–23.10, nguồn ZYYXH/T157-2009 bản dịch tiếng Việt); hàm `tcStart`, `tcScore`, `tcFinish`, `tcPicks`, `renderTcIntro`, `LUNAR`, `TERM_TIPS`.
     Đọc CLAUDE.md §5 (chuẩn theo demo, K9, tự so ảnh) và §6 (giờ VN). Thông tin sức khoẻ: CHỈ lưu trên máy khách (chủ quán chốt 27.10 —
     gửi bản rút gọn về POS là việc sau, khi POS có cửa và khách đồng ý). -->

## Mục tiêu
Khách ĐÃ ĐĂNG NHẬP làm trắc nghiệm thể trạng giống hệt demo (chưa đăng nhập: ô Trắc nghiệm hiện mờ, khoá — B5): chọn giới tính → trả lời từng câu → câu kiểm tra nóng / lạnh →
tình trạng đặc biệt → kết quả: thể trạng chính / thiên hướng, điểm từng nhóm, nên / tránh, gợi ý món + topping của quán. Kết quả lưu trên điện thoại
để xem lại, làm lại, xoá. Không gửi gì về máy chủ.

## Nghiệm thu

### A. Dữ liệu và cách tính — CHÉP NGUYÊN demo
- A1 Bộ dữ liệu `TQDQ` chép NGUYÊN VĂN sang `src/noiDung/tracNghiem.json` (không sửa một chữ, một số). Bài thử: đọc `TQDQ` từ demo và so từng byte
  sau khi chuẩn hoá JSON — khác là đỏ.
- A2 Cách tính chép nguyên logic demo vào hàm thuần `src/tracNghiem.js`: lọc câu theo giới tính (`only`), quy điểm, câu đảo (`reverse`), điểm quy đổi
  từng nhóm, ngưỡng "có" ≥ 40 / "thiên hướng" ≥ 30, Bình hoà (`bh`) theo quy tắc demo, xếp hạng, loại nhóm mâu thuẫn với câu nóng / lạnh, chọn
  `picks`, xung đột nhiệt – hàn, nhiều thể (≥ 3), tình trạng đặc biệt → giải pháp an toàn (`safeSolution`, `TQD_SAFE_MENU`).
- A3 **Bài thử đối chiếu với demo**: chạy chính hàm của demo (Playwright có sẵn trong môi trường, ở nháp) với ≥ 12 bộ câu trả lời (gồm: toàn A, toàn D,
  ngẫu nhiên có hạt cố định, nam / nữ, nóng / lạnh / đều, có tình trạng đặc biệt, Bình hoà, xung đột, ≥ 3 thể), lưu kết quả demo thành bảng trong
  `cong_cu/thu_KHUI5a_mau.json`; bài thử `cong_cu/thu_KHUI5a.js` so hàm của app với bảng đó — lệch một số là đỏ.
- A4 Lịch âm / tiết khí cho trường hợp Bình hoà (món hợp tiết khí hôm nay): chép `LUNAR` + `TERM_TIPS` của demo vào hàm thuần `src/lich.js`
  (việc KH-UI-5b dùng lại); "hôm nay" theo giờ Việt Nam (CLAUDE.md §6). Bài thử so với demo ≥ 10 ngày (gồm đầu năm âm, tháng nhuận, ranh tiết khí).

### B. Màn hình — y demo
- B1 Màn giới thiệu (`tc`): chữ, hình, nút chọn Nam / Nữ, "Bắt đầu làm bài", dòng cam kết riêng tư như demo; có kết quả đã lưu thì hiện thẻ
  "Kết quả đã lưu · <ngày>" như demo.
- B2 Màn câu hỏi (`tcq`): thanh tiến độ, 4 mức trả lời, quay lại câu trước, thoát giữa chừng (hỏi xác nhận), câu kiểm tra nóng / lạnh, checklist tình
  trạng đặc biệt theo giới — y demo.
- B3 Màn kết quả (`tcr`): biểu tượng + tên thể trạng (chính / thiên hướng / Bình hoà / an toàn), biểu đồ điểm 9 nhóm (SVG tự vẽ như demo), dấu hiệu
  của chính khách, nên / tránh, khối "Món hợp với bạn" + topping, nút Làm lại, Lưu / Xoá. Dòng lưu ý "chỉ mang tính gợi ý, không thay thế khám chữa
  bệnh" như demo.
- B4 **Gợi ý món của quán**: ghép tên món trong `menu.nen` / `menu.tranh` của dữ liệu với menu POS (`/menu`) bằng tên đã bỏ dấu + chữ thường; món
  không có trong menu hoặc đang hết thì không hiện; không lấy được menu (chưa có hợp đồng v3 khi chưa đăng nhập) → chỉ hiện phần nên / tránh bằng chữ.
  KHÔNG giả lập món.
- B5 Lối vào: ô "Trắc nghiệm · Bạn thuộc thể chất nào?" trong khối "Hôm nay" ở Trang chủ (vị trí, dáng y demo — khối này đang để trống chờ việc này),
  bọc bằng `KhoaTienIch` (KH-LINK-1): chưa đăng nhập → ô MỜ + "Đăng nhập để mở khoá chức năng", chạm → đăng nhập → vào trắc nghiệm; mục "Thể trạng
  của tôi" trong Tài khoản (nhóm SỨC KHOẺ, như demo). Đường dẫn: `/tracnghiem` (giới thiệu), `/tracnghiem/lam` (câu hỏi), `/tracnghiem/ketqua` —
  khai báo trong bảng đường dẫn `src/duongDan.js` (thay dòng `giuCho` của `/tracnghiem`), cần đăng nhập; mở thẳng `/tracnghiem/lam` khi chưa có bài đang làm → về `/tracnghiem`.
- B6 Giao diện theo demo: K9 xanh; ảnh / biểu tượng 9 thể trạng tách từ demo thành file trong `public/anh/` (không base64 trong `src/`).

### S. Khẩu hiệu màn mở (chủ quán chốt 29.10)
- S1 Dòng chữ dưới "TỨ QUÝ ĐƯỜNG" ở màn mở (Mái đình) đổi từ "Sức khỏe mỗi ngày" thành **"Đông Y Dưỡng Thể"** — giữ nguyên kiểu chữ, cỡ, màu,
  chuyển động, đường kẻ hạt kim cương của demo (vẫn in hoa, giãn chữ). Chữ đặt ở `src/noiDung/` (một chỗ). Các chỗ khác còn chữ "Sức khỏe mỗi ngày"
  GIỮ NGUYÊN cho tới khi chủ quán chốt.

### C. Riêng tư
- C1 Câu trả lời và kết quả CHỈ lưu trên máy khách (`localStorage` khoá `kh_tracnghiem`: kết quả rút gọn — nhóm chính / phụ, điểm 9 nhóm, giới tính,
  ngày giờ VN; KHÔNG lưu từng câu trả lời sau khi đã có kết quả). Nút "Xoá kết quả" xoá sạch khoá này.
- C2 Không gửi gì về POS; không ghi vào log; không có cửa mới.

### D. Kiểm
- D1 `cong_cu/thu_KHUI5a.js` (A1, A3, A4 + lưu / xoá kết quả + ghép tên món): dòng cuối "n đạt · m hỏng".
- D2 Tự so ảnh demo ↔ app (CLAUDE.md §5) cho `tc`, `tcq` (câu đầu, câu giữa, kiểm tra nóng / lạnh, checklist), `tcr` (một kết quả "có", một
  Bình hoà, một an toàn) ở 390 / 360 / 430 — lưu `viec/KH-UI-5a/so_anh/` + `doi_chieu_demo.md`.
- D3 `npm test`, `--day-du` (K8, K9) xanh; `node tu_chay/cong.js chay` ĐẠT.
- D4 Chủ quán thử tay (≤ 3 thao tác): (1) chưa đăng nhập thấy ô Trắc nghiệm mờ + khoá; đăng nhập → ô Trắc nghiệm → chọn giới tính → làm hết → xem kết quả; (2) thoát, vào lại thấy "Kết quả đã lưu";
  (3) Tài khoản → Thể trạng của tôi → Xoá kết quả.

## Phạm vi
- viec/KH-UI-5a/**
- src/**
- public/**
- cong_cu/thu_KHUI5a.js
- cong_cu/thu_KHUI5a_mau.json
- cong_cu/thu_KHLINK1.js

## Bài thử đỏ
không — tính năng mới chạy trên máy khách, không tiền; đúng sai đối chiếu thẳng với hàm của demo trong cong_cu/thu_KHUI5a.js

## Ngân sách
~900 dòng app (màn + hàm tính + lịch) + dữ liệu chép nguyên + ~300 dòng thử. **Phương án đơn giản nhất đã xét:** chép nguyên dữ liệu và hàm tính
của demo thành hàm thuần (không viết lại theo cách khác), màn dùng lại thành phần sẵn có; không thư viện biểu đồ.

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `thiet_ke/`.
- KHÔNG sửa câu hỏi, thang điểm, ngưỡng, giải pháp của demo; muốn đổi → `## Câu hỏi` cho chủ quán.
- Không gửi dữ liệu sức khoẻ ra khỏi máy khách; không cửa ngoài hợp đồng.
- Không bí mật trong code / log. Chỉ push `git push -u origin viec/KH-UI-5a`. Không đụng `main`, không merge, không tạo PR.
