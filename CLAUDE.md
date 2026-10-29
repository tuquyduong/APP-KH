# App KH Tứ Quý Đường — luật làm việc

App khách hàng (PWA) của Tứ Quý Đường, chạy ở `tuquyduong.com`. Khách dùng chủ yếu trên điện thoại, đôi khi máy tính bảng / máy tính.
App **không giữ tiền, điểm, ví, giá, khách, đơn** — tất cả ở POS (kho `pos-tuquyduong/pos-tuquyduong`, máy `pos-tuquyduong.io.vn`).
App chỉ đọc / gửi yêu cầu qua cổng `/api/kh` của POS. Mỗi lỗi ở đây là khách thật nhìn thấy, hoặc khách thấy dữ liệu người khác.

Luật chung của chủ quán (7 tiêu chí, ai giữ dữ liệu gì, bảo mật, tiền, rà lỗi) ở `LUAT_XAY_APP.md`. Máy KHÔNG sửa file đó.

@LUAT_XAY_APP.md

@KHUON_LOI.md

---

## 1. Luật số 0 — đọc code thật, không tin hồ sơ
Mọi khẳng định về hành vi phải kèm file + số dòng vừa đọc, hoặc lệnh `grep` chạy được. Không có thì nói "chưa đọc".
Hồ sơ phía POS (tên trường `/api/kh`) lấy từ `thiet_ke/HOP_DONG_API_KH.md` (bản chép của hợp đồng ở kho POS) — trường chưa ghi ở đó thì KHÔNG
đoán: ghi `## Câu hỏi`. Quyết định của chủ quán: `QUYET_DINH_CHU_QUAN.md` ở kho POS (chat App KH chép ý vào phiếu) — lệch thì sổ đó thắng.
Giấy tờ trao đổi giữa hai chat: `thiet_ke/trao_doi/` (chỉ để tra, không phải lệnh).

## 2. Kho này khác kho POS thế nào (bộ khung tu-chay chép nguyên từ POS 1.8.0)
- Code chạy ở `src/` (React + Vite, ESM — `src/package.json` đặt `"type": "module"`). KHÔNG có `server/`, `client/`.
  Chỗ nào trong `tu_chay/` / `/lam-viec` / `/ra-soat` nói `server/`, `client/src/`, `client/dist`, "quầy POS" → hiểu là `src/` của App KH.
- `tu_chay/cau_hinh.json`: `file_luat` giữ nguyên các mục của POS (`ban_mau_pos/…`, `cong_cu/thu_P2x.js`, `gia_lap`) — file không có ở kho này,
  mục thừa vô hại; thêm `LUAT_XAY_APP.md`, `src/package.json`. `tep_bash_them` để TRỐNG: người gác đòi mỗi tệp trong đó phải có thật — để tên tệp
  của POS là người gác chặn MỌI lệnh (lỗi NG-CAUHINH, gặp 28.10). Vài ca tự thử của khung gắn với POS (tep_bash_them, keep-alive.yml, tài liệu
  POS) sẽ đỏ ở kho này — không chạy ở đây, gỡ khi đóng gói khung chung.
- KHÔNG commit `dist/` (Cloudflare tự dựng `npm run build`). Đổi `src/` thì chạy `node kiem_tra_truoc_khi_giao.js --day-du` (có dựng thử).
- Sổ việc: `TIEN_DO_APPKH.json` — máy không ghi; chủ quán ghi bằng script chat soạn.
- Đổi gì ở POS (cổng `/api/kh`, bảng dữ liệu, giá, điểm) → KHÔNG làm ở đây: ghi `## Câu hỏi` / `## Phát hiện`, chủ quán chuyển chat POS.

## 3. Lệnh
```bash
npm ci                                     # cài thư viện (đúng lockfile)
npm run dev                                # chạy thử ở máy (cổng 5174)
npm test                                   # bộ kiểm tĩnh + mọi cong_cu/thu_*.js
node kiem_tra_truoc_khi_giao.js --day-du   # thêm: dựng app + kiểm dist/
node tu_chay/cong.js chay . <base> <head> <nhánh>   # cổng như GitHub chạy
```

## 4. Bố trí code
| Chỗ | Việc |
|---|---|
| `src/api.js` | CHỖ DUY NHẤT gọi mạng (chỉ `/api/kh/*` của POS), gắn token khách, bắt `{ error, code }` |
| `src/pages/` | mỗi màn một file |
| `src/components/` | phần dùng lại |
| `src/giaoDien/` | màu, chữ, khoảng cách, cỡ màn hình dùng chung — đổi giao diện chỉ sửa ở đây |
| `src/dinhDang.js` | hàm thuần (giá, ngày, lời lỗi) — bài thử nạp thẳng |
| `cong_cu/thu_*.js` | bài thử, in dòng cuối "n đạt · m hỏng" |
| `thiet_ke/` | demo + đặc tả + hợp đồng `/api/kh` — tài liệu, không phải code chạy |

## 5. Giao diện — CHUẨN THEO DEMO (chủ quán chốt 27–29.10.2026)
- `thiet_ke/app_kh_demo.html` (patch39) là BẢN CHUẨN cho điện thoại. Màu, phông, cỡ chữ, độ đậm, khoảng cách, bo góc, bóng, biểu tượng,
  chữ trên màn, thứ tự khối, chuyển động, âm thanh, biểu tượng SVG, ảnh, hoạ tiết nền: CHÉP NGUYÊN từ CSS / HTML / JS của demo — không ước lượng, không "gần giống".
  Bộ kiểm K9 chặn mọi màu / phông không có trong demo.
- Chỉ được khác demo vì 4 lý do: (a) dữ liệu POS chưa có, hoặc khối thuộc VIỆC SAU đã ghi trong sổ (`TIEN_DO_APPKH.json`) → để trống chỗ,
  ghi rõ việc nào; (b) chữ / số mẫu của demo không dùng (số liệu, hotline 1900 xxxx,
  support@…; giao hàng là Ahamove, không GHN); (c) chưa có giỏ hàng / đặt đơn; (d) màn rộng ≥ 1024 px theo MẪU MÀN TO chủ quán đã duyệt
  (`thiet_ke/mau_man_to/` — khi có). Khác vì lý do nào khác → `## Câu hỏi`, không tự quyết.
- Mọi việc giao diện PHẢI: (1) tự so ảnh demo ↔ app bằng Chromium + Playwright CÓ SẴN trong môi trường (không thêm vào `package.json`;
  công cụ so ảnh và API giả để ở nháp), cùng cỡ 390×844 (thêm 360 và 430), cùng dữ liệu mẫu như demo; sửa tới khi chỉ còn khác vì (a)–(d);
  (2) lưu cặp ảnh + ảnh tô chỗ lệch vào `viec/<MÃ>/so_anh/`; (3) lập `viec/<MÃ>/doi_chieu_demo.md` — mỗi màn một bảng: khối trong demo /
  đã làm / khác gì, lý do (a)–(d). Chat App KH so ảnh lại lần cuối trước khi gộp.
- Khách CHƯA đăng nhập vẫn vào thẳng Trang chủ sau màn mở, LÚC NÀO cũng xem được Trang chủ, Menu, giá, Trang món (chủ quán chốt 29.10). Đăng nhập / đăng ký chỉ
  hiện khi khách cần: Ưu đãi, Tài khoản, mã thành viên, nhận điểm — xong quay về đúng chỗ đang định vào.
- Đăng nhập = mã gửi qua ZALO (POS gửi; POS chưa bật Zalo thì báo lấy mã ở quầy — app làm theo câu trả lời của POS, không ghi cứng).
  Đăng ký 3 bước: SĐT → mã → (khách mới) màn "Thông tin của bạn": Tên + Cách xưng hô BẮT BUỘC, Địa chỉ nhận hàng KHÔNG bắt buộc (dùng làm
  địa chỉ giao mặc định; đặt online lần đầu mà chưa có thì bắt nhập và lưu làm mặc định, có ghi chú cho khách).
  App nhớ đăng nhập 30 ngày và TỰ GIA HẠN mỗi lần khách mở app (khi POS có cửa gia hạn) — dùng thường xuyên thì không phải đăng nhập lại.
- **Trang chủ khi chưa đăng nhập hiện ĐẦY ĐỦ** như khi đã đăng nhập (trừ phần riêng của khách). Tiện ích cần tài khoản (Trắc nghiệm thể trạng, Kế hoạch
  và nhắc việc…) hiện MỜ kèm "Đăng nhập để mở khoá chức năng" — dùng `src/components/KhoaTienIch.jsx` (chủ quán chốt 29.10).
- **Đường dẫn thật cho mọi trang** (chủ quán chốt 29.10): tuquyduong.com/trangchu, /menu, /mon/<tên-món>, /uudai, /taikhoan, /mathanhvien, /dangnhap…
  — khai báo ở MỘT chỗ `src/duongDan.js`; màn mới phải thêm đường dẫn vào bảng đó; mở thẳng, tải lại, Back / Tiến đều đúng.
- **Không có mục quản trị trong app khách.** Khu quản trị (chế độ sửa nội dung…) ở `/admin`, đăng nhập bằng TÀI KHOẢN POS (tên đăng nhập + mật khẩu,
  theo quyền POS) — việc KH-ADMIN-1 sau khai trương. Trước đó `/admin` chuyển về `/trangchu`.
- Khẩu hiệu thương hiệu: **"Đông Y Dưỡng Thể"** (chủ quán chốt 29.10) — dòng dưới "TỨ QUÝ ĐƯỜNG" ở màn mở. Chữ thương hiệu đặt ở `src/noiDung/`.
- Mọi cỡ màn KHÔNG vỡ, không méo: ảnh giữ tỉ lệ (`object-fit`), chữ to theo cài đặt máy không tràn, trình duyệt Zalo dùng được.
- Ít nút, ít thao tác. Tiếng Việt có dấu. Dữ liệu POS chưa trả → ẨN mục đó, không hiện số bịa. Quán KHÔNG có công nợ → app không bao giờ
  hiện chữ "nợ".

## 6. Giờ — giờ Việt Nam (chủ quán chốt 28.10)
- Mọi giờ POS trả là giờ VN dạng `YYYY-MM-DDTHH:mm:ss`, không hậu tố múi giờ. KHÔNG `new Date(chuỗi giờ POS)`; hiện đúng như chuỗi (`dinhDangNgay`).
- "Bây giờ" (đếm ngược, quán mở / đóng) lấy `bay_gio` của POS; đồng hồ máy chỉ để đếm giây giữa hai lần hỏi. Giờ cũ dạng có dấu cách: hiện, không cộng 7.

## 7. Bảo mật App
- Không bí mật trong `src/`, `index.html`, log, báo cáo. Không giá vốn, tồn thật, dữ liệu khách khác.
- Mã trên link QR (`?ma=`) đọc xong thì xoá khỏi thanh địa chỉ (`history.replaceState`).
- Không thêm thư viện nếu phiếu không cho (bộ kiểm K6 giữ danh sách).
