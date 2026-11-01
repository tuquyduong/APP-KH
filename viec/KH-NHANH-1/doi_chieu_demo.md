# KH-NHANH-1 — đối chiếu demo (patch39) ↔ app

Việc này đổi CÁCH LẤY dữ liệu (kho chung, tải trước, cập nhật ngầm); không đổi khối, màu, phông, thứ tự của màn nào — các khối vẽ bằng cùng JSX / CSS như trước.
Chỉ hai màn có chữ / nội dung hiện khác trước → chụp cặp ảnh ở `so_anh/`: `demo_*_390.png` (demo, `go(id)`, 390×844) và `ung-dung_*_{360,390,430}.png`
(app, POS giả trễ 700 ms, Chromium; chụp bằng `LUU_ANH_DIR=… node cong_cu/thu_KHNHANH1.js`).

## Thanh toán (`#checkout`, demo `checkout`) — `ung-dung_thanhtoan-dang-cap-nhat_*.png` ↔ `demo_thanhtoan_390.png`
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| "Cách trả tiền" → dòng Ví nội bộ (`.opt-row`, dòng phụ "Số dư 85.000đ · …") | cùng khối, cùng lớp CSS; trong lúc chờ /toi dòng phụ ghi "Đang cập nhật số dư…", dòng mờ (`btn-disabled`) | demo không có trạng thái chờ — (a) dữ liệu POS chưa về; phiếu F1 (tiền: luôn lấy số dư mới). Sau khi /toi về: "Số dư 100.000đ" như trước |
| Giao hàng GHN, địa chỉ, giờ giao, "Phần còn lại" | như KH-MUA-1 (không đổi trong việc này) | (c) / (b) — xem viec/KH-MUA-1/doi_chieu_demo.md |

## Ưu đãi (`#rewards`, demo `rewards`) — `ung-dung_uudai-vanglai-hang_*.png` ↔ `demo_uudai_390.png`
| Khối trong demo | Đã làm | Khác gì, lý do |
|---|---|---|
| thẻ hạng (`.tier-card`) | bảng "Hạng thành viên" chỉ còn hạng giảm thật (bỏ hạng 0%) | demo vẽ số mẫu — (b); bỏ hạng 0% theo `thiet_ke/QUYET_DINH_APPKH.md` mục 01.11 (sổ quyết định thắng, CLAUDE.md §10) |
| Lịch sử điểm | ẩn trong lúc đang hiện bản tóm tắt trên máy (< 1 giây, tới khi /diem về) | (a) dữ liệu POS chưa về — không hiện "Chưa có điểm nào" sai |

## Ảnh tô chỗ lệch (`so_anh/lech_*_390.png`, công cụ nháp so điểm ảnh, ngưỡng 40, đỏ = khác)
- `lech_thanhtoan_390.png` (lệch 18,4%): đỏ ở khối nhận hàng / địa chỉ / giờ giao (demo GHN + nhiều địa chỉ — KH-MUA-1/KH-MUA-2, không đổi ở việc này) và dòng Ví
  nội bộ (chữ "Đang cập nhật số dư…" — F1, lý do (a)). Không có khối nào khác lệch do việc này.
- `lech_uudai_390.png` (lệch 33,5%): demo vẽ khách ĐÃ đăng nhập + Giờ vàng + Sưu tập Tứ Quý; ảnh app là khách VÃNG LAI (ca G1) → lệch cả màn là các khác biệt đã ghi
  ở viec/KH-UI-3d/doi_chieu_demo.md (vãng lai, Giờ vàng không có, Sưu tập — việc sau). Việc này chỉ đổi nội dung thẻ hạng (bỏ hạng 0%).

## Màn mở
Không đổi hình. Chỉ đổi tần suất: lần đầu mỗi ngày (thay "mỗi phiên") — `thiet_ke/QUYET_DINH_APPKH.md` mục 01.11 (CLAUDE.md §10). Không có ảnh mới.
