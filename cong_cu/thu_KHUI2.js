#!/usr/bin/env node
// THỬ KH-UI-2 — hàm thuần (dinhDang.js, maBill.js, menuLoc.js), nội dung, PWA. Không mạng, không DOM.
// Chạy: node cong_cu/thu_KHUI2.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');

// Kích thước PNG đọc từ phần đầu file (IHDR: byte 16–23).
function kichThuocPng(f) {
  const b = fs.readFileSync(path.join(GOC, f));
  if (b.length < 24 || b.toString('latin1', 1, 4) !== 'PNG') return null;
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

(async () => {
  const d = await nap('src/dinhDang.js');
  const m = await nap('src/maBill.js');
  const l = await nap('src/menuLoc.js');

  console.log('— A1 ghép địa chỉ POS');
  k('gốc đặt, bỏ / thừa cuối', d.ghepDiaChi('https://pos-tuquyduong.io.vn/', '/menu') === 'https://pos-tuquyduong.io.vn/api/kh/menu');
  k('gốc nhiều / cuối', d.ghepDiaChi('https://pos.example///', '/toi') === 'https://pos.example/api/kh/toi');
  k('gốc không đặt → cùng gốc', d.ghepDiaChi(undefined, '/toi') === '/api/kh/toi' && d.ghepDiaChi('', '/toi') === '/api/kh/toi');
  k('gốc có khoảng trắng', d.ghepDiaChi('  https://pos.example/ ', '/diem') === 'https://pos.example/api/kh/diem');

  console.log('— A2 chọn lời lỗi');
  k('có code + error → nguyên lời POS', d.loiTheoCode('MA_SAI', 'Mã không đúng') === 'Mã không đúng');
  k('500 chỉ có error (không code) → lời chung, KHÔNG lời máy', d.loiTheoCode(undefined, 'SQLITE_ERROR: no such table') === d.loiTheoCode('LOI_MAY_CHU') && !/SQLITE/.test(d.loiTheoCode(undefined, 'SQLITE_ERROR')));
  k('không code, không error → lời chung', /Máy chủ/.test(d.loiTheoCode(undefined, undefined)));
  k('mất mạng → lời dự phòng', /mạng/.test(d.loiTheoCode('MANG_LOI')));
  k('code lạ không có error → lời chung', d.loiTheoCode('MA_LA', '') === 'Có lỗi xảy ra. Thử lại sau.');

  console.log('— C3 đọc / chuẩn hoá mã');
  k('mã đúng', m.chuanHoaMa('AB12CD') === 'AB12CD');
  k('chữ thường → hoa', m.chuanHoaMa('ab12cd') === 'AB12CD');
  k('cắt khoảng trắng', m.chuanHoaMa('  ab12cd \n') === 'AB12CD');
  k('dấu cách ở giữa → bỏ', m.chuanHoaMa('AB 12') === '');
  k('ký tự lạ / có dấu → bỏ', m.chuanHoaMa('AB-12') === '' && m.chuanHoaMa('ÁB12') === '' && m.chuanHoaMa('AB12<script>') === '');
  k('rỗng / null → rỗng', m.chuanHoaMa('') === '' && m.chuanHoaMa(null) === '' && m.chuanHoaMa(undefined) === '');
  k('32 ký tự nhận, 33 bỏ', m.chuanHoaMa('A'.repeat(32)) === 'A'.repeat(32) && m.chuanHoaMa('A'.repeat(33)) === '');
  k('địa chỉ ?ma=', m.docMaTuDiaChi('?ma=ab12cd') === 'AB12CD');
  k('địa chỉ có tham số khác', m.docMaTuDiaChi('?utm=x&ma=ab12cd&fbclid=1') === 'AB12CD');
  k('địa chỉ không có ma / ma rỗng / ma sai dạng', m.docMaTuDiaChi('') === '' && m.docMaTuDiaChi('?x=1') === '' && m.docMaTuDiaChi('?ma=') === '' && m.docMaTuDiaChi('?ma=a%20b') === '');
  k('bỏ ma, giữ tham số khác', m.boMaKhoiDiaChi('?utm=x&ma=ab12cd') === '?utm=x' && m.boMaKhoiDiaChi('?ma=ab12cd') === '');

  k('điểm 1250 → 1.250, không phải số → rỗng', d.dinhDangSo(1250) === '1.250' && d.dinhDangSo(0) === '0' && d.dinhDangSo(undefined) === '');
  console.log('— Che SĐT, lời chào');
  k('che giữa', d.cheSdt('0901234567') === '090 xxx 4567');
  k('SĐT có dấu cách / +84 vẫn che', d.cheSdt('090 123 4567') === '090 xxx 4567');
  k('SĐT thiếu → rỗng (không bịa)', d.cheSdt('') === '' && d.cheSdt(null) === '' && d.cheSdt('123') === '');
  k('chào theo tên / chưa có tên', d.loiChao('Linh') === 'Chào Linh' && d.loiChao('') === 'Chào bạn' && d.loiChao(null) === 'Chào bạn');

  console.log('— B6 tìm món');
  const ds = [
    { ma: 'A1', ten: 'Trà Đông Y', nhom: 'Trà' },
    { ma: 'A2', ten: 'Cà phê sữa', nhom: 'Cà phê' },
    { ma: 'A3', ten: 'Nước sâm Đậu', nhom: 'Khác' },
  ];
  k('bỏ dấu', l.boDau('Đông Ý Ấm') === 'dong y am');
  k('tìm không dấu ra món có dấu', l.timMon(ds, 'tra dong').map((x) => x.ma).join() === 'A1');
  k('tìm có dấu', l.timMon(ds, 'Cà phê').map((x) => x.ma).join() === 'A2');
  k('tìm "d" ra Đ', l.timMon(ds, 'dau').map((x) => x.ma).join() === 'A3');
  k('ô trống → giữ nguyên', l.timMon(ds, '  ').length === 3);
  k('không thấy → rỗng', l.timMon(ds, 'xyz').length === 0);
  k('nhóm theo nhom, thiếu → Khác', JSON.stringify(l.nhomTheoTen([...ds, { ma: 'A4', ten: 'X' }]).map(([t, v]) => [t, v.length])) === '[["Trà",1],["Cà phê",1],["Khác",2]]');

  console.log('— D2 lọc theo nhu cầu');
  const mon = (await nap('src/noiDung/mon.js')).MON;
  const nc = (await nap('src/noiDung/nhuCau.js')).NHU_CAU;
  const bang = { A1: { nhuCau: ['Ngủ ngon', 'Ấm bụng'] }, A2: { nhuCau: ['Tỉnh táo'] } };
  k('bảng nội dung thật đang RỖNG (máy không biết mã món)', Object.keys(mon).length === 0);
  k('bảng rỗng → không món nào, mọi ô nhu cầu ẩn', l.locTheoNhuCau(ds, mon, 'Ngủ ngon').length === 0 && l.nhuCauCoMon(nc, ds, mon).length === 0);
  k('bảng có món → lọc đúng', l.locTheoNhuCau(ds, bang, 'Ngủ ngon').map((x) => x.ma).join() === 'A1' && l.locTheoNhuCau(ds, bang, 'Tỉnh táo').map((x) => x.ma).join() === 'A2');
  k('chỉ giữ ô có món', l.nhuCauCoMon(nc, ds, bang).map((x) => x.ten).join() === 'Ngủ ngon,Ấm bụng,Tỉnh táo');
  k('mã món lạ / "constructor" không nổ', l.noiDungMon(bang, 'constructor') === null && l.noiDungMon(bang, 'ZZ') === null);
  k('6 nhóm nhu cầu như demo', nc.length === 6 && nc.every((n) => n.ten && fs.existsSync(path.join(GOC, 'public', n.anh))));
  const lh = (await nap('src/noiDung/lienHe.js')).LIEN_HE;
  k('liên hệ để trống (chưa có số thật)', !lh.dienThoai && !lh.zalo && !lh.email);
  k('không chữ mẫu của demo (1900 xxxx, support@) trong src/', !/1900\s*x|support@/i.test(['src/App.jsx', 'src/pages/TaiKhoan.jsx', 'src/noiDung/lienHe.js'].map(doc).join('\n')));

  console.log('— E PWA');
  for (const [f, n] of [['bieu-tuong-192.png', 192], ['bieu-tuong-512.png', 512], ['bieu-tuong-180.png', 180]]) {
    const kt = kichThuocPng(`public/anh/${f}`);
    k(`${f} đúng ${n}×${n}`, !!kt && kt[0] === n && kt[1] === n, JSON.stringify(kt));
  }
  let mf = null;
  try { mf = JSON.parse(doc('public/manifest.webmanifest')); } catch { /* hỏng */ }
  k('manifest đọc được', !!mf);
  if (mf) {
    k('manifest: tên, lang, start_url, display', mf.name === 'Tứ Quý Đường' && mf.short_name === 'Tứ Quý Đường' && mf.lang === 'vi' && mf.start_url === '/' && mf.display === 'standalone');
    const css = doc('src/giaoDien/giaoDien.css');
    const bien = (t) => (new RegExp(`--${t}:\\s*(#[0-9a-fA-F]{6})`).exec(css) || [])[1];
    k('manifest: theme_color / background_color theo giaoDien.css', mf.theme_color === bien('mau-chinh') && mf.background_color === bien('mau-nen'), `${bien('mau-chinh')} ${bien('mau-nen')}`);
    const bieuTuong = mf.icons || [];
    k('manifest: biểu tượng 192 và 512 có file thật đúng cỡ', [192, 512].every((n) => {
      const i = bieuTuong.find((x) => x.sizes === `${n}x${n}`);
      const kt = i && kichThuocPng(i.src.replace(/^\//, 'public/'));
      return kt && kt[0] === n && kt[1] === n;
    }));
  }
  const html = doc('index.html');
  k('index.html: link manifest', /<link rel="manifest" href="\/manifest\.webmanifest"/.test(html));
  k('index.html: apple-touch-icon 180', /rel="apple-touch-icon"[^>]*180x180[^>]*bieu-tuong-180\.png/.test(html));
  k('index.html: theme-color + viewport-fit=cover', /name="theme-color"/.test(html) && /viewport-fit=cover/.test(html));
  k('index.html: chỉ phông Inter (display=swap) ngoài app', (html.match(/https:\/\/[^"'\s)]+/g) || []).every((u) => /^https:\/\/fonts\.(googleapis|gstatic)\.com/.test(u)) && /family=Inter[^"]*display=swap/.test(html));
  k('E2 không service worker', !/serviceWorker/.test(['src/main.jsx', 'src/App.jsx', 'index.html'].map(doc).join('\n')) && !fs.existsSync(path.join(GOC, 'public', 'sw.js')));

  console.log('— D1 ảnh');
  const tepAnh = fs.readdirSync(path.join(GOC, 'public', 'anh'));
  const tong = tepAnh.reduce((s, f) => s + fs.statSync(path.join(GOC, 'public', 'anh', f)).size, 0);
  k(`tổng ảnh ≤ 2 MB (${Math.round(tong / 1024)} KB)`, tong <= 2 * 1024 * 1024);
  k('không base64 ảnh trong src/', !/data:image\//.test(['src/App.jsx', 'src/giaoDien/giaoDien.css', ...fs.readdirSync(path.join(GOC, 'src', 'pages')).map((f) => `src/pages/${f}`)].map(doc).join('\n')));

  console.log('— B / F quy ước giao diện (đọc mã nguồn)');
  const css = doc('src/giaoDien/giaoDien.css');
  k('F1 khung giữa tối đa 720px, nền thương hiệu từ 600px', /--khung-rong:\s*720px/.test(css) && /@media \(min-width: 600px\)[^}]*background: var\(--mau-thuong-hieu\)/.test(css));
  k('F2 ảnh có aspect-ratio + object-fit: cover', /aspect-ratio/.test(css) && /object-fit: cover/.test(css));
  k('F2 khung có chữ + nút (banner) không khoá aspect-ratio khi overflow: hidden', (() => { const r = /\.banner \{[^}]*\}/.exec(css); return !!r && !/aspect-ratio/.test(r[0]) && /min-height/.test(r[0]); })());
  k('F3 nút chạm ≥ 44px + safe-area', /--cham:\s*44px/.test(css) && /env\(safe-area-inset-bottom/.test(css));
  k('F4 100dvh có dự phòng 100vh', /height: 100vh;\s*height: 100dvh/.test(css));
  k('B1 tôn trọng prefers-reduced-motion', /prefers-reduced-motion: reduce/.test(css));
  k('B3 thanh tab đúng 4 mục, không Giỏ hàng', (() => { const t = doc('src/components/ThanhTab.jsx'); return (t.match(/\['[a-z]+', '/g) || []).length === 4 && !/Giỏ/.test(t); })());
  k('B11 không new Date(chuỗi giờ POS) trong src/', !/new Date\(/.test(['src/App.jsx', 'src/dinhDang.js', ...fs.readdirSync(path.join(GOC, 'src', 'pages')).map((f) => `src/pages/${f}`)].map(doc).join('\n')));
  k('C1 mã ?ma= xoá khỏi địa chỉ, không lưu localStorage', /replaceState/.test(doc('src/App.jsx')) && !/localStorage[^\n]*(ma|MA)\b/.test(doc('src/App.jsx')));

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.log('✗ ' + e.message); console.log('\n0 đạt · 1 hỏng'); process.exit(1); });
