#!/usr/bin/env node
// THỬ KH-HANG-2 — thẻ hạng theo HANG-1 (KH-THE-2: thẻ Ưu đãi theo tình trạng — ca thẻ sửa theo hành vi mới) (hợp đồng v10: chi_cap, goi[], het_han null, thu_bac) + hai sửa khối "Chương trình đặc biệt" (B1 giờ POS về sau, B2 nhiều thẻ sinh nhật).
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
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

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
const TANG = 'Dành tặng khách thân thiết';

(async () => {
  console.log('Phần 1 — hàm thuần + đọc nguồn');
  const g = await nap('src/giaHang.js');
  const uuDai = boChuThich(doc('src/pages/UuDai.jsx'));
  k('A2 (KH-THE-2 E2) thẻ Ưu đãi có nút ud.the.nutCo / nutMua / nutGiaHan / nutTang → màn Hạng thành viên (moHang)', ['nutCo', 'nutMua', 'nutGiaHan', 'nutTang'].every((x) => new RegExp(`['"]ud\\.the\\.${x}['"]`).test(uuDai)) && /moHang/.test(uuDai));

  await thu('A1', async () => {
    k('A1 laHangChiCap: đúng id + chi_cap true → true', g.laHangChiCap([H_BAC, H_TANG], 3) === true);
    k('A1 laHangChiCap: hạng thường / id lạ / ds không phải mảng / chi_cap sai kiểu → false', [g.laHangChiCap([H_BAC, H_TANG], 1), g.laHangChiCap([H_BAC], 99), g.laHangChiCap(null, 3), g.laHangChiCap(undefined, 3), g.laHangChiCap([{ id: 3, chi_cap: 'true' }], 3), g.laHangChiCap([null, 7], 3)].every((x) => x === false));
    k('A1 chữ cố định: "Dành tặng khách thân thiết · không thời hạn" / "Không thời hạn" (KH-THE-2: khoá ud.the.*)', !('CHU_HANG_TANG' in g) && !('CHU_KHONG_THOI_HAN' in g) && new RegExp(`'ud\\.the\\.tang', '[^']*', '${TANG} · không thời hạn'`).test(doc('src/noiDung/nd/taiKhoan.js')) && /'ud\.the\.khongHan', '[^']*', 'Không thời hạn'/.test(doc('src/noiDung/nd/taiKhoan.js'))); // KH-ND-3c: chữ ở danh mục
  });

  await thu('A2', async () => {
    // KH-THE-2: thẻ Ưu đãi không liệt kê mọi gói nữa (dongGoi bỏ) — giá "Từ …" = gói rẻ nhất của giaCot, cùng luật lọc gói hỏng (goiBan), không đọc gia_the.
    k('A2 dongGoi bỏ; giaCot: gói rẻ nhất "/ N tháng" (300.000đ / 3 tháng), đúng thứ tự POS không sắp lại', !('dongGoi' in g) && JSON.stringify(g.giaCot(H_BAC)) === JSON.stringify({ k: 'tier.cmp.moiNThang', gia: 300000, so: 3 }), JSON.stringify(g.giaCot(H_BAC)));
    k('A2 giaCot: goi rỗng → chuaBan; chi_cap → quanTang dù goi có dữ liệu', g.giaCot(H_VANG).k === 'tier.cmp.chuaBan' && g.giaCot({ ...H_TANG, goi: [{ so_thang: 1, gia: 100000 }] }).k === 'tier.cmp.quanTang');
    k('A2 giaCot: thiếu goi / goi không phải mảng / h null → chuaBan', [g.giaCot({ ten: 'X' }), g.giaCot({ goi: 'x' }), g.giaCot(null), g.giaCot(undefined)].every((x) => x.k === 'tier.cmp.chuaBan' && x.gia === null));
    k('A2 giaCot: dòng hỏng (gia chuỗi / 0 / âm / NaN, so_thang 0 / lẻ / chuỗi, null) bị bỏ, dòng tốt giữ', JSON.stringify(g.giaCot({ goi: [{ so_thang: 1, gia: '5' }, { so_thang: 2, gia: 0 }, { so_thang: 3, gia: -1 }, { so_thang: 4, gia: NaN }, { so_thang: 0, gia: 9 }, { so_thang: 1.5, gia: 9 }, { so_thang: '3', gia: 9 }, null, { so_thang: 6, gia: 600000 }] })) === JSON.stringify({ k: 'tier.cmp.moiNThang', gia: 600000, so: 6 }));
    k('A2 giaCot KHÔNG đọc gia_the (chỉ có gia_the, không có goi → chuaBan)', g.giaCot({ gia_the: 99000 }).k === 'tier.cmp.chuaBan');
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
    const jsx = boChuThich(f);
    k('A1 nguồn: TheHang DÙNG khoá ud.the.khongHan, ud.the.tang và trangThaiTheUuDai(hạng có giảm của /hang…) (KH-THE-2)', /<Chu k="ud\.the\.khongHan"/.test(jsx) && /'ud\.the\.tang'/.test(jsx) && /trangThaiTheUuDai\(ds, /.test(jsx) && /const ds = hangCoGiam\(dsHang\)/.test(jsx));
  });

  await thu('B1n', async () => {
    const than = (boChuThich(doc('src/pages/UuDai.jsx')).split('function ChuongTrinhToi')[1] || '').split('\n}\n')[0]; // chỉ thân hàm, đã bỏ chú thích
    k('B1 nguồn: thân ChuongTrinhToi gọi dungKho(khoGioHoatDong) như một câu lệnh (vẽ lại khi bay_gio về)', /^\s*dungKho\(khoGioHoatDong\);/m.test(than) && /sinhNhatHomNay\(/.test(than), than.slice(0, 120));
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
    t.dangGoi = 0; t.tongGoi = 0; // đếm yêu cầu mạng giả: `yen(t)` chờ tới khi hết yêu cầu và trang đã vẽ xong (thay chờ cố định)
    S.cuaGio = new Promise((x) => { S.moGio = x; }); // treGio: /gio-hoat-dong giữ lại tới khi ca gọi S.moGio() (thay chờ thật 1,8 giây)
    const xuLy = async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      if (duong === '/chuong-trinh') return json(200, { success: true, data: ds });
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: hang });
      if (duong === '/gio-hoat-dong') {
        if (treGio) await S.cuaGio;
        return json(200, { success: true, bay_gio: bayGio, dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      }
      if (duong === '/menu') return json(200, MENU);
      if (auth !== 'Bearer tok-A') return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-12-05T08:00:00' });
      if (duong === '/toi') { S.daToi = true; return json(200, { success: true, khach: S.khach }); }
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
  const veXong = (t) => t.evaluate(() => new Promise((x) => requestAnimationFrame(() => requestAnimationFrame(x))));
  const yen = async (t) => { let tong = -1, on = 0; for (let lan = 0; lan < 800 && on < 4; lan++) { await veXong(t); on = !t.dangGoi && t.tongGoi === tong ? on + 1 : 0; tong = t.tongGoi; } if (on < 4) throw new Error('trang chưa yên sau 800 lượt'); }; // ổn định 4 lượt liền, hết trần thì báo (không bỏ qua lặng lẽ)
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await yen(t); };
  // Mở /uudai khi /gio-hoat-dong còn bị giữ: chờ /toi về và trang vẽ xong, rồi trả lời giờ POS (thay hai lần chờ thật 0,5 + 2,5 giây).
  const moTreGio = async (t, S) => { await t.goto(URL0 + '/uudai'); await t.waitForSelector('.phone'); for (let i = 0; i < 400 && !S.daToi; i++) await t.waitForTimeout(10); for (let i = 0; i < 4; i++) await veXong(t); };
  const veGio = async (t, S) => { S.moGio(); await yen(t); };
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
      k(`A1 [${n}] khách có hạng + het_han → "Hết hạn 15/12/2026 · còn 40 ngày", không "Không thời hạn", không dòng tặng`, /Hết hạn 15\/12\/2026[\s\S]*còn 40 ngày/.test(v) && !/Không thời hạn/.test(v) && !v.includes(TANG), v);
      k(`A1 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `the-co-han_${rong}`);
    });
    await ca(`khach-khong-han-${rong}`, { rong, khach: { hang: { ...HANG_CO_HAN, phan_tram_nhom_dac_biet: 0, het_han: null } } }, async (t) => {
      await mo(t, '/uudai');
      const v = await theHang(t);
      k(`A1 [${n}] het_han null (hạng bán thường) → "Không thời hạn", KHÔNG "Hết hạn", KHÔNG dòng tặng`, /Không thời hạn/.test(v) && !/Hết hạn/.test(v) && !v.includes(TANG), v);
      k(`A1 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `the-khong-thoi-han_${rong}`);
    });
    await ca(`khach-hang-tang-${rong}`, { rong, khach: { hang: { id: 3, ten: 'Kim Cương', phan_tram: 15, phan_tram_nhom_dac_biet: 0, het_han: null } } }, async (t) => {
      await mo(t, '/uudai');
      const v = await theHang(t);
      k(`A1 [${n}] hạng chi_cap + het_han null → "${TANG} · không thời hạn"`, v.includes(`${TANG} · không thời hạn`) && /Kim Cương/.test(v), v);
      k(`A1 [${n}] hạng tặng KHÔNG hiện giá`, !/\d+\.\d{3}đ|\d+ tháng/.test(v));
      k(`A1 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `the-hang-tang_${rong}`);
    });
    await ca(`vang-lai-${rong}`, { rong, dn: false }, async (t) => {
      await mo(t, '/uudai');
      const v = await theHang(t);
      // KH-THE-2 E2: chưa hạng → MỘT hạng bán đầu tiên (Bạc), giá gói rẻ nhất, không liệt kê mọi hạng / mọi gói.
      k(`A2 [${n}] chưa có thẻ: hạng bán đầu tiên Bạc, "Giảm 5% mọi đơn", "Từ 300.000đ / 3 tháng"; không liệt kê Vàng / Kim Cương / 12 tháng`, /Trở thành hội viên[\s\S]*Bạc/.test(v) && /Giảm 5% mọi đơn/.test(v) && /Từ[\s\S]*300\.000đ[\s\S]*\/ 3 tháng/.test(v) && !/Vàng|Kim Cương|1\.000\.000đ|Thường/.test(v), v);
      k(`A2 [${n}] chỉ một nút "Xem & mua thẻ ›" (mở màn Hạng thành viên), không nút Gia hạn`, (await t.locator('#rewards .tier-card button').count()) === 1 && (await t.locator('#rewards .tier-card button').innerText()).trim() === 'Xem & mua thẻ ›' && !/Gia hạn/.test(v));
      k(`A2 [${n}] không tràn ngang`, await khongTran(t));
      await chup(t, `bang-hang-vang-lai_${rong}`);
    });
  }
  await ca('vang-lai-khong-goi', { dn: false, hang: [H_VANG, H_TANG] }, async (t) => {
    await mo(t, '/uudai');
    const v = await theHang(t);
    k('A2 đối chứng: không hạng nào bán được → ẩn thẻ (không dòng giá nào)', (await t.locator('#rewards .tier-card').count()) === 0 && dem(await manText(t), 'đ') === 0);
  });
  await ca('vang-lai-du-lieu-hong', { dn: false, hang: [{ id: 1, ten: 'Bạc', phan_tram: 5, goi: 'hỏng', chi_cap: 'x' }, { id: 2, ten: 'Vàng', phan_tram: 10 }] }, async (t) => {
    await mo(t, '/uudai');
    const v = await manText(t);
    k('A3 dữ liệu hạng thiếu / sai kiểu (không gói bán được) → ẩn thẻ, không "undefined"/"NaN"', (await t.locator('#rewards .tier-card').count()) === 0 && !/undefined|NaN/.test(v), v.slice(0, 200));
  });
  await ca('khach-thieu-het-han', { khach: { hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 0 } } }, async (t) => {
    await mo(t, '/uudai');
    const v = await theHang(t);
    k('A3 het_han THIẾU hẳn (không phải null) → không "Không thời hạn", không "Hết hạn", không "undefined"', /Hạng của bạn[\s\S]*Vàng/.test(v) && !/Không thời hạn|Hết hạn|undefined/.test(v), v);
  });

  // B1 — /toi về TRƯỚC giờ POS; đồng hồ máy lệch ngày
  await ca('b1-hien', { khach: { ngay_sinh: '1990-11-05' }, treGio: 1800, bayGio: '2026-11-05T09:00:00', may: '2026-03-01T09:00:00+07:00' }, async (t, S) => {
    await moTreGio(t, S);
    k('B1 trước khi giờ POS về: chưa chúc mừng (đồng hồ máy 03-01 ≠ 11-05)', !(await manText(t)).includes(MOI_SN));
    await veGio(t, S);
    k('B1 giờ POS (11-05) về sau /toi → dòng chúc mừng HIỆN, không cần tải lại', (await manText(t)).includes(MOI_SN), (await manText(t)).slice(0, 200));
  });
  await ca('b1-an', { khach: { ngay_sinh: '1990-03-01' }, treGio: 1800, bayGio: '2026-11-05T09:00:00', may: '2026-03-01T09:00:00+07:00' }, async (t, S) => {
    await moTreGio(t, S);
    k('B1 trước giờ POS: máy nói 03-01 = ngày sinh → đang chúc mừng tạm', (await manText(t)).includes(MOI_SN));
    await veGio(t, S);
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
