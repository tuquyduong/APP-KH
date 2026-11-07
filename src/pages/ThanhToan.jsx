import { useEffect, useRef, useState } from 'react';
import { layDon, layToi } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungKho } from '../kho.js';
import { khoGioHoatDong } from '../gioHoatDong.js';
import { dinhDangGia } from '../dinhDang.js';
import { duocThanhToan } from '../gio.js';
import {
  CHU_CHUA_MO, KHOA_DON_GUI, banGhiGui, chanBoiBanGhi, conChuaRo, cachTraDuoc, chanDat, docBaoGia, docGuiDo, ghiGuiDo, guiDonAnToan, huyDon, khoaGui, taoKhoaGui, thanDatDon, viThieu,
} from '../datDon.js';
import { DAT_ONLINE } from '../noiDung/caiDat.js';
import { docDungVi, ghiDungVi } from '../luuMay.js';
import { dungBaoGia } from '../dungDatDon.js';
import Man, { DauManCon } from '../components/Man.jsx';
import PinSheet from '../components/PinSheet.jsx';
import { Ico, Med } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';
import { BangTien } from './GioHang.jsx';
import '../giaoDien/thanh_toan.css';

// Thanh toán theo demo (checkout), hợp đồng v9. Cách nhận: Lấy tại quầy; Giao tận nơi (Ahamove) hiện nhưng TẮT tới KH-MUA-2.
// Cách trả: MỘT công tắc "Trừ từ số dư ví" (khuôn .notif-row + .switch của demo; ví 0đ → ẩn): tắt → QR cả đơn; bật + số dư ≥ tổng → vi;
// bật + 0 < số dư < tổng → vi_qr (số giữ / còn lại do POS trả). Dùng ví thì hỏi PIN (PinSheet). Mọi số tiền từ báo giá POS.
// Chống đơn thứ hai: một lần bấm = một khoá gửi (datDon.guiDonAnToan tự gửi lại CÙNG khoá + thân khi chưa rõ); lần gửi chưa rõ nhớ ở kh_don_gui
// (tải lại / tab khác vẫn chặn) tới khi "Gửi lại đúng đơn này" ra kết quả; KHOA_GUI_DA_DUNG → giữ bản ghi (da_dung), mời xem Lịch sử đơn / khách tự bỏ qua.
// Mở màn hỏi GET /don — có đơn chờ trả thì mời tiếp tục / huỷ trước.
const MA_PIN = ['PIN_SAI', 'PIN_DANG_KHOA'];      // bảng PIN hiện lời POS, khách nhập lại
const MA_NGOAI_GIO = ['NGOAI_GIO', 'QUA_GIO_NHAN_DON'];
const MA_MON = { HET_HANG: 'Hết hàng', MON_KHONG_BAN: 'Không còn bán' };
const layDonDau = () => layDon(1);

export default function ThanhToan({ gio, ds, maGiam, lui, xong, moLichSu, moDon, veGio, danhDauMon, sauHuy }) {
  const toi = dungTai(layToi);
  const dsDon = dungTai(layDonDau); // gọi MỚI mỗi lần mở (không kho chung): đơn chờ trả của tab / lần mở trước
  const gh = dungKho(khoGioHoatDong);
  // Công tắc nhớ lần trước (kh_dung_vi). Bật SẴN chỉ có tác dụng khi ví bật được: cachTra bên dưới tự về QR lúc /toi lỗi / đang tải / ví 0đ.
  const [dungVi, datDungViTho] = useState(docDungVi);
  const datDungVi = (bat) => { datDungViTho(bat); ghiDungVi(bat); };
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
  // Bản ghi lần gửi (kh_don_gui) đọc LẠI mỗi lần vẽ và khi tab khác ghi (sự kiện storage) — không tin bản chụp lúc mở màn (tab mở trước, ra-soát vòng 1).
  const guiDo = docGuiDo();
  // Khoá của bản ghi ĐÃ CÓ ĐƠN lúc mở màn (khách đã biết đơn đó). Bản ghi CHƯA RÕ không tính: tab khác gửi lại thành công → màn này phải báo "vừa đặt".
  const daThay = useRef(guiDo && guiDo.ma_don ? guiDo.khoa_gui : null);
  useEffect(() => {
    const nghe = (e) => { if (!e.key || e.key === KHOA_DON_GUI) ve((x) => x + 1); };
    window.addEventListener('storage', nghe);
    return () => window.removeEventListener('storage', nghe);
  }, []);
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
  const chanGhi = !dang && chanBoiBanGhi(guiDo, daThay.current); // MỘT luật: chưa rõ, hoặc đơn vừa đặt ở tab / cửa sổ khác
  const chuaRo = chanGhi && !guiDo.ma_don;
  const donKhac = chanGhi && !chuaRo ? guiDo.ma_don : '';
  const donCho = dsDon.dl && Array.isArray(dsDon.dl.data) ? dsDon.dl.data.find((d) => d.tien_trinh === 'cho_tra') : null;
  const chan = chanDat(gh) || chanPos;
  const khoa = !DAT_ONLINE || !!chan || !coThe || !bg || dang || dsDon.dangTai || chuaRo || !!donKhac || !!donCho || conGiay > 0 || monLoi;

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
    datThongBao(e.message);
  }

  // `cu` = bản ghi lần gửi chưa rõ: gửi lại ĐÚNG thân + khoá đó (PIN nhập lại, không nhớ).
  const guiDon = (pin, cu) => {
    // ĐIỂM GỬI: kiểm lại bản ghi ở đây (không chỉ ở nút) — bảng PIN mở sẵn mà tab khác vừa gửi / vừa đặt xong thì không gửi khoá mới.
    // Gửi lại (cu): chỉ khi bản ghi HIỆN TẠI vẫn đúng khoá đó và vẫn chưa rõ. Đơn mới: không bị bản ghi chặn và báo giá đang hiện còn đó.
    const g = docGuiDo();
    if (cu ? !conChuaRo(g, cu.khoa_gui) : chanBoiBanGhi(g, daThay.current) || !bg) { datMoPin(null); ve((x) => x + 1); return Promise.resolve(); }
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
      if (e.code === 'KHONG_BIET') {
        // Khoá đã dùng: đơn có thể đã đặt trước đó → GIỮ bản ghi (chỉ khi vẫn là của lần gửi này), không mời gửi lại / đặt lại.
        if (e.goc === 'KHOA_GUI_DA_DUNG' && conChuaRo(docGuiDo(), ghi.khoa_gui)) ghiGuiDo({ ...ghi, da_dung: true });
        datMoPin(null); return;
      }
      // POS trả 4xx: chắc chưa tạo → xoá bản ghi. Trừ gửi lại (cu) mà sai PIN: GIỮ bản ghi để nhập lại PIN gửi ĐÚNG khoá + thân cũ.
      // Gửi lại (cu) bị trần lượt: không chứng minh đơn cũ chưa tạo (chuỗi trước đã chưa rõ) → GIỮ bản ghi, đếm ngược rồi gửi lại đúng khoá.
      if (cu && e.code === 'QUA_NHIEU_LAN') { datMoPin(null); xuLyLoi(e); return; }
      // Cờ DAT_ONLINE tắt: chưa gửi gì tới POS nhưng bản ghi là của lần "chưa rõ" TRƯỚC → GIỮ (không coi là "chưa tạo").
      if (cu && e.code === 'CHUA_MO') { datMoPin(null); datThongBao(e.message); return; }
      if (MA_PIN.includes(e.code)) { if (!cu) ghiGuiDo(null); throw e; }
      ghiGuiDo(null);
      datMoPin(null);
      // Gửi lại đơn CŨ mà giá đã đổi: báo giá POS kèm theo là của giỏ cũ → KHÔNG đè bảng tiền của giỏ đang xem.
      if (cu && e.code === 'GIA_DA_DOI') { datThongBao('Giá đã đổi so với lần đặt trước — đơn đó chưa tạo, mời bạn đặt lại'); return; }
      xuLyLoi(e);
    });
  };
  const xacNhan = () => {
    if (khoa) return;
    if (cachTra === 'qr') guiDon(); else datMoPin({});
  };
  const guiLaiDungDon = () => { if (conGiay > 0) return; if (guiDo.cach_tra === 'qr') guiDon(undefined, guiDo); else datMoPin({ cu: guiDo }); };
  const boQua = () => { ghiGuiDo(null); ve((x) => x + 1); };
  const datThem = () => { daThay.current = guiDo.khoa_gui; ve((x) => x + 1); };
  const huyDonCho = () => {
    datDangHuy(true); datThongBao('');
    huyDon(donCho.ma).then(() => { datDangHuy(false); sauHuy(); dsDon.taiLai(); }, (e) => { datDangHuy(false); datThongBao(e.message); dsDon.taiLai(); });
  };
  const khongGuiLai = guiDo && (guiDo.quaHan || guiDo.da_dung); // POS không nhận lại khoá này → chỉ xem Lịch sử / bỏ qua
  const tenMon = (ma) => (ds.find((m) => m.ma === ma) || {}).ten || ma;

  // Số dư quyết định cách trả CHỈ lấy từ /toi gọi SAU khi mở màn (KH-NHANH-1 F1); chờ thì công tắc khoá.
  const viBat = cachTra !== 'qr';
  const loiSoDu = !toi.dangTai && soDu === null; // /toi lỗi: bấm dòng để đọc lại, KHÔNG tự đặt cách trả
  const dongVi = toi.dangTai ? 'Đang cập nhật số dư…' : loiSoDu ? 'Chưa đọc được số dư · Bấm để thử lại' : !viBat ? `Số dư ${dinhDangGia(soDu)}`
    : cachTra === 'vi' ? `Số dư ${dinhDangGia(soDu)} — đủ trả cả đơn` : `Dùng hết ${dinhDangGia(soDu)} trong ví, còn thiếu ${dinhDangGia(thieu)} → quét QR`;
  const batDuocVi = duoc.vi || duoc.viQr;
  const chuNut = !DAT_ONLINE ? CHU_CHUA_MO : dang ? (guiLai ? 'Mạng chậm, đang gửi lại…' : 'Đang gửi…') : dsDon.dangTai ? 'Đang kiểm tra đơn trước…'
    : chuaRo || donKhac || donCho ? 'Xử lý đơn trước rồi đặt tiếp' : conGiay ? `Thử lại sau ${conGiay} giây` : !bg ? 'Xác nhận'
      : cachTra === 'qr' ? `Thanh toán qua QR ${dinhDangGia(bg.tong)}` : cachTra === 'vi' ? `Trừ ví ${dinhDangGia(bg.tong)}` : `Trừ ví ${dinhDangGia(soDu)} + QR ${dinhDangGia(thieu)}`;
  // Khối cảnh báo / chờ: khuôn .nt-state của demo (biểu tượng + dòng đậm + dòng nhỏ).
  const canhBao = (tieuDe, phu) => <div className="nt-state" role="alert"><Ico ten="warning" s={18} /><div>{tieuDe}{phu && <small>{phu}</small>}</div></div>;

  return (
    <Man id="checkout">
      <DauManCon tieuDe="Thanh toán" phu="Chọn cách nhận hàng & trả tiền" lui={lui} canTrai />
      {chuaRo && (
        <>
          {guiDo.da_dung ? canhBao('Đơn này có thể đã đặt trước đó — mời bạn xem Lịch sử đơn')
            : guiDo.quaHan ? canhBao('Lần đặt trước (hơn 24 giờ) chưa rõ kết quả', 'Bạn xem Lịch sử đơn trước khi đặt đơn mới nhé.')
              : canhBao('Lần đặt trước chưa rõ kết quả', 'Nếu quán đã nhận đơn, sẽ không tạo đơn thứ hai.')}
          <div className="card bang-tien">
            {guiDo.than.mon.map((m, i) => <div className="summary-row" key={i}><span>{tenMon(m.ma)} ×{m.so_luong}</span></div>)}
            {Number.isInteger(guiDo.than.tong_da_xem) && <div className="summary-row total"><span>Tổng cộng</span><span>{dinhDangGia(guiDo.than.tong_da_xem)}</span></div>}
          </div>
          {/* Quá 24 giờ / POS đã báo KHOA_GUI_DA_DUNG → không mời gửi lại, chỉ xem Lịch sử / bỏ qua (khách tự bấm mới xoá bản ghi). */}
          {/* 429 khi gửi lại: khoá nút tới hết đếm ngược (cùng luật nút đặt) — bấm sớm chỉ thêm lượt bị chặn. */}
          {!khongGuiLai && <button type="button" className={`checkout-btn${conGiay || !DAT_ONLINE ? ' btn-disabled' : ''}`} aria-disabled={conGiay > 0 || !DAT_ONLINE} onClick={guiLaiDungDon}><span>{!DAT_ONLINE ? CHU_CHUA_MO : conGiay ? `Gửi lại sau ${conGiay} giây` : 'Gửi lại đúng đơn này'}</span><span>→</span></button>}
          <button type="button" className="ghost-btn" onClick={moLichSu}>Xem Lịch sử đơn</button>
          {khongGuiLai && <button type="button" className="ghost-btn" onClick={boQua}>Bỏ qua, đặt đơn mới</button>}
        </>
      )}
      {!chuaRo && donKhac && (
        <>
          {canhBao(`Bạn vừa đặt đơn #${donKhac} ở cửa sổ khác`, 'Bạn xem đơn đó trước khi đặt thêm nhé.')}
          <button type="button" className="checkout-btn" onClick={() => moDon(donKhac)}><span>Xem đơn {donKhac}</span><span>→</span></button>
          <button type="button" className="ghost-btn" onClick={datThem}>Đặt thêm đơn mới</button>
        </>
      )}
      {!chuaRo && !donKhac && donCho && (
        <>
          {canhBao(`Bạn có đơn #${donCho.ma} đang chờ trả`, 'Bạn trả tiếp hoặc huỷ đơn đó rồi đặt đơn mới nhé.')}
          <button type="button" className="checkout-btn" onClick={() => moDon(donCho.ma)}><span>Tiếp tục trả đơn {donCho.ma}</span><span>→</span></button>
          <button type="button" className={`ghost-btn${dangHuy ? ' btn-disabled' : ''}`} aria-disabled={dangHuy} onClick={dangHuy ? undefined : huyDonCho}>Huỷ đơn đó</button>
        </>
      )}
      <div className="sec-head" style={chuaRo || donKhac || donCho ? undefined : { marginTop: 0 }}><h2>Hình thức nhận hàng</h2></div>
      <div className="mode-row">
        <div className="mode-opt btn-disabled" aria-disabled="true"><div className="e"><Med ten="scooter" s={50} /></div><b>Giao tận nơi</b><span>Giao qua Ahamove · Sắp có</span></div>
        <div className="mode-opt active"><div className="e"><Med ten="store" s={50} /></div><b>Lấy tại quầy</b><span>Miễn phí giao</span></div>
      </div>
      <div className="card the-quay">
        <div className="quay-ten"><Ico ten="store" s={16} lop="ico-mint" /> Quán Tứ Quý Đường</div>
        <div className="quay-chu">Khi tới quầy, bạn đọc <b>số đơn</b> hiện trong app cho nhân viên.</div>
      </div>

      {soDu !== 0 && (
        <>
          <div className="sec-head"><h2>Cách trả tiền</h2></div>
          {/* CẢ dòng là chỗ bấm (ngón tay trên iPhone không trúng ô 42×24); .switch chỉ là hình. */}
          <div className={`notif-row the-vi${batDuocVi || loiSoDu ? '' : ' the-vi-khoa'}`} {...(loiSoDu ? bam(toi.taiLai) : batDuocVi ? bam(() => datDungVi(!dungVi)) : {})}
            role={loiSoDu ? 'button' : 'switch'} aria-label={loiSoDu ? undefined : 'Trừ từ số dư ví'} aria-checked={loiSoDu ? undefined : viBat} aria-disabled={loiSoDu ? undefined : !batDuocVi}>
            <div><div className="t">Trừ từ số dư ví</div><div className="s">{dongVi}</div></div>
            <div className={`switch${viBat ? ' on' : ''}`} aria-hidden="true" />
          </div>
        </>
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
