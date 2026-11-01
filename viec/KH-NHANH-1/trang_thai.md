# KH-NHANH-1 — trạng thái

## Bước 1 — đối chiếu bản chụp
- HEAD = 7d07931 · FETCH_HEAD = 7d07931 (bằng nhau, không kéo)
```
7d07931 PHIEU: KH-NHANH-1
37024c6 TIEN-DO: KH-UI-3d xong (PR #12 5ed0c1e); mo KH-NHANH-1; quyet dinh 01.11 (toc do, luu tom tat, hang); them KH-PWA-1 - so v18
5ed0c1e Merge pull request #12 from tuquyduong/viec/KH-UI-3d
```

## Chỗ vá → đột biến (dot_bien.py)
| Chỗ vá | Đột biến |
|---|---|
| ThanhToan.jsx: số dư ví chỉ từ `dungTai(layToi)` gọi sau khi mở màn (F1) | VS-TT-DUNG-SO-DU-KHO |
| ThanhToan.jsx: "Đang cập nhật số dư…" trong lúc chờ (F1) | BV-SO-DU-DANG-CAP-NHAT |
| duLieuKhach.napTomTat: chỉ bản của đúng chủ `kh_chu` (E3) | VS-TOMTAT-KHACH-KHAC |
| duLieuKhach.dungCua: mở màn chỉ lấy khi quá 5 phút (A3) | VS-TAB-GOI-LAI |
| duLieuKhach.taoCua: dùng chung lệnh đang chờ (A2) | VS-KHONG-DUNG-CHUNG-LENH |
| duLieuKhach.taoCua: bỏ kết quả phiên cũ (D4) | VS-KET-QUA-PHIEN-CU |
| duLieuKhach.taoCua: lỗi giữ bản cũ (A3) | VS-LOI-XOA-BAN-CU |
| duLieuKhach.lamMoiKhiQuayLai: quy tắc 60 giây (D1) | VS-QUAY-LAI-KHONG-SO-GIO |
| luuMay.js: `kh_tom_tat` trong danh sách xoá (E2) | VS-DANGXUAT-GIU-TOMTAT |
| tomTatLuu.rut: không giữ qr (E1) | VS-TOMTAT-CO-QR |
| ManDau.jsx: quy tắc ngày (C1) | VS-MANDAU-LAN-HAI |
| giaHang.hangCoGiam: bỏ hạng 0% (G1) | VS-HANG-0-CON-HIEN |
| UuDai.jsx TheHang lọc hạng (G1) | BV-HANG-0 |
| App.jsx tải trước bốn cửa (B1) | BV-TAI-TRUOC |
| App.jsx donPhien xoaKhoKhach (D4) | BV-XOA-KHO-KHI-DOI-PHIEN |
| App.jsx đăng nhập → doiKhach trước khi bật phiên (B2, E2) | BV-DOIKHACH-KHI-DANG-NHAP |
| App.jsx dungLamMoiNgam (D1, D2) | BV-LAM-MOI-NGAM |
| UuDai.jsx nhận mã → lamMoi diem, voucher, toi (D3) | BV-NHAN-MA-LAM-MOI |

Tên đột biến: VS-TT-DUNG-SO-DU-KHO, VS-TOMTAT-KHACH-KHAC, VS-TAB-GOI-LAI, VS-DANGXUAT-GIU-TOMTAT, VS-MANDAU-LAN-HAI, VS-TOMTAT-CO-QR,
VS-KHONG-DUNG-CHUNG-LENH, VS-KET-QUA-PHIEN-CU, VS-LOI-XOA-BAN-CU, VS-QUAY-LAI-KHONG-SO-GIO, VS-HANG-0-CON-HIEN, BV-TAI-TRUOC,
BV-XOA-KHO-KHI-DOI-PHIEN, BV-DOIKHACH-KHI-DANG-NHAP, BV-LAM-MOI-NGAM, BV-NHAN-MA-LAM-MOI, BV-SO-DU-DANG-CAP-NHAT, BV-HANG-0
