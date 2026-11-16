#!/usr/bin/env node
// Đột biến tay KH-SUA-1 (B3): mỗi đột biến làm hỏng MỘT chỗ vá trên BẢN SAO (thư mục tạm), chạy thu_KHSUA1.js ở đó với KHONG_TRINH_DUYET=1;
// bài thử phải ĐỎ (thoát khác 0). Không đụng kho thật. Chạy: node viec/KH-SUA-1/dot_bien_tay.js → dòng cuối "n bị bắt · m lọt".
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const GOC = path.join(__dirname, '..', '..');
const DOT_BIEN = [
  ['VS-TRA-LAI-TEN-THE-QR', 'src/pages/ThanhToan.jsx', (s) => s.replace('className="tt-qr"', 'className="the-qr"')],
  ['VS-THEM-THE-QR-FLEX-O-TEP-KHAC', 'src/giaoDien/hoa_don.css', (s) => s + '\n.the-qr{ display:flex; }\n'],
  ['BV-BO-LUAT-TT-QR-FLEX', 'src/giaoDien/thanh_toan.css', (s) => s.replace(/\.tt-qr\{ display:flex;/, '.tt-qr{')],
];

let lot = 0;
for (const [ten, tep, doi] of DOT_BIEN) {
  const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'dotbien-'));
  fs.cpSync(path.join(GOC, 'src'), path.join(tam, 'src'), { recursive: true });
  fs.mkdirSync(path.join(tam, 'cong_cu'));
  fs.copyFileSync(path.join(GOC, 'cong_cu/thu_KHSUA1.js'), path.join(tam, 'cong_cu/thu_KHSUA1.js'));
  const goc = fs.readFileSync(path.join(tam, tep), 'utf8');
  const moi = doi(goc);
  if (moi === goc) { console.log(`  ? ${ten}: đột biến không đổi gì (sai mẫu thay)`); lot++; continue; }
  fs.writeFileSync(path.join(tam, tep), moi);
  const r = spawnSync('node', [path.join(tam, 'cong_cu/thu_KHSUA1.js')], { env: { ...process.env, KHONG_TRINH_DUYET: '1' }, encoding: 'utf8' });
  const bat = r.status !== 0;
  if (!bat) lot++;
  console.log(`  ${bat ? '✓ bị bắt' : '✗ LỌT'} ${ten} (${tep}) — ${(r.stdout.trim().split('\n').pop() || '')}`);
  fs.rmSync(tam, { recursive: true, force: true });
}
console.log(`\n${DOT_BIEN.length - lot} bị bắt · ${lot} lọt`);
process.exit(lot ? 1 : 0);
