// Hàm thuần của khối thẻ hội viên (KH-THE-3): chọn mẫu thẻ theo tên hạng, dòng "tên khách · 4 số cuối SĐT", nhãn + giá trị hạn trên thẻ.
import { dinhDangNgay } from './dinhDang.js';
import { tenXungHo } from './noiDung/dangNhap.js';
import { nd } from './noiDung/nd.js';

const boDau = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();
const chuHoaDau = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '');

/** Mẫu thẻ theo tên hạng POS (bỏ dấu, không phân biệt hoa thường): có "kim cuong" → 'kc'; có "vang" → 'vang'; còn lại / rỗng → 'hong' (thẻ hồng của quán). */
export function mauThe(tenHang) {
  const s = typeof tenHang === 'string' ? boDau(tenHang) : '';
  return s.includes('kim cuong') ? 'kc' : s.includes('vang') ? 'vang' : 'hong';
}

/** "<Xưng hô> <Tên> · •••• <4 số cuối SĐT>". Thiếu tên → chỉ phần SĐT; thiếu SĐT → chỉ tên; thiếu cả hai → ''. SĐT thô không giữ — chỉ 4 số cuối. */
export function nguoiTrenThe(khach) {
  const k = khach || {};
  const ten = String(k.ten || '').trim();
  const xung = ten ? chuHoaDau(tenXungHo(k.xung_ho)) : '';
  const so = String(k.sdt || '').replace(/\D/g, '');
  return [[xung, ten].filter(Boolean).join(' '), so.length >= 4 ? `•••• ${so.slice(-4)}` : ''].filter(Boolean).join(' · ');
}

/**
 * Hạn hiện ở góc dưới phải của thẻ → { nhan, gia_tri }: có hạn → "Hết hạn" + dd/mm/yyyy; null + quán tặng → "Quán tặng" + "Không thời hạn"; null → "Không thời hạn".
 * POS không gửi hạn (undefined) hoặc hạn không đọc được → null: thẻ bỏ dòng hạn, không bịa.
 */
export function hanTrenThe(hetHan, tang) {
  if (hetHan === null) return tang ? { nhan: nd('the.thv.tang'), gia_tri: nd('the.thv.khongHan') } : { nhan: nd('the.thv.khongHan'), gia_tri: '' };
  const ngay = typeof hetHan === 'string' ? dinhDangNgay(hetHan.slice(0, 10)) : '';
  return ngay ? { nhan: nd('the.thv.hetHan'), gia_tri: ngay } : null;
}
