import { Ico } from './BieuTuong.jsx';
import Chu from './Chu.jsx';
import { ndDau } from '../noiDung/nd.js';

// Khung chung cho màn tải dữ liệu: đang tải (khung xám nhẹ) / lỗi (có nút thử lại) / nội dung. Không bao giờ trắng màn.
export function KhungLoi({ loi, thuLai }) {
  return (
    <div>
      <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau('khung.loi')}>{loi}</div></div>
      <Chu k="khung.thuLai" as="button" type="button" className="ghost-btn" onClick={thuLai} />
    </div>
  );
}

export default function TrangTai({ tai, children }) {
  if (tai.dangTai && !tai.dl) {
    return <div aria-busy="true"><div className="khung-tai" /><div className="khung-tai" /></div>;
  }
  if (tai.loi) return <KhungLoi loi={tai.loi} thuLai={tai.taiLai} />;
  return children(tai.dl);
}
