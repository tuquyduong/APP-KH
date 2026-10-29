import { useCallback, useState } from 'react';
import { layDiem, layVoucher } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dinhDangGia, dinhDangNgay, dinhDangSo, moTaGiam } from '../dinhDang.js';
import Man, { NutQR } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import NhanMa from '../components/NhanMa.jsx';
import { Med } from '../components/BieuTuong.jsx';

// Ưu đãi theo demo (rewards): điểm, ví voucher, + ô nhập mã trên hoá đơn và lịch sử điểm. Khối của VIỆC SAU để trống:
//   banner Giờ vàng, thẻ hạng → KH-UI-3 · sưu tập Tứ Quý, kho quà đổi điểm → chưa có dữ liệu POS · số dư ví → KH-UI-3.
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
        const dung = tatCa ? dl.data : dl.data.filter((v) => v.status === 'available');
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

// `maSan` = mã từ link QR hoá đơn (điền sẵn, khách bấm nhận).
export default function UuDai({ maSan, khiNhanXong, moQR }) {
  const tai = dungTai(layDiem);
  const [tatCa, datTatCa] = useState(false);
  return (
    <Man id="rewards">
      <div className="topbar"><div><h1>Ưu đãi của tôi</h1></div><NutQR moQR={moQR} /></div>

      <TrangTai tai={tai}>
        {(dl) => (
          <div className="wallet-row">
            <div className="wallet-box"><div className="n">{dinhDangSo(dl.points)}</div><div className="l">Điểm tích lũy</div></div>
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
    </Man>
  );
}
