# KH-UI-5f — đối chiếu demo ↔ app

Demo: `thiet_ke/app_kh_demo.html` (patch39). Ảnh: `viec/KH-UI-5f/so_anh/<rộng>_<màn>_{demo,app,lech}.png` (360 / 390 / 430 × 844; 390 chụp ×2). Công cụ chụp: `viec/KH-UI-5f/chup_anh.js`
(Chromium + Playwright có sẵn, đồng hồ giả 10.11.2026 09:00, **cùng dữ liệu mẫu** của demo: Honda Vision + Toyota Vios, Thuốc sắc + Vitamin D3, chu kỳ ngày 10, Tín chủ Nguyễn Thị Linh).
Phần trăm "khác" trong ảnh `lech` gồm cả khối **banner "Hôm nay"** của demo ở đầu mọi màn con (lý do (a): thuộc KH-UI-5g, chưa làm) nên cao hơn thực tế; chỗ khác thật liệt kê dưới đây.
Lý do: (a) dữ liệu POS chưa có / việc sau · (b) chữ / số mẫu của demo không dùng · (c) chưa có giỏ / đặt đơn · (d) màn rộng · **P** = theo phiếu KH-UI-5f / chủ quán 11.11.

## Lưới 6 ô (`luoi6`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Ô Xe cộ (huy hiệu scooter), "N xe · M sắp tới hạn" / "N xe · ổn" | giống | — |
| Ô Uống thuốc (cối giã), "đã/tổng hôm nay" | giống | chưa có thuốc: "Thêm thuốc" thay vì "0/0" (K3, không số bịa) · P |
| Ô Chu kỳ (trăng), "Ngày N" / "Bật" | giống | luôn "Ngày N" khi đã bật (D1; khoá mã đã bỏ 11.11) |
| Dải Sắp tới | thêm dòng xe / thuốc / chu kỳ | nội dung dòng thuốc "Đến giờ uống thuốc" (không tên thuốc); dòng chu kỳ "Kỳ kinh dự kiến" như demo (C4) · P |

## Xe cộ — danh sách (`xe_ds`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Đầu màn "Xe cộ" + "＋ Thêm xe" | giống | — |
| Thẻ xe: huy hiệu (ô tô SVG riêng, còn lại scooter), tên, biển số · km, dòng trạng thái "● … / ✓ Mọi hạng mục còn hạn", › | giống | — |
| Ghi chú cuối "Cập nhật số km…" | giống | — |
| (demo) xe mẫu có sẵn | **không có** | chưa có xe → lời mời thêm xe, không xe mẫu · P (A1) |

## Xe cộ — một xe (`xe_mot`, `xe_mot_duoi`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Số km hiện tại (ô số sửa nhanh) | giống | lưu khi rời ô / bấm Enter (demo `onchange`) |
| Lịch bảo dưỡng: thẻ hạng mục xếp sắp tới hạn lên đầu, "mỗi X km hoặc Y tháng ›", trạng thái, thanh tiến độ, "✓ Vừa làm hôm nay" | giống | — |
| "Nhắc khi sắp tới hạn" + nút nhắc | giống | nút nhắc dùng chữ chung "Nhắc khi mở app" / "Đang nhắc" của 5e (chủ quán duyệt 06.11) thay vì "Nhắc" của demo |
| Giấy tờ có hạn: ô `<input type=date>` | **nút ngày → bảng bánh xe ngày** | không dùng ô ngày của trình duyệt (như KH-UI-5d E1; trình duyệt Zalo) · P |
| Lịch sử bảo dưỡng + tổng chi phí; "Sửa thông tin xe" / "Xoá xe" | giống | "Xoá xe" hỏi lại ngay tại chỗ (`HoiXoa`), không đổi chữ nút lần hai như demo · P (A2, như KH-UI-5d) |

## Xe cộ — Thêm xe (`xe_them`), Ghi lần sửa (`xe_ghi`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Màn con "Thêm xe": loại · tên · biển số · km · ghi chú lịch mẫu | **bảng nổi từ dưới lên** (`BangNoi`) | cùng khung với Thêm người thân của 5e; nội dung / thứ tự giống · P |
| Ghi lần sửa: ngày (type=date), km, chip việc (chọn nhiều) + "việc khác", chi phí, nơi làm | giống, ngày bằng bánh xe | như trên |

## Uống thuốc (`thuoc_ds`, `thuoc_them`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Ô tổng "đã/tổng" + 7 chấm + chấm hôm nay | giống | 7 chấm **tính từ dữ liệu thật** (demo gắn cứng `medHist`); chưa có thuốc → ẩn ô tổng (K3) |
| Thẻ thuốc: tên, "liều · ghi chú · đến T6, 20/11", nút nhắc, nút giờ "07:30 Chưa uống / Đã uống", "Xoá thuốc này" | giống | hết đợt → "đã xong", ẩn nút giờ · P (B2); xoá hỏi lại một lần · P |
| Ghi chú cuối "Tên thuốc chỉ lưu trên máy…" | giống | **không có biểu tượng trái tim** (bộ `<symbol>` của app chưa có `heart`; không vẽ mới) |
| Màn "Thêm thuốc": 3 ô `type=time` | **1–3 bánh xe giờ 24h** + "＋ Thêm giờ" / "Bỏ" | bánh xe giờ đã có từ KH-UI-5c, tránh ô giờ của trình duyệt · P (B2) |

## Chu kỳ (`chuky_off`, `chuky_on`, `chuky_on_duoi`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Thẻ giới thiệu + "Bắt đầu" | giống | bấm Bắt đầu hỏi **ngày bắt đầu kỳ gần nhất** (bánh xe ngày) thay vì bật ngay với dữ liệu mẫu · P (C1) |
| Thẻ hôm nay: "Ngày N", giai đoạn (màu CYC_PH), kỳ tới, dải ngày, chú giải, "Dưỡng sinh lúc này", nút ghi kỳ mới | giống | màu đặt theo lớp `p0…p4` (cùng mã màu CYC_PH) thay cho style tại chỗ |
| ± độ dài chu kỳ / số ngày hành kinh, "6 chu kỳ gần nhất", nhắc trước kỳ 2 ngày | giống | lịch sử trống → "Chưa có chu kỳ nào được ghi" (K3) |
| "Khoá bằng mã PIN khi mở" (công tắc, chưa làm gì) | **bỏ hàng này** | chủ quán 11.11: "đây là tài khoản riêng của khách" nên không khoá mã · P (C3) |
| Lời nhắc | "Lời nhắc của bạn" (không chữ kinh / chu kỳ) | P (C4) |

## Văn khấn (`vankhan_ds`, `vankhan_bai`)
| Khối trong demo | Đã làm | Khác gì · lý do |
|---|---|---|
| Danh sách: thẻ lớn "Sắp tới" + 10 dịp | giống | thêm khung **"Thông tin gia đình khi khấn"** (Tín chủ · Họ gia tiên · Địa chỉ) ở đầu, điền sẵn từ tài khoản · P (chủ quán 11.11, E1) — demo không có khung này |
| Bài: ô Tín chủ / Họ / Địa chỉ / Người được giỗ trên đầu bài | **dòng gọn "Tín chủ: … · Địa chỉ: …  Sửa ›"**; ô Người được giỗ / Hương linh giữ theo bài | P (E2) |
| Bài khấn tô màu | chỗ trống hiện "(chạm để điền …)", chạm chỗ tô màu → mở đúng ô nhập | P (E3) |
| Lễ vật | thêm dòng "Có thể dâng thêm hoa quả, trà tươi" (không nút đặt hàng) | P (E4) |

Mọi khối mới có khoá nội dung + `data-nd` (danh sách khoá ở `trang_thai.md`).
