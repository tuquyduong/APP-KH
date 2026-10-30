import { useSyncExternalStore } from 'react';

/** Kho nhỏ dùng chung giữa các màn: { lay, dat, dangKy }. Hàm thuần, không đụng DOM (React chỉ ở `dungKho`). */
export function taoKho(dau = null) {
  let gia = dau;
  const nghe = new Set();
  return {
    lay: () => gia,
    dat: (v) => { gia = v; nghe.forEach((f) => f()); },
    dangKy: (f) => { nghe.add(f); return () => nghe.delete(f); },
  };
}

/** Màn đọc kho: vẽ lại khi giá trị đổi. */
export const dungKho = (kho) => useSyncExternalStore(kho.dangKy, kho.lay);
