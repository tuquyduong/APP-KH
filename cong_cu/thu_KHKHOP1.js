#!/usr/bin/env node
// THỬ KH-KHOP-1 — trang /kiemkhop: App KH tự hỏi POS thật, báo ✓ / ✗ / ⏳ từng mục App cần.
// Phần 1: hàm thuần (src/kiemKhop/*) + đối chiếu hợp đồng + đọc nguồn · Phần 2: trang thật trong Chromium + POS giả (page.route).
// Chạy: node cong_cu/thu_KHKHOP1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const doc = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const iAnh = process.argv.indexOf('--anh'); // node cong_cu/thu_KHKHOP1.js --anh <thư mục>: lưu ảnh trang ở 360/390/430
const DIR_ANH = iAnh > 0 ? process.argv[iAnh + 1] : '';
const chuan = (d) => String(d).split('?')[0].replace(/:[A-Za-z_]+/g, ':x');

(async () => {
  console.log('Phần 1 — danh sách, hàm thuần, hợp đồng, đọc nguồn');
  let C = null, H = null, D = null;
  try { C = await nap('src/kiemKhop/canTuPos.js'); } catch (e) { k('nạp src/kiemKhop/canTuPos.js', false, String(e.message).split('\n')[0]); }
  try { H = await nap('src/kiemKhop/kiemKhop.js'); } catch (e) { k('nạp src/kiemKhop/kiemKhop.js', false, String(e.message).split('\n')[0]); }
  D = await nap('src/duongDan.js');
  const ds = C ? C.CAN_TU_POS : [];

  // A1 — danh sách
  const KHOA = ['ma', 'ten', 'cua', 'token', 'truong', 'khi', 'co'];
  k('A1 có ≥ 20 mục, mã không trùng', ds.length >= 20 && new Set(ds.map((m) => m.ma)).size === ds.length, String(ds.length));
  k('A1 mỗi mục đủ khoá ma/ten/cua/token/truong/khi/co; khi ∈ {truoc_kt, sau_kt}; token ∈ {true,false,"tuy_chon"}',
    ds.length > 0 && ds.every((m) => KHOA.every((x) => x in m) && ['truoc_kt', 'sau_kt'].includes(m.khi) && [true, false, 'tuy_chon'].includes(m.token) && Array.isArray(m.truong)));
  k('A1 có cả hai nhóm trước / sau khai trương', ds.some((m) => m.khi === 'truoc_kt') && ds.some((m) => m.khi === 'sau_kt'));
  k('A1 có đủ các việc POS đã chốt: KH-API-3, GIOVANG-1, KH-SP-1, KH-MUA-1', ['KH-API-3', 'GIOVANG-1', 'KH-SP-1', 'KH-MUA-1'].every((v) => ds.some((m) => m.viec_pos === v)));
  k('A1 có trường mới của GIOVANG-1 (gia_mon) và KH-SP-1 (nhu_cau, the_chat, mo_ta, cong_dung, thanh_phan, anh)',
    ['gia_mon', 'nhu_cau', 'the_chat', 'mo_ta', 'cong_dung', 'thanh_phan', 'anh'].every((t) => ds.some((m) => m.truong.some((x) => x.includes(t)))));

  // A2 — đối chiếu hợp đồng hai chiều
  let hd = null;
  try { hd = JSON.parse(/<!-- HOP_DONG_MAY_DOC -->\s*```json\n([\s\S]*?)\n```/.exec(doc('thiet_ke/HOP_DONG_API_KH.md'))[1]); } catch { /* thiếu */ }
  k('A2 đọc được khối HOP_DONG_MAY_DOC', !!hd && Array.isArray(hd.cua));
  if (hd && ds.length) {
    const cuaHd = new Map(hd.cua.map((c) => [`${c.pt} ${chuan(c.duong)}`, c]));
    const khoaCua = (m) => { const [pt, ...r] = String(m.cua).split(' '); return `${pt} ${chuan(r.join(' '))}`; };
    const sai1 = ds.filter((m) => m.co && !cuaHd.has(khoaCua(m))).map((m) => m.ma);
    k('A2 mục "đã có" (co:true) đều là cửa có trong hợp đồng', sai1.length === 0, sai1.join(','));
    const sai2 = ds.filter((m) => !m.co && (cuaHd.has(khoaCua(m)) || !m.viec_pos)).map((m) => m.ma);
    k('A2 mục "chưa có" (co:false) KHÔNG nằm trong hợp đồng và có viec_pos', sai2.length === 0, sai2.join(','));
    const sai3 = ds.filter((m) => m.co && m.moi && !m.viec_pos).map((m) => m.ma);
    k('A2 trường mới (moi:true) ghi viec_pos', sai3.length === 0, sai3.join(','));
    const sai4 = ds.filter((m) => m.co && !m.moi && m.cua.startsWith('GET') && m.truong.some((t) => !(cuaHd.get(khoaCua(m)).tra || []).includes(t))).map((m) => m.ma);
    k('A2 trường của mục cũ (không moi) đều có trong "tra" của hợp đồng', sai4.length === 0, sai4.join(','));
    k('A2 mục POST/PUT chỉ ghi "có trong hợp đồng" (không có truong để kiểm)', ds.filter((m) => /^(POST|PUT)/.test(m.cua)).every((m) => m.truong.length === 0));
  }

  // Hàm thuần
  if (H) {
    const T = H.kiemTruong;
    k('kiemTruong: trường phẳng có / thiếu', T({ a: 1 }, 'a') === 'co' && T({ a: 1 }, 'b') === 'thieu' && T({ a: null }, 'a') === 'co');
    k('kiemTruong: lồng khach.hang.id; thiếu tầng giữa → thieu', T({ khach: { hang: { id: 1 } } }, 'khach.hang.id') === 'co' && T({ khach: {} }, 'khach.hang.id') === 'thieu');
    k('kiemTruong: mảng data[].gia_hang[].gia đủ ở mọi phần tử → co', T({ data: [{ gia_hang: [{ gia: 1 }] }, { gia_hang: [{ gia: 2 }] }] }, 'data[].gia_hang[].gia') === 'co');
    k('kiemTruong: một phần tử thiếu → thieu', T({ data: [{ gia_hang: [{ gia: 1 }] }, { gia_hang: [{}] }] }, 'data[].gia_hang[].gia') === 'thieu');
    k('kiemTruong: mảng rỗng / tầng giữa null → rong (không kiểm được, KHÔNG báo co)', T({ data: [] }, 'data[].ma') === 'rong' && T({ khach: { hang: null } }, 'khach.hang.id') === 'rong' && T({ data: [{ gia_hang: [] }] }, 'data[].gia_hang[].gia') === 'rong');
    k('kiemTruong: nhu_cau[] phải là mảng', T({ data: [{ nhu_cau: [] }] }, 'data[].nhu_cau[]') === 'co' && T({ data: [{ nhu_cau: 'x' }] }, 'data[].nhu_cau[]') === 'thieu' && T({ data: [{}] }, 'data[].nhu_cau[]') === 'thieu');
    k('kiemTruong: dữ liệu không phải đối tượng → thieu', T(null, 'a') === 'thieu' && T('x', 'a') === 'thieu');

    const mCu = { ma: 'x', cua: 'GET /hang', token: false, truong: ['a', 'b'], co: true, viec_pos: '' };
    const mMoi = { ...mCu, truong: ['a', 'm'], moi: true, viec_pos: 'KH-SP-1' };
    const tm = H.trangThaiMuc;
    k('trangThaiMuc: đủ trường → ok', tm(mCu, { ok: true, dl: { a: 1, b: 1 } }, false).tt === 'ok');
    k('trangThaiMuc: thiếu trường cũ → thieu và nêu TÊN trường', (() => { const r = tm(mCu, { ok: true, dl: { a: 1 } }, false); return r.tt === 'thieu' && /\bb\b/.test(r.chu) && !/\ba\b,/.test(r.chu); })());
    k('trangThaiMuc: thiếu trường MỚI → cho (⏳, nêu việc POS), có rồi → ok', (() => { const r = tm(mMoi, { ok: true, dl: { a: 1 } }, false); return r.tt === 'cho' && /KH-SP-1/.test(r.chu) && tm(mMoi, { ok: true, dl: { a: 1, m: 1 } }, false).tt === 'ok'; })());
    k('trangThaiMuc: mảng rỗng → rong', tm({ ...mCu, truong: ['d[].x'] }, { ok: true, dl: { d: [] } }, false).tt === 'rong');
    k('trangThaiMuc: mục chưa có trong hợp đồng → cho "POS đang làm: <việc>", không cần kết quả', (() => { const r = tm({ ...mCu, co: false, viec_pos: 'KH-MUA-1' }, undefined, true); return r.tt === 'cho' && /POS đang làm: KH-MUA-1/.test(r.chu); })());
    k('trangThaiMuc: POST/PUT → hd "có trong hợp đồng", không đòi kết quả', tm({ ...mCu, cua: 'POST /pin', truong: [] }, undefined, true).tt === 'hd');
    k('trangThaiMuc: cửa token, chưa đăng nhập → dn; đã đăng nhập chưa có kết quả → dang', tm({ ...mCu, token: true }, undefined, false).tt === 'dn' && tm({ ...mCu, token: true }, undefined, true).tt === 'dang');
    k('trangThaiMuc: lỗi gọi → loi, hiện nguyên lời lỗi', (() => { const r = tm(mCu, { ok: false, loi: { status: 500, code: 'LOI_MAY_CHU', message: 'Máy bận' } }, false); return r.tt === 'loi' && /Máy bận/.test(r.chu); })());
    k('trangThaiMuc: 401 ở cửa tuy_chon → cho (POS còn đòi đăng nhập), 401 ở cửa công khai → loi', (() => { const e = { ok: false, loi: { status: 401, code: 'KH_TOKEN_SAI', message: 'x' } }; return tm({ ...mCu, token: 'tuy_chon', viec_pos: 'KH-API-3' }, e, false).tt === 'cho' && tm(mCu, e, false).tt === 'loi'; })());
    k('trangThaiMuc: đơn chưa có đơn nào để kiểm (trong:true) → rong', tm({ ...mCu, token: true }, { trong: true }, true).tt === 'rong');

    const ng = H.xepNhom([{ khi: 'sau_kt', ma: 'b' }, { khi: 'truoc_kt', ma: 'a' }, { khi: 'truoc_kt', ma: 'c' }]);
    k('xepNhom: "Trước khai trương" rồi "Sau khai trương", giữ thứ tự trong nhóm', ng.length === 2 && /Trước/.test(ng[0].ten) && /Sau/.test(ng[1].ten) && ng[0].ds.map((m) => m.ma).join() === 'a,c' && ng[1].ds[0].ma === 'b');
    const cc = H.cuaCanGoi([{ co: true, cua: 'GET /menu', token: 'tuy_chon' }, { co: true, cua: 'GET /menu', token: 'tuy_chon' }, { co: true, cua: 'GET /toi', token: true }, { co: true, cua: 'POST /pin', token: true }, { co: false, cua: 'POST /don', token: true }, { co: true, cua: 'GET /gio-hoat-dong', token: false }], false);
    k('cuaCanGoi: mỗi cửa MỘT lần, chỉ GET, chỉ mục co:true, bỏ cửa token khi chưa đăng nhập', JSON.stringify(cc) === JSON.stringify(['GET /menu', 'GET /gio-hoat-dong']), JSON.stringify(cc));
    k('cuaCanGoi: đã đăng nhập thì có thêm cửa token', H.cuaCanGoi([{ co: true, cua: 'GET /toi', token: true }], true).join() === 'GET /toi');
    const kn = H.phanLoaiKetNoi;
    k('phanLoaiKetNoi: thông', kn({ ok: true, dl: { bay_gio: '2026-10-30T20:30:00' } }).tt === 'thong');
    k('phanLoaiKetNoi: MANG_LOI → chan, gợi ý kiểm địa chỉ có "www"', (() => { const r = kn({ ok: false, loi: { status: 0, code: 'MANG_LOI', message: 'm' } }); return r.tt === 'chan' && /www/.test(r.chu); })());
    k('phanLoaiKetNoi: KH_CHUA_CAU_HINH → chưa bật App khách, thiếu khoá trên Render', (() => { const r = kn({ ok: false, loi: { status: 503, code: 'KH_CHUA_CAU_HINH', message: 'm' } }); return r.tt === 'chua_cau_hinh' && /chưa bật App khách/.test(r.chu) && /Render/.test(r.chu); })());
    k('phanLoaiKetNoi: lỗi khác → hiện nguyên error', (() => { const r = kn({ ok: false, loi: { status: 500, code: 'LOI_MAY_CHU', message: 'Máy chủ bận lắm' } }); return r.tt === 'loi' && /Máy chủ bận lắm/.test(r.chu); })());
    k('doLechGiay: bay_gio POS − đồng hồ máy (giờ VN), không dùng new Date(chuỗi)', (() => { const may = Date.UTC(2026, 9, 30, 13, 30, 0); return H.doLechGiay('2026-10-30T20:30:05', may) === 5 && H.doLechGiay('2026-10-30T20:29:50', may) === -10 && H.doLechGiay('hỏng', may) === null; })());
    k('kiemKhop.js không new Date(chuỗi giờ POS)', !/new Date\(\s*[a-z]*bay/i.test(doc('src/kiemKhop/kiemKhop.js')));
  }

  // B1 — đường dẫn, không có lối vào
  const r = D.docDuongDan('/kiemkhop');
  k('B1 /kiemkhop là trang riêng trong bảng đường dẫn, không cần đăng nhập, không thuộc tab nào', r.trang === 'kiemkhop' && !r.canDN && r.tab === null && r.giuCho === true && r.chuan === '/kiemkhop' && D.taoDuongDan('kiemkhop') === '/kiemkhop', JSON.stringify(r));
  k('B1 /Kiemkhop/ chuẩn hoá về /kiemkhop; tiêu đề tab có tên trang', D.docDuongDan('/Kiemkhop/').chuan === '/kiemkhop' && /Kiểm khớp/.test(D.tieuDeTrang('kiemkhop')));
  const loiVao = fs.readdirSync(path.join(GOC, 'src'), { recursive: true }).filter((f) => /\.(jsx?|css)$/.test(f) && !/^kiemKhop[\\/]|KiemKhop\.jsx$|duongDan\.js$|^main\.jsx$/.test(f)).filter((f) => /kiemkhop/i.test(doc('src/' + f)));
  k('B1 không file nào khác của app nhắc /kiemkhop (không lối vào từ tab, menu, tài khoản)', loiVao.length === 0, loiVao.join(','));
  const mj = doc('src/main.jsx');
  k('B1/B4 main.jsx chọn trang KiemKhop riêng cho /kiemkhop (vỏ App không chạy → không tự gọi cửa nào, không gọi theo giờ)', /KiemKhop/.test(mj) && /kiemkhop/i.test(mj));

  // B3, B4, B5, B6 — đọc nguồn
  const kk = doc('src/pages/KiemKhop.jsx');
  k('B6 đầu tệp trang ghi: TẠM công khai tới KH-ADMIN-1, việc đó chuyển vào /admin và XOÁ đường dẫn công khai', /KH-ADMIN-1/.test(kk.split('\n').slice(0, 8).join('\n')) && /công khai/i.test(kk.split('\n').slice(0, 8).join('\n')) && /\/admin/.test(kk.split('\n').slice(0, 8).join('\n')));
  k('B3 trang chỉ gọi mạng qua src/api.js (không fetch trực tiếp, không XMLHttpRequest)', kk.length > 0 && !/\bfetch\(|XMLHttpRequest|sendBeacon/.test(kk + doc('src/kiemKhop/kiemKhop.js')));
  k('B3 không gọi hàm POST/PUT của api.js (xinMa, xacMinh, doiTen, nhanMaBill, nhanDiem, datPin)', kk.length > 0 && !/\b(xinMa|xacMinh|doiTen|nhanMaBill|nhanDiem|datPin)\b/.test(kk));
  k('B4 không setInterval / visibilitychange / gọi nền trong trang', kk.length > 0 && !/setInterval|visibilitychange/.test(kk));
  k('B5 trang không ghi bộ nhớ máy (localStorage / sessionStorage / luuToken)', kk.length > 0 && !/localStorage|sessionStorage|luuToken|ghiGio|ghiMenuLuu/.test(kk));
  k('B2 hiện địa chỉ POS đầy đủ từ VITE_POS_API', /VITE_POS_API/.test(kk));

  console.log('Phần 2 — trang thật trong Chromium + POS giả');
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
  const bundle = (await esbuild.build({
    stdin: { contents: "import './main.jsx';", resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '"http://kh.test"' },
  })).outputFiles[0].text;
  const KHUNG = doc('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>');
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const URL0 = 'http://kh.test';
  const BAY = '2026-10-30T20:30:05';
  const SDT = '0909123456', TEN = 'Linh Riêng', MA_DON = 'TQD41';

  async function ca(ten, { rong = 390, dn = false, pos = {}, dongHo = false } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: rong, height: 844 } });
    const t = await ctx.newPage();
    const loi = [];
    t.on('pageerror', (e) => loi.push(e.message));
    if (dongHo) { await t.clock.install({ time: new Date('2026-10-30T20:30:00+07:00') }); await t.clock.resume(); }
    await t.addInitScript(({ dn }) => { try { if (!sessionStorage.getItem('gieo')) { sessionStorage.setItem('gieo', '1'); if (dn) localStorage.setItem('kh_token', 'tok-A'); } } catch { /* bỏ qua */ } }, { dn });
    const P = { goi: [], ...pos };
    t.P = P;
    await t.route(`${URL0}/**`, async (rq) => {
      const req = rq.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      const json = (status, o) => rq.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) });
      if (p === '/bundle.js') return rq.fulfill({ contentType: 'text/javascript', body: bundle });
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? rq.fulfill({ status: 204, body: '' }) : rq.fulfill({ contentType: 'text/html', body: KHUNG });
      const duong = p.slice('/api/kh'.length);
      P.goi.push({ pt, duong });
      if (duong === '/gio-hoat-dong') {
        if (P.chan) return rq.abort('failed');
        if (P.chuaCauHinh) return json(503, { error: 'Chưa cấu hình', code: 'KH_CHUA_CAU_HINH' });
        if (P.loiGh) return json(500, { error: 'Máy chủ bận lắm', code: 'LOI_MAY_CHU' });
        return json(200, { success: true, bay_gio: BAY, dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [{ thu: 1, mo: '08:00', dong: '22:00', nghi: false }], ngay_nghi: [] });
      }
      if (duong === '/hang') { const h = { id: 1, ten: 'Vàng', phan_tram: 10, phan_tram_nhom_dac_biet: 5, gia_the: 199000, thu_tu: 1 }; if (P.thieuHang) delete h[P.thieuHang]; return json(200, { success: true, data: [h] }); }
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [], ...(P.gvMoi ? { gia_mon: [{ ma: 'TLB', gia_goc: 30000, gia: 25000 }] } : {}) });
      const auth = req.headers().authorization || '';
      if (duong === '/menu') {
        if (P.menuCanDN && !/tok-A/.test(auth)) return json(401, { error: 'Cần đăng nhập', code: 'KH_TOKEN_SAI' });
        const m = { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [{ hang_id: 1, gia: 27000 }] };
        return json(200, { success: true, data: [P.menuMoi ? { ...m, nhu_cau: ['mất ngủ'], the_chat: ['nhiệt'], mo_ta: 'a', cong_dung: 'b', thanh_phan: 'c', anh: 'd' } : m] });
      }
      if (!/tok-A/.test(auth)) return json(401, { error: 'Cần đăng nhập', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(200, { success: true, khach: { sdt: SDT, ten: TEN, ngay_tao: BAY, qr: 'QR', so_du_vi: 100000, hang: null } });
      if (duong === '/diem') return json(200, { success: true, points: 12, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/don') return json(200, { success: true, trang: 1, con_nua: false, data: P.khongDon ? [] : [{ ma: MA_DON, ngay: BAY, tong: 81000, da_tra: 81000, trang_thai: 'completed', thanh_toan: 'paid' }] });
      if (duong === `/don/${MA_DON}`) return json(200, { success: true, don: { ma: MA_DON, ngay: BAY, tong: 81000, da_tra: 81000, trang_thai: 'completed', thanh_toan: 'paid', mon: [{ ten: 'Trà', so_luong: 1, don_gia: 1, thanh_tien: 1, ghi_chu: '' }] } });
      return json(500, { error: 'chưa giả', code: 'LOI_GIA' });
    });
    t.setDefaultTimeout(4000);
    try { await chay(t, loi, P); } catch (e) { k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } finally { await ctx.close(); }
  }
  const mo = async (t, co = '100%') => {
    await t.goto(URL0 + '/kiemkhop'); await t.waitForSelector('#kiemkhop'); await t.waitForTimeout(900);
    if (co === '130%') await t.addStyleTag({ content: 'html{font-size:130% !important}' });
  };
  const chu = (t) => t.locator('#kiemkhop').innerText();
  const dem = (P, pt, d) => P.goi.filter((g) => g.pt === pt && g.duong === d).length;
  const CUA_GET = ['/gio-hoat-dong', '/hang', '/gio-vang', '/menu'];
  const hang = (t, ten) => t.locator('#kiemkhop .muc', { hasText: ten }).first();

  await ca('thong-vang-lai', {}, async (t, loi, P) => {
    await mo(t);
    const nd = await chu(t);
    k('B2 địa chỉ POS hiện đầy đủ (http://kh.test/api/kh)', nd.includes('http://kh.test/api/kh'));
    k('B2 kết nối thông ✓, có giờ POS 20:30:05 và độ lệch với đồng hồ máy', /Thông/.test(await t.locator('#kiemkhop .ket-noi').innerText()) && /20:30:05/.test(nd) && /lệch/i.test(nd), nd.slice(0, 200));
    k('B3 nhóm "Trước khai trương" đứng trước "Sau khai trương"', nd.indexOf('Trước khai trương') >= 0 && nd.indexOf('Trước khai trương') < nd.indexOf('Sau khai trương'));
    k('B3 cửa công khai đủ trường → ✓ (hạng)', /✓/.test(await hang(t, 'Hạng').innerText()));
    k('B3 trường mới chưa có (nhu_cau/mô tả của menu, gia_mon) → ⏳ nêu việc POS, không ✗', (await Promise.all(['KH-SP-1', 'GIOVANG-1'].map(async (v) => { const h = t.locator('#kiemkhop .muc', { hasText: v }).first(); const s = await h.innerText(); return /⏳/.test(s) && !/✗/.test(s); }))).every(Boolean));
    k('B3 cửa chưa có trong hợp đồng (đặt đơn) → ⏳ "POS đang làm: KH-MUA-1", KHÔNG gọi', /POS đang làm: KH-MUA-1/.test(nd) && !P.goi.some((g) => /gio\/bao-gia|\/huy|gia-han|phi-giao/.test(g.duong)) && dem(P, 'POST', '/don') === 0);
    k('B3 cửa cần token khi chưa đăng nhập → "Đăng nhập để kiểm", không gọi /toi /diem /voucher /don', /Đăng nhập để kiểm/.test(nd) && ['/toi', '/diem', '/voucher'].every((d) => dem(P, 'GET', d) === 0) && !P.goi.some((g) => g.duong.startsWith('/don')));
    k('B3 không bao giờ POST / PUT', !P.goi.some((g) => g.pt !== 'GET'), JSON.stringify(P.goi.filter((g) => g.pt !== 'GET')));
    k('B4 mỗi cửa công khai đúng MỘT lần (kể cả /gio-hoat-dong dùng chung phần Kết nối)', CUA_GET.every((d) => dem(P, 'GET', d) === 1), JSON.stringify(P.goi.map((g) => g.duong)));
    k('B3 chỉ gọi cửa có trong hợp đồng', P.goi.every((g) => ['/gio-hoat-dong', '/hang', '/gio-vang', '/menu'].includes(g.duong)), JSON.stringify(P.goi));
    k('B1 trang mở không cần đăng nhập, không thấy thanh tab chứa lối vào', !/dangnhap/.test(t.url()));
    k('B1 trang tự đặt <meta name="robots" content="noindex">', (await t.locator('meta[name="robots"]').getAttribute('content')) === 'noindex');
    k('thong-vang-lai: Lỗi JS = 0', loi.length === 0, loi.join('|'));
  });

  await ca('dang-nhap', { dn: true, pos: { menuMoi: true, gvMoi: true } }, async (t, loi, P) => {
    await mo(t);
    const nd = await chu(t);
    k('B3 đã đăng nhập: gọi MỘT lần mỗi cửa kể cả /toi /diem /voucher /don và /don/:ma', [...CUA_GET, '/toi', '/diem', '/voucher', '/don', `/don/${MA_DON}`].every((d) => dem(P, 'GET', d) === 1), JSON.stringify(P.goi.map((g) => g.duong)));
    k('B3 không còn "Đăng nhập để kiểm"', !/Đăng nhập để kiểm/.test(nd));
    k('B3 trường mới POS đã trả (nhu_cau, mo_ta, gia_mon) → ✓', (await Promise.all(['KH-SP-1', 'GIOVANG-1'].map(async (v) => /✓/.test(await t.locator('#kiemkhop .muc', { hasText: v }).first().innerText())))).every(Boolean));
    k('B3 cửa menu khi đã có token vẫn gọi 1 lần', dem(P, 'GET', '/menu') === 1);
    k('B5 không hiện số điện thoại, tên khách, mã đơn, số điểm', !nd.includes(SDT) && !nd.includes('Linh') && !nd.includes(MA_DON) && !/\b12 điểm|100\.000/.test(nd));
    const kho = await t.evaluate(() => JSON.stringify({ ...localStorage }));
    k('B5 không ghi gì vào bộ nhớ máy (localStorage chỉ còn token đã gieo)', kho === JSON.stringify({ kh_token: 'tok-A' }), kho);
    k('dang-nhap: Lỗi JS = 0', loi.length === 0, loi.join('|'));
  });

  await ca('khong-co-don', { dn: true, pos: { khongDon: true } }, async (t, loi, P) => {
    await mo(t);
    k('B3 khách chưa có đơn: chi tiết đơn "chưa kiểm được", không gọi /don/:ma, không báo ✓ bịa', !P.goi.some((g) => g.duong.startsWith('/don/')) && /chưa kiểm được/i.test(await hang(t, 'Chi tiết đơn').innerText()) && !/✓/.test(await hang(t, 'Chi tiết đơn').innerText()));
  });

  await ca('thieu-truong', { pos: { thieuHang: 'phan_tram' } }, async (t) => {
    await mo(t);
    const h = await hang(t, 'Hạng').innerText();
    k('B3 thiếu trường cũ → ✗ và nêu tên trường (phan_tram), KHÔNG ✓', /✗/.test(h) && /phan_tram/.test(h) && !/✓/.test(h), h);
  });

  await ca('chan-khac-nguon', { pos: { chan: true } }, async (t) => {
    await mo(t);
    const kn = await t.locator('#kiemkhop .ket-noi').innerText();
    k('B2 không gọi được (mạng / chặn khác nguồn) → nói rõ + gợi ý kiểm địa chỉ có "www"', /không gọi được/i.test(kn) && /www/.test(kn), kn);
  });

  await ca('chua-cau-hinh', { pos: { chuaCauHinh: true } }, async (t) => {
    await mo(t);
    const kn = await t.locator('#kiemkhop .ket-noi').innerText();
    k('B2 KH_CHUA_CAU_HINH → "POS chưa bật App khách — thiếu khoá trên Render"', /POS chưa bật App khách/.test(kn) && /thiếu khoá trên Render/.test(kn), kn);
  });

  await ca('loi-khac', { pos: { loiGh: true } }, async (t) => {
    await mo(t);
    k('B2 lỗi khác → hiện nguyên error của POS', /Máy chủ bận lắm/.test(await t.locator('#kiemkhop .ket-noi').innerText()));
  });

  await ca('menu-con-doi-dn', { pos: { menuCanDN: true } }, async (t) => {
    await mo(t);
    const m = await hang(t, 'Menu').innerText();
    k('B3 POS còn đòi đăng nhập ở /menu (chờ KH-API-3) → ⏳ chứ không ✗', /⏳/.test(m) && /KH-API-3/.test(m) && !/✗/.test(m), m);
  });

  await ca('kiem-lai', { dongHo: true }, async (t, loi, P) => {
    await mo(t);
    const nut = t.locator('#kiemkhop button', { hasText: 'Kiểm lại' });
    k('B4 vừa kiểm xong: nút "Kiểm lại" khoá (chống bấm dồn)', await nut.isDisabled());
    await nut.click({ force: true }).catch(() => {});
    await t.waitForTimeout(300);
    k('B4 bấm dồn không gọi thêm', CUA_GET.every((d) => dem(P, 'GET', d) === 1));
    await t.clock.fastForward(130000); await t.waitForTimeout(500);
    k('B4 không gọi theo giờ: sau 130 giây vẫn đúng một lần mỗi cửa', CUA_GET.every((d) => dem(P, 'GET', d) === 1), JSON.stringify(P.goi.map((g) => g.duong)));
    k('B4 qua ≥ 5 giây nút mở', !(await nut.isDisabled()));
    await nut.click(); await t.waitForTimeout(900);
    k('B4 "Kiểm lại" gọi lại đúng một lần mỗi cửa (tổng 2)', CUA_GET.every((d) => dem(P, 'GET', d) === 2), JSON.stringify(P.goi.map((g) => g.duong)));
  });

  for (const rong of [360, 390, 430]) {
    for (const co of ['100%', '130%']) {
      await ca(`man-${rong}-${co}`, { rong, dn: true, pos: { menuMoi: true } }, async (t, loi) => {
        await mo(t, co);
        const tran = await t.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (DIR_ANH && co === '100%') await t.screenshot({ path: path.join(DIR_ANH, `kiemkhop_${rong}.png`), fullPage: true });
        k(`C1 ${rong}px chữ ${co}: không tràn ngang, không lỗi JS`, tran <= 1 && loi.length === 0, `tràn ${tran}px ${loi.join('|')}`);
      });
    }
  }
  await trinh.close();
}
