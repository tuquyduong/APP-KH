#!/usr/bin/env node
// Chụp ảnh KH-THE-2 (F6) bằng Chromium + Playwright có sẵn: BẢN THIẾT KẾ chủ quán duyệt 14.11 (viec/KH-THE-2/ban_thiet_ke.html, các màn mẫu `.mh` 390 px) ↔ APP THẬT,
// cùng dữ liệu mẫu của bản thiết kế (Hạng vàng 3 % / đặc biệt 4 %, gói 1 tháng 100.000 / 3 tháng 295.000; Kim Cương 10 % chỉ cấp), đồng hồ giả 14.11.2026 20:30 giờ VN.
// App chụp 360 / 390 / 430 × 844; bản thiết kế chỉ có khung 390 → ảnh lệch chỉ ở 390. Lưu viec/KH-THE-2/so_anh/<rộng>_<màn>_{thietke,app,lech}.png (lech = chỗ khác, đỏ).
// Màn cũ không đổi (Giỏ đồ uống, Thanh toán đồ uống): `--truoc <cây gốc>` chụp thêm bản TRƯỚC → <rộng>_cu_<màn>_{truoc,sau,lech}.png.
// Dữ liệu mẫu là dữ liệu thử, KHÔNG phải của khách thật. Chạy: node viec/KH-THE-2/chup_anh.js [--truoc <cây gốc>]
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..', '..');
const RA = path.join(__dirname, 'so_anh');
const MOC = new Date('2026-11-14T13:30:00Z');
const iTruoc = process.argv.indexOf('--truoc');
const GOC_TRUOC = iTruoc > 0 ? process.argv[iTruoc + 1] : '';

const HANG = [
  { id: 2, ten: 'Hạng vàng', phan_tram: 3, phan_tram_nhom_dac_biet: 4, chi_cap: false, goi: [{ so_thang: 1, gia: 100000 }, { so_thang: 3, gia: 295000 }], thu_bac: 2, gia_the: 100000, thu_tu: 2, quyen_loi: [] },
  { id: 3, ten: 'Kim Cương', phan_tram: 10, phan_tram_nhom_dac_biet: 10, chi_cap: true, goi: [], thu_bac: 3, gia_the: null, thu_tu: 3, quyen_loi: [] },
];
const MENU = [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 45000, con_hang: true, gia_hang: [{ hang_id: 2, gia: 43600 }, { hang_id: 3, gia: 40500 }] },
  { ma: 'EPC', ten: 'Ép Cam Cà Rốt', nhom: 'Ép rau củ quả', gia: 39000, con_hang: true, gia_hang: [] }];
const VANG = (het) => ({ id: 2, ten: 'Hạng vàng', phan_tram: 3, phan_tram_nhom_dac_biet: 4, het_han: het });
const KC = { id: 3, ten: 'Kim Cương', phan_tram: 10, phan_tram_nhom_dac_biet: 10, het_han: null };
const CT = [{ ma: 'HSG', ten: 'Học sinh giỏi', mo_ta: 'Mang giấy khen: học sinh được miễn 1 đồ uống; người đi kèm giảm 50%.', loai: 'hoc_sinh_gioi', dang_bat: true }];
const DON_THE = { ma: 'TQD42', so_hd: 'APP0042', ngay: '2026-11-14T20:31:00', tong: 295000, tien_trinh: 'xong', qr: null, cach_tra: 'qr', giu_vi: 0, con_lai: 295000,
  mon: [{ ma: null, ten: '🎟️ Thẻ hội viên Hạng vàng · 3 tháng', so_luong: 1, don_gia: 295000, thanh_tien: 295000, ghi_chu: null, loai: 'the' }],
  hoa_don: [{ loai: 'the', trai: '1 x 🎟️ Thẻ hội viên Hạng vàng · 3 tháng', phai: '295.000', ghi_chu: 'Hạn tới 14/02/2027' }] };

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
  const tinh = (r, p) => { const f = path.join(GOC, 'public', p); return fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 204, body: '' }); };

  async function moApp(rong, { goi = goiSau, dn = true, hang = null, gio = null, don = null, guiDo = null } = {}) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, deviceScaleFactor: rong === 390 ? 2 : 1 });
    const t = await ctx.newPage();
    await t.addInitScript(({ luu }) => { if (location.protocol === 'http:' && !sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } },
      { luu: { kh_ngay_man_dau: '2026-11-14', ...(dn ? { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT) } : {}), ...(gio ? { kh_gio: JSON.stringify(gio) } : {}), ...(guiDo ? { kh_don_gui: JSON.stringify(guiDo) } : {}) } });
    await t.clock.install({ time: MOC });
    await t.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi.js });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: goi.css });
      if (p.startsWith('/anh/') || p.startsWith('/fonts/')) return tinh(r, p);
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: goi.html });
      const d = p.slice(7);
      if (d === '/toi') return json(200, { khach: { sdt: SDT, ten: 'Linh', xung_ho: 'chi', ngay_tao: '2026-01-01 00:00:00', qr: 'QR', dia_chi: null, ngay_sinh: null, hang, so_du_vi: 180600 } });
      if (d === '/hang') return json(200, { success: true, data: HANG });
      if (d === '/menu') return json(200, { success: true, data: MENU });
      if (d === '/diem') return json(200, { success: true, points: 519, history: [] });
      if (d === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (d === '/don' && r.request().method() === 'GET') return json(200, { success: true, trang: 1, con_nua: false, data: [] });
      if (d === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (d === '/chuong-trinh') return json(200, { success: true, data: CT });
      if (d === '/gio-hoat-dong') return json(200, { success: true, bay_gio: '2026-11-14T20:30:00', dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
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
  const chup = async (t, ten, rong, loai, sel) => { await t.waitForTimeout(500); const f = path.join(RA, `${rong}_${ten}_${loai}.png`); if (sel) await t.locator(sel).first().screenshot({ path: f }); else await t.screenshot({ path: f }); };
  const vao = async (t, u, sel) => { await t.goto(URL0 + u); await t.waitForSelector(sel); const b = t.getByText('Bỏ qua'); if (await b.count()) await b.first().click(); await t.waitForTimeout(500); };
  const man = [], ghiMan = (m) => { if (!man.includes(m)) man.push(m); };
  const LY2 = [{ ma: 'TLB', so_luong: 1, ghi_chu: '' }, { ma: 'EPC', so_luong: 1, ghi_chu: '' }];
  const GUI_DO = { khoa_gui: 'K'.repeat(20), than: { mon: [{ loai: 'the', hang_id: 2, so_thang: 3 }], cach_nhan: 'tai_quan', cach_tra: 'qr', khoa_gui: 'K'.repeat(20), tong_da_xem: 295000 }, cach_tra: 'qr', luc: MOC.getTime(), ma_don: 'TQD42', giu_vi: 0, con_lai: 295000 };

  for (const rong of [360, 390, 430]) {
    let { ctx, t } = await moApp(rong);
    await vao(t, '/uudai', '#rewards .the-ud'); await chup(t, 'man1_uudai', rong, 'app'); ghiMan('man1_uudai');
    await chup(t, 'the_chua', rong, 'app', '#rewards .the-ud'); ghiMan('the_chua');
    await vao(t, '/uudai/hang?h=2', '#buycard .ss'); await chup(t, 'man2_hang', rong, 'app'); ghiMan('man2_hang');
    await vao(t, '/uudai/hang/thanhtoan?h=2&thang=3', '#checkout .the-tom-gia'); await chup(t, 'man3_thanhtoan', rong, 'app'); ghiMan('man3_thanhtoan');
    await ctx.close();
    ({ ctx, t } = await moApp(rong, { hang: VANG('2027-02-14T23:59:59'), gio: LY2, don: DON_THE, guiDo: GUI_DO }));
    await vao(t, '/don/TQD42', '#tracking .cm-dau'); await chup(t, 'man4_chaomung', rong, 'app'); ghiMan('man4_chaomung');
    await ctx.close();
    for (const [ten, hang] of [['the_co', VANG('2026-11-26T23:59:59')], ['the_sap', VANG('2026-11-17T23:59:59')], ['the_tang', KC]]) {
      ({ ctx, t } = await moApp(rong, { hang }));
      await vao(t, '/uudai', '#rewards .the-ud'); await chup(t, ten, rong, 'app', '#rewards .the-ud'); ghiMan(ten);
      await ctx.close();
    }
    if (goiTruoc) for (const [goi, loai] of [[goiTruoc, 'truoc'], [goiSau, 'sau']]) {
      ({ ctx, t } = await moApp(rong, { goi, hang: VANG('2026-12-30T23:59:59'), gio: LY2 }));
      await vao(t, '/giohang', '#cart .cart-item'); await t.waitForTimeout(900); await chup(t, 'cu_gio', rong, loai);
      await vao(t, '/thanhtoan', '#checkout .nut-dat'); await t.waitForTimeout(900); await chup(t, 'cu_thanhtoan', rong, loai);
      await ctx.close();
    }
  }

  // Bản thiết kế: các màn mẫu `.mh` (390 px) + bốn thẻ "Thẻ ở Ưu đãi theo tình trạng".
  {
    const ctx = await trinh.newContext({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2 });
    const t = await ctx.newPage();
    await t.route(`${URL0}/**`, (r) => { const p = new URL(r.request().url()).pathname; return p.startsWith('/anh/') ? tinh(r, p) : r.fulfill({ contentType: 'text/html', body: fs.readFileSync(path.join(__dirname, 'ban_thiet_ke.html'), 'utf8') }); });
    await t.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 204, body: '' }));
    await t.goto(URL0 + '/ban_thiet_ke.html'); await t.waitForTimeout(800);
    for (const [ten, sel] of [['man1_uudai', '#man-1 .de-xuat .mh'], ['man2_hang', '#man-2 .de-xuat .mh'], ['man3_thanhtoan', '#man-3 .de-xuat .mh'], ['man4_chaomung', '#man-4 .de-xuat .mh'],
      ['the_chua', '#tinh-trang .o-the:nth-child(1) .the'], ['the_co', '#tinh-trang .o-the:nth-child(2) .the'], ['the_sap', '#tinh-trang .o-the:nth-child(3) .the'], ['the_tang', '#tinh-trang .o-the:nth-child(4) .the']]) {
      await t.locator(sel).first().screenshot({ path: path.join(RA, `390_${ten}_thietke.png`) });
    }
    await ctx.close();
  }

  // ----- Ảnh tô chỗ lệch (đỏ) bằng canvas trong Chromium (ảnh khác cỡ → so phần chung, phần thừa tính là khác)
  const t = await (await trinh.newContext()).newPage();
  const cap = [...man.map((m) => [390, m, 'app', 'thietke']), ...(goiTruoc ? [360, 390, 430].flatMap((r) => ['cu_gio', 'cu_thanhtoan'].map((m) => [r, m, 'sau', 'truoc'])) : [])];
  for (const [rong, m, la, lb] of cap) {
    const a = fs.readFileSync(path.join(RA, `${rong}_${m}_${la}.png`)).toString('base64'), d = fs.readFileSync(path.join(RA, `${rong}_${m}_${lb}.png`)).toString('base64');
    const kq2 = await t.evaluate(async ({ a, d }) => {
      const tai = (b) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + b; });
      const [x, y] = await Promise.all([tai(a), tai(d)]);
      const w = Math.max(x.width, y.width), h = Math.max(x.height, y.height);
      const ve = (i) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(i, 0, 0); return g.getImageData(0, 0, w, h); };
      const px = ve(x), py = ve(y);
      const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
      let khac = 0; const ra = g.createImageData(w, h);
      for (let i = 0; i < px.data.length; i += 4) {
        const dl = Math.abs(px.data[i] - py.data[i]) + Math.abs(px.data[i + 1] - py.data[i + 1]) + Math.abs(px.data[i + 2] - py.data[i + 2]);
        if (dl > 48) { khac++; ra.data[i] = 255; ra.data[i + 1] = 0; ra.data[i + 2] = 0; ra.data[i + 3] = 255; } else { const l = (px.data[i] + px.data[i + 1] + px.data[i + 2]) / 3; ra.data[i] = ra.data[i + 1] = ra.data[i + 2] = 200 + l / 6; ra.data[i + 3] = 255; }
      }
      g.putImageData(ra, 0, 0);
      return { png: c.toDataURL('image/png').split(',')[1], phanTram: Math.round((khac / (w * h)) * 1000) / 10 };
    }, { a, d });
    fs.writeFileSync(path.join(RA, `${rong}_${m}_lech.png`), Buffer.from(kq2.png, 'base64'));
    console.log(`${rong} ${m} (${la} ↔ ${lb}): khác ${kq2.phanTram}% điểm ảnh`);
  }
  await trinh.close();
})().catch((e) => { console.error(e); process.exit(1); });
