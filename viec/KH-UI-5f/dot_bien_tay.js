#!/usr/bin/env node
// Đột biến chạy tay cho KH-UI-5f (việc chỉ đổi src/, không có dot_bien.py): mỗi cái PHẢI làm bài thử thu_KHUI5f.js ĐỎ.
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = '/home/user/APP-KH', NHAP = '/tmp/claude-0/-home-user-APP-KH/a1661746-4867-5f2d-a7a0-f04ed1e83fd1/scratchpad/mut';
fs.rmSync(NHAP, { recursive: true, force: true });
fs.mkdirSync(NHAP, { recursive: true });
for (const d of ['src', 'cong_cu', 'thiet_ke', 'package.json', 'index.html']) fs.cpSync(path.join(GOC, d), path.join(NHAP, d), { recursive: true });
fs.symlinkSync(path.join(GOC, 'node_modules'), path.join(NHAP, 'node_modules'));

const K = 'src/kehoach.js', L = 'src/kehoachLap.js';
const DS = [
  ['VS-NGUONG-KM-SAP-BO-10-PHAN-TRAM', L, 'Math.max(XE_SAP.km, hang.km * XE_SAP.tiLe)', 'XE_SAP.km'],
  ['BV-HANG-QUA-THANG-KHONG-TINH', L, "|| (ngayCon !== null && ngayCon <= 0);", ';'],
  ['VS-GIAY-30-NGAY-LOAI-TRU', L, 'soon: j - hn <= XE_SAP.giay', 'soon: j - hn < XE_SAP.giay'],
  ['BV-THUOC-HET-DOT-VAN-NHAC', L, 'export const thuocConHan = (t, j) =>', 'export const thuocConHan = (t, j) => true ||'],
  ['VS-THUOC-BAY-NGAY-LECH-MOT', L, 'const j = hn - 7 + i,', 'const j = hn - 6 + i,'],
  ['VS-CHAM-KINH-KHONG-TOI', L, 'day <= ck.dai ? 3 : 4', 'day <= ck.dai + 5 ? 3 : 4'],
  ['VS-NHAC-THUOC-LO-TEN-THUOC', K, "tieu: nd('thuoc.nhacTieu'), nhac: gioPhut(g)", 'tieu: bang.thuoc[0].ten, nhac: gioPhut(g)'],
  ['BV-NHAC-CHU-KY-LO-CHU-KINH', K, "tieu: nd('chuky.loiNhac')", "tieu: nd('chuky.sapToi')"],
  ['BV-CHUONG-LICH-LO-VIEC-RIENG', L, '!v.rieng && cacLan', 'cacLan'],
  ['VS-MAC-DINH-HO-GIA-TIEN-TRONG', K, 'ho: vk.ho ?? chuDauTen(ten)', "ho: vk.ho ?? ''"],
  ['VS-MAC-DINH-DIA-CHI-TRONG', K, "dc: vk.dc ?? (hoSo.dia_chi || '')", "dc: vk.dc ?? ''"],
  ['BV-DOI-KHACH-KHONG-XOA-KE-HOACH', 'src/luuMay.js', 'KHOA_DUNG_VI, KHOA_KE_HOACH];', 'KHOA_DUNG_VI];'],
  ['VS-LICH-OTO-THIEU-DANG-KIEM', 'src/noiDung/nd/tienIch.js', "giay: 'Bảo hiểm bắt buộc;Đăng kiểm'", "giay: 'Bảo hiểm bắt buộc'"],
  ['VS-VUA-LAM-KHONG-LAY-KM-XE', K, 'km: kmHopLe(km) || x.km', 'km: kmHopLe(km)'],
  ['VS-DOI-UONG-KHONG-BO-DANH-DAU', K, 'cu.includes(k) ? cu.filter((x) => x !== k) : [...cu, k]', '[...cu, k]'],
  ['BV-SAP-TOI-CHU-KY-CHO-ANH', K, 'if (bang.chuKy.bat && coChuKy(xung))', 'if (bang.chuKy.bat)'],
  ['VS-GHI-KY-MOI-GHI-CA-KY-NHAM', L, 'd >= 10 && d <= 120 ? [...c.ls, d]', 'true ? [...c.ls, d]'],
  ['VS-DOC-BAN-CU-GIU-KHOA-THU', K, 'const ck = chuKyTrong(); // khoa / thu', 'const ck = { ...chuKyTrong(), khoa: c.khoa, thu: c.thu }; // khoa / thu'],
];
const TRINH_DUYET = [
  ['BV-HOI-XOA-XE-XOA-LUON', 'src/components/XeCo.jsx', '{...bam(() => datHoiXoa(true))} {...ndDau(\'xe.xoaXe\')}>', '{...bam(xoa)} {...ndDau(\'xe.xoaXe\')}>'],
];

function chay(ten, tep, tu, den, trinhDuyet) {
  const f = path.join(NHAP, tep), goc = fs.readFileSync(f, 'utf8');
  if (!goc.includes(tu)) return console.log(`? ${ten}: KHÔNG tìm thấy chỗ vá trong ${tep}`) || false;
  fs.writeFileSync(f, goc.replace(tu, den));
  const r = spawnSync('sh', ['-c', (trinhDuyet ? '' : 'KHONG_TRINH_DUYET=1 ') + 'node cong_cu/thu_KHUI5f.js'], { cwd: NHAP, encoding: 'utf8', timeout: 500000 });
  fs.writeFileSync(f, goc);
  const dong = ((r.stdout || '').trim().split('\n').pop() || '') + (r.status === 0 ? '' : '');
  const bat = r.status !== 0;
  console.log(`${bat ? '✓ BẮT ĐƯỢC' : '✗ SÓT    '} ${ten}  (${dong})`);
  return bat;
}
let sot = 0;
for (const [ten, tep, tu, den] of DS) if (!chay(ten, tep, tu, den, false)) sot++;
if (process.argv.includes('--trinh-duyet')) for (const [ten, tep, tu, den] of TRINH_DUYET) if (!chay(ten, tep, tu, den, true)) sot++;
console.log(sot ? `SÓT ${sot}` : 'TẤT CẢ ĐỘT BIẾN BỊ BẮT');
process.exit(sot ? 1 : 0);
