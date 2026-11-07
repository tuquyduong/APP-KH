#!/usr/bin/env node
// THỬ KH-HANG-2 — thẻ hạng theo HANG-1 (hợp đồng v10: chi_cap, goi[], het_han null, thu_bac) + hai sửa khối "Chương trình đặc biệt" (B1 giờ POS về sau, B2 nhiều thẻ sinh nhật).
// Phần 1: hàm thuần + đọc nguồn (không trình duyệt) · Phần 2: App thật trong Chromium + POS giả theo v10.
// Chạy: node cong_cu/thu_KHHANG2.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
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
const boChuThich = (s) => s.replace(/\/\/.*$/gm, '');

const BAY_GIO = '2026-11-05T20:30:00';
const MENU = { success: true, data: [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] }] };
const H_BAC = { id: 1, ten: 'Bạc', phan_tram: 5, phan_tram_nhom_dac_biet: 0, chi_cap: false, goi: [{ so_thang: 3, gia: 300000 }, { so_thang: 12, gia: 1000000 }], thu_bac: 10, gia_the: 300000, thu_tu: 10 };
const H_VANG = { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, chi_cap: false, goi: [], thu_bac: 20, gia_the: null, thu_tu: 20 };
const H_TANG = { id: 3, ten: 'Kim Cương', phan_tram: 15, phan_tram_nhom_dac_biet: 0, chi_cap: true, goi: [], thu_bac: 30, gia_the: null, thu_tu: 30 };
const H_KHONG = { id: 4, ten: 'Thường', phan_tram: 0, phan_tram_nhom_dac_biet: 0, chi_cap: false, goi: [{ so_thang: 1, gia: 50000 }], thu_bac: 1, gia_the: 50000, thu_tu: 1 };
const KHACH = { sdt: '0909123456', ten: 'Nguyễn Linh', ngay_tao: '2026-01-01T08:00:00', xung_ho: 'chi', dia_chi: null, ngay_sinh: '1990-03-12', qr: 'QR', hang: null, so_du_vi: 0 };
const CT_SN = { ma: 'SN', ten: 'Ưu đãi sinh nhật', mo_ta: 'Dành cho khách có sinh nhật trong ngày', loai: 'sinh_nhat', dang_bat: true };
const CT_SN2 = { ma: 'SN2', ten: 'Sinh nhật vàng', mo_ta: 'Thêm quà sinh nhật', loai: 'sinh_nhat', dang_bat: true };
const CT_HS = { ma: 'HSG', ten: 'Học sinh giỏi', mo_ta: '', loai: 'hoc_sinh_gioi', dang_bat: true };
const MOI_SN = 'Chúc mừng sinh nhật! Mời bạn đến quán, đưa căn cước để nhận ưu đãi hôm nay.';
const MOI_NHAP = 'Nhập ngày sinh ở Thông tin cá nhân để nhận ưu đãi sinh nhật';
const TANG = 'Hạng dành tặng khách thân thiết';

(async () => {
  console.log('Phần 1 — hàm thuần + đọc nguồn');
  const g = await nap('src/giaHang.js');

  await thu('A1', async () => {
    k('A1 laHangChiCap: đúng id + chi_cap true → true', g.laHangChiCap([H_BAC, H_TANG], 3) === true);
    k('A1 laHangChiCap: hạng thường / id lạ / ds không phải mảng / chi_cap sai kiểu → false', [g.laHangChiCap([H_BAC, H_TANG], 1), g.laHangChiCap([H_BAC], 99), g.laHangChiCap(null, 3), g.laHangChiCap(undefined, 3), g.laHangChiCap([{ id: 3, chi_cap: 'true' }], 3), g.laHangChiCap([null, 7], 3)].every((x) => x === false));
    k('A1 chữ cố định: "Hạng dành tặng khách thân thiết" / "Không thời hạn"', g.CHU_HANG_TANG === TANG && g.CHU_KHONG_THOI_HAN === 'Không thời hạn');
  });

  await thu('A2', async () => {
    k('A2 dongGoi: hai gói → "3 tháng — 300.000đ", "12 tháng — 1.000.000đ" đúng thứ tự POS', JSON.stringify(g.dongGoi(H_BAC)) === JSON.stringify(['3 tháng — 300.000đ', '12 tháng — 1.000.000đ']), JSON.stringify(g.dongGoi(H_BAC)));
    k('A2 dongGoi: goi rỗng → []', g.dongGoi(H_VANG).length === 0);
    k('A2 dongGoi: hạng chi_cap → [] dù goi có dữ liệu', g.dongGoi({ ...H_TANG, goi: [{ so_thang: 1, gia: 100000 }] }).length === 0);
    k('A2 dongGoi: thiếu goi / goi không phải mảng / h null → []', [g.dongGoi({ ten: 'X' }), g.dongGoi({ goi: 'x' }), g.dongGoi(null), g.dongGoi(undefined)].every((x) => Array.isArray(x) && x.length === 0));
    k('A2 dongGoi: dòng hỏng (gia chuỗi / 0 / âm / NaN, so_thang 0 / lẻ / chuỗi, null) bị bỏ, dòng tốt giữ', JSON.stringify(g.dongGoi({ goi: [{ so_thang: 1, gia: '5' }, { so_thang: 2, gia: 0 }, { so_thang: 3, gia: -1 }, { so_thang: 4, gia: NaN }, { so_thang: 0, gia: 9 }, { so_thang: 1.5, gia: 9 }, { so_thang: '3', gia: 9 }, null, { so_thang: 6, gia: 600000 }] })) === JSON.stringify(['6 tháng — 600.000đ']));
    k('A2 dongGoi KHÔNG đọc gia_the (chỉ có gia_the, không có goi → [])', g.dongGoi({ gia_the: 99000 }).length === 0);
    k('A2 nguồn: UuDai.jsx + giaHang.js không còn đọc gia_the', !/gia_the/.test(boChuThich(doc('src/pages/UuDai.jsx'))) && !/gia_the/.test(boChuThich(doc('src/giaHang.js'))));
    k('A2 nguồn: giaHang.js KHÔNG sắp lại hạng (không .sort)', !/\.sort\(/.test(doc('src/giaHang.js')));
  });

  await thu('A3', async () => {
    k('A3 hangCoGiam vẫn bỏ hạng 0% và dòng sai kiểu, giữ thứ tự POS', g.hangCoGiam([H_VANG, H_KHONG, H_BAC, { id: 9, phan_tram: '5' }]).map((h) => h.id).join() === '2,1');
  });

  await thu('A4', async () => {
    k('A4 chú thích giaHang.js nói thu_bac, không còn "xếp theo thu_tu"', /thu_bac/.test(doc('src/giaHang.js')) && !/xếp theo thu_tu/.test(doc('src/giaHang.js')));
  });

  await thu('A1b', async () => {
    const f = doc('src/pages/UuDai.jsx');
    k('A1 nguồn: TheHang dùng CHU_KHONG_THOI_HAN + laHangChiCap + dongGoi', /CHU_KHONG_THOI_HAN/.test(f) && /laHangChiCap\(/.test(f) && /dongGoi\(/.test(f));
  });

  await thu('B1n', async () => {
    k('B1 nguồn: ChuongTrinhToi đăng ký kho giờ hoạt động (vẽ lại khi bay_gio về)', /function ChuongTrinhToi[\s\S]*?dungKho\(khoGioHoatDong\)/.test(doc('src/pages/UuDai.jsx')));
  });

  await thu('C1', async () => {
    k('C1 UuDai.jsx import src/giaoDien/hang.css; file có; không màu cứng', /import ['"]\.\.\/giaoDien\/hang\.css['"]/.test(doc('src/pages/UuDai.jsx')) && fs.existsSync(path.join(GOC, 'src/giaoDien/hang.css')) && !/#[0-9a-fA-F]{3,6}|rgba?\(/.test(doc('src/giaoDien/hang.css')));
  });

  console.log('Phần 2 — App thật trong Chromium + POS giả theo hợp đồng v10');
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

  // POS giả theo v10. `hang` = /hang; `khach.hang` = hạng của khách; `treGio` = /gio-hoat-dong trả chậm (ms) để /toi về TRƯỚC giờ POS.
  async function ca(ten, { rong = 390, dn = true, ds = [CT_SN, CT_HS], hang = [H_BAC, H_VANG, H_TANG, H_KHONG], khach = {}, bayGio = BAY_GIO, treGio = 0, may = '2026-11-05T20:30:00+07:00' } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.clock.install({ time: new Date(may) }); await t.clock.resume();
    await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ } });
    if (dn) await t.addInitScript(() => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); localStorage.setItem('kh_token', 'tok-A'); } });
    const S = { khach: { ...KHACH, ...khach } };
    await t.route(`${URL0}/**`, async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      if (duong === '/chuong-trinh') return json(200, { success: true, data: ds });
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: hang });
      if (duong === '/gio-hoat-dong') {
        if (treGio) await new Promise((x) => setTimeout(x, treGio));
        return json(200, { success: true, bay_gio: bayGio, dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      }
      if (duong === '/menu') return json(200, MENU);
      if (auth !== 'Bearer tok-A') return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-12-05T08:00:00' });
      if (duong === '/toi') return json(200, { success: true, khach: S.khach });
      if (duong === '/diem') return json(200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong.startsWith('/don')) return json(200, { success: true, data: [], tong: 0, trang: 1 });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(4000);
    try { await chay(t, S, loi); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
    if (loi.length) k(`ca ${ten}: trang không báo lỗi JS`, false, loi[0]);
  }
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await t.waitForTimeout(800); };
  const khongTran = (t) => t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1);
  const chup = async (t, ten) => { if (luuAnh) await t.screenshot({ path: path.join(luuAnh, ten + '.png') }); };
  const manText = (t) => t.locator('#rewards').innerText();
  const theHang = (t) => t.locator('#rewards .tier-card').first().innerText();
  const dem = (van, s) => van.split(s).length - 1;
  const HANG_CO_HAN = { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-12-15T23:59:00' };

  for (const rong of [360, 390, 430]) {
    const n = String(rong);
    await ca(`khach-co-han-${rong}`, { rong, khach: { hang: HANG_CO_HAN } }, async (t) => {
      await mo(t, '/uudai');
      const v = await theHang(t);
      k(`A1 [${n}] khách có hạng + het_han → "Thẻ hết hạn: 23:59 15/12/2026", không "Không thời hạn", không dòng tặng`, /Thẻ hết hạn:\s*23:59 15\/12\/2026/.test(v) && !/Không thời hạn/.test(v) && !v.includes(TANG), v);
      k(`A1 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `the-co-han_${rong}`);
    });
    await ca(`khach-khong-han-${rong}`, { rong, khach: { hang: { ...HANG_CO_HAN, phan_tram_nhom_dac_biet: 0, het_han: null } } }, async (t) => {
      await mo(t, '/uudai');
      const v = await theHang(t);
      k(`A1 [${n}] het_han null (hạng bán thường) → "Không thời hạn", KHÔNG "Thẻ hết hạn", KHÔNG dòng tặng`, /Không thời hạn/.test(v) && !/Thẻ hết hạn/.test(v) && !v.includes(TANG), v);
      k(`A1 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `the-khong-thoi-han_${rong}`);
    });
    await ca(`khach-hang-tang-${rong}`, { rong, khach: { hang: { id: 3, ten: 'Kim Cương', phan_tram: 15, phan_tram_nhom_dac_biet: 0, het_han: null } } }, async (t) => {
      await mo(t, '/uudai');
      const v = await theHang(t);
      k(`A1 [${n}] hạng chi_cap + het_han null → "Không thời hạn" + "${TANG}"`, /Không thời hạn/.test(v) && v.includes(TANG) && /Hạng Kim Cương/.test(v), v);
      k(`A1 [${n}] hạng tặng KHÔNG hiện giá`, !/\d+\.\d{3}đ|\d+ tháng/.test(v));
      k(`A1 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `the-hang-tang_${rong}`);
    });
    await ca(`vang-lai-${rong}`, { rong, dn: false }, async (t) => {
      await mo(t, '/uudai');
      const v = await theHang(t);
      k(`A2 [${n}] bảng hạng: Bạc có hai gói, Vàng không dòng giá, Kim Cương = dòng tặng, không hạng 0%`, /Bạc — giảm 5%/.test(v) && /3 tháng — 300\.000đ/.test(v) && /12 tháng — 1\.000\.000đ/.test(v) && /Vàng — giảm 10%/.test(v) && /Kim Cương — giảm 15%/.test(v) && v.includes(TANG) && !/Thường/.test(v), v);
      k(`A2 [${n}] đúng hai dòng giá (chỉ hạng Bạc); hạng tặng một dòng, không giá`, dem(v, 'đ') === 2 && dem(v, TANG) === 1, v);
      k(`A2 [${n}] thứ tự hạng như POS gửi (Bạc, Vàng, Kim Cương)`, v.indexOf('Bạc') < v.indexOf('Vàng') && v.indexOf('Vàng') < v.indexOf('Kim Cương'));
      k(`A2 [${n}] không có nút mua`, (await t.locator('#rewards .tier-card button').count()) === 0 && !/Mua thẻ|Gia hạn/.test(v));
      k(`A2 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `bang-hang-vang-lai_${rong}`);
    });
  }
  await ca('vang-lai-khong-goi', { dn: false, hang: [H_VANG, H_TANG] }, async (t) => {
    await mo(t, '/uudai');
    const v = await theHang(t);
    k('A2 đối chứng: không hạng nào có gói → không dòng giá nào', dem(v, 'đ') === 0 && !/tháng —/.test(v) && /Vàng — giảm 10%/.test(v));
  });
  await ca('vang-lai-du-lieu-hong', { dn: false, hang: [{ id: 1, ten: 'Bạc', phan_tram: 5, goi: 'hỏng', chi_cap: 'x' }, { id: 2, ten: 'Vàng', phan_tram: 10 }] }, async (t) => {
    await mo(t, '/uudai');
    const v = await theHang(t);
    k('A3 dữ liệu hạng thiếu / sai kiểu → vẫn hiện tên + %, ẩn phần gói, không "undefined"/"NaN"', /Bạc — giảm 5%/.test(v) && /Vàng — giảm 10%/.test(v) && !/undefined|NaN|tháng —|Hạng dành tặng/.test(v), v);
  });
  await ca('khach-thieu-het-han', { khach: { hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 0 } } }, async (t) => {
    await mo(t, '/uudai');
    const v = await theHang(t);
    k('A3 het_han THIẾU hẳn (không phải null) → không "Không thời hạn", không "Thẻ hết hạn", không "undefined"', !/Không thời hạn|Thẻ hết hạn|undefined/.test(v), v);
  });

  // B1 — /toi về TRƯỚC giờ POS; đồng hồ máy lệch ngày
  await ca('b1-hien', { khach: { ngay_sinh: '1990-11-05' }, treGio: 1800, bayGio: '2026-11-05T09:00:00', may: '2026-03-01T09:00:00+07:00' }, async (t) => {
    await t.goto(URL0 + '/uudai'); await t.waitForSelector('.phone'); await t.waitForTimeout(500);
    k('B1 trước khi giờ POS về: chưa chúc mừng (đồng hồ máy 03-01 ≠ 11-05)', !(await manText(t)).includes(MOI_SN));
    await t.waitForTimeout(2500);
    k('B1 giờ POS (11-05) về sau /toi → dòng chúc mừng HIỆN, không cần tải lại', (await manText(t)).includes(MOI_SN), (await manText(t)).slice(0, 200));
  });
  await ca('b1-an', { khach: { ngay_sinh: '1990-03-01' }, treGio: 1800, bayGio: '2026-11-05T09:00:00', may: '2026-03-01T09:00:00+07:00' }, async (t) => {
    await t.goto(URL0 + '/uudai'); await t.waitForSelector('.phone'); await t.waitForTimeout(500);
    k('B1 trước giờ POS: máy nói 03-01 = ngày sinh → đang chúc mừng tạm', (await manText(t)).includes(MOI_SN));
    await t.waitForTimeout(2500);
    k('B1 giờ POS (11-05) về → dòng chúc mừng ẨN đúng theo ngày POS', !(await manText(t)).includes(MOI_SN), (await manText(t)).slice(0, 200));
  });

  // B2 — hai chương trình sinh nhật
  for (const rong of [360, 390, 430]) {
    await ca(`b2-chuc-${rong}`, { rong, khach: { ngay_sinh: '1990-11-05' }, ds: [CT_HS, CT_SN, CT_SN2] }, async (t) => {
      await mo(t, '/uudai');
      const v = await manText(t);
      k(`B2 [${rong}] sinh nhật hôm nay + hai thẻ sinh_nhat → CHỈ MỘT dòng chúc mừng`, dem(v, MOI_SN) === 1, v.slice(0, 300));
      k(`B2 [${rong}] dòng chúc mừng ở thẻ sinh nhật ĐẦU; hai thẻ sinh nhật đứng trước Học sinh giỏi`, await t.evaluate((ms) => { const c = [...document.querySelectorAll('.ct-khoi .voucher')]; return c.length === 3 && c[0].textContent.includes('Ưu đãi sinh nhật') && c[0].textContent.includes(ms) && /Sinh nhật vàng/.test(c[1].textContent) && !c[1].textContent.includes(ms) && /Học sinh giỏi/.test(c[2].textContent); }, MOI_SN));
      k(`B2 [${rong}] cả hai thẻ sinh nhật vẫn hiện, nổi bật như nhau`, (await t.locator('.ct-khoi .voucher.ct-sn').count()) === 2);
      k(`B2 [${rong}] không tràn ngang`, await khongTran(t));
      await chup(t, `hai-sinh-nhat-chuc_${rong}`);
    });
  }
  await ca('b2-moi', { khach: { ngay_sinh: null }, ds: [CT_SN, CT_SN2] }, async (t) => {
    const v = (await mo(t, '/uudai'), await manText(t));
    k('B2 ngay_sinh null + hai thẻ sinh_nhat → CHỈ MỘT dòng mời nhập, ở thẻ đầu', dem(v, MOI_NHAP) === 1 && (await t.locator('.ct-khoi .voucher', { hasText: 'Ưu đãi sinh nhật' }).getByText(MOI_NHAP).count()) === 1);
  });
  await ca('b2-mot-the', { khach: { ngay_sinh: '1990-11-05' }, ds: [CT_SN] }, async (t) => {
    const v = (await mo(t, '/uudai'), await manText(t));
    k('B2 đối chứng (K5): một thẻ sinh_nhat → vẫn có dòng chúc mừng', dem(v, MOI_SN) === 1);
  });

  await trinh.close();
}
