import { nd, ndDau } from '../noiDung/nd.js';

/** Hỏi lại MỘT lần ngay tại chỗ khi xoá một việc (hoặc một người thân — `loai`; KH-UI-5d C1, KH-UI-5e B2; không dùng hộp thoại của trình duyệt, không Hoàn tác). `lap` = việc lặp. */
export default function HoiXoa({ tieu, lap, xoa, huy, loai }) {
  const khoa = lap ? 'hx.lap' : 'hx.thuong';
  return (
    <div className="hoi-xoa" role="alertdialog" aria-label={nd('hx.aria')}>
      <div {...ndDau(khoa)}>{nd(khoa, { tieu, loai: loai ?? nd('hx.loaiViec') })}</div>
      <div className="bn-cuoi"><button type="button" className="bn-phu" onClick={huy} {...ndDau('hx.huy')}>{nd('hx.huy')}</button><button type="button" className="bn-phu bn-xoa" onClick={xoa} {...ndDau('hx.xoa')}>{nd('hx.xoa')}</button></div>
    </div>
  );
}
