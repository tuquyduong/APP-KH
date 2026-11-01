# YÊU CẦU App KH → chat POS — 01.11.2026 (b) · hạng thành viên: gói Vàng 1 / 3 tháng, hạng "chỉ cấp, không bán"

Chủ quán nói với chat App KH (01.11). Đây là việc của POS: dữ liệu hạng, giá thẻ, bán thẻ đều ở POS. App chỉ hiển thị.

## Chủ quán đã làm
- Bỏ hạng thử "Test0d". Đổi tên trong POS: GOLD → **Vàng**, VIP → **Kim Cương**.
- `GET /api/kh/hang` lúc 01.11 trả: `Vàng` (6%, `gia_the` 500.000) · `Kim Cương` (10%, `gia_the` 5.000.000).

## Chủ quán muốn
1. **Hạng Vàng BÁN theo gói thời hạn:** gói 1 tháng và gói 3 tháng, mỗi gói một giá riêng (chủ quán tự đặt trong Cài đặt).
   - Khách mua gói nào thì vẫn là **hạng Vàng**, cùng mức giảm.
   - Chỉ khác giá và hạn thẻ.
   - Hiện POS chỉ có MỘT thời hạn chung cho mọi hạng (`tier_card_valid_months`, `server/routes/tiers.js` dòng 28–37), mặc định 3 tháng.
2. **Hạng Kim Cương CHỈ CẤP, KHÔNG BÁN:**
   - Mỗi hạng có công tắc **"Chỉ cấp, không bán"** trong Cài đặt hạng.
   - Bật thì hạng đó không hiện ở chỗ bán thẻ ở quầy. Chỉ người có quyền mới cấp cho khách.
   - Mỗi lần cấp có ghi ai cấp, lúc nào. Hạn thẻ khi cấp theo chủ quán chốt.
3. **Sửa luật trong kho POS:** `CLAUDE.md` mục 5 dòng 78 ghi "Hai hạng thẻ: Vàng và Bạch Kim. Không có Kim Cương".
   - Chủ quán hiện dùng **Vàng** (bán) + **Kim Cương** (chỉ cấp).
   - Xin chat POS sửa dòng này và ghi `QUYET_DINH_CHU_QUAN.md`, để máy POS không làm theo luật cũ.

## Xin POS hỏi lại chủ quán các điểm chưa rõ (App không tự quyết)
- Giá gói Vàng 1 tháng và 3 tháng là bao nhiêu? Có gói 6 / 12 tháng sau này không?
- Khách đang có thẻ Vàng mua thêm gói thì hạn **cộng nối** vào hạn cũ, hay tính lại từ hôm mua?
- Kim Cương cấp có hạn không (bao lâu), hay vĩnh viễn tới khi quán thu lại? Ai được quyền cấp?
- Khách có Kim Cương mua thẻ Vàng thì sao? Đề nghị: không cho mua, vì hạng cao hơn đã có.
- Thẻ đã bán / cấp trước đây (3 tháng) giữ nguyên hạn cũ?

## App KH cần gì từ hợp đồng (tên trường do POS chốt; App đề nghị)
- `GET /hang` mỗi hạng thêm:
  - `chi_cap` (true / false): App hiện "Hạng dành tặng khách thân thiết", không hiện giá.
  - `goi[] { so_thang, gia }`: các gói bán; rỗng khi `chi_cap`.
  - Giữ `gia_the` một đợt cho App cũ, theo luật không xoá trường đang dùng.
- `GET /toi` → `hang.het_han` như hiện nay. Không cần thêm gì.
- Hiện App chỉ hiện tên hạng + % giảm, KHÔNG hiện giá, KHÔNG có nút mua thẻ. Vậy việc này không chặn khai trương phía App.
  Nút mua thẻ trên App là việc sau khai trương (P3b). Xin POS cho biết việc này xếp trước hay sau khai trương.
