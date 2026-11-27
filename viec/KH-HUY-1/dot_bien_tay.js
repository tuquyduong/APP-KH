#!/usr/bin/env node
// Đột biến chạy tay cho KH-HUY-1 (việc chỉ đổi src/, không có server/ client/src/ → không dot_bien.py — như KH-NAP-1): mỗi cái PHẢI làm cong_cu/thu_KHHUY1.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Một đột biến có thể sửa nhiều chỗ: [tên, [[tệp, từ, thành], …]]. Bản sao trong thư mục nháp; kho không bị sửa.
// Chạy: node viec/KH-HUY-1/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-huy-1-'));
for (const d of ['src', 'cong_cu', 'thiet_ke', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const H = 'src/hoaDon.js', D = 'src/datDon.js', DH = 'src/components/DonHuy.jsx', TD = 'src/pages/TheoDoiDon.jsx', DO = 'src/pages/Don.jsx', APP = 'src/App.jsx';
const DS = [
  ['VS-HOAN-NHAN-AM', [[H, 'Number.isInteger(v) && v >= 0 ? v : null', 'Number.isInteger(v) ? v : null']]],
  ['VS-HOAN-NHAN-CHUOI', [[H, 'Number.isInteger(v) && v >= 0 ? v : null', "(typeof v === 'string' || Number.isInteger(v)) && v >= 0 ? Number(v) : null"]]],
  ['VS-HIEN-HOP-HOAN-KHI-0', [[DH, "typeof hoan === 'number' && hoan > 0", "typeof hoan === 'number' && hoan >= 0"]]],
  ['VS-APP-TU-GHEP-LY-DO', [[TD, 'lyDo={don.lyDoHuy}', "lyDo={don.lyDoHuy || 'Khác'}"]]],
  ['VS-APP-TU-TINH-HOAN', [[TD, 'hoan={don.hoanVaoTaiKhoan}', 'hoan={don.hoanVaoTaiKhoan ?? don.tong}']]],
  ['BV-DOC-LY-DO-KHI-CHUA-HUY', [[D, "lyDoHuy: d.tien_trinh === 'da_huy' ? lyDoHuy(d) : null", 'lyDoHuy: lyDoHuy(d)']]],
  ['BV-DOC-HOAN-KHI-CHUA-HUY', [[D, "hoanVaoTaiKhoan: d.tien_trinh === 'da_huy' ? soHoan(d) : null", 'hoanVaoTaiKhoan: soHoan(d)']]],
  ['BV-CHI-TIET-BO-MOVI', [[APP, '<ChiTietDon ma={r.tham.ma} lui={luiVe} moVi={moVi} />', '<ChiTietDon ma={r.tham.ma} lui={luiVe} />']]],
  ['BV-THEO-DOI-BO-MOVI', [[TD, 'hoan={don.hoanVaoTaiKhoan} moVi={moVi} />', 'hoan={don.hoanVaoTaiKhoan} />']]],
  ['BV-KHONG-LAM-MOI-SO-DU-O-CHI-TIET', [[DO, 'if (hoan > 0) lamMoi([cuaToi]);', '']]],
  ['BV-KHONG-LAM-MOI-SO-DU-O-THEO-DOI', [[TD, "if (tt === 'da_huy') daHuy();", '']]],
  ['BV-LICH-SU-DONG-HOAN-CHUA-DANH-DAU-KHOA', [[DO, "<div className=\"date\" {...ndDau('dh.huy.hoan')}>", '<div className="date">']]],
];
const TRINH_DUYET = [
  ['VS-LICH-SU-HIEN-HOAN-0', [[DO, 'soHoan(d) > 0 && ndHien', 'soHoan(d) !== null && ndHien']]],
  ['BV-LICH-SU-HIEN-DONG-HOAN-CHO-DON-CHUA-HUY', [[DO, "d.tien_trinh === 'da_huy' && soHoan(d) > 0", 'soHoan(d) > 0']]],
  ['BV-CHI-TIET-HIEN-HOP-KHI-CHUA-HUY', [[DO, "{don.tien_trinh === 'da_huy' && <DonHuy", '{<DonHuy']]],
  ['VS-DON-HUY-XEM-VI-KHONG-MO-VI', [[DH, 'className="ghost-btn" onClick={moVi}', 'className="ghost-btn" onClick={() => {}}']]],
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
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHHUY1.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
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
