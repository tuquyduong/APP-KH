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
// K1 — CHỖ DUY NHẤT gọi máy chủ là src/api.js (LUAT_XAY_APP §3).
const fetchNgoai = timDong(src.filter((f) => f !== 'src/api.js'), /\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/);
k('K1 chỉ src/api.js gọi mạng', fetchNgoai.length === 0, fetchNgoai.slice(0, 5).join(', '));
// K2 — App chỉ gọi /api/kh, không đường quầy /api/pos hay /api khác.
const duongLa = timDong(src, /['"`]\/api\/(?!kh[/'"`$])/);
k('K2 không gọi đường /api ngoài /api/kh', duongLa.length === 0, duongLa.slice(0, 5).join(', '));
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
  k('K8 mọi lời gọi src/api.js có trong hợp đồng', n > 0 && lech.length === 0, lech.join(', '));
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

console.log('— Bài thử cong_cu/thu_*.js');
const baiThu = fs.existsSync(path.join(GOC, 'cong_cu')) ? fs.readdirSync(path.join(GOC, 'cong_cu')).filter((f) => /^thu_.*\.js$/.test(f)).sort() : [];
k('có ít nhất một bài thử', baiThu.length > 0);
for (const f of baiThu) {
  const r = spawnSync(process.execPath, [path.join('cong_cu', f)], { cwd: GOC, encoding: 'utf8', timeout: 120000 });
  const cuoi = (r.stdout || '').trim().split('\n').pop() || '';
  k(`${f} xanh (${cuoi})`, r.status === 0, ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-6).join(' | '));
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
  }
}

console.log(`\n${dat} đạt · ${hong} hỏng`);
process.exit(hong ? 1 : 0);
