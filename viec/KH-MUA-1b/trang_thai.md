# KH-MUA-1b — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: `viec/KH-MUA-1b`; cây sạch; HEAD `fb65795` = FETCH_HEAD `fb65795` (bằng nhau, không kéo).
- `git log --oneline -3`:
```
fb65795 PHIEU: KH-MUA-1b
4ea2c90 TIEN-DO: KH-NHANH-1 xong (PR #13 7e7f92a); mo KH-MUA-1b (hop dong v5); trao doi POS 01.11-02.11 - so v19
7e7f92a Merge pull request #13 from tuquyduong/viec/KH-NHANH-1
```

## Đang ở
Bước 3 — kế hoạch `ke_hoach.md` đã viết, **CHỜ CHỦ QUÁN DUYỆT** (phiếu: "Chờ duyệt kế hoạch"). Chưa sửa code, chưa viết bài thử.

## Câu hỏi
- Q1 (F2, dữ liệu POS chưa có): `GET /don/:ma` v5 KHÔNG có `giu_vi` / `con_lai` (chỉ `POST /don` trả). Dòng "Đã giữ <giu_vi> trong ví · quét QR <con_lai>"
  chỉ hiện được khi App còn giữ trả lời `POST /don` trong bộ nhớ trang. Tải lại / mở máy khác: kế hoạch ẨN dòng này và ẨN số tiền cạnh QR
  (không hiện `tong` — sai với đơn `vi_qr`), chỉ vẽ QR + đếm ngược (lý do (a): dữ liệu POS chưa có). Muốn hiện đủ sau tải lại → xin POS thêm
  `giu_vi`, `con_lai` vào `GET /don/:ma` (hợp đồng v6). Chủ quán xác nhận cách tạm này, hoặc dặn chờ POS.
- Q2 (D3, lưu trên máy): để chặn đặt trùng khi tải lại / mở lại / hai tab (D3 c, d), App nhớ lần gửi "chưa rõ kết quả" ở localStorage khoá `kh_don_gui`
  = `{ khoa_gui, than (KHÔNG có pin), luc }` tới khi rõ. Khoá thêm vào danh sách `luuMay.js` (xoá khi đăng xuất / đổi khách). Không có dữ liệu sức khoẻ,
  không PIN. Chủ quán duyệt dùng localStorage cho việc này (CLAUDE.md §8 chỉ kể trắc nghiệm, kế hoạch).
