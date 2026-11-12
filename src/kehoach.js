// Kế hoạch và nhắc việc (KH-UI-5b): hàm tính CHÉP NGUYÊN logic demo (dayInfo, renderCal, holList, upList, SEASON…) thành hàm thuần,
// và phần LƯU TRÊN MÁY (khoá kh_kehoach). Bài thử cong_cu/thu_KHUI5b.js so từng ô với bảng lấy từ chính hàm của demo (thu_KHUI5b_mau.json).
// "Hôm nay" luôn là tham số { d, m, y } lấy từ giờ POS (bayGio()) — KHÔNG đọc đồng hồ máy, KHÔNG new Date(chuỗi giờ POS) (CLAUDE.md §6).
// Dữ liệu tĩnh ở noiDung/keHoach.js; LUNAR + TERM_TIPS ở lich.js.
import { LUNAR, TERM_TIPS } from './lich.js';
import { nd } from './noiDung/nd.js';
import { SOLAR_HOL, LUNAR_HOL, SEASON, WD } from './noiDung/keHoach.js';
import { docNgay, ngayChuoi, viecNgay, cacLan, daXongLan as daXong, jd as jdNgay, chuoiJd, GIO_RE, HAN_NHAC, LAN_XONG_TOI_DA, chuNhac, nhacTuPhut, gioPhut, amSangDuong, ngayKeTiep, soNgayThang, lichAm, jdChuoi, LOAI_XE, CHU_KY, lichTheoLoai, sapHang, trangThaiHang, trangThaiGiay, homNayThuoc, bayNgayThuoc, chuKyHomNay, trangThaiXe, chuHang, chuGiay, gioThuocChuaUong, chuKyTrong } from './kehoachLap.js';
export { chuHang, chuGiay, chuLich, chuXe, gioThuocChuaUong, chuKyTrong, batChuKy, tatChuKy, ghiKyMoi, doiDaiChuKy, doiHanhChuKy, doiNhacChuKy } from './kehoachLap.js';
import { VK, MA_DIP } from './noiDung/vanKhan.js';
import { vkNext, dipSapXep, tenNganDip } from './vanKhan.js';

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

// ----- ngày lễ sắp tới (demo nextLunar, nextSolar, holList; âm → dương: kehoachLap.amSangDuong) -----
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
 * Demo upList (bản cuối): việc của tôi chưa xong, sinh nhật / giỗ, ngày cúng (mọi dịp trừ Cúng giỗ), ngày lễ — trong 30 ngày, gần nhất trước. `bang` = bản Kế hoạch đã lưu.
 * Mỗi mục { j, t, s, k, di, ngay?, dip? } — `di` = chỗ mở khi bấm: 'viec' (kèm `ngay` 'YYYY-MM-DD') · 'nguoi' · 'cung' (kèm `dip`) · 'le'.
 */
export function upList(homNay, bang, xung) {
  const out = [], tj = jd(homNay), cuoi = tj + SO_NGAY_SAP_TOI;
  bang.viec.forEach((v) => cacLan(v, tj, cuoi).forEach((j) => {
    if (daXong(v, j)) return;
    out.push({ j, t: v.tieu, s: (v.gio || 'Cả ngày') + ' · ' + (typeof v.nhac === 'number' ? chuNhac(nhacTuPhut(v.nhac, v.gio)) : KHONG_NHAC), k: 'Việc', di: 'viec', ngay: chuoiJd(j) });
  }));
  bang.nguoi.forEach((p) => {
    const j = ngayKeTiep(p.cal, p.d, p.m, homNay);
    if (j !== null && j <= cuoi) out.push({ j, t: (p.loai === 'gio' ? 'Giỗ ' : 'Sinh nhật ') + p.ten, s: thuNgayNgan(j, homNay), k: p.loai === 'gio' ? 'Giỗ' : 'Sinh nhật', di: 'nguoi' });
  });
  VK.filter((v) => !v.gio).forEach((v) => {
    const j = vkNext(v, homNay, bang.nguoi);
    if (j && j <= cuoi) { const l = lichAm(j); out.push({ j, t: v.n, s: 'Âm lịch ' + l.d + '/' + l.m, k: 'Cúng', di: 'cung', dip: v.id }); }
  });
  holList(homNay).filter((h) => h.j <= cuoi && !KHONG_VAO_SAP_TOI.test(h.n)).forEach((h) => out.push({ j: h.j, t: h.n, s: h.cal, k: 'Lễ', di: 'le' }));
  bang.xe.forEach((x) => {
    sapHang(x, tj).forEach(({ hang, st }) => { if (st.soon || (st.denJ !== null && st.denJ <= cuoi)) out.push({ j: Math.max(tj, st.denJ ?? tj), t: `${hang.ten} · ${x.ten}`, s: chuHang(st), k: nd('ti.tagXe'), di: 'xe' }); });
    x.giayTo.forEach((g) => { const st = trangThaiGiay(g, tj); if (st.j !== null && st.j <= cuoi) out.push({ j: Math.max(tj, st.j), t: `${g.ten} · ${x.ten}`, s: chuGiay(st, homNay), k: nd('ti.tagXe'), di: 'xe' }); });
  });
  const gioChuaUong = gioThuocChuaUong(bang, tj);
  gioChuaUong.forEach((g) => out.push({ j: tj, t: nd('thuoc.nhacTieu'), s: g, k: nd('ti.tagThuoc'), di: 'thuoc' }));
  if (bang.chuKy.bat && coChuKy(xung)) {
    const n = chuKyHomNay(bang.chuKy, tj);
    if (n.nextJ <= cuoi && n.nextJ >= tj) out.push({ j: n.nextJ, t: nd('chuky.sapToi'), s: nd('chuky.sapToiPhu', { so: bang.chuKy.dai }), k: nd('ti.tagChuKy'), di: 'chuky' });
  }
  return out.sort((a, b) => a.j - b.j);
}

/** Ô Chu kỳ ẩn khi khách xưng anh / chú / bác / ông (A2); chưa biết xưng hô → vẫn hiện. */
export const coChuKy = (xungHo) => !['anh', 'chu', 'bac', 'ong'].includes(xungHo);
/** Dòng nhỏ dưới mỗi ô tiện ích (demo toolBadge): 'mua' · 'vk' · 'ngay' · 'xe' · 'thuoc' · 'chuky'. */
export function chuThich(id, homNay, bang) {
  const nay = (j) => (j - jd(homNay) ? (j - jd(homNay)) + ' ng' : 'nay');
  if (id === 'mua') return 'Mùa ' + muaNgay(homNay).n;
  if (id === 'vk') { const a = dipSapXep(homNay, bang.nguoi).find((x) => x.j); return a ? tenNganDip(a.v, a.j) + ' · ' + nay(a.j) : ''; }
  if (id === 'ngay') {
    const a = [...bang.nguoi.map((p) => ({ n: p.ten, j: ngayKeTiep(p.cal, p.d, p.m, homNay) })).filter((x) => x.j !== null), ...holList(homNay)].sort((x, y) => x.j - y.j)[0];
    return a ? a.n.replace('Tết ', '') + ' · ' + nay(a.j) : '';
  }
  if (id === 'xe') {
    const n = bang.xe.filter((x) => trangThaiXe(x, jd(homNay)).soon).length;
    return bang.xe.length ? nd('xe.badgeCo', { xe: bang.xe.length, them: n ? nd('xe.badgeSap', { so: n }) : nd('xe.badgeOn') }) : nd('xe.badgeTrong');
  }
  if (id === 'thuoc') { const t = homNayThuoc(bang, jd(homNay)); return t.all ? nd('thuoc.badge', { xong: t.done, tong: t.all }) : nd('thuoc.badgeTrong'); }
  const ck = bang.chuKy; // 'chuky'
  return !ck.bat ? nd('chuky.badgeBat') : nd('chuky.badgeNgay', { so: chuKyHomNay(ck, jd(homNay)).day });
}

// ----- LƯU TRÊN MÁY (D1) -----
// Một bản duy nhất ở khoá kh_kehoach: { v:1, viec:[{ id, ngay, gio ('' = cả ngày), tieu, nhac (phút từ 00:00 của ngày việc, âm = trước; null = không), xong,
// lap:{ k, n, den }|null, lanXong:['YYYY-MM-DD'…≤24], moc }], leNhac:{ <tên lễ>:true },
// nguoi:[{ id, loai:'sn'|'gio', ten, cal:'duong'|'am', d, m, nam (năm sinh|null), nhac (phút như việc cả ngày: 480 = 8h cùng ngày, -240 = 20h hôm trước, -3840 = 8h trước 3 ngày; null = không) }]  (KH-UI-5e),
// vk:{ ten, ho, dc, nm, fs (cỡ chữ 14–26), tick:{ '<dịp>:<năm>':[chỉ số lễ vật đã sắm] }, nhac:{ <dịp>:true } } }. Thiếu nguoi / vk (bản 5b–5d) → mặc định. (Bản cũ có trường anBanner — nút ✕ đã bỏ ở KH-UI-5d — đọc bỏ qua.)
// Bản 5b cũ (không có lap / lanXong; nhac là true / false) đọc được: nhac true → đúng giờ của việc. Không gửi gì lên máy chủ.
// Quy tắc xoá (đăng xuất / đổi khách) ở luuMay.js. Kho tiêm vào để thử.
const kho = () => localStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);
const TEN_LE = new Set([...Object.values(SOLAR_HOL), ...Object.values(LUNAR_HOL)]);
export const TOI_DA_NGUOI = 100;
export const TEN_NGUOI_TOI_DA = 40;
export const CO_CHU = { nho: 14, lon: 26, mac: 17, buoc: 2 };
const TOI_DA_TICK = 60; // số cặp dịp:năm giữ lại
const vkTrong = () => ({ ten: null, ho: null, dc: null, nm: null, fs: CO_CHU.mac, tick: {}, nhac: {} });
export const keHoachTrong = () => ({ viec: [], leNhac: {}, nguoi: [], vk: vkTrong(), xe: [], thuoc: [], thuocXong: {}, chuKy: chuKyTrong() });
export const NHAC_NGUOI = [['Không nhắc', null], ['Đúng ngày', 480], ['1 ngày trước', -240], ['3 ngày trước', -3840]];
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

const so = (x, tu, den) => Number.isInteger(x) && x >= tu && x <= den;
const chuoiNgan = (x, dai) => (typeof x === 'string' ? x.slice(0, dai) : '');
/** Một người thân đọc từ bản lưu: hỏng → null. */
function nguoiDoc(p) {
  if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !p.id || (p.loai !== 'sn' && p.loai !== 'gio') || (p.cal !== 'duong' && p.cal !== 'am')) return null;
  const ten = typeof p.ten === 'string' ? p.ten.trim().slice(0, TEN_NGUOI_TOI_DA) : '';
  if (!ten || !so(p.m, 1, 12) || !so(p.d, 1, p.cal === 'am' ? 30 : soNgayThang(p.m, 2000))) return null;
  return { id: p.id, loai: p.loai, ten, cal: p.cal, d: p.d, m: p.m, nam: p.loai === 'sn' && so(p.nam, 1800, 2200) ? p.nam : null, nhac: NHAC_NGUOI.some((n) => n[1] === p.nhac) ? p.nhac : null };
}
/** Thông tin văn khấn đọc từ bản lưu: thiếu / hỏng → mặc định từng phần. */
function vkDoc(o) {
  const vk = vkTrong();
  if (!o || typeof o !== 'object' || Array.isArray(o)) return vk;
  const chuoiHoacNull = (x, dai) => (typeof x === 'string' ? x.slice(0, dai) : null); // null = chưa nhập (hiện gợi ý); '' = khách chủ ý để trống
  vk.ten = chuoiHoacNull(o.ten, 80); vk.ho = chuoiHoacNull(o.ho, 40); vk.dc = chuoiHoacNull(o.dc, 300); vk.nm = chuoiHoacNull(o.nm, 80);
  if (so(o.fs, CO_CHU.nho, CO_CHU.lon)) vk.fs = o.fs;
  if (o.tick && typeof o.tick === 'object' && !Array.isArray(o.tick)) {
    Object.keys(o.tick).slice(-TOI_DA_TICK).forEach((k) => {
      const [dip, nam] = k.split(':');
      if (MA_DIP.includes(dip) && /^\d{4}$/.test(nam) && Array.isArray(o.tick[k])) vk.tick[k] = [...new Set(o.tick[k].filter((i) => so(i, 0, 29)))].sort((a, b) => a - b);
    });
  }
  if (o.nhac && typeof o.nhac === 'object' && !Array.isArray(o.nhac)) Object.keys(o.nhac).forEach((k) => { if (o.nhac[k] === true && MA_DIP.includes(k)) vk.nhac[k] = true; });
  return vk;
}

// ----- XE · THUỐC · CHU KỲ đọc từ bản lưu (KH-UI-5f): thiếu / hỏng từng phần → bỏ phần hỏng, không vỡ màn -----
const TOI_DA = { xe: 20, thuoc: 30, nhatKy: 200, hang: 30, ngayThuoc: 14, km: 9999999 };
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
function xeDoc(x) {
  if (!x || typeof x !== 'object' || typeof x.id !== 'string' || !x.id || !LOAI_XE.includes(x.loai) || !ten60(x.ten)) return null;
  const ds = (a, f) => (Array.isArray(a) ? a : []).map(f).filter(Boolean);
  return {
    id: x.id, ten: ten60(x.ten), bien: chuoiNgan(x.bien, 20).trim(), loai: x.loai, km: so(x.km, 0, TOI_DA.km) ? x.km : 0, nhac: x.nhac !== false,
    lich: ds(x.lich, hangDoc).slice(0, TOI_DA.hang), nhatKy: ds(x.nhatKy, nhatKyDoc).slice(-TOI_DA.nhatKy),
    giayTo: ds(x.giayTo, (g) => (g && typeof g === 'object' && ten60(g.ten) ? { ten: ten60(g.ten), ngay: docNgay(g.ngay) ? g.ngay : '' } : null)).slice(0, TOI_DA.hang),
  };
}
function thuocDoc(t) {
  if (!t || typeof t !== 'object' || typeof t.id !== 'string' || !t.id || !ten60(t.ten)) return null;
  const gio = [...new Set((Array.isArray(t.gio) ? t.gio : []).filter((g) => GIO_RE.test(g)))].sort().slice(0, 3);
  return gio.length ? { id: t.id, ten: ten60(t.ten), lieu: chuoiNgan(t.lieu, 40).trim(), ghi: chuoiNgan(t.ghi, 80).trim(), gio, den: docNgay(t.den) ? t.den : '', bd: docNgay(t.bd) ? t.bd : '', nhac: t.nhac !== false } : null;
}
function thuocXongDoc(o) {
  const ra = {};
  if (!o || typeof o !== 'object' || Array.isArray(o)) return ra;
  Object.keys(o).filter((k) => docNgay(k) && Array.isArray(o[k])).sort().slice(-TOI_DA.ngayThuoc).forEach((k) => { ra[k] = [...new Set(o[k].filter((v) => typeof v === 'string' && /^.{1,40}@\d\d:\d\d$/.test(v)))].slice(0, 90); });
  return ra;
}
function chuKyDoc(c) {
  if (!c || typeof c !== 'object' || c.bat !== true || !docNgay(c.bd)) return chuKyTrong();
  const ck = chuKyTrong(); // khoa / thu của bản lưu cũ (khoá mã đã bỏ 11.11) → bỏ qua
  ck.bat = true; ck.bd = c.bd; ck.nhac = c.nhac !== false;
  if (so(c.dai, ...CHU_KY.dai)) ck.dai = c.dai;
  if (so(c.hanh, ...CHU_KY.hanh)) ck.hanh = c.hanh;
  ck.ls = (Array.isArray(c.ls) ? c.ls : []).filter((n) => so(n, 10, 120)).slice(-CHU_KY.toiDaLs);
  return ck;
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
  if (Array.isArray(tho.nguoi)) {
    const ids = new Set();
    tho.nguoi.forEach((p) => { const x = nguoiDoc(p); if (x && !ids.has(x.id) && bang.nguoi.length < TOI_DA_NGUOI) { ids.add(x.id); bang.nguoi.push(x); } });
  }
  bang.vk = vkDoc(tho.vk);
  const ids = new Set();
  (Array.isArray(tho.xe) ? tho.xe : []).forEach((x) => { const v = xeDoc(x); if (v && !ids.has(v.id) && bang.xe.length < TOI_DA.xe) { ids.add(v.id); bang.xe.push(v); } });
  (Array.isArray(tho.thuoc) ? tho.thuoc : []).forEach((t) => { const v = thuocDoc(t); if (v && !ids.has(v.id) && bang.thuoc.length < TOI_DA.thuoc) { ids.add(v.id); bang.thuoc.push(v); } });
  bang.thuocXong = thuocXongDoc(tho.thuocXong);
  bang.chuKy = chuKyDoc(tho.chuKy);
  return bang;
}
/** Ghi bản lưu; kho bị chặn → false (màn KHÔNG được báo "đã lưu"). */
export function ghiKeHoach(bang, k = kho) {
  try { lay(k).setItem(KHOA_KE_HOACH, JSON.stringify({ v: 1, viec: bang.viec, leNhac: bang.leNhac, nguoi: bang.nguoi, vk: bang.vk, xe: bang.xe, thuoc: bang.thuoc, thuocXong: bang.thuocXong, chuKy: bang.chuKy })); return true; } catch { return false; }
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


// ----- NGƯỜI THÂN (sinh nhật · giỗ) -----
/** Chuẩn hoá phần nhập: tên trống / ngày sai (30/2 dương, 31 âm, tháng ngoài 1–12) → null. */
function nguoiTuNhap({ loai, ten, cal, d, m, nam, nhac }) {
  const x = nguoiDoc({ id: 'x', loai, ten, cal, d: +d, m: +m, nam: nam ? +nam : null, nhac: nhac === undefined ? null : nhac });
  return x && { loai: x.loai, ten: x.ten, cal: x.cal, d: x.d, m: x.m, nam: x.nam, nhac: x.nhac };
}
export function themNguoi(bang, nhap) {
  const x = nguoiTuNhap(nhap);
  return x && bang.nguoi.length < TOI_DA_NGUOI ? { ...bang, nguoi: [...bang.nguoi, { id: idMoi(), ...x }] } : null;
}
export function suaNguoi(bang, id, nhap) {
  const x = nguoiTuNhap(nhap);
  return x && bang.nguoi.some((p) => p.id === id) ? { ...bang, nguoi: bang.nguoi.map((p) => (p.id === id ? { id, ...x } : p)) } : null;
}
export const xoaNguoi = (bang, id) => ({ ...bang, nguoi: bang.nguoi.filter((p) => p.id !== id) });
/** Danh sách người thân, lần tới gần nhất trước: [{ p, j }] (j = số ngày Julius dương). */
export const nguoiSapXep = (bang, homNay) => bang.nguoi.map((p) => ({ p, j: ngayKeTiep(p.cal, p.d, p.m, homNay) })).filter((x) => x.j !== null).sort((a, b) => a.j - b.j);
/** "Tròn N tuổi" của lần sinh nhật ở ngày `j`: cần năm sinh; chưa tới tuổi 1 → ''. */
export const tronTuoi = (p, j) => (p.loai === 'sn' && p.nam && tuJd(j).y - p.nam >= 1 ? ` · tròn ${tuJd(j).y - p.nam} tuổi` : '');

// ----- VĂN KHẤN: thông tin, lễ vật đã sắm, nhắc dịp cúng, cỡ chữ -----
/** Đổi một hay nhiều trường ten · ho · dc · nm của Tín chủ. */
export const datThongTinVk = (bang, truong) => ({ ...bang, vk: vkDoc({ ...bang.vk, ...truong }) });
/** Tick / bỏ tick lễ vật số `i` của dịp `dip` ở năm `nam`. */
export function tickLeVat(bang, dip, nam, i) {
  const k = `${dip}:${nam}`, cu = bang.vk.tick[k] || [];
  const moi = cu.includes(i) ? cu.filter((x) => x !== i) : [...cu, i];
  return { ...bang, vk: vkDoc({ ...bang.vk, tick: { ...bang.vk.tick, [k]: moi } }) };
}
export const doiNhacDip = (bang, dip) => {
  const nhac = { ...bang.vk.nhac };
  if (nhac[dip]) delete nhac[dip]; else nhac[dip] = true;
  return { ...bang, vk: vkDoc({ ...bang.vk, nhac }) };
};
export const doiCoChu = (bang, buoc) => ({ ...bang, vk: { ...bang.vk, fs: Math.min(CO_CHU.lon, Math.max(CO_CHU.nho, bang.vk.fs + buoc * CO_CHU.buoc)) } });

// ----- NHẮC NGÀY CẦN NHỚ + DỊP CÚNG (B4, C4) -----
const KHUNG_NHAC = 1100; // ngày: dựng mốc nhắc / chuông cho ngần này ngày tới
const NHAC_XE = -7 * 1440 + 480; // xe: 08:00 trước hạn 7 ngày
const NHAC_DIP = -240;   // dịp cúng: 20:00 hôm trước ("nhắc trước 1 ngày để kịp sắm lễ")
function lanTrongKhung(tinh, tu, den) {
  const ra = [];
  for (let t = tu; t <= den;) { const j = tinh(tuJd(t)); if (!j || j > den) break; ra.push(j); t = j + 1; }
  return ra;
}
/**
 * Bản Kế hoạch + các "việc ảo" để TÍNH nhắc và chuông trên lịch (không lưu, không hiện ở danh sách việc): mỗi lần sinh nhật / giỗ tới (chuông luôn có, nhắc theo `nhac`),
 * và dịp cúng đã bật nhắc (Mùng 1 & Rằm dùng kiểu lặp âm lịch sẵn có). Chỉ từ hôm nay trở đi → không bao giờ "quá hạn".
 */
export function bangCoNhac(bang, homNay, xung) {
  const h = jd(homNay), den = h + KHUNG_NHAC, ao = [];
  const them = (id, j, tieu, nhac, them2 = {}) => ao.push({ id: `${id}:${j}`, ngay: chuoiJd(j), gio: '', tieu, nhac, xong: false, ao: true, ...them2 });
  bang.nguoi.forEach((p) => lanTrongKhung((n) => ngayKeTiep(p.cal, p.d, p.m, n), h, den).forEach((j) => them('ng' + p.id, j, (p.loai === 'gio' ? 'Giỗ ' : 'Sinh nhật ') + p.ten, p.nhac)));
  VK.filter((v) => !v.gio && bang.vk.nhac[v.id]).forEach((v) => {
    if (v.kieu === 'mot15') ao.push({ id: 'vk' + v.id, ngay: chuoiJd(h), gio: '', tieu: v.n, nhac: NHAC_DIP, xong: false, ao: true, lap: { k: 'amlich', n: 1, den: '' } });
    else lanTrongKhung((n) => vkNext(v, n, bang.nguoi), h, den).forEach((j) => them('vk' + v.id, j, v.n, NHAC_DIP));
  });
  bang.xe.filter((x) => x.nhac).forEach((x) => { // nhắc trước 7 ngày, 08:00: hạng mục có hạn theo tháng, giấy tờ có ngày
    x.lich.forEach((hang, k) => { const st = trangThaiHang(x, hang, h); if (st.denJ !== null) them(`xe${x.id}h${k}`, Math.max(h, st.denJ), `${hang.ten} · ${x.ten}`, NHAC_XE); });
    x.giayTo.forEach((g, k) => { const st = trangThaiGiay(g, h); if (st.j !== null) them(`xe${x.id}g${k}`, Math.max(h, st.j), `${g.ten} · ${x.ten}`, NHAC_XE); });
  });
  const hnThuoc = bang.thuoc.some((t) => t.nhac) ? gioThuocChuaUong({ ...bang, thuoc: bang.thuoc.filter((t) => t.nhac) }, h) : []; // SỨC KHOẺ: lời nhắc KHÔNG tên thuốc, KHÔNG lên lịch (rieng)
  hnThuoc.forEach((g) => ao.push({ id: `th:${g}`, ngay: chuoiJd(h), gio: g, tieu: nd('thuoc.nhacTieu'), nhac: gioPhut(g), xong: false, ao: true, rieng: true }));
  if (bang.chuKy.bat && bang.chuKy.nhac && coChuKy(xung)) {
    const n = chuKyHomNay(bang.chuKy, h);
    if (n.nextJ >= h) ao.push({ id: 'ck', ngay: chuoiJd(n.nextJ), gio: '', tieu: nd('chuky.loiNhac'), nhac: -CHU_KY.nhacTruoc * 1440 + 480, xong: false, ao: true, rieng: true });
  }
  return ao.length ? { ...bang, viec: [...bang.viec, ...ao] } : bang;
}

// ----- VĂN KHẤN: giá trị điền sẵn (E1) -----
/** Chữ đầu của họ tên ("Nguyễn Văn An" → "Nguyễn"). */
export const chuDauTen = (ten) => String(ten || '').trim().split(/\s+/)[0] || '';
/** Thông tin khi khấn đang dùng: khách đã sửa (kể cả để trống '') thì theo khách; chưa nhập (null) → lấy từ tài khoản: Tín chủ = tên, Địa chỉ = dia_chi, Họ gia tiên = chữ đầu của Tín chủ. */
export function thongTinVk(vk, hoSo = {}) {
  const ten = vk.ten ?? (hoSo.ten || '');
  return { ten, ho: vk.ho ?? chuDauTen(ten), dc: vk.dc ?? (hoSo.dia_chi || '') };
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
