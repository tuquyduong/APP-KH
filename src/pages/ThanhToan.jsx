import { useEffect, useRef, useState } from 'react';
import { layDon, layToi } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungKho } from '../kho.js';
import { khoGioHoatDong } from '../gioHoatDong.js';
import { dinhDangGia } from '../dinhDang.js';
import { duocThanhToan, laThe } from '../gio.js';
import { dungGia } from '../heThong.js';
import { tenDongThe } from '../giaHang.js';
import { soDon } from '../hoaDon.js';
import {
  KHOA_DON_GUI, banGhiGui, chanBoiBanGhi, conChuaRo, cachTraDuoc, chanDatGio, docBaoGia, laLoiThe, maDonDaTra, phanGui, docGuiDo, ghiGuiDo, guiDonAnToan, huyDon, khoaGui, taoKhoaGui, thanDatDon, viThieu,
} from '../datDon.js';
import { DAT_ONLINE } from '../noiDung/caiDat.js';
import { nd, ndDau, ndPhan } from '../noiDung/nd.js';
import { docDungVi, ghiDungVi } from '../luuMay.js';
import { dungBaoGia } from '../dungDatDon.js';
import Man, { DauManCon } from '../components/Man.jsx';
import PinSheet from '../components/PinSheet.jsx';
import { Ico, Med } from '../components/BieuTuong.jsx';
import { bam } from '../components/bam.js';
import Chu from '../components/Chu.jsx';
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
const MA_MON = { HET_HANG: 'tt.monHetHang', MON_KHONG_BAN: 'tt.monKhongBan' }; // mã POS → khoá chữ nhãn món (danh mục nội dung)
const layDonDau = () => layDon(1);
const KHOA_LOI_APP = ['loi.GIA_DA_DOI', 'loi.GIA_DA_DOI_CU', 'loi.CHUA_MO', 'loi.CHUA_RO', 'loi.NGOAI_GIO']; // câu App tự viết (sửa được); câu khác là lời POS (🔒 tt.thongBao)
const khoaLoi = (s) => KHOA_LOI_APP.find((k) => nd(k) === s) || 'tt.thongBao';

// `chiThe` (/thanhtoan?chi=the, KH-THE-1 C3): "Trả thẻ trước" — gửi CHỈ dòng thẻ, không mã giảm (phanGui); mọi luật khác của đơn giữ nguyên.
export default function ThanhToan({ gio: gioCa, ds, maGiam, lui, xong, moLichSu, moDon, veGio, danhDauMon, sauHuy, chiThe = false, daTra }) {
  const { dsHang } = dungGia();
  const { gio, tuy } = phanGui(gioCa, { maGiam }, chiThe);
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

  const coThe = duocThanhToan(gio, ds, dsHang);
  const { bg, loi, datBg } = dungBaoGia(gio, tuy, coThe);
  const soDu = toi.dl && toi.dl.khach ? toi.dl.khach.so_du_vi : null;
  const duoc = cachTraDuoc(bg && bg.tong, soDu);
  const thieu = viThieu(bg && bg.tong, soDu);
  const cachTra = !dungVi ? 'qr' : duoc.vi ? 'vi' : duoc.viQr ? 'vi_qr' : 'qr';
  const chanGhi = !dang && chanBoiBanGhi(guiDo, daThay.current); // MỘT luật: chưa rõ, hoặc đơn vừa đặt ở tab / cửa sổ khác
  const chuaRo = chanGhi && !guiDo.ma_don;
  const donKhac = chanGhi && !chuaRo ? guiDo.ma_don : '';
  const nhanDon = (ma) => soDon(((dsDon.dl && dsDon.dl.data) || []).find((d) => d.ma === ma)?.so_hd, ma); // số đơn hiện cho khách; ma chỉ để gọi API
  const donCho = dsDon.dl && Array.isArray(dsDon.dl.data) ? dsDon.dl.data.find((d) => d.tien_trinh === 'cho_tra') : null;
  // C7: GET /don của màn này thấy đơn vừa gửi ĐÃ trả (tiền QR về khi khách đã rời Theo dõi đơn) → dọn giỏ bằng CÙNG hàm daTra; chờ dọn thì khoá nút (không mua thẻ hai lần).
  const maXong = dsDon.dl ? maDonDaTra(guiDo, dsDon.dl.data) : '';
  useEffect(() => { if (maXong) daTra(maXong); }, [maXong]);
  const chan = chanDatGio(gh, gio) || chanPos; // giỏ chỉ thẻ đặt mọi giờ (v13)
  const khoa = !DAT_ONLINE || !!chan || !coThe || !bg || dang || dsDon.dangTai || chuaRo || !!donKhac || !!donCho || conGiay > 0 || monLoi || !!maXong;

  function xuLyLoi(e) {
    const dl = e.duLieu || {};
    if (e.code === 'GIA_DA_DOI') { const b = docBaoGia(dl.bao_gia); if (b) datBg(b); datThongBao(nd('loi.GIA_DA_DOI')); return; }
    if (e.code === 'QUA_NHIEU_LAN') { datHetLuc(Date.now() + (Number(dl.thu_lai_sau_giay) || 60) * 1000); datThongBao(e.message); return; }
    if (MA_NGOAI_GIO.includes(e.code)) { datChanPos(e.message); return; }
    if (laLoiThe(e)) { datMonLoi(true); datThongBao(e.message); danhDauMon({ the: true, chu: e.message }); return; } // lời POS nguyên văn, đánh dấu dòng thẻ
    if (MA_MON[e.code]) {
      const m = ds.find((x) => x.ma === dl.ma);
      datMonLoi(true); datThongBao(m ? `${e.message} — ${m.ten}` : e.message);
      danhDauMon({ ma: dl.ma, chu: nd(MA_MON[e.code]) });
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
      if (cu && e.code === 'GIA_DA_DOI') { datThongBao(nd('loi.GIA_DA_DOI_CU')); return; }
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
  const tenGui = (m) => (laThe(m) ? tenDongThe(m, dsHang) : `${tenMon(m.ma)} ×${m.so_luong}`);

  // Số dư quyết định cách trả CHỈ lấy từ /toi gọi SAU khi mở màn (KH-NHANH-1 F1); chờ thì công tắc khoá.
  const viBat = cachTra !== 'qr';
  const loiSoDu = !toi.dangTai && soDu === null; // /toi lỗi: bấm dòng để đọc lại, KHÔNG tự đặt cách trả
  const [kVi, bienVi] = toi.dangTai ? ['tt.vi.dangTai'] : loiSoDu ? ['tt.vi.loi'] : !viBat ? ['tt.vi.soDu', { gia: dinhDangGia(soDu) }]
    : cachTra === 'vi' ? ['tt.vi.du', { gia: dinhDangGia(soDu) }] : ['tt.vi.thieu', { gia: dinhDangGia(soDu), thieu: dinhDangGia(thieu) }];
  const dongVi = nd(kVi, bienVi);
  const batDuocVi = duoc.vi || duoc.viQr;
  const [kNut, bienNut] = !DAT_ONLINE ? ['loi.CHUA_MO'] : dang ? [guiLai ? 'tt.nut.guiLai' : 'tt.nut.dangGui'] : dsDon.dangTai ? ['tt.nut.kiemTra']
    : chuaRo || donKhac || donCho ? ['tt.nut.xuLyTruoc'] : conGiay ? ['tt.nut.thuLai', { giay: conGiay }] : !bg ? ['tt.nut.xacNhan']
      : cachTra === 'qr' ? ['tt.nut.qr', { tong: dinhDangGia(bg.tong) }] : cachTra === 'vi' ? ['tt.nut.vi', { tong: dinhDangGia(bg.tong) }] : ['tt.nut.viQr', { vi: dinhDangGia(soDu), qr: dinhDangGia(thieu) }];
  const [kGuiLai, bienGuiLai] = !DAT_ONLINE ? ['loi.CHUA_MO'] : conGiay ? ['tt.guiLai.cho', { giay: conGiay }] : ['tt.guiLai.nut'];
  // Khối cảnh báo / chờ: khuôn .nt-state của demo (biểu tượng + dòng đậm + dòng nhỏ).
  // kT / kP = khoá chữ của dòng đậm / dòng nhỏ (danh mục nội dung) để gắn data-nd.
  const canhBao = (tieuDe, phu, kT, kP) => <div className="nt-state" role="alert"><Ico ten="warning" s={18} /><div {...(kT ? ndDau(kT) : {})}>{tieuDe}{phu && <small {...(kP ? ndDau(kP) : {})}>{phu}</small>}</div></div>;

  return (
    <Man id="checkout">
      <DauManCon tieuDe={nd('tt.tieuDe')} phu={nd('tt.phu')} lui={lui} canTrai />
      {chuaRo && (
        <>
          {guiDo.da_dung ? canhBao(nd('tt.daDung.t'), '', 'tt.daDung.t')
            : guiDo.quaHan ? canhBao(nd('tt.quaHan.t'), nd('tt.quaHan.p'), 'tt.quaHan.t', 'tt.quaHan.p')
              : canhBao(nd('tt.chuaRo.t'), nd('tt.chuaRo.p'), 'tt.chuaRo.t', 'tt.chuaRo.p')}
          <div className="card bang-tien">
            {guiDo.than.mon.map((m, i) => <div className="summary-row" key={i}><span {...ndDau(laThe(m) ? 'tt.the' : 'tt.so')}>{tenGui(m)}</span></div>)}
            {Number.isInteger(guiDo.than.tong_da_xem) && <div className="summary-row total"><Chu k="tt.tong" /><span {...ndDau('tt.so')}>{dinhDangGia(guiDo.than.tong_da_xem)}</span></div>}
          </div>
          {/* Quá 24 giờ / POS đã báo KHOA_GUI_DA_DUNG → không mời gửi lại, chỉ xem Lịch sử / bỏ qua (khách tự bấm mới xoá bản ghi). */}
          {/* 429 khi gửi lại: khoá nút tới hết đếm ngược (cùng luật nút đặt) — bấm sớm chỉ thêm lượt bị chặn. */}
          {!khongGuiLai && <button type="button" className={`checkout-btn${conGiay || !DAT_ONLINE ? ' btn-disabled' : ''}`} aria-disabled={conGiay > 0 || !DAT_ONLINE} onClick={guiLaiDungDon}><span {...ndDau(kGuiLai)}>{nd(kGuiLai, bienGuiLai)}</span><span>→</span></button>}
          <Chu k="tt.lichSu" as="button" type="button" className="ghost-btn" onClick={moLichSu} />
          {khongGuiLai && <Chu k="tt.boQua" as="button" type="button" className="ghost-btn" onClick={boQua} />}
        </>
      )}
      {!chuaRo && donKhac && (
        <>
          {canhBao(nd('tt.donKhac.t', { don: nhanDon(donKhac) }), nd('tt.donKhac.p'), 'tt.donKhac.t', 'tt.donKhac.p')}
          <button type="button" className="checkout-btn" onClick={() => moDon(donKhac)}><Chu k="tt.donKhac.xem" bien={{ don: nhanDon(donKhac) }} /><span>→</span></button>
          <Chu k="tt.donKhac.them" as="button" type="button" className="ghost-btn" onClick={datThem} />
        </>
      )}
      {!chuaRo && !donKhac && donCho && (
        <>
          {canhBao(nd('tt.donCho.t', { don: nhanDon(donCho.ma) }), nd('tt.donCho.p'), 'tt.donCho.t', 'tt.donCho.p')}
          <button type="button" className="checkout-btn" onClick={() => moDon(donCho.ma)}><Chu k="tt.donCho.tiep" bien={{ don: nhanDon(donCho.ma) }} /><span>→</span></button>
          <Chu k="tt.donCho.huy" as="button" type="button" className={`ghost-btn${dangHuy ? ' btn-disabled' : ''}`} aria-disabled={dangHuy} onClick={dangHuy ? undefined : huyDonCho} />
        </>
      )}
      <div className="sec-head" style={chuaRo || donKhac || donCho ? undefined : { marginTop: 0 }}><Chu k="tt.nhan.tieuDe" as="h2" /></div>
      <div className="mode-row">
        <div className="mode-opt btn-disabled" aria-disabled="true"><div className="e"><Med ten="scooter" s={50} /></div><Chu k="tt.nhan.giao" as="b" /><Chu k="tt.nhan.giao.phu" /></div>
        <div className="mode-opt active"><div className="e"><Med ten="store" s={50} /></div><Chu k="tt.nhan.quay" as="b" /><Chu k="tt.nhan.quay.phu" /></div>
      </div>
      <div className="card the-quay">
        <div className="quay-ten"><Ico ten="store" s={16} lop="ico-mint" /> <Chu k="tt.quay.ten" /></div>
        <div className="quay-chu" {...ndDau('tt.quay.chu')}>{ndPhan('tt.quay.chu', { so: <b key="so" {...ndDau('tt.quay.so')}>{nd('tt.quay.so')}</b> })}</div>
      </div>

      {soDu !== 0 && (
        <>
          <div className="sec-head"><Chu k="tt.tra.tieuDe" as="h2" /></div>
          {/* CẢ dòng là chỗ bấm (ngón tay trên iPhone không trúng ô 42×24); .switch chỉ là hình. */}
          <div className={`notif-row the-vi${batDuocVi || loiSoDu ? '' : ' the-vi-khoa'}`} {...(loiSoDu ? bam(toi.taiLai) : batDuocVi ? bam(() => datDungVi(!dungVi)) : {})}
            role={loiSoDu ? 'button' : 'switch'} aria-label={loiSoDu ? undefined : nd('tt.vi.nhan')} aria-checked={loiSoDu ? undefined : viBat} aria-disabled={loiSoDu ? undefined : !batDuocVi}>
            <div><Chu k="tt.vi.nhan" as="div" className="t" /><div className="s" {...ndDau(kVi)}>{dongVi}</div></div>
            <div className={`switch${viBat ? ' on' : ''}`} aria-hidden="true" />
          </div>
        </>
      )}

      <BangTien bg={bg} loi={loi} />
      {chan && canhBao(chan, '', khoaLoi(chan))}
      {dang && guiLai && canhBao(nd('tt.mang.t'), nd('tt.mang.p'), 'tt.mang.t', 'tt.mang.p')}
      {thongBao && canhBao(thongBao, '', khoaLoi(thongBao))}
      <button type="button" className={`checkout-btn nut-dat${khoa ? ' btn-disabled' : ''}`} aria-disabled={khoa} onClick={xacNhan}>
        <span {...ndDau(kNut)}>{nd(kNut, bienNut)}</span><span>→</span>
      </button>
      {monLoi && <Chu k="tt.veGio" as="button" type="button" className="ghost-btn" onClick={veGio} />}
      {canPin && <Chu k="tt.datPin" as="button" type="button" className="ghost-btn" onClick={() => datMoDatPin(true)} />}
      {moPin && <PinSheet gui={(pin) => guiDon(pin, moPin.cu)} dong={() => datMoPin(null)} />}
      {moDatPin && <PinSheet dong={() => { datMoDatPin(false); datCanPin(false); }} />}
    </Man>
  );
}
