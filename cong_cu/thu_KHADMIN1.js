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
    k('A2 mọi mã lỗi App xử lý riêng (code === …) có trong ma_loi', ma.length >= 2 && MAY && ma.every((c) => c in MAY.ma_loi), ma.filter((c) => !MAY || !(c in MAY.ma_loi)).join(',') || `chỉ thấy ${ma.length}`);
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
    const tho = [...fs.readdirSync(path.join(GOC, 'src'), { recursive: true })].filter((f) => /\.(jsx?)$/.test(f) && /dangerouslySetInnerHTML|innerHTML\s*=/.test(doc(path.join('src', f))) && !/App\.jsx$/.test(f));
    k('B4 không tệp nào (ngoài sprite SVG cố định của App.jsx) dùng dangerouslySetInnerHTML / innerHTML', tho.length === 0, tho.join(','));
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
    const tenSapToi = () => KH.upList(homNay, KH.keHoachTrong(), 'chi').map((x) => x.t);
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
async function trinhDuyet(pw) {
  k('Phần 2 chưa viết', false);
}
