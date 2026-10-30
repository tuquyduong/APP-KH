#!/usr/bin/env node
// THỬ KH-SLOGAN-1 — khẩu hiệu "Đông Y Dưỡng Thể" kiểu B2.3: tệp mẫu chép nguyên (SHA-256), phông tự lưu + preload, lớp `khau-hieu` ở màn mở,
// không còn "Sức khỏe mỗi ngày", phông vẽ thật trong Chromium, K9 xanh và (thử ngược) đỏ khi màu duyệt rò sang tệp khác.
// Chromium + Playwright có sẵn trong môi trường (không nằm trong package.json). Chạy: node cong_cu/thu_KHSLOGAN1.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const tep = (f) => path.join(GOC, f);
const doc = (f) => (fs.existsSync(tep(f)) ? fs.readFileSync(tep(f), 'utf8') : '');
const sha = (f) => (fs.existsSync(tep(f)) ? crypto.createHash('sha256').update(fs.readFileSync(tep(f))).digest('hex') : 'thiếu tệp');

const SHA = {
  'public/fonts/eb-garamond-600-latin.woff2': '6a195b7e4f518d53813581f415d7956e02049dd2762b4b9a3af80d56b4257e28',
  'public/fonts/eb-garamond-600-vietnamese.woff2': 'a15d558d418d7f9e31a8790b520ad326b8a7a8f3a6a321d94e3d63f6d6cc24c8',
  'src/giaoDien/khau_hieu.css': '085f6d0c095769e87bf7385fab8badaa1f5884f5dccd95e9b9331ff77f2505d3',
};
const CHU = 'ĐÔNG Y DƯỠNG THỂ';

(async () => {
  console.log('— A. Tệp mẫu vào app, chép nguyên');
  for (const [f, h] of Object.entries(SHA)) k(`A1/A2 ${f} đúng SHA-256 của mẫu`, sha(f) === h, sha(f));
  const html = doc('index.html');
  const preload = [...html.matchAll(/<link[^>]*rel="preload"[^>]*>/g)].map((m) => m[0]).filter((l) => /as="font"/.test(l));
  k('A3 index.html preload cả 2 phông (type woff2, crossorigin, đường /fonts/…)', ['latin', 'vietnamese'].every((v) =>
    preload.some((l) => l.includes(`href="/fonts/eb-garamond-600-${v}.woff2"`) && /type="font\/woff2"/.test(l) && /\bcrossorigin\b/.test(l))));
  k('A3 không nạp EB Garamond từ Google / trang ngoài', !/EB\+?Garamond/i.test(html) && !/https?:[^"')\s]*garamond/i.test(doc('src/giaoDien/khau_hieu.css')));

  console.log('— B. Màn mở');
  const manDau = doc('src/components/ManDau.jsx');
  k('B1 phần tử khẩu hiệu có lớp khau-hieu', /<div className="e3-tg khau-hieu">\{KHAU_HIEU\}<\/div>/.test(manDau));
  const main = doc('src/main.jsx');
  const vt = (ten) => main.indexOf(`'./giaoDien/${ten}'`);
  k('B1 main.jsx nạp khau_hieu.css SAU mọi demo*.css và giaoDien.css', vt('khau_hieu.css') > 0 && ['demo.css', 'demo_tracnghiem.css', 'giaoDien.css'].every((t) => vt(t) >= 0 && vt(t) < vt('khau_hieu.css')));
  const demoCon = (doc('src/giaoDien/demo.css').match(/@import[^;]*;/g) || []).join('');
  k('B1 demo.css không @import khau_hieu (thứ tự nạp do main.jsx giữ)', !/khau_hieu/.test(demoCon));
  k('B2 chữ lấy từ KHAU_HIEU, không viết cứng ở ManDau', /\{KHAU_HIEU\}/.test(manDau) && !/Đông Y Dưỡng Thể/i.test(manDau));
  k('B2 chú thích đầu thuongHieu.js không còn "giữ nguyên"', !/giữ nguyên/.test(doc('src/noiDung/thuongHieu.js').split('\n')[0]));

  console.log('— B3. Chromium: phông EB Garamond vẽ thật, dấu tiếng Việt đủ');
  let pw = null;
  try { pw = require('playwright'); } catch { /* không có */ }
  k('B3 có Playwright để đo', !!pw);
  if (pw) {
    const lay = {};
    const may = http.createServer((q, r) => {
      const u = q.url.split('?')[0];
      let f = null, kieu = 'text/html; charset=utf-8';
      if (u === '/') {
        r.end(`<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/khau_hieu.css"><div class="khau-hieu" id="x">${CHU}</div>`); return;
      }
      if (u === '/khau_hieu.css') { f = 'src/giaoDien/khau_hieu.css'; kieu = 'text/css'; } else if (u.startsWith('/fonts/')) { f = 'public' + u; kieu = 'font/woff2'; }
      if (f && fs.existsSync(tep(f))) { lay[u] = 200; r.writeHead(200, { 'content-type': kieu }); r.end(fs.readFileSync(tep(f))); } else { lay[u] = 404; r.writeHead(404); r.end(); }
    });
    await new Promise((x) => may.listen(0, '127.0.0.1', x));
    const tr = await pw.chromium.launch({ args: ['--no-sandbox'] });
    try {
      const trang = await tr.newPage();
      await trang.goto(`http://127.0.0.1:${may.address().port}/`);
      await trang.evaluate((c) => document.fonts.load("600 16px 'EB Garamond'", c), CHU);
      const kq = await trang.evaluate((c) => ({
        check: document.fonts.check("600 16px 'EB Garamond'", c),
        daNap: [...document.fonts].filter((f) => f.family.replace(/["']/g, '') === 'EB Garamond' && f.status === 'loaded').length,
        hoa: getComputedStyle(document.getElementById('x')).textTransform,
      }), CHU);
      k('B3 fonts.check("600 16px \'EB Garamond\'", "ĐÔNG Y DƯỠNG THỂ") đúng', kq.check === true);
      k('B3 cả 2 tệp phông (latin + tiếng Việt) được tải, trạng thái loaded', kq.daNap === 2, `loaded=${kq.daNap}`);
      k('B3 hai tệp phông trả 200 từ /fonts/…', lay['/fonts/eb-garamond-600-latin.woff2'] === 200 && lay['/fonts/eb-garamond-600-vietnamese.woff2'] === 200, JSON.stringify(lay));
      k('B3 lớp khau-hieu in hoa', kq.hoa === 'uppercase');
    } finally { await tr.close(); may.close(); }
  }

  console.log('— C. Đổi chữ ở mọi chỗ');
  const CU = [/Sức khỏe mỗi ngày/i, /Sức khoẻ mỗi ngày/i, /Suc khoe moi ngay/i];
  const quet = (d, ra = []) => {
    if (!fs.existsSync(tep(d))) return ra;
    for (const t of fs.readdirSync(tep(d), { withFileTypes: true })) {
      const p = path.posix.join(d, t.name);
      if (t.isDirectory()) quet(p, ra); else if (!/\.(woff2?|mp3|jpe?g|png|webp)$/.test(t.name)) ra.push(p);
    }
    return ra;
  };
  const conCu = [...quet('src'), ...quet('public'), 'index.html'].filter((f) => CU.some((re) => re.test(doc(f))));
  k('C1/C2 src, public, index.html không còn "Sức khỏe / khoẻ mỗi ngày", "Suc khoe moi ngay"', conCu.length === 0, conCu.join(', '));
  const tc = doc('src/pages/TrangChu.jsx');
  k('C1 Trang chủ: "Tứ Quý Đường — " + KHAU_HIEU (import từ thuongHieu.js)', /Tứ Quý Đường — \{KHAU_HIEU\}/.test(tc) && /import \{ KHAU_HIEU \} from '..\/noiDung\/thuongHieu\.js'/.test(tc));
  k('C4 <title> và manifest không đổi', /<title>Tứ Quý Đường<\/title>/.test(html) && !/Đông Y/.test(doc('public/manifest.webmanifest')));

  console.log('— D. K9');
  const bk = tep('kiem_tra_truoc_khi_giao.js');
  const chayK9 = (goc) => (spawnSync(process.execPath, [path.join(goc, 'kiem_tra_truoc_khi_giao.js')], { cwd: goc, encoding: 'utf8', timeout: 60000 }).stdout || '')
    .split('\n').filter((d) => /K9 màu|K9b phông/.test(d));
  // Chạy bộ kiểm trên BẢN CHÉP trong thư mục tạm (không chạy ở cây thật: bộ kiểm lại gọi bài thử này → vòng lặp).
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'k9-'));
  try {
    fs.copyFileSync(bk, path.join(tam, 'kiem_tra_truoc_khi_giao.js'));
    fs.cpSync(tep('src'), path.join(tam, 'src'), { recursive: true });
    fs.mkdirSync(path.join(tam, 'thiet_ke'));
    for (const f of ['thiet_ke/app_kh_demo.html', 'thiet_ke/HOP_DONG_API_KH.md', 'index.html', 'package.json', 'package-lock.json']) fs.copyFileSync(tep(f), path.join(tam, f));
    const K9 = chayK9(tam);
    k('K9 (màu + phông) xanh trên bản chép của src thật', K9.length === 2 && K9.every((d) => d.includes('✓')), K9.join(' | '));
    // Thử ngược: chép #FBE3A2 / EB Garamond vào MỘT tệp khác khau_hieu.css.
    fs.appendFileSync(path.join(tam, 'src/giaoDien/giaoDien.css'), '\n.thu-nguoc{ color:#FBE3A2; }\n');
    const dor = chayK9(tam).find((d) => /K9 màu/.test(d)) || '';
    k('K9 thử ngược: #FBE3A2 ở tệp khác (giaoDien.css) → K9 màu ĐỎ', dor.includes('✗') && dor.includes('giaoDien.css'), dor);
    fs.writeFileSync(path.join(tam, 'src/giaoDien/giaoDien.css'), fs.readFileSync(tep('src/giaoDien/giaoDien.css')));
    fs.appendFileSync(path.join(tam, 'src/giaoDien/giaoDien.css'), "\n.thu-nguoc{ font-family:'EB Garamond', serif; }\n");
    const dorPho = chayK9(tam).find((d) => /K9b phông/.test(d)) || '';
    k('K9 thử ngược: EB Garamond ở tệp khác → K9b phông ĐỎ', dorPho.includes('✗') && dorPho.includes('giaoDien.css'), dorPho);
  } finally { fs.rmSync(tam, { recursive: true, force: true }); }

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})();
