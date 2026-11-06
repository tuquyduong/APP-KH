import { useState } from 'react';
import { layVoucher, layChuongTrinh } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungCua, cuaDiem, cuaToi, cuaVoucher, lamMoi } from '../duLieuKhach.js';
import { dungGia } from '../heThong.js';
import { hangCoGiam } from '../giaHang.js';
import { dinhDangGia, dinhDangNgay, dinhDangSo, moTaGiam } from '../dinhDang.js';
import { THE_MOI_UU_DAI } from '../noiDung/dangNhap.js';
import Man, { NutQR } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import NhanMa from '../components/NhanMa.jsx';
import TheMoi from '../components/TheMoi.jsx';
import GvDem from '../components/GvDem.jsx';
import { bam } from '../components/bam.js';
import { Med } from '../components/BieuTuong.jsx';
import { docChuongTrinh, sinhNhatHomNay } from '../chuongTrinh.js';
import { bayGio } from '../bayGio.js';
import '../giaoDien/chuong_trinh.css';

// Ưu đãi theo demo (rewards): banner Giờ vàng, thẻ hạng, điểm + ví, ví voucher, ô nhập mã trên hoá đơn, lịch sử điểm. Để trống (VIỆC SAU / chưa có dữ liệu POS):
// Khối "Chương trình đặc biệt" (KH-CT-1) KHÔNG có trong demo: dữ liệu mới của POS (lý do a), chỉ hiển thị — áp dụng tại quán.
//   sưu tập Tứ Quý, kho quà đổi điểm, nút nâng hạng, huy hiệu hạng (P3b).
const LOAI_DIEM = { earn: 'Tích điểm', redeem: 'Đổi điểm' };
const TRANG_THAI_VOUCHER = { used: 'Đã dùng', expired: 'Hết hạn' };
const dau = (n) => (n > 0 ? `+${n}` : String(n));

function TheVoucher({ ten, ma, loai, giaTri, toiThieu, han, nhan }) {
  const phu = [ma, moTaGiam(loai, giaTri), toiThieu > 0 && `đơn từ ${dinhDangGia(toiThieu)}`, han && `hạn dùng đến ${dinhDangNgay(han)}`].filter(Boolean).join(' · ');
  return (
    <div className="voucher">
      <div className="strip" />
      <div className="body">
        <div><div className="t">{ten || 'Mã giảm giá'}</div><div className="s">{phu}</div></div>
        {nhan && <div className="use">{nhan}</div>}
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
            {dl.ma_khach_moi.length === 0 && dung.length === 0 && <div className="empty-note">Bạn chưa có voucher nào.</div>}
            {dl.ma_khach_moi.map((v) => (
              <TheVoucher key={v.code} ten="Ưu đãi khách mới" ma={v.code} loai={v.discount_type} giaTri={v.discount_value} toiThieu={v.min_order} han={v.valid_to} />
            ))}
            {dung.map((v) => (
              <TheVoucher key={v.id} ten={v.reward_name} ma={v.code} loai={v.discount_type} giaTri={v.discount_value} han={v.expires_at} nhan={TRANG_THAI_VOUCHER[v.status]} />
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
        <div className="rw-k">Giờ vàng · <GvDem kieu="short" /></div>
        <div className="rw-h">{tt.batDau} – {tt.ketThuc}<br />giảm {tt.phanTram}%</div>
        <button className="rw-b" type="button">Xem món Giờ vàng →</button>
      </div>
    </div>
  );
}

const BIEU_TUONG_CT = { sinh_nhat: 'ticket', hoc_sinh_gioi: 'card', khac: 'package' };
const CHUC_SINH_NHAT = 'Chúc mừng sinh nhật! Mời bạn đến quán, đưa căn cước để nhận ưu đãi hôm nay.';
const MOI_NHAP_NGAY_SINH = 'Nhập ngày sinh ở Thông tin cá nhân để nhận ưu đãi sinh nhật';

// Thẻ chương trình (khuôn .voucher của demo). `ghiChu` = dòng chúc mừng / mời nhập ngày sinh (chỉ thẻ sinh nhật của khách đã đăng nhập).
function TheChuongTrinh({ ct, noiBat, ghiChu }) {
  return (
    <div className={`voucher${noiBat ? ' ct-sn' : ''}`}>
      <div className="strip" />
      <div className="body">
        <span className="ct-ic"><Med ten={BIEU_TUONG_CT[ct.loai]} s={36} /></span>
        <div>
          <div className="t">{ct.ten}</div>
          {ct.moTa && <div className="s">{ct.moTa}</div>}
          {ghiChu}
        </div>
        <div className="use">Áp dụng tại quán</div>
      </div>
    </div>
  );
}

// Khách đã đăng nhập: ngày sinh từ /toi (kho cuaToi). `undefined` = chưa biết → không hiện gì; `null` = chưa nhập → mời nhập.
function ChuongTrinhToi({ ds, moHoSo }) {
  const toi = dungCua(cuaToi);
  const ngaySinh = toi.dl && toi.dl.khach ? toi.dl.khach.ngay_sinh : undefined;
  const homNay = sinhNhatHomNay(ngaySinh, bayGio().slice(0, 10));
  const xep = homNay ? [...ds.filter((c) => c.loai === 'sinh_nhat'), ...ds.filter((c) => c.loai !== 'sinh_nhat')] : ds;
  return xep.map((c) => {
    const sn = c.loai === 'sinh_nhat';
    let ghiChu = null;
    if (sn && homNay) ghiChu = <div className="ct-chuc">{CHUC_SINH_NHAT}</div>;
    else if (sn && ngaySinh === null) ghiChu = <span className="ct-moi" {...bam(moHoSo)}>{MOI_NHAP_NGAY_SINH}</span>;
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
      <div className="sec-head"><h2>Chương trình đặc biệt</h2></div>
      {dangNhap
        ? <ChuongTrinhToi ds={ds} moHoSo={moHoSo} />
        : ds.map((c) => <TheChuongTrinh key={c.ma || c.ten} ct={c} />)}
    </div>
  );
}

// Thẻ hạng (demo tier-card). `hang` = hạng của khách (/toi); không có → bảng các hạng giảm thật của POS (/hang, bỏ hạng 0%); không còn hạng nào → ẩn, không bịa.
function TheHang({ hang }) {
  const { dsHang } = dungGia();
  if (hang) {
    const db = hang.phan_tram_nhom_dac_biet > 0 ? ` · nhóm đặc biệt ${hang.phan_tram_nhom_dac_biet}%` : '';
    return (
      <div className="tier-card">
        <div className="top"><div><div className="name">Hạng {hang.ten}</div><div className="pct">Giảm {hang.phan_tram}% món thường{db}</div></div></div>
        {hang.het_han && <div className="prog-lbl">Thẻ hết hạn: {dinhDangNgay(hang.het_han)}</div>}
      </div>
    );
  }
  const ds = hangCoGiam(dsHang);
  if (ds.length === 0) return null;
  return (
    <div className="tier-card">
      <div className="top"><div><div className="name">Hạng thành viên</div>{ds.map((h) => <div className="pct" key={h.id}>{h.ten} — giảm {h.phan_tram}%</div>)}</div></div>
    </div>
  );
}

// Phần riêng của khách đã đăng nhập: thẻ hạng + điểm + ví (/toi, /diem), nhập mã, voucher, lịch sử điểm. `maSan` = mã từ link QR hoá đơn (điền sẵn).
function UuDaiToi({ maSan, khiNhanXong }) {
  const tai = dungCua(cuaDiem);
  const toi = dungCua(cuaToi);
  const [tatCa, datTatCa] = useState(false);
  const khach = toi.dl && toi.dl.khach;
  return (
    <>
      {khach && <TheHang hang={khach.hang} />}

      <TrangTai tai={tai}>
        {(dl) => (
          <div className="wallet-row">
            <div className="wallet-box"><div className="n">{dinhDangSo(dl.points)}</div><div className="l">Điểm tích lũy</div></div>
            {khach && dinhDangGia(khach.so_du_vi) && <div className="wallet-box"><div className="n">{dinhDangGia(khach.so_du_vi)}</div><div className="l">Số dư ví</div></div>}
          </div>
        )}
      </TrangTai>

      <div className="sec-head"><h2>Nhập mã trên hoá đơn</h2></div>
      <NhanMa maSan={maSan} khiThu={khiNhanXong} khiXong={() => lamMoi([cuaDiem, cuaVoucher, cuaToi])} />

      <div className="sec-head"><h2>Ví voucher</h2></div>
      {tatCa ? <VoucherTatCa /> : <VoucherConDung />}
      <div className="more-l"><span role="button" tabIndex={0} onClick={() => datTatCa(!tatCa)} onKeyDown={(e) => { if (e.key === 'Enter') datTatCa(!tatCa); }}>{tatCa ? 'Chỉ xem mã còn dùng' : 'Xem tất cả'}</span></div>

      <div className="sec-head"><h2>Lịch sử điểm</h2></div>
      {tai.dl && !tai.dl.tuMay && (tai.dl.history.length === 0
        ? <div className="empty-note">Chưa có điểm nào.</div>
        : tai.dl.history.map((h) => (
          <div className="tx-item" key={h.id}>
            <div className="ic"><Med ten="ticket" s={44} /></div>
            <div className="info"><div className="t">{h.reason || LOAI_DIEM[h.type] || 'Giao dịch điểm'}</div><div className="d">{dinhDangNgay(h.created_at)}</div></div>
            {typeof h.points === 'number' && <div className={`amt ${h.points > 0 ? 'plus' : 'minus'}`}>{dau(h.points)}</div>}
          </div>
        )))}
    </>
  );
}

// Ưu đãi mở cho khách vãng lai (chủ quán chốt 30.10): xem Giờ vàng + các hạng; điểm, ví, voucher, nhập mã chỉ khi đã đăng nhập.
export default function UuDai({ dangNhap, maSan, khiNhanXong, moQR, moGioVang, moDangNhap, moHoSo }) {
  return (
    <Man id="rewards">
      <div className="topbar"><div><h1>{dangNhap ? 'Ưu đãi của tôi' : 'Ưu đãi'}</h1></div><NutQR moQR={moQR} /></div>
      <BannerGioVang mo={moGioVang} />
      <KhoiChuongTrinh dangNhap={dangNhap} moHoSo={moHoSo} />
      {dangNhap
        ? <UuDaiToi maSan={maSan} khiNhanXong={khiNhanXong} />
        : <><TheHang hang={null} /><div className="top-row mot"><TheMoi chu={THE_MOI_UU_DAI} moDangNhap={moDangNhap} /></div></>}
    </Man>
  );
}
