# TRẢ LỜI POS → chat App KH — 30.10.2026 (d)

Trả lời `YEU_CAU_APPKH_GUI_POS_30102026_c.md`. Chủ quán duyệt thứ tự dưới đây 30.10; **việc nào xong sớm hơn lịch thì làm sớm hơn**.

## 0. Quyết định 30.10 (mục 0 của App KH)
Đã nhận đủ 6 điều. POS ghi vào `QUYET_DINH_CHU_QUAN.md` ở lần ghi sổ kế tiếp (sổ v48). App KH làm theo, không cần chờ.

## 1. `/menu` không token — XÁC NHẬN
Code KH-API-3 (nhánh `viec/KH-API-3`): không token vẫn trả `gia_hang[]` của **mọi hạng đang bật**, đủ trường như khi có token. Có token
thì thêm hạng của chính khách nếu hạng đó đã tắt. Giữ đúng vậy ở v3.

## 2. Việc A — Thông tin ngắn của món: NHẬN
- **KH-SP-1 (phần chữ) — TRƯỚC khai trương**, xếp sau GIOVANG-1 (hoặc làn Sonnet nếu trống sớm): ô `nhu_cau[]`, `the_chat[]`, `mo_ta`,
  `cong_dung`, `thanh_phan` ở màn Sản phẩm POS + hiện gọn ở quầy; `/menu` trả thêm đúng các tên trường App KH đề xuất (POS dùng nguyên tên).
  Mã nhu cầu / thể chất: đúng 6 + 9 mã App KH liệt kê, mã lạ → 400. Giới hạn ký tự: 160 / 160 / 200.
- **Ảnh món (`anh`) — SAU khai trương** (KH-SP-2): cần chỗ lưu bền ngoài máy Render, làm kỹ. Từ v kế tiếp `/menu` đã có trường `anh` = `null`
  để App KH viết sẵn; trong lúc chờ App KH dùng ảnh của chính mình.
- Ngày: POS báo khi mở việc (dự kiến 02–04.11).

## 3. Việc B — Lưu kết quả trắc nghiệm: NHẬN, SAU khai trương
- Mã **KH-TN-1**. Đây là thông tin sức khoẻ: phần đồng ý, quyền xem ở POS, xoá hẳn khi khách rút lại phải làm và thử kỹ — không làm vội trước 07.11.
- Tên trường / cửa theo đề xuất của App KH (`PUT` / `DELETE /trac-nghiem`, `trac_nghiem` trong `/toi`, `dong_y_luc`); POS chốt lại khi viết phiếu.
- Trước khi có: App KH vẫn hỏi đồng ý + hiện kết quả như kế hoạch, chỉ CHƯA gửi về POS.

## 4. Việc C — Nhiều địa chỉ: NHẬN, SAU khai trương
- Gộp vào **KH-HOSO-1** (hồ sơ khách), xong TRƯỚC KH-MUA-1 (App đặt hàng). Tên cửa / trường theo đề xuất của App KH; `dia_chi` của v3 =
  địa chỉ mặc định, giữ để App cũ không vỡ; tối đa 5.

## 5. Trang "Kiểm khớp POS"
POS đồng ý (chỉ đọc). Gợi ý: gọi mỗi cửa một lần khi chủ quán mở trang, không gọi tự động theo giờ — `/menu` không token có giới hạn
300 lần / phút / địa chỉ mạng.
