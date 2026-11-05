import { docHoaDon, nhomHoaDon } from '../hoaDon.js';
import { Ico } from './BieuTuong.jsx';
import '../giaoDien/hoa_don.css';

// Vẽ tờ hoá đơn giao khách (don.hoa_don[]) đúng thứ tự POS trả. Không tính tiền: chữ ở `trai` / `phai` đã dựng sẵn.
function Dong({ d }) {
  const nhom = nhomHoaDon(d.loai);
  if (nhom === 'canh_bao') return <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{[d.trai, d.phai].filter(Boolean).join(' ')}</div></div>;
  if (nhom === 'dau') {
    const chu = d.loai === 'so_bill' ? `Số bill: ${d.phai}` : d.loai === 'gio' ? [d.trai, d.phai].filter(Boolean).join(' · ') : [d.trai, d.phai].filter(Boolean).join(' ');
    return <div className={`hd-dau${d.dam ? ' dam' : ''}`}>{chu}</div>;
  }
  if (nhom === 'tieu_de') return <div className="hd-tieu-de">{d.trai || d.phai}</div>;
  if (nhom === 'chan') return <div className="hd-chan">{[d.trai, d.phai].filter(Boolean).join(' ')}</div>;
  const giam = d.loai.startsWith('giam_');
  const tong = d.loai === 'tong';
  return (
    <div className={`summary-row hd-dong${giam ? ' discount' : ''}${tong ? ' total' : ''}${d.dam && !tong ? ' dam' : ''}`}>
      <span>{d.trai}{d.ghiChu && <div className="hd-ghi">{d.ghiChu}</div>}</span>
      <span>{d.gach && <span className="hd-gach">{d.gach}</span>}{d.phai}</span>
    </div>
  );
}

export default function HoaDonKhach({ don }) {
  const dong = docHoaDon(don);
  return dong.map((d, i) => <Dong d={d} key={i} />);
}
