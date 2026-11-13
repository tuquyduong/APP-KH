#!/usr/bin/env node
// THỬ KH-UI-5b — Kế hoạch và nhắc việc: dữ liệu chép nguyên demo, hàm tính so với bảng do CHÍNH HÀM CỦA DEMO sinh ra
// (thu_KHUI5b_mau.json — chạy demo trong Chromium: renderCal, holList, upList, SEASON), lưu / xoá trên máy, đường dẫn, khoá luuMay,
// màn dựng thật bằng esbuild + react-dom/server (ô Trang chủ, lưới ba ô, Theo mùa, Ngày lễ, Sắp tới, banner nhỏ).
// Không mạng, không trình duyệt (phần chụp ảnh so demo làm riêng ở nháp). Chạy: node cong_cu/thu_KHUI5b.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
// Không dùng \b cho chữ có dấu: \b của JS chỉ hiểu chữ ASCII nên /\bnợ\b/ không bao giờ khớp và ca "không có chữ nợ" luôn xanh (KH-ND-3b B3).
// Mỗi ca kèm bản giả "Công nợ" chứng minh phép kiểm ĐỎ được.
const khongNo = (x) => !/nợ/i.test(String(x));
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const json = (f) => JSON.parse(doc(f));
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Dựng một module / thành phần của app thành CommonJS (kèm React, JSON) để chạy trong Node.
function dung(tep, xuat) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: xuat, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', write: false, logLevel: 'silent', loader: { '.json': 'json', '.css': 'empty', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl' },
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: tep }).runInThisContext()(m, m.exports, require);
  return m.exports;
}
const thanhPhan = (tep) => dung(tep, `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import T from './${tep}'; export const ve = (props, con) => renderToStaticMarkup(React.createElement(T, props, con)).replace(/ data-nd(-khoa)?="[^"]*"/g, '');`).ve;

// Lấy một hằng của demo bằng tên (chuỗi `const TEN = …;`), đọc bằng vm — không chạy phần còn lại của demo.
const demoHtml = doc('thiet_ke/app_kh_demo.html');
function hangDemo(ten) {
  const dau = demoHtml.indexOf(`const ${ten} = `);
  if (dau < 0) throw new Error('demo không có ' + ten);
  const bd = dau + `const ${ten} = `.length;
  const mo = demoHtml[bd], dong = mo === '{' ? '}' : ']';
  let d = 0, ch = null;
  for (let j = bd; j < demoHtml.length; j++) {
    const c = demoHtml[j];
    if (ch) { if (c === '\\') j++; else if (c === ch) ch = null; continue; }
    if (c === '"' || c === "'" || c === '`') ch = c; else if (c === mo) d++; else if (c === dong && --d === 0) return vm.runInNewContext('(' + demoHtml.slice(bd, j + 1) + ')');
  }
  throw new Error('không đọc được ' + ten);
}
const khong = process.env.KHONG_TRINH_DUYET === '1'; // phần so ảnh bằng Chromium không nằm trong bài này; biến giữ cho đúng luật CLAUDE.md §9

(async () => {
  const KH = await nap('src/kehoach.js'), LP = await nap('src/kehoachLap.js');
  const CD = await nap('src/noiDung/coDinh/lich.js'), NDJ = await nap('src/noiDung/nd.js');
  const mau = json('cong_cu/thu_KHUI5b_mau.json');

  console.log('A1 — dữ liệu chép nguyên từ demo');
  // KH-ND-3d: chữ nay ở danh mục (nd/keHoach.js, nd/tienIch.js) và coDinh/lich.js — dựng lại đúng dạng của demo từ NƠI MỚI rồi so từng chữ.
  const SS_DEMO = Object.fromEntries(NDJ.ndDs('mua.noiDung').map((z) => [z.mua, { tang: z.tang, an: z.an, uong: z.uong, sh: z.sh, tt: z.tt, han: z.han, p: z.p.split(',') }]));
  const SS_F_DEMO = ['tang', 'an', 'uong', 'sh', 'tt', 'han'].map((f) => [f, NDJ.nd('mua.nhan.' + f)]);
  const nguon = { SOLAR_HOL: KH.leDuong(), LUNAR_HOL: KH.leAmLich(), SS: SS_DEMO, SS_F: SS_F_DEMO, GIFT_HOL: KH.leCoQua(), WD: CD.WD };
  k('A1 SOLAR_HOL, LUNAR_HOL, SS, SS_F, GIFT_HOL, WD (đọc từ danh mục / coDinh) giống demo từng chữ', Object.keys(nguon).every((t) => bang(nguon[t], hangDemo(t))));
  k('A1 danh mục ngày lễ: dòng sai dạng bị bỏ qua, ngày trùng lấy dòng đầu (không vỡ màn)', (() => { NDJ.datBanNoiDung({ so_ban: 1, gia_tri: { 'kh.leDuong': [{ ngay: '1/1', ten: 'A' }, { ngay: 'x/y', ten: 'B' }, { ngay: '32/1', ten: 'C' }, { ngay: '1/1', ten: 'D' }, { ngay: '5/13', ten: 'E' }] } }); const b = KH.leDuong(); NDJ.datBanNoiDung(null); return bang(b, { '1/1': 'A' }); })());
  const seasonDemo = vm.runInNewContext('(' + /const SEASON = (idx => [^\n]*);/.exec(demoHtml)[1] + ')');
  k('A1 SEASON: cùng kết quả với demo ở cả 24 tiết', Array.from({ length: 24 }, (_, i) => i).every((i) => bang(CD.SEASON(i), seasonDemo(i))));
  const L = await nap('src/lich.js');
  k('A1 TERM_TIPS dùng lại từ lich.js (không chép lại)', KH.TERM_TIPS === L.TERM_TIPS && !/const TERM_TIPS/.test(doc('src/kehoach.js')) && !/TERM_TIPS = \[/.test(doc('src/lich.js')));
  const tipsDemo = hangDemo('TERM_TIPS');
  k('A1 lời dưỡng sinh 24 tiết khí (danh mục kh.tiet qua tipTiet / TERM_TIPS) giống demo từng chữ và mã món', Array.from({ length: 24 }, (_, i) => i).every((i) => bang(L.tipTiet(i), tipsDemo[i]) && bang(L.TERM_TIPS[i], tipsDemo[i])) && L.TERM_TIPS.length === 24);

  console.log('A2/A3 — hàm tính so với bảng của demo');
  const thang = Object.entries(mau.thang);
  k('A3 bảng mẫu có ≥ 12 tháng, gồm tháng nhuận, giáp Tết, tháng 28/29/30/31 ngày', thang.length >= 12 && ['2023-3', '2025-7', '2025-1', '2026-2', '2024-2'].every((t) => mau.thang[t]));
  let oLech = [], oTong = 0;
  for (const [t, m] of thang) {
    const [y, mo] = t.split('-').map(Number);
    const lu = KH.luoiThang(y, mo, { d: m.homNay[0], m: m.homNay[1], y: m.homNay[2] }, { d: 10, m: mo, y });
    const so = lu.map((c) => ({ d: c.d, am: c.am, tiet: c.tiet, ngoai: c.ngoai, homNay: c.homNay, chon: c.chon, cn: c.cn, le: c.le, chamLe: c.le }));
    oTong += m.o.length;
    if (!bang(so, m.o)) oLech.push(t);
    const le = KH.leTrongThang(y, mo).map((h) => ({ ngay: h.d + '/' + mo, chu: h.n + h.al }));
    if (!bang(le, m.le)) oLech.push(t + ':lễ');
    if (!(lu.length === 35 || lu.length === 42)) oLech.push(t + ':số ô');
  }
  k(`A3 lưới ${thang.length} tháng (${oTong} ô: âm, dương, thứ, mùng 1 / rằm, tiết khí, lễ, hôm nay, chọn) khớp demo từng ô`, oLech.length === 0, oLech.join(', '));
  let heLech = [];
  for (const [t, h] of Object.entries(mau.ngay)) {
    const c = KH.theNgay({ d: h.sel[0], m: h.sel[1], y: h.sel[2] }, { d: h.homNay[0], m: h.homNay[1], y: h.homNay[2] });
    const so = { thu: c.thu, lon: c.lon, thang: c.thang, am: c.am, canChi: c.namCanChi + ' | ' + c.thangNgayCanChi, chip: c.chip, conLai: c.conLai, le: c.le, tip: c.tip[0], tipTiet: 'Dưỡng sinh tiết ' + c.tiet };
    const goc = { thu: h.thu, lon: h.lon, thang: h.thang, am: h.am, canChi: h.canChi, chip: h.chip, conLai: h.conLai, le: h.le, tip: h.tip, tipTiet: h.tipTiet };
    if (!bang(so, goc)) heLech.push(t);
  }
  k(`A3 thẻ ngày (thứ, âm, can chi, mùa · tiết, còn mấy ngày, lễ, lời dưỡng sinh) ở ${Object.keys(mau.ngay).length} ngày khớp demo`, heLech.length === 0 && Object.keys(mau.ngay).length >= 10, heLech.join(', '));
  let leLech = [];
  for (const [t, a] of Object.entries(mau.hol)) {
    const [y, m, d] = t.split('-').map(Number);
    if (!bang(KH.holList({ d, m, y }), a)) leLech.push(t);
  }
  k(`A3 holList ở ${Object.keys(mau.hol).length} "hôm nay" (đầu năm, trước Tết, sau Tết, Trung thu, 20.11, cuối năm) khớp demo`, leLech.length === 0 && Object.keys(mau.hol).length >= 6, leLech.join(', '));
  let upLech = [], bLech = [];
  const L2 = await nap('src/lich.js');
  const homNayUp = Object.entries(mau.up);
  for (const [t, u] of homNayUp) {
    const [y, m, d] = t.split('-').map(Number), hn = { d, m, y }, j0 = L2.LUNAR.jdFromDate(d, m, y);
    const viec = u.seed.map((s, i) => { const x = L2.LUNAR.jdToDate(j0 + s.off); return { id: 'v' + i, ngay: `${x.y}-${String(x.m).padStart(2, '0')}-${String(x.d).padStart(2, '0')}`, gio: s.t, tieu: s.title, nhac: s.rm === NDJ.nd('kh.coNhac') ? +s.t.slice(0, 2) * 60 + +s.t.slice(3) : null, xong: s.done }; });
    const ra = KH.upList(hn, { ...KH.keHoachTrong(), viec }).filter((e) => e.k === 'Việc' || e.k === 'Lễ').map((e) => ({ j: e.j, t: e.t, s: e.s.replace(' · Đúng giờ', ' · ' + NDJ.nd('kh.coNhac')), k: e.k })); // KH-UI-5c: việc nhắc đúng giờ ghi "Đúng giờ" (không còn "Nhắc khi mở app")
    if (!bang(ra, u.ra)) upLech.push(t);
    const ngayDau = KH.holList(hn)[0], chuNgay = KH.chuThich('ngay', hn, { ...KH.keHoachTrong(), viec }); // KH-UI-5e: ô Ngày cần nhớ thay ô Ngày lễ; ô Sắp tới thành dải
    if (!chuNgay.startsWith(ngayDau.n.replace('Tết ', '') + ' · ') || KH.chuThich('mua', hn, { ...KH.keHoachTrong(), viec }) !== u.badgeMua) bLech.push(t);
  }
  k(`A3 upList ở ${homNayUp.length} "hôm nay" (việc chưa xong trong 30 ngày + lễ; ngày thứ 30 vào, thứ 31 và hôm qua không) khớp demo`, upLech.length === 0 && homNayUp.length >= 4, upLech.join(', '));
  k('A3 dòng nhỏ dưới ô tiện ích (Mùa …, lễ gần nhất · N ng) khớp demo', bLech.length === 0, bLech.join(', '));
  let muaLech = [];
  for (const [t, m] of Object.entries(mau.mua)) {
    const [y, mo, d] = t.split('-').map(Number);
    if (KH.muaNgay({ d, m: mo, y }).n !== m.mua) muaLech.push(t);
  }
  k(`A3 mùa hiện tại ở ${Object.keys(mau.mua).length} ngày (ranh bốn mùa) khớp demo`, muaLech.length === 0 && Object.keys(mau.mua).length >= 12, muaLech.join(', '));
  k('A2 hôm nay lấy từ giờ POS: homNayTuGio đọc chuỗi, không new Date(chuỗi); giờ lạ → null', bang(KH.homNayTuGio('2026-11-07 23:59:59'), { d: 7, m: 11, y: 2026 }) && bang(KH.homNayTuGio('2026-11-07T00:00:00'), { d: 7, m: 11, y: 2026 }) && KH.homNayTuGio('') === null && KH.homNayTuGio('2026-02-30') === null && !/new Date\(\s*(gio|chuoi|String)/.test(doc('src/kehoach.js')));

  console.log('D1 — lưu trên máy (kh_kehoach)');
  const khoGia = () => { const o = {}; return { getItem: (x) => (x in o ? o[x] : null), setItem: (x, v) => { o[x] = String(v); }, removeItem: (x) => { delete o[x]; }, o }; };
  const khoChan = { getItem() { throw new Error('chặn'); }, setItem() { throw new Error('chặn'); }, removeItem() { throw new Error('chặn'); } };
  const ks = khoGia();
  let b = KH.docKeHoach(ks);
  k('D1 chưa lưu gì → bản trống (KH-UI-5d: không còn trường ẩn banner)', bang(b, KH.keHoachTrong()) && bang(b.nguoi, []) && b.vk.fs === 17);
  b = KH.themViec(b, { ngay: '2026-11-08', gio: '17:30', tieu: '  Đón con tan học  ', nhac: 1050 });
  k('D1 thêm việc: cắt khoảng trắng, giữ dấu tiếng Việt, mặc định chưa xong', b && b.viec.length === 1 && b.viec[0].tieu === 'Đón con tan học' && b.viec[0].xong === false && b.viec[0].nhac === 1050);
  k('D1 tiêu đề trống / ngày sai → không thêm (null)', KH.themViec(b, { ngay: '2026-11-08', gio: '09:00', tieu: '   ' }) === null && KH.themViec(b, { ngay: '2026-13-40', gio: '09:00', tieu: 'x' }) === null);
  k('D1 giờ trống / sai → việc cả ngày (gio rỗng), không nhắc (KH-UI-5c A4)', KH.themViec(b, { ngay: '2026-11-08', gio: '', tieu: 'a' }).viec[1].gio === '' && KH.themViec(b, { ngay: '2026-11-08', gio: '25:99', tieu: 'a' }).viec[1].gio === '' && KH.themViec(b, { ngay: '2026-11-08', gio: '', tieu: 'a' }).viec[1].nhac === null);
  b = KH.doiNhacLe(LP.tickLan(b, b.viec[0].id, b.viec[0].ngay, { d: 8, m: 11, y: 2026 }), 'Nhà giáo Việt Nam');
  k('D1 ghi trả true; đọc lại đúng từng trường (việc, cờ nhắc lễ); không ghi trường ẩn banner', KH.ghiKeHoach(b, ks) === true && bang(KH.docKeHoach(ks), b) && b.viec[0].xong === true && b.leNhac['Nhà giáo Việt Nam'] === true && !/anBanner/.test(ks.o.kh_kehoach));
  k('D1 khoá đúng tên kh_kehoach; nội dung không có số điện thoại / token', KH.KHOA_KE_HOACH === 'kh_kehoach' && Object.keys(ks.o).join() === 'kh_kehoach' && !/token|sdt|phone|\b0\d{9}\b/i.test(ks.o.kh_kehoach));
  k('D1 tick lần hai trả lại chưa xong; xoaViec bỏ đúng việc', LP.tickLan(b, b.viec[0].id, b.viec[0].ngay, { d: 8, m: 11, y: 2026 }).viec[0].xong === false && KH.xoaViec(b, b.viec[0].id).viec.length === 0);
  k('D1 doiNhacLe lần hai tắt; tên lễ lạ không ghi', !KH.doiNhacLe(b, 'Nhà giáo Việt Nam').leNhac['Nhà giáo Việt Nam'] && bang(KH.doiNhacLe(KH.keHoachTrong(), 'Lễ bịa').leNhac, {}));
  const hong1 = khoGia(); hong1.o.kh_kehoach = '{không phải json';
  const hong2 = khoGia(); hong2.o.kh_kehoach = JSON.stringify({ viec: [{ id: 'a', ngay: '2026-11-08', gio: '09:00', tieu: 'Giữ', nhac: false, xong: false }, { id: 'b', ngay: 'xx', gio: '09:00', tieu: 'Bỏ', nhac: false, xong: false }, 5, null, { id: 'a', ngay: '2026-11-09', gio: '09:00', tieu: 'Trùng id', nhac: false, xong: false }, { id: 'c', ngay: '2026-11-08', gio: '9h', tieu: 'Bỏ giờ', nhac: false, xong: false }], leNhac: { 'Lễ bịa': true, 'Quốc khánh': true, 'Tết Dương lịch': 'có' }, anBanner: 'hôm qua' });
  const hong3 = khoGia(); hong3.o.kh_kehoach = '[1,2]';
  const d2 = KH.docKeHoach(hong2);
  k('D1 dữ liệu hỏng: JSON lỗi / mảng / null → bản trống, không ném lỗi', bang(KH.docKeHoach(hong1), KH.keHoachTrong()) && bang(KH.docKeHoach(hong3), KH.keHoachTrong()));
  k('D1 dữ liệu sai dạng từng phần: giữ mục đúng, bỏ mục sai (việc lỗi, id trùng, lễ lạ; trường anBanner cũ bỏ qua)', d2.viec.length === 1 && d2.viec[0].tieu === 'Giữ' && bang(d2.leNhac, { 'Quốc khánh': true }) && !('anBanner' in d2));
  k('D1 kho bị chặn: đọc → bản trống; ghi / xoá → false (màn không được báo "đã lưu")', bang(KH.docKeHoach(khoChan), KH.keHoachTrong()) && KH.ghiKeHoach(b, khoChan) === false && KH.xoaKeHoach(khoChan) === false);
  k('D3 xoaKeHoach xoá khoá; đọc lại trống', KH.xoaKeHoach(ks) === true && !('kh_kehoach' in ks.o) && bang(KH.docKeHoach(ks), KH.keHoachTrong()));
  k('B7 (KH-UI-5d) không còn ẩn banner theo ngày: kho không có anBannerHomNay / bannerDangAn', !KH.anBannerHomNay && !KH.bannerDangAn);
  const nh = KH.themViec(KH.themViec(KH.themViec(KH.keHoachTrong(), { ngay: '2026-11-07', gio: '17:30', tieu: 'B', nhac: 1050 }), { ngay: '2026-11-07', gio: '07:00', tieu: 'A', nhac: 420 }), { ngay: '2026-11-07', gio: '09:00', tieu: 'C', nhac: null });
  const ngayBay = { d: 7, m: 11, y: 2026 }, dangCo = (bg, bang2 = nh) => LP.nhacDangCo(bang2, bg, ngayBay).map((x) => x.v.tieu);
  k('C1 nhắc: đã tới mốc, chưa quá giờ, đã bật nhắc, chưa xong; không nhắc thì không hiện', bang(dangCo('2026-11-07 07:10:00'), ['A']) && bang(dangCo('2026-11-07 17:40:00'), ['B']) && bang(dangCo('2026-11-07 06:00:00'), []) && !dangCo('2026-11-07 09:00:00').includes('C') && dangCo('2026-11-07 07:10:00', LP.tickLan(nh, nh.viec[1].id, '2026-11-07', ngayBay)).length === 0);
  k('C2 chữ công tắc đúng sự thật: "Nhắc khi mở app", không hứa báo về điện thoại', NDJ.nd('kh.coNhac') === 'Nhắc khi mở app' && !/sẽ báo|thông báo đẩy|về điện thoại/i.test(doc('src/kehoach.js').replace(/\/\/.*$/gm, '')));

  console.log('D2 — luuMay.js');
  const LM = await nap('src/luuMay.js');
  const km = khoGia();
  km.o.kh_kehoach = '{"v":1,"viec":[],"leNhac":{},"anBanner":""}';
  LM.ghiChu('0901234567', km);
  const trai = LM.doiKhach('0907654321', km);
  k('D2 đổi khách → xoá kh_kehoach', trai === true && !('kh_kehoach' in km.o));
  const km2 = khoGia(); km2.o.kh_kehoach = '{}'; LM.ghiChu('0901234567', km2);
  LM.xoaTatCa(km2);
  k('D2 bấm Đăng xuất (xoaTatCa) → xoá kh_kehoach', !('kh_kehoach' in km2.o));
  const km3 = khoGia(); km3.o.kh_kehoach = '{}'; LM.ghiChu('0901234567', km3);
  k('D2 cùng khách đăng nhập lại (hoặc hết phiên 401) → GIỮ kh_kehoach', LM.doiKhach('0901234567', km3) === false && 'kh_kehoach' in km3.o);
  const km4 = khoGia(); km4.o.kh_kehoach = '{}';
  k('D2 có dữ liệu mà chưa biết của ai → xoá (như các khoá khác)', LM.doiKhach('0901234567', km4) === true && !('kh_kehoach' in km4.o));
  k('D2 luuMay.js không tự viết quy tắc xoá riêng cho kh_kehoach (chỉ thêm khoá vào danh sách)', /KHOA_DU_LIEU = \[[^\]]*KHOA_KE_HOACH[^\]]*\]/.test(doc('src/luuMay.js')) && !/removeItem\(KHOA_KE_HOACH/.test(doc('src/luuMay.js')));

  console.log('B5 — đường dẫn');
  const DD = await nap('src/duongDan.js');
  const ra = (p) => DD.docDuongDan(p);
  k('B5 /kehoach là trang thật: cần đăng nhập, không giữ chỗ, tab Trang chủ', ra('/kehoach').trang === 'kehoach' && ra('/kehoach').canDN === true && ra('/kehoach').giuCho === false && ra('/kehoach').tab === 'trangchu' && ra('/kehoach').chuan === '/kehoach' && DD.taoDuongDan('kehoach') === '/kehoach');
  k('B5 ba đường tiện ích /kehoach/theomua, /ngayle, /saptoi: cần đăng nhập, cha = /kehoach, tab Trang chủ', [['theomua', 'theomua'], ['ngayle', 'ngayle'], ['saptoi', 'saptoi']].every(([s, t]) => { const r = ra('/kehoach/' + s); return r.trang === 'tienich' && r.tham.tienich === t && r.canDN && r.cha === '/kehoach' && r.chuan === '/kehoach/' + s && r.tab === 'trangchu' && DD.taoDuongDan('tienich', { tienich: t }) === '/kehoach/' + s; }));
  k('B5 /kehoach/<lạ> (kể cả tiện ích của 5f chưa làm) → về /kehoach, không rơi vào "không tìm thấy"', ['/kehoach/la', '/kehoach/xe', '/kehoach/thuoc'].every((p) => ra(p).trang === 'kehoach' && ra(p).chuan === '/kehoach'));
  k('B5 đăng nhập xong quay lại đúng /kehoach/<tiện ích> (tiepHopLe)', DD.tiepHopLe('/kehoach/ngayle') === '/kehoach/ngayle' && DD.tiepHopLe('/kehoach') === '/kehoach' && DD.trangCanDangNhap('kehoach') && DD.trangCanDangNhap('tienich'));

  await manHinh(KH);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.log('  ✗ bài thử lỗi: ' + (e && e.stack || e)); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

// ---- Màn hình dựng thật (react-dom/server) ----
async function manHinh(KH) {
  const NDJ = await nap('src/noiDung/nd.js');
  console.log('B — màn hình dựng thật');
  const khoGia = () => { const o = {}; return { getItem: (x) => (x in o ? o[x] : null), setItem: (x, v) => { o[x] = String(v); }, removeItem: (x) => { delete o[x]; }, o }; };
  const HN = { d: 7, m: 11, y: 2026 };
  const BAN = { anh: '/anh/banner-trang-chu.webp', tieuDe: 'Giờ vàng hôm nay', phu: 'Giảm đến 30%', nut: 'Xem Menu' };
  const KB = { anh: '', tieuDe: '' }; // chưa có chữ khuyến mãi
  const dem = (h, re) => (h.match(re) || []).length;
  // Mỗi lần vẽ dựng bản mới: bản Kế hoạch trong bộ nhớ (dungKeHoach.js) nhớ lần đọc đầu, bài thử đổi kho giữa các ca.
  const veKH = (p) => thanhPhan('pages/KeHoach.jsx')(p), veTI = (p) => thanhPhan('pages/TienIch.jsx')(p);
  const khongBanner = (h) => !/class="today fx-a/.test(h);
  const cb = { lui() {}, moTienIch() {}, moBanner() {}, veLich() {}, chonMon() {} };
  globalThis.localStorage = khoGia();
  const trong = veKH({ ...cb, homNay: HN, banner: KB });
  k('B1 /kehoach: tiêu đề, thẻ ngày, thẻ dưỡng sinh theo tiết, "Việc của tôi · 7/11", "Ngày lễ trong tháng", dòng miễn trừ, nút Hôm nay', ['Kế Hoạch và Nhắc Việc', 'id="calHero"', 'id="calTip"', 'Dưỡng sinh tiết Lập đông', 'Việc của tôi · 7/11', 'Ngày lễ trong tháng', 'Lịch hiển thị âm dương lịch', 'Tháng 11 · 2026', '>Hôm nay</div>'].every((t) => trong.includes(t)));
  k('B1 lưới tháng 11/2026 có 42 ô (1.11 là Chủ nhật → 6 ô đầu thuộc tháng trước, như demo); ô hôm nay có lớp today và sel', dem(trong, /class="cd /g) === 42 && /class="cd [^"]*\btoday\b[^"]*\bsel\b/.test(trong));
  k('B1 khối "Từ TQD" và chấm "Từ TQD" ẨN (POS chưa có dữ liệu): chú giải chỉ 3 mục', !/Từ TQD|Từ Tứ Quý Đường|calTqd|class="dq"/.test(trong) && dem(trong, /<span><i class="dh"/g) === 1 && dem(trong, /<span><svg class="ico cd-chuong viec"/g) === 1 && trong.includes('Tiết khí')); // KH-UI-5c: chấm hồng "Việc của tôi" thành chuông
  k('B3 (KH-UI-5e) lưới tiện ích SÁU ô đúng thứ tự Theo mùa · Văn khấn · Ngày cần nhớ · Xe cộ · Uống thuốc · Chu kỳ, dòng nhỏ "Mùa Đông", "Nhà giáo Việt Nam · 13 ng" và (KH-UI-5f) "Thêm xe" · "Thêm thuốc" ở hai ô chưa có dữ liệu', dem(trong, /class="tl"/g) === 6 && ['Theo mùa', 'Văn khấn', 'Ngày cần nhớ', 'Xe cộ', 'Uống thuốc', 'Chu kỳ', 'Mùa Đông', 'Nhà giáo Việt Nam · 13 ng', 'Thêm xe', 'Thêm thuốc'].every((t) => trong.includes(t)) && trong.indexOf('Theo mùa') < trong.indexOf('Văn khấn') && trong.indexOf('Văn khấn') < trong.indexOf('Ngày cần nhớ') && trong.indexOf('Ngày cần nhớ') < trong.indexOf('Xe cộ') && trong.indexOf('Xe cộ') < trong.indexOf('Uống thuốc') && trong.indexOf('Uống thuốc') < trong.indexOf('Chu kỳ'));
  k('B3 (KH-UI-5e) ô "Sắp tới" và "Ngày lễ" KHÔNG còn trong lưới (Sắp tới thành dải up-strip; Ngày lễ là tab của Ngày cần nhớ)', !/<b>Sắp tới<\/b><small>|<b>Ngày lễ<\/b>/.test(trong) && trong.includes('class="up-strip"'));
  k('B6 không có thẻ video hướng dẫn', !/guide-card|Xem cách dùng/.test(trong));
  k('B7 chưa có chữ khuyến mãi "hôm nay" → không có banner nhỏ', khongBanner(trong));
  const co = veKH({ ...cb, homNay: HN, banner: BAN });
  k('B7 (KH-UI-5d) dù truyền chữ banner, /kehoach KHÔNG còn banner nhỏ (đã thay bằng dải quảng cáo ở vỏ App)', khongBanner(co) && !co.includes('Giờ vàng hôm nay') && !/photo mini/.test(co));
  k('B7 bản nhỏ và nút ✕ đã bỏ hẳn (KH-UI-5d): không t-x, không BannerNho', !co.includes('t-x') && !fs.existsSync(path.join(GOC, 'src/components/BannerNho.jsx')));
  const QC = { tieuDe: BAN.tieuDe, phu: BAN.phu, nut: BAN.nut, khoa: { t: 'today.t', s: 'today.s', nut: 'today.cta' } }; // KH-UI-5g: banner nhận kết quả chonQuangCao
  const lon = thanhPhan('components/BannerHomNay.jsx')({ anh: BAN.anh, qc: QC, chon() {} });
  k('B7 banner Trang chủ: không lớp mini, nút giữ chữ của nó, KHÔNG có ✕ (kể cả khi truyền khiAn — KH-UI-5d)', !/mini/.test(lon) && !lon.includes('t-x') && lon.includes('>Xem Menu<')
    && !thanhPhan('components/BannerHomNay.jsx')({ anh: BAN.anh, qc: QC, chon() {}, khiAn() {} }).includes('t-x'));
  globalThis.localStorage.setItem('kh_kehoach', JSON.stringify({ v: 1, viec: [], leNhac: {}, anBanner: KH.ngayChuoi(HN) })); // bản cũ có trường ẩn banner: đọc không lỗi
  const an = veKH({ ...cb, homNay: HN, banner: BAN });
  k('B7 bản lưu CŨ có anBanner của hôm nay: /kehoach vẫn dựng được và vẫn không banner nhỏ', khongBanner(an) && khongBanner(veKH({ ...cb, homNay: { d: 8, m: 11, y: 2026 }, banner: BAN })));
  k('B7 màn tiện ích cũng không banner nhỏ (cả hôm nay lẫn ngày mai)', khongBanner(veTI({ ...cb, id: 'ngayle', homNay: HN, banner: BAN })) && khongBanner(veTI({ ...cb, id: 'ngayle', homNay: { d: 9, m: 11, y: 2026 }, banner: BAN })));
  globalThis.localStorage.setItem('kh_kehoach', JSON.stringify({ v: 1, anBanner: '', leNhac: { 'Nhà giáo Việt Nam': true }, viec: [
    { id: 'a', ngay: '2026-11-07', gio: '17:30', tieu: 'Đón con tan học', nhac: true, xong: false }, { id: 'b', ngay: '2026-11-07', gio: '09:00', tieu: 'Họp nhóm', nhac: true, xong: true },
    { id: 'c', ngay: '2026-11-10', gio: '19:00', tieu: 'Sinh nhật mẹ', nhac: false, xong: false }] }));
  const cv = veKH({ ...cb, homNay: HN, gio: '2026-11-07 17:40:00', banner: KB });
  k('B2 việc trong ngày chọn: sắp theo giờ, việc xong gạch, chữ "Đúng giờ" (KH-UI-5c: nhắc theo phút), nút ✓', cv.indexOf('Họp nhóm') < cv.indexOf('Đón con tan học', cv.indexOf('id="calAgenda"')) && cv.includes('class="ag done"') && cv.includes('Đúng giờ') && !cv.includes('Nhắc khi mở app</small>') && cv.includes('Đánh dấu xong') && cv.includes('Bỏ đánh dấu xong'));
  k('B2 chuông "Việc của tôi" trên lịch ở ngày có việc chưa xong (7 và 10, thêm một chuông ở chú giải)', dem(cv, /class="ico cd-chuong/g) === 3);
  k('C1 thanh nhắc đầu /kehoach nêu việc hôm nay bật nhắc CHƯA xong (17:30 Đón con) — không nêu việc đã xong / ngày khác; không việc thì không có thanh', cv.includes('nt-bar on') && cv.includes('Đón con tan học (17:30)') && !/(Họp nhóm|Sinh nhật mẹ)/.test(cv.slice(cv.indexOf('id="calNoti"'), cv.indexOf('class="tim-viec"'))) && !trong.includes('nt-bar'));
  k('C2 không hứa báo về điện thoại: không chữ "sẽ nhắc / sẽ báo / thông báo đẩy" ở màn', !/sẽ nhắc|sẽ báo|thông báo đẩy|push/i.test(cv + co) && cv.includes('Nhắc hiện khi bạn mở app'));
  k('D3 có nút "Xoá toàn bộ dữ liệu Kế hoạch trên máy này" và dòng "chỉ lưu trên máy này"', cv.includes('Xoá toàn bộ dữ liệu Kế hoạch trên máy này') && cv.includes('chỉ lưu trên máy này'));
  const chuaBiet = veKH({ ...cb, homNay: HN, san: false, banner: KB });
  k('D2 chưa biết khách là ai (san=false) → KHÔNG hiện việc của người trước', !chuaBiet.includes('Đón con tan học') && !chuaBiet.includes('nt-bar'));
  const dsMenu = [{ ma: 'm1', ten: 'Canh Đại Bổ', nhom: 'ds', con_hang: true }, { ma: 'm2', ten: 'Trà Phổ Nhĩ', nhom: 'tra', con_hang: false }];
  const mua = veTI({ ...cb, id: 'theomua', homNay: HN, banner: KB, ds: dsMenu });
  k('B4 Theo mùa: bốn thẻ mùa (mùa nay có " · nay"), đủ 6 mục, liên kết "Dưỡng sinh theo tiết Lập đông"', dem(mua, /<button type="button"/g) === 4 && mua.includes('Đông · nay') && ['Tạng cần dưỡng', 'Ăn', 'Uống', 'Sinh hoạt', 'Tinh thần', 'Nên hạn chế', 'Thận (Thuỷ)', 'Dưỡng sinh theo tiết Lập đông'].every((t) => mua.includes(t)));
  k('B4 Theo mùa: "Món Tứ Quý Đường hợp mùa Đông" chỉ có món THẬT còn bán (Canh Đại Bổ); món hết hàng (Phổ Nhĩ) thì ẩn', mua.includes('Món Tứ Quý Đường hợp mùa Đông') && mua.includes('Canh Đại Bổ') && !mua.includes('Phổ Nhĩ'));
  const mua0 = veTI({ ...cb, id: 'theomua', homNay: HN, banner: KB, ds: [] });
  k('B4 Theo mùa: chưa có menu → ẩn cả khối món, KHÔNG giả lập món', !mua0.includes('hợp mùa') && !mua0.includes('ds-p'));
  const le = veTI({ ...cb, id: 'ngayle', homNay: HN, banner: KB });
  k('B4 Ngày lễ: sắp theo ngày gần nhất (20/11, 24/12, 1/1), có "13 ngày", thứ, lịch âm / dương', le.indexOf('Nhà giáo Việt Nam') < le.indexOf('Đêm Giáng sinh') && le.indexOf('Đêm Giáng sinh') < le.indexOf('Tết Dương lịch') && le.includes('13 ngày') && le.includes('Dương lịch 20/11 · T6, 20/11') && le.includes('Âm lịch 1/1'));
  k('B4 Ngày lễ: gợi ý quà chỉ là chữ ở 6 dịp của demo, KHÔNG có nút mua / thẻ quà / giỏ', dem(le, /Gợi ý quà tặng/g) === 6 && !/giftcard|thẻ quà|Thêm vào giỏ|<button[^>]*>[^<]*Mua/i.test(le));
  k('B4 Ngày lễ: nút nhắc từng ngày — "Nhắc khi mở app" khi tắt, "Đang nhắc" khi bật (Nhà giáo VN đã bật), có aria-pressed, chú thích nhắc hiện khi mở app', le.includes('Nhắc khi mở app') && dem(le, /aria-pressed="true"/g) === 1 && le.includes('Đang nhắc') && le.includes('Chưa tự báo về điện thoại khi đóng app'));
  const st = veTI({ ...cb, id: 'saptoi', homNay: HN, banner: KB });
  k('B4 Sắp tới: gộp việc chưa xong trong 30 ngày + lễ, theo ngày; việc đã xong không hiện; nhãn Việc / Lễ', st.includes('Sinh nhật mẹ') && st.includes('Đón con tan học') && !st.includes('Họp nhóm') && st.includes('Nhà giáo Việt Nam') && dem(st, /class="up-tag"/g) >= 3 && st.indexOf('Đón con tan học') < st.indexOf('Sinh nhật mẹ'));
  globalThis.localStorage = khoGia();
  const st0 = veTI({ ...cb, id: 'saptoi', homNay: HN, banner: KB });
  k('B4 Sắp tới: không có việc → chỉ còn lễ gần nhất (không bịa việc)', !st0.includes('Đón con') && st0.includes('Nhà giáo Việt Nam'));
  console.log('B5 — ô Kế hoạch ở Trang chủ');
  // Trang chủ dùng các hook dữ liệu khách (không vẽ được ở Node) → vẽ thật ô + khoá; phần nối vào Trang chủ kiểm bằng đọc nguồn (và thử tay trong Chromium).
  const oKe = dung('o.jsx', `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import OK from './components/OKeHoach.jsx'; import KT from './components/KhoaTienIch.jsx';
    const o = (so) => React.createElement(OK, { homNay: { d: 7, m: 11, y: 2026 }, soViec: so, mo() {} });
    export const dn = () => renderToStaticMarkup(React.createElement(KT, { dangNhap: true, tiep: '/kehoach', moDangNhap() {} }, o(2)));
    export const khach = () => renderToStaticMarkup(React.createElement(KT, { dangNhap: false, tiep: '/kehoach', moDangNhap() {} }, o(null)));`);
  const tcDn = oKe.dn(), tcKhach = oKe.khach();
  k('B5 đã đăng nhập: ô "KẾ HOẠCH VÀ NHẮC VIỆC" (ngày dương 7 + Thứ Bảy, "Trợ lý của bạn · Miễn phí", Âm lịch 29/9, Tiết Lập đông, "2 việc hôm nay ›"), không khoá', tcDn.includes('KẾ HOẠCH VÀ NHẮC VIỆC') && tcDn.includes('<b>7</b><span>Thứ Bảy</span>') && tcDn.includes('Trợ lý của bạn') && tcDn.includes('Miễn phí') && tcDn.includes('Âm lịch 29/9') && tcDn.includes('Tiết Lập đông') && tcDn.includes('2 việc hôm nay ›') && !tcDn.includes('khoa-tien-ich'));
  k('B5 chưa đăng nhập: ô Kế hoạch MỜ + "Đăng nhập để mở khoá chức năng"; không đếm việc (không lộ số của khách trước)', tcKhach.includes('khoa-tien-ich') && tcKhach.includes('Đăng nhập để mở khoá chức năng') && tcKhach.includes('KẾ HOẠCH VÀ NHẮC VIỆC') && !/việc hôm nay/.test(tcKhach));
  const tc = doc('src/pages/TrangChu.jsx');
  k('B5 Trang chủ: ô nằm trong .top-row cạnh thẻ (không còn top-row mot), bọc KhoaTienIch với tiep = /kehoach, đếm việc chỉ khi đã đăng nhập VÀ biết khách', /<div className="top-row">\{ndHien\('hien\.home\.member'\) && the\}\{ndHien\('hien\.home\.cal'\) && ke\}<\/div>/.test(tc) && !tc.includes('top-row mot') && /<KhoaTienIch dangNhap=\{dangNhap\} tiep=\{taoDuongDan\('kehoach'\)\} moDangNhap=\{moDangNhapTai\}>/.test(tc) && /dangNhap && daBiet \? viecNgay/.test(tc));
  k('B6 Trang chủ không có thẻ video "Xem cách dùng app" (chưa có video)', !/guide-card|<[^>]*>Xem cách dùng app/.test(tc));
  console.log('E1 — nối vào App (đọc nguồn) và phạm vi');
  const app = doc('src/App.jsx');
  k('E1 App: dựng /kehoach và /kehoach/<tiện ích> chỉ khi đã đăng nhập, truyền san=daBiet; Trang chủ có moKeHoach', /dangNhap && trang === 'kehoach' && <KeHoach san=\{daBiet\}/.test(app) && /dangNhap && trang === 'tienich' && <TienIch[^>]*san=\{daBiet\}/.test(app) && /moKeHoach=\{\(\) => di\(taoDuongDan\('kehoach'\)\)\}/.test(app));
  k('E1 App: hết phiên / đăng xuất (donPhien) và đổi khách (docLaiGio) đều quên bản Kế hoạch trong bộ nhớ', /const donPhien = \(\) => \{[^\n]*quenKeHoach\(\)/.test(app) && /const docLaiGio = \(\) => \{[^\n]*quenKeHoach\(\)/.test(app));
  const moi = ['src/kehoach.js', 'src/pages/KeHoach.jsx', 'src/pages/TienIch.jsx', 'src/components/OKeHoach.jsx', 'src/components/BangNgay.jsx', 'src/components/dungKeHoach.js'].map(doc);
  const moiHet = moi.join('\n');
  k('E1 không gọi mạng: các tệp mới không import api.js, không fetch / XMLHttpRequest / sendBeacon', !/api\.js|fetch\(|XMLHttpRequest|sendBeacon/.test(moiHet));
  k('E1 giờ VN: không new Date(chuỗi giờ POS); "hôm nay" lấy từ bayGio()', !/new Date\(\s*(gio|chuoi|bayGio|String)/.test(moiHet) && /homNayTuGio\(bayGio\(\)\)/.test(doc('src/pages/KeHoach.jsx')));
  k('K3 không có chữ "nợ" (bản giả "Công nợ" bị bắt), không số mẫu của demo (1.250, 1900, support@)', khongNo(moiHet) && !khongNo(moiHet + 'Công nợ') && !/1\.250|1900|support@/.test(moiHet));
  k('K3 (KH-ND-3b) danh mục Menu / Trang món / Giỏ hàng có chữ để kiểm (≥ 20 khoá) và không có chữ "nợ"', (doc('src/noiDung/nd/menu.js').match(/'(?:menu|mon|gio)\./g) || []).length >= 20 && khongNo(doc('src/noiDung/nd/menu.js')));
  k('B6 biểu tượng không base64 trong src/ của tệp mới', !/data:image|base64/.test(moiHet));
  k('D1 chỉ MỘT nơi chạm localStorage cho Kế hoạch (kehoach.js)', moi.slice(1).every((t) => !/localStorage/.test(t)));
  const kehoachJsx = doc('src/pages/KeHoach.jsx');
  k('D2 chưa biết khách (san=false): thêm / sửa việc báo "Đang lấy thông tin tài khoản…", KHÔNG báo nhầm "trình duyệt không cho lưu" (KH-UI-5c: mọi thay đổi qua lam())', /const lam = [^\n]*\n\s*if \(!san\) \{ datTb\(nd\('ti\.chuaSan'\)\); return false; \}/.test(kehoachJsx) && /nd\('kh\.loiKho'\)/.test(kehoachJsx) && /if \(!san\) \{ datTb\(nd\('ti\.chuaSan'\)\)/.test(doc('src/pages/TienIch.jsx')) && /^Đang lấy thông tin tài khoản/.test(NDJ.nd('ti.chuaSan')));
  k('D1 đủ 500 việc: báo đúng lý do "Đã đủ số việc lưu trên máy này", không báo "Ngày chưa đúng"; việc thứ 501 không thêm được', KH.themViec({ ...KH.keHoachTrong(), viec: Array.from({ length: 500 }, (_, i) => ({ id: 'v' + i, ngay: '2026-11-07', gio: '08:00', tieu: 'x', nhac: false, xong: false })) }, { ngay: '2026-11-07', gio: '08:00', tieu: 'y' }) === null && /Đã đủ số việc lưu trên máy này/.test(NDJ.nd('bn.daDay')) && /nd\('bn\.daDay'\)/.test(doc('src/components/BangNgay.jsx')));
  k('E1 không còn ngày dự phòng bịa cho "hôm nay" (K3)', !/y: 2026 \}/.test(kehoachJsx + doc('src/pages/TienIch.jsx')) && !/if \(!homNay\) return null/.test(tc));
  void khong;
}
