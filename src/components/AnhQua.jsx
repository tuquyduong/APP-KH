import { ndDau } from '../noiDung/nd.js';
import { Med } from './BieuTuong.jsx';

/** Ảnh quà / phiếu quà (KH-DOI-1): `anh` POS (https — doiQua.js đã lọc) hoặc huy hiệu theo loại (voucher → vé, hiện vật → hộp quà). */
export default function AnhQua({ anh, loai, s = 44 }) {
  return anh ? <img src={anh} alt="" width={s} height={s} loading="lazy" {...ndDau('dq.pos')} /> : <Med ten={loai === 'voucher' ? 'ticket' : 'gift'} s={s} />;
}
