import { useEffect, useRef, useState } from 'react';
import { KHAU_HIEU } from '../noiDung/thuongHieu.js';

// Màn mở "Mái đình" (demo patch18–23): hiện ở lần mở đầu mỗi phiên trình duyệt, chạm hoặc "Bỏ qua" để vào app.
// Âm thanh của demo: nút "Bật âm thanh", MẶC ĐỊNH TẮT, nhớ lựa chọn trong phiên. prefers-reduced-motion → bỏ chuyển động.
const KHOA_DA_XEM = 'kh_da_xem_man_dau';
const KHOA_AM_THANH = 'kh_am_thanh_man_dau';
const doc = (khoa) => { try { return sessionStorage.getItem(khoa); } catch { return null; } };
const ghi = (khoa, gt) => { try { sessionStorage.setItem(khoa, gt); } catch { /* không ghi được thì lần sau hiện lại */ } };
const MS_TU_DONG_VAO = 5900;
const MS_TU_DONG_VAO_GIAM_CHUYEN_DONG = 1200;
const MS_CHU_HIEN_XONG = 4600;
const MS_MO_DAN = 600;
const GIAY_AM_TOI_DA = 4.5;
const AM_LUONG = 0.8;
const MS_NHOE_AM = 700;

export default function ManDau() {
  const [hien, datHien] = useState(() => doc(KHOA_DA_XEM) !== '1');
  const [an, datAn] = useState(false);
  const [chuXong, datChuXong] = useState(false);
  const [tat, datTat] = useState(() => doc(KHOA_AM_THANH) !== 'on');
  const [dangPhat, datDangPhat] = useState(false);
  const amThanh = useRef(null);
  const batDau = useRef(0);

  const phatAm = () => {
    const a = amThanh.current;
    if (!a) return;
    try { a.currentTime = Math.min((performance.now() - batDau.current) / 1000, GIAY_AM_TOI_DA); } catch { /* chưa tải xong */ }
    a.volume = AM_LUONG;
    const kq = a.play();
    if (kq && kq.then) kq.then(() => datDangPhat(true)).catch(() => {});
  };
  const dungAm = () => { const a = amThanh.current; if (a) a.pause(); datDangPhat(false); };

  const vao = () => {
    const a = amThanh.current;
    if (a && !a.paused) {
      const v0 = a.volume; const t0 = performance.now();
      const buoc = () => { const k = Math.min(1, (performance.now() - t0) / MS_NHOE_AM); a.volume = v0 * (1 - k); if (k < 1) requestAnimationFrame(buoc); else a.pause(); };
      buoc();
    }
    datAn(true);
  };

  useEffect(() => {
    if (!hien) return undefined;
    batDau.current = performance.now();
    const giam = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(vao, giam ? MS_TU_DONG_VAO_GIAM_CHUYEN_DONG : MS_TU_DONG_VAO);
    const t2 = setTimeout(() => datChuXong(true), MS_CHU_HIEN_XONG);
    if (!tat) phatAm();
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [hien]);

  useEffect(() => {
    if (!an) return undefined;
    ghi(KHOA_DA_XEM, '1');
    const t = setTimeout(() => datHien(false), MS_MO_DAN);
    return () => clearTimeout(t);
  }, [an]);

  if (!hien) return null;

  const doiAm = (e) => {
    e.stopPropagation();
    if (!tat && dangPhat) { datTat(true); ghi(KHOA_AM_THANH, 'off'); dungAm(); } else { datTat(false); ghi(KHOA_AM_THANH, 'on'); phatAm(); }
  };
  const lopAm = `e3-snd${tat ? ' muted' : ''}${dangPhat ? ' playing' : ''}`;
  const chu = (lop) => <span className={`e3-w ${lop}${chuXong ? ' done' : ''}`}><img src="/anh/logo-chu.webp" alt="" /></span>;

  return (
    <div className={`splash-screen e3s${an ? ' hide' : ''}`} id="splashOverlay" role="presentation" onClick={vao}>
      <span className="e3-roof">
        <svg viewBox="0 0 264 86" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path pathLength="1" className="r1" d="M132 30H168C194 44 224 54 258 58c3-6 2-12-4-16" strokeWidth="1.4" />
            <path pathLength="1" className="r1" d="M132 30H96C70 44 40 54 6 58c-3-6-2-12 4-16" strokeWidth="1.4" />
            <path pathLength="1" className="r2" d="M132 40H160C184 52 212 62 244 66" strokeWidth="1" opacity=".6" />
            <path pathLength="1" className="r2" d="M132 40H104C80 52 52 62 20 66" strokeWidth="1" opacity=".6" />
            <path pathLength="1" className="r3" d="M96 30h72" strokeWidth="2.2" />
            <path pathLength="1" className="r4" d="M60 52v14M84 42v16M108 34v14M132 34v14M156 34v14M180 42v16M204 52v14" strokeWidth=".8" opacity=".45" />
            <path pathLength="1" className="r5" d="M132 74H234M132 74H30" strokeWidth="1" />
            <path pathLength="1" className="r5" d="M132 80H224M132 80H40" strokeWidth=".8" opacity=".5" />
            <path pathLength="1" className="r6" d="M112 30c4-8 12-10 20-10s16 2 20 10" strokeWidth="1" />
          </g>
          <g className="pearl"><circle cx="132" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" /><circle cx="132" cy="14" r="2.4" fill="currentColor" /></g>
        </svg>
      </span>
      <span className="e3-col l" /><span className="e3-col r" />
      <button type="button" className="e3-skip" id="skipBtn" onClick={(e) => { e.stopPropagation(); vao(); }}>Bỏ qua ›</button>
      <div className={lopAm} id="sndBtn" role="button" tabIndex={0} aria-label="Âm thanh" onClick={doiAm} onKeyDown={(e) => { if (e.key === 'Enter') doiAm(e); }}>
        <svg className="on" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" fillOpacity=".25" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></g></svg>
        <svg className="off" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" fillOpacity=".25" /><path d="M16 9.5l5 5M21 9.5l-5 5" /></g></svg>
        <span>Bật âm thanh</span>
      </div>
      <audio ref={amThanh} preload="none" src="/am_thanh/man_dau.mp3" />
      <div className="e3-brand">
        <div className="e3-em"><img src="/anh/logo-bieu-tuong.webp" alt="" /></div>
        <div className="e3-tw" role="img" aria-label="Tứ Quý Đường">{chu('w1')}{chu('w2')}{chu('w3')}</div>
        <div className="e3-dv" aria-hidden="true"><i /><b /><i /></div>
        <div className="e3-tg">{KHAU_HIEU}</div>
      </div>
      <div className="e3-prog"><i /></div>
      <div className="e3-veil" />
    </div>
  );
}
