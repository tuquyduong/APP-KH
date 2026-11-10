// Văn khấn & lễ cúng (KH-UI-5e): hàm thuần — ngày của từng dịp (demo vkNext) và điền bài khấn (demo renderVkOne.fill).
// "Hôm nay" luôn là tham số { d, m, y } lấy từ giờ POS (CLAUDE.md §6). Nội dung bài khấn ở noiDung/vanKhan.js.
import { LUNAR } from './lich.js';
import { VK, LNUM } from './noiDung/vanKhan.js';
import { jd, tuJd, lichAm, amSangDuong, ngayKeTiep } from './kehoachLap.js';

const TOI_DA_TIM_MOT_15 = 32; // ngày: Mùng 1 / Rằm luôn có trong ngần này ngày

export const timDip = (id) => VK.find((v) => v.id === id) || null;
const gioGanNhat = (nguoi, homNay) => nguoi.filter((p) => p.loai === 'gio').map((p) => ({ p, j: ngayKeTiep(p.cal, p.d, p.m, homNay) })).filter((x) => x.j !== null).sort((a, b) => a.j - b.j)[0] || null;
/** Người có giỗ gần nhất (gợi ý "Người được giỗ"); không có → null. */
export const gioSapToi = (nguoi, homNay) => (gioGanNhat(nguoi, homNay) || {}).p || null;

/** Ngày dương (số ngày Julius) của lần cúng tới của một dịp, từ `homNay` (tính cả hôm nay). Dịp giỗ lấy ngày giỗ gần nhất trong `nguoi`. Không có → null. */
export function vkNext(v, homNay, nguoi = []) {
  const h = jd(homNay);
  if (v.kieu === 'mot15') {
    for (let i = 0; i < TOI_DA_TIM_MOT_15; i++) { const l = lichAm(h + i); if (l.d === 1 || l.d === 15) return h + i; }
    return null;
  }
  if (v.kieu === 'giaothua') { // chiều 30 (hoặc 29) Chạp = trước mùng 1 Tết một ngày
    for (let i = 0, y = lichAm(h).y; i < 2; i++, y++) { const t = amSangDuong(1, 1, y + 1), j = t === null ? -1 : t - 1; if (j >= h) return j; }
    return null;
  }
  if (v.kieu === 'thanhminh') { // ngày đầu tiết Thanh minh (4–5/4 dương lịch)
    for (let y = homNay.y; y <= homNay.y + 1; y++) for (let d = 1; d <= 9; d++) { const j = LUNAR.jdFromDate(d, 4, y), t = LUNAR.term(j); if (t.idx === 1 && t.startsToday && j >= h) return j; }
    return null;
  }
  if (v.gio) { const g = gioGanNhat(nguoi, homNay); return g ? g.j : null; }
  return v.lunar ? ngayKeTiep('am', v.lunar[0], v.lunar[1], homNay) : null;
}

/** Cả 11 dịp: [{ v, j }] gần nhất trước, dịp chưa có ngày (giỗ chưa thêm) ở cuối. */
export const dipSapXep = (homNay, nguoi = []) => VK.map((v) => ({ v, j: vkNext(v, homNay, nguoi) })).sort((a, b) => (a.j ?? 1e9) - (b.j ?? 1e9));

/**
 * Bài khấn đã điền: mảng dòng, mỗi dòng là mảng đoạn { t, mark } (mark = chỗ tự điền, tô màu). `tt` = { ten, dc, ho, nm }; `j` = ngày cúng.
 * Thiếu thông tin → đoạn tô màu để TRỐNG (không bịa); "Người được giỗ / Hương linh" trống → "các cụ Tổ tiên" (như demo). Giao thừa: {ny} năm mới, {nyc} năm cũ.
 */
export function dienBai(v, tt, j) {
  const l = lichAm(j);
  const gia = {
    ten: tt.ten || '', dc: tt.dc || '', ho: tt.ho || '', ld: l.d <= 10 ? 'mùng ' + l.d : String(l.d), lm: LNUM[l.m] || String(l.m),
    ny: LUNAR.yearName(v.newYear ? l.y + 1 : l.y), nyc: LUNAR.yearName(l.y), nm: tt.nm || 'các cụ Tổ tiên',
  };
  return v.vk.join('\n').split('\n').map((dong) => dong.split(/\{(\w+)\}/g).map((p, i) => (i % 2 ? { t: gia[p] ?? `{${p}}`, mark: true } : { t: p, mark: false })).filter((d) => d.mark || d.t));
}

/** Ngày cúng bằng chữ cho tiêu đề / thẻ: "Rằm" · "Mùng 1" · tên dịp (phần trước dấu ·). */
export const tenNganDip = (v, j) => (v.id === 'r' ? (lichAm(j).d === 1 ? 'Mùng 1' : 'Rằm') : v.n.split(' ·')[0]);
export { tuJd };

/** Chữ "còn bao lâu" của dịp (demo leftTx): "Hôm nay" · "Ngày mai" · "Còn N ngày". */
export const chuConLai = (j, homNay) => { const n = j - jd(homNay); return n === 0 ? 'Hôm nay' : n === 1 ? 'Ngày mai' : `Còn ${n} ngày`; };
