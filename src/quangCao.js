// Dải quảng cáo mảnh ở đầu các trang (KH-UI-5d) — hàm thuần. Chọn MỘT câu để hiện; không có gì → null (ẩn dải, không chữ mẫu).
// Thứ tự: dòng `quangCao` của POS hợp giờ (KH-QC-1, chưa có cửa — mặc định rỗng) → Giờ vàng ĐANG chạy → chương trình đặc biệt → chữ mặc định (`macDinh: true`; dải ẩn, banner Trang chủ vẫn hiện).
import { mocTuChuoi } from './bayGio.js';
import { trangThaiGioVang, gioPhut } from './gioVang.js';
import { nd, ndNut } from './noiDung/nd.js';

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

/** Biểu tượng (emoji) ở đầu chuỗi tách riêng: "⏰ Giờ vàng" → { bieuTuong: '⏰', chu: 'Giờ vàng' }. Không có emoji → bieuTuong rỗng. */
export function tachBieuTuong(chu) {
  const s = String(chu == null ? '' : chu).trim();
  const m = /^(\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier}|\u200D\p{Extended_Pictographic})*)\s*/u.exec(s);
  return m ? { bieuTuong: m[1], chu: s.slice(m[0].length) } : { bieuTuong: '', chu: s };
}

const tuDong = (r) => {
  const dich = DICH.includes(r.dich) && (r.dich !== 'mon' || r.ma_mon) ? r.dich : '';
  const chu = r.chu_dai.trim();
  return { chu, tieuDe: tachBieuTuong(chu).chu || chu /* dòng chỉ có emoji: không để tiêu đề rỗng */, phu: '', nut: dich ? nd('qc.xem') : '', dich, maMon: dich === 'mon' ? r.ma_mon : '', khoaDai: 'qc.pos', khoa: { t: 'qc.pos', s: 'qc.pos', nut: 'qc.xem' } };
};
const dongHopLe = (r) => r && typeof r === 'object' && typeof r.chu_dai === 'string' && r.chu_dai.trim();

/**
 * { gioVang: dữ liệu /gio-vang của POS, chuongTrinh: docChuongTrinh(...), bayGio: 'YYYY-MM-DD HH:mm:ss', quangCao: [dòng POS] }
 * → { chu (một dòng cho dải, có biểu tượng), khoaDai (khoá nội dung của dòng đó: 'qc.pos' lời POS · 'qc.dai.gv' / 'qc.dai.ct' câu App tự viết), tieuDe, phu, nut (chữ nút), dich: 'menu'|'mon'|'uudai'|'tracnghiem'|'', maMon, macDinh? }. `dich` rỗng = bấm không làm gì.
 * Luôn trả một kết quả: không có gì thì là chữ mặc định trong danh mục (`macDinh: true`, today.*).
 */
export function chonQuangCao({ gioVang, chuongTrinh, bayGio, quangCao = [] }) {
  const dong = (Array.isArray(quangCao) ? quangCao : []).filter(dongHopLe);
  const thuong = dong.filter((r) => r.id !== 'gio_vang' && hopGio(r.tu_gio, r.den_gio, bayGio)).sort((p, q) => (+q.uu_tien || 0) - (+p.uu_tien || 0));
  if (thuong.length) return tuDong(thuong[0]);
  const tt = trangThaiGioVang(gioVang, bayGio);
  if (tt && tt.pha === 'dang') {
    const rieng = dong.find((r) => r.id === 'gio_vang');
    const bien = { phanTram: tt.phanTram, ketThuc: tt.ketThuc };
    const kq = { phu: nd('qc.gv.phu', bien), nut: nd('qc.gv.nut'), dich: 'menu', maMon: '' };
    const k = { s: 'qc.gv.phu', nut: 'qc.gv.nut' };
    return rieng
      ? { ...kq, chu: rieng.chu_dai.trim(), tieuDe: tachBieuTuong(rieng.chu_dai).chu || rieng.chu_dai.trim(), khoaDai: 'qc.pos', khoa: { t: 'qc.pos', ...k } }
      : { ...kq, chu: nd('qc.dai.gv', bien), tieuDe: nd('qc.gv.tieuDe', bien), khoaDai: 'qc.dai.gv', khoa: { t: 'qc.gv.tieuDe', ...k } };
  }
  const ct = Array.isArray(chuongTrinh) ? chuongTrinh[0] : null;
  if (ct && ct.ten) return { chu: nd('qc.dai.ct', { ten: ct.ten }), tieuDe: ct.ten, phu: ct.moTa || '', nut: nd('qc.ct.nut'), dich: 'uudai', maMon: '', khoaDai: 'qc.dai.ct', khoa: { t: 'qc.pos', s: 'qc.pos', nut: 'qc.ct.nut' } };
  const nut = ndNut('today.cta');
  return { chu: '', tieuDe: nd('today.t'), phu: nd('today.s'), nut: nut.chu, dich: nut.dich, maMon: '', macDinh: true, khoaDai: '', khoa: { t: 'today.t', s: 'today.s', nut: 'today.cta' } };
}
