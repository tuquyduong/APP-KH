import { useState } from 'react';
import { layVoucher, layChuongTrinh } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungCua, cuaDiem, cuaToi, cuaVoucher, lamMoi } from '../duLieuKhach.js';
import { dungGia } from '../heThong.js';
import { dungKho } from '../kho.js';
import { khoGioHoatDong } from '../gioHoatDong.js';
import { hangCoGiam, trangThaiTheUuDai, giaCot } from '../giaHang.js';
import { dinhDangGia, dinhDangNgay, dinhDangSo, moTaGiam } from '../dinhDang.js';
import { nd, ndPhan, ndAnh, ndDau, ndHien } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { NutQR } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import NhanMa from '../components/NhanMa.jsx';
import TheMoi from '../components/TheMoi.jsx';
import GvDem from '../components/GvDem.jsx';
import { bam } from '../components/bam.js';
import { Med, MedHang } from '../components/BieuTuong.jsx';
import { docChuongTrinh, sinhNhatHomNay } from '../chuongTrinh.js';
import { bayGio } from '../bayGio.js';
import '../giaoDien/chuong_trinh.css';
import '../giaoDien/hang.css';
import '../giaoDien/the_hang.css';

// Ưu đãi theo demo (rewards): thẻ hội viên (đầu màn, KH-THE-2), banner Giờ vàng, điểm + ví, ví voucher, ô nhập mã trên hoá đơn, lịch sử điểm. Để trống (VIỆC SAU / chưa có dữ liệu POS):
// Khối "Chương trình đặc biệt" (KH-CT-1) KHÔNG có trong demo: dữ liệu mới của POS (lý do a), chỉ hiển thị — áp dụng tại quán.
//   sưu tập Tứ Quý, kho quà đổi điểm, nút nâng hạng, huy hiệu hạng (P3b).
const LOAI_DIEM = { earn: 'ud.loai.earn', redeem: 'ud.loai.redeem' }; // loại → khoá nội dung
const TRANG_THAI_VOUCHER = { used: 'ud.voucher.daDung', expired: 'ud.voucher.hetHan' };
const dau = (n) => (n > 0 ? `+${n}` : String(n));

function TheVoucher({ ten, khoaTen, ma, loai, giaTri, toiThieu, han, nhan, khoaNhan }) {
  const phu = [ma, moTaGiam(loai, giaTri), toiThieu > 0 && nd('ud.voucher.donTu', { gia: dinhDangGia(toiThieu) }), han && nd('ud.voucher.han', { ngay: dinhDangNgay(han) })].filter(Boolean).join(' · ');
  return (
    <div className="voucher">
      <div className="strip" />
      <div className="body">
        <div><div className="t" {...ndDau(khoaTen || (ten ? 'ud.khach' : 'ud.voucher.tenChung'))}>{ten || nd('ud.voucher.tenChung')}</div><div className="s" {...ndDau('ud.khach')}>{phu}</div></div>
        {nhan && <div className="use" {...ndDau(khoaNhan)}>{nhan}</div>}
      </div>
    </div>
  );
}

// "Xem tất cả" (`?all=1`) gọi khi khách bấm, không giữ trong kho (A4); mã còn dùng đọc kho chung.
const layTatCa = () => layVoucher(true);
const VoucherTatCa = () => <DanhSachVoucher tai={dungTai(layTatCa)} />;
const VoucherConDung = () => <DanhSachVoucher tai={dungCua(cuaVoucher)} />;

function DanhSachVoucher({ tai }) {
  return (
    <TrangTai tai={tai}>
      {(dl) => {
        const dung = dl.data; // không `?all`: POS chỉ trả mã còn dùng; `?all`: thêm mã đã dùng / hết hạn (nhãn)
        return (
          <>
            {dl.ma_khach_moi.length === 0 && dung.length === 0 && <Chu k="ud.voucher.chua" as="div" className="empty-note" />}
            {dl.ma_khach_moi.map((v) => (
              <TheVoucher key={v.code} ten={nd('ud.voucher.khachMoi')} khoaTen="ud.voucher.khachMoi" ma={v.code} loai={v.discount_type} giaTri={v.discount_value} toiThieu={v.min_order} han={v.valid_to} />
            ))}
            {dung.map((v) => (
              <TheVoucher key={v.id} ten={v.reward_name} ma={v.code} loai={v.discount_type} giaTri={v.discount_value} han={v.expires_at} nhan={TRANG_THAI_VOUCHER[v.status] ? nd(TRANG_THAI_VOUCHER[v.status]) : undefined} khoaNhan={TRANG_THAI_VOUCHER[v.status]} />
            ))}
          </>
        );
      }}
    </TrangTai>
  );
}

// Banner Giờ vàng (demo rw-ban): chỉ khi POS có Giờ vàng chưa kết thúc (đang / chưa tới / chờ POS báo) và có món ghép được; chữ lấy từ POS.
function BannerGioVang({ mo }) {
  const { tt, maGv, coMenu } = dungGia();
  if (!tt || tt.pha === 'sau' || (coMenu && maGv.size === 0)) return null;
  return (
    <div className="rw-ban" {...bam(mo)}>
      <div className="rw-in">
        <div className="rw-k"><span {...ndDau('ud.gv.k')}>{nd('ud.gv.k')}</span> <span {...ndDau('ud.gv.so')}><GvDem kieu="short" /></span></div>
        <div className="rw-h" {...ndDau('ud.gv.so')}>{ndPhan('ud.gv.khung', { batDau: tt.batDau, ketThuc: tt.ketThuc })}<br />{ndPhan('ud.gv.giam', { phanTram: tt.phanTram })}</div>
        <button className="rw-b" type="button" {...ndDau('ud.gv.nut')}>{nd('ud.gv.nut')}</button>
      </div>
    </div>
  );
}

const BIEU_TUONG_CT = { sinh_nhat: 'ticket', hoc_sinh_gioi: 'card', khac: 'package' };

// Thẻ chương trình (khuôn .voucher của demo). `ghiChu` = dòng chúc mừng / mời nhập ngày sinh (chỉ thẻ sinh nhật của khách đã đăng nhập).
function TheChuongTrinh({ ct, noiBat, ghiChu }) {
  return (
    <div className={`voucher${noiBat ? ' ct-sn' : ''}`}>
      <div className="strip" />
      <div className="body">
        <span className="ct-ic"><Med ten={BIEU_TUONG_CT[ct.loai]} s={36} /></span>
        <div>
          <div className="t" {...ndDau('ud.ct.pos')}>{ct.ten}</div>
          {ct.moTa && <div className="s" {...ndDau('ud.ct.pos')}>{ct.moTa}</div>}
          {ghiChu}
        </div>
        <Chu k="ud.ct.apDung" as="div" className="use" />
      </div>
    </div>
  );
}

// Khách đã đăng nhập: ngày sinh từ /toi (kho cuaToi). `undefined` = chưa biết → không hiện gì; `null` = chưa nhập → mời nhập.
function ChuongTrinhToi({ ds, moHoSo }) {
  const toi = dungCua(cuaToi);
  const ngaySinh = toi.dl && toi.dl.khach ? toi.dl.khach.ngay_sinh : undefined;
  dungKho(khoGioHoatDong); // vẽ lại khi POS báo `bay_gio` (về sau /toi) — "hôm nay" theo giờ POS, không theo đồng hồ máy
  const homNay = sinhNhatHomNay(ngaySinh, bayGio().slice(0, 10));
  const xep = homNay ? [...ds.filter((c) => c.loai === 'sinh_nhat'), ...ds.filter((c) => c.loai !== 'sinh_nhat')] : ds;
  const dauTien = xep.findIndex((c) => c.loai === 'sinh_nhat'); // dòng chúc mừng / mời nhập chỉ ở thẻ sinh nhật ĐẦU TIÊN
  return xep.map((c, i) => {
    const sn = c.loai === 'sinh_nhat';
    let ghiChu = null;
    if (sn && i === dauTien && homNay) ghiChu = <Chu k="ud.ct.chuc" as="div" className="ct-chuc" />;
    else if (sn && i === dauTien && ngaySinh === null) ghiChu = <Chu k="ud.ct.moiNhap" className="ct-moi" {...bam(moHoSo)} />;
    return <TheChuongTrinh key={c.ma || c.ten} ct={c} noiBat={sn && homNay} ghiChu={ghiChu} />;
  });
}

// Chương trình đặc biệt (GET /chuong-trinh, không token): mở cho cả khách vãng lai. Rỗng / lỗi / 429 → ẩn cả khối.
function KhoiChuongTrinh({ dangNhap, moHoSo }) {
  const { dl } = dungTai(layChuongTrinh);
  const ds = docChuongTrinh(dl);
  if (ds.length === 0) return null;
  return (
    <div className="ct-khoi">
      <div className="sec-head"><Chu k="ud.ct.tieuDe" as="h2" /></div>
      {dangNhap
        ? <ChuongTrinhToi ds={ds} moHoSo={moHoSo} />
        : ds.map((c) => <TheChuongTrinh key={c.ma || c.ten} ct={c} />)}
    </div>
  );
}

// Thẻ hội viên theo tình trạng (bản thiết kế 14.11 "Thẻ ở Ưu đãi theo tình trạng", KH-THE-2 E2): khuôn thẻ vàng dập của demo (.tier-card), MỘT nút → Hạng thành viên.
// chua (chưa hạng / hết hạn) · co · sap (còn ≤ 7 ngày — cùng soNgayCon + NGAY_NHAC_GIA_HAN của Trang chủ) · tang (hạng chỉ cấp, thẻ xanh l2). Không thanh tiến độ
// của bản thiết kế: POS chưa trả ngày bắt đầu gói (lý do a). Tên hạng, %, giá, hạn từ POS; số ngày còn App tự tính theo `bay_gio` POS.
const POS = ndDau('ud.the.pos'), TU_TINH = ndDau('ud.the.tutinh');
const ngayThe = (s) => dinhDangNgay(String(s || '').slice(0, 10));
const NutThe = ({ k, mo, dam }) => <button type="button" className={`ud-nut${dam ? ' dam' : ''}`} onClick={() => mo()} {...ndDau(k)}>{nd(k)}</button>;
const so = (x) => typeof x === 'number' && Number.isFinite(x);

function TheHang({ hangKhach, moHang }) {
  const { dsHang } = dungGia();
  dungKho(khoGioHoatDong); // "bây giờ" theo giờ POS (về sau /toi) — vẽ lại để đếm ngày đúng
  const ds = hangCoGiam(dsHang);
  const tt = trangThaiTheUuDai(ds, hangKhach, bayGio());
  if (!tt || !ndHien('hien.ud.the')) return null;
  const h = tt.hang, mo = () => moHang(h.id);
  const pt = so(h.phan_tram) ? h.phan_tram : (ds.find((x) => x.id === h.id) || {}).phan_tram;
  if (tt.kieu === 'chua') {
    const c = giaCot(h);
    return (
      <div className="tier-card the-ud">
        <div className="ud-hang"><div className="hang-logo"><img className="tqd-logo" src={ndAnh('home.logo')} alt="" {...ndDau('home.logo')} /><div className="brand"><Chu k="home.the.nhan" /><Chu k="home.the.phu" as="small" /></div></div><Chu k="ud.the.chuaCo" className="ud-nhan" /></div>
        <Chu k="ud.the.moi" as="div" className="ud-nho ud-tren" />
        <div className="ud-ten" {...POS}>{h.ten}</div>
        <div className="ud-chip"><span {...ndDau('ud.the.chipGiam')}>{nd('ud.the.chipGiam', { phanTram: h.phan_tram })}</span>{h.phan_tram_nhom_dac_biet > 0 && <span {...ndDau('ud.the.chipDb')}>{nd('ud.the.chipDb', { phanTram: h.phan_tram_nhom_dac_biet })}</span>}</div>
        <div className="ud-day">
          {c.gia !== null ? <div className="ud-gia"><Chu k="ud.the.tu" /><b {...POS}>{dinhDangGia(c.gia)}<span {...ndDau(c.so === 1 ? 'ud.the.moiThang' : 'ud.the.moiNThang')}>{nd(c.so === 1 ? 'ud.the.moiThang' : 'ud.the.moiNThang', { so: c.so })}</span></b></div> : <span />}
          <NutThe k="ud.the.nutMua" mo={mo} dam />
        </div>
      </div>
    );
  }
  const tang = tt.kieu === 'tang', sap = tt.kieu === 'sap';
  return (
    <div className={`tier-card the-ud${tang ? ' l2' : ''}`}>
      <div className="ud-hang">
        <div><Chu k="ud.the.cua" as="div" className="ud-nho" /><div className="ud-ten" {...POS}>{h.ten}</div>{so(pt) && <div className="ud-giam" {...ndDau('ud.the.giam')}>{nd('ud.the.giam', { phanTram: pt })}</div>}</div>
        {sap ? <span className="ud-do" {...TU_TINH}>{tt.soNgay === 0 ? nd('ud.the.homNay') : nd('ud.the.nhan', { so: tt.soNgay })}</span> : <MedHang tang={tang} s={52} />}
      </div>
      {sap && <div className="ud-loi" {...ndDau('ud.the.nhac')}>{nd('ud.the.nhac', { ngay: ngayThe(h.het_han).slice(0, 5) })}</div>}
      {tang ? (
        <div className="ud-day"><span {...ndDau(h.het_han ? 'ud.the.tangHan' : 'ud.the.tang')}>{nd(h.het_han ? 'ud.the.tangHan' : 'ud.the.tang', { ngay: ngayThe(h.het_han) })}</span><NutThe k="ud.the.nutTang" mo={mo} /></div>
      ) : <>
        {!sap && <div className="ud-day">{h.het_han ? <><span {...ndDau('ud.the.hetHan')}>{nd('ud.the.hetHan', { ngay: ngayThe(h.het_han) })}</span>{tt.soNgay !== null && <span {...TU_TINH}>{nd('ud.the.con', { so: tt.soNgay })}</span>}</> : <Chu k="ud.the.khongHan" />}</div>}
        <NutThe k={sap ? 'ud.the.nutGiaHan' : 'ud.the.nutCo'} mo={mo} dam={sap} />
      </>}
    </div>
  );
}
/** Khách đã đăng nhập: hạng từ /toi; /toi chưa về → chưa vẽ (không chớp "Chưa có thẻ"). */
function TheHangToi({ moHang }) {
  const toi = dungCua(cuaToi);
  return toi.dl && toi.dl.khach ? <TheHang hangKhach={toi.dl.khach.hang || null} moHang={moHang} /> : null;
}

// Phần riêng của khách đã đăng nhập: điểm + ví (/toi, /diem), nhập mã, voucher, lịch sử điểm. `maSan` = mã từ link QR hoá đơn (điền sẵn).
function UuDaiToi({ maSan, khiNhanXong }) {
  const tai = dungCua(cuaDiem);
  const toi = dungCua(cuaToi);
  const [tatCa, datTatCa] = useState(false);
  const khach = toi.dl && toi.dl.khach;
  return (
    <>
      <TrangTai tai={tai}>
        {(dl) => (
          <div className="wallet-row">
            <div className="wallet-box"><div className="n" {...ndDau('ud.khach')}>{dinhDangSo(dl.points)}</div><Chu k="ud.diem" as="div" className="l" /></div>
            {khach && dinhDangGia(khach.so_du_vi) && <div className="wallet-box"><div className="n" {...ndDau('ud.khach')}>{dinhDangGia(khach.so_du_vi)}</div><Chu k="ud.vi" as="div" className="l" /></div>}
          </div>
        )}
      </TrangTai>

      <div className="sec-head"><Chu k="ud.nhapMa" as="h2" /></div>
      <NhanMa maSan={maSan} khiThu={khiNhanXong} khiXong={() => lamMoi([cuaDiem, cuaVoucher, cuaToi])} />

      <div className="sec-head"><Chu k="ud.viVoucher" as="h2" /></div>
      {tatCa ? <VoucherTatCa /> : <VoucherConDung />}
      <div className="more-l"><span role="button" tabIndex={0} onClick={() => datTatCa(!tatCa)} onKeyDown={(e) => { if (e.key === 'Enter') datTatCa(!tatCa); }} {...ndDau(tatCa ? 'ud.chiConDung' : 'ud.xemTatCa')}>{nd(tatCa ? 'ud.chiConDung' : 'ud.xemTatCa')}</span></div>

      <div className="sec-head"><Chu k="ud.lichSu" as="h2" /></div>
      {tai.dl && !tai.dl.tuMay && (tai.dl.history.length === 0
        ? <Chu k="ud.lichSu.chua" as="div" className="empty-note" />
        : tai.dl.history.map((h) => (
          <div className="tx-item" key={h.id}>
            <div className="ic"><Med ten="ticket" s={44} /></div>
            <div className="info"><div className="t" {...ndDau(h.reason ? 'ud.khach' : LOAI_DIEM[h.type] || 'ud.loai.khac')}>{h.reason || nd(LOAI_DIEM[h.type] || 'ud.loai.khac')}</div><div className="d" {...ndDau('ud.khach')}>{dinhDangNgay(h.created_at)}</div></div>
            {typeof h.points === 'number' && <div className={`amt ${h.points > 0 ? 'plus' : 'minus'}`} {...ndDau('ud.khach')}>{dau(h.points)}</div>}
          </div>
        )))}
    </>
  );
}

// Ưu đãi mở cho khách vãng lai (chủ quán chốt 30.10): xem Giờ vàng + các hạng; điểm, ví, voucher, nhập mã chỉ khi đã đăng nhập.
export default function UuDai({ dangNhap, maSan, khiNhanXong, moQR, moGioVang, moDangNhap, moHoSo, moHang }) {
  return (
    <Man id="rewards">
      <div className="topbar"><div><Chu k={dangNhap ? 'ud.tieuDeToi' : 'ud.tieuDe'} as="h1" /></div><NutQR moQR={moQR} /></div>
      {dangNhap ? <TheHangToi moHang={moHang} /> : <TheHang hangKhach={null} moHang={moHang} />}
      <BannerGioVang mo={moGioVang} />
      <KhoiChuongTrinh dangNhap={dangNhap} moHoSo={moHoSo} />
      {dangNhap
        ? <UuDaiToi maSan={maSan} khiNhanXong={khiNhanXong} />
        : <><div className="top-row mot"><TheMoi chu={{ tieuDe: nd('ud.moi.t'), phu: nd('ud.moi.p'), nut: nd('ud.moi.nut') }} khoa={{ tieuDe: 'ud.moi.t', phu: 'ud.moi.p', nut: 'ud.moi.nut', anh: 'ud.moi.anh' }} anh={ndAnh('ud.moi.anh')} moDangNhap={moDangNhap} /></div></>}
    </Man>
  );
}
