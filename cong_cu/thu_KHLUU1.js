#!/usr/bin/env node
// THỬ KH-LUU-1 — dữ liệu lưu trên máy khách: giữ khi hết phiên (401), xoá khi bấm Đăng xuất hoặc người đăng nhập sau là KHÁC khách.
// Phần 1 (luôn chạy): src/luuMay.js nạp thẳng với kho giả + đọc nguồn App / hook.
// Phần 2: CHẠY THẬT App trong Chromium (Playwright có sẵn ở máy; không có thì in "BỎ QUA" — không tính đạt): bundle bằng esbuild, POS giả bằng page.route,
// localStorage thật. Không mạng ngoài. Chạy: node cong_cu/thu_KHLUU1.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);

// Kho giả: { d, getItem, setItem, removeItem }; chan = true → mọi lệnh ném lỗi như cửa sổ riêng tư.
function kho(ban = {}, chan = false) {
  const d = { ...ban };
  const ne = () => { if (chan) throw new Error('SecurityError'); };
  return { d, getItem: (x) => { ne(); return x in d ? d[x] : null; }, setItem: (x, v) => { ne(); d[x] = String(v); }, removeItem: (x) => { ne(); delete d[x]; } };
}

// Dựng một module của app thành CommonJS để chạy trong Node (như thu_KHUI5a).
function dung(xuat) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: xuat, resolveDir: path.join(GOC, 'src'), loader: 'js' }, bundle: true, platform: 'node', format: 'cjs', write: false, logLevel: 'silent', loader: { '.json': 'json' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: 'dung.js' }).runInThisContext()(m, m.exports, require);
  return m.exports;
}

const SDT_A = '0901234567', SDT_B = '0912345678';

(async () => {
  console.log('Phần 1 — luuMay.js (hàm thuần, kho giả)');
  const lm = await nap('src/luuMay.js');
  const { DL } = dung("export { DL } from './noiDung/theChat.js';");
  const BAN = JSON.stringify({ gioiTinh: 'nu', ngay: '2026-10-30 10:00:00', diem: Object.fromEntries(Object.keys(DL.groups).map((g) => [g, 50])), khiHau: 'nong', anToan: [DL.safetyChecklist.nu[0]] });
  const dvA = lm.dauVet(SDT_A);

  k('A1 dauVet: cùng số khác định dạng → bằng; khác số → khác; không chứa số thô', lm.dauVet('090 123 4567') === dvA && lm.dauVet('+84901234567') === dvA && dvA !== lm.dauVet(SDT_B) && !dvA.includes('0123') && dvA.length > 0 && dvA.length <= 16);
  k('A1 dauVet: rỗng / không có số → chuỗi rỗng', lm.dauVet('') === '' && lm.dauVet(undefined) === '' && lm.dauVet('abc') === '');
  const a1 = kho({ kh_chu: dvA });
  k('A1 cungKhach: đúng / sai / chuaBiet', lm.cungKhach(SDT_A, a1) === true && lm.cungKhach(SDT_B, a1) === false && lm.cungKhach(SDT_A, kho()) === 'chuaBiet');
  const a2 = kho();
  k('A1 ghiChu ghi khoá kh_chu = dấu vết, không ghi số thô', lm.ghiChu(SDT_A, a2) === true && a2.d.kh_chu === dvA && !JSON.stringify(a2.d).includes(SDT_A));

  const c1 = kho({ kh_tracnghiem: BAN, kh_chu: dvA, kh_token: 'T' });
  k('A2 doiKhach cùng khách → giữ dữ liệu', lm.doiKhach(SDT_A, c1) === false && c1.d.kh_tracnghiem === BAN && c1.d.kh_chu === dvA);
  const c2 = kho({ kh_tracnghiem: BAN, kh_chu: dvA, kh_token: 'T' });
  k('A2 doiKhach khác khách → xoá dữ liệu, ghi chủ mới, không đụng khoá lạ', lm.doiKhach(SDT_B, c2) === true && !('kh_tracnghiem' in c2.d) && c2.d.kh_chu === lm.dauVet(SDT_B) && c2.d.kh_token === 'T');
  const c3 = kho({ kh_tracnghiem: BAN });
  k('A2 doiKhach: bản lưu cũ chưa có kh_chu → xoá, ghi chủ', lm.doiKhach(SDT_A, c3) === true && !('kh_tracnghiem' in c3.d) && c3.d.kh_chu === dvA);
  const c4 = kho();
  k('A2 doiKhach: chưa có gì → chỉ ghi chủ', lm.doiKhach(SDT_A, c4) === false && c4.d.kh_chu === dvA && Object.keys(c4.d).length === 1);
  const c5 = kho({ kh_tracnghiem: BAN, kh_chu: dvA });
  k('A2 doiKhach: sdt rỗng → không làm gì', lm.doiKhach('', c5) === false && c5.d.kh_tracnghiem === BAN && c5.d.kh_chu === dvA);

  const d1 = kho({ kh_tracnghiem: BAN, kh_chu: dvA, kh_token: 'T', kh_khac: 'x' });
  lm.xoaTatCa(d1);
  k('A3 xoaTatCa xoá dữ liệu khách + kh_chu, không đụng khoá khác', !('kh_tracnghiem' in d1.d) && !('kh_chu' in d1.d) && d1.d.kh_token === 'T' && d1.d.kh_khac === 'x');

  const chan = kho({}, true);
  let ne = null;
  try { k('A4 kho chặn: ghiChu trả sai, cungKhach chuaBiet', lm.ghiChu(SDT_A, chan) === false && lm.cungKhach(SDT_A, chan) === 'chuaBiet'); lm.doiKhach(SDT_A, chan); lm.xoaTatCa(chan); } catch (e) { ne = e; }
  k('A4 kho chặn: doiKhach / xoaTatCa không vỡ', ne === null, ne && ne.message);

  console.log('Nối vào App (đọc nguồn)');
  const app = doc('src/App.jsx'), hk = doc('src/dungTracNghiem.js');
  k('B1 dangXuat gọi xoaTatCa()', /const dangXuat = \(\) => \{[^\n]*xoaTatCa\(\)/.test(app));
  k('B2 donPhien (hết phiên / 401) chỉ dọn bộ nhớ: gọi tn.donBoNho(), KHÔNG xoá khoá', /const donPhien = \(\) => \{[^\n]*tn\.donBoNho\(\)/.test(app) && !/const donPhien = \(\) => \{[^\n]*(xoaTatCa|xoaKetQua|donSach)/.test(app) && /const donBoNho = \(\) => \{(?![^\n]*xoaKetQua)[^\n]*datLuu\(null\)/.test(hk));
  k('B3 App gọi layToi → doiKhach(khach.sdt) → tn.nap()', /layToi\(\)/.test(app) && /doiKhach\(/.test(app) && /tn\.nap\(\)/.test(app) && /const nap = /.test(hk));
  k('B4 hook không còn donSach (không code chết); nút Xoá kết quả vẫn xoá khoá', !/donSach/.test(hk + app) && /const xoa = \(\) => \{ xoaKetQua\(\);/.test(hk));
  k('B4 hook vẫn giữ khiHau / anToan trong bản lưu', /khiHau: ban\.khiHau, anToan: ban\.anToan/.test(hk));
  k('B5 Trang chủ chỉ nhận kết quả đã lưu khi đã đăng nhập (chưa đăng nhập không lộ)', /dangNhap \? tn\.klLuu : null/.test(app));
  k('B5 số điện thoại thô không vào localStorage ở luuMay.js', (doc('src/luuMay.js').match(/setItem\(/g) || []).length === 1 && /setItem\(KHOA_CHU, dauVet\(sdt\)\)/.test(doc('src/luuMay.js')));

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  try { pw = require('playwright'); } catch { /* không có */ }
  if (!pw) { console.log('  BỎ QUA: không có Playwright ở máy này — các ca C1 (a)–(g) CHƯA chạy'); }
  else await trinhDuyet(pw, lm.dauVet, BAN);

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw, dauVet, BAN) {
  const esbuild = require('esbuild');
  const goi = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles[0].text;
  const trinh = await pw.chromium.launch();
  const GOC_URL = 'http://kh.test';

  // Một ca: context mới (localStorage trống), POS giả. `pos.het` = true → mọi yêu cầu có token trả 401.
  async function ca(ten, { luu = {}, chan = false, pos = {} } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: 390, height: 844 } });
    const trang = await ctx.newPage();
    const loi = [];
    trang.on('pageerror', (e) => loi.push(e.message));
    await trang.addInitScript(({ luu, chan }) => {
      if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); }
      if (chan) { const goc = Storage.prototype.setItem; Storage.prototype.setItem = function (x, v) { if (x === 'kh_tracnghiem' || x === 'kh_chu') throw new Error('SecurityError'); return goc.call(this, x, v); }; }
    }, { luu, chan });
    const P = { het: false, ...pos };
    await trang.route(`${GOC_URL}/**`, async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="vi"><head><meta charset="utf-8"></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>' });
      const duong = p.slice('/api/kh'.length);
      if (duong === '/dang-nhap/xin-ma') return json(200, {});
      if (duong === '/dang-nhap/xac-minh') { const sdt = JSON.parse(r.request().postData()).sdt; P.sdt = sdt; return json(200, { token: 'tok-' + sdt, khach: { sdt, ten: 'Khách thử' } }); }
      if (auth && (P.het || auth !== 'Bearer tok-' + P.sdt)) return json(401, { error: 'Hết phiên', code: 'PHIEN_HET_HAN' });
      if (duong === '/toi' && auth) return json(200, { khach: { sdt: P.sdt, ten: 'Khách thử', ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    let kq;
    try { kq = await chay(trang, P, loi); } finally { await ctx.close(); }
    return kq;
  }
  const doc_ = (t, x) => t.evaluate((y) => localStorage.getItem(y), x);
  const chu = async (t) => (await t.locator('body').innerText());
  const mo = async (t, duong) => { await t.goto(GOC_URL + duong); await t.waitForSelector('.phone'); };
  const dangNhapUi = async (t, sdt) => {
    await t.fill('#sdt', sdt); await t.getByRole('button', { name: 'Tiếp tục' }).click();
    await t.fill('#ma', '123456'); await t.getByRole('button', { name: 'Xác nhận' }).click();
    await t.waitForFunction(() => !!localStorage.getItem('kh_token'));
  };
  const cho = (t, ms = 600) => t.waitForTimeout(ms);
  const XEM = 'Xem kết quả';
  const gieo = (sdt, { chu = true, token = true } = {}) => ({ kh_tracnghiem: BAN, ...(chu ? { kh_chu: dauVet(sdt) } : {}), ...(token ? { kh_token: 'tok-' + sdt } : {}) });

  await ca('a', { luu: gieo(SDT_A), pos: { sdt: SDT_A } }, async (t, P) => {
    await mo(t, '/trangchu'); await t.getByText(XEM).waitFor();
    k('C1 (nền) đang đăng nhập, cùng khách: Trang chủ có "Xem kết quả" và kh_chu không đổi', true);
    // (a) hết phiên: mở lại app khi POS báo 401
    P.het = true; await t.reload(); await t.waitForFunction(() => !localStorage.getItem('kh_token')); await cho(t);
    k('C1(a) hết phiên: dữ liệu vẫn còn trên máy, kh_chu còn', (await doc_(t, 'kh_tracnghiem')) === BAN && (await doc_(t, 'kh_chu')) === dauVet(SDT_A));
    k('C1(e) chưa đăng nhập: không lộ kết quả (ô khoá, không "Xem kết quả")', !(await chu(t)).includes(XEM) && (await chu(t)).includes('Đăng nhập để mở khoá chức năng'));
    P.het = false; await mo(t, '/dangnhap'); await dangNhapUi(t, SDT_A); await t.getByText(XEM).waitFor({ timeout: 5000 });
    k('C1(a) cùng khách đăng nhập lại → kết quả còn, hiện lại ô "Xem kết quả"', (await doc_(t, 'kh_tracnghiem')) === BAN);
    await t.getByText(XEM).click(); await t.getByText('Bạn đã chọn:').waitFor({ timeout: 5000 });
    k('C1(g) mở lại kết quả cũ: gợi ý an toàn (tình trạng đặc biệt) vẫn hiện', true);
  });

  await ca('b', { luu: gieo(SDT_A), pos: { sdt: SDT_A } }, async (t, P) => {
    await mo(t, '/trangchu'); await t.getByText(XEM).waitFor();
    P.het = true; await t.reload(); await t.waitForFunction(() => !localStorage.getItem('kh_token')); await cho(t);
    P.het = false; await mo(t, '/dangnhap'); await dangNhapUi(t, SDT_B); await cho(t, 900);
    k('C1(b) khách khác đăng nhập sau hết phiên → kết quả cũ mất, không hiện', (await doc_(t, 'kh_tracnghiem')) === null && !(await chu(t)).includes(XEM) && (await doc_(t, 'kh_chu')) === dauVet(SDT_B));
  });

  await ca('c', { luu: gieo(SDT_A), pos: { sdt: SDT_A } }, async (t) => {
    await mo(t, '/taikhoan'); await t.getByText('Đăng xuất').click(); await cho(t);
    k('C1(c) bấm Đăng xuất → mất kết quả, kh_chu và token', (await doc_(t, 'kh_tracnghiem')) === null && (await doc_(t, 'kh_chu')) === null && (await doc_(t, 'kh_token')) === null);
  });

  await ca('d', { luu: gieo(SDT_A, { chu: false }), pos: { sdt: SDT_A } }, async (t) => {
    await mo(t, '/trangchu'); await cho(t, 900);
    k('C1(d) bản lưu cũ chưa có kh_chu → xoá khi đăng nhập, ghi chủ, không hiện', (await doc_(t, 'kh_tracnghiem')) === null && (await doc_(t, 'kh_chu')) === dauVet(SDT_A) && !(await chu(t)).includes(XEM));
  });

  await ca('e', { luu: gieo(SDT_A, { token: false }) }, async (t) => {
    await mo(t, '/trangchu'); await cho(t);
    k('C1(e) chưa từng đăng nhập mà máy có bản lưu: ô Trắc nghiệm mờ + khoá, không lộ kết quả, bản lưu không bị xoá', !(await chu(t)).includes(XEM) && (await chu(t)).includes('Đăng nhập để mở khoá chức năng') && (await doc_(t, 'kh_tracnghiem')) === BAN);
  });

  await ca('f', { luu: gieo(SDT_A), chan: true, pos: { sdt: SDT_A } }, async (t, P, loi) => {
    await mo(t, '/trangchu'); await cho(t, 900);
    k('C1(f) kho chặn ghi: App không vỡ, Trang chủ vẫn hiện', loi.length === 0 && (await chu(t)).includes('Chào Khách thử'), loi.join('|'));
  });

  await trinh.close();
}
