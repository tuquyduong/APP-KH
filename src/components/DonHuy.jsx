import { dinhDangGia } from '../dinhDang.js';
import { nd, ndDau, ndHien, ndPhan } from '../noiDung/nd.js';
import Chu from './Chu.jsx';
import { Ico } from './BieuTuong.jsx';

// Đơn QUÁN huỷ (hợp đồng v14): lý do (nhãn POS, hiện NGUYÊN chữ) + số POS đã hoàn vào ví (App không tự tính). Dùng ở Theo dõi đơn và Chi tiết đơn.
// Hai trường cùng vắng / 0 (khách tự huỷ, QR hết hạn, POS cũ) → không dựng gì.
export default function DonHuy({ lyDo, hoan, moVi }) {
  const coHoan = typeof hoan === 'number' && hoan > 0;
  if ((!lyDo && !coHoan) || !ndHien('hien.don.huy')) return null;
  return (
    <>
      {lyDo && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau('td.huy.lyDo')}>{ndPhan('td.huy.lyDo', { lyDo: <b key="ly" {...ndDau('td.huy.nhan')}>{lyDo}</b> })}</div></div>}
      {coHoan && (
        <>
          <div className="nt-state on" role="status"><Ico ten="check" s={18} /><div {...ndDau('td.huy.hoan')}>{nd('td.huy.hoan', { so: dinhDangGia(hoan) })}</div></div>
          {moVi && <Chu k="td.huy.xemVi" as="button" type="button" className="ghost-btn" onClick={moVi} />}
        </>
      )}
    </>
  );
}
