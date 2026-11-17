#!/usr/bin/env node
// C5 (soát cuối): chạy mọi cong_cu/thu_*.js của <cây> với LUU_ANH_DIR=<ra>/<bài> để so ảnh gốc ↔ nhánh (so bằng viec/KH-VC-2/so_anh_c5.js).
// Chạy: node viec/KH-VC-2/chup_tat_ca.js <cây> <thư mục ra> — mỗi dòng: tên bài, dòng tổng, số ảnh.
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const [cay, ra] = process.argv.slice(2);
for (const f of fs.readdirSync(path.join(cay, 'cong_cu')).filter((x) => /^thu_.*\.js$/.test(x)).sort()) {
  const d = path.join(ra, f.replace(/\.js$/, ''));
  fs.mkdirSync(d, { recursive: true });
  const r = spawnSync(process.execPath, ['cong_cu/' + f], { cwd: cay, encoding: 'utf8', timeout: 600000, env: { ...process.env, LUU_ANH_DIR: d } });
  console.log(f, ((r.stdout || '').trim().split('\n').pop() || ''), fs.readdirSync(d).length, 'ảnh');
}
