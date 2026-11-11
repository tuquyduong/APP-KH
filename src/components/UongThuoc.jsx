import { useState } from 'react';
import '../giaoDien/ke_hoach.css';
import '../giaoDien/tien_ich.css';
import { nd, ndDau, ndDs } from '../noiDung/nd.js';
import { ngayChuoi, themThuoc, xoaThuoc, doiNhacThuoc, doiUong, thuNgayNgan } from '../kehoach.js';
import { jd, jdChuoi, thuocConHan, homNayThuoc, bayNgayThuoc } from '../kehoachLap.js';
import { dungLuuBao } from './dungKeHoach.js';
import { DauMan } from '../pages/KeHoach.jsx';
import Man from './Man.jsx';
import BangNoi from './BangNoi.jsx';
import HoiXoa from './HoiXoa.jsx';
import Thongbao from './Thongbao.jsx';
import { BanhGio } from './BanhXoay.jsx';
import { Ico } from './BieuTuong.jsx';
import { NutNhac } from './VanKhanMan.jsx';
import { bam } from './bam.js';

const GIO_MAC_DINH = '07:30', GIO_TOI_DA = 3;

/** Bảng thêm thuốc (demo medForm): tên, liều, 1–3 giờ uống (bánh xe giờ 24h), ghi chú, "Uống trong" 7 / 14 / 30 ngày / dài ngày. */
function FormThuoc({ bang, nay, luuBao, datTb, dong }) {
  const [f, datF] = useState({ ten: '', lieu: '', ghi: '', trong: 14, gio: [GIO_MAC_DINH] });
  const doi = (o) => datF((c) => ({ ...c, ...o }));
  const gui = () => {
    if (!f.ten.trim()) { datTb(nd('thuoc.nhapTen')); return; }
    const gio = [...new Set(f.gio)].sort();
    const moi = themThuoc(bang, { ...f, gio, lieu: f.lieu.trim() || nd('thuoc.lieuMacDinh') }, nay);
    if (!moi) { datTb(nd('thuoc.nhapGio')); return; }
    if (luuBao(moi, nd('thuoc.daLuu', { gio: gio.join(', ') }))) dong();
  };
  return (
    <BangNoi tieuDe={nd('thuoc.formTieu')} phu={nd('thuoc.formPhu')} dong={dong} nhan={nd('thuoc.formTieu')}>
      <label className="tl-lb" {...ndDau('thuoc.ten')}>{nd('thuoc.ten')}</label><input {...ndDau('thuoc.tenGoiY')} className="tl-in" aria-label={nd('thuoc.ten')} placeholder={nd('thuoc.tenGoiY')} maxLength={60} value={f.ten} onChange={(e) => doi({ ten: e.target.value })} />
      <label className="tl-lb" {...ndDau('thuoc.lieu')}>{nd('thuoc.lieu')}</label><input {...ndDau('thuoc.lieuGoiY')} className="tl-in" aria-label={nd('thuoc.lieu')} placeholder={nd('thuoc.lieuGoiY')} maxLength={40} value={f.lieu} onChange={(e) => doi({ lieu: e.target.value })} />
      <label className="tl-lb" {...ndDau('thuoc.gio')}>{nd('thuoc.gio')}</label>
      {f.gio.map((g, i) => (
        <div className="thuoc-gio" key={i}>
          <BanhGio gio={g} doi={(moi) => doi({ gio: f.gio.map((x, j) => (j === i ? moi : x)) })} />
          {f.gio.length > 1 && <button type="button" className="tl-rm" onClick={() => doi({ gio: f.gio.filter((_, j) => j !== i) })} {...ndDau('thuoc.gioBo')}>{nd('thuoc.gioBo')}</button>}
        </div>
      ))}
      {f.gio.length < GIO_TOI_DA && <div className="tl-acts"><span {...bam(() => doi({ gio: [...f.gio, GIO_MAC_DINH] }))} {...ndDau('thuoc.gioThem')}>{nd('thuoc.gioThem')}</span></div>}
      <label className="tl-lb" {...ndDau('thuoc.ghi')}>{nd('thuoc.ghi')}</label><input {...ndDau('thuoc.ghiGoiY')} className="tl-in" aria-label={nd('thuoc.ghi')} placeholder={nd('thuoc.ghiGoiY')} maxLength={80} value={f.ghi} onChange={(e) => doi({ ghi: e.target.value })} />
      <label className="tl-lb" {...ndDau('thuoc.trongLb')}>{nd('thuoc.trongLb')}</label>
      <div className="pf-chips sm">{ndDs('thuoc.dot').map((d) => <button type="button" key={d.ngay} className={f.trong === +d.ngay ? 'on' : ''} onClick={() => doi({ trong: +d.ngay })}>{d.ten}</button>)}</div>
      <button type="button" className="checkout-btn giua" style={{ marginTop: 14 }} onClick={gui} {...ndDau('thuoc.luu')}>{nd('thuoc.luu')}</button>
      <div className="tl-note" {...ndDau('thuoc.ghiNho')}>{nd('thuoc.ghiNho')}</div>
    </BangNoi>
  );
}

/** Tiện ích Uống thuốc (/kehoach/uongthuoc): tên thuốc chỉ lưu trên máy; mọi lời nhắc chỉ nói "Đến giờ uống thuốc" (không tên thuốc). */
export default function UongThuoc({ homNay, san = true, veLich }) {
  const { bang, luuBao, tb, datTb } = dungLuuBao(san);
  const [moForm, datMoForm] = useState(false);
  const [hoiXoa, datHoiXoa] = useState(null); // id thuốc đang hỏi xoá
  const hn = jd(homNay), nay = ngayChuoi(homNay), t = homNayThuoc(bang, hn), bay = bayNgayThuoc(bang, hn);
  return (
    <Man id="tool">
      <DauMan tieuDe={nd('thuoc.tieuDe')} phu={nd('thuoc.phu')} lui={veLich} phai={<div className="today-btn" {...bam(() => datMoForm(true))} {...ndDau('thuoc.them')}>{nd('thuoc.them')}</div>} />
      <div id="toolBody">
        {bang.thuoc.length === 0 && <div className="empty-note" {...ndDau('thuoc.trong')}>{nd('thuoc.trong')}</div>}
        {bang.thuoc.length > 0 && (
          <div className="med-sum"><div><b>{t.done}/{t.all}</b><small {...ndDau('thuoc.tongNhan')}>{nd('thuoc.tongNhan')}</small></div>
            <div className="med-7">{bay.map((v, i) => <i key={i} className={v === 'f' ? 'f' : v === 'h' ? 'h' : ''} />)}<i className={`${t.all && t.done === t.all ? 'f' : t.done ? 'h' : ''} td`} /></div>
            <small className="med-7l" {...ndDau('thuoc.bayNhan')}>{nd('thuoc.bayNhan')}</small></div>
        )}
        {bang.thuoc.map((m) => {
          const con = thuocConHan(m, hn), xong = (bang.thuocXong[nay] || []);
          return (
            <div className="med-card" key={m.id}>
              <div className="med-h">
                <div><b>{m.ten}</b><small>{[m.lieu, m.ghi].filter(Boolean).join(' · ')}{m.den ? ' · ' + nd('thuoc.den', { ngay: thuNgayNgan(jdChuoi(m.den), homNay) }) : ''}{con ? '' : ' · ' + nd('thuoc.xong')}</small></div>
                {con && <NutNhac bat={m.nhac} doi={() => luuBao(doiNhacThuoc(bang, m.id), nd(m.nhac ? 'thuoc.daTat' : 'thuoc.daBat'))} />}
              </div>
              {con && (
                <div className="med-times">{m.gio.map((g) => {
                  const ok = xong.includes(`${m.id}@${g}`);
                  return <button type="button" key={g} className={ok ? 'ok' : ''} aria-pressed={ok} onClick={() => luuBao(doiUong(bang, m.id, g, nay), '')}>{ok ? <Ico ten="check" s={13} /> : null} {g}<small>{nd(ok ? 'thuoc.da' : 'thuoc.chua')}</small></button>;
                })}</div>
              )}
              {hoiXoa === m.id
                ? <HoiXoa tieu={m.ten} loai={nd('thuoc.loaiXoa')} xoa={() => { luuBao(xoaThuoc(bang, m.id), ''); datHoiXoa(null); }} huy={() => datHoiXoa(null)} />
                : <div className="tl-acts"><span {...bam(() => datHoiXoa(m.id))} {...ndDau('thuoc.xoa')}>{nd('thuoc.xoa')}</span></div>}
            </div>
          );
        })}
        <div className="tl-note" {...ndDau('thuoc.ghiChu')}>{nd('thuoc.ghiChu')}</div>
      </div>
      {moForm && <FormThuoc bang={bang} nay={nay} luuBao={luuBao} datTb={datTb} dong={() => datMoForm(false)} />}
      <Thongbao chu={tb} het={() => datTb('')} />
    </Man>
  );
}
