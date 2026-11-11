import Man from '../components/Man.jsx';
import Chu from '../components/Chu.jsx';
import { Ico } from '../components/BieuTuong.jsx';
import { ndDau, nd } from '../noiDung/nd.js';

// "Không tìm thấy" dáng demo (nt-state + nút checkout-btn): `loai` 'trang' = đường dẫn lạ ("Về Trang chủ"), 'mon' = món đã ngừng bán ("Xem Menu").
// Chữ lấy từ danh mục (khoá khongthay.* / mon.khongThay.*), không nhận chữ từ ngoài vào.
export default function KhongTimThay({ loai = 'trang', chon }) {
  const k = loai === 'mon' ? { t: 'mon.khongThay.t', nut: 'mon.khongThay.nut' } : { t: 'khongthay.t', nut: 'khongthay.nut' };
  return (
    <Man id="khongthay">
      <div className="topbar"><div><Chu k={k.t} as="h1" /></div></div>
      <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><Chu k="khongthay.noi" as="div" /></div>
      <button type="button" className="checkout-btn giua" onClick={chon} {...ndDau(k.nut)}>{nd(k.nut)}</button>
    </Man>
  );
}
