#!/usr/bin/env node
// THỬ KH-BAO-1 — báo "Đơn đã sẵn sàng — mời bạn ra quầy" ở MỌI màn, Theo dõi đơn vẽ tờ hoá đơn POS, nhớ công tắc "Trừ từ số dư ví", gửi lại khi CHUA_MO.
// Phần 1: hàm thuần + đọc nguồn (chạy ở mọi nơi) · Phần 2: App thật trong Chromium (POS giả + đồng hồ giả của thu_KHMUA1b.js).
// Chạy: node cong_cu/thu_KHBAO1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
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
const doc = (f) => (f.startsWith('src/') ? boChuThich(docTho(f)) : docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const khoGia = () => { const m = new Map(); return { m, getItem: (x) => (m.has(x) ? m.get(x) : null), setItem: (x, v) => m.set(x, String(v)), removeItem: (x) => m.delete(x) }; };
const khoChan = { getItem() { throw new Error('chặn'); }, setItem() { throw new Error('chặn'); }, removeItem() { throw new Error('chặn'); } };
const d = (ma, tt) => ({ ma, tien_trinh: tt });

(async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn');
  let B = null, L = null;
  try { B = await nap('src/baoDonXong.js'); } catch (e) { k('nạp src/baoDonXong.js', false, String(e.message).split('\n')[0]); }
  try { L = await nap('src/luuMay.js'); } catch (e) { k('nạp src/luuMay.js', false, String(e.message).split('\n')[0]); }
  if (B) {
    const rong = () => ({ thay: [], bao: [] });
    const a = B.xemDanhSach([d('A', 'dang_lam'), d('Z', 'xong')], rong());
    k('A1 đang chạy → dangChay; đơn xong từ trước (chưa từng thấy chạy) KHÔNG báo', a.dangChay === true && a.choBao.length === 0 && JSON.stringify(a.nho.thay) === '["A"]', JSON.stringify(a));
    const b = B.xemDanhSach([d('A', 'xong'), d('Z', 'xong')], a.nho);
    k('A1 đang chạy → xong thì báo ĐÚNG đơn đó, hết dangChay', JSON.stringify(b.choBao) === '["A"]' && b.dangChay === false, JSON.stringify(b));
    const c = B.xemDanhSach([d('A', 'xong')], B.daBao(b.nho, 'A'));
    k('A1 đã tắt (daBao) → không báo lại', c.choBao.length === 0);
    k('A1 da_huy không báo; cho_tra không tính đang chạy', B.xemDanhSach([d('H', 'da_huy')], B.xemDanhSach([d('H', 'da_tra')], rong()).nho).choBao.length === 0 && B.xemDanhSach([d('Q', 'cho_tra')], rong()).dangChay === false);
    const hai = B.xemDanhSach([d('B', 'xong'), d('A', 'xong')], B.xemDanhSach([d('B', 'da_tra'), d('A', 'dang_lam')], rong()).nho);
    k('A1 hai đơn xong cùng lúc: choBao theo thứ tự POS trả; tắt đơn đầu → đơn kia', JSON.stringify(hai.choBao) === '["B","A"]' && JSON.stringify(B.xemDanhSach([d('B', 'xong'), d('A', 'xong')], B.daBao(hai.nho, 'B')).choBao) === '["A"]');
    k('A1 dữ liệu rác (null, thiếu ma, không phải mảng) không vỡ', [null, undefined, {}, [null, {}, { ma: '' }, 5]].every((x) => { const r = B.xemDanhSach(x, rong()); return r.choBao.length === 0 && r.dangChay === false; }));
    k('A1 mã số (không phải chuỗi) vẫn so đúng', JSON.stringify(B.xemDanhSach([{ ma: 7, tien_trinh: 'xong' }], B.xemDanhSach([{ ma: 7, tien_trinh: 'da_tra' }], rong()).nho).choBao) === '["7"]');
    let nho = rong(); for (let i = 0; i < 100; i++) nho = B.xemDanhSach([d('M' + i, 'dang_lam')], nho).nho;
    k('A1 nhớ tối đa 60 mã đã thấy', nho.thay.length === 60 && nho.thay[59] === 'M99');
    const kho = khoGia();
    B.ghiNho({ thay: ['A'], bao: ['A'] }, kho);
    k('A2 ghi / đọc nhớ qua kho (sessionStorage) khoá kh_bao_don; xoá được', JSON.stringify(B.docNho(kho)) === '{"thay":["A"],"bao":["A"]}' && kho.m.has('kh_bao_don') && (B.xoaNho(kho), !kho.m.has('kh_bao_don')));
    k('A2 kho chặn / dữ liệu hỏng → không vỡ, trả nhớ rỗng', JSON.stringify(B.docNho(khoChan)) === JSON.stringify(rong()) && (B.ghiNho(rong(), khoChan), true) && JSON.stringify(B.docNho(Object.assign(khoGia(), { getItem: () => '{hong' }))) === JSON.stringify(rong()));
    k('A2 tiêu đề "(Xong) Đơn <số đơn> — Tứ Quý Đường" (KH-SOHD-1: số đơn = so_hd), chu kỳ hỏi 15 000 ms', B.tieuDeXong('APP0016') === '(Xong) Đơn APP0016 — Tứ Quý Đường' && B.MS_HOI === 15000);
  }
  if (L) {
    const kho = khoGia();
    k('C1 luuMay export KHOA_DUNG_VI = kh_dung_vi, docDungVi / ghiDungVi', L.KHOA_DUNG_VI === 'kh_dung_vi' && typeof L.docDungVi === 'function' && typeof L.ghiDungVi === 'function');
    if (L.ghiDungVi) {
      L.ghiDungVi(true, kho); const bat = kho.m.get('kh_dung_vi') === '1' && L.docDungVi(kho) === true;
      L.ghiDungVi(false, kho);
      k('C1 bật → "1", tắt → "0"; đọc lại đúng', bat && kho.m.get('kh_dung_vi') === '0' && L.docDungVi(kho) === false);
      k('C1 kho chặn: không vỡ, đọc ra false', (L.ghiDungVi(true, khoChan), L.docDungVi(khoChan) === false));
      L.ghiDungVi(true, kho); L.ghiChu('0909123456', kho);
      L.doiKhach('0909123456', kho);
      const cung = kho.m.get('kh_dung_vi') === '1';
      L.doiKhach('0911222333', kho);
      const khac = !kho.m.has('kh_dung_vi');
      L.ghiDungVi(true, kho); L.xoaTatCa(kho);
      k('C1 cùng khách giữ; khác khách xoá; Đăng xuất xoá', cung && khac && !kho.m.has('kh_dung_vi'));
      const k2 = khoGia(); k2.setItem('kh_dung_vi', '1');
      L.doiKhach('0909123456', k2);
      k('C1 không nằm trong khoá vãng lai: có kh_dung_vi mà chưa biết chủ → xoá', !k2.m.has('kh_dung_vi'));
    }
  }

  // ---- đọc nguồn ----
  const APP = doc('src/App.jsx'), BDX = doc('src/components/BaoDonXong.jsx'), TD = doc('src/pages/TheoDoiDon.jsx'), TT = doc('src/pages/ThanhToan.jsx');
  const HDK = doc('src/components/HoaDonKhach.jsx'), DDD = doc('src/dungDatDon.js');
  k('A2 App gắn <BaoDonXong MỘT lần, chỉ khi đã đăng nhập, cạnh <Thongbao', (APP.match(/<BaoDonXong\b/g) || []).length === 1 && /dangNhap && <BaoDonXong/.test(APP) && APP.indexOf('<BaoDonXong') < APP.indexOf('<Thongbao') + 200);
  k('A2 BaoDonXong chỉ hỏi qua cuaDon.lay (không layChiTietDon / fetch), có setInterval(MS_HOI), visibilitychange, vibrate', /cuaDon\.lay\(\)/.test(BDX) && !/layChiTietDon|fetch\(|xemDon/.test(BDX) && /MS_HOI/.test(BDX) && /visibilitychange/.test(BDX) && /navigator\.vibrate/.test(BDX) && /document\.hidden/.test(BDX));
  k('A2 không thư viện / âm thanh mới (không Audio, không file .mp3 / .wav mới)', !/new Audio|<audio|\.mp3|\.wav/.test(BDX) && !fs.existsSync(path.join(GOC, 'public/am_thanh/bao_don.mp3')));
  k('A2 xoá nhớ khi tháo (đăng xuất / 401) và App đưa tiêu đề "(Xong)" qua state, effect tiêu đề dùng nó', /xoaNho/.test(BDX) && /tieuXong/.test(APP) && /document\.title = tieuDeTrang\([^\n]*if \(tieuXong\) document\.title = tieuXong/.test(APP));
  k('A3 daTra làm mới cuaDon (đơn QR vừa trả sang da_tra thì dải bắt đầu hỏi)', /const daTra = \(ma\) => \{[^\n]*lamMoi\(\[cuaDon\]\)/.test(APP));
  k('A3 TheoDoiDon: dòng "Giữ App mở để được báo khi đồ uống xong" và "Đơn đã xong — mời bạn ra quầy"', /Giữ App mở để được báo khi đồ uống xong/.test(TD) && /Đơn đã xong — mời bạn ra quầy/.test(TD) && !/cuaDon|dungCua/.test(TD));
  k('A3 dungTheoDoi vẫn hỏi 3 s / 10 s, dừng khi document.hidden; BaoDonXong không gọi /don/:ma', /GIAY_HOI_QR = 3/.test(docTho('src/dungDatDon.js')) && /GIAY_HOI_DON = 10/.test(docTho('src/dungDatDon.js')) && /document\.hidden/.test(DDD));
  k('B1 dungDatDon đưa hoa_don vào don; TheoDoiDon vẽ HoaDonKhach khi docHoaDon có dòng, còn lại mon[] + Tổng', /hoa_don/.test(DDD) && /HoaDonKhach/.test(TD) && /docHoaDon\(don\)\.length > 0/.test(TD) && /Tổng cộng/.test(TD));
  const HDN = doc('src/hoaDon.js'); // KH-SOHD-1: bộ lọc ghi_no chuyển vào docHoaDon (hết dòng = coi như không có tờ)
  k('B2 docHoaDon lọc ghi_no (không bao giờ vẽ dòng nợ); HoaDonKhach vẽ từ docHoaDon', /ghi_no/.test(HDN) && /filter\(/.test(HDN) && /docHoaDon\(don\)\.map/.test(HDK));
  // Ca ôm CẢ câu lệnh (soát vòng 1): tên hàm còn ở dòng import / chỗ khác thì regex trần vẫn khớp oan, đột biến sống ở cổng không có Chromium.
  k('A2 (câu lệnh) hỏi định kỳ = setInterval(hoiNgay, MS_HOI) nên tab ẩn không hỏi; tháo ra: bỏ listener rồi xoaNho()', /setInterval\(hoiNgay, MS_HOI\)/.test(BDX) && /const hoiNgay = \(\) => \{ if \(!document\.hidden\) cuaDon\.lay\(\)/.test(BDX) && /removeEventListener\('visibilitychange', hoiNgay\); xoaNho\(\);/.test(BDX) && /if \(!kq\.dangChay\) return undefined;/.test(BDX));
  k('C2 (câu lệnh) trả ví vẫn hỏi PIN: qr → guiDon() ngay, còn lại mở PinSheet', /if \(cachTra === 'qr'\) guiDon\(\); else datMoPin\(\{\}\);/.test(TT));
  k('B2 (câu lệnh) docHoaDon chỉ bỏ loai === ghi_no (không đảo ngược)', /&& d\.loai !== 'ghi_no'\)/.test(HDN));
  k('A2 (câu lệnh) nhớ đã tắt ghi qua tải lại: tat() gọi ghiNho', /const tat = \(\) => \{ const n = daBao\(kq\.nho, ma\); datNho\(n\); ghiNho\(n\); \};/.test(BDX));
  k('C2 ThanhToan khởi tạo công tắc từ docDungVi() và ghi bằng ghiDungVi; cachTra giữ luật cũ', /useState\(docDungVi\)|useState\(docDungVi\(\)\)|useState\(\(\) => docDungVi\(\)\)/.test(TT) && /ghiDungVi\(/.test(TT) && /const cachTra = !dungVi \? 'qr' : duoc\.vi \? 'vi' : duoc\.viQr \? 'vi_qr' : 'qr'/.test(TT));
  k('C1 luuMay.js: KHOA_DUNG_VI nằm trong KHOA_DU_LIEU, KHÔNG nằm trong KHOA_VANG_LAI', /KHOA_DU_LIEU = \[[^\]]*KHOA_DUNG_VI/.test(doc('src/luuMay.js')) && !/KHOA_VANG_LAI = \[[^\]]*KHOA_DUNG_VI/.test(doc('src/luuMay.js')));
  k('C3 gửi lại gặp CHUA_MO → GIỮ bản ghi (nhánh riêng trước ghiGuiDo(null)); nút gửi lại khoá + CHU_CHUA_MO khi !DAT_ONLINE', /cu && e\.code === 'CHUA_MO'/.test(TT) && TT.indexOf("e.code === 'CHUA_MO'") < TT.indexOf('ghiGuiDo(null);\n      datMoPin(null);') && /!DAT_ONLINE \? CHU_CHUA_MO : conGiay \? `Gửi lại sau/.test(TT.replace(/\s+/g, ' ')));
  k('D1 bao_don.css do BaoDonXong import; main.jsx / giaoDien.css / demo*.css không nhắc', docTho('src/giaoDien/bao_don.css').length > 0 && /import '\.\.\/giaoDien\/bao_don\.css'/.test(BDX) && !/bao_don/.test(docTho('src/main.jsx') + docTho('src/giaoDien/giaoDien.css') + fs.readdirSync(path.join(GOC, 'src/giaoDien')).filter((f) => /^demo.*\.css$/.test(f)).map((f) => docTho('src/giaoDien/' + f)).join('')));

  console.log('Phần 2 — App thật trong Chromium');
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
  const { dungMay } = require('./thu_KHMUA1b.js');
  const { may, mo, chu, doi, nut, nutKhoa, sanSang, bam, nhapPin, batVi, tranNgang, chup, PIN } = await dungMay(pw, k);
  const CSS = ['bao_don', 'thanh_toan', 'hoa_don'].map((f) => docTho(`src/giaoDien/${f}.css`)).join('\n');
  const css = (t) => t.addStyleTag({ content: CSS });
  const DON = (ma, tt, them = {}) => ({ ma, tong: 87654, tt, qr: null, giu: 87654, cach: 'vi', mon: [], ...them });
  const dem = (S, duong) => S.goi.filter((g) => g.duong === duong).length;
  const chay = (ctx, ms) => ctx.clock.runFor(ms);
  const dai = (t) => t.locator('.bao-don');
  const an = (t, v) => t.evaluate((v2) => { Object.defineProperty(document, 'hidden', { get: () => v2, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }, v);
  const khoiDau = async (t, S, duong) => { await mo(t, duong); await css(t); await doi(t, async () => dem(S, '/don') >= 1); await t.waitForTimeout(200); };
  const tieuDe = (t) => t.title();
  const CA = [];
  const them = (ten, opt, f) => { if (!process.env.CHI_CA || ten.includes(process.env.CHI_CA)) CA.push(() => may(ten, opt, f)); }; // CHI_CA=<tên ca>: chỉ chạy ca đó (gỡ lỗi)

  them('dai-menu', { gio: [], S0: { v7: true, don: new Map([['TQD50', DON('TQD50', 'dang_lam')]]) } }, async ({ t, S, ctx }) => {
    await khoiDau(t, S, '/menu');
    k('A2 đang làm: chưa có dải', (await dai(t).count()) === 0);
    S.don.get('TQD50').tt = 'xong';
    await chay(ctx, 15500);
    k('A2 POS chuyển xong → dải trên Menu "Đơn #TQD50 đã sẵn sàng — mời bạn ra quầy" trong ≤ 15 s', await doi(t, async () => /Đơn #TQD50 đã sẵn sàng — mời bạn ra quầy/.test(await chu(t, '.bao-don'))), await chu(t, '.bao-don'));
    k('A2 document.title "(Xong) Đơn #TQD50 — Tứ Quý Đường"', (await tieuDe(t)) === '(Xong) Đơn #TQD50 — Tứ Quý Đường', await tieuDe(t));
    const hop = await dai(t).boundingBox(), man = await t.locator('.screens').boundingBox(), tab = await t.locator('.tabbar').boundingBox();
    k('A2 dải nằm TRÊN cùng, không đè màn, không che thanh dưới', !!hop && hop.y < man.y && hop.y + hop.height <= man.y + 1 && tab.y + tab.height <= 845);
    await t.locator('.tabbar .tab').first().click(); await t.waitForTimeout(150);
    k('A2 đổi trang: dải còn, tiêu đề "(Xong)" không bị ghi đè', (await dai(t).count()) === 1 && /^\(Xong\)/.test(await tieuDe(t)), await tieuDe(t));
    const truoc = dem(S, '/don');
    await chay(ctx, 60000);
    k('A2 không còn đơn chạy → không hỏi lặp', dem(S, '/don') === truoc, `${truoc} → ${dem(S, '/don')}`);
    await dai(t).locator('button[aria-label="Tắt thông báo"]').click();
    k('A2 ✕ → dải mất, tiêu đề trả lại', await doi(t, async () => (await dai(t).count()) === 0 && !/^\(Xong\)/.test(await tieuDe(t))), await tieuDe(t));
    await t.reload(); await t.waitForSelector('.phone'); await chay(ctx, 16000); await t.waitForTimeout(300);
    k('A2 ✕ rồi tải lại → không hiện lại', (await dai(t).count()) === 0);
  });

  them('xem-don', { rong: 360, gio: [], S0: { v7: true, don: new Map([['TQD50', DON('TQD50', 'da_tra')]]) } }, async ({ t, S, ctx }) => {
    await khoiDau(t, S, '/trangchu');
    S.don.get('TQD50').tt = 'xong'; await chay(ctx, 15500);
    await doi(t, async () => (await dai(t).count()) === 1);
    k('A2 Trang chủ 360 px: có dải, không tràn ngang', (await dai(t).count()) === 1 && !(await tranNgang(t)));
    await chup(t, 'bao-trangchu-360');
    await dai(t).getByText('Xem đơn').click();
    k('A2 "Xem đơn" → /don/TQD50, dải mất, không báo lại', await doi(t, async () => /\/don\/TQD50$/.test(t.url())) && (await dai(t).count()) === 0 && !/^\(Xong\)/.test(await tieuDe(t)));
  });

  them('xong-tu-truoc', { gio: [], S0: { v7: true, don: new Map([['CU1', DON('CU1', 'xong')], ['HUY', DON('HUY', 'da_huy')]]) } }, async ({ t, S, ctx }) => {
    await khoiDau(t, S, '/menu');
    await chay(ctx, 31000); await t.waitForTimeout(300);
    k('A1 đơn xong từ trước / da_huy → không dải, không hỏi lặp', (await dai(t).count()) === 0 && dem(S, '/don') <= 2, String(dem(S, '/don')));
  });

  them('tab-an', { gio: [], S0: { v7: true, don: new Map([['TQD50', DON('TQD50', 'dang_lam')]]) } }, async ({ t, S, ctx }) => {
    await khoiDau(t, S, '/menu');
    await chay(ctx, 15500); await t.waitForTimeout(200);
    k('A2 tab hiện + có đơn chạy → hỏi mỗi 15 s', dem(S, '/don') >= 2, String(dem(S, '/don')));
    await an(t, true); await t.waitForTimeout(200);
    const truoc = dem(S, '/don');
    await chay(ctx, 46000); await t.waitForTimeout(200);
    k('A2 tab ẩn → KHÔNG hỏi', dem(S, '/don') === truoc, `${truoc} → ${dem(S, '/don')}`);
    S.don.get('TQD50').tt = 'xong';
    await an(t, false);
    k('A2 hiện lại tab → hỏi NGAY, dải hiện (không chờ 15 s)', await doi(t, async () => dem(S, '/don') === truoc + 1) && await doi(t, async () => (await dai(t).count()) === 1));
  });

  them('hai-don', { gio: [], S0: { v7: true, don: new Map([['A1', DON('A1', 'dang_lam')], ['B2', DON('B2', 'da_tra')]]) } }, async ({ t, S, ctx }) => {
    await khoiDau(t, S, '/menu');
    S.don.get('A1').tt = 'xong'; S.don.get('B2').tt = 'xong'; await chay(ctx, 15500);
    await doi(t, async () => (await dai(t).count()) === 1);
    const dau = await chu(t, '.bao-don');
    await dai(t).locator('button[aria-label="Tắt thông báo"]').click();
    const sau = await doi(t, async () => (await dai(t).count()) === 1 && (await chu(t, '.bao-don')) !== dau);
    k('A2 hai đơn xong cùng lúc: tắt đơn đầu → đơn kia hiện tiếp, tiêu đề theo đơn đang hiện', sau && /Đơn #(A1|B2)/.test(dau) && await doi(t, async () => (await tieuDe(t)).includes(/#(A1|B2)/.exec(await chu(t, '.bao-don'))[0])), `${dau} | ${await chu(t, '.bao-don')}`);
  });

  them('dat-don-roi-menu', { gio: undefined, S0: { v7: true, vi: 200000 } }, async ({ t, S, ctx }) => {
    await mo(t, '/thanhtoan'); await css(t);
    await doi(t, async () => /Số dư \d/.test(await chu(t, '#checkout .the-vi')));
    await sanSang(t); await batVi(t); await doi(t, async () => /^Trừ ví /.test(await nut(t).innerText().catch(() => ''))); await bam(t); await nhapPin(t, PIN);
    await doi(t, async () => /\/don\/TQD42$/.test(t.url()));
    await t.locator('.tabbar .tab').nth(1).click();
    await doi(t, async () => /\/menu/.test(t.url()));
    S.don.get('TQD42').tt = 'xong'; await chay(ctx, 15500);
    k('A2 đặt đơn trả ví → sang Menu → POS xong → dải hiện trên Menu', await doi(t, async () => /Đơn #TQD42 đã sẵn sàng/.test(await chu(t, '.bao-don'))) && /\/menu/.test(t.url()));
    await t.locator('.tabbar .tab').last().click(); await t.waitForTimeout(150);
    await t.getByText('Đăng xuất').click(); await t.waitForTimeout(300);
    k('A2 đăng xuất → dải mất, khoá kh_bao_don bị xoá', (await dai(t).count()) === 0 && (await t.evaluate(() => sessionStorage.getItem('kh_bao_don'))) === null);
  });

  them('theo-doi-nhac', { gio: [], S0: { v7: true, don: new Map([['TQD50', DON('TQD50', 'dang_lam')], ['TQD51', DON('TQD51', 'cho_tra', { cach: 'qr', giu: 0, qr: { chuoi: 'x', het_han: '2026-10-30T20:40:00' } })], ['TQD52', DON('TQD52', 'da_huy')]]) } }, async ({ t, S, ctx }) => {
    await mo(t, '/don/TQD50'); await css(t);
    k('A3 dang_lam → dòng "Giữ App mở để được báo khi đồ uống xong"', await doi(t, async () => /Giữ App mở để được báo khi đồ uống xong/.test(await chu(t, '#tracking'))));
    const truoc = dem(S, '/don/TQD50');
    await chay(ctx, 30500); await t.waitForTimeout(300);
    k('A3 hỏi GET /don/:ma không dày hơn 10 s / lần (30 s ≤ 4 lần)', dem(S, '/don/TQD50') - truoc <= 4, String(dem(S, '/don/TQD50') - truoc));
    S.don.get('TQD50').tt = 'xong'; await chay(ctx, 10500);
    k('A3 xong → "Đơn đã xong — mời bạn ra quầy", hết dòng nhắc', await doi(t, async () => /Đơn đã xong — mời bạn ra quầy/.test(await chu(t, '#tracking'))) && !/Giữ App mở/.test(await chu(t, '#tracking')));
    await mo(t, '/don/TQD51'); k('A3 cho_tra không có dòng nhắc', await doi(t, async () => /Huỷ đơn/.test(await chu(t, '#tracking'))) && !/Giữ App mở/.test(await chu(t, '#tracking')));
    await mo(t, '/don/TQD52'); k('A3 da_huy không có dòng nhắc', await doi(t, async () => /Đã huỷ/.test(await chu(t, '#tracking'))) && !/Giữ App mở/.test(await chu(t, '#tracking')));
  });

  const TO = [
    { loai: 'ten_quan', trai: 'TỨ QUÝ ĐƯỜNG', phai: '' }, { loai: 'so_bill', trai: '', phai: 'HD0042' },
    { loai: 'mon', trai: '2 × Trà Lục Bảo', phai: '60.000đ' }, { loai: 'tong', trai: 'Tổng cộng', phai: '60.000đ', dam: true },
    { loai: 'ghi_no', trai: 'Ghi nợ', phai: '5.000đ' }, { loai: 'tm', trai: 'Tiền mặt', phai: '55.000đ' }, { loai: 'chan', trai: 'Cảm ơn bạn', phai: '' },
  ];
  for (const [ten, hd] of [['co-to', TO], ['rong', []]]) {
    them(`hoa-don-${ten}`, { gio: [], S0: { v7: true, don: new Map([['TQD50', DON('TQD50', 'dang_lam')]]) } }, async ({ t }) => {
      await t.route('**/api/kh/don/TQD50', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, don: { ma: 'TQD50', ngay: '2026-10-30T20:31:00', tong: 60000, tien_trinh: 'dang_lam', qr: null, tien_ve_cho_doi_soat: false, cach_tra: null, giu_vi: null, con_lai: null, hoa_don: hd, mon: [{ ma: 'TLB', ten: 'Trà Lục Bảo', so_luong: 2, thanh_tien: 60000, ghi_chu: '' }] } }) }));
      await mo(t, '/don/TQD50'); await css(t);
      await doi(t, async () => /Số đơn của bạn/.test(await chu(t, '#tracking')));
      const x = await chu(t, '#tracking');
      if (hd.length) {
        k('B1 có hoa_don → vẽ tờ (ten quán, số bill, món, tổng), hết danh sách mon[] cũ', /HD0042/.test(x) && /2 × Trà Lục Bảo/.test(x) && /Tiền mặt/.test(x) && (await t.locator('#tracking .cart-item').count()) === 0 && (await t.locator('#tracking .the-tong').count()) === 0);
        k('B1 số đơn to + các bước còn nguyên', /#TQD50/.test(x) && (await t.locator('#tracking .tl-step').count()) >= 3);
        k('B2 không dòng ghi_no / chữ "nợ"; thứ tự các dòng khác giữ', !/nợ|(^|\D)5\.000đ/i.test(x) && x.indexOf('Trà Lục Bảo') < x.indexOf('Tổng cộng') && x.indexOf('Tổng cộng') < x.indexOf('Tiền mặt'), x);
      } else k('B1 hoa_don rỗng → giữ danh sách mon[] + Tổng như cũ', (await t.locator('#tracking .cart-item').count()) === 1 && /Tổng cộng/.test(x));
    });
  }

  const moTT = async (t, S, sd) => { await mo(t, '/thanhtoan'); await css(t); await doi(t, async () => /Số dư \d|Dùng hết|Bấm để thử lại/.test(await chu(t, '#checkout .the-vi')) || sd === 0); await doi(t, async () => !/^Xác nhận/.test(await nut(t).innerText().catch(() => '')) && (await nut(t).innerText().catch(() => '')) !== ''); };
  const bat = async (t) => (await t.locator('#checkout .the-vi').getAttribute('aria-checked')) === 'true';
  const dungVi = (t) => t.evaluate(() => localStorage.getItem('kh_dung_vi'));
  const gieoVi = async (t, v) => { await mo(t, '/trangchu'); await t.evaluate((x) => localStorage.setItem('kh_dung_vi', x), v); };
  them('nho-vi', { S0: { v7: true, vi: 100000 } }, async ({ t, S }) => {
    await moTT(t, S);
    k('C2 chưa nhớ → công tắc tắt', !(await bat(t)));
    await t.locator('#checkout .the-vi .t').click();
    k('C1 bật → kh_dung_vi = "1"', (await dungVi(t)) === '1');
    await t.locator('#checkout .the-vi .t').click();
    k('C1 tắt → kh_dung_vi = "0"', (await dungVi(t)) === '0');
    await gieoVi(t, '1'); await moTT(t, S);
    k('C2 nhớ "1" + ví đủ → bật SẴN, nút "Trừ ví"', await bat(t) && /^Trừ ví /.test(await nut(t).innerText()));
    await sanSang(t); await bam(t);
    k('C2 dùng ví vẫn hỏi PIN (không nhớ PIN)', await doi(t, async () => (await t.locator('.pin-pad').count()) > 0) && S.guiDon.length === 0);
    await nhapPin(t, PIN); await doi(t, async () => S.guiDon.length === 1);
    const th = JSON.parse(S.guiDon[0]);
    k('C2 thân POST /don: cach_tra "vi", có pin vừa nhập; PIN không nằm trong kho', th.cach_tra === 'vi' && th.pin === PIN && (await t.evaluate((p) => !JSON.stringify({ ...localStorage, ...sessionStorage }).includes(p), PIN)));
  });
  them('nho-vi-thieu', { S0: { v7: true, vi: 50000 } }, async ({ t, S }) => {
    await gieoVi(t, '1'); await moTT(t, S);
    k('C2 nhớ "1" + ví thiếu → bật SẴN, nút "Trừ ví … + QR"', await bat(t) && /^Trừ ví .* \+ QR /.test(await nut(t).innerText()), await nut(t).innerText());
  });
  them('nho-vi-0d', { S0: { v7: true, vi: 0 } }, async ({ t, S }) => {
    await gieoVi(t, '1'); await moTT(t, S, 0);
    k('C2 ví 0đ → ẩn dòng, trả QR; khoá vẫn "1"', (await t.locator('#checkout .the-vi').count()) === 0 && /^Thanh toán qua QR/.test(await nut(t).innerText()) && (await dungVi(t)) === '1');
  });
  them('nho-vi-toi-loi', { S0: { v7: true, vi: 100000 } }, async ({ t, S, ctx }) => {
    await ctx.route('**/api/kh/toi', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Lỗi máy chủ', code: 'LOI_MAY_CHU' }) }));
    await gieoVi(t, '1'); await mo(t, '/thanhtoan'); await css(t);
    await doi(t, async () => /Bấm để thử lại/.test(await chu(t, '#checkout .the-vi')));
    await doi(t, async () => /^Thanh toán qua QR/.test(await nut(t).innerText().catch(() => '')));
    k('C2 /toi lỗi → công tắc KHÔNG bật sẵn, nút trả QR, không tự chọn ví', !(await bat(t)) && /^Thanh toán qua QR/.test(await nut(t).innerText().catch(() => '')) && (await t.locator('#checkout .switch.on').count()) === 0);
  });
  them('nho-vi-dang-xuat', { S0: { v7: true, vi: 100000 } }, async ({ t }) => {
    await gieoVi(t, '1'); await mo(t, '/taikhoan'); await t.getByText('Đăng xuất').click(); await t.waitForTimeout(300);
    k('C1 Đăng xuất → kh_dung_vi bị xoá', (await dungVi(t)) === null);
  });
  them('nho-vi-khac-khach', { S0: { v7: true, vi: 100000, sdt: '0911222333' } }, async ({ t }) => {
    await t.goto('http://kh.test/trangchu'); await t.waitForSelector('.phone');
    await t.evaluate(() => { localStorage.setItem('kh_chu', '00000000000001'); localStorage.setItem('kh_dung_vi', '1'); });
    await t.reload(); await t.waitForSelector('.phone'); await t.waitForTimeout(600);
    k('C1 đăng nhập khách KHÁC chủ cũ → kh_dung_vi bị xoá', (await dungVi(t)) === null);
  });

  // C3: bản dựng ép DAT_ONLINE = false (công tắc khẩn) — bản ghi "chưa rõ" phải còn dù khách bấm "Gửi lại đúng đơn này"
  them('chua-mo-gui-lai', { tatCo: true, S0: { v7: true } }, async ({ t, S }) => {
    await mo(t, '/trangchu'); await doi(t, async () => S.goi.some((g) => g.duong === '/toi')); await t.waitForTimeout(300);
    const kg = { khoa_gui: 'CM'.repeat(10), than: { mon: [{ ma: 'TLB', so_luong: 1 }], cach_nhan: 'tai_quan', cach_tra: 'qr', khoa_gui: 'CM'.repeat(10), tong_da_xem: 30000 }, cach_tra: 'qr', luc: Date.now() };
    await t.evaluate((g) => localStorage.setItem('kh_don_gui', JSON.stringify(g)), kg);
    await mo(t, '/thanhtoan'); await css(t);
    await doi(t, async () => /Gửi lại|Đặt online sắp mở/.test(await chu(t, '#checkout')));
    // .btn-disabled tắt chuột (pointer-events) nhưng bàn phím vẫn "bấm" được → thử bằng Enter để chạm đúng nhánh xử lý lỗi.
    await t.locator('#checkout .checkout-btn').first().focus(); await t.keyboard.press('Enter');
    await t.waitForTimeout(300);
    const con = await t.evaluate(() => localStorage.getItem('kh_don_gui'));
    k('C3 DAT_ONLINE tắt + bấm "Gửi lại đúng đơn này" → GIỮ bản ghi kh_don_gui', !!con && JSON.parse(con).khoa_gui === kg.khoa_gui, String(con));
    const nutGui = t.locator('#checkout button', { hasText: /Đặt online sắp mở/ }).first();
    k('C3 nút gửi lại khoá kèm chữ "Đặt online sắp mở — mời bạn đặt tại quầy"', (await nutGui.count()) === 1 && (await nutGui.getAttribute('aria-disabled')) === 'true');
    k('C3 không gọi POST /don khi cờ tắt', S.guiDon.length === 0);
  });

  // Chụp ảnh D2 (chỉ khi đặt LUU_ANH_DIR): dải ở Trang chủ + Menu, Theo dõi đơn dang_lam / xong / có tờ, Thanh toán công tắc đã nhớ.
  if (process.env.LUU_ANH_DIR) {
    for (const rong of [360, 390, 430]) {
      them(`anh-${rong}`, { rong, gio: undefined, S0: { v7: true, vi: 100000, don: new Map([['TQD50', DON('TQD50', 'dang_lam')]]) } }, async ({ t, S, ctx }) => {
        await t.route('**/api/kh/don/TQD50', async (r) => { if (S.hoaDon) await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, don: { ma: 'TQD50', ngay: '2026-10-30T20:31:00', tong: 60000, tien_trinh: S.don.get('TQD50').tt, qr: null, tien_ve_cho_doi_soat: false, cach_tra: null, giu_vi: null, con_lai: null, hoa_don: TO, mon: [] } }) }); else await r.fallback(); });
        await mo(t, '/don/TQD50'); await css(t); await doi(t, async () => /Giữ App mở/.test(await chu(t, '#tracking'))); await chup(t, `theodoi-dang-lam_${rong}`);
        await khoiDau(t, S, '/trangchu');
        S.don.get('TQD50').tt = 'xong'; await chay(ctx, 15500);
        await doi(t, async () => (await dai(t).count()) === 1); await chup(t, `bao-trangchu_${rong}`);
        await t.locator('.tabbar .tab').nth(1).click(); await t.waitForTimeout(400); await chup(t, `bao-menu_${rong}`);
        await mo(t, '/don/TQD50'); await css(t); await doi(t, async () => /Đơn đã xong — mời bạn ra quầy/.test(await chu(t, '#tracking'))); await chup(t, `theodoi-xong_${rong}`);
        S.hoaDon = true; await mo(t, '/don/TQD50'); await css(t); await doi(t, async () => /HD0042/.test(await chu(t, '#tracking'))); await chup(t, `theodoi-to-hoa-don_${rong}`);
        await t.evaluate(() => localStorage.setItem('kh_dung_vi', '1')); await moTT(t, S);
        await chup(t, `thanhtoan-nho-cong-tac_${rong}`);
      });
    }
  }
  for (const c of CA) await c();
}
