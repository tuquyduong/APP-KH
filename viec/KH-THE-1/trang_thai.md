# KH-THE-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (13.11.2026)
- Nhánh: `viec/KH-THE-1`; `git status --short` sạch (không dòng đã theo dõi sửa dở).
- `git fetch origin viec/KH-THE-1` → HEAD `3cb9386` · FETCH_HEAD `3cb9386` (bằng nhau — không kéo).
- `git log --oneline -3`:
```
3cb9386 PHIEU: KH-THE-1
c770240 TIEN-DO: mo KH-THE-1 (ban the hang tren App: man Hang thanh vien, nhom The thanh vien o Menu, nut Mua o Uu dai, nhac gia han, the chung gio + tra the truoc; Opus, cho duyet ke hoach; song song KH-ND-3d); KH-ADMIN-1 mo ~14.11; quyet dinh 12.11
b7df000 TIEN-DO: KH-ND-3c, KH-UI-5f xong (chat soat cuoi DAT, gop PR); mo KH-ND-3d (Ke hoach + moi tien ich vao danh muc, o an thi link cung khong mo, GiaMon bo cat chu d, tel: chi so); quyet dinh 12.11 dot 6; ban giao chat 12.11
```

## Bước 3 — kế hoạch
- `ke_hoach.md` đã viết; phiếu dặn "Chờ duyệt kế hoạch" → commit, push, DỪNG chờ chủ quán gõ "duyệt".

## Câu hỏi
1. **A1 không tải được đúng từng byte.** Người gác chặn cả ba đường: `curl` tới raw.githubusercontent.com (`[CURL-HOST]`), `git init` + `git fetch` kho POS ở nháp
   (`[GIT-LENH]`), công cụ thêm kho `add_repo` (`[CC-LA]`). Một agent phụ đọc được trang (PHIEN_BAN 13, NGAY 2026-11-09) nhưng chỉ trả lời tóm ý — không dùng để chép.
   Xin chủ quán làm như KH-MUA-1c (v9): đặt bản gốc vào `viec/KH-THE-1/hop_dong_v13.md` (tải `HOP_DONG_API_KH.md` của kho POS ở commit
   `162a9080b0a754f4433e544009ec0893dc358f5f`) cùng lúc gõ "duyệt"; máy sẽ kiểm sha256 bắt đầu `490976b0c438b8b4`, `cmp` rồi chép sang `thiet_ke/HOP_DONG_API_KH.md`.
   Không có tệp đó thì máy dừng lại ở A1 (đúng lời phiếu).
2. **Mã giảm có áp lên thẻ không — hợp đồng v13 và sổ quyết định lệch nhau** (theo tóm ý của agent phụ, sẽ đối chiếu lại nguyên văn khi có tệp ở câu 1): v13 ghi
   "ma_giam tính trên tạm tính GỒM cả giá thẻ"; `thiet_ke/QUYET_DINH_APPKH.md` dòng 41 (POS 10.11) ghi "Voucher / mã giảm KHÔNG áp lên thẻ hạng".
   App KHÔNG đổi gì vì chuyện này (C6: số lấy nguyên báo giá POS; C3 "Trả thẻ trước" không gửi `ma_giam`). Nhưng nút "Thanh toán" cả giỏ vẫn gửi `ma_giam` như cũ → nếu POS
   theo v13 thì mã sẽ giảm cả phần thẻ, trái QĐ 10.11. Việc của POS — chủ quán chuyển chat POS (máy không được sửa `thiet_ke/trao_doi/` trong việc này).
3. (Không chặn — máy làm theo mặc định nếu chủ quán không nói khác) Hợp đồng v13 còn mã `DON_KHONG_HOP_LE` cho hạng đã xoá / không có. Phiếu C5 chỉ kể 4 mã.
   Mặc định: 4 mã của phiếu đánh dấu dòng thẻ; `DON_KHONG_HOP_LE` hiện nguyên lời POS (như hiện nay) — dòng thẻ sẽ tự bị đánh dấu "không còn bán" khi `/hang` mới không còn hạng đó (C2).

## Phát hiện
- Hợp đồng v12 (KH-TOMTAT-1) thêm `kenh`, `cach_nhan`, `tra[]`, `so_mon`, `mon_dau`, `giam` vào `GET /don` và `GET /don/:ma`. Việc này không dùng (ngoài phạm vi), chỉ chép hợp đồng.
- `daTra` (App.jsx ~210) chỉ chạy khi màn Theo dõi đơn đang mở: đơn trả xong lúc khách ở màn khác thì giỏ không tự dọn (có từ trước KH-THE-1; agent soát kế hoạch chỉ ra). Không sửa ở việc này.
