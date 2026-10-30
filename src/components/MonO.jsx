import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { noiDungMon, bieuTuongNhom } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { NHU_CAU } from '../noiDung/nhuCau.js';
import { Ico, En } from './BieuTuong.jsx';
import { dungGia } from '../heThong.js';
import { bacThang } from '../giaHang.js';
import { BacGia, NhanGioVang } from './GiaMon.jsx';

/** Hình món (demo PIMG): ảnh chụp nếu có trong nội dung, không thì tranh tròn theo nhóm món. */
export function AnhMon({ mon, s }) {
  const anh = noiDungMon(MON, mon.ma)?.anh;
  if (anh) return <img className="pimg" src={anh} alt="" loading="lazy" style={{ width: s, height: s }} />;
  return <En ten={bieuTuongNhom(mon.nhom).ic} s={s} />;
}

/** Nhãn của món (demo prod-tags): nhãn Giờ vàng (nếu món đang trong Giờ vàng) rồi nhãn nhu cầu khi nội dung món khai `nhuCau`. */
export function NhanNhuCau({ mon, gv }) {
  const ds = (noiDungMon(MON, mon.ma)?.nhuCau || []).map((t) => NHU_CAU.find((n) => n.ten === t)).filter(Boolean);
  if (!ds.length && !gv) return null;
  return <div className="prod-tags">{gv && <NhanGioVang tt={gv} />}{ds.map((n) => <span className="pill" key={n.ten}><Ico ten={n.bieuTuong} s={11} /> {n.ten}</span>)}</div>;
}

/** Dòng "theo số lúc …" khi tồn là số cũ. */
export function DongTonCu({ mon }) {
  return mon.ton_cu && mon.ton_luc ? <div className="care-disclaimer">theo số lúc {dinhDangNgay(mon.ton_luc)}</div> : null;
}

/** Thẻ món trong lưới Menu / Trang chủ (demo prodCard). con_hang === false → "Hết hàng"; null / true → không hiện chữ. */
export default function MonO({ mon, chon }) {
  const { tt, maGv, dsHang, hangToi } = dungGia();
  const het = mon.con_hang === false;
  const gia = dinhDangGia(mon.gia);
  const gv = tt && maGv.has(mon.ma) ? tt : null;
  const dangGv = !!gv && gv.pha === 'dang';
  const bac = dangGv ? null : bacThang(dsHang, mon, hangToi); // D5: món đang Giờ vàng không hiện giá hạng
  return (
    <div className="prod-card" role="button" tabIndex={0} onClick={() => chon(mon)} onKeyDown={(e) => { if (e.key === 'Enter') chon(mon); }}>
      <div className={`prod-img${het ? ' dim' : ''}`} style={{ background: bieuTuongNhom(mon.nhom).bg }}>
        <AnhMon mon={mon} s={64} />
        {dangGv && <span className="prod-tag">-{gv.phanTram}%</span>}
        {het && <div className="stock-out">Hết hàng</div>}
      </div>
      <div className="prod-body">
        <div className="prod-name">{mon.ten}</div>
        {bac ? <BacGia bac={bac} /> : gia && <div className="prod-price"><span className="now">{gia}</span></div>}
        <NhanNhuCau mon={mon} gv={gv} />
        <DongTonCu mon={mon} />
      </div>
    </div>
  );
}
