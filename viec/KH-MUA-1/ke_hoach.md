# KH-MUA-1 — kế hoạch

## Điều đã đọc (code thật)
- `src/components/ThanhTab.jsx:2-7` — 4 tab; demo `app_kh_demo.html:2758` có tab "Giỏ hàng" `nhA-kim`, màu `--c:#7C8696`.
- `index.html` (Cấm sửa) KHÔNG có `<symbol>` `nhA-kim`, `p-basket`, `m-store`, `m-scooter`, `i-store`, `i-bell`, `i-flag`, `i-cat-coffee`, gradient `e-kim`, `e-lav`
  (grep). → chép NGUYÊN các `<symbol>` đó từ demo vào một chuỗi trong `src/` và vẽ một lần (sprite ẩn) trong App.
- CSS demo của `cart` / `checkout` / `tracking` (`.cart-item`, `.qty-ctrl`, `.mode-opt`, `.opt-row`, `.rdo`, `.tl-*`, `.pick-num`, `.empty-cart`,
  `.detail-addcart`, `.detail-qty-row`, `.cart-opt`, `.opt-title`, `.reorder-btn`…) chưa có trong `src/giaoDien/` → chép nguyên theo thứ tự cascade
  vào `src/giaoDien/demo_mua.css` (bằng script ở nháp, như demo_1/2).
- Demo KHÔNG có nút thêm giỏ trên ô món (`prodCard`, dòng 3337) và KHÔNG có số trên tab (chỉ `.badge-dot` ở chuông). Phiếu A1/A2 ghi "như demo".
  → Trang món: làm theo demo (ghi chú, số lượng, "Thêm vào giỏ"). Ô món: KHÔNG thêm nút (đúng demo) — ghi `## Câu hỏi`.
  Số trên tab: phiếu E6 bước 1 đòi "tab Giỏ hàng hiện số 2" → làm viên số nhỏ bằng biến màu demo, ghi lệch vào `doi_chieu_demo.md` + `## Câu hỏi`.
- Hợp đồng v2: `GET /don/:ma` `mon[]` KHÔNG có `ma` (`HOP_DONG_API_KH.md:38`); `/toi` không có `dia_chi`; không có `PUT /toi { dia_chi }`.
  → "Đặt lại" đọc `mon[].ma` (tên dự kiến, ở MỘT chỗ `datDon.js`); thiếu `ma` → báo "món không còn", bỏ qua. Địa chỉ: giao tận nơi TẮT ("Sắp có")
  nên không có ô địa chỉ ở việc này (B2 chờ v3 + KH-MUA-2). Hai điểm ghi `## Câu hỏi` / gửi POS.

## Phương án
| Phần | A (chọn) | B | Vì sao chọn A |
|---|---|---|---|
| Giỏ | `src/gio.js` hàm thuần + kho tiêm (như `tracNghiemLuu.js`), App giữ trạng thái bằng `taoKho` (~70 dòng) | Context React riêng + reducer (~110 dòng) | ít dòng, thử thẳng được bằng `import()` |
| Cổng đặt đơn | `src/datDon.js`: dựng thân / đọc trả lời / map lỗi + `datCongDatDon(fn)` với `fn(phuongThuc, duong, than)` (giống `goi` của api.js) (~90 dòng) | 4 hàm tiêm riêng (baoGia/taoDon/xemDon/huyDon) | một chỗ tiêm, KH-MUA-1b chỉ `datCongDatDon(goi)`; đường dẫn ở một chỗ |
| Báo giá | hook `dungBaoGia` trong `datDon.js`? KHÔNG — hook để trong màn `ThanhToan.jsx`, gộp 600 ms bằng hàm thuần `taoGop` trong `datDon.js` | thư viện debounce | không thêm thư viện |
| Màn | `pages/GioHang.jsx`, `pages/ThanhToan.jsx`, `pages/TheoDoiDon.jsx` (QR trả tiền nằm trong Theo dõi đơn khi `cho_tra`) (~260 dòng) | màn QR riêng | ít màn, ít đường dẫn; QR chỉ có ở trả lời `POST /don` nên giữ trong bộ nhớ App |
| PIN | `PinSheet.jsx` thêm chế độ nhập MỘT lần (`gui(pin)`), chế độ đặt PIN giữ nguyên (~15 dòng) | bảng PIN mới | dùng lại (phiếu) |
| QR | tách `VeQR` của `ManQR.jsx` ra export, dùng lại | chép hàm | một chỗ vẽ |
| Biểu tượng | `src/noiDung/bieuTuongMua.js` chuỗi `<symbol>` chép nguyên + `<svg hidden>` một lần trong App | chuyển sang JSX từng cái | chép nguyên, không gõ lại |
| Cờ | `src/noiDung/caiDat.js` `DAT_ONLINE = false` | biến môi trường Vite | phiếu chỉ định |

Ước lượng: app ~520 dòng (vượt ~500 chút vì sprite biểu tượng là chuỗi chép; CSS chép không tính), thử ~450 dòng.

## Đường dẫn mới (`src/duongDan.js`)
- `/giohang` (tab `giohang`, không cần đăng nhập) · `/thanhtoan` (cần đăng nhập, cha `/giohang`) · `/don/:ma` (cần đăng nhập, cha `/taikhoan/donhang`).

## Ca thử ↔ nghiệm thu (`cong_cu/thu_KHMUA1.js`)
Phần 1 (không trình duyệt — số GitHub đếm):
- A1: ThanhTab 5 mục đúng thứ tự demo, `nhA-kim`, `#7C8696`; `duongDan` có `/giohang`, `/thanhtoan`, `/don/:ma`; `/thanhtoan` cần đăng nhập, `/giohang` không.
- A3: gio.js thêm (gộp cùng mã + cùng ghi chú), bớt về 0 thì xoá, đổi số lượng (1–99), xoá, dọn; lưu `kh_gio` chỉ `ma, so_luong, ghi_chu` (có `gia` trong đầu vào → không vào kho); đọc hỏng → []; kho chặn → không vỡ, trả false;
  ghi chú cắt 100 ký tự; `kh_gio` nằm trong danh sách khoá của `luuMay.js` (xoaTatCa xoá, doiKhach khác khách xoá); `trangThaiDong`: món không còn / `con_hang === false` → cờ, `duocThanhToan` false.
- A4: `canDangNhap('giohang', false) === false`, `canDangNhap('thanhtoan', false) === true`; `/dangnhap?tiep=/thanhtoan` giữ `tiep`.
- A5/E2: `giaHinhDung` = giá tra `gia_hang` × số lượng (không cộng dòng nào); `bangTien(baoGia)` lấy NGUYÊN `tam_tinh`, `giam[]`, `phi_giao`, `tong` — số POS khác phép nhân vẫn ra đúng số POS; báo giá null → null.
- D1/D3: `thanBaoGia`, `thanDatDon` đúng tên trường (mon[] {ma, so_luong, ghi_chu}, ma_giam, cach_nhan, dia_chi chỉ khi giao, cach_tra, pin chỉ khi ví); không trường giá; đọc trả lời `docDatDon`; đường dẫn `/gio/bao-gia`, `/don`, `/don/:ma`, `/don/:ma/huy`.
- D1: `src/datDon.js` không `fetch`; `src/api.js` không thêm cửa (K8 giữ nguyên); cổng chưa tiêm → từ chối `CHUA_MO`, không ném lỗi lạ.
- D2: `DAT_ONLINE === false` ở `caiDat.js`; cờ tắt → `goiCong` không gọi `fn`.
- B3: `viThieu(tong, soDu)`: đủ → 0; thiếu → số thiếu; thiếu số → null (không cho chọn).
- B5: `taoGop(600)` gộp nhiều lần gọi thành 1.
- B6: `loiDatDon` trả nguyên `error` POS; `chanDat(gioHoatDong)` → `nhan_don === false` / `dang_mo === false` khoá + `thong_bao`.
- B7: `conLaiQR(het_han, bay_gio)` giây còn lại theo giờ VN (không `new Date(chuỗi)`); hết → 0.
- B8: `khoaGui()` — lần bấm thứ hai khi đang gửi không gọi cổng (1 lần `POST /don`); lỗi mạng không tự gửi lại.
- C1: `buocTienTrinh('dang_lam')` → bước hiện tại đúng; `da_huy`; `xongChua` (xong / da_giao / da_huy dừng hỏi lại).
- C3: `monDatLai(don, menu)` → món có `ma` còn trong menu vào giỏ, còn lại đếm "bỏ qua".
Phần 2 (Chromium + POS giả `page.route`, bundle esbuild có cổng tiêm `fetch('/api/kh'+duong)` và cờ bật bằng plugin thay `caiDat.js` — CHỈ trong bài thử):
- E1 luồng: khách chưa đăng nhập thêm 2 món ở Trang món → tab hiện "2" → giỏ → Tiếp tục → `/dangnhap?tiep=%2Fthanhtoan` → đăng nhập (gieo token) → `/thanhtoan`
  → bảng tiền đúng số POS giả (khác phép nhân) → Xác nhận QR → QR hiện + đếm ngược → POS giả đổi `da_tra` → bước "Đã thanh toán", giỏ trống.
- ví + PIN sai (hiện nguyên lời `PIN_SAI`) / đúng (sang theo dõi); thân `POST /don` có `pin`, PIN không có trong localStorage / sessionStorage.
- ví không đủ: hàng ví mờ, "Còn thiếu …" đúng số; ngoài giờ (`nhan_don:false`): nút khoá + `thong_bao`; POS trả `HET_HANG` → hiện nguyên câu.
- QR hết hạn → "Tạo mã mới" + "Huỷ đơn"; huỷ đơn chờ trả → `POST /don/:ma/huy` gọi 1 lần; đặt lại từ Lịch sử đơn → giỏ có món, món lạ bị báo.
- bấm đôi Xác nhận → đúng 1 `POST /don`; đổi số lượng 3 lần liền → ≤ 2 lần `bao-gia` (gộp 600 ms).
- cờ tắt (bundle thường): giỏ dùng được, Thanh toán hiện "Đặt online sắp mở — mời bạn đặt tại quầy", 0 lời gọi tới `/gio/*`, `/don` POST.
- 360 / 390 / 430 + chữ 130%: giỏ, thanh toán, theo dõi không tràn ngang; Lỗi JS = 0.

E3 bài cũ sửa: `thu_KHUI2.js` B3 ("đúng 4 mục, không Giỏ hàng" → 5 mục có Giỏ hàng) — đỏ trên gốc tự nhiên. Bài khác chỉ sửa nếu đỏ vì đổi có chủ ý.
E4 đột biến (`dot_bien.py`, ≥ 5 VS-): tự cộng tổng; bỏ khoá bấm đôi; lưu giá vào giỏ; gọi mạng khi cờ tắt; cho trả ví khi thiếu tiền; + BV- bỏ `kh_gio` khỏi luuMay.

## Đường song song cần canh
- Đăng xuất / khác khách: `kh_gio` xoá (luuMay). Hết phiên 401: giỏ GIỮ (như §8) — giỏ không có dữ liệu riêng nhạy cảm, khách vãng lai cũng có giỏ.
- `luuMay.doiKhach` có dữ liệu mà chưa biết chủ → xoá: khách vãng lai thêm giỏ rồi đăng nhập lần đầu sẽ MẤT giỏ (K5 — chặn oan luồng A4!).
  → giỏ không tính vào "có dữ liệu mà chưa biết chủ"; vẫn xoá khi khác khách / đăng xuất. Ca thử riêng.
- Lịch sử đơn (`Don.jsx`) dùng `layDon` / `layChiTietDon` có sẵn (trong hợp đồng) — "Đặt lại" gọi `layChiTietDon`, không thêm cửa.
- K5 luồng hợp lệ không bị chặn: khách vãng lai xem giỏ; món `con_hang: null` vẫn đặt được; ví đủ vẫn chọn được; trong giờ vẫn xác nhận được.
