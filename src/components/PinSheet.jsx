import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { datPin } from '../api.js';

// Bảng đặt / đổi mã PIN 4 số theo demo (PATCH29): chấm tròn + bàn phím số, nhập hai lần. Gửi `PUT /pin { pin, pin_lai }`;
// POS tự kiểm số dễ đoán / đã có PIN — app chỉ hiện nguyên lời POS (máy chủ mới là nơi giữ quy tắc).
// `gui(pin)` có → chế độ NHẬP PIN để trả ví (KH-MUA-1): nhập MỘT lần, gọi gui(pin); POS từ chối → hiện nguyên lời, nhập lại. PIN không lưu ở đâu.
const DO_DAI = 4;
const LOI_KHONG_KHOP = 'Hai lần nhập không khớp, đặt lại nhé';
const LOI_TEXT = { moi: ['Đặt mã PIN mới', '4 số, không dùng số dễ đoán'], lai: ['Nhập lại mã PIN mới', 'Để chắc chắn bạn nhớ'], tra: ['Nhập mã PIN', 'Để trả bằng Ví nội bộ'] };

export default function PinSheet({ dong, gui }) {
  const [buoc, datBuoc] = useState(gui ? 'tra' : 'moi');
  const [dau, datDau] = useState('');
  const [so, datSo] = useState('');
  const [thongBao, datThongBao] = useState('');
  const [dang, datDang] = useState(false);
  const [xong, datXong] = useState(false);

  const nhan = (c) => { if (!dang && so.length < DO_DAI) datSo(so + c); };
  const xoa = () => { if (!dang) datSo(so.slice(0, -1)); };
  const dongNeuRanh = () => { if (!dang) dong(); }; // đang gửi thì không đóng (mất báo kết quả)

  useEffect(() => {
    const phim = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^\d$/.test(e.key)) nhan(e.key); else if (e.key === 'Backspace') xoa(); else if (e.key === 'Escape') dongNeuRanh();
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  });

  useEffect(() => {
    if (so.length < DO_DAI) return;
    if (gui) {
      datDang(true);
      gui(so).then(() => datDang(false), (e) => { datDang(false); datSo(''); datThongBao(e.message); });
      return;
    }
    if (buoc === 'moi') { datDau(so); datSo(''); datBuoc('lai'); datThongBao(''); return; }
    if (so !== dau) { datSo(''); datDau(''); datBuoc('moi'); datThongBao(LOI_KHONG_KHOP); return; }
    datDang(true);
    datPin(dau, so).then(
      () => { datDang(false); datXong(true); },
      (e) => { datDang(false); datSo(''); datDau(''); datBuoc('moi'); datThongBao(e.message); },
    );
  }, [so]);

  const [tieuDe, phu] = LOI_TEXT[buoc];
  const noi = (
    <div className="sheet pin-sheet show" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) dongNeuRanh(); }}>
      <div className="panel" role="dialog" aria-modal="true" aria-label="Mã PIN">
        {xong ? (
          <>
            <h3 style={{ textAlign: 'center' }}>Đã lưu mã PIN</h3>
            <div className="pin-sub">Mã PIN mới đã có hiệu lực.</div>
            <button type="button" className="checkout-btn giua" onClick={dong}>Xong</button>
          </>
        ) : (
          <>
            <h3 style={{ textAlign: 'center' }}>{tieuDe}</h3>
            <div className="pin-sub">{phu}</div>
            <div className="pin-dots">{Array.from({ length: DO_DAI }, (_, i) => <i key={i} className={i < so.length ? 'on' : ''} />)}</div>
            <div className="pin-msg" role="alert">{thongBao}</div>
            <div className="pin-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => <button type="button" key={k} onClick={() => nhan(String(k))}>{k}</button>)}
              <span />
              <button type="button" onClick={() => nhan('0')}>0</button>
              <button type="button" className="lk" onClick={xoa}>Xoá</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
  return createPortal(noi, document.querySelector('.phone') || document.body);
}
