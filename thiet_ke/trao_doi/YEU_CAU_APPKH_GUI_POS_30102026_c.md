# Yêu cầu App KH gửi chat POS — 30.10.2026 (c)

<!-- Chat App KH soạn sau khi chủ quán chốt 30.10 (đối chiếu tính năng App KH ↔ POS). Chủ quán chuyển sang chat POS. POS đáp bằng TRA_LOI_POS_<ngày>.md.
     Đã nhận TRA_LOI_POS_30102026_c.md: dạng giờ Giờ vàng, GIOVANG-1 (gia_mon), địa chỉ www — App KH làm theo, không hỏi lại. -->

## 0. Chủ quán chốt 30.10 (để POS ghi vào sổ quyết định chung)
1. **Chỉ 3 thứ cần đăng nhập** ở App KH: tiện ích Kế hoạch, trắc nghiệm thể chất, tích điểm (điểm, voucher, nhận mã bill / nhận điểm).
   Mọi thứ khác mở cho khách vãng lai: toàn bộ menu, combo, ưu đãi, Giờ vàng, **giá của từng hạng**.
2. App KH luôn đọc từ POS mọi thứ khách cần để đặt hàng trong giờ hoạt động (món, giá, giá hạng, tồn, Giờ vàng, giờ mở cửa). Ngoài giờ: xem được, không đặt được; POS chặn (như 28.10).
3. **Chia cài đặt:** sai thì mất tiền → POS; chỉ là hiển thị → phần nội dung của App KH. Riêng thông tin NGẮN của món (để nhân viên dùng ở quầy) để ở POS, App KH đọc lại.
4. "Bán chạy nhất" là danh sách chủ quán tự chọn, tự đặt tên, nằm ở App KH — **POS không cần đếm số ly**. "Ưu đãi nhiều nhất" App KH xếp theo số tiền giảm POS gửi.
5. Khách có **nhiều địa chỉ** (Nhà, Văn phòng…), một địa chỉ mặc định.
6. Trắc nghiệm: làm xong, trước khi hiện kết quả, App hỏi khách có chia sẻ kết quả với Tứ Quý Đường không. Đồng ý hay không đều xem kết quả + món gợi ý như nhau;
   chỉ khi đồng ý mới gửi kết quả rút gọn về POS, lưu trong hồ sơ khách và hiện trong chi tiết khách ở POS.

## 1. Xác nhận nhỏ về v3 (KH-API-3)
- `/menu` không token trả **đủ `gia_hang[]` của mọi hạng đang bật** (như `TRA_LOI_POS_29102026.md` mục 2) — App KH dựa vào đây để khách vãng lai xem giá từng hạng. Xin giữ đúng vậy.

## 2. Việc mới A — Thông tin ngắn của món trong màn Sản phẩm (xin trước khai trương 07.11 nếu kịp; muộn nhất ngay sau)
Ở màn sửa sản phẩm POS, thêm ô (đều tuỳ chọn):
| Ô | Dạng | Ghi chú |
|---|---|---|
| Ảnh món | 1 ảnh, vuông | Lưu ở chỗ BỀN (máy Render khởi động lại không mất) — POS chọn chỗ; App KH chỉ cần một địa chỉ ảnh `https`. Gợi ý ≥ 640×640, nén webp |
| Nhóm nhu cầu | chọn nhiều trong 6 mã | `ngu` Ngủ ngon · `da` Đẹp da · `am` Ấm bụng · `tinh` Tỉnh táo · `bo` Bổ khí · `nhiet` Giải nhiệt |
| Hợp thể chất | chọn nhiều trong 9 mã | `bh` Bình hoà · `kh` Khí hư · `dh` Dương hư · `ah` Âm hư · `dt` Đàm thấp · `tn` Thấp nhiệt · `hu` Huyết ứ · `ku` Khí uất · `db` Đặc bẩm |
| Mô tả ngắn | ≤ 160 ký tự | Nhân viên đọc cho khách |
| Công dụng | ≤ 160 ký tự | |
| Thành phần | ≤ 200 ký tự | |
- Ở quầy: hiện gọn trong khung món hoặc trong popup tuỳ chỉnh (đá, đường…) để nhân viên trả lời khi khách hỏi.
- `/menu` trả thêm cho mỗi món: `anh` (url | null), `nhu_cau[]` (mã), `the_chat[]` (mã), `mo_ta`, `cong_dung`, `thanh_phan` (chuỗi | null). Món chưa điền → `null` / `[]`.
- Mã nhu cầu / thể chất là danh sách cố định của App KH (theo demo); POS chỉ nhận đúng các mã trên (mã lạ → 400).
- App KH hiện tại đang ghi tạm nhu cầu 10 món trong code (`src/noiDung/mon.js`, theo `unique_id`); POS có ô này thì App KH bỏ bản tạm.

## 3. Việc mới B — Lưu kết quả trắc nghiệm (xin ngay sau v3)
- `PUT /trac-nghiem` (token) — thân rút gọn (~150 byte), ghi đè bản cũ (mỗi khách giữ bản mới nhất):
  `{ "phien_ban": 1, "ngay": "2026-10-30T10:15:00", "gioi_tinh": "nu", "chinh": "kh", "phu": "dh" | null, "diem": [9 số 0–100 theo thứ tự bh,kh,dh,ah,dt,tn,hu,ku,db], "khi_hau": "lanh" | "nong" | "deu", "an_toan": ["mang_thai", …] }`
  `an_toan` là mã tình trạng đặc biệt (danh sách App KH gửi kèm khi POS làm). Kèm `dong_y_luc` (giờ VN khách bấm đồng ý) — POS lưu làm bằng chứng đồng ý.
- `DELETE /trac-nghiem` (token) — khách rút lại đồng ý / xoá trong Hồ sơ → POS xoá hẳn.
- `GET /toi` thêm `trac_nghiem` (bản đang lưu | null) để App biết khách đã chia sẻ chưa.
- POS: hiện trong **chi tiết khách** (Khách hàng → bấm khách): nhóm chính / phụ, ngày làm, khí hậu, tình trạng đặc biệt; chỉ người có quyền xem khách.
- Đây là thông tin sức khoẻ: chỉ lưu khi khách đồng ý; không đưa vào log; xuất / sao lưu theo cách POS đang làm với dữ liệu khách.

## 4. Việc mới C — Nhiều địa chỉ (xin trước KH-MUA-1, có thể sau khai trương)
- v3 giữ `dia_chi` một chuỗi như đã chốt (không đổi). Bản sau thêm danh sách:
  `GET /toi` → `dia_chi_ds[] { id, nhan, dia_chi, mac_dinh }` (`nhan`: "Nhà" / "Văn phòng" / chữ khách gõ, ≤ 30 ký tự); `POST /dia-chi`, `PUT /dia-chi/:id`, `DELETE /dia-chi/:id`; đúng một địa chỉ `mac_dinh`.
  `dia_chi` của v3 = địa chỉ mặc định (giữ để App cũ không vỡ). Tối đa 5 địa chỉ / khách.
- Xin POS báo việc này gộp vào KH-HOSO-1 hay mở mã riêng, và ngày dự kiến.

## 5. Không cần POS làm
- "Bán chạy nhất", banner, câu chữ từng trang, mô tả dài / nhiều ảnh / video của món: phần nội dung App KH (sau khai trương có Chế độ sửa).
- App KH sẽ có trang "Kiểm khớp POS" tự gọi thử các cửa trong hợp đồng và báo ✓/✗ cho chủ quán — chỉ đọc, không thêm tải đáng kể cho POS.

## 6. Xin POS trả lời
- Mục 1: xác nhận. Mục 2, 3, 4: nhận hay không, mã việc, ngày dự kiến; tên trường nếu POS muốn khác (App KH theo tên POS chốt).
