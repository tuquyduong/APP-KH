// Bảng đường dẫn của app — MỘT chỗ khai báo (hàm thuần, không đụng DOM; bài thử cong_cu/thu_KHLINK1.js nạp thẳng).
// Đường dẫn theo TRANG, không theo thiết bị. Màn mới phải thêm một dòng vào BANG.
//   mau = mẫu đường dẫn (":ten" = tham số) · tab = tab sáng trên thanh tab (null = giữ tab trước) · canDN = khách phải đăng nhập
//   cha = nơi nút quay lại về khi trang được mở thẳng (không có lịch sử) · giuCho = chỉ giữ chỗ cho việc sau · cho = các giá trị hợp lệ của tham số
//   tv = tham số TRUY VẤN của trang { tên: [giá trị hợp lệ] | null (mã ngắn bất kỳ) } — giữ trong `chuan` (đăng nhập xong quay về đúng); tham số lạ bỏ
import { boDau } from './menuLoc.js';
import { nd } from './noiDung/nd.js';

const TRANG_CHU = '/trangchu';
import { MA_DIP } from './noiDung/vanKhan.js';

/** Tiện ích của Kế hoạch (KH-UI-5b, 5e, 5f) — đường dẫn lạ dưới /kehoach về /kehoach. */
const TIEN_ICH = ['theomua', 'ngayle', 'saptoi', 'ngaycannho', 'vankhan', 'xeco', 'uongthuoc', 'chuky'];

const BANG = [
  { trang: 'trangchu', mau: '/trangchu', tab: 'trangchu', tieuDe: 'tieuDe.trangchu' },
  { trang: 'menu', mau: '/menu', tab: 'menu', tieuDe: 'tieuDe.menu' },
  { trang: 'menu', mau: '/menu/:nhom', tab: 'menu', tieuDe: 'tieuDe.menu' },
  { trang: 'mon', mau: '/mon/:slug', tab: 'menu', tieuDe: 'tieuDe.mon', cha: '/menu' },
  { trang: 'giohang', mau: '/giohang', tab: 'giohang', tieuDe: 'tieuDe.giohang' },
  { trang: 'thanhtoan', mau: '/thanhtoan', tab: 'giohang', canDN: true, tieuDe: 'tieuDe.thanhtoan', cha: '/giohang', tv: { chi: ['the'] } },
  { trang: 'theodoi', mau: '/don/:ma', tab: 'giohang', canDN: true, tieuDe: 'tieuDe.theodoi', cha: '/taikhoan/donhang' },
  { trang: 'uudai', mau: '/uudai', tab: 'uudai', tieuDe: 'tieuDe.uudai' },
  { trang: 'hang', mau: '/uudai/hang', tab: 'uudai', tieuDe: 'tieuDe.hang', cha: '/uudai', tv: { h: null } },
  { trang: 'taikhoan', mau: '/taikhoan', tab: 'taikhoan', canDN: true, tieuDe: 'tieuDe.taikhoan' },
  { trang: 'thongtin', mau: '/taikhoan/thongtin', tab: 'taikhoan', canDN: true, tieuDe: 'tieuDe.thongtin', cha: '/taikhoan' },
  { trang: 'donhang', mau: '/taikhoan/donhang', tab: 'taikhoan', canDN: true, tieuDe: 'tieuDe.donhang', cha: '/taikhoan' },
  { trang: 'don', mau: '/taikhoan/donhang/:ma', tab: 'taikhoan', canDN: true, tieuDe: 'tieuDe.don', cha: '/taikhoan/donhang' },
  { trang: 'hotro', mau: '/taikhoan/hotro', tab: 'taikhoan', tieuDe: 'tieuDe.hotro', cha: '/taikhoan' },
  { trang: 'qr', mau: '/mathanhvien', tab: null, canDN: true, tieuDe: 'tieuDe.qr' },
  { trang: 'dangnhap', mau: '/dangnhap', tab: null, tieuDe: 'tieuDe.dangnhap' },
  { trang: 'tracnghiem', mau: '/tracnghiem', tab: null, canDN: true, tieuDe: 'tieuDe.tracnghiem' },
  { trang: 'tracnghiemlam', mau: '/tracnghiem/lam', tab: null, canDN: true, tieuDe: 'tieuDe.tracnghiem', cha: '/tracnghiem' },
  { trang: 'tracnghiemketqua', mau: '/tracnghiem/ketqua', tab: null, canDN: true, tieuDe: 'tieuDe.tracnghiemketqua' },
  { trang: 'kiemkhop', mau: '/kiemkhop', tab: null, tieuDe: 'tieuDe.kiemkhop', giuCho: true }, // trang thật do main.jsx dựng riêng; trong vỏ App chỉ giữ chỗ (không để trắng màn khi đi tiep=/kiemkhop)
  { trang: 'kehoach', mau: '/kehoach', tab: 'trangchu', canDN: true, tieuDe: 'tieuDe.kehoach' },
  { trang: 'tienich', mau: '/kehoach/:tienich', tab: 'trangchu', canDN: true, tieuDe: 'tieuDe.kehoach', cha: '/kehoach', cho: TIEN_ICH },
  { trang: 'tienich', mau: '/kehoach/:tienich/:dip', tab: 'trangchu', canDN: true, tieuDe: 'tieuDe.vankhan', cha: '/kehoach/vankhan', cho: { tienich: ['vankhan'], dip: MA_DIP } },
];
const GIU_CHO = BANG.filter((e) => e.giuCho).map((e) => e.trang);
const tenThamSo = (e) => [...e.mau.matchAll(/:(\w+)/g)].map((m) => m[1]);

/** Bỏ dấu → chữ thường → ký tự khác chữ / số thành "-", gộp, bỏ "-" hai đầu: "Trà Đông Y" → "tra-dong-y". */
export const slug = (chuoi) => boDau(chuoi).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const giaiMa = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
const MA_TV = /^[\w-]{1,40}$/;
/** Tham số truy vấn hợp lệ của dòng `e` lấy từ `lay(tên)` → { tên: giá trị }. */
const docTv = (e, lay) => Object.fromEntries(Object.entries(e.tv || {}).map(([t]) => [t, String(lay(t) ?? '')]).filter(([t, v]) => MA_TV.test(v) && (!e.tv[t] || e.tv[t].includes(v))));

/** `tiep` (trang quay về sau đăng nhập) chỉ nhận đường dẫn nội bộ của app → trả đường dẫn chuẩn; lạ / ra ngoài / chính trang đăng nhập → ''. */
export function tiepHopLe(tiep) {
  if (typeof tiep !== 'string' || !/^\/(?![/\\])/.test(tiep)) return '';
  const r = docDuongDan(tiep);
  return r.trang === 'khongthay' || r.trang === 'dangnhap' ? '' : r.chuan;
}

/** (trang, tham số) → đường dẫn. Trang không có trong bảng → Trang chủ. */
export function taoDuongDan(trang, tham = {}) {
  const e = BANG.filter((x) => x.trang === trang).sort((a, b) => tenThamSo(b).length - tenThamSo(a).length).find((x) => tenThamSo(x).every((t) => tham[t]));
  if (!e) return TRANG_CHU;
  const p = e.mau.replace(/:(\w+)/g, (_, t) => encodeURIComponent(tham[t]));
  const tiep = trang === 'dangnhap' ? tiepHopLe(tham.tiep) : '';
  if (tiep) return `${p}?tiep=${encodeURIComponent(tiep)}`;
  const tv = new URLSearchParams(docTv(e, (t) => tham[t])).toString();
  return tv ? `${p}?${tv}` : p;
}

function ra(e, tham) {
  return { trang: e.trang, tham, chuan: taoDuongDan(e.trang, tham), tab: e.tab || null, canDN: !!e.canDN, cha: e.cha || TRANG_CHU, giuCho: !!e.giuCho };
}

/**
 * Địa chỉ (đường dẫn + ?truy vấn) → { trang, tham, chuan, tab, canDN, cha, giuCho }. `chuan` = dạng chuẩn để thay vào thanh địa chỉ
 * ("/" → "/trangchu", "/Menu/" → "/menu", "/admin" → "/trangchu"); trang lạ → trang 'khongthay', chuan = nguyên địa chỉ.
 */
export function docDuongDan(diaChi) {
  const s = String(diaChi || '').split('#')[0];
  const i = s.indexOf('?');
  const doan = (i < 0 ? s : s.slice(0, i)).split('/').filter(Boolean).map(giaiMa);
  const truyVan = new URLSearchParams(i < 0 ? '' : s.slice(i + 1));
  const dau = (doan[0] || '').toLowerCase();
  if (!doan.length || dau === 'admin') return ra(BANG[0], {});
  for (const e of BANG) {
    const mau = e.mau.split('/').filter(Boolean);
    if (mau.length !== doan.length) continue;
    const tham = {};
    const khop = mau.every((m, j) => {
      if (m[0] !== ':') return m === doan[j].toLowerCase();
      tham[m.slice(1)] = m === ':ma' ? doan[j] : slug(doan[j]);
      return !!tham[m.slice(1)] && (!e.cho || (Array.isArray(e.cho) ? e.cho : e.cho[m.slice(1)] || []).includes(tham[m.slice(1)]));
    });
    if (!khop) continue;
    if (e.trang === 'dangnhap') { const t = tiepHopLe(truyVan.get('tiep')); if (t) tham.tiep = t; }
    Object.assign(tham, docTv(e, (t) => truyVan.get(t)));
    return ra(e, tham);
  }
  if (dau === 'kehoach') return ra(BANG.find((e) => e.trang === 'kehoach'), {}); // /kehoach/<tiện ích lạ> → màn Kế hoạch
  if (GIU_CHO.includes(dau)) return { ...ra(BANG.find((e) => e.trang === dau), {}), chuan: '/' + doan.map(encodeURIComponent).join('/') };
  return { trang: 'khongthay', tham: {}, chuan: s, tab: null, canDN: false, cha: TRANG_CHU, giuCho: false };
}

export const trangCanDangNhap = (trang) => BANG.some((e) => e.trang === trang && e.canDN);

/** Tiêu đề tab trình duyệt: "Menu · Tứ Quý Đường", "<Tên món> · Tứ Quý Đường". `tieuDe` trong BANG là khoá nội dung (src/noiDung/nd/khungChung.js). */
export function tieuDeTrang(trang, tenMon) {
  const e = BANG.find((x) => x.trang === trang);
  const man = trang === 'mon' ? tenMon || nd('tieuDe.mon') : nd(e ? e.tieuDe : 'tieuDe.khongthay');
  return nd('tieuDe.mau', { man });
}

const goc = (m) => slug(m.ten) || slug(m.ma);

/** Slug trong đường dẫn của một món: tên bỏ dấu; trùng tên với món khác thì thêm "-<mã>". */
export function slugMon(mon, ds) {
  const g = goc(mon);
  return (ds || []).some((m) => m.ma !== mon.ma && goc(m) === g) ? `${g}-${slug(mon.ma)}` : g;
}

/** Món có slug này trong menu; không có (đã ngừng bán / chưa có menu) → null. */
export function timMonTheoSlug(ds, s) {
  const can = slug(s);
  return (ds || []).find((m) => slugMon(m, ds) === can) || null;
}
