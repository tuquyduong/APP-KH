import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { noiDungMon, bieuTuongNhom } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { NHU_CAU } from '../noiDung/nhuCau.js';
import { Ico, En } from './BieuTuong.jsx';

/** Hình món (demo PIMG): ảnh chụp nếu có trong nội dung, không thì tranh tròn theo nhóm món. */
export function AnhMon({ mon, s }) {
  const anh = noiDungMon(MON, mon.ma)?.anh;
  if (anh) return <img className="pimg" src={anh} alt="" loading="lazy" style={{ width: s, height: s }} />;
  return <En ten={bieuTuongNhom(mon.nhom).ic} s={s} />;
}

/** Nhãn nhu cầu của món (demo prod-tags): chỉ có khi nội dung món khai `nhuCau`. */
export function NhanNhuCau({ mon }) {
  const ds = (noiDungMon(MON, mon.ma)?.nhuCau || []).map((t) => NHU_CAU.find((n) => n.ten === t)).filter(Boolean);
  if (!ds.length) return null;
  return <div className="prod-tags">{ds.map((n) => <span className="pill" key={n.ten}><Ico ten={n.bieuTuong} s={11} /> {n.ten}</span>)}</div>;
}

/** Dòng "theo số lúc …" khi tồn là số cũ. */
export function DongTonCu({ mon }) {
  return mon.ton_cu && mon.ton_luc ? <div className="care-disclaimer">theo số lúc {dinhDangNgay(mon.ton_luc)}</div> : null;
}

/** Thẻ món trong lưới Menu / Trang chủ (demo prodCard). con_hang === false → "Hết hàng"; null / true → không hiện chữ. */
export default function MonO({ mon, chon }) {
  const het = mon.con_hang === false;
  const gia = dinhDangGia(mon.gia);
  return (
    <div className="prod-card" role="button" tabIndex={0} onClick={() => chon(mon)} onKeyDown={(e) => { if (e.key === 'Enter') chon(mon); }}>
      <div className={`prod-img${het ? ' dim' : ''}`} style={{ background: bieuTuongNhom(mon.nhom).bg }}>
        <AnhMon mon={mon} s={64} />
        {het && <div className="stock-out">Hết hàng</div>}
      </div>
      <div className="prod-body">
        <div className="prod-name">{mon.ten}</div>
        {gia && <div className="prod-price"><span className="now">{gia}</span></div>}
        <NhanNhuCau mon={mon} />
        <DongTonCu mon={mon} />
      </div>
    </div>
  );
}
