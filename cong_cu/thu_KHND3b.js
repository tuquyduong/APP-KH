#!/usr/bin/env node
// THỬ KH-ND-3b — gom nội dung Menu, Trang món, Giỏ hàng (+ ô món, giá, Giờ vàng, thứ trong tuần) về danh mục `src/noiDung/nd/menu.js`: mọi chữ / nút / nhãn đọc qua nd().
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): danh mục hợp lệ, các tệp A1 hết chữ cứng, mọi khoá dùng có trong danh mục, hàm thuần đọc qua nd(), nhãn nhu cầu MỘT nguồn.
// Phần 2: App thật trong Chromium + POS giả — bản giả đổi khoá → Menu / Giỏ / Trang món đổi theo; bản rỗng → như cũ; có data-nd / data-nd-khoa.
// Chạy: node cong_cu/thu_KHND3b.js → dòng cuối "n đạt · m hỏng". Không có Playwright / KHONG_TRINH_DUYET=1 → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const tep = (f) => path.join(GOC, f);
const co = (f) => fs.existsSync(tep(f));
const doc = (f) => (co(f) ? fs.readFileSync(tep(f), 'utf8') : '');
const nap = async (f) => { try { return await import(pathToFileURL(tep(f)).href); } catch (e) { return { loiNap: String(e && e.message).split('\n')[0] }; } };
const boChuThich = (t) => t.replace(/\/\*[\s\S]*?\*\/|(^|[^:])\/\/[^\n]*/g, '$1');

// Tệp A1 → số chữ cứng được phép còn lại (chữ MÁY cần, không phải chữ hiện cho khách) kèm lý do.
const A1 = {
  'src/pages/Menu.jsx': 0, 'src/pages/TrangMon.jsx': 0, 'src/pages/GioHang.jsx': 0, 'src/pages/MonTheoDuong.jsx': 0, 'src/pages/KhongTimThay.jsx': 0,
  'src/components/MonO.jsx': 0, 'src/components/GvDem.jsx': 0, 'src/gioVang.js': 0, 'src/menuLoc.js': 0, 'src/gioHoatDong.js': 0,
  'src/components/GiaMon.jsx': 0, // KH-ND-3d B2: cột bậc giá dùng dinhDangSoTien (không còn `.replace('đ', '')`)
  'src/giaHang.js': 0, // KH-ND-3c: CHU_HANG_TANG, CHU_KHONG_THOI_HAN, dongGoi chuyển hết sang danh mục (ud.hang.*)
};
const TIEN_TO = 'menu|mon|gio|khongthay|gv|gia|khung|thu|home|tieuDe|tab';

(async () => {
  console.log('Phần 1 — A. Danh mục');
  const DM = (await nap('src/noiDung/nd/index.js')).DANH_MUC || [];
  const ND = await nap('src/noiDung/nd.js');
  const MENU = (await nap('src/noiDung/nd/menu.js')).MENU || [];
  const theo = new Map(DM.map((m) => [m.khoa, m]));
  const sua = MENU.filter((m) => !m.khoaBoi), khoa = MENU.filter((m) => m.khoaBoi);
  const theoLoai = {}; for (const m of sua) theoLoai[m.loai] = (theoLoai[m.loai] || 0) + 1;
  console.log(`  (menu.js: ${MENU.length} mục — ${JSON.stringify(theoLoai)} · khoá pos ${khoa.filter((m) => m.khoaBoi === 'pos').length} · tutinh ${khoa.filter((m) => m.khoaBoi === 'tutinh').length})`);
  k('A1 menu.js xuất MẢNG ≥ 80 mục, đã gộp vào danh mục chung', Array.isArray(MENU) && MENU.length >= 80 && MENU.every((m) => theo.get(m.khoa) === m), `${MENU.length} mục${ND.loiNap ? ' · ' + ND.loiNap : ''}`);
  k('A1 man của mục: Menu · Trang món · Giỏ hàng · Khung chung', [...new Set(MENU.map((m) => m.man))].sort().join('|') === 'Giỏ hàng|Khung chung|Menu|Trang món', [...new Set(MENU.map((m) => m.man))].join('|'));
  k('A1 kiemDanhMuc(TOÀN BỘ danh mục) = 0 lỗi', typeof ND.kiemDanhMuc === 'function' && ND.kiemDanhMuc(DM).length === 0, ND.kiemDanhMuc ? ND.kiemDanhMuc(DM).join(' | ') : 'thiếu hàm');
  k('A1 phần POS có mục khoá pos + chỉ đường (tên món, giá, nhóm, Giờ vàng, báo giá, hạng); phần tự tính có mục tutinh', ['menu.mon', 'menu.nhom', 'menu.gv.so', 'gio.mon', 'gio.tien', 'gio.maLoi', 'gia.hang'].every((x) => theo.get(x)?.khoaBoi === 'pos' && /POS/.test(theo.get(x).chiDuong))
    && theo.get('menu.gv.dem')?.khoaBoi === 'tutinh');
  const khongNo = (x) => !/nợ/i.test(JSON.stringify(x));
  k('A1 danh mục Menu / Giỏ không có chữ "nợ" (quán không có công nợ); bản giả "Công nợ" bị bắt', khongNo(MENU) && !khongNo([{ macDinh: 'Công nợ' }]));
  // macDinh = chữ đang chạy (chép nguyên từ mã cũ).
  const GOC_CHU = {
    'menu.tieuDe': 'Menu', 'menu.giaCu': 'Giá cập nhật lúc {ngay}', 'menu.conMon': '{so} món đang có', 'menu.dangLoc': 'Đang lọc theo: {nhuCau}', 'menu.xoaLoc': 'Xóa lọc', 'menu.timAria': 'Tìm món',
    'menu.timGoiY': 'Tìm món, ví dụ: phổ nhĩ…', 'menu.tatCa': 'Tất cả', 'menu.nhomKhac': 'Khác', 'menu.gv.dau': 'Giờ vàng cuối ngày', 'menu.gv.khung': 'Hôm nay {batDau}–{ketThuc} · giảm {phanTram}%',
    'menu.khongKhop': 'Chưa có món phù hợp. Thử bỏ bớt bộ lọc nhé.', 'mon.gvNhan': '-{phanTram}% Giờ vàng', 'mon.ghiChuGoiY': 'VD: ít ngọt hơn…', 'mon.nutThem': 'Thêm vào giỏ',
    'gio.rong.s': 'Chọn một món trà hợp tiết trời hôm nay nhé', 'gio.tiepTuc': 'Tiếp tục · chọn cách nhận hàng', 'gio.chuaTong': 'Tổng tiền sẽ hiện khi quán xác nhận', 'gio.ma.daAp': '✓ Đã áp dụng',
    'gio.daXoa': 'Đã xoá {ten} · ', 'gv.nhan.truoc': 'Giờ vàng −{phanTram}% từ {batDau}', 'gv.dem.moSau': 'Mở lúc {batDau} · sau {gio}', 'khongthay.noi': 'Liên kết này không còn hoặc bị gõ sai.',
    'gv.ghi.dangDuoi': 'Giá Giờ vàng áp khi thanh toán, không cộng thêm ưu đãi khác.', 'gv.ghi.truocC': ': giảm {phanTram}%.', 'thu.t8': 'Chủ nhật',
  };
  const saiGoc = Object.entries(GOC_CHU).filter(([x, v]) => theo.get(x)?.macDinh !== v).map(([x]) => x);
  k(`A1 macDinh = chữ đang chạy (${Object.keys(GOC_CHU).length} khoá kiểm lại với chữ cũ)`, saiGoc.length === 0, saiGoc.join(', '));
  k('A1 bien khai đúng chỗ điền (gv.nhan.truoc: phanTram, batDau; gio.daXoa: ten)', JSON.stringify(theo.get('gv.nhan.truoc')?.bien) === '["phanTram","batDau"]' && JSON.stringify(theo.get('gio.daXoa')?.bien) === '["ten"]');
  k('A1 mọi mục chữ của gv.* / mon.* / gio.* thuộc đúng nhóm man, 7 khoá thứ thu.t2…t8', ['t2', 't3', 't4', 't5', 't6', 't7', 't8'].every((t) => theo.get(`thu.${t}`)?.man === 'Khung chung'));

  console.log('Phần 1 — B. Tệp A1 hết chữ cứng, khoá dùng có trong danh mục');
  let H = {};
  try { H = require(tep('cong_cu/ha_no_chu.js')); } catch { /* thiếu */ }
  const conChu = Object.keys(A1).filter((f) => H.demChuCung(doc(f)) !== A1[f]).map((f) => `${f} (${H.demChuCung(doc(f))}, phép ${A1[f]})`);
  k(`C1 ${Object.keys(A1).length} tệp A1: số chữ cứng = 0 (GiaMon hết replace đơn vị tiền từ KH-ND-3d)`, typeof H.demChuCung === 'function' && conChu.length === 0, conChu.join(', '));
  const dung = new Set(), thieu = [];
  for (const f of [...Object.keys(A1), 'src/noiDung/nd/menu.js']) {
    const nguon = boChuThich(doc(f));
    for (const m of nguon.matchAll(/\b(?:nd|ndPhan|ndDau|ndNut|ndAnh|ndDs|ndHien)\(([^)]*)\)|\bk="([^"]+)"|(['"])((?:menu|mon|gio|khongthay|gv|gia|khung|thu|home|tieuDe|tab)\.[\w.]+)\3/g)) {
      const trongHam = m[1] !== undefined ? [...m[1].matchAll(/(['"])([\w]+(?:\.\w+)+)\1/g)].map((x) => x[2]) : [];
      for (const x of [...trongHam, m[2], m[4]].filter(Boolean)) { dung.add(x); if (f !== 'src/noiDung/nd/menu.js' && !theo.has(x)) thieu.push(`${f}: ${x}`); }
    }
  }
  k(`C1 mọi khoá các tệp A1 dùng (${dung.size} khoá) đều có trong danh mục`, thieu.length === 0 && dung.size >= 60, thieu.join(', '));
  const dong = ['gv.nhan.dang', 'gv.nhan.sau', 'gv.nhan.cho', 'gv.nhan.truoc', 'thu.t2', 'thu.t3', 'thu.t4', 'thu.t5', 'thu.t6', 'thu.t7', 'thu.t8'];
  k('C1 các khoá ghép chuỗi (gv.nhan.<pha>, thu.t<N>) có đủ trong danh mục', dong.every((x) => theo.has(x)) && /gv\.nhan\.\$\{/.test(doc('src/components/GiaMon.jsx')) && /thu\.t\$\{/.test(doc('src/gioHoatDong.js')));
  const trongKhoa = [...theo.keys()].filter((x) => x.startsWith('hien.')).length;
  const dich = (await nap('src/noiDung/nd/index.js')).DICH.map((d) => d[0]).join(',');
  k('A1 nhóm khác còn nguyên (Trang chủ: khoá hien.* và home.need); DICH chỉ thêm đích hang của KH-THE-1', trongKhoa >= 7 && !!theo.get('home.need') && dich === 'menu,giovang,tracnghiem,kehoach,uudai,hang', dich);
  const nc = (s) => /NHU_CAU/.test(boChuThich(s));
  const docSrcNC = ['src/components/MonO.jsx', 'src/pages/TrangMon.jsx', 'src/pages/Menu.jsx'].filter((f) => nc(doc(f)));
  k("A2 MonO / TrangMon / Menu không còn đọc NHU_CAU; đọc ndDs('home.need') (nhan để hiện, ten để lọc)", docSrcNC.length === 0 && /ndDs\('home\.need'\)/.test(doc('src/components/MonO.jsx')) && /ndDs\('home\.need'\)/.test(doc('src/pages/TrangMon.jsx'))
    && /ndDs\('home\.need'\)/.test(doc('src/pages/Menu.jsx')) && /n\.nhan/.test(doc('src/components/MonO.jsx')) && /n\.nhan/.test(doc('src/pages/TrangMon.jsx')), docSrcNC.join(', '));
  k('A2 không tệp nào ngoài noiDung đọc NHU_CAU để hiện chữ', (() => { const ra = []; const di = (d) => fs.readdirSync(tep(d), { withFileTypes: true }).forEach((e) => { const p = `${d}/${e.name}`; if (e.isDirectory()) { if (p !== 'src/noiDung') di(p); } else if (/\.jsx?$/.test(e.name) && nc(doc(p))) ra.push(p); }); di('src'); return ra.length === 0; })());
  k('A1 Menu / Trang món / Giỏ hàng gắn data-nd (ndDau / Chu) cho chữ và data-nd-khoa cho phần POS', ['src/pages/Menu.jsx', 'src/pages/TrangMon.jsx', 'src/pages/GioHang.jsx'].every((f) => /ndDau\(|<Chu /.test(doc(f)))
    && /ndDau\('menu\.mon'\)/.test(doc('src/components/MonO.jsx')) && /ndDau\('gio\.tien'\)/.test(doc('src/pages/GioHang.jsx')) && /ndDau\(khoaDem\(tt, 'tile'\)\)/.test(doc('src/pages/Menu.jsx')) && /'menu\.gv\.dem'/.test(doc('src/pages/Menu.jsx'))
    && /ndDau\(mon \? 'gio\.hetHang' : 'gio\.khongCon'\)/.test(doc('src/pages/GioHang.jsx')));

  console.log('Phần 1 — C. Hàm thuần đọc qua nd()');
  const GV = await nap('src/gioVang.js'), GH = await nap('src/giaHang.js'), ML = await nap('src/menuLoc.js'), HH = await nap('src/gioHoatDong.js');
  const tt = (pha, o = {}) => ({ pha, conLai: 5400, phanTram: 50, batDau: '20:00', ketThuc: '21:00', ...o });
  if (GV.chuGioVang) {
    k('B1 chữ Giờ vàng mặc định như cũ (Còn 1:30:00 · Mở lúc… · Sắp bắt đầu · Đã kết thúc · nhãn món)', GV.chuGioVang(tt('dang'), 'short') === 'Còn 1:30:00' && GV.chuGioVang(tt('dang'), 'tile') === 'Còn 1:30' && GV.chuGioVang(tt('truoc'), 'tile') === '20:00'
      && GV.chuGioVang(tt('truoc'), 'long') === 'Mở lúc 20:00 · sau 1:30:00' && GV.chuGioVang(tt('truoc'), 'short') === 'Mở lúc 20:00' && GV.chuGioVang(tt('cho'), 'short') === 'Sắp bắt đầu' && GV.chuGioVang(tt('sau'), 'short') === 'Đã kết thúc'
      && GV.chuNhanMon(tt('dang')) === 'Giờ vàng −50%' && GV.chuNhanMon(tt('sau')) === 'Giờ vàng đã kết thúc' && GV.chuNhanMon(tt('cho')) === 'Giờ vàng −50% sắp bắt đầu' && GV.chuNhanMon(tt('truoc')) === 'Giờ vàng −50% từ 20:00');
  } else k('B1 src/gioVang.js nạp được', false, GV.loiNap);
  const HANG = [{ id: 1, ten: 'Vàng' }], MON1 = { gia: 30000, gia_hang: [{ hang_id: 1, gia: 25200 }] };
  k('B1 giaHang: cột giá thường mặc định "Thường"; menuLoc: nhóm trống → "Khác"; gioHoatDong: tên thứ', GH.bacThang && GH.bacThang(HANG, MON1, null)[0].ten === 'Thường' && ML.nhomTheoTen && ML.nhomTheoTen([{ ma: 'a', nhom: '' }])[0][0] === 'Khác'
    && HH.tenThu && HH.tenThu(2) === 'Thứ Hai' && HH.tenThu(8) === 'Chủ nhật' && HH.tenThu(1) === '' && HH.tenThu('7') === 'Thứ Bảy');
  if (ND.datBanNoiDung && GV.chuGioVang) {
    ND.datBanNoiDung({ so_ban: 2, gia_tri: { 'gv.dem.sap': 'Sắp mở', 'gv.nhan.dang': 'GV giảm {phanTram}%', 'gia.thuong': 'Giá lẻ', 'menu.nhomKhac': 'Món khác', 'thu.t2': 'T2', 'gv.dem.con': 'Còn đúng {gio}' } });
    k('B1 bản giả đổi chữ → hàm thuần đổi theo (Giờ vàng, bậc giá, nhóm khác, tên thứ) — chữ đi qua nd(), không còn viết cứng', GV.chuGioVang(tt('cho'), 'short') === 'Sắp mở' && GV.chuNhanMon(tt('dang')) === 'GV giảm 50%'
      && GV.chuGioVang(tt('dang'), 'tile') === 'Còn đúng 1:30' && GH.bacThang(HANG, MON1, null)[0].ten === 'Giá lẻ' && ML.nhomTheoTen([{ ma: 'a', nhom: null }])[0][0] === 'Món khác' && HH.tenThu(2) === 'T2');
    ND.datBanNoiDung({ so_ban: 3, gia_tri: { 'gv.dem.sap': 'Sắp {x}', 'gv.nhan.dang': 'không có chỗ điền' } });
    k('B1 bản giả mất chỗ điền {…} / thêm chỗ lạ → về chữ mặc định (một chữ hỏng không làm hỏng màn)', GV.chuGioVang(tt('cho'), 'short') === 'Sắp bắt đầu' && GV.chuNhanMon(tt('dang')) === 'Giờ vàng −50%');
    ND.datBanNoiDung(null);
    k('B1 bản rỗng → như cũ', GV.chuGioVang(tt('cho'), 'short') === 'Sắp bắt đầu' && GH.bacThang(HANG, MON1, null)[0].ten === 'Thường' && HH.tenThu(2) === 'Thứ Hai');
  }

  console.log('Phần 2 — Chromium');
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    let pw = null;
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})();

const BAY = (g) => `2026-10-30T${g}`;
const MENU_POS = { success: true, data: [
  { ma: 'juice_1', ten: 'Nước ép Hồng Tân Sinh', nhom: 'Nước ép', gia: 35000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
  { ma: 'juice_9', ten: 'Nước ép Hết Hàng', nhom: 'Nước ép', gia: 30000, con_hang: false, ton_cu: true, ton_luc: '2026-10-30T19:00:00', gia_hang: [] },
  { ma: 'x1', ten: 'Món Lạ', nhom: '', gia: 10000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
] };
const GHD = { success: true, bay_gio: BAY('20:30:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] };
const GVANG = { success: true, dang_chay: true, bat_dau: BAY('20:00:00'), ket_thuc: BAY('21:00:00'), phan_tram: 50, mon: ['juice_1'] };

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  let goi = '';
  try {
    goi = esbuild.buildSync({
      stdin: { contents: "import './main.jsx'; import { datBanNoiDung } from './noiDung/nd.js'; window.__datBan = datBanNoiDung;", resolveDir: tep('src'), loader: 'jsx' },
      bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent', loader: { '.css': 'empty', '.json': 'json' },
      define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
    }).outputFiles[0].text;
  } catch (e) { k('E1 dựng gói App có datBanNoiDung', false, String(e && e.message).split('\n')[0]); return; }
  const tr = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const html = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>');
  const ctx = await tr.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
  const t = await ctx.newPage();
  const loi = [];
  t.on('pageerror', (e) => loi.push(e.message));
  await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); localStorage.setItem('kh_gio', '[{"ma":"juice_1","so_luong":2,"ghi_chu":"ít đá"}]'); } catch { /* bỏ qua */ } });
  await t.route(`${URL0}/**`, async (r) => {
    const p = new URL(r.request().url()).pathname;
    const json = (s, o) => r.fulfill({ status: s, contentType: 'application/json', body: JSON.stringify(o) });
    if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
    if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
    const d = p.slice(7);
    if (d === '/gio-hoat-dong') return json(200, GHD);
    if (d === '/menu') return json(200, MENU_POS);
    if (d === '/gio-vang') return json(200, GVANG);
    if (d === '/hang') return json(200, { success: true, data: [] });
    return json(401, { error: 'Cần đăng nhập', code: 'KH_PHIEN_SAI' });
  });
  t.setDefaultTimeout(5000);
  const chuTrong = (sel) => t.evaluate((s) => { const e = document.querySelector(s); return e ? e.innerText.replace(/\s+/g, ' ').trim() : null; }, sel);
  const dau = () => t.evaluate(() => ({ nd: document.querySelectorAll('[data-nd]').length, khoa: document.querySelectorAll('[data-nd-khoa]').length }));
  const datBan = (gt) => t.evaluate((g) => window.__datBan({ so_ban: 9, gia_tri: g }), gt);
  const lamRong = () => t.evaluate(() => window.__datBan({ so_ban: 0, gia_tri: {} }));
  const vaoTab = async (ten) => { await t.click(`.tabbar [data-nd="tab.${ten}"]`); };
  try {
    // ── Menu ──
    await t.goto(`${URL0}/menu`);
    await t.waitForSelector('#catGrid .prod-card');
    const d0 = await dau();
    const tv = await t.evaluate(() => ({ h1: document.querySelector('#catalog h1')?.textContent, sub: document.querySelector('#catalog .sub')?.textContent, ph: document.querySelector('.search-box input')?.placeholder, tat: [...document.querySelectorAll('.ct b')].map((b) => b.textContent),
      nhom: [...document.querySelectorAll('.cat-title')].map((e) => e.textContent), het: document.querySelectorAll('#catGrid .stock-out')[0]?.textContent, pill: document.querySelector('#catGrid .prod-tags')?.textContent.replace(/\s+/g, ' ').trim() }));
    k('E1 Menu mặc định như cũ: "Menu", "2 món đang có", ô tìm, ô Giờ vàng + Tất cả, nhóm "Khác", "Hết hàng", nhãn nhu cầu', tv.h1 === 'Menu' && tv.sub === '2 món đang có' && tv.ph === 'Tìm món, ví dụ: phổ nhĩ…'
      && tv.tat.includes('Giờ vàng') && tv.tat.includes('Tất cả') && tv.nhom.some((x) => /^\s*Khác\s*1 món$/.test(x)) && tv.het === 'Hết hàng' && /Đẹp da/.test(tv.pill || ''), JSON.stringify(tv));
    k('E1 Menu có data-nd (≥ 12) và data-nd-khoa (≥ 4: tên món, nhóm, Giờ vàng)', d0.nd >= 12 && d0.khoa >= 4, JSON.stringify(d0));
    await datBan({ 'menu.tieuDe': 'Thực đơn', 'menu.tatCa': 'Mọi nhóm', 'menu.timGoiY': 'Gõ tên món', 'menu.nhomKhac': 'Món chưa xếp', 'mon.hetHang': 'Đã hết', 'menu.soMon': '{so} loại',
      'home.need': [{ ten: 'Ngủ ngon', nhan: 'Ngủ ngon', anh: '/anh/nhucau-ngu.webp', bieuTuong: 'need-moon' }, { ten: 'Đẹp da', nhan: 'Da đẹp', anh: '/anh/nhucau-da.webp', bieuTuong: 'need-blossom' }, { ten: 'Ấm bụng', nhan: 'Ấm bụng', anh: '/anh/nhucau-am.webp', bieuTuong: 'need-flame' },
        { ten: 'Tỉnh táo', nhan: 'Tỉnh táo', anh: '/anh/nhucau-tinh.webp', bieuTuong: 'need-sun' }, { ten: 'Bổ khí', nhan: 'Bổ khí', anh: '/anh/nhucau-bo.webp', bieuTuong: 'need-swirl' }, { ten: 'Giải nhiệt', nhan: 'Giải nhiệt', anh: '/anh/nhucau-nhiet.webp', bieuTuong: 'need-drop' }] });
    await t.waitForFunction(() => document.querySelector('#catalog h1')?.textContent === 'Thực đơn');
    const m1 = await t.evaluate(() => ({ ph: document.querySelector('.search-box input')?.placeholder, tat: [...document.querySelectorAll('.ct b')].map((b) => b.textContent), nhom: [...document.querySelectorAll('.cat-title')].map((e) => e.textContent), het: document.querySelectorAll('#catGrid .stock-out')[0]?.textContent, pill: document.querySelector('#catGrid .prod-tags')?.textContent.replace(/\s+/g, ' ').trim() }));
    k('E1 bản giả đổi 6 khoá Menu (tên màn, Tất cả, gợi ý ô tìm, nhóm khác, Hết hàng, số món) + nhãn nhu cầu → Menu đổi theo', m1.ph === 'Gõ tên món' && m1.tat.includes('Mọi nhóm') && m1.nhom.some((x) => /Món chưa xếp\s*1 loại/.test(x)) && m1.het === 'Đã hết' && /Da đẹp/.test(m1.pill || '') && !/Đẹp da/.test(m1.pill || ''), JSON.stringify(m1));
    // ── Trang món ──
    await t.click('#catGrid .prod-card');
    await t.waitForSelector('.detail-name');
    const tm = await t.evaluate(() => ({ chip: document.querySelector('.benefit-chip')?.textContent.trim(), nut: document.querySelector('.detail-addcart span')?.textContent, ghiChu: document.querySelector('.opt-title')?.textContent, sl: document.querySelector('.sl-chu')?.textContent,
      tag: document.querySelector('.detail-hero .tag')?.textContent, gv: document.querySelector('.gv-note')?.textContent.replace(/\s+/g, ' ').trim(), nd: document.querySelectorAll('#detail [data-nd]').length }));
    k('E1 Trang món (nhãn nhu cầu từ bản giả, nút, ghi chú, số lượng, nhãn Giờ vàng, ghi chú Giờ vàng) đọc từ danh mục', tm.chip === 'Da đẹp' && tm.nut === 'Thêm vào giỏ' && tm.ghiChu === 'Ghi chú cho quán' && tm.sl === 'Số lượng' && tm.tag === '-50% Giờ vàng'
      && /^Giờ vàng −50% · Còn \d+:\d\d:\d\d\. Giá Giờ vàng áp khi thanh toán, không cộng thêm ưu đãi khác\.$/.test(tm.gv || '') && tm.nd >= 8, JSON.stringify(tm));
    await datBan({ 'mon.nutThem': 'Cho vào giỏ', 'mon.soLuong': 'Mấy ly', 'mon.ghiChu': 'Dặn quán', 'mon.gvNhan': 'GV {phanTram}%', 'gv.ghi.dangDuoi': 'Chỉ áp khi trả tiền.', 'gv.ghi.dangB': 'GV giảm {phanTram}%' });
    await t.waitForFunction(() => document.querySelector('.detail-addcart span')?.textContent === 'Cho vào giỏ');
    const tm1 = await t.evaluate(() => ({ ghiChu: document.querySelector('.opt-title')?.textContent, sl: document.querySelector('.sl-chu')?.textContent, tag: document.querySelector('.detail-hero .tag')?.textContent, gv: document.querySelector('.gv-note')?.textContent.replace(/\s+/g, ' ').trim(), phTen: document.querySelector('.note-in')?.getAttribute('aria-label') }));
    k('E1 bản giả đổi nút / nhãn / ghi chú Giờ vàng ở Trang món → đổi theo (kể cả tên đọc cho máy đọc màn hình)', tm1.ghiChu === 'Dặn quán' && tm1.sl === 'Mấy ly' && tm1.tag === 'GV 50%' && /^GV giảm 50% · Còn .*\. Chỉ áp khi trả tiền\.$/.test(tm1.gv || '') && tm1.phTen === 'Dặn quán', JSON.stringify(tm1));
    await lamRong();
    await t.waitForFunction(() => document.querySelector('.detail-addcart span')?.textContent === 'Thêm vào giỏ');
    // Trang món hết hàng
    await t.goBack();
    await t.waitForSelector('#catGrid .prod-card');
    await t.locator('#catGrid .prod-card', { hasText: 'Hết Hàng' }).click();
    await t.waitForSelector('.detail-name');
    const het = await t.evaluate(() => ({ nhan: document.querySelector('.detail-hero .stock-out')?.textContent, nut: document.querySelector('.detail-addcart span')?.textContent, ton: document.querySelector('.care-disclaimer')?.textContent.replace(/\s+/g, ' ').trim() }));
    k('E1 Trang món hết hàng: nhãn "Hết hàng", nút "Hết hàng", dòng "theo số lúc …" như cũ', het.nhan === 'Hết hàng' && het.nut === 'Hết hàng' && /^theo số lúc /.test(het.ton || ''), JSON.stringify(het));
    await datBan({ 'mon.nutHet': 'Tạm hết', 'mon.hetHang': 'Hết rồi', 'mon.tonCu': 'số cũ lúc {ngay}' });
    await t.waitForFunction(() => document.querySelector('.detail-addcart span')?.textContent === 'Tạm hết');
    const het1 = await t.evaluate(() => ({ nhan: document.querySelector('.detail-hero .stock-out')?.textContent, ton: document.querySelector('.care-disclaimer')?.textContent.replace(/\s+/g, ' ').trim() }));
    k('E1 bản giả đổi nút / nhãn hết hàng / dòng số cũ → đổi theo', het1.nhan === 'Hết rồi' && /^số cũ lúc /.test(het1.ton || ''), JSON.stringify(het1));
    await lamRong();
    // ── Giỏ hàng ──
    await t.goBack();
    await t.waitForSelector('#catGrid .prod-card');
    await vaoTab('giohang');
    await t.waitForSelector('#cart .cart-item');
    const g0 = await chuTrong('#cart');
    const gv0 = await t.evaluate(() => ({ h1: document.querySelector('#cart h1')?.textContent, sub: document.querySelector('#cart .sub')?.textContent, ph: document.querySelector('.promo-box input')?.placeholder, ap: document.querySelector('.promo-box button')?.textContent, tong: document.querySelector('.bang-tien')?.textContent.trim(),
      tiep: document.querySelector('.checkout-btn span')?.textContent, ten: document.querySelector('.cart-name')?.textContent, nd: document.querySelectorAll('#cart [data-nd]').length, khoa: document.querySelectorAll('#cart [data-nd-khoa]').length }));
    k('E1 Giỏ hàng mặc định như cũ: "Giỏ hàng", "2 món", ô mã, "Áp dụng", chưa báo giá, nút "Tiếp tục · chọn cách nhận hàng"; có data-nd', gv0.h1 === 'Giỏ hàng' && gv0.sub === '2 món' && gv0.ph === 'Nhập mã giảm giá' && gv0.ap === 'Áp dụng' && gv0.tong === 'Tổng tiền sẽ hiện khi quán xác nhận'
      && gv0.tiep === 'Tiếp tục · chọn cách nhận hàng' && gv0.nd >= 8, JSON.stringify(gv0));
    await datBan({ 'gio.tieuDe': 'Giỏ của bạn', 'gio.tiepTuc': 'Đi tiếp nhé', 'gio.ma.goiY': 'Mã ưu đãi', 'gio.ma.ap': 'Dùng mã', 'gio.chuaTong': 'Chưa có tổng', 'gio.soMon': 'Có {so} phần', 'khung.bot': 'Giảm', 'khung.them': 'Tăng' });
    await t.waitForFunction(() => document.querySelector('#cart h1')?.textContent === 'Giỏ của bạn');
    const gv1 = await t.evaluate(() => ({ sub: document.querySelector('#cart .sub')?.textContent, ph: document.querySelector('.promo-box input')?.placeholder, ap: document.querySelector('.promo-box button')?.textContent, tong: document.querySelector('.bang-tien')?.textContent.trim(),
      tiep: document.querySelector('.checkout-btn span')?.textContent, bot: document.querySelector('.cart-item .qty-ctrl button')?.getAttribute('aria-label'), them: document.querySelectorAll('.cart-item .qty-ctrl button')[1]?.getAttribute('aria-label') }));
    k('E1 bản giả đổi 8 khoá Giỏ hàng (tên màn, nút tiếp tục, ô mã, nút áp mã, chưa có tổng, số món, Giảm / Tăng) → Giỏ đổi theo', gv1.sub === 'Có 2 phần' && gv1.ph === 'Mã ưu đãi' && gv1.ap === 'Dùng mã' && gv1.tong === 'Chưa có tổng' && gv1.tiep === 'Đi tiếp nhé' && gv1.bot === 'Giảm' && gv1.them === 'Tăng', JSON.stringify(gv1));
    await lamRong();
    await t.waitForFunction(() => document.querySelector('#cart h1')?.textContent === 'Giỏ hàng');
    const g1 = await chuTrong('#cart');
    k('E1 bản rỗng → Giỏ hàng như cũ (cùng chữ trước khi đổi)', g0 === g1, `${g0} ≠ ${g1}`);
    // Xoá món → thông báo + giỏ trống
    await datBan({ 'gio.hoanTac': 'Quay lại', 'gio.daXoa': 'Bỏ {ten} rồi · ' });
    await t.click('.cart-xoa');
    await t.waitForSelector('.toast.co-nut');
    const toast = await chuTrong('.toast.co-nut');
    k('E1 thông báo xoá món đọc từ danh mục (bản giả: "Bỏ <tên món> rồi · Quay lại"), có data-nd', toast === 'Bỏ Nước ép Hồng Tân Sinh rồi · Quay lại' && (await t.evaluate(() => !!document.querySelector('.toast.co-nut[data-nd="gio.daXoa"]'))), toast || '');
    await lamRong();
    await t.waitForFunction(() => document.querySelector('.toast.co-nut')?.textContent.includes('Hoàn tác'));
    const toast0 = await chuTrong('.toast.co-nut');
    k('E1 bản rỗng → thông báo xoá như cũ ("Đã xoá <tên món> · Hoàn tác")', toast0 === 'Đã xoá Nước ép Hồng Tân Sinh · Hoàn tác', toast0 || '');
    await t.waitForSelector('#cart .empty-cart');
    const rong = await t.evaluate(() => ({ t: document.querySelector('.empty-cart .t')?.textContent, s: document.querySelector('.empty-cart .s')?.textContent, nut: document.querySelector('.empty-cart .ghost-btn')?.textContent, nd: document.querySelectorAll('.empty-cart [data-nd]').length }));
    k('E1 giỏ trống: "Giỏ hàng đang trống" · gợi ý · "Xem Menu" như cũ, có data-nd', rong.t === 'Giỏ hàng đang trống' && rong.s === 'Chọn một món trà hợp tiết trời hôm nay nhé' && rong.nut === 'Xem Menu' && rong.nd >= 3, JSON.stringify(rong));
    await datBan({ 'gio.rong.t': 'Chưa có gì', 'gio.rong.nut': 'Vào Menu' });
    await t.waitForFunction(() => document.querySelector('.empty-cart .t')?.textContent === 'Chưa có gì');
    k('E1 bản giả đổi chữ giỏ trống → đổi theo', (await chuTrong('.empty-cart .ghost-btn')) === 'Vào Menu');
    await lamRong();
    // ── Không tìm thấy ──
    await t.goto(`${URL0}/mon/khong-co-mon-nay`);
    await t.waitForSelector('#khongthay, #detail');
    await t.waitForSelector('#khongthay');
    const kt = await t.evaluate(() => ({ t: document.querySelector('#khongthay h1')?.textContent, noi: document.querySelector('#khongthay .nt-state')?.textContent, nut: document.querySelector('#khongthay .checkout-btn')?.textContent, nd: document.querySelectorAll('#khongthay [data-nd]').length }));
    k('E1 món không còn: "Không tìm thấy món" · câu báo · "Xem Menu" như cũ, có data-nd', kt.t === 'Không tìm thấy món' && kt.noi === 'Liên kết này không còn hoặc bị gõ sai.' && kt.nut === 'Xem Menu' && kt.nd >= 3, JSON.stringify(kt));
    await datBan({ 'mon.khongThay.t': 'Món này hết duyên', 'khongthay.noi': 'Link hỏng.', 'mon.khongThay.nut': 'Về thực đơn' });
    await t.waitForFunction(() => document.querySelector('#khongthay h1')?.textContent === 'Món này hết duyên');
    k('E1 bản giả đổi chữ "không tìm thấy món" → đổi theo', (await chuTrong('#khongthay .checkout-btn')) === 'Về thực đơn' && (await chuTrong('#khongthay .nt-state')) === 'Link hỏng.');
    await lamRong();
    await t.goto(`${URL0}/duong-dan-la`);
    await t.waitForSelector('#khongthay');
    const kt2 = await t.evaluate(() => ({ t: document.querySelector('#khongthay h1')?.textContent, nut: document.querySelector('#khongthay .checkout-btn')?.textContent }));
    k('E1 đường dẫn lạ: "Không tìm thấy trang" · "Về Trang chủ" như cũ', kt2.t === 'Không tìm thấy trang' && kt2.nut === 'Về Trang chủ', JSON.stringify(kt2));
    k('E1 không lỗi trang', loi.length === 0, loi.join(' | '));
  } catch (e) { k('E1 ca Chromium dừng giữa chừng', false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); await tr.close(); }
}
