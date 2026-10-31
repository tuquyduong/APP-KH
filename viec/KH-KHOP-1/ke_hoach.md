# Kế hoạch KH-KHOP-1 — trang /kiemkhop

Đọc code thật trước khi lập: `src/api.js` (goi, CUA_CONG_KHAI, mã lỗi `MANG_LOI`), `src/duongDan.js` (BANG), `src/heThong.js` (`dungHeThong` tự gọi
/hang, /gio-vang, /gio-hoat-dong khi mở app và MỖI PHÚT), `src/dungMenu.js` (gọi /menu khi mở), `src/App.jsx` (gọi /toi khi có token),
`thiet_ke/HOP_DONG_API_KH.md` (hợp đồng bản 2: chưa có `/gia-han`, `gia_mon`, `nhu_cau`, `/gio/bao-gia`, `POST /don`).

## Điểm vướng đã thấy (ảnh hưởng thiết kế)
1. Vỏ app (App.jsx) TỰ gọi /hang, /gio-vang, /gio-hoat-dong, /menu, /toi lúc mở và hỏi lại mỗi phút. Nếu trang chỉ gọi thêm thì mỗi cửa bị gọi ≥ 2 lần
   và còn gọi theo giờ → trái B4. Cách xử: `src/main.jsx` thấy đường dẫn `/kiemkhop` thì render trang riêng `KiemKhop` thay `App` → vỏ không chạy, không sửa App/heThong/dungMenu
   (agent soát đề nghị, ngắn hơn cờ `bat`). Rời trang = tải lại. Dòng BANG vẫn thêm (luật đường dẫn một chỗ).
2. Hợp đồng trong kho là bản 2, nên `/menu` ghi `token: true`, trong khi quyết định là menu mở cho vãng lai (v3). Mục `/menu` đặt `token: 'tuy_chon'`;
   POS còn đòi đăng nhập (401) → trang báo ⏳ "chờ KH-API-3", không báo ✗.
3. Một cửa có nhiều mục (vd /menu: trường cũ + `nhu_cau[]` + `mo_ta`…) → gọi MỘT lần theo khoá cửa, các mục dùng chung kết quả. `/gio-hoat-dong` của phần
   Kết nối dùng chung kết quả với bảng. `/don/:ma` lấy mã từ `/don` vừa gọi (mã không hiện ra, không lưu).
4. Danh sách rỗng (vd `lich_tuan[]` rỗng, khách chưa có đơn) không kiểm được trường con → trạng thái "chưa kiểm được", không báo ✓ bịa (K3).

## Phương án
| Phần | A (chọn) | B | Lý do chọn |
|---|---|---|---|
| Danh sách | 1 file `canTuPos.js`, mảng tĩnh có cờ `co` (đã có trong hợp đồng) | đọc hợp đồng .md lúc chạy | `thiet_ke/` không nằm trong gói; bài thử A2 đối chiếu hai chiều thay cho việc đọc lúc chạy |
| Logic | `kiemKhop.js` hàm thuần (so trường lồng, xếp nhóm, phân loại kết nối) ~70 dòng | gộp vào trang | bài thử nạp thẳng được |
| Gọi mạng | map "GET /cửa" → hàm `api.js` có sẵn, ở trang | thêm hàm vào `api.js` | không đụng hợp đồng K8, không thêm cửa |
| Vỏ không gọi | `main.jsx` chọn trang riêng (2 dòng) | cờ `bat` ở 3 chỗ | ít dòng hơn, không đụng K5 |
| Đường dẫn | 1 dòng BANG `kiemkhop`, `tab: null`, không canDN | — | B1; thanh tab giữ tab trước |

Ước lượng: canTuPos ~45, kiemKhop ~70, KiemKhop.jsx ~110, sửa App/heThong/dungMenu/duongDan ~10 → ~235 dòng app (ngân sách 180: vượt vì bảng 25 mục
và 4 trạng thái kết nối; không thu gọn thêm được mà vẫn đủ B2/B3). Bài thử ~220 dòng.

## Ca thử ↔ nghiệm thu
- A1 danh sách đủ khoá, `khi`/`viec_pos` hợp lệ; ≥ 20 mục · A2 `co:true` ⇒ cửa có trong hợp đồng; `co:false` ⇒ KHÔNG có trong hợp đồng + có `viec_pos`; trường mục cũ ⊂ `tra` của hợp đồng.
- Hàm thuần: `kiemTruong` (đủ / thiếu / lồng `a[].b[].c` / rỗng / null giữa đường), xếp nhóm trước/sau KT, phân loại kết nối (thông / MANG_LOI / KH_CHUA_CAU_HINH / lỗi khác), trạng thái mục (trường mới thiếu → ⏳, trường cũ thiếu → ✗, 401 ở cửa `tuy_chon` → ⏳).
- B1 `/kiemkhop` ở BANG, tab null, không canDN, không có trong ThanhTab/TaiKhoan/Menu (grep) · B2 bốn tình huống kết nối (Chromium + POS giả) · B3 ✓ đủ / ✗ thiếu / ⏳ chưa có trong hợp đồng, cửa token khi chưa / đã đăng nhập
- B3 không gọi cửa ngoài hợp đồng, không POST/PUT (đếm lời gọi của POS giả) · B4 mỗi cửa đúng 1 lần, không gọi lại sau 70 giây, "Kiểm lại" chống dồn ≥ 5 giây · B5 không số điện thoại / tên / mã đơn trên trang, localStorage không đổi · B6 dòng ghi chú đầu tệp · C1 360/390/430 + chữ 130%, không tràn ngang, lỗi JS = 0.
- Luồng hợp lệ không bị chặn (K5): các trang khác vẫn tự nạp /hang, /gio-vang, /menu như cũ khi KHÔNG ở /kiemkhop (thu_KHLINK1, thu_KHMUA1 giữ xanh); mở /trangchu vẫn nạp như cũ.

- Bổ sung sau soát: ✓ cho trường mới khi POS đã trả; danh sách rỗng → "chưa kiểm được"; cửa `tuy_chon` khi đã có token; giờ POS + độ lệch hiện trên trang; noindex bỏ (index.html ngoài phạm vi, không có chỗ đặt sẵn).

## Đường song song cần canh
`dungHeThong` (hẹn giờ mỗi phút + sự kiện visibilitychange), `dungMenu`, `layToi` trong App; `api.js` 401 → `xoaToken` (trang mở với token hết hạn sẽ đăng xuất như mọi trang — giữ nguyên, ghi nhận).
`thu_KHLINK1.js` (trong phạm vi): thêm `/kiemkhop` vào bảng kiểm nếu bài đó đếm số trang.

## Đột biến (dot_bien.py)
VS-gọi cửa ngoài hợp đồng · VS-gọi hai lần (bỏ gộp theo cửa) · VS-báo ✓ khi thiếu trường (`kiemTruong` luôn 'co') · BV-bỏ nhánh `/kiemkhop` ở main.jsx (vỏ lại tự gọi) · BV-bỏ chống dồn "Kiểm lại".
