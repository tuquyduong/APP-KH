import { useCallback, useState } from 'react';
import { layDiem, layToi, layVoucher } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungGia } from '../heThong.js';
import { dinhDangGia, dinhDangNgay, dinhDangSo, moTaGiam } from '../dinhDang.js';
import { THE_MOI_UU_DAI } from '../noiDung/dangNhap.js';
import Man, { NutQR } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import NhanMa from '../components/NhanMa.jsx';
import TheMoi from '../components/TheMoi.jsx';
import GvDem from '../components/GvDem.jsx';
import { bam } from '../components/bam.js';
import { Med } from '../components/BieuTuong.jsx';

// Ưu đãi theo demo (rewards): banner Giờ vàng, thẻ hạng, điểm + ví, ví voucher, ô nhập mã trên hoá đơn, lịch sử điểm. Để trống (VIỆC SAU / chưa có dữ liệu POS):
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

function DanhSachVoucher({ tatCa }) {
  const ham = useCallback(() => layVoucher(tatCa), [tatCa]);
  const tai = dungTai(ham);
  return (
    <TrangTai tai={tai}>
      {(dl) => {
        const dung = dl.data; // không `?all`: POS chỉ trả mã còn dùng (hợp đồng)
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

// Thẻ hạng (demo tier-card). `hang` = hạng của khách (/toi); không có → bảng các hạng của POS (/hang); POS không trả → ẩn, không bịa.
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
  if (!Array.isArray(dsHang) || dsHang.length === 0) return null;
  return (
    <div className="tier-card">
      <div className="top"><div><div className="name">Hạng thành viên</div>{dsHang.map((h) => <div className="pct" key={h.id}>{h.ten} — giảm {h.phan_tram}%</div>)}</div></div>
    </div>
  );
}

// Phần riêng của khách đã đăng nhập: thẻ hạng + điểm + ví (/toi, /diem), nhập mã, voucher, lịch sử điểm. `maSan` = mã từ link QR hoá đơn (điền sẵn).
function UuDaiToi({ maSan, khiNhanXong }) {
  const tai = dungTai(layDiem);
  const toi = dungTai(layToi);
  const [tatCa, datTatCa] = useState(false);
  const khach = toi.dl && toi.dl.khach;
  return (
    <>
      <TheHang hang={khach ? khach.hang : null} />

      <TrangTai tai={tai}>
        {(dl) => (
          <div className="wallet-row">
            <div className="wallet-box"><div className="n">{dinhDangSo(dl.points)}</div><div className="l">Điểm tích lũy</div></div>
            {khach && dinhDangGia(khach.so_du_vi) && <div className="wallet-box"><div className="n">{dinhDangGia(khach.so_du_vi)}</div><div className="l">Số dư ví</div></div>}
          </div>
        )}
      </TrangTai>

      <div className="sec-head"><h2>Nhập mã trên hoá đơn</h2></div>
      <NhanMa maSan={maSan} khiThu={khiNhanXong} khiXong={tai.taiLai} />

      <div className="sec-head"><h2>Ví voucher</h2></div>
      <DanhSachVoucher tatCa={tatCa} />
      <div className="more-l"><span role="button" tabIndex={0} onClick={() => datTatCa(!tatCa)} onKeyDown={(e) => { if (e.key === 'Enter') datTatCa(!tatCa); }}>{tatCa ? 'Chỉ xem mã còn dùng' : 'Xem tất cả'}</span></div>

      <div className="sec-head"><h2>Lịch sử điểm</h2></div>
      {tai.dl && (tai.dl.history.length === 0
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
export default function UuDai({ dangNhap, maSan, khiNhanXong, moQR, moGioVang, moDangNhap }) {
  return (
    <Man id="rewards">
      <div className="topbar"><div><h1>{dangNhap ? 'Ưu đãi của tôi' : 'Ưu đãi'}</h1></div><NutQR moQR={moQR} /></div>
      <BannerGioVang mo={moGioVang} />
      {dangNhap
        ? <UuDaiToi maSan={maSan} khiNhanXong={khiNhanXong} />
        : <><TheHang hang={null} /><div className="top-row mot"><TheMoi chu={THE_MOI_UU_DAI} moDangNhap={moDangNhap} /></div></>}
    </Man>
  );
}
