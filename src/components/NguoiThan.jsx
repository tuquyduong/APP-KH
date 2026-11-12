import { useState } from 'react';
import { Ico } from './BieuTuong.jsx';
import { bam } from './bam.js';
import BangNoi from './BangNoi.jsx';
import HoiXoa from './HoiXoa.jsx';
import { BanhNgayThang } from './BanhXoay.jsx';
import { soNgayThang } from '../kehoachLap.js';
import { nd, ndDau } from '../noiDung/nd.js';
import { themNguoi, suaNguoi, xoaNguoi, nguoiSapXep, tronTuoi, thuNgayNgan, dayThang, conLai, nhacNguoi, TEN_NGUOI_TOI_DA, TOI_DA_NGUOI } from '../kehoach.js';

const MAC_DINH = { loai: 'sn', ten: '', cal: 'duong', nam: '', nhac: -240 }; // demo pplForm: Sinh nhật · Dương lịch · nhắc 1 ngày trước
const Chip = ({ on, f, children }) => <button type="button" className={on ? 'on' : ''} aria-pressed={on} onClick={f}>{children}</button>;
const chuLoai = (p) => nd(p.loai === 'gio' ? 'kh.gioTen' : 'kh.snTen', { ten: p.ten });

/** Tab "Người thân" của Ngày cần nhớ (demo nhánh 'ppl'): sinh nhật + giỗ, gần nhất trước. Không có "Tặng thẻ quà" (chưa có thẻ quà). */
export function DanhSachNguoi({ homNay, bang, luu, moSua, moVanKhanGio }) {
  const [hoi, datHoi] = useState('');
  const ds = nguoiSapXep(bang, homNay);
  if (!ds.length) return <div className="empty-note" {...ndDau('ngt.trong')}>{nd('ngt.trong')}</div>;
  return (
    <>
      <div className="tl-note" {...ndDau('ngt.ghiChu')}>{nd('ngt.ghiChu')}</div>
      {ds.map(({ p, j }) => {
        const bat = p.nhac !== null;
        return (
          <div className="tl-row" key={p.id} style={{ cursor: 'default' }}>
            <div className={`tl-date ${p.loai}`}><b>{dayThang(j)}</b><small>{conLai(j, homNay)}</small></div>
            <div className="tl-rt">
              <b {...bam(() => moSua(p))} style={{ cursor: 'pointer' }}>{chuLoai(p)}</b>
              <small>{p.cal === 'am' ? `${nd('kh.calAm', { d: p.d, m: p.m })} · ` : ''}{thuNgayNgan(j, homNay)}{tronTuoi(p, j)}</small>
              <div className="tl-acts">
                {p.loai === 'gio' && <span {...bam(() => moVanKhanGio(p.ten))} {...ndDau('ngt.vkGio')}>{nd('ngt.vkGio')}</span>}
                <span {...bam(() => datHoi(p.id))} {...ndDau('hx.xoa')}>{nd('hx.xoa')}</span>
              </div>
              {hoi === p.id && <HoiXoa loai={nd(p.loai === 'gio' ? 'ngt.loaiGio' : 'ngt.loaiSn')} tieu={p.ten} huy={() => datHoi('')} xoa={() => { luu(xoaNguoi(bang, p.id), nd('bn.daXoa', { tieu: chuLoai(p) })); datHoi(''); }} />}
            </div>
            <button type="button" className={`tl-rm${bat ? ' on' : ''}`} aria-pressed={bat} {...ndDau(bat ? 'kh.dangNhac' : 'kh.coNhac')} onClick={() => luu({ ...bang, nguoi: bang.nguoi.map((x) => (x.id === p.id ? { ...x, nhac: bat ? null : -240 } : x)) }, nd(bat ? 'kh.daTatNhac' : 'kh.daBatNhac'))}>
              <Ico ten="bell" s={12} /> {nd(bat ? 'kh.dangNhac' : 'kh.coNhac')}
            </button>
          </div>
        );
      })}
    </>
  );
}

/** Bảng nổi "Thêm sinh nhật hoặc ngày giỗ" (demo pplForm) — cũng dùng để sửa (`nguoi` có = đang sửa). `luu(bangMoi, chữ)` trả true nếu ghi được. */
export function FormNguoi({ homNay, bang, nguoi, luu, dong }) {
  const [f, datF] = useState(() => (nguoi ? { loai: nguoi.loai, ten: nguoi.ten, cal: nguoi.cal, nam: nguoi.nam ? String(nguoi.nam) : '', nhac: nguoi.nhac, d: nguoi.d, m: nguoi.m } : { ...MAC_DINH, d: homNay.d, m: homNay.m }));
  const [loi, datLoi] = useState('');
  const doi = (o) => datF({ ...f, ...o });
  const doiLoai = (loai) => { const cal = nguoi ? f.cal : loai === 'gio' ? 'am' : 'duong'; doi({ loai, cal, d: Math.min(f.d, cal === 'am' ? 30 : soNgayThang(f.m, 2000)) }); }; // giỗ mặc định Âm, sinh nhật mặc định Dương (B3)
  const doiLich = (cal) => doi({ cal, d: Math.min(f.d, cal === 'am' ? 30 : soNgayThang(f.m, 2000)) });
  const gui = () => {
    const nhap = { ...f, nam: f.loai === 'sn' ? f.nam : '' };
    const moi = nguoi ? suaNguoi(bang, nguoi.id, nhap) : themNguoi(bang, nhap);
    if (!moi) { datLoi(!f.ten.trim() ? nd('ngt.nhapTen') : bang.nguoi.length >= TOI_DA_NGUOI && !nguoi ? nd('ngt.daDay') : nd('ngt.ngayLoi')); return; }
    if (luu(moi, nguoi ? nd('ngt.daLuu') : nd('ngt.daThem', { ten: chuLoai(nhap) }))) dong(); else datLoi(nd('bn.chuaLuu'));
  };
  return (
    <BangNoi tieuDe={nd(nguoi ? 'ngt.formSua' : 'ngt.formThem')} dong={dong} nhan={nd('ngt.nhan')}>
      <div className="pf-chips sm" style={{ marginTop: 12 }}><Chip on={f.loai === 'sn'} f={() => doiLoai('sn')}>{nd('ngt.chipSn')}</Chip><Chip on={f.loai === 'gio'} f={() => doiLoai('gio')}>{nd('ngt.chipGio')}</Chip></div>
      <label className="tl-lb" {...ndDau('ngt.ten')}>{nd('ngt.ten')}</label>
      <input className="tl-in" type="text" aria-label={nd('ngt.tenAria')} placeholder={nd('ngt.tenGoiY')} maxLength={TEN_NGUOI_TOI_DA} value={f.ten} onChange={(e) => { doi({ ten: e.target.value }); datLoi(''); }} />
      <div className="pf-chips sm" style={{ marginTop: 10 }}><Chip on={f.cal === 'duong'} f={() => doiLich('duong')}>{nd('ngt.chipDuong')}</Chip><Chip on={f.cal === 'am'} f={() => doiLich('am')}>{nd('ngt.chipAm')}</Chip></div>
      <BanhNgayThang d={f.d} m={f.m} cal={f.cal} doi={(d, m) => doi({ d, m })} />
      {f.loai === 'sn' && (
        <>
          <label className="tl-lb" {...ndDau('ngt.nam')}>{nd('ngt.nam')}</label>
          <input className="tl-in" type="number" inputMode="numeric" aria-label={nd('ngt.namAria')} placeholder={nd('ngt.namGoiY')} value={f.nam} onChange={(e) => doi({ nam: e.target.value })} />
        </>
      )}
      <label className="tl-lb" {...ndDau('ngt.nhacTruoc')}>{nd('ngt.nhacTruoc')}</label><div className="pf-chips sm">{nhacNguoi().map(([ten, ph]) => <Chip key={ten} on={f.nhac === ph} f={() => doi({ nhac: ph })}>{ten}</Chip>)}</div>
      {loi && <div className="loi-nho" role="alert" style={{ fontSize: 12, color: 'var(--pink-dark)', margin: '6px 2px' }}>{loi}</div>}
      <button type="button" className="checkout-btn giua" style={{ marginTop: 14 }} onClick={gui} {...ndDau('ti.luu')}>{nd('ti.luu')}</button>
    </BangNoi>
  );
}
