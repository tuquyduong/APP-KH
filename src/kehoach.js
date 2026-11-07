// Kế hoạch và nhắc việc (KH-UI-5b): hàm tính CHÉP NGUYÊN logic demo (dayInfo, renderCal, holList, upList, SEASON…) thành hàm thuần,
// và phần LƯU TRÊN MÁY (khoá kh_kehoach). Bài thử cong_cu/thu_KHUI5b.js so từng ô với bảng lấy từ chính hàm của demo (thu_KHUI5b_mau.json).
// "Hôm nay" luôn là tham số { d, m, y } lấy từ giờ POS (bayGio()) — KHÔNG đọc đồng hồ máy, KHÔNG new Date(chuỗi giờ POS) (CLAUDE.md §6).
// Dữ liệu tĩnh ở noiDung/keHoach.js; LUNAR + TERM_TIPS ở lich.js.
import { LUNAR, TERM_TIPS } from './lich.js';
import { SOLAR_HOL, LUNAR_HOL, SEASON, WD } from './noiDung/keHoach.js';

export { TERM_TIPS };
export const KHOA_KE_HOACH = 'kh_kehoach';
export const SO_NGAY_SAP_TOI = 30;
export const KHONG_NHAC = 'Không nhắc';
export const CO_NHAC = 'Nhắc khi mở app'; // chữ cạnh công tắc: nhắc chỉ hiện khi khách MỞ app, chưa tự báo khi đóng app (chủ quán duyệt 06.11)
const GIO_MAC_DINH = '08:00';
const DAI_TIEU_DE = 120;
const TOI_DA_VIEC = 500;
const KHONG_VAO_SAP_TOI = /Tết Nguyên đán|Trung thu|Đoan ngọ|Vu Lan/; // demo upList: các lễ này đã có ở tiện ích Cúng (việc sau)

const pad = (n) => String(n).padStart(2, '0');
/** { d, m, y } → "YYYY-MM-DD". */
export const ngayChuoi = ({ d, m, y }) => `${y}-${pad(m)}-${pad(d)}`;
/** "YYYY-MM-DD" hợp lệ (có thật trong lịch) → { d, m, y }; không thì null. */
export function docNgay(chuoi) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(chuoi || ''));
  if (!t) return null;
  const r = { d: +t[3], m: +t[2], y: +t[1] };
  const x = LUNAR.jdToDate(LUNAR.jdFromDate(r.d, r.m, r.y));
  return x.d === r.d && x.m === r.m && x.y === r.y ? r : null;
}
/** Giờ VN "YYYY-MM-DD…" (bayGio()) → { d, m, y }; không đọc được → null. */
export const homNayTuGio = (gio) => docNgay(String(gio || '').slice(0, 10));

const jd = (n) => LUNAR.jdFromDate(n.d, n.m, n.y);
const tuJd = (j) => LUNAR.jdToDate(j);
const thuCua = (d, m, y) => new Date(y, m - 1, d).getDay(); // dựng từ thành phần ngày → không lệ thuộc múi giờ máy
const lichAm = (j) => { const x = tuJd(j); return LUNAR.solar2lunar(x.d, x.m, x.y); };

/** Demo dayInfo: ngày âm, tiết khí, ngày lễ (dương + âm, không tính tháng nhuận), thứ. */
export function thongTinNgay(d, m, y) {
  const l = LUNAR.solar2lunar(d, m, y), tm = LUNAR.term(l.jd);
  const le = [SOLAR_HOL[d + '/' + m], !l.leap && LUNAR_HOL[l.d + '/' + l.m]].filter(Boolean);
  return { l, tm, le, wd: thuCua(d, m, y) };
}

/** Mùa của một ngày (demo SEASON(LUNAR.term(TJ()).idx)): { n: 'Đông', ic: 'moon' }. */
export const muaNgay = (n) => SEASON(LUNAR.term(jd(n)).idx);

/** Thẻ ngày `calHero` của demo: mọi chữ đã ghép sẵn. `chon` = ngày đang chọn, `homNay` = hôm nay. */
export function theNgay(chon, homNay) {
  const x = thongTinNgay(chon.d, chon.m, chon.y), se = SEASON(x.tm.idx), la = chon.d === homNay.d && chon.m === homNay.m && chon.y === homNay.y;
  const con = x.tm.endJd - x.l.jd;
  return {
    thu: WD[x.wd] + (la ? ' · Hôm nay' : ''), lon: String(chon.d), thang: `Tháng ${chon.m}/${chon.y}`,
    am: `${x.l.d}/${x.l.m}${x.l.leap ? ' nhuận' : ''}`, ngayAm: x.l.d, thangAm: `/${x.l.m}${x.l.leap ? ' nhuận' : ''}`,
    namCanChi: `Năm ${LUNAR.yearName(x.l.y)}`, thangNgayCanChi: `Tháng ${LUNAR.monthName(x.l.m, x.l.y)} · Ngày ${LUNAR.dayName(x.l.jd)}`,
    mua: se, tiet: x.tm.name, chip: `Mùa ${se.n} · Tiết ${x.tm.name}`,
    conLai: x.tm.startsToday ? 'Bắt đầu hôm nay' : con <= 0 ? 'Mai sang tiết ' + x.tm.nextName : 'Còn ' + (con + 1) + ' ngày tới ' + x.tm.nextName,
    le: x.le.join(' · '), tip: TERM_TIPS[x.tm.idx], tietIdx: x.tm.idx,
  };
}

/**
 * Lưới tháng của demo (tuần bắt đầu thứ Hai, 35 hoặc 42 ô). `coViec(d, m, y)` cho biết ngày đó có việc không (chấm "Việc của tôi").
 * Chấm "Từ TQD" không có (POS chưa có dữ liệu).
 */
export function luoiThang(y, m, homNay, chon, coViec = () => false) {
  const batDau = (new Date(y, m - 1, 1).getDay() + 6) % 7;
  const j0 = LUNAR.jdFromDate(1, m, y) - batDau;
  const o = [];
  for (let i = 0; i < 42; i++) {
    const dt = tuJd(j0 + i), trong = dt.m === m;
    if (i === 35 && !trong) break;
    const l = LUNAR.solar2lunar(dt.d, dt.m, dt.y), tk = LUNAR.term(l.jd);
    const le = !!(SOLAR_HOL[dt.d + '/' + dt.m] || (!l.leap && LUNAR_HOL[l.d + '/' + l.m]));
    o.push({
      d: dt.d, m: dt.m, y: dt.y, ngoai: !trong, homNay: dt.d === homNay.d && dt.m === homNay.m && dt.y === homNay.y,
      chon: dt.d === chon.d && dt.m === chon.m && dt.y === chon.y, cn: i % 7 === 6, le,
      am: l.d === 1 ? l.d + '/' + l.m : String(l.d), tiet: tk.startsToday ? tk.name : '', coViec: !!coViec(dt.d, dt.m, dt.y),
    });
  }
  return o;
}

/** "Ngày lễ trong tháng" của demo: [{ d, n, al }]. */
export function leTrongThang(y, m) {
  const le = [], soNgay = new Date(y, m, 0).getDate();
  for (let d = 1; d <= soNgay; d++) {
    const l = LUNAR.solar2lunar(d, m, y);
    [SOLAR_HOL[d + '/' + m], !l.leap && LUNAR_HOL[l.d + '/' + l.m]].filter(Boolean).forEach((n) => {
      if (!le.find((z) => z.n === n)) le.push({ d, n, al: SOLAR_HOL[d + '/' + m] === n ? '' : ' (' + l.d + '/' + l.m + ' âm)' });
    });
  }
  return le;
}

// ----- ngày lễ sắp tới (demo l2s, nextLunar, nextSolar, holList) -----
const L2S = {};
function amSangDuong(ld, lm, ly) { // âm → số ngày Julius dương (bỏ qua tháng nhuận)
  const k = ld + '/' + lm + '/' + ly;
  if (k in L2S) return L2S[k];
  const g = LUNAR.jdFromDate(1, 1, ly) + 35 + Math.round((lm - 1) * 29.53) + ld - 1;
  for (let j = g - 30; j <= g + 62; j++) {
    const x = tuJd(j), l = LUNAR.solar2lunar(x.d, x.m, x.y);
    if (l.d === ld && l.m === lm && l.y === ly && !l.leap) return (L2S[k] = j);
  }
  return (L2S[k] = null);
}
function tiepAm(ld, lm, homNay) {
  let y = LUNAR.solar2lunar(homNay.d, homNay.m, homNay.y).y;
  for (let i = 0; i < 3; i++, y++) { const j = amSangDuong(ld, lm, y); if (j !== null && j >= jd(homNay)) return j; }
  return null;
}
function tiepDuong(d, m, homNay) {
  let j = LUNAR.jdFromDate(d, m, homNay.y);
  if (j < jd(homNay)) j = LUNAR.jdFromDate(d, m, homNay.y + 1);
  return j;
}

/** Demo holList: ngày lễ gần nhất trước — [{ n, j, cal }]. */
export function holList(homNay) {
  const a = Object.entries(SOLAR_HOL).map(([k, n]) => { const [d, m] = k.split('/').map(Number); return { n, j: tiepDuong(d, m, homNay), cal: 'Dương lịch ' + d + '/' + m }; });
  const thay = {};
  Object.entries(LUNAR_HOL).forEach(([k, n]) => {
    if (thay[n]) return;
    thay[n] = 1;
    const [d, m] = k.split('/').map(Number), j = tiepAm(d, m, homNay);
    if (j) a.push({ n, j, cal: 'Âm lịch ' + d + '/' + m });
  });
  return a.sort((x, y) => x.j - y.j);
}

/** Số ngày từ hôm nay tới `j` → "Hôm nay" / "N ngày" (demo tl-date). */
export const conLai = (j, homNay) => (j - jd(homNay) === 0 ? 'Hôm nay' : (j - jd(homNay)) + ' ngày');
/** "d/m" (kèm /năm nếu khác năm nay) của một ngày Julius — demo fJ(j).split(', ')[1]. */
export function ngayNgan(j, homNay) { const x = tuJd(j); return x.d + '/' + x.m + (x.y !== homNay.y ? '/' + x.y : ''); }
export const dayThang = (j) => { const x = tuJd(j); return x.d + '/' + x.m; };

/**
 * Demo upList (bản cuối) với nguồn có ở KH-UI-5b: việc của tôi chưa xong + ngày lễ, trong 30 ngày. Việc: `viec` = danh sách đã lưu.
 * Mỗi mục { j, t, s, k, ngay? } — `ngay` ('YYYY-MM-DD') chỉ có ở "Việc" để bấm vào mở đúng ngày trên lịch.
 */
export function upList(homNay, viec = []) {
  const out = [], tj = jd(homNay), cuoi = tj + SO_NGAY_SAP_TOI;
  viec.forEach((v) => {
    const n = docNgay(v.ngay);
    if (!n || v.xong) return;
    const j = jd(n);
    if (j >= tj && j <= cuoi) out.push({ j, t: v.tieu, s: v.gio + ' · ' + (v.nhac ? CO_NHAC : KHONG_NHAC), k: 'Việc', ngay: v.ngay });
  });
  holList(homNay).filter((h) => h.j <= cuoi && !KHONG_VAO_SAP_TOI.test(h.n)).forEach((h) => out.push({ j: h.j, t: h.n, s: h.cal, k: 'Lễ' }));
  return out.sort((a, b) => a.j - b.j);
}

/** Dòng nhỏ dưới mỗi ô tiện ích (demo toolBadge). */
export function chuThich(id, homNay, viec) {
  if (id === 'mua') return 'Mùa ' + muaNgay(homNay).n;
  if (id === 'hol') { const a = holList(homNay)[0]; return a ? ngayNgan(a.j, homNay) : ''; }
  if (id === 'up') return upList(homNay, viec).length + ' việc · ' + SO_NGAY_SAP_TOI + ' ngày';
  return '';
}

// ----- LƯU TRÊN MÁY (D1) -----
// Một bản duy nhất ở khoá kh_kehoach: { v:1, viec:[{ id, ngay, gio, tieu, nhac, xong }], leNhac:{ <tên lễ>:true }, anBanner:'YYYY-MM-DD' }.
// Không gửi gì lên máy chủ. Quy tắc xoá (đăng xuất / đổi khách) ở luuMay.js. Kho tiêm vào để thử.
const kho = () => localStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);
const TEN_LE = new Set([...Object.values(SOLAR_HOL), ...Object.values(LUNAR_HOL)]);
export const keHoachTrong = () => ({ viec: [], leNhac: {}, anBanner: '' });

function viecHopLe(v) {
  return v && typeof v === 'object' && typeof v.id === 'string' && v.id && !!docNgay(v.ngay) && /^([01]\d|2[0-3]):[0-5]\d$/.test(v.gio)
    && typeof v.tieu === 'string' && v.tieu.trim() && v.tieu.length <= DAI_TIEU_DE && typeof v.nhac === 'boolean' && typeof v.xong === 'boolean';
}

/** Đọc bản lưu; thiếu / hỏng / sai dạng → bỏ phần hỏng (không vỡ màn). */
export function docKeHoach(k = kho) {
  const bang = keHoachTrong();
  let tho;
  try { tho = JSON.parse(lay(k).getItem(KHOA_KE_HOACH)); } catch { return bang; }
  if (!tho || typeof tho !== 'object' || Array.isArray(tho)) return bang;
  if (Array.isArray(tho.viec)) {
    const ids = new Set();
    tho.viec.filter(viecHopLe).forEach((v) => { if (!ids.has(v.id) && bang.viec.length < TOI_DA_VIEC) { ids.add(v.id); bang.viec.push({ id: v.id, ngay: v.ngay, gio: v.gio, tieu: v.tieu.trim(), nhac: v.nhac, xong: v.xong }); } });
  }
  if (tho.leNhac && typeof tho.leNhac === 'object' && !Array.isArray(tho.leNhac)) Object.keys(tho.leNhac).forEach((n) => { if (tho.leNhac[n] === true && TEN_LE.has(n)) bang.leNhac[n] = true; });
  if (docNgay(tho.anBanner)) bang.anBanner = tho.anBanner;
  return bang;
}
/** Ghi bản lưu; kho bị chặn → false (màn KHÔNG được báo "đã lưu"). */
export function ghiKeHoach(bang, k = kho) {
  try { lay(k).setItem(KHOA_KE_HOACH, JSON.stringify({ v: 1, viec: bang.viec, leNhac: bang.leNhac, anBanner: bang.anBanner })); return true; } catch { return false; }
}
/** Nút "Xoá toàn bộ dữ liệu Kế hoạch trên máy này". Kho chặn → false. */
export function xoaKeHoach(k = kho) {
  try { lay(k).removeItem(KHOA_KE_HOACH); return true; } catch { return false; }
}

const idMoi = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
/** Thêm việc (demo saveAdd): tiêu đề trống → null (màn nhắc "Nhập tên việc trước nhé"); giờ trống → 08:00. */
export function themViec(bang, { ngay, gio, tieu, nhac }) {
  const t = String(tieu || '').trim().slice(0, DAI_TIEU_DE);
  if (!t || !docNgay(ngay) || bang.viec.length >= TOI_DA_VIEC) return null;
  const v = { id: idMoi(), ngay, gio: /^([01]\d|2[0-3]):[0-5]\d$/.test(gio) ? gio : GIO_MAC_DINH, tieu: t, nhac: !!nhac, xong: false };
  return { ...bang, viec: [...bang.viec, v] };
}
export const doiXong = (bang, id) => ({ ...bang, viec: bang.viec.map((v) => (v.id === id ? { ...v, xong: !v.xong } : v)) });
export const xoaViec = (bang, id) => ({ ...bang, viec: bang.viec.filter((v) => v.id !== id) });
export const doiNhacLe = (bang, ten) => {
  const le = { ...bang.leNhac };
  if (le[ten]) delete le[ten]; else if (TEN_LE.has(ten)) le[ten] = true;
  return { ...bang, leNhac: le };
};
export const anBannerHomNay = (bang, homNay) => ({ ...bang, anBanner: ngayChuoi(homNay) });
export const bannerDangAn = (bang, homNay) => bang.anBanner === ngayChuoi(homNay);
/** Việc của một ngày, sắp theo giờ (demo calAgenda). */
export const viecNgay = (bang, ngay) => bang.viec.filter((v) => v.ngay === ngay).sort((a, b) => a.gio.localeCompare(b.gio));
/** C1: việc HÔM NAY đã bật nhắc và chưa xong, theo giờ — thanh `calNoti`. */
export const nhacHomNay = (bang, homNay) => viecNgay(bang, ngayChuoi(homNay)).filter((v) => v.nhac && !v.xong);

const THU_NGAN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
/** Demo fJ: "T7, 20/11" (kèm /năm nếu khác năm nay). */
export function thuNgayNgan(j, homNay) { const x = tuJd(j); return THU_NGAN[thuCua(x.d, x.m, x.y)] + ', ' + ngayNgan(j, homNay); }
/** Tên tiết khí của một ngày (dòng "Dưỡng sinh theo tiết …" ở Theo mùa). */
export const tenTiet =(homNay) => LUNAR.term(jd(homNay)).name;
/** Thứ trong tuần của một ngày { d, m, y }: 0 = Chủ nhật … 6 = Thứ Bảy (chỉ số của WD). */
export const thuTrongTuan = (n) => thuCua(n.d, n.m, n.y);
