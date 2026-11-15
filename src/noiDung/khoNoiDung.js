// Kho nội dung App KH — MỘT tệp nói chuyện với kho /api/nd (hợp đồng RIÊNG thiet_ke/HOP_DONG_API_ND.md v1; POS giữ hộ — CLAUDE.md §11).
// Sau này tách máy chủ (KH-TACH-1) chỉ đổi MỘT địa chỉ: biến VITE_ND_API (thiếu → cùng gốc với VITE_POS_API + /api/nd — VITE_POS_API là GỐC máy,
// dinhDang.ghepDiaChi tự thêm /api/kh). Lệnh fetch thật ở src/api.js (goiKho).
//   Khách: bản gần nhất trên máy (`kh_nd_ban`, nội dung CÔNG KHAI — không thuộc luuMay.js, giữ khi đăng xuất / đổi khách) → datBanNoiDung TRƯỚC lần vẽ đầu;
//          rồi hỏi "có số bản mới không" MỘT lần lúc mở + khi quay lại App sau ≥ PHUT_KIEM phút. Lỗi / không mạng → giữ bản đang có, không báo.
//   Quản trị: vé (`POST /dang-nhap`) chỉ ở sessionStorage (đóng tab là thoát; không localStorage, không mật khẩu). quyen[] chỉ để ẩn / hiện nút — máy chủ quyết.
import { goiKho, datCheDoSua } from '../api.js';
import { datBanNoiDung, banDangDung, datLopNhap, datGocAnh } from './nd.js';
import { denLucKiem } from '../dangKySW.js'; // cùng luật "quay lại sau ≥ PHUT_KIEM phút" với tự lên bản App

const ENV = import.meta.env || {};
/** Địa chỉ kho (thuần — bài thử nạp thẳng). */
export function diaChiKho(env) {
  const bo = (s) => (typeof s === 'string' ? s.trim().replace(/\/+$/, '') : '');
  return bo(env.VITE_ND_API) || `${bo(env.VITE_POS_API)}/api/nd`;
}
export const DIA_CHI_KHO = diaChiKho(ENV);

/** Giới hạn App kiểm TRƯỚC khi gửi — đúng số `gioi_han` của hợp đồng v1 (bài thử so). */
export const GIOI_HAN = { khoa_toi_da: 80, ban_toi_da_byte: 1048576, anh_toi_da_byte: 512000, nhap_toan_bo_toi_da_byte: 52428800, ghi_chu_toi_da: 500 };

const KHOA_BAN_MAY = 'kh_nd_ban';
const KHOA_VE = 'nd_ve';
const KHOA_SUA = 'nd_sua';
const thu = (f, du) => { try { return f(); } catch { return du; } };
let veBoNho = null; // sessionStorage bị chặn → chỉ giữ trong trang
let khiHetVe = () => {
  const p = location.pathname + location.search;
  location.assign(`/admin?tiep=${encodeURIComponent(p)}`);
};
export const datKhiHetVe = (f) => { khiHetVe = f; };

// ----- vé quản trị -----
export function docVe() {
  const v = thu(() => JSON.parse(sessionStorage.getItem(KHOA_VE)), null) || veBoNho;
  return v && typeof v.ve === 'string' && v.ve ? v : null;
}
export function luuVe(v) {
  const gon = { ve: v.ve, het_han: v.het_han || '', quyen: Array.isArray(v.quyen) ? v.quyen : [], nguoi: v.nguoi || {} };
  veBoNho = gon;
  thu(() => sessionStorage.setItem(KHOA_VE, JSON.stringify(gon)));
}
export function xoaVe() { veBoNho = null; thu(() => sessionStorage.removeItem(KHOA_VE)); }
export const coVe = () => !!docVe();
export const coQuyen = (q) => { const v = docVe(); return !!v && v.quyen.includes(q); };

// ----- cờ Chế độ sửa (giữ khi tải lại trang, còn vé) -----
let suaBoNho = false;
export const dangSua = () => coVe() && (thu(() => sessionStorage.getItem(KHOA_SUA) === '1', false) || suaBoNho);
export function batSua(b) {
  suaBoNho = !!b;
  thu(() => (b ? sessionStorage.setItem(KHOA_SUA, '1') : sessionStorage.removeItem(KHOA_SUA)));
  datCheDoSua(dangSua());
  if (!dangSua()) datLopNhap(null);
}
/** Thoát quản trị (nút Thoát, ✕ không dùng hàm này — chỉ tắt sửa): xoá vé + tắt sửa + bỏ lớp nháp. */
export function thoatQuanTri() { xoaVe(); batSua(false); }

// ----- bản nội dung của khách -----
const ghiMay = (b) => thu(() => localStorage.setItem(KHOA_BAN_MAY, JSON.stringify({ so_ban: b.so_ban, gia_tri: b.gia_tri })));
/** Đọc bản trên máy (ĐỒNG BỘ, trước lần vẽ đầu) + bật chặn ghi nếu đang sửa (có vé + cờ). */
export function napBanMay() {
  datGocAnh(DIA_CHI_KHO);
  const b = thu(() => JSON.parse(localStorage.getItem(KHOA_BAN_MAY)), null);
  datBanNoiDung(b && typeof b === 'object' ? b : null);
  const sua = dangSua();
  datCheDoSua(sua);
  datLopNhap(sua ? {} : null);
}
/** Hỏi kho có bản mới không (một lần). Bản khác → áp + lưu máy. Lỗi → im. */
export async function hoiBanMoi() {
  const co = banDangDung().so_ban;
  try {
    const d = await goiCong('GET', `/ban-dang-chay?co=${co}`);
    if (d.khong_doi || !d.gia_tri || typeof d.gia_tri !== 'object') return;
    const b = { so_ban: d.so_ban, gia_tri: d.gia_tri };
    datBanNoiDung(b);
    ghiMay(b);
  } catch { /* giữ bản đang có */ }
}
/** Mở App: nạp bản máy, hỏi một lần, rồi hỏi lại khi quay lại sau ≥ PHUT_KIEM phút (dangKySW.denLucKiem). */
export function batDauNoiDung() {
  napBanMay();
  hoiBanMoi();
  let lucAn = 0, lanKiem = Date.now();
  document.addEventListener('visibilitychange', () => {
    const bay = Date.now();
    if (document.visibilityState !== 'visible') { lucAn = bay; return; }
    if (denLucKiem(lucAn, lanKiem, bay)) { lanKiem = bay; hoiBanMoi(); }
  });
}

// ----- cửa của hợp đồng -----
const goiCong = (pt, duong, than) => goiKho(DIA_CHI_KHO + duong, pt, than, '');
async function goiQT(pt, duong, than) {
  const v = docVe();
  try {
    return await goiKho(DIA_CHI_KHO + duong, pt, than, v ? v.ve : '');
  } catch (e) {
    if (e.status === 401 && v) { thoatQuanTri(); khiHetVe(); }
    throw e;
  }
}
const ma = (s) => encodeURIComponent(s);

export async function dangNhapQT(ten, matKhau) {
  const d = await goiCong('POST', '/dang-nhap', { ten_dang_nhap: ten, mat_khau: matKhau });
  luuVe(d);
  return d;
}
export const layBanDangChay = () => goiCong('GET', '/ban-dang-chay');
export const layNhap = () => goiQT('GET', '/nhap');
export const luuNhap = (khoa, giaTri, banGoc) => goiQT('PUT', '/nhap', { khoa, gia_tri: giaTri, ban_goc: banGoc });
export const boNhap = (khoa) => goiQT('DELETE', `/nhap/${ma(khoa)}`);
export const capNhat = (banGoc, ghiChu) => goiQT('POST', '/cap-nhat', { ban_goc: banGoc, ...(ghiChu ? { ghi_chu: ghiChu } : {}) });
export const layDsPhienBan = () => goiQT('GET', '/phien-ban');
export const layPhienBan = (so) => goiQT('GET', `/phien-ban/${ma(so)}`);
export const quayLai = (so, banGoc, ghiChu) => goiQT('POST', '/quay-lai', { so, ban_goc: banGoc, ...(ghiChu ? { ghi_chu: ghiChu } : {}) });
export function taiAnhLen(tep, ten) {
  const f = new FormData();
  f.append('anh', tep, ten);
  return goiQT('POST', '/anh', f);
}
export const xuatToanBo = () => goiQT('GET', '/xuat');
export const nhapToanBo = (tep) => goiQT('POST', '/nhap-toan-bo', tep);
