import { useState } from 'react';
import { dinhDangGia } from '../dinhDang.js';
import { bieuTuongNhom } from '../menuLoc.js';
import { demMon, doiSoLuong, duocThanhToan, giaHinhDung, trangThaiDong } from '../gio.js';
import { dungBaoGia } from '../dungDatDon.js';
import { dungGia } from '../heThong.js';
import Man from '../components/Man.jsx';
import { AnhMon } from '../components/MonO.jsx';
import { Ico, En } from '../components/BieuTuong.jsx';

// Giỏ hàng theo demo (cart). Khách chưa đăng nhập vẫn thêm / xem giỏ; "Tiếp tục" → Thanh toán (cần đăng nhập, App tự đưa qua /dangnhap?tiep=).
// App KHÔNG tính tiền: giá trên dòng = giá một ly (như Menu) × số lượng, chỉ để hình dung; tạm tính / giảm / phí / tổng CHỈ từ báo giá POS.
const CHU_CHUA_TONG = 'Tổng tiền sẽ hiện khi quán xác nhận';

/** Bảng tiền (demo cartSum / bảng ở checkout): mọi số lấy nguyên từ báo giá POS; chưa có báo giá → một dòng chờ, không số. */
export function BangTien({ bg, loi }) {
  return (
    <div className="card bang-tien">
      {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loi}</div></div>}
      {bg ? (
        <>
          {bg.tamTinh !== null && <div className="summary-row"><span>Tiền hàng</span><span>{dinhDangGia(bg.tamTinh)}</span></div>}
          {bg.giam.map((g, i) => <div className="summary-row discount" key={i}><span>Giảm giá</span><span>−{dinhDangGia(g.soTien)}</span></div>)}
          {bg.phiGiao > 0 && <div className="summary-row"><span>Phí giao</span><span>{dinhDangGia(bg.phiGiao)}</span></div>}
          <div className="summary-row total"><span>Tổng cộng</span><span>{dinhDangGia(bg.tong)}</span></div>
        </>
      ) : <div className="summary-row"><span>{CHU_CHUA_TONG}</span></div>}
    </div>
  );
}

function DongGio({ dong, i, gio, ds, doi }) {
  const { tt, maGv, hangToi } = dungGia();
  const { mon, conBan } = trangThaiDong(dong, ds);
  const dangGv = !!mon && !!tt && tt.pha === 'dang' && maGv.has(mon.ma); // như Menu: món đang Giờ vàng hiện giá gốc, không giá hạng
  const gia = mon ? giaHinhDung(mon, dangGv ? null : hangToi, dong.so_luong) : null;
  const coMenu = ds.length > 0; // chưa có menu (đang tải / POS đòi đăng nhập) → chưa biết món còn bán không: không cảnh báo, không giá
  const canhBao = coMenu && !conBan ? (mon ? 'Hết hàng' : 'Không còn trong menu') : '';
  return (
    <div className="cart-item">
      <div className="cart-thumb" style={mon ? { background: bieuTuongNhom(mon.nhom).bg } : undefined}>{mon ? <AnhMon mon={mon} s={40} /> : <Ico ten="package" s={28} />}</div>
      <div className="cart-info">
        <div className="cart-name">{mon ? mon.ten : coMenu ? 'Món đã ngừng bán' : dong.ma}</div>
        {(canhBao || dong.ghi_chu) && <div className="cart-opt">{canhBao && <b>{canhBao}</b>}{canhBao && dong.ghi_chu && ' · '}{dong.ghi_chu && `“${dong.ghi_chu}”`}</div>}
        {gia !== null && <div className="cart-price">{dinhDangGia(gia)}</div>}
      </div>
      <div className="qty-ctrl">
        <button type="button" aria-label="Bớt một" onClick={() => doi(doiSoLuong(gio, i, dong.so_luong - 1))}>−</button>
        <span>{dong.so_luong}</span>
        <button type="button" aria-label="Thêm một" onClick={() => doi(doiSoLuong(gio, i, dong.so_luong + 1))}>+</button>
      </div>
    </div>
  );
}

export default function GioHang({ gio, ds, doi, dangNhap, maGiam, datMaGiam, tiepTuc, moMenu }) {
  const [o, datO] = useState(maGiam);
  const coMenu = ds.length > 0;
  const coThe = coMenu ? duocThanhToan(gio, ds) : gio.length > 0; // chưa có menu: vẫn cho đi tiếp (đăng nhập), Thanh toán kiểm lại khi có menu
  const { bg, loi } = dungBaoGia(gio, { maGiam, cachNhan: 'tai_quan' }, dangNhap && coMenu && coThe);
  const daApDung = !!maGiam && maGiam === o.trim() && !!bg && bg.giam.length > 0; // "Đã áp dụng" chỉ khi POS báo có giảm
  return (
    <Man id="cart">
      <div className="topbar"><div><h1>Giỏ hàng</h1>{gio.length > 0 && <div className="sub">{demMon(gio)} món</div>}</div></div>
      {gio.length === 0 ? (
        <div className="empty-cart">
          <En ten="basket" s={84} />
          <div className="t">Giỏ hàng đang trống</div>
          <div className="s">Chọn một món trà hợp tiết trời hôm nay nhé</div>
          <button type="button" className="ghost-btn" onClick={moMenu}>Xem Menu</button>
        </div>
      ) : (
        <>
          {gio.map((d, i) => <DongGio key={`${d.ma}|${d.ghi_chu}`} dong={d} i={i} gio={gio} ds={ds} doi={doi} />)}
          <div className="promo-box">
            <input placeholder="Nhập mã giảm giá" aria-label="Mã giảm giá" maxLength={30} value={o} onChange={(e) => datO(e.target.value)} />
            <button type="button" onClick={() => datMaGiam(o.trim())}>{daApDung ? '✓ Đã áp dụng' : 'Áp dụng'}</button>
          </div>
          <BangTien bg={bg} loi={loi} />
          <button type="button" className={`checkout-btn${coThe ? '' : ' btn-disabled'}`} aria-disabled={!coThe} onClick={coThe ? tiepTuc : undefined}>
            <span>Tiếp tục · chọn cách nhận hàng</span><span>{bg ? `${dinhDangGia(bg.tong)} →` : '→'}</span>
          </button>
        </>
      )}
    </Man>
  );
}
