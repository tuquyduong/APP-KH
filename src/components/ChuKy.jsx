import { useState } from 'react';
import '../giaoDien/ke_hoach.css';
import '../giaoDien/tien_ich.css';
import { nd, ndDau } from '../noiDung/nd.js';
import { ngayChuoi, batChuKy, tatChuKy, ghiKyMoi, doiDaiChuKy, doiHanhChuKy, doiNhacChuKy, ngayNgan } from '../kehoach.js';
import { jd, chuKyHomNay, dayChuKy, trungBinhKy, CHU_KY } from '../kehoachLap.js';
import { dungLuuBao } from './dungKeHoach.js';
import { DauMan } from '../pages/KeHoach.jsx';
import Man from './Man.jsx';
import BangNoi from './BangNoi.jsx';
import HoiXoa from './HoiXoa.jsx';
import Thongbao from './Thongbao.jsx';
import { BanhNgay } from './BanhXoay.jsx';
import { Ico } from './BieuTuong.jsx';
import { NutNhac } from './VanKhanMan.jsx';
import { TranhTienIch } from './BieuTuongTienIch.jsx';
import { bam } from './bam.js';

const KHOA_PH = ['chuky.ph0', 'chuky.ph1', 'chuky.ph2', 'chuky.ph3', 'chuky.ph4']; // tên 5 giai đoạn (CYC_PH của demo)
const KHOA_CYC = ['cyc.0', 'cyc.1', 'cyc.2', 'cyc.3', 'cyc.4'];                      // chữ dưỡng sinh theo giai đoạn (data-cms="t:cyc.N" của demo)

/** Hỏi ngày bắt đầu kỳ gần nhất khi bật Chu kỳ. */
function HoiNgay({ homNay, bang, luuBao, datTb, dong }) {
  const [ngay, datNgay] = useState(ngayChuoi(homNay));
  const gui = () => { const moi = batChuKy(bang, ngay, ngayChuoi(homNay)); if (!moi) { datTb(nd('chuky.ngayLoi')); return; } if (luuBao(moi, '')) dong(); };
  return (
    <BangNoi tieuDe={nd('chuky.hoiNgay')} dong={dong} nhan={nd('chuky.offTieu')}>
      <BanhNgay ngay={ngay} homNay={homNay} doi={datNgay} />
      <button type="button" className="checkout-btn giua" style={{ marginTop: 14 }} onClick={gui} {...ndDau('chuky.hoiNut')}>{nd('chuky.hoiNut')}</button>
    </BangNoi>
  );
}

function ChiTiet({ homNay, bang, luuBao, hoiTat, datHoiTat, tat }) {
  const ck = bang.chuKy, hn = jd(homNay), n = chuKyHomNay(ck, hn), con = n.nextJ - hn, tb = trungBinhKy(ck.ls);
  return (
    <>
      <div className="cyc-card">
        <div className="cyc-top">
          <div><small {...ndDau('chuky.homNay')}>{nd('chuky.homNay')}</small><b>{nd('chuky.ngay', { so: n.day })}</b><span className={`p${n.ph}`} {...ndDau(KHOA_PH[n.ph])}>{nd(KHOA_PH[n.ph])}</span></div>
          <div style={{ textAlign: 'right' }}><small {...ndDau('chuky.kyToi')}>{nd('chuky.kyToi')}</small><b>{ngayNgan(n.nextJ, homNay)}</b><span>{con > 0 ? nd('chuky.conNgay', { so: con }) : nd('chuky.daToi')}</span></div>
        </div>
        <div className="cyc-strip">{dayChuKy(ck).map((p, i) => <i key={i} className={`p${p}${i + 1 === n.day ? ' now' : ''}`} />)}</div>
        <div className="cyc-lg">{[0, 1, 2, 3].map((p) => <span key={p}><i className={`p${p}`} />{nd(KHOA_PH[p])}</span>)}</div>
        <div className={`cyc-tip p${n.ph}`}><b {...ndDau('chuky.duongSinh')}>{nd('chuky.duongSinh')}</b><span {...ndDau(KHOA_CYC[n.ph])}>{nd(KHOA_CYC[n.ph])}</span></div>
        <div className="cyc-btns"><button type="button" onClick={() => luuBao(ghiKyMoi(bang, ngayChuoi(homNay)), nd('chuky.daGhiKy'))} {...ndDau('chuky.kyBatDau')}>{nd('chuky.kyBatDau')}</button></div>
      </div>
      <div className="cyc-set">
        <div><small {...ndDau('chuky.daiLb')}>{nd('chuky.daiLb')}</small><span><button type="button" onClick={() => luuBao(doiDaiChuKy(bang, -1), '')}>−</button><b>{nd('chuky.soNgay', { so: ck.dai })}</b><button type="button" onClick={() => luuBao(doiDaiChuKy(bang, 1), '')}>+</button></span></div>
        <div><small {...ndDau('chuky.hanhLb')}>{nd('chuky.hanhLb')}</small><span><button type="button" onClick={() => luuBao(doiHanhChuKy(bang, -1), '')}>−</button><b>{nd('chuky.soNgay', { so: ck.hanh })}</b><button type="button" onClick={() => luuBao(doiHanhChuKy(bang, 1), '')}>+</button></span></div>
      </div>
      <div className="tl-row"><div className="tl-rt"><b {...ndDau('chuky.lsTieu')}>{nd('chuky.lsTieu')}</b>
        <small>{ck.ls.length ? nd('chuky.lsDong', { ds: ck.ls.slice(-CHU_KY.soKy).join(' · '), tb }) : nd('chuky.lsTrong')}</small></div></div>
      <div className="tl-row"><div className="tl-rt"><b {...ndDau('chuky.nhacTieu')}>{nd('chuky.nhacTieu')}</b><small {...ndDau('chuky.nhacPhu')}>{nd('chuky.nhacPhu')}</small></div><NutNhac bat={ck.nhac} doi={() => luuBao(doiNhacChuKy(bang), '')} /></div>
      <div className="tl-note" {...ndDau('chuky.ghiChu')}><Ico ten="warning" s={13} /> {nd('chuky.ghiChu')}</div>
      {hoiTat ? <HoiXoa tieu={nd('chuky.tenXoa')} loai={nd('chuky.loaiXoa')} xoa={tat} huy={() => datHoiTat(false)} />
        : <div className="tl-acts" style={{ justifyContent: 'center' }}><span {...bam(() => datHoiTat(true))} {...ndDau('chuky.tat')}>{nd('chuky.tat')}</span></div>}
    </>
  );
}

/** Tiện ích Chu kỳ (/kehoach/chuky): riêng tư, chỉ lưu trên máy (không khoá mã: tài khoản riêng của khách). Ô này ẩn với xưng hô anh / chú / bác / ông (KeHoach.jsx). */
export default function ChuKy({ homNay, san = true, veLich }) {
  const { bang, luuBao, tb, datTb } = dungLuuBao(san);
  const [form, datForm] = useState(null); // 'ngay'
  const [hoiTat, datHoiTat] = useState(false);
  const ck = bang.chuKy;
  const tat = () => { if (luuBao(tatChuKy(bang), nd('chuky.daTat'))) datHoiTat(false); };
  return (
    <Man id="tool">
      <DauMan tieuDe={nd('chuky.tieuDe')} phu={nd('chuky.phu')} lui={veLich} />
      <div id="toolBody">
        {!ck.bat && (
          <div className="cyc-off"><TranhTienIch ten="moon" s={56} /><b {...ndDau('chuky.offTieu')}>{nd('chuky.offTieu')}</b><p {...ndDau('chuky.offMo')}>{nd('chuky.offMo')}</p>
            <button type="button" className="checkout-btn giua" onClick={() => datForm('ngay')} {...ndDau('chuky.bat')}>{nd('chuky.bat')}</button></div>
        )}
        {ck.bat && <ChiTiet homNay={homNay} bang={bang} luuBao={luuBao} hoiTat={hoiTat} datHoiTat={datHoiTat} tat={tat} />}
      </div>
      {form === 'ngay' && <HoiNgay homNay={homNay} bang={bang} luuBao={luuBao} datTb={datTb} dong={() => datForm(null)} />}
      <Thongbao chu={tb} het={() => datTb('')} />
    </Man>
  );
}
