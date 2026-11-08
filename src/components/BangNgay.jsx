import { useEffect, useRef, useState } from 'react';
import { Ico } from './BieuTuong.jsx';
import { bam } from './bam.js';
import BangNoi from './BangNoi.jsx';
import { BanhGio, BanhNhac } from './BanhXoay.jsx';
import { WD } from '../noiDung/keHoach.js';
import { amLichChu, docNgay, ngayChuoi, thongTinNgay, themViec, suaViec, xoaViec } from '../kehoach.js';
import {
  SAU_NGAY, NHAC_CO_GIO, NHAC_CA_NGAY, chuLap, chuNhac, chuHan, moTaLap, nhacRaPhut, nhacTuPhut, tachNgayCuoi, tickLan, viecNgay, jd, dm, dmNgan,
} from '../kehoachLap.js';

const GIO_MAC_DINH = '08:00';
const NHAC_KHAC_MAC_DINH = { k: 'luc', ngay: 1, g: '20:00' }; // "Chọn ngày giờ khác…" bắt đầu ở: hôm trước lúc 20:00
const LAP_HANG = [['ngay', 'Hằng ngày'], ['tuan', 'Hằng tuần'], ['thang', 'Hằng tháng'], ['nam', 'Hằng năm']];
const DON_VI = [['ngay', 'ngày'], ['tuan', 'tuần'], ['thang', 'tháng']];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const tuongTac = (f) => ({ role: 'button', tabIndex: 0, onClick: f, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } } });
const Chip = ({ on, f, children }) => <div className={`filter-pill${on ? ' active' : ''}`} {...tuongTac(f)}>{children}</div>;

/** Một việc trong danh sách (dùng ở bảng ngày, dưới lịch, kết quả tìm): tick · giờ · tên ↻ · hạn bằng chữ · 🔔. Chạm tên → `mo`. */
export function HangViec({ v, homNay, tick, mo }) {
  const han = chuHan(v.ngay, v.xong, homNay), nh = typeof v.nhac === 'number' ? chuNhac(nhacTuPhut(v.nhac, v.gio)) : '';
  return (
    <div className={`ag${v.xong ? ' done' : ''}`}>
      <span className="ck" role="button" tabIndex={0} aria-label={v.xong ? 'Bỏ đánh dấu xong' : 'Đánh dấu xong'} {...bam(tick)}>{v.xong ? <Ico ten="check" s={12} /> : null}</span>
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
  const oTen = useRef(null);
  useEffect(() => { const h = setTimeout(() => oTen.current && !viec && oTen.current.focus(), 50); return () => clearTimeout(h); }, []);

  const moKhung = (k) => {
    datMo(mo === k ? '' : k); datKhac(false);
    if (k === 'gio' && mo !== 'gio' && !gio) { datGio(GIO_MAC_DINH); if (!nhac) datNhac({ k: 'truoc', p: 0 }); } // đặt giờ mà chưa nhắc → nhắc đúng giờ
  };
  const boGio = () => { datGio(''); datMo(''); if (nhac && nhac.k === 'truoc') datNhac(null); };
  const luu = () => {
    const nhap = viec ? { tieu, gio, nhac: nhacRaPhut(nhac, gio), lap } : { ...tachNgayCuoi(tieu, homNay), gio, nhac: nhacRaPhut(nhac, gio), lap };
    const l = gui(nhap);
    if (l) { datLoi(l); return; }
    if (!viec) { datTieu(''); datGio(''); datNhac(null); datLap(null); datMo(''); datMoiN(false); datLoi(''); if (oTen.current) oTen.current.focus(); }
  };
  const datL = (k, n) => datLap({ k, n, den: lap ? lap.den : '' });
  const modeLap = !lap ? 'khong' : lap.k === 'amlich' ? 'amlich' : lap.k === 'sau' ? 'sau' : moiN || lap.n > 1 ? 'moi' : 'hang';
  const nhanNut = [gio ? `🕘 ${gio}` : '🕘 Giờ sự kiện', nhac ? `🔔 ${chuNhac(nhac)}` : '🔔 Hẹn giờ nhắc', lap ? `↻ ${chuLap(lap)}` : '↻ Lặp lại'];
  const dangDat = [!!gio, !!nhac, !!lap], khungDong = <button type="button" className="bn-xong" onClick={() => datMo('')}>Xong</button>;

  return (
    <div className="bn-them">
      <div className="bn-o">
        <input type="text" id="addTitle" ref={oTen} placeholder="+ Thêm việc…  (vd: Mua quà 20/11)" maxLength={120} aria-label="Tên việc" value={tieu}
          onChange={(e) => { datTieu(e.target.value); datLoi(''); }} onKeyDown={(e) => { if (e.key === 'Enter') luu(); }} />
        <button type="button" className="bn-them-nut" onClick={luu}>{viec ? 'Lưu' : 'Thêm'}</button>
      </div>
      <div className="bn-hang">
        {['gio', 'nhac', 'lap'].map((k, i) => <div key={k} className={`filter-pill${dangDat[i] ? ' dat' : ''}${mo === k ? ' active' : ''}`} {...tuongTac(() => moKhung(k))}>{nhanNut[i]}</div>)}
      </div>
      {mo === 'gio' && (
        <div className="bn-khung">
          <BanhGio gio={gio || GIO_MAC_DINH} doi={datGio} />
          <div className="bn-cuoi"><button type="button" className="bn-phu" onClick={boGio}>Cả ngày (không giờ)</button>{khungDong}</div>
        </div>
      )}
      {mo === 'nhac' && (
        <div className="bn-khung">
          <div className="bn-chips">
            {(gio ? NHAC_CO_GIO : NHAC_CA_NGAY).map((x) => <Chip key={chuNhac(x)} on={!khac && same(x, nhac)} f={() => { datNhac(x); datKhac(false); }}>{gio ? chuNhac(x) : x.ngay ? `Tối hôm trước ${x.g}` : `Sáng cùng ngày ${x.g}`}</Chip>)}
            <Chip on={khac} f={() => { datKhac(true); if (!nhac || nhac.k !== 'luc') datNhac(NHAC_KHAC_MAC_DINH); }}>Chọn ngày giờ khác…</Chip>
            <Chip on={!nhac} f={() => { datNhac(null); datKhac(false); }}>Không nhắc</Chip>
          </div>
          {khac && nhac && nhac.k === 'luc' && <BanhNhac k={nhac} doi={(x) => datNhac({ k: 'luc', ...x })} />}
          <div className="bn-cuoi"><small>🔔 Nhắc hiện khi bạn đang mở App.</small>{khungDong}</div>
        </div>
      )}
      {mo === 'lap' && (
        <div className="bn-khung">
          <div className="bn-chips">
            <Chip on={modeLap === 'khong'} f={() => { datLap(null); datMoiN(false); }}>Không lặp</Chip>
            {LAP_HANG.map(([k, ten]) => <Chip key={k} on={modeLap === 'hang' && lap.k === k} f={() => { datL(k, 1); datMoiN(false); }}>{ten}</Chip>)}
            <Chip on={modeLap === 'moi'} f={() => { datMoiN(true); datL(lap && DON_VI.some(([k]) => k === lap.k) ? lap.k : 'ngay', lap && lap.n > 1 && lap.k !== 'sau' ? lap.n : 2); }}>Mỗi N…</Chip>
            <Chip on={modeLap === 'amlich'} f={() => { datL('amlich', 1); datMoiN(false); }}>Mùng 1 &amp; Rằm</Chip>
            <Chip on={modeLap === 'sau'} f={() => { datL('sau', 30); datMoiN(false); }}>Sau khi xong…</Chip>
          </div>
          {modeLap === 'moi' && (
            <div className="bn-chips">
              <span>Mỗi</span><input type="number" min="1" max="365" inputMode="numeric" aria-label="Số lần" className="bn-n" value={lap.n} onChange={(e) => datL(lap.k, Math.min(365, Math.max(1, Math.floor(+e.target.value) || 1)))} />
              {DON_VI.map(([k, ten]) => <Chip key={k} on={lap.k === k} f={() => datL(k, lap.n)}>{ten}</Chip>)}
            </div>
          )}
          {modeLap === 'sau' && <div className="bn-chips">{SAU_NGAY.map((n) => <Chip key={n} on={lap.n === n} f={() => datL('sau', n)}>{n} ngày</Chip>)}</div>}
          {lap && (
            <label className="bn-den">Đến ngày (không bắt buộc)
              <input type="date" aria-label="Đến ngày" value={lap.den} onChange={(e) => datLap({ ...lap, den: e.target.value })} />
            </label>
          )}
          <div className="bn-cuoi"><span />{khungDong}</div>
        </div>
      )}
      {loi && <div className="loi-nho" role="alert" style={{ fontSize: 12, color: 'var(--pink-dark)', margin: '6px 2px' }}>{loi}</div>}
      {viec && <div className="bn-cuoi"><button type="button" className="bn-phu" onClick={thoat}>Huỷ</button><button type="button" className="bn-phu bn-xoa" onClick={xoa}>Xoá việc</button></div>}
    </div>
  );
}

/** Bảng việc của MỘT ngày (bấm ngày trên lịch). `lam(bangMoi, chữ, hoanTac)` lưu + báo; `bao(chữ)` chỉ báo. */
export default function BangNgay({ ngay, homNay, bang, lam, bao, dong }) {
  const n = docNgay(ngay), x = thongTinNgay(n.d, n.m, n.y);
  const [sua, datSua] = useState(null); // id việc đang sửa
  const viec = viecNgay(bang, ngay), homNayChuoi = ngayChuoi(homNay);
  const nhan = [...x.le.map((t) => ['le', t]), ...(x.tm.startsToday ? [['tiet', 'Tiết ' + x.tm.name]] : [])];

  const them = (nhap) => {
    const ngayViec = nhap.ngay || ngay, moi = themViec(bang, { ...nhap, ngay: ngayViec });
    if (!moi) return !String(nhap.tieu || '').trim() ? 'Nhập tên việc trước nhé' : 'Đã đủ số việc lưu trên máy này, xoá bớt việc cũ nhé';
    lam(moi, ngayViec === ngay ? `Đã thêm: ${nhap.tieu.trim()}` : `Đã thêm vào ${dmNgan(jd(docNgay(ngayViec)))}`);
    return '';
  };
  const luuSua = (id) => (nhap) => {
    const moi = suaViec(bang, id, nhap);
    if (!moi) return 'Nhập tên việc trước nhé';
    lam(moi, 'Đã lưu việc'); datSua(null);
    return '';
  };
  return (
    <BangNoi tieuDe={ngay === homNayChuoi ? 'Hôm nay' : `${WD[x.wd]}, ${dm(jd(n), null).replace(/\/\d{4}$/, '')}`} phu={amLichChu(n)} dong={dong} nhan="Việc của ngày">
      {nhan.length > 0 && (
        <div className="bn-muc"><h4>Trong ngày</h4>{nhan.map(([loai, t]) => <div key={t} className={`bn-nhan ${loai}`}>{t}</div>)}</div>
      )}
      <div className="bn-muc">
        <h4>Việc của tôi · {viec.length} việc</h4>
        {viec.length === 0 && <div className="empty-note">Chưa có việc nào cho ngày này.</div>}
        {viec.map((v) => (sua === v.id
          ? <BieuMau key={v.id} homNay={homNay} viec={nhapSua(bang, v)} gui={luuSua(v.id)} thoat={() => datSua(null)}
            xoa={() => { lam(xoaViec(bang, v.id), `Đã xoá ${v.tieu}`, true); datSua(null); }} />
          : <HangViec key={v.id} v={v} homNay={homNay} mo={() => datSua(v.id)}
            tick={() => lam(tickLan(bang, v.id, v.ngay, homNay), v.xong ? 'Đã bỏ đánh dấu xong' : `Đã xong ${v.tieu}`, !v.xong)} />))}
      </div>
      {sua === null && <BieuMau homNay={homNay} gui={them} />}
    </BangNoi>
  );
}
// Việc đang sửa lấy bản GỐC (ngày bắt đầu, lặp, nhắc đã lưu), không phải bản của một lần.
const nhapSua = (bang, v) => bang.viec.find((x) => x.id === v.id) || v;
