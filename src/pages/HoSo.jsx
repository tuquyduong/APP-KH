import { useState } from 'react';
import { layToi, doiTen } from '../api.js';
import { dungTai } from '../dungTai.js';
import { cheSdt } from '../dinhDang.js';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import PinSheet from '../components/PinSheet.jsx';
import { Ico } from '../components/BieuTuong.jsx';

// Thông tin cá nhân theo demo (profile): tên, số điện thoại (che giữa), bảo mật (mã PIN). Bỏ: xưng hô, email, giới tính, ngày sinh, địa chỉ, hoá đơn,
// quên PIN bằng OTP, thiết bị đăng nhập, xoá tài khoản — POS chưa có cửa tương ứng.
function SuaTen({ khach }) {
  const [ten, datTen] = useState(khach.ten || '');
  const [dang, datDang] = useState(false);
  const [loi, datLoi] = useState('');
  const [xong, datXong] = useState(false);
  async function luu() {
    datDang(true); datLoi(''); datXong(false);
    try { const r = await doiTen(ten.trim()); datTen(r.khach?.ten ?? ten.trim()); datXong(true); } catch (e) { datLoi(e.message); } finally { datDang(false); }
  }
  return (
    <div className="card pf-card">
      <div className="tt">Thông tin</div>
      <div className="pf-row">
        <label htmlFor="ten-toi">Họ và tên</label>
        <input id="ten-toi" value={ten} onChange={(e) => { datTen(e.target.value); datXong(false); }} />
      </div>
      <div className="hq-btns"><button type="button" className="hq-b" disabled={dang || !ten.trim()} onClick={luu}>Lưu tên</button></div>
      {loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loi}</div></div>}
      {xong && <div className="save-ok" role="status"><Ico ten="check" s={14} /> Đã lưu tên</div>}
      <div className="pf-row">
        <label>Số điện thoại</label>
        <div className="pf-lock">{cheSdt(khach.sdt)}</div>
        <small>Dùng để đăng nhập</small>
      </div>
    </div>
  );
}

export default function HoSo({ lui }) {
  const tai = dungTai(layToi);
  const [moPin, datMoPin] = useState(false);
  return (
    <Man id="profile">
      <DauManCon canTrai tieuDe="Thông tin cá nhân" phu="Tên hiển thị và mã PIN" lui={lui} />
      <TrangTai tai={tai}>
        {({ khach }) => (
          <>
            <SuaTen khach={khach} />
            <div className="card pf-card">
              <div className="tt">Bảo mật</div>
              <div className="pf-link" role="button" tabIndex={0} onClick={() => datMoPin(true)} onKeyDown={(e) => { if (e.key === 'Enter') datMoPin(true); }}>
                <Ico ten="card" s={16} /> <span>Mã PIN<small>4 số · đặt hoặc đổi mã PIN của bạn</small></span><b>Đặt / đổi ›</b>
              </div>
              <div className="pf-note">Nhân viên quán không xem được mã PIN của bạn.</div>
            </div>
          </>
        )}
      </TrangTai>
      {moPin && <PinSheet dong={() => datMoPin(false)} />}
    </Man>
  );
}
