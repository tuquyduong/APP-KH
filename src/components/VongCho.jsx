import { useEffect, useState } from 'react';
import { theoDoiDangCho } from '../api.js';
import { nd, ndDau } from '../noiDung/nd.js';
import '../giaoDien/cho.css';

// Vòng xoay chờ quán (KH-NHANH-2, kiểu B chủ quán chọn 18.11): gắn MỘT lần trong khung `.phone`. Hiện khi có lượt POS khách đang chờ quá MS_TRE_CHO (api.js đếm,
// lượt ngầm không tính), hết lượt → ẩn ngay. Chỉ hình tròn: không nền, không phủ mờ, không chặn bấm (pointer-events: none).
export default function VongCho() {
  const [hien, datHien] = useState(false);
  useEffect(() => theoDoiDangCho(datHien), []);
  if (!hien) return null;
  return <span className="cho-xoay to cho-giua" role="progressbar" aria-label={nd('khung.dangCho')} {...ndDau('khung.dangCho')} />;
}
