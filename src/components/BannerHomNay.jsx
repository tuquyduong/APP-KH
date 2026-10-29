import { useEffect, useRef } from 'react';

// Banner khuyến mãi "Hôm nay" (demo todayCard, bản trên ảnh thật): chữ lấy từ noiDung/trangChu.js. Không hiện ngày vì chưa có giờ POS (bay_gio — KH-API-2 v2).
// Ánh sáng lướt chéo (demo glMeasure): đo toạ độ chữ trong thẻ để CSS tính vệt sáng; đo lại khi đổi cỡ màn.
export default function BannerHomNay({ anh, tieuDe, phu, nut, chon }) {
  const the = useRef(null);

  useEffect(() => {
    const t = the.current;
    if (!t) return undefined;
    const dat = (e, k, v) => e.style.setProperty(k, v);
    const do_ = () => {
      const r = t.getBoundingClientRect();
      if (!r.width) return;
      dat(t, '--W', r.width); dat(t, '--H', r.height);
      const sang = t.querySelector('.gl-a');
      if (sang) Object.assign(sang.style, { left: '0px', top: '0px', width: `${r.width}px`, height: `${r.height}px` });
      t.querySelectorAll('.gl').forEach((e) => {
        const q = e.getBoundingClientRect();
        dat(e, '--ox', q.left - r.left); dat(e, '--oy', q.top - r.top); dat(e, '--w', q.width); dat(e, '--h', q.height);
      });
    };
    do_();
    const theo = typeof ResizeObserver === 'function' ? new ResizeObserver(do_) : null;
    if (theo) theo.observe(t); else window.addEventListener('resize', do_);
    return () => { if (theo) theo.disconnect(); else window.removeEventListener('resize', do_); };
  }, [tieuDe, phu, nut]);

  return (
    <div className="today fx-a photo" ref={the} role="button" tabIndex={0} onClick={chon} onKeyDown={(e) => { if (e.key === 'Enter') chon(); }}>
      <div className="t-bg"><img className="t-img" src={anh} alt="" /></div>
      <div className="t-shade" />
      <i className="gl gl-a" />
      <div className="t-txt">
        <div className="t-k gl gl-t"><span className="dot" />HÔM NAY</div>
        <b className="gl gl-t">{tieuDe}</b>
        {phu && <span className="t-s gl gl-t">{phu}</span>}
      </div>
      {nut && <span className="t-cta gl gl-b">{nut}</span>}
    </div>
  );
}
