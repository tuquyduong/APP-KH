# KH-ADMIN-1 — đối chiếu với demo Chế độ sửa (PATCH30–39 của `thiet_ke/app_kh_demo.html`)

Ảnh 390 × 844 trong `so_anh/` (dựng bằng `LUU_ANH=1 node cong_cu/thu_KHADMIN1.js` — cùng POS giả + kho giả của bài thử).
CSS: `src/giaoDien/che_do_sua.css` chép NGUYÊN giá trị các luật `.cms-*`, `.cs-*`, `#sheetCms` của demo (dòng 1480–1600); bộ kiểm K9 xanh (mọi màu có trong demo).
Lý do khác demo: (a) dữ liệu / việc sau · (b) chữ mẫu demo không dùng · (c) chưa có giỏ / đặt đơn · (d) màn rộng · **QĐ** = quyết định chủ quán ghi trong
CLAUDE.md §11 / `QUYET_DINH_APPKH.md` / phiếu (lý do được phiếu cho phép).

## Chế độ sửa trên màn khách (`390_trangchu_dang_sua.png`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Viền chỗ sửa `.cms-on [data-cms]` (1.5px nét đứt `#C38C40`) | `.cms-on [data-nd]` cùng giá trị | Bỏ `position:relative; cursor:pointer` của demo (đổi bố cục màn khách) — QĐ phiếu D2 "màn khách không đổi" |
| Viền chỗ khoá `.cms-on [data-lock]` (chấm `rgba(138,126,120,.45)`) | `.cms-on [data-nd-khoa]` cùng giá trị | — |
| Bút `<i class="cms-pen">` chèn VÀO phần tử, `pointer-events:none`; chạm CẢ phần tử mở bảng | Nút `.cms-pen` (cùng cỡ, màu, bóng) ở MỘT lớp phủ riêng `.cms-lop` (portal), đặt theo toạ độ phần tử; chỉ chạm bút mới mở bảng; chạm chỗ khác App chạy như khách | QĐ 11.11 + phiếu D2 (không chèn vào nút React — lỗi `removeChild`) |
| Chỗ đã đổi `.cms-ch` (viền đỏ `#B42A60`, bút đỏ) | Bút có nháp tô `#B42A60`; viền giữ vàng | Không đổi `className` của phần tử React (QĐ phiếu D2) |
| Bút chỗ khoá: không có (chạm phần tử → toast `LOCK_MSG`) | Bút 🔒 nền `#2E2430` (màu thanh demo); chạm → toast theo `khoaBoi` + `chiDuong` | Phiếu D2 (lời khoá theo danh mục, không `LOCK_MSG` cố định) |
| Thanh `.cms-bar`: "✎ Đang sửa / N thay đổi chưa xuất bản · bản X đang chạy" · Việc · Xem lại · Xuất bản (N) · ✕ | "✎ Đang sửa / N thay đổi chưa cập nhật · Bản X đang chạy" · Đi tới màn · Chữ của màn này · Xem lại · Cập nhật toàn bộ (N) · ✕ | Chữ "Cập nhật toàn bộ" (CLAUDE.md §11); "Việc" (thiếu ảnh / mô tả món) bỏ — món là dữ liệu POS (nhóm A, (a)); 5 nút → thanh xuống 2 dòng ở 390 (phiếu D1 chốt đủ nút) |
| `.cms-on .toast{bottom:150px}`, `.cms-on .screen{padding-bottom:170px}` | Giữ nguyên | — |
| Công tắc `.cms-tog` trong Tài khoản để bật sửa | Không có — bật ở `/admin` › "Bật Chế độ sửa" | CLAUDE.md §5 "không có mục quản trị trong app khách" |

## Bảng sửa (`390_bang_sua_chu.png`, `390_bang_sua_doan/nut/anh/danhsach/battat.png`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| `#sheetCms` + `.panel` (max 62%), đầu `.cs-h` (tên + "Xong") | Giữ | — |
| Bảng viết tay theo loại chỗ (`p.img`, `p.desc`, `p.tags`, `h.banner`, `h.need`, `h.featured`) | Bảng TỰ SINH theo `loai` của mục danh mục: chu `.cs-in` + đếm ký tự · doan `.cs-ta` · nut chữ + `select` (`.cs-feat`) · anh `.cs-img` + `.cs-up` · danhsach từng dòng (khung `.cs-dong`, nút `.cs-go`) · battat công tắc | CLAUDE.md §11 "bảng TỰ SINH từ danh mục" |
| Ảnh `cmsPic`: cắt giữa theo tỉ lệ, rộng 1080 / 640, WebP 0.8 (không được → JPEG) | Chép cách đó; thêm hạ chất lượng / thu nhỏ tới ≤ 500 KB; tải lên `POST /anh` thay vì giữ dataURL | Phiếu D3 + hợp đồng `/api/nd` (ảnh ≤ 512.000 byte) |
| Nhãn / chip `.cs-chips` (demo: chọn nhãn món) | Chip chỗ điền `{bien}` (bấm chèn; sáng khi có) | Phiếu D3 |
| "↺ Trả về như bản đang chạy" `.cs-undo` | "Lưu" `.cs-next` · "Bỏ thay đổi" · "Về mặc định" (`.cs-undo`) | Phiếu D3 (Lưu nháp ở kho; về mặc định) |
| Video món `.cs-vid`, `.cs-yt` | Không làm | Không có mục video trong danh mục — (a) |

## Xem lại (`390_xem_lai.png`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| `.cs-ch` mỗi thay đổi: tên, `<del>` cũ / `<ins>` mới, "Tới chỗ này" / "Bỏ" | Giữ; thêm người + lúc của nháp | Phiếu D8 |
| Nút `.cs-pub` "Xuất bản N thay đổi · bản X+1" + dòng gợi ý | "Cập nhật toàn bộ (N) · bản X+1" + ô ghi chú (≤ 500) | CLAUDE.md §11 + hợp đồng `ghi_chu` |
| Lịch sử `.cs-hi` ngay dưới Xem lại | Chuyển sang `/admin/lichsu` (`390_lich_su.png`) | Phiếu E1 |

## Khu quản trị `/admin` (`390_admin_dang_nhap.png`, `390_admin_bang.png`, `390_lich_su.png`)
Không có trong demo (demo bật sửa bằng công tắc trong App). Dựng bằng khung `.phone/.screen` + khối `.cs-*` của demo (không màu mới); bố cục `.qt-khung` chỉ có khoảng cách.
Lý do: CLAUDE.md §5 / §11 (khu quản trị riêng, đăng nhập tài khoản POS) + phiếu C, E.

## Chữ của màn này · Đi tới màn (`390_chu_cua_man.png`)
Không có trong demo (demo có "Việc"). Dòng dùng `.cs-todo` của demo; nút màn dùng `.cs-go`. Lý do: QĐ 11.11 + phiếu D5, D6.

## Màn khách KHÔNG đổi khi không sửa (G6)
So ảnh trước (cây gốc 3d35772) ↔ sau (HEAD), cùng POS giả, tắt chuyển động: xem `trang_thai.md` › G6 (số điểm khác của Trang chủ, Menu, Ưu đãi).
