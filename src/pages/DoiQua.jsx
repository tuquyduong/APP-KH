import { useEffect, useRef, useState } from 'react';
import { layKhoQua, doiDiemApp } from '../api.js';
import { dungTai } from '../dungTai.js';
import { dungCua, cuaDiem, cuaVoucher, cuaQuaToi, lamMoi } from '../duLieuKhach.js';
import { guiDonAnToan, khoaGui, taoKhoaGui } from '../datDon.js';
import { docKhoQua, docQuaCuaToi, docKetQuaDoi, conLaiSauDoi, ngayPos } from '../doiQua.js';
import { dinhDangSo } from '../dinhDang.js';
import { nd, ndDau, ndPhan } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import PinSheet from '../components/PinSheet.jsx';
import { Ico, Med } from '../components/BieuTuong.jsx';
import '../giaoDien/the_hang.css';
import '../giaoDien/doi_qua.css';

// Kho quà (/uudai/doi-qua, KH-DOI-1 — thiết kế duyệt 26.11): điểm (/diem — gọi MỚI mỗi lần mở màn), ô Quà của tôi + số phiếu chờ nhận, dải nhắc (`nhac` POS — câu 4a),
// thẻ quà ĐÚNG thứ tự POS (câu 3a), bảng PIN đổi quà, màn "Đã đổi quà!" (voucher; số điểm còn lại = `diem_con` POS). Hiện vật xong → Phiếu quà (câu 2a).
// Một lần bấm "Xác nhận" = một khoa_gui; guiDonAnToan tự gửi lại CÙNG thân khi chưa rõ; vẫn chưa rõ → lần Xác nhận sau dùng LẠI khoá + mã quà đó (PIN nhập lại, không lưu).
const POS = ndDau('dq.pos');

/** Ảnh quà / phiếu: `anh` POS (https) hoặc huy hiệu theo loại (voucher → vé, hiện vật → hộp quà). */
export function AnhQua({ anh, loai, s = 44 }) {
  return anh ? <img src={anh} alt="" width={s} height={s} loading="lazy" {...POS} /> : <Med ten={loai === 'voucher' ? 'ticket' : 'gift'} s={s} />;
}

function TheQua({ q, doi }) {
  const [k, bien] = q.nut === 'het' ? ['dq.nut.het'] : q.nut === 'luot' ? ['dq.nut.luot'] : q.nut === 'thieu' ? (q.thieu ? ['dq.nut.thieu', { so: dinhDangSo(q.thieu) }] : ['dq.nut.chuaDu']) : ['dq.nut.doi'];
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
  const qt = dungCua(cuaQuaToi);
  useEffect(() => { cuaDiem.lay(); }, []); // điểm MỚI để so / tính "Còn lại"; phiên hết thì /diem đẩy ra đăng nhập (401 của /kho-qua không — api.js)
  const [chon, datChon] = useState(null);
  const [xong, datXong] = useState(null);
  const [loiPin, datLoiPin] = useState(''); // CHUA_CO_PIN: lời POS + nút đặt PIN
  const [datPinMo, datDatPinMo] = useState(false);
  const choRo = useRef(null); // { ma_qua, khoa_gui } của lần gửi chưa rõ
  const gui = useRef(null);
  if (!gui.current) gui.current = khoaGui((than) => guiDonAnToan(than, { gui: doiDiemApp, doc: docKetQuaDoi }));

  const soDiem = diem.dl && Number.isInteger(diem.dl.points) ? diem.dl.points : undefined;
  const { cho } = docQuaCuaToi(qt.dl);
  const nhac = cho.find((p) => p.nhac);

  const doi = (pin) => {
    const q = chon;
    const cu = choRo.current && choRo.current.ma_qua === q.ma ? choRo.current : null;
    const than = { ma_qua: q.ma, khoa_gui: cu ? cu.khoa_gui : taoKhoaGui(), pin };
    const p = gui.current(than);
    if (!p) return Promise.resolve(); // đang gửi: bấm thêm không gửi lần hai
    return p.then((kq) => {
      choRo.current = null;
      lamMoi([cuaDiem, cuaVoucher, cuaQuaToi]);
      kho.taiLai();
      datChon(null);
      if (kq.loai === 'hien_vat') moPhieu(kq.phieu.ma); else datXong({ ...kq, ten: q.ten });
    }, (e) => {
      if (e.code === 'KHONG_BIET') { choRo.current = { ma_qua: q.ma, khoa_gui: than.khoa_gui }; throw new Error(nd('dq.chuaRo')); }
      choRo.current = null; // POS trả lỗi chắc chắn (chưa trừ gì) → lần sau khoá mới
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
