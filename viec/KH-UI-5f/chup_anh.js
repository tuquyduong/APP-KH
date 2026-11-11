#!/usr/bin/env node
// Chụp ảnh KH-UI-5f (F3) bằng Chromium + Playwright có sẵn: cặp ảnh DEMO (thiet_ke/app_kh_demo.html, patch39) ↔ APP THẬT, cùng cỡ 360 / 390 / 430 × 844, cùng dữ liệu mẫu
// (xe Honda Vision + Toyota Vios, thuốc sắc + Vitamin D3, chu kỳ ngày 10, thông tin Tín chủ — chép từ demo TL.car / TL.med / TL.cyc / TL.vkInfo), đồng hồ giả 10.11.2026 09:00 giờ VN cho cả hai.
// Lưu viec/KH-UI-5f/so_anh/<rộng>_<màn>_{demo,app,lech}.png (lech = ảnh tô chỗ khác nhau, đỏ). 390 chụp ×2 để người xem; 360 / 430 ×1. Màn chỉ có ở app (khoá mã riêng, khung Tín chủ) chỉ có ảnh app.
// Dữ liệu mẫu là dữ liệu thử, KHÔNG phải của khách thật. Chạy: node viec/KH-UI-5f/chup_anh.js
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..', '..');
const RA = path.join(__dirname, 'so_anh');
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const MOC = new Date('2026-11-10T02:00:00Z');

(async () => {
  const pw = require('playwright'), esbuild = require('esbuild');
  const LM = await import(pathToFileURL(path.join(GOC, 'src/luuMay.js')).href), LP = await import(pathToFileURL(path.join(GOC, 'src/kehoachLap.js')).href), KH = await import(pathToFileURL(path.join(GOC, 'src/kehoach.js')).href);
  fs.mkdirSync(RA, { recursive: true });
  const hn = LP.jd({ d: 10, m: 11, y: 2026 }), ngay = (j) => LP.chuoiJd(hn + j);
  const MAU_XM = [{ ten: 'Thay dầu máy', km: 1500, thang: 2 }, { ten: 'Vệ sinh nồi, bugi', km: 8000, thang: 0 }, { ten: 'Kiểm tra phanh, lốp', km: 0, thang: 3 }];
  const MAU_OTO = [{ ten: 'Thay dầu máy', km: 5000, thang: 6 }, { ten: 'Lọc gió điều hoà', km: 10000, thang: 12 }, { ten: 'Đảo lốp', km: 10000, thang: 0 }, { ten: 'Kiểm tra phanh', km: 0, thang: 6 }];
  const XE = [
    { id: 'x1', ten: 'Honda Vision', bien: '29X1-123.45', loai: 'xm', km: 12450, nhac: true, lich: MAU_XM, giayTo: [{ ten: 'Bảo hiểm bắt buộc', ngay: '2027-03-12' }],
      nhatKy: [{ ngay: ngay(-145), km: 9700, viec: ['Thay dầu máy', 'Thay lọc gió'], phi: 230000, noi: 'Head Honda Cầu Giấy' }, { ngay: ngay(-70), km: 10900, viec: ['Kiểm tra phanh, lốp'], phi: 0, noi: '' }, { ngay: ngay(-40), km: 11300, viec: ['Thay dầu máy', 'Kiểm tra phanh'], phi: 120000, noi: 'Head Honda Cầu Giấy' }] },
    { id: 'x2', ten: 'Toyota Vios', bien: '30H-456.78', loai: 'oto', km: 48200, nhac: true, lich: MAU_OTO, giayTo: [{ ten: 'Bảo hiểm bắt buộc', ngay: '2027-01-05' }, { ten: 'Đăng kiểm', ngay: ngay(18) }],
      nhatKy: [{ ngay: ngay(-150), km: 43900, viec: ['Thay dầu máy', 'Lọc gió điều hoà'], phi: 1350000, noi: 'Toyota Mỹ Đình' }, { ngay: ngay(-150), km: 43900, viec: ['Đảo lốp'], phi: 200000, noi: 'Toyota Mỹ Đình' }] },
  ];
  const THUOC = [{ id: 't1', ten: 'Thuốc sắc (thang)', lieu: '1 chén', ghi: 'Uống ấm, sau ăn 30 phút', gio: ['07:30', '19:30'], den: ngay(10), bd: ngay(-30), nhac: true },
    { id: 't2', ten: 'Vitamin D3', lieu: '1 viên', ghi: 'Sau bữa sáng', gio: ['08:00'], den: '', bd: ngay(-30), nhac: false }];
  const tat = ['t1@07:30', 't1@19:30', 't2@08:00']; // 7 ngày trước: [1, 1, .5, 1, 1, 1, .5] như medHist của demo
  const XONG = {}; [1, 1, 0.5, 1, 1, 1, 0.5].forEach((v, i) => { XONG[ngay(i - 7)] = v === 1 ? tat : tat.slice(0, 1); });
  const CK = { bat: true, bd: ngay(-9), dai: 28, hanh: 5, ls: [28, 29, 27, 28, 30, 28], nhac: true, khoa: null, thu: { sai: 0, den: 0 } };
  const KE = { v: 1, viec: [], leNhac: {}, nguoi: [], vk: { ten: null, ho: null, dc: null, nm: null, fs: 17, tick: {}, nhac: {} }, xe: XE, thuoc: THUOC, thuocXong: XONG, chuKy: CK };
  const khoaMau = { muoi: 'a'.repeat(32), bam: 'b'.repeat(64) };

  const kq = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, outdir: path.join(GOC, '.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
    loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles;
  const goi = kq.find((f) => f.path.endsWith('.js')).text, css = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text;
  const html = doc('index.html').replace(/<script type="module" src="\/src\/main.jsx"><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  const SDT = '0901234567', URL0 = 'http://localhost:4599';
  const trinh = await pw.chromium.launch();

  async function moApp(rong, ke) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, deviceScaleFactor: rong === 390 ? 2 : 1 });
    const t = await ctx.newPage();
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } },
      { luu: { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT), ...(ke ? { kh_kehoach: JSON.stringify(ke) } : {}) } });
    await t.clock.install({ time: MOC });
    await t.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (p.startsWith('/anh/') || p.startsWith('/fonts/')) { const f = path.join(GOC, 'public', p); return fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 204, body: '' }); }
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Nguyễn Thị Linh', xung_ho: 'chi', ngay_tao: '2026-01-01 00:00:00', qr: 'QR', dia_chi: '123 Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh' } });
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
    const boQua = t.getByText('Bỏ qua'); if (await boQua.count()) await boQua.first().click();
    await t.waitForTimeout(600);
    return { ctx, t };
  }
  const diApp = async (t, d) => { await t.evaluate((x) => { window.history.pushState({ kh: 1 }, '', x); window.dispatchEvent(new PopStateEvent('popstate')); }, d); await t.waitForTimeout(300); };
  const chup = async (t, ten, rong, loai) => { await t.waitForTimeout(450); await t.screenshot({ path: path.join(RA, `${rong}_${ten}_${loai}.png`) }); };
  const vao = async (t, u, sel) => { await t.goto(URL0 + u); await t.waitForSelector(sel); const b = t.getByText('Bỏ qua'); if (await b.count()) await b.first().click(); await t.waitForTimeout(300); };
  const cuonLuoi = (t) => t.evaluate(() => { const s = document.querySelector('.screens'); s.scrollTop = document.querySelector('#toolGrid').offsetTop - 70; });
  const dong = async (t) => { const x = t.locator('.bn-x'); if (await x.count()) await x.first().click(); await t.waitForTimeout(250); };

  for (const rong of [360, 390, 430]) {
    // ----- App (dữ liệu mẫu của demo)
    let { ctx, t } = await moApp(rong, KE);
    await vao(t, '/kehoach', '#toolGrid'); await cuonLuoi(t); await chup(t, 'luoi6', rong, 'app');
    await diApp(t, '/kehoach/xeco'); await t.waitForSelector('.veh'); await chup(t, 'xe_ds', rong, 'app');
    await t.locator('.veh').first().click(); await t.waitForSelector('.car-card'); await chup(t, 'xe_mot', rong, 'app');
    await t.evaluate(() => { const s = document.querySelector('.screens'); s.scrollTop = 99999; }); await chup(t, 'xe_mot_duoi', rong, 'app');
    await t.locator('.today-btn', { hasText: '＋ Ghi lần sửa' }).click(); await t.waitForSelector('[role=dialog]'); await chup(t, 'xe_ghi', rong, 'app'); await dong(t);
    await t.locator('.back-btn').click(); await t.locator('.today-btn', { hasText: '＋ Thêm xe' }).click(); await t.waitForSelector('[role=dialog]'); await chup(t, 'xe_them', rong, 'app'); await dong(t);
    await diApp(t, '/kehoach/uongthuoc'); await t.waitForSelector('.med-card'); await chup(t, 'thuoc_ds', rong, 'app');
    await t.locator('.today-btn', { hasText: '＋ Thêm' }).click(); await t.waitForSelector('[role=dialog]'); await chup(t, 'thuoc_them', rong, 'app'); await dong(t);
    await diApp(t, '/kehoach/chuky'); await t.waitForSelector('.cyc-card'); await chup(t, 'chuky_on', rong, 'app');
    await t.evaluate(() => { const s = document.querySelector('.screens'); s.scrollTop = 99999; }); await chup(t, 'chuky_on_duoi', rong, 'app');
    await diApp(t, '/kehoach/vankhan'); await t.waitForSelector('.vk-khung'); await chup(t, 'vankhan_ds', rong, 'app');
    await ctx.close();
    ({ ctx, t } = await moApp(rong, null));
    await vao(t, '/kehoach/chuky', '.cyc-off'); await chup(t, 'chuky_off', rong, 'app');
    await vao(t, '/kehoach/vankhan/r', '.vk-txt'); await t.evaluate(() => { document.querySelector('.screens').scrollTop = 0; }); await chup(t, 'vankhan_bai', rong, 'app');
    await ctx.close();
    ({ ctx, t } = await moApp(rong, { ...KE, chuKy: { ...CK, khoa: khoaMau } }));
    await vao(t, '/kehoach/chuky', '.pin-pad'); await chup(t, 'chuky_hoi_ma', rong, 'app');
    await ctx.close();

    // ----- Demo
    ({ ctx, t } = await moDemo(rong));
    await t.evaluate(() => { go('lich'); }); await cuonLuoi(t); await chup(t, 'luoi6', rong, 'demo');
    await t.evaluate(() => { openTool('car'); }); await chup(t, 'xe_ds', rong, 'demo');
    await t.evaluate(() => { TL.sub = 'v:0'; renderTool(); }); await chup(t, 'xe_mot', rong, 'demo');
    await t.evaluate(() => { document.querySelector('.screens').scrollTop = 99999; }); await chup(t, 'xe_mot_duoi', rong, 'demo');
    await t.evaluate(() => { TL.sub = 'log:0'; renderTool(); }); await chup(t, 'xe_ghi', rong, 'demo');
    await t.evaluate(() => { TL.sub = 'add'; renderTool(); }); await chup(t, 'xe_them', rong, 'demo');
    await t.evaluate(() => { openTool('med'); }); await chup(t, 'thuoc_ds', rong, 'demo');
    await t.evaluate(() => { TL.sub = 'add'; renderTool(); }); await chup(t, 'thuoc_them', rong, 'demo');
    await t.evaluate(() => { TL.sub = null; openTool('cyc'); }); await chup(t, 'chuky_on', rong, 'demo');
    await t.evaluate(() => { document.querySelector('.screens').scrollTop = 99999; }); await chup(t, 'chuky_on_duoi', rong, 'demo');
    await t.evaluate(() => { TL.cyc.on = false; renderTool(); document.querySelector('.screens').scrollTop = 0; }); await chup(t, 'chuky_off', rong, 'demo');
    await t.evaluate(() => { openTool('vk'); }); await chup(t, 'vankhan_ds', rong, 'demo');
    await t.evaluate(() => { openTool('vk', 'r'); }); await chup(t, 'vankhan_bai', rong, 'demo');
    await ctx.close();
  }

  // ----- Ảnh tô chỗ lệch (đỏ) bằng canvas trong Chromium
  const man = ['luoi6', 'xe_ds', 'xe_mot', 'xe_mot_duoi', 'xe_ghi', 'xe_them', 'thuoc_ds', 'thuoc_them', 'chuky_on', 'chuky_on_duoi', 'chuky_off', 'vankhan_ds', 'vankhan_bai'];
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
