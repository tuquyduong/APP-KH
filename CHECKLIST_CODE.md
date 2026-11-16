# Checklist code App KH — tra trước khi sửa

## A. Gọi máy chủ
- A1 Mọi lời gọi mạng qua `src/api.js`, đúng 2 lối fetch: `goi` → `/api/kh/*` (token khách) và `goiKho` → `/api/nd/*` (vé quản trị) (bộ kiểm K1, K1b).
  Chữ "/api/…" chỉ ở `dinhDang.js` (/api/kh) và kho nội dung (/api/nd); `goiKho` chỉ `src/noiDung/khoNoiDung.js` dùng; lời gọi kho viết thẳng, có trong
  `thiet_ke/HOP_DONG_API_ND.md` (K2, K2b, K8b). Bộ kiểm đọc mã NHƯ LÚC CHẠY (bỏ chú thích, ghép sẵn chữ) — viết vòng / ghép mảnh / dựng chữ kiểu giấu
  (fromCharCode, atob, eval…) đều bị bắt (K2, K2c); bản dựng chỉ chứa /api/kh + /api/nd (K2d). Muốn thêm cửa / lối → ghi Phát hiện, chat sửa bộ kiểm.
- A2 Luôn hiện `error` của POS; mất mạng / 5xx không JSON → lời dự phòng trong `dinhDang.js`, không trắng màn.
- A3 401 → xoá token, về đăng nhập.

## B. Dữ liệu
- B1 Không bịa số: trường thiếu → ẩn (KHUON_LOI K3).
- B2 Không giá vốn, tồn thật, dữ liệu khách khác (K4).
- B3 Giá trên app chỉ để xem; giá thật do POS tính lúc đặt.

## C. Giao diện
- C1 Điện thoại trước; máy tính bảng / máy tính không vỡ (khung giữa màn, ảnh `object-fit`, không chiều rộng cố định px cho khung chính).
- C2 Chữ phóng to (cài đặt máy) không tràn; nút chạm ≥ 44 px.
- C3 Trình duyệt Zalo: không dựa vào tính năng chỉ Chrome / Safari mới có.
- C4 Màu, chữ, khoảng cách chỉ ở `src/giaoDien/`.

## D. Bảo mật
- D1 Không bí mật trong `src/`, `index.html`, log (K3).
- D2 Mã `?ma=` trên link đọc xong xoá khỏi thanh địa chỉ.
- D3 Không thư viện ngoài danh sách (K6).

## E. Bài thử
- E1 Bài thử in dòng cuối "n đạt · m hỏng", thoát 1 khi hỏng.
- E2 Kiểm hàm thuần bằng `import()` file trong `src/` — không dựng bản giả của hàm.
