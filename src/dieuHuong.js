import { useCallback, useEffect, useRef, useState } from 'react';

/** Vị trí cuộn khi đổi màn: quay LẠI Menu từ màn con (món…) → vị trí đã lưu; mọi trường hợp khác (đổi tab, mở màn con) → về đầu. */
export function viTriCuonKhiDoiMan({ tab, coManCon, quayLaiMenu, daLuu }) {
  return tab === 'menu' && !coManCon && quayLaiMenu ? daLuu : 0;
}

// Ngăn xếp "màn con" (trang món, QR, đơn…) không router: mỗi màn con đẩy một mục vào lịch sử trình duyệt
// để nút Back của điện thoại quay về màn trước thay vì thoát app. `history.state.kh` = độ sâu ngăn xếp.
export function dungNganXep() {
  const [ngan, datNgan] = useState([]);
  const sau = useRef(0); // độ sâu thật — chạm đúp nhanh không đẩy hai mục cùng độ sâu

  useEffect(() => {
    if (history.state && history.state.kh) history.replaceState(null, '');
    const khiLui = (e) => {
      sau.current = (e.state && e.state.kh) || 0;
      datNgan((n) => (sau.current < n.length ? n.slice(0, sau.current) : n));
    };
    window.addEventListener('popstate', khiLui);
    return () => window.removeEventListener('popstate', khiLui);
  }, []);

  const mo = useCallback((man) => {
    sau.current += 1;
    history.pushState({ kh: sau.current }, '');
    datNgan((n) => [...n.slice(0, sau.current - 1), man]);
  }, []);
  const lui = useCallback(() => history.back(), []);
  // Đặt độ sâu về 0 NGAY (popstate tới sau): gọi lặp (401 dồn dập + bấm tab) không lùi quá tay, không thoát khỏi app.
  const veDau = useCallback(() => { const n = sau.current; if (n) { sau.current = 0; history.go(-n); } }, []);

  return { man: ngan[ngan.length - 1] || null, mo, lui, veDau };
}
