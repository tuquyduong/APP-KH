import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { noiDungMon } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';

/** Ảnh món theo nội dung; chưa có ảnh → ô nền nhẹ với logo mờ (không bịa ảnh). */
export function AnhMon({ ma, lop = '' }) {
  const anh = noiDungMon(MON, ma)?.anh;
  return (
    <div className={`anh-mon ${lop}`}>
      {anh ? <img src={anh} alt="" loading="lazy" /> : <img className="logo-trong" src="/anh/logo-nho.webp" alt="" />}
    </div>
  );
}

/** Nhãn tồn: con_hang === false → "Hết hàng"; true → không hiện chữ (hợp đồng chỉ có cờ); null → không hiện gì. */
export function NhanHetHang({ mon }) {
  return mon.con_hang === false ? <div className="nhan-xau">Hết hàng</div> : null;
}

/** Ô món trong lưới Menu / Trang chủ. */
export default function MonO({ mon, chon }) {
  return (
    <button className="mon" onClick={() => chon(mon)}>
      <AnhMon ma={mon.ma} />
      <div className="than">
        <div className="ten">{mon.ten}</div>
        <div className="gia">{dinhDangGia(mon.gia)}</div>
        <NhanHetHang mon={mon} />
        {mon.ton_cu && mon.ton_luc && <div className="phu">theo số lúc {dinhDangNgay(mon.ton_luc)}</div>}
      </div>
    </button>
  );
}
