import { useEffect, useState } from 'react';
import { theoDoiDangCho } from '../api.js';
import { nd, ndDau } from '../noiDung/nd.js';

// Vòng xoay chờ quán (KH-NHANH-2, kiểu B chủ quán chọn 18.11): gắn MỘT lần trong khung `.phone`. Hiện khi có lượt POS khách đang chờ quá MS_TRE_CHO (api.js đếm,
// lượt ngầm không tính), hết lượt → ẩn ngay. Chỉ hình tròn: không nền, không phủ mờ, không chặn bấm (pointer-events: none).
// Màn mở (ManDau) đang hiện → không hiện vòng (chủ quán chọn b, 19.11); màn mở tắt thì vòng theo lượt chờ như cũ.
let manDauHien = false;
const ngheManDau = new Set();
export function baoManDau(h) { manDauHien = h; ngheManDau.forEach((f) => f(h)); }

export default function VongCho() {
  const [hien, datHien] = useState(false);
  const [manDau, datManDau] = useState(manDauHien);
  useEffect(() => theoDoiDangCho(datHien), []);
  useEffect(() => { ngheManDau.add(datManDau); datManDau(manDauHien); return () => { ngheManDau.delete(datManDau); }; }, []);
  if (!hien || manDau) return null;
  return <span className="cho-xoay to cho-giua" role="progressbar" aria-label={nd('khung.dangCho')} {...ndDau('khung.dangCho')} />;
}
