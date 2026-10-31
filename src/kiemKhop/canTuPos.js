// "App KH cần gì từ POS" — MỘT chỗ, máy đọc được (trang /kiemkhop và bài thử cong_cu/thu_KHKHOP1.js cùng đọc).
//   co = cửa ĐÃ có trong hợp đồng thiet_ke/HOP_DONG_API_KH.md (khối HOP_DONG_MAY_DOC); false → trang không gọi, bài thử canh đúng hai chiều.
//   moi = trường mới trên cửa đã có (POS chưa trả thì ⏳, không ✗) · token: true | false | 'tuy_chon' · viec_pos = việc phía POS lo phần này.
// POS gộp việc nào → sửa `co` / `moi` ở đây (bài thử sẽ đỏ nếu hợp đồng đã đổi mà dòng này chưa đổi). Nguồn: thiet_ke/DOI_CHIEU_TINH_NANG.md + thiet_ke/trao_doi/.
const T = 'truoc_kt', S = 'sau_kt';
export const CAN_TU_POS = [
  { ma: 'hang', ten: 'Hạng thành viên và % giảm', cua: 'GET /hang', token: false, truong: ['data[].id', 'data[].ten', 'data[].phan_tram', 'data[].gia_the'], khi: T, co: true },
  { ma: 'gio_vang', ten: 'Giờ vàng', cua: 'GET /gio-vang', token: false, truong: ['dang_chay', 'phan_tram', 'mon'], khi: T, co: true },
  { ma: 'gio_vang_gia', ten: 'Giá từng món trong Giờ vàng', cua: 'GET /gio-vang', token: false, truong: ['gia_mon[].ma', 'gia_mon[].gia_goc', 'gia_mon[].gia'], khi: T, co: true, moi: true, viec_pos: 'GIOVANG-1' },
  { ma: 'gio_hoat_dong', ten: 'Giờ mở cửa, nhận đơn', cua: 'GET /gio-hoat-dong', token: false, truong: ['bay_gio', 'dang_mo', 'nhan_don', 'hom_nay', 'lich_tuan[].thu', 'lich_tuan[].mo', 'lich_tuan[].dong'], khi: T, co: true },
  { ma: 'toi', ten: 'Hồ sơ khách, số dư ví', cua: 'GET /toi', token: true, truong: ['khach.sdt', 'khach.ten', 'khach.qr', 'khach.so_du_vi'], khi: T, co: true },
  { ma: 'toi_v3', ten: 'Xưng hô và địa chỉ giao hàng', cua: 'GET /toi', token: true, truong: ['khach.xung_ho', 'khach.dia_chi'], khi: T, co: true },
  { ma: 'menu', ten: 'Menu và giá từng hạng', cua: 'GET /menu', token: 'tuy_chon', truong: ['data[].ma', 'data[].ten', 'data[].nhom', 'data[].gia', 'data[].con_hang', 'data[].gia_hang[].hang_id', 'data[].gia_hang[].gia'], khi: T, co: true },
  { ma: 'menu_sp', ten: 'Thông tin món: nhu cầu, thể chất, công dụng', cua: 'GET /menu', token: 'tuy_chon', truong: ['data[].nhu_cau[]', 'data[].the_chat[]', 'data[].mo_ta', 'data[].cong_dung', 'data[].thanh_phan', 'data[].anh'], khi: T, co: true, moi: true, viec_pos: 'KH-SP-1' },
  { ma: 'diem', ten: 'Điểm tích luỹ', cua: 'GET /diem', token: true, truong: ['points', 'history'], khi: T, co: true },
  { ma: 'voucher', ten: 'Voucher', cua: 'GET /voucher', token: true, truong: ['data', 'ma_khach_moi'], khi: T, co: true },
  { ma: 'don', ten: 'Lịch sử đơn', cua: 'GET /don', token: true, truong: ['trang', 'con_nua', 'data[].ma', 'data[].tong', 'data[].trang_thai'], khi: T, co: true },
  { ma: 'don_chi_tiet', ten: 'Chi tiết đơn', cua: 'GET /don/:ma', token: true, truong: ['don.ma', 'don.tong', 'don.trang_thai', 'don.mon[].ten', 'don.mon[].so_luong'], khi: T, co: true },
  { ma: 'don_tien_trinh', ten: 'Tiến trình đơn (đang làm, đang giao…)', cua: 'GET /don/:ma', token: true, truong: ['don.tien_trinh'], khi: T, co: true, moi: true, viec_pos: 'KH-MUA-1' },
  { ma: 'xin_ma', ten: 'Xin mã đăng nhập', cua: 'POST /dang-nhap/xin-ma', token: false, truong: [], khi: T, co: true },
  { ma: 'xac_minh', ten: 'Xác minh mã, đăng ký', cua: 'POST /dang-nhap/xac-minh', token: false, truong: [], khi: T, co: true },
  { ma: 'sua_toi', ten: 'Sửa tên, xưng hô, địa chỉ', cua: 'PUT /toi', token: true, truong: [], khi: T, co: true },
  { ma: 'dat_pin', ten: 'Đặt mã PIN ví', cua: 'PUT /pin', token: true, truong: [], khi: T, co: true },
  { ma: 'nhan_ma_bill', ten: 'Nhận mã trên hoá đơn', cua: 'POST /nhan-ma-bill', token: true, truong: [], khi: T, co: true },
  { ma: 'nhan_diem', ten: 'Nhận điểm', cua: 'POST /nhan-diem', token: true, truong: [], khi: T, co: true },
  { ma: 'gia_han', ten: 'Tự gia hạn đăng nhập', cua: 'POST /gia-han', token: true, truong: [], khi: T, co: true },
  { ma: 'bao_gia', ten: 'Báo giá giỏ hàng', cua: 'POST /gio/bao-gia', token: true, truong: [], khi: T, co: false, viec_pos: 'KH-MUA-1' },
  { ma: 'dat_don', ten: 'Đặt đơn, trả bằng QR hoặc ví', cua: 'POST /don', token: true, truong: [], khi: T, co: false, viec_pos: 'KH-MUA-1' },
  { ma: 'huy_don', ten: 'Huỷ đơn chưa trả', cua: 'POST /don/:ma/huy', token: true, truong: [], khi: T, co: false, viec_pos: 'KH-MUA-1' },
  { ma: 'phi_giao', ten: 'Phí giao Ahamove', cua: 'POST /gio/phi-giao', token: true, truong: [], khi: T, co: false, viec_pos: 'KH-MUA-2' },
  { ma: 'topping', ten: 'Topping theo món', cua: 'chưa chốt — thêm vào GET /menu', token: 'tuy_chon', truong: [], khi: T, co: false, viec_pos: 'TOPPING-1' },
  { ma: 'combo', ten: 'Combo', cua: 'chưa chốt tên cửa', token: 'tuy_chon', truong: [], khi: T, co: false, viec_pos: 'COMBO-1a' },
  { ma: 'doi_diem', ten: 'Đổi điểm, voucher khi trả', cua: 'chưa chốt tên cửa', token: true, truong: [], khi: T, co: false, viec_pos: 'P3b' },
  { ma: 'vi_lich_su', ten: 'Sổ ví, nạp ví, mua thẻ hạng, đổi quà', cua: 'chưa chốt tên cửa', token: true, truong: [], khi: S, co: false, viec_pos: 'P3b' },
  { ma: 'ho_so_them', ten: 'Nhiều địa chỉ, email, ngày sinh', cua: 'chưa chốt tên cửa', token: true, truong: [], khi: S, co: false, viec_pos: 'KH-HOSO-1' },
  { ma: 'danh_gia_google', ten: 'Lời mời đánh giá Google', cua: 'chưa chốt tên cửa', token: true, truong: [], khi: S, co: false, viec_pos: 'DG-GOOGLE-1' },
];
