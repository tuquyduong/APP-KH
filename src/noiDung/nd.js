// Đọc nội dung App KH — MỘT chỗ (CLAUDE.md §11). Màn hình chỉ lấy chữ / ảnh / nút / danh sách / bật tắt qua các hàm ở đây và gắn `ndDau(khoa)`.
// Thứ tự lấy: bản đã cập nhật (datBanNoiDung — KH-ADMIN-1 sẽ tải từ kho nội dung) → `macDinh` trong danh mục. Giá trị hỏng → `macDinh` (một chữ hỏng không làm hỏng màn).
//
// Khuôn mục (src/noiDung/nd/<nhóm>.js): { khoa, man, ten, loai, macDinh, toiDa?, bien?, goiY?, truong?, khoaCauTruc?, tiLe? }
//   loai: chu (một dòng) · doan (nhiều dòng, "\n" = xuống dòng) · anh (đường dẫn, kèm tiLe) · nut ({ chu, dich } — dich thuộc DICH)
//         · danhsach (mảng đối tượng; `truong` khai mọi trường; `khoaCauTruc` = trường máy cần, không cho sửa) · battat (ẩn / hiện khối)
//   bien: tên chỗ điền {…} trong chữ — bản cập nhật phải giữ đủ.
// Mục KHOÁ (không sửa ở App, /admin hiện 🔒 + chỉ đường): { khoa, man, ten, khoaBoi: 'pos' | 'tutinh' | 'khach', chiDuong } — chỉ dùng với ndDau().
import { DANH_MUC, DICH } from './nd/index.js';

const LOAI = ['chu', 'doan', 'anh', 'nut', 'danhsach', 'battat'];
const KHOA_BOI = ['pos', 'tutinh', 'khach'];
const MA_DICH = DICH.map((d) => d[0]);
const ENV = import.meta.env || {};
const BAN_THAT = ENV.DEV === false; // bản dựng thật: khoá lạ → rỗng, không vỡ màn; dev / bài thử → báo lỗi ngay

const laChuoi = (x) => typeof x === 'string';
const laDoiTuong = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const choDien = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
const cungTap = (a, b) => { const A = new Set(a), B = new Set(b); return A.size === B.size && [...A].every((x) => B.has(x)); };
const chuDung = (m, s) => laChuoi(s) && cungTap(choDien(s), m.bien || []) && (!m.toiDa || s.length <= m.toiDa);
const cauTruc = (m, x) => (m.khoaCauTruc || []).map((t) => x[t]).join('\u0001');

/** Giá trị `gt` có dùng được cho mục `m` không (cùng luật cho macDinh và bản cập nhật). */
function hopLe(m, gt) {
  switch (m.loai) {
    case 'chu': case 'doan': return chuDung(m, gt);
    case 'anh': return laChuoi(gt) && gt.length > 0;
    case 'nut': return laDoiTuong(gt) && chuDung(m, gt.chu) && MA_DICH.includes(gt.dich);
    case 'battat': return typeof gt === 'boolean';
    case 'danhsach': {
      if (!Array.isArray(gt) || !laDoiTuong(m.truong)) return false;
      const goc = new Set((Array.isArray(m.macDinh) ? m.macDinh : []).map((x) => cauTruc(m, x)));
      const kc = (m.khoaCauTruc || []).length > 0;
      return gt.every((x) => laDoiTuong(x) && Object.keys(x).every((t) => t in m.truong)
        && Object.keys(m.truong).every((t) => laChuoi(x[t]) && (m.truong[t] !== 'anh' || x[t].length > 0)) && (!kc || goc.has(cauTruc(m, x))))
        && (!kc || new Set(gt.map((x) => cauTruc(m, x))).size === gt.length); // mỗi ô một khoá cấu trúc (khoá React, lọc món)
    }
    default: return false;
  }
}

/** Kiểm danh mục → mảng lời báo lỗi (rỗng = đúng). Bài thử chạy trên TOÀN BỘ danh mục. */
export function kiemDanhMuc(ds) {
  const loi = [], da = new Set();
  for (const m of ds) {
    const t = `«${m && m.khoa}»`, bao = (x) => loi.push(`${t} ${x}`);
    if (!laChuoi(m.khoa) || !/^\w+(\.\w+)+$/.test(m.khoa)) bao('khoá sai dạng <nhóm>.<tên>');
    if (da.has(m.khoa)) bao('khoá trùng'); da.add(m.khoa);
    if (!m.man) bao('thiếu man');
    if (!m.ten) bao('thiếu ten');
    if (m.khoaBoi !== undefined || m.chiDuong !== undefined) {
      if (!KHOA_BOI.includes(m.khoaBoi)) bao('khoaBoi phải là pos | tutinh | khach');
      if (!m.chiDuong) bao('mục khoá thiếu chiDuong');
      continue;
    }
    if (!LOAI.includes(m.loai)) { bao(`loai lạ hoặc thiếu loai (${m.loai})`); continue; }
    if (m.macDinh === undefined) { bao('thiếu macDinh'); continue; }
    const chu = m.loai === 'nut' ? (m.macDinh || {}).chu : m.macDinh;
    if (['chu', 'doan', 'nut'].includes(m.loai) && laChuoi(chu)) {
      if (!cungTap(choDien(chu), m.bien || [])) bao(`bien [${m.bien || ''}] khác chỗ điền trong macDinh [${choDien(chu)}]`);
      if (m.toiDa && chu.length > m.toiDa) bao(`toiDa ${m.toiDa} < độ dài mặc định ${chu.length}`);
    }
    if (m.loai === 'nut' && !MA_DICH.includes((m.macDinh || {}).dich)) bao(`nut.dich lạ (${(m.macDinh || {}).dich}) — phải thuộc DICH`);
    if (m.loai === 'anh' && !m.tiLe) bao('ảnh thiếu tiLe');
    if (m.loai === 'danhsach') {
      const la = laDoiTuong(m.truong) && Array.isArray(m.macDinh) ? [...new Set(m.macDinh.flatMap((x) => Object.keys(x)))].filter((x) => !(x in m.truong)) : [];
      if (!laDoiTuong(m.truong)) bao('danhsach thiếu truong'); else if (la.length) bao(`danhsach có trường không khai: ${la}`);
      if ((m.khoaCauTruc || []).some((x) => !laDoiTuong(m.truong) || !(x in m.truong))) bao('khoaCauTruc có trường không khai');
    }
    if (!loi.some((x) => x.startsWith(t)) && !hopLe(m, m.macDinh)) bao(`macDinh sai loại ${m.loai}`);
  }
  return loi;
}

const MUC = new Map(DANH_MUC.map((m) => [m.khoa, m]));
let ban = { so_ban: 0, gia_tri: {} };
let phien = 0;
const nguoiNghe = new Set();

function muc(khoa) {
  const m = MUC.get(khoa);
  if (!m && !BAN_THAT) throw new Error(`nd: khoá "${khoa}" không có trong danh mục nội dung (src/noiDung/nd/)`);
  return m;
}
function lay(khoa) {
  const m = muc(khoa);
  if (!m || m.khoaBoi) { if (m && !BAN_THAT) throw new Error(`nd: "${khoa}" là mục khoá (${m.khoaBoi}) — chỉ dùng ndDau()`); return undefined; }
  const gt = ban.gia_tri[khoa];
  return gt !== undefined && hopLe(m, gt) ? gt : m.macDinh;
}
const dien = (s, bien) => String(s).replace(/\{(\w+)\}/g, (x, t) => (bien && bien[t] != null ? String(bien[t]) : x));

/** Chữ (điền `{bien}`; thiếu biến thì giữ nguyên `{…}`, không bịa). */
export const nd = (khoa, bien) => { const v = lay(khoa); return v === undefined ? '' : dien(v, bien); };
/** Chữ thành MẢNG phần (chỗ điền là phần riêng) — React vẽ mỗi phần một nút chữ, y như JSX `{so} việc…` cũ (giữ nguyên điểm ảnh). */
export const ndPhan = (khoa, bien) => {
  const v = lay(khoa);
  return v === undefined ? [] : String(v).split(/(\{\w+\})/).filter(Boolean).map((p) => { const t = /^\{(\w+)\}$/.exec(p); return t && bien && bien[t[1]] != null ? bien[t[1]] : p; });
};
/** Nút → { chu, dich }. */
export const ndNut = (khoa) => lay(khoa) || { chu: '', dich: '' };
/** Ảnh → đường dẫn. */
export const ndAnh = (khoa) => lay(khoa) || '';
/** Danh sách → mảng. */
export const ndDs = (khoa) => lay(khoa) || [];
/** Bật / tắt khối (khoá lạ ở bản thật → hiện). */
export const ndHien = (khoa) => lay(khoa) !== false;
/** Thuộc tính đánh dấu chỗ sửa: { 'data-nd': khoá } (+ 'data-nd-khoa' cho mục khoá) — Chế độ sửa dựa vào đây để viền vàng / hiện 🔒. */
export function ndDau(khoa) {
  const m = muc(khoa);
  if (!m) return {};
  return m.khoaBoi ? { 'data-nd': khoa, 'data-nd-khoa': m.khoaBoi } : { 'data-nd': khoa };
}

/** Đặt bản nội dung đã cập nhật { so_ban, gia_tri: { khoá: giá trị } } (null / sai dạng = về mặc định) rồi báo người nghe. */
export function datBanNoiDung(b) {
  ban = laDoiTuong(b) && laDoiTuong(b.gia_tri) ? { so_ban: b.so_ban, gia_tri: b.gia_tri } : { so_ban: 0, gia_tri: {} };
  phien++;
  nguoiNghe.forEach((f) => f());
}
/** Nghe bản mới (trả hàm bỏ nghe) — dạng của useSyncExternalStore. */
export const ngheNoiDung = (f) => { nguoiNghe.add(f); return () => nguoiNghe.delete(f); };
/** Số lần đổi bản (tăng mỗi lần datBanNoiDung) — để vỏ App vẽ lại. */
export const phienNoiDung = () => phien;
