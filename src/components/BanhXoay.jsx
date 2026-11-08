import { useEffect, useRef } from 'react';

// Bánh xoay (KH-UI-5c): cột số vuốt được, dừng ở dòng giữa; phím ↑ ↓ cũng đổi. Không dùng ô giờ AM/PM của trình duyệt.
const CAO = 36; // px mỗi dòng (khớp .bx-cot trong bang_ngay.css)
const pad = (n) => String(n).padStart(2, '0');
export const DS_GIO = Array.from({ length: 24 }, (_, i) => pad(i));
export const DS_PHUT = Array.from({ length: 12 }, (_, i) => pad(i * 5));
export const DS_NGAY = Array.from({ length: 31 }, (_, i) => String(i));

function Cot({ ds, gtri, doi, nhan }) {
  const ref = useRef(null), hen = useRef(0);
  const chi = Math.max(0, ds.indexOf(gtri));
  useEffect(() => { const e = ref.current; if (e && Math.round(e.scrollTop / CAO) !== chi) e.scrollTop = chi * CAO; }, [chi]);
  useEffect(() => () => clearTimeout(hen.current), []);
  const khiCuon = (e) => {
    const t = e.currentTarget;
    clearTimeout(hen.current);
    hen.current = setTimeout(() => { const x = ds[Math.min(ds.length - 1, Math.max(0, Math.round(t.scrollTop / CAO)))]; if (x !== gtri) doi(x); }, 90);
  };
  const phim = (e) => {
    const b = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
    if (b) { e.preventDefault(); doi(ds[Math.min(ds.length - 1, Math.max(0, chi + b))]); }
  };
  return (
    <div className="bx-cot" ref={ref} tabIndex={0} role="spinbutton" aria-label={nhan} aria-valuetext={gtri} onScroll={khiCuon} onKeyDown={phim}>
      {ds.map((x) => <div key={x} className={x === gtri ? 'on' : ''} onClick={() => doi(x)}>{x}</div>)}
    </div>
  );
}

/** Giờ sự kiện: giờ 00–23 : phút 00–55 (bước 5). `gio` = 'HH:mm'; `doi('HH:mm')`. */
export function BanhGio({ gio, doi }) {
  const g = gio.slice(0, 2), p = pad((Math.round(+gio.slice(3) / 5) * 5) % 60);
  return <div className="bx"><Cot ds={DS_GIO} gtri={g} doi={(x) => doi(`${x}:${p}`)} nhan="Giờ" /><b>:</b><Cot ds={DS_PHUT} gtri={p} doi={(x) => doi(`${g}:${x}`)} nhan="Phút" /></div>;
}

/** Hẹn giờ nhắc khác: [0–30] ngày trước · lúc giờ : phút. `k` = { ngay, g }; `doi({ ngay, g })`. */
export function BanhNhac({ k, doi }) {
  const g = k.g.slice(0, 2), p = pad((Math.round(+k.g.slice(3) / 5) * 5) % 60), n = String(k.ngay);
  return (
    <div className="bx">
      <Cot ds={DS_NGAY} gtri={n} doi={(x) => doi({ ngay: +x, g: k.g })} nhan="Số ngày trước" /><span>ngày trước · lúc</span>
      <Cot ds={DS_GIO} gtri={g} doi={(x) => doi({ ngay: k.ngay, g: `${x}:${p}` })} nhan="Giờ nhắc" /><b>:</b>
      <Cot ds={DS_PHUT} gtri={p} doi={(x) => doi({ ngay: k.ngay, g: `${g}:${x}` })} nhan="Phút nhắc" />
    </div>
  );
}
