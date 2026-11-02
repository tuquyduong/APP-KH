import { useEffect, useRef, useState } from 'react';
import { layDon, layToi } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungKho } from '../kho.js';
import { khoGioHoatDong } from '../gioHoatDong.js';
import { dinhDangGia } from '../dinhDang.js';
import { duocThanhToan } from '../gio.js';
import {
  CHU_CHUA_MO, banGhiGui, cachTraDuoc, chanDat, docBaoGia, docGuiDo, ghiGuiDo, guiDonAnToan, huyDon, khoaGui, taoKhoaGui, thanDatDon, viThieu,
} from '../datDon.js';
import { DAT_ONLINE } from '../noiDung/caiDat.js';
import { dungBaoGia } from '../dungDatDon.js';
import Man, { DauManCon } from '../components/Man.jsx';
import PinSheet from '../components/PinSheet.jsx';
import { Ico, Med } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';
import { BangTien } from './GioHang.jsx';

// Thanh toán theo demo (checkout), hợp đồng v5. Cách nhận: Lấy tại quầy; Giao tận nơi (Ahamove) hiện nhưng TẮT tới KH-MUA-2.
// Cách trả: MỘT công tắc "Trừ từ số dư ví" (khuôn .notif-row + .switch của demo; ví 0đ → ẩn): tắt → QR cả đơn; bật + số dư ≥ tổng → vi;
// bật + 0 < số dư < tổng → vi_qr (số giữ / còn lại do POS trả). Dùng ví thì hỏi PIN (PinSheet). Mọi số tiền từ báo giá POS.
// Chống đơn thứ hai: một lần bấm = một khoá gửi (datDon.guiDonAnToan tự gửi lại CÙNG khoá + thân khi chưa rõ); lần gửi chưa rõ nhớ ở kh_don_gui
// (tải lại / tab khác vẫn chặn) tới khi "Gửi lại đúng đơn này" ra kết quả; mở màn hỏi GET /don — có đơn chờ trả thì mời tiếp tục / huỷ trước.
const MA_PIN = ['PIN_SAI', 'PIN_DANG_KHOA'];      // bảng PIN hiện lời POS, khách nhập lại
const MA_NGOAI_GIO = ['NGOAI_GIO', 'QUA_GIO_NHAN_DON'];
const MA_MON = { HET_HANG: 'Hết hàng', MON_KHONG_BAN: 'Không còn bán' };
const layDonDau = () => layDon(1);

export default function ThanhToan({ gio, ds, maGiam, lui, xong, moLichSu, moDon, veGio, danhDauMon, sauHuy }) {
  const toi = dungTai(layToi);
  const dsDon = dungTai(layDonDau); // gọi MỚI mỗi lần mở (không kho chung): đơn chờ trả của tab / lần mở trước
  const gh = dungKho(khoGioHoatDong);
  const [dungVi, datDungVi] = useState(false);
  const [moPin, datMoPin] = useState(null);   // { cu?: bản ghi gửi lại } khi cần PIN
  const [moDatPin, datMoDatPin] = useState(false);
  const [dang, datDang] = useState(false);
  const [guiLai, datGuiLai] = useState(false);
  const [thongBao, datThongBao] = useState('');
  const [chanPos, datChanPos] = useState('');
  const [monLoi, datMonLoi] = useState(false);
  const [canPin, datCanPin] = useState(false);
  const [hetLuc, datHetLuc] = useState(0);
  const [, ve] = useState(0);
  const [guiDo, datGuiDo] = useState(() => docGuiDo());
  const [dangHuy, datDangHuy] = useState(false);
  const gui = useRef(null);
  if (!gui.current) gui.current = khoaGui((than) => guiDonAnToan(than, { khiGuiLai: () => datGuiLai(true) }));

  // QUA_NHIEU_LAN: đếm ngược thu_lai_sau_giay (đồng hồ máy chỉ đếm giây).
  const conGiay = hetLuc ? Math.max(0, Math.ceil((hetLuc - Date.now()) / 1000)) : 0;
  useEffect(() => {
    if (!conGiay) return undefined;
    const id = setInterval(() => ve((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [conGiay > 0]);

  const tuy = { maGiam };
  const coThe = duocThanhToan(gio, ds);
  const { bg, loi, datBg } = dungBaoGia(gio, tuy, coThe);
  const soDu = toi.dl && toi.dl.khach ? toi.dl.khach.so_du_vi : null;
  const duoc = cachTraDuoc(bg && bg.tong, soDu);
  const thieu = viThieu(bg && bg.tong, soDu);
  const cachTra = !dungVi ? 'qr' : duoc.vi ? 'vi' : duoc.viQr ? 'vi_qr' : 'qr';
  const chuaRo = !dang && !!guiDo && !guiDo.ma_don;
  const donCho = dsDon.dl && Array.isArray(dsDon.dl.data) ? dsDon.dl.data.find((d) => d.tien_trinh === 'cho_tra') : null;
  const chan = chanDat(gh) || chanPos;
  const khoa = !DAT_ONLINE || !!chan || !coThe || !bg || dang || dsDon.dangTai || chuaRo || !!donCho || conGiay > 0 || monLoi;

  function xuLyLoi(e) {
    const dl = e.duLieu || {};
    if (e.code === 'GIA_DA_DOI') { const b = docBaoGia(dl.bao_gia); if (b) datBg(b); datThongBao('Giá vừa thay đổi, mời bạn xem lại'); return; }
    if (e.code === 'QUA_NHIEU_LAN') { datHetLuc(Date.now() + (Number(dl.thu_lai_sau_giay) || 60) * 1000); datThongBao(e.message); return; }
    if (MA_NGOAI_GIO.includes(e.code)) { datChanPos(e.message); return; }
    if (MA_MON[e.code]) {
      const m = ds.find((x) => x.ma === dl.ma);
      datMonLoi(true); datThongBao(m ? `${e.message} — ${m.ten}` : e.message);
      danhDauMon({ ma: dl.ma, chu: MA_MON[e.code] });
      return;
    }
    if (e.code === 'CHUA_CO_PIN') datCanPin(true);
    if (e.code === 'CACH_KHONG_KHOP') toi.taiLai(); // số dư mới đủ → công tắc đang bật tự thành trả ví
    datThongBao(e.code === 'KHOA_GUI_DA_DUNG' ? 'Vui lòng đặt lại' : e.message);
  }

  // `cu` = bản ghi lần gửi chưa rõ: gửi lại ĐÚNG thân + khoá đó (PIN nhập lại, không nhớ).
  const guiDon = (pin, cu) => {
    const than = cu ? { ...cu.than, ...(cu.cach_tra !== 'qr' ? { pin } : {}) } : thanDatDon(gio, tuy, { cachTra, pin, khoaGui: taoKhoaGui(), tongDaXem: bg.tong });
    const p = gui.current(than);
    if (!p) return Promise.resolve(); // đang gửi: bấm thêm không tạo đơn thứ hai
    const ghi = cu || banGhiGui(than);
    ghiGuiDo(ghi); // TRƯỚC khi gửi: tải lại / tab khác giữa chừng vẫn thấy "chưa rõ"
    datDang(true); datGuiLai(false); datThongBao(''); datCanPin(false);
    return p.then((don) => {
      ghiGuiDo({ ...ghi, ma_don: don.ma, giu_vi: don.giuVi, con_lai: don.conLai });
      datDang(false); datMoPin(null); xong(don);
    }, (e) => {
      datDang(false); datGuiLai(false);
      if (e.code === 'KHONG_BIET') { datMoPin(null); datGuiDo(docGuiDo()); return; }
      ghiGuiDo(null); datGuiDo(null); // POS trả 4xx: chắc chưa tạo
      if (MA_PIN.includes(e.code)) throw e;
      datMoPin(null);
      xuLyLoi(e);
    });
  };
  const xacNhan = () => {
    if (khoa) return;
    if (cachTra === 'qr') guiDon(); else datMoPin({});
  };
  const guiLaiDungDon = () => { if (guiDo.cach_tra === 'qr') guiDon(undefined, guiDo); else datMoPin({ cu: guiDo }); };
  const boQua = () => { ghiGuiDo(null); datGuiDo(null); };
  const huyDonCho = () => {
    datDangHuy(true); datThongBao('');
    huyDon(donCho.ma).then(() => { datDangHuy(false); sauHuy(); dsDon.taiLai(); }, (e) => { datDangHuy(false); datThongBao(e.message); dsDon.taiLai(); });
  };
  const tenMon = (ma) => (ds.find((m) => m.ma === ma) || {}).ten || ma;

  // Số dư quyết định cách trả CHỈ lấy từ /toi gọi SAU khi mở màn (KH-NHANH-1 F1); chờ thì công tắc khoá.
  const viBat = cachTra !== 'qr';
  const dongVi = toi.dangTai ? 'Đang cập nhật số dư…' : soDu === null ? 'Chưa đọc được số dư' : !viBat ? `Số dư ${dinhDangGia(soDu)}`
    : cachTra === 'vi' ? `Số dư ${dinhDangGia(soDu)} — đủ trả cả đơn` : `Dùng hết ${dinhDangGia(soDu)} trong ví, còn thiếu ${dinhDangGia(thieu)} → quét QR`;
  const batDuocVi = duoc.vi || duoc.viQr;
  const chuNut = !DAT_ONLINE ? CHU_CHUA_MO : dang ? (guiLai ? 'Mạng chậm, đang gửi lại…' : 'Đang gửi…') : dsDon.dangTai ? 'Đang kiểm tra đơn trước…'
    : chuaRo || donCho ? 'Xử lý đơn trước rồi đặt tiếp' : conGiay ? `Thử lại sau ${conGiay} giây` : bg ? `Xác nhận trả ${dinhDangGia(bg.tong)}` : 'Xác nhận';
  // Khối cảnh báo / chờ: khuôn .nt-state của demo (biểu tượng + dòng đậm + dòng nhỏ).
  const canhBao = (tieuDe, phu) => <div className="nt-state" role="alert"><Ico ten="warning" s={18} /><div>{tieuDe}{phu && <small>{phu}</small>}</div></div>;

  return (
    <Man id="checkout">
      <DauManCon tieuDe="Thanh toán" phu="Chọn cách nhận hàng & trả tiền" lui={lui} canTrai />
      {chuaRo && (
        <>
          {canhBao(guiDo.quaHan ? 'Lần đặt trước (hơn 24 giờ) chưa rõ kết quả' : 'Lần đặt trước chưa rõ kết quả', 'Nếu quán đã nhận đơn, sẽ không tạo đơn thứ hai.')}
          <div className="card bang-tien">
            {guiDo.than.mon.map((m, i) => <div className="summary-row" key={i}><span>{tenMon(m.ma)} ×{m.so_luong}</span></div>)}
            {Number.isInteger(guiDo.than.tong_da_xem) && <div className="summary-row total"><span>Tổng cộng</span><span>{dinhDangGia(guiDo.than.tong_da_xem)}</span></div>}
          </div>
          <button type="button" className="checkout-btn" onClick={guiLaiDungDon}><span>Gửi lại đúng đơn này</span><span>→</span></button>
          <button type="button" className="ghost-btn" onClick={moLichSu}>Xem Lịch sử đơn</button>
          {guiDo.quaHan && <button type="button" className="ghost-btn" onClick={boQua}>Bỏ qua, đặt đơn mới</button>}
        </>
      )}
      {!chuaRo && donCho && (
        <>
          {canhBao(`Bạn có đơn #${donCho.ma} đang chờ trả`, 'Bạn trả tiếp hoặc huỷ đơn đó rồi đặt đơn mới nhé.')}
          <button type="button" className="checkout-btn" onClick={() => moDon(donCho.ma)}><span>Tiếp tục trả đơn {donCho.ma}</span><span>→</span></button>
          <button type="button" className={`ghost-btn${dangHuy ? ' btn-disabled' : ''}`} aria-disabled={dangHuy} onClick={dangHuy ? undefined : huyDonCho}>Huỷ đơn đó</button>
        </>
      )}
      <div className="sec-head" style={chuaRo || donCho ? undefined : { marginTop: 0 }}><h2>Hình thức nhận hàng</h2></div>
      <div className="mode-row">
        <div className="mode-opt btn-disabled" aria-disabled="true"><div className="e"><Med ten="scooter" s={50} /></div><b>Giao tận nơi</b><span>Giao qua Ahamove · Sắp có</span></div>
        <div className="mode-opt active"><div className="e"><Med ten="store" s={50} /></div><b>Lấy tại quầy</b><span>Miễn phí giao</span></div>
      </div>
      <div className="card the-quay">
        <div className="quay-ten"><Ico ten="store" s={16} lop="ico-mint" /> Quán Tứ Quý Đường</div>
        <div className="quay-chu">Khi tới quầy, bạn đọc <b>số đơn</b> hiện trong app cho nhân viên.</div>
      </div>

      <div className="sec-head"><h2>Cách trả tiền</h2></div>
      {soDu !== 0 && (
        <div className="notif-row the-vi">
          <div><div className="t">Trừ từ số dư ví</div><div className="s">{dongVi}</div></div>
          <div className={`switch${viBat ? ' on' : ''}${batDuocVi ? '' : ' btn-disabled'}`} role="switch" aria-checked={viBat} aria-label="Trừ từ số dư ví" aria-disabled={!batDuocVi} {...(batDuocVi ? bam(() => datDungVi(!dungVi)) : {})} />
        </div>
      )}
      {cachTra !== 'vi' && (
        <div className="notif-row">
          <div><div className="t">Chuyển khoản QR</div><div className="s">{cachTra === 'vi_qr' ? 'Quét mã bằng app ngân hàng cho phần còn thiếu' : 'Quét mã bằng app ngân hàng'}</div></div>
          <Ico ten="qr" s={22} lop="ico-mint" />
        </div>
      )}

      <BangTien bg={bg} loi={loi} />
      {chan && canhBao(chan)}
      {dang && guiLai && canhBao('Mạng chậm, đang gửi lại…', 'Bạn chờ chút nhé, không cần bấm lại.')}
      {thongBao && canhBao(thongBao)}
      <button type="button" className={`checkout-btn nut-dat${khoa ? ' btn-disabled' : ''}`} aria-disabled={khoa} onClick={xacNhan}>
        <span>{chuNut}</span><span>→</span>
      </button>
      {monLoi && <button type="button" className="ghost-btn" onClick={veGio}>Về giỏ hàng</button>}
      {canPin && <button type="button" className="ghost-btn" onClick={() => datMoDatPin(true)}>Đặt mã PIN</button>}
      {moPin && <PinSheet gui={(pin) => guiDon(pin, moPin.cu)} dong={() => datMoPin(null)} />}
      {moDatPin && <PinSheet dong={() => { datMoDatPin(false); datCanPin(false); }} />}
    </Man>
  );
}
