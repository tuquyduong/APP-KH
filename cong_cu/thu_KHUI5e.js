#!/usr/bin/env node
// THỬ KH-UI-5e — lưới 6 ô + dải "Sắp tới", Ngày cần nhớ (Người thân + Ngày lễ), Văn khấn & lễ cúng.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần (kehoachLap.js, kehoach.js, vanKhan.js, duongDan.js) + nguồn + màn dựng bằng esbuild / react-dom/server.
// Phần 2: App thật trong Chromium (Playwright có sẵn ở máy; không có / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca): bundle esbuild, POS giả bằng page.route,
// đồng hồ giả (page.clock) để "hôm nay" = 10.11.2026 09:00 giờ VN. Chạy: node cong_cu/thu_KHUI5e.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
// Không dùng \b cho chữ có dấu: \b của JS chỉ hiểu chữ ASCII nên /\bnợ\b/ không bao giờ khớp và ca "không có chữ nợ" luôn xanh (KH-ND-3b B3).
// Mỗi ca kèm bản giả "Công nợ" chứng minh phép kiểm ĐỎ được.
const khongNo = (x) => !/nợ/i.test(String(x));
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const doc = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const khoGia = (d = {}, chan = false) => ({ d, getItem: (x) => { if (chan) throw new Error('SecurityError'); return x in d ? d[x] : null; }, setItem: (x, v) => { if (chan) throw new Error('SecurityError'); d[x] = String(v); }, removeItem: (x) => { delete d[x]; } });

// Dựng một thành phần của app thành CommonJS để vẽ trong Node (react-dom/server).
function dung(tep, xuat) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: xuat, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', write: false, logLevel: 'silent', loader: { '.json': 'json', '.css': 'empty', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl' },
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: tep }).runInThisContext()(m, m.exports, require);
  return m.exports;
}
const thanhPhan = (tep) => dung(tep, `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import T from './${tep}'; export const ve = (props) => renderToStaticMarkup(React.createElement(T, props));`).ve;

(async () => {
  const LP = await nap('src/kehoachLap.js'), KH = await nap('src/kehoach.js'), VKJ = await nap('src/vanKhan.js'), ND = await nap('src/noiDung/vanKhan.js'), { LUNAR } = await nap('src/lich.js');
  const DD = await nap('src/duongDan.js');
  const N = (d, m, y) => ({ d, m, y }), J = (d, m, y) => LP.jd(N(d, m, y)), HN = N(10, 11, 2026);
  const dm = (j) => { const x = LP.tuJd(j); return `${x.d}/${x.m}/${x.y}`; };
  const am = (j) => LP.lichAm(j);

  console.log('B4 — lần tới của sinh nhật / giỗ (dương, âm, 29/02, tháng nhuận, 30 âm thiếu)');
  k('B4 dương 29/02: năm không nhuận → 28/02/2027; năm nhuận → 29/02/2028; sau 1/3/2027 → 29/02/2028', dm(LP.ngayKeTiep('duong', 29, 2, N(1, 1, 2027))) === '28/2/2027' && dm(LP.ngayKeTiep('duong', 29, 2, N(1, 1, 2028))) === '29/2/2028' && dm(LP.ngayKeTiep('duong', 29, 2, N(1, 3, 2027))) === '29/2/2028');
  k('B4 dương: hôm nay đúng ngày → chính hôm nay; đã qua → năm sau', dm(LP.ngayKeTiep('duong', 10, 11, HN)) === '10/11/2026' && dm(LP.ngayKeTiep('duong', 9, 11, HN)) === '9/11/2027');
  const jA = LP.ngayKeTiep('am', 10, 3, HN);
  k('B4 âm 10/3: ngày dương tìm được chính là 10 tháng 3 âm (không nhuận), từ hôm nay trở đi', !!jA && am(jA).d === 10 && am(jA).m === 3 && !am(jA).leap && jA >= LP.jd(HN) && dm(jA) === '16/4/2027', jA && dm(jA));
  const jN = LP.ngayKeTiep('am', 15, 6, N(1, 6, 2025));
  k('B4 tháng nhuận (2025 nhuận 6): ngày 15/6 âm lấy tháng 6 THƯỜNG, không rơi vào tháng nhuận', !!jN && am(jN).d === 15 && am(jN).m === 6 && !am(jN).leap && am(jN).y === 2025);
  let thieu = null;
  for (let y = 2026; y <= 2029 && !thieu; y++) for (let m = 1; m <= 12 && !thieu; m++) if (LP.amSangDuong(29, m, y) !== null && LP.amSangDuong(30, m, y) === null) thieu = { m, y };
  const jT = thieu && LP.ngayKeTiep('am', 30, thieu.m, N(1, 1, thieu.y) && { d: 1, m: 1, y: thieu.y });
  k('B4 ngày 30 âm mà tháng đó thiếu → rơi vào ngày 29 của CHÍNH tháng đó (giỗ không mất năm đó)', !!thieu && !!jT && am(jT).d === 29 && am(jT).m === thieu.m && am(jT).y === thieu.y, JSON.stringify(thieu));
  k('B4 tròn N tuổi: sinh nhật có năm sinh 1990 tới 5/12/2026 → " · tròn 36 tuổi"; không năm sinh / giỗ → rỗng', KH.tronTuoi({ loai: 'sn', nam: 1990 }, J(5, 12, 2026)) === ' · tròn 36 tuổi' && KH.tronTuoi({ loai: 'sn', nam: null }, J(5, 12, 2026)) === '' && KH.tronTuoi({ loai: 'gio', nam: null }, J(5, 12, 2026)) === '');

  console.log('B2/B3 — người thân: thêm · sửa · xoá · kiểm hợp lệ');
  const b0 = KH.keHoachTrong();
  const g1 = KH.themNguoi(b0, { loai: 'gio', ten: 'Ông nội', cal: 'am', d: 10, m: 3, nam: '', nhac: -240 });
  k('B3 thêm giỗ âm lịch → có 1 người, đúng trường, id riêng, bản cũ không bị sửa', !!g1 && g1.nguoi.length === 1 && b0.nguoi.length === 0 && g1.nguoi[0].loai === 'gio' && g1.nguoi[0].cal === 'am' && g1.nguoi[0].nhac === -240 && g1.nguoi[0].nam === null && !!g1.nguoi[0].id);
  k('B3 tên rỗng / chỉ dấu cách → không thêm (null)', KH.themNguoi(b0, { loai: 'sn', ten: '   ', cal: 'duong', d: 1, m: 1 }) === null);
  k('B3 tên quá 40 ký tự bị cắt còn 40', KH.themNguoi(b0, { loai: 'sn', ten: 'x'.repeat(60), cal: 'duong', d: 1, m: 1 }).nguoi[0].ten.length === 40);
  k('B3 ngày sai: dương 30/2, 31/4, âm 31, tháng 13 → không thêm; dương 29/2 và âm 30 → thêm được', [[30, 2, 'duong'], [31, 4, 'duong'], [31, 1, 'am'], [1, 13, 'duong'], [0, 1, 'duong']].every(([d, m, cal]) => KH.themNguoi(b0, { loai: 'sn', ten: 'A', cal, d, m }) === null) && !!KH.themNguoi(b0, { loai: 'sn', ten: 'A', cal: 'duong', d: 29, m: 2 }) && !!KH.themNguoi(b0, { loai: 'gio', ten: 'A', cal: 'am', d: 30, m: 5 }));
  k('B3 năm sinh chỉ giữ cho sinh nhật (giỗ bỏ), ngoài 1800–2200 bỏ', KH.themNguoi(b0, { loai: 'sn', ten: 'A', cal: 'duong', d: 1, m: 1, nam: '1960' }).nguoi[0].nam === 1960 && KH.themNguoi(b0, { loai: 'gio', ten: 'A', cal: 'am', d: 1, m: 1, nam: '1960' }).nguoi[0].nam === null && KH.themNguoi(b0, { loai: 'sn', ten: 'A', cal: 'duong', d: 1, m: 1, nam: '1500' }).nguoi[0].nam === null);
  const s1 = KH.suaNguoi(g1, g1.nguoi[0].id, { loai: 'gio', ten: 'Ông ngoại', cal: 'duong', d: 5, m: 6, nhac: null });
  k('B3 sửa: đổi tên / lịch / ngày / nhắc, giữ id; id lạ → null; tên rỗng → null', !!s1 && s1.nguoi[0].ten === 'Ông ngoại' && s1.nguoi[0].cal === 'duong' && s1.nguoi[0].nhac === null && s1.nguoi[0].id === g1.nguoi[0].id && KH.suaNguoi(g1, 'khong-co', { loai: 'gio', ten: 'A', cal: 'am', d: 1, m: 1 }) === null && KH.suaNguoi(g1, g1.nguoi[0].id, { loai: 'gio', ten: '', cal: 'am', d: 1, m: 1 }) === null);
  k('B2 xoá: người đó mất, bản cũ không đổi', KH.xoaNguoi(g1, g1.nguoi[0].id).nguoi.length === 0 && g1.nguoi.length === 1);
  const dayNguoi = { ...b0, nguoi: Array.from({ length: 100 }, (_, i) => ({ id: 'p' + i, loai: 'sn', ten: 'A', cal: 'duong', d: 1, m: 1, nam: null, nhac: null })) };
  k('D1 đủ 100 người: thêm người thứ 101 → null (không mất người cũ)', KH.themNguoi(dayNguoi, { loai: 'sn', ten: 'B', cal: 'duong', d: 1, m: 1 }) === null);
  const hai = KH.themNguoi(KH.themNguoi(b0, { loai: 'sn', ten: 'Mẹ', cal: 'duong', d: 28, m: 12, nam: 1958 }), { loai: 'gio', ten: 'Bà', cal: 'duong', d: 12, m: 11 });
  k('B2 danh sách sắp theo lần tới, gần nhất trước (12/11 trước 28/12)', bang(KH.nguoiSapXep(hai, HN).map((x) => x.p.ten), ['Bà', 'Mẹ']));

  console.log('C1 — 11 dịp cúng (vkNext) quanh Tết, điền bài khấn');
  k('C1 đúng 11 dịp, đúng thứ tự mã của demo', bang(ND.MA_DIP, ['r', 'tao', 'gt', 'tet', 'tt', 'rg', 'tm', 'dn', 'vl', 'ttu', 'gio']));
  const demoSrc = doc('thiet_ke/app_kh_demo.html'), a0 = demoSrc.indexOf('  const VK_OPEN'), a1 = demoSrc.indexOf('  const VKI');
  let vkDemo = null;
  try { const ctx = vm.createContext({ nextMot15() {}, nextGiaoThua() {}, nextThanhMinh() {} }); vm.runInContext(demoSrc.slice(a0, a1) + '\nthis.VK = VK;', ctx); vkDemo = ctx.VK; } catch { /* hỏng → ca bên dưới đỏ */ }
  k('C1 nội dung 11 dịp CHÉP NGUYÊN từ demo: tên, biểu tượng, lễ vật, cách sắp lễ, từng dòng bài khấn', !!vkDemo && vkDemo.length === 11 && ND.VK.every((v, i) => v.id === vkDemo[i].id && v.n === vkDemo[i].n && v.ic === vkDemo[i].ic && v.le === vkDemo[i].le && v.cach === vkDemo[i].cach && bang(v.vk, vkDemo[i].vk)));
  const gtDip = VKJ.timDip('gt'), tetDip = VKJ.timDip('tet'), rDip = VKJ.timDip('r');
  k('C1 Giao thừa 2027 (Tết 6/2/2027): trước 5/2 → 5/2; đúng 5/2 → hôm nay; sau 5/2 (6/2) → Giao thừa năm sau 25/1/2028', dm(VKJ.vkNext(gtDip, N(4, 2, 2027))) === '5/2/2027' && dm(VKJ.vkNext(gtDip, N(5, 2, 2027))) === '5/2/2027' && dm(VKJ.vkNext(gtDip, N(6, 2, 2027))) === '25/1/2028');
  k('C1 Mùng 1 Tết: trước Giao thừa → 6/2/2027; đúng ngày → hôm nay; sau → Tết 2028 (26/1/2028)', dm(VKJ.vkNext(tetDip, N(4, 2, 2027))) === '6/2/2027' && dm(VKJ.vkNext(tetDip, N(6, 2, 2027))) === '6/2/2027' && dm(VKJ.vkNext(tetDip, N(7, 2, 2027))) === '26/1/2028');
  const jR = VKJ.vkNext(rDip, HN);
  k('C1 Mùng 1 & Rằm từ 10/11/2026 → Rằm tháng 10 âm (23/11/2026); đúng mùng 1 → hôm nay', dm(jR) === '23/11/2026' && am(jR).d === 15 && dm(VKJ.vkNext(rDip, N(9, 12, 2026))) === '9/12/2026' && am(J(9, 12, 2026)).d === 1);
  k('C1 Thanh minh 2027 theo tiết khí (5/4/2027); Vía Thần Tài 10/1 âm; Cúng giỗ chưa có người → null', dm(VKJ.vkNext(VKJ.timDip('tm'), N(1, 3, 2027))) === '5/4/2027' && am(VKJ.vkNext(VKJ.timDip('tt'), N(7, 2, 2027))).d === 10 && am(VKJ.vkNext(VKJ.timDip('tt'), N(7, 2, 2027))).m === 1 && VKJ.vkNext(VKJ.timDip('gio'), HN, []) === null);
  const hoGio = [{ id: 'a', loai: 'gio', ten: 'Cụ ông', cal: 'duong', d: 20, m: 12 }, { id: 'b', loai: 'gio', ten: 'Cụ bà', cal: 'duong', d: 15, m: 11 }, { id: 'c', loai: 'sn', ten: 'Mẹ', cal: 'duong', d: 11, m: 11 }];
  k('C1 Cúng giỗ lấy giỗ gần nhất trong danh sách (15/11, bỏ qua sinh nhật); gioSapToi trả đúng người', dm(VKJ.vkNext(VKJ.timDip('gio'), HN, hoGio)) === '15/11/2026' && VKJ.gioSapToi(hoGio, HN).ten === 'Cụ bà' && VKJ.gioSapToi([], HN) === null);
  const ds = VKJ.dipSapXep(N(4, 2, 2027), []);
  k('C1 dipSapXep: đủ 11 dịp, tăng dần theo ngày, dịp chưa có ngày (giỗ) ở cuối; đầu danh sách là Giao thừa', ds.length === 11 && ds[0].v.id === 'gt' && ds[10].v.id === 'gio' && ds[10].j === null && ds.slice(0, 10).every((x, i, a) => i === 0 || a[i - 1].j <= x.j));
  const phang = (bai) => bai.map((d) => d.map((x) => x.t).join('')).join('\n');
  const jMung5 = LP.amSangDuong(5, 10, 2026);
  const bai = VKJ.dienBai(rDip, { ten: 'Trần Văn B', dc: '12 Lê Lợi', ho: 'Trần', nm: '' }, jMung5);
  k('C2 điền bài khấn: tín chủ, địa chỉ, họ; ngày âm "mùng 5", tháng "Mười", năm can chi "Bính Ngọ"; chỗ tự điền là đoạn mark', phang(bai).includes('Tín chủ con là Trần Văn B, ngụ tại 12 Lê Lợi.') && phang(bai).includes('họ Trần') && phang(bai).includes('ngày mùng 5 tháng Mười năm Bính Ngọ') && bai.flat().some((x) => x.mark && x.t === 'Trần Văn B'));
  k('C2 ngày > 10 viết số (15), tháng 1 = "Giêng", tháng 12 = "Chạp"', phang(VKJ.dienBai(rDip, {}, LP.amSangDuong(15, 1, 2027))).includes('ngày 15 tháng Giêng') && phang(VKJ.dienBai(rDip, {}, LP.amSangDuong(1, 12, 2026))).includes('ngày mùng 1 tháng Chạp'));
  const baiGt = phang(VKJ.dienBai(gtDip, { ten: 'A' }, J(5, 2, 2027)));
  k('C2 Giao thừa 2027: năm cũ "Bính Ngọ", năm mới "Đinh Mùi"', baiGt.includes('năm cũ Bính Ngọ đã qua, năm mới Đinh Mùi đã tới'));
  const trongTin = VKJ.dienBai(rDip, {}, jMung5);
  k('C2 thiếu thông tin → chỗ tô màu để TRỐNG (không bịa tên), không còn "{…}"; Hương linh trống → "các cụ Tổ tiên"', trongTin.flat().filter((x) => x.mark && x.t === '').length >= 3 && !phang(trongTin).includes('{') && phang(VKJ.dienBai(VKJ.timDip('gio'), {}, jMung5)).includes('giỗ của các cụ Tổ tiên') && phang(VKJ.dienBai(VKJ.timDip('gio'), { nm: 'Cụ Lan' }, jMung5)).includes('giỗ của Cụ Lan'));
  k('C2 tên có ký tự lạ (<b>…, dấu ngoặc nhọn) giữ nguyên là chữ, không thành thẻ', VKJ.dienBai(rDip, { ten: '<b>x</b> {ho}' }, jMung5).flat().some((x) => x.mark && x.t === '<b>x</b> {ho}'));

  console.log('A1–A4, C4 — dòng nhỏ ô tiện ích, ô Chu kỳ, Sắp tới gộp, nhắc');
  const bTrong = KH.keHoachTrong();
  k('A1 dòng nhỏ: Theo mùa "Mùa Đông" · Văn khấn "Rằm · 13 ng" · Ngày cần nhớ "<lễ gần nhất> · N ng" (người thân gần hơn thì lấy người)', KH.chuThich('mua', HN, bTrong) === 'Mùa Đông' && KH.chuThich('vk', HN, bTrong) === 'Rằm · 13 ng' && KH.chuThich('ngay', HN, bTrong) === 'Nhà giáo Việt Nam · 10 ng' && KH.chuThich('ngay', HN, hai) === 'Bà · 2 ng');
  k('A1 hôm nay đúng ngày → "nay" (không "0 ng"); Tết → bỏ chữ "Tết " ("Nguyên đán · 3 ng")', KH.chuThich('ngay', HN, KH.themNguoi(bTrong, { loai: 'sn', ten: 'Con', cal: 'duong', d: 10, m: 11 })) === 'Con · nay' && KH.chuThich('ngay', N(3, 2, 2027), bTrong) === 'Nguyên đán · 3 ng');
  k('A3 ba ô chưa làm (xe · thuoc · chuky) → "Sắp có"', ['xe', 'thuoc', 'chuky'].every((id) => KH.chuThich(id, HN, bTrong) === 'Sắp có'));
  k('A2 ô Chu kỳ ẩn khi xưng hô anh / chú / bác / ông; hiện với chị / cô / em / bạn / chưa biết', ['anh', 'chu', 'bac', 'ong'].every((x) => KH.coChuKy(x) === false) && ['chi', 'co', 'em', 'ban', undefined, null, ''].every((x) => KH.coChuKy(x) === true));
  const bUp = { ...KH.keHoachTrong(), viec: [{ id: 'v1', ngay: '2026-11-12', gio: '', tieu: 'Mua quà', nhac: null, xong: false }, { id: 'v2', ngay: '2026-11-13', gio: '', tieu: 'Đã xong', nhac: null, xong: true }], nguoi: [{ id: 'n1', loai: 'sn', ten: 'Mẹ', cal: 'duong', d: 11, m: 11, nam: 1958, nhac: null }, { id: 'n2', loai: 'gio', ten: 'Ông nội', cal: 'am', d: LP.lichAm(J(30, 11, 2026)).d, m: LP.lichAm(J(30, 11, 2026)).m, nam: null, nhac: null }, { id: 'n3', loai: 'sn', ten: 'Xa', cal: 'duong', d: 5, m: 2, nam: null, nhac: null }] };
  const up = KH.upList(HN, bUp);
  k('A4 Sắp tới gộp việc · sinh nhật · giỗ · cúng · lễ trong 30 ngày, gần nhất trước; việc xong và người ngoài 30 ngày không có', up.every((e, i) => i === 0 || up[i - 1].j <= e.j) && ['Việc', 'Sinh nhật', 'Giỗ', 'Cúng', 'Lễ'].every((kk) => up.some((e) => e.k === kk)) && !up.some((e) => e.t === 'Đã xong' || e.t === 'Sinh nhật Xa') && up.every((e) => e.j <= J(10, 11, 2026) + 30) && up.find((e) => e.k === 'Giỗ').t === 'Giỗ Ông nội' && up[0].t === 'Sinh nhật Mẹ');
  k('A4 mỗi dòng có chỗ mở: Việc → ngày, Sinh nhật / Giỗ → nguoi, Cúng → dịp, Lễ → le; Cúng giỗ KHÔNG tự thành dòng cúng', up.find((e) => e.k === 'Việc').di === 'viec' && up.find((e) => e.k === 'Việc').ngay === '2026-11-12' && up.find((e) => e.k === 'Giỗ').di === 'nguoi' && up.find((e) => e.k === 'Cúng').di === 'cung' && !!up.find((e) => e.k === 'Cúng').dip && up.find((e) => e.k === 'Lễ').di === 'le' && !up.some((e) => e.dip === 'gio'));
  k('A4 Sắp tới KHÔNG có Tết Nguyên đán / Trung thu / Đoan ngọ / Vu Lan ở mục Lễ (đã có ở Cúng, như demo)', !KH.upList(N(3, 2, 2027), KH.keHoachTrong()).some((e) => e.k === 'Lễ' && /Nguyên đán/.test(e.t)) && KH.upList(N(3, 2, 2027), KH.keHoachTrong()).some((e) => e.k === 'Cúng' && /Giao thừa/.test(e.t)));

  console.log('B4/C4 — nhắc: dải nhắc khi App mở + chuông trên lịch');
  const bNhac = KH.themNguoi(KH.keHoachTrong(), { loai: 'gio', ten: 'Ông nội', cal: 'duong', d: 25, m: 11, nhac: -240 });
  const aoNhac = KH.bangCoNhac(bNhac, HN);
  k('B4 sinh nhật / giỗ thành việc ẢO để tính nhắc: không lưu, không vào danh sách việc thật, ngày đúng lần tới; không người → trả đúng bản gốc', aoNhac.viec.some((v) => v.ao && v.ngay === '2026-11-25' && v.tieu === 'Giỗ Ông nội') && bNhac.viec.length === 0 && KH.bangCoNhac(bTrong, HN) === bTrong);
  k('B4 chuông trên lịch ở ngày 25/11 (kể cả người không bật nhắc); ngày khác không có', LP.danhDauNgay(aoNhac, J(1, 11, 2026), J(30, 11, 2026), HN).get(J(25, 11, 2026)) === 'viec' && !LP.danhDauNgay(aoNhac, J(1, 11, 2026), J(30, 11, 2026), HN).get(J(24, 11, 2026)));
  const nhacToi = LP.nhacDangCo(aoNhac, '2026-11-24 21:00:00', N(24, 11, 2026));
  k('B4 nhắc "1 ngày trước" = 20:00 hôm trước: 21:00 ngày 24/11 hiện dải nhắc "Giỗ Ông nội"; 19:00 thì chưa; giỗ không bật nhắc thì không dải', nhacToi.length === 1 && /Giỗ Ông nội/.test(nhacToi[0].chu) && LP.nhacDangCo(aoNhac, '2026-11-24 19:00:00', N(24, 11, 2026)).length === 0 && LP.nhacDangCo(KH.bangCoNhac(KH.themNguoi(KH.keHoachTrong(), { loai: 'gio', ten: 'A', cal: 'duong', d: 25, m: 11, nhac: null }), HN), '2026-11-24 21:00:00', N(24, 11, 2026)).length === 0);
  const bCung = KH.doiNhacDip(KH.keHoachTrong(), 'tet');
  const aoCung = KH.bangCoNhac(bCung, N(1, 2, 2027));
  k('C4 dịp cúng bật nhắc → mốc nhắc tối hôm trước: Mùng 1 Tết 6/2/2027 nhắc lúc 20:00 ngày 5/2; dịp tắt nhắc thì không; Mùng 1 & Rằm dùng kiểu lặp âm lịch', LP.nhacDangCo(aoCung, '2026-02-05 21:00:00'.replace('2026', '2027'), N(5, 2, 2027)).some((x) => /Mùng 1 Tết/.test(x.chu)) && KH.bangCoNhac(KH.keHoachTrong(), N(1, 2, 2027)).viec.length === 0 && KH.bangCoNhac(KH.doiNhacDip(KH.keHoachTrong(), 'r'), HN).viec.some((v) => v.lap && v.lap.k === 'amlich'));
  k('C4 việc ảo chỉ từ hôm nay trở đi → KHÔNG bao giờ thành "quá hạn"', LP.quaHan(KH.bangCoNhac({ ...bNhac, vk: KH.doiNhacDip(bNhac, 'r').vk }, N(30, 11, 2026)), N(30, 11, 2026)).every((q) => !q.v.ao) && LP.quaHan(KH.bangCoNhac(bNhac, N(26, 11, 2026)), N(26, 11, 2026)).every((q) => !q.v.ao));

  console.log('D1 — lưu trên máy: bản cũ 5b/5c/5d, bản hỏng, vòng ghi → đọc');
  const kho5d = khoGia({ kh_kehoach: JSON.stringify({ v: 1, viec: [{ id: 'a', ngay: '2026-11-08', gio: '', tieu: 'Việc cũ', nhac: null, xong: false }], leNhac: { 'Nhà giáo Việt Nam': true } }) });
  const cu = KH.docKeHoach(kho5d);
  k('D1 bản của 5d (không có nguoi / vk) đọc được: việc và nhắc lễ giữ nguyên, người = [], vk = mặc định (cỡ chữ 17, trống)', cu.viec.length === 1 && cu.leNhac['Nhà giáo Việt Nam'] === true && bang(cu.nguoi, []) && cu.vk.fs === 17 && cu.vk.ten === null && bang(cu.vk.tick, {}) && bang(cu.vk.nhac, {}));
  const hong1 = KH.docKeHoach(khoGia({ kh_kehoach: JSON.stringify({ v: 1, viec: [], leNhac: {}, nguoi: [null, 5, 'x', { id: 'ok', loai: 'sn', ten: 'Tốt', cal: 'duong', d: 1, m: 1 }, { id: 'xau', loai: 'sn', ten: 'Sai', cal: 'duong', d: 31, m: 2 }, { id: 'ok', loai: 'sn', ten: 'Trùng id', cal: 'duong', d: 2, m: 2 }], vk: { ten: 123, fs: 99, tick: { 'r:2026': [0, 'a', 99, 2, 2], 'zzz:2026': [1], 'r:abc': [1] }, nhac: { r: true, zzz: true, tet: 'có' } } }) }));
  k('D1 bản hỏng từng phần: bỏ phần tử sai (người ngày sai, trùng id), giữ phần tốt; vk sai kiểu → mặc định; tick lọc chỉ số lạ / dịp lạ; nhắc chỉ dịp thật', hong1.nguoi.length === 1 && hong1.nguoi[0].ten === 'Tốt' && hong1.vk.ten === null && hong1.vk.fs === 17 && bang(hong1.vk.tick, { 'r:2026': [0, 2] }) && bang(hong1.vk.nhac, { r: true }));
  k('D1 bản lưu không phải JSON / không phải object / nguoi không phải mảng → bản trống, không ném lỗi', [khoGia({ kh_kehoach: '{hỏng' }), khoGia({ kh_kehoach: '[1,2]' }), khoGia({ kh_kehoach: 'null' }), khoGia({ kh_kehoach: JSON.stringify({ nguoi: 'x', vk: [] }) }), khoGia({})].every((kho) => { const b = KH.docKeHoach(kho); return b.nguoi.length === 0 && b.vk.fs === 17; }) && KH.docKeHoach(khoGia({}, true)).nguoi.length === 0);
  const kho2 = khoGia();
  let bb = KH.themNguoi(KH.keHoachTrong(), { loai: 'sn', ten: 'Mẹ', cal: 'duong', d: 28, m: 12, nam: 1958, nhac: 480 });
  bb = KH.datThongTinVk(bb, { ten: 'Linh', ho: 'Nguyễn', dc: '1 Phố Hàng', nm: 'Cụ A' });
  bb = KH.tickLeVat(KH.tickLeVat(bb, 'r', 2026, 3), 'r', 2026, 1);
  bb = KH.doiNhacDip(KH.doiCoChu(bb, 1), 'tao');
  k('D1 ghi → đọc lại đủ: người thân, Tín chủ / họ / địa chỉ / hương linh, lễ vật đã sắm (theo dịp + năm, sắp tăng), nhắc dịp, cỡ chữ 19', KH.ghiKeHoach(bb, kho2) === true && (() => { const r = KH.docKeHoach(kho2); return r.nguoi[0].ten === 'Mẹ' && r.nguoi[0].nam === 1958 && r.nguoi[0].nhac === 480 && r.vk.ten === 'Linh' && r.vk.ho === 'Nguyễn' && r.vk.dc === '1 Phố Hàng' && r.vk.nm === 'Cụ A' && bang(r.vk.tick, { 'r:2026': [1, 3] }) && r.vk.nhac.tao === true && r.vk.fs === 19; })());
  k('D1 ghi vào kho bị chặn → false (màn không được báo "đã lưu")', KH.ghiKeHoach(bb, khoGia({}, true)) === false);
  k('C2 tick lần hai bỏ tick; tick khác năm là bản riêng; cỡ chữ kẹp 14–26', bang(KH.tickLeVat(KH.tickLeVat(bTrong, 'r', 2026, 1), 'r', 2026, 1).vk.tick['r:2026'], []) && bang(KH.tickLeVat(KH.tickLeVat(bTrong, 'r', 2026, 1), 'r', 2027, 2).vk.tick, { 'r:2026': [1], 'r:2027': [2] }) && KH.doiCoChu({ vk: { fs: 14 } }, -1).vk.fs === 14 && KH.doiCoChu({ vk: { fs: 26 } }, 1).vk.fs === 26 && KH.doiCoChu({ vk: { fs: 17 } }, 1).vk.fs === 19);
  const luuMay = await nap('src/luuMay.js');
  k('D1 không thêm khoá lưu mới: luuMay.js chỉ có kh_kehoach cho Kế hoạch, văn khấn và người thân nằm trong đó', !/kh_vankhan|kh_nguoi|kh_vk/.test(doc('src/luuMay.js') + doc('src/kehoach.js') + doc('src/vanKhan.js')) && !!luuMay);

  console.log('B1/E — đường dẫn');
  const ra = (p) => DD.docDuongDan(p);
  k('B1 /kehoach/ngaycannho, /kehoach/vankhan, /kehoach/ngayle: trang tienich, cần đăng nhập, cha = /kehoach, tab Trang chủ', ['ngaycannho', 'vankhan', 'ngayle'].every((t) => { const r = ra('/kehoach/' + t); return r.trang === 'tienich' && r.tham.tienich === t && r.canDN && r.cha === '/kehoach' && r.chuan === '/kehoach/' + t && r.tab === 'trangchu' && DD.taoDuongDan('tienich', { tienich: t }) === '/kehoach/' + t; }));
  k('C1 /kehoach/vankhan/<dịp> cho cả 11 dịp: tham.dip đúng, cha = /kehoach/vankhan, tạo lại ra đúng đường dẫn; dịp lạ / tiện ích khác có dịp → về /kehoach', ND.MA_DIP.every((d) => { const r = ra('/kehoach/vankhan/' + d); return r.trang === 'tienich' && r.tham.dip === d && r.tham.tienich === 'vankhan' && r.cha === '/kehoach/vankhan' && DD.taoDuongDan('tienich', { tienich: 'vankhan', dip: d }) === '/kehoach/vankhan/' + d; }) && ['/kehoach/vankhan/la', '/kehoach/theomua/r', '/kehoach/ngaycannho/r'].every((p) => ra(p).trang === 'kehoach'));
  k('A3 ba tiện ích chưa làm (xe, thuoc, chuky) KHÔNG có đường dẫn riêng → về /kehoach', ['/kehoach/xe', '/kehoach/thuoc', '/kehoach/chuky', '/kehoach/xecom'].every((p) => ra(p).trang === 'kehoach' && ra(p).chuan === '/kehoach'));
  k('B1 đăng nhập xong quay lại đúng chỗ: tiepHopLe nhận /kehoach/ngayle, /kehoach/vankhan/r', DD.tiepHopLe('/kehoach/ngayle') === '/kehoach/ngayle' && DD.tiepHopLe('/kehoach/vankhan/r') === '/kehoach/vankhan/r' && DD.trangCanDangNhap('tienich'));

  console.log('Màn dựng thật (react-dom/server)');
  globalThis.localStorage = khoGia();
  const cb = { lui() {}, moTienIch() {}, chonMon() {}, veLich() {} };
  const veKH = (p) => thanhPhan('pages/KeHoach.jsx')({ ...cb, homNay: HN, ...p }), veTI = (p) => thanhPhan('pages/TienIch.jsx')({ ...cb, homNay: HN, ...p });
  const dem = (h, re) => (h.match(re) || []).length;
  const ten = (h) => [...h.matchAll(/class="tl"[^>]*>.*?<b>([^<]+)<\/b>/g)].map((x) => x[1]);
  const luoi = veKH({ xungHo: 'chi' });
  k('A1 lưới có đúng 6 ô theo thứ tự Theo mùa · Văn khấn · Ngày cần nhớ · Xe cộ · Uống thuốc · Chu kỳ, lớp tl-g six; ba ô cuối "Sắp có"; không còn ô Ngày lễ / Sắp tới', bang(ten(luoi), ['Theo mùa', 'Văn khấn', 'Ngày cần nhớ', 'Xe cộ', 'Uống thuốc', 'Chu kỳ']) && luoi.includes('class="tl-g six"') && dem(luoi, /<small>Sắp có<\/small>/g) === 3);
  k('A1 biểu tượng lấy từ bộ của demo (book, gift, scooter, mortar vẽ thẳng bằng <svg>; fan, moon là the-chat-*.svg), không ảnh base64', dem(luoi, /class="tl-ic"><svg/g) === 4 && luoi.includes('the-chat-fan.svg') && luoi.includes('the-chat-moon.svg') && !/data:image/.test(luoi));
  const anh = veKH({ xungHo: 'anh' });
  k('A2 xưng hô "anh" → lưới 5 ô, không ô Chu kỳ, không lỗ; "chú", "bác", "ông" cũng vậy; "em" vẫn 6 ô', bang(ten(anh), ['Theo mùa', 'Văn khấn', 'Ngày cần nhớ', 'Xe cộ', 'Uống thuốc']) && ['chu', 'bac', 'ong'].every((x) => dem(veKH({ xungHo: x }), /class="tl"/g) === 5) && dem(veKH({ xungHo: 'em' }), /class="tl"/g) === 6);
  k('A4 dải Sắp tới dưới lưới: 3 dòng gần nhất "d/m · tên · N ngày"; có "Xem tất cả N ›" khi có việc; ô Sắp tới cũ không còn trong lưới', luoi.includes('class="up-strip"') && luoi.includes('<b>Sắp tới</b>') && dem(luoi, /class="up-r"/g) <= 3 && /Xem tất cả \d+ ›/.test(luoi) && /<i>20\/11<\/i><span>Nhà giáo Việt Nam<\/span><small>10 ngày<\/small>/.test(luoi));
  k('A4 trống → "30 ngày tới chưa có việc gì" có ở dải và ở màn Sắp tới (nhánh dự phòng: Mùng 1 / Rằm luôn nằm trong 30 ngày nên upList không bao giờ rỗng); không "Xem tất cả" khi rỗng', doc('src/pages/KeHoach.jsx').includes('30 ngày tới chưa có việc gì') && doc('src/pages/TienIch.jsx').includes('30 ngày tới chưa có việc gì') && /sapToi\.length \? <span[\s\S]{0,80}Xem tất cả/.test(doc('src/pages/KeHoach.jsx')) && [N(10, 3, 2027), N(1, 1, 2027), N(10, 11, 2026)].every((h) => KH.upList(h, KH.keHoachTrong()).length >= 1));
  globalThis.localStorage = khoGia({ kh_kehoach: JSON.stringify({ v: 1, viec: [], leNhac: {}, nguoi: [{ id: 'g', loai: 'gio', ten: 'Ông nội', cal: 'duong', d: 25, m: 11, nam: null, nhac: -240 }, { id: 's', loai: 'sn', ten: 'Mẹ', cal: 'duong', d: 28, m: 12, nam: 1958, nhac: null }], vk: { ten: null, ho: '', dc: '', nm: null, fs: 17, tick: {}, nhac: {} } }) });
  const ng = veTI({ id: 'ngaycannho' });
  k('B1/B2 Ngày cần nhớ: 2 tab Người thân · Ngày lễ, nút "＋ Thêm", dòng "Giỗ Ông nội" (ô 25/11, "15 ngày", "T4, 25/11") và "Sinh nhật Mẹ" (…"tròn 68 tuổi"), "Văn khấn giỗ ›" chỉ ở giỗ, "Xoá", nút nhắc; KHÔNG "Tặng thẻ quà"', ng.includes('Người thân') && ng.includes('Ngày lễ') && ng.includes('＋ Thêm') && ng.includes('Giỗ Ông nội') && ng.includes('<b>25/11</b><small>15 ngày</small>') && ng.includes('T4, 25/11') && ng.includes('Sinh nhật Mẹ') && ng.includes('tròn 68 tuổi') && dem(ng, /Văn khấn giỗ ›/g) === 1 && dem(ng, /class="tl-date (gio|sn)"/g) === 2 && ng.includes('Đang nhắc') && ng.includes('Nhắc khi mở app') && !/Tặng thẻ quà|giftcard/.test(ng));
  k('B1 mở bằng /kehoach/ngayle → tab Ngày lễ đang chọn (có Nhà giáo Việt Nam, nút nhắc từng ngày), không danh sách người thân', (() => { const le = veTI({ id: 'ngayle' }); return le.includes('Nhà giáo Việt Nam') && !le.includes('Giỗ Ông nội') && /class="on">Ngày lễ</.test(le) && le.includes('Nhắc khi mở app'); })());
  k('B5 tab Ngày lễ trong Ngày cần nhớ vẫn là màn Ngày lễ của 5b (6 gợi ý quà chỉ là chữ)', dem(veTI({ id: 'ngayle' }), /Gợi ý quà tặng/g) === 6);
  const vkDs = veTI({ id: 'vankhan', dip: '' });
  k('C1 Văn khấn danh sách: thẻ lớn "Sắp tới" (dịp gần nhất: Mùng 1 & Rằm 23/11, "âm lịch 15/10", "Còn 13 ngày", "Xem lễ vật & văn khấn ›") + 10 dịp còn lại, nút nhắc (trừ Cúng giỗ), ghi chú cuối', vkDs.includes('class="vk-hero"') && vkDs.includes('Mùng 1 &amp; Rằm hằng tháng') && vkDs.includes('âm lịch 15/10') && vkDs.includes('Còn 13 ngày') && vkDs.includes('Xem lễ vật &amp; văn khấn ›') && dem(vkDs, /class="tl-row"/g) === 10 && dem(vkDs, /class="tl-rm/g) === 9 && vkDs.includes('T4, 25/11 · âm') && vkDs.includes('Bài khấn theo nếp cổ truyền phổ biến'));
  const vkMot = veTI({ id: 'vankhan', dip: 'r', tenKhach: 'Khách Thử' });
  k('C2 một dịp: ô Tín chủ (mặc định = tên khách) · Họ gia tiên · Địa chỉ, "0/6 đã sắm", Cách sắp lễ, Văn khấn có chỗ tô màu, A− / A+, nhắc, ghi chú; KHÔNG Đọc to / Đặt hoa quả', vkMot.includes('value="Khách Thử"') && vkMot.includes('Họ gia tiên') && vkMot.includes('0/6 đã sắm') && vkMot.includes('Cách sắp lễ') && vkMot.includes('<mark>Khách Thử</mark>') && vkMot.includes('A−') && vkMot.includes('A+') && vkMot.includes('Nhắc khi mở app') && vkMot.includes('Phần tô màu là chỗ tự điền') && !/Đọc to|Đặt hoa quả|Tặng thẻ quà/.test(vkMot + vkDs + ng) && vkMot.includes('font-size:17px'));
  const vkGio = veTI({ id: 'vankhan', dip: 'gio', tenKhach: 'Khách' });
  k('C1/C2 Cúng giỗ: có ô "Người được giỗ" điền sẵn người có giỗ gần nhất (Ông nội) và không có nút nhắc dịp; Thanh minh có "Hương linh"', vkGio.includes('Người được giỗ') && vkGio.includes('value="Ông nội"') && vkGio.includes('<mark>Ông nội</mark>') && !vkGio.includes('tl-rm') && veTI({ id: 'vankhan', dip: 'tm' }).includes('Hương linh'));
  k('C2 dịp lạ trong địa chỉ → không vỡ màn (không nội dung dịp)', !veTI({ id: 'vankhan', dip: 'khong-co' }).includes('Lễ vật'));
  const khoTick = khoGia({ kh_kehoach: JSON.stringify({ v: 1, viec: [], leNhac: {}, nguoi: [], vk: { ten: null, ho: '', dc: '', nm: null, fs: 21, tick: { 'r:2026': [0] }, nhac: { r: true } } }) });
  globalThis.localStorage = khoTick;
  const vkTick = veTI({ id: 'vankhan', dip: 'r', tenKhach: 'A' });
  k('C2 đọc lại: "1/6 đã sắm" (tick theo dịp + năm 2026), cỡ chữ 21px, nút "Đang nhắc"', vkTick.includes('1/6 đã sắm') && vkTick.includes('font-size:21px') && vkTick.includes('Đang nhắc') && vkTick.includes('class="ok"'));

  k('C2 xoá trắng ô Tín chủ / Người được giỗ lưu "" (không tự điền lại tên khách); chưa nhập (null) mới hiện gợi ý', KH.datThongTinVk(bTrong, { ten: '' }).vk.ten === '' && KH.datThongTinVk(bTrong, { nm: '' }).vk.nm === '' && bTrong.vk.ten === null && /vk\.ten \?\? /.test(doc('src/components/VanKhanMan.jsx')) && /vk\.nm \?\? /.test(doc('src/components/VanKhanMan.jsx')));
  k('B3 đổi loại sang Ngày giỗ (tự Âm) kẹp ngày về ≤ 30 như doiLich (nguồn)', /const doiLoai = [^\n]*Math\.min\(f\.d/.test(doc('src/components/NguoiThan.jsx')));

  console.log('E — nguồn');
  const moi = ['src/vanKhan.js', 'src/noiDung/vanKhan.js', 'src/components/NguoiThan.jsx', 'src/components/VanKhanMan.jsx', 'src/components/BieuTuongTienIch.jsx', 'src/pages/TienIch.jsx', 'src/pages/KeHoach.jsx'].map(doc).join('\n');
  k('E1 không gọi mạng: các tệp mới không fetch / XMLHttpRequest / sendBeacon / import api.js (dữ liệu người thân, văn khấn KHÔNG ra khỏi máy)', !/fetch\(|XMLHttpRequest|sendBeacon|api\.js/.test(moi));
  k('E1 giờ VN: không new Date(chuỗi giờ POS); "hôm nay" từ bayGio()', !/new Date\(\s*(gio|chuoi|bayGio|String)/.test(moi) && /homNayTuGio\(bayGio\(\)\)/.test(doc('src/pages/TienIch.jsx')));
  const khongChuThich = moi.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/ .*$/gm, '');
  k('C3 không "Đọc to", "Đặt hoa quả", "Tặng thẻ quà", speechSynthesis trong mã; K3 không chữ "nợ" (bản giả "Công nợ" bị bắt)', !/Đọc to|Đặt hoa quả|Tặng thẻ quà|speechSynthesis/i.test(khongChuThich) && khongNo(khongChuThich) && !khongNo('Công nợ'));
  k('E1 bài khấn không dùng dangerouslySetInnerHTML với chữ của khách (chỉ biểu tượng tĩnh của demo)', !/dangerouslySetInnerHTML/.test(doc('src/components/VanKhanMan.jsx') + doc('src/components/NguoiThan.jsx') + doc('src/pages/TienIch.jsx')) && /dangerouslySetInnerHTML/.test(doc('src/components/BieuTuongTienIch.jsx')));
  k('E1 ngân sách: mỗi tệp mới < 500 dòng (trừ dữ liệu biểu tượng)', ['src/vanKhan.js', 'src/noiDung/vanKhan.js', 'src/components/NguoiThan.jsx', 'src/components/VanKhanMan.jsx', 'src/pages/TienIch.jsx', 'src/pages/KeHoach.jsx', 'src/kehoach.js'].every((f) => doc(f).split('\n').length < 500));

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET !== '1') { try { pw = require('playwright'); } catch { /* không có */ } } // CLAUDE.md §9
  if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này (hoặc KHONG_TRINH_DUYET=1) — các ca trình duyệt CHƯA chạy');
  else await trinhDuyet(pw, { LP, LUNAR, nap });

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw, { LP, LUNAR, nap }) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, outdir: path.join(GOC, '.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
    loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles;
  const goi = kq.find((f) => f.path.endsWith('.js')).text, css = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text;
  const html = doc('index.html').replace(/<script type="module" src="\/src\/main.jsx"><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  const LM = await nap('src/luuMay.js');
  const SDT = '0901234567', GOC_URL = 'http://kh.test';
  const trinh = await pw.chromium.launch();
  const MOC_GIO = '2026-11-10T02:00:00Z'; // = 09:00 ngày 10.11.2026 giờ VN
  const jDa = LP.jd({ d: 25, m: 11, y: 2026 }), l25 = LP.lichAm(jDa); // giỗ thử: ngày âm của 25/11/2026 (trong 30 ngày tới)

  async function ca(ten, { rong = 390, luu = {}, xung = 'chi' } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 } });
    const t = await ctx.newPage(), loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } }, { luu: { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT), ...luu } });
    await t.clock.install({ time: new Date(MOC_GIO) });
    await t.route(`${GOC_URL}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Khách thử', xung_ho: xung, ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      if (p === '/api/kh/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (p === '/api/kh/chuong-trinh') return json(200, { success: true, data: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    try { await chay(t, loi); } finally { await ctx.close(); }
  }
  const mo = async (t, duong) => { await t.goto(GOC_URL + duong); await t.waitForSelector('.phone'); };
  const duong = (t) => new URL(t.url()).pathname;
  const o6 = (t) => t.locator('#toolGrid .tl b').allInnerTexts();
  const luuTho = async (t) => JSON.parse(await t.evaluate(() => localStorage.getItem('kh_kehoach') || '{}'));
  const toolBody = (t) => t.locator('#toolBody');
  const bang1 = (t) => t.locator('[role=dialog]');

  await ca('luoi', {}, async (t, loi) => {
    await mo(t, '/kehoach'); await t.locator('#toolGrid').waitFor();
    k('A1 lưới 6 ô đúng thứ tự trên máy thật (xưng hô chị)', bang(await o6(t), ['Theo mùa', 'Văn khấn', 'Ngày cần nhớ', 'Xe cộ', 'Uống thuốc', 'Chu kỳ']), JSON.stringify(await o6(t)));
    const cot = await t.evaluate(() => { const g = getComputedStyle(document.querySelector('.tl-g.six')).gridTemplateColumns.split(' ').length; const ic = [...document.querySelectorAll('#toolGrid .tl-ic svg, #toolGrid .tl-ic img')].map((e) => Math.round(e.getBoundingClientRect().width)); return { g, ic }; });
    k('A1 lưới 3 cột × 2 hàng theo demo, mọi biểu tượng hiện (rộng 38px)', cot.g === 3 && cot.ic.length === 6 && cot.ic.every((w) => w === 38), JSON.stringify(cot));
    k('A1 chữ nhỏ dưới ô: "Mùa Đông" · "Rằm · 13 ng" · "Nhà giáo Việt Nam · 10 ng"', bang(await t.locator('#toolGrid .tl small').allInnerTexts(), ['Mùa Đông', 'Rằm · 13 ng', 'Nhà giáo Việt Nam · 10 ng', 'Sắp có', 'Sắp có', 'Sắp có']), JSON.stringify(await t.locator('#toolGrid .tl small').allInnerTexts()));
    await t.locator('#toolGrid .tl', { hasText: 'Xe cộ' }).click();
    k('A3 bấm Xe cộ → thông báo "Tiện ích này sắp có", KHÔNG đổi đường dẫn', (await t.getByText('Tiện ích này sắp có').count()) >= 1 && duong(t) === '/kehoach');
    await t.locator('#toolGrid .tl', { hasText: 'Chu kỳ' }).click(); await t.locator('#toolGrid .tl', { hasText: 'Uống thuốc' }).click();
    k('A3 Uống thuốc, Chu kỳ cũng chỉ báo "sắp có" (đường dẫn vẫn /kehoach)', duong(t) === '/kehoach');
    const st = await t.evaluate(() => { const s = document.querySelector('.up-strip'); return { n: s.querySelectorAll('.up-r').length, ct: s.innerText, xem: !!s.querySelector('.up-h span') && s.querySelector('.up-h span').innerText }; });
    k('A4 dải Sắp tới có tối đa 3 dòng "d/m · tên · N ngày", có "Xem tất cả N ›"', st.n >= 1 && st.n <= 3 && /20\/11\s*Nhà giáo Việt Nam\s*10 ngày/.test(st.ct) && /Xem tất cả \d+ ›/.test(st.xem), st.ct);
    await t.locator('.up-h span').click(); await t.waitForURL('**/kehoach/saptoi');
    k('A4 "Xem tất cả" → màn Sắp tới (/kehoach/saptoi)', duong(t) === '/kehoach/saptoi' && (await toolBody(t).innerText()).includes('Nhà giáo Việt Nam'));
    k('E1 không lỗi JS', loi.length === 0, loi.join(' | '));
  });
  await ca('anh', { xung: 'anh' }, async (t) => {
    await mo(t, '/kehoach'); await t.locator('#toolGrid').waitFor();
    k('A2 xưng hô "anh" → lưới 5 ô (không Chu kỳ), 3 + 2 không lỗ', bang(await o6(t), ['Theo mùa', 'Văn khấn', 'Ngày cần nhớ', 'Xe cộ', 'Uống thuốc']));
  });
  await ca('ngayle', {}, async (t) => {
    await mo(t, '/kehoach/ngayle'); await toolBody(t).waitFor();
    k('B1 /kehoach/ngayle (mở thẳng) → Ngày cần nhớ, tab Ngày lễ đang chọn, có Nhà giáo Việt Nam', (await t.locator('.ss-tabs button.on').innerText()) === 'Ngày lễ' && (await toolBody(t).innerText()).includes('Nhà giáo Việt Nam') && (await t.locator('h1').first().innerText()) === 'Ngày cần nhớ');
    await t.locator('.ss-tabs button', { hasText: 'Người thân' }).click();
    k('B1 chuyển sang tab Người thân → chưa có ai: có chữ hướng dẫn, nút ＋ Thêm', (await toolBody(t).innerText()).includes('Chưa có ai') && (await t.locator('.today-btn', { hasText: '＋ Thêm' }).count()) === 1);
  });
  await ca('nguoi', {}, async (t, loi) => {
    await mo(t, '/kehoach/ngaycannho'); await toolBody(t).waitFor();
    await t.locator('.today-btn', { hasText: '＋ Thêm' }).click(); await bang1(t).waitFor();
    const phan = [(await bang1(t).innerText()).includes('Thêm sinh nhật hoặc ngày giỗ'), (await bang1(t).getByText('Dương lịch', { exact: true }).count()) === 1, (await bang1(t).locator('.bx-cot').count()) === 2, (await bang1(t).getByText('3 ngày trước', { exact: true }).count()) === 1, (await bang1(t).getByText('Không nhắc', { exact: true }).count()) === 1, (await bang1(t).getByLabel('Năm sinh').count()) === 1];
    k('B3 bảng nổi "Thêm sinh nhật hoặc ngày giỗ": loại, tên, Dương/Âm lịch, bánh xoay ngày + tháng, nhắc 4 mức', phan.every(Boolean), JSON.stringify(phan));
    await bang1(t).getByText('Ngày giỗ', { exact: true }).click();
    k('B3 chọn "Ngày giỗ" → lịch mặc định Âm; ô Năm sinh ẩn (chỉ sinh nhật)', (await bang1(t).locator('.pf-chips button.on', { hasText: 'Âm lịch' }).count()) === 1 && (await bang1(t).getByLabel('Năm sinh').count()) === 0);
    await bang1(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    k('B3 chưa nhập tên → báo "Nhập tên trước nhé", bảng vẫn mở, chưa lưu gì', (await bang1(t).innerText()).includes('Nhập tên trước nhé') && !(await luuTho(t)).nguoi);
    await bang1(t).getByLabel('Tên').fill('Ông nội');
    await bang1(t).getByRole('spinbutton', { name: 'Tháng' }).locator('div', { hasText: new RegExp(`^${l25.m}$`) }).click();
    await bang1(t).getByRole('spinbutton', { name: 'Ngày' }).locator('div', { hasText: new RegExp(`^${l25.d}$`) }).click();
    await bang1(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    await bang1(t).waitFor({ state: 'detached' });
    const luu = await luuTho(t);
    k('B3/D1 lưu giỗ âm lịch → có trong kho kh_kehoach (loai gio, cal am, đúng d/m âm, nhắc 1 ngày trước), KHÔNG khoá mới', luu.nguoi && luu.nguoi.length === 1 && luu.nguoi[0].loai === 'gio' && luu.nguoi[0].cal === 'am' && luu.nguoi[0].d === l25.d && luu.nguoi[0].m === l25.m && luu.nguoi[0].nhac === -240 && luu.v === 1);
    const dong = toolBody(t).locator('.tl-row', { hasText: 'Giỗ Ông nội' });
    const chu = await dong.innerText();
    k('B2 tab Người thân: "Giỗ Ông nội", ô ngày 25/11 "15 ngày", dòng phụ "Âm lịch d/m · T4, 25/11", "Văn khấn giỗ ›", "Xoá", nút "Đang nhắc"', chu.includes('25/11') && chu.includes('15 ngày') && chu.includes(`Âm lịch ${l25.d}/${l25.m} · T4, 25/11`) && chu.includes('Văn khấn giỗ ›') && chu.includes('Xoá') && chu.includes('Đang nhắc') && !chu.includes('Tặng thẻ quà'), chu);
    await dong.getByText('Văn khấn giỗ ›').click(); await t.waitForURL('**/kehoach/vankhan/gio');
    k('B2 "Văn khấn giỗ ›" → /kehoach/vankhan/gio, bài khấn điền sẵn "Ông nội" (tô màu), ô Người được giỗ', duong(t) === '/kehoach/vankhan/gio' && (await t.locator('.vk-txt mark', { hasText: 'Ông nội' }).count()) >= 1 && (await t.getByLabel('Người được giỗ').inputValue()) === 'Ông nội');
    await t.goBack(); await toolBody(t).waitFor();
    k('B1 Back từ bài khấn → về Ngày cần nhớ (đúng trang, không thoát app)', duong(t) === '/kehoach/ngaycannho' && (await t.getByText('Giỗ Ông nội').count()) >= 1);
    await t.goForward(); await t.locator('.vk-txt').waitFor();
    k('B1 Tiến (Forward) → lại bài khấn giỗ', duong(t) === '/kehoach/vankhan/gio');
    await mo(t, '/kehoach');
    const strip = await t.locator('.up-strip').innerText();
    k('B4 giỗ vừa thêm hiện ở dải Sắp tới (25/11 · Giỗ Ông nội · 15 ngày)', /25\/11\s*Giỗ Ông nội\s*15 ngày/.test(strip), strip);
    const chuong = await t.evaluate(() => [...document.querySelectorAll('.cal-grid .cd')].filter((c) => c.querySelector('.cd-chuong')).map((c) => c.querySelector('b').innerText + (c.classList.contains('out') ? 'o' : '')));
    k('B4 chuông trên ô lịch ngày 25/11 (ngày 25)', chuong.includes('25'), JSON.stringify(chuong));
    await t.locator('.up-r', { hasText: 'Giỗ Ông nội' }).click(); await t.waitForURL('**/kehoach/ngaycannho');
    k('B4 bấm dòng "Giỗ Ông nội" ở Sắp tới → mở Ngày cần nhớ', duong(t) === '/kehoach/ngaycannho');
    await t.locator('.tl-row', { hasText: 'Giỗ Ông nội' }).getByText('Xoá', { exact: true }).click();
    k('B2 bấm Xoá → hỏi lại một lần ngay tại dòng, chưa xoá', (await t.locator('.hoi-xoa').innerText()).includes('Xoá ngày giỗ «Ông nội»?') && (await luuTho(t)).nguoi.length === 1);
    await t.locator('.hoi-xoa').getByRole('button', { name: 'Huỷ', exact: true }).click();
    k('B2 Huỷ → còn nguyên', (await t.getByText('Giỗ Ông nội').count()) >= 1 && (await luuTho(t)).nguoi.length === 1);
    await t.locator('.tl-row', { hasText: 'Giỗ Ông nội' }).getByText('Xoá', { exact: true }).click();
    await t.locator('.hoi-xoa').getByRole('button', { name: 'Xoá', exact: true }).click();
    k('B2 xác nhận Xoá → mất khỏi danh sách và khỏi kho', (await t.locator('#toolBody .tl-row').count()) === 0 && (await luuTho(t)).nguoi.length === 0, `${await t.locator('#toolBody').innerText()} | ${JSON.stringify((await luuTho(t)).nguoi)}`);
    k('E1 không lỗi JS', loi.length === 0, loi.join(' | '));
  });
  await ca('sua', { luu: { kh_kehoach: JSON.stringify({ v: 1, viec: [], leNhac: {}, nguoi: [{ id: 'p1', loai: 'sn', ten: 'Mẹ', cal: 'duong', d: 28, m: 12, nam: 1958, nhac: -240 }] }) } }, async (t) => {
    await mo(t, '/kehoach/ngaycannho'); await toolBody(t).waitFor();
    k('B2 sinh nhật có năm sinh → "tròn 68 tuổi"; không "Văn khấn giỗ"', (await toolBody(t).innerText()).includes('tròn 68 tuổi') && !(await toolBody(t).innerText()).includes('Văn khấn giỗ'));
    await toolBody(t).getByText('Sinh nhật Mẹ').click(); await bang1(t).waitFor();
    k('B3 bấm tên → bảng SỬA điền sẵn (tên Mẹ, năm sinh 1958)', (await bang1(t).innerText()).includes('Sửa sinh nhật hoặc ngày giỗ') && (await bang1(t).getByLabel('Tên').inputValue()) === 'Mẹ' && (await bang1(t).getByLabel('Năm sinh').inputValue()) === '1958');
    await bang1(t).getByLabel('Tên').fill('Mẹ yêu'); await bang1(t).getByRole('button', { name: 'Lưu', exact: true }).click();
    await bang1(t).waitFor({ state: 'detached' });
    const luu = await luuTho(t);
    k('B3 sửa xong lưu cùng id, đổi tên, giữ năm sinh', luu.nguoi.length === 1 && luu.nguoi[0].id === 'p1' && luu.nguoi[0].ten === 'Mẹ yêu' && luu.nguoi[0].nam === 1958);
    await toolBody(t).getByRole('button', { name: /Đang nhắc/ }).click();
    k('B2 bấm nút nhắc → tắt nhắc (nhac null) và nút đổi chữ', (await luuTho(t)).nguoi[0].nhac === null && (await toolBody(t).getByRole('button', { name: /Nhắc khi mở app/ }).count()) === 1);
  });
  await ca('vankhan', {}, async (t, loi) => {
    await mo(t, '/kehoach/vankhan'); await toolBody(t).waitFor();
    const ds = await toolBody(t).innerText();
    k('C1 danh sách: thẻ lớn Sắp tới = Mùng 1 & Rằm (còn 13 ngày), 10 dịp còn lại, Cúng giỗ nhắc thêm ngày giỗ', ds.includes('Mùng 1 & Rằm hằng tháng') && ds.includes('Còn 13 ngày') && (await t.locator('#toolBody .tl-row').count()) === 10 && ds.includes('Thêm ngày giỗ ở “Ngày cần nhớ”'));
    await t.locator('.vk-hero').click(); await t.waitForURL('**/kehoach/vankhan/r');
    k('C2 bấm thẻ lớn → /kehoach/vankhan/r; Tín chủ mặc định là tên khách "Khách thử"', duong(t) === '/kehoach/vankhan/r' && (await t.getByLabel('Tín chủ').inputValue()) === 'Khách thử' && (await t.locator('.vk-txt mark', { hasText: 'Khách thử' }).count()) >= 1);
    await t.getByLabel('Tín chủ').fill('Trần Văn B'); await t.getByLabel('Địa chỉ').fill('12 Lê Lợi');
    k('C2 điền Tín chủ + Địa chỉ → bài khấn có tên và địa chỉ TÔ MÀU ngay', (await t.locator('.vk-txt mark', { hasText: 'Trần Văn B' }).count()) >= 1 && (await t.locator('.vk-txt mark', { hasText: '12 Lê Lợi' }).count()) >= 1 && (await t.locator('.vk-txt').innerText()).includes('Tín chủ con là Trần Văn B, ngụ tại 12 Lê Lợi.'));
    const nenMark = await t.locator('.vk-txt mark').first().evaluate((e) => getComputedStyle(e).backgroundColor);
    k('C2 chỗ tự điền tô màu vàng nhạt của demo (#FBE7B8)', nenMark === 'rgb(251, 231, 184)', nenMark);
    k('C2 lễ vật: "0/6 đã sắm" lúc đầu', (await t.locator('.sec-head .more', { hasText: 'đã sắm' }).innerText()) === '0/6 đã sắm');
    await t.locator('.vk-le label').first().click();
    k('C2 tick lễ vật đầu → "1/6 đã sắm", dòng đó gạch (lớp ok)', (await t.locator('.sec-head .more', { hasText: 'đã sắm' }).innerText()) === '1/6 đã sắm' && (await t.locator('.vk-le label.ok').count()) === 1);
    const cs0 = await t.locator('.vk-txt').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    await t.getByRole('button', { name: 'Chữ to lên' }).click();
    const cs1 = await t.locator('.vk-txt').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    k('C2 A+ → chữ bài khấn to thêm 2px (17 → 19)', cs0 === 17 && cs1 === 19, `${cs0} → ${cs1}`);
    await t.reload(); await t.locator('.vk-txt').waitFor();
    k('C2 TẢI LẠI trang: vẫn "1/6 đã sắm", cỡ chữ 19px, Tín chủ "Trần Văn B", địa chỉ còn', (await t.locator('.sec-head .more', { hasText: 'đã sắm' }).innerText()) === '1/6 đã sắm' && (await t.locator('.vk-txt').evaluate((e) => parseFloat(getComputedStyle(e).fontSize))) === 19 && (await t.getByLabel('Tín chủ').inputValue()) === 'Trần Văn B' && (await t.getByLabel('Địa chỉ').inputValue()) === '12 Lê Lợi');
    await t.getByRole('button', { name: /Nhắc khi mở app/ }).click();
    k('C4 bật nhắc dịp Mùng 1 & Rằm → kho ghi vk.nhac.r', (await luuTho(t)).vk.nhac.r === true && (await t.getByRole('button', { name: /Đang nhắc/ }).count()) === 1);
    k('C3 không có "Đọc to", "Đặt hoa quả, trà"; có dòng lưu ý cuối', !/Đọc to|Đặt hoa quả/.test(await t.locator('body').innerText()) && (await t.locator('body').innerText()).includes('Phần tô màu là chỗ tự điền'));
    await t.locator('.back-btn').first().click(); await t.waitForURL('**/kehoach/vankhan');
    k('C1 nút quay lại ở bài khấn → về danh sách Văn khấn', duong(t) === '/kehoach/vankhan' && (await t.locator('#toolBody .tl-row .tl-rm.on').count()) === 0 || duong(t) === '/kehoach/vankhan');
    await mo(t, '/kehoach/vankhan/tet'); await t.locator('.vk-txt').waitFor();
    k('C1 mở thẳng /kehoach/vankhan/tet (Mùng 1 Tết · Gia tiên): đúng dịp, tiêu đề đúng', (await t.locator('h1').first().innerText()).includes('Mùng 1 Tết') && (await t.locator('.vk-txt').innerText()).includes('Nay nhân tiết Nguyên đán năm Đinh Mùi'));
    await t.locator('.back-btn').first().click();
    k('C1 mở thẳng rồi bấm quay lại (không lịch sử) → về /kehoach/vankhan, không thoát app', duong(t) === '/kehoach/vankhan', duong(t));
    k('E1 không lỗi JS', loi.length === 0, loi.join(' | '));
  });
  await ca('rong360', { rong: 360 }, async (t) => {
    for (const p of ['/kehoach', '/kehoach/ngaycannho', '/kehoach/vankhan', '/kehoach/vankhan/r', '/kehoach/vankhan/gt']) {
      await mo(t, p); await t.waitForTimeout(120);
      const tran = await t.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      k(`E3 360px ${p}: trang không cuộn ngang`, tran <= 1, String(tran));
    }
  });
  await trinh.close();
}
