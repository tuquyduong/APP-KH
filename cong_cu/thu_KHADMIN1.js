#!/usr/bin/env node
// THỬ KH-ADMIN-1 — /admin (đăng nhập tài khoản POS), Chế độ sửa trên App, kho nội dung /api/nd v1, khách nhận bản nội dung mới.
// Phần 1 (luôn chạy, kể cả KHONG_TRINH_DUYET=1): nạp thẳng nd.js, api.js, khoNoiDung.js, duongDan.js, kehoach.js với fetch / kho giả; đọc nguồn; đọc khối HOP_DONG_ND_MAY_DOC.
// Phần 2: App thật trong Chromium (390) với POS /api/kh giả + KHO GIẢ dựng từ khối máy đọc của hợp đồng (đủ mã lỗi) — luồng G3.
// Chạy: node cong_cu/thu_KHADMIN1.js → dòng cuối "n đạt · m hỏng". Không có Playwright / KHONG_TRINH_DUYET=1 → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + String(them).slice(0, 300) : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const doc = (f) => boChuThich(docTho(f));
const nap = async (f) => { try { return await import(pathToFileURL(path.join(GOC, f)).href); } catch (e) { return { loiNap: String(e && e.message).split('\n')[0] }; } };
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} chạy không lỗi`, false, e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e); } };

// Kho giả (localStorage / sessionStorage) — đặt TRƯỚC khi nạp mô-đun.
function khoGia() {
  const m = new Map();
  return { getItem: (x) => (m.has(x) ? m.get(x) : null), setItem: (x, v) => m.set(x, String(v)), removeItem: (x) => m.delete(x), clear: () => m.clear(), key: (i) => [...m.keys()][i] ?? null, get length() { return m.size; }, _m: m };
}
globalThis.localStorage = khoGia();
globalThis.sessionStorage = khoGia();
const nghe = {};
globalThis.document = { visibilityState: 'visible', addEventListener: (t, f) => { (nghe[t] = nghe[t] || []).push(f); }, querySelector: () => null };
let goiMang = [];
let traLoi = () => ({ status: 200, body: { success: true } });
globalThis.fetch = async (url, o = {}) => {
  const tieuDe = o.headers || {};
  goiMang.push({ url: String(url), method: o.method || 'GET', auth: tieuDe.Authorization || tieuDe.authorization || '', body: o.body });
  const r = await traLoi(String(url), o);
  if (r === 'mat_mang') throw new TypeError('Failed to fetch');
  return { ok: r.status >= 200 && r.status < 300, status: r.status, json: async () => r.body };
};

// Khối máy đọc của hợp đồng
const HD = docTho('thiet_ke/HOP_DONG_API_ND.md');
let MAY = null;
try { MAY = JSON.parse((/```json HOP_DONG_ND_MAY_DOC\n([\s\S]*?)\n```/.exec(HD) || [])[1]); } catch { MAY = null; }
const HEX = 'a'.repeat(64);

(async () => {
  console.log('Phần 1 — A. Hợp đồng /api/nd v1');
  await thu('A', async () => {
    const goc = fs.existsSync(path.join(GOC, 'viec/KH-ADMIN-1/hop_dong_nd_v1.md')) ? fs.readFileSync(path.join(GOC, 'viec/KH-ADMIN-1/hop_dong_nd_v1.md')) : null;
    const chep = fs.existsSync(path.join(GOC, 'thiet_ke/HOP_DONG_API_ND.md')) ? fs.readFileSync(path.join(GOC, 'thiet_ke/HOP_DONG_API_ND.md')) : null;
    const sha = chep ? crypto.createHash('sha256').update(chep).digest('hex') : '';
    k('A1 thiet_ke/HOP_DONG_API_ND.md có, sha256 bắt đầu 836eb6ba2554e82d (POS 1a714246, PHIEN_BAN 1)', sha.startsWith('836eb6ba2554e82d'), sha);
    k('A1 bản chép bằng TỪNG BYTE bản gốc trong viec/KH-ADMIN-1/', !!goc && !!chep && Buffer.compare(goc, chep) === 0);
    k('A2 đọc được khối HOP_DONG_ND_MAY_DOC (phiên bản 1)', !!MAY && MAY.phien_ban === 1 && Array.isArray(MAY.cua));
    const kho = doc('src/noiDung/khoNoiDung.js');
    const chuan = (d) => d.replace(/\$\{[^}]*\}/g, ':x').replace(/:\w+/g, ':x');
    const goi = [...kho.matchAll(/goi(?:QT|Cong)\(\s*'(GET|POST|PUT|DELETE)',\s*[`'](\/[^`'?]*)/g)].map((m) => `${m[1]} ${chuan(m[2])}`);
    const hd = MAY ? MAY.cua.map((c) => `${c.phuong_thuc} ${chuan(c.duong)}`) : [];
    const la = [...new Set(goi)].filter((x) => !hd.includes(x));
    const thieu = hd.filter((x) => x !== 'GET /anh/:x' && !goi.includes(x));
    k('A2 MỌI cửa khoNoiDung.js gọi (phương thức + đường) có trong khối máy đọc', goi.length > 0 && la.length === 0, la.join(', ') || 'không thấy lời gọi nào');
    k('A2 App dùng đủ mọi cửa của hợp đồng (trừ GET /anh/:ma — trình duyệt tải bằng <img>)', MAY && thieu.length === 0, thieu.join(', '));
    const nguonQT = ['src/noiDung/khoNoiDung.js', ...['src/components', 'src/pages'].flatMap((d) => fs.readdirSync(path.join(GOC, d)).filter((f) => /^(CheDoSua|QuanTri).*\.jsx$/.test(f)).map((f) => `${d}/${f}`))].map(doc).join('\n');
    const ma = [...new Set([...nguonQT.matchAll(/code\s*===\s*'([A-Z_]+)'/g)].map((m) => m[1]))];
    k('A2 mọi mã lỗi App xử lý riêng (code === …) có trong ma_loi (ít nhất CO_BAN_MOI_HON của D8 / E2)', ma.includes('CO_BAN_MOI_HON') && MAY && ma.every((c) => c in MAY.ma_loi), ma.filter((c) => !MAY || !(c in MAY.ma_loi)).join(',') || `thấy: ${ma.join(',')}`);
    const KN = await nap('src/noiDung/khoNoiDung.js');
    const G = KN.GIOI_HAN || {};
    const can = ['khoa_toi_da', 'ban_toi_da_byte', 'anh_toi_da_byte', 'nhap_toan_bo_toi_da_byte', 'ghi_chu_toi_da'];
    k('A2 giới hạn App kiểm trước (GIOI_HAN một chỗ) = đúng số gioi_han của hợp đồng', MAY && can.every((x) => G[x] === MAY.gioi_han[x]), KN.loiNap || JSON.stringify(G));
  });

  console.log('Phần 1 — B. Khách nhận bản nội dung mới');
  const ND = await nap('src/noiDung/nd.js');
  const KN = await nap('src/noiDung/khoNoiDung.js');
  const API = await nap('src/api.js');
  const await_DM = (await nap('src/noiDung/nd/index.js')).DANH_MUC;
  const coKho = !KN.loiNap && typeof KN.napBanMay === 'function';
  await thu('B', async () => {
    k('B1 nạp được khoNoiDung.js', coKho, KN.loiNap);
    if (!coKho) return;
    k('B1 địa chỉ kho: VITE_ND_API thắng', KN.diaChiKho({ VITE_ND_API: 'https://kho.test/api/nd/', VITE_POS_API: 'https://pos.test' }) === 'https://kho.test/api/nd');
    k('B1 địa chỉ kho: thiếu VITE_ND_API → cùng gốc VITE_POS_API + /api/nd', KN.diaChiKho({ VITE_POS_API: 'https://www.pos.test/' }) === 'https://www.pos.test/api/nd' && KN.diaChiKho({}) === '/api/nd');
    const tatCaSrc = (d) => fs.readdirSync(path.join(GOC, d), { recursive: true }).filter((f) => /\.(jsx?|mjs)$/.test(f)).map((f) => path.join(d, f));
    const fetchNgoai = tatCaSrc('src').filter((f) => f !== path.join('src', 'api.js') && /\bfetch\s*\(/.test(doc(f)));
    k('B1 lệnh fetch vẫn CHỈ ở src/api.js (K1)', fetchNgoai.length === 0, fetchNgoai.join(','));
    const api = doc('src/api.js');
    const than = (/export async function goiKho[\s\S]*?\n}/.exec(api) || [''])[0];
    k('B1 api.js có MỘT hàm gọi kho goiKho, không đọc token khách', !!than && !/docToken|KHOA_TOKEN|tokenBoNho/.test(than), than ? 'goiKho đọc token khách' : 'chưa có goiKho');
    // token / vé không trộn
    localStorage.setItem('kh_token', 'tok-khach');
    KN.luuVe({ ve: 've-quan-tri', het_han: '2026-11-15T23:00:00', quyen: ['nd_xem', 'nd_sua', 'nd_cap_nhat', 'nd_xuat_nhap'], nguoi: { ten_dang_nhap: 'linh', ten_hien: 'Chủ quán Linh' } });
    goiMang = []; traLoi = () => ({ status: 200, body: { success: true, so_ban: 2, nhap: [] } });
    await KN.layNhap();
    await KN.hoiBanMoi();
    const nd1 = goiMang.filter((g) => g.url.includes('/api/nd/'));
    k('B1 yêu cầu /api/nd mang vé quản trị (cửa cần vé), KHÔNG BAO GIỜ token khách', nd1.length === 2 && nd1[0].auth === 'Bearer ve-quan-tri' && nd1.every((g) => !g.auth.includes('tok-khach')), JSON.stringify(nd1.map((g) => g.auth)));
    k('B1 GET /ban-dang-chay (khách) không gắn vé', nd1[1] && nd1[1].auth === '', nd1[1] && nd1[1].auth);
    goiMang = []; traLoi = () => ({ status: 200, body: { success: true, khach: {} } });
    await API.layToi();
    k('B1 yêu cầu /api/kh mang token khách, KHÔNG BAO GIỜ vé quản trị', goiMang.length === 1 && goiMang[0].url.includes('/api/kh/') && goiMang[0].auth === 'Bearer tok-khach', JSON.stringify(goiMang));
    KN.xoaVe(); localStorage.removeItem('kh_token');

    // B2 bản trên máy
    localStorage.setItem('kh_nd_ban', JSON.stringify({ so_ban: 3, gia_tri: { 'home.feat': 'Chữ bản máy' } }));
    KN.napBanMay();
    k('B2 napBanMay đồng bộ: đọc kh_nd_ban → nd() có chữ bản máy NGAY (trước lần vẽ đầu)', ND.nd('home.feat') === 'Chữ bản máy', ND.nd('home.feat'));
    goiMang = []; traLoi = () => ({ status: 200, body: { success: true, khong_doi: true, so_ban: 3 } });
    await KN.hoiBanMoi();
    k('B2 hỏi GET /ban-dang-chay?co=<số bản đang có> (co=3)', goiMang.length === 1 && /\/api\/nd\/ban-dang-chay\?co=3$/.test(goiMang[0].url) && goiMang[0].method === 'GET', goiMang[0] && goiMang[0].url);
    k('B2 khong_doi → giữ nguyên (không ghi máy, chữ như cũ)', JSON.parse(localStorage.getItem('kh_nd_ban')).so_ban === 3 && ND.nd('home.feat') === 'Chữ bản máy');
    traLoi = () => ({ status: 200, body: { success: true, so_ban: 4, gia_tri: { 'home.feat': 'Chữ bản 4' } } });
    await KN.hoiBanMoi();
    k('B2 bản khác → datBanNoiDung + lưu máy kh_nd_ban', ND.nd('home.feat') === 'Chữ bản 4' && JSON.parse(localStorage.getItem('kh_nd_ban')).so_ban === 4);
    traLoi = () => 'mat_mang';
    let nem = false; try { await KN.hoiBanMoi(); } catch { nem = true; }
    k('B2 mất mạng → giữ bản đang có, không ném lỗi', !nem && ND.nd('home.feat') === 'Chữ bản 4' && JSON.parse(localStorage.getItem('kh_nd_ban')).so_ban === 4);
    traLoi = () => ({ status: 500, body: { error: 'Lỗi', code: 'LOI_MAY_CHU' } });
    await KN.hoiBanMoi();
    k('B2 máy chủ lỗi → giữ bản đang có', ND.nd('home.feat') === 'Chữ bản 4');
    localStorage.setItem('kh_nd_ban', '{hỏng');
    KN.napBanMay();
    k('B2 bản máy hỏng → bỏ, không vỡ (về mặc định)', ND.nd('home.feat') === 'Món nổi bật');
    // hỏi lại khi quay lại ≥ 30 phút, không chu kỳ
    const kho = doc('src/noiDung/khoNoiDung.js');
    k('B2 không hỏi theo chu kỳ (không setInterval / setTimeout lặp trong khoNoiDung.js)', !/setInterval|setTimeout/.test(kho));
    k('B2 dùng lại PHUT_KIEM + denLucKiem của src/dangKySW.js (không tự đặt số 30)', /from '\.\.\/dangKySW\.js'/.test(kho) && /PHUT_KIEM|denLucKiem/.test(kho) && !/\b30\b/.test(kho));
    const goc = Date.now;
    let bay = 1_000_000_000_000;
    Date.now = () => bay;
    goiMang = []; traLoi = () => ({ status: 200, body: { success: true, khong_doi: true, so_ban: 0 } });
    KN.batDauNoiDung();
    await new Promise((r) => setTimeout(r, 5));
    const lanDau = goiMang.length;
    const vis = nghe.visibilitychange || [];
    const doi = async (trangThai, phut) => { bay += phut * 60000; document.visibilityState = trangThai; vis.forEach((f) => f()); await new Promise((r) => setTimeout(r, 5)); };
    await doi('hidden', 0); await doi('visible', 10);
    const sau10 = goiMang.length;
    await doi('hidden', 0); await doi('visible', 31);
    const sau31 = goiMang.length;
    Date.now = goc;
    k('B2 mở App: hỏi MỘT lần', lanDau === 1, lanDau);
    k('B2 quay lại sau 10 phút: KHÔNG hỏi; sau ≥ 30 phút: hỏi thêm đúng một lần', sau10 === 1 && sau31 === 2, `${sau10}, ${sau31}`);
    // luuMay không xoá kh_nd_ban
    const LM = await nap('src/luuMay.js');
    const kh = khoGia(); kh.setItem('kh_nd_ban', '{"so_ban":4,"gia_tri":{}}'); kh.setItem('kh_gio', '[]');
    LM.xoaTatCa(kh);
    const conSauDangXuat = kh.getItem('kh_nd_ban') !== null;
    kh.setItem('kh_chu', 'abc'); LM.doiKhach('0900000001', kh);
    k('B2 kh_nd_ban là nội dung CÔNG KHAI: đăng xuất (xoaTatCa) / đổi khách (doiKhach) KHÔNG xoá', conSauDangXuat && kh.getItem('kh_nd_ban') !== null);
    k('B2 kh_nd_ban không nằm trong danh sách xoá của luuMay.js', !/kh_nd_ban/.test(doc('src/luuMay.js')));
  });

  await thu('B3-B4', async () => {
    ND.datBanNoiDung(null);
    const goc = ND.ndAnh('home.logo');
    const lap = (gt) => { ND.datBanNoiDung({ so_ban: 9, gia_tri: { 'home.logo': gt } }); return ND.ndAnh('home.logo'); };
    const la = ['http://x.test/a.png', 'https://x.test/a.png', '//x.test/a.png', 'data:image/png;base64,AAAA', 'javascript:alert(1)', '/anh/../index.html', '/api/nd/anh/abc', `/api/nd/anh/${HEX}x`, ' /anh/a.webp'];
    const sai = la.filter((x) => lap(x) !== goc);
    k('B3 ảnh lạ (http…, //…, data:, javascript:, /anh/../, mã không đủ 64 hex) → macDinh', goc === '/anh/logo-nho.webp' && sai.length === 0, sai.join(' | '));
    k('B3 ảnh có sẵn của App /anh/… nhận', lap('/anh/banner-trang-chu.webp') === '/anh/banner-trang-chu.webp');
    if (coKho) KN.napBanMay();
    const anhKho = lap(`/api/nd/anh/${HEX}`);
    k('B3 ảnh kho /api/nd/anh/<64 hex> nhận, ghép địa chỉ kho ở MỘT chỗ khi vẽ', typeof ND.datGocAnh === 'function' && anhKho === `/api/nd/anh/${HEX}`, anhKho);
    if (typeof ND.datGocAnh === 'function') {
      ND.datGocAnh('https://www.pos.test/api/nd');
      k('B3 gốc kho khác cùng gốc → ndAnh ghép đủ địa chỉ', lap(`/api/nd/anh/${HEX}`) === `https://www.pos.test/api/nd/anh/${HEX}`);
      const can = ND.ndDs('home.need')[0];
      ND.datBanNoiDung({ so_ban: 9, gia_tri: { 'home.need': ND.ndDs('home.need').map((x, i) => (i ? x : { ...x, anh: `/api/nd/anh/${HEX}` })) } });
      const ds1 = ND.ndDs('home.need'), ds2 = ND.ndDs('home.need');
      k('B3 trường ảnh trong danh sách cũng ghép gốc kho; mảng giữ nguyên danh tính giữa hai lần đọc', ds1[0].anh === `https://www.pos.test/api/nd/anh/${HEX}` && ds1 === ds2, ds1[0] && ds1[0].anh);
      ND.datBanNoiDung({ so_ban: 9, gia_tri: { 'home.need': ND.ndDs('home.need').map((x, i) => (i ? x : { ...x, anh: 'javascript:alert(1)' })) } });
      k('B3 trường ảnh lạ trong danh sách → cả mục về macDinh', ND.ndDs('home.need')[0].anh === can.anh);
      ND.datGocAnh('/api/nd');
    }
    ND.datBanNoiDung({ so_ban: 9, gia_tri: { 'home.feat': '<img src=x onerror=alert(1)>' } });
    k('B4 chữ chứa HTML trả nguyên chữ (React vẽ như chữ; ca Chromium ở phần 2)', ND.nd('home.feat') === '<img src=x onerror=alert(1)>');
    const tho = [...fs.readdirSync(path.join(GOC, 'src'), { recursive: true })].filter((f) => /\.(jsx?)$/.test(f) && /dangerouslySetInnerHTML|innerHTML\s*=/.test(doc(path.join('src', f))) && !/(^|[\\/])(App|BieuTuongTienIch)\.jsx$/.test(f));
    k('B4 không tệp nào (ngoài SVG cố định của App.jsx / BieuTuongTienIch.jsx) dùng dangerouslySetInnerHTML / innerHTML', tho.length === 0, tho.join(','));
    ND.datBanNoiDung(null);
  });
  console.log('Phần 1 — C. Đường dẫn /admin, vé quản trị');
  await thu('C', async () => {
    const D = await nap('src/duongDan.js');
    const r = (p) => D.docDuongDan(p);
    k('C1 /admin, /admin/lichsu, /admin/kiemkhop là trang quản trị', r('/admin').trang === 'quantri' && r('/admin/lichsu').trang === 'quantrilichsu' && r('/admin/kiemkhop').trang === 'quantrikiemkhop'
      && ['/admin', '/admin/lichsu', '/admin/kiemkhop'].every((p) => r(p).quanTri === true && r(p).tab === null && r(p).chuan === p), JSON.stringify(r('/admin')));
    k('C1 /Admin/ và /admin/<lạ> → /admin', r('/Admin/').chuan === '/admin' && r('/admin/xyz').trang === 'quantri' && r('/admin/xyz').chuan === '/admin');
    k('C1 trang khách KHÔNG có cờ quanTri', !r('/trangchu').quanTri && !r('/menu').quanTri);
    k('C1 /kiemkhop công khai đã đóng → Trang chủ', r('/kiemkhop').trang === 'trangchu' && r('/kiemkhop').chuan === '/trangchu' && r('/KiemKhop/').chuan === '/trangchu');
    k('C1 đăng nhập KHÁCH không quay về trang quản trị (tiepHopLe)', D.tiepHopLe('/admin') === '' && D.tiepHopLe('/admin/lichsu') === '' && D.tiepHopLe('/uudai') === '/uudai');
    k('C1 DS_MAN (Đi tới màn) có màn khách, không có màn quản trị / giữ chỗ', Array.isArray(D.DS_MAN) && D.DS_MAN.some((e) => e.trang === 'menu') && !D.DS_MAN.some((e) => e.quanTri || e.giuCho));
    const mj = doc('src/main.jsx');
    k('C1 main.jsx thôi dựng /kiemkhop theo pathname; /admin* chọn theo bảng đường dẫn (quanTri)', !/laKiemKhop/.test(mj) && /quanTri/.test(mj) && /QuanTri/.test(mj));
    k('C1 main.jsx nạp bản nội dung máy TRƯỚC render', /batDauNoiDung\(\)[\s\S]*createRoot/.test(mj));
    const khach = ['src/pages', 'src/components'].flatMap((d) => fs.readdirSync(path.join(GOC, d)).filter((f) => !/^(QuanTri|CheDoSua)/.test(f)).map((f) => `${d}/${f}`)).filter((f) => /['"`]\/admin/.test(doc(f)));
    k('C1 không màn / thành phần khách nào dẫn tới /admin', khach.length === 0, khach.join(','));
    if (!coKho) return;
    sessionStorage.clear(); localStorage.clear();
    goiMang = []; traLoi = (u, o) => (JSON.parse(o.body).mat_khau === 'dung' ? { status: 200, body: { success: true, ve: 've-1', het_han: '2026-11-16T08:00:00', quyen: ['nd_xem'], nguoi: { ten_dang_nhap: 'nv', ten_hien: 'Nhân viên Lan' } } } : { status: 401, body: { error: 'Sai tên đăng nhập hoặc mật khẩu', code: 'SAI_DANG_NHAP' } });
    let loi = null; try { await KN.dangNhapQT('nv', 'sai-mat-khau'); } catch (e) { loi = e; }
    k('C2 SAI_DANG_NHAP: hiện NGUYÊN error của máy chủ, không có vé', loi && loi.message === 'Sai tên đăng nhập hoặc mật khẩu' && loi.code === 'SAI_DANG_NHAP' && !KN.coVe());
    traLoi = () => ({ status: 429, body: { error: 'Sai quá nhiều lần, thử lại sau 15 phút', code: 'QUA_NHIEU_LAN' } });
    loi = null; try { await KN.dangNhapQT('nv', 'dung'); } catch (e) { loi = e; }
    k('C2 QUA_NHIEU_LAN: hiện NGUYÊN error', loi && loi.message === 'Sai quá nhiều lần, thử lại sau 15 phút');
    traLoi = (u, o) => ({ status: 200, body: { success: true, ve: 've-1', het_han: '2026-11-16T08:00:00', quyen: ['nd_xem'], nguoi: { ten_dang_nhap: 'nv', ten_hien: 'Nhân viên Lan' } } });
    await KN.dangNhapQT('nv', 'mat-khau-bi-mat');
    const tatCaKho = [...localStorage._m.entries(), ...sessionStorage._m.entries()].map(([a, b]) => a + '=' + b).join('\n');
    k('C2 POST /dang-nhap gửi { ten_dang_nhap, mat_khau }', goiMang.some((g) => g.url.endsWith('/api/nd/dang-nhap') && g.method === 'POST' && JSON.parse(g.body).ten_dang_nhap === 'nv'));
    k('C2 vé giữ trong sessionStorage (khoá riêng), KHÔNG localStorage', KN.coVe() && /ve-1/.test([...sessionStorage._m.values()].join()) && ![...localStorage._m.values()].join().includes('ve-1'));
    k('C2 KHÔNG lưu mật khẩu ở bất kỳ kho nào', !tatCaKho.includes('mat-khau-bi-mat'));
    k('C2 quyen[] chỉ để ẩn / hiện nút (coQuyen đọc vé)', KN.coQuyen('nd_xem') && !KN.coQuyen('nd_cap_nhat'));
    traLoi = () => ({ status: 403, body: { error: 'Bạn không có quyền này', code: 'KHONG_DU_QUYEN' } });
    loi = null; try { await KN.luuNhap('home.feat', 'x', 0); } catch (e) { loi = e; }
    k('C2 403 KHONG_DU_QUYEN → báo nguyên lời, KHÔNG thoát (vé còn)', loi && loi.code === 'KHONG_DU_QUYEN' && loi.message === 'Bạn không có quyền này' && KN.coVe());
    let hetVe = 0; KN.datKhiHetVe(() => { hetVe++; });
    KN.batSua(true);
    traLoi = () => ({ status: 401, body: { error: 'Phiên quản trị đã hết hạn', code: 'CHUA_DANG_NHAP' } });
    loi = null; try { await KN.layNhap(); } catch (e) { loi = e; }
    k('C2 401 khi đang dùng → xoá vé + tắt sửa + gọi về đăng nhập quản trị', loi && !KN.coVe() && !KN.dangSua() && hetVe === 1, `coVe=${KN.coVe()} hetVe=${hetVe}`);
    KN.luuVe({ ve: 've-2', het_han: '', quyen: [], nguoi: {} });
    KN.thoatQuanTri();
    k('C3 Thoát quản trị: xoá vé + tắt Chế độ sửa', !KN.coVe() && !KN.dangSua() && sessionStorage.length === 0);
  });

  console.log('Phần 1 — D. Chế độ sửa: luật chung, lớp nháp, chặn ghi');
  await thu('D', async () => {
    const DM = await_DM || [];
    const m = (khoa) => DM.find((x) => x.khoa === khoa);
    k('D3 nd.js xuất hopLe (một luật cho khách, bảng sửa, bài thử)', typeof ND.hopLe === 'function');
    if (typeof ND.hopLe !== 'function') return;
    const coBien = DM.find((x) => x.loai === 'chu' && (x.bien || []).length === 1);
    const b = coBien.bien[0];
    k('D3 chữ thiếu chip {biến} → không hợp lệ', !ND.hopLe(coBien, coBien.macDinh.replace(`{${b}}`, '')));
    k('D3 chữ thừa chip {lạ} → không hợp lệ', !ND.hopLe(coBien, coBien.macDinh + ' {la}'));
    k('D3 dấu cách đầu / cuối là chữ hợp lệ (không cắt)', ND.hopLe(m('home.feat'), '  Món nổi bật  '));
    k('F2 danh sách có hai dòng giống hệt → không hợp lệ (mọi danh sách)', !ND.hopLe(m('home.feat.mon'), [{ ma: 'A' }, { ma: 'A' }]) && ND.hopLe(m('home.feat.mon'), [{ ma: 'A' }, { ma: 'B' }]));
    ND.datBanNoiDung({ so_ban: 5, gia_tri: { 'home.feat.mon': [{ ma: 'A' }, { ma: 'A' }] } });
    k('F2 bản cập nhật có dòng trùng → khách dùng macDinh của mục đó', JSON.stringify(ND.ndDs('home.feat.mon')) === JSON.stringify(m('home.feat.mon').macDinh));
    k('F2 toàn bộ danh mục vẫn hợp lệ (kiemDanhMuc rỗng)', ND.kiemDanhMuc(DM).length === 0, ND.kiemDanhMuc(DM).slice(0, 3).join(' | '));
    // lớp nháp
    ND.datBanNoiDung({ so_ban: 5, gia_tri: { 'home.feat': 'Bản chạy' } });
    k('D4 nd.js có lớp nháp datLopNhap', typeof ND.datLopNhap === 'function');
    if (typeof ND.datLopNhap === 'function') {
      const p0 = ND.phienNoiDung();
      ND.datLopNhap({ 'home.feat': 'Nháp đang gõ', 'home.feat.mon': [{ ma: 'X' }, { ma: 'X' }] });
      k('D4 lớp nháp: nháp → bản đang chạy → macDinh; nháp sai luật bị bỏ; báo người nghe vẽ lại', ND.nd('home.feat') === 'Nháp đang gõ' && ND.ndDs('home.feat.mon').length === 0 && ND.phienNoiDung() > p0);
      ND.datLopNhap(null);
      k('D4 bỏ lớp nháp → về bản đang chạy', ND.nd('home.feat') === 'Bản chạy');
    }
    ND.datBanNoiDung(null);
    if (coKho) {
      sessionStorage.clear(); localStorage.clear();
      sessionStorage.setItem('nd_sua', '1');
      KN.napBanMay();
      k('D4 khách (không vé) dù có cờ sửa giả trong sessionStorage → KHÔNG bật sửa, không lớp nháp', !KN.dangSua() && (ND.datLopNhap ? ND.nd('home.feat') === 'Món nổi bật' : true));
      KN.luuVe({ ve: 've-3', het_han: '', quyen: ['nd_xem'], nguoi: {} });
      KN.batSua(true);
      KN.napBanMay();
      k('D7 có vé + cờ sửa → napBanMay bật chặn ghi ĐỒNG BỘ (trước lần vẽ đầu)', KN.dangSua() && typeof API.dangCheDoSua === 'function' && API.dangCheDoSua());
      KN.thoatQuanTri();
      k('D7 thoát → tắt chặn ghi', typeof API.dangCheDoSua === 'function' && !API.dangCheDoSua());
    }
    // chặn ghi ở goi()
    k('D7 api.js có datCheDoSua', typeof API.datCheDoSua === 'function');
    if (typeof API.datCheDoSua === 'function') {
      API.datCheDoSua(true);
      traLoi = () => ({ status: 200, body: { success: true } });
      const ghi = { nhanMaBill: ['X'], nhanDiem: ['X'], datPin: ['1234', '1234'], suaHoSo: [{ ten: 'A' }], datDonApp: [{}], huyDonApp: ['TQD1'] };
      const bi = [];
      for (const [f, a] of Object.entries(ghi)) {
        goiMang = []; let e = null; try { await API[f](...a); } catch (x) { e = x; }
        if (!(e && e.code === 'CHE_DO_SUA' && e.status >= 400 && e.status < 500 && goiMang.length === 0)) bi.push(f);
      }
      k('D7 khi sửa: mọi lệnh GHI /api/kh (nhận mã, nhận điểm, PIN, hồ sơ, đặt đơn, huỷ) KHÔNG gửi, báo CHE_DO_SUA (4xx)', bi.length === 0, bi.join(','));
      let eChan = null; try { await API.datDonApp({}); } catch (x) { eChan = x; }
      const QT = await nap('src/noiDung/quanTri.js');
      k('D7 lời báo "Đang ở Chế độ sửa — nút này chỉ để xem" (chữ ở quanTri.js)', eChan && eChan.message === QT.CHAN_KHI_SUA && /Chế độ sửa/.test(QT.CHAN_KHI_SUA || ''), eChan && eChan.message);
      const DD = await nap('src/datDon.js');
      k('D7 lỗi chặn KHÔNG làm đơn "chưa rõ" (datDon.loaiLoi = chua_tao → không tự gửi lại)', DD.loaiLoi(eChan) === 'chua_tao', DD.loaiLoi(eChan));
      const duoc = { layToi: [], layMenu: [], layDon: [1], baoGiaGio: [{}], xinMa: ['0900'], xacMinh: ['0900', '1234'], giaHan: [], layHang: [] };
      const sai = [];
      for (const [f, a] of Object.entries(duoc)) { goiMang = []; try { await API[f](...a); } catch { /* */ } if (goiMang.length !== 1) sai.push(f); }
      k('D7 khi sửa VẪN gửi: mọi GET, báo giá, xin mã / xác minh / gia hạn (K5)', sai.length === 0, sai.join(','));
      API.datCheDoSua(false);
      goiMang = []; try { await API.datDonApp({}); } catch { /* */ }
      k('D7 tắt sửa → lệnh ghi chạy lại bình thường (khách không bị chặn oan)', goiMang.length === 1);
      const nut = QT.NUT_KHOA_KHI_SUA || [];
      const nguon = ['src/pages', 'src/components'].flatMap((d) => fs.readdirSync(path.join(GOC, d)).filter((f) => /\.jsx$/.test(f)).map((f) => doc(`${d}/${f}`))).join('\n');
      k('D7 nút làm thật không qua mạng (Đăng xuất, xoá trên máy) khoá theo khoá data-nd có thật trong màn + danh mục',
        ['tk.dangXuat', 'hx.xoa', 'tnk.xoa', 'kh.xoaHoiLai'].every((x) => nut.includes(x)) && nut.every((x) => m(x) && (nguon.includes(`'${x}'`) || nguon.includes(`"${x}"`))), JSON.stringify(nut));
    }
    // khoá chữ khu quản trị
    const QT = await nap('src/noiDung/quanTri.js');
    k('G1 chữ khu quản trị ở src/noiDung/quanTri.js, KHÔNG vào danh mục (không sửa ở /admin)', !QT.loiNap && !/quanTri/.test(doc('src/noiDung/nd/index.js')), QT.loiNap);
    const bang = doc('src/components/CheDoSuaBang.jsx');
    k('D3 bảng sửa không cắt khoảng trắng (không .trim()) và kiểm bằng hopLe của nd.js', !!bang && !/\.trim\(/.test(bang) && /hopLe/.test(bang) && /from '\.\.\/noiDung\/nd\.js'/.test(bang));
    k('D3 bảng sửa sinh theo đủ 6 loại', ['chu', 'doan', 'nut', 'anh', 'danhsach', 'battat'].every((l) => new RegExp(`'${l}'`).test(bang)));
    k('D2 lớp ✎ / 🔒 vẽ ở portal riêng, không chèn phần tử vào nút React của màn (không appendChild / insertAdjacent)', /createPortal/.test(doc('src/components/CheDoSua.jsx')) && !/appendChild|insertAdjacent|innerHTML/.test(doc('src/components/CheDoSua.jsx') + bang));
    k('D3 bảng sửa / xem lại mang role="dialog" (dangKySW không tự tải lại khi đang gõ)', /role="dialog"/.test(doc('src/components/CheDoSua.jsx') + bang));
  });

  console.log('Phần 1 — F1. Lễ không vào "Sắp tới" theo dấu hiệu không đổi khi sửa chữ');
  await thu('F1', async () => {
    const KH = await nap('src/kehoach.js');
    const amGoc = ND.ndDs('kh.leAmLich');
    const homNay = { d: 1, m: 9, y: 2026 }; // Trung thu 2026 = 25/9 dương — trong 30 ngày
    const tenSapToi = () => KH.upList(homNay, KH.keHoachTrong(), 'chi').filter((x) => x.di === 'le').map((x) => x.t); // dòng lễ (dòng "cúng" của tiện ích Văn khấn là việc khác)
    ND.datBanNoiDung(null);
    const truoc = tenSapToi();
    ND.datBanNoiDung({ so_ban: 7, gia_tri: { 'kh.leAmLich': amGoc.map((x) => (x.ten === 'Tết Trung thu' ? { ...x, ten: 'Rằm tháng Tám' } : x)) } });
    const sau = tenSapToi();
    k('F1 bản mặc định: Tết Trung thu không vào "Sắp tới"', !truoc.includes('Tết Trung thu'), truoc.join(','));
    k('F1 đổi tên "Tết Trung thu" → "Rằm tháng Tám" ở /admin: vẫn KHÔNG vào "Sắp tới"', !sau.includes('Rằm tháng Tám'), sau.join(','));
    k('F1 đối chứng: lễ khác trong 30 ngày (Quốc khánh 2/9) vẫn vào', sau.includes('Quốc khánh'));
    k('F1 KHONG_VAO_SAP_TOI không so theo TÊN lễ', !/KHONG_VAO_SAP_TOI\s*=\s*\/[^/]*Trung thu/.test(doc('src/kehoach.js')));
    ND.datBanNoiDung(null);
  });

  console.log('Phần 2 — App thật trong Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await trinhDuyet(pw).catch((e) => k('Phần 2 chạy không lỗi', false, e && e.stack));
  }
  console.log(`  (chạy hết ${Math.round(process.uptime())} giây — bộ kiểm cắt ở 120 giây)`);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

// ===== Phần 2 (Chromium) =====
// KHO GIẢ dựng TỪ khối HOP_DONG_ND_MAY_DOC: chỉ trả lời đúng các cửa trong `cua[]`, quyền theo `quyen`, mã lỗi + status theo `ma_loi`, giới hạn theo `gioi_han`.
function khoGiaND() {
  const QUYEN_HET = MAY.quyen.map((q) => q.ma);
  const K = {
    ban: [], dangChay: 0, nhap: new Map(), anh: new Map(), nhatKy: [], goi: [], ngoaiHopDong: [], chen409: 0, luc: 0,
    tk: { linh: { mk: 'dung', quyen: QUYEN_HET, ten_hien: 'Chủ quán Linh' }, nv: { mk: 'dung', quyen: ['nd_xem'], ten_hien: 'Nhân viên Lan' }, sua: { mk: 'dung', quyen: ['nd_xem', 'nd_sua'], ten_hien: 'Bạn Sửa' } },
    ve: new Map(),
  };
  const gio = () => `2026-10-30T20:${String(31 + (K.luc++ % 28)).padStart(2, '0')}:00`;
  const loi = (code, them = {}) => ({ st: MAY.ma_loi[code], o: { error: `Lời kho giả: ${code}`, code, ...them } });
  const ok = (o) => ({ st: 200, o: { success: true, ...o } });
  const banChay = () => K.ban.find((b) => b.so_ban === K.dangChay) || { so_ban: 0, gia_tri: {} };
  const taoBan = (gia_tri, nguoi, ghi_chu, tu_ban, tom_tat) => { const so = K.ban.length + 1; K.ban.push({ so_ban: so, gia_tri, ghi_chu: ghi_chu || '', tom_tat, nguoi, luc: gio(), tu_ban }); K.dangChay = so; return so; };
  const khop = (mau, duong) => { const a = mau.split('/'), b = duong.split('/'); if (a.length !== b.length) return null; const t = {}; return a.every((x, i) => (x.startsWith(':') ? ((t[x.slice(1)] = decodeURIComponent(b[i])), !!b[i]) : x === b[i])) ? t : null; };
  K.traLoi = (pt, duong, truyVan, than, auth, tho) => {
    const cua = MAY.cua.map((c) => ({ c, t: c.phuong_thuc === pt ? khop(c.duong, duong) : null })).find((x) => x.t);
    K.goi.push({ pt, duong, truyVan, than, auth });
    if (!cua) { K.ngoaiHopDong.push(`${pt} ${duong}`); return loi('KHONG_TIM_THAY'); }
    const { c, t } = cua;
    let ai = null;
    if (c.quyen) {
      ai = K.ve.get((auth || '').replace(/^Bearer /, ''));
      if (!ai) return loi('CHUA_DANG_NHAP');
      if (!K.tk[ai].quyen.includes(c.quyen)) return loi('KHONG_DU_QUYEN');
    }
    const nguoi = ai ? K.tk[ai].ten_hien : null;
    const key = `${pt} ${c.duong}`;
    if (key === 'GET /ban-dang-chay') { const b = banChay(); return truyVan.get('co') !== null && +truyVan.get('co') === b.so_ban ? ok({ khong_doi: true, so_ban: b.so_ban }) : ok({ so_ban: b.so_ban, gia_tri: b.gia_tri }); }
    if (key === 'POST /dang-nhap') {
      const tk = K.tk[than && than.ten_dang_nhap];
      if (!tk || tk.mk !== than.mat_khau) return loi('SAI_DANG_NHAP');
      const ve = 've-' + crypto.randomBytes(6).toString('hex'); K.ve.set(ve, than.ten_dang_nhap);
      return ok({ ve, het_han: '2026-10-31T08:30:00', quyen: tk.quyen, nguoi: { ten_dang_nhap: than.ten_dang_nhap, ten_hien: tk.ten_hien } });
    }
    if (key === 'GET /nhap') return ok({ so_ban: K.dangChay, nhap: [...K.nhap.values()] });
    if (key === 'PUT /nhap') {
      if (!than || typeof than.khoa !== 'string' || !/^[a-zA-Z0-9._-]{1,80}$/.test(than.khoa)) return loi('KHOA_KHONG_HOP_LE');
      if (than.gia_tri === undefined || than.gia_tri === null) return loi('GIA_TRI_KHONG_HOP_LE');
      K.nhap.set(than.khoa, { khoa: than.khoa, gia_tri: than.gia_tri, nguoi, luc: gio(), ban_goc: than.ban_goc });
      return ok({ khoa: than.khoa, luc: K.nhap.get(than.khoa).luc });
    }
    if (key === 'DELETE /nhap/:khoa') return K.nhap.delete(t.khoa) ? ok({ khoa: t.khoa }) : loi('KHONG_TIM_THAY');
    if (key === 'POST /cap-nhat' || key === 'POST /quay-lai') {
      if (K.chen409 > 0) { K.chen409--; taoBan({ ...banChay().gia_tri, 'home.feat': 'Người khác vừa cập nhật' }, 'Người khác', '', null, 'chen'); }
      if (than.ban_goc !== K.dangChay) return loi('CO_BAN_MOI_HON');
      if (than.ghi_chu && than.ghi_chu.length > MAY.gioi_han.ghi_chu_toi_da) return loi('DU_LIEU_KHONG_HOP_LE');
      if (key === 'POST /cap-nhat') {
        if (!K.nhap.size) return loi('KHONG_CO_NHAP');
        const gt = { ...banChay().gia_tri }; K.nhap.forEach((x) => { gt[x.khoa] = x.gia_tri; });
        const so = taoBan(gt, nguoi, than.ghi_chu, null, `${K.nhap.size} mục`); const n = K.nhap.size; K.nhap.clear();
        return ok({ so_ban: so, tu_ban: null, so_khoa: n });
      }
      const cu = K.ban.find((b) => b.so_ban === than.so); if (!cu) return loi('KHONG_TIM_THAY');
      return ok({ so_ban: taoBan({ ...cu.gia_tri }, nguoi, than.ghi_chu, cu.so_ban, `Quay lại bản ${cu.so_ban}`), tu_ban: cu.so_ban });
    }
    if (key === 'GET /phien-ban') return ok({ data: K.ban.slice().reverse().map(({ gia_tri, ...b }) => ({ ...b, dang_chay: b.so_ban === K.dangChay })) });
    if (key === 'GET /phien-ban/:so') { const b = K.ban.find((x) => x.so_ban === +t.so); return b ? ok({ ban: { ...b, dang_chay: b.so_ban === K.dangChay } }) : loi('KHONG_TIM_THAY'); }
    if (key === 'POST /anh') {
      const buf = tho || Buffer.alloc(0);
      const i = buf.indexOf('\r\n\r\n'), j = buf.lastIndexOf('\r\n--');
      const ten = /name="([^"]+)"/.exec(buf.slice(0, Math.max(i, 0)).toString()) || [];
      const tep = i > 0 && j > i ? buf.slice(i + 4, j) : Buffer.alloc(0);
      K.anhTruong = ten[1];
      if (tep.length > MAY.gioi_han.anh_toi_da_byte) return loi('QUA_LON');
      const loai = tep.slice(0, 4).toString() === 'RIFF' && tep.slice(8, 12).toString() === 'WEBP' ? 'webp' : tep[0] === 0xff && tep[1] === 0xd8 ? 'jpeg' : tep[1] === 0x50 && tep[2] === 0x4e ? 'png' : '';
      if (!loai || ten[1] !== 'anh') return loi('ANH_KHONG_HOP_LE');
      const ma = crypto.createHash('sha256').update(tep).digest('hex'); const moi = !K.anh.has(ma); K.anh.set(ma, { loai, du_lieu: tep });
      return ok({ ma, url: `/api/nd/anh/${ma}`, loai, kich_thuoc: tep.length, moi });
    }
    if (key === 'GET /xuat') return ok({ dinh_dang: 1, xuat_luc: gio(), ban: K.ban.map((b) => ({ ...b, dang_chay: b.so_ban === K.dangChay })), nhap: [...K.nhap.values()], anh: [], nhat_ky: K.nhatKy });
    if (key === 'POST /nhap-toan-bo') {
      if (K.ban.length || K.nhap.size || K.anh.size) return loi('KHO_DA_CO_DU_LIEU');
      if (!than || than.dinh_dang !== 1 || !Array.isArray(than.ban)) return loi('DU_LIEU_KHONG_HOP_LE');
      than.ban.forEach((b) => K.ban.push({ ...b })); K.dangChay = (than.ban.find((b) => b.dang_chay) || {}).so_ban || 0;
      (than.nhap || []).forEach((x) => K.nhap.set(x.khoa, x));
      return ok({ so_luong_ban: than.ban.length, so_nhap: (than.nhap || []).length, so_anh: 0, so_nhat_ky: 0 });
    }
    return loi('LOI_MAY_CHU');
  };
  return K;
}

async function trinhDuyet(pw) {
  if (!MAY) { k('Phần 2 cần khối HOP_DONG_ND_MAY_DOC', false); return; }
  const esbuild = require('esbuild');
  const goiApp = (await esbuild.build({
    stdin: { contents: `import './main.jsx';`, resolveDir: path.join(GOC, 'src'), loader: 'jsx' },
    bundle: true, write: false, format: 'iife', jsx: 'automatic', logLevel: 'silent',
    loader: { '.css': 'empty', '.json': 'json' }, define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_POS_API': '""' },
  })).outputFiles[0].text;
  const cssTron = (f) => doc(f).replace(/@import\s+'\.\/([^']+)';/g, (_, t) => cssTron(path.posix.join(path.posix.dirname(f), t)));
  const css = [...doc('src/main.jsx').matchAll(/import '\.\/(giaoDien\/[^']+\.css)'/g)].map((m) => cssTron('src/' + m[1])).join('\n');
  const HTML = docTho('index.html').replace(/<script type="module"[^>]*><\/script>/, '<script src="/bundle.js"></script>').replace('</head>', `<style>${css}</style></head>`);
  const URL0 = 'http://kh.test';
  const ANH_DIR = path.join(GOC, 'viec/KH-ADMIN-1/so_anh');
  const chup = process.env.LUU_ANH === '1';
  if (chup) fs.mkdirSync(ANH_DIR, { recursive: true });
  const DM = (await import(pathToFileURL(path.join(GOC, 'src/noiDung/nd/index.js')).href)).DANH_MUC;
  const QT = await import(pathToFileURL(path.join(GOC, 'src/noiDung/quanTri.js')).href);
  const MENU_DS = [
    { ma: 'TLB', ten: 'Trà Lục Bảo', nhom: 'Trà Đông Y', gia: 30000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
    { ma: 'CFM', ten: 'Cà phê Muối', nhom: 'Cà phê', gia: 39000, con_hang: true, ton_cu: false, ton_luc: null, gia_hang: [] },
  ];
  const BG = { dong: [{ ma: 'TLB', so_luong: 1, don_gia: 30000, thanh_tien: 30000 }], tam_tinh: 30000, giam: [], phi_giao: 0, tong: 30000, ma_giam_loi: null };
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  const K = khoGiaND();

  async function may(ten, { dn = true, ve = null, sua = false, gio = null, kho = K } = {}, chay) {
    const ctx = await trinh.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Ho_Chi_Minh', acceptDownloads: true });
    await ctx.clock.install({ time: new Date('2026-10-30T20:30:00+07:00') }); await ctx.clock.resume();
    await ctx.addInitScript(({ dn, ve, sua, gio }) => {
      if (sessionStorage.getItem('da_gieo')) return;
      sessionStorage.setItem('da_gieo', '1');
      localStorage.setItem('kh_ngay_man_dau', '2026-10-30');
      if (dn) localStorage.setItem('kh_token', 'tok-A');
      if (ve) sessionStorage.setItem('nd_ve', JSON.stringify(ve));
      if (sua) sessionStorage.setItem('nd_sua', '1');
      if (gio) localStorage.setItem('kh_gio', JSON.stringify(gio));
    }, { dn, ve, sua, gio });
    const S = { goi: [], guiDon: 0 };
    const loiTrang = [];
    await ctx.route(`${URL0}/**`, async (r) => {
      const req = r.request(), u = new URL(req.url()), p = u.pathname, pt = req.method();
      const json = (status, o) => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(o) }).catch(() => {});
      if (p === '/bundle.js') return r.fulfill({ contentType: 'text/javascript', body: goiApp });
      if (p.startsWith('/api/nd/')) {
        const duong = p.slice('/api/nd'.length);
        if (pt === 'GET' && /^\/anh\/[0-9a-f]{64}$/.test(duong)) { const a = kho.anh.get(duong.slice(5)); return a ? r.fulfill({ status: 200, contentType: `image/${a.loai}`, body: a.du_lieu }) : json(404, { error: 'x', code: 'KHONG_TIM_THAY' }); }
        let than; try { than = JSON.parse(req.postData()); } catch { than = undefined; }
        const x = kho.traLoi(pt, duong, u.searchParams, than, req.headers().authorization || '', req.postDataBuffer());
        return json(x.st, x.o);
      }
      if (!p.startsWith('/api/kh')) return /\.[a-z0-9]+$/.test(p) ? r.fulfill({ status: 204, body: '' }) : r.fulfill({ contentType: 'text/html', body: HTML });
      const duong = p.slice('/api/kh'.length);
      S.goi.push({ pt, duong, auth: req.headers().authorization || '' });
      if (duong === '/gio-vang') return json(200, { success: true, dang_chay: false, bat_dau: null, ket_thuc: null, phan_tram: 0, mon: [] });
      if (duong === '/hang') return json(200, { success: true, data: [] });
      if (duong === '/chuong-trinh') return json(200, { success: true, data: [] });
      if (duong === '/gio-hoat-dong') return json(200, { success: true, bay_gio: '2026-10-30T20:30:00', dang_mo: true, nhan_don: true, hom_nay: { mo: '08:00', dong: '22:00' }, mo_lai_luc: null, thong_bao: '', lich_tuan: [], ngay_nghi: [] });
      if (duong === '/menu') return json(200, { success: true, data: MENU_DS });
      if (!/tok-A/.test(req.headers().authorization || '')) return json(401, { error: 'Phiên đăng nhập đã hết', code: 'KH_TOKEN_SAI' });
      if (duong === '/toi') return json(200, { success: true, khach: { sdt: '0909123456', ten: 'Linh', ngay_tao: '2026-10-30T08:00:00', xung_ho: 'chi', dia_chi: null, qr: 'QR', hang: null, so_du_vi: 0 } });
      if (duong === '/diem') return json(200, { success: true, points: 0, history: [] });
      if (duong === '/voucher') return json(200, { success: true, data: [], ma_khach_moi: [] });
      if (duong === '/don' && pt === 'GET') return json(200, { success: true, trang: 1, con_nua: false, data: [] });
      if (duong === '/gio/bao-gia') return json(200, { success: true, ...BG });
      if (duong === '/gia-han') return json(200, { success: true, token: 'tok-A', het_han: '2026-11-29T08:00:00' });
      if (pt !== 'GET') { S.guiDon++; return json(200, { success: true }); }
      return json(500, { error: 'chưa giả', code: 'LOI_MAY_CHU' });
    });
    const t = await ctx.newPage(); t.on('pageerror', (e) => loiTrang.push(e.message)); t.setDefaultTimeout(6000);
    t.on('console', (m) => { if (m.type() === 'error' && /removeChild|insertBefore/.test(m.text())) loiTrang.push(m.text()); });
    try { await chay({ t, S, ctx }); } catch (e) {
      k(`ca ${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]);
      if (process.env.ANH_LOI) await t.screenshot({ path: path.join(process.env.ANH_LOI, `loi_${ten}.png`) }).catch(() => {});
    }
    k(`[${ten}] trang không báo lỗi JS (kể cả removeChild)`, loiTrang.length === 0, loiTrang[0]);
    await ctx.close();
  }
  const doi = async (t, fn, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await t.waitForTimeout(40); } return false; };
  const chu = (t, sel) => t.locator(sel).first().textContent().catch(() => '');
  const anh = async (t, ten) => { if (chup) await t.screenshot({ path: path.join(ANH_DIR, `${ten}.png`) }); };
  const but = (t, khoa) => t.locator(`.cms-lop .cms-pen[data-but="${khoa}"]`);
  const bang = (t) => t.locator('#sheetCms');
  const toast = (t) => chu(t, '.toast.show');
  const hienBut = async (t, khoa) => { await t.locator(`.screen.active [data-nd="${khoa}"]`).first().scrollIntoViewIfNeeded().catch(() => {}); return doi(t, async () => (await but(t, khoa).count()) > 0); };
  const moBut = async (t, khoa) => { await hienBut(t, khoa); await but(t, khoa).first().click(); await t.locator(`[data-bang-sua="${khoa}"]`).waitFor(); };
  const tren = (t) => t.evaluate(() => location.pathname + location.search);
  const goiKho = (pt, duong) => K.goi.filter((g) => g.pt === pt && g.duong === duong);

  // ---- C1, C2, C3: đăng nhập quản trị ----
  await may('quan-tri', { dn: true, gio: [{ ma: 'TLB', so_luong: 1, ghi_chu: '' }] }, async ({ t, S }) => {
    await t.goto(URL0 + '/admin'); await t.locator('#qt-dang-nhap').waitFor();
    k('C1 /admin: màn đăng nhập quản trị, không thanh tab, không gọi cửa khách nào', (await t.locator('.tabbar').count()) === 0 && S.goi.length === 0, JSON.stringify(S.goi));
    k('C1 /admin* có meta robots noindex', (await t.locator('meta[name="robots"][content="noindex"]').count()) === 1);
    await anh(t, '390_admin_dang_nhap');
    await t.fill('input[name="ten"]', 'linh'); await t.fill('input[name="mat_khau"]', 'sai');
    await t.click('#qt-dang-nhap button[type="submit"]');
    k('C2 sai mật khẩu → hiện NGUYÊN error của máy chủ', await doi(t, async () => (await chu(t, '#qt-dang-nhap [role="alert"]')) === 'Lời kho giả: SAI_DANG_NHAP'));
    await t.fill('input[name="mat_khau"]', 'dung'); await t.click('#qt-dang-nhap button[type="submit"]');
    await t.locator('#qt-bang').waitFor();
    const kho = await t.evaluate(() => ({ l: JSON.stringify({ ...localStorage }), s: JSON.stringify({ ...sessionStorage }) }));
    k('C2 vé ở sessionStorage nd_ve, không ở localStorage; không lưu mật khẩu', /"nd_ve"/.test(kho.s) && /ve-/.test(kho.s) && !/ve-/.test(kho.l) && !/dung/.test(kho.l + kho.s.replace(/"ve":"[^"]*"/, '')), kho.s);
    k('C3 bảng quản trị: tên người, bản đang chạy (kho trống), số nháp, đủ 5 nút (có Xuất / Nhập vì có quyền)', await doi(t, async () => /Chủ quán Linh/.test(await chu(t, '#qt-bang')) && /chưa có bản/.test(await chu(t, '#qt-bang')) && /Không có thay đổi/.test(await chu(t, '#qt-bang')))
      && (await t.locator('#qt-bang button').count()) === 5);
    await anh(t, '390_admin_bang');
    await t.click(`#qt-bang button:has-text("${QT.qt('nutSua')}")`);
    await t.waitForURL(URL0 + '/trangchu'); await t.locator('.cms-bar').waitFor();
    k('C3 "Bật Chế độ sửa" → Trang chủ, Chế độ sửa bật', (await t.locator('.phone.cms-on').count()) === 1);
    // D2 bút
    k('D2 tiêu đề banner Trang chủ có ĐÚNG một bút ✎', await doi(t, async () => (await but(t, 'today.t').count()) === 1));
    const buts = await t.locator('.cms-lop .cms-pen').evaluateAll((ds) => ds.map((d) => d.dataset.but));
    k('D2 mỗi phần tử đang thấy một bút, bút khoá 🔒 cho mục khoá', buts.length > 8 && (await t.locator('.cms-lop .cms-pen.khoa').count()) >= 1, buts.length);
    await anh(t, '390_trangchu_dang_sua');
    // D3 + D4: gõ → trang đổi ngay → Lưu (không cắt khoảng trắng)
    await moBut(t, 'today.t');
    k('D3 bảng sửa nằm trong role="dialog"', (await t.locator('#sheetCms [role="dialog"]').count()) >= 1);
    await t.locator('[data-bang-sua="today.t"] input.cs-in').fill('Chào mùa đông ');
    k('D4 gõ tới đâu trang phía sau đổi tới đó (xem trước)', await doi(t, async () => (await chu(t, '.today b')) === 'Chào mùa đông '));
    await anh(t, '390_bang_sua_chu');
    await t.click('[data-bang-sua="today.t"] .cs-next');
    k('D3 Lưu → PUT /nhap với chữ NGUYÊN (dấu cách cuối còn), ban_goc = bản đang chạy', await doi(t, async () => goiKho('PUT', '/nhap').some((g) => g.than.khoa === 'today.t' && g.than.gia_tri === 'Chào mùa đông ' && g.than.ban_goc === 0)));
    k('D1 thanh: "1 thay đổi chưa cập nhật"; nút Cập nhật sáng', await doi(t, async () => /1 thay đổi chưa cập nhật/.test(await chu(t, '.cms-bar .cb-t')) && !(await t.locator('.cms-bar button.pri').isDisabled())));
    await t.click('[data-bang-sua="today.t"] .cs-h button');
    // D8 Xem lại + 409
    await t.click(`.cms-bar button:has-text("${QT.qt('xemLai')}")`);
    k('D8 Xem lại: tên mục, cũ ↔ mới', await doi(t, async () => /Hôm nay bạn muốn uống gì\?/.test(await chu(t, '[data-xem-lai="today.t"] del')) && /Chào mùa đông/.test(await chu(t, '[data-xem-lai="today.t"] ins'))));
    await anh(t, '390_xem_lai');
    K.chen409 = 1;
    await t.click('#sheetCms .cs-pub');
    k('D8 409 CO_BAN_MOI_HON → báo "Có bản mới hơn…", KHÔNG tự gửi lại', await doi(t, async () => /Có bản mới hơn/.test(await toast(t))) && goiKho('POST', '/cap-nhat').length === 1);
    await t.waitForTimeout(300);
    k('D8 409: sau khi báo vẫn chỉ MỘT lần POST /cap-nhat', goiKho('POST', '/cap-nhat').length === 1);
    await t.click('#sheetCms .cs-pub');
    k('D8 Cập nhật lại (ban_goc mới) → bản mới; trình duyệt đang sửa áp ngay + lưu máy', await doi(t, async () => /Đã cập nhật bản 2/.test(await toast(t)))
      && goiKho('POST', '/cap-nhat')[1].than.ban_goc === 1 && JSON.parse(await t.evaluate(() => localStorage.getItem('kh_nd_ban'))).so_ban === 2 && (await chu(t, '.today b')) === 'Chào mùa đông ');
    // D3 chip
    const truocSub = await chu(t, '[data-nd="home.sub"]');
    await moBut(t, 'home.sub');
    const o = t.locator('[data-bang-sua="home.sub"] input.cs-in'); const goc = await o.inputValue();
    await o.fill(goc.replace('{khauHieu}', ''));
    k('D3 thiếu chip {biến} → Lưu mờ + lý do', (await t.locator('[data-bang-sua="home.sub"] .cs-next').isDisabled()) && /Thiếu chỗ điền/.test(await chu(t, '[data-bang-sua="home.sub"]')));
    await t.click('[data-bang-sua="home.sub"] .cs-chips button');
    k('D3 bấm chip chèn lại → Lưu sáng', !(await t.locator('[data-bang-sua="home.sub"] .cs-next').isDisabled()));
    await o.fill(goc + ' {la}');
    k('D3 thừa chip lạ → Lưu mờ', await t.locator('[data-bang-sua="home.sub"] .cs-next').isDisabled());
    await t.click('[data-bang-sua="home.sub"] .cs-h button');
    k('D4 đóng bảng chưa Lưu → trang về bản đang chạy', await doi(t, async () => (await chu(t, '[data-nd="home.sub"]')) === truocSub));
    // D5 Chữ của màn này
    await doi(t, async () => (await t.locator('.cms-lop .cms-pen').count()) > 8);
    const manThay = new Set((await t.locator('.cms-lop .cms-pen').evaluateAll((ds) => ds.map((d) => d.dataset.but))).map((x) => (DM.find((m) => m.khoa === x) || {}).man).filter(Boolean));
    await t.click(`.cms-bar button:has-text("${QT.qt('chuMan')}")`);
    await t.locator('[data-chu-man]').first().waitFor();
    const coRow = new Set(await t.locator('[data-chu-man]').evaluateAll((ds) => ds.map((d) => d.dataset.chuMan)));
    const can = DM.filter((m) => manThay.has(m.man)).map((m) => m.khoa);
    k('D5 "Chữ của màn này" = MỌI mục danh mục cùng `man` với phần tử đang hiện (gồm công tắc hien.*, chữ thỉnh thoảng mới hiện)', can.length === coRow.size && can.every((x) => coRow.has(x)) && can.some((x) => x.startsWith('hien.')), `${can.length} ≠ ${coRow.size}`);
    await anh(t, '390_chu_cua_man');
    // D3 sáu loại bảng sửa (mở từ danh sách)
    const loai = { chu: 'input.cs-in', doan: 'textarea.cs-ta', nut: 'select', anh: '.cs-up input[type="file"]', danhsach: '.cs-dong, .cs-undo', battat: 'input[type="checkbox"]' };
    const daLoai = {};
    for (const [l, sel] of Object.entries(loai)) {
      const m = DM.find((x) => x.loai === l && coRow.has(x.khoa));
      if (!m) { daLoai[l] = 'không có mục'; continue; }
      if (!(await t.locator('#sheetCms [data-chu-man]').count())) { await t.click(`.cms-bar button:has-text("${QT.qt('chuMan')}")`); await t.locator('[data-chu-man]').first().waitFor(); }
      await t.locator(`[data-chu-man="${m.khoa}"]`).click();
      await t.locator(`[data-bang-sua="${m.khoa}"]`).waitFor();
      daLoai[l] = (await t.locator(`[data-bang-sua="${m.khoa}"] ${sel.split(', ')[0]}`).count()) > 0 || (await t.locator(`[data-bang-sua="${m.khoa}"] ${sel.split(', ')[1] || 'xx'}`).count()) > 0;
      await anh(t, `390_bang_sua_${l}`);
      if (l === 'danhsach' && !(m.khoaCauTruc || []).length) {
        await t.locator(`[data-bang-sua="${m.khoa}"] .cs-undo:has-text("${QT.qt('themDong')}")`).click();
        await t.locator(`[data-bang-sua="${m.khoa}"] .cs-undo:has-text("${QT.qt('themDong')}")`).click();
        const o2 = t.locator(`[data-bang-sua="${m.khoa}"] .cs-dong input.cs-in`);
        await o2.nth(0).fill('TLB'); await o2.nth(1).fill('TLB');
        k(`F2/D3 danh sách ${m.khoa}: hai dòng trùng → Lưu mờ + "hai dòng giống hệt"`, (await t.locator(`[data-bang-sua="${m.khoa}"] .cs-next`).isDisabled()) && /giống hệt/.test(await chu(t, `[data-bang-sua="${m.khoa}"]`)));
      }
      await t.click(`[data-bang-sua="${m.khoa}"] .cs-h button`);
    }
    k('D3 sinh đủ 6 loại bảng sửa (chu, doan, nut, anh, danhsach, battat)', Object.values(daLoai).every((x) => x === true), JSON.stringify(daLoai));
    const dsCauTruc = DM.find((x) => x.loai === 'danhsach' && (x.khoaCauTruc || []).length && coRow.has(x.khoa));
    if (dsCauTruc) {
      await t.click(`.cms-bar button:has-text("${QT.qt('chuMan')}")`); await t.locator(`[data-chu-man="${dsCauTruc.khoa}"]`).click();
      await t.locator(`[data-bang-sua="${dsCauTruc.khoa}"]`).waitFor();
      k(`D3 danh sách có khoaCauTruc (${dsCauTruc.khoa}): trường cấu trúc chỉ đọc, không thêm / bớt dòng`, (await t.locator(`[data-bang-sua="${dsCauTruc.khoa}"] input[readonly]`).count()) > 0 && (await t.locator(`[data-bang-sua="${dsCauTruc.khoa}"] .cs-undo:has-text("${QT.qt('themDong')}")`).count()) === 0);
      await t.click(`[data-bang-sua="${dsCauTruc.khoa}"] .cs-h button`);
    }
    // D3 ảnh: cắt đúng tiLe, nén ≤ 500 KB, multipart trường "anh"
    const png = await t.screenshot({ fullPage: false });
    await moBut(t, 'today.bg');
    await t.locator('[data-bang-sua="today.bg"] input[type="file"]').setInputFiles({ name: 'chup.png', mimeType: 'image/png', buffer: png });
    k('D3 ảnh: POST /anh (multipart trường "anh") → url ảnh kho; ảnh ≤ 500 KB, WebP', await doi(t, async () => goiKho('POST', '/anh').length === 1 && K.anhTruong === 'anh' && K.anh.size === 1, 10000)
      && [...K.anh.values()][0].du_lieu.length <= 512000 && [...K.anh.values()][0].loai === 'webp');
    const tl = await t.evaluate(() => new Promise((ok) => { const i = document.querySelector('[data-bang-sua="today.bg"] .cs-img img'); const x = () => ok(i.naturalWidth / i.naturalHeight); if (i.complete && i.naturalWidth) x(); else i.onload = x; }));
    k('D3 ảnh cắt đúng tỉ lệ của mục (today.bg 2:1)', Math.abs(tl - 2) < 0.02, tl);
    k('D4 ảnh mới hiện ngay trên trang (đường ảnh kho ghép gốc kho)', await doi(t, async () => /\/api\/nd\/anh\/[0-9a-f]{64}$/.test(await t.locator('.today .t-img').getAttribute('src'))));
    await t.click('[data-bang-sua="today.bg"] .cs-next');
    await doi(t, async () => goiKho('PUT', '/nhap').some((g) => g.than.khoa === 'today.bg'));
    await t.locator('[data-bang-sua="today.bg"] .cs-hint:has-text("Có nháp chưa cập nhật")').waitFor();
    await t.click(`[data-bang-sua="today.bg"] .cs-undo:has-text("${QT.qt('boThayDoi')}")`);
    k('D3 "Bỏ thay đổi" → DELETE /nhap/today.bg', await doi(t, async () => goiKho('DELETE', '/nhap/today.bg').length === 1));
    await t.click('[data-bang-sua="today.bg"] .cs-h button');
    // D3 người khác vừa lưu
    K.nhap.set('home.mo', { khoa: 'home.mo', gia_tri: 'Món của người khác', nguoi: 'Nhân viên Lan', luc: '2026-10-30T20:59:00', ban_goc: 2 });
    if (await hienBut(t, 'home.mo')) {
      await but(t, 'home.mo').first().click();
      await t.locator('[data-bang-sua="home.mo"]').waitFor();
      k('D3 mở bảng đọc lại nháp: người khác vừa lưu → báo "Người khác vừa lưu chỗ này lúc …"', /Người khác vừa lưu chỗ này lúc 2026-10-30T20:59:00/.test(await chu(t, '[data-bang-sua="home.mo"]')));
      await t.click('[data-bang-sua="home.mo"] .cs-h button');
    } else k('D3 (Người khác vừa lưu) cần bút home.mo trên Trang chủ', false);
    K.nhap.delete('home.mo');
    // D6 Đi tới màn
    await t.click(`.cms-bar button:has-text("${QT.qt('diToi')}")`);
    const dsDi = await t.locator('#sheetCms .cs-go button').allTextContents();
    k('D6 "Đi tới màn" liệt kê màn khách (tên = tieuDe), có Món', dsDi.length >= 15 && dsDi.includes('Món') && dsDi.includes('Menu'), dsDi.join(','));
    await t.click('#sheetCms .cs-go button:text-is("Món")');
    k('D6 bấm "Món" → /mon/<món có thật đầu tiên>', await doi(t, async () => (await tren(t)) === '/mon/tra-luc-bao'));
    // D2 chạm chỗ khác App chạy như khách; 🔒 chỉ đường POS
    await t.goto(URL0 + '/menu'); await t.locator('.cms-bar').waitFor(); await t.locator('.prod-card').first().waitFor();
    await doi(t, async () => (await but(t, 'menu.mon').count()) > 0);
    await but(t, 'menu.mon').first().click();
    k('D2 chạm 🔒 tên / giá món → "🔒 Lấy từ POS — sửa ở POS › Sản phẩm"', await doi(t, async () => (await toast(t)) === '🔒 Lấy từ POS — sửa ở POS › Sản phẩm'));
    await t.locator('.prod-card').first().click();
    k('D2 đang sửa, chạm thẻ món (không phải bút) → vẫn mở món như khách', await doi(t, async () => /^\/mon\//.test(await tren(t))));
    // D7 nút đặt đơn bị khoá, báo giá vẫn chạy
    await t.goto(URL0 + '/thanhtoan'); await t.locator('.cms-bar').waitFor();
    const coNut = await doi(t, async () => /^(Thanh toán qua QR|Trừ ví) /.test(await t.locator('#checkout .nut-dat').first().innerText()) && (await t.locator('#checkout .nut-dat').first().getAttribute('aria-disabled')) !== 'true', 8000);
    k('D7 khi sửa: báo giá (POST /gio/bao-gia) vẫn gửi để xem màn Thanh toán đủ số', coNut && S.goi.some((g) => g.duong === '/gio/bao-gia'));
    if (coNut) await t.locator('#checkout .nut-dat').first().click();
    k('D7 bấm đặt đơn khi sửa → KHÔNG gửi POST /don, báo "Đang ở Chế độ sửa…"', await doi(t, async () => (await t.locator('body').innerText()).includes(QT.CHAN_KHI_SUA)) && S.guiDon === 0 && !S.goi.some((g) => g.duong === '/don' && g.pt === 'POST'));
    k('D7 đơn bị chặn KHÔNG kẹt bản ghi "chưa rõ" (kh_don_gui không có / không chờ)', !/"chua_ro"|khong_biet/.test(String(await t.evaluate(() => localStorage.getItem('kh_don_gui')))));
    await t.goto(URL0 + '/taikhoan'); await t.locator('[data-nd="tk.dangXuat"]').waitFor();
    await t.locator('[data-nd="tk.dangXuat"]').click();
    k('D7 "Đăng xuất" khoá khi sửa (token khách còn, báo chặn)', await doi(t, async () => (await toast(t)) === QT.CHAN_KHI_SUA) && (await t.evaluate(() => localStorage.getItem('kh_token'))) === 'tok-A');
    // D1 tải lại giữ Chế độ sửa; ✕ tắt
    await t.goto(URL0 + '/trangchu'); await t.reload();
    k('D1 tải lại trang → Chế độ sửa còn (còn vé)', await doi(t, async () => (await t.locator('.cms-bar').count()) === 1));
    // D8 "Tới chỗ này" + "Bỏ"
    await moBut(t, 'today.k');
    await t.locator('[data-bang-sua="today.k"] input.cs-in').fill('Món ngon');
    await t.click('[data-bang-sua="today.k"] .cs-next');
    await doi(t, async () => K.nhap.has('today.k'));
    await t.click('[data-bang-sua="today.k"] .cs-h button');
    await t.evaluate(() => { document.querySelector('.screens').scrollTop = 0; });
    await t.click(`.cms-bar button:has-text("${QT.qt('xemLai')}")`);
    await t.click(`[data-xem-lai="today.k"] button:has-text("${QT.qt('toiCho')}")`);
    k('D8 "Tới chỗ này" → đóng bảng, cuộn tới phần tử', await doi(t, async () => (await bang(t).count()) === 0 && await t.locator('[data-nd="today.k"]').first().isVisible()));
    await t.click(`.cms-bar button:has-text("${QT.qt('xemLai')}")`);
    await t.click(`[data-xem-lai="today.k"] button:has-text("${QT.qt('bo')}")`);
    k('D8 "Bỏ" → DELETE /nhap/today.k, dòng biến mất', await doi(t, async () => !K.nhap.has('today.k') && (await t.locator('[data-xem-lai="today.k"]').count()) === 0));
    await t.click(`#sheetCms .cs-h button`);
    await t.click('.cms-bar button.x');
    k('D1 ✕ tắt: không còn thanh, không còn bút, bỏ lớp nháp', await doi(t, async () => (await t.locator('.cms-bar').count()) === 0 && (await t.locator('.cms-lop').count()) === 0 && (await t.locator('.phone.cms-on').count()) === 0));
  });

  // ---- C2: 401 giữa lúc sửa → đăng nhập quản trị → quay lại đúng chỗ; nháp ở kho còn. 403 không thoát. ----
  await may('ve-het-han', { dn: false, ve: { ve: 've-da-thu-hoi', het_han: '', quyen: ['nd_xem', 'nd_sua', 'nd_cap_nhat'], nguoi: { ten_hien: 'Chủ quán Linh' } }, sua: true }, async ({ t }) => {
    K.nhap.set('today.k', { khoa: 'today.k', gia_tri: 'Nháp còn trên kho', nguoi: 'Chủ quán Linh', luc: '2026-10-30T20:40:00', ban_goc: 2 });
    await t.goto(URL0 + '/trangchu');
    k('C2 vé hết hạn (401 ở GET /nhap) → về màn đăng nhập quản trị với ?tiep=/trangchu', await doi(t, async () => (await tren(t)) === '/admin?tiep=%2Ftrangchu' && (await t.locator('#qt-dang-nhap').count()) === 1, 8000), await tren(t));
    await t.fill('input[name="ten"]', 'linh'); await t.fill('input[name="mat_khau"]', 'dung'); await t.click('#qt-dang-nhap button[type="submit"]');
    k('C2 đăng nhập lại → về đúng chỗ (Trang chủ) và Chế độ sửa bật; nháp trên kho vẫn còn', await doi(t, async () => (await tren(t)) === '/trangchu' && (await t.locator('.cms-bar').count()) === 1 && /1 thay đổi/.test(await chu(t, '.cms-bar .cb-t')), 8000));
    k('C2 nháp hiện trên trang khi sửa (lớp nháp)', await doi(t, async () => (await chu(t, '[data-nd="today.k"]')) === 'Nháp còn trên kho'));
    K.nhap.delete('today.k');
  });
  await may('thu-quyen', { dn: false }, async ({ t }) => {
    await t.goto(URL0 + '/admin/lichsu'); await t.locator('#qt-dang-nhap').waitFor();
    await t.fill('input[name="ten"]', 'sua'); await t.fill('input[name="mat_khau"]', 'dung'); await t.click('#qt-dang-nhap button[type="submit"]');
    k('C1 chưa vé vào /admin/lichsu → đăng nhập → ở lại /admin/lichsu', await doi(t, async () => (await tren(t)) === '/admin/lichsu' && (await t.locator('#qt-lich-su').count()) === 1));
    k('E3 không có quyền nd_xuat_nhap → không có nút Xuất / Nhập', (await t.locator('#xuat-nhap button').count()) === 0);
    await t.goto(URL0 + '/admin'); await t.locator('#qt-bang').waitFor();
    k('C3 thiếu nd_xuat_nhap → bảng quản trị ẩn nút Xuất / Nhập', (await t.locator('#qt-bang button').count()) === 4);
    await t.click(`#qt-bang button:has-text("${QT.qt('nutSua')}")`); await t.locator('.cms-bar').waitFor();
    k('D1 thiếu nd_cap_nhat → "Cập nhật toàn bộ" mờ', await t.locator('.cms-bar button.pri').isDisabled());
    K.tk.sua.quyen = ['nd_xem']; // chủ quán thu quyền "Sửa nội dung App" ở POS — có hiệu lực ngay
    await doi(t, async () => (await but(t, 'today.k').count()) > 0);
    await moBut(t, 'today.k');
    await t.locator('[data-bang-sua="today.k"] input.cs-in').fill('Hôm nay');
    await t.click('[data-bang-sua="today.k"] .cs-next');
    k('C2 / G8(5) bị thu quyền → Lưu bị từ chối ngay (403 hiện nguyên lời), KHÔNG thoát quản trị', await doi(t, async () => /KHONG_DU_QUYEN/.test(await toast(t))) && (await t.locator('.cms-bar').count()) === 1 && !!(await t.evaluate(() => sessionStorage.getItem('nd_ve'))));
    K.tk.sua.quyen = ['nd_xem', 'nd_sua'];
    await t.click('[data-bang-sua="today.k"] .cs-h button');
  });

  // ---- E: Lịch sử phiên bản, Xuất / Nhập ----
  await may('lich-su', { dn: false }, async ({ t }) => {
    await t.goto(URL0 + '/admin/lichsu'); await t.locator('#qt-dang-nhap').waitFor();
    await t.fill('input[name="ten"]', 'linh'); await t.fill('input[name="mat_khau"]', 'dung'); await t.click('#qt-dang-nhap button[type="submit"]');
    await t.locator('#qt-lich-su [data-ban]').first().waitFor();
    const n = await t.locator('#qt-lich-su [data-ban]').count();
    k('E1 danh sách mọi bản (mới trước): số, lúc, người, tóm tắt, "đang chạy", "từ bản X"', n === K.ban.length && /đang chạy/.test(await chu(t, `[data-ban="${K.dangChay}"]`)) && /Chủ quán Linh/.test(await chu(t, '#qt-lich-su')), n);
    await anh(t, '390_lich_su');
    await t.locator('[data-ban="1"] .cs-hi').click(); await t.locator('#qt-mot-ban').waitFor();
    k('E2 "Xem" bản 1: các mục đã sửa (tên tiếng Việt + giá trị)', /Banner Hôm nay: tiêu đề mặc định/.test(await chu(t, '#qt-mot-ban')) || /Món nổi bật/.test(await chu(t, '#qt-mot-ban')));
    await t.click(`#qt-mot-ban button:has-text("${QT.qt('lsSo')}")`);
    k('E2 "So với bản đang chạy": mục khác cũ ↔ mới', await doi(t, async () => (await t.locator('#qt-mot-ban [data-khac="today.t"]').count()) === 1 && /Chào mùa đông/.test(await chu(t, '#qt-mot-ban [data-khac="today.t"] del'))));
    const [tai] = await Promise.all([t.waitForEvent('download'), t.click(`#qt-mot-ban button:has-text("${QT.qt('lsTai')}")`)]);
    const noi = JSON.parse(fs.readFileSync(await tai.path(), 'utf8'));
    k('E2 "Tải về máy": tệp JSON của đúng bản đó', tai.suggestedFilename() === 'noi-dung-ban-1.json' && noi.so_ban === 1 && !!noi.gia_tri);
    K.chen409 = 1;
    await t.click(`#qt-mot-ban button:has-text("${QT.qt('lsQuayLai')}")`);
    k('E2 "Quay lại bản này" hỏi lại MỘT lần trước khi gửi', /Chắc chắn quay lại bản 1/.test(await chu(t, '#qt-mot-ban')) && goiKho('POST', '/quay-lai').length === 0);
    await t.click(`#qt-mot-ban button:text-is("${QT.qt('lsQuayLaiCo')}")`);
    k('E2 quay lại gặp 409 → tải lại, báo, KHÔNG tự gửi lại', await doi(t, async () => /Có bản mới hơn/.test(await toast(t))) && goiKho('POST', '/quay-lai').length === 1);
    await t.locator('[data-ban="1"] .cs-hi').click(); await t.locator('#qt-mot-ban').waitFor();
    await t.click(`#qt-mot-ban button:has-text("${QT.qt('lsQuayLai')}")`); await t.click(`#qt-mot-ban button:text-is("${QT.qt('lsQuayLaiCo')}")`);
    k('E2 quay lại → POST /quay-lai { so: 1, ban_goc: bản đang chạy } → bản MỚI "từ bản 1"', await doi(t, async () => goiKho('POST', '/quay-lai').length === 2 && /Đã quay lại nội dung bản 1/.test(await toast(t)))
      && goiKho('POST', '/quay-lai')[1].than.so === 1 && goiKho('POST', '/quay-lai')[1].than.ban_goc === K.dangChay - 1 && K.ban[K.ban.length - 1].tu_ban === 1);
    const [xuat] = await Promise.all([t.waitForEvent('download'), t.click(`#xuat-nhap button:has-text("${QT.qt('xnXuat')}")`)]);
    const tep = fs.readFileSync(await xuat.path());
    k('E3 "Xuất toàn bộ" → GET /xuat → tải tệp', goiKho('GET', '/xuat').length === 1 && JSON.parse(tep).dinh_dang === 1);
    await t.locator('#xuat-nhap input[type="file"]').setInputFiles({ name: 'xuat.json', mimeType: 'application/json', buffer: tep });
    k('E3 "Nhập toàn bộ" khi kho đã có dữ liệu → 409 KHO_DA_CO_DU_LIEU, hiện NGUYÊN lời', await doi(t, async () => (await toast(t)) === 'Lời kho giả: KHO_DA_CO_DU_LIEU'));
    const tepTo = path.join(require('os').tmpdir(), `kh-admin-1-to-${process.pid}.json`);
    fs.writeFileSync(tepTo, Buffer.alloc(MAY.gioi_han.nhap_toan_bo_toi_da_byte + 10, 32));
    await t.locator('#xuat-nhap input[type="file"]').setInputFiles(tepTo);
    fs.rmSync(tepTo, { force: true });
    k('E3 tệp > 50 MB chặn trước khi gửi', await doi(t, async () => /lớn quá 50 MB/.test(await toast(t))) && goiKho('POST', '/nhap-toan-bo').length === 1);
    K.tepXuat = tep;
  });
  const K2 = khoGiaND();
  await may('nhap-kho-trong', { dn: false, kho: K2 }, async ({ t }) => {
    await t.goto(URL0 + '/admin/lichsu'); await t.locator('#qt-dang-nhap').waitFor();
    await t.fill('input[name="ten"]', 'linh'); await t.fill('input[name="mat_khau"]', 'dung'); await t.click('#qt-dang-nhap button[type="submit"]');
    await t.locator('#xuat-nhap input[type="file"]').waitFor({ state: 'attached' });
    await t.locator('#xuat-nhap input[type="file"]').setInputFiles({ name: 'xuat.json', mimeType: 'application/json', buffer: K.tepXuat });
    k('E3 "Nhập toàn bộ" vào kho TRỐNG → POST /nhap-toan-bo, báo số đã nhập', await doi(t, async () => /Đã nhập: \d+ bản/.test(await toast(t))) && K2.ban.length === K.ban.length && K2.dangChay === K.dangChay);
  });

  // ---- B, D4: khách (không vé) ----
  K.nhap.set('today.k', { khoa: 'today.k', gia_tri: 'NHÁP BÍ MẬT', nguoi: 'Chủ quán Linh', luc: '2026-10-30T20:50:00', ban_goc: K.dangChay });
  await may('khach-moi', { dn: false }, async ({ t }) => {
    await t.goto(URL0 + '/trangchu'); await t.locator('.today b').waitFor();
    const chuMoi = K.ban[K.ban.length - 1].gia_tri['today.t'];
    k('B2 / G3 khách mới mở App → thấy chữ của bản đang chạy', await doi(t, async () => (await chu(t, '.today b')) === (chuMoi || 'Hôm nay bạn muốn uống gì?')), `${await chu(t, '.today b')} ≠ ${chuMoi}`);
    k('D4 khách KHÔNG BAO GIỜ thấy nháp; không thanh sửa, không bút', !(await t.locator('body').innerText()).includes('NHÁP BÍ MẬT') && (await t.locator('.cms-bar, .cms-lop').count()) === 0);
    const goiKh = K.goi.filter((g) => g.duong === '/ban-dang-chay').slice(-1)[0];
    k('B1 khách chỉ gọi GET /ban-dang-chay, không gắn vé / token', goiKh && goiKh.auth === '');
    await t.reload(); await t.locator('.today b').waitFor();
    k('B2 lần mở sau: chữ bản máy có NGAY ở lần vẽ đầu (trước khi hỏi kho)', (await t.evaluate(() => document.querySelector('.today b').textContent)) === (chuMoi || 'Hôm nay bạn muốn uống gì?'));
    k('B2 lần mở sau hỏi kèm ?co=<số bản trên máy>', K.goi.filter((g) => g.duong === '/ban-dang-chay').slice(-1)[0].truyVan.get('co') === String(K.dangChay));
  });
  K.nhap.delete('today.k');
  const banXss = { so_ban: 99, gia_tri: { 'today.t': '<img src=x onerror="window.__xss=1">' } };
  await may('xss', { dn: false }, async ({ t, ctx }) => {
    await ctx.addInitScript((b) => localStorage.setItem('kh_nd_ban', JSON.stringify(b)), banXss);
    await ctx.route(`${URL0}/api/nd/ban-dang-chay*`, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, khong_doi: true, so_ban: 99 }) }));
    await t.goto(URL0 + '/trangchu'); await t.locator('.today b').waitFor(); await t.waitForTimeout(300);
    k('B4 chữ chứa <img onerror> hiện như CHỮ, không thành thẻ, không chạy', (await chu(t, '.today b')) === banXss.gia_tri['today.t'] && (await t.locator('.today b img').count()) === 0 && !(await t.evaluate(() => window.__xss)));
  });
  await may('kiemkhop-dong', { dn: false }, async ({ t }) => {
    await t.goto(URL0 + '/kiemkhop');
    k('C1 /kiemkhop công khai đã đóng → Trang chủ (không có trang Kiểm khớp)', await doi(t, async () => (await tren(t)) === '/trangchu') && (await t.locator('#kiemkhop').count()) === 0);
    await t.goto(URL0 + '/admin/kiemkhop');
    k('C1 /admin/kiemkhop chưa vé → màn đăng nhập quản trị', await doi(t, async () => (await t.locator('#qt-dang-nhap').count()) === 1));
    await t.fill('input[name="ten"]', 'nv'); await t.fill('input[name="mat_khau"]', 'dung'); await t.click('#qt-dang-nhap button[type="submit"]');
    k('C3 có vé → /admin/kiemkhop là trang Kiểm khớp POS', await doi(t, async () => (await t.locator('#kiemkhop').count()) === 1 && (await tren(t)) === '/admin/kiemkhop'));
  });
  k('A2 kho giả: App KHÔNG gọi cửa nào ngoài hợp đồng /api/nd v1', K.ngoaiHopDong.length === 0 && K2.ngoaiHopDong.length === 0, K.ngoaiHopDong.concat(K2.ngoaiHopDong).join(','));
  await trinh.close();
}
