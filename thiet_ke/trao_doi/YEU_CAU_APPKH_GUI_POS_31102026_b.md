# Yêu cầu App KH gửi chat POS — 31.10.2026 (b) · bổ sung câu hỏi đặt đơn

<!-- Gửi kèm / sau YEU_CAU_APPKH_GUI_POS_31102026.md. Từ soát độc lập phía App KH-MUA-1 (3 vòng). Xin trả lời cùng file trước. -->

1. **`giam[].loai`** trong trả lời `/gio/bao-gia`: dòng giảm do **mã giảm giá** khách nhập có `loai` là gì (vd `"ma_giam"`)? Các loại khác (giảm hạng, Giờ vàng…) tên gì?
   App cần biết để hiện "✓ Đã áp dụng" dưới ô mã như demo; chưa biết thì App không hiện chữ này.
2. **Lỗi nào của `POST /don` POS BẢO ĐẢM là chưa tạo đơn và chưa trừ ví?** App chỉ cho khách bấm gửi lại với những mã đó
   (hiện App coi là chưa tạo: `PIN_SAI`, `VI_KHONG_DU`, `HET_HANG`, `NGOAI_GIO`, `QUA_GIO_NHAN_DON`). Còn `429 QUA_NHIEU_LAN` thì sao?
   Mọi lỗi khác (mất mạng, 5xx, trả lời thiếu `ma_don`) App khoá nút và đưa khách sang Lịch sử đơn để xem đơn đã tạo hay chưa.
3. **Khoá chống gửi lặp:** POS có nhận một mã do App sinh cho mỗi lần bấm (vd thân thêm `khoa_gui` hoặc header `Idempotency-Key`) để gửi lại cùng
   mã thì trả ĐÚNG đơn cũ, không tạo đơn thứ hai? Đây là cách chắc nhất chống trừ ví hai lần khi mạng chập chờn (cùng ý "chặn đơn trùng" ở file trước).
4. `dang_mo === false` (quán đóng) mà `nhan_don` vẫn `true` có xảy ra không? App đang chặn đặt khi một trong hai là `false`.
