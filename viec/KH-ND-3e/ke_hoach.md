# KH-ND-3e — kế hoạch

Việc THƯỜNG, không chờ duyệt. Màn TIỀN: chuyển chữ, KHÔNG đổi logic tính / gửi đơn / PIN / QR / thăm dò trạng thái.

## Phần 1 — Danh mục `src/noiDung/nd/donHang.js` (A1–A3)
- **A (chọn):** một tệp, mỗi khoá một dòng qua ba hàm nhỏ (`mk(man)` chữ, `khoa()` mục khoá POS, `bien()`); ~150 dòng. Tiền tố theo màn: `tt.*` Thanh toán, `td.*` + `qr.*` Theo dõi đơn / thẻ QR,
  `dh.*` + `hd.*` Đơn hàng / hoá đơn, `pin.*` bảng PIN, `bao.*` + `khung.*` khung chung, `loi.*` câu báo lỗi App tự viết, `giam.*` tên dòng giảm.
- B: khai trong từng màn → /admin không tự sinh bảng được. Loại.
- `macDinh` chép NGUYÊN chữ đang chạy; câu có số / tên điền dùng `{bien}` (`tt.nut.viQr` = `Trừ ví {vi} + QR {qr}`…).
- A3: App thật sự tự viết lời cho `GIA_DA_DOI` (hai chỗ), `CHUA_MO`, `CHUA_RO`, `NGOAI_GIO` → `loi.*`; các mã khác (`PIN_SAI`, `VI_KHONG_DU`, `CACH_KHONG_KHOP`, `KHOA_GUI_SAI`) màn chỉ hiện nguyên `e.message` của POS → không có chữ để chuyển, chỉ gắn mục khoá `data-nd-khoa`.
- A2: số tiền, số đơn, giờ, lời POS → mục khoá `pos` (`tt.so`, `td.so`, `td.tien`, `dh.so`, `dh.tien`, `qr.tien`, `qr.dong`, `hd.dong`, `*.loiPos`…) gắn `data-nd-khoa`.

## Phần 2 — Màn đọc qua `nd()` (A1)
- **A (chọn):** `<Chu k as …>` cho chữ đứng riêng (cùng DOM, thêm `data-nd`); `nd(khoa, bien)` + `ndDau(khoa)` khi chữ đi cùng thuộc tính (nút chọn khoá theo trạng thái:
  `[kNut, bienNut]`, `[kVi, bienVi]`); `ndPhan` khi câu có chữ đậm xen giữa (`tt.quay.chu`, `td.vi.giu`). ~190 dòng đổi.
- B: gom chữ vào hàm trả chuỗi trong `ThanhToan.jsx` → thêm một lớp mới, vẫn lẫn logic. Loại.
- `datDon.js`: chỉ đổi dòng có chữ (`tenGiam`, `BUOC` → khoá, `chanDat`, hai hằng chữ bỏ). `buocTienTrinh` trả thêm `kt` / `ks` (khoá) cho màn gắn `data-nd`. Không đổi tên hàm / phép tính / lời gọi `api.js`.
- Phần chữ cứng cuối cùng: ký hiệu `→`, `×`, `·`, `—` nối ngoài nháy chữ không tính chữ cứng — giữ trong màn.

## Ca thử ↔ nghiệm thu
| Nghiệm thu | Ca (`cong_cu/thu_KHND3e.js` trừ khi ghi khác) |
|---|---|
| A1 | `kiemDanhMuc` = 0 lỗi; ≥ 100 mục; `man` đúng 5 nhóm; 10 tệp A1 đếm chữ cứng = 0; mọi khoá dùng có trong danh mục, không khoá thừa |
| A2 | mục khoá `pos` có `chiDuong`, mỗi mục khoá được gắn `ndDau()`; Chromium: `[data-nd-khoa]` ở số đơn, tiền, lời POS (PIN sai) |
| A3 | `loi.GIA_DA_DOI/…/NGOAI_GIO` là mục chữ; `datThongBao(e.message)` / `datChanPos(e.message)` còn nguyên (lời POS hiện nguyên) |
| A4 | 28 câu mẫu `macDinh` = chữ gốc; `tenGiam` / `buocTienTrinh` / `chanDat` / `guiDonAnToan` / `tieuDeXong` trả chữ y như cũ; so ảnh (nháp) 33 cặp 0 điểm lệch → `so_anh/` |
| B1 | Chromium: bản giả đổi 2–4 khoá (nút đặt, tiêu đề mục, `td.giuApp`, `pin.tra.t`…) → màn đổi theo, bản rỗng → như cũ; đặt đơn QR và đơn ví + PIN qua POS giả của `thu_KHMUA1b` đủ bước; `git diff` gốc → `datDon.js` chỉ đổi dòng có chữ |
| B2 | 7 bài cũ sửa cho đọc chữ ở danh mục (BAO1, MUA1, MUA1b, MUA1c, NHANH1, SOHD1, TT1) — mỗi bài thêm / sửa ≥ 1 ca ĐỎ trên gốc (`bang_chung_do.txt`) |
| B3–B5 | `doi_chieu_demo.md`; `ha_no_chu.js`; `trang_thai.md` |

Đường song song canh: `GioHang.jsx` dùng `tenGiam` (cùng chữ); `App.jsx` gọi `tieuDeXong` qua `datTieuDe` (cùng chữ); `Man.jsx` `DauManCon` nhận chuỗi (đã nd() ở màn gọi); mọi màn gọi `KhungLoi` (TrangTai) dùng chung.
K5 — luồng hợp lệ không bị chặn: bản rỗng → mọi màn y như cũ; khoá đúng không bao giờ ném lỗi; đặt đơn QR / ví / ví + QR / PIN sai → nhập lại vẫn như cũ (ca Chromium + 258 ca `thu_KHMUA1b`).
