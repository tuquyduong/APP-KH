#!/usr/bin/env node
// THỬ KH-LINK-1 — đường dẫn thật cho từng trang, trang chủ khách đầy đủ, khoá tiện ích. Hàm thuần: src/duongDan.js, src/luongDangNhap.js;
// KhoaTienIch dựng bằng esbuild (có sẵn cùng vite) + react-dom/server. Không mạng, không trình duyệt.
// Chạy: node cong_cu/thu_KHLINK1.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Dựng một thành phần .jsx của app thành CommonJS (kèm React) để render ra chuỗi HTML.
function dungThanhPhan(tep) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import T from './${tep}'; export const ve = (props, con) => renderToStaticMarkup(React.createElement(T, props, con));`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', write: false, logLevel: 'silent',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: tep }).runInThisContext()(m, m.exports, require);
  return m.exports.ve;
}

(async () => {
  const d = await nap('src/duongDan.js');
  const l = await nap('src/luongDangNhap.js');

  console.log('— A1 slug');
  k('bỏ dấu, đ/Đ → d, chữ thường: "Trà Đông Y" → tra-dong-y', d.slug('Trà Đông Y') === 'tra-dong-y' && d.slug('ĐƯỜNG đen') === 'duong-den');
  k('ký tự lạ → "-", gộp "-" liền nhau, bỏ "-" hai đầu', d.slug('  Cà phê (sữa)!! ') === 'ca-phe-sua' && d.slug('a___b / c') === 'a-b-c' && d.slug('---x---') === 'x');
  k('slug rỗng / không phải chuỗi → rỗng', d.slug('') === '' && d.slug(undefined) === '' && d.slug('###') === '');

  console.log('— A1 bảng đường dẫn, chiều đi (path → trang)');
  const di = [
    ['/trangchu', 'trangchu', {}], ['/menu', 'menu', {}], ['/menu/tra-dong-y', 'menu', { nhom: 'tra-dong-y' }],
    ['/mon/tra-dao', 'mon', { slug: 'tra-dao' }], ['/uudai', 'uudai', {}], ['/taikhoan', 'taikhoan', {}],
    ['/taikhoan/thongtin', 'thongtin', {}], ['/taikhoan/donhang', 'donhang', {}], ['/taikhoan/donhang/AB12', 'don', { ma: 'AB12' }],
    ['/taikhoan/hotro', 'hotro', {}], ['/mathanhvien', 'qr', {}], ['/dangnhap', 'dangnhap', {}],
    ['/dangnhap?tiep=%2Fuudai', 'dangnhap', { tiep: '/uudai' }], ['/tracnghiem', 'tracnghiem', {}], ['/kehoach', 'kehoach', {}],
  ];
  for (const [p, trang, tham] of di) {
    const r = d.docDuongDan(p);
    k(`${p} → ${trang}`, r.trang === trang && bang(r.tham, tham) && r.chuan === p, JSON.stringify(r));
  }
  console.log('— A1 chiều về (trang → path) và quay vòng');
  for (const [p, trang, tham] of di) k(`taoDuongDan(${trang}) = ${p}`, d.taoDuongDan(trang, tham) === p);
  k('mọi đường dẫn chuẩn quay vòng ổn định (không nhảy mãi)', di.every(([p]) => d.docDuongDan(d.docDuongDan(p).chuan).chuan === d.docDuongDan(p).chuan));
  k('mã đơn có ký tự đặc biệt giữ nguyên qua hai chiều', (() => { const p = d.taoDuongDan('don', { ma: 'A/B đ' }); const r = d.docDuongDan(p); return r.trang === 'don' && r.tham.ma === 'A/B đ'; })());
  k('"/" → Trang chủ, chuẩn "/trangchu"', d.docDuongDan('/').trang === 'trangchu' && d.docDuongDan('/').chuan === '/trangchu' && d.docDuongDan('').chuan === '/trangchu');
  k('chữ hoa và "/" thừa: /Menu/ = /menu, /MENU/Tra-Dong-Y/ = /menu/tra-dong-y', d.docDuongDan('/Menu/').chuan === '/menu' && d.docDuongDan('/MENU/Tra-Dong-Y/').chuan === '/menu/tra-dong-y' && d.docDuongDan('//menu//').trang === 'menu');
  k('nhóm có dấu gõ thẳng → slug (/menu/Trà-Đông-Y)', d.docDuongDan('/menu/' + encodeURIComponent('Trà Đông Y')).chuan === '/menu/tra-dong-y');
  k('mã đơn giữ chữ hoa (không ép thường)', d.docDuongDan('/Taikhoan/DonHang/aB9').tham.ma === 'aB9');
  k('đường dẫn lạ → khongthay, không đổi địa chỉ', (() => { const r = d.docDuongDan('/khong-co-trang-nay'); return r.trang === 'khongthay' && r.chuan === '/khong-co-trang-nay'; })());
  k('thiếu / thừa phần: /mon, /taikhoan/xyz, /menu/a/b → khongthay', ['/mon', '/taikhoan/xyz', '/menu/a/b', '/taikhoan/donhang/x/y'].every((p) => d.docDuongDan(p).trang === 'khongthay'));
  k('/admin và /admin/… → Trang chủ, không hiện gì về quản trị', ['/admin', '/admin/', '/Admin/san-pham'].every((p) => { const r = d.docDuongDan(p); return r.trang === 'trangchu' && r.chuan === '/trangchu'; }));
  k('/tracnghiem/…, /kehoach/… chỉ giữ chỗ (giuCho), không rơi vào khongthay', d.docDuongDan('/tracnghiem/ket-qua').giuCho === true && d.docDuongDan('/kehoach/x').trang === 'kehoach' && d.docDuongDan('/menu').giuCho === false);
  k('địa chỉ có #… hoặc ?x=1 lạ thì bỏ phần thừa khi chuẩn hoá', d.docDuongDan('/menu?x=1#a').chuan === '/menu' && d.docDuongDan('/uudai#top').chuan === '/uudai');

  console.log('— A3 trang cần đăng nhập');
  const can = { uudai: 1, taikhoan: 1, thongtin: 1, donhang: 1, don: 1, qr: 1 };
  const khong = ['trangchu', 'menu', 'mon', 'hotro', 'dangnhap', 'khongthay'];
  k('Ưu đãi, Tài khoản + trang con (trừ Hỗ trợ), Mã thành viên cần đăng nhập', Object.keys(can).every((t) => l.canDangNhap(t, false) === true && d.docDuongDan(d.taoDuongDan(t, { ma: 'x' })).canDN === true));
  k('Trang chủ, Menu, Món, Hỗ trợ, Đăng nhập: khách vào thẳng', khong.every((t) => l.canDangNhap(t, false) === false));
  k('đã đăng nhập thì không bao giờ chặn (K5)', [...Object.keys(can), ...khong].every((t) => l.canDangNhap(t, true) === false));
  k('chặn xong → /dangnhap?tiep=<trang>', d.taoDuongDan('dangnhap', { tiep: '/uudai' }) === '/dangnhap?tiep=%2Fuudai' && d.taoDuongDan('dangnhap', { tiep: '/taikhoan/donhang/AB12' }) === '/dangnhap?tiep=%2Ftaikhoan%2Fdonhang%2FAB12');
  k('đăng nhập xong → đúng trang tiep (kể cả trang con có tham số)', l.dichSauDangNhap('/taikhoan/donhang/AB12', '') === '/taikhoan/donhang/AB12' && l.dichSauDangNhap('/mathanhvien', '') === '/mathanhvien' && l.dichSauDangNhap('/mon/tra-dao', '') === '/mon/tra-dao');
  k('có mã hoá đơn trong bộ nhớ → Ưu đãi', l.dichSauDangNhap('/taikhoan', 'AB12') === '/uudai');
  k('không có / sai tiep → Trang chủ', l.dichSauDangNhap('', '') === '/trangchu' && l.dichSauDangNhap(undefined, '') === '/trangchu' && l.dichSauDangNhap('//evil.com', '') === '/trangchu');

  console.log('— A3 tiep chỉ nhận đường dẫn nội bộ (chống chuyển hướng ra trang lạ)');
  for (const x of ['http://evil.com', 'https://evil.com/uudai', '//evil.com', '//evil.com/uudai', '/\\evil.com', 'javascript:alert(1)', 'uudai', '', null, undefined, 42, '/dangnhap', '/khong-co']) {
    k(`tiep ${JSON.stringify(x)} bị bỏ`, d.tiepHopLe(x) === '');
  }
  k('tiep hợp lệ được giữ, đã chuẩn hoá', d.tiepHopLe('/uudai') === '/uudai' && d.tiepHopLe('/Taikhoan/DonHang/') === '/taikhoan/donhang' && d.tiepHopLe('/admin') === '/trangchu' && d.tiepHopLe('/mon/tra-dao') === '/mon/tra-dao');
  k('docDuongDan(/dangnhap?tiep=lạ) → bỏ tiep, không giữ link ngoài', (() => { const r = d.docDuongDan('/dangnhap?tiep=' + encodeURIComponent('https://evil.com')); return r.trang === 'dangnhap' && r.tham.tiep === undefined && r.chuan === '/dangnhap'; })());
  k('taoDuongDan(dangnhap, tiep lạ) cũng không ghi link ngoài', d.taoDuongDan('dangnhap', { tiep: '//evil.com' }) === '/dangnhap');

  console.log('— A1b /mon/<ten-mon>');
  const ds = [{ ma: 'A1', ten: 'Trà Đào' }, { ma: 'A2', ten: 'Cà phê sữa' }, { ma: 'B7', ten: 'Cà  Phê  Sữa' }, { ma: 'C3', ten: '!!!' }];
  k('tên không trùng → chỉ slug tên', d.slugMon(ds[0], ds) === 'tra-dao');
  k('trùng tên → thêm -<mã>', d.slugMon(ds[1], ds) === 'ca-phe-sua-a2' && d.slugMon(ds[2], ds) === 'ca-phe-sua-b7');
  k('tên không ra chữ → dùng mã', d.slugMon(ds[3], ds) === 'c3');
  k('tìm món theo slug (có / không trùng)', d.timMonTheoSlug(ds, 'tra-dao') === ds[0] && d.timMonTheoSlug(ds, 'ca-phe-sua-b7') === ds[2] && d.timMonTheoSlug(ds, 'c3') === ds[3]);
  k('slug trùng gốc không đủ → không tìm thấy (không đoán bừa)', d.timMonTheoSlug(ds, 'ca-phe-sua') === null);
  k('món đã ngừng bán / chưa có menu → null', d.timMonTheoSlug(ds, 'tra-xanh') === null && d.timMonTheoSlug([], 'tra-dao') === null && d.timMonTheoSlug(null, 'tra-dao') === null);
  k('slug món gõ chữ hoa vẫn tìm được', d.timMonTheoSlug(ds, 'TRA-DAO') === ds[0]);
  k('đường đi: món → path → món', (() => { const p = d.taoDuongDan('mon', { slug: d.slugMon(ds[2], ds) }); return d.timMonTheoSlug(ds, d.docDuongDan(p).tham.slug) === ds[2]; })());

  console.log('— A2 tiêu đề tab trình duyệt');
  k('"Menu · Tứ Quý Đường", "<Tên món> · Tứ Quý Đường"', d.tieuDeTrang('menu') === 'Menu · Tứ Quý Đường' && d.tieuDeTrang('mon', 'Trà Đào') === 'Trà Đào · Tứ Quý Đường' && d.tieuDeTrang('trangchu') === 'Trang chủ · Tứ Quý Đường');
  k('mọi trang trong bảng có tiêu đề; trang lạ có tiêu đề riêng', di.every(([, t]) => /· Tứ Quý Đường$/.test(d.tieuDeTrang(t))) && d.tieuDeTrang('khongthay') === 'Không tìm thấy trang · Tứ Quý Đường' && d.tieuDeTrang('mon') === 'Món · Tứ Quý Đường');

  console.log('— B2 KhoaTienIch');
  const ve = dungThanhPhan('components/KhoaTienIch.jsx');
  const khach = ve({ dangNhap: false, tiep: '/tracnghiem', moDangNhap() {} }, 'Ô-TIEN-ICH');
  const hoiVien = ve({ dangNhap: true, tiep: '/tracnghiem', moDangNhap() {} }, 'Ô-TIEN-ICH');
  k('đã đăng nhập: hiện đúng ô, không dòng khoá, không bọc thêm', hoiVien === 'Ô-TIEN-ICH', hoiVien);
  k('khách: vẫn giữ nguyên nội dung ô (hình, chữ, vị trí)', khach.includes('Ô-TIEN-ICH'));
  k('khách: có biểu tượng khoá và dòng "Đăng nhập để mở khoá chức năng"', khach.includes('🔒') && khach.includes('Đăng nhập để mở khoá chức năng'));
  k('khách: ô MỜ, không thao tác được bên trong (inert / aria-hidden)', /khoa-tien-ich/.test(khach) && /inert|aria-hidden="true"/.test(khach));
  k('khách: bấm được (role=button) để đi đăng nhập', /role="button"/.test(khach) && /tabindex="0"/.test(khach));
  const css = doc('src/giaoDien/giaoDien.css');
  k('độ mờ của ô khoá lấy từ demo (opacity .45 như .btn-disabled), không thêm màu', /\.khoa-tien-ich[^}]*opacity:\s*\.45/.test(css) && !/\.khoa-tien-ich[^}]*(#[0-9a-f]{3,8}|rgb|hsl)/i.test(css));
  const kt = doc('src/components/KhoaTienIch.jsx');
  k('bấm gọi moDangNhap(tiep) — đi /dangnhap?tiep=<trang tiện ích>', /moDangNhap\(tiep\)/.test(kt));

  console.log('— A2 / A3 / A5 nối vào App (đọc nguồn)');
  const app = doc('src/App.jsx'), dh = doc('src/dieuHuong.js');
  k('dùng History API: pushState / replaceState / popstate, không thư viện', /pushState/.test(dh) && /replaceState/.test(dh) && /popstate/.test(dh) && !/react-router|wouter|navigo/i.test(app + dh));
  k('thanh địa chỉ không còn kẹt ở "/": không còn ngăn xếp màn con', !/dungNganXep|nx\./.test(app));
  k('trang cần đăng nhập → thay bằng /dangnhap?tiep= (App hỏi canDangNhap)', /canDangNhap\(trang, dangNhap\)/.test(app) && /taoDuongDan\('dangnhap', \{ tiep:/.test(app));
  k('đăng nhập xong rời /dangnhap tới tiep (dichSauDangNhap)', /dichSauDangNhap\(r\.tham\.tiep, maCho\)/.test(app));
  k('chuẩn hoá địa chỉ ngay trong bộ định tuyến (/ → /trangchu, /admin → /trangchu)', /duong\.chuan/.test(dh));
  k('tiêu đề tab theo trang', /document\.title = tieuDeTrang\(/.test(app));
  k('?ma= vẫn xoá khỏi thanh địa chỉ và chạy trên mọi đường dẫn (về Ưu đãi)', /replaceState/.test(app) && /'\/uudai'/.test(app) && /boMaKhoiDiaChi/.test(app));
  k('trang lạ có nút "Về Trang chủ"; món lạ có nút "Xem Menu"', /Về Trang chủ/.test(doc('src/pages/KhongTimThay.jsx')) && /Xem Menu/.test(doc('src/pages/MonTheoDuong.jsx')) && /Không tìm thấy món/.test(doc('src/pages/MonTheoDuong.jsx')));
  k('món chưa có menu (khách) → thẻ "Đăng nhập để xem menu và giá" như Menu', /THE_MOI_MENU/.test(doc('src/pages/MonTheoDuong.jsx')) && /canDN/.test(doc('src/pages/MonTheoDuong.jsx')));
  k('không có mục quản trị trong app khách', !/AdminTrang|<Admin|quan-tri|quản trị/i.test(app + doc('src/duongDan.js').replace(/\/\/[^\n]*/g, '')));
  const thuMuc = (p, re) => fs.readdirSync(path.join(GOC, p)).filter((f) => re.test(f));
  k('A4 không có 404.html / _redirects nào ở public/ và gốc', !fs.existsSync(path.join(GOC, 'public', '404.html')) && !fs.existsSync(path.join(GOC, '404.html')) && thuMuc('public', /^404|^_redirects$/).length === 0);
  const tep = [...thuMuc('src', /\.(jsx?|css)$/).map((f) => 'src/' + f), ...thuMuc('src/pages', /\.jsx$/).map((f) => 'src/pages/' + f), ...thuMuc('src/components', /\.jsx$/).map((f) => 'src/components/' + f), ...thuMuc('src/giaoDien', /\.css$/).map((f) => 'src/giaoDien/' + f), 'index.html', 'public/manifest.webmanifest'];
  const tuongDoi = [];
  for (const f of tep) for (const m of doc(f).matchAll(/(?:src|href)=["'`]([^"'`$]+)["'`]|url\(\s*["']?([^)"']+)/g)) {
    const u = m[1] || m[2];
    if (/^(https?:|data:|#|\/|mailto:|tel:|zalo:)/.test(u) || u.startsWith('{')) continue;
    if (/\.(webp|png|jpe?g|svg|mp3|webmanifest|css|js)$/i.test(u)) tuongDoi.push(`${f}: ${u}`);
  }
  k('A4 ảnh, âm thanh, manifest dùng địa chỉ tuyệt đối từ gốc (/anh/...)', tuongDoi.length === 0, tuongDoi.join(' · '));

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.log('  ✗ bài thử không chạy được — ' + (e && e.message)); console.log('\n0 đạt · 1 hỏng'); process.exit(1); });
