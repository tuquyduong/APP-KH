// Chữ của màn Đăng nhập / Đăng ký (3 bước) và thẻ mời cho khách chưa đăng nhập. Chữ ở đây, không rải trong trang.
import { cheSdt } from '../dinhDang.js';

// Cách xưng hô: hiện chữ có dấu, GỬI mã không dấu (hợp đồng v3). Địa chỉ nhận hàng tối đa DIA_CHI_TOI_DA ký tự.
export const XUNG_HO = [
  { ma: 'anh', ten: 'Anh' }, { ma: 'chi', ten: 'Chị' }, { ma: 'co', ten: 'Cô' }, { ma: 'chu', ten: 'Chú' },
  { ma: 'bac', ten: 'Bác' }, { ma: 'em', ten: 'Em' }, { ma: 'ban', ten: 'Bạn' },
];
/** Mã hợp đồng ("chi") → chữ hiện ("Chị"); mã lạ hoặc null → "" (bỏ phần xưng hô, không bịa). */
export const tenXungHo = (ma) => (XUNG_HO.find((x) => x.ma === ma) || { ten: '' }).ten;
export const DIA_CHI_TOI_DA = 300;
export const GIAY_CHO_GUI_LAI = 60; // "Gửi lại mã" mở sau ngần này giây

export const BUOC_SDT = { tieuDe: 'Đăng nhập / Đăng ký', phu: 'Nhận mã đăng nhập qua Zalo', nut: 'Tiếp tục' };
export const BUOC_MA = { tieuDe: 'Nhập mã', nut: 'Xác nhận', guiLai: 'Gửi lại mã', doiSo: 'Đổi số điện thoại', hetHan: 'Mã đã hết hạn' };
export const BUOC_THONG_TIN = {
  tieuDe: 'Thông tin của bạn',
  ten: 'Tên', xungHo: 'Cách xưng hô', diaChi: 'Địa chỉ nhận hàng (không bắt buộc)',
  ghiChuDiaChi: 'Dùng làm địa chỉ giao hàng mặc định khi bạn đặt online; sửa được trong Tài khoản.',
  nut: 'Hoàn tất', quayLai: 'Quay lại',
};
export const DONG_MA_HOA_DON = 'Đăng nhập để nhận điểm cho hoá đơn này';

// Thẻ mời (dáng thẻ vàng points-card) cho khách chưa đăng nhập ở Trang chủ.
export const THE_MOI = { tieuDe: 'Thành viên Tứ Quý Đường', phu: 'Đăng nhập / Đăng ký để tích điểm, nhận ưu đãi', nut: 'Đăng nhập' };

/** Dòng trên ô nhập mã: POS bật Zalo → "đã gửi qua Zalo tới số …"; POS báo lấy mã ở quầy → hỏi nhân viên. SĐT quá ngắn thì không hiện số (không bịa). */
export function loiMa(taiQuay, sdt) {
  if (taiQuay) return 'Hỏi nhân viên quầy để lấy mã đăng nhập';
  const che = cheSdt(sdt);
  return che ? `Mã đã gửi qua Zalo tới số ${che}` : 'Mã đã gửi qua Zalo tới số điện thoại của bạn';
}
