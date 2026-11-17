#!/usr/bin/env node
// THỬ KH-VC-2 — voucher theo hợp đồng v15: Ví voucher hiện câu POS (`mo_ta`) + nguồn + "Dùng ngay"; Giỏ hàng tự chọn sẵn mọi voucher dùng được (chạm để bỏ),
// mảng `vouchers` gửi POS theo thứ tự (chọn tay mới nhất → hạn sớm → không hạn), POS xét và trả `giam[]` / `voucher_loi[]`; Thanh toán gửi ĐÚNG mảng của báo giá đang hiện.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần + đọc nguồn + CSS · Phần 2: App thật trong Chromium, POS giả xét voucher THEO THỨ TỰ mảng như POS thật
// (tối đa 3, một voucher %, `min_order`, ship → VOUCHER_SHIP_CAN_GIAO). Không có Playwright / KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca.
// Chạy: node cong_cu/thu_KHVC2.js → dòng cuối "n đạt · m hỏng". LUU_ANH_DIR=<thư mục> → lưu ảnh 390.
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = process.env.GOC_THU || path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const doc = (f) => (f.startsWith('src/') ? boChuThich(docTho(f)) : docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };
const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Hàm đọc màu của K9 (chép từ kiem_tra_truoc_khi_giao.js).
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

// Ví voucher mẫu (hợp đồng v15: `mo_ta`, `nguon`, `kieu`, `min_order`, `giam_ship`). gia_tri chỉ POS giả dùng để tính.
const V = (code, kieu, gia_tri, min_order, expires_at, nguon, mo_ta, them = {}) => ({ id: code, code, kieu, gia_tri, min_order, giam_ship: kieu.startsWith('ship') ? gia_tri : 0, expires_at, nguon, mo_ta, status: 'available', ...them });
const VC7 = V('VC7', 'tien', 20000, 50000, '2026-11-30T23:59:59', 'doi_diem', 'Giảm 20.000đ cho đơn từ 50.000đ · HSD 30/11/2026');
const KM8 = V('KM8', 'phan_tram', 10, 0, '2026-12-05T23:59:59', 'khach_moi', 'Giảm 10% tối đa 30.000đ · HSD 05/12/2026');
const VC9 = V('VC9', 'tien', 50000, 150000, '2026-12-20T23:59:59', 'doi_diem', 'Giảm 50.000đ cho đơn từ 150.000đ · HSD 20/12/2026');
const GT3 = V('GT3', 'ship_tien', 15000, 0, '2026-12-31T23:59:59', 'gioi_thieu', 'Giảm 15.000đ phí giao hàng · HSD 31/12/2026');
const VC5 = V('VC5', 'tien', 5000, 0, null, 'nguon_la', 'Giảm 5.000đ · không thời hạn');
const VCCU = { id: 99, reward_name: 'Giảm 20.000đ', code: 'VCCU', discount_type: 'fixed', discount_value: 20000, expires_at: '2026-11-25T23:59:59', status: 'active' }; // voucher trước v15: không mo_ta
const VI_GIO = [VC7, KM8, VC9, GT3, VC5];
const MA_KM = { code: 'BILL123', discount_type: 'fixed', discount_value: 10000, min_order: 0, valid_to: '2026-11-20T23:59:59' };
const GIA = { TLB: 30000, CFM: 39000 };
const MENU_DS = [
  { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
  { ma: 'CFM', ten: 'Cà phê Muối', nhom: 'Cà phê', gia: 39000, con_hang: null, ton_cu: false, ton_luc: null, gia_hang: [] },
];
const GIO = [{ ma: 'TLB', so_luong: 2, ghi_chu: '' }, { ma: 'CFM', so_luong: 1, ghi_chu: '' }]; // 99.000đ

// thanBaoGia của bản gốc (trước KH-VC-2) — giỏ không voucher phải ra ĐÚNG chuỗi này (khoá gửi băm y như cũ).
const chuG = (s) => String(s || '').trim();
const thanGoc = (gio, { maGiam } = {}) => { const t = { mon: gio.map((d) => (chuG(d.ghi_chu) ? { ma: d.ma, so_luong: d.so_luong, ghi_chu: d.ghi_chu } : { ma: d.ma, so_luong: d.so_luong })) }; if (chuG(maGiam)) t.ma_giam = chuG(maGiam); t.cach_nhan = 'tai_quan'; return t; };

const KHOA_MOI = {
  'src/noiDung/nd/taiKhoan.js': ['ud.vc.dungNgay', 'ud.vc.ship', 'ud.vc.nguon.doi_diem', 'ud.vc.nguon.khach_moi', 'ud.vc.nguon.gioi_thieu', 'ud.voucher.chuaDung', 'ud.vc.moTa', 'nm.daThemVi'],
  'src/noiDung/nd/donHang.js': ['giam.voucherMa', 'giam.ship', 'gio.vc.tieuDe', 'gio.vc.phai', 'gio.vc.ship', 'gio.vc.moTa', 'gio.vc.loi', 'gio.ma.tieuDe', 'gio.ma.mot', 'gio.ma.goiYKm', 'tt.vc.chua', 'tt.vc.dong'],
};

if (require.main === module) (async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn, CSS');
  let VG = null, D = null;
  try { VG = await nap('src/voucherGio.js'); } catch (e) { k('nạp src/voucherGio.js', false, String(e.message).split('\n')[0]); }
  try { D = await nap('src/datDon.js'); } catch (e) { k('nạp src/datDon.js', false, String(e.message).split('\n')[0]); }

  await thu('A1', async () => {
    const { laShip, dsGui, trangThaiVoucher, chamVoucher, CHON_RONG } = VG;
    k('A1 laShip: kieu ship_tien / ship_phan_tram hoặc giam_ship khác 0; tiền / % không', laShip(GT3) && laShip({ kieu: 'ship_phan_tram' }) && laShip({ kieu: 'tien', giam_ship: 5000 }) && !laShip(VC7) && !laShip(KM8) && !laShip(VCCU) && !laShip(null));
    k('A1 dsGui: bỏ ship, xếp hạn sớm trước, không hạn cuối', bang(dsGui(VI_GIO, CHON_RONG), ['VC7', 'KM8', 'VC9', 'VC5']), JSON.stringify(dsGui(VI_GIO, CHON_RONG)));
    k('A1 dsGui: bỏ mã khách đã bỏ tay (không phân biệt hoa thường)', bang(dsGui(VI_GIO, { boTay: ['vc7'], chonTay: [] }), ['KM8', 'VC9', 'VC5']));
    k('A1 dsGui: chọn tay đứng đầu ĐÚNG thứ tự mảng chonTay (mới chạm đứng đầu)', bang(dsGui(VI_GIO, { boTay: [], chonTay: ['vc5', 'VC9'] }), ['VC5', 'VC9', 'VC7', 'KM8']));
    const hong1 = { ...VC5, code: 'HONG', expires_at: 'mai' }, cung1 = { ...VC9, code: 'CUNG1', expires_at: '2026-12-05T23:59:59' };
    k('A1 dsGui: hạn hỏng → cuối; cùng hạn → giữ thứ tự ví', bang(dsGui([hong1, KM8, cung1, VC7], CHON_RONG), ['VC7', 'KM8', 'CUNG1', 'HONG']));
    k('A1 dsGui: trùng mã (hoa thường) chỉ gửi một', bang(dsGui([VC7, { ...VC7, code: 'vc7', id: 'x' }], CHON_RONG), ['VC7']));
    const nhieu = [...Array(14)].map((_, i) => V(`M${String(i).padStart(2, '0')}`, 'tien', 1000, 0, `2026-12-${String(i + 10).padStart(2, '0')}T00:00:00`, 'doi_diem', 'x'));
    k('A1 dsGui: cắt ở 10 mã', dsGui(nhieu, CHON_RONG).length === 10 && dsGui(nhieu, CHON_RONG)[0] === 'M00');
    k('A1 dsGui: mã chọn tay không còn trong ví không gửi; ví null / sai → []', bang(dsGui([VC7], { boTay: [], chonTay: ['DA_DUNG'] }), ['VC7']) && bang(dsGui(null, CHON_RONG), []) && bang(dsGui({}, CHON_RONG), []));
    k('A1 dsGui: không đổi mảng ví / mảng chọn', (() => { const vi = [VC9, VC7], c = { boTay: ['KM8'], chonTay: ['VC9'] }; const s = JSON.stringify([vi, c]); dsGui(vi, c); return JSON.stringify([vi, c]) === s; })());
    const bg = { giam: [{ loai: 'voucher', ma: 'VC7', soTien: 20000 }, { loai: 'hang', soTien: 1 }], voucherLoi: [{ ma: 'VC9', code: 'VOUCHER_CHUA_DU_DON', error: 'Đơn chưa đủ tối thiểu' }] };
    k('A1 trangThaiVoucher: dung / { loi } / cho', trangThaiVoucher('vc7', bg) === 'dung' && bang(trangThaiVoucher('VC9', bg), { loi: 'Đơn chưa đủ tối thiểu' }) && trangThaiVoucher('KM8', bg) === 'cho' && trangThaiVoucher('VC7', null) === 'cho');
    const c1 = chamVoucher({ boTay: [], chonTay: ['VC9'] }, 'VC7', true);
    const c2 = chamVoucher(c1, 'vc7', false);
    k('A1 chamVoucher: bỏ ô đang tích → boTay; chọn lại → ra khỏi boTay, đứng ĐẦU chonTay', bang(c1, { boTay: ['VC7'], chonTay: ['VC9'] }) && c2.boTay.length === 0 && bang(c2.chonTay.map((x) => x.toUpperCase()), ['VC7', 'VC9']), JSON.stringify([c1, c2]));
  });

  await thu('A2', async () => {
    k('A2 thanBaoGia không voucher / vouchers [] → chuỗi JSON y hệt bản gốc', [undefined, [], null].every((vc) => JSON.stringify(D.thanBaoGia(GIO, { maGiam: ' GIAM10 ', vouchers: vc })) === JSON.stringify(thanGoc(GIO, { maGiam: ' GIAM10 ' }))) && JSON.stringify(D.thanBaoGia(GIO)) === JSON.stringify(thanGoc(GIO)));
    const tb = D.thanBaoGia(GIO, { maGiam: 'GIAM10', vouchers: ['VC7', 'KM8'] });
    k('A2 thanBaoGia có voucher → `vouchers` đúng mảng, giữ ma_giam', bang(tb.vouchers, ['VC7', 'KM8']) && tb.ma_giam === 'GIAM10' && tb.cach_nhan === 'tai_quan', JSON.stringify(tb));
    const td = D.thanDatDon(GIO, { maGiam: '', vouchers: ['VC7'] }, { cachTra: 'qr', khoaGui: 'k'.repeat(20), tongDaXem: 1 });
    k('A2 thanDatDon mang `vouchers` của tuỳ chọn', bang(td.vouchers, ['VC7']) && td.khoa_gui === 'k'.repeat(20));
    const tt = doc('src/pages/ThanhToan.jsx');
    k('A2 đơn thẻ: KHONG_MA không có vouchers → thân không `vouchers`', /const KHONG_MA = \{ maGiam: '' \};/.test(tt) && !('vouchers' in D.thanDatDon(GIO, { maGiam: '' }, { cachTra: 'qr' })), (/const KHONG_MA[^\n]*/.exec(tt) || [''])[0]);
    const b = D.docBaoGia({ tong: 79000, tam_tinh: 99000, giam: [{ loai: 'voucher', so_tien: 20000, ma: 'VC7' }, { loai: 'hang', so_tien: 1 }], voucher_loi: [{ ma: 'VC9', code: 'VOUCHER_CHUA_DU_DON', error: 'Chưa đủ' }, { ma: 'X' }] });
    k('A2 docBaoGia giữ `ma` của dòng giảm, đọc voucherLoi[] { ma, code, error }', !!b && b.giam[0].ma === 'VC7' && !('ma' in b.giam[1]) && bang(b.voucherLoi, [{ ma: 'VC9', code: 'VOUCHER_CHUA_DU_DON', error: 'Chưa đủ' }]), JSON.stringify(b));
    k('A2 docBaoGia: POS cũ không voucher_loi → voucherLoi []', bang(D.docBaoGia({ tong: 1 }).voucherLoi, []));
    k('A2 tenGiam: "Voucher VC7", "Giảm phí giao", "Mã khuyến mãi"; hạng / Giờ vàng như cũ', D.tenGiam({ loai: 'voucher', ma: 'VC7' }) === 'Voucher VC7' && D.tenGiam({ loai: 'voucher_ship', ma: 'GT3' }) === 'Giảm phí giao'
      && D.tenGiam({ loai: 'ma_giam' }) === 'Mã khuyến mãi' && D.tenGiam({ loai: 'hang' }, 'Vàng') === 'Ưu đãi hạng Vàng' && D.tenGiam({ loai: 'gio_vang' }) === 'Giờ vàng' && D.tenGiam({ loai: 'la' }) === 'Giảm giá' && D.tenGiam({ loai: 'voucher' }) === 'Giảm giá');
  });

  await thu('B', async () => {
    const css = docTho('src/giaoDien/voucher.css');
    const demo = docTho('thiet_ke/app_kh_demo.html').replace(/data:[^"')\s]{100,}/g, '');
    const md = docMau(demo);
    const la = [...docMau(css)].filter((x) => !md.has(x));
    k('B6 src/giaoDien/voucher.css có, 0 màu ngoài demo', css.length > 200 && la.length === 0, la.join(' · '));
    const lop = [...new Set([...css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, '').replace(/\{[^}]*\}/g, '{}').matchAll(/\.([A-Za-z][\w-]*)/g)].map((m) => m[1]))];
    const DEMO_LOP = ['voucher', 'strip', 'body', 't', 's', 'use'];
    const sai = lop.filter((x) => !x.startsWith('vc-') && !DEMO_LOP.includes(x));
    k('B6 mọi lớp mới tiền tố `vc-` (lớp demo giữ: .voucher .strip .body .t .s .use)', lop.some((x) => x.startsWith('vc-')) && sai.length === 0, sai.join(','));
    k('B6 Giỏ hàng, Ưu đãi, Thanh toán nạp voucher.css', ['src/pages/GioHang.jsx', 'src/pages/UuDai.jsx', 'src/pages/ThanhToan.jsx'].every((f) => /import '\.\.\/giaoDien\/voucher\.css';/.test(doc(f))));
    const thieu = [];
    for (const [f, ds] of Object.entries(KHOA_MOI)) { const t = doc(f); for (const x of ds) if (!t.includes(`'${x}'`)) thieu.push(x); }
    k('B6 mọi chữ mới có mục trong danh mục (taiKhoan.js / donHang.js)', thieu.length === 0, thieu.join(','));
    const { DON_HANG } = await nap('src/noiDung/nd/donHang.js');
    const m = (x) => DON_HANG.find((y) => y.khoa === x) || {};
    k('B6 "giam.voucher" đổi chữ mặc định thành "Mã khuyến mãi"; gợi ý ô mã mới "Nhập mã khuyến mãi (nếu có)"', m('giam.voucher').macDinh === 'Mã khuyến mãi' && m('gio.ma.goiYKm').macDinh === 'Nhập mã khuyến mãi (nếu có)');
    k('B6 mo_ta / lỗi POS là mục khoá pos', m('gio.vc.moTa').khoaBoi === 'pos' && m('gio.vc.loi').khoaBoi === 'pos');
    const app = doc('src/App.jsx');
    k('B4 App tính MỘT mảng vouchers (dsGui) và đưa CÙNG biến cho Giỏ hàng và Thanh toán đồ uống', /dsGui\(/.test(app) && /<GioHang [^\n]*vouchers=\{vouchers\}/.test(app) && /<ThanhToan daTra=[^\n]*vouchers=\{vouchers\}/.test(app));
    const ham = (ten) => (new RegExp(`const ${ten} = [^\\n]*`).exec(app) || [''])[0];
    k('B4 đổi khách (docLaiGio) / đăng xuất (donPhien) xoá lựa chọn voucher cùng mã giảm', /datChonVc\(CHON_RONG\)/.test(ham('docLaiGio')) && /datChonVc\(CHON_RONG\)/.test(ham('donPhien')));
    k('B4 đơn trả (daTra) / huỷ (daHuy) / vừa đặt (xongDatDon) làm mới cuaVoucher', ['daTra', 'daHuy', 'xongDatDon'].every((x) => /cuaVoucher/.test(ham(x))), ['daTra', 'daHuy', 'xongDatDon'].map(ham).join(' | '));
    const tt = doc('src/pages/ThanhToan.jsx');
    k('B5 Thanh toán đồ uống: tuy = { maGiam, vouchers }', /tuy = cheDoThe \? KHONG_MA : \{ maGiam, vouchers \}/.test(tt), (/const tuy = [^\n]*/.exec(tt) || [''])[0]);
  });

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await thu('trình duyệt', () => trinhDuyet(pw));
  }
  console.log(`  (chạy hết ${Math.round(process.uptime())} giây — bộ kiểm cắt ở 120 giây)`);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

// ───────── Phần 2: App thật dựng bằng esbuild + POS giả xét voucher theo thứ tự ─────────
async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goi = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent', nodePaths: [path.join(__dirname, '..', 'node_modules')],
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const tepCss = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => 'src/' + m[1]);
  for (const f of fs.readdirSync(path.join(GOC, 'src/pages')).map((x) => 'src/pages/' + x).concat(fs.readdirSync(path.join(GOC, 'src/components')).map((x) => 'src/components/' + x))) {
    for (const m of doc(f).matchAll(/import '\.\.\/(giaoDien\/[^']+\.css)'/g)) if (!tepCss.includes('src/' + m[1])) tepCss.push('src/' + m[1]);
  }
  const css = tepCss.map(cssTron).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const BAY = (g) => `2026-11-16T${g}`;
  const anhDir = process.env.LUU_ANH_DIR || '';

  async function may(ten, { rong = 390, dn = true, gio = GIO, S0 = {} } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.clock.install({ time: new Date('2026-11-16T15:30:00+07:00') }); await ctx.clock.resume();
    await ctx.addInitScript(({ dn, gio }) => {
      if (sessionStorage.getItem('da_gieo')) return;
      sessionStorage.setItem('da_gieo', '1');
      localStorage.setItem('kh_ngay_man_dau', '2026-11-16');
      if (dn) localStorage.setItem('kh_token', 'tok-A');
      if (gio) localStorage.setItem('kh_gio', JSON.stringify(gio));
    }, { dn, gio });
    const S = { vi: VI_GIO, maKm: [], tatCa: null, bgGui: [], donGui: [], goi: [], treBg: 0, treVc: 0, kichDon: null, nhanLoi: null, ...S0 };
    function baoGia(t) {
      const tam = t.mon.reduce((s, d) => s + (GIA[d.ma] || 0) * d.so_luong, 0);
      const giam = [], loiVc = [];
      let con = tam, so = 0, coPt = false;
      if (t.ma_giam === 'BILL123') { giam.push({ loai: 'ma_giam', so_tien: 10000 }); con -= 10000; }
      for (const ma of t.vouchers || []) {
        const v = S.vi.find((x) => x.code.toUpperCase() === String(ma).toUpperCase());
        const bao = (code, error) => loiVc.push({ ma, code, error });
        if (!v) { bao('VOUCHER_KHONG_TON_TAI', 'Voucher không có trong ví'); continue; }
        if (String(v.kieu).startsWith('ship')) { bao('VOUCHER_SHIP_CAN_GIAO', 'Voucher giảm phí giao chỉ dùng khi đặt giao hàng'); continue; }
        if (tam < (v.min_order || 0)) { bao('VOUCHER_CHUA_DU_DON', `Đơn chưa đủ tối thiểu ${v.min_order / 1000}.000đ (tính trên món thường)`); continue; }
        if (so >= 3) { bao('VUOT_SO_VOUCHER', 'Mỗi đơn dùng tối đa 3 voucher'); continue; }
        if (v.kieu === 'phan_tram' && coPt) { bao('VOUCHER_PHAN_TRAM_HAI', 'Mỗi đơn chỉ một voucher phần trăm'); continue; }
        so++; if (v.kieu === 'phan_tram') coPt = true;
        const tien = v.kieu === 'phan_tram' ? Math.round((con * v.gia_tri) / 100) : Math.min(con, v.gia_tri || 0);
        con -= tien; giam.push({ loai: 'voucher', ma: v.code, so_tien: tien });
      }
      return { success: true, dong: t.mon.map((d) => ({ ma: d.ma, so_luong: d.so_luong, don_gia: GIA[d.ma], thanh_tien: GIA[d.ma] * d.so_luong })), tam_tinh: tam, giam, phi_giao: 0, tong: con, ma_giam_loi: null, voucher_loi: loiVc };
    }
    const loiTrang = [];
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      let than = null; try { than = JSON.parse(req.postData()); } catch { /* không thân */ }
      S.goi.push(`${pt} ${duong}${u.search}`);
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: BAY('15:30:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(200, { success: true, data: MENU_DS });
      if (!/tok-A/.test(req.headers().authorization || '')) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(200, { success: true, khach: { sdt: '0909123456', ten: 'Linh', ngay_tao: BAY('08:00:00'), xung_ho: 'chi', dia_chi: null, qr: 'QR', hang: null, so_du_vi: 0 } });
      if (duong === '/diem') return json(200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') {
        if (S.treVc) await new Promise((x) => setTimeout(x, S.treVc));
        return json(200, { success: true, data: u.searchParams.get('all') && S.tatCa ? S.tatCa : S.vi, ma_khach_moi: S.maKm });
      }
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-12-16T08:00:00' });
      if (duong === '/nhan-ma-bill' && pt === 'POST') {
        if (S.nhanLoi) return json(400, { error: `Lời POS: ${S.nhanLoi}`, code: S.nhanLoi });
        return json(200, { success: true, data: { voucher_code: 'KM8', mo_ta: KM8.mo_ta, kieu: 'phan_tram', ap_dung: 'tat_ca', scope: 'order', discount_type: 'percent', discount_value: 10 } });
      }
      if (duong === '/gio/bao-gia') {
        S.bgGui.push(than);
        if (S.treBg) await new Promise((x) => setTimeout(x, S.treBg));
        return json(200, baoGia(than));
      }
      if (duong === '/don' && pt === 'POST') {
        S.donGui.push(than);
        if (S.kichDon) return json(400, { error: `Lời POS: ${S.kichDon}`, code: S.kichDon });
        const bg = baoGia(than);
        return json(200, { success: true, ma_don: 'TQD42', tong: bg.tong, giu_vi: 0, con_lai: bg.tong, tien_trinh: 'cho_tra', qr: { chuoi: '00020101021238570010A000000727TQD42', het_han: BAY('15:40:00') }, trung: false });
      }
      if (duong === '/don' && pt === 'GET') return json(200, { success: true, trang: 1, con_nua: false, data: [] });
      if (duong.startsWith('/don/') && pt === 'GET') return json(200, { success: true, don: { ma: 'TQD42', ngay: BAY('15:31:00'), tong: 69000, da_tra: 0, tien_trinh: 'cho_tra', qr: { chuoi: '00020101021238570010A000000727TQD42', het_han: BAY('15:40:00') }, mon: [] } });
      return json(500, { error: 'chưa giả', code: 'LOI_MAY_CHU' });
    });
    const t = await ctx.newPage(); t.on('pageerror', (e) => loiTrang.push(e.message)); t.setDefaultTimeout(6000);
    try { await chay({ t, S }); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); }
    k(`[${ten}] trang không báo lỗi JS`, loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }

  const mo = async (t, duong) => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); };
  const chu = (t, sel) => t.locator(sel).first().innerText().catch(() => '');
  const doi = async (t, fn, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await t.waitForTimeout(40); } return false; };
  // Màn cuộn trong .screens → chụp đầu màn, rồi cuộn xuống cuối chụp thêm "-duoi"; cuộn lại đầu.
  const chup = async (t, ten) => {
    if (!anhDir) return;
    await t.screenshot({ path: path.join(anhDir, ten + '.png') });
    await t.evaluate(() => { const s = document.querySelector('.screens'); if (s) s.scrollTop = s.scrollHeight; });
    await t.waitForTimeout(150);
    await t.screenshot({ path: path.join(anhDir, ten + '-duoi.png') });
    await t.evaluate(() => { const s = document.querySelector('.screens'); if (s) s.scrollTop = 0; });
  };
  const the = (t, ma) => t.locator('#rewards .voucher', { hasText: ma }).first();
  const o = (t, ma) => t.locator('#cart .vc-chon', { hasText: ma }).first();
  const tich = async (t, ma) => (await o(t, ma).getAttribute('aria-pressed').catch(() => null)) === 'true';
  const bgCuoi = (S) => S.bgGui[S.bgGui.length - 1] || {};
  const choBg = (t, S, fn, ms) => doi(t, async () => fn(bgCuoi(S)), ms);
  // Báo giá của mảng gửi cuối đã về và màn đã vẽ lại (bảng tiền có tổng).
  const yen = async (t) => { await t.waitForTimeout(700); await doi(t, async () => /Tổng/.test(await chu(t, '.bang-tien')) && !(await t.locator('.bang-tien .summary-row.total').count() === 0)); };
  const cong = (t, i) => t.locator('#cart .cart-item').nth(i).locator('.qty-ctrl button').nth(1).click();

  const CA = [];
  const them = (ten, opt, f) => CA.push(() => may(ten, opt, f));

  them('uudai', { S0: { vi: [VC7, KM8, GT3, VC5, VCCU], maKm: [MA_KM] } }, async ({ t, S }) => {
    await mo(t, '/uudai');
    await doi(t, async () => (await t.locator('#rewards .voucher', { hasText: 'VC7' }).count()) > 0);
    const v7 = the(t, 'VC7');
    k('B1 thẻ voucher: tên = mo_ta POS nguyên văn, chip "Đổi điểm", mã nét đứt', (await chu(t, '#rewards .voucher:has-text("VC7") .t')) === VC7.mo_ta && (await v7.locator('.vc-chip').innerText().catch(() => '')) === 'Đổi điểm' && (await v7.locator('.vc-ma').innerText().catch(() => '')) === 'VC7', await v7.innerText().catch(() => ''));
    k('B1 chip nguồn: khach_moi "Khách mới", gioi_thieu "Giới thiệu bạn"; nguồn lạ → không chip', (await the(t, 'KM8').locator('.vc-chip').innerText().catch(() => '')) === 'Khách mới' && (await the(t, 'GT3').locator('.vc-chip').innerText().catch(() => '')) === 'Giới thiệu bạn' && (await the(t, 'VC5').locator('.vc-chip').count()) === 0);
    k('B1 voucher dùng được có nút "Dùng ngay"', (await v7.locator('button', { hasText: 'Dùng ngay' }).count()) === 1 && (await the(t, 'KM8').locator('button', { hasText: 'Dùng ngay' }).count()) === 1);
    const g3 = the(t, 'GT3');
    k('B1 voucher ship: thẻ mờ (vc-ship) + "Dùng khi đặt giao hàng", KHÔNG nút', /vc-ship/.test(await g3.getAttribute('class')) && /Dùng khi đặt giao hàng/.test(await g3.innerText()) && (await g3.locator('button').count()) === 0);
    k('B1 voucher không mo_ta (trước v15) → cách cũ: tên reward_name, dòng mã', /Giảm 20\.000đ/.test(await chu(t, '#rewards .voucher:has-text("VCCU") .t')) && /VCCU/.test(await chu(t, '#rewards .voucher:has-text("VCCU") .s')));
    k('B1 thẻ giữ lớp demo .voucher .strip .body .t; nút dùng lớp .use', (await v7.locator('.strip').count()) === 1 && (await v7.locator('.body .t').count()) === 1 && (await v7.locator('button.use').count()) === 1);
    k('B1 ma_khach_moi hiện như cũ (Ưu đãi khách mới) + "Dùng ngay"', /Ưu đãi khách mới/.test(await the(t, 'BILL123').innerText().catch(() => '')) && (await the(t, 'BILL123').locator('button', { hasText: 'Dùng ngay' }).count()) === 1);
    k('B1 thẻ có mo_ta KHÔNG tự ghép câu giảm (không dòng "· giảm …" / "hạn dùng đến")', !/hạn dùng đến| · giảm/.test(await v7.innerText()), await v7.innerText());
    await chup(t, 'uudai-vi-voucher-390');
    S.tatCa = [{ ...VC7 }, V('OLD1', 'tien', 1, 0, '2026-10-01T00:00:00', 'doi_diem', 'Giảm 10.000đ · đã dùng', { status: 'used' }), V('OLD2', 'tien', 1, 0, '2026-10-01T00:00:00', 'doi_diem', 'Giảm 15.000đ · hết hạn', { status: 'expired' }), V('OLD3', 'tien', 1, 0, '2026-12-01T00:00:00', 'khach_moi', 'Giảm 30.000đ · đơn gốc đã huỷ', { status: 'disabled' })];
    await t.locator('#rewards .more-l span', { hasText: 'Xem tất cả' }).click();
    await doi(t, async () => (await t.locator('#rewards .voucher', { hasText: 'OLD3' }).count()) > 0);
    const nhan = async (ma) => (await the(t, ma).locator('.use').innerText().catch(() => '')).trim();
    k('B1 "Xem tất cả": nhãn "Đã dùng" / "Hết hạn" / "Chưa dùng được", không nút', (await nhan('OLD1')) === 'Đã dùng' && (await nhan('OLD2')) === 'Hết hạn' && (await nhan('OLD3')) === 'Chưa dùng được' && (await t.locator('#rewards .voucher:has-text("OLD") button').count()) === 0, `${await nhan('OLD1')}|${await nhan('OLD2')}|${await nhan('OLD3')}`);
    k('B1 "Xem tất cả": voucher available vẫn có "Dùng ngay"', (await the(t, 'VC7').locator('button', { hasText: 'Dùng ngay' }).count()) === 1);
    await chup(t, 'uudai-xem-tat-ca-390');
  });

  them('dung-ngay', { S0: { vi: VI_GIO } }, async ({ t, S }) => {
    await mo(t, '/uudai');
    await doi(t, async () => (await the(t, 'VC5').locator('button').count()) > 0);
    await the(t, 'VC5').locator('button', { hasText: 'Dùng ngay' }).click();
    k('B1 "Dùng ngay" → mở Giỏ hàng', await doi(t, async () => /\/giohang$/.test(t.url())), t.url());
    k('B1/B4 voucher vừa "Dùng ngay" (không hạn — bình thường đứng cuối) đứng ĐẦU mảng gửi POS', await choBg(t, S, (b) => bang(b.vouchers, ['VC5', 'VC7', 'KM8', 'VC9'])), JSON.stringify(bgCuoi(S).vouchers));
    await yen(t);
    k('B1 Giỏ: voucher vừa "Dùng ngay" → tích', await doi(t, async () => tich(t, 'VC5')));
  });

  them('dung-ngay-ma-chung', { S0: { vi: [VC7], maKm: [MA_KM] } }, async ({ t, S }) => {
    await mo(t, '/uudai');
    await doi(t, async () => (await the(t, 'BILL123').locator('button').count()) > 0);
    await the(t, 'BILL123').locator('button', { hasText: 'Dùng ngay' }).click();
    k('B1 ma_khach_moi "Dùng ngay" → Giỏ, ô mã điền BILL123, báo giá gửi ma_giam BILL123', await doi(t, async () => /\/giohang$/.test(t.url()) && (await t.locator('#cart .promo-box input').inputValue().catch(() => '')) === 'BILL123') && await choBg(t, S, (b) => b.ma_giam === 'BILL123'), JSON.stringify(bgCuoi(S)));
    await yen(t);
    k('A2/B3 bảng tiền: dòng mã chung "Mã khuyến mãi", dòng voucher "Voucher VC7"', /Mã khuyến mãi\s*−10\.000đ/.test(await chu(t, '.bang-tien')) && /Voucher VC7\s*−20\.000đ/.test(await chu(t, '.bang-tien')), await chu(t, '.bang-tien'));
  });

  them('dung-ngay-gio-trong', { gio: null, S0: { vi: [VC7, KM8] } }, async ({ t, S }) => {
    await mo(t, '/uudai');
    await doi(t, async () => (await the(t, 'KM8').locator('button').count()) > 0);
    await the(t, 'KM8').locator('button', { hasText: 'Dùng ngay' }).click();
    k('B1 "Dùng ngay" khi giỏ trống → màn giỏ trống', await doi(t, async () => /\/giohang$/.test(t.url()) && (await t.locator('#cart .empty-cart').count()) === 1));
    await t.locator('.tab', { hasText: 'Menu' }).first().click();
    await t.locator('.cat-tiles .ct', { hasText: 'Cà phê' }).first().click();
    await t.locator('.prod-card', { hasText: 'Cà phê Muối' }).first().click();
    await t.locator('.detail-addcart').click();
    await t.waitForTimeout(300);
    await t.locator('.tab', { hasText: 'Giỏ' }).first().click();
    k('B1 thêm món sau "Dùng ngay" → voucher vẫn được nhớ, đứng đầu mảng gửi', await choBg(t, S, (b) => Array.isArray(b.vouchers) && b.vouchers[0] === 'KM8'), JSON.stringify(bgCuoi(S)));
  });

  them('gio', { S0: { vi: VI_GIO } }, async ({ t, S }) => {
    await mo(t, '/giohang');
    k('A1/B3 báo giá gửi vouchers theo hạn sớm, KHÔNG voucher ship', await choBg(t, S, (b) => bang(b.vouchers, ['VC7', 'KM8', 'VC9', 'VC5'])), JSON.stringify(bgCuoi(S).vouchers));
    await yen(t);
    k('B3 tự tích mọi voucher POS tính (VC7, KM8, VC5)', await doi(t, async () => (await tich(t, 'VC7')) && (await tich(t, 'KM8')) && (await tich(t, 'VC5'))));
    k('B3 voucher chưa đủ đơn → KHÔNG tích + câu POS màu đỏ ngay dưới', !(await tich(t, 'VC9')) && /Đơn chưa đủ tối thiểu 150\.000đ/.test(await o(t, 'VC9').locator('.vc-loi').innerText().catch(() => '')));
    const g3 = o(t, 'GT3');
    k('B3 voucher ship: mờ (vc-tat), "Dùng khi đặt giao hàng", không chạm được', /vc-tat/.test(await g3.getAttribute('class')) && (await g3.isDisabled()) && /Dùng khi đặt giao hàng/.test(await g3.innerText()));
    k('B3 tiêu đề "Voucher của bạn" + "Tự chọn sẵn · chạm để bỏ"; ô mo_ta + mã', /Voucher của bạn/.test(await chu(t, '#cart')) && /Tự chọn sẵn · chạm để bỏ/.test(await chu(t, '#cart')) && /Giảm 20\.000đ cho đơn từ 50\.000đ/.test(await o(t, 'VC7').innerText()));
    k('B3 ô mã: "Mã khuyến mãi" + "1 mã / đơn", gợi ý "Nhập mã khuyến mãi (nếu có)"', /Mã khuyến mãi/.test(await chu(t, '#cart')) && /1 mã \/ đơn/.test(await chu(t, '#cart')) && (await t.locator('#cart .promo-box input').getAttribute('placeholder')) === 'Nhập mã khuyến mãi (nếu có)');
    k('B3 mục voucher nằm TRÊN ô mã, dưới các món', await t.evaluate(() => { const a = document.querySelector('#cart .vc-chon'), b = document.querySelector('#cart .promo-box'), c = [...document.querySelectorAll('#cart .cart-item')].pop(); return !!a && !!b && !!c && (c.compareDocumentPosition(a) & 4) && (a.compareDocumentPosition(b) & 4); }));
    k('B3 bảng tiền từng dòng "Voucher VC7 −20.000đ"', /Voucher VC7\s*−20\.000đ/.test(await chu(t, '.bang-tien')), await chu(t, '.bang-tien'));
    await chup(t, 'gio-voucher-390');
    // Giỏ đổi: chờ báo giá mới vẫn giữ tích / câu đỏ của báo giá cuối; đủ tiền → tự tích lại.
    S.treBg = 1500;
    await cong(t, 1); await cong(t, 1); // CFM 3 ly → 177.000đ
    await t.waitForTimeout(800);
    k('B3 đang chờ báo giá mới: tích / câu đỏ giữ theo báo giá cuối (không nhấp nháy)', (await tich(t, 'VC7')) && !(await tich(t, 'VC9')) && (await o(t, 'VC9').locator('.vc-loi').count()) === 1);
    S.treBg = 0;
    k('B3 thêm món đủ tiền → VC9 tự tích; POS bỏ cái thứ 4 (VC5 "tối đa 3")', await doi(t, async () => (await tich(t, 'VC9')) && !(await tich(t, 'VC5')) && /tối đa 3/.test(await o(t, 'VC5').innerText())), await o(t, 'VC5').innerText());
    // Chọn tay cái thứ 4 → đứng đầu mảng, POS bỏ cái cuối.
    await o(t, 'VC5').click();
    k('B3 chạm ô không tích → vào ĐẦU mảng gửi', await choBg(t, S, (b) => bang(b.vouchers, ['VC5', 'VC7', 'KM8', 'VC9'])), JSON.stringify(bgCuoi(S).vouchers));
    await yen(t);
    k('B3 POS ưu tiên cái vừa chọn: VC5 tích, VC9 (cuối) thôi tích', await doi(t, async () => (await tich(t, 'VC5')) && !(await tich(t, 'VC9'))));
    // Bỏ tay → không gửi, không tích lại khi giỏ đổi.
    await o(t, 'VC7').click();
    k('B3 chạm ô đang tích → bỏ: không gửi nữa', await choBg(t, S, (b) => Array.isArray(b.vouchers) && !b.vouchers.includes('VC7')), JSON.stringify(bgCuoi(S).vouchers));
    await yen(t);
    k('B3 ô đã bỏ tay: không tích, không câu', !(await tich(t, 'VC7')) && (await o(t, 'VC7').locator('.vc-loi').count()) === 0);
    await cong(t, 0);
    await yen(t);
    k('B3 giỏ đổi sau khi bỏ tay → vẫn không gửi, không tự tích lại', !bgCuoi(S).vouchers.includes('VC7') && !(await tich(t, 'VC7')), JSON.stringify(bgCuoi(S).vouchers));
    const mangGio = bgCuoi(S).vouchers;
    await chup(t, 'gio-voucher-chon-tay-390');
    // Thanh toán: cùng mảng.
    await t.locator('#cart .checkout-btn').click();
    await doi(t, async () => /\/thanhtoan$/.test(t.url()));
    await doi(t, async () => (await t.locator('#checkout .nut-dat').getAttribute('aria-disabled').catch(() => 'true')) !== 'true' && /Thanh toán qua QR/.test(await chu(t, '#checkout .nut-dat')));
    const truoc = S.goi.filter((x) => x === 'GET /voucher').length;
    k('B4/B5 báo giá ở Thanh toán gửi ĐÚNG mảng của Giỏ', bang(bgCuoi(S).vouchers, mangGio), `${JSON.stringify(bgCuoi(S).vouchers)} ≠ ${JSON.stringify(mangGio)}`);
    await t.locator('#checkout .nut-dat').click();
    k('B5 thân POST /don có ĐÚNG mảng vouchers của báo giá đang hiện', await doi(t, async () => S.donGui.length === 1) && bang(S.donGui[0].vouchers, mangGio), JSON.stringify(S.donGui[0]));
    k('B4 đặt xong (đơn QR giữ voucher) → làm mới ví voucher', await doi(t, async () => S.goi.filter((x) => x === 'GET /voucher').length > truoc));
  });

  them('thanh-toan-loi', { S0: { vi: [VC7, VC9] } }, async ({ t, S }) => {
    await mo(t, '/thanhtoan');
    await doi(t, async () => (await t.locator('#checkout .vc-chua').count()) > 0);
    const kh = await chu(t, '#checkout .vc-chua');
    k('B5 Thanh toán: khối "Voucher chưa dùng được" liệt kê câu POS', /Voucher chưa dùng được/.test(kh) && /VC9/.test(kh) && /Đơn chưa đủ tối thiểu 150\.000đ/.test(kh), kh);
    k('B5 Thanh toán: bảng tiền "Voucher VC7"', /Voucher VC7\s*−20\.000đ/.test(await chu(t, '#checkout .bang-tien')));
    k('B5/K5 voucher POS không tính KHÔNG khoá nút đặt', await doi(t, async () => (await t.locator('#checkout .nut-dat').getAttribute('aria-disabled')) !== 'true'));
    await chup(t, 'thanhtoan-voucher-390');
    S.kichDon = 'VOUCHER_DANG_GIU';
    await t.locator('#checkout .nut-dat').click();
    k('B5 lỗi đặt đơn VOUCHER_DANG_GIU → lời POS nguyên văn', await doi(t, async () => /Lời POS: VOUCHER_DANG_GIU/.test(await chu(t, '#checkout'))));
  });

  them('khong-voucher', { S0: { vi: [] } }, async ({ t, S }) => {
    await mo(t, '/giohang');
    await choBg(t, S, (b) => Array.isArray(b.mon));
    await yen(t);
    k('A2/K5 ví trống: thân báo giá y như gốc (không `vouchers`), không mục voucher', bang(bgCuoi(S), thanGoc(GIO)) && (await t.locator('#cart .vc-chon').count()) === 0, JSON.stringify(bgCuoi(S)));
    await t.locator('#cart .checkout-btn').click();
    await doi(t, async () => (await t.locator('#checkout .nut-dat').getAttribute('aria-disabled').catch(() => 'true')) !== 'true');
    await t.locator('#checkout .nut-dat').click();
    k('A2/K5 thân POST /don không có `vouchers`', await doi(t, async () => S.donGui.length === 1) && !('vouchers' in S.donGui[0]), JSON.stringify(S.donGui[0]));
  });

  them('vi-dang-tai', { S0: { vi: VI_GIO, treVc: 2500 } }, async ({ t }) => {
    await mo(t, '/giohang');
    await t.waitForTimeout(900);
    k('B3 ví đang tải → không mục voucher (giỏ như cũ)', (await t.locator('#cart .vc-chon').count()) === 0 && (await t.locator('#cart .cart-item').count()) === 2);
    k('B3 ví về → mục voucher hiện', await doi(t, async () => (await t.locator('#cart .vc-chon').count()) === 5, 5000));
  });

  them('chua-dang-nhap', { dn: false }, async ({ t }) => {
    await mo(t, '/giohang');
    await t.waitForTimeout(600);
    k('B3 chưa đăng nhập → không mục voucher', (await t.locator('#cart .vc-chon').count()) === 0 && (await t.locator('#cart .cart-item').count()) === 2);
  });

  them('nhan-ma', { S0: { vi: [VC7] } }, async ({ t, S }) => {
    await mo(t, '/uudai');
    await t.locator('#ma-bill').fill('BILL777');
    const truoc = S.goi.filter((x) => x === 'GET /voucher').length;
    await t.locator('#rewards button', { hasText: 'Nhận ưu đãi khách mới' }).click();
    k('B2 nhận ưu đãi khách mới → "Đã thêm vào ví voucher: {mo_ta}"', await doi(t, async () => (await chu(t, '#rewards .nt-state.on')) === `Đã thêm vào ví voucher: ${KM8.mo_ta}`), await chu(t, '#rewards .nt-state.on'));
    k('B2 nhận xong làm mới ví voucher', await doi(t, async () => S.goi.filter((x) => x === 'GET /voucher').length > truoc));
    await chup(t, 'uudai-nhan-khach-moi-390');
    for (const ma of ['CAN_TAO_TAI_KHOAN', 'KHACH_DA_CO_TAI_KHOAN', 'UU_DAI_CHUA_CO_MAU']) {
      S.nhanLoi = ma;
      await t.locator('#ma-bill').fill('BILL778');
      await t.locator('#rewards button', { hasText: 'Nhận ưu đãi khách mới' }).click();
      k(`B2 lỗi ${ma} → lời POS nguyên văn`, await doi(t, async () => (await chu(t, '#rewards .nt-state[role="alert"]')) === `Lời POS: ${ma}`));
    }
  });

  const t0 = Date.now();
  const hang = [...CA];
  await Promise.all([...Array(4)].map(async () => { while (hang.length) await hang.shift()(); }));
  console.log(`  (phần trình duyệt ${Math.round((Date.now() - t0) / 1000)} giây)`);
  await trinh.close();
}
