// Giá theo hạng — App KHÔNG tự tính: chỉ TRA bảng `gia_hang[]` POS gửi kèm từng món (máy chủ tính cùng hàm với quầy).
// Hạng khách (`hangToi`) = { id, ten } lấy từ /toi; `dsHang` = /hang (POS đã xếp theo thu_bac tăng dần — App không sắp lại).
import { nd } from './noiDung/nd.js';

/** Giá khách phải trả theo hạng: dòng `hang_id` = hạng khách; không có dòng (không hạng / bảng rỗng) → giá gốc. */
export function giaChoKhach(mon, hangToi) {
  const dong = hangToi && Array.isArray(mon.gia_hang) ? mon.gia_hang.find((d) => d.hang_id === hangToi.id) : null;
  return dong && typeof dong.gia === 'number' && Number.isFinite(dong.gia) ? dong.gia : mon.gia;
}

/**
 * Bậc thang "giá các hạng" của demo: [{ ten, gia, laToi }] — Thường (giá gốc) rồi từng hạng POS có giá cho món này.
 * Hạng POS không trả giá thì không hiện; không còn hạng nào ngoài Thường (chưa đăng nhập / bảng rỗng) → null (ẩn).
 */
export function bacThang(dsHang, mon, hangToi) {
  const bang = Array.isArray(mon.gia_hang) ? mon.gia_hang : [];
  const co = (id) => bang.find((d) => d.hang_id === id && typeof d.gia === 'number' && Number.isFinite(d.gia));
  const cot = (Array.isArray(dsHang) ? dsHang : []).filter((h) => co(h.id)).map((h) => ({ id: h.id, ten: h.ten, gia: co(h.id).gia }));
  if (hangToi && co(hangToi.id) && !cot.some((c) => c.id === hangToi.id)) cot.push({ id: hangToi.id, ten: hangToi.ten, gia: co(hangToi.id).gia }); // hạng đã tắt mà thẻ còn hạn
  if (cot.length === 0) return null;
  const toi = hangToi ? hangToi.id : null;
  return [{ ten: nd('gia.thuong'), gia: mon.gia, laToi: !cot.some((c) => c.id === toi) }, ...cot.map((c) => ({ ten: c.ten, gia: c.gia, laToi: c.id === toi }))];
}

/** Menu không còn giá hạng của khách (bản công khai): bỏ `gia_hang` khỏi mọi món, không sửa bản gốc. */
export const boGiaHang = (dl) => (dl && Array.isArray(dl.data) ? { ...dl, data: dl.data.map(({ gia_hang: _bo, ...mon }) => mon) } : dl);

/** Bảng hạng cho khách xem: chỉ hạng giảm thật (`phan_tram` là số > 0) — chủ quán chốt 01.11 ẩn hạng 0%. Không phải mảng → []. */
export const hangCoGiam = (ds) => (Array.isArray(ds) ? ds.filter((h) => typeof h.phan_tram === 'number' && h.phan_tram > 0) : []);

/** Hạng `id` trong /hang có phải hạng chỉ chủ quán cấp (`chi_cap === true`)? Thiếu / sai kiểu → false. */
export const laHangChiCap = (ds, id) => Array.isArray(ds) && ds.some((h) => h && h.id === id && h.chi_cap === true);

/** Tên dòng thẻ của đơn chưa rõ (Thanh toán): "Thẻ hội viên <hạng> · N tháng"; hạng không còn trong /hang → "Thẻ hội viên". */
export function tenDongThe(dong, ds) {
  const h = Array.isArray(ds) ? ds.find((x) => x && x.id === dong.hang_id) : null;
  return h ? nd('the.tt.dong', { hang: h.ten, so: dong.so_thang }) : nd('the.tt.chung');
}
/** Khoá danh mục của chữ tenDongThe vừa chọn (gắn data-nd đúng mục sửa được). */
export const khoaDongThe = (dong, ds) => (Array.isArray(ds) && ds.some((x) => x && x.id === dong.hang_id) ? 'the.tt.dong' : 'the.tt.chung');

// ---- Thẻ hạng bán trên App (KH-THE-1, hợp đồng v13). Chỉ HIỂN THỊ / quyết định nút — giá thật, hạng thật do POS (không gửi số nào đi).
export const NGAY_NHAC_GIA_HAN = 7; // Trang chủ nhắc gia hạn khi thẻ còn ≤ ngần này ngày

/** Gói đang bán hợp lệ của một hạng (`so_thang` nguyên > 0, `gia` > 0), giữ thứ tự POS; chỉ cấp / thiếu → []. */
export const goiBan = (h) => (h && h.chi_cap !== true && Array.isArray(h.goi) ? h.goi.filter((g) => g && Number.isInteger(g.so_thang) && g.so_thang > 0 && Number.isFinite(g.gia) && g.gia > 0) : []);
/** Gói chọn sẵn = gói dài nhất; không gói → null. */
export const goiMacDinh = (h) => goiBan(h).reduce((a, g) => (!a || g.so_thang > a.so_thang ? g : a), null);
/** Hạng bán được trên App: có giảm, không chỉ cấp, có gói. */
export const hangBanDuoc = (ds) => hangCoGiam(ds).filter((h) => goiBan(h).length > 0);
/** Giá gói rẻ nhất; không gói → null. */
export const giaRe = (h) => (goiBan(h).length ? Math.min(...goiBan(h).map((g) => g.gia)) : null);
/** "Tiết kiệm" của gói `g` so với mua lẻ gói ĐẦU (ngắn nhất) cho đủ số tháng; ≤ 0 hoặc chính gói đầu → null. */
export function tietKiem(goi, g) {
  const dau = goiBan({ goi })[0];
  if (!dau || !g || g.so_thang === dau.so_thang) return null;
  const x = Math.floor((dau.gia * g.so_thang) / dau.so_thang) - g.gia; // như demo: giá gói đầu / số tháng × N − giá gói (đồng nguyên)
  return x > 0 ? x : null;
}

const thuBac = (ds, id) => { const h = (Array.isArray(ds) ? ds : []).find((x) => x && x.id === id); return h && Number.isFinite(h.thu_bac) ? h.thu_bac : null; };

// ---- So sánh nhanh (KH-THE-2 B2). App tự tính "Chi 1 triệu, tiết kiệm" CHỈ để hiện; không gửi đi.
export const MOC_TIET_KIEM = 1000000; // "Chi 1 triệu" của bản thiết kế 14.11
/** Số tiết kiệm khi chi MOC_TIET_KIEM: làm tròn XUỐNG đồng; `phan_tram` thiếu / sai kiểu → null (ẩn ô). */
export const tietKiemMotTrieu = (h) => (h && typeof h.phan_tram === 'number' && Number.isFinite(h.phan_tram) ? Math.floor((MOC_TIET_KIEM * h.phan_tram) / 100) : null);
/** Ô "Giá" của một hạng: { k: khoá chữ đơn vị, gia, so } — gói rẻ nhất "/ tháng" hoặc "/ N tháng"; chỉ cấp → quanTang; không gói → chuaBan. */
export function giaCot(h) {
  if (h && h.chi_cap === true) return { k: 'tier.cmp.quanTang', gia: null, so: null };
  const g = goiBan(h).find((x) => x.gia === giaRe(h)) || null;
  if (!g) return { k: 'tier.cmp.chuaBan', gia: null, so: null };
  return { k: g.so_thang === 1 ? 'tier.cmp.moiThang' : 'tier.cmp.moiNThang', gia: g.gia, so: g.so_thang };
}
/** Có hạng nào giảm thêm nhóm đặc biệt (> 0)? Không → ẩn cả hàng "Món nhóm đặc biệt". */
export const coDacBiet = (ds) => Array.isArray(ds) && ds.some((h) => h && typeof h.phan_tram_nhom_dac_biet === 'number' && h.phan_tram_nhom_dac_biet > 0);

/**
 * Nút chính của màn Hạng thành viên cho hạng `h`: { kieu: 'mua' | 'giaHan' | 'mo', lyDo, hang }. POS vẫn là người quyết (mã lỗi v13).
 * mo: chiCap (hạng chỉ cấp) · chuaBan (không gói) · caoHon (khách đang ở hạng `thu_bac` cao hơn — /toi.hang luôn còn hạn; `hang` = tên hạng khách).
 */
export function nutMua(ds, hangToi, h) {
  if (!h || h.chi_cap === true) return { kieu: 'mo', lyDo: 'chiCap' };
  if (!goiBan(h).length) return { kieu: 'mo', lyDo: 'chuaBan' };
  if (hangToi && hangToi.id === h.id) return { kieu: 'giaHan', lyDo: '' };
  const toi = hangToi ? thuBac(ds, hangToi.id) : null;
  if (toi !== null && Number.isFinite(h.thu_bac) && toi > h.thu_bac) return { kieu: 'mo', lyDo: 'caoHon', hang: hangToi.ten };
  return { kieu: 'mua', lyDo: '' };
}

const ngayJd = (chuoi) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(chuoi || '')); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000 : null; };
/** Số ngày lịch (giờ VN — chỉ đọc phần ngày của chuỗi POS, không đổi múi giờ) từ `bayGio` tới `hetHan`; thiếu → null. */
export function soNgayCon(hetHan, bayGio) {
  const a = ngayJd(hetHan), b = ngayJd(bayGio);
  return a === null || b === null ? null : a - b;
}

/**
 * Tình trạng thẻ của khách (Ưu đãi E2 + dòng phụ Hạng thành viên B1) — MỘT hàm: { kieu, hang, soNgay } hoặc null (ẩn thẻ).
 * `ds` = hạng có giảm (/hang); `hangKhach` = /toi.khach.hang (POS chỉ trả hạng còn hạn; null = chưa có). kieu:
 *   chua — chưa hạng / đã quá hạn: hang = hạng bán ĐẦU TIÊN (null → không hạng nào bán được → trả null)
 *   tang — hạng chỉ cấp · sap — hạng bán còn 0…NGAY_NHAC_GIA_HAN ngày · co — còn lại (het_han null: soNgay null).
 */
export function trangThaiTheUuDai(ds, hangKhach, bayGio) {
  const soNgay = hangKhach && hangKhach.het_han ? soNgayCon(hangKhach.het_han, bayGio) : null;
  if (!hangKhach || (soNgay !== null && soNgay < 0)) { const h = hangBanDuoc(ds)[0]; return h ? { kieu: 'chua', hang: h, soNgay: null } : null; }
  if (laHangChiCap(ds, hangKhach.id)) return { kieu: 'tang', hang: hangKhach, soNgay };
  return { kieu: soNgay !== null && soNgay <= NGAY_NHAC_GIA_HAN ? 'sap' : 'co', hang: hangKhach, soNgay };
}

/** Nhắc gia hạn ở Trang chủ: hạng của khách bán được (có trong /hang, không chỉ cấp), còn 0…NGAY_NHAC_GIA_HAN ngày → { id, ten, soNgay }; còn lại null. */
export function nhacGiaHan(ds, hangToi, bayGio) {
  if (!hangToi || !hangToi.het_han || !(Array.isArray(ds) && ds.some((h) => h && h.id === hangToi.id)) || laHangChiCap(ds, hangToi.id)) return null;
  const n = soNgayCon(hangToi.het_han, bayGio);
  return n !== null && n >= 0 && n <= NGAY_NHAC_GIA_HAN ? { id: hangToi.id, ten: hangToi.ten, soNgay: n } : null;
}
