import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai, { KhungLoi } from '../components/TrangTai.jsx';
import TheMoi from '../components/TheMoi.jsx';
import KhongTimThay from './KhongTimThay.jsx';
import TrangMon from './TrangMon.jsx';
import { THE_MOI_MENU } from '../noiDung/dangNhap.js';

// Trang món mở bằng đường dẫn /mon/<ten-mon>: `mon` đã tìm sẵn trong menu (null nếu chưa thấy). Chưa có menu → như Menu
// (khách mà POS còn đòi đăng nhập: thẻ mời; đang tải; lỗi mạng); có menu mà không có món → "Không tìm thấy món" + "Xem Menu".
export default function MonTheoDuong({ mon, tai, lui, moQR, moMenu, moDangNhap }) {
  if (mon) return <TrangMon mon={mon} lui={lui} moQR={moQR} />;
  if (tai.canDN && !tai.dl) {
    return <Man id="detail"><DauManCon tieuDe="Món" lui={lui} /><TheMoi chu={THE_MOI_MENU} moDangNhap={moDangNhap} /></Man>;
  }
  if (tai.dangTai && (!tai.dl || tai.cu)) return <Man id="detail"><DauManCon tieuDe="Món" lui={lui} /><TrangTai tai={tai}>{() => null}</TrangTai></Man>;
  if (!tai.dl && tai.loi) return <Man id="detail"><DauManCon tieuDe="Món" lui={lui} /><KhungLoi loi={tai.loi} thuLai={() => tai.taiLai(true)} /></Man>;
  return <KhongTimThay tieuDe="Không tìm thấy món" nut="Xem Menu" chon={moMenu} />;
}
