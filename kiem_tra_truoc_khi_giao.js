#!/usr/bin/env node
// kiem_tra_truoc_khi_giao.js — BỘ KIỂM App KH (file luật: máy không sửa; muốn đổi thì ghi Phát hiện, chat soạn).
//   npm test                                  → kiểm tĩnh + chạy mọi cong_cu/thu_*.js
//   node kiem_tra_truoc_khi_giao.js --day-du  → thêm: dựng app (vite build) + kiểm dist/
// In dòng cuối "n đạt · m hỏng"; có hỏng thì thoát 1.
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = __dirname;
const DAY_DU = process.argv.includes('--day-du');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const doc = (p) => fs.readFileSync(path.join(GOC, p), 'utf8');
function quet(thuMuc, duoi = /\.(jsx?|mjs|css|html)$/) {
  const ra = [];
  const di = (d) => {
    if (!fs.existsSync(path.join(GOC, d))) return;
    for (const t of fs.readdirSync(path.join(GOC, d), { withFileTypes: true })) {
      const p = path.posix.join(d, t.name);
      if (t.isDirectory()) { if (t.name !== 'node_modules' && t.name !== 'dist') di(p); } else if (duoi.test(t.name)) ra.push(p);
    }
  };
  di(thuMuc);
  return ra;
}
const timDong = (files, re) => files.flatMap((f) => doc(f).split('\n').map((d, i) => (re.test(d) ? `${f}:${i + 1}` : null)).filter(Boolean));

console.log('— Kiểm tĩnh App KH');
const src = quet('src');
k('có src/api.js', fs.existsSync(path.join(GOC, 'src/api.js')));
// Mã "NHƯ LÚC CHẠY" cho K1 / K2 (16.11, chủ quán duyệt): esbuild (đi kèm vite) bỏ chú thích, ghép sẵn chữ hằng ('/ap' + 'i/x', `/ap${'i'}`, '\x61pi' → "/api/x")
// và chuẩn hoá cách viết (window['fe' + 'tch'] → window.fetch); tên tệp sau import / from xoá trắng cho khỏi lẫn. Đọc chữ trần thì viết vòng là lọt — đọc mã chạy thì lộ.
let esb = null;
try { esb = require('esbuild'); } catch { /* thiếu — K0 hỏng */ }
const maChay = {}, loiDoc = [];
for (const f of src.filter((t) => /\.(jsx?|mjs)$/.test(t))) {
  try {
    maChay[f] = esb.transformSync(doc(f), { loader: 'jsx', minifyWhitespace: true, minifySyntax: true, legalComments: 'none' }).code
      .replace(/\b(from|import)\s*(["'`])[^"'`]*\2/g, '$1""');
  } catch (e) { loiDoc.push(`${f}: ${String(e && e.message).split('\n')[0]}`); }
}
k('K0 đọc được mã như lúc chạy (esbuild)', !!esb && loiDoc.length === 0, esb ? loiDoc.slice(0, 3).join(' · ') : 'thiếu esbuild trong node_modules — chạy npm ci');
const tu = (ds) => new RegExp(`(?<![A-Za-z0-9_$])(?:${ds.join('|')})(?![A-Za-z0-9_$])`, 'g');
const timMa = (re, laTep = () => true) => Object.entries(maChay).filter(([f]) => laTep(f))
  .flatMap(([f, m]) => [...m.matchAll(re)].map((x) => ({ f, x, ra: `${f}: …${m.slice(Math.max(0, x.index - 30), x.index + x[0].length + 25)}…` })));
// K1 — CHỖ DUY NHẤT gọi máy chủ là src/api.js (LUAT_XAY_APP §3), qua ĐÚNG 2 lối: goi (/api/kh, token khách) và goiKho (/api/nd, vé quản trị). Thêm lối = chat sửa số này.
const MANG = ['fetch', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'EventSource', 'importScripts', 'import(?=\\s*\\()'];
const SO_LOI_MANG_API = 2;
const mangNgoai = timMa(tu(MANG), (f) => f !== 'src/api.js').map((m) => m.ra);
const mangApi = timMa(tu(MANG), (f) => f === 'src/api.js');
k('K1 chỉ src/api.js gọi mạng', mangNgoai.length === 0, mangNgoai.slice(0, 5).join(' · '));
k(`K1b src/api.js gọi mạng đúng ${SO_LOI_MANG_API} lối fetch`, mangApi.length === SO_LOI_MANG_API && mangApi.every((m) => m.x[0] === 'fetch'), `thấy ${mangApi.length}: ${mangApi.map((m) => m.x[0]).join(', ')}`);
// K2 — App chỉ gọi HAI cửa của POS: /api/kh (khách) và /api/nd (kho nội dung, chỉ khu quản trị). Chữ "api" đứng riêng (mọi kiểu viết, kể cả \/api\/ trong biểu thức
//      chính quy, kể cả mảnh 'api' đem ghép) chỉ được nằm trong dạng đã khai, ở đúng tệp đã khai. Dời tệp / thêm cửa = chat sửa danh sách này.
const CHO_API = { 'src/dinhDang.js': ['kh'], 'src/noiDung/khoNoiDung.js': ['nd'], 'src/noiDung/nd.js': ['nd'] };
const apiLa = timMa(/(?<![A-Za-z0-9_$])api(?![A-Za-z0-9_$])/gi).filter(({ f, x }) => {
  const m = /^\\?\/(api)\\?\/([a-z]+)(?![A-Za-z0-9_-])/.exec(maChay[f].slice(x.index - (maChay[f][x.index - 2] === '\\' ? 2 : 1)));
  return !(m && (CHO_API[f] || []).includes(m[2]));
}).map((m) => m.ra);
k('K2 chỉ /api/kh (dinhDang.js) và /api/nd (kho nội dung) — mọi kiểu viết', apiLa.length === 0, apiLa.slice(0, 5).join(' · '));
// K2b — cửa kho (goiKho) chỉ tệp kho nội dung dùng, và luôn = địa chỉ kho cố định + đường (không địa chỉ tự do).
const goiKhoNgoai = timMa(/\bgoiKho\b/g, (f) => !['src/api.js', 'src/noiDung/khoNoiDung.js'].includes(f)).map((m) => m.ra);
const goiKhoLa = timMa(/\bgoiKho\((?!DIA_CHI_KHO\+duong,)/g, (f) => f === 'src/noiDung/khoNoiDung.js').map((m) => m.ra);
k('K2b cửa kho goiKho chỉ ở kho nội dung, địa chỉ cố định', goiKhoNgoai.length === 0 && goiKhoLa.length === 0, goiKhoNgoai.concat(goiKhoLa).slice(0, 5).join(' · '));
// K2c — không viết chữ kiểu giấu (dựng chữ từ mã số / base64 / chạy chữ thành mã): bộ kiểm không đọc được thì không được dùng. Cần thật → chat thêm vào CHO_GIAU.
const CHO_GIAU = { decodeURIComponent: ['src/duongDan.js'] };
const giau = timMa(tu(['fromCharCode', 'fromCodePoint', 'atob', 'btoa', 'eval', 'Function', 'unescape', 'decodeURI', 'decodeURIComponent']))
  .filter(({ f, x }) => !(CHO_GIAU[x[0]] || []).includes(f)).map((m) => m.ra);
k('K2c không dựng chữ kiểu giấu (fromCharCode, atob, eval…)', giau.length === 0, giau.slice(0, 5).join(' · '));
// K3 — Không bí mật trong mã nguồn chạy trên máy khách.
const biMat = timDong(src.concat(['index.html', 'vite.config.mjs'].filter((f) => fs.existsSync(path.join(GOC, f)))),
  /eyJhbGciOi|sk-[A-Za-z0-9]{16,}|-----BEGIN [A-Z ]*PRIVATE KEY|KH_JWT_SECRET|TURSO_AUTH|AUTH_TOKEN\s*[:=]/);
k('K3 không bí mật trong src/', biMat.length === 0, biMat.slice(0, 5).join(', '));
// K4 — Không hiện giá vốn / tồn thật (LUAT_XAY_APP §4).
const giaVon = timDong(src, /cost_price|gia_von|giaVon|\bton_that\b/);
k('K4 không trường giá vốn / tồn thật', giaVon.length === 0, giaVon.slice(0, 5).join(', '));
// K5 — package-lock không chứa địa chỉ nội bộ Replit (Cloudflare / máy mây không tải được — bài học SX 2026).
k('K5 package-lock không địa chỉ nội bộ', !/replit\.internal/.test(doc('package-lock.json')));
// K6 — Thư viện chỉ đúng danh sách đã duyệt (thêm thư viện = phiếu cho phép + chat sửa danh sách này).
// qrcode-generator (MIT, không phụ thuộc): vẽ QR thành viên — chủ quán duyệt 28.10 cho KH-UI-2; chưa cài thì không sao.
const DUYET = { dependencies: ['react', 'react-dom', 'qrcode-generator'], devDependencies: ['@vitejs/plugin-react', 'vite'] };
const pk = JSON.parse(doc('package.json'));
const thua = Object.keys(DUYET).flatMap((m) => Object.keys(pk[m] || {}).filter((t) => !DUYET[m].includes(t)));
k('K6 không thư viện ngoài danh sách', thua.length === 0, thua.join(', '));
// K7 — src/ là ESM, gốc kho là CommonJS (tu_chay/, bộ kiểm, bài thử dùng require) — đổi là vỡ cả hai.
let pkSrc = null; try { pkSrc = JSON.parse(doc('src/package.json')); } catch { /* thiếu / hỏng */ }
k('K7 src/package.json đúng { "type": "module" }, gốc không đặt type', JSON.stringify(pkSrc) === '{"type":"module"}' && !('type' in pk));
// K8 — mọi lời gọi trong src/api.js có trong hợp đồng /api/kh (thiet_ke/HOP_DONG_API_KH.md, khối HOP_DONG_MAY_DOC — luật L3 hai chat).
//       Lời gọi phải viết thẳng goi('PT', '/đường') hoặc goi('PT', `/đường/${...}`) để máy đối chiếu được.
let hd = null;
try { hd = JSON.parse(/<!-- HOP_DONG_MAY_DOC -->\s*```json\n([\s\S]*?)\n```/.exec(doc('thiet_ke/HOP_DONG_API_KH.md'))[1]); } catch { /* thiếu / hỏng */ }
k('K8a đọc được hợp đồng /api/kh', !!hd && Array.isArray(hd.cua) && hd.cua.length > 0);
if (hd && Array.isArray(hd.cua)) {
  const chuan = (d) => String(d).split('?')[0].replace(/\$\{[^}]*\}/g, ':x').replace(/:[A-Za-z_]+/g, ':x');
  const coTrong = new Set(hd.cua.map((c) => `${c.pt} ${chuan(c.duong)}`));
  const api = doc('src/api.js');
  const lech = [];
  let n = 0;
  for (const m of api.matchAll(/\bgoi\(\s*'([A-Z]+)'\s*,\s*([`'"])([^`'"]*)\2/g)) {
    n++;
    if (!coTrong.has(`${m[1]} ${chuan(m[3])}`)) lech.push(`${m[1]} ${m[3]}`);
  }
  const tong = (api.match(/\bgoi\(/g) || []).length - (api.match(/function goi\(/g) || []).length;
  if (tong !== n) lech.push(`${tong - n} lời gọi không viết thẳng`);
  // Cửa ĐÃ HẸN (POS hẹn bằng thư, chưa lên bảng cửa của hợp đồng) — chủ quán 27.11 (KH-DOI-1): viết thẳng ở đây, nguồn thiet_ke/trao_doi/TRA_LOI_POS_16112026_DOIDIEM.md
  // mục 1 (DOI-DIEM-1). K8 nhận các cửa này; K8d đỏ khi một cửa đã vào hợp đồng → gỡ khỏi danh sách (để K8 lại đòi hợp đồng như mọi cửa).
  const DA_HEN_POS = ['GET /kho-qua', 'POST /doi-diem', 'GET /qua-cua-toi'];
  const hen = new Set(DA_HEN_POS.map((c) => { const [pt, d] = c.split(' '); return `${pt} ${chuan(d)}`; }));
  const conLech = lech.filter((c) => !hen.has(c.replace(/^(\S+) (.*)$/, (_, pt, d) => `${pt} ${chuan(d)}`)));
  k('K8 mọi lời gọi src/api.js có trong hợp đồng (hoặc DA_HEN_POS)', n > 0 && conLech.length === 0, conLech.join(', '));
  const daVao = DA_HEN_POS.filter((c) => { const [pt, d] = c.split(' '); return coTrong.has(`${pt} ${chuan(d)}`); });
  k('K8d cửa trong DA_HEN_POS chưa có trong hợp đồng (đã có → gỡ khỏi DA_HEN_POS)', daVao.length === 0, daVao.length ? `đã vào hợp đồng: ${daVao.join(', ')} — gỡ khỏi DA_HEN_POS` : '');
}
// K8b — mọi lời gọi kho trong src/noiDung/khoNoiDung.js viết thẳng ('PT', '/đường') và có trong hợp đồng /api/nd (thiet_ke/HOP_DONG_API_ND.md, khối HOP_DONG_ND_MAY_DOC).
let hdNd = null;
try { hdNd = JSON.parse(/```json HOP_DONG_ND_MAY_DOC\n([\s\S]*?)\n```/.exec(doc('thiet_ke/HOP_DONG_API_ND.md'))[1]); } catch { /* thiếu / hỏng */ }
const maKho = maChay['src/noiDung/khoNoiDung.js'];
k('K8c đọc được hợp đồng /api/nd và tệp kho nội dung', !!hdNd && Array.isArray(hdNd.cua) && hdNd.cua.length > 0 && typeof maKho === 'string');
if (hdNd && Array.isArray(hdNd.cua) && typeof maKho === 'string') {
  const chuan = (d) => String(d).split('?')[0].replace(/\$\{[^}]*\}/g, ':x').replace(/:[A-Za-z_]+/g, ':x');
  const coTrong = new Set(hdNd.cua.map((c) => `${c.phuong_thuc} ${chuan(c.duong)}`));
  const PT = '(GET|POST|PUT|DELETE|PATCH)';
  const lech = [];
  let n = 0;
  for (const m of maKho.matchAll(new RegExp(`\\b\\w+\\("${PT}",([\`"])([^\`"]*)\\2`, 'g'))) {
    n++;
    if (!coTrong.has(`${m[1]} ${chuan(m[3])}`)) lech.push(`${m[1]} ${m[3]}`);
  }
  for (const m of maKho.matchAll(new RegExp(`\\b\\w+\\("${PT}",(?![\`"])`, 'g'))) lech.push(`${m[1]} (đường không viết thẳng)`);
  k('K8b mọi lời gọi kho có trong hợp đồng /api/nd', n > 0 && lech.length === 0, lech.join(', '));
}
// K9 — CHUẨN THEO DEMO (chủ quán chốt 29.10): màu và phông trong app CHỈ được lấy từ thiet_ke/app_kh_demo.html.
//       Màu so theo giá trị (#abc = #aabbcc = rgb(170,187,204)); phông: họ chữ đầu phải là họ demo dùng, sau đó chỉ phông hệ thống dự phòng.
//       NGOẠI LỆ duy nhất: danh sách DUYET_NGOAI_DEMO bên dưới (chủ quán duyệt, từng token chỉ ở tệp ghi sẵn).
const docMau = (txt) => {
  const ra = new Map();
  const them = (r, g, b, a, goc) => { const kh = [r, g, b, Math.round(a * 1000) / 1000].join(','); if (!ra.has(kh)) ra.set(kh, goc); };
  for (const m of txt.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g)) {
    let h = m[1].toLowerCase();
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    them(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1, m[0]);
  }
  for (const m of txt.matchAll(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/g)) {
    const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    them(+m[1], +m[2], +m[3], a, m[0]);
  }
  return ra;
};
// Token thiết kế chủ quán DUYỆT NGOÀI demo (chỉ chat sửa danh sách này qua script; mỗi dòng có nguồn).
// Mỗi token chỉ được xuất hiện trong ĐÚNG các tệp ghi ở `tep` — ở tệp khác vẫn đỏ.
const DUYET_NGOAI_DEMO = [
  { loai: 'mau', gia_tri: '#FBE3A2', tep: ['src/giaoDien/khau_hieu.css'], nguon: 'khẩu hiệu mẫu B2.3 — chủ quán chọn 30.10.2026' },
  { loai: 'mau', gia_tri: 'rgba(60,10,5,.35)', tep: ['src/giaoDien/khau_hieu.css'], nguon: 'khẩu hiệu mẫu B2.3 — chủ quán chọn 30.10.2026' },
  { loai: 'pho', gia_tri: 'EB Garamond', tep: ['src/giaoDien/khau_hieu.css'], nguon: 'khẩu hiệu mẫu B2.3 (SIL OFL) — chủ quán chọn 30.10.2026' },
  { loai: 'mau', gia_tri: '#FBF3E6', tep: ['src/giaoDien/the_qr.css', 'src/qrThuongHieu.js'], nguon: 'thẻ mã QR thương hiệu (nền kem) — chủ quán duyệt mẫu 06.11.2026 (POS GIAO-DIEN-1 F)' },
  { loai: 'mau', gia_tri: '#B08028', tep: ['src/giaoDien/the_qr.css', 'src/qrThuongHieu.js'], nguon: 'thẻ mã QR thương hiệu (viền vàng kim) — chủ quán duyệt mẫu 06.11.2026 (POS GIAO-DIEN-1 F)' },
  { loai: 'mau', gia_tri: '#7A1E18', tep: ['src/giaoDien/the_qr.css', 'src/qrThuongHieu.js'], nguon: 'thẻ mã QR thương hiệu (chữ đỏ đô) — chủ quán duyệt mẫu 06.11.2026 (POS GIAO-DIEN-1 F)' },
  { loai: 'mau', gia_tri: '#253A6E', tep: ['src/giaoDien/the_qr.css', 'src/qrThuongHieu.js'], nguon: 'thẻ mã QR thương hiệu (phần tư trên trái) — chủ quán duyệt mẫu 06.11.2026 (POS GIAO-DIEN-1 F)' },
  { loai: 'mau', gia_tri: '#966923', tep: ['src/giaoDien/the_qr.css', 'src/qrThuongHieu.js'], nguon: 'thẻ mã QR thương hiệu (phần tư trên phải) — chủ quán duyệt mẫu 06.11.2026 (POS GIAO-DIEN-1 F)' },
  { loai: 'mau', gia_tri: '#347042', tep: ['src/giaoDien/the_qr.css', 'src/qrThuongHieu.js'], nguon: 'thẻ mã QR thương hiệu (phần tư dưới trái) — chủ quán duyệt mẫu 06.11.2026 (POS GIAO-DIEN-1 F)' },
  { loai: 'mau', gia_tri: '#B2342C', tep: ['src/giaoDien/the_qr.css', 'src/qrThuongHieu.js'], nguon: 'thẻ mã QR thương hiệu (phần tư dưới phải) — chủ quán duyệt mẫu 06.11.2026 (POS GIAO-DIEN-1 F)' },
];
const DUYET_MAU = new Map();
for (const d of DUYET_NGOAI_DEMO.filter((x) => x.loai === 'mau')) for (const [kh] of docMau(d.gia_tri)) DUYET_MAU.set(kh, d.tep);
const DUYET_PHO = new Map(DUYET_NGOAI_DEMO.filter((x) => x.loai === 'pho').map((d) => [d.gia_tri.toLowerCase(), d.tep]));
const duyetMau = (kh, f) => (DUYET_MAU.get(kh) || []).includes(f);
const duyetPho = (h, f) => (DUYET_PHO.get(h) || []).includes(f);
let demo = '';
try { demo = doc('thiet_ke/app_kh_demo.html').replace(/data:[^"')\s]{100,}/g, ''); } catch { /* thiếu demo */ }
k('K9a đọc được demo chuẩn', demo.length > 1000);
if (demo) {
  const MAU_DEMO = docMau(demo);
  const tepGiaoDien = quet('src').concat(['index.html', 'public/manifest.webmanifest'].filter((f) => fs.existsSync(path.join(GOC, f))));
  const la = [];
  for (const f of tepGiaoDien) for (const [kh, goc] of docMau(doc(f))) if (!MAU_DEMO.has(kh) && !duyetMau(kh, f)) la.push(`${goc} (${f})`);
  const hsl = timDong(tepGiaoDien, /hsla?\(/);
  k('K9 màu chỉ lấy từ demo', la.length === 0 && hsl.length === 0, la.slice(0, 12).concat(hsl.length ? [`hsl ở ${hsl.slice(0, 3).join(', ')}`] : []).join(' · ') + (la.length > 12 ? ` · …(+${la.length - 12})` : ''));
  const chuan = (t) => t.trim().replace(/^['"]|['"]$/g, '').toLowerCase();
  const HO_DEMO = new Set([...demo.matchAll(/font-family\s*:\s*([^;{}"]+)/g)].flatMap((m) => m[1].split(',').map(chuan)));
  const DU_PHONG = new Set(['system-ui', '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'roboto', 'helvetica neue', 'helvetica', 'arial',
    'sans-serif', 'serif', 'monospace', 'inherit']);
  const sai = [];
  for (const f of quet('src', /\.(css|jsx?|mjs)$/)) {
    for (const m of doc(f).matchAll(/(?:font-family\s*:|--[\w-]+\s*:)\s*([^;{}\n]*\b(?:sans-serif|serif|monospace|system-ui)\b[^;{}\n]*)/g)) {
      const ho = m[1].split(',').map(chuan).filter(Boolean);
      if (!HO_DEMO.has(ho[0]) && ho[0] !== 'inherit' && !duyetPho(ho[0], f)) sai.push(`${ho[0]} (${f})`);
      for (const h of ho.slice(1)) if (!HO_DEMO.has(h) && !DU_PHONG.has(h) && !duyetPho(h, f)) sai.push(`${h} (${f})`);
    }
  }
  k('K9b phông chỉ dùng họ chữ của demo (+ phông hệ thống dự phòng)', sai.length === 0, sai.join(' · '));
}
// K10 — chữ cứng "chỉ được giảm" (CLAUDE.md §11, KH-ND-3a): số chữ tiếng Việt viết thẳng của MỖI tệp src/ (ngoài noiDung/, kiemKhop/) phải BẰNG số nợ
//       trong cong_cu/no_chu_cung.txt. Bộ đếm + số nợ: cong_cu/ha_no_chu.js (bản chép thiếu tệp đó → K10 đỏ riêng, các phép kiểm khác vẫn chạy).
let noChu = null;
try { noChu = require('./cong_cu/ha_no_chu.js'); } catch { /* thiếu */ }
const soNo = noChu && noChu.docNo(GOC);
if (!soNo) k('K10 đọc được cong_cu/ha_no_chu.js + cong_cu/no_chu_cung.txt', false);
else {
  const dem = noChu.demTatCa(GOC), tang = [], giam = [];
  for (const f of [...new Set([...Object.keys(dem), ...Object.keys(soNo)])].sort()) {
    const a = dem[f] || 0, b = soNo[f] || 0;
    if (a > b) tang.push(`${f} (+${a - b})`); else if (a < b) giam.push(`${f} (−${b - a})`);
  }
  k('K10 chữ cứng chỉ được giảm', !tang.length && !giam.length, [tang.length ? `chữ cứng mới ở ${tang.join(', ')}: dùng nd() — CLAUDE.md §11` : '',
    giam.length ? `đã giảm ${giam.join(', ')} — chạy \`node cong_cu/ha_no_chu.js\` để hạ số nợ` : ''].filter(Boolean).join(' · '));
}

console.log('— Bài thử cong_cu/thu_*.js');
const baiThu = fs.existsSync(path.join(GOC, 'cong_cu')) ? fs.readdirSync(path.join(GOC, 'cong_cu')).filter((f) => /^thu_.*\.js$/.test(f)).sort() : [];
k('có ít nhất một bài thử', baiThu.length > 0);
for (const f of baiThu) {
  const batDau = Date.now();
  const r = spawnSync(process.execPath, [path.join('cong_cu', f)], { cwd: GOC, encoding: 'utf8', timeout: 120000 });
  const giay = Math.round((Date.now() - batDau) / 1000);
  const quaGio = (r.error && r.error.code === 'ETIMEDOUT') || !!r.signal;
  const cuoi = (r.stdout || '').trim().split('\n').pop() || '';
  if (quaGio) k(`${f} QUÁ GIỜ 120 giây (máy bận? chạy riêng: node cong_cu/${f})`, false);
  else k(`${f} xanh (${cuoi} · ${giay} s)`, r.status === 0, ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-6).join(' | '));
}

if (DAY_DU) {
  console.log('— Đầy đủ: dựng app');
  const r = spawnSync('npx', ['vite', 'build'], { cwd: GOC, encoding: 'utf8', timeout: 300000 });
  k('vite build thành công', r.status === 0, ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-6).join(' | '));
  if (r.status === 0) {
    const html = fs.readFileSync(path.join(GOC, 'dist/index.html'), 'utf8');
    const tep = [...html.matchAll(/(?:src|href)="\/([^"]+)"/g)].map((m) => m[1]);
    const thieu = tep.filter((t) => !fs.existsSync(path.join(GOC, 'dist', t)));
    k('dist/index.html trỏ tới file có thật', tep.length > 0 && thieu.length === 0, thieu.join(', '));
    // K2d — bản dựng (đúng tệp khách tải về, kể cả sw.js chép từ public/) chỉ chứa cửa /api/kh và /api/nd.
    const tepDist = [];
    const diD = (d) => { for (const t of fs.readdirSync(path.join(GOC, d), { withFileTypes: true })) { const p = path.posix.join(d, t.name); if (t.isDirectory()) diD(p); else if (/\.(m?js|html|json|webmanifest)$/.test(t.name)) tepDist.push(p); } };
    diD('dist');
    const cua = new Set();
    for (const t of tepDist) for (const m of fs.readFileSync(path.join(GOC, t), 'utf8').matchAll(/\\?\/api\\?\/([A-Za-z0-9_-]*)/g)) cua.add(m[1]);
    const cuaLa = [...cua].filter((c) => !['kh', 'nd'].includes(c));
    k('K2d bản dựng chỉ gọi /api/kh và /api/nd', cua.has('kh') && cuaLa.length === 0, cuaLa.length ? `cửa lạ: ${cuaLa.join(', ')}` : cua.has('kh') ? '' : 'không thấy /api/kh trong bản dựng (bộ kiểm hỏng?)');
  }
}

console.log(`\n${dat} đạt · ${hong} hỏng`);
process.exit(hong ? 1 : 0);
