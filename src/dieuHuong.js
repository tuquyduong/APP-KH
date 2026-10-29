import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { docDuongDan } from './duongDan.js';

/** Vị trí cuộn khi đổi màn: quay LẠI Menu từ màn con (món…) → vị trí đã lưu; mọi trường hợp khác (đổi tab, mở màn con) → về đầu. */
export function viTriCuonKhiDoiMan({ tab, coManCon, quayLaiMenu, daLuu }) {
  return tab === 'menu' && !coManCon && quayLaiMenu ? daLuu : 0;
}

// Bộ định tuyến gọn bằng History API (không thư viện): địa chỉ trên thanh trình duyệt LÀ trạng thái điều hướng. Bảng đường dẫn ở duongDan.js.
// `history.state.kh` = số bước đã đẩy trong app: > 0 thì Back quay về trang trước của app, = 0 (mở thẳng) thì Back về trang cha, không thoát app.
const diaChiHienTai = () => window.location.pathname + window.location.search;
const soBuoc = () => (window.history.state && window.history.state.kh) || 0;

export function dungDuongDan() {
  const [diaChi, datDiaChi] = useState(diaChiHienTai);
  useEffect(() => {
    const khiLui = () => datDiaChi(diaChiHienTai());
    window.addEventListener('popstate', khiLui);
    return () => window.removeEventListener('popstate', khiLui);
  }, []);

  const di = useCallback((p) => {
    if (p === diaChiHienTai()) return;
    window.history.pushState({ kh: soBuoc() + 1 }, '', p);
    datDiaChi(diaChiHienTai());
  }, []);
  const thay = useCallback((p) => {
    window.history.replaceState({ kh: soBuoc() }, '', p);
    datDiaChi(diaChiHienTai());
  }, []);
  const lui = useCallback((veNeuHet) => (soBuoc() > 0 ? window.history.back() : thay(veNeuHet)), [thay]);

  const duong = useMemo(() => docDuongDan(diaChi), [diaChi]);
  // Địa chỉ chưa chuẩn ("/", "/Menu/", "/admin") → thay bằng dạng chuẩn, không thêm lịch sử.
  useLayoutEffect(() => { if (duong.chuan !== diaChi) thay(duong.chuan); }, [duong, diaChi, thay]);

  return { duong, di, thay, lui };
}
