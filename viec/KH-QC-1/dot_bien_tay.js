#!/usr/bin/env node
// Đột biến tay KH-QC-1 (D3): sửa cố ý code đã làm, chạy cong_cu/thu_KHQC1.js, bài thử PHẢI đỏ; luôn khôi phục file sau mỗi lần.
// VS- = vá sai (làm sai cách); BV- = bỏ vá. Chạy từ gốc kho: node viec/KH-QC-1/dot_bien_tay.js
// Cột cuối: true = cần Chromium mới bắt được (chạy cả phần 2); false = phần 1 đủ (đặt KHONG_TRINH_DUYET=1 cho nhanh).
'use strict';
const fs = require('fs');
const { spawnSync } = require('child_process');

const QC = 'src/quangCao.js', API = 'src/api.js', APP = 'src/App.jsx';
const DOT_BIEN = [
  ['VS-SAP-UU-TIEN-LON-TRUOC', QC, '&& hopGio(r.tu_gio, r.den_gio, bayGio)); // giữ thứ tự POS', '&& hopGio(r.tu_gio, r.den_gio, bayGio)).sort((p, q) => (+q.uu_tien || 0) - (+p.uu_tien || 0));', false],
  ['VS-DONG-HO-MAY-THAY-BAYGIO', QC, 'const nay = gioPhut(bay)', 'const nay = gioPhut(new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 19))', false],
  ['BV-GUI-TOKEN-CHO-QUANG-CAO', API, "'/chuong-trinh', '/quang-cao']", "'/chuong-trinh']", false],
  ['VS-BANNER-LAY-DONG-KHONG-TIEU-DE', QC, "|| chuoi(r.tieu_de));", "|| chuoi(r.chu_dai));", false],
  ['VS-DEN-GIO-NHAN-BANG', QC, 'x <= y ? gioNay >= x && gioNay < y :', 'x <= y ? gioNay >= x && gioNay <= y :', false],
  ['VS-MON-THIEU-MA-KHONG-BAM', QC, "{ dich: 'menu', maMon: '' } : {", "{ dich: '', maMon: '' } : {", false],
  ['VS-DAI-DUNG-DICH-BANNER', APP, '{ ...quangCaoTho, ...quangCaoTho.dai }', 'quangCaoTho', false],
  ['BV-HOI-LAI-SAU-10-PHUT', APP, '>= PHUT_KIEM * 60000', '>= 0', true],
  ['BV-HOI-MOI-LAN-DOI-TRANG', APP, 'if (daHoiQc.current || !(coDai(trang)', 'if (!(coDai(trang)', true],
];

const chayThu = (trinhDuyet) => {
  const env = { ...process.env };
  if (!trinhDuyet) env.KHONG_TRINH_DUYET = '1';
  const r = spawnSync('node', ['cong_cu/thu_KHQC1.js'], { encoding: 'utf8', env });
  const dong = r.stdout.split('\n').filter((d) => d.trim());
  return [r.status, dong.length ? dong[dong.length - 1] : '(không có đầu ra)'];
};

const xanh = [];
for (const [ten, tep, cu, moi, trinhDuyet] of DOT_BIEN) {
  const goc = fs.readFileSync(tep, 'utf8');
  if (goc.split(cu).length - 1 !== 1) { console.log(`${ten}: KHÔNG ÁP ĐƯỢC (${JSON.stringify(cu.slice(0, 40))} xuất hiện ${goc.split(cu).length - 1} lần)`); xanh.push(ten); continue; }
  let ma, dong;
  try { fs.writeFileSync(tep, goc.replace(cu, () => moi)); [ma, dong] = chayThu(trinhDuyet); } finally { fs.writeFileSync(tep, goc); }
  console.log(`${ten}: ${ma ? 'ĐỎ (đúng)' : 'XANH (SAI — bài thử không bắt được)'} — ${dong}`);
  if (!ma) xanh.push(ten);
}
console.log(xanh.length ? `\n${xanh.length} đột biến KHÔNG bị bắt: ${xanh.join(', ')}` : `\nCả ${DOT_BIEN.length} đột biến đều bị bài thử bắt.`);
process.exit(xanh.length ? 1 : 0);
