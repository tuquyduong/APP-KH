import { useEffect, useState } from 'react';
import { dinhDangGia, dinhDangNgay } from '../dinhDang.js';
import { nd, ndAnh, ndDau, ndHien, ndPhan } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import { bayGio } from '../bayGio.js';
import { banGhiCuaDon, buocTienTrinh, conLaiQR, daThanhToan, hangCuaDon, hanMoiThe, hetHanTuChu, huyDon, laDonChiThe, theCuaBanGhi, xongChua } from '../datDon.js';
import { dungGia } from '../heThong.js';
import { dungTheoDoi } from '../dungDatDon.js';
import { tachBieuTuong } from '../quangCao.js';
import { docHoaDon, soDon } from '../hoaDon.js';
import { LIEN_HE } from '../noiDung/lienHe.js';
import Man, { DauManCon } from '../components/Man.jsx';
import { KhungLoi } from '../components/TrangTai.jsx';
import { Ico, IcoVe } from '../components/BieuTuong.jsx';
import HoaDonKhach from '../components/HoaDonKhach.jsx';
import TheQR from '../components/TheQR.jsx';
import { TheHoiVienChung, TheHoiVienToi } from '../components/TheHoiVien.jsx';
import '../giaoDien/the_hang.css';

// Theo dõi đơn theo demo (tracking), đường dẫn /don/<ma>. Đơn chờ trả: QR lấy từ GET /don/:ma (tải lại / máy khác vẫn thấy), đếm ngược tới het_han
// theo "bây giờ" của POS, hỏi trạng thái mỗi 3 giây; hết hạn → "Tạo mã mới" / "Huỷ đơn". Số giữ ví / QR còn lại: `cach_tra`, `giu_vi`, `con_lai` của
// GET /don/:ma (v7 — tải lại / máy khác vẫn đúng; đơn quầy null → không dòng ví); POS chưa trả các trường đó → bản ghi lần gửi trên máy này (kh_don_gui),
// không có thì ẩn dòng ví và số cạnh QR (không hiện tổng sai cho đơn ví + QR). App không tự tính số nào.
// Đã trả: số đơn to để đọc cho nhân viên + các bước tien_trinh, hỏi lại mỗi 10 giây tới khi xong. Bản đồ / tài xế: KH-MUA-2.
const dongHo = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function TraQR({ qr, soTra, soHd, taoMaMoi, dang }) {
  const [, ve] = useState(0);
  useEffect(() => { const id = setInterval(() => ve((x) => x + 1), 1000); return () => clearInterval(id); }, []);
  const con = conLaiQR(qr.hetHan, bayGio());
  if (con === 0) {
    return (
      <>
        <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><Chu k="td.qr.hetHan" as="div" /></div>
        <button type="button" className={`checkout-btn${dang ? ' btn-disabled' : ''}`} onClick={dang ? undefined : taoMaMoi}><Chu k="td.qr.taoMoi" /><span>→</span></button>
      </>
    );
  }
  return (
    <>
      <TheQR chuoi={qr.chuoi} soTien={soTra} soHd={soHd} />
      <div className="care-disclaimer qr-chu" {...ndDau('td.qr.quet')}>{nd('td.qr.quet')}{soTra !== null && <> <b {...ndDau('td.tien')}>{dinhDangGia(soTra)}</b></>}{con !== null && <><span {...ndDau('td.qr.con')}>{` · ${nd('td.qr.con')} `}</span><b {...ndDau('td.so')}>{dongHo(con)}</b></>}</div>
    </>
  );
}

function CacBuoc({ tt, chiThe, phanTram }) {
  const { ds, hien, xongBuocHien } = buocTienTrinh(tt, { chiThe, phanTram });
  return ds.map((b, i) => {
    const xongBuoc = i < hien || (i === hien && xongBuocHien);
    const lop = xongBuoc ? 'done' : i === hien ? 'cur' : '';
    return (
      <div className={`tl-step ${lop}`} key={b.ma}>
        <div className="tl-cot"><div className="tl-dot">{!xongBuoc && b.ic === 'bolt' ? <IcoVe ten="bolt" s={12} /> : <Ico ten={xongBuoc ? 'check' : b.ic} s={12} />}</div>{i < ds.length - 1 && <div className="tl-line" />}</div>
        <div className={`tl-chu${i < ds.length - 1 ? ' giua' : ''}`}><div className="t" {...ndDau(b.kt)}>{b.t}</div>{b.s && <div className="s" {...ndDau(b.ks)}>{b.s}</div>}</div>
      </div>
    );
  });
}

// Đơn CHỈ thẻ hạng đã trả (POS đi thẳng cho_tra → xong, quầy không pha) → màn "Chào mừng hội viên" (bản thiết kế 14.11 Màn 4, KH-THE-2 D1; thẻ LỚN KH-THE-3) thay số đơn /
// các bước / danh sách món (hoá đơn vẫn xem ở Lịch sử đơn). Hạng: dòng thẻ của bản ghi lần gửi tra /hang (không chờ /toi), không có thì hạng hiện tại của khách; không biết → câu chung,
// không %. Thẻ lớn lấy tên + SĐT của /toi (TheHoiVienToi). Hạn trên thẻ = ngày đọc từ `ghi_chu` POS ("Hạn mới: dd/mm/yyyy"; App không tự tính); đọc không được → thẻ bỏ dòng hạn, hiện NGUYÊN chữ POS dưới thẻ.
// "Về giỏ · N món" chỉ khi giỏ còn đồ uống.
function ChaoMung({ don, hang, soMonGio, veGio, moMenu }) {
  const han = hanMoiThe(don), pos = ndDau('the.cm.pos'), hetHan = hetHanTuChu(han);
  return (
    <>
      <div className="cm-dau">
        <TheHoiVienToi hang={hang} het_han={hetHan} tang={!!hang && hang.chi_cap === true} chieu />
        {han && hetHan === undefined && <div className="cm-han" {...pos}>{han}</div>}
        <h2 {...ndDau(hang ? 'the.cm.t' : 'the.cm.chung')}>{hang ? nd('the.cm.t', { hang: hang.ten }) : nd('the.cm.chung')}</h2>
        {hang && typeof hang.phan_tram === 'number' && <p {...ndDau('the.cm.p')}>{nd('the.cm.p', { phanTram: hang.phan_tram })}</p>}
        {don.tong !== null ? <span className="cm-don" {...ndDau('the.cm.don')}>{nd('the.cm.don', { so: soDon(don.soHd, don.ma), tong: dinhDangGia(don.tong) })}</span> : <span className="cm-don" {...ndDau('the.cm.donSo')}>{nd('the.cm.donSo', { so: soDon(don.soHd, don.ma) })}</span>}
      </div>
      <Chu k="the.cm.nut" as="button" type="button" className="checkout-btn cm-nut" onClick={moMenu} />
      {soMonGio > 0 && <><button type="button" className="ghost-btn cm-gio" onClick={veGio} {...ndDau('the.cm.veGio')}>{nd('the.cm.veGio', { so: soMonGio })}</button><Chu k="the.cm.nho" as="div" className="cm-nho" /></>}
    </>
  );
}

// Dòng thẻ ở "Chi tiết đơn": thẻ NHỎ đúng mẫu của hạng thay ô hộp. Tên chữ App "Thẻ hội viên {hạng}" + "{so} tháng" khi biết hạng (bản ghi lần gửi); không biết → `ten` POS bỏ biểu tượng đầu dòng.
function DongThe({ m, hang, soThang }) {
  const ten = hang ? nd('the.td.dong', { hang: hang.ten }) : tachBieuTuong(m.ten).chu;
  return (
    <div className="cart-item the-dong">
      <TheHoiVienChung co="nho" hang={{ ten: hang ? hang.ten : m.ten }} />
      <div className="cart-info" {...ndDau('td.tien')}>
        <div className="cart-name" {...ndDau(hang ? 'the.td.dong' : 'the.td.pos')}>{ten}</div>
        {hang && soThang && <div className="cart-opt" {...ndDau('the.td.dongThang')}>{nd('the.td.dongThang', { so: soThang })}</div>}
        <div className="cart-price">{dinhDangGia(m.thanh_tien)}</div>
      </div>
    </div>
  );
}

export default function TheoDoiDon({ ma, lui, daTra, daHuy, veThanhToan, soMonGio = 0, veGio, moMenu }) {
  const { don, loi, taiLai } = dungTheoDoi(ma);
  const { dsHang } = dungGia();
  const [loiHuy, datLoiHuy] = useState('');
  const [dangHuy, datDangHuy] = useState(false);
  const tt = don ? don.tienTrinh : '';
  const choTra = tt === 'cho_tra';
  // Cách trả + số ví đã giữ: POS trước (v7), không có trường thì bản ghi trên máy; đơn quầy (cach_tra null) → null.
  const tra = don && don.cachTra !== undefined ? (don.cachTra && { cach_tra: don.cachTra, giu_vi: don.giuVi, con_lai: don.conLai }) : banGhiCuaDon(ma);
  const viQr = !!tra && tra.cach_tra === 'vi_qr' && tra.giu_vi > 0;
  // Số cạnh QR: QR cả đơn → tổng; ví + QR → phần còn lại POS trả; không biết → ẩn.
  const soTra = !tra ? null : tra.cach_tra === 'qr' ? (don && don.tong) : Number.isFinite(tra.con_lai) ? tra.con_lai : null;
  useEffect(() => {
    if (daThanhToan(tt)) daTra(ma);
    if (tt === 'da_huy') daHuy();
  }, [tt]);
  // "Tạo mã mới" = huỷ đơn chờ trả rồi về Thanh toán — CHỈ khi huỷ thành công (POS từ chối, vd đơn vừa được trả → hiện lời POS, hỏi lại trạng thái).
  const taoMoi = () => {
    datDangHuy(true); datLoiHuy('');
    huyDon(ma).then(() => { daHuy(); veThanhToan(); }, (e) => { datDangHuy(false); datLoiHuy(e.message); taiLai(); });
  };
  const huy = () => {
    datDangHuy(true); datLoiHuy('');
    huyDon(ma).then(() => { datDangHuy(false); taiLai(); }, (e) => { datDangHuy(false); datLoiHuy(e.message); taiLai(); });
  };
  const banGhi = banGhiCuaDon(ma), hangDon = hangCuaDon(banGhi, dsHang), theDon = theCuaBanGhi(banGhi);
  const phanTramThe = hangDon && typeof hangDon.phan_tram === 'number' ? hangDon.phan_tram : null; // mức giảm của hạng đang mua (bản ghi lần gửi); không biết → bỏ câu nói mức giảm
  const theXong = !!don && tt === 'xong' && laDonChiThe(don); // đơn chỉ thẻ đã trả: không bước pha chế / số đơn ra quầy (KH-THE-1 D2)
  const chaoMung = theXong && ndHien('hien.the.cm'); // tắt khối → chỉ ẩn màn chúc mừng, còn hoá đơn POS (có hạn mới)
  return (
    <Man id="tracking">
      <DauManCon tieuDe={don ? nd('td.tieuDe', { so: soDon(don.soHd, don.ma) }) : nd('td.tieuDe.cho')} phu={don && dinhDangNgay(don.ngay) ? nd('td.phu', { ngay: dinhDangNgay(don.ngay) }) : ''} lui={lui} canTrai />
      {!don && (loi ? <KhungLoi loi={loi} thuLai={taiLai} /> : <div className="khung-tai" aria-busy="true" />)}
      {don && (
        <>
          {choTra && don.qr && <TraQR qr={don.qr} soTra={soTra} soHd={don.soHd} taoMaMoi={taoMoi} dang={dangHuy} />}
          {choTra && viQr && <div className="care-disclaimer qr-chu qr-vi" {...ndDau('td.vi.giu')}>{ndPhan('td.vi.giu', { giu: <b key="giu" {...ndDau('td.tien')}>{dinhDangGia(tra.giu_vi)}</b>, qr: <b key="qr" {...ndDau('td.tien')}>{dinhDangGia(tra.con_lai)}</b> })}</div>}
          {(don.cauTienVe || don.tienVeChoDoiSoat) && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau(don.cauTienVe ? 'td.cauTienVe' : 'td.tienVe')}>{don.cauTienVe || nd('td.tienVe')}</div></div>}
          {chaoMung && <ChaoMung don={don} hang={hangDon} soMonGio={soMonGio} veGio={veGio} moMenu={moMenu} />}
          {!theXong && tt && !choTra && tt !== 'da_huy' && <div className="pick-num"><Chu k="td.soDon" as="div" className="pick-chu" /><div className="n" {...ndDau('td.so')}>{soDon(don.soHd, don.ma)}</div></div>}
          {tt === 'xong' && !theXong && <div className="nt-state on" role="status"><Ico ten="check" s={18} /><Chu k="td.xong" as="div" /></div>}
          {(tt === 'da_tra' || tt === 'dang_lam') && <Chu k="td.giuApp" as="div" className="care-disclaimer qr-chu" />}
          {!theXong && <div className="card the-buoc"><CacBuoc tt={tt} chiThe={laDonChiThe(don)} phanTram={phanTramThe} /></div>}
          {chaoMung ? null : docHoaDon(don).length > 0 ? <div className="order-card"><HoaDonKhach don={don} /></div> : <>
            {don.mon.length > 0 && <div className="sec-head" style={{ marginTop: 0 }}><Chu k="td.chiTiet" as="h2" /></div>}
            {don.mon.map((m, i) => m.loai === 'the' ? <DongThe key={i} m={m} hang={hangDon} soThang={theDon && theDon.so_thang} /> : (
              <div className="cart-item" key={i}>
                <div className="cart-thumb"><Ico ten="package" s={28} /></div>
                <div className="cart-info" {...ndDau('td.tien')}><div className="cart-name">{m.ten} ×{m.so_luong}</div>{m.ghi_chu && <div className="cart-opt">“{m.ghi_chu}”</div>}<div className="cart-price">{dinhDangGia(m.thanh_tien)}</div></div>
              </div>
            ))}
            {don.tong !== null && <div className="card the-tong"><div className="summary-row total"><Chu k="td.tong" /><span {...ndDau('td.tien')}>{dinhDangGia(don.tong)}</span></div></div>}
          </>}
          {loiHuy && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau('td.loiPos')}>{loiHuy}</div></div>}
          {choTra && <button type="button" className={`ghost-btn nut-huy${dangHuy ? ' btn-disabled' : ''}`} onClick={dangHuy ? undefined : huy} {...ndDau('td.huy')}>{nd('td.huy')}</button>}
          {!choTra && !xongChua(tt) && LIEN_HE.dienThoai && <a className="ghost-btn nut-huy" href={`tel:${LIEN_HE.dienThoai.replace(/[^\d+]/g, '')}`} {...ndDau('td.goi')}>{nd('td.goi')}</a>}
        </>
      )}
    </Man>
  );
}
