// Màn Đăng nhập / Đăng ký (3 bước): mã máy (cách xưng hô, độ dài địa chỉ, giây chờ). Mọi chữ khách thấy ở danh mục nội dung (src/noiDung/nd/taiKhoan.js, khoá dn.*).
import { cheSdt } from '../dinhDang.js';
import { nd } from './nd.js';

// Cách xưng hô: hiện chữ có dấu, GỬI mã không dấu (hợp đồng v3). Địa chỉ nhận hàng tối đa DIA_CHI_TOI_DA ký tự.
export const XUNG_HO = [
  { ma: 'anh', ten: 'anh' }, { ma: 'chi', ten: 'chị' }, { ma: 'co', ten: 'cô' }, { ma: 'chu', ten: 'chú' },
  { ma: 'bac', ten: 'bác' }, { ma: 'em', ten: 'em' }, { ma: 'ban', ten: 'bạn' },
];
/** Mã hợp đồng ("chi") → chữ hiện ("chị", chữ thường như demo); mã lạ hoặc null → "" (bỏ phần xưng hô, không bịa). */
export const tenXungHo = (ma) => (XUNG_HO.find((x) => x.ma === ma) || { ten: '' }).ten;
export const DIA_CHI_TOI_DA = 300;
export const GIAY_CHO_GUI_LAI = 60; // "Gửi lại mã" mở sau ngần này giây

/** Dòng trên ô nhập mã: POS bật Zalo → "đã gửi qua Zalo tới số …"; POS báo lấy mã ở quầy → hỏi nhân viên. SĐT quá ngắn thì không hiện số (không bịa). */
export function loiMa(taiQuay, sdt) {
  if (taiQuay) return nd('dn.ma.quay');
  const che = cheSdt(sdt);
  return che ? nd('dn.ma.zalo', { sdt: che }) : nd('dn.ma.zaloChung');
}
