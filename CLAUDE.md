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
- Chỉ được khác demo vì 5 lý do: (a) dữ liệu POS chưa có, hoặc khối thuộc VIỆC SAU đã ghi trong sổ (`TIEN_DO_APPKH.json`) → để trống chỗ,
  ghi rõ việc nào; (b) chữ / số mẫu của demo không dùng (số liệu, hotline 1900 xxxx,
  support@…; giao hàng là Ahamove, không GHN); (c) chưa có giỏ hàng / đặt đơn; (d) màn rộng ≥ 1024 px theo MẪU MÀN TO chủ quán đã duyệt
  (`thiet_ke/mau_man_to/` — khi có); (e) token khẩu hiệu B2.3 có trong danh sách duyệt của bộ kiểm (`DUYET_NGOAI_DEMO`). Khác vì lý do nào khác → `## Câu hỏi`, không tự quyết.
- Mọi việc giao diện PHẢI: (1) tự so ảnh demo ↔ app bằng Chromium + Playwright CÓ SẴN trong môi trường (không thêm vào `package.json`;
  công cụ so ảnh và API giả để ở nháp), cùng cỡ 390×844 (thêm 360 và 430), cùng dữ liệu mẫu như demo; sửa tới khi chỉ còn khác vì (a)–(e);
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
- Khẩu hiệu thương hiệu: **"Đông Y Dưỡng Thể"** (chủ quán chốt 29.10; 30.10 chốt thêm: ĐỔI HẾT mọi chỗ từng ghi "Sức khỏe mỗi ngày" — Trang chủ, màn đăng nhập nếu có, chân trang màn rộng). Chữ đặt ở một chỗ `src/noiDung/thuongHieu.js` (`KHAU_HIEU`). Ở MÀN MỞ (điện thoại + màn rộng) khẩu hiệu dùng kiểu **B2.3** (chủ quán chọn 30.10): phông EB Garamond 600 tự lưu ở `public/fonts/`, màu `#FBE3A2`, bóng `rgba(60,10,5,.35)`, in hoa, giãn chữ — CSS ở `src/giaoDien/khau_hieu.css` (lớp `.khau-hieu`, nạp sau `demo*.css`). Đây là ngoại lệ DUY NHẤT ngoài demo của K9 (xem `DUYET_NGOAI_DEMO` trong bộ kiểm); các chỗ khác vẫn kiểu chữ demo.
- Tên miền `tuquyduong.com` là trang MỚI (chủ quán 30.10): gắn thẳng vào Pages `app-kh` (KH-CF-1), không phải giữ trang cũ.
- Cần POS làm gì → chat App KH tự soạn file `thiet_ke/trao_doi/YEU_CAU_APPKH_GUI_POS_<ngày>.md` để chủ quán chuyển (chủ quán dặn 30.10: tự giao tiếp, không hỏi lại).
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

## 8. Dữ liệu lưu trên máy khách (chủ quán chốt 30.10: "theo đề nghị")
- Dữ liệu của khách chỉ lưu TRÊN MÁY (localStorage): kết quả trắc nghiệm (`kh_tracnghiem`), Kế hoạch và nhắc việc (`kh_kehoach`, từ KH-UI-5b). Sức khoẻ không bao giờ gửi về POS / máy chủ nếu chưa có cửa + khách đồng ý.
- Bản lưu trắc nghiệm giữ cả `khiHau` (chịu nóng / lạnh) và `anToan` (tình trạng đặc biệt, vd đang mang thai) để mở lại kết quả cũ vẫn thấy lời nhắc an toàn. Nút "Sao chép kết quả và góp ý" của demo GIỮ (khách tự dán đi đâu; app không tự gửi).
- Hết phiên đăng nhập (401): KHÔNG xoá dữ liệu trên máy (khách dùng thường xuyên không được mất dữ liệu vì hết hạn), nhưng không hiện ra khi chưa đăng nhập.
- XOÁ khi: khách bấm "Đăng xuất"; hoặc người đăng nhập sau là KHÁC khách (so dấu vết số điện thoại ở khoá `kh_chu`; số thô không lưu); hoặc khách bấm nút xoá của từng tính năng. Quy tắc làm ở một chỗ `src/luuMay.js` (KH-LUU-1); tính năng mới lưu trên máy phải thêm khoá của mình vào danh sách ở đó.
- Kho bị chặn (cửa sổ riêng tư…): không vỡ, KHÔNG báo "đã lưu" khi chưa lưu.


## 9. Bài thử cần trình duyệt thật (bài học KH-LUU-1, KH-SLOGAN-1, KH-UI-3a — cổng GitHub đỏ ba lần)
GitHub chạy cổng KHÔNG có trình duyệt (Playwright). Máy làm việc có. Hai nơi đếm số ca khác nhau → cổng A16 đỏ nếu `SỐ CA` trong `bang_chung_do.txt` ghi số của máy.
- Bài thử có phần chạy trong trình duyệt: không có Playwright thì in "BỎ QUA" (KHÔNG tính hỏng, KHÔNG đếm ca "có Playwright để đo"); đọc biến `KHONG_TRINH_DUYET=1` để bỏ phần đó có chủ ý.
- Dòng `SỐ CA <bài>: N` ghi N đếm được khi chạy VỚI `KHONG_TRINH_DUYET=1` (đúng số GitHub đếm). Phần trình duyệt vẫn phải chạy thật ở máy và ghi kết quả vào `trang_thai.md`.
- Chủ quán KHÔNG sửa tay số này trên GitHub khi đã chạy file script của chat (script tự ghi số đúng).


## 10. Sổ quyết định của chủ quán — đọc TRƯỚC khi làm (chủ quán chốt 30.10)
- `thiet_ke/QUYET_DINH_APPKH.md` là nơi ghi mọi điều chủ quán đã chốt cho App KH; quyết định ở đó THẮNG ghi chú cũ trong phiếu / đặc tả / mục khác của file này.
  Phiếu nào trái với sổ → dừng, ghi `## Câu hỏi`, không tự chọn.
- Bảng tính năng App KH ↔ POS: `thiet_ke/DOI_CHIEU_TINH_NANG.md`. Trao đổi với POS: `thiet_ke/trao_doi/`.
- Sửa §8 theo quyết định 30.10: kết quả trắc nghiệm gửi về POS KHI khách đồng ý ở màn hỏi chia sẻ (sau bài, trước kết quả); không đồng ý → chỉ trên máy như §8.
- Chỉ 3 thứ cần đăng nhập: Kế hoạch, trắc nghiệm, tích điểm. Mọi thứ khác mở cho khách vãng lai (menu, combo, ưu đãi, Giờ vàng, giá từng hạng).
