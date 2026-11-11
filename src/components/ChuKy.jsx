import { useEffect, useState } from 'react';
import '../giaoDien/ke_hoach.css';
import '../giaoDien/tien_ich.css';
import { nd, ndDau } from '../noiDung/nd.js';
import { ngayChuoi, batChuKy, tatChuKy, ghiKyMoi, doiDaiChuKy, doiHanhChuKy, doiNhacChuKy, datKhoaChuKy, datThuChuKy, taoKhoa, kiemKhoa, thuMa, conChoGiay, ngayNgan, SAI_TOI_DA } from '../kehoach.js';
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

const DO_DAI_MA = 4;
const KHOA_PH = ['chuky.ph0', 'chuky.ph1', 'chuky.ph2', 'chuky.ph3', 'chuky.ph4']; // tên 5 giai đoạn (CYC_PH của demo)
const KHOA_CYC = ['cyc.0', 'cyc.1', 'cyc.2', 'cyc.3', 'cyc.4'];                      // chữ dưỡng sinh theo giai đoạn (data-cms="t:cyc.N" của demo)

/** Bàn phím số 4 chữ số của Chu kỳ: dùng lớp .pin-pad / .pin-dots của bảng PIN ví nhưng KHÔNG gọi mạng (mã chỉ để khoá trên máy). */
function BanPhim({ so, datSo, loi, xacNhan, khoa = false }) {
  const nhan = (c) => { if (so.length < DO_DAI_MA) datSo(so + c); };
  return (
    <div className="cyc-khoa">
      <div className="pin-dots" aria-label={nd('chuky.khongKhoa')}>{Array.from({ length: DO_DAI_MA }, (_, i) => <i key={i} className={i < so.length ? 'on' : ''} />)}</div>
      <div className="pin-msg" role="alert">{loi}</div>
      <div className="pin-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => <button type="button" key={c} disabled={khoa} onClick={() => nhan(String(c))}>{c}</button>)}
        <button type="button" className="lk" onClick={() => datSo(so.slice(0, -1))} {...ndDau('chuky.xoaSo')}>{nd('chuky.xoaSo')}</button>
        <button type="button" disabled={khoa} onClick={() => nhan('0')}>0</button>
        <button type="button" className="lk pin-ok" disabled={khoa || so.length < DO_DAI_MA} onClick={xacNhan} {...ndDau('chuky.xacNhan')}>{nd('chuky.xacNhan')}</button>
      </div>
    </div>
  );
}

/** Bảng đặt mã 4 số: nhập → nhập lại; khớp thì lưu băm (không lưu mã gốc). */
function DatMa({ bang, luuBao, datTb, dong, mo }) {
  const [so, datSo] = useState(''), [dau, datDau] = useState(''), [loi, datLoi] = useState('');
  const xacNhan = async () => {
    if (!dau) { datDau(so); datSo(''); datLoi(''); return; }
    if (so !== dau) { datDau(''); datSo(''); datLoi(nd('chuky.khongKhop')); return; }
    const khoa = await taoKhoa(so);
    if (!khoa) { datTb(nd('chuky.khongHoTro')); dong(); return; }
    mo(); // đang ở trong màn: đặt xong mã không bị khoá ngay
    if (luuBao(datKhoaChuKy(bang, khoa), nd('chuky.daKhoa'))) dong();
  };
  return (
    <BangNoi tieuDe={nd(dau ? 'chuky.nhapLai' : 'chuky.datMa')} phu={nd('chuky.datMaPhu')} dong={dong} nhan={nd('chuky.datMa')}>
      <BanPhim so={so} datSo={(v) => { datSo(v); datLoi(''); }} loi={loi} xacNhan={xacNhan} />
    </BangNoi>
  );
}

/** Màn hỏi mã khi mở Chu kỳ đã khoá: sai 5 lần chờ 1 phút (đếm lưu trên máy, tải lại trang cũng không xoá); "Quên mã" → xoá dữ liệu chu kỳ để đặt lại. */
function HoiMa({ bang, luuBao, mo, quen }) {
  const [so, datSo] = useState(''), [loi, datLoi] = useState(''), [ms, datMs] = useState(Date.now()), [hoi, datHoi] = useState(false);
  const cho = conChoGiay(bang.chuKy.thu, ms);
  useEffect(() => {
    if (!cho) return undefined;
    const id = setInterval(() => datMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [cho > 0]);
  const xacNhan = async () => {
    const bay = Date.now();
    if (conChoGiay(bang.chuKy.thu, bay)) return;
    const dung = await kiemKhoa(so, bang.chuKy.khoa), thu = thuMa(bang.chuKy.thu, dung, bay);
    datSo(''); datMs(bay);
    luuBao(datThuChuKy(bang, thu), '');
    if (dung) mo(); else datLoi(thu.den ? '' : nd('chuky.maSai', { con: SAI_TOI_DA - thu.sai }));
  };
  return (
    <>
      <div className="cyc-off"><TranhTienIch ten="moon" s={56} /><b {...ndDau('chuky.moMa')}>{nd('chuky.moMa')}</b></div>
      <BanPhim so={so} datSo={(v) => { datSo(v); datLoi(''); }} loi={cho ? nd('chuky.cho', { giay: cho }) : loi} xacNhan={xacNhan} khoa={cho > 0} />
      {hoi ? <HoiXoa tieu={nd('chuky.tenXoa')} loai={nd('chuky.loaiXoa')} xoa={quen} huy={() => datHoi(false)} />
        : <div className="tl-acts" style={{ justifyContent: 'center', marginTop: 16 }}><span {...bam(() => datHoi(true))} {...ndDau('chuky.quen')}>{nd('chuky.quen')}</span></div>}
    </>
  );
}

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

function ChiTiet({ homNay, bang, luuBao, datForm, hoiTat, datHoiTat, tat }) {
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
      <div className="tl-row"><div className="tl-rt"><b {...ndDau('chuky.khoaTieu')}>{nd('chuky.khoaTieu')}</b><small {...ndDau('chuky.khoaPhu')}>{nd('chuky.khoaPhu')}</small></div>
        <div className={`switch${ck.khoa ? ' on' : ''}`} role="switch" aria-checked={!!ck.khoa} aria-label={nd('chuky.khoaTieu')} tabIndex={0}
          onClick={() => (ck.khoa ? luuBao(datKhoaChuKy(bang, null), nd('chuky.daTatKhoa')) : datForm('ma'))} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }} /></div>
      <div className="tl-note" {...ndDau('chuky.ghiChu')}><Ico ten="warning" s={13} /> {nd('chuky.ghiChu')}</div>
      {hoiTat ? <HoiXoa tieu={nd('chuky.tenXoa')} loai={nd('chuky.loaiXoa')} xoa={tat} huy={() => datHoiTat(false)} />
        : <div className="tl-acts" style={{ justifyContent: 'center' }}><span {...bam(() => datHoiTat(true))} {...ndDau('chuky.tat')}>{nd('chuky.tat')}</span></div>}
    </>
  );
}

/** Tiện ích Chu kỳ (/kehoach/chuky): riêng tư, chỉ lưu trên máy; có thể khoá bằng mã 4 số riêng. Ô này ẩn với xưng hô anh / chú / bác / ông (KeHoach.jsx). */
export default function ChuKy({ homNay, san = true, veLich }) {
  const { bang, luuBao, tb, datTb } = dungLuuBao(san);
  const [form, datForm] = useState(null); // 'ngay' | 'ma'
  const [mo, datMo] = useState(false);    // đã nhập đúng mã trong lần mở này
  const [hoiTat, datHoiTat] = useState(false);
  const ck = bang.chuKy, khoaDong = ck.bat && ck.khoa && !mo;
  const tat = () => { if (luuBao(tatChuKy(bang), nd('chuky.daTat'))) { datHoiTat(false); datMo(false); } };
  return (
    <Man id="tool">
      <DauMan tieuDe={nd('chuky.tieuDe')} phu={nd('chuky.phu')} lui={veLich} />
      <div id="toolBody">
        {!ck.bat && (
          <div className="cyc-off"><TranhTienIch ten="moon" s={56} /><b {...ndDau('chuky.offTieu')}>{nd('chuky.offTieu')}</b><p {...ndDau('chuky.offMo')}>{nd('chuky.offMo')}</p>
            <button type="button" className="checkout-btn giua" onClick={() => datForm('ngay')} {...ndDau('chuky.bat')}>{nd('chuky.bat')}</button></div>
        )}
        {khoaDong && <HoiMa bang={bang} luuBao={luuBao} mo={() => datMo(true)} quen={tat} />}
        {ck.bat && !khoaDong && <ChiTiet homNay={homNay} bang={bang} luuBao={luuBao} datForm={datForm} hoiTat={hoiTat} datHoiTat={datHoiTat} tat={tat} />}
      </div>
      {form === 'ngay' && <HoiNgay homNay={homNay} bang={bang} luuBao={luuBao} datTb={datTb} dong={() => datForm(null)} />}
      {form === 'ma' && <DatMa bang={bang} luuBao={luuBao} datTb={datTb} dong={() => datForm(null)} mo={() => datMo(true)} />}
      <Thongbao chu={tb} het={() => datTb('')} />
    </Man>
  );
}
