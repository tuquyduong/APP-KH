import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../giaoDien/gio_xoa.css';
import '../giaoDien/voucher.css';
import { dinhDangGia } from '../dinhDang.js';
import { bieuTuongMon } from '../menuLoc.js';
import { chenDong, demMon, doiSoLuong, duocThanhToan, giaHinhDung, trangThaiDong, xoaDong } from '../gio.js';
import { dungBaoGia } from '../dungDatDon.js';
import { tenGiam } from '../datDon.js';
import { coMa, laShip, trangThaiVoucher } from '../voucherGio.js';
import { dungGia } from '../heThong.js';
import Man from '../components/Man.jsx';
import Chu from '../components/Chu.jsx';
import { nd, ndPhan, ndDau } from '../noiDung/nd.js';
import { AnhMon } from '../components/MonO.jsx';
import { Ico, En } from '../components/BieuTuong.jsx';

// Giỏ hàng theo demo (cart). Khách chưa đăng nhập vẫn thêm / xem giỏ; "Tiếp tục" → Thanh toán (cần đăng nhập, App tự đưa qua /dangnhap?tiep=).
// Mã giảm: POS áp (dòng giảm loai "ma_giam") → nút "✓ Đã áp dụng" như demo; không áp → hiện `ma_giam_loi.error` dưới ô mã.
// App KHÔNG tính tiền: giá trên dòng = giá một ly (như Menu) × số lượng, chỉ để hình dung; tạm tính / giảm / phí / tổng CHỈ từ báo giá POS.
// Voucher (KH-VC-2, Màn 7): App gửi MỘT mảng `vouchers` (App.jsx tính bằng dsGui) — ô tích CHỈ khi POS tính; POS không tính → câu POS màu đỏ; khách bỏ tay → không tích.

/**
 * Bảng tiền (demo cartSum / bảng ở checkout): mọi số lấy nguyên từ báo giá POS; không hỏi được → một dòng chờ, không số. Đang tính lại (KH-NHANH-2 B1): còn
 * báo giá cũ của màn → hiện số cũ MỜ + vòng nhỏ trước Tổng (nút trả tiền vẫn theo báo giá mới); chưa từng có → "Đang tính tiền…". Lỗi → không số cũ.
 */
export function BangTien({ bg, loi, bgCu, dangTinh }) {
  const { hangToi } = dungGia();
  const cu = dangTinh && !bg && !loi ? bgCu : null;
  if (cu) bg = cu;
  return (
    <div className={`card bang-tien${cu ? ' cho-mo' : ''}`} aria-busy={dangTinh || undefined}>
      {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loi}</div></div>}
      {bg ? (
        <>
          {bg.tamTinh !== null && <div className="summary-row"><Chu k="gio.tienHang" /><span {...ndDau('gio.tien')}>{dinhDangGia(bg.tamTinh)}</span></div>}
          {bg.giam.map((g, i) => <div className="summary-row discount" key={i}><span>{tenGiam(g, hangToi && hangToi.ten)}</span><span>−{dinhDangGia(g.soTien)}</span></div>)}
          {bg.phiGiao > 0 && <div className="summary-row"><Chu k="gio.phiGiao" /><span {...ndDau('gio.tien')}>{dinhDangGia(bg.phiGiao)}</span></div>}
          <div className="summary-row total"><Chu k="gio.tong" /><span>{cu && <span className="cho-xoay" aria-hidden="true" />}<span {...ndDau('gio.tien')}>{dinhDangGia(bg.tong)}</span></span></div>
        </>
      ) : dangTinh ? <div className="summary-row"><span className="cho-tinh"><span className="cho-xoay" aria-hidden="true" /><Chu k="gio.dangTinh" /></span></div>
        : <div className="summary-row"><Chu k="gio.chuaTong" /></div>}
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
      <div className="cart-thumb" style={mon ? { background: bieuTuongMon(mon).bg } : undefined}>{mon ? <AnhMon mon={mon} s={40} /> : <Ico ten="package" s={28} />}</div>
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

/**
 * Mục "Voucher của bạn" (Màn 7): mỗi voucher của ví một ô chạm. Ô tích CHỈ theo báo giá POS (`bg` — khi đang chờ báo giá mới, GioHang đưa báo giá CUỐI để không
 * nhấp nháy; báo giá lỗi / không hỏi → không ô nào tích). App không tích trước khi POS trả lời. Voucher ship → mờ, không chạm. Ví chưa tải / trống → không có mục.
 */
function VoucherGio({ vi, bg, boTay, cham }) {
  if (!vi || !vi.length) return null;
  return (
    <>
      <div className="sec-head"><Chu k="gio.vc.tieuDe" as="h2" /><Chu k="gio.vc.phai" className="vc-dau-phai" /></div>
      {vi.map((v) => {
        const ship = laShip(v), bo = coMa(boTay, v.code), tt = trangThaiVoucher(v.code, bg);
        const tich = !ship && !bo && tt === 'dung';
        const loi = !ship && !bo && !tich && tt.loi;
        return (
          <button type="button" key={v.id ?? v.code} className={`vc-chon${tich ? ' vc-co' : ''}${ship ? ' vc-tat' : ''}`} aria-pressed={tich} disabled={ship} onClick={() => cham(v.code, tich)}>
            <span className="vc-o">{tich && <Ico ten="check" s={14} />}</span>
            <span className="vc-than">
              <span className="vc-t" {...ndDau(v.mo_ta || v.reward_name ? 'gio.vc.moTa' : 'ud.voucher.tenChung')}>{v.mo_ta || v.reward_name || nd('ud.voucher.tenChung')}</span>
              <span className="vc-ma" {...ndDau('gio.vc.moTa')}>{v.code}</span>
              {ship && <span className="vc-sap" {...ndDau('gio.vc.ship')}>{nd('gio.vc.ship')}</span>}
              {loi && <span className="vc-loi" {...ndDau('gio.vc.loi')}>{loi}</span>}
            </span>
          </button>
        );
      })}
    </>
  );
}

export default function GioHang({ gio, ds, doi, dangNhap, maGiam, datMaGiam, tiepTuc, moMenu, monLoi, vi, vouchers, boTay, chamVc }) {
  const [o, datO] = useState(maGiam);
  const [daXoa, datDaXoa] = useState(null); // { dong, vitri, ten } của món vừa xoá — để Hoàn tác
  const coMenu = ds.length > 0;
  const tenDong = (d) => trangThaiDong(d, ds).mon?.ten || nd('gio.monChung');
  const xoaMon = (i) => { const d = gio[i]; datDaXoa({ dong: d, vitri: i, ten: tenDong(d) }); doi(xoaDong(gio, i)); };
  const hoanTac = () => { doi(chenDong(gio, daXoa.dong, daXoa.vitri)); datDaXoa(null); };
  const coMo = coMenu ? duocThanhToan(gio, ds) : gio.length > 0; // chưa có menu: vẫn cho đi tiếp (đăng nhập), Thanh toán kiểm lại khi có menu
  const hoi = dangNhap && coMenu && coMo; // có hỏi POS báo giá không
  const { bg, bgCu, dangTinh, loi } = dungBaoGia(gio, { maGiam, vouchers }, hoi);
  const coThe = coMo && !dangTinh; // đang tính lại: nút đi tiếp KHOÁ, số trên nút chỉ theo báo giá mới (KH-NHANH-2 B2)
  const bgVc = bg || (hoi && !loi ? bgCu : null); // ô voucher: báo giá POS; ĐANG chờ báo giá mới → báo giá cuối; lỗi / không hỏi → không tích
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
          {gio.map((d, i) => <DongGio key={`${d.ma}|${d.ghi_chu}`} dong={d} i={i} gio={gio} ds={ds} doi={doi} loiPos={monLoi && monLoi.ma === d.ma ? monLoi.chu : ''} xoa={xoaMon} />)}
          {dangNhap && <VoucherGio vi={vi} bg={bgVc} boTay={boTay} cham={chamVc} />}
          <div className="sec-head vc-dau-ma"><Chu k="gio.ma.tieuDe" as="h2" /><Chu k="gio.ma.mot" className="vc-dau-phai" /></div>
          <div className="promo-box">
            <input placeholder={nd('gio.ma.goiYKm')} aria-label={nd('gio.ma.aria')} {...ndDau('gio.ma.goiYKm')} maxLength={30} value={o} onChange={(e) => datO(e.target.value)} />
            <button type="button" onClick={() => datMaGiam(o.trim())} {...ndDau(daApMa ? 'gio.ma.daAp' : 'gio.ma.ap')}>{nd(daApMa ? 'gio.ma.daAp' : 'gio.ma.ap')}</button>
          </div>
          {bg && bg.maGiamLoi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau('gio.maLoi')}>{bg.maGiamLoi.error}</div></div>}
          <BangTien bg={bg} loi={loi} bgCu={bgCu} dangTinh={dangTinh} />
          <button type="button" className={`checkout-btn${coThe ? '' : ' btn-disabled'}`} aria-disabled={!coThe} onClick={coThe ? tiepTuc : undefined}>
            <span {...ndDau('gio.tiepTuc')}>{nd('gio.tiepTuc')}</span><span>{bg ? `${dinhDangGia(bg.tong)} →` : '→'}</span>
          </button>
        </>
      )}
      <ThongBaoXoa daXoa={daXoa} hoanTac={hoanTac} het={() => datDaXoa(null)} />
    </Man>
  );
}
