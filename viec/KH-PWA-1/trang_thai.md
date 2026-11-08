# KH-PWA-1 — trạng thái

## Đối chiếu bản chụp (bước 1)
- Nhánh `viec/KH-PWA-1`, cây sạch. HEAD `47fce03` · FETCH_HEAD `47fce03` (bằng nhau → không kéo).
```
47fce03 PHIEU: KH-PWA-1
2fe3e97 TIEN-DO: mo KH-THU-1 (rut thoi gian bai thu, bao qua gio) + KH-PWA-1 (mo nhanh, tu len ban moi lang le) chay song song KH-UI-5c
4abbd0a TIEN-DO: mo KH-UI-5c (bam ngay -> bang viec cua ngay, viec lap, nhac truoc, qua han, hoan tac); quyet dinh 08.11 (the hang chung gio, hang co truoc, tich diem theo mon); them KH-THE-1 cho POS; thu App 07.11 + POS 08.11
```

## Quyết định trong phạm vi phiếu
- **B2 hỏi index.html qua service worker**: bộ kiểm K1 (`kiem_tra_truoc_khi_giao.js:35-36`) cấm `fetch(` trong `src/` ngoài `src/api.js`, mà `api.js` CẤM sửa →
  `src/dangKySW.js` nhắn SW (`postMessage` + `MessageChannel`), SW hỏi `/` (`cache: 'no-store'`), lưu đè vỏ, trả tên `/assets/index-*.js`.
- **Luật A2 ở `public/sw.js`** (chỗ duy nhất dùng; `public/` chép nguyên, không `import` được `src/`). Bài thử nạp `sw.js` bằng `vm` → thử hàm thật, không chép luật hai chỗ.
- **Màn an toàn thêm `.sheet.show`**: bảng "Thêm việc" của Kế hoạch (`src/components/ThemViec.jsx:22`) là bảng nổi nhưng không có `role="dialog"` (file CẤM sửa) — phiếu
  B3 nói "bất kỳ bảng nổi / hộp thoại … gồm … bảng ngày của Kế hoạch", nên bộ chọn = `[role="dialog"],[aria-modal="true"],.sheet.show`.
- **Chờ màn an toàn**: thử lại mỗi 2 giây (bắt cả đổi trang lẫn đóng hộp thoại mà không sửa App.jsx — CẤM); chỉ tải lại khi trang đang hiện;
  nhớ tên bản đã tải lại (`sessionStorage` `kh_ban_da_tai_lai`) để không tải lại liên tục.
- **Lưu đúng loại**: vỏ chỉ lưu khi `text/html`; `/assets` KHÔNG lưu `text/html` (Cloudflare không có 404.html → trả index.html 200 cho tệp băm đã xoá).
  Phản hồi `redirected` không lưu. Lưu đè vỏ CÙNG bản không dọn assets (bài thử bắt: vỏ bị đè hai lần → mất bản trước).
- Lần đầu: install lưu sẵn vỏ + tệp vỏ trỏ tới (`cache: 'reload'`) để lần mở thứ hai không mạng vẫn có Trang chủ (C1).
