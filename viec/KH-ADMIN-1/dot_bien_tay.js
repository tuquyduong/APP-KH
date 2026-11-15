#!/usr/bin/env node
// Đột biến chạy tay cho KH-ADMIN-1 (việc chỉ đổi src/, không có dot_bien.py — như KH-THE-1): mỗi cái PHẢI làm bài thử thu_KHADMIN1.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Chạy: node viec/KH-ADMIN-1/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-admin-1-')); // thư mục nháp mới mỗi lần chạy
for (const d of ['src', 'cong_cu', 'thiet_ke', 'viec/KH-ADMIN-1/hop_dong_nd_v1.md', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const API = 'src/api.js', KHO = 'src/noiDung/khoNoiDung.js', ND = 'src/noiDung/nd.js', BANG = 'src/components/CheDoSuaBang.jsx', SUA = 'src/components/CheDoSua.jsx';
const DS = [
  ['BV-GUI-TOKEN-KHACH-SANG-ND', API, 'if (ve) tieuDe.Authorization = `Bearer ${ve}`;', 'if (ve || docToken()) tieuDe.Authorization = `Bearer ${ve || docToken()}`;'],
  ['VS-GUI-VE-SANG-API-KH', API, "const token = CUA_CONG_KHAI.includes(duong) ? '' : docToken();", "const token = (JSON.parse(sessionStorage.getItem('nd_ve') || 'null') || {}).ve || (CUA_CONG_KHAI.includes(duong) ? '' : docToken());"],
  ['VS-VE-VAO-LOCALSTORAGE', KHO, 'thu(() => sessionStorage.setItem(KHOA_VE, JSON.stringify(gon)));', 'thu(() => localStorage.setItem(KHOA_VE, JSON.stringify(gon)));'],
  ['BV-KHACH-THAY-NHAP', KHO, 'export const dangSua = () => coVe() && (', 'export const dangSua = () => ('],
  ['BV-BO-CHAN-GHI-KHI-SUA', API, "if (dangSua && phuongThuc !== 'GET'", "if (false && dangSua && phuongThuc !== 'GET'"],
  ['VS-CHAN-CA-BAO-GIA', API, '!DUOC_GHI_KHI_SUA.test(duong)', 'true'],
  ['VS-CHAN-GHI-STATUS-0', API, "throw loiApi(423, 'CHE_DO_SUA'", "throw loiApi(0, 'CHE_DO_SUA'"],
  ['VS-NHAN-ANH-HTTP', ND, 'const ANH_APP = /^\\/anh\\/(?!.*\\.\\.)[\\w./-]+$/;', 'const ANH_APP = /^(https?:)?\\/[\\w./:-]+$/;'],
  ['VS-CAT-KHOANG-TRANG', BANG, 'const luu = (gt) => lam(() => luuNhap(m.khoa, gt, soBan)', "const luu = (gt) => lam(() => luuNhap(m.khoa, typeof gt === 'string' ? gt.trim() : gt, soBan)"],
  ['BV-BO-KIEM-CHIP', ND, 'laChuoi(s) && cungTap(choDien(s), m.bien || [])', 'laChuoi(s) && true'],
  ['VS-XOA-KH_ND_BAN-KHI-DANG-XUAT', 'src/luuMay.js', 'KHOA_DUNG_VI, KHOA_KE_HOACH];', "KHOA_DUNG_VI, KHOA_KE_HOACH, 'kh_nd_ban'];"],
  ['BV-KIEMKHOP-CONG-KHAI', 'src/duongDan.js', "(dau === 'kiemkhop' && doan.length === 1)", 'false'],
  ['BV-SAP-TOI-THEO-TEN', 'src/kehoach.js', '!boLe.has(h.n))', '!/Tết Nguyên đán|Trung thu|Đoan ngọ|Vu Lan/.test(h.n))'],
  ['BV-BO-CHAN-TRUNG-DANH-SACH', ND, '        && !dongTrung(m, gt);', '        ;'],
  ['BV-401-KHONG-THOAT', KHO, 'if (e.status === 401 && v) { thoatQuanTri(); khiHetVe(); }', ''],
  ['BV-DANG-XUAT-KHONG-KHOA', 'src/noiDung/quanTri.js', "['tk.dangXuat', 'hx.xoa',", "['hx.xoa',"],
  ['BV-XOA-HANG-XE-KHONG-KHOA', 'src/noiDung/quanTri.js', ", 'xe.hangXoa', 'ti.xoaNgay']", "]"],
  ['VS-ADMIN-LA-TRANG-KHACH', 'src/duongDan.js', "|| r.trang === 'dangnhap' || r.quanTri ? ''", "|| r.trang === 'dangnhap' ? ''"],
];
const TRINH_DUYET = [
  ['VS-409-TU-GUI-LAI', SUA, "if (e.code === 'CO_BAN_MOI_HON') { await hoiBanMoi(); await taiNhap();", "if (e.code === 'CO_BAN_MOI_HON') { await hoiBanMoi(); await taiNhap(); await capNhat(banDangDung().so_ban, ghiChu).catch(() => {});"],
  ['BV-BUT-MO-KHI-CHAM-PHAN-TU', SUA, "    phone.addEventListener('click', chan, true);", "    phone.addEventListener('click', chan, true); phone.addEventListener('click', (e) => { const el = e.target.closest && e.target.closest('[data-nd]'); if (el && !el.closest(NGOAI)) { e.preventDefault(); e.stopPropagation(); } }, true);"],
  ['BV-NHAP-SAI-DANG-VO-BANG', BANG, 'nhap && hopLe(m, nhap.gia_tri) ? nhap.gia_tri', 'nhap ? nhap.gia_tri'],
  ['BV-KHOA-KHONG-CHI-DUONG', SUA, "m.khoaBoi === 'pos' ? qt('khoaPos', { chiDuong: m.chiDuong })", "m.khoaBoi === 'pos' ? qt('khoaTuTinh')"],
];

function chay(ten, tep, tu, den, trinhDuyet) {
  const f = path.join(NHAP, tep), goc = fs.readFileSync(f, 'utf8');
  if (!goc.includes(tu)) { console.log(`? ${ten}: KHÔNG tìm thấy chỗ vá trong ${tep}`); return false; }
  fs.writeFileSync(f, goc.replace(tu, den));
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHADMIN1.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
  fs.writeFileSync(f, goc);
  const dong = (r.stdout || '').trim().split('\n').pop() || '';
  const bat = r.status !== 0;
  console.log(`${bat ? '✓ BẮT ĐƯỢC' : '✗ SÓT    '} ${ten}  (${dong})`);
  return bat;
}
let sot = 0;
for (const [ten, tep, tu, den] of DS) if (!chay(ten, tep, tu, den, false)) sot++;
if (process.argv.includes('--trinh-duyet')) for (const [ten, tep, tu, den] of TRINH_DUYET) if (!chay(ten, tep, tu, den, true)) sot++;
fs.rmSync(NHAP, { recursive: true, force: true });
console.log(sot ? `SÓT ${sot}` : 'TẤT CẢ ĐỘT BIẾN BỊ BẮT');
process.exit(sot ? 1 : 0);
