import { useEffect } from 'react';

// Bộ đo ánh sáng lướt (demo glMeasure) — MỘT chỗ cho banner Trang chủ và dải quảng cáo: đặt --W, --H trên thẻ `.fx-a`, phủ `.gl-a` đúng cả thẻ,
// mỗi `.gl` có --ox --oy --w --h để CSS demo tính vệt sáng đi qua đúng chữ. Đo lại khi đổi cỡ và khi chữ đổi (`phuThuoc`).
export function dungAnhSangLuot(the, phuThuoc) {
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
  }, phuThuoc); // eslint-disable-line react-hooks/exhaustive-deps
}
