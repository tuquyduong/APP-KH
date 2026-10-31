import { useMemo } from 'react';
import qrcode from 'qrcode-generator';
import { layToi } from '../api.js';
import { dungTai } from '../dungTai.js';
import { cheSdt } from '../dinhDang.js';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';

// QR thành viên: vẽ từ `qr` của GET /toi (VeQR dùng lại cho QR trả tiền ở Theo dõi đơn). Không có `qr` → không vẽ (không bịa mã). Demo chỉ có nút QR (chưa vẽ màn này): dựng bằng khối của demo.
export function VeQR({ noiDung, nhan = 'Mã QR thành viên' }) {
  const o = useMemo(() => {
    const q = qrcode(0, 'M');
    q.addData(noiDung);
    q.make();
    const n = q.getModuleCount();
    const dam = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) dam.push(`M${c} ${r}h1v1h-1z`);
    return { n, d: dam.join('') };
  }, [noiDung]);
  const bien = 2;
  return (
    <svg viewBox={`${-bien} ${-bien} ${o.n + bien * 2} ${o.n + bien * 2}`} role="img" aria-label={nhan} shapeRendering="crispEdges">
      <path d={o.d} fill="#000" />
    </svg>
  );
}

export default function ManQR({ lui }) {
  const tai = dungTai(layToi);
  return (
    <Man id="member">
      <DauManCon tieuDe="Mã thành viên" lui={lui} />
      <TrangTai tai={tai}>
        {({ khach }) => (
          <>
            {khach.qr ? <div className="khung-qr"><VeQR noiDung={String(khach.qr)} /></div> : <div className="empty-note">Chưa có mã QR. Thử lại sau.</div>}
            {cheSdt(khach.sdt) && <div className="qr-sdt">{cheSdt(khach.sdt)}</div>}
            <div className="care-disclaimer qr-chu">Đưa mã này cho nhân viên quầy</div>
          </>
        )}
      </TrangTai>
    </Man>
  );
}
