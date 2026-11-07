import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CO_NHAC, KHONG_NHAC } from '../kehoach.js';

// Sheet "Thêm việc vào lịch" của demo (#sheetAdd): tên việc, ngày, giờ, "Nhắc". Demo có bốn mức nhắc trước (15 phút…) vì có thông báo đẩy;
// app chưa đẩy được ra điện thoại (KH-TB-1, sau khai trương) nên chỉ hai mức: "Không nhắc" / "Nhắc khi mở app" (chủ quán duyệt chữ 06.11).
// `ngay` = ngày đang chọn trên lịch ("YYYY-MM-DD"); `luu({ ngay, gio, tieu, nhac })` trả lời lỗi (chữ) hoặc '' nếu ổn.
export default function ThemViec({ ngay, luu, dong }) {
  const [tieu, datTieu] = useState('');
  const [ng, datNg] = useState(ngay);
  const [gio, datGio] = useState('08:00');
  const [nhac, datNhac] = useState(true);
  const [loi, datLoi] = useState('');
  const oTen = useRef(null);
  useEffect(() => { const h = setTimeout(() => oTen.current && oTen.current.focus(), 50); return () => clearTimeout(h); }, []);

  const gui = () => {
    const l = luu({ ngay: ng, gio, tieu, nhac });
    if (l) { datLoi(l); if (oTen.current) oTen.current.focus(); }
  };
  const noi = (
    <div className="sheet show" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) dong(); }}>
      <div className="panel">
        <h3>Thêm việc vào lịch</h3>
        <label htmlFor="addTitle">Tên việc</label>
        <input type="text" id="addTitle" ref={oTen} placeholder="VD: Uống trà chiều với bạn" maxLength={120} value={tieu} onChange={(e) => { datTieu(e.target.value); datLoi(''); }} onKeyDown={(e) => { if (e.key === 'Enter') gui(); }} />
        <div className="two">
          <div><label htmlFor="addDate">Ngày</label><input type="date" id="addDate" value={ng} onChange={(e) => datNg(e.target.value)} /></div>
          <div><label htmlFor="addTime">Giờ</label><input type="time" id="addTime" value={gio} onChange={(e) => datGio(e.target.value)} /></div>
        </div>
        <label>Nhắc</label>
        <div className="filter-row" id="rmRow" style={{ marginBottom: 6 }}>
          {[[false, KHONG_NHAC], [true, CO_NHAC]].map(([bat, chu]) => (
            <div key={chu} className={`filter-pill${nhac === bat ? ' active' : ''}`} role="button" tabIndex={0} onClick={() => datNhac(bat)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); datNhac(bat); } }}>{chu}</div>
          ))}
        </div>
        {loi && <div className="loi-nho" role="alert" style={{ fontSize: 12, color: 'var(--pink-dark)', margin: '6px 2px' }}>{loi}</div>}
        <button type="button" className="checkout-btn" style={{ justifyContent: 'center', marginTop: 10 }} onClick={gui}>Lưu việc</button>
      </div>
    </div>
  );
  return typeof document === 'undefined' ? noi : createPortal(noi, document.querySelector('.phone') || document.body);
}
