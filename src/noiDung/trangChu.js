// Nội dung Trang chủ (theo demo). Phần nào để trống tới khi chủ quán gửi chữ / chọn món thì ẨN cả khối (không bịa).
// Banner thường (demo: hero-banner) — hiện khi chưa có banner khuyến mãi "Hôm nay".
export const BANNER = { anh: '/anh/banner-trang-chu.webp', nhan: 'Tứ Quý Đường', dong1: 'Hôm nay bạn muốn', dong2: 'uống gì?', nut: 'Xem Menu →' };
// Banner khuyến mãi "Hôm nay" (demo: today): chữ khuyến mãi thật chủ quán chưa gửi → TRỐNG thì dùng banner thường ở trên.
//   Điền ví dụ: { tieuDe: '…', phu: '…', nut: 'Xem ›' } — ảnh nền dùng BANNER.anh.
export const HOM_NAY = { tieuDe: '', phu: '', nut: '' };
// Danh sách mã món nổi bật (mã POS). Rỗng thì ẩn khối.
export const MON_NOI_BAT = [];
