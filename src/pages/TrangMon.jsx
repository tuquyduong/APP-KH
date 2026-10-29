import { dinhDangGia } from '../dinhDang.js';
import { noiDungMon, bieuTuongNhom } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { NHU_CAU } from '../noiDung/nhuCau.js';
import Man, { NutQR } from '../components/Man.jsx';
import { AnhMon, DongTonCu } from '../components/MonO.jsx';
import { Ico, En } from '../components/BieuTuong.jsx';

// Trang món theo demo (detail): ảnh, nhóm, tên, giá, nhãn nhu cầu, mô tả, thành phần, công dụng — từ noiDung/mon.js theo mã món.
// Không nút giỏ, không chọn cỡ / đường / topping (chưa có đặt hàng — KH-MUA-1); giá 3 hạng → KH-UI-3. Món chưa có nội dung: chỉ tên + giá + nhóm.
export default function TrangMon({ mon, lui, moQR }) {
  const nd = noiDungMon(MON, mon.ma);
  const nhom = bieuTuongNhom(mon.nhom);
  const gia = dinhDangGia(mon.gia);
  const nhuCau = (nd?.nhuCau || []).map((t) => NHU_CAU.find((n) => n.ten === t)).filter(Boolean);
  return (
    <Man id="detail">
      <div className="topbar">
        <button type="button" className="back-btn" aria-label="Quay lại" onClick={lui}><Ico ten="back" s={18} /></button>
        <NutQR moQR={moQR} />
      </div>
      <div className="detail-hero" style={{ background: nhom.bg }}>
        <AnhMon mon={mon} s={120} />
        <i className="ring" />
        {mon.con_hang === false && <div className="stock-out">Hết hàng</div>}
      </div>
      <div className="detail-cat"><En ten={nhom.ic} s={14} /> {mon.nhom || 'Khác'}</div>
      <div className="detail-name">{mon.ten}</div>
      {gia && <div className="detail-price-row"><span className="now">{gia}</span></div>}
      <DongTonCu mon={mon} />
      {nhuCau.length > 0 && (
        <div className="benefit-row">
          {nhuCau.map((n) => <div className="benefit-chip" key={n.ten}><Ico ten={n.bieuTuong} s={14} lop="ico-pink" /> {n.ten}</div>)}
        </div>
      )}
      {nd?.moTa && <div className="detail-desc">{nd.moTa}</div>}
      {nd?.thanhPhan && <div className="detail-ingr"><b>Thành phần:</b> {nd.thanhPhan}</div>}
      {nd?.congDung && <div className="detail-ingr"><b>Công dụng:</b> {nd.congDung}</div>}
    </Man>
  );
}
