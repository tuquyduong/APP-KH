import { useRef, useState } from 'react';
import { layToi } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungKho } from '../kho.js';
import { khoGioHoatDong } from '../gioHoatDong.js';
import { dinhDangGia } from '../dinhDang.js';
import { duocThanhToan } from '../gio.js';
import { CHU_CHUA_MO, chanDat, khoaGui, taoDon, thanDatDon, viThieu } from '../datDon.js';
import { DAT_ONLINE } from '../noiDung/caiDat.js';
import { dungBaoGia } from '../dungDatDon.js';
import Man, { DauManCon } from '../components/Man.jsx';
import PinSheet from '../components/PinSheet.jsx';
import { Ico, Med } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';
import { BangTien } from './GioHang.jsx';

// Thanh toán theo demo (checkout). Cách nhận: Lấy tại quầy (mặc định); Giao tận nơi qua Ahamove hiện nhưng TẮT tới KH-MUA-2.
// Cách trả: QR payOS hoặc Ví nội bộ (số dư /toi; không đủ → khoá, nói còn thiếu theo tổng POS) + PIN. Mọi số tiền từ báo giá POS.
// Một lần bấm = một đơn (khoaGui); lỗi / mất mạng không tự gửi lại. Cờ DAT_ONLINE tắt → nút hiện "Đặt online sắp mở", không gọi gì.
const TUY = { cachNhan: 'tai_quan' };
const NHAC_MAT_MANG = ' Đơn có thể đã tạo — xem Lịch sử đơn trước khi đặt lại.';

export default function ThanhToan({ gio, ds, maGiam, lui, xong }) {
  const toi = dungTai(layToi);
  const gh = dungKho(khoGioHoatDong);
  const [chon, datChon] = useState('qr');
  const [moPin, datMoPin] = useState(false);
  const [dang, datDang] = useState(false);
  const [loiGui, datLoiGui] = useState('');
  const gui = useRef(null);
  if (!gui.current) gui.current = khoaGui((than) => taoDon(than));

  const tuy = { ...TUY, maGiam };
  const coThe = duocThanhToan(gio, ds);
  const { bg, loi } = dungBaoGia(gio, tuy, coThe);
  const soDu = toi.dl && toi.dl.khach ? toi.dl.khach.so_du_vi : null;
  const thieu = viThieu(bg && bg.tong, soDu);
  const viDuoc = thieu === 0;
  const cachTra = chon === 'vi' && viDuoc ? 'vi' : 'qr';
  const chan = chanDat(gh);
  const khoa = !DAT_ONLINE || !!chan || !coThe || !bg || dang;

  const guiDon = (pin) => {
    const p = gui.current(thanDatDon(gio, tuy, { cachTra, pin }));
    if (!p) return Promise.resolve(); // đang gửi: bấm thêm không tạo đơn thứ hai
    datDang(true); datLoiGui('');
    return p.then(
      (don) => { datDang(false); if (don) xong(don); },
      (e) => { datDang(false); if (cachTra !== 'vi') datLoiGui(e.message + (e.code === 'MANG_LOI' ? NHAC_MAT_MANG : '')); throw e; },
    );
  };
  const xacNhan = () => {
    if (khoa) return;
    if (cachTra === 'vi') datMoPin(true); else guiDon().catch(() => { /* lời lỗi đã hiện */ });
  };

  let dongVi = soDu === null ? 'Chưa đọc được số dư' : `Số dư ${dinhDangGia(soDu)}`;
  if (thieu > 0) dongVi += ` · còn thiếu ${dinhDangGia(thieu)}`;
  const chuNut = !DAT_ONLINE ? CHU_CHUA_MO : dang ? 'Đang gửi…' : bg ? `Xác nhận trả ${dinhDangGia(bg.tong)}` : 'Xác nhận';

  return (
    <Man id="checkout">
      <DauManCon tieuDe="Thanh toán" phu="Chọn cách nhận hàng & trả tiền" lui={lui} canTrai />
      <div className="sec-head" style={{ marginTop: 0 }}><h2>Hình thức nhận hàng</h2></div>
      <div className="mode-row">
        <div className="mode-opt btn-disabled" aria-disabled="true"><div className="e"><Med ten="scooter" s={50} /></div><b>Giao tận nơi</b><span>Giao qua Ahamove · Sắp có</span></div>
        <div className="mode-opt active"><div className="e"><Med ten="store" s={50} /></div><b>Lấy tại quầy</b><span>Miễn phí giao</span></div>
      </div>
      <div className="card the-quay">
        <div className="quay-ten"><Ico ten="store" s={16} lop="ico-mint" /> Quán Tứ Quý Đường</div>
        <div className="quay-chu">Khi tới quầy, bạn đọc <b>số đơn</b> hiện trong app cho nhân viên.</div>
      </div>

      <div className="sec-head"><h2>Cách trả tiền</h2></div>
      <div className={`opt-row${cachTra === 'qr' ? ' active' : ''}`} {...bam(() => datChon('qr'))}>
        <div className="rdo" /><div className="opt-chu"><div className="tt">Chuyển khoản QR (payOS)</div><div className="ss">Quét mã bằng app ngân hàng</div></div>
      </div>
      <div className={`opt-row${cachTra === 'vi' ? ' active' : ''}${viDuoc ? '' : ' btn-disabled'}`} aria-disabled={!viDuoc} {...(viDuoc ? bam(() => datChon('vi')) : {})}>
        <div className="rdo" /><div className="opt-chu"><div className="tt">Ví nội bộ</div><div className="ss">{dongVi}</div></div>
      </div>

      <BangTien bg={bg} loi={loi} />
      {chan && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{chan}</div></div>}
      {loiGui && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div>{loiGui}</div></div>}
      <button type="button" className={`checkout-btn${khoa ? ' btn-disabled' : ''}`} aria-disabled={khoa} onClick={xacNhan}>
        <span>{chuNut}</span><span>→</span>
      </button>
      {moPin && <PinSheet gui={(pin) => guiDon(pin)} dong={() => datMoPin(false)} />}
    </Man>
  );
}
