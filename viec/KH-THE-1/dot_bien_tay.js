#!/usr/bin/env node
// Đột biến chạy tay cho KH-THE-1 (việc chỉ đổi src/, không có dot_bien.py — như KH-UI-5f): mỗi cái PHẢI làm bài thử thu_KHTHE1.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Chạy: node viec/KH-THE-1/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = process.env.NHAP_DOT_BIEN || '/tmp/claude-0/-home-user-APP-KH/2e239bb3-0d06-54ae-9130-2e94f30acec1/scratchpad/mut';
fs.rmSync(NHAP, { recursive: true, force: true });
fs.mkdirSync(NHAP, { recursive: true });
for (const d of ['src', 'cong_cu', 'thiet_ke', 'viec/KH-THE-1/hop_dong_v13.md', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const D = 'src/datDon.js', G = 'src/gio.js', H = 'src/giaHang.js', A = 'src/App.jsx';
const DS = [
  ['VS-THE-GUI-KEM-MA', D, "(laThe(d) ? { loai: 'the', hang_id: d.hang_id, so_thang: d.so_thang } :", "(laThe(d) ? { loai: 'the', hang_id: d.hang_id, so_thang: d.so_thang, ma: '' } :"],
  ['BV-TRA-THE-TRUOC-GUI-MA-GIAM', D, "{ gio: gio.filter(laThe), tuy: { maGiam: '' } }", '{ gio: gio.filter(laThe), tuy }'],
  ['BV-TRA-THE-TRUOC-DON-CA-GIO', A, 'doiGio(boDongDaGui(gio, g.than.mon));', 'doiGio([]);'],
  ['BV-CHO-HAI-DONG-THE', G, '  const i = gio.findIndex(laThe);\n  if (i < 0)', '  const i = -1;\n  if (i < 0)'],
  ['BV-GIO-CHI-THE-BI-CHAN-NGOAI-GIO', D, "(coDoUong(gio) ? chanDat(gh) : '')", 'chanDat(gh)'],
  ['VS-MA-THE-THANH-CHUA-RO', D, '&& !LUOT_GUI_LAI[e.code] ?', '&& !LUOT_GUI_LAI[e.code] && !MA_THE.includes(e.code) ?'],
  ['BV-BAO-RA-QUAY-DON-CHI-THE', 'src/baoDonXong.js', "const DANG_CHAY = ['da_tra', 'dang_lam'];", "const DANG_CHAY = ['cho_tra', 'da_tra', 'dang_lam'];"],
  ['BV-DAT-LAI-THEM-THE', D, 'if (m.ma && (ds || []).some((x) => x.ma === m.ma)', "if ((m.loai === 'the' && m.so_luong > 0) || m.ma && (ds || []).some((x) => x.ma === m.ma)"],
  ['BV-C7-KHONG-DON-KHI-THEO-DOI-KHONG-MO', D, "return d && daThanhToan(d.tien_trinh) ? String(g.ma_don) : '';", "return '';"],
  ['VS-C7-DON-KHI-CON-CHO-TRA', D, "!!tt && tt !== 'cho_tra' && tt !== 'da_huy'", "!!tt && tt !== 'da_huy'"],
  ['VS-C7-DON-HAI-LAN', D, '!g.ma_don || g.xong ||', '!g.ma_don ||'],
  ['VS-NHAC-GIA-HAN-8-NGAY', H, 'n <= NGAY_NHAC_GIA_HAN ?', 'n <= NGAY_NHAC_GIA_HAN + 1 ?'],
  ['VS-NUT-MUA-BO-THU-BAC', H, 'toi > h.thu_bac', 'toi < h.thu_bac'],
  ['VS-THE-HONG-VAN-DOC', G, "&& !('ma' in d) ?", '?'],
  ['VS-DON-GIO-XOA-DONG-THEM-SAU', G, 'if (i >= 0) con = doiSoLuong(con, i, con[i].so_luong - m.so_luong);', 'if (i >= 0) con = xoaDong(con, i);'],
];
const TRINH_DUYET = [
  ['BV-C7-APP-KHONG-NGHE-KHO-DON', A, 'const maDaTra = dangNhap ? maDonDaTra(', 'const maDaTra = false ? maDonDaTra('],
  ['BV-THEO-DOI-CHI-THE-VAN-MOI-RA-QUAY', 'src/pages/TheoDoiDon.jsx', "{tt === 'xong' && !theXong &&", "{tt === 'xong' &&"],
  ['BV-GIO-KHONG-GOI-Y-TRA-THE-TRUOC', 'src/pages/GioHang.jsx', "coDoUong(gio) && ndHien('hien.gio.truocThe')", "false && ndHien('hien.gio.truocThe')"],
  ['BV-THANH-TOAN-KHONG-DANH-DAU-THE', 'src/pages/ThanhToan.jsx', "danhDauMon({ the: true, chu: e.message }); return; }", 'return; }'],
];

function chay(ten, tep, tu, den, trinhDuyet) {
  const f = path.join(NHAP, tep), goc = fs.readFileSync(f, 'utf8');
  if (!goc.includes(tu)) { console.log(`? ${ten}: KHÔNG tìm thấy chỗ vá trong ${tep}`); return false; }
  fs.writeFileSync(f, goc.replace(tu, den));
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHTHE1.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
  fs.writeFileSync(f, goc);
  const dong = (r.stdout || '').trim().split('\n').pop() || '';
  const bat = r.status !== 0;
  console.log(`${bat ? '✓ BẮT ĐƯỢC' : '✗ SÓT    '} ${ten}  (${dong})`);
  return bat;
}
let sot = 0;
for (const [ten, tep, tu, den] of DS) if (!chay(ten, tep, tu, den, false)) sot++;
if (process.argv.includes('--trinh-duyet')) for (const [ten, tep, tu, den] of TRINH_DUYET) if (!chay(ten, tep, tu, den, true)) sot++;
console.log(sot ? `SÓT ${sot}` : 'TẤT CẢ ĐỘT BIẾN BỊ BẮT');
process.exit(sot ? 1 : 0);
