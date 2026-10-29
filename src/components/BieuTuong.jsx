// Bộ biểu tượng của demo: các <symbol> SVG nằm trong index.html (chép từ demo, chỉ giữ cái app dùng).
//   Ico = nét đơn (i-…), Med = huy hiệu tròn (m-…), En = men / tranh tròn (p-…). Không vẽ biểu tượng mới.
const bien = (lop, ten) => `#${lop}-${ten}`;

// Biểu tượng nét đơn của demo chưa có trong bộ <symbol> của index.html (chép nguyên <symbol> của demo), dùng qua IcoVe.
const ICO_NHUNG = {
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

export function En({ ten, s = 44, lop = '' }) {
  return <svg className={`en ${lop}`} width={s} height={s} viewBox="0 0 64 64" aria-hidden="true"><use href={bien('p', ten)} /></svg>;
}
