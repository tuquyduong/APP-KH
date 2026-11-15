// Dải quảng cáo mảnh ở đầu các trang (KH-UI-5d) + banner "Hôm nay" Trang chủ (KH-UI-5g) — hàm thuần. Chọn chữ cho CẢ HAI cùng lúc (App gọi MỘT lần).
// Nguồn: dòng `quangCao` của POS (GET /quang-cao, KH-QC-1, hợp đồng v16 — POS đã xếp `uu_tien` tăng dần, App KHÔNG sắp lại) hợp giờ → Giờ vàng ĐANG chạy → chương trình đặc biệt → chữ mặc định (`macDinh: true`; dải ẩn, banner Trang chủ vẫn hiện).
// Dải lấy dòng hợp giờ ĐẦU TIÊN; banner lấy dòng hợp giờ đầu tiên CÓ `tieu_de` (hoặc dòng `gio_vang` → banner Giờ vàng của App) — hai nơi có thể là hai dòng khác nhau.
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
  const m = /^(\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier}|‍\p{Extended_Pictographic})*)\s*/u.exec(s);
  return m ? { bieuTuong: m[1], chu: s.slice(m[0].length) } : { bieuTuong: '', chu: s };
}

const chuoi = (v) => (typeof v === 'string' ? v.trim() : '');
const dongHopLe = (r) => r && typeof r === 'object' && !!chuoi(r.chu_dai);
/** Đích bấm của một dòng POS: ngoài 4 đích → '' (không bấm); `mon` thiếu `ma_mon` → Menu. */
const dichDong = (r) => {
  const dich = DICH.includes(r.dich) ? r.dich : '';
  return dich === 'mon' && !r.ma_mon ? { dich: 'menu', maMon: '' } : { dich, maMon: dich === 'mon' ? String(r.ma_mon) : '' };
};
const bannerPos = (r) => {
  const nut = chuoi(r.chu_nut), d = dichDong(r);
  return { tieuDe: chuoi(r.tieu_de), phu: chuoi(r.phu), nut: d.dich ? nut || nd('qc.xem') : '', ...d, khoa: { t: 'qc.pos', s: 'qc.pos', nut: nut ? 'qc.pos' : 'qc.xem' } };
};

/**
 * { gioVang: dữ liệu /gio-vang của POS, chuongTrinh: docChuongTrinh(...), bayGio: 'YYYY-MM-DD HH:mm:ss', quangCao: [dòng POS] }
 * → { banner: tieuDe, phu, nut (chữ nút), dich: 'menu'|'mon'|'uudai'|'tracnghiem'|'', maMon, khoa (khoá danh mục từng chữ), macDinh? ;
 *     dải: chu (một dòng, có biểu tượng), khoaDai ('qc.pos' lời POS · 'qc.dai.gv' / 'qc.dai.ct' câu App tự viết), dai: { dich, maMon } (đích RIÊNG của dải) }. `dich` rỗng = bấm không làm gì.
 * Luôn trả một kết quả: không có gì thì banner là chữ mặc định trong danh mục (`macDinh: true`, today.*) và dải rỗng.
 */
export function chonQuangCao({ gioVang, chuongTrinh, bayGio, quangCao = [] }) {
  const dong = (Array.isArray(quangCao) ? quangCao : []).filter((r) => dongHopLe(r) && hopGio(r.tu_gio, r.den_gio, bayGio)); // giữ thứ tự POS
  const tt = trangThaiGioVang(gioVang, bayGio), gvChay = tt && tt.pha === 'dang';
  const bien = gvChay ? { phanTram: tt.phanTram, ketThuc: tt.ketThuc } : null;
  const ct = Array.isArray(chuongTrinh) && chuongTrinh[0] && chuongTrinh[0].ten ? chuongTrinh[0] : null;
  const gv = () => ({ tieuDe: nd('qc.gv.tieuDe', bien), phu: nd('qc.gv.phu', bien), nut: nd('qc.gv.nut'), dich: 'menu', maMon: '', khoa: { t: 'qc.gv.tieuDe', s: 'qc.gv.phu', nut: 'qc.gv.nut' } });

  const rDai = dong[0];
  const dai = rDai ? { chu: rDai.chu_dai.trim(), khoaDai: 'qc.pos', dai: dichDong(rDai) }
    : gvChay ? { chu: nd('qc.dai.gv', bien), khoaDai: 'qc.dai.gv', dai: { dich: 'menu', maMon: '' } }
    : ct ? { chu: nd('qc.dai.ct', { ten: ct.ten }), khoaDai: 'qc.dai.ct', dai: { dich: 'uudai', maMon: '' } }
    : { chu: '', khoaDai: '', dai: { dich: '', maMon: '' } };

  const rBanner = dong.find((r) => (r.id === 'gio_vang' && gvChay) || chuoi(r.tieu_de));
  if (rBanner) return { ...(rBanner.id === 'gio_vang' ? gv() : bannerPos(rBanner)), ...dai };
  if (gvChay) return { ...gv(), ...dai };
  if (ct) return { tieuDe: ct.ten, phu: ct.moTa || '', nut: nd('qc.ct.nut'), dich: 'uudai', maMon: '', khoa: { t: 'qc.pos', s: 'qc.pos', nut: 'qc.ct.nut' }, ...dai };
  const nut = ndNut('today.cta');
  return { tieuDe: nd('today.t'), phu: nd('today.s'), nut: nut.chu, dich: nut.dich, maMon: '', macDinh: true, khoa: { t: 'today.t', s: 'today.s', nut: 'today.cta' }, ...dai };
}
