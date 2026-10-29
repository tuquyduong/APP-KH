import { useCallback, useState } from 'react';
import { layDiem, layVoucher } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dinhDangGia, dinhDangNgay, dinhDangSo, moTaGiam } from '../dinhDang.js';
import TrangTai from '../components/TrangTai.jsx';
import NhanMa from '../components/NhanMa.jsx';

const LOAI_DIEM = { earn: 'Tích điểm', redeem: 'Đổi điểm' };
const TRANG_THAI_VOUCHER = { used: 'Đã dùng', expired: 'Hết hạn' };
const dau = (n) => (n > 0 ? `+${n}` : String(n));

function The({ ten, ma, loai, giaTri, toiThieu, han, nhan }) {
  return (
    <div className="the the-voucher">
      <div className="dong">
        <b>{ten || 'Mã giảm giá'}</b>
        <span>{moTaGiam(loai, giaTri)}</span>
      </div>
      <div className="ma-voucher">{ma}</div>
      {toiThieu > 0 && <div className="phu">Đơn từ {dinhDangGia(toiThieu)}</div>}
      {han && <div className="phu">Hạn dùng đến {dinhDangNgay(han)}</div>}
      {nhan && <div className="nhan-xau">{nhan}</div>}
    </div>
  );
}

function Voucher({ tatCa }) {
  const ham = useCallback(() => layVoucher(tatCa), [tatCa]);
  const tai = dungTai(ham);
  return (
    <TrangTai tai={tai}>
      {(dl) => {
        const dung = tatCa ? dl.data : dl.data.filter((v) => v.status === 'available');
        return (
          <>
            {dl.ma_khach_moi.length === 0 && dung.length === 0 && <div className="giua">Bạn chưa có voucher nào.</div>}
            {dl.ma_khach_moi.map((v) => (
              <The key={v.code} ten="Ưu đãi khách mới" ma={v.code} loai={v.discount_type} giaTri={v.discount_value} toiThieu={v.min_order} han={v.valid_to} />
            ))}
            {dung.map((v) => (
              <The key={v.id} ten={v.reward_name} ma={v.code} loai={v.discount_type} giaTri={v.discount_value} han={v.expires_at} nhan={TRANG_THAI_VOUCHER[v.status]} />
            ))}
          </>
        );
      }}
    </TrangTai>
  );
}

// Ưu đãi: điểm + lịch sử, voucher (+ xem tất cả), ô nhập mã trên hoá đơn. `maSan` = mã từ link QR hoá đơn.
export default function UuDai({ maSan, khiNhanXong }) {
  const tai = dungTai(layDiem);
  const [tatCa, datTatCa] = useState(false);
  return (
    <div>
      <h2>Ưu đãi</h2>
      <NhanMa maSan={maSan} khiThu={khiNhanXong} khiXong={tai.taiLai} />
      <TrangTai tai={tai}>
        {(dl) => (
          <>
            <div className="the">
              <div className="phu">Điểm của bạn</div>
              <div className="so-lon">{dinhDangSo(dl.points)}</div>
            </div>
            <div className="tieu-de">Voucher</div>
            <Voucher tatCa={tatCa} />
            <button className="nut phu-nut" onClick={() => datTatCa(!tatCa)}>{tatCa ? 'Chỉ xem mã còn dùng' : 'Xem tất cả'}</button>
            <div className="tieu-de">Lịch sử điểm</div>
            <div className="the">
              {dl.history.length === 0 && <div className="phu">Chưa có điểm nào.</div>}
              {dl.history.map((h) => (
                <div className="dong" key={h.id}>
                  <div>
                    <div>{h.reason || LOAI_DIEM[h.type] || 'Giao dịch điểm'}</div>
                    <div className="phu">{dinhDangNgay(h.created_at)}</div>
                  </div>
                  <b>{dau(h.points)}</b>
                </div>
              ))}
            </div>
          </>
        )}
      </TrangTai>
    </div>
  );
}
