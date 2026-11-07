# KH-HANG-2 — trạng thái

## Đồng bộ đầu phiên (skill bước 1)
- Nhánh `viec/KH-HANG-2`; cây sạch; `git fetch origin viec/KH-HANG-2`: HEAD = FETCH_HEAD = `9c5438a` (không cần kéo).
- `git log --oneline -3` lúc bắt đầu:
  - `9c5438a PHIEU: KH-HANG-2`
  - `ab9fe0f TIEN-DO: mo dot 3 song song (KH-SOHD-1 so_hd + tien ve + the QR thuong hieu, hop dong v11; KH-HANG-2 hang HANG-1 v10; KH-UI-5b Ke hoach); duyet 7 mau the QR; thu POS/App 06.11`
  - `0d140b3 TIEN-DO: KH-BAO-1 xong (chat soat cuoi DAT, gop PR)`

## Ghi chú vận hành
- Người gác chặn `git stash` và chặn bash có chữ "token" trong lệnh/file script chưa commit → lấy bản gốc bằng `git archive 9c5438a` vào nháp; ghi bài thử bằng Write, commit trước khi chạy.
- Không có thông báo đổi model giữa phiên. Stop hook không đòi đổi tác giả / amend / rebase.
- Soát kế hoạch bằng agent phụ: chưa chạy (kế hoạch nhỏ, nêu ở `ke_hoach.md`).

## Câu hỏi
(không có)

## Phát hiện
- `thu_KHHANG2` ca B1 trong trình duyệt xanh cả trên gốc (app còn vẽ lại `ChuongTrinhToi` do nguồn khác), nên bằng chứng đỏ của B1 là ca đọc nguồn `dungKho(khoGioHoatDong)`. Không ảnh hưởng tính đúng của bản vá (hook chỉ chặn việc vẽ lại phụ thuộc may rủi).
- `thiet_ke/mau_*`/ảnh demo cùng cỡ để so ảnh chưa dựng (xem CHƯA KIỂM).

## Bảng chỗ vá → bài thử (không có đột biến VS-/BV-: việc giao diện, không tiền / bảo mật; không có `dot_bien.py`)
| Chỗ vá | Bài thử bắt |
|---|---|
| `giaHang.js` `laHangChiCap`, `dongGoi`, chữ cố định | `thu_KHHANG2` Phần 1 (A1, A2) — đỏ trên gốc |
| `UuDai.jsx` `TheHang` (`het_han: null`, `chi_cap`, `goi[]`) | `thu_KHHANG2` Phần 2 A1/A2/A3 ×3 cỡ; `thu_KHUI3d` đọc nguồn — đỏ trên gốc |
| `UuDai.jsx` `ChuongTrinhToi` `dungKho(khoGioHoatDong)` (B1) | `thu_KHHANG2` B1n, `thu_KHCT1` B1 — đỏ trên gốc (đọc nguồn) |
| `UuDai.jsx` `ChuongTrinhToi` `dauTien` (B2) | `thu_KHHANG2` B2 ×3 + mời nhập; `thu_KHCT1` — đỏ trên gốc |
| `hang.css` | `thu_KHHANG2` C1 |

## Nghiệm thu từng mục (D4 chủ quán thử tay ở dưới)
- A1: `thu_KHHANG2` A1 (Phần 1 `laHangChiCap`, chữ cố định; Phần 2 `khach-co-han/khong-han/hang-tang` ×360/390/430).
- A2: `thu_KHHANG2` A2 (`dongGoi`, nguồn không `gia_the`, `vang-lai` ×3, `vang-lai-khong-goi`, không nút mua, thứ tự POS).
- A3: `thu_KHHANG2` A3 (`hangCoGiam`, `vang-lai-du-lieu-hong`, `khach-thieu-het-han`).
- A4: `thu_KHHANG2` A4 (chú thích `thu_bac`).
- B1: `thu_KHHANG2` `b1-hien` / `b1-an` + `B1n`; `thu_KHCT1` B1.
- B2: `thu_KHHANG2` `b2-chuc` ×3, `b2-moi`, đối chứng `b2-mot-the`; `thu_KHCT1` `hai-sinh-nhat`.
- C1: `thu_KHHANG2` C1 + không tràn ngang 360/390/430 (K9 xanh trong `npm test`).
- C2: ảnh 360/390/430 trong `so_anh/` (thẻ có hạn, không thời hạn, hạng tặng, bảng vãng lai có gói, hai sinh nhật); `doi_chieu_demo.md`.
- D1: `cong_cu/thu_KHHANG2.js` (16 ca với `KHONG_TRINH_DUYET=1`, 73 ca có trình duyệt).
- D2: `thu_KHUI3d`, `thu_KHCT1` sửa, mỗi bài có ca đỏ trên gốc (`bang_chung_do.txt`); không dùng `## Bài thử cũ sửa`.
- D3: `npm test` 36 đạt · 0 hỏng; `--day-du` 38 đạt · 0 hỏng; cổng `tinh`/`chay` — dòng cuối file.

## Báo cáo 7 mục
1. VIỆC: KH-HANG-2 — thẻ hạng theo HANG-1 (v10) + 2 sửa khối chương trình đặc biệt.
2. ĐÃ SỬA: `src/giaHang.js` (+`laHangChiCap`, `dongGoi`, 2 hằng chữ, chú thích `thu_bac`); `src/pages/UuDai.jsx` (`TheHang`: "Không thời hạn", dòng hạng tặng, gói tháng, không đọc `gia_the`; `ChuongTrinhToi`: đăng ký kho giờ hoạt động, dòng chúc mừng/mời nhập chỉ ở thẻ sinh nhật đầu); `src/giaoDien/hang.css` mới (4 dòng); bài thử `thu_KHHANG2` mới, `thu_KHUI3d`, `thu_KHCT1` sửa.
3. BÀI THỬ: xem `bang_chung_do.txt`; SỐ CA thu_KHHANG2 16, thu_KHUI3d 34, thu_KHCT1 19 (`KHONG_TRINH_DUYET=1`).
4. ĐÃ RÀ K4: `grep gia_the` — `UuDai.jsx`, `giaHang.js` sạch; còn ở `src/kiemKhop/canTuPos.js` và bài thử việc khác (ngoài Phạm vi, thuộc KH-SOHD-1). `Thẻ hết hạn` / `het_han` chỉ ở `TheHang`. `sinhNhatHomNay` chỉ ở `ChuongTrinhToi`.
5. CHƯA KIỂM: (i) so ảnh demo ↔ app cùng cỡ + ảnh tô chỗ lệch (chưa dựng; ảnh app đã lưu, chỉ thêm dòng chữ trong khuôn demo); (ii) POS thật: chưa thử với hạng `chi_cap` thật (D4); (iii) trình duyệt Zalo; (iv) soát kế hoạch bằng agent phụ.
6. GIT: nhánh `viec/KH-HANG-2`, commit từng file; chưa merge, chưa tạo PR.
7. BÀI HỌC: xem mục dưới.

## Bài học
- BỎ: người gác chặn `git stash`, chặn bash chạy file có "token" khi chưa commit, và chặn `for` / gộp lệnh chạy bài thử → lệnh ghi bài thử dùng Write, commit trước, mỗi lệnh chạy bài thử đứng một mình. Một lần, đã có thông báo rõ từ người gác; không thêm luật.
- BỎ: ca trình duyệt B1 xanh trên gốc — đỏ nhờ ca đọc nguồn; ghi ở Phát hiện.
- NGUYÊN TẮC / KHOÁ: không đề xuất mới.
