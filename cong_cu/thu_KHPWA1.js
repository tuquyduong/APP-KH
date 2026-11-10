#!/usr/bin/env node
// THỬ KH-PWA-1 — service worker tự viết (public/sw.js), đăng ký (src/dangKySW.js), tự lên bản mới lặng lẽ ở màn an toàn, public/_headers.
// Phần 1: hàm thuần (sw.js nạp bằng vm với `self` giả — thử thẳng hàm thật) + đọc nguồn. Phần 2: vite build + máy chủ tĩnh + Chromium.
// Chạy: node cong_cu/thu_KHPWA1.js → dòng cuối "n đạt · m hỏng". KHONG_TRINH_DUYET=1 hoặc không có Playwright → phần 2 BỎ QUA (không tính hỏng).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const http = require('http');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

const GOC = path.join(__dirname, '..');
let dat = 0, hong = 0;
const k = (ten, dung, them = '') => {
  if (dung) { dat++; console.log(`  ✓ ${ten}`); } else { hong++; console.log(`  ✗ ${ten}${them ? '  — ' + them : ''}`); }
};
const docTho = (f) => { try { return fs.readFileSync(path.join(GOC, f), 'utf8'); } catch { return ''; } };
// Khớp nguồn trên code ĐÃ BỎ chú thích: chữ nằm trong chú thích không làm bài xanh.
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const doc = (f) => boChuThich(docTho(f));
const nap = (f) => import(pathToFileURL(path.join(GOC, f)).href);
const thu = async (ten, f) => { try { await f(); } catch (e) { k(`${ten} dừng giữa chừng`, false, String(e && e.message).split('\n')[0]); } };
const cho = (ms) => new Promise((r) => setTimeout(r, ms));
const PHUT = 60000;
const MIEN = 'https://tuquyduong.com';

/** Nạp public/sw.js trong vm với `self` giả → các hàm khai báo ở gốc tệp (chienLuoc, tenBan, tepCuaBan) + danh sách sự kiện đã gắn. */
function napSW() {
  const nghe = {};
  const self = { location: { origin: MIEN }, addEventListener: (ten, f) => { nghe[ten] = f; }, skipWaiting: () => {}, clients: { claim: () => {} } };
  const khoGia = { put: async () => {}, match: async () => undefined, keys: async () => [], delete: async () => true };
  const caches = { match: async () => undefined, open: async () => khoGia, keys: async () => [], delete: async () => true };
  // fetch giả không bao giờ trả lời: ca sự kiện chỉ đếm respondWith, không để lời hứa bị từ chối lơ lửng.
  const ctx = vm.createContext({ self, caches, fetch: () => new Promise(() => {}), Response, URL, setTimeout, clearTimeout, Promise });
  vm.runInContext(fs.readFileSync(path.join(GOC, 'public/sw.js'), 'utf8'), ctx, { filename: 'sw.js' });
  return { ctx, nghe };
}

/** Bản sw.js chạy với kho + mạng giả (Map theo đường dẫn) — thử HÀNH VI luuVo / trang không cần trình duyệt. */
function napSWKho({ mang, putLoi = false, henGio = setTimeout }) {
  const m = new Map();
  const khoa = (x) => (typeof x === 'string' ? x : new URL(x.url).pathname);
  const kho = {
    m, put: async (x, r) => { if (putLoi) throw new Error('QuotaExceededError'); m.set(khoa(x), r); },
    match: async (x) => m.get(khoa(x)), keys: async () => [...m.keys()].map((p) => ({ url: MIEN + p })), delete: async (x) => m.delete(khoa(x)),
  };
  const caches = { open: async () => kho, match: (x) => kho.match(x), keys: async () => ['tqd-v2'], delete: async () => true };
  const nghe = {};
  const self = { location: { origin: MIEN }, addEventListener: (ten, f) => { nghe[ten] = f; }, skipWaiting: () => {}, clients: { claim: () => {} } };
  const ctx = vm.createContext({ self, caches, fetch: (x) => mang(khoa(x)), URL, setTimeout: henGio, clearTimeout, Promise });
  vm.runInContext(fs.readFileSync(path.join(GOC, 'public/sw.js'), 'utf8'), ctx, { filename: 'sw.js' });
  return { ctx, kho, nghe, caches };
}
const resGia = (than, loai = 'text/html', status = 200) => ({
  ok: status < 400, status, type: 'basic', redirected: false, headers: { get: (h) => (/content-type/i.test(h) ? loai : null) },
  clone: () => resGia(than, loai, status), text: async () => than,
});

const HTML_BAN = (js, css) => `<!DOCTYPE html><html><head><link rel="manifest" href="/manifest.webmanifest" /><link rel="preload" href="/fonts/a.woff2" as="font" />
<script type="module" crossorigin src="${js}"></script><link rel="stylesheet" crossorigin href="${css}"><link rel="stylesheet" href="https://fonts.googleapis.com/x"></head><body><div id="root"></div></body></html>`;

(async () => {
  console.log('Phần 1 — hàm thuần + đọc nguồn');

  await thu('A2', async () => {
    const { ctx, nghe } = napSW();
    const L = ctx.chienLuoc;
    k('A2 sw.js có hàm chienLuoc(url, cach)', typeof L === 'function');
    const G = (p, them = {}) => L(p.startsWith('http') ? p : MIEN + p, { method: 'GET', mode: 'cors', ...them });
    k('A2 trang (navigate) → mạng trước', G('/menu', { mode: 'navigate' }) === 'trang' && G('/', { mode: 'navigate' }) === 'trang' && G('/mon/tra-luc-bao?x=1', { mode: 'navigate' }) === 'trang');
    k('A2 /assets/* → lưu trước', G('/assets/index-B8g27Zcw.js') === 'luuTruoc' && G('/assets/index-CKEsnr98.css') === 'luuTruoc');
    k('A2 /fonts, /anh, /manifest.webmanifest → trả bản lưu + lấy mới ở nền',
      ['/fonts/eb-garamond-600-latin.woff2', '/anh/logo.webp', '/manifest.webmanifest'].every((p) => G(p) === 'luuRoiCapNhat'));
    k('KH-PWA-2 A1 /am_thanh/* → null (đi thẳng mạng, Safari iPhone phát nhạc bằng yêu cầu Range)', G('/am_thanh/man_dau.mp3') === null && G('/AM_THANH/a.mp3') === null);
    const khongDung = [
      ['/api/kh/menu', G('/api/kh/menu')], ['/API/kh/toi', G('/API/kh/toi')], ['/api', G('/api')],
      ['navigate /api/kh/x', G('/api/kh/x', { mode: 'navigate' })],
      ['khác miền (POS)', G('https://pos-tuquyduong.io.vn/api/kh/menu')], ['ảnh món POS', G('https://pos-tuquyduong.io.vn/anh/mon.webp')],
      ['Google Fonts', G('https://fonts.googleapis.com/css2?family=Inter')], ['POST cùng miền', G('/anh/x.webp', { method: 'POST' })],
      ['POST trang', G('/menu', { method: 'POST', mode: 'navigate' })],
      ['/kiemkhop', G('/kiemkhop', { mode: 'navigate' })], ['/KiemKhop/', G('/KiemKhop/', { mode: 'navigate' })],
      ['/sw.js', G('/sw.js')], ['đường lạ /x.txt', G('/x.txt')],
    ].filter(([, v]) => v !== null);
    k('A2 KHÔNG đụng: /api…, khác miền, không GET, /kiemkhop, /sw.js, đường lạ → null', khongDung.length === 0, khongDung.map(([t, v]) => `${t}=${v}`).join(', '));
    // Sự kiện fetch: nhánh null không gọi respondWith (yêu cầu đi thẳng mạng như hôm nay).
    let goiRespond = 0;
    const suKien = (url, them = {}) => ({ request: { url, method: 'GET', mode: 'cors', ...them }, respondWith: () => { goiRespond++; }, waitUntil: () => {} });
    if (typeof nghe.fetch === 'function') {
      for (const u of ['/api/kh/menu', '/kiemkhop', '/sw.js', '/am_thanh/man_dau.mp3']) nghe.fetch(suKien(MIEN + u, u === '/kiemkhop' ? { mode: 'navigate' } : {}));
      nghe.fetch(suKien('https://pos-tuquyduong.io.vn/api/kh/toi'));
      nghe.fetch(suKien(MIEN + '/anh/x.webp', { method: 'POST' }));
    }
    k('A2 sự kiện fetch: /api, khác miền, POST, /kiemkhop, /sw.js → KHÔNG respondWith', typeof nghe.fetch === 'function' && goiRespond === 0, String(goiRespond));
    if (typeof nghe.fetch === 'function') nghe.fetch(suKien(MIEN + '/assets/index-a.js'));
    k('A2 sự kiện fetch: /assets → có respondWith (đối chứng)', goiRespond === 1, String(goiRespond));
  });

  await thu('A3/A4', async () => {
    const { ctx } = napSW();
    const sw = doc('public/sw.js');
    k('A3 kho tên kèm số bản tqd-v2 (KH-PWA-2 A4)', /'tqd-v2'/.test(sw));
    k('A3 activate xoá kho cũ (caches.delete)', /addEventListener\('activate'/.test(sw) && /caches\.delete\(/.test(sw));
    const ds = typeof ctx.tepCuaBan === 'function' ? [...ctx.tepCuaBan(HTML_BAN('/assets/index-A1.js', '/assets/index-C1.css'))].sort() : null;
    k('A3 tepCuaBan(html) → các tệp cùng miền vỏ trỏ tới (assets, fonts, manifest), không Google',
      JSON.stringify(ds) === JSON.stringify(['/assets/index-A1.js', '/assets/index-C1.css', '/fonts/a.woff2', '/manifest.webmanifest']), JSON.stringify(ds));
    k('A4 skipWaiting() + clients.claim()', /self\.skipWaiting\(\)/.test(sw) && /self\.clients\.claim\(\)/.test(sw));
  });

  await thu('A2 hành vi (kho + mạng giả)', async () => {
    const CU = HTML_BAN('/assets/index-CU.js', '/assets/index-CU.css'), MOI = HTML_BAN('/assets/index-MOI.js', '/assets/index-MOI.css');
    const khoCu = (kho) => { kho.m.set('/', resGia(CU)); kho.m.set('/assets/index-CU.js', resGia('cu', 'text/javascript')); kho.m.set('/assets/index-CU.css', resGia('cu', 'text/css')); };
    const voTrongKho = async (kho) => (kho.m.get('/') ? kho.m.get('/').text() : '');
    // (a) bản mới về nhưng tệp /assets của nó chưa tải được (mạng rớt) → vỏ cũ giữ nguyên: mất mạng mở lại vẫn chạy bản cũ, không trắng màn.
    const a = napSWKho({ mang: async () => { throw new Error('mất mạng'); } });
    khoCu(a.kho);
    await a.ctx.luuVo(resGia(MOI)).catch(() => {});
    k('A2 đổi bản mà chưa tải được /assets của vỏ mới → KHÔNG lưu đè vỏ (mất mạng mở lại không trắng màn)', (await voTrongKho(a.kho)) === CU);
    // (b) tải được → tệp /assets mới vào kho TRƯỚC, rồi vỏ mới; bản cũ vẫn giữ (2 bản).
    const b = napSWKho({ mang: async (p) => (p.startsWith('/assets/') ? resGia('x', p.endsWith('.css') ? 'text/css' : 'text/javascript') : resGia('x', 'font/woff2')) });
    khoCu(b.kho);
    await b.ctx.luuVo(resGia(MOI)).catch(() => {});
    const coDu = ['/assets/index-MOI.js', '/assets/index-MOI.css', '/assets/index-CU.js'].every((p) => b.kho.m.has(p));
    k('A2 đổi bản → tải đủ /assets của vỏ mới rồi mới lưu vỏ mới (giữ cả bản trước)', coDu && (await voTrongKho(b.kho)) === MOI, JSON.stringify([...b.kho.m.keys()]));
    // (c) trang: mạng trả vỏ mới nhưng lưu kho lỗi (kho đầy) → khách vẫn nhận trang MỚI từ mạng, không phải vỏ cũ.
    const c = napSWKho({ mang: async () => resGia(MOI), putLoi: true });
    khoCu(c.kho);
    let traVe = null;
    const doi = [];
    c.nghe.fetch({ request: { url: MIEN + '/menu', method: 'GET', mode: 'navigate' }, respondWith: (p) => { traVe = p; }, waitUntil: (p) => doi.push(p) });
    const r = traVe ? await traVe : null;
    await Promise.all(doi);
    k('A2 trang: lưu kho lỗi (kho đầy) → vẫn trả trang mới từ mạng', !!r && (await r.text()) === MOI);
    // (d) trang: mạng treo → hẹn đúng 3000 ms rồi trả vỏ đã lưu (đồng hồ giả chạy ngay).
    const hen = [];
    const d = napSWKho({ mang: () => new Promise(() => {}), henGio: (f, ms) => { hen.push(ms); f(); } });
    khoCu(d.kho);
    let traD = null;
    d.nghe.fetch({ request: { url: MIEN + '/trangchu', method: 'GET', mode: 'navigate' }, respondWith: (p) => { traD = p; }, waitUntil: () => {} });
    const rd = traD ? await Promise.race([traD, cho(1000).then(() => null)]) : null;
    k('A2 trang: mạng treo → sau 3000 ms trả vỏ đã lưu', hen.includes(3000) && !!rd && (await rd.text()) === CU, JSON.stringify(hen));
    // (f) bản mới trỏ một phông / ảnh hỏng (404, mạng rớt) nhưng /assets tải được → vỏ mới VẪN lưu (phông lỗi không chặn lên bản).
    const f = napSWKho({ mang: async (p) => { if (!p.startsWith('/assets/')) throw new Error('404'); return resGia('x', p.endsWith('.css') ? 'text/css' : 'text/javascript'); } });
    khoCu(f.kho);
    await f.ctx.luuVo(resGia(MOI)).catch(() => {});
    k('A2 đổi bản: phông / manifest lỗi nhưng đủ /assets → vẫn lưu vỏ mới', (await voTrongKho(f.kho)) === MOI);
    // (g) activate: xoá kho tqd-* cũ, giữ kho hiện tại và kho không phải của App.
    const g = napSWKho({ mang: async () => { throw new Error('x'); } });
    const xoa = [];
    g.caches.keys = async () => ['tqd-v0', 'tqd-v1', 'tqd-v2', 'khac'];
    g.caches.delete = async (t) => { xoa.push(t); return true; };
    const doiG = [];
    g.nghe.activate({ waitUntil: (p) => doiG.push(p) });
    await Promise.all(doiG);
    k('A3 activate xoá kho cũ tqd-v0, giữ tqd-v2 và kho khác; KH-PWA-2 A1/A4 tqd-v1 (có nhạc đã lưu) cũng bị xoá', JSON.stringify(xoa) === '["tqd-v0","tqd-v1"]', JSON.stringify(xoa));
    // (e) chỉ lưu đúng loại: Cloudflare trả index.html 200 cho tệp băm đã xoá → /assets KHÔNG lưu HTML; vỏ chỉ lưu khi là text/html.
    const e1 = napSWKho({ mang: async () => resGia('<!DOCTYPE html>', 'text/html') });
    await e1.ctx.luuTep('/assets/index-XOA.js', 'default');
    const e2 = napSWKho({ mang: async () => resGia('{"error":"x"}', 'application/json') });
    await e2.ctx.layVo('no-store');
    k('A2 chỉ lưu khi đúng loại: /assets KHÔNG lưu text/html, vỏ KHÔNG lưu khi không phải text/html', !e1.kho.m.has('/assets/index-XOA.js') && !e2.kho.m.has('/'),
      JSON.stringify([...e1.kho.m.keys(), ...e2.kho.m.keys()]));
  });

  await thu('KH-PWA-2 trang lỗi + trang lạ', async () => {
    const CU = HTML_BAN('/assets/index-CU.js', '/assets/index-CU.css');
    const coVo = (kho) => { kho.m.set('/', resGia(CU)); kho.m.set('/assets/index-CU.js', resGia('cu', 'text/javascript')); };
    const diTrang = async (sw, url) => {
      let tv = null;
      const doi = [];
      sw.nghe.fetch({ request: { url: MIEN + url, method: 'GET', mode: 'navigate' }, respondWith: (p) => { tv = p; }, waitUntil: (p) => doi.push(p) });
      const res = tv ? await tv : null;
      await Promise.all(doi);
      return res;
    };
    const mangTra = (than, loai, status) => napSWKho({ mang: async () => resGia(than, loai, status) });
    for (const [ten, than, loai, st] of [['5xx (503)', 'Lỗi', 'text/html', 503], ['500', 'Lỗi', 'text/html', 500], ['599', 'Lỗi', 'text/html', 599], ['404 của đường dẫn trang', 'Không có', 'text/html', 404], ['200 không phải HTML', '{"a":1}', 'application/json', 200]]) {
      const sw = mangTra(than, loai, st);
      coVo(sw.kho);
      const res = await diTrang(sw, '/menu');
      k(`KH-PWA-2 A2 trang: mạng trả ${ten} → dùng vỏ đã lưu, không lưu phản hồi lỗi`, !!res && (await res.text()) === CU && (await sw.kho.m.get('/').text()) === CU);
    }
    const khongVo = mangTra('Lỗi', 'text/html', 503);
    const rk = await diTrang(khongVo, '/menu');
    k('KH-PWA-2 A2 trang: 5xx khi chưa có vỏ → trả nguyên phản hồi mạng, không lưu', !!rk && rk.status === 503 && !khongVo.kho.m.has('/'));
    const tot = mangTra(CU, 'text/html', 200);
    coVo(tot.kho);
    const rt = await diTrang(tot, '/menu');
    k('KH-PWA-2 A2 đối chứng: trang 200 HTML → trả trang mạng (không chặn oan)', !!rt && rt.status === 200 && (await rt.text()) === CU);
    const cd = napSWKho({ mang: async () => ({ ...resGia(''), type: 'opaqueredirect', status: 0, ok: false, headers: { get: () => null } }) });
    coVo(cd.kho);
    const rcd = await diTrang(cd, '/index.html');
    k('KH-PWA-2 A2 đối chứng: chuyển hướng (opaqueredirect) → trả nguyên cho trình duyệt tự đi, không thay bằng vỏ', !!rcd && rcd.type === 'opaqueredirect');
    // A3: HTML 200 nhưng không có tệp JS chính (trang đăng nhập wifi…) → không lưu, vỏ cũ nguyên.
    const LA = '<!DOCTYPE html><html><body>Đăng nhập wifi</body></html>';
    const la = mangTra(LA, 'text/html', 200);
    coVo(la.kho);
    await diTrang(la, '/menu');
    await la.ctx.luuVo(resGia(LA)).catch(() => {});
    await la.ctx.layVo('reload').catch(() => {});
    k('KH-PWA-2 A3 HTML không có /assets/index-*.js → KHÔNG lưu, giữ vỏ cũ', (await la.kho.m.get('/').text()) === CU);
    const lanDau = mangTra(LA, 'text/html', 200);
    await lanDau.ctx.layVo('reload').catch(() => {});
    k('KH-PWA-2 A3 trang lạ khi chưa có vỏ → cũng không lưu', !lanDau.kho.m.has('/'));
    const dung = napSWKho({ mang: async (p) => (p === '/' ? resGia(HTML_BAN('/assets/index-NEW.js', '/assets/index-NEW.css')) : resGia('x', /css$/.test(p) ? 'text/css' : 'text/javascript')) });
    await dung.ctx.layVo('reload').catch(() => {});
    k('KH-PWA-2 A3 đối chứng: HTML đúng của App → vẫn lưu vỏ', dung.kho.m.has('/'));
  });

  await thu('B2 tenBan', async () => {
    const { ctx } = napSW();
    const T = ctx.tenBan;
    k('B2 tenBan(html) → /assets/index-*.js', typeof T === 'function' && T(HTML_BAN('/assets/index-B8g27Zcw.js', '/assets/index-C.css')) === '/assets/index-B8g27Zcw.js');
    k('B2 tenBan: HTML hỏng / không có script / rỗng → ""', T('<html><bo') === '' && T('<html><body>Lỗi 502</body></html>') === '' && T('') === '' && T(null) === '');
  });

  await thu('B dangKySW', async () => {
    const D = await nap('src/dangKySW.js');
    k('B2 doiBan: khác tên → true; cùng tên → false; tên mới rỗng (HTML hỏng / lỗi mạng) → false',
      D.doiBan('/assets/index-MOI.js', '/assets/index-CU.js') === true && D.doiBan('/assets/index-CU.js', '/assets/index-CU.js') === false
      && D.doiBan('', '/assets/index-CU.js') === false && D.doiBan(undefined, '/assets/index-CU.js') === false && D.doiBan('/assets/index-MOI.js', '') === false);
    const T0 = 1e12;
    k('B2 PHUT_KIEM = 30', D.PHUT_KIEM === 30);
    k('B2 denLucKiem: ẩn 29:59 → không; ẩn 30:00 → có', !D.denLucKiem(T0, 0, T0 + 30 * PHUT - 1000) && D.denLucKiem(T0, 0, T0 + 30 * PHUT));
    k('B2 denLucKiem: lần kiểm trước < 30 phút → không (tối đa một lần mỗi 30 phút)', !D.denLucKiem(T0, T0 + 10 * PHUT, T0 + 35 * PHUT) && D.denLucKiem(T0, T0 + 5 * PHUT, T0 + 35 * PHUT));
    k('B2 denLucKiem: chưa từng ẩn (lucAn 0) → không', !D.denLucKiem(0, 0, T0));
    const C = D.coTheTaiLai;
    const khong = ['/giohang', '/GioHang/', '/thanhtoan', '/don/TQD123', '/dangnhap', '/dangnhap?tiep=%2Fuudai', '/taikhoan/thongtin'].filter((p) => C(p, false) !== false);
    k('B3 KHÔNG an toàn: /giohang, /thanhtoan, /don/…, /dangnhap…, /taikhoan/thongtin', khong.length === 0, khong.join(', '));
    const co = ['/trangchu', '/', '/menu', '/menu/tra', '/mon/tra-luc-bao', '/uudai', '/taikhoan', '/taikhoan/donhang', '/kehoach', '/tracnghiem/ketqua', '/mathanhvien'].filter((p) => C(p, false) !== true);
    k('B3 an toàn: Trang chủ, Menu, Món, Ưu đãi, Tài khoản, Đơn hàng (danh sách), Kế hoạch…', co.length === 0, co.join(', '));
    const tn = ['/tracnghiem/lam', '/tracnghiem/lam/', '/tracnghiem/lam/3'].filter((p) => C(p, false) !== false);
    k('B3 KHÔNG an toàn: /tracnghiem/lam và đường dẫn con (bài dở chỉ ở state — chủ quán 08.11)', tn.length === 0 && C('/tracnghiem', false) === true && C('/tracnghiem/lamthu', false) === true, tn.join(', '));
    k('B3 đang mở hộp thoại → KHÔNG an toàn dù ở /menu', C('/menu', true) === false && C('/trangchu', true) === false);
    const nguon = doc('src/dangKySW.js');
    k('B3 hộp thoại = [role="dialog"], [aria-modal="true"] hoặc bảng nổi .sheet.show (Thêm việc của Kế hoạch không có role)', /\[role="dialog"\]/.test(nguon) && /\[aria-modal="true"\]/.test(nguon) && /\.sheet\.show/.test(nguon));
    k('B2 chỉ tải lại khi trang đang hiện + nhớ bản đã tải lại (không tải lại liên tục)', /visibilityState !== 'visible' \|\| !coTheTaiLai\(/.test(nguon) && /sessionStorage/.test(nguon));
    k('A1 chỉ đăng ký khi import.meta.env.PROD và có serviceWorker; lỗi đăng ký → bỏ qua (.catch)',
      /import\.meta\.env\?\.PROD/.test(nguon) && /'serviceWorker' in navigator/.test(nguon) && /register\('\/sw\.js'[^)]*\)\.catch\(/.test(nguon));
    let nem = '';
    try { D.dangKySW(); } catch (e) { nem = e.message; }
    k('A1 không có import.meta.env (bài thử khác dựng main.jsx bằng esbuild, node) → dangKySW() không ném, không đăng ký', nem === '', nem);
    k('B2 lắng nghe visibilitychange', /visibilitychange/.test(nguon));
    k('B4 tải lại lặng lẽ, giữ đường dẫn: location.reload(), không alert / confirm / chữ báo', /location\.reload\(\)/.test(nguon) && !/\b(alert|confirm|prompt)\(/.test(nguon) && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(nguon));
    k('K1 dangKySW không tự gọi mạng (nhờ service worker hỏi index.html)', !/\bfetch\s*\(|XMLHttpRequest/.test(nguon));
  });

  await thu('A1 main.jsx', async () => {
    const m = docTho('src/main.jsx').split('\n');
    const dong = m.filter((d) => /dangKySW/.test(d));
    k('A1 main.jsx thêm đúng 2 dòng: một import + một lời gọi', dong.length === 2 && /^import \{ dangKySW \} from '\.\/dangKySW\.js'$/.test(dong[0]) && /^dangKySW\(\)$/.test(dong[1]), JSON.stringify(dong));
    k('A1 main.jsx giữ nguyên dòng dựng App / KiemKhop', m.includes("createRoot(document.getElementById('root')).render(laKiemKhop ? <KiemKhop /> : <App />)"));
  });

  await thu('A5', async () => {
    const luat = {};
    let p = null;
    for (const d of docTho('public/_headers').split('\n')) {
      if (!d.trim() || d.trim().startsWith('#')) continue;
      if (!/^\s/.test(d)) { p = d.trim(); luat[p] = luat[p] || []; } else if (p) luat[p].push(d.trim());
    }
    const mong = { '/sw.js': ['Cache-Control: no-cache'], '/index.html': ['Cache-Control: no-cache'], '/': ['Cache-Control: no-cache'], '/assets/*': ['Cache-Control: public, max-age=31536000, immutable'] };
    k('A5 public/_headers đúng 3 luật (sw.js · index.html + / · assets), không thừa', JSON.stringify(luat) === JSON.stringify(mong), JSON.stringify(luat));
  });

  const hd = docTho('viec/KH-PWA-1/huong_dan_kiem_tay.md').trim().split('\n');
  k('C3 huong_dan_kiem_tay.md ≤ 10 dòng, đủ 3 bước (mở 2 lần · máy bay · bản mới)', hd.length > 1 && hd.length <= 10 && /2 lần|hai lần/i.test(hd.join(' ')) && /máy bay/i.test(hd.join(' ')) && /bản mới/i.test(hd.join(' ')), String(hd.length));
  k('C1 bài đọc KHONG_TRINH_DUYET', /process\.env\.KHONG_TRINH_DUYET === '1'/.test(docTho('cong_cu/thu_KHPWA1.js')));

  console.log('Phần 2 — vite build + máy chủ tĩnh + Chromium');
  let pw = null;
  if (process.env.KHONG_TRINH_DUYET === '1') console.log('  BỎ QUA: KHONG_TRINH_DUYET=1 — các ca trong trình duyệt không chạy ở đây');
  else {
    try { pw = require('playwright'); } catch { /* không có */ }
    if (!pw) console.log('  BỎ QUA: không có Playwright ở máy này — các ca trong trình duyệt CHƯA chạy');
    else await thu('Chromium', () => trinhDuyet(pw));
  }

  console.log(`  (chạy hết ${Math.round(process.uptime())} giây)`);
  console.log(`\n${dat} đạt · ${hong} hỏng`);
  process.exit(hong ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`\n${dat} đạt · ${hong + 1} hỏng`); process.exit(1); });

async function trinhDuyet(pw) {
  const RA = fs.mkdtempSync(path.join(os.tmpdir(), 'thu-khpwa1-'));
  const dung = spawnSync(process.execPath, [path.join(GOC, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', RA, '--emptyOutDir', '--logLevel', 'error'], { cwd: GOC, encoding: 'utf8', timeout: 60000 });
  k('C1 vite build được', dung.status === 0, (dung.stderr || '').slice(0, 200));
  if (dung.status !== 0) return;
  const HTML0 = fs.readFileSync(path.join(RA, 'index.html'), 'utf8');
  const JS0 = /src="(\/assets\/index-[^"]+\.js)"/.exec(HTML0)[1];
  // Máy chủ tĩnh nhỏ: đường không phải tệp → index.html (như Cloudflare Pages). `S.ban` = bản đang đưa lên ('' = bản dựng, 'moi1', 'moi2' = đổi tên tệp băm giả).
  const S = { tat: false, ban: '', hoi: [], tre: 0 };
  const htmlBan = () => (S.ban ? HTML0.replace(JS0, JS0.replace('.js', `-${S.ban}.js`)) : HTML0);
  const MIME = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };
  const may = http.createServer((req, res) => {
    if (S.tat) { req.socket.destroy(); return; }
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    S.hoi.push(p);
    const bm = /^(\/assets\/index-[^/]+?)-(moi\d)\.js$/.exec(p);
    if (bm) { res.writeHead(200, { 'content-type': MIME['.js'] }); res.end(`window.__BAN=${JSON.stringify(bm[2])};\n` + fs.readFileSync(path.join(RA, bm[1] + '.js'))); return; }
    if (p.startsWith('/api/')) { res.writeHead(503, { 'content-type': 'application/json' }); res.end('{"error":"Thử: không có POS","code":"THU"}'); return; }
    const f = path.join(RA, p);
    if (p !== '/' && f.startsWith(RA) && fs.existsSync(f) && fs.statSync(f).isFile() && p !== '/index.html') {
      res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'cache-control': p.startsWith('/assets/') ? 'max-age=31536000, immutable' : 'no-cache' });
      res.end(fs.readFileSync(f)); return;
    }
    if (/\.[a-z0-9]+$/i.test(p) && p !== '/index.html') { res.writeHead(404); res.end(); return; }
    const ban = htmlBan();
    setTimeout(() => { res.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-cache' }); res.end(ban); }, S.tre);
  });
  await new Promise((r) => may.listen(0, '127.0.0.1', r));
  const URL0 = `http://localhost:${may.address().port}`;
  const trinh = await pw.chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await trinh.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
    await ctx.addInitScript(() => {
      try { localStorage.setItem('kh_da_xem_man_dau', '1'); } catch { /* không kho */ }
      const goc = Date.now;
      Date.now = () => goc.call(Date) + (window.__lech || 0);
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (window.__an ? 'hidden' : 'visible') });
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => !!window.__an });
    });
    const trang = await ctx.newPage();
    trang.setDefaultTimeout(10000);
    await trang.goto(`${URL0}/trangchu`);
    const coSW = await trang.evaluate(async () => {
      await Promise.race([navigator.serviceWorker.ready, new Promise((r) => setTimeout(r, 5000))]);
      for (let i = 0; i < 50 && !navigator.serviceWorker.controller; i++) await new Promise((r) => setTimeout(r, 100));
      return !!navigator.serviceWorker.controller;
    }).catch(() => false);
    k('C1 mở App (bản dựng) → có service worker điều khiển trang', coSW);
    const daLuu = await trang.evaluate(async (js) => {
      for (let i = 0; i < 50; i++) { if (await caches.match('/') && await caches.match(js)) return true; await new Promise((r) => setTimeout(r, 100)); }
      return false;
    }, JS0).catch(() => false);
    k('A2 vỏ "/" và tệp JS băm đã lưu sẵn trong kho sau lần mở đầu', daLuu);
    const tenKho = await trang.evaluate(() => caches.keys()).catch(() => []);
    k('A3 đúng một kho tqd-v2', JSON.stringify(tenKho) === '["tqd-v2"]', JSON.stringify(tenKho));

    // C1 — mất mạng (giả lập + máy chủ tắt thật) → tải lại vẫn thấy Trang chủ.
    S.tat = true; await ctx.setOffline(true);
    const t0 = Date.now();
    await trang.reload({ timeout: 15000 }).catch(() => {});
    const coHome = await trang.waitForSelector('#home', { timeout: 8000 }).then(() => true).catch(() => false);
    k('C1 tắt mạng → tải lại vẫn thấy Trang chủ (#home)', coHome, trang.url());
    k('A2 mạng mất → vỏ trả ngay, không treo (< 6 giây)', Date.now() - t0 < 6000, `${Date.now() - t0} ms`);

    // A2 — mạng chậm (vỏ trả sau 6 giây) → quá 3 giây trả vỏ đã lưu.
    S.tat = false; await ctx.setOffline(false); S.tre = 6000;
    const t1 = Date.now();
    await trang.reload({ timeout: 15000 }).catch(() => {});
    const coHome2 = await trang.waitForSelector('#home', { timeout: 8000 }).then(() => true).catch(() => false);
    k('A2 mạng chậm > 3 giây → trả vỏ đã lưu sau ~3 giây (Trang chủ hiện, < 5,5 giây)', coHome2 && Date.now() - t1 < 5500, `${Date.now() - t1} ms`);
    S.tre = 0; await cho(3500);

    // B1 — bật mạng, đưa "bản mới" (tên tệp băm khác) → mở lại → chạy bản mới.
    S.tat = false; await ctx.setOffline(false); S.ban = 'moi1';
    await trang.goto(`${URL0}/trangchu`);
    await trang.waitForSelector('#home', { timeout: 8000 }).catch(() => {});
    k('B1 có bản mới → mở lại App chạy NGAY bản mới (trang: mạng trước)', await trang.evaluate(() => window.__BAN) === 'moi1');

    // B2 / B4 — ở /menu, ẩn rồi hiện sau 31 phút (đồng hồ giả), có bản moi2 → tự tải lại, vẫn /menu, chạy moi2.
    S.ban = 'moi2';
    await trang.evaluate(() => { history.pushState({}, '', '/menu'); dispatchEvent(new PopStateEvent('popstate')); });
    const anHien = (phut) => trang.evaluate((p) => {
      window.__an = true; document.dispatchEvent(new Event('visibilitychange'));
      window.__lech = (window.__lech || 0) + p * 60000;
      window.__an = false; document.dispatchEvent(new Event('visibilitychange'));
    }, phut);
    await trang.evaluate(() => { window.__danhDau = 1; });
    await anHien(10); await cho(2500);
    k('B2 ẩn 10 phút rồi hiện → KHÔNG kiểm / không tải lại', await trang.evaluate(() => window.__danhDau === 1 && window.__BAN === 'moi1'));
    S.tat = true; await anHien(31); await cho(2500); S.tat = false;
    k('B2 ẩn ≥ 30 phút nhưng mất mạng khi hỏi → bỏ qua, không tải lại', await trang.evaluate(() => window.__danhDau === 1 && window.__BAN === 'moi1'));
    await trang.evaluate(() => { const d = document.createElement('div'); d.id = 'hopGia'; d.setAttribute('role', 'dialog'); document.body.appendChild(d); });
    await anHien(31); await cho(3000);
    k('B3 lần kiểm sau (có mạng) thấy bản mới nhưng đang mở hộp thoại → KHÔNG tải lại', await trang.evaluate(() => window.__danhDau === 1 && window.__BAN === 'moi1'));
    const daNap = trang.waitForEvent('load', { timeout: 8000 }).then(() => true).catch(() => false);
    await trang.evaluate(() => document.getElementById('hopGia').remove());
    const nap1 = await daNap;
    await trang.waitForSelector('.screen', { timeout: 8000 }).catch(() => {});
    k('B2/B3 đóng hộp thoại ở /menu → tự tải lại, chạy bản mới', nap1 && await trang.evaluate(() => window.__BAN) === 'moi2');
    k('B4 tải lại xong vẫn ở NGUYÊN /menu', new URL(trang.url()).pathname === '/menu', trang.url());
    const anh = S.hoi.length;

    // B3 — ở /thanhtoan (không an toàn) → KHÔNG tải lại; về /menu → tải lại.
    S.ban = 'moi3';
    await trang.evaluate(() => { window.__lech = 0; history.pushState({}, '', '/thanhtoan'); dispatchEvent(new PopStateEvent('popstate')); window.__danhDau = 1; });
    await trang.evaluate(() => { window.__lech = 40 * 60000; });
    await anHien(31); await cho(4500);
    k('B3 ở /thanhtoan (hoặc /dangnhap khi chưa đăng nhập) có bản mới → KHÔNG tải lại', await trang.evaluate(() => window.__danhDau === 1 && window.__BAN === 'moi2'), trang.url());
    k('B2 đã hỏi index.html (bỏ qua bộ nhớ đệm) khi hiện lại', S.hoi.slice(anh).includes('/'), S.hoi.slice(anh).join(','));
    const daNap2 = trang.waitForEvent('load', { timeout: 8000 }).then(() => true).catch(() => false);
    await trang.evaluate(() => { history.pushState({}, '', '/menu'); dispatchEvent(new PopStateEvent('popstate')); });
    k('B3 rời màn không an toàn về /menu → tự tải lại lên bản mới', await daNap2 && await trang.evaluate(() => window.__BAN) === 'moi3' && new URL(trang.url()).pathname === '/menu');

    // A3 — sau nhiều bản, kho chỉ giữ tệp JS của 2 bản gần nhất.
    await cho(500);
    const jsTrongKho = await trang.evaluate(async () => (await (await caches.open('tqd-v2')).keys()).map((r) => new URL(r.url).pathname).filter((p) => /\/assets\/index-.*\.js$/.test(p)).sort()).catch(() => []);
    k('A3 kho chỉ còn JS của 2 bản gần nhất (moi2, moi3)', jsTrongKho.length === 2 && jsTrongKho.every((p) => /-moi[23]\.js$/.test(p)), JSON.stringify(jsTrongKho));
    k('A2 KHÔNG lưu yêu cầu /api trong kho', await trang.evaluate(async () => (await (await caches.open('tqd-v2')).keys()).every((r) => !new URL(r.url).pathname.startsWith('/api'))).catch(() => false));

    // A2 / C3 — bản mới moi4 về qua lần kiểm nền khi khách ở /thanhtoan (chưa tải lại), rồi mất mạng → mở lại vẫn dựng App (không trắng màn).
    S.ban = 'moi4';
    await trang.evaluate(() => { history.pushState({}, '', '/thanhtoan'); dispatchEvent(new PopStateEvent('popstate')); });
    await anHien(31); await cho(2500);
    S.tat = true; await ctx.setOffline(true);
    await trang.reload({ timeout: 15000 }).catch(() => {});
    const coKhung = await trang.waitForSelector('.screen', { timeout: 8000 }).then(() => true).catch(() => false);
    k('A2 bản mới về ở nền rồi mất mạng → mở lại vẫn thấy khung App (không trắng màn)', coKhung, await trang.evaluate(() => `${window.__BAN} · #root ${document.getElementById('root')?.children.length}`).catch(() => ''));
    S.tat = false; await ctx.setOffline(false);
    await ctx.close();
  } finally {
    await trinh.close();
    may.close();
    fs.rmSync(RA, { recursive: true, force: true });
  }
}
