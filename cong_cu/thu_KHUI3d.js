#!/usr/bin/env node
// THỬ KH-UI-3d — Ưu đãi mở cho khách vãng lai + văn phong lời chào (xưng hô chữ thường, có "!").
// Phần 1: hàm thuần + đọc nguồn (không trình duyệt) · Phần 2: App thật trong Chromium + POS giả theo hợp đồng v3.
// Chạy: node cong_cu/thu_KHUI3d.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };

const BAY = (gio) => `2026-10-30T${gio}`;
const HANG = { success: true, data: [{ id: 1, ten: 'Bạc', phan_tram: 5, phan_tram_nhom_dac_biet: 0, gia_the: 99000, thu_tu: 0 }, { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, gia_the: 199000, thu_tu: 1 }] };
const MENU = { success: true, data: [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [{ hang_id: 2, gia: 27000 }] }] };
const GV_TAT = { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] };
const GV_DANG = { success: true, dang_chay: true, bat_dau: '20:00', ket_thuc: '22:00', phan_tram: 30, mon: ['TLB'] };
const GHD = (gio) => ({ success: true, bay_gio: BAY(gio), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
const KHACH = { sdt: '0909123456', ten: 'Nguyễn Linh', ngay_tao: '2026-01-01T08:00:00', xung_ho: 'chi', dia_chi: null, qr: 'QR', hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-11-15T23:59:59' }, so_du_vi: 85000 };
const VOUCHER = { success: true, data: [{ id: 7, reward_name: 'Giảm 20.000đ', code: 'VC7', discount_type: 'fixed', discount_value: 20000, expires_at: '2026-11-30T23:59:59', status: 'active' }], ma_khach_moi: [] };

(async () => {
  console.log('Phần 1 — hàm thuần + đọc nguồn');

  await thu('A1', async () => {
    const d = await nap('src/dinhDang.js');
    const c = (gio, xh, ten) => d.loiChao(gio, xh, ten);
    const G = '2026-10-30 15:00:00';
    k('A1 đủ giờ + xưng hô + tên → "Chào buổi chiều, anh Linh!"', c(G, 'anh', 'Linh') === 'Chào buổi chiều, anh Linh!', c(G, 'anh', 'Linh'));
    k('A1 chưa có bay_gio → "Chào anh Linh!"', c('', 'anh', 'Linh') === 'Chào anh Linh!' && c(null, 'anh', 'Linh') === 'Chào anh Linh!', c('', 'anh', 'Linh'));
    k('A1 khách chưa có xưng hô → "Chào buổi chiều, Linh!"', c(G, null, 'Linh') === 'Chào buổi chiều, Linh!' && c(G, '', 'Linh') === 'Chào buổi chiều, Linh!', c(G, null, 'Linh'));
    k('A1 có xưng hô, chưa có tên → "Chào buổi chiều, anh!"', c(G, 'anh', '') === 'Chào buổi chiều, anh!' && c(G, 'anh', null) === 'Chào buổi chiều, anh!', c(G, 'anh', ''));
    k('A1 chưa đăng nhập → "Chào bạn!"', c('', '', '') === 'Chào bạn!' && c(null, null, null) === 'Chào bạn!', c('', '', ''));
    const moc = [['05:00:00', 'sáng'], ['10:59:00', 'sáng'], ['11:00:00', 'trưa'], ['13:00:00', 'chiều'], ['18:00:00', 'tối'], ['04:59:00', 'tối']];
    const sai = moc.filter(([g, b]) => c(`2026-10-30T${g}`, 'chị', 'Hoa') !== `Chào buổi ${b}, chị Hoa!`).map(([g]) => g);
    k('A1 mốc buổi giữ nguyên (5–11 sáng · 11–13 trưa · 13–18 chiều · tối) và luôn có "!"', sai.length === 0, sai.join(','));
    k('A1 xưng hô nhập hoa vẫn ra chữ thường giữa câu', c(G, 'Chị', 'Linh') === 'Chào buổi chiều, chị Linh!' && c('', 'ANH', 'Linh') === 'Chào anh Linh!');
    const p = d.chiaLoiChao(G, 'anh', 'Nam');
    k('A1 chiaLoiChao: xung chữ thường', p.xung === 'anh' && p.ten === 'Nam' && p.dau === 'Chào buổi chiều', JSON.stringify(p));
    k('A2 tên ngắn = từ cuối, viết hoa chữ đầu, phần còn lại giữ nguyên', d.tenNgan('nguyễn linh') === 'Linh' && d.tenNgan('Anh Linh') === 'Linh' && d.tenNgan('  trần   văn  nAm ') === 'NAm' && d.tenNgan('') === '' && d.tenNgan(null) === '', [d.tenNgan('nguyễn linh'), d.tenNgan('trần văn nAm')].join('|'));
    k('A2 "nguyễn linh" + "chị" → "Chào chị Linh!"', c('', 'chị', 'nguyễn linh') === 'Chào chị Linh!', c('', 'chị', 'nguyễn linh'));
  });

  await thu('A3', async () => {
    const dn = await nap('src/noiDung/dangNhap.js');
    k('A3 XUNG_HO chữ thường đúng thứ tự demo: anh · chị · cô · chú · bác · em · bạn', dn.XUNG_HO.map((x) => x.ten).join(' · ') === 'anh · chị · cô · chú · bác · em · bạn', dn.XUNG_HO.map((x) => x.ten).join(' · '));
    k('A3 mã gửi POS không đổi (không dấu)', dn.XUNG_HO.map((x) => x.ma).join() === 'anh,chi,co,chu,bac,em,ban');
    k('A3 tenXungHo("chi") = "chị"; mã lạ / null → ""', dn.tenXungHo('chi') === 'chị' && dn.tenXungHo('xyz') === '' && dn.tenXungHo(null) === '');
    k('A3 hai chỗ chọn xưng hô cùng đọc XUNG_HO (một chỗ đổi)', /XUNG_HO\.map/.test(doc('src/pages/DangNhap.jsx')) && /XUNG_HO\.map/.test(doc('src/pages/HoSo.jsx')));
  });

  await thu('A4', async () => {
    const hs = doc('src/pages/HoSo.jsx');
    k('A4 xem trước ở Thông tin cá nhân dùng chiaLoiChao (cùng hàm với Trang chủ) và kết bằng "!"', /chiaLoiChao/.test(hs) && /pf-prev[^\n]*!”/.test(hs));
    k('A4 xưng hô in đậm trong xem trước', /pf-prev[^\n]*<b>\{xung\}<\/b>/.test(hs));
  });

  await thu('B1', async () => {
    const dd = await nap('src/duongDan.js');
    const lg = await nap('src/luongDangNhap.js');
    k('B1 /uudai không còn canDN', dd.docDuongDan('/uudai').canDN === false && dd.trangCanDangNhap('uudai') === false);
    k('B1 vãng lai bấm tab Ưu đãi (không mã hoá đơn) → không chặn', lg.canDangNhap('uudai', false) === false && lg.canDangNhap('uudai', false, '') === false);
    k('B1 Tài khoản, mã thành viên, trắc nghiệm vẫn cần đăng nhập (K5 ngược)', ['taikhoan', 'qr', 'tracnghiem', 'thanhtoan', 'donhang'].every((t) => lg.canDangNhap(t, false, '') === true));
    k('B1 đã đăng nhập không bao giờ bị chặn', ['uudai', 'taikhoan', 'qr'].every((t) => lg.canDangNhap(t, true, 'AB12') === false));
  });

  await thu('B3', async () => {
    const lg = await nap('src/luongDangNhap.js');
    k('B3 vãng lai ở /uudai MÀ còn mã hoá đơn (link QR) → phải đăng nhập, mã không mất', lg.canDangNhap('uudai', false, 'AB12') === true);
    k('B3 còn mã hoá đơn: trang khác (Menu, Trang chủ) không bị chặn', lg.canDangNhap('menu', false, 'AB12') === false && lg.canDangNhap('trangchu', false, 'AB12') === false);
    k('B3 đăng nhập xong → /uudai để nhận mã', lg.dichSauDangNhap('/uudai', 'AB12') === '/uudai' && lg.dichSauDangNhap('/taikhoan', 'AB12') === '/uudai');
    const app = doc('src/App.jsx');
    k('B3 App truyền maCho vào canDangNhap', /canDangNhap\(trang, dangNhap, maCho\)/.test(app));
    k('B3 link ?ma= vẫn chuyển về /uudai và xoá mã khỏi thanh địa chỉ', /replaceState/.test(app) && /'\/uudai' \+ boMaKhoiDiaChi/.test(app));
  });

  await thu('B2', async () => {
    const uu = doc('src/pages/UuDai.jsx');
    const app = doc('src/App.jsx');
    k('B2 App vẽ UuDai cho cả khách vãng lai (không còn `dangNhap && taiTab(\'uudai\')`)', !/dangNhap && taiTab\('uudai'\)/.test(app) && /taiTab\('uudai'\) && <UuDai/.test(app));
    k('B2 đầu trang: "Ưu đãi của tôi" chỉ khi đã đăng nhập, vãng lai "Ưu đãi"', /dangNhap \? 'Ưu đãi của tôi' : 'Ưu đãi'/.test(uu));
    k('B2 không chữ / số mẫu của demo ("Ưu đãi tháng này", "đến 50%")', !/tháng này|đến 50%|Quyền lợi/.test(uu));
    k('B4 không gọi thêm cửa mới: chỉ layToi / layDiem / layVoucher', !/goi\(/.test(uu) && !/fetch\(/.test(uu) && [...uu.matchAll(/\blay[A-Z][A-Za-z]*/g)].every((m) => ['layToi', 'layDiem', 'layVoucher'].includes(m[0])));
    k('B2 phần riêng khách (nhập mã, voucher, lịch sử) không ngoài nhánh đăng nhập', (uu.match(/<NhanMa/g) || []).length === 1 && (uu.match(/<DanhSachVoucher/g) || []).length === 1);
  });

  console.log('Phần 2 — App thật trong Chromium + POS giả theo hợp đồng v3');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goiApp = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const luuAnh = process.env.LUU_ANH_DIR || '';

  // POS giả. `P` chỉnh từng ca: gv (Giờ vàng), khach (ghi đè hồ sơ), het401 (/diem trả 401), voucher.
  async function ca(ten, { rong = 390, token = 'tok-A', gio = '20:30:00', pos = {} } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.clock.install({ time: new Date('2026-10-30T07:00:00+07:00') }); await t.clock.resume();
    await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ } });
    await t.addInitScript((tk) => { if (tk && !sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); localStorage.setItem('kh_token', tk); } }, token);
    const S = { goi: [], khach: { ...KHACH, ...pos.khach } };
    const hopLe = (a) => a === 'Bearer tok-A' || a === 'Bearer tok-N';
    await t.route(`${URL0}/**`, async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      let than; try { than = r.request().postData() ? JSON.parse(r.request().postData()) : undefined; } catch { than = undefined; }
      S.goi.push({ pt: r.request().method(), duong, auth, than });
      if (duong === '/gio-vang') return json(200, pos.gv || GV_TAT);
      if (duong === '/hang') return pos.hangHong ? json(500, { error: 'lỗi' }) : json(200, HANG);
      if (duong === '/gio-hoat-dong') return json(200, GHD(gio));
      if (duong === '/menu') return json(200, MENU);
      if (duong === '/dang-nhap/xin-ma') return json(200, { success: true });
      if (duong === '/dang-nhap/xac-minh') return json(200, { success: true, token: 'tok-N', khach: { sdt: '0909123456', ten: 'Nguyễn Linh', ngay_tao: '2026-10-30T08:00:00', xung_ho: 'chi', dia_chi: null } });
      if (!hopLe(auth)) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-11-29T08:00:00' });
      if (duong === '/toi' && r.request().method() === 'PUT') Object.assign(S.khach, than);
      if (duong === '/toi') return json(200, { success: true, khach: S.khach });
      if (duong === '/diem') return pos.het401 ? json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' }) : json(200, { success: true, points: 1250, history: [] });
      if (duong === '/voucher') return json(200, pos.voucher || { success: true, data: [], ma_khach_moi: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(4000);
    try { await chay(t, S, loi); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
    if (loi.length) k(`ca ${ten}: trang không báo lỗi JS`, false, loi[0]);
  }
  const mo = async (t, duong, co = '100%') => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await t.waitForTimeout(700); if (co === '130%') await t.addStyleTag({ content: 'html{font-size:130%}' }); await t.waitForTimeout(150); };
  const khongTran = (t) => t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1);
  const chup = async (t, ten) => { if (luuAnh) await t.screenshot({ path: path.join(luuAnh, ten + '.png') }); };
  const them = (S, duong) => S.goi.filter((g) => g.duong === duong);
  const chu = (t, sel) => t.locator(sel).innerText();
  const co = async (t, sel) => (await t.locator(sel).count()) > 0;

  // B2 — vãng lai mở /uudai: ba cỡ màn × chữ 100% / 130%
  for (const rong of [360, 390, 430]) {
    for (const cs of ['100%', '130%']) {
      await ca(`vanglai-${rong}-${cs}`, { rong, token: '' }, async (t, S) => {
        const nhan = `${rong}/${cs}`;
        await mo(t, '/uudai', cs);
        k(`B1 [${nhan}] vãng lai mở /uudai → ở lại /uudai (không bị đẩy sang đăng nhập)`, new URL(t.url()).pathname === '/uudai', t.url());
        k(`B2 [${nhan}] đầu trang "Ưu đãi" (không "của tôi")`, (await chu(t, '#rewards h1')) === 'Ưu đãi', await chu(t, '#rewards h1'));
        const the = await chu(t, '#rewards .tier-card');
        k(`B2 [${nhan}] thẻ "Hạng thành viên" liệt kê các hạng của POS (tên + % giảm)`, /Hạng thành viên/.test(the) && /Bạc/.test(the) && /5%/.test(the) && /Vàng/.test(the) && /10%/.test(the), the);
        k(`B2 [${nhan}] khối khoá "Đăng nhập để xem điểm, ví và voucher"`, /Đăng nhập để xem điểm, ví và voucher/.test(await chu(t, '#rewards .the-moi')));
        k(`B2 [${nhan}] KHÔNG thấy điểm, ví, voucher, ô nhập mã, lịch sử`, !(await co(t, '#rewards .wallet-row')) && !(await co(t, '#rewards .voucher')) && !(await co(t, '#ma-bill')) && !/Lịch sử điểm|Ví voucher|Nhập mã trên hoá đơn/.test(await chu(t, '#rewards')));
        k(`B2 [${nhan}] không có banner Giờ vàng khi POS không có`, !(await co(t, '#rewards .rw-ban')));
        k(`B2 [${nhan}] không "Quyền lợi", không số mẫu của demo`, !/Quyền lợi|1\.250|85\.000|tháng này/.test(await chu(t, '#rewards')));
        k(`B4 [${nhan}] vãng lai không gọi /toi, /diem, /voucher`, ['/toi', '/diem', '/voucher'].every((d) => them(S, d).length === 0));
        k(`B6 [${nhan}] không tràn ngang`, await khongTran(t));
        if (rong === 390 && cs === '100%') await chup(t, 'ung-dung_uudai-vanglai_390');
        if (rong === 360 && cs === '100%') await chup(t, 'ung-dung_uudai-vanglai_360');
        await t.locator('#rewards .the-moi .nut').click(); await t.waitForTimeout(400);
        k(`B2 [${nhan}] bấm khối khoá → /dangnhap?tiep=/uudai`, new URL(t.url()).pathname === '/dangnhap' && new URL(t.url()).searchParams.get('tiep') === '/uudai', t.url());
      });
    }
  }

  await ca('vanglai-hang-hong', { token: '', pos: { hangHong: true } }, async (t) => {
    await mo(t, '/uudai');
    k('B2 POS không trả hạng → ẩn thẻ hạng, không bịa', !(await co(t, '#rewards .tier-card')) && (await co(t, '#rewards .the-moi')));
  });

  await ca('vanglai-giovang-dang', { token: '', pos: { gv: GV_DANG } }, async (t) => {
    await mo(t, '/uudai');
    const bn = await chu(t, '#rewards .rw-ban');
    k('B2 POS có Giờ vàng đang chạy → banner với khung giờ + % của POS, không số mẫu', /20:00/.test(bn) && /22:00/.test(bn) && /30%/.test(bn) && !/50%|tháng này/.test(bn), bn);
    await chup(t, 'ung-dung_uudai-giovang_390');
    await t.locator('#rewards .rw-b').click(); await t.waitForTimeout(600);
    k('B2 nút "Xem món Giờ vàng →" mở Menu nhóm Giờ vàng', new URL(t.url()).pathname === '/menu/gio-vang', t.url());
  });
  await ca('vanglai-giovang-truoc', { token: '', gio: '19:00:00', pos: { gv: { ...GV_DANG, dang_chay: false } } }, async (t) => {
    await mo(t, '/uudai');
    k('B2 Giờ vàng chưa tới giờ ("truoc") vẫn có banner', await co(t, '#rewards .rw-ban'));
  });
  await ca('vanglai-giovang-sau', { token: '', gio: '23:00:00', pos: { gv: { ...GV_DANG, dang_chay: false } } }, async (t) => {
    await mo(t, '/uudai');
    k('B2 Giờ vàng đã hết khung ("sau") → ẩn banner', !(await co(t, '#rewards .rw-ban')));
  });

  // B2 — đã đăng nhập
  for (const rong of [360, 390, 430]) {
    for (const cs of ['100%', '130%']) {
      await ca(`dangnhap-${rong}-${cs}`, { rong, pos: { voucher: VOUCHER } }, async (t, S) => {
        const nhan = `${rong}/${cs}`;
        await mo(t, '/uudai', cs);
        k(`B2 [${nhan}] đã đăng nhập: "Ưu đãi của tôi"`, (await chu(t, '#rewards h1')) === 'Ưu đãi của tôi');
        const the = await chu(t, '#rewards .tier-card');
        k(`B2 [${nhan}] thẻ hạng của khách: Hạng Vàng · Giảm 10% · Thẻ hết hạn 15/11/2026`, /Hạng Vàng/.test(the) && /Giảm 10%/.test(the) && /Thẻ hết hạn:\s*23:59 15\/11\/2026/.test(the) && !/Hạng thành viên/.test(the), the);
        const vi = await chu(t, '#rewards .wallet-row');
        k(`B2 [${nhan}] điểm 1.250 và số dư ví 85.000đ`, /1\.250/.test(vi) && /85\.000đ/.test(vi) && (await t.locator('#rewards .wallet-box').count()) === 2, vi);
        k(`B2 [${nhan}] có voucher, ô nhập mã, lịch sử điểm; không khối khoá`, (await co(t, '#rewards .voucher')) && (await co(t, '#ma-bill')) && /Lịch sử điểm/.test(await chu(t, '#rewards')) && !(await co(t, '#rewards .the-moi')));
        k(`B4 [${nhan}] gọi /toi, /diem, /voucher như cũ, không cửa nào lạ`, S.goi.every((g) => ['/toi', '/diem', '/voucher', '/gio-vang', '/hang', '/gio-hoat-dong', '/menu', '/gia-han'].includes(g.duong)) && them(S, '/diem').length === 1 && them(S, '/voucher').length === 1, JSON.stringify(S.goi.map((g) => g.duong)));
        k(`B6 [${nhan}] không tràn ngang`, await khongTran(t));
        if (rong === 390 && cs === '100%') await chup(t, 'ung-dung_uudai-dangnhap_390');
      });
    }
  }
  await ca('dangnhap-hang-null', { pos: { khach: { hang: null } } }, async (t) => {
    await mo(t, '/uudai');
    const the = await chu(t, '#rewards .tier-card');
    k('B2 đã đăng nhập, hang: null → bảng hạng như vãng lai, vẫn có điểm + ví', /Hạng thành viên/.test(the) && /Vàng/.test(the) && (await t.locator('#rewards .wallet-box').count()) === 2, the);
  });
  await ca('dangnhap-vi-thieu', { pos: { khach: { so_du_vi: undefined } } }, async (t) => {
    await mo(t, '/uudai');
    k('B2 POS không trả so_du_vi → ẩn ô ví, không hiện 0đ', (await t.locator('#rewards .wallet-box').count()) === 1 && !/0đ/.test(await chu(t, '#rewards .wallet-row')));
  });

  // B3 — link QR hoá đơn khi chưa đăng nhập
  await ca('qr-ma', { token: '' }, async (t, S) => {
    await t.goto(URL0 + '/?ma=AB12'); await t.waitForSelector('.phone'); await t.waitForTimeout(800);
    k('B3 mở link ?ma=AB12 chưa đăng nhập → vào thẳng màn đăng nhập, mã đã xoá khỏi thanh địa chỉ', new URL(t.url()).pathname === '/dangnhap' && !/ma=/.test(t.url()), t.url());
    k('B3 màn đăng nhập có dòng mã hoá đơn', /Đăng nhập để nhận điểm cho hoá đơn này/.test(await chu(t, '#login')));
    await t.locator('#sdt').fill('0909123456'); await t.getByRole('button', { name: 'Tiếp tục' }).click();
    await t.locator('#ma').fill('123456'); await t.getByRole('button', { name: 'Xác nhận' }).click(); await t.waitForTimeout(900);
    k('B3 đăng nhập xong → về /uudai, ô nhập mã điền sẵn AB12', new URL(t.url()).pathname === '/uudai' && (await t.locator('#ma-bill').inputValue()) === 'AB12', t.url());
  });
  await ca('qr-ma-dong-dn', { token: '' }, async (t) => {
    await t.goto(URL0 + '/?ma=AB12'); await t.waitForSelector('.phone'); await t.waitForTimeout(800);
    await t.getByRole('button', { name: 'Đóng' }).click(); await t.waitForTimeout(400);
    k('B3 đóng màn đăng nhập → Trang chủ (không đứng ở /uudai mất mã)', new URL(t.url()).pathname === '/trangchu', t.url());
  });

  // B5 — hết phiên khi đang ở /uudai
  await ca('het-phien', { pos: { het401: true } }, async (t) => {
    await mo(t, '/uudai');
    await t.waitForTimeout(500);
    k('B5 hết phiên (401) khi đang ở /uudai → về Trang chủ, chế độ khách ("Chào bạn!")', new URL(t.url()).pathname === '/trangchu' && (await chu(t, '#home h1')) === 'Chào bạn!', t.url());
    await t.locator('.tabbar .tab', { hasText: 'Ưu đãi' }).click(); await t.waitForTimeout(500);
    k('B5 bấm tab Ưu đãi lần nữa → bản vãng lai (không đăng nhập)', new URL(t.url()).pathname === '/uudai' && (await co(t, '#rewards .the-moi')) && !(await co(t, '#rewards .wallet-row')));
  });

  // A — lời chào + xưng hô
  for (const rong of [360, 390, 430]) {
    await ca(`chao-${rong}`, { rong }, async (t) => {
      await mo(t, '/trangchu');
      const h1 = await chu(t, '#home h1');
      k(`A1 [${rong}] Trang chủ: giờ POS 20:30 → "Chào buổi tối, chị Linh!"`, h1 === 'Chào buổi tối, chị Linh!', h1);
      k(`A1 [${rong}] lời chào không tràn ngang`, await khongTran(t));
      if (rong === 360) await chup(t, 'ung-dung_trang-chu-dau_360');
    });
  }
  await ca('chao-khach', { token: '' }, async (t) => {
    await mo(t, '/trangchu');
    k('A1 chưa đăng nhập → "Chào bạn!"', (await chu(t, '#home h1')) === 'Chào bạn!');
  });
  await ca('chao-chua-xung-ho', { pos: { khach: { xung_ho: null } } }, async (t) => {
    await mo(t, '/trangchu');
    k('A1 khách cũ chưa có xưng hô → "Chào buổi tối, Linh!"', (await chu(t, '#home h1')) === 'Chào buổi tối, Linh!', await chu(t, '#home h1'));
  });
  await ca('chao-chua-bay-gio', { gio: 'hỏng', pos: { khach: { xung_ho: 'anh' } } }, async (t) => {
    await mo(t, '/trangchu');
    k('A1 POS không trả bay_gio → "Chào anh Linh!"', (await chu(t, '#home h1')) === 'Chào anh Linh!', await chu(t, '#home h1'));
  });
  await ca('chao-chua-ten', { pos: { khach: { ten: '' } } }, async (t) => {
    await mo(t, '/trangchu');
    k('A1 có xưng hô, chưa có tên → "Chào buổi tối, chị!"', (await chu(t, '#home h1')) === 'Chào buổi tối, chị!', await chu(t, '#home h1'));
  });

  for (const rong of [360, 390, 430]) {
    for (const cs of ['100%', '130%']) {
      await ca(`hoso-${rong}-${cs}`, { rong }, async (t) => {
        const nhan = `${rong}/${cs}`;
        await mo(t, '/taikhoan/thongtin', cs);
        const chips = await t.locator('.pf-chips button').allInnerTexts();
        k(`A3 [${nhan}] 7 nút xưng hô viết chữ thường như demo`, chips.join(' · ') === 'anh · chị · cô · chú · bác · em · bạn', chips.join(' · '));
        const pv = await chu(t, '.pf-prev');
        k(`A4 [${nhan}] xem trước “Chào buổi tối, chị Linh!”, xưng hô in đậm`, /Chào buổi tối,\s*chị\s*Linh!/.test(pv) && (await chu(t, '.pf-prev b')) === 'chị', pv);
        k(`A4 [${nhan}] không tràn ngang`, await khongTran(t));
        if (rong === 360 && cs === '100%') await chup(t, 'ung-dung_thong-tin-ca-nhan_360');
        if (rong === 390 && cs === '100%') {
          await t.locator('.pf-chips button', { hasText: 'anh' }).click(); await t.waitForSelector('.save-ok');
          k('A4 chọn "anh" → xem trước “… anh Linh!” ngay', /anh\s*Linh!/.test(await chu(t, '.pf-prev')));
        }
      });
    }
  }
  await ca('hoso-chua-ten', { pos: { khach: { ten: '' } } }, async (t) => {
    await mo(t, '/taikhoan/thongtin');
    k('A4 chưa có tên: xem trước “Chào buổi tối, chị!”, không khoảng trắng thừa trước "!"', /Chào buổi tối,\s*chị!/.test(await chu(t, '.pf-prev')), await chu(t, '.pf-prev'));
  });
  await ca('dang-ky-buoc-3', { token: '' }, async (t) => {
    await mo(t, '/dangnhap');
    // POS giả trả CAN_TEN? Không — vào thẳng bước 3 bằng cách bắt xac-minh trả CAN_TEN.
    await t.route(`${URL0}/api/kh/dang-nhap/xac-minh`, (r) => (JSON.parse(r.request().postData() || '{}').ten ? r.fallback() : r.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'Cần thêm thông tin', code: 'CAN_TEN' }) })));
    await t.locator('#sdt').fill('0909123456'); await t.getByRole('button', { name: 'Tiếp tục' }).click();
    await t.locator('#ma').fill('123456'); await t.getByRole('button', { name: 'Xác nhận' }).click(); await t.waitForSelector('.xh');
    k('A3 bước 3 "Thông tin của bạn": 7 nút xưng hô chữ thường', (await t.locator('.xh').allInnerTexts()).join(' · ') === 'anh · chị · cô · chú · bác · em · bạn', (await t.locator('.xh').allInnerTexts()).join(' · '));
  });

  await trinh.close();
}
