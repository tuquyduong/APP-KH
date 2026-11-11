#!/usr/bin/env node
// Số nợ chữ cứng (K10, CLAUDE.md §11): đếm chữ tiếng Việt có dấu viết thẳng trong src/ (ngoài src/noiDung/**, src/kiemKhop/**, src/pages/KiemKhop.jsx).
//   node cong_cu/ha_no_chu.js  → HẠ số nợ trong cong_cu/no_chu_cung.txt theo số đếm mới. CHỈ hạ: tệp tăng giữ nguyên số cũ, tệp chưa có dòng không thêm,
//                                tệp hết chữ (hoặc đã xoá) thì xoá dòng.
// Bộ kiểm kiem_tra_truoc_khi_giao.js (K10) và bài thử dùng chung các hàm xuất ra ở đây.
'use strict';
const fs = require('fs');
const path = require('path');

const TEP_NO = 'cong_cu/no_chu_cung.txt';
const BO_QUA = /^src\/(noiDung|kiemKhop)\/|^src\/pages\/KiemKhop\.jsx$/;
const coDau = (s) => /[̀-ͯ]|[đĐ]/.test(s.normalize('NFD'));

/** Số chữ cứng của một tệp: mỗi chuỗi ('…' "…" `…`) có dấu = 1; mỗi đoạn chữ JSX (code ngoài chuỗi, cắt theo < > { }) có dấu = 1. Bỏ chú thích, regex. */
function demChuCung(nguon) {
  let n = 0, code = '', i = 0;
  const L = nguon.length;
  const truocLaRegex = () => { const t = code.replace(/\s+$/, ''); return !t || /[(,=:[!&|?{};+\-*%~^]$/.test(t) || /=>$|\breturn$/.test(t); };
  while (i < L) {
    const c = nguon[i], c2 = nguon[i + 1];
    if (c === '/' && c2 === '/') { while (i < L && nguon[i] !== '\n') i++; continue; }
    if (c === '/' && c2 === '*') { const j = nguon.indexOf('*/', i + 2); i = j < 0 ? L : j + 2; code += ' '; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      let j = i + 1, sau = 0;
      for (; j < L; j++) {
        const d = nguon[j];
        if (d === '\\') { j++; continue; }
        if (c === '`' && d === '$' && nguon[j + 1] === '{') sau++;
        else if (c === '`' && sau && d === '}') sau--;
        else if (d === c && !sau) break;
        else if (d === '\n' && c !== '`') break;
      }
      if (coDau(nguon.slice(i, j + 1))) n++;
      code += '""'; i = j + 1; continue;
    }
    if (c === '/' && truocLaRegex()) {
      let j = i + 1, lop = false;
      for (; j < L && nguon[j] !== '\n'; j++) {
        const d = nguon[j];
        if (d === '\\') { j++; continue; }
        if (d === '[') lop = true; else if (d === ']') lop = false; else if (d === '/' && !lop) break;
      }
      code += '/r/'; i = j + 1; continue;
    }
    code += c; i++;
  }
  return n + code.split(/[<>{}]/).filter(coDau).length;
}

function lietKe(goc, d = 'src', ra = []) {
  const tuyetDoi = path.join(goc, d);
  if (!fs.existsSync(tuyetDoi)) return ra;
  for (const t of fs.readdirSync(tuyetDoi, { withFileTypes: true })) {
    const p = path.posix.join(d, t.name);
    if (t.isDirectory()) { if (t.name !== 'node_modules' && t.name !== 'dist') lietKe(goc, p, ra); } else if (/\.jsx?$/.test(t.name) && !BO_QUA.test(p)) ra.push(p);
  }
  return ra;
}

/** { 'src/…': số } cho mọi tệp có ≥ 1 chữ cứng. */
function demTatCa(goc) {
  const ra = {};
  for (const f of lietKe(goc).sort()) { const n = demChuCung(fs.readFileSync(path.join(goc, f), 'utf8')); if (n) ra[f] = n; }
  return ra;
}

/** Đọc số nợ: mỗi dòng không trống "<đường dẫn> <số>". Thiếu tệp → null. */
function docNo(goc) {
  const p = path.join(goc, TEP_NO);
  if (!fs.existsSync(p)) return null;
  const ra = {};
  for (const d of fs.readFileSync(p, 'utf8').split('\n')) { const m = /^(\S+) (\d+)$/.exec(d.trim()); if (m) ra[m[1]] = +m[2]; }
  return ra;
}

/** Ghi số nợ: sắp theo đường dẫn, giữa hai dòng MỘT dòng trống (việc song song sửa tệp khác nhau không đụng dòng kề nhau khi gộp). */
const vietNo = (no) => Object.keys(no).sort().map((f) => `${f} ${no[f]}`).join('\n\n') + '\n';

/** Hạ: min(nợ cũ, số đếm); 0 → xoá dòng; không bao giờ thêm tệp mới hay nâng số. */
function haNo(no, dem) {
  const ra = {};
  for (const f of Object.keys(no)) { const m = Math.min(no[f], dem[f] || 0); if (m > 0) ra[f] = m; }
  return ra;
}

module.exports = { TEP_NO, demChuCung, demTatCa, docNo, vietNo, haNo };

if (require.main === module) {
  const goc = path.join(__dirname, '..');
  const no = docNo(goc);
  if (!no) { console.error(`Thiếu ${TEP_NO}`); process.exit(1); }
  const moi = haNo(no, demTatCa(goc));
  fs.writeFileSync(path.join(goc, TEP_NO), vietNo(moi));
  const truoc = Object.values(no).reduce((a, b) => a + b, 0), sau = Object.values(moi).reduce((a, b) => a + b, 0);
  console.log(`Số nợ chữ cứng: ${truoc} → ${sau}`);
}
