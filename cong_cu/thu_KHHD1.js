#!/usr/bin/env node
// THỬ KH-HD-1 — Chi tiết đơn vẽ đúng tờ hoá đơn POS (`hoa_don[]`). Phần 1: hàm thuần src/hoaDon.js. Phần 2: App thật trong Chromium (POS giả).
// Chạy: node cong_cu/thu_KHHD1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
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

const L = (loai, trai = '', phai = '', o = {}) => ({ loai, trai, phai, dam: false, gach: '', ghi_chu: '', ...o });
// Tờ mẫu đơn ví có giảm hạng (theo đoạn hợp đồng v7 trong phiếu): đủ mọi loai.
const TO_VI = [
  L('ten_quan', 'TỨ QUÝ ĐƯỜNG', '', { dam: true }), L('dia_chi', '12 Đường Thử, Quận Một'), L('so_bill', 'SỐ BILL', 'A47Z8N9CF'), L('nhan', 'Nhận tại quán'),
  L('gio', '05/11/2026 10:15', ''), L('khach', 'Khách:', 'Linh'),
  L('mon', '3 x TEST 1000', '3.000đ', { gach: '3.300đ', ghi_chu: 'ít ngọt' }),
  L('gia_goc', 'Tổng tiền hàng', '3.000đ'), L('giam_hang', 'Ưu đãi hạng Kim Cương', '-300đ'), L('giam_flash', 'Giờ vàng', '-100đ'), L('giam_ma', 'Mã GIAM10', '-50đ'),
  L('phi_giao', 'Phí giao', '15.000đ'), L('tong', 'TỔNG CỘNG', '2.700đ', { dam: true }),
  L('tieu_de', 'THANH TOÁN'), L('tu_tk', 'Trả từ tài khoản', '2.700đ'), L('tu_tk_me', 'Tài khoản mẹ', '0đ'), L('ck', 'Chuyển khoản', '0đ'), L('tm', 'Tiền mặt', '0đ'),
  L('ghi_no', 'Ghi', '0đ'), L('dua_tra', 'Khách đưa', '2.700đ'),
  L('tieu_de', 'ĐIỂM THƯỞNG'), L('diem_truoc', 'Điểm trước', '100'), L('diem_doi', 'Điểm đổi', '0'), L('diem_cong', 'Điểm cộng', '3'), L('diem_co', 'Điểm hiện có', '103'),
  L('chan', 'Cảm ơn quý khách!'), L('loai_la_xyz', 'Dòng lạ', '42'),
];

(async () => {
  console.log('Phần 1 — hàm thuần src/hoaDon.js (A1–A3)');
  const h = await nap('src/hoaDon.js');
  const ds = h.docHoaDon({ hoa_don: TO_VI });
  const CON = TO_VI.filter((d) => d.loai !== 'ghi_no'); // KH-SOHD-1: docHoaDon tự bỏ ghi_no (App không bao giờ hiện nợ)
  k('A1 giữ đủ số dòng (trừ ghi_no), đúng thứ tự POS', ds.length === CON.length && ds.every((d, i) => d.loai === CON[i].loai));
  k('A1 tờ chỉ có ghi_no → rỗng (coi như không có tờ)', h.docHoaDon({ hoa_don: [TO_VI.find((d) => d.loai === 'ghi_no')] }).length === 0);
  k('A1 dòng mon: trai / phai / gach / ghiChu / dam đúng', ds[6].trai === '3 x TEST 1000' && ds[6].phai === '3.000đ' && ds[6].gach === '3.300đ' && ds[6].ghiChu === 'ít ngọt' && ds[0].dam === true && ds[6].dam === false);
  k('A1 không đổi chữ / không tính tiền (tong vẫn "2.700đ")', ds[12].phai === '2.700đ' && ds[8].phai === '-300đ');
  const thieu = h.docHoaDon({ hoa_don: [{ loai: 'mon' }, { trai: 'x' }, { loai: 'tong', phai: 5, dam: 'true' }] });
  k('A1 trường thiếu → chuỗi rỗng / false', thieu[0].trai === '' && thieu[0].phai === '' && thieu[0].dam === false && thieu[0].gach === '' && thieu[0].ghiChu === '' && thieu[1].loai === '');
  k('A1 không bao giờ ra undefined / null trong chữ', thieu.every((d) => ['loai', 'trai', 'phai', 'gach', 'ghiChu'].every((f) => typeof d[f] === 'string')) && thieu[2].dam === false);
  k('A1 bỏ dòng không phải object (null, số, chuỗi, mảng), giữ dòng còn lại', h.docHoaDon({ hoa_don: [null, 7, 'x', [], L('tong', 'T', '1đ')] }).length === 1);
  for (const [ten, v] of [['[]', { hoa_don: [] }], ['thiếu hoa_don', {}], ['null', { hoa_don: null }], ['không phải mảng', { hoa_don: 'x' }], ['don = null', null], ['don = undefined', undefined]]) {
    k(`A1 ${ten} → []`, Array.isArray(h.docHoaDon(v)) && h.docHoaDon(v).length === 0);
  }
  const nhom = (x) => h.nhomHoaDon(x);
  const MAU = { dau: ['ten_quan', 'dia_chi', 'so_bill', 'nhan', 'gio', 'khach'], canh_bao: ['canh_bao'], mon: ['mon'], tien: ['gia_goc', 'giam_hang', 'giam_flash', 'giam_ma', 'phi_giao', 'tong'],
    tieu_de: ['tieu_de'], tra: ['tu_tk', 'tu_tk_me', 'ck', 'tm', 'ghi_no', 'dua_tra'], diem: ['diem_truoc', 'diem_doi', 'diem_cong', 'diem_co'], chan: ['chan'] };
  for (const [n, ls] of Object.entries(MAU)) k(`A2 nhóm ${n}: ${ls.join(', ')}`, ls.every((x) => nhom(x) === n));
  k('A2 loai lạ / rỗng / không phải chuỗi → la', nhom('loai_la_xyz') === 'la' && nhom('') === 'la' && nhom(undefined) === 'la');

  console.log('Phần 1b — nguồn');
  const hd = doc('src/components/HoaDonKhach.jsx'), don = doc('src/pages/Don.jsx'), css = doc('src/giaoDien/hoa_don.css');
  k('B1 ChiTietDon dùng HoaDonKhach', /HoaDonKhach/.test(don) && /docHoaDon\(don\)\.length > 0/.test(don));
  k('B4 hoa_don.css nạp trong HoaDonKhach.jsx; không sửa main.jsx', /import '\.\.\/giaoDien\/hoa_don\.css'/.test(hd) && !/hoa_don/.test(doc('src/main.jsx')));
  k('B4 CSS mới chỉ dùng biến màu của demo (không mã màu thô)', !/#[0-9a-fA-F]{3,8}\b/.test(css) && !/rgba?\(/.test(css));
  k('A1 App không tự tính tiền (không Number / parse trong HoaDonKhach.jsx và hoaDon.js)', !/parseInt|parseFloat|Number\(/.test(hd + doc('src/hoaDon.js')));

  console.log('Phần 2 — App thật trong Chromium (B1–B5)');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const esbuild = require('esbuild');
  const goi = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  // CSS của main.jsx + CSS riêng của tờ hoá đơn (esbuild ở đây bỏ qua import .css, nên nạp tay).
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n') + '\n' + doc('src/giaoDien/hoa_don.css');
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const URL0 = 'http://kh.test';
  const anhDir = process.env.LUU_ANH_DIR || '';
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const MON = [{ ma: 'T1', ten: 'TEST 1000', so_luong: 3, don_gia: 1000, thanh_tien: 3000, ghi_chu: 'ít ngọt' }];
  const DON = {
    VI: { ma: 'A47Z8N9CF', ngay: '2026-11-05T10:15:00', tong: 2700, trang_thai: 'completed', thanh_toan: 'paid', tien_trinh: 'xong', mon: MON, hoa_don: TO_VI },
    HUY: { ma: 'HUY0001', ngay: '2026-11-05T11:00:00', tong: 2700, trang_thai: 'cancelled', thanh_toan: 'refunded', tien_trinh: 'da_huy', mon: MON,
      hoa_don: [L('canh_bao', 'ĐƠN ĐÃ HUỶ'), L('ten_quan', 'TỨ QUÝ ĐƯỜNG'), L('mon', '3 x TEST 1000', '3.000đ'), L('tong', 'TỔNG CỘNG', '2.700đ', { dam: true })] },
    XAU: { ma: 'XAU0001', ngay: '2026-11-05T13:00:00', tong: 2700, trang_thai: 'completed', thanh_toan: 'paid', tien_trinh: 'xong', mon: MON,
      hoa_don: [L('so_bill', 'SỐ BILL', ''), L('nhan', '', ''), L('tieu_de', '', ''), L('chan', '', ''), L('mon', 'Trà thảo mộc đặc biệt gừng quế hoa cúc kỷ tử táo đỏ ít đường nhiều đá', '3.000.000.000đ', { gach: '3.300.000.000đ' }),
        L('tong', 'TỔNG CỘNG', '2.700đ', { dam: true }), L('loai_la_dai', 'Dòng lạ rất dài', 'x'.repeat(60) + ' ' + 'y'.repeat(60)), L('dia_chi', 'z'.repeat(80))] },
    CHO: { ma: 'CHO0001', ngay: '2026-11-05T12:00:00', tong: 2700, trang_thai: null, thanh_toan: null, tien_trinh: 'cho_tra', mon: MON, hoa_don: [] },
  };
  async function mo(rong, ma) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    await ctx.addInitScript(() => { localStorage.setItem('kh_ngay_man_dau', '2026-11-05'); localStorage.setItem('kh_token', 'tok-A'); });
    const loiTrang = [];
    await ctx.route(`${URL0}/**`, async (r) => {
      const p = new URL(r.request().url()).pathname;
      const json = (o, status = 200) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goi });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice(7);
      const m = /^\/don\/([^/]+)$/.exec(duong);
      if (m) { const d = Object.values(DON).find((x) => x.ma === m[1]); return d ? json({ success: true, don: d }) : json({ error: 'Không thấy đơn', code: 'KHONG_THAY_DON' }, 404); }
      if (duong === '/toi') return json({ success: true, khach: { sdt: '0909123456', ten: 'Linh', ngay_tao: '2026-11-01T08:00:00', xung_ho: 'chi', dia_chi: null, qr: 'QR', hang: null } });
      if (duong === '/gio-hoat-dong') return json({ success: true, bay_gio: '2026-11-05T12:00:00', dang_mo: true, nhan_don: true, hom_nay: null, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/gia-han') return json({ success: true, token: 'tok-A', het_han: '2026-12-05T08:00:00' });
      return json({ success: true, data: [], points: 0, history: [], dang_chay: false, mon: [] });
    });
    const t = await ctx.newPage();
    t.on('pageerror', (e) => loiTrang.push(e.message));
    t.setDefaultTimeout(6000);
    await t.goto(`${URL0}/taikhoan/donhang/${ma}`);
    await t.waitForSelector('#orderdetail .order-card');
    return { t, ctx, loiTrang };
  }
  const chup = async (t, ten, rong) => { if (anhDir) await t.screenshot({ path: path.join(anhDir, `${ten}_${rong}.png`), fullPage: true }); };

  for (const rong of [360, 390, 430]) {
    const { t, ctx, loiTrang } = await mo(rong, 'A47Z8N9CF');
    const chu = await t.locator('#orderdetail .order-card').innerText();
    k(`B1 [${rong}] đơn ví: dòng giảm hạng "Ưu đãi hạng Kim Cương" + "-300đ"`, /Ưu đãi hạng Kim Cương/.test(chu) && /-300đ/.test(chu));
    k(`B1 [${rong}] đơn ví: dòng trả ví ("Trả từ tài khoản") + đủ 2.700đ`, /Trả từ tài khoản/.test(chu) && (chu.match(/2\.700đ/g) || []).length >= 2);
    k(`B1 [${rong}] giá gạch 3.300đ có gạch ngang`, await t.locator('.hd-gach', { hasText: '3.300đ' }).evaluate((e) => getComputedStyle(e).textDecorationLine).catch(() => '') === 'line-through');
    k(`B1 [${rong}] ghi chú món "ít ngọt" nằm dưới tên món`, await t.locator('.hd-ghi', { hasText: 'ít ngọt' }).count() === 1);
    k(`B1 [${rong}] "Số bill: A47Z8N9CF"; không in "SỐ BILL" trần`, /Số bill: A47Z8N9CF/.test(chu) && !/SỐ BILL/.test(chu));
    k(`A3 [${rong}] dòng giờ phai rỗng: chỉ giờ, không "undefined", không dấu ·`, /05\/11\/2026 10:15/.test(chu) && !/undefined|null|·/.test(chu));
    k(`B1 [${rong}] đủ ĐIỂM THƯỞNG + lời cảm ơn + dòng loai lạ vẫn vẽ`, /ĐIỂM THƯỞNG/.test(chu) && /Cảm ơn quý khách/.test(chu) && /Dòng lạ/.test(chu) && /Điểm hiện có/.test(chu));
    const thuTu = ['TỨ QUÝ ĐƯỜNG', 'TEST 1000', 'Ưu đãi hạng', 'TỔNG CỘNG', 'THANH TOÁN', 'Trả từ tài khoản', 'ĐIỂM THƯỞNG', 'Cảm ơn'].map((x) => chu.indexOf(x));
    k(`B1 [${rong}] đúng thứ tự POS`, thuTu.every((v, i) => v >= 0 && (i === 0 || v > thuTu[i - 1])), thuTu.join(','));
    k(`B1 [${rong}] chỉ một dòng tổng (TỔNG CỘNG của POS), không vẽ thêm "Tổng"`, (await t.locator('#orderdetail .summary-row.total').count()) === 1);
    k(`B1 [${rong}] giảm hạng / Giờ vàng / mã dùng lớp .discount`, (await t.locator('#orderdetail .summary-row.discount').count()) === 3);
    k(`B3 [${rong}] nhãn "Đã thanh toán" còn, tiêu đề "Đơn #A47Z8N9CF" còn`, /Đã thanh toán/.test(chu) && /Đơn #A47Z8N9CF/.test(await t.locator('#orderdetail .topbar').innerText()));
    k(`B5 [${rong}] không tràn ngang`, await t.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    await chup(t, '1_don_vi', rong);
    k(`[${rong}] trang không báo lỗi JS`, loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }
  {
    const { t, ctx, loiTrang } = await mo(360, 'HUY0001');
    const dau = await t.locator('#orderdetail .order-card > *').nth(1).evaluate((e) => e.className + '|' + e.textContent).catch(() => '');
    k('B1 đơn huỷ: cảnh báo ĐƠN ĐÃ HUỶ ở trên cùng (ngay sau dòng đầu thẻ), khuôn nt-state', /^nt-state\|.*ĐƠN ĐÃ HUỶ/.test(dau), dau);
    k('B3 đơn huỷ: nhãn "Đã hủy" giữ', /Đã hủy/.test(await t.locator('#orderdetail .order-status').innerText()));
    await chup(t, '2_don_huy', 360);
    k('đơn huỷ: không lỗi JS', loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }
  for (const rong of [390, 430]) {
    const { t, ctx } = await mo(rong, 'HUY0001');
    await chup(t, '2_don_huy', rong);
    await ctx.close();
  }
  for (const rong of [360, 390, 430]) {
    const { t, ctx, loiTrang } = await mo(rong, 'XAU0001');
    const chu = await t.locator('#orderdetail .order-card').innerText();
    const soKhoi = await t.locator('#orderdetail .hd-dau, #orderdetail .hd-tieu-de, #orderdetail .hd-chan').count();
    k(`K5 [${rong}] dữ liệu xấu: số bill rỗng / dòng trống không vẽ "Số bill:" hay khối trống (chỉ còn dòng địa chỉ)`, !/Số bill/.test(chu) && soKhoi === 1, String(soKhoi));
    k(`B5 [${rong}] chữ rất dài (tên món, số tiền, địa chỉ, dòng lạ) không tràn ngang`, await t.evaluate(() => { const c = document.querySelector('#orderdetail .order-card'); return document.documentElement.scrollWidth <= window.innerWidth + 1 && c.scrollWidth <= c.clientWidth + 1; }));
    await chup(t, '4_don_xau', rong);
    k(`[${rong}] dữ liệu xấu: không lỗi JS`, loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }
  for (const rong of [360, 390, 430]) {
    const { t, ctx, loiTrang } = await mo(rong, 'CHO0001');
    const chu = await t.locator('#orderdetail .order-card').innerText();
    k(`B2 [${rong}] hoa_don: [] → vẽ mon[] + Tổng như cũ`, /3 × TEST 1000/.test(chu) && /ít ngọt/.test(chu) && /Tổng/.test(chu) && (await t.locator('#orderdetail .hd-dong, #orderdetail .hd-dau').count()) === 0);
    k(`B3 [${rong}] đơn chờ: nhãn "Chờ thanh toán"`, /Chờ thanh toán/.test(chu));
    await chup(t, '3_don_cho', rong);
    k(`[${rong}] đơn chờ: không lỗi JS`, loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }
  {
    const { t, ctx } = await mo(360, 'A47Z8N9CF');
    await t.addStyleTag({ content: 'html{font-size:200% !important}' });
    k('B5 chữ to gấp đôi (cài đặt máy) vẫn không tràn ngang ở 360', await t.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    await ctx.close();
  }
  await trinh.close();
}
