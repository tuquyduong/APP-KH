#!/usr/bin/env node
// THỬ KH-UI-3c — hai ô ở Trang chủ: ô Trắc nghiệm khoá không che chữ (dòng khoá thay dòng phụ); ô Giờ vàng luôn có mặt, mờ khi chưa có.
// Phần 1: dựng ô bằng esbuild + react-dom/server (không trình duyệt) · Phần 2: App thật trong Chromium + POS giả, đo hình.
// Chạy: node cong_cu/thu_KHUI3c.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');

// Dựng <Thành phần> bọc trong NguCanhGia (giá trị do ca đưa vào) rồi render ra chuỗi HTML.
function dungO(tep, tenGoc = 'default') {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import { NguCanhGia } from './heThong.js'; import T from './${tep}';
      export const ve = (props, gia) => renderToStaticMarkup(React.createElement(NguCanhGia.Provider, { value: { tt: null, maGv: new Set(), dsHang: null, hangToi: null, coMenu: false, soMon: 0, ...gia } }, React.createElement(T, props)));`,
    resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', write: false, logLevel: 'silent', define: { 'process.env.NODE_ENV': '"production"' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: tep }).runInThisContext()(m, m.exports, require);
  return m.exports.ve;
}
const chuThuan = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

const BAY = (gio) => `2026-10-30T${gio}`;
const HANG = { success: true, data: [{ id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, gia_the: 199000, thu_tu: 1 }] };
const TOI = { success: true, khach: { sdt: '0909123456', ten: 'Linh', ngay_tao: '2026-01-01T08:00:00', qr: 'QR', hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-11-15T23:59:59' }, so_du_vi: 85000 } };
const MENU = { success: true, data: [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] }] };
const GV_CHAY = { success: true, dang_chay: true, bat_dau: BAY('20:00:00'), ket_thuc: BAY('22:00:00'), phan_tram: 50, mon: ['TLB'] };
const GV_TAT = { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] };
const GHD = { success: true, bay_gio: BAY('20:30:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] };
const DONG_KHOA = 'Đăng nhập để mở khoá chức năng';

(async () => {
  console.log('Phần 1 — dựng ô, đọc nguồn');
  const css = doc('src/giaoDien/giaoDien.css');
  const gv = doc('src/components/OGioVang.jsx');
  k('B1 OGioVang không còn `return null`', !/return null/.test(gv));
  try {
    const veGv = dungO('components/OGioVang.jsx');
    const tat = veGv({ mo() {} }, {});
    k('B1 Giờ vàng chưa có: vẫn vẽ ô hb-tile hb-t-flash, mờ', /hb-tile hb-t-flash/.test(tat) && /hb-mo/.test(tat), tat);
    k('B1 ô mờ: nhãn "Giờ vàng", dòng phụ "Hiện chưa có", viên đỏ "−%"', chuThuan(tat) === '−% Giờ vàng Hiện chưa có', chuThuan(tat));
    k('B1 ô mờ KHÔNG bấm được (không role=button, không tabindex)', !/role="button"|tabindex/.test(tat));
    k('B2 ô mờ: không chữ "suất", không số %, không đếm ngược', !/suất/i.test(tat) && !/\d/.test(tat) && !/hb-s/.test(tat));
    const maGvTrong = veGv({ mo() {} }, { tt: { pha: 'dang', conLai: 100, phanTram: 50 }, coMenu: true, maGv: new Set(), soMon: 3 });
    k('B1 có chương trình nhưng không món ghép được trong menu → cũng ô mờ', /hb-mo/.test(maGvTrong) && !/50/.test(maGvTrong));
    // Ô sáng dùng GvDem (đếm ngược, kho ngoài) nên không dựng được bằng react-dom/server — chữ giữ nguyên đọc ở nguồn, chạy thật ở phần 2.
    k('B1 có chương trình: chữ KH-UI-3a giữ nguyên trong nguồn (món đang giảm / món cuối ngày, đếm ngược, bấm được)', /món đang giảm/.test(gv) && /món cuối ngày/.test(gv) && /GvDem kieu="short"/.test(gv) && /\{\.\.\.bam\(mo\)\}/.test(gv));
  } catch (e) { k('dựng OGioVang', false, String(e && e.message).split('\n')[0]); }
  try {
    const veTn = dungO('components/OTracNghiem.jsx');
    const khach = veTn({ dangNhap: false, klLuu: null, mo() {}, moDangNhap() {} }, {});
    const hv = veTn({ dangNhap: true, klLuu: null, mo() {}, moDangNhap() {} }, {});
    k('A1 khách: giữ hình ô demo (biểu tượng cái cân, nhãn "TRẮC NGHIỆM")', /the-chat-scale\.svg/.test(khach) && /hb-t-quiz/.test(khach) && />Trắc nghiệm</.test(khach) && /hb-mo/.test(khach), khach);
    k('A2 khách: dòng phụ được THAY bằng 🔒 + "Đăng nhập để mở khoá chức năng"; không còn "Bạn thuộc thể chất nào?"', chuThuan(khach) === `Trắc nghiệm 🔒 ${DONG_KHOA}` && !/Bạn thuộc thể chất nào/.test(khach), chuThuan(khach));
    k('A3 khách: không còn viên nổi .khoa-nhan, không bọc khoa-tien-ich / inert', !/khoa-nhan|khoa-tien-ich|inert/.test(khach));
    k('A4 khách: bấm được (role=button) để đi đăng nhập', /role="button"/.test(khach) && /tabindex="0"/.test(khach));
    k('A4 đã đăng nhập: ô thường "Trắc nghiệm Bạn thuộc thể chất nào?", không mờ, không dòng khoá', chuThuan(hv) === 'Trắc nghiệm Bạn thuộc thể chất nào?' && !/hb-mo|🔒/.test(hv), chuThuan(hv));
    const khachCoLuu = veTn({ dangNhap: false, klLuu: { picks: ['kh'] }, mo() {}, moDangNhap() {} }, {});
    k('A2 khách mà máy còn kết quả cũ: vẫn là ô khoá, không lộ thể trạng', chuThuan(khachCoLuu) === `Trắc nghiệm 🔒 ${DONG_KHOA}`, chuThuan(khachCoLuu));
  } catch (e) { k('dựng OTracNghiem', false, String(e && e.message).split('\n')[0]); }
  k('A1/B1 độ mờ ô: một chỗ trong CSS, quanh .55 (.4–.7), dòng khoá không mờ', (() => { const m = /\.hb-mo[^{]*\{[^}]*opacity:\s*(\.\d+|0?\.\d+)/.exec(css); return !!m && +m[1] >= 0.4 && +m[1] <= 0.7; })() && /\.hb-khoa/.test(css) && !/\.hb-khoa[^{]*\{[^}]*opacity/.test(css));
  k('B4 .hb-tiles luôn hai cột: luật "giãn hết hàng khi chỉ một ô" đã bỏ', !/\.hb-tiles:has\(> :only-child\)/.test(css) && /\.hb-tiles\{[^}]*grid-template-columns:\s*1fr 1fr/.test(doc('src/giaoDien/demo_tracnghiem.css')));
  k('A3 KhoaTienIch (khối dùng chung) còn nguyên viên nhãn cho việc sau; OTracNghiem không dùng nó', /khoa-nhan/.test(doc('src/components/KhoaTienIch.jsx')) && !/<KhoaTienIch/.test(doc('src/components/OTracNghiem.jsx')));

  console.log('Phần 2 — App thật trong Chromium');
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
  const goi = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const CHUA_DN = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>');
  const luuAnh = process.env.LUU_ANH_DIR || '';

  async function ca(ten, { rong = 390, dn = true, pos = {} } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.clock.install({ time: new Date('2026-10-30T20:30:00+07:00') }); await t.clock.resume();
    await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ } });
    await t.addInitScript(({ dn }) => { if (dn && !sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); localStorage.setItem('kh_token', 'tok-A'); } }, { dn });
    const P = { gioVang: GV_TAT, hong: {}, ...pos };
    await t.route(`${URL0}/**`, async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: CHUA_DN.replace('</head>', `<style>${css}</style></head>`) });
      const duong = p.slice('/api/kh'.length);
      if (duong === '/gio-vang' && P.tre) await new Promise((x) => setTimeout(x, P.tre));
      if (duong === '/gio-vang') return P.hong.gioVang ? json(500, { error: 'lỗi', code: 'LOI_MAY_CHU' }) : json(200, P.gioVang);
      if (duong === '/hang') return json(200, HANG);
      if (duong === '/gio-hoat-dong') return json(200, GHD);
      if (duong === '/menu') return json(200, MENU);
      if (!auth) return json(401, { error: 'Cần đăng nhập', code: 'KH_PHIEN_SAI' });
      if (duong === '/toi') return json(200, TOI);
      if (duong === '/diem') return json(200, { success: true, points: 1250, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(4000);
    try { await chay(t, loi); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
  }
  const mo = async (t, duong, co = '100%') => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await t.waitForTimeout(700); if (co === '130%') await t.addStyleTag({ content: 'html{font-size:130%}' }); await t.waitForTimeout(150); };

  // Đo: mọi chữ (nhãn / dòng phụ) trong ô không bị phần tử nào khác phủ lên; độ mờ hiệu dụng; chiều cao ô.
  const DO = () => {
    const hieuDung = (e) => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) o *= parseFloat(getComputedStyle(x).opacity); return o; };
    const ra = {};
    for (const [ten, goc] of [['gv', document.querySelector('.hb-t-flash')], ['tn', document.querySelector('.hb-t-quiz')]]) {
      if (!goc) { ra[ten] = null; continue; }
      const r = goc.getBoundingClientRect();
      const chu = [...goc.querySelectorAll('.hb-k,.hb-h,.hb-s')].map((e) => {
        const b = e.getBoundingClientRect();
        const diem = [[b.left + 2, b.top + b.height / 2], [b.left + b.width / 2, b.top + b.height / 2], [b.right - 2, b.top + b.height / 2]];
        const bi = diem.some(([x, y]) => { const tren = document.elementFromPoint(x, y); return !tren || !(e.contains(tren) || tren.contains(e) && tren !== document.body && !!tren.closest('.hb-tile') && tren.closest('.hb-tile') === goc && !tren.matches('.hb-tile,.hb-tx')); });
        return { lop: e.className, chu: e.innerText, mo: +hieuDung(e).toFixed(2), bi, tran: e.scrollWidth > e.clientWidth + 1 || b.right > r.right + 0.5 || b.bottom > r.bottom + 0.5 };
      });
      ra[ten] = { cao: +r.height.toFixed(1), rong: +r.width.toFixed(1), tren: +r.top.toFixed(1), moOng: +hieuDung(goc).toFixed(2), icMo: +hieuDung(goc.querySelector('.hb-ic')).toFixed(2), chu, noi: goc.querySelectorAll('.khoa-nhan,[style*="absolute"]').length, nhan: goc.getAttribute('role') };
    }
    return ra;
  };

  for (const rong of [360, 390, 430]) {
    for (const co of ['100%', '130%']) {
      await ca(`khach-gv-tat-${rong}-${co}`, { rong, dn: false, pos: { gioVang: GV_TAT } }, async (t, loi) => {
        await mo(t, '/trangchu', co);
        const o = await t.evaluate(DO);
        const dong = o.tn && o.tn.chu.find((c) => c.lop.includes('hb-khoa'));
        const nhanTn = o.tn && o.tn.chu.find((c) => c.lop.includes('hb-k'));
        const nhanGv = o.gv && o.gv.chu.find((c) => c.lop.includes('hb-k'));
        const phuGv = o.gv && o.gv.chu.find((c) => c.lop.includes('hb-h'));
        const tag = `${rong}px · chữ ${co}`;
        k(`C1a ${tag}: hai ô một hàng (cùng hàng, hai nửa)`, !!o.gv && !!o.tn && Math.abs(o.gv.tren - o.tn.tren) < 1 && o.gv.rong > rong * 0.3 && o.tn.rong > rong * 0.3 && Math.abs(o.gv.rong - o.tn.rong) < 2, JSON.stringify([o.gv && o.gv.rong, o.tn && o.tn.rong]));
        k(`C1a ${tag}: ô Giờ vàng mờ, chữ "Giờ vàng" + "Hiện chưa có", đọc được (mờ .4–.7)`, !!nhanGv && !!phuGv && phuGv.chu === 'Hiện chưa có' && nhanGv.chu.toLowerCase().includes('giờ vàng') && nhanGv.mo >= 0.4 && nhanGv.mo <= 0.7 && phuGv.mo >= 0.4 && phuGv.mo <= 0.7 && o.gv.icMo >= 0.4 && o.gv.icMo <= 0.7, JSON.stringify(o.gv));
        k(`C1a ${tag}: ô Trắc nghiệm mờ (nhãn), dòng khoá KHÔNG mờ (=1) và có chữ đúng`, !!nhanTn && nhanTn.mo >= 0.4 && nhanTn.mo <= 0.7 && !!dong && dong.mo === 1 && /Đăng nhập để mở khoá chức năng/.test(dong.chu), JSON.stringify(o.tn));
        k(`C1a ${tag}: KHÔNG phần tử nào phủ chồng lên chữ nhãn / dòng khoá; không phần tử nổi trong ô; chữ không tràn ô`, !!o.tn && !!o.gv && o.tn.chu.concat(o.gv.chu).every((c) => !c.bi && !c.tran) && o.tn.noi === 0 && o.gv.noi === 0, JSON.stringify(o));
        k(`C1a ${tag}: ô Giờ vàng không "suất", không số %, không đếm ngược`, !/suất|\d/.test(await t.locator('.hb-t-flash').innerText()));
        k(`C1a ${tag}: Lỗi JS = 0`, loi.length === 0, loi.join('|'));
        if (luuAnh && rong === 390) await t.screenshot({ path: path.join(luuAnh, `chua_dn_${rong}_${co.replace('%', '')}.png`) });
      });
    }
  }

  await ca('hoi-vien-gv-chay', { dn: true, pos: { gioVang: GV_CHAY } }, async (t) => {
    await mo(t, '/trangchu');
    const o = await t.evaluate(DO);
    const dem = await t.locator('.hb-t-flash .hb-s').innerText();
    k('C1b có Giờ vàng đang chạy: ô sáng (không mờ), −50%, "1 món đang giảm", đếm ngược', !!o.gv && o.gv.chu.every((c) => c.mo === 1) && /^Còn 1:(29|30):\d\d$/.test(dem) && /−50%/.test(await t.locator('.hb-t-flash').innerText()) && /1 món đang giảm/.test(await t.locator('.hb-t-flash').innerText()), JSON.stringify(o.gv));
    k('C1c đã đăng nhập: ô Trắc nghiệm bình thường — sáng, "Bạn thuộc thể chất nào?", không dòng khoá', !!o.tn && o.tn.moOng === 1 && o.tn.chu.every((c) => c.mo === 1) && /Bạn thuộc thể chất nào\?/.test(await t.locator('.hb-t-quiz').innerText()) && !/Đăng nhập để mở khoá/.test(await t.locator('.hb-t-quiz').innerText()));
    k('C1b ô Giờ vàng có chương trình bấm được (role=button)', (await t.locator('.hb-t-flash').getAttribute('role')) === 'button');
  });

  await ca('khach-gv-chay', { dn: false, pos: { gioVang: GV_CHAY } }, async (t) => {
    await mo(t, '/trangchu');
    const o = await t.evaluate(DO);
    k('C1b chưa đăng nhập + Giờ vàng đang chạy: ô Giờ vàng sáng, ô Trắc nghiệm mờ với dòng khoá', !!o.gv && o.gv.chu.every((c) => c.mo === 1) && !!o.tn && o.tn.chu.some((c) => c.lop.includes('hb-khoa') && c.mo === 1));
  });

  await ca('gv-loi', { dn: false, pos: { hong: { gioVang: true } } }, async (t, loi) => {
    await mo(t, '/trangchu');
    const o = await t.evaluate(DO);
    const chuTrang = await t.locator('body').innerText();
    k('C1d lỗi /gio-vang: ô Giờ vàng mờ "Hiện chưa có", không chữ lỗi to lên Trang chủ, hai ô vẫn một hàng', !!o.gv && o.gv.chu.every((c) => c.mo >= 0.4 && c.mo <= 0.7) && /Hiện chưa có/.test(await t.locator('.hb-t-flash').innerText()) && !/lỗi|Lỗi|thử lại/.test(await t.locator('.hb-tiles').innerText()) && !!o.tn && Math.abs(o.gv.tren - o.tn.tren) < 1, JSON.stringify(o.gv) + chuTrang.slice(0, 100));
    k('C1d lỗi /gio-vang: Lỗi JS = 0', loi.length === 0, loi.join('|'));
  });

  await ca('cham', { dn: false, pos: { gioVang: GV_TAT } }, async (t) => {
    await mo(t, '/trangchu');
    const truoc = t.url();
    await t.locator('.hb-t-flash').click(); await t.waitForTimeout(400);
    k('C1e chạm ô Giờ vàng mờ → không đi đâu', t.url() === truoc && (await t.locator('.hb-t-flash').count()) === 1, t.url());
    await t.locator('.hb-t-quiz').click(); await t.waitForTimeout(500);
    k('C1e chạm ô Trắc nghiệm khoá → /dangnhap?tiep=/tracnghiem', /\/dangnhap\?tiep=%2Ftracnghiem/.test(t.url()), t.url());
  });

  await ca('tai-lan-dau', { dn: false, pos: { gioVang: GV_CHAY, tre: 2500 } }, async (t) => {
    // B3: /gio-vang về chậm — trong lúc chờ đã có ô mờ (đủ hai ô, không nháy "mất rồi hiện"); dữ liệu về thì ô sáng lên.
    await t.goto(URL0 + '/trangchu'); await t.waitForSelector('.phone'); await t.waitForTimeout(600);
    const dangTai = await t.evaluate(DO);
    k('B3 đang tải lần đầu: đã có đủ hai ô, ô Giờ vàng mờ "Hiện chưa có" (không nháy mất rồi hiện)', !!dangTai.gv && !!dangTai.tn && dangTai.gv.chu.every((c) => c.mo < 1) && /Hiện chưa có/.test(await t.locator('.hb-t-flash').innerText()), JSON.stringify(dangTai.gv));
    await t.waitForTimeout(3500);
    const xong = await t.evaluate(DO);
    k('B3 dữ liệu về, có chương trình → ô Giờ vàng sáng lên', !!xong.gv && xong.gv.chu.every((c) => c.mo === 1) && /Còn 1:/.test(await t.locator('.hb-t-flash').innerText()), JSON.stringify(xong.gv));
  });

  await trinh.close();
}
