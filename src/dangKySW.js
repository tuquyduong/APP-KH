// Đăng ký service worker (public/sw.js — KH-PWA-1) + tự lên bản mới LẶNG LẼ khi khách quay lại App sau ≥ 30 phút, chỉ ở màn an toàn (chủ quán 08.11).
// Trang không tự gọi mạng (chỗ duy nhất là api.js — bộ kiểm K1): nhờ service worker hỏi index.html, nó trả tên tệp JS của bản mới nhất.
// Hàm thuần ở trên (bài thử cong_cu/thu_KHPWA1.js nạp thẳng); dangKySW() chỉ chạy trong trình duyệt.

export const PHUT_KIEM = 30;
const KHOA_DA_TAI = 'kh_ban_da_tai_lai';
const HOP_THOAI = '[role="dialog"],[aria-modal="true"],.sheet.show';
const KHONG_AN_TOAN = /^\/(giohang|thanhtoan|don\/.+|dangnhap.*|taikhoan\/thongtin|tracnghiem\/lam(\/.*)?)$/;

/** Được tự tải lại không: KHÔNG khi đang mở bảng nổi / hộp thoại, hoặc ở giỏ hàng, thanh toán, đơn, đăng nhập, sửa thông tin, đang làm trắc nghiệm (bài dở chỉ ở state). */
export function coTheTaiLai(duongDan, dangMoHopThoai) {
  if (dangMoHopThoai) return false;
  return !KHONG_AN_TOAN.test(String(duongDan || '').toLowerCase().replace(/\/+$/, ''));
}

/** Hiện lại sau khi ẩn ≥ 30 phút, và lần kiểm trước cách ≥ 30 phút. */
export function denLucKiem(lucAn, lanKiem, bayGio) {
  const n = PHUT_KIEM * 60000;
  return lucAn > 0 && bayGio - lucAn >= n && bayGio - lanKiem >= n;
}

/** Bản trên mạng khác bản đang chạy (tên rỗng — HTML hỏng / lỗi mạng — coi như không đổi). */
export const doiBan = (tenMoi, tenDangChay) => !!tenMoi && !!tenDangChay && tenMoi !== tenDangChay;

const docKho = () => { try { return sessionStorage.getItem(KHOA_DA_TAI); } catch { return null; } };
const ghiKho = (v) => { try { sessionStorage.setItem(KHOA_DA_TAI, v); } catch { /* kho bị chặn */ } };

export function dangKySW() {
  if (!import.meta.env?.PROD || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {});
  const the = document.querySelector('script[src*="/assets/index-"]');
  const dangChay = the ? new URL(the.src).pathname : '';
  let lucAn = 0, lanKiem = 0, banMoi = '', hen = 0;

  const thuTaiLai = () => {
    if (document.visibilityState !== 'visible' || !coTheTaiLai(location.pathname, !!document.querySelector(HOP_THOAI))) return;
    clearInterval(hen);
    ghiKho(banMoi);
    location.reload();
  };
  const kiem = () => {
    const sw = navigator.serviceWorker.controller;
    if (!sw || !dangChay || banMoi) return;
    const kenh = new MessageChannel();
    kenh.port1.onmessage = (e) => {
      if (!doiBan(e.data, dangChay) || docKho() === e.data) return;
      banMoi = e.data;
      hen = setInterval(thuTaiLai, 2000);
      thuTaiLai();
    };
    sw.postMessage({ loai: 'kiemBan' }, [kenh.port2]);
  };
  document.addEventListener('visibilitychange', () => {
    const bay = Date.now();
    if (document.visibilityState !== 'visible') { lucAn = bay; return; }
    if (banMoi) { thuTaiLai(); return; }
    if (denLucKiem(lucAn, lanKiem, bay)) { lanKiem = bay; kiem(); }
  });
}
