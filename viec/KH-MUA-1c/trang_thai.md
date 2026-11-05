# KH-MUA-1c — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh: `viec/KH-MUA-1c`; cây sạch (`git status --short` rỗng).
- `git fetch origin viec/KH-MUA-1c` → HEAD `12fe94d` · FETCH_HEAD `12fe94d` (bằng nhau, không kéo).
- `git log --oneline -3`:
```
12fe94d PHIEU: KH-MUA-1c
a0b68d0 TIEN-DO: mo KH-MUA-1c (KHO_BAN = chua ro, gui lai cung khoa; hop dong v9; Theo doi don doc giu vi tu POS) - so v25
8497ce3 TIEN-DO: KH-MUA-1b xong (chat soat cuoi DAT, gop PR); quyet dinh 03.11 (loi chao du ten, khach App du truong nhu POS); thu App 03.11 b - so v24
```

## Bước đang ở
- Bước 3 xong: `ke_hoach.md` đã viết, agent phụ soát kế hoạch (kết quả ở cuối `ke_hoach.md`).
- Phiếu dặn **"Chờ duyệt kế hoạch"** → commit, push, DỪNG. Chưa viết bài thử, chưa sửa `src/`.
- Ngoại lệ đã làm: nghiệm thu **A1** (chép `viec/KH-MUA-1c/hop_dong_v9.md` → `thiet_ke/HOP_DONG_API_KH.md`, `cmp` khớp). Lý do: Stop hook báo `npm test` ĐỎ
  ngay trên commit phiếu `12fe94d` — `thu_KHUI3b.js` ca A1 "HOP_DONG_API_KH.md = bản hop_dong_v<N>.md mới nhất trong viec/" (173 · 1), vì phiếu thêm v9 vào `viec/`
  mà `thiet_ke/` còn v5. Chép nguyên byte, không quyết định gì; sau chép `thu_KHUI3b.js` 174 · 0, `thu_KHKHOP1.js` 84 · 0.

## Câu hỏi
- Q1 (đụng tiền, xin duyệt cùng kế hoạch): `ke_hoach.md` mục 6 chỉnh 1 — trong một chuỗi tự gửi lại, 4xx có code đến SAU một lần "chưa rõ" (vd 429 sau KHO_BAN)
  thì GIỮ bản ghi = "chưa rõ", không coi là chưa tạo; KHO_BAN tự gửi lại 8 lượt (dưới trần 10 lần / 10 phút của POS) thay ~30 như phiếu gợi ý. Đồng ý thì làm theo.

## Phát hiện
- `src/giaoDien/giaoDien.css:13` `:where(button){ … text-align:inherit }` làm MỌI `<button>` mà demo để mặc định (chữ giữa) bị căn theo khối cha (trái).
  Ngoài `.pin-pad` (sửa trong việc này), còn ít nhất `.qty-ctrl button` (giỏ hàng, `demo_mua.css:11` — phiếu CẤM sửa giỏ) và `.promo-box button`
  (`demo_1.css:58`, có padding nên chưa thấy lệch). Sẽ đo bằng Chromium lúc làm và ghi danh sách đủ ở đây; không sửa ngoài `.pin-pad`.
