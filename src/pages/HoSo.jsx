import { useState } from 'react';
import { suaHoSo } from '../api.js';
import { dungCua, cuaToi, gopToi, lamMoi } from '../duLieuKhach.js';
import { cheSdt, chiaLoiChao, hienNgaySinh, tachNgaySinh } from '../dinhDang.js';
import { bayGio, coBayGio } from '../bayGio.js';
import { XUNG_HO, DIA_CHI_TOI_DA, tenXungHo } from '../noiDung/dangNhap.js';
import { nd, ndDau } from '../noiDung/nd.js';
import Chu from '../components/Chu.jsx';
import Man, { DauManCon } from '../components/Man.jsx';
import TrangTai from '../components/TrangTai.jsx';
import PinSheet from '../components/PinSheet.jsx';
import { Ico } from '../components/BieuTuong.jsx';

// Thông tin cá nhân theo demo (profile): "Quán gọi bạn là" (xưng hô), Thông tin (tên, số điện thoại che giữa), Ngày sinh (nhập MỘT lần — KH-SINH-1),
// Giao hàng (một địa chỉ), Bảo mật (mã PIN).
// Bỏ: email, giới tính, nhiều địa chỉ, hoá đơn công ty, quên PIN bằng OTP, thiết bị đăng nhập, xoá tài khoản — POS chưa có cửa (KH-HOSO-1).
// Mọi nút lưu cùng đi `suaHoSo({ khoá_đổi })`: thân PUT /toi chỉ có khoá đang sửa.

/** Một thẻ lưu: { dang, loi, xong, luu(truong) → true nếu POS nhận }. `khiXong(khach)` nhận hồ sơ POS trả về; `khiLoi(e)` trả true = đã xử lý, không hiện lỗi. */
function dungLuu(khiXong, khiLoi) {
  const [tt, datTt] = useState({ dang: false, loi: '', xong: false });
  async function luu(truong) {
    datTt({ dang: true, loi: '', xong: false });
    try { const r = await suaHoSo(truong); khiXong(r.khach || {}); datTt({ dang: false, loi: '', xong: true }); return true; } catch (e) { datTt({ dang: false, loi: khiLoi && khiLoi(e) ? '' : e.message, xong: false }); return false; }
  }
  return { ...tt, luu, boXong: () => datTt((t) => ({ ...t, xong: false })) };
}
// `chu` = KHOÁ nội dung của câu báo đã lưu; lỗi là lời POS (hoặc câu lỗi chung của khung).
const Bao = ({ s, chu }) => (
  <>
    {s.loi && <div className="nt-state" role="alert"><Ico ten="warning" s={16} /><div {...ndDau('hs.loi')}>{s.loi}</div></div>}
    {s.xong && <div className="save-ok" role="status"><Ico ten="check" s={14} /> <span {...ndDau(chu)}>{nd(chu)}</span></div>}
  </>
);

function XungHo({ ho, doi }) {
  const s = dungLuu(doi);
  const { dau, coBuoi, xung, ten } = chiaLoiChao(coBayGio() ? bayGio() : '', tenXungHo(ho.xung_ho), ho.ten);
  return (
    <div className="card pf-card">
      <Chu k="hs.xh.t" as="div" className="tt" />
      <div className="pf-chips" {...ndDau('hs.xh.chu')}>
        {XUNG_HO.map((x) => <button key={x.ma} type="button" className={ho.xung_ho === x.ma ? 'on' : ''} disabled={s.dang} onClick={() => ho.xung_ho !== x.ma && s.luu({ xung_ho: x.ma })}>{x.ten}</button>)}
      </div>
      <div className="pf-prev"><Ico ten="chat" s={14} /> <span {...ndDau('chao.dau')}>“{dau}{coBuoi ? ',' : ''} {xung && <b>{xung}</b>}{xung && ten ? ' ' : ''}{ten}!”</span></div>
      <Bao s={s} chu="hs.xh.daLuu" />
    </div>
  );
}

function SuaTen({ ho, doi }) {
  const [ten, datTen] = useState(ho.ten || '');
  const s = dungLuu((khach) => { datTen(khach.ten ?? ten.trim()); doi(khach); });
  return (
    <div className="card pf-card">
      <Chu k="hs.ten.t" as="div" className="tt" />
      <div className="pf-row">
        <Chu k="hs.ten.nhan" as="label" htmlFor="ten-toi" />
        <input id="ten-toi" {...ndDau('hs.khach')} value={ten} onChange={(e) => { datTen(e.target.value); s.boXong(); }} />
      </div>
      <div className="hq-btns"><button type="button" className="hq-b" disabled={s.dang || !ten.trim()} onClick={() => s.luu({ ten: ten.trim() })} {...ndDau('hs.ten.nut')}>{nd('hs.ten.nut')}</button></div>
      <Bao s={s} chu="hs.ten.daLuu" />
      <div className="pf-row">
        <Chu k="hs.sdt.nhan" as="label" />
        <div className="pf-lock" {...ndDau('hs.khach')}>{cheSdt(ho.sdt)}</div>
        <Chu k="hs.sdt.phu" as="small" />
      </div>
    </div>
  );
}

/** Ngày sinh nhập MỘT lần (hợp đồng v9): chưa có → ô chọn ngày + hỏi lại + Lưu; đã có → chỉ xem (quán sửa ở POS). Không lưu trên máy. */
function NgaySinh({ ho, doi }) {
  const [v, datV] = useState('');
  const [hoi, datHoi] = useState(false);
  // NGAY_SINH_DA_CO (máy khác vừa nhập): đọc lại /toi, thẻ chuyển sang chế độ xem với ngày POS đang giữ — không hiện lỗi.
  const s = dungLuu((khach) => doi({ ...khach, ngay_sinh: khach.ngay_sinh ?? v }), (e) => e.code === 'NGAY_SINH_DA_CO' && (lamMoi([cuaToi]), true));
  const homNay = bayGio().slice(0, 10); // ngày lịch VN, chỉ để chặn ngày tương lai; tuổi do POS chặn
  const hopLe = !!tachNgaySinh(v) && v <= homNay;
  const gui = () => { datHoi(false); return s.luu({ ngay_sinh: v }); };
  const daCo = hienNgaySinh(ho.ngay_sinh);
  return (
    <div className="card pf-card">
      <Chu k="hs.ns.t" as="div" className="tt" />
      {daCo ? (
        <>
          <div className="pf-lock pf-ns-xem" {...ndDau('hs.khach')}>{daCo}</div>
          <Chu k="hs.ns.suaQuay" as="div" className="pf-note" />
        </>
      ) : hoi ? (
        <div className="pf-xn">
          <div className="pf-note" {...ndDau('hs.ns.hoi')}>{nd('hs.ns.hoi', { ngay: hienNgaySinh(v) })}</div>
          <div className="hq-btns"><button type="button" className="hq-b" disabled={s.dang} onClick={gui} {...ndDau('hs.ns.luu')}>{nd('hs.ns.luu')}</button><button type="button" className="hq-b ghost" onClick={() => datHoi(false)} {...ndDau('hs.ns.suaLai')}>{nd('hs.ns.suaLai')}</button></div>
        </div>
      ) : (
        <>
          <div className="pf-row">
            <Chu k="hs.ns.nhan" as="label" htmlFor="ngay-sinh" />
            <input id="ngay-sinh" type="date" max={homNay} value={v} onChange={(e) => { datV(e.target.value); s.boXong(); }} />
            <Chu k="hs.ns.goiY" as="small" />
          </div>
          <div className="hq-btns"><button type="button" className="hq-b" disabled={s.dang || !hopLe} onClick={() => datHoi(true)} {...ndDau('hs.ns.luu')}>{nd('hs.ns.luu')}</button></div>
        </>
      )}
      <Bao s={s} chu="hs.ns.daLuu" />
    </div>
  );
}

function DiaChi({ ho, doi }) {
  const [dc, datDc] = useState(ho.dia_chi || '');
  const s = dungLuu((khach) => { datDc(khach.dia_chi || ''); doi(khach); });
  return (
    <div className="card pf-card">
      <Chu k="hs.dc.t" as="div" className="tt" />
      <div className="pf-row">
        <Chu k="hs.dc.nhan" as="label" htmlFor="dia-chi-toi" />
        <input id="dia-chi-toi" autoComplete="street-address" maxLength={DIA_CHI_TOI_DA} {...ndDau('hs.khach')} value={dc} onChange={(e) => { datDc(e.target.value); s.boXong(); }} />
        <Chu k="hs.dc.goiY" as="small" />
      </div>
      <div className="hq-btns"><button type="button" className="hq-b" disabled={s.dang} onClick={() => s.luu({ dia_chi: dc.trim() })} {...ndDau('hs.dc.nut')}>{nd('hs.dc.nut')}</button></div>
      <Bao s={s} chu="hs.dc.daLuu" />
    </div>
  );
}

export default function HoSo({ lui }) {
  const tai = dungCua(cuaToi, { that: true }); // ô sửa cần hồ sơ thật (sdt, địa chỉ): bản tóm tắt trên máy không đủ
  const [moPin, datMoPin] = useState(false);
  const doi = (k) => gopToi(cuaToi, k); // hồ sơ POS vừa trả → gộp vào kho chung: thẻ xem trước, Trang chủ, Tài khoản đổi theo, không gọi lại
  return (
    <Man id="profile">
      <DauManCon canTrai tieuDe={nd('hs.tieuDe')} phu={nd('hs.phu')} lui={lui} />
      <TrangTai tai={tai}>
        {({ khach: ho }) => (
          <>
            <XungHo ho={ho} doi={doi} />
            <SuaTen ho={ho} doi={doi} />
            <NgaySinh ho={ho} doi={doi} />
            <DiaChi ho={ho} doi={doi} />
            <div className="card pf-card">
              <Chu k="hs.bm.t" as="div" className="tt" />
              <div className="pf-link" role="button" tabIndex={0} onClick={() => datMoPin(true)} onKeyDown={(e) => { if (e.key === 'Enter') datMoPin(true); }}>
                <Ico ten="card" s={16} /> <span><Chu k="hs.pin.t" /><Chu k="hs.pin.phu" as="small" /></span><Chu k="hs.pin.nut" as="b" />
              </div>
              <Chu k="hs.pin.ghiChu" as="div" className="pf-note" />
            </div>
          </>
        )}
      </TrangTai>
      {moPin && <PinSheet dong={() => datMoPin(false)} />}
    </Man>
  );
}
