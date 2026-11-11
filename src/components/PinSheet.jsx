import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { datPin } from '../api.js';
import Chu from './Chu.jsx';
import { nd, ndDau } from '../noiDung/nd.js';

// Bảng đặt / đổi mã PIN 4 số theo demo (PATCH29): chấm tròn + bàn phím số, nhập hai lần. Gửi `PUT /pin { pin, pin_lai }`;
// POS tự kiểm số dễ đoán / đã có PIN — app chỉ hiện nguyên lời POS (máy chủ mới là nơi giữ quy tắc).
// `gui(pin)` có → chế độ NHẬP PIN để trả ví (KH-MUA-1): nhập MỘT lần, gọi gui(pin); POS từ chối → hiện nguyên lời, nhập lại. PIN không lưu ở đâu.
// Hàng cuối "Xoá" (lùi một số) · 0 · "Xác nhận" (bật khi đủ 4 số): KHÔNG tự gửi khi vừa đủ số — khách bấm Xác nhận / Enter (chủ quán chốt 05.11, KH-MUA-1c).
const DO_DAI = 4;
const KHOA_BUOC = { moi: ['pin.moi.t', 'pin.moi.p'], lai: ['pin.lai.t', 'pin.lai.p'], tra: ['pin.tra.t', 'pin.tra.p'] }; // khoá chữ (danh mục nội dung) của tiêu đề + dòng nhỏ từng bước

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
      else if (e.key === 'Enter') { e.preventDefault(); if (xong) dong(); else xacNhan(); } // màn "Đã lưu": Enter = Xong, không gửi PIN lần hai // không để Enter bấm hộ nút số đang được chạm
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  });

  function xacNhan() {
    if (dang || so.length < DO_DAI) return;
    if (gui) {
      datDang(true);
      gui(so).then(() => datDang(false), (e) => { datDang(false); datSo(''); datThongBao(e.message); });
      return;
    }
    if (buoc === 'moi') { datDau(so); datSo(''); datBuoc('lai'); datThongBao(''); return; }
    if (so !== dau) { datSo(''); datDau(''); datBuoc('moi'); datThongBao(nd('pin.khongKhop')); return; }
    datDang(true);
    datPin(dau, so).then(
      () => { datDang(false); datXong(true); },
      (e) => { datDang(false); datSo(''); datDau(''); datBuoc('moi'); datThongBao(e.message); },
    );
  }

  const [kTieuDe, kPhu] = KHOA_BUOC[buoc];
  const noi = (
    <div className="sheet pin-sheet show" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) dongNeuRanh(); }}>
      <div className="panel" role="dialog" aria-modal="true" aria-label={nd('pin.aria')} {...ndDau('pin.aria')}>
        {xong ? (
          <>
            <Chu k="pin.luu.t" as="h3" style={{ textAlign: 'center' }} />
            <Chu k="pin.luu.p" as="div" className="pin-sub" />
            <Chu k="pin.xong" as="button" type="button" className="checkout-btn giua" onClick={dong} />
          </>
        ) : (
          <>
            <Chu k={kTieuDe} as="h3" style={{ textAlign: 'center' }} />
            <Chu k={kPhu} as="div" className="pin-sub" />
            <div className="pin-dots">{Array.from({ length: DO_DAI }, (_, i) => <i key={i} className={i < so.length ? 'on' : ''} />)}</div>
            <div className="pin-msg" role="alert" {...ndDau('pin.loiPos')}>{thongBao}</div>
            <div className="pin-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => <button type="button" key={k} onClick={() => nhan(String(k))}>{k}</button>)}
              <Chu k="pin.xoa" as="button" type="button" className="lk" onClick={xoa} />
              <button type="button" onClick={() => nhan('0')}>0</button>
              <button type="button" className="lk pin-ok" disabled={dang || so.length < DO_DAI} onClick={xacNhan} {...ndDau(dang ? 'pin.dangGui' : 'pin.xacNhan')}>{nd(dang ? 'pin.dangGui' : 'pin.xacNhan')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
  return createPortal(noi, document.querySelector('.phone') || document.body);
}
