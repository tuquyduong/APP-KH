import { useEffect, useState, useSyncExternalStore } from 'react';
import { bayGio } from '../bayGio.js';
import { docKeHoach, ghiKeHoach, xoaKeHoach, keHoachTrong } from '../kehoach.js';
import { cuaToi } from '../duLieuKhach.js';
import { taoDuongDan } from '../duongDan.js';
import { nd } from '../noiDung/nd.js';

// Bản Kế hoạch (kh_kehoach) giữ ở MỘT chỗ trong bộ nhớ trang để ô Trang chủ, màn Kế hoạch, màn tiện ích cùng thấy một bản.
// `san` = đã biết khách là ai (luuMay.doiKhach xong, như trắc nghiệm): chưa biết thì CHƯA hiện / CHƯA ghi bản của người trước.
let bang = null;
const nghe = new Set();
const lay = () => { if (!bang) bang = docKeHoach(); return bang; };
const KHONG = keHoachTrong();
const phat = () => nghe.forEach((f) => f());
const dangKy = (f) => { nghe.add(f); return () => nghe.delete(f); };

/** Quên bản trong bộ nhớ (đăng xuất / hết phiên / đổi khách): lần đọc sau lấy lại từ máy. */
export function quenKeHoach() { bang = null; phat(); }

/** { bang, luu(moi) → true nếu ghi được trên máy, xoaHet() → true nếu xoá được }. */
export function dungKeHoach(san = true) {
  const b = useSyncExternalStore(dangKy, lay, lay);
  return {
    bang: san ? b : KHONG,
    luu: (moi) => { if (!san) return false; bang = moi; const ok = ghiKeHoach(moi); phat(); return ok; },
    xoaHet: () => { const ok = xoaKeHoach(); bang = null; phat(); return ok; },
  };
}

/** Cho các màn tiện ích: { bang, luuBao(moi, chu) → true nếu đã ghi được (chu rỗng = lưu lặng lẽ), xoaHet, tb, datTb }. Chưa biết khách / kho chặn → báo lỗi, KHÔNG báo "đã lưu". */
export function dungLuuBao(san) {
  const { bang: b, luu, xoaHet } = dungKeHoach(san);
  const [tb, datTb] = useState('');
  const luuBao = (moi, chu) => {
    if (!san) { datTb(nd('ti.chuaSan')); return false; }
    const ok = luu(moi);
    if (!ok) datTb(nd('ti.loiKho')); else if (chu) datTb(chu);
    return ok;
  };
  return { bang: b, luuBao, xoaHet, tb, datTb };
}

// Bấm một việc ở "Sắp tới" → mở lịch đúng ngày đó (demo calPick + go('lich')). Đọc MỘT lần.
// `moBang` = mở luôn bảng việc của ngày đó (bấm "Xem" ở dải nhắc việc, hoặc kết quả tìm). Đọc MỘT lần.
let ngayMo = null, moBangNgay = false;
export const SU_KIEN_MO_NGAY = 'kh-mo-ngay'; // màn Kế hoạch đang mở thì nghe sự kiện này để nhảy tới ngày
export const datNgayMo = (ngay, moBang = false) => { ngayMo = ngay; moBangNgay = moBang; if (typeof window !== 'undefined') window.dispatchEvent(new Event(SU_KIEN_MO_NGAY)); };
export const layNgayMo = () => { const n = ngayMo, b = moBangNgay; ngayMo = null; moBangNgay = false; return { ngay: n, moBang: b }; };

/** Vẽ lại màn mỗi khi PHÚT theo giờ POS (`bayGio`) đổi — để chữ đếm "10 phút nữa" / "Còn 2 giờ" chạy, hết giờ thì tự đổi / ẩn. Hỏi 5 giây một lần, chỉ vẽ khi đổi phút. */
export function dungPhut() {
  const [, ve] = useState(bayGio().slice(0, 16));
  useEffect(() => {
    const id = setInterval(() => ve((p) => { const n = bayGio().slice(0, 16); return n === p ? p : n; }), 5000);
    return () => clearInterval(id);
  }, []);
}

/** Mở một địa chỉ của app từ màn không nhận hàm điều hướng riêng (vd. /kehoach/vankhan/<dịp>): đẩy lịch sử rồi báo cho bộ định tuyến (dieuHuong.js nghe `popstate`). */
export function diDen(duong) {
  const buoc = (window.history.state && window.history.state.kh) || 0;
  window.history.pushState({ kh: buoc + 1 }, '', duong);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
/** Quay lại: có lịch sử trong app → Back; mở thẳng (không lịch sử) → thay bằng `veNeuHet`. */
export function luiDen(veNeuHet) {
  if (((window.history.state && window.history.state.kh) || 0) > 0) { window.history.back(); return; }
  window.history.replaceState({ kh: 0 }, '', veNeuHet);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/** Hồ sơ khách đang đăng nhập đã có sẵn trong kho chung của App (không gọi mạng): { ten, xung_ho }; chưa biết → {}. */
export const hoSoKhach = () => { const s = cuaToi.kho.lay(); return (s.dl && s.dl.khach) || {}; };

/** Bấm một dòng của "Sắp tới" (`upList`) → mở đúng chỗ. `moViec(ngay)` mở việc trên lịch; `moTienIch(id)` mở một tiện ích. */
export function moMucSapToi(e, { moViec, moTienIch }) {
  if (e.di === 'viec') moViec(e.ngay);
  else if (e.di === 'nguoi') moTienIch('ngaycannho');
  else if (e.di === 'xe') moTienIch('xeco');
  else if (e.di === 'thuoc') moTienIch('uongthuoc');
  else if (e.di === 'chuky') moTienIch('chuky');
  else if (e.di === 'cung') diDen(taoDuongDan('tienich', { tienich: 'vankhan', dip: e.dip }));
  else moTienIch('ngayle');
}
