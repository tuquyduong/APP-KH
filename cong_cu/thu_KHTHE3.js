#!/usr/bin/env node
// THỬ KH-THE-3 — khối thẻ hội viên dùng chung (Vàng / Kim Cương / hạng khác), ba cỡ, gắn ở Ưu đãi, Theo dõi đơn chỉ thẻ, Chào mừng, Thanh toán thẻ, So sánh nhanh.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần + đọc nguồn + CSS · Phần 2: App thật trong Chromium (POS giả theo hợp đồng v13; không có Playwright /
// KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca). Chạy: node cong_cu/thu_KHTHE3.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const doc = (f) => boChuThich(docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Hàm đọc màu của K9 (chép từ kiem_tra_truoc_khi_giao.js) — để kiểm the_hoi_vien.css không có màu ngoài demo.
const docMau = (txt) => {
  const ra = new Set();
  const them = (r, g, b, a) => ra.add([r, g, b, Math.round(a * 1000) / 1000].join(','));
  for (const m of txt.matchAll(/#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g)) {
    let h = m[1].toLowerCase();
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    them(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1);
  }
  for (const m of txt.matchAll(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/g)) {
    const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    them(+m[1], +m[2], +m[3], a);
  }
  return ra;
};

const HANG = [
  { id: 1, ten: 'Bạc', phan_tram: 0, phan_tram_nhom_dac_biet: 0, chi_cap: false, goi: [], thu_bac: 1, gia_the: null, thu_tu: 1, quyen_loi: [] },
  { id: 2, ten: 'Hạng vàng', phan_tram: 3, phan_tram_nhom_dac_biet: 4, chi_cap: false, goi: [{ so_thang: 1, gia: 100000 }, { so_thang: 3, gia: 295000 }], thu_bac: 2, gia_the: 100000, thu_tu: 2, quyen_loi: ['Tích điểm ×1,2'] },
  { id: 3, ten: 'Kim Cương', phan_tram: 10, phan_tram_nhom_dac_biet: 10, chi_cap: true, goi: [], thu_bac: 3, gia_the: null, thu_tu: 3, quyen_loi: [] },
  { id: 4, ten: 'Hạng Ruồi', phan_tram: 1, phan_tram_nhom_dac_biet: 0, chi_cap: false, goi: [{ so_thang: 1, gia: 50000 }], thu_bac: 4, gia_the: 50000, thu_tu: 4, quyen_loi: [] },
];
const MENU_DS = [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà', gia: 30000, con_hang: true, gia_hang: [{ hang_id: 2, gia: 29100 }, { hang_id: 3, gia: 27000 }] }];
const THE = (hang_id = 2, so_thang = 3) => ({ loai: 'the', hang_id, so_thang });
const LY = (ma = 'TLB', so_luong = 1, ghi_chu = '') => ({ ma, so_luong, ghi_chu });
const TOI = (het_han, id = 2) => { const h = HANG.find((x) => x.id === id); return { id, ten: h.ten, phan_tram: h.phan_tram, phan_tram_nhom_dac_biet: h.phan_tram_nhom_dac_biet, het_han }; };

(async () => {
  console.log('A — hàm thuần');
  await thu('A2', async () => {
    const T = await nap('src/theHoiVien.js');
    const kq = ['Vàng', 'Hạng vàng', 'HẠNG VÀNG', 'Kim Cương', 'kim cuong', 'KIM CƯƠNG', 'Hạng Ruồi', '', null, undefined].map(T.mauThe);
    k('A2 mauThe: Vàng / Hạng vàng / HẠNG VÀNG → vang; Kim Cương / kim cuong / KIM CƯƠNG → kc; Hạng Ruồi / rỗng / null / undefined → hong', bang(kq, ['vang', 'vang', 'vang', 'kc', 'kc', 'kc', 'hong', 'hong', 'hong', 'hong']), JSON.stringify(kq));
    k('A2 mauThe: tên có cả "kim cương" và "vàng" → kc (kim cương trước)', T.mauThe('Kim Cương vàng') === 'kc');
    k('A2 nguoiTrenThe đủ: "Chị Linh · •••• 3456"', T.nguoiTrenThe({ xung_ho: 'chi', ten: 'Linh', sdt: '0909123456' }) === 'Chị Linh · •••• 3456', T.nguoiTrenThe({ xung_ho: 'chi', ten: 'Linh', sdt: '0909123456' }));
    k('A2 nguoiTrenThe thiếu tên → chỉ "•••• 3456"', T.nguoiTrenThe({ xung_ho: 'chi', sdt: '0909123456' }) === '•••• 3456');
    k('A2 nguoiTrenThe thiếu SĐT → chỉ tên', T.nguoiTrenThe({ xung_ho: 'anh', ten: 'Minh' }) === 'Anh Minh');
    k('A2 nguoiTrenThe thiếu cả hai → rỗng; không khách → rỗng', T.nguoiTrenThe({ xung_ho: 'chi' }) === '' && T.nguoiTrenThe(null) === '' && T.nguoiTrenThe(undefined) === '');
    k('A2 hanTrenThe: có hạn → Hết hạn + dd/mm/yyyy; null + quán tặng → Quán tặng + Không thời hạn; null → Không thời hạn',
      bang(T.hanTrenThe('2026-11-26T23:59:59', false), { nhan: 'Hết hạn', gia_tri: '26/11/2026' }) && bang(T.hanTrenThe(null, true), { nhan: 'Quán tặng', gia_tri: 'Không thời hạn' }) && bang(T.hanTrenThe(null, false), { nhan: 'Không thời hạn', gia_tri: '' }),
      JSON.stringify([T.hanTrenThe('2026-11-26T23:59:59', false), T.hanTrenThe(null, true), T.hanTrenThe(null, false)]));
  });

  console.log('A — CSS, component, danh mục');
  await thu('A1', async () => {
    const css = docTho('src/giaoDien/the_hoi_vien.css'), demo = docTho('thiet_ke/app_kh_demo.html').replace(/data:[^"')\s]{100,}/g, '');
    const demoMau = docMau(demo), la = [...docMau(css)].filter((c) => !demoMau.has(c));
    k('A1 the_hoi_vien.css có, 0 màu ngoài demo (thuật toán K9)', css.length > 1000 && la.length === 0, la.join(' · '));
    const lop = [...css.matchAll(/(?<![\w-])\.([a-z][\w-]*)/g)].map((m) => m[1]).filter((x) => !/^(svg|webp|woff2?|png|jpg|org)$/.test(x) && !/^\d/.test(x));
    k('A1 mọi lớp trong css bắt đầu "thv" (hoặc là chữ lớp chung vang / kc / hong / mini / vua / chieu / phai / mini-ten)', lop.length > 10 && lop.every((x) => /^(thv|vang|kc|hong|mini|vua|chieu|phai|mini-ten)/.test(x)), [...new Set(lop.filter((x) => !/^(thv|vang|kc|hong|mini|vua|chieu|phai|mini-ten)/.test(x)))].join(', '));
    const cqw = [...css.matchAll(/font-size:([\d.]+)px;font-size:[\d.]+cqw/g)].length, cqwTron = [...css.matchAll(/font-size:[\d.]+cqw/g)].length;
    k('A1 cỡ chữ cqw luôn có px dự phòng đứng trước (iOS 15)', cqw >= 5 && cqw === cqwTron, `${cqw}/${cqwTron}`);
    k('A1 đường dẫn ảnh: /anh/the-vang-hoa-van.webp, /anh/the-vang-van.svg, /anh/the-kc-mat.svg; hai tệp svg có trong public/anh', /url\(\/anh\/the-vang-hoa-van\.webp\)/.test(css) && /url\(\/anh\/the-vang-van\.svg\)/.test(css) && /url\(\/anh\/the-kc-mat\.svg\)/.test(css)
      && fs.existsSync(path.join(GOC, 'public/anh/the-vang-van.svg')) && fs.existsSync(path.join(GOC, 'public/anh/the-kc-mat.svg')));
    k('A4 css: giảm chuyển động tắt ánh lướt + lấp lánh', /prefers-reduced-motion:\s*reduce\)\s*\{[^}]*\.thv\.chieu \.thv-sang\{animation:none\}[^}]*\.thv-lap i\{animation:none/.test(css));
    k('A4 css: Kim Cương cũng tắt ánh lướt khi giảm chuyển động (độ ưu tiên không bị luật sang-kc đè)', /prefers-reduced-motion:\s*reduce\)\s*\{\.thv\.kc\.chieu \.thv-sang\{animation:none\}/.test(css));
    k('A1 tên dài không đẩy hạn ra ngoài thẻ: ô tên min-width:0 + ellipsis, ô hạn flex:none', /\.thv-chan > div:first-child\{min-width:0\}/.test(css) && /text-overflow:ellipsis/.test(css) && /\.thv-chan \.phai\{flex:none\}/.test(css));
    const cp = doc('src/components/TheHoiVien.jsx');
    k('A3 TheHoiVien.jsx: role="img" + aria-label ở cỡ lớn, aria-hidden ở cỡ nhỏ, lớp chieu, lấp lánh Kim Cương', /role="img"/.test(cp) && /aria-label/.test(cp) && /aria-hidden/.test(cp) && /chieu/.test(cp) && /thv-lap/.test(cp));
    const DM = (await nap('src/noiDung/nd/index.js')).DANH_MUC, khoa = new Set(DM.map((m) => m.khoa));
    const can = ['the.thv.hoiVien', 'the.thv.giam', 'the.thv.hetHan', 'the.thv.tang', 'the.thv.khongHan', 'the.thv.aria', 'the.td.kichHoat', 'the.td.kichHoat.s', 'the.td.kichHoat.sPhanTram', 'the.td.dong', 'the.td.dongThang', 'the.thv.pos', 'the.thv.khach', 'the.td.pos'];
    k('A5 khoá mới có trong danh mục', can.every((x) => khoa.has(x)), can.filter((x) => !khoa.has(x)).join(', '));
  });

  console.log('B — các bước đơn chỉ thẻ');
  await thu('B2', async () => {
    const D = await nap('src/datDon.js'), ND = await nap('src/noiDung/nd.js');
    const the = D.buocTienTrinh('cho_tra', { chiThe: true, phanTram: 3 });
    const chuB = the.ds.map((b) => `${b.t} ${b.s || ''}`).join(' | ');
    k('B2 đơn chỉ thẻ chờ trả: HAI bước "Chờ thanh toán" → "Thẻ kích hoạt", đang ở bước đầu', bang(the.ds.map((b) => b.t), ['Chờ thanh toán', 'Thẻ kích hoạt']) && the.hien === 0, chuB);
    k('B2 dòng phụ bước 2 có "Ngay khi tiền về, không cần ra quầy. Đơn đồ uống tiếp theo được giảm 3%."', the.ds[1] && the.ds[1].s === 'Ngay khi tiền về, không cần ra quầy. Đơn đồ uống tiếp theo được giảm 3%.', the.ds[1] && the.ds[1].s);
    k('B2 không biết % → bỏ câu sau', (D.buocTienTrinh('cho_tra', { chiThe: true }).ds[1] || {}).s === 'Ngay khi tiền về, không cần ra quầy.');
    k('B2 chữ các bước KHÔNG có "pha chế" / "mời bạn ra quầy nhận"', !/pha chế|ra quầy nhận/i.test(chuB));
    k('B2 đơn đồ uống vẫn 4 bước (chờ trả, đã trả, pha chế, sẵn sàng)', bang(D.buocTienTrinh('cho_tra').ds.map((b) => b.ma), ['cho_tra', 'da_tra', 'dang_lam', 'xong']) && bang(D.buocTienTrinh('da_tra', { chiThe: false }).ds.map((b) => b.ma), ['cho_tra', 'da_tra', 'dang_lam', 'xong']));
    k('B2 đơn chỉ thẻ đã xong → bước "Thẻ kích hoạt" đã làm xong', (() => { const b = D.buocTienTrinh('xong', { chiThe: true, phanTram: 3 }); return b.ds.length === 2 && b.hien === 1 && b.xongBuocHien === true; })());
    k('B2 khoá nội dung bước thẻ có trong danh mục (kt / ks)', (() => { const b = D.buocTienTrinh('cho_tra', { chiThe: true, phanTram: 3 }); return b.ds[1] && b.ds[1].kt === 'the.td.kichHoat' && /^the\.td\.kichHoat\.s/.test(b.ds[1].ks || ''); })());
    void ND;
  });

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await thu('Chromium', () => trinhDuyet(pw));
  }
  console.log(`  (chạy hết ${Math.round(process.uptime())} giây — bộ kiểm cắt ở 120 giây)`);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

// ---- Phần 2: App thật (esbuild) + POS giả theo hợp đồng v13.
async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goc = process.env.GOC_THU ? process.env.GOC_THU : GOC; // GOC_THU = cây gốc (so ảnh trước / sau)
  const docG = (f) => { try { return fs.readFileSync(path.join(goc, f), 'utf8'); } catch { return ''; } };
  const goi = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(goc, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent', nodePaths: [path.join(GOC, 'node_modules')],
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => docG(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...docG('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n') + fs.readdirSync(path.join(goc, 'src/giaoDien')).filter((f) => /\.css$/.test(f) && !/^demo|giaoDien|khau_hieu/.test(f)).map((f) => docG('src/giaoDien/' + f)).join('\n');
  const HTML = docG('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const URL0 = 'http://kh.test', B = (g, d = '2026-11-14') => `${d}T${g}`;
  const anhDir = process.env.LUU_ANH_DIR || '';
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const giaGoi = (id, n) => { const h = HANG.find((x) => x.id === id); const g = h && h.goi.find((x) => x.so_thang === n); return g ? g.gia : null; };
  const chu0 = (await nap('src/luuMay.js')).dauVet('0909123456');

  async function may(ten, { dn = true, gio = null, S0 = {}, rong = 390, giam = false, guiDo = null } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh', reducedMotion: giam ? 'reduce' : 'no-preference', deviceScaleFactor: anhDir ? 2 : 1 });
    await ctx.clock.install({ time: new Date('2026-11-14T20:30:00+07:00') }); await ctx.clock.resume();
    await ctx.addInitScript(({ dn, gio, chu0, guiDo }) => {
      if (location.protocol !== 'http:') return;
      if (sessionStorage.getItem('da_gieo')) return;
      sessionStorage.setItem('da_gieo', '1');
      localStorage.setItem('kh_ngay_man_dau', '2026-11-14');
      if (dn) { localStorage.setItem('kh_token', 'tok-A'); localStorage.setItem('kh_chu', chu0); }
      if (gio) localStorage.setItem('kh_gio', JSON.stringify(gio));
      if (guiDo) localStorage.setItem('kh_don_gui', JSON.stringify(guiDo));
    }, { dn, gio, chu0, guiDo });
    const S = { hang: null, don: new Map(), soDon: 41, mo: true, hangDs: HANG, ...S0 };
    const loiTrang = [];
    const json = (r, st, o) => r.fulfill({ status: st, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
    const tong = (than) => (than.mon || []).reduce((s, m) => s + ('loai' in m ? giaGoi(m.hang_id, m.so_thang) : 30000 * m.so_luong), 0);
    const monDon = (d) => d.mon.map((m) => ('loai' in m ? { ma: null, ten: `🎟️ Thẻ hội viên ${HANG.find((h) => h.id === m.hang_id).ten} · ${m.so_thang} tháng`, so_luong: 1, don_gia: giaGoi(m.hang_id, m.so_thang), thanh_tien: giaGoi(m.hang_id, m.so_thang), ghi_chu: null, loai: 'the' }
      : { ma: m.ma, ten: 'Trà Lục Bảo', so_luong: m.so_luong, don_gia: 30000, thanh_tien: 30000 * m.so_luong, ghi_chu: null }));
    const dongDon = (d) => ({ ma: d.ma, so_hd: 'APP00' + d.ma.slice(3), ngay: B('20:31:00'), tong: d.tong, da_tra: d.tt === 'cho_tra' ? 0 : d.tong, trang_thai: null, thanh_toan: null, tien_trinh: d.tt, qr: d.tt === 'cho_tra' ? d.qr : null, tien_ve_cho_doi_soat: false, cach_tra: 'qr', giu_vi: 0, con_lai: d.tong });
    S.donMoi = (ma, mon, tt = 'cho_tra') => S.don.set(ma, { ma, tong: tong({ mon }), mon, tt, qr: { chuoi: '0002010102123857' + ma, het_han: B('20:40:00') } });
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname;
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (!p.startsWith('/api/kh')) {
        const f = path.join(goc, 'public', p);
        if (/\.[a-z0-9]+$/.test(p)) return fs.existsSync(f) && fs.statSync(f).isFile() ? r.fulfill({ path: f }) : r.fulfill({ status: 204, body: '' });
        return r.fulfill({ contentType: 'text/html', body: HTML });
      }
      const duong = p.slice('/api/kh'.length);
      if (duong === '/gio-vang') return json(r, 200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(r, 200, { success: true, data: S.hangDs });
      if (duong === '/gio-hoat-dong') return json(r, 200, { success: true, bay_gio: B('20:30:00'), dang_mo: S.mo, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(r, 200, { success: true, data: MENU_DS });
      if (duong === '/chuong-trinh') return json(r, 200, { success: true, data: [] });
      if (!/tok-A/.test(req.headers().authorization || '')) return json(r, 401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(r, 200, { success: true, khach: { sdt: '0909123456', ten: S.ten || 'Linh', ngay_tao: B('08:00:00'), xung_ho: 'chi', dia_chi: null, ngay_sinh: null, qr: 'QR', hang: S.hang, so_du_vi: 500000 } });
      if (duong === '/diem') return json(r, 200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(r, 200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/gia-han') return json(r, 200, { success: true, token: 'tok-A', het_han: B('08:00:00', '2026-12-14') });
      if (duong === '/gio/bao-gia') return json(r, 200, { success: true, dong: [], tam_tinh: 295000, giam: [], phi_giao: 0, tong: 295000, ma_giam_loi: null });
      if (duong.startsWith('/don/') && req.method() === 'GET') {
        const d = S.don.get(decodeURIComponent(duong.slice(5)));
        if (!d) return json(r, 404, { error: 'Không thấy đơn', code: 'KHONG_THAY_DON' });
        const the = d.mon.find((m) => 'loai' in m), chiThe = d.mon.every((m) => 'loai' in m);
        return json(r, 200, { success: true, don: { ...dongDon(d), mon: monDon(d), hoa_don: the && chiThe && d.tt !== 'cho_tra' ? [{ loai: 'the', trai: '1 x Thẻ hội viên', phai: '295.000', ghi_chu: S.hanMoi === undefined ? 'Hạn mới: 13/02/2027' : S.hanMoi }] : [] } });
      }
      if (duong === '/don' && req.method() === 'GET') return json(r, 200, { success: true, trang: 1, con_nua: false, data: [...S.don.values()].reverse().map(dongDon) });
      return json(r, 500, { error: 'chưa giả', code: 'LOI_MAY_CHU' });
    });
    const t = await ctx.newPage(); t.on('pageerror', (e) => loiTrang.push(e.message)); t.setDefaultTimeout(6000);
    try { await chay({ t, S, ctx }); } catch (e) { k(`[${ten}] dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); }
    k(`[${ten}] trang không báo lỗi JS`, loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }
  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chu = (t, sel) => t.locator(sel).first().innerText().catch(() => '');
  const doi = async (t, fn, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await t.waitForTimeout(40); } return false; };
  const doiChu = (t, sel, mau, ms) => doi(t, async () => mau.test(await chu(t, sel)), ms);
  const chup = async (t, ten) => { if (anhDir) await t.screenshot({ path: path.join(anhDir, ten + '.png') }); };
  const khongTran = (t) => t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1);
  const dem = (t, sel) => t.locator(sel).count();
  const ten = (t, sel) => t.locator(sel).first().getAttribute('aria-label').catch(() => '');
  const khoiUD = '#rewards .ud-the';

  // ===== B1 Ưu đãi
  const caUD = [
    ['vang', TOI('2026-11-26T23:59:59', 2), 'vang', /−3%/, /Hết hạn[\s\S]*26\/11\/2026/i, /Giảm 3% mọi đơn[\s\S]*Món đặc biệt giảm 4%[\s\S]*còn 12 ngày/, /Quyền lợi & gia hạn ›/],
    ['kc', TOI(null, 3), 'kc', /−10%/, /Quán tặng[\s\S]*Không thời hạn/i, /Giảm 10% mọi đơn[\s\S]*Dành tặng khách thân thiết · không thời hạn/, /Quyền lợi ›/],
    ['sap', TOI('2026-11-17T23:59:59', 2), 'vang', /−3%/, /Hết hạn[\s\S]*17\/11\/2026/i, /Còn 3 ngày[\s\S]*Gia hạn trước 17\/11 để không mất ưu đãi\. Ngày còn lại được cộng dồn\.[\s\S]*Gia hạn ngay ›/, /Gia hạn ngay ›/],
    ['hong', TOI('2026-12-20T23:59:59', 4), 'hong', /−1%/, /Hết hạn[\s\S]*20\/12\/2026/i, /Giảm 1% mọi đơn/, /Quyền lợi & gia hạn ›/],
  ];
  for (const [nhan, hang, mau, giamRe, hanRe, duoiRe, nutRe] of caUD) {
    await may(`B1 Ưu đãi ${nhan}`, { S0: { hang } }, async ({ t }) => {
      await mo(t, '/uudai');
      await doi(t, async () => (await dem(t, `${khoiUD} .thv`)) > 0);
      const the = t.locator(`${khoiUD} > .thv`).first(), v = await the.innerText().catch(() => ''), duoi = await chu(t, `${khoiUD} .ud-duoi`);
      k(`B1 [${nhan}] thẻ LỚN đúng mẫu .thv.${mau}, đúng một thẻ, là khối đầu ngay dưới đầu màn`, (await dem(t, `${khoiUD} .thv`)) === 1 && (await dem(t, `${khoiUD} .thv.${mau}:not(.mini)`)) === 1
        && await t.evaluate(() => { const a = document.querySelector('#rewards .topbar'), b = a && a.nextElementSibling; return !!b && b.classList.contains('ud-the'); }));
      k(`B1 [${nhan}] trên thẻ: logo + TỨ QUÝ ĐƯỜNG + Thẻ hội viên, tên hạng "${hang.ten}", mức giảm, "Chị Linh · •••• 3456", hạn`, /TỨ QUÝ ĐƯỜNG/i.test(v) && /thẻ hội viên/i.test(v) && v.toLowerCase().includes(hang.ten.replace(/^Hạng /i, '').toLowerCase()) && giamRe.test(v) && /Hội viên[\s\S]*Chị Linh · •••• 3456/i.test(v) && hanRe.test(v), v.replace(/\s+/g, ' '));
      k(`B1 [${nhan}] thẻ lớn role=img + aria-label (tên hạng, hạn); không lớp chieu (ánh lướt chỉ ở Chào mừng)`, /Thẻ hội viên/.test(await ten(t, `${khoiUD} .thv`)) && (await the.getAttribute('role')) === 'img' && (await dem(t, `${khoiUD} .thv.chieu`)) === 0, await ten(t, `${khoiUD} .thv`));
      k(`B1 [${nhan}] ngay dưới thẻ: chip / còn N ngày / dải đỏ / nhắc / nút đúng chữ THE-2`, duoiRe.test(duoi) && nutRe.test(duoi), duoi.replace(/\s+/g, ' '));
      k(`B1 [${nhan}] đúng MỘT nút, nút viền (không nền đặc), ≥ 44px`, (await dem(t, `${khoiUD} button`)) === 1 && (await t.locator(`${khoiUD} button`).first().boundingBox()).height >= 44);
      k(`B1 [${nhan}] không còn khối .tier-card / .the-ud / huy chương ở trạng thái có hạng`, (await dem(t, '#rewards .tier-card, #rewards .the-ud, #rewards [data-med]')) === 0);
      k(`B1 [${nhan}] tỉ lệ thẻ 85,6 × 54 (±2%)`, await the.boundingBox().then((b) => Math.abs(b.width / b.height - 85.6 / 54) < 0.04));
      if (nhan === 'kc') k('B1 [kc] Kim Cương: viên kim cương trước tên + 3 đốm lấp lánh .thv-lap', (await dem(t, `${khoiUD} .thv.kc .thv-ten svg`)) === 1 && (await dem(t, `${khoiUD} .thv-lap i`)) === 3);
      k(`B1 [${nhan}] trang không cuộn ngang`, await khongTran(t));
      await chup(t, `uudai_${nhan}`);
      await t.locator(`${khoiUD} button`).click();
      k(`B1 [${nhan}] nút → Hạng thành viên`, await doi(t, async () => /\/uudai\/hang\?h=\d$/.test(t.url())), t.url());
    });
  }
  await may('B1 chua giữ nguyên', { dn: false }, async ({ t }) => {
    await mo(t, '/uudai');
    await doiChu(t, '#rewards .the-ud', /Trở thành hội viên/);
    k('B1 [chua] thẻ mời mua GIỮ NGUYÊN: .tier-card.the-ud, "Chưa có thẻ", không .thv', (await dem(t, '#rewards .tier-card.the-ud')) === 1 && /Chưa có thẻ/.test(await chu(t, '#rewards .the-ud')) && (await dem(t, '#rewards .thv')) === 0);
  });

  // ===== B2 Theo dõi đơn
  await may('B2 đơn thẻ chờ trả', { S0: {} }, async ({ t, S }) => {
    S.donMoi('TQD50', [THE(2, 1)]);
    await mo(t, '/don/TQD50');
    await doiChu(t, '#tracking', /Thẻ hội viên/);
    const v = await chu(t, '#tracking .the-buoc'), tong = await chu(t, '#tracking');
    k('B2 chờ trả: đúng HAI bước "Chờ thanh toán" → "Thẻ kích hoạt"', (await dem(t, '#tracking .the-buoc .tl-step')) === 2 && /Chờ thanh toán[\s\S]*Thẻ kích hoạt/.test(v), v.replace(/\s+/g, ' '));
    k('B2 dòng phụ "Ngay khi tiền về, không cần ra quầy." (chưa biết % khi /hang chưa khớp bản ghi → bỏ câu sau hoặc có %)', /Ngay khi tiền về, không cần ra quầy\./.test(v));
    k('B2 không "pha chế" / "mời bạn ra quầy nhận" / "Sẵn sàng"', !/pha chế|ra quầy nhận|Sẵn sàng/i.test(tong));
    k('B2 dòng thẻ ở Chi tiết đơn: thẻ NHỎ .thv.mini.vang 72px, tên "Thẻ hội viên Hạng vàng", "1 tháng", không 🎟️, không ô hộp', (await dem(t, '#tracking .the-dong .thv.mini.vang')) === 1 && (await t.locator('#tracking .the-dong .thv.mini').boundingBox()).width === 72
      && /Thẻ hội viên Hạng vàng/.test(await chu(t, '#tracking .the-dong')) && /1 tháng/.test(await chu(t, '#tracking .the-dong')) && !/🎟/.test(tong) && (await dem(t, '#tracking .cart-thumb')) === 0, await chu(t, '#tracking .the-dong'));
    k('B2 thẻ nhỏ aria-hidden, không chữ', (await t.locator('#tracking .the-dong .thv.mini').getAttribute('aria-hidden')) === 'true' && (await chu(t, '#tracking .the-dong .thv.mini')) === '');
    await chup(t, 'don_the_cho_tra');
  });
  await may('B2 đơn thẻ Hạng Ruồi → thẻ hồng; đơn đồ uống giữ nguyên', {}, async ({ t, S }) => {
    S.donMoi('TQD51', [THE(4, 1)]);
    S.donMoi('TQD52', [LY('TLB', 1)]);
    await mo(t, '/don/TQD51');
    await doiChu(t, '#tracking', /Thẻ hội viên/);
    k('B2 hạng khác (Hạng Ruồi) → thẻ nhỏ .thv.mini.hong', (await dem(t, '#tracking .the-dong .thv.mini.hong')) === 1);
    await mo(t, '/don/TQD52');
    await doiChu(t, '#tracking', /Trà Lục Bảo/);
    k('B2 đơn đồ uống: vẫn 4 bước (có "Quán đang pha chế", "Sẵn sàng"), dòng món cũ, không .thv', (await dem(t, '#tracking .the-buoc .tl-step')) === 4 && /Quán đang pha chế/.test(await chu(t, '#tracking .the-buoc')) && (await dem(t, '#tracking .thv')) === 0 && (await dem(t, '#tracking .cart-item')) === 1);
  });

  // ===== B3 Chào mừng
  const GUI = (ma, the) => ({ khoa_gui: 'khoa-' + ma, than: { mon: [the], cach_tra: 'qr' }, cach_tra: 'qr', ma_don: ma, luc: new Date('2026-11-14T13:30:00Z').getTime() });
  await may('B3 Chào mừng', { guiDo: GUI('TQD53', THE(2, 3)), S0: { hang: TOI('2027-02-13T23:59:59', 2) } }, async ({ t, S }) => {
    S.donMoi('TQD53', [THE(2, 3)], 'xong');
    await mo(t, '/don/TQD53');
    await doiChu(t, '#tracking', /Chào mừng hội viên/);
    await doi(t, async () => (await dem(t, '#tracking .thv')) === 1);
    const v = await chu(t, '#tracking .thv'), td = await chu(t, '#tracking');
    k('B3 thẻ LỚN .thv.vang.chieu thay huy chương + thẻ cũ; hạn "Hết hạn 13/02/2027" từ hoá đơn POS', (await dem(t, '#tracking .thv.vang.chieu:not(.mini)')) === 1 && (await dem(t, '#tracking [data-med], #tracking .points-card, #tracking .cm-the')) === 0 && /13\/02\/2027/.test(v), v.replace(/\s+/g, ' '));
    k('B3 ánh lướt: .thv-sang chạy animation 1 lần', await t.evaluate(() => { const s = getComputedStyle(document.querySelector('#tracking .thv-sang')); return s.animationName !== 'none' && s.animationIterationCount === '1'; }));
    k('B3 thẻ nghiêng −2,2°, rộng ≤ 340px', await t.evaluate(() => { const e = document.querySelector('#tracking .thv'), m = new DOMMatrix(getComputedStyle(e).transform); return Math.abs(Math.atan2(m.b, m.a) * 180 / Math.PI + 2.2) < 0.2 && e.offsetWidth <= 340; }));
    k('B3 tiêu đề, đoạn giảm, nhãn "Đơn APP0053 · 295.000đ", nút "Đặt đồ uống ngay" còn nguyên', /Chào mừng hội viên Hạng vàng!/.test(td) && /Giảm 3% áp dụng ngay/.test(td) && /Đơn APP0053 · 295\.000đ/.test(td) && /Đặt đồ uống ngay/.test(td));
    k('B3 Chào mừng: không các bước / số đơn / danh sách món', (await dem(t, '#tracking .the-buoc, #tracking .pick-num, #tracking .cart-item')) === 0);
    await chup(t, 'chao_mung');
  });
  await may('B3 Chào mừng giảm chuyển động', { giam: true, S0: { hang: TOI('2027-02-13T23:59:59', 2) } }, async ({ t, S }) => {
    S.donMoi('TQD53', [THE(2, 3)], 'xong');
    await mo(t, '/don/TQD53');
    await doi(t, async () => (await dem(t, '#tracking .thv')) === 1);
    k('A4 reducedMotion: reduce → .thv-sang animation-name none', await t.evaluate(() => getComputedStyle(document.querySelector('#tracking .thv-sang')).animationName === 'none'));
  });
  await may('B3 Chào mừng Kim Cương giảm chuyển động', { giam: true, guiDo: GUI('TQD53', THE(3, 1)), S0: { hang: TOI(null, 3) } }, async ({ t, S }) => {
    S.donMoi('TQD53', [THE(3, 1)], 'xong');
    await mo(t, '/don/TQD53');
    await doi(t, async () => (await dem(t, '#tracking .thv.kc')) === 1);
    k('A4 reducedMotion: reduce → Kim Cương cũng animation-name none', await t.evaluate(() => getComputedStyle(document.querySelector('#tracking .thv-sang')).animationName === 'none'));
  });
  await may('B3 Chào mừng không vẽ được thẻ → vẫn hiện hạn POS', {}, async ({ t, S }) => {
    S.donMoi('TQD53', [THE(2, 3)], 'xong');
    await mo(t, '/don/TQD53');
    await doiChu(t, '#tracking', /Chào mừng hội viên/);
    k('B3 không biết hạng (không bản ghi, /toi chưa có hạng) → không thẻ, hạn "Hạn mới: 13/02/2027" của POS vẫn hiện', (await dem(t, '#tracking .thv')) === 0 && /Hạn mới: 13\/02\/2027/.test(await chu(t, '#tracking .cm-han')));
  });
  await may('B3 Chào mừng không đọc được hạn', { guiDo: GUI('TQD53', THE(2, 3)), S0: { hanMoi: 'Thẻ có hiệu lực từ hôm nay', hang: TOI('2027-02-13T23:59:59', 2) } }, async ({ t, S }) => {
    S.donMoi('TQD53', [THE(2, 3)], 'xong');
    await mo(t, '/don/TQD53');
    await doi(t, async () => (await dem(t, '#tracking .thv')) === 1);
    k('B3 hạn POS không phải "Hạn mới: dd/mm/yyyy" → thẻ bỏ dòng hạn, nguyên chữ POS ngay dưới thẻ', !/Hết hạn|\d\d\/\d\d\/\d{4}/.test(await chu(t, '#tracking .thv')) && /Thẻ có hiệu lực từ hôm nay/.test(await chu(t, '#tracking')));
  });

  // ===== B4 thẻ nhỏ: Thanh toán thẻ + So sánh nhanh
  await may('B4 Thanh toán thẻ', {}, async ({ t }) => {
    await mo(t, '/uudai/hang/thanhtoan?h=2&thang=3');
    await doiChu(t, '#checkout', /Thẻ hội viên Hạng vàng/);
    k('B4 thẻ tóm tắt = thẻ VỪA .thv.mini.vua.vang 64px, aria-hidden; không còn .pc-mini / .the-mini', (await dem(t, '#checkout .thv.mini.vua.vang')) === 1 && (await t.locator('#checkout .thv.mini.vua').boundingBox()).width === 64 && (await dem(t, '#checkout .pc-mini, #checkout .the-mini')) === 0);
    k('B4 vẫn "Thẻ hội viên Hạng vàng · 3 tháng", ô cách trả QR (tt-qr) còn nguyên', /Thẻ hội viên Hạng vàng[\s\S]*3 tháng/.test(await chu(t, '#checkout .the-tom')) && (await dem(t, '#checkout .tt-qr')) === 1);
    await chup(t, 'thanhtoan_the');
    await mo(t, '/uudai/hang/thanhtoan?h=4&thang=1');
    await doiChu(t, '#checkout', /Hạng Ruồi/);
    k('B4 hạng khác → thẻ vừa .hong', (await dem(t, '#checkout .thv.mini.vua.hong')) === 1);
  });
  await may('B4 So sánh nhanh', { dn: false }, async ({ t }) => {
    await mo(t, '/uudai/hang');
    await doiChu(t, '#buycard .ss', /Kim Cương/);
    k('B4 đầu mỗi cột hạng: thẻ NHỎ 44px đúng mẫu (vàng, kc, hồng); không còn huy chương', (await dem(t, '#buycard .ss-cot .thv.mini.vang')) === 1 && (await dem(t, '#buycard .ss-cot .thv.mini.kc')) === 1 && (await dem(t, '#buycard .ss-cot .thv.mini.hong')) === 1 && (await t.locator('#buycard .ss-cot .thv.mini').first().boundingBox()).width === 44 && (await dem(t, '#buycard [data-med]')) === 0);
    k('B4 cột "Thường": ô nét đứt (.thv-trong), không thẻ', (await dem(t, '#buycard .c-thuong .thv-trong')) === 1 && (await dem(t, '#buycard .c-thuong .thv')) === 0);
    k('B4 so sánh nhanh không cuộn ngang trang', await khongTran(t));
    await chup(t, 'so_sanh_nhanh');
  });
  await may('B4 Trang chủ giữ nguyên thẻ điểm', { S0: { hang: TOI('2026-11-26T23:59:59', 2) } }, async ({ t }) => {
    await mo(t, '/trangchu');
    await doiChu(t, '#home .points-card', /Vàng|vàng/);
    k('B4 Trang chủ: thẻ điểm .points-card còn, không .thv', (await dem(t, '#home .points-card')) >= 1 && (await dem(t, '#home .thv')) === 0);
  });
  await may('B1 tên dài 360', { rong: 360, S0: { ten: 'Nguyễn Thị Thanh Tuyền', hang: TOI('2026-11-26T23:59:59', 2) } }, async ({ t }) => {
    await mo(t, '/uudai');
    await doi(t, async () => (await dem(t, `${khoiUD} .thv`)) > 0);
    k('B1 [360] tên khách dài: hạn trên thẻ vẫn nằm trọn trong thẻ và đọc đủ ngày', await t.evaluate(() => { const c = document.querySelector('#rewards .thv'), p = c.querySelector('.phai'), r = c.getBoundingClientRect(), q = p.getBoundingClientRect(); return q.right <= r.right + 1 && p.querySelector('b').scrollWidth <= p.querySelector('b').clientWidth + 1 && /26\/11\/2026/.test(p.innerText); }));
  });
  for (const rong of [360, 430]) {
    await may(`Ưu đãi ${rong}`, { rong, S0: { hang: TOI(null, 3) } }, async ({ t }) => {
      await mo(t, '/uudai');
      await doi(t, async () => (await dem(t, `${khoiUD} .thv`)) > 0);
      k(`B1 [${rong}] thẻ không méo, không tràn, trang không cuộn ngang`, await khongTran(t) && await t.locator(`${khoiUD} > .thv`).boundingBox().then((b) => b.width <= rong && Math.abs(b.width / b.height - 85.6 / 54) < 0.04));
      await chup(t, `uudai_kc_${rong}`);
    });
  }
  await trinh.close();
}
