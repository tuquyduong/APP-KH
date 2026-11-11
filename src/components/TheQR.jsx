import { useMemo } from 'react';
import { dinhDangGia } from '../dinhDang.js';
import { dungTheQR, noiDungCK } from '../qrThuongHieu.js';
import { nd, ndAnh, ndDau } from '../noiDung/nd.js';
import Chu from './Chu.jsx';
import '../giaoDien/the_qr.css';

// Thẻ mã QR trả tiền thương hiệu (KH-SOHD-1, mẫu chủ quán duyệt 06.11). `soTien` không biết → ẩn số; `soHd` null → chỉ nội dung CK; không đọc được CK → chỉ số đơn.
// Hình mã do qrThuongHieu.js dựng (chấm tròn, 3 ô góc tô đặc, đĩa logo trắng). Nền mã luôn trắng, kể cả giao diện tối.
export default function TheQR({ chuoi, soTien = null, soHd = null }) {
  const m = useMemo(() => { try { return dungTheQR(chuoi); } catch { return null; } }, [chuoi]); // chuỗi quá dài cho mã: không vẽ mã, không làm trắng màn
  const dong = [soHd, noiDungCK(chuoi)].filter(Boolean).join(' · ');
  const d = m ? m.logo.r * 1.7 : 0;
  const LOGO = ndAnh('qr.logo');
  return (
    <div className="the-qr">
      <div className="the-qr-dau">
        <img src={LOGO} alt="" {...ndDau('qr.logo')} />
        <div><Chu k="qr.ten" as="div" className="the-qr-ten" /><Chu k="qr.phu" as="div" className="the-qr-phu" /></div>
      </div>
      <div className="the-qr-o">
        {dinhDangGia(soTien) && <div className="the-qr-tien" {...ndDau('qr.tien')}>{dinhDangGia(soTien)}</div>}
        {m && <svg viewBox={`${-m.vien} ${-m.vien} ${m.tong} ${m.tong}`} role="img" aria-label={nd('qr.aria')} {...ndDau('qr.aria')}>
          <rect x={-m.vien} y={-m.vien} width={m.tong} height={m.tong} fill="#fff" />
          {m.cham.map((g) => <path key={g.mau} d={g.d} fill={g.mau} />)}
          {m.finder.map((f) => (
            <g key={`${f.x}-${f.y}`}>
              <rect x={f.x} y={f.y} width="7" height="7" rx="2" fill={f.mau} />
              <rect x={f.x + 1} y={f.y + 1} width="5" height="5" rx="1.4" fill="#fff" />
              <rect x={f.x + 2} y={f.y + 2} width="3" height="3" rx="1" fill={f.mau} />
            </g>
          ))}
          <circle cx={m.logo.cx} cy={m.logo.cy} r={m.logo.r} fill="#fff" />
          <image href={LOGO} x={m.logo.cx - d / 2} y={m.logo.cy - d / 2} width={d} height={d} />
        </svg>}
        {dong && <div className="the-qr-dong" {...ndDau('qr.dong')}>{dong}</div>}
      </div>
    </div>
  );
}
