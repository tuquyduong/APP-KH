# Phương án "Nội dung sửa được" cho App KH — rà soát 10.11.2026

> Mục tiêu (chủ quán 10.11): chủ quán đăng nhập /admin là **sửa trực tiếp mọi nội dung trình bày của App KH** (bấm vào chỗ cần sửa, bảng sửa hiện lên),
> **không đụng** những gì lấy từ POS (giá, gói, hạng, voucher…). Mọi chữ / ảnh đang viết cứng trong code phải chuyển về chỗ sửa được.
> Yêu cầu: thông minh, đơn giản, toàn diện — một cách làm duy nhất cho mọi màn.

---

## 1. Rà soát hiện trạng (main 443c28e, sau KH-UI-5e)

| Hạng mục | Kết quả |
|---|---|
| Chế độ sửa / `/admin` | **Chưa có.** `/admin` chuyển về Trang chủ. KH-ADMIN-1 đang chờ (sau khai trương). |
| Chuỗi chữ tiếng Việt trong code | **~1.050 chuỗi ở 68 tệp** (đếm tự động, gồm cả chữ kỹ thuật). |
| Đã gom về `src/noiDung/` | ~14 tệp (Trang chủ, Kế hoạch, Văn khấn, Thể chất, Đăng nhập, Trắc nghiệm…) — **gom rồi nhưng chưa có "khoá"**, vẫn chỉ sửa bằng code. |
| Viết thẳng trong màn hình | Nhiều nhất: Thanh toán 51 · Bảng ngày 46 · Kế hoạch 40 · Người thân 32 · Ưu đãi 28 · Hồ sơ 27 · Tiện ích 22 · Giỏ hàng 21 · Văn khấn 20 · Theo dõi đơn 16… |
| Nội dung nằm lẫn trong phần tính toán | `lich.js` (lời khuyên 24 tiết khí), `tracNghiem.js` (câu kết luận), `datDon.js` (tên trạng thái đơn), `dinhDang.js` (lời chào, câu báo lỗi), `duongDan.js` (tên màn). |
| Bản demo | Đã thiết kế sẵn Chế độ sửa: **~77 chỗ sửa có khoá** (`t:` chữ, `b:` nút + trang đích, `img:` ảnh, `h.need` ô nhu cầu, `tier:`…), nhóm nội dung dài (`t:vk.*` văn khấn, `t:ss.*` theo mùa, `t:cyc.*` chu kỳ), chỗ khoá 🔒 có lý do, Việc / Xem lại / Xuất bản / lịch sử, ẩn-hiện mục. |

**Kết luận:** App chạy đúng nhưng **chưa sửa được gì ngoài code**. Càng làm thêm màn, chữ cứng càng nhiều → phải chặn ngay và gom dần.

---

## 2. Ranh giới — mỗi thứ CHỈ có MỘT chỗ sửa

| Nhóm | Gồm | Sửa ở đâu | Trong Chế độ sửa hiện thế nào |
|---|---|---|---|
| **A. Dữ liệu POS** | Tên món, giá, size, topping, nhóm món, tồn · giá hạng, gói thẻ, quyền lợi hạng · Giờ vàng · chương trình · voucher, mẫu voucher · điểm, ví, đơn, hoá đơn · giờ mở cửa · dải quảng cáo + banner theo giờ (QC-APP-1) · thông tin ngắn của món: ảnh chính, nhu cầu, thể chất, mô tả ngắn, công dụng, thành phần (KH-ND-2) · giới thiệu bạn bè | **POS** | 🔒 "Lấy từ POS — sửa ở POS › <tên màn>" (chỉ đường đúng chỗ) |
| **B. App tự tính** | Lịch âm, can chi, ngày tiết khí, đếm ngược, số ngày còn lại, lời chào theo giờ, tổng tiền | Không ai sửa | 🔒 "App tự tính" |
| **C. Dữ liệu riêng của khách** | Việc của tôi, người thân, tín chủ văn khấn, uống thuốc, chu kỳ, xe | Khách, trên máy khách | Không hiện ở /admin |
| **D. Nội dung App** | Mọi chữ / ảnh / nút **trình bày cho khách**: tiêu đề mục, lời mời, câu hướng dẫn, chú thích, banner thường Trang chủ, món nổi bật, 6 ô nhu cầu, Theo mùa, lời khuyên tiết khí, ngày lễ, văn khấn & lễ vật, giới thiệu thương hiệu, hỗ trợ / liên hệ, video hướng dẫn, ẩn / hiện từng mục | **/admin — Chế độ sửa của App KH** | Viền vàng ✎, bấm → bảng sửa |
| **E. Chữ giao diện cố định** | Nhãn nút ("Thêm vào giỏ", "Huỷ", "Lưu"), tên màn, câu báo lỗi kỹ thuật, chữ bước thanh toán / PIN | Code, **gom một tệp** `noiDung/giaoDien.js` | Không mở (như demo: "Chữ giao diện cố định") |

> Riêng **nội dung trắc nghiệm thể trạng** (câu hỏi, cách chấm, 9 thể) là nội dung chuyên môn → 🔒, chỉ thay bằng "tải bản mới" (như demo).
> Ranh giới này ghi vào luật (CLAUDE.md) để mọi việc sau tự tuân theo.

---

## 3. Cách làm — một khuôn duy nhất

1. **Sổ nội dung** (`src/noiDung/`): mọi nội dung nhóm D có **một khoá** đặt theo demo (vd `t:home.needs`, `b:home.bb`, `img:home.banner`, `t:vk.r.le`, `t:ss.Dong.an`).
   Giá trị mặc định nằm trong code (bản đang chạy hôm nay — không mất gì).
2. **Danh mục khoá** (`src/noiDung/danhMuc.js`): mỗi khoá một dòng — màn nào · tên tiếng Việt · loại (`chu`, `doan`, `anh`, `nut`, `danhsach`, `battat`) · giới hạn (độ dài, tỉ lệ ảnh) · gợi ý.
   Nhóm A / B khai `khoa: 'pos' | 'tutinh'` + chỉ đường. **/admin đọc danh mục này để TỰ SINH bảng sửa** — không làm tay từng màn.
3. **Một hàm đọc** `nd(khoa)` (và `nut(khoa)`, `anh(khoa)`): màn hình CHỈ lấy nội dung qua hàm này. Hôm nay hàm trả bản mặc định; khi có /admin, hàm trả bản chủ quán
   đã xuất bản — **đổi nguồn ở đúng 1 chỗ**, các màn không phải sửa.
4. **Đánh dấu chỗ sửa**: phần tử hiển thị nội dung gắn `data-nd="<khoá>"` (như `data-cms` của demo) → Chế độ sửa biết chỗ nào có viền vàng, chỗ nào 🔒.
5. **Bộ kiểm tự chặn (K10, kiểu "chỉ được giảm")**: kiem_tra_truoc_khi_giao.js đếm chữ tiếng Việt viết thẳng trong `src/pages`, `src/components` (ngoài `nd()` và tệp giao diện cố định).
   Lần đầu ghi **số nợ** hiện tại; từ đó **số này chỉ được giảm, không được tăng** → việc mới không thể thêm chữ cứng, việc gom làm số giảm dần về 0.
   Đơn giản, không cần rà tay, không làm chậm việc đang chạy.

---

## 4. Lộ trình triển khai

| Bước | Việc | Nội dung | Ghi chú |
|---|---|---|---|
| 1 | **KH-ND-3a — Hạ tầng** (Opus) | Sổ khoá + danh mục + `nd()` + `data-nd` + tệp chữ giao diện + K10 (ghi số nợ) · chuyển **Trang chủ** làm mẫu | Làm NGAY, trước KH-UI-5f — để 5f dùng `nd()` từ đầu, không phải làm lại |
| 2 | **KH-ND-3b…e — Gom theo nhóm màn** (Sonnet, chạy song song — mỗi việc tệp nội dung riêng) | b: Menu, Trang món, Giỏ · c: Ưu đãi, Tài khoản, Hồ sơ, Hỗ trợ, Đăng nhập, Màn mở · d: Kế hoạch + tiện ích (tiết khí, theo mùa, ngày lễ, văn khấn) · e: Thanh toán, Theo dõi đơn, Chi tiết đơn, PIN (chủ yếu nhóm E) | Mỗi việc kéo số nợ K10 xuống; không đổi giao diện khách thấy (ảnh trước = sau) |
| 3 | **KH-UI-5f** | Xe cộ, Uống thuốc, Chu kỳ — viết theo khuôn mới ngay từ đầu | Sau bước 1 |
| 4 | **KH-TACH-1** | Máy App KH riêng + kho nhỏ (đã có trong kế hoạch) — nơi LƯU bản nội dung đã xuất bản | Cần cho bước 5 |
| 5 | **KH-ADMIN-1 — Chế độ sửa** | Đăng nhập tài khoản POS · công tắc Chế độ sửa · viền vàng ✎ / 🔒 có lý do · bảng sửa chữ / ảnh (tự cắt, nén) / nút + trang đích / danh sách · Việc · Xem lại (cũ ↔ mới) · Xuất bản có phiên bản + lịch sử + quay lại bản cũ · ẩn / hiện mục | Làm đúng như demo; bảng sửa tự sinh từ danh mục → **mọi màn sau này tự có chỗ sửa** |

**Luật cho mọi việc từ nay** (ghi vào CLAUDE.md + mẫu phiếu): phiếu có mục "Nội dung mới" liệt kê khoá thêm vào danh mục; chữ / ảnh cho khách không viết thẳng vào màn;
cái gì của POS thì đọc từ POS và khai 🔒; K10 không được tăng.

---

## 5. Vì sao cách này thông minh và đơn giản
- **Một khuôn cho tất cả**: khoá → danh mục → `nd()` → /admin tự sinh. Không có màn nào làm riêng.
- **Không mất gì hôm nay**: bản mặc định chính là chữ đang chạy; khách không thấy khác.
- **Không chồng chéo với POS**: thứ của POS không bao giờ có ô sửa ở App — chỉ có 🔒 chỉ đường sang POS.
- **Tự giữ kỷ luật**: K10 chặn chữ cứng mới bằng máy, không trông vào trí nhớ.
- **Gom song song được**: mỗi nhóm màn một tệp nội dung → nhiều phiên chạy cùng lúc, không vướng nhau.

---

## 6. Bổ sung 11.11.2026 (chủ quán đồng ý)
- **Lưu = lưu tiến độ (nháp)** lên máy chủ — tắt máy / đổi máy không mất, khách chưa thấy. **Cập nhật toàn bộ** = gộp nháp thành phiên bản mới, khách thấy ở lần mở App tới.
- **Phiên bản:** mỗi bản là bản đầy đủ các chỗ đã sửa (vài chục KB) → giữ mãi; Xem / So với bản đang chạy / Quay lại (tạo bản mới, không xoá) / Tải về máy. Hai người cùng sửa:
  ai cập nhật sau mà bản gốc đã cũ → báo "có bản mới hơn, tải lại rồi cập nhật".
- **Sửa mà vẫn đi được các màn:** nút bút ✎ riêng ở mỗi chỗ sửa; chạm chỗ khác App chạy như khách; "Đi tới màn" (cả trạng thái hiếm với dữ liệu mẫu); "Danh sách chữ của màn này";
  nút làm thật bị khoá trong Chế độ sửa.
- **Quyền:** trong Cài đặt › Phân quyền POS — Xem / Sửa (Lưu) / Cập nhật + Quay lại / Xuất-Nhập (chủ quán). Có nhật ký.
- **Kho nội dung ở nhờ POS, xây như nhà riêng** (6 điểm chuẩn bị tách — CLAUDE.md §11). Tách sau này: dựng máy mới → Nhập toàn bộ → đổi 1 địa chỉ (~nửa ngày máy).
- **POS (tư vấn 11.11):** POS KHÔNG làm Chế độ sửa kiểu App (màn nhân viên, cố định giúp quen tay). Nhưng mọi chữ POS gửi tới KHÁCH (hoá đơn, tem ly, tin Zalo, nội dung chuyển khoản,
  lời mời đánh giá, mô tả voucher…) phải nằm trong Cài đặt POS có xem trước; mọi màn Cài đặt POS có nhật ký thay đổi (ai, lúc nào, cũ → mới). Chi tiết: thư App → POS 11.11.

## 7. Sao lưu App KH (11.11)
| Phần | Sao lưu ở đâu | Khôi phục |
|---|---|---|
| Code | GitHub (mọi lần sửa đều còn) | Quay lại commit cũ |
| Bản đang chạy cho khách | Cloudflare Pages giữ mọi bản dựng | Một nút "Rollback" về bản dựng trước |
| Nội dung chủ quán sửa | (1) mọi phiên bản trong kho nội dung · (2) sao lưu POS · (3) mỗi đêm tự xuất cất vào nhánh sao lưu của kho App (KH-SL-1) · (4) chủ quán bấm "Tải về máy" khi muốn | Quay lại phiên bản / Nhập toàn bộ |
| Dữ liệu riêng của khách (việc, người thân, văn khấn…) | Chỉ trên điện thoại khách (riêng tư) | Đổi máy là mất — đề xuất sau khai trương: khách tự bật "đồng bộ theo tài khoản" (chủ quán quyết) |
| Biến cấu hình (địa chỉ POS, khoá) | Ghi trong tài liệu bàn giao, chủ quán giữ | Nhập lại trên Cloudflare |
