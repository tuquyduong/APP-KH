# KH-NHANH-2 — kế hoạch

## A. Đếm lượt "chờ" + vòng xoay
- **PA-A (chọn):** `src/api.js` — `goi` cũ đổi tên `goiThat` (đường `fetch` giữ nguyên, K1b vẫn 2 lối); `goi` mới bọc: lượt không ngầm → `+1` lúc gửi, `-1` ở `finally`
  (lỗi / huỷ / 401 đều về 0). Đánh dấu ngầm bằng `ngam(f)`: chạy `f` ĐỒNG BỘ với cờ bật — `goi` đọc cờ ngay đầu (phần đồng bộ của lời gọi), nên chỗ gọi chỉ bọc
  `ngam(() => …)`, không phải thêm tham số cho từng hàm `layX`. `theoDoiDangCho(f)` báo `true` khi có lượt chờ kéo dài liên tục ≥ `MS_TRE_CHO` = 300 ms,
  `false` ngay khi hết lượt; trả hàm huỷ. Trễ 300 ms đặt ở đây (MỘT chỗ, thử được bằng Node), `VongCho` chỉ vẽ. ~30 dòng.
- PA-B: tham số `{ ngam: true }` truyền qua từng hàm `layX(…, tuy)` → mọi hàm ở api.js đổi chữ ký, `taoCua(ham)` phải biết tham số → ~45 dòng, dễ sót. Bỏ.
- `src/components/VongCho.jsx` (mới, ~15 dòng) gắn MỘT lần trong `.phone` (App.jsx): `<span class="cho-xoay to cho-giua" role="progressbar" aria-label=nd('khung.dangCho')>`.
  Chính vòng là phần tử duy nhất (không bọc lớp phủ): `position:absolute` giữa `.phone`, `pointer-events:none`, không nền.
- `src/giaoDien/cho.css` (mới, ~12 dòng, chép ý mẫu kiểu b): `.cho-xoay`, `.cho-xoay.to`, `.cho-xoay.trang`, `.cho-giua`, `.bang-tien.cho-mo`, `.cho-tinh`,
  `@keyframes cho-quay`, `prefers-reduced-motion` → 2,4 s/vòng. Màu: `--pink`, `--pink-dark`, `--muted`, `#fff`, `rgba(255,255,255,.35) (bản thử dùng .45 — không có trong demo, K9 chặn)` (K9 kiểm).

### Bảng lượt gọi POS (A1) — mỗi chỗ "chờ" hay "ngầm"
| Chỗ gọi | Lượt | Ghi |
|---|---|---|
| `heThong.dungHeThong` nạp lúc mở App (/hang, /gio-vang, /gio-hoat-dong) | **ngầm** (từ khi soát: `CUA_NGAM` ở api.js — heThong.js ngoài Phạm vi) | lúc mở App vòng vẫn hiện nhờ /menu, /toi… |
| `heThong` hỏi lại mỗi phút + quay lại tab, `GvDem` → `napGioVang` | **ngầm** | cùng luật `CUA_NGAM` (đường), không sửa heThong.js |
| `duLieuKhach.taoCua.lay` khi kho CHƯA có dữ liệu (mở App, Thử lại) | chờ | |
| `taoCua.lay` khi kho ĐÃ có dữ liệu (5 phút, quay lại > 60 s, sau thao tác, `napNeuCu`) | **ngầm** | một luật trong `lay()` |
| `BaoDonXong` 15 s + quay lại tab (`cuaDon.lay`) | **ngầm** khi kho /don đã có dữ liệu | luật `taoCua` (BaoDonXong không sửa — xem dưới) |
| `dungTheoDoi` lần đầu mở màn / bấm Thử lại | chờ | |
| `dungTheoDoi` hỏi lại 3 s (chờ QR) / 10 s | **ngầm** | lượt do đồng hồ |
| `giaHan` (`/gia-han`) | **ngầm** | bọc `ngam` ngay trong `api.js` (giaHan.js ngoài Phạm vi) |
| `App` /quang-cao khi quay lại App sau ≥ PHUT_KIEM | **ngầm** | lần đầu (/trangchu) chờ |
| `goiKho` (`/api/nd`, kho nội dung) | **ngầm** | không đi qua `goi` → không đếm |
| /menu, /chuong-trinh, /quang-cao lần đầu, /voucher?all, /vi, /don?trang, /don/:ma (Don, Chi tiết, Đặt lại), /goi-nap (Thanh toán) | chờ | khách đang đợi |
| báo giá, đặt đơn, huỷ đơn, đăng nhập, PIN, sửa hồ sơ | chờ | |

### Sửa kế hoạch sau khi agent phụ soát (4 câu)
- `src/heThong.js`, `src/giaHan.js`, `src/dungMenu.js` NGOÀI Phạm vi → không bọc ở đó. Thay bằng: `api.js` coi ba cửa App tự nạp nền (`/hang`, `/gio-vang`,
  `/gio-hoat-dong` — heThong mỗi phút, quay lại tab, GvDem) là ngầm (`CUA_NGAM`); `giaHan` trong api.js bọc `ngam(...)`. Mất mát: mở thẳng `/uudai/hang` mà CHỈ `/hang` chậm
  → không vòng (các lượt khác lúc mở App vẫn có vòng).
- `dungTheoDoi`: lượt POS chạy trong effect sau lần vẽ → đánh dấu bằng ref `dongHo` (đồng hồ đặt, effect đọc rồi xoá), không bọc ở `setInterval`.
- `daTra` (App.jsx) gọi `menu.taiLai(true)` sau một lượt ngầm → bọc `ngam`. Menu.jsx: bấm tab Menu khi đã có menu → `ngam(tai.taiLai)`.
- Kho chỉ có bản tóm tắt trên máy (`tuMay`) → coi như CHƯA có (Hồ sơ / Mã thành viên vẫn khung chờ).
- BaoDonXong: KHÔNG sửa (đã thử, làm đỏ 2 bài cũ đọc nguồn) — `cuaDon.lay()` ở đó luôn chạy khi kho đã có đơn (dangChay) → luật `taoCua` đã cho ngầm.
- Ngoài bảng, giữ "chờ": dungMenu gọi lại sau 401, Thanh toán /toi mới, Đã nạp /toi + /vi, NhanMa, KiemKhop (khách / quản trị đang đợi).

## B. Tổng tiền không trống
- **PA-A (chọn):** `dungBaoGia` (dungDatDon.js) giữ báo giá cuối (`bgCu`) và trạng thái `dangTinh` (đang có lượt hỏi cho đúng giỏ + mã hiện tại, chưa có kết quả).
  Giỏ BỎ ref `bgCu` riêng (KH-VC-2) → dùng `bgCu` của hook (MỘT bản nhớ). `BangTien({ bg, loi, bgCu, dangTinh })`: đang tính + có cũ → dòng cũ mờ (`cho-mo`) + vòng nhỏ
  trước Tổng; đang tính, chưa có cũ → "Đang tính tiền…" (`gio.dangTinh`, mới); không hỏi / CHUA_MO → "Tổng tiền sẽ hiện…" như cũ; lỗi → như cũ. ~20 dòng.
- PA-B: Thanh toán tự nhớ ref như Giỏ → hai bản nhớ (phiếu cấm). Bỏ.
- Nút: Thanh toán `khoa` đã có `!bg` (bg = báo giá MỚI) → không đổi. Giỏ: nút "Tiếp tục" hôm nay chỉ khoá theo `coThe`; phiếu D1 đòi "nút đi tiếp KHOÁ" lúc đang
  tính lại → thêm `|| dangTinh` (số trên nút vẫn chỉ theo `bg` mới). Dùng `dangTinh` (không dùng `!bg`) để CHUA_MO / lỗi KHÔNG khoá vĩnh viễn (K5).
- B3 nút có chữ "Đang gửi…" thật (grep `dangGui`): nút Đặt đơn Thanh toán (đồ uống / thẻ / nạp — cùng nút, cả "Mạng chậm, đang gửi lại…") → vòng trắng;
  nút Xác nhận của bảng PIN (`pin.dangGui`, nền trong, chữ hồng) → vòng thường. Nhận mã / Lưu hồ sơ / Đăng nhập không có chữ "Đang gửi…" (chỉ khoá) → không đổi.

## C. Bớt chờ
- C1 **PA-A (chọn):** `index.html` một `<script>` nhỏ ĐẦU `<head>` (trước stylesheet — script nội tuyến chờ CSS nếu đặt sau): `g='%VITE_POS_API%'` (Vite thay lúc dựng);
  `https://…` → `new URL(g).origin` → thêm `<link rel=preconnect crossorigin>`; biến trống / không thay → không thêm gì. ~3 dòng.
  PA-B: `<link href="%VITE_POS_API%">` thẳng — biến trống thì còn nguyên chữ `%VITE_POS_API%` (phiếu cấm), và không cắt được đường dẫn. PA-C: plugin trong
  `vite.config.mjs` — ngoài Phạm vi. Bỏ.
- C2 `taoGop`: gom đầu + đuôi, ~8 dòng: đang yên (không hẹn giờ, lần đổi trước cách ≥ ms) → chạy ngay; không thì hẹn lại `ms` sau lần đổi cuối. `huy` theo khoá ở
  `dungBaoGia` giữ nguyên.
- C3 không đổi số lượt (chỉ bọc đếm), không đổi hợp đồng.

## Ca thử ↔ Nghiệm thu (`cong_cu/thu_KHNHANH2.js`)
| Nghiệm thu | Ca |
|---|---|
| A1 | Node: lượt chờ đếm +1/−1; `ngam` không đếm; lỗi mạng / 401 → về 0 (huỷ do `choMs` đi cùng nhánh `finally`, không có ca riêng); theo dõi > 300 ms báo true, < 300 ms không báo; đọc nguồn: mảng NGAM (CUA_NGAM ở api.js — phủ heThong / GvDem; giaHan; taoCua; dungTheoDoi; App quảng cáo + daTra; Menu) |
| A1 K1b | `kiem_tra_truoc_khi_giao.js` (npm test) vẫn 2 lối fetch |
| A2 | Chromium 390: POS chậm 1,5 s → `.cho-giua` hiện, nằm giữa `.phone`, nền trong suốt, `pointer-events:none`, không phần tử phủ; bấm nút tab trong lúc vòng hiện → chuyển màn; hết lượt → ẩn; nhãn có `data-nd` |
| A2 ngầm | Theo dõi đơn hỏi lại 3 s → không vòng; quay lại App > 60 s → không vòng |
| A3 | css chỉ lớp `cho-`, màu bảng demo (K9 qua npm test) |
| B1 | Giỏ bấm + → dòng cũ mờ (`cho-mo`), vòng nhỏ trước tổng, báo giá về → hết mờ, số mới; Giỏ lần đầu → "Đang tính tiền…"; chưa đăng nhập → câu cũ |
| B2 | Giỏ đang tính → nút khoá, số trên nút không phải số cũ; Thanh toán đang tính → nút Đặt khoá |
| B3 | Thanh toán đặt đơn (POS giả chậm + lỗi) → nút có `.cho-xoay.trang` lúc gửi |
| C1 | dựng `vite build` với `VITE_POS_API=https://www.pos-vi-du.test` → chạy script trong index.html → `link[rel=preconnect]` href = gốc, không `/api`; dựng không biến → không link |
| C2 | Node: 1 lần → gọi ngay; 5 lần trong 600 ms → 2 lượt, lượt cuối mang giỏ cuối; yên > ms rồi đổi → ngay; Chromium: lượt cũ về muộn không ghi đè giỏ mới |
| C3 | Chromium: mở App đếm lượt /toi /diem /voucher /don /menu = 1 (như KH-NHANH-1) |
| D2 | `thu_KHMUA1` B5 (gom đuôi) sửa thành đầu + đuôi |
| D3 | `viec/KH-NHANH-2/dot_bien_tay.js` ≥ 7 đột biến (danh sách phiếu) |

Đường song song cần canh: báo giá cũ về muộn sau đổi giỏ (huy theo khoá); 401 giữa lượt chờ (finally về 0); hai lượt chờ chồng nhau (đếm 2 → 0); lượt ngầm dùng chung
lời hứa với lượt chờ sau (kho trống thì không ngầm). Không chặn oan (K5): CHUA_MO / lỗi báo giá → Giỏ không khoá vĩnh viễn; chưa đăng nhập → Giỏ mở.
