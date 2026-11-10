#!/usr/bin/env node
// Chụp ảnh KH-UI-5e (E3) bằng Chromium + Playwright có sẵn: cặp ảnh DEMO (thiet_ke/app_kh_demo.html, patch39) ↔ APP THẬT, cùng cỡ 360 / 390 / 430 × 844, cùng dữ liệu mẫu
// (người thân và thông tin Tín chủ chép từ demo TL.ppl / TL.vkInfo), đồng hồ giả 10.11.2026 09:00 giờ VN cho cả hai. Lưu viec/KH-UI-5e/so_anh/<rộng>_<màn>_{demo,app,lech}.png
// (lech = ảnh tô chỗ khác nhau, đỏ). 390 chụp ở độ nét ×2 để người xem; 360 / 430 ở ×1 cho nhẹ kho. Chạy: node viec/KH-UI-5e/chup_anh.js
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..', '..');
const RA = path.join(__dirname, 'so_anh');
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const MOC = new Date('2026-11-10T02:00:00Z');

// Dữ liệu mẫu của demo (TL.ppl, TL.vkInfo): Mẹ 28/10 dương (sinh 1958), Ông nội giỗ 12/10 âm, Con trai 5/12 (sinh 2006), Minh Anh 20/9 âm.
const NGUOI = [
  { id: 'p1', loai: 'sn', ten: 'Mẹ', cal: 'duong', d: 28, m: 10, nam: 1958, nhac: -240 },
  { id: 'p2', loai: 'gio', ten: 'Ông nội', cal: 'am', d: 12, m: 10, nam: null, nhac: -3840 },
  { id: 'p3', loai: 'sn', ten: 'Con trai', cal: 'duong', d: 5, m: 12, nam: 2006, nhac: -240 },
  { id: 'p4', loai: 'sn', ten: 'Minh Anh', cal: 'am', d: 20, m: 9, nam: null, nhac: 480 },
];
const KE = { v: 1, viec: [], leNhac: { 'Phụ nữ Việt Nam': true, 'Nhà giáo Việt Nam': true, 'Tết Nguyên đán': true, 'Tết Trung thu': true }, nguoi: NGUOI,
  vk: { ten: 'Nguyễn Thị Linh', ho: 'Nguyễn', dc: '123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh', nm: '', fs: 17, tick: {}, nhac: { r: true, tao: true } } };

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
  const trinh = await pw.chromium.launch();

  async function moApp(rong, xung) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, deviceScaleFactor: rong === 390 ? 2 : 1 });
    const t = await ctx.newPage();
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } },
      { luu: { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT), kh_kehoach: JSON.stringify(KE) } });
    await t.clock.install({ time: MOC });
    await t.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (p.startsWith('/anh/') || p.startsWith('/fonts/')) { const f = path.join(GOC, 'public', p); return fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 204, body: '' }); }
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Nguyễn Thị Linh', xung_ho: xung, ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      if (p === '/api/kh/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (p === '/api/kh/chuong-trinh') return json(200, { success: true, data: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    return { ctx, t };
  }
  async function moDemo(rong) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, deviceScaleFactor: rong === 390 ? 2 : 1 });
    const t = await ctx.newPage();
    await t.clock.install({ time: MOC });
    await t.goto(pathToFileURL(path.join(GOC, 'thiet_ke/app_kh_demo.html')).href);
    await t.waitForTimeout(600);
    const boQua = t.getByText('Bỏ qua'); if (await boQua.count()) await boQua.first().click(); // màn mở của demo
    await t.waitForTimeout(600);
    return { ctx, t };
  }
  const diApp = (t, d) => t.evaluate((x) => { window.history.pushState({ kh: 1 }, '', x); window.dispatchEvent(new PopStateEvent('popstate')); }, d);
  const chupApp = async (t, ten, rong) => { await t.waitForTimeout(500); await t.screenshot({ path: path.join(RA, `${rong}_${ten}_app.png`) }); };
  const chupDemo = async (t, ten, rong) => { await t.waitForTimeout(500); await t.screenshot({ path: path.join(RA, `${rong}_${ten}_demo.png`) }); };

  for (const rong of [360, 390, 430]) {
    // ----- App
    let { ctx, t } = await moApp(rong, 'chi');
    await t.goto(URL0 + '/kehoach'); await t.waitForSelector('.phone'); await t.waitForSelector('#toolGrid');
    const boQua = t.getByText('Bỏ qua'); if (await boQua.count()) await boQua.first().click();
    await t.locator('#toolGrid').scrollIntoViewIfNeeded(); await t.evaluate(() => { const s = document.querySelector('.screens'); const g = document.querySelector('#toolGrid'); s.scrollTop = g.offsetTop - 70; });
    await chupApp(t, 'luoi6', rong);
    await diApp(t, '/kehoach/ngaycannho'); await t.waitForSelector('#toolBody .tl-row'); await chupApp(t, 'ngaycannho_nguoithan', rong);
    await t.locator('.today-btn', { hasText: '＋ Thêm' }).click(); await t.waitForSelector('[role=dialog]'); await chupApp(t, 'bang_them', rong);
    await t.keyboard.press('Escape');
    await t.locator('.ss-tabs button', { hasText: 'Ngày lễ' }).click(); await chupApp(t, 'ngaycannho_ngayle', rong);
    await diApp(t, '/kehoach/vankhan'); await t.waitForSelector('.vk-hero'); await chupApp(t, 'vankhan_ds', rong);
    await diApp(t, '/kehoach/vankhan/r'); await t.waitForSelector('.vk-txt'); await chupApp(t, 'vankhan_bai', rong);
    await t.evaluate(() => { const s = document.querySelector('.screens'); s.scrollTop = document.querySelector('.vk-txt').offsetTop - 120; }); await chupApp(t, 'vankhan_bai_khan', rong);
    await ctx.close();
    ({ ctx, t } = await moApp(rong, 'anh'));
    await t.goto(URL0 + '/kehoach'); await t.waitForSelector('#toolGrid');
    const boQua2 = t.getByText('Bỏ qua'); if (await boQua2.count()) await boQua2.first().click();
    await t.evaluate(() => { const s = document.querySelector('.screens'); s.scrollTop = document.querySelector('#toolGrid').offsetTop - 70; });
    await chupApp(t, 'luoi5_anh', rong);
    await ctx.close();

    // ----- Demo
    ({ ctx, t } = await moDemo(rong));
    await t.evaluate(() => { go('lich'); });
    await t.evaluate(() => { const s = document.querySelector('.screens'); s.scrollTop = document.querySelector('#toolGrid').offsetTop - 70; });
    await chupDemo(t, 'luoi6', rong);
    await t.evaluate(() => { PROF.sex = 'nam'; renderToolGrid(); }); await chupDemo(t, 'luoi5_anh', rong);
    await t.evaluate(() => { PROF.sex = 'nu'; TL.ngTab = 'ppl'; openTool('ngay'); }); await chupDemo(t, 'ngaycannho_nguoithan', rong);
    await t.evaluate(() => { pplForm(); }); await chupDemo(t, 'bang_them', rong);
    await t.evaluate(() => { closeSheet('sheetX'); TL.ngTab = 'hol'; renderTool(); }); await chupDemo(t, 'ngaycannho_ngayle', rong);
    await t.evaluate(() => { openTool('vk'); }); await chupDemo(t, 'vankhan_ds', rong);
    await t.evaluate(() => { openTool('vk', 'r'); }); await chupDemo(t, 'vankhan_bai', rong);
    await t.evaluate(() => { const s = document.querySelector('.screens'); s.scrollTop = document.querySelector('.vk-txt').offsetTop - 120; }); await chupDemo(t, 'vankhan_bai_khan', rong);
    await ctx.close();
  }

  // ----- Ảnh tô chỗ lệch (đỏ) bằng canvas trong Chromium
  const man = ['luoi6', 'luoi5_anh', 'ngaycannho_nguoithan', 'bang_them', 'ngaycannho_ngayle', 'vankhan_ds', 'vankhan_bai', 'vankhan_bai_khan'];
  const t = await (await trinh.newContext()).newPage();
  for (const rong of [360, 390, 430]) for (const m of man) {
    const a = fs.readFileSync(path.join(RA, `${rong}_${m}_app.png`)).toString('base64'), d = fs.readFileSync(path.join(RA, `${rong}_${m}_demo.png`)).toString('base64');
    const kq2 = await t.evaluate(async ({ a, d }) => {
      const tai = (b) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + b; });
      const [x, y] = await Promise.all([tai(a), tai(d)]);
      const c = document.createElement('canvas'); c.width = x.width; c.height = x.height; const g = c.getContext('2d');
      g.drawImage(x, 0, 0); const px = g.getImageData(0, 0, c.width, c.height);
      const c2 = document.createElement('canvas'); c2.width = x.width; c2.height = x.height; const g2 = c2.getContext('2d'); g2.drawImage(y, 0, 0); const py = g2.getImageData(0, 0, c.width, c.height);
      let khac = 0; const ra = g.createImageData(c.width, c.height);
      for (let i = 0; i < px.data.length; i += 4) {
        const dl = Math.abs(px.data[i] - py.data[i]) + Math.abs(px.data[i + 1] - py.data[i + 1]) + Math.abs(px.data[i + 2] - py.data[i + 2]);
        if (dl > 48) { khac++; ra.data[i] = 255; ra.data[i + 1] = 0; ra.data[i + 2] = 0; ra.data[i + 3] = 255; } else { const l = (px.data[i] + px.data[i + 1] + px.data[i + 2]) / 3; ra.data[i] = ra.data[i + 1] = ra.data[i + 2] = 200 + l / 6; ra.data[i + 3] = 255; }
      }
      g.putImageData(ra, 0, 0);
      return { png: c.toDataURL('image/png').split(',')[1], phanTram: Math.round((khac / (c.width * c.height)) * 1000) / 10 };
    }, { a, d });
    fs.writeFileSync(path.join(RA, `${rong}_${m}_lech.png`), Buffer.from(kq2.png, 'base64'));
    console.log(`${rong} ${m}: khác ${kq2.phanTram}% điểm ảnh`);
  }
  await trinh.close();
})().catch((e) => { console.error(e); process.exit(1); });
