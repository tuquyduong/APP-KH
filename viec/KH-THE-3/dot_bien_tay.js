#!/usr/bin/env node
// Đột biến chạy tay cho KH-THE-3 (việc chỉ đổi src/, không có server/ client/src/ → không dot_bien.py — như KH-THE-1, KH-THE-2): mỗi cái PHẢI làm cong_cu/thu_KHTHE3.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn / css); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Một đột biến có thể sửa nhiều chỗ: [tên, [[tệp, từ, thành], …]]. Bản sao trong thư mục nháp; kho không bị sửa.
// Chạy: node viec/KH-THE-3/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-the-3-'));
for (const d of ['src', 'cong_cu', 'thiet_ke', 'public', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const TH = 'src/theHoiVien.js', D = 'src/datDon.js', CSS = 'src/giaoDien/the_hoi_vien.css', TD = 'src/pages/TheoDoiDon.jsx', U = 'src/pages/UuDai.jsx', T = 'src/pages/ThanhToan.jsx', C = 'src/components/TheHoiVien.jsx';
const DS = [
  ['VS-MAUTHE-PHAN-BIET-HOA-THUONG', [[TH, ".replace(/đ/g, 'd').toLowerCase();", ".replace(/đ/g, 'd');"]]],
  ['VS-KIM-CUONG-DUNG-MAU-VANG', [[TH, "s.includes('kim cuong') ? 'kc' : s.includes('vang') ? 'vang' : 'hong'", "s.includes('kim cuong') ? 'vang' : s.includes('vang') ? 'vang' : 'hong'"]]],
  ['VS-HAN-QUAN-TANG-GHI-HET-HAN', [[TH, "tang ? { nhan: nd('the.thv.tang')", "tang ? { nhan: nd('the.thv.hetHan')"]]],
  ['BV-DON-CHI-THE-CON-BUOC-PHA-CHE', [[D, "if (chiThe && tt !== 'da_huy') {", "if (false && chiThe && tt !== 'da_huy') {"]]],
  ['VS-ANH-LUOT-VAN-CHAY-KHI-GIAM-CHUYEN-DONG', [[CSS, '@media (prefers-reduced-motion:reduce){.thv.chieu .thv-sang{animation:none}', '@media (prefers-reduced-motion:reduce){.thv.chieu .thv-sang{}']]],
  ['VS-KIM-CUONG-VAN-CHAY-ANH-LUOT-KHI-GIAM-CHUYEN-DONG', [[CSS, '@media (prefers-reduced-motion:reduce){.thv.kc.chieu .thv-sang{animation:none}}', '']]],
  ['VS-TEN-DAI-DAY-HAN-RA-NGOAI-THE', [[CSS, '.thv-chan > div:first-child{min-width:0}', '']]],
  ['VS-CSS-MAU-NGOAI-DEMO', [[CSS, '.thv.hong{color:#FFFFFF;', '.thv.hong{color:#123456;']]],
];
const TRINH_DUYET = [
  ['BV-CON-EMOJI-VE-O-DONG-THE', [[TD, 'tachBieuTuong(m.ten).chu', 'm.ten']]],
  ['VS-UU-DAI-THE-CHAY-ANH-LUOT', [[U, 'het_han={h.het_han} tang={tang} />', 'het_han={h.het_han} tang={tang} chieu />']]],
  ['BV-CHAO-MUNG-THE-KHONG-CHIEU', [[TD, 'tang={!!hang && hang.chi_cap === true} chieu />', 'tang={!!hang && hang.chi_cap === true} />']]],
  ['BV-CHAO-MUNG-MAT-HAN-KHI-KHONG-VE-DUOC-THE', [[TD, 'chieu thay={han && <div className="cm-han" {...pos}>{han}</div>} />', 'chieu />']]],
  ['VS-THE-VUA-O-THANH-TOAN-DUNG-CO-NHO', [[T, '<TheHoiVienChung co="vua" hang={hang} />', '<TheHoiVienChung co="nho" hang={hang} />']]],
  ['VS-THE-NHO-KHONG-AN-KHOI-TRINH-DOC', [[C, 'aria-hidden="true"><i className="thv-van" /></span>', '><i className="thv-van" /></span>']]],
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
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHTHE3.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
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
