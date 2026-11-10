// Dải quảng cáo mảnh ở đầu các trang (KH-UI-5d) — hàm thuần. Chọn MỘT câu để hiện; không có gì → null (ẩn dải, không chữ mẫu).
// Thứ tự: dòng `quangCao` của POS hợp giờ (KH-QC-1, chưa có cửa — mặc định rỗng) → Giờ vàng ĐANG chạy → chương trình đặc biệt → null.
import { mocTuChuoi } from './bayGio.js';
import { trangThaiGioVang, gioPhut } from './gioVang.js';

/** Trang có dải: Menu, Ưu đãi, Giỏ hàng, Kế hoạch + tiện ích, Tài khoản (chỉ trang chính). Thanh toán, Theo dõi đơn, Đăng nhập… KHÔNG có. */
const TRANG_CO_DAI = ['menu', 'uudai', 'giohang', 'kehoach', 'tienich', 'taikhoan'];
export const coDai = (trang) => TRANG_CO_DAI.includes(trang);

const DICH = ['menu', 'mon', 'uudai', 'tracnghiem'];
const HH_MM = /^\d{1,2}:\d{2}$/;

/** `tu` / `den` rỗng = không giới hạn phía đó. "HH:mm" so theo giờ trong ngày (qua nửa đêm được); dạng ngày giờ đầy đủ so theo thời điểm. Không đọc được → false. */
function hopGio(tu, den, bay) {
  if (!tu && !den) return true;
  const a = String(tu || ''), b = String(den || '');
  if ([a, b].some((x) => x && !HH_MM.test(x) && Number.isNaN(mocTuChuoi(x)))) return false;
  if ((a && HH_MM.test(a)) || (b && HH_MM.test(b))) {
    const nay = gioPhut(bay), p = (x) => { const g = gioPhut(x); return g ? +g.slice(0, 2) * 60 + +g.slice(3) : null; };
    const gioNay = +nay.slice(0, 2) * 60 + +nay.slice(3), x = a ? p(a) : null, y = b ? p(b) : null;
    if (x === null) return gioNay < y;
    if (y === null) return gioNay >= x;
    return x <= y ? gioNay >= x && gioNay < y : gioNay >= x || gioNay < y;
  }
  const m = mocTuChuoi(bay);
  return (!a || m >= mocTuChuoi(a)) && (!b || m < mocTuChuoi(b));
}

const tuDong = (r) => {
  const dich = DICH.includes(r.dich) && (r.dich !== 'mon' || r.ma_mon) ? r.dich : '';
  return { chu: r.chu_dai.trim(), dich, maMon: dich === 'mon' ? r.ma_mon : '' };
};
const dongHopLe = (r) => r && typeof r === 'object' && typeof r.chu_dai === 'string' && r.chu_dai.trim();

/**
 * { gioVang: dữ liệu /gio-vang của POS, chuongTrinh: docChuongTrinh(...), bayGio: 'YYYY-MM-DD HH:mm:ss', quangCao: [dòng POS] }
 * → { chu, dich: 'menu'|'mon'|'uudai'|'tracnghiem'|'', maMon } hoặc null. `dich` rỗng = bấm không làm gì.
 */
export function chonQuangCao({ gioVang, chuongTrinh, bayGio, quangCao = [] }) {
  const dong = (Array.isArray(quangCao) ? quangCao : []).filter(dongHopLe);
  const thuong = dong.filter((r) => r.id !== 'gio_vang' && hopGio(r.tu_gio, r.den_gio, bayGio)).sort((p, q) => (+q.uu_tien || 0) - (+p.uu_tien || 0));
  if (thuong.length) return tuDong(thuong[0]);
  const tt = trangThaiGioVang(gioVang, bayGio);
  if (tt && tt.pha === 'dang') {
    const rieng = dong.find((r) => r.id === 'gio_vang');
    return rieng ? { chu: rieng.chu_dai.trim(), dich: 'menu', maMon: '' } : { chu: `⏰ Giờ vàng: giảm ${tt.phanTram}% đến ${tt.ketThuc}`, dich: 'menu', maMon: '' };
  }
  const ct = Array.isArray(chuongTrinh) ? chuongTrinh[0] : null;
  return ct && ct.ten ? { chu: `🎁 ${ct.ten}`, dich: 'uudai', maMon: '' } : null;
}
