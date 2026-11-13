// KH-UI-5c — luật LẶP LẠI, NHẮC TRƯỚC, QUÁ HẠN, gõ nhanh có ngày, tìm việc: hàm thuần (không đọc đồng hồ, không đụng kho).
// "Hôm nay" luôn là tham số { d, m, y }, "bây giờ" là chuỗi giờ VN của POS (bayGio()) — CLAUDE.md §6.
// Luật lặp (chép từ app tham khảo của chủ quán): mọi lần lặp tính THẲNG từ ngày bắt đầu, không cộng dồn → không trôi ngày.
// Một lần (ngày) của việc lặp đã xử lý khi: ngày < `moc` (mốc "đã rà đến") HOẶC có trong `lanXong` (tối đa 24 lần gần nhất).
import { nd } from './noiDung/nd.js';
import { LUNAR } from './lich.js';

export const LAN_XONG_TOI_DA = 24;
export const TRA_LUI_TOI_DA = 400; // đếm lần lỡ của việc lặp lùi tối đa ngần này ngày
export const NHAC_TRUOC_TOI_DA = 30; // ngày
export const GIO_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const HAN_NHAC = [-NHAC_TRUOC_TOI_DA * 1440, 1439]; // nhac = phút tính từ 00:00 của ngày việc; âm = trước ngày đó
const SAU_NGAY = [7, 30, 60, 90];
export { SAU_NGAY };

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
export const jd = (n) => LUNAR.jdFromDate(n.d, n.m, n.y);
export const tuJd = (j) => LUNAR.jdToDate(j);
export const chuoiJd = (j) => ngayChuoi(tuJd(j));
export const jdChuoi = (s) => { const n = docNgay(s); return n ? jd(n) : null; };
export const soNgayThang = (m, y) => new Date(y, m, 0).getDate();
/** "d/m" hoặc "d/m/yyyy" của một ngày Julius (kèm năm khi khác `homNay.y`). */
export const dm = (j, homNay) => { const x = tuJd(j); return `${x.d}/${x.m}${homNay && x.y === homNay.y ? '' : '/' + x.y}`; };
export const dmNgan = (j) => { const x = tuJd(j); return `${x.d}/${x.m}`; };
export const gioPhut = (gio) => (GIO_RE.test(gio) ? +gio.slice(0, 2) * 60 + +gio.slice(3) : null);
export const phutGio = (p) => `${pad(Math.floor(p / 60))}:${pad(p % 60)}`;
/** Chuỗi giờ VN "YYYY-MM-DD HH:mm…" → số phút (ngày Julius × 1440 + phút trong ngày); không đọc được → NaN. */
export function phutTuGio(gio) {
  const t = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(String(gio || ''));
  return t ? LUNAR.jdFromDate(+t[3], +t[2], +t[1]) * 1440 + +t[4] * 60 + +t[5] : NaN;
}

// ----- NGÀY ÂM → DƯƠNG, NGÀY KẾ TIẾP (KH-UI-5e B4; demo l2s, nextLunar, nextSolar) -----
const L2S = {};
/** Ngày âm (tháng THƯỜNG, bỏ qua tháng nhuận) → số ngày Julius dương; không có ngày đó trong năm âm → null. */
export function amSangDuong(ld, lm, ly) {
  const k = ld + '/' + lm + '/' + ly;
  if (k in L2S) return L2S[k];
  const g = LUNAR.jdFromDate(1, 1, ly) + 35 + Math.round((lm - 1) * 29.53) + ld - 1;
  for (let j = g - 30; j <= g + 62; j++) {
    const x = tuJd(j), l = LUNAR.solar2lunar(x.d, x.m, x.y);
    if (l.d === ld && l.m === lm && l.y === ly && !l.leap) return (L2S[k] = j);
  }
  return (L2S[k] = null);
}
/** Như amSangDuong nhưng ngày 30 âm mà tháng đó thiếu → ngày 29 (giỗ không bị mất năm đó). */
export const amNgay = (ld, lm, ly) => { const j = amSangDuong(ld, lm, ly); return j === null && ld === 30 ? amSangDuong(29, lm, ly) : j; };
export const lichAm = (j) => { const x = tuJd(j); return LUNAR.solar2lunar(x.d, x.m, x.y); };
/** Lần tới (từ `homNay` tính cả hôm nay) của ngày d/m: `cal` 'am' → âm lịch; 'duong' → dương lịch, 29/02 năm không nhuận → 28/02. Không tính được → null. */
export function ngayKeTiep(cal, d, m, homNay) {
  const h = jd(homNay);
  if (cal === 'am') {
    for (let i = 0, y = lichAm(h).y; i < 3; i++, y++) { const j = amNgay(d, m, y); if (j !== null && j >= h) return j; }
    return null;
  }
  for (let y = homNay.y; y <= homNay.y + 1; y++) { const j = LUNAR.jdFromDate(Math.min(d, soNgayThang(m, y)), m, y); if (j >= h) return j; }
  return null;
}

// ----- LẶP LẠI -----
const KHOA_DON_VI = { ngay: 'lap.dvNgay', tuan: 'lap.dvTuan', thang: 'lap.dvThang', nam: 'lap.dvNam' };
const KHOA_HANG = { ngay: 'lap.hangNgay', tuan: 'lap.hangTuan', thang: 'lap.hangThang', nam: 'lap.hangNam' };
/** Tên đơn vị lặp (ngày · tuần · tháng · năm) và kiểu "Hằng …" — chữ ở danh mục (lap.dv*, lap.hang*). */
export const donViLap = (k) => nd(KHOA_DON_VI[k]);
export const hangLap = (k) => nd(KHOA_HANG[k]);
/** Chữ ngắn của kiểu lặp: "Hằng tháng" · "Mỗi 2 tuần" · "Mùng 1 & Rằm" · "Sau khi xong 30 ngày". */
export function chuLap(l) {
  if (!l) return nd('lap.khong');
  if (l.k === 'amlich') return nd('lap.amlich');
  if (l.k === 'sau') return nd('lap.sau', { n: l.n });
  return l.n === 1 ? hangLap(l.k) : nd('lap.moi', { n: l.n, dv: donViLap(l.k) });
}
/** Mô tả cạnh việc: "Hằng tháng · từ 31/1/2026 · đến 31/12/2026". */
export function moTaLap(v, homNay) {
  if (!v.lap) return '';
  const s = jdChuoi(v.ngay), e = v.lap.den && jdChuoi(v.lap.den);
  return [chuLap(v.lap), s && nd('lap.tu', { ngay: dm(s, homNay) }), e && nd('lap.den', { ngay: dm(e, homNay) })].filter(Boolean).join(' · ');
}

/** Các lần (số ngày Julius, tăng dần) của việc `v` trong [tuJ, denJ]. Không lặp / "sau khi xong" = đúng một lần ở v.ngay. */
export function cacLan(v, tuJ, denJ) {
  const j0 = jdChuoi(v.ngay);
  if (j0 === null) return [];
  const l = v.lap, hetHan = l && l.den ? jdChuoi(l.den) : null;
  const cuoi = hetHan === null ? denJ : Math.min(denJ, hetHan), ra = [];
  if (!l || l.k === 'sau') return j0 >= tuJ && j0 <= cuoi ? [j0] : [];
  if (l.k === 'amlich') {
    for (let j = Math.max(tuJ, j0); j <= cuoi; j++) { const x = tuJd(j), a = LUNAR.solar2lunar(x.d, x.m, x.y); if (a.d === 1 || a.d === 15) ra.push(j); }
    return ra;
  }
  if (l.k === 'ngay' || l.k === 'tuan') {
    const buoc = l.n * (l.k === 'tuan' ? 7 : 1);
    for (let j = j0 + Math.max(0, Math.ceil((tuJ - j0) / buoc)) * buoc; j <= cuoi; j += buoc) ra.push(j);
    return ra;
  }
  const s = tuJd(j0), buoc = l.k === 'nam' ? 12 * l.n : l.n; // tháng / năm: tính thẳng từ ngày bắt đầu, kẹp ngày cuối tháng
  for (let i = 0; ; i++) {
    const t = s.m - 1 + i * buoc, y = s.y + Math.floor(t / 12), m = (t % 12) + 1;
    const j = LUNAR.jdFromDate(Math.min(s.d, soNgayThang(m, y)), m, y);
    if (j > cuoi) break;
    if (j >= tuJ) ra.push(j);
  }
  return ra;
}

/** Lần có ngày Julius `j` của `v` đã xử lý (xong / bỏ qua) chưa. */
export function daXongLan(v, j) {
  if (!v.lap) return !!v.xong;
  if (v.lap.k === 'sau') return false;
  const moc = v.moc ? jdChuoi(v.moc) : null;
  return (moc !== null && j < moc) || (v.lanXong || []).includes(chuoiJd(j));
}

/** Việc của một ngày, sắp theo giờ (cả ngày trước): mỗi mục là bản của v với `ngay` = ngày đó, `goc` = ngày bắt đầu, `xong` theo lần đó. */
export function viecNgay(bang, ngay) {
  const j = jdChuoi(ngay);
  if (j === null) return [];
  return bang.viec.filter((v) => cacLan(v, j, j).length).map((v) => ({ ...v, goc: v.ngay, ngay, xong: daXongLan(v, j) })).sort((a, b) => a.gio.localeCompare(b.gio));
}

/** Chấm từng ngày trong [tuJ, denJ]: Map(ngày Julius → 'viec' | 'qua') — có việc chưa xong / có việc quá hạn (ưu tiên). */
export function danhDauNgay(bang, tuJ, denJ, homNay) {
  const h = jd(homNay), bd = new Map();
  bang.viec.forEach((v) => !v.rieng && cacLan(v, tuJ, denJ).forEach((j) => { if (!daXongLan(v, j)) bd.set(j, j < h || bd.get(j) === 'qua' ? 'qua' : 'viec'); }));
  return bd;
}

/** Việc quá hạn: [{ v, lan:[ngày Julius…], soLan }], việc lỡ lâu nhất trước. */
export function quaHan(bang, homNay) {
  const h = jd(homNay), ra = [];
  bang.viec.forEach((v) => {
    const tu = v.lap && v.lap.k !== 'sau' ? Math.max(jdChuoi(v.ngay), h - TRA_LUI_TOI_DA) : jdChuoi(v.ngay); // chỉ việc lặp bị giới hạn lùi
    const lan = cacLan(v, tu, h - 1).filter((j) => !daXongLan(v, j));
    if (lan.length) ra.push({ v, lan, soLan: lan.length });
  });
  return ra.sort((a, b) => a.lan[a.lan.length - 1] - b.lan[b.lan.length - 1]);
}

/** Hạn bằng chữ (D3) và có phải quá hạn không. `ngay` = ngày của lần ('YYYY-MM-DD') hoặc rỗng. */
export function chuHan(ngay, xong, homNay) {
  const j = jdChuoi(ngay);
  if (j === null) return { chu: nd('lap.chuaHan'), qua: false };
  const h = jd(homNay);
  if (j === h) return { chu: nd('lap.hanNay'), qua: false };
  return j < h && !xong ? { chu: nd('lap.quaHan', { ngay: dmNgan(j) }), qua: true } : { chu: nd('lap.han', { ngay: dmNgan(j) }), qua: false };
}

// ----- ĐỔI TRẠNG THÁI (trả bản mới, không sửa bản cũ) -----
const doiViec = (bang, id, f) => ({ ...bang, viec: bang.viec.map((v) => (v.id === id ? f(v) : v)) });
const sapNhoNhat = (ds) => [...ds].sort();
/** Tick một lần (`ngay` 'YYYY-MM-DD') của việc: không lặp → đảo xong; lặp → đảo lần đó; "sau khi xong N ngày" → dời sang N ngày sau hôm nay. */
export function tickLan(bang, id, ngay, homNay) {
  return doiViec(bang, id, (v) => {
    if (!v.lap) return { ...v, xong: !v.xong };
    if (v.lap.k === 'sau') return { ...v, ngay: chuoiJd(jd(homNay) + v.lap.n) };
    const mocRa = v.moc ? jdChuoi(v.moc) : null;
    if (mocRa !== null && jdChuoi(ngay) < mocRa) return v; // lần dưới mốc đã rà: không đảo được
    if ((v.lanXong || []).includes(ngay)) return { ...v, lanXong: v.lanXong.filter((x) => x !== ngay) };
    let ds = sapNhoNhat([...(v.lanXong || []), ngay]), moc = v.moc || '';
    while (ds.length > LAN_XONG_TOI_DA) { const bo = ds.shift(); const sau = chuoiJd(jdChuoi(bo) + 1); if (!moc || sau > moc) moc = sau; } // bỏ lần cũ nhất → mốc đã rà nhích tới đó
    return { ...v, lanXong: ds, moc };
  });
}
/** "✓ Đánh dấu cả N lần" / dọn hết lần lỡ: mọi lần trước hôm nay coi như đã xử lý. */
export const raSoatDen = (bang, id, homNay) => doiViec(bang, id, (v) => ({ ...v, moc: ngayChuoi(homNay) }));
/** Dời việc (không lặp, hoặc "sau khi xong") sang ngày khác. */
export const doiNgayViec = (bang, id, ngay) => doiViec(bang, id, (v) => ({ ...v, ngay }));
/** "Dời cả N việc sang hôm nay": mọi việc thường (không lặp) đang quá hạn. */
export function doiHetSangNay(bang, homNay) {
  const ids = new Set(quaHan(bang, homNay).filter((q) => !q.v.lap).map((q) => q.v.id));
  return { bang: { ...bang, viec: bang.viec.map((v) => (ids.has(v.id) ? { ...v, ngay: ngayChuoi(homNay) } : v)) }, so: ids.size };
}

// ----- HẸN GIỜ NHẮC -----
// Trạng thái trên màn giữ dạng tương đối: { k:'truoc', p } (p phút trước giờ sự kiện) hoặc { k:'luc', ngay, g } (ngày trước, lúc g 'HH:mm');
// chỉ đổi ra phút (`nhac`) khi lưu, nên đổi giờ sự kiện thì "Trước N phút" đi theo.
export const NHAC_CO_GIO = [{ k: 'truoc', p: 0 }, { k: 'truoc', p: 15 }, { k: 'truoc', p: 60 }, { k: 'truoc', p: 1440 }];
export const NHAC_CA_NGAY = [{ k: 'luc', ngay: 0, g: '08:00' }, { k: 'luc', ngay: 1, g: '20:00' }];
/** Dạng tương đối → phút từ 00:00 của ngày việc (âm = trước ngày đó); không tính được (thiếu giờ, ngoài giới hạn) → null. */
export function nhacRaPhut(kieu, gio) {
  if (!kieu) return null;
  const g = kieu.k === 'truoc' ? gioPhut(gio) : gioPhut(kieu.g);
  if (g === null) return null;
  const p = kieu.k === 'truoc' ? g - kieu.p : g - kieu.ngay * 1440;
  return p >= HAN_NHAC[0] && p <= HAN_NHAC[1] ? p : null;
}
/** Phút đã lưu → dạng tương đối để sửa lại. */
export function nhacTuPhut(nhac, gio) {
  if (typeof nhac !== 'number') return null;
  const g = gioPhut(gio), p = g === null ? -1 : g - nhac;
  if (p >= 0 && (p <= 180 || p === 1440)) return { k: 'truoc', p };
  const ngay = nhac < 0 ? Math.ceil(-nhac / 1440) : 0;
  return { k: 'luc', ngay, g: phutGio(ngay * 1440 + nhac) };
}
/** Chữ của dạng nhắc: "Đúng giờ" · "Trước 15 phút" · "Hôm trước lúc 20:00" · "Trước 3 ngày lúc 08:00". */
export function chuNhac(k) {
  if (!k) return nd('kh.khongNhac');
  if (k.k === 'truoc') return k.p === 0 ? nd('lap.nhacDung') : k.p === 1440 ? nd('lap.nhacTruoc1') : k.p % 60 === 0 && k.p < 1440 ? nd('lap.nhacGio', { so: k.p / 60 }) : nd('lap.nhacPhut', { so: k.p });
  return k.ngay === 0 ? nd('lap.nhacCung', { g: k.g }) : k.ngay === 1 ? nd('lap.nhacHomTruoc', { g: k.g }) : nd('lap.nhacNgay', { n: k.ngay, g: k.g });
}
const ketThuc = (j, gio) => (gio ? j * 1440 + gioPhut(gio) + 60 : (j + 1) * 1440); // sau giờ sự kiện 60 phút (hoặc hết ngày) thì thôi nhắc

/** Các mốc nhắc rơi vào (tu, den] (số phút kiểu `phutTuGio`), chưa xong: [{ v, j, moc }]. Dùng cho dải báo khi App đang mở. */
export function mocNhacTrong(bang, tu, den) {
  const a = Math.floor(tu / 1440) - 1, b = Math.floor(den / 1440) + NHAC_TRUOC_TOI_DA + 1, ra = [];
  bang.viec.forEach((v) => {
    if (typeof v.nhac !== 'number') return;
    cacLan(v, a, b).forEach((j) => { const moc = j * 1440 + v.nhac; if (moc > tu && moc <= den && !daXongLan(v, j)) ra.push({ v, j, moc }); });
  });
  return ra.sort((x, y) => x.moc - y.moc);
}
function khoangCon(bayGioPhut, j, gio) {
  const ngayNay = Math.floor(bayGioPhut / 1440);
  if (j > ngayNay) return nd('lap.conNgay', { so: j - ngayNay });
  if (!gio) return nd('lap.hom');
  const con = j * 1440 + gioPhut(gio) - bayGioPhut;
  return con <= 0 ? nd('lap.dangToi') : con < 60 ? nd('lap.phutNua', { so: con }) : nd('lap.conGio', { so: Math.round(con / 60) });
}
/** Việc ĐANG trong thời gian nhắc (đã tới mốc, chưa quá giờ), chưa xong: [{ v, j, ngay, chu }], gần nhất trước. Thanh nhắc đầu màn Kế hoạch và "Sắp tới". */
export function nhacDangCo(bang, gioPos, homNay) {
  const bay = phutTuGio(gioPos);
  if (Number.isNaN(bay)) return [];
  const h = jd(homNay);
  return mocNhacTrong(bang, bay - (NHAC_TRUOC_TOI_DA + 2) * 1440, bay)
    .filter((x) => bay < ketThuc(x.j, x.v.gio))
    .map((x) => ({ v: x.v, j: x.j, ngay: chuoiJd(x.j), chu: nd('lap.nhacDai', { khoang: khoangCon(bay, x.j, x.v.gio), tieu: x.v.tieu, khi: x.j === h ? x.v.gio || nd('lap.caNgayThuong') : dmNgan(x.j) }) }))
    .sort((p, q) => p.j - q.j);
}

// ----- GÕ NHANH CÓ NGÀY -----
const NGAY_CUOI = /^(.*?)(?:^|\s)(\d{1,2})(?:\s*-\s*(\d{1,2}))?\s*\/\s*(\d{1,2})(?:\s*\/\s*(\d{4}|\d{2}))?\s*$/;
const QUA_BAO_NHIEU_NGAY = 60; // không ghi năm: ngày đã qua quá ngần này ngày thì hiểu là năm sau
/** "Mua quà 20/11" → { tieu: 'Mua quà', ngay: '2026-11-20' }; "Đi khám 3-5/12" → hạn = ngày cuối; sai lịch / không có ngày → { tieu: nguyên, ngay: '' }. */
export function tachNgayCuoi(chu, homNay) {
  const goc = String(chu || '').trim(), t = NGAY_CUOI.exec(goc);
  if (!t || !t[1].trim()) return { tieu: goc, ngay: '' };
  const d = +(t[3] || t[2]), m = +t[4], coNam = t[5] !== undefined;
  let y = coNam ? (t[5].length === 2 ? 2000 + +t[5] : +t[5]) : homNay.y;
  if (!docNgay(ngayChuoi({ d, m, y })) || (t[3] && +t[3] < +t[2])) return { tieu: goc, ngay: '' };
  if (!coNam && jd(homNay) - jd({ d, m, y }) > QUA_BAO_NHIEU_NGAY) y++;
  const ngay = ngayChuoi({ d, m, y });
  return docNgay(ngay) ? { tieu: t[1].trim(), ngay } : { tieu: goc, ngay: '' };
}

/** Ô tên của bảng ngày: hiểu ngày cuối chữ, trừ khi khách bấm "Không phải ngày" (`boNgay`) → giữ nguyên chữ. */
export const tachNhanh = (chu, homNay, boNgay) => (boNgay ? { tieu: String(chu || '').trim(), ngay: '' } : tachNgayCuoi(chu, homNay));

// ----- TÌM -----
/** Bỏ dấu tiếng Việt, chữ thường (đ → d) để so tìm. */
export const boDau = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
/** Việc có tên chứa `q` (bỏ dấu), sắp theo ngày; rỗng → []. */
export function timViec(bang, q) {
  const k = boDau(q).trim();
  return k ? bang.viec.filter((v) => boDau(v.tieu).includes(k)).sort((a, b) => a.ngay.localeCompare(b.ngay)) : [];
}

// ----- XE CỘ · UỐNG THUỐC · CHU KỲ (KH-UI-5f): hàm THUẦN chép logic demo (itemState, docState, vehState, medToday, cycNow); trả số liệu, KHÔNG chữ (chữ ở noiDung/nd/tienIch.js) -----
export const LOAI_XE = ['xm', 'oto', 'xdd', 'khac'];
export const NGAY_MOT_THANG = 30.4;
export const XE_SAP = { km: 150, tiLe: 0.1, ngay: 7, giay: 30 };
export const CHU_KY = { dai: [21, 40], hanh: [2, 9], macDai: 28, macHanh: 5, nhacTruoc: 2, toiDaLs: 12, soKy: 6 };

/** Lịch bảo dưỡng + giấy tờ mặc định của một loại xe, từ mục danh mục `xe.macdinh` ({ loai, lich: 'Tên:km:tháng;…', giay: 'Tên;…' }). */
export function lichTheoLoai(mau, loai) {
  const m = (mau || []).find((x) => x.loai === loai) || {};
  const tach = (s) => String(s || '').split(';').map((x) => x.trim()).filter(Boolean);
  return {
    lich: tach(m.lich).map((x) => { const [ten, km, thang] = x.split(':'); return { ten: ten.trim(), km: +km || 0, thang: +thang || 0 }; }),
    giayTo: tach(m.giay).map((ten) => ({ ten, ngay: '' })),
  };
}

/** Demo itemState: hạng mục `hang` { ten, km, thang } của xe — tới hạn theo km HOẶC tháng, cái nào đến trước. `hn` = hôm nay (ngày Julius). */
export function trangThaiHang(xe, hang, hn) {
  const lan = xe.nhatKy.filter((l) => l.viec.includes(hang.ten)).map((l) => ({ ...l, j: jdChuoi(l.ngay) })).filter((l) => l.j !== null).sort((a, b) => b.j - a.j)[0];
  if (!lan) return { none: true, over: false, soon: false, pct: 0, kmCon: null, ngayCon: null, denJ: null, lan: null };
  const kmCon = hang.km ? lan.km + hang.km - xe.km : null;
  const denJ = hang.thang ? lan.j + Math.round(hang.thang * NGAY_MOT_THANG) : null, ngayCon = denJ !== null ? denJ - hn : null;
  const pk = hang.km ? (xe.km - lan.km) / hang.km : 0, pd = hang.thang ? (hn - lan.j) / (hang.thang * NGAY_MOT_THANG) : 0;
  const over = (kmCon !== null && kmCon <= 0) || (ngayCon !== null && ngayCon <= 0);
  const soon = over || (kmCon !== null && kmCon <= Math.max(XE_SAP.km, hang.km * XE_SAP.tiLe)) || (ngayCon !== null && ngayCon <= XE_SAP.ngay);
  return { none: false, over, soon, pct: Math.max(0, Math.min(1, Math.max(pk, pd))), kmCon, ngayCon, denJ, lan };
}
/** Demo docState: giấy tờ có hạn { ten, ngay }; chưa nhập ngày → none. ≤ 30 ngày là sắp hết. */
export function trangThaiGiay(giay, hn) {
  const j = jdChuoi(giay.ngay);
  if (j === null) return { none: true, soon: false, j: null, con: null, het: false };
  return { none: false, soon: j - hn <= XE_SAP.giay, j, con: j - hn, het: j - hn < 0 };
}
/** Hạng mục của xe, sắp tới hạn lên đầu rồi tới phần trăm cao hơn: [{ hang, k (chỉ số trong lịch), st }]. */
export const sapHang = (xe, hn) => xe.lich.map((hang, k) => ({ hang, k, st: trangThaiHang(xe, hang, hn) })).sort((a, b) => (b.st.soon - a.st.soon) || (b.st.pct - a.st.pct));
/** Demo vehState: { soon, bad (số hạng mục + giấy tờ sắp hạn), hang + st (hạng mục tệ nhất), giay (tên giấy tờ sắp hết đầu tiên) }. */
export function trangThaiXe(xe, hn) {
  const a = sapHang(xe, hn), g = xe.giayTo.map((x) => ({ x, st: trangThaiGiay(x, hn) }));
  const toi = a.filter((x) => x.st.soon), gSoon = g.filter((x) => x.st.soon), tuoi = toi[0];
  return { soon: toi.length + gSoon.length > 0, bad: toi.length + gSoon.length, hang: tuoi ? tuoi.hang : null, st: tuoi ? tuoi.st : null, giay: gSoon[0] ? gSoon[0].x.ten : null };
}
export const tongPhiXe = (xe) => xe.nhatKy.reduce((t, l) => t + (l.phi || 0), 0);

/** Thuốc còn trong đợt uống tại ngày Julius `j` (không hạn = dài ngày). */
export const thuocConHan = (t, j) => !t.den || (jdChuoi(t.den) ?? Infinity) >= j;
/** Demo medToday: { all, done } số lần uống hôm nay (thuốc hết đợt không tính). */
export function homNayThuoc(bang, hn) {
  const xong = bang.thuocXong[chuoiJd(hn)] || [];
  let all = 0, done = 0;
  bang.thuoc.forEach((t) => { if (thuocConHan(t, hn)) t.gio.forEach((g) => { all++; if (xong.includes(`${t.id}@${g}`)) done++; }); });
  return { all, done };
}
/** 7 ngày trước hôm nay (cũ → mới): 'f' đủ · 'h' một phần · 'k' không uống lần nào · '' không có lần nào phải uống (chưa thêm thuốc / đã hết đợt). */
export function bayNgayThuoc(bang, hn) {
  return Array.from({ length: 7 }, (_, i) => {
    const j = hn - 7 + i, xong = bang.thuocXong[chuoiJd(j)] || [];
    let all = 0, done = 0;
    bang.thuoc.forEach((t) => { if ((jdChuoi(t.bd) ?? 0) > j || !thuocConHan(t, j)) return; t.gio.forEach((g) => { all++; if (xong.includes(`${t.id}@${g}`)) done++; }); });
    return !all ? '' : done === all ? 'f' : done ? 'h' : 'k';
  });
}

/** Demo cycNow: ngày thứ mấy của chu kỳ, ngày kỳ tới, ngày rụng trứng dự kiến, giai đoạn 0 hành kinh · 1 sau kỳ · 2 giữa chu kỳ · 3 trước kỳ · 4 chậm kinh. */
export function chuKyHomNay(ck, hn) {
  const day = hn - jdChuoi(ck.bd) + 1, nextJ = jdChuoi(ck.bd) + ck.dai, ov = ck.dai - 14;
  const ph = day <= ck.hanh ? 0 : day < ov - 2 ? 1 : day <= ov + 1 ? 2 : day <= ck.dai ? 3 : 4;
  return { day, nextJ, ov, ph };
}
/** Giai đoạn (0–3) của từng ngày 1…dai để tô dải ngày. */
export const dayChuKy = (ck) => Array.from({ length: ck.dai }, (_, i) => { const d = i + 1, ov = ck.dai - 14; return d <= ck.hanh ? 0 : d < ov - 2 ? 1 : d <= ov + 1 ? 2 : 3; });
/** Trung bình các chu kỳ gần nhất (tối đa 6), làm tròn; chưa có → null. */
export const trungBinhKy = (ls) => { const g = ls.slice(-CHU_KY.soKy); return g.length ? Math.round(g.reduce((a, b) => a + b, 0) / g.length) : null; };

// ----- Chữ trạng thái (xe, thuốc) và Chu kỳ: đổi trạng thái (KH-UI-5f) -----
/** Chữ trạng thái một hạng mục xe (demo itemState.txt): "còn 300 km hoặc 12 ngày" · "Đã tới hạn" · chưa ghi lần nào. */
export function chuHang(st) {
  if (st.none) return nd('xe.chuaGhi');
  if (st.over) return nd('xe.toiHan');
  const ra = [];
  if (st.kmCon !== null) ra.push(nd('xe.conKm', { so: Math.max(0, st.kmCon).toLocaleString('vi-VN') }));
  if (st.ngayCon !== null) ra.push(nd(ra.length ? 'xe.hoacNgay' : 'xe.conNgay', { so: Math.max(0, st.ngayCon) }));
  return ra.join(' ');
}
/** Chữ giấy tờ có hạn (demo docState.txt). */
export function chuGiay(st, homNay) {
  if (st.none) return nd('xe.giayChua');
  const ngay = dm(st.j, homNay);
  return st.het ? nd('xe.giayHet', { ngay }) : nd('xe.giayCon', { ngay, so: st.con });
}
/** Chữ "mỗi X km hoặc Y tháng" của một hạng mục. */
export const chuLich = (h) => [h.km ? nd('xe.moiKm', { so: h.km.toLocaleString('vi-VN') }) : '', h.thang ? nd('xe.moiThang', { so: h.thang }) : ''].filter(Boolean).join(nd('xe.hoac'));
/** Chữ tóm tắt của một xe (demo vehState.txt). */
export function chuXe(x, hn) {
  const v = trangThaiXe(x, hn);
  if (!v.soon) return nd('xe.on');
  return v.hang ? nd('xe.hangSap', { ten: v.hang.ten, tt: chuHang(v.st).toLowerCase() }) : nd('xe.giaySapHet', { ten: v.giay });
}
/** Giờ uống còn phải uống HÔM NAY (chưa đánh dấu), tăng dần, mỗi giờ một mục (các thuốc cùng giờ gộp). Hết đợt → không tính. */
export function gioThuocChuaUong(bang, hn) {
  const xong = bang.thuocXong[chuoiJd(hn)] || [], ra = new Set();
  bang.thuoc.forEach((t) => { if (thuocConHan(t, hn)) t.gio.forEach((g) => { if (!xong.includes(`${t.id}@${g}`)) ra.add(g); }); });
  return [...ra].sort();
}


export const chuKyTrong = () => ({ bat: false, bd: '', dai: CHU_KY.macDai, hanh: CHU_KY.macHanh, ls: [], nhac: true });
// ----- CHU KỲ (C1–C2): chỉ lưu trên máy -----
const capChuKy = (bang, f) => ({ ...bang, chuKy: f(bang.chuKy) });
/** Bật Chu kỳ với ngày bắt đầu kỳ gần nhất `bd` ('YYYY-MM-DD', không ở tương lai, không quá 120 ngày trước). */
export function batChuKy(bang, bd, nay) {
  const j = jdChuoi(bd), h = jdChuoi(nay);
  return j === null || h === null || j > h || h - j > 120 ? null : { ...bang, chuKy: { ...chuKyTrong(), bat: true, bd } };
}
export const tatChuKy = (bang) => ({ ...bang, chuKy: chuKyTrong() });
/** "Kỳ kinh bắt đầu hôm nay": ghi độ dài chu kỳ vừa qua (nếu hợp lý 10–120 ngày) rồi bắt đầu kỳ mới. */
export function ghiKyMoi(bang, nay) {
  const ck = bang.chuKy, h = jdChuoi(nay), d = h === null || !ck.bat ? null : h - jdChuoi(ck.bd);
  return d === null ? bang : capChuKy(bang, (c) => ({ ...c, bd: nay, ls: d >= 10 && d <= 120 ? [...c.ls, d].slice(-CHU_KY.toiDaLs) : c.ls }));
}
const kep = (x, [tu, den]) => Math.min(den, Math.max(tu, x));
export const doiDaiChuKy = (bang, buoc) => capChuKy(bang, (c) => ({ ...c, dai: kep(c.dai + buoc, CHU_KY.dai) }));
export const doiHanhChuKy = (bang, buoc) => capChuKy(bang, (c) => ({ ...c, hanh: kep(c.hanh + buoc, CHU_KY.hanh) }));
export const doiNhacChuKy = (bang) => capChuKy(bang, (c) => ({ ...c, nhac: !c.nhac }));
