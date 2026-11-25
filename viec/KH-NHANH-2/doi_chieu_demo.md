# KH-NHANH-2 — đối chiếu demo

Demo patch39 (`thiet_ke/app_kh_demo.html`) KHÔNG có biểu tượng chờ (demo không gọi máy chủ). Mẫu là BẢN THỬ chủ quán chọn 18.11 (kiểu B, sửa: "chỉ hình tròn xoay,
không nền trắng, không làm mờ màn") — `viec/KH-NHANH-2/mau_cho.css`. Màu chỉ trong bảng demo (K9 xanh): `--pink`, `--pink-dark`, `--muted`, `#fff`, `rgba(255,255,255,.35)`.

## Mọi màn (khung `.phone`)
| Khối | Bản thử / demo | Đã làm | Khác gì, lý do |
|---|---|---|---|
| Vòng xoay giữa màn | `.cho-phu` (lớp bọc inset:0) › `.cho-nen` › `.cho-xoay.to` 36 px viền 4 px | MỘT phần tử `.cho-xoay.to.cho-giua` 36 px viền 4 px, absolute giữa `.phone`, pointer-events none | Bỏ lớp bọc toàn màn (phiếu A2: không phủ); hình giống hệt |
| Trễ hiện | 300 ms | 300 ms (`MS_TRE_CHO`) | — |
| Đếm lượt | mọi lượt | chỉ lượt khách chờ (phiếu A1) | phiếu |
| Giảm chuyển động | — | 2,4 s / vòng | phiếu A2 |

## Giỏ hàng / Thanh toán đồ uống — bảng tiền
| Khối | Bản thử | Đã làm | Khác |
|---|---|---|---|
| Đang tính lại | `.bang-tien.cho-mo` dòng .45, tổng .8, vòng 14 px trước số Tổng | như bản thử | — |
| Chưa có báo giá | "Đang tính tiền…" + vòng nhỏ (`.cho-tinh`) | như bản thử, chữ là mục `gio.dangTinh` | — |
| Nút "Tiếp tục" Giỏ | bản thử không khoá | KHOÁ khi đang tính lại, số trên nút chỉ theo báo giá mới | phiếu B2 / D1 |

## Nút gửi
| Nút | Bản thử | Đã làm |
|---|---|---|
| Đặt đơn (Thanh toán đồ uống / thẻ / nạp) | vòng trắng (`.cho-xoay.trang`) trước chữ | như bản thử; trắng = rgba(255,255,255,.35) + #fff (màu .45 của bản thử không có trong demo — K9) |
| Xác nhận bảng PIN | — | vòng thường (nút nền trong, chữ hồng) |

Ảnh: `so_anh/` (390×844): `trangchu_dang_tai.png`, `gio_dang_tinh_lai.png`, `thanh_toan_dang_gui.png` — bản nhánh; bản gốc cùng thời điểm hậu tố `_goc`.
