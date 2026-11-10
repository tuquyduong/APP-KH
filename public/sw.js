// Service worker App KH (KH-PWA-1) — tự viết, không thư viện. Tệp này chép nguyên vào dist/ (Cloudflare: /sw.js không đệm — public/_headers).
// Ba luật: trang = mạng trước (chờ 3 giây, rồi vỏ đã lưu) · /assets (tên có mã băm, không bao giờ đổi nội dung) = lưu trước ·
// phông / ảnh / manifest = trả bản lưu, lấy mới ở nền. KHÔNG đụng /api, khác miền, không GET, /kiemkhop, /sw.js, /am_thanh (nhạc: Safari iPhone
// phát bằng yêu cầu Range — đi thẳng mạng, KH-PWA-2). Trang mà mạng trả 5xx / 404 / không phải HTML → mở vỏ đã lưu; HTML không có tệp JS chính thì không lưu.
// SAU NÀY: nếu App chia code tải dần (React.lazy / import động) thì tepCuaBan phải biết các tệp tải dần đó, kẻo mất mạng là thiếu tệp.
// Bài thử cong_cu/thu_KHPWA1.js nạp tệp này bằng vm với `self` giả và thử thẳng các hàm dưới.
const KHO = 'tqd-v2';
const VO = '/';
const CHO_MANG = 3000;
const TINH = /^\/(fonts|anh)\/|^\/manifest\.webmanifest$/;

/** Luật cho một yêu cầu: 'trang' | 'luuTruoc' | 'luuRoiCapNhat' | null (không đụng — đi thẳng mạng). */
function chienLuoc(url, cach) {
  const u = new URL(url);
  if (cach.method !== 'GET' || u.origin !== self.location.origin) return null;
  const p = u.pathname.toLowerCase().replace(/\/+$/, '');
  if (/^\/api(\/|$)/.test(p) || p === '/kiemkhop' || p === '/sw.js') return null;
  if (cach.mode === 'navigate') return 'trang';
  if (p.startsWith('/assets/')) return 'luuTruoc';
  return TINH.test(p) ? 'luuRoiCapNhat' : null;
}

/** Tên tệp JS chính của bản trong một index.html ('' khi HTML hỏng / không có). */
function tenBan(html) {
  const m = /<script[^>]*\ssrc="(\/assets\/index-[^"]+\.js)"/.exec(String(html || ''));
  return m ? m[1] : '';
}

/** Các tệp cùng miền mà vỏ trỏ tới (assets, phông, ảnh, âm thanh, manifest). */
function tepCuaBan(html) {
  const ds = new Set();
  for (const m of String(html || '').matchAll(/(?:src|href)="(\/[^"/][^"]*)"/g)) if (/^\/assets\//.test(m[1]) || TINH.test(m[1])) ds.add(m[1]);
  return ds;
}

const laHtml = (res) => /text\/html/.test(res.headers.get('content-type') || '');
const dung = (res) => res && res.ok && res.type === 'basic' && !res.redirected;

/** Lưu đè vỏ mới; ĐỔI bản thì tải đủ tệp /assets của vỏ mới TRƯỚC (thiếu → ném, giữ vỏ cũ: mất mạng mở lại không trắng màn),
 *  rồi xoá tệp /assets không thuộc vỏ cũ lẫn vỏ mới (giữ 2 bản gần nhất). Trả html. */
async function luuVo(res) {
  const html = await res.clone().text();
  if (!tenBan(html)) return ''; // trang lạ (wifi quán, lỗi nhà mạng…): không lưu, giữ vỏ cũ
  const kho = await caches.open(KHO);
  const cu = await kho.match(VO);
  const htmlCu = cu ? await cu.text() : '';
  const doi = tenBan(htmlCu) !== tenBan(html);
  if (doi) {
    await Promise.all([...tepCuaBan(html)].map(async (p) => {
      if (await kho.match(p)) return;
      const r = await luuTep(p, 'reload').catch(() => null);
      if (p.startsWith('/assets/') && !(r && dung(r) && !laHtml(r))) throw new Error('thiếu ' + p);
    }));
  }
  await kho.put(VO, res);
  if (!doi) return html; // cùng bản (lưu đè lần hai) → không dọn, kẻo mất bản trước
  const giu = new Set([...tepCuaBan(html), ...tepCuaBan(htmlCu)]);
  for (const r of await kho.keys()) {
    const p = new URL(r.url).pathname;
    if (p.startsWith('/assets/') && !giu.has(p)) await kho.delete(r);
  }
  return html;
}

/** Hỏi vỏ mới từ mạng (bỏ bộ nhớ đệm); đúng HTML thì lưu đè. Trả html hoặc ''. */
async function layVo(cach) {
  const res = await fetch(VO, { cache: cach });
  return dung(res) && laHtml(res) ? luuVo(res) : '';
}

async function luuTep(p, cach) {
  const res = await fetch(p, { cache: cach });
  if (dung(res) && !laHtml(res)) await (await caches.open(KHO)).put(p, res.clone());
  return res;
}

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(layVo('reload').catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ds) => Promise.all(ds.filter((t) => t.startsWith('tqd-') && t !== KHO).map((t) => caches.delete(t)))).then(() => self.clients.claim()));
});

// Phản hồi trang không dùng được: 5xx, 404, không phải HTML (chuyển hướng giữ nguyên cho trình duyệt tự đi).
const trangHong = (res) => res.type !== 'opaqueredirect' && (res.status >= 500 || res.status === 404 || !laHtml(res));

function trang(e) {
  // Trả phản hồi mạng ngay; lưu vỏ ở nền — lưu lỗi (kho đầy…) không làm khách mất trang mới.
  const mang = fetch(e.request);
  e.waitUntil(mang.then((res) => (dung(res) && laHtml(res) ? luuVo(res.clone()) : 0)).catch(() => {}));
  const het = new Promise((r) => setTimeout(r, CHO_MANG));
  const voLuu = () => caches.match(VO);
  const chon = (res) => (trangHong(res) ? voLuu().then((vo) => vo || res) : res);
  return Promise.race([mang, het.then(voLuu)]).then((res) => res || mang).then(chon).catch(() => voLuu().then((res) => res || mang));
}

self.addEventListener('fetch', (e) => {
  const luat = chienLuoc(e.request.url, e.request);
  if (!luat) return;
  const p = new URL(e.request.url).pathname;
  if (luat === 'trang') e.respondWith(trang(e));
  else if (luat === 'luuTruoc') e.respondWith(caches.match(p).then((res) => res || luuTep(p, 'default')));
  else {
    const moi = luuTep(p, 'no-cache');
    e.waitUntil(moi.catch(() => {}));
    e.respondWith(caches.match(p).then((res) => res || moi));
  }
});

// Trang hỏi "có bản mới không?" (src/dangKySW.js — trang không tự gọi mạng, bộ kiểm K1): hỏi vỏ không đệm, lưu đè, trả tên tệp JS của bản.
self.addEventListener('message', (e) => {
  if (!e.data || e.data.loai !== 'kiemBan' || !e.ports[0]) return;
  e.waitUntil(layVo('no-store').then(tenBan, () => '').then((ten) => e.ports[0].postMessage(ten)));
});
