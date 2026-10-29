import { useCallback, useEffect, useState } from 'react';

// Ngăn xếp "màn con" (trang món, QR, đơn…) không router: mỗi màn con đẩy một mục vào lịch sử trình duyệt
// để nút Back của điện thoại quay về màn trước thay vì thoát app. `history.state.kh` = độ sâu ngăn xếp.
export function dungNganXep() {
  const [ngan, datNgan] = useState([]);

  useEffect(() => {
    if (history.state && history.state.kh) history.replaceState(null, '');
    const khiLui = (e) => {
      const sau = (e.state && e.state.kh) || 0;
      datNgan((n) => (sau < n.length ? n.slice(0, sau) : n));
    };
    window.addEventListener('popstate', khiLui);
    return () => window.removeEventListener('popstate', khiLui);
  }, []);

  const mo = useCallback((man) => {
    history.pushState({ kh: ngan.length + 1 }, '');
    datNgan([...ngan, man]);
  }, [ngan]);
  const lui = useCallback(() => history.back(), []);
  const veDau = useCallback(() => { if (ngan.length) history.go(-ngan.length); }, [ngan]);

  return { man: ngan[ngan.length - 1] || null, mo, lui, veDau };
}
