#!/usr/bin/env node
// Đột biến chạy tay cho KH-THE-2 (việc chỉ đổi src/, không có server/ client/src/ → không dot_bien.py — như KH-THE-1): mỗi cái PHẢI làm cong_cu/thu_KHTHE2.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Một đột biến có thể sửa nhiều chỗ: [tên, [[tệp, từ, thành], …]]. Bản sao trong thư mục nháp; kho không bị sửa.
// Chạy: node viec/KH-THE-2/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-the-2-'));
for (const d of ['src', 'cong_cu', 'thiet_ke', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const D = 'src/datDon.js', G = 'src/gio.js', H = 'src/giaHang.js', A = 'src/App.jsx', T = 'src/pages/ThanhToan.jsx', U = 'src/pages/UuDai.jsx', R = 'src/duongDan.js';
const DS = [
  ['VS-VI-CHO-THE-KHI-CONG-TAC-BAT', [[D, 'export const dungViCho = (gio, congTac) => !!congTac && !gio.some(laThe);', 'export const dungViCho = (gio, congTac) => !!congTac;']]],
  ['VS-TIET-KIEM-NHAN-10', [[H, '(MOC_TIET_KIEM * h.phan_tram) / 100)', '(MOC_TIET_KIEM * h.phan_tram) / 10)']]],
  ['VS-TIET-KIEM-LAM-TRON-LEN', [[H, 'Math.floor((MOC_TIET_KIEM * h.phan_tram) / 100)', 'Math.ceil((MOC_TIET_KIEM * h.phan_tram) / 100)']]],
  ['VS-SAP-HET-HAN-O-8-NGAY', [[H, "kieu: soNgay !== null && soNgay <= NGAY_NHAC_GIA_HAN ? 'sap'", "kieu: soNgay !== null && soNgay <= NGAY_NHAC_GIA_HAN + 1 ? 'sap'"]]],
  ['BV-HET-HAN-VAN-LA-HANG', [[H, 'if (!hangKhach || (soNgay !== null && soNgay < 0))', 'if (!hangKhach)']]],
  ['BV-DOC-GIO-GIU-DONG-THE', [[G, "  if (!d || d.loai !== undefined || typeof d.ma !== 'string'", "  if (d && d.loai === 'the') return { loai: 'the', hang_id: d.hang_id, so_thang: d.so_thang };\n  if (!d || d.loai !== undefined || typeof d.ma !== 'string'"]]],
  ['VS-THAM-SO-SAI-VAN-NHAN', [[G, 'const SO_NGUYEN = /^[1-9]\\d{0,5}$/;', 'const SO_NGUYEN = /^-?\\d/;']]],
  ['BV-TAO-MA-MOI-VE-GIO', [[D, "return the ? { trang: 'thanhtoanthe', tham: { h: the.hang_id, thang: the.so_thang } } : { trang: 'thanhtoan', tham: {} };", "return { trang: 'thanhtoan', tham: {} };"]]],
  ['BV-TU-TAI-LAI-O-THANH-TOAN-THE', [['src/dangKySW.js', '|uudai\\/hang\\/thanhtoan|', '|']]],
  ['VS-BACK-MAT-HANG', [[R, "cha: (e.cha || TRANG_CHU) + (chaTv ? `?${chaTv}` : '')", 'cha: e.cha || TRANG_CHU']]],
  ['BV-THE-THEM-DONG-CACH-TRA-RIENG', [[T, "  const cachTra = !dungVi ? 'qr' : duoc.vi ? 'vi' : duoc.viQr ? 'vi_qr' : 'qr';", "  const cachTra = !congTac ? 'qr' : duoc.vi ? 'vi' : duoc.viQr ? 'vi_qr' : 'qr';"]]],
];
const TRINH_DUYET = [
  ['VS-HIEN-CONG-TAC-VI-O-THANH-TOAN-THE', [[T, '      {cheDoThe ? <KhoiThe ', "      {cheDoThe && <div className=\"notif-row the-vi\" />}\n      {cheDoThe ? <KhoiThe "]]],
  ['VS-GUI-MA-GIAM-VOI-THE', [[T, '  const tuy = cheDoThe ? KHONG_MA : { maGiam };', '  const tuy = { maGiam };'], [A, '<ThanhToan key={`${r.tham.h}|${r.tham.thang}`} the=', '<ThanhToan key={`${r.tham.h}|${r.tham.thang}`} maGiam={maGiam} the=']]],
  ['BV-MUA-NGAY-THEM-VAO-GIO', [[A, "const muaThe = (h, g) => (dangNhap ? di(taoDuongDan('thanhtoanthe', { h: h.id, thang: g.so_thang })) : moDangNhap(r.chuan));", "const muaThe = (h, g) => (dangNhap ? (doiGio(themMon(gio, `the-${h.id}`, g.so_thang, '')), datThongBao(nd('app.daThem', { ten: h.ten }))) : moDangNhap(r.chuan));"]]],
  ['BV-GUI-DON-KHI-KHONG-CON-BAN', [[T, '  const coThe = duocThanhToan(gio, ds, dsHang);', '  const coThe = gio.length > 0;']]],
  ['VS-GHI-DE-CONG-TAC-VI-KHI-MUA-THE', [[T, '  const dungVi = dungViCho(gio, congTac);', '  const dungVi = dungViCho(gio, congTac); if (cheDoThe && congTac) datDungVi(false);']]],
  ['BV-THE-UU-DAI-XUONG-CUOI', [[U, "      {dangNhap ? <TheHangToi moHang={moHang} /> : <TheHang hangKhach={null} moHang={moHang} />}\n      <BannerGioVang mo={moGioVang} />", '      <BannerGioVang mo={moGioVang} />\n      <div />{dangNhap ? <TheHangToi moHang={moHang} /> : <TheHang hangKhach={null} moHang={moHang} />}']]],
  ['BV-CHAO-MUNG-THANH-DON-THUONG', [['src/pages/TheoDoiDon.jsx', "laDonChiThe(don) && ndHien('hien.the.cm')", 'false']]],
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
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHTHE2.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
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
