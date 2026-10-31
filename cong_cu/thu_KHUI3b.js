#!/usr/bin/env node
// THỬ KH-UI-3b — phần v3 còn lại: hồ sơ xưng hô + địa chỉ, lời chào theo xưng hô, tự gia hạn đăng nhập, menu công khai, /kiemkhop, .hb-k.
// Phần 1: hàm thuần + api.js với fetch giả + đọc nguồn (không trình duyệt) · Phần 2: App thật trong Chromium + POS giả theo hợp đồng v3.
// Chạy: node cong_cu/thu_KHUI3b.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
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
const doc = (f) => fs.readFileSync(path.join(GOC, f), 'utf8');
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };

// Gộp vài module của src/ thành một bản chạy trong Node (api.js đọc import.meta.env → thay bằng chuỗi rỗng). Mỗi lần gọi = bản MỚI (trạng thái module riêng).
function dungModule(tep) {
  const esbuild = require('esbuild');
  const kq = esbuild.buildSync({
    stdin: { contents: tep.map((f) => `export * from './${f}';`).join('\n'), resolveDir: path.join(GOC, 'src'), loader: 'js' },
    bundle: true, platform: 'node', format: 'cjs', write: false, logLevel: 'silent', define: { 'import.meta.env.VITE_POS_API': '""', 'process.env.NODE_ENV': '"production"' },
  });
  const m = { exports: {} };
  new vm.Script(`(function (module, exports, require) {${kq.outputFiles[0].text}\n})`, { filename: 'mod.js' }).runInThisContext()(m, m.exports, require);
  return m.exports;
}
// localStorage giả (Map) + fetch giả ghi lại lời gọi.
function khoGia(chan = false) {
  const mp = new Map();
  return { mp, getItem: (x) => (mp.has(x) ? mp.get(x) : null), setItem: (x, v) => { if (chan) throw new Error('chặn'); mp.set(x, String(v)); }, removeItem: (x) => { mp.delete(x); } };
}
function datMang(tra) {
  const goi = [];
  globalThis.fetch = async (url, o = {}) => {
    goi.push({ url: String(url), pt: o.method, auth: (o.headers || {}).Authorization || '', than: o.body === undefined ? undefined : JSON.parse(o.body) });
    const r = await tra(goi[goi.length - 1]);
    if (r instanceof Error) throw r;
    return { ok: r.status < 400, status: r.status, json: async () => r.dl };
  };
  return goi;
}
const NGAY = '2026-10-30 08:00:00';
const OK_GH = { status: 200, dl: { success: true, token: 'tok-B', het_han: '2026-11-29T08:00:00' } };

const BAY = (gio) => `2026-10-30T${gio}`;
const HANG = { success: true, data: [{ id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, gia_the: 199000, thu_tu: 1 }] };
const MENU = { success: true, data: [{ ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [{ hang_id: 2, gia: 27000 }] }] };
const GV_TAT = { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] };
const GHD = (gio = '20:30:00') => ({ success: true, bay_gio: BAY(gio), dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
const MA_XUNG_HO = ['anh', 'chi', 'co', 'chu', 'bac', 'em', 'ban'];

(async () => {
  console.log('Phần 1 — hàm thuần, api.js với fetch giả, đọc nguồn');

  await thu('A1', async () => {
    k('A1 thiet_ke/HOP_DONG_API_KH.md = viec/KH-UI-3b/hop_dong_v3.md, từng byte', Buffer.compare(fs.readFileSync(path.join(GOC, 'thiet_ke/HOP_DONG_API_KH.md')), fs.readFileSync(path.join(GOC, 'viec/KH-UI-3b/hop_dong_v3.md'))) === 0);
  });

  await thu('A2', async () => {
    const { CAN_TU_POS: ds } = await nap('src/kiemKhop/canTuPos.js');
    const m = (ma) => ds.find((x) => x.ma === ma) || {};
    k('A2 POST /gia-han đã có trong hợp đồng (co: true), không còn chờ việc POS', m('gia_han').co === true && !m('gia_han').viec_pos);
    k('A2 xưng hô + địa chỉ là trường của hợp đồng: không còn `moi`, không còn viec_pos', m('toi_v3').co === true && !m('toi_v3').moi && !m('toi_v3').viec_pos);
    k('A2 /menu: không còn viec_pos "KH-API-3", không ghi chú "từ v3"', !m('menu').viec_pos && !/v3/.test(m('menu').ghi_chu || ''));
    k('A2 PUT /toi vẫn có trong bảng', m('sua_toi').co === true);
  });

  await thu('B4', async () => {
    const M = dungModule(['dinhDang.js']);
    const ca = { XUNG_HO_SAI: /xưng hô/i, DIA_CHI_QUA_DAI: /địa chỉ/i, TEN_KHONG_HOP_LE: /tên/i, YEU_CAU_KHONG_HOP_LE: /./ };
    for (const [code, re] of Object.entries(ca)) {
      const l = M.loiTheoCode(code, undefined);
      k(`B4 ${code} không kèm error → lời tiếng Việt riêng (không lời chung)`, /[À-ỹ]/.test(l) && re.test(l) && l !== M.loiTheoCode('KHONG_CO_MA_NAY'), l);
    }
    k('B4 POS có error → vẫn hiện nguyên error của POS', M.loiTheoCode('XUNG_HO_SAI', 'Lời của POS') === 'Lời của POS');
  });

  await thu('B5', async () => {
    const M = dungModule(['api.js']);
    globalThis.localStorage = khoGia(); globalThis.localStorage.setItem('kh_token', 'tok-A');
    const goi = datMang(() => ({ status: 200, dl: { success: true, khach: {} } }));
    k('B5 doiTen đã thay bằng suaHoSo', typeof M.suaHoSo === 'function' && M.doiTen === undefined);
    await M.suaHoSo({ xung_ho: 'chi' });
    await M.suaHoSo({ ten: 'Linh' });
    await M.suaHoSo({ dia_chi: '' });
    await M.suaHoSo({ ten: 'Linh', xung_ho: 'anh' });
    k('B5 PUT /api/kh/toi, thân CHỈ có khoá được truyền', goi.length === 4 && goi.every((g) => g.pt === 'PUT' && g.url === '/api/kh/toi')
      && JSON.stringify(goi.map((g) => g.than)) === JSON.stringify([{ xung_ho: 'chi' }, { ten: 'Linh' }, { dia_chi: '' }, { ten: 'Linh', xung_ho: 'anh' }]), JSON.stringify(goi.map((g) => g.than)));
    k('B5 api.js có đúng một chỗ PUT /toi', (doc('src/api.js').match(/'PUT', '\/toi'/g) || []).length === 1);
  });

  await thu('C', async () => {
    const M = dungModule(['dinhDang.js', 'bayGio.js']);
    const c = (gio, xh, ten) => M.loiChao(gio, xh, ten);
    const T = 'Nguyễn Thị Linh';
    k('C1 sáng 07:00 → "Chào buổi sáng, chị Linh!" (xưng hô chữ thường, tên ngắn = từ cuối)', c('2026-10-30 07:00:00', 'chị', T) === 'Chào buổi sáng, chị Linh!', c('2026-10-30 07:00:00', 'chị', T));
    const moc = [['05:00:00', 'sáng'], ['10:59:59', 'sáng'], ['11:00:00', 'trưa'], ['12:59:59', 'trưa'], ['13:00:00', 'chiều'], ['17:59:59', 'chiều'], ['18:00:00', 'tối'], ['23:30:00', 'tối'], ['00:15:00', 'tối'], ['04:59:59', 'tối']];
    const sai = moc.filter(([g, b]) => c(`2026-10-30 ${g}`, 'anh', 'Nam') !== `Chào buổi ${b}, anh Nam!`).map(([g]) => g);
    k('C1 mốc giờ: 5–11 sáng · 11–13 trưa · 13–18 chiều · còn lại tối', sai.length === 0, sai.join(','));
    k('C2 giờ POS dạng "T" cũng đọc đúng', c('2026-10-30T13:00:00', 'cô', 'Hoa') === 'Chào buổi chiều, cô Hoa!');
    k('C2 chưa có bay_gio → "Chào chị Linh!", không có buổi', c('', 'chị', T) === 'Chào chị Linh!' && c(null, 'chị', T) === 'Chào chị Linh!' && c('hỏng', 'chị', T) === 'Chào chị Linh!');
    k('C2 khách chưa có xưng hô (null / rỗng) → bỏ phần xưng hô', c('2026-10-30 07:00:00', null, T) === 'Chào buổi sáng, Linh!' && c('2026-10-30 07:00:00', '', T) === 'Chào buổi sáng, Linh!' && c('', undefined, T) === 'Chào Linh!');
    k('C2 chưa có tên → "bạn" (có xưng hô: chỉ xưng hô, không "chị bạn")', c('2026-10-30 07:00:00', null, '') === 'Chào buổi sáng, bạn!' && c('', null, '   ') === 'Chào bạn!' && c('2026-10-30 07:00:00', 'chị', null) === 'Chào buổi sáng, chị!');
    k('C3 chưa đăng nhập: loiChao rỗng cả ba → "Chào bạn!"', c('', '', '') === 'Chào bạn!');
    k('C1 tên ngắn: nhiều khoảng trắng, một từ', c('', null, '  Trần   Văn  Nam ') === 'Chào Nam!' && c('', null, 'Linh') === 'Chào Linh!');
    k('C2 coBayGio: chưa nhận → false; nhận "bay_gio" → true; hỏng không đổi; xoaLech → false', typeof M.coBayGio === 'function' && (() => { const a = M.coBayGio(); M.datBayGio('x'); const b = M.coBayGio(); M.datBayGio('2026-10-30T20:30:00'); const d = M.coBayGio(); M.xoaLech(); return a === false && b === false && d === true && M.coBayGio() === false; })());
    const tc = doc('src/pages/TrangChu.jsx');
    k('C2 Trang chủ lấy giờ từ bayGio() của POS, không dùng đồng hồ máy', /bayGio\(\)/.test(tc) && !/new Date|Date\.now|gioVn/.test(tc));
  });

  await thu('D', async () => {
    const ds = ['api.js', 'giaHan.js', 'luuMay.js'];
    const moi = (chan) => { globalThis.localStorage = khoGia(chan); globalThis.localStorage.mp.set('kh_token', 'tok-A'); return dungModule(ds); };
    let M = moi();
    k('D1 có hàm giaHanNeuCan', typeof M.giaHanNeuCan === 'function' && M.KHOA_GIA_HAN === 'kh_gia_han');
    // D4 / chờ bay_gio
    let goi = datMang(() => OK_GH);
    globalThis.localStorage.removeItem('kh_token');
    await M.giaHanNeuCan(NGAY);
    k('D4 chưa có token → không gọi', goi.length === 0);
    globalThis.localStorage.setItem('kh_token', 'tok-A');
    await M.giaHanNeuCan('');
    k('D1 chưa có bay_gio → chờ, không gọi, không ghi ngày', goi.length === 0 && globalThis.localStorage.getItem('kh_gia_han') === null);
    // thành công
    await M.giaHanNeuCan(NGAY);
    k('D1/D2 thành công: một POST /api/kh/gia-han kèm token cũ, không thân', goi.length === 1 && goi[0].pt === 'POST' && goi[0].url === '/api/kh/gia-han' && goi[0].auth === 'Bearer tok-A' && goi[0].than === undefined);
    k('D2 lưu token mới + ngày VN của bay_gio vào kh_gia_han', globalThis.localStorage.getItem('kh_token') === 'tok-B' && globalThis.localStorage.getItem('kh_gia_han') === '2026-10-30');
    await M.giaHanNeuCan('2026-10-30 23:59:59');
    const M2 = dungModule(ds); // mở app lần sau cùng ngày (module mới, kho cũ)
    await M2.giaHanNeuCan('2026-10-30T09:00:00');
    k('D1 tối đa MỘT lần mỗi ngày (cùng module và mở lại app)', goi.length === 1);
    await M2.giaHanNeuCan('2026-10-31 00:00:01');
    k('D1 sang ngày VN mới → gọi lại, dùng token đang giữ', goi.length === 2 && goi[1].auth === 'Bearer tok-B' && globalThis.localStorage.getItem('kh_gia_han') === '2026-10-31');
    // gọi dồn
    M = moi(); goi = datMang(async () => { await new Promise((x) => setTimeout(x, 20)); return OK_GH; });
    await Promise.all([M.giaHanNeuCan(NGAY), M.giaHanNeuCan(NGAY)]);
    k('D1 hai lần gọi dồn (hiệu ứng chạy hai lần) → chỉ một POST', goi.length === 1);
    // lỗi
    for (const [ten, tra] of [['429', { status: 429, dl: { error: 'Quá nhiều', code: 'QUA_NHIEU_LAN' } }], ['500', { status: 500, dl: { error: 'lỗi' } }], ['mạng', new Error('net')], ['không phải JSON', { status: 200, dl: null }]]) {
      M = moi(); goi = datMang(() => tra);
      let nem = false; try { await M.giaHanNeuCan(NGAY); } catch { nem = true; }
      k(`D2 ${ten}: im lặng, không ghi ngày, giữ token`, !nem && globalThis.localStorage.getItem('kh_gia_han') === null && globalThis.localStorage.getItem('kh_token') === 'tok-A');
      await M.giaHanNeuCan(NGAY);
      k(`D2 ${ten}: lần mở sau thử lại`, goi.length === 2);
    }
    // 401
    M = moi(); datMang(() => ({ status: 401, dl: { error: 'hết', code: 'KH_TOKEN_SAI' } }));
    let het = 0; M.datKhiHetPhien(() => { het++; });
    await M.giaHanNeuCan(NGAY);
    k('D2 401 → hết phiên như các cửa khác (api.js xoá token, gọi khiHetPhien), không ghi ngày', het === 1 && globalThis.localStorage.getItem('kh_token') === null && globalThis.localStorage.getItem('kh_gia_han') === null);
    // đăng xuất giữa chừng
    M = moi(); goi = datMang(async () => { await new Promise((x) => setTimeout(x, 20)); return OK_GH; });
    const dang = M.giaHanNeuCan(NGAY); M.xoaToken(); await dang;
    k('D2 khách đăng xuất trong lúc chờ → KHÔNG ghi lại token (không sống lại phiên)', globalThis.localStorage.getItem('kh_token') === null);
    // kho chặn
    M = moi(true); globalThis.localStorage.mp.set('kh_token', 'tok-A'); goi = datMang(() => OK_GH);
    let nem2 = false; try { await M.giaHanNeuCan(NGAY); await M.giaHanNeuCan(NGAY); } catch { nem2 = true; }
    const M3 = dungModule(ds); await M3.giaHanNeuCan(NGAY);
    k('D1 kho bị chặn: không báo lỗi, không gọi lại trong lần mở này, gọi lại ở lần mở sau', !nem2 && goi.length === 2);
    // D3
    const kho = khoGia(); const L = dungModule(['luuMay.js']);
    kho.setItem('kh_gia_han', '2026-10-30'); kho.setItem('kh_chu', L.dauVet('0909123456'));
    L.doiKhach('0909123456', () => kho);
    k('D3 cùng khách → giữ kh_gia_han', kho.getItem('kh_gia_han') === '2026-10-30');
    L.doiKhach('0911000000', () => kho);
    k('D3 người đăng nhập sau khác khách → xoá kh_gia_han', kho.getItem('kh_gia_han') === null);
    kho.setItem('kh_gia_han', '2026-10-30'); L.xoaTatCa(() => kho);
    k('D3 Đăng xuất → xoá kh_gia_han', kho.getItem('kh_gia_han') === null);
    const k2 = khoGia(); k2.setItem('kh_gia_han', '2026-10-30'); L.doiKhach('0909123456', () => k2);
    k('D3 khoá gia hạn không bị coi là "dữ liệu chưa biết của ai" (chưa có kh_chu vẫn không xoá nhầm)', k2.getItem('kh_gia_han') === '2026-10-30');
    const ap = doc('src/App.jsx');
    k('D1 vỏ App gọi giaHanNeuCan(bayGio()) khi đã đăng nhập và đã có bay_gio', /giaHanNeuCan\(bayGio\(\)\)/.test(ap) && /coBayGio/.test(ap));
  });

  await thu('E', async () => {
    const M = dungModule(['menuLuu.js']);
    const l401 = M.chonMenu({ status: 401, message: 'Phiên hết' }, null, null);
    k('E1 chonMenu không còn trạng thái canDN; 401 không bản lưu → lời lỗi, không thẻ mời', !('canDN' in l401) && l401.dl === null);
    const cd = ['src/pages/Menu.jsx', 'src/pages/MonTheoDuong.jsx', 'src/menuLuu.js', 'src/dungMenu.js'];
    k('E1 không còn nhánh canDN ở Menu / Trang món / menuLuu / dungMenu', cd.every((f) => !/canDN/.test(doc(f))), cd.filter((f) => /canDN/.test(doc(f))).join(','));
    const tatCa = fs.readdirSync(path.join(GOC, 'src'), { recursive: true }).filter((f) => /\.(jsx?|css)$/.test(f)).map((f) => doc('src/' + f)).join('\n');
    k('E1 không còn THE_MOI_MENU, không còn `.menu-moi`', !/THE_MOI_MENU|menu-moi/.test(tatCa));
    k('E2 bản menu công khai lưu trên máy giữ gia_hang (không boGiaHang khi lưu)', /ghiMenuLuu\(dl,/.test(doc('src/dungMenu.js')) && !/ghiMenuLuu\(boGiaHang/.test(doc('src/dungMenu.js')));
    k('E1 /menu 401 khi đang có token → không đặt trạng thái lỗi (chờ gọi lại không token)', /e\.status === 401 && coPhien\) \{ if \(!dangNhap\) taiLai\(true\); return; \}/.test(doc('src/dungMenu.js')));
    k('E2 đổi phiên vẫn bỏ gia_hang trong lúc chờ menu mới', /doiPhien\) datTt\(\(t\) => \(\{ \.\.\.t, dl: boGiaHang\(t\.dl\)/.test(doc('src/dungMenu.js')));
  });

  await thu('F1', async () => {
    const kkh = doc('src/pages/KiemKhop.jsx');
    k('F1 /kiemkhop không đóng băng đăng nhập lúc mở trang (đọc docToken() mỗi lần kiểm)', /const kiemLai = [^\n]*datDangNhap\(!!docToken\(\)\)/.test(kkh));
  });

  await thu('G', async () => {
    const lg = await nap('src/luongDangNhap.js');
    k('G1 truongThem: địa chỉ trống không gửi; có thì gửi đã cắt khoảng trắng', JSON.stringify(lg.truongThem('chi', '  ')) === '{"xung_ho":"chi"}' && JSON.stringify(lg.truongThem('anh', ' 12 Lê Lợi ')) === '{"xung_ho":"anh","dia_chi":"12 Lê Lợi"}');
    const dn = await nap('src/noiDung/dangNhap.js');
    k('B1 XUNG_HO đúng 7 mã của hợp đồng v3', JSON.stringify(dn.XUNG_HO.map((x) => x.ma)) === JSON.stringify(MA_XUNG_HO));
  });

  console.log('Phần 2 — App thật trong Chromium + POS giả theo hợp đồng v3');
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
  const goiApp = esbuild.buildSync({
    entryPoints: [path.join(GOC, 'src/main.jsx')], bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  }).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const HTML = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const luuAnh = process.env.LUU_ANH_DIR || '';

  // POS giả theo hợp đồng v3. `P` chỉnh từng ca; `S.goi` ghi mọi lời gọi /api/kh.
  async function ca(ten, { rong = 390, token = 'tok-A', gio = '20:30:00', mayGio = '2026-10-30T07:00:00+07:00', pos = {} } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh' });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    await t.clock.install({ time: new Date(mayGio) }); await t.clock.resume();
    await t.addInitScript(() => { try { sessionStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* bỏ qua */ } });
    await t.addInitScript((tk) => { if (tk && !sessionStorage.getItem('da_gieo')) { sessionStorage.setItem('da_gieo', '1'); localStorage.setItem('kh_token', tk); } }, token);
    const P = { ...pos };
    const S = { goi: [], khach: { sdt: '0909123456', ten: 'Nguyễn Linh', ngay_tao: '2026-01-01T08:00:00', xung_ho: 'chi', dia_chi: null, qr: 'QR', hang: { id: 2, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, het_han: '2026-11-15T23:59:59' }, so_du_vi: 85000, ...P.khach } };
    const hopLe = (a) => a === 'Bearer tok-A' || a === 'Bearer tok-B' || a === 'Bearer tok-N';
    await t.route(`${URL0}/**`, async (r) => {
      const u = new URL(r.request().url()), p = u.pathname, auth = r.request().headers().authorization || '';
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      let than; try { than = r.request().postData() ? JSON.parse(r.request().postData()) : undefined; } catch { than = undefined; }
      S.goi.push({ pt: r.request().method(), duong, auth, than });
      if (duong === '/gio-vang') return json(200, GV_TAT);
      if (duong === '/hang') return json(200, HANG);
      if (duong === '/gio-hoat-dong') return json(200, GHD(gio));
      if (duong === '/menu') {
        if (auth && !hopLe(auth)) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
        return P.menuHong ? json(500, { error: 'lỗi' }) : json(200, MENU);
      }
      if (duong === '/dang-nhap/xin-ma') return json(200, { success: true });
      if (duong === '/dang-nhap/xac-minh') {
        if (P.khachMoi && (!than.ten || !than.xung_ho)) return json(400, { error: 'Cần thêm thông tin', code: 'CAN_TEN' });
        if (P.khachMoi && P.loiBuoc3) return json(400, { error: P.loiBuoc3.error, code: P.loiBuoc3.code });
        return json(200, { success: true, token: 'tok-N', khach: { sdt: '0909123456', ten: than.ten || 'Nguyễn Linh', ngay_tao: '2026-10-30T08:00:00', xung_ho: than.xung_ho || 'chi', dia_chi: than.dia_chi || null } });
      }
      if (!hopLe(auth)) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/gia-han') return P.giaHan429 ? json(429, { error: 'Quá nhiều lần', code: 'QUA_NHIEU_LAN' }) : json(200, { success: true, token: 'tok-B', het_han: '2026-11-29T08:00:00' });
      if (duong === '/toi' && r.request().method() === 'GET') return json(200, { success: true, khach: S.khach });
      if (duong === '/toi') {
        const ks = Object.keys(than || {});
        if (!ks.length) return json(400, { error: 'Thiếu thông tin', code: 'YEU_CAU_KHONG_HOP_LE' });
        if ('xung_ho' in than && (P.loiXungHo || !MA_XUNG_HO.includes(than.xung_ho))) return json(400, { error: 'Cách xưng hô không hợp lệ', code: 'XUNG_HO_SAI' });
        if ('ten' in than && !String(than.ten).trim()) return json(400, { error: 'Tên không hợp lệ', code: 'TEN_KHONG_HOP_LE' });
        if ('dia_chi' in than && String(than.dia_chi || '').length > 300) return json(400, { error: 'Địa chỉ quá dài (tối đa 300 ký tự)', code: 'DIA_CHI_QUA_DAI' });
        for (const x of ks) S.khach[x] = x === 'dia_chi' ? (String(than[x] || '').trim() || null) : x === 'ten' ? String(than[x]).trim() : than[x];
        const { sdt, ten, ngay_tao, xung_ho, dia_chi } = S.khach;
        return json(200, { success: true, khach: { sdt, ten, ngay_tao, xung_ho, dia_chi } });
      }
      if (duong === '/diem') return json(200, { success: true, points: 1250, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(4000);
    try { await chay(t, S, loi); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
    if (loi.length) k(`ca ${ten}: trang không báo lỗi JS`, false, loi[0]);
  }
  const mo = async (t, duong, co = '100%') => { await t.goto(URL0 + duong); await t.waitForSelector('.phone'); await t.waitForTimeout(700); if (co === '130%') await t.addStyleTag({ content: 'html{font-size:130%}' }); await t.waitForTimeout(150); };
  const khongTran = (t) => t.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1);
  const chup = async (t, ten) => { if (luuAnh) await t.screenshot({ path: path.join(luuAnh, ten + '.png') }); };
  const them = (S, pt, duong) => S.goi.filter((g) => g.pt === pt && g.duong === duong);

  // B + C4 + D — Thông tin cá nhân, ở ba cỡ màn và chữ 130%
  for (const rong of [360, 390, 430]) {
    for (const co of ['100%', '130%']) {
      await ca(`hoso-${rong}-${co}`, { rong }, async (t, S) => {
        const nhan = `${rong}/${co}`;
        await mo(t, '/taikhoan/thongtin', co);
        const chips = await t.locator('.pf-chips button').allInnerTexts();
        k(`B1 [${nhan}] thẻ "Quán gọi bạn là" đầu màn, 7 nút theo XUNG_HO`, JSON.stringify(chips) === JSON.stringify(['anh', 'chị', 'cô', 'chú', 'bác', 'em', 'bạn']) && /Quán gọi bạn là/.test(await t.locator('.pf-card').first().innerText()), JSON.stringify(chips));
        k(`B1 [${nhan}] nút đang chọn = xưng hô hiện tại (chị)`, await t.locator('.pf-chips button.on').innerText() === 'chị');
        k(`B1 [${nhan}] xem trước kiểu demo theo giờ POS (không theo đồng hồ máy)`, /Chào buổi tối,\s*chị\s*Linh!/.test(await t.locator('.pf-prev').innerText()), await t.locator('.pf-prev').innerText());
        if (rong === 360 && co === '100%') await chup(t, 'ung-dung_thong-tin-ca-nhan_360');
        await t.locator('.pf-chips button', { hasText: 'Anh' }).click();
        await t.waitForSelector('.save-ok');
        const pu = them(S, 'PUT', '/toi');
        k(`B1 [${nhan}] chạm "Anh" → PUT /toi chỉ { xung_ho: "anh" }, hiện "Đã lưu"`, pu.length === 1 && JSON.stringify(pu[0].than) === '{"xung_ho":"anh"}' && /Đã lưu/.test(await t.locator('.save-ok').first().innerText()), JSON.stringify(pu));
        k(`B1 [${nhan}] xem trước đổi theo: "anh Linh"`, /anh\s*Linh/.test(await t.locator('.pf-prev').innerText()) && await t.locator('.pf-chips button.on').innerText() === 'anh');
        await t.locator('#ten-toi').fill('Trần Minh'); await t.getByRole('button', { name: 'Lưu tên' }).click(); await t.waitForTimeout(300);
        const pu2 = them(S, 'PUT', '/toi');
        k(`B2 [${nhan}] Lưu tên → PUT /toi chỉ { ten }`, pu2.length === 2 && JSON.stringify(pu2[1].than) === '{"ten":"Trần Minh"}', JSON.stringify(pu2));
        k(`B1 [${nhan}] xem trước dùng tên mới (Minh)`, /anh\s*Minh/.test(await t.locator('.pf-prev').innerText()));
        await t.locator('#dia-chi-toi').fill('12 Lê Lợi, Q.1'); await t.getByRole('button', { name: 'Lưu địa chỉ' }).click(); await t.waitForTimeout(300);
        const pu3 = them(S, 'PUT', '/toi');
        k(`B3 [${nhan}] Lưu địa chỉ → PUT /toi chỉ { dia_chi }`, pu3.length === 3 && JSON.stringify(pu3[2].than) === '{"dia_chi":"12 Lê Lợi, Q.1"}', JSON.stringify(pu3));
        k(`B3 [${nhan}] có dòng báo địa chỉ dùng chung với quầy, in trên hoá đơn; ô giới hạn 300`, /quầy/.test(await t.locator('body').innerText()) && /hoá đơn/.test(await t.locator('body').innerText()) && await t.locator('#dia-chi-toi').getAttribute('maxlength') === '300');
        await t.locator('#dia-chi-toi').fill(''); await t.getByRole('button', { name: 'Lưu địa chỉ' }).click(); await t.waitForTimeout(300);
        const pu4 = them(S, 'PUT', '/toi');
        k(`B3 [${nhan}] ô trống mà lưu → gửi ""`, pu4.length === 4 && pu4[3].than.dia_chi === '' && S.khach.dia_chi === null, JSON.stringify(pu4[3]));
        await t.locator('#dia-chi-toi').fill('x'.repeat(300)); await t.locator('#dia-chi-toi').evaluate((e) => { e.removeAttribute('maxlength'); });
        await t.locator('#dia-chi-toi').fill('y'.repeat(301)); await t.getByRole('button', { name: 'Lưu địa chỉ' }).click(); await t.waitForTimeout(300);
        k(`B3 [${nhan}] DIA_CHI_QUA_DAI → hiện lời của POS, giữ chữ đã nhập`, /tối đa 300/.test(await t.locator('[role=alert]').first().innerText()) && (await t.locator('#dia-chi-toi').inputValue()).length === 301);
        k(`B6 [${nhan}] không tràn ngang`, await khongTran(t));
      });
    }
  }

  await ca('hoso-loi-xung-ho', { pos: { loiXungHo: true } }, async (t, S) => {
    await mo(t, '/taikhoan/thongtin');
    await t.locator('.pf-chips button', { hasText: 'Cô' }).click(); await t.waitForTimeout(400);
    k('B1 lỗi XUNG_HO_SAI → hiện lời thường, nút giữ lựa chọn cũ (chị)', /không hợp lệ/.test(await t.locator('[role=alert]').first().innerText()) && await t.locator('.pf-chips button.on').innerText() === 'chị');
  });

  await ca('hoso-chua-xung-ho', { pos: { khach: { xung_ho: null } } }, async (t) => {
    await mo(t, '/taikhoan/thongtin');
    k('B1 khách cũ chưa có xưng hô: không nút nào sáng, xem trước bỏ xưng hô', (await t.locator('.pf-chips button.on').count()) === 0 && /Chào buổi tối,\s*Linh/.test(await t.locator('.pf-prev').innerText()));
  });

  await ca('hoso-tai-lai', {}, async (t, S) => {
    await mo(t, '/taikhoan/thongtin');
    await t.locator('#dia-chi-toi').fill('45 Hai Bà Trưng'); await t.getByRole('button', { name: 'Lưu địa chỉ' }).click(); await t.waitForTimeout(300);
    await mo(t, '/taikhoan/thongtin');
    k('H4.2 tải lại trang → địa chỉ vẫn còn (lấy từ POS)', await t.locator('#dia-chi-toi').inputValue() === '45 Hai Bà Trưng');
    await mo(t, '/taikhoan');
    k('B6 Tài khoản: dòng phụ "Thông tin cá nhân" nêu xưng hô, mã PIN, địa chỉ', /xưng hô/i.test(await t.locator('.acc-it', { hasText: 'Thông tin cá nhân' }).innerText()) && /địa chỉ/i.test(await t.locator('.acc-it', { hasText: 'Thông tin cá nhân' }).innerText()) && /PIN/.test(await t.locator('.acc-it', { hasText: 'Thông tin cá nhân' }).innerText()));
  });

  // C — lời chào Trang chủ
  for (const rong of [360, 390, 430]) {
    await ca(`chao-${rong}`, { rong }, async (t) => {
      await mo(t, '/trangchu');
      const h1 = await t.locator('#home h1').innerText();
      k(`C1 [${rong}] đã đăng nhập: giờ POS 20:30 (đồng hồ máy 07:00) → "Chào buổi tối, chị Linh!"`, h1 === 'Chào buổi tối, chị Linh!', h1);
      k(`C [${rong}] lời chào không tràn ngang`, await khongTran(t));
      if (rong === 360) await chup(t, 'ung-dung_trang-chu-dau_360');
    });
  }
  await ca('chao-doi-xung-ho', {}, async (t) => {
    await mo(t, '/taikhoan/thongtin');
    await t.locator('.pf-chips button', { hasText: 'Cô' }).click(); await t.waitForSelector('.save-ok');
    await t.locator('.tabbar .tab', { hasText: 'Trang chủ' }).click(); await t.waitForTimeout(600);
    k('C4 đổi xưng hô rồi về Trang chủ → lời chào mới ngay, không tải lại trang', await t.locator('#home h1').innerText() === 'Chào buổi tối, cô Linh!',await t.locator('#home h1').innerText());
  });
  await ca('chao-khach', { token: '' }, async (t, S) => {
    await mo(t, '/trangchu');
    k('C3 chưa đăng nhập: "Chào bạn!"', await t.locator('#home h1').innerText() === 'Chào bạn!');
    k('D4 khách vãng lai không gọi /gia-han, /toi', them(S, 'POST', '/gia-han').length === 0 && S.goi.every((g) => g.duong !== '/toi'));
  });
  await ca('chao-chua-bay-gio', { gio: 'hỏng', pos: { khach: { xung_ho: 'anh' } } }, async (t) => {
    await mo(t, '/trangchu');
    k('C2 POS không trả bay_gio hợp lệ → "Chào anh Linh!", không buổi', await t.locator('#home h1').innerText() === 'Chào anh Linh!',await t.locator('#home h1').innerText());
  });

  // D — tự gia hạn
  await ca('gia-han', {}, async (t, S) => {
    await mo(t, '/trangchu');
    k('D1 mở app khi đã đăng nhập → đúng MỘT POST /gia-han, kèm token cũ', them(S, 'POST', '/gia-han').length === 1 && them(S, 'POST', '/gia-han')[0].auth === 'Bearer tok-A', JSON.stringify(them(S, 'POST', '/gia-han')));
    const luu = await t.evaluate(() => ({ tk: localStorage.getItem('kh_token'), ngay: localStorage.getItem('kh_gia_han') }));
    k('D2 lưu token mới, ngày gia hạn = ngày VN của bay_gio POS (không phải ngày máy)', luu.tk === 'tok-B' && luu.ngay === '2026-10-30', JSON.stringify(luu));
    await mo(t, '/trangchu');
    k('D1 mở lại app trong ngày → không gia hạn lần hai', them(S, 'POST', '/gia-han').length === 1);
    await mo(t, '/menu');
    k('D2 token mới được dùng cho các cửa sau (/toi kèm tok-B)', S.goi.some((g) => g.duong === '/toi' && g.auth === 'Bearer tok-B'));
  });
  await ca('gia-han-429', { pos: { giaHan429: true } }, async (t, S) => {
    await mo(t, '/trangchu');
    const luu = await t.evaluate(() => ({ tk: localStorage.getItem('kh_token'), ngay: localStorage.getItem('kh_gia_han') }));
    k('D2 429 → im lặng: không báo lỗi, giữ token, không ghi ngày', luu.tk === 'tok-A' && luu.ngay === null && await t.locator('#home h1').innerText() === 'Chào buổi tối, chị Linh!');
  });

  // E3 — menu công khai
  await ca('menu-token-sai', { token: 'tok-hong' }, async (t, S) => {
    await mo(t, '/menu');
    await t.waitForTimeout(500);
    const menus = S.goi.filter((g) => g.duong === '/menu');
    k('E3 token sai: /menu 401 KH_TOKEN_SAI → api.js xoá token → hết phiên → gọi lại KHÔNG Authorization', menus.length === 2 && menus[0].auth === 'Bearer tok-hong' && menus[1].auth === '' && await t.evaluate(() => localStorage.getItem('kh_token')) === null, JSON.stringify(menus));
    k('E3 đã ở trạng thái chưa đăng nhập ("Chào bạn!"), không chữ lỗi / thẻ mời menu', await t.locator('#home h1').innerText() === 'Chào bạn!' && !/Phiên đăng nhập đã hết|Đăng nhập để xem menu|Không kết nối|Có lỗi/.test(await t.locator('body').innerText()));
    await t.locator('.tabbar .tab', { hasText: 'Menu' }).click(); await t.waitForTimeout(500);
    const m = await t.locator('#catalog').innerText();
    k('E3 vào Menu: khách thấy menu, không chữ lỗi, không thẻ mời đăng nhập', /Trà Lục Bảo/.test(m) && !/Đăng nhập để xem menu|Phiên đăng nhập đã hết|Không kết nối|Có lỗi/.test(m), m.slice(0, 200));
    await chup(t, 'ung-dung_menu-khach_390');
  });
  await ca('menu-khach-bac-gia', { token: '' }, async (t, S) => {
    await mo(t, '/menu');
    k('E1 khách vãng lai: Menu hiện món, không thẻ mời "Đăng nhập để xem menu và giá"', /Trà Lục Bảo/.test(await t.locator('#catalog').innerText()) && !/Đăng nhập để xem menu/.test(await t.locator('body').innerText()));
    k('E3 /menu không token: không gửi Authorization', S.goi.filter((g) => g.duong === '/menu').every((g) => g.auth === ''));
    await t.getByText('Trà Lục Bảo').first().click(); await t.waitForTimeout(500);
    const ct = await t.locator('#detail').innerText();
    k('E3 Trang món: khách vãng lai thấy bậc giá các hạng (Thường → Vàng)', /thường/i.test(ct) && /vàng/i.test(ct) && /27\.000/.test(ct), ct.slice(0, 200));
  });
  await ca('menu-mo-lai-tu-ban-luu', { token: '' }, async (t, S) => {
    await mo(t, '/menu');
    const luu = await t.evaluate(() => localStorage.getItem('kh_menu'));
    k('E2 bản lưu trên máy giữ gia_hang của các hạng', !!luu && (JSON.parse(luu).data[0].gia_hang || []).length === 1, String(luu).slice(0, 120));
  });
  await ca('menu-mo-lai-pos-hong', { token: '', pos: { menuHong: true } }, async (t) => {
    await t.addInitScript(({ menu }) => { if (!sessionStorage.getItem('da_gieo_menu')) { sessionStorage.setItem('da_gieo_menu', '1'); localStorage.setItem('kh_menu', JSON.stringify({ luc: '2026-10-30 20:00:00', at: Date.now(), data: menu })); } }, { menu: MENU.data });
    await mo(t, '/menu');
    await t.getByText('Trà Lục Bảo').first().click(); await t.waitForTimeout(500);
    k('E3 mở lại app từ bản lưu (POS lỗi): Trang món vẫn có bậc giá các hạng', /vàng/i.test(await t.locator('#detail').innerText()) && /27\.000/.test(await t.locator('#detail').innerText()));
  });

  // F1 — /kiemkhop đọc lại đăng nhập mỗi lần kiểm
  await ca('kiemkhop', { token: '' }, async (t, S) => {
    await t.goto(URL0 + '/kiemkhop'); await t.waitForSelector('#kiemkhop'); await t.waitForTimeout(800);
    const truoc = await t.locator('#kiemkhop').innerText();
    k('F1 chưa đăng nhập: các cửa cần token báo "Đăng nhập để kiểm"', /Đăng nhập để kiểm/.test(truoc));
    await t.evaluate(() => localStorage.setItem('kh_token', 'tok-A')); // chủ quán đăng nhập ở tab khác
    await t.waitForTimeout(5200);
    await t.getByRole('button', { name: 'Kiểm lại' }).click(); await t.waitForTimeout(1200);
    const sau = await t.locator('#kiemkhop').innerText();
    k('F1 bấm "Kiểm lại" → đọc lại đăng nhập: gọi /toi, hết báo "Đăng nhập để kiểm"', S.goi.some((g) => g.duong === '/toi' && g.auth === 'Bearer tok-A') && !/Đăng nhập để kiểm/.test(sau), sau.slice(0, 120));
    k('F1 mỗi cửa một lần mỗi lần kiểm (GET /toi đúng 1 lần ở lần hai)', S.goi.filter((g) => g.duong === '/toi').length === 1);
    k('F1 không gọi /gia-han, không PUT/POST', S.goi.every((g) => g.pt === 'GET'));
  });

  // F2 — dấu tiếng Việt của .hb-k không bị cắt
  const DO_HBK = () => [...document.querySelectorAll('.hb-k')].map((e) => {
    const cs = getComputedStyle(e), c = document.createElement('canvas').getContext('2d');
    c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = c.measureText(e.innerText.toUpperCase() + 'ẮỆỜẤẶ');
    const L = parseFloat(cs.lineHeight) || e.getBoundingClientRect().height, h = e.clientHeight;
    const dayTren = (L - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent - m.actualBoundingBoxAscent;
    const dayDuoi = h - ((L - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent) - m.actualBoundingBoxDescent;
    return { chu: e.innerText, cao: h, tren: +dayTren.toFixed(2), duoi: +dayDuoi.toFixed(2), co: cs.fontSize, mau: cs.color, phong: cs.fontFamily };
  });
  const goc = {};
  for (const rong of [360, 390, 430]) {
    for (const co of ['100%', '130%']) {
      await ca(`hbk-${rong}-${co}`, { rong, pos: {} }, async (t) => {
        await mo(t, '/trangchu', co);
        const o = await t.evaluate(DO_HBK);
        const cat = o.filter((x) => x.tren < -0.01 || x.duoi < -0.01);
        k(`F2 [${rong}/${co}] ${o.length} nhãn .hb-k: dấu hoa (Ắ Ệ Ờ Ấ Ặ) nằm trọn trong khung, không bị overflow:hidden cắt`, o.length >= 2 && cat.length === 0, JSON.stringify(cat));
        goc[`${rong}/${co}`] = o.map((x) => `${x.co}|${x.mau}|${x.phong}`).join(';');
        if (rong === 360 && co === '100%') await chup(t, 'ung-dung_hb-k_360');
      });
    }
  }
  k('F2 không đổi màu / phông / cỡ chữ (K9): cỡ chữ vẫn clamp(8.5px,2.5vw,9.5px) của demo', /\.hb-k\{[^}]*font-size:clamp\(8\.5px,2\.5vw,9\.5px\)/.test(doc('src/giaoDien/demo_tracnghiem.css')) && !/\.hb-k(?![\w-])[^{]*\{[^}]*(color|font-family|font-size)/.test(doc('src/giaoDien/giaoDien.css')));

  // G1 — Đăng ký 3 bước theo v3
  await ca('dang-ky', { token: '', pos: { khachMoi: true } }, async (t, S) => {
    await mo(t, '/dangnhap');
    await t.locator('#sdt').fill('0909123456'); await t.getByRole('button', { name: 'Tiếp tục' }).click();
    await t.locator('#ma').fill('123456'); await t.getByRole('button', { name: 'Xác nhận' }).click();
    await t.waitForSelector('#ten');
    k('G1 khách mới: CAN_TEN → màn "Thông tin của bạn" (Tên, Cách xưng hô, Địa chỉ)', /Thông tin của bạn/.test(await t.locator('#login h1').innerText()) && (await t.locator('.xh').count()) === 7);
    k('G1 chưa đủ Tên + xưng hô thì nút "Hoàn tất" khoá', await t.getByRole('button', { name: 'Hoàn tất' }).isDisabled());
    await t.locator('#ten').fill('Lê Hoa'); await t.locator('.xh', { hasText: 'Cô' }).click();
    await t.getByRole('button', { name: 'Hoàn tất' }).click(); await t.waitForTimeout(600);
    const xm = S.goi.filter((g) => g.duong === '/dang-nhap/xac-minh');
    k('G1 gửi ten + xung_ho, địa chỉ trống thì KHÔNG gửi dia_chi → vào app', xm.length === 2 && JSON.stringify(xm[1].than) === '{"sdt":"0909123456","ma":"123456","ten":"Lê Hoa","xung_ho":"co"}' && (await t.locator('#login').count()) === 0, JSON.stringify(xm[1]));
  });
  for (const [code, error] of [['XUNG_HO_SAI', 'Cách xưng hô không hợp lệ'], ['DIA_CHI_QUA_DAI', 'Địa chỉ quá dài'], ['TEN_KHONG_HOP_LE', 'Tên không hợp lệ']]) {
    await ca(`dang-ky-${code}`, { token: '', pos: { khachMoi: true, loiBuoc3: { code, error } } }, async (t) => {
      await mo(t, '/dangnhap');
      await t.locator('#sdt').fill('0909123456'); await t.getByRole('button', { name: 'Tiếp tục' }).click();
      await t.locator('#ma').fill('123456'); await t.getByRole('button', { name: 'Xác nhận' }).click();
      await t.waitForSelector('#ten');
      await t.locator('#ten').fill('Lê Hoa'); await t.locator('.xh', { hasText: 'Chị' }).click(); await t.locator('#dia-chi').fill('12 Lê Lợi');
      await t.getByRole('button', { name: 'Hoàn tất' }).click(); await t.waitForTimeout(500);
      k(`G1 ${code} ở bước 3 → hiện lời của POS, GIỮ chữ đã nhập`, (await t.locator('[role=alert]').first().innerText()).includes(error) && await t.locator('#ten').inputValue() === 'Lê Hoa' && await t.locator('#dia-chi').inputValue() === '12 Lê Lợi' && await t.locator('.xh.on').innerText() === 'chị');
    });
  }
  await ca('dang-nhap-khach-cu', { token: '' }, async (t) => {
    await mo(t, '/dangnhap');
    await t.locator('#sdt').fill('0909123456'); await t.getByRole('button', { name: 'Tiếp tục' }).click();
    await t.locator('#ma').fill('123456'); await t.getByRole('button', { name: 'Xác nhận' }).click(); await t.waitForTimeout(700);
    k('G1 khách cũ → vào thẳng, không qua bước 3', (await t.locator('#ten').count()) === 0 && (await t.locator('#login').count()) === 0);
  });

  await trinh.close();
}
