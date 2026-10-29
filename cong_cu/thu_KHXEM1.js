#!/usr/bin/env node
// THỬ KH-XEM-1 — khách vào thẳng Trang chủ; đăng nhập chỉ khi cần. Hàm thuần: luongDangNhap.js, menuLuu.js, noiDung/dangNhap.js. Không mạng, không DOM.
// Chạy: node cong_cu/thu_KHXEM1.js → dòng cuối "n đạt · m hỏng".
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
// Kho giả (thay localStorage): Map + tuỳ chọn ném lỗi.
const khoGia = (dau = {}, nem = false) => {
  const m = new Map(Object.entries(dau));
  return {
    getItem: (x) => { if (nem) throw new Error('chan'); return m.has(x) ? m.get(x) : null; },
    setItem: (x, v) => { if (nem) throw new Error('chan'); m.set(x, String(v)); },
    removeItem: (x) => { m.delete(x); },
    m,
  };
};

(async () => {
  const l = await nap('src/luongDangNhap.js');
  const ml = await nap('src/menuLuu.js');
  const nd = await nap('src/noiDung/dangNhap.js');

  console.log('— A3 bấm chỗ cần đăng nhập');
  for (const d of ['uudai', 'taikhoan', 'qr']) k(`chưa đăng nhập bấm ${d} → mở Đăng nhập`, l.canDangNhap(d, false) === true);
  for (const d of ['trangchu', 'menu', 'mon']) k(`chưa đăng nhập bấm ${d} → vào thẳng`, l.canDangNhap(d, false) === false);
  for (const d of ['uudai', 'taikhoan', 'qr', 'menu']) k(`đã đăng nhập bấm ${d} → không chặn (K5)`, l.canDangNhap(d, true) === false);
  k('đăng nhập xong → đúng chỗ đã bấm', l.dichSauDangNhap('taikhoan', '') === 'taikhoan' && l.dichSauDangNhap('qr', '') === 'qr' && l.dichSauDangNhap('uudai', '') === 'uudai');
  k('có mã hoá đơn trong bộ nhớ → Ưu đãi', l.dichSauDangNhap('taikhoan', 'AB12') === 'uudai');
  k('không rõ chỗ định vào → Trang chủ', l.dichSauDangNhap('', '') === 'trangchu' && l.dichSauDangNhap(undefined, '') === 'trangchu');

  console.log('— A4 /menu không đăng nhập + bản lưu');
  const bd = { data: [{ ma: 'A', ten: 'Trà', nhom: 'Trà', gia: 25000, con_hang: null }] };
  const e401 = Object.assign(new Error('x'), { status: 401, code: 'KH_TOKEN_SAI' });
  const eMang = Object.assign(new Error('Không kết nối được.'), { status: 0, code: 'MANG_LOI' });
  const ban = { dl: bd, luc: '2026-10-29 14:05:00' };
  const a = ml.chonMenu(null, bd, null, '2026-10-29 15:00:00');
  k('có dữ liệu mới → dùng, không phải bản cũ', a.dl === bd && a.cu === false && a.canDN === false && a.loi === '');
  const b = ml.chonMenu(e401, null, null);
  k('401, chưa có bản lưu → thẻ mời đăng nhập, KHÔNG lỗi', b.canDN === true && b.loi === '' && b.dl === null);
  const c = ml.chonMenu(e401, null, ban);
  k('401, có bản lưu → hiện bản lưu + giờ', c.dl === bd && c.cu === true && c.luc === ban.luc && c.canDN === false && c.loi === '');
  const d = ml.chonMenu(eMang, null, ban);
  k('mạng hỏng, có bản lưu → bản lưu', d.dl === bd && d.cu === true && d.loi === '');
  const e = ml.chonMenu(eMang, null, null);
  k('mạng hỏng, không bản lưu → lời lỗi, không thẻ mời', e.dl === null && e.canDN === false && /kết nối/.test(e.loi));
  const f = ml.chonMenu(Object.assign(new Error('Máy chủ bận'), { status: 500, code: 'LOI_MAY_CHU' }), null, null);
  k('500 không bản lưu → lời lỗi', f.canDN === false && f.loi === 'Máy chủ bận');

  console.log('— A4 đọc / ghi kh_menu');
  const kho = khoGia();
  ml.ghiMenuLuu(bd, '2026-10-29 14:05:00', kho);
  k('ghi dưới khoá riêng kh_menu, không khoá nào khác', kho.m.has('kh_menu') && kho.m.size === 1);
  const doc1 = ml.docMenuLuu(kho);
  k('đọc lại đúng dữ liệu + giờ', doc1 && doc1.luc === '2026-10-29 14:05:00' && doc1.dl.data[0].ma === 'A');
  k('không có gì → null', ml.docMenuLuu(khoGia()) === null);
  k('JSON hỏng → bỏ qua', ml.docMenuLuu(khoGia({ kh_menu: '{hong' })) === null);
  k('sai dạng → bỏ qua', ml.docMenuLuu(khoGia({ kh_menu: '{"luc":1,"data":"x"}' })) === null && ml.docMenuLuu(khoGia({ kh_menu: 'null' })) === null);
  k('menu rỗng → bỏ qua (không có gì để cho xem)', ml.docMenuLuu(khoGia({ kh_menu: '{"luc":"2026-10-29 14:05:00","data":[]}' })) === null);
  k('kho ném lỗi → đọc trả null, ghi không ném', ml.docMenuLuu(khoGia({}, true)) === null && (() => { try { ml.ghiMenuLuu(bd, 'x', khoGia({}, true)); return true; } catch { return false; } })());
  ml.xoaMenuLuu(kho);
  k('xoá', kho.m.size === 0);
  k('giờ VN từ đồng hồ máy, không phụ thuộc múi giờ máy', ml.gioVn(new Date('2026-10-29T07:05:09Z')) === '2026-10-29 14:05:09');

  console.log('— A6 lời màn Đăng nhập');
  const z = nd.loiMa(false, '0901234567');
  k('Zalo: nêu Zalo + SĐT che giữa', /Zalo/.test(z) && /090 xxx 4567/.test(z) && !/quầy/.test(z));
  const q = nd.loiMa(true, '0901234567');
  k('quầy: hỏi nhân viên quầy, không nói đã gửi qua Zalo', /nhân viên quầy/.test(q) && !/Zalo/.test(q));
  k('SĐT ngắn → không bịa số', !/xxx/.test(nd.loiMa(false, '09')) && /Zalo/.test(nd.loiMa(false, '09')));
  k('chữ bước 1: một dòng nhỏ Zalo, không nhắc quầy', /Zalo/.test(nd.BUOC_SDT.phu) && !/quầy/.test(nd.BUOC_SDT.phu));
  k('xưng hô đủ 7 lựa chọn', JSON.stringify(nd.XUNG_HO) === JSON.stringify(['Anh', 'Chị', 'Cô', 'Chú', 'Bác', 'Em', 'Bạn']));
  k('thẻ mời có đủ chữ', nd.THE_MOI.tieuDe === 'Thành viên Tứ Quý Đường' && /Đăng nhập \/ Đăng ký/.test(nd.THE_MOI.phu) && nd.THE_MOI.nut === 'Đăng nhập');
  k('không hề có chữ "nợ" trong nội dung đăng nhập', !/\bnợ\b/i.test(JSON.stringify(nd)));

  console.log('— A6 chuyển bước 1→2→3');
  const r1 = l.buocSauXinMa({ lay_ma_tai_quay: false }), r2 = l.buocSauXinMa({ lay_ma_tai_quay: true }), r3 = l.buocSauXinMa({});
  k('xin mã xong → bước 2, nhớ Zalo / quầy', r1.buoc === 'ma' && r1.taiQuay === false && r2.taiQuay === true && r3.taiQuay === false);
  const ct = l.buocSauLoiXacMinh({ code: 'CAN_TEN' }, 'ma');
  k('CAN_TEN → bước 3 (khách mới)', ct.buoc === 'thongtin' && ct.hetHan === false);
  const hh2 = l.buocSauLoiXacMinh({ code: 'MA_HET_HAN' }, 'ma'), hh3 = l.buocSauLoiXacMinh({ code: 'MA_HET_HAN' }, 'thongtin');
  k('MA_HET_HAN giữ nguyên bước (không xoá chữ đã nhập) + cờ hết hạn', hh2.buoc === 'ma' && hh2.hetHan === true && hh3.buoc === 'thongtin' && hh3.hetHan === true);
  const sai = l.buocSauLoiXacMinh({ code: 'MA_SAI' }, 'ma');
  k('MA_SAI → ở lại bước, không hết hạn', sai.buoc === 'ma' && sai.hetHan === false);

  console.log('— A6 Xưng hô / Địa chỉ: một hằng số');
  k('hằng số tắt (hợp đồng v1)', nd.BAT_XUNG_HO_DIA_CHI === false);
  k('tắt → không gửi trường nào ngoài hợp đồng', JSON.stringify(l.truongThem(false, 'Anh', 'Số 1')) === '{}');
  k('tắt → chỉ cần Tên', l.duDieuKienHoanTat({ ten: 'Lan', xungHo: '', bat: false }) === true && l.duDieuKienHoanTat({ ten: '  ', xungHo: '', bat: false }) === false);
  k('bật → Tên + Xưng hô bắt buộc, Địa chỉ không', l.duDieuKienHoanTat({ ten: 'Lan', xungHo: '', bat: true }) === false && l.duDieuKienHoanTat({ ten: 'Lan', xungHo: 'Chị', bat: true }) === true);
  k('bật → gửi xưng hô; địa chỉ trống thì không gửi', l.truongThem(true, 'Chị', '  ').xung_ho === 'Chị' && !('dia_chi' in l.truongThem(true, 'Chị', '  ')) && l.truongThem(true, 'Chị', ' Số 1 ').dia_chi === 'Số 1');

  console.log('— A1/A2/A7/A8 nối vào App (đọc nguồn)');
  const app = doc('src/App.jsx'), api = doc('src/api.js');
  k('App không còn chặn cả app khi chưa đăng nhập', !/\{!dangNhap && <DangNhap/.test(app) && /<ThanhTab/.test(app) && !/\{dangNhap && <ThanhTab/.test(app));
  k('App hỏi canDangNhap trước khi mở tab / QR', /canDangNhap\(/.test(app));
  k('đăng xuất và 401 cùng dọn ở donPhien, về Trang chủ', /const donPhien =/.test(app) && /datTab\('trangchu'\)/.test(app) && /const dangXuat = \(\) => \{[^}]*donPhien\(\)/.test(app));
  k('401 / đăng xuất KHÔNG bật màn Đăng nhập tự động', !/donPhien = [^;]*moDangNhap/.test(app));
  k('/menu gọi không ép phiên (api.js chỉ gắn khi có)', /if \(token\) tieuDe\.Authorization/.test(api) && /goi\('GET', '\/menu'\)/.test(api));
  k('hết phiên chỉ khi ĐÃ có phiên (menu khách 401 không đá ai)', /res\.status === 401 && token/.test(api));
  k('localStorage chỉ khoá phiên / cờ màn mở / kh_menu', (() => {
    const dung = [];
    for (const f of ['src/App.jsx', 'src/api.js', 'src/menuLuu.js', 'src/dungMenu.js', 'src/components/ManDau.jsx']) {
      for (const m of doc(f).matchAll(/(?:getItem|setItem|removeItem)\(\s*([A-Za-z_]+|'[^']+')/g)) dung.push(m[1]);
    }
    return dung.length > 0 && dung.every((x) => /KHOA|kh_/.test(x));
  })());

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.log('  ✗ bài thử không chạy được — ' + (e && e.message)); console.log('\n0 đạt · 1 hỏng'); process.exit(1); });
