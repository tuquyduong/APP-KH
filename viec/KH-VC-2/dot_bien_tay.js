#!/usr/bin/env node
// Đột biến chạy tay cho KH-VC-2 (việc chỉ đổi src/, không có server/ client/src/ → không dot_bien.py — như KH-THE-1/2/3): mỗi cái PHẢI làm cong_cu/thu_KHVC2.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn / css); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Một đột biến có thể sửa nhiều chỗ: [tên, [[tệp, từ, thành], …]]. Bản sao trong thư mục nháp; kho không bị sửa.
// Chạy: node viec/KH-VC-2/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-vc-2-'));
for (const d of ['src', 'cong_cu', 'thiet_ke', 'public', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const VG = 'src/voucherGio.js', D = 'src/datDon.js', A = 'src/App.jsx', G = 'src/pages/GioHang.jsx', U = 'src/pages/UuDai.jsx', T = 'src/pages/ThanhToan.jsx', N = 'src/components/NhanMa.jsx', CSS = 'src/giaoDien/voucher.css';
const DS = [
  ['BV-GUI-VOUCHER-SHIP', [[VG, 'hoa(v.code) && !laShip(v) && !coMa(boTay, v.code)', 'hoa(v.code) && !coMa(boTay, v.code)']]],
  ['BV-KHONG-BO-MA-BO-TAY', [[VG, 'hoa(v.code) && !laShip(v) && !coMa(boTay, v.code)', 'hoa(v.code) && !laShip(v)']]],
  ['VS-HAN-MUON-TRUOC', [[VG, '(han(a.v) < han(b.v) ? -1 : han(a.v) > han(b.v) ? 1 : 0)', '(han(a.v) > han(b.v) ? -1 : han(a.v) < han(b.v) ? 1 : 0)']]],
  ['VS-CHON-TAY-DUNG-CUOI', [[VG, 'chonTay: [ma, ...boMa(chonTay, ma)]', 'chonTay: [...boMa(chonTay, ma), ma]']]],
  ['VS-GUI-VOUCHERS-RONG', [[D, 'if (Array.isArray(vouchers) && vouchers.length) t.vouchers = vouchers;', 'if (Array.isArray(vouchers)) t.vouchers = vouchers;']]],
  ['VS-THANH-TOAN-MANG-KHAC', [[A, 'maGiam={maGiam} vouchers={vouchers} lui={luiVe}', 'maGiam={maGiam} vouchers={dsGui(viVc, CHON_RONG)} lui={luiVe}']]],
  ['BV-DAT-XONG-KHONG-LAM-MOI-VI', [[A, 'lamMoi([cuaToi, cuaDon, cuaDiem, cuaVoucher]);', 'lamMoi([cuaToi, cuaDon, cuaDiem]);']]],
  ['VS-CSS-MAU-NGOAI-DEMO', [[CSS, 'color:#C62828', 'color:#D32F2F']]],
];
const TRINH_DUYET = [
  ['VS-APP-TU-GHEP-CAU', [[U, "<div className=\"t\" {...ndDau('ud.vc.moTa')}>{moTa}</div>", "<div className=\"t\" {...ndDau('ud.vc.moTa')}>{moTaGiam(loai, giaTri)}</div>"]]],
  ['VS-TU-TICH-LAI-CAI-DA-BO', [[A, 'const doiGio = (g) => { datGio(g); ghiGio(g); datMonLoi(null); };', 'const doiGio = (g) => { datGio(g); ghiGio(g); datMonLoi(null); datChonVc(CHON_RONG); };']]],
  ['BV-GIO-KHONG-HIEN-CAU-POS', [[G, '{loi && <span className="vc-loi"', '{false && loi && <span className="vc-loi"']]],
  ['VS-SHIP-CHAM-DUOC', [[G, 'disabled={ship}', 'disabled={false}']]],
  ['BV-THANH-TOAN-KHONG-KHOI-LOI', [[T, 'bg.voucherLoi.length > 0 &&', 'bg.voucherLoi.length > 99 &&']]],
  ['VS-NHAN-MA-CAU-CU', [[N, "r.data && String(r.data.mo_ta || '').trim() ?", 'false ?']]],
  ['BV-CHO-BAO-GIA-NHAP-NHAY', [[G, 'tt = trangThaiVoucher(v.code, bg || bgCu)', 'tt = trangThaiVoucher(v.code, bg)']]],
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
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHVC2.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
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
