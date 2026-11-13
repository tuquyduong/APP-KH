import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Ico } from './BieuTuong.jsx';
import { nd, ndDau } from '../noiDung/nd.js';
import '../giaoDien/bang_ngay.css';

const NGUONG_VUOT = 80; // kéo xuống quá ngần này px rồi thả = đóng

/**
 * Khuôn "bảng nổi từ dưới lên" (KH-UI-5c): dùng chung cho bảng việc của ngày và bảng việc quá hạn. Dựng trên `.sheet` / `.panel` của demo.
 * Đóng bằng ✕, vuốt (kéo thanh đầu) xuống, chạm nền mờ, phím Esc.
 */
export default function BangNoi({ tieuDe, phu, dong, nhan, children }) {
  const diem = useRef(null);
  const [dy, datDy] = useState(0);
  useEffect(() => {
    const phim = (e) => { if (e.key === 'Escape') dong(); };
    document.addEventListener('keydown', phim);
    return () => document.removeEventListener('keydown', phim);
  }, [dong]);
  const bat = (e) => { diem.current = e.clientY; if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId); };
  const keo = (e) => { if (diem.current !== null) datDy(Math.max(0, e.clientY - diem.current)); };
  const tha = () => { if (diem.current === null) return; diem.current = null; if (dy > NGUONG_VUOT) dong(); else datDy(0); };
  const noi = (
    <div className="sheet show bang-noi" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) dong(); }}>
      <div className="panel" role="dialog" aria-modal="true" aria-label={nhan || tieuDe} style={dy ? { transform: `translateY(${dy}px)`, transition: 'none' } : undefined}>
        <div className="bn-dau" onPointerDown={bat} onPointerMove={keo} onPointerUp={tha} onPointerCancel={tha}>
          <div className="bn-keo" />
          <div className="bn-tieu">
            <div style={{ flex: 1, minWidth: 0 }}><h3>{tieuDe}</h3>{phu && <small>{phu}</small>}</div>
            <button type="button" className="bn-x" aria-label={nd('kh.dongHang')} {...ndDau('kh.dongHang')} onClick={dong} onPointerDown={(e) => e.stopPropagation()}><Ico ten="close" s={14} /></button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
  return typeof document === 'undefined' ? noi : createPortal(noi, document.querySelector('.phone') || document.body);
}
