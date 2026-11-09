#!/usr/bin/env node
// Chụp ảnh KH-UI-5d (F3) bằng Chromium + Playwright có sẵn: App thật, POS giả, đồng hồ giả 8.11.2026 09:00 giờ VN. Lưu vào viec/KH-UI-5d/so_anh/<rộng>_<tên>.png.
// Dải quảng cáo là quyết định chủ quán 09.11 — KHÔNG có trong demo nên không có ảnh demo để ghép cặp (xem doi_chieu_demo.md). Chạy: node viec/KH-UI-5d/chup_anh.js
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..', '..');
const RA = path.join(__dirname, 'so_anh');
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');

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
  const GV = { success: true, dang_chay: true, bat_dau: '2026-11-08T08:00:00', ket_thuc: '2026-11-08T10:00:00', phan_tram: 30, mon: ['M1'] };
  const VIEC = [{ id: 'a', ngay: '2026-11-08', gio: '10:00', tieu: 'Đi khám răng', nhac: 585, xong: false }, { id: 'b', ngay: '2026-11-08', gio: '', tieu: 'Uống thuốc bổ', nhac: null, xong: false, lap: { k: 'ngay', n: 1, den: '' }, lanXong: [] }];
  const trinh = await pw.chromium.launch();

  for (const rong of [360, 390, 430]) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, deviceScaleFactor: 2 });
    const t = await ctx.newPage();
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } },
      { luu: { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT), kh_kehoach: JSON.stringify({ v: 1, viec: VIEC, leNhac: {} }) } });
    await t.clock.install({ time: new Date('2026-11-08T02:00:00Z') });
    await t.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Khách thử', ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      if (p === '/api/kh/gio-vang') return json(200, GV);
      if (p === '/api/kh/chuong-trinh') return json(200, { success: true, data: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    const chup = async (ten) => { await t.waitForTimeout(400); await t.screenshot({ path: path.join(RA, `${rong}_${ten}.png`) }); };
    const di = (duong) => t.evaluate((d) => { window.history.pushState({ kh: 1 }, '', d); window.dispatchEvent(new PopStateEvent('popstate')); }, duong);
    await t.goto(URL0 + '/trangchu'); await t.waitForSelector('.phone');
    await chup('trang_chu_banner_khong_x');
    for (const [duong, ten] of [['/menu', 'menu_co_dai'], ['/uudai', 'uudai_co_dai'], ['/giohang', 'giohang_co_dai'], ['/kehoach', 'kehoach_co_dai'], ['/taikhoan', 'taikhoan_co_dai'], ['/thanhtoan', 'thanhtoan_khong_dai']]) {
      await di(duong); await chup(ten);
    }
    await di('/kehoach'); await t.waitForSelector('.cd.today');
    await t.locator('.cd.today').first().click(); await t.waitForSelector('[role=dialog]');
    await t.getByLabel('Tên việc').fill('Uống 1/2'); await chup('bang_ngay_sap_xep_vao_ngay');
    await t.getByLabel('Tên việc').fill('');
    await t.locator('[role=dialog] .ti', { hasText: 'Đi khám răng' }).click(); await chup('bang_sua_o_ngay');
    await t.getByRole('button', { name: 'Xoá việc', exact: true }).click(); await chup('hoi_xoa');
    await ctx.close();
  }
  await trinh.close();
  console.log('xong:', fs.readdirSync(RA).filter((f) => /^(360|390|430)_.*(co_dai|khong_dai|khong_x|ngay|hoi_xoa)/.test(f)).length, 'ảnh');
})().catch((e) => { console.error(e); process.exit(1); });
