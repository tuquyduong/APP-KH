import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DL } from '../noiDung/theChat.js';
import { CAU_HOI as CHU } from '../noiDung/tracNghiemChu.js';
import Man from '../components/Man.jsx';

const GIAY_CHUYEN_CAU = 170; // demo tcPick: tô đáp án rồi sang câu sau sau ngần này mili giây
const GIAY_MOI_CAU = 7.5;    // demo: ước lượng 7,5 giây một câu cho dòng "còn khoảng N phút"

// Hỏi xác nhận khi thoát giữa chừng (bảng đáy như .sheet của demo).
function HoiThoat({ thoat, o }) {
  return createPortal(
    <div className="sheet show" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) o(); }}>
      <div className="panel" role="dialog" aria-modal="true" aria-label={CHU.thoatTieuDe}>
        <h3 style={{ textAlign: 'center' }}>{CHU.thoatTieuDe}</h3>
        <div className="pin-sub">{CHU.thoatPhu}</div>
        <button type="button" className="checkout-btn giua" onClick={o}>{CHU.thoatO}</button>
        <button type="button" className="ghost-btn" onClick={thoat}>{CHU.thoatDi}</button>
      </div>
    </div>,
    document.querySelector('.phone') || document.body,
  );
}

// Màn câu hỏi (demo `tcq`): thanh tiến độ, 4 mức A–D, quay lại câu trước; "Hai câu cuối" = kiểm tra chéo nóng / lạnh + tình trạng đặc biệt theo giới.
// Bấm quay lại ở câu đầu → hỏi xác nhận rồi thoát (bài chưa làm xong không được lưu).
export default function TracNghiemLam({ tn, thoat, xemKetQua }) {
  const b = tn.bai;
  const [hoi, datHoi] = useState(false);
  const cho = useRef(null);
  useEffect(() => () => clearTimeout(cho.current), []);
  if (!b) return null;

  const n = b.ds.length;
  const quayLai = () => { if (!tn.lui()) { if (b.tra.some((x) => x !== null)) datHoi(true); else thoat(); } };
  const chon = (v) => {
    if (cho.current) return;
    tn.chon(v);
    cho.current = setTimeout(() => { cho.current = null; tn.tiep(); }, GIAY_CHUYEN_CAU);
  };
  const q = b.ds[b.i];
  const con = Math.max(1, Math.round((n - b.i) * GIAY_MOI_CAU / 60));
  const tuaDe = b.cuoi ? CHU.cuoi : `Câu ${b.i + 1}/${n}`;
  const tienDo = b.cuoi ? 100 : Math.round(b.i / n * 100);

  return (
    <Man id="tcq">
      <div className="topbar trai">
        <button type="button" className="back-btn" aria-label="Quay lại" onClick={quayLai}><svg className="ico" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-back" /></svg></button>
        <div style={{ flex: 1 }}><h1>{tuaDe}</h1><div className="tcq-bar"><i style={{ width: `${tienDo}%` }} /></div></div>
      </div>
      {b.cuoi ? (
        <>
          <div className="tcq-card safe"><div className="k">{CHU.kiemTraCheo}</div><div className="q">{CHU.hoiKhiHau}</div></div>
          <div className="tcq-opts">
            {CHU.khiHau.map(([v, nhan]) => <button type="button" key={v} className={`tc-opt${b.khiHau === v ? ' on' : ''}`} aria-pressed={b.khiHau === v} onClick={() => tn.datKhiHau(v)}><i className="rd" />{nhan}</button>)}
            <div className="tcq-card safe" style={{ marginTop: 14, minHeight: 0 }}><div className="k">{CHU.cauAnToan}</div><div className="q" style={{ fontSize: 16 }}>{CHU.hoiAnToan}</div><div className="tcq-sub">{CHU.chuAnToan}</div></div>
            {DL.safetyChecklist[b.gioiTinh].map((t) => {
              const bat = b.anToan.includes(t);
              return <button type="button" key={t} className={`tc-opt chkopt${bat ? ' on' : ''}`} aria-pressed={bat} onClick={() => tn.batTatAnToan(t)}><i className="cb">{bat ? '✓' : ''}</i>{t}</button>;
            })}
            <button type="button" className="checkout-btn giua" onClick={() => { tn.xong(); xemKetQua(); }}>{CHU.xemKetQua}</button>
          </div>
        </>
      ) : (
        <>
          <div className="tcq-card">
            <div className="k">{CHU.ba}{q.only && <> · <span className="tag-sex">{q.only === 'nu' ? CHU.danhChoNu : CHU.danhChoNam}</span></>}<span className="tleft2">còn khoảng {con} phút</span></div>
            <div className="q">{q.text}</div>
          </div>
          <div className="tcq-opts">
            {q.options.map((o) => (
              <button type="button" key={o.value} className={`tc-opt abcd${b.tra[b.i] === o.value ? ' on' : ''}`} aria-pressed={b.tra[b.i] === o.value} onClick={() => chon(o.value)}><i className="let">{o.label}</i><span className="ot">{o.text}</span></button>
            ))}
          </div>
          <div className="care-disclaimer" style={{ textAlign: 'center', marginTop: 14 }}>{CHU.luuY}</div>
        </>
      )}
      {hoi && <HoiThoat o={() => datHoi(false)} thoat={() => { datHoi(false); thoat(); }} />}
    </Man>
  );
}
