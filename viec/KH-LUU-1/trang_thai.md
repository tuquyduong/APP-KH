# Trạng thái KH-LUU-1

## Mốc đối chiếu bản chụp
Nhánh `viec/KH-LUU-1`; HEAD = FETCH_HEAD = `fe13962`.
```
fe13962 PHIEU: KH-LUU-1
7af1053 TIEN-DO: KH-UI-5a xong; K9 cho phep khau hieu B2.3 (luat); quy tac luu tren may (luat); mo KH-SLOGAN-1, KH-LUU-1 - so v6
a37d271 Merge pull request #4 from tuquyduong/viec/KH-UI-5a
```

## Câu hỏi
(không)

## Phát hiện
- Màn Trang chủ vẫn còn chữ "Sức khỏe mỗi ngày" (thấy khi chạy App thật) — thuộc KH-SLOGAN-1, không sửa ở đây.
- Chưa sửa `kiem_tra_truoc_khi_giao.js`/CI: CI GitHub không có Playwright → phần 2 của `thu_KHLUU1.js` in "BỎ QUA" ở đó (chỉ phần 1 + đọc nguồn chạy). Nếu muốn ca trình duyệt chạy cả ở cổng GitHub, chủ quán cần cho cài Playwright vào bước CI (ngoài phạm vi).
- Ghi chú nhỏ: bước "nhờ agent phụ soát kế hoạch" (skill bước 3) bỏ qua vì việc thường, kế hoạch ngắn; đã có `/ra-soat` ở cuối.

## Bảng chỗ vá → đột biến (dot_bien.py, mỗi lần bài thử ĐỎ)
| Chỗ vá | Đột biến |
|---|---|
| `cungKhach` so chủ | VS-SO-CHU-NGUOC |
| `dauVet` chuẩn hoá +84 | VS-DAU-VET-KHONG-CHUAN-HOA |
| `doiKhach` xoá khi khác khách | VS-KHONG-XOA-KHI-KHAC |
| `doiKhach` xoá bản lưu cũ chưa có chủ | BV-BO-CA-BAN-CU |
| `xoaTatCa` xoá `kh_chu` | VS-XOA-TAT-CA-GIU-CHU |
| App gọi `doiKhach` khi có phiên | BV-BO-DOI-KHACH |
| App gọi `tn.nap()` | BV-BO-NAP |
| `dangXuat` gọi `xoaTatCa()` | BV-BO-XOA-DANG-XUAT |
| hết phiên không xoá khoá (`donBoNho`) | VS-HET-PHIEN-XOA-KHOA |
| Trang chủ không lộ bản lưu khi chưa đăng nhập | VS-LO-KET-QUA-KHI-CHUA-DANG-NHAP |

## Kiểm
- `node cong_cu/thu_KHLUU1.js`: 29 đạt · 0 hỏng (phần 1 + đọc nguồn 19 ca; phần 2 Chromium thật 10 ca).
- `npm test`: 20 đạt · 0 hỏng. `node kiem_tra_truoc_khi_giao.js --day-du`: 22 đạt · 0 hỏng (vite build xong).
