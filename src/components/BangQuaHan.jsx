import { useState } from 'react';
import BangNoi from './BangNoi.jsx';
import HoiXoa from './HoiXoa.jsx';
import { xoaViec } from '../kehoach.js';
import { quaHan, chuoiJd, dm, dmNgan, jd, doiNgayViec, doiHetSangNay, raSoatDen, tickLan } from '../kehoachLap.js';

// Bảng "Việc quá hạn chưa làm" (KH-UI-5c D2): mỗi việc một thẻ, xử lý ngay tại chỗ. Việc lặp: "Đã làm" / "Đánh dấu cả N lần" / "Bỏ qua lần này";
// chỉ việc không lặp và "sau khi xong" mới dời được sang hôm nay / mai (dời việc lặp sẽ làm lệch cả chuỗi).
function Dong({ q, homNay, lam, bang }) {
  const [hoiXoa, datHoiXoa] = useState(false);
  const { v, lan, soLan } = q, cuoi = lan[soLan - 1], h = jd(homNay), dem = h - cuoi;
  const mo = soLan > 1 ? `Lỡ ${soLan} lần · từ ${dmNgan(lan[0])} đến ${dmNgan(cuoi)}` : `Quá ${dem} ngày · ${dmNgan(cuoi)}${v.gio ? ' · ' + v.gio : ''}`;
  const dem2 = (n) => chuoiJd(h + n);
  const danhDau = (j) => lam(tickLan(bang, v.id, chuoiJd(j), homNay), `Đã làm ${v.tieu}`);
  const dichSau = !v.lap || v.lap.k === 'sau';
  return (
    <div className="qh-the">
      <b>{v.tieu}{v.lap ? ' ↻' : ''}</b><small>{mo}</small>
      <div className="qh-nut">
        {!v.lap && <button type="button" onClick={() => lam(tickLan(bang, v.id, v.ngay, homNay), `Đã xong ${v.tieu}`)}>✓ Xong</button>}
        {v.lap && v.lap.k === 'sau' && <button type="button" onClick={() => lam(tickLan(bang, v.id, v.ngay, homNay), `Đã xong ${v.tieu}`)}>✓ Đã làm</button>}
        {v.lap && v.lap.k !== 'sau' && (soLan > 1
          ? <button type="button" onClick={() => lam(raSoatDen(bang, v.id, homNay), `Đã đánh dấu ${soLan} lần ${v.tieu}`)}>✓ Đánh dấu cả {soLan} lần</button>
          : <button type="button" onClick={() => danhDau(cuoi)}>✓ Đã làm</button>)}
        {v.lap && v.lap.k !== 'sau' && soLan > 1 && <button type="button" onClick={() => danhDau(cuoi)}>Bỏ qua lần này</button>}
        {dichSau && <button type="button" onClick={() => lam(doiNgayViec(bang, v.id, dem2(0)), `Đã dời sang hôm nay: ${v.tieu}`)}>→ Hôm nay</button>}
        {dichSau && <button type="button" onClick={() => lam(doiNgayViec(bang, v.id, dem2(1)), `Đã dời sang mai: ${v.tieu}`)}>→ Mai</button>}
        {!hoiXoa && <button type="button" onClick={() => datHoiXoa(true)}>Xoá</button>}
      </div>
      {hoiXoa && <HoiXoa tieu={v.tieu} lap={!!v.lap && v.lap.k !== 'sau'} xoa={() => lam(xoaViec(bang, v.id), `Đã xoá «${v.tieu}»`)} huy={() => datHoiXoa(false)} />}
    </div>
  );
}

export default function BangQuaHan({ homNay, bang, lam, dong }) {
  const ds = quaHan(bang, homNay), thuong = ds.filter((q) => !q.v.lap);
  return (
    <BangNoi tieuDe="Việc quá hạn chưa làm" phu={ds.length ? `${ds.length} việc · hôm nay ${dm(jd(homNay), null).replace(/\/\d{4}$/, '')}` : ''} dong={dong} nhan="Việc quá hạn">
      {ds.length === 0
        ? <div className="empty-note">✓ Đã rà soát xong — không còn việc quá hạn</div>
        : (
          <>
            {thuong.length >= 2 && (
              <button type="button" className="bn-them-nut qh-het" onClick={() => { const r = doiHetSangNay(bang, homNay); lam(r.bang, `Đã dời ${r.so} việc sang hôm nay`); }}>Dời cả {thuong.length} việc sang hôm nay</button>
            )}
            {ds.map((q) => <Dong key={q.v.id} q={q} homNay={homNay} bang={bang} lam={lam} />)}
          </>
        )}
    </BangNoi>
  );
}
