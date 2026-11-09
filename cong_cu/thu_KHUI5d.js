#!/usr/bin/env node
// THỬ KH-UI-5d — dải quảng cáo mảnh ở đầu các trang, bỏ ✕ banner, xoá hỏi lại một lần (không Hoàn tác ở Kế hoạch), 4 sửa nhỏ, sửa việc đổi được ngày.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần (quangCao.js, kehoachLap.js, kehoach.js) + đọc nguồn.
// Phần 2: App thật trong Chromium (Playwright có sẵn ở máy; không có / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca): bundle esbuild, POS giả bằng page.route,
// đồng hồ giả (page.clock) để "hôm nay" = 8.11.2026 09:00 giờ VN. Chạy: node cong_cu/thu_KHUI5d.js → dòng cuối "n đạt · m hỏng".
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
const khoGia = (d = {}) => ({ getItem: (x) => (x in d ? d[x] : null), setItem: (x, v) => { d[x] = String(v); }, removeItem: (x) => { delete d[x]; } });

(async () => {
  const QC = await nap('src/quangCao.js'), LP = await nap('src/kehoachLap.js'), KH = await nap('src/kehoach.js');
  const GV = (o = {}) => ({ dang_chay: true, bat_dau: '2026-11-08T08:00:00', ket_thuc: '2026-11-08T10:00:00', phan_tram: 30, mon: ['M1'], ...o });
  const BAY = '2026-11-08 09:00:00';
  const chon = (o) => (QC ? QC.chonQuangCao({ gioVang: null, chuongTrinh: [], bayGio: BAY, quangCao: [], ...o }) : undefined);
  const CT = [{ ma: 'c1', ten: 'Quà sinh nhật', moTa: '', loai: 'sinh_nhat' }, { ma: 'c2', ten: 'Học sinh giỏi', moTa: '', loai: 'hoc_sinh_gioi' }];

  console.log('A3/A4 — chọn chữ quảng cáo (hàm thuần)');
  const g1 = chon({ gioVang: GV() });
  k('A3 Giờ vàng ĐANG chạy → "⏰ Giờ vàng: giảm 30% đến 10:00", đích Menu', !!g1 && g1.chu === '⏰ Giờ vàng: giảm 30% đến 10:00' && g1.dich === 'menu', JSON.stringify(g1));
  k('A3 Giờ vàng đang chạy thắng chương trình đặc biệt', !!chon({ gioVang: GV(), chuongTrinh: CT }) && chon({ gioVang: GV(), chuongTrinh: CT }).dich === 'menu');
  const c1 = chon({ chuongTrinh: CT });
  k('A3 không Giờ vàng, có chương trình → "🎁 Quà sinh nhật" (chương trình đầu theo thứ tự POS), đích Ưu đãi', !!c1 && c1.chu === '🎁 Quà sinh nhật' && c1.dich === 'uudai', JSON.stringify(c1));
  k('A3 Giờ vàng SẮP tới (chưa tới giờ) → coi như không có; rơi xuống chương trình', (chon({ gioVang: GV({ dang_chay: false, bat_dau: '2026-11-08T20:00:00', ket_thuc: '2026-11-08T22:00:00' }), chuongTrinh: CT }) || {}).dich === 'uudai');
  k('A3 Giờ vàng ĐÃ HẾT khung (dù POS còn báo dang_chay) → không dải từ nguồn này', chon({ gioVang: GV({ ket_thuc: '2026-11-08T08:30:00' }) }) === null);
  k('A3 không có gì (không Giờ vàng, không chương trình) → null, KHÔNG chữ mẫu', chon({}) === null && chon({ gioVang: null, chuongTrinh: undefined }) === null);
  const R = (o) => ({ chu_dai: 'Mua 2 tặng 1 Trà Đông Y', dich: 'menu', ma_mon: '', tu_gio: '', den_gio: '', uu_tien: 0, ...o });
  k('A4 dòng quangCao hợp giờ dùng TRƯỚC Giờ vàng / chương trình', (chon({ gioVang: GV(), chuongTrinh: CT, quangCao: [R({ tu_gio: '08:00', den_gio: '12:00' })] }) || {}).chu === 'Mua 2 tặng 1 Trà Đông Y');
  k('A4 dòng ngoài giờ bị bỏ (08:00–08:30 lúc 09:00) → rơi xuống Giờ vàng', (chon({ gioVang: GV(), quangCao: [R({ tu_gio: '08:00', den_gio: '08:30' })] }) || {}).dich === 'menu' && /Giờ vàng/.test((chon({ gioVang: GV(), quangCao: [R({ tu_gio: '08:00', den_gio: '08:30' })] }) || {}).chu));
  k('A4 khung qua nửa đêm (22:00–10:00) hợp lúc 09:00; khung đầy đủ ngày giờ cũng đọc được', !!chon({ quangCao: [R({ tu_gio: '22:00', den_gio: '10:00' })] }) && !!chon({ quangCao: [R({ tu_gio: '2026-11-08T08:00:00', den_gio: '2026-11-08T12:00:00' })] }) && chon({ quangCao: [R({ tu_gio: '2026-11-09 08:00:00', den_gio: '2026-11-09 12:00:00' })] }) === null);
  k('A4 nhiều dòng hợp giờ: uu_tien lớn hơn thắng', (chon({ quangCao: [R({ chu_dai: 'Thấp', uu_tien: 1 }), R({ chu_dai: 'Cao', uu_tien: 5 })] }) || {}).chu === 'Cao');
  k('A4 dòng id="gio_vang" của POS coi như Giờ vàng: có chữ thì dùng khi Giờ vàng đang chạy; Giờ vàng không chạy thì không hiện', (chon({ gioVang: GV(), quangCao: [R({ id: 'gio_vang', chu_dai: 'Giờ vàng hôm nay −30%' })] }) || {}).chu === 'Giờ vàng hôm nay −30%' && chon({ gioVang: GV({ ket_thuc: '2026-11-08T08:30:00' }), quangCao: [R({ id: 'gio_vang', chu_dai: 'Giờ vàng hôm nay −30%' })] }) === null);
  k('A5 đích: dòng `mon` mang ma_mon; `dich` rỗng / lạ → "" (không "Xem ›", không làm gì); `mon` thiếu ma_mon → ""', (chon({ quangCao: [R({ dich: 'mon', ma_mon: 'M7' })] }) || {}).maMon === 'M7' && (chon({ quangCao: [R({ dich: '' })] }) || {}).dich === '' && (chon({ quangCao: [R({ dich: 'xyz' })] }) || {}).dich === '' && (chon({ quangCao: [R({ dich: 'mon' })] }) || {}).dich === '' && (chon({ quangCao: [R({ dich: 'tracnghiem' })] }) || {}).dich === 'tracnghiem');
  k('A4 dòng hỏng (không chữ / không phải chuỗi) bị bỏ, không vỡ', chon({ quangCao: [null, 5, R({ chu_dai: '' }), R({ chu_dai: 12 })] }) === null);
  k('A2 danh sách trang có dải: menu · uudai · giohang · kehoach · tienich · taikhoan; KHÔNG thanhtoan / theodoi / dangnhap / trangchu / qr', !!QC && ['menu', 'uudai', 'giohang', 'kehoach', 'tienich', 'taikhoan'].every((x) => QC.coDai(x)) && ['thanhtoan', 'theodoi', 'dangnhap', 'trangchu', 'qr', 'mon', 'thongtin', 'donhang', 'hotro'].every((x) => !QC.coDai(x)));

  console.log('D3/E1 — hàm thuần Kế hoạch');
  const HN = { d: 8, m: 11, y: 2026 };
  const tn = LP && LP.tachNhanh;
  k('D3 "Uống 1/2" hiểu được ngày → { tieu "Uống", ngay 2027-02-01 }; bấm "Không phải ngày" → giữ nguyên chữ, không ngày', !!tn && bang(tn('Uống 1/2', HN, false), { tieu: 'Uống', ngay: '2027-02-01' }) && bang(tn('Uống 1/2', HN, true), { tieu: 'Uống 1/2', ngay: '' }) && bang(tn('Cà phê', HN, false), { tieu: 'Cà phê', ngay: '' }));
  const viec = (o) => ({ id: 'a', ngay: '2026-11-08', gio: '', tieu: 'Uống thuốc', nhac: null, xong: false, ...o });
  const lap = { k: 'ngay', n: 1, den: '' };
  const b0 = { viec: [viec({ lap, lanXong: ['2026-11-08', '2026-11-09'] }), viec({ id: 'b', tieu: 'Gọi điện' })], leNhac: {} };
  const e1 = KH.suaViec(b0, 'a', { tieu: 'Uống thuốc', gio: '', nhac: null, lap, ngay: '2026-11-12' });
  k('E1 việc lặp: đổi ngày bắt đầu → ngày mới; lần đã tick trước đó giữ nguyên; chuỗi tính lại từ ngày mới', !!e1 && e1.viec[0].ngay === '2026-11-12' && bang(e1.viec[0].lanXong, ['2026-11-08', '2026-11-09']) && LP.cacLan(e1.viec[0], LP.jd({ d: 1, m: 11, y: 2026 }), LP.jd({ d: 14, m: 11, y: 2026 })).map(LP.chuoiJd).join() === '2026-11-12,2026-11-13,2026-11-14');
  const e2 = KH.suaViec(b0, 'b', { tieu: 'Gọi điện', gio: '', nhac: null, lap: null, ngay: '2026-12-01' });
  k('E1 việc thường: đổi ngày → ngày mới', !!e2 && e2.viec[1].ngay === '2026-12-01' && e2.viec[1].tieu === 'Gọi điện');
  k('E1 ngày gửi sai / thiếu → giữ ngày cũ (không mất việc)', KH.suaViec(b0, 'b', { tieu: 'Gọi điện', gio: '', nhac: null, lap: null, ngay: '2026-02-31' }).viec[1].ngay === '2026-11-08' && KH.suaViec(b0, 'b', { tieu: 'Gọi điện', gio: '', nhac: null, lap: null }).viec[1].ngay === '2026-11-08');

  console.log('B — bỏ ✕ banner (kho + nguồn)');
  const d = { kh_kehoach: JSON.stringify({ v: 1, viec: [], leNhac: {}, anBanner: '2026-11-08' }) };
  const cu = KH.docKeHoach(khoGia(d));
  k('B1 đọc bản lưu CŨ có trường anBanner không lỗi và không giữ lại; ghi không còn trường đó', Array.isArray(cu.viec) && !('anBanner' in cu) && (KH.ghiKeHoach(cu, khoGia(d)), !/anBanner/.test(d.kh_kehoach)) && !('anBanner' in KH.keHoachTrong()));
  k('B1 kho không còn anBannerHomNay / bannerDangAn', !KH.anBannerHomNay && !KH.bannerDangAn);
  const bn = doc('src/components/BannerHomNay.jsx'), tc = doc('src/pages/TrangChu.jsx');
  k('B1 BannerHomNay không còn khiAn / nút ✕ (t-x) / bản mini; Trang chủ không còn khiAn / thông báo "Ẩn ở Lịch và tiện ích"', !/khiAn|t-x|mini/.test(bn) && !/khiAn|anBanner|Ẩn ở Lịch/.test(tc) && /<BannerHomNay[^>]*chon=\{moMenu\}/.test(tc));
  k('B2 BannerNho.jsx đã xoá và không ai import; Kế hoạch / tiện ích không còn banner nhỏ', !fs.existsSync(path.join(GOC, 'src/components/BannerNho.jsx')) && !/BannerNho|bannerDangAn/.test(doc('src/pages/KeHoach.jsx') + doc('src/pages/TienIch.jsx')));
  k('B1 ke_hoach.css không còn luật .t-x của ✕', !/\.t-x/.test(doc('src/giaoDien/ke_hoach.css')));

  console.log('C — xoá hỏi lại một lần, không Hoàn tác ở Kế hoạch (nguồn)');
  const kh = doc('src/pages/KeHoach.jsx'), bnay = doc('src/components/BangNgay.jsx'), bqh = doc('src/components/BangQuaHan.jsx');
  k('C2 Kế hoạch / bảng ngày / bảng quá hạn không còn Hoàn tác; ThongBaoHoanTac.jsx đã xoá', !/Hoàn tác|ThongBaoHoanTac|hoanTac/.test(kh + bnay + bqh) && !fs.existsSync(path.join(GOC, 'src/components/ThongBaoHoanTac.jsx')));
  k('C1 hỏi ngay trong bảng: không window.confirm / confirm(; không còn "Xoá thật?"; dùng component HoiXoa ở cả bảng ngày và bảng quá hạn', !/confirm\(/.test(kh + bnay + bqh) && !/Xoá thật\?/.test(bqh) && /HoiXoa/.test(bnay) && /HoiXoa/.test(bqh) && fs.existsSync(path.join(GOC, 'src/components/HoiXoa.jsx')));
  const gh = doc('src/pages/GioHang.jsx');
  k('C3 Giỏ hàng GIỮ nguyên "Đã xoá … · Hoàn tác" (vẫn dùng gio_xoa.css)', /Hoàn tác/.test(gh) && /Đã xoá/.test(gh) && /gio_xoa\.css/.test(gh));
  k('D1 thanh nhắc đầu Kế hoạch chỉ MỘT chuông: bỏ `<Ico bell>` hoặc emoji 🔔 thừa (không cả hai)', !(/<Ico ten="bell" s=\{14\} \/> <span>🔔/.test(kh)));

  console.log('A1/A2 — nguồn dải');
  const ap = doc('src/App.jsx'), dq = doc('src/components/DaiQuangCao.jsx');
  k('A2 dải gắn MỘT chỗ ở vỏ App, trong khung cuộn `.screens` (cuộn theo trang, không dính)', (ap.match(/<DaiQuangCao/g) || []).length === 1 && ap.indexOf('<DaiQuangCao') > ap.indexOf('className="screens"') && ap.indexOf('<DaiQuangCao') < ap.indexOf('daVaoMenu && <Menu'));
  k('A1 DaiQuangCao import dai_quang_cao.css; CSS không position:sticky/fixed/absolute cho dải, không z-index; có prefers-reduced-motion (qua lớp fx-a của demo); không màu ngoài demo', /dai_quang_cao\.css/.test(dq) && fs.existsSync(path.join(GOC, 'src/giaoDien/dai_quang_cao.css')) && !/sticky|fixed|z-index/.test(doc('src/giaoDien/dai_quang_cao.css')) && /fx-a/.test(dq));
  k('A3 không thêm cửa mới / không sửa api.js: chỉ dùng layChuongTrinh sẵn có; không gọi /quang-cao', /layChuongTrinh/.test(ap) && !/quang-cao/.test(ap + doc('src/api.js') + doc('src/quangCao.js')));
  k('K3 không viết sẵn câu quảng cáo mẫu vào App', !/Mua \d tặng|Khuyến mãi|Giảm \d+%/.test(ap + dq + doc('src/quangCao.js').replace(/Giờ vàng: giảm \$\{/, '')));

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

  async function ca(ten, { rong = 390, luu = {}, gv = GV_CHAY, ct = [], token = true } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 } });
    const t = await ctx.newPage(), loi = [], hop = [];
    t.on('pageerror', (e) => loi.push(e.message)); t.on('dialog', (x) => { hop.push(x.message()); x.dismiss(); });
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } }, { luu: token ? { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT), ...luu } : luu });
    await t.clock.install({ time: new Date(MOC_GIO) });
    await t.route(`${GOC_URL}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Khách thử', ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      if (p === '/api/kh/gio-vang') return json(200, gv);
      if (p === '/api/kh/chuong-trinh') return json(200, { success: true, data: ct });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    try { await chay(t, loi, hop); } finally { await ctx.close(); }
  }
  const mo = async (t, duong) => { await t.goto(GOC_URL + duong); await t.waitForSelector('.phone'); };
  const di = (t, duong) => t.evaluate((d) => { window.history.pushState({ kh: 1 }, '', d); window.dispatchEvent(new PopStateEvent('popstate')); }, duong);
  const luuTho = async (t) => JSON.parse(await t.evaluate(() => localStorage.getItem('kh_kehoach') || '{"viec":[]}')).viec;
  const bangNgay = (t) => t.locator('[role=dialog]');
  const dai = (t) => t.locator('.dai-qc');
  const KE = (viec) => ({ kh_kehoach: JSON.stringify({ v: 1, viec, leNhac: {} }) });
  const hom = (t) => t.locator('.cd.today').first().click();

  // ----- 1. Dải ở đúng các trang
  await ca('dai', {}, async (t, loi) => {
    await mo(t, '/menu'); await dai(t).waitFor();
    const x = await t.evaluate(() => { const e = document.querySelector('.dai-qc'), r = e.getBoundingClientRect(), cs = getComputedStyle(e); return { h: r.height, bk: cs.borderTopLeftRadius, nen: cs.backgroundImage, ct: e.innerText, pos: cs.position, truoc: getComputedStyle(e, '::before').content, mo: e.getAttribute('role') }; });
    k('A1 dải Menu: cao 38 ± 2, bo góc 12px, nền gradient, nhãn "HÔM NAY", câu một dòng, "Xem ›"', Math.abs(x.h - 38) <= 2 && x.bk === '12px' && /gradient/.test(x.nen) && /HÔM NAY/.test(x.ct) && /Giờ vàng: giảm 30% đến 10:00/.test(x.ct) && /Xem ›/.test(x.ct) && x.ct.trim().split('\n').filter(Boolean).length <= 3, JSON.stringify(x));
    k('A1 vệt sáng lướt chéo (lớp fx-a của banner Trang chủ: ::before có nội dung + animation)', x.truoc !== 'none' && (await dai(t).evaluate((e) => getComputedStyle(e, '::before').animationName)) === 'sweepL');
    for (const p of ['/uudai', '/giohang', '/kehoach', '/kehoach/theomua', '/taikhoan', '/menu']) {
      await di(t, p); await t.waitForTimeout(60);
      k(`A2 ${p}: có đúng 1 dải`, (await dai(t).count()) === 1);
    }
    for (const p of ['/trangchu', '/thanhtoan', '/don/ABC12', '/mathanhvien', '/taikhoan/thongtin']) {
      await di(t, p); await t.waitForTimeout(60);
      k(`A2 ${p}: KHÔNG có dải`, (await dai(t).count()) === 0);
    }
    await di(t, '/menu'); await dai(t).waitFor();
    const trong = await t.evaluate(() => { const c = document.querySelector('.screens'), e = document.querySelector('.dai-qc'); c.scrollTop = 0; const a = e.getBoundingClientRect().top; c.scrollTop = 120; return { a, b: e.getBoundingClientRect().top, pos: getComputedStyle(e).position, trong: e.parentElement === c }; });
    k('A2 dải nằm TRONG luồng trang: cuộn thì dải trôi theo (không dính / không đè), không position fixed/sticky/absolute', trong.trong && !['fixed', 'sticky', 'absolute'].includes(trong.pos) && trong.b < trong.a, JSON.stringify(trong));
    await di(t, '/uudai'); await dai(t).click();
    k('A5 bấm dải Giờ vàng → mở Menu', new URL(t.url()).pathname === '/menu', t.url());
    k('E1 không lỗi JS', loi.length === 0, loi.join(' | '));
  });
  await ca('dangnhap', { token: false }, async (t) => {
    await mo(t, '/menu'); await dai(t).waitFor();
    k('A2 khách CHƯA đăng nhập vẫn thấy dải ở Menu / Ưu đãi (nguồn công khai)', (await dai(t).count()) === 1);
    await di(t, '/dangnhap'); await t.waitForTimeout(80);
    k('A2 màn Đăng nhập KHÔNG có dải', (await dai(t).count()) === 0 && new URL(t.url()).pathname === '/dangnhap');
  });
  await ca('khong-nguon', { gv: GV_TAT }, async (t) => {
    await mo(t, '/menu'); await t.waitForTimeout(150);
    k('A3 không Giờ vàng + không chương trình → KHÔNG dải (không để trống, không chữ mẫu)', (await dai(t).count()) === 0);
  });
  await ca('chuong-trinh', { gv: GV_TAT, ct: [{ ma: 'c1', ten: 'Quà sinh nhật', mo_ta: 'Tặng 1 ly', loai: 'sinh_nhat', dang_bat: true }] }, async (t) => {
    await mo(t, '/giohang'); await dai(t).waitFor();
    k('A3 chương trình đặc biệt → "🎁 Quà sinh nhật"', /🎁 Quà sinh nhật/.test(await dai(t).innerText()));
    await dai(t).click();
    k('A5 bấm dải chương trình → mở Ưu đãi', new URL(t.url()).pathname === '/uudai', t.url());
  });
  await ca('het', { gv: { ...GV_CHAY, ket_thuc: '2026-11-08T09:30:00' } }, async (t) => {
    await mo(t, '/menu'); await dai(t).waitFor();
    await t.clock.runFor(31 * 60 * 1000);
    await t.waitForFunction(() => !document.querySelector('.dai-qc'), null, { timeout: 4000 }).catch(() => {});
    k('A3 đồng hồ giả qua giờ kết thúc Giờ vàng (09:30) → dải tự ẩn, không cần tải lại', (await dai(t).count()) === 0);
  });
  await ca('rong360', { rong: 360 }, async (t) => {
    await mo(t, '/kehoach'); await dai(t).waitFor();
    const r = await t.evaluate(() => { const d = document.querySelector('.dai-qc').getBoundingClientRect(), n = document.querySelector('.screen.active .back-btn').getBoundingClientRect(); return { dRight: d.right, dBottom: d.bottom, nTop: n.top, trang: document.documentElement.scrollWidth - innerWidth, tran: document.querySelector('.dai-qc').scrollWidth - document.querySelector('.dai-qc').clientWidth }; });
    k('A2 360px: dải trong màn, không đè nút Quay lại (dải kết thúc trước nút), trang không cuộn ngang', r.dRight <= 360 && r.dBottom <= r.nTop + 1 && r.trang <= 1, JSON.stringify(r));
  });

  // ----- 2. Trang chủ: banner không ✕
  await ca('banner', {}, async (t) => {
    await mo(t, '/trangchu'); await t.locator('.hb-one').waitFor();
    k('B1 banner lớn Trang chủ KHÔNG có nút ✕ và không có thông báo "Ẩn ở Lịch và tiện ích"', (await t.locator('.t-x').count()) === 0 && !/Ẩn ở Lịch/.test(await t.locator('body').innerText()));
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor();
    k('B2 Kế hoạch không còn banner nhỏ chồng với dải', (await t.locator('.today-slot, .today.mini').count()) === 0 && (await dai(t).count()) === 1);
  });

  // ----- 3. Xoá hỏi lại một lần
  const lapNgay = { k: 'ngay', n: 1, den: '' };
  await ca('xoa', { luu: KE([{ id: 'a', ngay: '2026-11-08', gio: '', tieu: 'Gọi điện', nhac: null, xong: false }, { id: 'b', ngay: '2026-11-08', gio: '', tieu: 'Uống thuốc', nhac: null, xong: false, lap: lapNgay, lanXong: [] }, { id: 'c', ngay: '2026-11-05', gio: '', tieu: 'Trả sách', nhac: null, xong: false }]) }, async (t, loi, hop) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor(); await hom(t); await bangNgay(t).waitFor();
    await bangNgay(t).locator('.ti', { hasText: 'Gọi điện' }).click();
    await bangNgay(t).getByRole('button', { name: 'Xoá việc', exact: true }).click();
    k('C1 bấm xoá → hỏi NGAY trong bảng "Xoá việc «Gọi điện»?" với nút Xoá và Huỷ; không hộp thoại của trình duyệt', (await bangNgay(t).innerText()).includes('Xoá việc «Gọi điện»?') && (await bangNgay(t).getByRole('button', { name: 'Xoá', exact: true }).count()) === 1 && (await bangNgay(t).getByRole('button', { name: 'Huỷ', exact: true }).count()) >= 1 && hop.length === 0);
    await bangNgay(t).locator('.hoi-xoa').getByRole('button', { name: 'Huỷ', exact: true }).click();
    k('C1 Huỷ → việc còn nguyên (3 việc), câu hỏi biến mất', (await luuTho(t)).length === 3 && !(await bangNgay(t).innerText()).includes('Xoá việc «Gọi điện»?'));
    await bangNgay(t).getByRole('button', { name: 'Xoá việc', exact: true }).click(); await bangNgay(t).getByRole('button', { name: 'Xoá', exact: true }).click();
    await t.waitForFunction(() => document.querySelector('.toast.show'));
    k('C1 Xoá → mất luôn; báo ngắn "Đã xoá «Gọi điện»" KHÔNG nút; không còn chữ "Hoàn tác" ở trang', !(await luuTho(t)).some((v) => v.tieu === 'Gọi điện') && (await t.locator('.toast').first().innerText()).includes('Đã xoá «Gọi điện»') && (await t.locator('.toast button, .toast.co-nut').count()) === 0 && !/Hoàn tác/.test(await t.locator('body').innerText()));
    await bangNgay(t).locator('.ti', { hasText: 'Uống thuốc' }).click();
    await bangNgay(t).getByRole('button', { name: 'Xoá việc', exact: true }).click();
    k('C1 việc lặp: "Xoá việc lặp «Uống thuốc»? Mọi lần lặp sẽ mất."', (await bangNgay(t).innerText()).includes('Xoá việc lặp «Uống thuốc»? Mọi lần lặp sẽ mất.'));
    await bangNgay(t).getByRole('button', { name: 'Xoá', exact: true }).click();
    k('C1 xoá việc lặp → mất cả chuỗi', !(await luuTho(t)).some((v) => v.tieu === 'Uống thuốc'));
    await t.getByRole('button', { name: 'Đóng' }).click();
    await t.locator('#calQuaHan').click(); await bangNgay(t).waitFor();
    await bangNgay(t).getByRole('button', { name: 'Xoá', exact: true }).click();
    k('C1 bảng quá hạn: bấm Xoá → hỏi «Trả sách» trong bảng; bấm Xoá lần nữa mới mất', (await bangNgay(t).innerText()).includes('Xoá việc «Trả sách»?') && (await luuTho(t)).length === 1);
    await bangNgay(t).locator('.hoi-xoa').getByRole('button', { name: 'Xoá', exact: true }).click();
    k('C1 bảng quá hạn: Xoá xong → mất, không Hoàn tác', (await luuTho(t)).length === 0 && !/Hoàn tác/.test(await t.locator('body').innerText()));
    k('E1 không lỗi JS', loi.length === 0, loi.join(' | '));
  });
  await ca('tick', { luu: KE([{ id: 'a', ngay: '2026-11-08', gio: '', tieu: 'Gọi điện', nhac: null, xong: false }, { id: 'c', ngay: '2026-11-05', gio: '', tieu: 'Trả sách', nhac: null, xong: false }]) }, async (t) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor();
    await t.locator('#calAgenda .ck').first().click();
    await t.waitForFunction(() => document.querySelector('.toast.show'));
    k('C2 tick xong → báo "Đã xong …" KHÔNG có nút Hoàn tác; bấm lại ô tròn bỏ tick', /Đã xong Gọi điện/.test(await t.locator('.toast').first().innerText()) && (await t.locator('.toast button').count()) === 0 && (await luuTho(t)).find((v) => v.id === 'a').xong === true);
    await t.locator('#calAgenda .ck').first().click();
    k('C2 tick lại → bỏ đánh dấu', (await luuTho(t)).find((v) => v.id === 'a').xong === false);
    await t.locator('#calQuaHan').click(); await bangNgay(t).waitFor();
    await bangNgay(t).getByRole('button', { name: '→ Hôm nay' }).click();
    k('C2 dời ngày ở bảng quá hạn → báo không nút Hoàn tác', (await t.locator('.toast button').count()) === 0 && !/Hoàn tác/.test(await t.locator('body').innerText()));
  });

  // ----- 4. D1 / D2: thanh nhắc
  await ca('nhac', { luu: KE([{ id: 'n', ngay: '2026-11-08', gio: '09:30', tieu: 'Hẹn bác sĩ', nhac: 540, xong: false }]) }, async (t) => {
    await mo(t, '/kehoach'); await t.locator('#calNoti .nt-bar').waitFor();
    const chuong = await t.locator('#calNoti .nt-bar').evaluate((e) => e.querySelectorAll('svg').length + (e.innerText.match(/🔔/g) || []).length);
    k('D1 dải nhắc đầu Kế hoạch chỉ MỘT biểu tượng chuông', chuong === 1, String(chuong));
    k('D2 lúc 09:00 chữ đếm "30 phút nữa"', /30 phút nữa/.test(await t.locator('#calNoti').innerText()));
    await t.clock.runFor(60 * 1000);
    await t.waitForFunction(() => /29 phút nữa/.test(document.querySelector('#calNoti').innerText), null, { timeout: 3000 }).catch(() => {});
    k('D2 sau 1 phút (đồng hồ giả) tự đổi thành "29 phút nữa" — không cần tải lại', /29 phút nữa/.test(await t.locator('#calNoti').innerText()), await t.locator('#calNoti').innerText());
    await t.clock.runFor(30 * 60 * 1000);
    await t.waitForFunction(() => !document.querySelector('#calNoti .nt-bar'), null, { timeout: 3000 }).catch(() => {});
    k('D2 qua giờ việc (09:30) → thanh nhắc tự ẩn', (await t.locator('#calNoti .nt-bar').count()) === 0);
  });

  // ----- 5. D3: gõ nhanh có ngày
  await ca('d3', {}, async (t) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor(); await hom(t); await bangNgay(t).waitFor();
    await t.getByLabel('Tên việc').fill('Cà phê');
    k('D3 tên không có ngày → KHÔNG hiện dòng "Sẽ xếp vào ngày"', (await bangNgay(t).getByText(/Sẽ xếp vào ngày/).count()) === 0);
    await t.getByLabel('Tên việc').fill('Uống 1/2');
    k('D3 gõ "Uống 1/2" → TRƯỚC khi bấm Thêm hiện "📅 Sẽ xếp vào ngày 1/2" + nút "Không phải ngày"', /📅 Sẽ xếp vào ngày 1\/2/.test(await bangNgay(t).innerText()) && (await bangNgay(t).getByRole('button', { name: 'Không phải ngày' }).count()) === 1);
    await bangNgay(t).getByRole('button', { name: 'Không phải ngày' }).click();
    k('D3 bấm "Không phải ngày" → dòng biến mất, chữ giữ nguyên', (await bangNgay(t).getByText(/Sẽ xếp vào ngày/).count()) === 0 && (await t.getByLabel('Tên việc').inputValue()) === 'Uống 1/2');
    await bangNgay(t).getByRole('button', { name: 'Thêm', exact: true }).click(); await bangNgay(t).getByText('Việc của tôi · 1 việc').waitFor();
    const v = (await luuTho(t))[0];
    k('D3 → việc "Uống 1/2" ở ngày đang chọn (8/11), không bị đẩy sang 1/2', v && v.tieu === 'Uống 1/2' && v.ngay === '2026-11-08', JSON.stringify(v));
    await t.getByLabel('Tên việc').fill('Mua quà 20/11'); await bangNgay(t).getByRole('button', { name: 'Thêm', exact: true }).click();
    await t.waitForFunction(() => document.querySelector('.toast.show'));
    const w = (await luuTho(t)).find((x) => x.tieu === 'Mua quà');
    k('D3 không bấm "Không phải ngày" → vẫn xếp vào 20/11 như trước (không chặn luồng cũ)', !!w && w.ngay === '2026-11-20');
  });

  // ----- 6. D4: "Xem" ở dải nhắc mở đúng bảng ngày
  const NH = [{ id: 'n', ngay: '2026-11-09', gio: '09:20', tieu: 'Hẹn bác sĩ', nhac: -895, xong: false }]; // mốc 09:05 ngày 8/11, việc ở ngày 9/11
  await ca('d4a', { luu: KE(NH) }, async (t) => {
    await mo(t, '/trangchu'); await t.clock.runFor(6 * 60 * 1000); await t.locator('.dai-nhac').waitFor();
    await t.locator('.dai-nhac .bao-don-xem').click(); await bangNgay(t).waitFor();
    k('D4 từ Trang chủ bấm "Xem" → màn Kế hoạch + bảng ngày 9/11 của việc (không phải hôm nay)', new URL(t.url()).pathname === '/kehoach' && /9\/11/.test(await bangNgay(t).innerText()) && (await bangNgay(t).innerText()).includes('Hẹn bác sĩ'), await bangNgay(t).innerText());
  });
  await ca('d4b', { luu: KE(NH) }, async (t) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor(); await t.clock.runFor(6 * 60 * 1000); await t.locator('.dai-nhac').waitFor();
    await t.locator('.dai-nhac .bao-don-xem').click(); await bangNgay(t).waitFor();
    k('D4 đang ở chính màn Kế hoạch bấm "Xem" → mở bảng ngày 9/11 của việc', /9\/11/.test(await bangNgay(t).innerText()) && (await bangNgay(t).innerText()).includes('Hẹn bác sĩ'));
  });

  // ----- 7. E1: sửa việc đổi ngày
  await ca('sua', { luu: KE([{ id: 'a', ngay: '2026-11-08', gio: '', tieu: 'Gọi điện', nhac: null, xong: false }, { id: 'b', ngay: '2026-11-08', gio: '', tieu: 'Uống thuốc', nhac: null, xong: false, lap: lapNgay, lanXong: ['2026-11-08'] }]) }, async (t, loi) => {
    await mo(t, '/kehoach'); await t.getByText('Tháng 11 · 2026').waitFor(); await hom(t); await bangNgay(t).waitFor();
    await bangNgay(t).locator('.ti', { hasText: 'Gọi điện' }).click();
    const ngay = bangNgay(t).getByRole('spinbutton', { name: 'Ngày', exact: true });
    k('E1 bảng sửa có ô Ngày kiểu bánh xoay (ngày · tháng · năm), KHÔNG ô type=date của trình duyệt', (await ngay.count()) === 1 && (await bangNgay(t).getByRole('spinbutton', { name: 'Tháng', exact: true }).count()) === 1 && (await bangNgay(t).getByRole('spinbutton', { name: 'Năm', exact: true }).count()) === 1 && (await bangNgay(t).locator('input[type=date]').count()) === 0);
    k('E1 ô Ngày hiện đúng ngày của việc (8 / 11 / 2026); việc thường không có chữ "Chuỗi lặp sẽ tính lại"', (await ngay.getAttribute('aria-valuetext')) === '8' && !(await bangNgay(t).innerText()).includes('Chuỗi lặp sẽ tính lại từ ngày mới'));
    await ngay.focus(); await t.keyboard.press('ArrowDown'); await t.keyboard.press('ArrowDown');
    await bangNgay(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    k('E1 việc thường: chọn ngày 10 rồi Lưu → ngày đổi thành 10/11; việc rời bảng ngày 8', (await luuTho(t)).find((v) => v.id === 'a').ngay === '2026-11-10' && !(await bangNgay(t).innerText()).includes('Gọi điện'));
    await bangNgay(t).locator('.ti', { hasText: 'Uống thuốc' }).click();
    const ngay2 = bangNgay(t).getByRole('spinbutton', { name: 'Ngày', exact: true });
    await ngay2.focus(); await t.keyboard.press('ArrowDown'); await t.keyboard.press('ArrowDown'); await t.keyboard.press('ArrowDown');
    k('E1 việc lặp đổi ngày → hiện "Chuỗi lặp sẽ tính lại từ ngày mới" TRƯỚC khi Lưu', (await bangNgay(t).innerText()).includes('Chuỗi lặp sẽ tính lại từ ngày mới'));
    await bangNgay(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    const l = (await luuTho(t)).find((v) => v.id === 'b');
    k('E1 việc lặp: ngày bắt đầu mới 11/11; lần đã tick (8/11) giữ nguyên', l.ngay === '2026-11-11' && l.lanXong.includes('2026-11-08'), JSON.stringify(l));
    k('E1 không lỗi JS', loi.length === 0, loi.join(' | '));
  });
  await trinh.close();
}
