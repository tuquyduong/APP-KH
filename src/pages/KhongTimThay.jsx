import Man from '../components/Man.jsx';
import { Ico } from '../components/BieuTuong.jsx';

// "Không tìm thấy" dáng demo (nt-state + nút checkout-btn): dùng cho đường dẫn lạ ("Về Trang chủ") và món đã ngừng bán ("Xem Menu").
export default function KhongTimThay({ tieuDe, nut, chon }) {
  return (
    <Man id="khongthay">
      <div className="topbar"><div><h1>{tieuDe}</h1></div></div>
      <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>Liên kết này không còn hoặc bị gõ sai.</div></div>
      <button type="button" className="checkout-btn giua" onClick={chon}>{nut}</button>
    </Man>
  );
}
