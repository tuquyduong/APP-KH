#!/usr/bin/env node
// THỬ KH-THE-2 — thẻ hội viên theo thiết kế 14.11: thẻ không vào giỏ, "Mua ngay" thẳng Thanh toán thẻ (chỉ QR, không ví, không mã giảm),
// So sánh nhanh ở đầu màn Hạng thành viên, màn "Chào mừng hội viên", thẻ ở Ưu đãi theo tình trạng.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): hàm thuần + đọc nguồn · Phần 2: App thật trong Chromium (POS giả dựng TỪ hợp đồng v13; không có Playwright /
// KHONG_TRINH_DUYET=1 → in "BỎ QUA", không tính ca). Chạy: node cong_cu/thu_KHTHE2.js → dòng cuối "n đạt · m hỏng".
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
const khoGia = (d = {}) => ({ d, getItem: (x) => (x in d ? d[x] : null), setItem: (x, v) => { d[x] = String(v); }, removeItem: (x) => { delete d[x]; } });
const loi = (status, code) => Object.assign(new Error(code || 'lỗi'), { status, code });

// POS giả theo hợp đồng v13 (số như bản thiết kế 14.11): hạng 2 Vàng bán 1 / 3 tháng, hạng 3 Kim Cương chỉ cấp, hạng 1 0 % (ẩn).
const HANG = [
  { id: 1, ten: 'Bạc', phan_tram: 0, phan_tram_nhom_dac_biet: 0, chi_cap: false, goi: [], thu_bac: 1, gia_the: null, thu_tu: 1, quyen_loi: [] },
  { id: 2, ten: 'Vàng', phan_tram: 3, phan_tram_nhom_dac_biet: 4, chi_cap: false, goi: [{ so_thang: 1, gia: 100000 }, { so_thang: 3, gia: 295000 }], thu_bac: 2, gia_the: 100000, thu_tu: 2, quyen_loi: ['Tích điểm ×1,2'] },
  { id: 3, ten: 'Kim Cương', phan_tram: 10, phan_tram_nhom_dac_biet: 10, chi_cap: true, goi: [], thu_bac: 3, gia_the: null, thu_tu: 3, quyen_loi: [] },
];
const MENU_DS = [
  { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà', gia: 30000, con_hang: true, gia_hang: [{ hang_id: 2, gia: 29100 }, { hang_id: 3, gia: 27000 }] },
];
const THE = (hang_id = 2, so_thang = 3) => ({ loai: 'the', hang_id, so_thang });
const LY = (ma = 'TLB', so_luong = 1, ghi_chu = '') => ({ ma, so_luong, ghi_chu });
const BAY = '2026-11-14T20:30:00';
const TOI = (het_han, id = 2) => ({ id, ten: HANG.find((h) => h.id === id).ten, phan_tram: HANG.find((h) => h.id === id).phan_tram, phan_tram_nhom_dac_biet: 0, het_han });

(async () => {
  const G = await nap('src/gio.js'), D = await nap('src/datDon.js'), H = await nap('src/giaHang.js'), DD = await nap('src/duongDan.js'), SW = await nap('src/dangKySW.js');
  const ND = await nap('src/noiDung/nd.js');

  console.log('A — thẻ không vào giỏ');
  await thu('A1', async () => {
    k('A1 docGio bản lưu cũ [ly, thẻ] → chỉ [ly] (không báo, không lỗi)', bang(G.docGio(khoGia({ kh_gio: JSON.stringify([LY(), THE()]) })), [LY()]));
    const kho = khoGia();
    G.ghiGio([THE(), LY('TLB', 2)], kho);
    k('A1 ghiGio không lưu dòng thẻ', kho.d.kh_gio === JSON.stringify([LY('TLB', 2)]), kho.d.kh_gio);
    k('A1 gio.js không còn themThe; datDon.js không còn phanGui / thamThanhToanLai; giaHang.js không còn lopHang / dongGoi', !('themThe' in G) && !('phanGui' in D) && !('thamThanhToanLai' in D) && !('lopHang' in H) && !('dongGoi' in H));
    k('A1 demMon chỉ đếm ly', G.demMon([LY('TLB', 2)]) === 2);
    k('A1 /thanhtoan?chi=the → không còn tham số chi', !('chi' in DD.docDuongDan('/thanhtoan?chi=the').tham) && DD.docDuongDan('/thanhtoan?chi=the').chuan === '/thanhtoan');
    const gio = doc('src/pages/GioHang.jsx'), app = doc('src/App.jsx');
    k('A1 nguồn: GioHang.jsx không còn DongThe / traTheTruoc / gio.truocThe; App.jsx không còn traTheTruoc / themThe / chiThe', !/DongThe|traTheTruoc|truocThe|tenDongThe/.test(gio) && !/traTheTruoc|themThe|chiThe|thamThanhToanLai/.test(app));
    k('A2 Đặt lại vẫn bỏ dòng thẻ', bang(D.monDatLai({ mon: [{ ma: null, loai: 'the', so_luong: 1 }, { ma: 'TLB', so_luong: 1, ghi_chu: '' }] }, MENU_DS), { them: [LY()], boQua: 0 }));
  });

  console.log('B — So sánh nhanh / dòng phụ');
  await thu('B2', async () => {
    k('B2 MOC_TIET_KIEM = 1.000.000, khai MỘT chỗ', H.MOC_TIET_KIEM === 1000000 && (doc('src/giaHang.js').match(/MOC_TIET_KIEM\s*=/g) || []).length === 1);
    const t = (p) => H.tietKiemMotTrieu({ phan_tram: p });
    k('B2 tiết kiệm 1 triệu: 0 → 0; 3 → 30.000; 10 → 100.000; 0,1 → 1.000', t(0) === 0 && t(3) === 30000 && t(10) === 100000 && t(0.1) === 1000, [t(0), t(3), t(10), t(0.1)].join(','));
    k('B2 tiết kiệm làm tròn XUỐNG đồng (3,33 % → 33.300; 0,00015 % → 1)', t(3.33) === 33300 && t(0.00015) === 1 && t(0.00019) === 1, [t(3.33), t(0.00015), t(0.00019)].join(','));
    k('B2 thiếu / sai kiểu phan_tram → null (ẩn, không 0đ bịa)', H.tietKiemMotTrieu({}) === null && t('3') === null && t(NaN) === null && H.tietKiemMotTrieu(null) === null);
    k('B2 giaCot gói rẻ nhất 1 tháng → moiThang', bang(H.giaCot(HANG[1]), { k: 'tier.cmp.moiThang', gia: 100000, so: 1 }), JSON.stringify(H.giaCot(HANG[1])));
    k('B2 giaCot gói rẻ nhất N tháng → moiNThang', bang(H.giaCot({ goi: [{ so_thang: 6, gia: 500000 }, { so_thang: 3, gia: 280000 }] }), { k: 'tier.cmp.moiNThang', gia: 280000, so: 3 }));
    k('B2 giaCot chỉ cấp → quanTang; không gói bán → chuaBan', H.giaCot(HANG[2]).k === 'tier.cmp.quanTang' && H.giaCot({ ...HANG[1], goi: [] }).k === 'tier.cmp.chuaBan');
    k('B2 coDacBiet: có hạng > 0 → true; mọi hạng 0 / thiếu → false (ẩn hàng)', H.coDacBiet(HANG) === true && H.coDacBiet(HANG.map((h) => ({ ...h, phan_tram_nhom_dac_biet: 0 }))) === false && H.coDacBiet([{ id: 1 }]) === false && H.coDacBiet(null) === false);
  });

  console.log('E — thẻ Ưu đãi theo tình trạng');
  await thu('E2', async () => {
    const ds = H.hangCoGiam(HANG);
    const tt = (h) => H.trangThaiTheUuDai(ds, h, BAY);
    k('E2 chưa hạng → chua, hạng bán ĐẦU TIÊN (Vàng)', tt(null) && tt(null).kieu === 'chua' && tt(null).hang.id === 2, JSON.stringify(tt(null)));
    k('E2 không hạng nào bán được → null (ẩn thẻ)', H.trangThaiTheUuDai([HANG[2]], null, BAY) === null);
    k('E2 hạng bán còn 8 ngày → co (soNgay 8)', tt(TOI('2026-11-22T23:59:59')).kieu === 'co' && tt(TOI('2026-11-22T23:59:59')).soNgay === 8);
    k('E2 còn 7 ngày → sap; còn 0 ngày → sap (soNgay 0)', tt(TOI('2026-11-21T23:59:59')).kieu === 'sap' && tt(TOI('2026-11-14T23:59:59')).kieu === 'sap' && tt(TOI('2026-11-14T23:59:59')).soNgay === 0);
    k('E2 hạng đã quá hạn (soNgay < 0) → chua', tt(TOI('2026-11-10T23:59:59')).kieu === 'chua');
    k('E2 hạng chỉ cấp het_han null → tang; có het_han → tang', tt(TOI(null, 3)).kieu === 'tang' && tt(TOI('2027-01-01T23:59:59', 3)).kieu === 'tang');
    k('E2 hạng bán het_han null → co (không đếm ngày)', tt(TOI(null)).kieu === 'co' && tt(TOI(null)).soNgay === null);
    k('E2 đếm ngày dùng CHÍNH soNgayCon + NGAY_NHAC_GIA_HAN (giaHang.js)', /trangThaiTheUuDai[\s\S]*soNgayCon\([\s\S]*NGAY_NHAC_GIA_HAN/.test(doc('src/giaHang.js')));
  });

  console.log('C — Thanh toán thẻ');
  await thu('C1', async () => {
    const r = DD.docDuongDan('/uudai/hang/thanhtoan?h=2&thang=3');
    k('C1 /uudai/hang/thanhtoan?h=2&thang=3 → trang thanhtoanthe, tab uudai, cần đăng nhập, cha /uudai/hang?h=2', r.trang === 'thanhtoanthe' && r.tab === 'uudai' && r.canDN === true && r.cha === '/uudai/hang?h=2' && r.chuan === '/uudai/hang/thanhtoan?h=2&thang=3', JSON.stringify(r));
    k('C1 taoDuongDan(thanhtoanthe, {h, thang})', DD.taoDuongDan('thanhtoanthe', { h: 2, thang: 3 }) === '/uudai/hang/thanhtoan?h=2&thang=3');
    k('C1 tiepHopLe giữ cả hai tham số', DD.tiepHopLe('/uudai/hang/thanhtoan?h=2&thang=3') === '/uudai/hang/thanhtoan?h=2&thang=3');
    const d = (h, thang) => G.dongTheTuDuongDan({ h, thang });
    k('C1 dongTheTuDuongDan: "2","3" → { loai, hang_id, so_thang }', bang(d('2', '3'), THE(2, 3)));
    k('C1 tham số sai (chữ, thiếu, 0, âm, số lẻ) → null', [d('abc', '3'), d('2', undefined), d('2', '0'), d('-2', '3'), d('2', '1.5'), d('', '')].every((x) => x === null));
    k('C1 gói không bán (6 tháng) / hạng chỉ cấp → trangThaiDong.conBan false', !G.trangThaiDong(THE(2, 6), null, HANG).conBan && !G.trangThaiDong(THE(3, 1), null, HANG).conBan && G.trangThaiDong(THE(2, 3), null, HANG).conBan);
    k('C1 (Q1) không tự tải lại ở Thanh toán thẻ: coTheTaiLai(/uudai/hang/thanhtoan) false; /uudai/hang vẫn true', SW.coTheTaiLai('/uudai/hang/thanhtoan', false) === false && SW.coTheTaiLai('/uudai/hang', false) === true);
  });
  await thu('C2', async () => {
    const than = D.thanDatDon([THE(2, 3)], { maGiam: '' }, { cachTra: 'qr', khoaGui: 'K'.repeat(20), tongDaXem: 295000 });
    k('C2 thân đặt đơn thẻ: mon đúng 3 khoá, cach_tra qr, không ma_giam, không pin', bang(than.mon, [THE(2, 3)]) && than.cach_tra === 'qr' && !('ma_giam' in than) && !('pin' in than));
  });
  await thu('C3', async () => {
    k('C3 cachTraDon: giỏ có thẻ → qr dù công tắc ví bật + số dư đủ', D.cachTraDon([THE()], true, { vi: true, viQr: false }) === 'qr' && D.cachTraDon([THE()], true, { vi: false, viQr: true }) === 'qr');
    k('C3 đối chứng: đơn đồ uống cùng điều kiện → vi / vi_qr / qr như cũ', D.cachTraDon([LY()], true, { vi: true, viQr: false }) === 'vi' && D.cachTraDon([LY()], true, { vi: false, viQr: true }) === 'vi_qr' && D.cachTraDon([LY()], false, { vi: true, viQr: false }) === 'qr');
    const tt = doc('src/pages/ThanhToan.jsx');
    k('C3 ThanhToan.jsx quyết cách trả qua cachTraDon (một hàm)', /cachTraDon\(/.test(tt) && !/const cachTra = !dungVi/.test(tt));
  });
  await thu('C5', async () => {
    k('C5 mã lạ 4xx có code (vd THE_KHONG_TRA_VI) → chua_tao (hiện lời POS, không "chưa rõ")', D.loaiLoi(loi(400, 'THE_KHONG_TRA_VI')) === 'chua_tao' && !D.laLoiThe(loi(400, 'THE_KHONG_TRA_VI')));
  });

  console.log('D — Chào mừng hội viên');
  await thu('D1', async () => {
    const gThe = { khoa_gui: 'K'.repeat(20), ma_don: 'TQD42', than: { mon: [THE(2, 3)] } }, gLy = { ...gThe, than: { mon: [{ ma: 'TLB', so_luong: 1 }] } };
    k('D1 thamTaoMaMoi đơn chỉ thẻ → thanhtoanthe { h, thang }', bang(D.thamTaoMaMoi(gThe), { trang: 'thanhtoanthe', tham: { h: 2, thang: 3 } }), JSON.stringify(D.thamTaoMaMoi(gThe)));
    k('D1 thamTaoMaMoi đơn đồ uống / không bản ghi → thanhtoan {}', bang(D.thamTaoMaMoi(gLy), { trang: 'thanhtoan', tham: {} }) && bang(D.thamTaoMaMoi(null), { trang: 'thanhtoan', tham: {} }));
    k('D1 hangCuaDon trả bản ghi hạng (tên + %)', D.hangCuaDon(gThe, HANG) && D.hangCuaDon(gThe, HANG).ten === 'Vàng' && D.hangCuaDon(gThe, HANG).phan_tram === 3 && D.hangCuaDon(null, HANG) === null);
  });

  console.log('F1 — danh mục nội dung');
  await thu('F1', async () => {
    const IDX = await nap('src/noiDung/nd/index.js');
    k('F1 kiemDanhMuc toàn bộ danh mục không lỗi', ND.kiemDanhMuc(IDX.DANH_MUC).length === 0, ND.kiemDanhMuc(IDX.DANH_MUC).slice(0, 3).join(' | '));
    const khoa = new Set(IDX.DANH_MUC.map((m) => m.khoa));
    const tep = ['src/pages/HangThanhVien.jsx', 'src/pages/ThanhToan.jsx', 'src/pages/TheoDoiDon.jsx', 'src/pages/UuDai.jsx', 'src/pages/GioHang.jsx', 'src/App.jsx', 'src/giaHang.js', 'src/datDon.js'];
    const dung = tep.flatMap((f) => [...doc(f).matchAll(/(?:nd|ndPhan|ndDau|ndHien|ndNut|ndAnh|ndDs)\('([\w.]+)'|\bk="([\w.]+)"|\bk: '([\w.]+)'/g)].map((m) => m[1] || m[2] || m[3]));
    const thieu = [...new Set(dung)].filter((x) => !khoa.has(x));
    k('F1 mọi khoá các màn đụng tới có trong danh mục', dung.length > 50 && thieu.length === 0, thieu.join(', '));
    const can = ['tier.cmp', 'tier.cmp.chon', 'tier.cmp.loi', 'tier.goi', 'tier.qr', 'tier.ben', 'tier.ben.chung', 'tier.note', 'tier.phu.thuong', 'the.tt.phu', 'the.tt.kichHoat', 'the.tt.khongVi', 'the.tt.nut', 'the.tt.veHang', 'the.cm.t', 'the.cm.nut', 'the.cm.veGio', 'ud.the.moi', 'ud.the.nutMua', 'ud.the.nutCo', 'ud.the.nutGiaHan', 'ud.the.nutTang', 'hien.ud.the', 'hien.the.cm', 'ud.the.pos', 'ud.the.tutinh'];
    k('F1 các khoá mới có trong danh mục', can.every((x) => khoa.has(x)), can.filter((x) => !khoa.has(x)).join(', '));
    const bo = ['tier.hienTai', 'tier.how', 'tier.buynote', 'tier.daThem', 'tier.daDoi', 'hien.tier.card', 'gio.the.ten', 'gio.truocThe.nut', 'hien.gio.truocThe', 'td.the.veGio', 'ud.hang.bang', 'ud.hang.goi', 'ud.hang.nutMua'];
    k('F1 khoá không còn dùng đã xoá khỏi danh mục', bo.every((x) => !khoa.has(x)), bo.filter((x) => khoa.has(x)).join(', '));
    const kb = (x) => (IDX.DANH_MUC.find((m) => m.khoa === x) || {}).khoaBoi;
    k('F1 phần POS → khoá pos; tiết kiệm / số ngày → tutinh', kb('ud.the.pos') === 'pos' && kb('ud.the.tutinh') === 'tutinh' && kb('tier.tutinh') === 'tutinh');
    k('F1 không còn câu "2 ly/tuần" ở danh mục', !/2 ly\/tuần/.test(docTho('src/noiDung/nd/theHang.js')));
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
  const goi = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => docTho(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...docTho('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n') + fs.readdirSync(path.join(GOC, 'src/giaoDien')).filter((f) => /\.css$/.test(f) && !/^demo|giaoDien|khau_hieu/.test(f)).map((f) => docTho('src/giaoDien/' + f)).join('\n');
  const HTML = docTho('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const URL0 = 'http://kh.test', B = (g, d = '2026-11-14') => `${d}T${g}`;
  const anhDir = process.env.LUU_ANH_DIR || '';
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const giaGoi = (id, n) => { const h = HANG.find((x) => x.id === id); const g = h && h.goi.find((x) => x.so_thang === n); return g ? g.gia : null; };
  const chu0 = (await nap('src/luuMay.js')).dauVet('0909123456'); // máy đã của đúng khách này (không xoá giỏ / công tắc ví khi /toi về)

  async function may(ten, { dn = true, gio = null, dungVi = false, S0 = {}, rong = 390 } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.clock.install({ time: new Date('2026-11-14T20:30:00+07:00') }); await ctx.clock.resume();
    await ctx.addInitScript(({ dn, gio, dungVi, chu0 }) => {
      if (location.protocol !== 'http:') return;
      if (sessionStorage.getItem('da_gieo')) return;
      sessionStorage.setItem('da_gieo', '1');
      localStorage.setItem('kh_ngay_man_dau', '2026-11-14');
      if (dn) { localStorage.setItem('kh_token', 'tok-A'); localStorage.setItem('kh_chu', chu0); }
      if (gio) localStorage.setItem('kh_gio', JSON.stringify(gio));
      if (dungVi) localStorage.setItem('kh_dung_vi', '1');
    }, { dn, gio, dungVi, chu0 });
    const S = { vi: 500000, hang: null, don: new Map(), soDon: 41, guiDon: [], baoGia: [], loiThe: '', ...S0 };
    const loiTrang = [];
    const json = (r, st, o) => r.fulfill({ status: st, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
    const loi400 = (r, code, st = 400) => json(r, st, { error: `Lời POS giả: ${code}`, code });
    const baoGia = (t) => {
      const mon = Array.isArray(t && t.mon) ? t.mon : [];
      const the = mon.filter((m) => m && 'loai' in m);
      if (the.length > 1) return { loi: 'NHIEU_THE' };
      if (S.loiThe && the.length) return { loi: S.loiThe };
      const dong = mon.map((m) => {
        if ('loai' in m) { const gia = giaGoi(m.hang_id, m.so_thang); return { loai: 'the', hang_id: m.hang_id, so_thang: m.so_thang, ma: null, so_luong: 1, don_gia: gia, thanh_tien: gia }; }
        const x = MENU_DS.find((y) => y.ma === m.ma); const gh = S.hang && x.gia_hang.find((y) => y.hang_id === S.hang.id);
        return { ma: m.ma, so_luong: m.so_luong, don_gia: x.gia, thanh_tien: (gh ? gh.gia : x.gia) * m.so_luong, goc: x.gia * m.so_luong };
      });
      if (dong.some((d) => d.loai && d.don_gia === null)) return { loi: 'GOI_HANG_KHONG_BAN' };
      const tam = dong.reduce((s, d) => s + (d.goc || d.thanh_tien), 0), sau = dong.reduce((s, d) => s + d.thanh_tien, 0);
      return { dong: dong.map(({ goc, ...d }) => d), tam_tinh: tam, giam: tam > sau ? [{ loai: 'hang', so_tien: tam - sau }] : [], phi_giao: 0, tong: sau, ma_giam_loi: null, chiThe: !mon.some((m) => !('loai' in m)) };
    };
    const lenHang = (d) => { const m = d.mon.find((x) => x.loai === 'the'); if (m) { const h = HANG.find((x) => x.id === m.hang_id); S.hang = { id: h.id, ten: h.ten, phan_tram: h.phan_tram, phan_tram_nhom_dac_biet: h.phan_tram_nhom_dac_biet, het_han: B('23:59:59', '2027-02-13') }; } };
    const traDon = (d) => { d.tt = d.chiThe ? 'xong' : 'da_tra'; lenHang(d); };
    S.traQR = (ma) => traDon(S.don.get(ma));
    const monDon = (d) => d.mon.map((m) => ('loai' in m ? { ma: null, ten: `🎟️ Thẻ hội viên ${HANG.find((h) => h.id === m.hang_id).ten} · ${m.so_thang} tháng`, so_luong: 1, don_gia: giaGoi(m.hang_id, m.so_thang), thanh_tien: giaGoi(m.hang_id, m.so_thang), ghi_chu: null, loai: 'the' }
      : { ma: m.ma, ten: MENU_DS.find((x) => x.ma === m.ma).ten, so_luong: m.so_luong, don_gia: 30000, thanh_tien: 30000 * m.so_luong, ghi_chu: m.ghi_chu || null }));
    const dongDon = (d) => ({ ma: d.ma, so_hd: 'APP00' + d.ma.slice(3), ngay: B('20:31:00'), tong: d.tong, da_tra: d.tt === 'cho_tra' ? 0 : d.tong, trang_thai: null, thanh_toan: null, tien_trinh: d.tt, qr: d.tt === 'cho_tra' ? (S.qrHet ? { ...d.qr, het_han: B('20:20:00') } : d.qr) : null, tien_ve_cho_doi_soat: false, cach_tra: d.cach, giu_vi: d.cach === 'vi' ? d.tong : 0, con_lai: d.cach === 'vi' ? 0 : d.tong });
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      let than = null; try { than = JSON.parse(req.postData()); } catch { /* không thân */ }
      if (duong === '/gio-vang') return json(r, 200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(r, 200, { success: true, data: HANG });
      if (duong === '/gio-hoat-dong') return json(r, 200, { success: true, bay_gio: B('20:30:00'), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(r, 200, { success: true, data: MENU_DS });
      if (duong === '/chuong-trinh') return json(r, 200, { success: true, data: [] });
      if (!/tok-A/.test(req.headers().authorization || '')) return json(r, 401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(r, 200, { success: true, khach: { sdt: '0909123456', ten: 'Linh', ngay_tao: B('08:00:00'), xung_ho: 'chi', dia_chi: null, ngay_sinh: null, qr: 'QR', hang: S.hang, so_du_vi: S.vi } });
      if (duong === '/diem') return json(r, 200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(r, 200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/gia-han') return json(r, 200, { success: true, token: 'tok-A', het_han: B('08:00:00', '2026-12-14') });
      if (duong === '/gio/bao-gia') { S.baoGia.push(than); const b = baoGia(than); return b.loi ? loi400(r, b.loi) : json(r, 200, { success: true, ...b }); }
      if (duong === '/don' && pt === 'POST') {
        S.guiDon.push(than);
        const b = baoGia(than);
        if (b.loi) return loi400(r, b.loi);
        if (than.tong_da_xem !== b.tong) return json(r, 409, { error: 'Giá đã đổi', code: 'GIA_DA_DOI', bao_gia: b });
        if (than.cach_tra !== 'qr' && than.pin !== '1357') return loi400(r, 'PIN_SAI');
        const ma = 'TQD' + ++S.soDon;
        const d = { ma, tong: b.tong, mon: than.mon, chiThe: b.chiThe, cach: than.cach_tra, tt: 'cho_tra', qr: { chuoi: '0002010102123857' + ma, het_han: B('20:40:00') } };
        if (than.cach_tra === 'vi') { S.vi -= b.tong; traDon(d); }
        S.don.set(ma, d);
        return json(r, 200, { success: true, ma_don: ma, so_hd: 'APP00' + ma.slice(3), tong: b.tong, giu_vi: d.cach === 'vi' ? b.tong : 0, con_lai: d.cach === 'vi' ? 0 : b.tong, tien_trinh: d.tt, qr: d.tt === 'cho_tra' ? d.qr : null, trung: false });
      }
      const huy = /^\/don\/([^/]+)\/huy$/.exec(duong);
      if (huy && pt === 'POST') { const d = S.don.get(decodeURIComponent(huy[1])); if (!d || d.tt !== 'cho_tra') return loi400(r, 'DA_TRA_GOI_QUAN'); d.tt = 'da_huy'; return json(r, 200, { success: true, ma_don: d.ma, tien_trinh: 'da_huy' }); }
      if (duong.startsWith('/don/') && pt === 'GET') {
        const d = S.don.get(decodeURIComponent(duong.slice(5)));
        if (!d) return json(r, 404, { error: 'Không thấy đơn', code: 'KHONG_THAY_DON' });
        const the = d.mon.find((m) => 'loai' in m);
        return json(r, 200, { success: true, don: { ...dongDon(d), mon: monDon(d), hoa_don: the && d.tt !== 'cho_tra' ? [{ loai: 'the', trai: '1 x Thẻ hội viên', phai: '295.000', ghi_chu: 'Hạn mới: 13/02/2027' }] : [] } });
      }
      if (duong === '/don' && pt === 'GET') return json(r, 200, { success: true, trang: 1, con_nua: false, data: [...S.don.values()].reverse().map(dongDon) });
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
  const gioMay = (t) => t.evaluate(() => JSON.parse(localStorage.getItem('kh_gio') || '[]'));
  const chup = async (t, ten) => { if (anhDir) await t.screenshot({ path: path.join(anhDir, ten + '.png') }); };
  const khongTran = (t) => t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1);
  const nutDat = (t) => t.locator('#checkout .nut-dat').first();
  const nutMua = (t) => t.locator('#buycard .checkout-btn').first();

  for (const rong of [360, 390, 430]) {
    await may(`B vãng lai ${rong}`, { dn: false, rong }, async ({ t }) => {
      await mo(t, '/uudai/hang');
      await doiChu(t, '#buycard', /So sánh nhanh/);
      const v = await chu(t, '#buycard');
      k(`B1 [${rong}] dòng phụ "Bạn đang ở giá thường"; đầu màn căn trái`, /Bạn đang ở giá thường/.test(await chu(t, '#buycard .topbar')) && (await t.locator('#buycard .topbar.trai').count()) === 1);
      k(`B1 [${rong}] không còn thẻ xám / tab / "Cách có" / bảng cũ / "2 ly/tuần"`, (await t.locator('#buycard .ti-card, #buycard .ti-tabs, #buycard .ti-how, #buycard .ti-cmp').count()) === 0 && !/2 ly\/tuần/.test(v));
      k(`B2 [${rong}] So sánh nhanh ở NGAY dưới đầu màn, có "Chạm một cột để chọn"`, await t.evaluate(() => { const a = document.querySelector('#buycard .topbar'); const b = a && a.nextElementSibling; return !!b && /So sánh nhanh/.test(b.textContent) && /Chạm một cột để chọn/.test(b.textContent); }));
      k(`B2 [${rong}] cột Thường + Vàng + Kim Cương theo thứ tự POS; hàng Giảm / Món nhóm đặc biệt / Chi 1 triệu / Giá`, /Thường[\s\S]*Không hạng[\s\S]*Vàng[\s\S]*Kim Cương/.test(await chu(t, '#buycard .ss')) && /Giảm mọi đơn[\s\S]*Món nhóm đặc biệt[\s\S]*Chi 1 triệu, tiết kiệm[\s\S]*Giá/.test(await chu(t, '#buycard .ss-nhan')));
      const cot = (i) => chu(t, `#buycard .ss .ss-cot >> nth=${i}`);
      k(`B2 [${rong}] ô số: Thường — / — / 0đ / Miễn phí; Vàng 3% / 4% / 30.000đ / 100.000đ / tháng; Kim Cương 10% / 10% / 100.000đ / Quán tặng`, /—[\s\S]*—[\s\S]*0đ[\s\S]*Miễn phí/.test(await cot(0)) && /3%[\s\S]*4%[\s\S]*30\.000đ[\s\S]*100\.000đ[\s\S]*\/ tháng/.test(await cot(1)) && /10%[\s\S]*10%[\s\S]*100\.000đ[\s\S]*Quán tặng/.test(await cot(2)), [await cot(0), await cot(1), await cot(2)].join(' | '));
      k(`B2 [${rong}] mỗi cột hạng là nút role=radio ≥ 44px; Vàng chọn sẵn, có "Đang chọn"; Thường không phải nút`, (await t.locator('#buycard .ss [role=radio]').count()) === 2 && (await t.locator('#buycard .ss [role=radio][aria-checked=true]').innerText()).includes('Vàng') && /Đang chọn/.test(await t.locator('#buycard .ss [aria-checked=true]').innerText()) && (await t.locator('#buycard .ss .c-thuong[role=radio], #buycard .ss button.c-thuong').count()) === 0 && (await t.locator('#buycard .ss [role=radio]').first().boundingBox()).height >= 44);
      k(`B2 [${rong}] huy chương demo: hạng bán m-medal-gold (l1), chỉ cấp m-medal-plat (l2)`, (await t.locator('#buycard .ss .l1 use[href="#m-medal-gold"], #buycard .ss .l1 [data-med="m-medal-gold"]').count()) >= 1 && (await t.locator('#buycard .ss .l2 use[href="#m-medal-plat"], #buycard .ss .l2 [data-med="m-medal-plat"]').count()) >= 1);
      k(`B2 [${rong}] trang không cuộn ngang`, await khongTran(t));
      k(`B3 [${rong}] "Chọn gói Vàng", gói 3 tháng chọn sẵn "Tiết kiệm 5.000đ", nút "Mua ngay · Vàng 3 tháng" + 295.000đ, dòng QR`, /Chọn gói Vàng/.test(v) && /3 tháng/.test(await chu(t, '#buycard .ti-buy button.on')) && /Tiết kiệm 5\.000đ/.test(await chu(t, '#buycard .ti-buy')) && /Mua ngay · Vàng 3 tháng[\s\S]*295\.000đ/.test(await chu(t, '#buycard .checkout-btn')) && /Trả bằng QR chuyển khoản · thẻ dùng được ngay/.test(v));
      if (rong === 390) {
        const hop = await nutMua(t).boundingBox();
        k('B3 [390] nút mua thấy được KHÔNG phải cuộn (đáy nút ≤ 844 − thanh tab)', !!hop && hop.y + hop.height <= 844 - 60, JSON.stringify(hop));
      }
      k(`B4 [${rong}] "Vàng còn có": dòng cố định + quyền lợi POS; ghi chú cuối mới`, /Vàng còn có[\s\S]*Dùng ở quầy và trên App, cùng một số điện thoại[\s\S]*Tích điểm ×1,2/.test(v) && /Gia hạn trước hạn thì ngày còn lại được cộng dồn\. Thẻ hết hạn tự về giá thường\./.test(v));
      await chup(t, `hang_vanglai_${rong}`);
      if (rong !== 390) return;
      const dai = await t.evaluate(() => history.length);
      await t.locator('#buycard .ss [role=radio]', { hasText: 'Kim Cương' }).click();
      k('B2 chạm cột Kim Cương → ?h=3 (thay, không thêm lịch sử); nút mờ "quán tặng"', await doi(t, async () => /\/uudai\/hang\?h=3$/.test(t.url())) && (await t.evaluate(() => history.length)) === dai && (await nutMua(t).getAttribute('aria-disabled')) === 'true' && (await t.locator('#buycard .ti-buy').count()) === 0);
      await chup(t, 'hang_vanglai_kimcuong');
      await t.locator('#buycard .ss [role=radio]', { hasText: 'Vàng' }).click();
      await doi(t, async () => /h=2$/.test(t.url()));
      await nutMua(t).click();
      k('B5 chưa đăng nhập bấm Mua ngay → /dangnhap?tiep=/uudai/hang?h=2', await doi(t, async () => decodeURIComponent(t.url()).endsWith('/dangnhap?tiep=/uudai/hang?h=2')), t.url());
    });
  }

  await may('B5 C2–C4 D1 mua thẻ QR (ví bật nhớ, số dư đủ)', { gio: [LY('TLB', 1)], dungVi: true }, async ({ t, S }) => {
    await mo(t, '/uudai/hang?h=2');
    await doiChu(t, '#buycard .checkout-btn', /Mua ngay · Vàng 3 tháng/);
    await nutMua(t).click();
    k('B5 đã đăng nhập: Mua ngay → /uudai/hang/thanhtoan?h=2&thang=3; giỏ không đổi; không "Đã thêm"', await doi(t, async () => /\/uudai\/hang\/thanhtoan\?h=2&thang=3$/.test(t.url())) && bang(await gioMay(t), [LY('TLB', 1)]) && !/Đã thêm/.test(await chu(t, '.toast')));
    await doiChu(t, '#checkout .nut-dat', /Quét QR · 295\.000đ/);
    const v = await chu(t, '#checkout');
    k('C4 không "Hình thức nhận hàng" / thẻ quầy / công tắc ví; dòng phụ "Thẻ hội viên"', (await t.locator('#checkout .mode-row, #checkout .the-quay, #checkout .the-vi').count()) === 0 && /Thẻ hội viên/.test(await chu(t, '#checkout .topbar')));
    k('C4 thẻ tóm tắt (.pc-mini) "Thẻ hội viên Vàng" + "3 tháng" + 295.000đ; không "hạn tới"', (await t.locator('#checkout .pc-mini').count()) === 1 && /Thẻ hội viên Vàng[\s\S]*3 tháng[\s\S]*295\.000đ/.test(v) && !/hạn tới/i.test(v));
    k('C4 dòng kích hoạt với 3%; một lựa chọn "Chuyển khoản QR"; dòng khoá không ví / mã giảm', /Thẻ kích hoạt ngay khi tiền về, không cần ra quầy\. Đơn đồ uống tiếp theo được giảm 3% luôn\./.test(v) && /Chuyển khoản QR[\s\S]*Quét mã bằng app ngân hàng bất kỳ/.test(v) && /Thẻ hội viên không trả bằng số dư ví và không dùng mã giảm giá\./.test(v));
    k('C2 báo giá gửi đúng mon thẻ, không ma_giam', S.baoGia.length > 0 && S.baoGia.every((b) => bang(b.mon, [THE(2, 3)]) && !('ma_giam' in b)));
    await chup(t, 'thanhtoan_the');
    await nutDat(t).click();
    await doi(t, async () => /\/don\/TQD42/.test(t.url()));
    k('C3 thân POST /don: mon thẻ, cach_tra qr, KHÔNG pin / ma_giam (kh_dung_vi bật + số dư đủ); không bảng PIN', S.guiDon.length === 1 && bang(S.guiDon[0].mon, [THE(2, 3)]) && S.guiDon[0].cach_tra === 'qr' && !('pin' in S.guiDon[0]) && !('ma_giam' in S.guiDon[0]) && (await t.locator('.pin-pad').count()) === 0, JSON.stringify(S.guiDon[0]));
    k('C3 kh_dung_vi vẫn "1" (không ghi đè)', (await t.evaluate(() => localStorage.getItem('kh_dung_vi'))) === '1');
    k('D1 đang chờ trả: khung QR như cũ', await doi(t, async () => (await t.locator('#tracking .qr-chu').count()) > 0));
    S.traQR('TQD42');
    k('D1 trả xong → "Chào mừng hội viên Vàng!"', await doiChu(t, '#tracking', /Chào mừng hội viên Vàng!/, 9000));
    const td = await chu(t, '#tracking');
    k('D1 "Giảm 3% …", thẻ vàng: hạn POS nguyên văn, số đơn APP0042, 295.000đ', /Giảm 3% áp dụng ngay từ đơn tiếp theo, ở quầy và trên App\./.test(td) && /Hạn mới: 13\/02\/2027/.test(td) && /APP0042[\s\S]*295\.000đ/.test(td));
    k('D1 không các bước / số đơn ra quầy / danh sách món', (await t.locator('#tracking .the-buoc, #tracking .pick-num, #tracking .cart-item, #tracking .order-card').count()) === 0);
    k('D1 giỏ còn ly → nút "Về giỏ · 1 món"', /Về giỏ · 1 món/.test(td));
    k('A2 giỏ đồ uống giữ nguyên sau khi trả thẻ', bang(await gioMay(t), [LY('TLB', 1)]));
    await chup(t, 'chao_mung');
    await t.locator('#tracking .checkout-btn', { hasText: 'Đặt đồ uống ngay' }).click();
    k('D1 "Đặt đồ uống ngay" → /menu', await doi(t, async () => /\/menu$/.test(t.url())));
    k('D2 Menu giá theo hạng mới (29.100đ)', await doiChu(t, '#catalog', /29\.100đ/));
    await mo(t, '/uudai');
    k('D2 Ưu đãi: "Hạng của bạn · Vàng"', await doiChu(t, '#rewards', /Hạng của bạn[\s\S]*Vàng/));
    await mo(t, '/uudai/hang?h=2');
    k('D2 Hạng thành viên: dòng phụ "Bạn đang ở Vàng · hết hạn 13/02/2027", nút Gia hạn', await doiChu(t, '#buycard .topbar', /Bạn đang ở Vàng · hết hạn 13\/02\/2027/) && /Gia hạn · Vàng 3 tháng/.test(await chu(t, '#buycard .checkout-btn')));
  });

  await may('C1 tham số / không còn bán', {}, async ({ t, S }) => {
    await mo(t, '/uudai/hang/thanhtoan?h=2&thang=6');
    k('C1 gói không bán → "không còn bán" + nút "Về Hạng thành viên"; không báo giá / đặt đơn', await doiChu(t, '#checkout', /không còn bán/i) && /Về Hạng thành viên/.test(await chu(t, '#checkout')) && S.baoGia.length === 0 && S.guiDon.length === 0);
    await mo(t, '/uudai/hang/thanhtoan?h=abc&thang=3');
    k('C1 tham số sai → "không còn bán", không gửi', await doiChu(t, '#checkout', /không còn bán/i) && S.baoGia.length === 0);
    await mo(t, '/uudai/hang/thanhtoan?h=2&thang=3');
    await doiChu(t, '#checkout .nut-dat', /Quét QR/);
    await t.reload(); await t.waitForSelector('#checkout');
    k('C1 tải lại: vẫn Thanh toán thẻ đúng hạng + gói', /\/uudai\/hang\/thanhtoan\?h=2&thang=3$/.test(t.url()) && await doiChu(t, '#checkout', /Thẻ hội viên Vàng/));
    await t.locator('#checkout .back-btn').click();
    k('C1 mở thẳng rồi Back → /uudai/hang?h=2', await doi(t, async () => /\/uudai\/hang\?h=2$/.test(t.url())), t.url());
  });

  await may('C5 lỗi mã thẻ', { S0: { hang: TOI('2027-03-01T23:59:59', 3) } }, async ({ t, S }) => {
    S.loiThe = 'DA_CO_HANG_CAO_HON';
    await mo(t, '/uudai/hang/thanhtoan?h=2&thang=1');
    k('C5 POS báo DA_CO_HANG_CAO_HON → hiện nguyên lời, nút khoá, nút "Về Hạng thành viên"', await doiChu(t, '#checkout', /Lời POS giả: DA_CO_HANG_CAO_HON/) && (await nutDat(t).getAttribute('aria-disabled')) === 'true' && /Về Hạng thành viên/.test(await chu(t, '#checkout')));
    await t.locator('#checkout .ghost-btn', { hasText: 'Về Hạng thành viên' }).click();
    k('C5 "Về Hạng thành viên" → /uudai/hang?h=2', await doi(t, async () => /\/uudai\/hang\?h=2$/.test(t.url())));
    await mo(t, '/uudai/hang?h=3');
    k('B1 khách Kim Cương: "Kim Cương · quán tặng"', await doiChu(t, '#buycard .topbar', /Kim Cương · quán tặng/));
  });

  await may('D1 Tạo mã mới', {}, async ({ t, S }) => {
    await mo(t, '/uudai/hang/thanhtoan?h=2&thang=1');
    await doiChu(t, '#checkout .nut-dat', /Quét QR · 100\.000đ/);
    await nutDat(t).click();
    await doi(t, async () => /\/don\/TQD42/.test(t.url()));
    S.qrHet = true;
    await t.reload(); await t.waitForSelector('#tracking');
    await t.locator('#tracking .checkout-btn', { hasText: 'Tạo mã mới' }).click();
    k('D1 "Tạo mã mới" đơn chỉ thẻ → /uudai/hang/thanhtoan?h=2&thang=1', await doi(t, async () => /\/uudai\/hang\/thanhtoan\?h=2&thang=1$/.test(t.url())), t.url());
  });

  await may('A1 giỏ lưu cũ có thẻ', { gio: [LY('TLB', 1), THE(2, 3)] }, async ({ t }) => {
    await mo(t, '/giohang');
    await doiChu(t, '#cart', /Trà Lục Bảo/);
    k('A1 Giỏ chỉ hiện ly, không dòng thẻ, không "Trả thẻ trước"', (await t.locator('#cart .cart-item').count()) === 1 && !/Thẻ hội viên|Trả thẻ trước/.test(await chu(t, '#cart')));
  });

  // E — thẻ Ưu đãi: 4 trạng thái, mỗi thẻ một nút, đứng đầu màn
  const theUD = (t) => t.locator('#rewards .the-ud').first();
  const dau = (t) => t.evaluate(() => { const a = document.querySelector('#rewards .topbar'); return a && a.nextElementSibling && a.nextElementSibling.classList.contains('the-ud'); });
  await may('E chưa đăng nhập', { dn: false }, async ({ t }) => {
    await mo(t, '/uudai');
    await doiChu(t, '#rewards .the-ud', /Trở thành hội viên/);
    const v = await theUD(t).innerText();
    k('E1 thẻ là khối đầu của Ưu đãi (cả khi chưa đăng nhập)', await dau(t));
    k('E2 chưa hạng: "Chưa có thẻ", "Trở thành hội viên", Vàng, 2 chip, "Từ 100.000đ / tháng", một nút "Xem & mua thẻ ›"', /Chưa có thẻ/.test(v) && /Trở thành hội viên[\s\S]*Vàng/.test(v) && /Giảm 3% mọi đơn/.test(v) && /Món đặc biệt giảm 4%/.test(v) && /Từ[\s\S]*100\.000đ[\s\S]*\/ tháng/.test(v) && (await theUD(t).locator('button').count()) === 1 && /Xem & mua thẻ ›/.test(await theUD(t).locator('button').innerText()), v);
    await chup(t, 'uudai_chua');
    await theUD(t).locator('button').click();
    k('E2 nút → /uudai/hang?h=2', await doi(t, async () => /\/uudai\/hang\?h=2$/.test(t.url())));
  });
  const caE = [
    ['co', TOI('2026-11-26T23:59:59'), /Hạng của bạn[\s\S]*Vàng[\s\S]*Giảm 3% mọi đơn hàng[\s\S]*Hết hạn 26\/11\/2026[\s\S]*còn 12 ngày/, /Quyền lợi & gia hạn ›/, /\/uudai\/hang\?h=2$/],
    ['sap', TOI('2026-11-17T23:59:59'), /Còn 3 ngày[\s\S]*Gia hạn trước 17\/11 để không mất ưu đãi\. Ngày còn lại được cộng dồn\./, /Gia hạn ngay ›/, /\/uudai\/hang\?h=2$/],
    ['homnay', TOI('2026-11-14T23:59:59'), /Hết hạn hôm nay/, /Gia hạn ngay ›/, /\/uudai\/hang\?h=2$/],
    ['tang', TOI(null, 3), /Hạng của bạn[\s\S]*Kim Cương[\s\S]*Giảm 10% mọi đơn hàng[\s\S]*Dành tặng khách thân thiết · không thời hạn/, /Quyền lợi ›/, /\/uudai\/hang\?h=3$/],
  ];
  for (const [ten, hang, mau, nut, dich] of caE) {
    await may(`E ${ten}`, { S0: { hang } }, async ({ t }) => {
      await mo(t, '/uudai');
      await doiChu(t, '#rewards .the-ud', /Hạng của bạn/);
      const v = await theUD(t).innerText();
      k(`E2 [${ten}] đúng chữ, đầu màn`, mau.test(v) && await dau(t), v);
      k(`E2 [${ten}] đúng MỘT nút`, (await theUD(t).locator('button').count()) === 1 && nut.test(await theUD(t).locator('button').innerText()));
      if (ten === 'co') k('E2 [co] không thanh tiến độ', (await theUD(t).locator('.prog, [role=progressbar]').count()) === 0);
      if (ten === 'tang') k('E2 [tang] thẻ xanh l2 + huy chương bạch kim', (await t.locator('#rewards .the-ud.l2').count()) === 1 && (await theUD(t).locator('use[href="#m-medal-plat"], [data-med="m-medal-plat"]').count()) === 1);
      await chup(t, `uudai_${ten}`);
      await theUD(t).locator('button').click();
      k(`E2 [${ten}] nút → đúng màn`, await doi(t, async () => dich.test(t.url())), t.url());
    });
  }
  await trinh.close();
}
