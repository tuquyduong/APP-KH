import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../giaoDien/gio_xoa.css';

const GIAY_HOAN_TAC = 5000; // "Đã xong … · Hoàn tác" hiện ngần này mili-giây

/** Thông báo nổi có nút "Hoàn tác" (khuôn `.toast.co-nut`). `chu` rỗng = không hiện; hết giờ gọi `het`. */
export default function ThongBaoHoanTac({ chu, hoanTac, het }) {
  useEffect(() => {
    if (!chu) return undefined;
    const h = setTimeout(het, GIAY_HOAN_TAC);
    return () => clearTimeout(h);
  }, [chu]);
  if (!chu || typeof document === 'undefined') return null;
  return createPortal(<div className="toast show wrap co-nut" role="status">{chu} · <button type="button" onClick={hoanTac}>Hoàn tác</button></div>, document.querySelector('.phone') || document.body);
}
