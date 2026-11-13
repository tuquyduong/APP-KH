#!/usr/bin/env node
// Chụp ảnh KH-THE-1 (F5) bằng Chromium + Playwright có sẵn: cặp DEMO (thiet_ke/app_kh_demo.html, patch39) ↔ APP THẬT, cỡ 360 / 390 / 430 × 844, cùng dữ liệu mẫu
// của demo (TIERS Thường / Vàng 10 % / Kim cương 15 %, GOLD_PLANS 1 tháng 79.000 / 3 tháng 199.000, TIER_INFO quyền lợi), đồng hồ giả 13.11.2026 20:30 giờ VN.
// Lưu viec/KH-THE-1/so_anh/<rộng>_<màn>_{demo,app,lech}.png (lech = chỗ khác, đỏ). 390 chụp ×2; 360 / 430 ×1.
// Màn cũ không đổi (Ưu đãi, Giỏ đồ uống, Thanh toán đồ uống): `--truoc <thư mục cây gốc>` chụp thêm bản TRƯỚC từ cây gốc → <rộng>_cu_<màn>_{truoc,sau,lech}.png.
// Dữ liệu mẫu là dữ liệu thử, KHÔNG phải của khách thật. Chạy: node viec/KH-THE-1/chup_anh.js [--truoc <cây gốc>]
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..', '..');
const RA = path.join(__dirname, 'so_anh');
const MOC = new Date('2026-11-13T13:30:00Z');
const iTruoc = process.argv.indexOf('--truoc');
const GOC_TRUOC = iTruoc > 0 ? process.argv[iTruoc + 1] : '';

const BEN = (ds) => ds; // quyền lợi chép nguyên TIER_INFO của demo
const HANG = [
  { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 0, chi_cap: false, goi: [{ so_thang: 1, gia: 79000 }, { so_thang: 3, gia: 199000 }], thu_bac: 2, gia_the: 79000, thu_tu: 2,
    quyen_loi: BEN(['Giảm 10% mọi món, mọi đơn (cả combo)', 'Tích điểm ×1,2', 'Sinh nhật: tặng 1 ly bất kỳ', 'Báo Giờ vàng sớm 15 phút', 'Ưu đãi riêng hằng tháng']) },
  { id: 3, ten: 'Kim cương', phan_tram: 15, phan_tram_nhom_dac_biet: 0, chi_cap: true, goi: [], thu_bac: 3, gia_the: null, thu_tu: 3,
    quyen_loi: BEN(['Giảm 15% mọi món, mọi đơn (cả combo)', 'Tích điểm ×1,5', 'Miễn phí giao nội thành', 'Sinh nhật: hộp quà + 1 ly mỗi ngày trong tuần sinh nhật', 'Tư vấn dưỡng sinh 1-1 với lương y mỗi quý', 'Mời dự sự kiện riêng (trà đạo, ra mắt món)']) },
];
const MENU = [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 45000, con_hang: true, gia_hang: [{ hang_id: 2, gia: 40500 }, { hang_id: 3, gia: 38300 }] },
  { ma: 'EPC', ten: 'Ép Cam Cà Rốt', nhom: 'Ép rau củ quả', gia: 39000, con_hang: true, gia_hang: [{ hang_id: 2, gia: 35100 }] }];
const VANG = (het) => ({ id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 0, het_han: het });

async function dungGoi(goc) {
  const esbuild = require(path.join(GOC, 'node_modules/esbuild'));
  const kq = esbuild.buildSync({
    entryPoints: [path.join(goc, 'src/main.jsx')], bundle: true, write: false, outdir: path.join(goc, '.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
    loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
    nodePaths: [path.join(GOC, 'node_modules')],
  }).outputFiles;
  const html = fs.readFileSync(path.join(goc, 'index.html'), 'utf8').replace(/<script type="module" src="\/src\/main.jsx"><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  return { js: kq.find((f) => f.path.endsWith('.js')).text, css: (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text, html };
}

(async () => {
  const pw = require('playwright');
  const LM = await import(pathToFileURL(path.join(GOC, 'src/luuMay.js')).href);
  fs.mkdirSync(RA, { recursive: true });
  const SDT = '0901234567', URL0 = 'http://localhost:4599';
  const goiSau = await dungGoi(GOC), goiTruoc = GOC_TRUOC ? await dungGoi(GOC_TRUOC) : null;
  const trinh = await pw.chromium.launch();

  async function moApp(rong, { goi = goiSau, hang = null, gio = null, don = null, dong = false } = {}) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, deviceScaleFactor: rong === 390 ? 2 : 1 });
    const t = await ctx.newPage();
    await t.addInitScript(({ luu }) => { if (location.protocol === 'http:' && !sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } },
      { luu: { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT), kh_ngay_man_dau: '2026-11-13', ...(gio ? { kh_gio: JSON.stringify(gio) } : {}) } });
    await t.clock.install({ time: MOC });
    await t.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi.js });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: goi.css });
      if (p.startsWith('/anh/') || p.startsWith('/fonts/')) { const f = path.join(GOC, 'public', p); return fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 204, body: '' }); }
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: goi.html });
      const d = p.slice(7);
      if (d === '/toi') return json(200, { khach: { sdt: SDT, ten: 'Linh', xung_ho: 'chi', ngay_tao: '2026-01-01 00:00:00', qr: 'QR', dia_chi: null, ngay_sinh: null, hang, so_du_vi: 500000 } });
      if (d === '/hang') return json(200, { success: true, data: HANG });
      if (d === '/menu') return json(200, { success: true, data: MENU });
      if (d === '/diem') return json(200, { success: true, points: 1250, history: [] });
      if (d === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (d === '/don' && r.request().method() === 'GET') return json(200, { success: true, trang: 1, con_nua: false, data: [] });
      if (d === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (d === '/chuong-trinh') return json(200, { success: true, data: [] });
      if (d === '/gio-hoat-dong') return json(200, { success: true, bay_gio: '2026-11-13T20:30:00', dang_mo: !dong, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (d === '/gio/bao-gia') {
        const than = JSON.parse(r.request().postData());
        const dg = than.mon.map((m) => (m.loai ? { thanh_tien: HANG.find((h) => h.id === m.hang_id).goi.find((g) => g.so_thang === m.so_thang).gia } : { thanh_tien: MENU.find((x) => x.ma === m.ma).gia * m.so_luong }));
        const tong = dg.reduce((s, x) => s + x.thanh_tien, 0);
        return json(200, { success: true, dong: dg, tam_tinh: tong, giam: [], phi_giao: 0, tong, ma_giam_loi: null });
      }
      if (don && d === '/don/' + don.ma) return json(200, { success: true, don });
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
  const chup = async (t, ten, rong, loai) => { await t.waitForTimeout(500); await t.screenshot({ path: path.join(RA, `${rong}_${ten}_${loai}.png`) }); };
  const vao = async (t, u, sel) => { await t.goto(URL0 + u); await t.waitForSelector(sel); const b = t.getByText('Bỏ qua'); if (await b.count()) await b.first().click(); await t.waitForTimeout(400); };
  const cuon = (t, sel) => t.evaluate((s) => { const x = document.querySelector(s); const sc = document.querySelector('.screens'); if (x && sc) sc.scrollTop = x.offsetTop - 60; }, sel);
  const DON_THE = { ma: 'TQD42', so_hd: 'APP0042', ngay: '2026-11-13T20:31:00', tong: 199000, tien_trinh: 'xong', qr: null, cach_tra: 'vi', giu_vi: 199000, con_lai: 0,
    mon: [{ ma: null, ten: '🎟️ Thẻ hội viên Vàng · 3 tháng', so_luong: 1, don_gia: 199000, thanh_tien: 199000, ghi_chu: null, loai: 'the' }],
    hoa_don: [{ loai: 'so_bill', trai: '', phai: 'APP0042' }, { loai: 'the', trai: '1 x 🎟️ Thẻ hội viên Vàng · 3 tháng', phai: '199.000', ghi_chu: 'Hạn mới: 13/02/2027' }, { loai: 'tong', trai: 'Tổng cộng', phai: '199.000' }] };
  const man = [];
  const ghiMan = (m) => { if (!man.includes(m)) man.push(m); };

  for (const rong of [360, 390, 430]) {
    let { ctx, t } = await moApp(rong);
    await vao(t, '/uudai/hang?h=2', '#buycard .ti-tabs'); await chup(t, 'hang_chuahang', rong, 'app'); ghiMan('hang_chuahang');
    await cuon(t, '#buycard .ti-cmp'); await chup(t, 'hang_chuahang_duoi', rong, 'app'); ghiMan('hang_chuahang_duoi');
    await vao(t, '/uudai/hang?h=3', '#buycard .ti-tabs'); await chup(t, 'hang_kimcuong', rong, 'app'); ghiMan('hang_kimcuong');
    await ctx.close();
    ({ ctx, t } = await moApp(rong, { hang: VANG('2026-11-15T23:59:59') }));
    await vao(t, '/uudai/hang?h=2', '#buycard .ti-card'); await chup(t, 'hang_vang', rong, 'app'); ghiMan('hang_vang');
    await vao(t, '/trangchu', '#home .points-card'); await t.waitForTimeout(500); await chup(t, 'trangchu_nhac', rong, 'app'); ghiMan('trangchu_nhac');
    await vao(t, '/uudai', '#rewards .tier-card'); await chup(t, 'uudai_nut', rong, 'app'); ghiMan('uudai_nut');
    await ctx.close();
    ({ ctx, t } = await moApp(rong, { gio: [{ ma: 'TLB', so_luong: 1, ghi_chu: '' }, { loai: 'the', hang_id: 2, so_thang: 3 }] }));
    await vao(t, '/giohang', '#cart .cart-item'); await t.waitForTimeout(900); await chup(t, 'gio_the_ly', rong, 'app'); ghiMan('gio_the_ly');
    await vao(t, '/menu/the-thanh-vien', '#catGrid .pc-mini'); await chup(t, 'menu_the', rong, 'app'); ghiMan('menu_the');
    await ctx.close();
    ({ ctx, t } = await moApp(rong, { hang: VANG('2027-02-13T23:59:59'), don: DON_THE }));
    await vao(t, '/don/TQD42', '#tracking .nt-state'); await chup(t, 'theodoi_chithe', rong, 'app'); ghiMan('theodoi_chithe');
    await ctx.close();

    ({ ctx, t } = await moDemo(rong));
    await t.evaluate(() => { setTier(0); go('buycard'); TS.view = 1; renderTier(); }); await chup(t, 'hang_chuahang', rong, 'demo');
    await cuon(t, '#buycard .ti-cmp'); await chup(t, 'hang_chuahang_duoi', rong, 'demo');
    await t.evaluate(() => { document.querySelector('.screens').scrollTop = 0; TS.view = 2; renderTier(); }); await chup(t, 'hang_kimcuong', rong, 'demo');
    await t.evaluate(() => { setTier(1); TS.view = 1; renderTier(); document.querySelector('.screens').scrollTop = 0; }); await chup(t, 'hang_vang', rong, 'demo');
    await t.evaluate(() => { go('home'); }); await chup(t, 'trangchu_nhac', rong, 'demo');
    await t.evaluate(() => { go('rewards'); }); await chup(t, 'uudai_nut', rong, 'demo');
    await t.evaluate(() => { go('cart'); }); await chup(t, 'gio_the_ly', rong, 'demo');
    await t.evaluate(() => { go('catalog'); }); await chup(t, 'menu_the', rong, 'demo');
    await t.evaluate(() => { go('tracking'); }); await chup(t, 'theodoi_chithe', rong, 'demo');
    await ctx.close();

    if (goiTruoc) for (const [goi, loai] of [[goiTruoc, 'truoc'], [goiSau, 'sau']]) {
      ({ ctx, t } = await moApp(rong, { goi, hang: VANG('2026-12-30T23:59:59'), gio: [{ ma: 'TLB', so_luong: 2, ghi_chu: '' }, { ma: 'EPC', so_luong: 1, ghi_chu: '' }] }));
      await vao(t, '/uudai', '#rewards .tier-card'); await chup(t, 'cu_uudai', rong, loai);
      await vao(t, '/giohang', '#cart .cart-item'); await t.waitForTimeout(900); await chup(t, 'cu_gio', rong, loai);
      await vao(t, '/thanhtoan', '#checkout .nut-dat'); await t.waitForTimeout(900); await chup(t, 'cu_thanhtoan', rong, loai);
      await ctx.close();
    }
  }

  // ----- Ảnh tô chỗ lệch (đỏ) bằng canvas trong Chromium
  const t = await (await trinh.newContext()).newPage();
  const cap = [...man.map((m) => [m, 'app', 'demo']), ...(goiTruoc ? ['cu_uudai', 'cu_gio', 'cu_thanhtoan'].map((m) => [m, 'sau', 'truoc']) : [])];
  for (const rong of [360, 390, 430]) for (const [m, la, lb] of cap) {
    const a = fs.readFileSync(path.join(RA, `${rong}_${m}_${la}.png`)).toString('base64'), d = fs.readFileSync(path.join(RA, `${rong}_${m}_${lb}.png`)).toString('base64');
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
    console.log(`${rong} ${m} (${la} ↔ ${lb}): khác ${kq2.phanTram}% điểm ảnh`);
  }
  await trinh.close();
})().catch((e) => { console.error(e); process.exit(1); });
