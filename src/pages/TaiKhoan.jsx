import { useState } from 'react';
import { layToi, layDiem, doiTen, datPin } from '../api.js';
import { dungTai } from '../dungTai.js';
import { cheSdt, dinhDangSo } from '../dinhDang.js';
import { LIEN_HE } from '../noiDung/lienHe.js';
import TrangTai from '../components/TrangTai.jsx';

const DANG_PIN = /^\d{4}$/;

// Một khối "nhập → gửi → báo kết quả" dùng cho tên và PIN.
function useGui(viec) {
  const [dang, datDang] = useState(false);
  const [loi, datLoi] = useState('');
  const [xong, datXong] = useState(false);
  async function gui() {
    datDang(true); datLoi(''); datXong(false);
    try { await viec(); datXong(true); } catch (e) { datLoi(e.message); } finally { datDang(false); }
  }
  return { dang, loi, xong, gui, xoa: () => datXong(false) };
}

function SuaTen({ khach }) {
  const [ten, datTen] = useState(khach.ten || '');
  const g = useGui(async () => { const r = await doiTen(ten.trim()); datTen(r.khach.ten); });
  return (
    <div className="the">
      <b>Tên hiển thị</b>
      <label htmlFor="ten-toi">Tên</label>
      <input id="ten-toi" value={ten} onChange={(e) => { datTen(e.target.value); g.xoa(); }} />
      <button className="nut" disabled={g.dang || !ten.trim()} onClick={g.gui}>Lưu tên</button>
      {g.loi && <div className="loi" role="alert">{g.loi}</div>}
      {g.xong && <div className="ok">Đã lưu tên.</div>}
    </div>
  );
}

function DatPin() {
  const [pin, datPinNhap] = useState('');
  const [lai, datLai] = useState('');
  const g = useGui(async () => { await datPin(pin, lai); datPinNhap(''); datLai(''); });
  const hopLe = DANG_PIN.test(pin) && DANG_PIN.test(lai);
  const o = (id, nhan, gt, dat) => (
    <div>
      <label htmlFor={id}>{nhan}</label>
      <input id={id} type="password" inputMode="numeric" maxLength={4} autoComplete="off" value={gt} onChange={(e) => { dat(e.target.value.replace(/\D/g, '')); g.xoa(); }} />
    </div>
  );
  return (
    <div className="the">
      <b>Đặt / đổi PIN (4 số)</b>
      <div className="hai-cot">{o('pin', 'PIN', pin, datPinNhap)}{o('pin-lai', 'Nhập lại PIN', lai, datLai)}</div>
      <button className="nut" disabled={g.dang || !hopLe} onClick={g.gui}>Lưu PIN</button>
      {g.loi && <div className="loi" role="alert">{g.loi}</div>}
      {g.xong && <div className="ok">Đã lưu PIN.</div>}
    </div>
  );
}

function HoTro() {
  const { dienThoai, zalo, email } = LIEN_HE;
  if (!dienThoai && !zalo && !email) return null;
  const so = dienThoai.replace(/\D/g, '');
  return (
    <div className="the">
      <b>Hỗ trợ</b>
      {dienThoai && <a className="nut phu-nut" href={`tel:${so}`}>Gọi {dienThoai}</a>}
      {zalo && <a className="nut phu-nut" href={`https://zalo.me/${zalo.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">Nhắn Zalo</a>}
      {email && <a className="nut phu-nut" href={`mailto:${email}`}>{email}</a>}
    </div>
  );
}

export default function TaiKhoan({ moDon, moQR, dangXuat }) {
  const tai = dungTai(layToi);
  const diem = dungTai(layDiem);
  return (
    <div>
      <h2>Tài khoản</h2>
      <TrangTai tai={tai}>
        {({ khach }) => (
          <>
            <div className="the the-tk">
              <div className="avatar" aria-hidden="true">{(khach.ten || '?').trim().charAt(0).toUpperCase()}</div>
              <div>
                <b>{khach.ten}</b>
                <div className="phu">{cheSdt(khach.sdt)}</div>
                {diem.dl && <div className="nhan-tot">{dinhDangSo(diem.dl.points)} điểm</div>}
              </div>
            </div>
            <button className="nut phu-nut" onClick={moQR}>Mã QR thành viên</button>
            <button className="nut phu-nut" onClick={moDon}>Lịch sử đơn</button>
            <div className="tieu-de">Thông tin</div>
            <SuaTen khach={khach} />
            <DatPin />
            <HoTro />
            <button className="nut chu" onClick={dangXuat}>Đăng xuất</button>
          </>
        )}
      </TrangTai>
    </div>
  );
}
