# Kế hoạch KH-SOHD-1

Đã đọc: `src/datDon.js`, `hoaDon.js`, `baoDonXong.js`, `BaoDonXong.jsx`, `HoaDonKhach.jsx`, `TheoDoiDon.jsx`, `Don.jsx` (Chi tiết + Lịch sử), `ThanhToan.jsx`, `ManQR.jsx` (`VeQR`), `canTuPos.js`.

## Phần A — hợp đồng
Chép từng byte `hop_dong_v11.md` → `thiet_ke/HOP_DONG_API_KH.md` (đã làm, `cmp` giống). `canTuPos.js` thêm dòng `don_v11` (`so_hd`, `tien_ve_da_cong_vi`, `thong_bao_tien_ve` — `GET /don/:ma`), `don_ds_v11` (cùng ba trường — `GET /don`), `hang_v10` (`chi_cap`, `goi[].so_thang`, `goi[].gia`, `thu_bac`), `dat_don_v11` (`so_hd` của `POST /don`).
- A: 1 file, ~8 dòng. B (sửa dòng cũ): không đủ — các trường mới thuộc cửa khác nhau. **Chọn A.**

## Phần B — số đơn
- A: MỘT hàm thuần `soDon(soHd, ma)` ở `src/hoaDon.js` (không import, bài thử nạp thẳng): `so_hd` là chuỗi khác rỗng → chính nó; không thì `#<ma>` (như nay). Mọi chỗ hiện gọi hàm này. ~6 dòng + sửa 8 chỗ gọi.
- B: thêm `soHienThi` vào mỗi parser (`docDon`, `docDatDon`) rồi các màn đọc. Lịch sử / dải báo / Thanh toán dùng dữ liệu thô nên vẫn phải gọi hàm → hai đường. **Chọn A.**
- `docDon` / `docDatDon` mang `soHd`. Tiêu đề màn khi chưa tải xong đơn: "Đơn hàng" (không để lộ mã App `A…`).
- `baoDonXong.js`: `xemDanhSach` thêm `nhan{ma→số}`; `tieuDeXong(nhan)` nhận nhãn đã đọc. `BaoDonXong.jsx` hiện nhãn.
- `ThanhToan.jsx`: `donCho` (đã có trong danh sách thô) → `soDon(donCho.so_hd, donCho.ma)`; `donKhac` (từ `kh_don_gui`, KHÔNG thêm trường vào bản ghi) → tra trong `dsDon` theo `ma`, không thấy → `#ma`. `moDon(…)` vẫn truyền `ma`.
- B2: không đụng `ma` ở đường dẫn / API / `kh_don_gui`.

## Phần C — tiền về muộn
- MỘT hàm thuần `cauTienVe(don)` ở `hoaDon.js`: `tien_ve_da_cong_vi` > 0 và `thong_bao_tien_ve` là chuỗi khác rỗng → chuỗi đó nguyên văn; không thì ''. `docDon` lưu `cauTienVe`; `Don.jsx` (ChiTietDon, dữ liệu thô) gọi trực tiếp.
- `TheoDoiDon`: có câu → hiện câu; không câu mà `tienVeChoDoiSoat` → giữ câu cũ. `ChiTietDon`: có câu → hiện (khuôn `.nt-state`).
- C3: `docHoaDon` tự bỏ dòng `ghi_no` (App không bao giờ hiện) → hết dòng thì `length === 0` → hai màn tự rơi về `mon[]` + Tổng; `HoaDonKhach` bỏ bộ lọc riêng (một chỗ).
- C2: thêm `ma_gd` vào nhóm `tra` của `NHOM`.

## Phần D — thẻ QR
- `src/qrThuongHieu.js` (hàm thuần): `dungTheQR(chuoi)` → `{ n, vien: 3, tong, cham: [{mau, d}] (4 nhóm màu, chấm tròn), finder: [{x,y,mau}] (3 ô góc), logo: {cx, cy, r} }`; mức H; ô finder 7×7 không vẽ chấm rời; chừa đĩa trắng đường kính ≤ 20% bề ngang; hằng `MAU_QR` ở đầu file. `noiDungCK(chuoi)`: đọc TLV EMV, trường `62` → `08`; hỏng → ''.
- `src/components/TheQR.jsx`: thẻ theo thư POS; `src/giaoDien/the_qr.css`; logo `public/anh/logo_tqd_192.png`.
- `TheoDoiDon.TraQR`: thay `VeQR` bằng `TheQR`; giữ đồng hồ / hết hạn / dòng ví.
- Phương án B (chấm vuông + vẽ vòng finder) bị loại: thư POS cấm.
- D6: KHÔNG có bộ giải mã QR trong máy (không zbarimg / jsQR / cv2; người gác chặn `npm install`) → ghi "chưa kiểm quét máy". Thay bằng bài thử cấu trúc: dựng lại lưới bit từ hình đã vẽ (finder + chấm) và so với ma trận `qrcode-generator`: ô ngoài đĩa logo phải KHỚP 100%, số ô mất ở đĩa logo ≤ ngưỡng H (đo bằng cách chạy lỗi: ≤ 30% từ mã, ở đây < 8%). Chủ quán quét tay (E4).

## Phần E — bài thử
Ánh xạ nghiệm thu → ca (`cong_cu/thu_KHSOHD1.js`, Phần 1 thuần + đọc nguồn, Phần 2 Chromium POS giả v11):
- A1 hợp đồng v11 từng byte + `canTuPos` có trường mới (Phần 1). B1: `soDon` (so_hd / null / số / rỗng), đọc nguồn 7 chỗ dùng `soDon`; Chromium: Theo dõi / Chi tiết / Lịch sử / Thanh toán / dải báo hiện `APP0016`, `so_hd: null` hiện `#mã`. B2: đường dẫn `/don/<ma>`. C1/C2/C3: hàm thuần + Chromium. D1/D2: hàm thuần (finder đặc, 4 màu, đĩa ≤ 20%, viền ≥ 3, TLV hỏng). D3: Chromium thẻ có số tiền + "APP0016 · TQDNOV06 APP0016", không chữ cuối. D4: `ManQR.jsx` không đổi (git diff). D5: màu chỉ ở hai tệp (K9). D6: cấu trúc + "chưa kiểm quét máy".
- Mọi luồng hợp lệ không bị chặn (K5): đơn quầy `so_hd` kiểu `HD0016` / `012` hiện đúng; `thong_bao_tien_ve` rỗng + `tien_ve_da_cong_vi` 0 → không hiện câu.
- Bài cũ phải sửa (E2): `thu_KHBAO1` (tieuDeXong, "#TQD50"), `thu_KHKHOP1` / `MUA1b` / `UI3b` (hợp đồng, danh sách trường), `thu_KHMUA1*`, `thu_KHHD1`, `thu_KHTT1` — grep rồi sửa theo hành vi mới; mỗi bài sửa có ca Phần 1 đỏ trên gốc.
- Ngân sách: app ~160 dòng, thử ~350.
