#!/usr/bin/env node
// THỬ KH-UI-5a — Trắc nghiệm thể trạng theo demo: dữ liệu chép nguyên, cách tính, lịch âm / tiết khí, ghép món, lưu / xoá kết quả trên máy,
// đường dẫn, ô Trắc nghiệm ở Trang chủ (khoá khi chưa đăng nhập), khẩu hiệu màn mở, màn hình dựng thật bằng esbuild + react-dom/server.
// Bảng đối chứng `thu_KHUI5a_mau.json` do CHÍNH HÀM CỦA DEMO sinh ra (chạy demo trong Chromium) — lệch một số là đỏ.
// Không mạng, không trình duyệt. Chạy: node cong_cu/thu_KHUI5a.js → dòng cuối "n đạt · m hỏng".
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
const json = (f) => JSON.parse(doc(f));
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sapXep = (a) => a.slice().sort();

// Dựng một module / thành phần của app thành CommonJS (kèm React, JSON) để chạy trong Node.
function dung(tep, xuat) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: xuat, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', write: false, logLevel: 'silent', loader: { '.json': 'json' },
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: tep }).runInThisContext()(m, m.exports, require);
  return m.exports;
}
const thanhPhan = (tep) => dung(tep, `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import T from './${tep}'; export const ve = (props, con) => renderToStaticMarkup(React.createElement(T, props, con));`).ve;

// Lấy một hằng của demo bằng tên (chuỗi chữ khai báo `const TEN = …;`), đọc bằng vm — không chạy phần còn lại của demo.
const demoHtml = doc('thiet_ke/app_kh_demo.html');
function hangDemo(ten) {
  const dau = demoHtml.indexOf(`const ${ten} = `);
  if (dau < 0) throw new Error('demo không có ' + ten);
  const bd = dau + `const ${ten} = `.length;
  const mo = demoHtml[bd], dong = mo === '{' ? '}' : ']';
  let d = 0, ch = null;
  for (let j = bd; j < demoHtml.length; j++) {
    const c = demoHtml[j];
    if (ch) { if (c === '\\') j++; else if (c === ch) ch = null; continue; }
    if (c === '"' || c === "'" || c === '`') ch = c; else if (c === mo) d++; else if (c === dong && --d === 0) return vm.runInNewContext('(' + demoHtml.slice(bd, j + 1) + ')');
  }
  throw new Error('không đọc được ' + ten);
}

(async () => {
  const tn = await nap('src/tracNghiem.js');
  const lich = await nap('src/lich.js');
  const luu = await nap('src/tracNghiemLuu.js');
  const mau = json('cong_cu/thu_KHUI5a_mau.json');
  const DL = json('src/noiDung/tracNghiem.json');
  const MENU = json('src/noiDung/tracNghiemMenu.json');
  const chat = dung('theChat.js', "export * from './noiDung/theChat.js';");

  console.log('— A1 dữ liệu chép NGUYÊN từ demo');
  k('tracNghiem.json = TQDQ của demo (chuẩn hoá JSON, từng byte)', JSON.stringify(DL) === JSON.stringify(hangDemo('TQDQ')));
  k('bộ câu hỏi: 62 câu gốc, lọc theo giới tính còn 60', DL.questions.length === 62 && tn.locCau(DL, 'nam').length === 60 && tn.locCau(DL, 'nu').length === 60);
  k('tracNghiemMenu.json = TQD_MENU + TQD_SAFE_MENU của demo', JSON.stringify(MENU.nhom) === JSON.stringify(hangDemo('TQD_MENU')) && JSON.stringify(MENU.anToan) === JSON.stringify(hangDemo('TQD_SAFE_MENU')));
  k('đặc điểm 9 thể trạng = TRAITS của demo', JSON.stringify(chat.TRAITS) === JSON.stringify(hangDemo('TRAITS')));
  k('từ khoá ghép món = PROD_KEY của demo', JSON.stringify(chat.TU_KHOA_MON) === JSON.stringify(hangDemo('PROD_KEY')));
  const GK = hangDemo('GK'), VIS = hangDemo('VIS');
  k('9 thể trạng: tên, chữ Hán, màu, biểu tượng đúng VIS + dữ liệu của demo', Object.keys(GK).length === 9 && Object.keys(GK).every((a) => {
    const t = chat.THE_CHAT[a], v = VIS[GK[a]];
    return t && t.han === v[2] && t.mau === v[1] && t.anh === `/anh/the-chat-${v[0]}.svg` && t.ten === DL.groups[a].name && t.phai === DL.groups[a].phai;
  }));
  k('thứ tự hiện 9 thể trạng như demo (Bình hòa trước)', bang(chat.THU_TU_NHOM, Object.keys(GK)));
  const bieuTuong = [...Object.values(VIS).map((v) => v[0]), 'scale', 'seal'];
  k('11 biểu tượng tách ra public/anh/the-chat-*.svg đúng nội dung symbol của demo (không base64 trong src/)', bieuTuong.every((ten) => {
    const f = `public/anh/the-chat-${ten}.svg`;
    const sym = new RegExp(`<symbol id="p-${ten}"[^>]*>([\\s\\S]*?)</symbol>`).exec(demoHtml);
    return fs.existsSync(path.join(GOC, f)) && sym && doc(f).includes(sym[1]);
  }));
  k('file SVG tự đủ (gradient dùng tới có trong file) và không lệ thuộc trang', bieuTuong.every((ten) => {
    const s = doc(`public/anh/the-chat-${ten}.svg`);
    return [...s.matchAll(/url\(#([^)]+)\)/g)].every((m) => new RegExp(`id="${m[1]}"`).test(s));
  }));
  k('src/ không có dữ liệu base64', !/data:image/.test(['src/noiDung/theChat.js', 'src/tracNghiem.js', 'src/lich.js'].map(doc).join('')));

  console.log('— A2/A3 cách tính — đối chiếu CHÍNH HÀM DEMO');
  const dsMenu = mau.menu;
  const tenMon = (a) => a.map((m) => m.ten);
  const gioCa = (c) => `${c.homNay.y}-${String(c.homNay.m).padStart(2, '0')}-${String(c.homNay.d).padStart(2, '0')} 12:00:00`;
  k(`bảng đối chiếu có ≥ 12 bộ câu trả lời (có ${mau.tracNghiem.length})`, mau.tracNghiem.length >= 12);
  const loai = new Set(mau.tracNghiem.map((c) => c.kind));
  k('bảng phủ: xu hướng rõ, thiên hướng, Bình hòa, chưa rõ', ['main', 'tend', 'binh', 'none'].every((x) => loai.has(x)));
  k('bảng phủ: xung đột, ≥ 3 thể, loại nhóm theo nóng / lạnh, Bình hòa cơ bản, tình trạng đặc biệt, nam + nữ', mau.tracNghiem.some((c) => c.conflict) && mau.tracNghiem.some((c) => c.many)
    && mau.tracNghiem.some((c) => c.dropped.length) && mau.tracNghiem.some((c) => c.bhOk === 'cơ bản có') && mau.tracNghiem.some((c) => c.goiY.an)
    && mau.tracNghiem.some((c) => c.sex === 'nam') && mau.tracNghiem.some((c) => c.sex === 'nu'));
  for (const c of mau.tracNghiem) {
    const ds = tn.locCau(DL, c.sex);
    const cd = tn.chamDiem(DL, ds, c.ans);
    k(`[${c.ten}] điểm quy đổi + điểm gốc`, ds.length === c.soCau && Object.keys(c.diem).every((g) => cd.t[g] === c.diem[g] && cd.raw[g] === c.raw[g] && cd.n[g] === c.n[g]));
    const kl = tn.ketLuan(DL, cd.t, { gioiTinh: c.sex, khiHau: c.climate, anToan: c.safety });
    k(`[${c.ten}] kết luận: loại ${c.kind}, nhóm ${c.picks.join('+')}`,
      kl.kind === c.kind && bang(kl.picks, c.picks) && bang(kl.ranked, c.ranked) && bang(kl.main, c.main) && bang(kl.tend, c.tend) && bang(kl.muc, c.muc)
      && kl.bhLevel === c.bhLevel && kl.bhOk === c.bhOk && kl.conflict === c.conflict && kl.many === c.many && bang(kl.dropped, c.dropped)
      && bang(kl.mainOk, c.mainOk) && bang(kl.tendOk, c.tendOk), JSON.stringify({ kind: kl.kind, picks: kl.picks }));
    const gy = tn.goiYMon(DL, MENU, chat.TU_KHOA_MON, kl, dsMenu, gioCa(c));
    k(`[${c.ten}] gợi ý: nên / tránh bằng chữ + món của quán`, bang(gy.nen, c.goiY.nen) && bang(gy.tranh, c.goiY.tranh) && gy.an === c.goiY.an
      && bang(tenMon(gy.mon), c.goiY.mon), JSON.stringify({ mon: tenMon(gy.mon), mau: c.goiY.mon }));
    k(`[${c.ten}] dấu hiệu của chính khách`, c.picks.filter((g) => g !== 'bh').every((g) => bang(tn.dauHieuRieng(ds, c.ans, g), c.dauHieu[g])));
  }

  console.log('— A4 lịch âm / tiết khí — đối chiếu CHÍNH HÀM DEMO');
  k(`bảng lịch có ≥ 10 ngày (có ${mau.lich.length}), gồm Tết, tháng nhuận, ranh tiết khí`, mau.lich.length >= 10 && mau.lich.some((x) => x.am.nhuan) && mau.lich.some((x) => x.tiet.startsToday) && mau.lich.some((x) => x.am.d === 1 && x.am.m === 1));
  const L = lich.LUNAR;
  for (const x of mau.lich) {
    const jd = L.jdFromDate(x.d, x.m, x.y), al = L.solar2lunar(x.d, x.m, x.y), tm = L.term(jd);
    k(`${x.d}/${x.m}/${x.y}: âm ${x.am.d}/${x.am.m}${x.am.nhuan ? ' nhuận' : ''}, tiết ${x.tiet.name}`,
      jd === x.jd && al.d === x.am.d && al.m === x.am.m && al.y === x.am.y && al.leap === x.am.nhuan && al.jd === x.am.jd
      && bang(tm, x.tiet) && L.yearName(al.y) === x.nam && L.monthName(al.m, al.y) === x.thang && L.dayName(al.jd) === x.ngay && bang(L.jdToDate(jd), x.ve));
  }
  k('TERM_TIPS = của demo (24 tiết, mỗi tiết lời + 2 món)', bang(lich.TERM_TIPS, hangDemo('TERM_TIPS')) && lich.TERM_TIPS.length === 24);
  k('"hôm nay" theo giờ VN: 03:00 sáng 20/3 giờ VN (= 20:00 ngày 19/3 UTC) vẫn là ngày 20/3', (() => {
    const m = require(path.join(GOC, 'cong_cu/thu_KHUI5a_mau.json')).lich.find((x) => x.d === 20 && x.m === 3 && x.y === 2026);
    return lich.tietKhiNgay('2026-03-20 03:00:00').idx === m.tiet.idx && lich.tietKhiNgay('2026-03-20T03:00:00').startJd === m.tiet.startJd;
  })());
  k('tietKhiNgay: chuỗi lạ / rỗng → null (không bịa)', lich.tietKhiNgay('') === null && lich.tietKhiNgay(undefined) === null && lich.tietKhiNgay('hôm nay') === null);
  const mk = await nap('src/menuLuu.js');
  k('giờ VN lấy từ gioVn (UTC+7), không theo múi giờ máy: 19/3 20:00 UTC → 20/3', mk.gioVn(new Date('2026-03-19T20:00:00Z')).startsWith('2026-03-20 03:00'));
  const tepMoi = ['src/tracNghiem.js', 'src/tracNghiemLuu.js', 'src/lich.js'].filter((f) => fs.existsSync(path.join(GOC, f)));
  k('hàm thuần không đọc đồng hồ / múi giờ máy (không new Date, toLocale, Date.now)', tepMoi.length === 3 && tepMoi.every((f) => !/new Date\(|toLocale|Date\.now|getTimezoneOffset/.test(doc(f))));

  console.log('— B4 ghép tên món với menu POS');
  const pos = (ma, ten, ex = {}) => ({ ma, ten, nhom: 'Trà', gia: 1000, ...ex });
  const g = (dsM, dong) => tenMon(tn.ghepMon(dsM, dong, chat.TU_KHOA_MON));
  k('không dấu / chữ hoa vẫn ghép: "TRA PHO NHI" ↔ dòng "Trà Phổ Nhĩ, uống nóng"', bang(g([pos('a', 'TRA PHO NHI')], ['Trà Phổ Nhĩ, uống nóng']), ['TRA PHO NHI']));
  k('món không có trong menu thì không hiện (menu rỗng / thiếu)', bang(g([], ['Trà Phổ Nhĩ, uống nóng']), []) && bang(g(null, ['Trà Phổ Nhĩ']), []) && bang(g([pos('a', 'Trà Đào')], ['Trà Phổ Nhĩ']), []));
  k('món đang hết (con_hang === false) không hiện; null / true vẫn hiện', bang(g([pos('a', 'Trà Phổ Nhĩ', { con_hang: false }), pos('b', 'Trà Phổ Nhĩ 2', { con_hang: null }), pos('c', 'Trà Phổ Nhĩ 3', { con_hang: true })], ['Trà Phổ Nhĩ']), ['Trà Phổ Nhĩ 2', 'Trà Phổ Nhĩ 3']));
  k('"Thạch dưỡng nhan" không bị nhầm là Trà Dưỡng Nhan (dòng lẫn món)', bang(g([pos('a', 'Thạch Dưỡng Nhan'), pos('b', 'Trà Dưỡng Nhan')], ['Trà Dưỡng Nhan']), ['Trà Dưỡng Nhan']) && bang(g([pos('b', 'Trà Dưỡng Nhan')], ['Thạch dưỡng nhan']), []));
  k('combo không được coi là món đơn mà dữ liệu nêu', bang(g([pos('a', 'Combo Dưỡng Nhan'), pos('b', 'Trà Dưỡng Nhan')], ['Trà Dưỡng Nhan']), ['Trà Dưỡng Nhan']));
  k('giữ thứ tự menu; từ khoá "cà phê" ghép đủ mọi món cà phê', bang(g([pos('1', 'Cà phê Đen'), pos('2', 'Trà Lục Bảo'), pos('3', 'Cà phê Nâu')], ['Cà phê đậm', 'Trà Lục Bảo']), ['Cà phê Đen', 'Trà Lục Bảo', 'Cà phê Nâu']));
  const klBH = tn.ketLuan(DL, { bh: 100, kh: 0, dh: 0, ah: 0, dt: 0, tn: 0, hu: 0, ku: 0, db: 0 }, { gioiTinh: 'nam', khiHau: 'deu', anToan: [] });
  k('không lấy được menu: vẫn có chữ nên / tránh, KHÔNG món giả', (() => { const r = tn.goiYMon(DL, MENU, chat.TU_KHOA_MON, klBH, null, '2026-10-29 10:00:00'); return r.mon.length === 0 && r.nen.length > 0; })());
  k('Bình hòa mà menu không có món hợp tiết → không bịa món', tn.goiYMon(DL, MENU, chat.TU_KHOA_MON, klBH, [pos('z', 'Món lạ')], '2026-10-29 10:00:00').mon.length === 0);

  console.log('— C1/C2 lưu / xoá kết quả trên máy');
  const kho = () => { const d = {}; return { d, getItem: (x) => (x in d ? d[x] : null), setItem: (x, v) => { d[x] = String(v); }, removeItem: (x) => { delete d[x]; } }; };
  const c0 = mau.tracNghiem.find((c) => c.kind === 'main' && c.safety.length === 0 && c.climate !== 'deu') || mau.tracNghiem[1];
  const kl0 = tn.ketLuan(DL, c0.diem, { gioiTinh: c0.sex, khiHau: c0.climate, anToan: c0.safety });
  const ban = luu.rutGon(kl0, '2026-10-29 08:15:00');
  const k1 = kho();
  k('ghi → đọc lại đủ: giới tính, ngày giờ VN, điểm 9 nhóm, khí hậu, tình trạng đặc biệt', luu.ghiKetQua(ban, k1) && (() => { const r = luu.docKetQua(DL, k1); return r && r.gioiTinh === c0.sex && r.ngay === '2026-10-29 08:15:00' && bang(r.diem, c0.diem) && r.khiHau === c0.climate; })());
  k('khoá lưu đúng tên kh_tracnghiem; nhóm chính / phụ có trong bản lưu', Object.keys(k1.d).join() === 'kh_tracnghiem' && JSON.parse(k1.d.kh_tracnghiem).chinh === kl0.picks[0] && 'phu' in JSON.parse(k1.d.kh_tracnghiem));
  k('KHÔNG lưu từng câu trả lời: bản lưu không có ans / traLoi / danh sách câu, chỉ các trường đã định', bang(Object.keys(JSON.parse(k1.d.kh_tracnghiem)).sort(), ['anToan', 'chinh', 'diem', 'gioiTinh', 'khiHau', 'ngay', 'phu']) && !/ans|traLoi|questions|Tôi /.test(k1.d.kh_tracnghiem));
  const c1 = mau.tracNghiem.find((c) => c.safety.length) ;
  const k2 = kho(); luu.ghiKetQua(luu.rutGon(tn.ketLuan(DL, c1.diem, { gioiTinh: c1.sex, khiHau: c1.climate, anToan: c1.safety }), '2026-10-29 09:00:00'), k2);
  k('tình trạng đặc biệt đọc lại đúng (để mở lại vẫn ra gợi ý an toàn)', bang(luu.docKetQua(DL, k2).anToan, c1.safety));
  k('"Xoá kết quả" xoá sạch khoá', (() => { luu.xoaKetQua(k1); return !('kh_tracnghiem' in k1.d) && luu.docKetQua(DL, k1) === null; })());
  const hong_ = (v) => { const h = kho(); h.d.kh_tracnghiem = typeof v === 'string' ? v : JSON.stringify(v); return luu.docKetQua(DL, h); };
  const tot = JSON.parse(JSON.stringify(ban));
  k('bản lưu hỏng / sai dạng bị bỏ (không ném): JSON hỏng, thiếu điểm, điểm ngoài 0–100, giới tính lạ, ngày lạ', hong_('{hỏng') === null && hong_({ ...tot, diem: { bh: 1 } }) === null
    && hong_({ ...tot, diem: { ...tot.diem, kh: 120 } }) === null && hong_({ ...tot, gioiTinh: 'x' }) === null && hong_({ ...tot, ngay: 'hôm qua' }) === null && hong_(null) === null && hong_('"abc"') === null);
  k('tình trạng đặc biệt lạ (không có trong danh sách giới đó) bị lọc', bang(hong_({ ...tot, anToan: ['<img onerror=x>', DL.safetyChecklist[tot.gioiTinh][0]] }).anToan, [DL.safetyChecklist[tot.gioiTinh][0]]));
  const chan = { getItem() { throw new Error('chặn'); }, setItem() { throw new Error('chặn'); }, removeItem() { throw new Error('chặn'); } };
  k('kho bị chặn (cửa sổ riêng tư): ghi trả false, đọc null, xoá không ném', luu.ghiKetQua(ban, chan) === false && luu.docKetQua(DL, chan) === null && (luu.xoaKetQua(chan), true));
  const tepGoi = ['src/api.js'];
  k('không gửi gì về máy chủ: api.js không có cửa trắc nghiệm; mã trắc nghiệm không gọi mạng', !/tracnghiem|trac-nghiem|the-chat|thechat/i.test(doc('src/api.js'))
    && ['src/tracNghiem.js', 'src/tracNghiemLuu.js', 'src/lich.js', 'src/dungTracNghiem.js'].filter((f) => fs.existsSync(path.join(GOC, f))).every((f) => !/fetch\(|XMLHttpRequest|sendBeacon|api\.js|console\./.test(doc(f))));

  console.log('— B5 đường dẫn');
  const dd = await nap('src/duongDan.js');
  const ra = (p) => dd.docDuongDan(p);
  k('/tracnghiem, /tracnghiem/lam, /tracnghiem/ketqua: trang thật, cần đăng nhập, không giữ chỗ, chuẩn hoá đúng', [['/tracnghiem', 'tracnghiem'], ['/tracnghiem/lam', 'tracnghiemlam'], ['/tracnghiem/ketqua', 'tracnghiemketqua']]
    .every(([p, t]) => ra(p).trang === t && ra(p).canDN === true && ra(p).giuCho === false && ra(p).chuan === p && dd.taoDuongDan(t) === p && dd.trangCanDangNhap(t)));
  k('chữ hoa / "/" thừa vẫn ra đúng: /TracNghiem/Lam/ → /tracnghiem/lam', ra('/TracNghiem/Lam/').chuan === '/tracnghiem/lam');
  k('nút quay lại: /lam về /tracnghiem; /tracnghiem và /ketqua về Trang chủ', ra('/tracnghiem/lam').cha === '/tracnghiem' && ra('/tracnghiem').cha === '/trangchu' && ra('/tracnghiem/ketqua').cha === '/trangchu');
  k('/kehoach vẫn chỉ giữ chỗ (việc KH-UI-5b)', ra('/kehoach').giuCho === true);
  k('tiêu đề tab: "Trắc nghiệm · Tứ Quý Đường", "Kết quả thể trạng · Tứ Quý Đường"', dd.tieuDeTrang('tracnghiem') === 'Trắc nghiệm · Tứ Quý Đường' && dd.tieuDeTrang('tracnghiemketqua') === 'Kết quả thể trạng · Tứ Quý Đường');
  k('chưa đăng nhập vào /tracnghiem/lam → /dangnhap?tiep=/tracnghiem/lam', dd.taoDuongDan('dangnhap', { tiep: '/tracnghiem/lam' }) === '/dangnhap?tiep=%2Ftracnghiem%2Flam');

  console.log('— B5 ô Trắc nghiệm ở Trang chủ (khoá khi chưa đăng nhập) + Tài khoản + màn mở');
  const nho = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, ' ').trim();
  const vb = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, ' ').trim(); // như textContent của trình duyệt (so với bảng lấy từ demo)
  const ve = (tep) => thanhPhan(tep);
  const O = ve('components/OTracNghiem.jsx');
  const khachO = O({ dangNhap: false, klLuu: null, mo() {}, moDangNhap() {} });
  const hoiVienO = O({ dangNhap: true, klLuu: null, mo() {}, moDangNhap() {} });
  k('khách chưa đăng nhập: ô MỜ + dòng khoá "Đăng nhập để mở khoá chức năng" thay dòng phụ (KH-UI-3c, không viên nổi, không inert)', /hb-mo/.test(khachO) && /Đăng nhập để mở khoá chức năng/.test(khachO) && !/khoa-nhan|inert/.test(khachO) && !/Bạn thuộc thể chất nào\?/.test(khachO));
  k('đã đăng nhập: ô thường (không khoá), đúng chữ demo "Trắc nghiệm · Bạn thuộc thể chất nào?"', !/khoa-tien-ich/.test(hoiVienO) && /hb-tile hb-t-quiz/.test(hoiVienO) && nho(hoiVienO) === 'Trắc nghiệm Bạn thuộc thể chất nào?');
  const kl_ = (c) => tn.ketLuan(DL, c.diem, { gioiTinh: c.sex, khiHau: c.climate, anToan: c.safety });
  const klKhi = kl_(mau.tracNghiem.find((c) => c.picks[0] === 'kh' && c.kind === 'main'));
  k('đã có kết quả lưu: ô đổi thành "Thể trạng · <tên> · Xem kết quả ›"', nho(O({ dangNhap: true, klLuu: klKhi, mo() {}, moDangNhap() {} })) === 'Thể trạng Khí hư Xem kết quả ›');
  const tc = doc('src/pages/TrangChu.jsx');
  k('Trang chủ: ô nằm trong khối Hôm nay (.hb-one > .hb-tiles), bọc KhoaTienIch qua OTracNghiem', /<div className="hb-tiles"><OGioVang mo=\{moGioVang\} \/><OTracNghiem /.test(tc) && /OTracNghiem dangNhap=\{dangNhap\}/.test(tc) && /DongKhoa/.test(doc('src/components/OTracNghiem.jsx')));
  const tk = doc('src/pages/TaiKhoan.jsx'), chu = doc('src/noiDung/tracNghiemChu.js');
  k('Tài khoản: nhóm "Sức khỏe" nằm giữa "Của tôi" và "Cài đặt", dòng "Thể trạng của tôi"', /DONG_TAI_KHOAN = \{ ten: 'Thể trạng của tôi'.*nhom: 'Sức khỏe'/.test(chu)
    && tk.indexOf('Của tôi') < tk.indexOf('DONG_TAI_KHOAN.nhom') && tk.indexOf('DONG_TAI_KHOAN.nhom') < tk.indexOf('>Cài đặt<') && /moTracNghiem/.test(tk));
  const manDau = ve('components/ManDau.jsx')({});
  k('S1: màn mở ghi "Đông Y Dưỡng Thể" dưới TỨ QUÝ ĐƯỜNG, không còn "Sức khỏe mỗi ngày" ở màn mở', /<div class="e3-tg khau-hieu">Đông Y Dưỡng Thể<\/div>/.test(manDau) && !/Sức khỏe mỗi ngày/.test(manDau));
  k('S1: chữ đặt ở một chỗ (noiDung/thuongHieu.js); Trang chủ cũng lấy KHAU_HIEU, không còn "Sức khỏe mỗi ngày" (KH-SLOGAN-1)', doc('src/noiDung/thuongHieu.js').includes("KHAU_HIEU = 'Đông Y Dưỡng Thể'") && /Tứ Quý Đường — \{KHAU_HIEU\}/.test(tc) && !/Sức khỏe mỗi ngày/.test(tc));

  console.log('— B1/B2 màn giới thiệu và màn câu hỏi (dựng thật)');
  const TNg = ve('pages/TracNghiem.jsx'), TNl = ve('pages/TracNghiemLam.jsx'), TNk = ve('pages/TracNghiemKetQua.jsx');
  const ds_nam = tn.locCau(DL, 'nam');
  const gioiThieu = (o) => TNg({ tn: { luu: null, klLuu: null, gioiTinh: null, ...o }, lui() {}, vaoLam() {}, moKetQua() {} });
  const gt0 = gioiThieu({});
  const t0 = nho(gt0);
  k('giới thiệu: đủ chữ demo (tiêu đề, 60 câu · 7–8 phút, cơ sở lý luận, Nam / Nữ, Bắt đầu, cam kết riêng tư)', ['Trắc nghiệm thể trạng', 'Tư vấn dưỡng sinh theo 9 thể chất', 'Phiếu trắc nghiệm thể trạng', '60 câu', 'khoảng 7–8 phút', 'có kết quả ngay', 'Cơ sở lý luận', 'Quốc y đại sư Vương Kỳ', 'Bước 1 Bạn là', 'Nam giới', 'Bộ câu hỏi dành cho nam', 'Nữ giới', 'Bộ câu hỏi dành cho nữ', 'Bắt đầu làm bài', 'Thông tin bạn cung cấp chỉ dùng để gợi ý thức uống phù hợp và không được dùng vào mục đích khác.', '9 thể chất'].every((x) => t0.includes(x)));
  k('giới thiệu: chưa chọn giới tính → nút Bắt đầu mờ (btn-disabled), chưa có thẻ "Kết quả đã lưu"', /checkout-btn btn-disabled/.test(gt0) && !/tc-prev/.test(gt0));
  k('giới thiệu: chọn Nam → nút Nam sáng (on), nút Bắt đầu hết mờ', (() => { const h = gioiThieu({ gioiTinh: 'nam' }); return /class="sex on"[^>]*aria-pressed="true"/.test(h) && !/checkout-btn btn-disabled/.test(h); })());
  k('giới thiệu: 9 thể chất đủ tên + chữ Hán, thứ tự Bình hòa trước; ảnh là file /anh/the-chat-*.svg', (() => { const ts = [...gt0.matchAll(/<div class="tc-type">([\s\S]*?)<\/div>/g)].map((m) => nho(m[1])); return ts.length === 9 && ts[0] === 'Bình hòa 平和' && ts[8] === 'Đặc bẩm 特稟' && (gt0.match(/src="\/anh\/the-chat-[a-z]+\.svg"/g) || []).length >= 11; })());
  const luuMau = { gioiTinh: 'nu', ngay: '2026-10-29 08:15:00', diem: mau.tracNghiem[1].diem, khiHau: 'deu', anToan: [] };
  const gtLuu = nho(gioiThieu({ luu: luuMau, klLuu: klKhi, gioiTinh: 'nu' }));
  k('giới thiệu: có kết quả lưu → thẻ "Kết quả đã lưu · 29/10/2026" + tên thể trạng + chữ Hán', gtLuu.includes('Kết quả đã lưu · 29/10/2026') && gtLuu.includes('Thể trạng Khí hư 氣虛'));
  const bai = (o) => ({ gioiTinh: 'nam', ds: ds_nam, tra: ds_nam.map(() => null), i: 0, cuoi: false, khiHau: 'deu', anToan: [], ...o });
  const quiz = (b) => TNl({ tn: { bai: b }, thoat() {}, xemKetQua() {} });
  const lam1 = quiz(bai({}));
  k('câu hỏi: tiêu đề "Câu 1/60", thanh tiến độ, câu thứ nhất, 4 mức A–D đúng chữ, dòng nhắc cuối', (() => { const t = nho(lam1); const q = ds_nam[0]; return t.includes('Câu 1/60') && t.includes(q.text) && t.includes('Trong 3 tháng gần đây') && q.options.every((o) => t.includes(`${o.label} ${o.text}`)) && t.includes('Chọn mô tả giống bạn nhất trong 3 tháng gần đây. Không có đúng sai.') && /class="tcq-bar"/.test(lam1) && (lam1.match(/class="tc-opt abcd/g) || []).length === 4; })());
  k('câu hỏi: đã chọn mức → nút sáng (on); câu giữa hiện đúng số câu và tiến độ %', (() => { const h = quiz(bai({ i: 29, tra: ds_nam.map((_, j) => (j === 29 ? 4 : null)) })); return h.includes('Câu 30/60') && /style="width:48%"/.test(h) && (h.match(/tc-opt abcd on/g) || []).length === 1; })());
  k('câu riêng cho nữ có nhãn "Dành cho nữ"; câu riêng cho nam có "Dành cho nam"', (() => {
    const dsNu = tn.locCau(DL, 'nu');
    const h = quiz(bai({ gioiTinh: 'nu', ds: dsNu, tra: dsNu.map(() => null), i: dsNu.findIndex((q) => q.only === 'nu') }));
    const hn = quiz(bai({ i: ds_nam.findIndex((q) => q.only === 'nam') }));
    return /tag-sex">Dành cho nữ</.test(h) && /tag-sex">Dành cho nam</.test(hn) && !ds_nam.some((q) => q.only === 'nu');
  })());
  const cuoiNu = nho(quiz(bai({ gioiTinh: 'nu', cuoi: true, khiHau: 'lanh', anToan: [DL.safetyChecklist.nu[0]] })));
  const cuoiNamH = quiz(bai({ cuoi: true }));
  k('hai câu cuối: kiểm tra chéo nóng / lạnh (3 lựa chọn) + câu an toàn + nút Xem kết quả', ['Hai câu cuối', 'Kiểm tra chéo · không tính điểm', 'Bạn chịu lạnh hay chịu nóng tốt hơn?', 'Chịu nóng tốt hơn, sợ lạnh', 'Chịu lạnh tốt hơn, sợ nóng', 'Như nhau, không rõ bên nào hơn', 'Câu an toàn', 'Bạn có đang ở tình trạng nào dưới đây không?', 'Xem kết quả'].every((x) => cuoiNu.includes(x)));
  k('checklist tình trạng đặc biệt theo giới: nữ đủ ô (có "Đang mang thai"), nam 4 ô (không có thai); ô đã chọn có dấu ✓', DL.safetyChecklist.nu.every((x) => cuoiNu.includes(x)) && cuoiNu.includes('✓ Đang mang thai') && (cuoiNamH.match(/chkopt/g) || []).length === 4 && !/mang thai/.test(cuoiNamH));
  k('hai câu cuối: thanh tiến độ 100%, đúng ô "sợ lạnh" đang chọn', (() => { const h = quiz(bai({ cuoi: true, khiHau: 'lanh' })); return /style="width:100%"/.test(h) && /tc-opt on" aria-pressed="true"><i class="rd"><\/i>Chịu nóng tốt hơn, sợ lạnh/.test(h); })());
  k('không có bài đang làm → màn câu hỏi không dựng gì (App đưa về /tracnghiem)', quiz(null) === '');
  k('thoát giữa chừng: quay lại ở câu đầu mà đã có câu trả lời → hỏi xác nhận (đọc nguồn)', /Thoát bài trắc nghiệm\?/.test(chu) && /b\.tra\.some\(\(x\) => x !== null\)\) datHoi\(true\)/.test(doc('src/pages/TracNghiemLam.jsx')));

  console.log('— B3/B4 màn kết quả — chữ khớp CHÍNH DEMO');
  const lienKet = / ?Trao đổi với quán ›$/;
  const menuGia = { dl: { data: mau.menu.map((m) => ({ ma: m.ma, ten: m.ten, nhom: 'Trà', gia: 39000 })) } };
  const ketQua = (c, hien, menu = menuGia, moHoTro = null) => TNk({ tn: { hien }, menu, lui() {}, lamLai() {}, chonMon() {}, moHoTro, veGioiThieu() {} });
  const hienTu = (c, ex = {}) => ({ kl: kl_(c), ds: tn.locCau(DL, c.sex), tra: c.ans, ngay: '2026-10-29 08:15:00', daLuu: false, ...ex });
  const lay = (h, lop) => { const m = new RegExp(`<div class="${lop}">([\\s\\S]*?)</div>`).exec(h); return m ? vb(m[1]) : null; };
  for (const c of mau.tracNghiem) {
    const h = ketQua(c, hienTu(c));
    const hero = h.slice(h.indexOf('class="tcr-hero"'), h.indexOf('class="card tcr-sec"'));
    const ghi = [...h.matchAll(/<div class="tc-note[^"]*">([\s\S]*?)<\/div><\/div>/g)].map((m) => vb(m[1]));
    const diem = [...h.matchAll(/<div class="sbar[^"]*">([\s\S]*?)<\/div><\/div>/g)].map((m) => vb(m[1]));
    const khoi = h.split('class="card tcr-sec tblock"').slice(1).map((x) => vb(x.replace(/^>/, '')).slice(0, 50));
    const demoGhi = c.chu.ghiChu.concat(c.chu.khoiRieng).map((x) => x.replace(lienKet, ''));
    const tongDau = h.indexOf('Kết luận tổng thể');
    k(`[${c.ten}] kết quả: tiêu đề, chữ Hán, mức, mô tả, kết luận tổng thể`, lay(hero, 'k') === c.chu.hero.k && lay(hero, 'h') === c.chu.hero.h && lay(hero, 'h2') === c.chu.hero.h2
      && lay(hero, 'lvl') === c.chu.hero.lvl && lay(hero, 's') === c.chu.hero.s && vb(h.slice(tongDau, h.indexOf('</div></div>', tongDau))) === 'Kết luận tổng thể' + c.chu.tong,
      JSON.stringify({ h: lay(hero, 'h'), lvl: lay(hero, 'lvl'), tong: vb(h.slice(tongDau, h.indexOf('</div></div>', tongDau))) }));
    k(`[${c.ten}] ghi chú (xung đột / ≥ 3 thể / an toàn / đã để riêng) + khối thể trạng + điểm 9 nhóm`, bang(ghi, demoGhi.map((x) => x.trim())) && bang(diem, c.chu.diemThanh) && khoi.length === c.chu.khoi.length && khoi.every((x, i) => x === c.chu.khoi[i].slice(0, 50)),
      JSON.stringify({ ghi, demo: demoGhi, diem: diem[0], khoi, demoKhoi: c.chu.khoi }));
    if (!c.picks.includes('bh') && !c.goiY.an) {
      const nenH = nho(h.slice(h.indexOf('Thức uống gợi ý tại quán'), h.indexOf('Điểm từng nhóm')));
      k(`[${c.ten}] gợi ý tại quán: đủ số món + tên món + nên chọn / hạn chế`, nenH.startsWith(`Thức uống gợi ý tại quán · ${c.goiY.mon.length} món`) && c.goiY.mon.every((x) => nenH.includes(x)) && c.goiY.nen.every((x) => nenH.includes(x)) && c.goiY.tranh.every((x) => nenH.includes(x)));
    }
  }
  const cMain = mau.tracNghiem.find((c) => c.kind === 'main' && !c.safety.length);
  const hMain = ketQua(cMain, hienTu(cMain)), hLuu = ketQua(cMain, hienTu(cMain, { ds: null, tra: null, daLuu: true }));
  k('chưa lưu: hộp "Đồng ý lưu" + nút Làm lại + nguồn; có "Xem lại từng câu trả lời" (câu trả lời còn trong bộ nhớ) + ô góp ý', ['Đồng ý lưu', 'Làm lại trắc nghiệm', 'Xem lại từng câu trả lời', 'Gửi góp ý cho quán', 'Sao chép kết quả và góp ý', 'Quốc y đại sư Vương Kỳ', 'không thay thế việc thăm khám'].every((x) => nho(hMain).includes(x)) && !/Xoá kết quả/.test(hMain));
  k('đã lưu (mở lại từ máy): "Đã lưu trên máy này" + nút Xoá kết quả; KHÔNG còn câu trả lời (không có "Xem lại từng câu", không có "Dựa trên lựa chọn")', nho(hLuu).includes('Đã lưu trên máy này') && /Xoá kết quả/.test(hLuu) && !/Xem lại từng câu/.test(hLuu) && !/Dựa trên lựa chọn/.test(hLuu) && !/Đồng ý lưu/.test(hLuu));
  k('bảng "Xem lại" có đủ 60 dòng', (hMain.match(/<tr>/g) || []).length === 60);
  k('không lấy được menu (chưa đăng nhập POS / lỗi): chỉ phần chữ nên / hạn chế, KHÔNG có tiêu đề "Thức uống gợi ý tại quán" và không món giả', (() => { const h = ketQua(cMain, hienTu(cMain), { dl: null }); return !/Thức uống gợi ý tại quán/.test(h) && !/prod-card/.test(h) && /Nên chọn/.test(h); })());
  k('menu có nhưng không món nào hợp: "Hỏi nhân viên để chọn món phù hợp." (như demo)', (() => { const h = ketQua(cMain, hienTu(cMain), { dl: { data: [{ ma: 'x', ten: 'Món lạ', nhom: 'Trà', gia: 1000 }] } }); return /Hỏi nhân viên để chọn món phù hợp\./.test(h) && /· 0 món/.test(nho(h)); })());
  k('"Trao đổi với quán ›" chỉ hiện khi quán đã khai cách liên hệ (moHoTro)', (() => { const c = mau.tracNghiem.find((x) => x.conflict); return !/Trao đổi với quán/.test(ketQua(c, hienTu(c), menuGia, null)) && /Trao đổi với quán ›/.test(ketQua(c, hienTu(c), menuGia, () => {})); })());
  k('sao chép góp ý = đúng văn bản của demo (tcCopy); mở lại bản đã lưu thì không có dòng "Trả lời"', mau.tracNghiem.every((c) => tn.soanGopY(DL, kl_(c), c.ans, '') === c.gopY)
    && !/Trả lời:/.test(tn.soanGopY(DL, klKhi, null, 'abc')) && /Góp ý: abc$/.test(tn.soanGopY(DL, klKhi, null, 'abc')));

  console.log('— nối vào App (đọc nguồn)');
  const app = doc('src/App.jsx');
  k('App: trạng thái trắc nghiệm giữ ở App (dungTracNghiem), dọn bộ nhớ khi đăng xuất / hết phiên (donPhien gọi donBoNho; KH-LUU-1)', /const tnGoc = dungTracNghiem\(\)/.test(app) && /const donPhien = \(\) => \{[^\n]*tnGoc\.donBoNho\(\)/.test(app));
  k('App: mở thẳng /lam không có bài, /ketqua không có kết quả → về /tracnghiem', /trang === 'tracnghiemlam' && !tn\.bai/.test(app) && /trang === 'tracnghiemketqua' && !tn\.hien/.test(app));
  k('App: 3 màn chỉ dựng khi đã đăng nhập; Làm lại dùng giới tính của kết quả', /dangNhap && trang === 'tracnghiem' &&/.test(app) && /dangNhap && trang === 'tracnghiemlam' &&/.test(app) && /dangNhap && trang === 'tracnghiemketqua' &&/.test(app) && /tn\.batDau\(tn\.hien\.kl\.gioiTinh\)/.test(app));
  const hk = doc('src/dungTracNghiem.js');
  k('hook: xoá = xoá khoá trên máy + bỏ kết quả trong bộ nhớ; donBoNho chỉ dọn bộ nhớ, KHÔNG xoá khoá (hết phiên không mất kết quả — KH-LUU-1); lưu chỉ ghi bản rút gọn', /const xoa = \(\) => \{ xoaKetQua\(\);/.test(hk) && /const donBoNho = \(\) => \{(?![^\n]*xoaKetQua)/.test(hk) &&/rutGon\(moi\.kl, moi\.ngay\)/.test(hk));

  k('lưu thất bại (kho bị chặn) → hook không báo "đã lưu" mà trả false; màn kết quả báo "không lưu được"', /if \(!ghiKetQua\(ban\)\) return false;/.test(hk) && /tn\.luuLai\(\) \? CHU\.daLuuToast : CHU\.khongLuuDuoc/.test(doc('src/pages/TracNghiemKetQua.jsx')) && /khongLuuDuoc:/.test(chu));
  k('mở thẻ / ô / dòng "đã lưu" luôn mở BẢN ĐÃ LƯU (bỏ kết quả làm lại chưa lưu): App gọi xemBanLuu', (app.match(/tn\.xemBanLuu\(\)/g) || []).length === 2 && /const xemBanLuu = \(\) => datMoi\(null\)/.test(hk));
  k('THE_CHAT không giữ trường không ai đọc (khoa, chamSoc, tra, menu)', (() => { const t = chat.THE_CHAT.bh; return !('khoa' in t) && !('chamSoc' in t) && !('tra' in t) && !('menu' in t); })());

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.log('✗ ' + (e && e.stack || e)); console.log('\n0 đạt · 1 hỏng'); process.exit(1); });
