#!/usr/bin/env node
// THỬ KH-NHANH-2 — vòng xoay chờ POS (chỉ lượt khách đang chờ, quá 300 ms), tổng tiền cũ mờ lúc tính lại, nút gửi có vòng nhỏ, preconnect, báo giá gom đầu + đuôi.
// Phần 1: hàm thuần + đọc nguồn + dựng thử index.html (không trình duyệt) · Phần 2: App thật trong Chromium + POS giả có độ trễ chỉnh được.
// Chạy: node cong_cu/thu_KHNHANH2.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const doc = (f) => (f.startsWith('src/') ? boChuThich(docTho(f)) : docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };
const cho = (ms) => new Promise((r) => setTimeout(r, ms));

/** Chạy các <script> nội tuyến (không type=module) có chữ "preconnect" của một trang HTML với `document` giả → danh sách link đã thêm. */
function chayPreconnect(html) {
  const them = [];
  const document = { createElement: (t) => ({ tag: t }), head: { appendChild: (x) => them.push(x) } };
  const ds = [...html.matchAll(/<script(?![^>]*\btype="module")[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).filter((s) => /preconnect/.test(s));
  for (const s of ds) vm.runInNewContext(s, { document, URL });
  return { soScript: ds.length, link: them.filter((x) => x.tag === 'link' && x.rel === 'preconnect') };
}

(async () => {
  console.log('Phần 1 — hàm thuần + đọc nguồn');

  await thu('C2', async () => {
    const D = await nap('src/datDon.js');
    const MS = 60;
    const gop = D.taoGop(MS); const goi = [];
    gop(() => goi.push('g1'));
    k('C2 lần đổi đầu (đang yên) → gửi NGAY, không chờ', goi.length === 1, String(goi.length));
    await cho(MS * 2);
    goi.length = 0;
    for (let i = 1; i <= 5; i++) { gop(() => goi.push(`g${i}`)); await cho(MS / 6); }
    const ngay = goi.slice();
    await cho(MS * 3);
    k('C2 5 lần đổi liền tay → đúng 2 lượt (đầu ngay + cuối sau khi yên), lượt cuối mang giỏ cuối', ngay.join() === 'g1' && goi.join() === 'g1,g5', `${ngay.join()} | ${goi.join()}`);
    goi.length = 0;
    gop(() => goi.push('x'));
    k('C2 yên quá ms rồi đổi → gửi ngay', goi.join() === 'x', goi.join());
    goi.length = 0;
    gop(() => goi.push('a')); gop(() => goi.push('b')); gop.huy(); await cho(MS * 2);
    k('C2 huy() bỏ lượt cuối đang hẹn (rời màn)', goi.join() === '', goi.join());
  });

  await thu('A1', async () => {
    const A = await nap('src/api.js');
    k('A1 api.js có theoDoiDangCho + ngam', typeof A.theoDoiDangCho === 'function' && typeof A.ngam === 'function');
    if (typeof A.theoDoiDangCho !== 'function' || typeof A.ngam !== 'function') return;
    // fetch giả: mỗi lượt trả sau `tre` ms (mảng hàng đợi), status theo `st`
    const hang = [];
    globalThis.fetch = () => {
      const { tre = 0, st = 200, nem = false } = hang.shift() || {};
      return new Promise((ok, sai) => setTimeout(() => (nem ? sai(new Error('mạng')) : ok({ ok: st < 400, status: st, json: async () => (st < 400 ? { data: [] } : { error: 'x', code: 'KH_TOKEN_SAI' }) })), tre));
    };
    const bao = [];
    const go = A.theoDoiDangCho((b) => bao.push(b));
    const mo = () => bao.filter(Boolean).length;
    const dong = () => bao.length && bao[bao.length - 1] === false;
    // lượt chờ 450 ms → báo có (sau ~300 ms), hết → báo không
    hang.push({ tre: 450 });
    const p1 = A.layMenu(); await cho(200);
    const truoc300 = mo();
    await cho(200);
    const sau300 = mo();
    await p1; await cho(5);
    k('A1 lượt chờ 450 ms: chưa tới 300 ms KHÔNG báo; quá 300 ms báo "có"; xong → báo "không"', truoc300 === 0 && sau300 === 1 && dong(), JSON.stringify(bao));
    bao.length = 0;
    hang.push({ tre: 120 });
    await A.layMenu(); await cho(400);
    k('A1 lượt chờ 120 ms (< 300) → không bao giờ báo "có"', mo() === 0, JSON.stringify(bao));
    bao.length = 0;
    hang.push({ tre: 450 });
    const pn = A.ngam(() => A.layMenu());
    await cho(400); await pn;
    k('A1 lượt ngầm (ngam) 450 ms → không tính', mo() === 0, JSON.stringify(bao));
    bao.length = 0;
    hang.push({ tre: 450 });
    const sauNgam = A.layMenu(); await cho(400); await sauNgam; await cho(5);
    k('A1 lượt ngay sau ngam() vẫn đếm (cờ ngầm không dính)', mo() === 1 && dong(), JSON.stringify(bao));
    bao.length = 0;
    hang.push({ tre: 400, nem: true });
    await A.layMenu().catch(() => {}); await cho(5);
    hang.push({ tre: 400, st: 401 });
    await A.layToi().catch(() => {}); await cho(5);
    k('A1 lỗi mạng / 401 → đếm về 0 (báo "không" sau mỗi lượt)', mo() === 2 && dong(), JSON.stringify(bao));
    bao.length = 0;
    hang.push({ tre: 350 }, { tre: 700 });
    const q1 = A.layMenu(), q2 = A.layDiem();
    await q1; await cho(30);
    const giua = bao.slice();
    await q2; await cho(5);
    k('A1 hai lượt chồng nhau: một lượt xong vẫn còn vòng; hết cả hai mới báo "không"', giua.join() === 'true' && bao.join() === 'true,false', `${giua.join()} | ${bao.join()}`);
    bao.length = 0;
    // kho dữ liệu khách: chưa có dữ liệu → chờ; đã có → ngầm
    const DL = await nap('src/duLieuKhach.js');
    const c = DL.taoCua(() => A.layMenu());
    hang.push({ tre: 400 }); await c.lay(); await cho(5);
    const lanDau = mo();
    hang.push({ tre: 400 }); await c.lay(); await cho(5);
    k('A1 kho dữ liệu khách: lần đầu (chưa có) đếm; cập nhật khi đã có dữ liệu → ngầm', lanDau === 1 && mo() === 1, JSON.stringify(bao));
    hang.push({ tre: 450 }, { tre: 450 });
    await A.layGioVang(); await A.giaHan().catch(() => {}); await cho(5);
    k('A1 cửa nền /gio-vang, /gia-han (App tự nạp) → không tính', mo() === 1, JSON.stringify(bao));
    const ct = DL.taoCua(() => A.layMenu());
    ct.kho.dat({ dl: { tuMay: true }, luc: 0, loi: '' });
    hang.push({ tre: 400 }); await ct.lay(); await cho(5);
    k('A1 kho chỉ có bản tóm tắt trên máy (tuMay) → coi như chưa có: lượt chờ', mo() === 2, JSON.stringify(bao));
    go();
    bao.length = 0;
    hang.push({ tre: 400 }); await A.layMenu();
    k('A1 huỷ đăng ký → không còn nhận báo', bao.length === 0);
    k('A1 trễ hiện = 300 ms (một hằng)', A.MS_TRE_CHO === 300, String(A.MS_TRE_CHO));
  });

  // A1 — bảng chỗ gọi ngầm (ke_hoach.md): mỗi chỗ chạy nền bọc ngam(…)
  const NGAM = [
    ['src/api.js', /CUA_NGAM = \['\/hang', '\/gio-vang', '\/gio-hoat-dong'\]/, 'cửa App tự nạp nền (heThong mỗi phút, GvDem)'],
    ['src/api.js', /giaHan = \(\) => ngam\(\(\) => goi\('POST', '\/gia-han'\)\)/, 'gia hạn đăng nhập'],
    ['src/duLieuKhach.js', /coDl \? ngam\(ham\) : ham\(\)/, 'kho dữ liệu khách đã có dữ liệu thật'],
    ['src/dungDatDon.js', /dongHo\.current \? ngam\(/, 'Theo dõi đơn hỏi lại 3 s / 10 s (lượt do đồng hồ)'],
    ['src/App.jsx', /ngam\(hoiQuangCao\)/, 'quảng cáo khi quay lại App'],
    ['src/App.jsx', /ngam\(\(\) => menu\.taiLai\(true\)\)/, 'đơn vừa trả (sau lượt ngầm) → lấy lại menu'],
    ['src/pages/Menu.jsx', /tai\.dl \? ngam\(tai\.taiLai\)/, 'bấm tab Menu khi đã có menu'],
  ];
  for (const [f, re, ten] of NGAM) k(`A1 ngầm: ${ten} (${f})`, re.test(doc(f)));
  const api = doc('src/api.js');
  k('A1 MỘT chỗ đếm, đường fetch không đổi: goi bọc goiThat; vẫn đúng 2 chữ fetch( trong api.js', /function goi\(/.test(api) && /async function goiThat\(/.test(api) && (api.match(/\bfetch\(/g) || []).length === 2);

  // A2 / A3 — đọc nguồn
  const vc = doc('src/components/VongCho.jsx'), css = docTho('src/giaoDien/cho.css');
  k('A2 VongCho: dùng theoDoiDangCho, role=progressbar, nhãn từ danh mục (data-nd)', /theoDoiDangCho/.test(vc) && /role="progressbar"/.test(vc) && /ndDau\('khung\.dangCho'\)/.test(vc));
  k('A2 gắn MỘT lần trong khung App', (doc('src/App.jsx').match(/<VongCho\b/g) || []).length === 1);
  const lop = [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]).filter((x) => !['bang-tien', 'summary-row', 'total', 'to', 'trang'].includes(x));
  k('A3 cho.css: mọi lớp mới tiền tố cho-', css.length > 0 && lop.every((x) => x.startsWith('cho-')), lop.filter((x) => !x.startsWith('cho-')).join(','));
  const giua = (css.match(/\.cho-giua\s*\{[^}]*\}/) || [''])[0];
  k('A3 vòng giữa màn: pointer-events:none, không nền, không phủ (không inset:0)', /pointer-events:\s*none/.test(giua) && !/background/.test(giua) && !/inset/.test(giua), giua);
  k('A3 prefers-reduced-motion → quay chậm (không tắt)', /prefers-reduced-motion[\s\S]*cho-xoay[^}]*animation-duration/.test(css));
  const nd = await nap('src/noiDung/nd/menu.js').catch(() => ({}));
  const dm = Object.values(nd).find(Array.isArray) || [];
  k('A2/B1 mục danh mục mới: khung.dangCho, gio.dangTinh', ['khung.dangCho', 'gio.dangTinh'].every((x) => dm.some((m) => m.khoa === x)));

  // B — đọc nguồn
  const gh = doc('src/pages/GioHang.jsx');
  k('B2 Giỏ không còn ref bgCu riêng (dùng bgCu của dungBaoGia)', !/useRef\(null\)/.test(gh.split('export default function GioHang')[1] || '') && /bgCu/.test(gh));
  k('B3 nút Đặt đơn có vòng trắng khi đang gửi', /dang && <span className="cho-xoay trang"/.test(doc('src/pages/ThanhToan.jsx')));
  k('B3 nút Xác nhận bảng PIN có vòng khi đang gửi', /dang && <span className="cho-xoay"/.test(doc('src/components/PinSheet.jsx')));

  // C1 — preconnect
  const html = docTho('index.html');
  const tho = chayPreconnect(html);
  k('C1 index.html có script preconnect; biến chưa thay (dựng không biến / chạy thử) → KHÔNG thêm link', tho.soScript === 1 && tho.link.length === 0, JSON.stringify(tho));
  const vao = (g) => chayPreconnect(html.replace(/%VITE_POS_API%/g, g)).link;
  const l1 = vao('https://www.pos-vi-du.test/'), l2 = vao('https://pos-vi-du.test/api/kh'), l3 = vao('');
  k('C1 có biến → link preconnect = GỐC (không /api, không / cuối), crossorigin', l1.length === 1 && l1[0].href === 'https://www.pos-vi-du.test' && l1[0].crossOrigin === '' && l2.length === 1 && l2[0].href === 'https://pos-vi-du.test' && l3.length === 0, JSON.stringify([l1, l2, l3]));
  k('C1 script preconnect đứng TRƯỚC stylesheet (không chờ CSS)', html.indexOf('preconnect\'') > 0 && html.indexOf('preconnect\'') < html.indexOf('rel="stylesheet"'));
  await thu('C1 dựng', async () => {
    const ra = fs.mkdtempSync(path.join(os.tmpdir(), 'nhanh2-'));
    const r = spawnSync('npx', ['vite', 'build', '--outDir', ra, '--emptyOutDir', '--logLevel', 'error'], { cwd: GOC, encoding: 'utf8', timeout: 90000, env: { ...process.env, VITE_POS_API: 'https://www.pos-vi-du.test' } });
    const dist = r.status === 0 ? fs.readFileSync(path.join(ra, 'index.html'), 'utf8') : '';
    const l = dist ? chayPreconnect(dist).link : [];
    k('C1 vite build với VITE_POS_API → index.html dựng có preconnect đúng gốc, không /api', r.status === 0 && l.length === 1 && l[0].href === 'https://www.pos-vi-du.test' && !/\/api/.test(dist.split('<body')[0]), r.status === 0 ? JSON.stringify(l) : String(r.stderr).slice(-200));
    fs.rmSync(ra, { recursive: true, force: true });
  });

  console.log('Phần 2 — Chromium + POS giả có độ trễ');
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    let pw = null;
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }
  console.log(`  (chạy hết ${Math.round(process.uptime())} giây — bộ kiểm cắt ở 120 giây)`);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goiApp = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const tepCss = new Set([...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => 'src/' + m[1]));
  for (const f of fs.readdirSync(path.join(GOC, 'src/giaoDien'))) if (f.endsWith('.css')) tepCss.add('src/giaoDien/' + f); // css nạp ở màn / thành phần (cho.css, voucher.css…)
  const css = [...tepCss].map(cssTron).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const BAY = '2026-10-30T20:30:00';
  const KHACH = { sdt: '0909123456', ten: 'Nguyễn Linh', ngay_tao: '2026-01-01T08:00:00', xung_ho: 'chi', dia_chi: null, qr: 'QR-A', hang: null, so_du_vi: 0 };
  const MENU = { success: true, data: [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] }] };
  const bgCua = (than) => { const sl = (than && than.mon || []).reduce((s, m) => s + (m.so_luong || 0), 0); return { success: true, dong: [{ ma: 'TLB', so_luong: sl, don_gia: 30000, thanh_tien: 30000 * sl }], tam_tinh: 30000 * sl, giam: [], phi_giao: 0, tong: 30000 * sl }; };
  const DON = { ma: 'TQD42', ngay: '2026-10-30T20:29:00', tong: 30000, da_tra: 0, trang_thai: null, thanh_toan: null, tien_trinh: 'cho_tra', qr: { chuoi: 'Q', het_han: '2026-10-30T20:40:00' }, tien_ve_cho_doi_soat: true, mon: [] };
  const anh = process.env.LUU_ANH_DIR;
  const chup = async (t, ten) => { if (anh) await t.screenshot({ path: path.join(anh, ten + '.png') }); };

  /** Một máy: `tre(duong, pt, than, lan)` → ms trễ của từng lượt (mặc định `treMacDinh`). */
  async function may(ten, { token = 'tok-A', gio = null, tre: treMacDinh = 100 } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.clock.install({ time: new Date('2026-10-30T20:30:00+07:00') }); await ctx.clock.resume();
    await ctx.addInitScript(({ token, gio }) => {
      if (localStorage.getItem('da_gieo')) return;
      localStorage.setItem('da_gieo', '1');
      if (token) localStorage.setItem('kh_token', token);
      localStorage.setItem('kh_ngay_man_dau', new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10));
      if (gio) localStorage.setItem('kh_gio', JSON.stringify(gio));
    }, { token, gio });
    const S = { goi: [], tre: null, dangGoi: 0, tongGoi: 0 };
    const loi = [];
    const xuLy = async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method(), auth = (req.headers().authorization || '').replace('Bearer ', '');
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      let than = null; try { than = req.postDataJSON(); } catch { /* không thân */ }
      const lan = S.goi.filter((g) => g.duong === duong && g.pt === pt).length;
      S.goi.push({ pt, duong, than, luc: Date.now() });
      await cho(S.tre ? S.tre(duong, pt, than, lan) ?? treMacDinh : treMacDinh);
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: BAY, dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(200, MENU);
      if (duong === '/chuong-trinh' || duong === '/quang-cao') return json(200, { success: true, data: [] });
      if (auth !== 'tok-A') return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/gia-han') return json(200, { success: true, token: auth, het_han: '2026-11-29T08:00:00' });
      if (duong === '/toi') return json(200, { success: true, khach: KHACH });
      if (duong === '/diem') return json(200, { success: true, points: 1250, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/don' && pt === 'GET') return json(200, { success: true, trang: 1, con_nua: false, data: [] });
      if (duong === '/don/TQD42' && pt === 'GET') return json(200, { success: true, don: DON });
      if (duong === '/gio/bao-gia') return json(200, bgCua(than));
      if (duong === '/don' && pt === 'POST') return json(400, { error: 'Quán đang bận, bạn thử lại sau', code: 'QUAN_BAN_THU' });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    };
    await ctx.route(`${URL0}/**`, async (r) => { S.dangGoi++; S.tongGoi++; try { return await xuLy(r); } finally { S.dangGoi--; } });
    const t = await ctx.newPage(); t.on('pageerror', (e) => loi.push(e.message)); t.setDefaultTimeout(6000);
    try { await chay({ t, S, ctx }); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
    k(`ca ${ten}: trang không báo lỗi JS`, loi.length === 0, loi[0]);
  }
  const doi = async (t, f, ms = 5000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await f().catch(() => false)) return true; await t.waitForTimeout(25); } return false; };
  const yen = async (t, S) => { let tong = -1, on = 0; for (let lan = 0; lan < 800 && on < 4; lan++) { await t.waitForTimeout(30); on = !S.dangGoi && S.tongGoi === tong ? on + 1 : 0; tong = S.tongGoi; } };
  const so = (t, sel) => t.locator(sel).count();
  const chu = (t, sel) => t.locator(sel).first().innerText().catch(() => '');
  const VONG = '.phone .cho-giua';
  /** Lấy mẫu `ms` mili-giây: vòng giữa màn có lúc nào hiện không. */
  const coLucHien = async (t, ms) => { const t0 = Date.now(); let co = false; while (Date.now() - t0 < ms) { if (await so(t, VONG)) co = true; await t.waitForTimeout(40); } return co; };
  const anHien = (t, an) => t.evaluate((an) => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => an }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (an ? 'hidden' : 'visible') }); document.dispatchEvent(new Event('visibilitychange')); }, an);

  await may('mo-app', { tre: 1500 }, async ({ t, S }) => {
    await t.goto(URL0 + '/trangchu'); await t.waitForSelector('.phone');
    const hien = await doi(t, async () => (await so(t, VONG)) === 1, 1400);
    await chup(t, 'trangchu_dang_tai');
    k('A2 mở App, POS chậm 1,5 s → có vòng xoay giữa màn', hien);
    const st = await t.evaluate((sel) => {
      const v = document.querySelector(sel); if (!v) return null;
      const cs = getComputedStyle(v), r = v.getBoundingClientRect(), ph = document.querySelector('.phone').getBoundingClientRect();
      const to = [...document.querySelectorAll('[class*="cho-"]')].filter((x) => { const b = x.getBoundingClientRect(); return b.width > 100 || b.height > 100; }).length;
      return { nen: cs.backgroundColor, pe: cs.pointerEvents, w: Math.round(r.width), lechX: Math.abs((r.left + r.width / 2) - (ph.left + ph.width / 2)), lechY: Math.abs((r.top + r.height / 2) - (ph.top + ph.height / 2)), to, role: v.getAttribute('role'), nhan: v.getAttribute('aria-label'), dnd: v.getAttribute('data-nd') };
    }, VONG);
    k('A2 vòng: nền trong suốt, pointer-events none, ~36 px, giữa khung .phone, không phần tử phủ', !!st && st.nen === 'rgba(0, 0, 0, 0)' && st.pe === 'none' && st.w === 36 && st.lechX < 3 && st.lechY < 3 && st.to === 0, JSON.stringify(st));
    k('A2 role=progressbar, nhãn đọc màn hình từ danh mục (data-nd khung.dangCho)', !!st && st.role === 'progressbar' && st.nhan === 'Đang tải' && st.dnd === 'khung.dangCho', JSON.stringify(st));
    const url0 = t.url();
    await t.locator('.tabbar .tab').nth(1).click({ timeout: 1000 });
    k('A2 bấm được nút trong lúc vòng hiện (không chặn bấm)', await doi(t, async () => t.url() !== url0, 1000), t.url());
    await yen(t, S);
    k('A2 hết lượt chờ → vòng ẩn', (await so(t, VONG)) === 0);
    const lan = Object.fromEntries(['/toi', '/diem', '/voucher', '/don', '/menu'].map((d) => [d, S.goi.filter((g) => g.duong === d && g.pt === 'GET').length]));
    k('C3 mở App: /toi /diem /voucher /don /menu mỗi cửa đúng MỘT lượt (như KH-NHANH-1)', Object.values(lan).every((n) => n === 1), JSON.stringify(lan));
    // quay lại App sau > 60 giây: cập nhật ngầm, màn đã có dữ liệu → không vòng
    await t.goto(URL0 + '/trangchu'); await yen(t, S);
    const truoc = S.goi.length;
    await anHien(t, true); await t.clock.fastForward('01:05'); await anHien(t, false);
    const co = await coLucHien(t, 1800);
    k('A1/D1 quay lại App sau 65 giây: có hỏi lại POS (ngầm) mà KHÔNG có vòng giữa màn', S.goi.length > truoc && !co, `${S.goi.length - truoc} lượt, vòng ${co}`);
  });

  await may('gio', { gio: [{ ma: 'TLB', so_luong: 1, ghi_chu: '' }], tre: 50 }, async ({ t, S }) => {
    S.tre = (d, pt, than, lan) => (d === '/gio/bao-gia' ? 900 : null);
    await t.goto(URL0 + '/giohang'); await t.waitForSelector('#cart');
    const dau = await doi(t, async () => /Đang tính tiền…/.test(await chu(t, '#cart .bang-tien')) && (await so(t, '#cart .bang-tien .cho-tinh .cho-xoay')) === 1, 2000);
    k('B1 Giỏ lần đầu (chưa có báo giá) → "Đang tính tiền…" + vòng nhỏ, không câu "Tổng tiền sẽ hiện"', dau && !/Tổng tiền sẽ hiện/.test(await chu(t, '#cart .bang-tien')), await chu(t, '#cart .bang-tien'));
    k('B2 Giỏ đang tính lần đầu → nút đi tiếp KHOÁ', (await t.locator('#cart .checkout-btn').getAttribute('aria-disabled')) === 'true');
    await doi(t, async () => /30\.000đ/.test(await chu(t, '#cart .summary-row.total')));
    k('B1 báo giá về → số 30.000đ, nút mở', (await t.locator('#cart .checkout-btn').getAttribute('aria-disabled')) !== 'true' && (await so(t, '#cart .bang-tien.cho-mo')) === 0);
    await t.locator('#cart .qty-ctrl button').nth(1).click();
    await t.waitForTimeout(80);
    await chup(t, 'gio_dang_tinh_lai');
    const tong = await chu(t, '#cart .summary-row.total');
    const mo = await t.evaluate(() => { const r = document.querySelector('#cart .bang-tien.cho-mo .summary-row'); return r ? Number(getComputedStyle(r).opacity) : 1; });
    k('B1 bấm + → tổng CŨ còn (30.000đ), mờ (cho-mo, opacity < 1), có vòng nhỏ trước Tổng', /30\.000đ/.test(tong) && mo < 1 && (await so(t, '#cart .summary-row.total .cho-xoay')) === 1, `${tong} · ${mo}`);
    const nut = await t.locator('#cart .checkout-btn').innerText();
    k('B2 đang tính lại → nút đi tiếp KHOÁ, KHÔNG mang số cũ', (await t.locator('#cart .checkout-btn').getAttribute('aria-disabled')) === 'true' && !/30\.000đ/.test(nut), nut);
    const moi = await doi(t, async () => /60\.000đ/.test(await chu(t, '#cart .summary-row.total')), 3000);
    k('B1/B2 báo giá mới về → 60.000đ, hết mờ, hết vòng nhỏ, nút mở với số mới', moi && (await so(t, '#cart .bang-tien.cho-mo')) === 0 && (await so(t, '#cart .bang-tien .cho-xoay')) === 0
      && (await t.locator('#cart .checkout-btn').getAttribute('aria-disabled')) !== 'true' && /60\.000đ/.test(await t.locator('#cart .checkout-btn').innerText()));
    // C2: lần đổi đầu gửi NGAY; lượt cũ về muộn không ghi đè giỏ mới
    await yen(t, S);
    S.tre = (d, pt, than) => (d === '/gio/bao-gia' ? (than.mon[0].so_luong === 3 ? 1600 : 100) : null);
    const n0 = S.goi.filter((g) => g.duong === '/gio/bao-gia').length;
    const luc = Date.now();
    await t.locator('#cart .qty-ctrl button').nth(1).click(); // → 3 (chậm)
    await doi(t, async () => S.goi.filter((g) => g.duong === '/gio/bao-gia').length > n0, 1000);
    const treGui = S.goi[S.goi.length - 1].luc - luc;
    k('C2 Giỏ: lần đổi đầu (sau khi yên) gửi báo giá NGAY (< 300 ms, không chờ 600 ms)', treGui < 300, `${treGui} ms`);
    await t.waitForTimeout(700);
    await t.locator('#cart .qty-ctrl button').nth(1).click(); // → 4 (nhanh)
    await doi(t, async () => /120\.000đ/.test(await chu(t, '#cart .summary-row.total')), 2000);
    await t.waitForTimeout(1200); // lượt "3" về muộn
    k('C2 lượt cũ về muộn (giỏ 3 ly) KHÔNG ghi đè báo giá giỏ mới (4 ly = 120.000đ)', /120\.000đ/.test(await chu(t, '#cart .summary-row.total')), await chu(t, '#cart .summary-row.total'));
  });

  await may('gio-chua-dn', { token: '', gio: [{ ma: 'TLB', so_luong: 1, ghi_chu: '' }] }, async ({ t, S }) => {
    await t.goto(URL0 + '/giohang'); await t.waitForSelector('#cart'); await yen(t, S);
    k('B1/K5 chưa đăng nhập → câu "Tổng tiền sẽ hiện…", không vòng, nút đi tiếp MỞ', /Tổng tiền sẽ hiện khi quán xác nhận/.test(await chu(t, '#cart .bang-tien')) && (await so(t, '#cart .cho-xoay')) === 0
      && (await t.locator('#cart .checkout-btn').getAttribute('aria-disabled')) !== 'true');
  });

  await may('thanh-toan', { gio: [{ ma: 'TLB', so_luong: 1, ghi_chu: '' }], tre: 50 }, async ({ t, S }) => {
    S.tre = (d, pt) => (d === '/gio/bao-gia' ? 900 : d === '/don' && pt === 'POST' ? 1200 : null);
    await t.goto(URL0 + '/thanhtoan'); await t.waitForSelector('#checkout');
    const dau = await doi(t, async () => /Đang tính tiền…/.test(await chu(t, '#checkout .bang-tien')), 2000);
    k('B1/B2 Thanh toán chưa có báo giá → "Đang tính tiền…", nút Đặt KHOÁ', dau && (await t.locator('#checkout .nut-dat').getAttribute('aria-disabled')) === 'true');
    await doi(t, async () => (await t.locator('#checkout .nut-dat').getAttribute('aria-disabled')) !== 'true');
    await t.locator('#checkout .nut-dat').click();
    const vong = await doi(t, async () => (await so(t, '#checkout .nut-dat .cho-xoay.trang')) === 1, 1000);
    await chup(t, 'thanh_toan_dang_gui');
    k('B3 Đặt đơn đang gửi → nút có vòng nhỏ trắng trước chữ', vong && /Đang gửi/.test(await chu(t, '#checkout .nut-dat')));
    await doi(t, async () => /Quán đang bận/.test(await chu(t, '#checkout')), 3000);
    k('B3 POS trả lỗi → hết vòng trên nút', (await so(t, '#checkout .nut-dat .cho-xoay')) === 0);
  });

  await may('theo-doi', { tre: 700 }, async ({ t, S }) => {
    await t.goto(URL0 + '/don/TQD42'); await t.waitForSelector('.phone');
    await doi(t, async () => (await so(t, '.the-qr svg')) > 0, 4000);
    await yen(t, S);
    const n0 = S.goi.filter((g) => g.duong === '/don/TQD42').length;
    const co = await coLucHien(t, 7000);
    const n1 = S.goi.filter((g) => g.duong === '/don/TQD42').length;
    k('A1 Theo dõi đơn hỏi lại mỗi 3 s (chờ QR) → KHÔNG có vòng giữa màn', n1 - n0 >= 2 && !co, `${n1 - n0} lượt, vòng ${co}`);
  });

  await trinh.close();
}
