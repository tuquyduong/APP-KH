import { useState } from 'react';
import { nhanMaBill, nhanDiem } from '../api.js';
import { moTaGiam } from '../dinhDang.js';
import { nd, ndDau } from '../noiDung/nd.js';
import { chuanHoaMa } from '../maBill.js';
import { Ico } from './BieuTuong.jsx';

// Một ô mã in trên bill, khách tự bấm — máy KHÔNG tự gửi. Mã chuẩn hoá cùng một hàm với link QR (maBill.js).
// `maSan`: mã điền sẵn từ link QR → chỉ có nút nhận điểm (mã trên link là mã nhận điểm).

export default function NhanMa({ maSan = '', khiThu, khiXong }) {
  const [ma, datMa] = useState(maSan);
  const [dang, datDang] = useState(false);
  const [loi, datLoi] = useState(null); // { chu, khoa } — khoa = khoá nội dung của câu (lời POS → nm.loi)
  const [kq, datKq] = useState(null);

  async function gui(ham, loiBaoOk) {
    const maGui = chuanHoaMa(ma);
    datLoi(null); datKq(null);
    if (!maGui) { datLoi({ chu: nd('nm.loiDang'), khoa: 'nm.loiDang' }); return; }
    if (khiThu) khiThu(); // mã từ link chỉ điền sẵn MỘT lần: thử xong (đúng hay sai) thì thôi, khách còn nhập tay / nhận ưu đãi khách mới
    datDang(true);
    try {
      const r = await ham(maGui);
      datKq(loiBaoOk(r));
      datMa('');
      khiXong();
    } catch (e) {
      datLoi({ chu: e.message, khoa: 'nm.loi' });
    } finally {
      datDang(false);
    }
  }

  const trong = !ma.trim();
  return (
    <div>
      <div className="promo-box">
        <input id="ma-bill" aria-label={nd('nm.aria')} placeholder={nd('nm.goiY')} value={ma} onChange={(e) => datMa(e.target.value)} autoCapitalize="characters" autoComplete="off" />
        <button type="button" disabled={dang || trong}
          onClick={() => gui(nhanDiem, (r) => (r.message ? { chu: r.message, khoa: 'nm.loi' } : typeof r.diem_cong === 'number' ? { chu: nd('nm.diemCong', { so: r.diem_cong }), khoa: 'nm.diemCong' } : { chu: nd('nm.daNhanDiem'), khoa: 'nm.daNhanDiem' }))} {...ndDau('nm.nhanDiem')}>
          {nd('nm.nhanDiem')}
        </button>
      </div>
      {!maSan && (
        <button type="button" className="ghost-btn" disabled={dang || trong}
          onClick={() => gui(nhanMaBill, (r) => (r.data && r.data.voucher_code ? { chu: nd('nm.daNhanMoi', { ma: r.data.voucher_code, giam: moTaGiam(r.data.discount_type, r.data.discount_value) }), khoa: 'nm.daNhanMoi' } : { chu: nd('nm.daNhanMoi2'), khoa: 'nm.daNhanMoi2' }))} {...ndDau('nm.nhanMoi')}>
          {nd('nm.nhanMoi')}
        </button>
      )}
      {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau(loi.khoa)}>{loi.chu}</div></div>}
      {kq && <div className="nt-state on" role="status"><Ico ten="check" s={16} /><div {...ndDau(kq.khoa)}>{kq.chu}</div></div>}
    </div>
  );
}
