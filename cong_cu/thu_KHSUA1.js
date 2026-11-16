#!/usr/bin/env node
// THỬ KH-SUA-1 — thẻ mã QR ở Theo dõi đơn không bị lớp CSS của màn khác đè (trùng tên lớp sau KH-THE-2).
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): canh chung "một lớp gốc chỉ định nghĩa ở MỘT tệp css" + đọc nguồn ThanhToan.jsx / thanh_toan.css.
// Phần 2: App thật trong Chromium (POS giả của thu_KHMUA1b.js) — bố cục BÊN TRONG thẻ QR và ô "Chuyển khoản QR" ở Thanh toán thẻ.
// Chạy: node cong_cu/thu_KHSUA1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const lietKeCss = (thu) => fs.readdirSync(path.join(GOC, thu), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? lietKeCss(path.posix.join(thu, e.name)) : /\.css$/.test(e.name) && !/^demo/.test(e.name) ? [path.posix.join(thu, e.name)] : []));

// Lớp gốc = bộ chọn CHỈ gồm một lớp (`.ten{`, kể cả trong danh sách `a, .ten{`). Trả { tenLop: [tệp…] }.
function lopGocTheoTep(cssTheoTep) {
  const kq = {};
  for (const [tep, noi] of Object.entries(cssTheoTep)) {
    const sach = noi.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of sach.matchAll(/([^{}]+)\{/g)) {
      if (m[1].trim().startsWith('@')) continue;
      for (const bc of m[1].split(',')) {
        const g = /^\s*\.(-?[_a-zA-Z][\w-]*)\s*$/.exec(bc);
        if (g) (kq[g[1]] = kq[g[1]] || new Set()).add(tep);
      }
    }
  }
  return kq;
}

(async () => {
  console.log('Phần 1 — đọc nguồn');
  const teps = lietKeCss('src');
  const css = Object.fromEntries(teps.map((f) => [f, docTho(f)]));
  const trung = Object.entries(lopGocTheoTep(css)).filter(([, s]) => s.size >= 2).map(([l, s]) => `.${l} ở ${[...s].join(' + ')}`);
  k('A0 tìm thấy tệp css để canh (không chỉ demo)', teps.length >= 10, String(teps.length));
  k('A1 canh chung: không lớp gốc nào định nghĩa ở ≥ 2 tệp css (ngoài demo*.css)', trung.length === 0, trung.join(' | '));
  // đối chứng: thuật toán thật sự bắt trùng, và không báo nhầm lớp ghép / lớp ở một tệp
  const t1 = lopGocTheoTep({ 'a.css': '.x{a:1} .y .z{}', 'b.css': '.p, .x{b:2} .y.z{} /* .z{} */ @media (max-width:1px){ .q{} }' });
  k('A1 (đối chứng) bắt .x ở hai tệp trong danh sách bộ chọn; không bắt .y .z / .y.z / chú thích / .q', t1.x && t1.x.size === 2 && !t1.z && !t1.y && t1.q.size === 1 && t1.p.size === 1, JSON.stringify(Object.fromEntries(Object.entries(t1).map(([a, b]) => [a, [...b]]))));

  const tt = boChuThich(docTho('src/pages/ThanhToan.jsx'));
  const ttCss = docTho('src/giaoDien/thanh_toan.css').replace(/\/\*[\s\S]*?\*\//g, '');
  k('A2 ThanhToan.jsx không còn lớp the-qr*', !/the-qr/.test(tt));
  k('A2 ThanhToan.jsx dùng tt-qr, tt-qr-ic, tt-qr-v', /className="tt-qr"/.test(tt) && /className="tt-qr-ic"/.test(tt) && /lop="tt-qr-v"/.test(tt));
  k('A2 thanh_toan.css không còn lớp the-qr*; có luật .tt-qr{ display:flex … }', !/the-qr/.test(ttCss) && /\.tt-qr\s*\{[^}]*display:\s*flex/.test(ttCss));
  const conLai = teps.filter((f) => /\.the-qr/.test(css[f].replace(/\/\*[\s\S]*?\*\//g, '')));
  k('A2 lớp the-qr* chỉ còn ở src/giaoDien/the_qr.css', conLai.join() === 'src/giaoDien/the_qr.css', conLai.join());

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
  const { dungMay } = require('./thu_KHMUA1b.js');
  const { may, mo, chu, doi, chup } = await dungMay(pw, k);
  const HET = '2026-10-30T20:40:00';
  const MAU = '000201010212' + '38' + '58' + '0010A000000727' + '0124' + '0006970422' + '01100123456789' + '0208QRIBFTTA' + '5303704540545000' + '5802VN' + '6218' + '0816TQDNOV06 APP0016' + '6304ABCD';
  const DON = { ma: 'TQD50', tong: 87654, tt: 'cho_tra', qr: { chuoi: MAU, het_han: HET }, giu: 0, cach: 'qr', mon: [], soHd: 'APP0016' };
  const LOGO = path.join(GOC, 'public/anh/logo_tqd_192.png'); // POS giả không phát public/: cấp đúng logo thật để ảnh chụp có logo
  const HANG = [{ id: 2, ten: 'Vàng', phan_tram: 3, phan_tram_nhom_dac_biet: 4, chi_cap: false, goi: [{ so_thang: 1, gia: 100000 }, { so_thang: 3, gia: 295000 }], thu_bac: 2, gia_the: 100000, thu_tu: 2, quyen_loi: [] }];
  // Máy giả dựng bundle với css rỗng và chỉ nạp css do main.jsx import; bản dựng thật gộp MỘT gói gồm cả css do màn / component import → nạp nốt ở đây.
  const mainCss = docTho('src/main.jsx');
  const CSS_NOT = lietKeCss('src').filter((f) => !mainCss.includes(`'./${f.slice(4)}'`)).map((f) => docTho(f)).join('\n');
  const anhGoc = async (c) => { await c.t.route('**/anh/logo_tqd_192.png', (r) => r.fulfill({ path: LOGO })); await c.t.addInitScript(`document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(CSS_NOT)};document.head.appendChild(s);});`); };
  const hop = (sel) => `(() => { const e = document.querySelector('${sel}'); if (!e) return null; const b = e.getBoundingClientRect(); return { t: b.top, d: b.bottom, tr: b.left, p: b.right, r: b.width }; })()`;

  for (const rong of [390, 360]) {
    await may(`the-qr-${rong}`, { rong, gio: [], S0: { v7: true, don: new Map([[DON.ma, DON]]) } }, async (c) => {
      const { t } = c;
      await anhGoc(c);
      await mo(t, '/don/TQD50');
      await doi(t, async () => (await t.locator('.the-qr svg').count()) === 1);
      await t.waitForTimeout(300);
      const x = await t.evaluate(`({ dau: ${hop('.the-qr-dau')}, o: ${hop('.the-qr-o')}, tien: ${hop('.the-qr-tien')}, svg: ${hop('.the-qr svg')}, kieu: (() => { const s = getComputedStyle(document.querySelector('.the-qr')); return { d: s.display, bs: s.boxShadow }; })() })`);
      k(`B1 [${rong}] có đủ phần: đầu thẻ, khung trắng, số tiền, mã`, !!(x.dau && x.o && x.tien && x.svg), JSON.stringify(x));
      if (!(x.dau && x.o && x.tien && x.svg)) return;
      k(`B1 [${rong}] phần đầu (tên quán) nằm TRÊN khung trắng`, x.dau.d <= x.o.t + 0.5, `đáy đầu ${x.dau.d} · đỉnh khung ${x.o.t}`);
      k(`B1 [${rong}] số tiền nằm trọn trong khung trắng (trái và phải)`, x.tien.tr >= x.o.tr - 0.5 && x.tien.p <= x.o.p + 0.5, `tiền ${x.tien.tr}–${x.tien.p} · khung ${x.o.tr}–${x.o.p}`);
      k(`B1 [${rong}] mã QR rộng ≥ 200px`, x.svg.r >= 200, String(x.svg.r));
      k(`B1 [${rong}] .the-qr không phải flex, không có box-shadow của ô Thanh toán thẻ`, x.kieu.d !== 'flex' && x.kieu.bs === 'none', JSON.stringify(x.kieu));
      await chup(t, `theodoi_qr_${rong}`);
    });
  }

  await may('thanh-toan-the-390', { gio: [], S0: { v7: true } }, async (c) => {
    const { t } = c;
    await anhGoc(c);
    await t.route('**/api/kh/hang', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: HANG }) }));
    await mo(t, '/uudai/hang/thanhtoan?h=2&thang=3');
    const co = await doi(t, async () => (await t.locator('.tt-qr').count()) === 1);
    k('B1 Thanh toán thẻ: có ô .tt-qr', co);
    await t.waitForTimeout(300);
    if (!co) { await chup(t, 'thanhtoan_the_390'); return; }
    const s = await t.evaluate(() => { const e = document.querySelector('.tt-qr'); const c = getComputedStyle(e); return { d: c.display, bs: c.boxShadow, nen: c.backgroundColor, vien: c.borderTopWidth, ic: !!e.querySelector('.tt-qr-ic'), v: !!e.querySelector('.tt-qr-v') }; });
    k('B1 Thanh toán thẻ: .tt-qr là flex, có biểu tượng + dấu chọn', s.d === 'flex' && s.ic && s.v, JSON.stringify(s));
    k('B1 Thanh toán thẻ: viền là box-shadow hồng như bản 14.11', s.bs !== 'none' && /\b2px\b/.test(s.bs) && !/176,\s*128,\s*40/.test(s.bs), s.bs);
    k('B1 Thanh toán thẻ: KHÔNG viền vàng #B08028, KHÔNG nền kem #FBF3E6', s.vien === '0px' && !/251,\s*243,\s*230/.test(s.nen), `${s.vien} · ${s.nen}`);
    await chup(t, 'thanhtoan_the_390');
  });
}
