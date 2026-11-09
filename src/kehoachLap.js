// KH-UI-5c — luật LẶP LẠI, NHẮC TRƯỚC, QUÁ HẠN, gõ nhanh có ngày, tìm việc: hàm thuần (không đọc đồng hồ, không đụng kho).
// "Hôm nay" luôn là tham số { d, m, y }, "bây giờ" là chuỗi giờ VN của POS (bayGio()) — CLAUDE.md §6.
// Luật lặp (chép từ app tham khảo của chủ quán): mọi lần lặp tính THẲNG từ ngày bắt đầu, không cộng dồn → không trôi ngày.
// Một lần (ngày) của việc lặp đã xử lý khi: ngày < `moc` (mốc "đã rà đến") HOẶC có trong `lanXong` (tối đa 24 lần gần nhất).
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
const jdChuoi = (s) => { const n = docNgay(s); return n ? jd(n) : null; };
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

// ----- LẶP LẠI -----
const DON_VI = { ngay: 'ngày', tuan: 'tuần', thang: 'tháng', nam: 'năm' };
const HANG = { ngay: 'Hằng ngày', tuan: 'Hằng tuần', thang: 'Hằng tháng', nam: 'Hằng năm' };
/** Chữ ngắn của kiểu lặp: "Hằng tháng" · "Mỗi 2 tuần" · "Mùng 1 & Rằm" · "Sau khi xong 30 ngày". */
export function chuLap(l) {
  if (!l) return 'Không lặp';
  if (l.k === 'amlich') return 'Mùng 1 & Rằm';
  if (l.k === 'sau') return `Sau khi xong ${l.n} ngày`;
  return l.n === 1 ? HANG[l.k] : `Mỗi ${l.n} ${DON_VI[l.k]}`;
}
/** Mô tả cạnh việc: "Hằng tháng · từ 31/1/2026 · đến 31/12/2026". */
export function moTaLap(v, homNay) {
  if (!v.lap) return '';
  const s = jdChuoi(v.ngay), e = v.lap.den && jdChuoi(v.lap.den);
  return [chuLap(v.lap), s && 'từ ' + dm(s, homNay), e && 'đến ' + dm(e, homNay)].filter(Boolean).join(' · ');
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
  bang.viec.forEach((v) => cacLan(v, tuJ, denJ).forEach((j) => { if (!daXongLan(v, j)) bd.set(j, j < h || bd.get(j) === 'qua' ? 'qua' : 'viec'); }));
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
  if (j === null) return { chu: 'chưa có hạn', qua: false };
  const h = jd(homNay);
  if (j === h) return { chu: 'hạn hôm nay', qua: false };
  return j < h && !xong ? { chu: 'quá hạn ' + dmNgan(j), qua: true } : { chu: 'hạn ' + dmNgan(j), qua: false };
}

// ----- ĐỔI TRẠNG THÁI (trả bản mới, không sửa bản cũ → "Hoàn tác" chỉ cần giữ bản cũ) -----
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
  if (!k) return 'Không nhắc';
  if (k.k === 'truoc') return k.p === 0 ? 'Đúng giờ' : k.p === 1440 ? 'Trước 1 ngày' : k.p % 60 === 0 && k.p < 1440 ? `Trước ${k.p / 60} giờ` : `Trước ${k.p} phút`;
  return k.ngay === 0 ? `Cùng ngày lúc ${k.g}` : k.ngay === 1 ? `Hôm trước lúc ${k.g}` : `Trước ${k.ngay} ngày lúc ${k.g}`;
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
  if (j > ngayNay) return `Còn ${j - ngayNay} ngày`;
  if (!gio) return 'Hôm nay';
  const con = j * 1440 + gioPhut(gio) - bayGioPhut;
  return con <= 0 ? 'Đang tới giờ' : con < 60 ? `${con} phút nữa` : `Còn ${Math.round(con / 60)} giờ`;
}
/** Việc ĐANG trong thời gian nhắc (đã tới mốc, chưa quá giờ), chưa xong: [{ v, j, ngay, chu }], gần nhất trước. Thanh nhắc đầu màn Kế hoạch và "Sắp tới". */
export function nhacDangCo(bang, gioPos, homNay) {
  const bay = phutTuGio(gioPos);
  if (Number.isNaN(bay)) return [];
  const h = jd(homNay);
  return mocNhacTrong(bang, bay - (NHAC_TRUOC_TOI_DA + 2) * 1440, bay)
    .filter((x) => bay < ketThuc(x.j, x.v.gio))
    .map((x) => ({ v: x.v, j: x.j, ngay: chuoiJd(x.j), chu: `${khoangCon(bay, x.j, x.v.gio)}: ${x.v.tieu} (${x.j === h ? x.v.gio || 'cả ngày' : dmNgan(x.j)})` }))
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
