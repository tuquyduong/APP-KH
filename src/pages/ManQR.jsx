import { useEffect, useMemo } from 'react';
import qrcode from 'qrcode-generator';
import { dungCua, cuaToi } from '../duLieuKhach.js';
import { cheSdt } from '../dinhDang.js';
import { nd, ndDau } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';

const VIEN_QUET = 4; // viền trắng quanh mã ở màn Mã thành viên (≥ 4 ô — POS QUET-1: quầy quét bằng camera trước của máy tính bảng)

/** Giữ màn không tắt khi đang mở Mã thành viên (Screen Wake Lock): xin lại khi quay lại tab, thả khi rời màn. Trình duyệt không có / từ chối → thôi, không báo lỗi. */
function dungGiuManSang() {
  useEffect(() => {
    let khoa = null, het = false;
    const xin = () => {
      if (het || khoa || !navigator.wakeLock || document.visibilityState !== 'visible') return;
      navigator.wakeLock.request('screen').then((k) => { if (het) { k.release().catch(() => {}); } else { khoa = k; k.addEventListener('release', () => { if (khoa === k) khoa = null; }); } }, () => {});
    };
    xin();
    document.addEventListener('visibilitychange', xin);
    return () => { het = true; document.removeEventListener('visibilitychange', xin); if (khoa) khoa.release().catch(() => {}); };
  }, []);
}

// QR thành viên: vẽ từ `qr` của GET /toi (VeQR vẽ mã QR từ một chuỗi; chỉ màn này dùng). Không có `qr` → không vẽ (không bịa mã). Demo chỉ có nút QR (chưa vẽ màn này): dựng bằng khối của demo.
// `vien` = độ rộng viền trắng quanh mã (số ô mã): mặc định 2; màn Mã thành viên truyền VIEN_QUET.
export function VeQR({ noiDung, nhan = nd('mqr.aria'), vien = 2 }) {
  const o = useMemo(() => {
    const q = qrcode(0, 'M');
    q.addData(noiDung);
    q.make();
    const n = q.getModuleCount();
    const dam = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) dam.push(`M${c} ${r}h1v1h-1z`);
    return { n, d: dam.join('') };
  }, [noiDung]);
  const bien = vien; // viền trắng quanh mã, tính bằng ô mã (Mã thành viên cần rộng hơn để quầy quét nhanh)
  return (
    <svg viewBox={`${-bien} ${-bien} ${o.n + bien * 2} ${o.n + bien * 2}`} role="img" aria-label={nhan} shapeRendering="crispEdges">
      <path d={o.d} fill="#000" />
    </svg>
  );
}

export default function ManQR({ lui }) {
  dungGiuManSang();
  const tai = dungCua(cuaToi, { that: true }); // cần `qr` thật: bản tóm tắt trên máy không có
  return (
    <Man id="member">
      <DauManCon tieuDe={nd('mqr.tieuDe')} lui={lui} />
      <TrangTai tai={tai}>
        {({ khach }) => (
          <>
            {khach.qr ? <div className="khung-qr" {...ndDau('mqr.ma')}><VeQR noiDung={String(khach.qr)} vien={VIEN_QUET} /></div> : <Chu k="mqr.chua" as="div" className="empty-note" />}
            {cheSdt(khach.sdt) && <div className="qr-sdt" {...ndDau('mqr.ma')}>{cheSdt(khach.sdt)}</div>}
            <Chu k="mqr.dua" as="div" className="care-disclaimer qr-chu" />
            {khach.qr && <Chu k="mqr.sang" as="div" className="care-disclaimer qr-chu qr-sang" />}
          </>
        )}
      </TrangTai>
    </Man>
  );
}
