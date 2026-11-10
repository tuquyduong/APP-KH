// Kế hoạch và nhắc việc (KH-UI-5b): hàm tính CHÉP NGUYÊN logic demo (dayInfo, renderCal, holList, upList, SEASON…) thành hàm thuần,
// và phần LƯU TRÊN MÁY (khoá kh_kehoach). Bài thử cong_cu/thu_KHUI5b.js so từng ô với bảng lấy từ chính hàm của demo (thu_KHUI5b_mau.json).
// "Hôm nay" luôn là tham số { d, m, y } lấy từ giờ POS (bayGio()) — KHÔNG đọc đồng hồ máy, KHÔNG new Date(chuỗi giờ POS) (CLAUDE.md §6).
// Dữ liệu tĩnh ở noiDung/keHoach.js; LUNAR + TERM_TIPS ở lich.js.
import { LUNAR, TERM_TIPS } from './lich.js';
import { SOLAR_HOL, LUNAR_HOL, SEASON, WD } from './noiDung/keHoach.js';
import { docNgay, ngayChuoi, viecNgay, cacLan, daXongLan as daXong, jd as jdNgay, chuoiJd, GIO_RE, HAN_NHAC, LAN_XONG_TOI_DA, chuNhac, nhacTuPhut, gioPhut } from './kehoachLap.js';

export { TERM_TIPS };
export const KHOA_KE_HOACH = 'kh_kehoach';
export const SO_NGAY_SAP_TOI = 30;
export const KHONG_NHAC = 'Không nhắc';
export const CO_NHAC = 'Nhắc khi mở app'; // chữ cạnh công tắc: nhắc chỉ hiện khi khách MỞ app, chưa tự báo khi đóng app (chủ quán duyệt 06.11)
const DAI_TIEU_DE = 120;
const TOI_DA_VIEC = 500;
const KHONG_VAO_SAP_TOI = /Tết Nguyên đán|Trung thu|Đoan ngọ|Vu Lan/; // demo upList: các lễ này đã có ở tiện ích Cúng (việc sau)

export { ngayChuoi, docNgay, viecNgay };
/** Giờ VN "YYYY-MM-DD…" (bayGio()) → { d, m, y }; không đọc được → null. */
export const homNayTuGio = (gio) => docNgay(String(gio || '').slice(0, 10));

const jd = jdNgay;
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
 * Lưới tháng của demo (tuần bắt đầu thứ Hai, 35 hoặc 42 ô). `coViec(d, m, y)` cho biết ngày đó có việc chưa xong ('viec'), có việc quá hạn ('qua') hay không (rỗng) — chuông "Việc của tôi".
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
      am: l.d === 1 ? l.d + '/' + l.m : String(l.d), tiet: tk.startsToday ? tk.name : '', coViec: coViec(dt.d, dt.m, dt.y) || '',
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
  viec.forEach((v) => cacLan(v, tj, cuoi).forEach((j) => {
    if (daXong(v, j)) return;
    out.push({ j, t: v.tieu, s: (v.gio || 'Cả ngày') + ' · ' + (typeof v.nhac === 'number' ? chuNhac(nhacTuPhut(v.nhac, v.gio)) : KHONG_NHAC), k: 'Việc', ngay: chuoiJd(j) });
  }));
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
// Một bản duy nhất ở khoá kh_kehoach: { v:1, viec:[{ id, ngay, gio ('' = cả ngày), tieu, nhac (phút từ 00:00 của ngày việc, âm = trước; null = không), xong,
// lap:{ k, n, den }|null, lanXong:['YYYY-MM-DD'…≤24], moc }], leNhac:{ <tên lễ>:true } }. (Bản cũ có trường anBanner — nút ✕ đã bỏ ở KH-UI-5d — đọc bỏ qua.)
// Bản 5b cũ (không có lap / lanXong; nhac là true / false) đọc được: nhac true → đúng giờ của việc. Không gửi gì lên máy chủ.
// Quy tắc xoá (đăng xuất / đổi khách) ở luuMay.js. Kho tiêm vào để thử.
const kho = () => localStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);
const TEN_LE = new Set([...Object.values(SOLAR_HOL), ...Object.values(LUNAR_HOL)]);
export const keHoachTrong = () => ({ viec: [], leNhac: {} });
const LOAI_LAP = ['ngay', 'tuan', 'thang', 'nam', 'amlich', 'sau'];

const nhacHopLe = (n) => n === null || typeof n === 'boolean' || (Number.isInteger(n) && n >= HAN_NHAC[0] && n <= HAN_NHAC[1]);
/** Kiểu lặp đọc từ bản lưu: hỏng → undefined (việc coi như không lặp). */
function lapDoc(l) {
  if (!l || typeof l !== 'object' || !LOAI_LAP.includes(l.k) || !Number.isInteger(l.n) || l.n < 1 || l.n > 365) return undefined;
  return { k: l.k, n: l.k === 'amlich' ? 1 : l.n, den: docNgay(l.den) ? l.den : '' };
}
function viecHopLe(v) {
  return v && typeof v === 'object' && typeof v.id === 'string' && v.id && !!docNgay(v.ngay) && (v.gio === '' || GIO_RE.test(v.gio))
    && typeof v.tieu === 'string' && v.tieu.trim() && v.tieu.length <= DAI_TIEU_DE && nhacHopLe(v.nhac) && typeof v.xong === 'boolean';
}
function viecDoc(v) {
  const ra = { id: v.id, ngay: v.ngay, gio: v.gio, tieu: v.tieu.trim(), nhac: v.nhac === true ? (gioPhut(v.gio) ?? 480) : typeof v.nhac === 'number' ? v.nhac : null, xong: v.xong };
  const lap = lapDoc(v.lap);
  if (lap) {
    ra.lap = lap;
    ra.lanXong = (Array.isArray(v.lanXong) ? v.lanXong.filter((x) => !!docNgay(x)) : []).sort().slice(-LAN_XONG_TOI_DA);
    if (docNgay(v.moc)) ra.moc = v.moc;
  }
  return ra;
}

/** Đọc bản lưu; thiếu / hỏng / sai dạng → bỏ phần hỏng (không vỡ màn). */
export function docKeHoach(k = kho) {
  const bang = keHoachTrong();
  let tho;
  try { tho = JSON.parse(lay(k).getItem(KHOA_KE_HOACH)); } catch { return bang; }
  if (!tho || typeof tho !== 'object' || Array.isArray(tho)) return bang;
  if (Array.isArray(tho.viec)) {
    const ids = new Set();
    tho.viec.filter(viecHopLe).forEach((v) => { if (!ids.has(v.id) && bang.viec.length < TOI_DA_VIEC) { ids.add(v.id); bang.viec.push(viecDoc(v)); } });
  }
  if (tho.leNhac && typeof tho.leNhac === 'object' && !Array.isArray(tho.leNhac)) Object.keys(tho.leNhac).forEach((n) => { if (tho.leNhac[n] === true && TEN_LE.has(n)) bang.leNhac[n] = true; });
  return bang;
}
/** Ghi bản lưu; kho bị chặn → false (màn KHÔNG được báo "đã lưu"). */
export function ghiKeHoach(bang, k = kho) {
  try { lay(k).setItem(KHOA_KE_HOACH, JSON.stringify({ v: 1, viec: bang.viec, leNhac: bang.leNhac })); return true; } catch { return false; }
}
/** Nút "Xoá toàn bộ dữ liệu Kế hoạch trên máy này". Kho chặn → false. */
export function xoaKeHoach(k = kho) {
  try { lay(k).removeItem(KHOA_KE_HOACH); return true; } catch { return false; }
}

const idMoi = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
/** Chuẩn hoá phần nhập của một việc; tiêu đề trống / ngày sai → null (màn nhắc lại). `nhac` = phút hoặc null; `lap` = { k, n, den }|null. */
function viecTuNhap({ ngay, gio, tieu, nhac, lap }) {
  const t = String(tieu || '').trim().slice(0, DAI_TIEU_DE), g = GIO_RE.test(gio) ? gio : '';
  const l = lap ? lapDoc(lap) : undefined, nh = typeof nhac === 'number' && nhacHopLe(nhac) ? nhac : null;
  if (!t || !docNgay(ngay)) return null;
  return { ngay, gio: g, tieu: t, nhac: nh, xong: false, ...(l ? { lap: l, lanXong: [] } : {}) };
}
/** Thêm việc: tiêu đề trống → null; không giờ = việc cả ngày. */
export function themViec(bang, nhap) {
  const v = viecTuNhap(nhap);
  if (!v || bang.viec.length >= TOI_DA_VIEC) return null;
  return { ...bang, viec: [...bang.viec, { id: idMoi(), ...v }] };
}
/** Sửa tên / ngày / giờ / lặp / nhắc của một việc (`nhap.ngay` sai / thiếu → giữ ngày cũ; việc lặp: ngày mới là ngày BẮT ĐẦU, lần đã xong giữ nguyên;
 *  đổi kiểu lặp thì làm lại danh sách lần đã xong). */
export function suaViec(bang, id, nhap) {
  const goc = bang.viec.find((x) => x.id === id), v = goc && viecTuNhap({ ...nhap, ngay: docNgay(nhap.ngay) ? nhap.ngay : goc.ngay });
  if (!v) return null;
  const giuLan = goc.lap && v.lap && goc.lap.k === v.lap.k && goc.lap.n === v.lap.n;
  const moi = { id, ...v, xong: goc.xong, ...(giuLan ? { lanXong: goc.lanXong, ...(goc.moc ? { moc: goc.moc } : {}) } : {}) };
  return { ...bang, viec: bang.viec.map((x) => (x.id === id ? moi : x)) };
}
export const xoaViec = (bang, id) => ({ ...bang, viec: bang.viec.filter((v) => v.id !== id) });
export const doiNhacLe = (bang, ten) => {
  const le = { ...bang.leNhac };
  if (le[ten]) delete le[ten]; else if (TEN_LE.has(ten)) le[ten] = true;
  return { ...bang, leNhac: le };
};

const THU_NGAN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
/** Demo fJ: "T7, 20/11" (kèm /năm nếu khác năm nay). */
export function thuNgayNgan(j, homNay) { const x = tuJd(j); return THU_NGAN[thuCua(x.d, x.m, x.y)] + ', ' + ngayNgan(j, homNay); }
/** Tên tiết khí của một ngày (dòng "Dưỡng sinh theo tiết …" ở Theo mùa). */
export const tenTiet =(homNay) => LUNAR.term(jd(homNay)).name;
/** Thứ trong tuần của một ngày { d, m, y }: 0 = Chủ nhật … 6 = Thứ Bảy (chỉ số của WD). */
export const thuTrongTuan = (n) => thuCua(n.d, n.m, n.y);

/** Dòng âm lịch của bảng ngày: "Rằm tháng 10 âm" · "Mùng 5 tháng 11 âm · nhuận · tháng thiếu". */
export function amLichChu(n) {
  const l = LUNAR.solar2lunar(n.d, n.m, n.y), dau = l.jd - l.d + 1;
  const x = tuJd(dau + 29), thieu = LUNAR.solar2lunar(x.d, x.m, x.y).d === 1; // ngày thứ 30 đã sang tháng sau = tháng thiếu (29 ngày)
  const ngay = l.d === 15 ? 'Rằm' : l.d <= 10 ? 'Mùng ' + l.d : 'Ngày ' + l.d;
  return `${ngay} tháng ${l.m} âm${l.leap ? ' · nhuận' : ''}${thieu ? ' · tháng thiếu' : ''}`;
}
