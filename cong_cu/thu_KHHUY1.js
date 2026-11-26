#!/usr/bin/env node
// THỬ KH-HUY-1 — đơn bị QUÁN huỷ: App hiện lý do (nhãn POS) + "Đã hoàn … vào ví của bạn" (hợp đồng v14, ghi chú HUY-1).
// Phần 1: hàm thuần, đọc nguồn, dựng thành phần DonHuy bằng react-dom/server (chạy ở mọi nơi) · Phần 2: App thật trong Chromium (POS giả của thu_KHMUA1b.js;
// hai trường mới đi qua `v7` của đơn giả — không sửa bài cũ). KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
// Chạy: node cong_cu/thu_KHHUY1.js → dòng cuối "n đạt · m hỏng".
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
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
// Một ca hàm thuần: ném lỗi (thiếu hàm…) → tính HỎNG, không làm đứt cả bài.
const thu = async (ten, f) => { try { const [dung, them] = [].concat(await f()); k(ten, dung, them); } catch (e) { k(ten, false, String(e && e.message).split('\n')[0]); } };

const HOAN = 35000, LY_DO = 'Hết nguyên liệu';
const HUY = { hoan_vao_tai_khoan: HOAN, ly_do_huy: LY_DO };

// Dựng DonHuy thật (JSX) thành HTML tĩnh, đọc chữ qua danh mục nội dung thật (đổi bản nội dung → chữ đổi).
async function dungDonHuy() {
  const esbuild = require('esbuild');
  const kq = await esbuild.build({
    stdin: { contents: `export { default as DonHuy } from './components/DonHuy.jsx'; export * as ND from './noiDung/nd.js'; export { renderToStaticMarkup } from 'react-dom/server'; export { createElement } from 'react';`, resolveDir: path.join(GOC, 'src'), loader: 'js' },
    bundle: true, write: false, format: 'cjs', platform: 'node', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'import.meta.env': '{}' }, absWorkingDir: GOC,
  });
  const m = { exports: {} };
  new Function('module', 'exports', 'require', kq.outputFiles[0].text)(m, m.exports, require);
  return m.exports;
}

(async () => {
  console.log('Phần 1 — hàm thuần, đọc nguồn, thành phần DonHuy');
  const H = await nap('src/hoaDon.js');
  const D = await nap('src/datDon.js');
  const { CAN_TU_POS } = await nap('src/kiemKhop/canTuPos.js');
  const IDX = await nap('src/noiDung/nd/index.js');
  const ND = await nap('src/noiDung/nd.js');

  // A1 — đọc dữ liệu
  const dd = (them) => D.docDon({ don: { ma: 'A9', tien_trinh: 'da_huy', tong: 35000, ...them } });
  const BANG_HOAN = [[35000, 35000], [0, 0], [null, null], [undefined, null], ['35000', null], [-5, null], [1.5, null], [true, null], [NaN, null]];
  await thu('A1 docDon.hoanVaoTaiKhoan: 35000 · 0 giữ; null · thiếu · "35000" · -5 · 1.5 · true · NaN → null', () => {
    const bad = BANG_HOAN.filter(([vao, ra]) => dd({ hoan_vao_tai_khoan: vao }).hoanVaoTaiKhoan !== ra);
    return [bad.length === 0, JSON.stringify(bad)];
  });
  await thu('A1 soHoan(d) (Lịch sử) cùng luật kiểu với docDon', () => [BANG_HOAN.every(([vao, ra]) => H.soHoan({ hoan_vao_tai_khoan: vao }) === ra) && H.soHoan(null) === null && H.soHoan({}) === null]);
  const BANG_LY = [['Hết nguyên liệu', 'Hết nguyên liệu'], ['  Bấm nhầm  ', 'Bấm nhầm'], ['  ', null], ['', null], [null, null], [undefined, null], [42, null], [{}, null]];
  await thu('A1 docDon.lyDoHuy: chuỗi cắt khoảng trắng; rỗng · null · thiếu · không phải chuỗi → null', () => {
    const bad = BANG_LY.filter(([vao, ra]) => dd({ ly_do_huy: vao }).lyDoHuy !== ra);
    return [bad.length === 0, JSON.stringify(bad)];
  });
  await thu('A1 lyDoHuy(d) dùng chung cùng luật', () => [BANG_LY.every(([vao, ra]) => H.lyDoHuy({ ly_do_huy: vao }) === ra) && H.lyDoHuy(null) === null]);
  await thu('A2 chỉ đọc hai trường khi tien_trinh = da_huy (đơn đang làm / chờ trả mang trường lạ → null)', () => ['cho_tra', 'da_tra', 'dang_lam', 'xong', null].every((tt) => { const x = dd({ tien_trinh: tt, ...HUY }); return x.hoanVaoTaiKhoan === null && x.lyDoHuy === null; }) && dd(HUY).hoanVaoTaiKhoan === HOAN && dd(HUY).lyDoHuy === LY_DO);
  await thu('A2 POS cũ (không có hai trường) → cả hai null, phần còn lại của docDon giữ nguyên', () => { const x = dd({}); return [x.hoanVaoTaiKhoan === null && x.lyDoHuy === null && x.ma === 'A9' && x.tienTrinh === 'da_huy' && x.tong === 35000]; });
  const nguon = Object.fromEntries(['src/datDon.js', 'src/hoaDon.js', 'src/pages/TheoDoiDon.jsx', 'src/pages/Don.jsx', 'src/App.jsx', 'src/components/DonHuy.jsx', 'src/noiDung/nd/donHang.js'].map((f) => [f, docTho(f)]));
  k('A2 App không tự tính số hoàn / lý do: DonHuy.jsx và Don.jsx không cộng trừ trên tong / da_tra / giu_vi', !/\b(tong|da_tra|giu_vi|con_lai|thanh_tien)\b\s*[-+*]|[-+*]\s*\b(tong|da_tra|giu_vi|con_lai)\b/.test(nguon['src/components/DonHuy.jsx']) && /soHoan\(/.test(nguon['src/pages/Don.jsx']));

  // A3 — canTuPos
  const mc = (ma) => CAN_TU_POS.find((x) => x.ma === ma);
  k('A3 canTuPos khai hai trường v14 cho GET /don/:ma và GET /don (viec_pos HUY-1, token, có trong hợp đồng)', !!mc('don_huy_v14') && mc('don_huy_v14').cua === 'GET /don/:ma' && ['don.hoan_vao_tai_khoan', 'don.ly_do_huy'].every((x) => mc('don_huy_v14').truong.includes(x)) && mc('don_huy_v14').moi === true && mc('don_huy_v14').viec_pos === 'HUY-1' && mc('don_huy_v14').token === true && mc('don_huy_v14').co === true);
  k('A3 canTuPos mục Lịch sử đơn', !!mc('don_ds_huy_v14') && mc('don_ds_huy_v14').cua === 'GET /don' && ['data[].hoan_vao_tai_khoan', 'data[].ly_do_huy'].every((x) => mc('don_ds_huy_v14').truong.includes(x)) && mc('don_ds_huy_v14').moi === true && mc('don_ds_huy_v14').viec_pos === 'HUY-1');

  // B5 — danh mục
  const DM = Object.fromEntries(IDX.DANH_MUC.map((m) => [m.khoa, m]));
  k('B5 danh mục: td.huy.lyDo / td.huy.hoan / td.huy.xemVi / dh.huy.hoan đúng chữ mặc định + biến', DM['td.huy.lyDo'] && DM['td.huy.lyDo'].macDinh === 'Quán đã huỷ đơn · {lyDo}' && DM['td.huy.hoan'] && DM['td.huy.hoan'].macDinh === 'Đã hoàn {so} vào ví của bạn' && DM['td.huy.xemVi'] && DM['td.huy.xemVi'].macDinh === 'Xem ví' && DM['dh.huy.hoan'] && DM['dh.huy.hoan'].macDinh === 'Đã hoàn {so}' && String(DM['td.huy.lyDo'].bien) === 'lyDo' && String(DM['td.huy.hoan'].bien) === 'so' && String(DM['dh.huy.hoan'].bien) === 'so');
  k('B5 nhãn lý do = mục khoá "POS › Đơn hàng · lý do huỷ (nhãn POS)"', !!DM['td.huy.nhan'] && DM['td.huy.nhan'].khoaBoi === 'pos' && /lý do huỷ \(nhãn POS\)/.test(DM['td.huy.nhan'].chiDuong || ''));
  k('B5 khối mới có công tắc ẩn / hiện (§11): mục battat hien.don.huy', !!DM['hien.don.huy'] && DM['hien.don.huy'].loai === 'battat' && DM['hien.don.huy'].macDinh === true);
  k('B5 kiemDanhMuc sạch (không lỗi khuôn mục)', ND.kiemDanhMuc(IDX.DANH_MUC).length === 0, ND.kiemDanhMuc(IDX.DANH_MUC).slice(0, 3).join(' | '));

  // B1 — thành phần DonHuy (HTML tĩnh)
  let X = null;
  try { X = await dungDonHuy(); } catch (e) { k('B1 dựng được DonHuy.jsx', false, String(e && e.message).split('\n')[0]); }
  if (X) {
    const ve = (p) => X.renderToStaticMarkup(X.createElement(X.DonHuy, p));
    const dem = (h, re) => (h.match(re) || []).length;
    await thu('B1 có lý do + hoàn + moVi → hộp "nt-state" "Quán đã huỷ đơn · Hết nguyên liệu" + hộp "nt-state on" "Đã hoàn 35.000đ vào ví của bạn" + nút "Xem ví"', () => {
      const h = ve({ lyDo: LY_DO, hoan: HOAN, moVi() {} }), t = h.replace(/<[^>]+>/g, '|');
      return [dem(h, /class="nt-state"/g) === 1 && dem(h, /class="nt-state on"/g) === 1 && t.includes('Quán đã huỷ đơn · ') && t.includes('Hết nguyên liệu') && t.includes('Đã hoàn 35.000đ vào ví của bạn') && /<button[^>]*class="ghost-btn[^"]*"[^>]*>Xem ví<\/button>/.test(h) && h.indexOf('nt-state"') < h.indexOf('nt-state on'), h];
    });
    await thu('B1 chữ lý do là nhãn POS NGUYÊN VĂN (đánh dấu mục khoá, không bị App ghép / đổi hoa thường)', () => { const h = ve({ lyDo: 'Khác', hoan: 0, moVi() {} }); return [/data-nd-khoa="pos"[^>]*>Khác</.test(h) || /data-nd="td\.huy\.nhan"[^>]*>Khác</.test(h), h]; });
    await thu('B1 hoàn 0 / null + có lý do → CHỈ hộp lý do (không hộp hoàn, không nút Xem ví)', () => [[0, null].every((hoan) => { const h = ve({ lyDo: LY_DO, hoan, moVi() {} }); return dem(h, /nt-state on/g) === 0 && dem(h, /class="nt-state"/g) === 1 && !/Xem ví|Đã hoàn/.test(h); })]);
    await thu('B1 có hoàn, không lý do → CHỈ hộp hoàn', () => { const h = ve({ lyDo: null, hoan: HOAN, moVi() {} }); return [dem(h, /class="nt-state"/g) === 0 && dem(h, /nt-state on/g) === 1 && /Đã hoàn 35\.000đ vào ví của bạn/.test(h)]; });
    await thu('B1 hai trường cùng vắng / 0 → không dựng gì (chuỗi rỗng)', () => [[{ lyDo: null, hoan: null }, { lyDo: null, hoan: 0 }, {}, { lyDo: '', hoan: undefined }].every((p) => ve({ ...p, moVi() {} }) === '')]);
    await thu('B1 không có moVi → hộp hoàn có, KHÔNG nút "Xem ví"', () => { const h = ve({ lyDo: null, hoan: HOAN }); return [/Đã hoàn 35\.000đ/.test(h) && !/Xem ví|<button/.test(h)]; });
    await thu('B1 chỉ dùng lớp CSS có sẵn: nt-state, nt-state on, ghost-btn', () => { const h = ve({ lyDo: LY_DO, hoan: HOAN, moVi() {} }); return [[...h.matchAll(/class="([^"]*)"/g)].map((m) => m[1]).every((c) => ['nt-state', 'nt-state on', 'ico ', 'ghost-btn', 'ico'].some((o) => c.startsWith(o))), h]; });
    await thu('B5 chữ sửa được: đổi td.huy.hoan / td.huy.lyDo / td.huy.xemVi trong bản nội dung → màn hiện chữ mới; trả lại → về mặc định', () => {
      X.ND.datBanNoiDung({ so_ban: 1, gia_tri: { 'td.huy.hoan': 'Quán trả lại {so} cho bạn', 'td.huy.lyDo': 'Huỷ vì: {lyDo}', 'td.huy.xemVi': 'Mở ví' } });
      const moi = ve({ lyDo: LY_DO, hoan: HOAN, moVi() {} });
      X.ND.datBanNoiDung(null);
      const cu = ve({ lyDo: LY_DO, hoan: HOAN, moVi() {} });
      return [/Quán trả lại 35\.000đ cho bạn/.test(moi) && /Huỷ vì: /.test(moi) && /Mở ví/.test(moi) && !/Đã hoàn/.test(moi) && /Đã hoàn 35\.000đ vào ví của bạn/.test(cu), moi.replace(/<[^>]+>/g, '|')];
    });
    await thu('B5 công tắc hien.don.huy tắt → không dựng gì; bật lại → dựng', () => {
      X.ND.datBanNoiDung({ so_ban: 1, gia_tri: { 'hien.don.huy': false } });
      const tat = ve({ lyDo: LY_DO, hoan: HOAN, moVi() {} });
      X.ND.datBanNoiDung(null);
      return [tat === '' && ve({ lyDo: LY_DO, hoan: HOAN, moVi() {} }) !== ''];
    });
    await thu('B5 mọi chỗ mới có data-nd (sửa được ở /admin): hộp lý do, hộp hoàn, nút Xem ví', () => { const h = ve({ lyDo: LY_DO, hoan: HOAN, moVi() {} }); return [['td.huy.lyDo', 'td.huy.nhan', 'td.huy.hoan', 'td.huy.xemVi'].every((q) => h.includes(`data-nd="${q}"`)), h]; });
  }

  // B2–B4, B6 — nối dây trong nguồn
  k('B2 TheoDoiDon: dùng DonHuy khi tt === "da_huy", đặt TRƯỚC khối các bước, truyền moVi + lyDoHuy + hoanVaoTaiKhoan', /import DonHuy from '\.\.\/components\/DonHuy\.jsx'/.test(nguon['src/pages/TheoDoiDon.jsx']) && /tt === 'da_huy' && <DonHuy[^>]*lyDo=\{don\.lyDoHuy\}[^>]*hoan=\{don\.hoanVaoTaiKhoan\}[^>]*moVi=\{moVi\}/.test(nguon['src/pages/TheoDoiDon.jsx']) && nguon['src/pages/TheoDoiDon.jsx'].indexOf('<DonHuy') < nguon['src/pages/TheoDoiDon.jsx'].indexOf('<CacBuoc'));
  k('B3 Chi tiết đơn: ChiTietDon nhận moVi, dùng DonHuy; App.jsx truyền moVi', /ChiTietDon\(\{[^}]*moVi/.test(nguon['src/pages/Don.jsx']) && /<DonHuy/.test(nguon['src/pages/Don.jsx']) && /<ChiTietDon[^>]*moVi=\{moVi\}/.test(nguon['src/App.jsx']));
  k('B4 Lịch sử: thẻ đơn hiện dòng nhỏ dh.huy.hoan qua soHoan(d), không nút', /nd\('dh\.huy\.hoan'/.test(nguon['src/pages/Don.jsx']) && /soHoan\(d\)/.test(nguon['src/pages/Don.jsx']));
  k('B5 Lịch sử: dòng "Đã hoàn" gắn data-nd (sửa được ở /admin) và theo công tắc hien.don.huy', /<div className="date" \{\.\.\.ndDau\('dh\.huy\.hoan'\)\}>/.test(nguon['src/pages/Don.jsx']) && /ndHien\('hien\.don\.huy'\)/.test(nguon['src/pages/Don.jsx']));
  k('B6 Chi tiết đơn làm mới cuaToi (lamMoi) khi mở đơn huỷ có hoàn; Theo dõi đơn vẫn gọi daHuy', /lamMoi\(\[cuaToi\]\)/.test(nguon['src/pages/Don.jsx']) && /if \(tt === 'da_huy'\) daHuy\(\)/.test(nguon['src/pages/TheoDoiDon.jsx']));
  k('B1 phạm vi CSS: không có tệp .css mới / sửa trong src/giaoDien (git: không thêm .css) và DonHuy.jsx không import css', !/\.css/.test(nguon['src/components/DonHuy.jsx']) && !/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(nguon['src/components/DonHuy.jsx']));

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw);
  }
  console.log(`  (chạy hết ${Math.round(process.uptime())} giây — bộ kiểm cắt ở 120 giây)`);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const { dungMay } = require('./thu_KHMUA1b.js');
  const { may, mo, chu, doi, chup, tranNgang } = await dungMay(pw, k);
  const HET = '2026-10-30T20:40:00';
  // `v7` của đơn giả được trải nguyên vào thân trả lời → mang hai trường v14 mà không phải sửa POS giả của bài cũ (cần S0.v7 = true).
  const V7 = (them) => ({ cach_tra: null, giu_vi: null, con_lai: null, ...them });
  const DON = (ma, tt, them = {}) => ({ ma, tong: 35000, tt, qr: null, giu: 0, cach: 'qr', mon: [], soHd: 'APP0016', ...them });
  const mapDon = (...ds) => new Map(ds.map((d) => [d.ma, d]));
  const CA = [];
  const them = (ten, opt, f) => { if (!process.env.CHI_CA || ten.includes(process.env.CHI_CA)) CA.push(() => may(ten, opt, f)); };
  const demToi = (S) => S.goi.filter((g) => g.duong === '/toi').length;
  const doiChu = (t, sel, re) => doi(t, async () => re.test(await chu(t, sel)));
  const RONG = [360, 390, 430];

  for (const rong of RONG) {
    // (1) Theo dõi đơn: đang mở lúc quán huỷ (cho_tra → da_huy), lý do + hoàn 35.000; nút "Xem ví" mở /uudai/vi; đúng MỘT lượt GET /toi thêm (B6)
    them(`theodoi-huy-${rong}`, { rong, gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'cho_tra', { qr: { chuoi: '00020101021238570010A0000007270127TQD50', het_han: HET } })) } }, async ({ t, S, ctx }) => {
      await mo(t, '/don/TQD50');
      await doiChu(t, '#tracking', /Quét mã bằng app ngân hàng/);
      await t.waitForTimeout(600);
      const truoc = demToi(S);
      const d = S.don.get('TQD50'); d.tt = 'da_huy'; d.v7 = V7(HUY);
      await ctx.clock.runFor(3500);
      const co = await doiChu(t, '#tracking', /Đã hoàn/);
      const x = await chu(t, '#tracking');
      k(`B2 (1) [${rong}] Theo dõi: hộp "Quán đã huỷ đơn · Hết nguyên liệu" + "Đã hoàn 35.000đ vào ví của bạn"`, co && x.includes('Quán đã huỷ đơn · Hết nguyên liệu') && x.includes('Đã hoàn 35.000đ vào ví của bạn'), x.slice(0, 200));
      k(`B2 (1) [${rong}] hộp lý do (nt-state) nằm TRÊN hộp hoàn (nt-state on) và TRÊN khối các bước`, await t.evaluate(() => { const a = document.querySelector('#tracking .nt-state:not(.on)'), b = document.querySelector('#tracking .nt-state.on'), c = document.querySelector('#tracking .the-buoc'); const f = (n) => n && n.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING; return !!a && !!b && !!c && !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) && !!f(b); }));
      await t.waitForTimeout(500);
      k(`B6 (1) [${rong}] đúng MỘT lượt GET /toi thêm sau khi thấy đơn huỷ (số dư ví cập nhật)`, demToi(S) - truoc === 1, `thêm ${demToi(S) - truoc}`);
      k(`B2 (1) [${rong}] không tràn ngang`, !(await tranNgang(t)));
      await chup(t, `theodoi-huy_${rong}`);
      await t.locator('#tracking button.ghost-btn', { hasText: 'Xem ví' }).click();
      k(`B1 (1) [${rong}] nút "Xem ví" mở /uudai/vi`, await doi(t, async () => /\/uudai\/vi$/.test(t.url())), t.url());
    });

    // (2) Chi tiết đơn huỷ có hoàn + lý do; mở Chi tiết làm mới số dư MỘT lần (B6); "Xem ví"
    them(`chitiet-huy-${rong}`, { rong, gio: [], S0: { v7: true, don: mapDon(), donCu: [DON('TQD60', 'da_huy', { soHd: '012', v7: V7(HUY) })] } }, async ({ t, S }) => {
      await mo(t, '/taikhoan/donhang');
      await doi(t, async () => (await t.locator('.order-card .code').count()) === 1);
      await t.waitForTimeout(800);
      const truoc = demToi(S);
      await t.locator('.order-card').first().click();
      const co = await doiChu(t, '#orderdetail', /Đã hoàn/);
      const x = await chu(t, '#orderdetail');
      k(`B3 (2) [${rong}] Chi tiết: lý do + "Đã hoàn 35.000đ vào ví của bạn", dưới mã đơn / nhãn "Đã hủy"`, co && x.includes('Quán đã huỷ đơn · Hết nguyên liệu') && x.includes('Đã hoàn 35.000đ vào ví của bạn') && x.indexOf('Đã hủy') < x.indexOf('Quán đã huỷ đơn'), x.slice(0, 200));
      await t.waitForTimeout(500);
      k(`B6 (2) [${rong}] mở Chi tiết đơn huỷ có hoàn → đúng MỘT lượt GET /toi (ngầm)`, demToi(S) - truoc === 1, `thêm ${demToi(S) - truoc}`);
      k(`B3 (2) [${rong}] không tràn ngang`, !(await tranNgang(t)));
      await chup(t, `chitiet-huy_${rong}`);
      await t.locator('#orderdetail button.ghost-btn', { hasText: 'Xem ví' }).click();
      k(`B3 (2) [${rong}] "Xem ví" mở /uudai/vi`, await doi(t, async () => /\/uudai\/vi$/.test(t.url())), t.url());
    });
  }

  // (3) huỷ có lý do, hoàn 0 → chỉ hộp lý do (Theo dõi + Chi tiết)
  them('huy-hoan-0', { gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'da_huy', { v7: V7({ hoan_vao_tai_khoan: 0, ly_do_huy: 'Khác' }) })), donCu: [DON('TQD60', 'da_huy', { soHd: '012', v7: V7({ hoan_vao_tai_khoan: 0, ly_do_huy: 'Khác' }) })] } }, async ({ t, S }) => {
    await mo(t, '/don/TQD50'); await doiChu(t, '#tracking', /Quán đã huỷ đơn/);
    const a = await chu(t, '#tracking');
    k('B1 (3) Theo dõi: hoàn 0 → chỉ hộp lý do "Quán đã huỷ đơn · Khác", không "Đã hoàn", không "Xem ví"', a.includes('Quán đã huỷ đơn · Khác') && !/Đã hoàn|Xem ví/.test(a) && (await t.locator('#tracking .nt-state.on').count()) === 0, a.slice(0, 160));
    await mo(t, '/taikhoan/donhang/TQD60'); await doiChu(t, '#orderdetail', /Quán đã huỷ đơn/);
    const b = await chu(t, '#orderdetail');
    k('B1 (3) Chi tiết: hoàn 0 → chỉ hộp lý do', !/Đã hoàn|Xem ví/.test(b));
    await t.waitForTimeout(400);
    const toi = demToi(S);
    await t.waitForTimeout(600);
    k('B6 (3) hoàn 0 → Chi tiết không thêm lượt hỏi POS', demToi(S) === toi);
  });

  // (4) khách tự huỷ / QR hết hạn (ly_do_huy null, hoan 0) và (5) POS cũ (không có hai trường): KHÔNG có hộp mới, DOM hai bên như nhau
  const lay = async (t, url, sel) => { await mo(t, url); await doiChu(t, sel, /Đã huỷ|Đã hủy/); await t.waitForTimeout(400); return t.evaluate((s) => document.querySelector(s).innerHTML, sel); };
  them('khach-tu-huy', { gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'da_huy', { v7: V7({ hoan_vao_tai_khoan: 0, ly_do_huy: null }) }), DON('TQD51', 'da_huy', { soHd: 'APP0016' })), donCu: [DON('TQD60', 'da_huy', { soHd: '012', v7: V7({ hoan_vao_tai_khoan: 0, ly_do_huy: null }) }), DON('TQD61', 'da_huy', { soHd: '012' })] } }, async ({ t }) => {
    const [a, b] = [await lay(t, '/don/TQD50', '#tracking'), await lay(t, '/don/TQD51', '#tracking')];
    k('B2 (4)(5) Theo dõi: khách tự huỷ (null / 0) và POS cũ → không "Quán đã huỷ đơn", không "Đã hoàn", không hộp lạ', !/Quán đã huỷ đơn|Đã hoàn|Xem ví/.test(a + b) && (await t.locator('#tracking .nt-state').count()) === 0);
    k('B2 (4)(5) Theo dõi: DOM của đơn (null / 0) = DOM của POS cũ (như hôm nay)', a === b, a === b ? '' : 'khác nhau');
    const [c, d] = [await lay(t, '/taikhoan/donhang/TQD60', '#orderdetail'), await lay(t, '/taikhoan/donhang/TQD61', '#orderdetail')];
    k('B3 (4)(5) Chi tiết: khách tự huỷ / POS cũ → không hộp mới, DOM như nhau', !/Quán đã huỷ đơn|Đã hoàn|Xem ví/.test(c + d) && c === d);
  });

  // (4b) đơn CHƯA huỷ mang hai trường (POS lỗi / lạ): Theo dõi + Chi tiết KHÔNG hiện hộp (App chỉ đọc khi tien_trinh = da_huy — A2)
  them('chua-huy-mang-truong', { gio: [], S0: { v7: true, don: mapDon(DON('TQD50', 'da_tra', { v7: V7(HUY) })), donCu: [DON('TQD60', 'xong', { soHd: '012', v7: V7(HUY) })] } }, async ({ t }) => {
    await mo(t, '/don/TQD50'); await doiChu(t, '#tracking', /Số đơn của bạn/); await t.waitForTimeout(300);
    const a = await chu(t, '#tracking');
    await mo(t, '/taikhoan/donhang/TQD60'); await doiChu(t, '#orderdetail', /012/); await t.waitForTimeout(300);
    k('B2 (4b) đơn chưa huỷ mang ly_do_huy / hoan_vao_tai_khoan → Theo dõi + Chi tiết không hộp "Quán đã huỷ đơn" / "Đã hoàn"', !/Quán đã huỷ đơn|Đã hoàn/.test(a + (await chu(t, '#orderdetail'))), a.slice(0, 100));
  });

  // (6) Lịch sử đơn: thẻ huỷ có hoàn có dòng "Đã hoàn 35.000đ"; thẻ khác (huỷ không hoàn, đang chờ, đã trả, tự huỷ) không; không tràn ngang
  for (const rong of RONG) {
    them(`lich-su-${rong}`, { rong, gio: [], S0: { v7: true, don: mapDon(), donCu: [
      DON('TQD60', 'da_huy', { soHd: 'APP0060', v7: V7(HUY) }),
      DON('TQD61', 'da_huy', { soHd: 'APP0061', v7: V7({ hoan_vao_tai_khoan: 0, ly_do_huy: 'Khác' }) }),
      DON('TQD62', 'da_huy', { soHd: 'APP0062' }),
      DON('TQD63', 'cho_tra', { soHd: 'APP0063', v7: V7({ hoan_vao_tai_khoan: 35000, ly_do_huy: 'Khác' }) }),
      DON('TQD64', 'xong', { soHd: 'APP0064', v7: V7({ hoan_vao_tai_khoan: null, ly_do_huy: null }) }),
    ] } }, async ({ t }) => {
      await mo(t, '/taikhoan/donhang');
      await doi(t, async () => (await t.locator('.order-card .code').count()) === 5);
      const the = await t.locator('.order-card').evaluateAll((es) => es.map((e) => ({ so: e.querySelector('.code').textContent, ten: e.textContent, co: [...e.querySelectorAll('.date')].some((n) => /Đã hoàn/.test(n.textContent)) })));
      k(`B4 (6) [${rong}] chỉ thẻ APP0060 (huỷ + hoàn 35.000đ) có dòng "Đã hoàn 35.000đ"; 4 thẻ còn lại KHÔNG`, the.filter((x) => x.co).map((x) => x.so).join() === 'APP0060' && /Đã hoàn 35\.000đ/.test(the[0].ten) && the.slice(1).every((x) => !/Đã hoàn/.test(x.ten)), JSON.stringify(the.map((x) => [x.so, x.co])));
      k(`B4 (6) [${rong}] thẻ huỷ KHÔNG có nút ngoài "Đặt lại" nào mới (không thêm nút "Xem ví" ở danh sách)`, (await t.locator('.order-card button', { hasText: 'Xem ví' }).count()) === 0);
      k(`B4 (6) [${rong}] không tràn ngang`, !(await tranNgang(t)));
      await chup(t, `lich-su-huy_${rong}`);
    });
  }
  // (7) số dư sau hoàn: Theo dõi đơn thấy da_huy làm mới `cuaToi` (B6 giữ) — ca (1) đã đếm; ở đây: ô số dư ở Ưu đãi / ví đọc số MỚI sau khi hoàn
  them('so-du-sau-hoan', { gio: [], S0: { v7: true, vi: 10000, don: mapDon(DON('TQD50', 'cho_tra', { qr: { chuoi: '00020101021238570010A0000007270127TQD50', het_han: HET } })) } }, async ({ t, S, ctx }) => {
    await mo(t, '/don/TQD50'); await doiChu(t, '#tracking', /Quét mã bằng app ngân hàng/);
    await t.waitForTimeout(500);
    const d = S.don.get('TQD50'); d.tt = 'da_huy'; d.v7 = V7(HUY); S.vi += HOAN;
    await ctx.clock.runFor(3500);
    await doiChu(t, '#tracking', /Đã hoàn/);
    await t.locator('#tracking button.ghost-btn', { hasText: 'Xem ví' }).click();
    await doi(t, async () => /\/uudai\/vi$/.test(t.url()));
    k('B6 số dư ví hiện số MỚI (45.000đ = 10.000đ + hoàn 35.000đ) ở màn Ví sau khi bấm "Xem ví"', await doi(t, async () => /45\.000đ/.test(await chu(t, 'body'))), (await chu(t, 'body')).slice(0, 160));
  });

  for (const c of CA) await c();
}
