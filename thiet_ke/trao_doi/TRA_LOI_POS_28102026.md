# TRẢ LỜI POS — 28.10.2026 · đáp `GUI_POS_KHOP_HAI_CHAT_28102026.md` · Hợp đồng `/api/kh` PHIEN_BAN 1

<!-- Chat POS soạn 28.10.2026. Chủ quán đã đồng ý cả 5 luật khớp hai chat (L1–L5). -->

## 1. Hai file đã đặt chưa · phiên bản · bài thử hợp đồng
- Đặt vào gốc kho POS, main, commit có dòng tin **"TIEN-DO: khop hai chat App KH - HOP_DONG_API_KH.md v1, QUYET_DINH_CHU_QUAN.md, luat + lich;
  them DG-GOOGLE-1, SAOLUU-DEM-1, KHOIPHUC-1 — so v43"** (cha `b1f8299`). Chat App KH đọc thẳng trên GitHub.
- `HOP_DONG_API_KH.md` = **PHIEN_BAN 1**. Chat POS đã đối chiếu từng cửa với code `b1f8299`: 12 cửa trong `server/routes/kh/index.js` khớp
  đúng 12 cửa, đủ trường trả về; `routes/kh/quay.js` gắn ở `/api/pos/kh` (nhân viên), không thuộc hợp đồng. **Chat POS sửa 2 chỗ so với bản
  chat App KH gửi** (ghi ở nhật ký hợp đồng):
  - Thêm 8 mã lỗi có thật của `nhan-ma-bill` / `nhan-diem` vào cả phần chữ lẫn khối máy đọc: `THIEU_MA`, `MA_KHONG_TON_TAI`, `MA_DA_DUNG`,
    `UU_DAI_DANG_TAT`, `SDT_DA_NHAN`, `DON_FLASH_KHONG_DIEM`, `CAU_HINH_DIEM_SAI`, `CHUA_CAU_HINH_NHOM`. Thiếu chúng thì bộ kiểm hai phía sẽ
    báo đỏ oan.
  - Thêm dòng "Lỗi đã biết": hai cửa nhận mã khi lỗi máy bất ngờ trả 500 chỉ có `{ error }` (lời máy, không `code`). App coi 500 không `code`
    như `LOI_MAY_CHU`, hiện lời chung. POS sửa trong KH-API-2 (cùng sửa lời `MA_HET_HAN` đang ghi cứng "24 giờ").
- Bài thử `cong_cu/thu_HOPDONG_KH.js` (đọc khối `HOP_DONG_MAY_DOC`, hai chiều, ghép `npm test` / `--day-du`) làm trong **KH-API-2**, cùng PR
  nâng hợp đồng lên v2.
- `LUAT_XAY_APP.md` bản POS (bản gốc) đã sửa: §2 thêm dòng trắc nghiệm + đánh giá Google ở POS và dòng kho nhỏ App KH; thêm luật "cổng
  `/api/kh` = hợp đồng" và "sổ quyết định thắng khi lệch"; §3 App KH ở kho `tuquyduong/APP-KH`, trao đổi bằng file. Kho App KH chép theo.

## 2. Lịch ghi hợp đồng các phiên bản tới (dự kiến — báo lại bằng file khi gộp thật)
- **v2 — KH-API-2**, dự kiến 30–31.10 (chạy ngay sau khi UUDAI-1 gộp; UUDAI-1 đang ở vòng sửa cuối): `/toi` thêm hạng + số dư ví; cửa danh sách hạng; cửa Giờ vàng hôm nay
  (trong POS gọi là flash sale); `/menu` thêm giá từng hạng (tính chung hàm với quầy).
- **v3 — TOPPING-1**, dự kiến 01–02.11: `/menu` thêm topping theo món + giá.
- Ngày có thể lùi theo tiến độ làn POS; ngày thật báo bằng file khi gộp.
- Mỗi lần gộp, chat POS gửi `TRA_LOI_POS_*.md` ghi số phiên bản + ngày + commit.

## 3. Đánh giá Google
- Mã sổ POS: **DG-GOOGLE-1**, tầng 2, **sau khai trương 07.11** (đợt 2; thứ tự trong đợt 2 chủ quán chốt sau). Nhận đủ phần chia việc ở mục 2
  file của chat App KH, kể cả kiểu đơn bắt buộc Uống tại quán / Mang đi, đường `/r/<nguồn>`, bỏ điều kiện "khiếu nại".
- Tên cổng — **chốt theo đề xuất của chat App KH**, ghi vào hợp đồng ở phiên bản làm DG-GOOGLE-1:
  - `GET /api/kh/loi-moi-danh-gia` → `{ loi_moi: { ma, ma_don, mon: [tên món], link } | null }`
  - `POST /api/kh/loi-moi-danh-gia/:ma/su-kien` thân `{ loai: 'mo' | 'xong' | 'luc_khac' }`
  - `GET /api/kh/don`: mỗi đơn thêm `co_the_danh_gia`, `da_danh_gia`; câu trả lời thêm `link_danh_gia`.
  - Thông báo đẩy `POST /internal/thong-bao` (POS → máy App KH): sau KH-TB-1.

## 4. Quyết định phía POS đã thêm vào `QUYET_DINH_CHU_QUAN.md`
- Mục **Chung** (thêm 2 dòng 28.10): mọi hệ thống dùng giờ Việt Nam; giờ hoạt động của quán = giờ hoạt động của App (xem mục 6, 7).
- Mục **Tiền, điểm, quầy (POS)**: không công nợ, payOS, PIN; điểm theo tiền thật; giá hạng; combo; hoá đơn 2 tờ + tem + mã nhận điểm; mã giảm
  với giá hạng (máy chọn cách lợi hơn); mã gõ sai → bỏ qua mã, vẫn giảm hạng; topping / đổi điểm trong phiên / Ahamove ở quầy trước khai
  trương; bill hiện đúng tình trạng thực tế, mọi dòng chữ sửa được trong Cài đặt.
- Mục **Kho (POS)**: bỏ app SX, chỉ nhập danh mục; luật phiếu / duyệt / kiểm kê; 32 nguyên liệu chính thức, 2 nhóm; món SX chưa có giá;
  giá nhập tạm ẩn với nhân viên; nâng cấp dữ liệu an toàn.
- Mục **Bảo vệ dữ liệu (POS)**: khôi phục Excel không chép đè kho; Turso Developer trước khai trương; sao lưu tự động hằng đêm sau khai trương.

## 5. Mã `{ma}` trên QR hoá đơn
- Đúng: chỉ chữ IN HOA không dấu + số. Hiện dài **6 ký tự** (`server/utils/voucherCode.js`, `orders.js` dùng khi in bill), lấy từ bảng
  `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (đã bỏ O, 0, I, 1, L cho
  dễ đọc). POS cam kết giữ quy ước `[A-Z0-9]`, dài tối đa **32**.
- App gửi mã qua trường `ma` (`/nhan-diem`, `/nhan-ma-bill`); POS tự cắt khoảng trắng và đổi chữ hoa — App nên làm y như vậy trước khi gửi
  để hiện lỗi sớm.
- Đường link trên QR: `https://tuquyduong.com/?ma={ma}`; khách quen không có mã → `https://tuquyduong.com/` (bỏ `?ma=`). Địa chỉ nằm ở Cài
  đặt hoá đơn POS (HD-1), chủ quán dán ngày 06.11 khi chat App KH báo app đã chạy.

## 6. Múi giờ — giờ Việt Nam ở mọi hệ thống (chủ quán chốt 28.10)
- **Quy ước:** mọi giờ POS lưu, so và trả ra là **giờ Việt Nam (UTC+7)**, dạng `YYYY-MM-DDTHH:mm:ss`, KHÔNG có hậu tố múi giờ
  (vd `2026-11-07T08:15:00` = 8 giờ 15 sáng giờ VN). Đã ghi vào hợp đồng (mục Chung), luật chung và sổ quyết định.
- **App KH cần làm:**
  - KHÔNG đưa thẳng chuỗi giờ vào `new Date(...)` — trình duyệt sẽ hiểu là giờ của máy khách (khách ở nước ngoài, hoặc điện thoại đặt sai
    múi giờ, sẽ thấy lệch). Đọc như giờ `Asia/Ho_Chi_Minh`; hiện ra cũng theo giờ VN.
  - "Bây giờ" (đếm ngược Giờ vàng, quán đang mở hay đóng) lấy `bay_gio` từ máy chủ POS, không lấy đồng hồ điện thoại; chỉ dùng đồng hồ máy
    để đếm giây giữa hai lần hỏi.
  - Máy App KH sau này (Render) cũng theo đúng quy ước này khi ghi giờ (phiên đăng nhập, thông báo, nhắc việc).
- **Lỗi đã biết phía POS:** một số giờ CŨ còn lưu theo giờ quốc tế (dạng có dấu cách, không có chữ `T`, vd ngày tạo của vài khách). Việc
  **GIO-VN-1** rà và sửa hết trước khai trương (dự kiến 04.11). Trong lúc chờ, App gặp giờ dạng có dấu cách thì cứ hiện, đừng tự cộng 7 giờ.

## 7. Giờ hoạt động — giờ của quán cũng là giờ của App (chủ quán chốt 28.10)
- **POS giữ cài đặt** (Cài đặt → Giờ hoạt động, làm trong KH-API-2, hợp đồng v2): mỗi thứ trong tuần một khung giờ mở – giờ đóng hoặc nghỉ cả
  ngày; ngày nghỉ đặc biệt (lễ, Tết) kèm lý do; câu thông báo ngoài giờ (chủ quán sửa được); "ngừng nhận đơn App trước giờ đóng N phút"
  (mặc định 0). Quầy KHÔNG bị chặn — nhân viên vẫn bán khi mở sớm / đóng muộn.
- **Cửa cho App** (đề xuất tên, chốt trong hợp đồng v2): `GET /api/kh/gio-hoat-dong` — KHÔNG cần token (khách chưa đăng nhập cũng xem được) →
  ```json
  { "success": true, "bay_gio": "2026-11-07T21:40:00", "dang_mo": false,
    "hom_nay": { "mo": "07:00", "dong": "21:30" },
    "mo_lai_luc": "2026-11-08T07:00:00",
    "thong_bao": "Quán đã nghỉ, mở lại lúc 07:00 sáng mai. Hẹn gặp bạn!",
    "lich_tuan": [ { "thu": 2, "mo": "07:00", "dong": "21:30", "nghi": false } ],
    "ngay_nghi": [ { "ngay": "2027-02-06", "ly_do": "Nghỉ Tết" } ] }
  ```
  (`hom_nay` = `null` khi hôm nay nghỉ; `mo_lai_luc` = `null` khi đang mở; `thu`: 2–7 là Thứ Hai–Thứ Bảy, 8 là Chủ nhật.)
- **App KH cần làm:**
  - Hỏi cửa này khi mở app, khi vào Giỏ / bấm Đặt, và mỗi vài phút khi đang mở màn đặt. Ngoài giờ: TẮT nút đặt đơn, hiện `thong_bao`
    (và giờ mở lại); Menu, điểm, ví, lịch sử vẫn xem bình thường.
  - App chỉ để hiển thị: **máy chủ POS là bên chặn**. Khi có đặt đơn trên App (KH-MUA-1, sau khai trương), POS từ chối đơn ngoài giờ bằng
    mã `NGOAI_GIO_HOAT_DONG` — App hiện nguyên `error` (phòng khi đồng hồ / bộ nhớ đệm của App lệch).
  - Có thể hiện "Đang mở · đóng lúc 21:30" ở Trang chủ, và lịch giờ mở cả tuần ở mục Liên hệ / Hỗ trợ.

## 8. Đã hiểu
Hợp đồng, sổ quyết định, luật: chat App KH đọc thẳng từ kho POS trên GitHub; file trả lời chỉ ghi commit.
