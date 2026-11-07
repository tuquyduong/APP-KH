// Báo "Đơn đã sẵn sàng" (KH-BAO-1): hàm thuần từ danh sách GET /don (trang 1) — KHÔNG tính tiền, KHÔNG đọc giờ.
// Chỉ báo đơn chuyển sang `xong` mà máy này ĐÃ THẤY đang chạy (da_tra / dang_lam) — đơn xong từ hôm trước không báo.
// Nhớ { thay[], bao[] } ở sessionStorage (mất khi đóng tab; tải lại thì còn). Kho tiêm vào để thử.

export const MS_HOI = 15000;            // có đơn đang chạy + tab hiện: hỏi GET /don mỗi ngần này ms
export const KHOA_BAO_DON = 'kh_bao_don';
const DANG_CHAY = ['da_tra', 'dang_lam'];
const TOI_DA = 60;                       // nhớ tối đa ngần này mã mỗi danh sách
const kho = () => sessionStorage;
const lay = (k) => (typeof k === 'function' ? k() : k);
const gom = (a) => [...new Set(a)].slice(-TOI_DA);

export const tieuDeXong = (ma) => `(Xong) Đơn #${ma} — Tứ Quý Đường`;

/** { nho, choBao[], dangChay } — `choBao` theo thứ tự POS trả; đơn nào khách chưa tắt thì còn ở đây. */
export function xemDanhSach(ds, nho) {
  const don = (Array.isArray(ds) ? ds : []).filter((x) => x && (typeof x.ma === 'string' || typeof x.ma === 'number') && String(x.ma) !== '').map((x) => ({ ma: String(x.ma), tt: x.tien_trinh }));
  const chay = don.filter((x) => DANG_CHAY.includes(x.tt)).map((x) => x.ma);
  const choBao = don.filter((x) => x.tt === 'xong' && nho.thay.includes(x.ma) && !nho.bao.includes(x.ma)).map((x) => x.ma);
  return { nho: { thay: gom([...nho.thay, ...chay]), bao: nho.bao }, choBao, dangChay: chay.length > 0 };
}

/** Khách tắt / xem đơn `ma` → không báo lại. */
export const daBao = (nho, ma) => ({ thay: nho.thay, bao: gom([...nho.bao, String(ma)]) });

export function docNho(k = kho) {
  const rong = { thay: [], bao: [] };
  try {
    const n = JSON.parse(lay(k).getItem(KHOA_BAO_DON));
    const ds = (a) => (Array.isArray(a) ? a.filter((x) => typeof x === 'string') : []);
    return n && typeof n === 'object' ? { thay: ds(n.thay), bao: ds(n.bao) } : rong;
  } catch { return rong; }
}
export function ghiNho(nho, k = kho) { try { lay(k).setItem(KHOA_BAO_DON, JSON.stringify(nho)); } catch { /* kho chặn: chỉ không nhớ qua tải lại */ } }
export function xoaNho(k = kho) { try { lay(k).removeItem(KHOA_BAO_DON); } catch { /* kho chặn */ } }
