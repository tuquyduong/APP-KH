# Kế hoạch KH-LUU-1

Mốc đối chiếu: HEAD = origin = fe13962; log: fe13962 PHIEU: KH-LUU-1 · 7af1053 TIEN-DO: KH-UI-5a xong… · a37d271 Merge PR #4 (KH-UI-5a).

## Phương án
- **Mô-đun `src/luuMay.js`** — A: một file ~45 dòng (băm cyrb53 đồng bộ, danh sách khoá, kho tiêm vào). B: dùng SubtleCrypto SHA-256 (bất đồng bộ, kéo async vào mọi chỗ gọi, +20 dòng). **Chọn A** (phiếu nói dấu vết "không dùng làm bí mật").
- **Biết khách là ai** — A: `App.jsx` tự gọi `layToi()` một lần mỗi khi `dangNhap` thành true (mở app có token hoặc vừa đăng nhập) → `doiKhach(sdt)` → `tn.nap()`. B: móc vào `api.layToi` chạy mỗi lần ai đó gọi. B sai: đăng nhập xong vào thẳng /uudai (không ai gọi /toi) thì `kh_chu` chưa ghi, lần lưu trắc nghiệm đầu bị xoá oan khi /toi gọi sau. **Chọn A** (+1 request /toi mỗi phiên).
- **Hook** — thay `donSach` bằng `donBoNho` (chỉ bộ nhớ, dùng cho hết phiên VÀ đăng xuất); xoá khoá do `xoaTatCa()` ở `dangXuat`. Thêm `nap()` đọc lại bản lưu. Không còn hàm chết.
- Khoá `kh_tracnghiem` export từ `tracNghiemLuu.js` để `luuMay.js` import (một nơi đặt tên).

## Ca thử ↔ nghiệm thu
| Mục | Ca |
|---|---|
| A1 | dauVet cùng số/định dạng khác → bằng; khác số → khác; không chứa số thô; cungKhach đúng/sai/chuaBiet |
| A2 | doiKhach: khác → xoá + ghi chủ mới; cùng → giữ; chưa có kh_chu + dữ liệu cũ → xoá; chưa có cả hai → chỉ ghi chủ; sdt rỗng → không làm gì |
| A3 | xoaTatCa xoá kh_tracnghiem + kh_chu, không đụng khoá lạ (kh_token) |
| A4 | kho ném lỗi mọi hàm không vỡ; ghiChu trả false |
| B1–B4 | nguồn: dangXuat gọi xoaTatCa; donPhien gọi tn.donBoNho (không xoaKetQua); hook giữ khiHau/anToan |
| C1 a–g | Chromium chạy App thật (esbuild bundle + fetch giả): (a) 401 rồi đăng nhập lại cùng số → còn; (b) khách khác → mất; (c) Đăng xuất → mất kể cả kh_chu; (d) bản cũ không kh_chu → mất; (e) chưa đăng nhập ô khoá, không lộ; (f) kho chặn không vỡ; (g) khiHau/anToan còn, gợi ý an toàn hiện |
| C2 | sửa 2 ca của thu_KHUI5a (dòng 269, 273) |
Đường song song: `datKhiHetPhien` và `dangXuat` cùng qua `donPhien`; mọi luồng hợp lệ (cùng khách mở lại) không bị chặn — ca (a), (g).
