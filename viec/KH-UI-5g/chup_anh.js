#!/usr/bin/env node
// Chụp ảnh KH-UI-5g (E3) bằng Chromium + Playwright có sẵn, cỡ 360 / 390 / 430 × 844, đồng hồ giả 11.11.2026 15:00 giờ VN (lời chào "buổi chiều").
// Lưu viec/KH-UI-5g/so_anh/:
//  · <rộng>_trangchu_{chuongtrinh,giovang,macdinh}_chua.png  — Trang chủ chưa đăng nhập; <rộng>_trangchu_macdinh_da.png — đã đăng nhập (tên "Anh Linh", anh → "anh Linh")
//  · <rộng>_banner_{demo,app,lech}.png — banner "Hôm nay": DEMO (todayCard, tắt chuyển động) ↔ APP (tắt chuyển động) + ảnh tô chỗ lệch (đỏ)
//  · <rộng>_menu_dai_t0.png / _t1.png — Menu có dải, hai khung hình cách ~0,7 s (vệt sáng đi qua chữ)
// 390 chụp ở độ nét ×2 để người xem; 360 / 430 ở ×1. Chạy: node viec/KH-UI-5g/chup_anh.js
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..', '..');
const RA = path.join(__dirname, 'so_anh');
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const MOC = new Date('2026-11-11T08:00:00Z'); // 15:00 giờ VN

(async () => {
  const pw = require('playwright'), esbuild = require('esbuild');
  const LM = await import(pathToFileURL(path.join(GOC, 'src/luuMay.js')).href);
  fs.mkdirSync(RA, { recursive: true });
  const kq = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, outdir: path.join(GOC, '.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
    loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles;
  const goi = kq.find((f) => f.path.endsWith('.js')).text, css = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text;
  const html = doc('index.html').replace(/<script type="module" src="\/src\/main.jsx"><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  const SDT = '0901234567', URL0 = 'http://kh.test';
  const GV_CHAY = { success: true, dang_chay: true, bat_dau: '2026-11-11T14:00:00', ket_thuc: '2026-11-11T17:00:00', phan_tram: 30, mon: ['M1'] };
  const GV_TAT = { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] };
  const CT = [{ ma: 'c1', ten: 'Quà sinh nhật', mo_ta: 'Tặng 1 ly cho khách sinh nhật', loai: 'sinh_nhat' }];
  const trinh = await pw.chromium.launch();

  async function moApp(rong, { gv = GV_TAT, ct = [], dangNhap = false, giam = false } = {}) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, deviceScaleFactor: rong === 390 ? 2 : 1, reducedMotion: giam ? 'reduce' : 'no-preference' });
    const t = await ctx.newPage();
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } },
      { luu: dangNhap ? { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT) } : {} });
    await t.clock.install({ time: MOC });
    await t.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (p.startsWith('/anh/') || p.startsWith('/fonts/')) { const f = path.join(GOC, 'public', p); return fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 204, body: '' }); }
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Anh Linh', xung_ho: 'anh', ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      if (p === '/api/kh/gio-vang') return json(200, gv);
      if (p === '/api/kh/chuong-trinh') return json(200, { success: true, data: ct });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    return { ctx, t };
  }
  const vaoTrang = async (t, duong, sel) => {
    await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await t.waitForSelector(sel);
    const boQua = t.getByText('Bỏ qua'); if (await boQua.count()) await boQua.first().click();
    await t.waitForTimeout(700);
  };
  const dau = (t, ten) => t.screenshot({ path: path.join(RA, ten), clip: { x: 0, y: 0, width: t.viewportSize().width, height: 560 } });

  for (const rong of [360, 390, 430]) {
    for (const [ten, o] of [['chuongtrinh', { ct: CT }], ['giovang', { gv: GV_CHAY }], ['macdinh', {}]]) {
      const { ctx, t } = await moApp(rong, o);
      await vaoTrang(t, '/trangchu', '.today.fx-a'); await dau(t, `${rong}_trangchu_${ten}_chua.png`); await ctx.close();
    }
    { const { ctx, t } = await moApp(rong, { dangNhap: true });
      await vaoTrang(t, '/trangchu', '.today.fx-a'); await dau(t, `${rong}_trangchu_macdinh_da.png`); await ctx.close(); }
    { const { ctx, t } = await moApp(rong, { gv: GV_CHAY });
      await vaoTrang(t, '/menu', '.dai-qc');
      const hop = await t.locator('.dai-qc').boundingBox();
      const clip = { x: 0, y: Math.max(0, hop.y - 6), width: rong, height: hop.height + 12 };
      await t.screenshot({ path: path.join(RA, `${rong}_menu_dai_t0.png`), clip }); await t.waitForTimeout(700);
      await t.screenshot({ path: path.join(RA, `${rong}_menu_dai_t1.png`), clip }); await ctx.close(); }
    // Banner: App ↔ Demo (tắt chuyển động cho cả hai để so tĩnh)
    { const { ctx, t } = await moApp(rong, { giam: true });
      await vaoTrang(t, '/trangchu', '.today.fx-a'); await t.locator('#todayHome').screenshot({ path: path.join(RA, `${rong}_banner_app.png`) }); await ctx.close(); }
    { const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, deviceScaleFactor: rong === 390 ? 2 : 1, reducedMotion: 'reduce' });
      const t = await ctx.newPage(); await t.clock.install({ time: MOC });
      await t.goto(pathToFileURL(path.join(GOC, 'thiet_ke/app_kh_demo.html')).href); await t.waitForTimeout(600);
      const boQua = t.getByText('Bỏ qua'); if (await boQua.count()) await boQua.first().click();
      await t.waitForTimeout(800);
      await t.locator('#todayHome').screenshot({ path: path.join(RA, `${rong}_banner_demo.png`) }); await ctx.close(); }
  }

  // Ảnh tô chỗ lệch (đỏ) bằng canvas trong Chromium (cắt theo cỡ nhỏ hơn của hai ảnh)
  const t = await (await trinh.newContext()).newPage();
  for (const rong of [360, 390, 430]) {
    const a = fs.readFileSync(path.join(RA, `${rong}_banner_app.png`)).toString('base64'), d = fs.readFileSync(path.join(RA, `${rong}_banner_demo.png`)).toString('base64');
    const r = await t.evaluate(async ({ a, d }) => {
      const tai = (b) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + b; });
      const [x, y] = await Promise.all([tai(a), tai(d)]);
      const W = Math.min(x.width, y.width), H = Math.min(x.height, y.height);
      const lay = (i) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, W, H); };
      const px = lay(x), py = lay(y), c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), ra = g.createImageData(W, H);
      let khac = 0;
      for (let i = 0; i < px.data.length; i += 4) {
        const dl = Math.abs(px.data[i] - py.data[i]) + Math.abs(px.data[i + 1] - py.data[i + 1]) + Math.abs(px.data[i + 2] - py.data[i + 2]);
        if (dl > 48) { khac++; ra.data[i] = 255; ra.data[i + 1] = 0; ra.data[i + 2] = 0; ra.data[i + 3] = 255; } else { const l = (px.data[i] + px.data[i + 1] + px.data[i + 2]) / 3; ra.data[i] = ra.data[i + 1] = ra.data[i + 2] = 200 + l / 6; ra.data[i + 3] = 255; }
      }
      g.putImageData(ra, 0, 0);
      return { png: c.toDataURL('image/png').split(',')[1], phanTram: Math.round((khac / (W * H)) * 1000) / 10, app: [x.width, x.height], demo: [y.width, y.height] };
    }, { a, d });
    fs.writeFileSync(path.join(RA, `${rong}_banner_lech.png`), Buffer.from(r.png, 'base64'));
    console.log(`${rong} banner: khác ${r.phanTram}% điểm ảnh; app ${r.app} demo ${r.demo}`);
  }
  await trinh.close();
})().catch((e) => { console.error(e); process.exit(1); });
