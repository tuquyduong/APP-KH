// Lịch CỐ ĐỊNH — nhóm B "App tự tính" (CLAUDE.md §11): tên thứ, Can, Chi, 24 tiết khí, tên tháng âm, bốn mùa. KHÔNG thuộc danh mục, không sửa ở /admin
// (chỗ hiện gắn mục khoá `kh.lich` — khoaBoi 'tutinh', "Lịch âm — App tự tính"). CHÉP NGUYÊN từ thiet_ke/app_kh_demo.html (patch39). Không import gì (tránh vòng nạp).
export const WD = ['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
/** Thứ ngắn, 0 = Chủ nhật (chỉ số của WD): dòng đầu lịch tháng và "T7, 20/11". */
export const THU_NGAN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export const CAN =['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
export const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
// Thứ tự bắt đầu từ Xuân phân (kinh độ mặt trời 0°).
export const TERMS = ['Xuân phân','Thanh minh','Cốc vũ','Lập hạ','Tiểu mãn','Mang chủng','Hạ chí','Tiểu thử','Đại thử','Lập thu','Xử thử','Bạch lộ',
  'Thu phân','Hàn lộ','Sương giáng','Lập đông','Tiểu tuyết','Đại tuyết','Đông chí','Tiểu hàn','Đại hàn','Lập xuân','Vũ thủy','Kinh trập'];
export const LNUM = ['', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Một', 'Chạp'];
export const MUA = ['Xuân', 'Hạ', 'Thu', 'Đông'];
/** Mùa của tiết khí thứ `idx` (0–23): demo SEASON. `ic` = biểu tượng. */
export const SEASON = (idx) => (idx >= 21 || idx <= 2 ? { n: 'Xuân', ic: 'blossom' } : idx <= 8 ? { n: 'Hạ', ic: 'sun' } : idx <= 14 ? { n: 'Thu', ic: 'fan' } : { n: 'Đông', ic: 'moon' });
