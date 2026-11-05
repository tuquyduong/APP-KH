# KH-SINH-1 — Ngày sinh nhập một lần (hợp đồng v9 CT-1a) + lời chào đủ tên như khách nhập + nút xoá món trong giỏ

<!-- Chat App KH soạn 05.11.2026. Việc THƯỜNG [Th], Sonnet — chạy thẳng tới hết. Hạn 07.11. Gồm KH-SINH-1 + phần đầu KH-BAO-1 (lời chào, xoá món —
     không đụng màn Thanh toán / Theo dõi đơn). CHẠY SONG SONG với KH-MUA-1c và KH-HD-1 — xem "Cấm".
     Quyết định áp dụng (thiet_ke/QUYET_DINH_APPKH.md): 02.11 "ô ngày sinh trong hồ sơ: nhập MỘT lần, khách không tự sửa, chỉ quán sửa sau khi xem căn cước,
     ghi 'Nhập đúng như căn cước — quán đối chiếu khi áp ưu đãi sinh nhật'"; 03.11 "Lời chào hiện ĐỦ TÊN đúng như khách nhập (vd 'LINH P' → 'Chào buổi
     trưa, anh LINH P!'), bỏ cách lấy chữ cuối"; 05.11 "Giỏ hàng có nút xoá món" (chủ quán thử trên iPhone: không biết cách xoá món khỏi giỏ).
     POS đã có (hợp đồng v9, main POS 4003ea3; chép nguyên văn — bản trong kho App còn v5 tới khi KH-MUA-1c gộp, KHÔNG chép file hợp đồng):
       `GET /toi` → `khach { sdt, ten, ngay_tao, xung_ho, dia_chi, ngay_sinh, qr, hang, so_du_vi }`; `PUT /toi` `{ ten?, xung_ho?, dia_chi?, ngay_sinh? }`.
       "- `khach.ngay_sinh` (của `/toi`, `PUT /toi`, xác minh): `YYYY-MM-DD` hoặc `null` khi chưa nhập. Là NGÀY LỊCH, không có giờ / múi giờ.
        - **`PUT /toi` nhận `ngay_sinh` MỘT lần:** chỉ khi đang `null`. Đã có → 409 `NGAY_SINH_DA_CO` (kể cả gửi lại cùng giá trị); không phải chuỗi
          `YYYY-MM-DD` đúng lịch (kể cả `null`, rỗng), ở tương lai, hoặc tuổi hôm nay ngoài khoảng quán đặt (mặc định 5–100, quán đổi được) → 400
          `NGAY_SINH_SAI`. Từ chối thì KHÔNG trường nào trong cùng thân được sửa. Sau khi nhập, App không sửa được nữa — khách đưa căn cước cho nhân
          viên, chỉ quán sửa ở POS. POS không lưu số căn cước."
       Mã lỗi v9: `NGAY_SINH_SAI` 400 · `NGAY_SINH_DA_CO` 409. -->

## Mục tiêu
Khách tự nhập ngày sinh (một lần) để quán áp ưu đãi sinh nhật; Trang chủ chào đúng tên khách gõ; khách xoá được món trong giỏ bằng một nút rõ ràng.

## Nghiệm thu

### A. Ngày sinh — màn Thông tin cá nhân (`src/pages/HoSo.jsx`)
- A1 Thẻ "Ngày sinh" (khuôn `card pf-card` như các thẻ hiện có), đặt sau thẻ Thông tin.
- A2 `ngay_sinh` là `null` → ô chọn ngày (ngày / tháng / năm — kiểu dễ bấm trên iPhone + trình duyệt Zalo; `<input type="date">` hoặc 3 ô chọn, kế hoạch chọn
  cách đơn giản chạy đều), dòng nhỏ **"Nhập đúng như căn cước — quán đối chiếu khi áp ưu đãi sinh nhật. Chỉ nhập được một lần."**, nút "Lưu".
  Bấm Lưu → hỏi lại một lần: "Ngày sinh 12/03/1990 — sau khi lưu bạn không tự sửa được. Lưu?" → "Lưu" / "Sửa lại".
- A3 Gửi `suaHoSo({ ngay_sinh })` RIÊNG (không gộp khoá khác — POS từ chối cả thân). Thành công → hiện ngày đã lưu, cập nhật kho `/toi` như các thẻ khác (`gopToi`).
- A4 Lỗi: `NGAY_SINH_SAI` → hiện nguyên lời POS, giữ ô cho nhập lại; `NGAY_SINH_DA_CO` → đọc lại `/toi`, hiện ngày POS đang giữ; lỗi khác như các thẻ khác.
- A5 Đã có `ngay_sinh` → chỉ hiện "dd/mm/yyyy" + dòng nhỏ "Cần sửa? Mang căn cước đến quầy để nhân viên sửa." — không có ô sửa.
- A6 Ngày lịch: đọc / hiện bằng tách chuỗi `YYYY-MM-DD` (KHÔNG `new Date(chuỗi)` — CLAUDE.md §6). Không chặn tuổi ở App (POS chặn) ngoài việc không cho chọn ngày tương lai.
- A7 Ngày sinh KHÔNG lưu trên máy (không thêm vào bản tóm tắt `tomTatLuu.js`).
- A8 Bỏ chữ "ngày sinh" khỏi danh sách "Bỏ" ở chú thích đầu `HoSo.jsx`.

### B. Lời chào đủ tên (`src/dinhDang.js`)
- B1 `chiaLoiChao` dùng ĐỦ tên khách nhập (cắt khoảng trắng hai đầu, gộp khoảng trắng thừa), GIỮ nguyên hoa / thường như khách gõ: "LINH P" → "Chào buổi
  trưa, anh LINH P!"; "Phạm Thị Linh" → "…, chị Phạm Thị Linh!". Các luật khác của 31.10 giữ nguyên (xưng hô chữ thường giữa câu, luôn có "!", chưa có
  giờ / xưng hô / tên thì bỏ phần đó, chưa đăng nhập "Chào bạn!").
- B2 Tên rất dài không làm vỡ dòng chào ở 360 px (xuống dòng / cắt "…" theo CSS sẵn có của khối chào).
- B3 `tenNgan` không còn chỗ nào dùng → xoá (không để code chết); còn chỗ dùng thì kế hoạch nêu.
- B4 Bài thử cũ đang khoá "lấy chữ cuối" (`thu_KHUI2.js`, `thu_KHUI3b.js`, `thu_KHUI3d.js`, `thu_KHLUU1.js` — máy grep lại) → sửa theo hành vi mới (chủ quán
  đã duyệt đổi 03.11 → bài sửa thường: đỏ trên gốc / xanh trên mới, ghi `SỐ CA`; KHÔNG dùng `## Bài thử cũ sửa`).

### C. Nút xoá món trong giỏ (`src/pages/GioHang.jsx`)
- C1 Mỗi dòng giỏ có nút xoá rõ ràng (biểu tượng `close` có sẵn trong bộ demo, `aria-label="Xoá món"`), đặt sao cho không chạm nhầm với −/+ (kế hoạch nêu vị trí;
  ảnh 3 cỡ màn).
- C2 Bấm → xoá dòng ngay, hiện thông báo "Đã xoá <tên món> · Hoàn tác" khoảng 5 giây; bấm Hoàn tác → trả đúng dòng (món, số lượng, ghi chú) về đúng chỗ.
  Dùng lại khuôn thông báo sẵn có của App (vd thông báo "Đã thêm … vào giỏ") nếu được; không thêm thư viện.
- C3 "−" khi còn 1 vẫn xoá như nay. Giỏ trống → màn giỏ trống như nay. Giỏ chỉ lưu trên máy (`kh_gio`) — không đổi luật lưu.
- C4 CSS mới (nếu cần) ở file MỚI `src/giaoDien/gio_xoa.css`, `import` trong `GioHang.jsx` (KHÔNG sửa `main.jsx`, `giaoDien.css`, `demo*.css`). K9 xanh.

### D. Kiểm
- D1 Bài MỚI `cong_cu/thu_KHSINH1.js`: hàm thuần (lời chào đủ tên; tách / hiện ngày lịch) + Chromium với POS giả theo v9 (`/toi` có / không `ngay_sinh`;
  `PUT /toi` trả 200 / `NGAY_SINH_SAI` / `NGAY_SINH_DA_CO`; thân chỉ có `ngay_sinh`; xoá món + hoàn tác). `SỐ CA` theo `KHONG_TRINH_DUYET=1`.
- D2 Ảnh 360 / 390 / 430: Hồ sơ (chưa có / đã có ngày sinh, hộp hỏi lại), Trang chủ (tên dài), Giỏ (nút xoá, thông báo hoàn tác) → `viec/KH-SINH-1/so_anh/`;
  `doi_chieu_demo.md`.
- D3 `npm test`, `--day-du`, cổng `tinh` + `chay` (`KHONG_TRINH_DUYET=1`) ĐẠT, ghi vào `trang_thai.md` + "HEAD ĐÃ KIỂM" TRƯỚC `/ra-soat`.
- D4 Chủ quán thử tay: (1) Trang chủ chào "anh LINH P!"; (2) Hồ sơ nhập ngày sinh → lưu → không sửa được nữa; (3) Giỏ bấm xoá một món → Hoàn tác.

## Phạm vi
- viec/KH-SINH-1/**
- src/pages/HoSo.jsx
- src/dinhDang.js
- src/pages/TrangChu.jsx
- src/pages/GioHang.jsx
- src/gio.js
- src/App.jsx
- src/giaoDien/gio_xoa.css
- cong_cu/thu_KHSINH1.js
- cong_cu/thu_KHUI2.js
- cong_cu/thu_KHUI3b.js
- cong_cu/thu_KHUI3d.js
- cong_cu/thu_KHLUU1.js
- cong_cu/thu_KHNHANH1.js

## Ngân sách
~110 dòng app + ~300 dòng thử.
**Phương án đơn giản nhất đã xét:** thêm một thẻ vào Hồ sơ dùng lại `dungLuu` / `suaHoSo` sẵn có; lời chào đổi một hàm; nút xoá dùng lại `xoaDong` / `doiSoLuong`
và khuôn thông báo sẵn có. `src/App.jsx` chỉ được đụng nếu thông báo hoàn tác buộc phải đi qua chỗ thông báo chung (ghi rõ trong kế hoạch, sửa tối thiểu).

## Đổi cấu trúc DB
không

## Thư viện mới
không

## Cấm
- Chạy song song: KHÔNG sửa `src/api.js` (dùng `suaHoSo` sẵn có), `src/datDon.js`, `src/pages/ThanhToan.jsx`, `src/pages/TheoDoiDon.jsx`,
  `src/components/PinSheet.jsx`, `src/giaoDien/giaoDien.css`, `src/kiemKhop/**`, `thiet_ke/**`, `cong_cu/thu_KHMUA1*.js`, `cong_cu/thu_KHKHOP1.js` (KH-MUA-1c);
  `src/pages/Don.jsx`, `src/hoaDon.js`, `src/components/HoaDonKhach.jsx` (KH-HD-1); `src/main.jsx`. Cần sửa ngoài Phạm vi → `## Câu hỏi`, dừng.
- KHÔNG sửa `tu_chay/`, `.claude/`, `.github/`, `TIEN_DO_APPKH.json`, `LUAT_XAY_APP.md`, `CLAUDE.md`, `kiem_tra_truoc_khi_giao.js`, `src/package.json`, `index.html`.
- KHÔNG làm chương trình đặc biệt / hạng (KH-CT-1), báo đơn xong / Thanh toán (KH-BAO-1b).
- Chỉ push `git push -u origin viec/KH-SINH-1`. Không đụng `main`, không merge, không tạo PR.

## Trả lời Câu hỏi 1 (chủ quán duyệt 05.11, chat App KH soạn)
- ĐỒNG Ý thêm `cong_cu/thu_KHNHANH1.js` vào Phạm vi — CHỈ để sửa ca "D3 Trang chủ chào theo xưng hô vừa lưu" (dòng ~492) theo lời chào đủ tên:
  regex `/cô Linh/` → `/cô Nguyễn Linh!/` (đủ tên POS giả "Nguyễn Linh"). Đây là bài sửa thường như B4: ca mới ĐỎ trên gốc (gốc chào "cô Linh!") / XANH trên mới,
  ghi `SỐ CA thu_KHNHANH1.js` vào `bang_chung_do.txt`; KHÔNG dùng `## Bài thử cũ sửa`.
- KHÔNG sửa dòng nào khác của `thu_KHNHANH1.js`: việc KH-TT-1 đang chạy song song sửa đoạn ví ở Thanh toán (~dòng 394–406) của cùng file — hai chỗ cách xa, gộp không vướng.
- Sau đó làm tiếp bước 6 trở đi như phiếu (npm test, `--day-du`, cổng `tinh` + `chay`, HEAD ĐÃ KIỂM, `/ra-soat`, báo cáo 7 mục).
