#!/usr/bin/env node
// THỬ KH-QC-1 — dải quảng cáo + banner "Hôm nay" đọc chữ chủ quán đặt ở POS (GET /quang-cao, hợp đồng v16).
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hợp đồng chép nguyên, chonQuangCao (hàm thuần), đọc nguồn api.js / App.jsx.
// Phần 2: App thật trong Chromium (Playwright; không có / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca): POS giả dựng TỪ khối máy đọc của hợp đồng v16, đồng hồ giả 8.11.2026 09:00 giờ VN.
// Chạy: node cong_cu/thu_KHQC1.js → dòng cuối "n đạt · m hỏng".
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href).catch(() => null);
const doc = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };

const HD = 'thiet_ke/HOP_DONG_API_KH.md', HD_GOC = 'viec/KH-QC-1/hop_dong_v16.md';
const BAY = '2026-11-08 09:00:00';
const GV = (o = {}) => ({ dang_chay: true, bat_dau: '2026-11-08T08:00:00', ket_thuc: '2026-11-08T10:00:00', phan_tram: 30, mon: ['M1'], ...o });
const CT = [{ ma: 'c1', ten: 'Quà sinh nhật', moTa: 'Tặng 1 ly', loai: 'sinh_nhat' }];

// Khối máy đọc của hợp đồng v16 → danh sách trường của một dòng /quang-cao (POS giả dựng từ đây, không gõ tay).
function truongHopDong() {
  try {
    const hd = JSON.parse(/<!-- HOP_DONG_MAY_DOC -->\s*```json\n([\s\S]*?)\n```/.exec(doc(HD))[1]);
    const c = hd.cua.find((x) => x.duong === '/quang-cao');
    return { token: c.token, tra: c.tra };
  } catch { return null; }
}
const TH = truongHopDong();
const MAC_DINH = { id: 1, chu_dai: '', tieu_de: '', phu: '', chu_nut: '', dich: '', ma_mon: null, tu_gio: null, den_gio: null, uu_tien: 1 };
const dong = (o = {}) => {
  const r = {};
  for (const t of (TH ? TH.tra : []).filter((x) => x.startsWith('data[].'))) r[t.slice(7)] = t.slice(7) in MAC_DINH ? MAC_DINH[t.slice(7)] : null;
  return { ...r, ...o };
};

(async () => {
  console.log('A — hợp đồng v16, danh sách cần từ POS');
  const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(path.join(GOC, f))).digest('hex');
  k('A1 hợp đồng v16 của chat giữ nguyên bản gốc POS (sha256 9c72dbccce3ba175…)', sha(HD_GOC).startsWith('9c72dbccce3ba175'));
  k('A1 thiet_ke/HOP_DONG_API_KH.md = NGUYÊN VĂN bản v16 (từng byte)', fs.existsSync(path.join(GOC, HD)) && Buffer.compare(fs.readFileSync(path.join(GOC, HD)), fs.readFileSync(path.join(GOC, HD_GOC))) === 0);
  k('A1 khối máy đọc có GET /quang-cao, không token, đủ 10 trường dòng + bay_gio', !!TH && TH.token === false && ['bay_gio', 'data[].id', 'data[].chu_dai', 'data[].tieu_de', 'data[].phu', 'data[].chu_nut', 'data[].dich', 'data[].ma_mon', 'data[].tu_gio', 'data[].den_gio', 'data[].uu_tien'].every((x) => TH.tra.includes(x)));
  const CT_POS = await nap('src/kiemKhop/canTuPos.js');
  const m = CT_POS && CT_POS.CAN_TU_POS.find((x) => x.cua === 'GET /quang-cao');
  k('A2 canTuPos.js có dòng GET /quang-cao: không token, đủ trường, co: true, viec_pos QC-APP-1', !!m && m.token === false && m.co === true && m.viec_pos === 'QC-APP-1' && !!TH && TH.tra.every((x) => m.truong.includes(x)), JSON.stringify(m));

  console.log('B/C — chonQuangCao: thứ tự POS, khung giờ, dải ≠ banner, đích, nguồn cũ');
  const QC = await nap('src/quangCao.js');
  const chon = (o) => ({ dai: {}, ...(QC ? QC.chonQuangCao({ gioVang: null, chuongTrinh: [], bayGio: BAY, quangCao: [], ...o }) : {}) }); // `dai` = đích riêng của dải
  const dai = (o) => chon(o).chu;
  const R = (o) => dong({ chu_dai: 'Dải A', tieu_de: 'Banner A', phu: 'Phụ A', chu_nut: 'Vào ngay', dich: 'menu', ...o });

  k('B4 giữ thứ tự POS: uu_tien 1 đứng trước 5 thì dòng 1 thắng (không sắp lại)', dai({ quangCao: [R({ id: 1, chu_dai: 'Một', uu_tien: 1 }), R({ id: 2, chu_dai: 'Năm', uu_tien: 5 })] }) === 'Một');
  k('B4 App KHÔNG sắp lại: POS trả dòng uu_tien 5 trước thì dòng đó thắng', dai({ quangCao: [R({ id: 2, chu_dai: 'Năm', uu_tien: 5 }), R({ id: 1, chu_dai: 'Một', uu_tien: 1 })] }) === 'Năm');
  const GIO = (tu, den) => dai({ quangCao: [R({ chu_dai: 'Có', tu_gio: tu, den_gio: den })] }) === 'Có';
  k('B3 trước tu_gio (09:30–12:00 lúc 09:00) → không hợp', GIO('09:30', '12:00') === false);
  k('B3 đúng tu_gio (09:00–12:00 lúc 09:00) → hợp', GIO('09:00', '12:00') === true);
  k('B3 đúng den_gio (08:00–09:00 lúc 09:00) → KHÔNG hợp (nửa mở: < den_gio)', GIO('08:00', '09:00') === false);
  k('B3 trong khung (08:00–12:00) → hợp', GIO('08:00', '12:00') === true);
  k('B3 chỉ tu_gio: 08:00 → hợp, 10:00 → không', GIO('08:00', null) === true && GIO('10:00', null) === false);
  k('B3 chỉ den_gio: 10:00 → hợp, 09:00 → không', GIO(null, '10:00') === true && GIO(null, '09:00') === false);
  k('B3 cả hai null → cả ngày', GIO(null, null) === true);
  const hai = [R({ id: 1, chu_dai: 'Sáng', tu_gio: '06:00', den_gio: '10:00' }), R({ id: 2, chu_dai: 'Chiều', tu_gio: '10:00', den_gio: '18:00' })];
  k('B3 qua mốc giờ đổi dòng, KHÔNG hỏi lại POS (cùng danh sách, hai giờ khác nhau)', dai({ quangCao: hai, bayGio: '2026-11-08 09:59:59' }) === 'Sáng' && dai({ quangCao: hai, bayGio: '2026-11-08 10:00:00' }) === 'Chiều');
  k('B3 dùng giờ POS truyền vào (bayGio), không đồng hồ máy: cùng danh sách, giờ khác → dòng khác', dai({ quangCao: hai, bayGio: '2020-01-01 07:00:00' }) === 'Sáng' && dai({ quangCao: hai, bayGio: '2020-01-01 12:00:00' }) === 'Chiều');

  const a = chon({ quangCao: [R({ id: 1, chu_dai: '🎉 Chỉ dải', tieu_de: '' }), R({ id: 2, chu_dai: 'Dải hai', tieu_de: 'Tiêu đề hai', phu: 'Phụ hai', chu_nut: 'Đi thôi', dich: 'uudai', uu_tien: 2 })] });
  k('C1 dải lấy dòng ĐẦU hợp giờ (dòng không tieu_de): chu = chu_dai', a.chu === '🎉 Chỉ dải' && a.khoaDai === 'qc.pos', JSON.stringify(a));
  k('C2 banner lấy dòng đầu CÓ tieu_de (dòng sau): tiêu đề / phụ / nút / đích của dòng đó; dải dùng dòng 1', a.tieuDe === 'Tiêu đề hai' && a.phu === 'Phụ hai' && a.nut === 'Đi thôi' && a.dich === 'uudai' && !a.macDinh, JSON.stringify(a));
  k('C2 chữ banner POS khoá qc.pos; nút chữ POS khoá qc.pos', !!a.khoa && a.khoa.t === 'qc.pos' && a.khoa.s === 'qc.pos' && a.khoa.nut === 'qc.pos', JSON.stringify(a.khoa));
  const kn = chon({ quangCao: [R({ chu_nut: '', dich: 'menu' })] });
  k('C2 chu_nut rỗng mà bấm được → chữ nút mặc định "Xem ›" (khoá qc.xem)', kn.nut === 'Xem ›' && kn.khoa.nut === 'qc.xem', JSON.stringify(kn));
  const kp = chon({ quangCao: [R({ phu: '', dich: '', chu_nut: 'Bỏ' })] });
  k('C2 phu rỗng → không dòng phụ; dich rỗng → không nút, không bấm', kp.phu === '' && kp.nut === '' && kp.dich === '' && kp.dai.dich === '', JSON.stringify(kp));
  k('C2 dòng không có tieu_de ở mọi dòng → banner = chữ mặc định (macDinh), dải vẫn hiện chu_dai', (() => { const x = chon({ quangCao: [R({ tieu_de: '' })] }); return x.macDinh === true && x.tieuDe === 'Hôm nay bạn muốn uống gì?' && x.chu === 'Dải A'; })());
  const gv = chon({ gioVang: GV(), quangCao: [dong({ id: 'gio_vang', uu_tien: 0, den_gio: '10:00', dich: 'menu', chu_dai: '⏰ Giờ vàng: giảm 30% đến 10:00' }), R({ id: 3, uu_tien: 2 })] });
  k('B4/C2 dòng gio_vang đứng đầu (uu_tien 0): dải = chu_dai của POS; banner = Giờ vàng của App (qc.gv.*, % và giờ từ /gio-vang), không lấy dòng sau', gv.chu === '⏰ Giờ vàng: giảm 30% đến 10:00' && gv.tieuDe === 'Giờ vàng: giảm 30%' && gv.phu === 'Đến 10:00 hôm nay' && gv.nut === 'Xem Menu ›' && gv.dich === 'menu', JSON.stringify(gv));
  const gvHet = chon({ gioVang: GV(), quangCao: [dong({ id: 'gio_vang', uu_tien: 0, den_gio: '09:00', dich: 'menu', chu_dai: '⏰ Giờ vàng: giảm 30% đến 09:00' }), R({ id: 3, chu_dai: 'Dải ba', uu_tien: 2 })] });
  k('B3/B4 dòng gio_vang hết khung (den_gio = giờ POS) → như dòng thường bị bỏ: dải và banner rơi sang dòng sau', gvHet.chu === 'Dải ba' && gvHet.tieuDe === 'Banner A', JSON.stringify(gvHet));
  k('C1/C2 data rỗng → nguồn cũ: Giờ vàng đang chạy (dải "⏰ Giờ vàng: giảm 30% đến 10:00", banner Giờ vàng)', (() => { const x = chon({ gioVang: GV(), quangCao: [] }); return x.chu === '⏰ Giờ vàng: giảm 30% đến 10:00' && x.tieuDe === 'Giờ vàng: giảm 30%'; })());
  k('C1/C2 data rỗng + chương trình → dải "🎁 Quà sinh nhật", banner = tên chương trình', (() => { const x = chon({ chuongTrinh: CT }); return x.chu === '🎁 Quà sinh nhật' && x.tieuDe === 'Quà sinh nhật' && x.dich === 'uudai'; })());
  k('C1/C2 data rỗng, không gì → dải rỗng (ẩn), banner chữ mặc định', (() => { const x = chon({}); return x.chu === '' && x.macDinh === true; })());
  const gvChua = chon({ gioVang: null, quangCao: [dong({ id: 'gio_vang', uu_tien: 0, den_gio: '10:00', dich: 'menu', chu_dai: '⏰ Giờ vàng: giảm 30% đến 10:00' }), R({ id: 3, uu_tien: 2 })] });
  k('K5 dòng gio_vang của POS nhưng /gio-vang chưa tải / không chạy: dải vẫn hiện chữ POS; banner KHÔNG vào Giờ vàng (không lộ {phanTram}), lấy dòng sau có tieu_de', gvChua.chu === '⏰ Giờ vàng: giảm 30% đến 10:00' && gvChua.tieuDe === 'Banner A' && !/[{}]/.test(gvChua.tieuDe + gvChua.phu + gvChua.nut), JSON.stringify(gvChua));
  k('K5 dòng hỏng (null, số, chu_dai rỗng) bị bỏ; quangCao không phải mảng không vỡ', chon({ quangCao: [null, 5, R({ chu_dai: '' })] }).chu === '' && chon({ quangCao: null }).chu === '' && chon({ quangCao: 'x' }).chu === '');
  k('K5 dòng POS thắng Giờ vàng + chương trình App tự dựng khi hợp giờ', chon({ gioVang: GV(), chuongTrinh: CT, quangCao: [R({ chu_dai: 'Của POS' })] }).chu === 'Của POS');

  console.log('C3 — đích bấm');
  const dich = (o) => chon({ quangCao: [R(o)] });
  k('C3 dich menu / uudai / tracnghiem giữ nguyên ở cả dải và banner', ['menu', 'uudai', 'tracnghiem'].every((d) => { const x = dich({ dich: d }); return x.dich === d && x.dai.dich === d; }));
  k('C3 dich mon + ma_mon → mon kèm mã, ở cả dải và banner', (() => { const x = dich({ dich: 'mon', ma_mon: 'M7' }); return x.dich === 'mon' && x.maMon === 'M7' && x.dai.dich === 'mon' && x.dai.maMon === 'M7'; })());
  k('C3 dich mon thiếu ma_mon → Menu (không bấm hỏng, không rỗng)', (() => { const x = dich({ dich: 'mon', ma_mon: null }); return x.dich === 'menu' && x.maMon === '' && x.dai.dich === 'menu'; })());
  k('C3 dich "" hoặc lạ → không bấm được, không "Xem ›"', (() => { const x = dich({ dich: '', chu_nut: '' }), y = dich({ dich: 'xyz', chu_nut: '' }); return x.dich === '' && x.nut === '' && y.dich === '' && y.nut === ''; })());
  k('C3 dải và banner có đích RIÊNG khi khác dòng', (() => { const x = chon({ quangCao: [R({ id: 1, tieu_de: '', dich: 'uudai' }), R({ id: 2, dich: 'tracnghiem', uu_tien: 2 })] }); return x.dai.dich === 'uudai' && x.dich === 'tracnghiem'; })());
  const xs = chon({ quangCao: [R({ chu_dai: '<b>đậm</b>', tieu_de: '<img src=x onerror=alert(1)>', phu: '<script>x</script>', chu_nut: '<i>nút</i>' })] });
  k('C4 chữ HTML từ POS giữ NGUYÊN như chuỗi (React hiện thành chữ); không bị cắt thẻ ở hàm chọn', xs.chu === '<b>đậm</b>' && xs.tieuDe === '<img src=x onerror=alert(1)>' && xs.phu === '<script>x</script>' && xs.nut === '<i>nút</i>');

  console.log('B1/B2 — đọc nguồn api.js / App.jsx / quangCao.js');
  const ap = doc('src/api.js'), app = doc('src/App.jsx'), qcs = doc('src/quangCao.js');
  k('B1 api.js: layQuangCao = goi GET /quang-cao', /export const layQuangCao = \(\) => goi\('GET', '\/quang-cao'\)/.test(ap));
  k('B1 /quang-cao nằm trong CUA_CONG_KHAI (không bao giờ gửi token khách)', /CUA_CONG_KHAI = \[[^\]]*'\/quang-cao'/.test(ap));
  k('B2 (tĩnh, cổng GitHub không có Chromium) ngưỡng quay lại: `Date.now() - luc >= PHUT_KIEM * 60000`; lỗi / 429 → đặt [] (nguồn cũ)', /Date\.now\(\) - luc >= PHUT_KIEM \* 60000/.test(app) && /\(\) => datQuangCaoPos\(\[\]\)/.test(app));
  k('C4 (tĩnh) dải và banner không dùng dangerouslySetInnerHTML (chữ POS hiện như chữ)', !/dangerouslySetInnerHTML/.test(doc('src/components/DaiQuangCao.jsx') + doc('src/components/BannerHomNay.jsx')));
  k('B2 App.jsx: hỏi bằng layQuangCao đúng một chỗ, dùng PHUT_KIEM của dangKySW.js, không setInterval, không lưu máy', (app.match(/layQuangCao\(/g) || []).length === 1 && /import \{[^}]*PHUT_KIEM[^}]*\} from '\.\/dangKySW\.js'/.test(app) && !/quangCao[^\n]*(localStorage|ghi\w*May)|kh_quangcao/i.test(app) && !/setInterval/.test((app.match(/layQuangCao[\s\S]{0,600}/) || [''])[0]));
  k('B2 chonQuangCao nhận `quangCao: quangCaoPos` từ trạng thái, gọi MỘT lần ở App', /chonQuangCao\(\{[^}]*quangCao: quangCaoPos/.test(app) && (app.match(/chonQuangCao\(/g) || []).length === 1);
  k('B2/C3 App.jsx: chỉ hỏi lần đầu (daHoiQc) và dải dùng đích riêng `quangCaoTho.dai`', /if \(daHoiQc\.current \|\| !\(coDai\(trang\)/.test(app) && /\.\.\.quangCaoTho, \.\.\.quangCaoTho\.dai/.test(app));
  k('K10 quangCao.js không sắp lại thứ tự POS (không .sort) và không dùng đồng hồ máy (Date.now / new Date)', !/\.sort\(/.test(qcs) && !/Date\.now|new Date/.test(qcs));

  let pw = null;
  if (process.env.KHONG_TRINH_DUYET !== '1') { try { pw = require('playwright'); } catch { /* không có */ } } // CLAUDE.md §9
  console.log('\nPhần 2 — App thật trong Chromium');
  if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này (hoặc KHONG_TRINH_DUYET=1) — các ca trình duyệt CHƯA chạy');
  else await trinhDuyet(pw);

  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, outdir: path.join(GOC, '.nhap_thu'), format: 'iife', jsx: 'automatic', logLevel: 'silent', external: ['/anh/*', '/fonts/*'],
    loader: { '.json': 'json', '.svg': 'dataurl', '.webp': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles;
  const goi = kq.find((f) => f.path.endsWith('.js')).text, css = (kq.find((f) => f.path.endsWith('.css')) || { text: '' }).text;
  const html = doc('index.html').replace(/<script type="module" src="\/src\/main.jsx"><\/script>/, '<script src="/bundle.js"></script>').replace(/<link[^>]*(googleapis|gstatic|preload)[^>]*>/g, '').replace('</head>', '<link rel="stylesheet" href="/bundle.css"></head>');
  const LM = await nap('src/luuMay.js');
  const SDT = '0901234567', GOC_URL = 'http://kh.test', MOC_GIO = '2026-11-08T02:00:00Z'; // = 09:00 ngày 8.11.2026 giờ VN
  const GV_TAT = { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] };
  const trinh = await pw.chromium.launch();

  // `qc`: hàm () → { status, body } cho /quang-cao; `lan` đếm lượt hỏi, `dauToken` ghi tiêu đề Authorization của từng lượt.
  async function ca(ten, { qc, token = false }, chay) {
    const ctx = await trinh.newContext({ viewport: { width: 390, height: 844 } });
    const t = await ctx.newPage(), loi = [], tr = { lan: 0, dauToken: [] };
    t.on('pageerror', (e) => loi.push(e.message));
    await t.addInitScript(({ luu }) => { if (!sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); for (const [x, v] of Object.entries(luu)) localStorage.setItem(x, v); } }, { luu: token ? { kh_token: 'tok-' + SDT, kh_chu: LM.dauVet(SDT) } : {} });
    await t.clock.install({ time: new Date(MOC_GIO) });
    await t.route(`${GOC_URL}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname, json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (p === '/bundle.css') return r.fulfill({ contentType: 'text/css', body: css });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: html });
      if (p === '/api/kh/toi') return json(200, { khach: { sdt: SDT, ten: 'Anh Linh', xung_ho: 'anh', ngay_tao: '2026-01-01 00:00:00', qr: 'QR' } });
      if (p === '/api/kh/gio-vang') return json(200, GV_TAT);
      if (p === '/api/kh/chuong-trinh') return json(200, { success: true, data: [] });
      if (p === '/api/kh/quang-cao') { tr.lan++; tr.dauToken.push(r.request().headers().authorization || ''); const x = qc(); return json(x.status, x.body); }
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    try { await chay(t, loi, tr); } catch (e) { k(`[${ten}] ca dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
  }
  const mo = async (t, duong) => { await t.goto(GOC_URL + duong); await t.waitForSelector('.phone'); };
  const ok = (data) => () => ({ status: 200, body: { success: true, bay_gio: '2026-11-08T09:00:00', data } });
  const banner = (t) => t.evaluate(() => { const e = document.querySelector('.today.fx-a'); return e ? { t: e.querySelector('b')?.textContent, s: e.querySelector('.t-s')?.textContent || '', cta: e.querySelector('.t-cta')?.textContent || '', html: e.innerHTML } : null; });
  const daiChu = (t) => t.evaluate(() => document.querySelector('.dai-qc .dai-qc-chu')?.textContent ?? null);

  const HAI_DONG = [
    dong({ id: 1, chu_dai: '🎉 Chỉ chữ dải', dich: 'menu', uu_tien: 1 }),
    dong({ id: 2, chu_dai: 'Dải của hai', tieu_de: 'Banner POS hai', phu: 'Phụ POS hai', chu_nut: 'Đi ưu đãi', dich: 'uudai', uu_tien: 2 }),
  ];
  await ca('hai dòng POS', { qc: ok(HAI_DONG), token: true }, async (t, loi, tr) => {
    await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a');
    await t.waitForFunction(() => document.querySelector('.today.fx-a b')?.textContent === 'Banner POS hai', null, { timeout: 4000 }).catch(() => {});
    const b = await banner(t);
    k('D1 Trang chủ: banner = dòng 2 có tieu_de (tiêu đề, phụ, nút từ POS)', !!b && b.t === 'Banner POS hai' && b.s === 'Phụ POS hai' && b.cta === 'Đi ưu đãi', JSON.stringify(b));
    await t.locator('.today.fx-a').click();
    await t.waitForFunction(() => location.pathname === '/uudai', null, { timeout: 3000 }).catch(() => {});
    k('D1 bấm banner → đích của dòng 2 (/uudai)', new URL(t.url()).pathname === '/uudai', t.url());
    k('B2 đổi trang trong App (Trang chủ → Ưu đãi) KHÔNG hỏi lại /quang-cao: vẫn 1 lượt', tr.lan === 1, String(tr.lan));
    await t.goto(GOC_URL + '/menu'); await t.locator('.dai-qc').waitFor();
    await t.waitForFunction(() => document.querySelector('.dai-qc .dai-qc-chu')?.textContent === 'Chỉ chữ dải', null, { timeout: 4000 }).catch(() => {});
    k('D1 Menu: dải = dòng 1 (chữ dải, emoji tách riêng)', (await daiChu(t)) === 'Chỉ chữ dải', String(await daiChu(t)));
    k('D1 không lỗi trang', loi.length === 0, loi.join('|'));
  });
  await ca('đích dải ≠ đích banner', { qc: ok([dong({ id: 1, chu_dai: 'Dải đi ưu đãi', dich: 'uudai', uu_tien: 1 }), dong({ id: 2, chu_dai: 'x', tieu_de: 'Banner đi trắc nghiệm', dich: 'tracnghiem', uu_tien: 2 })]) }, async (t) => {
    await mo(t, '/menu'); await t.locator('.dai-qc').waitFor();
    await t.waitForFunction(() => document.querySelector('.dai-qc .dai-qc-chu')?.textContent === 'Dải đi ưu đãi', null, { timeout: 4000 }).catch(() => {});
    await t.locator('.dai-qc').click();
    await t.waitForFunction(() => location.pathname !== '/menu', null, { timeout: 3000 }).catch(() => {});
    k('C3 bấm DẢI → đích của dòng dải (/uudai), không phải đích của banner', new URL(t.url()).pathname === '/uudai', t.url());
  });
  await ca('không token', { qc: ok(HAI_DONG), token: true }, async (t, loi, tr) => {
    await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a'); await t.waitForTimeout(500);
    k('B1/D1 đã đăng nhập mà /quang-cao KHÔNG gửi tiêu đề Authorization; hỏi 1 lần', tr.lan === 1 && tr.dauToken.every((x) => x === ''), JSON.stringify(tr));
  });
  await ca('qua mốc giờ', { qc: ok([dong({ id: 1, chu_dai: 'Buổi sáng', tu_gio: '06:00', den_gio: '10:00' }), dong({ id: 2, chu_dai: 'Buổi chiều', tu_gio: '10:00', den_gio: '18:00', uu_tien: 2 })]) }, async (t, loi, tr) => {
    await mo(t, '/menu'); await t.locator('.dai-qc').waitFor();
    await t.waitForFunction(() => document.querySelector('.dai-qc .dai-qc-chu')?.textContent === 'Buổi sáng', null, { timeout: 4000 }).catch(() => {});
    const truoc = await daiChu(t);
    k('B3 Chromium 09:00 giờ POS: dải = dòng khung 06:00–10:00 (không phải 10:00–18:00); hỏi 1 lần', truoc === 'Buổi sáng' && tr.lan === 1, `${truoc} ${tr.lan}`);
  });
  await ca('HTML như chữ', { qc: ok([dong({ id: 1, chu_dai: '<b>x</b>', tieu_de: '<img src=x onerror="window.__xss=1">', phu: '<script>window.__xss=2</script>', chu_nut: '<u>n</u>', dich: 'menu' })]) }, async (t, loi) => {
    await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a');
    await t.waitForFunction(() => /<img/.test(document.querySelector('.today.fx-a b')?.textContent || ''), null, { timeout: 4000 }).catch(() => {});
    const x = await t.evaluate(() => ({ xss: window.__xss || 0, img: document.querySelectorAll('.today img[onerror], .today script, .today u').length, t: document.querySelector('.today.fx-a b')?.textContent }));
    k('C4 chữ POS có thẻ HTML hiện NGUYÊN như chữ: không chạy mã, không thẻ <img onerror>/<script>/<u> trong banner', x.xss === 0 && x.img === 0 && x.t === '<img src=x onerror="window.__xss=1">', JSON.stringify(x));
  });
  for (const [ten, qc] of [['lỗi 500', () => ({ status: 500, body: { error: 'lỗi', code: 'LOI_MAY_CHU' } })], ['429', () => ({ status: 429, body: { error: 'nhiều lần', code: 'QUA_NHIEU_LAN' } })], ['data rỗng', ok([])]]) {
    await ca(ten, { qc }, async (t, loi) => {
      await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a'); await t.waitForTimeout(300);
      const b = await banner(t);
      k(`K5 /quang-cao ${ten} → im lặng, banner chữ mặc định, không lỗi trang`, !!b && b.t === 'Hôm nay bạn muốn uống gì?' && loi.length === 0, JSON.stringify(b) + loi.join('|'));
    });
  }
  await ca('hỏi lại sau 30 phút', { qc: ok(HAI_DONG) }, async (t, loi, tr) => {
    await mo(t, '/trangchu'); await t.waitForSelector('.today.fx-a'); await t.waitForTimeout(300);
    const dau = tr.lan;
    const doiTrang = (v) => t.evaluate((x) => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => x }); document.dispatchEvent(new Event('visibilitychange')); }, v);
    await doiTrang('hidden'); await t.clock.fastForward('00:10:00'); await doiTrang('visible'); await t.waitForTimeout(200);
    const sau10 = tr.lan;
    await doiTrang('hidden'); await t.clock.fastForward('00:31:00'); await doiTrang('visible'); await t.waitForTimeout(300);
    k('B2 quay lại sau 10 phút → KHÔNG hỏi lại; sau ≥ 30 phút → hỏi lại đúng 1 lần', dau === 1 && sau10 === 1 && tr.lan === 2, `${dau} ${sau10} ${tr.lan}`);
  });
  await trinh.close();
}
