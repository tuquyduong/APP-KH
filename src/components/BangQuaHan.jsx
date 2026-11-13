import { useState } from 'react';
import BangNoi from './BangNoi.jsx';
import HoiXoa from './HoiXoa.jsx';
import { nd, ndPhan, ndDau } from '../noiDung/nd.js';
import { xoaViec } from '../kehoach.js';
import { quaHan, chuoiJd, dm, dmNgan, jd, doiNgayViec, doiHetSangNay, raSoatDen, tickLan } from '../kehoachLap.js';

// Bảng "Việc quá hạn chưa làm" (KH-UI-5c D2): mỗi việc một thẻ, xử lý ngay tại chỗ. Việc lặp: "Đã làm" / "Đánh dấu cả N lần" / "Bỏ qua lần này";
// chỉ việc không lặp và "sau khi xong" mới dời được sang hôm nay / mai (dời việc lặp sẽ làm lệch cả chuỗi).
function Dong({ q, homNay, lam, bang }) {
  const [hoiXoa, datHoiXoa] = useState(false);
  const { v, lan, soLan } = q, cuoi = lan[soLan - 1], h = jd(homNay), dem = h - cuoi;
  const mo = soLan > 1 ? nd('qh.lo', { so: soLan, tu: dmNgan(lan[0]), den: dmNgan(cuoi) }) : nd('qh.qua', { n: dem, ngay: dmNgan(cuoi), gio: v.gio ? ' · ' + v.gio : '' });
  const dem2 = (n) => chuoiJd(h + n);
  const danhDau = (j) => lam(tickLan(bang, v.id, chuoiJd(j), homNay), nd('qh.daLam', { tieu: v.tieu }));
  const dichSau = !v.lap || v.lap.k === 'sau';
  return (
    <div className="qh-the">
      <b>{v.tieu}{v.lap ? ' ↻' : ''}</b><small {...ndDau(soLan > 1 ? 'qh.lo' : 'qh.qua')}>{mo}</small>
      <div className="qh-nut">
        {!v.lap && <button type="button" onClick={() => lam(tickLan(bang, v.id, v.ngay, homNay), nd('kh.daXong', { tieu: v.tieu }))} {...ndDau('qh.nutXong')}>{nd('qh.nutXong')}</button>}
        {v.lap && v.lap.k === 'sau' && <button type="button" onClick={() => lam(tickLan(bang, v.id, v.ngay, homNay), nd('kh.daXong', { tieu: v.tieu }))} {...ndDau('qh.nutDaLam')}>{nd('qh.nutDaLam')}</button>}
        {v.lap && v.lap.k !== 'sau' && (soLan > 1
          ? <button type="button" onClick={() => lam(raSoatDen(bang, v.id, homNay), nd('qh.daDanhDau', { so: soLan, tieu: v.tieu }))} {...ndDau('qh.nutCaLan')}>{ndPhan('qh.nutCaLan', { so: soLan })}</button>
          : <button type="button" onClick={() => danhDau(cuoi)} {...ndDau('qh.nutDaLam')}>{nd('qh.nutDaLam')}</button>)}
        {v.lap && v.lap.k !== 'sau' && soLan > 1 && <button type="button" onClick={() => danhDau(cuoi)} {...ndDau('qh.boQua')}>{nd('qh.boQua')}</button>}
        {dichSau && <button type="button" onClick={() => lam(doiNgayViec(bang, v.id, dem2(0)), nd('qh.daDoiHom', { tieu: v.tieu }))} {...ndDau('qh.homNay')}>{nd('qh.homNay')}</button>}
        {dichSau && <button type="button" onClick={() => lam(doiNgayViec(bang, v.id, dem2(1)), nd('qh.daDoiMai', { tieu: v.tieu }))} {...ndDau('qh.mai')}>{nd('qh.mai')}</button>}
        {!hoiXoa && <button type="button" onClick={() => datHoiXoa(true)} {...ndDau('hx.xoa')}>{nd('hx.xoa')}</button>}
      </div>
      {hoiXoa && <HoiXoa tieu={v.tieu} lap={!!v.lap && v.lap.k !== 'sau'} xoa={() => lam(xoaViec(bang, v.id), nd('bn.daXoa', { tieu: v.tieu }))} huy={() => datHoiXoa(false)} />}
    </div>
  );
}

export default function BangQuaHan({ homNay, bang, lam, dong }) {
  const ds = quaHan(bang, homNay), thuong = ds.filter((q) => !q.v.lap);
  return (
    <BangNoi tieuDe={nd('qh.tieuDe')} phu={ds.length ? nd('qh.phu', { so: ds.length, ngay: dm(jd(homNay), null).replace(/\/\d{4}$/, '') }) : ''} dong={dong} nhan={nd('qh.nhan')}>
      {ds.length === 0
        ? <div className="empty-note" {...ndDau('qh.het')}>{nd('qh.het')}</div>
        : (
          <>
            {thuong.length >= 2 && (
              <button type="button" className="bn-them-nut qh-het" onClick={() => { const r = doiHetSangNay(bang, homNay); lam(r.bang, nd('qh.daDoiHet', { so: r.so })); }} {...ndDau('qh.doiHet')}>{ndPhan('qh.doiHet', { so: thuong.length })}</button>
            )}
            {ds.map((q) => <Dong key={q.v.id} q={q} homNay={homNay} bang={bang} lam={lam} />)}
          </>
        )}
    </BangNoi>
  );
}
