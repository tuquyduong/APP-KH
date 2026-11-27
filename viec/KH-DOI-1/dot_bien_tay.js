#!/usr/bin/env node
// Đột biến chạy tay cho KH-DOI-1 (việc chỉ đổi src/, không có server/ client/src/ → không dot_bien.py — như KH-VC-2, KH-NAP-1): mỗi cái PHẢI làm cong_cu/thu_KHDOI1.js ĐỎ.
// Nhóm DS bị bắt cả khi KHONG_TRINH_DUYET=1 (hàm thuần / đọc nguồn); nhóm TRINH_DUYET chỉ chạy khi gọi kèm --trinh-duyet (cần Playwright).
// Một đột biến có thể sửa nhiều chỗ: [tên, [[tệp, từ, thành], …]]. Bản sao trong thư mục nháp; kho không bị sửa.
// Chạy: node viec/KH-DOI-1/dot_bien_tay.js [--trinh-duyet] → mỗi dòng "✓ BẮT ĐƯỢC <tên>"; dòng cuối "TẤT CẢ ĐỘT BIẾN BỊ BẮT" hoặc "SÓT n".
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const NHAP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'dot-bien-kh-doi-1-'));
for (const d of ['src', 'cong_cu', 'thiet_ke', 'public', 'package.json', 'index.html', 'viec/KH-DOI-1/sym.txt']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const Q = 'src/doiQua.js', A = 'src/api.js', ND = 'src/noiDung/nd/doiQua.js', DL = 'src/duLieuKhach.js', DQ = 'src/pages/DoiQua.jsx', U = 'src/pages/UuDai.jsx', APP = 'src/App.jsx', PIN = 'src/components/PinSheet.jsx';
const DS = [
  ['VS-CONG-TAC-MAC-DINH-BAT', [[ND, "loai: 'battat', macDinh: false }", "loai: 'battat', macDinh: true }"]]],
  ['VS-APP-TU-XEP-LAI-QUA', [[Q, 'return ds.filter((q) => q && soNguyen(q.ma)', 'return [...ds].sort((a, b) => (a && b ? a.diem_can - b.diem_can : 0)).filter((q) => q && soNguyen(q.ma)']]],
  ['VS-CHO-DOI-KHI-THIEU-DIEM', [[Q, ": !du ? 'thieu' : 'doi';", ": 'doi';"]]],
  ['VS-CHO-DOI-KHI-HET-HANG', [[Q, "q.con !== true ? 'het'", "q.con === false ? 'het'"]]],
  ['VS-CON-LAI-AM', [[Q, '&& diem >= diemCan ? diem - diemCan : null', '? diem - diemCan : null']]],
  ['BV-KHO-QUA-401-THOAT-PHIEN', [[A, ' && !CUA_401_GIU_PHIEN.includes(duong)', '']]],
  ['VS-KHO-QUA-BO-TOKEN', [[A, "'/quang-cao', '/goi-nap'];", "'/quang-cao', '/goi-nap', '/kho-qua'];"]]],
  ['BV-DANG-XUAT-GIU-QUA-TOI', [[DL, '[...CUA_KHACH, cuaQuaToi].forEach((c) => c.xoa())', 'CUA_KHACH.forEach((c) => c.xoa())']]],
  ['VS-LUU-PIN', [[DQ, '    const q = chon;\n', "    const q = chon;\n    try { sessionStorage.setItem('kh_pin_cuoi', pin); } catch { /* */ }\n"]]],
  ['VS-UU-DAI-BO-CONG-TAC', [[U, "const coDoi = ndHien('hien.dq');", 'const coDoi = true;']]],
  ['BV-KHONG-LAM-MOI-SAU-DOI', [[DQ, 'lamMoi([cuaDiem, cuaVoucher, cuaQuaToi]);', 'lamMoi([cuaDiem]);']]],
];
const TRINH_DUYET = [
  ['VS-GOI-KHO-KHI-TAT', [[APP, "if (!coDoiQua && ['doiqua'", "if (false && ['doiqua'"], [APP, "{dangNhap && coDoiQua && trang === 'doiqua'", "{dangNhap && trang === 'doiqua'"]]],
  ['VS-KHOA-GUI-MOI-KHI-GUI-LAI', [[DQ, 'guiDonAnToan(than, { gui: doiDiemApp,', 'guiDonAnToan(than, { gui: (t) => doiDiemApp({ ...t, khoa_gui: taoKhoaGui() }),']]],
  ['VS-GUI-HAI-LAN-BAM-DUP', [[DQ, 'gui.current = khoaGui((than) =>', 'gui.current = ((than) =>'], [PIN, 'if (dang || so.length < DO_DAI) return;', 'if (so.length < DO_DAI) return;'], [PIN, 'disabled={dang || so.length < DO_DAI}', 'disabled={so.length < DO_DAI}']]],
  ['VS-TU-TINH-DIEM-CON', [[DQ, 'datXong({ ...kq, ten: q.ten })', 'datXong({ ...kq, diemCon: soDiem - q.diemCan, ten: q.ten })']]],
  ['VS-BO-PIN-KHOI-THAN', [[DQ, 'khoa_gui: cu ? cu.khoa_gui : taoKhoaGui(), pin };', 'khoa_gui: cu ? cu.khoa_gui : taoKhoaGui() };']]],
  ['VS-CHO-DOI-KHI-THIEU-NUT', [[DQ, "const duoc = q.nut === 'doi';", "const duoc = q.nut !== 'het';"]]],
  ['VS-NHAC-KHONG-THEO-POS', [[DQ, 'const nhac = cho.find((p) => p.nhac);', 'const nhac = cho[0];']]],
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
  const r = spawnSync(process.execPath, ['cong_cu/thu_KHDOI1.js'], { cwd: NHAP, encoding: 'utf8', timeout: 900000, env: { ...process.env, KHONG_TRINH_DUYET: trinhDuyet ? '' : '1' } });
  for (const [g, v] of goc) fs.writeFileSync(g, v);
  const dong = (r.stdout || '').trim().split('\n').pop() || '';
  const bat = r.status !== 0;
  console.log(`${bat ? '✓ BẮT ĐƯỢC' : '✗ SÓT    '} ${ten}  (${dong})`);
  return bat;
}

const coTD = process.argv.includes('--trinh-duyet');
let sot = 0;
for (const [ten, sua] of DS) if (!chay(ten, sua, false)) sot++;
if (coTD) for (const [ten, sua] of TRINH_DUYET) if (!chay(ten, sua, true)) sot++;
else console.log(`(bỏ ${TRINH_DUYET.length} đột biến trình duyệt — chạy kèm --trinh-duyet)`);
fs.rmSync(NHAP, { recursive: true, force: true });
console.log(sot ? `SÓT ${sot}` : 'TẤT CẢ ĐỘT BIẾN BỊ BẮT');
process.exit(sot ? 1 : 0);
