// Bảng đường dẫn của app — MỘT chỗ khai báo (hàm thuần, không đụng DOM; bài thử cong_cu/thu_KHLINK1.js nạp thẳng).
// Đường dẫn theo TRANG, không theo thiết bị. Màn mới phải thêm một dòng vào BANG.
//   mau = mẫu đường dẫn (":ten" = tham số) · tab = tab sáng trên thanh tab (null = giữ tab trước) · canDN = khách phải đăng nhập
//   cha = nơi nút quay lại về khi trang được mở thẳng (không có lịch sử) · giuCho = chỉ giữ chỗ cho việc sau (KH-UI-5b)
import { boDau } from './menuLoc.js';

const HAU_TO_TIEU_DE = ' · Tứ Quý Đường';
const TRANG_CHU = '/trangchu';

const BANG = [
  { trang: 'trangchu', mau: '/trangchu', tab: 'trangchu', tieuDe: 'Trang chủ' },
  { trang: 'menu', mau: '/menu', tab: 'menu', tieuDe: 'Menu' },
  { trang: 'menu', mau: '/menu/:nhom', tab: 'menu', tieuDe: 'Menu' },
  { trang: 'mon', mau: '/mon/:slug', tab: 'menu', tieuDe: 'Món', cha: '/menu' },
  { trang: 'giohang', mau: '/giohang', tab: 'giohang', tieuDe: 'Giỏ hàng' },
  { trang: 'thanhtoan', mau: '/thanhtoan', tab: 'giohang', canDN: true, tieuDe: 'Thanh toán', cha: '/giohang' },
  { trang: 'theodoi', mau: '/don/:ma', tab: 'giohang', canDN: true, tieuDe: 'Theo dõi đơn', cha: '/taikhoan/donhang' },
  { trang: 'uudai', mau: '/uudai', tab: 'uudai', canDN: true, tieuDe: 'Ưu đãi' },
  { trang: 'taikhoan', mau: '/taikhoan', tab: 'taikhoan', canDN: true, tieuDe: 'Tài khoản' },
  { trang: 'thongtin', mau: '/taikhoan/thongtin', tab: 'taikhoan', canDN: true, tieuDe: 'Thông tin cá nhân', cha: '/taikhoan' },
  { trang: 'donhang', mau: '/taikhoan/donhang', tab: 'taikhoan', canDN: true, tieuDe: 'Đơn hàng', cha: '/taikhoan' },
  { trang: 'don', mau: '/taikhoan/donhang/:ma', tab: 'taikhoan', canDN: true, tieuDe: 'Chi tiết đơn', cha: '/taikhoan/donhang' },
  { trang: 'hotro', mau: '/taikhoan/hotro', tab: 'taikhoan', tieuDe: 'Hỗ trợ', cha: '/taikhoan' },
  { trang: 'qr', mau: '/mathanhvien', tab: null, canDN: true, tieuDe: 'Mã thành viên' },
  { trang: 'dangnhap', mau: '/dangnhap', tab: null, tieuDe: 'Đăng nhập' },
  { trang: 'tracnghiem', mau: '/tracnghiem', tab: null, canDN: true, tieuDe: 'Trắc nghiệm' },
  { trang: 'tracnghiemlam', mau: '/tracnghiem/lam', tab: null, canDN: true, tieuDe: 'Trắc nghiệm', cha: '/tracnghiem' },
  { trang: 'tracnghiemketqua', mau: '/tracnghiem/ketqua', tab: null, canDN: true, tieuDe: 'Kết quả thể trạng' },
  { trang: 'kiemkhop', mau: '/kiemkhop', tab: null, tieuDe: 'Kiểm khớp POS', giuCho: true }, // trang thật do main.jsx dựng riêng; trong vỏ App chỉ giữ chỗ (không để trắng màn khi đi tiep=/kiemkhop)
  { trang: 'kehoach', mau: '/kehoach', tab: null, tieuDe: 'Kế hoạch và nhắc việc', giuCho: true },
];
const GIU_CHO = BANG.filter((e) => e.giuCho).map((e) => e.trang);
const tenThamSo = (e) => [...e.mau.matchAll(/:(\w+)/g)].map((m) => m[1]);

/** Bỏ dấu → chữ thường → ký tự khác chữ / số thành "-", gộp, bỏ "-" hai đầu: "Trà Đông Y" → "tra-dong-y". */
export const slug = (chuoi) => boDau(chuoi).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const giaiMa = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

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
  return tiep ? `${p}?tiep=${encodeURIComponent(tiep)}` : p;
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
      return !!tham[m.slice(1)];
    });
    if (!khop) continue;
    if (e.trang === 'dangnhap') { const t = tiepHopLe(truyVan.get('tiep')); if (t) tham.tiep = t; }
    return ra(e, tham);
  }
  if (GIU_CHO.includes(dau)) return { ...ra(BANG.find((e) => e.trang === dau), {}), chuan: '/' + doan.map(encodeURIComponent).join('/') };
  return { trang: 'khongthay', tham: {}, chuan: s, tab: null, canDN: false, cha: TRANG_CHU, giuCho: false };
}

export const trangCanDangNhap = (trang) => BANG.some((e) => e.trang === trang && e.canDN);

/** Tiêu đề tab trình duyệt: "Menu · Tứ Quý Đường", "<Tên món> · Tứ Quý Đường". */
export function tieuDeTrang(trang, tenMon) {
  if (trang === 'mon') return (tenMon || 'Món') + HAU_TO_TIEU_DE;
  const e = BANG.find((x) => x.trang === trang);
  return (e ? e.tieuDe : 'Không tìm thấy trang') + HAU_TO_TIEU_DE;
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
