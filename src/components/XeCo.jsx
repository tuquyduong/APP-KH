import { useState } from 'react';
import '../giaoDien/ke_hoach.css';
import '../giaoDien/tien_ich.css';
import { nd, ndDau, ndDs } from '../noiDung/nd.js';
import { dinhDangGia } from '../dinhDang.js';
import { ngayChuoi, themXe, suaXe, xoaXe, datKmXe, doiNhacXe, ghiXongHang, ghiLanSua, luuHang, xoaHang, datNgayGiay, chuHang, chuGiay, chuLich, chuXe, ngayNgan } from '../kehoach.js';
import { jd, jdChuoi, trangThaiXe, trangThaiGiay, sapHang, tongPhiXe, LOAI_XE } from '../kehoachLap.js';
import { dungLuuBao } from './dungKeHoach.js';
import { DauMan } from '../pages/KeHoach.jsx';
import Man from './Man.jsx';
import BangNoi from './BangNoi.jsx';
import HoiXoa from './HoiXoa.jsx';
import Thongbao from './Thongbao.jsx';
import { BanhNgay } from './BanhXoay.jsx';
import { NutNhac } from './VanKhanMan.jsx';
import { TranhTienIch } from './BieuTuongTienIch.jsx';
import { bam } from './bam.js';

// Huy hiệu ô tô của demo (CAR_SVG, patch35); xe máy và các loại khác dùng huy hiệu scooter của bộ biểu tượng.
const BieuTuongXe = ({ loai }) => (loai === 'oto' ? (
  <svg width="38" height="38" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#E7EEF8" /><circle cx="32" cy="32" r="29" fill="none" stroke="#D8BE8C" strokeWidth="1.6" /><path d="M14 38v-6l5-9h22l7 9h2v6z" fill="#fff" stroke="#2C3E5E" strokeWidth="2" strokeLinejoin="round" /><path d="M21 25l-3 7h28l-5-7z" fill="#CFE0F5" /><circle cx="21" cy="39" r="4" fill="#2C3E5E" /><circle cx="43" cy="39" r="4" fill="#2C3E5E" /></svg>
) : <TranhTienIch ten="scooter" s={38} />);

const so = (n) => Number(n).toLocaleString('vi-VN');
const tenLoai = (loai) => (ndDs('xe.macdinh').find((m) => m.loai === loai) || {}).ten || '';
const Chip = ({ on, f, children, off }) => <button type="button" className={on ? 'on' : ''} disabled={off} onClick={f}>{children}</button>;

/** Bảng thêm / sửa xe (demo carAddForm): loại (chỉ chọn khi thêm), tên gọi, biển số, số km. */
function FormXe({ xe, bang, luuBao, datTb, dong, chon }) {
  const [f, datF] = useState({ loai: xe ? xe.loai : 'xm', ten: xe ? xe.ten : '', bien: xe ? xe.bien : '', km: xe ? String(xe.km) : '' });
  const doi = (o) => datF((c) => ({ ...c, ...o }));
  const mau = ndDs('xe.macdinh').find((m) => m.loai === f.loai) || {};
  const lich = String(mau.lich || '').split(';').filter(Boolean).map((h) => { const [ten, km, th] = h.split(':'); return `${ten} (${chuLich({ km: +km, thang: +th })})`; });
  const gui = () => {
    if (!f.ten.trim()) { datTb(nd('xe.nhapTen')); return; }
    const moi = xe ? suaXe(bang, xe.id, f) : themXe(bang, f, ndDs('xe.macdinh'));
    if (!moi) { datTb(nd('xe.nhapTen')); return; }
    if (luuBao(moi, nd('xe.daLuu'))) { dong(); if (!xe) chon(moi.xe[moi.xe.length - 1].id); }
  };
  return (
    <BangNoi tieuDe={nd(xe ? 'xe.suaXe' : 'xe.formThem')} phu={xe ? xe.ten : nd('xe.formPhu')} dong={dong} nhan={nd(xe ? 'xe.suaXe' : 'xe.formThem')}>
      <label className="tl-lb" {...ndDau('xe.loai')}>{nd('xe.loai')}</label>
      <div className="pf-chips sm">{LOAI_XE.map((l) => <Chip key={l} on={f.loai === l} off={!!xe} f={() => doi({ loai: l })}>{tenLoai(l)}</Chip>)}</div>
      <label className="tl-lb" {...ndDau('xe.ten')}>{nd('xe.ten')}</label><input {...ndDau('xe.tenGoiY')} className="tl-in" aria-label={nd('xe.ten')} placeholder={nd('xe.tenGoiY')} maxLength={60} value={f.ten} onChange={(e) => doi({ ten: e.target.value })} />
      <label className="tl-lb" {...ndDau('xe.bien')}>{nd('xe.bien')}</label><input {...ndDau('xe.bienGoiY')} className="tl-in" aria-label={nd('xe.bien')} placeholder={nd('xe.bienGoiY')} maxLength={20} value={f.bien} onChange={(e) => doi({ bien: e.target.value })} />
      <label className="tl-lb" {...ndDau('xe.kmLb')}>{nd('xe.kmLb')}</label><input {...ndDau('xe.kmGoiY')} className="tl-in" type="number" inputMode="numeric" min="0" aria-label={nd('xe.kmLb')} placeholder={nd('xe.kmGoiY')} value={f.km} onChange={(e) => doi({ km: e.target.value })} />
      {!xe && (
        <div className="tl-note" {...ndDau('xe.mauNote')}>{nd('xe.mauNote', { loai: tenLoai(f.loai), lich: lich.join('; ') || nd('xe.mauKhong') })}{mau.giay ? ' ' + nd('xe.mauGiay', { giay: mau.giay.split(';').join(', ') }) : ''}</div>
      )}
      <button type="button" className="checkout-btn giua" style={{ marginTop: 14 }} onClick={gui}>{nd(xe ? 'ti.luu' : 'xe.nutThem')}</button>
    </BangNoi>
  );
}

/** Bảng thêm / sửa một hạng mục bảo dưỡng (demo carSchedForm). `k` = null khi thêm. */
function FormHang({ xe, k, bang, luuBao, datTb, dong }) {
  const h = k === null ? { ten: '', km: '', thang: '' } : xe.lich[k];
  const [f, datF] = useState({ ten: h.ten, km: h.km || '', thang: h.thang || '' });
  const doi = (o) => datF((c) => ({ ...c, ...o }));
  const gui = () => {
    if (!f.ten.trim()) { datTb(nd('xe.nhapHang')); return; }
    if (!(+f.km || +f.thang)) { datTb(nd('xe.nhapKmThang')); return; }
    const moi = luuHang(bang, xe.id, k, f);
    if (moi && luuBao(moi, nd('xe.daLuuHang'))) dong();
  };
  return (
    <BangNoi tieuDe={nd(k === null ? 'xe.hangThem' : 'xe.hangSua')} phu={xe.ten} dong={dong} nhan={nd(k === null ? 'xe.hangThem' : 'xe.hangSua')}>
      <label className="tl-lb" {...ndDau('xe.hangTen')}>{nd('xe.hangTen')}</label><input {...ndDau('xe.hangTenGoiY')} className="tl-in" aria-label={nd('xe.hangTen')} placeholder={nd('xe.hangTenGoiY')} maxLength={60} value={f.ten} onChange={(e) => doi({ ten: e.target.value })} />
      <div className="pf-chips sm" style={{ marginTop: 8 }}>{ndDs('xe.hangGoiY').map((g) => <Chip key={g.ten} on={false} f={() => doi({ ten: g.ten })}>{g.ten}</Chip>)}</div>
      <label className="tl-lb" {...ndDau('xe.hangNhacLb')}>{nd('xe.hangNhacLb')}</label>
      <div className="two">
        <input {...ndDau('xe.hangKm')} className="tl-in" type="number" inputMode="numeric" min="0" aria-label={nd('xe.hangKm')} placeholder={nd('xe.hangKm')} value={f.km} onChange={(e) => doi({ km: e.target.value })} />
        <input {...ndDau('xe.hangThang')} className="tl-in" type="number" inputMode="numeric" min="0" aria-label={nd('xe.hangThang')} placeholder={nd('xe.hangThang')} value={f.thang} onChange={(e) => doi({ thang: e.target.value })} />
      </div>
      <button type="button" className="checkout-btn giua" style={{ marginTop: 14 }} onClick={gui} {...ndDau('ti.luu')}>{nd('ti.luu')}</button>
      {k !== null && <div className="tl-acts" style={{ justifyContent: 'center', marginTop: 12 }}><span {...bam(() => { if (luuBao(xoaHang(bang, xe.id, k), nd('xe.daXoaHang'))) dong(); })} {...ndDau('xe.hangXoa')}>{nd('xe.hangXoa')}</span></div>}
    </BangNoi>
  );
}

/** Bảng ghi một lần sửa (demo carLogForm): ngày, số km lúc làm, việc đã làm (chọn nhiều + tự điền), chi phí, nơi làm. */
function FormLog({ xe, bang, homNay, luuBao, datTb, dong }) {
  const [f, datF] = useState({ ngay: ngayChuoi(homNay), km: String(xe.km), phi: '', noi: '', them: '' });
  const [chon, datChon] = useState([]);
  const [khac, datKhac] = useState([]);
  const doi = (o) => datF((c) => ({ ...c, ...o }));
  const ds = [...new Set([...xe.lich.map((h) => h.ten), ...ndDs('xe.viecKhac').map((g) => g.ten), ...khac])];
  const bat = (t) => datChon((c) => (c.includes(t) ? c.filter((x) => x !== t) : [...c, t]));
  const themViec = () => { const t = f.them.trim(); if (!t) return; datKhac((c) => [...c, t]); datChon((c) => [...c, t]); doi({ them: '' }); };
  const gui = () => {
    const viec = f.them.trim() ? [...chon, f.them.trim()] : chon;
    if (!viec.length) { datTb(nd('xe.logChon')); return; }
    const moi = ghiLanSua(bang, xe.id, { ...f, viec });
    if (moi && luuBao(moi, nd('xe.logDaLuu'))) dong();
  };
  return (
    <BangNoi tieuDe={nd('xe.logTieu')} phu={xe.ten + (xe.bien ? ' · ' + xe.bien : '')} dong={dong} nhan={nd('xe.logTieu')}>
      <label className="tl-lb" {...ndDau('xe.logNgay')}>{nd('xe.logNgay')}</label><BanhNgay ngay={f.ngay} homNay={homNay} doi={(ngay) => doi({ ngay })} />
      <label className="tl-lb" {...ndDau('xe.logKm')}>{nd('xe.logKm')}</label><input className="tl-in" type="number" inputMode="numeric" min="0" aria-label={nd('xe.logKm')} value={f.km} onChange={(e) => doi({ km: e.target.value })} />
      <label className="tl-lb" {...ndDau('xe.logViec')}>{nd('xe.logViec')}</label>
      <div className="pf-chips sm">{ds.map((t) => <Chip key={t} on={chon.includes(t)} f={() => bat(t)}>{t}</Chip>)}</div>
      <div className="cl-add"><input {...ndDau('xe.logViecKhac')} className="tl-in" aria-label={nd('xe.logViecKhac')} placeholder={nd('xe.logViecKhac')} maxLength={60} value={f.them} onChange={(e) => doi({ them: e.target.value })} /><button type="button" onClick={themViec} {...ndDau('xe.logThemNut')}>{nd('xe.logThemNut')}</button></div>
      <div className="two">
        <div><label className="tl-lb" {...ndDau('xe.logPhi')}>{nd('xe.logPhi')}</label><input {...ndDau('xe.logPhiGoiY')} className="tl-in" type="number" inputMode="numeric" min="0" aria-label={nd('xe.logPhi')} placeholder={nd('xe.logPhiGoiY')} value={f.phi} onChange={(e) => doi({ phi: e.target.value })} /></div>
        <div><label className="tl-lb" {...ndDau('xe.logNoi')}>{nd('xe.logNoi')}</label><input {...ndDau('xe.logNoiGoiY')} className="tl-in" aria-label={nd('xe.logNoi')} placeholder={nd('xe.logNoiGoiY')} maxLength={80} value={f.noi} onChange={(e) => doi({ noi: e.target.value })} /></div>
      </div>
      <button type="button" className="checkout-btn giua" style={{ marginTop: 14 }} onClick={gui} {...ndDau('ti.luu')}>{nd('ti.luu')}</button>
      <div className="tl-note" {...ndDau('xe.logNote')}>{nd('xe.logNote')}</div>
    </BangNoi>
  );
}

/** Bảng chọn ngày hết hạn của một giấy tờ (không dùng ô type=date của trình duyệt — như KH-UI-5d E1). */
function FormNgay({ xe, k, bang, homNay, luuBao, dong }) {
  const [ngay, datNgay] = useState(xe.giayTo[k].ngay || ngayChuoi(homNay));
  return (
    <BangNoi tieuDe={nd('xe.giayNgayTieu')} phu={`${xe.giayTo[k].ten} · ${xe.ten}`} dong={dong} nhan={nd('xe.giayNgayTieu')}>
      <BanhNgay ngay={ngay} homNay={homNay} doi={datNgay} />
      <button type="button" className="checkout-btn giua" style={{ marginTop: 14 }} onClick={() => { if (luuBao(datNgayGiay(bang, xe.id, k, ngay), nd('xe.daLuu'))) dong(); }} {...ndDau('ti.luu')}>{nd('ti.luu')}</button>
      {xe.giayTo[k].ngay && <div className="tl-acts" style={{ justifyContent: 'center', marginTop: 12 }}><span {...bam(() => { if (luuBao(datNgayGiay(bang, xe.id, k, ''), nd('xe.daLuu'))) dong(); })} {...ndDau('ti.xoaNgay')}>{nd('ti.xoaNgay')}</span></div>}
    </BangNoi>
  );
}

function DanhSach({ bang, hn, homNay, mo }) {
  return (
    <>
      {bang.xe.length === 0 && <div className="empty-note" {...ndDau('xe.trong')}>{nd('xe.trong')}</div>}
      {bang.xe.map((x) => {
        const v = trangThaiXe(x, hn);
        return (
          <div className="veh" key={x.id} {...bam(() => mo(x.id))}>
            <div className="veh-ic"><BieuTuongXe loai={x.loai} /></div>
            <div className="veh-t"><b>{x.ten}</b><small>{x.bien || tenLoai(x.loai)} · {so(x.km)} {nd('xe.km')}</small>
              <span className={`veh-s${v.soon ? ' soon' : ''}`}>{v.soon ? '● ' : '✓ '}{chuXe(x, hn)}</span></div><em>›</em>
          </div>
        );
      })}
      <div className="tl-note" {...ndDau('xe.ghiChu')}>{nd('xe.ghiChu')}</div>
    </>
  );
}

function MotXe({ xe, bang, hn, homNay, nay, luuBao, moHang, moNgay, moSua, hoiXoa, datHoiXoa, xoa }) {
  const luuKm = (e) => { if (e.target.value !== '' && +e.target.value !== xe.km) luuBao(datKmXe(bang, xe.id, e.target.value), nd('xe.daKm')); };
  return (
    <>
      <div className="car-card"><div className="car-top"><BieuTuongXe loai={xe.loai} /><div><b {...ndDau('xe.kmNhan')}>{nd('xe.kmNhan')}</b><small {...ndDau('xe.kmPhu')}>{nd('xe.kmPhu')}</small></div>
        <div className="car-km"><input type="number" inputMode="numeric" min="0" aria-label={nd('xe.kmNhan')} key={xe.km} defaultValue={xe.km} onBlur={luuKm} onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} /><small {...ndDau('xe.km')}>{nd('xe.km')}</small></div></div></div>
      <div className="sec-head"><h2 {...ndDau('xe.lichTieu')}>{nd('xe.lichTieu')}</h2><span className="more" {...bam(() => moHang(null))} {...ndDau('xe.themHang')}>{nd('xe.themHang')}</span></div>
      {xe.lich.length === 0 && <div className="empty-note" {...ndDau('xe.chuaHang')}>{nd('xe.chuaHang')}</div>}
      {sapHang(xe, hn).map(({ hang, k, st }) => (
        <div className={`sch${st.over ? ' over' : st.soon ? ' soon' : ''}`} key={k}>
          <div className="sch-h" {...bam(() => moHang(k))}><b>{hang.ten}</b><small>{chuLich(hang)} ›</small></div>
          <div className="sch-s">{chuHang(st)}{st.lan ? nd('xe.lanCuoi', { ngay: ngayNgan(st.lan.j, homNay) }) : ''}</div>
          {!st.none && <div className="car-bar"><i style={{ width: `${Math.round(st.pct * 100)}%` }} /></div>}
          <button type="button" className="sch-do" onClick={() => luuBao(ghiXongHang(bang, xe.id, hang.ten, nay), nd('xe.daGhiHang', { ten: hang.ten, km: so(xe.km) }))} {...ndDau('xe.vuaLam')}>{nd('xe.vuaLam')}</button>
        </div>
      ))}
      <div className="tl-row" style={{ cursor: 'default' }}><div className="tl-rt"><b {...ndDau('xe.nhacTieu')}>{nd('xe.nhacTieu')}</b><small {...ndDau('xe.nhacPhu')}>{nd('xe.nhacPhu')}</small></div>
        <NutNhac bat={xe.nhac} doi={() => luuBao(doiNhacXe(bang, xe.id), '')} /></div>
      {xe.giayTo.length > 0 && <div className="sec-head"><h2 {...ndDau('xe.giayTieu')}>{nd('xe.giayTieu')}</h2></div>}
      {xe.giayTo.map((g, k) => {
        const st = trangThaiGiay(g, hn);
        return (
          <div className="tl-row" key={k} style={{ cursor: 'default' }}>
            <div className="tl-rt"><b>{g.ten}</b><small className={st.soon ? 'warn' : ''}>{chuGiay(st, homNay)}</small></div>
            <button type="button" className="tl-rm" onClick={() => moNgay(k)}>{g.ngay ? ngayNgan(jdChuoi(g.ngay), homNay) : nd('xe.giayNgayTieu')}</button>
          </div>
        );
      })}
      <div className="sec-head"><h2 {...ndDau('xe.lsTieu')}>{nd('xe.lsTieu')}</h2><span className="more">{dinhDangGia(tongPhiXe(xe))}</span></div>
      {xe.nhatKy.length === 0 && <div className="empty-note" {...ndDau('xe.lsTrong')}>{nd('xe.lsTrong')}</div>}
      {[...xe.nhatKy].sort((a, b) => b.ngay.localeCompare(a.ngay)).map((l, i) => {
        const [y, m, d] = l.ngay.split('-').map(Number);
        return (
          <div className="tl-row" key={i} style={{ cursor: 'default' }}>
            <div className="tl-date"><b>{d}/{m}</b><small>{y}</small></div>
            <div className="tl-rt"><b>{l.viec.join(', ')}</b><small {...ndDau('xe.logSapTheo')}>{nd('xe.logSapTheo', { km: so(l.km), phi: l.phi ? ' · ' + dinhDangGia(l.phi) : '', noi: l.noi ? ' · ' + l.noi : '' })}</small></div>
          </div>
        );
      })}
      {hoiXoa ? <HoiXoa tieu={xe.ten} loai={nd('xe.loaiXoa')} xoa={xoa} huy={() => datHoiXoa(false)} />
        : <div className="tl-acts" style={{ justifyContent: 'center', margin: '14px 0' }}><span {...bam(moSua)} {...ndDau('xe.suaXe')}>{nd('xe.suaXe')}</span><span {...bam(() => datHoiXoa(true))} {...ndDau('xe.xoaXe')}>{nd('xe.xoaXe')}</span></div>}
    </>
  );
}

/** Tiện ích Xe cộ (/kehoach/xeco): danh sách xe → một xe (số km, lịch bảo dưỡng, giấy tờ, lịch sử). Mọi dữ liệu chỉ trên máy (kho kh_kehoach). */
export default function XeCo({ homNay, san = true, veLich }) {
  const { bang, luuBao, tb, datTb } = dungLuuBao(san);
  const [man, datMan] = useState(null); // null = danh sách · id = một xe
  const [form, datForm] = useState(null); // { loai: 'xe'|'hang'|'log'|'ngay', xe?, k? }
  const [hoiXoa, datHoiXoa] = useState(false);
  const hn = jd(homNay), nay = ngayChuoi(homNay), xe = man && bang.xe.find((x) => x.id === man);
  const tieuDe = xe ? xe.ten : nd('xe.tieuDe'), phu = xe ? `${xe.bien ? xe.bien + ' · ' : ''}${tenLoai(xe.loai)}` : nd('xe.phu');
  const them = xe ? <div className="today-btn" {...bam(() => datForm({ loai: 'log' }))} {...ndDau('xe.ghiSua')}>{nd('xe.ghiSua')}</div> : <div className="today-btn" {...bam(() => datForm({ loai: 'xe' }))} {...ndDau('xe.them')}>{nd('xe.them')}</div>;
  const dong = () => datForm(null);
  return (
    <Man id="tool">
      <DauMan tieuDe={tieuDe} phu={phu} lui={xe ? () => { datMan(null); datHoiXoa(false); } : veLich} phai={them} />
      <div id="toolBody">
        {xe ? <MotXe xe={xe} bang={bang} hn={hn} homNay={homNay} nay={nay} luuBao={luuBao} moHang={(k) => datForm({ loai: 'hang', k })} moNgay={(k) => datForm({ loai: 'ngay', k })} moSua={() => datForm({ loai: 'xe', sua: true })} hoiXoa={hoiXoa} datHoiXoa={datHoiXoa}
          xoa={() => { if (luuBao(xoaXe(bang, xe.id), nd('xe.daXoa'))) { datMan(null); datHoiXoa(false); } }} />
          : <DanhSach bang={bang} hn={hn} homNay={homNay} mo={datMan} />}
      </div>
      {form && form.loai === 'xe' && <FormXe xe={form.sua ? xe : null} bang={bang} luuBao={luuBao} datTb={datTb} dong={dong} chon={datMan} />}
      {form && form.loai === 'hang' && xe && <FormHang xe={xe} k={form.k} bang={bang} luuBao={luuBao} datTb={datTb} dong={dong} />}
      {form && form.loai === 'log' && xe && <FormLog xe={xe} bang={bang} homNay={homNay} luuBao={luuBao} datTb={datTb} dong={dong} />}
      {form && form.loai === 'ngay' && xe && <FormNgay xe={xe} k={form.k} bang={bang} homNay={homNay} luuBao={luuBao} dong={dong} />}
      <Thongbao chu={tb} het={() => datTb('')} />
    </Man>
  );
}
