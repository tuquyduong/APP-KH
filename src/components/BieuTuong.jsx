// Bộ biểu tượng của demo: các <symbol> SVG nằm trong index.html (chép từ demo, chỉ giữ cái app dùng).
//   Ico = nét đơn (i-…), Med = huy hiệu tròn (m-…), En = men / tranh tròn (p-…). Không vẽ biểu tượng mới.
const bien = (lop, ten) => `#${lop}-${ten}`;

// Biểu tượng nét đơn của demo chưa có trong bộ <symbol> của index.html (chép nguyên <symbol> của demo), dùng qua IcoVe.
const ICO_NHUNG = {
  bolt: (
    <>
      <path className="tq-d" d="M13.2 3.4 5.4 13.2h5.6l-1 7.4 8.6-10.4h-5.6z" /><path className="tq-s" d="M13.2 3.4 5.4 13.2h5.6l-1 7.4 8.6-10.4h-5.6z" />
    </>
  ),
  clock: (
    <>
      <circle className="tq-d" cx="12" cy="12" r="8.6" /><circle className="tq-s" cx="12" cy="12" r="8.6" /><path className="tq-s" d="M12 7.6V12l3 2" />
    </>
  ),
  crown: (
    <>
      <path className="tq-d" d="M4 17.6 5.4 8.4l4.6 4.2L12 6l2 6.6 4.6-4.2L20 17.6z" /><path className="tq-s" d="M4 17.6 5.4 8.4l4.6 4.2L12 6l2 6.6 4.6-4.2L20 17.6z" /><path className="tq-g" d="M4.6 20.2h14.8" />
    </>
  ),
  sparkle: (
    <>
      <path className="tq-d" d="M11 3.6l1.7 5 5 1.7-5 1.7-1.7 5-1.7-5-5-1.7 5-1.7z" /><path className="tq-s" d="M11 3.6l1.7 5 5 1.7-5 1.7-1.7 5-1.7-5-5-1.7 5-1.7z" /><path className="tq-g" d="M18.4 15.4v3.6M16.6 17.2h3.6" />
    </>
  ),
  help: (
    <>
      <circle className="tq-d" cx="12" cy="12" r="8.6" /><circle className="tq-s" cx="12" cy="12" r="8.6" /><path className="tq-s" d="M9.6 9.6a2.5 2.5 0 114 1.9c-.9.7-1.6 1.1-1.6 2.3" /><circle className="tq-f" cx="12" cy="16.8" r="0.95" />
    </>
  ),
};

export function Ico({ ten, s = 18, lop = '' }) {
  return <svg className={`ico ${lop}`} width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><use href={bien('i', ten)} /></svg>;
}

/** Biểu tượng nét đơn vẽ thẳng (không qua sprite): chỉ những cái trong ICO_NHUNG. */
export function IcoVe({ ten, s = 18, lop = '' }) {
  return <svg className={`ico ${lop}`} width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">{ICO_NHUNG[ten]}</svg>;
}

export function Med({ ten, s = 24, lop = '' }) {
  return <svg className={`med ${lop}`} width={s} height={s} viewBox="0 0 64 64" aria-hidden="true"><use href={bien('m', ten)} /></svg>;
}

const DEN_LONG = 'M32 19C42 19 45 25 45 31C45 37 42 43 32 43C22 43 19 37 19 31C19 25 22 19 32 19Z';
const VIEN_LONG = { stroke: '#8F6A24', strokeWidth: '.45', strokeLinejoin: 'round' };

/** Đèn lồng của Giờ vàng (demo p-lantern) vẽ thẳng — bộ <symbol> ở index.html (ngoài phạm vi KH-UI-3a) chưa có; dùng chung gradient e-* đã có ở đó. */
export function DenLong({ s = 44, lop = '' }) {
  const dem = { fill: '#4A3210', opacity: '.42', transform: 'translate(.6 .9)' };
  const hop = (d) => <g><path d={d} {...dem} /><path d={d} fill="url(#e-ink)" {...VIEN_LONG} /></g>;
  return (
    <svg className={`en ${lop}`} width={s} height={s} viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="61" rx="17" ry="2.3" fill="#3A2210" opacity=".16" /><circle cx="32" cy="31" r="29" fill="url(#e-peach)" /><circle cx="32" cy="31" r="29" fill="url(#e-shade)" />
      <ellipse cx="22" cy="13" rx="13" ry="6.5" fill="url(#e-gloss)" transform="rotate(-26 22 13)" /><path d="M7.5 24A25 25 0 0 1 27 6.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".5" />
      {hop(DEN_LONG)}
      <path d="M32 19V43M26 20Q22 31 26 42M38 20Q42 31 38 42" fill="none" stroke="#7A5518" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      {hop('M27.5 16.5H36.5V19.5H27.5Z')}{hop('M27.5 43H36.5V46H27.5Z')}
      <g><path d="M32 46V52M29.5 52h5" fill="none" stroke="#4A3210" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...dem} /><path d="M32 46V52M29.5 52h5" fill="none" stroke="url(#e-ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></g>
      <path d="M51 13.5l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#F7DE98" opacity=".95" /><circle cx="12.5" cy="46" r="1.2" fill="#F7DE98" opacity=".8" />
      <circle cx="32" cy="31" r="29.3" fill="none" stroke="url(#e-rim)" strokeWidth="2.4" /><circle cx="32" cy="31" r="26.7" fill="none" stroke="url(#e-rim)" strokeWidth=".6" opacity=".7" />
    </svg>
  );
}

export function En({ ten, s = 44, lop = '' }) {
  return <svg className={`en ${lop}`} width={s} height={s} viewBox="0 0 64 64" aria-hidden="true"><use href={bien('p', ten)} /></svg>;
}
