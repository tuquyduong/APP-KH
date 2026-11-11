#!/usr/bin/env node
// THỬ KH-UI-5g — ánh sáng lướt như demo: dải quảng cáo các trang (kiểu A) + banner "Hôm nay" Trang chủ LUÔN có + lời chào gọi theo tên.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần (tachBieuTuong, chonQuangCao, loiChao) + đọc nguồn.
// Phần 2: App thật trong Chromium (Playwright; không có / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca): POS giả bằng page.route, đồng hồ giả 8.11.2026 09:00 giờ VN.
// Chạy: node cong_cu/thu_KHUI5g.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href).catch(() => null);
const doc = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const duyet = (d) => fs.readdirSync(path.join(GOC, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? duyet(path.join(d, e.name)) : /\.(js|jsx)$/.test(e.name) ? [path.join(d, e.name)] : []));

(async () => {
  const QC = await nap('src/quangCao.js'), DD = await nap('src/dinhDang.js');
  const GV = (o = {}) => ({ dang_chay: true, bat_dau: '2026-11-08T08:00:00', ket_thuc: '2026-11-08T10:00:00', phan_tram: 30, mon: ['M1'], ...o });
  const BAY = '2026-11-08 09:00:00';
  const chon = (o) => (QC ? QC.chonQuangCao({ gioVang: null, chuongTrinh: [], bayGio: BAY, quangCao: [], ...o }) : undefined);
  const CT = [{ ma: 'c1', ten: 'Quà sinh nhật', moTa: 'Tặng 1 ly cho khách sinh nhật', loai: 'sinh_nhat' }, { ma: 'c2', ten: 'Học sinh giỏi', moTa: '', loai: 'hoc_sinh_gioi' }];

  console.log('B1 — tachBieuTuong (hàm thuần)');
  const tb = QC && QC.tachBieuTuong;
  k('B1 "⏰ Giờ vàng: giảm 30%" → { ⏰, "Giờ vàng: giảm 30%" }', !!tb && bang(tb('⏰ Giờ vàng: giảm 30%'), { bieuTuong: '⏰', chu: 'Giờ vàng: giảm 30%' }));
  k('B1 "🎁 Quà sinh nhật" → { 🎁, "Quà sinh nhật" }; chuỗi POS gửi có khoảng trắng đầu vẫn tách', !!tb && bang(tb('🎁 Quà sinh nhật'), { bieuTuong: '🎁', chu: 'Quà sinh nhật' }) && bang(tb('  🎁  Quà sinh nhật '), { bieuTuong: '🎁', chu: 'Quà sinh nhật' }));
  k('B1 không có emoji ở đầu → bieuTuong rỗng, chữ giữ nguyên (emoji giữa câu không tách)', !!tb && bang(tb('Mua 2 tặng 1'), { bieuTuong: '', chu: 'Mua 2 tặng 1' }) && bang(tb('Mua 2 🎁 tặng 1'), { bieuTuong: '', chu: 'Mua 2 🎁 tặng 1' }));
  k('B1 emoji ghép (ZWJ, có FE0F, có sắc da) tách đủ một khối', !!tb && tb('👨‍👩‍👧 Gia đình').bieuTuong === '👨‍👩‍👧' && tb('❤️ Yêu thích').bieuTuong === '❤️' && tb('👍🏽 Tốt').bieuTuong === '👍🏽' && tb('👍🏽 Tốt').chu === 'Tốt');
  k('B1 rỗng / null / không phải chuỗi không vỡ', !!tb && bang(tb(''), { bieuTuong: '', chu: '' }) && bang(tb(null), { bieuTuong: '', chu: '' }) && bang(tb(undefined), { bieuTuong: '', chu: '' }));

  console.log('C2 — chonQuangCao: tiêu đề / dòng phụ / nút / đích cho 4 trường hợp (thứ tự giữ nguyên)');
  const R = (o) => ({ chu_dai: '🎉 Mua 2 tặng 1 Trà Đông Y', dich: 'menu', ma_mon: '', tu_gio: '', den_gio: '', uu_tien: 0, ...o });
  const p1 = chon({ gioVang: GV(), chuongTrinh: CT, quangCao: [R({ tu_gio: '08:00', den_gio: '12:00' })] });
  k('C2.1 dòng POS hợp giờ thắng Giờ vàng + chương trình: tiêu đề = chữ POS (bỏ emoji đầu), dải giữ nguyên chuỗi, nút "Xem ›", đích menu', !!p1 && p1.tieuDe === 'Mua 2 tặng 1 Trà Đông Y' && p1.chu === '🎉 Mua 2 tặng 1 Trà Đông Y' && p1.nut === 'Xem ›' && p1.dich === 'menu' && !p1.macDinh, JSON.stringify(p1));
  const p1b = chon({ quangCao: [R({ dich: '' })] });
  k('C2.1 dòng POS không có đích → không nút, đích rỗng', !!p1b && p1b.nut === '' && p1b.dich === '' && p1b.tieuDe === 'Mua 2 tặng 1 Trà Đông Y', JSON.stringify(p1b));
  const g = chon({ gioVang: GV(), chuongTrinh: CT });
  k('C2.2 Giờ vàng ĐANG chạy: tiêu đề "Giờ vàng: giảm 30%", phụ "Đến 10:00 hôm nay", nút "Xem Menu ›", đích menu; dải "⏰ Giờ vàng: giảm 30% đến 10:00"', !!g && g.tieuDe === 'Giờ vàng: giảm 30%' && g.phu === 'Đến 10:00 hôm nay' && g.nut === 'Xem Menu ›' && g.dich === 'menu' && g.chu === '⏰ Giờ vàng: giảm 30% đến 10:00' && !g.macDinh, JSON.stringify(g));
  const gr = chon({ gioVang: GV(), quangCao: [R({ id: 'gio_vang', chu_dai: '⏰ Giờ vàng −30% hôm nay' })] });
  k('C2.2 dòng POS id="gio_vang" khi Giờ vàng đang chạy: tiêu đề = chữ POS (bỏ emoji), vẫn phụ + nút Giờ vàng, đích menu', !!gr && gr.tieuDe === 'Giờ vàng −30% hôm nay' && gr.chu === '⏰ Giờ vàng −30% hôm nay' && gr.phu === 'Đến 10:00 hôm nay' && gr.nut === 'Xem Menu ›' && gr.dich === 'menu', JSON.stringify(gr));
  const c = chon({ chuongTrinh: CT });
  k('C2.3 chương trình đặc biệt (cái đầu): tiêu đề = tên, phụ = mô tả, nút "Xem ưu đãi ›", đích uudai; dải "🎁 Quà sinh nhật"', !!c && c.tieuDe === 'Quà sinh nhật' && c.phu === 'Tặng 1 ly cho khách sinh nhật' && c.nut === 'Xem ưu đãi ›' && c.dich === 'uudai' && c.chu === '🎁 Quà sinh nhật' && !c.macDinh, JSON.stringify(c));
  const c2 = chon({ chuongTrinh: [CT[1]] });
  k('C2.3 chương trình không mô tả → dòng phụ rỗng (không hiện)', !!c2 && c2.phu === '' && c2.tieuDe === 'Học sinh giỏi', JSON.stringify(c2));
  const m = chon({});
  k('C2.4 không có gì: chữ mặc định trong danh mục — "Hôm nay bạn muốn uống gì?", nút "Xem Menu ›", đích menu, macDinh = true, dải rỗng', !!m && m.tieuDe === 'Hôm nay bạn muốn uống gì?' && m.phu === '' && m.nut === 'Xem Menu ›' && m.dich === 'menu' && m.macDinh === true && m.chu === '', JSON.stringify(m));
  k('C2 thứ tự giữ nguyên: Giờ vàng đã hết khung → rơi xuống chương trình; sắp tới → coi như không có', (chon({ gioVang: GV({ ket_thuc: '2026-11-08T08:30:00' }), chuongTrinh: CT }) || {}).dich === 'uudai' && (chon({ gioVang: GV({ dang_chay: false, bat_dau: '2026-11-08T20:00:00', ket_thuc: '2026-11-08T22:00:00' }) }) || {}).macDinh === true);

  k('C2 khoá /admin của từng chữ banner: khung câu có khoá riêng (qc.gv.tieuDe / qc.gv.phu / qc.gv.nut / qc.ct.nut / qc.xem / today.*), chỉ phần chữ POS là "qc.pos"', !!g && !!c && !!m && !!p1 && bang(g.khoa, { t: 'qc.gv.tieuDe', s: 'qc.gv.phu', nut: 'qc.gv.nut' }) && bang(c.khoa, { t: 'qc.pos', s: 'qc.pos', nut: 'qc.ct.nut' }) && bang(m.khoa, { t: 'today.t', s: 'today.s', nut: 'today.cta' }) && bang(p1.khoa, { t: 'qc.pos', s: 'qc.pos', nut: 'qc.xem' }) && gr.khoa.t === 'qc.pos' && gr.khoa.nut === 'qc.gv.nut');
  const pe = chon({ quangCao: [R({ chu_dai: '🎁' })] });
  k('K5 dòng POS chỉ có emoji → tiêu đề banner không rỗng', !!pe && pe.tieuDe === '🎁', JSON.stringify(pe));

  console.log('D1 — lời chào gọi theo tên');
  const lc = (gio, xh, ten) => (DD ? DD.loiChao(gio, xh, ten) : undefined);
  const CHIEU = '2026-11-11T15:00:00';
  k('D1 "anh" + "Anh Linh" → "Chào buổi chiều, anh Linh!"', lc(CHIEU, 'anh', 'Anh Linh') === 'Chào buổi chiều, anh Linh!', lc(CHIEU, 'anh', 'Anh Linh'));
  k('D1 "chị" + "Nguyễn Thị Linh" → "chị Linh"', lc(CHIEU, 'chị', 'Nguyễn Thị Linh') === 'Chào buổi chiều, chị Linh!', lc(CHIEU, 'chị', 'Nguyễn Thị Linh'));
  k('D1 không xưng hô → giữ tên đủ như cũ ("Chào Nguyễn Linh!"); không có gì → "Chào bạn!"', lc('', null, 'Nguyễn Linh') === 'Chào Nguyễn Linh!' && lc('', '', '') === 'Chào bạn!' && lc(null, null, null) === 'Chào bạn!');
  k('D1 có xưng hô mà chưa có tên → chỉ xưng hô; tên một từ vẫn như cũ; khoảng trắng thừa gộp', lc(CHIEU, 'chị', '') === 'Chào buổi chiều, chị!' && lc(CHIEU, 'cô', 'Hoa') === 'Chào buổi chiều, cô Hoa!' && lc(CHIEU, 'anh', '  Lê   Nam ') === 'Chào buổi chiều, anh Nam!');

  console.log('A/B/C — đọc nguồn');
  const toanBo = duyet('src');
  const dem = (re) => toanBo.reduce((n, f) => n + (doc(f).match(re) || []).length, 0);
  const hook = doc('src/components/anhSangLuot.js'), bn = doc('src/components/BannerHomNay.jsx'), dq = doc('src/components/DaiQuangCao.jsx');
  k('A1 hook dungAnhSangLuot trong src/components/anhSangLuot.js: đặt --W --H --ox --oy --w --h, ResizeObserver (không có thì resize)', /export function dungAnhSangLuot\(/.test(hook) && ['--W', '--H', '--ox', '--oy', '--w', '--h'].every((x) => hook.includes(`'${x}'`)) && /ResizeObserver/.test(hook) && /'resize'/.test(hook));
  k('A1 chỉ MỘT chỗ đặt --ox trong cả src (không còn đoạn đo thứ hai)', dem(/'--ox'/g) === 1, 'số chỗ: ' + dem(/'--ox'/g));
  k('A1 BannerHomNay và DaiQuangCao cùng dùng hook', /dungAnhSangLuot\(/.test(bn) && /dungAnhSangLuot\(/.test(dq) && /from '\.\/anhSangLuot\.js'/.test(bn + dq));
  k('B1 DaiQuangCao: .gl-a + nhãn gl-t + chữ gl-t + nút gl-b; biểu tượng tách bằng tachBieuTuong, đứng riêng', /gl gl-a/.test(dq) && (dq.match(/gl gl-t/g) || []).length >= 2 && /gl gl-b/.test(dq) && /tachBieuTuong\(/.test(dq) && /dai-qc-bt/.test(dq));
  const css = doc('src/giaoDien/dai_quang_cao.css');
  k('B2 CSS dải: cao 40px, lề 12px 18px 0, bo 12px, nền gradient 125deg 3 màu, bóng, nhịp 2s của demo (không còn 3.5s)', /height:40px/.test(css) && /margin:12px 18px 0/.test(css) && /border-radius:12px/.test(css) && /linear-gradient\(125deg,#8E1B4C 0%,#B2365F 55%,#C8784A 100%\)/.test(css) && /box-shadow:0 4px 12px rgba\(142,27,76,\.22\)/.test(css) && !/3\.5s/.test(css));
  k('B2 CSS dải: nhãn #F6D57E/#FFFFFF, chữ #F8EAF0/#FFE7A6 12.5px đậm, quầng color-dodge 255,238,200,.55 / 255,246,222,.7 không bo tròn, nút #FDE69B/#7A2647 11.5px 5px 9px bo 9px', ['--c:#F6D57E; --hi:#FFFFFF', '--c:#F8EAF0; --hi:#FFE7A6', 'font-size:12.5px', 'mix-blend-mode:color-dodge', 'rgba(255,238,200,.55)', 'rgba(255,246,222,.7)', 'background:#FDE69B; color:#7A2647', 'font-size:11.5px', 'padding:5px 9px', 'border-radius:9px'].every((x) => css.includes(x)) && /\.dai-qc \.gl-a\{ border-radius:0/.test(css));
  const tc = doc('src/pages/TrangChu.jsx'), ap = doc('src/App.jsx'), cc = doc('src/noiDung/nd/trangChu.js');
  k('C1 Trang chủ không còn hero-banner; luôn vẽ BannerHomNay (không điều kiện chữ today.t)', !/hero-banner/.test(tc) && /<BannerHomNay /.test(tc) && !/homNay\.tieuDe \?/.test(tc));
  k('C1 các khoá chỉ hero-banner dùng (home.banner / home.bk / home.bh / home.bb) đã bỏ khỏi màn và danh mục', !/home\.(banner|bk|bh|bb)['"]/.test(toanBo.map(doc).join('\n')));
  k('C2 chonQuangCao tính MỘT lần ở App (một lời gọi), đưa xuống cả dải và Trang chủ', (ap.match(/chonQuangCao\(/g) || []).length === 1 && /<DaiQuangCao /.test(ap) && /quangCao=\{quangCaoTho\}/.test(ap));
  const kc = doc('src/noiDung/nd/khungChung.js');
  k('C2 khoá nhóm dải ở khungChung.js (khung câu dùng chung dải + banner); nhãn HÔM NAY MỘT khoá today.k; chữ POS là mục khoá "pos"', ['qc.xem', 'qc.dai.gv', 'qc.dai.ct', 'qc.gv.tieuDe', 'qc.gv.phu', 'qc.gv.nut', 'qc.ct.nut'].every((x) => kc.includes(`'${x}'`)) && /khoa\('qc\.pos'[^)]*'pos'/.test(kc) && /today\.k/.test(dq) && /today\.k/.test(bn) && !/'HÔM NAY'/.test(dq));
  const ND = await nap('src/noiDung/nd.js'), DM = await nap('src/noiDung/nd/index.js');
  const loi = ND && DM ? ND.kiemDanhMuc(DM.DANH_MUC || []) : ['không nạp được danh mục'];
  k('E4 danh mục hợp lệ (kiemDanhMuc) sau khi thêm khoá qc.* và bỏ home.b*', loi.length === 0, loi.slice(0, 3).join(' | '));
  k('K9 CSS dải: mọi màu #hex có trong demo', (css.match(/#[0-9A-Fa-f]{6}\b/g) || []).every((h) => doc('src/giaoDien/demo_1.css').toLowerCase().includes(h.toLowerCase()) || doc('src/giaoDien/demo_2.css').toLowerCase().includes(h.toLowerCase())));
  k('A2 không sửa CSS chép từ demo: demo_1.css / demo_2.css còn luật .fx-a .gl-t, .gl-a, prefers-reduced-motion', /\.fx-a \.gl-t\{/.test(doc('src/giaoDien/demo_1.css')) && /\.fx-a \.gl-a\{/.test(doc('src/giaoDien/demo_2.css')) && /prefers-reduced-motion/.test(doc('src/giaoDien/demo_2.css')));

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET !== '1') { try { pw = require('playwright'); } catch { /* không có */ } } // CLAUDE.md §9
  if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này (hoặc KHONG_TRINH_DUYET=1) — các ca trình duyệt CHƯA chạy');
  else await trinhDuyet(pw);

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, outdir: path.join(GOC, '.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
    loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles;
  const goi = kq.find((f) => f.path.endsWith('.js')).text, css = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text;
  const html = doc('index.html').replace(/<script type="module" src="\/src\/main.jsx"><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  const LM = await nap('src/luuMay.js');
  const SDT = '0901234567', GOC_URL = 'http://kh.test';
  const trinh = await pw.chromium.launch();
  const MOC_GIO = '2026-11-08T02:00:00Z'; // = 09:00 ngày 8.11.2026 giờ VN
  const GV_CHAY = { success: true, dang_chay: true, bat_dau: '2026-11-08T08:00:00', ket_thuc: '2026-11-08T10:00:00', phan_tram: 30, mon: ['M1'] };
  const GV_TAT = { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] };
  const CT = [{ ma: 'c1', ten: 'Quà sinh nhật', mo_ta: 'Tặng 1 ly cho khách sinh nhật', loai: 'sinh_nhat' }];

  async function ca(ten, { rong = 390, gv = GV_CHAY, ct = [], token = false, giam = false } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, reducedMotion: giam ? 'reduce' : 'no-preference' });
    const t = await ctx.newPage(), loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } }, { luu: token ? { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT) } : {} });
    await t.clock.install({ time: new Date(MOC_GIO) });
    await t.route(`${GOC_URL}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Anh Linh', xung_ho: 'anh', ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      if (p === '/api/kh/gio-vang') return json(200, gv);
      if (p === '/api/kh/chuong-trinh') return json(200, { success: true, data: ct });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    try { await chay(t, loi); } catch (e) { k(`[${ten}] ca dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
  }
  const mo = async (t, duong) => { await t.goto(GOC_URL + duong); await t.waitForSelector('.phone'); };
  const doc1 = (t) => t.evaluate(() => {
    const e = document.querySelector('.today.fx-a');
    return e ? { t: e.querySelector('b')?.textContent, s: e.querySelector('.t-s')?.textContent || '', cta: e.querySelector('.t-cta')?.textContent || '', k: e.querySelector('.t-k')?.textContent, hero: !!document.querySelector('.hero-banner') } : null;
  });

  for (const [tenCa, o, mong] of [
    ['Giờ vàng', { gv: GV_CHAY, ct: CT }, { t: 'Giờ vàng: giảm 30%', s: 'Đến 10:00 hôm nay', cta: 'Xem Menu ›', di: '/menu' }],
    ['chương trình', { gv: GV_TAT, ct: CT }, { t: 'Quà sinh nhật', s: 'Tặng 1 ly cho khách sinh nhật', cta: 'Xem ưu đãi ›', di: '/uudai' }],
    ['không có gì', { gv: GV_TAT, ct: [] }, { t: 'Hôm nay bạn muốn uống gì?', s: '', cta: 'Xem Menu ›', di: '/menu' }],
  ]) {
    for (const dn of [false, true]) {
      await ca(`${tenCa} ${dn ? 'đã' : 'chưa'} đăng nhập`, { ...o, token: dn }, async (t, loi) => {
        await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a');
        await t.waitForFunction((x) => document.querySelector('.today.fx-a b')?.textContent === x, mong.t, { timeout: 4000 }).catch(() => {});
        const x = await doc1(t);
        k(`E1 Trang chủ (${tenCa}, ${dn ? 'đã' : 'chưa'} đăng nhập): banner .today.fx-a đúng chữ, KHÔNG có .hero-banner`, !!x && x.t === mong.t && x.s === mong.s && x.cta === mong.cta && x.k === 'HÔM NAY' && !x.hero, JSON.stringify(x));
        if (!dn) {
          await t.locator('.today.fx-a').click();
          await t.waitForFunction((d) => location.pathname === d, mong.di, { timeout: 4000 }).catch(() => {});
          k(`E1 bấm banner (${tenCa}) → đúng đích ${mong.di}`, new URL(t.url()).pathname === mong.di, t.url());
        }
        if (dn && tenCa === 'không có gì') {
          const h1 = await t.locator('h1').first().textContent();
          k('D1 Chromium: tên tài khoản "Anh Linh" + xưng hô anh → lời chào gọi "anh Linh"', /^Chào( buổi [^,]+,)? anh Linh!$/.test(h1 || ''), h1);
        }
        k(`E1 [${tenCa}] không lỗi trang`, loi.length === 0, loi.join(' | '));
      });
    }
  }

  await ca('dải Menu', {}, async (t, loi) => {
    await mo(t, '/menu'); await t.locator('.dai-qc').waitFor();
    await t.waitForTimeout(300);
    const x = await t.evaluate(() => {
      const d = document.querySelector('.dai-qc'), r = d.getBoundingClientRect(), gls = [...d.querySelectorAll('.gl')];
      const sang = d.querySelector('.gl-a'), bt = d.querySelector('.dai-qc-bt');
      return {
        h: r.height, nhieu: gls.length,
        thieu: gls.filter((e) => !(e.style.getPropertyValue('--ox') !== '' && e.style.getPropertyValue('--oy') !== '' && e.style.getPropertyValue('--w') !== '' && e.style.getPropertyValue('--h') !== '')).length,
        gl: gls.map((e) => [...e.classList].find((c) => /^gl-/.test(c))),
        rongSang: sang ? sang.getBoundingClientRect().width : -1, rongDai: r.width,
        btNgoai: !!bt && !bt.closest('.gl-t') && bt.textContent === '⏰', chu: d.querySelector('.dai-qc-chu')?.textContent, nut: d.querySelector('.gl-b')?.textContent,
        anim: getComputedStyle(d).animationName,
      };
    });
    k('E1 dải Menu: có đủ gl-a + gl-t (nhãn, chữ) + gl-b; cao 40px', x.gl.includes('gl-a') && x.gl.filter((c) => c === 'gl-t').length >= 2 && x.gl.includes('gl-b') && Math.abs(x.h - 40) <= 1, JSON.stringify(x));
    k('E1 dải Menu: mỗi .gl có --ox --oy --w --h khác rỗng; .gl-a rộng bằng dải', x.nhieu >= 4 && x.thieu === 0 && Math.abs(x.rongSang - x.rongDai) <= 1, JSON.stringify(x));
    k('E1 dải Menu: biểu tượng ⏰ đứng riêng NGOÀI lớp chữ loé; chữ không còn emoji; nút "Xem ›"', x.btNgoai && x.chu === 'Giờ vàng: giảm 30% đến 10:00' && x.nut === 'Xem ›', JSON.stringify(x));
    const p1 = await t.evaluate(() => getComputedStyle(document.querySelector('.dai-qc')).getPropertyValue('--p'));
    await t.waitForTimeout(500);
    const p2 = await t.evaluate(() => getComputedStyle(document.querySelector('.dai-qc')).getPropertyValue('--p'));
    k('E1 dải Menu: vệt sáng chạy — --p của .fx-a đổi giữa hai lần đọc cách 500 ms', p1 !== '' && p2 !== '' && p1 !== p2, `${p1} → ${p2}`);
    await t.locator('.dai-qc').click();
    await t.waitForFunction(() => location.pathname === '/menu', null, { timeout: 2000 }).catch(() => {});
    k('E1 bấm dải (Giờ vàng) → vẫn đúng Menu; không lỗi trang', new URL(t.url()).pathname === '/menu' && loi.length === 0, t.url() + ' ' + loi.join('|'));
  });
  await ca('Trang chủ vệt sáng', {}, async (t) => {
    await mo(t, '/trangchu'); await t.locator('.today.fx-a').waitFor(); await t.waitForTimeout(300);
    const p1 = await t.evaluate(() => getComputedStyle(document.querySelector('.today.fx-a')).getPropertyValue('--p'));
    await t.waitForTimeout(500);
    const p2 = await t.evaluate(() => getComputedStyle(document.querySelector('.today.fx-a')).getPropertyValue('--p'));
    const o = await t.evaluate(() => ({ ox: [...document.querySelectorAll('.today .gl')].every((e) => e.style.getPropertyValue('--ox') !== ''), nut: document.querySelector('.today .gl-b') !== null }));
    k('E1 Trang chủ: vệt sáng chạy (--p đổi sau 500 ms); mọi .gl có --ox; có nút gl-b', p1 !== '' && p1 !== p2 && o.ox && o.nut, `${p1} → ${p2} ${JSON.stringify(o)}`);
  });
  await ca('giảm chuyển động', { giam: true }, async (t) => {
    await mo(t, '/menu'); await t.locator('.dai-qc').waitFor();
    const a = await t.evaluate(() => getComputedStyle(document.querySelector('.dai-qc')).animationName);
    await t.goto(GOC_URL + '/trangchu'); await t.locator('.today.fx-a').waitFor();
    const b = await t.evaluate(() => getComputedStyle(document.querySelector('.today.fx-a')).animationName);
    k('A2 prefers-reduced-motion: reduce → animation-name none ở dải và banner', a === 'none' && b === 'none', `${a} / ${b}`);
  });
  await trinh.close();
}
