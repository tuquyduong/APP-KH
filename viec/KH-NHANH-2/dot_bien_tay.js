#!/usr/bin/env node
// Đột biến chạy tay cho KH-NHANH-2 (việc chỉ đổi src/ + index.html, không có server/ client/src/ → không dot_bien.py — như KH-VC-2): mỗi cái PHẢI làm
// cong_cu/thu_KHNHANH2.js ĐỎ. Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn / dựng thử); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet.
// Một đột biến có thể sửa nhiều chỗ: [tên, [[tệp, từ, thành], …]]. Bản sao trong thư mục nháp; kho không bị sửa.
// Chạy: node viec/KH-NHANH-2/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-nhanh-2-'));
for (const d of ['src', 'cong_cu', 'thiet_ke', 'public', 'package.json', 'index.html', 'vite.config.mjs']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const A = 'src/api.js', D = 'src/datDon.js', DD = 'src/dungDatDon.js', DL = 'src/duLieuKhach.js', G = 'src/pages/GioHang.jsx', CSS = 'src/giaoDien/cho.css', H = 'index.html';
const DS = [
  ['VS-DEM-CA-LUOT-NGAM', [[A, 'if (soNgam || CUA_NGAM.includes(duong)) return goiThat', 'if (CUA_NGAM.includes(duong)) return goiThat']]],
  ['BV-BO-TRE-300', [[A, 'baoCho(true); }, MS_TRE_CHO);', 'baoCho(true); }, 0);']]],
  ['VS-VONG-CO-NEN', [[CSS, '.cho-xoay.cho-giua{ position:absolute;', '.cho-xoay.cho-giua{ background:var(--cream); position:absolute;']]],
  ['VS-LOP-PHU-CA-MAN', [[CSS, 'top:50%; left:50%; margin:-18px 0 0 -18px;', 'inset:0;']]],
  ['VS-GOM-CHI-DUOI', [[D, 'yen = !h && bay - cuoi >= ms;', 'yen = false;']]],
  ['VS-PRECONNECT-CO-API', [[H, "l.href=new URL(g).origin;", "l.href=new URL(g).origin+'/api/kh';"]]],
  ['BV-KHO-DA-CO-VAN-DEM', [[DL, '(coDl ? ngam(ham) : ham())', 'ham()']]],
];
const TRINH_DUYET = [
  ['VS-NUT-DI-TIEP-MO-KHI-TINH-LAI', [[G, 'const coThe = coMo && !dangTinh;', 'const coThe = coMo;']]],
  ['VS-NUT-MANG-SO-CU', [[G, "<span>{bg ? `${dinhDangGia(bg.tong)} →` : '→'}</span>", "<span>{bg || bgCu ? `${dinhDangGia((bg || bgCu).tong)} →` : '→'}</span>"], [G, 'const coThe = coMo && !dangTinh;', 'const coThe = coMo;']]],
  ['BV-LUOT-CU-GHI-DE-GIO-MOI', [[DD, '(bg) => { if (!huy) datTt({ bg, loi:', '(bg) => { if (true) datTt({ bg, loi:']]],
  ['BV-THEO-DOI-DONG-HO-DEM', [[DD, '(dongHo.current ? ngam(xem) : xem())', 'xem()']]],
  // vòng sửa 1 (/ra-soat): lỗi / CHUA_MO không được kẹt "đang tính" (nút khoá vĩnh viễn); tab Menu khi đã có menu phải ngầm (ca hành vi, không chỉ đọc nguồn).
  ['VS-LOI-KET-DANG-TINH', [[DD, "loi: e.code === 'CHUA_MO' ? '' : e.message, khoa, xong: true", "loi: e.code === 'CHUA_MO' ? '' : e.message, khoa, xong: false"]]],
  // sau soát vòng 2: bài Chromium nạp CSS như App (theo import thật) → bỏ dòng import cho.css thì vòng mất kiểu và bài phải đỏ.
  ['BV-BO-NAP-CHO-CSS', [['src/main.jsx', "import './giaoDien/cho.css'\n", '']]],
  ['BV-TAB-MENU-DEM', [['src/pages/Menu.jsx', '(tai.dl ? ngam(tai.taiLai) : tai.taiLai())', '(tai.dl ? (ngam(() => 0), tai.taiLai()) : tai.taiLai())']]],
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
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHNHANH2.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
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
