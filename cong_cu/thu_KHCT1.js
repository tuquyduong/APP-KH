#!/usr/bin/env node
// THỬ KH-CT-1 — chương trình đặc biệt ở trang Ưu đãi (GET /chuong-trinh, hợp đồng v9 CT-1a) + "Ưu đãi sinh nhật hôm nay".
// Phần 1: hàm thuần + đọc nguồn (không trình duyệt) · Phần 2: App thật trong Chromium + POS giả theo hợp đồng v9.
// Chạy: node cong_cu/thu_KHCT1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
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

const MENU = { success: true, data: [
  { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
] };
const BAY_GIO = '2026-11-05T20:30:00';
const KHACH = { sdt: '0909123456', ten: 'Nguyễn Linh', ngay_tao: '2026-01-01T08:00:00', xung_ho: 'chi', dia_chi: null, ngay_sinh: '1990-03-12', qr: 'QR', hang: null, so_du_vi: 0 };
const CT_SN = { ma: 'SN', ten: 'Ưu đãi sinh nhật', mo_ta: 'Dành cho khách có sinh nhật trong ngày', loai: 'sinh_nhat', dang_bat: true };
const CT_HS = { ma: 'HSG', ten: 'Học sinh giỏi', mo_ta: '', loai: 'hoc_sinh_gioi', dang_bat: true };
const CT_DAI = { ma: 'DAI', ten: 'Chương trình tri ân khách hàng thân thiết nhân dịp khai trương cửa hàng mới', mo_ta: 'Mô_tả_rất_dài_không_có_dấu_cách_để_thử_tràn_chữ_trong_thẻ_chương_trình_đặc_biệt', loai: 'khac', dang_bat: true };
const MOI_SN = 'Chúc mừng sinh nhật! Mời bạn đến quán, đưa căn cước để nhận ưu đãi hôm nay.';
const MOI_NHAP = 'Nhập ngày sinh ở Thông tin cá nhân để nhận ưu đãi sinh nhật';

(async () => {
  console.log('Phần 1 — hàm thuần + đọc nguồn');

  await thu('A1', async () => {
    const m = await nap('src/chuongTrinh.js');
    const d = m.docChuongTrinh;
    const r = d({ success: true, data: [
      { ma: 'a', ten: 'Sinh nhật', mo_ta: 'x', loai: 'sinh_nhat', dang_bat: true },
      { ma: 'b', ten: 'HSG', mo_ta: 'y', loai: 'hoc_sinh_gioi', dang_bat: true },
      { ma: 'c', ten: 'Khác', mo_ta: 'z', loai: 'khac', dang_bat: true },
    ] });
    k('A1 docChuongTrinh: đủ 3 loại, đúng thứ tự POS, đổi mo_ta → moTa', Array.isArray(r) && r.map((x) => x.loai).join() === 'sinh_nhat,hoc_sinh_gioi,khac' && r.map((x) => x.ma).join() === 'a,b,c' && r[0].moTa === 'x' && r[0].ten === 'Sinh nhật', JSON.stringify(r));
    k('A1 loai lạ / thiếu → khac', d({ data: [{ ten: 'A', loai: 'la' }, { ten: 'B' }] }).map((x) => x.loai).join() === 'khac,khac');
    k('A1 thiếu ten / ten rỗng / dòng không phải object → bỏ', d({ data: [{ ma: 'x', loai: 'khac' }, { ten: '  ' }, null, 'abc', 7, [], { ten: 'Giữ' }] }).map((x) => x.ten).join() === 'Giữ');
    k('A1 dang_bat === false → bỏ; thiếu dang_bat → giữ', d({ data: [{ ten: 'Tắt', dang_bat: false }, { ten: 'Bật', dang_bat: true }, { ten: 'Thiếu' }] }).map((x) => x.ten).join() === 'Bật,Thiếu');
    k('A1 mo_ta thiếu → moTa rỗng (không "undefined")', d({ data: [{ ten: 'A' }] })[0].moTa === '');
    k('A1 KHÔNG sắp lại (thứ tự POS Z,A,M)', d({ data: [{ ten: 'Z' }, { ten: 'A' }, { ten: 'M' }] }).map((x) => x.ten).join('') === 'ZAM');
    k('A1 data không phải mảng / null / undefined → []', [d({ data: {} }), d({ data: 'x' }), d({}), d(null), d(undefined)].every((x) => Array.isArray(x) && x.length === 0));
  });

  await thu('A1b', async () => {
    const s = (await nap('src/chuongTrinh.js')).sinhNhatHomNay;
    k('A1 sinhNhatHomNay: trùng ngày + tháng (khác năm) → true', s('1990-11-05', '2026-11-05') === true);
    k('A1 lệch ngày → false', s('1990-11-04', '2026-11-05') === false && s('1990-11-06', '2026-11-05') === false);
    k('A1 lệch tháng cùng ngày → false', s('1990-10-05', '2026-11-05') === false);
    k('A1 sinh 29/02, năm nay nhuận (2028-02-29) → true; 2028-02-28 → false', s('1992-02-29', '2028-02-29') === true && s('1992-02-29', '2028-02-28') === false);
    k('A1 sinh 29/02, năm nay KHÔNG nhuận → tính 28/02 (true), 01/03 → false', s('1992-02-29', '2027-02-28') === true && s('1992-02-29', '2027-03-01') === false);
    k('A1 sinh 28/02 năm không nhuận vẫn đúng ngày 28/02; năm nhuận 28/02 vẫn true', s('1991-02-28', '2027-02-28') === true && s('1991-02-28', '2028-02-28') === true);
    k('A1 chuỗi sai / thiếu / null → false', [s('', '2026-11-05'), s(null, '2026-11-05'), s(undefined, '2026-11-05'), s('abc', '2026-11-05'), s('1990-13-05', '2026-11-05'), s('1990-02-30', '2026-11-05'), s('1990-11-05', ''), s('1990-11-05', null), s('1990-11-05', 'xx'), s(19901105, '2026-11-05')].every((x) => x === false));
  });

  await thu('A2', async () => {
    const ma = doc('src/api.js').match(/CUA_CONG_KHAI\s*=\s*\[([^\]]*)\]/);
    k("A2 CUA_CONG_KHAI có '/chuong-trinh' (không gửi token)", !!ma && /'\/chuong-trinh'/.test(ma[1]), ma && ma[1]);
    k('A2 vẫn giữ /hang, /gio-vang, /gio-hoat-dong', !!ma && ['/hang', '/gio-vang', '/gio-hoat-dong'].every((x) => ma[1].includes(`'${x}'`)));
  });

  await thu('B-HANG2', async () => {
    const uu = doc('src/pages/UuDai.jsx');
    const than = (uu.replace(/\/\/.*$/gm, '').split('function ChuongTrinhToi')[1] || '').split('\n}\n')[0]; // thân hàm, đã bỏ chú thích
    k('B2 KH-HANG-2: ghiChu chỉ gắn khi i === dauTien (thẻ sinh nhật đầu)', /const dauTien = xep\.findIndex/.test(than) && (than.match(/i === dauTien/g) || []).length === 2);
    k('B1 KH-HANG-2: thân ChuongTrinhToi gọi dungKho(khoGioHoatDong) (phòng thủ: vẽ lại khi bay_gio về)', /^\s*dungKho\(khoGioHoatDong\);/m.test(than));
  });

  await thu('B6', async () => {
    const f = 'src/pages/UuDai.jsx';
    k("B6 UuDai.jsx import src/giaoDien/chuong_trinh.css (không sửa main.jsx)", /import ['"]\.\.\/giaoDien\/chuong_trinh\.css['"]/.test(doc(f)) && fs.existsSync(path.join(GOC, 'src/giaoDien/chuong_trinh.css')));
  });

  console.log('Phần 2 — App thật trong Chromium + POS giả theo hợp đồng v9');
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
  const cssTrang = (f) => (doc(f).match(/import '\.\.\/(giaoDien\/[^']+\.css)'/g) || []).map((s) => cssTron('src/' + /giaoDien\/[^']+\.css/.exec(s)[0])).join('\n');
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n')
    + cssTrang('src/pages/GioHang.jsx') + cssTrang('src/pages/UuDai.jsx');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const luuAnh = process.env.LUU_ANH_DIR || '';

  // POS giả theo v9. `dn` = có token; `ct` = { status, body } cho /chuong-trinh (mặc định 200 + `ds`); `khach` ghi đè hồ sơ;
  // `bayGio` = bay_gio của POS; `may` = đồng hồ máy (khác bay_gio để chứng minh không dùng đồng hồ máy).
  async function ca(ten, { rong = 390, dn = true, ds = [CT_SN, CT_HS], ct = null, khach = {}, bayGio = BAY_GIO, toiLoi = false, may = '2026-11-05T20:30:00+07:00' } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.clock.install({ time: new Date(may) }); await t.clock.resume();
    await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ } });
    if (dn) await t.addInitScript(() => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); localStorage.setItem('kh_token', 'tok-A'); } });
    const S = { goi: [], khach: { ...KHACH, ...khach } };
    t.dangGoi = 0; t.tongGoi = 0; // đếm yêu cầu mạng giả: `yen(t)` chờ tới khi hết yêu cầu và trang đã vẽ xong (thay chờ cố định)
    const xuLy = async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      S.goi.push({ pt: r.request().method(), duong, auth });
      if (duong === '/chuong-trinh') return ct ? json(ct.status, ct.body) : json(200, { success: true, data: ds });
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: bayGio, dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(200, MENU);
      if (auth !== 'Bearer tok-A') return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-12-05T08:00:00' });
      if (duong === '/toi' && toiLoi) return json(500, { error: 'Lỗi máy chủ', code: 'LOI_MAY_CHU' });
      if (duong === '/toi') return json(200, { success: true, khach: S.khach });
      if (duong === '/diem') return json(200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong.startsWith('/don')) return json(200, { success: true, data: [], tong: 0, trang: 1 });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    };
    await t.route(`${URL0}/**`, async (r) => { t.dangGoi++; t.tongGoi++; try { return await xuLy(r); } finally { t.dangGoi--; } });
    t.setDefaultTimeout(4000);
    try { await chay(t, S, loi); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
    if (loi.length) k(`ca ${ten}: trang không báo lỗi JS`, false, loi[0]);
  }
  const yen = async (t) => { let tong = -1, on = 0; for (let lan = 0; lan < 800 && on < 4; lan++) { await t.evaluate(() => new Promise((x) => requestAnimationFrame(() => requestAnimationFrame(x)))); on = !t.dangGoi && t.tongGoi === tong ? on + 1 : 0; tong = t.tongGoi; } if (on < 4) throw new Error('trang chưa yên sau 800 lượt'); }; // ổn định 4 lượt liền, hết trần thì báo (không bỏ qua lặng lẽ)
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await yen(t); };
  const khongTran = (t) => t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1);
  const chup = async (t, ten) => { if (luuAnh) await t.screenshot({ path: path.join(luuAnh, ten + '.png') }); };
  const manText = (t) => t.locator('#rewards').innerText();
  const khoi = (t) => t.locator('.ct-khoi');
  const dem = (S) => S.goi.filter((g) => g.duong === '/chuong-trinh').length;

  // B1 / B5 — chưa đăng nhập
  for (const rong of [360, 390, 430]) {
    await ca(`chua-dn-${rong}`, { rong, dn: false, ds: [CT_SN, CT_DAI] }, async (t, S) => {
      const n = String(rong);
      await mo(t, '/uudai');
      const van = await manText(t);
      k(`B1 [${n}] chưa đăng nhập: có tiêu đề "Chương trình đặc biệt" + tên + "Áp dụng tại quán"`, /Chương trình đặc biệt/.test(van) && /Ưu đãi sinh nhật/.test(van) && /Áp dụng tại quán/.test(van), van.slice(0, 200));
      k(`B1 [${n}] hiện mô tả POS; KHÔNG hiện mức giảm / điều kiện`, /Dành cho khách có sinh nhật trong ngày/.test(van) && !/%|giảm \d|đơn từ/.test(await khoi(t).innerText()));
      k(`B1 [${n}] hai chương trình = hai thẻ, mỗi thẻ có nhãn "Áp dụng tại quán"`, (await khoi(t).locator('.voucher').count()) === 2 && (await khoi(t).getByText('Áp dụng tại quán').count()) === 2);
      k(`B5 [${n}] chưa đăng nhập: không dòng chúc mừng / mời nhập ngày sinh`, !van.includes(MOI_SN) && !van.includes(MOI_NHAP));
      const auth = S.goi.filter((g) => g.duong === '/chuong-trinh').map((g) => g.auth);
      k(`A2 [${n}] GET /chuong-trinh đúng MỘT lần, KHÔNG có Authorization`, auth.length === 1 && auth[0] === '', JSON.stringify(auth));
      k(`B1 [${n}] khối nằm trên thẻ hạng / thẻ mời đăng nhập`, await t.evaluate(() => { const a = document.querySelector('.ct-khoi'), b = document.querySelector('.top-row, .tier-card'); return !!a && (!b || !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)); }));
      k(`B6 [${n}] chữ dài không tràn ngang (cả mô tả không dấu cách)`, await khongTran(t) && await t.evaluate(() => [...document.querySelectorAll('.ct-khoi .voucher')].every((e) => e.getBoundingClientRect().right <= window.innerWidth + 1 && e.scrollWidth <= e.clientWidth + 1)));
      await chup(t, `chua-dn_${rong}`);
    });
  }

  // B1 — đã đăng nhập, không phải sinh nhật: vẫn thấy khối, và phần riêng của khách còn nguyên (K5)
  await ca('dn-thuong', { ds: [CT_SN, CT_HS] }, async (t, S) => {
    await mo(t, '/uudai');
    const van = await manText(t);
    k('B1 đã đăng nhập: thấy khối chương trình', /Chương trình đặc biệt/.test(van) && /Học sinh giỏi/.test(van) && (await khoi(t).locator('.voucher').count()) === 2);
    k('B3 đối chứng (K5): ngày sinh 12/03 ≠ hôm nay → KHÔNG dòng chúc mừng', !van.includes(MOI_SN) && !van.includes(MOI_NHAP));
    k('K5 phần riêng của khách còn nguyên (Nhập mã trên hoá đơn, Ví voucher, Lịch sử điểm)', /Nhập mã trên hoá đơn/.test(van) && /Ví voucher/.test(van) && /Lịch sử điểm/.test(van));
    k('A2 đã đăng nhập: /chuong-trinh vẫn không gửi token, đúng MỘT lần', dem(S) === 1 && S.goi.filter((g) => g.duong === '/chuong-trinh')[0].auth === '');
  });

  // B3 — sinh nhật hôm nay theo bay_gio của POS
  for (const rong of [360, 390, 430]) {
    await ca(`sinh-nhat-${rong}`, { rong, khach: { ngay_sinh: '1990-11-05' }, ds: [CT_HS, CT_SN] }, async (t) => {
      const n = String(rong);
      await mo(t, '/uudai');
      const van = await manText(t);
      k(`B3 [${n}] sinh nhật hôm nay + có thẻ sinh_nhat → dòng chúc mừng đúng chữ`, van.includes(MOI_SN), van.slice(0, 300));
      k(`B3 [${n}] thẻ sinh nhật nổi bật, đứng ĐẦU khối (trước "Học sinh giỏi")`, await t.evaluate(() => { const the = [...document.querySelectorAll('.ct-khoi .voucher')]; return the.length === 2 && /Ưu đãi sinh nhật/.test(the[0].textContent) && the[0].classList.contains('ct-sn') && !the[1].classList.contains('ct-sn'); }));
      k(`B3 [${n}] chỉ MỘT dòng chúc mừng`, van.split(MOI_SN).length === 2);
      k(`B6 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `sinh-nhat_${rong}`);
    });
  }
  await ca('hai-sinh-nhat', { khach: { ngay_sinh: '1990-11-05' }, ds: [CT_HS, CT_SN, { ...CT_SN, ma: 'SN2', ten: 'Sinh nhật vàng' }] }, async (t) => {
    await mo(t, '/uudai');
    k('B3 KH-HANG-2: hai chương trình sinh_nhat → CHỈ MỘT dòng chúc mừng', (await manText(t)).split(MOI_SN).length === 2);
  });
  await ca('sinh-nhat-theo-pos', { khach: { ngay_sinh: '1990-11-05' }, bayGio: '2026-11-05T09:00:00', may: '2026-03-01T09:00:00+07:00' }, async (t) => {
    await mo(t, '/uudai');
    k('B3 "hôm nay" theo bay_gio POS (11-05), KHÔNG theo đồng hồ máy (03-01)', (await manText(t)).includes(MOI_SN));
  });
  await ca('sinh-nhat-may-dung-pos-lech', { khach: { ngay_sinh: '1990-03-01' }, bayGio: '2026-11-05T09:00:00', may: '2026-03-01T09:00:00+07:00' }, async (t) => {
    await mo(t, '/uudai');
    k('B3 đối chứng: sinh 03-01 trùng đồng hồ máy nhưng POS nói 11-05 → KHÔNG chúc mừng', !(await manText(t)).includes(MOI_SN));
  });
  await ca('sinh-nhat-khong-co-the', { khach: { ngay_sinh: '1990-11-05' }, ds: [CT_HS] }, async (t) => {
    const van = (await mo(t, '/uudai'), await manText(t));
    k('B3 đối chứng: hôm nay sinh nhật nhưng POS không có chương trình sinh_nhat → không dòng chúc mừng', !van.includes(MOI_SN) && /Học sinh giỏi/.test(van));
  });

  // B4 — chưa nhập ngày sinh
  for (const rong of [360, 390, 430]) {
    await ca(`chua-nhap-${rong}`, { rong, khach: { ngay_sinh: null } }, async (t) => {
      const n = String(rong);
      await mo(t, '/uudai');
      const van = await manText(t);
      k(`B4 [${n}] ngay_sinh null + có thẻ sinh_nhat → dòng mời nhập đúng chữ, không chúc mừng`, van.includes(MOI_NHAP) && !van.includes(MOI_SN));
      k(`B4 [${n}] dòng mời nằm trong thẻ sinh nhật, chỉ MỘT dòng (thẻ Học sinh giỏi không có)`, (await khoi(t).locator('.voucher', { hasText: 'Ưu đãi sinh nhật' }).getByText(MOI_NHAP).count()) === 1 && van.split(MOI_NHAP).length === 2);
      k(`B6 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `chua-nhap-ngay-sinh_${rong}`);
      if (rong === 390) {
        await t.getByText(MOI_NHAP).click();
        await yen(t);
        k('B4 bấm dòng mời → mở màn Thông tin cá nhân (/taikhoan/thongtin)', new URL(t.url()).pathname === '/taikhoan/thongtin' && /Thông tin/.test(await t.locator('.phone').innerText()), t.url());
      }
    });
  }
  await ca('co-ngay-sinh-khong-moi', { khach: { ngay_sinh: '1985-07-01' } }, async (t) => {
    await mo(t, '/uudai');
    k('B4 đối chứng: đã có ngày sinh khác hôm nay → không dòng mời nhập', !(await manText(t)).includes(MOI_NHAP));
  });
  await ca('chua-nhap-khong-the', { khach: { ngay_sinh: null }, ds: [CT_HS] }, async (t) => {
    await mo(t, '/uudai');
    k('B4 đối chứng: không có chương trình sinh_nhat → không dòng mời nhập', !(await manText(t)).includes(MOI_NHAP));
  });

  await ca('toi-loi', { toiLoi: true }, async (t) => {
    await mo(t, '/uudai');
    const van = await manText(t);
    k('B4 đối chứng: /toi lỗi (chưa biết ngày sinh) → vẫn thấy chương trình nhưng KHÔNG dòng mời nhập / chúc mừng', /Chương trình đặc biệt/.test(van) && !van.includes(MOI_NHAP) && !van.includes(MOI_SN));
  });

  // B2 — rỗng / lỗi / 429 → ẩn
  const AN = [['rong', { ds: [] }], ['500', { ct: { status: 500, body: { error: 'Lỗi máy chủ', code: 'LOI_MAY_CHU' } } }], ['429', { ct: { status: 429, body: { error: 'Thử lại sau', code: 'QUA_NHIEU_LAN' } } }], ['khong-mang', { ct: { status: 200, body: { success: true, data: 'hỏng' } } }]];
  for (const dn of [false, true]) {
    for (const [ten, tuyChon] of AN) {
      await ca(`an-${ten}-${dn}`, { dn, ...tuyChon }, async (t) => {
        await mo(t, '/uudai');
        const van = await manText(t);
        k(`B2 [${ten}, ${dn ? 'đã' : 'chưa'} đăng nhập] ẩn cả khối (không tiêu đề, không "Áp dụng tại quán", không báo lỗi to)`, !/Chương trình đặc biệt/.test(van) && !/Áp dụng tại quán/.test(van) && !/Lỗi máy chủ|Thử lại sau|hỏng/.test(van) && (await khoi(t).count()) === 0, van.slice(0, 200));
        k(`B2 [${ten}, ${dn ? 'đã' : 'chưa'} đăng nhập] phần còn lại của Ưu đãi vẫn hiện`, dn ? /Nhập mã trên hoá đơn/.test(van) : /Ưu đãi/.test(van));
      });
    }
  }

  await trinh.close();
}
