// Bộ biểu tượng của demo: các <symbol> SVG nằm trong index.html (chép từ demo, chỉ giữ cái app dùng).
//   Ico = nét đơn (i-…), Med = huy hiệu tròn (m-…), En = men / tranh tròn (p-…). Không vẽ biểu tượng mới.
const bien = (lop, ten) => `#${lop}-${ten}`;

export function Ico({ ten, s = 18, lop = '' }) {
  return <svg className={`ico ${lop}`} width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><use href={bien('i', ten)} /></svg>;
}

export function Med({ ten, s = 24, lop = '' }) {
  return <svg className={`med ${lop}`} width={s} height={s} viewBox="0 0 64 64" aria-hidden="true"><use href={bien('m', ten)} /></svg>;
}

export function En({ ten, s = 44, lop = '' }) {
  return <svg className={`en ${lop}`} width={s} height={s} viewBox="0 0 64 64" aria-hidden="true"><use href={bien('p', ten)} /></svg>;
}
