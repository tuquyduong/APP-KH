#!/usr/bin/env node
// Đột biến chạy tay cho KH-NAP-1 (việc chỉ đổi src/, không có server/ client/src/ → không dot_bien.py — như KH-THE-1/2): mỗi cái PHẢI làm cong_cu/thu_KHNAP1.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Một đột biến có thể sửa nhiều chỗ: [tên, [[tệp, từ, thành], …]]. Bản sao trong thư mục nháp; kho không bị sửa.
// Chạy: node viec/KH-NAP-1/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-nap-1-'));
for (const d of ['src', 'cong_cu', 'thiet_ke', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const D = 'src/datDon.js', G = 'src/gio.js', API = 'src/api.js', V = 'src/pages/ViTien.jsx', U = 'src/pages/UuDai.jsx', TD = 'src/pages/TheoDoiDon.jsx', T = 'src/pages/ThanhToan.jsx';
const DS = [
  ['VS-DONG-NAP-GUI-KEM-SO-LUONG', [[D, "laNap(d) ? { loai: 'nap', ma_goi: d.ma_goi }", "laNap(d) ? { loai: 'nap', ma_goi: d.ma_goi, so_luong: 1 }"]]],
  ['BV-NAP-CHO-TRA-VI', [[D, 'export const dungViCho = (gio, congTac) => !!congTac && !gio.some((d) => laThe(d) || laNap(d));', 'export const dungViCho = (gio, congTac) => !!congTac && !gio.some(laThe);']]],
  ['BV-GIO-CHI-NAP-BI-CHAN-NGOAI-GIO', [[G, 'export const coDoUong = (gio) => gio.some((d) => !laThe(d) && !laNap(d));', 'export const coDoUong = (gio) => gio.some((d) => !laThe(d));']]],
  ['BV-GOI-NAP-GUI-KEM-TOKEN', [[API, "'/quang-cao', '/goi-nap'];", "'/quang-cao'];"]]],
  ['VS-THUONG-GOI-TU-TINH-KHAC', [['src/viTien.js', 'g.vao > g.tra ? g.vao - g.tra : 0', 'g.vao >= g.tra ? Math.round(g.tra * 0.05) : 0']]],
  ['BV-TAO-MA-MOI-NAP-VE-GIO', [[D, "  if (nap) return { trang: 'napvi', tham: { goi: nap.ma_goi } };\n", '']]],
  ['BV-DAT-LAI-DEM-DONG-NAP', [[D, "    else if (m.loai !== 'the' && m.loai !== 'nap') boQua++;", "    else if (m.loai !== 'the') boQua++;"]]],
  ['BV-DON-NAP-4-BUOC', [[D, '  if (chiNap && tt !== \'da_huy\') {', '  if (false) {']]],
];
const TRINH_DUYET = [
  ['VS-NHAN-THUONG-KHI-VAO-BANG-TRA', [[V, '{th > 0 && <span className="vt-goi-thuong"', '{th >= 0 && <span className="vt-goi-thuong"']]],
  ['VS-DA-NAP-LAY-SO-TU-GOI', [[TD, 'const so = dong && dinhDangGia(dong.soTien);', 'const so = dinhDangGia(don.tong + 5000);']]],
  ['BV-NUT-NAP-HIEN-KHI-KHONG-GOI', [[V, "const coNap = dsGoi.length > 0 && ndHien('hien.vt.nap');", "const coNap = ndHien('hien.vt.nap');"], [U, "const coNap = goiNapDs(dungCua(cuaGoiNap).dl).length > 0 && ndHien('hien.vt.nap');", "const coNap = ndHien('hien.vt.nap');"]]],
  ['BV-THANH-TOAN-NAP-GUI-MA-GIAM', [[T, '  const tuy = cheDoThe || cheDoNap ? KHONG_MA : { maGiam };', "  const tuy = cheDoThe ? KHONG_MA : { maGiam: cheDoNap ? 'GIAM10' : maGiam };"]]],
  ['BV-GOI-KHONG-CON-VAN-BAO-GIA', [[T, '  const coThe = duocThanhToan(gio, ds, dsHang, dsGoi);', '  const coThe = cheDoNap ? gio.length > 0 : duocThanhToan(gio, ds, dsHang, dsGoi);']]],
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
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHNAP1.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
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
