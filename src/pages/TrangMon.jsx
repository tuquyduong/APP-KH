import { useState } from 'react';
import { dinhDangGia } from '../dinhDang.js';
import { noiDungMon, bieuTuongNhom } from '../menuLoc.js';
import { MON } from '../noiDung/mon.js';
import { nd, ndPhan, ndDau, ndDs } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { NutQR } from '../components/Man.jsx';
import { AnhMon, DongTonCu } from '../components/MonO.jsx';
import { Ico, En } from '../components/BieuTuong.jsx';
import { BacGiaChiTiet, GhiChuGioVang } from '../components/GiaMon.jsx';
import { dungGia } from '../heThong.js';
import { bacThang } from '../giaHang.js';
import { GHI_CHU_TOI_DA, giaHinhDung } from '../gio.js';

// Trang món theo demo (detail): ảnh, nhóm, tên, giá, nhãn nhu cầu, mô tả, thành phần, công dụng — từ noiDung/mon.js theo mã món.
// Thêm vào giỏ như demo (KH-MUA-1): ghi chú cho quán (≤ 100 ký tự), số lượng, nút "Thêm vào giỏ" kèm giá hình dung (giá một ly × số lượng).
// Chưa chọn cỡ / đường / topping (POS chưa có cửa — TOPPING-1, COMBO-1a). Món chưa có nội dung: chỉ tên + giá + nhóm.
export default function TrangMon({ mon, lui, moQR, them }) {
  const { tt, maGv, dsHang, hangToi } = dungGia();
  const [so, datSo] = useState(1);
  const [ghiChu, datGhiChu] = useState('');
  const gv = tt && maGv.has(mon.ma) ? tt : null;
  const bac = gv && gv.pha === 'dang' ? null : bacThang(dsHang, mon, hangToi); // D5: đang Giờ vàng → không giá hạng
  const ndMon = noiDungMon(MON, mon.ma);
  const nhom = bieuTuongNhom(mon.nhom);
  const gia = dinhDangGia(mon.gia);
  const het = mon.con_hang === false;
  const giaNut = giaHinhDung(mon, gv && gv.pha === 'dang' ? null : hangToi, so);
  const goc = ndDs('home.need'); // MỘT nguồn nhãn nhu cầu với Trang chủ: `ten` khớp món, `nhan` để hiện
  const nhuCau = (ndMon?.nhuCau || []).map((t) => goc.find((n) => n.ten === t)).filter(Boolean);
  return (
    <Man id="detail">
      <div className="topbar">
        <button type="button" className="back-btn" aria-label={nd('khung.quayLai')} onClick={lui}><Ico ten="back" s={18} /></button>
        <NutQR moQR={moQR} />
      </div>
      <div className="detail-hero" style={{ background: nhom.bg }}>
        <AnhMon mon={mon} s={120} />
        <i className="ring" />
        {gv && gv.pha === 'dang' && <span className="tag" {...ndDau('mon.gvNhan')}>{ndPhan('mon.gvNhan', { phanTram: gv.phanTram })}</span>}
        {mon.con_hang === false && <div className="stock-out" {...ndDau('mon.hetHang')}>{nd('mon.hetHang')}</div>}
      </div>
      <div className="detail-cat" {...ndDau('menu.nhom')}><En ten={nhom.ic} s={14} /> {mon.nhom || nd('menu.nhomKhac')}</div>
      <div className="detail-name" {...ndDau('menu.mon')}>{mon.ten}</div>
      {bac ? <BacGiaChiTiet bac={bac} /> : gia && <div className="detail-price-row"><span className="now">{gia}</span></div>}
      {gv && <GhiChuGioVang tt={gv} />}
      <DongTonCu mon={mon} />
      {nhuCau.length > 0 && (
        <div className="benefit-row">
          {nhuCau.map((n) => <div className="benefit-chip" key={n.ten}><Ico ten={n.bieuTuong} s={14} lop="ico-pink" /> {n.nhan}</div>)}
        </div>
      )}
      {ndMon?.moTa && <div className="detail-desc">{ndMon.moTa}</div>}
      {ndMon?.thanhPhan && <div className="detail-ingr"><Chu k="mon.thanhPhan" as="b" /> {ndMon.thanhPhan}</div>}
      {ndMon?.congDung && <div className="detail-ingr"><Chu k="mon.congDung" as="b" /> {ndMon.congDung}</div>}
      {them && (
        <>
          <Chu k="mon.ghiChu" as="div" className="opt-title" />
          <input className="note-in" placeholder={nd('mon.ghiChuGoiY')} aria-label={nd('mon.ghiChu')} {...ndDau('mon.ghiChuGoiY')} maxLength={GHI_CHU_TOI_DA} value={ghiChu} onChange={(e) => datGhiChu(e.target.value)} />
          <div className="detail-qty-row">
            <Chu k="mon.soLuong" as="div" className="sl-chu" />
            <div className="qty-ctrl">
              <button type="button" aria-label={nd('khung.bot')} onClick={() => datSo(Math.max(1, so - 1))}>−</button><span>{so}</span><button type="button" aria-label={nd('khung.them')} onClick={() => datSo(Math.min(99, so + 1))}>+</button>
            </div>
          </div>
          <button type="button" className={`detail-addcart${het ? ' btn-disabled' : ''}`} aria-disabled={het} onClick={het ? undefined : () => them(mon, so, ghiChu)}>
            <span {...ndDau(het ? 'mon.nutHet' : 'mon.nutThem')}>{nd(het ? 'mon.nutHet' : 'mon.nutThem')}</span><span>{giaNut !== null ? `${dinhDangGia(giaNut)} →` : '→'}</span>
          </button>
        </>
      )}
    </Man>
  );
}
