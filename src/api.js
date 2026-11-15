// CHỖ DUY NHẤT App KH gọi máy chủ: /api/kh/* (goi — token khách) và kho nội dung /api/nd/* (goiKho — vé quản trị, KH-ADMIN-1); bắt { error, code }. Không fetch ở nơi khác.
// Token khách KHÔNG BAO GIỜ sang /api/nd (goiKho không đọc token); vé quản trị KHÔNG BAO GIỜ sang /api/kh (goi không nhận vé).
import { loiTheoCode, ghepDiaChi } from './dinhDang.js';
import { CHAN_KHI_SUA } from './noiDung/quanTri.js';

const ENV = import.meta.env || {};

const KHOA_TOKEN = 'kh_token';
let tokenBoNho = '';
let khiHetPhien = () => {};

// localStorage có thể ném (cửa sổ riêng tư, chặn dữ liệu) → bọc, rơi về bộ nhớ trang.
export function docToken() {
  try { return localStorage.getItem(KHOA_TOKEN) || tokenBoNho; } catch { return tokenBoNho; }
}
export function luuToken(t) {
  tokenBoNho = t;
  try { localStorage.setItem(KHOA_TOKEN, t); } catch { /* chỉ giữ trong bộ nhớ */ }
}
export function xoaToken() {
  tokenBoNho = '';
  try { localStorage.removeItem(KHOA_TOKEN); } catch { /* không có gì để xoá */ }
}
export const datKhiHetPhien = (f) => { khiHetPhien = f; };

// `duLieu` = nguyên thân lỗi POS (vd `bao_gia` của GIA_DA_DOI, `thu_lai_sau_giay`, `ma` của món hết hàng).
function loiApi(status, code, error, duLieu = null) {
  const e = new Error(loiTheoCode(code, error));
  e.status = status; e.code = code; e.duLieu = duLieu;
  return e;
}

// Cửa công khai của hợp đồng v2 (token: không): không gửi kèm phiên, nên phiên hết hạn không bị xoá oan vì chúng.
const CUA_CONG_KHAI = ['/hang', '/gio-vang', '/gio-hoat-dong', '/chuong-trinh'];

// Chế độ sửa (/admin, KH-ADMIN-1 D7): MỌI lệnh GHI /api/kh bị chặn ở đây (không gửi), trừ báo giá + đăng nhập khách (để xem các màn). Lỗi chặn là 4xx có `code`
// → datDon.loaiLoi coi là "chưa tạo" (không tự gửi lại, không kẹt bản ghi "chưa rõ").
let dangSua = false;
const DUOC_GHI_KHI_SUA = /^\/(gio\/bao-gia|dang-nhap\/xin-ma|dang-nhap\/xac-minh|gia-han)$/;
export const datCheDoSua = (b) => { dangSua = !!b; };
export const dangCheDoSua = () => dangSua;

// `choMs` (tuỳ chọn): quá ngần này ms chưa xong → huỷ, ném như mất mạng (status 0) — người gọi coi là "chưa rõ".
async function goi(phuongThuc, duong, than, choMs) {
  if (dangSua && phuongThuc !== 'GET' && !DUOC_GHI_KHI_SUA.test(duong)) throw loiApi(423, 'CHE_DO_SUA', CHAN_KHI_SUA);
  const token = CUA_CONG_KHAI.includes(duong) ? '' : docToken();
  const tieuDe = { 'Content-Type': 'application/json' };
  if (token) tieuDe.Authorization = `Bearer ${token}`;
  const huy = choMs ? new AbortController() : null;
  const hen = huy && setTimeout(() => huy.abort(), choMs);
  let res, dl = null;
  try {
    res = await fetch(ghepDiaChi(ENV.VITE_POS_API, duong), { method: phuongThuc, headers: tieuDe, body: than === undefined ? undefined : JSON.stringify(than), signal: huy ? huy.signal : undefined });
    try { dl = await res.json(); } catch (e) { if (huy && huy.signal.aborted) throw e; /* không phải JSON */ }
  } catch {
    throw loiApi(0, 'MANG_LOI');
  } finally {
    clearTimeout(hen);
  }
  if (!res.ok || !dl) {
    if (res.status === 401 && token) { xoaToken(); khiHetPhien(); }
    throw loiApi(res.status, dl && dl.code, dl && dl.error, dl);
  }
  return dl;
}

/** Gọi kho nội dung /api/nd (địa chỉ đầy đủ do khoNoiDung.js ghép). `ve` = vé quản trị (hoặc rỗng); `than` = đối tượng (JSON) hoặc FormData (ảnh). */
export async function goiKho(diaChi, phuongThuc, than, ve) {
  const laTep = typeof FormData !== 'undefined' && than instanceof FormData;
  const tieuDe = {};
  if (than !== undefined && !laTep) tieuDe['Content-Type'] = 'application/json';
  if (ve) tieuDe.Authorization = `Bearer ${ve}`;
  let res, dl = null;
  try {
    res = await fetch(diaChi, { method: phuongThuc, headers: tieuDe, body: than === undefined ? undefined : laTep ? than : JSON.stringify(than), cache: 'no-store' });
    try { dl = await res.json(); } catch { /* không phải JSON */ }
  } catch {
    throw loiApi(0, 'MANG_LOI');
  }
  if (!res.ok || !dl) throw loiApi(res.status, dl && dl.code, dl && dl.error, dl);
  return dl;
}

export const xinMa = (sdt) => goi('POST', '/dang-nhap/xin-ma', { sdt });
// `them` = { xung_ho, dia_chi? } ở bước 3 (luongDangNhap.truongThem).
export const xacMinh = (sdt, ma, ten, them) => goi('POST', '/dang-nhap/xac-minh', { sdt, ma, ten, ...them });
export const layHang = () => goi('GET', '/hang');
export const layGioVang = () => goi('GET', '/gio-vang');
export const layChuongTrinh = () => goi('GET', '/chuong-trinh'); // v9 CT-1a — không token (CUA_CONG_KHAI); dùng ở UuDai
export const layGioHoatDong = () => goi('GET', '/gio-hoat-dong');
export const layToi = () => goi('GET', '/toi');
// `truong` = đúng các khoá cần đổi trong { ten, xung_ho, dia_chi } — thân yêu cầu chỉ chứa chúng (hợp đồng v3 "Hồ sơ").
export const suaHoSo = (truong) => goi('PUT', '/toi', truong);
export const giaHan = () => goi('POST', '/gia-han');
export const layMenu = () => goi('GET', '/menu');
export const layDiem = () => goi('GET', '/diem');
export const layVoucher = (tatCa) => (tatCa ? goi('GET', '/voucher?all=1') : goi('GET', '/voucher'));
export const layDon = (trang) => goi('GET', `/don?trang=${trang}`);
export const layChiTietDon = (ma) => goi('GET', `/don/${encodeURIComponent(ma)}`);
export const nhanMaBill = (ma) => goi('POST', '/nhan-ma-bill', { ma });
export const nhanDiem = (ma) => goi('POST', '/nhan-diem', { ma });
export const datPin = (pin, pinLai) => goi('PUT', '/pin', { pin, pin_lai: pinLai });
// Đặt đơn (hợp đồng v9). Thân dựng ở datDon.js. POST /don chờ tối đa MS_CHO_DAT_DON rồi coi là "chưa rõ" (datDon.guiDonAnToan gửi lại cùng khoá).
const MS_CHO_DAT_DON = 20000;
export const baoGiaGio = (than) => goi('POST', '/gio/bao-gia', than);
export const datDonApp = (than) => goi('POST', '/don', than, MS_CHO_DAT_DON);
export const huyDonApp = (ma) => goi('POST', `/don/${encodeURIComponent(ma)}/huy`);
