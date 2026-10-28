#!/usr/bin/env node
// THỬ NỀN App KH — hàm thuần src/dinhDang.js (không mạng, không DOM). Chạy: node cong_cu/thu_KHUNG.js → "n đạt · 0 hỏng".
'use strict';
const path = require('path');
const { pathToFileURL } = require('url');

let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};

(async () => {
  const d = await import(pathToFileURL(path.join(__dirname, '..', 'src', 'dinhDang.js')).href);
  k('giá 25000 → 25.000đ', d.dinhDangGia(25000) === '25.000đ', d.dinhDangGia(25000));
  k('giá 0 → 0đ', d.dinhDangGia(0) === '0đ');
  k('giá không phải số → rỗng (không bịa số)', d.dinhDangGia('25000') === '' && d.dinhDangGia(NaN) === '');
  k('giảm %', d.moTaGiam('percent', 10) === 'giảm 10%');
  k('giảm tiền', d.moTaGiam('fixed', 20000) === 'giảm 20.000đ');
  k('ngày giờ VN', d.dinhDangNgay('2026-10-22T14:05:00') === '14:05 22/10/2026');
  k('ngày không đọc được → rỗng', d.dinhDangNgay('abc') === '');
  k('lỗi: có error máy chủ thì dùng nguyên', d.loiTheoCode('MA_SAI', 'Mã không đúng') === 'Mã không đúng');
  k('lỗi: mất mạng có lời dự phòng', /mạng/.test(d.loiTheoCode('MANG_LOI')));
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.log('✗ ' + e.message); console.log('\n0 đạt · 1 hỏng'); process.exit(1); });
