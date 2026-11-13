import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../giaoDien/gio_xoa.css';
import { dinhDangGia } from '../dinhDang.js';
import { bieuTuongNhom } from '../menuLoc.js';
import { chenDong, coDoUong, demMon, doiSoLuong, duocThanhToan, giaHinhDung, laThe, trangThaiDong, xoaDong } from '../gio.js';
import { dungBaoGia } from '../dungDatDon.js';
import { tenGiam } from '../datDon.js';
import { dungGia } from '../heThong.js';
import Man from '../components/Man.jsx';
import Chu from '../components/Chu.jsx';
import { nd, ndPhan, ndDau, ndHien } from '../noiDung/nd.js';
import { AnhMon } from '../components/MonO.jsx';
import { Ico, En, Med } from '../components/BieuTuong.jsx';

// Giỏ hàng theo demo (cart). Khách chưa đăng nhập vẫn thêm / xem giỏ; "Tiếp tục" → Thanh toán (cần đăng nhập, App tự đưa qua /dangnhap?tiep=).
// Mã giảm: POS áp (dòng giảm loai "ma_giam") → nút "✓ Đã áp dụng" như demo; không áp → hiện `ma_giam_loi.error` dưới ô mã.
// App KHÔNG tính tiền: giá trên dòng = giá một ly (như Menu) × số lượng, chỉ để hình dung; tạm tính / giảm / phí / tổng CHỈ từ báo giá POS.

/** Bảng tiền (demo cartSum / bảng ở checkout): mọi số lấy nguyên từ báo giá POS; chưa có báo giá → một dòng chờ, không số. */
export function BangTien({ bg, loi }) {
  const { hangToi } = dungGia();
  return (
    <div className="card bang-tien">
      {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loi}</div></div>}
      {bg ? (
        <>
          {bg.tamTinh !== null && <div className="summary-row"><Chu k="gio.tienHang" /><span {...ndDau('gio.tien')}>{dinhDangGia(bg.tamTinh)}</span></div>}
          {bg.giam.map((g, i) => <div className="summary-row discount" key={i}><span>{tenGiam(g.loai, hangToi && hangToi.ten)}</span><span>−{dinhDangGia(g.soTien)}</span></div>)}
          {bg.phiGiao > 0 && <div className="summary-row"><Chu k="gio.phiGiao" /><span {...ndDau('gio.tien')}>{dinhDangGia(bg.phiGiao)}</span></div>}
          <div className="summary-row total"><Chu k="gio.tong" /><span {...ndDau('gio.tien')}>{dinhDangGia(bg.tong)}</span></div>
        </>
      ) : <div className="summary-row"><Chu k="gio.chuaTong" /></div>}
    </div>
  );
}

const GIAY_HOAN_TAC = 5000; // thông báo "Đã xoá … · Hoàn tác" hiện ngần này mili-giây

/** Thông báo nổi có nút (khuôn `.toast` của demo, như Thongbao.jsx). `daXoa` rỗng = không hiện. */
function ThongBaoXoa({ daXoa, hoanTac, het }) {
  useEffect(() => {
    if (!daXoa) return undefined;
    const h = setTimeout(het, GIAY_HOAN_TAC);
    return () => clearTimeout(h);
  }, [daXoa]);
  if (!daXoa || typeof document === 'undefined') return null;
  return createPortal(
    <div className="toast show wrap co-nut" role="status" {...ndDau('gio.daXoa')}>{ndPhan('gio.daXoa', { ten: daXoa.ten })}<button type="button" onClick={hoanTac} {...ndDau('gio.hoanTac')}>{nd('gio.hoanTac')}</button></div>,
    document.querySelector('.phone') || document.body,
  );
}

/** Tên dòng thẻ: "Thẻ hội viên <hạng> · N tháng"; hạng không còn trong /hang → "Thẻ hội viên". */
const tenThe = (dong, hang) => (hang ? nd('gio.the.ten', { hang: hang.ten, so: dong.so_thang }) : nd('gio.the.chung'));

/** Dòng thẻ hạng (KH-THE-1 C2): biểu tượng thẻ, giá gói của /hang để hình dung, xoá + Hoàn tác; KHÔNG ô số lượng / ghi chú. */
function DongThe({ dong, i, dsHang, loiPos, xoa }) {
  const { hang, goi, conBan } = trangThaiDong(dong, null, dsHang);
  const canhBao = loiPos || (Array.isArray(dsHang) && !conBan ? nd('gio.the.khongBan') : '');
  return (
    <div className="cart-item">
      <button type="button" className="cart-xoa" aria-label={nd('gio.the.xoaAria')} onClick={() => xoa(i)}><Ico ten="close" s={14} /></button>
      <div className="cart-thumb"><Med ten="card" s={40} /></div>
      <div className="cart-info">
        <div className="cart-name" {...ndDau(hang ? 'gio.the' : 'gio.the.chung')}>{tenThe(dong, hang)}</div>
        {canhBao && <div className="cart-opt"><b {...(loiPos ? {} : ndDau('gio.the.khongBan'))}>{canhBao}</b></div>}
        {goi && <div className="cart-price" {...ndDau('gio.the')}>{dinhDangGia(goi.gia)}</div>}
      </div>
    </div>
  );
}

function DongGio({ dong, i, gio, ds, doi, loiPos, xoa }) {
  const { tt, maGv, hangToi } = dungGia();
  const { mon, conBan } = trangThaiDong(dong, ds);
  const dangGv = !!mon && !!tt && tt.pha === 'dang' && maGv.has(mon.ma); // như Menu: món đang Giờ vàng hiện giá gốc, không giá hạng
  const gia = mon ? giaHinhDung(mon, dangGv ? null : hangToi, dong.so_luong) : null;
  const coMenu = ds.length > 0; // chưa có menu (đang tải / POS đòi đăng nhập) → chưa biết món còn bán không: không cảnh báo, không giá
  const canhBao = loiPos || (coMenu && !conBan ? (mon ? nd('gio.hetHang') : nd('gio.khongCon')) : ''); // loiPos: POS vừa báo HET_HANG / MON_KHONG_BAN cho mã này
  return (
    <div className="cart-item">
      <button type="button" className="cart-xoa" aria-label={nd('gio.xoaAria')} onClick={() => xoa(i)}><Ico ten="close" s={14} /></button>
      <div className="cart-thumb" style={mon ? { background: bieuTuongNhom(mon.nhom).bg } : undefined}>{mon ? <AnhMon mon={mon} s={40} /> : <Ico ten="package" s={28} />}</div>
      <div className="cart-info">
        <div className="cart-name" {...ndDau(mon ? 'gio.mon' : coMenu ? 'gio.ngungBan' : 'gio.mon')}>{mon ? mon.ten : coMenu ? nd('gio.ngungBan') : dong.ma}</div>
        {(canhBao || dong.ghi_chu) && <div className="cart-opt">{canhBao && <b {...(loiPos ? {} : ndDau(mon ? 'gio.hetHang' : 'gio.khongCon'))}>{canhBao}</b>}{canhBao && dong.ghi_chu && ' · '}{dong.ghi_chu && `“${dong.ghi_chu}”`}</div>}
        {gia !== null && <div className="cart-price" {...ndDau('gio.mon')}>{dinhDangGia(gia)}</div>}
      </div>
      <div className="qty-ctrl">
        <button type="button" aria-label={nd('khung.bot')} onClick={() => doi(doiSoLuong(gio, i, dong.so_luong - 1))}>−</button>
        <span>{dong.so_luong}</span>
        <button type="button" aria-label={nd('khung.them')} onClick={() => doi(doiSoLuong(gio, i, dong.so_luong + 1))}>+</button>
      </div>
    </div>
  );
}

export default function GioHang({ gio, ds, doi, dangNhap, maGiam, datMaGiam, tiepTuc, moMenu, monLoi, traTheTruoc }) {
  const [o, datO] = useState(maGiam);
  const [daXoa, datDaXoa] = useState(null); // { dong, vitri, ten } của món vừa xoá — để Hoàn tác
  const { dsHang } = dungGia();
  const coMenu = ds.length > 0 || !coDoUong(gio); // giỏ chỉ thẻ không cần menu
  const tenDong = (d) => (laThe(d) ? tenThe(d, trangThaiDong(d, null, dsHang).hang) : trangThaiDong(d, ds).mon?.ten || nd('gio.monChung'));
  const xoaMon = (i) => { const d = gio[i]; datDaXoa({ dong: d, vitri: i, ten: tenDong(d) }); doi(xoaDong(gio, i)); };
  const hoanTac = () => { doi(chenDong(gio, daXoa.dong, daXoa.vitri)); datDaXoa(null); };
  const coThe = coMenu ? duocThanhToan(gio, ds, dsHang) : gio.length > 0; // chưa có menu: vẫn cho đi tiếp (đăng nhập), Thanh toán kiểm lại khi có menu
  const { bg, loi } = dungBaoGia(gio, { maGiam }, dangNhap && coMenu && coThe);
  const dongThe = gio.find(laThe);
  const goiTruoc = !!dongThe && coDoUong(gio) && ndHien('hien.gio.truocThe'); // C3: thẻ + đồ uống → gợi ý trả thẻ trước (đơn riêng)
  const theBan = !!dongThe && trangThaiDong(dongThe, null, dsHang).conBan;
  const daApMa = !!maGiam && o.trim() === maGiam && !!bg && bg.giam.some((g) => g.loai === 'ma_giam');
  return (
    <Man id="cart">
      <div className="topbar"><div><Chu k="gio.tieuDe" as="h1" />{gio.length > 0 && <div className="sub" {...ndDau('gio.soMon')}>{ndPhan('gio.soMon', { so: demMon(gio) })}</div>}</div></div>
      {gio.length === 0 ? (
        <div className="empty-cart">
          <En ten="basket" s={84} />
          <Chu k="gio.rong.t" as="div" className="t" />
          <Chu k="gio.rong.s" as="div" className="s" />
          <button type="button" className="ghost-btn" onClick={moMenu} {...ndDau('gio.rong.nut')}>{nd('gio.rong.nut')}</button>
        </div>
      ) : (
        <>
          {gio.map((d, i) => (laThe(d)
            ? <DongThe key="the" dong={d} i={i} dsHang={dsHang} loiPos={monLoi && monLoi.the ? monLoi.chu : ''} xoa={xoaMon} />
            : <DongGio key={`${d.ma}|${d.ghi_chu}`} dong={d} i={i} gio={gio} ds={ds} doi={doi} loiPos={monLoi && !monLoi.the && monLoi.ma === d.ma ? monLoi.chu : ''} xoa={xoaMon} />))}
          {goiTruoc && (
            <>
              <Chu k="gio.truocThe.chu" as="div" className="care-disclaimer" />
              <button type="button" className={`ghost-btn${theBan ? '' : ' btn-disabled'}`} aria-disabled={!theBan} onClick={theBan ? traTheTruoc : undefined} {...ndDau('gio.truocThe.nut')}>{nd('gio.truocThe.nut')}</button>
            </>
          )}
          <div className="promo-box">
            <input placeholder={nd('gio.ma.goiY')} aria-label={nd('gio.ma.aria')} {...ndDau('gio.ma.goiY')} maxLength={30} value={o} onChange={(e) => datO(e.target.value)} />
            <button type="button" onClick={() => datMaGiam(o.trim())} {...ndDau(daApMa ? 'gio.ma.daAp' : 'gio.ma.ap')}>{nd(daApMa ? 'gio.ma.daAp' : 'gio.ma.ap')}</button>
          </div>
          {bg && bg.maGiamLoi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau('gio.maLoi')}>{bg.maGiamLoi.error}</div></div>}
          <BangTien bg={bg} loi={loi} />
          <button type="button" className={`checkout-btn${coThe ? '' : ' btn-disabled'}`} aria-disabled={!coThe} onClick={coThe ? tiepTuc : undefined}>
            <span {...ndDau('gio.tiepTuc')}>{nd('gio.tiepTuc')}</span><span>{bg ? `${dinhDangGia(bg.tong)} →` : '→'}</span>
          </button>
        </>
      )}
      <ThongBaoXoa daXoa={daXoa} hoanTac={hoanTac} het={() => datDaXoa(null)} />
    </Man>
  );
}
