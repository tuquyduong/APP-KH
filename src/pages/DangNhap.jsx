import { useState } from 'react';
import { xinMa, xacMinh, luuToken } from '../api.js';
import Man from '../components/Man.jsx';
import { Ico } from '../components/BieuTuong.jsx';

// SĐT → mã → (tên nếu khách mới) → vào App. Mã lấy tại quầy khi máy chủ báo lay_ma_tai_quay. Demo chưa có màn đăng nhập riêng:
// dựng bằng khối của demo (pf-card, otp-in, checkout-btn, nt-state).
export default function DangNhap({ khiXong }) {
  const [sdt, datSdt] = useState('');
  const [ma, datMa] = useState('');
  const [ten, datTen] = useState('');
  const [buoc, datBuoc] = useState('sdt');
  const [taiQuay, datTaiQuay] = useState(false);
  const [canTen, datCanTen] = useState(false);
  const [dang, datDang] = useState(false);
  const [loi, datLoi] = useState('');

  async function lam(viec) {
    datDang(true); datLoi('');
    try { await viec(); } catch (e) { datLoi(e.message); } finally { datDang(false); }
  }

  const guiSdt = () => lam(async () => {
    const r = await xinMa(sdt.trim());
    datTaiQuay(!!r.lay_ma_tai_quay);
    datBuoc('ma');
  });

  const guiMa = () => lam(async () => {
    try {
      const r = await xacMinh(sdt.trim(), ma.trim(), canTen ? ten.trim() : undefined);
      luuToken(r.token);
      khiXong();
    } catch (e) {
      if (e.code === 'CAN_TEN') datCanTen(true);
      throw e;
    }
  });

  return (
    <Man id="login">
      <div className="dn-dau">
        <img className="dn-logo" src="/anh/logo.webp" alt="Tứ Quý Đường" />
        <h1>Đăng nhập</h1>
        <div className="sub">Tứ Quý Đường — Sức khỏe mỗi ngày</div>
      </div>
      <div className="card pf-card">
        {buoc === 'sdt' ? (
          <>
            <div className="pf-row">
              <label htmlFor="sdt">Số điện thoại</label>
              <input id="sdt" type="tel" inputMode="tel" autoComplete="tel" value={sdt} onChange={(e) => datSdt(e.target.value)} />
            </div>
            <button type="button" className="checkout-btn giua" disabled={dang || !sdt.trim()} onClick={guiSdt}>Tiếp tục</button>
          </>
        ) : (
          <>
            <div className="otp-s">Mã đăng nhập cho số <b>{sdt.trim()}</b></div>
            {taiQuay && <div className="otp-help"><b>Hỏi nhân viên quầy để lấy mã đăng nhập</b></div>}
            <input className="otp-in" id="ma" aria-label="Mã đăng nhập" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={ma} onChange={(e) => datMa(e.target.value.replace(/\D/g, ''))} />
            {canTen && (
              <div className="pf-row">
                <label htmlFor="ten">Tên của bạn</label>
                <input id="ten" autoComplete="name" value={ten} onChange={(e) => datTen(e.target.value)} />
              </div>
            )}
            <button type="button" className="checkout-btn giua" disabled={dang || !ma.trim()} onClick={guiMa}>Đăng nhập</button>
            <div className="otp-re"><b role="button" tabIndex={0} onClick={() => { datBuoc('sdt'); datMa(''); datLoi(''); datCanTen(false); }}>Đổi số điện thoại</b></div>
          </>
        )}
        {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loi}</div></div>}
      </div>
    </Man>
  );
}
