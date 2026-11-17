# KH-NAP-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (16.11.2026)
- Nhánh: viec/KH-NAP-1 · cây sạch · HEAD d6f0f88 = FETCH_HEAD d6f0f88 (không kéo, đã bằng nhau)
- git log --oneline -3:
  - d6f0f88 PHIEU: KH-NAP-1
  - e7c4f0e TIEN-DO: KH-THE-3 xong (PR #42); mo KH-NAP-1 + KH-VC-2 song song (Opus, thiet ke chu quan duyet 16.11); KH-DOI-1 cho hop dong POS viet truoc; hop dong /api/kh v17 + 4 bai thu thoi ghim v16; quyet dinh 16.11 (b); thu POS 16.11; ban giao
  - c8146cd Merge pull request #42 from tuquyduong/viec/KH-THE-3

## Tiến độ
- Bước 3: kế hoạch ở `ke_hoach.md` — phiếu dặn "Chờ duyệt kế hoạch" → DỪNG chờ chủ quán gõ "duyệt".
- Agent soát kế hoạch (chỉ đọc, 16.11): CẦN SỬA 3 ý — (1) truyền prop mở Ví phải sửa dòng cũ App.jsx + chữ ký UuDai/UuDaiToi → thành Câu hỏi 4;
  (2) `tenGui` ở khối "chưa rõ" của ThanhToan sẽ hiện "undefined" cho dòng nạp → thêm vào Đường song song + ca B4; (3) thiếu ca NAP_KHONG_GOP,
  NAP_CHI_TIEN_MAT_QR, tiền về muộn (B5), dòng C7 → đã thêm. Kế hoạch đã sửa theo cả 3.

## Câu hỏi
Bốn câu ở đầu `ke_hoach.md` (mục "Câu hỏi"): (1) thêm `src/pages/KiemKhop.jsx` vào Phạm vi (thu_KHKHOP1.js dòng 55–58 đòi trang kiểm khớp gọi mọi cửa GET
`co: true`); (2) nút "Đặt lại" ở Lịch sử đơn với đơn nạp — `GET /don` không có trường nhận biết đơn nạp; (3) đổi điều kiện dòng `tuy` của ThanhToan.jsx
(giá trị đồ uống giữ nguyên); (4) thêm prop mở Ví vào các dòng cũ của App.jsx + chữ ký UuDai/UuDaiToi.
→ ĐÃ TRẢ LỜI: chủ quán duyệt cả 4 (phiếu, mục "Chủ quán duyệt kế hoạch", commit b62c23d). Không còn câu hỏi mở.

## Chủ quán duyệt kế hoạch (16.11 tối) — b62c23d
Kéo về đủ (hook mở phiên: 4b417b8 → b62c23d). Đồng ý cả 4 câu → chạy thẳng từ bước 4 (17.11).

## Phát hiện
- (Câu 2, chủ quán 16.11) `GET /don` (danh sách) không có trường nhận biết đơn nạp → nút "Đặt lại" vẫn hiện ở đơn nạp trong Lịch sử đơn; bấm → câu sẵn có
  `app.donRong` "Đơn này không có món để đặt lại" (ca thử ở thu_KHNAP1). Muốn ẩn hẳn nút cần POS thêm trường (vd `data[].chi_nap`) — chat gom sau.
- Màu (B6): mẫu `mau_de_xuat.js` dùng màu ngoài demo (`#D0688F`, `#2F6B3A`, `#E4F2E6`, `#FBE7EE`, `#D9C3CC`, `#F0C9D7`, `rgba(178,61,107,.16)`…) → máy thay bằng
  biến demo (`--pink-deep`, `--forest`, `--pink-dark`, `--mint`, `--mint-dark`, `--line`, `--cream`, `--ink`); ô số dư = chuyển sắc `--pink-deep → --forest`.
  Chi tiết từng khối ở `doi_chieu_demo.md`. Nền ô biểu tượng / nhãn thưởng dùng `color-mix(--mint, --white)` (máy cũ → `--cream` / `--mint`).
- `index.html` chưa có `<symbol id="i-wallet">` / `m-wallet` của demo (ngoài phạm vi) → biểu tượng ví vẽ thẳng qua `IcoVe` (chép nguyên symbol demo vào `BieuTuong.jsx`).

## Chỗ vá → đột biến (`viec/KH-NAP-1/dot_bien_tay.js` — việc chỉ đổi src/, không server/ client/src/ → không dot_bien.py, như KH-THE-1/2)
| Chỗ vá | Đột biến |
|---|---|
| datDon `dongGui` nhánh nạp | VS-DONG-NAP-GUI-KEM-SO-LUONG |
| datDon `dungViCho` loại nạp | BV-NAP-CHO-TRA-VI |
| gio `coDoUong` loại nạp (đặt mọi giờ) | BV-GIO-CHI-NAP-BI-CHAN-NGOAI-GIO |
| api `CUA_CONG_KHAI` thêm `/goi-nap` | BV-GOI-NAP-GUI-KEM-TOKEN |
| viTien `thuongGoi` / nhãn thưởng | VS-THUONG-GOI-TU-TINH-KHAC · VS-NHAN-THUONG-KHI-VAO-BANG-TRA |
| datDon `thamTaoMaMoi` nhánh nạp | BV-TAO-MA-MOI-NAP-VE-GIO |
| datDon `monDatLai` bỏ dòng nạp | BV-DAT-LAI-DEM-DONG-NAP |
| datDon `buocTienTrinh` chiNap | BV-DON-NAP-4-BUOC |
| TheoDoiDon `DaNap` số từ /vi | VS-DA-NAP-LAY-SO-TU-GOI |
| ViTien / UuDai nút Nạp chỉ khi có gói | BV-NUT-NAP-HIEN-KHI-KHONG-GOI |
| ThanhToan `tuy` = KHONG_MA cho nạp | BV-THANH-TOAN-NAP-GUI-MA-GIAM |
| ThanhToan `coThe` đối chiếu /goi-nap | BV-GOI-KHONG-CON-VAN-BAO-GIA |

`node viec/KH-NAP-1/dot_bien_tay.js --trinh-duyet` → 13/13 "✓ BẮT ĐƯỢC" · "TẤT CẢ ĐỘT BIẾN BỊ BẮT".

## Phần trình duyệt (Chromium thật ở máy làm việc — GitHub không có, CLAUDE.md §9)
`node cong_cu/thu_KHNAP1.js` → 122 đạt · 0 hỏng. `KHONG_TRINH_DUYET=1` → 41 đạt · 0 hỏng (= `SỐ CA thu_KHNAP1: 41` trong bang_chung_do.txt).
