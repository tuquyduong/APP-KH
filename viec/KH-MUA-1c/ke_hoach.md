# KH-MUA-1c — kế hoạch (CHỜ DUYỆT)

Đọc trước khi viết (luật số 0): `src/datDon.js` (toàn file, 246 dòng), `src/pages/ThanhToan.jsx` (213), `src/components/PinSheet.jsx` (77),
`src/pages/TheoDoiDon.jsx:52–95`, `src/luuMay.js:55–74`, `src/kiemKhop/canTuPos.js`, `src/kiemKhop/kiemKhop.js`, `src/giaoDien/giaoDien.css:1–25`,
`src/giaoDien/demo_1.css:381–393`, demo `thiet_ke/app_kh_demo.html:1465–1473, 4040–4060`, `viec/KH-MUA-1c/hop_dong_v9.md:95–117`,
`viec/KH-MUA-1b/trang_thai.md:423–447` (soát vòng 4), bài thử `thu_KHMUA1.js`, `thu_KHMUA1b.js`, `thu_KHKHOP1.js`, `viec/KH-MUA-1b/dot_bien.py`.

## 0. Hiện trạng đã đọc (cái sẽ sửa)
| Chỗ | Hiện nay | Vì sao sai |
|---|---|---|
| `datDon.js:88–91` `loaiLoi` | mọi 4xx có `code` (trừ 401) → `chua_tao` | `KHO_BAN` 409 có thể ném SAU khi POS đã trừ ví (phiếu, code POS `donApp.js` finally) → App xoá bản ghi, khách bấm lại khoá mới = trừ ví lần hai |
| `datDon.js:113–115` `guiDonAnToan` | 401 + `DANG_XU_LY` xét riêng ở đây, ngoài `loaiLoi` | luật rải hai chỗ (soát vòng 4) |
| `ThanhToan.jsx:92` | `KHOA_GUI_DA_DUNG` → xoá bản ghi (`:115`) + "Vui lòng đặt lại" | đơn có thể đã đặt (khoá đã dùng) — mời đặt lại = nguy cơ đơn thứ hai |
| `TheoDoiDon.jsx:58–61, 82` | dòng ví + số cạnh QR CHỈ từ `kh_don_gui` | tải lại máy khác → mất dòng ví; POS v7 đã trả `cach_tra`/`giu_vi`/`con_lai` |
| `datDon.js:69–77` `docDon` | không đọc 3 trường v7 | như trên |
| `datDon.js:143–167` `ghiHong` | ghi hỏng một lần → tab bỏ qua kho tới lần ghi thành công | không thấy bản ghi tab khác vừa ghi (soát vòng 4 NGHI NGỜ) |
| `PinSheet.jsx:33–47` | `useEffect([so])` tự gửi khi đủ 4 số; hàng cuối `<span/> · 0 · Xoá` | chủ quán 05.11: phải bấm "Xác nhận"; Xoá ở trái |
| `giaoDien.css:13` | `:where(button){ text-align:inherit }` | demo `<button>` mặc định trình duyệt = chữ GIỮA; app kế thừa chữ TRÁI của `.panel` → số lệch trái (đúng ảnh iPhone). Dọc: `<button>` tự căn giữa nội dung, không lệch |
| `canTuPos.js` | chưa khai trường v6–v9 | trang /kiemkhop không báo `cach_tra`… / `/chuong-trinh` / `ngay_sinh` |
| `thiet_ke/HOP_DONG_API_KH.md` | bản v5 | `cmp` khác v9 ở dòng 3 |

## 1. Phương án từng phần

### A. Hợp đồng v9
- **A1** `cp viec/KH-MUA-1c/hop_dong_v9.md thiet_ke/HOP_DONG_API_KH.md` rồi `cmp` (0 dòng tay). Không có phương án B.
- **A2** `canTuPos.js`: thêm 4 dòng mục, sửa 1 dòng:
  - `don_v7` — `GET /don/:ma`, `['don.cach_tra','don.giu_vi','don.con_lai','don.hoa_don[].loai','don.hoa_don[].trai','don.hoa_don[].phai']`, `co: true, moi: true, viec_pos: 'HD-KH-1'`;
  - `don_ds_v7` — `GET /don`, `['data[].cach_tra','data[].giu_vi','data[].con_lai']`, `co: true, moi: true, viec_pos: 'HD-KH-1'`;
  - `chuong_trinh` — `GET /chuong-trinh`, `token: false`, `['data[].ma','data[].ten','data[].mo_ta','data[].loai','data[].dang_bat']`, `co: true, moi: true, viec_pos: 'CT-1a'`;
  - `toi_v9` — `GET /toi`, `['khach.ngay_sinh']`, `co: true, moi: true, viec_pos: 'CT-1a'`;
  - `ho_so_them` bỏ chữ "ngày sinh" khỏi `ten` (ngày sinh đã có ở `toi_v9`).
  - `moi: true` vì POS thật có thể chưa dựng bản v7/v9 → /kiemkhop hiện ⏳ chứ không ✗ (`kiemKhop.js` `trangThaiMuc`). Bài `thu_KHKHOP1.js` A2 sẵn đã canh
    `co:true` ⇒ có trong hợp đồng — với v9 bốn cửa trên đều có. Không đụng giao diện ngày sinh / chương trình / hoá đơn.
  - B (bỏ `moi`): /kiemkhop báo ✗ "Thiếu" khi POS chưa dựng — báo sai. Chọn A. (~5 dòng)

### B. Luật lỗi `POST /don` — MỘT chỗ
- **A (chọn, ~+10 / −6 dòng `datDon.js`)** — `loaiLoi` trả MỘT trong ba, kèm bảng mã có tên:
  ```js
  // Luật lỗi POST /don (hợp đồng v9 dòng 115–116 + code POS datDon) — MỘT chỗ:
  //  'chua_tao'  4xx có code mà POS trả TRƯỚC khi tạo phiên (PIN, giá đổi, hết hàng, ngoài giờ, 429…) → xoá bản ghi, khách bấm lại (khoá mới).
  //  'gui_lai'   chưa rõ, tự gửi lại CÙNG khoá + thân: mất mạng, 5xx, 4xx không code, 200 thiếu ma_don, KHO_BAN.
  //  'dung'      chưa rõ, KHÔNG tự gửi lại: 401 (đăng nhập lại → "Gửi lại đúng đơn này"), KHOA_GUI_DA_DUNG (xem Lịch sử đơn).
  const MA_GUI_LAI = ['KHO_BAN'];              // 4xx có code mà đơn CÓ THỂ đã tạo
  const MA_DUNG = ['KHOA_GUI_DA_DUNG'];
  const LUOT_LAU = { DANG_XU_LY: 30, KHO_BAN: 30 }; // ≈ 1 phút (30 × 2 giây); mã khác LAN_GUI_LAI = 3
  export function loaiLoi(e) {
    if (e && e.code === 'CHUA_MO') return 'chua_tao';
    if (!e) return 'gui_lai';
    if (e.status === 401 || MA_DUNG.includes(e.code)) return 'dung';
    return e.status >= 400 && e.status < 500 && e.code && !MA_GUI_LAI.includes(e.code) ? 'chua_tao' : 'gui_lai';
  }
  ```
  `guiDonAnToan`: `chua_tao` → ném lỗi POS; `dung` → ném `{ code: 'KHONG_BIET', goc: loi.code }` ngay; `gui_lai` → đếm lượt theo `LUOT_LAU[loi.code] ?? LAN_GUI_LAI`
  (hai bộ đếm `lan`/`lanXuLy` gộp thành một bộ đếm theo nhóm "lâu" / "thường"), hết lượt → `{ code: 'KHONG_BIET', goc }`. Bỏ dòng `loi.status === 401` + `xuLy` rải ở `:114–115`.
  Tên giá trị `khong_biet` đổi thành `gui_lai`/`dung` → mọi chỗ gọi `loaiLoi`: chỉ `guiDonAnToan` (grep `loaiLoi(` ở `src/`: 1 chỗ) + bài thử `thu_KHMUA1.js:117`, `thu_KHMUA1b.js` (sửa theo).
- **B** — giữ hai giá trị, thêm `KHO_BAN` vào `loaiLoi` và thêm điều kiện `KHOA_GUI_DA_DUNG` ở `guiDonAnToan` (~+4 dòng). Ngắn hơn ~6 dòng nhưng
  giữ luật rải hai chỗ — trái B1 "Gộp: một danh sách / một vị từ". Chọn A.
- **B2 `KHOA_GUI_DA_DUNG` (ThanhToan.jsx, ~+5 dòng)** — trong nhánh lỗi `guiDon`: `e.code === 'KHONG_BIET' && e.goc === 'KHOA_GUI_DA_DUNG'` → `ghiGuiDo({ ...ghi, da_dung: true })`
  (GIỮ bản ghi, đánh dấu), đóng PIN. Khối "chưa rõ" sẵn có: điều kiện `guiDo.quaHan` → `guiDo.quaHan || guiDo.da_dung` cho hai nút (ẩn "Gửi lại đúng đơn này",
  hiện "Bỏ qua, đặt đơn mới" — khách tự bấm mới xoá). Tiêu đề khi `da_dung`: "Đơn này có thể đã đặt trước đó — mời bạn xem Lịch sử đơn". Bỏ `KHOA_GUI_DA_DUNG ? 'Vui lòng đặt lại'`
  ở `xuLyLoi` (`:92`). `da_dung` lưu chung bản ghi `kh_don_gui` (đã nằm trong `luuMay` KHOA_DU_LIEU) → tải lại / tab khác vẫn thấy; không khoá mới.
  - B khác: hiện thông báo riêng + nút riêng — thêm khối mới, trái "dùng lại khối quá 24 giờ". Loại.
- **B3** 4xx có code khác: không đổi đường (vẫn `chua_tao` → xoá bản ghi, `xuLyLoi`).
- **B4** `KHO_BAN` hết 30 lượt → `KHONG_BIET` → khối "Lần đặt trước chưa rõ kết quả" + "Gửi lại đúng đơn này" sẵn có. Không thêm màn.

### C. Theo dõi đơn đọc ví từ POS (v7)
- **A (chọn, ~+4 dòng)** — `docDon` thêm `cachTra` (`'qr'|'vi'|'vi_qr'`, POS trả `null` → `null`, POS cũ thiếu trường → `undefined`), `giuVi`, `conLai` (số hoặc `null`).
  `TheoDoiDon.jsx`: một biến nguồn
  `const tra = don && don.cachTra !== undefined ? (don.cachTra ? { cach_tra: don.cachTra, giu_vi: don.giuVi, con_lai: don.conLai } : null) : banGhiCuaDon(ma);`
  rồi `viQr` / `soTra` / dòng "Đã giữ…" đọc `tra` thay `banGhi`. POS có trường → dùng POS (kể cả máy khác); POS trả `null` (đơn quầy) → không dòng ví (C2);
  POS cũ chưa có trường → bản ghi trên máy (như nay). Không cộng trừ số nào (C2).
- **B** — gộp POS + bản ghi từng trường (`don.giuVi ?? banGhi.giu_vi`) — có thể trộn số của hai nguồn khác nhau. Loại.
- **C3** sửa chú thích "Không có bản ghi (máy khác) → không biết → ẩn" (`TheoDoiDon.jsx:60`) và câu `datDon.js:130–131` ("để tải lại trên cùng máy…") cho đúng v7.
  `grep -rn "v7\|tạm" src/` không thấy ghi chú "tạm, chờ POS v7" trong `src/`; sổ `thiet_ke/QUYET_DINH_APPKH.md` có thì ghi Phát hiện (không sửa sổ).

### D. Bù ca thử + D4 ghiHong
- **D4 A (chọn, ~+3 / −2 dòng `datDon.js`)** — `docGuiDo`: LUÔN đọc kho trước; kho có bản ghi hợp lệ → trả nó (của tab khác hay của mình); kho rỗng / ném →
  `ghiHong ? bộ nhớ trang : null`. `ghiGuiDo` khi `setItem` ném: thử `removeItem` bản cũ (kho đầy vẫn xoá được) để kho không giữ bản CŨ hơn bộ nhớ.
  Hệ quả: kho đầy → vẫn thấy bản ghi tab khác; kho chặn hẳn (`getItem` ném) → như nay (bộ nhớ trang). Ca đỏ: kho giả `setItem` ném / `getItem` chạy →
  ghi bản X hỏng → "tab khác" `setItem` thẳng bản Y vào kho thật (giả) → `docGuiDo()` phải ra Y (gốc ra X).
- **D4 B** — nghe sự kiện `storage` để xoá `ghiHong`: cần nối vào `ThanhToan` (đã nghe) và mọi màn đọc bản ghi; dài hơn, phụ thuộc màn. Loại.
- D1, D2, D3, D5: chỉ thêm ca thử (bảng ca dưới), không đổi code (`!bg` đã ở `ThanhToan.jsx:100`; `PIN_DANG_KHOA` đi chung `MA_PIN` `:24, :114`; `doiKhach` `luuMay.js:61–66`).

### F. Bảng PIN
- **F1 A (chọn, 1 dòng CSS ở `giaoDien.css`)** — `.pin-pad button{ text-align:center; }` (trả lại mặc định trình duyệt mà demo dùng). Nguyên nhân: `giaoDien.css:13`
  `text-align:inherit`. Sẽ đo bằng Chromium (vị trí giữa chữ số ↔ giữa nút, lệch ≤ 1px; cả bàn phím giữa `.panel`) ở 360/390/430 trước + sau.
- **F1 B** — đổi luật chung `:where(button)` bỏ `text-align:inherit`: sửa cả `.qty-ctrl` (giỏ hàng — phiếu CẤM) và mọi nút thay `<div>` đang dựa vào kế thừa → rủi ro
  vỡ nhiều màn. Loại; các nút khác bị cùng gốc ghi Phát hiện (đã ghi ở `trang_thai.md`).
- **F2–F4 (`PinSheet.jsx`, ~+8 dòng)** — bỏ `useEffect([so])` tự gửi; logic cũ của nó chuyển nguyên vào hàm `xacNhan()` (chỉ chạy khi `so.length === DO_DAI && !dang`).
  Hàng cuối: `<button class="lk" onClick={xoa}>Xoá</button>` · `0` · `<button class="lk pin-ok" disabled={so.length < DO_DAI || dang} onClick={xacNhan}>{dang ? 'Đang gửi…' : 'Xác nhận'}</button>`.
  Phím: `Enter` → `xacNhan`, `Backspace` → `xoa` (đã có). Đặt / đổi PIN: bước `moi` bấm Xác nhận → sang `lai`; bước `lai` bấm Xác nhận → so khớp → `datPin`.
  Sai PIN (POS) → giữ như nay: hiện nguyên lời, `datSo('')`. PIN không lưu (chỉ state của bảng).
  CSS `.pin-ok` (giaoDien.css, 1 dòng): `color:var(--pink-dark); font-weight:700;` — biến màu của demo (K9); `button:disabled{opacity:.45}` sẵn có làm mờ khi chưa đủ 4 số.
  Biểu tượng ⌫ không có trong bộ SVG demo (`grep -o 'symbol id="i-…"'`: không có backspace) → dùng chữ "Xoá" như demo.
- **F B** — giữ `useEffect` + cờ `daBam`: thêm state, khó đọc hơn. Loại.
- **F6** ảnh 360/390/430 × (trả ví, đặt PIN) bằng Chromium + API giả ở nháp → `viec/KH-MUA-1c/so_anh/`; `doi_chieu_demo.md` một bảng "Bảng PIN": demo `Quên PIN · 0 · Xoá`,
  tự gửi khi đủ 4 số / app `Xoá · 0 · Xác nhận`, bấm mới gửi — khác vì chủ quán chốt 05.11 (phiếu F2); "Quên PIN" demo chưa có cửa POS → (a).

### E. Kiểm
- Bài mới `cong_cu/thu_KHMUA1c.js`: phần 1 hàm thuần (nạp thẳng `datDon.js`, `canTuPos.js`, đọc file) chạy cả khi `KHONG_TRINH_DUYET=1`; phần 2 Chromium (vite dựng sẵn
  như `thu_KHMUA1b.js`, POS giả theo v9) → không có Playwright thì "BỎ QUA". `SỐ CA` đếm với `KHONG_TRINH_DUYET=1`.
- Sửa bài cũ (phiếu F5 cho phép, bài sửa thường): `thu_KHMUA1.js` (`:117` KHO_BAN → gửi lại; ca `vi-pin` / `vi-mat-mang` gõ PIN rồi `Enter`),
  `thu_KHMUA1b.js` (`nhapPin` bấm thêm "Xác nhận"; ca `4xx` D1 `KHOA_GUI_DA_DUNG` → khối "có thể đã đặt", giữ bản ghi; các ca so `loaiLoi === 'khong_biet'` → `gui_lai`/`dung`).
  Mỗi bài đổi: chạy trên gốc (đỏ) + trên mới (xanh), ghi `SỐ CA` (A16).
- `viec/KH-MUA-1c/dot_bien.py` (khuôn `viec/KH-MUA-1b/dot_bien.py`, đối chứng xanh trước), ≥ 12 đột biến, tên viết NGUYÊN chuỗi:
  `VS-KHO-BAN-CHUA-TAO`, `VS-KHO-BAN-KHOA-MOI`, `VS-KHO-BAN-THAN-KHAC`, `VS-KHO-BAN-KHONG-GUI-LAI`, `VS-KHOA-DA-DUNG-XOA`, `VS-KHOA-DA-DUNG-GUI-LAI`, `VS-GIU-VI-TU-TINH`,
  `VS-GIU-VI-BAN-GHI-TRUOC`, `VS-DON-QUAY-DONG-VI`, `BV-DIEM-GUI-BAO-GIA`, `VS-401-CHUA-TAO`, `VS-PIN-DANG-KHOA-XOA`, `BV-GHI-HONG-DOC-KHO`, `VS-PIN-TU-GUI`, `VS-PIN-XOA-HET`,
  `BV-PIN-GIUA`. Bảng "chỗ vá → đột biến" ghi ở `trang_thai.md` (A17, A18).
- `npm test`, `node kiem_tra_truoc_khi_giao.js --day-du`, `node tu_chay/cong.js tinh` + `KHONG_TRINH_DUYET=1 … chay` → ghi kết quả + `HEAD ĐÃ KIỂM` vào
  `trang_thai.md` TRƯỚC `/ra-soat`; `/security-review` nhánh.

## 2. Ngân sách
| Phần | File | Dòng ước |
|---|---|---|
| A1 | `thiet_ke/HOP_DONG_API_KH.md` | chép (0 tay) |
| A2 | `src/kiemKhop/canTuPos.js` | +5 |
| B | `src/datDon.js` | +12 / −6 |
| B2 | `src/pages/ThanhToan.jsx` | +5 / −2 |
| C | `src/datDon.js`, `src/pages/TheoDoiDon.jsx` | +6 / −3 |
| D4 | `src/datDon.js` | +3 / −2 |
| F | `src/components/PinSheet.jsx`, `src/giaoDien/giaoDien.css` | +12 / −6 |
| **App** | 6 file | **~45 thêm** (ngân sách 170) |
| Thử | `thu_KHMUA1c.js` mới ~300; `thu_KHMUA1.js` ~10; `thu_KHMUA1b.js` ~20; `dot_bien.py` ~40 | **~370** (ngân sách 420) |

## 3. Ca thử ↔ nghiệm thu (1-1). P = hàm thuần (chạy cả `KHONG_TRINH_DUYET=1`), C = Chromium + POS giả v9
| Nghiệm thu | Ca | Loại | Đỏ trên gốc vì |
|---|---|---|---|
| A1 | `HOP_DONG_API_KH.md` trùng byte `viec/KH-MUA-1c/hop_dong_v9.md` (Buffer.equals) | P | gốc là v5 |
| A2 | `CAN_TU_POS` có mục `GET /don/:ma` chứa `don.cach_tra/giu_vi/con_lai/hoa_don[].loai`, `GET /don` chứa `data[].cach_tra…`, `GET /chuong-trinh` (`co:true`, `token:false`), `GET /toi` chứa `khach.ngay_sinh`; mọi trường khai đều nằm trong `tra` của khối máy đọc v9 | P | gốc không khai |
| A2 | `thu_KHKHOP1.js` xanh (chạy sẵn) | — | (hồi quy) |
| B1 | `loaiLoi(409 KHO_BAN) === 'gui_lai'`; 5xx `DANG_XU_LY`/`PAYOS_LOI`/`LOI_MAY_CHU`, status 0, 4xx không code, 200 thiếu mã → `gui_lai`; 401 → `dung` | P | gốc KHO_BAN = chua_tao |
| B1 | `guiDonAnToan` với KHO_BAN ×5 rồi đơn: 6 lần gửi, MỌI lần cùng đối tượng thân (cùng `khoa_gui`, JSON như nhau), trả đơn | P | gốc ném sau lần 1 |
| B1 | KHO_BAN mãi: đúng 1 + 30 lần rồi ném `KHONG_BIET`; chờ 2000 ms mỗi lần | P | gốc 1 lần |
| B1 | 401: ném `KHONG_BIET` sau 1 lần, không chờ | P | (hồi quy vòng 4) |
| B1 | Màn: POS trả KHO_BAN 2 lần rồi đơn → 3 POST cùng khoá + thân, sang Theo dõi đơn, bản ghi có `ma_don` | C | gốc dừng + xoá bản ghi |
| B1/B4 | Màn: KHO_BAN mãi → hết lượt: khối "Lần đặt trước chưa rõ kết quả", bản ghi GIỮ, nút đặt khoá, "Gửi lại đúng đơn này" gửi CÙNG khoá | C | gốc xoá bản ghi + mở nút |
| B1 | Tĩnh: `src/datDon.js` chỉ một chỗ nêu `KHO_BAN`/`DANG_XU_LY`/`401` (bảng mã), `guiDonAnToan` không so `status === 401` | P | gốc rải |
| B2 | `loaiLoi(409 KHOA_GUI_DA_DUNG) === 'dung'`; `guiDonAnToan` ném `{code:'KHONG_BIET', goc:'KHOA_GUI_DA_DUNG'}` sau 1 lần | P | gốc chua_tao |
| B2 | Màn: gửi lại → 409 KHOA_GUI_DA_DUNG: hiện "Đơn này có thể đã đặt trước đó — mời bạn xem Lịch sử đơn", có "Xem Lịch sử đơn" + "Bỏ qua, đặt đơn mới", KHÔNG "Gửi lại đúng đơn này", KHÔNG "Vui lòng đặt lại", bản ghi GIỮ (`da_dung`); tải lại vẫn khối đó; bấm "Bỏ qua" → bản ghi xoá, nút đặt mở | C | gốc xoá + "Vui lòng đặt lại" |
| B3 | `loaiLoi` 400 `PIN_SAI`/`VI_KHONG_DU`/`GIA_DA_DOI`/`HET_HANG`/`NGOAI_GIO`, 429 `QUA_NHIEU_LAN`, 409 `DON_KHONG_HOP_LE` → `chua_tao` | P | (K5, xanh cả gốc — đối chứng) |
| C1 | `docDon` đọc `cachTra/giuVi/conLai`; thiếu trường → `undefined`; `null` → `null`; số lạ (chuỗi) → `null` | P | gốc không đọc |
| C1 | Màn: KHÔNG có `kh_don_gui` (máy khác), POS trả `cach_tra:'vi_qr', giu_vi:30000, con_lai:51000` → dòng "Đã giữ 30.000đ trong ví · quét QR 51.000đ" + số cạnh QR 51.000đ | C | gốc ẩn |
| C1 | Màn: bản ghi máy ghi số KHÁC POS (giu_vi 1000) → hiện số POS | C | gốc hiện số máy |
| C1 | Màn: POS cũ không trường, bản ghi có → vẫn hiện từ bản ghi (như nay) | C | (hồi quy) |
| C2 | Màn: POS `cach_tra:null` (đơn quầy) + có bản ghi trùng mã → không dòng ví | C | gốc hiện từ bản ghi |
| C2 | Tĩnh: `TheoDoiDon.jsx` không có `-`/`+` giữa `giu_vi`/`con_lai`/`tong` | P | (canh) |
| C3 | Tĩnh: không còn "máy khác) → không biết" trong `TheoDoiDon.jsx` | P | gốc có |
| D1 | Màn: bật ví → bảng PIN mở; báo giá POS đổi thành lỗi (giỏ đổi ở tab khác qua `kh_gio` + sự kiện storage, hoặc `dungBaoGia` hỏi lại lỗi) → nhập PIN + Xác nhận → KHÔNG POST /don, bảng đóng | C | ca mới; đột biến `BV-DIEM-GUI-BAO-GIA` bỏ ĐÚNG `|| !bg` phải bắt |
| D2 | Màn: "Gửi lại đúng đơn này" (vi) → POS `PIN_DANG_KHOA` → bảng PIN còn, lời POS, bản ghi GIỮ cùng khoá | C | đột biến `VS-PIN-DANG-KHOA-XOA` |
| D3 | Màn: 401 → bản ghi giữ → đăng nhập khách KHÁC (`/toi` sdt khác, kho thường) → `kh_don_gui` bị xoá | C | đột biến `BV-…` không cần (đã có `BV-QUEN-BO-NHO-KHI-DOI-KHACH` của 1b chỉ bộ nhớ); thêm `VS-DOI-KHACH-GIU-DON` bỏ `KHOA_DON_GUI` khỏi `KHOA_DU_LIEU` |
| D4 | P: kho giả `setItem` ném → ghi X (false) → kho có Y (tab khác) → `docGuiDo()` = Y; kho rỗng → X; kho chặn hẳn (`getItem` ném) → X | P | gốc ra X ở ca đầu |
| D5 | Màn K5: QR một lần (1 POST); ví đủ + PIN đúng + Xác nhận (1 POST); ví + QR (1 POST, `cach_tra vi_qr`); `GIA_DA_DOI` → bấm lại được, khoá MỚI; 4xx `HET_HANG` → bản ghi xoá | C | (đối chứng, xanh gốc phần không PIN) |
| F1 | Màn 360/390/430: mọi nút `.pin-pad` |tâm chữ − tâm nút| ≤ 1px (ngang + dọc, đo `Range.getBoundingClientRect`); `.pin-pad` giữa `.panel` ±1px | C | gốc lệch trái |
| F2 | hàng cuối đúng thứ tự "Xoá", "0", "Xác nhận"; Xác nhận `disabled` khi < 4 số | C | gốc `<span/>·0·Xoá` |
| F2 | đủ 4 số, chờ 1 s, KHÔNG bấm → 0 POST /don | C | gốc tự gửi |
| F2 | 3 số + bấm Xác nhận (ép `click({force})`) và Enter → 0 POST | C | (canh) |
| F2 | 4 số → Xoá → còn 3 chấm `on` (không 0) | C | đột biến `VS-PIN-XOA-HET` |
| F2 | Enter khi đủ 4 số → gửi; Backspace lùi một số | C | gốc không có Enter |
| F3 | Đặt PIN (`moDatPin`): 4 số + Xác nhận → tiêu đề "Nhập lại mã PIN mới"; 4 số + Xác nhận → `PUT /pin {pin, pin_lai}` một lần → "Đã lưu mã PIN" | C | gốc tự chuyển |
| F4 | đang gửi (POS giả trễ): Xác nhận `disabled` + chữ "Đang gửi…"; POS `PIN_SAI` → lời nguyên văn + 0 chấm; kho không có chuỗi PIN | C | gốc không có nút |
| F5 | `thu_KHMUA1.js`, `thu_KHMUA1b.js` sửa theo hành vi mới; đột biến `VS-PIN-TU-GUI` (đưa lại tự gửi) làm các ca F2 đỏ | C | — |
| F6 | ảnh + `doi_chieu_demo.md` (không phải bài thử; kiểm bằng mắt + có file) | — | — |
| E1–E3 | các lệnh mục E | — | — |

Ca hai người cùng bấm (đụng tiền): `thu_KHMUA1b.js` đã có ca hai tab (`:533–547`) — chạy lại với `nhapPin` mới; thêm một ca KHO_BAN: tab 1 đang tự gửi lại
(KHO_BAN) thì tab 2 mở Thanh toán → thấy "chưa rõ", nút khoá (bản ghi ghi TRƯỚC lần gửi đầu, không bị xoá giữa chừng).

## 4. Đường song song phải canh
- Bốn đường gửi `POST /don` (lần đầu, tự gửi lại, "Gửi lại đúng đơn này" qr, "Gửi lại" có PIN) — tất cả qua `guiDonAnToan` (grep `datDonApp` ở `src/`: chỉ `datDon.js`).
- Mọi chỗ `ghiGuiDo(null)`: `ThanhToan.jsx:114, :115, :127`, `App.jsx` đăng xuất, `luuMay` — kiểm không đường nào xoá khi KHO_BAN / KHOA_GUI_DA_DUNG / 401.
- Mọi chỗ đọc `kh_don_gui`: `ThanhToan` (vẽ + điểm gửi), `TheoDoiDon` (`banGhiCuaDon`), `luuMay`. D4 đổi `docGuiDo` → cả ba theo.
- Lịch sử đơn `Don.jsx` đọc `GET /don` — không dùng `cach_tra` (không đổi).
- Hai chế độ `PinSheet` (trả ví từ `ThanhToan`, đặt PIN từ `ThanhToan` `moDatPin` + `HoSo`/`TaiKhoan` nếu có — grep `PinSheet` lúc làm).
- K5 — không chặn oan: QR, ví, ví+QR, `GIA_DA_DOI` bấm lại, 4xx thường xoá bản ghi, `CHUA_MO` (công tắc tắt) vẫn `chua_tao`.

## 5. Rủi ro
- POS thật chưa dựng v7 → `cach_tra` thiếu → rơi về bản ghi (như nay); không vỡ.
- `KHO_BAN` 30 lượt ≈ 1 phút nút "Mạng chậm, đang gửi lại…" — đúng hợp đồng dòng 116 ("gửi lại cùng khoá").
- Đổi tên giá trị `loaiLoi` → bài cũ so `'khong_biet'` phải sửa cùng lúc (đã tính ở E).

## 6. Soát kế hoạch (agent phụ, chỉ đọc) và phần CHỈNH — mục này THẮNG các mục trên khi lệch
Kết quả soát (tóm tắt): (1) không ra ngoài Phạm vi / Cấm; (2) ngắn hơn: giữ tên `khong_biet`, bớt đột biến thừa; (3) thiếu ca F3 ở `HoSo.jsx:108`, ca "hai lần
không khớp", D1/D5 phần PIN đỏ trên gốc vì thiếu nút Xác nhận (chỉ đột biến chứng minh), `VS-GIU-VI-TU-TINH` sống nếu số POS tự khớp, F1 chỉ Chromium;
(4) sót `App.jsx:169` `daTra` (đọc + ghi bản ghi), `TheoDoiDon.jsx:12–14` chú thích; logic: **KHO_BAN 30 lượt đụng trần 10 lần / 10 phút (hợp đồng v9 dòng 99–100:
409 KHO_BAN CÓ tính lượt) → 429 `QUA_NHIEU_LAN` → `chua_tao` → xoá bản ghi → khoá mới** (đường đơn thứ hai); Enter trên nút đang chạm; `cach_tra` lạ.

Chỉnh:
1. **Luật "4xx đến SAU một lần chưa rõ" (đụng tiền — XIN CHỦ QUÁN DUYỆT cùng kế hoạch).** Trong MỘT chuỗi `guiDonAnToan`, đã có ít nhất một trả lời "chưa rõ" mà lần sau
   POS trả 4xx có code (`chua_tao`) → KHÔNG tin là chưa tạo: ném `{ code: 'KHONG_BIET', goc }`, GIỮ bản ghi, khối "Lần đặt trước chưa rõ kết quả" + "Gửi lại đúng đơn này".
   Lý do: chuỗi đã có lần POS có thể đã chạy dở (KHO_BAN sau `chotPhien`); 4xx sau đó (429 trần lượt, …) không chứng minh chưa tạo. Theo thứ tự POS (tra khoá → lượt → …)
   thì nếu đơn đã tạo POS trả `trung` trước 429, nhưng App không đọc được code POS (K1) → chọn hướng an toàn; giá: khách hiếm khi phải bấm "Gửi lại" thêm một lần.
   Ngoại lệ giữ nguyên: lần gửi ĐẦU của chuỗi trả 4xx có code → `chua_tao` như B3 (không đổi luồng PIN sai / giá đổi / hết hàng lần đầu). Lần "Gửi lại đúng đơn này"
   là chuỗi mới: PIN_SAI / PIN_DANG_KHOA vẫn giữ bản ghi như vòng 4; `GIA_DA_DOI` vẫn xoá ("đơn đó chưa tạo") như nay.
   Kèm: `LUOT_LAU.KHO_BAN = 8` (1 + 8 = 9 lần ≈ 16 giây, dưới trần 10) — `DANG_XU_LY` giữ 30 (hợp đồng: không tính lượt). Ca thử P: KHO_BAN ×3 rồi 429 → `KHONG_BIET`
   (gốc: ném 429 ngay lần 1 vì KHO_BAN = chua_tao); 5xx rồi `PIN_SAI` → `KHONG_BIET`; ca C: KHO_BAN ×2 rồi 429 → bản ghi GIỮ, nút khoá. Đột biến `VS-KHO-BAN-429-CHUA-TAO`.
2. Giữ tên `'khong_biet'`, thêm giá trị thứ ba `'dung'` (401, `KHOA_GUI_DA_DUNG`): bài cũ chỉ sửa `thu_KHMUA1.js:117` (KHO_BAN) và `thu_KHMUA1b.js:85` (KHOA_GUI_DA_DUNG) + ca D1 `:448`.
3. `docDon`: `cach_tra` không thuộc `qr|vi|vi_qr` và không `undefined` → `null` (không dòng ví). Ca P.
4. `VS-GIU-VI-TU-TINH` = tự tính giữ ví từ số dư `/toi` (`Math.min(so_du_vi, tong)`); ca C1 cho `/toi.so_du_vi` KHÁC `giu_vi` POS (khách đã tiêu ví sau đặt) → bắt.
   Thêm ca C1 số POS `giu_vi + con_lai = tong` đúng thật, và mọi số hiện ra phải đúng nguyên số POS.
5. F2 Enter: `e.preventDefault()` trước `xacNhan` (không kích hoạt nút số đang chạm). Ca C: focus nút "5", 3 số, Enter → vẫn 3 chấm, 0 POST.
6. F3 thêm ca: Hồ sơ (`HoSo.jsx:108`) mở bảng đặt PIN → hai lần + Xác nhận → `PUT /pin` một lần; hai lần KHÔNG khớp → "Hai lần nhập không khớp, đặt lại nhé", 0 `PUT`.
7. D1/D5 phần có PIN: ghi rõ trong `bang_chung_do.txt` — đỏ trên gốc vì chưa có nút Xác nhận; vế `!bg` chứng minh bằng `BV-DIEM-GUI-BAO-GIA`.
8. Đường song song thêm: `App.jsx:169` `daTra` → `banGhiCuaDon` + `ghiGuiDo({...g, xong:true})` — D4 đổi `docGuiDo`: ca P "ghi `xong` hỏng (kho đầy) vẫn đọc được".
   C3 sửa cả chú thích `TheoDoiDon.jsx:12–14`; `api.js:73` "hợp đồng v5" → v9 (chú thích).
9. `chuong_trinh` khai `co: true` KHÔNG `moi` (cửa mới, không phải trường mới trên cửa cũ — `canTuPos.js:3`); POS chưa dựng thì /kiemkhop báo lỗi gọi, đúng nghĩa.
10. `thu_KHUI3b.js` không dùng bảng PIN (grep chỉ `:350` chữ "PIN" ở Tài khoản) → không sửa.
11. Đột biến bớt còn 13: `VS-KHO-BAN-CHUA-TAO`, `VS-KHO-BAN-KHOA-MOI`, `VS-KHO-BAN-THAN-KHAC`, `VS-KHO-BAN-429-CHUA-TAO`, `VS-KHOA-DA-DUNG-XOA`, `VS-GIU-VI-TU-TINH`,
    `VS-GIU-VI-BAN-GHI-TRUOC`, `BV-DIEM-GUI-BAO-GIA`, `VS-401-CHUA-TAO`, `VS-PIN-DANG-KHOA-XOA`, `BV-GHI-HONG-DOC-KHO`, `VS-PIN-TU-GUI`, `VS-PIN-XOA-HET`.
12. CHƯA KIỂM được ở máy: WebKit / iPhone Safari thật, trình duyệt Zalo (môi trường chỉ có Chromium) — F1 đo Chromium + chủ quán thử tay E4 (3).
Ngân sách sau chỉnh: app ~50 dòng, thử ~390 dòng.
