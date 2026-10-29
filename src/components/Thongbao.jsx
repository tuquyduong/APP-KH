import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const DAI = 42; // demo toast(): chữ dài hơn ngần này ký tự thì xuống dòng và hiện lâu hơn

/** Thông báo nổi ngắn như demo (.toast). `chu` rỗng = không hiện; hết giờ gọi `het`. */
export default function Thongbao({ chu, het }) {
  useEffect(() => {
    if (!chu) return undefined;
    const h = setTimeout(het, chu.length > DAI ? 4200 : 1800);
    return () => clearTimeout(h);
  }, [chu]);
  if (!chu || typeof document === 'undefined') return null;
  return createPortal(<div className={`toast show${chu.length > DAI ? ' wrap' : ''}`} role="status">{chu}</div>, document.querySelector('.phone') || document.body);
}
