import { useEffect, useRef, useState } from 'react';
import { Ico } from './BieuTuong.jsx';
import { bam } from './bam.js';
import BangNoi from './BangNoi.jsx';
import HoiXoa from './HoiXoa.jsx';
import { BanhGio, BanhNhac, BanhNgay } from './BanhXoay.jsx';
import { WD } from '../noiDung/coDinh/lich.js';
import { nd, ndPhan, ndDau } from '../noiDung/nd.js';
import { amLichChu, docNgay, ngayChuoi, thongTinNgay, themViec, suaViec, xoaViec } from '../kehoach.js';
import {
  SAU_NGAY, NHAC_CO_GIO, NHAC_CA_NGAY, chuLap, chuNhac, chuHan, moTaLap, donViLap, hangLap, nhacRaPhut, nhacTuPhut, tachNhanh, tickLan, viecNgay, jd, dm, dmNgan,
} from '../kehoachLap.js';

const GIO_MAC_DINH = '08:00';
const NHAC_KHAC_MAC_DINH = { k: 'luc', ngay: 1, g: '20:00' }; // "Chọn ngày giờ khác…" bắt đầu ở: hôm trước lúc 20:00
const LAP_HANG = ['ngay', 'tuan', 'thang', 'nam']; // chữ "Hằng …" ở danh mục (hangLap)
const DON_VI = ['ngay', 'tuan', 'thang']; // chữ ngày / tuần / tháng ở danh mục (donViLap)
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const tuongTac = (f) => ({ role: 'button', tabIndex: 0, onClick: f, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } } });
const Chip = ({ on, f, children }) => <div className={`filter-pill${on ? ' active' : ''}`} {...tuongTac(f)}>{children}</div>;

/** Một việc trong danh sách (dùng ở bảng ngày, dưới lịch, kết quả tìm): tick · giờ · tên ↻ · hạn bằng chữ · 🔔. Chạm tên → `mo`. */
export function HangViec({ v, homNay, tick, mo }) {
  const han = chuHan(v.ngay, v.xong, homNay), nh = typeof v.nhac === 'number' ? chuNhac(nhacTuPhut(v.nhac, v.gio)) : '';
  return (
    <div className={`ag${v.xong ? ' done' : ''}`}>
      <span className="ck" role="button" tabIndex={0} aria-label={nd(v.xong ? 'bn.boXongAria' : 'bn.xongAria')} {...bam(tick)}>{v.xong ? <Ico ten="check" s={12} /> : null}</span>
      {v.gio && <span className="tm">{v.gio}</span>}
      <div className="ti" role="button" tabIndex={0} onClick={mo} onKeyDown={(e) => { if (e.key === 'Enter') mo(); }}>
        <b>{v.tieu}{v.lap ? ' ↻' : ''}</b>
        <small><span className={han.qua && !v.xong ? 'han-qua' : ''}>{han.chu}</span>{nh && <> · <Ico ten="bell" s={11} /> {nh}</>}</small>
        {v.lap && <small>{moTaLap({ ngay: v.goc, lap: v.lap }, homNay)}</small>}
      </div>
    </div>
  );
}

/** Ô gõ tên + 3 nút (Giờ sự kiện · Hẹn giờ nhắc · Lặp lại) + khung chọn. `viec` có = đang sửa. `gui(nhap)` trả lời lỗi (chữ) hoặc ''. */
function BieuMau({ homNay, viec, gui, xoa, thoat }) {
  const [tieu, datTieu] = useState(viec ? viec.tieu : '');
  const [gio, datGio] = useState(viec ? viec.gio : '');
  const [nhac, datNhac] = useState(viec ? nhacTuPhut(viec.nhac, viec.gio) : null); // dạng tương đối; đổi ra phút khi lưu
  const [lap, datLap] = useState(viec && viec.lap ? viec.lap : null);
  const [mo, datMo] = useState(''); // khung đang mở: '' | 'gio' | 'nhac' | 'lap'
  const [khac, datKhac] = useState(false);
  const [moiN, datMoiN] = useState(!!(viec && viec.lap && viec.lap.n > 1 && viec.lap.k !== 'sau'));
  const [loi, datLoi] = useState('');
  const [ngay, datNgay] = useState(viec ? viec.ngay : ''); // ô Ngày (chỉ khi sửa)
  const [boNgay, datBoNgay] = useState(false); // "Không phải ngày": giữ nguyên chữ đã gõ
  const [hoiXoa, datHoiXoa] = useState(false);
  const oTen = useRef(null);
  useEffect(() => { const h = setTimeout(() => oTen.current && !viec && oTen.current.focus(), 50); return () => clearTimeout(h); }, []);

  const moKhung = (k) => {
    datMo(mo === k ? '' : k); datKhac(false);
    if (k === 'gio' && mo !== 'gio' && !gio) { datGio(GIO_MAC_DINH); if (!nhac) datNhac({ k: 'truoc', p: 0 }); } // đặt giờ mà chưa nhắc → nhắc đúng giờ
  };
  const boGio = () => { datGio(''); datMo(''); if (nhac && nhac.k === 'truoc') datNhac(null); };
  const luu = () => {
    const nhap = viec ? { tieu, ngay, gio, nhac: nhacRaPhut(nhac, gio), lap } : { ...tachNhanh(tieu, homNay, boNgay), gio, nhac: nhacRaPhut(nhac, gio), lap };
    const l = gui(nhap);
    if (l) { datLoi(l); return; }
    if (!viec) { datTieu(''); datGio(''); datNhac(null); datLap(null); datMo(''); datMoiN(false); datLoi(''); datBoNgay(false); if (oTen.current) oTen.current.focus(); }
  };
  const datL = (k, n) => datLap({ k, n, den: lap ? lap.den : '' });
  const modeLap = !lap ? 'khong' : lap.k === 'amlich' ? 'amlich' : lap.k === 'sau' ? 'sau' : moiN || lap.n > 1 ? 'moi' : 'hang';
  const hieuNgay = !viec && !boNgay ? tachNhanh(tieu, homNay, false).ngay : ''; // gõ "Uống 1/2": báo trước ngày App hiểu
  const nhanNut = [gio ? nd('bn.gioDat', { gio }) : nd('bn.gioChua'), nhac ? nd('bn.nhacDat', { nhac: chuNhac(nhac) }) : nd('bn.nhacChua'), lap ? nd('bn.lapDat', { lap: chuLap(lap) }) : nd('bn.lapChua')];
  const khoaNut = [gio ? 'bn.gioDat' : 'bn.gioChua', nhac ? 'bn.nhacDat' : 'bn.nhacChua', lap ? 'bn.lapDat' : 'bn.lapChua'];
  const dangDat = [!!gio, !!nhac, !!lap], khungDong = <button type="button" className="bn-xong" onClick={() => datMo('')} {...ndDau('bn.xong')}>{nd('bn.xong')}</button>;

  return (
    <div className="bn-them">
      <div className="bn-o">
        <input type="text" id="addTitle" ref={oTen} placeholder={nd('bn.goiY')} maxLength={120} aria-label={nd('bn.tenAria')} value={tieu}
          onChange={(e) => { datTieu(e.target.value); datLoi(''); datBoNgay(false); }} onKeyDown={(e) => { if (e.key === 'Enter') luu(); }} />
        <button type="button" className="bn-them-nut" onClick={luu} {...ndDau(viec ? 'ti.luu' : 'bn.them')}>{nd(viec ? 'ti.luu' : 'bn.them')}</button>
      </div>
      {hieuNgay && <div className="bn-xem-ngay" {...ndDau('bn.seXep')}>{ndPhan('bn.seXep', { ngay: dm(jd(docNgay(hieuNgay)), homNay) })}<button type="button" onClick={() => datBoNgay(true)} {...ndDau('bn.khongPhaiNgay')}>{nd('bn.khongPhaiNgay')}</button></div>}
      {viec && (
        <div className="bn-ngay-sua">
          <small {...ndDau('bn.ngay')}>{nd('bn.ngay')}</small><BanhNgay ngay={ngay} homNay={homNay} doi={datNgay} />
          {lap && lap.k !== 'sau' && ngay !== viec.ngay && <small {...ndDau('bn.tinhLai')}>{nd('bn.tinhLai')}</small>}
        </div>
      )}
      <div className="bn-hang">
        {['gio', 'nhac', 'lap'].map((k, i) => <div key={k} className={`filter-pill${dangDat[i] ? ' dat' : ''}${mo === k ? ' active' : ''}`} {...tuongTac(() => moKhung(k))} {...ndDau(khoaNut[i])}>{nhanNut[i]}</div>)}
      </div>
      {mo === 'gio' && (
        <div className="bn-khung">
          <BanhGio gio={gio || GIO_MAC_DINH} doi={datGio} />
          <div className="bn-cuoi"><button type="button" className="bn-phu" onClick={boGio} {...ndDau('bn.caNgay')}>{nd('bn.caNgay')}</button>{khungDong}</div>
        </div>
      )}
      {mo === 'nhac' && (
        <div className="bn-khung">
          <div className="bn-chips">
            {(gio ? NHAC_CO_GIO : NHAC_CA_NGAY).map((x) => <Chip key={chuNhac(x)} on={!khac && same(x, nhac)} f={() => { datNhac(x); datKhac(false); }}>{gio ? chuNhac(x) : x.ngay ? nd('bn.toiTruoc', { g: x.g }) : nd('bn.sangCung', { g: x.g })}</Chip>)}
            <Chip on={khac} f={() => { datKhac(true); if (!nhac || nhac.k !== 'luc') datNhac(NHAC_KHAC_MAC_DINH); }} {...ndDau('bn.chonKhac')}>{nd('bn.chonKhac')}</Chip>
            <Chip on={!nhac} f={() => { datNhac(null); datKhac(false); }} {...ndDau('kh.khongNhac')}>{nd('kh.khongNhac')}</Chip>
          </div>
          {khac && nhac && nhac.k === 'luc' && <BanhNhac k={nhac} doi={(x) => datNhac({ k: 'luc', ...x })} />}
          <div className="bn-cuoi"><small {...ndDau('bn.nhacGhiChu')}>{nd('bn.nhacGhiChu')}</small>{khungDong}</div>
        </div>
      )}
      {mo === 'lap' && (
        <div className="bn-khung">
          <div className="bn-chips">
            <Chip on={modeLap === 'khong'} f={() => { datLap(null); datMoiN(false); }} {...ndDau('lap.khong')}>{nd('lap.khong')}</Chip>
            {LAP_HANG.map((k) => <Chip key={k} on={modeLap === 'hang' && lap.k === k} f={() => { datL(k, 1); datMoiN(false); }}>{hangLap(k)}</Chip>)}
            <Chip on={modeLap === 'moi'} f={() => { datMoiN(true); datL(lap && DON_VI.includes(lap.k) ? lap.k : 'ngay', lap && lap.n > 1 && lap.k !== 'sau' ? lap.n : 2); }} {...ndDau('bn.moiN')}>{nd('bn.moiN')}</Chip>
            <Chip on={modeLap === 'amlich'} f={() => { datL('amlich', 1); datMoiN(false); }} {...ndDau('lap.amlich')}>{nd('lap.amlich')}</Chip>
            <Chip on={modeLap === 'sau'} f={() => { datL('sau', 30); datMoiN(false); }} {...ndDau('bn.sauXong')}>{nd('bn.sauXong')}</Chip>
          </div>
          {modeLap === 'moi' && (
            <div className="bn-chips">
              <span {...ndDau('bn.moi')}>{nd('bn.moi')}</span><input type="number" min="1" max="365" inputMode="numeric" aria-label={nd('bn.soLan')} className="bn-n" value={lap.n} onChange={(e) => datL(lap.k, Math.min(365, Math.max(1, Math.floor(+e.target.value) || 1)))} />
              {DON_VI.map((k) => <Chip key={k} on={lap.k === k} f={() => datL(k, lap.n)}>{donViLap(k)}</Chip>)}
            </div>
          )}
          {modeLap === 'sau' && <div className="bn-chips">{SAU_NGAY.map((n) => <Chip key={n} on={lap.n === n} f={() => datL('sau', n)}>{ndPhan('bn.sauNgay', { n })}</Chip>)}</div>}
          {lap && (
            <label className="bn-den" {...ndDau('bn.denNgay')}>{nd('bn.denNgay')}
              <input type="date" aria-label={nd('bn.denNgayAria')} value={lap.den} onChange={(e) => datLap({ ...lap, den: e.target.value })} />
            </label>
          )}
          <div className="bn-cuoi"><span />{khungDong}</div>
        </div>
      )}
      {loi && <div className="loi-nho" role="alert" style={{ fontSize: 12, color: 'var(--pink-dark)', margin: '6px 2px' }}>{loi}</div>}
      {viec && (hoiXoa
        ? <HoiXoa tieu={viec.tieu} lap={!!viec.lap && viec.lap.k !== 'sau'} xoa={xoa} huy={() => datHoiXoa(false)} />
        : <div className="bn-cuoi"><button type="button" className="bn-phu" onClick={thoat} {...ndDau('bn.huy')}>{nd('bn.huy')}</button><button type="button" className="bn-phu bn-xoa" onClick={() => datHoiXoa(true)} {...ndDau('bn.xoaViec')}>{nd('bn.xoaViec')}</button></div>)}
    </div>
  );
}

/** Bảng việc của MỘT ngày (bấm ngày trên lịch). `lam(bangMoi, chữ)` lưu + báo. */
export default function BangNgay({ ngay, homNay, bang, lam, dong }) {
  const n = docNgay(ngay), x = thongTinNgay(n.d, n.m, n.y);
  const [sua, datSua] = useState(null); // id việc đang sửa
  const viec = viecNgay(bang, ngay), homNayChuoi = ngayChuoi(homNay);
  const nhan = [...x.le.map((t) => ['le', t]), ...(x.tm.startsToday ? [['tiet', nd('bn.tietNhan', { tiet: x.tm.name })]] : [])];

  const them = (nhap) => {
    const ngayViec = nhap.ngay || ngay, moi = themViec(bang, { ...nhap, ngay: ngayViec });
    if (!moi) return !String(nhap.tieu || '').trim() ? nd('bn.nhapTen') : nd('bn.daDay');
    return lam(moi, ngayViec === ngay ? nd('bn.daThem', { tieu: nhap.tieu.trim() }) : nd('bn.daThemNgay', { ngay: dmNgan(jd(docNgay(ngayViec))) })) ? '' : nd('bn.chuaLuu');
  };
  const luuSua = (id) => (nhap) => {
    const moi = suaViec(bang, id, nhap);
    if (!moi) return nd('bn.nhapTen');
    if (!lam(moi, nd('bn.daLuu'))) return nd('bn.chuaLuu');
    datSua(null);
    return '';
  };
  return (
    <BangNoi tieuDe={ngay === homNayChuoi ? nd('kh.homNay') : nd('bn.tieuNgay', { thu: WD[x.wd], ngay: dm(jd(n), null).replace(/\/\d{4}$/, '') })} phu={amLichChu(n)} dong={dong} nhan={nd('bn.nhan')}>
      {nhan.length > 0 && (
        <div className="bn-muc"><h4 {...ndDau('bn.trongNgay')}>{nd('bn.trongNgay')}</h4>{nhan.map(([loai, t]) => <div key={t} className={`bn-nhan ${loai}`}>{t}</div>)}</div>
      )}
      <div className="bn-muc">
        <h4 {...ndDau('bn.viecCua')}>{ndPhan('bn.viecCua', { so: viec.length })}</h4>
        {viec.length === 0 && <div className="empty-note" {...ndDau('bn.trong')}>{nd('bn.trong')}</div>}
        {viec.map((v) => (sua === v.id
          ? <BieuMau key={v.id} homNay={homNay} viec={nhapSua(bang, v)} gui={luuSua(v.id)} thoat={() => datSua(null)}
            xoa={() => { lam(xoaViec(bang, v.id), nd('bn.daXoa', { tieu: v.tieu })); datSua(null); }} />
          : <HangViec key={v.id} v={v} homNay={homNay} mo={() => datSua(v.id)}
            tick={() => lam(tickLan(bang, v.id, v.ngay, homNay), v.xong ? nd('kh.boDau') : nd('kh.daXong', { tieu: v.tieu }))} />))}
      </div>
      {sua === null && <BieuMau homNay={homNay} gui={them} />}
    </BangNoi>
  );
}
// Việc đang sửa lấy bản GỐC (ngày bắt đầu, lặp, nhắc đã lưu), không phải bản của một lần.
const nhapSua = (bang, v) => bang.viec.find((x) => x.id === v.id) || v;
