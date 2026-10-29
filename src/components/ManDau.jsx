import { useEffect, useState } from 'react';

// Màn mở "Mái đình" (demo patch18): chỉ lần mở đầu mỗi phiên trình duyệt, chạm để bỏ qua. Không âm thanh.
const KHOA = 'kh_da_xem_man_dau';
const DA_XEM = () => { try { return sessionStorage.getItem(KHOA) === '1'; } catch { return false; } };
const GHI_DA_XEM = () => { try { sessionStorage.setItem(KHOA, '1'); } catch { /* không ghi được thì lần sau hiện lại */ } };
const GIAY_HIEN = 4200;
const GIAY_HIEN_GIAM_CHUYEN_DONG = 1200;

const NET_MAI = [
  ['r1', 'M132 30H168C194 44 224 54 258 58c3-6 2-12-4-16', 1.4], ['r1', 'M132 30H96C70 44 40 54 6 58c-3-6-2-12 4-16', 1.4],
  ['r2', 'M132 40H160C184 52 212 62 244 66', 1, 0.6], ['r2', 'M132 40H104C80 52 52 62 20 66', 1, 0.6],
  ['r3', 'M96 30h72', 2.2], ['r4', 'M60 52v14M84 42v16M108 34v14M132 34v14M156 34v14M180 42v16M204 52v14', 0.8, 0.45],
  ['r5', 'M132 74H234M132 74H30', 1], ['r5', 'M132 80H224M132 80H40', 0.8, 0.5], ['r6', 'M112 30c4-8 12-10 20-10s16 2 20 10', 1],
];

export default function ManDau() {
  const [hien, datHien] = useState(() => !DA_XEM());
  const [an, datAn] = useState(false);

  useEffect(() => {
    if (!hien) return undefined;
    const giam = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => datAn(true), giam ? GIAY_HIEN_GIAM_CHUYEN_DONG : GIAY_HIEN);
    return () => clearTimeout(t);
  }, [hien]);

  useEffect(() => {
    if (!an) return undefined;
    GHI_DA_XEM();
    const t = setTimeout(() => datHien(false), 600);
    return () => clearTimeout(t);
  }, [an]);

  if (!hien) return null;
  return (
    <div className={`man-dau${an ? ' an' : ''}`} onClick={() => datAn(true)} role="presentation">
      <span className="vien" />
      <span className="mai">
        <svg viewBox="0 0 264 86" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {NET_MAI.map(([lop, d, dam, mo], i) => <path key={i} pathLength="1" className={lop} d={d} strokeWidth={dam} opacity={mo} />)}
          </g>
          <g className="ngoc"><circle cx="132" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" /><circle cx="132" cy="14" r="2.4" fill="currentColor" /></g>
        </svg>
      </span>
      <span className="cot trai" /><span className="cot phai" />
      <button className="bo-qua" onClick={(e) => { e.stopPropagation(); datAn(true); }}>Bỏ qua ›</button>
      <div className="thuong-hieu">
        <div className="bieu-tuong"><img src="/anh/logo-bieu-tuong.webp" alt="" /></div>
        <img className="chu-thuong-hieu" src="/anh/logo-chu.webp" alt="Tứ Quý Đường" />
        <div className="khau-hieu">Sức khỏe mỗi ngày</div>
      </div>
      <div className="tien-trinh"><i /></div>
    </div>
  );
}
