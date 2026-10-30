// Nội dung trang trí của món theo MÃ MÓN POS (`ma` trong /api/kh/menu = `unique_id` của món trong POS, vd juice_1 — KHÔNG phải mã in CT1).
// Món chưa có ở đây → app chỉ hiện tên + giá + nhóm (không bịa mô tả). Ví dụ một dòng:
//   'MA_MON': { anh: '/anh/ten-anh.webp', moTa: '…', thanhPhan: '…', congDung: '…', nhuCau: ['Ngủ ngon'] },
// KH-ND-1 (30.10.2026): nhu cầu từng món — chat App KH đề xuất (CT1, CT5 theo demo; còn lại theo tên món), chủ quán duyệt "theo đề nghị, sửa sau được".
// Tên nhu cầu phải đúng 6 tên ở nhuCau.js. Món POS tạo lại (đổi unique_id) thì sửa mã ở đây.
export const MON = {
  juice_1: { nhuCau: ['Đẹp da', 'Bổ khí'] }, // CT1 Hồng Tân Sinh
  juice_2: { nhuCau: ['Bổ khí'] }, // CT2 Lục Tân Khí
  juice_5: { nhuCau: ['Giải nhiệt'] }, // CT5 Thanh Tân Dưỡng
  juice_6: { nhuCau: ['Giải nhiệt'] }, // CT6 Tĩnh Nguyên Thủy
  juice_7: { nhuCau: ['Ấm bụng'] }, // CT7 Ôn Dương Lộ
  juice_8: { nhuCau: ['Ngủ ngon'] }, // CT8 Tâm Vệ Lộ
  tea_1: { nhuCau: ['Đẹp da'] }, // DNL Dưỡng Nhan Lộ
  tea_2: { nhuCau: ['Giải nhiệt', 'Đẹp da'] }, // NTL Ngọc Thanh Lộ
  tea_3: { nhuCau: ['Ngủ ngon'] }, // AML An Mi Lộ
  caphe_1: { nhuCau: ['Tỉnh táo'] }, // CF01 Cà Phê Đen
};
