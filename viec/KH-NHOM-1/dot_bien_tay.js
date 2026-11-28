#!/usr/bin/env node
// Đột biến chạy tay cho KH-NHOM-1 (việc chỉ đổi src/, không có server/ client/src/ → không dot_bien.py — như KH-HUY-1): mỗi cái PHẢI làm cong_cu/thu_KHNHOM1.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Một đột biến có thể sửa nhiều chỗ: [tên, [[tệp, từ, thành], …]]. Bản sao trong thư mục nháp; kho không bị sửa.
// Chạy: node viec/KH-NHOM-1/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-nhom-1-'));
for (const d of ['src', 'cong_cu', 'thiet_ke', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const L = 'src/menuLoc.js', MN = 'src/pages/Menu.jsx';
const DS = [
  ['VS-HIEN-NHOM-THAY-NHOM-TEN', [[L, "return ten || maNhom(m) || nd('menu.nhomKhac');", "return maNhom(m) || ten || nd('menu.nhomKhac');"]]],
  ['BV-BO-XEP-THEO-NHOM-THU-TU', [[L, '.sort((a, b) => a.thuTu - b.thuTu)', '.sort(() => 0)']]],
  ['VS-GOP-HAI-MA-TRUNG-TEN', [[L, 'const ma = maNhom(m);', 'const ma = tenNhom(m);']]],
  ['VS-POS-CU-THIEU-NHOM-TEN-HIEN-KHAC', [[L, "return ten || maNhom(m) || nd('menu.nhomKhac');", "return ten || nd('menu.nhomKhac');"]]],
  ['VS-BIEU-TUONG-KHOP-THEO-MA', [[L, 'bieuTuongNhom(tenNhom(m))', 'bieuTuongNhom(maNhom(m))']]],
  ['VS-THU-TU-NHAN-CHUOI', [[L, 'Number.isFinite(m.nhom_thu_tu) ? m.nhom_thu_tu : 9999', 'Number.isFinite(Number(m.nhom_thu_tu)) ? Number(m.nhom_thu_tu) : 9999']]],
];
const TRINH_DUYET = [
  ['VS-LOC-THEO-TEN', [[MN, 'loc.filter((m) => khoaNhom(m) === nhom)', 'loc.filter((m) => (m.nhom_ten || m.nhom) === nhom)']]],
  ['VS-SLUG-THEO-TEN', [[MN, '(nhomCo.find((n) => slug(n.id) === nhomSlug) || TAT_CA).id', '(nhomCo.find((n) => slug(n.ten) === nhomSlug) || TAT_CA).id']]],
  ['VS-O-NHOM-POS-DE-LEN-O-RIENG-GIO-VANG', [[MN, ' && s !== GV_SLUG', '']]],
];

function chay(ten, sua, trinhDuyet) {
  const goc = new Map();
  for (const [tep, tu, den] of sua) {
    const f = path.join(NHAP, tep), cu = goc.get(f) ?? fs.readFileSync(f, 'utf8');
    if (!goc.has(f)) goc.set(f, cu);
    const nay = fs.readFileSync(f, 'utf8');
    if (!nay.includes(tu)) { console.log(`? ${ten}: KHÔNG tìm thấy chỗ vá trong ${tep}`); for (const [g, v] of goc) fs.writeFileSync(g, v); return false; }
    fs.writeFileSync(f, nay.replace(tu, den));
  }
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHNHOM1.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
  for (const [g, v] of goc) fs.writeFileSync(g, v);
  const dong = (r.stdout || '').trim().split('\n').pop() || '';
  const bat = r.status !== 0;
  console.log(`${bat ? '✓ BẮT ĐƯỢC' : '✗ SÓT    '} ${ten}  (${dong})`);
  return bat;
}
let sot = 0;
for (const [ten, sua] of DS) if (!chay(ten, sua, false)) sot++;
if (process.argv.includes('--trinh-duyet')) for (const [ten, sua] of TRINH_DUYET) if (!chay(ten, sua, true)) sot++;
console.log(sot ? `SÓT ${sot}` : 'TẤT CẢ ĐỘT BIẾN BỊ BẮT');
process.exit(sot ? 1 : 0);
