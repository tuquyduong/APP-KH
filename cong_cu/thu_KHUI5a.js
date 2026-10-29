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

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.log('✗ ' + (e && e.stack || e)); console.log('\n0 đạt · 1 hỏng'); process.exit(1); });
