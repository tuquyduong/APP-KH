import { useEffect, useRef, useState } from 'react';
import { layKhoQua, doiDiemApp } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungCua, cuaToi, cuaDiem, cuaVoucher, cuaQuaToi, gopPhieuQua, khachDangGiu } from '../duLieuKhach.js';
import { guiDonAnToan, khoaGui, taoKhoaGui } from '../datDon.js';
import { docKhoQua, docQuaCuaToi, docKetQuaDoi, conLaiSauDoi, ngayPos, khoaChoRo, ghiChoRo, xoaChoRo } from '../doiQua.js';
import { dinhDangSo } from '../dinhDang.js';
import { nd, ndDau, ndPhan } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import PinSheet from '../components/PinSheet.jsx';
import { Ico, Med } from '../components/BieuTuong.jsx';
import AnhQua from '../components/AnhQua.jsx';
import '../giaoDien/the_hang.css';
import '../giaoDien/doi_qua.css';

// Kho quà (/uudai/doi-qua, KH-DOI-1 — thiết kế duyệt 26.11): điểm (/diem — gọi MỚI mỗi lần mở màn), ô Quà của tôi + số phiếu chờ nhận, dải nhắc (`nhac` POS — câu 4a),
// thẻ quà ĐÚNG thứ tự POS (câu 3a), bảng PIN đổi quà, màn "Đã đổi quà!" (voucher; số điểm còn lại = `diem_con` POS). Hiện vật xong → Phiếu quà (câu 2a).
// Một lần bấm "Xác nhận" = một khoa_gui. ĐANG GỬI: khoá chặn gửi song song ở CẤP MÔ-ĐUN (guiDoi — rời màn rồi vào lại vẫn chặn). guiDonAnToan tự gửi lại CÙNG thân
// khi chưa rõ; vẫn chưa rõ → ghi khoá của quà đó (doiQua.ghiChoRo) — lần bấm sau cho ĐÚNG quà đó (kể cả sau khi rời màn) dùng LẠI khoá (PIN nhập lại, không lưu) tới khi xong.
const POS = ndDau('dq.pos');
const NUT = { het: 'dq.nut.het', luot: 'dq.nut.luot', doi: 'dq.nut.doi' };

// MỘT lần gửi đang chạy cho cả App. `cung()` = khách đang giữ phiên vẫn là khách lúc bấm: khác (đăng xuất / người khác đăng nhập giữa các lần tự gửi lại) → KHÔNG gửi
// thân của khách trước bằng phiên mới (lỗi có code → guiDonAnToan dừng; lần đầu = chưa tạo, sau lần chưa rõ = KHONG_BIET).
const DOI_KHACH = () => Promise.reject(Object.assign(new Error(nd('dq.chuaRo')), { status: 409, code: 'DOI_KHACH' }));
const layMoiSauDoi = () => [cuaDiem, cuaVoucher, cuaQuaToi].forEach((c) => c.layMoi()); // bỏ GET đang bay từ trước lần đổi (bản cũ không đè phiếu vừa gộp)
const guiDoi = khoaGui((than, cung) => guiDonAnToan(than, { gui: (t) => (cung() ? doiDiemApp(t) : DOI_KHACH()), doc: docKetQuaDoi }));

function TheQua({ q, doi }) {
  const [k, bien] = q.nut !== 'thieu' ? [NUT[q.nut]] : q.thieu ? ['dq.nut.thieu', { so: dinhDangSo(q.thieu) }] : ['dq.nut.chuaDu'];
  const duoc = q.nut === 'doi';
  return (
    <div className={`dq-the${q.nut === 'het' || q.nut === 'luot' ? ' mo' : ''}`}>
      <div className="ic"><AnhQua anh={q.anh} loai={q.loai} /></div>
      <div className="info">
        <div className="t"><span {...POS}>{q.ten}</span>{q.loai === 'hien_vat' && <Chu k="dq.chip" className="dq-chip" />}</div>
        {q.moTa && <div className="m" {...POS}>{q.moTa}</div>}
        <div className="pts" {...ndDau('dq.diem')}>{nd('dq.diem', { so: dinhDangSo(q.diemCan) })}</div>
      </div>
      <button type="button" className={`dq-doi${duoc ? '' : ' tat'}`} disabled={!duoc} onClick={() => { if (duoc) doi(q); }} {...ndDau(k)}>{nd(k, bien)}</button>
    </div>
  );
}

/** Khối tóm tắt trên bàn phím PIN: tên quà, "Trừ N điểm", "Còn lại M điểm" (M chỉ để xem — thiếu điểm thì không hiện). */
function TomTat({ q, diem }) {
  const con = conLaiSauDoi(diem, q.diemCan);
  return (
    <div className="dq-xn">
      <div className="ten" {...POS}>{q.ten}</div>
      <div className="tru">
        <span {...ndDau('dq.pin.tru')}>{ndPhan('dq.pin.tru', { so: <b key="so">{nd('dq.diem', { so: dinhDangSo(q.diemCan) })}</b> })}</span>
        {con !== null && <span {...ndDau('dq.pin.con')}>{ndPhan('dq.pin.con', { so: <b key="so">{nd('dq.diem', { so: dinhDangSo(con) })}</b> })}</span>}
      </div>
    </div>
  );
}

function DaDoi({ kq, moMenu, veKho }) {
  return (
    <>
      <div className="cm-dau">
        <div className="dq-hero"><Chu k="dq.xong.lbl" as="div" className="lbl" /><div className="amt" {...ndDau('dq.diemPos')}>{nd('dq.hero.so', { so: dinhDangSo(kq.diemCon) })}</div></div>
        <Med ten="ticket" s={84} />
        <Chu k="dq.xong.t" as="h2" />
        <p {...ndDau('dq.xong.p')}>{nd('dq.xong.p', { ten: kq.ten })}</p>
        <span className="dq-ma" {...POS}>{kq.voucherCode}</span>
      </div>
      <button type="button" className="checkout-btn cm-nut" onClick={moMenu}><span {...ndDau('dq.xong.nut')}>{nd('dq.xong.nut')}</span><span>→</span></button>
      <Chu k="dq.xong.ve" as="button" type="button" className="ghost-btn cm-gio" onClick={veKho} />
    </>
  );
}

export default function DoiQua({ lui, moQuaToi, moPhieu, moMenu }) {
  const kho = dungTai(layKhoQua);
  const diem = dungCua(cuaDiem);
  dungCua(cuaToi, { that: true }); // khách đang giữ phiên (khachDangGiu) — khoá đổi quà gắn với khách
  const qt = dungCua(cuaQuaToi);
  useEffect(() => { cuaDiem.lay(); }, []); // điểm MỚI để so / tính "Còn lại"; phiên hết thì /diem đẩy ra đăng nhập (401 của /kho-qua không — api.js)
  const [chon, datChon] = useState(null);
  const [xong, datXong] = useState(null);
  const [loiPin, datLoiPin] = useState(''); // CHUA_CO_PIN: lời POS + nút đặt PIN
  const [datPinMo, datDatPinMo] = useState(false);
  const conMo = useRef(true); // màn còn mở: kết quả về sau khi khách đã rời màn thì không đổi màn / không kéo khách sang Phiếu quà
  useEffect(() => { conMo.current = true; return () => { conMo.current = false; }; }, []);

  const soDiem = diem.dl && Number.isInteger(diem.dl.points) ? diem.dl.points : undefined;
  const { cho } = docQuaCuaToi(qt.dl);
  const nhac = cho.find((p) => p.nhac);

  const doi = (pin) => {
    const q = chon, chu = khachDangGiu();
    if (!chu) { cuaToi.lay(); return Promise.reject(new Error(nd('dq.choKhach'))); } // chưa biết khách (GET /toi chưa về / lỗi): tải lại hồ sơ, chưa gửi
    const cungKhach = () => khachDangGiu() === chu;
    const cu = khoaChoRo(q.ma, chu);
    const than = { ma_qua: q.ma, khoa_gui: cu || taoKhoaGui(), pin };
    const p = guiDoi(than, cungKhach);
    if (!p) return Promise.reject(new Error(nd('dq.dangGui'))); // một lần đổi khác còn đang gửi (kể cả từ lần mở màn trước): không gửi song song
    return p.then((kq) => {
      if (!cungKhach()) return; // phiên đã sang người khác / đã đăng xuất: không ghi gì vào kho, bản ghi, màn của phiên mới
      xoaChoRo(q.ma);
      layMoiSauDoi();
      if (kq.phieuTho) gopPhieuQua(kq.phieuTho);
      if (!conMo.current) return;
      kho.taiLai();
      datChon(null);
      if (kq.loai === 'hien_vat') moPhieu(kq.phieu.ma); else datXong({ ...kq, ten: q.ten });
    }, (e) => {
      // Có thể đã trừ: GHI khoá (gắn khách A) TRƯỚC mọi phép thử phiên — kể cả khi 401 giữa chuỗi tự gửi lại vừa xoá phiên: A đăng nhập lại bấm cùng quà → cùng khoá.
      if (e.code === 'KHONG_BIET') ghiChoRo(q.ma, than.khoa_gui, chu);
      if (!cungKhach()) throw new Error(nd('dq.chuaRo'));
      if (e.code === 'KHONG_BIET') { // lấy lại điểm / kho / phiếu để khách thấy số mới
        layMoiSauDoi(); if (conMo.current) kho.taiLai();
        throw new Error(nd('dq.chuaRo'));
      }
      if (!cu) xoaChoRo(q.ma); // 4xx có mã cho khoá MỚI → chắc chưa trừ; khoá CŨ của lần chưa rõ → GIỮ (4xx không chứng minh lần đầu chưa trừ)
      if (e.code === 'CHUA_CO_PIN') { datChon(null); datLoiPin(e.message); return; }
      throw e;
    });
  };
  const moDoi = (q) => { datLoiPin(''); datChon(q); };

  return (
    <Man id="doiqua">
      <DauManCon tieuDe={nd('dq.tieuDe')} lui={xong ? () => datXong(null) : lui} />
      {xong ? <DaDoi kq={xong} moMenu={moMenu} veKho={() => datXong(null)} /> : (
        <>
          <div className="dq-hero">
            {soDiem !== undefined && <div className="amt" {...ndDau('dq.diemPos')}>{nd('dq.hero.so', { so: dinhDangSo(soDiem) })}</div>}
            <Chu k="dq.hero.lbl" as="div" className="lbl" />
          </div>
          <button type="button" className="dq-cua" onClick={moQuaToi}>
            <Med ten="gift" s={30} /><span {...ndDau('dq.cua')}>{nd('dq.cua')}</span>
            {cho.length > 0 && <span className="so" {...ndDau('dq.cua.so')}>{nd('dq.cua.so', { so: cho.length })}</span>}<span className="mui">›</span>
          </button>
          {nhac && <div className="dq-nhac" {...ndDau('dq.nhac')}><Ico ten="warning" s={16} /><div>{ndPhan('dq.nhac', { ten: <b key="ten">{nhac.ten}</b>, ngay: ngayPos(nhac.hetHan) })}</div></div>}
          {loiPin && (
            <div className="dq-nhac" role="alert"><Ico ten="warning" s={16} /><div><div {...ndDau('dq.loiPos')}>{loiPin}</div>
              <Chu k="dq.datPin" as="button" type="button" className="ghost-btn dq-dat-pin" onClick={() => datDatPinMo(true)} /></div></div>
          )}
          <div className="sec-head"><Chu k="dq.kho" as="h2" /></div>
          <TrangTai tai={kho}>
            {(dl) => {
              const ds = docKhoQua(dl, soDiem);
              return ds.length === 0 ? <Chu k="dq.kho.rong" as="div" className="empty-note" /> : ds.map((q) => <TheQua key={q.ma} q={q} doi={moDoi} />);
            }}
          </TrangTai>
          <Chu k="dq.ghiChu" as="div" className="care-disclaimer qr-chu dq-ghi" />
        </>
      )}
      {chon && <PinSheet gui={doi} dong={() => datChon(null)} khoaTieuDe="dq.pin.t" tren={<TomTat q={chon} diem={soDiem} />} />}
      {datPinMo && <PinSheet dong={() => { datDatPinMo(false); datLoiPin(''); }} />}
    </Man>
  );
}
