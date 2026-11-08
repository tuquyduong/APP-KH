import { useSyncExternalStore } from 'react';
import { docKeHoach, ghiKeHoach, xoaKeHoach, keHoachTrong } from '../kehoach.js';

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

// Bấm một việc ở "Sắp tới" → mở lịch đúng ngày đó (demo calPick + go('lich')). Đọc MỘT lần.
// `moBang` = mở luôn bảng việc của ngày đó (bấm "Xem" ở dải nhắc việc, hoặc kết quả tìm). Đọc MỘT lần.
let ngayMo = null, moBangNgay = false;
export const SU_KIEN_MO_NGAY = 'kh-mo-ngay'; // màn Kế hoạch đang mở thì nghe sự kiện này để nhảy tới ngày
export const datNgayMo = (ngay, moBang = false) => { ngayMo = ngay; moBangNgay = moBang; if (typeof window !== 'undefined') window.dispatchEvent(new Event(SU_KIEN_MO_NGAY)); };
export const layNgayMo = () => { const n = ngayMo, b = moBangNgay; ngayMo = null; moBangNgay = false; return { ngay: n, moBang: b }; };
