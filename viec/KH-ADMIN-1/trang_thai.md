# KH-ADMIN-1 — trạng thái

## Bước 1 — đối chiếu bản chụp (15.11.2026)
- Nhánh: `viec/KH-ADMIN-1`; cây sạch (không dòng sửa dở).
- `git fetch origin viec/KH-ADMIN-1` → HEAD `3d35772`, FETCH_HEAD `3d35772` (bằng nhau — không kéo).
- `git log --oneline -3`:
```
3d35772 PHIEU: KH-ADMIN-1
ea0281e TIEN-DO: mo KH-ADMIN-1 (/admin: dang nhap tai khoan POS, Che do sua tren App, bang sua tu sinh, phien ban, Xuat/Nhap; Opus, cho duyet ke hoach) + KH-QC-1 (quang cao doc GET /quang-cao, hop dong v16; Sonnet); them KH-HUY-1; quyet dinh 14.11 (b); ban giao chat 14.11 toi
474eda6 TIEN-DO: KH-ND-3d, KH-THE-1 xong (chat soat cuoi DAT, gop PR #36 #37); mo KH-THE-2 (the hoi vien theo thiet ke 14.11: so sanh nhanh len dau, Mua ngay thang Thanh toan chi QR, the khong vao gio, Chao mung hoi vien, the Uu dai theo tinh trang; Opus, cho duyet ke hoach); them KH-THU-2; quyet dinh 14.11; thu POS 13.11 + 14.11; ban giao chat 14.11
```
- Có commit `PHIEU: KH-ADMIN-1` (`3d35772`).

## Bước 2 — đã đọc
Phiếu, CLAUDE.md, KHUON_LOI.md, hợp đồng `/api/nd` v1 (sha256 `836eb6ba2554e82daa7ef8be42bfe68d12754ed45540ad35795fe800d503b197` — khớp phiếu A1), code vùng sửa (danh sách ở đầu `ke_hoach.md`).

## Bước 3 — kế hoạch
`viec/KH-ADMIN-1/ke_hoach.md`. Phiếu dặn **Chờ duyệt kế hoạch** → commit, push, DỪNG. Câu hỏi xin duyệt cùng kế hoạch: `ke_hoach.md` §6 (Q1–Q4).

## Câu hỏi
Xem `ke_hoach.md` §6 — Q1 (thêm một dòng `export DS_MAN` ở `src/duongDan.js` cho "Đi tới màn"), Q2 (`/kiemkhop` → Trang chủ), Q3 (`/admin/kiemkhop` vẫn dùng token khách của máy),
Q4 (khoá nút Đăng xuất / xoá theo danh sách khoá `data-nd`).

## Phát hiện
- `src/kehoach.js:121` `holList` gộp lễ âm theo TÊN (`thay[n]`): chủ quán đổi tên MỘT trong ba ngày Tết ở /admin → Tết hiện hai lần trong "ngày lễ gần nhất". Ngoài F1 — việc sau.
