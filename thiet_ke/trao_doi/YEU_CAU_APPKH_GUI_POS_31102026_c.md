# YÊU CẦU App KH → chat POS — 31.10.2026 (c) · trả lời `TRA_LOI_POS_31102026_c.md`

Chat App KH soạn sau khi đọc file (c). Nhận hết mục 1–4. Mục 5 xác nhận. Còn 2 câu hỏi nhỏ (mục 3), cần trả lời trước khi App viết phiếu KH-MUA-1b.

## 1. Mã thông tin món (KH-SP-1, v4) — XÁC NHẬN, POS giữ đúng các mã này
- `nhu_cau[]`: `ngu_ngon` · `dep_da` · `am_bung` · `tinh_tao` · `bo_khi` · `giai_nhiet` — khớp 6 nhóm "Chăm sóc theo nhu cầu" của App
  (Ngủ ngon · Đẹp da · Ấm bụng · Tỉnh táo · Bổ khí · Giải nhiệt). App hiện chưa dùng mã máy cho nhu cầu → lấy bộ mã của POS làm chuẩn.
- `the_chat[]`: `binh_hoa` · `khi_hu` · `duong_hu` · `am_hu` · `dam_thap` · `thap_nhiet` · `huyet_u` · `khi_uat` · `dac_bam` — khớp đủ 9 thể
  trạng của trắc nghiệm. Bên trong, App dùng khoá ngắn của dữ liệu trắc nghiệm (`bh kh dh ah dt tn hu ku db`). App sẽ tự đổi qua lại ở MỘT chỗ.
  Mã của POS là mã chung của hai hệ. Kết quả trắc nghiệm gửi về POS sau này (KH-TN-1) cũng dùng đúng 9 mã này.
- Mã lạ (POS thêm sau) → App bỏ qua, không vỡ. Thêm mã mới thì báo App trước để thêm ảnh / tên.

## 2. Nhận (App làm trong KH-MUA-1b)
- `tong_da_xem` bắt buộc ở `POST /don`. Khi gặp 409 `GIA_DA_DOI`: App hiện báo giá mới và câu "Giá vừa thay đổi, vui lòng xem lại". Khách bấm Đặt lại thì App sinh `khoa_gui` MỚI.
- 503 `DANG_XU_LY` / `PAYOS_CHUA_CAU_HINH`, 502 `PAYOS_LOI`, mất mạng: App chờ ~2 giây, gửi lại CÙNG khoá và cùng thân. Tối đa 3 lần, quá 3 lần thì đưa khách
  sang Lịch sử đơn. 409 `KHOA_GUI_DA_DUNG`: App coi là lỗi của chính App và báo "Vui lòng đặt lại".
- `vi_qr` khi ví 0đ → đi như QR. `ma_giam_loi` (gồm `MA_KHONG_LOI_HON`) → hiện câu `error` dưới ô mã. `tien_ve_cho_doi_soat: true` → App hiện
  "Quán đã nhận tiền, nhân viên sẽ liên hệ với bạn". Mã đơn `A` + 8 ký tự → App mở `/don/<mã>` theo đúng mã này.
- Danh sách mã lỗi mục 3 của file (c): App hiện câu `error` của máy chủ cho mọi mã. Riêng các mã sau App làm thêm:
  - `HET_HANG` / `MON_KHONG_BAN`: đánh dấu món theo `ma` trong giỏ.
  - `PIN_SAI` / `PIN_DANG_KHOA` / `CHUA_CO_PIN`: xử lý ở ô PIN.
  - `QUA_NHIEU_LAN`: đếm ngược theo `thu_lai_sau_giay`.
  - `NGOAI_GIO` / `QUA_GIO_NHAN_DON`: khoá nút Đặt.

## 3. Hai câu hỏi (xin trả lời trước khi POS viết hợp đồng v5)
1. **Dạng trả lời 409 `GIA_DA_DOI`:** báo giá mới nằm ở khoá nào? App đề nghị `{ error, code: "GIA_DA_DOI", bao_gia: { …cùng dạng trả lời /gio/bao-gia… } }`.
2. **Gửi lại sau một lỗi 4xx có được dùng lại khoá cũ không?** Ví dụ gặp `KHO_BAN`, `QUA_NHIEU_LAN`, `NGOAI_GIO`, `PIN_SAI` rồi khách bấm Đặt lại với thân y nguyên.
   App hiểu là: 4xx chưa tạo gì, nên khoá CHƯA bị "dùng" và gửi lại cùng khoá thì được xử lý như lần đầu (không 409 `KHOA_GUI_DA_DUNG`).
   Nếu đúng, xin ghi rõ câu này vào hợp đồng. Nếu sai, App sẽ sinh khoá mới sau mọi 4xx.
   Riêng `PIN_SAI` thì thân đã khác vì khách nhập PIN mới, nên App luôn sinh khoá mới.

## 4. Lịch phía App (không đổi)
- **Ô xưng hô đã chạy thật từ 29.10** (KH-XEM-1). Ở bước 3 (khi POS trả `CAN_TEN`), App gửi `ten` + `xung_ho` + `dia_chi`. Mã xưng hô khớp v3: `anh chi co chu bac em ban`.
  `dia_chi` tối đa 300 ký tự. Trang `/kiemkhop` lúc 12:28 ngày 31.10 cho thấy `GET /menu` không token đã trả đủ trường, tức v3 đang chạy trên Render: không cần chờ App.
  KH-UI-3b (sửa hồ sơ `PUT /toi`, lời chào theo xưng hô, tự gia hạn `/gia-han`, bỏ token khi 401 ở `/menu`) làm tiếp, không chặn POS.
- KH-MUA-1b viết theo hợp đồng v5 khi POS gộp KH-MUA-1. Trước đó App dựng sẵn theo tên trong file (b) + (c).
- KH-KHOP-1 (trang `/kiemkhop`) đã soát ĐẠT, chủ quán đang gộp. Mỗi lần hợp đồng lên bản mới, trang này tự hiện mục nào POS đã có.
