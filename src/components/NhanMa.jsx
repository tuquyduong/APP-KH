import { useState } from 'react';
import { nhanMaBill, nhanDiem } from '../api.js';
import { moTaGiam } from '../dinhDang.js';
import { chuanHoaMa } from '../maBill.js';
import { Ico } from './BieuTuong.jsx';

// Một ô mã in trên bill, khách tự bấm — máy KHÔNG tự gửi. Mã chuẩn hoá cùng một hàm với link QR (maBill.js).
// `maSan`: mã điền sẵn từ link QR → chỉ có nút nhận điểm (mã trên link là mã nhận điểm).
const LOI_DANG_MA = 'Mã chỉ gồm chữ và số (tối đa 32 ký tự). Kiểm tra lại mã trên hoá đơn.';

export default function NhanMa({ maSan = '', khiThu, khiXong }) {
  const [ma, datMa] = useState(maSan);
  const [dang, datDang] = useState(false);
  const [loi, datLoi] = useState('');
  const [kq, datKq] = useState('');

  async function gui(ham, loiBaoOk) {
    const maGui = chuanHoaMa(ma);
    datLoi(''); datKq('');
    if (!maGui) { datLoi(LOI_DANG_MA); return; }
    if (khiThu) khiThu(); // mã từ link chỉ điền sẵn MỘT lần: thử xong (đúng hay sai) thì thôi, khách còn nhập tay / nhận ưu đãi khách mới
    datDang(true);
    try {
      const r = await ham(maGui);
      datKq(loiBaoOk(r));
      datMa('');
      khiXong();
    } catch (e) {
      datLoi(e.message);
    } finally {
      datDang(false);
    }
  }

  const trong = !ma.trim();
  return (
    <div>
      <div className="promo-box">
        <input id="ma-bill" aria-label="Mã in trên hoá đơn" placeholder="Dán hoặc gõ mã trên hoá đơn" value={ma} onChange={(e) => datMa(e.target.value)} autoCapitalize="characters" autoComplete="off" />
        <button type="button" disabled={dang || trong}
          onClick={() => gui(nhanDiem, (r) => r.message || (typeof r.diem_cong === 'number' ? `Đã cộng ${r.diem_cong} điểm` : 'Đã nhận điểm.'))}>
          Nhận điểm
        </button>
      </div>
      {!maSan && (
        <button type="button" className="ghost-btn" disabled={dang || trong}
          onClick={() => gui(nhanMaBill, (r) => (r.data && r.data.voucher_code ? `Đã nhận ưu đãi khách mới: mã ${r.data.voucher_code} ${moTaGiam(r.data.discount_type, r.data.discount_value)}` : 'Đã nhận ưu đãi khách mới.'))}>
          Nhận ưu đãi khách mới
        </button>
      )}
      {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loi}</div></div>}
      {kq && <div className="nt-state on" role="status"><Ico ten="check" s={16} /><div>{kq}</div></div>}
    </div>
  );
}
