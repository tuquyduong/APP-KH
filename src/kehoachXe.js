// Xe cộ · Uống thuốc · Chu kỳ của Kế hoạch (KH-UI-5f; tách khỏi kehoach.js ở KH-ND-3d A4 theo việc): đọc từ bản lưu trên máy + hàm đổi bản (mỗi hàm trả bản mới, lỗi nhập → null).
// Chữ nằm ở danh mục (xe.* · thuoc.* · chuky.*); kehoach.js `export … from` lại để nơi gọi cũ không đổi.
import { docNgay, jdChuoi, chuoiJd, GIO_RE, LOAI_XE, CHU_KY, lichTheoLoai, bayNgayThuoc, chuKyTrong } from './kehoachLap.js';

export const so = (x, tu, den) => Number.isInteger(x) && x >= tu && x <= den;
export const chuoiNgan = (x, dai) => (typeof x === 'string' ? x.slice(0, dai) : '');
export const idMoi = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ----- XE · THUỐC · CHU KỲ đọc từ bản lưu (KH-UI-5f): thiếu / hỏng từng phần → bỏ phần hỏng, không vỡ màn -----
export const TOI_DA = { xe: 20, thuoc: 30, nhatKy: 200, hang: 30, ngayThuoc: 14, km: 9999999 };
const ten60 = (x) => chuoiNgan(x, 60).trim();
function hangDoc(h) {
  if (!h || typeof h !== 'object') return null;
  const ten = ten60(h.ten), km = so(h.km, 0, 1e6) ? h.km : 0, thang = so(h.thang, 0, 120) ? h.thang : 0;
  return ten && (km || thang) ? { ten, km, thang } : null;
}
function nhatKyDoc(l) {
  if (!l || typeof l !== 'object' || !docNgay(l.ngay)) return null;
  const viec = (Array.isArray(l.viec) ? l.viec : []).map(ten60).filter(Boolean);
  return viec.length ? { ngay: l.ngay, km: so(l.km, 0, TOI_DA.km) ? l.km : 0, viec, phi: so(l.phi, 0, 1e10) ? l.phi : 0, noi: chuoiNgan(l.noi, 80).trim() } : null;
}
export function xeDoc(x) {
  if (!x || typeof x !== 'object' || typeof x.id !== 'string' || !x.id || !LOAI_XE.includes(x.loai) || !ten60(x.ten)) return null;
  const ds = (a, f) => (Array.isArray(a) ? a : []).map(f).filter(Boolean);
  return {
    id: x.id, ten: ten60(x.ten), bien: chuoiNgan(x.bien, 20).trim(), loai: x.loai, km: so(x.km, 0, TOI_DA.km) ? x.km : 0, nhac: x.nhac !== false,
    lich: ds(x.lich, hangDoc).slice(0, TOI_DA.hang), nhatKy: ds(x.nhatKy, nhatKyDoc).slice(-TOI_DA.nhatKy),
    giayTo: ds(x.giayTo, (g) => (g && typeof g === 'object' && ten60(g.ten) ? { ten: ten60(g.ten), ngay: docNgay(g.ngay) ? g.ngay : '' } : null)).slice(0, TOI_DA.hang),
  };
}
export function thuocDoc(t) {
  if (!t || typeof t !== 'object' || typeof t.id !== 'string' || !t.id || !ten60(t.ten)) return null;
  const gio = [...new Set((Array.isArray(t.gio) ? t.gio : []).filter((g) => GIO_RE.test(g)))].sort().slice(0, 3);
  return gio.length ? { id: t.id, ten: ten60(t.ten), lieu: chuoiNgan(t.lieu, 40).trim(), ghi: chuoiNgan(t.ghi, 80).trim(), gio, den: docNgay(t.den) ? t.den : '', bd: docNgay(t.bd) ? t.bd : '', nhac: t.nhac !== false } : null;
}
export function thuocXongDoc(o) {
  const ra = {};
  if (!o || typeof o !== 'object' || Array.isArray(o)) return ra;
  Object.keys(o).filter((k) => docNgay(k) && Array.isArray(o[k])).sort().slice(-TOI_DA.ngayThuoc).forEach((k) => { ra[k] = [...new Set(o[k].filter((v) => typeof v === 'string' && /^.{1,40}@\d\d:\d\d$/.test(v)))].slice(0, 90); });
  return ra;
}
export function chuKyDoc(c) {
  if (!c || typeof c !== 'object' || c.bat !== true || !docNgay(c.bd)) return chuKyTrong();
  const ck = chuKyTrong(); // khoa / thu của bản lưu cũ (khoá mã đã bỏ 11.11) → bỏ qua
  ck.bat = true; ck.bd = c.bd; ck.nhac = c.nhac !== false;
  if (so(c.dai, ...CHU_KY.dai)) ck.dai = c.dai;
  if (so(c.hanh, ...CHU_KY.hanh)) ck.hanh = c.hanh;
  ck.ls = (Array.isArray(c.ls) ? c.ls : []).filter((n) => so(n, 10, 120)).slice(-CHU_KY.toiDaLs);
  return ck;
}

// ----- XE CỘ (KH-UI-5f A2–A3): mọi hàm trả bản mới, lỗi nhập → null -----
const capXe = (bang, id, f) => ({ ...bang, xe: bang.xe.map((x) => (x.id === id ? f(x) : x)) });
const kmHopLe = (km) => Math.min(TOI_DA.km, Math.max(0, Math.round(+km) || 0));
/** Thêm xe: tên trống / loại lạ / quá 20 xe → null; lịch + giấy tờ mặc định theo loại lấy từ `mau` (mục danh mục xe.macdinh). */
export function themXe(bang, { ten, bien, loai, km }, mau) {
  const { lich, giayTo } = lichTheoLoai(mau, loai);
  const x = bang.xe.length < TOI_DA.xe && xeDoc({ id: idMoi(), ten, bien, loai, km: kmHopLe(km), nhac: true, lich, giayTo, nhatKy: [] });
  return x ? { ...bang, xe: [...bang.xe, x] } : null;
}
export function suaXe(bang, id, { ten, bien, km }) {
  const t = ten60(ten);
  return t && bang.xe.some((x) => x.id === id) ? capXe(bang, id, (x) => ({ ...x, ten: t, bien: chuoiNgan(bien, 20).trim(), km: kmHopLe(km) })) : null;
}
export const datKmXe = (bang, id, km) => capXe(bang, id, (x) => ({ ...x, km: kmHopLe(km) }));
export const xoaXe = (bang, id) => ({ ...bang, xe: bang.xe.filter((x) => x.id !== id) });
export const doiNhacXe = (bang, id) => capXe(bang, id, (x) => ({ ...x, nhac: !x.nhac }));
/** "Vừa làm hôm nay" (demo carDone): ghi một lần sửa với số km hiện tại. */
export const ghiXongHang = (bang, id, tenHang, nay) => ghiLanSua(bang, id, { ngay: nay, km: 0, viec: [tenHang], phi: 0, noi: '' });
/** "Ghi lần sửa" (demo carSaveL): ngày sai / không có việc nào → null; km bỏ trống = km hiện tại; km xe tăng theo nếu lớn hơn. */
export function ghiLanSua(bang, id, { ngay, km, viec, phi, noi }) {
  const x = bang.xe.find((v) => v.id === id), l = x && nhatKyDoc({ ngay, km: kmHopLe(km) || x.km, viec: [...new Set(viec || [])], phi: Math.max(0, Math.round(+phi) || 0), noi });
  return l ? capXe(bang, id, (v) => ({ ...v, km: Math.max(v.km, l.km), nhatKy: [...v.nhatKy, l].slice(-TOI_DA.nhatKy) })) : null;
}
/** Thêm (k = null) hoặc sửa hạng mục; thiếu tên / thiếu cả km lẫn tháng → null. Đổi tên thì các lần đã ghi đổi theo (demo carSaveS). */
export function luuHang(bang, id, k, nhap) {
  const h = hangDoc({ ten: nhap.ten, km: kmHopLe(nhap.km), thang: Math.round(+nhap.thang) || 0 }), x = bang.xe.find((v) => v.id === id);
  if (!h || !x || (k === null ? x.lich.length >= TOI_DA.hang : !x.lich[k])) return null;
  return capXe(bang, id, (v) => {
    const cu = k === null ? '' : v.lich[k].ten;
    return { ...v, lich: k === null ? [...v.lich, h] : v.lich.map((a, i) => (i === k ? h : a)), nhatKy: cu && cu !== h.ten ? v.nhatKy.map((l) => ({ ...l, viec: l.viec.map((t) => (t === cu ? h.ten : t)) })) : v.nhatKy };
  });
}
export const xoaHang = (bang, id, k) => capXe(bang, id, (v) => ({ ...v, lich: v.lich.filter((_, i) => i !== k) }));
/** Ngày hết hạn của giấy tờ thứ k ('' = xoá ngày; ngày sai → null). */
export const datNgayGiay = (bang, id, k, ngay) => (ngay === '' || docNgay(ngay) ? capXe(bang, id, (v) => ({ ...v, giayTo: v.giayTo.map((g, i) => (i === k ? { ...g, ngay } : g)) })) : null);

// ----- UỐNG THUỐC (B1–B2): chỉ lưu trên máy -----
/** Thêm thuốc: thiếu tên / không giờ hợp lệ → null. `trong` = 7 · 14 · 30 ngày hoặc 0 (dài ngày); `nay` = 'YYYY-MM-DD'. */
export function themThuoc(bang, { ten, lieu, ghi, gio, trong }, nay) {
  const j = jdChuoi(nay), u = [7, 14, 30].includes(+trong) ? +trong : 0;
  const t = j !== null && bang.thuoc.length < TOI_DA.thuoc && thuocDoc({ id: idMoi(), ten, lieu, ghi, gio, bd: nay, den: u ? chuoiJd(j + u - 1) : '', nhac: true });
  return t ? { ...bang, thuoc: [...bang.thuoc, t] } : null;
}
export const xoaThuoc = (bang, id) => ({ ...bang, thuoc: bang.thuoc.filter((t) => t.id !== id), thuocXong: Object.fromEntries(Object.entries(bang.thuocXong).map(([k, v]) => [k, v.filter((x) => !x.startsWith(`${id}@`))])) });
export const doiNhacThuoc = (bang, id) => ({ ...bang, thuoc: bang.thuoc.map((t) => (t.id === id ? { ...t, nhac: !t.nhac } : t)) });
/** Bấm "HH:mm · Chưa uống / Đã uống": đảo dấu của giờ đó hôm nay (`nay`). Thuốc / giờ lạ → bản cũ. */
export function doiUong(bang, id, gio, nay) {
  const t = bang.thuoc.find((x) => x.id === id);
  if (!t || !t.gio.includes(gio) || !docNgay(nay)) return bang;
  const k = `${id}@${gio}`, cu = bang.thuocXong[nay] || [];
  return { ...bang, thuocXong: thuocXongDoc({ ...bang.thuocXong, [nay]: cu.includes(k) ? cu.filter((x) => x !== k) : [...cu, k] }) };
}
export { bayNgayThuoc };
