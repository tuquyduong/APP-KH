#!/usr/bin/env node
// Số nợ chữ cứng (K10, CLAUDE.md §11): đếm chữ tiếng Việt có dấu viết thẳng trong src/ (ngoài src/noiDung/**, src/kiemKhop/**, src/pages/KiemKhop.jsx).
//   node cong_cu/ha_no_chu.js  → HẠ số nợ trong cong_cu/no_chu_cung.txt theo số đếm mới. CHỈ hạ: tệp tăng giữ nguyên số cũ, tệp chưa có dòng không thêm,
//                                tệp hết chữ (hoặc đã xoá) thì GIỮ dòng với số 0 (KH-ND-3c C3: hai việc song song cùng hạ hai tệp kề nhau không xung đột khi gộp).
// Bộ kiểm kiem_tra_truoc_khi_giao.js (K10) và bài thử dùng chung các hàm xuất ra ở đây.
'use strict';
const fs = require('fs');
const path = require('path');

const TEP_NO = 'cong_cu/no_chu_cung.txt';
const BO_QUA = /^src\/(noiDung|kiemKhop)\/|^src\/pages\/KiemKhop\.jsx$/;
const coDau = (s) => /[̀-ͯ]|[đĐ]/.test(s.normalize('NFD'));

/** Vị trí đóng của chuỗi mở ở `i` (' " hoặc `); mẫu chuỗi bỏ qua mọi `${…}` lồng nhau. Chuỗi thường hết ở xuống dòng. */
function hetChuoi(s, i) {
  const q = s[i];
  let j = i + 1;
  for (; j < s.length; j++) {
    const d = s[j];
    if (d === '\\') j++;
    else if (q === '`' && d === '$' && s[j + 1] === '{') j = hetNgoac(s, j + 2);
    else if (d === q) return j;
    else if (d === '\n' && q !== '`') return j;
  }
  return j;
}
/** Vị trí `}` khớp với `${` đã mở (i = ngay sau `${`): đếm `{ }` lồng, bỏ qua chuỗi. */
function hetNgoac(s, i) {
  let sau = 1;
  for (let j = i; j < s.length; j++) {
    const d = s[j];
    if (d === '\'' || d === '"' || d === '`') j = hetChuoi(s, j);
    else if (d === '{') sau++;
    else if (d === '}' && --sau === 0) return j;
  }
  return s.length;
}
/** Regex literal bắt đầu ở `i`: trả vị trí `/` đóng, hoặc -1 nếu không phải regex (chữ JSX như `(/ngày) chữ</p>`: không có `/` đóng, hoặc sau `/` đóng là chữ / `<` / `>`). */
function hetRegex(s, i) {
  let j = i + 1, lop = false;
  for (; j < s.length && s[j] !== '\n'; j++) {
    const d = s[j];
    if (d === '\\') j++;
    else if (d === '[') lop = true;
    else if (d === ']') lop = false;
    else if (d === '/' && !lop) break;
  }
  if (s[j] !== '/') return -1;
  let k = j + 1;
  while (/[dgimsuvy]/.test(s[k] || '')) k++;
  return k >= s.length || /[\s.,;:)\]}?!&|=+\-*/%^~]/.test(s[k]) ? j : -1;
}

/**
 * Số chữ cứng của một tệp: mỗi chuỗi ('…' "…") có dấu = 1; mẫu chuỗi `…`: phần chữ của nó có dấu = 1, cộng chuỗi / mẫu lồng trong `${…}` tính riêng (mỗi chuỗi có dấu = 1);
 * mỗi đoạn chữ JSX (code ngoài chuỗi, cắt theo < > { }) có dấu = 1. Bỏ chú thích, regex. `://` (địa chỉ web trong chữ JSX) không phải chú thích.
 */
function demChuCung(nguon) {
  let n = 0, code = '', i = 0;
  const L = nguon.length;
  const truocLaRegex = () => { const t = code.replace(/\s+$/, ''); return !t || /[(,=:[!&|?{;+\-*%~^]$/.test(t) || /=>$|\breturn$/.test(t); };
  while (i < L) {
    const c = nguon[i], c2 = nguon[i + 1];
    if (c === '/' && c2 === '/' && nguon[i - 1] !== ':') { while (i < L && nguon[i] !== '\n') i++; continue; }
    if (c === '/' && c2 === '*') { const j = nguon.indexOf('*/', i + 2); i = j < 0 ? L : j + 2; code += ' '; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      const j = hetChuoi(nguon, i);
      let chu = nguon.slice(i, j + 1);
      if (c === '`') { // phần chữ của mẫu = bỏ các ${…}; mỗi ${…} đếm riêng như code
        chu = '';
        for (let k = i; k <= j; k++) {
          if (nguon[k] === '\\') { chu += nguon.slice(k, k + 2); k++; } else if (nguon[k] === '$' && nguon[k + 1] === '{') { const e = hetNgoac(nguon, k + 2); n += demChuCung(nguon.slice(k + 2, e)); k = e; } else chu += nguon[k];
        }
      }
      if (coDau(chu)) n++;
      code += '""'; i = j + 1; continue;
    }
    if (c === '/' && truocLaRegex()) {
      const j = hetRegex(nguon, i);
      if (j >= 0) { code += '/r/'; i = j + 1; continue; }
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

/** Hạ: min(nợ cũ, số đếm); 0 → GIỮ dòng với số 0 (không xoá); không bao giờ thêm tệp mới hay nâng số. */
function haNo(no, dem) {
  const ra = {};
  for (const f of Object.keys(no)) ra[f] = Math.min(no[f], dem[f] || 0);
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
